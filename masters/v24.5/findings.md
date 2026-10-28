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

## Episode 3 chapter 5

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
