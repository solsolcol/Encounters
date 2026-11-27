"""v29.0 (E5C1 THINGS-3, coordinator's ask) · w51wrapped: the keepsake WRAPPED in white cloth and bound with white thread
(the plan's 9.3, 32-44 s: "Pho wraps the packet in white cloth and binds it with white thread"), made in code. Sized to
the packet it holds (w51keepsake, 0.070 x 0.061, 0.020 tall) as it lies on the white plate: 0.086 x 0.076, 0.030 tall.
A square of plain white cotton folded over it like an envelope (its four corners brought to the middle, the last flap
on top, the folds soft and a little creased), then bound twice each way with white cotton thread, crossed on top and
tied in a small knot whose two short ends lie loose. Its long side along x.
    $BPY masters/v29.0/props/code/wrapped.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(521)
c = M('whitecotton'); co = c.coord('Object')
a = c.wave(co, 420, dist=0.0, detail=0, kind='BANDS', axis='X'); b = c.wave(co, 420, dist=0.0, detail=0, kind='BANDS', axis='Y'); z3 = c.wave(co, 420, dist=0.0, detail=0, kind='BANDS', axis='Z')
wv = c.math('MULTIPLY', c.math('ADD', c.math('ADD', a, b), z3), 0.3333); soil = c.noise(co, 30, detail=5)
c.col = c.mix(c.math('MULTIPLY', soil, 0.25), '#f1eee6', '#d8d2c4')
c.col = c.mix(c.math('MULTIPLY', wv, 0.05), c.col, '#c9c2b2')
c.rough = c.val(0.85); c.height = c.math('ADD', c.math('MULTIPLY', wv, 0.5), c.math('MULTIPLY', soil, 0.5)); c.bump_strength = 0.15; c.bump_dist = 0.0004
cot = proc(c)
t = M('thread'); co = t.coord('Object')
tw = t.wave(t.mapping(co, scale=(1, 1, 1)), 900, dist=0.0, detail=0, kind='BANDS', axis='X')
t.col = t.mix(t.math('MULTIPLY', tw, 0.18), '#f4f1ea', '#cfc9bb'); t.rough = t.val(0.8); t.height = tw; t.bump_strength = 0.3
thr = proc(t)

L, Wd, Hh = 0.084, 0.074, 0.026        # the wrapped body (before the thread)
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.scale(bm, vec=(L, Wd, Hh), verts=bm.verts); bmesh.ops.translate(bm, vec=(0, 0, Hh / 2), verts=bm.verts)
body = mesh_from_bm('wrap', bm)
bevel(body, 0.007, segs=4); apply_mods(body)
sub = body.modifiers.new('sub', 'SUBSURF'); sub.levels = 3; sub.subdivision_type = 'SIMPLE'; apply_mods(body)
# the cloth's softness: the top domed a little, the edges rounded and rumpled, the thread's bands pressed in
TX, TY = (-0.016, 0.016), (-0.013, 0.013)          # where the thread's two bands run each way
def pinch(d):                                       # how much a band presses the cloth in, by distance from its line
    return math.exp(-(d / 0.0016) ** 2)
for v in body.data.vertices:
    x, y, z = v.co
    top = z > Hh * 0.5
    u, w = x / (L / 2), y / (Wd / 2)
    if top: v.co.z += 0.003 * (1 - u * u) * (1 - w * w)
    v.co.z += 0.0007 * math.sin(x * 330 + y * 120) * math.sin(y * 290 - x * 60) * (1 if z > 0.002 else 0)
    p = max(max(pinch(x - tx) for tx in TX), max(pinch(y - ty) for ty in TY))
    if z > 0.002:
        cx, cy = x, y
        n = Vector((x / (L / 2), y / (Wd / 2), (z - Hh / 2) / (Hh / 2)))
        n.normalize()
        v.co -= n * 0.0012 * p
    # the envelope's folds pressed into the top: from each corner toward the middle, and soft wrinkles round the walls
    if top:
        for (cx_, cy_) in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
            ax_, ay_ = cx_ * L / 2, cy_ * Wd / 2; dl = math.hypot(ax_, ay_)
            t_ = (x * ax_ + y * ay_) / (dl * dl); dd = abs(x * ay_ - y * ax_) / dl
            if 0.15 < t_ < 1.0: v.co.z -= 0.0007 * math.exp(-(dd / 0.0012) ** 2) * min(1.0, (t_ - 0.15) * 4)
    else:
        v.co.z += 0.0005 * math.sin(x * 520 + 1.0) * math.sin(y * 410 + 2.0)
    if abs(x) > L / 2 - 0.004 or abs(y) > Wd / 2 - 0.004:
        k_ = 0.0006 * math.sin((x + y) * 380 + z * 900)
        v.co.x += math.copysign(k_, x) * (abs(x) > L / 2 - 0.004); v.co.y += math.copysign(k_, y) * (abs(y) > Wd / 2 - 0.004)
body.data.materials.append(cot); smooth(body, 180)
parts = [body]
# the folds of the envelope on top: three flaps' edges (a raised hem line) running from the corners to the middle
top_z = lambda x, y: Hh + 0.003 * (1 - (x / (L / 2)) ** 2) * (1 - (y / (Wd / 2)) ** 2)
# the last flap lying on top: a thin soft triangle from the fourth corner to past the middle, its edge rolled
bm = bmesh.new()
tri = [(L / 2 - 0.006, Wd / 2 - 0.006), (-0.006, 0.019), (0.019, -0.007)]
vs = [bm.verts.new((x, y, Hh + 0.01)) for x, y in tri]
bm.faces.new(vs)
bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=8, use_grid_fill=True)
flap = mesh_from_bm('flap', bm)
# laid onto the cloth beneath it (the body's own surface, found by a ray straight down) and 0.6 mm over it
from mathutils.bvhtree import BVHTree
_bvh = BVHTree.FromObject(body, bpy.context.evaluated_depsgraph_get())
for v in flap.data.vertices:
    h = _bvh.ray_cast(Vector((v.co.x, v.co.y, 0.2)), Vector((0, 0, -1)), 0.3)
    if h[0] is not None: v.co.z = h[0].z + 0.0006
flap.data.update()
sol = flap.modifiers.new('sol', 'SOLIDIFY'); sol.thickness = 0.0009; sol.offset = 1; apply_mods(flap)
smooth(flap, 60)
flap.data.materials.append(cot); parts.append(flap)
# the thread: two bands each way round the body (on top, down the sides, under), a little proud of the cloth
from mathutils.bvhtree import BVHTree
bvh = BVHTree.FromObject(body, bpy.context.evaluated_depsgraph_get())
def hug(dirs, origin, r=0.0007):
    """the body's surface along each direction from origin, lifted by the thread's radius"""
    pts = []
    for d in dirs:
        d = Vector(d).normalized(); far = Vector(origin) + d * 0.2
        hit = bvh.ray_cast(far, -d, 0.25)
        loc = hit[0] if hit[0] is not None else Vector(origin) + d * 0.04
        pts.append(tuple(loc + d * (r + 0.0002)))
    return pts
def band_x(x0):     # a loop in the y-z plane at x = x0, round the body's own surface
    dirs = [(0, math.cos(2 * math.pi * i / 72), math.sin(2 * math.pi * i / 72)) for i in range(72)]
    return tube_path('thread', hug(dirs, (x0, 0, Hh / 2)), 0.0006, n=8, mat=thr, closed=True)
def band_y(y0):
    dirs = [(math.cos(2 * math.pi * i / 72), 0, math.sin(2 * math.pi * i / 72)) for i in range(72)]
    return tube_path('thread', hug(dirs, (0, y0, Hh / 2), 0.0013), 0.0006, n=8, mat=thr, closed=True)
for tx in TX: parts.append(band_x(tx))
for ty in TY: parts.append(band_y(ty))
# the knot where the bands cross nearest the middle-top, and its two loose ends
kz = hug([(0, 0, 1)], (TX[1], TY[0], Hh / 2), 0.0013)[0][2] + 0.0008
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=1.0)
for v in bm.verts: v.co = Vector((v.co.x * 0.0026, v.co.y * 0.0022, v.co.z * 0.0016))
knot = mesh_from_bm('knot', bm); knot.location = (TX[1], TY[0], kz); knot.data.materials.append(thr); smooth(knot, 180)
parts.append(knot)
for (dx, dy) in ((0.016, -0.004), (0.010, -0.014)):
    pts = [(TX[1], TY[0], kz), (TX[1] + dx * 0.4, TY[0] + dy * 0.4, kz + 0.0005), hug([(0, 0, 1)], (TX[1] + dx, TY[0] + dy, Hh / 2))[0]]
    parts.append(tube_path('end', pts, 0.0006, n=8, mat=thr))
ob = join(parts, 'wrapped')
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='wrapped')
export([ob], OUT)
