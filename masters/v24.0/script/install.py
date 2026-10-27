# Writes masters/v24.0/script/lines.py into src/voicelines.js as PLANNED rows (est: true), with estimated lengths,
# plus the chapter's speakers and its sheet name. Re-runnable: it replaces its own block between the markers.
import re, sys, json
sys.path.insert(0, 'masters/v24.0/script')
from lines import L, GLOSS
FIXED = {'fm1chant': 28.0, 'fm1chant2': 40.0}
NOCAP = {'fm1chant', 'fm1chant2'}   # a chant is captioned in its own lines (as every chant since v21.31), never by the preview
def est(i, text):
    if i in FIXED: return FIXED[i]
    t = re.sub(r'\[[^\]]*\]', ' ', text)
    thai = sum(1 for ch in t if '฀' <= ch <= '๿')
    latin = re.sub(r'[฀-๿]+', ' ', t)
    words = len([w for w in re.split(r'\s+', latin) if re.search(r'[A-Za-z0-9]', w)])
    s = words / 2.6 + thai / 11.0
    s += 0.5 * t.count('...') + 0.25 * (t.count('—') + t.count('-')) + 0.2 * len(re.findall(r'[.!?](\s|$)', t))
    return round(max(0.9, s + 0.25), 2)
p = 'src/voicelines.js'
s = open(p, encoding='utf-8').read()
BEGIN = '    /* E4C1 LINES BEGIN */'
END = '    /* E4C1 LINES END */'
def js(x): return json.dumps(x, ensure_ascii=False)
rows = [BEGIN,
 '    /* v24.0 · episode 4 chapter 1, The Master I Did Not Know — PLANNED (M1): every row carries `est: true` and an',
 '       estimated length until its take is recorded at CP11 (docs/V24.0-E4C1-PLAN.md §9.1; the script is',
 '       masters/v24.0/script/lines.py, installed by install.py). A Thai line is written in Thai script, as it is said;',
 '       its English is in `where`, for Chad. chaptertest allows an `est` row only in a chapter that is still `preview`. */']
for (i, who, where, text) in L:
    rows.append(f'    {{ id: {js(i)}, who: {js(who)}, ch: "e4c1", where: {js(where)},')
    gl = f', gloss: {js(GLOSS[i])}' if i in GLOSS else ''
    if i in NOCAP: gl += ', nocap: true'
    rows.append(f'      text: {js(text)}{gl}, secs: {est(i, text)}, est: true }},')
rows.append(END)
block = '\n'.join(rows)
if BEGIN in s:
    a = s.index(BEGIN); b = s.index(END) + len(END)
    s = s[:a] + block + s[b:]
else:
    tail = '\n  ];\n\n  // What a chapter key means on the sheet.'
    assert s.count(tail) == 1
    # the last row before the tail ends with '}' and no comma — give it one
    k = s.index(tail)
    head = s[:k].rstrip()
    assert head.endswith('}'), head[-40:]
    s = head + ',\n' + block + s[k:]
# the last planned row must not end the array with a trailing comma problem: JS allows trailing commas — fine.
SPK_BEGIN = '    /* E4C1 SPEAKERS BEGIN */'
SPK_END = '    /* E4C1 SPEAKERS END */'
spk = [SPK_BEGIN,
 '    /* v24.0 · episode 4 chapter 1 — seven new speakers, each cast by audition at CP11 (two or three candidates a',
 '       role, previews to Chad, his ear picks). `voice` stays "TBD" until then. */',
 '    pong: { name: "Pong, the Bangkok amulet dealer (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Thai-accented English, 40s, warm and talkative; he also speaks Thai to the master and the farmer. He brought him, and is proud of a master he has never met either." },',
 '    panoi: { name: "Pa Noi, the master\'s wife (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Thai with a little English, 50s, brisk and kind. She runs the queue, the water and the trays." },',
 '    master4: { name: "The master (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Thai only, 50s, soft and low, never hurried; and the chant. Kind, competent in his own practice, and never the villain (CLAUDE.md)." },',
 '    joy4: { name: "Khun Joy, a Bangkok office worker (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Thai-accented English, 30s, a little impatient." },',
 '    lim4: { name: "Uncle Lim, from Kuala Lumpur (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Malaysian English, 60s, cheerful." },',
 '    sombat4: { name: "Ta Sombat, the farmer next door (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Thai only, 70s, slow and plain." },',
 '    taxi4: { name: "The taxi uncle in Singapore (episode 4, chapter 1)", voice: "TBD", model: "eleven_v3",',
 '              note: "Singapore English, 60s; heard only." },',
 SPK_END]
spkb = '\n'.join(spk)
if SPK_BEGIN in s:
    a = s.index(SPK_BEGIN); b = s.index(SPK_END) + len(SPK_END)
    s = s[:a] + spkb + s[b:]
else:
    anchor = '              note: "Arthur, as in chapter 4. RMS -16." },\n  };'
    assert s.count(anchor) == 1
    s = s.replace(anchor, '              note: "Arthur, as in chapter 4. RMS -16." },\n' + spkb + '\n  };')
ch_old = '    e3c5: "Episode 3 · Chapter 5 · The Children On My Altar"\n  };'
if 'e4c1:' not in s:
    assert s.count(ch_old) == 1
    s = s.replace(ch_old, '    e3c5: "Episode 3 · Chapter 5 · The Children On My Altar",\n    e4c1: "Episode 4 · Chapter 1 · The Master I Did Not Know"\n  };')
open(p, 'w', encoding='utf-8').write(s)
tot = sum(est(i, t) for (i, w, wh, t) in L)
print(f'{len(L)} rows installed, {tot:.0f} s of speech estimated')
