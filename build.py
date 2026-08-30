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

VERSION = '3.6'

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

# every generated sound (assets/audio/*.mp3, already re-encoded per the
# CLAUDE.md audio contract) rides as ONE pack asset: {name: base64-mp3}.
# Adding a sound to the game = dropping a file in assets/audio/.
audio_dir = d / 'assets' / 'audio'
audio_dir.mkdir(parents=True, exist_ok=True)
pack = {p.stem: base64.b64encode(p.read_bytes()).decode()
        for p in sorted(audio_dir.glob('*.mp3'))}
(d / 'assets' / 'audiopack.json').write_text(json.dumps(pack))
print(f'  audiopack: {len(pack)} sounds, '
      f'{(d / "assets" / "audiopack.json").stat().st_size // 1024} KB')

# every heavy file the game can ask for: key -> (source file, wanted, preload)
# `preload` means "start it before the engine has even parsed" — true for the
# things the first frame needs, false for sound, which the engine pulls itself
# at low priority so it never competes with the models.
ASSETS = {
    'hands':  ('vrhands_fixed.glb', True, True),
    'ghost':  ('ghost.glb', True, True),
    'hdb':    ('hdb.glb', True, True),
    'logo':   ('assets/logo.webp', True, True),
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

# What the ENGINE uses, whatever chapter is playing: the player's hands, the
# ghost, the logo, the music bed, the sound pack. Everything else belongs to
# whichever chapter names it in its own `assets:` list — and only the booting
# chapter's files are preloaded, so chapter 7's location never slows down
# chapter 1's first paint.
SHARED_ASSETS = {'hands', 'ghost', 'logo', 'music', 'audiopack',
                 'titlevid', 'titlevidwebm'}


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
