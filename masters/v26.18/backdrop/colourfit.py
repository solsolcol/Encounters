#!/usr/bin/env python3
"""v26.18 · HIS MURAL IN THE HALL'S OWN COLOURS (Chad: "you need to adjust the colour to look like the reference photo").

  python3 -I masters/v26.18/backdrop/colourfit.py <artwork.jpg> <hall-05.jpg> <reg.json> <outdir>

With the place of the artwork on the banner known (register.py), every clear pixel of the banner in his photograph 5 is
paired with the artwork's pixel printed there, and one colour map is fitted from the artwork's colours to the
photograph's (least squares, twice, the second time without the pairs the first fitted worst: a candle's glare, a
statue's edge). Two maps are fitted and the better kept: a plain 3 x 4 (each output a mix of the three inputs and a
constant) and one with the squares and products added. Written: fit.json (the map, its error), compare.png (the
photograph's banner beside the artwork laid in its place in the fitted colours: looked at full size), and
mural.png (the whole artwork in the fitted colours, at its own size)."""
import sys, json, os
import numpy as np
from PIL import Image, ImageFilter
art_p, photo_p, reg_p, out = sys.argv[1:5]
os.makedirs(out, exist_ok=True)
R = json.load(open(reg_p)); sx, sy, tx, ty = R['sx'], R['sy'], R['tx'], R['ty']
artI = Image.open(art_p).convert('RGB'); phI = Image.open(photo_p).convert('RGB')
art = np.asarray(artI, dtype=np.float32) / 255; ph = np.asarray(phI, dtype=np.float32) / 255
AH, AW = art.shape[:2]
# the artwork brought into the photograph's frame (the print is the artwork stretched: a resize, then a place)
w = int(round(AW * sx)); h = int(round(AH * sy))
artS = np.asarray(artI.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255
phB = np.asarray(phI.filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255
x0 = int(round(tx)); y0 = int(round(ty))
RECTS = [(466, 717, 655, 835), (747, 707, 973, 860), (200, 676, 430, 799), (451, 684, 737, 727), (300, 800, 400, 880), (690, 700, 745, 800)]
A = []; P = []; lab = []
for i, (xa, ya, xb, yb) in enumerate(RECTS):
    a = artS[ya - y0:yb - y0, xa - x0:xb - x0].reshape(-1, 3); p = phB[ya:yb, xa:xb].reshape(-1, 3)
    A.append(a); P.append(p); lab.append(np.full(len(a), i))
A = np.concatenate(A); P = np.concatenate(P); lab = np.concatenate(lab)
def feats(a, deg):
    r, g, b = a[:, 0], a[:, 1], a[:, 2]; one = np.ones_like(r)
    if deg == 1: return np.stack([r, g, b, one], 1)
    return np.stack([r, g, b, r * r, g * g, b * b, r * g, r * b, g * b, one], 1)
def fit(deg):
    F = feats(A, deg); keep = np.ones(len(A), bool)
    for _ in range(3):
        M, *_ = np.linalg.lstsq(F[keep], P[keep], rcond=None)
        err = np.abs(F @ M - P).max(1); keep = err < np.quantile(err, 0.9)
    e = np.abs(F @ M - P)
    return M, float(e.mean()), float(np.quantile(e, 0.95)), [float(np.abs(F[lab == i] @ M - P[lab == i]).mean()) for i in range(len(RECTS))], [(F[lab == i] @ M - P[lab == i]).mean(0).round(3).tolist() for i in range(len(RECTS))]
res = {}
for deg in (1, 2):
    M, mean, q95, per, bias = fit(deg); res[deg] = (M, mean, q95, per, bias)
    print('degree', deg, 'mean abs error', round(mean * 255, 2), '/255; 95th', round(q95 * 255, 1), '; per part', [round(x * 255, 1) for x in per]); print('  each part\'s bias (r, g, b)', bias)
deg = 2 if res[2][1] < res[1][1] * 0.9 else 1
M = res[deg][0]
apply = lambda img: np.clip(feats(img.reshape(-1, 3), deg) @ M, 0, 1).reshape(img.shape)
json.dump({'degree': deg, 'map': M.tolist(), 'mean_abs_error_255': res[deg][1] * 255, 'q95_255': res[deg][2] * 255, 'reg': R,
           'art_mean': art.reshape(-1, 3).mean(0).tolist(), 'photo_pairs_mean': P.mean(0).tolist()}, open(out + '/fit.json', 'w'), indent=1)
# the whole artwork in the fitted colours, its own size
mural = apply(art); Image.fromarray((mural * 255 + 0.5).astype(np.uint8)).save(out + '/mural.png')
# the comparison: the photograph's banner (left), the artwork in its place and the fitted colours (right), at twice the photograph's pixels
bx0, by0, bx1, by1 = 170, 650, 1015, 1250
left = phI.crop((bx0, by0, bx1, by1))
canvas = np.asarray(phI, dtype=np.float32).copy() / 255
m2 = apply(np.asarray(artI.resize((w, h), Image.LANCZOS), dtype=np.float32) / 255)
canvas[y0:y0 + h, x0:x0 + w] = m2[:canvas.shape[0] - y0, :]
right = Image.fromarray((canvas * 255 + 0.5).astype(np.uint8)).crop((bx0, by0, bx1, by1))
W2 = (bx1 - bx0) * 2; H2 = (by1 - by0) * 2
both = Image.new('RGB', (W2, H2 * 2 + 12), (20, 20, 20))
both.paste(left.resize((W2, H2), Image.LANCZOS), (0, 0)); both.paste(right.resize((W2, H2), Image.LANCZOS), (0, H2 + 12))
both.save(out + '/compare.png')
print('kept degree', deg, '; mural', mural.shape, 'mean', (mural.reshape(-1, 3).mean(0) * 255).round(1), 'photo pairs mean', (P.mean(0) * 255).round(1), 'art pairs mean', (A.mean(0) * 255).round(1))
