# v26.18 · where Grandmaster Pho's robe below the waist JOINS the rest of him, in one held moment of one take: the ring of
# robe points (carried by his Skirt and Cloth bones) that share a triangle with a point carried by anything else. The lap
# cloth made for his cross-legged sit (lapcloth.py) is pinned under that ring.
#   <blender python> masters/v26.18/pho/waist_read.py <pho-plain.glb> <take> <seconds> <out.json>
import bpy, sys, json, math
glb, take, secs, out = sys.argv[-4], sys.argv[-3], float(sys.argv[-2]), sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
act = next(a for a in bpy.data.actions if a.name == take or a.name.startswith(take))
arm.animation_data_create(); arm.animation_data.action = act
sc = bpy.context.scene; fps = sc.render.fps / sc.render.fps_base
sc.frame_set(int(round(secs * fps))); bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()
J = {b.name: arm.matrix_world @ b.head for b in arm.pose.bones}
jn = lambda n: next(J[k] for k in J if k.endswith(n) and 'Graft' not in k)
hips = jn('Hips')
LOW = ('Skirt', 'Cloth'); LEG = ('LegGraft', 'UpLeg', 'Leg', 'Foot', 'Toe'); TORSO = ('Hips', 'Spine')
res = {'hips': list(hips), 'meshes': []}
ring = []
for o in meshes:
    ev = o.evaluated_get(dg); me = ev.to_mesh(); mw = ev.matrix_world; groups = [g.name for g in o.vertex_groups]
    kind = []; top = []
    for v in me.vertices:
        w = {'robe': 0.0, 'legs': 0.0, 'torso': 0.0, 'other': 0.0}; best = (0, '')
        for g in v.groups:
            n = groups[g.group]
            k = 'robe' if any(s in n for s in LOW) else ('legs' if any(s in n for s in LEG) else ('torso' if any(n.endswith(s) or (s in n and 'Spine' in s) for s in TORSO) else 'other'))
            w[k] += g.weight
            if g.weight > best[0]: best = (g.weight, n)
        kind.append(max(w, key=w.get)); top.append(best[1])
    P = [mw @ v.co for v in me.vertices]
    me.calc_loop_triangles()
    cnt = {}; tri = {}
    for t in me.loop_triangles:
        ks = sorted(set(kind[i] for i in t.vertices)); key = '+'.join(ks); tri[key] = tri.get(key, 0) + 1
        if 'robe' in ks and len(ks) > 1:
            for i in t.vertices:
                if kind[i] == 'robe': ring.append((P[i].x - hips.x, P[i].y - hips.y, P[i].z, top[i], [k for k in ks if k != 'robe'][0]))
    for k in kind: cnt[k] = cnt.get(k, 0) + 1
    res['meshes'].append({'name': o.name, 'verts': cnt, 'tris': tri, 'mats': [m.name for m in o.data.materials]})
    ev.to_mesh_clear()
# the ring by angle round his hips (0 = his left, +x; 90 = his back, +y; 270 = his front)
B = 24; bins = [[] for _ in range(B)]
for x, y, z, n, k in ring:
    a = math.degrees(math.atan2(y, x)) % 360; bins[int(a / 360 * B) % B].append((math.hypot(x, y), z, n, k))
rows = []
for i, b in enumerate(bins):
    if not b: rows.append({'deg': i * 360 // B, 'n': 0}); continue
    rs = sorted(r for r, z, n, k in b); zs = sorted(z for r, z, n, k in b)
    names = {}
    for r, z, n, k in b: names[n] = names.get(n, 0) + 1
    oth = {}
    for r, z, n, k in b: oth[k] = oth.get(k, 0) + 1
    rows.append({'deg': i * 360 // B, 'n': len(b), 'r': [round(rs[0], 3), round(rs[len(rs) // 2], 3), round(rs[-1], 3)], 'z': [round(zs[0], 3), round(zs[len(zs) // 2], 3), round(zs[-1], 3)],
                 'bones': sorted(names.items(), key=lambda q: -q[1])[:3], 'with': oth})
res['ring'] = rows; res['ringN'] = len(ring)
json.dump(res, open(out, 'w'), indent=0)
for m in res['meshes']: print(m)
for r in rows: print(r)
