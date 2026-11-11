#!/usr/bin/env python3
"""v26.0 · writes the chapter's SECS table (masters/v26.0/parts/a_head.js, between SECS BEGIN and SECS END) from
masters/v26.0/script/lines.py: a MEASURED length where a take has been measured (masters/v26.0/script/measured.json,
written at M7 as each take is picked), else the estimate at its speaker's pace. Run from the repo root:
    python3 -I masters/v26.0/script/secs.py
"""
import importlib.util, io, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('lines', os.path.join(HERE, 'lines.py')); L = importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
HEAD = os.path.join(HERE, '..', 'parts', 'a_head.js')
mp = os.path.join(HERE, 'measured.json')
measured = json.load(open(mp)) if os.path.exists(mp) else {}
rows, n_meas = [], 0
by = {}
for k, s, _w, t in L.LINES:
    v = measured.get(k)
    if v is None: v = L.estimate(s, t)
    else: n_meas += 1
    by.setdefault(s, []).append("'%s': %s" % (k, ('%.2f' % v).rstrip('0').rstrip('.')))
names = {'he': 'him', 'ton': 'Ton', 'aunt': 'the woman at his bench', 'pho': 'Grandmaster Pho'}
out = ["  const SECS = {      // %d of %d MEASURED from their takes; the rest estimated at the speaker's pace" % (n_meas, len(L.LINES))]
keys = list(by)
for i, s in enumerate(keys):
    out.append('    /* %s */' % names[s])
    items = by[s]
    line = '   '
    for j, it in enumerate(items):
        last = (i == len(keys) - 1 and j == len(items) - 1)
        piece = ' ' + it + ('' if last else ',')
        if len(line) + len(piece) > 118: out.append(line); line = '   '
        line += piece
    out.append(line)
out.append('  };')
s = io.open(HEAD, encoding='utf-8').read()
m = re.search(r'(  /\* SECS BEGIN \*/\n)(.*?)(  /\* SECS END \*/\n)', s, re.S)
assert m, 'SECS markers not found'
s = s[:m.start(2)] + '\n'.join(out) + '\n' + s[m.end(2):]
io.open(HEAD, 'w', encoding='utf-8').write(s)
print('SECS written: %d lines, %d measured' % (len(L.LINES), n_meas))
