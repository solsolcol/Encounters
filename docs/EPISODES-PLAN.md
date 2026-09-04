# TEN EPISODES · the architecture (v6.0)

Chad, after v5.30:

> Start preparing the proper architecture for future episodes. There will be
> a total of 10 episodes, each episode with 5 chapters. What we have done so
> far is all just episode 1, with 5 chapters.
>
> You need to revamp the chapter selector so that there is a tab to switch
> between episodes, and each episode lists out 5 chapters each.
>
> And the title chapter intro that fades in/out for every chapter should now
> also say 'Episode X' on top and above the line 'Chapter X'.
>
> Think of what else needs to be changed and improved with this architecture
> in mind. What other dependencies, what other things need to be enhanced and
> improved?

The ten, as given ("may be subject to change" — so they live in the text
sheet, not in code):

| # | episode |
|---|---|
| 1 | The Hell Note I Should Never Have Taken |
| 2 | The 3 AM Shower |
| 3 | The Room That Didn't Want Us There |
| 4 | The Love Spell That Followed Me Home |
| 5 | Not Every Master Should Be Trusted |
| 6 | The Ghost Clinging To Her Back |
| 7 | Spiritual Disturbance After A Crematorium Visit |
| 8 | The Toilet Possession: When Belief Isn't Enough |
| 9 | The Corner The Dog Wouldn't Go Near |
| 10 | The Mirror That Wouldn't Stop Banging |

Episode 1's title is what chapter 1's card has carried since v2.1 — "The
Hell Note / I Should Never Have Taken" — which says what an episode IS here:
one case file from the site, told in five chapters. The other nine are case
files too (`docs/SOURCE-NOTES.md`).

---

## 0 · The one principle

**The engine now knows what an episode is. A chapter declares which episode
it belongs to; everything that was keyed by chapter stays keyed by chapter;
everything that is really per-episode moves to the episode.** Chapters 1–5
keep their keys (`ch1`..`ch5`), their files, their sheet ids, their packs,
their saves. Renaming them would touch every save on every phone, both
audio packs, the voice registry, three harnesses and 370 sheet rows — for
nothing a player could see. New chapters get keys that carry their episode.

What ships in v6.0 is the part Chad named plus what it forces: the
registry, the selector, the card, the strings, the figure, the progress
logic, the harness checks. Everything else below is written down so it is
decided ONCE, before episode 2's first chapter file exists — most of it is
a decision for Chad, marked **DECISION**, with a recommendation.

## 1 · The registry

- **A chapter declares `episode: N`** in its DATA block (chapters 1–5 and
  the fixture say `1`; a chapter that says nothing is episode 1, so nothing
  moves). `id` stays what it is: the chapter's order INSIDE its episode
  (1–5). The play order is episode-major: sort by `(episode, id)`.
- **The engine holds the shape**: `EPISODE_COUNT = 10`,
  `CHAPTERS_PER_EPISODE = 5`, `episodeOf(key)`, `episodeKeys(n)` (the built
  chapters of episode n, in order). An episode with no built chapters still
  EXISTS — it has a tab, a title, and five rows that say "Not yet written".
- **Keys for episodes 2–10: `e2c1`..`e2c5`, files `src/chapters/e2c1.js`.**
  Never `ch6`: a chapter numbered past five lies about its place. The
  `?ch=` deep link takes any registered key, so `?ch=e2c1` previews it.
  `textsync`'s "is this a chapter's key" test (`^ch\d+\.`) learns
  `^e\d+c\d+\.` at the same time — the v5.15 trap (a prefix mistaken for a
  chapter's) written down so it is not walked into a second time.
- **DECISION · a folder per episode** (`src/chapters/e2/e2c1.js`)? build.py
  globs `src/chapters/*.js` today. Recommendation: yes, when episode 2's
  first file is written — fifty flat files is a drawer nobody can find
  anything in; a one-line glob change in build.py and `textsync`.

## 2 · The selector

One panel, as now, with a **row of ten tabs** above the list — numerals
("1" … "10"), because "Episode 10" ten times does not fit a phone; the
episode's full name reads under the row as the heading ("Episode 1 · The
Hell Note I Should Never Have Taken"). Under it, **five rows, always five**:
the built chapters as today (open, locked-not-yet-reached, the one you are
in), and for an unwritten chapter a row that says "Chapter N" and "Not yet
written". The tab that opens first is the episode you are in (or the
furthest reached, from the title). New strings, all sheet-editable:
`ep1.label`..`ep10.label` ("Episode 1"…), `ep1.title`..`ep10.title` (the
ten names), `chapters.unwritten` ("Not yet written"), `chapters.episode`
(the tab's screen-reader name, "Episode {n}") and `chapters.chapter`
("Chapter {n}", the label of a row that has no chapter file yet).

**v6.2 — the same panel, dressed** (Chad: "rather plain and boring ...
clear differentiation between episodes and chapters"): the tabs are
case-file cards in a scrolling strip (numeral, name, five dots, a stamp
when sealed), the heading is a stencil line over the name in the display
serif with "n of 5 chapters sealed", and the rows are stops on a line
that carry the rank each chapter got. Same ids and classes, so the
harnesses read it as before. docs/V6.2-SELECTOR.md.

**DECISION · the words on the title screen.** The button says "Chapters"
and the panel's heading says "Chapters". With ten tabs it is really the
episode list. Options: keep "Chapters"; "Episodes"; "Episodes & chapters".
They are sheet strings either way (`title.chapters`, `chapters.heading`), so
nothing waits on this. Recommendation: "Episodes".

## 3 · The chapter card, the resume note, the ask

- The black card gains a stencil line ABOVE "Chapter 1": **"EPISODE 1"** —
  `ep{n}.label`, so it is Chad's text. Same type, one step dimmer than the
  chapter line, so the eye lands on the chapter.
- The title screen's "Picking up where you left off · Chapter 3" becomes
  "· Episode 1 · Chapter 3" — the same `{chapter}` slot, filled with both.
- The selector's ask says both: "Play Episode 1 · Chapter 2 · The Presence
  from its beginning?".

## 4 · Progress and saves — one real bug avoided

The furthest chapter reached is one key (`mz.encounters.progress`), and the
unlock test compares chapter `id`s: `chId(k) <= chId(furthest)`. With
per-episode ids that restart at 1, episode 2's chapter 1 would read as
"already reached" the moment episode 1's chapter 5 was — every later episode
unlocked by arithmetic. Both the unlock test and "already further" in
`markReached()` move to the ORDER INDEX (position in the episode-major
list). The save format does not change: `reached` is still a key, the run's
`chapter` is still a key, `statetest` round-trips the same JSON.

**v6.2 addendum — the same key now also holds the RESULTS.** Beside
`reached`, `mz.encounters.progress` carries `sealed: { ch1: { score, rank,
t }, … }`, written by `finish()` through `markSealed()`: the latest result
per chapter, kept across a new game the way `reached` is. The selector
shows the rank on each sealed stop; the episode-complete card (§5) tallies
the five. `markReached()` preserves the object instead of rewriting it; a
store from before v6.2 simply has no `sealed` and reads as empty.

## 5 · Advancing, and the end of an episode

`nextChapterKey()` follows the episode-major order, so sealing episode 1's
chapter 5 leads into `e2c1` when it exists, and ends the run as it does
today while it does not. `startDecision()` prefetches the next chapter's
pack the same way across the boundary.

**DECISION · an episode-complete card.** The trial game scores per episode;
here the "Case file complete" card is per chapter. Between episodes there is
nothing yet. Options: (a) none — chapter 5's sealed card runs straight into
episode 2's opening film; (b) an EPISODE card: the five chapters' ranks, an
overall rank, the case's core lesson, then Continue. Recommendation: (b),
built with episode 2 — it needs a design pass of its own (what a case's
overall rank means; the trial's "only wisdom decides passing" model is the
divergence CLAUDE.md flags for revisiting) and it should not be guessed at
now with no second episode to lead into. What v6.0 does is keep the five
sealed results available: the run's save keeps the current chapter's stats;
an episode card needs the ranks of all five, so the save gains a per-chapter
`sealed` record when the card is built (statetest folds old saves in).

## 6 · Master Zav's figure — keyed by episode now

The v5.29 contract (young for episode 1, the teenager for episode 2, the
adult later) was keyed by CHAPTER "because the chapter key is what the
engine actually knows". The engine knows the episode now, so `ZAV_FIGURE`
is keyed by episode: `{ 1: 'zavyoung' }`, episode 2 → `zavteen` the day Chad
supplies the model, everything unlisted → `ZAV_ADULT`. Nothing else about
the panel changes.

**DECISION · his VOICE ages with him.** The boy of episode 1 is Aaron. A
teenager and a grown man do not sound like a boy. The registry already
names a speaker per take (`who`), so episode 2's lines can be `who:
'jamesTeen'` with its own ElevenLabs voice and its own bus settings (the
v5.26/28 bus is tuned to Aaron's crest). Recommendation: pick the teen
voice when episode 2's first lines are written, from candidates, the v5.14
way.

## 7 · The text sheet at fifty chapters

371 rows now. Each chapter adds ~30 text rows and ~20 voice lines; ten
episodes is roughly 1,500 text rows and 1,000 voice rows. The Drive
connector makes a sheet from CSV (the workbook route was rejected at v5.14
because base64 through a tool call is past what a session can carry
faithfully), so a multi-tab sheet is not on the table from here.

**DECISION.** Options: (a) ONE sheet, one long table, with a divider row
per episode ("EPISODE 2 — The 3 AM Shower") the way the VOICE LINES block
already has one — the current pipeline, unchanged, and the sheet's own
find/filter works on a phone; (b) one sheet PER EPISODE plus one for the
UI and the voice lines — `textsync export --episode 2`, five links to keep
track of. Recommendation: (a) until it hurts, then (b) — `textsync` already
knows every row's chapter, so the split is a flag, not a redesign. v6.0
adds the twenty episode rows and the new selector strings (sheet v32).

## 8 · Assets and sound at ten locations

- **Packs**: per chapter since v4.2, computed by build.py: a sound is a
  chapter's when exactly one chapter can ask for it, else shared. That rule
  makes the SHARED pack grow with every episode — a sound two chapters of
  episode 4 use lands in the pack every player downloads at boot.
  Recommendation: a third tier, computed the same way — a sound used by 2+
  chapters of ONE episode goes to that episode's pack, loaded with the
  episode's first chapter. Same for models: episode 1's HDB block is used
  by all five chapters; episode 2's location will be too. Nothing to build
  until episode 2 has two chapters sharing a sound.
- **Preload** stays: shared + the booting chapter's own.
- **The ghost**: she is the game's. Whether every episode's haunting is HER
  is the case files' call (several are a different entity); the engine's
  `ghost` declaration already lets a chapter switch her off or point her
  at another mesh, and a second entity is a second asset key, not a second
  ghost system.

## 9 · The two builds

- **`dist/`** is fine: assets are content-hashed and fetched on demand, so
  a fifty-chapter site costs a first-time player exactly what a five-chapter
  one does.
- **The single-file build (`hellnote.html`)** inlines EVERYTHING; ten
  episodes would make it hundreds of megabytes and it would stop opening on
  a phone. It is kept on purpose (v3.5: the offline fallback and the only
  surface `csptest` can drive). **DECISION**: (a) make it EPISODE ONE ONLY —
  the fallback stays real and the CSP test stays honest; (b) drop it.
  Recommendation: (a), a one-line filter in build.py, when episode 2 lands.

## 10 · Harnesses — "adding an episode must not add a harness"

- `chaptertest` (Node, no browser) gains the episode checks: every chapter's
  `episode` is an integer in 1..10; ids inside an episode are 1..5 with no
  gaps; `ep{n}.label` and `ep{n}.title` exist for all ten; the selector's
  new strings exist; `ZAV_FIGURE` keys are episode numbers.
- `menutest` walks the tabs: ten of them; episode 1's five rows; episode 2's
  five rows unwritten; the card shows "Episode 1" over "Chapter 1".
- `leaktest` builds EVERY registered chapter. At fifty that is fifty builds
  on a 1 fps box. **DECISION**, when it hurts: build the booting episode's
  chapters plus the fixture by default, all of them with `LEAK_ALL=1`
  before a milestone.
- `texttest`, `statetest`, `resumetest`: unchanged.

## 11 · Small things that go with it

- Credits: fifty chapters of bought models will need headings per episode
  in the panel. Strings, when needed.
- The `?ch=` deep link keeps working; `?ep=2` opening the episode's first
  chapter is a convenience, not a need.
- The chapter card's "Loading…" and the black hold are per chapter; nothing
  changes.
- `docs/` gains one plan doc per episode as it is built, the way
  `V4-CHAPTER2-PLAN.md` and `V5.0-CHAPTER5-PLAN.md` are episode 1's memory.

## 12 · What does NOT change

The cutscene language, the ghost system, the sanity/awareness/wisdom model
and the rank formula, the state format, the audio bus and the duck, the
asset seam, the two builds' pipeline, the sheet workflow. An episode is a
grouping of chapters and a set of words; the chapter is still the unit
everything is built from.

---

## What v6.0 ships (the concrete list) — SHIPPED at v6.0

1. `episode` in every chapter's DATA (1–5 and the fixture: `1`); the
   engine's `EPISODE_COUNT` / `CHAPTERS_PER_EPISODE` / `episodeOf()` /
   `episodeKeys()`; episode-major order; index-based unlock and reached.
2. The selector with ten tabs, the heading, five rows per episode, unwritten
   rows, the tab that opens on your episode.
3. "EPISODE N" on the chapter card; the resume note and the ask name the
   episode.
4. Strings: twenty episode rows + `chapters.unwritten` + `chapters.episode`;
   `textsync` WHERE labels and the `e\d+c\d+` key rule; sheet v32.
5. `ZAV_FIGURE` by episode.
6. `chaptertest` and `menutest` extended; docs (this file, CLAUDE.md's
   architecture section and the figure contract, EDITING-TEXT).
