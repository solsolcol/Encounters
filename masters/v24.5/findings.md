# v24.5 · the findings, verified

Nine read-only code lenses (L1–L6 on episode 4 chapter 1, R1–R3 on episode 3 chapter 5), plus the probes (photographs,
real-input play-throughs, Continue at every phase). Every finding is checked against today's code, or a photograph, or a
measurement, before anything is touched (docs/V24.5-DEBUG-PLAN.md has the method). Verdicts:
- **CONFIRMED**: real; fixed, and the fix is noted.
- **PARTIAL**: part of it is real; that part is fixed.
- **REFUTED**: not real; the reason is noted.
- **LEFT**: real, but left alone; the reason is noted.

## Episode 4 chapter 1

### L6 · Words and purpose

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L6-1 | The card told every player "You asked who he was. Nobody knew." — `askedAny` counted any `who:` page, and the reading's page `who:read` is written for everyone before the decision, so "You never asked who he was" could never appear (a regression of CP13's L1-2 fix). | CONFIRMED | OPEN |
| L6-2 | The stock book names "Uncle Lim", a name the player never hears or reads; "She came because…" has no referent on a page titled "Who is he?"; "His answer was longer…" — the master answered no question, it was his reading. | CONFIRMED | OPEN |
| L6-3 | Card line A ("I kept what I saw as what I saw, and didn't decide what it meant") can sit over the conduct note "You wrote down what you thought it meant" on the same card. | OPEN | |
| L6-4 | The chant captions' stops are uneven: `chant3` and `chant2en` have none (L5-17 covered `chant1`). | CONFIRMED | OPEN |
| L6-5 | The flower stand's ribbon reads "GRANDOPENING". | CONFIRMED | OPEN |
| L6-6 | `fm1chant2`'s `where` leaves out ending D, which opens on it. | CONFIRMED | OPEN |

### L1 · Input and play logic

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L1-1 | WHAT CHANGED?'s fourth flash ("she is one step closer") is scored at her GROUP's spot, and her take stands her body 0.6 m to its side (v24.4's law: only the fade and ending C's shot were moved to where she IS). On a desktop a click on her is a false tap and the round ends with a miss ring on the curtain; on a phone she is never on screen in the storm, and the round always ends on a miss. The doorway sign's `hits` has the same fault. | CONFIRMED (arithmetic; photograph: OPEN) | OPEN |
| L1-2 | On a phone the fourth sign, the woman in the doorway, stands 47° from the view the chapter gives (a phone sees ±18.6°): after three signs nothing changes by itself and nothing points to her. | CONFIRMED (the drive stood at "3/4" for 300 s facing the master) | OPEN |
| L1-3 | The clock's change is scored at its DIAL, and what visibly stops is its PENDULUM, ~100 px lower (tol 35 px on a phone, 72 on a desktop): a tap on the stopped pendulum is a false tap. | CONFIRMED (arithmetic; photograph: OPEN) | OPEN |
| L1-4 | Desktop: the volume slider stays up during every minigame, and a press on it reaches the window's press handler as a press at the screen's centre — in WHAT CHANGED? a false tap (−3), in a briefing its START. Every episode-2/3/4 minigame, not only this one. | CONFIRMED (main.js: the handler excludes `#event` and `.soundBtn`, not `#volWrap`; `body.evopen` hides the sound button and not the slider) | OPEN |
| L1-5 | The cloth and the shadow can be written before the thing his line describes has happened (the shadow is offered from the first frame of the work; the first breath is 8 s in, the first gesture 4 s). | CONFIRMED | OPEN |
| L1-6 | Writing the fourth sign plays OBJECTIVE COMPLETE twice with an empty "new order" beat between. | CONFIRMED | OPEN |
| L1-7 | The cast's walks and his auto-turns run on a step clamped to 0.1 s: below 10 fps they run slow. | OPEN | |
| L1-8 | If Pong's model fails to load, the farmer and Pong can never be asked (`pongSat` is set only in his walk's callback). | CONFIRMED (latent: a failed download) | OPEN |
| L1 P-1 | Desktop Safari may refuse the pointer lock `ledgerFinish` asks for from a frame 1.65 s after the click, and a refusal blocks it for the session. | LEFT | Cannot be tested here; the same pattern closes the unlock and the choose windows since v14.7/v17.6, with no report of it. Put to Chad. |

### L2 · Save, resume and reset

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L2-1 | = L6-1. | CONFIRMED | = L6-1 |
| L2-2 | The storm can be paid twice: the frame's autosave runs between `evResolve` (which clears `ev`, so the save is no longer the event's `save0`) and the chapter's `.then` (a microtask after the frame), so a save can hold `storm` with the storm's payments applied and no note; a Continue runs the storm again on top of them. ~frame time ÷ 8 s per run. | CONFIRMED (code path) | OPEN |
| L2-3 | The bookmark after the storm (`storm:done`) is saved only if an 8 s autosave happens to fall in the 3.4 s hush: the decision, the endings and the cards are never saved, so a Continue there usually replays the storm. | CONFIRMED (code path) | OPEN |
| L2-4 | After Pong's page the bookmark trails by "Nobody I've asked…" (2.8 s): a save there resumes with Pong still to ask, and his exchange plays again. | CONFIRMED | OPEN |
| L2-5 | `freshRun` takes back every `who:`/`saw:` page of the episode's shared ledger, not only this chapter's. | CONFIRMED (latent until chapter 2 writes) | OPEN |
| L2 P-1 | The yard's people in the endings depend on the path: after a straight run yard Pong's walk resumes in the endings' yard shots; after a Continue, Joy and Lim sit on the benches again. | OPEN (photographs) | |

### L3 · Sound and timing

The scanner (`masters/v24.0/overlap.mjs`, the film and all three branches of A): no voice over another, nothing past an end, every gap of 1.5 s or more held. Every play-time sound warmed; every cue literal.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L3-1 | Ending D opens by restarting the chant play has stopped (CP13 L2-2 stopped it at the storm's end and opened his eyes), with his eyes shut again, and fades it out in the middle of its second phrase. | CONFIRMED | OPEN |
| L3-2 | The stock book sounds like a menu: no `sound` is passed, so the engine's UI click and confirm chime (the loudest things in the yard) open and write every page; the chapter ships `w4page` and `w4pen`. | CONFIRMED | OPEN |
| L3-3 | Ending A: the three breaths of the pao (8.6–11.0 s) are heard while the master sits upright; his only movement, the bow, comes after them. | OPEN (photograph) | |
| L3-4 | A panel opened mid-line (the menu, the bag) leaves a dead gap after it: the line is booked on the chapter clock, which stops under the panel while the voice plays on (e3c3's v21.21 class). | CONFIRMED | OPEN |
| L3-5 | The chant's re-trigger runs in play only, so a take that ends under a ledger page leaves the room without its chant until the book closes. | CONFIRMED | OPEN |
| L3-6 | Ending A's pen writes on for 2.1 s after its one scratch. | OPEN (photograph) | |
| L3-7 | The film's typed reply is heard late and runs on after "Who is he?" is sent. | CONFIRMED | OPEN |
| L3-8 | Four play one-shots are ducked to nothing under the line that starts with them (Pa Noi's water, her marker at 10 and 11, the envelope, the mala at 0.3). | CONFIRMED (levels measured by the lens) | OPEN |
| L3 P1 | Five voice pairs in B, C and A's pha-yant branch are 0.11–0.17 s apart: at 2–4 fps a cue fires up to a frame late, so they can touch. | PLAUSIBLE | OPEN |
| L3 P2 | A Continue into the work or the storm asks for the work's sounds only on the first live frame: the storm's first thunder can be spent undecoded, and the captions can lead a late chant. | PLAUSIBLE | OPEN |
| L3 P3 | The endings are warmed at the decision in the order A, B, C, D, behind ~330 s of A's and B's audio: a quick pick of C on a slow phone could open on silence. | PLAUSIBLE | OPEN |

### L4 · The engine seams as the chapter uses them

No soft-lock in S43–S48.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L4-1 | = L2-2: a minigame's payment and the chapter's bookmark straddle the frame's autosave — every chapter with kit events, not only the storm. | CONFIRMED | = L2-2 |
| L4-2 | = L1-4: the desktop volume slider over every minigame, and a press on it a minigame press. | CONFIRMED | = L1-4 |
| L4-3 | The rain's shader and buffers are built by the first `kit.rain`, so a Continue from the title (no `restart`, no `reset`) builds them on screen when number 14 is called — or on the first frame of a Continue at `called` (the v15.1 law). | CONFIRMED | OPEN |
| L4-4 | The ledger's close-swallow compares handler time with the touch's own clock: on a slow phone a tap begun under the book ends after the closing frame and reaches the room (a sign "found" without being looked for). | CONFIRMED (code path; needs a phone under ~2 fps) | OPEN |
| L4-5 | If the hands never load, the ledger's book is open and tappable but not drawn (its pass is gated on `handsReady`). | CONFIRMED (latent: a failed download) | OPEN |
| L4-6a | An instant daylight change does not mark `wx.dayFresh`, so a flash live across it would restore the old lights. | CONFIRMED (latent: every look the chapter makes in a flash is a tween) | OPEN |
| L4-6b | e4c1 passes a number as `kit.rain`'s second argument in five places (it works only because a number's `.secs` is undefined, so the change is instant — which is what was meant). | CONFIRMED (hygiene) | OPEN |
| L4-6c–g | Read-mode ledger buttons; the pick's 430 ms class timer; two phone tracks in one film; `mousePrimaryDown` (= R3-3); the round buttons visible and refused under the open book. | LEFT | Unreachable today (no chapter reads the ledger in read mode, opens two pickers inside 430 ms or two phones in one film); R3-3 is fixed under its own number. |

### L5 · Geometry and framing

Read-only arithmetic on the shipped GLBs and the real rig (72° vertical, phone 390 × 844, desktop 1280 × 800).

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L5-1 | The standing and walking cast are sunk into the floor: `mkPerson` measures the stand take's lowest foot bone in WORLD space (`getWorldPosition`, with the group already at its floor and `inner` scaled by s) and then sets `standInner.y = -sl * s + 0.005`, scaling a world height by s again — the group's own height and an s² term go into the offset. Joy (the sala, y 0.32) 0.38 m under, Lim 0.41, the stall woman (y 0.8) 0.84, Pong (y 0) 0.04. Seated poses are right (`seatContact`/`skinLow` work in the group's frame). Joy and Lim walk ROUTE_IN to the room when called, in front of the player. | CONFIRMED (code: the world-space measure, quoted) | OPEN |
| L5-2 | Ending C: the lens walks through Pong — the path's last leg (2.6, 7.4) → (2.4, 10.6) passes 0.125 m from where he is put (2.6, 9.4), at his head's height, looking 3 m on, so his face rushes at the lens and it goes through his head; the path also ends 0.22 m inside the pickup's front. | CONFIRMED (arithmetic on the path and `fPut`) | OPEN |
| L5-3 | Her body stands 0.6 m off her group's spot (v24.4's law), and four things still aim at the spot: (a) = L1-1; (b) ending B's glance (`dr = RMC.HER.door`) puts the doorway, not her, at three quarters of the half-frame, so on a phone she is off the frame and her fade is 0; (c) at the door spot her body is 0.13 m from the right wall and 0.18 m from the back wall, 10 % of her skin through the back wall, beside the curtained opening, not in it; (d) at the phone step her body stands in the master's platform. | CONFIRMED ((a) arithmetic, (b) code, (c)(d) arithmetic on the measured offset) | OPEN |
| L5-4 | The stall woman stands inside her table: put at z 25.6, inside the top's z 25.25–26.15 (`bx(2.2, 0.05, 0.9, …, Z − 0.3)`), and with L5-1 she is also 0.84 m down, her head under the top. | CONFIRMED (code) | OPEN |
| L5-5 | Endings A, C and D walk through the fence beside the gate, not through the gateway (|x| < 1.89): the lens crosses z 8 at x 2.51 (A), 2.58 (C), 3.02 (D), over the folded leaf and the low wall; Pong's walks in A and D go through the leaf and the wall in front of the lens. ROUTE_OUT uses the gateway. | CONFIRMED (arithmetic on the paths against the gate's posts at x ±2.1) | OPEN |
| L5-6 | Yard walkers freeze while he is in the room (`peopleTick` skips a person in a hidden world), so a walk begun in the yard resumes in the endings' yard shots: on a straight run Pong's called walk (14 m, ~13 s) is cut by the door and he finishes it in A's door shot and B's card shot, beside Pa Noi and facing the lens. | CONFIRMED (code: the skip, quoted) | OPEN |
| L5-7 | The chant caption covers the covered bowl (the breathing cloth, a sign) in the view the work gives: on a phone the bowl's dome is at y ≈ 637–700, under the caption's panel (y ≈ 586–700), and the breaths fall mostly inside the caption windows. | CONFIRMED (arithmetic) | OPEN |
| L5-8 | The takhian has no dresses: the hotspot is "The dresses on the tree" and both lines speak of them, and `yard.dresses` is declared and never filled. | CONFIRMED (code) | OPEN |
| L5-9 | Pong cannot turn to Ta Sombat (174° behind him, past his look's 1.7 rad clamp): the translator never faces the man he translates. | CONFIRMED (arithmetic) | OPEN |
| L5-10 | Pong's arrival walk clips the pickup's nose (0.12 m inside its corner at bumper height). | CONFIRMED (arithmetic) | OPEN |
| L5-11 | Ending A's walk opens with the lens 0.45 m from Pa Noi's head. | CONFIRMED (arithmetic) | OPEN |
| L5-12 | The walks of A, C and D end on a pitch dive: the look target is 3 m on along the path, so at the path's end it meets the lens and the view drops 45–84° in the last 0.1–0.4 s before the cut. | CONFIRMED (code) | OPEN |
| L5-13 | The room's door carries two markers ~48 px apart on a phone at 3 m (the 'called' waypoint and the door's own mark). | CONFIRMED (arithmetic) | OPEN |
| L5-14 | Pa Noi has no collider: walking into her at the board puts the lens inside her. | CONFIRMED (code) | OPEN |
| L5 P1–P4 | A sliver of sky past the wet step from the room's door; unpainted space past the painted storm from oblique spots; 2 cm slits in World S's shutters; Pong's soles in the shelter slab in D. | PLAUSIBLE | OPEN (photographs) |

## Episode 3 chapter 5

### R1 · The v24.3 sound code

Names, files, packs, warming, the beds' gates and clocks, the pools, the scanner (no voice over another, nothing past an end), the fades, the masking and the save are sound.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| R1-1 | The music box stutters: its phrase is 10.06 s (measured from the onsets), and the loop and the run-down were cut on 10.25 s (tune.py's 0.25 s lag steps), so `k5boxloop` carries the 25th note — the same E as the loop's first — 0.27 s before the joint, and the run-down's first E lands 0.36 s after the tune's 25th. A double strike at every seam at the counter and once in the room. | CONFIRMED (the lens's onset measure; re-measured before the re-cut) | OPEN |
| R1-2 | The engine starts every loop 60 ms in and loops [0.06, d−0.06] (for mp3's padding), so a loop built to join at 0/d joins somewhere else: `k5heart` drops a beat every loop under every yield, `k5decide` clicks every 34 s through the decision. Pre-existing in v23.0's `k5care`/`k5night`, e3c3's `galbed` and e3c4's `y4song`. | CONFIRMED (the lens's seam measure) | OPEN |
| R1-3 | The counter's box tune fades in under its first notes (the bed's ease on top of the engine's), and on a replay resumes wherever its source had got to. | CONFIRMED (low) | OPEN |
| R1-4 | The flame's hiss is a 2.2 s one-shot at the second tap, and the flame burns on silently through the hold and the wave. | CONFIRMED (low) | OPEN |
| R1-5 | A noise from the ambient pools (the guard's keys, a mop, the escalator, a room noise) can play on into the next film. | CONFIRMED (low) | OPEN |
| R1-6 | The run-down's gate allows play and the menu but not the bag: with the bag open at the mark, the drum turns in silence and the run-down plays when the bag closes. | CONFIRMED (low; a sibling of 18b839c) | OPEN |
| R1 P1 | Film K: the box's loop under two other tunes at other tempi for about a minute. | PLAUSIBLE | OPEN |
| R1 P2 | The yield's glint re-fires its sound every 0.9 s above 0.6 of the fill. | PLAUSIBLE | OPEN |
| R1 P3 | On a slow phone the key's clicks and the cups' pours bunch into one louder hit (it does not clip). | LEFT | Measured: 3 stacked keys peak at −2.4 dBFS. |
| R1 P4 | Every bed, once started, runs on at gain 0 for the rest of the chapter (up to 19 sources on a phone's audio thread). | LEFT | Engine-wide, since v14.16; put to Chad with the memory question. |
| R1 P5 | Ending A's last shot: `careFrame` still turns the drum after the shot has set it, so it jitters with the frame time. | PLAUSIBLE | OPEN |

### R2 · Dead ends and soft-locks, fresh (written before the records were read)

No soft-lock: at every step and every Continue some order is enabled, or a chain that always finishes is running.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| R2-1 | Desktop, on every replay: the key press that finishes a film's minigame also SKIPS the film — the stamp's third E/Space/Enter resolves the event inside the main keydown, and the film's skip listener (registered later, on the same key) then finds no event and skips; a held key's next auto-repeat does the same after the peek's slide and COME BACK. The red one's march, the shy one's coin and "Nobody ever comes", the surfacing and the gasp are skipped. | CONFIRMED (code path: `main.js` keydown returns, never stops the skip listener; `noSkip` holds only until the chapter is sealed) | OPEN |
| R2-2 | COME BACK's 30 s give-up runs on the event's capped step (¼ s a frame), so on a phone at 1 fps the light comes down to him after ~120 s, not 30. | CONFIRMED (latent: a hot phone and a player who does not climb; it still always ends) | OPEN |

### R3 · The v24.1 and v24.2 changes, audited

Every removed line of the five commits accounted for; no soft-lock, no wrong save, no other chapter regressed.

| # | Finding | Verdict | Fix |
|---|---|---|---|
| R3-1 | Desktop: the click on a briefing's START becomes the hold's seed on the next frame (`mousePrimaryDown` is still true and START never sets `e.down`), so the red one's riser is spent as a blip before the real hold. | CONFIRMED | OPEN |
| R3-2 | A hold is credited from when its handler ran (`downWall`), not from the finger's own time. | CONFIRMED (minor) | OPEN |
| R3-3 | `mousePrimaryDown` can stick true (a chord ending on another button, a mouse pointercancel), after which a hold fills by itself. | CONFIRMED (latent) | OPEN |
| R3-4 | Another episode's ledger, now kept, would show if a chapter of another episode opened the book in read mode. | CONFIRMED (latent: no chapter outside episode 4 opens it) | OPEN |
| R3-5 | The tracked sheet CSV was not exported after v24.2/v24.3's word changes; an import of it would revert them. | CONFIRMED | OPEN |
| R3-6 | The iOS long-press callout is off on the credits' links too. | CONFIRMED (cosmetic) | OPEN |
| R3 P-1 | The heartbeat kind is graded by handler time. | LEFT | Pre-existing since v9.7; outside this pass (e2c1, e3c1); written down. |
| R3 P-2 | iOS's long press is unmeasured. | LEFT | Cannot be measured here. |
