# v14.0 · E2C5 · THE LAST QUESTION — the build record

Chad, 19 Sep 2026: *"Just go ahead and build the whole chapter, everything,
have checkpoints and milestones, save memory and context along the way,
execute continuously until its completely done."*

The design is `docs/V14.0-E2C5-PLAN.md`. This file is the BUILD's memory —
what is done, what is decided, what is next — so a session that loses its
context can pick up from the last ticked box.

## Decisions taken without Chad (he said go; all his to change on the sheet)
- **Title: THE LAST QUESTION.** His line — "Remember the question you asked me?"
- **No Pali term** on the `core` line. Episode 1's standard (v11.11 removed a
  tag rather than stretch one) and the v11.10 rule: the term comes from Chad.
  The lesson is said in Master Z's plain voice, about attachment.
- **The clerk is `recruit4` (David)** — the library's middle-aged Singaporean
  man, already cast in chapter 2. No new speaker for three counter lines.
- **The dread bed is NOT declared** (plan §10). The one deliberate absence.
- **The range NCO of e2c4 is renamed** — he cannot be the Tekong encik.

## Checkpoints
- [x] CP0 · plan doc (`df2c5c7`, `ccde492`, `33e0337`)
- [x] CP1 · sound — 34 voice takes, 5 sounds (`a2d30ac`)
- [x] CP2 · `src/chapters/e2/e2c5.js` DATA + build()
- [x] CP3 · the film
- [x] CP4 · play — clearance, encik, conversation, decision
- [x] CP5 · the four scenes
- [ ] CP6 · verify — episode card, resume, walktest, full suite, ep1 control
- [ ] CP7 · RELEASE — build, harnesses, push, DEPLOY from dist/, byte-verify, bundle

## Log
- CP0 done. Options and the encik's four answers are Chad's (plan §5, §6);
  verdicts B best / A good / D bad / C worst are his call of 19 Sep.
- CP1 done. `campday` dropped on the v9.2 phone-band measure; `campamb`
  reused, which build.py moves to the shared pack by itself.
- CP2-CP5 done in one file, `src/chapters/e2/e2c5.js` (~740 lines).
  chaptertest GREEN: 54 cutscenes walked, every cue inside its own length,
  both voice buses matching the registry, 2 episodes x 5 chapters.
  ZERO engine seams: main.js changed only by STING_SAMPLE rows and take-set
  names, so episode 1 is untouched by construction.
- The film is 33 s and ends ON THE RECOGNITION. `n5close` is cued under the
  FADE in all four scenes so it carries on under the outcome card (e2c4's
  `n4dawn` shape) instead of adding 11 s to every scene.

## CP5b — the range NCO (commit 1a413a4, pushed)

Chapter 5 makes the shouting man on chapter 4's range a DIFFERENT man from
the Tekong encik, because the whole premise of chapter 5 is meeting the
Tekong encik again months later at a mainland camp. `src/voicelines.js`
gains a `rangenco` speaker and `e4wait`/`e4down`/`e4line`/`e4back` move to
him. He still speaks in Hilmi's voice, deliberately: four Louis takes were
generated and measure 6.32 / 5.28 / 2.80 / 2.08 s against the shipped
5.88 / 3.79 / 3.08 / 1.88, and three of the four are cued INSIDE e2c4's
scenes A, B and C — installing them forces a re-timing pass on a chapter
already signed off. Session ids under `_rangenco_not_installed`. Chad's call.

## CP6 — verification (in progress)

- `npm run build` green; `dist/` carries `e2c5.*.js`, `audiopack_e2c5` and
  `opuspack_e2c5`; the single-file build still carries episode 1 only.
- `chaptertest`: 11 chapters, e2c5 at 28 cues / 23 distinct, every cue's
  sample exists, **54 cutscenes walked and every cue inside its own
  length** (the v12.3 check — `n5close` under the fade in all four scenes
  lands), 295 registry rows, 17 speakers, both episodes 5 chapters.
- `walktest` gained `e2c5` (its chapter list is hardcoded and had stopped
  at e2c4 — that is why the first green run never mentioned the chapter).
- `/tmp/epcard.mjs` — the CP6 probe for the EPISODE COMPLETE card on case
  file 2. It is the first run of that card on a case that is not episode 1,
  and the first time `epBtn` takes its OTHER branch: `nextChapterKey()`
  past e2c5 is null, so the button ends the run at the title instead of
  advancing. It checks the tally (the mean of five), the five stops, the
  trail (2 done carrying its rank, 3 next and unwritten), the wording and
  the button.

## CP6 — verification, DONE

All 24 harnesses green, episode 1 as the control. Three bugs found and
fixed, each by a probe and none visible on screen: `fireLight: null` threw
every frame (engine now takes a null); `makeConcrete()`'s `{ map, rough }`
went in as `map` (caught by walktest's new `pageerror` capture); and the
clearance was dead from the first frame because an empty bag was read as a
receipt. Three probes beyond the suite — forward play, resume at all five
phases, and the EPISODE COMPLETE card on case file 2 (its first run on a
non-episode-1 case, and the first time `epBtn` takes the end-the-run
branch). Details in docs/V14.0-E2C5-PLAN.md §16.

## CP7 — RELEASED v14.0

- build.py VERSION 13.2 -> 14.0, both builds green.
- commit `7426b09`, pushed to claude/new-session-bampns; tag v14.0 local
  only (tags do not push from these sessions).
- **DEPLOYED FIRST**: deploy `6aaf0fe40ac5211d8baff25d`, live at
  masterz-encounters-game.netlify.app, byte-verified against `dist/` —
  index.html, the engine, e2c5.js and audiopack_e2c5.json all match, and
  the live engine carries "14.0".
- Sheet v67 exported (masters/v14.0/masterz-text-v67.xlsx + .csv, and the
  tracked masterz-text.csv). NOT published: 48 KB is far past the Drive
  connector's base64 wall. **v44 stays the link.**
- Docs: CLAUDE.md (the v14.0 entry, EPISODE 2 IS COMPLETE, sheet v67, 24
  harnesses), docs/LEARNINGS.md (three new laws),
  docs/V14.0-E2C5-PLAN.md §16.
- Backup bundle refreshed — chapter milestone.

### The bundle

Rebuilt and VERIFIED — `git bundle verify` reports a complete history at
`62b7ec6` — 336 MB, which splits into 17 parts of 20 MB. It is NOT
delivered from this session and could not be: the Drive connector's base64
wall already blocks a 48 KB workbook, so 17 × 20 MB is out of the question,
and the file is gitignored, so it does not ride the push either. It lives
only on this container's disk, which is ephemeral.

What the bundle uniquely buys is an OFFLINE copy in Chad's own hands, and
the two durable copies are both in place: GitHub holds the branch and its
whole history (pushed), and Netlify holds the published build with two-tap
rollback (deployed and byte-verified). The bundle is the one part of the
milestone checklist that needs Chad or a different transport.
