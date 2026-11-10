#!/usr/bin/env python3
"""v25.2 · framecheck.mjs's two measures read together: every stretch of a film in which a subject is in the desktop's
frame and out of the phone's (or nearly out: within EDGE of its edge), longest first, with where it stood on each.
The shots to look at on a phone, not a verdict: a subject the desktop shows only at its edge may not be what the shot
is about.

usage: python3 -I tools/probes/framediff.py <phone.json> <desktop.json> [--edge=0.92] [--min=0.5] [--only=film,...]
"""
import json, sys

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
EDGE = float(opt.get('edge', 0.92))
MIN = float(opt.get('min', 0.5))
ONLY = set(opt['only'].split(',')) if 'only' in opt else None
ph = json.load(open(args[0]))
dk = json.load(open(args[1]))


def inside(q, e):
    return q is not None and q[2] == 1 and q[3] == 1 and abs(q[0]) <= e and abs(q[1]) <= e


spans = []
for film, prow in ph['films'].items():
    if ONLY and film not in ONLY:
        continue
    drow = {r['t']: r for r in dk['films'].get(film, [])}
    cur = {}
    for r in prow:
        d = drow.get(r['t'])
        if not d:
            continue
        lost = set()
        for k, q in d['s'].items():
            if inside(q, 0.95) and not inside(r['s'].get(k), EDGE):
                lost.add(k)
        for k in list(cur):
            if k not in lost:
                s = cur.pop(k)
                spans.append((film, k, s[0], s[1], s[2], s[3]))
        for k in lost:
            if k in cur:
                cur[k][1] = r['t']
            else:
                cur[k] = [r['t'], r['t'], d['s'][k][:2], r['s'].get(k, [None, None])[:2]]
    for k, s in cur.items():
        spans.append((film, k, s[0], s[1], s[2], s[3]))
step = ph.get('step', 0.25)
spans = [s for s in spans if s[3] - s[2] + step >= MIN]
spans.sort(key=lambda s: (s[0], s[2]))
for film, k, a, b, dq, pq in spans:
    print('%-7s %6.2f-%6.2f  %-16s desk %s  phone %s' % (film, a, b, k, dq, pq))
print(len(spans), 'stretches')
