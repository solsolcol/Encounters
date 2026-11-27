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
    a = m.wave(m.mapping(co, scale=(1, 1, 1)), 125, dist=0.0, detail=0, kind='BANDS', axis='X')
    b = m.wave(m.mapping(co, scale=(1, 1, 1)), 125, dist=0.0, detail=0, kind='BANDS', axis='Y')
    c = m.wave(m.mapping(co, scale=(1, 1, 1)), 125, dist=0.0, detail=0, kind='BANDS', axis='Z')
    weave = m.math('MULTIPLY', m.math('ADD', m.math('ADD', a, b), c), 0.3333)
    slub = m.noise(m.mapping(co, scale=(3, 3, 3)), 40, detail=6, rough=0.7)
    fade = m.noise(co, 4.5, detail=3)
    base_c = m.mix(m.math('MULTIPLY', fade, 0.4), base, '#b08a52')
    m.col = m.mix(m.math('MULTIPLY', weave, 0.12), base_c, dark, 'MULTIPLY')
    m.col = m.mix(m.math('MULTIPLY', slub, 0.12), m.col, '#c29a5e')
    m.rough = m.math('ADD', 0.82, m.math('MULTIPLY', weave, 0.1))
    m.height = m.math('ADD', m.math('MULTIPLY', weave, 0.7), m.math('MULTIPLY', slub, 0.3)); m.bump_strength = 0.35; m.bump_dist = 0.0008
    return proc(m)
body = cloth('ochre', '#9a6a30', '#6b4521')
pipe = cloth('ochrepipe', '#a57d43', '#7a5530')
btn = cloth('ochrebtn', '#7d5527', '#5a3a1b')

# the body: a box of cloth INFLATED by Blender's cloth simulation (pressure), its middle stitched down through to the
# underside (the button's tuft, pinned), so its puff, its sagging corners and its creases are the cloth's own
sc = bpy.context.scene
sc.gravity = (0, 0, 0)
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.scale(bm, vec=(S, S, 0.075), verts=bm.verts)
bmesh.ops.translate(bm, vec=(0, 0, 0.0375), verts=bm.verts)
ob = mesh_from_bm('cushion', bm)
bevel(ob, 0.006, segs=2); apply_mods(ob)
sub = ob.modifiers.new('sub', 'SUBSURF'); sub.levels = 4; sub.subdivision_type = 'SIMPLE'; apply_mods(ob)
# the tuft: the points at the middle of the top and the bottom are held (pinned) where the stitch pulls them
vg = ob.vertex_groups.new(name='pin')
for v in ob.data.vertices:
    if math.hypot(v.co.x, v.co.y) < 0.012:
        vg.add([v.index], 1.0, 'REPLACE')
        if v.co.z > 0.03: v.co.z = 0.105
        else: v.co.z = 0.0
cl = ob.modifiers.new('cloth', 'CLOTH'); st = cl.settings
st.quality = 8; st.mass = 0.3; st.air_damping = 3
st.tension_stiffness = 25; st.compression_stiffness = 25; st.shear_stiffness = 10; st.bending_stiffness = 0.3
st.use_pressure = True; st.uniform_pressure_force = 3.0; st.pressure_factor = 1.0
st.vertex_group_mass = 'pin'
cl.collision_settings.use_self_collision = False
cl.point_cache.frame_start = 1; cl.point_cache.frame_end = 40
sc.frame_start, sc.frame_end = 1, 40
for f in range(1, 41): sc.frame_set(f)
bpy.context.view_layer.objects.active = ob
for o in bpy.context.selected_objects: o.select_set(False)
ob.select_set(True); bpy.ops.object.modifier_apply(modifier='cloth')
# a little use: the top pressed down a touch and fine creases (a low noise), the base flat on the floor
random.seed(5131)
zs = [v.co.z for v in ob.data.vertices]; z0 = min(zs)
for v in ob.data.vertices:
    v.co.z -= z0
    x, y = v.co.x, v.co.y
    w = 0.0009 * (math.sin(x * 61 + y * 23) * math.sin(y * 47 - x * 11) + 0.5 * math.sin(x * 140 + 1.3) * math.sin(y * 133 + 0.4))
    if v.co.z > 0.02: v.co.z += w
    if v.co.z < 0.006: v.co.z *= 0.4
Hs = max(v.co.z for v in ob.data.vertices); kz = 0.1215 / Hs       # pressed to its height (0.125 once sized to 0.50 wide)
for v in ob.data.vertices: v.co.z *= kz
ob.data.update()
ob.data.materials.append(body); smooth(ob, 180)
parts = [ob]
H = max(v.co.z for v in ob.data.vertices)
top_at_c = min(v.co.z for v in ob.data.vertices if math.hypot(v.co.x, v.co.y) < 0.01 and v.co.z > 0.03)
b = lathe('button', [(0.0, 0.0), (0.009, 0.0), (0.0105, 0.0025), (0.0095, 0.0045), (0.006, 0.0058), (0.0, 0.006)], n=32, mat=btn)
b.location = (0, 0, top_at_c - 0.0028); parts.append(b)
print('PUFF', round(H, 4), 'tuft', round(top_at_c, 4))
ob = join(parts, 'cushion')
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='cushion')
export([ob], OUT)
