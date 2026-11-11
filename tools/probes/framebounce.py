#!/usr/bin/env python3
# v25.5 · THE LENS THAT BOUNCES (Chad: "the camera bounces several times"), found in framecheck's own file: every place a
# film's lens REVERSES or leaps against its own run, cuts left out. Run framecheck with STEP=0.1, then:
#   python3 -I tools/probes/framebounce.py <framecheck.json>
# A step is listed when its change is 0.6 degrees or more and either its sign is against both neighbours' or it is
# more than four times both neighbours' changes; a step across which the picture's subjects move more than a quarter
# of the frame is a cut and is skipped (a cut between two shots of the same people can still be listed: a whole-number
# lens on both sides is a shot's own constant, read the film). A lens that goes out and comes back by 3 degrees or
# more inside 1.5 s is named too (the call's pan: 45 to 70 and back to 37). v25.2's fit, stepped two degrees at a
# time, listed 7 in the opening film's last shot and 5 in the coda's; solved smoothly (v25.5), none.
import json, sys
import statistics
d = json.load(open(sys.argv[1]))['films']
for film, rows in d.items():
    df = [b['fov'] - a['fov'] for a, b in zip(rows, rows[1:])]
    out = []
    for i in range(1, len(df) - 1):
        x, p, n = df[i], df[i - 1], df[i + 1]
        if abs(x) < 0.6: continue
        a, b = rows[i], rows[i + 1]
        mv = [max(abs(q[0] - a['s'][k][0]), abs(q[1] - a['s'][k][1])) for k, q in b['s'].items() if k in a['s'] and q[2] and a['s'][k][2] and abs(a['s'][k][0]) < 1.5 and abs(a['s'][k][1]) < 1.5]
        if mv and statistics.median(mv) > 0.25: continue
        against = (x > 0) != (p > 0) and (x > 0) != (n > 0) and abs(p) > 0.02 and abs(n) > 0.02
        leap = abs(x) > 4 * max(abs(p), 0.05) and abs(x) > 4 * max(abs(n), 0.05)
        if against or leap: out.append('t=%.1f %.2f->%.2f' % (b['t'], a['fov'], b['fov']))
    # a turn-round: the lens rising then falling (or the reverse) by 3 degrees or more each way inside 1.5 s
    turns = []
    n = len(rows); w = 15
    for i in range(0, n - w):
        seg = [r['fov'] for r in rows[i:i + w + 1]]
        hi = max(seg); j = seg.index(hi)
        if 0 < j < w and hi - seg[0] > 3 and hi - seg[-1] > 3: turns.append(rows[i + j]['t'])
    tl = sorted(set(round(t, 0) for t in turns))
    print(f"{film}: {len(out)} bounces" + (': ' + '; '.join(out) if out else '') + (f"   | lens out-and-back near t={tl}" if tl else ''))
