"""v29.0 (E5C1 THINGS-3, R13) · w51frame: the standing frame for his teacher's photograph on his altar, made in code (in
place of w4framesmall, episode 4 chapter 4's thin silver landscape frame). A portrait frame, as a teacher's photograph
is: 0.18 wide, 0.23 tall, a moulded frame of warm teak with a narrow brass slip round the picture, a hinged easel strut
behind (0.1 m deep with it). The picture is a material of its OWN, named `picture` (a plain warm white, its UV the
picture's 0..1 rectangle, u to the right, v up), so the chapter lays the photograph on it by setting that material's map.
Front toward Blender -Y (the game's +z).     $BPY masters/v29.0/props/code/frame.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(514)
FW, FH, MW, MD = 0.18, 0.23, 0.022, 0.016       # outer width, height, moulding width, its depth
TILT = math.radians(12)                          # the frame leans back on its strut
tk = wood('teak', dark='#3e2715', mid='#5a3b22', light='#74512f', grain=34, axis='X', gloss=0.3)
tkv = wood('teakv', dark='#3e2715', mid='#5a3b22', light='#74512f', grain=34, axis='Z', gloss=0.3)
br = brass('slip', tone='#b9934f', worn=0.3)
back = M('backboard'); co = back.coord('Object'); nb = back.noise(co, 260, detail=5)
back.col = back.mix(back.math('MULTIPLY', nb, 0.6), '#4a3a2a', '#2e241a'); back.rough = back.val(0.85); back.height = nb; back.bump_strength = 0.15
back = proc(back)

parts = []
# the moulding: four mitred bars, each a profiled section (a rounded outer edge, a step down to the slip) swept along
def bar(length, mat):
    prof = [(0.0, 0.0), (0.0, MD * 0.55), (0.003, MD * 0.85), (0.008, MD), (0.015, MD * 0.95), (0.019, MD * 0.75),
            (MW - 0.002, MD * 0.62), (MW, MD * 0.5), (MW, 0.0)]
    bm = bmesh.new()
    # build the section as a closed polygon in (x across the bar, z depth), extrude along y
    vs0 = [bm.verts.new((p[0], -length / 2, p[1])) for p in prof]
    vs1 = [bm.verts.new((p[0], length / 2, p[1])) for p in prof]
    for i in range(len(prof)):
        j = (i + 1) % len(prof)
        bm.faces.new((vs0[i], vs0[j], vs1[j], vs1[i]))
    bm.faces.new(list(reversed(vs0))); bm.faces.new(vs1)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_from_bm('bar', bm); ob.data.materials.append(mat)
    return smooth(ob, 30)
# mitre each bar by cutting it with the two 45-degree planes at its ends (bisect)
def mitred(length, mat):
    ob = bar(length, mat)
    bm = bmesh.new(); bm.from_mesh(ob.data)
    for sgn in (-1, 1):
        co = Vector((0, sgn * length / 2, 0)); no = Vector((1, sgn, 0)).normalized()
        res = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=co, plane_no=no, clear_outer=True)
        bmesh.ops.contextual_create(bm, geom=[e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)])
    bm.to_mesh(ob.data); bm.free()
    return ob
# a bar's x = 0 is its OUTER edge, MW its inner edge: lay the four round the rectangle, the outer edge outward
for (L, rotz, at, mat) in ((FH, 0, (-FW / 2, 0, FH / 2), tkv), (FH, math.pi, (FW / 2, 0, FH / 2), tkv),
                           (FW, -math.pi / 2, (0, 0, FH), tk), (FW, math.pi / 2, (0, 0, 0), tk)):
    b = mitred(L, mat)
    b.rotation_euler = (0, 0, rotz)
    # the bar's section lies in x (across) and z (depth): turn it so depth runs toward -Y (the front) and length along z
    bpy.context.view_layer.objects.active = b
    b.location = (0, 0, 0)
    me = b.data
    for v in me.vertices:
        x, y, z = v.co                                  # x across (0 outer .. MW inner), y along, z depth (0 back .. MD front)
        v.co = Vector((x, z, y))                        # now: x across, y depth, z along
    for v in me.vertices:
        v.co.y = -v.co.y                                 # the front toward -Y
    # place: rotate the across axis to point inward from the side it sits on
    ax, az = at[0], at[2]
    for v in me.vertices:
        x, y, z = v.co
        if rotz == 0:            # the left bar: outer edge at x = -FW/2, inward +x
            v.co = Vector((-FW / 2 + x, y, FH / 2 + z))
        elif rotz == math.pi:    # the right bar
            v.co = Vector((FW / 2 - x, y, FH / 2 - z))
        elif rotz < 0:           # the top bar: outer edge at z = FH, inward -z
            v.co = Vector((z, y, FH - x))
        else:                    # the bottom bar
            v.co = Vector((-z, y, x))
    b.rotation_euler = (0, 0, 0)
    me.update(); parts.append(b)
# the brass slip inside the moulding, and the backboard behind it all
iw, ih = FW - 2 * MW, FH - 2 * MW
for (sx, sz, lx, lz) in ((0.004, ih, -iw / 2 + 0.002, FH / 2), (0.004, ih, iw / 2 - 0.002, FH / 2),
                         (iw, 0.004, 0, MW + 0.002), (iw, 0.004, 0, FH - MW - 0.002)):
    parts.append(box('slip', sx, 0.004, sz, at=(lx, -MD * 0.5, lz), bev=0.0008, segs=2, mat=br))
parts.append(box('backboard', FW - 0.004, 0.004, FH - 0.004, at=(0, 0.002, FH / 2), bev=0.0006, segs=1, mat=back))
fr = join(parts, 'frame')
# the frame leans back: turn it all about its bottom front edge
def tilt(v):
    y, z = v.co.y, v.co.z
    v.co.y = y * math.cos(TILT) + z * math.sin(TILT); v.co.z = -y * math.sin(TILT) + z * math.cos(TILT)
for v in fr.data.vertices: tilt(v)
# the easel strut: a tapered board from a hinge high on the back down to the table behind
hy, hz = 0.004, FH * 0.78
Hy, Hz = hy * math.cos(TILT) + hz * math.sin(TILT), -hy * math.sin(TILT) + hz * math.cos(TILT)
Gy, Gz = 0.095, 0.0
L = math.hypot(Gy - Hy, Hz - Gz); phi = math.atan2(Gy - Hy, Hz - Gz)
# the strut built point by point between its hinge H (on the back) and its foot G (on the table), so it meets both
d = Vector((0, Gy - Hy, Gz - Hz)).normalized(); nrm = Vector((0, -d.z, d.y))      # the strut's own thickness direction
if nrm.y < 0: nrm = -nrm
bm = bmesh.new(); vs = []
for (P, hw) in ((Vector((0, Hy, Hz)), 0.012), (Vector((0, Gy, Gz)), 0.0175)):
    for t in (0.0, 0.004):
        for sx in (-1, 1):
            vs.append(bm.verts.new(P + nrm * t + Vector((sx * hw, 0, 0))))
# vs: top(front-left, front-right, back-left, back-right), bottom(...)
quads = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
for q in quads: bm.faces.new([vs[i] for i in q])
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
st = mesh_from_bm('strut', bm); st.data.materials.append(back)
bevel(st, 0.0008, segs=1); apply_mods(st)
fr = join([fr, st], 'frame')
zmin = min(v.co.z for v in fr.data.vertices)
for v in fr.data.vertices: v.co.z -= zmin
fr.data.update()
stats(fr)
uv_all(fr, margin=0.004)
bake(fr, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='frame')
# the picture: its own quad and material, laid just in front of the backboard inside the slip, its UV the whole 0..1
pic = bpy.data.materials.new('picture'); pic.use_nodes = True
pb = pic.node_tree.nodes['Principled BSDF']; pb.inputs['Base Color'].default_value = (*srgb('#ece6da'), 1); pb.inputs['Roughness'].default_value = 0.55
pw, ph = iw - 0.006, ih - 0.006
bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap')
vs = [bm.verts.new(p) for p in ((-pw / 2, -0.0005, FH / 2 - ph / 2), (pw / 2, -0.0005, FH / 2 - ph / 2), (pw / 2, -0.0005, FH / 2 + ph / 2), (-pw / 2, -0.0005, FH / 2 + ph / 2))]
f = bm.faces.new(vs)
for lp, uv in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uvl].uv = uv
q = mesh_from_bm('picture', bm); q.data.materials.append(pic)
for v in q.data.vertices:
    y, z = v.co.y, v.co.z
    v.co.y = y * math.cos(TILT) + z * math.sin(TILT); v.co.z = -y * math.sin(TILT) + z * math.cos(TILT) - zmin
q.data.update()
# the picture's normal must face the front (-Y): flip if it does not
q.data.polygons[0].normal
if q.data.polygons[0].normal.y > 0: q.data.flip_normals()
export([fr, q], OUT)
