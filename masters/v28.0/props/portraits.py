#!/usr/bin/env python3
"""v28.0 · THE PARTY LIST'S TWO PORTRAITS (Chad's R49: "It should show the character potraits with the name"), made from the
game's own renders of the two bodies (tools/probes/e4c5portrait.mjs: everything but the one body hidden, a dark backdrop,
the lens in front of his face at a portrait's 26 degrees from 1.0 m). Grandmaster Pho's likeness never goes to a picture
service (his model is made from photographs of a real man), so neither portrait does: each is the render, cropped round the
face to the tile's own shape (48 by 38: the engine draws it cover-fit into a 240 x 190 canvas) and graded a little (its
level lifted to the tile's light, a soft vignette), never repainted.
    python3 -I masters/v28.0/props/portraits.py <dir of the probe's pictures> <pho take> <zav take>
    e.g.  python3 -I masters/v28.0/props/portraits.py $S/e4c5/portrait2 0 0
Each crop is the face's own box found in the render (the pixels brighter than the backdrop), so a lens a few centimetres off
still crops the same: its middle a little above the box's middle (the eyes), its height 1.55 of the box's width."""
import os, sys
from PIL import Image, ImageEnhance, ImageFilter, ImageChops, ImageDraw
import numpy as np

SRC, TAKE = sys.argv[1], {'pho': sys.argv[2], 'zav': sys.argv[3]}
OUT = {'pho': 'assets/p5portpho.jpg', 'zav': 'assets/p5portzav.jpg'}
W, H = 480, 380                                   # the file: twice the canvas it is drawn into, the tile's own shape
# (his look is the scan's own light; his student is lit by the fight's dim trance light, lifted to read on the tile)
LIFT = {'pho': 1.04, 'zav': 1.55}
# (where the face sits under the body's top: his student's hair stands tall over his head, so his face lies lower in the box)
CY = {'pho': 0.47, 'zav': 0.6}; CHK = {'pho': 1.55, 'zav': 1.6}

for who in ('pho', 'zav'):
    im = Image.open(os.path.join(SRC, f'{who}-{TAKE[who]}.png')).convert('RGB')
    a = np.asarray(im).astype(np.int32)
    bg = np.array([11, 13, 18])                   # the probe's backdrop (0x0b0d12)
    fg = (np.abs(a - bg).sum(axis=2) > 36)
    fg[:90, :] = False                            # (the HUD's heart line at the top left is never the face)
    ys, xs = np.nonzero(fg)
    if len(xs) < 1000: raise SystemExit(f'{who}: no body found in the render')
    # (the head: the body's top rows, its width read where the body is narrowest under its top, the neck)
    top = ys.min(); rows = {}
    for y in range(top, min(a.shape[0], top + 700)):
        r = np.nonzero(fg[y])[0]
        if len(r): rows[y] = (r.min(), r.max())
    cx = int(np.median([(l + r) / 2 for (l, r) in rows.values()]))
    hw = int(np.percentile([r - l for (l, r) in rows.values()], 60))
    ch = int(hw * CHK[who]); cw = int(ch * W / H)
    cy = top + int(ch * CY[who])
    # (the box slid inside the render, never cut at its edge: a cut box would be stretched to the tile's shape)
    x0 = min(max(0, cx - cw // 2), im.width - cw); y0 = min(max(0, cy - ch // 2), im.height - ch)
    box = (x0, y0, x0 + cw, y0 + ch)
    crop = im.crop(box).resize((W, H), Image.LANCZOS)
    crop = ImageEnhance.Brightness(crop).enhance(LIFT[who])
    crop = ImageEnhance.Contrast(crop).enhance(1.08)
    # (a soft vignette: the edges a quarter darker, so the face holds the tile)
    v = Image.new('L', (W, H), 0); d = ImageDraw.Draw(v); d.ellipse((-W * 0.18, -H * 0.2, W * 1.18, H * 1.25), fill=255)
    v = v.filter(ImageFilter.GaussianBlur(60)); dark = ImageEnhance.Brightness(crop).enhance(0.72)
    crop = Image.composite(crop, dark, v)
    crop.save(OUT[who], 'JPEG', quality=90, optimize=True, progressive=False)
    print(who, 'box', box, '->', OUT[who], os.path.getsize(OUT[who]), 'bytes')
