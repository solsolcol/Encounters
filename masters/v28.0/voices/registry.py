#!/usr/bin/env python3
"""v28.0 · episode 4 chapter 5: its spoken lines measured and prepared for the game (M10), after pick.py and chain.py:
    python3 -I masters/v28.0/voices/registry.py [--accept]        (from the repo root)
  1. the words HEARD (v5.14): each picked take's transcript set beside the script; a line whose words differ is printed
     and refused until it is looked at (--accept writes what is heard into WORDS_AS_SAID below first, by hand);
  2. the three COPIES (copies.json: ph5v1 = chapter 4's ph4b9, ph5v2 = ph4b8, ph5t5 = ph5w6) made as files of their own,
     the same bytes, so no chapter cues another's sound by name (v7.1);
  3. every line's MEASURED length (the Opus the game plays, as chapter 4 measured it) written into its row of
     masters/v28.0/script/lines.json as `secs` (only that field: the rows' own text is untouched, line by line);
  4. voices/registry.json: the rows src/voicelines.js takes (who, where, the words as said with their one tag, the
     length) and the three new speakers; install.py writes them, with the engine's rows, when the engine is free.
Then `python3 -I masters/v28.0/assemble.py` writes the measured lengths into the chapter's SECS."""
import json, os, re, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
LJ = os.path.join(HERE, '..', 'script', 'lines.json')
S = json.load(open(LJ, encoding='utf-8')); ROWS = {r['key']: r for r in S['lines']}
PROMPTS = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))}
PICKS = json.load(open(os.path.join(HERE, 'picks.json'), encoding='utf-8'))
COPY = json.load(open(os.path.join(HERE, 'copies.json'), encoding='utf-8'))
WHO = {'he': 'jamesAdult', 'pho': 'pho', 'ton': 'ton', 'jun': 'jun5', 'koh': 'koh5', 'collector': 'collector5'}
SPEAKERS = {
 'jun5': {'name': 'Jun, the second follower (episode 4, chapter 5)', 'voice': 'c86brOBXdSSYxT5FqIUS', 'model': 'eleven_v3',
          'note': 'Sam: a young Singaporean man, easy and friendly; the measured pick of six (masters/v28.0/voices/RECORD.md), until Chad\'s ear. RMS -16.'},
 'koh5': {'name': 'Mr Koh, the devotee (episode 4, chapter 5)', 'voice': '76X7rrvQajZEHM3u9zcd', 'model': 'eleven_v3',
          'note': 'Mr David: a middle-aged Malaysian Chinese man; the measured pick of three, until Chad\'s ear. RMS -16.'},
 'collector5': {'name': 'The collector (episode 4, chapter 5)', 'voice': 'eWKcOFrcmRNtJMcUZYOm', 'model': 'eleven_v3',
          'note': 'Shawn Ng: a younger Malaysian Chinese man, plain and tired; the measured pick of three, until Chad\'s ear. RMS -16.'}}
CHAPTER = 'Episode 4 · Chapter 5 · The House With Nine Prai'
WORDS_AS_SAID = {}     # key: the words a picked take says where the transcriber's differ from the script and the take is right

def dur(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], check=True, capture_output=True, text=True).stdout.strip())
def norm(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s).lower().replace("'", '').replace('’', '').replace('-', ' ')
    return [w for w in re.sub(r'[^a-z0-9 ]+', ' ', s).split() if w]
def files(k): return os.path.join(ROOT, 'assets', 'audio', k + '.mp3'), os.path.join(ROOT, 'assets', 'audio-opus', k + '.ogg')

# chapter 4's registry rows (for the words of the two lines copied from it)
vw = open(os.path.join(ROOT, 'src', 'voicelines.js'), encoding='utf-8').read()
def old_text(k):
    m = re.search(r'\{ id: "%s", who: "[^"]+", ch: "[^"]+", where: "(?:[^"\\]|\\.)*",\s*text: ("(?:[^"\\]|\\.)*")' % k, vw)
    assert m, k + ': no row in src/voicelines.js'
    return json.loads(m.group(1))

bad, rows, secs = [], [], {}
for r in S['lines']:
    k = r['key']
    if r.get('draft'): continue
    if k in COPY:
        _, src = COPY[k]
        for a, b in zip(files(src), files(k)):
            assert os.path.exists(a), src + ': no file to copy'
            if not os.path.exists(b) or open(a, 'rb').read() != open(b, 'rb').read(): shutil.copyfile(a, b)
        said = old_text(src) if src in vw and src.startswith('ph4') else PROMPTS[src]['prompt']
    else:
        assert k in PROMPTS and k in PICKS, k + ': no prompt or no pick'
        heard = PICKS[k]['takes'][PICKS[k]['pick']]['heard']
        want = WORDS_AS_SAID.get(k, r.get('say', r['text']))
        if norm(heard) != norm(want): bad.append('%s  script: %s\n        heard:  %s' % (k, want, heard))
        said = PROMPTS[k]['prompt']
    mp3, ogg = files(k)
    assert os.path.exists(mp3) and os.path.exists(ogg), k + ': no file (run chain.py first)'
    secs[k] = round(dur(ogg), 2)
    rows.append(dict(id=k, who=WHO[r['who']], ch='e4c5', where=r['where'], text=said, secs=secs[k]))
if bad:
    print("THE WORDS HEARD ARE NOT THE SCRIPT'S (listen, then re-say or write down what is said):"); print('\n'.join(bad))
    if '--accept' not in sys.argv: sys.exit(1)

# lines.json: `secs` only, row by row in its own lines
src = open(LJ, encoding='utf-8').read(); out = []
for line in src.split('\n'):
    m = re.match(r'(\s*\{ "key": "([A-Za-z0-9]+)",.*?)(, "secs": [0-9.]+)?( \},?)$', line)
    if m and m.group(2) in secs: line = '%s, "secs": %s%s' % (m.group(1), ('%.2f' % secs[m.group(2)]), m.group(4))
    out.append(line)
new = '\n'.join(out); N = json.loads(new)
strip = lambda d: [{a: b for a, b in x.items() if a != 'secs'} for x in d['lines']]
assert strip(N) == strip(S) and {a: b for a, b in N.items() if a != 'lines'} == {a: b for a, b in S.items() if a != 'lines'}
assert all(x.get('secs') == secs[x['key']] for x in N['lines'] if x['key'] in secs), 'a length did not land'
open(LJ, 'w', encoding='utf-8').write(new)
json.dump(dict(speakers=SPEAKERS, chapter=CHAPTER, rows=rows), open(os.path.join(HERE, 'registry.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('%d lines measured (%d copied); lines.json secs and registry.json written' % (len(rows), sum(1 for x in rows if x['id'] in COPY)))
