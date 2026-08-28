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
import pathlib, base64, hashlib, json, shutil, zipfile

VERSION = '2.0'

d = pathlib.Path(__file__).resolve().parent
shell = (d / 'shell.html').read_text()
bundle = (d / 'bundle.js').read_text()
src = (d / 'src' / 'main.js').read_text()
chapter = (d / 'src' / 'chapters' / 'ch1.js').read_text()

want_amulet = 'SHOW_AMULET = true' in src

# every heavy file the game can ask for: key -> (source file, wanted)
ASSETS = {
    'hands':  ('vrhands_fixed.glb', True),
    'ghost':  ('ghost.glb', True),
    'hdb':    ('hdb.glb', True),
    'logo':   ('assets/logo.webp', True),
    'music':  ('assets/music.mp3', True),
    'voice':  ('assets/voice.mp3', True),
    'amulet': ('amulet.glb', want_amulet),
}

assert '/*BUNDLE*/' in shell, 'placeholder missing from shell.html'
for key in ASSETS:
    assert f'__{key.upper()}_B64__' in bundle, f'__{key.upper()}_B64__ missing from bundle'
assert '__ASSET_MAP_B64__' in bundle, '__ASSET_MAP_B64__ missing from bundle'

guard = lambda js: js.replace('</script', '<\\/script')   # an inline </script> ends the tag early

# ---------------------------------------------------------------- embedded
emb = bundle.replace('__ASSET_MAP_B64__',
                     base64.b64encode(b'{}').decode())    # empty map = embedded mode
for key, (name, wanted) in ASSETS.items():
    data = base64.b64encode((d / name).read_bytes()).decode() if wanted else ''
    emb = emb.replace(f'__{key.upper()}_B64__', data)
    print(f'  embed {name}: {str(len(data) // 1024) + " KB" if wanted else "skipped"}')
single = shell.replace('<script>/*BUNDLE*/</script>',
                       '<script>\n' + guard(chapter) + '\n' + guard(emb) + '\n</script>')
p = d / 'hellnote.html'
p.write_text(single)
print(f'wrote {p} {p.stat().st_size / 1024:.0f} KB')

# ------------------------------------------------------------------ hosted
dist = d / 'dist'
shutil.rmtree(dist, ignore_errors=True)
(dist / 'assets').mkdir(parents=True)
(dist / 'chapters').mkdir()

# copy each asset under a name derived from its content, so the URL changes
# exactly when the bytes do — that is what makes the year-long cache safe
asset_map = {}
for key, (name, wanted) in ASSETS.items():
    if not wanted:
        continue
    body = (d / name).read_bytes()
    tag = hashlib.md5(body).hexdigest()[:10]
    ext = pathlib.Path(name).suffix
    out = f'assets/{key}.{tag}{ext}'
    (dist / out).write_bytes(body)
    asset_map[key] = out

hosted = bundle.replace('__ASSET_MAP_B64__',
                        base64.b64encode(json.dumps(asset_map).encode()).decode())
for key in ASSETS:                                        # no bytes ride along
    hosted = hosted.replace(f'__{key.upper()}_B64__', '')
(dist / 'game.js').write_text(hosted)
(dist / 'chapters' / 'ch1.js').write_text(chapter)
(dist / 'index.html').write_text(shell.replace(
    '<script>/*BUNDLE*/</script>',
    '<script defer src="chapters/ch1.js"></script>\n<script defer src="game.js"></script>'))

# fingerprinted files may be cached forever; the page, engine and chapter use
# Netlify's default etag revalidation so an update reaches players at once
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
