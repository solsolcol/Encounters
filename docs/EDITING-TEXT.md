# Changing the words — the one-sheet workflow

Chad edits every word in the game from a single Google Sheet, on his phone,
without prompting for each change. This is how it works and how to run it.

## The sheet

**Master Z's Encounters — GAME TEXT v11 (edit here)** in his Drive
(id `11T7x2A4PDY0hLFBsFfSt100aIqkfiQJ6q3AITkOF8E0` — the **v11** sheet, made
at v4.9 with chapter 4's 23 rows. v10 (v4.8's, id
`1PoRkT2w7WxYDvJNg85v6XXt-BdgxHNtY2whXB1vvZ5o`) and everything before it
are superseded and should not be edited. Same rule as every handover: the
old sheet was read back and imported before the new one was generated —
its import produced a zero diff, so no pending edit of Chad's was
outstanding, nothing lost).
<https://docs.google.com/spreadsheets/d/11T7x2A4PDY0hLFBsFfSt100aIqkfiQJ6q3AITkOF8E0/edit>

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

**An empty TEXT cell removes that piece of text from the game** — the engine
hides the element rather than leaving a blank gap. That is the documented
way to delete a line without touching code.

The IDs are the contract: a row whose ID is not known to the game is skipped
with a warning on stderr, never silently applied and never able to corrupt a
file.

## Where the words live

| File | Holds |
|---|---|
| `src/strings.js` | every UI word the ENGINE says (93) |
| `src/chapters/ch1.js` | chapter 1's own words (18): brief, prompt, choices, teachings |
| `src/chapters/ch2.js` | chapter 2's own words (23): the same, plus its `words` block |
| `src/chapters/ch3.js` | chapter 3's own words (23) |
| `src/chapters/ch4.js` | chapter 4's own words (23) |

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
node textsync.mjs export text.csv     # game  -> sheet (regenerate the CSV)
node textsync.mjs import <file>       # sheet -> game
```

`import` accepts BOTH the CSV format and the markdown table the Google Drive
connector returns when it reads a sheet, so the connector's own output can
be saved to a file and applied directly. It unescapes the connector's
backslashes, so `\<b\>` and `\&amp;` come back as real markup.

**Applying his edits, start to finish:**

1. Read the sheet with the Drive connector (`read_file_content` on the id
   above).
2. Save that output to a file, e.g. `/tmp/sheet.md`.
3. `node textsync.mjs import /tmp/sheet.md`
4. `npm run build`, run `title step sound` (more if the text touches more),
   review the diff, commit, tag, deploy, refresh the bundle.

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
