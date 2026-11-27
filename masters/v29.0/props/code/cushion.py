"""v29.0 (E5C1 THINGS-3, R13) · w51cushion: a square floor cushion of faded turmeric-ochre woven cotton, made in code (in
place of w5cushion, episode 4 chapter 5's red one: red is the spell's colour alone in this chapter, plan 4.5). 0.50 x 0.50,
0.125 tall as the old one (cushionB stands on cushionA at y 0.121). A boxed cushion: its top puffed and pulled down to a
covered button in the middle, its walls bellied, a piped seam round its top and bottom edges, soft creases from use.
    $BPY masters/v29.0/props/code/cushion.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(513)
S, H = 0.5, 0.110
def cloth(name, base, dark):
    m = M(name); co = m.coord('Object')
    # the weave: fine threads both ways (about 2 mm), a slub noise along them, the colour faded in patches
    a = m.wave(m.mapping(co, scale=(1, 1, 1)), 95, dist=0.6, detail=1, kind='BANDS', axis='X')
    b = m.wave(m.mapping(co, scale=(1, 1, 1)), 95, dist=0.6, detail=1, kind='BANDS', axis='Y')
    c = m.wave(m.mapping(co, scale=(1, 1, 1)), 95, dist=0.6, detail=1, kind='BANDS', axis='Z')
    weave = m.math('MULTIPLY', m.math('ADD', m.math('ADD', a, b), c), 0.3333)
    slub = m.noise(m.mapping(co, scale=(3, 3, 3)), 40, detail=6, rough=0.7)
    fade = m.noise(co, 4.5, detail=3)
    base_c = m.mix(m.math('MULTIPLY', fade, 0.55), base, '#cdb48a')
    m.col = m.mix(m.math('MULTIPLY', weave, 0.28), base_c, dark, 'MULTIPLY')
    m.col = m.mix(m.math('MULTIPLY', slub, 0.18), m.col, '#e2cfa6')
    m.rough = m.math('ADD', 0.82, m.math('MULTIPLY', weave, 0.1))
    m.height = m.math('ADD', m.math('MULTIPLY', weave, 0.7), m.math('MULTIPLY', slub, 0.3)); m.bump_strength = 0.35; m.bump_dist = 0.0008
    return proc(m)
body = cloth('ochre', '#b48a4c', '#8a6232')
pipe = cloth('ochrepipe', '#a57d43', '#7a5530')
btn = cloth('ochrebtn', '#9c7440', '#6e4c2a')

# the body: a dense rounded box, shaped vertex by vertex
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.scale(bm, vec=(S, S, H), verts=bm.verts)
bmesh.ops.translate(bm, vec=(0, 0, H / 2), verts=bm.verts)
ob = mesh_from_bm('cushion', bm)
bevel(ob, 0.018, segs=4); apply_mods(ob)
sub = ob.modifiers.new('sub', 'SUBSURF'); sub.levels = 3; sub.subdivision_type = 'SIMPLE'; apply_mods(ob)
random.seed(5131)
# a few soft creases (folds) radiating from the button and along the walls: each a line with a falloff
creases = [(random.uniform(0, 2 * math.pi), random.uniform(0.08, 0.2), random.uniform(0.002, 0.004)) for _ in range(9)]
def noise2(x, y):
    return (math.sin(x * 41.3 + 1.7) * math.sin(y * 37.1 + 0.4) + 0.5 * math.sin(x * 83.0 + y * 61.0)) / 1.5
for v in ob.data.vertices:
    x, y, z = v.co
    u, w = x / (S / 2), y / (S / 2)                          # -1..1 over the top
    inside = max(0.0, 1 - max(abs(u), abs(w)) ** 6)          # 0 at the walls, 1 well inside
    r = math.hypot(x, y)
    if z > H * 0.5:                                          # the top: puffed, pulled to the button
        k = (z - H * 0.5) / (H * 0.5)
        dz = 0.0155 * inside * (1 - (u * u + w * w) * 0.35) - 0.024 * math.exp(-(r / 0.045) ** 2) * inside
        for ang, ln, dp in creases:
            px, py = math.cos(ang), math.sin(ang); along = x * px + y * py; across = -x * py + y * px
            if 0.02 < along < ln + 0.06: dz -= dp * math.exp(-(across / 0.006) ** 2) * inside * (1 - along / (ln + 0.06))
        v.co.z = z + dz * k
    elif z < H * 0.5:                                        # the underside: a little flattened by the floor, no puff
        pass
    # the walls belly outward, most at mid-height
    t = 1 - abs((z - H / 2) / (H / 2))
    bel = 0.008 * t * t
    edge = max(abs(u), abs(w))
    if edge > 0.85:
        s = 1 + bel / (S / 2) * ((edge - 0.85) / 0.15)
        v.co.x *= s; v.co.y *= s
    v.co.z += 0.0012 * noise2(x, y) * (1 if z > 0.01 else 0)
ob.data.materials.append(body); smooth(ob, 180)
parts = [ob]
# the piping round the top seam and the bottom seam: a rounded square loop of cord
def loop(z, inset, rad=0.004):
    pts = []; a = S / 2 + 0.0035 - inset; rc = 0.02
    for qx, qy, a0 in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        cx, cy = qx * (a - rc), qy * (a - rc)
        for i in range(7):
            ang = math.radians(a0 + 15 * i)
            pts.append((cx + rc * math.cos(ang), cy + rc * math.sin(ang), z))
    return tube_path('pipe', pts, rad, n=12, mat=pipe, closed=True)
# where the bevelled box's walls meet the top/bottom (the bevel's mid-height)
parts.append(loop(H - 0.0105 + 0.0025, 0.003))
parts.append(loop(0.0105, 0.003))
# the covered button, pulled into the dimple
top_at_c = H + 0.0155 - 0.024
b = lathe('button', [(0.0, 0.0), (0.009, 0.0), (0.0105, 0.0025), (0.0095, 0.0045), (0.006, 0.0058), (0.0, 0.006)], n=32, mat=btn)
b.location = (0, 0, top_at_c - 0.0025); parts.append(b)

ob = join(parts, 'cushion')
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='cushion')
export([ob], OUT)
