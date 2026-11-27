#!/usr/bin/env python3
"""v29.0 · the photographs a person's takes are judged by (tools/shootclose.mjs), one spec a moment: from in front and from
his or her left side, 1000 x 1700, the body in the take at that share of its length (v25.3: a pose is judged full size,
from in front and beside the body).
  python3 -I masters/v29.0/people/takespec.py <file.glb> <height m> <outdir> <take>@<share>[,<share>] ...
writes <outdir>/t-<take>-<share>.json, one per moment; run each with shootclose.mjs <json> <outdir>/t-<take>-<share>-"""
import json, os, sys
f, h, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
k = h / 1.74
for spec in sys.argv[4:]:
    take, shares = spec.split('@')
    for s in shares.split(','):
        m = {'file': f, 'h': h, 'x': 0, 'z': 0, 'ry': 0, 'aniso': 4, 'clip': take, 'at': float(s)}
        j = {'bg': '#5a5e66', 'light': 'studio', 'env': 0.35, 'exposure': 1.15, 'floor': 0, 'models': [m], 'shots': [
            {'name': 'front', 'w': 1000, 'h': 1700, 'fov': 30, 'pos': [0, round(0.95 * k, 3), round(3.4 * k, 3)], 'at': [0, round(0.8 * k, 3), 0]},
            {'name': 'side', 'w': 1000, 'h': 1700, 'fov': 30, 'pos': [round(3.4 * k, 3), round(0.95 * k, 3), 0], 'at': [0, round(0.8 * k, 3), 0]}]}
        json.dump(j, open(os.path.join(out, 't-%s-%s.json' % (take, s)), 'w'))
