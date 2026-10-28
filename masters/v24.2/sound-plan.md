# v24.2/v24.3 · episode 3 chapter 5's sound — the measured audit and the plan

Chad, 28 Oct 2026: "there is a huge lack of music, ambient sounds, sfx, stings or other sounds in ep3 chp5. It needs
to be buffed up more." The L3 lens measured every beat (levels = per-channel RMS from ffmpeg volumedetect × the gain
the code plays at; his voice off its bus ≈ −13 dBFS, the cast flat at −16; everything else ducks to 0.4 (−8 dB)
whenever anyone speaks). Scripts: scratchpad walk/walk.mjs and meas/*.py (session-local).

## The core finding
THE ROOM IS ~10 dB QUIETER THAN THE REST OF EPISODE 3: the counter's beds ≈ −39.4 dBFS, the room at night −40.6 (fan
−46.4), 3 a.m. −40.0, afternoon −39.4 — against e3c1 −29.0, e3c2 −28.9, e3c4 −26…−31, e3c3 −35.7. Under every line
the duck takes them to ≈ −47 (nothing on a phone). And e3c5 is the only one of e3c3/e3c4/e3c5 with NO ambient one-shot
stream (the thing v21.13's "too quiet" fixed in e3c3).

## Beat map (what is audible now)
| # | beat | beds | music | effects | silent / unsounded |
|---|---|---|---|---|---|
| 1 | opening film 22.8 s | mall one-shot −31 to 20.2 | none | shutters, steps, shop bell | 10.3–22.8 no voice/music; beckon silent |
| 2 | counter (play ~3.5 min) | −39.4 (−47 under lines), no one-shots | none until the shy one's story; box tune once (24 s) | bundle, figures, box, wind, card, bag | ~82% unscored; drum turns silently after the tune (L3-3); promise no sting; wrap/bag lift silent |
| 3 | film M 24.8 s | none in World M | chant 3.5–12.6 | — | 12.6–24.8 the hall over silence |
| 4 | film K 62.6 s | −39 | theme 3.2–14.5 | pen | 48 s no music under the chapter's purpose |
| 5 | home film 35 s | −40 | theme 14.0–35 | door, switch, unwrap…; rain/koel buried (L3-10) | 0–14 unscored |
| 6 | offerings 3–4 min | −40.6 + fan | k5care −29 one 38 s loop | pour, cap clicks, seal, hiss … | concrete footsteps loudest (L3-5); no sound: sit/stand at desk, crouch, cups filling, held flame, glint, key, lid, mat; small effects 16–26 dB under the music |
| 7 | the question ~17 s | −39.6 | none (L3-4) | — | the chapter's turn over a bare room |
| 8 | openings ×3 | night × sink | held tone −28 | riser once per yield | no heartbeat; glint silent |
| 9 | red one 38.4 s | −52 | k5red | 10 fx | march at full under z5b4 (L3-9) |
| 10 | shy one 38 s | −52 | k5shy | 11 fx | well scored |
| 11 | little one + COME BACK | water −28.4 | k5lonely 6.5–33.6; climb | bells, hair, tick, pulls | 33.6–39.8 unscored; climb lost under the brief (L3-1) |
| 12 | aftermath ~29 s | −40 | k5after first 15.5 s | none (phone waking silent) | unscored from mid-z5felt |
| 13 | decision | −40 | none | page | near-silent |
| 14 | ending A 58.5 s | −40/−36/−39 | none until box 50.8 | flick, koel, doorbell, buzz | 50.8 s no music; gaps 27.5–33, 35.1–37.1, 39.2–44.1; box never stops (L3-2) |
| 15 | ending B 64.5 s | −40→−36 | none until box 56.7 | 15 fx | 56.7 s no music |
| 16 | ending C 65 s | "only the fan" −43 | none 0–31; box 31–39; fate 49.5–62.2 | tape, pin, set… | greed montage unscored |
| 17 | ending D 109 s | −40→−37.7→−36→−41 | box 21.2–32.3; lullaby 91.6–108.3 | ~30 fx | 0–21.2 and 32.3–91.6 (59 s) unscored — the temple, the dedication, the water, the three lights |
| 18 | epilogue 32 s | shop air under the black | k5epi | — | — |

## Bugs (Part A)
L3-1 COME BACK's k5climb fired before the brief and ran out under it / on a slow climb · L3-2 ending A's box never stops
(faded at 0.6×) · L3-3 the box drum turns with no tune (counter after 24 s; room through the openings) · L3-4 the
question's held tone comes in after the question · L3-5 bedroom footsteps on concrete (no stepSound) · L3-6 k5glint
warmed, never played · L3-7 the box key turns silently, the wind after · L3-8 film M's chant dies at 12.6 · L3-9 the
red one's march does not fall away under z5b4 · L3-10 the home film's rain and koel buried · L3-11 ending A's buzz on
Ma's first word · L3-12 a hesitant yield outlasts its riser · L3-13 (watch) two whispers at the music's level ·
L3-14 (engine, Chad's call) menu dings inside the rituals.

## The plan
Rules: names k5…; duration as a generation PARAMETER (v9.2); music C major 3/4 ~72 bpm instrumental; beds ≤ 25% under
120 Hz, levelled by RMS to −30 dBFS; music peaks −3; nothing makes the children frightening (plan §2.4 7).
Targets when nobody speaks: beds −34…−37, music under play −29…−33, one-shots −33…−38, stings −28…−30 (between lines).

FREE: bed gains up (counter air 0.11→0.2, mall 0.12→0.22; room night 0.3→0.55, fan 0.1→0.22 / 0.15→0.32; 3 a.m.
0.5→0.9; dawn 0.32→0.5; temple dawn 0.26→0.45); L3-1…L3-11; ending D 5–21 reprise k5care; World S beds muted under the
epilogue's black; small effects re-levelled by RMS; from k5lullaby (no credits): k5boxloop, k5boxdown, a shorter k5endA.

NEW (priority 1 music/beds/stings, 2 effects/pools): k5counter (bed loop 60 s), k5vowtheme (film K 48 s), k5open
(opening film 23 s), k5madeM (film M 22 s), k5home (home film 36 s), k5care2 (offerings loop 40 s), k5decide (decision
loop 40 s), k5climbloop (COME BACK loop 24 s), k5driftA (A 48 s), k5screens (B 36 s), k5greed (C 24 s), k5merit
(D 54 s); stings k5reveal, k5vow, k5given (pitched C/E/G), k5return, k5void, k5shake; beds k5roomnight, k5shopnight,
k5templenight, k5court, k5day, k5heart (yield-gated); effects k5step, k5cup, k5chair/k5chairup, k5kneel, k5flame,
k5key/k5lid, k5mat, k5wrap/k5baglift, k5phone, k5fly, k5templebell; pools — room: k5gecko k5moto k5dog k5liftmotor
k5gate k5fridge k5drip k5bus; mall: k5guard k5liftding k5mop k5walkie k5escal.

Music hand-offs: k5open → card; k5counter → box tune (k5boxloop) → halved under k5vowtheme → k5vow; k5home; k5care →
k5care2 → box tune → k5boxdown → k5night under the question; each child's motif → k5climbloop → k5after → k5decide;
each ending's underscore → the box's fate → k5epi.
