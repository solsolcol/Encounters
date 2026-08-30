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
- Encoding contract (updated by Chad mid-task, replaces the old mono
  spec): full fidelity — native channel layout preserved, 44.1 kHz,
  128 kbps for generated sounds, explore music kept at its original
  quality untouched; always `-map_metadata -1`.

## Generation flows (fill in as they start — resume key!)

- Existing footstep takes: flow `m4CCp8NwghWEw9rSHPqZ` (from Cowork).
- v2.3 generation flow: `GWD3XGXSf18EJYIKmgds` (https://elevenlabs.io/app/flows/GWD3XGXSf18EJYIKmgds)
- Session IDs per sound: see STATUS table.

## Inventory

Legend: status = planned → generating(session id) → downloaded → encoded →
wired → tested. "kind" = the `sting()`/engine name.

### Loops (amb volume follows distance/state each frame)
| kind | what | prompt sketch | status |
|---|---|---|---|
| amb | night void-deck bed: crickets, far traffic, fluorescent hum | 20 s seamless loop | wired |
| fire | joss fire crackling in a metal drum | 12 s loop, positional at shrine | wired |
| ghostloop | cold airy presence, faint female breath drone | 12 s loop, gain = reveal × proximity | wired |
| heart | slow human heartbeat, dread | 8 s loop, on when sanity < 30, louder as it falls | wired |

### One-shot SFX (world + cutscene stings)
| kind | replaces/where | status |
|---|---|---|
| step ×4 | footfalls, play + cutscenes (round-robin, from Chad's takes flow if usable) | wired |
| paper | note pickup / decision open / 'take' sting | wired |
| kick | foot scuffing paper (scene B start) | wired |
| clang | drum going over (scene B) | wired |
| whoosh | her fast move (scene B) | wired |
| boom | dread hit — she is here (scenes A/B + first reveal in play) | wired |
| scream | kuntilanak scream, scene B look-back | wired |
| cry (RETIRED in v3.3; file kept in session scratch only) | distant female weeping, random while she is present in play | wired |
| breath | close ghost breath, when she is very near in play | wired |
| chime | temple bell/singing bowl (scene D, teaching card) | wired |
| chant | low male Buddhist chant phrase, scene D under the prayer | wired |

### UI one-shots (small, subtle)
| kind | where | status |
|---|---|---|
| uiclick | Start, credits open/close, step-back, restart buttons | wired |
| uiconfirm | choosing A/B/C/D | wired |
| uicard | teaching-card rise (result) | wired |
| uirank | final rank reveal (complete) | wired |
| ulost | sanity-zero collapse sting | wired |

### Music beds (eleven_music)
| kind | where | status |
|---|---|---|
| dread | first ghost reveal in play: music ducks, this tense layer rises (~10 s) | wired |
| endbad | scenes A/B and lost screen bed (~15 s) | wired |
| endgood | scenes C/D + teaching card resolution bed (~15 s) | wired |

(the existing `assets/music.mp3` explore loop is untouched)

### James voice lines (eleven_v3, stability 0, voice EkK5I93UQWFDigLMpZcX)
| kind | trigger | line (v3 tags allowed) | status |
|---|---|---|---|
| voice | 3 s after world fade-in (existing slot, regenerated) | "Almost midnight... and this is still the fastest way home." | wired |
| vpile | first time within ~6 m of the pile | "Someone's been burning offerings. [beat] It's not even Seventh Month." | wired |
| vnote | first time the interact prompt shows | "There's one right at my feet. Like it was left for me." | wired |
| vghost | first reveal in play | "[whispering] There's someone standing there. There's someone standing there—" | wired |
| vlow | sanity first drops under 30 | "[shaky breathing] My chest... I need to get out of here. Now." | wired |
| vA | after scene A, under the card | "It's just paper. [beat] So why does my hand feel like it's holding something heavier?" | wired |
| vB | after scene B, under the card | "[panting] I shouldn't have done that. I knew it the second my foot touched it." | wired |
| vC | after scene C, under the card | "Look first. That's all it takes. Just... look first." | wired |
| vD | after scene D, under the card | "Not my offering. Not my business. [exhale] Rest well, whoever you are." | wired |
| vlost | sanity reaches zero | "[terrified whisper] I can't... I can't be here... [panicked breathing] no, no, no..." (em-dashes made eleven_v3 fail, 3x) | wired |

## Cue wiring map (where each call lands in main.js)

- `updateViewmodel`: footfall = `vm.land` set → step one-shot (play state,
  speed-gated; not under cutscenes — scenes keep their scheduled `sfx`).
- `updateGhost`: reveal crossing ~0.1 upward → `boom` + `dread` duck +
  `vghost` (once per appearance for boom/duck; vghost once per run); while
  reveal > 0: ghostloop gain by distance, random crying every 9–20 s (v3.3: `sobbing`, panned),
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

## Release ritual (v2.3 — HISTORICAL)

> This records what the v2.3 release did. It is not current
> procedure: the preview artifact was retired on 30 Aug 2026 and
> is no longer republished. CLAUDE.md holds the live ritual.

VERSION → 2.3 in build.py; both builds green; commit; tag v2.3; refresh
`Encounters-backup.bundle`; zip; push branch; republish preview artifact
(21317842-7db2-4d6a-95a4-eef816d9e68a) labeled `v2.3-sound`; Netlify MCP
deploy from `dist/` to project masterz-encounters-game (4133ded1-...); hand
Chad the bundle + zip.

## Status log

- [x] Plan written, committed (checkpoint 1)
- [x] Generations started, flow IDs recorded (checkpoint 2)
- [x] Engine + build pipeline in place, builds green (checkpoint 3)
- [x] All assets downloaded + encoded + wired (checkpoint 4)
- [x] Harnesses green both builds (checkpoint 5)
- [x] v2.3 released: tag, bundle, zip, artifact, Netlify (checkpoint 6)

## Node map (flow GWD3XGXSf18EJYIKmgds) — resume key

amb=oq6hrlY5MprMXsbXBB4y fire=Lz9058vdEv37PGKKluLX ghostloop=eb42C0g7gsG4WAlqpOGy
heart=gU4xa8zfhNYbBOoydx97 paper=V7JfbuuS5BQrSg79WnVK kick=HHmt9IeeiPHgOnLvOZs4
clang=0L9CSPhKb26JIERJXKlX whoosh=HaScgtSLd0G2g0WyooOb boom=tLbAayIQmaX5EqCYUb9y
scream=RekrrA8uM07sAgvzUoeF cry=RkCL77bghMTCiA3X5Wjh breath=d4Drd9pxbJlkb7JlYTmS
chime=L5FeePYdPGxMwQtEOJ3n chant=bMRvX4VvikwbIK0RI7Ea uiclick=vt33XAedKSHt4wPgyrAp
uiconfirm=eV6XUKCBVgAYhTrx5zOc uicard=TaBvjXcy4nlKBLHZk1m3 uirank=RYg1AEkiweqdX6KlYSQx
ulost=sIdZcO9pNkJGfxplZtA9 steps(4-in-1)=J7jpiBWS2kiVlyM6EOT3
dread=vi4nGDBpGKLtiutzZnVH endbad=MFSV80I9A2o5sU0CbhPA endgood=LLgyW4pebsM8Z0DAiKwJ
voice=KgQ5iY3DyVVaaMnG5QDa vpile=z87bo9UFM3iwjy65zdEg vnote=UwgB3nD7n5p4nCnD7QIl
vghost=b5nuVeohEhIs1aow35Vf vlow=EJPLVpaemLuvybHBSS9o vA=eH4EWivLrlEoqyworNlL
vB=jhQ1u3DP9fX5EsxTiTxh vC=FEW5TK2fzak3bYmGEnrc vD=B62VvcyAnuVoiuJ8Xc2O
vlost=G4flDiFsnBETv1isG1gm

Note: this connector's eleven_v3 tts node exposes no stability parameter;
lines are generated at the node default. If a take feels off, Chad can
re-take it on the canvas with the stability slider at 0% (Creative).

Run session IDs (batch1 sfx): sLQW0rcBleTtKm8jDbul Z8Tnut493pekNKGI0wBU ZeQX0i8qgQNAJQJvAWPP XbqiZwPfrzGoPdRO0jHV sWeIAxgPcTE6nTgnEHtr BnsOMnl3Sk0lfPqfxcLk KDKCBetsKDJgWoqVpkrG A54FXawbcV2QRnWh4e2K OCyccqkE1d2MzGpjNp48 LV5vjNW57p2uLmsrdir2 bdSIRC0zlnRrt7vQ3J7o V2Wv3g0XoDjKTTnoZ9ER H4jskfCahYJxz7Hs2qNF KHHrBr56NzKySNUD4eex cvONMy6Bum6RST7gttRL Vx89GYzOjBQTK63PMiNv z7r7thIiockZQpq0bsBU GIVhoufNbjKaGPTVKkq3 Wd0jgCNKD4R7ynQSdec9 f6TJOsqqo8Te3NdsKwyy
Run session IDs (batch2 music+tts): k3E3KufkCWF8tLKWvUe4 gUvNObYXmT2g8QvGEJAJ 7j7LL3QtBYvLMXqpN4wh G5FZlRdWeL29sWWL227L yxJXosfiqwbt3ODhs8AD t3mHo6ngP8dhAosp3bvg R1bFOlNpwJvgL4KUg4em muqv5jgaF02o4Y62AnbT JAwRVRaEhtzrfYoxy6co X5USOpq3A6wF2VzexaaO lYI7O56r2YMP397VZaqM QMuo8G9R0XmfHamP0vrv 7b96pmgGkdXOCWmaJyNi

## v3.2 additions (the drama pass) — 38 sounds in the pack

Flow `qgaRsHtjsa18h41DngDp` (Encounters v3.2 drama pass audio).

| name | what | wired at |
|---|---|---|
| whisper | 14 s seamless ethereal loop: echoing murmurs, moans, crying, whispers (sfx v2, duration_seconds=14, loop=true, infl .45) | loop; swells with reveal, murmurs on presence while she haunts |
| strings | 3.5 s hair-raising high string screech (sfx v2, duration_seconds=3.5) | first appearance of a run, with a soft boom + music duck |
| vfaint | James, eleven_v3: "No... my head... everything's... spinning..." (6.9 s) | the faint at sanity 0, via speak() |
| vghost | REPLACED, same name: James whisper "Am I... seeing things?" (3.1 s) | first-appearance narration, retried until it lands |

Wiring rules learned in this pass (see LEARNINGS for the trap):
- `warmPlaySet()` decodes the whole night set at every entry into play.
- Machine cues (`audioCues`) are replayed each frame until their buffers
  exist (5 s deadline); narration retries via `wantLine`.
- `speak(name)` is an awaitable narration used by the faint and both
  cards; the outcome/lost buttons gate on it, muted resolves instantly.
- SFX nodes MUST get explicit `duration_seconds` — the model otherwise
  returns 0.5–2 s clips whatever the prompt says. Set via
  creative_update_node + creative_run_flow_nodes.


## v3.3 additions (the terror pass) — 44 sounds in the pack

Flow `QqOIcaVGcllJIiE9Qw8t`. `cry` retired (superseded by sobbing).

| name | what | wired at |
|---|---|---|
| sobbing | clear female weeping, 9 s | appearances (55 %), the crying cadence, the close scare — always panned to her bearing |
| gscream | piercing banshee scream, 3 s | ~25 % of reappearances (panned), always dead-centre on the close scare |
| swoosh | deep airy spectral pass, 2 s | every glide, panned; the old whoosh no longer plays for HER (cutscene stings keep it) |
| vscare1..4 | James eleven_v3: Ahh! / No no no / Who's there?! / What is that | rotating on every reappearance, via the narration channel |

Directional layer: whisper + ghostloop loops each carry a StereoPanner
steered per frame to her camera-space bearing (loopPan/ghostPan); one-shot
pans are set at fire time. snd() takes an optional 4th `pan` argument.


## v3.7 additions (the cutscene pass) — 56 sounds in the pack

Flow `RCPKylyhFk08CZOw1Czi`. Chad: "there are still a serious lack of
sound effects and voicelines... And there is an old ghost whoosh/zip
sound that sounds cartoonish."

James is `EkK5I93UQWFDigLMpZcX`, eleven_v3, stability 0. SFX are
`eleven_text_to_sound_v2` with an explicit `duration_seconds` — see the
note above; four of these came back at 0.5–2 s on the first run because
the duration was written in the prompt text, which the model ignores.

| name | what | wired at |
|---|---|---|
| vgasp | James, sharp frightened inhale, 2.1 s | A @5.02 — his eyes arrive and she is already there |
| vscoff | James, dismissive laugh, 3.1 s | B @0.62 — before the boot, so the kick has a character behind it |
| vpant | James, running out of breath, 4.4 s | B @4.60, under the whole run |
| vrelief | James, quiet shaken exhale, 3.3 s | C @4.60, once he is clear |
| vchantline | James, murmured chant, 9.3 s | D @1.35 (kind `vchant`) — scene D grew to 10.4 s so it finishes |
| gwail | her, low moan rising to a shriek, 4.0 s | B @3.40, as she starts after him |
| gsigh | her, letting go, dissolving into reverb, 4.5 s | D @4.45, as she is released |
| paperstorm | a thousand thin sheets in a gust, 6.0 s | B @1.60, swelling exactly as noteStorm ramps |
| ashburst | hot ash and embers thrown across concrete, 5.0 s | B @1.22, the drum going over |
| firedie | a large flame snuffed, 2.0 s | A @4.30, the fire dying as she condenses |
| bowl | bronze singing bowl, one strike, long decay, 7.0 s | D @0.85, struck as the palms come together |
| type | one soft key tick, trimmed to 0.29 s | the teaching reveal, every third character |

Levels matter as much as the samples: `type` came back at −59 dB mean and
needed +27 dB before a 0.16 playback volume was audible at all; `gsigh`
+14, `paperstorm`/`bowl` +7, `ashburst` +5. Measure with `volumedetect`
against the pack's existing sounds (mean −20 to −25 dB) rather than
trusting the generator.

Reused rather than regenerated for these scenes: `breath`, `dread`,
`strings`, `sobbing`, `scream`, `gscream`, `swoosh`.

The engine seam changed with them — `STING_SAMPLE` is now the whole
vocabulary a cutscene can reach, `STING_SYNTH` names the few kinds the
procedural fallback can fake, `sfx(at, kind, vol)` takes a level, and
`cineEnd()` ramps out every sample the scene started. See CLAUDE.md and
docs/V3.7-PLAN.md.
