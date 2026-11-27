"""v29.0 (E5C1 THINGS-3, R13): the shared kit of the things made IN CODE, in Blender (5.2.3 as a Python module, no
graphics card: /home/user/bpyenv). Chad's word of 27 Nov 2026: "If the objects are simple enough, generate with code
instead of generating on meshy." Blender here BUILDS the mesh and BAKES its paint; it never judges a picture (the game's
renderer does that: tools/shootmodel.mjs, tools/probes/e5c1lab.mjs).

Every thing is built in real metres, its base centre on the origin, its FRONT toward Blender's -Y (glTF +Z: every prop of
the game faces +z). Its parts carry procedural materials (wood grain, woven cloth, enamel, brass) whose colour, roughness,
metal and bump are BAKED by Cycles into one sheet set over one UV layout of the whole thing (one material in the game),
then exported as GLB (JPEG sheets) for tools/prepmeshy.mjs to pack (sizing asserted, meshopt). Nothing is a flat block of
colour: every surface has its grain, weave or wear in the sheet and in the normal map.

    BPY=/home/user/bpyenv/bin/python; $BPY masters/v29.0/props/code/<thing>.py <out.glb> [px]
"""
import bpy, bmesh, math, sys, os, random
import numpy as np
from mathutils import Vector, Matrix

# ------------------------------------------------------------------ scene
def reset(seed=51):
    random.seed(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 4
    sc.render.bake.margin = 8
    sc.unit_settings.system = 'METRIC'
    return sc

def link(ob):
    bpy.context.scene.collection.objects.link(ob)
    return ob

def mesh_from_bm(name, bm):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    return link(bpy.data.objects.new(name, me))

def apply_mods(ob):
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True)
    for m in list(ob.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
    return ob

def smooth(ob, angle=35):
    """smooth shading with sharp edges kept past `angle` degrees (Blender 4.1+: by the face normals' angle)"""
    for p in ob.data.polygons: p.use_smooth = True
    try:
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    except Exception:
        pass
    return ob

def bevel(ob, width, segs=3, limit=None):
    m = ob.modifiers.new('bevel', 'BEVEL'); m.width = width; m.segments = segs
    m.limit_method = 'ANGLE' if limit is None else limit
    m.harden_normals = False
    return ob

def box(name, sx, sy, sz, at=(0, 0, 0), bev=0.003, segs=3, mat=None, rot=None):
    """a box of sx x sy x sz metres, its centre at `at`, its edges bevelled by `bev` (a real edge catches light)"""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
    ob = mesh_from_bm(name, bm)
    if bev > 0: bevel(ob, bev, segs); apply_mods(ob)
    if rot: ob.rotation_euler = rot
    ob.location = at
    if mat: ob.data.materials.append(mat)
    return smooth(ob)

def cyl(name, r, h, at=(0, 0, 0), n=48, bev=0.0015, segs=2, mat=None, r2=None, cap=True):
    """a cylinder (or a cone frustum with r2) standing on z from at.z to at.z + h"""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=cap, cap_tris=False, segments=n, radius1=r, radius2=r if r2 is None else r2, depth=h)
    bmesh.ops.translate(bm, vec=(0, 0, h / 2), verts=bm.verts)
    ob = mesh_from_bm(name, bm)
    if bev > 0: bevel(ob, bev, segs); apply_mods(ob)
    ob.location = at
    if mat: ob.data.materials.append(mat)
    return smooth(ob, 40)

def lathe(name, prof, n=64, at=(0, 0, 0), mat=None, closed=False):
    """a turned shape: prof is [(r, z), ...] from the bottom up (r >= 0), spun round z"""
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in prof]
    for a, b in zip(vs, vs[1:]): bm.edges.new((a, b))
    bmesh.ops.spin(bm, geom=bm.verts[:] + bm.edges[:], cent=(0, 0, 0), axis=(0, 0, 1), angle=2 * math.pi, steps=n, use_duplicate=False)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    ob = mesh_from_bm(name, bm)
    ob.location = at
    if mat: ob.data.materials.append(mat)
    return smooth(ob, 50)

def tube_path(name, pts, r, n=16, mat=None, closed=False):
    """a round tube of radius r along the polyline pts (a bar, a rail, a rack's frame), its ends capped"""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts): p.co = (q[0], q[1], q[2], 1)
    sp.use_cyclic_u = closed
    cu.bevel_depth = r; cu.bevel_resolution = max(2, n // 4); cu.use_fill_caps = True
    ob = link(bpy.data.objects.new(name, cu))
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True); bpy.ops.object.convert(target='MESH')
    ob = bpy.context.view_layer.objects.active
    if mat: ob.data.materials.append(mat)
    return smooth(ob, 50)

def join(obs, name):
    for o in bpy.context.selected_objects: o.select_set(False)
    for o in obs: o.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]
    bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active; ob.name = name
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return ob

# ------------------------------------------------------------------ materials (procedural; baked later)
class M:
    """a procedural material: its node tree, and the four sockets the bake reads (colour, roughness, metal, height)"""
    def __init__(self, name):
        self.mat = bpy.data.materials.new(name); self.mat.use_nodes = True
        self.nt = self.mat.node_tree; self.n = self.nt.nodes; self.l = self.nt.links
        for x in list(self.n): self.n.remove(x)
        self.out = self.n.new('ShaderNodeOutputMaterial')
        self.bsdf = self.n.new('ShaderNodeBsdfPrincipled')
        self.l.new(self.bsdf.outputs[0], self.out.inputs[0])
        self.col = self.rough = self.metal = self.height = None
        self.bump_strength = 0.4; self.bump_dist = 0.001
    def node(self, kind, **kw):
        nd = self.n.new(kind)
        for k, v in kw.items():
            if k in nd.inputs: nd.inputs[k].default_value = v
            else: setattr(nd, k, v)
        return nd
    def val(self, v):
        nd = self.n.new('ShaderNodeValue'); nd.outputs[0].default_value = v; return nd.outputs[0]
    def rgb(self, c):
        nd = self.n.new('ShaderNodeRGB'); nd.outputs[0].default_value = (*srgb(c), 1); return nd.outputs[0]
    def coord(self, kind='Object'):
        tc = self.n.new('ShaderNodeTexCoord'); return tc.outputs[kind]
    def mapping(self, vec, scale=(1, 1, 1), rot=(0, 0, 0), loc=(0, 0, 0)):
        mp = self.n.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = scale
        mp.inputs['Rotation'].default_value = rot; mp.inputs['Location'].default_value = loc
        self.l.new(vec, mp.inputs['Vector']); return mp.outputs[0]
    def noise(self, vec, scale, detail=6, rough=0.55, dist=0.0, dims='3D', out='Fac'):
        nd = self.n.new('ShaderNodeTexNoise'); nd.noise_dimensions = dims
        nd.inputs['Scale'].default_value = scale; nd.inputs['Detail'].default_value = detail
        nd.inputs['Roughness'].default_value = rough; nd.inputs['Distortion'].default_value = dist
        self.l.new(vec, nd.inputs['Vector']); return nd.outputs[out]
    def wave(self, vec, scale, dist=4.0, detail=3, dscale=1.0, kind='BANDS', axis='Z', prof='SIN'):
        nd = self.n.new('ShaderNodeTexWave'); nd.wave_type = kind; nd.wave_profile = prof
        if kind == 'BANDS': nd.bands_direction = axis
        else: nd.rings_direction = axis
        nd.inputs['Scale'].default_value = scale; nd.inputs['Distortion'].default_value = dist
        nd.inputs['Detail'].default_value = detail; nd.inputs['Detail Scale'].default_value = dscale
        self.l.new(vec, nd.inputs['Vector']); return nd.outputs['Fac']
    def voronoi(self, vec, scale, out='Distance', feature='F1'):
        nd = self.n.new('ShaderNodeTexVoronoi'); nd.feature = feature; nd.inputs['Scale'].default_value = scale
        self.l.new(vec, nd.inputs['Vector']); return nd.outputs[out]
    def ramp(self, fac, stops):
        """stops: [(pos, '#rrggbb' or (r,g,b) or grey float)]"""
        nd = self.n.new('ShaderNodeValToRGB'); cr = nd.color_ramp
        while len(cr.elements) > 1: cr.elements.remove(cr.elements[-1])
        for i, (p, c) in enumerate(stops):
            e = cr.elements[0] if i == 0 else cr.elements.new(p)
            e.position = p
            e.color = (*srgb(c), 1) if not isinstance(c, (int, float)) else (c, c, c, 1)
        self.l.new(fac, nd.inputs['Fac']); return nd.outputs['Color']
    def math(self, op, a, b=None, clamp=False):
        nd = self.n.new('ShaderNodeMath'); nd.operation = op; nd.use_clamp = clamp
        for i, x in enumerate((a, b)):
            if x is None: continue
            if isinstance(x, (int, float)): nd.inputs[i].default_value = x
            else: self.l.new(x, nd.inputs[i])
        return nd.outputs[0]
    def mix(self, fac, a, b, mode='MIX'):
        nd = self.n.new('ShaderNodeMix'); nd.data_type = 'RGBA'; nd.blend_type = mode
        if isinstance(fac, (int, float)): nd.inputs['Factor'].default_value = fac
        else: self.l.new(fac, nd.inputs['Factor'])
        for sock, x in ((nd.inputs[6], a), (nd.inputs[7], b)):
            if isinstance(x, (tuple, list, str)): sock.default_value = (*srgb(x), 1)
            else: self.l.new(x, sock)
        return nd.outputs[2]
    def done(self):
        """wire the four sockets into the BSDF so the procedural material itself also renders (for checks only)"""
        if self.col is not None: self.l.new(self.col, self.bsdf.inputs['Base Color'])
        if self.rough is not None: self.l.new(self.rough, self.bsdf.inputs['Roughness'])
        if self.metal is not None: self.l.new(self.metal, self.bsdf.inputs['Metallic'])
        if self.height is not None:
            bp = self.n.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = self.bump_strength
            bp.inputs['Distance'].default_value = self.bump_dist
            self.l.new(self.height, bp.inputs['Height']); self.l.new(bp.outputs[0], self.bsdf.inputs['Normal'])
        return self.mat

def srgb(c):
    """'#rrggbb' or (r, g, b) in 0..1 sRGB -> linear"""
    if isinstance(c, str): c = tuple(int(c[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda x: x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
    return tuple(f(x) for x in c[:3])

# ------------------------------------------------------------------ the bake: one UV layout, one sheet set
def uv_all(ob, margin=0.004, angle=66):
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(angle), island_margin=margin, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode='OBJECT')

def _img(name, px, non_color):
    im = bpy.data.images.new(name, px, px, alpha=False, float_buffer=False)
    if non_color: im.colorspace_settings.name = 'Non-Color'
    return im

def bake(ob, px=1024, out_dir=None, tag='thing'):
    """bake every material of `ob` into one set of sheets (colour, roughness, metal, normal) over its one UV layout, then
    give `ob` a single plain Principled material reading them (what glTF exports). Returns the images."""
    sc = bpy.context.scene
    imgs = {k: _img(f'{tag}_{k}', px, k != 'col') for k in ('col', 'rough', 'metal', 'nrm')}
    mats = [s.material for s in ob.material_slots]
    def target(img):
        for mt in mats:
            nt = mt.node_tree
            t = nt.nodes.get('__bake') or nt.nodes.new('ShaderNodeTexImage'); t.name = '__bake'
            t.image = img; nt.nodes.active = t
    def emit_of(mt, which):
        """route one socket of the material's procedural tree into an Emission shader for an EMIT bake"""
        nt = mt.node_tree; mm = mt.__dict__.get('_m') if False else None
        info = PROC[mt.name]
        out = info.out; e = nt.nodes.get('__emit') or nt.nodes.new('ShaderNodeEmission'); e.name = '__emit'
        src = getattr(info, which)
        if src is None:
            v = {'rough': 0.6, 'metal': 0.0, 'col': (0.8, 0.8, 0.8, 1)}[which]
            e.inputs['Color'].default_value = v if which == 'col' else (v, v, v, 1)
            for lk in list(e.inputs['Color'].links): nt.links.remove(lk)
        else:
            nt.links.new(src, e.inputs['Color'])
        e.inputs['Strength'].default_value = 1.0
        nt.links.new(e.outputs[0], out.inputs[0])
    def bsdf_back(mt):
        info = PROC[mt.name]; mt.node_tree.links.new(info.bsdf.outputs[0], info.out.inputs[0])
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True)
    sc.cycles.samples = 4
    for which in ('col', 'rough', 'metal'):
        for mt in mats: emit_of(mt, which)
        target(imgs[which])
        bpy.ops.object.bake(type='EMIT', margin=8, use_clear=True)
    for mt in mats: bsdf_back(mt)
    target(imgs['nrm'])
    sc.cycles.samples = 8
    bpy.ops.object.bake(type='NORMAL', normal_space='TANGENT', margin=8, use_clear=True)
    # one material for the game: colour, roughness and metal (G and B of one sheet, as glTF reads them), normal
    W = px * px
    r = np.array(imgs['rough'].pixels[:]).reshape(-1, 4); m = np.array(imgs['metal'].pixels[:]).reshape(-1, 4)
    orm = _img(f'{tag}_orm', px, True)
    pix = np.ones((W, 4), dtype=np.float32); pix[:, 1] = r[:, 0]; pix[:, 2] = m[:, 0]
    orm.pixels.foreach_set(pix.ravel())
    fm = bpy.data.materials.new(tag); fm.use_nodes = True
    nt = fm.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexImage'); tc.image = imgs['col']; nt.links.new(tc.outputs[0], b.inputs['Base Color'])
    to = nt.nodes.new('ShaderNodeTexImage'); to.image = orm
    sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(to.outputs[0], sp.inputs[0])
    nt.links.new(sp.outputs['Green'], b.inputs['Roughness']); nt.links.new(sp.outputs['Blue'], b.inputs['Metallic'])
    tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = imgs['nrm']
    nm = nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(tn.outputs[0], nm.inputs['Color']); nt.links.new(nm.outputs[0], b.inputs['Normal'])
    ob.data.materials.clear(); ob.data.materials.append(fm)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
        for k, im in (('col', imgs['col']), ('orm', orm), ('nrm', imgs['nrm'])):
            im.filepath_raw = os.path.join(out_dir, f'{tag}-{k}.png'); im.file_format = 'PNG'; im.save()
    return imgs

PROC = {}   # material name -> its M (the bake reads its sockets)

def proc(m):
    PROC[m.mat.name] = m; return m.done()

def export(ob_list, path):
    for o in bpy.context.selected_objects: o.select_set(False)
    for o in ob_list: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_image_format='JPEG',
                              export_jpeg_quality=95, export_apply=True, export_yup=True, export_texcoords=True,
                              export_normals=True, export_tangents=False, export_materials='EXPORT')
    print('EXPORTED', path, os.path.getsize(path))

def stats(ob):
    me = ob.data; me.calc_loop_triangles()
    vs = [ob.matrix_world @ v.co for v in me.vertices]
    lo = [min(v[i] for v in vs) for i in range(3)]; hi = [max(v[i] for v in vs) for i in range(3)]
    print('STATS', ob.name, 'tris', len(me.loop_triangles), 'x', round(hi[0] - lo[0], 4), 'y(depth)', round(hi[1] - lo[1], 4), 'z(h)', round(hi[2] - lo[2], 4), 'zmin', round(lo[2], 5))

# ------------------------------------------------------------------ the common surfaces
def wood(name, dark='#2a170d', mid='#4a2c18', light='#6b4426', grain=60.0, axis='X', gloss=0.35, ring=False, rot=(0, 0, 0)):
    """real wood: long distorted grain bands along `axis` (the board's length), a finer fibre noise over them, darker
       pores, a little colour drift across a board; satin, its roughness following the grain; the grain in the bump"""
    m = M(name); co = m.coord('Object')
    # stretch the space across the grain so the bands run long
    sc = {'X': (0.08, 1, 1), 'Y': (1, 0.08, 1), 'Z': (1, 1, 0.08)}[axis]
    v = m.mapping(co, scale=sc, rot=rot)
    nd = m.n.new('ShaderNodeTexWave'); nd.wave_type = 'RINGS'; nd.rings_direction = axis   # rings round the board's axis:
    # end grain on its ends, long figured lines on its faces (the wave's period at scale 1 is about 0.31 m)
    nd.wave_profile = 'SAW'
    nd.inputs['Scale'].default_value = grain; nd.inputs['Distortion'].default_value = 4.0
    nd.inputs['Detail'].default_value = 4; nd.inputs['Detail Scale'].default_value = 1.4; nd.inputs['Detail Roughness'].default_value = 0.6
    m.l.new(v, nd.inputs['Vector'])
    g = nd.outputs['Fac']
    fib = m.noise(m.mapping(co, scale=(sc[0] * 40, sc[1] * 40, sc[2] * 40)), 30, detail=8, rough=0.7)
    drift = m.noise(co, 2.5, detail=2)
    gf = m.math('ADD', m.math('MULTIPLY', g, 0.55), m.math('MULTIPLY', fib, 0.45))
    base = m.ramp(gf, [(0.0, light), (0.55, mid), (1.0, dark)])
    m.col = m.mix(m.math('MULTIPLY', drift, 0.35), base, dark, 'MULTIPLY')
    m.rough = m.math('ADD', gloss, m.math('MULTIPLY', gf, 0.18))
    m.metal = None
    m.height = m.math('ADD', m.math('MULTIPLY', g, 0.3), m.math('MULTIPLY', fib, 0.7))
    m.bump_strength = 0.25; m.bump_dist = 0.0006
    return proc(m)

def brass(name, tone='#b08a4a', worn=0.35):
    m = M(name); co = m.coord('Object')
    n1 = m.noise(co, 60, detail=8, rough=0.6); n2 = m.noise(co, 6, detail=3)
    m.col = m.mix(m.math('MULTIPLY', n2, worn), tone, '#6e5328')
    m.rough = m.math('ADD', 0.28, m.math('MULTIPLY', n1, 0.22))
    m.metal = m.val(0.75)
    m.height = n1; m.bump_strength = 0.08; m.bump_dist = 0.0003
    return proc(m)

def beam(name, p0, p1, w, h=None, bev=0.002, segs=2, mat=None):
    """a straight square (w x h) bar from p0 to p1 (a frame's tube, a slat, a rail), its edges eased"""
    h = w if h is None else h
    a, b = Vector(p0), Vector(p1); d = b - a; L = d.length
    ob = box(name, w, h, L, at=(0, 0, 0), bev=bev, segs=segs, mat=mat)
    q = Vector((0, 0, 1)).rotation_difference(d.normalized())
    for v in ob.data.vertices: v.co = q @ v.co + (a + b) / 2
    ob.data.update()
    return ob
