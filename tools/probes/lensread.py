#!/usr/bin/env python3
"""v26.0 · A FILM'S CAMERA READ AS A MOVE (v25.5's law: "a camera move is MEASURED as a move"; "a cut changes what is
looked at: a lens that changes in one frame while the eye and the subject it rests on stay where they are is a jolt").

    python3 -I tools/probes/lensread.py <lens-film.json> [...]

Each file is what tools/probes/e4c3beats.mjs's { "lens": 0.1 } step wrote: rows of
[t, lens (degrees), turn, tilt, x, y, z, the film's black (0..1), roll] at every step of the film's own clock.
A step STANDS OUT when it is six times the middle of the eight steps round it and over a floor (lens 0.35 degrees,
look 0.6 degrees, eye 4 cm). For each film it lists
  THE CUTS    a step that stands out AND moves the eye more than half a metre or turns the look more than ten degrees:
              another picture (counted, with their times; a cut under black is counted apart);
  THE JOLTS   a step that stands out and is NOT a cut and is not under black: the lens, the look or the eye changing in
              one step while the rest holds. Each is printed with what changed: these are read one by one;
  THE FAST MOVES   a stretch of steps that do NOT stand out (the move is smooth) but turn the look faster than ninety
              degrees a second or carry the eye faster than four and a half metres a second: a whip of the head. Not a
              fault by itself: each is printed with how far and how fast, to be read for whether the scene wants it;
  THERE AND BACK   inside one shot (between two cuts), the lens, the look or the eye going out and returning. SMALL ones
              (a lens under 3 degrees, a look under 4, an eye under 15 cm) are what a fit that breathes looks like, and
              are printed; a larger one is a move somebody directed (a push in and out again, a look down at his hands
              and up), and is only counted.
Exit status 1 if any jolt is found, else 0.
"""
import json, math, sys

FLOOR = {'lens': 0.35, 'look': 0.6, 'eye': 0.04}
CUT_EYE, CUT_LOOK = 0.5, 10.0
BACK = {'lens': 0.5, 'look': 1.2, 'eye': 0.06}
SMALL = {'lens': 3.0, 'look': 4.0, 'eye': 0.15}
FAST_LOOK, FAST_EYE = 9.0, 0.45                              # a step (a tenth of a second): ninety degrees a second, four and a half metres


def direction(turn, tilt):
    a, b = math.radians(turn), math.radians(tilt)
    return (math.sin(a) * math.cos(b), math.sin(b), -math.cos(a) * math.cos(b))


def angle(u, v):
    d = max(-1.0, min(1.0, sum(p * q for p, q in zip(u, v))))
    return math.degrees(math.acos(d))


def middle(vals):
    s = sorted(vals)
    return s[len(s) // 2] if s else 0.0


def there_and_back(v):
    """the largest excursion that goes out and comes back: min(out, back), and where its turning point is"""
    n = len(v)
    if n < 3:
        return 0.0, 0
    lo_b, hi_b = [0.0] * n, [0.0] * n
    lo_a, hi_a = [0.0] * n, [0.0] * n
    lo = hi = v[0]
    for i in range(n):
        lo, hi = min(lo, v[i]), max(hi, v[i]); lo_b[i], hi_b[i] = lo, hi
    lo = hi = v[-1]
    for i in range(n - 1, -1, -1):
        lo, hi = min(lo, v[i]), max(hi, v[i]); lo_a[i], hi_a[i] = lo, hi
    best, at = 0.0, 0
    for j in range(1, n - 1):
        up = min(v[j] - lo_b[j], v[j] - lo_a[j])
        dn = min(hi_b[j] - v[j], hi_a[j] - v[j])
        k = max(up, dn)
        if k > best:
            best, at = k, j
    return best, at


def read(path):
    rows = json.load(open(path))
    name = path.split('/')[-1].replace('lens-', '').replace('.json', '')
    if len(rows) < 3:
        print(f'{name}: only {len(rows)} moments'); return 0
    step = min(b[0] - a[0] for a, b in zip(rows, rows[1:]) if b[0] > a[0])
    D = []
    for a, b in zip(rows, rows[1:]):
        gap = b[0] - a[0] > step * 1.5                       # a hole in the clock (the breath's wall): not a step
        eye = math.dist(a[4:7], b[4:7]); look = angle(direction(a[2], a[3]), direction(b[2], b[3])); lens = b[1] - a[1]
        D.append({'t': b[0], 'eye': eye, 'look': look, 'lens': abs(lens), 'dl': lens, 'black': max(a[7], b[7]) >= 0.97, 'gap': gap})
    cuts, dark, jolts, fast, run = [], [], [], [], None
    for i, d in enumerate(D):
        if d['gap']:
            cuts.append(d['t']); run = None; continue
        near = [D[k] for k in range(max(0, i - 4), min(len(D), i + 5)) if k != i and not D[k]['gap']]
        out = [q for q in ('lens', 'look', 'eye') if d[q] > max(FLOOR[q], 6 * middle([n[q] for n in near]) + FLOOR[q] * 0.4)]
        if out and (d['eye'] > CUT_EYE or d['look'] > CUT_LOOK):
            (dark if d['black'] else cuts).append(d['t']); run = None; continue
        if not out:
            if (d['look'] > FAST_LOOK or d['eye'] > FAST_EYE) and not d['black']:
                if run and abs(run['t1'] - (d['t'] - step)) < 1e-6:
                    run['t1'] = d['t']; run['look'] += d['look']; run['eye'] += d['eye']; run['pl'] = max(run['pl'], d['look']); run['pe'] = max(run['pe'], d['eye'])
                else:
                    run = {'t0': d['t'] - step, 't1': d['t'], 'look': d['look'], 'eye': d['eye'], 'pl': d['look'], 'pe': d['eye']}; fast.append(run)
            continue
        if d['black']:
            dark.append(d['t']); continue
        jolts.append(f"  {d['t']:7.2f} s  {' and '.join(out)} in one step: lens {d['dl']:+.2f} deg, look {d['look']:.2f} deg, eye {d['eye'] * 100:.1f} cm")
    # the shots: between the cuts
    marks = sorted(set(cuts + dark)); shots, s0 = [], 0
    for i, d in enumerate(D):
        if d['t'] in marks:
            shots.append((s0, i)); s0 = i + 1
    shots.append((s0, len(D)))
    sways, big = [], 0
    for a, b in shots:
        seg = rows[a:b + 1]
        if len(seg) < 5:
            continue
        for what, series in (('lens', [r[1] for r in seg]), ('look (turn)', [r[2] for r in seg]), ('look (tilt)', [r[3] for r in seg]),
                             ('eye', None)):
            if series is None:                               # the eye: along its own main line of travel
                p0 = seg[0][4:7]; far = max(seg, key=lambda r: math.dist(r[4:7], p0))[4:7]; L = math.dist(far, p0)
                if L < 1e-6:
                    continue
                ax = [(f - p) / L for f, p in zip(far, p0)]
                series = [sum((r[4 + k] - p0[k]) * ax[k] for k in range(3)) for r in seg]
            k, at = there_and_back(series)
            lim = BACK['lens'] if what == 'lens' else BACK['eye'] if what == 'eye' else BACK['look']
            if k >= lim:
                unit = 'm' if what == 'eye' else 'deg'
                if k > (SMALL['lens'] if what == 'lens' else SMALL['eye'] if what == 'eye' else SMALL['look']):
                    big += 1; continue
                sways.append(f"  {seg[0][0]:7.2f} to {seg[-1][0]:7.2f} s  the {what} goes out and back by {k:.2f} {unit} (turning at {seg[at][0]:.2f} s)")
    fov = [r[1] for r in rows]
    print(f"\n==== {name}: {len(rows)} moments, {rows[0][0]:.1f} to {rows[-1][0]:.1f} s, a step of {step:.2f} s; the lens {min(fov):.1f} to {max(fov):.1f} degrees")
    print(f"cuts: {len(cuts)} in the picture ({' '.join('%.1f' % t for t in cuts)}); {len(dark)} steps under black")
    print(f"JOLTS: {len(jolts)}" + ('\n' + '\n'.join(jolts) if jolts else ''))
    print(f"FAST MOVES: {len(fast)}" + ''.join(f"\n  {r['t0']:7.2f} to {r['t1']:7.2f} s  the look turns {r['look']:.0f} deg (at most {r['pl'] * 10:.0f} deg a second)" + (f", the eye travels {r['eye']:.2f} m (at most {r['pe'] * 10:.1f} m a second)" if r['pe'] > FAST_EYE else '') for r in fast))
    print(f"THERE AND BACK, small: {len(sways)} (and {big} larger, directed)" + ('\n' + '\n'.join(sways) if sways else ''))
    return len(jolts)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    n = sum(read(p) for p in sys.argv[1:])
    sys.exit(1 if n else 0)
