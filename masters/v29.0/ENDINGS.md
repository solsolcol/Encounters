# v29.0 · episode 5 chapter 1 · THE FILMS, SECOND HALF (FILMS-2, M7: CP7.5 to CP7.7 and their CP7.8)

The barrier (with CLOSE THE CIRCLE inside it), the four endings and the dawn: the plan's 9.6 to 9.11, shot by shot. The
pictures are `masters/v29.0/parts/c_yfilm2.js` (END2, reached as `stage.films.ends2`: each frame a pure function of the
ending's clock, v6.4), the clocks and the cues `masters/v29.0/parts/y_endings.js` (EN2: each ending's own beginning, then
THE BARRIER from `b0`, then THE DAWN from `d0`, all on one clock built by tl() from SECS, so a measured take moves
everything after it: v5.15). The four scenes are ONE function with its letter (`mkEnding2`), so the engine's reading of
any scene's source finds every cue of all four (main.js cuesOf, the warm scan). This file is the record: what each shot
is and why, every number's reason, what is measured, what is still open. Read with FILMS.md (FILMS-1's half and its
FILMSAPI) and PLAY.md (the play's side of every hand-off).

## 0 · Where each ending begins and what it is given

- It begins where the decision leaves him (PLAY.md 2): standing at his dining table (`STATION.ask.at`, 300.4, 0.65, yaw
  0.3), his phone in his right hand, the pressure held on the picture at the play's value (0.35 to 0.75). The first key of
  every ending is the decision's own view (`f2From(s)`, the engine's snapshot): nothing jumps.
- The play gives back at the ending's first frame its hold on the sound, the heart and the lens (c_play.js fxTick,
  `night5.handed`); the ending lays its own pressure (`kit.press(k, { cine: true })`) from the play's own value
  (`stage.info().story.pressure`, `F2.p0`), its own beds (`stage.beds.film`: the play's night beds as they would stand at
  that pressure, `f2NightBeds`), its own Spirit Vision (held by the film's clock: `kit.vision({ r })`).
- The four lines under the cards are the engine's (`sayPrefix` 'zv51': zv51A to zv51D, the plan's 9.10); the lesson card is
  DATA.core (the plan's 9.11, its default: line 1 with line 4 under it).

## 1 · The four endings: each a whole story (v21.30)

Each tells what he does, how it is answered, what it costs or gives him, and what he understands; four KINDS of answer,
four scenes (the plan's 9.6, 9.8). The lines are the plan's (§10), voiced; none is new.

| | what he does | how it is answered | what it costs or gives | what he understands (dawn) |
|---|---|---|---|---|
| A (best) | calls at once: his thumb on the name, two rings | "I'm here. Tell me what you feel." / "Listen to me, and do exactly what I say." | the night is shortest; the barrier holds | "You called at once. That is the first protection: knowing when something is more than you." |
| B (good) | lays the phone face down ("Let him sleep."), sits with his palms together; two waves, his sight forced open on the threads at his feet; 3:41 on the oven; on the floor against the sofa, a slit of picture; crawls to the phone | "How long has it been like this?" "Forty minutes. Why did you wait?" ... "You held the water for her. Now let me hold it for you." | forty minutes; the threads already round him, the gold pushes harder | "A student who won't wake his teacher is protecting the wrong person." |
| C (bad) | "It's a migraine.": the drawer, the pills, the tap; the sofa, a cushion over his eyes; a wave, the glass ticking; his sight opens by itself on his red footsteps ending at the sofa and the threads at his feet | 3:22: "Tell me." ... "This is not a headache. A headache does not follow you home." | the pills did nothing; the threads already at his feet | "Don't believe too fast. Don't dismiss too fast either. Look first. Then ask." |
| D (worst) | opens Spirit Vision on purpose, follows the threads to his balcony door, slides it open; one thread turns like a head and lunges: a band of red light round his left wrist, the picture crushed to a slit; tears himself back in, on his knees | "I'm here." "It's outside. It's looking for me." "Then stop looking for it. Sit down. Now." | the band burned off by the gold (a white flash, a hiss); a red mark left on his wrist | his teacher sees the mark: "You went to a stranger's door and knocked. It answered." ... "Curiosity is not courage." and ties the white thread over it |

Their clocks (y_endings.js EN2, measured lines; seconds): A 148.4 (own 17.1, barrier 81.2, dawn 50.1); B 169.0 (38.5, 82.4,
48.1); C 164.7 (33.0, 81.2, 50.5); D 161.3 (27.1, 83.0, 51.2). Longer than the plan's estimates (100 to 130 s): the
plan's barrier is 56 s with a 14 s chant, and the Jinapañjara as voiced is 36.6 s (its four verses on the take's breaths).

## 2 · The barrier (the plan's 9.7, the case file's; in every ending)

| marks (from b0) | shot | why |
|---|---|---|
| 0.35, 7.56 | his teacher's two lines on the speaker ("The one who made the spell felt it break..." / "Get the white thread from your bag..."), the view the ending left him in | the phone before him, low, its screen lit (the call's seconds counting: `f2Screen`) |
| walk0 = x2 + 2.2 | he goes to his bag by his front door (`F2PATH[k]`: from where each ending left him, round his table, behind his sofa along the wall; the sofa 2.1 m at x HX-3.35..-1.25, z -1.4..-0.5 passed behind, the table and the counter cleared by half a metre); his phone lowered out of the frame (the call stays open) | about 0.8 m a second, a man in pain; `WALK2[k].rise` the getting up first where the ending had him down |
| bag, zip, spool | crouched at his bag (eye 1.0 m): its zip, his right hand into it, the spool of white thread out (the hands' `reach`, the spool in it: `w51threadreel`) | his own bag, `e4bag`, where he keeps the thread for his teacher (the plan's 4.5) |
| spool + 0.9 | up facing along the wall (round his sofa's end the way he goes), past his altar, to the middle of the room (`F2PATH.on`) | risen facing the room, the sofa's back stood a hand from the lens and filled the frame (photographed, build 1: fixed) |
| sit0, circle | he sits facing his glass (eye 0.82 at the circle's middle), the phone on the floor before him on the speaker | the circle: (HX-2.2, 1.0), r 0.75 (WORLD) |
| circle (eventWait) | CLOSE THE CIRCLE: the film's clock stands still until it is laid; the thread drawn on the floor round him by the event's own progress (eased on the wall: a finger's stop never jerks it), his head following it (right as it goes to his right, front while it passes behind him, left as it comes round: within 60 degrees), the spool in his right hand then his left; "Close it." said once at 0.78 of the way; the spark where its ends meet | the event's kind is craft's twist (`circleOpts`: briefed with START, its own picture `circle`, never failed) |
| after, x4 | "Good. Now stay inside. Whatever you hear, stay inside." his eye lifting to level | |
| chant | the Jinapañjara through the phone (`ph51jinatel`), its captions on its four verses' breaths (`kit.captions` on the wall: muted it works, v21.31); the gold rising from the thread in rings into a dome over the first verse | gold is Grandmaster Pho's alone (v25.5): his chant raises it |
| vis0 (2nd verse) | Spirit Vision opened by the film; the red threads come in under his front door and through his glass (`F2THREADS`, seven), feeling along the floor | an insert of his door's foot (door0..door1: a cut to a thing, v21.30): the threads under it |
| touch (3rd verse) | the first thread meets the gold: SLOW MOTION (the threads' own clock at 0.4 over 1.5 s: `slow2`), sparks, the thread burning back from its tip, curls of ash | the plan's 4.4: slow motion once in each ending |
| surge | the last surge: the picture pressed hardest (the vice) | |
| brk (4th verse) | it breaks: the press springs back (0.55 s), his ears pop, the long breath out; the gold settles into the thread and fades; the bottle on his altar goes still | |
| D only: wrist0, burn | his left hand lifted, the band of red light still round its wrist; the gold burns it off (a white flash, a sharp hiss); the red mark left | |
| x5, zv x1, x6 | "It's gone. Breathe." "Who was it?" "Who it was does not matter tonight. Rest. I will come in the morning." | |
| lie, black | he lies down inside the circle: the ceiling, the city's glow on it; the black | |

Endings B and C give the barrier the threads already at his feet (`near`); B's gold pushes harder (`push`).

## 3 · The dawn (the plan's 9.9; 7:10 AM)

| marks (from d0) | shot | why |
|---|---|---|
| 0 to sit | on his back inside the circle where he lay down: the ceiling in the warm light; his head down to his glass, the sun; he sits up, the thread still round him on the floor | M8 from 0 (coloured per ending), the koel |
| knock | two knocks at his door; his head turns to them over his shoulder | |
| door (a cut) | at his door, drawn open (`WORLD.hisDoor`): Grandmaster Pho standing in the corridor in white, his cloth bag on his shoulder (`FILMSAPI.phoStand`, `props.phoBag`): "Eat first. You fought all night, even sitting still." (his talk capped at 0.35: his open hands) | his eye beside the door clear of its leaf's swing |
| inside | he comes in past him, his look on the circle | `helpers.walk` at 0.85 m/s |
| wind (a cut) | his teacher sitting on the floor at the circle's edge, cross-legged as he always sits (the seated `cast.pho`, CROSS), winding the thread onto its spool in his right hand, his left drawing it up: the loop drawn in across the floor to his hands (the circle scaled about the point where it leaves the floor: `f2CircleWound`), the sun behind him | the plan says "kneels": he has no kneel, and on the floor he always sits so (chapters 3 to 5, and her table here) |
| table (a cut) | the dining table, his teacher across it on the other chair (WORLD's dawn seats, `FILMPLACE.dawnSeat`), the kopi and the toast between them (`w51breakfast`), the spool by his hand; "I only held the water." "That was enough for it to find you. There is no 'only'. Whoever helps becomes part of it." and the ending's own line; a slow push on him (0.3 m) | the plan's 9.9 |
| tie (a cut, an insert from his eyes) | his left wrist held out across the table (the hands' `reach` turned over), his teacher's two hands at it tying the white thread round and knotting it twice (knot1, knot2), in D over the red mark | THE NARROW LENS that makes one size of his hand and his teacher's: the hands' pass draws his own hand on its fixed 52 degrees at its own depth z; a world point at d metres on a lens of f degrees is drawn as big when d tan(f/2) = z tan(26). At 26 / 23 degrees his wrist, 0.44 m into the hands' pass, stands where a hand 0.93 m off is, half across the table: where his teacher reaches it (`f2WristAt`) |
| up | his eyes up to his teacher's face: "Before we help anyone, we protect ourselves. From now on, we prepare first." | M8 decays from its 41st second under this line (its last chord, as the plan has it) |
| (after) | his thought, "I had thought I was only there to assist my teacher.", in the morning's quiet; the picture goes down with the birds | v15.3 |

## 4 · The things and the people the endings use

His phone (`e4phone`, the play's model: `f2PhoneGroup`, its screen drawn: 3:03 and his teacher's name, "Calling…", the
call's seconds), held with its screen to him (`f2PhoneFace`: the play's hold at the decision shows the phone's back to the
lens, its screen's normal (0.31, -0.77, 0.56) in the lens's frame, measured: a finding for PLAY, said in the report);
the spool (`w51threadreel`), the pills (`w51pills`), a cushion (`w5cushion`, reused), the breakfast (`w51breakfast`), his
bag (`e4bag`, WORLD's), the bottle on his altar (WORLD's, trembling with each wave, still at the break). Grandmaster Pho
standing is FILMSAPI.phoStand; seated on the floor, cast.pho; never both drawn at once (each swap on a cut, v24.12).
His legs in the circle are framed out, not drawn: the game has no take of his body sitting cross-legged, and a take
retargeted from another body is a new motion that must pass the body rules before it is shown.

## 5 · Sound (y_endings.js; the static scan)

Every cue a literal `sfx(t, 'name')` in the scene's own source (v10.2), none after the film's last track (v12.3). The
static scan (tools/probes/voicescan.mjs, with the phone copies `*tel` counted as the voices they are): NO VOICE OVER
ANOTHER in any ending; the stretches of 1.5 s or more without a voice: the barrier's end into the dawn (held by the
night's bed under the black, then M8, the koel, his rising, the knock, the door), the dawn's walk-in and winding (his
teacher's steps, the thread drawn in and wound, the paper bag, the cups, M8, the morning bed), and the last 2.2 s (the
picture going down with the birds). Every other stretch in all four is spoken over.

## 6 · Measured (filled in as each lands)

## 7 · What is still open
