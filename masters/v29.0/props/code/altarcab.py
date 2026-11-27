"""v29.0 (E5C1 THINGS-3, R13) · w51altarcab2: his altar cabinet, made in code (Meshy's w51altarcab came back with its back
panel's top torn into slivers, a dark smear and a red mahogany wood). A home Buddhist altar cabinet of a modern flat:
dark walnut-brown wood (no red: plan 4.5, red is the spell's alone), 0.90 wide, 0.61 deep, its top a flat board at 1.00 m
across its whole depth (where b_world.js stands the Buddha, the photograph, the candle, the jasmine, the bottle and the
glass: HIS.altar.top 1.0), a low raised back ledge; under the top a row of two drawers, then two doors of frame and
sunk panel with small brass knobs; a recessed plinth. Front toward Blender -Y (the game's +z).
    $BPY masters/v29.0/props/code/altarcab.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 2048
reset(511)
W, D, TOP = 0.90, 0.61, 1.00
wh = wood('walnut_h', dark='#2a190f', mid='#3f2717', light='#573823', grain=26, axis='X', gloss=0.32)
wv = wood('walnut_v', dark='#2a190f', mid='#3f2717', light='#573823', grain=26, axis='Z', gloss=0.32)
wd = wood('walnut_d', dark='#2a190f', mid='#3f2717', light='#573823', grain=26, axis='Y', gloss=0.34)
br = brass('brass', tone='#b38d4c', worn=0.4)
# the inside of a drawer gap / door gap: a dark shadow wood, unbaked detail is not seen
dark = M('gapdark'); dark.col = dark.rgb('#0c0805'); dark.rough = dark.val(0.9); dark = proc(dark)

parts = []
# the plinth, set back 2.5 cm on the front and the sides, 7 cm tall
parts.append(box('plinth', W - 0.05, D - 0.04, 0.07, at=(0, 0.01, 0.035), bev=0.002, mat=wh))
# the carcass (its sides, back and bottom as one block a hair inside the faces laid on it)
cz0, cz1 = 0.07, TOP - 0.035
parts.append(box('carcass', W - 0.004, D - 0.03, cz1 - cz0, at=(0, 0.013, (cz0 + cz1) / 2), bev=0.002, mat=wv))
# the side panels proud of the carcass, the grain running up
for sx in (-1, 1):
    parts.append(box('side', 0.02, D - 0.02, cz1 - cz0 + 0.004, at=(sx * (W / 2 - 0.01), 0.01, (cz0 + cz1) / 2), bev=0.003, mat=wv))
# the top: one thick board, its front and side edges eased round
parts.append(box('top', W, D, 0.035, at=(0, 0, TOP - 0.0175), bev=0.006, segs=4, mat=wh))
# the low back ledge on the top (a thing set at the back leans on it) and two small returns at its ends
parts.append(box('ledge', W - 0.02, 0.022, 0.055, at=(0, D / 2 - 0.016, TOP + 0.0275), bev=0.004, segs=3, mat=wh))
for sx in (-1, 1):
    parts.append(box('ledgeend', 0.022, 0.12, 0.04, at=(sx * (W / 2 - 0.021), D / 2 - 0.075, TOP + 0.02), bev=0.004, segs=3, mat=wd))
# the face: rails between drawers and doors (a front frame), the drawers, the doors
fy = -D / 2 + 0.0125          # the front plane (the carcass's front at -D/2 + 0.028)
inner = W - 0.04
parts.append(box('rail_top', inner, 0.022, 0.03, at=(0, fy + 0.008, cz1 - 0.015), bev=0.002, mat=wh))
dz0, dz1 = cz1 - 0.03 - 0.13, cz1 - 0.03      # the drawers' row
parts.append(box('rail_mid', inner, 0.022, 0.025, at=(0, fy + 0.008, dz0 - 0.0125), bev=0.002, mat=wh))
parts.append(box('rail_bot', inner, 0.022, 0.035, at=(0, fy + 0.008, cz0 + 0.0175), bev=0.002, mat=wh))
parts.append(box('muntin', 0.03, 0.022, dz1 - (cz0 + 0.035), at=(0, fy + 0.008, (dz1 + cz0 + 0.035) / 2), bev=0.002, mat=wv))
gap = 0.003
for sx in (-1, 1):
    # a drawer front, slightly proud, eased edges, a brass knob
    dw = inner / 2 - 0.015 - gap
    x = sx * (0.015 + gap / 2 + dw / 2)
    parts.append(box('drawer', dw, 0.02, (dz1 - dz0) - 2 * gap, at=(x, fy - 0.004, (dz0 + dz1) / 2), bev=0.004, segs=3, mat=wh))
    parts.append(cyl('dknob_stem', 0.005, 0.012, at=(x, fy - 0.014, (dz0 + dz1) / 2), n=24, mat=br, bev=0))
    parts[-1].rotation_euler = (math.radians(90), 0, 0)
    k = lathe('dknob', [(0.0, 0.0), (0.006, 0.0), (0.009, 0.004), (0.0105, 0.010), (0.009, 0.015), (0.004, 0.0175), (0.0, 0.018)], n=40, mat=br)
    k.rotation_euler = (math.radians(90), 0, 0); k.location = (x, fy - 0.024, (dz0 + dz1) / 2); parts.append(k)
    # a door: stiles and rails round a sunk raised panel
    oz0, oz1 = cz0 + 0.035 + gap, dz0 - 0.025 - gap
    ow = inner / 2 - 0.015 - gap
    ox = sx * (0.015 + gap / 2 + ow / 2)
    st = 0.06
    for e in (-1, 1):
        parts.append(box('stile', st, 0.022, oz1 - oz0, at=(ox + e * (ow / 2 - st / 2), fy - 0.005, (oz0 + oz1) / 2), bev=0.003, segs=3, mat=wv))
    for zc in (oz0 + st / 2, oz1 - st / 2):
        parts.append(box('rail', ow - 2 * st + 0.002, 0.022, st, at=(ox, fy - 0.005, zc), bev=0.003, segs=3, mat=wh))
    # the panel: sunk 7 mm, its edge bevelled wide as a fielded panel
    pw, ph = ow - 2 * st + 0.004, (oz1 - oz0) - 2 * st + 0.004
    pn = box('panel', pw, 0.014, ph, at=(ox, fy + 0.001, (oz0 + oz1) / 2), bev=0.0, mat=wv)
    bevel(pn, 0.022, segs=2); apply_mods(pn); parts.append(pn)
    # the dark behind the panel's sunk edge
    parts.append(box('panelback', pw + 0.004, 0.004, ph + 0.004, at=(ox, fy + 0.009, (oz0 + oz1) / 2), bev=0, mat=dark))
    # the knob near the meeting stiles, at the middle of the door's height
    kx = ox - sx * (ow / 2 - st / 2)
    kz = (oz0 + oz1) / 2 + 0.06
    k = lathe('knob', [(0.0, 0.0), (0.006, 0.0), (0.009, 0.004), (0.0105, 0.010), (0.009, 0.015), (0.004, 0.0175), (0.0, 0.018)], n=40, mat=br)
    k.rotation_euler = (math.radians(90), 0, 0); k.location = (kx, fy - 0.016, kz); parts.append(k)
# the gaps' dark behind the faces (so a door's edge reads as a door)
parts.append(box('facegap', inner - 0.004, 0.004, dz1 - cz0 - 0.04, at=(0, fy + 0.019, (dz1 + cz0 + 0.035) / 2), bev=0, mat=dark))

ob = join(parts, 'altarcab')
stats(ob)
uv_all(ob, margin=0.003)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='altarcab')
export([ob], OUT)
