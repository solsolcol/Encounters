#!/usr/bin/env python3
"""v26.18 · THE HALL'S MURAL: HIS PICTURE IN THE COLOURS OF THE HALL'S OWN PRINT (Chad, 16 Nov 2026: "I believe this is
the wall mural at the back of the hall, but you need to adjust the colour to look like the reference photo").

  python3 -I masters/v26.18/backdrop/mural.py <artwork.jpg> <outdir> <photo.jpg> <reg.json> [<photo.jpg> <reg.json> ...]

WHAT WAS MEASURED (register.py, then this): the banner in his photographs 5 and 10 is the WHOLE picture, stretched to
the banner's shape (1.80 and 1.83 times wider than tall, the two photographs agreeing); printed, it is one slate-violet
colour, light where the picture is pink, mauve or white and dark where it is golden or brown (the photographs' light
follows red and blue up and green down, the same in both); its whites are held to the middle of the range and its
blacks lifted; and its left third is darker than the rest by the same share in both photographs.

THE MAP, fitted on every clear pixel of the banner in each photograph (the pairs the first pass fits worst are left
out of the second: a candle's glare, a statue's edge):
  grey = a mix of the picture's red, green and blue (one mix for both photographs);
  colour = a curve of that grey, a channel (a cubic; one set a photograph, the two averaged: the photographs differ in
           their camera's white, 5 the bluer);
  light across the banner = a smooth curve of the place across it (one for both).
Written: mural.jpg (the picture at its own size in the fitted colours, the dark left side in it, a navy border round
it as the print has), fit.json (every number), and compare-<n>.png for each photograph (its banner above, the mural
laid in its place below), to be looked at full size."""
import sys, json, os
import numpy as np
from PIL import Image, ImageFilter
art_p, out = sys.argv[1:3]; rest = sys.argv[3:]
os.makedirs(out, exist_ok=True)
artI = Image.open(art_p).convert('RGB'); AW, AH = artI.size
art = np.asarray(artI, dtype=np.float32) / 255
LUM = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
def pairs(photo, reg):
    R = json.load(open(reg)); sx, sy, tx, ty = R['sx'], R['sy'], R['tx'], R['ty']
    phI = Image.open(photo).convert('RGB')
    w = int(round(AW * sx)); h = int(round(AH * sy)); x0 = int(round(tx)); y0 = int(round(ty))
    artS = np.asarray(artI.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2.0)), dtype=np.float32) / 255
    phB = np.asarray(phI.filter(ImageFilter.GaussianBlur(2.0)), dtype=np.float32) / 255
    A = []; P = []; X = []
    for (xa, ya, xb, yb) in R['rects']:
        a = artS[ya - y0:yb - y0, xa - x0:xb - x0]; p = phB[ya:yb, xa:xb]
        hh = min(a.shape[0], p.shape[0]); ww = min(a.shape[1], p.shape[1])
        xs = np.tile((np.arange(xa, xa + ww) - x0) / w, (hh, 1))
        A.append(a[:hh, :ww].reshape(-1, 3)); P.append(p[:hh, :ww].reshape(-1, 3)); X.append(xs.ravel())
    return np.concatenate(A), np.concatenate(P), np.concatenate(X), R, phI
D = [pairs(rest[i], rest[i + 1]) for i in range(0, len(rest), 2)]
KN = np.linspace(0, 1, 7)                                   # the light across the banner: seven knots, straight between
def gainOf(x, g): return np.interp(x, KN, g)
gain = np.ones(len(KN)); wmix = None; curves = None
for it in range(6):
    # the mix: the photographs' light (its own gain taken out, each photograph brought to one mean) on the picture's three colours
    F = []; Yt = []
    for (A, P, X, R, _) in D:
        y = (P @ LUM) / gainOf(X, gain); F.append(np.concatenate([A, np.ones((len(A), 1), np.float32)], 1)); Yt.append(y / y.mean())
    F = np.concatenate(F); Yt = np.concatenate(Yt)
    keep = np.ones(len(F), bool)
    for _ in range(2):
        wmix, *_ = np.linalg.lstsq(F[keep], Yt[keep], rcond=None); e = np.abs(F @ wmix - Yt); keep = e < np.quantile(e, 0.92)
    # the curves: a cubic of the grey, a channel, a photograph
    curves = []
    for (A, P, X, R, _) in D:
        g = np.concatenate([A, np.ones((len(A), 1), np.float32)], 1) @ wmix
        G = np.stack([np.ones_like(g), g, g * g, g ** 3], 1); T = P / gainOf(X, gain)[:, None]
        keep = np.ones(len(g), bool)
        for _ in range(2):
            c, *_ = np.linalg.lstsq(G[keep], T[keep], rcond=None); e = np.abs(G @ c - T).max(1); keep = e < np.quantile(e, 0.92)
        curves.append(c)
    # the light across: at each knot's stretch, the photographs' light over the fitted light, both photographs together
    num = np.zeros(len(KN)); den = np.zeros(len(KN))
    for (A, P, X, R, _), c in zip(D, curves):
        g = np.concatenate([A, np.ones((len(A), 1), np.float32)], 1) @ wmix
        pred = (np.stack([np.ones_like(g), g, g * g, g ** 3], 1) @ c) @ LUM; obs = P @ LUM
        for k in range(len(KN)):
            wgt = np.clip(1 - np.abs(X - KN[k]) / (KN[1] - KN[0]), 0, 1); num[k] += (wgt * obs).sum(); den[k] += (wgt * pred).sum()
    gain = np.where(den > 0, num / np.maximum(den, 1e-6), 1.0); gain = gain / gain.max()
gmin, gmax = [], []
for (A, P, X, R, _) in D:
    g = np.concatenate([A, np.ones((len(A), 1), np.float32)], 1) @ wmix; gmin.append(np.quantile(g, 0.002)); gmax.append(np.quantile(g, 0.998))
G0, G1 = float(min(gmin)), float(max(gmax))                 # the greys the fit has seen: the curves are not trusted past them
def mapArt(a, c, xs=None):
    g = np.clip(np.concatenate([a.reshape(-1, 3), np.ones((a.shape[0] * a.shape[1], 1), np.float32)], 1) @ wmix, G0, G1)
    o = np.stack([np.ones_like(g), g, g * g, g ** 3], 1) @ c
    o = o.reshape(a.shape)
    if xs is not None: o = o * gainOf(xs, gain)[None, :, None]
    return np.clip(o, 0, 1)
errs = []
for (A, P, X, R, _), c in zip(D, curves):
    g = np.clip(np.concatenate([A, np.ones((len(A), 1), np.float32)], 1) @ wmix, G0, G1)
    pred = (np.stack([np.ones_like(g), g, g * g, g ** 3], 1) @ c) * gainOf(X, gain)[:, None]
    errs.append(float(np.abs(pred - P).mean() * 255))
print('the mix (r, g, b, 1):', np.round(wmix, 3).tolist()); print('the light across the banner, left to right:', np.round(gain, 3).tolist()); print('mean error a photograph, of 255:', [round(e, 1) for e in errs])
cav = np.mean(np.stack(curves), 0)
xs = (np.arange(AW) + 0.5) / AW
mural = mapArt(art, cav, xs)
# the print's navy border (sampled from the photograph: #27334d), three centimetres on a banner 4.4 m by 2.9 m
bw = max(2, int(round(0.03 / 4.4 * AW))); bh = max(2, int(round(0.03 / 2.9 * AH)))
full = np.empty((AH + 2 * bh, AW + 2 * bw, 3), np.float32); full[:] = np.array([0x27, 0x33, 0x4d], np.float32) / 255 * float(gain.mean())
full[bh:bh + AH, bw:bw + AW] = mural
Image.fromarray((full * 255 + 0.5).astype(np.uint8)).save(out + '/mural.jpg', quality=93, subsampling=0)
json.dump({'mix': wmix.tolist(), 'curves': [c.tolist() for c in curves], 'curve_used': cav.tolist(), 'gain_knots': KN.tolist(), 'gain': gain.tolist(), 'grey_range': [G0, G1],
           'mean_abs_error_255': errs, 'border_px': [bw, bh], 'size': [AW + 2 * bw, AH + 2 * bh], 'photos': [os.path.basename(rest[i]) for i in range(0, len(rest), 2)]}, open(out + '/fit.json', 'w'), indent=1)
# beside each photograph: its banner above, the mural in its place below (each photograph's own curve: its own white)
for n, ((A, P, X, R, phI), c) in enumerate(zip(D, curves)):
    sx, sy, tx, ty = R['sx'], R['sy'], R['tx'], R['ty']; w = int(round(AW * sx)); h = int(round(AH * sy)); x0 = int(round(tx)); y0 = int(round(ty))
    small = np.asarray(artI.resize((w, h), Image.LANCZOS), dtype=np.float32) / 255
    m2 = mapArt(small, c, (np.arange(w) + 0.5) / w)
    canvas = np.asarray(phI, dtype=np.float32).copy() / 255; hh = min(h, canvas.shape[0] - y0); canvas[y0:y0 + hh, x0:x0 + w] = m2[:hh]
    box = (max(0, x0 - 14), max(0, y0 - 14), min(phI.size[0], x0 + w + 14), min(phI.size[1], y0 + h + 14))
    a = phI.crop(box); b = Image.fromarray((canvas * 255 + 0.5).astype(np.uint8)).crop(box); k = 2
    both = Image.new('RGB', (a.size[0] * k, a.size[1] * k * 2 + 12), (16, 16, 16)); both.paste(a.resize((a.size[0] * k, a.size[1] * k), Image.LANCZOS), (0, 0)); both.paste(b.resize((a.size[0] * k, a.size[1] * k), Image.LANCZOS), (0, a.size[1] * k + 12))
    both.save(out + '/compare-%d.png' % n); print('compare-%d.png' % n, both.size)
print('mural.jpg', full.shape[1], 'x', full.shape[0], '; mean colour', (full.reshape(-1, 3).mean(0) * 255).round(1).tolist())
