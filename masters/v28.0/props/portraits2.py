#!/usr/bin/env python3
"""v28.0 · THE PARTY LIST'S PORTRAITS CUT OUT (Chad's R54, 23 Nov 2026: "the portraits should sit cleanly in the switcher ui
with no black background"; R53 and R56: the tiles narrower, the portraits in his fighting-game screenshot's look). From a
picture of each one's head and shoulders on a keying green (the game's own renders, tools/probes/e4c5portrait.mjs BG=0x00ff00,
or a painted portrait asked for on that green): the green keyed out (its edge kept soft, the green that spilled onto the hair
and the skin's edge taken back to the colours beside it), cropped square round the head and shoulders (the top of the head a
little under the top, the head about half the square), written as a PNG with its own alpha, 256 x 256 (the tile draws it into
a 46 x 42 box: 5.5 of its pixels a CSS pixel, enough for a phone at three device pixels a point).
    python3 -I masters/v28.0/props/portraits2.py <pho picture> <zav picture> [out dir]   (from the repo root; out: assets/) """
import os, sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

# (his look is the scan's own light; his student is lit by the fight's dim trance light, lifted to read on the tile: the
#  first portraits' numbers, portraits.py)
LIFT = {'pho': 1.04, 'zav': 1.55}
# (how much of the square his head down to that narrowest row fills: the student's collar stands up round his neck, so his
#  narrowest row is his jaw, not his neck, and his chin lies under it)
FILL = {'pho': 0.82, 'zav': 0.70}

def cut(path, out, who, N=256):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    R, G, B = im[..., 0], im[..., 1], im[..., 2]
    gd = G - np.maximum(R, B)                                   # how much greener than its other two: the backdrop is all green
    a = 1.0 - np.clip((gd - 28.0) / (110.0 - 28.0), 0.0, 1.0)   # (a soft edge: 28 and under is the subject, 110 and over the backdrop)
    a[:48, :] = 0.0                                             # (the line drawn at the top left is never him: the HUD's, left on the canvas)
    # the green spilled on his edge taken back: green no higher than the brighter of red and blue
    G2 = np.minimum(G, np.maximum(R, B) * 1.02 + 6.0)
    rgb = np.stack([R, np.where(a < 0.999, G2, G), B], axis=-1)
    alpha = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    al = np.asarray(alpha).astype(np.float32) / 255.0
    ys, xs = np.nonzero(al > 0.5)
    if len(xs) < 2000: raise SystemExit(f'{path}: no figure found on the green')
    top = ys.min(); H, W = al.shape
    # (his head by its own outline: the top of his head (or his hair) down to his neck, the narrowest row of him in the lower
    #  half of the picture under it; its middle the middle of those rows. Read from the head's top and its width alone, the
    #  student's tall hair gave a square that ended at his eyes)
    rows = {y: np.nonzero(al[y] > 0.5)[0] for y in range(top, H)}
    wid = {y: (r.max() - r.min() if len(r) else 0) for y, r in rows.items()}
    lo = int(top + 0.45 * (H - top))
    neck = min((y for y in range(lo, H) if wid[y] > 0), key=lambda y: wid[y])
    cx = float(np.median([(rows[y].min() + rows[y].max()) / 2 for y in range(top, neck) if len(rows[y])]))
    side = min(H, W, int((neck - top) / FILL[who])); x0 = int(cx - side / 2); y0 = int(top - side * 0.06)
    x0 = min(max(0, x0), W - side); y0 = min(max(0, y0), H - side)
    # (graded as the first portraits were: his student lifted out of the fight's dim light, a touch of contrast; the colour
    #  only, never the edge)
    lit = Image.fromarray(rgb.clip(0, 255).astype(np.uint8), 'RGB')
    lit = ImageEnhance.Contrast(ImageEnhance.Brightness(lit).enhance(LIFT[who])).enhance(1.08)
    rgba = np.dstack([np.asarray(lit).astype(np.float32), al * 255.0]).clip(0, 255).astype(np.uint8)
    crop = Image.fromarray(rgba, 'RGBA').crop((x0, y0, x0 + side, y0 + side)).resize((N, N), Image.LANCZOS)
    crop.save(out, 'PNG', optimize=True)
    print(os.path.basename(path), 'head', (top, neck), 'box', (x0, y0, side), '->', out, os.path.getsize(out), 'bytes')

pho, zav = sys.argv[1], sys.argv[2]
od = sys.argv[3] if len(sys.argv) > 3 else 'assets'
cut(pho, os.path.join(od, 'p5portpho.png'), 'pho'); cut(zav, os.path.join(od, 'p5portzav.png'), 'zav')
