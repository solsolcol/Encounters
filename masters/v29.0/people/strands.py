#!/usr/bin/env python3
"""masters/v29.0/people/strands.py · v29.0 (27 Nov 2026) · WHICH TRIANGLES ARE A STRAND STANDING OFF THE HAIR (and which
are the hair). Called by people/mend.mjs, which hands over the body in metres (pos.f32: bind pose, feet on y = 0, its
middle on x = z = 0), its triangles (idx.u32) and each triangle's colour (col.u8), and reads back sel.u8 (1 a triangle).

  strands: inside the spec's head box, the surface is drawn into voxels of VOX, the space outside it flooded from the
           box's walls, and what the flood never reached is the head as a SOLID. The solid is OPENED by a ball of `open`
           metres: a sheet standing off the hair, one voxel thick, has nothing inside it and is taken away; the hair's mass,
           the bun and the head stay. A triangle is a strand's when its middle (and the corner furthest out) lies more
           than `off` metres from the opened solid AND its colour is the hair's (`hair`: Lab L under, chroma under) or the
           skin seen through a strand (`under`, only outside the `keep` boxes), outside every `keep` box (the ears, the
           face). Then what is left joined to the rest by nothing (`orphan` triangles or fewer in a piece) goes too.
  hair:    every triangle in the head box of the hair's colour (the matte step's).
The spec (people/strands-<name>.json): { "H": 1.6, "head": [[x0,y0,z0],[x1,y1,z1]], "vox": 0.0015, "open": 0.004,
  "off": 0.003, "hair": {"L": 32, "C": 14}, "under": {"L": [40, 85], "C": [8, 40]}, "keep": [[[..],[..]], ...],
  "strand": [[[..],[..]], ...], "orphan": 400 }
"""
import json, sys, math
import numpy as np
from scipy import ndimage

D, SPECF, MODE = sys.argv[1], sys.argv[2], sys.argv[3]
S = json.load(open(SPECF))
W = np.fromfile(f'{D}/pos.f32', np.float32).reshape(-1, 3).astype(np.float64)
I = np.fromfile(f'{D}/idx.u32', np.uint32).reshape(-1, 3).astype(np.int64)
C = np.fromfile(f'{D}/col.u8', np.uint8).reshape(-1, 3)
m = len(I)

def lab(rgb):
    c = rgb.astype(np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], axis=-1)
LAB = lab(C); Lc = LAB[:, 0]; Ch = np.hypot(LAB[:, 1], LAB[:, 2])
hr = S.get('hair', {'L': 32, 'C': 14})
ishair = (Lc < hr['L']) & (Ch < hr['C'])
cen = W[I].mean(axis=1)
def inbox(pts, b): b0 = np.array(b[0], float); b1 = np.array(b[1], float); return ((pts >= b0) & (pts <= b1)).all(axis=-1)
hb = S['head']; inhead = inbox(cen, hb)
keep = np.zeros(m, bool)
for b in S.get('keep', []): keep |= inbox(cen, b)

if MODE == 'hair':
    sel = inhead & ishair & ~keep
    print(f'hair: {int(sel.sum())} triangles of the hair\'s colour in the head box (of {int(inhead.sum())} in it)')
    sel.astype(np.uint8).tofile(f'{D}/sel.u8'); sys.exit(0)

VOX = float(S.get('vox', 0.0015)); OPEN = float(S.get('open', 0.004)); OFF = float(S.get('off', 0.003))
g0 = np.array(hb[0], float) - 0.01; g1 = np.array(hb[1], float) + 0.01
shape = tuple(np.ceil((g1 - g0) / VOX).astype(int) + 1)
occ = np.zeros(shape, bool)
# the surface into voxels: every triangle touching the box, sampled finer than a voxel
near = inbox(W[I], [g0.tolist(), g1.tolist()]).any(axis=1)
T = I[near]; A = W[T[:, 0]]; B = W[T[:, 1]]; Cc = W[T[:, 2]]
L = np.maximum(np.maximum(np.linalg.norm(B - A, axis=1), np.linalg.norm(Cc - A, axis=1)), np.linalg.norm(Cc - B, axis=1))
k = np.maximum(1, np.ceil(L / (VOX * 0.5)).astype(int))
for kk in np.unique(k):
    sel_ = k == kk
    a = A[sel_]; b = B[sel_]; c = Cc[sel_]
    for i in range(kk + 1):
        for j in range(kk + 1 - i):
            u = i / kk; v = j / kk
            q = a + u * (b - a) + v * (c - a)
            g = np.floor((q - g0) / VOX).astype(int)
            ok = ((g >= 0) & (g < np.array(shape))).all(axis=1)
            occ[g[ok, 0], g[ok, 1], g[ok, 2]] = True
# the solid: what a flood from the box's walls never reaches (the surface thickened by a voxel so no flood slips through)
wall = ndimage.binary_dilation(occ, iterations=1)
lbl, nl = ndimage.label(~wall)
# (the flood begins at every wall but the floor: the neck goes down through the box's floor, and the inside of the head
#  is open to it there)
edge = set(np.unique(np.concatenate([lbl[0].ravel(), lbl[-1].ravel(), lbl[:, -1].ravel(), lbl[:, :, 0].ravel(), lbl[:, :, -1].ravel()]))) - {0}
outside = np.isin(lbl, list(edge))
solid = ~outside
R = max(1, int(round(OPEN / VOX)))
zz, yy, xx = np.mgrid[-R:R + 1, -R:R + 1, -R:R + 1]; ball = (xx * xx + yy * yy + zz * zz) <= R * R
opened = ndimage.binary_opening(solid, structure=ball)
# (only the largest piece of the opened solid is the head: a fold of ribbons thick enough to survive is not)
ol, on = ndimage.label(opened)
if on > 1:
    sz = np.bincount(ol.ravel()); sz[0] = 0; opened = ol == sz.argmax()
dist = ndimage.distance_transform_edt(~opened) * VOX
def dist_at(pts):
    g = np.floor((pts - g0) / VOX).astype(int); g = np.clip(g, 0, np.array(shape) - 1)
    return dist[g[..., 0], g[..., 1], g[..., 2]]
dc = dist_at(cen); dmax = dist_at(W[I]).max(axis=1)
und = S.get('under')
isunder = np.zeros(m, bool)
if und:
    hue = np.degrees(np.arctan2(LAB[:, 2], LAB[:, 1])) % 360
    isunder = (Lc >= und['L'][0]) & (Lc < und['L'][1]) & (Ch >= und['C'][0]) & (Ch < und['C'][1])
    if 'h' in und: isunder &= (hue >= und['h'][0]) & (hue < und['h'][1])
strandbox = np.zeros(m, bool)
for b in S.get('strand', []): strandbox |= inbox(cen, b)
sel = inhead & ~keep & (dc > OFF) & (dmax > OFF) & (ishair | isunder | strandbox)
n1 = int(sel.sum())
# what is left joined to nothing: a piece of the surface (triangles sharing a corner, the corners welded by place) of
# `orphan` triangles or fewer, in the head box, once the strands are out
ORPH = int(S.get('orphan', 400))
key = np.round(W / 1e-5).astype(np.int64); _, wid = np.unique(key, axis=0, return_inverse=True); wid = wid.ravel()
rest = np.nonzero(~sel)[0]
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
nw = wid.max() + 1
ea = wid[I[rest, 0]]; eb = wid[I[rest, 1]]; ec = wid[I[rest, 2]]
G = coo_matrix((np.ones(2 * len(rest)), (np.concatenate([ea, ea]), np.concatenate([eb, ec]))), shape=(nw, nw))
nc, lab_ = connected_components(G, directed=False)
tl = lab_[ea]; cnt = np.bincount(tl, minlength=nc)
small = cnt[tl] <= ORPH
orphan = np.zeros(m, bool); orphan[rest[small & inhead[rest]]] = True
sel |= orphan
print(f'strands: voxels {VOX * 1000:.1f} mm, a box {shape}; the solid {int(solid.sum())} voxels, opened by a ball of {OPEN * 1000:.1f} mm to {int(opened.sum())}; '
      f'{n1} triangles further than {OFF * 1000:.1f} mm off it (hair {int((sel & ishair).sum())}, under {int((sel & isunder & ~ishair).sum())}), '
      f'{int(orphan.sum())} more left joined to nothing ({int(small.sum())} in pieces of {ORPH} or fewer); {int(sel.sum())} of {int(inhead.sum())} in the head box')
if MODE == 'debug':                                              # (a probe's picture: each triangle in the head box by its distance)
    cls = np.zeros(m, np.uint8); hb_ = inhead & ~keep
    cls[hb_ & (dc <= 0.001)] = 1; cls[hb_ & (dc > 0.001) & (dc <= 0.002)] = 2; cls[hb_ & (dc > 0.002) & (dc <= 0.004)] = 3; cls[hb_ & (dc > 0.004)] = 4
    cls[hb_ & ~(ishair | isunder)] = np.where(cls[hb_ & ~(ishair | isunder)] >= 3, 5, 0)
    cls.tofile(f'{D}/sel.u8'); sys.exit(0)
sel.astype(np.uint8).tofile(f'{D}/sel.u8')
