#!/usr/bin/env python3
"""tools/netlifydeploy.py — deploy dist/ to Netlify through the MCP's proxy WITHOUT uploading the whole site (v24.20).

Why (30 Oct 2026). The Netlify MCP's deploy zips the directory and POSTs it to Netlify's build system, and that upload
has a ceiling: v24.19's site (621,084,338 bytes unpacked, a 559.6 MB zip) went through and v24.20's (629,336,641 bytes,
567.5 MB) was refused with a bare 500 five times running — the line sits between them, next to 600 MiB (629,145,600).
Chad: "You need to find a way since obviously the size will one day go way past this". The proxy will only take that one
call (POST .../builds) and read a deploy (GET .../deploys/:id) — a digest deploy, the CLI's way, is refused (403) — but
what it uploads is a SOURCE tree that Netlify then BUILDS. So the upload carries only what changed, and the build puts the
rest back:

  - every file of dist/ goes in a manifest with its sha1;
  - a file whose path the LIVE site already serves with the same bytes is CARRIED (the asset names are content hashes, and
    the build re-checks every byte anyway); anything else — a new or changed file, index.html, _headers — is SENT inside
    the zip;
  - the zip's netlify.toml runs _deploy/rebuild.py in Netlify's build, which lays out the site: sent files from the zip,
    carried files from the build cache (by sha1) or else downloaded from the deploy being replaced, EVERY file checked
    against its sha1, the count checked against the manifest. One mismatch and the build fails — nothing is published and
    the site stays exactly as it was;
  - and Netlify publishes the result.

The upload is the size of the change, whatever the size of the game. The proxy URL is a 30-minute credential handed out
by the MCP's deploy-site tool: it is an argument, never written to a file.

  python3 tools/netlifydeploy.py <dist> <proxyUrl> <siteId> [--live https://masterz-encounters-game.netlify.app] [--dry]
"""
import hashlib, http.client, io, json, os, sys, time, urllib.error, urllib.parse, urllib.request, uuid, zipfile

args = [a for a in sys.argv[1:] if not a.startswith('--')]
DIST, PROXY, SITE = args[0], args[1].rstrip('/'), args[2]
LIVE = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--live=')), 'https://masterz-encounters-game.netlify.app').rstrip('/')
DRY = '--dry' in sys.argv

def sha1(p):
    h = hashlib.sha1()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()

files = {}
for root, _, names in os.walk(DIST):
    for n in names:
        p = os.path.join(root, n); rel = os.path.relpath(p, DIST).replace(os.sep, '/')
        files[rel] = {'sha1': sha1(p), 'size': os.path.getsize(p)}
print(f'{len(files)} files, {sum(f["size"] for f in files.values()) / 1e6:.1f} MB in {DIST}', flush=True)

# which files the live site already serves, byte for byte: only content-hashed assets are candidates (a name that
# carries its own hash cannot hold other bytes); each is HEADed for its length, and the build re-checks the sha1
def live_has(rel, size):
    try:
        req = urllib.request.Request(LIVE + '/' + urllib.parse.quote(rel), method='HEAD', headers={'User-Agent': 'encounters-deploy'})
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status == 200 and int(r.headers.get('Content-Length') or -1) == size
    except Exception:
        return False
import re
HASHED = re.compile(r'^assets/.+\.[0-9a-f]{10}\.[A-Za-z0-9]+$')
carry, send = [], []
for rel, f in sorted(files.items()):
    (carry if HASHED.match(rel) and live_has(rel, f['size']) else send).append(rel)
sent_bytes = sum(files[r]['size'] for r in send)
print(f'carry {len(carry)} from the live site, send {len(send)} ({sent_bytes / 1e6:.1f} MB):', flush=True)
for r in send: print('   send', r, files[r]['size'], flush=True)

REBUILD = r'''# _deploy/rebuild.py — runs in Netlify's build (tools/netlifydeploy.py wrote it): lays out _site from the files sent in
# this zip and the files carried from the deploy being replaced, every byte checked against the manifest
import hashlib, json, os, shutil, sys, urllib.parse, urllib.request
M = json.load(open('_deploy/manifest.json'))
OUT = '_site'; os.makedirs(OUT, exist_ok=True)
CACHE = os.path.join(os.environ.get('NETLIFY_CACHE_DIR') or '/opt/build/cache', 'encounters-assets')
try: os.makedirs(CACHE, exist_ok=True)
except Exception: CACHE = None
def sha1b(b): return hashlib.sha1(b).hexdigest()
got = {'sent': 0, 'cache': 0, 'live': 0}
for rel, f in M['files'].items():
    dst = os.path.join(OUT, rel); os.makedirs(os.path.dirname(dst) or '.', exist_ok=True)
    if f['how'] == 'send':
        b = open(os.path.join('_deploy/send', rel), 'rb').read(); how = 'sent'
    else:
        b = None; cp = CACHE and os.path.join(CACHE, f['sha1'])
        if cp and os.path.exists(cp):
            b = open(cp, 'rb').read(); how = 'cache'
            if sha1b(b) != f['sha1']: b = None
        if b is None:
            for attempt in range(4):
                try:
                    with urllib.request.urlopen(urllib.request.Request(M['live'] + '/' + urllib.parse.quote(rel), headers={'User-Agent': 'encounters-rebuild'}), timeout=300) as r: b = r.read()
                    if sha1b(b) == f['sha1']: break
                    print('sha1 mismatch on', rel, 'attempt', attempt, flush=True); b = None
                except Exception as e:
                    print('fetch failed', rel, e, flush=True); b = None
            how = 'live'
            if b is not None and cp:
                try: open(cp, 'wb').write(b)
                except Exception: pass
    if b is None or sha1b(b) != f['sha1']:
        print('FAILED', rel, flush=True); sys.exit(1)
    open(dst, 'wb').write(b); got[how] += 1
n = sum(len(fs) for _, _, fs in os.walk(OUT))
if n != len(M['files']): print('FAILED: _site holds', n, 'files, the manifest', len(M['files']), flush=True); sys.exit(1)
print('rebuilt', n, 'files:', got, flush=True)
'''
TOML = '[build]\n  command = "python3 _deploy/rebuild.py"\n  publish = "_site"\n'

manifest = {'live': LIVE, 'files': {rel: {'sha1': f['sha1'], 'size': f['size'], 'how': 'send' if rel in send else 'carry'} for rel, f in files.items()}}
buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    z.writestr('netlify.toml', TOML)
    z.writestr('_deploy/rebuild.py', REBUILD)
    z.writestr('_deploy/manifest.json', json.dumps(manifest))
    for rel in send: z.write(os.path.join(DIST, rel), '_deploy/send/' + rel)
zipb = buf.getvalue()
print(f'zip {len(zipb) / 1e6:.2f} MB', flush=True)
if DRY: sys.exit(0)

u = urllib.parse.urlparse(PROXY + f'/api/v1/sites/{SITE}/builds')
bnd = '----NetlifyFormBoundary' + uuid.uuid4().hex
body = (f'--{bnd}\r\nContent-Disposition: form-data; name="zip"; filename="deploy-{int(time.time() * 1000)}.zip"\r\n'
        f'Content-Type: application/zip\r\n\r\n').encode() + zipb + f'\r\n--{bnd}--\r\n'.encode()
c = http.client.HTTPSConnection(u.netloc, timeout=1800)
c.request('POST', u.path, body, {'Content-Type': f'multipart/form-data; boundary={bnd}', 'Content-Length': str(len(body)), 'User-Agent': 'netlify-mcp'})
r = c.getresponse(); rb = r.read()
print('build request', r.status, r.reason, flush=True)
if r.status >= 300: print(rb[:500], flush=True); sys.exit(1)
d = json.loads(rb); d = d[0] if isinstance(d, list) else d
did = d.get('deploy_id'); print('deploy', did, 'build', d.get('id'), flush=True)
last = None
for k in range(360):
    try:
        with urllib.request.urlopen(urllib.request.Request(PROXY + f'/api/v1/deploys/{did}', headers={'User-Agent': 'netlify-mcp'}), timeout=60) as rr: st = json.loads(rr.read())
    except Exception as e:
        print('poll error', e, flush=True); time.sleep(5); continue
    s = st.get('state')
    if s != last: print('state', s, flush=True); last = s
    if s in ('ready', 'error'):
        if s == 'error': print('error:', st.get('error_message'), flush=True); sys.exit(1)
        print('DONE', did, flush=True)
        # (Chad, 30 Oct: "Make sure that whatever method it is, the final deployed site is always perfect and identical to
        # the latest build you built.") THE LIVE SITE IS CHECKED HERE, every file fetched and compared byte for byte with
        # dist/ — _headers is Netlify's config, never served, so its EFFECT is checked instead (an asset's immutable cache
        # and index.html's revalidation). Anything else and the deploy is reported failed, never done.
        import concurrent.futures as cf
        def check(rel):
            url = LIVE + '/' + ('' if rel == 'index.html' else urllib.parse.quote(rel))
            for attempt in range(4):
                try:
                    with urllib.request.urlopen(urllib.request.Request(url, headers={'Cache-Control': 'no-cache', 'User-Agent': 'byteverify'}), timeout=180) as rr:
                        return rel, hashlib.sha1(rr.read()).hexdigest() == files[rel]['sha1']
                except Exception:
                    time.sleep(2 * (attempt + 1))
            return rel, False
        with cf.ThreadPoolExecutor(8) as ex: res = list(ex.map(check, [r for r in files if r != '_headers']))
        bad = [r for r, ok in res if not ok]
        def hdr(path):
            with urllib.request.urlopen(urllib.request.Request(LIVE + path, method='HEAD', headers={'User-Agent': 'byteverify'}), timeout=60) as rr:
                return (rr.headers.get('Cache-Control') or '').replace(' ', '')
        an = next(r for r in sorted(files) if r.startswith('assets/'))
        hok = 'immutable' in hdr('/' + an) and 'must-revalidate' in hdr('/')
        print(f'VERIFY: {len(res)} served files checked, {len(res) - len(bad)} identical to {DIST}; _headers in force: {hok}', flush=True)
        for r in bad: print('  MISMATCH', r, flush=True)
        sys.exit(0 if not bad and hok else 3)
    time.sleep(5)
print('timed out waiting', did, flush=True); sys.exit(1)
