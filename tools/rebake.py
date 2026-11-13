# v24.55 · Grandmaster Pho's face and hands at his scan's full detail: a sheet of their own, baked in Blender
# (masters/v24.55/PLAN.md).
#
# Chad, 8 Nov 2026: "I think you can still improve the pho model much more given now that you have blender, you are not
# using it to its fullest potential and capacity".
#
# WHAT IT MENDS. His colour sheet is 8192 pixels square and gives every part of him the same share of it, about 23 texels a
# centimetre: his face and hands as much as the plain white robe. A phone cannot hold a sheet that size (256 MB), so it
# ships at 4096 and his face lost half its detail with the robe (the eyes, the brows, the mouth, the hair's strands).
# Laid out again in one sheet, the room his face needs costs the robe a seventh of its own (Blender packs his 3,900 charts
# into half the square at best), so his face and hands get a SECOND sheet instead, and his body sheet is not touched.
#
# WHAT IT DOES (between tools/prepmonk.mjs BAKE=dump:<dir> and BAKE=apply:<dir>; run on Blender's own Python, bpy):
#   1. the finished mesh is built in Blender point for point (no point merged), with its sheet coordinates;
#   2. the charts that show his head or hands (by the bone their points ride), or the gold of his necklace and pendant
#      (DETGOLD=1), at least 30% of their surface, are packed by Blender into a square of their own (rotation allowed, a
#      gutter round each) at the largest size that fits;
#   3. the colour is baked into it from his 8192 sheet through each triangle's own coordinates in his body sheet, so every
#      triangle shows exactly what it showed (no texel of his paint is retouched): only now with every texel he has; the
#      gutters are filled outward from each chart's edge (the empty fill, padded);
#   4. a point where two packed pieces touch only at a corner is copied (one copy a piece);
#   5. written: det_uv.f32 (each point's coordinate in the new sheet), det_tri.u8 (which triangles draw from it),
#      copy_src.u32 and idx_new.u32 (the copies), detail.png and baked.json. Everything else about him (his body sheet, his
#      normal map, his points, his weights) is as it was.
#     $BPY tools/rebake.py <dir>      (env: DETPX, MARGIN, SAMPLES, DETGOLD)
import bpy, sys, os, json, time, math
import numpy as np

T0 = time.time()
def log(*a): print(f'[{time.time() - T0:6.1f}s]', *a, flush=True)
D = os.path.abspath(sys.argv[-1])
J = json.load(open(f'{D}/dump.json'))
DPX = int(os.environ.get('DETPX', 2048))              # the new sheet's size
MARGIN = float(os.environ.get('MARGIN', 4)) / DPX     # the gutter round each chart, in its pixels
SAMPLES = int(os.environ.get('SAMPLES', 16))          # Cycles samples a texel (the colour's filter over its footprint)
GOLD = bool(int(os.environ.get('DETGOLD', 1)))        # his necklace's and pendant's gold in the new sheet too
PACKONLY = bool(os.environ.get('PACKONLY'))
NPX = int(os.environ.get('DETNPX', 0))               # its normal map's size, if one is wanted (look D draws the part unlit whole: none)
CAGE = float(os.environ.get('CAGE', 0.004))           # the normal bake: rays start this far outside the kept surface
RAY = float(os.environ.get('RAY', 0.012))             # and look this far for the full one

def rd(name, dt, w):
    a = np.fromfile(f'{D}/{name}', dtype=dt)
    return a.reshape(-1, w) if w > 1 else a
lp, ln, luv, li, lreg = rd('low_pos.f32', np.float32, 3), rd('low_nor.f32', np.float32, 3), rd('low_uv.f32', np.float32, 2), rd('low_idx.u32', np.uint32, 3), rd('low_reg.u8', np.uint8, 1)
n, m = len(lp), len(li)
assert n == J['n'] and m == J['tris'], 'the dump is not whole'
log(f'mesh {n} points {m} triangles')

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
me = bpy.data.meshes.new('pho')
me.vertices.add(n); me.vertices.foreach_set('co', lp.ravel())
me.loops.add(li.size); me.loops.foreach_set('vertex_index', li.ravel().astype(np.int32))
me.polygons.add(m); me.polygons.foreach_set('loop_start', (np.arange(m) * 3).astype(np.int32))
me.update(calc_edges=True)
for uname in ('old', 'det'):                            # glTF's v runs down the sheet, Blender's up
    lay = me.uv_layers.new(name=uname); per = luv[li.ravel()].astype(np.float64); per[:, 1] = 1.0 - per[:, 1]; lay.data.foreach_set('uv', per.ravel())
me.shade_smooth(); me.normals_split_custom_set_from_vertices(ln.astype(np.float64))
ob = bpy.data.objects.new('pho', me); scene.collection.objects.link(ob)
assert len(me.vertices) == n and len(me.polygons) == m, 'Blender changed the mesh'

# ---- charts: faces joined through a shared point (a point has one sheet coordinate, so a shared point is a shared one)
par = np.arange(n)
def find(a):
    r = a
    while par[r] != r: r = par[r]
    while par[a] != r: par[a], a = r, par[a]
    return r
for a, b, c in li:
    ra, rb = find(a), find(b)
    if rb != ra: par[rb] = ra
    rc = find(c)
    if rc != ra: par[rc] = ra
root = np.array([find(i) for i in range(n)])
charts, finv = np.unique(root[li[:, 0]], return_inverse=True); C = len(charts)
uvf = luv[li].astype(np.float64)
lo = np.full((C, 2), 9.0); hi = np.full((C, 2), -9.0); np.minimum.at(lo, finv, uvf.min(axis=1)); np.maximum.at(hi, finv, uvf.max(axis=1))
point = (hi - lo).max(axis=1) < 1e-7                   # a chart drawn from one texel stays where it is

# ---- what each chart shows, sampled from his own sheet at each triangle's middle
bimg = bpy.data.images.load(f'{D}/{J["base"]}'); bimg.colorspace_settings.name = 'sRGB'
BW, BH = bimg.size
src = np.empty(BW * BH * 4, dtype=np.float32); bimg.pixels.foreach_get(src); src = src.reshape(BH, BW, 4)
def lin2srgb(x): return np.where(x <= 0.0031308, 12.92 * x, 1.055 * np.power(np.clip(x, 0, None), 1 / 2.4) - 0.055)
cen = uvf.mean(axis=1)
col = np.round(lin2srgb(src[np.clip(((1.0 - cen[:, 1]) * BH).astype(int), 0, BH - 1), np.clip((cen[:, 0] * BW).astype(int), 0, BW - 1), :3]) * 255)
del src
mx, mn = col.max(axis=1), col.min(axis=1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
hue = np.degrees(np.arctan2(np.sqrt(3) * (col[:, 1] - col[:, 2]), 2 * col[:, 0] - col[:, 1] - col[:, 2])) % 360
e1 = lp[li[:, 1]] - lp[li[:, 0]]; e2 = lp[li[:, 2]] - lp[li[:, 0]]; area3 = 0.5 * np.linalg.norm(np.cross(e1, e2), axis=1)
A = np.bincount(finv, weights=area3, minlength=C)
def share(mask): return np.bincount(finv, weights=area3 * mask, minlength=C) / np.maximum(A, 1e-12)
cls = {'head': (lreg[li] == 1).sum(1) >= 2, 'hands': (lreg[li] == 2).sum(1) >= 2, 'gold': (sat > 0.35) & (mx > 120) & (hue > 30) & (hue < 65)}
# (v26.3, Ton's face: DETHANDS=0 takes his head alone, so the face has the new sheet's room to itself; unset, as before)
HANDS = bool(int(os.environ.get('DETHANDS', 1)))
det_chart = ~point & ((share(cls['head'] | (cls['hands'] if HANDS else False)) >= 0.3) | ((share(cls['gold']) >= 0.3) if GOLD else False))
det = det_chart[finv]
def uvarea(u):
    return 0.5 * np.abs((u[:, 1, 0] - u[:, 0, 0]) * (u[:, 2, 1] - u[:, 0, 1]) - (u[:, 2, 0] - u[:, 0, 0]) * (u[:, 1, 1] - u[:, 0, 1]))
au_old = uvarea(uvf)
for k, msk in cls.items():
    log(f'{k}: {int(msk.sum())} triangles, {100 * au_old[msk].sum():.2f}% of his sheet, {100 * au_old[msk & det].sum() / max(au_old[msk].sum(), 1e-12):.0f}% of it in the charts taken')
need = au_old[det].sum() * (BW / DPX) ** 2
log(f'{int(det_chart.sum())} charts taken ({int(det.sum())} triangles): at his full 8192 detail they need {100 * need:.0f}% of a {DPX} square')

# ---- packed by Blender, alone
dl = me.uv_layers['det']; me.uv_layers.active = dl
bpy.context.view_layer.objects.active = ob; ob.select_set(True)
scene.tool_settings.use_uv_select_sync = True
me.polygons.foreach_set('select', det); me.polygons.foreach_set('hide', ~det)   # the rest hidden: not obstacles in the new square
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.pack_islands(udim_source='CLOSEST_UDIM', rotate=True, rotate_method=os.environ.get('ROT', 'ANY'), scale=True, merge_overlap=False,
                        margin_method='FRACTION', margin=MARGIN, pin=False, shape_method=os.environ.get('SHAPE', 'CONCAVE'))
bpy.ops.object.mode_set(mode='OBJECT')
me.polygons.foreach_set('hide', np.zeros(m, bool))
dl = me.uv_layers['det']                               # leaving edit mode rebuilt the layers: fetch again
per = np.empty(m * 6); dl.data.foreach_get('uv', per); per = per.reshape(m, 3, 2)
per[~det] = 0.0                                         # the rest draw from the body sheet: no room here
dl.data.foreach_set('uv', per.ravel())
cover = float(uvarea(per[det]).sum())
gain = math.sqrt(uvarea(per[det]).sum() * DPX * DPX / max(au_old[det].sum() * (BW / 2) ** 2, 1e-12))
log(f'packed: the new sheet {100 * cover:.1f}% covered; texels a centimetre against his body sheet at 4096: {gain:.2f}x (2.00x = his full sheet)')
if PACKONLY: sys.exit(0)

# ---- one coordinate a point: Blender packs as one piece only faces joined by an edge, so a point where two pieces touch at
#      a corner alone comes out with two coordinates; it is copied, one copy a piece (every attribute of the copy is its
#      point's: prepmonk BAKE=apply makes them), and the triangles of the second piece use the copy
flat_i, flat_uv = li.ravel(), per.reshape(-1, 2)
flat_det = np.repeat(det, 3)
key = np.round(flat_uv * 1e6).astype(np.int64)
order = np.lexsort((key[:, 1], key[:, 0], ~flat_det, flat_i))
newv = np.empty(len(flat_i), dtype=np.int64); srcl = []; nxt = n; last_v = -1; last_k = None; cur = -1
for c in order:                                        # a point's corners, those of the new sheet first, by coordinate
    v = int(flat_i[c]); kk = (int(key[c, 0]), int(key[c, 1])) if flat_det[c] else None
    if v != last_v: cur = v; last_v = v; last_k = kk
    elif kk is not None and kk != last_k: cur = nxt; nxt += 1; srcl.append(v); last_k = kk
    newv[c] = cur
copy_src = np.array(srcl, dtype=np.int64); nv = n + len(copy_src)
duv = np.zeros((nv, 2)); duv[newv[flat_det]] = flat_uv[flat_det]
assert float(np.abs(duv[newv[flat_det]] - flat_uv[flat_det]).max()) < 1e-5, 'a point still has two coordinates'
log(f'{len(copy_src)} points copied where two pieces touch at a corner')

# ---- the colour: his own sheet through the body sheet's coordinates, onto the new one
scene.render.engine = 'CYCLES'; scene.cycles.device = 'CPU'; scene.cycles.samples = SAMPLES; scene.cycles.filter_width = 1.0
scene.render.use_texture_cache = False   # Blender 5 reads a texture 'at appropriate resolution' by default: in a bake, a blurred copy of his sheet
mat = bpy.data.materials.new('pho'); mat.use_nodes = True; nt = mat.node_tree
for nd in list(nt.nodes): nt.nodes.remove(nd)
o = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); tx = nt.nodes.new('ShaderNodeTexImage'); uvn = nt.nodes.new('ShaderNodeUVMap')
uvn.uv_map = 'old'; tx.image = bimg; tx.interpolation = 'Closest'; tx.extension = 'EXTEND'
nt.links.new(uvn.outputs['UV'], tx.inputs['Vector']); nt.links.new(tx.outputs['Color'], em.inputs['Color']); nt.links.new(em.outputs['Emission'], o.inputs['Surface'])
tgt = nt.nodes.new('ShaderNodeTexImage'); img = bpy.data.images.new('detail', DPX, DPX, alpha=False, float_buffer=False); img.colorspace_settings.name = 'sRGB'; tgt.image = img
nt.nodes.active = tgt
me.materials.append(mat)
for lay in me.uv_layers: lay.active_render = (lay.name == 'det')
me.uv_layers.active = me.uv_layers['det']
bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); bpy.context.view_layer.objects.active = ob
bpy.ops.object.bake(type='EMIT', margin=16, margin_type='EXTEND', use_clear=True)
img.filepath_raw = f'{D}/detail.png'; img.file_format = 'PNG'; img.save()
log('colour baked and written')

# ---- the normal map: from the full mesh the run read, with his own normal map on it (his hair's slivers keep their real
#      shading: the chart fix had pinned each to one texel), in Blender's tangents for the new coordinates
nname = None
if NPX > 0:
    hp, hn, huv, hi = rd('high_pos.f32', np.float32, 3), rd('high_nor.f32', np.float32, 3), rd('high_uv.f32', np.float32, 2), rd('high_idx.u32', np.uint32, 3)
    hme = bpy.data.meshes.new('full')
    hme.vertices.add(len(hp)); hme.vertices.foreach_set('co', hp.ravel())
    hme.loops.add(hi.size); hme.loops.foreach_set('vertex_index', hi.ravel().astype(np.int32))
    hme.polygons.add(len(hi)); hme.polygons.foreach_set('loop_start', (np.arange(len(hi)) * 3).astype(np.int32))
    hme.update(calc_edges=True)
    hl = hme.uv_layers.new(name='UVMap'); hper = huv[hi.ravel()].astype(np.float64); hper[:, 1] = 1.0 - hper[:, 1]; hl.data.foreach_set('uv', hper.ravel())
    hme.shade_smooth(); hme.normals_split_custom_set_from_vertices(hn.astype(np.float64))
    high = bpy.data.objects.new('full', hme); scene.collection.objects.link(high)
    nimg = bpy.data.images.load(f'{D}/{J["normal"]}'); nimg.colorspace_settings.name = 'Non-Color'
    hm = bpy.data.materials.new('full'); hm.use_nodes = True; ht = hm.node_tree
    bsdf = ht.nodes.get('Principled BSDF'); htx = ht.nodes.new('ShaderNodeTexImage'); huvn = ht.nodes.new('ShaderNodeUVMap'); nmap = ht.nodes.new('ShaderNodeNormalMap')
    huvn.uv_map = 'UVMap'; htx.image = nimg; htx.interpolation = 'Linear'; nmap.space = 'TANGENT'; nmap.uv_map = 'UVMap'
    ht.links.new(huvn.outputs['UV'], htx.inputs['Vector']); ht.links.new(htx.outputs['Color'], nmap.inputs['Color']); ht.links.new(nmap.outputs['Normal'], bsdf.inputs['Normal'])
    hme.materials.append(hm)
    ntgt = nt.nodes.new('ShaderNodeTexImage'); nimg2 = bpy.data.images.new('detail normal', NPX, NPX, alpha=False, float_buffer=False); nimg2.colorspace_settings.name = 'Non-Color'; ntgt.image = nimg2
    nt.nodes.active = ntgt
    scene.cycles.samples = max(4, SAMPLES // 4)
    bpy.ops.object.select_all(action='DESELECT'); high.select_set(True); ob.select_set(True); bpy.context.view_layer.objects.active = ob
    bpy.ops.object.bake(type='NORMAL', normal_space='TANGENT', use_selected_to_active=True, cage_extrusion=CAGE, max_ray_distance=RAY,
                        margin=8, margin_type='EXTEND', use_clear=True)
    nimg2.filepath_raw = f'{D}/detail_normal.png'; nimg2.file_format = 'PNG'; nimg2.save(); nname = 'detail_normal.png'
    log(f'normal map baked from the {len(hi)} triangles read and written')

# ---- Blender's tangents for the new coordinates, one a point (its corners averaged; three.js draws with them)
me.calc_tangents(uvmap='det')
lt = np.empty(m * 9); me.loops.foreach_get('tangent', lt); lt = lt.reshape(-1, 3)
ls = np.empty(m * 3); me.loops.foreach_get('bitangent_sign', ls)

fd = flat_det
vt = np.zeros((nv, 3)); np.add.at(vt, newv[fd], lt[fd])
vs = np.zeros(nv); np.add.at(vs, newv[fd], ls[fd])
srcall = np.concatenate([np.arange(n), copy_src]).astype(np.int64)
nn = ln[srcall].astype(np.float64); nn /= np.maximum(np.linalg.norm(nn, axis=1, keepdims=True), 1e-12)
vt -= nn * (vt * nn).sum(1, keepdims=True)
L = np.linalg.norm(vt, axis=1); bad = L < 1e-6
if bad.any():                                           # a point no new corner gives a direction to: any one across its normal
    ax = np.where(np.abs(nn[:, :1]) < 0.9, np.array([[1.0, 0, 0]]), np.array([[0, 1.0, 0]]))
    alt = np.cross(nn, ax); alt /= np.maximum(np.linalg.norm(alt, axis=1, keepdims=True), 1e-12)
    vt[bad] = alt[bad]; L[bad] = 1.0
vt /= L[:, None]
tan = np.concatenate([vt, np.where(vs < 0, -1.0, 1.0)[:, None]], axis=1).astype(np.float32)
tan.tofile(f'{D}/det_tan.f32')
out_uv = duv.copy(); out_uv[:, 1] = 1.0 - out_uv[:, 1]
used = np.zeros(nv, bool); used[newv[flat_det]] = True; out_uv[~used] = 0.0
out_uv.astype(np.float32).tofile(f'{D}/det_uv.f32'); det.astype(np.uint8).tofile(f'{D}/det_tri.u8')
copy_src.astype(np.uint32).tofile(f'{D}/copy_src.u32'); newv.astype(np.uint32).tofile(f'{D}/idx_new.u32')
summary = (f'{int(det_chart.sum())} charts of his head, hands{" and gold" if GOLD else ""} ({int(det.sum())} triangles) in a {DPX} sheet of their own, '
           f'{100 * cover:.0f}% covered, at {gain:.2f}x the texels of his body sheet (2x is his full 8192 sheet); {len(copy_src)} points copied where pieces '
           f'touch at a corner; ' + (f'its normal map ({NPX}) baked from the full mesh read; ' if nname else '') + 'his body sheet, normal map, points and weights as they were')
json.dump({'hash': J['hash'], 'points': int(nv), 'copies': int(len(copy_src)), 'detail': 'detail.png', 'normal': nname, 'npx': NPX, 'px': DPX, 'gain': round(gain, 3),
           'covered': round(cover, 4), 'summary': summary}, open(f'{D}/baked.json', 'w'))
log(summary)
