"""Byte-verify the live Netlify site against a local dist/ — every file under dist (except the deploy tool's own
.netlify/ state) fetched from the site and compared byte for byte.
usage: python3 byteverify.py dist [https://masterz-encounters-game.netlify.app]"""
import hashlib, os, sys, urllib.request, concurrent.futures as cf
root = sys.argv[1]
site = (sys.argv[2] if len(sys.argv) > 2 else 'https://masterz-encounters-game.netlify.app').rstrip('/')
files = []
for d, _, fs in os.walk(root):
    for f in fs:
        rel = os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/')
        if rel.startswith('.netlify/'):
            continue
        files.append(rel)
files.sort()
def check(rel):
    local = open(os.path.join(root, rel), 'rb').read()
    url = site + '/' + ('' if rel == 'index.html' else rel)
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'Cache-Control': 'no-cache', 'User-Agent': 'byteverify'})
            with urllib.request.urlopen(req, timeout=120) as r:
                remote = r.read()
            return rel, hashlib.sha1(local).hexdigest() == hashlib.sha1(remote).hexdigest(), len(local), len(remote)
        except Exception as e:
            err = str(e)
    return rel, False, len(local), 'ERR ' + err
with cf.ThreadPoolExecutor(8) as ex:
    res = list(ex.map(check, files))
bad = [r for r in res if not r[1]]
print(f'{len(res)} files checked, {len(res) - len(bad)} identical')
for r in bad:
    print('  MISMATCH', r)
