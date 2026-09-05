# Changing the words — the one-sheet workflow

Chad edits every word in the game from a single Google Sheet, on his phone,
without prompting for each change. This is how it works and how to run it.

## The sheet

**Hand Chad the link every time** (his rule, v5.23: "always give me the
latest sheet link"). Whenever a new sheet is published — and whenever the
text comes up at all — the reply carries the full URL, not the version
number alone. He reads these on his phone; a number he has to go hunting
for in Drive is not a link.

**Master Z's Encounters — GAME TEXT v36 (edit here)** in his Drive
(id `1zWSm0M5A8i8T1YdPlKsOneQ3bS2eFd1GNaGY_RbUK3E` — the **v36** sheet,
made at v6.4, tabbed: **UI TEXT** (204 rows, the engine's words),
**EPISODE 1** (110 rows, chapters 1–5's words) and **VOICE LINES** (102).
<https://docs.google.com/spreadsheets/d/1zWSm0M5A8i8T1YdPlKsOneQ3bS2eFd1GNaGY_RbUK3E/edit>

What changed from v35: **eleven rows ADDED, none changed; five new spoken
lines.** The prologue (v6.4, docs/V6.4-PROLOGUE.md) brings two credit
rows to UI TEXT — `credits.teddy` / `credits.teddyWho` /
`credits.teddyLink` ("The toy in the prologue" · "Teddybear toy ·
Sketchfab" · "sketchfab.com · teddybear-toy") and `credits.leaf` /
`credits.leafWho` / `credits.leafLink` ("The leaf in the prologue" ·
"Birch leaf · popovs · Sketchfab (CC BY 4.0)" · "sketchfab.com ·
birch-leaf") — and five rows to VOICE LINES, the boy's `vpro1`–`vpro5`
("Ever since I was young, I loved picking things up from the ground." …
"This time however... this time was different."), each with its speaker,
its moment in the film and its measured length. Chapter 1's own words are
untouched: the film has no card text of its own. Every v35 cell is
byte-identical. v35 (id `1VyBwICzc7TF8ANyj8U_OrOz_aH2RhNJVLPQMe7nMOpQ`)
is superseded; its metadata was checked before v36 went to him (created
01:14:58, modified 01:14:59 — the conversion itself), so it holds no edit
of his to import. Provenance: v36 was published from the fresh `.xlsx`
export, read back as three tables, and every cell diffed against the
uploaded workbook by `tools/verifytabs.py` — 416 rows, zero differences.

What changed from v34 (v35, at v6.3): **eleven rows ADDED, none changed, no spoken word.**
The episode-complete card (v6.3, docs/V6.3-EPISODE-CARD.md) says eleven
new things, all in a new "The episode-complete card (v6.3)" section of UI
TEXT: `episode.label` ("Episode complete"), `episode.stamp` ("Case
closed" — the stamp), `episode.scoreLabel` ("Episode score"),
`episode.tallyLabel` ("Five chapters, tallied"), `episode.mapLabel` ("The
ten cases"), `episode.unlocked` ("Unlocked" — the flag on the next case),
`episode.next` ("Next · {episode}"), `episode.nextUnwritten` ("{episode}
is unlocked. It is not yet written — come back for it."),
`episode.allDone` ("Every case is closed."), `episode.continue`
("Continue") and `episode.toTitle` ("Back to the title screen"). Every v34
cell is byte-identical. v34 (id
`124sqKs4CPH7gaiG_d6wE0KDidzHv0lEFl9xrYA6PZz0`) is superseded; its metadata
was checked before v35 went to him (created 23:33:47, modified 23:33:48 —
the conversion itself), so it holds no edit of his to import. Provenance:
v35 was published from the fresh `.xlsx` export, read back as three tables,
and every cell diffed against the uploaded workbook by
`tools/verifytabs.py` — 405 rows, zero differences.

What changed from v33 (v34, at v6.2): **three rows ADDED, none changed, no spoken word.**
The redesigned selector (v6.2, docs/V6.2-SELECTOR.md) says three new
things: `chapters.inProgress` ("In progress" — beside a chapter you have
reached but not finished), `chapters.here` ("You are here" — beside the
chapter you are in) and `chapters.progress` ("{n} of {m} chapters sealed"
— the line under the case's name; {n} and {m} are filled in for you), all
in "The chapter selector" section of UI TEXT. The word on a sealed chapter
is `complete.sealed`, the stamp's own word, reused rather than duplicated.
Every v33 cell is byte-identical. v33 (id
`1qMSPsGghb0AdBk_drLd7yzvsG53dK-mbxhWYf4FjnIQ`) is superseded; its metadata
was checked before v34 went to him (created 22:37:08, modified 22:37:09 —
the conversion itself), so it holds no edit of his to import. Provenance:
v34 was published from the fresh `.xlsx` export, read back as three
tables, and every cell diffed against the uploaded workbook by
`tools/verifytabs.py` — 394 rows, zero differences.

What changed from v32 (v33, at v6.1): **four UI cells, and the shape of the sheet.** The
button on the title screen, the row in the pause menu and the selector's
heading now say EPISODES (Chad: "use the word episodes in title screen
button"): `title.chapters` "Chapters" → "Episodes", `menu.chapters` "Select
a chapter" → "Episodes and chapters", `chapters.heading` "Chapters" →
"Episodes", and `chapters.hint` "A chapter you have completed can be played
again from its opening." → "Pick an episode, then a chapter you have
reached, to play it again from its opening." No chapter text, no spoken
word and no length moved. And the sheet is TABBED (Chad: "the sheet must be
tabbed, google sheets wont be sustainable in the long run unless you can
figure out a way to write tabbed google sheets"): the 294 GAME TEXT rows
split into UI TEXT and EPISODE 1, and the voice lines left the block under
the text for a tab of their own — the layout the .xlsx has carried since
v19, now on the Google Sheet itself (how, below). v32 (id
`1zWVqB9TTJb9u-qPXAYd4uL_CNuOtugZWh0-BKOelnts`) is superseded; its
metadata was checked before v33 went to him (created 19:48:33, modified
19:48:34 — the conversion itself), so it holds no edit of his to import.
Provenance: v33 was published from the fresh `.xlsx` export through the
Drive connector, read back as three tables, and every cell of all three
diffed against the uploaded workbook by `tools/verifytabs.py` — 393 rows,
zero differences.

What changed from v31: **twenty-three rows ADDED, none changed, no spoken
word.** The ten-episode architecture (v6.0, docs/EPISODES-PLAN.md) puts the
episodes' words in the sheet: `ep1.label`..`ep10.label` ("Episode 1" …
"Episode 10" — the line above "Chapter N" on the chapter card and the
heading under the selector's tabs) and `ep1.title`..`ep10.title` (the ten
case names Chad gave, "may be subject to change" — so they are here to
change), under a new "The episodes" section between the selector and the
equipment panel; and three selector strings: `chapters.unwritten` ("Not yet
written", the row of a chapter that has no file yet), `chapters.episode`
("Episode {n}", the tab's screen-reader name) and `chapters.chapter`
("Chapter {n}", the label of an unwritten row). Every v31 cell is
byte-identical. v31 (id `194fHX9UUAfkVbQYAKWRES4sNx7dDA1dm3379fhe8Kl4`) is
superseded. Provenance: v32 was published from the fresh export and read
back, and all 393 rows diffed cell by cell against it across all four
columns — zero differences.

What changed from v30: **fourteen cells, in the VOICE LINES block only —
one spoken line's text, its "where", and thirteen lengths.** No UI string
and no chapter text moved. `voice.v4sit` is now *"Start from the
beginning..."* (Chad: "it should have '...' at the back to sound more
brooding"), and its "Where it appears" says it plays on INTERACTING with
the dining chair, no longer on walking near it. The thirteen takes Chad
heard as too fast — chapter 3's film and scene lines (`v3wake1 v3wake2
v3wake3 v3chair v3out1 v3out2 v3seen v3grip v3ask v3left v3C`), `v4sit`
and `v4thinkA3` ("should sound more afraid") — were re-said slower and
with feeling, so their length cells changed (e.g. `v3wake1` 2.77 s →
5.33 s); their words did not, except v4sit's ellipsis. Every other cell
is byte-identical to v30. v30 (id
`1VH8votcILO8KkULToZhOEbUJ5PCWcaBd6otCQmQ5MTA`) is superseded.
Provenance: v31 was published from the fresh export and read back, and all
370 rows diffed cell by cell against it across all four columns — zero
differences.

What changed from v29: **two things, and no spoken word.** The credits
panel's `credits.burner*` rows (kana at the burner) became `credits.meshy*`
— one row covering all four of Chad's Meshy models, "attributed to meshy.ai
with cc0 license" as he asked. And `voice.v3aunt5` — *"Boy, come out of
there now."* — changed SPEAKER and LENGTH, not text: it moved from the
auntie at the paper table to the granny at the brazier, who is where the
line is actually delivered, and her take is 3.16 s against the old 3.32 s.
Every other TEXT cell is byte-identical to v29. v29 (id
`1mIuLsXsM6QfgvaD7d_LPSr2Si1a6MGNknVsz2LTLPtY`) is superseded.
Provenance: v30 was published from the fresh export and read back, and all
370 rows diffed cell by cell against it across all four columns — zero
differences.

What changed at v29, for the record: **not one TEXT cell.** v5.28 re-voiced the boy
(River -> Aaron) without moving a single word, so all 271 GAME TEXT cells
and all 97 VOICE LINES texts are byte-identical to v28. What moved is the
**length** column: 73 of his 79 takes are a different length in Aaron's
voice, and the sheet is where Chad reviews them. v28 (id
`1h_ktagugD0nazoE2hRLWlA0LuyuEdfAanaVmBKDkWlU`) is superseded.
Provenance: v28 was read back FIRST and diffed cell by cell against the
committed tree — 271 rows, not one difference, so Chad had made no edits
and there was nothing to import. v29 was then published from the fresh
export and read back, and its TEXT column diffed against that verified v28
read-back: identical throughout; its length column matches the export.

What changed from v27: **one cell, and it is not one Chad edits** —
`voice.t5note`'s "Where it appears" moved from "the note held up" to
"the note set down on the table", because at v5.25 chapter 5's opening
film stopped showing the tang-ki holding the note up and started setting
it down on the table. **Every TEXT cell is byte-identical to v27**: no
spoken word and no UI string changed anywhere in the game. The sheet was
re-made anyway because the "where" column is what tells him which moment
a take belongs to, and the one row it was wrong about is the row for the
shot this release rebuilt.

What changed at v27: **three credit rows added and nothing else** —
`credits.sofa`, `credits.sofaWho` and `credits.sofaLink`, for the
Sketchfab sofa that replaced the primitive one in the living room of
chapters 4 and 5.

What changed at v26: `credits.aunt` and `credits.auntWho` (the granny at
the paper table) were REMOVED — she is Chad's own model ("granny was done
by me so no credits needed"), and the credits panel lists creative works
by OTHER people, so she has no row at all rather than a row with no link.

What changed at v25, for the record: `credits.auntWho` named the granny,
the `credits.seated*` and `credits.backrow*` rows (gracy and the fearful
woman, deleted at v5.22) went, and `credits.burner*` (kana at the burner)
arrived. There was no v24 on Drive: it was exported at v5.20 and never
published, so it never existed for editing. v25 (id
`18XgpC6E3Il7GU8FyfOxiXMprJevZO-gyOKxci9LA2Ak`), v27 (id
`1yBNm3qg6JHM0haHA4s9sILRR6UNDbVm9qhMKcJ7SdY0`), v23 (id
`1-WolRRObawI_pqzODGcn0rqnnfHtZzoNrqK8wBfC-ks`) and everything before
them are superseded and should not be edited.
Provenance: v25 was published and read back at v5.22 and fed through
`textsync import` on the committed tree — 367 rows, not one cell changed.
v26 was made the same session as v5.23's two-row edit, published from the
exported CSV through the Drive connector, read back, and checked by
importing the v25 read-back MINUS exactly those two rows: 365 rows, no
change to any string or voice line. v27 was checked the same way — the
verified v26 read-back PLUS exactly the three sofa rows, imported against
the committed tree: 368 rows, not one cell different.

v28 was checked HARDER, and the method is worth keeping. v27 was read
back first and diffed against the verified v27 expectation: identical, so
Chad had made no edits and there was nothing to import. Then v28 was
published from the fresh export and read back, and BOTH columns of the
read-back were transcribed independently and diffed against the same two
columns generated straight out of the committed tree — 271 GAME TEXT
cells and 97 VOICE LINES, every one identical. That is stronger than the
import round trip, because it compares what DRIVE actually holds against
what the GAME actually holds, cell by cell, rather than only proving the
import applied nothing.

**The check is worth naming, because it is cheap and it is the one that
matters.** Every re-emitted sheet is verified by rebuilding what it OUGHT
to say from the last verified read-back, applying only the rows this
release changed, and running that through `textsync import`. An empty
diff proves the sheet, the export and the game all agree. A difference
would be a transcription slip of the session's, never an edit of Chad's —
and it would be caught before he ever opened the link. (That round trip is the transcription check every re-emitted sheet
gets; a difference there is a typo of the session's, never an edit.)
Whenever a sheet has been in his hands for real time, read it back and
import FIRST — that is what the rule is for.

**Every sheet from v19 on carries the VOICE LINES** — Chad's rule, set
when he asked for it: "moving forward, every new version of the sheet
should include these voicelines too." Every export carries them, so there
is no way to make a sheet without them.

**The Google Sheet is TABBED since v33 (v6.1), and this is how it gets
that way.** `textsync export <file>.xlsx` writes a real workbook — UI
TEXT, one EPISODE N tab for every episode that has a chapter file, VOICE
LINES — as the smallest valid package (inline strings, no styles; three
tabs are 22 KB). The Drive connector's `create_file` takes that file as
`base64Content` with `contentMimeType`
`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, and
Drive CONVERTS it into a native Google Sheet
(`application/vnd.google-apps.spreadsheet`) with one tab per worksheet.
v5.14 wrote down that this could not be done — "even a 20 KB workbook is
27 KB of base64, past what a session can read back and re-emit without
risking a corrupt byte" — and it had never been tried: the 30 KB went
through intact, first on a two-tab test workbook and then on the real
one, and the cell-by-cell read-back check below proves it on every
publish rather than hoping. A chapter of episode 2 makes an EPISODE 2 tab
the day its file exists; `toXLSX` groups chapter rows by the chapter's
own `episode`. `import` finds every table on every tab by its header row,
so the CSV, the workbook and the connector's read-back all import alike.

**Publishing a sheet, start to finish** (every release that changes a word):

1. `get_file_metadata` on the CURRENT sheet: a `modifiedTime` more than a
   few seconds after its `createdTime` (the conversion itself takes about
   one) means Chad edited it — `read_file_content`, save the output whole,
   `textsync import` it, and review that diff FIRST.
2. `node textsync.mjs export gametext-vNN.xlsx` in the scratchpad, then
   `base64 -w0 gametext-vNN.xlsx > gametext-vNN.b64`.
3. `create_file` with `title` "Master Z's Encounters — GAME TEXT vNN (edit
   here)", `contentMimeType` as above and `base64Content` from the .b64.
   The result's `id` is the new sheet; its `mimeType` must come back as
   the Google spreadsheet type, or Drive did not convert it.
4. `read_file_content` on that id returns one markdown table per tab with
   a blank line between tables. Save it WHOLE to a file and run
   `python3 tools/verifytabs.py gametext-vNN.xlsx readback.md` — the last
   line must be `mismatched cells: 0` (v33: three tabs, 393 rows, zero).
5. Put the full `https://docs.google.com/spreadsheets/d/<id>/edit` link in
   the reply, and record the new id, its counts and what changed at the
   top of this file.

Two sheets in one session is the cost of the connector's one real
limitation, and it is worth restating why: it can READ a sheet and it can
CREATE one, but it cannot write cells into an existing one. So any change to
a string — even one word — means a new sheet and a new link. Read the old
one and import it FIRST, every time, or an edit Chad made and did not
mention is lost.

The Drive connector can read a sheet and can create one, but it cannot
write cells into an existing one. So a release that adds strings makes a
NEW sheet from `textsync export` and Chad switches to that link. Two rules
keep that safe: read the old sheet and import it FIRST, so any edit he has
made but not asked for is already in the game before the new sheet is
generated from it; and keep the Notes column in `textsync.mjs` (the NOTES
map), not only in the sheet, or every regeneration loses it.

Four columns: `ID (do not edit)` · `Where it appears` · **`TEXT — edit this
column`** · `Notes`. He only ever touches the TEXT column.

The VOICE LINES tab has seven: `ID (do not edit)` · `Who`
· `Chapter` · `When it plays` · **`TEXT — edit this column`** · `Length
(s)` · `Notes`. (Before v33 the Google Sheet was one tab made from the
CSV, and the same rows used the four text columns — `Where it appears`
holding chapter — speaker: when it plays, `Notes` the length and any note;
`import` still reads that shape.) Again only TEXT is his. The ID is `voice.` plus the take's sample name
(`voice.v2wake1`), so a voice row can never be mistaken for a UI string. A
line under an outcome card names the choice it follows, read from the
chapter at export time. The TEXT of a take is what the take SAYS — every
one was transcribed at v5.14 — with ElevenLabs direction tags in square
brackets (`[beat]`, `[whispering]`) where the take was made with them.

**Changing a voice line does not change the game by itself.** The words
live in `src/voicelines.js`; the sound is a take in `assets/audio/`.
`import` writes the new words into the registry and prints the ids that
changed, and those takes are then regenerated (ElevenLabs, the speaker's
voice id from the registry's `SPEAKERS` table), encoded to the contract,
level-matched, and installed — with the cutscene timings re-checked
against the new lengths. An empty voice cell is refused with a warning: a
take cannot be deleted from the sheet.

**An empty TEXT cell removes that piece of text from the game** — the engine
hides the element rather than leaving a blank gap. That is the documented
way to delete a line without touching code.

The IDs are the contract: a row whose ID is not known to the game is skipped
with a warning on stderr, never silently applied and never able to corrupt a
file.

## Where the words live

| File | Holds |
|---|---|
| `src/strings.js` | every UI word the ENGINE says (184) |
| `src/chapters/ch1.js` | chapter 1's own words (18): brief, prompt, choices, teachings |
| `src/chapters/ch2.js` | chapter 2's own words (23): the same, plus its `words` block |
| `src/chapters/ch3.js` | chapter 3's own words (23) |
| `src/chapters/ch4.js` | chapter 4's own words (23) |
| `src/chapters/ch5.js` | chapter 5's own words (23) |
| `src/voicelines.js` | every spoken take (97): speaker, chapter, moment, words, length — not shipped |

Chapters are DISCOVERED, not named: `textsync.mjs` globs `src/chapters/*.js`,
skips fixtures (id 90+), and sorts by id. Chapter 3 joined the sheet by
existing: not one line of `textsync.mjs` changed for it, which is what that
generalisation was for.

All of them are hand-written and stay readable — the sync tool edits values
in place and never regenerates a file, so comments and structure survive.

`src/strings.js` reaches the screen two ways: elements in `shell.html`
carrying `data-t="key"` are filled at boot by `applyText()`, and code calls
`T('key')` for the device-dependent hints. A key missing from the file
leaves the markup's own text alone, so a half-finished strings file can
never blank the game.

## The loop

```
node textsync.mjs export text.csv     # game  -> sheet, both kinds of row in one CSV
node textsync.mjs export text.xlsx    # game  -> the tabbed workbook the Google Sheet is made from
node textsync.mjs import <file>       # sheet -> game (.csv, .xlsx, or the connector's markdown)
```

`import` accepts BOTH the CSV format and the markdown table the Google Drive
connector returns when it reads a sheet, so the connector's own output can
be saved to a file and applied directly. It unescapes the connector's
backslashes, so `\<b\>` and `\&amp;` come back as real markup.
It finds the TEXT column from each header row rather than assuming it is
the third — the two tabs put it in different places — and reads every
tab of an .xlsx. At the end it names every voice line whose text changed.

**Applying his edits, start to finish:**

1. Read the sheet with the Drive connector (`read_file_content` on the id
   above).
2. Save that output WHOLE to a file (one table per tab since v33), e.g.
   the scratchpad's `sheet.md`.
3. `node textsync.mjs import <that file>`
4. `npm run build`, run `title step sound` (more if the text touches more),
   review the diff, commit, tag, deploy, refresh the bundle.
5. If the import named voice lines, regenerate those takes before the
   release — the words on the sheet and the words in the player's ears
   must not drift apart.

**After changing text in code by hand**, re-export so the sheet does not go
stale, and hand him the refreshed sheet or update it.

## The guard

`node runtests.mjs text` (harness `texttest.mjs`) fails if ANY visible text
on any screen is not editable from the sheet, or if a key in the sheet no
longer reaches anything. Run it after touching copy or markup — it is what
keeps the promise "everything is in the sheet" true over time.

## Guarantees worth keeping

- Round-trip is lossless: export → import leaves both source files
  byte-identical (verified; keep it that way).
- Apostrophes, quotes, commas, em-dashes, HTML tags and `&amp;` all survive
  in both directions.
- Unknown IDs and missing chapter fields warn on stderr, they never corrupt
  a file.
- The voice tab round-trips the same way (export → import leaves
  `src/voicelines.js` byte-identical; verified at v5.14 for both the CSV
  and the .xlsx), and `chaptertest` fails if a take has no row or a row
  has no take.
