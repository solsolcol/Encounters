#!/usr/bin/env python3
"""v29.0 · episode 5 chapter 1's spoken lines INTO THE ENGINE'S TABLES, from masters/v29.0/script/lines.json:
    python3 -I masters/v29.0/voices/install.py [--check]        (from the repo root; --check writes nothing)
src/voicelines.js is already written by masters/v29.0/script/registry.py --write (VOICES, CP8.4). This writes src/main.js
only, between markers of its own (a second run changes nothing it has already done, and nothing outside them), each
placed by a unique-string edit after episode 4 chapter 5's own block (the v14.1 rule):
  ADULT_TAKES   Master Zavier's lines (his bus)                                    /* E5C1 ADULT BEGIN */ .. END
  CAST_TAKES    Grandmaster Pho's, Grace's and Marcus's spoken lines, and the phone
                copies of Pho's spoken lines (speech, so they take the duck)        /* E5C1 CAST BEGIN */ .. END
  STING_SAMPLE  every line's row and every phone copy's, the names a scene cues     /* E5C1 VOICES BEGIN */ .. END
THE TWO CHANTS (ph51ratana, ph51jina) and the chant's phone copy (ph51jinatel) are in STING_SAMPLE only, never in a bus
table: a long chant on the voice path holds the duck down under everything (v24.0); they play on the effects path,
levelled by VOICES to RMS -17. Every line's two files and every phone copy's must be on disk, or nothing is written."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
L = json.load(open(os.path.join(HERE, '..', 'script', 'lines.json'), encoding='utf-8'))
rows = L['lines']; CHECK = '--check' in sys.argv
CHANTS = {r['key'] for r in rows if r.get('times')}
assert CHANTS == {'ph51ratana', 'ph51jina'}, ('the chants are not the two expected', sorted(CHANTS))
keys = [r['key'] for r in rows]
tels = [r['phone'] for r in rows if r.get('phone')]
assert len(set(keys)) == len(keys) and len(set(tels)) == len(tels), 'a key twice'
def has(k): return os.path.isfile(os.path.join(ROOT, 'assets/audio', k + '.mp3')) and os.path.isfile(os.path.join(ROOT, 'assets/audio-opus', k + '.ogg'))
miss = [k for k in keys + tels if not has(k)]
assert not miss, ('files missing', miss)
his = [r['key'] for r in rows if r['who'] == 'zv']
adult = open(os.path.join(HERE, 'ADULT_TAKES.txt'), encoding='utf-8').read().split()
assert set(his) == set(adult), 'ADULT_TAKES.txt and the zv lines differ'
cast = [r['key'] for r in rows if r['who'] != 'zv' and r['key'] not in CHANTS]
chant_tels = {r['phone'] for r in rows if r.get('phone') and r['key'] in CHANTS}
cast += [t for t in tels if t not in chant_tels]

def once(s, old, new):
    assert s.count(old) == 1, 'anchor not unique (%d): %s' % (s.count(old), old[:80])
    return s.replace(old, new)
def between(s, a, b, body, place):
    if a not in s: s = place(s)
    assert s.count(a) == 1 and s.count(b) == 1, 'markers: ' + a
    i = s.index(a) + len(a); j = s.index(b, i)
    return s[:i] + body + s[j:]
def listed(ks, per=10):
    return '\n'.join('  ' + ', '.join("'%s'" % k for k in ks[i:i + per]) + ',' for i in range(0, len(ks), per))

mp = os.path.join(ROOT, 'src', 'main.js'); m0 = m = open(mp, encoding='utf-8').read()
AB, AE = '  /* E5C1 ADULT BEGIN: v29.0, episode 5 chapter 1 (masters/v29.0/voices/install.py) */', '  /* E5C1 ADULT END */'
m = between(m, AB, AE, '\n' + listed(his) + '\n',
            lambda s: once(s, '  /* E4C5 ADULT END */]);', '  /* E4C5 ADULT END */\n' + AB + '\n' + AE + ']);'))
CB, CE = ('  /* E5C1 CAST BEGIN: v29.0, episode 5 chapter 1: Grandmaster Pho, Grace, Marcus, and Pho on the phone '
          '(masters/v29.0/voices/install.py) */', '  /* E5C1 CAST END */')
m = between(m, CB, CE, '\n' + listed(cast) + '\n',
            lambda s: once(s, '  /* E4C5 CAST END */]);', '  /* E4C5 CAST END */\n' + CB + '\n' + CE + ']);'))
sting, line = [], ' '
for k in keys + tels:
    piece = " %s: ['%s', 1]," % (k, k)
    if len(line) + len(piece) > 118: sting.append(line); line = ' '
    line += piece
sting.append(line)
VB, VE = ("  /* E5C1 VOICES BEGIN: v29.0, episode 5 chapter 1's voices, the two chants and Pho's phone copies "
          "(masters/v29.0/voices/install.py) */", '  /* E5C1 VOICES END */')
m = between(m, VB, VE, '\n' + '\n'.join(sting) + '\n',
            lambda s: once(s, '  /* E5C1 FX BEGIN:', VB + '\n' + VE + '\n  /* E5C1 FX BEGIN:'))
i = m.index('const STING_SAMPLE = {'); j = m.index('\n};', i)
have = re.findall(r"([A-Za-z0-9_]+): \['", m[i:j]); dup = sorted({k for k in have if have.count(k) > 1})
assert not dup, ('STING_SAMPLE rows twice', dup)
assert not [k for k in keys + tels if k not in have]
print('%d lines and %d phone copies: %d his, %d the cast bus (chants on the effects path); main.js %s%s' % (
      len(keys), len(tels), len(his), len(cast), 'changed' if m != m0 else 'unchanged', ' (--check: nothing written)' if CHECK else ''))
if not CHECK and m != m0: open(mp, 'w', encoding='utf-8').write(m)
