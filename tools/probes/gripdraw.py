# v28.0 (E4C5, R25/R26): HIS GRIP DRAWN FROM tools/probes/gripsolve.mjs's JSON, so the solve is SEEN with no browser: every
# skin point his right hand and its fingers carry, coloured by finger, (1) down the shaft's own line (the shaft a circle,
# its radius 3.6 cm: the fingers should close round it, nothing inside it), (2) from the back of his hand (the shaft a band),
# (3) from his thumb's side. 1200 px a view, 0.4 mm a pixel, the hand's own frame. Lists each finger's points inside.
#   python3 -I tools/probes/gripdraw.py <gripsolve.json> <out.png>
import sys, json, math
from PIL import Image, ImageDraw
d = json.load(open(sys.argv[1])); out = sys.argv[2]
A = d['A']; C = d['C']; fL = d['fL']; nL = d['nL']; s = d['s']
def sub(a, b): return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
def dot(a, b): return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def nrm(a): l = math.sqrt(dot(a, a)) or 1; return [x/l for x in a]
def addm(a, b, k): return [a[0]+b[0]*k, a[1]+b[1]*k, a[2]+b[2]*k]
x3 = nrm(addm(fL, A, -dot(fL, A))); y3 = nrm(cross(A, x3))
if dot(y3, nL) > 0: y3 = [-v for v in y3]                                       # (up the picture: the back of his hand)
COL = {'Palm': (200, 160, 140), 'Thumb': (230, 60, 60), 'Index': (60, 160, 230), 'Middle': (80, 200, 90), 'Ring': (230, 200, 40), 'Pinky': (190, 90, 220)}
W, H, PX = 1200, 1200, 0.0004 / s                                               # (0.4 mm a pixel, in the hand's units)
views = [('down the shaft (fingers to the right, the back of his hand up)', x3, y3, True),
         ('the back of his hand (fingers to the right, his thumb up)', x3, A, False),
         ('his thumb’s side (fingers to the right, the back of his hand up)', fL, [-v for v in nL], False)]
img = Image.new('RGB', (W * 3 + 40, H + 60), (16, 16, 20)); dr = ImageDraw.Draw(img)
for vi, (title, ax, ay, circle) in enumerate(views):
    ox = vi * (W + 20); cx, cy = ox + W // 2, H // 2 + 50
    dr.text((ox + 10, 10), title, fill=(230, 230, 230))
    R = 0.036 / s / PX
    if circle: dr.ellipse((cx - R, cy - R, cx + R, cy + R), outline=(255, 140, 40), width=3)
    else:
        # the shaft as a band: its line through C projected, its radius either side
        a2 = (dot(A, ax), dot(A, ay)); L = math.hypot(*a2)
        if L > 1e-6:
            u = (a2[0] / L, a2[1] / L); n2 = (-u[1], u[0])
            for sgn in (-1, 1):
                p0 = (cx + (-u[0] * 0.2 / s / PX) + n2[0] * R * sgn, cy - ((-u[1] * 0.2 / s / PX) + n2[1] * R * sgn))
                p1 = (cx + (u[0] * 0.2 / s / PX) + n2[0] * R * sgn, cy - ((u[1] * 0.2 / s / PX) + n2[1] * R * sgn))
                dr.line([p0, p1], fill=(255, 140, 40), width=3)
    # back to front: the farther points first (depth along the view's own third axis)
    az = nrm(cross(ax, ay)); pts = sorted(d['skin'], key=lambda p: dot(sub(p[1:4], C), az))
    for p in pts:
        r = sub(p[1:4], C); X = cx + dot(r, ax) / PX; Y = cy - dot(r, ay) / PX
        c = COL.get(p[0], (255, 255, 255))
        if p[4] < -0.3: c = (255, 255, 255)                                         # (inside the shaft: white)
        dr.ellipse((X - 2, Y - 2, X + 2, Y + 2), fill=c)
    dr.text((ox + 10, H + 30), '  '.join(f"{k} {v['inside']}/{v['n']} in, {v['deepCm']:.1f} cm" for k, v in d['per'].items()), fill=(220, 220, 220))
img.save(out); print(out, img.size)
