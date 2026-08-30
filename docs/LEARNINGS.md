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
