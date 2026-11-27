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
paper.col = paper.mix(paper.math('MULTIPLY', pn, 0.3), '#efe2c4', '#d9c9a6'); paper.rough = paper.val(0.9); paper.height = pn; paper.bump_strength = 0.1
paper = proc(paper)

parts = []
# the cabinet: its corners eased
parts.append(box('cabinet', W, D, H - 0.03, at=(0, 0.03, 0.03 + (H - 0.03) / 2), bev=0.012, segs=4, mat=cab))
# the toe: a recessed black grille strip
parts.append(box('toe', W - 0.04, D - 0.06, 0.036, at=(0, 0.04, 0.022), bev=0.003, mat=dark))
for i in range(4):
    parts.append(box('louvre', W - 0.06, 0.006, 0.004, at=(0, -D / 2 + 0.03 + 0.004, 0.009 + i * 0.008), bev=0.0012, segs=1, mat=gas))
for (x, y) in ((-W / 2 + 0.05, -D / 2 + 0.06), (W / 2 - 0.05, -D / 2 + 0.06), (-W / 2 + 0.05, D / 2 - 0.02), (W / 2 - 0.05, D / 2 - 0.02)):
    parts.append(cyl('foot', 0.014, 0.012, at=(x, y, 0.0), n=20, mat=gas, bev=0.002))
# the doors: the freezer on top, the fridge below, each a slab with its edge rolled, a gasket line behind
FZ0, FZ1 = 1.17, H - 0.004
DZ0, DZ1 = 0.046, 1.155
fy = 0.03 - D / 2        # the doors' back face on the cabinet's front
for (z0, z1) in ((FZ0, FZ1), (DZ0, DZ1)):
    parts.append(box('door', W - 0.004, 0.055, z1 - z0, at=(0, fy - 0.0275 + 0.002, (z0 + z1) / 2), bev=0.016, segs=5, mat=door))
    parts.append(box('gasket', W - 0.03, 0.008, z1 - z0 - 0.02, at=(0, fy + 0.002, (z0 + z1) / 2), bev=0.003, mat=gas))
    # the handle: an off-white plastic C-grip down the door's left edge, standing 3 cm proud
    hl = min(0.30, (z1 - z0) - 0.14)
    hz = z0 + 0.08 + hl / 2 if z0 > 1 else z1 - 0.12 - hl / 2
    hx = -W / 2 + 0.035; hy = fy - 0.0535
    parts.append(tube_path('handle', [(hx, hy, hz - hl / 2), (hx, hy - 0.028, hz - hl / 2 + 0.025), (hx, hy - 0.032, hz),
                                      (hx, hy - 0.028, hz + hl / 2 - 0.025), (hx, hy, hz + hl / 2)], 0.0075, n=12, mat=plast))
    for e in (-1, 1):
        parts.append(box('hfoot', 0.022, 0.008, 0.03, at=(hx, hy - 0.002, hz + e * (hl / 2 - 0.004)), bev=0.003, segs=2, mat=plast))
# the hinge caps on the top and between the doors, at the right
for z in (H - 0.002, 1.162):
    parts.append(box('hingecap', 0.05, 0.05, 0.012, at=(W / 2 - 0.045, fy - 0.03, z + 0.004), bev=0.004, segs=2, mat=plast))
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
mag3 = M('magmustard'); mag3.col = mag3.rgb('#c9a03c'); mag3.rough = mag3.val(0.35); mag3 = proc(mag3)
card = M('postcard'); co = card.coord('Object'); sz_ = card.n.new('ShaderNodeSeparateXYZ'); card.l.new(co, sz_.inputs[0])
zc = card.math('SUBTRACT', sz_.outputs['Z'], 1.27)
skyband = card.ramp(card.math('ADD', card.math('MULTIPLY', zc, 9.0), 0.5), [(0.0, '#d9c9a3'), (0.36, '#c7b58c'), (0.40, '#3f7d8f'), (0.55, '#5f9fb0'), (0.62, '#a9cbd8'), (1.0, '#e4eef0')])
card.col = card.mix(card.math('MULTIPLY', card.noise(co, 80, detail=5), 0.25), skyband, '#ffffff', 'OVERLAY')
card.rough = card.val(0.5); card = proc(card)
pc = box('postcard', 0.14, 0.0012, 0.095, at=(-0.13, py - 0.001, 1.27 + 0.0), bev=0.0, mat=card, rot=(0, math.radians(-6), 0))
parts.append(pc)
for (x, z, m_) in ((0.12, 0.955, mag1), (-0.16, 1.312, mag2), (0.05, 0.70, mag3), (0.22, 1.42, mag1)):
    mg = lathe('magnet', [(0.0, 0.0), (0.016, 0.0), (0.0175, 0.003), (0.016, 0.007), (0.010, 0.009), (0.0, 0.0095)], n=36, mat=m_)
    mg.rotation_euler = (math.radians(90), 0, 0); mg.location = (x, py - 0.002, z); parts.append(mg)

ob = join(parts, 'fridge')
stats(ob)
uv_all(ob, margin=0.003)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='fridge')
export([ob], OUT)
