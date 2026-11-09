#!/usr/bin/env python3
"""v25.0 (copied from masters/v24.36/meshy.py) · Meshy image-to-3D and remesh for every piece AT ONCE (Chad: "Where is your parallelism?").

usage: python3 -I masters/v25.0/meshy.py masters/v25.0/models/jobs.json
jobs.json: [{"name", "image" (a local reference picture), "symmetry" (auto|on|off), "texture", "remesh"}]

Every job is started before any is waited on; each is polled until it has succeeded or failed; each SUCCEEDED
image-to-3D is remeshed (triangles, its target), and both files are written to masters/v25.0/src/original-<name>.glb
and remeshed-<name>.glb the moment they exist (Meshy keeps a job's files three days — v24.26). The job IDs go to
masters/v25.0/src/jobs-done.json, for make.sh. The key is read from /root/.config/meshy/key and never printed.
"""
import base64, json, mimetypes, os, sys, time, urllib.request

API = 'https://api.meshy.ai/openapi/v1'
KEY = open('/root/.config/meshy/key').read().strip()
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
os.makedirs(SRC, exist_ok=True)


def call(method, path, body=None):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body else None,
                                 headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def fetch(url, out):
    with urllib.request.urlopen(url, timeout=600) as r, open(out, 'wb') as f:
        f.write(r.read())


def data_uri(path):
    mt = mimetypes.guess_type(path)[0] or 'image/jpeg'
    return 'data:%s;base64,%s' % (mt, base64.b64encode(open(path, 'rb').read()).decode())


jobs = json.load(open(sys.argv[1]))
done = {}
for j in jobs:
    body = {'image_url': data_uri(j['image']), 'ai_model': 'latest', 'topology': 'triangle', 'target_polycount': 300000,
            'should_remesh': True, 'should_texture': True, 'enable_pbr': True, 'symmetry_mode': j.get('symmetry', 'auto'),
            'texture_prompt': j['texture']}
    j['i3d'] = call('POST', '/image-to-3d', body)['result']
    print('started image-to-3d', j['name'], j['i3d'], flush=True)

pending = {j['name']: j for j in jobs}
while pending:
    time.sleep(20)
    for name, j in list(pending.items()):
        if 'rm' not in j:
            t = call('GET', '/image-to-3d/' + j['i3d'])
            if t['status'] == 'SUCCEEDED':
                fetch(t['model_urls']['glb'], os.path.join(SRC, 'original-%s.glb' % name))
                j['rm'] = call('POST', '/remesh', {'input_task_id': j['i3d'], 'target_formats': ['glb'],
                                                  'topology': 'triangle', 'target_polycount': j['remesh']})['result']
                print('image-to-3d done', name, '-> remesh', j['rm'], flush=True)
            elif t['status'] in ('FAILED', 'CANCELED', 'EXPIRED'):
                print('FAILED image-to-3d', name, t.get('task_error'), flush=True); pending.pop(name)
        else:
            t = call('GET', '/remesh/' + j['rm'])
            if t['status'] == 'SUCCEEDED':
                fetch(t['model_urls']['glb'], os.path.join(SRC, 'remeshed-%s.glb' % name))
                done[name] = {'image_to_3d': j['i3d'], 'remesh': j['rm'], 'target': j['remesh']}
                print('remesh done', name, flush=True); pending.pop(name)
            elif t['status'] in ('FAILED', 'CANCELED', 'EXPIRED'):
                print('FAILED remesh', name, t.get('task_error'), flush=True); pending.pop(name)
    json.dump(done, open(os.path.join(SRC, 'jobs-done.json'), 'w'), indent=1)
print('all done:', sorted(done), flush=True)
