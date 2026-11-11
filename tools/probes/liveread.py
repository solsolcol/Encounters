#!/usr/bin/env python3
# v25.5 · WHAT tools/probes/filmlive.mjs RECORDED, READ FOR A PICTURE THAT SWAYS (the audit of 9 to 11 Nov 2026).
#   python3 -I tools/probes/liveread.py <filmlive.json> [<filmlive.json> ...] [--turn 0.4] [--lens 0.5] [--cut 2]
# The rows are cut into STRETCHES wherever the look or the lens moves more than --cut degrees between two drawn frames
# (a cut, or a pan too fast to be a sway: at four frames a second, 2 degrees a frame is 8 degrees a second). Inside each
# it counts how often the look's turn, its tilt and the lens REVERSE (go one way by at least the threshold, then the
# other): a move a film wrote goes one way and stops; a camera that follows a living head goes there and back. It
# prints each shot's seconds, its ranges and its reversals, and marks the shots where anything reverses: the ones to
# look at (a written out-and-back, such as a pan to a thing and home again, is one reversal and is known).
import sys, json
a = sys.argv[1:]; TH = {'yaw': 0.4, 'pitch': 0.4, 'fov': 0.5}; files = []; CUT = 2.0
i = 0
while i < len(a):
    if a[i] == '--turn': TH['yaw'] = TH['pitch'] = float(a[i + 1]); i += 2; continue
    if a[i] == '--lens': TH['fov'] = float(a[i + 1]); i += 2; continue
    if a[i] == '--cut': CUT = float(a[i + 1]); i += 2; continue
    files.append(a[i]); i += 1
def reversals(v, th):
    # the turning points of a run of numbers, ignoring wiggles smaller than th: returns [(index, value)], ends left out
    out = []; lo = hi = v[0]; ilo = ihi = 0; way = 0
    for k, x in enumerate(v):
        if x > hi: hi, ihi = x, k
        if x < lo: lo, ilo = x, k
        if way >= 0 and hi - x >= th and hi - lo >= th:      # it was rising (or unknown) and has come down by th
            if way == 1 or ihi > 0: out.append((ihi, hi))
            way = -1; lo, ilo = x, k
        elif way <= 0 and x - lo >= th and hi - lo >= th:    # it was falling (or unknown) and has come up by th
            if way == -1 or ilo > 0: out.append((ilo, lo))
            way = 1; hi, ihi = x, k
    return out
def unwrap(v):
    out = [v[0]]
    for x in v[1:]:
        d = x - out[-1]
        while d > 180: d -= 360
        while d < -180: d += 360
        out.append(out[-1] + d)
    return out
for f in files:
    d = json.load(open(f)); rows = d['rows']
    if len(rows) < 3: print(f, 'too few rows'); continue
    yaw = unwrap([r['yaw'] for r in rows])
    for r, y in zip(rows, yaw): r['yaw'] = y
    # breaks: the look or the lens moving more than CUT degrees between two drawn frames
    cuts = [0]
    for k in range(1, len(rows)):
        p, q = rows[k - 1], rows[k]
        if max(abs(q['yaw'] - p['yaw']), abs(q['pitch'] - p['pitch']), abs(q['fov'] - p['fov'])) > CUT: cuts.append(k)
    cuts.append(len(rows))
    print(f"== {d.get('film')} ({d.get('view')}): {len(rows)} frames, {rows[0]['t']:.1f} to {rows[-1]['t']:.1f} s")
    for s0, s1 in zip(cuts, cuts[1:]):
        seg = rows[s0:s1]
        if len(seg) < 4: continue
        line = []; flag = False
        for key in ('yaw', 'pitch', 'fov'):
            v = [r[key] for r in seg]; rv = reversals(v, TH[key])
            if rv: flag = True
            line.append(f"{key} {min(v):.2f}..{max(v):.2f}" + (f" REVERSES {len(rv)}x at t=" + ','.join(f"{seg[k]['t']:.1f}" for k, _ in rv) if rv else ''))
        print(('  ** ' if flag else '     ') + f"{seg[0]['t']:6.1f}-{seg[-1]['t']:6.1f} s  " + ' | '.join(line))
