#!/usr/bin/env python3
"""v27.0 · episode 4 chapter 4: its spoken lines written into the game (M8), from the script and the picks:
    python3 -I masters/v27.0/voices/registry.py        (run from the repo root, after pick.py and chain.py)

Each line the chapter speaks needs, beside its two files (chain.py), five things, and this writes all five between
markers of its own (so it can be run again and changes nothing else):
  1. src/voicelines.js   its registry row (who, where, the words as said with their one tag, the measured length), and
                         the three new speakers (Amma, Ravi, Mala) and the chapter's name on the sheet;
  2. src/main.js         ADULT_TAKES (his own lines, his bus) or CAST_TAKES (everyone else's, the flat cast bus);
  3. src/main.js         its STING_SAMPLE row, the name a scene or play cues it by;
  4. masters/v27.0/script/measured.json   the length of the file the game plays (the Opus, which the chain measured),
                         which secs.py writes into the chapter's SECS table (run it after this);
  5. the registry's words are what is HEARD (v5.14): each picked take's transcript is set beside its script here, and
     a line whose words differ is printed and refused until it is looked at.
"""
import importlib.util, io, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
spec = importlib.util.spec_from_file_location('lines', os.path.join(HERE, '..', 'script', 'lines.py'))
L = importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
PROMPTS = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))}
PICKS = json.load(open(os.path.join(HERE, 'picks.json'), encoding='utf-8'))
WHO = {'he': 'jamesAdult', 'pho': 'pho', 'amma': 'amma', 'ravi': 'ravi', 'mala': 'mala'}

def dur(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f],
                                check=True, capture_output=True, text=True).stdout.strip())

def norm(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s).lower().replace("'", '').replace('’', '')
    return [w for w in re.sub(r'[^a-z0-9 ]+', ' ', s).split() if w]

def between(s, a, b, body, where):
    """the text between the markers a and b replaced by body; if the markers are not there yet, `where` puts them in"""
    if a not in s:
        s = where(s)
        assert a in s and b in s, 'markers not placed: ' + a
    i = s.index(a) + len(a); j = s.index(b, i)
    return s[:i] + body + s[j:]

def once(s, old, new):
    assert s.count(old) == 1, 'anchor not unique: ' + old[:70]
    return s.replace(old, new)

# ---- the lines: words, lengths, and what was heard
rows, measured, bad = [], {}, []
for key, speaker, where, text in L.LINES:
    assert key in PROMPTS and key in PICKS, key + ': no prompt or no pick'
    ogg = os.path.join(ROOT, 'assets', 'audio-opus', key + '.ogg'); mp3 = os.path.join(ROOT, 'assets', 'audio', key + '.mp3')
    assert os.path.exists(ogg) and os.path.exists(mp3), key + ': no file (run chain.py first)'
    secs = round(dur(ogg), 2); measured[key] = secs
    heard = PICKS[key]['takes'][PICKS[key]['pick']]['heard']
    if norm(heard) != norm(text): bad.append('%s  script: %s\n        heard:  %s' % (key, text, heard))
    rows.append((key, WHO[speaker], where, PROMPTS[key]['prompt'], secs))
if bad:
    print('THE WORDS HEARD ARE NOT THE SCRIPT\'S (look, then re-say or write down what is said):')
    print('\n'.join(bad))
    if '--accept' not in sys.argv: sys.exit(1)

def js(s): return json.dumps(s, ensure_ascii=False)

# ---- 1. src/voicelines.js
vp = os.path.join(ROOT, 'src', 'voicelines.js'); v = io.open(vp, encoding='utf-8').read()
SPK = '''
    amma: { name: "Amma, the lady in the wheelchair (episode 4, chapter 4)", voice: "cyzr0852QKE5DHnjiRWw", model: "eleven_v3",
              note: "Tara: an older Indian woman, soft; the measured pick of three (masters/v27.0/make.sh), until Chad's ear. One line in her own voice; three takes, the unhurried read the pick. RMS -16." },
    ravi: { name: "Ravi, her son (episode 4, chapter 4)", voice: "mnlHLlgagNmPlvf52KvT", model: "eleven_v3",
              note: "Dhananjay: a Singaporean Indian man of about forty, tired and protective; the measured pick of three, until Chad's ear. RMS -16." },
    mala: { name: "Mala, her daughter (episode 4, chapter 4)", voice: "PIuCDYHMakaExG7GFyLU", model: "eleven_v3",
              note: "Sonam: kept well apart from her mother's pitch; the measured pick of three, until Chad's ear. RMS -16." },
'''
v = between(v, '    /* E4C4 SPEAKERS BEGIN: episode 4 chapter 4\'s three new people (masters/v27.0/voices/registry.py) */',
            '    /* E4C4 SPEAKERS END */', SPK + '    ',
            lambda s: once(s, '    /* E4C1 SPEAKERS END */',
                           '    /* E4C4 SPEAKERS BEGIN: episode 4 chapter 4\'s three new people (masters/v27.0/voices/registry.py) */\n'
                           '    /* E4C4 SPEAKERS END */\n    /* E4C1 SPEAKERS END */'))
body = '\n' + ''.join('    { id: %s, who: %s, ch: "e4c4", where: %s,\n      text: %s, secs: %s },\n'
                      % (js(k), js(w), js(wh), js(t), ('%.2f' % s)) for k, w, wh, t, s in rows) + '    '
v = between(v, '    /* E4C4 LINES BEGIN — episode 4 chapter 4, The Woman Who Rose From Her Wheelchair (masters/v27.0: the script, the picks, the chain) */',
            '    /* E4C4 LINES END */', body,
            lambda s: once(s, '    /* E4C3 LINES END */\n',
                           '    /* E4C3 LINES END */\n'
                           '    /* E4C4 LINES BEGIN — episode 4 chapter 4, The Woman Who Rose From Her Wheelchair (masters/v27.0: the script, the picks, the chain) */\n'
                           '    /* E4C4 LINES END */\n'))
if 'e4c4: "' not in v:
    v = once(v, '    e4c3: "Episode 4 · Chapter 3 · I Finally Found My Answers"\n',
             '    e4c3: "Episode 4 · Chapter 3 · I Finally Found My Answers",\n'
             '    e4c4: "Episode 4 · Chapter 4 · The Woman Who Rose From Her Wheelchair"\n')
io.open(vp, 'w', encoding='utf-8').write(v)

# ---- 2 and 3. src/main.js: the buses and the sound rows
mp = os.path.join(ROOT, 'src', 'main.js'); m = io.open(mp, encoding='utf-8').read()
def listed(keys, per=10):
    out = []
    for i in range(0, len(keys), per): out.append('  ' + ', '.join("'%s'" % k for k in keys[i:i + per]) + ',')
    return '\n'.join(out)
his = [k for k, w, *_ in rows if w == 'jamesAdult']; cast = [k for k, w, *_ in rows if w != 'jamesAdult']
m = between(m, '  /* E4C4 ADULT BEGIN: v27.0, episode 4 chapter 4 (masters/v27.0/voices/registry.py) */',
            '  /* E4C4 ADULT END */', '\n' + listed(his) + '\n',
            lambda s: once(s, "'q3C4', 'q3D0', 'q3D1', 'q3D2', 'q3D3', 'q3D4', 'q3D5', 'q3z1', 'q3K1', 'q3A', 'q3B', 'q3C', 'q3D']);",
                           "'q3C4', 'q3D0', 'q3D1', 'q3D2', 'q3D3', 'q3D4', 'q3D5', 'q3z1', 'q3K1', 'q3A', 'q3B', 'q3C', 'q3D',\n"
                           "  /* E4C4 ADULT BEGIN: v27.0, episode 4 chapter 4 (masters/v27.0/voices/registry.py) */\n"
                           "  /* E4C4 ADULT END */]);"))
m = between(m, '  /* E4C4 CAST BEGIN: v27.0, episode 4 chapter 4: Grandmaster Pho, Amma, Ravi, Mala (masters/v27.0/voices/registry.py) */',
            '  /* E4C4 CAST END */', '\n' + listed(cast) + '\n',
            lambda s: once(s, "  'ph3z2']);",
                           "  'ph3z2',\n"
                           "  /* E4C4 CAST BEGIN: v27.0, episode 4 chapter 4: Grandmaster Pho, Amma, Ravi, Mala (masters/v27.0/voices/registry.py) */\n"
                           "  /* E4C4 CAST END */]);"))
sting = []
line = ' '
for k, *_ in rows:
    piece = " %s: ['%s', 1]," % (k, k)
    if len(line) + len(piece) > 118: sting.append(line); line = ' '
    line += piece
sting.append(line)
m = between(m, '  /* E4C4 SOUNDS BEGIN: v27.0, episode 4 chapter 4\'s voices (masters/v27.0/voices/registry.py) */',
            '  /* E4C4 SOUNDS END */', '\n' + '\n'.join(sting) + '\n',
            lambda s: once(s, "  x3chantb: ['x3chantb', 1], x3chanty: ['x3chanty', 1], x3cry: ['x3cry', 1], x3fold: ['x3fold', 1]\n};",
                           "  x3chantb: ['x3chantb', 1], x3chanty: ['x3chanty', 1], x3cry: ['x3cry', 1], x3fold: ['x3fold', 1],\n"
                           "  /* E4C4 SOUNDS BEGIN: v27.0, episode 4 chapter 4's voices (masters/v27.0/voices/registry.py) */\n"
                           "  /* E4C4 SOUNDS END */\n};"))
io.open(mp, 'w', encoding='utf-8').write(m)

# ---- 4. the lengths, for secs.py
json.dump(measured, open(os.path.join(HERE, '..', 'script', 'measured.json'), 'w'), indent=1, sort_keys=True)
print('%d lines: %d his, %d the cast; registry, buses, sound rows and measured.json written' % (len(rows), len(his), len(cast)))
