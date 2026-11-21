#!/usr/bin/env python3
"""v28.0 · episode 4 chapter 5's spoken lines INTO THE GAME, from voices/registry.json (registry.py writes it):
    python3 -I masters/v28.0/voices/install.py [--check]        (from the repo root; --check writes nothing)
Run it ONLY when the engine's helper has let go of src/main.js: it writes, between markers of its own (so a second run
changes nothing it has already done, and nothing outside them):
  src/main.js        ADULT_TAKES   his own lines (his bus)                        /* E4C5 ADULT BEGIN */ .. END
                     CAST_TAKES    everyone else's (the flat cast bus)             /* E4C5 CAST BEGIN */ .. END
                     STING_SAMPLE  every line's row, the name a scene cues it by    /* E4C5 VOICES BEGIN */ .. END
  src/voicelines.js  the three new speakers, every line's registry row, and the chapter's name on the sheet.
Both files in ONE run, because chaptertest fails a jamesAdult row that ADULT_TAKES lacks: the registry rows are held
here (not written into src/voicelines.js beforehand) so that `node chaptertest.mjs` exits 0 before and after.
Every line's two files (assets/audio/<key>.mp3, assets/audio-opus/<key>.ogg) must be there, or nothing is written.
Markers are placed by unique-string edits after chapter 4's own (the v14.1 rule); chapter 4's blocks are untouched."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
R = json.load(open(os.path.join(HERE, 'registry.json'), encoding='utf-8'))
rows = R['rows']; CHECK = '--check' in sys.argv
miss = [x['id'] for x in rows if not (os.path.isfile(os.path.join(ROOT, 'assets/audio', x['id'] + '.mp3')) and os.path.isfile(os.path.join(ROOT, 'assets/audio-opus', x['id'] + '.ogg')))]
assert not miss, ('files missing', miss)
assert len({x['id'] for x in rows}) == len(rows), 'a key twice'

def once(s, old, new):
    assert s.count(old) == 1, 'anchor not unique (%d): %s' % (s.count(old), old[:80])
    return s.replace(old, new)
def between(s, a, b, body, place):
    if a not in s: s = place(s)
    assert s.count(a) == 1 and s.count(b) == 1, 'markers: ' + a
    i = s.index(a) + len(a); j = s.index(b, i)
    return s[:i] + body + s[j:]
def js(s): return json.dumps(s, ensure_ascii=False)
def listed(keys, per=10):
    return '\n'.join('  ' + ', '.join("'%s'" % k for k in keys[i:i + per]) + ',' for i in range(0, len(keys), per))

# ---- src/main.js
mp = os.path.join(ROOT, 'src', 'main.js'); m0 = m = open(mp, encoding='utf-8').read()
his = [x['id'] for x in rows if x['who'] == 'jamesAdult']; cast = [x['id'] for x in rows if x['who'] != 'jamesAdult']
AB, AE = '  /* E4C5 ADULT BEGIN: v28.0, episode 4 chapter 5 (masters/v28.0/voices/install.py) */', '  /* E4C5 ADULT END */'
m = between(m, AB, AE, '\n' + listed(his) + '\n',
            lambda s: once(s, '  /* E4C4 ADULT END */]);', '  /* E4C4 ADULT END */\n' + AB + '\n' + AE + ']);'))
CB, CE = '  /* E4C5 CAST BEGIN: v28.0, episode 4 chapter 5: Grandmaster Pho, Ton, Jun, Mr Koh, the collector (masters/v28.0/voices/install.py) */', '  /* E4C5 CAST END */'
m = between(m, CB, CE, '\n' + listed(cast) + '\n',
            lambda s: once(s, '  /* E4C4 CAST END */]);', '  /* E4C4 CAST END */\n' + CB + '\n' + CE + ']);'))
sting, line = [], ' '
for x in rows:
    piece = " %s: ['%s', 1]," % (x['id'], x['id'])
    if len(line) + len(piece) > 118: sting.append(line); line = ' '
    line += piece
sting.append(line)
VB, VE = "  /* E4C5 VOICES BEGIN: v28.0, episode 4 chapter 5's voices (masters/v28.0/voices/install.py) */", '  /* E4C5 VOICES END */'
m = between(m, VB, VE, '\n' + '\n'.join(sting) + '\n',
            lambda s: once(s, '  /* E4C4 FX END */\n', '  /* E4C4 FX END */\n' + VB + '\n' + VE + '\n'))
# every row's key a STING_SAMPLE row, and in exactly one of the two buses
i = m.index('const STING_SAMPLE = {'); j = m.index('\n};', i)
have = re.findall(r"([A-Za-z0-9_]+): \['", m[i:j]); dup = sorted({k for k in have if have.count(k) > 1})
assert not dup, ('STING_SAMPLE rows twice', dup)
assert not [x['id'] for x in rows if x['id'] not in have]

# ---- src/voicelines.js
vp = os.path.join(ROOT, 'src', 'voicelines.js'); v0 = v = open(vp, encoding='utf-8').read()
SB, SE = "    /* E4C5 SPEAKERS BEGIN: episode 4 chapter 5's three new people (masters/v28.0/voices/install.py) */", '    /* E4C5 SPEAKERS END */'
spk = '\n' + ''.join('    %s: { name: %s, voice: %s, model: %s,\n              note: %s },\n' % (k, js(s['name']), js(s['voice']), js(s['model']), js(s['note'])) for k, s in R['speakers'].items()) + '    '
v = between(v, SB, SE, spk, lambda s: once(s, '        /* E4C4 SPEAKERS END */\n', '        /* E4C4 SPEAKERS END */\n' + SB + '\n' + SE + '\n'))
LB, LE = '    /* E4C5 LINES BEGIN — episode 4 chapter 5, The House With Nine Prai (masters/v28.0/voices: the script, the picks, the chain) */', '    /* E4C5 LINES END */'
body = '\n' + ''.join('    { id: %s, who: %s, ch: "e4c5", where: %s,\n      text: %s, secs: %.2f },\n' % (js(x['id']), js(x['who']), js(x['where']), js(x['text']), x['secs']) for x in rows) + '    '
v = between(v, LB, LE, body, lambda s: once(s, '        /* E4C4 LINES END */\n', '        /* E4C4 LINES END */\n' + LB + '\n' + LE + '\n'))
if 'e4c5: "' not in v:
    v = once(v, '    e4c4: "Episode 4 · Chapter 4 · The Woman Who Rose From Her Wheelchair"\n',
             '    e4c4: "Episode 4 · Chapter 4 · The Woman Who Rose From Her Wheelchair",\n    e4c5: %s\n' % js(R['chapter']))
print('%d lines: %d his, %d the cast; main.js %s, voicelines.js %s%s' % (len(rows), len(his), len(cast),
      'changed' if m != m0 else 'unchanged', 'changed' if v != v0 else 'unchanged', ' (--check: nothing written)' if CHECK else ''))
if not CHECK:
    if m != m0: open(mp, 'w', encoding='utf-8').write(m)
    if v != v0: open(vp, 'w', encoding='utf-8').write(v)
