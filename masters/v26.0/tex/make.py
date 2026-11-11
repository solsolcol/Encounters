#!/usr/bin/env python3
"""v26.0 · the ground's surfaces, from the generated pictures (masters/v26.0/tex/src/<name>.png, ignored by git; their
jobs are tex/jobs-tex.json and their prompts tex/PROMPTS.txt) to the game's files (assets/w3t_<name>.jpg, or .webp where
the surface has holes). Run from the repo root:   python3 -I masters/v26.0/tex/make.py [name ...]

Each row: name, width, height, how:
  blend   a surface with no pattern to break (grass, earth, gravel, petals): made to repeat exactly, by laying the
          picture's own middle over the join of its wrapped copy with a soft edge
  asis    a patterned surface (planks, tiles, cloth): kept as it came; the chapter repeats it only in the direction its
          join is clean, or mirrors it (the table says which in the note, and the chapter's code follows it)
  key     cut out of its magenta ground: alpha from how magenta a point is, the pink spill taken off its edges, and the
          colour under the cut-away part filled from its neighbours so no magenta shows at a distance
The pictures are never retouched beyond that (v5.10: only the fill between islands is touched)."""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')
TABLE = [
    # name        w     h     how      note
    ('turf',      1024, 1024, 'blend', 'repeats both ways, one tile 2 m'),
    ('petalturf', 1024, 1024, 'blend', 'the turf deep in petals: repeats both ways, one tile 2 m'),
    ('earth',     512,  512,  'blend', 'repeats both ways, one tile 2.5 m'),
    ('gravel',    512,  512,  'blend', 'repeats both ways, one tile 1.5 m'),
    ('rooftile',  512,  512,  'asis',  'repeats sideways; mirrored up the slope is wrong for scales, so one tile spans a slope'),
    ('redplank',  512,  512,  'asis',  'mirrored both ways'),
    ('tin',       512,  512,  'asis',  'repeats both ways'),
    ('timber',    512,  512,  'asis',  'mirrored both ways'),
    ('brick',     512,  512,  'asis',  'mirrored both ways'),
    ('skirt',     512,  512,  'asis',  'mirrored sideways; one tile the skirt\'s height'),
    ('satin',     512,  512,  'asis',  'mirrored sideways; white, tinted by its material'),
    ('mat',       512,  512,  'asis',  'mirrored both ways'),
    ('carpet',    1024, 683,  'asis',  'one rug'),
    ('swag',      1024, 512,  'key',   'one garland swag, cut out'),
    ('banner',    256,  1024, 'key',   'one tiered banner, cut out; white, tinted by its material'),
    ('treeline',  2048, 640,  'key',   'the far line of trees, cut out; laid round the ground on a ring, mirrored at its joins'),
]


def blend(im):
    """repeat exactly: the wrapped copy (its joins now a cross through the middle) with the picture's own middle laid
    over that cross under a soft mask"""
    a = np.asarray(im).astype(np.float32); h, w = a.shape[:2]
    sh = np.roll(np.roll(a, h // 2, 0), w // 2, 1)
    y = np.abs(np.arange(h) - h / 2) / (h / 2); x = np.abs(np.arange(w) - w / 2) / (w / 2)
    band = 0.22
    my = np.clip(1 - y / band, 0, 1)[:, None]; mx = np.clip(1 - x / band, 0, 1)[None, :]
    m = np.maximum(my, mx); m = m * m * (3 - 2 * m)
    out = sh * (1 - m[..., None]) + a * m[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def key(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mag = np.minimum(r, b) - g                         # how magenta: about 255 on the ground, under 0 on white or green
    alpha = 1 - np.clip((mag - 40) / 110, 0, 1)
    spill = np.clip(mag, 0, None) * (alpha > 0)        # the pink left on an edge: taken out of red and blue
    r2 = r - spill; b2 = b - spill
    rgb = np.stack([r2, g, b2], -1)
    # the colour under the cut-away part, grown outward from the kept part a few pixels at a time (so a far, small copy
    # never shows the ground's colour): a point not yet known takes the average of the known points round it
    known = (alpha > 0.5).astype(np.float32); col = rgb * known[..., None]
    for _ in range(40):
        cb = np.asarray(Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(2))).astype(np.float32)
        kb = np.asarray(Image.fromarray((known * 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(2))).astype(np.float32) / 255
        grow = (known < 0.5) & (kb > 0.02)
        if not grow.any(): break
        col[grow] = cb[grow] / kb[grow][:, None]; known[grow] = 1
    full = (alpha >= 0.5)[..., None]
    out = np.dstack([np.clip(np.where(full, rgb, col), 0, 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def main():
    want = set(sys.argv[1:])
    for name, w, h, how, note in TABLE:
        if want and name not in want: continue
        p = os.path.join(SRC, name + '.png')
        if not os.path.exists(p): print('%-10s (no source yet)' % name); continue
        im = Image.open(p).convert('RGB')
        if how == 'blend': im = blend(im)
        if how == 'key':
            k = key(im)
            # cut to what is kept (a hand's width of margin), so the picture fills its piece; the piece's shape is the
            # cut's own (printed below: the chapter sizes its piece by it)
            a = np.asarray(k)[..., 3] > 127; ys, xs = np.where(a)
            pad = max(4, k.size[0] // 200)
            box = (0 if name == 'treeline' else max(0, xs.min() - pad), max(0, ys.min() - pad),
                   k.size[0] if name == 'treeline' else min(k.size[0], xs.max() + pad), k.size[1] if name == 'treeline' else min(k.size[1], ys.max() + pad))
            k = k.crop(box); note += '; cut to %dx%d, %.3f wide for 1 tall' % (k.size[0], k.size[1], k.size[0] / k.size[1])
            out = k.resize((w, h), Image.LANCZOS)
            dst = os.path.join(ROOT, 'assets', 'w3t_%s.webp' % name); out.save(dst, 'WEBP', quality=90, method=6, exact=True)
        else:
            out = im.resize((w, h), Image.LANCZOS)
            dst = os.path.join(ROOT, 'assets', 'w3t_%s.jpg' % name); out.save(dst, 'JPEG', quality=88, optimize=True)
        print('%-10s %s %dx%d  %d bytes  (%s)' % (name, os.path.basename(dst), w, h, os.path.getsize(dst), note))


if __name__ == '__main__':
    main()
