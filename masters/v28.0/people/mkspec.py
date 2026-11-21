#!/usr/bin/env python3
"""v28.0 · the photographs every new body is judged by (tools/shootclose.mjs specs), in two passes:

  python3 -I masters/v28.0/people/mkspec.py whole <file.glb> <height m> <out.json> [clip at]
      the WHOLE body from its four sides (1000 x 1700) and from 2.2 m on a phone's frame (780 x 1688, 72 degrees:
      the nearest a lighter body is ever drawn)
  python3 -I masters/v28.0/people/mkspec.py close <file.glb> <height m> <prefix of the whole pictures> <out.json>
      the CLOSE shots, each 1100 px or more: the face from the front, three-quarter and the side; each hand from the
      palm, the back and outside; the torso front and back; the legs; the feet. They are AIMED FROM THE WHOLE PICTURES
      (the body's outline against the grey: its top, its two furthest points sideways, its depth at the head), never
      from a guess and never from the file's own units (a skinned body's points are in its bind matrices' space).
"""
import json, math, sys
BG = (0x5a, 0x5e, 0x66)
import os
HANDTIP = bool(os.environ.get('HANDTIP'))   # HANDTIP=1: each hand aimed at its lowest 16 cm (the fingers), not the band's middle

def base(file, h, clip=None, at=None):
    m = {'file': file, 'h': h, 'x': 0, 'z': 0, 'ry': 0, 'aniso': 4}
    if clip: m['clip'] = clip; m['at'] = float(at)
    return {'bg': '#5a5e66', 'light': 'studio', 'env': 0.35, 'exposure': 1.15, 'floor': 0, 'models': [m]}

def r(v): return [round(x, 3) for x in v]

def whole(file, h, out, clip=None, at=None):
    k = h / 1.74; s = base(file, h, clip, at)
    s['shots'] = [
        {'name': 'whole-front', 'w': 1000, 'h': 1700, 'fov': 30, 'pos': r([0, 0.95 * k, 3.4 * k]), 'at': r([0, 0.9 * k, 0])},
        {'name': 'whole-back', 'w': 1000, 'h': 1700, 'fov': 30, 'pos': r([0, 0.95 * k, -3.4 * k]), 'at': r([0, 0.9 * k, 0])},
        {'name': 'whole-left', 'w': 1000, 'h': 1700, 'fov': 30, 'pos': r([3.4 * k, 0.95 * k, 0]), 'at': r([0, 0.9 * k, 0])},
        {'name': 'whole-right', 'w': 1000, 'h': 1700, 'fov': 30, 'pos': r([-3.4 * k, 0.95 * k, 0]), 'at': r([0, 0.9 * k, 0])},
        {'name': 'phone22', 'w': 780, 'h': 1688, 'fov': 72, 'pos': [0, 1.6, 2.2], 'at': r([0, 0.95 * k, 0])},
    ]
    json.dump(s, open(out, 'w'))

def mask(path):
    from PIL import Image
    im = Image.open(path).convert('RGB'); W, H = im.size; px = im.load()
    return [[max(abs(px[x, y][c] - BG[c]) for c in range(3)) > 14 for x in range(W)] for y in range(H)], W, H

def close(file, h, prefix, out):
    k = h / 1.74; mm = 2 * math.tan(math.radians(15)) * 3.4 * k / 1700       # metres a pixel on the plane through the body
    F, W, H = mask(prefix + '-whole-front.png')
    X = lambda px: (px - W / 2) * mm                                         # image right is the body's left (+x)
    Y = lambda py: 0.9 * k - (py - H / 2) * mm
    floorrow = int(H / 2 + (0.9 * k - 0.2) / mm)                             # under 0.2 m the plinth's top is in the picture (its far edge stands at 0.12 m on the body's plane)
    rows = [y for y in range(floorrow) if any(F[y])]
    top = Y(rows[0])
    cols = [x for x in range(W) if any(F[y][x] for y in range(floorrow))]
    def hand(side):                                                          # the furthest point that side, and the hand's middle
        tip = cols[-1] if side > 0 else cols[0]
        span = int(0.17 / mm); xs = range(tip - span, tip + 1) if side > 0 else range(tip, tip + span + 1)
        pts = [(x, y) for x in xs for y in range(floorrow) if 0 <= x < W and F[y][x]]
        if HANDTIP:   # (21 Nov, the nine: on a slim arm the band's middle is the wrist and the fingers fell out of the frame)
            low = max(p[1] for p in pts); pts = [p for p in pts if p[1] > low - 0.16 / mm]
        return [X(sum(p[0] for p in pts) / len(pts)), Y(sum(p[1] for p in pts) / len(pts)), 0.04]
    hl, hr = hand(+1), hand(-1)
    fy = top - 0.125 * k
    S, _, _ = mask(prefix + '-whole-left.png')                               # from his left: image right is his back (-z)
    row = int(H / 2 - (fy - 0.9 * k) / mm); zs = [x for x in range(W) if S[row][x]]
    fz = -((zs[0] + zs[-1]) / 2 - W / 2) * mm if zs else 0.0
    xs = [x for x in range(W) if F[row][x] and abs(X(x)) < 0.25]; fx = X((xs[0] + xs[-1]) / 2) if xs else 0.0
    s = base(file, h)
    s['shots'] = [dict(sh, pos=r(sh['pos']), at=r(sh['at'])) for sh in [
        {'name': 'face-front', 'w': 1200, 'h': 1200, 'fov': 16, 'pos': [fx, fy + 0.01, fz + 1.35], 'at': [fx, fy, fz]},
        {'name': 'face-three', 'w': 1200, 'h': 1200, 'fov': 16, 'pos': [fx + 0.85, fy + 0.01, fz + 1.05], 'at': [fx, fy, fz]},
        {'name': 'face-side', 'w': 1200, 'h': 1200, 'fov': 16, 'pos': [fx + 1.35, fy + 0.01, fz], 'at': [fx, fy, fz]},
        {'name': 'handL-palm', 'w': 1200, 'h': 1200, 'fov': 13, 'pos': [hl[0], hl[1] + 0.02, hl[2] + 1.15], 'at': hl},
        {'name': 'handL-back', 'w': 1200, 'h': 1200, 'fov': 13, 'pos': [hl[0], hl[1] + 0.02, hl[2] - 1.15], 'at': hl},
        {'name': 'handL-out', 'w': 1200, 'h': 1200, 'fov': 17, 'pos': [hl[0] + 1.15, hl[1], hl[2]], 'at': hl},
        {'name': 'handR-palm', 'w': 1200, 'h': 1200, 'fov': 13, 'pos': [hr[0], hr[1] + 0.02, hr[2] + 1.15], 'at': hr},
        {'name': 'handR-back', 'w': 1200, 'h': 1200, 'fov': 13, 'pos': [hr[0], hr[1] + 0.02, hr[2] - 1.15], 'at': hr},
        {'name': 'handR-out', 'w': 1200, 'h': 1200, 'fov': 17, 'pos': [hr[0] - 1.15, hr[1], hr[2]], 'at': hr},
        {'name': 'torso-front', 'w': 1100, 'h': 1300, 'fov': 26, 'pos': [0, 1.2 * k, 1.9 * k], 'at': [0, 1.18 * k, 0]},
        {'name': 'torso-back', 'w': 1100, 'h': 1300, 'fov': 26, 'pos': [0, 1.2 * k, -1.9 * k], 'at': [0, 1.18 * k, 0]},
        {'name': 'legs-front', 'w': 1100, 'h': 1300, 'fov': 26, 'pos': [0, 0.5 * k, 1.9 * k], 'at': [0, 0.45 * k, 0]},
        {'name': 'feet-front', 'w': 1200, 'h': 1100, 'fov': 16, 'pos': [0, 0.22, 1.7], 'at': [0, 0.06, 0.03]},
    ]]
    json.dump(s, open(out, 'w'))
    print('top %.3f m; face at %s; hands at %s %s' % (top, r([fx, fy, fz]), r(hl), r(hr)))

a = sys.argv[1:]
if a[0] == 'whole': whole(a[1], float(a[2]), a[3], *a[4:6])
elif a[0] == 'close': close(a[1], float(a[2]), a[3], a[4])
else: raise SystemExit(__doc__)
