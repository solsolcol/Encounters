# Reading the original — what Master Z already built

Notes on the three artefacts Chad supplied: the published casebook site, the 2D
trial game, and the operator's guide. Nothing here needs acting on. It exists so
that when we write Chapter 2, or reopen this in six months, we are not guessing
what the source material says.

Everything quoted is Master Z's own wording. The full extracts live beside this
file:

| File | What it holds |
|---|---|
| `source/site-case-files.md` | All 43 published case files — hook, full account, lesson |
| `source/trial-game-chapters.md` | All 15 trial-game chapters — every choice, score and teaching |

---

## The three artefacts

**`casebook.html` / `scroll.html` / `index.html`** — the published site at
encounters.triplegem.asia. Two presentations of identical content: a page-turning
book and a long scroll. `index.html` is a byte-identical copy of `casebook.html`,
so the book is what visitors currently land on. Both are fully bilingual;
every episode carries a complete Chinese translation alongside the English.

**`gametrial.html`** — a self-contained 2D choice game, 17 MB with every image
and audio track inlined as base64. Three playable episodes. This is the thing
our 3D game is a successor to, and it is far more worked out than a prototype
usually is.

**`GUIDE.md`** — written for whoever operates the site. Release schedule,
seasons, asset naming, Netlify deployment, and two warnings about breaking the
live site.

---

## The site

**43 case files across three seasons**, numbering restarting each season:

| Season | Name | Files |
|---|---|---|
| 1 | Before The Path | 20 (S1·20 is the finale) |
| 2 | The Path To Becoming Master Z | 12 (S2·12 is the finale) |
| 3 | Spiritual Encounters As Master Z | 11 so far |

Season 1 runs 17 Aug to 2 Oct 2026, Season 2 to 30 Oct, Season 3 to 25 Nov.
Every file unseals by itself at **9:00 PM Singapore time**; before that it shows
as *Sealed* with a live countdown and no video or comic. Files land **Monday,
Wednesday and Friday** — the guide still says Monday and Thursday, but the site
copy carries a schedule-change note, so three a week is current.

Each file is structured the same way, and it is a good structure:

- a **classification** (`object taken`, `karma & reflection`, `the dog noticed first`)
- a **meta line** — period, place, nature, runtime
- a **hook** of two or three sentences
- the **account** in three or four paragraphs, first person
- **the lesson** — always practical, never "and then it got me"

The seasons trace an arc worth knowing: Season 1 is Master Z as a child and a
young man having things happen *to* him; Season 2 is him going looking —
monkhood, teachers, mistakes including a Kumanthong he regrets; Season 3 is him
working cases for other people. The player's competence should grow the same way.

### Framing the site sets, and the game must not break

Three statements sit on the site under *Before you watch*:

> **Shared for awareness, not fear.** These files exist to help you understand
> the unseen and respond calmly to it. They are not made to frighten you, and
> nothing here is dramatised for shock.

> **Personal experience, not proof.** These are experiences that happened to me
> and to my family. I share them as I lived them. How you interpret them
> spiritually is entirely up to you.

> **Guidance sits beside care, never instead of it.** Spiritual guidance is not a
> diagnosis. If something is affecting your health or your mind, please see a
> doctor or a mental health professional as well.

That third one matters for us specifically. We have a **sanity** stat that
drains and a screen that says you lost. The trial game handles this carefully —
its sanity is a cost, never a fail state (see below). Ours currently kills you.
That is a real divergence and Chad chose it deliberately, but the copy on the
loss screen should stay on the right side of the line: it is about freezing in
front of something, not about a mind failing.

---

## The trial game — how it actually works

Three episodes, **five chapters each, four choices per chapter**. Not a
branching tree: every path goes through the same five chapters. What changes is
what you score and what you are told.

### The loop

```
cover → chapter story + 4 choices (30s timer)
      → ACTION scene    "you reach down and take the note"
      → CONSEQUENCE scene "nothing happens immediately, but…"
      → SCORE screen: three deltas + the teaching for that choice
      → next chapter, or the episode summary
```

Four screens per decision, each with its own illustration
(`ep1_1A_action`, `ep1_1A_consequence`, …). Every one of the 60 choices in the
trial has its own action image *and* consequence image — 120 images per episode
before counting the chapter intros. Worth knowing before anyone assumes the
art budget for a chapter is small.

### The numbers

Every episode starts at **sanity 70 · awareness 10 · wisdom 5**, clamped 0–100.

Scoring is `[sanity, awareness, wisdom]` per choice. Sorting all 60 choices by
what they *are* rather than which chapter they sit in, the design is completely
consistent — these are the real ranges, not an impression:

| Choice archetype | n | Sanity | Awareness | Wisdom |
|---|--:|--:|--:|--:|
| Observe / examine / compare before acting | 9 | 0 to +6 | +6 to +12 | **+6 to +12** |
| Ask someone experienced | 12 | +2 to +10 | +4 to +9 | **+5 to +13** |
| Create distance, leave, wait for daylight | 8 | −2 to +7 | +2 to +10 | **+6 to +12** |
| Investigate alone / unprepared | 10 | −7 to +4 | +3 to +9 | −9 to +8 |
| Dismiss it, ignore it, sleep on it | 5 | −8 to +3 | −7 to −2 | −9 to −4 |
| Declare it supernatural without evidence | 4 | −7 to −4 | −3 to −2 | −10 to −6 |
| Panic and run | 1 | −9 | −6 | −8 |
| **Provoke, challenge, confront, intervene early** | 9 | −12 to −2 | −5 to +6 | **−14 to −4** |

Three things fall out of that table.

**Provocation is the worst move in the game, every time** — the widest negative
wisdom band there is. That is the series' thesis expressed as arithmetic.

**Asking for help is the single best move**, ahead of even observing. It is the
only archetype that never once scores negative on any axis.

**Investigating alone is the interesting one.** It is the only archetype that
spans the whole range: awareness always rises, wisdom can go either way
depending on whether you improved your conditions first. That is where the game
actually asks something of the player.

**Only wisdom decides whether you pass.** Rank is *normalised wisdom mastery*:

```
maxWisdom  = 5 + Σ (best wisdom delta available in each chapter)
mastery    = wisdom / maxWisdom × 100
rank       = D <40 · C <55 · B <70 · A <80 · A+ <90 · S
pass       = mastery ≥ 55  (rank B)
```

Best possible wisdom is 58 for Episode 1, 48 for Episode 2, 60 for Episode 3 —
so the ceiling is per-episode, not a flat 100. Sanity and awareness are shown,
averaged into the campaign summary, and never gate anything. **Sanity is a cost,
not a life bar.** You can finish an episode on very low sanity and still rank S.

Passing unlocks the next episode and writes a campaign record. The campaign rank
is the average mastery across completed episodes. Replaying Episode 1 wipes the
whole campaign; replaying a later episode does not.

### The 30-second timer

Each choice is timed. At zero it picks **A** for you. A ticking sound plays over
the last ten seconds when sound is on. Chad had this removed from the 3D
version, and the sanity drain is what replaced it — pressure that comes from the
ghost rather than from a clock, and which stops the moment the panel opens.

### Scares

Choices can carry `scare: 'high' | 'extreme'`, which fires a screen flash, a
body shake and a phone vibration on the consequence screen. Where a choice has
no explicit level, one is *derived from the score*: total negative deltas of 5+
gives extreme, 3+ high, 1+ medium. A worse decision is literally a bigger
jolt. Only Episode 3 sets them by hand — eight of them, and every one is on a
choice that either escalates the situation (confront, chant early, go back up,
try to communicate, remove it yourself, challenge it) or refuses to read it
(assume it is harmless, panic and run).

### Persistence

Everything is in `localStorage` under `mzse_*` keys — current episode, chapter,
phase, the chosen letter, the three stats, and the full choice history. The game
resumes mid-chapter after a reload. Nothing is on a server.

---

## Mapping the game onto the site

The two number their episodes differently, which will cause confusion if nobody
writes it down:

| Trial game | Site file | Title |
|---|---|---|
| Game Episode 1 | **S1·02** | The Hell Note I Should Never Have Taken |
| Game Episode 2 | **S1·04** | The 3 AM Shower |
| Game Episode 3 | **S1·18** | The Room That Didn't Want Us There |

So the game skips S1·01 (*The Name That Was Given* — a trance at a family altar,
no decision in it) and picks the files that contain a choice. That is the right
selection principle for us too: **a case file becomes a chapter when there was
something the person could have done differently.** Plenty of the 43 are
beautiful and have no game in them.

Note also that Episode 3 jumps to a case where Master Z is the practitioner
being called in, not the boy it happens to. The game already changes who you
are between episodes.

---

## What this means for the 3D game

### Things to take directly

**The Episode 1 chapter data is written and balanced.** Our Chapter 1 currently
runs on placeholder choices I wrote. The real Chapter 1 — *THE OFFERINGS* — has
four choices that map almost exactly onto what we built: pick it up, examine it,
leave it, ask an adult. Same scores, same teachings, in Master Z's words.
Swapping ours out for his is a small job and an obvious improvement.

**The four-choice shape is right** and matches what we built.

**The three-part beat** — action, then consequence, then the teaching — is
better than what we have. We collapse action and consequence into one result
screen. In 3D the action could play in the world (you watch your hand reach for
the note) before the consequence card appears.

**Chapter 1 of Episode 1 is our void deck.** The other four chapters are
different places: a bedroom at night, a spiritual gathering, home again, and a
daylight conversation. If the 3D game is to cover a whole episode rather than
one scene, that is four more locations — which is exactly why the plan called
for small dense dioramas rather than one big level.

### Things we have deliberately diverged on

| | Trial | Ours | Why |
|---|---|---|---|
| Time pressure | 30 s timer, auto-picks A | none on the choice; sanity drains in the world | Chad asked for the timer to go |
| Sanity | a cost you carry | a fail state — 0 ends the run | Chad asked for the drain and the ending |
| Start stats | 70 / 10 / 5 | 100 / 50 / 50 | ours predates seeing this |
| Rank | normalised wisdom only | weighted blend of all three | ours predates seeing this |

The last two are worth fixing if the chapters are ever meant to line up with the
trial's scores — otherwise the same choice gives a different rank in the two
games. Not urgent, but it is the kind of thing that is annoying to change once
several chapters exist.

### One thing to be careful about

The trial's failure state is *not passing* — you replay. Ours is *dying*. Because
sanity in the source is explicitly a measure of composure under fear, and because
the site promises guidance sits beside professional care, our loss screen should
keep reading as "you froze and left without doing anything", which is what it
currently says. It should never read as a mind breaking.

---

## Operational notes worth keeping

From `GUIDE.md`, for whoever ends up shipping this alongside the site:

- Deploy is **drag the whole `encounters` folder onto Netlify**. Dropping loose
  files replaces the entire site and deletes the videos.
- Never move `triplegem.asia`'s nameservers to Netlify — only the `encounters`
  CNAME belongs there. Moving them takes down the main site.
- Assets are named by season: `ep1.mp4`, `s2ep1.mp4`, `s3ep1.mp4`, with
  `-poster.jpg` and `-comic.jpg` variants.
- `assets/og-cover-wide.jpg` is the Facebook link preview and appears nowhere on
  the page. Facebook caches the first version it sees for about a month.
- The site ships a PWA manifest — installable, portrait, theme colour `#07080B`.
  That is the same `--void` we took for the game's palette, so the two already
  match without anyone arranging it.
