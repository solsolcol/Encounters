# The v2.3 sound pass — plan and live checkpoint

> **Since v5.14 the WORDS of every voice take live in `src/voicelines.js`**
> (and on the VOICE LINES tab of Chad's sheet) — transcribed from the
> shipped takes, not copied from the plans. The line texts in the tables
> below are history: what was asked for, which is not always what was
> recorded (docs/V5.14-VOICE-LINES.md has the differences).

Goal: a complete soundscape for chapter 1 — every interaction, UI cue,
cutscene beat, ghost moment and self-narration line — generated on Chad's
ElevenLabs account and playing in both builds. This file is the running
checkpoint: if a session dies mid-task, the next one resumes from the
STATUS columns and the flow IDs below.

**Main character voice (Chad's explicit pick, use everywhere, never vary):**
**since v5.28 the boy is AARON — voice_id
`B6uUx2p7cRgxseOUyP6P`**, model `eleven_v3` (the registry key and the file
names stay `james`/`v*`). The history below it is history, not the current
voice: v5.18–v5.27 he was River Faith, `v6KgbPaQh6lAmMpmmtcH`, dropped
because Chad was never satisfied with the voice itself even after two rounds
of level work on it; v5.15–v5.17 he was VALF, `loY1uopAz31XyhAEhNSa`, dropped because
eleven_v3 re-rolls a voice's character per take and VALF's range is wide
enough to land on a girl in one line and a grown man in the next; and from
v2.3 to v5.14 he was "James - Husky, Engaging and Bold",
`EkK5I93UQWFDigLMpZcX`, stability 0. The `assets/voice.mp3` line is generated with the same voice so
the whole game is one actor.

**Since v5.26 his lines ride their own bus** (`VOICE_BOOST` in main.js:
gain 2.0 into a DynamicsCompressor, before `packGain`). His takes are
peak-matched like everything else, which left his AVERAGE ~19 dB under his
peaks and only 3.5 dB over a room bed — measured, that is what "too soft"
was. The bus lifts the quiet lines ~5-8 dB and the loud ones not at all.
Two things follow for anyone generating a new take for him: keep
peak-matching (the bus handles the average, and the mp3s stay the proven
fallback), and **add its id to `JAMES_TAKES` in main.js** or it plays at
the old level — `chaptertest` fails the build if you forget.

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
| vrelief | James, quiet shaken exhale, 3.8 s (REMADE v4.8 — the original take actually said "Just keep walking. Don't look back", wrong wherever relief was meant; eleven_v3 refuses a tags-only prompt, so the remake gives it breath vocalisations as text) | C @3.15 since v5.18, once he is clear |
| vchantline | James, murmured chant, 9.3 s | RETIRED at v3.8 — Chad wanted the original chant with nothing spoken over it. Sample and `vchant` sting kind both kept; no scene fires it. |
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


## v4.0 additions (chapter 2 · The Presence) — 72 sounds in the pack

Flow `q7aeSWHTTHg8qW28OmlM`. James is `EkK5I93UQWFDigLMpZcX`; **Mother is
`XrExE9yKIg1WjnnlVkGX` (Matilda)** — a new speaker, and the first voice in
the game that is not James. The workspace has no Singaporean or Asian
female voice; of what it has, a middle-aged alto is the closest thing to a
tired woman woken at two in the morning, and she is off-screen through a
doorway, which forgives the accent.

| name | what | where |
|---|---|---|
| `clock` | cheap wall clock, 4 s loop | a bed of the room, and the silences |
| `fan` | ceiling fan, slow, 5 s loop | a bed of the room |
| `doorcreak` | a domestic door: handle click, quiet swing, settle (REMADE v4.8 — Chad: the old creak "does not sound like it") | the opening film, B, C |
| `hallsteps` | slippers on terrazzo, approaching | B |
| `bedcreak` | a mattress and frame taking weight | the film, A, D |
| `v2wake1` | *"It followed me home."* | the film, over black |
| `v2wake2` | *"Ma? Ma, is that you?"* | the film, and nothing answers |
| `v2wake3` | *"There is someone in the room."* | the film, under the fade |
| `v2call` | *"MA! MA, COME HERE! PLEASE!"* | B |
| `v2ma` | Mother: *"Aiyah. What is it now? Go back to sleep, boy. I am here."* | B |
| `v2near` / `v2gap` | the two proximity lines about the gap | play |
| `v2A`–`v2D` | the four under the outcome cards | the cards |

**A chapter now declares its own sound.** `ambience` names the loops that
run in it (`beds`) and the one keyed to the shrine (`atShrine`), `lines`
names its two proximity lines, `sayPrefix` picks the four under its cards,
and `voiceLine` the one on entering play. Chapter 1's values are all
defaults, so nothing about the deck changed. Chapter 2 has traffic, a fan
and a clock, and no fire — see CLAUDE.md for the full table.

`warmIntroSet()` is new and separate from `warmPlaySet()`: an opening film
runs before the player has done anything, so nothing else has warmed the
pack for it.

Two warnings, both learned the hard way here and both in LEARNINGS: five of
eleven eleven_v3 lines FAILED on long sentences with fussy punctuation, and
the generator's output level ranged over 33 dB across one run. Measure
every file against the pack before encoding.

The pack is now 72 sounds and 7.3 MB, and that is the next thing to look at
— a compression pass before chapter 3, not before shipping this one.


## v4.1 additions (chapter 3, THE GATHERING) — 95 sounds in the pack

Flow `3Af3rMqvMtsVecg9KPd5`. James is `EkK5I93UQWFDigLMpZcX`; the auntie at
the paper table is **`Xb7hH8MSUJpSbSDYk0k2` (Alice)** — the workspace still
has no Southeast Asian female voice, so what she was actually chosen for is
that she does not sound like chapter 2's Mother (Matilda). Two women in
consecutive chapters must not be the same voice.

| name | what | wired at |
|---|---|---|
| `tentamb` | the tentage's room tone: canvas, a shifting crowd, traffic a street away, 6 s loop | a bed of the chapter |
| `ritual` | the ceremony ITSELF — hand drum, wooden fish, a man chanting low — 8 s loop | a bed; ducked to nothing at the film's 22 s mark |
| `drum` | ONE struck hand-drum hit, for accents | the film ×6, A, B, C, D |
| `cymbal` | small hand cymbals, one strike | the film ×3, A, B, D |
| `gong` | bronze temple gong, the trance moment | the film @23.3, B @5.2 |
| `burn` | a bundle of paper into the brazier | the film @13.9 |
| `chair` | a red plastic chair moving on tarmac with nobody in it | the film @30.6, C @22.0 |
| `v3wake1`–`v3wake4` | James, the four lines of the opening film | intro |
| `v3near` / `v3altar` | the two proximity lines about the altar | play |
| `v3ask` | *"Is it real, auntie?"* | C |
| `v3aunt1`–`v3aunt4` | the auntie's four in scene C | C |
| `v3aunt5` | *"Boy, come out of there now."* | B, hauling him out of the ritual — **the GRANNY at the brazier since v5.29**, not the auntie |
| `v3A`–`v3D` | the four under the outcome cards | the cards |

**Why the drum is inside `ritual` and also its own sample.** A cutscene can
duck a chapter's loops (`api.duck`, added at v4.1) but it cannot duck half a
loop. The film's whole spine is the ceremony stopping dead — chant AND drum,
on one track — so they are one loop. The separate `drum` sample is a single
hit, cued by hand, which is also the only way to write a ritardando.

**Two findings, both of which correct earlier notes here:**

- **eleven_v3 fails about one line in three, at random.** Seven of sixteen
  failed and every one succeeded on a plain re-run with the text unchanged.
  Lines of identical shape both passed and failed in the same batch. The
  v3.7/v4.0 note blaming length and punctuation was wrong. Check
  `has_failures`, re-run, repeat — do not rewrite.
- **The generator's level spread was 36 dB this run**, worse than v4.0's.
  `drum` and `tentamb` both came back at −57 dB mean. Re-prompting for
  "LOUD, close-miked, full level" helped and was not enough, so every file is
  gain-corrected from its own `volumedetect` reading: one-shots peak −3.0,
  loops mean −27 (peak capped −3), voice peak −1.8. See
  `docs/V4.1-CHAPTER3-PLAN.md` for the script and the per-file numbers.


## v4.2 · Delivery, not content

No new sounds. What changed is how the 95 reach the player, and it is
written up in full in `docs/V4.2-AUDIO-DELIVERY.md`. The short version,
because it changes what "add a sound" means:

- **`assets/audio/*.mp3` is still the source of truth and is untouched.**
  Dropping a new mp3 in there is still all it takes to add a sound.
- **`assets/audio-opus/*.ogg` must carry the same stems.** `build.py` fails
  the build if an mp3 has no Opus encode, or an Opus file has no mp3. Encode
  a new one from its ElevenLabs MASTER (not from the mp3 you just made):
  `-ar 48000 -c:a libopus -b:a 96k` for stereo, `64k` for a mono voice line,
  `-map_metadata -1`, and a `volume=NdB` that matches the mp3's peak.
- **The pack is no longer one file.** `build.py` splits it into a shared pack
  plus one per chapter, computed from what each chapter's source actually
  asks for. Nothing to declare, nothing to maintain — but see the two traps
  in the v4.2 doc about `STING_SAMPLE` and `packWarm`, both of which look
  like usage and are not.
- **Which encoding a player gets is decided by decoding a 179-byte probe**,
  never by a support string. mp3 is the fallback and is exactly what shipped
  before.


## v4.3 additions (the Gathering revised) — 109 sounds in the pack

Flow `Ba3KbvcsokjCitaXcrmo`. James only — the auntie's five lines carry over.
All seven voice lines passed on the FIRST run (0 of 7 failed; the 1-in-3
failure rate is real but it is a distribution, not a guarantee).

| name | what | wired at |
|---|---|---|
| `ceremony` | THE constant tang-ki ensemble bed, 25 s loop, eleven_music_v2, loop-cut in post | a bed of the chapter, 0.42 |
| `crowdmur` | crowd murmur under canvas, 12 s loop | a bed, 0.26 |
| `suona` | one rising shawm blast | intro, A, B |
| `bellring` | tang-ki hand-bell shake | A, C, D |
| `drumroll` | accelerating roll into a slam | A |
| `gongdeep` | huge low temple gong, 5 s decay | A, B, C, D |
| `trancehum` | sub drone swell — the chapter's dread layer, replacing her leitmotif | A, B, C, D |
| `v3chair` | *"There's one chair facing the wrong way. Just one."* | the film |
| `v3out1` | *"She's out there. Standing in the middle of the car park. In the sun."* | the film |
| `v3out2` | *"She's not coming in."* | the film — the four words the revision exists for |
| `v3seen` | *"He looked at me. Out of all of them... he looked at me."* | A |
| `v3grip` | *"His eyes were shut. He was looking at me with his eyes shut."* | B |
| `v3left` | *"I could still hear the drum from the lift. I told myself that was normal."* | D — chapter 4's doorstep |
| `v3play` | *"It didn't feel wrong in there. That was the part that felt wrong."* | entering play, via `voiceLine` (which may name a pack sound since v4.3) |

Chapter 3 cues NO ghost sound and none of her grammar: whisper, gwail,
gsigh, gscream and the `strings` reveal-sting appear nowhere in it.
`v3wake4` lost its caller (the old her-at-the-chair line) and sits unused
in the shared pack.

Two model lessons, both in LEARNINGS: the sfx model ignores durations
written in prose (`duration_seconds` is a node parameter; so is `loop`),
and the music model fades out despite "no fade-out" — loop-cut in post and
verify instrumentality by transcribing it (empty transcript = no lyrics).

## v4.9 additions (chapter 4 · BACK HOME) — 152 sounds in the pack

Flow `onCJRf3baqVywQCBx6W5`. Third speaker returns: Ma is Matilda
(`XrExE9yKIg1WjnnlVkGX`, same voice as ch2's mother — she IS the same
character), phone-EQ'd (highpass 280 / lowpass 3300) for the handset;
the dry masters live in the session scratchpad only. James per contract.
19 SFX + 19 James lines + 3 Ma lines; every scene-cued name is a
STING_SAMPLE row, the three beds are chapter ambience (no rows needed).

| name | what | wired at |
|---|---|---|
| `v4room` | evening flat room tone, 12 s loop | a bed of the chapter, 0.22 |
| `nightsilence` | oppressive 3 am near-silence bed, 10 s loop | B |
| `mem1` `mem2` `mem3` | the three flashback beds (fire, fan, ceremony) | A |
| `memwash` | dreamlike transition wash | A |
| `sitdown` `sofacreak` | body on wood / on fabric | A, B |
| `switch4` | the wall switch — the lights-on beat | the film |
| `doorkeys` | keys in the front door | the film |
| `phonepick` `phonedown` `dialtone` `dialbeep` `ringtone` `phonebell` | the 90s house phone, end to end | C, D |
| `tvstatic` | dead-channel roar, trimmed to die at C's stop-beat | C |
| `lightbuzz` | fluorescent buzz-flicker | B, C |
| `curtain` | fabric snap in wind | C |
| `v4wake1/2/3` | the film: the lift line, the lights line, the window line | the film |
| `v4voice` | the entering-play line (`voiceLine`) | play |
| `v4near` `v4sit` | proximity lines at the chair (`lines`) + seated | play, A |
| `v4thinkA1/2/3` | the three flashback voice-overs | A |
| `v4tired` `v4wake3am` | scene B: exhaustion, the 3 am wake | B |
| `v4taunt` `v4regret` | scene C: the shout at the room, the regret | C |
| `v4call1/2` | scene D: his side of the phone call | D |
| `v4ma1/2/3` | Ma through the handset: answer, the tang-ki promise, goodnight | D |
| `v4A/B/C/D` | the four outcome-card lines (`sayPrefix: 'v4'`). REGENERATED at v4.91: the first takes READ THE CARDS (7–9 s narration) — the convention (vA, v2, v3 alike) is James' own terse first-person reflection. Now: "It was never random. It followed me home." · "I ignored it. It did not ignore me." · "I dared it. In my own home. It answered." · "Help is coming tomorrow. I can hold one night." | cards |

The auto-duration trap bit seven sounds (v4room 12 s came back 1 s):
`duration_seconds`/`loop` are NODE parameters — set with
`creative_update_node`, re-run the node, and the model honours them
exactly. All seven were re-run at pinned durations and re-encoded from
those masters. `v4ma2` (the tang-ki promise — the chapter's key line)
failed BOTH first takes and needed a plain re-run ×3, text unchanged.

## v5.0 additions (chapter 5 · THE LESSON) — 180 sounds in the pack

Flow `onCJRf3baqVywQCBx6W5`. FOURTH speaker: the tang-ki is Bill
(`pqHfZKP75CvOlQylNhV4`, premade, age old, "Wise, Mature, Balanced") —
chosen for maximum distinctness from James; the workspace still has no
Southeast Asian voice. Ma is Matilda again, DRY this time (she is in the
room, not on the phone). James per contract. 6 SFX/beds + 13 James + 7
tang-ki + 2 Ma; the scene-cued names are 20 STING_SAMPLE rows, `v5room`
and `clock` are chapter ambience (no rows), the near/sit/voice lines play
through the lines/voiceLine paths (no rows).

| name | what | wired at |
|---|---|---|
| `doorknock` | three knocks on the front door | film 0.8 |
| `notepull` | paper peeled from under a seat | film 26.5 · scene D 4.8 |
| `noteset` | the note set down on the table — the film's reveal (v5.25) | film 30.2 |
| `matchstrike` | one match | scene D 13.8 |
| `noteburn` | 12 s of paper burning — the whole hold | scene D 15.2 |
| `teaset` | cups set down on wood | scene A 2.2 |
| `v5room` | 12 s morning-room bed (loop; the auto-duration trap bit it once — re-run at pinned 12 s) | ambience bed |
| `v5wake1/2/3` | James: the knock, the bow, THE NOTE | film 3.5 / 18.5 / 33.5 |
| `v5voice` | James: "He walks the flat like he is reading it..." | voiceLine |
| `v5near` / `v5sit` | the two proximity lines | lines.near/close |
| `v5fearB1` | James, shaky, after the release | scene B 27.0 |
| `v5disC1` | James: "Paper. It's just paper." | scene C 2.8 |
| `v5learnD` | James: the last line of the episode | scene D 35.0 |
| `v5ma1` / `v5ma2` | Ma: "Master, please come in." / "Master... thank you." | film 8.0 / scene D 25.0 |
| `t5note` | tang-ki: "Here. Under where you sit." — his first words in five chapters | film 29.0 |
| `t5teachA` | the 14.76 s teaching across the table | scene A 5.0 |
| `t5hallA` | the corridor, calmly, in daylight | scene A 26.5 |
| `t5fearB` | his voice cutting the fear replay — the release lands mid-line at 19.5 | scene B 16.5 |
| `t5disC` | quiet, behind the turned back | scene C 9.4 |
| `t5learnD1` / `t5learnD2` | "We return what was kept." / the lesson at the altar | scene D 5.8 / 28.2 |
| `v5A/B/C/D` | the four outcome-card lines (`sayPrefix: 'v5'`), James' terse first-person per the vA/v2/v3/v4 convention | cards |

Five of 55 generation sessions failed (eleven_v3's usual one-in-three,
spread thin); every line had a completed sibling take, so zero re-runs.
The pack split promoted `hallsteps`, `chair` and `doorcreak` to shared
automatically once ch5 named them (ch4 already did) — the computed split
doing exactly what it is for.

## v5.15 — the boy (VALF), and Chad's sheet pass

Flow `ONfG5TjBa2jA5CvgvRf9`. Every line of the main character regenerated in
VALF (`loY1uopAz31XyhAEhNSa`, eleven_v3): 82 takes, plus the changed lines
of the other speakers — `v3aunt3/4/5` (Alice), `v4ma2` (Matilda),
`t5teachA`, `t5fearB`, `t5disC` (Bill). 86 masters in `masters/v5.15/`,
one row each in `progress.json` (prompt, session, measured length).
Prompts are the registry text; `[shouting]`/`[whispering]` from the
notes; the scares and the faint carry a fear tag. Encoded by
`masters/v5.15/encode.mjs`: both contracts, each take PEAK-MATCHED to the
file it replaced (never above −0.5 dB) — the new masters ran 2–4 dB hotter
at the same peak, so a blanket gain would have re-mixed every scene.
`src/voicelines.js` carries the new lengths; `masters/v5.15/overlapscan.mjs`
is the timing check (see V5.15-THE-BOY.md). `vrelief` is once again the
v4.8 recipe: "[exhales, shaken, relieved] Hoohh... hahh." — a tags-only
prompt failed three times first (LEARNINGS said it would). Transcribed
after generation: empty, i.e. wordless. Four generations failed on the
first run (vrelief ×3, none other); zero re-runs beyond that.

## v5.18 — the boy again (River Faith)

Flow `SJOh2uYIDn17yolZgzzW`. Every line of the main character regenerated
in River Faith (`v6KgbPaQh6lAmMpmmtcH`, eleven_v3): **79 takes** — the
whole of `LINES.filter(l => l.who === 'james')`, which is 78 files in
`assets/audio/` plus chapter 1's standalone `assets/voice.mp3`. No other
speaker was touched (Ma, the auntie and the tang-ki keep their v5.15
takes), and **no prompt changed** — every one is the registry text
character for character, which is what makes this a re-voice and not a
re-write.

Same pipeline as v5.15, in `masters/v5.18/`: `dl.sh` + `harvest.mjs` fetch
the masters, `encode.mjs` writes both contracts with each take
PEAK-MATCHED to the file it replaced (audited after installing: 79 files,
loudest `vscare1` at −1.90 dB, quietest `v2wake2` at −11.50, none above
−0.5), and `progress.json` carries a row per line (prompt, session, VALF
length, River length, status). `overlapscan.mjs` re-checked every cue in
all five chapters' films and scenes.

River is FASTER than VALF — 331.5 s → 273.3 s over the 79, 67 shorter and
12 longer — so no cue could newly collide; the scan found none. The two
fixes it did want are the same take both times, `vrelief`, one of the
twelve that got LONGER (3.47 s → 4.52): `ch1` scene C 4.60 → 3.15 and
`ch2` scene B 20.0 → 18.9, so the exhale lands inside its scene instead of
running past the fade. Download: the 79 mp3s 5213 KB → 4306 KB, the Opus
2711 KB → 2273 KB.

## v5.28 — the boy a third time (Aaron)

Chad: *"i'm still not satisfied with this voice. lets completely change all
of the main character's voicelines ... every single instance of the main
character's voice in the entire game to Aaron. It must cover everything and
leave nothing behind."*

**Aaron** (`B6uUx2p7cRgxseOUyP6P`, eleven_v3), 79 takes — the whole of
`who === 'james'`, which is the same set `chaptertest` holds `JAMES_TAKES` and
the shipped files to, both directions, so a miss is a red build. Not one word
changed; only the voice.

The prompts are `masters/v5.28/prompts.json`, not the bare registry text: 26
of the 79 carry an emotion tag, under rules Chad corrected four times (the
registry's words exactly, no added capitals, at most one added ellipsis, and a
tag that names a FEELING — "whispering is not an emotion" — so `[terrified
whisper]`, never `[whispering]`). Prose in brackets is spoken aloud and must
never be written. That the tags were absorbed is measured, not assumed: none of
the 26 has an internal pause before its line.

Level: peak-matched to River as always, Aaron still measured **3.7 dB quieter
with a 3.2 dB wider crest**, which left him 1.87 dB under River through the
v5.26 bus. His bus gained a limiter (threshold -3, knee 0, ratio 20, 1 ms /
50 ms) and `VOICE_BOOST` went 2.0 -> 3.5: measured through the real node that
is +1.31 dB against River with nothing clipping. The other three speakers are
untouched — they never ran on his bus. docs/V5.28-AARON.md.

---

## v5.29 — the granny at the brazier gets her own voice

`v3aunt5` — *"Boy, come out of there now."* — was the auntie's, and shouldn't
have been. It is not delivered at the paper table: it lands in scene B at 15.0
with the camera on the BRAZIER, shouted at a boy who has walked somewhere he
should not have. v5.29 gives that spot its own model (Chad's Meshy scolding
granny, whose one clip is literally `Stand_Talking_Angry`), so the line got its
own speaker to match:

**`granny` — Lexi, `TiKM6Oo9KZhmYBsTBA2s`, eleven_v3.** A fifth voice, chosen
on the same rule the auntie and the Mother were: the workspace still has no
Southeast Asian voice at all, so what matters is that she does not sound like
either of the two women already in the cast.

The key, the file and every cue that fires it are unchanged — only `who` and
the recording moved. Peak-matched to the take it replaces (the v4.8 rule),
both encodings, `secs` re-measured **3.32 s → 3.16 s**. The shorter take
incidentally cleared the one standing overlap flag in chapter 3; the scan now
reports every ch3 film and scene `ok`. Master: `masters/v5.29/v3aunt5.mp3`.

---

## v5.30 — chapter 3 re-said slower, two of chapter 4's re-directed, and the edges of every take

Chad: chapter 3's film and some scene lines were "talking too fast and with
little emotion"; the chair line should end in "..." to sound brooding; the
red-chair memory line should sound more afraid. Thirteen takes regenerated
(Aaron, unchanged): `v3wake1 v3wake2 v3wake3 v3chair v3out1 v3out2 v3seen
v3grip v3ask v3left v3C v4sit v4thinkA3`. Picked by MEASUREMENT: words per
second over all 79 — the game's median is 2.3, chapter 3's film opened at
3.97 — and every one of the thirteen had been untagged at v5.28. Prompts in
`masters/v5.30/lines.json`: an emotion tag each and the ellipses Chad asked
for (prompt-only; the registry text is unchanged except `v4sit`, now "Start
from the beginning..."). Rates after: 1.4–2.3 w/s. `v3left` was re-taken once
(the first read came out FASTER, 3.29 w/s). Peak-matched, both encodings,
`secs` re-measured; chapter 3's film and scenes B, C and D re-timed, the
overlap scan clean everywhere.

**One new sound: `noteflight`** — one sheet of paper lifting, flapping and a
low gust, 6.5 s, ElevenLabs sound effects v2 (flow `QQFMBc7vo8htSK1i8X53`),
for chapter 5 scene C's new ending: the hell note flies off the table and out
of the window while the camera follows it. Peak-normalised to -3.9 dBFS on
install (it arrived at -25.8).

**And every voice source now has EDGES** (main.js `voiceEdges`): an 8 ms fade
in and a 50 ms fade out on its own gain node. That is what the "mic-open
chuff" was — takes that begin and end on a loud sample, through ×3.5 — and
what "cut off prematurely" was: eleven_v3 trims to the last audible sample.
The bus (v5.26/v5.28) is unchanged; the bytes are unchanged. The play-time
gate (`say`/`speak`/the opening line) now also waits for ANY live voice, so
his lines never stack, and a scene's natural end lets a line finish rather
than ramping it out.

## v6.3 — one new sound: `epfanfare`

The episode-complete card's fanfare: a low gong struck once and a rising
swell that settles, 7.0 s, stereo — ElevenLabs sound effects v2 (flow
`bxh1TbtFsFmg6RPoqgPh`, node `tq3SMH9D3pG2U2nCjVh1`, take A of two: the
louder gong, the longer decay). Master `masters/v6.3/epfanfare-a.mp3`
arrived at 0.0 dBFS peak and is installed at −3.8 (mp3 44.1 kHz stereo
128 kbps, 113 KB; opus 48 kHz stereo 96 kbps, 78 KB) to sit with the
game's other stings (`uirank` −4.2, `noteflight` −3.9, `gongdeep` −3.4).
The engine fires it (`snd('epfanfare')` in `showEpisodeCard`), so the split
puts it in the SHARED pack (138 sounds shared of 183); it is decoded under
the sealed card by `packWarm` in `finish()` when the chapter is a case's
last. The rest of the card's sound is the vocabulary that existed: `kick`
under the stamp, `uiclick` per chapter stop, `uirank` as the score settles,
`uiconfirm` as the trail lights. docs/V6.3-EPISODE-CARD.md.
