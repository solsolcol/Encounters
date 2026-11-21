"""v28.0 · EPISODE 4 CHAPTER 5: EVERY BODY AGAINST THE SOLIDS AND AGAINST EACH OTHER (R29, Chad, 21 Nov 2026: "The entire
chapter 5 many characters have clipping problems. Cant the game have proper collision detection and proper path finding
and preventing bodies from clipping?"; his pick: chapter 5 only).

Reads the films' rows that tools/probes/e4c5films.mjs writes in MODE=seek (every person at every STEP s: shown or not, the
hips in the world) with the place's solids it records as each film begins (`solids`: the blockers, each grown 0.14 m for
his eye, or null where made empty). For every row:
  - every SHOWN body on the floor (Grandmaster Pho, Ton, Jun, Mr Koh, Master Zavier, the collector) that STANDS (hips 0.65 m
    up or more: a seated body is left out) is a disc round its hips (0.18 m; Mr Koh 0.21);
  - A BODY IN A SOLID: its disc reaching more than TOL into a solid (the blocker taken back to the solid);
  - TWO BODIES IN EACH OTHER: two discs overlapping by more than TOL;
  - the spirits (the Prai) are counted apart and never fail it: whether one may pass through a body or a wall is the plan's
    (R30), put to Chad.
Each fault is reported as a span (the film, who, from when to when, how deep at its deepest). EXITS 1 on any fault.
    python3 -I tools/probes/e4c5bodies.py <dir of *-seek-*.json> [TOL=0.03]
"""
import glob
import json
import math
import os
import sys

FLOOR = ('p5pho', 'e4ton', 'p5jun', 'p5koh', 'p5zavier', 'p5collector')
SPIRIT = ('p5prai',)
R = {'p5koh': 0.21}
R0, GROW, STAND_Y = 0.18, 0.14, 0.65


def base(label):
    return label.split('#')[0]


def disc_in_box(x, z, r, b):
    """how far a disc of radius r at (x, z) reaches into the box [x0, x1, z0, z1] (<= 0: clear)"""
    dx = max(b[0] - x, 0.0, x - b[1])
    dz = max(b[2] - z, 0.0, z - b[3])
    if dx == 0.0 and dz == 0.0:        # the centre inside: the depth to the nearest side, plus the disc
        return r + min(x - b[0], b[1] - x, z - b[2], b[3] - z)
    return r - math.hypot(dx, dz)


def main():
    d = sys.argv[1]
    tol = float(os.environ.get('TOL', '0.03'))
    files = sorted(glob.glob(os.path.join(d, '*-seek-*.json')))
    if not files:
        print('e4c5bodies: no *-seek-*.json in', d)
        return 2
    faults = 0
    for f in files:
        res = json.load(open(f))
        lab, rows, step = res['labels'], res['rows'], res.get('step', 0.1)
        solids = [[b[0] + GROW, b[1] - GROW, b[2] + GROW, b[3] - GROW] for b in (res.get('solids') or []) if b]
        spans, spirit = {}, {}
        for ri, row in enumerate(rows):
            t = row['T'] if isinstance(row.get('T'), (int, float)) else round(ri * step, 2)
            bodies = []
            for i, p in enumerate(row['P']):
                if not p or not p[0]:
                    continue
                b = base(lab[i])
                hp = p[3]
                if b.startswith(FLOOR) and hp[1] >= STAND_Y:
                    bodies.append((lab[i], hp[0], hp[2], R.get(b, R0), False))
                elif b.startswith(SPIRIT):
                    bodies.append((lab[i], hp[0], hp[2], R0, True))
            for (n, x, z, r, sp) in bodies:
                if sp:
                    continue
                for si, s in enumerate(solids):
                    dep = disc_in_box(x, z, r, s)
                    if dep > tol:
                        k = ('solid', n, si)
                        e = spans.setdefault(k, [t, t, dep, (round(x, 2), round(z, 2))])
                        e[1] = t
                        if dep > e[2]:
                            e[2], e[3] = dep, (round(x, 2), round(z, 2))
            for a in range(len(bodies)):
                for c in range(a + 1, len(bodies)):
                    (n1, x1, z1, r1, s1), (n2, x2, z2, r2, s2) = bodies[a], bodies[c]
                    dep = r1 + r2 - math.hypot(x1 - x2, z1 - z2)
                    if dep > tol:
                        k = ('body', n1, n2)
                        target = spirit if (s1 or s2) else spans
                        e = target.setdefault(k, [t, t, dep, (round(x1, 2), round(z1, 2))])
                        e[1] = t
                        if dep > e[2]:
                            e[2], e[3] = dep, (round(x1, 2), round(z1, 2))
        nav = res.get('nav')
        name = os.path.basename(f)
        print('%s: %d rows, %d solids%s' % (name, len(rows), len(solids), ('' if not nav else ', map %s %s' % ('on' if nav.get('on') else 'off', json.dumps(nav.get('counts'))))))
        for k, e in sorted(spans.items(), key=lambda kv: -kv[1][2]):
            faults += 1
            if k[0] == 'solid':
                s = solids[k[2]]
                print('  FAULT %s in a solid [%.2f..%.2f, %.2f..%.2f] %.1f-%.1fs, %.0f cm deep at its deepest (at %s)' % (k[1], s[0], s[1], s[2], s[3], e[0], e[1], e[2] * 100, e[3]))
            else:
                print('  FAULT %s x %s %.1f-%.1fs, %.0f cm into each other at the deepest (at %s)' % (k[1], k[2], e[0], e[1], e[2] * 100, e[3]))
        for k, e in sorted(spirit.items(), key=lambda kv: -kv[1][2]):
            print('  (spirit) %s x %s %.1f-%.1fs, %.0f cm (the plan decides: R30)' % (k[1], k[2], e[0], e[1], e[2] * 100))
    print('FAULTS: %d' % faults)
    return 1 if faults else 0


if __name__ == '__main__':
    sys.exit(main())
