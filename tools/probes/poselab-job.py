#!/usr/bin/env python3
# v25.3 · one job for the pose lab (tools/probes/poselab.mjs), written into $LABDIR/jobs and waited for:
#   LABDIR=<dir> python3 -I tools/probes/poselab-job.py <id> <eval-js-file | -> [shots...] [--vp WxH] [--frames N] [--read js]
# a shot is  name=ox,oy,oz,fov[,aimK[,aimDy]]  (a review camera riding the body, in its own frame: ox to his left, oy up,
# oz before him),  name=@x,y,z@ax,ay,az[@fov]  (a free camera in the room's metres)  or  name=film  (the game's own
# lens). The answer ({ ret, errs }) is printed; the pictures are
# $LABDIR/out/<id>-<name>.jpg. Examples:
#   ... poselab-job.py w1 pose.js front=0,0.05,1.6,34 side=1.5,0.05,0.3,34 q=1.1,0.15,1.2,34
#   ... poselab-job.py f1 seek.js film=film --vp 780x1688         (a phone's frame at full size)
import sys, json, os, time
D = os.environ.get('LABDIR')
if not D or len(sys.argv) < 3:
    print(__doc__ or 'usage: LABDIR=<dir> poselab-job.py <id> <eval-js-file|-> [shots...] [--vp WxH] [--frames N] [--read js]'); sys.exit(2)
a = sys.argv[1:]; jid = a[0]; ev = open(a[1]).read() if a[1] != '-' else None
shots = []; vp = None; frames = 3; read = None; i = 2
while i < len(a):
    if a[i] == '--vp': vp = [int(x) for x in a[i + 1].split('x')]; i += 2; continue
    if a[i] == '--frames': frames = int(a[i + 1]); i += 2; continue
    if a[i] == '--read': read = a[i + 1]; i += 2; continue
    n, v = a[i].split('=', 1)
    if v == 'film': cam = None
    elif v.startswith('@'):                      # a free camera: name=@x,y,z@ax,ay,az[@fov]
        q = v[1:].split('@'); cam = {'pos': [float(x) for x in q[0].split(',')], 'at': [float(x) for x in q[1].split(',')], 'fov': float(q[2]) if len(q) > 2 else 72}
    else: cam = [float(x) for x in v.split(',')]
    shots.append({'name': n, 'cam': cam}); i += 1
job = {'id': jid, 'eval': ev, 'shots': shots, 'frames': frames}
if vp: job['vp'] = vp
if read: job['read'] = read
res = D + '/out/' + jid + '.json'
if os.path.exists(res): os.remove(res)
json.dump(job, open(D + '/jobs/%d-%s.json' % (int(time.time() * 1000), jid), 'w'))
t0 = time.time()
while not os.path.exists(res):
    time.sleep(0.5)
    if time.time() - t0 > 900: print('TIMEOUT'); sys.exit(1)
time.sleep(0.2); print(open(res).read()[:1500])
