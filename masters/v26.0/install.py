"""v26.0 CP7 · install episode 4 chapter 3's recorded sound into the game. Every edit is a unique-string replacement
(the v14.1 rule) and the whole of it is idempotent: run it again and it changes nothing it has already done.
  1. the registry (src/voicelines.js): the chapter's three new speakers (Grandmaster Pho, Ton, the woman at his
     bench), its 104 lines between E4C3 LINES markers after chapter 2's, each `secs` measured from its shipped take
     (the Opus file's own length), the chapter's name in CHAPTERS. A row's words are what the PICKED take was given
     (voices/prompts.json, or voices/sessions-resay.json for a line said again): every take was heard saying them
     (voices/picks.json).
  2. the chapter's SECS: script/measured.json from the same lengths, then script/secs.py writes the head part; then
     assemble (masters/v26.0/assemble.py).
  3. the engine (src/main.js): his lines in ADULT_TAKES, the cast's in CAST_TAKES, and a STING_SAMPLE row for every
     voice line, effect, bed and music cue the chapter plays. The chant is NOT a voice here: it comes over the ground's
     loudspeakers as the ground's own sound (a long chant on the voice path holds the duck down under everything,
     v24.0), so it is an effect, and captioned.
usage: python3 -I masters/v26.0/install.py [--check]   (run from the repo root)"""
import json, os, re, subprocess, sys
CHECK = '--check' in sys.argv
VL, MAIN, CH = 'src/voicelines.js', 'src/main.js', 'src/chapters/e4/e4c3.js'
vl, main = open(VL, encoding='utf-8').read(), open(MAIN, encoding='utf-8').read()
H = 'masters/v26.0/'
PROMPTS = json.load(open(H + 'voices/prompts.json', encoding='utf-8'))
PICKS = json.load(open(H + 'voices/picks.json', encoding='utf-8'))
RESAY = json.load(open(H + 'voices/sessions-resay.json', encoding='utf-8'))['lines'] if os.path.exists(H + 'voices/sessions-resay.json') else {}
ns = {}; exec(compile(open(H + 'script/lines.py', encoding='utf-8').read(), 'lines.py', 'exec'), ns)
LINES = ns['LINES']; assert len(LINES) == 104, len(LINES)
WHO = {'he': 'jamesAdult', 'pho': 'pho', 'ton': 'ton', 'aunt': 'devotee3'}
prompt = {o['key']: o['prompt'] for o in PROMPTS}
def said(lid):                                   # what the picked take was given
    k = PICKS[lid]['pick']
    return RESAY[lid]['prompt'] if (lid in RESAY and k in 'cdef' and PICKS[lid]['who'] != 'pho') else prompt[lid]
def dur(name):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'assets/audio-opus/{name}.ogg'], capture_output=True, text=True)
    return round(float(r.stdout.strip()), 2)
secs = {lid: dur(lid) for lid, _, _, _ in LINES}
def js(s): return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

# 1 · the registry
SPK_END = '    /* E4C1 SPEAKERS END */\n'
assert vl.count(SPK_END) == 1
if '    pho: { name:' not in vl:
    add = ('    /* v26.0 · episode 4 chapter 3: three new people, each auditioned against two others on their own lines and picked by\n'
           '       measure until Chad\'s ear (masters/v26.0/audition; masters/v26.0/sound.sh says why each) */\n'
           '    pho: { name: "Grandmaster Pho (episode 4, chapter 3)", voice: "xYmBpJREC3WfqEFpbPvO", model: "eleven_v3",\n'
           '              note: "Songkran: Thai-accented English, the deepest of the three auditioned (82 to 87 Hz), and unhurried. Three takes a line; the UNHURRIED read is the pick (pick.py). Every line of his is wise and plain, and was put to Chad before it was voiced. His title is said in full by everyone. RMS -16." },\n'
           '    ton: { name: "Ton, of the forum, who brings him (episode 4, chapter 3)", voice: "uI1epevl1X6hqrxEciKt", model: "eleven_v3",\n'
           '              note: "Kirin: a natural, friendly Thai man at the game\'s pace (2.4 words a second in the audition), every word heard. RMS -16." },\n'
           '    devotee3: { name: "The woman at Grandmaster Pho\'s bench (episode 4, chapter 3)", voice: "B4NdgwdU97lHqA8Udh2D", model: "eleven_v3",\n'
           '              note: "Kanya: an older Thai woman, soft and unhurried. One line. RMS -16." },\n')
    vl = vl.replace(SPK_END, add + SPK_END)
END2 = '    /* E4C2 LINES END */\n'
assert vl.count(END2) == 1
rows = [f'    {{ id: {js(lid)}, who: {js(WHO[who])}, ch: "e4c3", where: {js(where)},\n      text: {js(said(lid))}, secs: {secs[lid]} }},' for lid, who, where, _ in LINES]
block = '    /* E4C3 LINES BEGIN — episode 4 chapter 3, I Finally Found My Answers (masters/v26.0: the script, the picks, the chain) */\n' + '\n'.join(rows) + '\n    /* E4C3 LINES END */\n'
if '/* E4C3 LINES BEGIN' in vl:
    a = vl.index('    /* E4C3 LINES BEGIN'); b = vl.index('    /* E4C3 LINES END */\n') + len('    /* E4C3 LINES END */\n')
    vl = vl[:a] + block + vl[b:]
else:
    vl = vl.replace(END2, END2 + block)
C0 = '    e4c2: "Episode 4 · Chapter 2 · Not Every Master Should Be Trusted"\n'
if '    e4c3: "Episode 4' not in vl:
    assert vl.count(C0) == 1
    vl = vl.replace(C0, '    e4c2: "Episode 4 · Chapter 2 · Not Every Master Should Be Trusted",\n    e4c3: "Episode 4 · Chapter 3 · I Finally Found My Answers"\n')
print('registry:', len(rows), 'rows')

# 3 · the engine
him = [lid for lid, who, _, _ in LINES if who == 'he']
cast = [lid for lid, who, _, _ in LINES if who != 'he']
def wrap(ids, ind='  '):
    o, line = [], ind
    for x in ids:
        t = f"'{x}', "
        if len(line) + len(t) > 118: o.append(line.rstrip()); line = ind
        line += t
    o.append(line.rstrip().rstrip(','))
    return '\n'.join(o)
def into_set(src, decl, ids, note, probe):
    i = src.index(decl); j = src.index(']);', i)
    if probe in src[i:j]: return src
    body = src[i:j].rstrip()
    return src[:i] + body + ',\n' + note + wrap(ids) + src[j:]
main = into_set(main, 'const ADULT_TAKES = new Set([', him, "  /* v26.0 · episode 4 chapter 3, I Finally Found My Answers (masters/v26.0/sound.sh) */\n", "'q3o1'")
main = into_set(main, 'const CAST_TAKES = new Set([', cast, "  /* v26.0 · episode 4 chapter 3: Grandmaster Pho, Ton, the woman at his bench (the chant is the ground's own sound, an\n     effect: not here) */\n", "'ph3g1'")
ch = open(CH, encoding='utf-8').read()
cued = set(re.findall(r"\bsfx(?:Fade)?\(\s*[^,)]+,\s*'(x3[A-Za-z0-9]+)'", ch)) | set(re.findall(r"\bworldSfx\(\s*'(x3[A-Za-z0-9]+)'", ch))
beds = re.search(r"ambience: \{ beds: \[(.*?)\] \}", ch, re.S).group(1)
cued |= set(re.findall(r"'(x3[A-Za-z0-9]+)'", beds))
cued |= {x for x in re.findall(r"'(x3[A-Za-z0-9]+)'", ch) if os.path.isfile(f'assets/audio-opus/{x}.ogg')}      # and every sound play names through a table
named = sorted(set(re.findall(r"'(x3[A-Za-z0-9]+)'", ch)))
fxs = sorted(cued); names = [lid for lid, _, _, _ in LINES] + fxs
i = main.index('const STING_SAMPLE = {'); j = main.index('\n};', i)
have = set(re.findall(r"([A-Za-z0-9_]+): \['", main[i:j]))
new = [x for x in names if x not in have]
if new:
    lines, line = [], '  '
    for x in new:
        t = f"{x}: ['{x}', 1], "
        if len(line) + len(t) > 118: lines.append(line.rstrip()); line = '  '
        line += t
    lines.append(line.rstrip().rstrip(','))
    main = main[:j].rstrip() + ',\n  /* v26.0 · episode 4 chapter 3: its voices, effects, beds and music (masters/v26.0/sound.sh) */\n' + '\n'.join(lines) + main[j:]
print('engine: him', len(him), 'cast', len(cast), '| sting rows added', len(new), 'of', len(names), '| effects, beds and music named by the chapter:', len(named))
missing = [x for x in [lid for lid, _, _, _ in LINES] + named if not (os.path.isfile(f'assets/audio/{x}.mp3') and os.path.isfile(f'assets/audio-opus/{x}.ogg'))]
print('FILES MISSING:', missing)
if CHECK: sys.exit(0)
open(VL, 'w', encoding='utf-8').write(vl); open(MAIN, 'w', encoding='utf-8').write(main)
json.dump(secs, open(H + 'script/measured.json', 'w'), indent=1)
print(subprocess.run(['python3', '-I', H + 'script/secs.py'], capture_output=True, text=True).stdout.strip())
print('written; now: python3 -I masters/v26.0/assemble.py')
