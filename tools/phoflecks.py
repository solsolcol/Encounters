#!/usr/bin/env python3
"""R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen during
gameplay"). Grandmaster Pho's body sheet (assets/pho.glb, the image named texture_0) holds small islands of skin colour
lying inside the white of his robe. Look D (c_scast.js lookD) draws whatever its colour test calls skin UNLIT, at the
skin's own colour, so each island stands out of the lit robe as an orange speck.

His file is never changed (his standing rule, v12.4: a ruling is applied at runtime). This reads the sheet straight out
of his file, finds every island the look's own test calls skin that lies wholly inside robe, and writes the chapter part
masters/v27.0/parts/c_phofleck.js: each island (grown by GROW texels) as runs of a SIZE x SIZE mask, in the colour of the
robe round it. The chapter paints those runs on a canvas once and lays it over his sheet in the shader (premultiplied:
a texel of the mask is either the robe's colour, opaque, or nothing).

    python3 -I tools/phoflecks.py [--report]      (from the repo root; numpy, Pillow and scipy)

An island is a fleck when: its area is at most AMAX texels, and at least RING of the texels within 3 of it are robe
(bright, unsaturated). The look's test: the sheet's colour, decoded from sRGB and raised to 1/2.2 as the shader does,
its saturation through smoothstep(0.12, 0.25); a texel is skin past SKIN of that.
"""
import hashlib, io, json, os, struct, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
GLB = os.path.join(ROOT, 'assets/pho.glb')
OUT = os.path.join(ROOT, 'masters/v27.0/parts/c_phofleck.js')
SIZE, AMAX, RING, SKIN, GROW = 1024, 3000, 0.85, 0.3, 4


def sheet():
    b = open(GLB, 'rb').read()
    n = struct.unpack('<I', b[12:16])[0]
    j = json.loads(b[20:20 + n])
    off = 20 + n
    bl = struct.unpack('<I', b[off:off + 4])[0]
    binc = b[off + 8:off + 8 + bl]
    im = next(i for i in j['images'] if i.get('name') == 'texture_0')
    bv = j['bufferViews'][im['bufferView']]
    data = binc[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]
    return data, hashlib.sha1(b).hexdigest()


def main():
    data, glbsha = sheet()
    img = np.asarray(Image.open(io.BytesIO(data)).convert('RGB')).astype(np.float64) / 255.0
    H, W = img.shape[:2]
    lin = np.where(img <= 0.04045, img / 12.92, ((img + 0.055) / 1.055) ** 2.4)
    sc = np.maximum(lin, 1e-4) ** (1 / 2.2)
    mx, mn = sc.max(2), sc.min(2)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    t = np.clip((sat - 0.12) / 0.13, 0, 1)
    skn = t * t * (3 - 2 * t)
    skin = skn > SKIN
    robe = (mx > 0.55) & (sat < 0.12)
    lab, n = nd.label(skin, structure=np.ones((3, 3)))
    sizes = nd.sum(skin, lab, index=np.arange(1, n + 1))
    objs = nd.find_objects(lab)
    k = W // SIZE
    cover = np.zeros((SIZE, SIZE), np.int32)                 # which fleck (1-based) owns each cell of the mask
    flecks, near = [], []
    for i, sl in enumerate(objs, start=1):
        if sl is None:
            continue
        a = int(sizes[i - 1])
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        Y0, Y1, X0, X1 = max(0, y0 - 8), min(H, y1 + 8), max(0, x0 - 8), min(W, x1 + 8)
        sub = lab[Y0:Y1, X0:X1] == i
        ring = nd.binary_dilation(sub, iterations=3) & ~sub
        rr = robe[Y0:Y1, X0:X1][ring]
        frac = float(rr.mean()) if rr.size else 0.0
        if a > AMAX or frac < RING:
            if a <= 4 * AMAX and frac >= 0.6:
                near.append((a, round(frac, 3), x0, y0))
            continue
        col = img[Y0:Y1, X0:X1][ring & robe[Y0:Y1, X0:X1]].mean(0)
        grown = nd.binary_dilation(sub, iterations=GROW)
        ys, xs = np.nonzero(grown)
        cy, cx = (ys + Y0) // k, (xs + X0) // k
        fid = len(flecks) + 1
        free = cover[cy, cx] == 0
        cover[cy[free], cx[free]] = fid
        flecks.append({'area': a, 'ring': round(frac, 3), 'box': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)],
                       'c': [int(round(v * 255)) for v in col]})
    # runs of each fleck's cells, row by row
    runs = {f: [] for f in range(1, len(flecks) + 1)}
    for y in range(SIZE):
        row = cover[y]
        nz = np.nonzero(row)[0]
        if not nz.size:
            continue
        s = nz[0]
        for j in range(1, nz.size + 1):
            if j == nz.size or nz[j] != nz[j - 1] + 1 or row[nz[j]] != row[s]:
                runs[int(row[s])].append([y, int(s), int(nz[j - 1] - s + 1)])
                if j < nz.size:
                    s = nz[j]
    cells = int((cover > 0).sum())
    if '--report' in sys.argv:
        print('sheet', W, 'x', H, 'islands', n, 'flecks', len(flecks), 'texels', sum(f['area'] for f in flecks),
              'mask cells', cells, 'of', SIZE * SIZE)
        print('largest', sorted(f['area'] for f in flecks)[-12:])
        print('rejected near the line (area, ring, x, y):', sorted(near, key=lambda r: -r[1])[:20])
    rows = []
    for f in range(1, len(flecks) + 1):
        F = flecks[f - 1]
        flat = [v for r in runs[f] for v in r]
        rows.append('[%d, %d, %d, [%s]]' % (F['c'][0], F['c'][1], F['c'][2], ','.join(map(str, flat))))
    js = ('    /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen\n'
          '       during gameplay"). WRITTEN BY tools/phoflecks.py from assets/pho.glb (sha1 %s), never by hand:\n'
          '       %d islands of skin colour lying wholly inside the white of his robe in his body sheet (%d x %d), each grown by\n'
          '       %d texels, as runs [row, first cell, cells] of a %d x %d mask, in the colour of the robe round it (sRGB).\n'
          '       c_scast.js lookD paints them once and lays them over his sheet; his file is unchanged. */\n'
          '    const PHO_FLECKS = { size: %d, f: [\n      %s\n    ] };\n') % (
        glbsha, len(flecks), W, H, GROW, SIZE, SIZE, SIZE, ',\n      '.join(rows))
    open(OUT, 'w').write(js)
    print('wrote', os.path.relpath(OUT, ROOT), len(js), 'bytes;', len(flecks), 'flecks,', cells, 'cells,',
          sum(len(r) for r in runs.values()), 'runs')


main()
