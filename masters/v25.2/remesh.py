#!/usr/bin/env python3
"""v25.2 · Meshy REMESH ONLY, at a higher count, from an image-to-3D task already made (Chad, 10 Nov 2026: "Make sure
those models just generated are not too compressed and dont lose too much quality"). The first remeshes (2,000-12,000
triangles) were photographed beside Meshy's own originals (300,000) and lost what can be seen: the wreath's flowers holed
and shard-edged, the till's front cracked and its lock smeared, the jacket's folds crumpled, the bottles' caps boxy. Each
is remeshed again from the same image-to-3D task (Meshy keeps a task three days), every one at once.

usage: python3 -I masters/v25.2/remesh.py name=target [name=target ...]
The task IDs are read from masters/v25.2/src/jobs-done.json (image_to_3d); each new file is written to
masters/v25.2/src/remeshed-<name>-<target>.glb the moment it exists, and its job ID merged into jobs-done.json under the
name's 'hq' (remesh, target). The key is read from /root/.config/meshy/key and never printed.
"""
import json, os, sys, time, urllib.request

API = 'https://api.meshy.ai/openapi/v1'
KEY = open('/root/.config/meshy/key').read().strip()
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
DONE = os.path.join(SRC, 'jobs-done.json')


def call(method, path, body=None):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body else None,
                                 headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def fetch(url, out):
    with urllib.request.urlopen(url, timeout=600) as r, open(out, 'wb') as f:
        f.write(r.read())


done = json.load(open(DONE))
want = [a.split('=') for a in sys.argv[1:]]
pending = {}
for name, target in want:
    t = int(target)
    rid = call('POST', '/remesh', {'input_task_id': done[name]['image_to_3d'], 'target_formats': ['glb'],
                                   'topology': 'triangle', 'target_polycount': t})['result']
    pending[name] = (rid, t)
    print('started remesh', name, t, rid, flush=True)
got = {}
while pending:
    time.sleep(15)
    for name, (rid, t) in list(pending.items()):
        r = call('GET', '/remesh/' + rid)
        if r['status'] == 'SUCCEEDED':
            fetch(r['model_urls']['glb'], os.path.join(SRC, 'remeshed-%s-%d.glb' % (name, t)))
            got[name] = {'remesh': rid, 'target': t}
            print('remesh done', name, t, flush=True); pending.pop(name)
        elif r['status'] in ('FAILED', 'CANCELED', 'EXPIRED'):
            print('FAILED remesh', name, r.get('task_error'), flush=True); pending.pop(name)
cur = json.load(open(DONE))
for name, v in got.items():
    cur[name]['hq'] = v
json.dump(cur, open(DONE, 'w'), indent=1)
print('all done:', sorted(got), flush=True)
