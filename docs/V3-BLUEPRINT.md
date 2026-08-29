# The v3 Blueprint — one spine, staged thick

Status: PROPOSAL, revision 2 after Chad's direction (29 Aug 2026):
no branching complexity, no multiple outcome versions. What he wants:
more cutscenes, directed camera, cinematic feel, storytelling between
beats, and real meat per beat — "one action then next chapter" is not
gameplay. Research behind it: `docs/research/until-dawn.md`.

## The shape

**One linear spine.** Exactly like Master Z's trial game: every player
goes through the same five beats of an episode, in the same order, seeing
the same scenes. Choices change three numbers, the words on the teaching
card, and (optionally, later) a few one-line callbacks. They never create
alternate scenes or versions. This is also Until Dawn's real secret —
its branching is theatrical; its spine is shared. We keep the theatre,
skip the branching cost entirely.

**Thick beats.** The meat comes from staging each beat as a directed
sequence, not from outcomes. Target 7–12 minutes per beat, 45–60 minutes
per episode.

## The beat anatomy (the template every beat follows)

1. **Arrival scene** (~30 s, directed camera). A cutscene brings you into
   the beat: where you are, what the night feels like, James narrating.
   Letterboxed, skippable like all scenes.
2. **Guided exploration** (3–6 min). The observation game — which IS the
   series' teaching. 3–5 examinables per beat (the drum still warm, three
   joss sticks still lit, the plate of oranges, wax on the concrete).
   Examining one: the camera takes over for a slow close-up move, a
   narrated line plays, a caption card shows Master Z's words. The
   decision does not unlock until enough has been observed — "observe
   first" as literal gameplay, not just the lesson on the card.
3. **Escalation** (2–4 min). Scripted in-world events on a pacing
   timeline while you explore: the lamp flickers, a cry far off, a shadow
   crosses a doorway, she appears at a distance and is gone. Sanity drain
   arms partway through. Pressure rises toward the decision on a curve,
   not a jump scare lottery.
4. **The decision.** Untimed, four choices, as today.
5. **Action + consequence scenes** (30–60 s, directed). The trial's
   two-screen beat staged in-world: first the act (your hand takes the
   note), then the consequence as its own short scene (the warmth leaves
   the air). We currently collapse these; splitting them is the single
   biggest cinematic upgrade per decision — and it is per-CHOICE scene
   work we already know how to author (four exist today).
6. **Teaching card** with deltas and one reflective line, as today.
7. **Transition** (~20 s). A cliffhanger cut into the next beat, and
   between beats a storytelling interlude: Master Z's voice over a dark
   frame — what he remembers of that night, setting up the next scene.
   (The interstitial voice is a new ElevenLabs casting, Chad's ear
   required; James stays the in-world player voice.)

Optional garnish, all still linear: omens (examinables that flash a
1-second premonition — pure foreshadowing, no branches), Held Breath
(hold-still moment during escalation), Karma Ripple notifications (the
line "The note remembers being taken" — flavour, not state).

## Episode 1 mapped onto the anatomy

All five beats exist in the trial with full text (choices, action lines,
consequence lines, teachings — `docs/source/trial-game-chapters.md`):

| Beat | Place | New build |
|---|---|---|
| 1 The Offerings | void deck (built) | restage to the anatomy only |
| 2 The Presence | his bedroom, night | new small diorama |
| 3 The Gathering | a spiritual gathering | new small diorama |
| 4 Back Home | bedroom redressed | redress of beat 2 |
| 5 The Lesson | void deck at daylight | relight of beat 1 |

So: two genuinely new dioramas, two re-uses. The engine prerequisite is
the already-planned extraction of the world builder + scenes into the
chapter module (roadmap step one of chapter 2 — this work IS that work).

## Engine pieces the anatomy needs (all linear, all reusable for ch2+)

- **Examine system**: registered points of interest → camera take,
  narration, caption card, "observed" flag; decision gated on a count.
- **Event timeline**: per-beat scripted escalation events with triggers
  (time in beat, proximity, observation count) — a thin cousin of the
  cutscene engine's tracks, running during play.
- **Beat sequencer**: beat → beat flow with transitions, persistence
  (resume mid-episode, the trial's localStorage pattern), recap card.
- **Interstitial player**: voice + dark frame + skip.
- More scenes per beat = more cutscene authoring, the engine for which
  already exists and is the project's strongest muscle.

## The build order (each step playable and shippable)

1. **v3.0 — Beat 1 rebuilt thick, in place.** The existing void deck
   restaged to the full anatomy: arrival scene, five examinables, gated
   decision, escalation timeline, split action/consequence scenes for all
   four choices, transition out. Real Episode 1 Chapter 1 text swapped in
   (the placeholder choices finally retired). ~10 minutes of directed
   gameplay where there are ~3 today. **This is the template — Chad
   approves the feel here before anything is replicated.**
2. **v3.1 — Beats 2–5** built on the template + the two new dioramas +
   interstitials. The full 45–60 minute Episode 1.
3. **v3.2 — polish pass**: omens, Held Breath, ripples, recap cards,
   scare grading, stat realignment to the trial's scoring.

## What this costs

v3.0 is the sound-pass scale of effort — mostly authoring in systems we
have, plus three new engine pieces (examine, timeline, sequencer), new
voice lines and a handful of sounds. v3.1 is the big one (two dioramas,
four beats of authoring, interstitial voice casting). v3.2 is days.

No package needs alternate scene versions, ever. The five-minute-episode
problem is solved by staging density, not by outcome multiplication.
