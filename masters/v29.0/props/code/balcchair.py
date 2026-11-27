"""v29.0 (E5C1 THINGS-3, R13) · w51bchair: his balcony chair, made in code to its checked reference picture
(refs/balcchair.png, gpt-image-2.6-sunburst, generation 6C1OaAsS1xAUsJjMehVL: square tubes and slats, simple enough for
code; no Meshy credits). In place of w3pchair on his balcony (the coffee shop's stacked plastic chairs keep w3pchair). A
condominium balcony armchair: a powder-coated charcoal aluminium frame of square tube (four straight legs, the arms
running back into the back posts, the back leaning a little), seat and back of horizontal slats of weathered teak gone
silver-grey. 0.80 m tall as the old one. Front toward Blender -Y.   $BPY masters/v29.0/props/code/balcchair.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(517)
alu = M('powdercoat'); co = alu.coord('Object')
sp = alu.noise(co, 700, detail=3); wear = alu.noise(co, 8, detail=4)
alu.col = alu.mix(alu.math('MULTIPLY', wear, 0.35), '#3b3c3e', '#4a4b4c')
alu.rough = alu.math('ADD', 0.5, alu.math('MULTIPLY', sp, 0.15)); alu.height = sp; alu.bump_strength = 0.06; alu.bump_dist = 0.0004
alu = proc(alu)
teak = wood('teakgrey', dark='#625a4f', mid='#80776a', light='#9c9384', grain=30, axis='X', gloss=0.7, bump=0.08)

T = 0.028                       # the frame's square tube
W, D = 0.56, 0.54               # outside width and depth
SEAT, ARM, TOP = 0.425, 0.63, 0.80
LEAN = math.radians(8)
parts = []
xs = (-W / 2 + T / 2, W / 2 - T / 2)
fy, by = -D / 2 + T / 2, D / 2 - T / 2           # front and back leg centres (y)
for x in xs:
    # the front leg, up to the arm
    parts.append(beam('fleg', (x, fy, 0.005), (x, fy, ARM - T / 2), T, mat=alu))
    # the back leg straight up to the seat, then the back post leaning back to the top
    parts.append(beam('bleg', (x, by - 0.02, 0.005), (x, by - 0.02, SEAT), T, mat=alu))
    top = (x, by - 0.02 + math.tan(LEAN) * (TOP - SEAT - T / 2), TOP - T / 2)
    parts.append(beam('bpost', (x, by - 0.02, SEAT - T / 2), top, T, mat=alu))
    # the arm: from over the front leg back into the back post
    ay = by - 0.02 + math.tan(LEAN) * (ARM - SEAT)
    parts.append(beam('arm', (x, fy - T / 2 - 0.002, ARM - T / 2 + 0.002), (x, ay, ARM - T / 2 + 0.002), T + 0.004, mat=alu))   # (a cap a little wider than the tubes: no shared face)
    # the side seat rail
    parts.append(beam('srail', (x, fy, SEAT - 0.035), (x, by - 0.02, SEAT - 0.035), 0.04, T - 0.006, mat=alu))
# the front and back seat rails
parts.append(beam('frail', (xs[0], fy, SEAT - 0.035), (xs[1], fy, SEAT - 0.035), 0.04, T - 0.006, mat=alu))
parts.append(beam('brail', (xs[0], by - 0.02, SEAT - 0.035), (xs[1], by - 0.02, SEAT - 0.035), 0.04, T - 0.006, mat=alu))
# the back's top rail between the posts
tz = TOP - T / 2; ty = by - 0.02 + math.tan(LEAN) * (TOP - SEAT - T / 2)
parts.append(beam('trail', (xs[0], ty, tz), (xs[1], ty, tz), T - 0.004, T - 0.006, mat=alu))
# the seat slats: six across, a gap between, laid on the rails
n, gap = 6, 0.009
inner_d = (by - 0.02) - fy + 0.03
sw = (inner_d - (n - 1) * gap) / n
for i in range(n):
    y = fy - 0.015 + sw / 2 + i * (sw + gap)
    parts.append(beam('sslat', (xs[0] + 0.004, y, SEAT - 0.006), (xs[1] - 0.004, y, SEAT - 0.006), 0.018, sw, bev=0.003, segs=3, mat=teak))
# the back slats: five, held between the posts, leaning with them
nb, bg = 5, 0.012
z0, z1 = SEAT + 0.07, TOP - T - 0.008
bw = ((z1 - z0) - (nb - 1) * bg) / nb
for i in range(nb):
    zc = z0 + bw / 2 + i * (bw + bg)
    yc = by - 0.02 + math.tan(LEAN) * (zc - SEAT) - 0.004
    s = beam('bslat', (xs[0] + T / 2, yc, zc), (xs[1] - T / 2, yc, zc), bw, 0.016, bev=0.003, segs=3, mat=teak)
    # lean the slat with the posts
    for v in s.data.vertices:
        dz = v.co.z - zc; v.co.y += math.tan(LEAN) * dz
    parts.append(s)
# small grey feet caps
for x in xs:
    for y in (fy, by - 0.02):
        parts.append(box('foot', T + 0.002, T + 0.002, 0.008, at=(x, y, 0.004), bev=0.002, mat=alu))

ob = join(parts, 'balcchair')
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='balcchair')
export([ob], OUT)
