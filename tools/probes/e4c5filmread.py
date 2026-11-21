#!/usr/bin/env python3
"""v28.0 · READS tools/probes/e4c5films.mjs (R25: clipping, jerks and pops, a phone's framing), one film at a time:
     python3 -I tools/probes/e4c5filmread.py <dir> <job> [lines.json]
<dir> holds phone-<mode>-<job>.json and desktop-<mode>-<job>.json (seek mode; play mode if no seek file). lines.json
(optional) gives each film's spoken lines [key, start, secs, speaker], so a line's speaker can be held to the frame.
It lists LEADS, never verdicts:
  CUTS     where the lens jumps (the eye 0.25 m, the look 10 degrees, the angle 5 degrees in one step);
  JUMP     a person's hips or head moving faster than 2.5 m a second between two rows, on screen, with no cut between;
  JERK     a person's head or hips changing speed by more than 1.2 m a second in one row (a take switched, a pose snapped),
           on screen, with no cut;
  POP      a person or a thing shown or hidden on screen with no cut (and a flicker: shown and hidden again within 0.5 s);
  FRAME    a speaker's head outside the middle of the frame (|x| > 0.82 or |y| > 0.8 in NDC) during his own line, after
           its first 0.5 s, per view; a person's head cut by the frame's edge (0.88 < |x| < 1.15) on one view and not the
           other;
  CLIP     clipscan's crossing pairs (not resting) whose crossing stands inside either view's frame.
"""
import json, math, os, sys
D, JOB = sys.argv[1], sys.argv[2]
LN = json.load(open(sys.argv[3]))[JOB] if len(sys.argv) > 3 else {'lines': [], 'clock': {}}
SPK = {'pho': ('pho',), 'ton': ('e4ton',), 'jun': ('p5jun',), 'koh': ('p5koh',), 'collector': ('p5collector',)}

def load(view):
    for mode in ('seek', 'play'):
        f = os.path.join(D, '%s-%s-%s.json' % (view, mode, JOB))
        if os.path.exists(f): return json.load(open(f))
    return None

def basis(L):
    yw, pt = math.radians(L[6]), math.radians(L[7])
    f = (-math.sin(yw) * math.cos(pt), math.sin(pt), -math.cos(yw) * math.cos(pt))
    r = (math.cos(yw), 0.0, -math.sin(yw))
    u = (r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0])
    return f, r, u

def ndc(L, p):
    if p is None: return None
    f, r, u = basis(L)
    v = (p[0] - L[3], p[1] - L[4], p[2] - L[5])
    z = v[0] * f[0] + v[1] * f[1] + v[2] * f[2]
    if z < 0.05: return None
    th = math.tan(math.radians(L[1]) / 2)
    return ((v[0] * r[0] + v[1] * r[1] + v[2] * r[2]) / z / (th * L[2]), (v[0] * u[0] + v[1] * u[1] + v[2] * u[2]) / z / th)

def cuts(rows):
    out = set()
    for i in range(1, len(rows)):
        a, b = rows[i - 1]['L'], rows[i]['L']
        de = math.dist(a[3:6], b[3:6]); dy = abs((b[6] - a[6] + 180) % 360 - 180); dp = abs(b[7] - a[7]); df = abs(b[1] - a[1])
        if de > 0.25 or dy > 10 or dp > 8 or df > 5: out.add(i)
    return out

def onscreen(row, k):
    P = row['P'][k]
    if not P or not P[0] or not P[5] or row['L'][8] > 0.95: return False
    e = P[5]
    return e[1] > -1 and e[0] < 1 and e[3] > -1 and e[2] < 1

def spans(ts, gap=0.25):
    out = []
    for t in ts:
        if out and t - out[-1][1] <= gap: out[-1][1] = t
        else: out.append([t, t])
    return ['%.1f' % a if abs(a - b) < 1e-6 else '%.1f-%.1f' % (a, b) for a, b in out]

R = {v: load(v) for v in ('phone', 'desktop')}
base = R['phone'] or R['desktop']
labels = base['labels']
print('== %s: %.2f s, %d people (%s), rows phone %s desktop %s' % (JOB, base['dur'], len(labels), ', '.join(labels),
      len(R['phone']['rows']) if R['phone'] else '-', len(R['desktop']['rows']) if R['desktop'] else '-'))
rows = base['rows']; C = cuts(rows); dt = base.get('step', 0.1)
print('CUTS at', ' '.join('%.1f' % rows[i]['L'][0] for i in sorted(C)))
near_cut = lambda i: i in C or (i + 1) in C
# jumps, jerks, pops of people (on either view's screen)
for k, lab in enumerate(labels):
    J, K, Pp = [], [], []
    for i in range(1, len(rows)):
        a, b = rows[i - 1]['P'][k], rows[i]['P'][k]
        if not a or not b: continue
        scr = any(R[v] and i < len(R[v]['rows']) and (onscreen(R[v]['rows'][i], k) or onscreen(R[v]['rows'][i - 1], k)) for v in R)
        if not scr or near_cut(i): continue
        t = rows[i]['L'][0]
        if a[0] != b[0]: Pp.append(t)
        if a[0] and b[0]:
            for j in (3, 4):
                if a[j] and b[j] and math.dist(a[j], b[j]) / dt > 2.5: J.append(t); break
            if i + 1 < len(rows) and not near_cut(i + 1):
                c = rows[i + 1]['P'][k]
                if c and c[0]:
                    for j in (3, 4):
                        if a[j] and b[j] and c[j]:
                            acc = math.sqrt(sum((c[j][q] - 2 * b[j][q] + a[j][q]) ** 2 for q in range(3))) / dt
                            if acc > 1.2: K.append(t); break
    if J or K or Pp:
        print('  %-16s JUMP %s | JERK %s | POP %s' % (lab, ' '.join(spans(J)) or '-', ' '.join(spans(K)) or '-', ' '.join(spans(Pp)) or '-'))
# things shown or hidden or moved on screen with no cut
TH = {}
for i, row in enumerate(rows):
    for nm, s in row['T'].items():
        TH.setdefault(nm, []).append((i, s))
for nm, ev in TH.items():
    hits = []
    for n, (i, s) in enumerate(ev):
        if n == 0 or near_cut(i) or rows[i]['L'][8] > 0.95: continue
        pi, ps = ev[n - 1]
        inframe = s[6] == 1 and abs(s[4]) < 1.05 and abs(s[5]) < 1.05
        if not inframe: continue
        moved = math.dist(ps[1:4], s[1:4])
        if ps[0] != s[0]: hits.append('%s %.1f' % ('SHOWN' if s[0] else 'HIDDEN', rows[i]['L'][0]))
        elif s[0] and moved > 0.25 and i - pi == 1: hits.append('MOVED %.2fm %.1f' % (moved, rows[i]['L'][0]))
    if hits: print('  thing %-22s %s' % (nm.split('|')[0][:22], ' '.join(hits[:8]) + (' ...%d' % len(hits) if len(hits) > 8 else '')))
# framing: each speaker's head through his line, per view; heads at the frame's edge
lab_of = lambda sp: [k for k, l in enumerate(labels) if l.split('#')[0] in SPK.get(sp, ())]
for v in ('phone', 'desktop'):
    if not R[v]: continue
    rr = R[v]['rows']; bad = []
    for key, t0, secs, sp in LN['lines']:
        ks = lab_of(sp)
        if not ks: continue
        out = []
        for row in rr:
            t = row['L'][0]
            if t < t0 + 0.5 or t > t0 + secs or row['L'][8] > 0.9: continue
            best = None
            for k in ks:
                P = row['P'][k]
                if not P or not P[0]: continue
                q = ndc(row['L'], P[4])
                if q and (best is None or abs(q[0]) < abs(best[0])): best = q
            if best is None or abs(best[0]) > 0.82 or abs(best[1]) > 0.8: out.append(t)
        if out: bad.append('%s(%s) %s' % (key, sp, ' '.join(spans(out))))
    print('FRAME %-7s speaker off: %s' % (v, '; '.join(bad) or 'none'))
if R['phone'] and R['desktop']:
    E = {}
    for i, (rp, rd) in enumerate(zip(R['phone']['rows'], R['desktop']['rows'])):
        if rp['L'][8] > 0.9: continue
        for k, lab in enumerate(labels):
            a, b = rp['P'][k], rd['P'][k]
            if not a or not a[0] or not a[4]: continue
            qp, qd = ndc(rp['L'], a[4]), ndc(rd['L'], b[4] if b else None)
            if qp and 0.88 < abs(qp[0]) < 1.15 and abs(qp[1]) < 1 and (qd and abs(qd[0]) < 0.8): E.setdefault(lab, []).append(rp['L'][0])
    for lab, ts in E.items(): print('FRAME phone-only head at the edge %-14s %s' % (lab, ' '.join(spans(ts))))
# clips
src = R['phone'] if R['phone'] and R['phone'].get('clips') else R['desktop']
for c in (src.get('clips') or []):
    i = min(range(len(rows)), key=lambda j: abs(rows[j]['L'][0] - c['t']))
    lst = []
    for pr in c['pairs']:
        if pr.get('rest'): continue
        m = [(pr['at'][0][q] + pr['at'][1][q]) / 2 for q in range(3)]
        vis = []
        for v in ('phone', 'desktop'):
            if R[v] and i < len(R[v]['rows']):
                q = ndc(R[v]['rows'][i]['L'], m)
                if q and abs(q[0]) < 1 and abs(q[1]) < 1: vis.append(v[0])
        if not vis: continue
        lst.append('%s<>%s %d hits @%s [%s]' % (pr['a']['label'][:40], pr['b']['label'][:40], pr['hits'], ','.join('%.2f' % x for x in m), ''.join(vis)))
    print('CLIP t=%.1f: %d in frame of %d pairs' % (c['t'], len(lst), len(c['pairs'])))
    for s in lst[:14]: print('   ', s)
print('errs', (base.get('errs') or [])[:4])
