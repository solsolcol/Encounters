"""v28.0 (E4C5, R76): THE LIMBS' OWN CHECK, READ. Reads the films' rows that tools/probes/e4c5films.mjs writes with LIMBS=1
(each row's K: tools/probes/limbclip.js's findings for that picture: a limb in a solid, two bodies in each other) and joins
each finding into SPANS (the same kind, the same two parties and limbs, rows no more than 0.25 s apart): the film, who,
from when to when, how deep at the deepest. A span of one row only is a passing touch and is listed apart. EXITS 1 on any
span deeper than FAIL (0.05 m) lasting two rows or more.
    python3 -I tools/probes/limbread.py <dir of *-seek-*.json> [FAIL=0.05]
"""
import glob
import json
import os
import sys


def main():
    d = sys.argv[1]
    fail = float(os.environ.get('FAIL', '0.05'))
    files = sorted(glob.glob(os.path.join(d, '*-seek-*.json')))
    if not files:
        print('limbread: no *-seek-*.json in', d)
        return 2
    worst = 0
    for f in files:
        R = json.load(open(f))
        job, rows = R.get('job'), R.get('rows') or []
        if not rows or 'K' not in rows[0]:
            print(job, ': no limb rows (LIMBS=1 not set)')
            continue
        open_spans, done = {}, []
        for r in rows:
            t = r['L'][0]
            seen = set()
            for k in r.get('K') or []:
                key = (k[0], k[1], k[2], str(k[3]), k[4])
                seen.add(key)
                s = open_spans.get(key)
                if s and t - s['t1'] <= 0.25:
                    s['t1'] = t; s['n'] += 1
                    if k[5] > s['d']:
                        s['d'] = k[5]; s['at'] = t
                else:
                    if s:
                        done.append(s)
                    open_spans[key] = {'key': key, 't0': t, 't1': t, 'n': 1, 'd': k[5], 'at': t}
        done.extend(open_spans.values())
        done.sort(key=lambda s: -s['d'])
        spans = [s for s in done if s['n'] >= 2]
        touches = [s for s in done if s['n'] < 2]
        bad = [s for s in spans if s['d'] > fail]
        worst += len(bad)
        print(f"== {job}: {len(rows)} rows, {len(spans)} spans ({len(bad)} deeper than {fail} m), {len(touches)} single-row touches")
        for s in spans[:40]:
            k = s['key']
            what = f"{k[1]} {k[2]} in solid #{k[3]}" if k[0] == 'w' else f"{k[1]} {k[2]} / {k[3]} {k[4]}"
            print(f"  {'FAIL ' if s['d'] > fail else '     '}{s['t0']:6.2f}-{s['t1']:6.2f}s  {s['d'] * 100:5.1f} cm at {s['at']:.2f}  {what}")
    print('limbread:', 'FAILED' if worst else 'clean', f'({worst} spans deeper than {fail} m)')
    return 1 if worst else 0


if __name__ == '__main__':
    sys.exit(main())
