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
| C (bad) | "It's a migraine.": at his counter, his hand down to the drawer and up with the strip of pills before him, one to his mouth, the tap; the sofa, a cushion over his eyes (its head on the sofa's arm turned a little to his glass: the picture's lowest fifth the top of his glass doors and the city's night); a wave, the glass ticking; his sight opens by itself on his red footsteps ending at the sofa and the threads at his feet; he sits up with the phone as the call connects and listens facing his glass | 3:22: "Tell me." ... "This is not a headache. A headache does not follow you home." | the pills did nothing; the threads already at his feet | "Don't believe too fast. Don't dismiss too fast either. Look first. Then ask." |
| D (worst) | opens Spirit Vision on purpose, follows the threads to his balcony door, slides it open; one thread turns like a head and lunges: a band of red light round his left wrist, the picture crushed to a slit; tears himself back in, on his knees | "I'm here." "It's outside. It's looking for me." "Then stop looking for it. Sit down. Now." | the band burned off by the gold (a white flash, a hiss); a red mark left on his wrist | his teacher sees the mark: "You went to a stranger's door and knocked. It answered." ... "Curiosity is not courage." and ties the white thread over it |

Their clocks (y_endings.js EN2, measured lines; seconds): A 148.4 (own 17.1, barrier 81.2, dawn 50.1); B 169.0 (38.5, 82.4,
48.1); C 164.1 (33.0, 80.6, 50.5); D 161.3 (27.1, 83.0, 51.2). Longer than the plan's estimates (100 to 130 s): the
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
| D only: wrist0, burn | his left hand lifted, the band of red light still round its wrist; the gold burns it off (a warm flash opening out from the wrist, a sharp hiss); the red mark left, the hand held up until the barrier is calm so it is seen | in Spirit Vision the band is a red spirit laid where the hands' pass draws it (`f2BandSpirit`): the vision turns his hands black and white with the world (everything but the entities), and the band drawn in the hands' pass read there as a grey ring (run 7); the flash drawn white at 0.9 stood as a solid white bangle, and the hand let down before the calm took the mark out of the picture 0.9 s after the flash (run 7, photographed) |
| x5, zv x1, x6 | "It's gone. Breathe." "Who was it?" "Who it was does not matter tonight. Rest. I will come in the morning." | |
| lie, black | he lies down inside the circle: the ceiling, the city's glow on it; the black | |

Endings B and C give the barrier the threads already at his feet (`near`); B's gold pushes harder (`push`).

## 3 · The dawn (the plan's 9.9; 7:10 AM)

| marks (from d0) | shot | why |
|---|---|---|
| 0 to sit | on his back inside the circle where he lay down, his eyes down along himself to his glass: the white thread on the floor round him in the low sun; he sits up, the thread still round him | the morning bed and the koel; M8 (coloured per ending) comes in at `m8`, 3.0 to 6.1 s in (below) |
| knock | two knocks at his door; his head turns to them over his shoulder | |
| door (a cut) | at his door, drawn open (`WORLD.hisDoor`): Grandmaster Pho standing in the corridor in white, his cloth bag on his shoulder (`FILMSAPI.phoStand`, `props.phoBag`): "Eat first. You fought all night, even sitting still." (his talk capped at 0.35: his open hands) | his eye beside the door clear of its leaf's swing |
| inside | he steps back and aside to let him in (behind the middle of his sofa, 1.2 m off his way: at 0.65 m his teacher filled the picture passing and cut off his own head, photographed), his look going with him into the room | `helpers.walk` at 0.85 m/s |
| wind (a cut) | his teacher sitting on the floor at the circle's edge, cross-legged as he always sits (the seated `cast.pho`, CROSS), the spool held upright in his right hand before his belly and turned as he winds, his left hand a little before it pinching the thread that comes up from the floor and feeding it on (both hands laid by `handTo` after his seated rest, as FILMS-1 lays his at her table; measured: 6): the loop drawn in across the floor to his hands (the circle scaled about the point where it leaves the floor: `f2CircleWound`), the sun behind him | the plan says "kneels": he has no kneel, and on the floor he always sits so (chapters 3 to 5, and her table here) |
| table (a cut) | the dining table, his teacher across it on the other chair (WORLD's `chair2`, which faces the table: w51dinchair's back stands 0.245 m behind its middle, measured; his teacher sits forward on it), the kopi and the toast on his teacher's half to his right (`w51breakfast`), the spool set down on the other side; "I only held the water." "That was enough for it to find you. There is no 'only'. Whoever helps becomes part of it." and the ending's own line; a slow push on him (0.3 m) | the plan's 9.9 |
| tie (a cut, an insert from his eyes) | his left wrist held out across the table (the hands' `place` turned over), coming up into the insert with the cut into his teacher's waiting hands, which come to its two sides and tie the white thread round it, knotting it twice (knot1: the first turn and the knot, its two cut ends on the side his eye sees; knot2: the second turn), in D over the red mark; his teacher's robe behind | THE NARROW LENS that makes one size of his hand and his teacher's. His own hand is drawn in the hands' pass, on its own 52 degrees, at a place fixed on the screen (low on the left). On the world's lens f the same picture is a hand whose depth along the lens is zv / s (s = tan(f/2) / tan(26), zv its depth in the hands' camera) at the same sideways and upward metres: so his wrist IS at E + R (xv, yv, -zv / s), R the lens's turn. The insert's lens (20 degrees on both screens) is TURNED, no roll, so that point lies where his teacher reaches it across the table (past its middle toward him, 15 cm over its top: `tieWant`; `f2TieCam`, `f2TieW`), his eye leaning in over the table's near edge (0.28 m on and 9 cm down from where he sits). The first build looked at the table's middle and left his wrist where the lens put it: under the table's top, his teacher's hands short of it on his chair's back (photographed); at 22 degrees with his eye 0.21 m in, the wrist lay 0.55 and 0.60 m from his teacher's shoulders, past an arm of about 0.50 m, and his hands stopped 10 cm short, over the back of the held hand (run 8, read and photographed) |
| up (a cut) | his eyes up to his teacher's face: "Before we help anyone, we protect ourselves. From now on, we prepare first." | a cut: drawn as a move, the insert's 20 degrees opened to 50 in a second and a half as the look rose, a zoom no eye makes; his held hand is drawn back out of the insert after the second knot |
| (after) | his thought, "I had thought I was only there to assist my teacher."; M8's last chord under it, and the picture and the music down together | v15.3 |

M8 is 45.09 s, its last chord ringing out over its last 3.6 s; the dawn runs 48.1 to 51.2 s on its measured lines. Begun at
0, as the plan's table has it, it fell silent before his last thought and left the black with no music; so it begins at
`m8` = the dawn's end less 45.1 s (A 5.0 s in, B 3.0, C 5.4, D 6.1: under the knock or the door), and its last chord sounds
under his thought and fades with the picture.

## 4 · The things and the people the endings use

His phone (`e4phone`, the play's model: `f2PhoneGroup`, its screen drawn: 3:03 and his teacher's name, "Calling…", the
call's seconds), held with its screen to him (`f2PhoneFace`: the play's hold at the decision shows the phone's back to the
lens, its screen's normal (0.31, -0.77, 0.56) in the lens's frame, measured: a finding for PLAY, said in the report);
his oven's clock (WORLD's `ovenClock`: each ending's own time, 3:03, then B's 3:41, C's 3:22, D's 3:05, and 7:10 at dawn), the spool (`w51threadreel`), the pills (`w51pills`), a cushion (`w5cushion`, reused), the breakfast (`w51breakfast`), his
bag (`e4bag`, WORLD's), the bottle on his altar (WORLD's, trembling with each wave, still at the break), the dining table and
its two chairs (WORLD's, as WORLD stands them: build 2 of these films turned the chairs about for the dawn, read from a
picture where his teacher sat back through the backrest; measured, they face the table, and the turn is gone). Grandmaster
Pho standing is FILMSAPI.phoStand; seated on the floor, cast.pho; never both drawn at once (each swap on a cut, v24.12).
THE RINGS ROUND HIS LEFT WRIST (D's band of red light and its haze, the mark it leaves, the dawn's white thread in two turns
and its knot) are tubes laid on his own skin, in the hands' pass (`f2WristLoop`, `f2WristDress`): the hands' model hangs its
hand bone from the armature, whose own units are not metres (arms.glb: `hand.R` a child of `armature`, which carries a
hundred times, and the model is sized to a real hand by its own scale), so they are measured in the hands' own world:
the forearm's line from the skin itself (its middle 3 to 9 cm behind the wrist's joint), a slice of the skin across it
1.6 to 2.1 cm up the arm, and round the slice, every 7.5 degrees, the furthest skin from its middle, smoothed, then a
little out (the thread 1.6 mm, 2.4 mm thick: a cotton cord's), carried by the armature in its own units. The knot is laid
each frame on the side of the first turn his eye sees (`f2KnotLay`). Sized in metres inside the armature's frame, as the
first build had them, they stood far out round his wrist, off every picture: no ending ever showed them (run 8's reading:
the old measure, taken in the hand bone's frame, read 0.0042 of its units, the whole arm). THE STRIP OF PILLS in C is held
up out of his loose fist between his thumb and his first finger, its tablets turned to his eye (`f2PillsGeo`: found from
the hand's own bones with the pose laid whole, as the tie's wrist is); held at the palm, it lay under the hand.
His legs in the circle are framed out, not drawn: the game has no take of his body sitting cross-legged, and a take
retargeted from another body is a new motion that must pass the body rules before it is shown.

## 5 · Sound (y_endings.js; the static scan)

Every cue a literal `sfx(t, 'name')` in the scene's own source (v10.2), none after the film's last track (v12.3). The
static scan (tools/probes/voicescan.mjs, with the phone copies `*tel` counted as the voices they are): NO VOICE OVER
ANOTHER in any ending; the stretches of 1.5 s or more without a voice: the opening of A (the phone lifted, two rings, the
call connecting, his heart under it all: 5.3 s), of B (the phone laid down, the sofa, his palms, his breath, the waves: 6.3
s; the oven's clock and the floor: 9.9 s, his heart, the clock's tick, the crawl, the phone up, the ring), of C (the walk to
the kitchen, the drawer, the foil, the tap, the walk to the sofa, the cushion, the wave, the glass doors ticking, his sight
opening: 14.3 s, his heart under all of it) and of D (his sight opened, his steps, the door slid, the balcony's air, the
threads, the band, the slam, his knees, the phone, the ring: 16.6 s); in every barrier his walk to his bag and round to the
circle (12.3 to 14.1 s: his steps, the bag's zip, his heart, the spool, the floor as he sits, a wave, the thread closed); the
barrier's end into the dawn (8.4 s: the morning's bed from the black, the koel, his rising, his breath out, the knock, M8
coming in, the latch, the door), the dawn's walk-in and winding (9.1 s: his teacher's steps, the thread drawn in and wound,
the paper bag, the cups, M8, the morning bed), and the last 2.2 s (the picture and M8 going down together with the birds).
Every other stretch in all four is spoken over. (tools/probes/voicescan.mjs's walk over the assembled chapter, 27 Nov, with
the phone's copies of a line, `*tel`, counted as the voice they are: the tool as it stands leaves them out, a finding.)

## 6 · Measured

Everything here was read from the game itself (tools/probes/e5c1ends.mjs, a phone at 390 x 844 drawn at two pixels a point,
each ending reached through the decision's panel by a finger; CLOSE THE CIRCLE laid by a real finger in its own run) or
from the models' own files. Runs 4 to 7, 27 Nov 2026; every picture opened at its own size and read.

- THE MODELS' OWN MEASURES (their files): the dining chair `w51dinchair` 0.56 x 0.62 m, 0.82 m tall, its back 0.245 m behind
  its middle, its seat's top 0.50 m from 0.23 m behind its middle to 0.30 m before it; the table 0.693 m; the breakfast set
  0.30 x 0.33 m, 0.25 m tall; the spool 0.10 x 0.08 m, 0.084 m tall (drawn at 0.62); his teacher's cloth bag 0.32 x 0.18 m,
  0.50 m with its strap. M8 Dawn 45.09 s, its last chord falling away from its 41.5th second (its loudness, half-second
  steps). The balcony's rail 1.1 m up, 1.56 m out from his glass (b_world.js BALC).
- THE STATIC SCAN (5): no voice over another in any of the four; every stretch without a voice listed there with what holds it.
- READ FROM THE GAME BEFORE A CHANGE, and what the change answered:
  - his teacher at the table (run 5): in his talk his hips stand 0.69 m up, 0.20 m behind his body's own place; in his rest
    his shoulders stood behind the chair's back (z -1.30 against the back's -1.295), and clipscan counted 5,110 and 6,083
    crossings of his body with the chair: so his hips are set on the seat whatever the take (f2SeatHips).
  - the tie (run 5): the wrist the hands' pass draws stood at xv -0.034, yv -0.128, zv 0.388 m in its camera (the reach at
    0.92); his teacher's right hand stopped 0.33 m short of it at a straight arm: so the eye leans in over the table, the
    held hand is the library's place, the wrist set where his hands reach it.
  - on the floor (run 5, feetscan): his right foot 2.2 cm and his robe's hem 4.8 cm into the floor: he sits 2 cm up.
  - jointscan at the winding, the table and the tie (run 5): no joint flagged.
  - the tie (run 8, read at its first knot): the wrist the insert's lens set stood at (300.68, 0.89, -0.45), 0.55 and 0.60 m
    from his teacher's shoulders (300.54, 1.07, -1.00) and (300.93, 1.06, -1.03); his hands stopped at 0.50 m from them, 10 cm
    short, and were photographed lying over the back of the held hand: so the lens is 20 degrees, the eye leans further in
    and the wrist is held lower and further over (3); the rings round the wrist were measured at 0.0042 of the hand bone's
    own units and never drawn where a lens could see them: so they are laid on his skin in metres (4).
  - his teacher's fingers at the tie (run 8, photographed straight and spread): the library's curlFingers looks for bones named
    RightHandIndex1 or mixamorig:RightHandIndex1; his standing body's are named mixamorigRightHandIndex1 (glTF takes the
    colon out), so it found none; the films' own curl (`f2Curl`) finds them either way.
  - run 9 (read in the game): the wrist's slice at the thread, 39 points of skin, 2.08 to 2.79 cm from its middle (the
    armature's unit 130.4 m in the hands' world: the old rings, sized in it as metres, stood 0.8 m round the wrist); his
    teacher standing 3 cm up, his lowest skin 1.1 cm over the floor, and seated 2 cm up, 1.2 cm over it (so 2 cm and 1 cm:
    feetscan's 3.2 and 2.2 cm under stood the same with him lifted or not, so it does not read him against this floor); at
    the tie the held wrist at (300.73, 0.85, -0.61), and his hands' palms 7 cm to its sides over the back of the held hand,
    their fingers straight (so they are turned in to face across it, 5 cm to its sides).
  - run 10 (read in the game, every vertex): his teacher standing 2 cm up, his lowest skin 0.03 cm under the floor; seated 1
    cm up and 12 cm further back, his lowest skin 2.35 cm under it (a few points: every third point read 1.2 cm over it at 2
    cm up, so the robe's bulk lies on the floor and a few of its points below), the thread rising before his knees clear of
    his robe (photographed from his side); at the tie his right hand's twelve finger joints found and its first joint bent 38
    degrees by the films' own curl; his left hand has no finger bones (his standing file carries them in the right hand only:
    build.py's `p5pho`), so its fingers lie straight along the wrist's side.
  - THE LENS AS A MOVE (run s7: each ending sought from 0 to its end every tenth of a second on a phone's shape and a desk's,
    tools/probes/e5c1ends.mjs MODE=seek, read by tools/probes/e5c1bounce.py and framebounce.py). What it found and what was
    done: his sitting down into the circle (every ending) dropped the eye its last 0.38 m in a tenth of a second (the keys
    0.1 s apart: now over 1.45 s), and the lens stepped from the circle's 70 degrees to the chant's 66 in one frame (now eased
    as his eye lifts); B's first look down to his phone fell 42 degrees and closed the lens 12 to 20 in 0.3 s (now 0.9 s); C's
    look dipped to 0.72 m and rose at 112 degrees a second as he came to the drawer (now kept on the counter's top), and he
    sat and lay back at 1.5 m a second (now 0.9 s each); D's first look rose 40 degrees in 0.4 s (now a second), and between
    the door and the doorway the keys' curve through a look-at point 40 m out threw the look back under his eye, 80 degrees
    down and round in half a second (now 6 m out). Read and left: every lens leap it lists at a cut (the door's insert, the
    dawn's door, winding, table, tie and face: cuts with no person in the frame, which the reader cannot tell from a leap);
    the dawn's first frame (a change in the black); head turns of 90 to 100 degrees a second as he turns to walk or to the
    knock; and his teacher's "drawn height" steps, which are parts of him outside the picture (their extent past the
    screen's edge) or a reading taken before he is in it. The fixed moves are measured again (runs s12, s13).
  - jointscan at the door, the winding, the table and the tie (run 8): no joint flagged. clipscan (run 8): his teacher's robe
    with his own chair, 4,209 crossings at the table (his robe over the seat and against the chair's back: read from his
    side, a sitter's cloth on and behind his seat, which no shot sees: left); with the table's far edge, 316 (his forearms
    resting on it, under 2 cm into its top); the cloth bag through his arm at the door (1,639) and the thread through his
    knees at the winding (45) are what the bag's place and the thread's way were changed for (run 9 reads them again).

## 7 · What is still open

1. THE PLAN'S "KNEELS" to wind the thread: Grandmaster Pho has no kneel in his file, and on the floor he always sits
   cross-legged (chapters 3 to 5, her table here): so he sits to it (3).
2. HIS OWN LEGS IN THE CIRCLE are framed out, not drawn: the game has no take of his body sitting cross-legged, and a take
   retargeted from another body is a new motion that must pass the body rules before it is shown (4).
3. THE PAPER BAG IN HIS TEACHER'S HAND AT THE DOOR (the plan's 9.9, 6 to 14 s) is not shown: `w51breakfast` is the set as
   laid out on a table (the bag, two cups, the toast), not a bag to carry; at the door he has his cloth bag on his shoulder,
   and the breakfast is on the table at the cut. A carried paper bag would need a model of its own (none made: a new model
   only by the coordinator's word).
4. M8 begins 3.0 to 6.1 s into the dawn, not at its first second, so its last chord falls under his thought (3).
5. THE WINDING is 5 s and the spool is set on the table off the picture (the plan's 14 to 24 s gives it 10 s with the
   setting down): the dawn already runs 48 to 51 s on its measured lines.
6. THE BURN'S FLASH in D is the band's haze turned warm white and opened out about the wrist for 0.45 s (a translucent ring
   of light, read from the photograph as a flash at the wrist); a sprite of light would be softer still.
7. HIS TEACHER'S LEFT HAND at the tie lies straight along the wrist's side: his standing file (`p5pho`) carries finger bones
   in the right hand only, so only the right closes on the thread.
8. IN C THE TAP'S WATER falls a hand's width short of his hand under it (the hand is the hands' pass's own place on the
   screen, the water the world's).
9. Findings for other pieces, left as they are: PLAY's PHONEHELD shows the phone's back to the lens at the decision (4);
   FILMS-1's clasp in its films is at the engine's default height, -0.235, which shows the thumbs (e3c2's -0.33 hides
   them: B's here uses it); THINGS: the altar cabinet's top right edge is ragged where the lens passes it in the barrier
   and in C (photographed); his teacher's cloth bag hangs where his right arm swings (FILMS-1's c_yfilm.js phoBagOn1, and
   the dawn's copy of it); tools/probes/voicescan.mjs counts no line's phone copy (`*tel`) as a voice; the cast's library
   `curlFingers` (copied from episode 4 chapter 5) finds no finger on a body whose bones glTF named `mixamorigRightHandIndex1`
   (it asks for `RightHandIndex1` or `mixamorig:RightHandIndex1`), so it does nothing on his teacher's standing body, where
   FILMS-1's films call it too (c_yfilm.js, her table and the gift); WORLD's two picture frames on the wall by the passage
   stand into the wall (clipscan, 428 and 422 crossings at x 303.3 to 304.2, 1.45 to 1.8 m up), and the clothes rack on his
   balcony through the plant beside it (244); his oven's clock reads the world's own 11:52 through the play at three in the
   morning (b_world.js sets it once; nothing in the play sets it again: the endings now set it to their own time, 4).
