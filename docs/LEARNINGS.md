# Learnings

Every hard-won lesson from building v0.1 → v2.1, so nobody pays for them
twice. When code in this repo looks odd, the reason is usually here.

## The sandboxed preview (CSP) — why the loaders look strange

- three.js GLTFLoader decodes embedded images via blob: URLs it then
  fetches — a sandboxed frame's CSP refuses that, silently dropping EVERY
  texture (models render flat white in production, perfect locally).
  `rescueTextures()` in main.js parses the GLB chunks by hand and decodes
  with `createImageBitmap(blob)` — no URL ever exists. Any model work must
  be tested with `csptest.mjs` (strict-CSP page), not just over file://.
- Same trap family: the logo is painted into a `<canvas>` via
  createImageBitmap (never `<img src="data:">`), and all audio goes
  through `decodeAudioData` (never `<audio src=data:>` or blob: URLs).
- Because `rescueTextures` hand-parses GLB chunks, be very careful with
  tools that rewrite GLB containers (gltfpack/Draco/meshopt) — that is
  why ghost compression is parked, not casually done.

## glTF / models

- Metal renders black without an environment map: RoomEnvironment +
  PMREMGenerator fixes it.
- glTF baseColorFactor is LINEAR; sRGB colors must convert or everything
  washes out. `material.color.setHex()` takes sRGB and converts — writing
  raw linear values is how the hands once looked like latex gloves.
- Downloaded rigged models can be broken by conversion: the Fab VR-hands
  GLB shipped with all 34 bone local transforms stripped (mesh collapsed).
  `fixhands.py` rebuilds each joint from inverse(inverseBindMatrix).
  Always verify a rigged model's bind pose reconstructs before assuming
  your own wiring is at fault.
- Skinned-mesh bounding boxes are bind-pose garbage: size characters by
  measuring the skeleton (bone span), never geometry bounds. Skinned
  meshes also need `frustumCulled = false`.
- The right hand is aligned at runtime by measuring four bones — swapping
  hand models means changing four bone names, nothing else.
- three.js sanitises glTF node names: Mixamo's `mixamorig:Hips` becomes
  `mixamorigHips`.
- The HDB model is a textured shell (its void deck is painted on a solid
  box, hidden as `Grd_Floor`) in millimetres (scale 0.001); the walkable
  corridor is built by us underneath the tower.

## Audio

- No browser allows sound before a user gesture. Music starts on the
  FIRST interaction of any kind, with PERSISTENT nudge listeners that
  only detach once the context is running AND the source is playing —
  `once:true` listeners lose the race against decoding and you get
  silence until someone presses the mute button.
- mp3 decoding pads both ends with silence: loop with
  `loopStart/loopEnd` inset ~0.06 s or the seam is audible every pass.
- Muted by default on desktop, unmuted on touch devices (Chad's call),
  remembered in localStorage `mzse3d_muted`. Everything — music, stings,
  voice — obeys the one mute; muting mid-voice-line stops the line.
- Music is mono 22.05 kHz 40 kbps (the track has 99.6% of its energy
  under 5 kHz — measure before assuming bitrate needs).
- The voice line fires on a real-time setTimeout (3 s), not frame time,
  and re-checks state/mute when it lands.
- iPhone Safari has TWO extra silencers beyond the autoplay gate: the
  ringer/silent switch mutes all Web Audio ("ambient" media) even while
  videos play — opt out with `navigator.audioSession.type = 'playback'`
  right after creating the context — and iOS suspends/"interrupts" the
  context on app switch, call, or Siri without reliably resuming it. The
  autoplay nudge listeners are long detached by then, so permanent
  resume paths (visibilitychange/pageshow/focus/pointerdown) must re-arm
  `actx.resume()`. Both found the hard way on Chad's iPhone, v2.4.

## The cutscene engine

- Every visual change is a TRACK: an absolute setter {t0,t1,fn,ease}
  re-derived from current time each frame. Skipping is seek(duration),
  screenshots are seek(t), and a stalled frame can never leave the scene
  half-applied. Sounds are fire-once STINGS, never fired by seeks.
  And `__enc.cine.seek()` also sets `cine.paused = true` (v5.25) — so a
  probe that seeks past a cue and then reads the cue log sees NOTHING and
  will report a working sound as broken. `cine.resume()` after the seek,
  then let the film RUN across the cue, is the only way to prove one fires.
- Scenes run on their own performance.now clock capped at 0.5 s/frame —
  the game's 0.05 dt cap would stretch an 8 s scene to minutes at 1 fps.
- Snapshot/restore the world around every scene; per-scene `keep`
  residues (e.g. the chant ending keeps the ghost gone). Restore must put
  back EVERYTHING a scene borrows — camera incl. roll, drum, ash, embers
  material, noteStorm, hand pose, viewmodel light.
- Viewmodel staging: position goes on `handsRoot`, angle on `armR` —
  rotating handsRoot orbits the whole arm around the camera and the hand
  leaves frame.
- At arm's length no downward pitch hides a standing ghost: the pick-up
  reveal works by having her CONDENSE during the look-up sweep, opacity
  racing the pitch.
- A scene must not trust play-state leftovers: the kick scene hides her
  at t=0 (play may have walked her right up to you) and produces her on
  cue at the drum.
- The prayer's left hand is a SkeletonUtils.clone of the right in a
  scale.x=−1 mirror group; materials cloned + DoubleSide (flipped
  winding); palms meet with rotateOnWorldAxis(±0.92) — local-axis turns
  open them outward; joined hands need their own light boost or they
  render black.

## UI / flow

- CSS transitions are frame-driven: on a stalling device they make no
  progress. Anything sequenced on a fade must wait for `transitionend`
  (with a timer fallback), and forcing a value mid-transition needs
  `transition:'none'` + reflow first, or you just start a second fade.
  This bit three times: the chapter card, the title handoff, the panic
  vignette on restart.
- An unprevented touchend spawns a synthetic click that lands on
  whatever just appeared under the finger: touch handlers are
  non-passive + preventDefault, and `pick()` ignores the first 340 ms
  after the decision opens (the stray-tap guard). Harnesses must wait
  ~700 ms after `interactPile()` before clicking a choice.
- Anything projecting world→screen mid-frame uses the PREVIOUS frame's
  camera matrices — call the sync (updateWorldMatrix + invert) first, or
  prompts linger after turning away.
- Canvas text drawn at load races web fonts: the pile's "!" glyph is
  built from stem+dot geometry because fillText painted the fallback
  font. Never fillText into a startup canvas with a custom font.
- Typography rules (Chad's): Inter for everything readable, mono only
  for numbers/keycaps, Cormorant only for the big title; no small mono
  in wide-tracked uppercase.
- Nothing opens by itself: the decision panel appears only via E / tap /
  click on the pile. Drain freezes while deciding (deliberate — choosing
  is not the pressured part). No timer on choices, ever.
- Additive glow materials over fire wash to milky grey — keep additive
  opacities ≤ ~0.5.

## Performance (mobile heat)

- Shadow maps are frozen (`shadowMap.autoUpdate = false` + a
  `shadowDirty` counter re-armed on model load) — nothing casting a
  shadow ever moves. Call `redoShadows()` after adding any caster.
- Frame cap 60 fps on touch only (gate at 1000/61 or a 60 Hz screen
  drops frames); desktop uncapped. Title idles at 8 fps; hidden tab
  draws nothing. Smoke/embers/star-twinkle at half rate on touch with
  dt carry-over so speeds are unchanged.
- Every dynamic light is paid on every lit pixel: three of the five
  lamps fake their pools with additive discs (CanvasTexture needs
  `colorSpace = SRGBColorSpace` or sodium reads grey).
- Declined for now (offer again if a phone still runs warm): lower
  canvas resolution, remove backdrop-blur.

## Testing discipline

- SwiftShader timings swing 5×: warm up before timing, never trust one
  sample, and always wait on game state (`getState()==='play'`), not
  stopwatches. The chapter card holds ~4 s after Start.
- Two harnesses share a two-core box: navigation timeout 180 s for the
  4.5 MB page; suite runs 2-at-a-time; batch the full suite if the shell
  caps command time.
- Logic tests run at ~500×350 viewports — software rendering cost is
  pixels; only `title` and `final` need real viewports.
- A portrait phone sees ~37° across: any test that taps a world object
  must aim the camera at it first (atan2), or the target is off screen.
- Tests can pass vacuously: ghosttest once asserted a removed behaviour
  at a spot where she never appeared. When a mechanic changes, re-derive
  the test from the new truth, don't just keep it green.
- `window.__enc` is the debug surface — extend it rather than poking
  internals from harnesses.

## Removing "dead" code safely

- Orphaned CSS hides in TWO places: the base rule and its responsive
  overrides inside `@media` blocks. Removing only the base rule looks
  complete and is not — v3.0 shipped with `.mark`/`.sub`/`.disclaimer`
  still referenced in two media queries after the base rules were gone.
  Grep for the bare class name, not the rule.
- The proof that a removal is safe is not "grep found nothing", it is
  "every element's computed style is identical before and after".
  `dbgcmp`-style comparison (reveal every screen, freeze animations,
  diff getComputedStyle across all elements at desktop/640/phone widths)
  is cheap and settles it. Freeze animations first or running keyframes
  make opacity differ in the 4th decimal and read as false differences.
- The title screen's dead rules were orphaned by commit 33f323a, which
  removed the prototype badge, subtitle and disclaimer ELEMENTS and left
  their styling behind. When something looks unused, find the commit that
  orphaned it — it explains the intent and confirms the finding.

## Pointer lock owns the pointer, not just the cursor

- While pointer lock is held, Chromium delivers pointer events to the
  LOCKED element, whatever is on top. So a HUD button can be visible,
  `pointer-events:auto`, on top in `elementsFromPoint`, with the right
  bounding box — and still be untappable, because the canvas gets the
  event. Playwright reports this as `<canvas id="scene"> intercepts
  pointer events`, which reads like a z-index bug and is not one.
- Only ask for the lock where there is a mouse to hide: `tryLock()` bails
  unless `(hover: hover) and (pointer: fine)` matches. iOS Safari has no
  pointer lock API at all, which is why the phone bug never showed on
  Chad's iPhone — it was waiting on Android Chrome, and on any emulated
  phone in the harness (desktop Chromium with touch emulation).
- The corollary: on a locked desktop, NO round HUD button can be clicked.
  That is why the equipment panel has a keyboard route (`I`) and the
  button wears an "I" badge, and why the panel calls `exitPointerLock()`
  on open and `tryLock()` on close. Any future in-play UI needs the same
  pair, or it is decoration.

## A truthiness lookup on a plain object accepts the whole prototype

- `obj[key]` is truthy for `constructor`, `toString`, `valueOf`,
  `hasOwnProperty`, `__proto__` — on EVERY object literal. v3.4 shipped
  two of these into review: `?ch=constructor` picked `Object` as the
  chapter and killed the boot (a dead title screen, a state v3.3 never
  had), and `applyState` accepted `'toString'` as an item id, storing it
  in the bag and rendering `<use href="#undefined">`.
- Both were validators — code whose entire job is rejecting bad input —
  and both read like correct guards. Use
  `Object.prototype.hasOwnProperty.call(o, k)` (not `Object.hasOwn`;
  it is ES2022 and this ships to phones) for ANY lookup where the key
  comes from a URL, JSON, or a save file.
- The same review pass found the sibling trap in coercion: `+null` is
  `0`, and JSON has no `undefined`, so `null` is exactly how a real save
  file spells "absent" — landing as sanity 0, which faints the run.
  Validate with `typeof v === 'number' && Number.isFinite(v)`, never a
  bare `+v`.

## An A/B test loses its control when the shared fixture moves

- `csptest` compared the same bytes with and without a strict CSP. Its
  control leg used `testlib.PAGE`. When v3.4 re-pointed PAGE at the
  hosted build, the control silently began testing a DIFFERENT BUILD
  from the CSP leg — so the two legs differed by build and policy at
  once, and the printed label ("no CSP (file://)") lied twice. Nothing
  in the diff touched csptest; the diff changed what csptest meant.
- When a shared fixture changes, grep every consumer for what it assumed
  the fixture WAS, not just whether it still runs. Both csptest legs now
  serve wrapped.html from its own server, differing only by header.

## Fire-once audio cues lose a race they don't know they're in

- Every pack sample decodes lazily on first request. A cue fired exactly
  once at a state transition (`if (!wasHere) { snd('boom'); say('line') }`)
  asks for buffers that do not exist yet on that first frame — `snd()`
  and `say()` return silently, the transition flag is already consumed,
  and the moment is gone forever. This is why v3.1's ghost appeared in
  silence while its music duck (which needs no buffer) worked: proof the
  trigger fired and only the samples were missing.
- Two fixes, both applied and both needed: `warmPlaySet()` decodes the
  whole night set at every entry into play, AND one-shot cues go through
  a queue that is replayed every frame until the buffers exist (with a
  deadline). Narration retries separately (`wantLine`) because it also
  waits out other lines and the opening voice.
- The rule for every future cue: it is either in a warm list or it
  retries. A bare `snd()` at a fire-once moment is a silent bug.
- ElevenLabs sfx v2 ignores durations written in the prompt text: without
  an explicit `duration_seconds` parameter it returns 0.5–2 s clips. Set
  the parameter (creative_update_node), don't fight the prompt.

## "In view" is not "visible"

- A frustum projection (`.project(camera)`) passes straight through
  walls. v3.3's spawn picker proved a point was on-screen and still
  placed the ghost behind the deck's rear wall from the most common
  play position — recreating the very complaint being fixed, found only
  by an adversarial review, because the harness stood where the deck was
  shallow. Visibility needs BOTH: bounds that respect the geometry
  (a rear wall the world actually has) and a line-of-sight march against
  the BLOCKER boxes the player collides with.
- The harness lesson: probe from the position where the promise is
  weakest (deep in the deck, facing the wall), not where it is easy.
  And prove a two-layer fix by removing BOTH layers — one layer can
  mask the other's absence.

## Testing a double tap on a software renderer

- Two back-to-back `touchscreen.tap()` calls land ~900 ms apart under
  SwiftShader — they queue behind ~1 fps frames — so they can never fall
  inside a 330 ms double-tap window. Measured, not guessed: instrument a
  capture-phase listener and print `performance.now()` gaps before
  concluding the game is wrong. The fix is to dispatch the pair in one
  task at the slot's real coordinates, through the same listeners; the
  game's timing constant stays honest for real devices.

## Environments (Cowork vs Claude Code)

- The Cowork cloud container had a fixed egress allowlist: it could call
  the Netlify/ElevenLabs control planes but NOT upload to Netlify or
  download from storage.googleapis.com — hence the zip drag-drop deploy
  and the "you download, then attach" audio loop. In an environment with
  open network, both become direct: run the Netlify MCP deploy command
  from `dist/`, and fetch ElevenLabs results straight into `assets/`.
- The claude.ai preview artifact can only be updated from a session that
  can read the artifact host (`*.frame.claudeusercontent.com`); without
  it, publishing needs force-overwrite — ask Chad before forcing.
- GitHub: he owns github.com/solsolcol/Encounters (empty). Pushing never
  worked from Cowork (proxy scope); from an open environment it should.
  He found GitHub setup hard — set it up FOR him, don't teach it.

## A cutscene is mostly the engine, not the chapter

- Moving the four scenes into the chapter (v3.5) looked like moving
  chapter content. Measured first: the scenes reference **28** engine
  names — camera, yaw, pitch, ghost, ghostLight, ghostOpacity, handsRoot,
  armR, noteProp, the prayer arm, the viewmodel lights, shadowDirty — and
  about six chapter props. A cutscene is stage direction; only the stage
  belongs to the chapter.
- So the seam is a LANGUAGE (`sceneApi`), not a prop bag: the verbs from
  `A(c)` plus the cast a scene may direct. Three of its members are
  accessors on purpose — `prayerArm()`, `rightHand()`, `getReveal()` —
  because the arms do not exist until the hands finish loading and
  `reveal` changes under the scene's feet. Capturing any of them by value
  at scene-build time freezes the wrong answer.
- Measure the seam before you design it. Both extractions in v3.5 were
  scripted only after counting the two-way references, and both scripts
  refused to remove a line from the engine that was not already present,
  verbatim, in the chapter — which is the machine version of this repo's
  "account for every removed line" rule, and stronger.

## renderer.info counts what was UPLOADED, not what exists

- The first leaktest passed with a perfectly flat zero and meant nothing:
  it built and disposed the world without ever drawing it, and three.js
  only registers a geometry or texture with the GPU on first render. The
  counts were sitting at whatever the last dispose had left.
- Draw before you measure. With two real frames per cycle the numbers
  became 55 geometries / 21 textures and stayed exactly there over eight
  build/dispose cycles — which is the actual proof that `dispose()` frees.
- Removing an object from a scene frees NOTHING in three.js. Geometries,
  materials and every texture hanging off those materials each need their
  own `.dispose()`, and the textures are the ones people forget.

## Never score a sighting the observation window did not stage

- Twice now a ghosttest section has flaked by measuring something that
  arrived from OUTSIDE its own setup. v3.3: `chaseComesCloser` counted a
  sighting cut off by the end of the window. v3.5: the deep-deck section
  teleports the player to the burner and counts the next few spawns — but
  she is often still visible from the previous section, staged for a
  player who was standing somewhere else, so it scored an appearance that
  was never meant to be seen from there. Measured at two runs in five.
- Both looked like engine regressions and neither was. The tell: it does
  not reproduce when the section is run on its own.
- The fix is the same both times: make the section OWN everything it
  measures. The deep-deck check now walks out of range first (she fades),
  asserts she is actually gone (`deepStartsClean`, so a broken retreat
  reports itself instead of quietly restoring the flake), and only then
  returns to the burner and starts counting.
- Generally: when a harness drives a state machine through several
  scenarios in one page, each scenario must reset the machine, and the
  reset must be asserted. A shared fixture that carries state between
  sections is a flake generator.

## Mutate the derived values; never reassign the binding

- v3.6 had to make "which chapter is playing" changeable, and the obvious
  move — turn every `const` derived from CH into a `let` and reassign —
  would have been a slow-acting bug. `const OFFER_POS = SHRINE` aliases the
  same Vector3; several closures had already captured `BOUNDS`. Reassigning
  the bindings leaves every alias pointing at the OLD chapter's numbers, and
  the only symptom is the player walking through a wall in a later chapter,
  a long way from the change that caused it.
- So `SHRINE`, `GHOST_HOME`, `BOUNDS` and `SPAWN` stay `const` and are
  MUTATED in place (`.set()`, `Object.assign`). Every alias then stays
  correct by construction rather than by everyone remembering.
- Only three things genuinely had to become reassignable: `CH`, `CH_KEY`,
  and the scene list — and the scene list was better solved by deleting the
  binding and reading `CH.scenes` at call time. A captured list would have
  played the previous chapter's cutscenes over the new chapter's world.
- The general rule: when something becomes swappable, hunt for who has
  already taken a reference to it. `grep` for the name, and treat every
  alias and every closure as a place the swap has to reach.

## An autosave has to decide what it refuses to save

- The temptation is to save everything, continuously. The v3.6 save
  deliberately writes ONLY during `state === 'play'`: restoring into a
  half-open decision panel, a running cutscene or the faint sequence is the
  fragile case, and it buys the player nothing.
- Two consequences worth keeping. She is never restored mid-appearance —
  the ghost re-arms from hidden, which is also the right staging (you come
  back to the deck, not to the middle of a jump scare). And fainting
  REWRITES the save to the start of the chapter, because leaving the last
  autosave in place would let a player close the tab mid-faint and resume
  three seconds earlier with two sanity: a cheat and a trap at once.
- Test the promise, not the mechanism. "Reveal is 0 a second after resume"
  is the wrong assertion — the saved spot was inside her trigger radius, so
  she quite properly appears. The right one is "reveal is 0 on the FIRST
  frame of the resumed run", which is what resume actually controls.

## A hard-coded "no fallback" list is a silent-sound generator

- `sting()` looked its kind up in `STING_SAMPLE` and, on a miss, fell into
  a procedural switch — with `if (kind === 'kick' || kind === 'scream' ||
  kind === 'chant') return;` in front of it to catch the three kinds the
  synth cannot fake. That list is the wrong shape: it enumerates the
  EXCEPTIONS, so every sound added afterwards has to remember to join it,
  and none of them would have. Inverted at v3.7 into `STING_SYNTH`, the
  set of kinds the synth CAN fake; everything else is sample-only by
  construction.
- The failure this prevents is the nastiest kind in a game: a cue that
  names a kind which does not exist plays nothing, logs nothing, and looks
  exactly like a scene that was written without sound. `chaptertest` now
  reads every `sfx(t, 'kind')` out of every chapter and fails if the kind
  is not in `STING_SAMPLE` or its sample has no file in `assets/audio/`.
  Statically, out of the source — running a scene needs the whole cast
  built first, and every cue in the game is a literal.
- Give a scene a volume scale (`sfx(at, kind, vol)`) rather than a second
  sample. The same dread bed is loud under a reveal and 0.28 behind a
  turned back; without the scale that is two kinds, two files and two
  things to keep in sync.

## Identify a played sound by its buffer, not its duration

- Probing "did this cue actually sound?" means hooking
  `createBufferSource` and naming what starts. Matching the decoded buffer
  against file durations does not work twice over: an mp3 decodes tens of
  milliseconds longer than the file, and several of the pack's samples are
  the same length anyway (`boom`/`breath`/`clang` all 2.51 s). A duration
  table quietly reported `swoosh` as missing when it had played.
- The pack decodes each sound once and reuses that AudioBuffer object
  forever, so the reliable table is a `Map` keyed on the object itself:
  play every name once at inaudible gain, record `s.buffer`, then look up
  what the scene starts. Exact, and it cannot confuse two samples.

## A cutscene's sounds must end with the cutscene

- Stings are fire-and-forget `BufferSource`s, so a nine second chant
  started at 1.35 s carries on happily over the teaching card when the
  player skips at 2 s. Every sample a scene starts is now recorded and
  ramped out over 300 ms in `cineEnd()` — a ramp, not a `stop()`, because
  an abrupt cut clicks.
- The corollary when writing a scene: a cue is only as long as the time
  left in the scene. Scene D was extended from 8.6 s to 10.4 s so James's
  chant finishes rather than being cut, and the held beat got a slow pitch
  settle so the shot is still moving while it waits.

## SwiftShader's frame rate is a load-bearing part of what you measure

- The teaching typewriter ticks every third character, guarded by
  `n - shown < 8` so a fast-forward tap does not fire dozens of samples in
  one frame. At the container's ~1 fps a whole 32-character line arrives
  per frame, the guard suppresses it, and the probe counted three ticks
  for a long paragraph. That is the guard working, not a bug: at any real
  frame rate (even 5 fps) fewer than two characters arrive per frame.
  Read the guard before believing the count.

## An upload-lagging counter needs a WARM baseline, not just a warm end

- `leaktest` compares `renderer.info.memory` after the first rebuild against
  the count after eight more, and fails on a positive slope. The baseline was
  a single sample taken right after cycle one — and renderer.info counts what
  has been UPLOADED, which only happens when an object is actually drawn.
- On a loaded box (two harnesses on two cores, and since v3.7 a title video
  decoding behind them) the two frames after that first rebuild can miss part
  of the world. One run read 55 geometries where every other cycle reads 70,
  and the harness reported a 1.88-per-cycle leak that did not exist: an
  undercounted baseline manufactures a slope out of nothing.
- Proved it was the measurement, not the engine, before touching either: a
  probe logging the count after every one of 22 rebuilds read 70/22 dead flat
  the whole way. A 1.88/cycle leak would have reached 111.
- The fix is three warm rebuilds before the baseline, so BOTH ends of the
  measurement come from a fully uploaded world and the slope between them is
  the steady-state slope — which is what the harness was always about. That
  is a sharper measurement, not a relaxed threshold; the 0.5 limit is
  unchanged.

## "The engine" was chapter 1's engine, in eight places

Building chapter 2 was mostly an exercise in finding out what the engine
actually knew about chapter 1. Eight things that read as engine behaviour
turned out to be void-deck behaviour, and only a second, DIFFERENT location
could have found them — the fixture chapter is deliberately abstract, so it
sails past all eight. In rough order of how badly they broke:

1. **Her territory.** `GHOST_MIN_DIST 3.4`, `GHOST_APPEAR_AT 14`, and a
   roam box 41 m across clamped to literal deck coordinates. In a four
   metre bedroom she could never come near you, was always "in territory",
   and a flee clamped her eighteen metres away through the wall.
2. **The ambient loops.** A joss fire keyed to distance from the shrine,
   burning quietly on a shelf beside a boy's bed at more than half volume.
3. **The words that name what you act on** — "the glowing pile", "Examine
   the pile of hell notes", "Something is burning ahead". All on screen, in
   the bedroom.
4. **The proximity narration** — `say('vpile')`, `say('vnote')`, by name.
5. **The line under the outcome card** — `speak('v' + c.k)`, so chapter 2
   would have spoken chapter 1's four.
6. **The opening voice line** — "Almost midnight, and this is still the
   fastest way home", in a bedroom.
7. **`textsync`** named `ch1` throughout, so a new chapter's words could
   never reach the sheet Chad edits. A broken promise, not a missing
   feature.
8. **`shrine` means two things** and chapter 1 never had to separate them:
   the anchor for HER, and the chapter's warm light. Putting chapter 2's on
   the altar made the safest object in the room the source of the haunting.

Every one was fixed the same way, and that is the transferable part: **the
chapter declares it, chapter 1's current value is the default, so nothing
moves.** No behaviour changed for the deck — including three different
insets that used to hang off one constant, preserved as offsets rather than
quietly unified, because unifying them would have shifted chapter 1's ghost
five centimetres for no reason anyone asked for.

The lesson for chapter 3: when something in the engine is a NUMBER or a
NAME, ask whether a different location would want a different one. If the
honest answer is yes, it belongs to the chapter, and the deck's value is
the default.

## An opening film needs its buffers warmed harder than a scene does

- A cutscene between choices runs deep into a session: the pack has been
  warmed by entering play, by the decision panel, by the last ten minutes.
  A chapter's OPENING film has none of that. It runs on a screen that has
  only just gone black, before the player has done anything at all, and a
  line that misses its cue in the first ten seconds of a chapter is the
  first thing anyone notices about it. Hence `warmIntroSet()`, separate
  from `warmPlaySet()` and called before the film, not with it.
- The same film must also wait for the WORLD. A chapter card over an
  unloaded world is just a card; a camera move through one is a move
  through an empty room. `whenWorldReady()` was lifted out of the card's
  own gate so both use it.

## eleven_v3 failures are TRANSIENT, not textual — re-run, do not rewrite

- **This entry corrects the v4.0 version of it.** At v4.0, five of eleven
  lines failed with "Failed to generate audio" and the conclusion drawn was
  that length plus fussy punctuation caused it — an ellipsis mid-sentence,
  an inline `[exhale]`, a comma splice. Rewriting them fixed it, so the
  theory looked confirmed.
- At v4.1, SEVEN of sixteen failed, and the theory did not survive contact:
  *"I knew better. I went up there anyway."* failed while *"I did not move.
  I just watched it come closer."* passed, in the same batch, same voice,
  same shape. *"Half the block is down here tonight."* — one plain sentence,
  the shape that had just "explained" three other failures — passed. Every
  failed line succeeded on a straight re-run with the text unchanged.
- So the failure rate is roughly one in three and it is random. Budget for
  it: generate, check `has_failures`, re-run the failures, repeat. Do NOT
  rewrite the line, because a rewrite that then succeeds will look like a
  fix and teach the next person the wrong lesson — which is exactly what
  happened here.
- The em-dash rule above still holds: that one is reproducible.

## Two collision heights, and chapter 3's crowd lives in the gap

- `collide()` tests the player at **y = 1.0** (`main.js:4041`). `lineClear()`
  marches HER sightline at **y = 1.4** (`main.js:778`). Nothing had ever
  needed the difference before, because chapter 1's blockers are pillars and
  chapter 2's are walls, and both are taller than either number.
- Chapter 3 is six rows of chairs with a ghost standing among them. A
  blocker that tops out at 1.20 stops the player walking through the seating
  and does not block her being seen over it — which is the entire staging of
  the chapter. Those boxes are therefore built BY HAND, not through
  `Box3.setFromObject().expandByScalar(0.22)`, which would grow a 0.95 m
  chair to 1.17 and, on a slightly taller chair, past 1.4 — at which point
  her appearances start being silently rejected at random by `lineClear`.
- The general rule: if you build blockers from the geometry, you inherit the
  geometry's height. Sometimes the height is the point.

## A room tone never stops; a ritual does

- The ninth "the engine was chapter 1's engine" leak, and it only surfaced
  when a chapter had a bed that STOPS. Chapters 1 and 2 run crickets, a fan
  and a clock; nothing in either wants one to go silent for four seconds and
  come back. Chapter 3's opening film is built on the moment the ceremony
  drum stops.
- A scene cannot call `loopVol()` to do it: the ambient frame re-asserts
  every bed's declared volume on every frame, so the write is gone before it
  is heard. The fix is a multiplier that frame respects (`duckOf`), set by
  `api.duck(name, k)` and cleared at BOTH ends of every cutscene — on start
  so a scene never inherits the last one's duck, and on end so nothing can
  leak into play.
- Because it is a multiplier read inside the same track system, a scene can
  fade the room on the same `tr()` that moves the camera. That is the
  difference between sound that follows the picture and sound that is cued.

## curl and ffmpeg eat the loop's stdin

- `while read -r name url; do curl -o "$_$name" "$url"; done < list.txt`
  silently truncates the FIRST CHARACTER of every name after the first line.
  Not the URL — the name, and only from line two onwards.
- Both `curl` and `ffmpeg` read stdin when they are not told otherwise, and
  inside a `while read` loop stdin is the list file. One byte consumed
  shifts the next `read`, so `v3aunt2` arrives as `3aunt2` and the download
  lands under a filename nothing will ever look for.
- `< /dev/null` on every command inside the loop, or `ffmpeg -nostdin`. The
  bug is invisible unless you list the directory afterwards, which is the
  reason to always list the directory afterwards.

## Never trust the generator's output level

- Against a pack that sits at −20 to −25 dB mean, one run returned a fan at
  −42 and a clock at −45 (inaudible under any playback volume the game
  would use) and a door creak at −9 (twice as loud as anything else in the
  game). The same run, the same model, the same prompt shape.
- Measure every generated file with `volumedetect` against the existing
  pack and correct on the way in. It is one ffmpeg flag and it is the
  difference between a mix and a pile of sounds.

## The sky was chapter 1's sky too

- Nine leaks in, the sky still was not a chapter's to decide: one gradient
  dome, one fog, one hemisphere, one moon, one fill, all of them tuned for a
  void deck at midnight, and the game had exactly one time of day.
- Chapter 3 is a seventh-month ceremony in a car park, and those happen in
  the MORNING. Fixed the way the other nine were: a chapter declares
  `daylight`, `applyDaylight()` MUTATES the existing objects in place next to
  `applyGhostTerritory()`, and chapter 1's midnight is the default — so
  chapters 1 and 2 do not move a pixel.
- The repaint is a 64-pixel canvas redrawn and marked `needsUpdate`. Cheaper
  than a second texture and it keeps the dome's material identity, which
  matters for the same reason every other derived value is mutated rather
  than reassigned.
- Worth recording the design half as well: daylight made the chapter BETTER,
  not merely different. The other two chapters hide her in the dark because
  that is what dark is for. There is nowhere to hide at ten in the morning —
  she is just sitting there, in the sun, in front of forty people, and the
  horror has to survive being looked straight at.

## A master is not whatever file has the right name

- Re-encoding the pack from the surviving ElevenLabs originals, the levels
  were matched per file as `shipped peak − master peak`. Twenty of ninety-five
  came out wrong anyway. `fire` landed 9.8 dB quieter.
- The encoding was innocent. Several sounds had been REGENERATED during
  development, and the raw folder still held the earlier take. Peak-matching
  cannot notice: it happily rescales the wrong recording to the right peak,
  and every check that looks at level alone comes back green.
- Identify a master by **crest factor** — peak minus mean, which is
  gain-invariant — plus duration. That found the right take for 92 of 95.
  For the three with no match, transcode the shipped file instead: one extra
  generation, but the level is identical by construction.
- The general shape: when you are about to rescale one file to match another,
  first prove they are the same recording. Level tells you nothing about that.

## Whole-file RMS is a screening tool, never a verdict

- One sound of ninety-five, `doorcreak`, read 1.12 dB quieter after
  re-encoding, and 3 dB quieter over its first 0.4 s. Nothing else did.
- Two false leads. It was not a bitrate ceiling: 128, 160 and 192 kbps all
  measured identically. And the silent tail — 18 dB quieter in Opus, because
  Opus reproduces silence where mp3 puts quantisation noise — explains the
  whole-file number but not the first 0.4 s.
- Meanwhile every octave band from 31 Hz to 16 kHz matched within 0.2 dB.
  Bands matching while total energy does not is not a contradiction, it is a
  FINGERPRINT: the energy is below the lowest band you measured.
- It was **DC offset** — 0.1096 in the mp3, 0.0182 in the Opus. High-pass
  both at 20 Hz and the window measures −19.2 dB in each. DC is 0 Hz; it is
  inaudible by definition and it steals headroom. Nothing was lost, an
  artifact was removed.
- So: when whole-file RMS flags something, split by time AND by frequency
  band, and if the bands all agree, look below them before believing the
  total.

## The test browser decides which codecs exist

- AAC is ~24% smaller than mp3 at matched quality and is the obvious choice
  for an audience on iPhones. It is also undecodable in Playwright's
  Chromium, which ships without the proprietary codecs — the same fact that
  already forced a VP9 encode of the title video.
- A format the suite cannot decode is a format the suite cannot defend, and
  it fails identically on the Chromium builds some real players use.
- Opus is royalty-free, decodes everywhere the tests run, and was 35%
  smaller. Check what the harness can decode BEFORE choosing a format, not
  after encoding ninety-five files.

## Never guess a codec you can decode instead

- Opus is not safe everywhere: Safari's Ogg support is recent, and this
  audience is phone-first with plenty of older iPhones. Guessing wrong is
  not a slightly larger download, it is a game with no sound at all.
- So the game does not guess and does not consult `canPlayType`, which
  describes `<audio>` support rather than `decodeAudioData`. It DECODES a
  179-byte Opus file through an `OfflineAudioContext` and only takes the
  Opus packs if a real AudioBuffer came back.
- `OfflineAudioContext` is the detail that makes it usable: it needs no user
  gesture, so the answer is ready long before the first tap.

## A vocabulary table is not a usage list

- Splitting the sound pack per chapter meant deciding which sounds only one
  chapter can ask for. The obvious scan — "which sample names does main.js
  mention?" — returns all of them, because `STING_SAMPLE` maps every cue kind
  to its sample and lives in main.js.
- A row in that table proves the kind EXISTS. It says nothing about who plays
  it. Exclude the table's own span from the scan or the split silently
  collapses to "everything is shared" — and it collapses green, because
  coverage still checks out. The only symptom is that the download never
  shrinks.
- Same trap, smaller: `packWarm([...])` lists are decode HINTS, not
  ownership. They still name chapter 2's sounds by hand.

## The sound model reads its knobs, not your prose

- Four of six sfx generations came back at 0.5-2 s against prompts asking
  for 3.5, 5, 7 and 12 — with "12 seconds" written right there in the text.
  The durations in the prompt are decoration; `duration_seconds` is a real
  node parameter (0.5-30, default auto) and auto runs SHORT.
- So is `loop`. Set both with creative_update_node and re-run the node —
  the same update-and-rerun pattern v3.2 recorded — rather than
  regenerating from scratch, which loses the node and pays for a new one.
- The music model has the same shape of problem from the other side: told
  "no fade-out, seamless loop" twice, it faded the ceremony to -62 dB over
  its last two seconds anyway. Loop surgery in post (body + tail crossfaded
  into a copy of the head) is reliable; prompting for loopability is not.
- And VERIFY instrumentality instead of trusting the prompt: a scribe
  transcription of the whole bed costs cents, and an empty transcript is
  proof. The settings on the finished node said "Instrumental: False" —
  the transcript is how we know the prompt won anyway.

## A camera note: an empty chair is invisible at eye height

- The revision's intro finds one empty chair, turned the wrong way, in a
  full tent — and at eye height the shot showed nothing but the backs of
  heads. One unoccupied seat in a seated crowd simply does not read from
  inside the crowd.
- The camera now CRANES: half a metre up, over the back rows, pitched down
  0.26. From just above head height the gap in the crowd is instant.
- Same beat, opposite lesson, when the camera then finds HER out on the
  tarmac: at yaw PI (facing +z) the world's +x side is screen-LEFT, so
  centring a subject standing at +x means yaw PI PLUS the offset. The
  first attempt subtracted and pushed her further off-centre — the two yaw
  conventions LEARNINGS already carries strike again, one convention deep.

## The deploy uploads your WORKING DIRECTORY, not your intention

- The v4.3 deploy took the site down for seventeen minutes. The Netlify MCP
  uploader was run from the repo root — as its own instructions suggest —
  and it uploaded the repo VERBATIM: 459 files, `dist/index.html` as a page
  at /dist/, no index at the root, and the live site became Netlify's 404.
  It printed "Deploy is ready!" while doing it, and the deploy's state was
  "ready" — ready is about the upload, not about the site making sense.
- The tell in the deploy summary: "New pages include: dist/index.html,
  hellnote.html, shell.html..." — the publish root plainly is not dist —
  and "No header rules processed", when dist/_headers exists.
- The fix and the rule: **run the uploader from INSIDE `dist/`** so the
  thing uploaded IS the site — index.html at the root, assets/, _headers
  picked up (verified live: `cache-control: immutable` served). This is the
  drag-the-dist-folder-onto-the-Deploys-page ritual, spelled as a cwd.
- Recovery is the same command run correctly; Netlify keeps every previous
  deploy, so the Deploys page (open an older deploy → Publish deploy)
  remains the human rollback exactly as CLAUDE.md documents for Chad.
- And ALWAYS byte-verify after deploying — this is the second release in a
  row where the verification pass caught something (last time truncated
  fetches, this time the outage itself, within a minute of it starting).

## The explore music was chapter 1's music (the twelfth leak)

- Chapter 3's ceremony bed was inaudible in the shipped v4.3, and Chad said
  so within one play: "the creepy music should no longer be playing in this
  chapter... That music should be the focus."
- The engine plays the explore music bed — a dark ambient wash written for
  the void deck — in EVERY chapter, at a fixed MUSIC_VOL, with swells that
  peak ~10 dB above a mean-normalised ambience loop. Any chapter-owned
  music drowns under it by construction.
- Fixed like the eleven leaks before it: a chapter declares `musicVol`
  (default 1 — chapters 1/2 bit-identical), every write to musicGain goes
  through one function, and setChapter ramps between chapters. And the
  chapter's own music must be LEVELLED as music (mean ~-22), not as
  ambience (mean -27): the loop contract in the encode script is for room
  tones, and applying it to the thing that should lead the mix buries it.
- The wider lesson: state probes prove a scene RUNS — they cannot hear
  that a bed is buried, that two narration takes overlap, or that a line's
  words describe a beat that no longer exists. Levels can be computed
  (effective dB = file mean + 20·log10(gain)); overlaps can be computed
  (cue time + MEASURED take duration vs the next cue); line MEANING has to
  be re-read against the scene every time the scene changes. All three
  checks are cheap, and all three were skipped because the suite was green.

## The opening film played twice (and the second time was the real one)

- Chad, 31 Aug 2026: *"all the intro cinematic cutscenes before each new
  chapter, they will appear first, then suddenly there's a fade in, and it
  appears again."*
- `enterWorld()` does exactly the right thing: it puts the black overlay up
  (`opacity = '1'`) BEFORE placing the world and starting the film, with a
  comment saying "Black first, and hold it". Then `playCineFn()` — three
  hundred lines away, and correct for every OTHER caller — cleared it
  unconditionally: `cineFadeEl.style.opacity = '0'`, commented *"a scene owns
  the fade outright"*.
- So the film's first seconds (2.6 s in both chapters) played in full view;
  at 2.6 its own `fade(2.6, 5.2, 1, 0)` track set the overlay to its FROM
  value, snapping the screen to black; and then it faded up on the same shot
  a second time. Every chapter with an opening film had it, from the moment
  chapter 2 shipped.
- The fix is a parameter, not a special case: `playCineFn(fn, onDone,
  startFade = 0)`, and the intro path passes 1. Choice scenes and the faint
  keep the old behaviour by default.
- **The lesson is about ownership.** Two pieces of code both believed they
  owned the fade at t=0, and the one that ran last won — which is a race
  decided by call order, not by design. When a caller sets up state that a
  callee also initialises, the callee needs to be TOLD, not to guess.
- And why no harness caught it: every cutscene check asserted the fade at the
  END of a scene (`fadeAsScripted`), because that is what covers the snap
  back. Nothing had ever looked at the first frame. `cinetest` now does, on
  chapter 2's film — one more page in the harness that already owns
  cutscenes, rather than a new harness.

## A pose is safe or not in FRACTIONS OF FRAME, never in metres

- Chapter 3's prayer clasp put two pale wedges — the thumbs, splayed off the
  base of each hand — into the bottom of shot. Chapter 1 hit the same thing
  at v3.8 and fixed it by dropping the clasp 7 cm, which is the right fix and
  an unrepeatable one: the number is meaningless in another shot.
- Measure it instead. Project the actual BONES through `vmCam` and read them
  in pixels: the topmost thumb bone, the topmost fingertip bone, and the
  pixels-per-metre at the hands' depth (1720 px/m at 560 px tall). The flesh
  reaches about 40 px above the topmost thumb bone; the letterbox eats the
  bottom 11 vh. Everything after that is arithmetic.
- Express the answer as a FRACTION of frame height, and it holds on every
  device: `vmCam`'s 52° is a VERTICAL fov, so the visible band at a given
  depth does not change with the shape of the screen — a portrait phone gets
  more pixels, not more world.
- There are two walls, not one. Drop the clasp far enough to hide the thumbs
  and the trough of the hand-tremble takes the fingertips out of shot as
  well. The tremble's amplitude is part of the same budget as the height: ±5
  cm of shake needed cutting to ±2 before any height was safe at both ends.
- Do not manipulate the pose live to find the number: cutscene tracks are
  absolute and re-applied every frame even while paused, so anything nudged
  from the console is overwritten before the next screenshot. Edit the
  source, rebuild, re-measure.

## A rotation with no written sign gets guessed, and both guesses were wrong

- Chapter 2's door is hinged at one jamb and swings outward: 0 shut, −0.62
  ajar, more negative more open. Nothing said so. Both scenes that touch it
  opened it by ADDING to the ajar angle, which drives it toward shut — so the
  mother arrived by closing the door in your face, and leaving the room meant
  walking into the leaf.
- It survived a release because the LIGHTING was right: `hallLight` is a
  point light with no shadow, so the room floods warm through a closed door
  exactly as it does through an open one. The screenshot looked correct.
- Two rules out of it. Write the sign convention down AT the object, as a
  table of the angles that mean something. And give the meaningful angles
  names (`DOOR_AJAR`, `DOOR_OPEN`) so scenes interpolate between them instead
  of doing arithmetic on one of them — arithmetic on an angle is where the
  sign gets guessed.
- A camera standing near a swinging door has a second constraint nobody
  writes down either: it must be further from the HINGE than the leaf is
  long, or the door closes through the lens. Chapter 2's leaf is 0.86 m; the
  spot scene C stands on is 1.24 m from the hinge, and that is on purpose.

## An angle nobody derives is an angle somebody guessed

- Chapter 2's opening film turned to face the door with `yawTo(..., 0.92)`
  and to face the gap with `yawTo(..., -1.42)`. Measured against the
  positions of those two things, the door was **160° behind the camera** at
  the beat named after it, and the ghost faded in **144° off screen** at the
  film's climax. It shipped that way at v4.0 and survived five releases.
- Both were replaced by `faceFrom(...)` — the helper the four choice scenes
  in the same file already use, which takes a position and a target and
  returns the yaw that looks at it. After: 0.6° and 1.1° off centre.
- Why nobody caught it: a first-person camera has no second pair of eyes. A
  screenshot of a dark bedroom looks like a dark bedroom whichever way it
  points, and every automated check asked whether the scene RAN.
- The cheap check is arithmetic, not eyes: at each beat, print the angle
  between the camera's yaw and the direction of the thing the beat is about.
  Anything over about 40° is a mistake or a deliberate reveal, and the code
  should say which. The same probe answers "is she actually on screen"
  (`ghostInView`) — with the caveat that it projects her HEAD, so a shot
  looking down into a gap correctly reports false.
- Rule of thumb for this repo: hand-written camera angles are for OFFSETS
  (a few degrees off something derived). Anything that means "look at that
  thing" gets derived from that thing's position, every time.

## A bought rig's bind pose is a lie twice over (the mother, v4.7)

- The rigged woman crumpled, floated 0.8 m up, or lost her head depending
  on the moment — and every wrong theory (broken simplify, stacked outfit
  variants, a mixer that was not running) was believable from screenshots.
  What settled it was NUMBERS: sample a head bone, a foot bone and the hips
  in WORLD space at several scene times. Feet at 0.9 = floating; identical
  broken pose at different mixer times = not animating; head 2.18 with grp
  y 0 = the offset is inside the model. Three numbers beat forty
  screenshots.
- The file's three meshes are PARTS — body, dress, hair — sharing one
  skeleton, not variants. Toggle each visible ALONE before concluding
  anything: "the dress by itself is crumpled floating fabric" is obvious in
  one frame and explains an evening of confusion.
- The idle clip's first ~1.5 s is a LEAD-IN out of the bind pose with the
  ROOT at a different offset. Played whole and looped, she drops and snaps
  every cycle. `THREE.AnimationUtils.subclip` past the lead-in; the clip's
  own numbers (250 keys / 8.33 s = 30 fps) tell you where to cut.
- Ground and size from the POSED skeleton's bones (mixer.update once,
  updateMatrixWorld, lowest Toe/Foot bone to the floor, HeadTop_End to her
  height). The bind box stands 0.8 m below where the same file's idle
  stands. The arms rig taught this at v3.8; it is now a CLAUDE.md rule.
- And from the shrink pipeline: stripping an emissive TEXTURE while leaving
  `emissiveFactor` at [1,1,1] turns the whole material into a white glow —
  zero the factor when you drop the map. An unindexed scan (30k verts for
  10k tris) will not weld and so will not simplify: drop NORMAL, weld,
  simplify, regrow normals.

## 'Attached' bind mode makes moving a skinned mesh do NOTHING (v4.8)

The v4.8 audience: one skeleton animates offstage, thirty seat meshes
share it. First attempt gave every clone its own transform — and all
thirty rendered STACKED AT THE ORIGIN as one giant, because in three.js's
default `bindMode: 'attached'` the renderer rewrites `bindMatrixInverse`
from the mesh's own `matrixWorld` on every update. The node transform
cancels itself out by construction; that IS the mechanism behind the
folklore that "moving a skinned mesh does nothing". The fix is
`bindMode: 'detached'` with identity bind matrices: the clone then renders
`group · (pose in world)`, the live idle wherever the group is, one draw
call per person and no skeleton of his own. Diagnose this class of bug by
computing a skinned vertex CPU-side (`applyBoneTransform` + matrixWorld)
for two clones: identical world results from different node transforms
names the cancellation exactly.

## Transcribe your shipped stems — a wrong TAKE hides for versions (v4.8)

Chad asked why the mother option triggers "don't look back". Nothing cues
such a line — until `vrelief.mp3`, documented since v2.3 as "a quiet
shaken exhale", was TRANSCRIBED and turned out to say "Just keep walking.
Don't look back." The wrong take was picked at generation time and no
harness can hear; it shipped in four releases and three scenes where
relief was meant. When a sound is voice, transcribe the file you ship
once and compare it against the design sheet — the tooling exists and it
is one call per stem. Related: eleven_v3 FAILS a tags-only prompt every
time (six consecutive failures, not the usual one-in-three) — a wordless
breath line still needs voiceable text ("Hoohh... hahh") for the tags to
shape.

## A bought model can be broken by an extension three.js dropped (v5.17)

Chad's study table arrived flat white — every material, no colour, in the
viewer and in the game. Nothing was wrong with the file: its fourteen
materials are `KHR_materials_pbrSpecularGlossiness`, and three.js REMOVED
that extension from GLTFLoader. The loader does not warn, does not throw
and does not fall back to the diffuse factor; it ignores the extension and
renders the default white material. `metalRough()` from gltf-transform
converts the spec-gloss factors into metallic-roughness offline and the
model comes back with its wood, its lamp and its bottle.

The general rule this belongs to: **when a bought model looks wrong in a
way that is uniform — everything white, everything black, everything
untextured — read its extension list before touching its materials.**
`listExtensionsUsed()` is one line, and the answer is usually there.
Extensions this repo has now met: `KHR_materials_pbrSpecularGlossiness`
(dead, convert it), `KHR_mesh_quantization` (free, use it), `KHR_draco_*`
(forbidden — blob: worker), `EXT_meshopt_compression` (only in the one
loader that carries the decoder).

And its neighbour, from the same five models: **a curtain that weighs five
megabytes for 1,953 triangles is not a texture problem.** It was 200 morph
targets with a 200x200 weight matrix — a baked vertex animation, one
target per frame. Check `listTargets().length` on any file whose size and
triangle count disagree by two orders of magnitude.

## A per-frame vertex ripple and a quantized mesh cannot both be had (v5.17)

Chapter 2's curtain had always breathed by writing new z values into its
geometry every frame. The model that replaced it ships quantized, so its
POSITION is normalised Int16 and a float written into that array means
nothing. There are only three ways out, and the cheapest is usually right:
ship it unquantized (bigger), dequantize on load (slower, and undoes the
saving), or MOVE THE OBJECT INSTEAD OF ITS VERTICES. The curtain now hangs
from a rail point — a group whose origin is the rod — and swings from it,
which is closer to how cloth actually moves than a ripple ever was.

## Quantization is the one model compression this game gets free (v5.16)

A 10 MB character came down to 1423 KB by the standing recipe (drop every
map `rescueTextures` cannot restore, weld, simplify, 512 JPEG sheets) and
then to **910 KB** by one more transform: `quantize()`, i.e.
`KHR_mesh_quantization`. It is worth knowing why that one is available when
the smaller one is not:

- **KHR_mesh_quantization is decoded inside three.js's own GLTFLoader.** No
  worker, no WebAssembly, no `blob:` — so it passes the strict CSP the
  hand-parsed loaders were built for, and every chapter loader gets it for
  nothing.
- **EXT_meshopt_compression needs a decoder** the chapter loaders do not
  carry: only `zavLoader()` sets one (v5.10). A model packed with meshopt
  and loaded through `loadGLB()` fails to parse.
- Draco is worse still: its decoder is a worker built from a `blob:` URL,
  which the policy forbids outright (v5.10 measured this).

Two things to check every time, because both fail silently:

1. **For a SKINNED mesh the dequantization scale must land on the skin's
   INVERSE BIND MATRICES, not on the mesh node.** gltf-transform does this
   correctly (the node stays at identity, IBM[0] picks up the scale), and
   it matters because three.js drives a SkinnedMesh from its skeleton —
   a scale parked on the node would be ignored and the man would render at
   1/87th size with no error anywhere.
2. **Render it before and after at the size it ships at.** Here the same
   in-game shot differed only by the phase of his idle. That is the v5.11
   lesson in its cheapest form: a model check is a render, at the real
   size, not a reading of the file.

## An axis argument is settled by vertices, not by screenshots (v4.8)

The chair's facing flip-flopped twice by eyeballing renders before it was
settled in one minute of arithmetic: mean z of the backrest vertices
(upper band) vs mean z of the seat-pan vertices, in file space. Backrest
at -z means the file faces +z, so the game (chairs face -z at rotation 0)
needs a pi flip — no screenshot can argue with that. Same lesson as "an
angle nobody derives is an angle somebody guessed", one notch deeper:
when the question is which way a MODEL points, compute it from the
geometry. And when a bake is re-centred, centre it on the functional
point (the seat pan — where a sitter goes), not the bounding box, so the
instance point keeps its meaning whichever way the shell leans.

## Place the player BEFORE the card, or the dissolve shows the old vantage

Resuming into chapter 2 flashed "chapter 1" for a split second: the
non-intro path ran `place()` inside the chapter card's completion
callback, so the card's dissolve raced the placement and could reveal a
frame from the previous camera vantage in the new world. The film path
never had the bug — it places before fading in, which was the invariant
all along: THE WORLD IS NEVER SHOWN UNTIL THE PLAYER IS WHERE THE SAVE
SAYS. Now both paths place first. The related trap: `window.__enc.chapter`
was a captured binding (`chapter: CH`), stale after every setChapter —
a probe that trusts it reports the WRONG chapter while the world is
right; exports of rebindable state must be getters.

## The screenshot is the proof a fix landed, not the edit log (v4.9)

Three ch4 fixes were "applied" through a home-made edit helper driven the
wrong way — the helper is a LIBRARY (`from edit import rep`), and feeding
it a text DSL on stdin does nothing, prints nothing, and exits 0. The
"fixed" build then reproduced the exact bug, and an hour went to
re-deriving what was never applied. Two rules out of it: a batch editor
must print one `ok:` line per hunk (silence is failure, not success), and
after any "fix applied" the artifact itself — the grep of the source, the
re-shot frame — is what says so, never the intent to have applied it.

## Off-world film sets need their own darkness, not fog (v4.9)

Chapter 4's three flashback dioramas sit forty metres out at x=-40, on the
theory that fog hides them from the flat. It does not: at the chapter's
livable density (0.010) an exp2 fog passes ~84% at 42 m, so every set read
from the window as a tiny floating box against the dusk — and the skydome
behind them is BACKGROUND, which fog never touches at all, so the film's
own frames had a purple horizon and the neighbouring memory floating in
shot. The fix is theatre, not atmospherics: `memRoot.visible` only inside
the scene that owns the sets, plus one matte-black BackSide sphere AROUND
EACH set (bubbles per set, or they see each other), `fog: false`. A
memory then floats in its own black box whatever the sky is doing.

## Her territory is a radius; the spawn must stand outside it (v4.9)

`ghost.appearAt` is the RADIUS of her ground around the chapter's anchor,
and `hidden -> beginAppearance()` fires the moment the player is inside
it. A spawn placed within the radius means "Ghost spotted!" on frame one —
softening the number UPWARD (2.6 -> 3.0, meant as "rarer") swallowed the
spawn (2.75 m from ch4's chair) and made it certain. In chapters 1-3 the
spawn always stood outside and walking in was the player's own act; keep
that law: appearAt strictly less than the spawn's distance to the anchor.

## A doorway's wall thickness needs floor, or the sky shines through it (v4.9)

Every opening cut through a 15 cm wall leaves a 15 cm strip of ground that
belongs to neither room's floor plane. From eye height it renders as a
thin line of SKYDOME — magenta at dusk — along the threshold. Overlap one
side's floor a couple of dm through the opening (and enclose a stub room
flush to the wall it hangs off: a side wall centred where its neighbour
was, instead of at the opening, leaves a slot of open sky). Both leaks
are invisible in a plan view and obvious in one probe frame at the door.

## faceFrom() aims CAMERAS; a model facing needs + Math.PI (v5.0)

`faceFrom(x, z, tx, tz)` returns the yaw that points a -z-forward object
(a three.js CAMERA) at the target. The character models (the praying man,
the mother) are +z-forward, so `model.rotation.y = faceFrom(...)` faces
them 180° AWAY from the target. Chapter 5 was built with bare faceFrom on
every cast facing and the probes caught it everywhere at once: the tang-ki
delivered his altar rite INTO the camera, "faced the kitchen" with his
back to it, and the film's insert framed his face only because two errors
cancelled. The law: `yawTo(faceFrom(...))` for the camera, bare;
`rotation.y = faceFrom(...) + Math.PI` for a model. Hand-authored yaw
constants think in (sin ry, cos ry) = visual front. Chapters 2 and 4
survived on eyeballed constants, which is why the convention was never
written down until a chapter used faceFrom for its cast throughout.

## A cast member's stand must clear the furniture footprints (v5.0)

Ch5's tang-ki stood at (0.9,-0.4) — INSIDE the dining table's 1.5 x 0.9
top centred at (1.3,-0.6). His robe hid the clipping and, worse, hid THE
NOTE from every scene camera aimed at it. Walk targets have the same
trap: three of the chapter's glide paths ran straight lines THROUGH the
tabletop and needed two-leg routes. Check every stand and every straight
glide against the footprints before probing; the probe only shows the
symptom (a subject that never appears in frame), not the cause.

## Under a bright hemi, plane displacement foreshortens away (v5.0)

Two morning-light lessons from the same pass. A pale flat plane
(curtains) under a full daylight hemisphere reads as a glowing white
BOARD — deepen the material, don't fight the light. And a curtain-billow
that displaces vertices along local z displaces along the CAMERA AXIS
for any camera facing the window: foreshortening ate a 12 cm billow
whole. The amplitude that reads from three metres is a quarter metre.

## A bone lookup that finds nothing is the quietest bug in the repo (v5.01)

Shipped broken from v4.8 to v5.0 in THREE chapters at once, unnoticed by
22 harnesses and two playthroughs: `/Head$/` matching a Mixamo skeleton.
glTF sanitizes node names, so `mixamorig:Head_06` in the file is
`mixamorigHead_06` in the scene — the anchor never matches, the variable
stays null, and every `if (bone)` guard downstream simply skips. No
error, no warning, no crash: ch2's mother "talked" without moving, and
ch3's and ch5's tang-ki never bowed. The dot-stripping trap (v3.8, the
arms rig) was already written down; what was missed is that Mixamo also
appends `_NN`, so a name can fail an anchored match at BOTH ends.

Three things follow. The regex now lives ONCE, on CHCTX as `HEAD_RE`
(`/Head(_\d+)?$/`), beside FINGER_RE's precedent — a fact about how models
arrive belongs to the engine, not copied into each chapter. A guard that
silently skips is not a safe guard when the thing it guards is the whole
feature; prefer proving the handle resolved. And the only proof that a
bone hookup works is MEASURING THE BONE: set the driver, read
`rotation.x`, confirm the delta (0.2024 -> 0.7042 for a 0.5 bow, released
back to 0.2058). A screenshot of a man standing still looks identical
whether the code ran or not.

## collide() samples ONE point, at y = 1.0 (v5.03)

Furniture in ch4 and ch5 was walk-through, and the reason is arithmetic, not
a missing entry: every piece was already in `blockers()`. `collide(nx, nz)`
tests `containsPoint(nx, 1.0, nz)` — a single height. A tabletop sits at
0.75 and is thin, so even with the walls' 0.20 padding its box topped out at
**0.98, two centimetres under the probe**. The sofa reached 0.62, the chair
seats 0.68. All present, all missed.

Two rules follow. A blocker for anything you walk into is a COLUMN — floor
to above the probe — not the object's own bounds; ch5/ch4 now have a
`solid()` helper beside `box()` that says so. And a chair's blocker is the
whole chair, not `children[0]`: boxing the seat slab alone was the same
mistake twice, since the slab is exactly the part at the wrong height.

Padding is not one number either: walls use 0.20, furniture 0.14. You brush
past a chair; you never brush past a wall.

## Cutscene paths obey nothing — audit them against the boxes (v5.03)

Collision applies to the PLAYER. A cast member moved by `tr()` has its
position written directly, so a scene can walk somebody through a table and
nothing anywhere complains. ch5 scene D did, for seven seconds, 0.34 m deep.

The audit is cheap and worth keeping: seek each cutscene in 0.25 s steps and
test every cast position against the furniture boxes (`dbg-paths.mjs`, the
`solid()` boxes identify themselves by `max.y === 1.40`). Doing that found
the one bad path out of five and, once the first fix moved him into a chair
instead, proved the dining set has no clean lane at all — four chairs ring
it. The fix was to stop routing and move the NOTE to his end of the table:
when every path through a space is blocked, move the destination.

## A prop's Y offset must clear the surface's own THICKNESS (v5.03)

The ch5 hell note sat at `TABLE.top + 0.004` and was invisible from the
first day the chapter shipped — because `TABLE.top` is the slab's CENTRE and
the slab is 45 mm thick. Its surface is at `top + 0.0225`, so the note lay
19 mm inside the wood. The chapter's own prompt says "the note lies on the
table between you"; it lay in it. The cups (+0.048) and the teapot (+0.085)
were only safe by being taller objects.

It survived a full release because nothing catches it: no error, no test,
and a screenshot of a table with no note on it looks exactly like a table.
Offset a surface prop from the SURFACE (centre + half-thickness), never from
the centre line, and when a prop is the point of a scene, confirm it renders
by finding it in a frame rather than by trusting the arithmetic.

## A look-at that ADDS to the clip's own head pitch stacks, it does not aim (v5.04)

Two compounding errors put the ch2 mother's chin at the player's eyes.
First, aim origin: a Mixamo head BONE sits at the base of the skull, ~11 cm
under the eyes, so pointing it at a 1.62 m camera asks for far more lift
than a look needs — her bone measured 1.385, a 0.235 m rise. Second and
worse, the clips carry their OWN head pitch (measured -0.16 rad of chin-up
in the talking take), and `rotation.x -= offset` piles onto that instead of
replacing it. Total came to -0.247.

So: aim from an eye point above the bone, and drive PITCH to an absolute
target — `rot.x += (target - rot.x) * blend` — rather than adding to
whatever the clip left there. Yaw can stay additive because the clips barely
turn the head (0.07 at rest); pitch cannot, because they always tilt it.
A little downward bias is worth having: a face angled a few degrees down
reads as attention, angled up reads as disdain.

## A clip only reads for as long as no other clip is playing (v5.04)

"Why is she not using the talking animation?" — she was, for 0.7 seconds of
a five-second line. ch2's scene B started her backing out at 11.6, one
second in, and the walk clip owns the body from that moment.

The staging was written at v4.6 when the walk was a fake group glide and
there were no clips at all, so nothing was lost by overlapping them. Adding
real animation silently invalidated that timing. When a character gains
clips, RE-READ every scene they appear in: a beat that overlapped two
actions was free before and is a swallowed performance now. Expose the
current clip name on the stage (`mumClip` / `maClip`) — "which clip is
actually playing" should be answerable by measurement, not inference from
a screenshot.

## Match the measure the neighbours used, not the correct one (v5.05)

Two new characters were dropped into chapter 3's audience and stood a
visible head taller than everyone around them, despite following the
standing law — size and ground from POSED bones — exactly.

The reason is that the encik crowd normalises to a crown it finds with a
loose `/Head/i`, which on a Mixamo skeleton also matches `HeadTop_End`, i.e.
the top of the skull. The new loader used `HEAD_RE` (`/Head(_\d+)?$/`),
which is the *correct* regex for finding the head JOINT and is what v5.01
was written to fix — and so normalised to the base of the skull instead.
Same law, different crown, ~9% taller. Measured: crowns at 1.577 and 1.572
against a crowd at ~1.30; using the crowd's own measure, 1.348 and 1.316.

The lesson is not "use the loose regex". It is that a thing placed AMONG
existing things has to be measured the way those things were measured, even
where that measure is the worse one — consistency inside a frame beats
correctness against an absolute. Fixing the crowd's regex would have been
the other valid answer; it would also have resized nineteen people to fix
two, which is the larger change and the riskier one.

## A texture that cannot survive the CSP is pure download (v5.05)

Two 47–54 MB character FBXs shrank to under a megabyte each, and most of
that came from DELETING maps rather than compressing them. Each carried a
4096² normal map at ~20 MB and a packed AO/metal/rough sheet — and the
engine's `rescueTextures()` only ever restores the BASE COLOR map, because
that is the only one it walks the glTF JSON for. Every other map renders
white in production regardless of how carefully it was encoded.

So when budgeting a bought model: check what the loader can actually put on
screen before deciding what to keep. Resizing a map the policy will drop is
work spent making a smaller invisible thing. (Rule of thumb for the rest:
diffuse to 512 JPEG; anything with a cutout alpha — hair, eyelashes,
foliage — must stay PNG or WebP and can usually go to 256.)

## A rigged model with no clips is a pose, and a take is chosen by its amplitude (v5.06)

Chad's tang-ki replacement was a clean Mixamo-rigged character that shipped
zero animations — and the model it replaced had been chosen for its clip.
Dropped in as-is he stood with his arms held out, which no amount of model
quality fixes. So "replace the model" had to mean "replace the model and
supply its movement", and the v5.02 bake did that in minutes once pointed
at his rig.

The second lesson is which take. Both chapters show the same man, and the
obvious move — idle everywhere — made chapter 3's medium a man breathing at
an altar. Measure the clips before choosing: the idle swings 11° off its
first frame, the talk 99°. A drum-driven trance needs the 99° take; a man
listening across a table needs the 11° one at full rate, not half. The
number decides, not the clip's name.

## A clip's end pose is forced, never waited for (v5.07)

The first probe of the catwalk turn "played the take through" by waiting
4.2 s and measuring — and reported that a 180° turn had turned him 6°. It
had not. The engine clamps dt to 0.05 s per frame (`main.js`, and rightly:
a stalled frame advances, never leaps), and on this GPU-less box a frame
takes about a second, so four seconds of wall clock is a fifth of a second
of clip. Nothing about the take was wrong.

Measure a take by SETTING its time: `action.time = clip.duration * k;
action.paused = true; mixer.update(0)`. That is what `dbg-hand*.mjs` do,
and it is why `stage.tangActs` is exposed read-only. The same clamp is why
a hard-cut `tangPlay`/`medPlay` must call `mixer.update(0.0001)` itself:
at `drumBeat` 0 the mixer's rate is zero and a new action never shows.

## A take parked on one frame is a pose library (v5.07)

"Put the note in his actual hand" needed a hand held up in front of his
face, and there is no take for that. There is a two-handed spell whose
frame at 20% has the right hand 0.45 m forward at 1.44 m — sampled across
the take at ten fractions, not eyeballed — which is exactly where the
floating note used to hang. Freeze the take there (`tangPlay(..., at)`),
parent the note to the hand bone, and the insert is a held note. Before
reaching for another download, sample the takes already in the file.

And when the shot does not change no matter what you do to the object,
you are not looking at the object. Three edits to the note's orientation
produced pixel-identical frames (mean difference 2.8/255) before the card
in his hand was recognised as the robe's cuff with the note inside it.
Compare the render against the asset's own art; a plane whose edits do
nothing is hidden, not wrong.

## A cutscene track HOLDS after it ends (v5.07)

`tr(t0, t1, fn)` is re-applied at k = 1 on every frame after t1 — the
engine's track loop skips a track only before its start, never after its
end, and later-pushed tracks win. That is what makes a glide's end pose
stick, and it is load-bearing. It also means a track that writes a
property a later `step` also writes will WIN over that step, forever: the
turn helper's yaw track pinned him at ry1 + PI after every turn, and he
walked to the altar facing backwards. Measured (ry 7.21 where 4.07 was
staged), not seen — from the altar camera his back reads as a robe.

Two ways out, and the chapter uses the second: write such properties only
from `step`s, or make the track one-shot (`yawTr` in ch5: it goes inert
after delivering k = 1 once). Every position glide in every chapter is safe
because nothing else ever writes those positions until the next glide's
own track takes over — the hold is exactly the behaviour those want.

## aspect-ratio in a flex column is not a definite height (v5.08)

The worn slots moved from absolute positions to two flex columns and came
out 150 px tall. Nothing set a height; `aspect-ratio: 1` on a 56 px-wide
box should have. But in a flex column the ratio-derived height is not
DEFINITE for percentage resolution, so the icon's `height: 52%` fell back
to an inline SVG's intrinsic 150 px, and a flex item's `min-height: auto`
grew the box to hold its content. The absolute boxes never showed this
because an absolutely positioned box's ratio height IS definite.

Give such a box an explicit height. Aspect ratio is a layout hint, not a
promise anything inside it can measure against.

## A tier's board is where its own cups are (v5.08)

The bedroom shrine's candle and oranges floated under the shelf, at the
tips of its carved brackets — because "the bottom of the tier" was read as
the bottom of its bounding box, and a wall shelf's box starts at the
bracket tips, 0.42 m below the board things actually stand on. The model
itself said where the board was: its cups sit on it. Read a surface off
the things the model already puts there, not off the box.

## Remove the texture before blaming the mesh (v5.09)

Master Zav's "crack lines" looked like a simplifier's torn UV seams, which
is what a locked-border re-simplification would fix — and it changed
nothing, because the 990k-triangle original had the same lines. One render
with the texture swapped for plain grey settled it in a minute: no lines.
They were painted into the scan's atlas, a lighter rim baked around every
island. Order of diagnosis for any "line on a model": untextured render
first (is it shading?), then the atlas at the seam (is it paint?), and only
then the mesh. The cheapest test is the one that removes a whole class of
causes.

## A UV seam is not always a seam (v5.09)

The mesh knows which UV edge is which other UV edge (same two 3D points),
so feathering colour across every pair is easy to write and wrong to ship:
a UV island border is very often also a CONTENT border — hairline, eyelid,
lip — and averaging black hair with skin draws a grey band where there was
a clean edge. The feather is right only where the two sides differ by an
exposure-sized step. Likewise a blanket erosion of island rims eats the
thin islands (an eye strip, a wisp of hair) whole, and what refills them
comes from whatever lies nearest in the atlas. Strip only the pixels that
are actually lighter than the island's own interior; the halo is a
property of a pixel, not of a distance.

## The width of a canvas is what puts air beside a figure (v5.09)

The boxes sat far from Master Zav and the instinct was to move the boxes.
The lens was fixed at 30° vertical, so the canvas HEIGHT decided what was
seen top to bottom (1.93 m at the figure) and the width simply followed
the aspect: a wide cell showed a 0.6 m man with half a metre of nothing
either side, and the boxes could not be nearer than that nothing. Narrow
the cell (176 px) and the same camera shows a shoulder's width of air. When
a thing in a viewport looks small and far from its neighbours, check what
the viewport's shape is asking the camera to show before touching layout.

## Draco cannot run under the strict CSP; meshopt can (v5.10)

A Draco-compressed upload looks like free download savings until it meets
the single-file build's policy: three.js decodes Draco in a Web Worker
built from a blob: URL, and blob: is exactly what the strict CSP forbids.
meshopt (`EXT_meshopt_compression` + `KHR_mesh_quantization`) decodes in a
plain WebAssembly module inlined in three's bundle, which `'unsafe-eval'`
permits — measured on the strict build, not assumed. And the numbers
matter: the same 990k-triangle man is 22.6 MB raw, 7.3 MB meshopt; a 150k
cut with quantization costs the SAME 1.4 MB as the 40k-triangle float32
file it replaced. Quantize before you simplify — most of a plain GLB's
bytes are 32-bit floats no screen can tell from 16-bit integers.

## Where "the original looks better" actually comes from (v5.10)

Chad preferred the untouched upload to the 40k cut, and he was right, but
not for the reason either of us first named: the seams are identical in
both (they are in the texture), and what his eye caught was the SHAPE —
a scan's hair has a sculpted look at a million triangles and a blobby
one at forty thousand, and a face at forty thousand shows its facets in
any close-up. Render the candidates at the scale the person judged on,
side by side, with the file sizes on each. That turned a "use the
original" into a "the 30 % cut is the original at a third of the cost",
which is a choice he could make instead of a guess he had to.

## Do not retouch a scan's paint by rule; pad its gaps and stop (v5.10)

Three passes over Master Zav's atlas, each reasoned from a measured cause,
each producing a NEW mark the owner could see at a glance: the halo strip's
refill drew a black streak beside the eyebrow (the nearest covered pixel
was the brow), its repaint drew a brown "birth mark" (the interior mean
included the brow), the seam feather drew grey bands (a UV seam is often a
content edge). A rule applied to a face has no idea what a face is. The
only pass that survived is the one that cannot touch a painted pixel:
padding the empty fill between islands, which removes seam bleed and can
change nothing else. When a texture fix keeps producing artefacts, the
honest deliverable is the untouched paint plus the one safe pass, and the
hand-retouch belongs in a paint tool with a person looking at it.

## Judge a texture at the size the player sees it (v5.11)

Three releases of seam work were judged on 900 px close-ups of the head,
and every one of them magnified the texture. The panel on a phone
minifies it — the head is eighty device pixels — and a minified texture
is read from its mipmaps, where each texel is the average of a block of
the original. A scan's atlas with no gutters between patches averages
black hair with the cream robe beside it, and no amount of work on the
full-size paint can change what a shrunken copy contains. Chad's "it may
look fine in your preview but not in the game on my phone" was the exact
diagnosis. Render at the real canvas size with the real lighting FIRST;
the close-up is for finding where, not whether.

## A flood fill over coverage is not a UV chart (v5.11)

Labelling the atlas's patches by flood-filling the covered texels gave
190 "islands" for hundreds of patches and called the hair light: patches
that touch merge. The chart a texel belongs to is a property of the
MESH — triangles joined through shared UV vertices — and only that
labelling keeps a hair patch separate from the robe patch it abuts.

## A cue fired before its decode is silent, and every new entry path re-asks the question (v5.13)

Cutscene sounds are sample-only on purpose, and the sealed-card advance
never went silent because `startDecision()` warmed the next chapter's
whole cutscene set a minute ahead. Every NEW way into a chapter — the
selector, Continue into a chapter never entered — arrived seconds after
`setChapter()` started the pack fetch, and the film's first cues fired
into the gap: no voice, no clock, and no error anywhere. Two rules. The
thing that starts a film owns the wait for that film's sounds — pack,
decodes, models, in that order, each capped — and not the thing that
happens to have prefetched them on one path. And "does it make a sound"
must be measurable: the cue log (`__enc.stings()`) turned an ear-only bug
into a harness assertion in an afternoon; a screenshot never would have.

## A "wordless" take is not wordless, and a plan doc is not a transcript (v5.14)

Three takes generated as pure vocalisations — a gasp, a scoff, panting —
carried words nobody had written down: "Oh my God", "It's just paper",
"No, no, no, no, no". `vrelief` had done the same at v4.8 ("Just keep
walking. Don't look back"), and it was treated as a one-off. It is not:
eleven_v3 given a direction with no text finds words for it. And the docs
were wrong in smaller ways everywhere — `v3aunt4` says "today" (re-said
for the morning at v4.3, recorded as "tonight"), `v4ma2` is a sentence
longer than its beat sheet, `t5teachA`'s words were never written at all,
and eight lines (`v2near`, `v2gap`, `v2A`–`v2D`, `v4voice`, `v4near`)
existed only as sound. The fix was to transcribe every take in the game
(joined with two-second gaps, one Scribe call per batch — plain text, no
timestamps, but each line is a sentence and the order is known) and to
keep the words IN ONE FILE beside the take, with a harness that refuses a
take with no row. The registry says what is heard. When a take is
regenerated, listen to it — or transcribe it — before its text is trusted.

## Check the timing of a re-voice by arithmetic, not by ear (v5.15)

Re-voicing the main character changed the length of 81 of 86 takes, some by
half (v4voice 4.9 s -> 1.3 s, vnote 7.7 -> 3.9) and some the other way
(vD 6.7 -> 9.5, v4regret 5.6 -> 7.5). Listening to twenty-six scenes for
collisions is an afternoon and misses the quiet ones. `overlapscan.mjs`
does it in a second: every `sfx(at, kind)` whose kind maps to a voice
sample, plus its MEASURED length from the registry, against the next
voice cue (a 0.3 s comfort gap) and the scene's end (max t1 of its
tracks, exactly how `c.dur` is computed) — and it reports whether the
flag was already true at the previous version, so a pre-existing
trailing exhale is not mistaken for a regression. Two truths the scan
cannot see and a human must: a take that got SHORTER leaves air in a
shot written for the long one (usually fine), and an action keyed to a
line's END (ch5 scene C's curtain, 1.2 s after the tang-ki's last word)
moves with the line or lands on his syllable. Read the beat around every
line that grew. Related, and already written above under v4.8: eleven_v3
fails a tags-only prompt every time — the lesson was in this file and
`vrelief` still cost three failed runs before it was re-read. When a
generation fails twice with the text unchanged, grep LEARNINGS for the
sound's name before trying a third wording.

## A voice id comes from the call that made it, never from its name (v5.18)

Chad picked "River" by ear in a v5.15 candidate round. The workspace has
more than one voice whose name begins with River, and `creative_list_voices`
answers with a premade middle-aged one (`SAz9YHcvj6GT2YYXdXww`) that is not
what he heard. Regenerating 79 takes in the wrong voice would have looked
like success right up to the moment he pressed play. The id was recovered
by grepping the earlier session's own generation calls for the takes he
listened to — `v6KgbPaQh6lAmMpmmtcH`, River Faith. **A voice, a model, a
flow: resolve it from the call that produced the artefact, not from a name
lookup.** Names in a voice library are labels; ids are the thing.

## Pick a NARROW voice for a character with eighty lines (v5.18)

VALF was the right pick on the sample — an unmistakable child, which is
what chapter 1 needs. It was the wrong pick across 79 takes, because
eleven_v3 re-rolls a voice's character on every generation and VALF's
range is wide: the same voice id read as a small girl in one line and a
grown man in the next. Chad heard it immediately ("sometimes sounding
like a girl and sometimes adult"); no single take is wrong, so no single
take reveals it. **Judge a voice for a long cast on CONSISTENCY, not on
its best sample** — generate five lines of different emotion from the same
id and listen for drift before committing to a whole game's worth. River
Faith is a narrower voice and holds.

## The aggregate says nothing about the cue (v5.18)

The River re-voice ran 58 seconds SHORTER in total than VALF's, 67 takes
of 79 shorter. It is tempting to conclude nothing can collide and skip the
scan. Twelve takes got longer, and one of them — `vrelief`, the wordless
exhale, +1.05 s — was cued in two chapters at a time that only worked for
the short version, so it ran past the fade into the outcome card in ch1
scene C and past the end of ch2 scene B. **Run `overlapscan.mjs` over
every cue every time, whichever way the total moved.** A timeline is
checked per cue or not at all.

## An early return owns everything below it, forever (v5.19)

Chapter 3's `updateNotes` has carried `if (getState() === 'cine') return;`
since v4.3, and the guard is correct: a cutscene must own the ambient pose
writes or its staging is overwritten on the same frame. What went wrong is
that it kept being TRUE while what sat below it kept changing. The tang-ki's
mixer was added under it at v4.8, the encik audience's four at v4.8, the two
special sitters' at v5.05 — so a guard written to own the POSES silently
came to own the CLOCKS, and thirty-one animated people froze from the first
frame of every cutscene. Nothing errored; the scenes played; three chapters'
worth of harnesses stayed green, because no harness asks whether a bone
moved.

Two rules out of it. **When you add a per-frame line to a function that has
an early return, decide which side of it you are on and say so in the
code** — a mixer is not a pose write, and the two belong on opposite sides.
And **when you add a guard, list what is already below it**, because you
are not writing one condition, you are writing a condition on every line
that follows for as long as the file lives.

The generalizable test is the one that caught it: a screenshot cannot tell
a still pose from a stopped one, so measure a BONE'S WORLD POSITION at two
moments and compare. Before: one distinct hand position across a whole
scene. After: 18 of 22 samples.

## A tempo is not a playback rate (v5.19)

The same build's second bug, which the first was hiding. Chapter 3's
tang-ki mixer ran at `drumBeat` — the ceremony's tempo, which scenes drive
from 0 to 3.4 — so his idle stopped dead at every "everything stops" beat
and the magic take blurred through at 3.4x and stuck. It made sense at v4.8,
when he was a praying loop and prayer speed WAS ritual speed. It stopped
making sense at v5.07, when he got named takes a scene calls by name.
**A named take is a performance and plays at its own speed; only an idle
should follow the world's tempo, and never below a floor, because a thing
at rest still breathes.** Tying a mixer to a dramatic variable reads as
elegant and is a freeze waiting for the first scene that sets it to zero.

## Try the model's OWN clips before retargetting anything (v5.20)

Chapter 3's fearful woman tore when a Mixamo sitting take was retargeted
onto her Blender rig — an arm as a flat shard, the face smeared. I
diagnosed over-simplification, re-shrank her three times gentler, and she
tore identically. Chad asked the question that settled it: *"why not make
fearful woman stand at her seat using one of her animations rather than
make her sit."* She ships ELEVEN takes of her own; one of them is a
standing fearful idle that looks back over the shoulder. On her own clip
she is clean at the ORIGINAL aggressive 13k triangles.

So the simplification was never implicated, and the retarget was the whole
cause. **A bought character's own takes were authored against its own rest
pose and will beat anything retargeted onto it.** Retargeting is for a rig
with no clips at all. And the cheapest test of "is my pipeline breaking
this model" is to play the model's own animation through it, which costs
one render and rules out everything downstream of the file.

## A bought character's CLIP LIBRARY can outweigh its mesh (v5.20)

fearful_woman came out of the v5.05 shrink recipe at 3070 KB with textures
down to 74 KB and geometry to 258 KB. The other 2742 KB was eleven
animation clips — running, jumping, three walks — for a woman who stands
in a crowd and plays exactly one. Dropping them took her to 400 KB, a
bigger saving than every texture and every triangle put together.
`prepwoman.mjs` takes a keep-list. **Look at the animation budget before
the texture budget on any character that arrives with a take library.**

## A skeleton collapsed to a point renders as abstract art (v5.20)

yinn's 110 MB file draws as a splay of flat triangles, and the instinct is
to blame whatever touched it last. Measured instead: all 108 of her bones
report the same world position (y = 0.82, x = z = 0) and her mesh box is
0.93 x 0.39 x 1.53 — a body lying down and flattened. Her skeleton is
collapsed, so every vertex is dragged to one point by its skin weights.
**Two numbers separate "my pipeline broke it" from "it arrived broken":
the spread of the bone positions, and the mesh's own bounding box.** Both
take one traversal, and neither can be judged by looking at the render.

## The numbers passed and the picture was a tent of floating heads (v5.21)

Nineteen seats with a model, zero placeholders left visible, six of each
kind, kana's hand motionless in play — every measurement in the v5.21
probe passed. The render showed heads and hands with no bodies under them.
The shared-skeleton crowd loader cloned `poseMeshes[j]` as ONE mesh, which
the encik is and the other two kinds are not (seven each: body, head, hair,
eyes). No number I had thought to take counted meshes per seat. **Measure
first, then look, and do not skip the second because the first passed** —
a measurement only catches what you knew to measure. And when a loader
assumes "one skinned mesh", say so in a comment, because the next file
will have seven.

## A rig without a crown bone scales itself up (v5.21)

The crowd's loose `/Head/` measure works on a Mixamo rig because it also
catches `HeadTop_End`, the top of the skull. gracy_lee's ValveBiped has
only `Head1`, the JOINT at the base of the skull. So `hi - lo` came out a
skull short, the scale factor came out large, and she was seated a head
taller than everyone round her with her face filling the frame from a
metre away. **A rig with no crown bone is measured from its POSED SKIN** —
every vertex through the skeleton as it stands (`SkinnedMesh.getVertexPosition`).
That is not the bind-pose box the sizing law forbids; it is the pose,
measured. The tell was in the bone list all along: one `/Head/` hit, not two.

## An identity bind matrix is right for EVERY file — v5.21 said otherwise and put six men in the sky (v5.21, corrected v5.22)

What this entry said at v5.21 was wrong, and the wrong version shipped:
it claimed a clone of a skinned mesh is right only with `bindMatrix = M`
(the source mesh node's matrix), so v5.21 folded `M` in. The derivation,
done properly at v5.22: a skinned vertex renders as
`clone.matrixWorld · bindMatrixInverse · Σ wᵢ Bᵢ · bindMatrix · v`, and each
`Bᵢ` is a BONE's world matrix times its inverse bind. The bones' world
matrices already carry the whole node chain above them, so `Σ Bᵢ v` is the
pose in world space whatever the mesh node's transform is — which is the
very reason "moving a skinned mesh by its node does nothing". Identity for
both bind matrices is right for every file. On the encik's file the mesh
sits under a Sketchfab root scaled 0.018; folding it in gave
`inv(0.018) · Σ Bᵢ · (0.018 v)` — the rotations cancel and every bone
TRANSLATION is multiplied by 55. Six men rendered 22–58 m over the car park
(Chad: "a tangled mangled texture mess floating in the sky"). The v5.21
lesson — go back to the comment that said what the trick assumed — was
right and was misapplied: v4.8's comment said the file "rebinds with
identity", which is about the BIND, not the node chain. **Derive the
maths before believing a comment's hedge, and then measure what RENDERS.**

## A multi-skin rig is measured from its ROOT, never from a bone's parent (v5.22)

v5.21's crowd loader sized each kind by walking down from
`skeleton.bones[0].parent` of the first skinned mesh. On the encik's
one-skin file that is the rig root. On a Mixamo character split into
several skins, the first skin's first bone is `Spine2` and its parent is
the spine — no feet, no hips, `lo` a hand's height off the floor, and
every sitter scaled up to make the truncated span 1.30 m and then dropped
by the missing distance: a metre into the tarmac. Traverse the clone's
ROOT. A rig's skins are an export's bookkeeping, not its anatomy.

## Measure what renders, and when a thing is missing, find where it went (v5.22)

v5.21's verification measured the offstage POSE skeletons (correct) and
counted meshes per seat (correct) and photographed seats from two metres,
and passed a build in which the encik was in the sky and the sitters were
under the floor. The numbers measured the wrong thing: the pose is
correct on the skeleton and wrong on the clone that draws it. The probe
now pushes every rendered vertex through the clone's own matrices — the
picture the GPU makes — and boxes it against the chair; puts a ceiling on
every skinned part; and photographs the sky. And the first rule of a
missing thing: **it did not vanish, it is somewhere — measure where.**

## A dropped emissive MAP leaves the emissive FACTOR: a white lamp (v5.22)

`tools/prepwoman.mjs` strips every map but base colour. The granny's file
carried an emissive map (a copy of the base, the usual "looks unlit"
export trick) with an emissive factor of 1,1,1; strip the map and the
factor stays, and a factor with no map is full emission — she rendered as
a solid white silhouette. Set the factor to black whenever the map goes.
Same tool, second blind spot: its alpha test (a sheet with real
transparency is a hair card, so PNG at 256 px) fired on her single
2048 atlas, which carries transparent padding between islands, and made
her face a 256-colour PNG at 256 px. A flag now says "every sheet here is
a body sheet".

## A figure's forward is +z, and a primitive hides a yaw that is backwards (v5.22)

The auntie's yaw was `-PI/2 + 0.25` from v4.1 to v5.21 — facing -x, with
her paper table at +x. A cylinder-and-sphere figure has no face, so
twenty builds shipped her with her back to her own table and nobody could
see it; the first real face (v5.20's kana) stood the same way and it
showed, and the render caught it. When a face is placed, check its yaw
against the thing it should look at BY ARITHMETIC (`atan2(dx, dz)` for a
+z-forward figure), not by the comment beside it. kana at the burner got
the same treatment: her yaw is computed from the brazier's position, not
inherited from a primitive that looked past the drum.

## A probe that does not wait for silence measures the wrong thing (v5.27)

The dialogue-duck probe reported `ducks while he speaks: NO` on a build
where the duck was working exactly as designed. Its very first sample —
labelled "idle" — already read `bg: 0.4, speaking: 1`, which was the
answer: the chapter's own opening line was still playing, `say()` refuses
to talk over another line, so the probe's test line never started and it
spent the rest of the run watching a recovery it mistook for a failure.

Two rules come out of it, and they generalise past audio:

- **Wait for the quiet state before asking for the loud one.** The probe
  now blocks on `speaking === 0 && bg > 0.95` before it speaks.
- **Assert the stimulus actually happened.** It now checks the line took
  (`duck().speaking > 0`) instead of assuming a call to `say()` produced
  sound. A guard that silently declines is indistinguishable from a broken
  feature unless you look.

The trap is worse than a plain false negative: a FAIL taken at face value
sends a correct fix back to be "repaired", which is how a working build
gets broken by its own test.

## Byte-verifying a deploy will report one harmless mismatch (v5.27)

Deploying from inside `dist/` (which is the rule — see CLAUDE.md and the
v4.3 incident) makes the Netlify CLI write its own link file,
`dist/.netlify/state.json`, into the directory it is about to upload. The
next byte-verify then reports `identical: 53  mismatched: 1`, and the one
mismatch is that file: the live site answers its path with the 404 page,
because Netlify never published it.

It is cruft, not a failure — but "mismatched: 1" looks alarming at the end
of a release, so: check WHICH file before reacting, and `rm -rf
dist/.netlify` afterwards. It contains only the siteId, nothing secret.

## eleven_v3 SPEAKS a stage direction it does not recognise (v5.28)

Writing prose direction in brackets — `[a teenage boy alone on a dark
walkway at night, uneasy, talking himself into it]` — does not direct the
performance. The model reads it out, word for word, as part of the line.
Chad caught it by ear ("why is he saying the direction out loud?"); the
transcript confirmed the take contains the entire prompt.

The model guide says it plainly: **"There is no scene description. The
prompt is the text the voice will speak."** Only SHORT tags are recognised
(`[whispering]`, `[shouting]`, `[sighs]`, `[laughs softly]`). Everything
else in brackets is dialogue.

Direct a line with the three things that DO work:
- a short recognised tag at the front,
- CAPITALS for the stressed word ("the ONLY way home"),
- punctuation for pacing — ellipses for a long beat, em-dashes for a short
  one, commas for breath.

Two traps beyond the obvious one. The duration explodes (3.3 s -> 8.8 s
here), which silently wrecks every cutscene timeline the take is cued
into. And it CONTAMINATES measurement: the spoken direction added
intonation variety, so a "delivery variation" metric scored the broken
take HIGHER and nearly sold a bug as an improvement. When a take's
duration is far off its text, transcribe it before believing any number
computed from it.

## Punctuation directs a take; CAPITALS force a stress (v5.28)

Chad, on a re-voiced chapter 1 opening: *"the chp 1 opening sounds weird"*.
The cause was one word I had capitalised for emphasis — `and this is the
ONLY way home`. Capitals in an eleven_v3 prompt do work, which is the
problem: they put a hard stress on that word whether or not the sentence
wants one, and a boy walking home does not declaim "ONLY".

His follow-up was the actual fix: *"why dont you sometimes use like '...'
to get a more moody feeling"*. The model guide says exactly that —
ellipses make long thoughtful pauses, em-dashes short beats, commas
breath. **Punctuation gives the performance room; capitals dictate it.**
Reach for punctuation first and use capitals only where the writing is
already emphatic.

Same words, six punctuations, 3.16 s to 6.32 s of audio. So the style has
to be decided once and applied to every take in a pass, or the cutscene
timings stop being predictable.

## A tag must name a FEELING, not a volume (v5.28)

Chad, on a prompt sheet full of `[whispering]` and `[shouting]`:
**"whispering is not an emotion"**. He is right, and it explains more than
it looks like it does.

`[whispering]` tells the model how LOUD. It says nothing about how the boy
feels, so what comes back is a flat read performed quietly — which is
indistinguishable from the monotony the whole re-voice was trying to fix.
Two whispers can be terrified or tender and this tag cannot tell them
apart.

Name the emotion. Where the moment also needs a volume — a 3 a.m. line has
to be quiet whatever else is true — put both in one tag:

    [whispering]        ->  [terrified whisper]
    [shouting]          ->  [panicked shout] / [furious shout]
    [quietly]           ->  [hesitant] / [apprehensive] / [relieved]

Compound emotion tags are safe: the registry's own `[terrified whisper]`
and `[panicked breathing]` have shipped since v2.3, and a two-word
emotional tag is absorbed, not spoken (verified by duration —
`[humiliated, shaky]`, the least conventional tag in the sheet, added
nothing to the take). What gets spoken is PROSE, not length: a phrase is
a tag, a sentence is dialogue.

Where a line's delivery is already documented, use that: `src/voicelines.js`
carries a `note` field saying Whispered / Shouted / Shaky on several takes.
That is the take's real direction and belongs in the tag — but it supplies
the volume half only, and the feeling half still has to be authored.

## The transcript ECHOES the prompt — it is not proof of what was said (v5.28)

Chad: *"are you sure those tags with comma works?"* Checking properly
overturned my own evidence.

`creative_transcribe_audio` on a take generated from
`[humiliated, shaky] I should never have asked for help…` returns the
prompt **verbatim, brackets included** — for a take that provably does not
speak the tag. So the transcript reflects the source prompt, not purely the
audio, and CANNOT be used to decide whether a tag was spoken.

That matters retroactively: the earlier "eleven_v3 speaks a prose stage
direction" finding was reported here as confirmed by transcription. It was
confirmed by DURATION — 8.83 s against 3.32 s for the same words. The
conclusion stands; the stated proof did not.

Three things that ARE decisive, in order of strength:

1. **The envelope.** A spoken tag is an extra phrase before the line. Decode
   to PCM, take per-100 ms RMS, and print it: an unspoken tag leaves the
   phrase structure identical to an untagged control.
2. **A comparison that cannot go the other way.** `[terrified whisper]`
   produced 3.00 s; `[whispering]` produced 3.63 s on the same line. A
   LONGER tag giving a SHORTER take is impossible if tags are spoken.
3. **Duration against an untagged control** of the same words — but only as
   a rough signal. +0.64 s here was ambiguous on its own, because an
   emotional read is genuinely slower.

So: comma-separated compound emotion tags work. And when a measurement and a
transcript disagree, suspect the transcript.

## Peak-matching hides an actor swap's real level change (v5.28)

Peak-matching a new take to the file it replaces (the v4.8 rule) aligns the
loudest instant and says NOTHING about the average. Swap the actor and the two
can diverge badly: Aaron's 79 takes, peak-matched to River's, came out 3.7 dB
quieter in mean loudness with a 3.2 dB wider crest. The files look right and the
game sounds softer. **After any voice swap, measure mean loudness and crest
across the whole set against the set it replaces** — not just peaks, and not by
ear. `ffmpeg -af volumedetect` gives both; note that `-v error` SUPPRESSES its
output, so the measurement silently returns nothing (it needs `-hide_banner`
instead).

And a crest problem cannot be fixed at the file level: with the hottest take at
-2.3 dBFS the whole set had under 2 dB of headroom against a 3.7 dB gap. It is
a dynamics problem and wants a dynamics tool.

## Gain and clipping separate only with a limiter (v5.28)

Raising a compressor's input gain buys loudness and clipping together — measured
through the real Web Audio node, 2.5x put 3 of 18 takes over 0 dBFS and 3.0x put
8 over. Adding a LIMITER after the compressor (threshold -3, knee 0, ratio 20,
attack 1 ms, release 50 ms) is what separates them: 3.5x through compressor +
limiter is +1.31 dB louder than the previous voice with zero takes clipping.
Search the gain ladder to the last non-clipping rung; the one above it is not
"slightly hotter", it is broken.

## A spoken stage direction leaves a pause; that is how to detect one (v5.28)

eleven_v3 has no scene-description concept, so a bracketed direction is either
absorbed as a tag or read out loud — and `creative_transcribe_audio` echoes the
prompt, so transcription can never tell you which happened. What can: a spoken
direction is a separate utterance, so it leaves a silence between itself and the
line. Scan for an internal silence >=0.15 s at -38 dB before ~45 % of the take's
duration. Across 26 tagged takes at v5.28: zero. That is evidence; a duration
that "looks about right" is not.

## "Maximum diversity" is a constraint problem, not a shuffle (v5.29)

Chad asked for the tent audience to be *"distibuted in a way that has maximum
visual diversity. Mathematically."* A random deal cannot answer that, because
random is exactly what puts two identical faces side by side. What answers it:

1. **A balanced deal** (`bag[k] = k % KINDS.length`) before any shuffle, so
   every kind is guaranteed a seat BY CONSTRUCTION rather than checked for
   afterwards. That is the whole of "represented at least once, don't
   accidentally remove any".
2. **A neighbour graph in WORLD SPACE, not grid indices.** Two seats are
   neighbours within 2.30 m, which picks up the row (0.9 m), the row behind
   (2.0 m) and the diagonals (2.19 m) and correctly does NOT bridge the 1.8 m
   aisle. Grid adjacency would have called across it. Weight each pair `1/d` —
   the closer two identical faces are, the more they read as a copy.
3. **An O(1)-delta local search.** A swap only changes the cost around its two
   seats, so 4000 steps are free. It drove cost 3.08 -> **0.00** at full
   density and 0.50 -> **0.00** at `LOW`: zero same-kind adjacent pairs out of
   39 and 9. Not "fewer". None.

Seed the LCG and use it for both the shuffle and the search, so the tent is
identical on every load, device and test run — a crowd that re-rolls per
session is a crowd no probe can defend. Then expose the measure
(`stage.seatStats()`) so the claim stays checkable: **a `samePairs` that is not
0 is a regression**, and that is a test, where "looks varied" never was.

## A cap you raise that changes nothing was not the constraint (v5.29)

`sitwoman` would not simplify below ~26k triangles. The first guess was
gltf-transform's `error: 0.02` cap, and `prepwoman.mjs` gained an argument to
raise it — at 0.08 the mesh came out 26331 triangles against 26309. The floor
was topological: locked UV seams the simplifier will not collapse across. One
measurement would have read as "the cap is the limit"; the SECOND measurement,
at a different cap, is what proved it wasn't. Before optimising against a knob,
move the knob and check the number actually follows it.

## The "compressor chuff" was the FILES, and a fade is what fixes a file edge (v5.30)

Chad heard "a mic opening chuff or clipping sound at the start and end of
every voiceline" and blamed the compressor. Measured through the real bus in
an OfflineAudioContext, softening the compressor moved nothing (±0.3 dB, the
artefact untouched). The takes were the cause: eleven_v3 returns audio
trimmed to its last audible sample, so nearly every one of his begins on
signal and ends on it — several while the voice is still LOUD (`v5fearB1`'s
last 40 ms sit 14 dB above the body of its own line). A buffer that starts
and stops on a non-zero sample is a click, and ×3.5 makes it a chuff. An
8 ms fade-in and a 50 ms fade-out on every voice source's own gain node
turned every positive tail negative at a cost of 0.2 dB. Before touching a
bus for an edge artefact, measure the first and last 40 ms of the file
against its body.

## A crossfade after a turn take is a second spin (v5.30)

The catwalk take carries -180° in the hips. `mkTurn` walks the GROUP to
ry1 + PI under it and snaps the group to ry1 on the cut, so the two cancel —
but only if the hips change on the SAME frame. With a 0.15 s crossfade into
the next take the group snapped first and the hips blended after: for 0.15 s
he faced the wrong way and whipped round. Chad saw it as "a double spin".
The v5.07 law already said it: a fade of 0 is a hard cut that bakes the
pose. Any cut that undoes a take's baked rotation must be hard.

## cineSeek re-applies every passed track at its end value (v5.30)

A `tr` whose window has passed is still applied every frame at k = 1 — a
scene is a set of state functions of t, not a list of one-shots. So a probe
that pauses the film and overwrites something a passed tween wrote sees its
change undone on the next frame, while a value set by a `step` (once) sticks.
To pose a thing by hand for a screenshot, pause BEFORE the first track that
touches it. Found because six candidate arm poses rendered identically.

## The sound-effects node's default length is one second (v5.30)

`creative_generate_in_flow` for `sfx` takes no `duration_seconds`; the first
paper-and-wind take came back 1.04 s long. The three-step path —
`creative_add_flow_node` with `model_parameters.duration_seconds`, then
`creative_run_flow_nodes` — is how a sound gets the length the shot needs.
And it came back at -25.8 dBFS peak: an SFX take is peak-normalised on
install like any other sound, never trusted as delivered.

## A headless probe must unmute on the TITLE screen (v5.30)

The opening line's timer fires two seconds into play and, by design, stands
down if the game is muted then. The probe box starts muted; unmuting after
`state === 'play'` took longer than two seconds on SwiftShader, so the line
was "missing" for three runs before the probe was wrong and the code right.

## "Over-compressed" is a face you did not look at up close (v5.31)

Chad, on v5.29's seated woman and the brazier granny: "overly compressed
... they should not look so deformed." Both had been accepted from a wide
shot. Rendered head-and-shoulders in a bare viewer, the woman's face was a
smear — 26k triangles and an 8192-pixel atlas shrunk SIXTEEN times to 512,
so a whole body's texture gave the face a few dozen pixels — and the
granny's nose was a wedge, her chin a polygon (22k triangles from 257k).
Gentler encodes (47k triangles on a 1024 sheet; 39k on 1024) cost 1.0 MB
and 0.6 MB more and have a real face each. Two rules from it: a figure the
player can walk up to is judged at the distance the player can reach, and
a texture is judged by the pixels its FACE gets, not by the sheet's size.
And v5.29's note that the woman "would not simplify below ~26k triangles"
was wrong: at the tool's own defaults the same source gives 47k at ratio
0.08 and 165k at 0.28 — the 26k file came from a far lower ratio than the
doc believed. When a number contradicts the tool's documented behaviour,
re-run the tool before writing the number down as a property of the model.

## A harness's navigation timeout is part of the suite's contract (v5.31)

`leaktest` and `fixturetest` were the only two harnesses on Playwright's
default 30 s navigation timeout; every other one gives the page 180 s.
Both failed twice on `page.goto` alone — the boot preloads (the 1.6 MB
ghost among them) do not finish in 30 s when two browsers share the box —
and passed the moment they ran alone. The failure named nothing in the
game, and the game had not changed at boot (the live site's preloads were
diffed against the build's: identical). Now both set the same 180 s. A
harness that fails on its own timeout is a harness that will one day be
"flaky" in someone's memory and skipped; give every one the same budget.

## "Cannot", written down without a try, held for fourteen sheets (v6.1)

v5.14 put the voice lines under the text on the Google Sheet because "the
connector takes a workbook only as base64 inside a tool call, and even a
20 KB workbook is 27 KB of base64 — past what a session can read back and
re-emit without risking a corrupt byte." Nothing had been tried; it was a
fear about the session, recorded as a property of the connector, and it
shaped fourteen sheets (v19–v32). Chad's ask for tabs — "google sheets
wont be sustainable in the long run unless you can figure out a way to
write tabbed google sheets" — forced the attempt: a two-tab test workbook,
then the real 22 KB one, sent as 30 KB of base64 through `create_file` with
the xlsx MIME type. Drive converted each into a native sheet with one tab
per worksheet, and the read-back matched the uploaded file in every one of
393 rows (`tools/verifytabs.py`). Two rules. A limit written down as
"cannot" must say what was TRIED, or it is a guess wearing a fact's
clothes. And the fear it guarded against is better TESTED than avoided:
the session emits the base64 once, into one tool call, and the
cell-by-cell read-back check would catch a corrupt byte on any publish —
which turns "might corrupt" into "verified, every time".

## A state class named like a global stamp IS the stamp (v6.2)

The selector's first build put two chapter rows and two progress dots in
the top-right corner of the panel, rotated thirteen degrees with red
borders. They had been given the class `sealed` to mean "this chapter is
sealed" — and `.sealed` is the complete card's STAMP, `position:absolute;
top:2px; right:6px; transform:rotate(-13deg); border:2px solid
var(--seal)`, a bare class selector that reaches every element on the
page. Nothing errored; the rows simply became stamps. The rule is one
grep before naming a state class in a shared stylesheet: look for the bare
name (`\.sealed\b`), and if it exists anywhere unscoped, pick another (the
stop's class is `done`). The same grep run over every new class of the
build found no other collision — which is the check that should have come
first, not second.

## A harness that prints its verdict but never fails is decoration (v6.3)

`runtests` decides pass or fail from a harness's EXIT CODE and an
"errors: [" line in its output — never from the booleans the harness prints
in its JSON. `restarttest` had printed `{ playing: true, hudBack: true … }`
for two ending paths since v3.2 and exited 0 whatever the values were, so
a false `statsReset` would have read as a pass. Found while adding the
episode card's path to it and asking how a false check would be reported.
The new block sets `process.exitCode = 1` and prints `errors: [...]` when
a check is false, as `menutest` does. Rule: a harness earns its place only
if a wrong answer turns the line red — after writing a check, make it fail
once (or read how the runner judges it) before trusting it green.
