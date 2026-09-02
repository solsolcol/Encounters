# Changing the words — the one-sheet workflow

Chad edits every word in the game from a single Google Sheet, on his phone,
without prompting for each change. This is how it works and how to run it.

## The sheet

**Master Z's Encounters — GAME TEXT v21 (edit here)** in his Drive
(id `1vFVnYeQrZSYk-buGrr72ImHzscE9iO0rEe8MHO4EQEY` — the **v21** sheet, made at v5.16: 250 GAME TEXT
rows and, under them after a divider row, the 97 **VOICE LINES**. What
changed from v20: three rows only, the credit for the standing man who
took the right-edge stander in chapter 3 (`credits.stand`,
`credits.standWho`, `credits.standLink`). Nothing else moved, in the text
or in the takes. v20 (id
`1wQ7wY9Co3j7yW3bOv0hys-jcB7pZRMWJphz2AzFWzw8`) and everything before it
are superseded and should not be edited. Provenance: v20 was published at
v5.15 and read back and imported the same session with nothing changed,
and it sat untouched between, so nothing of Chad's was outstanding when
v21 was made. Whenever a sheet has been in his hands for real time, read
it back and import FIRST — that is what the rule is for.
<https://docs.google.com/spreadsheets/d/1vFVnYeQrZSYk-buGrr72ImHzscE9iO0rEe8MHO4EQEY/edit>

**Every sheet from v19 on carries the VOICE LINES** — Chad's rule, set
when he asked for it: "moving forward, every new version of the sheet
should include these voicelines too." Every export carries them, so there
is no way to make a sheet without them.

**Why one tab on the Google Sheet, and where the two-tab version is.**
Chad asked for a tab. `textsync export <file>.xlsx` writes a real two-tab
workbook (GAME TEXT · VOICE LINES) and it is handed to him as a file with
each release — opened with Google Sheets on his phone it becomes a
two-tab sheet in his Drive. The sheet the connector CREATES from a session
is made from the CSV (text, proven since v3.0): the connector takes a
workbook only as base64 inside a tool call, and even a 20 KB workbook is
27 KB of base64 — past what a session can read back and re-emit without
risking a corrupt byte. So on the created sheet the voice lines sit under
the text, and `import` reads either layout the same way. If he moves them
to a tab of his own, or works from the workbook copy, nothing changes:
import finds every table on every tab by its header row.

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

In the workbook the VOICE LINES tab has seven: `ID (do not edit)` · `Who`
· `Chapter` · `When it plays` · **`TEXT — edit this column`** · `Length
(s)` · `Notes`. On the one-tab sheet the same rows use the four text
columns: `Where it appears` holds chapter — speaker: when it plays, and
`Notes` holds the length and any note. Again only TEXT is his. The ID is `voice.` plus the take's sample name
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
| `src/strings.js` | every UI word the ENGINE says (120) |
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
node textsync.mjs export text.xlsx    # game  -> the two-tab workbook the Google Sheet is made from
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
2. Save that output to a file, e.g. `/tmp/sheet.md`.
3. `node textsync.mjs import /tmp/sheet.md`
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
