## L3 · Sound review of episode 3 chapter 5 ("The Children On My Altar"), read-only

This is a read-only review. I edited no files and launched no browser.

**Line numbers.** `src/chapters/e3/e3c5.js` was being edited while I worked. Another lens's v24.2 CP1 edits are in the working tree, saved at 07:01. Those edits touch no sound code. All line numbers below are from that tree.

**How it was measured.**
- Levels are per-channel RMS from ffmpeg volumedetect. Each is multiplied by the gain the code plays it at.
- Band shares come from a full-file FFT.
- Every film and ending was walked with chaptertest's recording stub, timed against the shipped files' measured audible lengths.
- The scripts are in `/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/` (`walk/walk.mjs`, `meas/*.py`).

**Reference levels.**
- His voice comes off its bus at about −13 dBFS. The cast is flat at −16.
- Whenever anyone speaks, everything else drops to 0.4 (−8 dB).

### Checked and clean
- All 195 sound names the chapter uses have a file and a STING_SAMPLE row.
- Every film, scene and in-play cue is warmed before it plays. chaptertest is green: 97 cutscenes, 1102 fired samples. Every play-time sound the chapter fires is in one of its own warm lists.
- The `SECS` table matches all 93 shipped takes to within 0.06 s.
- No two voices overlap in any film or ending. No cue sits past its scene's last track.
- Beds go to zero at the title and the chapter card, and stop when the chapter is left. One-shots come down at the title and on a restart.
- I found no path that clips.

---

## PART A — Bugs

**L3-1 · COME BACK's music plays out under its own instructions, and runs out on a slow climb.**
- Where: e3c5.js:8911 (`sfx(T.come - 0.4, 'k5climb', 0.6)`); 8913 (`eventWait`); 3920–3929 (`comeOpts`: a brief on the first play, `secs: 30`); 8916.
- What happens:
  - The cue fires 0.4 s before the film pauses.
  - On a first play the brief panel holds the event until START. Meanwhile `k5climb` (20.4 s, audible to 19.1 s, peaking about 10 s in) plays on in real time under the instructions.
  - The climb itself can last up to 30 s, so a slow climber does the last 10–20 s with only the water bed (−28 dBFS) and the pulls.
  - The swell never follows the climb.
- Severity: medium — the chapter's climax, on every first play. Confidence: high.
- Fix: start the music in the surface event's `onBegin` (after START), as a loop whose level follows `littleLive.lv` (0.3 → 0.7). Let `surfaceStart`/`comeDone` bring it down, as today's sfxFade at come + 0.2 does.

**L3-2 · Ending A's music box never stops: it is faded out at two-thirds speed.**
- Where: e3c5.js:8975–8977; `masters/v23.0/music/fates.py`. `k5endA` slows from 1.0 to 0.27 over 12.5 s, and its stop is at 12.5 s.
- What happens:
  - It is cued at 50.7 and faded at 57.0–58.35 (the CP13 S2 fix), which is 6.3–7.65 s in, at about 0.6× speed.
  - Plan §4.8 A says "slower and slower, stopping before the phrase can end". That stop would land at 63.2 and is never heard.
  - Every second that is heard sits ducked under z5A6 (52.0–57.3).
- Severity: medium — this is the worst ending's defining sound. Confidence: high.
- Fix (no credits): re-make `k5endA` with D ≈ 5.5 s so it stops at about 56.2 and its last note rings into the fade. Move z5A6 to 49.0 so it ends at 54.3, before the stop.

**L3-3 · The music box keeps "playing" with no tune.**
- Where: e3c5.js:5436 (`startLull` is one 23.95 s one-shot); 5443 (the drum turns while `cntLive.lull`); 5551 (it only stops when the bag is packed); 3094 (the room's drum turns while `boxOpen > 0.5`); 3274 (`askBeat` keeps the lid up); 3425 (`openResume` opens it).
- At the counter: the tune ends about 24 s after the shy one's story. The drum keeps turning through ow5give, film K, the promise and the wrap. The plan wants the tune to "go on playing to the end of the counter".
- In the room: the drum turns silently through the three openings, the aftermath and the decision. A Continue into open1–decide shows the drum turning with no tune ever played.
- Severity: low-medium. Confidence: high.
- Fix:
  - Counter: make the tune a positional bed (`k5boxloop`, cut from `k5lullaby` b at its 10.25 s phrase repeat), keyed to `cntLive.lull`, at half level under film K's three asks.
  - Room: ease `drumRate` to 0 when the tune's source ends (or play `k5boxdown`, below), and set it to 0 in `openResume`.

**L3-4 · The question's held tone comes in after the question.**
- Where: e3c5.js:6805 (`if (OPEN_I[phase] !== undefined) want.held = 0.2`). `askBeat` (3269–3287) runs while the phase is still 'sit'.
- What happens: the box's tune ends about 1.6 s before z5wonder. Then z5wonder and z5ask — the case file's own question and the chapter's turning point, about 13 s — play over a bare room at about −40 dBFS. `k5night` only fades in after open1, about 17 s after the tune ends. The code's own comment, and plan §9.4, put it "from the question".
- Severity: low-medium. Confidence: high.
- Fix: `if (OPEN_I[phase] !== undefined || (phase === 'sit' && openLive.busy)) want.held = 0.2`.

**L3-5 · His bedroom footsteps are shoes on concrete.**
- Where: the stage at e3c5.js:6978ff declares no `stepSound`; main.js:7663–7666 and 9244–9251 then fall back to "a real footfall on concrete".
- What happens: every walk in his room (door → jug → desk → each child → mat) plays step1–4 (peak −2 dBFS) at gain 0.32–0.62. That gives peaks of about −12 to −6 dBFS — the loudest thing in a 22:50 bedroom whose beds sit at −40. His slippers are by the door. e3c1, e3c2 and e4c1 all give their indoor worlds a barefoot step.
- Severity: low-medium. Confidence: high.
- Fix: `stepSound: () => worldOf(yaw.position.x) === 'R' ? 'k5step' : null`. Until a new take exists, use a byte copy of e3c2's `barestep` under that name.

**L3-6 · `k5glint` was made and is warmed, but never played.**
- Where: e3c5.js:4723 (warmed), 2786 (`glint(i)` shows the sparkle only), 3341 (the yield's glint, sparkle only).
- The children's eyes catching the lamp — after each drink, and in each yield — is silent.
- Severity: low. Confidence: high.
- Fix: `sfxAt('k5glint', 0.22, RISER.x, ALTAR_Z[i])` inside `glint(i)`, and send the yield's glint through `glint(i)`.

**L3-7 · Winding the box: the key turns in silence and the winding sound comes after.**
- Where: e3c5.js:2930–2943. `onProgress` turns the key; `k5wind` plays in the `.then`, after the twist has finished. The cap twist, by contrast, clicks every 30°.
- Severity: low. Fix: a click every 30° in `onProgress`.

**L3-8 · Film M: the chant dies halfway, and the temple hall has no sound of its own.**
- Where: e3c5.js:8756–8757; 6807 (World M only gets a bed in ending D).
- What happens: `k5chantlow` decays to silence 9.2 s into its 14 s file, so it is gone at 12.6. The hall and the little one's face stay on screen until 21.8: their last 12 s are the owner's voice over digital silence.
- Severity: low. Confidence: high (measured envelope).
- Fix: a night bed for World M, plus a longer chant or underscore (`k5templenight`, `k5madeM` below).

**L3-9 · The red one's march does not fall away under his small line.**
- Where: e3c5.js:8829 (`k5red` at 3.0), 8844 (z5b4 at 23.2).
- What happens: the take falls about 24 s in, which lands at 27–29 s in the film. "...They didn't want me any more." (23.2–25.4) is said over the full march. Plan §9.4 says the march falls away under that line, leaving one drum.
- Severity: low. Fix: `sfxFade('k5red')` over T.flop .. T.flop + 1.0, with one soft drum hit, or re-cut the take 4 s shorter.

**L3-10 · The home film's rain and koel are inaudible.**
- Where: e3c5.js:8806–8808.
- What happens: the rain is played at −45 dBFS and both fall inside z5pro3 (14.0–22.8), so the duck takes the rain to −53. After the line it is still 19 dB under the music.
- Severity: low. Fix: move both into the 22.8–28.2 gap and raise the rain to 0.8.

**L3-11 · Ending A: the phone buzzes on Ma's first word.**
- Where: e3c5.js:8968–8969. The second `k5buzz` and `ma5vm` both start at 19.5.
- The phone buzzes while its own voicemail plays. The duck keeps the buzz 14 dB under her, so this is a logic slip, not masking.
- Severity: low. Fix: the second buzz at T.a4 + 1.9.

**L3-12 · A hesitant first yield outlasts its riser.**
- Where: e3c5.js:3319–3335. `k5loosen` (4.0 s) plays once per yield; the fill drains when he lets go.
- A player who holds, lets go and holds again holds on in silence once the 4 s are spent.
- Severity: low. Fix: a hold-gated loop such as `k5heart` (below).

**L3-13 · Watch: two whispers sit at the music's level.**
- Where: main.js:8861–8867 (WHISPER_GAIN 0.55, no compressor).
- z5sob comes out at −31.7 dBFS against −30.1 under it (the music and the water, ducked). z5come comes out at −32.1 against −33.9.
- Both survive through their breath (62% and 70% of their energy above 3 kHz, where neither bed has any), so they are not lost.
- Fix if wanted: dip the music and water a further 4 dB for each take's length.

**L3-14 · Note (engine, opt-in): menu beeps inside the rituals.**
- Where: main.js:4843 (`evResolve` plays `uiconfirm` 0.5 / `uiclick` 0.25); 4669 and 4686 (`uiclick` at the brief and at the start).
- About a dozen menu dings per run: the water, three caps, the incense, the box, the three yields (on the frame each possession begins), and the STAMP, PEEK and COME BACK inside films.
- Fix: an opt-in `quiet` or `doneSound` option on `kit.event`. That is an engine change, so it is Chad's call.

---

## PART B — What is audible, beat by beat

**The core finding: the room is about 10 dB quieter than the rest of episode 3.**
- Counter: shop air (−41.5) + mall (−43.6) ≈ −39.4 dBFS.
- Room at night: −40.6, with the fan at −46.4.
- 3 a.m.: −40.0. Afternoon: −39.4.
- The sibling chapters' main beds: e3c1 −29.0, e3c2 −28.9, e3c4 −26 to −31, e3c3 −35.7.
- Under every line the duck takes e3c5's beds to about −47 dBFS, which is nothing on a phone.
- e3c5 is also the only one of e3c3/e3c4/e3c5 without an ambient one-shot stream. That stream is exactly what Chad's v21.13 complaint ("too quiet") led to.

| # | Beat (length) | Beds now (dBFS) | Music now | Effects now | Voices | Silent stretches / acts with no sound |
|---|---|---|---|---|---|---|
| 1 | Opening film (22.8 s) | the mall played as a one-shot, −31 (to 20.2 s) | none | far shutter −42, grocer's shutter −34, steps ×3 to 14.1, shop bell at 19.9 | z5pro1 5.0–10.3 | 10.3–22.8 no voice and no music; the owner's beckon is silent; 20.2–22.8 nothing |
| 2 | Counter (play, ~3.5 min) | −39.4 (−47 under lines), no one-shots | none until the shy one's story; then the box's tune once (24 s, −25.8) | bundle, figurines ×3, box, wind, faint bells, card, bag | the owner ×9 lines, him ×3 | about 82% unscored; drum turns silently (L3-3); the promise has no sting; the wrap (only the bag sound) and lifting the bag are silent |
| 3 | Film M (24.8 s) | none in World M | chant 3.5–12.6 (−30, −38 under his voice) | — | ow5monk | 12.6–24.8: the hall and the little one's face over silence |
| 4 | Film K (62.6 s) | −39 | theme 3.2–14.5 (−30) | pen | owner's three asks, 14.2–61.4 | 48 s with no music under the chapter's purpose ("never greed… for life… Can or not?") |
| 5 | Home film (35 s) | −40 | theme 14.0–35 (−26) | door, switch, unwrap, figurines, set ×2, flick, catch; rain and koel buried (L3-10) | z5pro2–4 | 0–14 s unscored (the four close-ups; the plan wanted the box's tune) |
| 6 | Offerings (~3–4 min) | −40.6 + fan (−48 under lines) | `k5care` −29, one 38 s loop throughout; box tune 24 s at the end | pour, cap clicks, seal, hiss, cap off, tear, slide, bubbles, plip, bend, foam, set, spark, flick, catch, wave, sand ×3, wai; menu ding after each act | 9 of his lines | concrete footsteps are the loudest thing (L3-5); no sound for: sitting or standing at the desk, crouching, each cup filling, the held flame, the glint, the key turning, the lid, sitting on the mat; small sounds sit 16–26 dB under the music (set −45, catch −46, switch −48) |
| 7 | The question (~17 s) | −39.6 | none (L3-4) | — | z5wonder, z5ask | the chapter's turn over a bare room |
| 8 | Openings ×3 | night bed × sink | held tone −28 (−36 while held) | riser (4 s, once per yield), menu ding | z5loose | no heartbeat (plan §4.3); glint silent |
| 9 | Red one (38.4 s) | −52 | `k5red` 3.0–35.7 (−29.5) | rise, enter, stamp ×3, thud, slurp, slam, rattle, bump, leave | 7 lines | march at full under z5b4 (L3-9); the return to play has no sound |
| 10 | Shy one (38 s) | −52 | `k5shy` 4.6–35 (−29.5) | 11 effects | 7 lines | well scored |
| 11 | Little one + COME BACK (46 s + up to ~35 s) | water −28.4 | `k5lonely` 6.5–33.6 (−23); climb from 39.8 | bells, hair, tick (−50, buried), pulls, surface | 7 lines | 33.6–39.8 unscored; climb lost under the brief (L3-1) |
| 12 | Aftermath (~29 s) | −40 | `k5after` −30, first 15.5 s only | none — the phone waking at 02:47 is silent | z5time, z5felt, z5fasc | from mid-z5felt, unscored |
| 13 | Decision (open-ended) | −40 | none | page sound −28 | — | a near-silent decision |
| 14 | Ending A (58.5 s) | −40 / −36 / −39 | none until the box at 50.8 | flick, enter, koel, doorbell ×2, buzz ×2 | 7 lines | 50.8 s with no music; 27.5–33.0, 35.1–37.1 and 39.2–44.1 nothing above −39 ("the fan" is −43); the box never stops (L3-2) |
| 15 | Ending B (64.5 s) | −40 → −36 | none until the box at 56.7, all of it under z5B6 | 15 screen and phone effects | 6 lines | 56.7 s with no music; 15.6–20.0 and 35.8–40.1 nothing |
| 16 | Ending C (65 s) | → "only the fan" at −43 | none 0–31; box 31–39; box's fate 49.5–62.2 | tape, pin, set ×3, slip ×2, wind ×3, wake, crumple | 9 lines | the greed montage is unscored; "only the fan" reads as nothing |
| 17 | Ending D (109 s) | −40 → temple dawn −37.7 → −36 → −41 | box 21.2–32.3; resolved lullaby 91.6–108.3 | about 30 effects | 8 lines | 0–21.2 unscored; 32.3–91.6 (59 s) with no music through the temple, the dedication, the teaching, the water ceremony and the three lights rising — chapter 4's same scene has music there (`m4music`, `m4coda`), and Chad asked for that coda to be louder at v23.1 |
| 18 | Epilogue (32 s) | shop air −39, even under the black | `k5epi` −26 | — | 4 lines | — |

---

## PART B — Sound plan

**Rules every new sound follows.**
- Names use the `k5` prefix; I checked all of them against every existing name in the repo.
- Duration is set as a generation parameter.
- Music is in C major, 3/4, around 72 bpm, instrumental — as the recipe's other cues are.
- Beds keep 25% or less of their energy under 120 Hz, and are levelled by RMS to −30 dBFS. Music peaks at −3.
- Nothing makes the children frightening (plan §2.4 7).

**Target levels when nobody speaks** (each sits 8 dB lower under a line):
- Beds −34 to −37 dBFS.
- Music under play −29 to −33.
- One-shots −33 to −38.
- Stings −28 to −30, placed between lines.
- Each of these stays at least 20 dB under his voice once ducked.

**Free changes (code and offline processing only):**
- Raise the bed gains:
  - Counter: air 0.11 → 0.2, mall 0.12 → 0.22 (≈ −34).
  - Room: night 0.3 → 0.55, fan 0.1 → 0.22, and 0.15 → 0.32 in the afternoon and harsh-light shots.
  - 3 a.m.: 0.5 → 0.9. Dawn: 0.32 → 0.5. Temple dawn: 0.26 → 0.45.
- The fixes for L3-1 to L3-11.
- Ending D 5.0–21.0: reprise `k5care` at 0.3 while he rebuilds the care, faded into the box's tune.
- Mute World S's beds under the epilogue's black.
- Re-level the small effects (`k5set`, `k5catch`, `k5switch`, `k5bottleout`, `k5tick`, `k5pour`) by RMS instead of peak.
- Processed from `k5lullaby` / fates.py, no generation: `k5boxloop` (counter bed, 20.5 s), `k5boxdown` (gentle 5–6 s run-down at the question's start), and the shorter `k5endA`.
- Note: copying chapter 4's `m4coda` for ending D would be free, but it measures D major against this chapter's C. Generate `k5merit` instead.

**New sounds.** Priority 1 is the music, beds and stings; priority 2 is the effects and ambient pools.

| Name | Kind | Where it plays | Prompt (one sentence) | Length | Level |
|---|---|---|---|---|---|
| k5counter | music bed (loop) | counter, from the cloth opening to the box's tune; fades out over 2 s as the box starts | "Instrumental, C major, 3/4 at 72 bpm: a very sparse, warm chamber underscore for a quiet amulet shop after closing — soft sustained strings and a single khim note every few bars, no melody, no percussion, even level, seamless loop." | 60 s | −31 (0.28) |
| k5vowtheme | music | film K, 14.5–62.6, under the three asks | "Instrumental, C major, 3/4 at 60 bpm: a slow, serious, tender line on low bowed saw u and cello over a held bass note, very quiet, rising slightly over 45 seconds and settling on a soft major chord." | 48 s | −33 |
| k5open | music | opening film, 3.0–22.4 | "Instrumental, C major, 3/4 at 72 bpm: a sparse night cue for an empty mall corridor at closing time — soft khim and a low string pad hinting a three-note lullaby far off, warming as a door opens near the end." | 23 s | −30 |
| k5madeM | music | film M, 3.2–23.4 | "Instrumental, C major: a reverent, slow, warm pad for a candlelit temple hall at night — a low sustained drone and a soft khong wong note every few seconds, very quiet, no percussion." | 22 s | −32 |
| k5home | music | home film, whole (k5theme stays in film K) | "Instrumental, C major, 3/4 at 72 bpm: a lone music box plays a simple lullaby phrase, then soft khim and warm strings join and grow through a time-lapse of weeks, thinning back to the music box alone on an unresolved note." | 36 s | −27 |
| k5care2 | music bed (loop) | offerings, from the incense on (crossfade from k5care) | "Instrumental, C major, 3/4 at 72 bpm: warm, low, gentle khim and soft strings playing a simple lullaby phrase with a new counter-melody, steady level, seamless loop." | 40 s | −29 (0.22) |
| k5decide | music bed (loop) | from z5fasc through the decision; fades over 1 s into each ending | "Instrumental, C major, 3/4 at 60 bpm: a hushed, unresolved held chord (open fifth, no third) on soft strings with one faint music-box note every eight seconds, still and contemplative, seamless loop." | 40 s | −33 |
| k5climbloop | music bed (loop) | COME BACK, from `onBegin`; level follows his rise (L3-1) | "Instrumental, C major: a slow rising swell of strings and khlui flute toward light with tiny bells in it, building steadily, seamless loop." | 24 s | −32 → −27 |
| k5driftA | music | ending A, 3.5–50.0 | "Instrumental, C major, 3/4 at 54 bpm: a hollow, sparse cue of time slipping away — a music-box phrase played slowly with long silences over a soft low string drone that thins, never scary." | 48 s | −31 |
| k5screens | music | ending B, 15.0–50.5 | "Instrumental, A minor, 3/4 at 72 bpm: an uneasy, quiet khim tremolo with slowly thickening soft strings building tension, never loud, ending on a held unresolved note." | 36 s | −33 |
| k5greed | music | ending C, 9.0–31.0, cut dead into the overwound box | "Instrumental, C major, 72 bpm accelerating to about 100: a bright, insistent khim ostinato that keeps speeding up and gets harsher and more crowded, then stops dead." | 24 s | −30 |
| k5merit | music | ending D, 32.0–85.5; its swell lands on the three lights (80.9) | "Instrumental, C major, 3/4 at 66 bpm: a warm, serene cue for a Thai temple at first light — soft strings, a khim playing a gentle lullaby phrase, low khong wong notes — building slowly to a quiet radiant swell and settling." | 54 s | −32 |
| k5reveal | sting | counter, as the cloth opens | "A gentle, warm reveal: a soft rising celesta and khim arpeggio in C major with a faint shimmer of tiny bells." | 2 s | −30 |
| k5vow | sting | the end of "Every day. I promise." | "A warm, quiet sting: one Thai bowl bell struck softly over a low string chord in C major that blooms and fades." | 4 s | −29 |
| k5given | sting | each drink set down, played at rate 1.0 / 1.26 / 1.5 (C, E, G) | "A single soft khim note in C with a gentle bell overtone, warm and short." | 1.5 s | −31 |
| k5return | sting | as the black lifts after each possession | "A soft reverse swell resolving into a quiet room, like coming back to yourself." | 2.5 s | −31 |
| k5void | sting | ending C at 37.0 ("nothing answers") | "A sudden drop into near-silence: a soft low air-pressure thump and a faint high ringing tone that fades away." | 3 s | −30 |
| k5shake | sting | ending B at 35.0 (the stranger's message) | "A hollow, breath-like dissonant swell that rises and stops, uneasy." | 3 s | −31 |
| k5roomnight | bed | his room at night (replaces k5nightbed, which is 97% crickets; the plan's §9.3 fridge and traffic were lost) | "An HDB bedroom at night with the window open: crickets outside, an aircon's soft airy whir, a fridge humming faintly through the closed door, very distant traffic, steady with no events, seamless loop." | 28 s | −35 (0.55) |
| k5shopnight | bed | counter (replaces the copied daytime shop air) | "An amulet shop in an old mall after closing: an air-conditioner's steady breath, a fluorescent tube's faint hum, a wall clock ticking softly, the empty mall's hush beyond the glass, no voices, seamless loop." | 28 s | −36 |
| k5templenight | bed | World M in film M | "A Thai temple hall at night with its shutters open: crickets and night insects, a gecko's chirp, candle flames fluttering faintly, a soft wind chime from the eaves, no voices, seamless loop." | 28 s | −38 |
| k5court | bed | ending D's temple courtyard and hall at dawn | "A Thai temple courtyard at first light: sparrows and mynas, a broom sweeping stone, a soft wind chime, a monk chanting very far off, seamless loop." | 28 s | −37 |
| k5day | bed | A's and C's afternoons, the home film's afternoons | "A grey weekday afternoon in an HDB bedroom with the window shut: distant traffic, a far school bell, a construction drill very far off, a ceiling fan turning, seamless loop." | 28 s | −37 |
| k5heart | bed (gated) | the yields, rising with the hold (plan §4.3's missing heartbeat) | "A soft, slow, warm heartbeat at about 54 beats per minute, close and intimate, with enough upper harmonics to be heard on a phone speaker, seamless loop." | 8 s | 0 → −34 |
| k5step | effect | his footfall in the room, via `stepSound` (L3-5) | "Soft bare footsteps on a smooth vinyl-tiled HDB bedroom floor at night, unhurried, six separate steps with a faint skin squeak, no echo." | 4.5 s | peaks about −16 |
| k5cup | effect | each cup as it fills (×3) | "A short pour of water into a small porcelain cup, its pitch rising as it fills, with a soft last drip." | 1 s | −34 |
| k5chair / k5chairup | effect | sitting down at / standing up from the desk | "An office chair's gas lift sighing and its seat creaking as someone sits down at a desk." / "An office chair rolling back on a hard floor as someone stands up." | 1 s / 0.8 s | −35 |
| k5kneel | effect | crouching before each child | "Knees and a cotton sleeve settling onto a smooth tiled floor, a soft rustle." | 0.6 s | −36 |
| k5flame | effect (hold-gated) | the held lighter flame while the sticks catch | "A disposable lighter's small flame burning with incense tips crackling softly in it, steady." | 2 s | −34 |
| k5key / k5lid | effect | the box key, every 30° (L3-7) / the lid lifting (counter and room) | "One small click of a music box's brass wind-up key." / "A small hinged wooden box lid lifting with a soft creak." | 0.15 s / 0.7 s | −33 |
| k5mat | effect | sitting down on the mat | "Someone sitting down cross-legged on a woven rattan mat, the reeds creaking softly." | 1 s | −35 |
| k5wrap / k5baglift | effect | wrapping the three in the black / taking the bag | "Red cotton cloth folded over three small figures and tied in a knot, soft rustling." / "A paper bag with small glass bottles and a wooden box inside lifted off a glass counter, a soft clink and paper crinkle." | 1.5 s / 0.8 s | −33 |
| k5phone | effect | the phone waking on the floor at 02:47 | "A phone lying on a floor waking up: one short soft haptic buzz on tiles and a faint glass tick." | 0.8 s | −34 |
| k5fly | effect | ending A at 40.0 (the stale drinks) | "A single housefly buzzing on and off near stale drinks, close." | 4 s | −36 |
| k5templebell | effect | layered over k5tbell (which has 70% of its energy under 120 Hz and nothing above 500 Hz — a thud on a phone) | "A Thai temple bell struck once with a bright, clear ring and a long shimmering decay." | 5 s | −30 |
| Room pool: k5gecko, k5moto, k5dog, k5liftmotor, k5gate, k5fridge, k5drip, k5bus (3 a.m. only) | ambient one-shots | his room in play, every 9–20 s from a seeded stream (e3c3's `ambTick`), never under a line, panned to where they are; at 3 a.m. only gecko, drip, dog, fridge, bus | e.g. "A house gecko chirping a few quick clicks on a wall at night, close" · "A motorcycle passing on the road far below an apartment block at night, rising and fading" · "A dog barking twice far away across a housing estate at night" · "A neighbour's metal gate grille sliding shut and latching down a corridor, muffled through a door" | 1.2–6 s each | −34 to −38 |
| Mall pool: k5guard, k5liftding, k5mop, k5walkie, k5escal (plus the existing k5shutter) | ambient one-shots | counter, every 10–20 s | e.g. "A security guard's keys jingling with slow footsteps passing far down an empty mall corridor at night" · "A shopping-mall lift arriving far away with a soft two-tone chime and its doors sliding" | 1.5–4 s each | −36 to −40 |

**How the music hands over, start to finish:**
1. `k5open` → the chapter card.
2. `k5counter` → the box's tune, looping (`k5boxloop`) → halved under `k5vowtheme` in film K → `k5vow`.
3. `k5home`.
4. `k5care` → `k5care2` → the box's tune → `k5boxdown` → `k5night` under the question.
5. Each child's own motif → `k5climbloop` → `k5after` → `k5decide`.
6. The ending's underscore (A/B/C/D) → the box's fate for that ending → `k5epi`.

**Credit bill, roughly:** 13 music cues at 2–4 takes each, 6 beds at 2 takes, and about 30 effects at 2 takes. Three items are processed with no credits.

**Already queued by L6-9:** the re-take of z5C, to go with this sound work.
