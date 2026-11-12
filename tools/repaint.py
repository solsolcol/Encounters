# v26.1 · A BODY'S PAINT LAID OUT AGAIN, WITH ROOM BETWEEN ITS CHARTS (called by tools/prepmonk.mjs REPAINT=1, on Blender's
# own Python with xatlas beside it: BPY). Chad, 12 Nov 2026: the faces "absolutely butchered", "really bad" on a 720p phone,
# "absolutely horrendous" on his own; and, of xatlas: "Why was xatlas blocked? Do it again".
#
# WHAT IT MENDS. A generated body's sheet is thousands of small charts laid edge to edge, so it was drawn with no mipmaps
# (a shrunken copy averages one chart into the next, v5.11), and a face with more texels than the screen has pixels was
# sampled instead of averaged: it sparkles and crawls as anything moves, worse the fewer pixels a phone has.
#
# WHAT IT DOES:
#   1. points at one place are joined (the old sheet's seams had split them), so the surface is whole and can be cut anew;
#   2. xatlas cuts it into charts for the fewest seams and the least stretch (Blender's own cut of the brown hermit gave
#      5,484 charts that its packer could fill a quarter of the square with; xatlas, 2,755 and three quarters);
#   3. each chart is made larger by the part of the body it shows: the FACE (the head's front, by the head joint and the one
#      in front of it) FACE times, the rest of the head (and the hair it carries) HEADK, the hands HANDK; and xatlas packs
#      them again, from their coordinates alone, with a margin of PAD pixels at the sheet's own size round each;
#   4. Blender bakes the colour from the source's own sheet (the generator's, 8192 pixels) through each triangle's OLD
#      coordinates, each new texel the average of SAMPLES nearest-texel looks over its footprint: every triangle shows what
#      it showed, with all the detail the source has; the margins are filled outward from each chart's edge;
#   5. written: corner_uv.f32 (each triangle corner's new coordinate, glTF's way up), baked.png, baked.json.
#     <BPY> tools/repaint.py <dir>     (env: PX, PAD (pixels at PX; 4 at 2048 and over, 3 at 1024, 2 under), FACE 1.7,
#                                       HEADK 1.25, HANDK 1.2, SAMPLES)
import bpy, sys, os, json, time, math
import numpy as np
import xatlas

T0 = time.time()
def log(*a): print(f'[{time.time() - T0:6.1f}s]', *a, flush=True)
D = os.path.abspath(sys.argv[-1])
J = json.load(open(f'{D}/dump.json'))
PX = int(os.environ.get('PX', J.get('px', 2048)))
PAD = float(os.environ.get('PAD', 4 if PX >= 2048 else 3 if PX >= 1024 else 2))
FACE, HEADK, HANDK = (float(os.environ.get(k, d)) for k, d in (('FACE', 1.7), ('HEADK', 1.25), ('HANDK', 1.2)))
SRCPX = J['srcPx'][0]
SAMPLES = int(os.environ.get('SAMPLES', max(16, min(256, int(round((SRCPX / PX) ** 2))))))

def rd(name, dt, w):
    a = np.fromfile(f'{D}/{name}', dtype=dt)
    return a.reshape(-1, w) if w > 1 else a
P, U, I, R = rd('pos.f32', np.float32, 3), rd('uv.f32', np.float32, 2), rd('idx.u32', np.uint32, 3), rd('reg.u8', np.uint8, 1)
n, m = len(P), len(I)
assert n == J['n'] and m == J['tris'], 'the dump is not whole'

# ---- 1. one point a place
key = np.ascontiguousarray(P).view(np.dtype((np.void, 12))).ravel()
_, wid, winv = np.unique(key, return_index=True, return_inverse=True)
W = P[wid].astype(np.float32); LI = winv[I].astype(np.uint32)
log(f'{n} points joined into {len(W)} places; {m} triangles')

# ---- the part of the body each triangle shows
tr = R[I]
head = (tr == 1).sum(1) >= 2; hand = (tr == 2).sum(1) >= 2
e1 = P[I[:, 1]] - P[I[:, 0]]; e2 = P[I[:, 2]] - P[I[:, 0]]; cr = np.cross(e1, e2); A3 = 0.5 * np.linalg.norm(cr, axis=1)
fn = cr / np.maximum(np.linalg.norm(cr, axis=1, keepdims=True), 1e-12)
fwd = np.array(J.get('fwd') or [0, 0, 1], dtype=np.float64)
hc = np.array(J['head'], dtype=np.float64) if J.get('head') else (P[I[head]].reshape(-1, 3).mean(0) if head.any() else np.zeros(3))
face = head & (fn @ fwd > 0.25) & ((P[I].mean(1) - hc) @ fwd > -0.02)
kT = np.where(face, FACE, np.where(head, HEADK, np.where(hand, HANDK, 1.0)))
log(f'the face {int(face.sum())} triangles, the rest of the head {int((head & ~face).sum())}, the hands {int(hand.sum())}, the body {int((~head & ~hand).sum())} (looking {np.round(fwd, 2).tolist()})')

def same_tris(ix, vm, ref):
    """xatlas keeps the triangles in their order and their corners in theirs: proved, not assumed"""
    got = vm[ix.reshape(-1, 3)]
    return got.shape == ref.shape and bool((got == ref).all())

# ---- 2. cut afresh
at = xatlas.Atlas(); at.add_mesh(W, LI)
co = xatlas.ChartOptions(); po = xatlas.PackOptions(); po.resolution = PX; po.padding = int(round(PAD)); po.bilinear = True; po.rotate_charts = True
at.generate(co, po)
vm, ix, uv = at[0]
ix = np.asarray(ix).reshape(-1, 3); vm = np.asarray(vm).astype(np.int64)
assert same_tris(ix, vm, LI.astype(np.int64)), 'xatlas moved a triangle'
log(f'xatlas: {at.chart_count} charts, {100 * at.utilization:.0f}% of the square used')

# ---- 3. each chart made larger by its part, then packed again from its coordinates with a margin of PAD pixels at PX
par = np.arange(len(vm))
def find(a):
    r = a
    while par[r] != r: r = par[r]
    while par[a] != r: par[a], a = r, par[a]
    return r
for a, b, c in ix:
    ra = find(a); rb = find(b)
    if ra != rb: par[rb] = ra
    rc = find(c)
    if rc != ra: par[rc] = ra
root = np.array([find(t[0]) for t in ix]); ids, cinv = np.unique(root, return_inverse=True); C = len(ids)
area = np.bincount(cinv, weights=A3, minlength=C); kC = np.bincount(cinv, weights=A3 * kT, minlength=C) / np.maximum(area, 1e-12)
vchart = np.zeros(len(vm), np.int64); vchart[ix.ravel()] = np.repeat(cinv, 3)
uv = np.asarray(uv, dtype=np.float64)
cen = np.zeros((C, 2)); cnt = np.bincount(vchart, minlength=C); np.add.at(cen, vchart, uv); cen /= np.maximum(cnt, 1)[:, None]
uv2 = (cen[vchart] + (uv - cen[vchart]) * kC[vchart][:, None]).astype(np.float32)
pad = PAD
for attempt in range(6):
    a2 = xatlas.Atlas(); a2.add_uv_mesh(uv2, ix.astype(np.uint32))
    p2 = xatlas.PackOptions(); p2.resolution = PX; p2.padding = int(math.ceil(pad)); p2.bilinear = True; p2.rotate_charts = True
    a2.generate(xatlas.ChartOptions(), p2)
    vm2, ix2, uvp = a2[0]
    ix2 = np.asarray(ix2).reshape(-1, 3); vm2 = np.asarray(vm2).astype(np.int64)
    assert same_tris(ix2, vm2, ix.astype(np.int64)), 'xatlas moved a triangle in the second packing'
    side = max(a2.width, a2.height); eff = int(math.ceil(pad)) * PX / side
    if a2.atlas_count == 1 and eff >= PAD - 1e-6: break
    pad = pad * side / PX + 0.5
log(f'packed again: {a2.chart_count} charts in a {a2.width}x{a2.height} square drawn at {PX} ({100 * a2.utilization:.0f}% used), a margin of {eff:.1f} pixels at {PX}')
assert a2.atlas_count == 1, 'more than one square'
# (xatlas's coordinates run over its own square; drawn at PX, the square is the whole sheet)
cu = np.asarray(uvp, dtype=np.float64)[ix2]                    # each corner, in the order of the triangles and their corners
cu[..., 0] *= a2.width / side; cu[..., 1] *= a2.height / side    # a square that is not quite square keeps its shape
off = (cu < -1e-6) | (cu > 1 + 1e-6)
def uvsum(u): return float(0.5 * np.abs((u[:, 1, 0] - u[:, 0, 0]) * (u[:, 2, 1] - u[:, 0, 1]) - (u[:, 2, 0] - u[:, 0, 0]) * (u[:, 1, 1] - u[:, 0, 1])).sum())
if not off.any() and uvsum(cu) > 0.98:
    off[:] = True; log(f'the second packing covers {100 * uvsum(cu):.0f}% of the square in sum: charts lie over one another')
if off.any():
    # (the second packing can leave a chart outside the square: seen once, on the bench woman's full model of 310,742
    #  triangles, whose own scan has charts of no area. Then the first packing, which put every chart in its square with
    #  its margin, is kept as it is: the face has its old share of the sheet, nothing more, and nothing is lost)
    bad = int(off.any(axis=(1, 2)).sum())
    log(f'the second packing left {bad} triangles outside the square: the first packing is kept (no larger face)')
    side1 = max(at.width, at.height)
    cu = uv[ix].copy(); cu[..., 0] *= at.width / side1; cu[..., 1] *= at.height / side1
    eff = int(round(PAD)) * PX / side1
    summary_note = ' (first packing: no larger face)'
    assert uvsum(cu) <= 0.98, 'the first packing has charts lying over one another too: this body keeps its own sheet'
else:
    summary_note = ''

# ---- the texels a metre, as shipped and now (the old sheet at the size it shipped at, which the dump names: 'shipped')
def uvarea(u): return 0.5 * np.abs((u[:, 1, 0] - u[:, 0, 0]) * (u[:, 2, 1] - u[:, 0, 1]) - (u[:, 2, 0] - u[:, 0, 0]) * (u[:, 1, 1] - u[:, 0, 1]))
olduv = U[I].astype(np.float64)
SHIP = int(J.get('shipped', PX))
def dens(uvs, px, mask): return math.sqrt(uvarea(uvs[mask]).sum() * px * px / max(A3[mask].sum(), 1e-12))
rep = {}
for nm, msk in (('face', face), ('head', head & ~face), ('hands', hand), ('body', ~head & ~hand)):
    if msk.any(): rep[nm] = [round(dens(olduv, SHIP, msk)), round(dens(cu, PX, msk))]
summary = 'texels a metre at %d, before -> now: ' % PX + ', '.join(f'{k} {a} -> {b}' for k, (a, b) in rep.items()) + f'; {C} charts, margin {eff:.1f} px' + summary_note
log(summary)

# ---- 4. the colour, from the source's own sheet through the old coordinates (Blender, Cycles, emission)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
me = bpy.data.meshes.new('body')
me.vertices.add(len(W)); me.vertices.foreach_set('co', W.ravel().astype(np.float64))
me.loops.add(m * 3); me.loops.foreach_set('vertex_index', LI.ravel().astype(np.int32))
me.polygons.add(m); me.polygons.foreach_set('loop_start', (np.arange(m) * 3).astype(np.int32))
me.update(calc_edges=True)
assert len(me.polygons) == m, 'Blender changed the mesh'
old = me.uv_layers.new(name='old'); per = olduv.reshape(-1, 2).copy(); per[:, 1] = 1.0 - per[:, 1]; old.data.foreach_set('uv', per.ravel())
new = me.uv_layers.new(name='new'); per2 = cu.reshape(-1, 2).copy(); per2[:, 1] = 1.0 - per2[:, 1]; new.data.foreach_set('uv', per2.ravel())
ob = bpy.data.objects.new('body', me); scene.collection.objects.link(ob)
bimg = bpy.data.images.load(f'{D}/{J["src"]}'); bimg.colorspace_settings.name = 'sRGB'
scene.render.engine = 'CYCLES'; scene.cycles.device = 'CPU'; scene.cycles.samples = SAMPLES; scene.cycles.filter_width = 1.0
scene.render.use_texture_cache = False   # (Blender 5 would read a blurred copy of the sheet: v24.55)
mat = bpy.data.materials.new('body'); mat.use_nodes = True; nt = mat.node_tree
for nd in list(nt.nodes): nt.nodes.remove(nd)
o = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); tx = nt.nodes.new('ShaderNodeTexImage'); uvn = nt.nodes.new('ShaderNodeUVMap')
uvn.uv_map = 'old'; tx.image = bimg; tx.interpolation = 'Closest'; tx.extension = 'EXTEND'
nt.links.new(uvn.outputs['UV'], tx.inputs['Vector']); nt.links.new(tx.outputs['Color'], em.inputs['Color']); nt.links.new(em.outputs['Emission'], o.inputs['Surface'])
tgt = nt.nodes.new('ShaderNodeTexImage'); img = bpy.data.images.new('baked', PX, PX, alpha=False, float_buffer=False); img.colorspace_settings.name = 'sRGB'; tgt.image = img
nt.nodes.active = tgt
me.materials.append(mat)
for lay in me.uv_layers: lay.active_render = (lay.name == 'new')
me.uv_layers.active = me.uv_layers['new']
bpy.context.view_layer.objects.active = ob; ob.select_set(True)
log(f'baking {PX}x{PX} at {SAMPLES} samples a texel from the {SRCPX} sheet')
bpy.ops.object.bake(type='EMIT', margin=int(max(16, PX // 64)), margin_type='EXTEND', use_clear=True)
img.filepath_raw = f'{D}/baked.png'; img.file_format = 'PNG'; img.save()
log('baked')

flat = cu.reshape(-1, 2).astype(np.float32)
assert flat.min() >= -1e-6 and flat.max() <= 1 + 1e-6, 'a coordinate left the sheet'
np.clip(flat, 0.0, 1.0).astype(np.float32).tofile(f'{D}/corner_uv.f32')
json.dump({'image': 'baked.png', 'px': PX, 'charts': int(C), 'margin': round(eff, 2), 'density': rep, 'samples': SAMPLES, 'summary': summary,
           'face': FACE, 'headk': HEADK, 'handk': HANDK, 'secs': round(time.time() - T0, 1)}, open(f'{D}/baked.json', 'w'), indent=1)
log('written')
