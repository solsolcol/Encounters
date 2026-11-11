#!/usr/bin/env python3
"""v26.0 · Meshy at its HIGHEST settings, for the people and the props of episode 4 chapter 3.

Chad, 11 Nov 2026: "3d models should be generated at the highest possible settings" ... "send that to Meshy to generate
the 3d model, then rig it, then add animations."  The settings below are read from Meshy's own docs (docs.meshy.ai,
read 11 Nov 2026; masters/v26.0/make.sh has the list), never from memory.

usage:
  python3 -I masters/v26.0/meshy26.py model  <jobs.json>      # image-to-3D for every job at once, wait, download
  python3 -I masters/v26.0/meshy26.py rig    <name> [height]  # auto-rig the model made for <name>
  python3 -I masters/v26.0/meshy26.py anim   <name> <set> <id,id,...>   # library actions onto <name>'s rig, one file
  python3 -I masters/v26.0/meshy26.py motion <name> <set> <motion_task_id>   # a text-to-motion clip onto the rig
  python3 -I masters/v26.0/meshy26.py refetch <name> <set>                   # a take's file again from its task (free)
  python3 -I masters/v26.0/meshy26.py collect <name> ...                     # finished models fetched by name (free)
  python3 -I masters/v26.0/meshy26.py peek <name> ...                        # their four thumbnails only
  python3 -I masters/v26.0/meshy26.py remesh <name> <triangles>   # a lighter level from the same task
  python3 -I masters/v26.0/meshy26.py t2m    <motion> <seconds> "<prompt>"   # a text-to-motion clip (skeleton-free)
  python3 -I masters/v26.0/meshy26.py balance

jobs.json: [{"name", "image" (the reference picture), "kind": "person"|"prop", "polys"?, "tex"? ("8k"|"4k"),
             "geo"? ("4k"|"2k"|"standard"), "texture"? (a texture prompt; omit to take the picture's own)}]

Every id is MERGED into masters/v26.0/src/jobs.json the moment it exists (Meshy keeps a task three days), and every
file is written to masters/v26.0/src/ (ignored by git: sources are large; the recipe is make.sh). The key is read from
/root/.config/meshy/key and never printed.
"""
import base64, json, mimetypes, os, sys, time, urllib.request, urllib.error

API = 'https://api.meshy.ai/openapi/v1'
KEY = open('/root/.config/meshy/key').read().strip()
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
os.makedirs(SRC, exist_ok=True)
LEDGER = os.path.join(SRC, 'jobs.json')


def call(method, path, body=None):
    """one request. A GET (a status, a balance) that drops on the line is asked again, up to five times with a wait: a
    forty-minute run of remeshes was lost to one reset connection. A POST is never repeated here (it would start, and
    charge, a second job): a POST that drops is reported and the run that made it is run again by hand."""
    tries = 5 if method == 'GET' else 1
    for k in range(tries):
        req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'replace')[:600]
            if method == 'GET' and e.code >= 500 and k < tries - 1: time.sleep(4 * (k + 1)); continue
            raise SystemExit('HTTP %s on %s %s: %s' % (e.code, method, path, msg))
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if k < tries - 1: time.sleep(4 * (k + 1)); continue
            raise SystemExit('%s %s did not get through: %s' % (method, path, e))


def fetch(url, out):
    tmp = out + '.part'
    for k in range(4):                       # a download that drops is begun again (the file is whole or it is not kept)
        try:
            with urllib.request.urlopen(url, timeout=1800) as r, open(tmp, 'wb') as f:
                while True:
                    b = r.read(1 << 20)
                    if not b: break
                    f.write(b)
            break
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if k == 3: raise SystemExit('the download did not get through: %s' % e)
            time.sleep(5 * (k + 1))
    os.replace(tmp, out)
    return os.path.getsize(out)


def data_uri(path):
    mt = mimetypes.guess_type(path)[0] or 'image/png'
    return 'data:%s;base64,%s' % (mt, base64.b64encode(open(path, 'rb').read()).decode())


def ledger():
    return json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}


class locked:
    """several of these scripts run at once (a batch of models, a rig, the motions): one writer of the ledger at a time"""
    def __enter__(self):
        import fcntl
        self.f = open(LEDGER + '.lock', 'w'); fcntl.flock(self.f, fcntl.LOCK_EX); return self
    def __exit__(self, *a):
        import fcntl
        fcntl.flock(self.f, fcntl.LOCK_UN); self.f.close()


def save(L):
    tmp = LEDGER + '.tmp'
    json.dump(L, open(tmp, 'w'), indent=1, sort_keys=True); os.replace(tmp, LEDGER)


def note(name, **kw):
    with locked():
        L = ledger(); L.setdefault(name, {}).update(kw); save(L)


def wait(path, tid, label):
    last = -1
    while True:
        t = call('GET', '%s/%s' % (path, tid))
        if t.get('progress') != last:
            last = t.get('progress'); print('  %s %s %s%%' % (label, t['status'], last), flush=True)
        if t['status'] == 'SUCCEEDED': return t
        if t['status'] in ('FAILED', 'CANCELED', 'EXPIRED'):
            raise SystemExit('%s %s: %s' % (label, t['status'], t.get('task_error')))
        time.sleep(15)


def cmd_model(jobs_path):
    jobs = json.load(open(jobs_path))
    for j in jobs:
        person = j.get('kind', 'prop') == 'person'
        body = {
            'image_url': data_uri(j['image']),
            'ai_model': 'latest',                      # = meshy-7.1, the newest (docs, changelog Sep 18)
            'model_type': 'standard',
            'geometry_resolution': j.get('geo', '4k'), # Ultra 4096^3, the highest
            'should_texture': True,
            'texture_model': 'meshy-7',                # PBR, up to 8K
            'enable_pbr': True,
            'texture_resolution': j.get('tex', '8k'),  # the highest
            'should_remesh': True, 'topology': 'triangle',
            'target_polycount': j.get('polys', 300000),  # the highest the remesh gives; a rig takes at most 380,000
            'save_pre_remeshed_model': j.get('pre', person),   # a person: the untouched surface beside it (a prop: not kept, for room)
            'image_enhancement': True,
            'target_formats': ['glb'],
            'multi_view_thumbnails': True,
        }
        if person: body['pose_mode'] = 'a-pose'
        if j.get('texture'): body['texture_prompt'] = j['texture']
        j['task'] = call('POST', '/image-to-3d', body)['result']
        note(j['name'], image_to_3d=j['task'], image=j['image'], settings={k: v for k, v in body.items() if k != 'image_url'})
        print('started image-to-3d', j['name'], j['task'], flush=True)
    for j in jobs:
        t = wait('/image-to-3d', j['task'], j['name'])
        mu = t.get('model_urls', {})
        sizes = {}
        if mu.get('glb'): sizes['glb'] = fetch(mu['glb'], os.path.join(SRC, 'original-%s.glb' % j['name']))
        if mu.get('pre_remeshed_glb'): sizes['pre'] = fetch(mu['pre_remeshed_glb'], os.path.join(SRC, 'preremesh-%s.glb' % j['name']))
        for side, u in (t.get('thumbnail_urls') or {}).items():
            fetch(u, os.path.join(SRC, 'thumb-%s-%s.png' % (j['name'], side)))
        note(j['name'], credits=t.get('consumed_credits'), expires_at=t.get('expires_at'), sizes=sizes)
        print('done', j['name'], sizes, 'credits', t.get('consumed_credits'), flush=True)


def cmd_collect(names, thumbs_only=False):
    """finished image-to-3D tasks fetched by name (a job list that died half way, or a model held at Meshy until there
    is room for it: Meshy keeps a task's files three days). A failed task is reported and passed over."""
    for n in names:
        L = ledger().get(n) or {}
        tid = L.get('image_to_3d')
        if not tid: print(n, 'has no image-to-3D task'); continue
        t = call('GET', '/image-to-3d/' + tid)
        while t['status'] in ('PENDING', 'IN_PROGRESS'):
            time.sleep(15); t = call('GET', '/image-to-3d/' + tid)
        if t['status'] != 'SUCCEEDED':
            print(n, t['status'], (t.get('task_error') or {}).get('message'), flush=True); note(n, failed=t['status']); continue
        for side, u in (t.get('thumbnail_urls') or {}).items():
            fetch(u, os.path.join(SRC, 'thumb-%s-%s.png' % (n, side)))
        if thumbs_only: print('thumbs', n, flush=True); continue
        mu = t.get('model_urls', {}); sizes = {}
        if mu.get('glb'): sizes['glb'] = fetch(mu['glb'], os.path.join(SRC, 'original-%s.glb' % n))
        if mu.get('pre_remeshed_glb'): sizes['pre'] = fetch(mu['pre_remeshed_glb'], os.path.join(SRC, 'preremesh-%s.glb' % n))
        note(n, credits=t.get('consumed_credits'), expires_at=t.get('expires_at'), sizes=sizes)
        print('done', n, sizes, 'credits', t.get('consumed_credits'), flush=True)


def cmd_rig(name, height='1.70'):
    L = ledger()[name]
    body = {'input_task_id': L['image_to_3d'], 'height_meters': float(height), 'skeleton_template': 'meshyrig',
            'include_fingers': True}
    try:
        tid = call('POST', '/rigging', body)['result']
    except SystemExit as e:
        if '422' not in str(e): raise
        print('  fingers refused (422): rigging without finger bones', flush=True)
        body['include_fingers'] = False
        tid = call('POST', '/rigging', body)['result']
    note(name, rig=tid, rig_settings=body)
    print('started rig', name, tid, flush=True)
    t = wait('/rigging', tid, 'rig ' + name)
    r = t['result']
    sizes = {'rigged': fetch(r['rigged_character_glb_url'], os.path.join(SRC, 'rigged-%s.glb' % name))}
    ba = r.get('basic_animations') or {}
    if ba.get('walking_glb_url'): sizes['walk'] = fetch(ba['walking_glb_url'], os.path.join(SRC, 'take-%s-walking.glb' % name))
    note(name, rig_credits=t.get('consumed_credits'), rig_sizes=sizes)
    print('rig done', name, sizes, flush=True)


def cmd_anim(name, setname, ids):
    L = ledger()[name]
    ids = [int(x) for x in ids.split(',')]
    body = {'rig_task_id': L['rig']}
    body.update({'action_id': ids[0]} if len(ids) == 1 else {'action_ids': ids})
    tid = call('POST', '/animations', body)['result']
    takes = L.get('takes', {}); takes[setname] = {'task': tid, 'actions': ids}; note(name, takes=takes)
    print('started animation', name, setname, tid, flush=True)
    t = wait('/animations', tid, 'anim %s %s' % (name, setname))
    size = fetch(t['result']['animation_glb_url'], os.path.join(SRC, 'take-%s-%s.glb' % (name, setname)))
    takes[setname].update(credits=t.get('consumed_credits'), size=size); note(name, takes=takes)
    print('animation done', name, setname, size, flush=True)


def cmd_motion(name, setname, motion_task):
    L = ledger()[name]
    motion_task = ledger().get('_motions', {}).get(motion_task, {}).get('task', motion_task)   # a motion's name, or its id
    tid = call('POST', '/animations', {'rig_task_id': L['rig'], 'motion_task_id': motion_task})['result']
    takes = L.get('takes', {}); takes[setname] = {'task': tid, 'motion': motion_task}; note(name, takes=takes)
    t = wait('/animations', tid, 'motion %s %s' % (name, setname))
    size = fetch(t['result']['animation_glb_url'], os.path.join(SRC, 'take-%s-%s.glb' % (name, setname)))
    takes[setname].update(credits=t.get('consumed_credits'), size=size); note(name, takes=takes)
    print('motion done', name, setname, size, flush=True)


def cmd_refetch(name, setname):
    """a take's file again from its task (no new credits; Meshy keeps a task's files three days)"""
    tid = ledger()[name]['takes'][setname]['task']
    t = call('GET', '/animations/' + tid)
    size = fetch(t['result']['animation_glb_url'], os.path.join(SRC, 'take-%s-%s.glb' % (name, setname)))
    print('refetched', name, setname, size, flush=True)


def cmd_t2m(name, duration, prompt):
    """a text-to-motion clip (prime: the higher quality, an FBX; skeleton-free; kept 3 days; 10 credits)"""
    assert len(prompt) <= 400, 'prompt over 400 characters: %d' % len(prompt)
    tid = call('POST', '/text-to-motion', {'prompt': prompt, 'mode': 'prime', 'duration': float(duration)})['result']
    with locked():
        L = ledger(); L.setdefault('_motions', {})[name] = {'task': tid, 'prompt': prompt, 'duration': float(duration)}; save(L)
    print('started text-to-motion', name, tid, flush=True)
    t = wait('/text-to-motion', tid, 't2m ' + name)
    size = fetch(t['result']['motion_url'], os.path.join(SRC, 'motion-%s.%s' % (name, t['result'].get('motion_format', 'fbx'))))
    with locked():
        L = ledger(); L['_motions'][name].update(credits=t.get('consumed_credits'), size=size, expires_at=t.get('expires_at')); save(L)
    print('t2m done', name, size, flush=True)


def cmd_remesh(name, polys):
    L = ledger()[name]
    rm = L.get('remesh', {})
    if str(polys) in rm and not os.environ.get('AGAIN'):
        tid = rm[str(polys)]; print('  remesh %s %s: the job is in the ledger (%s): waited for, not started again' % (name, polys, tid), flush=True)
    else:
        tid = call('POST', '/remesh', {'input_task_id': L['image_to_3d'], 'target_formats': ['glb'], 'topology': 'triangle',
                                       'target_polycount': int(polys)})['result']
        with locked():
            L2 = ledger(); r2 = L2.setdefault(name, {}).setdefault('remesh', {}); r2[str(polys)] = tid; save(L2)
    t = wait('/remesh', tid, 'remesh %s %s' % (name, polys))
    size = fetch(t['model_urls']['glb'], os.path.join(SRC, 'remeshed-%s-%s.glb' % (name, polys)))
    print('remesh done', name, polys, size, flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] == 'balance': print(call('GET', '/balance'))
    elif a[0] == 'model': cmd_model(a[1])
    elif a[0] == 'rig': cmd_rig(*a[1:3])
    elif a[0] == 'anim': cmd_anim(a[1], a[2], a[3])
    elif a[0] == 'motion': cmd_motion(a[1], a[2], a[3])
    elif a[0] == 'remesh': cmd_remesh(a[1], a[2])
    elif a[0] == 'refetch': cmd_refetch(a[1], a[2])
    elif a[0] == 'collect': cmd_collect(a[1:])
    elif a[0] == 'peek': cmd_collect(a[1:], thumbs_only=True)
    elif a[0] == 't2m': cmd_t2m(a[1], a[2], a[3])
    else: raise SystemExit(__doc__)
