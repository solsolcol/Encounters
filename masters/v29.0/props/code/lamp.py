"""v29.0 (E5C1 THINGS-3, R13) · w51lamp: her table lamp on the bookshelf, made in code (in place of w5tablelamp, episode
4 chapter 5's, Mr Koh's living room). 0.55 tall and 0.38 across its shade as the old one. A turned ceramic base of a
pale celadon crackle glaze, a brass collar and neck, a drum shade of oatmeal linen with its seams and a top ring, a
switch on the neck and the flex out of the back of the base.     $BPY masters/v29.0/props/code/lamp.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(515)
br = brass('brass', tone='#b18c4f', worn=0.35)
cer = M('celadon'); co = cer.coord('Object')
crack = cer.voronoi(cer.mapping(co, scale=(1, 1, 1.4)), 70, out='Distance', feature='DISTANCE_TO_EDGE')
cl = cer.math('LESS_THAN', crack, 0.012)
pool = cer.noise(co, 9, detail=3)
glaze = cer.mix(cer.math('MULTIPLY', pool, 0.6), '#b4c4a6', '#93a88a')
cer.col = cer.mix(cer.math('MULTIPLY', cl, 0.35), glaze, '#5d6a55')
cer.rough = cer.math('ADD', 0.16, cer.math('MULTIPLY', cl, 0.25)); cer.height = cer.math('SUBTRACT', 1, cl); cer.bump_strength = 0.06
cer = proc(cer)
lin = M('linen'); co = lin.coord('Object')
a = lin.wave(co, 120, dist=0.5, detail=1, kind='BANDS', axis='Z'); b = lin.wave(lin.mapping(co, scale=(1, 1, 1)), 120, dist=0.5, detail=1, kind='RINGS', axis='Z')
slub = lin.noise(lin.mapping(co, scale=(1, 1, 6)), 30, detail=6)
wv = lin.math('MULTIPLY', lin.math('ADD', a, b), 0.5)
lin.col = lin.mix(lin.math('MULTIPLY', wv, 0.18), '#ddd3bf', '#b6a98f')
lin.col = lin.mix(lin.math('MULTIPLY', slub, 0.2), lin.col, '#c8baa0')
lin.rough = lin.val(0.88); lin.height = lin.math('ADD', wv, lin.math('MULTIPLY', slub, 0.5)); lin.bump_strength = 0.3; lin.bump_dist = 0.0006
lin = proc(lin)
inner = M('shadeinner'); inner.col = inner.mix(inner.math('MULTIPLY', inner.noise(inner.coord('Object'), 60), 0.2), '#e7dfcf', '#d5cab4'); inner.rough = inner.val(0.9); inner = proc(inner)
flex = M('flex'); flex.col = flex.rgb('#3a3936'); flex.rough = flex.val(0.5); flex = proc(flex)

parts = []
# the base: a turned ginger-jar shape, foot to shoulder to a short neck
wd = wood('lampfoot', dark='#2a1a10', mid='#3a2618', light='#4f3622', grain=40, axis='Z', gloss=0.3, bump=0.1)
parts.append(lathe('foot', [(0.0, 0.0), (0.072, 0.0), (0.076, 0.004), (0.076, 0.014), (0.071, 0.019), (0.066, 0.022), (0.0, 0.022)], n=72, mat=wd))
parts.append(lathe('base', [(0.0, 0.0215), (0.052, 0.0215), (0.058, 0.026), (0.074, 0.050), (0.088, 0.090), (0.092, 0.125),
                            (0.087, 0.165), (0.072, 0.198), (0.050, 0.218), (0.030, 0.226), (0.026, 0.232), (0.024, 0.238),
                            (0.0, 0.238)], n=96, mat=cer))
# the brass: a collar on the neck, a short stem, the lamp holder, the harp's two arms to the shade's spider
parts.append(lathe('collar', [(0.0, 0.236), (0.030, 0.236), (0.031, 0.242), (0.022, 0.248), (0.011, 0.252), (0.0, 0.252)], n=48, mat=br))
parts.append(cyl('stem', 0.0065, 0.08, at=(0, 0, 0.250), n=24, mat=br, bev=0.0008))
parts.append(lathe('switchbox', [(0.0, 0.318), (0.016, 0.318), (0.017, 0.324), (0.016, 0.346), (0.013, 0.350), (0.0, 0.350)], n=40, mat=br))
k = box('switch', 0.008, 0.012, 0.006, at=(0.019, 0, 0.334), bev=0.001, mat=br); parts.append(k)
parts.append(lathe('holder', [(0.0, 0.350), (0.014, 0.350), (0.014, 0.392), (0.012, 0.396), (0.0, 0.396)], n=40, mat=br))
SH_B, SH_T, R = 0.33, 0.55, 0.168
for sx in (-1, 1):
    parts.append(tube_path('harp', [(0, 0, 0.350), (sx * 0.05, 0, 0.36), (sx * 0.055, 0, 0.46), (sx * 0.01, 0, 0.53), (0, 0, 0.535)], 0.0018, n=8, mat=br))
parts.append(lathe('finial', [(0.0, 0.531), (0.008, 0.531), (0.010, 0.537), (0.007, 0.546), (0.0, 0.549)], n=32, mat=br))
# the drum shade: an open linen tube with a rolled edge top and bottom, a slight taper, its inside paler
shade = lathe('shade', [(R, SH_B), (R - 0.004, SH_T - 0.012)], n=96, mat=lin)
sol = shade.modifiers.new('sol', 'SOLIDIFY'); sol.thickness = 0.002; sol.offset = 0; apply_mods(shade)
parts.append(shade)
ins = lathe('shadein', [(R - 0.0015, SH_B + 0.002), (R - 0.0055, SH_T - 0.014)], n=96, mat=inner)
for p in ins.data.polygons: p.flip() if False else None
ins.data.flip_normals(); parts.append(ins)
for z, r in ((SH_B, R + 0.0005), (SH_T - 0.012, R - 0.0035)):
    pts = [(r * math.cos(2 * math.pi * i / 96), r * math.sin(2 * math.pi * i / 96), z) for i in range(96)]
    parts.append(tube_path('roll', pts, 0.0022, n=10, mat=lin, closed=True))
# the shade's spider ring at its top and its three spokes to the finial's washer
pts = [((R - 0.006) * math.cos(2 * math.pi * i / 64), (R - 0.006) * math.sin(2 * math.pi * i / 64), SH_T - 0.014) for i in range(64)]
parts.append(tube_path('ring', pts, 0.0012, n=6, mat=br, closed=True))
for i in range(3):
    a = 2 * math.pi * i / 3 + 0.3
    parts.append(tube_path('spoke', [(0.008 * math.cos(a), 0.008 * math.sin(a), 0.531), ((R - 0.006) * math.cos(a), (R - 0.006) * math.sin(a), SH_T - 0.014)], 0.0011, n=6, mat=br))
# the shade's one vertical seam, at its back
parts.append(box('seam', 0.006, 0.0015, SH_T - SH_B - 0.012, at=(0, R - 0.0015, (SH_B + SH_T - 0.012) / 2), bev=0.0005, segs=1, mat=lin))
# the flex: out of the back of the base, over the shelf's edge
parts.append(tube_path('flex', [(0, 0.07, 0.008), (0, 0.084, 0.0024), (0.006, 0.11, 0.0022), (0.018, 0.13, 0.0022), (0.012, 0.15, 0.0022), (0.0, 0.165, 0.0022)], 0.0022, n=8, mat=flex))

ob = join(parts, 'lamp')
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='lamp')
export([ob], OUT)
