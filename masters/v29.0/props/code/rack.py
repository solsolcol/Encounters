"""v29.0 (E5C1 THINGS-3, R13) · w51rack: the clothes rack on his balcony, made in code (in place of w4clothesrack, a
neighbour's in episode 4 chapter 4's corridor, with its sarong). 1.35 x 0.75, about 1.0 tall as the old one. A folding
gull-wing drying rack of white powder-coated steel tube (a flat middle of rails, two wings dropping to each side, two
crossed pairs of legs, grey plastic hinges), and his washing on it DRAPED by Blender's cloth simulation, not modelled by
hand: a bath towel of sage-green terry over the middle, a white hand towel on one wing, a pale grey-blue pillowcase on
the other. No red (plan 4.5). Front toward Blender -Y.     $BPY masters/v29.0/props/code/rack.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
sc = reset(518)
steel = M('steel'); co = steel.coord('Object'); sp = steel.noise(co, 500, detail=3); rust = steel.noise(co, 30, detail=5)
steel.col = steel.mix(steel.math('MULTIPLY', rust, 0.25), '#e8e8e4', '#c9c8c0'); steel.rough = steel.math('ADD', 0.38, steel.math('MULTIPLY', sp, 0.12))
steel.height = sp; steel.bump_strength = 0.04; steel = proc(steel)
hinge = M('hinge'); hinge.col = hinge.rgb('#8e9092'); hinge.rough = hinge.val(0.55); hinge = proc(hinge)
def terry(name, base, dark, scale=420):
    m = M(name); co = m.coord('Object')
    loops = m.voronoi(co, scale, out='Distance'); fluff = m.noise(co, 60, detail=6, rough=0.7); fade = m.noise(co, 5, detail=2)
    c = m.mix(m.math('MULTIPLY', fade, 0.4), base, dark)
    m.col = m.mix(m.math('MULTIPLY', loops, 0.5), c, dark, 'MULTIPLY')
    m.rough = m.val(0.95); m.height = m.math('ADD', m.math('MULTIPLY', loops, 0.6), m.math('MULTIPLY', fluff, 0.4)); m.bump_strength = 0.5; m.bump_dist = 0.0012
    return proc(m)
sage = terry('sagetowel', '#a3b39a', '#7f8f77')
white = terry('whitetowel', '#efece4', '#d3cfc4')
case = M('pillowcase'); co = case.coord('Object')
wv = case.wave(co, 140, dist=0.4, detail=1, kind='BANDS', axis='X'); wv2 = case.wave(co, 140, dist=0.4, detail=1, kind='BANDS', axis='Y')
weave = case.math('MULTIPLY', case.math('ADD', wv, wv2), 0.5); fade = case.noise(co, 6, detail=2)
case.col = case.mix(case.math('MULTIPLY', weave, 0.15), case.mix(case.math('MULTIPLY', fade, 0.3), '#b9c6d2', '#9eadbb'), '#8796a4')
case.rough = case.val(0.85); case.height = weave; case.bump_strength = 0.2; case = proc(case)

R = 0.0075                                # the rails' tube
TOPZ, WINGZ = 0.95, 0.80
XM, XE = 0.35, 0.675                      # the middle's half length, the wings' ends
rails_y = [-0.245 + 0.07 * i for i in range(8)]
rack = []
for y in rails_y:
    rack.append(tube_path('rail', [(-XE, y, WINGZ), (-XM, y, TOPZ), (XM, y, TOPZ), (XE, y, WINGZ)], R, n=12, mat=steel))
# the frame's two long sides (thicker) and its cross bars at the hinges and the wings' ends
for y in (-0.285, 0.285):
    rack.append(tube_path('side', [(-XE, y, WINGZ), (-XM, y, TOPZ), (XM, y, TOPZ), (XE, y, WINGZ)], 0.0105, n=12, mat=steel))
for (x, z) in ((-XE, WINGZ), (-XM, TOPZ), (XM, TOPZ), (XE, WINGZ)):
    rack.append(tube_path('cross', [(x, -0.279, z), (x, 0.279, z)], 0.0095, n=12, mat=steel))   # (its caps inside the side tubes)
# the hinges: grey plastic sleeves where the wings meet the middle
for x in (-XM, XM):
    for y in (-0.285, 0.285):
        h = cyl('hinge', 0.016, 0.045, at=(x - 0.0225, y, TOPZ), n=24, mat=hinge, bev=0.002)
        h.rotation_euler = (0, math.radians(90), 0); rack.append(h)
# the legs: at each end of the middle, two tubes crossing, from the frame's sides to the floor at the other side
LX = 0.30
for x in (-LX, LX):
    rack.append(tube_path('leg', [(x, -0.285, TOPZ), (x, 0.36, 0.012)], 0.0105, n=12, mat=steel))
    rack.append(tube_path('leg', [(x + (0.022 if x > 0 else -0.022), 0.285, TOPZ), (x + (0.022 if x > 0 else -0.022), -0.36, 0.012)], 0.0105, n=12, mat=steel))
    # the pivot bolt where they cross, and a tie bar between the two legs' feet sides
    zc = TOPZ - (0.285 / 0.645) * (TOPZ - 0.012)          # where the two legs cross (y 0)
    b = cyl('bolt', 0.009, 0.04, at=(min(x, x + (0.022 if x > 0 else -0.022)) - 0.009, 0, zc), n=16, mat=hinge, bev=0.001)
    b.rotation_euler = (0, math.radians(90), 0); rack.append(b)
    dx = 0.022 if x > 0 else -0.022
    for (fx, fy) in ((x, 0.36), (x + dx, -0.36)):
        rack.append(cyl('foot', 0.014, 0.024, at=(fx, fy, 0.0), n=16, mat=hinge, bev=0.002))
frame = join(rack, 'rack')

# ---------------------------------------------------------------- the washing, dropped onto it by the cloth simulation
col = frame.modifiers.new('col', 'COLLISION')
frame.collision.thickness_outer = 0.012; frame.collision.cloth_friction = 80; frame.collision.damping = 0.8
def sheet(name, sx, sy, at, mat, rot=0.0, res=40):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=res, y_segments=int(res * sy / sx), size=0.5)
    bmesh.ops.scale(bm, vec=(sx, sy, 1), verts=bm.verts)
    ob = mesh_from_bm(name, bm); ob.location = at; ob.rotation_euler = (0, 0, rot)
    ob.data.materials.append(mat)
    cl = ob.modifiers.new('cloth', 'CLOTH'); s = cl.settings
    s.quality = 10; s.mass = 0.3; s.tension_stiffness = 12; s.compression_stiffness = 12; s.shear_stiffness = 8; s.bending_stiffness = 0.6
    s.air_damping = 2.0
    cl.collision_settings.collision_quality = 5; cl.collision_settings.distance_min = 0.007; cl.collision_settings.friction = 20
    cl.collision_settings.use_self_collision = False
    cl.point_cache.frame_start = 1; cl.point_cache.frame_end = 110
    return ob
towel = sheet('towel', 0.44, 1.12, (-0.12, 0.0, TOPZ + 0.022), sage)
pill = sheet('pillowcase', 0.24, 0.74, (0.235, 0.01, TOPZ + 0.022), case, res=24)
hand = sheet('handtowel', 0.30, 0.34, (0.60, -0.02, WINGZ + 0.05), white, res=30)    # over the right wing's end bar
hand.rotation_euler = (0, math.radians(24), 0)
sc.frame_start, sc.frame_end = 1, 110
for f in range(1, 111):
    sc.frame_set(f)
cloths = []
for ob in (towel, hand, pill):
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True)
    bpy.ops.object.modifier_apply(modifier='cloth')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    so = ob.modifiers.new('sol', 'SOLIDIFY'); so.thickness = 0.004 if ob is not pill else 0.002; so.offset = 0
    apply_mods(ob); smooth(ob, 180); cloths.append(ob)
frame.modifiers.remove(frame.modifiers['col'])
ob = join([frame] + cloths, 'rack')
zmin = min(v.co.z for v in ob.data.vertices)
for v in ob.data.vertices: v.co.z -= zmin
ob.data.update()
stats(ob)
uv_all(ob, margin=0.003)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='rack')
export([ob], OUT)
