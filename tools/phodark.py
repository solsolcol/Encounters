#!/usr/bin/env python3
"""R33 (Chad, 23 Nov 2026: "Make sure all clipping, pathfinding, unnatural poses ... are all fixed ... find as many bugs as
possible", and R28, of his robe in the fight: the brown bits on it). Grandmaster Pho's body sheet (the image named
texture_0, the same bytes in assets/pho.glb and assets/p5pho.glb) holds small DARK specks lying inside the white of his
robe: grey, brown and black dots the scan left, seen at three metres on a phone as flecks on the robe's front and back.
Chapter 4's cover (tools/phoflecks.py, PHO_FLECKS) takes the islands of SKIN colour only; this takes the dark ones, for
chapter 5 (his file is never changed: v12.4, a ruling applied at runtime).

A speck is taken when: its texels are dark (the brightest channel, decoded from sRGB and raised to 1/2.2 as the shader
does, under DARK); it is small (at most AMAX texels); it lies on a piece of the body that paints mostly robe (at least
CHART_ROBE of the piece's texels robe: bright, unsaturated), so a bead's, the gold's or the skin's own piece is never
touched; it is clearly darker than the robe round it (its mean brightness under the ring's by at least STEP); at least
RING of the painted texels round it (within 3) are robe; and no large dark island (over BIG texels: the bead strands the
scan painted on his robe, the sash's knot) lies within CLEAR texels of it, so no piece of a strand is ever taken for a
speck. Each is grown by GROW texels and written as runs [row, first cell, cells] of a SIZE x SIZE mask, in the colour of
the robe round it (sRGB), to masters/v28.0/parts/c_phodark.js (PHO_DARK5), which chapter 5's look D paints over his
sheet with chapter 4's own (c_cast.js).

    python3 -I tools/phodark.py [--report] [--json out.json]      (from the repo root; numpy, Pillow and scipy)
"""
import hashlib, io, json, os, struct, subprocess, sys, tempfile
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
GLB = os.path.join(ROOT, 'assets/p5pho.glb')
OUT = os.path.join(ROOT, 'masters/v28.0/parts/c_phodark.js')
SIZE, DARK, AMAX, CHART_ROBE, STEP, RING, BIG, CLEAR, GROW = 1024, 0.55, 400, 0.2, 0.25, 0.8, 600, 16, 2
LINE = 5.0                                                     # (an island this many times longer than wide is a line)
if os.environ.get('PHODARK'):                                  # (a variant measured before it is written in: k=v,...)
    for kv in os.environ['PHODARK'].split(','):
        k, v = kv.split('='); globals()[k] = type(globals()[k])(float(v))


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
    return data, hashlib.sha1(data).hexdigest()


def main():
    data, imsha = sheet()
    img = np.asarray(Image.open(io.BytesIO(data)).convert('RGB')).astype(np.float64) / 255.0
    H, W = img.shape[:2]
    lin = np.where(img <= 0.04045, img / 12.92, ((img + 0.055) / 1.055) ** 2.4)
    sc = np.maximum(lin, 1e-4) ** (1 / 2.2)
    mx, mn = sc.max(2), sc.min(2)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    robe = (mx > 0.55) & (sat < 0.12)
    with tempfile.TemporaryDirectory() as td:
        cm = os.path.join(td, 'charts.i32')
        subprocess.run(['node', os.path.join(ROOT, 'tools/probes/uvcharts.mjs'), GLB, 'texture_0', cm, str(W)], check=True, stdout=subprocess.DEVNULL)
        own = np.fromfile(cm, dtype='<i4').reshape(H, W)
    painted = own >= 0
    nc = int(own.max()) + 1
    ccount = np.bincount(own[painted], minlength=nc).astype(float)
    crobe = np.bincount(own[painted & robe], minlength=nc) / np.maximum(ccount, 1)
    dark = painted & (mx < DARK)
    lab, n = nd.label(dark, structure=np.ones((3, 3)))
    sizes = nd.sum(dark, lab, index=np.arange(1, n + 1))
    big = np.zeros(n + 1, bool); big[1:] = sizes > BIG
    near_big = nd.distance_transform_edt(~big[lab]) <= CLEAR      # (within CLEAR texels of a strand or a knot)
    objs = nd.find_objects(lab)
    k = W // SIZE
    cover = np.zeros((SIZE, SIZE), np.int32)
    specks, why = [], {'big': 0, 'chart': 0, 'step': 0, 'ring': 0, 'strand': 0}
    for i, sl in enumerate(objs, start=1):
        if sl is None:
            continue
        a = int(sizes[i - 1])
        if a > AMAX:
            why['big'] += 1; continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        Y0, Y1, X0, X1 = max(0, y0 - 6), min(H, y1 + 6), max(0, x0 - 6), min(W, x1 + 6)
        sub = lab[Y0:Y1, X0:X1] == i
        if near_big[Y0:Y1, X0:X1][sub].any():
            why['strand'] += 1; continue
        ys_, xs_ = np.nonzero(sub)
        if len(ys_) > 8:
            ev = np.linalg.eigvalsh(np.cov(np.vstack([ys_, xs_]).astype(float)) + 1e-6 * np.eye(2))
            if np.sqrt(ev[1] / max(ev[0], 1e-6)) > LINE and np.sqrt(ev[1]) * 4 > 20:
                why['line'] = why.get('line', 0) + 1; continue      # (a seam, a fold's edge: a line, never a speck)
        o = own[Y0:Y1, X0:X1][sub]
        c = int(np.bincount(o).argmax())
        if crobe[c] < CHART_ROBE:
            why['chart'] += 1; continue
        ring = nd.binary_dilation(sub, iterations=3) & ~sub
        rp = ring & painted[Y0:Y1, X0:X1]
        rr = rp & robe[Y0:Y1, X0:X1]
        frac = float(rr.sum()) / max(int(rp.sum()), 1)
        if frac < RING:
            why['ring'] += 1; continue
        if mx[Y0:Y1, X0:X1][sub].mean() > mx[Y0:Y1, X0:X1][rr].mean() - STEP:
            why['step'] += 1; continue
        col = img[Y0:Y1, X0:X1][rr].mean(0)
        grown = nd.binary_dilation(sub, iterations=GROW) & painted[Y0:Y1, X0:X1]
        ys, xs = np.nonzero(grown)
        cy, cx = (ys + Y0) // k, (xs + X0) // k
        sid = len(specks) + 1
        free = cover[cy, cx] == 0
        cover[cy[free], cx[free]] = sid
        specks.append({'area': a, 'ring': round(frac, 3), 'chart': c, 'box': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)],
                       'c': [int(round(v * 255)) for v in col]})
    runs = {f: [] for f in range(1, len(specks) + 1)}
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
        json.dump(specks, open(sys.argv[sys.argv.index('--json') + 1], 'w'))
    if '--report' in sys.argv:
        print('sheet', W, 'x', H, 'dark islands', n, 'specks', len(specks), 'texels', sum(s['area'] for s in specks),
              'mask cells', cells, 'of', SIZE * SIZE, 'left out', why)
        print('largest', sorted(s['area'] for s in specks)[-10:])
    rows = []
    for f in range(1, len(specks) + 1):
        F = specks[f - 1]
        flat = [v for r in runs[f] for v in r]
        rows.append('[%d, %d, %d, [%s]]' % (F['c'][0], F['c'][1], F['c'][2], ','.join(map(str, flat))))
    js = ('    /* R33 (23 Nov 2026; R28, the brown bits on his robe). WRITTEN BY tools/phodark.py from his body sheet (texture_0,\n'
          '       sha1 %s, the same bytes in assets/pho.glb and assets/p5pho.glb), never by hand: %d small dark specks lying\n'
          '       inside the white of his robe (%d x %%d), robe all round each, on pieces that paint %%d%%%% robe or more, clear of the bead\n'
          '       strands, never a line (a seam), grown by %d texels, as runs [row, first cell, cells] of a %d x %d mask, each in the\n'
          '       colour of the robe round it (sRGB).\n'
          '       c_cast.js paints them over chapter 4\'s own cover (PHO_FLECKS) once; his file is unchanged. */\n'
          '    const PHO_DARK5 = { size: %d, f: [\n      %s\n    ] };\n') % (
        imsha, len(specks), W, GROW, SIZE, SIZE, SIZE, ',\n      '.join(rows))
    js = js % (H, round(CHART_ROBE * 100))
    open(OUT, 'w').write(js)
    print('wrote', os.path.relpath(OUT, ROOT), len(js), 'bytes;', len(specks), 'specks,', cells, 'cells,',
          sum(len(r) for r in runs.values()), 'runs')


main()
