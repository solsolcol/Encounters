# v26.18 · Grandmaster Pho's floor sit read in Blender: his posed points by what carries them, his joints, his floor.
#   <blender python> masters/v26.18/pho/pose_read.py <pho-plain.glb> <take> <seconds> <out.json>
import bpy, sys, json, math
from mathutils import Vector
glb, take, secs, out = sys.argv[-4], sys.argv[-3], float(sys.argv[-2]), sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
acts = {a.name: a for a in bpy.data.actions}
name = next((n for n in acts if n == take or n.startswith(take)), None)
print('actions', sorted(acts)[:30], '->', name)
arm.animation_data_create(); arm.animation_data.action = acts[name]
for tr in list(arm.animation_data.nla_tracks): tr.mute = True
sc = bpy.context.scene; fps = sc.render.fps / sc.render.fps_base
sc.frame_set(int(round(secs * fps))); bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()
J = {}
for b in arm.pose.bones:
    J[b.name] = [round(v, 4) for v in (arm.matrix_world @ b.head)] + [round(v, 4) for v in (arm.matrix_world @ b.tail)]
LOW = ('Skirt', 'Cloth'); LEG = ('LegGraft', 'UpLeg', 'Leg', 'Foot', 'Toe')
stats = {'upper': 0, 'robe': 0, 'legs': 0}; ys = []; legpts = []; robepts = []; upperlow = []
for o in meshes:
    ev = o.evaluated_get(dg); me = ev.to_mesh(); mw = ev.matrix_world; groups = [g.name for g in o.vertex_groups]
    for v in me.vertices:
        w = {'robe': 0.0, 'legs': 0.0, 'upper': 0.0}
        for g in v.groups:
            n = groups[g.group]
            k = 'robe' if any(s in n for s in LOW) else ('legs' if any(s in n for s in LEG) else 'upper')
            w[k] += g.weight
        k = max(w, key=w.get); stats[k] += 1
        p = mw @ v.co; ys.append(p.z)
        if k == 'legs': legpts.append((p.x, p.y, p.z))
        elif k == 'robe': robepts.append((p.x, p.y, p.z))
        elif p.z < J.get('mixamorig:Spine', J.get('mixamorigSpine', [0, 0, 9]))[2] + 0.05: upperlow.append((p.x, p.y, p.z))
    ev.to_mesh_clear()
ys.sort()
def box(pts):
    if not pts: return None
    return [[round(min(p[i] for p in pts), 3) for i in range(3)], [round(max(p[i] for p in pts), 3) for i in range(3)]]
res = {'take': name, 'secs': secs, 'fps': fps, 'counts': stats, 'floor2pct': round(ys[int(len(ys) * 0.02)], 4), 'lowest': round(ys[0], 4),
       'legsBox': box(legpts), 'robeBox': box(robepts), 'upperLowBox': box(upperlow),
       'joints': {k: J[k] for k in J if any(s in k for s in ('Hips', 'Spine', 'UpLeg', 'Leg', 'Foot', 'Toe', 'Hand', 'ForeArm', 'Arm', 'Head', 'Neck', 'Shoulder')) and 'Cloth' not in k and 'Skirt' not in k}}
json.dump(res, open(out, 'w'), indent=1)
print(json.dumps({k: res[k] for k in ('take', 'counts', 'floor2pct', 'lowest', 'legsBox', 'robeBox', 'upperLowBox')}))
