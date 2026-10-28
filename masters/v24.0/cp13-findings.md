# v24.0 CP13 · episode 4 chapter 1, the review

Five read-only code lenses, each told to quote the line that makes a finding happen:
1. save, resume and reset;
2. sound and timing;
3. play logic and input;
4. engine regressions since v23.5;
5. words and fairness.

There is also a vision review: phone and desktop photographs of every film and ending.

Every finding is checked against today's code, or against a photograph, before it is touched. The verdicts:
- **CONFIRMED** — real; fixed, and the fix is noted.
- **PARTIAL** — part of it is real; that part is fixed.
- **REFUTED** — not real; the reason is noted.
- **LEFT** — real, but left alone; the reason is noted.

## Found before the lenses (CP9–CP12, by photograph and measurement)

| # | Finding | Verdict | Fix |
|---|---|---|---|
| P-1 | No head in the chapter ever turned to look at anything. `q.slerpQuaternions(qa, qb, t)` copies qa into q before it blends toward qb, so blending into the target itself blended toward the identity. | CONFIRMED | The blend goes into its own scratch (`_qlk`). Measured after: Pong 0.6–6° off the lens while he looks at it, Pa Noi 7–8°. |
| P-2 | Pong at the wheel rose 0.19 m off his seat: his soles were held on the cab floor (0.575) under a 0.80 seat. His crown was at 1.91, against the liner's 1.76. | CONFIRMED | The cushions are now at 0.76. His soles go under the floor, where nothing in the cabin sees them: crown 1.68. |
| P-3 | The master's card stood EDGE-ON to the lens in both of its shots (its face 87° off the line of sight) and was never seen. On a phone it was also under the letterbox, behind the fist. | CONFIRMED | It faces the lens (`face`). It is placed at a point of THIS screen above the hand that holds it (`screen`). |
| P-4 | Nine takes ended in 0.6–2.3 s of silence. The scan read voices over each other that never were. | CONFIRMED | Each is cut at the words' end + 0.3 s (`prep.py --keep`), and the lengths are re-measured. |
| P-5 | The downpour, the room tone and the drone summed to −20 dBFS in the voice band. Through the duck, Pong's whisper had only 5 dB over them. | CONFIRMED | The downpour bed was lowered from 0.55 to 0.40. The whisper now has 8 dB, and the cast's speech 12. |

## The lenses

All five lenses reported on 28 Oct. Each finding is listed with the lens's own number, its verdict once checked against
today's code, and its fix. **OPEN** means not yet verified or not yet fixed.

### L1 · Save, resume and reset

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L1-1 | A save during the call of 14 (`wait:…;n14`, written 0.6 s after the flip, `calledBegin` ~4.5 s later) resumes into a wait that can never call again: a soft-lock. | CONFIRMED | `applyPhase`: n ≥ 14 is the call itself (`yardResume('called')`). |
| L1-2 | After a Continue past `wait`, the card says "You never asked who he was" (`play.asked` is rebuilt only for `wait`). | CONFIRMED | `decideBegin` reads the asks from the ledger's `who:` entries as well. |
| L1-3 | The storm is paid twice on a resume: the `change` kind pays on the spot, the autosave runs mid-event, and the 3.4 s after `stormEnd` still read `storm`. | CONFIRMED | `stormEnd` writes `storm:done`, which resumes onto the decision; mid-event saves: OPEN (engine snapshot). |
| L1-4 | `reset()` never takes the chosen piece back; the bag adds a second, and a later Continue picks the first. | CONFIRMED | `freshRun()` at every start of the chapter takes the three pieces back. |
| L1-5 | The ledger survives a replay or Retry: every page "answers at once", no book, no award. | CONFIRMED | `freshRun()` removes this chapter's `who:`/`saw:` entries; the episode's others stay. |
| L1-6 | A Continue beside Pa Noi greets on the first frame; `arriveBegin`'s walk-in then replaces the walk to the seat, which alone sits Pong down: the farmer and Pong can never be asked. | CONFIRMED | The walk-in is skipped once greeted; the seat walk chains on from a walk-in still running, or starts from the gate. |
| L1-7 | A Continue shows the saved spot in the dissolve, then the phase is applied and everything jumps (the place-before-the-card contract). | CONFIRMED | `preStage()` places the saved moment under the card — the yard's hour, the board, Pong seated, the kneel, the room's light and state; applyPhase does it all again, idempotently. |
| L1-8 | A save between the board's flip to 12/13 and the walk in leaves Joy/Lim hidden but askable. | CONFIRMED | `applyPhase`: whoever's number is up is missed if never asked. |
| L1-9 | A save on the tick a ledger page closes keeps the entry and loses the +2 (the award is a promise callback after the autosave). | CONFIRMED | Engine `saveHoldOff(600)` when a ledger page or the chooser closes, so the chapter's answer lands before the next autosave. |
| L1-10 | A Continue into `storm` leaves the master looking at the player through the chant. | CONFIRMED | `applyPhase`: his eyes shut (`look = 0`) for a storm resume. |
| L1-11 | The slate is blank after a Continue past `consult`. | CONFIRMED | The day rides every bookmark past the reading (`~fri`); a room resume writes it. |
| L1-12 | `reset()` wipes the cab Pong's look at the road (`P.lookAt = null` after `films.end()`). | CONFIRMED | `P.lookAt = P.lookHome || null`. |
| L1-13 | An aborted storm (a faint) is treated as a finished one: the rain stops under the faint and a note is banked. | CONFIRMED | `.then` ignores `res.aborted`. |
| L1-14 | Probe-only: `reset()` neither lifts the kit's fade nor closes an open window, nor moves him out of World R, nor stops the chant. | PARTIAL | The chant: `chantStop` in `reset()` (L2-2). The rest is covered by the engine's restart and freshStage (unreachable in play). |
| L1-15 | A failed download soft-locks: the tray waits on Pa Noi's room model, and the fourth sign needs her model to have been seen. | CONFIRMED | `whenReadyOr`: the tray comes without Pa Noi (her voice from the doorway); the fourth sign counts the doorway when her model failed. |

### L2 · Sound and timing

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L2-1 | The chapter never calls `warmSounds`: every play-time one-shot (the chant, the drone, the match, the tube, the sandals…) and the first thunder are silent the first time; a cold line is dropped after 1.6 s. | CONFIRMED | WARM_YARD + WARM_ROOM from build(), WARM_WORK when called in and on a Continue into the room; engine `warmSounds` decodes at once when the pack is here. |
| L2-2 | The play-time chant is never stopped: it runs through the hush, under the decision and into the endings (two copies in D). | CONFIRMED | `play.chants` keeps every chant source; `chantStop` at the storm's end and in `reset()`. |
| L2-3 | The coda's taxi runs on under the shop shots and is cut at the card. | CONFIRMED | `sfxFade` on the taxi under the cut to the shop, in all four codas. |
| L2-4 | The coda's last chord is cut at its loudest (5.2 s into an 8 s chord). | CONFIRMED | CODA.black 20.6 → 22.6, end 21.8 → 24.2: the last image holds through the swell. |
| L2-5 | True silences in the endings that the scan read as held (A 11.0–13.8 and 36.8–39.4, B 13.2–15.0, D 17.7–19.2 and 21.9–23.4); the beds are zero in a cutscene. | CONFIRMED | Drips, frogs and eaves under A, B and D's silences; the holes scan reads none. |
| L2-6 | The opening film's cab loses its engine 6 s before the stop, then the engine-off is 11 dB louder than the idle. | CONFIRMED | A second diesel under the first's tail to the stop, faded at it; the engine-off at 0.16, the idle's own level. |
| L2-7 | The after-rain bed never plays under the decision (its 2.5 s are on the chapter clock, frozen there). | CONFIRMED | The hush is timed on wall time. |
| L2-8 | The chant's schedule is on the chapter clock, which stops under every ledger page. | CONFIRMED | `play.chantNext` on wall time. |
| L2-9 | The chant (a cast voice) holds the −8 dB duck for the whole work and storm. | CONFIRMED | fm1chant/fm1chant2 out of CAST_TAKES: the chant plays on the effects path, murmured under his lines. |
| L2-10 | The beds' ease clamps the frame step at 0.1 s: at 2 fps the downpour's "all at once" stop takes ~5 s. | CONFIRMED | `mixBeds` eases on the unclamped wall step (capped at 1 s). |
| L2-11 | B's after-rain and C's rain run on into the taxi. | CONFIRMED | `sfxFade` on B's after-rain and C's rain before the coda. |
| L2-12 | The storm's drone starts at `stormBegin`; a slow reader of the brief plays the last rounds without it. | CONFIRMED | The drone starts at the event's START (`onBegin`), waiting for its bytes. |
| L2-13 | The yard's first rain has no sound. | CONFIRMED | The light rain bed at 0.2 in the yard once he is called. |
| L2-14 | Plausible: the downpour's loop joint and the radio's loop. | LEFT | Plausible only; the loops were joined by hand and measured at the joint (CP11). Re-listen when Chad plays it. |
| L2-15 | The taxi bed is declared and never set (28.5 s of stereo decoded for nothing). | CONFIRMED | The taxi bed is gone from the beds; the coda cues the taxi as a one-shot. |
| L2-16 | No `stepSound`: shod steps in the room after the sandals come off. | CONFIRMED | A new `w4barestep` (the second run's take c, one footfall in 120–500 Hz) is World R's `stepSound`. |
| L2-17 | The water's sound plays at once while Pa Noi's line waits behind the tree's. | CONFIRMED | The water's sound is queued with her line. |

### L3 · Play logic and input

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L3-1 | WHAT CHANGED? is played from wherever the fourth sign left the view, and the view cannot move during it: on a phone the changes can all be off the screen. | CONFIRMED | `faceRoom()` turns him onto the master before WHAT CHANGED? opens. |
| L3-2 | = L1-1. | CONFIRMED | |
| L3-3 | = L1-15. | CONFIRMED | = L1-15. |
| L3-4 | = L1-5. | CONFIRMED | |
| L3-5 | A second tap on a change already found is charged as a false tap; Space, Enter or E taps the screen's centre. | CONFIRMED | Engine: a tap on a change already found is no tap; keys do not tap in a `change` event (START still takes them). |
| L3-6 | = L1-8. | CONFIRMED | |
| L3-7 | = L1-3. | CONFIRMED (part) | |
| L3-8 | Desktop: a click on the ledger page that misses both lines takes the pointer lock under the open book. | CONFIRMED | Engine: `tryLock()` refuses under the open book. |
| L3-9 | The call of 14 shows OBJECTIVE COMPLETE over an unfinished ASK. | CONFIRMED | The call posts OBJECTIVE COMPLETE only when the order on the box was to wait. |
| L3-10 | The "her" sign can be pressed with her still on the screen while he says "There's no one". | CONFIRMED | She is hidden as he turns to her, and back at the edge of sight after his line. |
| L3-11 | Plausible: the tree's look-spot can be pressed through the receiving room. | CONFIRMED | The tree is not offered when the line to it crosses the receiving room (`segBox`). |
| L3-12 | Pressing the door during Pong's "Our turn!" carries the yard's queue into the room. | CONFIRMED | `enterRoom()` empties the line queue. |
| L3-13 | The waypoint comes back over Pa Noi after the greeting cleared it. | CONFIRMED | The arrival waypoint only until the greeting. |
| L3-14 | Design: false taps are uncapped (3 each). | CONFIRMED | Engine `falseCap`: at most two false taps a flash are paid; each is still marked, buzzed and counted. |

### L4 · Engine regressions since v23.5

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L4-1 | S45: the lightning's restore samples the lights halfway through a daylight tween; the room stays at a quarter to a half of FLASH for the ~2 s he has to study it (desktop). | CONFIRMED | Engine: a live flash re-reads its base on every frame a daylight tween has written the lights (`wx.dayFresh`). |
| L4-2 | S44: the change is applied on the frame the lit phase ends, before the dark has come down: the cup can be seen to jump. | CONFIRMED | Engine: the change is made in the dark, 0.3 s in (`evChangeApply`), never lit before it is made. |
| L4-3 | S43: the ledger is not loaded at boot (the v14.14 class), and a new episode in the session does not clear it. | CONFIRMED | Engine: the title loads the save's ledger with the bag; the ledger is the episode's (`ledMine`), and another episode's first write replaces it. |
| L4-4 | = L3-8. | CONFIRMED | = L3-8. |
| L4-5 | = L3-5 (the key press). | CONFIRMED | = L3-5. |
| L4-6 | S48: the newest message's pop replays on every keystroke of the typed reply. | CONFIRMED | Engine: the list is rebuilt only when a message arrives; the draft is written into the bar alone. |
| L4-7 | S45: the hands' lightning lift is overwritten every frame in play. | CONFIRMED | Engine: `updateViewmodel` multiplies the hands' light by the lightning's lift. |
| L4-8 | Latent: a flash live at a chapter switch carries its lights into the next chapter. | CONFIRMED | Engine: `setChapter` runs `wxReset` before the new daylight. |
| L4-9 | `returnToTitle` keeps a queued thunder; `wxReset` leaves the rain's shape. | CONFIRMED | Engine: `returnToTitle` runs `wxReset`; `wxReset` puts the rain's length, opacity, colour and wind back. |
| L4-10 | e4c1 calls `kit.rain(0.12, 4, { len: 0.5 })`; the signature is `(k, o)`. | CONFIRMED | `kit.rain(0.12, { secs: 4, len: 0.5 })`. |
| L4-11 | Latent: the input that closes a read-mode ledger reaches the world. | CONFIRMED | Engine: the press that closes a read page stops there, and a tap within 450 ms of the close is not the world's. |
| L4-12 | = L1-13. | CONFIRMED | |
| L4-13 | Plausible: the ledger is built on first open, so its materials compile on screen; its page re-uploads every frame while ink runs. | CONFIRMED | Engine: `kit.ledger.prepare()` builds the book hidden on the next frame (it only records — called from build() on a cold boot it threw before the hands' scene existed; the boot check caught it), and the ink paints at 30 fps. |
| L4-14 | Informational: the tap timing reaches every chapter. | NOTED | Said in the v23.6 entry. |
| L4-15 | `#wxflash` composites in every chapter at opacity 0. | CONFIRMED | Engine: `#wxflash` is display:none whenever no flash is live. |
| L4-16 | "Message" and the "typing…" fallback are not on the sheet. | CONFIRMED | `film.phoneMessage` on the sheet, the bar's placeholder read from it. |

### L5 · Words and fairness

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L5-1 | `fm1items`'s gloss: ไม่ต้องเกรงใจ is "don't be shy", not "don't feel you have to" (the fairness read rested on it). | CONFIRMED | The gloss and its `where`; the choice is required in play, so the Thai stands. |
| L5-2 | Pong's English in A turns the master's wish into a prediction and credits him with placement advice; in B a conditional offer becomes an urging. | CONFIRMED | Re-voiced pg1Ank, pg1Atk, pg1Apy ("may your shop do well…" — the wish, then the piece) and pg1B5 ("if you want to learn, come back"). |
| L5-3 | The storm's note credits him with seeing what changed when he tapped nothing. | CONFIRMED | `noteStormNone`. |
| L5-4 | Ledger FACT lines that are not facts (Pong's "one sentence", "Nobody knows", Lim's guess, "Someone stood"). | CONFIRMED | Re-worded. |
| L5-5 | All four "What I saw" meanings read the master as sinister; the plan says they lean both ways. | CONFIRMED | Two lean kind. |
| L5-6 | Pong's home town is Udon Thani on his phone and Bangkok everywhere else. | CONFIRMED | Bangkok. |
| L5-7 | The brief says the dealer knows the master. | CONFIRMED | "says he knows". |
| L5-8 | "Nobody here actually knows who he is" can follow two conversations. | CONFIRMED | Re-voiced: "Nobody I've asked actually knows who he is." |
| L5-9 | Pong's reading leaves out the master's merit and calm mind. | LEFT | By design: the `where` says so, and he says "He said a lot more than that." |
| L5-10 | The master's reading ("many people walk past") contradicts the film's empty mall and slow week. | CONFIRMED | Re-voiced fm1read and pg1read: the shop is new, people don't know it yet, the money comes slowly — like a new well. |
| L5-11 | B's last image (the master's message after "…I stopped feeling like myself") reads as cause and effect. | PARTIAL | The message carries a wish for his shop; the beat stays (Chad's call). |
| L5-12 | Pa Noi calls เบอร์ where the board and research say คิว. | LEFT | เบอร์ is natural for a called number. |
| L5-13 | Khun Joy's "ah". | CONFIRMED | Re-voiced: "Good luck, na." |
| L5-14 | Uncle Lim echoes the question. | CONFIRMED | Re-voiced: "Ya lah, I'm from KL!" |
| L5-15 | Pong's "Next time you bring me" is backwards. | CONFIRMED | Re-voiced: "Next time you look for me also, okay?" |
| L5-16 | The key fob is called a brass Buddha in a comment (the block-figure rule). | CONFIRMED | A plain brass fob. |
| L5-17 | The chant caption's full stops, "krub", the greeting order, the trimmed core, the speaker label. | CONFIRMED | Fixed; the junior greets first. |
| L5-18 | Stale docs (the master in white, the card lines, pha sin, the registry header, the dog). | CONFIRMED | The plan's master in black (three places), §4.9 as shipped (the card lines, the brief, the storm's third note), pha thung in the plan and the models list, the registry's e4c1 header says MEASURED, the dog's bark is heard; and the script README's fairness line says what ไม่ต้องเกรงใจ means. |
