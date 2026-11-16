#!/usr/bin/env python3
"""v26.18 · WHERE HIS MURAL SITS ON THE HALL'S BANNER (Chad, 16 Nov 2026: "I believe this is the wall mural at the back
of the hall, but you need to adjust the colour to look like the reference photo").

  python3 -I masters/v26.18/backdrop/register.py <artwork.jpg> <hall-05.jpg> <out.json>

The banner in his photograph 5 is the artwork printed stretched: this finds the stretch and the place (photo = art * s + t,
an axis each) by the correlation of the two pictures' light over the parts of the banner nothing stands in front of
(its face, its upper right figures, its upper left leaves, the hair's top), coarse then fine. Numbers only: the check
is the overlay the next step draws, looked at full size."""
import sys, json
import numpy as np
from PIL import Image
art_p, photo_p, out_p = sys.argv[1:4]
# (a second photograph of the banner: its clear parts and where its eyes' middle is, as a fourth argument, JSON)
CFG = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
art = np.asarray(Image.open(art_p).convert('L'), dtype=np.float32)
ph = np.asarray(Image.open(photo_p).convert('L'), dtype=np.float32)
AH, AW = art.shape
# the banner's clear parts in the photograph's own pixels (x0, y0, x1, y1)
RECTS = [tuple(r) for r in CFG.get('rects', [(466, 717, 655, 835), (747, 707, 973, 860), (200, 676, 430, 799), (451, 684, 737, 727)])]
EYE = CFG.get('eye', [586, 809])
pts = []
for x0, y0, x1, y1 in RECTS:
    ys, xs = np.mgrid[y0:y1:2, x0:x1:2]
    pts.append(np.stack([xs.ravel(), ys.ravel()], 1))
pts = np.concatenate(pts).astype(np.float32)
pv = ph[pts[:, 1].astype(int), pts[:, 0].astype(int)]
# each rectangle is compared on its own light (the print is lit unevenly), so the mean is taken out a rectangle
lab = np.concatenate([np.full(((y1 - y0 + 1) // 2) * ((x1 - x0 + 1) // 2), i) for i, (x0, y0, x1, y1) in enumerate(RECTS)])
def sample(sx, sy, tx, ty):
    u = (pts[:, 0] - tx) / sx; v = (pts[:, 1] - ty) / sy
    ok = (u >= 0) & (u < AW - 1) & (v >= 0) & (v < AH - 1)
    u0 = np.clip(u, 0, AW - 2); v0 = np.clip(v, 0, AH - 2)
    iu = u0.astype(int); iv = v0.astype(int); fu = u0 - iu; fv = v0 - iv
    a = art[iv, iu] * (1 - fu) * (1 - fv) + art[iv, iu + 1] * fu * (1 - fv) + art[iv + 1, iu] * (1 - fu) * fv + art[iv + 1, iu + 1] * fu * fv
    return a, ok
def score(sx, sy, tx, ty):
    a, ok = sample(sx, sy, tx, ty)
    if ok.mean() < 0.9: return -1
    tot = 0; n = 0
    for i in range(len(RECTS)):
        m = (lab == i) & ok
        if m.sum() < 50: continue
        x = a[m] - a[m].mean(); y = pv[m] - pv[m].mean()
        d = np.sqrt((x * x).sum() * (y * y).sum())
        if d > 0: tot += (x * y).sum() / d * m.sum(); n += m.sum()
    return tot / max(n, 1)
best = (-2, None)
for sx in np.arange(0.46, 0.82, 0.02):
    for sy in np.arange(0.26, 0.64, 0.02):
        tx0 = EYE[0] - sx * 603; ty0 = EYE[1] - sy * 418
        for dx in range(-48, 49, 8):
            for dy in range(-48, 49, 8):
                s = score(sx, sy, tx0 + dx, ty0 + dy)
                if s > best[0]: best = (s, (sx, sy, tx0 + dx, ty0 + dy))
print('coarse', best)
s, (sx, sy, tx, ty) = best
step = [0.01, 0.01, 4, 4]
for it in range(60):
    moved = False
    for k in range(4):
        for sg in (-1, 1):
            q = [sx, sy, tx, ty]; q[k] += sg * step[k]
            s2 = score(*q)
            if s2 > s + 1e-6: s = s2; sx, sy, tx, ty = q; moved = True
    if not moved:
        step = [x / 2 for x in step]
        if step[0] < 0.0006: break
print('fine', s, sx, sy, tx, ty)
per = []
a, ok = sample(sx, sy, tx, ty)
for i in range(len(RECTS)):
    m = (lab == i) & ok; x = a[m] - a[m].mean(); y = pv[m] - pv[m].mean()
    per.append(float((x * y).sum() / np.sqrt((x * x).sum() * (y * y).sum())))
json.dump({'sx': float(sx), 'sy': float(sy), 'tx': float(tx), 'ty': float(ty), 'score': float(s), 'per_rect': per, 'art': [AW, AH], 'rects': [list(r) for r in RECTS]}, open(out_p, 'w'), indent=1)
print('per rect', per)
