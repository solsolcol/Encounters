import json, re, math, sys
import os
# (v26.2: kept beside its inputs; run from anywhere: python3 -I masters/v26.2/trees/solve.py)
S = os.path.dirname(os.path.abspath(__file__)) + '/'
# ---- tree profiles (reach / h by height / h), from tools/probes/treeprofile.mjs
prof = {}
for block in open(S + 'profiles.txt').read().strip().split('\n\n'):
    lines = block.strip().split('\n'); key = lines[0].split(':')[0]
    rows = []
    for L in lines[2:]:
        a = L.split(); y0, y1 = map(float, a[0].split('-')); rows.append((y0, y1, float(a[1]), float(a[2])))
    prof[key] = rows
def slices(key, h, centre=False):
    # (y0, y1, reach) in metres; the trunk's lowest slices (roots, flare at the ground) are kept: they only meet low things
    return [(y0 * h, y1 * h, (rc if centre else ro) * h) for (y0, y1, ro, rc) in prof[key]]
# ---- obstacles: everything the scan saw that is not a tree, a person, a flag or a string
d = json.load(open(S + 'obstacles.json'))
TREEKEYS = ('e4raintree', 'e4mango', 'e4palm', 'e4banana', 'w3banana2', 'w3frangipani')
obst = []
for o in d['objs']:
    L = o['label']; mn, mx = o['min'], o['max']
    if 'person' in L or L.startswith('line'): continue
    if any(('stock:' + k) in L for k in TREEKEYS): continue
    if L.lstrip().startswith('#') and (mx[1] - mn[1]) < 1.0: continue          # a flag
    if L.startswith('output_unwrapped') and (mx[0] - mn[0]) > 6 and (mx[1] - mn[1]) > 8: continue   # one of the four standing trees (big model boxes)
    if mx[1] < 0.25: continue
    obst.append((mn, mx, L[:40]))
# the standing trees' model boxes are recognised by size above; drop them explicitly too
print(len(obst), 'obstacles')
# the power lines: three wires, sagging, from (15, -24) to (-20, 17)
wires = []
for dy in (0, 0.35, 0.7):
    a, b = (15, 7.6 + dy, -24), (-20, 7.2 + dy, 17)
    for i in range(0, 65):
        k = i / 64; wires.append((a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - math.sin(k * math.pi) * 0.9, a[2] + (b[2] - a[2]) * k))
poles = [((15, 0, -24), 8.6), ((-20, 0, 17), 8.2)]
def d2box(x, z, mn, mx):
    dx = max(mn[0] - x, 0, x - mx[0]); dz = max(mn[2] - z, 0, z - mx[2]); return math.hypot(dx, dz)
MO, MT = 0.3, 0.2
def clash_obst(x, z, sl, skip=()):
    worst = 0; rmax = max(r for (_, _, r) in sl)
    for (mn, mx, L) in obst:
        if L in skip: continue
        if d2box(x, z, mn, mx) > rmax + MO: continue
        for (y0, y1, r) in sl:
            if y1 < mn[1] or y0 > mx[1]: continue
            g = d2box(x, z, mn, mx) - r - MO
            if g < worst: worst = g
    for (wx, wy, wz) in wires:
        if math.hypot(wx - x, wz - z) > rmax + MO: continue
        for (y0, y1, r) in sl:
            if y0 <= wy <= y1:
                g = math.hypot(wx - x, wz - z) - r - MO
                if g < worst: worst = g
    for ((px, _, pz), ph) in poles:
        for (y0, y1, r) in sl:
            if y0 <= ph: g = math.hypot(px - x, pz - z) - r - 0.14 - MO; worst = min(worst, g)
    return worst
def clash_tree(x, z, sl, others):
    worst = 0
    rmax = max(r for (_, _, r) in sl)
    for (ox, oz, osl) in others:
        D = math.hypot(ox - x, oz - z)
        if D > rmax + max(r for (_, _, r) in osl) + MT: continue
        for (y0, y1, r) in sl:
            for (a0, a1, r2) in osl:
                if a1 < y0 or a0 > y1: continue
                g = D - r - r2 - MT
                if g < worst: worst = g
    return worst
# ---- the trees: (name, key, x, z, h, centre?) the four standing ones first, then the groves, biggest first
TREES = [('west raintree', 'e4raintreehd', -15.5, 3, 13.5, True), ('mango behind canopy', 'e4mangohd', 8.6, 12.6, 9.5, True),
         ('NE raintree', 'e4raintreehd', 10.5, -16, 10.5, True), ('SW mango', 'e4mango', -13.5, 15.5, 8.5, True)]
GROVES = {
  'e4palm1': [[-23, -12, 13], [-27, 4, 14.5], [26, -3, 14], [0, 24.5, 14], [7, 27, 13]],
  'e4palm1far': [[-35, -4, 15], [-8, -36, 14], [13, -33, 12], [-28, 28, 13], [-31, 13, 12]],
  'e4palm2': [[-18, -19, 12.5], [27, -12, 13.5], [25, 8, 12.5], [16, 19, 12], [-6, 28, 12.5]],
  'e4palm2far': [[-29, -18, 13.5], [6, -38, 13], [-16, 31, 12.5]],
  'e4banana': [[-19, -3, 4.2], [-18.5, 9.5, 3.8], [-21, 12, 4.4], [-24, -6, 4.0], [17, -11, 4.0], [14.5, 16, 4.0], [-2, 22, 3.8], [-15, 20.5, 4.2]],
  'w3banana2': [[-20.5, 1.5, 3.6], [-22.5, 7, 3.4], [-26, -1, 3.8], [23.5, 3, 3.6], [3, 21.5, 3.4], [-26.5, 19.5, 3.8]],
  'e4raintree': [[-38, 8, 12], [-24, -27, 11], [19, -40, 12], [33, 2, 13], [-3, 36, 12]],
  'e4mango': [[-33, 22, 9], [-2, -42, 10], [22, -22, 9.5], [22, 24, 9]],
  'w3frangipani': [[-9.2, 17.6, 4.4], [11.6, 17.4, 4.6], [14.4, -9.6, 4.2]] }
# the play ground and the films' ground: no trunk on it
KEEP = (-11.3, 11.3, -10.3, 12.9)
def on_ground(x, z, r0):
    return KEEP[0] - r0 < x < KEEP[1] + r0 and KEEP[2] - r0 < z < KEEP[3] + r0
items = [(n, k, x, z, h, c) for (n, k, x, z, h, c) in TREES]
for k, L in GROVES.items():
    for i, (x, z, h) in enumerate(L): items.append(('%s#%d' % (k, i), k, x, z, h, False))
# frangipani and banana2 have no profile from the file list above unless measured: fall back on banana's shape
for k in ('w3banana2', 'w3frangipani'):
    if k not in prof: prof[k] = prof['e4banana']
order = sorted(range(len(items)), key=lambda i: (0 if i < 4 else 1, -max(r for (_, _, r) in slices(items[i][1], items[i][4]))))
placed = {}
def solve_one(i, others):
    n, k, x0, z0, h, c = items[i]; sl = slices(k, h, c); sl_hi = [s for s in sl if s[0] > 0.3]   # (the root flare under 0.3 m only meets the ground's low things)
    best = None
    for rad in [0] + [0.25 * j for j in range(1, 121)]:
        steps = 1 if rad == 0 else max(8, int(2 * math.pi * rad / 0.35))
        for s in range(steps):
            a = 2 * math.pi * s / steps; x, z = x0 + rad * math.cos(a), z0 + rad * math.sin(a)
            if math.hypot(x, z) > 44: continue
            if on_ground(x, z, sl[3][2]): continue
            if clash_obst(x, z, sl_hi) < 0: continue
            if clash_tree(x, z, sl_hi, others) < 0: continue
            return (x, z, rad)
    return None
for p in range(2):
    for i in order:
        others = [(placed[j][0], placed[j][1], [s for s in slices(items[j][1], items[j][4], items[j][5]) if s[0] > 0.3]) for j in placed if j != i]
        r = solve_one(i, others)
        if r: placed[i] = r
        else: print('NO PLACE for', items[i][0])
for i in range(len(items)):
    n, k, x0, z0, h, c = items[i]
    if i in placed:
        x, z, rad = placed[i]; print('%-22s %-13s (%6.1f,%6.1f) -> (%6.2f,%6.2f) moved %.2f' % (n, k, x0, z0, x, z, math.hypot(x - x0, z - z0)))
json.dump({items[i][0]: placed[i] for i in placed}, open(S + 'placed.json', 'w'), indent=1)
