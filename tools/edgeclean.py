#!/usr/bin/env python3
"""tools/edgeclean.py · v28.0 (20 Nov 2026, Master Zavier's model: "Make sure it is extremely high quality and free of
issues") · THE EDGE BETWEEN TWO MATERIALS, DRAWN CLEAN.

A generated body's paint is laid on from pictures of it, and where two materials meet (the skin of a neck and a black
tee's collar, a knit lapel and the tee under it) the painted edge does not follow the body: it comes ragged, in torn
bits of one colour lying a few millimetres inside the other. Seen from three metres it is a dirty line; in a close shot
it is tatters.

What this does, inside the boxes its spec names and nowhere else (the body's bind pose, in metres, feet on y = 0, the
middle of the body on x = z = 0, its height the spec's H):
  1. every texel of the sheet that a triangle in a box covers is given its place on the body;
  2. its colour is blurred a little over the body (a knit's black and white speckle becomes its grey, so one dark
     stitch is not taken for the black tee) and given a material by the spec's rules (Lab lightness, chroma, hue);
  3. each material's presence is smoothed over the body (a Gaussian of SMOOTH metres, in space, weighted by how much
     surface there is) and each texel takes the material that is strongest there: the edge becomes the smooth line
     that best fits the ragged one, and torn bits smaller than the smoothing vanish into what surrounds them;
  3b. where a box names a STEP (the edge of a thing that stands proud of what is under it: a collar's rim on a neck, a
     lapel's edge on a tee), the edge is taken from the BODY, not from the paint: in each thin slice of the box, walking
     the way the spec says, the first place the surface turns to face back at the walker (a wall of it, MIN texels within
     six millimetres) is the edge there; the edges are smoothed along the box, and within SNAP of them the near side is
     whatever lies under (skin, tee) and the far side is the thing that stands proud. Measured on Master Zavier: the
     knit's paint ran three to eight millimetres past his cardigan's edge onto the tee in a saw's teeth, and the tee's
     black lay five millimetres up his neck above its own collar;
  4. an island of a material that is neither tatter nor region (a button on the knit) is KEPT as it is, with a margin;
  5. the texels whose material changed (within REACH of the new edge), and a narrow BAND along the edge where the
     colours are mixed, are painted again: a smooth material (skin, a plain tee) with the smoothed colour of its own
     clean texels near by, a textured one (a knit) with the texels found by mirroring the place through the nearest
     clean one, so its stitches go on to the edge;
  6. the sheet's margin round each chart is taken again from the nearest covered texel wherever that texel changed.
Nothing outside the boxes changes by one bit, and neither does any coordinate: only colours of the sheet.

    python3 -I tools/edgeclean.py <dir> <spec.json>
    <dir>: e_pos.f32 (n x 3), e_uv.f32 (n x 2), e_idx.u32 (m x 3), baked.png  ->  clean.png, clean.json, (DEBUG) clean-dbg.png
The spec (masters/<v>/people/edgeclean-<name>.json):
    { "H": 1.74, "voxel": 0.001, "blur": 0.0012, "smooth": 0.004, "band": 0.002, "reach": 0.010,
      "dissolve": 25, "main": 400,                       (square millimetres: an island under `dissolve` goes, one over `main` is a region)
      "classes": { "skin": {"L": [28, 100], "C": [10, 200], "h": [15, 85], "fill": "smooth", "raw": {"L": [27, 100], "C": [9, 200], "h": [10, 90]}},
                   "tee":  {"L": [0, 22],   "C": [0, 16], "fill": "smooth", "raw": {"L": [0, 30], "C": [0, 18]}},
                   "knit": {"L": [22, 100], "C": [0, 9],  "fill": "mirror", "raw": {"L": [0, 100], "C": [0, 13]}} },
      "regions": [ {"name": "collar", "box": [[-0.06, 1.36, 0.0], [0.06, 1.447, 0.16]], "classes": ["skin", "tee", "knit"],
                    "step": {"across": [0, -1, 0], "band": [1, 0, 0], "from": -1.445, "to": -1.36, "high": "tee"}} ] }
    (`raw`: a texel's OWN colour must fit it too, or it is painted again when within REACH of an edge: a hairline of
     black on skin is skin once blurred. `step.from`/`to` are along `across`: here y from 1.445 down to 1.36.)
"""
# v28.0 (Master Zavier's fourth body, 21 Nov 2026) · KEYS ADDED, each absent = the tool as it was:
#   a class's "sd": [lo, hi]       the local spread of Lab L round a texel (within "sds" metres, 0.0015): a marled knit has
#                                  it, a flat grey patch the generator left has not (his sides under the arms);
#   a region's "turn": {a: b}      every texel of class a is painted as class b, wherever it lies in the box;
#   a region's "grow": metres      ... and what lies that near a turned texel (the rim a patch leaves, the holes in it);
#   a class's "fill": "clone"      for a patch too wide for "mirror": taken a 3 cm cell at a time, each cell the clean paint
#                                  one move away (a step of 12 to 65 mm, or a turn of 15 to 60 degrees about the upright
#                                  axis), the move that reaches the most different clean texels;
#   a region's "dissolve", "main"  that box's own island sizes (mm2) in place of the spec's ("main": 0 keeps every island).
import json, math, os, sys, time
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import cKDTree

T0 = time.time()
def log(s): print(f'[{time.time() - T0:6.1f}s] {s}', flush=True)

D = sys.argv[1]; SPEC = json.load(open(sys.argv[2]))
DEBUG = bool(os.environ.get('DEBUG'))
P = np.fromfile(f'{D}/e_pos.f32', np.float32).reshape(-1, 3).astype(np.float64)
UV = np.fromfile(f'{D}/e_uv.f32', np.float32).reshape(-1, 2).astype(np.float64)
I = np.fromfile(f'{D}/e_idx.u32', np.uint32).reshape(-1, 3).astype(np.int64)
img = Image.open(f'{D}/baked.png').convert('RGB'); PX = img.size[0]; assert img.size[0] == img.size[1], 'a square sheet'
RGB = np.asarray(img).copy()                                   # (PX, PX, 3) uint8, row 0 at v = 0 (glTF's way)
OUT = RGB.copy()

# ---- the body in metres: feet on y = 0, its middle on x = z = 0, its height the spec's
H = float(SPEC.get('H', 1.74)); lo = P.min(axis=0); hi = P.max(axis=0); s = H / (hi[1] - lo[1])
W = np.empty_like(P); W[:, 0] = (P[:, 0] - (lo[0] + hi[0]) / 2) * s; W[:, 1] = (P[:, 1] - lo[1]) * s; W[:, 2] = (P[:, 2] - (lo[2] + hi[2]) / 2) * s
log(f'{len(P)} points, {len(I)} triangles, a {PX} sheet; the body {((hi - lo) * s).round(3).tolist()} m (scaled {s:.4f})')

VOX = float(SPEC.get('voxel', 0.001)); BLUR = float(SPEC.get('blur', 0.0012)); SMOOTH = float(SPEC.get('smooth', 0.004))
BAND = float(SPEC.get('band', 0.002)); REACH = float(SPEC.get('reach', 0.010)); FILL = float(SPEC.get('fillsmooth', 0.005))
DISSOLVE = float(SPEC.get('dissolve', 25)); MAIN = float(SPEC.get('main', 400)); MARGIN = float(SPEC.get('margin', 0.02))

def srgb2lab(rgb):
    c = rgb.astype(np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], axis=-1)
def lin(rgb):
    c = rgb.astype(np.float64) / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def unlin(c):
    c = np.clip(c, 0, 1)
    return np.round(np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055) * 255).astype(np.uint8)

def raster(tris, reach=0.75):
    """the texels a triangle's paint is drawn from: (row, col, triangle, the place on the body). A texel belongs to a
    triangle when its centre lies inside it OR within `reach` texels of it: a sliver thinner than a texel covers no
    centre at all, yet the renderer draws it from the texels beside its line (bilinear), and a texel no triangle
    'covered' was never painted again: on Master Zavier's full body (312,640 triangles as generated, slivers
    everywhere) that left a dotted line of the old black along his collar. Where two triangles claim one texel, the
    one it lies deepest in keeps it."""
    rr = []; cc = []; tt = []; pp = []; ss = []
    uvt = UV[I[tris]] * PX                                      # (k, 3, 2) in texels; a texel's centre is at (c + .5, r + .5)
    for n, t in enumerate(tris):
        a, b, c = uvt[n]
        x0 = max(int(math.floor(min(a[0], b[0], c[0]) - 0.5 - reach)), 0); x1 = min(int(math.ceil(max(a[0], b[0], c[0]) - 0.5 + reach)), PX - 1)
        y0 = max(int(math.floor(min(a[1], b[1], c[1]) - 0.5 - reach)), 0); y1 = min(int(math.ceil(max(a[1], b[1], c[1]) - 0.5 + reach)), PX - 1)
        if x1 < x0 or y1 < y0: continue
        den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(den) < 1e-12: continue
        xs = np.arange(x0, x1 + 1) + 0.5; ys = np.arange(y0, y1 + 1) + 0.5
        X, Y = np.meshgrid(xs, ys)
        l0 = ((b[1] - c[1]) * (X - c[0]) + (c[0] - b[0]) * (Y - c[1])) / den
        l1 = ((c[1] - a[1]) * (X - c[0]) + (a[0] - c[0]) * (Y - c[1])) / den
        l2 = 1 - l0 - l1
        # each corner's height over the edge facing it, in texels: a barycentric times it is the distance from that edge
        h0 = abs(den) / max(math.hypot(b[0] - c[0], b[1] - c[1]), 1e-9); h1 = abs(den) / max(math.hypot(c[0] - a[0], c[1] - a[1]), 1e-9); h2 = abs(den) / max(math.hypot(a[0] - b[0], a[1] - b[1]), 1e-9)
        depth = np.minimum(np.minimum(l0 * h0, l1 * h1), l2 * h2)
        ok = depth >= -reach
        if not ok.any(): continue
        yy, xx = np.nonzero(ok)
        w = np.clip(np.stack([l0[ok], l1[ok], l2[ok]], axis=1), 0, None); w /= np.maximum(w.sum(axis=1, keepdims=True), 1e-12)
        rr.append(yy + y0); cc.append(xx + x0); tt.append(np.full(len(yy), t)); pp.append(w @ W[I[t]]); ss.append(depth[ok])
    if not rr: return (np.zeros(0, np.int64),) * 3 + (np.zeros((0, 3)),)
    r = np.concatenate(rr); c = np.concatenate(cc); t = np.concatenate(tt); p = np.concatenate(pp); sc = np.concatenate(ss)
    order = np.lexsort((-sc, r * PX + c)); r, c, t, p = r[order], c[order], t[order], p[order]
    _, first = np.unique(r * PX + c, return_index=True)          # (the triangle it lies deepest in)
    return r[first], c[first], t[first], p[first]

def grid_of(p, lo_, shape):
    g = np.floor((p - lo_) / VOX).astype(np.int64)
    return np.clip(g, 0, np.array(shape) - 1)

def blur_at(vals, gi, shape, sigma):
    """a Gaussian over the body: the values scattered into a grid of voxels, blurred, divided by the blurred count"""
    out = []
    cnt = np.zeros(shape, np.float32); np.add.at(cnt, (gi[:, 0], gi[:, 1], gi[:, 2]), 1.0)
    wb = ndimage.gaussian_filter(cnt, sigma / VOX, mode='constant')
    for k in range(vals.shape[1]):
        g = np.zeros(shape, np.float32); np.add.at(g, (gi[:, 0], gi[:, 1], gi[:, 2]), vals[:, k])
        out.append(ndimage.gaussian_filter(g, sigma / VOX, mode='constant'))
    return np.stack(out, axis=-1), wb

report = {'regions': []}
dbg = np.zeros((PX, PX, 3), np.uint8) if DEBUG else None
changed = np.zeros((PX, PX), bool)
cent = W[I].mean(axis=1)
TN = np.cross(W[I[:, 1]] - W[I[:, 0]], W[I[:, 2]] - W[I[:, 0]]); _l = np.linalg.norm(TN, axis=1); _l[_l == 0] = 1; TN /= _l[:, None]
SNAP = float(SPEC.get('snap', 0.012))
def unit(v): v = np.array(v, float); return v / np.linalg.norm(v)
def fits(lab_, rule, sd=None):
    Lc = lab_[:, 0]; C = np.hypot(lab_[:, 1], lab_[:, 2]); h = np.degrees(np.arctan2(lab_[:, 2], lab_[:, 1])) % 360
    ok = (Lc >= rule['L'][0]) & (Lc < rule['L'][1]) & (C >= rule['C'][0]) & (C < rule['C'][1])
    if 'h' in rule: ok &= (h >= rule['h'][0]) & (h < rule['h'][1])
    if 'sd' in rule and sd is not None: ok &= (sd >= rule['sd'][0]) & (sd < rule['sd'][1])
    return ok
for R in SPEC['regions']:
    name = R['name']; b0 = np.array(R['box'][0], float); b1 = np.array(R['box'][1], float)
    names = R['classes']; K = len(names); rules = [SPEC['classes'][n] for n in names]
    # the triangles with a corner in the box grown by a margin (the margin is where clean texels are taken from; only
    # texels inside the box itself are ever painted)
    g0 = b0 - MARGIN; g1 = b1 + MARGIN
    inb = ((W >= g0) & (W <= g1)).all(axis=1)
    tris = np.nonzero(inb[I].any(axis=1))[0]
    if 'normal' in R:                                           # (only the surface that faces this way, e.g. the front)
        nrm = np.cross(W[I[tris, 1]] - W[I[tris, 0]], W[I[tris, 2]] - W[I[tris, 0]]); nl = np.linalg.norm(nrm, axis=1); nl[nl == 0] = 1
        tris = tris[(nrm / nl[:, None]) @ np.array(R['normal'][:3], float) > float(R['normal'][3] if len(R['normal']) > 3 else 0.0)]
    r, c, t, p = raster(tris)
    if len(r) == 0: log(f'{name}: no texel in the box'); continue
    inside = ((p >= b0) & (p <= b1)).all(axis=1)
    if 'slab' in R:                                             # (a box cut by two planes across a slanted limb: a watch, and not the cuff above it)
        sl = R['slab']; ta = (p - np.array(sl['origin'], float)) @ unit(sl['axis'])
        inside &= (ta >= float(sl['from'])) & (ta <= float(sl['to']))
    col = OUT[r, c]; L = lin(col)                                 # (the sheet as it now is: a later box sees an earlier one's work)
    shape = tuple(np.ceil((g1 - g0) / VOX).astype(int) + 1)
    gi = grid_of(p, g0, shape)
    # 2. the colour blurred a little over the body, and its material
    cb, wb = blur_at(L.astype(np.float32), gi, shape, BLUR)
    wq = np.maximum(wb[gi[:, 0], gi[:, 1], gi[:, 2]], 1e-9)
    Lb = cb[gi[:, 0], gi[:, 1], gi[:, 2]] / wq[:, None]
    lab = srgb2lab(unlin(Lb)); Lr = srgb2lab(col)
    # (v28.0, Master Zavier's fourth body: a class may ask for a WEAVE, `sd`: the spread of lightness round a texel, over
    #  SDS on the body. A marled knit has about twelve; the flat grey a generator lays where it could not see, under an
    #  arm, has under two: the same colour by every other test.)
    sdq = None
    if any('sd' in rl for rl in rules):
        SDS = float(R.get('sds', SPEC.get('sds', 0.0015))); Lraw = Lr[:, :1].astype(np.float32)
        s1, w1 = blur_at(Lraw, gi, shape, SDS); s2, _ = blur_at(Lraw * Lraw, gi, shape, SDS)
        w1q = np.maximum(w1[gi[:, 0], gi[:, 1], gi[:, 2]], 1e-9)
        m1_ = s1[gi[:, 0], gi[:, 1], gi[:, 2], 0] / w1q; m2_ = s2[gi[:, 0], gi[:, 1], gi[:, 2], 0] / w1q
        sdq = np.sqrt(np.maximum(m2_ - m1_ * m1_, 0)); del s1, s2, w1
    c0 = np.full(len(r), -1)
    for k in range(K): c0[(c0 < 0) & fits(lab, rules[k], sdq)] = k
    # 3. each material's presence smoothed over the body; each texel takes the strongest
    ind = np.zeros((len(r), K), np.float32); ok0 = c0 >= 0; ind[np.nonzero(ok0)[0], c0[ok0]] = 1
    mb, _ = blur_at(ind, gi, shape, SMOOTH)
    m = mb[gi[:, 0], gi[:, 1], gi[:, 2]]; tot = m.sum(axis=1)
    c1 = np.where(tot > 1e-6, m.argmax(axis=1), -1)
    # 4. islands: the voxels of each material, joined where they touch (a voxel's gap bridged), measured in mm2
    vmm = (VOX * 1000) ** 2; protect = np.zeros(len(r), bool); nd = 0; nk = 0
    DIS_ = float(R.get('dissolve', DISSOLVE)); MAIN_ = float(R.get('main', MAIN))    # (a region's own: `main` 0 keeps and dissolves no island)
    occ = np.full(shape, -1, np.int8); occ[gi[:, 0], gi[:, 1], gi[:, 2]] = c1
    for k in range(K):
        mk = ndimage.binary_dilation(occ == k, iterations=1)
        lbl, nl = ndimage.label(mk, structure=np.ones((3, 3, 3)))
        if nl == 0: continue
        mine = np.nonzero(c1 == k)[0]; lq = lbl[gi[mine, 0], gi[mine, 1], gi[mine, 2]]
        area = np.bincount(lbl[occ == k], minlength=nl + 1) * vmm         # (occupied voxels of the island: about its surface in mm2)
        for q in range(1, nl + 1):
            if area[q] >= MAIN_ or area[q] == 0: continue
            sel = mine[lq == q]
            if area[q] < DIS_:
                m2 = m[sel].copy(); m2[:, k] = -1; alt = m2.argmax(axis=1)
                c1[sel] = np.where(m2.max(axis=1) > 1e-6, alt, k); nd += 1
            else:
                protect[sel] = True; nk += 1
    stepnote = ''
    if 'step' in R:
        # 3b. the edge taken from the body: in each slice, the first wall met on the walk
        st = R['step']; ax = unit(st['across']); bd = unit(st['band']); a = p @ ax; bc = p @ bd
        BW = float(st.get('slice', 0.002)); MINW = int(st.get('min', 6)); a0 = float(st['from']); a1 = float(st['to'])
        wallq = ((TN[t] @ ax) < -float(st.get('wall', 0.5))) & (a >= a0) & (a <= a1) & ((p >= b0 - 0.002) & (p <= b1 + 0.002)).all(axis=1)
        b0c = bc.min(); bi = np.floor((bc - b0c) / BW).astype(np.int64); nb = int(bi.max()) + 1
        edge = np.full(nb, np.nan)
        order = np.argsort(bi[wallq], kind='stable'); wk = np.nonzero(wallq)[0][order]; wb = bi[wk]
        starts = np.searchsorted(wb, np.arange(nb)); ends = np.searchsorted(wb, np.arange(nb), side='right')
        for b in range(nb):
            if ends[b] - starts[b] < MINW: continue
            aa = np.sort(a[wk[starts[b]:ends[b]]])
            cntw = np.searchsorted(aa, aa + 0.006, side='right') - np.arange(len(aa))
            okk = np.nonzero(cntw >= MINW)[0]
            if len(okk): edge[b] = aa[okk[0]]
        # (a wall met in the walk's first three millimetres is no edge: the walk began on it, e.g. a lapel lying over a
        #  collar's end; measured on Master Zavier, whose collar's edge was dragged up his neck at both ends by five such)
        inbox = ((p >= b0 - 0.002) & (p <= b1 + 0.002)).all(axis=1) & (a >= a0) & (a <= a1)
        afirst = np.full(nb, np.inf); np.minimum.at(afirst, bi[inbox], a[inbox])
        edge[edge - np.maximum(afirst, a0) < float(st.get('lead', 0.003))] = np.nan
        found = ~np.isnan(edge); nf = int(found.sum())
        if nf >= 5:
            xi = np.arange(nb); e = edge.copy()
            # a slice with no wall takes its neighbours' edge when they are within a centimetre; further, it has none
            gap = ndimage.distance_transform_edt(~found) * BW
            e[~found] = np.interp(xi[~found], xi[found], edge[found])
            e = ndimage.median_filter(e, size=int(st.get('median', 7)), mode='nearest')
            e = ndimage.gaussian_filter1d(e, float(st.get('smooth', 0.004)) / BW, mode='nearest')
            e[gap > 0.01] = np.nan
            fi = np.nonzero(found)[0]; e[:max(fi[0] - 1, 0)] = np.nan; e[fi[-1] + 2:] = np.nan   # (and nothing is guessed past the last slice that had one)
            if DEBUG: log(f'{name}: slices from {b0c:.3f} every {BW * 1000:.0f} mm; found: ' + ' '.join('--' if np.isnan(v) else f'{v:.3f}' for v in edge) + ' | used: ' + ' '.join('--' if np.isnan(v) else f'{v:.3f}' for v in e))
            eb = e[bi]; have = ~np.isnan(eb) & ~protect
            hk = names.index(st['high'])
            highside = have & (a >= eb) & (a < eb + SNAP); lowside = have & (a < eb) & (a > eb - SNAP)
            m2 = m.copy(); m2[:, hk] = -1; alt = m2.argmax(axis=1)
            if 'low' in st: alt = np.where(m2.max(axis=1) > 1e-6, alt, names.index(st['low']))
            moved0 = c1.copy()
            if 'only' in st:                                     # (a third material in the box, a lapel lying over a collar's end, is left as it is)
                highside &= np.isin(c1, [names.index(n) for n in st['only']])
            c1[highside] = hk; sel = lowside & (c1 == hk); c1[sel] = alt[sel]
            moved = int((c1 != moved0).sum())
            stepnote = f'; the edge found in {nf} of {nb} slices ({np.nanmin(e):.3f} to {np.nanmax(e):.3f} along the walk), {moved} texels changed sides'
        else: stepnote = f'; no edge found on the body ({nf} of {nb} slices): the paint\'s own smoothed edge is used'
    turned = np.zeros(len(r), bool)
    if 'turn' in R:                                              # (one class painted as another wherever it lies: flat grey as the knit beside it)
        for a_, b_ in R['turn'].items():
            sel = c1 == names.index(a_); c1[sel] = names.index(b_); turned |= sel
        if turned.any() and R.get('grow'):                       # ('grow', metres: and what lies that near a turned texel, the rim a patch leaves and the holes in it)
            tm = np.zeros(shape, bool); tm[gi[turned, 0], gi[turned, 1], gi[turned, 2]] = True
            tm = ndimage.binary_dilation(tm, structure=np.ones((3, 3, 3), bool), iterations=max(1, int(round(float(R['grow']) / VOX))))
            turned |= tm[gi[:, 0], gi[:, 1], gi[:, 2]] & np.isin(c1, [names.index(b_) for b_ in R['turn'].values()]); del tm
    occ[:] = -1; occ[gi[:, 0], gi[:, 1], gi[:, 2]] = c1
    if protect.any():                                            # (and a margin round a kept island)
        pm = np.zeros(shape, bool); pm[gi[protect, 0], gi[protect, 1], gi[protect, 2]] = True
        pm = ndimage.binary_dilation(pm, iterations=int(math.ceil((BAND + 0.001) / VOX)))
        protect = pm[gi[:, 0], gi[:, 1], gi[:, 2]]
    # the distance to the edge: from each texel to the nearest voxel of another material
    dist = np.full(len(r), 9.0)
    for k in range(K):
        other = (occ >= 0) & (occ != k)
        if not other.any(): continue
        d = ndimage.distance_transform_edt(~other) * VOX
        sel = c1 == k; dist[sel] = d[gi[sel, 0], gi[sel, 1], gi[sel, 2]]
    # 5. what is painted again
    if R.get('everywhere'): c1[(c1 < 0) & inside] = 0
    rawbad = np.zeros(len(r), bool)                               # (a texel whose own colour is not its material's)
    for k in range(K):
        if 'raw' in rules[k]: sel = c1 == k; rawbad[sel] = ~fits(Lr[sel], rules[k]['raw'])
    smoothk = np.array([rules[k].get('fill', 'smooth') not in ('mirror', 'clone') for k in range(K)] + [False])
    # (a box of ONE material, `everywhere`: hair with flecks of skin's colour in its creases. There is no edge to be
    #  near, so whatever in the box is not the material's own colour is painted, wherever it lies)
    reachq = (dist < REACH) | bool(R.get('everywhere')) | turned
    paint = inside & (c1 >= 0) & ~protect & ((((c0 != c1) | rawbad | turned) & reachq) | ((dist < BAND) & smoothk[c1]))
    pure = inside & (c0 == c1) & (c1 >= 0) & ~paint & ~rawbad & (dist > BAND + 0.001) & ~protect    # (clean texels are taken from inside the box only)
    if turned.any():                                             # (and not from the rim of what was turned: its texels are half the other colour)
        tm = np.zeros(shape, bool); tm[gi[turned, 0], gi[turned, 1], gi[turned, 2]] = True
        dT = ndimage.distance_transform_edt(~tm) * VOX; pure &= dT[gi[:, 0], gi[:, 1], gi[:, 2]] > BAND
        del tm, dT
    newL = L.copy(); stats = {}
    for k in range(K):
        q = np.nonzero(paint & (c1 == k))[0]; src = np.nonzero(pure & (c1 == k))[0]
        stats[names[k]] = {'texels': int((c1 == k).sum()), 'painted': int(len(q)), 'clean': int(len(src))}
        if len(q) == 0 and not smoothk[k]: continue
        if len(src) < 16: log(f'{name}: {names[k]} has no clean texels to paint {len(q)} from: left as they are'); paint[q] = False; continue
        tree = cKDTree(p[src])
        if rules[k].get('fill', 'smooth') == 'clone':
            # ('clone', v28.0: a patch too wide for the mirror, whose texels far from clean ones all found the same few and
            #  came out as blocks. The painted texels are taken a cell of 3 cm at a time, and each cell takes the paint of
            #  the clean surface ONE MOVE away, the same move for the whole cell: a piece of the real weave carried over,
            #  not folded. The move is one of a set (a step of 12 to 65 mm along the body's axes and between them, or a
            #  turn of 15 to 60 degrees about the body's upright axis, which carries a patch on the side of a trunk round
            #  to its front or back) and the one chosen sends the cell's texels to the most DIFFERENT clean texels, near
            #  them: a move that lands on painted ground sends them all to the same few, and scores nothing.)
            cell = np.floor(p[q] / 0.03).astype(np.int64); cell -= cell.min(0); ckey = (cell[:, 0] * 4096 + cell[:, 1]) * 4096 + cell[:, 2]
            order = np.argsort(ckey, kind='stable'); ks, starts = np.unique(ckey[order], return_index=True); ends = np.append(starts[1:], len(q))
            dirs = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1), (0, 1, 1), (0, 1, -1), (0, -1, 1), (0, -1, -1), (1, 1, 0), (-1, 1, 0), (1, -1, 0), (-1, -1, 0)]
            moves = [('s', np.array(v, float) / np.linalg.norm(v) * s_) for s_ in (0.012, 0.02, 0.03, 0.045, 0.065) for v in dirs] + [('t', math.radians(a_)) for a_ in (15, -15, 25, -25, 35, -35, 45, -45, 60, -60)]
            def moved(x, mv):
                if mv[0] == 's': return x + mv[1]
                c_, s_ = math.cos(mv[1]), math.sin(mv[1]); y = x.copy(); y[:, 0] = c_ * x[:, 0] + s_ * x[:, 2]; y[:, 2] = -s_ * x[:, 0] + c_ * x[:, 2]; return y
            for a_, b_ in zip(starts, ends):
                qq = q[order[a_:b_]]; sub = qq if len(qq) <= 1200 else qq[np.linspace(0, len(qq) - 1, 1200).astype(int)]
                best = moves[0]; bs = -9.0
                for mv in moves:
                    d_, j = tree.query(moved(p[sub], mv)); sc = len(np.unique(j)) / len(sub) - 4.0 * float(d_.mean())
                    if sc > bs: bs = sc; best = mv
                _, j = tree.query(moved(p[qq], best)); newL[qq] = L[src[j]]
        elif rules[k].get('fill', 'smooth') == 'mirror':
            _, j = tree.query(p[q]); bq = p[src[j]]
            _, j2 = tree.query(2 * bq - p[q])
            newL[q] = L[src[j2]]
        else:
            # (the material's own smooth colour, at every texel of it within REACH of an edge: what stands off it by more
            #  than TOL there, a hairline of the other colour that passed as a darker skin, is painted with it too)
            q = np.nonzero(inside & (c1 == k) & ~protect & (reachq | paint))[0]
            sb, sw = blur_at(L[src].astype(np.float32), gi[src], shape, FILL)
            w = sw[gi[q, 0], gi[q, 1], gi[q, 2]]
            val = sb[gi[q, 0], gi[q, 1], gi[q, 2]] / np.maximum(w, 1e-9)[:, None]
            far = w < 1e-3
            if far.any():                                        # (further from its clean texels than the blur reaches: a wider one, then the nearest)
                sb2, sw2 = blur_at(L[src].astype(np.float32), gi[src], shape, FILL * 4)
                w2 = sw2[gi[q, 0], gi[q, 1], gi[q, 2]]; v2 = sb2[gi[q, 0], gi[q, 1], gi[q, 2]] / np.maximum(w2, 1e-9)[:, None]
                val[far] = v2[far]; far2 = far & (w2 < 1e-4)
                if far2.any(): _, j = tree.query(p[q[far2]]); val[far2] = L[src[j]]
            dE = np.linalg.norm(srgb2lab(unlin(val)) - Lr[q], axis=1)
            paint[q[dE > float(rules[k].get('tol', SPEC.get('tol', 9)))]] = True
            newL[q] = val
            stats[names[k]]['painted'] = int((paint & (c1 == k)).sum())
    sel = np.nonzero(paint)[0]
    OUT[r[sel], c[sel]] = unlin(newL[sel]); changed[r[sel], c[sel]] = True
    if DEBUG:
        pal = np.array([[230, 170, 140], [30, 30, 40], [150, 150, 150], [60, 90, 200], [220, 220, 80]], np.uint8)
        dbg[r, c] = np.where((c1 >= 0)[:, None], pal[np.clip(c1, 0, len(pal) - 1)], np.array([255, 0, 255], np.uint8))
        dbg[r[sel], c[sel]] = [255, 60, 60]; dbg[r[protect], c[protect]] = [60, 255, 60]
    stats.update({'name': name, 'texels': int(len(r)), 'inside': int(inside.sum()), 'unclassed': int((c0 < 0).sum()),
                  'painted': int(len(sel)), 'islands_dissolved': nd, 'islands_kept': nk})
    report['regions'].append(stats)
    log(f'{name}: {len(tris)} triangles, {len(r)} texels ({int(inside.sum())} in the box); ' +
        ', '.join(f"{n} {stats[n]['texels']} (painted {stats[n]['painted']})" for n in names) +
        f'; islands gone {nd}, kept {nk}{stepnote}' + (f'; {int((turned & inside).sum())} texels turned' if turned.any() else '') + f'; {len(sel)} texels painted again')

# ---- 6. the margin round each chart, where its nearest covered texel changed
npad = 0
if changed.any():
    # (every triangle near a changed texel, whichever box it is in: a margin texel must find its own chart's edge)
    PADPX = int(SPEC.get('pad', 6))
    near = ndimage.binary_dilation(changed, iterations=PADPX + 10)
    ct = np.clip(np.floor(UV[I] * PX).astype(np.int64), 0, PX - 1)
    allr, allc, _, _ = raster(np.nonzero(near[ct[:, :, 1], ct[:, :, 0]].any(axis=1))[0])
    cover = np.zeros((PX, PX), bool); cover[allr, allc] = True
    dd, (ir, ic) = ndimage.distance_transform_edt(~cover, return_indices=True)
    pad = (~cover) & ndimage.binary_dilation(changed, iterations=PADPX) & (dd <= PADPX)
    OUT[pad] = OUT[ir[pad], ic[pad]]; npad = int(pad.sum())
report['painted'] = int(changed.sum()); report['margin'] = npad
report['summary'] = f"{int(changed.sum())} texels painted again in {len(report['regions'])} boxes, {npad} of the margin after them"
Image.fromarray(OUT).save(f'{D}/clean.png')
if DEBUG: Image.fromarray(dbg).save(f'{D}/clean-dbg.png')
json.dump(report, open(f'{D}/clean.json', 'w'))
log(report['summary'])
