#!/usr/bin/env python3
"""v26.8 · THE CLOUDS' EDGES SOFTENED, AND A HALO (Chad, 13 Nov 2026: "now the cloud edges are too distinct, you can blur
it a little, or add slight haloing around the edges of the clouds, or make it blend better").

Measured first (each game picture, its alpha and the colour under it): three of the five cards were cut out hard (the tall
cloud, the flat one and the three small ones: 0.7 % of their visible pixels part-transparent, the rest 0 or 255), and under
every card's transparent ground lay a dark grey (51 to 62 of 255): a picture shrunk with distance averages that grey into
its rim, so each cloud stood out from the sky with a hard, darkened edge.

Made again here from the same sources (masters/v26.1/env/refs/*.png, GPT Image's own, alpha kept), at the same sizes as
v26.1 made them (the bank 2048 wide, the others 1024), each:
  1. resized with its colour premultiplied by its alpha (so nothing under a transparent pixel bleeds into the resize);
  2. its alpha FEATHERED: blurred by SOFT pixels (per 1024 of width), so a hard cut becomes a soft edge a few pixels wide on
     the screen; the inside of a cloud stays whole;
  3. a HALO laid outside it: the alpha blurred much wider (HALO pixels), at HALO_K of its strength, under the feathered one;
  4. the colour carried OUT from the cloud into everything round it (the cloud's own colour, averaged by its alpha squared,
     so a darker cut rim does not lead): the halo and the feathered rim are the cloud's white and grey, never the dark
     ground the generator left.
Nothing inside a cloud is repainted. The sources are not touched.
    python3 -I masters/v26.8/clouds.py            (writes assets/w3t_cloud*.webp and w3t_cirrus.webp)
"""
import os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
REFS = os.path.join(ROOT, 'masters', 'v26.1', 'env', 'refs')
SOFT, HALO, HALO_K = 3.5, 16.0, 0.30          # (pixels a 1024-wide picture; scaled with the picture's width)
CARDS = [('cloud-bank', 'w3t_cloudbank', 2048), ('cloud-tall', 'w3t_cloudtall', 1024), ('cloud-flat', 'w3t_cloudflat', 1024),
         ('cloud-three', 'w3t_cloudthree', 1024), ('cirrus', 'w3t_cirrus', 1024)]


def blur(x, sigma):
    """a separable gaussian over the last two axes (edges held by reflection)"""
    if sigma <= 0: return x
    r = int(np.ceil(sigma * 3)); k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
    def one(a, ax):
        pad = [(0, 0)] * a.ndim; pad[ax] = (r, r); a = np.pad(a, pad, mode='reflect')
        return np.apply_along_axis(lambda v: np.convolve(v, k, mode='valid'), ax, a)
    return one(one(x, x.ndim - 1), x.ndim - 2)


def make(src, dst, width):
    im = Image.open(os.path.join(REFS, src + '.png')).convert('RGBA')
    h = round(im.height * width / im.width)
    a0 = np.asarray(im).astype(np.float64) / 255.0
    pm = a0.copy(); pm[..., :3] *= pm[..., 3:4]                                 # premultiplied
    pm_img = [Image.fromarray(np.clip(pm[..., c] * 65535, 0, 65535).astype(np.uint16).astype(np.int32), mode='I') for c in range(4)]
    rs = np.stack([np.asarray(ch.resize((width, h), Image.LANCZOS)).astype(np.float64) / 65535 for ch in pm_img], -1)
    a = np.clip(rs[..., 3], 0, 1); rgb = np.where(a[..., None] > 1e-4, rs[..., :3] / np.maximum(a[..., None], 1e-4), 0)
    rgb = np.clip(rgb, 0, 1)
    s = width / 1024.0
    af = np.clip(blur(a, SOFT * s), 0, 1)                                        # 2. feathered
    ah = np.clip(blur(a, HALO * s), 0, 1) * HALO_K                               # 3. the halo
    out_a = np.maximum(af, ah)
    w2 = a * a                                                                   # 4. the cloud's own colour carried out
    num = np.stack([blur(rgb[..., c] * w2, HALO * s) for c in range(3)], -1); den = blur(w2, HALO * s)[..., None]
    far = np.where(den > 1e-5, num / np.maximum(den, 1e-5), rgb)
    keep = np.clip((a - 0.5) / 0.4, 0, 1)[..., None]                             # (inside a cloud: its own pixels)
    out_rgb = rgb * keep + far * (1 - keep)
    out = np.dstack([np.clip(out_rgb, 0, 1), out_a])
    img = Image.fromarray((out * 255 + 0.5).astype(np.uint8), mode='RGBA')
    p = os.path.join(ROOT, 'assets', dst + '.webp')
    img.save(p, 'WEBP', quality=92, alpha_quality=100, method=6)
    soft = ((out_a > 0.03) & (out_a < 0.97)).sum() / max(1, (out_a > 0.03).sum())
    print('%-16s %dx%d  part-transparent %.1f %% of what shows (was %.1f), %d bytes' % (dst, width, h, soft * 100,
          ((a > 0.03) & (a < 0.97)).sum() / max(1, (a > 0.03).sum()) * 100, os.path.getsize(p)))


if __name__ == '__main__':
    only = sys.argv[1:]
    for src, dst, width in CARDS:
        if only and dst not in only: continue
        make(src, dst, width)
