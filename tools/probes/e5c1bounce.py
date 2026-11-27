#!/usr/bin/env python3
"""v29.0 · THE LENS AS A MOVE, read from tools/probes/e5c1films.mjs's seek rows (VIEW=both: a phone's rows and a desk's):
     python3 -I tools/probes/e5c1bounce.py <dir> <job>
It writes <dir>/framecheck-<view>-<job>.json in framecheck's own shape ({films: {job: [{t, fov, s: {name: [x, y, shown]}}]}},
each person's drawn middle on the screen as a subject) and splits the rows into phone-seek-<job>.json and
desktop-seek-<job>.json for tools/probes/e4c5filmread.py; then runs tools/probes/framebounce.py on each view (the lens's
reversals and leaps, cuts left out) and prints, every tenth of a second, the steps where the eye or the look moves faster
than a walk's head can (the eye 0.45 m/s outside a cut, the look 90 degrees a second) and where a subject's drawn height
on the screen changes by more than a fifth in a tenth of a second with no cut. Leads, never verdicts. */"""
import json, math, os, subprocess, sys
D, JOB = sys.argv[1], sys.argv[2]
src = json.load(open(os.path.join(D, 'both-seek-%s.json' % JOB)))
here = os.path.dirname(os.path.abspath(__file__))
for view, key in (('phone', 'rows'), ('desktop', 'rowsD')):
    rows = src.get(key) or []
    if not rows: continue
    out = dict(src); out['rows'] = rows; out.pop('rowsD', None); out['view'] = view
    json.dump(out, open(os.path.join(D, '%s-seek-%s.json' % (view, JOB)), 'w'))
    fc = []
    for r in rows:
        s = {}
        for i, P in enumerate(r['P']):
            if not P or not P[0] or not P[5]: continue
            e = P[5]; s[src['labels'][i]] = [(e[0] + e[1]) / 2, (e[2] + e[3]) / 2, 1, e[3] - e[2]]
        fc.append({'t': r['L'][0], 'fov': r['L'][1], 's': s})
    json.dump({'films': {JOB: fc}}, open(os.path.join(D, 'framecheck-%s-%s.json' % (view, JOB)), 'w'))
    print('==', view, JOB, len(rows), 'rows')
    print(subprocess.run([sys.executable, '-I', os.path.join(here, 'framebounce.py'), os.path.join(D, 'framecheck-%s-%s.json' % (view, JOB))], capture_output=True, text=True).stdout.strip())
    # the eye's and the look's speed, and a subject's size jumping, with no cut
    fast = []
    for a, b in zip(rows, rows[1:]):
        A, B = a['L'], b['L']; dt = max(1e-3, B[0] - A[0])
        de = math.dist(A[3:6], B[3:6]) / dt; dy = abs((B[6] - A[6] + 180) % 360 - 180) / dt; dp = abs(B[7] - A[7]) / dt
        cut = math.dist(A[3:6], B[3:6]) > 0.25 or abs((B[6] - A[6] + 180) % 360 - 180) > 10 or abs(B[1] - A[1]) > 5
        if cut: continue
        if de > 1.6 or dy > 90 or dp > 90: fast.append('t=%.1f eye %.2f m/s, look %.0f / %.0f deg/s' % (B[0], de, dy, dp))
        for i, (P, Q) in enumerate(zip(a['P'], b['P'])):
            if not (P and Q and P[0] and Q[0] and P[5] and Q[5]): continue
            h0, h1 = P[5][3] - P[5][2], Q[5][3] - Q[5][2]
            if h0 > 0.15 and abs(h1 - h0) / h0 > 0.2: fast.append('t=%.1f %s drawn height %.2f -> %.2f' % (B[0], src['labels'][i], h0, h1))
    print('fast or jumping (no cut):', len(fast)); print('\n'.join(fast[:40]))
