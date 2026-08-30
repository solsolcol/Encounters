# Changing the words — the one-sheet workflow

Chad edits every word in the game from a single Google Sheet, on his phone,
without prompting for each change. This is how it works and how to run it.

## The sheet

**Master Z's Encounters — GAME TEXT v4 (edit here)** in his Drive
(id `1pYeF0Wog-QX-f8Ye2lFAI3lw1Fz9MAKpqfgPCMTpCjg` — the **v4** sheet;
v1–v3 are superseded and should not be edited).

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
| `src/strings.js` | every UI word the ENGINE says (85) |
| `src/chapters/ch1.js` | the CHAPTER's own words (18): brief, prompt, choices, teachings |

Both are hand-written and stay readable — the sync tool edits values in
place and never regenerates a file, so comments and structure survive.

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
