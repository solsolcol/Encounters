"""v29.0 (E5C1 THINGS-3, coordinator's ask) · w51paperbag: the brown paper bag of breakfast his teacher carries at the door
at dawn (the plan's 9.9, 6-14 s: "a paper bag in his hand: two kopi, kaya toast"), made in code. A plain kraft paper bag,
no print (v9.3), 0.16 wide, 0.10 deep, 0.25 tall with its top folded down twice into a flat roll that is held: the
GRIP is the middle of that roll (x 0, z 0, y 0.235 to 0.25 in the game's metres, the roll along x). Its body creased
down the gussets of its narrow sides, crumpled a little, bulging where the two cups sit, a darker grease bloom low on
one face. Front (a wide face) toward Blender -Y.     $BPY masters/v29.0/props/code/paperbag.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(520)
k = M('kraft'); co = k.coord('Object')
fib = k.noise(k.mapping(co, scale=(1, 1, 3)), 220, detail=8, rough=0.7)
blot = k.noise(co, 9, detail=3)
sepz = k.n.new('ShaderNodeSeparateXYZ'); k.l.new(co, sepz.inputs[0])
low = k.math('LESS_THAN', sepz.outputs['Z'], 0.10)
gmask = k.math('MULTIPLY', k.math('MULTIPLY', k.math('SUBTRACT', k.noise(k.mapping(co, loc=(0.3, 0, 0)), 11, detail=4), 0.58), 6.0), low)
base = k.mix(k.math('MULTIPLY', blot, 0.5), '#a9824f', '#8d6a3c')
base = k.mix(k.math('MULTIPLY', fib, 0.35), base, '#6f522d')
gm = k.math('MINIMUM', k.math('MAXIMUM', gmask, 0.0), 1.0)
k.col = k.mix(k.math('MULTIPLY', gm, 0.3), base, '#5e4222')
k.rough = k.math('SUBTRACT', 0.9, k.math('MULTIPLY', gm, 0.3))
k.height = fib; k.bump_strength = 0.25; k.bump_dist = 0.0005
kraft = proc(k)

W, D, H = 0.16, 0.10, 0.215          # the body below the roll
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.scale(bm, vec=(W, D, H), verts=bm.verts); bmesh.ops.translate(bm, vec=(0, 0, H / 2), verts=bm.verts)
ob = mesh_from_bm('bag', bm)
bevel(ob, 0.004, segs=2); apply_mods(ob)
sub = ob.modifiers.new('sub', 'SUBSURF'); sub.levels = 3; sub.subdivision_type = 'SIMPLE'; apply_mods(ob)
random.seed(520)
crumples = [(random.uniform(-W / 2, W / 2), random.uniform(0.02, H), random.uniform(0.006, 0.018), random.uniform(-1, 1) * 0.0045) for _ in range(70)]
for v in ob.data.vertices:
    x, y, z = v.co
    t = z / H                                   # 0 at the floor, 1 at the top of the body
    # the narrow sides pleated inward (the gusset's crease) from the top down, fading by the bottom
    if abs(x) > W / 2 - 0.003:
        v.co.x -= math.copysign(1, x) * 0.012 * (1 - abs(y) / (D / 2)) * min(1.0, t * 1.6) ** 1.2
    # the top of the body gathered in toward the roll (the bag's mouth pinched shut)
    v.co.y *= 1 - 0.55 * max(0.0, (t - 0.72) / 0.28) ** 1.4
    # the two cups inside pushing the lower half out a little
    if abs(y) > D / 2 - 0.004 and t < 0.6:
        v.co.y += math.copysign(1, y) * 0.006 * math.sin(math.pi * t / 0.6) * (1 - (x / (W / 2)) ** 2)
    # crumples: soft dents and ridges
    for (cx, cz, r, a) in crumples:
        dd = ((x - cx) ** 2 + (z - cz) ** 2) / (r * r)
        if dd < 4 and abs(y) > D / 2 - 0.01: v.co.y += math.copysign(1, y) * a * math.exp(-dd)
    # the narrow sides wrinkle too, and every face carries a fine crinkle of handled paper
    if abs(x) > W / 2 - 0.01: v.co.x += math.copysign(1, x) * 0.0018 * math.sin(z * 210 + y * 95) * math.sin(y * 160 - z * 40)
    v.co.y += math.copysign(1, y) * 0.0009 * math.sin(x * 330 + z * 170) * math.sin(z * 260 - x * 90) * (1 if abs(y) > D / 2 - 0.01 else 0)
ob.data.materials.append(kraft); smooth(ob, 180)
parts = [ob]
# the folded top: the pinched mouth carried up and folded down twice into a flat crinkled roll (the grip)
roll = box('roll', W - 0.004, 0.016, 0.03, at=(0, -0.002, H + 0.011), bev=0.006, segs=4, mat=kraft)
sub = roll.modifiers.new('sub', 'SUBSURF'); sub.levels = 2; sub.subdivision_type = 'SIMPLE'; apply_mods(roll)
for v in roll.data.vertices:
    v.co.y *= 1 - 0.3 * (abs(v.co.x) / (W / 2)) ** 2
    v.co.y += 0.0012 * math.sin(v.co.x * 140 + v.co.z * 300) + 0.0008 * math.sin(v.co.x * 410)
    v.co.z += 0.0014 * math.sin(v.co.x * 75 + 0.5) + 0.0006 * math.sin(v.co.x * 260)
roll.data.update(); smooth(roll, 180)
parts.append(roll)
bag = join(parts, 'paperbag')
stats(bag)
uv_all(bag, margin=0.004)
bake(bag, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='paperbag')
export([bag], OUT)
