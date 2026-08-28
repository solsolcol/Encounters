# The v2.3 sound pass — plan and live checkpoint

Goal: a complete soundscape for chapter 1 — every interaction, UI cue,
cutscene beat, ghost moment and self-narration line — generated on Chad's
ElevenLabs account and playing in both builds. This file is the running
checkpoint: if a session dies mid-task, the next one resumes from the
STATUS columns and the flow IDs below.

**Main character voice (Chad's explicit pick, use everywhere, never vary):**
voice "James - Husky, Engaging and Bold" — voice_id `EkK5I93UQWFDigLMpZcX`,
model `eleven_v3`, stability 0 (0%). The old `assets/voice.mp3` line is
re-generated with this voice so the whole game is one actor.

## Architecture decisions

- **One audio pack asset.** All new sounds live as small mp3s in
  `assets/audio/`; `build.py` packs them into one JSON (`{name: base64}`)
  that ships as ONE new asset key `audiopack` (one `__AUDIOPACK_B64__`
  token, one fingerprinted file on the hosted build). Adding a sound later
  = dropping a file in `assets/audio/`. The old `music` and `voice` assets
  stay as they are (music is the explore loop; voice becomes the James
  opening line).
- **Engine, not scatter.** A small sound engine section goes into
  `src/main.js` next to the existing music code: lazy per-sound
  `decodeAudioData` from the pack, one-shots with pitch jitter, loops with
  the 0.06 s `loopStart/loopEnd` inset (mp3 seam lesson), distance-driven
  loop gains recomputed each frame, a round-robin step pool, a music
  duck/stinger helper, and a one-at-a-time narration queue for the James
  lines. Everything through the one shared AudioContext, gated by the one
  mute button (loops ramp on mute like the music; one-shots check `muted`
  at fire time like today's stings).
- **`sting(kind)` keeps its name and call sites.** It first tries the pack
  sample for that kind and falls back to the procedural synth if the pack
  is missing/undecoded — cutscenes stay correct even mid-download.
- Encoding contract (CLAUDE.md): SFX/music mono 22.05 kHz 40 kbps, voice
  mono 64 kbps, `-map_metadata -1`, all via ffmpeg before committing.

## Generation flows (fill in as they start — resume key!)

- Existing footstep takes: flow `m4CCp8NwghWEw9rSHPqZ` (from Cowork).
- v2.3 generation flow: (not started yet — fill in the flow_id here)
- Session IDs per sound: see STATUS table.

## Inventory

Legend: status = planned → generating(session id) → downloaded → encoded →
wired → tested. "kind" = the `sting()`/engine name.

### Loops (amb volume follows distance/state each frame)
| kind | what | prompt sketch | status |
|---|---|---|---|
| amb | night void-deck bed: crickets, far traffic, fluorescent hum | 20 s seamless loop | planned |
| fire | joss fire crackling in a metal drum | 12 s loop, positional at shrine | planned |
| ghostloop | cold airy presence, faint female breath drone | 12 s loop, gain = reveal × proximity | planned |
| heart | slow human heartbeat, dread | 8 s loop, on when sanity < 30, louder as it falls | planned |

### One-shot SFX (world + cutscene stings)
| kind | replaces/where | status |
|---|---|---|
| step ×4 | footfalls, play + cutscenes (round-robin, from Chad's takes flow if usable) | planned |
| paper | note pickup / decision open / 'take' sting | planned |
| kick | foot scuffing paper (scene B start) | planned |
| clang | drum going over (scene B) | planned |
| whoosh | her fast move (scene B) | planned |
| boom | dread hit — she is here (scenes A/B + first reveal in play) | planned |
| scream | kuntilanak scream, scene B look-back | planned |
| cry | distant female weeping, random while she is present in play | planned |
| breath | close ghost breath, when she is very near in play | planned |
| chime | temple bell/singing bowl (scene D, teaching card) | planned |
| chant | low male Buddhist chant phrase, scene D under the prayer | planned |

### UI one-shots (small, subtle)
| kind | where | status |
|---|---|---|
| uiclick | Start, credits open/close, step-back, restart buttons | planned |
| uiconfirm | choosing A/B/C/D | planned |
| uicard | teaching-card rise (result) | planned |
| uirank | final rank reveal (complete) | planned |
| ulost | sanity-zero collapse sting | planned |

### Music beds (eleven_music)
| kind | where | status |
|---|---|---|
| dread | first ghost reveal in play: music ducks, this tense layer rises (~10 s) | planned |
| endbad | scenes A/B and lost screen bed (~15 s) | planned |
| endgood | scenes C/D + teaching card resolution bed (~15 s) | planned |

(the existing `assets/music.mp3` explore loop is untouched)

### James voice lines (eleven_v3, stability 0, voice EkK5I93UQWFDigLMpZcX)
| kind | trigger | line (v3 tags allowed) | status |
|---|---|---|---|
| voice | 3 s after world fade-in (existing slot, regenerated) | "Almost midnight... and this is still the fastest way home." | planned |
| vpile | first time within ~6 m of the pile | "Someone's been burning offerings. [beat] It's not even Seventh Month." | planned |
| vnote | first time the interact prompt shows | "There's one right at my feet. Like it was left for me." | planned |
| vghost | first reveal in play | "[whispering] There's someone standing there. There's someone standing there—" | planned |
| vlow | sanity first drops under 30 | "[shaky breathing] My chest... I need to get out of here. Now." | planned |
| vA | after scene A, under the card | "It's just paper. [beat] So why does my hand feel like it's holding something heavier?" | planned |
| vB | after scene B, under the card | "[panting] I shouldn't have done that. I knew it the second my foot touched it." | planned |
| vC | after scene C, under the card | "Look first. That's all it takes. Just... look first." | planned |
| vD | after scene D, under the card | "Not my offering. Not my business. [exhale] Rest well, whoever you are." | planned |
| vlost | sanity reaches zero | "[terrified whisper] I can't— I can't be here— [breath] I can't—" | planned |

## Cue wiring map (where each call lands in main.js)

- `updateViewmodel`: footfall = `vm.land` set → step one-shot (play state,
  speed-gated; not under cutscenes — scenes keep their scheduled `sfx`).
- `updateGhost`: reveal crossing ~0.1 upward → `boom` + `dread` duck +
  `vghost` (once per appearance for boom/duck; vghost once per run); while
  reveal > 0: ghostloop gain by distance, random `cry` every 9–20 s,
  `breath` when < 2.5 m; all zeroed when she is gone.
- shrine proximity: fire loop gain by distance to SHRINE (always on in
  play/decide, it is a real fire).
- ambience: `amb` loop from first user gesture (same nudge listeners as
  music), all states except cutscenes keep it; cutscene scenes keep it too
  (it is the same night).
- `startDecision()` → paper; `pick()` → uiconfirm; `dismissDecision()` →
  uiclick; card shown (playCine onDone) → uicard + endgood/endbad bed +
  the vA–vD line; `showRank`/complete → uirank; `restart()` → uiclick,
  stop beds/heart, re-arm one-shot triggers; lost → ulost + vlost + endbad.
- Buttons (start, credits, close, step-back, restart, next) → uiclick via
  one delegated helper.
- Scene stings stay as authored, with new ones added: B gets `kick` at the
  contact, `scream` at 8.5 s (with the boom), D gets `chant` at 1.0 s.
- `sanity < 30` → heart loop on, gain 0.10→0.35 as sanity 30→0; `vlow`
  once per run at the crossing.

## Test plan (proportionate)

- `soundtest.mjs`: update voice-line duration bounds to the new James line;
  add pack assertions (decoded count, a UI click plays, loops ramp to 0 on
  mute). It is THE harness for this change.
- `cinetest`/`fadetest`: cutscenes still run to completion (stings changed
  under them).
- `census`: unchanged systems; needs the environment fix for the Google
  Fonts `ERR_CONNECTION_RESET` console error (same family as the TUNNEL
  filter already there).
- `hosted`: the new audiopack asset fetches over HTTP.
- Full suite only at the release commit (substantial release).

## Release ritual (v2.3)

VERSION → 2.3 in build.py; both builds green; commit; tag v2.3; refresh
`Encounters-backup.bundle`; zip; push branch; republish preview artifact
(21317842-7db2-4d6a-95a4-eef816d9e68a) labeled `v2.3-sound`; Netlify MCP
deploy from `dist/` to project masterz-encounters-game (4133ded1-...); hand
Chad the bundle + zip.

## Status log

- [x] Plan written, committed (checkpoint 1)
- [ ] Generations started, flow IDs recorded (checkpoint 2)
- [ ] Engine + build pipeline in place, builds green (checkpoint 3)
- [ ] All assets downloaded + encoded + wired (checkpoint 4)
- [ ] Harnesses green both builds (checkpoint 5)
- [ ] v2.3 released: tag, bundle, zip, artifact, Netlify (checkpoint 6)
