"""v25.0 CP10-CP11 · install episode 4 chapter 2's recorded sound into the game, every edit a unique-string replacement
(the v14.1 rule), and idempotent: run it again and it changes nothing it has already done.
  1. the registry (src/voicelines.js): the chapter's three new speakers (Lersi Chin, the two customers), its 91 lines
     between E4C2 LINES markers after chapter 1's, each `secs` measured from its shipped take (the Opus file's own
     length), the chapter's name in CHAPTERS. A row's words are the script's (masters/v25.0/script/lines.py): every
     English take was heard saying them (voices/picks.json); the chant is Pali, its words are the chant's.
  2. the chapter's SECS (masters/v25.0/parts/a_head.js, between its markers): the same measured lengths, grouped by
     speaker; reassemble (assemble.py) to carry them into src/chapters/e4/e4c2.js
  3. the engine (src/main.js): his lines in ADULT_TAKES, the cast's in CAST_TAKES (the chant among them: it is Lersi
     Chin's own words, captioned, and the clearing's music sits under it — e3c3's md3chant and mk3chant are voices too),
     and a STING_SAMPLE row for every voice line, effect, bed and music cue the chapter plays
usage: python3 -I masters/v25.0/install.py [--check]   (run from the repo root)"""
import json, os, re, subprocess, sys
CHECK = '--check' in sys.argv
VL, PART, MAIN, CH = 'src/voicelines.js', 'masters/v25.0/parts/a_head.js', 'src/main.js', 'src/chapters/e4/e4c2.js'
vl, part, main = open(VL, encoding='utf-8').read(), open(PART, encoding='utf-8').read(), open(MAIN, encoding='utf-8').read()

ns = {}
src = open('masters/v25.0/script/lines.py', encoding='utf-8').read()
exec(compile(src.split('if __name__')[0], 'lines.py', 'exec'), ns)
LINES = ns['LINES']
assert len(LINES) == 91, len(LINES)

def dur(name):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                        f'assets/audio-opus/{name}.ogg'], capture_output=True, text=True)
    return round(float(r.stdout.strip()), 2)
secs = {lid: dur(lid) for lid, _, _, _ in LINES}

def js(s):                                         # a JS double-quoted string
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

# 1 · the registry
SPK_ANCHOR = '    taxi4: { name: "The taxi uncle in Singapore (episode 4, chapter 1)", voice: "HxkJ72rJ50z9kcGPPnG7", model: "eleven_v3",'
assert vl.count(SPK_ANCHOR) == 1
if 'lersichin: { name:' not in vl:
    i = vl.index(SPK_ANCHOR); j = vl.index('},', i) + 2            # the end of taxi4's entry
    add = ('\n    /* v25.0 · episode 4 chapter 2 — Lersi Chin (CP1: three voices auditioned on his key lines, Mart-Podcast picked\n'
           '       by pace, previews to Chad) and the two customers at his counter, heard only (cast from the library\'s\n'
           '       descriptions, no audition; masters/v25.0/make.sh) */\n'
           '    lersichin: { name: "Lersi Chin, the lersi Pong brings to his shop (episode 4, chapter 2)", voice: "2rg92Q2u0RWu8LiUcLQA", model: "eleven_v3",\n'
           '              note: "Mart-Podcast: Thai-accented English, calm and unhurried at 2.34 words a second (CP1: Pikiir 3.50, Framel 2.88). He says what he BELIEVES, never what is certain; he says thank you, never anumodana. RMS -16; his soft lines and the chant -17." },\n'
           '    cust2a: { name: "A woman at his counter (episode 4, chapter 2)", voice: "keq9BWrGRYbiHfZFjX0i", model: "eleven_v3",\n'
           '              note: "Jacqueline: a distinctive Singaporean accent. Heard only, never seen. Her first question smeared and slowed in the fog (make.sh). RMS -16." },\n'
           '    cust2b: { name: "A man at his counter (episode 4, chapter 2)", voice: "y6hZ25Fcq4pmYsc7UsbQ", model: "eleven_v3",\n'
           '              note: "Gavin: natural, warm, conversational. Heard only, never seen. RMS -16." },')
    vl = vl[:j] + add + vl[j:]
END1 = '    /* E4C1 LINES END */\n'
assert vl.count(END1) == 1
rows = []
for lid, who, where, text in LINES:
    rows.append(f'    {{ id: {js(lid)}, who: {js(who)}, ch: "e4c2", where: {js(where)},\n      text: {js(text)}, secs: {secs[lid]} }},')
block = '    /* E4C2 LINES BEGIN — episode 4 chapter 2, Not Every Master Should Be Trusted (masters/v25.0: the script, the picks, the chain) */\n' + '\n'.join(rows) + '\n    /* E4C2 LINES END */\n'
if '/* E4C2 LINES BEGIN' in vl:
    a = vl.index('    /* E4C2 LINES BEGIN'); b = vl.index('    /* E4C2 LINES END */\n') + len('    /* E4C2 LINES END */\n')
    vl = vl[:a] + block + vl[b:]
else:
    vl = vl.replace(END1, END1 + block)
C0 = '    e4c1: "Episode 4 · Chapter 1 · The Master I Did Not Know"\n'
if '    e4c2: "Episode 4' not in vl:
    assert vl.count(C0) == 1
    vl = vl.replace(C0, '    e4c1: "Episode 4 · Chapter 1 · The Master I Did Not Know",\n    e4c2: "Episode 4 · Chapter 2 · Not Every Master Should Be Trusted"\n')
print('registry:', len(rows), 'rows')

# 2 · the chapter's SECS (in its part; assemble.py carries it into e4c2.js)
s0, s1 = part.index('  /* SECS BEGIN */'), part.index('  /* SECS END */') + len('  /* SECS END */')
groups = {}
for lid, who, _, _ in LINES:
    k = re.match(r'[a-z]+[0-9]', lid).group(0)
    groups.setdefault(k, []).append(f"'{lid}': {secs[lid]}")      # QUOTED: build.py gives a sound to a chapter's pack only when it is named in quotes (v21.1)
NAMES = {'q2': 'him', 'pg2': 'Pong', 'lc2': 'Lersi Chin', 'cu2': 'the customers'}
out = ['  /* SECS BEGIN */', '  const SECS = {      // MEASURED from the shipped takes (masters/v25.0/install.py; the registry carries the same numbers)']
for k, items in groups.items():
    out.append(f'    /* {NAMES.get(k, k)} */')
    cur = '   '
    for it in items:
        if len(cur) + len(it) + 2 > 118: out.append(cur.rstrip()); cur = '   '
        cur += ' ' + it + ','
    out.append(cur.rstrip())
out[-1] = out[-1].rstrip(',')
out += ['  };', '  /* SECS END */']
part = part[:s0] + '\n'.join(out) + part[s1:]

# 3 · the engine
him = [lid for lid, who, _, _ in LINES if who == 'jamesAdult']
cast = [lid for lid, who, _, _ in LINES if who != 'jamesAdult']
def wrap(ids, ind='  '):
    o, line = [], ind
    for x in ids:
        t = f"'{x}', "
        if len(line) + len(t) > 118: o.append(line.rstrip()); line = ind
        line += t
    o.append(line.rstrip().rstrip(','))
    return '\n'.join(o)
A0 = "  'q1D2', 'q1D3', 'q1D4', 'q1D5', 'q1K1', 'q1K2', 'q1K3', 'q1A', 'q1B', 'q1C', 'q1D']);"
if "'q2o1'" not in main.split('const ADULT_TAKES')[1].split(']);')[0]:
    assert main.count(A0) == 1
    main = main.replace(A0, "  'q1D2', 'q1D3', 'q1D4', 'q1D5', 'q1K1', 'q1K2', 'q1K3', 'q1A', 'q1B', 'q1C', 'q1D',\n"
                        "  /* v25.0 · episode 4 chapter 2, Not Every Master Should Be Trusted (masters/v25.0/make.sh) */\n" + wrap(him) + "]);")
C1 = "  'fm1C2', 'pg1C1', 'pn1C1', 'pg1C2', 'pg1D1', 'fm1D1', 'pg1D2', 'pg1D3', 'tx1where']);"
if "'lc2v1'" not in main.split('const CAST_TAKES')[1].split(']);')[0]:
    assert main.count(C1) == 1
    main = main.replace(C1, "  'fm1C2', 'pg1C1', 'pn1C1', 'pg1C2', 'pg1D1', 'fm1D1', 'pg1D2', 'pg1D3', 'tx1where',\n"
                        "  /* v25.0 · episode 4 chapter 2: Pong (his call and ending A's on a phone's band), Lersi Chin (his chant among his\n"
                        "     lines: his own words, captioned, the clearing's music under them), the woman and the man at his counter */\n" + wrap(cast) + "]);")
ch = open(CH, encoding='utf-8').read()
cued = set(re.findall(r"\bsfx(?:Fade)?\(\s*[^,)]+,\s*'(x2[A-Za-z0-9]+)'", ch)) | set(re.findall(r"\bworldSfx\(\s*'(x2[A-Za-z0-9]+)'", ch))
beds = re.search(r"ambience: \{ beds: \[(.*?)\] \}", ch, re.S).group(1)
cued |= set(re.findall(r"'(x2[A-Za-z0-9]+)'", beds))
# and every sound play names through a table (the search's SEARCH, warmed by WARM_*): any quoted x2 name with a file
cued |= {x for x in re.findall(r"'(x2[A-Za-z0-9]+)'", ch) if os.path.isfile(f'assets/audio-opus/{x}.ogg')}
fxs = sorted(cued)
names = [lid for lid, _, _, _ in LINES] + fxs
S0 = "  w4endA0: ['w4endA0', 1], w4endB0: ['w4endB0', 1], w4endD0: ['w4endD0', 1], w4codamus: ['w4codamus', 1]\n};"
body = main.split('const STING_SAMPLE = {')[1].split('\n};')[0]
have = set(re.findall(r"([A-Za-z0-9_]+): \['", body))
new = [x for x in names if x not in have]
if new:
    assert main.count(S0) == 1
    lines, line = [], '  '
    for x in new:
        t = f"{x}: ['{x}', 1], "
        if len(line) + len(t) > 118: lines.append(line.rstrip()); line = '  '
        line += t
    lines.append(line.rstrip().rstrip(','))
    main = main.replace(S0, "  w4endA0: ['w4endA0', 1], w4endB0: ['w4endB0', 1], w4endD0: ['w4endD0', 1], w4codamus: ['w4codamus', 1],\n"
                        "  /* v25.0 · episode 4 chapter 2: its voices, effects, beds and music (masters/v25.0/make.sh) */\n" + '\n'.join(lines) + "\n};")
print('cued:', ' '.join(fxs))
print('engine: him', len(him), 'cast', len(cast), 'sting rows added', len(new), 'of', len(names), '| effects, beds and music cued:', len(fxs))
missing = [x for x in names if not (os.path.isfile(f'assets/audio/{x}.mp3') and os.path.isfile(f'assets/audio-opus/{x}.ogg'))]
print('files missing:', missing)
if CHECK: sys.exit(0)
open(VL, 'w', encoding='utf-8').write(vl); open(PART, 'w', encoding='utf-8').write(part); open(MAIN, 'w', encoding='utf-8').write(main)
json.dump(secs, open('masters/v25.0/secs.json', 'w'), indent=1)
print('written; now: python3 -I masters/v25.0/assemble.py')
