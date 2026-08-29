# The v3 Blueprint — making Encounters cinematic, Until Dawn's way

Status: PROPOSAL. Nothing here is built. Chad picks the package(s) and
order; research behind it is `docs/research/until-dawn.md`. Written
29 Aug 2026, after v2.4.

## The one-paragraph verdict

Until Dawn's power is not its graphics or its branching — analyses show
the branching is modest and heavily reconverges. Its power is a handful
of cheap, loud mechanisms that make players *believe* every choice is
permanent and *dread* what's coming: consequences that are advertised
the moment you act, punishments that are foreshadowed before they land,
failure that continues the story instead of ending it, and an authored
camera. Every one of those mechanisms is affordable in our engine, and —
the lucky part — Master Z's own trial game already contains the deep
per-chapter content (five beats per episode, four scored choices each,
scare grading, karma arithmetic) that Until Dawn's structure needs. We
don't have to invent depth; we have to stage what he already wrote.

## What we deliberately do NOT copy

- **Third-person cameras.** Until Dawn's own biggest lesson — they
  pivoted from first person BECAUSE perspective is tone. But rebuilding
  us as third person is a different game and a huge cost. Instead we get
  authored framing the way we already do: the cutscene engine takes the
  camera at every beat that matters, more often and more boldly.
- **The choice timer on moral picks.** The trial had a 30 s timer; Chad
  removed it deliberately (the ghost's drain is the pressure). Stands.
  Timers appear only in reflex moments (see Held Breath), never on the
  four-choice moral decision.
- **Shock for shock's sake.** The site promises "shared for awareness,
  not fear… nothing dramatised for shock." The trial's own rule keeps us
  honest: scare intensity is *derived from how bad the choice was*. The
  jolt is the consequence, never a random ambush. Sanity stays composure,
  never a mind breaking.

## The three packages

### Package A — The Cinematic Layer  (feel: Until Dawn; content: current)

All inside the existing chapter. Each item is small; together they change
what the game feels like.

1. **Karma Ripples** (their Butterfly Effect updates). The moment a
   choice or a meaningful act happens, a small ripple icon + one line
   ("The note remembers being taken") slides in and a **Karma Thread**
   screen logs cause → effect chains that fill in as consequences land.
   Their single most load-bearing trick, and it is UI + state.
2. **Freeze is not game over.** Sanity 0 stops ending the run. Instead: a
   short freeze scene (she passes; you couldn't move), a Karma Ripple
   ("Fear chose for you"), sanity partially restored, a wisdom cost, and
   the night continues. Their principle: failure produces different
   story. Also sits better with the site's care framing.
3. **Held Breath** (their Don't Move). When she hunts close: "HOLD" —
   touch and hold / hold a key, screen edges tighten, heartbeat rises;
   release too early and she turns. Tuned generously (their remake's
   oversensitivity is the documented failure mode).
4. **Omens** (their totems, in our cosmology). 3–5 findable signs in the
   scene — a bent joss stick, a stopped watch, a cold patch. Examining
   one plays a 1-second premonition flash built from our own cutscene
   engine (seek + filter — no new renderer). Warning omens foreshadow
   the bad endings; guidance omens hint the wise path.
5. **Scare grading from scores** (the trial's own rule). Choices carry
   the trial's scare levels: flash + shake + (Android) vibration scaled
   by how negative the choice was.
6. **Status updates as mirror.** After each decision, one reflective
   line under the deltas ("You are curious. Curiosity is not wisdom —
   yet."), and stats realigned to the source: start 70/10/5, rank from
   normalised wisdom only (fixes the divergence flagged in
   SOURCE-NOTES).
7. **More authored camera in play.** Letterbox bars creep in when she
   appears; a slow scripted push-in on the pile the first time the
   prompt shows; a held beat before the decision panel. All track-engine
   work we already know how to do.

### Package B — The Full Episode  (depth: this is the real one)

Restructure "Chapter 1" from one decision into Master Z's actual Episode
1 — **five beats, one night**: The Offerings (built) → The Presence (his
bedroom) → The Gathering (a spiritual gathering) → Back Home (the
pattern) → The Lesson (daylight). Twenty real choices, his words, his
scores, already balanced.

- **Prerequisite** (already roadmap step 1): extract the world builder +
  cutscenes into the chapter module. Then a "beat" = a small diorama +
  its choices + its scenes. Four new small dense dioramas (bedroom,
  gathering, home, daylight void deck — two are redressings).
- **Long-fuse consequences, parameterized** (their affordable-branching
  lesson): the same five beats always play, but earlier choices change
  intensity, lines, and gates. Took the note in beat 1 → the presence
  in beat 2 is bolder and the drain faster. Asked the adult → beat 4's
  "ask for help again" resolves warmer, and the finale acknowledges it.
  8–10 authored ripples per episode, no parallel scenes.
- **Cliffhanger cards + "Previously" recap** built from the player's own
  choice log when they return mid-episode.
- Persistence: the trial's own localStorage pattern (resume mid-episode).

### Package C — The Storyteller  (the frame that ties chapters together)

1. **Master Z interstitials** (their Dr. Hill, honestly ours). Between
   beats, a direct-address moment — his voice (a NEW ElevenLabs voice,
   distinct from James), a dark room, incense: he reflects on what you
   did, in his register, and once per episode asks a personalization
   question ("What do you fear more — what you can see, or what you
   can't?") whose answer quietly retunes later scares. On-brand: the
   real Master Z IS the teacher framing device.
2. **Case-file clues.** 6–8 examinable objects per episode that assemble
   the actual published case file in a journal; finding them changes
   narration lines. Finishing a clue line links out to the real file on
   encounters.triplegem.asia — the game feeds the site.

## Recommended order

**A → B → C**, shipped as v3.0 / v3.1 / v3.2. A transforms feel now with
zero new content risk; B is where "deeper content per chapter" truly
lands and rides the already-planned engine extraction; C makes the
multi-chapter frame sing before chapter 2 content lands. Chapter 2 then
arrives already cinematic.

## Costs, honestly

- A: days-scale. No new assets beyond ~6 small sounds + UI; biggest item
  is Omens' premonition flashes.
- B: the size of "chapter 2" as originally imagined, plus content wiring;
  the four dioramas are the long pole. The 16 MB preview-artifact cap
  will bite on embedded assets — hosted build becomes primary, preview
  stays playable with beat 1 fully embedded.
- C: days-to-week. New voice casting needs Chad's ear for the Master Z
  interstitial voice.
