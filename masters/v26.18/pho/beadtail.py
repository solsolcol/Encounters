"""v26.18 · HIS BEADS, WHOLE ON HIS LAP (Chad, 16 Nov 2026, of the hall's cross-legged Grandmaster Pho: "The beads get cut
off"). His two black bead strands hang from his neck and close in a V about 20 cm below his waist band; the lower part of
that V lies on his robe below the waist, which the cross-legged seat does not draw (c_cast.js crossHem: a level hem, and a
made cloth over his legs), so both strands stopped dead at the hem.

This makes the part below the hem again, from HIS OWN beads: the length of each strand just above the hem (its triangles,
its own paint on his own sheet) is laid again BELOW it, mirrored at the hem, along one curve: straight down from the hem's
edge to the cloth, then over the cloth in a hanging loop to the other strand, the loop as long as his own (LH each side).
Each point keeps its place across the strand and its height off the cloth, so a bead is a bead. The result is a mesh in
his own frame on the cushion (metres, y up), with his body sheet's own coordinates: the game draws it with his body's own
material and binds it as it binds the cloth (c_cast.js crossDress).

  python3 -I masters/v26.18/pho/beadtail.py <posed.npy> <skins-bind.npz> <lap-flat.json> <out.json> [HEM=0.276] [LH=0.21]
    posed.npy       his main skin as the game poses it at rest, in the cushion's frame (tools/probes/poselab.mjs job)
    skins-bind.npz  that skin's uv0, i0 (triangles) and c0 (his sheet's colour at each point)
    lap-flat.json   the made cloth (lapcloth.py)
A point is a BEAD's when its colour on his sheet is dark (the strongest channel under 0.30): 3,207 of his 77,777. """
import sys, json, os, numpy as np
posed, bind, lapf, out = sys.argv[1:5]
E = lambda k, d: float(os.environ.get(k, d))
HEM, LH, EPS, DARK = E('HEM', 0.276), E('LH', 0.21), E('EPS', 0.002), E('DARK', 0.30)
P = np.load(posed).astype(np.float64); Z = np.load(bind); UV = Z['uv0']; TRI = Z['i0'].astype(np.int64); C = Z['c0']
dark = C.max(1) < DARK

# ---- the cloth's top, as a map of heights (2 mm cells), and a smooth copy for the curve to lie on
L = json.load(open(lapf)); LP = np.array(L['pos'], dtype=np.float64).reshape(-1, 3); LT = np.array(L['tri'], dtype=np.int64).reshape(-1, 3)
CELL, X0, X1, Z0, Z1 = 0.002, -0.30, 0.30, -0.20, 0.45
NX, NZ = int((X1 - X0) / CELL) + 1, int((Z1 - Z0) / CELL) + 1
H = np.full((NX, NZ), -1.0)
bary = [(a / 6, b / 6, 1 - a / 6 - b / 6) for a in range(7) for b in range(7 - a)]
for (wa, wb, wc) in bary:
    q = LP[LT[:, 0]] * wa + LP[LT[:, 1]] * wb + LP[LT[:, 2]] * wc
    ix = np.clip(((q[:, 0] - X0) / CELL).round().astype(int), 0, NX - 1); iz = np.clip(((q[:, 2] - Z0) / CELL).round().astype(int), 0, NZ - 1)
    np.maximum.at(H, (ix, iz), q[:, 1])
def blur(A, s):
    r = int(3 * s); k = np.exp(-0.5 * (np.arange(-r, r + 1) / s) ** 2); k /= k.sum()
    A = np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode='edge'), k, mode='valid'), 0, A)
    return np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode='edge'), k, mode='valid'), 1, A)
have = H > -0.5
for _ in range(12):                                   # (holes between the samples filled from their neighbours)
    if have.all(): break
    Hp = np.pad(np.where(have, H, 0), 1); Wp = np.pad(have.astype(float), 1)
    s = sum(Hp[1 + dx:NX + 1 + dx, 1 + dz:NZ + 1 + dz] for dx in (-1, 0, 1) for dz in (-1, 0, 1)); w = sum(Wp[1 + dx:NX + 1 + dx, 1 + dz:NZ + 1 + dz] for dx in (-1, 0, 1) for dz in (-1, 0, 1))
    fill = (~have) & (w > 0); H[fill] = s[fill] / w[fill]; have = have | fill
H[~have] = 0.0
HS = blur(H, 2.5)                                     # (5 mm: the curve does not follow a crease)
def samp(A, x, z):
    fx = np.clip((np.asarray(x) - X0) / CELL, 0, NX - 1.001); fz = np.clip((np.asarray(z) - Z0) / CELL, 0, NZ - 1.001)
    i = np.floor(fx).astype(int); j = np.floor(fz).astype(int); a = fx - i; b = fz - j
    return A[i, j] * (1 - a) * (1 - b) + A[i + 1, j] * a * (1 - b) + A[i, j + 1] * (1 - a) * b + A[i + 1, j + 1] * a * b
GX, GZ = np.gradient(HS, CELL)
def normal(x, z):
    n = np.stack([-samp(GX, x, z), np.ones_like(np.asarray(x, dtype=float)), -samp(GZ, x, z)], -1); return n / np.linalg.norm(n, axis=-1, keepdims=True)

# ---- each strand above the hem: its middle line on his robe (x, and the robe's face z under the beads), by height
def strand(side):
    m = dark & (P[:, 1] > HEM - 0.02) & (P[:, 1] < HEM + LH + 0.06) & (P[:, 2] > -0.08) & ((P[:, 0] < -0.02) if side < 0 else (P[:, 0] >= -0.02)) & (np.abs(P[:, 0]) < 0.2)
    ys = np.arange(HEM - 0.016, HEM + LH + 0.05, 0.004); cx, cz, cy = [], [], []
    x0 = np.median(P[m, 0])
    for y in ys:
        b = m & (np.abs(P[:, 1] - y) < 0.006) & (np.abs(P[:, 0] - x0) < 0.045)
        if b.sum() < 6: continue
        xm = np.median(P[b, 0]); b = b & (np.abs(P[:, 0] - xm) < 0.022)
        zm = np.median(P[b, 2]); b = b & (np.abs(P[:, 2] - zm) < 0.03)
        if b.sum() < 6: continue
        cx.append(np.median(P[b, 0])); cz.append(np.percentile(P[b, 2], 12)); cy.append(y)
    cy = np.array(cy); fx = np.polyfit(cy, cx, 3); fz = np.polyfit(cy, cz, 3)
    return fx, fz, m
def frames(fx, fz, y):
    y = np.asarray(y, dtype=float); c = np.stack([np.polyval(fx, y), y, np.polyval(fz, y)], -1)
    e = np.stack([np.polyval(np.polyder(fx), y), np.ones_like(y), np.polyval(np.polyder(fz), y)], -1); sp = np.linalg.norm(e, axis=-1); e = e / sp[..., None]
    lat = np.array([1.0, 0, 0]) - e * e[..., :1]; lat /= np.linalg.norm(lat, axis=-1, keepdims=True); n = np.cross(lat, e)
    return c, e, lat, n, sp

S = {}
for side in (-1, 1):
    fx, fz, m = strand(side)
    yy = np.linspace(HEM - 0.02, HEM + LH + 0.06, 600); _, _, _, _, sp = frames(fx, fz, yy)
    arc = np.concatenate([[0], np.cumsum((sp[1:] + sp[:-1]) / 2 * np.diff(yy))]); arc -= np.interp(HEM, yy, arc)      # (arc length from the hem, up the strand)
    S[side] = dict(fx=fx, fz=fz, m=m, yy=yy, arc=arc, A=np.array([np.polyval(fx, HEM), HEM, np.polyval(fz, HEM)]))

# ---- the curve the loop lies on: down from each strand's hem point to the cloth, then one hanging loop over the cloth
A, B = S[-1]['A'], S[1]['A']
def loop(Dp, n=900):
    t = np.linspace(0, 1, n); x = A[0] + (B[0] - A[0]) * t; z = A[2] + (B[2] - A[2]) * t + 4 * Dp * t * (1 - t)
    return np.stack([x, samp(HS, x, z) + EPS, z], -1)
def whole(Dp):
    g = loop(Dp); dA = np.linspace(0, 1, 40)[:-1, None]; a = A[None] * (1 - dA) + g[:1] * dA; b = (B[None] * (1 - dA) + g[-1:] * dA)[::-1]
    return np.concatenate([a, g, b]), len(a), len(a) + len(g)
def length(p): return np.linalg.norm(np.diff(p, axis=0), axis=1).sum()
lo, hi = 0.0, 0.35
for _ in range(50):
    mid = (lo + hi) / 2
    if length(whole(mid)[0]) < 2 * LH: lo = mid
    else: hi = mid
Dp = (lo + hi) / 2; G, i0, i1 = whole(Dp)
# (resampled evenly, its corners where it lands on the cloth rounded, its ends held; the cloth's normal on it, the robe's on the drops)
def resample(p, n):
    d = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(p, axis=0), axis=1))]); s = np.linspace(0, d[-1], n)
    return np.stack([np.interp(s, d, p[:, k]) for k in range(3)], -1), d[-1]
N0 = np.zeros_like(G); N0[:i0] = [0, 0, 1]; N0[i1:] = [0, 0, 1]; N0[i0:i1] = normal(G[i0:i1, 0], G[i0:i1, 2])
GN = np.concatenate([G, N0], 1); dd = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(G, axis=0), axis=1))]); n = 2400; ss = np.linspace(0, dd[-1], n)
GN = np.stack([np.interp(ss, dd, GN[:, k]) for k in range(6)], -1)
def smooth1(Aa, s):
    r = int(3 * s); k = np.exp(-0.5 * (np.arange(-r, r + 1) / s) ** 2); k /= k.sum()
    return np.stack([np.convolve(np.pad(Aa[:, c], r, mode='edge'), k, mode='valid') for c in range(Aa.shape[1])], -1)
step = dd[-1] / (n - 1); GN = smooth1(GN, 0.006 / step)
# (after the rounding: no point of the curve under the cloth)
low = samp(HS, GN[:, 0], GN[:, 2]) + EPS; on = (ss > 0.05) & (ss < dd[-1] - 0.05); GN[on, 1] = np.maximum(GN[on, 1], low[on])
Gs = GN[:, :3]; d2 = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(Gs, axis=0), axis=1))]); Ltot = d2[-1]
T = np.gradient(Gs, d2, axis=0); T /= np.linalg.norm(T, axis=1, keepdims=True)
Nn = GN[:, 3:] - T * (GN[:, 3:] * T).sum(1, keepdims=True); Nn /= np.linalg.norm(Nn, axis=1, keepdims=True)
def at(s):
    s = np.clip(s, 0, Ltot); return (np.stack([np.interp(s, d2, Gs[:, k]) for k in range(3)], -1), np.stack([np.interp(s, d2, T[:, k]) for k in range(3)], -1), np.stack([np.interp(s, d2, Nn[:, k]) for k in range(3)], -1))

# ---- each strand's own triangles, hem to LH above it, laid mirrored below the hem along the curve
pos, uv, tri, rep = [], [], [], {}
for side in (-1, 1):
    s = S[side]; y = P[:, 1]; c, e, lat, nn, _ = frames(s['fx'], s['fz'], y); d = P - c
    a = np.interp(y, s['yy'], s['arc']) + (d * e).sum(1); u = (d * lat).sum(1); v = (d * nn).sum(1)
    near = (np.abs(u) < 0.03) & (v > -0.012) & (v < 0.04) & (a > -0.015) & (a < LH + 0.004)
    mine = s['m'] & near
    # (a triangle is a bead's when two of its points are: with one, a fringe of his robe's white came with each bead and
    #  stood off the cloth as pale flecks; a point of his robe that still comes is laid flat on the cloth)
    t = TRI[(mine[TRI].sum(1) >= 2) & near[TRI].all(1)]
    ids = np.unique(t); re = -np.ones(len(P), dtype=np.int64); re[ids] = np.arange(len(ids)) + sum(len(p) for p in pos)
    v = np.where(mine, v, 0.0)
    sa = a[ids] if side < 0 else Ltot - a[ids]                       # (the left strand runs the curve from its start, the right from its end)
    c2, T2, N2 = at(sa)
    if side > 0: T2 = -T2                                           # (down its own strand)
    lat2 = np.cross(N2, T2); over = a[ids] - np.clip(a[ids], 0, None)   # (a point just above the hem stays above it, on its own strand)
    p2 = c2 + lat2 * u[ids][:, None] + N2 * np.clip(v[ids], 0, None)[:, None] + T2 * over[:, None]
    pos.append(p2); uv.append(UV[ids]); tri.append(re[t][:, ::-1])    # (a mirror turns a triangle over)
    rep['L' if side < 0 else 'R'] = dict(points=int(len(ids)), triangles=int(len(t)), dark=int(mine[ids].sum()), hem=[round(float(q), 4) for q in s['A']], thick=round(float(np.percentile(v[ids][mine[ids]], 98)), 4))
pos = np.concatenate(pos); uv = np.concatenate(uv); tri = np.concatenate(tri)
# (normals from the laid shape; turned to stand off the cloth)
fn = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]]); nor = np.zeros_like(pos)
for k in range(3): np.add.at(nor, tri[:, k], fn)
nor /= np.maximum(np.linalg.norm(nor, axis=1, keepdims=True), 1e-12)
up = normal(pos[:, 0], pos[:, 2]); face = float(((nor * up).sum(1) > 0).mean())
if face < 0.5: tri = tri[:, ::-1]; nor = -nor
under = pos[:, 1] - samp(H, pos[:, 0], pos[:, 2]); onc = (pos[:, 1] < HEM - 0.05)
rep.update(depth=round(float(Dp), 4), length=round(float(Ltot), 4), want=2 * LH, apex=[round(float(q), 4) for q in Gs[len(Gs) // 2]], drop=[round(float(HEM - (samp(HS, A[0], A[2]))), 4), round(float(HEM - samp(HS, B[0], B[2])), 4)],
           points=int(len(pos)), triangles=int(len(tri)), facing=round(max(face, 1 - face), 3), lowest_over_cloth=round(float(under[onc].min()), 4) if onc.any() else None, y=[round(float(pos[:, 1].min()), 4), round(float(pos[:, 1].max()), 4)],
           x=[round(float(pos[:, 0].min()), 4), round(float(pos[:, 0].max()), 4)], z=[round(float(pos[:, 2].min()), 4), round(float(pos[:, 2].max()), 4)])
json.dump(dict(pos=[round(float(q), 5) for q in pos.ravel()], nor=[round(float(q), 4) for q in nor.ravel()], uv=[round(float(q), 6) for q in uv.ravel()], tri=[int(q) for q in tri.ravel()], rep=rep), open(out, 'w'))
print(json.dumps(rep))
# ---- CHECK=1: which way the triangles face, his own above the hem against the laid ones (a mirror must turn each over once)
if os.environ.get('CHECK'):
    for side in (-1, 1):
        s = S[side]; y = P[:, 1]; c, e, lat, nn, _ = frames(s['fx'], s['fz'], y); d = P - c
        a = np.interp(y, s['yy'], s['arc']) + (d * e).sum(1); u = (d * lat).sum(1); v = (d * nn).sum(1)
        near = (np.abs(u) < 0.03) & (v > -0.012) & (v < 0.04) & (a > -0.006) & (a < LH + 0.004); mine = s['m'] & near
        t = TRI[(mine[TRI].sum(1) >= 1) & near[TRI].all(1)]
        g = np.cross(P[t[:, 1]] - P[t[:, 0]], P[t[:, 2]] - P[t[:, 0]]); ar = np.linalg.norm(g, axis=1); out_ = (g * nn[t[:, 0]]).sum(1)
        print('side', side, 'his own: share of area facing off the robe', round(float(ar[out_ > 0].sum() / ar.sum()), 3))
    g = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]]); ar = np.linalg.norm(g, axis=1)
    cen = pos[tri].mean(1); dcen = np.linalg.norm(cen[:, None, :] - Gs[None, ::8, :], axis=2).argmin(1) * 8; out_ = (g * Nn[dcen]).sum(1)
    print('laid: share of area facing off the cloth', round(float(ar[out_ > 0].sum() / ar.sum()), 3))
