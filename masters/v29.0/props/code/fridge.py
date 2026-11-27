"""v29.0 (E5C1 THINGS-3, R13) · w51fridge: the fridge in her kitchenette, made in code (in place of w4fridge, Amma's in
episode 4 chapter 4). 0.76 x 0.76, 1.70 tall as the old one. An older two-door fridge, freezer on top: off-white enamel a
little yellowed, rounded door edges proud of the cabinet with the grey gasket's line between, recessed pull handles
of brushed grey plastic down each door's left edge, a toe grille at the foot, two plain round magnets (sage and
navy) on the fridge door holding a blank folded paper. No brand, no words (v9.3). Front toward Blender -Y.
    $BPY masters/v29.0/props/code/fridge.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(516)
W, D, H = 0.76, 0.70, 1.70           # the cabinet (the doors bring the depth to 0.76)
def enamel(name, base='#ece7da', grime='#d7cfbd'):
    m = M(name); co = m.coord('Object')
    n = m.noise(co, 3.0, detail=4); spec = m.noise(co, 900, detail=2)
    vert = m.noise(m.mapping(co, scale=(6, 6, 0.4)), 4, detail=3)          # a faint streak of wiped grime running down
    m.col = m.mix(m.math('ADD', m.math('MULTIPLY', n, 0.35), m.math('MULTIPLY', vert, 0.25)), base, grime)
    m.rough = m.math('ADD', 0.22, m.math('MULTIPLY', n, 0.18)); m.height = spec; m.bump_strength = 0.02
    return proc(m)
cab = enamel('cabinet', '#e6e1d4', '#cfc6b2')
door = enamel('doors', '#ece7da', '#d6ceba')
gas = M('gasket'); gas.col = gas.rgb('#8c8a85'); gas.rough = gas.val(0.75); gas = proc(gas)
plast = M('handle'); co = plast.coord('Object'); bru = plast.noise(plast.mapping(co, scale=(30, 30, 0.5)), 80, detail=3)
plast.col = plast.mix(plast.math('MULTIPLY', bru, 0.3), '#a7a7a3', '#8d8d89'); plast.rough = plast.math('ADD', 0.35, plast.math('MULTIPLY', bru, 0.15)); plast.height = bru; plast.bump_strength = 0.05
plast = proc(plast)
dark = M('grille'); dark.col = dark.rgb('#2a2a28'); dark.rough = dark.val(0.7); dark = proc(dark)
mag1 = M('magsage'); mag1.col = mag1.rgb('#8aa38a'); mag1.rough = mag1.val(0.3); mag1 = proc(mag1)
mag2 = M('magnavy'); mag2.col = mag2.rgb('#34465f'); mag2.rough = mag2.val(0.3); mag2 = proc(mag2)
paper = M('paper'); co = paper.coord('Object'); pn = paper.noise(co, 300, detail=4)
paper.col = paper.mix(paper.math('MULTIPLY', pn, 0.3), '#f1ecdf', '#ded6c3'); paper.rough = paper.val(0.9); paper.height = pn; paper.bump_strength = 0.1
paper = proc(paper)

parts = []
# the cabinet: its corners eased
parts.append(box('cabinet', W, D, H - 0.03, at=(0, 0.03, 0.03 + (H - 0.03) / 2), bev=0.012, segs=4, mat=cab))
# the toe: a recessed black grille strip
parts.append(box('toe', W - 0.04, D - 0.06, 0.04, at=(0, 0.04, 0.02), bev=0.003, mat=dark))
for i in range(14):
    parts.append(box('slot', 0.028, 0.004, 0.018, at=(-0.27 + i * 0.0415, -D / 2 + 0.028, 0.02), bev=0.001, segs=1, mat=cab))
# the doors: the freezer on top, the fridge below, each a slab with its edge rolled, a gasket line behind
FZ0, FZ1 = 1.17, H - 0.004
DZ0, DZ1 = 0.046, 1.155
fy = 0.03 - D / 2        # the doors' back face on the cabinet's front
for (z0, z1) in ((FZ0, FZ1), (DZ0, DZ1)):
    parts.append(box('door', W - 0.004, 0.055, z1 - z0, at=(0, fy - 0.0275 + 0.002, (z0 + z1) / 2), bev=0.016, segs=5, mat=door))
    parts.append(box('gasket', W - 0.03, 0.008, z1 - z0 - 0.02, at=(0, fy + 0.002, (z0 + z1) / 2), bev=0.003, mat=gas))
    # the recessed pull: a long grey grip set into the door's left edge (its pocket a darker shadow)
    hl = min(0.32, (z1 - z0) - 0.12)
    hz = z0 + 0.07 + hl / 2 if z0 > 1 else z1 - 0.10 - hl / 2
    parts.append(box('pocket', 0.03, 0.006, hl, at=(-W / 2 + 0.03, fy - 0.054, hz), bev=0.004, segs=2, mat=dark))
    parts.append(box('grip', 0.026, 0.02, hl - 0.01, at=(-W / 2 + 0.03, fy - 0.058, hz), bev=0.006, segs=3, mat=plast))
# the magnets and the folded paper on the fridge door
py = fy - 0.0558
pap = box('paper', 0.15, 0.0012, 0.20, at=(0.12, py - 0.001, 0.86), bev=0.0, mat=paper)
for v in pap.data.vertices:                                 # a soft curl at its free bottom corner and the fold line's ridge
    dx, dz = v.co.x, v.co.z
    v.co.y -= 0.004 * max(0.0, (-dz - 0.06) / 0.04) ** 2 * (0.5 + dx / 0.15)
    v.co.y -= 0.0015 * math.exp(-((dz - 0.0) / 0.004) ** 2)
sub = pap.modifiers.new('sub', 'SUBSURF'); sub.levels = 3; sub.subdivision_type = 'SIMPLE'; apply_mods(pap)
for v in pap.data.vertices:
    dx, dz = v.co.x, v.co.z
    v.co.y -= 0.005 * max(0.0, (-dz - 0.06) / 0.04) ** 2 * max(0.0, dx / 0.075 + 0.2)
parts.append(pap)
for (x, z, m_) in ((0.12, 0.955, mag1), (-0.02, 0.62, mag2)):
    mg = lathe('magnet', [(0.0, 0.0), (0.016, 0.0), (0.0175, 0.003), (0.016, 0.007), (0.010, 0.009), (0.0, 0.0095)], n=36, mat=m_)
    mg.rotation_euler = (math.radians(90), 0, 0); mg.location = (x, py - 0.002, z); parts.append(mg)

ob = join(parts, 'fridge')
stats(ob)
uv_all(ob, margin=0.003)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='fridge')
export([ob], OUT)
