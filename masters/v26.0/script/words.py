#!/usr/bin/env python3
"""v26.0 · writes the chapter's WORDS table (masters/v26.0/parts/a_head.js, between WORDS BEGIN and WORDS END) from
masters/v26.0/script/lines.py: each line's words, with its speaker's name before them when it is not his own.

PREVIEW ONLY (the tracker's D12). Until the takes are made (M7), a preview build has no voice in it; the chapter shows
each line's words as a caption for as long as it is "said", so the build can be followed. The table and its two readers
(d_play.js subs, y_stage.js filmSubs) go when the chapter leaves preview. Run from the repo root:
    python3 -I masters/v26.0/script/words.py
"""
import importlib.util, io, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('lines', os.path.join(HERE, 'lines.py')); L = importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
HEAD = os.path.join(HERE, '..', 'parts', 'a_head.js')
WHO = {'he': '', 'ton': 'Ton: ', 'aunt': 'The woman at his bench: ', 'pho': 'Grandmaster Pho: '}
out = ['  const WORDS = {      // PREVIEW ONLY: %d lines, written by masters/v26.0/script/words.py' % len(L.LINES)]
for i, (k, s, _w, t) in enumerate(L.LINES):
    out.append("    '%s': %s%s" % (k, json.dumps(WHO[s] + t, ensure_ascii=False), '' if i == len(L.LINES) - 1 else ','))
out.append('  };')
s = io.open(HEAD, encoding='utf-8').read()
m = re.search(r'(  /\* WORDS BEGIN \*/\n)(.*?)(  /\* WORDS END \*/\n)', s, re.S)
assert m, 'WORDS markers not found'
s = s[:m.start(2)] + '\n'.join(out) + '\n' + s[m.end(2):]
io.open(HEAD, 'w', encoding='utf-8').write(s)
print('WORDS written: %d lines' % len(L.LINES))
