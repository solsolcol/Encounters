# v28.0 (E4C5, R94: Chad's "Full upgrade" of the abilities' effects; R95/R97: "Use higgsfield gpu for this",
# "Do everything that you need to on the gpu"). A FLIPBOOK FROM A REAL SIMULATION, run in Blender's own Python on a
# rented GPU box:
#   blender -b -P tools/fx/flipsim.py -- KIND OUTDIR RES PX FRAME0 NFRAMES SAMPLES
# KIND: fire  (a ball of fire whose flames stream one way: the fireball's head, made a seamless loop by flippack.py)
#       burst (fire thrown out from a point for three frames, rolling up into smoke: a fireball's landing)
#       smoke (a soft puff thrown out and fading: the smoke left behind)
# A Mantaflow gas simulation (CPU) baked into the box's /workspace, then rendered in Cycles on the GPU by an
# orthographic camera from the side: frames FRAME0 .. FRAME0+NFRAMES-1, each as two linear half-float EXRs:
#   OUTDIR/a_####.exr  the fire's own light alone on black (no sun): the atlas's heat
#   OUTDIR/b_####.exr  the smoke alone on a transparent film, lit by one sun from above (no fire): its cover and shade
# The colour is the game's (a ramp over the heat), so the fire is rendered white. Every number here is the recipe.
# Env: FX_HEAT (the flame's emission per unit of flame, 8), FX_NOISE (Mantaflow's noise upres, 0 = none),
#      FX_SKIPBAKE=1 (render an existing cache again), FX_ONLYBAKE=1 (bake and check, no render).
# The bake is CHECKED before anything renders: the cache's files counted, and the density and flame grids read at
# three frames; an empty simulation stops the run with exit code 3 (the first test on the box rendered an empty
# domain without a word, because its bake had been skipped).
import bpy, sys, os, math

A = sys.argv[sys.argv.index('--') + 1:]
KIND, OUT = A[0], A[1]
RES, PX, F0, N, SPP = int(A[2]), int(A[3]), int(A[4]), int(A[5]), int(A[6])
FIRE = KIND in ('fire', 'burst')
NOISE = int(os.environ.get('FX_NOISE', '0'))
os.makedirs(OUT, exist_ok=True)


def say(*a):
    print(*a, flush=True)


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps = 24

# --- the GPU (OptiX, else CUDA) for Cycles
cp = bpy.context.preferences.addons['cycles'].preferences
for t in ('OPTIX', 'CUDA'):
    try:
        cp.compute_device_type = t
        cp.get_devices()
        if any(d.type == t for d in cp.devices):
            break
    except Exception as e:
        say('device type', t, 'refused:', e)
for d in cp.devices:
    d.use = d.type != 'CPU'
say('DEVICES', cp.compute_device_type, [(d.name, d.type, d.use) for d in cp.devices])
sc.render.engine = 'CYCLES'
sc.cycles.device = 'GPU'

# --- each kind's numbers: the emitter, the domain (its centre and half extents), the camera's frame, the flow
END = F0 + N
K = {
    'fire':  dict(r=0.20, dom=((0, 0, 0.55), (0.75, 0.75, 1.05)), cam=((0, 0, 0.28), 1.30),
                  vel=0.0, flow=(1, 10 ** 6), fuel=1.4, smoke=0.25, temp=2.2, vort=0.35, fvort=0.9, burn=0.85,
                  dissolve=18, alpha=0.1, beta=2.4),
    'burst': dict(r=0.16, dom=((0, 0, 0.45), (1.2, 1.2, 1.35)), cam=((0, 0, 0.30), 2.30),
                  vel=3.4, flow=(1, 3), fuel=2.2, smoke=0.9, temp=2.6, vort=0.45, fvort=1.0, burn=0.70,
                  dissolve=30, alpha=0.4, beta=1.2),
    'smoke': dict(r=0.15, dom=((0, 0, 0.50), (1.0, 1.0, 1.10)), cam=((0, 0, 0.35), 1.80),
                  vel=1.3, flow=(1, 6), fuel=0.0, smoke=1.4, temp=0.6, vort=0.40, fvort=0.0, burn=0.0,
                  dissolve=34, alpha=0.6, beta=0.5),
}[KIND]

# --- the emitter, and the flow and the domain made by hand (quick_smoke run under a pinned context gave its domain's
#     modifier to the emitter, the first test on the box)
bpy.ops.mesh.primitive_uv_sphere_add(radius=K['r'], location=(0, 0, 0), segments=32, ring_count=16)
em = bpy.context.active_object
em.name = 'Emitter'
em.modifiers.new('Fluid', 'FLUID').fluid_type = 'FLOW'
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
dom = bpy.context.active_object
dom.name = 'Domain'
dom.modifiers.new('Fluid', 'FLUID').fluid_type = 'DOMAIN'
ds = dom.modifiers['Fluid'].domain_settings
ds.domain_type = 'GAS'
dom.location = K['dom'][0]
dom.scale = K['dom'][1]
dom.rotation_euler = (0, 0, 0)
ds.resolution_max = RES
ds.use_adaptive_domain = False
ds.cache_type = 'ALL'
ds.cache_directory = '/workspace/fx/cache_' + KIND
ds.cache_frame_start = 1
ds.cache_frame_end = END
ds.vorticity = K['vort']
ds.alpha = K['alpha']
ds.beta = K['beta']
ds.use_dissolve_smoke = True
ds.dissolve_speed = K['dissolve']
ds.use_dissolve_smoke_log = True
for side in ('front', 'back', 'right', 'left', 'top', 'bottom'):
    setattr(ds, 'use_collision_border_' + side, False)
if FIRE:
    ds.burning_rate = K['burn']
    ds.flame_vorticity = K['fvort']
    ds.flame_smoke = 0.6 if KIND == 'fire' else 1.0
    ds.flame_ignition = 1.25
    ds.flame_max_temp = 1.75
if NOISE > 1:
    ds.use_noise = True
    ds.noise_scale = NOISE
    ds.noise_strength = 1.0

fs = em.modifiers['Fluid'].flow_settings
fs.flow_type = 'BOTH' if FIRE else 'SMOKE'
fs.flow_behavior = 'INFLOW'
fs.flow_source = 'MESH'
fs.surface_distance = 1.2
fs.use_plane_init = False
fs.fuel_amount = K['fuel']
fs.density = K['smoke']
fs.temperature = K['temp']
fs.smoke_color = (0.55, 0.53, 0.50)
if K['vel'] > 0:
    fs.use_initial_velocity = True
    fs.velocity_normal = K['vel']
    fs.velocity_random = 0.6
# (a cloud texture on the emission, so the flames tear unevenly as real fire does)
tex = bpy.data.textures.new('flowNoise', 'CLOUDS')
tex.noise_scale = 0.18
tex.noise_depth = 3
fs.use_texture = True
fs.noise_texture = tex
fs.texture_size = 0.6
# (the flow switched on only over its frames: the burst's three, the smoke's six, the fire always)
f1, f2 = K['flow']
fs.use_inflow = True
fs.keyframe_insert('use_inflow', frame=1)
if f2 < 10 ** 5:
    fs.keyframe_insert('use_inflow', frame=f2)
    fs.use_inflow = False
    fs.keyframe_insert('use_inflow', frame=f2 + 1)
# (the texture drifts through the emitter so the fire never repeats its tearing)
fs.texture_offset = 0.0
fs.keyframe_insert('texture_offset', frame=1)
fs.texture_offset = 3.0
fs.keyframe_insert('texture_offset', frame=END)
em.hide_render = True

# --- the material: one volume whose emission is the flame's heat in plain white (the game colours it), and whose
#     density is the smoke (a grey lit by the sun)
mat = bpy.data.materials.new('FX')
mat.use_nodes = True
nt = mat.node_tree
for n in list(nt.nodes):
    nt.nodes.remove(n)
out = nt.nodes.new('ShaderNodeOutputMaterial')
vol = nt.nodes.new('ShaderNodeVolumePrincipled')
vol.inputs['Color'].default_value = (0.62, 0.61, 0.60, 1)
ad = nt.nodes.new('ShaderNodeAttribute')
ad.attribute_name = 'density'
md = nt.nodes.new('ShaderNodeMath')
md.operation = 'MULTIPLY'
md.inputs[1].default_value = 6.0 if FIRE else 9.0
nt.links.new(ad.outputs['Fac'], md.inputs[0])
nt.links.new(md.outputs[0], vol.inputs['Density'])
ms = None
if FIRE:
    af = nt.nodes.new('ShaderNodeAttribute')
    af.attribute_name = 'flame'
    ms = nt.nodes.new('ShaderNodeMath')
    ms.operation = 'MULTIPLY'
    ms.inputs[1].default_value = float(os.environ.get('FX_HEAT', '8.0'))
    nt.links.new(af.outputs['Fac'], ms.inputs[0])
    vol.inputs['Emission Color'].default_value = (1, 1, 1, 1)
    nt.links.new(ms.outputs[0], vol.inputs['Emission Strength'])
nt.links.new(vol.outputs['Volume'], out.inputs['Volume'])
dom.data.materials.clear()
dom.data.materials.append(mat)

# --- the world black; a sun from above and to the camera's left for the smoke's shape
w = bpy.data.worlds.new('W')
w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.0
sc.world = w
sun = bpy.data.lights.new('Sun', 'SUN')
sun.energy = 0.0
so = bpy.data.objects.new('Sun', sun)
so.rotation_euler = (math.radians(35), math.radians(-25), 0)
sc.collection.objects.link(so)

# --- the camera: orthographic, from the side (-y), level
cam = bpy.data.cameras.new('Cam')
cam.type = 'ORTHO'
cam.ortho_scale = K['cam'][1]
co = bpy.data.objects.new('Cam', cam)
cx, cy, cz = K['cam'][0]
co.location = (cx, -6.0, cz)
co.rotation_euler = (math.radians(90), 0, 0)
sc.collection.objects.link(co)
sc.camera = co

# --- the render: square, denoised, linear half-float EXR (the packer normalises; nothing clips here)
r = sc.render
r.resolution_x = PX
r.resolution_y = PX
r.resolution_percentage = 100
r.image_settings.file_format = 'OPEN_EXR'
r.image_settings.color_mode = 'RGBA'
r.image_settings.color_depth = '16'
r.image_settings.exr_codec = 'ZIP'
sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'
sc.cycles.samples = SPP
sc.cycles.use_denoising = True
sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.volume_step_rate = 0.5
sc.cycles.volume_max_steps = 1024
sc.cycles.max_bounces = 4
sc.cycles.volume_bounces = 1
sc.frame_start = 1
sc.frame_end = END


def gridstats():
    # the bake read back: its files, and the grids' largest values at three frames
    import glob
    data = glob.glob(os.path.join(ds.cache_directory, 'data', '*'))
    noise = glob.glob(os.path.join(ds.cache_directory, 'noise', '*'))
    say('CACHE', len(data), 'data files', round(sum(os.path.getsize(f) for f in data) / 1e6, 1), 'MB;',
        len(noise), 'noise files')
    best = 0.0
    for f in (F0, F0 + N // 2, F0 + N - 1):
        sc.frame_set(f)
        dg = bpy.context.evaluated_depsgraph_get()
        de = dom.evaluated_get(dg).modifiers['Fluid'].domain_settings
        dens = de.density_grid
        fl = de.flame_grid if FIRE else []
        dm = max(dens) if len(dens) else 0.0
        fm = max(fl) if len(fl) else 0.0
        say('GRID frame', f, 'cells', len(dens), 'density max', round(dm, 4), 'flame max', round(fm, 4))
        best = max(best, dm, fm)
    return best


# --- bake (CPU), unless the cache is already there (FX_SKIPBAKE=1); then the check; then the two passes (GPU)
if os.environ.get('FX_SKIPBAKE') != '1':
    say('BAKE', KIND, 'res', RES, 'noise', NOISE, 'frames 1 ..', END)
    with bpy.context.temp_override(object=dom, active_object=dom, selected_objects=[dom],
                                   selected_editable_objects=[dom]):
        res = bpy.ops.fluid.bake_all()
    say('BAKED', res)
if gridstats() <= 0.0:
    say('EMPTY SIMULATION: nothing to render')
    sys.exit(3)
if os.environ.get('FX_ONLYBAKE') == '1':
    sys.exit(0)
sc.frame_start = F0
sc.frame_end = F0 + N - 1
if FIRE:
    # A: the fire's light alone, on black, no sun, nothing transparent
    r.film_transparent = False
    sun.energy = 0.0
    r.filepath = os.path.join(OUT, 'a_')
    bpy.ops.render.render(animation=True)
    say('RENDERED A', KIND, N)
    ms.inputs[1].default_value = 0.0
# B: the smoke alone on a transparent film, lit by the sun
r.film_transparent = True
sun.energy = 3.2
r.filepath = os.path.join(OUT, 'b_')
bpy.ops.render.render(animation=True)
say('RENDERED B', KIND, N, 'frames to', OUT)
