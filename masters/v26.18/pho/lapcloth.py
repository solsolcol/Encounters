# v26.18 · GRANDMASTER PHO'S LAP CLOTH, made in Blender (Chad, 16 Nov 2026: the hall's inside "needs to look exactly the
# same as the photos"; in them the master sits cross-legged on the dais, a white lower cloth smooth and taut over both
# knees). His own file's cross-legged take draws his robe below the waist as a torn slab
# (masters/v24.49/shots/pho-floor-sit.jpg): one tube of cloth cannot wrap two crossed legs (v24.47). So the cloth of that
# one pose is MADE, and the game draws it in place of his robe below the waist while he sits so (c_cast.js, crossSit:
# his robe is ended there in a level hem, HEM over the cushion, and this comes out from under it as a lower cloth does).
#
# HOW. A lower cloth on a man sitting cross-legged is drawn TAUT: from his waist to his knees it is a table, between his
# knees a shallow hammock, and past his legs it falls to the cushion. So it is first laid as that: the membrane that
# stands on a ring round his waist and on everything of his legs that it touches, sagging a little between (solved on a
# grid, 1 cm), cut where his legs end and dropped to the cushion; then Blender's cloth solver lets it settle on him (its
# own lengths kept, so nothing is added that would crumple at his knees: a first cloth cut as a round sheet did). A first
# cloth pinned where his own take joins robe and trunk was wrong twice over: that join is in his floor take's lean, not
# the upright trunk the game seats him with, and it is ragged.
#
# THE POSE IS THE GAME'S OWN: his skin as the game poses it (the upper body of his bench rest, upright, on the legs of
# his floor take) is written out by the pose lab (masters/v26.18/pho/posed.js -> posed-rest.json: every point of his
# main skin in his own frame, metres, y up, z his front, his hip joint over the origin).
#
#   <blender python> masters/v26.18/pho/lapcloth.py <posed-rest.json> <outdir>
#
# Writes <outdir>/lap.glb (metres, y up, z his front, the origin on the cushion's top under his hip joint; TEXCOORD_1.x =
# each point's share of his SPINE: the top of the cloth leans with his trunk, the rest lies still on his legs), its colour
# sheet lap-ao.png (the cloth's own shading under him, baked: a phone draws no shadows), lap.json (how high his hip joint
# rides over the cushion, the hem, the heights of the cloth's top under any point: where a resting hand lies) and
# lap-flat.json (plain numbers for the pose lab).
import bpy, bmesh, sys, json, math, os, time
import numpy as np
from mathutils import Vector, Matrix

src, outdir = sys.argv[-2], sys.argv[-1]
os.makedirs(outdir, exist_ok=True)
E = lambda k, d: float(os.environ.get(k, d))
NS = int(E('NS', 200)); NT, NK, NL = int(E('NT', 44)), int(E('NK', 18)), int(E('NL', 4))    # points round; rings on the table, down the fall, on the cushion
HEM = E('HEM', 0.276)                                 # his robe's hem over the cushion's top (c_cast.js crossSit cuts it there)
RING_DY, COLLAR, INSET = E('RING_DY', -0.014), E('COLLAR', 0.05), E('INSET', 0.025)       # the ring under the hem, the band up inside his robe, how far inside
LIE, MARGIN, CLEAR = E('LIE', 0.025), E('MARGIN', 0.03), E('CLEAR', 0.007)
SAG = E('SAG', 6.0)                                   # how far it sags between what holds it: a span of 10 cm sags 7 mm at 6 (it lies ON him, and bridges only gaps)
# (a gentle settling: with the cloth held off itself and ninety frames it fell in on itself, a point 56 cm from where it was laid)
FRAMES, QUAL, SELF = int(E('FRAMES', 40)), int(E('QUAL', 10)), int(E('SELF', 0))
BEND, MASS = E('BEND', 2.0), E('MASS', 0.3)
SPINE_REACH = E('SPINE_REACH', 0.09)                  # how far down the sheet his spine's share dies away
KNEE_TOP, ANKLE_Y = E('KNEE_TOP', 0.18), E('ANKLE_Y', 0.052)          # his knees' tops and his ankles' middles over the cushion (0 for KNEE_TOP: as his take has them)
STAGE = os.environ.get('STAGE', 'all')                # 'tent' writes the laid cloth unsettled; 'sim' stops before the bake
T0 = time.time(); say = lambda *a: print('%4.0fs' % (time.time() - T0), *a, flush=True)

D = json.load(open(src)); S0 = D['skins'][0]; n = S0['n']
P = np.array(S0['posed'], dtype=np.float64).reshape(n, 3); W = np.array(S0['w']).reshape(n, 5); I = np.array(S0['index']).reshape(-1, 3)
kind = np.argmax(np.stack([W[:, 0] + W[:, 3] + W[:, 4], W[:, 1], W[:, 2]], 1), 1)     # 0 the rest of him, 1 robe below the waist, 2 legs
spine = (W[:, 4] > 0.5) & (kind == 0)
# (the cushion's top: 6 mm under the lowest of his legs, their second hundredth. In his own take it is the robe that
#  touches the floor, and the robe is not drawn: his legs stand 4 cm over where it lay)
GROUND = float(np.percentile(P[kind == 2, 1], 2)) - 0.006
P[:, 1] -= GROUND
J = {k.replace('mixamorig', ''): np.array(v) - np.array([0, GROUND, 0]) for k, v in D['joints'].items()}
RING_Y = HEM + RING_DY
say('cushion top %.3f under his posed frame: his hip joint rides %.3f over it; hem %.3f, ring %.3f' % (GROUND, J['Hips'][1], HEM, RING_Y))

# ---- his trunk's middle at the hem, its outline there, and the ring inside it
band = spine & (P[:, 1] > HEM - 0.005) & (P[:, 1] < HEM + 0.05)
cx, cz = float(np.median(P[band, 0])), float((P[band, 2].min() + P[band, 2].max()) / 2)
ang = np.arctan2(P[band, 2] - cz, P[band, 0] - cx) % (2 * np.pi); rr = np.hypot(P[band, 0] - cx, P[band, 2] - cz)
rad = [None] * NS
for i in range(NS):
    m = ((ang / (2 * np.pi) * NS).astype(int) % NS) == i
    if m.sum() >= 2: rad[i] = float(np.percentile(rr[m], 90))
def fill(a):
    out = list(a)
    for i in range(NS):
        if a[i] is None:
            l = next(a[(i - k) % NS] for k in range(1, NS) if a[(i - k) % NS] is not None); r = next(a[(i + k) % NS] for k in range(1, NS) if a[(i + k) % NS] is not None)
            out[i] = (l + r) / 2
    return out
def blur(a, k):
    for _ in range(k): a = [(a[i - 2] + a[i - 1] * 2 + a[i] * 3 + a[(i + 1) % NS] * 2 + a[(i + 2) % NS]) / 9 for i in range(NS)]
    return a
outline = blur(fill(rad), 8); ring = [max(0.06, r - INSET) for r in outline]
TH = [(i + 0.5) / NS * 2 * math.pi for i in range(NS)]                 # (the game's plan: angle 0 his left, a quarter turn his front)
say('waist middle x %.3f z %.3f; outline %.3f to %.3f; ring %.3f to %.3f' % (cx, cz, min(outline), max(outline), min(ring), max(ring)))

# ---- what the cloth stands on, as heights over the cushion on a grid: his legs (the scan, and round bars under it: a scan has holes), his knees, his seat
CELL = 0.01; X0, Z0, NX, NZ = -0.85, -0.70, 170, 170
H = np.zeros((NX, NZ)); gx = X0 + np.arange(NX) * CELL; gz = Z0 + np.arange(NZ) * CELL; GX, GZ = np.meshgrid(gx, gz, indexing='ij')
def ball(c, r):
    d2 = (GX - c[0]) ** 2 + (GZ - c[2]) ** 2; m = d2 < r * r; H[m] = np.maximum(H[m], c[1] + np.sqrt(r * r - d2[m]))
# (HIS LEGS UNDER THE CLOTH ARE NOT DRAWN, so they are laid as the photographs have a master's: his take holds his knees
#  25 cm over the cushion, and in the owner's photographs of the hall the seated master's are some 17, his lap all but
#  level. Each thigh keeps its length and its way out from his hip and is let down until the knee's top stands KNEE_TOP
#  over the cushion; each shin keeps its length and its way to the ankle, the ankle on the cushion. With KNEE_TOP 0 the
#  take's own legs are used, the scan with them)
LEGS = {}; norm = np.linalg.norm
for Sd in ('Left', 'Right'):
    hp, kn, an, toe = J[Sd + 'UpLeg'], J[Sd + 'Leg'], J[Sd + 'Foot'], J[Sd + 'ToeBase']
    if KNEE_TOP > 0:
        Lt, Lsn, Lf = norm(kn - hp), norm(an - kn), toe - an; kc = KNEE_TOP - 0.074
        d = kn - hp; dh = np.array([d[0], 0, d[2]]); dh /= norm(dh); hor = math.sqrt(max(1e-6, Lt ** 2 - (kc - hp[1]) ** 2))
        kn = np.array([hp[0] + dh[0] * hor, kc, hp[2] + dh[2] * hor])
        d2 = an - kn; dh2 = np.array([d2[0], 0, d2[2]]); dh2 /= norm(dh2); hor2 = math.sqrt(max(1e-6, Lsn ** 2 - (ANKLE_Y - kc) ** 2))
        an = np.array([kn[0] + dh2[0] * hor2, ANKLE_Y, kn[2] + dh2[2] * hor2]); toe = np.array([an[0] + Lf[0], 0.042, an[2] + Lf[2]])
    LEGS[Sd] = (hp, kn, an, toe)
if KNEE_TOP <= 0:
    L = P[kind == 2]; ix = np.round((L[:, 0] - X0) / CELL).astype(int); iz = np.round((L[:, 2] - Z0) / CELL).astype(int)
    np.maximum.at(H, (ix, iz), L[:, 1])
BARS = []
for Sd in ('Left', 'Right'):
    hp, kn, an, toe = LEGS[Sd]
    for a, b, r in ((hp, kn, 0.078), (kn, an, 0.052), (an, toe, 0.038)):
        BARS.append((a, b, r))
        for q in range(int(np.linalg.norm(b - a) / 0.006) + 2): ball(a + (b - a) * min(1.0, q * 0.006 / max(1e-6, np.linalg.norm(b - a))), r)
    ball(kn, 0.074)
say('his knees under the cloth: left %s right %s; ankles left %s right %s' % tuple(str([round(float(c), 3) for c in LEGS[a][b]]) for a, b in (('Left', 1), ('Right', 1), ('Left', 2), ('Right', 2))))
hw = max(outline[i] for i in range(NS) if abs(math.cos(TH[i])) > 0.9); hd = max(outline[i] for i in range(NS) if abs(math.sin(TH[i])) > 0.9)
SEAT = (np.array([cx, 0.085, cz - 0.01]), (hw + 0.005, 0.125, hd))     # (his seat: as wide and deep as his robe at the hem, from the cushion to under the ring)
u = ((GX - SEAT[0][0]) / SEAT[1][0]) ** 2 + ((GZ - SEAT[0][2]) / SEAT[1][2]) ** 2; m = u < 1; H[m] = np.maximum(H[m], SEAT[0][1] + SEAT[1][1] * np.sqrt(1 - u[m]))
H = np.maximum(H, 0.0)

# ---- where the cloth lies: as far each way from his waist's middle as the last of him that way, a little past it (his
#      knees stand out of it as knees; a first cut on the hull of all of him made a box); and the ring's own inside left out
def reach(th):
    dx, dz = math.cos(th), math.sin(th); r = 0.05; last = 0.0
    while r < 1.1:
        r += 0.004; i, k = int(round((cx + dx * r - X0) / CELL)), int(round((cz + dz * r - Z0) / CELL))
        if 0 <= i < NX and 0 <= k < NZ and H[i, k] > 0.012: last = r
    return last
rE = [reach(t) for t in TH]
rE = [max(rE[(i + d) % NS] for d in (-2, -1, 0, 1, 2)) for i in range(NS)]            # (never inside a knee for a ray that slips past it)
rE = [max(r, ring[i] + 0.03) + MARGIN for i, r in enumerate(blur(rE, 3))]
thG = np.arctan2(GZ - cz, GX - cx) % (2 * np.pi); rG = np.hypot(GX - cx, GZ - cz)
per = lambda a: np.interp(thG, TH, a, period=2 * math.pi)
OM = rG <= per(rE)
RD = rG <= per(ring) + CELL * 0.5                                    # (the ring and its inside: held at the ring's height)
edge_r = lambda th: float(np.interp(th % (2 * math.pi), TH, rE, period=2 * math.pi))
say('grid %dx%d; cloth cells %d; it reaches %.3f to %.3f from his middle' % (NX, NZ, int((OM & ~RD).sum()), min(rE), max(rE)))

# ---- the membrane: on the ring and on him, sagging between; past him it is on the cushion, so it comes down off his
#      legs to it as a cloth does (left free at its edge it stood out level from his knees and fell as a wall: a tub)
T = np.where(OM, np.maximum(H + CLEAR, RING_Y * 0.6), CLEAR); T[RD] = RING_Y
free = OM & ~RD; g = SAG * CELL * CELL / 4
for it in range(int(E('ITER', 24000))):
    Tp = np.pad(T, 1, mode='edge')
    s4 = (Tp[2:, 1:-1] + Tp[:-2, 1:-1] + Tp[1:-1, 2:] + Tp[1:-1, :-2]) / 4
    T = np.where(free, np.maximum(H + CLEAR, s4 - g), T)
say('membrane: %.3f to %.3f over the cushion; at his knees %.3f / %.3f' % (T[free].min(), T[free].max(), float(T[int(round((LEGS['Left'][1][0] - X0) / CELL)), int(round((LEGS['Left'][1][2] - Z0) / CELL))]), float(T[int(round((LEGS['Right'][1][0] - X0) / CELL)), int(round((LEGS['Right'][1][2] - Z0) / CELL))])))
def Tat(x, z):
    fx, fz = (x - X0) / CELL, (z - Z0) / CELL; i0, k0 = int(math.floor(fx)), int(math.floor(fz)); a, b = fx - i0, fz - k0
    i0 = max(0, min(NX - 2, i0)); k0 = max(0, min(NZ - 2, k0))
    return T[i0, k0] * (1 - a) * (1 - b) + T[i0 + 1, k0] * a * (1 - b) + T[i0, k0 + 1] * (1 - a) * b + T[i0 + 1, k0 + 1] * a * b

# ---- the sheet: rays from the ring out over him to where he ends that way, down to the cushion, a little way along it
V, UVw, pin = [], [], []
NR = NT + NK + NL
for i in range(NS):
    th = TH[i]; dx, dz = math.cos(th), math.sin(th); r0, r1 = ring[i], edge_r(th) + 0.012
    # (the way out along the membrane, every 2 mm; then NT + NK points of it evenly by its own length: where it is steep it has more)
    fine = [(r0, RING_Y)]; r = r0
    while r < r1: r = min(r1, r + 0.002); fine.append((r, Tat(cx + dx * r, cz + dz * r)))
    cum = [0.0]
    for k in range(1, len(fine)): cum.append(cum[-1] + math.hypot(fine[k][0] - fine[k - 1][0], fine[k][1] - fine[k - 1][1]))
    ray = []; k = 0
    for j in range(NT + NK + 1):
        t = cum[-1] * j / (NT + NK)
        while k < len(cum) - 2 and cum[k + 1] < t: k += 1
        u2 = (t - cum[k]) / max(1e-9, cum[k + 1] - cum[k]); ray.append((fine[k][0] + (fine[k + 1][0] - fine[k][0]) * u2, fine[k][1] + (fine[k + 1][1] - fine[k][1]) * u2))
    ray += [(r1 + LIE * j / NL, CLEAR + 0.002) for j in range(1, NL + 1)]
    s = 0.0
    for j, (r, y) in enumerate(ray):
        if j: s += math.hypot(r - ray[j - 1][0], y - ray[j - 1][1])
        w = max(0.0, 1.0 - s / SPINE_REACH)
        V.append((cx + dx * r, y, cz + dz * r)); UVw.append(w * w * (3 - 2 * w))
    pin.append(i * (NR + 1))
vid = lambda i, j: (i % NS) * (NR + 1) + j
F = [(vid(i, j), vid(i, j + 1), vid(i + 1, j + 1), vid(i + 1, j)) for i in range(NS) for j in range(NR)]
Vn = np.array(V); say('sheet %d points, %d faces' % (len(V), len(F)))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
B = lambda p: Vector((p[0], -p[2], p[1]))             # the game's (x, y up, z front) -> Blender's (x, y back, z up)
def mesh_obj(name, Vs, Fs):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in Vs], [], [tuple(int(i) for i in f) for f in Fs]); me.update()
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob); return ob
def sub(mask_tri):
    Tm = I[mask_tri]; used = np.unique(Tm); mm = -np.ones(n, dtype=np.int64); mm[used] = np.arange(len(used))
    return [B(P[i]) for i in used], mm[Tm]
legV, legF = sub((kind[I] == 2).all(1)); trV, trF = sub(spine[I].all(1) & (P[I][:, :, 1].min(1) > HEM - 0.002) & (P[I][:, :, 1].max(1) < 0.80))
legs = mesh_obj('legs', legV, legF); trunk = mesh_obj('trunk', trV, trF)
cloth = mesh_obj('lap', [B(v) for v in V], F)
# (which way its faces look: up on the table)
cloth.data.update(); up = sum(p.normal.z for p in cloth.data.polygons if p.center.z > 0.15)
if up < 0:
    F = [(a, d, c, b) for a, b, c, d in F]; bpy.data.objects.remove(cloth, do_unlink=True); cloth = mesh_obj('lap', [B(v) for v in V], F)
# (its sheet of paint: each point as far from the middle as it is along the cloth from the ring, so the fall and the lie, which share the
#  table's edge in plan, have rings of their own further out; the band up inside his robe has the rings inside the ring's)
arc = []
for i in range(NS):
    s = 0.0
    for j in range(NR + 1):
        if j: a, b = V[vid(i, j - 1)], V[vid(i, j)]; s += math.dist(a, b)
        arc.append(s)
AMAX = max(arc) + ring[0]
UV = [(0.5 + math.cos(TH[k // (NR + 1)]) * (ring[k // (NR + 1)] + arc[k]) / (AMAX * 1.04) * 0.5, 0.5 + math.sin(TH[k // (NR + 1)]) * (ring[k // (NR + 1)] + arc[k]) / (AMAX * 1.04) * 0.5) for k in range(len(V))]
def set_uv(ob, name, data):
    uvl = ob.data.uv_layers.new(name=name)
    for poly in ob.data.polygons:
        for li in poly.loop_indices: uvl.data[li].uv = data[ob.data.loops[li].vertex_index]
set_uv(cloth, 'UVMap', UV); set_uv(cloth, 'spine', [(w, 0.5) for w in UVw])

if STAGE != 'tent':
    col = [legs] if KNEE_TOP <= 0 else []
    def bar(name, a, b, r):
        bm = bmesh.new(); d = (b - a); Lh = d.length
        bmesh.ops.create_cone(bm, cap_ends=True, segments=20, radius1=r, radius2=r, depth=Lh)
        for end in (-Lh / 2, Lh / 2): bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=r, matrix=Matrix.Translation((0, 0, end)))
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
        ob.matrix_world = Matrix.Translation((a + b) / 2) @ d.to_track_quat('Z', 'Y').to_matrix().to_4x4(); return ob
    for k, (a, b, r) in enumerate(BARS): col.append(bar('bar%d' % k, B(a), B(b), r))
    def ballo(name, c, radii):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=16, radius=1.0)
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
        ob.matrix_world = Matrix.Translation(c) @ Matrix.Diagonal((radii[0], radii[1], radii[2], 1.0)); return ob
    for Sd in ('Left', 'Right'): col.append(ballo('knee' + Sd, B(LEGS[Sd][1]), (0.074, 0.074, 0.074)))
    col.append(ballo('seat', B(SEAT[0]), (SEAT[1][0], SEAT[1][2], SEAT[1][1])))
    bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=2, y_segments=2, size=3.0)
    me = bpy.data.meshes.new('ground'); bm.to_mesh(me); bm.free(); ground = bpy.data.objects.new('ground', me); sc.collection.objects.link(ground); col.append(ground)
    for o in col:
        m = o.modifiers.new('col', 'COLLISION'); o.collision.thickness_outer = 0.004; o.collision.thickness_inner = 0.02; o.collision.cloth_friction = 16.0
    vg = cloth.vertex_groups.new(name='pin'); vg.add(pin, 1.0, 'REPLACE')
    cm = cloth.modifiers.new('cloth', 'CLOTH'); cs = cm.settings; cc = cm.collision_settings
    cs.quality = QUAL; cs.mass = MASS; cs.air_damping = 3.0
    cs.tension_stiffness = 60; cs.compression_stiffness = 60; cs.shear_stiffness = 20; cs.bending_stiffness = BEND
    cs.tension_damping = 12; cs.compression_damping = 12; cs.shear_damping = 12; cs.bending_damping = 1.5
    cs.vertex_group_mass = 'pin'; cs.pin_stiffness = 1.0
    cc.use_collision = True; cc.collision_quality = 5; cc.distance_min = 0.004; cc.friction = 16
    cc.use_self_collision = bool(SELF); cc.self_distance_min = 0.003; cc.self_friction = 10
    cm.point_cache.frame_start = 1; cm.point_cache.frame_end = FRAMES
    sc.frame_start = 1; sc.frame_end = FRAMES
    trunk.hide_viewport = True
    for f in range(1, FRAMES + 1):
        sc.frame_set(f)
        if f % 15 == 0: say('frame', f)
    dg = bpy.context.evaluated_depsgraph_get(); ev = cloth.evaluated_get(dg); me2 = bpy.data.meshes.new_from_object(ev)
    cloth.modifiers.clear(); cloth.data = me2
    mv = max((cloth.data.vertices[k].co - B(V[k])).length for k in range(len(V)))
    say('settled: the furthest any point moved from where it was laid %.3f m' % mv)
for p in cloth.data.polygons: p.use_smooth = True

# ---- the band up inside his robe from the ring (what is seen under his hem from below is cloth, not the hollow of him)
me = cloth.data; bmx = bmesh.new(); bmx.from_mesh(me); bmx.verts.ensure_lookup_table()
uv0 = bmx.loops.layers.uv['UVMap']; uv1 = bmx.loops.layers.uv['spine']
prev = [bmx.verts[k] for k in pin]; NC = 4; cuv = {bmx.verts[k]: UV[k] for k in pin}
for c in range(1, NC + 1):
    cur = [bmx.verts.new(B((cx + math.cos(TH[i]) * (ring[i] - 0.012 * c / NC), RING_Y + COLLAR * c / NC, cz + math.sin(TH[i]) * (ring[i] - 0.012 * c / NC)))) for i in range(NS)]
    for i in range(NS): q = ring[i] * (1 - 0.5 * c / NC) / (AMAX * 1.04) * 0.5; cuv[cur[i]] = (0.5 + math.cos(TH[i]) * q, 0.5 + math.sin(TH[i]) * q)
    for i in range(NS):
        f = bmx.faces.new((prev[i], prev[(i + 1) % NS], cur[(i + 1) % NS], cur[i])); f.smooth = True
        for lp in f.loops: lp[uv0].uv = cuv[lp.vert]; lp[uv1].uv = (1.0, 0.5)
    prev = cur
bmx.normal_update(); bmesh.ops.recalc_face_normals(bmx, faces=bmx.faces); bmx.to_mesh(me); bmx.free(); me.update()
up = sum(p.normal.z for p in me.polygons if p.center.z > 0.15 and abs(p.normal.z) > 0.5)
if up < 0: me.flip_normals()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outdir, 'lap-sim.blend'))

# ---- the cloth's own shading under him, baked (the folds' depth and the dark under his robe are paint on a phone)
if STAGE == 'all':
    PX = int(E('PX', 1024))
    trunk.hide_viewport = False
    for o in bpy.data.objects:
        if o not in (cloth, trunk) and o.name != 'ground': o.hide_render = True
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = int(E('SAMPLES', 96))
    mat = bpy.data.materials.new('lap'); mat.use_nodes = True; nt = mat.node_tree
    img = bpy.data.images.new('lap_ao', PX, PX, alpha=False); tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img; nt.nodes.active = tex
    cloth.data.materials.append(mat); cloth.data.uv_layers.active = cloth.data.uv_layers['UVMap']
    for o in bpy.data.objects: o.select_set(False)
    cloth.select_set(True); bpy.context.view_layer.objects.active = cloth
    try:
        if hasattr(sc.render, 'use_texture_cache'): sc.render.use_texture_cache = False
        bpy.ops.object.bake(type='AO', margin=16, use_clear=True)
        img.filepath_raw = os.path.join(outdir, 'lap-ao.png'); img.file_format = 'PNG'; img.save()
        say('baked', img.filepath_raw)
    except Exception as e:
        say('BAKE FAILED', e)

# ---- out: the cloth alone, in the game's frame
for o in list(bpy.data.objects):
    if o is not cloth: bpy.data.objects.remove(o, do_unlink=True)
me = cloth.data; me.calc_loop_triangles()
G = lambda v: (round(v.x, 4), round(v.z, 4), round(-v.y, 4))          # Blender -> the game's (x, y up, z front)
uvA = [None] * len(me.vertices); wA = [0.0] * len(me.vertices)
for lp in me.loops: uvA[lp.vertex_index] = tuple(me.uv_layers['UVMap'].data[lp.index].uv); wA[lp.vertex_index] = me.uv_layers['spine'].data[lp.index].uv[0]
tops = {}
for v in me.vertices:
    gq = G(v.co); k = (round(gq[0] / 0.02), round(gq[2] / 0.02)); tops[k] = max(tops.get(k, -1), gq[1])
flat = {'pos': [c for v in me.vertices for c in G(v.co)], 'uv': [round(c, 4) for u2 in uvA for c in u2], 'spine': [round(w, 3) for w in wA], 'tri': [int(i) for t in me.loop_triangles for i in t.vertices]}
json.dump(flat, open(os.path.join(outdir, 'lap-flat.json'), 'w'))
info = {'hipsOver': round(float(J['Hips'][1]), 4), 'ground': round(GROUND, 4), 'hem': HEM, 'ringY': round(RING_Y, 4), 'middle': [round(cx, 4), round(cz, 4)], 'ring': [round(r, 4) for r in ring], 'outline': [round(r, 4) for r in outline],
        'bones': {k: [round(float(c), 4) for c in J[k]] for k in ('Hips', 'Spine')}, 'legs': {Sd: [[round(float(c), 4) for c in q] for q in LEGS[Sd]] for Sd in LEGS},
        'cell': 0.02, 'top': [[k[0], k[1], round(z, 4)] for k, z in sorted(tops.items())], 'tris': len(me.loop_triangles),
        'settings': {'NS': NS, 'NT': NT, 'NK': NK, 'NL': NL, 'SAG': SAG, 'FRAMES': FRAMES, 'LIE': LIE, 'MARGIN': MARGIN, 'BEND': BEND, 'MASS': MASS, 'INSET': INSET, 'QUAL': QUAL, 'SELF': SELF, 'STAGE': STAGE}}
json.dump(info, open(os.path.join(outdir, 'lap.json'), 'w'))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outdir, 'lap.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(outdir, 'lap.glb'), export_format='GLB', export_yup=True, export_apply=True, export_materials='NONE', export_normals=True, export_texcoords=True)
say('wrote', os.path.join(outdir, 'lap.glb'), info['tris'], 'triangles')
