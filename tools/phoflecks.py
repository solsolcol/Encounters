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

An island is a fleck when (v27.0 build 21z: read against the body, not the sheet alone, since build 21x's first rule
also took five small pieces of real skin and 95 islands no triangle draws): it lies on a piece of the body that is painted
(at least DRAWN of it inside a triangle: tools/probes/uvcharts.mjs maps which UV chart paints each texel), that piece is
not skin (under CHART_SKIN of its texels skin), the island is a small part of it (at most AMAX texels, and at most
SHARE_ROBE of a piece of robe or SHARE of a piece that also paints some skin, MIXED or more), and of the texels round it
(within 3) that are painted, leaving out other small islands' skin, at least RING are robe (bright, unsaturated); on a
piece that also paints skin, the texels round it must be mostly painted too (RING_DRAWN: skin at such a piece's edge may
go on across its seam). A piece that is mostly skin (CHART_SKIN or more) can still carry a strip of robe, and a speck in
that strip is taken only when it is a tiny part of the piece (SHARE_SKIN), painted all round (RING_DRAWN_SKIN) and robe
all round (RING_SKIN): build 21z left out such pieces whole, and with them the specks at his left shoulder blade, which
lie in the robe's strip of the piece that paints his back (photographed: the cluster came back). The look's test: the sheet's colour, decoded from sRGB and raised to 1/2.2 as
the shader does, its saturation through smoothstep(0.12, 0.25); a texel is skin past SKIN of that.
"""
import hashlib, io, json, os, struct, subprocess, sys, tempfile
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
GLB = os.path.join(ROOT, 'assets/pho.glb')
OUT = os.path.join(ROOT, 'masters/v27.0/parts/c_phofleck.js')
SIZE, AMAX, RING, SKIN, GROW = 1024, 3000, 0.78, 0.3, 4
DRAWN, CHART_SKIN, MIXED, SHARE, SHARE_ROBE, RING_DRAWN = 0.3, 0.5, 0.2, 0.1, 0.3, 0.5
SHARE_SKIN, RING_DRAWN_SKIN, RING_SKIN = 0.05, 0.8, 0.85


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
    small = np.zeros(n + 1, bool); small[1:] = sizes < 20000
    # which piece of the body (UV chart) paints each texel, as the game reads his file
    with tempfile.TemporaryDirectory() as td:
        cm = os.path.join(td, 'charts.i32')
        subprocess.run(['node', os.path.join(ROOT, 'tools/probes/uvcharts.mjs'), GLB, 'texture_0', cm, str(W)], check=True, stdout=subprocess.DEVNULL)
        own = np.fromfile(cm, dtype='<i4').reshape(H, W)
    painted = own >= 0
    nc = int(own.max()) + 1
    ccount = np.bincount(own[painted], minlength=nc).astype(float)
    cskin = np.bincount(own[painted & skin], minlength=nc) / np.maximum(ccount, 1)
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
        o = own[Y0:Y1, X0:X1][sub]; d = o[o >= 0]
        if a > AMAX or d.size < DRAWN * a:
            continue                                         # too big to be a speck, or never drawn
        c = int(np.bincount(d).argmax())
        mixed = cskin[c] >= MIXED                            # a piece of robe that also paints some skin
        skinny = cskin[c] >= CHART_SKIN                      # a piece that is mostly skin, with a strip of robe in it
        if a > (SHARE_SKIN if skinny else SHARE if mixed else SHARE_ROBE) * ccount[c]:
            continue                                         # too much of its piece to be a speck on it
        ring = nd.binary_dilation(sub, iterations=3) & ~sub
        rp = ring & painted[Y0:Y1, X0:X1]
        other = skin[Y0:Y1, X0:X1] & (lab[Y0:Y1, X0:X1] != i) & small[lab[Y0:Y1, X0:X1]]
        cnt = int((rp & ~other).sum())
        frac = float((rp & robe[Y0:Y1, X0:X1]).sum()) / max(cnt, 1)
        if (mixed and rp.sum() < (RING_DRAWN_SKIN if skinny else RING_DRAWN) * ring.sum()) or frac < (RING_SKIN if skinny else RING):
            if frac >= 0.6:
                near.append((a, round(frac, 3), x0, y0))
            continue
        col = img[Y0:Y1, X0:X1][ring & robe[Y0:Y1, X0:X1]].mean(0)
        grown = nd.binary_dilation(sub, iterations=GROW)
        ys, xs = np.nonzero(grown)
        cy, cx = (ys + Y0) // k, (xs + X0) // k
        fid = len(flecks) + 1
        free = cover[cy, cx] == 0
        cover[cy[free], cx[free]] = fid
        flecks.append({'area': a, 'ring': round(frac, 3), 'chart': c, 'box': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)],
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
    if '--json' in sys.argv:
        json.dump(flecks, open(sys.argv[sys.argv.index('--json') + 1], 'w'))
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
          '       %d islands of skin colour lying inside the white of his robe in his body sheet (%d x %d), each on a piece of\n'
          '       robe the game draws (never a piece of skin: build 21z), each grown by\n'
          '       %d texels, as runs [row, first cell, cells] of a %d x %d mask, in the colour of the robe round it (sRGB).\n'
          '       c_scast.js lookD paints them once and lays them over his sheet; his file is unchanged. */\n'
          '    const PHO_FLECKS = { size: %d, f: [\n      %s\n    ] };\n') % (
        glbsha, len(flecks), W, H, GROW, SIZE, SIZE, SIZE, ',\n      '.join(rows))
    open(OUT, 'w').write(js)
    print('wrote', os.path.relpath(OUT, ROOT), len(js), 'bytes;', len(flecks), 'flecks,', cells, 'cells,',
          sum(len(r) for r in runs.values()), 'runs')


main()
