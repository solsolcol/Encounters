"""v29.0 (E5C1 THINGS-3, R13) · w51candle: a plain white taper candle in a small brass holder, made in code (in place of
w3candlesmall, episode 4 chapter 3's pink Wai Kru candle: the plan's props note, "a white candle would read better at a
home rite"). 0.24 m to its wick's tip as the old one, so the chapter's flame (its sprite at the top + 0.255) sits on it.
The wax ivory, its top a little melted with one run of wax down its side, the wick charred; the holder a turned brass
dish with a cup, worn a little.     $BPY masters/v29.0/props/code/candle.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(512)
br = brass('brass', tone='#b8914e', worn=0.45)
wax = M('wax'); co = wax.coord('Object')
n1 = wax.noise(co, 180, detail=4); n2 = wax.noise(co, 22, detail=3)
wax.col = wax.mix(wax.math('MULTIPLY', n2, 0.5), '#efe9dc', '#ddd3bf')
wax.rough = wax.math('ADD', 0.42, wax.math('MULTIPLY', n1, 0.12)); wax.height = n1; wax.bump_strength = 0.05
wax = proc(wax)
wk = M('wick'); wk.col = wk.ramp(wk.noise(wk.coord('Object'), 400), [(0.0, '#16120e'), (1.0, '#3a322a')]); wk.rough = wk.val(0.9); wk = proc(wk)

parts = []
# the holder: a dish with a rolled rim, a short stem and a cup
parts.append(lathe('holder', [(0.0, 0.0), (0.024, 0.0), (0.0285, 0.0015), (0.0295, 0.004), (0.0285, 0.0062), (0.026, 0.0058),
                              (0.020, 0.0048), (0.010, 0.0062), (0.0075, 0.009), (0.0072, 0.012), (0.0105, 0.0135),
                              (0.0135, 0.016), (0.0140, 0.026), (0.0128, 0.0266), (0.0118, 0.0185), (0.0, 0.0185)], n=64, mat=br))
# the candle: a slight taper, its top melted into a shallow cup with a soft rim
R0, Z0, Z1 = 0.0112, 0.0185, 0.226
parts.append(lathe('candle', [(0.0, Z0), (R0, Z0), (R0 - 0.0002, Z0 + 0.1), (R0 - 0.0006, Z1 - 0.004), (R0 - 0.0010, Z1 - 0.0005),
                              (R0 - 0.0022, Z1), (R0 - 0.0040, Z1 - 0.0012), (0.004, Z1 - 0.0030), (0.0, Z1 - 0.0034)], n=48, mat=wax))
# one run of wax from the rim down the side (a squashed teardrop laid on the wall)
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=12, radius=1.0)
for v in bm.verts:
    x, y, z = v.co
    t = (z + 1) / 2                                    # 0 at the bottom of the run, 1 at the rim
    w = 0.0016 * (0.55 + 0.45 * t) + 0.0006 * math.exp(-((t - 0.05) / 0.06) ** 2)
    v.co = Vector((x * w, y * 0.0011, -0.025 + t * 0.026))
run = mesh_from_bm('run', bm); run.data.materials.append(wax); smooth(run, 80)
run.location = (0.0, -(R0 - 0.0006), Z1 - 0.003); parts.append(run)
# the wick: a charred thread, bent a little at its tip
parts.append(tube_path('wick', [(0, 0, Z1 - 0.0035), (0, 0, Z1 + 0.006), (0.0008, 0, Z1 + 0.011), (0.0022, 0, Z1 + 0.0135)], 0.0006, n=8, mat=wk))

ob = join(parts, 'candle')
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='candle')
export([ob], OUT)
