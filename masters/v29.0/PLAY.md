# v29.0 · episode 5 chapter 1 · THE PLAY (PLAY, M6): what the films and the probes read from it

The source is `masters/v29.0/parts/c_play.js` (the play), `d_play.js` (the frame and the stage), `c_cast.js` (the shared
cast: Grace and Marcus are their own bodies now) and the play's numbers in `b_world.js` (STATION) and `a_head.js` (the words,
the beds, Spirit Vision's sounds). Units metres, y up; the lens at a yaw of 0 looks -z. Every name below is in build()'s
scope, so a film's picture code (c_yfilm.js, c_yfilm2.js) reads it directly; the stage also hands most of them on
(`stage.plan`, `stage.chant`, `stage.beds`, `stage.films.cast`). FILMS-1 and FILMS-2 read this file: a change to any name
here is written here and committed at once.

## 1 · THE CHANT ACROSS THE KEEPSAKE, THE BREAKING AND THE CORD (FILMS-1, this is the contract)

Grandmaster Pho's Ratana (`ph51ratana`, take c, 44.36 s; six verses on its breaths: 0.06-9.58, 10.0-15.34, 15.74-24.02,
24.46-29.8, 30.18-38.52, 38.92-44.24) is ONE chant from the keepsake's 32.0 s to the cord's 8.0 s, never restarted and
never a seam. Why it is the PLAY's and not a film's cue: the engine plays a sample only from its start (`snd`), and it
cuts every cue a film fired when the film ends (`stopCineVoices`, 0.3 s ramp), so a chant cued by the keepsake film would
die as the event opened. So the chant is a WORLD sound of the play (`worldSfx`: the effects path, never a voice bus; it
outlives a film's end; the title's `stopWorldSfx` takes it down), kept by `RATANA` (c_play.js), on the stage as
`stage.chant`:

| call | who | what |
|---|---|---|
| `s.chant.begin()` | **FILMS-1, in the keepsake film, a `step` at 32.0** | the chant from its start, verse 1, its caption; never begins twice (a skip that runs the step again does nothing) |
| `s.chant.release(n)` | PLAY | n more verses may be sung (each surge of the event) |
| `s.chant.finish(at)` | PLAY | the last verse `at` s from now (the event's end: 2.7 s, so its last word lands at the cord's 8.0 s) |
| `s.chant.swell(on)` | PLAY | its level up on a surge, down after (its own gain, never over 1) |
| `s.chant.state()` | probes | `{ on, done, pos, rate, released, verse, holdAt, sounding }` |
| `s.chant.stop()` | PLAY | ramped out (a phase jumped to, a reset) |

HOW IT CARRIES: Grandmaster Pho DRAWS BREATH AND WAITS between verses. The take's playhead is held still in the silence
between two verses (the source's playback rate set to 0 on the audio clock at the breath's middle, and to 1 when the next
verse is let go), so nothing is cut or played twice. Verse 1 is let go at `begin`; verses 2 to 5 one at each surge's start
(and one more while that surge has 4 s left and there are more verses than surges to come; a surge taken again takes one);
verse 6 by `finish`. Each verse's caption (CHANTS.ph51ratana: the Pali over its meaning) is laid as its verse begins, on
wall time, so it works muted (v21.31). WHAT FILMS-1 DOES: (1) in the keepsake, `step(32.0, () => s.chant && s.chant.begin())`
and NO `sfx(.., 'ph51ratana')` (a cue would be a second copy and would be cut at the film's end); (2) lay no caption of the
chant (the keeper lays them); (3) in the cord, nothing: the last verse is let go by the play 2.7 s before its film begins,
so its last word ends at about 8.0 s of the cord (the plan's "8.0 the chant's last word hangs") whatever the film does,
and the take ends there by itself. If the keepsake film is skipped before 32.0 the step still runs (a skip runs the passed
steps), and the chant begins as the event opens. A Continue into the breaking begins it at verse 1 itself.

## 2 · Where each phase puts him (play's constants: a film that hands to a phase ends on them)

| phase | where | the look |
|---|---|---|
| `room` (the opening's end, the cord's start) | kneeling at `STATION.room.at` = (1.45, 1.9), the eye `KNEEL_EYE` 1.12 | play's first look: yaw **0.55**, pitch **-0.5** on a phone (-0.44 a desktop; 27 Nov, from -0.6/-0.5: Grace's face was cut by the screen's top): the cloth, the jug at his knee and Grace (`stage.plan.KNEEL.startYaw`, `.pitch`). The look is clamped yaw -0.15 ± 1.2 (Grace on his right to the glass on his left), pitch -1.05..0.55 |
| `breaking` (the keepsake's end) | the same place, kneeling | yaw `STATION.room.at.ry` (0.41), pitch **-0.95** (down into the bowl in his hands), the lens **50 / 44** (phone / desk); the bowl held (below); Spirit Vision OPEN and held |
| `night` (home's end) | LYING in bed at `STATION.night.bed` = (HX + 7.465, 0.8), eye y **0.82**, yaw **0.8**, pitch **0.12** | he presses "Get up", rises over 1.4 s to `STATION.night.at` = (306.7, -0.48), yaw 2.17 |
| `ask` (the decision; every ending begins here) | standing at `STATION.ask.at` = (300.4, 0.65), yaw 0.3, his phone in his RIGHT hand (`kit.hold`, `stage.plan.PHONEHELD`), its screen 3:03 and "Grandmaster Pho", seen 2.2 s before the decision opens over the lower half | the pressure stands at what it was (0.35 to 0.75), no waves |

THE BOWL IN HIS HANDS (the event; the keepsake ends on it, the cord begins on it): a copy of `w4bigbowl` (its brass and its
poured water by `bowlLook`) held in his LEFT hand by `kit.hold(.., { hand: 'left', pos: BOWLHELD.pos, rot: BOWLHELD.rot })` at
the scale `BOWLHELD.s`, and laid every frame on his left palm, turned toward the lens, by the films' own
`FILMSAPI.helpers.bowlInHands` (d_play.js, after the play's frame: one function for the keepsake's bowl and the event's), the hands in the library's `bowl` pose (`kit.handPose("bowl", 1)`); the bowl on the cloth (`things.holyBowl`)
is hidden while it is held and shown again when it is let go (the event's end). A film draws its own bowl (a film lets
go of what play holds): `stage.plan.BOWLHELD`.

THE BOWL'S ONE SIZE (27 Nov, MEASURED in the breaking): 0.62 of `w4bigbowl`'s own size everywhere, `stage.plan.BOWL_S`
(b_world.js): **0.198 m across**. In his hands at 0.62 it measured 0.198 m in the hands' pass (drawn at the lens's own angle,
its rig at scale 1, 0.42 m from the eye), and on the cloth it was the file's 0.32 m: two sizes. The cloth's bowl is now
`BOWL_S` too, and BOWLHELD.s reads it. **FILMS-1 and FILMS-2: every bowl a film draws, on the cloth, in his hands or set back
after the pour, at `S.plan.BOWL_S`.**

THE BOWL'S LOOK (27 Nov, PLAY: the bowl on the cloth showed tan water and petals before "Pour water into the bowl."):
`w4bigbowl` is one mesh with its water and petals in it, and a flat warm tint turned the water tan. The play lays its paint
by place instead: `stage.plan.bowlLook(model, { empty })` measures the model's own water level and ring as it lands and gives
its materials a shader that tints only the METAL brass (the world's 0xffd9a0) and leaves the water and petals their own
colours; `empty` (a uniform `{ value }`, 1 empty, 0 poured; the cloth's bowl shares the play's, eased by the pour) paints the
inside dark brass instead. The held copy in the breaking is poured (`{ empty: { value: 0 } }`). **FILMS-1: the keepsake's
`handBowl` (and any bowl a film draws) should call `S.plan.bowlLook(m, { empty: { value: 0 } })` in its `done` in place of its
colour multiply, so the film's last picture and the event's first are one bowl** (call it on a material not yet multiplied:
it sets the colour back to white and lays the tint in the shader).

THE PEOPLE AT EACH PHASE'S START (27 Nov): every phase begins with its people in the play's own rest whatever a film left
(`peopleRest`): the room, the three seated; the breaking, Grandmaster Pho and Grace seated and MARCUS STANDING behind the sofa
at her right shoulder (`STATION.breaking.marcus`, x 0.14, z -0.85, ry 0.12, his `Idle_3`: where the keepsake leaves him as of
c433770, `KEEP1.mkStand` + (0.02, 0.17)), so a Continue into the breaking lands as play does. **FILMS-1: the cord puts him
at `KEEP1.mkStand` itself (0.12, -1.02), 0.17 m behind where the keepsake left him: a jump at the cord's first frame.** **FILMS-1: the opening ends with Grace still walking to the sofa** (her walk
is about 5 s from T.sofa, her sitting 3 s more: she is seated at about T.inn + 18, the film ends at T.inn + 15.7); the play now
seats her under the film's black, but the film's own last frames should have her on the sofa (v5.25: a film ends with its
people where play keeps them).

THE BOTTLE ON HIS ALTAR (27 Nov): `things.bottle` is shown by the play whenever the night or the decision is applied (a
Continue plays no film of home), hidden by a replay; the film of home still shows it at its end as before.

WHAT PLAY LEAVES ON for a film to take over: at the room's end Spirit Vision is closed; at the breaking's end the bowl is
let go (back on the cloth), the lens and Spirit Vision given back, the chant's last verse coming; at the night's end the
pressure is HELD on screen under the decision (kit.press k as it was, no waves): FILMS-2's endings begin with `kit.press`
standing at `stage.info().story.pressure` (a film shows the press only with `cine: true`).

## 3 · The people in play (c_cast.js)

| who | body | seat | rest |
|---|---|---|---|
| `cast.pho` | `pho` (look D), unchanged | his cushion (0.12), cross-legged | as episode 4 chapter 5; in play he looks at Grace, at what was looked at, and at the lens when he speaks; between surges `Sit_Cheer_with_Left_Hand` 0.2..1.7 s (the fan's flick) |
| `cast.grace` | `p51grace` (first throw), full `p51graceh` within 2.2 m | the sofa, `GRACE_SEAT` 0.51 (seatDown by her skin) | `gsofa` window 0.25..1.85 s there and back in 7.5 s; stands by `rise` (0 to its end over 2.4 s) and sits by it played back |
| `cast.marcus` | `p51marcus`, full `p51marcush` (CAST-3's no-glasses body drops in under the same keys) | the rattan chair, `MARCUS_SEAT` 0.42 | `Sitting_Answering_Questions` window 0.2..1.2 s in 9 s |

HER FEET WHEN SHE STANDS (27 Nov, measured): `rise` ended on tiptoe (ankles 0.19 m up, toes 0.03: held 7 cm off the floor,
heels in the air). c_cast.js `riseFeetFlat` lays the take's foot and toe turns, in memory, toward her Idle_3's by the rise
curve's own k (a seated foot is the take's) and grounds the rise again: the clip itself, so a film that stands her up or sits
her down with `rise` wears it too.

THE WATER IN THE JUG (27 Nov): `w51jug` is one clear shell with nothing in it; the play draws the water inside it (the jug's
own shape, 0.7 full, lowered to 0.3 by the pour), a child of `things.jug`, so it goes wherever the jug goes and hides with it.

Her reflection: the play sets `WORLD.reflect.set('grace', { face })` every frame in her room: at rest half turned to her door,
all the way when she stands (a beat before her). A film that poses her reflection sets it on its own clock; when it ends the
play's frame lays it again.

## 4 · What the play draws (c_play.js `fx`)

The water in the cloth's bowl (poured by the first order); her phone (`w51phone`) on the sofa beside her, its screen
lighting every 20 s; in Spirit Vision only (ctx.spirit): the red line from her chest to under her door (16 lengths, a pulse
running to the door, taut when she stands, frayed by each flick), the packet's knot; at three o'clock his 13 footsteps
(FILMPLACE.steps) and six threads from under his front door and through his glass. `fx.fray` (0..1) and `fx.taut` are
the play's; a film may read them.

## 5 · The beds (a_head.js `ambience.beds`, eased by c_play.js `bedsTick`)

u51bflat, u51bnight, u51bthree, u51m2room, u51m3pull, u51m6a, u51m6b, u51m6c, u51lap, u51tinnitus, u51breath, u51threads,
each declared at 0. In play the mixer sets them by phase and beat; IN A FILM every one is 0 unless the film writes
`s.beds.film = { flat, night, three, m2, m3, m6a, m6b, m6c, lap, tin, brth, threads }` (levels 0..1; null gives them back):
a film cues its own music. M4 (u51m4break) is not played by the play: the chant carries the event (said in the report).

## 6 · Saves

`room:<w,l,p,g,h,k,v>`, `breaking:`, `night:<u,f>`, `ask:`. A Continue lands at its phase's start (the breaking's brief
again; the night in bed, or standing if `u`).

## 7 · The probes' handles

`stage.dbg`: `cast`, `people`, `bowl` (the bowl's measured water: `look` { cx, cz, yW, rW in the model's own units }, x, y, z,
r in the world), `fn` (the cast machinery: `span`, `rest`, `take`, `pose`, `hold`, `put`, `gaze`, for a lab to pose a body).
tools/probes/e5c1play.mjs (play by real input), e5c1lab.mjs (views; PRE, PRE2 and VIEWS2), e5c1save.mjs (Continue from every
phase, a same-sitting Continue, a replay by reset and one by the chapter selector).

## 8 · Clipping, measured (Chad's R15, "Also check for all kinds of clipping": the PLAY phases)

| what | how | read | done |
|---|---|---|---|
| things and bodies through one another, the room | tools/probes/clipscan.mjs PHASE=room (75735c0, then d3f65f4) | her bag through the sofa (585, its back in the back cushion), her phone sunk into the cushion and under her hand (305), Grace's calves in the sofa's front, Marcus's calves in the rattan chair's front (1,046 from 0.09 to 0.42 m up) | bag and phone set on the cushion as read under their footprints (`sofaRest`), the bag 5 cm off the back cushion, the phone 6 cm clear of her hand; the feet of both laid forward (GRACE_FEET 0.32, MARCUS_FEET 0.2). Left, read as a sitter resting: Grace against the sofa 1,031 (her seat and back in its cushions, 0.31 to 0.78 m up), Marcus against his chair 447 (0.35 to 0.42 m: his seat in its cushion) |
| a limb in a solid or another body, the room | tools/probes/limbclip.js in the page (lab, PRE) | pho, p51grace, p51marcus read; all three seated (the solids check leaves a sitter out); no two bodies in each other | nothing to fix |
| her feet when she stands | lab: her ankles and toes over a stand-up | the rise stood her on tiptoe, 7 cm off the floor | the rise's feet laid flat (`riseFeetFlat`): ankles 0.116, toes 0.019 m at its end (her Idle_3: 0.125, 0.028) |
| the held bowl, its size | lab, breaking: its box in the hands' pass against the cloth's | 0.198 m in his hands, 0.32 on the cloth | one size, `BOWL_S` 0.62 |
