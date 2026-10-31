# Split CLAUDE.md: the release diary and the sheet's version list move word for word to docs/HISTORY.md.
# Usage: python3 -I split.py <old CLAUDE.md> <rules.md> <out CLAUDE.md> <out HISTORY.md>
import sys

old_path, rules_path, out_c, out_h = sys.argv[1:5]
L = open(old_path, encoding='utf-8').read().split('\n')
rules = open(rules_path, encoding='utf-8').read().rstrip('\n').split('\n')

def find(prefix, start=0):
    for i in range(start, len(L)):
        if L[i].startswith(prefix):
            return i
    raise SystemExit('not found: ' + prefix)

i_cur   = find('## Current state and roadmap')
i_diary = find('What the baseline contains, by release:', i_cur)
i_anch  = find('The anchors for that baseline', i_diary)
i_sheet = find('**THE SHEET IS v132**', i_anch)
i_learn = find('`docs/LEARNINGS.md` is the catalog', i_sheet)
i_arch  = find('## Architecture (v4.1)')
i_audit = find('`docs/AUDIT-2026-09.md` is the standing AUDIT', i_learn)

diary = L[i_diary:i_anch]
while diary and diary[-1] == '':
    diary.pop()
sheet = L[i_sheet:i_learn]
while sheet and sheet[-1] == '':
    sheet.pop()

rewritten = []   # (old lines, new lines)

# 1. the intro: what is live
i0 = find('teaching. Five chapters — one complete episode — are live: The Hell Note')
i1 = find('over, and returned to the fire). All five happen at the same block. This', i0)
assert i1 == i0 + 6, (i0, i1)
intro_old_a, intro_old_b = L[i0], L[i1]
intro_new_a = ['teaching. Sixteen chapters are live: three complete episodes of five and',
               'the first chapter of the fourth. Episode 1, all at one block: The Hell Note']
intro_new_b = ['over, and returned to the fire). Episode 2, *The 3 AM Shower & The Ghost',
               'Cyclist*, is his National Service; episode 3, *How It All Began*, his search',
               'for luck (two Thai temples, a Sak Yant, a medium, amulet shops and three',
               'kumanthong); episode 4, *The Teacher In White*, the masters he meets and the',
               'teacher he finds. The release history is docs/HISTORY.md. This']
rewritten.append(([intro_old_a], intro_new_a))
rewritten.append(([intro_old_b], intro_new_b))

# 1b. two lines of "Who you are working with" that later rules had overtaken (found by the independent reader):
#     the bundle is milestone-only since v4.81 (rule 3), and since v24.20 a plant or vehicle is a real model
j0 = find('- Deliver a fresh backup bundle and the Netlify zip at every good version.')
b_old = [L[j0]]
b_new = ['- Deliver the Netlify zip at every good version, and a fresh backup bundle when a chapter ships (rule 3: the',
         '  bundle has been milestone-only since v4.81).']
rewritten.append((b_old, b_new))
j1 = find('  each role\'s look and takes, and what stands in). A placeholder is one of the game\'s own characters wearing the role,', j0)
assert L[j1 + 1] == '  or a plant or vehicle built in code — never a block figure.', L[j1 + 1]
p_old = [L[j1], L[j1 + 1]]
p_new = ['  each role\'s look and takes, and what stands in). A placeholder is one of the game\'s own characters wearing the role,',
         '  never a block figure. A plant or a vehicle is a real model — his, or made his way (a checked reference picture,',
         '  then Meshy) — and one built in code is drawn only if its model never lands (v24.20: "replace all of them with real',
         '  truck models").']
rewritten.append((p_old, p_new))

# 2. the audit paragraph: what in it is fixed
a_old = ['question, to be saved and revisited. NOTHING in it is fixed. It holds',
         'four confirmed bugs (ch3\'s medium never moves his head in three',
         'cutscenes; ch4\'s fan keeps spinning through its own silent beat; the',
         'volume slider skips a cutscene; a light dip can stick dimmed), the',
         'fragile-but-not-broken list, and the viewport answer. **Read Part One']
a_new = ['question, to be saved and revisited. It holds four confirmed bugs',
         '(ch3\'s medium never moves his head in three cutscenes; ch4\'s fan keeps',
         'spinning through its own silent beat; the volume slider skips a cutscene;',
         'a light dip can stick dimmed): the volume slider\'s was fixed at v6.6 (a',
         'tap no longer skips a scene) and the other three are still in the code,',
         'waiting on Chad\'s OK because they are episode 1\'s (docs/OPEN-ITEMS.md B6).',
         'And it holds the fragile-but-not-broken list, and the viewport answer. **Read Part One']
assert L[i_audit + 2:i_audit + 7] == a_old, L[i_audit + 2:i_audit + 7]
rewritten.append((a_old, a_new))

pointer = [
    'What the baseline contains, release by release — every entry from v2.1 to the latest, word for word — is',
    '**docs/HISTORY.md** (moved out of this file on 31 Oct 2026, after v24.23, Chad\'s call: the diary was 89 % of it, about 99,000 of its',
    '111,000 words). Every standing rule those entries carried is in **Chad\'s standing rules** above. Before changing a',
    'chapter or a system, search the history for its key or its name and read those entries: it is the build memory, and',
    'most of what looks strange in the code is explained there (docs/LEARNINGS.md has the laws).',
]

sheet_new = [
    '**THE SHEET IS v133** (`masters/v24.17/masterz-text-v133.xlsx`, its CSV beside it; no word has moved since). It is',
    'EXPORTED and not published: the workbook (118 KB) is far past what the Drive connector\'s base64 route can carry (about',
    '20,000 characters — docs/EDITING-TEXT.md, "THE CEILING"), so the split export written down there no longer fits',
    'either. The way through is the Google Sheets connector, which writes the cells directly (docs/OPEN-ITEMS.md A1).',
    '**v44 is still the link to give Chad** until that is done:',
    'https://docs.google.com/spreadsheets/d/1bqnbQJPr1O6YslOlcsbVDFlZCohQtyKbPzm9EuY1IpM/edit',
    'Every sheet version\'s own diff, v132 back to v75, is in docs/HISTORY.md, "The sheet, version by version" (newest',
    'first; a new version goes at its top).',
]

history_section = [
    '',
    '## The history (docs/HISTORY.md)',
    '',
    'Every release from v2.1 on has an entry in **docs/HISTORY.md**, word for word as it stood here until 31 Oct 2026 (after v24.23): what Chad',
    'asked, what shipped, what was measured, and the traps on the way. Search it for a version (`- **v14.3`), a chapter\'s',
    'key (`e3c4`) or a system\'s name before changing it.',
    '',
    '**Writing it, from now on.** A release\'s entry goes at the END of docs/HISTORY.md\'s "The releases", its version',
    'first, as always. This file gets only what every session needs: a NEW standing rule from Chad, into **Chad\'s standing',
    'rules** with the version it came from, and the current state above (what is built, what is next, the sheet\'s',
    'version). Nothing that belongs in the history is written here again — that is how this file grew to 111,000 words.',
]

# ---- assemble CLAUDE.md
C = []
C += L[:i0] + intro_new_a + L[i0 + 1:i1] + intro_new_b + L[i1 + 1:j0] + b_new + L[j0 + 1:j1] + p_new + L[j1 + 2:i_arch]
C += rules + ['']
C += L[i_arch:i_diary]
C += pointer + ['']
C += L[i_anch:i_sheet]
C += sheet_new + ['']
open_para = ['**docs/OPEN-ITEMS.md is what is still open** (31 Oct 2026, every item checked against the code): what can be done',
             'on his word, the episode 1 fixes that need his OK, what waits on him, what is not built yet. Cross an item off there',
             'the day it is done, with the version.', '']
C += L[i_learn:i_audit] + open_para + L[i_audit:i_audit + 2] + a_new + L[i_audit + 7:]
while C and C[-1] == '':
    C.pop()
C += history_section
open(out_c, 'w', encoding='utf-8').write('\n'.join(C) + '\n')

# ---- assemble HISTORY.md
H = [
    '# Master Z\'s Encounters — the release history',
    '',
    'Every release entry from v2.1 to v24.23, word for word as it stood in CLAUDE.md, and the sheet\'s versions. Moved here',
    'on 31 Oct 2026, after v24.23, at Chad\'s word ("Do what you recommend"), because CLAUDE.md is read in full at the start of',
    'every session and after every summary, and this diary was 89 % of it — about 99,000 of its 111,000 words.',
    '',
    'Nothing in it was changed in the move. Before it moved, every standing rule written inside an entry was lifted into',
    'CLAUDE.md\'s **Chad\'s standing rules**, with the version it came from; the entry here is the full story behind it.',
    '',
    '- **The order** is the order the entries stood in CLAUDE.md, which is not always version order (v7.9 and v7.4–v7.8',
    '  come after v10.8, v5.28 after v7.0, v3.8 last). To find one, search for its version: `- **v14.3`.',
    '- **New releases** append their entry at the end of "The releases".',
    '- **A new sheet version** goes at the top of "The sheet, version by version" (newest first).',
    '- The few lines CLAUDE.md reworded in the move (the intro\'s list of what is live, the audit\'s "nothing in it is',
    '  fixed") keep their old wording at the end, under "Lines reworded in the move".',
    '- Older docs, comments and LEARNINGS that point to "the CLAUDE.md entry" for a release mean its entry here.',
    '',
    '## The releases',
    '',
]
H += diary
H += ['', '## The sheet, version by version', '']
H += sheet
H += ['', '## Lines reworded in the move', '',
      'Each block below is the old wording; CLAUDE.md now says it as shown after the arrow.', '']
for old, new in rewritten:
    H += ['```'] + old + ['```', '→', '```'] + new + ['```', '']
while H and H[-1] == '':
    H.pop()
open(out_h, 'w', encoding='utf-8').write('\n'.join(H) + '\n')
print('CLAUDE.md lines', len(C), 'HISTORY.md lines', len(H), 'diary lines', len(diary), 'sheet lines', len(sheet))
