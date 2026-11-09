# v24.54 · GRANDMASTER PHO'S RIGHT ARM FREED FROM HIS SIDE, IN BLENDER. Chad, 8 Nov 2026: "Ok, install blender on your end"
# (option 2: "I install Blender here and redo his right armpit properly"). Runs on Blender's own Python (the bpy module):
#   python tools/armpit.py <region.json> <joins.json> <geometry.json>
#   (joins.json: tools/armfree.mjs's JOINDUMP, written by the same run that made the file region.json was dumped from)
# between `node tools/meshpatch.mjs dump` (which writes region.json: the points and triangles near his right shoulder joint)
# and `node tools/meshpatch.mjs apply` (which writes the change into the file, every other byte of it as it was).
# THE WHY (masters/v24.53/PLAN.md, measured again here): his scan hangs his right arm against his side, and joins the two
# by four pieces of triangles at the bottom of the crease between them — two folds across the armpit (the armpit itself:
# kept), a collar round the place his inner arm touched his side, and a small fold below it. Raised, the arm draws the
# collar and the small fold out as a sleeve and a patch of skin over the robe.
# WHAT THIS DOES, all in Blender's bmesh:
#   1. finds the joining triangles as tools/armfree.mjs does (a corner on the robe that rides the trunk, a corner of skin that
#      rides the arm) and their pieces;
#   2. takes out every piece whose rim is two loops (a tube: the collar) or whose nearest point is further than CUTFAR (0.15 m)
#      from the joint (the small fold), and any other triangle out there whose corners ride the arm and the trunk apart;
#   3. separates every point the cut leaves shared between the arm's surface and the trunk's (each side its own copy, weighed
#      from its own side's neighbours), so nothing ties the arm to his side below the armpit;
#   4. closes each opening the cut made on its own side: the arm's with the arm's skin, the trunk's with the trunk's own
#      surface, filled by Blender (holes_fill) and triangulated by its beauty rule, each corner taking the colour-sheet place
#      of a corner already there so the paint runs on across the seam (a triangle whose corners lie in different charts is
#      marked for meshpatch to point at plain skin or plain robe beside it).
# geometry.json: { drop: [glTF triangle], points: [{copy: glTF vertex, w: [[joint, weight]...]}], reweight: [...],
#                  tris: [[corner, corner, corner]] } where a corner is {v: glTF vertex} or {p: index into points} or
#                  {safe: 'skin'|'robe', g: welded point, v: glTF vertex to copy}.
import bpy, bmesh, json, sys, math, os
from collections import defaultdict
RJ, JJ, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
E = lambda k, dflt: float(os.environ.get(k, dflt))
CUTFAR, MIXFAR, UVSTRETCH, WSMOOTH = E('CUTFAR', 0.15), E('MIXFAR', 0.15), E('UVSTRETCH', 3.0), int(E('WSMOOTH', 12))
# v24.56 · CUTALL=1 (masters/v24.56/PLAN.md; Chad, 9 Nov 2026: "why cant u just clean up that entire armpit area, remove
# all those popping out parts"): the two folds kept as the armpit go too. They were not the armpit: they are a strip the scan
# laid across the mouth of the hollow under his arm (the hollow's own walls, the arm's inner side and his side, meet above
# it), and every take holds the arm 23 to 150 degrees from where the scan hung it, so the strip opened in every take, even
# walking, and drawn out in front of the robe it was the skin shards under his arm (stretched up to 95 times in cast 4). The
# band of blended skin at the front and back of the shoulder (where the arm truly joins the body) stays. With CUTALL come
# TONGUE, MIXOPEN, CREASEPAINT and COVERPAINT below. Unset, as v24.54.
CUTALL = bool(int(E('CUTALL', 0)))
d = json.load(open(RJ))
C = d['center']; pts = d['pts']; keys = list(pts.keys()); kidx = {k: i for i, k in enumerate(keys)}
gvuv = {}
for tr in d['tris']:
    for gv, uv in zip(tr['i'], tr['uv']): gvuv[gv] = uv
bm = bmesh.new()
for k in keys: bm.verts.new(pts[k]['p'])
bm.verts.ensure_lookup_table(); bm.verts.index_update()
tid = bm.faces.layers.int.new('tid'); gvl = bm.loops.layers.int.new('gv'); pidl = bm.verts.layers.int.new('pid')
for v in bm.verts: v[pidl] = v.index
skipped = 0
for tr in d['tris']:
    g = [kidx[str(x)] for x in tr['g']]
    if len(set(g)) < 3: skipped += 1; continue
    try:
        f = bm.faces.new([bm.verts[i] for i in g]); f[tid] = tr['t']
        for lp, gv in zip(f.loops, tr['i']): lp[gvl] = gv
    except ValueError: skipped += 1
bm.faces.ensure_lookup_table()
P = lambda v: pts[keys[v[pidl]]]
arm = lambda v: P(v)['arm']; robe = lambda v: P(v)['robe']
dist = lambda co: math.dist(co, C)
cls = lambda v: 1 if robe(v) and arm(v) < 0.05 else (2 if not robe(v) and arm(v) >= 0.5 else 0)
# 1. the joins and their pieces: armfree's own list (JOINDUMP: the joining triangles it keeps as skin), found here by place
J = json.load(open(JJ))
def pkey(p): return (round(p[0] * 1e5), round(p[1] * 1e5), round(p[2] * 1e5))
pk = {pkey(pts[k]['p']): i for i, k in enumerate(keys)}
def vfor(p):
    k = pkey(p)
    for dx in (0, -1, 1):
        for dy in (0, -1, 1):
            for dz in (0, -1, 1):
                kk = (k[0] + dx, k[1] + dy, k[2] + dz)
                if kk in pk: return pk[kk]
    raise SystemExit(f'armpit: a join corner {p} is not in the region')
faceof = {frozenset(v.index for v in f.verts): f for f in bm.faces}
joins = [faceof[frozenset(vfor(J['pts'][str(g)]['p']) for g in t)] for t in J['joins']]
jset = set(joins); piece = {}; npc = 0
for f in joins:
    if f in piece: continue
    st = [f]; piece[f] = npc
    while st:
        x = st.pop()
        for e in x.edges:
            for h in e.link_faces:
                if h in jset and h not in piece: piece[h] = npc; st.append(h)
    npc += 1
cut = set(); report = []
for p in range(npc):
    fs = [f for f in joins if piece[f] == p]
    rim = [e for f in fs for e in f.edges if sum(1 for h in e.link_faces if piece.get(h) == p) == 1]
    adj = defaultdict(set)
    for e in rim: a, b = e.verts; adj[a].add(b); adj[b].add(a)
    seen = set(); loops = 0
    for v0 in adj:
        if v0 in seen: continue
        loops += 1; st = [v0]; seen.add(v0)
        while st:
            v = st.pop()
            for w in adj[v]:
                if w not in seen: seen.add(w); st.append(w)
    dmin = min(dist(v.co) for f in fs for v in f.verts)
    take = CUTALL or loops >= 2 or dmin > CUTFAR
    report.append(f'piece {p}: {len(fs)} triangles, rim {loops} loop(s), nearest {dmin:.3f} m -> {"taken out" if take else "kept (the armpit)"}')
    if take: cut |= set(fs)
# beside the pieces taken out, a triangle whose corners ride the arm and the trunk apart (arm share across 0.5), further than
# MIXFAR from the joint and touching a point of those pieces, goes too (the scan's last ties beside the small fold); grown
# while new ones touch — the band of such triangles at the front and back of the armpit, nearer, is the armpit and stays
mixed = set(); grow = True
while grow:
    near = {v for f in cut | mixed for v in f.verts}
    new = {f for v in near for f in v.link_faces if f not in cut and f not in mixed
           and min(arm(w) for w in f.verts) < 0.5 <= max(arm(w) for w in f.verts)
           and dist(sum((w.co for w in f.verts), f.verts[0].co * 0) / 3) > MIXFAR}
    grow = bool(new); mixed |= new
cut |= mixed
report.append(f'mixed triangles beside them, further than {MIXFAR} m, taken out too: {len(mixed)}')
# v24.56 · TONGUE=d (with CUTALL): what is left of the scan's bridge on the arm's side. A strip of triangles that ride the arm
# but stand off it towards his side (the collar's wall: up to about 3 cm beyond an upper arm 5 to 6.6 cm in radius), touching the cut
# and grown while new ones touch: a triangle on the inner side of the upper arm (within 60 degrees of the direction from the
# arm's line to his chest), below the armpit's folds (more than 9 cm down the arm from the shoulder joint), whose corners lie
# more than d beyond the arm's own radius there (the 90th centile of the points that ride the arm wholly, per centimetre down
# the arm). Closed, the opening it leaves lies on the arm; left, the closing fill spanned it and swung out under the armpit as
# the skin shard (Talk_with_Hands_Open, Chad 9 Nov 2026). The front and back folds of the armpit stand off the arm too but lie
# to its front and back, outside the 60 degrees, and stay.
TONGUE = E('TONGUE', 0)
if TONGUE > 0 and CUTALL:
    JPOS = d['jointPos']; ja = JPOS['RightArm']; jb = JPOS['RightForeArm']; jc = JPOS['Spine2']
    axv = [jb[i] - ja[i] for i in range(3)]; alen = math.sqrt(sum(x * x for x in axv)); au = [x / alen for x in axv]
    def cylof(p):
        dd = [p[i] - ja[i] for i in range(3)]; t = sum(dd[i] * au[i] for i in range(3)); r = [dd[i] - t * au[i] for i in range(3)]
        return t, r, math.sqrt(sum(x * x for x in r))
    _, cin, cinl = cylof(jc); cin = [x / cinl for x in cin]
    prof = defaultdict(list)
    for k in keys:
        if pts[k]['arm'] > 0.97:
            t, _, rho = cylof(pts[k]['p'])
            if 0 <= t <= alen: prof[int(t * 100)].append(rho)
    rp90 = {b: sorted(v)[int(len(v) * 0.9)] for b, v in prof.items() if len(v) >= 10}
    def rarm(t):
        b = min(max(int(t * 100), min(rp90)), max(rp90))
        while b not in rp90: b -= 1
        return rp90[b]
    def tongue_face(f):
        if sum(arm(w) for w in f.verts) / 3 < 0.5: return False
        cen = [sum(w.co[i] for w in f.verts) / 3 for i in range(3)]
        t, r, rho = cylof(cen)
        if t < 0.09 or t > alen or rho <= 0: return False
        if sum(r[i] * cin[i] for i in range(3)) / rho < math.cos(math.radians(60)): return False
        return max(cylof(list(w.co))[2] - rarm(cylof(list(w.co))[0]) for w in f.verts) > TONGUE
    tongue = set(); grow = True
    while grow:
        near = {v for f in cut | tongue for v in f.verts}
        new = {f for v in near for f in v.link_faces if f not in cut and f not in tongue and tongue_face(f)}
        grow = bool(new); tongue |= new
    cut |= tongue
    report.append(f'the bridge left on the arm (riding the arm, more than {TONGUE} m off it towards his side, touching the cut): {len(tongue)} triangles taken out')
cutverts = {v for f in cut for v in f.verts}
drop = sorted(f[tid] for f in cut)
cutco = [[v.co.copy() for v in f.verts] for f in cut]
# v24.56 · COVERPAINT (below) needs the mesh as it was, the cut pieces in it: a ray tree of it, and which of its faces are cut
COVERPAINT = E('COVERPAINT', 0)
tree0 = cutidx = None
if COVERPAINT > 0 and CUTALL:
    from mathutils.bvhtree import BVHTree
    bm.faces.ensure_lookup_table(); bm.faces.index_update()
    tree0 = BVHTree.FromBMesh(bm); cutidx = {f.index for f in cut}
for f in cut: bm.faces.remove(f)
# 2. separate shared points: each fan of faces round a cut point that is joined to the others only through the point gets
#    its own copy (Blender's vert_separate), and every point the cut touched is weighed again from its own side: its weights
#    smoothed WSMOOTH times over its neighbours on the same side (arm: its faces ride the arm by half or more; trunk: less),
#    the points beyond the cut held as they are — so the trunk's lip no longer rides the arm and the arm's lip rides it fully.
cutpid = {v[pidl] for v in cutverts}
# a fixed order for sets of points (a point and its copies share a place: the lowest triangle number round each tells them
# apart), so the same file comes out every run — a set of Blender's points iterates in memory order, which varies
vkey = lambda v: (v[pidl], tuple(round(c, 7) for c in v.co), min((f[tid] for f in v.link_faces), default=-1))
def fans_of(v):
    # faces round v joined through an edge at v (any number of faces on that edge) are one fan; taken in triangle order
    left = set(v.link_faces); out = []
    while left:
        f0 = min(left, key=lambda f: f[tid]); left.discard(f0); fan = [f0]; st = [f0]
        while st:
            x = st.pop()
            for e in x.edges:
                if v not in e.verts: continue
                for h in e.link_faces:
                    if h in left: left.discard(h); fan.append(h); st.append(h)
        out.append(fan)
    return out
def rebuild(f, old, nv):
    # a face given a new point in place of `old`, its triangle number and its corners' glTF vertices kept
    vs = [nv if v is old else v for v in f.verts]; gvs = [lp[gvl] for lp in f.loops]; t = f[tid]
    bm.faces.remove(f); g = bm.faces.new(vs); g[tid] = t
    for lp, gv in zip(g.loops, gvs): lp[gvl] = gv
    return g
nsplit = 0
for v in sorted(cutverts, key=vkey):
    fans = fans_of(v)
    if len(fans) < 2: continue
    nsplit += 1
    for fan in fans[1:]:
        nv = bm.verts.new(v.co); nv[pidl] = v[pidl]; cutverts.add(nv)
        for f in sorted(fan, key=lambda f: f[tid]): rebuild(f, v, nv)
bm.normal_update()
faceside = lambda f: 1 if sum(arm(v) for v in f.verts) / 3 >= 0.5 else 0
def vside(v):
    s = [faceside(f) for f in v.link_faces]
    return 1 if s and sum(s) * 2 >= len(s) else 0
zone = sorted((v for v in cutverts if v.link_faces), key=vkey)
# THE WEIGHTS, each side its own (v24.54): with the arm cut free of his side below the armpit, a point of his side that still
# rides the arm (the blend tools/armfree.mjs diffused across the joins while they were whole) is dragged up with it, and a
# point of the inner arm that rides his side is held back: both stretch their triangles into strips. Each side is made its
# own over the surface distance from what truly joins them — the kept folds (the armpit) and the band of triangles at its
# front and back whose corners ride the two apart (nearer than MIXFAR): within W0 a point keeps its blend, by W1 a point of
# his side rides only his side (its arm joints' share given to its others in proportion) and a point of the arm rides only
# the arm. Points within WR of the joint only.
import heapq
W0, W1, WR = E('W0', 0.01), E('W1', 0.05), E('WR', 0.30)
ARMJ = ('RightArm', 'RightForeArm', 'RightHand')
keepf = {f for f in joins if f.is_valid and f not in cut}
K = {v for f in keepf for v in f.verts}
K |= {v for f in bm.faces if min(arm(w) for w in f.verts) < 0.5 <= max(arm(w) for w in f.verts)
      and dist(sum((w.co for w in f.verts), f.verts[0].co * 0) / 3) <= MIXFAR for v in f.verts}
gd = {v: 0.0 for v in K}; hq = [(0.0, id(v), v) for v in K]; heapq.heapify(hq)
while hq:
    dd, _, v = heapq.heappop(hq)
    if dd > gd.get(v, 9) or dd > W1: continue
    for e in v.link_edges:
        u = e.other_vert(v); nd = dd + e.calc_length()
        if nd < gd.get(u, 9): gd[u] = nd; heapq.heappush(hq, (nd, id(u), u))
smooth = lambda x: x * x * (3 - 2 * x)
WC = E('WC', 0.04)
gc = {v: 0.0 for v in cutverts if v.link_faces}; hq = [(0.0, id(v), v) for v in gc]; heapq.heapify(hq)
while hq:
    dd, _, v = heapq.heappop(hq)
    if dd > gc.get(v, 9) or dd > WC: continue
    for e in v.link_edges:
        u = e.other_vert(v); nd = dd + e.calc_length()
        if nd < gc.get(u, 9): gc[u] = nd; heapq.heappush(hq, (nd, id(u), u))
W = {}; moved = [0, 0]
for v in bm.verts:
    if not v.link_faces or dist(v.co) > WR or v in K and v not in cutverts or gc.get(v, 9) > WC: continue
    g = gd.get(v, 9.0)
    keepk = 1.0 if g <= W0 else (0.0 if g >= W1 else 1 - smooth((g - W0) / (W1 - W0)))
    keepk = keepk + (1 - keepk) * smooth(gc[v] / WC)   # the full change at the cut, none WC away from it
    w = dict(P(v)['w']); a = sum(x for j, x in w.items() if j in ARMJ)
    sd = vside(v)
    if sd == 0 and a > 0.0 and a < 1.0:
        na = a * keepk; k_o = (1 - na) / (1 - a)
        nw = {j: (x * keepk if j in ARMJ else x * k_o) for j, x in w.items()}
    elif sd == 1 and a < 1.0 and a > 0.0:
        no = (1 - a) * keepk; k_a = (1 - no) / a
        nw = {j: (x * k_a if j in ARMJ else x * keepk) for j, x in w.items()}
    else:
        continue
    nw = {j: x for j, x in nw.items() if x > 1e-4}
    if abs(sum(x for j, x in nw.items() if j in ARMJ) - a) > 0.005:
        W[v] = nw; moved[sd] += 1
for v in zone:
    if v not in W: W[v] = dict(P(v)['w'])
def top4(m):
    top = sorted(m.items(), key=lambda x: -x[1])[:4]; s = sum(w for _, w in top) or 1
    return [[j, w / s] for j, w in top]
points = []; reweight = {}; readd = {}
copies = {}
for v in list(W):
    wts = top4(W[v])
    for f in v.link_faces:
        for i, lp in enumerate(f.loops):
            if lp.vert is not v: continue
            gv = lp[gvl]
            owner = reweight.get(gv)
            if owner is None or owner[0] is v:
                reweight[gv] = (v, wts)
            else:
                # a glTF vertex used by two points after a split: the second point's faces get a copy
                cs = readd.setdefault(f, [{'v': l2[gvl]} for l2 in f.loops])
                key2 = (gv, v)
                if key2 not in copies: points.append({'copy': gv, 'w': wts}); copies[key2] = len(points) - 1
                cs[i] = {'p': copies[key2]}
report.append(f'points shared by the arm and the trunk after the cut, separated: {nsplit}; points weighed by side: '
              f'{moved[0]} of his side given less of the arm, {moved[1]} of the arm given less of his side (from {len(K)} joining points)')
reweight = [{'v': gv, 'w': wts} for gv, (v, wts) in reweight.items()]
# 3. close every opening the cut made, each on its own side
bm.verts.ensure_lookup_table(); bm.edges.ensure_lookup_table()
bnd = [e for e in bm.edges if len(e.link_faces) == 1]
adj = defaultdict(list)
for e in bnd: a, b = e.verts; adj[a].append(e); adj[b].append(e)
seen = set(); holes = []
for e0 in bnd:
    if e0 in seen: continue
    st = [e0]; seen.add(e0); es = []
    while st:
        e = st.pop(); es.append(e)
        for v in e.verts:
            for e2 in adj[v]:
                if e2 not in seen: seen.add(e2); st.append(e2)
    vs = {v for e in es for v in e.verts}
    if any(v[pidl] in cutpid for v in vs) and all(P(v)['near'] for v in vs): holes.append(es)
nfill = nsafe = 0; tris = []; bad = 0; debug = []; unfilled = 0
def order_loop(es):
    # the rim walked the way a closing face must run: against the direction its one face runs each edge
    nxt = {}
    for e in es:
        f = e.link_faces[0]
        for lp in f.loops:
            if lp.edge is e: a, b = lp.vert, lp.link_loop_next.vert   # the face runs a -> b
        if b in nxt: return None
        nxt[b] = a
    L = [es[0].verts[0]]
    while True:
        w = nxt.get(L[-1])
        if w is None: return None
        if w is L[0]: break
        if len(L) > len(es): return None
        L.append(w)
    return L if len(L) == len(es) else None
def zipper(L):
    # a slit closed by a ladder between its two sides, from its two furthest-apart points, each rung the shorter diagonal
    n = len(L)
    if n == 3: return [(L[0], L[1], L[2])]
    i0, i1 = max(((i, j) for i in range(n) for j in range(i + 1, n)), key=lambda ij: (L[ij[0]].co - L[ij[1]].co).length)
    A = [L[(i0 + k) % n] for k in range(1, (i1 - i0) % n)]
    B = [L[(i0 - k) % n] for k in range(1, (i0 - i1) % n)]
    S, T = L[i0], L[i1]
    if not A: return _fan(L)
    if not B: return _fan(L)
    out = [(S, A[0], B[0])]; a = b = 0
    while a < len(A) - 1 or b < len(B) - 1:
        if b == len(B) - 1 or (a < len(A) - 1 and (A[a + 1].co - B[b].co).length <= (A[a].co - B[b + 1].co).length):
            out.append((A[a], A[a + 1], B[b])); a += 1
        else:
            out.append((A[a], B[b + 1], B[b])); b += 1
    out.append((A[-1], T, B[-1]))
    return out
def _fan(L):
    return [(L[0], L[k], L[k + 1]) for k in range(1, len(L) - 1)]
# v24.56 · CUTALL: a fold cut out leaves ONE opening whose rim runs along the arm's lip and his side's lip both. It is split
# into its runs (the rim's edges in order, each run the edges whose face is on one side), and each run is closed on its own
# side by the same fill, from its first point to its last: the arm's lip by the arm's skin, his side's by his side's surface.
# MIXOPEN=1: such an opening is left open instead, as v24.54 left one: it is the mouth of the hollow, whose own walls close
# him. Closed by runs, each run's fill was a fan 10 to 15 cm long from the two ends where arm and side still meet, and those
# ends, riding the arm by half, drew the fans out as grey strips across his back and chest (46 times, cast 6).
MIXOPEN = bool(int(E('MIXOPEN', 0)))
jobs = []
for es in holes:
    sides = {faceside(e.link_faces[0]) for e in es}
    if len(sides) > 1 and CUTALL and not MIXOPEN:
        L = order_loop(es)
        if L is None: jobs.append((es, 'order')); continue
        n = len(L); emap = {frozenset(e.verts): e for e in es}
        esd = [faceside(emap[frozenset((L[i], L[(i + 1) % n]))].link_faces[0]) for i in range(n)]
        start = next((i for i in range(n) if esd[i] != esd[i - 1]), 0)
        runs, cur = [], [start]
        for k in range(1, n + 1):
            i = (start + k) % n
            if k < n and esd[i] == esd[(i - 1) % n]: cur.append(i)
            else: runs.append(cur); cur = [i]
        report.append(f'  an opening of {len(es)} edges along the arm and his side both: split into {len(runs)} runs ({", ".join(str(len(r)) for r in runs)} edges)')
        for r in runs:
            Lr = [L[i] for i in r] + [L[(r[-1] + 1) % n]]
            if len(Lr) >= 3: jobs.append(([emap[frozenset((L[i], L[(i + 1) % n]))] for i in r], Lr))
        continue
    jobs.append((es, 'order'))
allmade = set()   # every fill face made so far: two runs of one opening share their end points
for es, L in jobs:
    h0 = (nfill, nsafe, bad)
    if L == 'order':
        sides = {faceside(e.link_faces[0]) for e in es}
        if len(sides) > 1:
            unfilled += 1; hv = {v for e in es for v in e.verts}
            report.append(f'  an opening of {len(es)} edges runs along the arm and the trunk both ({min(dist(v.co) for v in hv):.3f}-{max(dist(v.co) for v in hv):.3f} m): left open'); continue
        L = order_loop(es)
        if L is None:
            unfilled += 1; report.append(f'  an opening of {len(es)} edges is not one simple loop: left open'); continue
    # the opening closed by the least-cost triangulation of its rim (Liepa's hole filling, as a dynamic programme over the
    # rim in order): a triangle costs its area, more the further it turns from the skin round its corners, and far more if
    # it faces against it, so the fill follows the surface it closes and never folds
    n = len(L); vn = []
    for v in L:
        a = v.co * 0
        for f in v.link_faces: a += f.normal * f.calc_area()
        vn.append(a.normalized() if a.length > 0 else a)
    def cost(i, k, j):
        a, b, c = L[i].co, L[k].co, L[j].co
        nrm = (b - a).cross(c - a); area = nrm.length / 2
        if area < 1e-12: return 1e9
        nrm = nrm / (2 * area); loc = (vn[i] + vn[k] + vn[j]); loc = loc.normalized() if loc.length > 0 else loc
        cs = nrm.dot(loc)
        return area * (1 + 4 * (1 - cs)) + (1.0 if cs < 0 else 0.0)
    INF = float('inf'); Wd = [[0.0] * n for _ in range(n)]; Kd = [[-1] * n for _ in range(n)]
    for span in range(2, n):
        for i in range(0, n - span):
            j = i + span; best_c = INF; best_k = -1
            for k in range(i + 1, j):
                c = Wd[i][k] + Wd[k][j] + cost(i, k, j)
                if c < best_c: best_c, best_k = c, k
            Wd[i][j] = best_c; Kd[i][j] = best_k
    out = []; st = [(0, n - 1)]
    while st:
        i, j = st.pop()
        if j - i < 2: continue
        k = Kd[i][j]; out.append((L[i], L[k], L[j])); st.append((i, k)); st.append((k, j))
    # every triangle of the fill is written, even one Blender refuses as a face (its three points already make a face elsewhere)
    made = set()
    for t in out:
        try: made.add(bm.faces.new(t))
        except ValueError: pass
    bm.normal_update()
    made |= allmade; allmade |= made
    hv = sorted({v for e in es for v in e.verts}, key=vkey)
    side = 'arm' if sum(arm(v) for v in hv) / len(hv) >= 0.5 else 'trunk'
    for tv in out:
        cand = []
        for v in tv:
            c = set()
            for g in v.link_faces:
                if g in made: continue
                for lp in g.loops:
                    if lp.vert is v:
                        cs = readd.get(g)
                        if cs:
                            k = list(g.verts).index(v); cc = cs[k]
                            c.add(('p', cc['p']) if 'p' in cc else ('v', cc['v']))
                        else: c.add(('v', lp[gvl]))
            cand.append(sorted(c))
        uvof = lambda c: gvuv[c[1]] if c[0] == 'v' else gvuv[points[c[1]]['copy']]
        best = None
        for a_ in cand[0]:
            for b_ in cand[1]:
                for c_ in cand[2]:
                    u = [uvof(a_), uvof(b_), uvof(c_)]
                    per = sum(math.dist(u[i], u[(i + 1) % 3]) for i in range(3))
                    if best is None or per < best[0]: best = (per, (a_, b_, c_))
        if best is None: bad += 1; report.append('  a fill triangle with a corner on no face: left out'); continue
        n0 = (tv[1].co - tv[0].co).cross(tv[2].co - tv[0].co)
        nb = [g.normal for v in tv for g in v.link_faces if g not in made]
        against = bool(nb) and n0.dot(sum(nb, n0 * 0)) < 0
        bad += against
        # the corners lie in one chart when the triangle's size on the colour sheet matches its neighbours' (sheet px per metre)
        dens = [math.dist(gvuv[lp[gvl]], gvuv[lp.link_loop_next[gvl]]) / max(1e-6, (lp.vert.co - lp.link_loop_next.vert.co).length)
                for v in tv for g in v.link_faces if g not in made and g not in readd for lp in g.loops]
        dens = sorted(dens)[len(dens) // 2] if dens else 0
        per3 = sum((tv[i].co - tv[(i + 1) % 3].co).length for i in range(3))
        kind = 'skin' if side == 'arm' or sum(robe(v) for v in tv) < 2 else 'robe'
        if dens and best[0] <= UVSTRETCH * dens * per3:
            # the paint carried on from the corners already there; meshpatch checks the sheet under it is all of this kind
            tris.append([{'kind': kind, 'g': int(keys[v[pidl]]), **({'v': c[1]} if c[0] == 'v' else {'p': c[1]})}
                         for v, c in zip(tv, best[1])])
        else:
            nsafe += 1
            tris.append([{'safe': kind, 'g': int(keys[v[pidl]]), **({'v': c[1]} if c[0] == 'v' else {'p': c[1]})}
                         for v, c in zip(tv, best[1])])
        nfill += 1
        debug.append(([v.co[:] for v in tv], 'safe' if tris[-1][0].get('safe') else 'fill', against))
    report.append(f'  opening: {len(es)} edges, {side}, {min(dist(v.co) for v in hv):.3f}-{max(dist(v.co) for v in hv):.3f} m from the joint: {nfill - h0[0]} triangles, {nsafe - h0[1]} pointed at plain, {bad - h0[2]} facing against')
report.append(f'openings closed: {len(holes)} ({nfill} triangles, {nsafe} pointed at plain skin or robe, {bad} facing against their neighbours)')
# v24.56 · CREASEPAINT=o (with CUTALL): the inside of the crease drawn in his skin. With the seal across the hollow under his
# arm cut out (MIXOPEN), a raised arm shows the hollow's own walls, which the scan painted in the crease's grey and the robe's
# white where it could not see (grey and white scraps in the armpit, cast 6 from behind, the cheer from the side). A triangle
# here is in the crease when, at rest, his own body closes it in: of 48 rays from it over the side it faces, fewer than o in
# 48 get 15 cm without meeting him; and it lies within CREASENEAR (3 cm unless set) of the other side (a triangle of his side
# near the arm, or of the arm near his side) and within 22 cm of the joint. Each is handed to tools/meshpatch.mjs as skin:
# kept where its own paint is all skin, else pointed at plain skin beside it (no texel of his sheet changes). What shows at
# rest is not in the crease.
# COVERPAINT=c: what the cut pieces covered keeps their colour. The seal and the folds were skin, and at rest they lay over the
# robe's ragged top edge in his armpit; cut out, that edge showed as white teeth even with his arm down. A triangle (as near
# the other side and the joint as above) of whose 48 rays at least c met a cut piece first, in the mesh as it was, is handed on
# as skin the same way: at rest he looks as he did, and nothing the pieces covered is left to show when the arm moves.
CREASEPAINT, CREASENEAR = E('CREASEPAINT', 0), E('CREASENEAR', 0.03)
crease_tris = []
if (CREASEPAINT > 0 or COVERPAINT > 0) and CUTALL:
    from mathutils.bvhtree import BVHTree
    from mathutils.kdtree import KDTree
    bm.faces.ensure_lookup_table(); bm.verts.ensure_lookup_table()
    tree = BVHTree.FromBMesh(bm)
    live = [v for v in bm.verts if v.link_faces]
    kd = {}
    for sd in (0, 1):
        vs = [v for v in live if vside(v) == sd]
        kt = KDTree(len(vs))
        for i, v in enumerate(vs): kt.insert(v.co, i)
        kt.balance(); kd[sd] = kt
    NR = 48; ga = math.pi * (3 - math.sqrt(5)); hemi = []
    for i in range(NR):
        z = 1 - (i + 0.5) / NR; r = math.sqrt(max(0.0, 1 - z * z)); hemi.append((math.cos(ga * i) * r, math.sin(ga * i) * r, z))
    nCrease = 0
    # the fills' own triangles are not his scan's: each is already written above with its paint, and a face made here
    # carries its layers' defaults (tid 0, every corner glTF vertex 0), so taken again it dropped glTF triangle 0 (at his
    # shin) and wrote a triangle with all three corners at vertex 0
    for f in sorted((f for f in bm.faces if f.is_valid and f not in allmade), key=lambda f: f[tid]):
        cen = f.calc_center_median()
        if dist(cen) > 0.22: continue
        sd = faceside(f)
        if kd[1 - sd].find(cen)[2] > CREASENEAR: continue
        nrm = f.normal
        if nrm.length < 0.5: continue
        t1 = nrm.orthogonal().normalized(); t2 = nrm.cross(t1)
        org = cen + nrm * 0.001; free = covered = 0
        for hx, hy, hz in hemi:
            d3 = t1 * hx + t2 * hy + nrm * hz
            if tree.ray_cast(org, d3, 0.15)[0] is None: free += 1
            if tree0 is not None:
                hit = tree0.ray_cast(org, d3, 0.15)
                if hit[0] is not None and hit[2] in cutidx: covered += 1
        if not ((CREASEPAINT > 0 and free < CREASEPAINT) or (COVERPAINT > 0 and covered >= COVERPAINT)): continue
        cs = readd.pop(f, None) or [{'v': lp[gvl]} for lp in f.loops]
        drop.append(f[tid]); crease_tris.append([dict(c, kind='skin') for c in cs]); nCrease += 1
    report.append(f'the inside of the crease (closed in at rest: under {CREASEPAINT:g} of {NR} rays free for 15 cm; or {COVERPAINT:g} or more meeting a cut piece first; within {CREASENEAR:g} m of the other side): {nCrease} triangles handed on as skin')
readd_tris = []
for f, cs in readd.items():
    if f.is_valid: drop.append(f[tid]); readd_tris.append(cs)
readd_tris += crease_tris
# the patch may take out only triangles of the region it was handed, and write no triangle with a corner twice
rtids = {tr['t'] for tr in d['tris']}
outside = sorted(t for t in set(drop) if t not in rtids)
if outside: raise SystemExit(f'armpit: would take out triangles outside the region: {outside[:8]}')
twice = [t for t in readd_tris + tris if len({(c.get('v'), c.get('p')) for c in t}) < 3]
if twice: raise SystemExit(f'armpit: {len(twice)} triangles with a corner twice, e.g. {twice[0]}')
json.dump({'drop': sorted(set(drop)), 'points': points, 'reweight': reweight, 'tris': readd_tris + tris, 'report': report}, open(OUT, 'w'))
if os.environ.get('DEBUG'): json.dump({'fills': debug, 'cut': [[v[:] for v in c] for c in cutco]}, open(os.environ['DEBUG'], 'w'))
print('\n'.join(report)); print(f'armpit: {len(set(drop))} triangles out, {len(points)} points copied, {len(reweight)} reweighed, {len(readd_tris) + len(tris)} triangles in -> {OUT}')
