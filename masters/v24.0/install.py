"""v24.0 CP11d · install episode 4 chapter 1's recorded sound into the game, every edit a unique-string replacement:
  1. the registry (src/voicelines.js): each e4c1 line's `secs` measured from its shipped take (the Opus file's own
     length), its `est` flag gone; the seven speakers' voices named (CP11a's auditions); lm1a's words as they are said
  2. the chapter's SECS (src/chapters/e4/e4c1.js, between its markers): the same measured lengths
  3. the engine (src/main.js): his 47 lines in ADULT_TAKES, the cast's 75 in CAST_TAKES, and a STING_SAMPLE row for
     every voice line, effect, bed and music cue the chapter plays
usage: python3 masters/v24.0/install.py [--check]   (run from the repo root)"""
import json, re, subprocess, sys
CHECK = '--check' in sys.argv
ROOT = '.'
VL, CH, MAIN = 'src/voicelines.js', 'src/chapters/e4/e4c1.js', 'src/main.js'
vl, ch, main = open(VL).read(), open(CH).read(), open(MAIN).read()

def dur(name):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                        f'assets/audio-opus/{name}.ogg'], capture_output=True, text=True)
    return round(float(r.stdout.strip()), 2)

rows = re.findall(r'\{ id: "([^"]+)", who: "([^"]+)", ch: "e4c1"', vl)
assert len(rows) == 122, len(rows)
secs = {i: dur(i) for i, _ in rows}

# 1 · the registry
n = 0
for i, who in rows:
    pat = re.compile(r'(\{ id: "' + re.escape(i) + r'", who: "[^"]+", ch: "e4c1".*?secs: )([0-9.]+)(, est: true)( \})', re.S)
    m = pat.search(vl)
    if not m:
        assert re.search(r'\{ id: "' + re.escape(i) + r'", who: "[^"]+", ch: "e4c1".*?secs: ' + re.escape(str(secs[i])) + r' \}', vl, re.S), i
        continue
    vl = vl[:m.start()] + m.group(1) + str(secs[i]) + m.group(4) + vl[m.end():]
    n += 1
print('registry rows measured:', n)
VOICES = {
    'pong':    ('bcdIY58WBBzAMmef52NW', 'Zie (CP11a: the words exactly). RMS -16; his three whispers -21, two soft lines -18.'),
    'panoi':   ('B4NdgwdU97lHqA8Udh2D', 'Kanya (CP11a: the older pitch). RMS -16; the tray -18.'),
    'master4': ('weRAVUYgqjjfUEEu5BsB', 'Patinya (CP11a: the lowest and steadiest of the Thai voices). RMS -16; the soft lines -18, the chant -18, the murmured chant -20.'),
    'joy4':    ('MYZYcGOqrkYQcwDunXl7', 'HammyTH (CP11a: Mali is not fine-tuned and could not be used; Nook measured male). RMS -16.'),
    'lim4':    ('hnUfJmvgsLlEm4ozUacp', 'Brandon, [an old uncle] (CP11a: age over dialect). RMS -16.'),
    'sombat4': ('xYmBpJREC3WfqEFpbPvO', 'Songkran, [elderly voice] (CP11a: the oldest-sounding, the words exactly). RMS -16.'),
    'taxi4':   ('HxkJ72rJ50z9kcGPPnG7', 'Kopi O, [an old uncle] (CP11a: Lee speaks in episode 3). RMS -16.'),
}
for who, (vid, why) in VOICES.items():
    pat = re.compile(r'(    ' + who + r': \{ name: "[^"]+", )voice: "TBD"(, model: "eleven_v3",\n\s+note: ")([^"]*)(" \},)')
    m = pat.search(vl)
    if not m:
        assert ('voice: "' + vid + '"') in vl, who
        continue
    vl = vl[:m.start()] + m.group(1) + 'voice: "' + vid + '"' + m.group(2) + m.group(3) + ' ' + why + m.group(4) + vl[m.end():]
a = '/* v24.0 · episode 4 chapter 1 — seven new speakers, each cast by audition at CP11 (two or three candidates a\n       role, previews to Chad, his ear picks). `voice` stays "TBD" until then. */'
b = '/* v24.0 · episode 4 chapter 1 — seven new speakers, each cast by audition at CP11a (two or three candidates a\n       role on its key line, measured; masters/v24.0/make.sh names each and why). */'
if a in vl: vl = vl.replace(a, b)
a = 'text: "[cheerful] Ah, you also not from here, right?'
b = 'text: "[cheerful] Ah, you\'re also not from here, right?'
if a in vl: vl = vl.replace(a, b)   # both takes say "you're" (the registry says what is heard, v5.14)

# 2 · the chapter's SECS
s0, s1 = ch.index('/* SECS BEGIN */'), ch.index('/* SECS END */')
blk = ch[s0:s1]
for i in secs:
    blk, k = re.subn(r"'" + re.escape(i) + r"': [0-9.]+", f"'{i}': {secs[i]}", blk)
    assert k == 1, (i, k)
blk = blk.replace('ESTIMATED until CP11 records the takes (the registry carries the same numbers)', 'MEASURED from the recorded takes at CP11 (the registry carries the same numbers)')
ch = ch[:s0] + blk + ch[s1:]

# 3 · the engine
him = [i for i, w in rows if w == 'jamesAdult']
cast = [i for i, w in rows if w != 'jamesAdult']
def wrap(ids, ind='  '):
    out, line = [], ind
    for x in ids:
        t = f"'{x}', "
        if len(line) + len(t) > 118: out.append(line.rstrip()); line = ind
        line += t
    out.append(line.rstrip().rstrip(','))
    return '\n'.join(out)
A0 = "  'z5epi2', 'z5epi3', 'z5A', 'z5B', 'z5C', 'z5D']);"
if "'q1pro1'" not in main.split('const ADULT_TAKES')[1].split(']);')[0]:
    assert main.count(A0) == 1
    main = main.replace(A0, "  'z5epi2', 'z5epi3', 'z5A', 'z5B', 'z5C', 'z5D',\n  /* v24.0 · episode 4 chapter 1, The Master I Did Not Know (masters/v24.0/make.sh) */\n" + wrap(him) + "]);")
C0 = "  'ow5careful', 'ma5vm', 'mk5teach', 'mk5yatha']);"
if "'pg1car'" not in main.split('const CAST_TAKES')[1].split(']);')[0]:
    assert main.count(C0) == 1
    main = main.replace(C0, "  'ow5careful', 'ma5vm', 'mk5teach', 'mk5yatha',\n  /* v24.0 · episode 4 chapter 1: Pong, Pa Noi, the master, Khun Joy, Uncle Lim, Ta Sombat, the taxi uncle */\n" + wrap(cast) + "]);")
planned = re.search(r'plannedSounds: \[(.*?)\]', ch, re.S).group(1)
fxs = re.findall(r"'(w4[A-Za-z0-9]+)'", planned)
assert len(fxs) == len(set(fxs)), 'a planned sound twice'
names = [i for i, _ in rows] + fxs
S0 = "  k5wind: ['k5wind', 1], k5window: ['k5window', 1]\n};"
assert main.count(S0) == 1
have = set(re.findall(r"^\s*([A-Za-z0-9_]+): \['", main.split('const STING_SAMPLE = {')[1].split('\n};')[0], re.M)) | \
       set(re.findall(r"([A-Za-z0-9_]+): \['", main.split('const STING_SAMPLE = {')[1].split('\n};')[0]))
new = [x for x in names if x not in have]
if new:
    body, line = [], '  '
    for x in new:
        t = f"{x}: ['{x}', 1], "
        if len(line) + len(t) > 118: body.append(line.rstrip()); line = '  '
        line += t
    body.append(line.rstrip().rstrip(','))
    main = main.replace(S0, "  k5wind: ['k5wind', 1], k5window: ['k5window', 1],\n  /* v24.0 · episode 4 chapter 1: its voices, effects, beds and music (masters/v24.0/make.sh) */\n" + '\n'.join(body) + "\n};")
print('engine: him', len(him), 'cast', len(cast), 'sting rows added', len(new), 'of', len(names))
missing = [x for x in names if subprocess.run(['test', '-f', f'assets/audio/{x}.mp3']).returncode or subprocess.run(['test', '-f', f'assets/audio-opus/{x}.ogg']).returncode]
print('files missing:', missing)
if CHECK: sys.exit(0)
open(VL, 'w').write(vl); open(CH, 'w').write(ch); open(MAIN, 'w').write(main)
json.dump(secs, open('masters/v24.0/secs.json', 'w'), indent=1)
print('written')
