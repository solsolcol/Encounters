"""v26.0 · AN ARMPIT CUT ACROSS (Grandmaster Pho's right armpit, 12 Nov 2026). Reads tools/probes/armdump.mjs's JSON and
draws the surface where planes square to the upper arm cut it, one picture per plane: each cut segment coloured by the
share of the arm's bones at its ends (red the arm, blue the body, purple between), on a grid of centimetres; the arm's
own line is the cross at the middle. A clean armpit is two closed outlines (the arm's ring and the chest's side) and the
skin between them; a fin is a loose line hanging off one of them.
   python3 -I tools/probes/armslice.py <dump.json> <outPrefix> [s0,s1,... metres along the arm from its joint] [--half=0.11] [--px=1100]"""
import json, math, sys
from PIL import Image, ImageDraw
args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
D = json.load(open(args[0])); OUT = args[1]
SS = [float(x) for x in (args[2] if len(args) > 2 else '-0.02,0.0,0.02,0.04,0.06,0.08,0.10').split(',')]
HALF = float(opt.get('half', 0.11)); PX = int(opt.get('px', 1100))
J = D['joint']; E = D['elbow']; S1 = D.get('spine2') or D.get('spine1')
sub = lambda a, b: [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
dot = lambda a, b: a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def nrm(a):
    l = math.sqrt(dot(a, a)) or 1.0
    return [a[0] / l, a[1] / l, a[2] / l]
def cross(a, b): return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
ax = nrm(sub(E, J))
# v: from the arm's line toward his chest's middle (Spine2), square to the arm; u: v x ax (his front or back)
c = sub(S1, J); c = [c[k] - dot(c, ax) * ax[k] for k in range(3)]; v = nrm(c); u = nrm(cross(v, ax))
tris = [t for p in D['parts'] for t in p['tris']]
for s in SS:
    p0 = [J[k] + s * ax[k] for k in range(3)]
    im = Image.new('RGB', (PX, PX), (250, 250, 248)); dr = ImageDraw.Draw(im)
    sc = PX / (2 * HALF)
    to = lambda q: (PX / 2 + dot(sub(q, p0), u) * sc, PX / 2 - dot(sub(q, p0), v) * sc)
    for cm in range(-int(HALF * 100), int(HALF * 100) + 1):
        x = PX / 2 + cm / 100 * sc; col = (205, 205, 205) if cm % 5 else (160, 160, 160)
        dr.line([(x, 0), (x, PX)], fill=col, width=1); dr.line([(0, x), (PX, x)], fill=col, width=1)
    n = 0
    for _, q in tris:
        d = [dot(sub(pt[:3], p0), ax) for pt in q]
        pts = []
        for i in range(3):
            a, b = q[i], q[(i + 1) % 3]; da, db = d[i], d[(i + 1) % 3]
            if (da < 0) != (db < 0):
                f = da / (da - db); pts.append(([a[k] + f * (b[k] - a[k]) for k in range(3)], a[3] + f * (b[3] - a[3])))
        if len(pts) == 2:
            w = (pts[0][1] + pts[1][1]) / 2
            col = (int(40 + 200 * w), 40, int(40 + 200 * (1 - w)))
            dr.line([to(pts[0][0]), to(pts[1][0])], fill=col, width=3); n += 1
    dr.line([(PX / 2 - 12, PX / 2), (PX / 2 + 12, PX / 2)], fill=(0, 0, 0), width=2); dr.line([(PX / 2, PX / 2 - 12), (PX / 2, PX / 2 + 12)], fill=(0, 0, 0), width=2)
    dr.text((10, 10), '%s @%s  %+.2f m along the upper arm; up = toward his chest middle, right = u; %d segments; grid 1 cm' % (D['take'], D['t'], s, n), fill=(0, 0, 0))
    im.save('%s%+.2f.png' % (OUT, s)); print('%s%+.2f.png' % (OUT, s), n)
