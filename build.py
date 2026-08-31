"""One source, two builds.

HOSTED  -> dist/            what actually ships to Netlify: a small page, the
                            engine, the chapter file, and every heavy asset as
                            its own fingerprinted file the browser caches for
                            a year. Zipped ready to drag onto the Deploys page.

EMBEDDED -> hellnote.html   the whole game in a single file, bytes inlined —
                            for the claude.ai preview link (whose sandbox can't
                            fetch) and as the anywhere-fallback. wrap.py then
                            mirrors it into wrapped.html for the harnesses.

The engine never knows which build it is in: build.py either fills the
__ASSET_MAP_B64__ token with real URLs (hosted) or fills the EMBED tokens with
base64 bytes (embedded). assetBytes() in main.js is the seam.
"""
import pathlib, base64, hashlib, json, re, shutil, zipfile

VERSION = '4.4'

d = pathlib.Path(__file__).resolve().parent
shell = (d / 'shell.html').read_text()
bundle = (d / 'bundle.js').read_text()
src = (d / 'src' / 'main.js').read_text()

# Every chapter in src/chapters/, discovered rather than listed: adding a
# chapter is dropping a file in that folder. They are small plain scripts
# and every one is shipped, because advancing a chapter must not cost a
# page load — the engine calls the next chapter's build() in place.
chap_dir = d / 'src' / 'chapters'
chapters = {p.stem: p.read_text() for p in sorted(chap_dir.glob('*.js'))}
assert chapters, 'no chapters found in src/chapters/'
BOOT = 'ch1'          # the chapter a bare URL starts on; must match main.js
assert BOOT in chapters, f'{BOOT}.js is missing — the engine falls back to it'
strings = (d / 'src' / 'strings.js').read_text()   # every UI word, loaded first

want_amulet = 'SHOW_AMULET = true' in src

# ------------------------------------------------------------ the sound packs
# Every generated sound rides as a JSON pack, {name: base64}. Until v4.2 there
# was exactly ONE, and that is the thing this section exists to undo: every
# player downloaded every chapter's sounds, so chapter 3's twenty-three landed
# on people who never leave chapter 1, and the first download grew with the
# game. It is now SPLIT — a shared pack plus one per chapter — and the split is
# COMPUTED, never declared, because adding a chapter must stay "drop a file in
# a folder" (the same law that shapes chapter_assets below).
#
# A sound belongs to a CHAPTER when exactly one chapter can ask for it and the
# engine never does. Everything else is SHARED. The bias is deliberate and it
# is not symmetric: a sound wrongly left in the shared pack costs a few KB,
# and a sound wrongly moved out of it is a cue that silently never plays —
# which is precisely the failure CLAUDE.md warns no screenshot can catch. So
# anything the analysis cannot positively attribute stays shared.
#
# Two things are read out of main.js rather than duplicated here:
#   * STING_SAMPLE, which maps a cue KIND to the sample behind it — a scene
#     says sfx(t, 'gong'), not 'gong.mp3', so the table is how a cue becomes
#     a file. The table itself is only a VOCABULARY: a row in it proves the
#     kind exists, not that anyone uses it, so it is excluded from the scan
#     for what the engine itself plays.
#   * packWarm([...]) lists, excluded for the same reason — they are decode
#     HINTS. Warming a name whose pack is not loaded is a no-op, so a stale
#     hint (the floor lists still name chapter 2's sounds) must not pin a
#     sound into the shared pack forever.
def _brace_span(text, pat):
    m = re.search(pat, text)
    assert m, f'{pat} not found in main.js'
    i = text.index('{', m.start())
    depth = 0
    for j in range(i, len(text)):
        if text[j] == '{':
            depth += 1
        elif text[j] == '}':
            depth -= 1
            if depth == 0:
                return m.start(), j + 1
    raise AssertionError(f'{pat}: unbalanced braces')


_ta, _tb = _brace_span(src, r"const STING_SAMPLE\s*=\s*\{")
KIND_SAMPLE = dict(re.findall(r"(\w+)\s*:\s*\[\s*'([a-z0-9_]+)'", src[_ta:_tb]))
_engine_src = re.sub(r"packWarm\(\[[^\]]*\]", "packWarm([", src[:_ta] + src[_tb:], flags=re.S)

audio_dir = d / 'assets' / 'audio'          # the mp3s, exactly as they shipped
opus_dir = d / 'assets' / 'audio-opus'      # the same sounds, smaller
audio_dir.mkdir(parents=True, exist_ok=True)
SOUNDS = sorted(p.stem for p in audio_dir.glob('*.mp3'))
assert SOUNDS, 'no sounds found in assets/audio/'


def chapter_sounds(key):
    """Every sound a chapter can ask for, read out of its own source."""
    t = chapters[key]
    names = set()
    for kind in re.findall(r"\bsfx\(\s*[^,)]+,\s*'([A-Za-z0-9_]+)'", t):
        if kind == 'step':                  # routed to the footstep rotation
            names |= {'step1', 'step2', 'step3', 'step4'}
        elif kind in KIND_SAMPLE:
            names.add(KIND_SAMPLE[kind])
    m = re.search(r"sayPrefix:\s*'(\w+)'", t)
    prefix = m.group(1) if m else 'v'
    names |= {prefix + k for k in re.findall(r"\bk:\s*'([A-D])'", t)}
    # and the catch-all: any sound named outright — ambience beds, the two
    # proximity lines, voiceLine, anything a later chapter invents.
    names |= {s for s in SOUNDS if re.search(r"'%s'" % re.escape(s), t)}
    return names & set(SOUNDS)


_engine_sounds = {s for s in SOUNDS if re.search(r"'%s'" % re.escape(s), _engine_src)}
_askers = {}
for _k in chapters:
    for _n in chapter_sounds(_k):
        _askers.setdefault(_n, set()).add(_k)
PACK_OF = {k: sorted(n for n in SOUNDS
                     if _askers.get(n) == {k} and n not in _engine_sounds)
           for k in chapters}
PACK_OF = {k: v for k, v in PACK_OF.items() if v}          # no empty packs
SHARED_SOUNDS = sorted(set(SOUNDS) - {n for v in PACK_OF.values() for n in v})

_owned = [n for v in PACK_OF.values() for n in v]
assert len(_owned) == len(set(_owned)), 'a sound was claimed by two chapters'
assert set(SHARED_SOUNDS) | set(_owned) == set(SOUNDS), 'a sound reached no pack'
# The two ways the split could go wrong, both fatal to the build rather than
# silent in the game. Neither can happen while the rule above holds — a sound
# is only moved out of the shared pack when exactly one chapter asks for it —
# but "provably true today" is how a rule rots, and the symptom of getting it
# wrong is a cue that plays nothing with no error anywhere.
for _k in chapters:
    _reach = set(SHARED_SOUNDS) | set(PACK_OF.get(_k, []))
    _lost = sorted(chapter_sounds(_k) - _reach)
    assert not _lost, f'{_k}: cues no pack it loads would carry: {", ".join(_lost)}'
_stranded = sorted(_engine_sounds - set(SHARED_SOUNDS))
assert not _stranded, ('the engine plays these but they left the shared pack: '
                       + ', '.join(_stranded))

_missing = [n for n in SOUNDS if not (opus_dir / f'{n}.ogg').exists()]
assert not _missing, f'no opus encode for: {", ".join(_missing)}'
_extra = [p.stem for p in opus_dir.glob('*.ogg') if p.stem not in set(SOUNDS)]
assert not _extra, f'opus encode with no mp3: {", ".join(_extra)}'


def write_pack(stem, names, folder, ext):
    body = {n: base64.b64encode((folder / f'{n}{ext}').read_bytes()).decode()
            for n in names}
    out = d / 'assets' / f'{stem}.json'
    out.write_text(json.dumps(body))
    return out.stat().st_size


# the embedded single-file build keeps ONE pack of every mp3: it is the
# offline fallback, it has no download to save, and mp3 is the encoding every
# browser can decode.
_all_kb = write_pack('audiopack-all', SOUNDS, audio_dir, '.mp3') // 1024
_sh_mp3 = write_pack('audiopack', SHARED_SOUNDS, audio_dir, '.mp3') // 1024
_sh_opus = write_pack('opuspack', SHARED_SOUNDS, opus_dir, '.ogg') // 1024
print(f'  sound packs: {len(SOUNDS)} sounds, {len(SHARED_SOUNDS)} shared '
      f'({_sh_mp3} KB mp3 / {_sh_opus} KB opus)')
for _k in sorted(PACK_OF):
    _m = write_pack(f'audiopack_{_k}', PACK_OF[_k], audio_dir, '.mp3') // 1024
    _o = write_pack(f'opuspack_{_k}', PACK_OF[_k], opus_dir, '.ogg') // 1024
    print(f'    {_k}: {len(PACK_OF[_k])} sounds ({_m} KB mp3 / {_o} KB opus)')

# every heavy file the game can ask for: key -> (source file, wanted, preload)
# `preload` means "start it before the engine has even parsed" — true for the
# things the first frame needs, false for sound, which the engine pulls itself
# at low priority so it never competes with the models.
ASSETS = {
    'hands':  ('arms.glb', True, True),
    'ghost':  ('ghost.glb', True, True),
    'hdb':    ('hdb.glb', True, True),
    'logo':   ('assets/logo.webp', True, True),
    # the real hell-note art. Not preloaded: the chapter builds with the
    # drawn note straight away and swaps this in when it lands, so a
    # 330 KB image is never on the first frame's critical path.
    'hellnote': ('assets/hellnote.webp', True, False),
    'music':  ('assets/music.mp3', True, False),
    'voice':  ('assets/voice.mp3', True, False),
    'audiopack': ('assets/audiopack.json', True, False),
    # two encodes of the same clip; the browser takes the first it can play.
    # VP9 is smaller and is what Chrome, Firefox and Edge get (and what the
    # test Chromium can decode at all — Playwright's build ships without the
    # proprietary codecs). H.264 is the Safari and iOS fallback.
    'titlevidwebm': ('assets/titlevid.webm', True, False),
    'titlevid': ('assets/titlevid.mp4', True, False),
    'amulet': ('amulet.glb', want_amulet, False),
}

# Hosted-only assets: shipped as a URL, never inlined as base64.
#
# The title video is the one asset the engine reaches by URL rather than by
# bytes, because a <video> can only be fed bytes through a blob: or data: URL
# and the strict CSP that shaped every other loader forbids both. The
# single-file build carries no URLs, so it simply has no title video — which
# is correct for decoration in an offline fallback, and keeps a megabyte of
# H.264 out of a file that is already 15 MB.
HOSTED_ONLY = {'titlevid', 'titlevidwebm'}

# The split packs are hosted-only: there is no __..._B64__ token for them and
# there must not be, because how many there are depends on how many chapters
# exist. The embedded build carries the one full mp3 pack instead, which is
# why `audiopack` alone needs its embedded bytes to come from a DIFFERENT file
# than its hosted ones — shared-only when fetched, everything when inlined.
EMBED_SRC = {'audiopack': 'assets/audiopack-all.json'}
for _k in sorted(PACK_OF):
    ASSETS[f'audiopack_{_k}'] = (f'assets/audiopack_{_k}.json', True, False)
    ASSETS[f'opuspack_{_k}'] = (f'assets/opuspack_{_k}.json', True, False)
    HOSTED_ONLY |= {f'audiopack_{_k}', f'opuspack_{_k}'}
ASSETS['opuspack'] = ('assets/opuspack.json', True, False)
HOSTED_ONLY.add('opuspack')
PACK_KEYS = {k for k in ASSETS if k.endswith('pack') or 'pack_' in k}

# What the ENGINE uses, whatever chapter is playing: the player's hands, the
# ghost, the logo, the music bed, the sound pack. Everything else belongs to
# whichever chapter names it in its own `assets:` list — and only the booting
# chapter's files are preloaded, so chapter 7's location never slows down
# chapter 1's first paint.
SHARED_ASSETS = {'hands', 'ghost', 'logo', 'music', 'audiopack',
                 'titlevid', 'titlevidwebm'} | PACK_KEYS


def chapter_assets(key):
    """The asset keys a chapter file claims, read out of its own source."""
    m = re.search(r"assets:\s*\[([^\]]*)\]", chapters[key])
    assert m, f'{key}.js has no assets: [...] list'
    return [a for a in re.findall(r"'([a-z0-9_]+)'", m.group(1))]


_claimed = {a for k in chapters for a in chapter_assets(k)}
for key in ASSETS:
    if key in SHARED_ASSETS or key in _claimed or not ASSETS[key][1]:
        continue
    print(f'  note: asset {key!r} is shipped but no chapter claims it')

assert '/*BUNDLE*/' in shell, 'placeholder missing from shell.html'
for key in ASSETS:
    if key in HOSTED_ONLY:          # reached by URL, so it has no embed token
        continue
    assert f'__{key.upper()}_B64__' in bundle, f'__{key.upper()}_B64__ missing from bundle'
assert '__ASSET_MAP_B64__' in bundle, '__ASSET_MAP_B64__ missing from bundle'

bundle = bundle.replace('__VERSION__', VERSION)   # the number shown under Credits

guard = lambda js: js.replace('</script', '<\\/script')   # an inline </script> ends the tag early

# ---------------------------------------------------------------- embedded
emb = bundle.replace('__ASSET_MAP_B64__',
                     base64.b64encode(b'{}').decode())    # empty map = embedded mode
for key, (name, wanted, _pre) in ASSETS.items():
    if key in HOSTED_ONLY:
        print(f'  embed {name}: hosted only, not inlined')
        continue
    name = EMBED_SRC.get(key, name)
    data = base64.b64encode((d / name).read_bytes()).decode() if wanted else ''
    emb = emb.replace(f'__{key.upper()}_B64__', data)
    print(f'  embed {name}: {str(len(data) // 1024) + " KB" if wanted else "skipped"}')
all_chapters = '\n'.join(guard(t) for t in chapters.values())
single = shell.replace('<script>/*BUNDLE*/</script>',
                       '<script>\n' + guard(strings) + '\n' + all_chapters
                       + '\n' + guard(emb) + '\n</script>')
p = d / 'hellnote.html'
p.write_text(single)
print(f'wrote {p} {p.stat().st_size / 1024:.0f} KB')

# ------------------------------------------------------------------ hosted
dist = d / 'dist'
shutil.rmtree(dist, ignore_errors=True)
(dist / 'assets').mkdir(parents=True)

# every file except index.html goes under assets/ named by its content hash,
# so the URL changes exactly when the bytes do — that is what makes the
# year-long cache safe, and it leaves index.html as the ONE file a returning
# visitor ever has to revalidate
asset_map = {}
for key, (name, wanted, _pre) in ASSETS.items():
    if not wanted:
        continue
    body = (d / name).read_bytes()
    tag = hashlib.md5(body).hexdigest()[:10]
    out = f'assets/{key}.{tag}{pathlib.Path(name).suffix}'
    (dist / out).write_bytes(body)
    asset_map[key] = out

hosted = bundle.replace('__ASSET_MAP_B64__',
                        base64.b64encode(json.dumps(asset_map).encode()).decode())
for key in ASSETS:                                        # no bytes ride along
    hosted = hosted.replace(f'__{key.upper()}_B64__', '')

st_out = f'assets/strings.{hashlib.md5(strings.encode()).hexdigest()[:10]}.js'
(dist / st_out).write_text(strings)
# one hashed file per chapter, the boot chapter first so it parses first
ch_outs = []
for key in sorted(chapters, key=lambda k: (k != BOOT, k)):
    text = chapters[key]
    out = f'assets/{key}.{hashlib.md5(text.encode()).hexdigest()[:10]}.js'
    (dist / out).write_text(text)
    ch_outs.append(out)
js_out = f'assets/game.{hashlib.md5(hosted.encode()).hexdigest()[:10]}.js'
(dist / js_out).write_text(hosted)

# A real document, unlike the wrapped preview: without the doctype the page
# renders in quirks mode. Preloads start the title logo (it IS the first
# paint, so it goes high) and the three world models downloading before the
# engine has even parsed; `as="fetch" crossorigin` matches the engine's own
# fetch() so the browser hands over the preloaded bytes instead of fetching
# twice — hostedtest asserts exactly one request per asset. Sounds are NOT
# preloaded: the engine pulls them itself at priority low.
#
# Only the SHARED assets and the BOOT chapter's own are preloaded. That is
# the whole point of a chapter naming its assets: chapter 7's location model
# must not be on chapter 1's critical path.
boot_assets = set(chapter_assets(BOOT))
preload_keys = [k for k, (_n, wanted, pre) in ASSETS.items()
                if wanted and pre and k != 'logo'
                and (k in SHARED_ASSETS or k in boot_assets)]
preloads = ['<link rel="preload" as="fetch" crossorigin fetchpriority="high" '
            f'href="{asset_map["logo"]}">']
preloads += [f'<link rel="preload" as="fetch" crossorigin href="{asset_map[k]}">'
             for k in preload_keys]
print(f'  preload for {BOOT}: logo + {", ".join(preload_keys)}'
      f'  (skipped: {", ".join(sorted(set(asset_map) - set(preload_keys) - {"logo"})) or "none"})')
(dist / 'index.html').write_text(
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1,'
    'maximum-scale=1,viewport-fit=cover">\n'
    + '\n'.join(preloads) + '\n</head>\n<body>\n'
    + shell.replace('<script>/*BUNDLE*/</script>',
                    f'<script defer src="{st_out}"></script>\n'
                    + ''.join(f'<script defer src="{c}"></script>\n' for c in ch_outs)
                    + f'<script defer src="{js_out}"></script>')
    + '\n</body>\n</html>\n')

# fingerprinted files may be cached forever; index.html rides Netlify's
# default etag revalidation so an update reaches players at once
(dist / '_headers').write_text(
    '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n')

zip_path = d / f'masterz-encounters-v{VERSION}.zip'
zip_path.unlink(missing_ok=True)
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(dist.rglob('*')):
        if f.is_file():
            z.write(f, f.relative_to(dist))
total = sum(f.stat().st_size for f in dist.rglob('*') if f.is_file())
print(f'wrote dist/ ({total / 1024:.0f} KB in {sum(1 for f in dist.rglob("*") if f.is_file())} files) '
      f'and {zip_path.name} ({zip_path.stat().st_size / 1024:.0f} KB)')
