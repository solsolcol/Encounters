/* Episode 5 · Chapter 1 · "The Love Spell That Followed Me Home"
   ---------------------------------------------------------------------------
   THE FIRST CHAPTER OF CASE FILE 5, "The Signal And The Translator": S1·16, case four. A man asks Grandmaster Pho to
   see his colleague, Grace, at her own home (Chad, R3: "it should be the lady's house"); she keeps going back to a man
   who treated her badly. Pho finds a love spell and breaks it while Master Zavier holds the holy water; she comes back
   to herself. At three that morning, at home, something crushes his head from every side, looking for whoever helped
   her. He calls his teacher, who sets a barrier round him over the phone. "I had thought I was only there to assist my
   teacher."

   THIS FILE IS GENERATED (masters/v29.0/assemble.py, from masters/v29.0/parts/*.js and the script,
   masters/v29.0/script/lines.json): edit the parts and the script and assemble again, never this file.
   docs/V29.0-E5C1-PLAN.md is the design (its 0 Chad's words, the contract; its 8 the play, its 9 every film shot by
   shot, its 10 every line, its 11 the sound); docs/V29.0-E5C1-BUILD.md is where the build stands (read it first).

   WHAT THIS FILE IS TODAY: THE SKELETON (the tracker's M1). The chapter's data and every word of it are in place; its
   places, its play and its films are stand-ins, each marked where it stands with the piece that builds it:
     TODO-WORLD   the places (b_world.js: plain shells of the street, her front room and his flat; the plan's 5)
     TODO-CAST    Grace and Marcus (c_cast.js: two of the game's own people wearing the roles until theirs land; M3)
     TODO-PLAY    a phase's play (c_play.js: one thing to press for each order; the plan's 8)
     TODO-FILM    a film or an ending (z_tail.js: a few seconds each, ending as a film must; the plan's 9)
     TODO-SOUND   a line's take and its measured length (lines.json; every length here is PROVISIONAL), the beds, the
                  music, the effects (the plan's 11)
   A line whose take has not landed is spoken silently on its provisional length and shown as a caption, so the
   skeleton can be walked and read from its first frame to its four endings.

   CHAD'S DIRECTION (26 and 27 Nov 2026, the plan's 0): it happens in Singapore; the full plan, every creative choice,
   every film shot by shot (R1); the sound, the music, the effects and their timing (R2); the evening in the lady's own
   home; build it all now, from a tracker of milestones and checkpoints (R3).

   FAIRNESS (the standing rule: no practice and no practitioner is ever the villain). The man who treated her badly is
   never seen or heard, only his messages lighting her phone; the master who made the spell is never seen and never
   named, and Pho will not say who he is; Grace is never blamed ("She is not weak"); Marcus is a good friend. GOLD is
   Grandmaster Pho's alone, and only the barrier glows gold.

   THE ENDING STOPS AT DAWN THE NEXT MORNING, the white thread on his wrist: nothing of what he will become. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light (painted, never a lamp added on screen: v15.1)
     WORLD's block (masters/v29.0/parts/b_world.js builds the places these light). The five looks of the plan's 4.3, each
     the sky, the fog and the three global lights; what a look paints in the world itself (her lamps' pools, the city's
     lit windows, the altar's candle, dawn's patches of sun on his floor) b_world.js's `worldLook` sets from the same
     name, and it follows on its own when a look's background is the scene's (WORLD.md: each look's `bg` is its own). A
     key's direction is where its light comes from: her street is to her room's +x, his city to his flat's +z. */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  /* THE SHOPHOUSE ROW AT BLUE HOUR (7:20 PM): the sky deep blue over the row (lighter at the horizon, where the city's
     glow is), the light cool and low; her windows amber and the street lamps sodium-orange are painted (b_world.js) */
  const BLUE = sky({
    stops: [[0.00, '#5a6c9c'], [0.10, '#465a8e'], [0.30, '#33477c'], [0.60, '#24366a'], [1.00, '#17244e']],
    bg: 0x22305a, fog: [0x2c3a66, 0.0055],
    hemi: [0x8094cc, 0x3a3634, 0.62], key: [0xc4b0a0, 0.42, -2.0, 2.4, 1.2], fill: [0x5a6cb0, 0.26],
    stars: 0.04, moon: 0,
    vmHemi: [0x8094cc, 0x3a3634, 0.62], vmKey: [0xc4b0a0, 0.4] });
  /* HER FRONT ROOM IN LAMPLIGHT (7:30 to 8:30 PM): warm white from her table lamp and his teacher's candles; the
     windows black with the street's glow (her walls and ceiling carry the lamps' warmth as painted light) */
  const LAMP = sky({
    stops: [[0.00, '#26305a'], [0.20, '#1c2448'], [0.50, '#151b3a'], [0.80, '#0f142e'], [1.00, '#0b0f26']],
    bg: 0x14182e, fog: [0x161a30, 0.004],
    hemi: [0xffe0b8, 0x5a4636, 0.74], key: [0xffcf9c, 0.62, -1.6, 2.2, 2.4], fill: [0x8a7a70, 0.22],
    stars: 0, moon: 0,
    vmHemi: [0xffe0b8, 0x5a4636, 0.74], vmKey: [0xffcf9c, 0.52] });
  /* HIS FLAT AT 11:52 PM (home): no lights on; the city's glow through his glass (+z), cold blue-grey, a little warmth
     from the towers' lit windows; the altar's candle a small warm point (painted) */
  const HOME = sky({
    stops: [[0.00, '#3a4058'], [0.12, '#2a3048'], [0.35, '#1e243c'], [0.70, '#141a30'], [1.00, '#0c1124']],
    bg: 0x121a2c, fog: [0x1a2034, 0.0042],
    hemi: [0x8c9cbc, 0x2c2c32, 0.5], key: [0xb4c0dc, 0.42, 0.6, 1.4, 3.0], fill: [0x6070a4, 0.22],
    stars: 0.06, moon: 0,
    vmHemi: [0x8c9cbc, 0x2c2c32, 0.5], vmKey: [0xb4c0dc, 0.36] });
  /* THREE O'CLOCK (3:00 to 3:40 AM): the same, darker and colder; fewer of the city's windows lit */
  const NIGHT = sky({
    stops: [[0.00, '#2a3044'], [0.15, '#1e2438'], [0.40, '#161c30'], [0.70, '#0f1428'], [1.00, '#0a0d1e']],
    bg: 0x0d1322, fog: [0x12182a, 0.0046],
    hemi: [0x7c8cac, 0x24242a, 0.38], key: [0x9cacd0, 0.32, 0.6, 1.4, 3.0], fill: [0x4c5c94, 0.18],
    stars: 0.1, moon: 0,
    vmHemi: [0x7c8cac, 0x24242a, 0.4], vmKey: [0x9cacd0, 0.3] });
  /* HIS FLAT AT DAWN (7:10 AM): the low sun in through his glass (+z, a little to the east), long warm light across his
     floor (dawn's patches of sun are painted: b_world.js), the city washed clean */
  const DAWN = sky({
    stops: [[0.00, '#ffd49a'], [0.10, '#f6c896'], [0.30, '#d2c6c8'], [0.60, '#a4bad8'], [1.00, '#7ea2d0']],
    bg: 0xd8c8b0, fog: [0xdcccb8, 0.0028],
    hemi: [0xfff0d8, 0x9a8670, 0.92], key: [0xffc888, 1.05, 1.6, 1.0, 3.0], fill: [0xa0b0d0, 0.26],
    stars: 0, moon: 0, sun: 0.6,
    vmHemi: [0xfff0d8, 0x9a8670, 0.9], vmKey: [0xffc888, 0.6] });
  const PRESETS = { BLUE, LAMP, HOME, NIGHT, DAWN };

  /* LINES BEGIN: written by masters/v29.0/assemble.py from masters/v29.0/script/lines.json (edit that file and
     assemble again: never this block). EVERY LINE THE CHAPTER SPEAKS: its length, its speaker, its place, its words. */
  /* every line's length. PROVISIONAL unless its row in lines.json carries a measured `secs`: a provisional length is
     the line's words / 2.3 a second (a chant's at its own pace), and is REPLACED by the take's measured length when the
     line is voiced (the queue books its window by it and every film's times are built from it, so a measured take moves
     what follows it: v5.15). The names are QUOTED on purpose: build.py gives a sound to a chapter's own pack only when the
     chapter names it in quotes (v21.1). */
  const SECS = {      // 83 of 83 MEASURED from their takes; the other 0 PROVISIONAL (words / 2.3 s)
    /* Master Zavier (the player) */
    'zv51o1': 1.15, 'zv51o2': 5.51, 'zv51o3': 4.57, 'zv51r1': 3.21, 'zv51r2': 2.89, 'zv51r3': 3.13, 'zv51r4': 4.49,
    'zv51r5': 4.19, 'zv51r6': 3.29, 'zv51c1': 2.97, 'zv51c2': 2.97, 'zv51h1': 2.01, 'zv51n1': 2.17, 'zv51n2': 5.37,
    'zv51n3': 2.25, 'zv51n4': 3.85, 'zv51x1': 1.05, 'zv51A1': 4.81, 'zv51B1': 4.25, 'zv51B2': 2.81, 'zv51B3': 1.29,
    'zv51B4': 1.61, 'zv51C1': 2.41, 'zv51C2': 2.97, 'zv51C3': 3.45, 'zv51D1': 1.29, 'zv51D2': 2.97, 'zv51w1': 1.69,
    'zv51w2': 3.05, 'zv51A': 2.49, 'zv51B': 2.49, 'zv51C': 3.05, 'zv51D': 2.81,
    /* Grandmaster Pho */
    'ph51o1': 2.54, 'ph51o2': 2.13, 'ph51r1': 4.38, 'ph51r2': 3.28, 'ph51r3': 3.84, 'ph51r4': 1.84, 'ph51r5': 2.24,
    'ph51k1': 2.81, 'ph51k2': 3.85, 'ph51ratana': 44.36, 'ph51s1': 2.49, 'ph51c1': 2.73, 'ph51c2': 5.37,
    'ph51c3': 4.41, 'ph51c4': 1.21, 'ph51c5': 1.75, 'ph51x1': 6.86, 'ph51x2': 5.34, 'ph51x3': 0.73, 'ph51x4': 4.64,
    'ph51jina': 36.62, 'ph51x5': 2.19, 'ph51x6': 7.45, 'ph51A1': 2.72, 'ph51A2': 3.27, 'ph51A3': 6.89,
    'ph51B1': 2.09, 'ph51B2': 2.76, 'ph51B3': 4.57, 'ph51B4': 4.89, 'ph51C1': 0.92, 'ph51C2': 4.54, 'ph51C3': 7.29,
    'ph51D1': 0.93, 'ph51D2': 4.01, 'ph51D3': 4.39, 'ph51D4': 2.39, 'ph51w1': 3.93, 'ph51w2': 7.37, 'ph51w3': 6.31,
    /* Grace */
    'gr51o1': 2.31, 'gr51r1': 3.61, 'gr51r2': 0.82, 'gr51r3': 0.87, 'gr51c1': 0.81,
    /* Marcus */
    'mk51o1': 3.91, 'mk51o2': 2.22, 'mk51r1': 2.45, 'mk51r2': 1.53, 'mk51c1': 2.41
  };
  /* every line's words: key: [who, where in the chapter, the words exactly as said] */
  const LINES = {
    'zv51o1': ['zv', 'open', "Case four."],
    'zv51o2': ['zv', 'open', "A man asked us to come and see his colleague. He said she was not herself."],
    'mk51o1': ['mk', 'open', "Thank you for coming, Grandmaster. She said you can come up."],
    'ph51o1': ['ph', 'open', "Thank you. Show us the way."],
    'mk51o2': ['mk', 'open', "Grace? They're here."],
    'gr51o1': ['gr', 'open', "Come in. Sorry about the mess."],
    'ph51o2': ['ph', 'open', "Thank you for letting us in."],
    'zv51o3': ['zv', 'open', "She had let us in. But something kept turning her back to the door."],
    'zv51r1': ['zv', 'room', "Every time it lit up, she leaned toward the door."],
    'ph51r1': ['ph', 'room', "Don't look at what it says. Look at what it does to her."],
    'zv51r2': ['zv', 'room', "In the glass, she was facing the stairs."],
    'ph51r2': ['ph', 'room', "The glass shows where she is being pulled."],
    'zv51r3': ['zv', 'room', "Her hands never stopped. Like she was already leaving."],
    'ph51r3': ['ph', 'room', "She is not weak. She is tired of being pulled."],
    'zv51r4': ['zv', 'room', "Something in her bag. Wrapped in cloth, tied with red cord."],
    'ph51r4': ['ph', 'room', "Ask her where she got it."],
    'zv51r5': ['zv', 'room', "Grace, the little packet in your bag. Where is it from?"],
    'gr51r1': ['gr', 'room', "He gave it to me. He said it would keep me safe."],
    'mk51r1': ['mk', 'room', "That was around when she changed."],
    'zv51r6': ['zv', 'room', "A thread. From her chest to the door."],
    'gr51r2': ['gr', 'room', "I should go."],
    'gr51r3': ['gr', 'room', "I should go."],
    'mk51r2': ['mk', 'room', "Grace, please."],
    'ph51r5': ['ph', 'room', "Sit. A little longer."],
    'ph51k1': ['ph', 'keepsake', "May I hold it? Only for a while."],
    'ph51k2': ['ph', 'keepsake', "Hold the water. Whatever happens, keep it still."],
    'ph51ratana': ['ph', 'keepsake', "Yaṅ-kiñci vittaṁ idha vā huraṁ vā Saggesu vā yaṁ ratanaṁ paṇītaṁ Na no samaṁ atthi Tathāgatena. Idam-pi Buddhe ratanaṁ paṇītaṁ Etena saccena suvatthi hotu. Khayaṁ virāgaṁ amataṁ paṇītaṁ Yad-ajjhagā Sakyamunī samāhito Na tena dhammena sam’atthi kiñci. Idam-pi dhamme ratanaṁ paṇītaṁ Etena saccena suvatthi hotu. Yam-buddha-seṭṭho parivaṇṇayī suciṁ Samādhim-ānantarik’aññam-āhu Samādhinā tena samo na vijjati. Idam-pi dhamme ratanaṁ paṇītaṁ Etena saccena suvatthi hotu."],
    'ph51s1': ['ph', 'breaking', "Slowly. Again."],
    'ph51c1': ['ph', 'cord', "It's alright. It's finished."],
    'zv51c1': ['zv', 'cord', "For the first time all evening, she let it ring."],
    'ph51c2': ['ph', 'cord', "Rest tonight. Tomorrow, stay close to people who listen to you."],
    'ph51c3': ['ph', 'cord', "Don't let her meet him alone. A friend is medicine too."],
    'mk51c1': ['mk', 'cord', "I won't. Thank you, Grandmaster."],
    'gr51c1': ['gr', 'cord', "Thank you."],
    'ph51c4': ['ph', 'cord', "For your altar."],
    'ph51c5': ['ph', 'cord', "You held it well."],
    'zv51c2': ['zv', 'cord', "My part was small. I only held the water."],
    'zv51h1': ['zv', 'home', "Everyone thought that was the end of it."],
    'zv51n1': ['zv', 'night', "Like my head was in a vice."],
    'zv51n2': ['zv', 'night', "Not a headache. Something was pressing in from every side."],
    'zv51n3': ['zv', 'night', "The water I brought home was shaking."],
    'zv51n4': ['zv', 'night', "My own footsteps. Something was following them."],
    'ph51x1': ['ph', 'barrier', "The one who made the spell felt it break. He is sending it back, to find out who helped her."],
    'ph51x2': ['ph', 'barrier', "Get the white thread from your bag. Sit on the floor, in the middle of the room."],
    'ph51x3': ['ph', 'barrier', "Close it."],
    'ph51x4': ['ph', 'barrier', "Good. Now stay inside. Whatever you hear, stay inside."],
    'ph51jina': ['ph', 'barrier', "Jay'āsan'āgatā Buddhā Jetvā Māraṁ savāhanaṁ Catu-saccāsabhaṁ rasaṁ Ye piviṅsu narāsabhā Taṇhaṅkar'ādayo Buddhā Aṭṭha-vīsati nāyakā Sabbe patiṭṭhitā mayhaṁ Matthake te munissarā. Sīse patiṭṭhito mayhaṁ Buddho dhammo dvilocane Saṅgho patiṭṭhito mayhaṁ Ure sabba-guṇākaro. Hadaye me Anuruddho Sāriputto ca dakkhiṇe Koṇḍañño piṭṭhi-bhāgasmiṁ Moggallāno ca vāmake."],
    'ph51x5': ['ph', 'barrier', "It's gone. Breathe."],
    'zv51x1': ['zv', 'barrier', "Who was it?"],
    'ph51x6': ['ph', 'barrier', "Who it was does not matter tonight. Rest. I will come in the morning."],
    'ph51A1': ['ph', 'endA', "I'm here. Tell me what you feel."],
    'zv51A1': ['zv', 'endA', "My head... it's like something's crushing it from every side."],
    'ph51A2': ['ph', 'endA', "Listen to me, and do exactly what I say."],
    'ph51A3': ['ph', 'endA', "You called at once. That is the first protection: knowing when something is more than you."],
    'zv51B1': ['zv', 'endB', "It's three in the morning. He worked all evening. Let him sleep."],
    'zv51B2': ['zv', 'endB', "I told myself I could carry it till morning."],
    'ph51B1': ['ph', 'endB', "How long has it been like this?"],
    'zv51B3': ['zv', 'endB', "Since three."],
    'ph51B2': ['ph', 'endB', "Forty minutes. Why did you wait?"],
    'zv51B4': ['zv', 'endB', "I didn't want to wake you."],
    'ph51B3': ['ph', 'endB', "You held the water for her. Now let me hold it for you."],
    'ph51B4': ['ph', 'endB', "A student who won't wake his teacher is protecting the wrong person."],
    'zv51C1': ['zv', 'endC', "It's a migraine. That's all it is."],
    'zv51C2': ['zv', 'endC', "The pills did nothing. It was still pressing."],
    'ph51C1': ['ph', 'endC', "Tell me."],
    'zv51C3': ['zv', 'endC', "It's just a migraine, I think. It won't stop."],
    'ph51C2': ['ph', 'endC', "This is not a headache. A headache does not follow you home."],
    'ph51C3': ['ph', 'endC', "Don't believe too fast. Don't dismiss too fast either. Look first. Then ask."],
    'zv51D1': ['zv', 'endD', "Who's doing this?"],
    'ph51D1': ['ph', 'endD', "I'm here."],
    'zv51D2': ['zv', 'endD', "It's outside. It's looking for me."],
    'ph51D2': ['ph', 'endD', "Then stop looking for it. Sit down. Now."],
    'ph51D3': ['ph', 'endD', "You went to a stranger's door and knocked. It answered."],
    'ph51D4': ['ph', 'endD', "Curiosity is not courage."],
    'ph51w1': ['ph', 'dawn', "Eat first. You fought all night, even sitting still."],
    'zv51w1': ['zv', 'dawn', "I only held the water."],
    'ph51w2': ['ph', 'dawn', "That was enough for it to find you. There is no 'only'. Whoever helps becomes part of it."],
    'ph51w3': ['ph', 'dawn', "Before we help anyone, we protect ourselves. From now on, we prepare first."],
    'zv51w2': ['zv', 'dawn', "I had thought I was only there to assist my teacher."],
    'zv51A': ['zv', 'card', "I called. He was already awake."],
    'zv51B': ['zv', 'card', "I waited. It cost me an hour."],
    'zv51C': ['zv', 'card', "I called it a headache. It wasn't."],
    'zv51D': ['zv', 'card', "I went looking. It found me first."]
  };
  /* which lines each place says, in the script's order (a film's builder reads its lines from here) */
  const SAID = {
    open: ['zv51o1', 'zv51o2', 'mk51o1', 'ph51o1', 'mk51o2', 'gr51o1', 'ph51o2', 'zv51o3'],
    room: ['zv51r1', 'ph51r1', 'zv51r2', 'ph51r2', 'zv51r3', 'ph51r3', 'zv51r4', 'ph51r4', 'zv51r5', 'gr51r1', 'mk51r1', 'zv51r6', 'gr51r2', 'gr51r3', 'mk51r2', 'ph51r5'],
    keepsake: ['ph51k1', 'ph51k2', 'ph51ratana'],
    breaking: ['ph51s1'],
    cord: ['ph51c1', 'zv51c1', 'ph51c2', 'ph51c3', 'mk51c1', 'gr51c1', 'ph51c4', 'ph51c5', 'zv51c2'],
    home: ['zv51h1'],
    night: ['zv51n1', 'zv51n2', 'zv51n3', 'zv51n4'],
    barrier: ['ph51x1', 'ph51x2', 'ph51x3', 'ph51x4', 'ph51jina', 'ph51x5', 'zv51x1', 'ph51x6'],
    endA: ['ph51A1', 'zv51A1', 'ph51A2', 'ph51A3'],
    endB: ['zv51B1', 'zv51B2', 'ph51B1', 'zv51B3', 'ph51B2', 'zv51B4', 'ph51B3', 'ph51B4'],
    endC: ['zv51C1', 'zv51C2', 'ph51C1', 'zv51C3', 'ph51C2', 'ph51C3'],
    endD: ['zv51D1', 'ph51D1', 'zv51D2', 'ph51D2', 'ph51D3', 'ph51D4'],
    dawn: ['ph51w1', 'zv51w1', 'ph51w2', 'ph51w3', 'zv51w2'],
    card: ['zv51A', 'zv51B', 'zv51C', 'zv51D']
  };
  /* THE CHANTS' CAPTIONS (the plan's 11.6; v21.31): each chant's lines as [the Pali as chanted, its meaning], in order.
     Timed on the take's breaths from the line's own start once it is voiced (kit.captions, the thirtieth seam) */
  const CHANTS = {
    'ph51ratana': [
      ["Yaṅ-kiñci vittaṁ idha vā huraṁ vā / Saggesu vā yaṁ ratanaṁ paṇītaṁ / Na no samaṁ atthi Tathāgatena.", "Whatever wealth in this world or the next, whatever exquisite treasure in the heavens, is not, for us, equal to the Tathāgata."],
      ["Idam-pi Buddhe ratanaṁ paṇītaṁ / Etena saccena suvatthi hotu.", "This, too, is an exquisite treasure in the Buddha. By this truth may there be well-being."],
      ["Khayaṁ virāgaṁ amataṁ paṇītaṁ / Yad-ajjhagā Sakyamunī samāhito / Na tena dhammena sam’atthi kiñci.", "The exquisite deathless—dispassion, ending—discovered by the Sakyan Sage while in concentration: There is nothing equal to that Dhamma."],
      ["Idam-pi dhamme ratanaṁ paṇītaṁ / Etena saccena suvatthi hotu.", "This, too, is an exquisite treasure in the Dhamma. By this truth may there be well-being."],
      ["Yam-buddha-seṭṭho parivaṇṇayī suciṁ / Samādhim-ānantarik’aññam-āhu / Samādhinā tena samo na vijjati.", "What the excellent Awakened One extolled as pure and called the concentration of unmediated knowing: No equal to that concentration can be found."],
      ["Idam-pi dhamme ratanaṁ paṇītaṁ / Etena saccena suvatthi hotu.", "This, too, is an exquisite treasure in the Dhamma. By this truth may there be well-being."]
    ],
    'ph51jina': [
      ["Jay'āsan'āgatā Buddhā / Jetvā Māraṁ savāhanaṁ / Catu-saccāsabhaṁ rasaṁ / Ye piviṅsu narāsabhā", "The Buddhas, noble men who drank the nectar of the four noble truths, having come to the victory seat, having defeated Māra together with his mount:"],
      ["Taṇhaṅkar'ādayo Buddhā / Aṭṭha-vīsati nāyakā / Sabbe patiṭṭhitā mayhaṁ / Matthake te munissarā.", "These Buddhas—28 leaders, sovereign sages beginning with Taṇhaṅkara—are all established on the crown of my head."],
      ["Sīse patiṭṭhito mayhaṁ / Buddho dhammo dvilocane / Saṅgho patiṭṭhito mayhaṁ / Ure sabba-guṇākaro.", "The Buddha is established in my head, the Dhamma in my two eyes, the Saṅgha—the mine of all virtues—is established in my chest."],
      ["Hadaye me Anuruddho / Sāriputto ca dakkhiṇe / Koṇḍañño piṭṭhi-bhāgasmiṁ / Moggallāno ca vāmake.", "Anuruddha is in my heart, and Sārīputta on my right. Koṇḍañña is behind me, and Moggallāna on my left."]
    ]
  };
  /* who speaks, as a caption names them (a line whose take has not landed is shown, not lost) */
  const WHO = { zv: "Master Zavier", ph: "Grandmaster Pho", gr: "Grace", mk: "Marcus" };
  /* LINES END */

  /* A FILM'S TIMES are built from SECS (chapter 3's tl, as chapters 4 and 5 have it): a list of ['line', gap], [secs] (a
     pause) and ['@mark'] (a named moment); the answer maps every line and mark to its start on the film's own clock, and
     `end` to where the list ends, so the cues and the pictures read the same numbers, and a measured take moves
     everything after it (v5.15). TODO-FILM: every film of this chapter is timed this way from SAID and SECS. */
  function tl(start, list) {
    const T = {}; let t = start;
    for (const it of list) {
      if (typeof it[0] === 'number') { t += it[0]; continue; }
      if (it[0][0] === '@') { T[it[0].slice(1)] = t; continue; }
      T[it[0]] = t; t += (SECS[it[0]] || 2.5) + (it[1] || 0);
    }
    T.end = t;
    return T;
  }

  const DATA = {
    id: 1,
    episode: 5,
    /* (the casebook's own title: v23.3) */
    title: 'The Love Spell That Followed Me Home',
    cardLabel: 'Chapter 1',
    cardTitle: 'The Love Spell That Followed Me Home',
    /* (DRAFT, mine: the case file's first sentences as a brief, at her home as Chad's R3 has it. The plan writes none) */
    brief: 'A man asked you and Grandmaster Pho to come and see his colleague at her home. He said she was not herself.',
    /* the prompt is the turning point's own question (the plan's 9.6), his phone in his hand at 3:03 */
    prompt: 'It’s three in the morning. Something is crushing your head. What do you do?',
    /* THE DECISION (the plan's 9.6: its default ranks A best, B good, C bad, D worst; not timed). Four KINDS of answer and
       four roads to the same place: he asks at once (A, the case file's own act), humility misread (B), dismissal before
       looking (C), curiosity dressed as courage (D). In all four he calls his teacher, the barrier is set, and at dawn he
       is still the student; none leaves the path. Checked against every earlier decision in the plan's 9.6.
       THE DELTAS are the episode before's own for each rank (episode 4: best 6/6/18, good 3/6/9, bad -6/3/-9, worst
       -3/0/-18): a default, the plan gives ranks and no numbers.
       EACH `say` is the plan's own line under the card (its 9.10; held to the script's zv51A to zv51D by the assembler).
       EACH `teach` (the case file's own sentence first, then what you did) is a DRAFT, mine: the plan writes none. */
    choices: [
      { k: 'A', text: 'Call Grandmaster Pho now.',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I called. He was already awake.',
        teach: 'Guidance, protection and knowing your own limits all matter, and they matter most where other practitioners are involved. You knew at once that this was more than you, and you asked.' },
      { k: 'B', text: 'Don’t wake him. It’s three in the morning.',
        d: { sanity: 3, awareness: 6, wisdom: 9 }, verdict: 'good',
        say: 'I waited. It cost me an hour.',
        teach: 'Helping someone does not automatically place you outside the situation. You protected your teacher’s sleep at your own cost, as if being a helper meant never needing help, and the night was longer for it.' },
      { k: 'C', text: 'It’s only a migraine. Take a pill and sleep.',
        d: { sanity: -6, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I called it a headache. It wasn’t.',
        teach: 'Sometimes the person helping becomes part of the case. You named it a headache before you looked, and it went on pressing while you lay there.' },
      { k: 'D', text: 'Open Spirit Vision and find who’s doing this.',
        d: { sanity: -3, awareness: 0, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I went looking. It found me first.',
        teach: 'When you involve yourself in another person’s spiritual problem, you may also be involving yourself in whatever conflict surrounds it. You went toward the thing that was looking for you, and it found you.' }
    ],
    /* THE LESSON CARD (the plan's 9.11, its default until Chad picks: v11.9): the case file's own sentences, 1 as the
       card's line and 4 under it, so the card carries the case's ordinary danger too. No Pali term (v11.10). */
    core: 'Wanting to help is not the same as being prepared to.<br><i>Whoever they are, they need people around them who will listen and help them stay safe.</i>',

    /* THE WORLD (masters/v29.0/parts/b_world.js; the plan's 5): units metres, y up. TODO-WORLD: three places of the
       skeleton, each a plain shell, each a pocket world past the lens's far plane (160 m) from the others (v8.9): her
       front room at the origin (he kneels at his place by her windows, a turn of 0 looking toward -z, across the low
       table at Grace on the sofa), the shophouse row and the stair 200 m along -x (the opening film's), and his flat
       200 m along +x (home, three o'clock, the barrier and the dawn). The decision's anchor is his dining table, where
       his phone is. The bounds hold all three (what he walks is held by walls: stage.keepIn names it). */
    spawn:     { x: 0.9, y: 0.95, z: 1.2, rot: 0 },
    shrine:    { x: 200.0, z: -1.6 },             // the engine's anchor (ghost: null): his dining table and his phone, the chapter's pile
    ghostHome: { x: 200.0, z: -1.6 },
    bounds:    { minX: -212.0, maxX: 212.0, minZ: -14.0, maxZ: 14.0 },

    ghost: null,
    fireLight: null,
    daylight: LAMP,
    render: { freePictures: true },
    /* SPIRIT VISION (chapter 4's fiftieth seam, as episode 4 chapters 4 and 5 tuned it): open in the room (the red line
       from Grace to the door), held open by the breaking and the barrier, forced open at the bedroom door at three
       o'clock (the plan's 8). TODO-SOUND: its own sounds (u51...), never another chapter's: a sound of another chapter
       named here would leave that chapter's pack. Until they land it is silent. */
    vision: { outSecs: 2.2, inSecs: 1.6, band: 0.27, line: 0.24,
              front: 0x3a96ff, glow: 0.32, burn: 3.2, laid: 0.55, linger: 0.7, detail: 1 },
    /* (in the run from its first build: Chad's rule of v27.0, every build a full release; never a preview chapter) */

    assets: [
      /* >>> this chapter's own keys: written by masters/v29.0/keys.py (edit its table, not this list) >>> */
      'p51grace', 'p51graceh', 'p51marcus', 'p51marcush', 'w51keepsake', 'w51bag', 'w51bottle', 'w51threadreel',
      'w51lighter', 'w51jug', 'w51plate', 'w51glass',
      /* <<< this chapter's own keys <<< */
      /* the shared cast's stand-ins and reuse (masters/v29.0/parts/c_cast.js), each declared in `reuseInEpisode`:
         Grandmaster Pho as episode 4 chapter 5 casts him seated (his own file, look D), the white cloth over his crossed
         legs; and until Grace and Marcus land (M3), the two of the game's people who wear their roles. (Standing, at
         dawn, he is chapter 5's copy with finger bones, p5pho: the FILMS piece adds it with his standing body) */
      'pho', 'w3pholap', 'p4mala', 'p4malah', 'p5collector'
    ],
    /* FRESH (chaptertest): what this chapter takes from episodes 1 to 3, declared (Chad, v17.4): nothing */
    reuse: {},
    /* what it takes from episode 4, declared all the same (v17.4: any reuse is declared), and what wears a role until
       its own model lands */
    reuseInEpisode: {
      pho: "Grandmaster Pho, Chad's own model, as episode 4 chapters 3 to 5 cast him (his look D): seated on his cushion at Grace's low table",
      w3pholap: "the white cloth over Grandmaster Pho's crossed legs, episode 4 chapter 3's hall: his seat at her table" },
    placeholders: {
      p4mala: "STAND-IN for Grace until her own body lands (M3): Mala, Amma's daughter, met only in episode 4 chapter 4 (her mother's flat)",
      p4malah: "Mala's full body, for within 2.2 m (v26.5), with the stand-in",
      p5collector: "STAND-IN for Marcus until his own body lands (M3): the collector, met only in episode 4 chapter 5's last case (the receiving room)" },
    items: [],

    musicVol: 0,
    /* THE BEDS (the plan's 11.3): TODO-SOUND, each a loop at 0 here, set by the play's mixer by place and beat once SOUND
       has made them (u51...). None is declared until its file exists: a bed named before then plays nothing. */
    ambience: { beds: [] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer',
      interactTouch: 'Tap to answer',
      actLine: 'Press E to answer',
      actLineTouch: 'Tap to answer',
      /* EVERY WORD THE PLAYER READS IS PLAIN, DIRECT, EVERYDAY ENGLISH (Chad, R112 of episode 4 chapter 5). The orders are
         the plan's own (its 8), word for word; the marks' words are mine (each names the thing by what the player sees) */
      // THE ROOM (the plan's 8.1)
      objPour: 'Pour water into the bowl.',
      objLight: 'Light the candle.',
      objWatch: 'Watch Grace. Find what is pulling her.',
      objVision: 'Open Spirit Vision and look at Grace.',
      hotJug: 'Pour the water',
      hotLighter: 'Light the candle',
      hotPhone: 'Her phone',
      hotGlass: 'Her reflection',
      hotHands: 'Her hands',
      hotPacket: 'The packet in her bag',
      // THE BREAKING (the plan's 8.2): the event's brief, START first (v8.7); the input named for the device (v18.5)
      evStillTitle: 'Keep the water still.',
      evStillTouch: 'Hold the bowl steady. Drag to keep the light inside the ring.',
      evStillKey: 'Hold the bowl steady. Move the mouse to keep the light inside the ring.',
      // THREE O'CLOCK (the plan's 8.3)
      objGetUp: 'Something is pressing on your head. Get up.',
      objPhone: 'Get to your phone.',
      tipPress: 'It presses hardest when you move or have Spirit Vision open. Stand still and it eases.',
      hotGetUp: 'Get up',
      hotPhoneHis: 'Pick up your phone',
      // THE BARRIER (the plan's 9.7): CLOSE THE CIRCLE, the event inside the film
      evCircleTitle: 'Close the circle.',
      evCircleTouch: 'Lay the thread all the way round you. Circle your finger round the screen.',
      evCircleKey: 'Lay the thread all the way round you. Circle the mouse round the screen.',
      // THE SKELETON'S STAND-INS (TODO-PLAY): what is pressed until its play is built. Mine, not the plan's: each goes
      // when the play it stands for is built
      hotStill: 'Hold the bowl'
    },
    sayPrefix: 'zv51'
  };
  /* ================================================================ THE CHAPTER'S SOUNDS, CLAIMED (v29.0)
     Every one of the chapter's 115 effects, beds and music cues (masters/v29.0/sound: picks.json, make.sh) named here once,
     so build.py gives each to this chapter's own pack: a sound no chapter names falls into the SHARED pack, every
     player's boot download (about 29 MB of these). The films and the play cue each by its literal name; until every one
     is, this list keeps them in the chapter's pack. Their rows in the engine's table: src/main.js, E5C1 FX */
  const U51_SOUNDS = ['u51band', 'u51bbalc', 'u51bcorr', 'u51bdawn', 'u51bflat', 'u51bloom', 'u51bnight', 'u51bottle', 'u51bowlup', 'u51brass', 'u51breath', 'u51bstair', 'u51bstreet', 'u51bthree', 'u51burn', 'u51busaway', 'u51buzz', 'u51carpet', 'u51charger', 'u51clock', 'u51closed', 'u51cloth', 'u51clunk', 'u51connect', 'u51cork', 'u51cups', 'u51cushion', 'u51dip', 'u51door', 'u51drag', 'u51drawer', 'u51exhale', 'u51facedown', 'u51fantick', 'u51flick', 'u51floor', 'u51foil', 'u51fold', 'u51frames', 'u51fray', 'u51gecko', 'u51glass', 'u51gtick1', 'u51gtick2', 'u51heart', 'u51hinge', 'u51keycard', 'u51keys', 'u51knee', 'u51knock', 'u51knot', 'u51koel', 'u51lap', 'u51liedown', 'u51liftfar', 'u51lighter', 'u51m1blue', 'u51m2room', 'u51m3pull', 'u51m4break', 'u51m5city', 'u51m6a', 'u51m6b', 'u51m6c', 'u51m7circle', 'u51m8dawnA', 'u51m8dawnB', 'u51m8dawnC', 'u51m8dawnD', 'u51moto', 'u51mynah', 'u51palms', 'u51paper', 'u51phoneup', 'u51plate', 'u51pop', 'u51pour', 'u51press', 'u51rewind', 'u51ring', 'u51setglass', 'u51shoe', 'u51shower', 'u51showeroff', 'u51slam', 'u51slide', 'u51snap', 'u51sofa', 'u51spill', 'u51spool', 'u51stair', 'u51stand', 'u51strap', 'u51swell', 'u51tap', 'u51taxiin', 'u51taxiout', 'u51threads', 'u51ticklast', 'u51tile', 'u51tinnitus', 'u51tremor', 'u51tube', 'u51unlock', 'u51vice', 'u51visoff', 'u51vison', 'u51walk', 'u51wave', 'u51wax', 'u51wburn', 'u51whoosh', 'u51wick', 'u51wrist', 'u51zip'];
  /* ================================================================ THE WORLD'S PLAN (WORLD, the tracker's M5; the plan's
     4.3, 5, 8, 9 and 12). Read before build(): the numbers the chapter's data and every other part take from the places.
     masters/v29.0/WORLD.md writes every one of them out for PLAY and FILMS.
     TWO POCKET WORLDS, each past the lens's far plane (160 m) from the other (v8.9):
       HER PLACE at the origin: the shophouse row at blue hour, its street and the row opposite (the opening's crane), the
                 five-foot way and the coffee shop closing below her, the narrow stair from the street door to the landing,
                 and her rented flat on the upper floor, its floor at y 0, the street 3.85 m below it (the plan's 5.1 to 5.3)
       HIS HOME 300 m along +x: a high-floor condominium flat (its floor at y 0, the ground 78 m below), its corridor, the
                 city outside his glass as built towers with lit and dark windows, the expressway's lights and the pool
                 far below (the plan's 5.4)
     ONE CHANGE TO THE SKELETON'S DATA, made here because the places decide it (said in WORLD.md): the spawn is where the
     opening film leaves him, kneeling at his place by her windows; the decision's anchor (the engine's pile) is his phone
     on his dining table; the bounds hold the two flats he walks in; and the models the places stand are declared with
     the chapter's own (every reuse with its reason: v17.4). */
  const HX = 300.0;                                    // his flat's pocket: its living room's middle on x
  const WORLD_AT = {
    kneel: { x: 1.45, z: 1.9, ry: 0.41 },               // his place by her windows, at Grandmaster Pho's right (looking at Grace)
    phone: { x: HX + 0.15, y: 0.758, z: -0.2 }          // his phone on its charger, on his dining table's near end
  };
  Object.assign(DATA.spawn, { x: WORLD_AT.kneel.x, z: WORLD_AT.kneel.z, rot: WORLD_AT.kneel.ry });
  Object.assign(DATA.shrine, { x: WORLD_AT.phone.x, z: WORLD_AT.phone.z });
  Object.assign(DATA.ghostHome, { x: WORLD_AT.phone.x, z: WORLD_AT.phone.z });
  Object.assign(DATA.bounds, { minX: -6.2, maxX: HX + 8.6, minZ: -4.6, maxZ: 4.4 });
  /* the models the places stand that the game already has (each met before in episode 4; none of episodes 1 to 3), and
     why each is the thing itself: props/RECORD.md's survey, and the places' own */
  const WORLD_REUSE = {
    w5ceilfan: "the ceiling fan over her front room: episode 4 chapter 5's (Mr Koh's living room), a plain white fan",
    w4tubelight: "the stair's one fluorescent tube, and the coffee shop's: episode 4 chapter 4's batten",
    w4gate: "her door's metal gate, folded back on the landing: episode 4 chapter 4's grille gate",
    w4doorleaf: "her timber front door, the street door to her stair and her bedroom door: episode 4 chapter 4's timber leaf",
    w5frontdoor: "his front door and his neighbours' on the corridor, tinted a dark veneer here: episode 4 chapter 5's door",
    w5slippers: "her shoes by her door on the landing: episode 4 chapter 5's slippers",
    w4corrpots: "the plant on her landing: episode 4 chapter 4's corridor pots",
    w3dracaena: "the plant in her front room's corner and on his balcony: episode 4 chapter 3's dracaena",
    w5tablelamp: "her table lamp on the bookshelf and his bedside lamp: episode 4 chapter 5's (props/RECORD.md)",
    w5cushion: "Grandmaster Pho's cushion, his own and her floor cushions: episode 4 chapter 5's (props/RECORD.md)",
    w4fridge: "the fridge in her kitchenette: episode 4 chapter 4's (props/RECORD.md: it fits her flat better than his)",
    w4dintable: "her small dining table in the back room: episode 4 chapter 4's",
    w4dinechair: "her two dining chairs: episode 4 chapter 4's",
    w4streetlamp: "the street lamps of the shophouse row: episode 4 chapter 4's",
    e4sedan: "the taxi that brings them (tinted a taxi's blue, no name on it: v9.3): episode 4 chapter 1's sedan",
    e4sedanfar: "a car parked across the street (its light level): episode 4 chapter 1's",
    e4suvfar: "a car parked up the street (its light level): episode 4 chapter 1's",
    e4moto: "a motorbike parked at the kerb: episode 4 chapter 1's",
    w3pchair: "the coffee shop's chairs stacked for the night, and his balcony chairs: episode 4 chapter 3's plastic chair",
    e4buddha: "the small Buddha image on his altar: Chad's own (props/RECORD.md)",
    w4framesmall: "his teacher's framed photograph on his altar: episode 4 chapter 4's frame (props/RECORD.md)",
    e4bag: "his own grey canvas bag by his front door, the white thread in it (the plan's 9.7): episode 4 chapter 2's, his",
    e4phone: "his own phone on his dining table: episode 4 chapter 2's, the same man's (props/RECORD.md)",
    w3candlesmall: "the candles on her cloth and on his altar (props/RECORD.md)",
    w4bigbowl: "Grandmaster Pho's own bowl for the holy water (props/RECORD.md)",
    w4clothesrack: "the clothes rack on his balcony (props/RECORD.md)",
    w5walllamp: "the wall lights of his corridor: episode 4 chapter 5's walkway lamps",
    w5frame: "the two pictures in his passage that tap the wall at three o'clock: episode 4 chapter 5's wall frame"
  };
  for (const k of Object.keys(WORLD_REUSE)) if (!DATA.assets.includes(k)) DATA.assets.push(k);
  Object.assign(DATA.reuseInEpisode, WORLD_REUSE);
  /* the new things of the plan's 7 the places stand, by the keys they land under (props/TABLE.txt): each placed now with
     an invisible stand-in for its collision, drawn the moment its file is in the build (keys.py adds it to `assets`),
     so nothing moves when it lands (v4.7) */
  const WORLD_NEW = ['w51clock', 'w51aircon', 'w51kettle', 'w51jasmine', 'w51incense', 'w51plate', 'w51lighter', 'w51jug', 'w51glass', 'w51ctable', 'w51gsofa', 'w51rattan', 'w51shelf', 'w51laptop', 'w51takeaway', 'w51sofa', 'w51dintable',
                     'w51dinchair', 'w51bed', 'w51altarcab', 'w51bag', 'w51keepsake', 'w51bottle', 'w51threadreel'];

  function build(ctx) {
    /* ================================================================ THE MACHINERY, COPIED (masters/v29.0/assemble.py
       pins episode 4 chapter 5's file by its sha1; chapters are copied, not bundled: v6.11). Its build's head: the engine's
       kit taken from ctx, the TDZ law's declarations, the speed-ups' switches (v26.11), the small helpers */
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, HEAD_RE } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    let parsePend = 0;                                   // (R51: models being unpacked now: stage.ready waits for none)
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted layer
    /* ONE PASS FOR A FLAT CARD (v26.11, the speed-ups' first: no memory made and thrown away each frame). three draws a
       see-through two-sided material in two passes, its back faces and then its front faces, and looks its program up
       again before each (renderObject sets material.needsUpdate both times: two look-ups a card a frame, each a
       hundred-field object built and thrown away, and a draw that paints nothing). A card that is ONE FLAT FACE is wholly
       front or wholly back to any eye, so of the two passes one draws nothing and the other draws every triangle in the
       geometry's own order; one pass (forceSinglePass) draws the same triangles in the same order, and an unlit material
       that reads no normal (MeshBasicMaterial with no envMap) shades them the same. Only such cards are given it, where
       they are made (the sun's rays, the taper's flame, the place to kneel), and each is checked when the world is built
       (onePassCheck): a material given it whose every user is not one flat plain card is drawn as three draws it, and the
       console says so. `?opt=onePass:0` draws all of them as three does: the proof compares the two pixel for pixel. */
    const ONEPASS = !ctx.opt || ctx.opt('onePass');
    /* NO LIST MADE AND THROWN AWAY EACH FRAME (v26.11): where a frame made a new list or a new turn to hold numbers it had
       (a hand's resting finger turns, two lists joined to walk them), it keeps one and fills it again: the same numbers
       copied into it in the same order, so every turn laid after it is the same to the bit. `?opt=noGarbage:0` makes
       them anew as before (the proof compares every bone of every body, the two ways) */
    let NOGARB = !ctx.opt || ctx.opt('noGarbage');                   // (a probe turns it over in one page: stage.garb)
    /* A BONE'S ANGLES WORKED OUT WHEN THEY ARE READ (v26.11, the speed-ups' second: the bones' arithmetic without the
       machinery's overhead). three keeps every object's turn twice, as a quaternion and as three angles, and each time the
       quaternion changes it works the angles out again at once (Object3D's onQuaternionChange: a rotation matrix and an
       arcsine and two arctangents). A body's bones turn thousands of times a frame (every take writes each one, every pose
       laid after it turns it again) and nothing ever reads their angles: the matrices are made from the quaternion. So a
       bone's quaternion only marks its angles stale, and they are worked out, by three's own setFromQuaternion on the same
       quaternion, the moment anything reads or writes any of them: every read gives the very numbers the old way held, and
       a write to one angle finds the others as the old way had them. Proved by every angle read both ways after the same
       turns (stage.lazyProof) and every bone compared. `?opt=lazyRot:0` leaves three's way */
    const LAZYROT = !ctx.opt || ctx.opt('lazyRot');
    const FASTTWINS = !ctx.opt || ctx.opt('fastTwins');               // (the seams' twins found by whole-number cells: twinsFast)
    const FASTSKIN = !ctx.opt || ctx.opt('fastSkin');                 // (a posed vertex with each bone's matrix made once a pose: skinVertex)
    const SHEETONCE = !ctx.opt || ctx.opt('sheetOnce');               // (a body's sheet set up once, never uploaded again for nothing: c_cast.js sheetOf)
    const KEEPSHARED = !ctx.opt || ctx.opt('keepShared');             // (a film's full body gives back only what no other body draws: c_cast.js fullOff)
    function lazyRot(o) { if (LAZYROT) lazyInstall(o); }
    const LAZY = new WeakSet();
    function lazyInstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || LAZY.has(e)) return;
      let dirty = false, x = e._x, y = e._y, z = e._z, order = e._order;
      const sync = () => { dirty = false; e.setFromQuaternion(q, undefined, false); };
      Object.defineProperty(e, '_x', { get() { if (dirty) sync(); return x; }, set(v) { if (dirty) sync(); x = v; }, configurable: true });
      Object.defineProperty(e, '_y', { get() { if (dirty) sync(); return y; }, set(v) { if (dirty) sync(); y = v; }, configurable: true });
      Object.defineProperty(e, '_z', { get() { if (dirty) sync(); return z; }, set(v) { if (dirty) sync(); z = v; }, configurable: true });
      Object.defineProperty(e, '_order', { get() { if (dirty) sync(); return order; }, set(v) { if (dirty) sync(); order = v; }, configurable: true });
      LAZY.add(e);
      q._onChange(() => { dirty = true; });
    }
    /* (a probe's: the angles back to three's own way on this object, the numbers as they stand) */
    function lazyUninstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || !LAZY.has(e)) return;
      const x = e._x, y = e._y, z = e._z, order = e._order;
      delete e._x; delete e._y; delete e._z; delete e._order;
      e._x = x; e._y = y; e._z = z; e._order = order;
      LAZY.delete(e);
      q._onChange(() => { e.setFromQuaternion(q, undefined, false); });
    }
    /* (the proof, for a probe: pairs of objects, one turned the old way and one the new, put through the same long string
       of turns and reads, every read and every quaternion compared bit for bit; then every bone of every body read
       against its angles worked out afresh from its quaternion. Answers the count of numbers compared and of those
       that differed) */
    function lazyProof(seed = 1, steps = 4000) {
      let r = seed >>> 0; const rnd = () => ((r = (r * 1664525 + 1013904223) >>> 0) / 4294967296);
      const same = (a, b) => Object.is(a, b);
      let n = 0, bad = 0; const chk = (a, b) => { n++; if (!same(a, b)) bad++; };
      const A = [], Bq = [];
      for (let i = 0; i < 6; i++) { const a = new THREE.Object3D(), b = new THREE.Object3D(); lazyInstall(b); A.push(a); Bq.push(b); }
      const tq = new THREE.Quaternion(), te = new THREE.Euler(), ax = new THREE.Vector3(), arr = [0, 0, 0, 0], orders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'];
      for (let k = 0; k < steps; k++) {
        const i = Math.floor(rnd() * A.length), a = A[i], b = Bq[i], op = Math.floor(rnd() * 12);
        const v = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1], ang = (rnd() * 2 - 1) * 3.2;
        tq.set(v[0], v[1], v[2], v[3]).normalize();
        for (const o of [a, b]) {
          if (op === 0) o.quaternion.copy(tq);
          else if (op === 1) o.quaternion.slerp(tq, 0.37);
          else if (op === 2) o.quaternion.premultiply(tq);
          else if (op === 3) { arr[0] = tq.x; arr[1] = tq.y; arr[2] = tq.z; arr[3] = tq.w; o.quaternion.fromArray(arr); }
          else if (op === 4) o.rotation.x = ang;
          else if (op === 5) o.rotation.y = ang;
          else if (op === 6) o.rotation.set(ang, -ang * 0.5, ang * 0.25, orders[k % 6]);
          else if (op === 7) o.rotation.reorder(orders[(k + 3) % 6]);
          else if (op === 8) o.quaternion.setFromAxisAngle(ax.set(v[0], v[1], v[2]).normalize(), ang);
          else if (op === 9) o.rotateY(ang);
          else if (op === 10) o.quaternion.invert();
          else o.lookAt(v[0] * 5, v[1] * 5, v[2] * 5);
        }
        if (rnd() < 0.5) { chk(a.rotation.x, b.rotation.x); chk(a.rotation.y, b.rotation.y); chk(a.rotation.z, b.rotation.z); chk(a.rotation.order, b.rotation.order); }
        chk(a.quaternion.x, b.quaternion.x); chk(a.quaternion.y, b.quaternion.y); chk(a.quaternion.z, b.quaternion.z); chk(a.quaternion.w, b.quaternion.w);
      }
      for (let i = 0; i < A.length; i++) { const a = A[i], b = Bq[i]; const ea = a.rotation.toArray(), eb = b.rotation.toArray(); for (let j = 0; j < 4; j++) chk(ea[j], eb[j]);
        a.updateMatrix(); b.updateMatrix(); for (let j = 0; j < 16; j++) chk(a.matrix.elements[j], b.matrix.elements[j]); }
      let bones = 0, boneBad = 0;
      world.traverse(o => { if (!o.isBone || !LAZY.has(o.rotation)) return; bones++; te.setFromQuaternion(o.quaternion, o.rotation.order, false);
        if (!same(te.x, o.rotation.x) || !same(te.y, o.rotation.y) || !same(te.z, o.rotation.z)) boneBad++; });
      return { compared: n, differed: bad, lazyBones: bones, bonesDiffering: boneBad };
    }
    function flatCard(g) {
      const p = g && g.attributes && g.attributes.position; if (!p || (g.morphAttributes && g.morphAttributes.position)) return false;
      const ix = g.index ? g.index.array : null, n = ix ? ix.length : p.count;
      let have = false, nx = 0, ny = 0, nz = 0, ax = 0, ay = 0, az = 0, off = 0, size = 0;
      for (let t = 0; t + 2 < n; t += 3) {
        const a = ix ? ix[t] : t, b = ix ? ix[t + 1] : t + 1, c = ix ? ix[t + 2] : t + 2;
        const Ax = p.getX(a), Ay = p.getY(a), Az = p.getZ(a), ux = p.getX(b) - Ax, uy = p.getY(b) - Ay, uz = p.getZ(b) - Az, wx = p.getX(c) - Ax, wy = p.getY(c) - Ay, wz = p.getZ(c) - Az;
        const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx, L = Math.hypot(cx, cy, cz);
        if (!(L > 1e-12)) continue;
        if (!have) { nx = cx / L; ny = cy / L; nz = cz / L; ax = Ax; ay = Ay; az = Az; have = true; }
        if ((cx * nx + cy * ny + cz * nz) / L < 0.999999) return false;                    // (a triangle facing another way)
        for (let k = 0; k < 3; k++) { const X = Ax + (k === 1 ? ux : k === 2 ? wx : 0), Y = Ay + (k === 1 ? uy : k === 2 ? wy : 0), Z = Az + (k === 1 ? uz : k === 2 ? wz : 0);
          off = Math.max(off, Math.abs((X - ax) * nx + (Y - ay) * ny + (Z - az) * nz)); size = Math.max(size, Math.hypot(X - ax, Y - ay, Z - az)); }
      }
      return have && off <= 1e-6 * Math.max(size, 1e-6);
    }
    function onePassCheck() {
      const users = new Map();
      world.traverse(o => { if (!o.material) return; for (const m of [].concat(o.material)) if (m && m.forceSinglePass) { if (!users.has(m)) users.set(m, []); users.get(m).push(o); } });
      for (const [m, os] of users) {
        const bad = !m.isMeshBasicMaterial || !!m.envMap ? m.type : (os.find(o => !o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.isBatchedMesh || !flatCard(o.geometry)) || null);
        if (!bad) continue;
        m.forceSinglePass = false;
        console.warn('onePass: a material given one pass is drawn in two (' + (typeof bad === 'string' ? bad : (bad.name || bad.type) + ' is not one flat plain card') + ')');
      }
      return users.size;
    }
    const wallNow = () => performance.now() / 1000;
    const have = (key) => DATA.assets.includes(key);      // a thing is asked for only once its file is in the build
    const waiting = new Set();                            // the keys the world names that have not landed yet (stage.info)
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const isNarrow = () => camera.aspect < 1;
    const TOUCHY = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);   // (the engine's HAS_TOUCH: which words a brief gives)

    /* ================================================================ THE PLACES (WORLD, M5: the plan's 5; masters/v29.0/
       WORLD.md every number below). Units metres, y up; a Mixamo body at a turn of 0 faces +z, the lens at 0 looks -z.
       HER PLACE (the origin). Her flat is the upper floor of a shophouse unit whose front is on the street at +x:
         FRONT  her front room, x -2.75..2.75 (her front wall's inside face at 2.75, the street beyond), z -3.0..3.0, the
                ceiling at 3.4; two tall timber windows in the front wall (A z -2.2..-0.6, B z 0.6..2.2), louvred shutters
                inside them; her front door in the back wall (x -2.75) at z -2.85..-1.9, off the landing
         BACK   past a half wall (x -2.75, z -1.6..1.9; open above it and beside it), her back room x -5.6..-2.9,
                z -1.6..3.0: a small dining table, the kitchenette along the +z wall, the fridge, the bedroom door (shut)
         LOBBY  the landing outside her door, x -4.1..-2.9, z -3.0..-1.75, and the stair's top (z -4.3..-3.15)
         STAIR  the stair bay beside her flat, z -4.3..-3.15: nineteen risers from the street door (in the shop front's
                line, x 1.15) up to the landing at x -3.28
         STREET the five-foot way (x 1.15..3.0) at y -3.85 under her floor, the drain and the kerb, the road (x 3.55..13.55),
                the row opposite (its front at x 14.1), both rows along z -40..40; the coffee shop below her (x -4..1.15)
       HIS HOME (x 300 + the numbers here): living and dining room x -4.6..3.0, z -2.5..2.5, the ceiling 2.8, his glass on
         +z with the balcony beyond (z 2.62..4.1), his front door in the -z wall at x -4.2..-3.4 off the corridor
         (z -4.3..-2.62); the kitchen counter along the -z wall; the passage x 3.0..4.4, z 0.2..1.8; the bedroom x 4.4..8.2,
         z -1.0..2.5 (its glass on +z); the bathroom x 4.4..6.4, z -2.5..-1.12; the ground 78 m below */
    const ROOM = { x0: -5.6, x1: 2.75, z0: -3.0, z1: 3.0, ceil: 3.4, cx: 0, cz: 0 };      // her whole flat (keepIn), its front wall's inside face at x1
    const FRONT = { x0: -2.75, x1: 2.75, z0: -3.0, z1: 3.0, ceil: 3.4 };                  // her front room
    const BACKR = { x0: -5.6, x1: -2.9, z0: -1.6, z1: 3.0 };                              // her back room
    const LOBBY = { x0: -4.1, x1: -2.9, z0: -3.0, z1: -1.75 };                            // the landing outside her door
    const STAIR = { z0: -4.3, z1: -3.15, x0: -3.28, x1: 0.95, door: 1.15, risers: 19, top: -4.1 };   // the stair bay
    const GY = -3.85;                                                                      // the five-foot way's floor (the street's level)
    const STREET = { x0: -6, x1: 24, z0: -40, z1: 40, cx: 6.0, cz: 0, y: GY, kerb: 3.55, road: [3.55, 13.55], across: 14.1, shop: 1.15, face: 3.0 };
    const FLAT = { x0: HX - 4.6, x1: HX + 8.2, z0: -2.5, z1: 2.5, ceil: 2.8, cx: HX, cz: 0 };   // his flat (keepIn)
    const LIV = { x0: HX - 4.6, x1: HX + 3.0, z0: -2.5, z1: 2.5 };                        // his living and dining room
    const BED = { x0: HX + 4.4, x1: HX + 8.2, z0: -1.0, z1: 2.5 };                        // his bedroom
    const BATH = { x0: HX + 4.4, x1: HX + 6.4, z0: -2.5, z1: -1.12 };                     // his bathroom
    const PASS = { x0: HX + 3.0, x1: HX + 4.4, z0: 0.2, z1: 1.8 };                        // the passage to his bedroom
    const CORR = { x0: HX - 9.5, x1: HX + 3.0, z0: -4.3, z1: -2.62 };                     // his corridor
    const BALC = { x0: HX - 4.6, x1: HX + 3.0, z0: 2.62, z1: 4.1, rail: 1.1 };            // his balcony
    const GH = -78.0;                                                                      // the ground under his block
    const EYE = 1.62;
    const KNEEL_EYE = 1.12;                                                                // his eye kneeling at her table (the reflection is measured from it)
    const world = new THREE.Group(); world.name = 'e5c1'; scene.add(world);
    const solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };
    /* a solid by its two corners on the floor */
    const solidXZ = (x0, z0, x1, z1, h = 2.2) => solidBox(Math.abs(x1 - x0), h, Math.abs(z1 - z0), (x0 + x1) / 2, h / 2, (z0 + z1) / 2);

    /* ------------------------------------------------- one parse per asset, many of one, a model stood (chapter 3's own,
       as chapters 4 and 5 copied them), and the merged pieces of what never moves */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            if (unifySkeletons) unifySkeletons(gltf.scene);
            mendTwins(key, gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      const pr = parsedGlb.get(key); parsePend++;
      pr.then(() => setTimeout(() => { parsePend--; }, 0), () => { parsePend--; });
      return pr;
    }
    /* (v24.17) Chad's Nang Kwak is bronze, about 0.8 metal by its own metal-roughness sheet, and a metal shows only what
       it reflects: under the scene's environment at 0.05 she drew as a black silhouette on the tray and the altar
       (photographed), where the bag's own view shows her warm bronze. The pickup's lift (v24.16), held to her metal: the
       material is shared by her two copies, so both read as the same piece */
    /* (v24.29) THE LIFT IS DRAWN NOW (tools/patchthree.mjs: three ignored a material's envMapIntensity under the scene's
       environment, so the 10 written here never reached a pixel and she stayed the black silhouette above). Drawn as
       written, 10 x 0.05 = 0.5 of the room washed the shop's bronze and gold to pale silver; photographed on a phone at
       0.05 / 0.08 / 0.12 / 0.18 / 0.25 the images read bronze-gold at 0.12-0.18 and pale from 0.25 — episode 3's own
       bracket for its Buddha images (BUDDHA_ENV 0.15) — so a piece takes 3 (0.15). A vehicle's paint and chrome take k 2
       (0.1: silver reads silver and red red, where 0.18 up washed the sedan white) */
    function bronzeLift(o, k = 3) { for (const mt of [].concat(o.material)) if (mt && mt.metalnessMap && 'envMapIntensity' in mt) mt.envMapIntensity = k; }
    /* (v24.22) MANY OF ONE MODEL: a real model stood at many places as InstancedMeshes — one per mesh of the file, the
       file's own node transform folded into every instance — so a shop full of stock costs a draw a kind a place, never a
       draw a piece. `list`: [{ x, y, z, ry, rx, rz, s }] in `parent`'s frame, turned ry about y, then rx about its own x
       (a lean back, a lying down), then rz about its own z. Its gold, bronze and copper are metal and show only what they
       reflect: the pickup's lift (bronzeLift). The instances are `owned`, so dispose frees their buffers */
    const _mq = new THREE.Quaternion(), _me = new THREE.Euler(0, 0, 0, 'YXZ'), _mp = new THREE.Vector3(), _ms = new THREE.Vector3(), _mm = new THREE.Matrix4();
    /* (v24.22) NEAR AND FAR. A stock file carries its piece twice: `<key>_near` as it was made, `<key>_far` a light level
       of the same surface (a cased piece's front baked onto its own geometry, tools/planarfar.mjs; a statue cut by
       tools/lodpair.mjs). Each place stands both and draws the near level only while its nearest piece would fill more
       than STOCK_NEAR of the frame's height (`stockLod`, every frame World S is shown): measured on the first build, the
       phone's widest look into the shop drew 406k triangles, three quarters of them pieces a few pixels tall at their
       full 2–12k. A file with no levels stands as it is, always */
    const stockLods = [], STOCK_NEAR = 0.04;
    /* (v24.36) `done`, if given, is handed every InstancedMesh made, once they stand (the samnak's cabinets shake theirs
       with the room and put their stand-ins away); without it, as before */
    function manyOf(key, list, parent, size = 0.06, done = null) {
      if (!list.length) return;
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        const lv = { near: [], far: [] }, made = [];
        src.traverse(o => {
          if (!o.isMesh) return;
          const mat = o.material.clone(); mats.push(mat); bronzeLift({ material: mat });
          const im = new THREE.InstancedMesh(o.geometry, mat, list.length);
          list.forEach((it, i) => {
            _me.set(it.rx || 0, it.ry || 0, it.rz || 0, 'YXZ'); _mq.setFromEuler(_me);
            _mm.compose(_mp.set(it.x, it.y, it.z), _mq, _ms.setScalar(it.s || 1)).multiply(o.matrixWorld);
            im.setMatrixAt(i, _mm);
          });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
          im.castShadow = false; im.receiveShadow = true; im.name = 'stock:' + key;
          parent.add(im); owned.push(im); made.push(im);
          if (/_far$/.test(o.name)) lv.far.push(im); else if (/_near$/.test(o.name)) lv.near.push(im);
        });
        if (lv.near.length && lv.far.length) {
          /* the place's sphere in the world: the middle of its pieces and the farthest of them from it; and the size of
             its pieces on the shelf (the file's own height times their largest scale) */
          const c = new THREE.Vector3(); for (const it of list) c.add(_mp.set(it.x, it.y, it.z)); c.divideScalar(list.length);
          let r = 0; for (const it of list) r = Math.max(r, c.distanceTo(_mp.set(it.x, it.y, it.z)));
          parent.updateMatrixWorld(true); parent.localToWorld(c);
          const sMax = list.reduce((a, it) => Math.max(a, it.s || 1), 0);
          for (const im of lv.near) im.visible = false;                  // the far level until the first frame asks
          stockLods.push({ near: lv.near, far: lv.far, c, r: r + 0.05, size: size * sMax, on: false });
        }
        if (done) done(made);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const _sl = new THREE.Vector3();
    function stockLod() {
      if (!stockLods.length) return;
      camera.getWorldPosition(_sl);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of stockLods) {
        const d = Math.max(0.05, _sl.distanceTo(L.c) - L.r), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue;
        L.on = on;
        for (const im of L.near) im.visible = on;
        for (const im of L.far) im.visible = !on;
      }
    }
    /* A SEAM'S TWINS MOVE AS ONE (v24.5, found by the photographs of Pong's head: a hair-thin dark line ran across the
       room's floor from behind his arm to the far wall). One vertex of his trousers, at his right hip, is weighted wholly
       to his LEFT KNEE while its two twins at the same place (a seam's copies) follow his hips — sat cross-legged, his
       knee carries it a metre off and three triangles of a 2 cm cap stretch into a needle across the floor. Twins at one
       place must deform as one: a vertex whose twins agree on a bone it carries no weight on at all takes their weights.
       Once a file, on the parse every clone shares; how many each file needed is kept (`stage.mends`) */
    const twinMends = {};
    function mendTwins(key, root) {
      let n = 0;
      root.traverse(m => {
        if (!m.isSkinnedMesh) return;
        const g = m.geometry, pa = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
        if (!pa || !si || !sw) return;
        let mine = 0;
        g.computeBoundingBox(); const bb = g.boundingBox;
        const tol = 1.5e-3 * Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);   // ~2.5 mm on a body
        const bones = m.skeleton ? m.skeleton.bones : [], near = (a, b2) => { const A = bones[a], B = bones[b2];
          return !A || !B || A === B || A.parent === B || B.parent === A; };   // a joint's own boundary is never mended
        if (!(tol > 0)) return;
        const fast = FASTTWINS ? twinsFast(pa, si, sw, tol, near) : -1;
        if (fast >= 0) { n += fast; mine += fast; }
        else {
          const cell = (v) => Math.floor(v / tol), cells = new Map(), K = (a, b2, c) => a + ',' + b2 + ',' + c;
          for (let i = 0; i < pa.count; i++) {
            const k = K(cell(pa.getX(i)), cell(pa.getY(i)), cell(pa.getZ(i)));
            let c = cells.get(k); if (!c) cells.set(k, c = []); c.push(i);
          }
          const dom = (i) => { let k = 0; for (let q = 1; q < 4; q++) if (sw.getComponent(i, q) > sw.getComponent(i, k)) k = q; return si.getComponent(i, k); };
          const weightOn = (i, bone) => { let w = 0; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bone) w += sw.getComponent(i, q); return w; };
          for (let i = 0; i < pa.count; i++) {
            const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), cx = cell(x), cy = cell(y), cz = cell(z), tw = [];
            for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) {
              const l = cells.get(K(cx + a, cy + b2, cz + c)); if (!l) continue;
              for (const j of l) if (j !== i && Math.hypot(pa.getX(j) - x, pa.getY(j) - y, pa.getZ(j) - z) <= tol) tw.push(j);
            }
            if (tw.length < 2) continue;
            const d0 = dom(tw[0]);
            if (!tw.every(j => dom(j) === d0) || weightOn(i, d0) > 0 || near(dom(i), d0)) continue;
            for (let q = 0; q < 4; q++) { si.setComponent(i, q, si.getComponent(tw[0], q)); sw.setComponent(i, q, sw.getComponent(tw[0], q)); }
            n++; mine++;
          }
        }
        if (mine) { si.needsUpdate = true; sw.needsUpdate = true; }
      });
      if (n) twinMends[key] = n;
    }

    /* (v26.11, FASTTWINS: the speed-ups' third, the load's own work. The search above built a text key for every vertex and
       twenty-seven more for its neighbours' cells, on every vertex of every body file: 31 of the 96 seconds this box took
       to reach play. Here the same cells, of the same Math.floor(v / tol), are keyed by one exact whole number (the three
       cell numbers in mixed radix over the file's own range of cells, -0 the same as 0 as the text was), each cell's list
       in the vertices' own order, the neighbours visited in the same order, each position read once (the same doubles
       getX gives), the same distance test: so every vertex finds the same twins in the same order and is mended with the
       same weights. A file with a coordinate that is not a finite number takes the search above. `?opt=fastTwins:0`
       takes it always; the proof hashes every mended skin both ways (stage.twinHash)) */
    function twinsFast(pa, si, sw, tol, near) {
      const N = pa.count, X = new Float64Array(N), Y = new Float64Array(N), Z = new Float64Array(N), C = new Float64Array(3 * N);
      let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
      for (let i = 0; i < N; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return -1;
        X[i] = x; Y[i] = y; Z[i] = z;
        const cx = Math.floor(x / tol), cy = Math.floor(y / tol), cz = Math.floor(z / tol);
        C[3 * i] = cx; C[3 * i + 1] = cy; C[3 * i + 2] = cz;
        if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy; if (cz < z0) z0 = cz; if (cz > z1) z1 = cz;
      }
      if (!(N > 0)) return 0;
      const sy = y1 - y0 + 3, sz = z1 - z0 + 3;
      if (!((x1 - x0 + 3) * sy * sz < 4503599627370496)) return -1;          // (2^52: every key an exact whole number)
      const key = (a, b2, c) => ((a - x0 + 1) * sy + (b2 - y0 + 1)) * sz + (c - z0 + 1);
      const cells = new Map();
      for (let i = 0; i < N; i++) { const k = key(C[3 * i], C[3 * i + 1], C[3 * i + 2]); let c = cells.get(k); if (!c) cells.set(k, c = []); c.push(i); }
      const dom = (i) => { let k = 0; for (let q = 1; q < 4; q++) if (sw.getComponent(i, q) > sw.getComponent(i, k)) k = q; return si.getComponent(i, k); };
      const weightOn = (i, bone) => { let w = 0; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bone) w += sw.getComponent(i, q); return w; };
      /* (a neighbour's key is the vertex's own plus a fixed whole number, in the old order: a, then b2, then c, each -1 to
         1; and the distance test is decided by the squares where they are clear of tol by a millionth of a millionth,
         Math.hypot only in between, so every decision is Math.hypot's own) */
      const syz = sy * sz, OFF = [], t2 = tol * tol, t2lo = t2 * (1 - 1e-9), t2hi = t2 * (1 + 1e-9);
      for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) OFF.push(a * syz + b2 * sz + c);
      let mine = 0; const tw = [];
      for (let i = 0; i < N; i++) {
        const x = X[i], y = Y[i], z = Z[i], kc = key(C[3 * i], C[3 * i + 1], C[3 * i + 2]); tw.length = 0;
        for (let o = 0; o < 27; o++) {
          const l = cells.get(kc + OFF[o]); if (!l) continue;
          for (const j of l) { if (j === i) continue; const dx = X[j] - x, dy = Y[j] - y, dz = Z[j] - z, q = dx * dx + dy * dy + dz * dz;
            if (q > t2hi) continue; if (q < t2lo || Math.hypot(dx, dy, dz) <= tol) tw.push(j); }
        }
        if (tw.length < 2) continue;
        const d0 = dom(tw[0]);
        if (!tw.every(j => dom(j) === d0) || weightOn(i, d0) > 0 || near(dom(i), d0)) continue;
        for (let q = 0; q < 4; q++) { si.setComponent(i, q, si.getComponent(tw[0], q)); sw.setComponent(i, q, sw.getComponent(tw[0], q)); }
        mine++;
      }
      return mine;
    }

    /* ------------------------------------------------- the flat's surfaces (none from a picture yet: every one is
       painted below; the table stays so the copied loaders read their own) */
    const SURF = {};
    const surfTex = new Map();
    function surfLoad(name) {
      if (!surfTex.has(name)) {
        const key = 'w4t_' + name;
        if (!have(key)) { waiting.add(key); surfTex.set(name, Promise.resolve(null)); }
        else surfTex.set(name, loadImageTexture(key, SURF[name][1]).then(t => { if (t && alive) madeTex.push(t); return alive ? t : null; }).catch(() => null));
      }
      return surfTex.get(name);
    }
    /* a material of a surface. o: tile [u, v] metres (or one number), mirror 'u' | 'v' | 'uv', clamp (one picture, laid
       once: its piece is drawn with tile = its own size), tint, basic (unlit), cut (its holes cut out), and whatever else
       a material takes */
    function surf(name, o = {}) {
      const { tile = 1, mirror = '', tint = null, gain = null, basic = false, cut = false, clampV = false, clamp = false, ...rest } = o;
      const lift = (c) => { if (gain != null) { const k = Array.isArray(gain) ? gain : [gain, gain, gain]; c.r *= k[0]; c.g *= k[1]; c.b *= k[2]; } return c; };
      const avg = lift(new THREE.Color(SURF[name][0])); if (tint != null) avg.multiply(new THREE.Color(tint));
      const base = { color: avg, ...rest };
      if (!basic) { if (base.roughness == null) base.roughness = 0.9; if (base.metalness == null) base.metalness = 0; }
      if (cut) { base.alphaTest = 0.5; base.side = THREE.DoubleSide; }
      const m = basic ? B(base) : M(base);
      surfLoad(name).then(t0 => {
        if (!t0 || !alive) return;
        const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : /u/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : /v/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1);
        m.map = t; lift(m.color.set(tint != null ? tint : 0xffffff)); m.needsUpdate = true;
      });
      return m;
    }
    /* a surface's picture with its own holes and ONE flat colour (a fretwork painted pale grey: the cut-out is the
       picture's, the paint is not). The picture is drawn once onto a canvas and filled through its own alpha */
    function surfFlat(name, css, o = {}) {
      const { tile = 1, clampV = false, clamp = false, ...rest } = o;
      const m = M({ color: css, roughness: 0.85, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide, ...rest });
      surfLoad(name).then(t0 => {
        if (!t0 || !alive || !t0.image) return;
        const im = t0.image, c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
        const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping; t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1); m.map = t; m.needsUpdate = true;
      });
      return m;
    }

    /* ------------------------------------------------- what never moves is merged, one mesh a material
       quad(): a flat four-cornered piece, a → b its u and a → d its v, both in metres (front: a, b, c, d anticlockwise).
       box(): six of them. geo(): any three geometry, its own UVs scaled. flush() makes the meshes. */
    const batches = new Map();
    const batchOf = (mat) => { let b = batches.get(mat); if (!b) batches.set(mat, b = { mat, p: [], n: [], u: [] }); return b; };
    function quad(mat, a, b, c, d, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = d[0] - a[0], dy = d[1] - a[1], dz = d[2] - a[2];
      const lu = Math.hypot(ax, ay, az), lv = Math.hypot(dx, dy, dz);
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const P = [a, b, c, a, c, d], U = [[u0, v0], [u0 + lu, v0], [u0 + lu, v0 + lv], [u0, v0], [u0 + lu, v0 + lv], [u0, v0 + lv]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); }
    }
    /* a triangle (a gable's end), its UVs the wall's own metres from a */
    function tri(mat, a, b, c, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2];
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const lu = Math.hypot(ax, az) || Math.hypot(ax, ay, az), hu = Math.hypot(dx, dz);
      const U = [[u0, v0], [u0 + lu, v0 + ay], [u0 + hu, v0 + dy]];
      [a, b, c].forEach((p, i) => { Bt.p.push(p[0], p[1], p[2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); });
    }
    /* a flat piece of any number of corners (anticlockwise from its front), its UVs true metres: u along its first edge,
       v up the piece. A hip roof's trapezoid drawn as a quad() would squeeze its tiles toward the hip. */
    function planar(mat, pts, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat), a = pts[0], b = pts[1], c = pts[2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], ul = Math.hypot(ux, uy, uz) || 1, ex = ux / ul, ey = uy / ul, ez = uz / ul;
      let nx = uy * (c[2] - a[2]) - uz * (c[1] - a[1]), ny = uz * (c[0] - a[0]) - ux * (c[2] - a[2]), nz = ux * (c[1] - a[1]) - uy * (c[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const vx = ny * ez - nz * ey, vy = nz * ex - nx * ez, vz = nx * ey - ny * ex;
      for (let i = 1; i < pts.length - 1; i++) for (const q of [pts[0], pts[i], pts[i + 1]]) {
        const dx = q[0] - a[0], dy = q[1] - a[1], dz = q[2] - a[2];
        Bt.p.push(q[0], q[1], q[2]); Bt.n.push(nx, ny, nz); Bt.u.push(u0 + dx * ex + dy * ey + dz * ez, v0 + dx * vx + dy * vy + dz * vz);
      }
    }
    const floor = (mat, x0, z0, x1, z1, y = 0) => quad(mat, [x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], x0, -z1);
    /* an upright piece from (x0, z0) to (x1, z1): it faces the left of that way (west to east faces south) */
    const wall = (mat, x0, z0, x1, z1, y0, y1, u0 = 0) => quad(mat, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], u0, y0);
    function box(mat, cx, cy, cz, w, h, d, ry = 0, top = mat, skipBottom = true) {
      const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hh = h / 2, hd = d / 2;
      const P = (lx, ly, lz) => [cx + lx * c + lz * s, cy + ly, cz - lx * s + lz * c];
      const a = P(-hw, -hh, hd), b = P(hw, -hh, hd), e = P(hw, -hh, -hd), f = P(-hw, -hh, -hd);
      const a1 = P(-hw, hh, hd), b1 = P(hw, hh, hd), e1 = P(hw, hh, -hd), f1 = P(-hw, hh, -hd);
      quad(mat, a, b, b1, a1, 0, cy - hh); quad(mat, b, e, e1, b1, 0, cy - hh); quad(mat, e, f, f1, e1, 0, cy - hh); quad(mat, f, a, a1, f1, 0, cy - hh);
      quad(top, a1, b1, e1, f1);
      if (!skipBottom) quad(mat, f, e, b, a);
    }
    const _gm = new THREE.Matrix4(), _gv = new THREE.Vector3(), _gn = new THREE.Matrix3();
    function geo(mat, g0, m4, su = 1, sv = 1) {
      const g = g0.index ? g0.toNonIndexed() : g0, Bt = batchOf(mat);
      const pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv;
      _gn.getNormalMatrix(m4);
      for (let i = 0; i < pa.count; i++) {
        _gv.fromBufferAttribute(pa, i).applyMatrix4(m4); Bt.p.push(_gv.x, _gv.y, _gv.z);
        _gv.fromBufferAttribute(na, i).applyMatrix3(_gn).normalize(); Bt.n.push(_gv.x, _gv.y, _gv.z);
        Bt.u.push(ua ? ua.getX(i) * su : 0, ua ? ua.getY(i) * sv : 0);
      }
      if (g !== g0) g.dispose(); g0.dispose();
    }
    /* an upright round post from the ground (or y0) to y1 */
    function post(mat, x, z, r, y0, y1, sides = 8, r1 = r) {
      geo(mat, new THREE.CylinderGeometry(r1, r, y1 - y0, sides, 1, true), _gm.makeTranslation(x, (y0 + y1) / 2, z), 2 * Math.PI * r, y1 - y0);
    }
    /* a straight round bar between two points */
    const _ba = new THREE.Vector3(), _bb = new THREE.Vector3(), _bq = new THREE.Quaternion(), _bu = new THREE.Vector3(0, 1, 0), _bs = new THREE.Vector3(1, 1, 1);
    function bar(mat, a, b, r, sides = 6) {
      _ba.set(a[0], a[1], a[2]); _bb.set(b[0], b[1], b[2]);
      const len = _ba.distanceTo(_bb); if (len < 1e-4) return;
      _bq.setFromUnitVectors(_bu, _bb.clone().sub(_ba).normalize());
      _gm.compose(_ba.clone().add(_bb).multiplyScalar(0.5), _bq, _bs);
      geo(mat, new THREE.CylinderGeometry(r, r, len, sides, 1, true), _gm, 2 * Math.PI * r, len);
    }
    function flush(parent = world) {
      for (const Bt of batches.values()) {
        if (!Bt.p.length) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(Bt.p, 3));
        g.setAttribute('normal', new THREE.Float32BufferAttribute(Bt.n, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(Bt.u, 2));
        g.computeBoundingSphere(); g.computeBoundingBox();
        const m = new THREE.Mesh(g, Bt.mat); m.receiveShadow = false; m.castShadow = false; m.matrixAutoUpdate = false; m.updateMatrix();
        parent.add(m); owned.push(m);
      }
      batches.clear();
    }

    /* (a seeded stream, v6.15: every scatter in this chapter is the same scatter on every run. `rng` is at the file's
       foot, beside the drawn surfaces that also use it) */

    /* ------------------------------------------------- a model stood once (a tree, a seat, the parasol)
       Prepped in real metres with its origin on its base's middle (v13.1), so a place is a place; `h` fits one that
       was not (a tree from an earlier chapter) to a height. Answers the group at once; the model lands in it. */
    function stand(key, x, y, z, ry = 0, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; (o.parent || world).add(g);
      if (!have(key)) { waiting.add(key); return g; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        const m = src.clone(true);
        m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; q.material = q.material.clone(); mats.push(q.material); bronzeLift(q, o.lift || 3); } });
        if (o.h) { m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(m); const k = o.h / Math.max(1e-3, bb.max.y - bb.min.y);
          m.scale.multiplyScalar(k); m.position.y -= bb.min.y * k; m.position.x -= (bb.min.x + bb.max.x) / 2 * k; m.position.z -= (bb.min.z + bb.max.z) / 2 * k; }
        if (o.s) m.scale.multiplyScalar(o.s);
        g.add(m); g.userData.model = m;
        if (o.done) o.done(m, g);
        /* a file of TWO LEVELS (props/lods.sh: nodes <key>_near and <key>_far over the same vertices): the far one is
           drawn until the piece stands taller than a twenty-fifth of the screen (lodTick, the measure many() uses) */
        const near = [], far = []; m.traverse(q => { if (q.isMesh) { if (/_far$/.test(q.name)) far.push(q); else if (/_near$/.test(q.name)) near.push(q); } });
        /* (o.near: a copy that is only ever seen close, in his hands: its full level always, and no place in the world
           for lodTick to measure) */
        if (near.length && far.length && o.near) { for (const q of far) q.visible = false; }
        else if (near.length && far.length) { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3());
          for (const q of near) q.visible = false;
          standLods.push({ near, far, c, r: 0, size: Math.max(0.05, bb.max.y - bb.min.y), on: false, g, moves: !!o.moves }); }
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return g;
    }
    /* every two-level thing's level, from the lens: called every frame of play, and by a film on its own clock (a cut
       chooses from the cut's own lens: v24.22). stockLod is many()'s (the copied one); this is stand()'s, the same rule */
    const standLods = [], _sl2 = new THREE.Vector3();
    function lodTick() {
      stockLod();
      if (!standLods.length) return;
      camera.getWorldPosition(_sl2);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of standLods) { if (L.g && L.moves) L.g.getWorldPosition(L.c).y += L.size / 2;                // (a thing the play carries about is measured where it is now)
        const d = Math.max(0.05, _sl2.distanceTo(L.c)), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue; L.on = on;
        for (const q of L.near) q.visible = on; for (const q of L.far) q.visible = !on; }
    }
    /* A HUE TURNED in a material (one soda bottle in red, orange and green; one small candle in pink and blue): the
       picture's own colour is turned about the grey axis before the light falls on it, so whites, blacks and greys
       stay as they are. A program of its own for each angle (compiled under the curtain with the rest: v14.15) */
    function hueTurn(mat, deg) {
      const a = deg * Math.PI / 180, uHue = { value: new THREE.Vector2(Math.cos(a), Math.sin(a)) };
      mat.onBeforeCompile = (sh) => { sh.uniforms.uHue = uHue;
        sh.fragmentShader = 'uniform vec2 uHue;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ vec3 hk = vec3(0.57735); vec3 hv = diffuseColor.rgb; diffuseColor.rgb = hv * uHue.x + cross(hk, hv) * uHue.y + hk * dot(hk, hv) * (1.0 - uHue.x); }'); };
      mat.customProgramCacheKey = () => 'hueTurn';
      mat.needsUpdate = true;
    }
    /* many of one thing (the copied manyOf), asked for only once its file is in the build */
    function many(key, list, parent = world, size = 0.3, done = null) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      manyOf(key, list, parent, size, done);
    }


    /* ================================================================ THE PEOPLE: chapter 3's machinery, as chapters 4 and
       5 copied it and mended it (one skeleton and several skins a person, the takes at weights, the films' poses by the
       clock, the feet set down by their own lowest contact, the head's and the shoulders' restraint, the hands laid by
       numbers, the levels by the lens), and its posture laws for a body sat or stood up straight. Every one of its laws
       was learned on those chapters' bodies; see its own notes. The one change (assemble.py EDITS): the bodies drawn
       without mipmaps are this chapter's (p51) and its stand-ins' as their own chapters drew them. */
    /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)
       Every body here was made for this chapter end to end (a reference on white in an A pose, Meshy at its highest
       settings, its rig with fingers, the library's takes and written ones: masters/v26.0/make.sh §1 to §3), prepped in
       real metres with its feet on the origin and its face along +z. Nobody is a block figure: a person is not drawn at
       all until its model has landed (v21.16).

       A PERSON is a group with the rig cloned into it and one mixer. Its takes all run, each at a weight; `take()` names
       the one that should be full and the rest ease out. A take may hold the body off its own origin (v25.5: measured
       per take, at its first moment), so each is brought back onto the person's spot as its weight rises. In a film a
       person is posed by the film's clock (`pose()`: the take and the moment, absolute, so a seek lands on the same
       picture: v6.4); in play the wall clock runs them.

       ONE SKELETON, SEVERAL SKINS (the tracker's §5 "The levels"). A person's file holds the body drawn from near by;
       `<key>m` and `<key>f` are the same body rebuilt lighter (Meshy's own remesh at 8,000 and 2,500 triangles, the
       rig laid on each by tools/riglod.mjs), and `<key>h` is the generator's own model with every triangle: for the two
       he speaks to face to face, and since v26.4 for the four seated masters and the woman lighting the candles (Chad, 13
       Nov 2026, of the brown hermit drawn from his 30,665-triangle body where he stood over him: "Why is the brown lersi
       so blocky here"; "30k triangles up close should never have been allowed"; and, told what a full body costs a
       phone: "Only the important people like ton, candle lighter female, seated masters, pho, and those that already are
       built this way can retain."). A crowd's driver takes none: its members never draw one.
       Each lighter or fuller skin is bound to the near body's own bones by name, so it
       wears every take and costs no skeleton; which one is drawn is chosen every frame from the lens (and so at a cut
       from the cut's own lens: v24.22), with a little slack so a person standing on a boundary does not flicker. */
    const people = [];
    /* NO SHRUNKEN COPIES OF A GENERATED BODY'S PAINT (v5.11's law, found again on 12 Nov: photographed on a phone's frame,
       every dark head on the turf was speckled white, a child's most of all). A generated body's sheet is hundreds of
       small patches packed edge to edge, each padded into its neighbours: black hair lies flush against white cloth.
       Every shrunken copy of the sheet averages one patch with the next, so a head drawn small is sampled from white
       and black mixed, along every seam of its hair. Plain sampling of the sheet itself never reaches past a texel,
       and the padding makes that texel the patch's own colour. Every body this chapter made (keys e4...), at every
       level; Chad's own models (Grandmaster Pho, the monk) are as he gave them and are not touched. */
    const NOMIP = /^p(51|5|4)/;
    /* v26.1 · A SHEET LAID OUT AGAIN WITH ROOM BETWEEN ITS CHARTS IS DRAWN WITH MIPMAPS (Chad, 12 Nov 2026: the faces
       "absolutely butchered", "really bad" on a 720p phone, "absolutely horrendous" on his own phone). Drawn without them, a
       face with more texels than the phone has pixels was SAMPLED: it sparkled and crawled as anything moved, and a still
       picture hides that. Every level of every body this chapter made is now baked into a sheet with a margin round each
       chart (masters/v26.0/people.sh REPAINT, tools/repaint.py), named `repainted`: such a sheet takes mipmaps and a
       little anisotropy, because averaging it can no longer bleed one chart into the next (v5.11's own answer). A sheet of
       any other name is drawn as it was. */
    /* (and A FACE BAKED ON A SHEET OF ITS OWN, `detail` (v26.3, Ton's: Chad, 13 Nov 2026, "the male character that the player
       keeps talking to, his face is too low res and compressed and blocky looking, improve it"). His full model kept the
       generator's flush charts (the repaint overlapped on its 310,000 triangles), so it was drawn without mipmaps, and from
       where he is talked to his face had three texels a pixel, sampled. His head's charts are baked by Blender into a 2048
       sheet of their own with a gutter round each (tools/rebake.py DETHANDS=0, masters/v26.3/make.sh), 1.6 times the
       texels, so it takes mipmaps as a repainted sheet does. Grandmaster Pho's own `detail` is his and is not touched) */
    /* A POSED VERTEX WITH EACH BONE'S MATRIX MADE ONCE A POSE (v26.11, FASTSKIN: the speed-ups' third, the load's own
       work). three's getVertexPosition multiplies a bone's world matrix by its inverse bind for every weight of every
       vertex it is asked for, and the chapter asks for every vertex of every body, at every moment it measures (the
       feet on the ground, the seats, the shins, the room round a body: several seconds of the load on this box). The
       product is the same sixteen numbers for every vertex of one pose, so it is made once a pose and a bone, by the
       same multiplyMatrices, and every vertex then takes three's own steps with it in the same order: the same base
       position (Mesh's, morphs and all), the same bind, the same weighted sum, the same inverse. `?opt=fastSkin:0` asks
       three every time; the proof reads every vertex of every body both ways (stage.skinProof) */
    const _svI = new THREE.Vector4(), _svW = new THREE.Vector4(), _svB = new THREE.Vector4(), _sv4 = new THREE.Vector4(), _svMats = new WeakMap();
    function skinMats(q) {
      const S = q.skeleton, bones = S.bones, inv = S.boneInverses;
      let L = _svMats.get(q); if (!L || L.length !== bones.length) { L = bones.map(() => new THREE.Matrix4()); _svMats.set(q, L); }
      for (let b = 0; b < bones.length; b++) L[b].multiplyMatrices(bones[b].matrixWorld, inv[b]);
      return L;
    }
    function skinVertex(q, i, target, L) {
      THREE.Mesh.prototype.getVertexPosition.call(q, i, target);
      const g = q.geometry;
      _svI.fromBufferAttribute(g.attributes.skinIndex, i); _svW.fromBufferAttribute(g.attributes.skinWeight, i);
      _svB.set(target.x, target.y, target.z, 1); target.set(0, 0, 0);
      _svB.applyMatrix4(q.bindMatrix);
      for (let k = 0; k < 4; k++) { const w = _svW.getComponent(k); if (w !== 0) { const b = _svI.getComponent(k); target.addScaledVector(_sv4.copy(_svB).applyMatrix4(L[b]), w); } }
      return target.applyMatrix4(q.bindMatrixInverse);
    }
    /* (v26.11: ONCE. A body made for one film borrows the near body's sheet (addLevel), and setting it up again asked the
       chip for a second upload of the same picture with the same settings, at the film's start. A sheet this has already
       set, whose settings are still the ones it set, is left as it is: what is on the chip is what that upload would have
       put there. `?opt=sheetOnce:0` sets it again as before) */
    const SHEETED = new WeakSet();
    function sheetOf(key, t) {
      if (t.name === 'repainted' || (t.name === 'detail' && NOMIP.test(key))) {
        if (SHEETONCE && SHEETED.has(t) && t.generateMipmaps === true && t.minFilter === THREE.LinearMipmapLinearFilter && t.anisotropy === 4) return t;
        t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; t.needsUpdate = true; SHEETED.add(t); return t; }
      if (!NOMIP.test(key)) return t;
      if (SHEETONCE && SHEETED.has(t) && t.generateMipmaps === false && t.minFilter === THREE.LinearFilter) return t;
      SHEETED.add(t);
      return noMip(THREE, t);
    }
    /* (the children's runs and their skip too: c_crowd.js) */
    const WALKS = /^(walkdance|Run_02|Run_03|Walking)$/;                                 // (the takes that travel: the dancers' walk-dance, the children's two runs)
    /* (the full model's reach was 2.7 m until 12 Nov. Photographed at 2.55 m at both levels, on a phone's frame and a
       desktop's, magnified: no difference to be seen at that distance, and the full model is 310,000 triangles. At
       2.2 m (taken up inside 2.05, let go past 2.35, measured from the lens) it is drawn where he has walked up to
       talk, which is what it was made for: the view from his place in the line, where the woman at the bench stood
       inside the old reach, went from 832,000 triangles to 563,000. It was NOT the spawn's weight, as I first wrote:
       from the spawn Ton was already outside the old reach's own taking-up (2.51 m from the lens). That was the
       sandals behind him: c_zfx.js) */
    /* (v26.1: the near body drawn to 7 m, where it was 5.4, and the mid to 14, where it was 11.5: Chad, 12 Nov 2026, "even on
       the phone, i want a higher rendering budget". Each body's paint is laid out with margins and drawn with mipmaps
       now (sheetOf, above), and the face has three times the robe's share of each sheet: where the near body hands over,
       its face is drawn at about the mid body's own detail, so nothing pops; measured on the brown hermit, 1,091 texels a
       metre on the near face and 186 on the mid's, against a phone's 166 pixels a metre of a face at 7 m) */
    const LEVELS = [['h', 2.2], ['', 7.0], ['m', 14], ['f', Infinity]];         // each skin's suffix and how far it is drawn to
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _lens = new THREE.Vector3();
    /* the soft dark under a body (a phone draws no shadows, so a contact shadow is painted: v9.3) */
    const blobTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
      x.clearRect(0, 0, 64, 64);
      g.addColorStop(0, 'rgba(0,0,0,0.62)'); g.addColorStop(0.55, 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const blobGeo = new THREE.PlaneGeometry(1, 1); blobGeo.rotateX(-Math.PI / 2);        // (dispose() finds it through the world, as it finds every geometry)
    const blobMat = B({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const blob = (parent, w = 0.85, d = 0.7) => { const m = new THREE.Mesh(blobGeo, blobMat); m.position.y = 0.014; m.scale.set(w, 1, d); m.renderOrder = 2; parent.add(m); return m; };

    /* A WALK THAT IS NOT A LOOP, MADE ONE (o.loops: { take: [from, to, blend] }). A written take (text-to-motion) starts
       from standing and stops in mid-stride: played round, it jumps at its end. So one whole cycle of it is cut out, from
       a heel's strike to the same heel's next (tools/probes/gait.mjs reads the strikes), where the pace has settled; the
       hips' travel over that cycle is taken out evenly (the group travels: WALKS, below), and over the last `blend`
       seconds every joint is eased onto what it was doing one cycle earlier, so the end IS the start. v5.20: what is
       missing is made from what the file has. */
    const _lqa = new THREE.Quaternion(), _lqb = new THREE.Quaternion();
    function loopOf(clip, t0, t1, blend) {
      const L = t1 - t0, N = Math.max(8, Math.round(L * 30)), times = new Float32Array(N + 1); let travel = null;
      for (let i = 0; i <= N; i++) times[i] = L * i / N;
      const tracks = clip.tracks.map(tr => { const n = tr.getValueSize(), it = tr.createInterpolant(new Float32Array(n)), isQ = /\.quaternion$/.test(tr.name), hip = /Hips\.position$/.test(tr.name);
        const at = (t) => Array.from(it.evaluate(Math.max(0, Math.min(clip.duration, t))));
        const a0 = hip ? at(t0) : null, a1 = hip ? at(t1) : null;
        if (hip) travel = [a1[0] - a0[0], a1[2] - a0[2]];
        const val = (t) => { const v = at(t); if (hip) { const k = (t - t0) / L; v[0] -= (a1[0] - a0[0]) * k; v[2] -= (a1[2] - a0[2]) * k; } return v; };
        const out = new Float32Array((N + 1) * n);
        for (let i = 0; i <= N; i++) { const a = val(t0 + times[i]), w = blend > 0 ? smo(c01((times[i] - (L - blend)) / blend)) : 0;
          if (w > 0) { const b = val(t0 + times[i] - L);
            if (isQ) { _lqa.fromArray(a).slerp(_lqb.fromArray(b), w).toArray(a); } else for (let k = 0; k < n; k++) a[k] += (b[k] - a[k]) * w; }
          out.set(a, i * n); }
        return new tr.constructor(tr.name, times, out); });
      const made = new THREE.AnimationClip(clip.name, L, tracks); made.travel = travel;
      return made;
    }
    /* THE CROSS-LEGGED SEAT (v26.18: Chad, 16 Nov 2026, the morning's meeting moved inside the main hall: "Grandmaster pho
       is seated inside the main hall, waiting for the player", its inside "exactly the same as the photos"; in his
       photographs 2 to 4 of it the master sits cross-legged on the dais, in white, his lower cloth smooth over both
       knees, his right hand over the front of his lap, his left in it). o.cross seats a body so, from what its own
       file has (v5.20), and it is asked for by one person only, the hall's Grandmaster Pho: the bench's is a person of
       his own and is exactly as he was. Every step was photographed in the pose lab before the next was built, and
       three first tries were refused by photograph (the tracker's log, docs/V26.18-E4C3-HALL.md):
       1. THE TAKES ARE MIXED (crossTakes). His own floor take cannot be drawn close: its robe below the waist is a
          slab with a torn notch (one tube of cloth cannot wrap two crossed legs: v24.47), and it leans back 23
          degrees. So his hips, his legs and the bones of his robe below the waist are HELD at one moment of it
          (K.low at K.at), and everything above comes from a bench take, as it moves. His spine is given the turn that
          keeps his trunk as the bench take has it IN THE WORLD (the two takes hold his hips 27 degrees apart), and
          then his trunk is stood upright and square: over the stretch named (t0 to t1) its own frame is read (his
          left, his spine's line, his front) and turned onto a trunk leaning `lean` degrees forward (measured: his
          bench rest leans 16.5 degrees forward, 5.5 to his left and is turned 8; his bench talk leans back 6).
       2. HIS ROBE IS ENDED IN A LEVEL HEM, K.hem over the cushion (crossHem): his robe below the waist is a skin of its
          own and is not drawn; of his main skin, his legs are not drawn, nor any triangle wholly under the hem (his
          arms aside); a low point of a triangle that crosses the hem is brought up onto it, where the pose has it,
          and set back through its own skinning (a point his robe's waist bone carried is given to his spine: the hem
          is of one piece with his trunk, and NO point of him is his hip bone's). An ARM is what an arm's bones carry
          AND stands within a hand's breadth of the arm's own line: the cloth that hangs from his left arm is carried
          by it too, and is cloth. Hidden by "any point the robe carries", icicles 8 cm long hung from him.
       3. THE CLOTH OVER HIS LEGS IS MADE (masters/v26.18/pho/lapcloth.py, in Blender, on his skin as the game poses
          it; K.lap its key): laid taut on a ring under the hem and on his legs, then let settle. Its top leans with
          his trunk: it is bound here to his spine and his hips, each point's share of his spine read off its height
          under the ring and its way out from his waist's middle (so nothing rides on an attribute a pack might
          drop). It takes his robe's own look (o.look, after this), so the two are one white.
       4. HIS HANDS REST ON THE CLOTH (crossHands), by numbers read off photograph 3: where each palm's middle lies,
          the way its fingers run, how far down the cloth's fall they may follow it, where its elbow stands.
       His hip joint rides K.hips over the cushion's top (the lowest of his legs 6 mm over it), and the person's
       group stands ON the cushion's top: put() him there with its height. */
    const CROSS_LOW = /^(mixamorig:?)?(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*)|(Left|Right)LegGraft\w*|Skirt\w*|Cloth\w*)\./;
    const _cxA = new THREE.Vector3(), _cxB = new THREE.Vector3();
    function crossTakes(P, animations, K) {
      const Lw = animations.find(c => c.name === K.low); if (!Lw) { console.warn(P.key + ': no take ' + K.low + ' to sit cross-legged in'); return; }
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const held = [], hipQ = new THREE.Quaternion();
      for (const t of Lw.tracks) { if (!CROSS_LOW.test(t.name)) continue; const v = Array.from(t.createInterpolant(new Float32Array(t.getValueSize())).evaluate(K.at)); held.push([t, v]); if (/Hips\.quaternion$/.test(t.name)) hipQ.fromArray(v); }
      const nk = bone('Neck'), sp = bone('Spine'), la = bone('LeftArm'), ra = bone('RightArm');
      P.group.updateWorldMatrix(true, false);
      for (const name in K.takes) { const U = animations.find(c => c.name === name), A0 = P.acts[name], F = K.takes[name];
        if (!U || !A0) { console.warn(P.key + ': no take ' + name + ' to sit cross-legged with'); continue; }
        const fix = new THREE.Quaternion();
        if (nk && sp && la && ra && P.hips && P.hips.parent) { const u = new THREE.Vector3(), s = new THREE.Vector3(), N = 9, t0 = F.t0 || 0, t1 = F.t1 != null ? F.t1 : U.duration;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          for (let i = 0; i < N; i++) { A0.time = t0 + (t1 - t0) * i / (N - 1); P.mixer.update(0); P.group.updateWorldMatrix(false, true);
            nk.getWorldPosition(_cxA); P.group.worldToLocal(_cxA); sp.getWorldPosition(_cxB); P.group.worldToLocal(_cxB); u.add(_cxA.sub(_cxB).normalize());
            la.getWorldPosition(_cxA); P.group.worldToLocal(_cxA); ra.getWorldPosition(_cxB); P.group.worldToLocal(_cxB); s.add(_cxA.sub(_cxB).normalize()); }
          A0.setEffectiveWeight(0);
          u.normalize(); s.addScaledVector(u, -s.dot(u)).normalize(); const f = new THREE.Vector3().crossVectors(s, u).normalize(), Ln = (F.lean || 0) * Math.PI / 180;
          const M0 = new THREE.Matrix4().makeBasis(s, u, f), M1 = new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, Math.cos(Ln), Math.sin(Ln)), new THREE.Vector3(0, -Math.sin(Ln), Math.cos(Ln)));
          const Rg = new THREE.Quaternion().setFromRotationMatrix(M1.multiply(M0.transpose())), aw = new THREE.Quaternion(), gw = new THREE.Quaternion();
          P.hips.parent.getWorldQuaternion(aw); P.group.getWorldQuaternion(gw); const c = aw.invert().multiply(gw); fix.copy(c).multiply(Rg).multiply(c.clone().invert()); }
        const tracks = U.tracks.filter(t => !CROSS_LOW.test(t.name)).map(t => t.clone());
        for (const [t, v] of held) tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v)));
        const hT = U.tracks.find(t => /Hips\.quaternion$/.test(t.name)), sT = tracks.find(t => /Spine\.quaternion$/.test(t.name));
        if (hT && sT) { const it = hT.createInterpolant(new Float32Array(4)), inv = hipQ.clone().invert(), a = new THREE.Quaternion(), b = new THREE.Quaternion(), vals = sT.values;
          /* (F.sway: on a bench his hips rock as he talks and all of him goes with them; cross-legged his seat is planted, and
             the whole of that rocking, given to his spine, swayed his trunk 15 degrees each way: so his hips' turn is taken
             only `sway` of the way from its middle over the take) */
          const mid = new THREE.Quaternion(), sway = F.sway != null ? F.sway : 1;
          if (sway < 1) { const acc = [0, 0, 0, 0], M = 24; for (let i = 0; i < M; i++) { a.fromArray(it.evaluate(U.duration * i / (M - 1))); if (i && a.x * acc[0] + a.y * acc[1] + a.z * acc[2] + a.w * acc[3] < 0) a.set(-a.x, -a.y, -a.z, -a.w); acc[0] += a.x; acc[1] += a.y; acc[2] += a.z; acc[3] += a.w; } mid.fromArray(acc).normalize(); }
          for (let i = 0; i < sT.times.length; i++) { a.fromArray(it.evaluate(sT.times[i])); if (sway < 1) a.copy(b.copy(mid).slerp(a, sway)); b.fromArray(vals, i * 4); a.multiply(b).premultiply(fix).premultiply(inv).normalize();
            if (i && (a.x * vals[i * 4 - 4] + a.y * vals[i * 4 - 3] + a.z * vals[i * 4 - 2] + a.w * vals[i * 4 - 1]) < 0) a.set(-a.x, -a.y, -a.z, -a.w);
            a.toArray(vals, i * 4); } }
        A0.stop(); P.mixer.uncacheAction(A0.getClip());
        const clip = new THREE.AnimationClip(name, U.duration, tracks), A = P.mixer.clipAction(clip); A.enabled = true; A.setEffectiveWeight(0); A.play(); P.acts[name] = A; P.w[name] = 0; }
    }
    /* (his hands on the cloth: `top` is the cloth's height under a point of his own frame) */
    function crossHands(P, spec, top) {
      const A = armsOf(P), R = {}, rep = {}; P.restHands = null; if (!A) return null;
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      for (const [sd, sg] of [['L', 1], ['R', -1]]) { const a = A[sd], sp = spec[sd]; if (!sp) continue;
        hingeOf(a, sg);
        const d = new THREE.Vector3(Math.sin(sp.yaw), 0, Math.cos(sp.yaw)), e = 0.03, x = sp.x, z = sp.z, y = top(x, z);
        if (!(y > -1)) { console.warn(P.key + ': no cloth under his ' + sd + ' hand at ' + x + ', ' + z); continue; }
        const sl = Math.max(-(sp.slope != null ? sp.slope : 0.4), Math.min(0.2, (top(x + d.x * e, z + d.z * e) - top(x - d.x * e, z - d.z * e)) / (2 * e)));
        const gx = (top(x + 0.03, z) - top(x - 0.03, z)) / 0.06, gz = (top(x, z + 0.03) - top(x, z - 0.03)) / 0.06;
        if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) { console.warn(P.key + ': the cloth ends under his ' + sd + ' hand'); continue; }
        const f = new THREE.Vector3(d.x, sl, d.z).normalize(), n = new THREE.Vector3(gx, -1, gz).normalize(); n.addScaledVector(f, -n.dot(f)).normalize();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = sp.palm != null ? sp.palm : (HM ? HM.len * 0.45 : a.palm), OFF = sp.off != null ? sp.off : (HM ? Math.max(0.015, HM.depth) : 0.022);
        const Cp = new THREE.Vector3(x, y + (sp.lift || 0), z), W = Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, -OFF);
        const Sh = loc(a.up, new THREE.Vector3()), lu = loc(a.fore, new THREE.Vector3()).distanceTo(Sh), lf = loc(a.hand, new THREE.Vector3()).distanceTo(loc(a.fore, new THREE.Vector3()));
        R[sd] = { W, pdir: new THREE.Vector3().fromArray(sp.pole).normalize(), f, n, fing: [] };
        if (sp.follow) { const fl = sp.follow.map(nm => P.bone[nm]).filter(b => b && b.parent === a.up.parent).map(b => ({ b, q: new THREE.Quaternion(), on: false })); if (fl.length) R[sd].fol = fl; }
        if (HM) { R[sd].fL = HM.fL; R[sd].nL = HM.nL; R[sd].aL = HM.aL; }
        rep[sd] = { palm: [x, +y.toFixed(3), z], wrist: W.toArray().map(q => +q.toFixed(3)), reach: +(W.distanceTo(Sh) / (lu + lf)).toFixed(3), slope: +sl.toFixed(2) }; }
      P.restHands = { how: 'lap', R, hold: spec.hold || null }; return rep;
    }
    /* (his robe's hem, cut in the pose he stands in now) */
    function crossHem(P, q, HEM) {
      const g = q.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, idx = g.index, n = pos.count, v = new THREE.Vector3(), bones = q.skeleton.bones;
      if (!pos || !si || !sw || !idx) return null;
      const sideB = bones.map(b => /^(mixamorig:?)?Left(Arm|ForeArm|Hand)/.test(b.name) ? 1 : (/^(mixamorig:?)?Right(Arm|ForeArm|Hand)/.test(b.name) ? 2 : 0));
      const legB = bones.map(b => /(UpLeg|Leg|Foot|Toe)/.test(b.name)), robeB = bones.map(b => /^(Skirt|Cloth)/.test(b.name)), spineI = bones.findIndex(b => /^(mixamorig:?)?Spine$/.test(b.name));
      P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
      const SM = skinMats(q), toG = new THREE.Matrix4().copy(P.group.matrixWorld).invert().multiply(q.matrixWorld), A = armsOf(P), w3 = new THREE.Vector3(), w4 = new THREE.Vector3(), w5 = new THREE.Vector3();
      const line = (sd) => { const a = A && A[sd]; if (!a) return null; const pts = [a.up, a.fore, a.hand].map(b => P.group.worldToLocal(b.getWorldPosition(new THREE.Vector3()))), tip = a.hand.children.find(c => c.isBone);
        if (tip) pts.push(P.group.worldToLocal(tip.getWorldPosition(new THREE.Vector3()))); return pts; };
      const LN = [null, line('L'), line('R')], RAD = [0.085, 0.085, 0.1];
      const near = (p, pts) => { if (!pts) return true; for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], ab = w3.copy(pts[k + 1]).sub(a), t = c01(ab.dot(w4.copy(p).sub(a)) / ab.lengthSq()); if (w5.copy(a).addScaledVector(ab, t).distanceTo(p) < RAD[k]) return true; } return false; };
      const V = new Float32Array(n * 3), Y = new Float32Array(n), arm = new Uint8Array(n), leg = new Uint8Array(n), robe = new Uint8Array(n), below = new Uint8Array(n);
      for (let i = 0; i < n; i++) { skinVertex(q, i, v, SM); V[i * 3] = v.x; V[i * 3 + 1] = v.y; V[i * 3 + 2] = v.z; v.applyMatrix4(toG); Y[i] = v.y; const aw = [0, 0, 0]; let lw = 0, rw = 0;
        for (let c = 0; c < 4; c++) { const j = si.getComponent(i, c), w = sw.getComponent(i, c); if (sideB[j]) aw[sideB[j]] += w; else if (legB[j]) lw += w; else if (robeB[j]) rw += w; }
        const sd = aw[1] >= aw[2] ? 1 : 2; arm[i] = aw[sd] > 0.5 && near(v, LN[sd]) ? 1 : 0; leg[i] = lw > 0.5 ? 1 : 0; robe[i] = rw > 0.5 ? 1 : 0; below[i] = !arm[i] && (leg[i] || robe[i] || Y[i] < HEM) ? 1 : 0; }
      const a = idx.array, out = new a.constructor(a.length), acc = new Float64Array(n * 5); let m = 0, cut = 0;
      for (let i = 0; i < a.length; i += 3) { const T = [a[i], a[i + 1], a[i + 2]], nb = below[T[0]] + below[T[1]] + below[T[2]];
        if (nb === 3 || (leg[T[0]] && leg[T[1]] && leg[T[2]])) continue;
        out[m++] = T[0]; out[m++] = T[1]; out[m++] = T[2]; if (!nb) continue; cut++;
        for (const p of T) if (below[p]) for (const u of T) if (!below[u] && Y[u] >= HEM) { acc[p * 5] += V[u * 3]; acc[p * 5 + 1] += V[u * 3 + 1]; acc[p * 5 + 2] += V[u * 3 + 2]; acc[p * 5 + 3] += Y[u]; acc[p * 5 + 4] += 1; } }
      /* (a triangle with a low point that nothing it keeps can bring up is not drawn either: the cloth that ran from his sleeve to his robe below the waist) */
      let m2 = 0, dropped = 0; for (let i = 0; i < m; i += 3) { const T0 = out[i], T1 = out[i + 1], T2 = out[i + 2];
        if ((below[T0] && !acc[T0 * 5 + 4]) || (below[T1] && !acc[T1 * 5 + 4]) || (below[T2] && !acc[T2 * 5 + 4])) { dropped++; continue; } out[m2++] = T0; out[m2++] = T1; out[m2++] = T2; }
      const copyOf = (at) => { const c2 = new THREE.BufferAttribute(new at.array.constructor(n * at.itemSize), at.itemSize, at.normalized); for (let i = 0; i < n; i++) for (let k = 0; k < at.itemSize; k++) c2.setComponent(i, k, at.getComponent(i, k)); return c2; };
      const p2 = copyOf(pos), si2 = copyOf(si), sw2 = copyOf(sw), Mq = new THREE.Matrix4(), Mb = new THREE.Matrix4(), e = new Float64Array(16); let moved = 0, given = 0;
      for (let p = 0; p < n; p++) { const c = acc[p * 5 + 4]; if (!c) continue; const my = acc[p * 5 + 3] / c, k = c01((HEM - Y[p]) / Math.max(1e-6, my - Y[p]));
        v.set(V[p * 3] + (acc[p * 5] / c - V[p * 3]) * k, V[p * 3 + 1] + (acc[p * 5 + 1] / c - V[p * 3 + 1]) * k, V[p * 3 + 2] + (acc[p * 5 + 2] / c - V[p * 3 + 2]) * k);
        e.fill(0);
        if (robe[p] && spineI >= 0) { const E0 = SM[spineI].elements; for (let x = 0; x < 16; x++) e[x] = E0[x]; si2.setXYZW(p, spineI, 0, 0, 0); sw2.setXYZW(p, 1, 0, 0, 0); given++; }
        else for (let c2 = 0; c2 < 4; c2++) { const w = sw.getComponent(p, c2); if (!w) continue; const E0 = SM[si.getComponent(p, c2)].elements; for (let x = 0; x < 16; x++) e[x] += E0[x] * w; }
        Mb.fromArray(e); Mq.copy(q.bindMatrixInverse).multiply(Mb).multiply(q.bindMatrix).invert(); v.applyMatrix4(Mq); p2.setXYZ(p, v.x, v.y, v.z); moved++; }
      const g2 = new THREE.BufferGeometry(); for (const k in g.attributes) g2.setAttribute(k, k === 'position' ? p2 : (k === 'skinIndex' ? si2 : (k === 'skinWeight' ? sw2 : g.attributes[k])));
      g2.setIndex(new THREE.BufferAttribute(out.slice(0, m2), 1)); g2.boundingSphere = g.boundingSphere; g2.boundingBox = g.boundingBox; q.geometry = g2;
      return { drawn: m2 / 3, of: a.length / 3, crossing: cut, moved, given, dropped };
    }
    function crossDress(P, K, lap) {
      const skins = P.lv[1], bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const spine = bone('Spine'), rest = K.ref[0]; if (!skins || !spine || !P.hips || !P.acts[rest]) { console.warn(P.key + ': cannot be seated cross-legged (no skin, spine, hips or rest)'); return; }
      const rep = P.crossRep = {};
      /* (his rest, as he will sit in it) */
      for (const k in P.acts) { P.w[k] = k === rest ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); }
      P.acts[rest].time = K.ref[1]; personSettle(P); P.mixer.update(0); P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
      const robe = skins.find(q => /\(both sides\)$/.test([].concat(q.material)[0].name)), main = skins.find(q => !/\)$/.test([].concat(q.material)[0].name));
      if (robe) { if (robe.parent) robe.parent.remove(robe); skins.splice(skins.indexOf(robe), 1); }
      /* (the cloth: its points in his own frame, in metres, whatever the pack did to the file's numbers) */
      let top = () => -Infinity;
      /* (HIS BEADS: Chad, 16 Nov 2026, of this seat: "The beads get cut off". His two black strands close in a V on his
         robe below the waist, which is not drawn here: so the cloth's file carries them on again from the hem, his own
         beads laid over the cloth in a hanging loop (masters/v26.18/pho/beadtail.py: a mesh named 'beads', its points
         in his own frame, its coordinates his body sheet's). It is drawn with his body's own material and bound as the
         cloth is; a hand rests on the cloth, so the beads are not part of `top`.) */
      if (lap) { let src = null, beads = null; lap.scene.updateMatrixWorld(true);
        lap.scene.traverse(q => { if (!q.isMesh) return; if (/beads/i.test(q.name) || (q.parent && /beads/i.test(q.parent.name))) beads = beads || q; else src = src || q; });
        const C = 0.015, cells = new Map(), gI = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), inv = [spine, P.hips].map(b => new THREE.Matrix4().multiplyMatrices(gI, b.matrixWorld).invert());
        for (const [from, material, name] of [[src, src && src.material, 'lap'], [beads, main && [].concat(main.material)[0], 'beads']]) { if (!from || !material || (name === 'beads' && !P.lap)) continue;
          const g0 = from.geometry, p0 = g0.attributes.position, n0 = g0.attributes.normal, n = p0.count, pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), si = new Uint8Array(n * 4), sw = new Float32Array(n * 4);
          const v = new THREE.Vector3(), nm = new THREE.Matrix3().getNormalMatrix(from.matrixWorld);
          for (let i = 0; i < n; i++) { v.fromBufferAttribute(p0, i).applyMatrix4(from.matrixWorld); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
            if (name === 'lap') { const ck = Math.round(v.x / C) * 4096 + Math.round(v.z / C), cy = cells.get(ck); if (cy === undefined || v.y > cy) cells.set(ck, v.y); }
            const w = smo(c01((v.y - (K.ringY - K.reach)) / K.reach)) * (1 - smo(c01((Math.hypot(v.x - K.middle[0], v.z - K.middle[1]) - 0.2) / 0.1)));
            si[i * 4 + 1] = 1; sw[i * 4] = w; sw[i * 4 + 1] = 1 - w;
            if (n0) { v.fromBufferAttribute(n0, i).applyMatrix3(nm).normalize(); nor[i * 3] = v.x; nor[i * 3 + 1] = v.y; nor[i * 3 + 2] = v.z; } }
          const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); if (n0) g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
          if (g0.attributes.uv) g.setAttribute('uv', g0.attributes.uv); g.setIndex(g0.index); g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
          if (!n0) g.computeVertexNormals();
          const mesh = new THREE.SkinnedMesh(g, material); mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.name = name;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton([spine, P.hips], inv.map(m4 => m4.clone())), new THREE.Matrix4()); skins.push(mesh); P[name] = mesh;
          rep[name] = { points: n, triangles: g0.index ? g0.index.count / 3 : n / 3 }; }
        if (P.lap) top = (x, z) => { const a = Math.round(x / C), b = Math.round(z / C); let best = -Infinity; for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) { const y = cells.get((a + dx) * 4096 + (b + dz)); if (y !== undefined && y > best) best = y; } return best; }; }
      else console.warn(P.key + ': the cloth over his legs has not landed: he is drawn without it');
      P.crossTop = top;
      if (K.hands && P.lap) { rep.hands = crossHands(P, K.hands, top); if (P.restHands) restHandsLay(P); P.group.updateWorldMatrix(true, true); }
      if (main && K.hem != null) rep.hem = crossHem(P, main, K.hem);
      armsBack(P); P.cross = K;
    }
    function mkPerson(key, x, z, ry, o = {}) {
      const P = { key, o, group: new THREE.Group(), ready: false, acts: {}, w: {}, off: {}, offY: {}, cur: o.take || 'Idle_3', fade: 0.4, win: o.win || null,
                  mixer: null, model: null, head: null, hips: null, bone: {}, lv: [null, null, null, null], lvNow: -1, force: null, members: [],
                  hidden: !!o.hidden, driver: !!o.driver, filmT: null, rate: o.rate || 1, phase: o.phase || 0, clock: (o.phase || 0) * 10, then: [],
                  span: null, gaze: null, gazeK: 0, rest: { take: o.take || 'Idle_3', win: o.win ? Object.assign({}, o.win) : null }, talkTake: o.talk || null, actN: 0 };
      P.group.position.set(x, o.y || 0, z); P.group.rotation.y = ry; P.group.visible = false; (o.parent || world).add(P.group);
      people.push(P);
      if (!have(key)) { waiting.add(key); return P; }
      if (o.cross && o.cross.lap && !have(o.cross.lap)) waiting.add(o.cross.lap);
      (o.cross && o.cross.lap && have(o.cross.lap) ? Promise.all([parseOnce(key), parseOnce(o.cross.lap)]).then(([body, lap]) => { P.lapSrc = lap; return body; }) : parseOnce(key)).then(({ scene: src, animations }) => {
        if (!alive) return;
        const m = cloneSkinned(src), skins = [];
        m.traverse(q => {
          if (q.isSkinnedMesh) { q.castShadow = false; q.receiveShadow = false; q.frustumCulled = false; skins.push(q); }
          if (q.isBone) { P.bone[q.name] = q; lazyRot(q); if (/^(mixamorig:?)?Head$/.test(q.name)) P.head = q; if (/^(mixamorig:?)?Hips$/.test(q.name)) P.hips = q; }
        });
        if (o.s) m.scale.multiplyScalar(o.s);
        for (const q of skins) for (const mm of [].concat(q.material)) if (mm && mm.map) sheetOf(key, mm.map);
        P.group.add(m); P.model = m; P.lv[1] = skins;
        P.mixer = new THREE.AnimationMixer(m);
        for (const clip0 of animations) {
          let clip = clip0;
          if (o.loops && o.loops[clip0.name]) clip = loopOf(clip0, o.loops[clip0.name][0], o.loops[clip0.name][1], o.loops[clip0.name][2]);
          /* a walk is walked ON THE SPOT here: the group is what travels (so a path is a path), and the take's own
             travel over the ground is taken out of its hips (their sway and their rise kept) */
          if (WALKS.test(clip.name)) { if (clip === clip0) clip = clip0.clone(); const tr0 = clip.tracks.find(t => /Hips\.position$/.test(t.name));
            if (tr0) { const v = tr0.values, n = v.length / 3, x0 = v[0], z0 = v[2], x1 = v[(n - 1) * 3], z1 = v[(n - 1) * 3 + 2];
              for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : 0; v[i * 3] -= (x1 - x0) * k; v[i * 3 + 2] -= (z1 - z0) * k; }
              /* (what was taken out, over the take's length, in the hips' own frame: a loop cut from a longer take has
                 handed on its share. A take that really travels is paced by this, exactly: `pace`, below) */
              (P.travel = P.travel || {})[clip.name] = [(clip.travel ? clip.travel[0] : 0) + (x1 - x0), (clip.travel ? clip.travel[1] : 0) + (z1 - z0)]; } }
          const a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[clip.name] = a; P.w[clip.name] = 0;
        }
        /* A TAKE MADE FROM TWO (o.mix: [[name, upper, lower, at]]): the upper body of one take on the legs of another, held
           at one of its moments. Two of the written takes are right above the waist and wrong below it (the arms rising
           wide of photograph 12 kneel with the shins in the air: the tracker's §5), and a body's own grounded kneel is
           already in its file (v5.20: what is missing is made from what the file has). Hips and legs from `lower` at
           `at` seconds, held; everything above from `upper`, as it moves */
        if (o.mix) for (const [name, up, low, at] of o.mix) { const U = animations.find(c => c.name === up), L = animations.find(c => c.name === low);
          if (!U || !L) { console.warn(key + ': no take to mix ' + name + ' from (' + up + ', ' + low + ')'); continue; }
          const LOWER = /^(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*))\./, tracks = U.tracks.filter(t => !LOWER.test(t.name)).map(t => t.clone());
          for (const t of L.tracks) { if (!LOWER.test(t.name)) continue; const n = t.getValueSize(), T = t.times; let i = 0; while (i < T.length - 1 && T[i + 1] <= (at || 0)) i++;
            const v = Array.from(t.values.slice(i * n, i * n + n)); tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v))); }
          const clip = new THREE.AnimationClip(name, U.duration, tracks), a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[name] = a; P.w[name] = 0; }
        if (o.cross) crossTakes(P, animations, o.cross);
        /* where each take holds the hips at its first moment (or at its window's start), from the person's own spot */
        if (P.hips) { const base = {};
          for (const name in P.acts) { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.group.updateWorldMatrix(true, true);
            P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); base[name] = [_pv.x, _pv.z, _pv.y]; }
          const ref = o.centre ? [0, 0] : (base[o.ref || 'Idle_3'] || [0, 0]);    // centre: the hips themselves on the spot (a sitter on his seat)
          for (const name in base) P.off[name] = (o.keepOff && o.keepOff.test(name)) ? [0, 0] : [base[name][0] - ref[0], base[name][1] - ref[1]];
          /* A SITTER'S SEAT (o.seat: { y: the seat's top, over: how far the hips ride above it, takes: which takes sit }):
             every sitting take holds the hips at its own height (measured: Grandmaster Pho's talk sits 3 cm lower than
             his rest), so each is brought to the one height the seat asks for, and changing take never lifts him off
             it or sinks him through it (v16.8) */
          if (o.seat) for (const name in base) if (!o.seat.takes || o.seat.takes.test(name)) P.offY[name] = base[name][2] - (o.seat.y + (o.seat.over != null ? o.seat.over : 0.1)); }
        /* SEATED BY HIS OWN BODY (Chad, 12 Nov 2026, of the monks: "their body is clipping through the seats"; v16.8: a
           sitter is seated on his posed skin). A hip joint held a fixed way over a seat seats nobody: where a rig's hip
           joints ride in its body is the rig's own (Chad's monk's sit 17 cm over his knees in every seated take he
           has, Grandmaster Pho's 6: tools/probes/sitread.mjs), and so is how long its legs are. The three monks sat
           with their hips at the middle of a chair 0.93 m deep, their shins coming down through its seat and their
           soles a hand's length under the ground. Two ways, each read from the take posed at its window's start:
           o.seat.legs ({ edge, r, apron, sole }): a man on a CHAIR. He is set down by his SOLES (the lowest of what
             rides his feet stands `sole` from the ground: a seated man's feet reach the floor, whatever the seat),
             and brought forward until his SHINS (knee joint to ankle joint, read at the seat's top and at the foot of
             its apron) stand a calf's half-thickness `r` past the seat's front face, `edge` ahead of his spot. What
             is drawn of a robe below his thighs lies in the seat, as cloth does.
           o.seat.floor ({ sink }): a man sitting CROSS-LEGGED on a seat's top, in a take made for the floor: the
             lowest of all his skin (its second hundredth: the crossed ankles go under, as episode 3's cushion has
             them) is set `sink` into the seat's top.
           (updateMatrixWorld, not updateWorldMatrix: only the former is a skinned mesh's own, and it is there that
           the matrix a posed point is brought back through is made again. Without it every point came back in the
           world's frame and was moved by the group once more: a first build of this seated the monks metres from their
           chairs, caught by the boot check's printed numbers) */
        if (P.hips && o.seat && (o.seat.legs || o.seat.floor || o.seat.down) && skins[0] && skins[0].skeleton) for (const name in P.acts) { if (o.seat.takes && !o.seat.takes.test(name)) continue;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.model.position.set(0, 0, 0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
          const ys = [], feet = [];
          for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
            const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name));
            const SM = FASTSKIN ? skinMats(q) : null;
            for (let i = 0; i < pos.count; i++) { if (SM) skinVertex(q, i, _pv, SM); else q.getVertexPosition(i, _pv); _pv.applyMatrix4(q.matrixWorld); P.group.worldToLocal(_pv); ys.push(_pv.y);
              let fw = 0; for (let c = 0; c < 4; c++) if (foot[si.getComponent(i, c)]) fw += sw.getComponent(i, c); if (fw >= 0.5) feet.push(_pv.y); } }
          if (ys.length < 30) { console.warn(key + ': too little skin to seat him by'); continue; }
          /* (his spot in the model's own frame: what `centre` or `ref` set for this take) */
          const oz = P.off[name] ? P.off[name][1] : 0, rec = {}; let lift = 0, fwd = 0;
          if (o.seat.floor) { ys.sort((u, v2) => u - v2); const low = ys[Math.floor(ys.length * 0.02)]; lift = (o.seat.y - (o.seat.floor.sink != null ? o.seat.floor.sink : 0.01)) - low; rec.low = +low.toFixed(3); }
          else if (o.seat.down) { const keepLegs = P.restLegs, r = seatDown(P, name, o.seat, skins); if (!r) { P.restLegs = keepLegs; continue; }
            P.restLegs = keepLegs && name !== (o.take || 'Idle_3') ? keepLegs : r.legs; P.offY[name] = -r.lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - r.fwd];
            (P.seated = P.seated || {})[name] = r.rep; continue; }
          else { const K = o.seat.legs, bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
            if (!feet.length) { console.warn(key + ': nothing rides his feet to set him down by'); continue; }
            let sole = Infinity; for (const y of feet) if (y < sole) sole = y;
            lift = (K.sole != null ? K.sole : -0.005) - sole;
            let back = Infinity, thigh = Infinity;
            for (const sd of ['Left', 'Right']) { const kn = bone(sd + 'Leg'), an = bone(sd + 'Foot'); if (!kn || !an) continue;
              kn.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ky = _pv.y + lift, kz = _pv.z - oz;
              an.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ay = _pv.y + lift, az = _pv.z - oz;
              P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); thigh = Math.min(thigh, (ky + _pv.y + lift) / 2 - o.seat.y);
              for (const h of [o.seat.y, o.seat.y - (K.apron != null ? K.apron : 0.14)]) { const t = ky > ay ? Math.max(0, Math.min(1, (ky - h) / (ky - ay))) : 0; back = Math.min(back, kz + t * (az - kz)); } }
            if (!(back < Infinity)) { console.warn(key + ': no knees and ankles to seat him by'); continue; }
            fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
            rec.sole = +sole.toFixed(3); rec.back = +back.toFixed(3); rec.thigh = +thigh.toFixed(3);
            /* (a thigh's own half-thickness is some 8 cm: an axis nearer the seat than 4 is a body in the wood) */
            if (thigh < 0.04) console.warn(key + ': set down by his soles, his thighs lie in the seat (their axis ' + (thigh * 100).toFixed(0) + ' cm over it): this seat is too high for this take'); }
          if (!(Math.abs(lift) < 0.8) || fwd > 0.45) { console.warn(key + ': the seat read from his body is not a seat (up ' + lift.toFixed(2) + ' m, forward ' + fwd.toFixed(2) + ' m): left on his hips'); continue; }
          P.offY[name] = -lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - fwd];
          rec.lift = +lift.toFixed(3); rec.fwd = +fwd.toFixed(3); (P.seated = P.seated || {})[name] = rec; }
        /* FEET ON THE GROUND (Chad, 13 Nov 2026: "You didn't notice many masters have their feet sunk clipping into the
           ground?"). A take holds a body at its own height, and a take made on another body (the library's, a written
           one) keeps that body's hips: on legs of another length the soles go under the ground. Measured by
           tools/probes/feetscan.mjs at the morning's start: 57 of 67 people had a foot more than a centimetre under
           the turf, the standing cast 3 to 6 cm, the crowd to 6. So every take that does not sit is set down by the
           body's own lowest contact over the part of it that is played (its window, or the whole take): a STANDING
           take by its soles (what rides the feet), a LOW one (a kneel, a bow to the ground: the hips at under 0.75 of
           their standing height, so a man kneeling upright counts) by the lowest of all its skin. It is set GROUND_SOLE into the ground under the
           person's spot (a body sinks a little into what it rests on, v9.3). This is the measure SINK and the dancers'
           o.sink took by hand, each once on one body, and it replaces them where it is made (groundTakes, below) */
        if (P.hips && o.seat && o.seat.rise && skins[0] && skins[0].skeleton) riseCurve(P, o.seat.rise, skins);
        if (P.hips && skins[0] && skins[0].skeleton) groundTakes(P, skins);
        if (o.headDamp) headDampInit(P);
        if (o.shoulders !== null) shouldersInit(P);
        if (o.upright) uprightInit(P);
        if (o.armRest) armRestInit(P);
        if (o.knees) kneesInit(P);
        if (o.armOut) armOutInit(P);
        /* THE GROUND A WALK OR A RUN COVERS IN A SECOND (o.pace: asked for by whoever moves the group, who drives the take's
           rate from the ground covered: v7.1). The library's walks and runs come on the spot (their hips travel nowhere:
           measured, a few millimetres a second), so the pace is read from the foot that is down: under a body that stays
           where it is, a planted foot goes back at the pace the body would go forward. Each foot at thirty-two moments of
           the take, in the person's own frame; a foot is down while it is within 3.5 cm of the lowest either reaches.
           A TAKE THAT TRAVELS (the dancers' written walk: nine tenths of a metre in the two seconds kept of it) is not read that way: its pace is the
           travel taken out of its hips over its length, exactly, and `heading` the way that travel went from the body's
           own front (this walk goes 21 degrees to her left). Moved at that pace along that line, the hips do over the
           ground just what the take had them do, and a planted foot stays where it was planted. Read from the foot
           that is down, this slow walk gave half its pace (0.21 m a second for 0.46: the foot is flat while the body
           waits over it, and the body's advance comes as the heel lifts), and the file crossed with every foot
           sliding back a hand's length a step: measured in the game on 12 Nov, a planted foot 17 cm in one stance */
        if (o.pace) { const LF = P.bone.LeftFoot || P.bone['mixamorig:LeftFoot'], RF = P.bone.RightFoot || P.bone['mixamorig:RightFoot'];
          if (LF && RF) for (const name in P.acts) { if (!WALKS.test(name)) continue;
            const A = P.acts[name], d = A.getClip().duration, N = 32, F = [[], []];
            const tv = P.travel && P.travel[name];
            if (tv && P.hips && P.hips.parent) { const par = P.hips.parent; P.group.updateWorldMatrix(true, true);
              _pv.set(tv[0], 0, tv[1]); par.localToWorld(_pv); P.group.worldToLocal(_pv); const ax = _pv.x, az = _pv.z;
              _pv.set(0, 0, 0); par.localToWorld(_pv); P.group.worldToLocal(_pv);
              const dx = ax - _pv.x, dz = az - _pv.z, sp = Math.hypot(dx, dz) / d;
              if (sp > 0.05) { (P.pace = P.pace || {})[name] = sp; (P.heading = P.heading || {})[name] = Math.atan2(dx, dz); continue; } }
            for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            for (let i = 0; i <= N; i++) { A.time = Math.min(d - 1e-4, d * i / N); P.mixer.update(0); P.group.updateWorldMatrix(true, true);
              [LF, RF].forEach((b, j) => { b.getWorldPosition(_pv); P.group.worldToLocal(_pv); F[j].push([_pv.y, _pv.z]); }); }
            let lo = Infinity; for (const f of F) for (const q of f) lo = Math.min(lo, q[0]);
            let back = 0, n = 0; for (const f of F) for (let i = 0; i < N; i++) if (f[i][0] < lo + 0.035 && f[i + 1][0] < lo + 0.035) { back += f[i][1] - f[i + 1][1]; n++; }
            if (n > 2 && back > 0) (P.pace = P.pace || {})[name] = back / (n * d / N); } }
        if (!P.acts[P.cur]) { console.warn(key + ' has no take ' + P.cur + ' (it has: ' + Object.keys(P.acts).join(', ') + ')'); P.cur = Object.keys(P.acts)[0]; }
        for (const k in P.acts) { P.w[k] = k === P.cur ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); P.acts[k].time = (P.phase * P.acts[k].getClip().duration) % P.acts[k].getClip().duration; }
        /* (for a look: which way the face looks, from the head's BIND turn, never from the bone's own axes: v6.8. Every
           body here is prepped with its face along +z in its bind pose, so the head's turn since its bind, applied to
           +z, is the face's direction now) */
        if (P.head && skins[0] && skins[0].skeleton) { const sk = skins[0].skeleton, bi = sk.bones.indexOf(P.head);
          if (bi >= 0) { const bm = new THREE.Matrix4().copy(sk.boneInverses[bi]).invert().premultiply(skins[0].bindMatrix);
            P.headRest = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bm)).invert(); } }
        P.ready = true; P.group.visible = !P.hidden && !P.driver;
        if (!P.driver && !o.noBlob) P.blob = blob(P.group, o.blobW || 0.85, o.blobD || 0.7);
        personSettle(P); windowTime(P); P.mixer.update(0);
        if (o.cross) { crossDress(P, o.cross, P.lapSrc || null); personSettle(P); windowTime(P); P.mixer.update(0); }
        if (o.handsOn) restHands(P, o.handsOn);
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, 1);
        if (o.look) o.look(m);
        if (o.skins !== false) for (const i of [0, 2, 3]) if (i || (!P.driver && !o.fullFilm)) addLevel(P, i);
        if (o.fullFilm && have(P.key + LEVELS[0][0])) parseOnce(P.key + LEVELS[0][0]).catch(() => {});
        const L = P.then; P.then = []; for (const f of L) f(P);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return P;
    }
    /* one more skin of a person, bound to the bones the near body already has */
    function addLevel(P, i) {
      const named = P.o.skins && P.o.skins[i], key = named || (P.o.skins ? null : P.key + LEVELS[i][0]);
      if (!key) return;
      if (!have(key)) { if (i !== 0 || named) waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive || !P.model) return;
        const made = [];
        src.traverse(sm => { if (!sm.isSkinnedMesh) return;
          const bones = sm.skeleton.bones.map(b => P.bone[b.name]);
          if (bones.some(b => !b)) { console.warn(key + ': a bone of it is not on ' + P.key); return; }
          let mat = sm.material;
          if (!mat.map) { let near = null; for (const q of P.lv[1]) for (const nm of [].concat(q.material)) if (nm.name === mat.name) near = nm; if (near) mat = near; }
          if (mat.map) sheetOf(P.key, mat.map);
          const mesh = new THREE.SkinnedMesh(sm.geometry, mat);
          mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.visible = false;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton(bones, sm.skeleton.boneInverses), sm.bindMatrix); made.push(mesh); });
        if (!made.length) return;
        P.lv[i] = made; P.lvNow = -1;
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, i);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    /* (v26.8, Chad, 13 Nov 2026, of the woman raising her bai sri to the brown hermit, with my picture of it: "look at how
       bad and blocky the arms look , are these the full res models?"; they were not, and his answer to the two who go up:
       "Yes, full models", for those close film shots only) A FULL BODY FOR ONE FILM (o.fullFilm): read with the chapter, so
       nothing is decoded while the world is on screen, but laid on the bones only when the film that brings it close
       begins, and given back when it ends (its buffers and its own sheets out of the phone's graphics memory: about 50 MB
       each, v26.5's measure). The film first shows it after a black (the festival's second half begins under the cut's
       black), so its upload is never on screen. A sheet the full body borrows from the near one is not given back */
    function fullOn(P) { if (P && P.o.fullFilm && !P.lv[0]) whenReady(P, () => { if (!P.lv[0]) addLevel(P, 0); }); }
    /* (v26.11: AND NOTHING ANOTHER BODY DRAWS. A full body is read once a file and shared (parseOnce), so the film's two
       share their shapes and sheets with whoever else wears the same body at full detail all chapter (a man of the
       waiting line wears the second one's, e4devc): given back as the film ended, they were taken off the chip under him
       too, and put back on it, on screen, the next time the player walked up to him. What any other body draws, at any
       level, is kept now, as the near body's own always was; what is this body's alone is given back as before. Nothing
       drawn changes. `?opt=keepShared:0` gives everything back as before) */
    function fullOff(P) {
      if (!P || !P.o.fullFilm || !P.lv[0]) return;
      const near = new Set(); for (const q of P.lv[1] || []) for (const mt of [].concat(q.material)) near.add(mt);
      const keep = new Set();
      if (KEEPSHARED) for (const Q of people) if (Q !== P) for (const L of Q.lv) if (L) for (const q of L) {
        keep.add(q.geometry); for (const mt of [].concat(q.material)) { keep.add(mt); for (const k in mt) { const v = mt[k]; if (v && v.isTexture) keep.add(v); } } }
      for (const m of P.lv[0]) { P.model.remove(m); if (!keep.has(m.geometry)) m.geometry.dispose();
        for (const mt of [].concat(m.material)) if (!near.has(mt) && !keep.has(mt)) for (const k in mt) { const v = mt[k]; if (v && v.isTexture && !keep.has(v)) v.dispose(); } }
      P.lv[0] = null; P.lvNow = -1;
      /* (and the cull's list of the body's meshes read again without them: v26.8, the engine gives a re-registered
         body its own masks back first) */
      if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
    }
    const whenReady = (P, fn) => { if (!P) return; if (P.ready) fn(P); else P.then.push(fn); };
    /* the model slid so the body stands on the person's spot whatever its takes' own offsets, by their weights */
    /* (and set down: two written takes hold the whole body a few centimetres over the ground, measured on a devotee) */
    const SINK = { prostrate: 0.046, offer: 0.049 };
    /* FEET ON THE GROUND, read (mkPerson, above). For each take a body has that does not sit: the lowest of what touches
       the ground over the part of it that is played, and the height that sets that GROUND_SOLE under the person's spot
       (P.offY, with P.grounded saying it was read; P.groundRep keeps what was read, for a probe: feet, all, hips as a
       share of their standing height, low, off). The skin is read where it stands furthest out: of each bone's share of
       it, the points furthest along 64 ways (the feet's) or 14 (the rest's), because the lowest point of a posed body is
       one of its outermost, so a body is read at a thousand points and not at its tens of thousands, each exactly posed
       (getVertexPosition), at GROUND_N moments of a window or GROUND_NW of a whole take. Bodies of one file wearing a
       take in one window share a reading (groundMemo): a crowd of drivers costs it once */
    const GROUND_SOLE = -0.003, GROUND_N = 8, GROUND_NW = 12, GROUND_LOW = 0.75, groundMemo = new Map(), groundPts = new Map();
    const _grV = new THREE.Vector3(), _grI = new THREE.Matrix4(), _grM = new THREE.Matrix4();
    function sphereDirs(n) { const out = [], g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = g * i; out.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return out; }
    const DIRS_FOOT = sphereDirs(64), DIRS_BODY = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].concat([-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x / Math.sqrt(3), y / Math.sqrt(3), z / Math.sqrt(3)]))));
    function groundPoints(P, skins) {
      if (groundPts.has(P.key)) return groundPts.get(P.key);
      /* (each point is kept as WHICH skin and which of its vertices, never the skin itself: every person of one file shares
         this list, and read through the first one's mesh, a crowd's driver was read in somebody else's pose: v26.2) */
      const out = { foot: [], body: [] };
      for (let si0 = 0; si0 < skins.length; si0++) { const q = skins[si0], pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name)), best = new Map();
        for (let i = 0; i < pos.count; i++) { let bj = -1, bw = -1, fw = 0;
          for (let c = 0; c < 4; c++) { const w = sw.getComponent(i, c), j = si.getComponent(i, c); if (w > bw) { bw = w; bj = j; } if (foot[j]) fw += w; }
          const isF = fw >= 0.5, key2 = bj * 2 + (isF ? 1 : 0), D = isF ? DIRS_FOOT : DIRS_BODY;
          let B = best.get(key2); if (!B) best.set(key2, B = { f: isF, v: new Float64Array(D.length).fill(-Infinity), i: new Int32Array(D.length).fill(-1) });
          const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          for (let d = 0; d < D.length; d++) { const u = x * D[d][0] + y * D[d][1] + z * D[d][2]; if (u > B.v[d]) { B.v[d] = u; B.i[d] = i; } } }
        for (const B of best.values()) { const seen = new Set(); for (const i of B.i) if (i >= 0 && !seen.has(i)) { seen.add(i); (B.f ? out.foot : out.body).push([si0, i]); } } }
      groundPts.set(P.key, out); return out;
    }
    function groundTakes(P, skins) {
      const o = P.o, seatT = (nm) => !!o.seat && (!o.seat.takes || o.seat.takes.test(nm));
      const sk = skins[0].skeleton, hi = sk.bones.indexOf(P.hips); if (hi < 0) return;
      P.model.position.set(0, 0, 0);
      const poseAt = (A, t) => { A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true); _grI.copy(P.group.matrixWorld).invert(); };
      const only = (name) => { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0); };
      const momentsOf = (name) => { const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], N = W ? GROUND_N : GROUND_NW, ts = [];
        for (let i = 0; i < N; i++) ts.push(W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : Math.min(d - 1e-3, d * i / (N - 1)));
        return ts; };
      /* (the hips' standing height: the highest they stand in any of this body's takes that do not sit. Read from the
         bind pose it came out at 2 to 15 cm on these files, and every take was left as it was: v26.2's first build) */
      let standH = groundPts.has(P.key + '|H') ? groundPts.get(P.key + '|H') : -Infinity;
      if (!(standH > -Infinity)) { for (const name in P.acts) { if (seatT(name)) continue; only(name);
          for (const t of momentsOf(name)) { poseAt(P.acts[name], t); standH = Math.max(standH, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); } }
        groundPts.set(P.key + '|H', standH); }
      if (!(standH > 0.3)) { if (standH > -Infinity) console.warn(P.key + ': no standing height to read its takes against (' + standH.toFixed(2) + ')'); return; }
      const PTS = groundPoints(P, skins);
      const lowOf = (list) => { let m = Infinity; const mats = new Map(), sms = new Map();
        for (const [k, i] of list) { const q = skins[k]; if (!q) continue; let M = mats.get(q); if (!M) { M = new THREE.Matrix4().multiplyMatrices(_grI, q.matrixWorld); mats.set(q, M); }
          if (FASTSKIN) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, i, _grV, SM); } else q.getVertexPosition(i, _grV);
          _grV.applyMatrix4(M); if (_grV.y < m) m = _grV.y; } return m; };
      for (const name in P.acts) { if (seatT(name)) continue;
        const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], memo = P.key + '|' + name + '|' + (W ? W[0] + ',' + W[1] : '');
        let R = groundMemo.get(memo);
        if (!R) { const ts = momentsOf(name); only(name);
          let hipsLo = Infinity; for (const t of ts) { poseAt(A, t); hipsLo = Math.min(hipsLo, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); }
          const low = hipsLo < GROUND_LOW * standH; let feet = Infinity, all = Infinity;
          for (let n = 0; n < ts.length; n++) { poseAt(A, ts[n]); feet = Math.min(feet, lowOf(PTS.foot));
            if (low || n === 0) all = Math.min(all, feet, lowOf(PTS.body)); }
          const contact = low ? all : feet;
          R = { feet: +feet.toFixed(4), all: +all.toFixed(4), hips: +(hipsLo / standH).toFixed(2), low, off: +(contact - GROUND_SOLE).toFixed(4) };
          if (!(Math.abs(R.off) < 0.2)) { console.warn(P.key + ': ' + name + ' read as standing ' + R.off.toFixed(3) + ' m off the ground: left as it was'); R.skip = true; }
          groundMemo.set(memo, R); }
        (P.groundRep = P.groundRep || {})[name] = R;
        if (R.skip) continue;
        P.offY[name] = R.off; (P.grounded = P.grounded || {})[name] = true; }
    }
    /* A RISE FROM A SEAT, on the ground (o.seat.rise: the name of the take he stands up in). Seated he is set on his seat
       by his bottom and his legs are laid down to the ground (seatDown); stood up he is set down by his soles, as any
       standing take is. Between, the take's own hips say how far he has risen: at each of 25 moments of it the height his
       hips have climbed from where he sits to the highest they reach, eased, takes him from the one height to the other
       (P.rise[name], read in personSettle at the take's own moment). Grandmaster Pho rises from his bench in play and in
       the films: on his seat's height his soles stood 7 cm under the ground the whole way up */
    function riseCurve(P, name, skins) {
      const A = P.acts[name]; if (!A || !(P.offY[name] != null)) return;
      const PTS = groundPoints(P, skins), d = A.getClip().duration, N = 25, ts = [], hs = [], fs = [];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
      P.model.position.set(0, 0, 0);
      for (let i = 0; i < N; i++) { const t = Math.min(d - 1e-3, d * i / (N - 1)); A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
        _grI.copy(P.group.matrixWorld).invert(); let m = Infinity;
        const sms = FASTSKIN ? new Map() : null;
        for (const [k, j] of PTS.foot) { const q = skins[k]; if (!q) continue; _grM.multiplyMatrices(_grI, q.matrixWorld);
          if (sms) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, j, _grV, SM); } else q.getVertexPosition(j, _grV);
          _grV.applyMatrix4(_grM); if (_grV.y < m) m = _grV.y; }
        ts.push(t); hs.push(P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); fs.push(m); }
      const W = P.win && P.win[name], t0 = W ? W[0] : 0; let h0 = hs[0]; for (let i = 0; i < N; i++) if (ts[i] <= t0) h0 = hs[i];
      const h1 = Math.max(...hs), seat = P.offY[name], off = [];
      if (!(h1 - h0 > 0.15)) { console.warn(P.key + ': ' + name + ' does not rise (' + (h1 - h0).toFixed(2) + ' m): left on its seat'); return; }
      const ks = [];
      for (let i = 0; i < N; i++) { const u = Math.max(0, Math.min(1, ((hs[i] - h0) / (h1 - h0) - 0.15) / 0.7)), k = u * u * (3 - 2 * u);
        off.push(seat + k * ((fs[i] - GROUND_SOLE) - seat)); ks.push(k); }
      (P.rise = P.rise || {})[name] = { ts, off, k: ks };
      (P.groundRep = P.groundRep || {})[name] = { seat: +seat.toFixed(4), stood: +(fs[N - 1] - GROUND_SOLE).toFixed(4), rise: +(h1 - h0).toFixed(3) };
    }
    /* HEAD TURNS RESTRAINED (o.headDamp: { take: [k, reference take] }; Chad, 13 Nov 2026: "for the audience looking left
       and right, i think the angle to left and right is too extreme, and can be slightly restrained", and "When
       grandmaster pho talks, his head also moves too much to the right, i think the head movement can be greatly
       restrained"). Measured (tools/probes/headturn.mjs): the kneel's look round swept the face from 54 degrees to one
       side to 61 to the other, and Grandmaster Pho's talk turned his face up to 56 degrees to his right. So while a take
       named here is worn, the turns of the upper chest, the neck and the head are laid `k` of the way from a reference to
       where the take puts them: the reference is that take's own middle (the mean of those turns over its window: the look
       round about its centre) or another take's (his talk about his rest, which faces his front). The motion is the
       take's, smaller, and nothing else moves. Laid after the mixer has posed the body every frame (the mixer writes those
       turns again each frame), in play and in a film's pose alike, before a look (gaze) is laid over it */
    const _hdQ = new THREE.Quaternion();
    function headDampInit(P) {
      const D = P.o.headDamp, bones = [];
      for (const nm of ['Spine2', 'Neck', 'Head']) { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) { bones.push(P.bone[n]); break; } }
      if (!D || !bones.length) return;
      const meanOf = (name) => { const A = P.acts[name]; if (!A) return null; const d = A.getClip().duration, W = P.win && P.win[name], N = 24, acc = bones.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          bones.forEach((b, j) => { const q = b.quaternion; if (i === 0) first[j] = q.clone();
            const s = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * s; acc[j][1] += q.y * s; acc[j][2] += q.z * s; acc[j][3] += q.w * s; }); }
        return acc.map(v => new THREE.Quaternion(v[0], v[1], v[2], v[3]).normalize()); };
      P.hd = { bones, take: {} };
      for (const name in D) { const spec = [].concat(D[name]), M = P.acts[name] ? meanOf(spec[1] || name) : null; if (M) P.hd.take[name] = { k: +spec[0], M }; }
    }
    function headDampLay(P) {
      const H = P.hd; if (!H) return;
      let best = null, bw = 0, cut = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0) { cut += w * (1 - H.take[n].k); if (w > bw) { bw = w; best = n; } } }
      if (!best || !(cut > 1e-4)) return;
      const M = H.take[best].M, kk = 1 - Math.min(1, cut);
      if (NOGARB) { const L = H.bones; for (let j = 0; j < L.length; j++) { const b = L[j]; _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); } }
      else H.bones.forEach((b, j) => { _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); });
      H.bones[0].updateWorldMatrix(false, true);
    }
    /* THE SHOULDERS LET DOWN (o.shoulders: { take: k }; v26.8, Chad, 13 Nov 2026: "ton's natural resting posture while
       standing, has his shoulders very raised and tensed up, make it look more natural"). Measured (tools/probes/
       jointscan.mjs: the collar bone's rise from its root at the neck out to the shoulder joint, against the body's own A
       pose, its neutral): the library's stand, laid on these bodies, holds both collar bones 27 to 49 degrees over their
       neutral, a full shrug (Ton 37 and 49), on everyone who wears it: it was made on a body whose arms begin level, and
       its collar bones came over raised. So while a take named here is worn, each collar bone is laid `k` of the way from
       where the take holds it to its bind pose with the take's own motion about its middle kept (the mean of its turn over
       the take's window: a breath that lifts the shoulders still lifts them), and the upper arm is given back its turn
       against the collar bone's parent, so the arm hangs and swings exactly as the take has it and only the shoulder
       comes down. Laid after the mixer and before any hand is laid (a hand on a thing reaches from the shoulder as it now
       is), taken off by armsBack() before the mixer runs again (v11.5) */
    /* (v26.8, Chad, the same evening, when the same shrug had been measured on everyone else who stands and left for his
       word: "there are also many other standing audience models all with the same raised shoulder problem, fix all of
       them the way you fixed Ton. All of them." So it is every body's: the stand and the talk let down wherever a body has
       them, unless it says `shoulders: null`) */
    const STAND_SH = { Idle_3: 1, Stand_and_Chat: 1 };
    const _sdq = new THREE.Quaternion(), _sdq2 = new THREE.Quaternion();
    function shouldersInit(P) {
      const asked = P.o.shoulders !== undefined, D = asked ? P.o.shoulders : STAND_SH; if (!D) return;
      if (!Object.keys(D).some(n => P.acts[n])) return;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const S = [];
      for (const S0 of ['Left', 'Right']) { const cl = bone(S0 + 'Shoulder'), up = bone(S0 + 'Arm'); if (!cl || !up || up.parent !== cl) continue;
        const qb = bindLocal(P, cl); if (qb) S.push({ cl, up, qb, scl: new THREE.Quaternion(), sup: new THREE.Quaternion(), M: {}, fol: cl.children.filter(c => c.isBone && c !== up && /^Drape/.test(c.name)).map(b => ({ b, sv: new THREE.Quaternion() })) }); }
      if (!S.length) { if (asked) console.warn(P.key + ': o.shoulders asked, and no collar bone with its upper arm under it'); return; }
      /* (each take's middle turn of each collar bone, over the window the take is worn in: headDampInit's measure) */
      for (const name in D) { const A = P.acts[name]; if (!A) continue; const d = A.getClip().duration, W = (P.o.shWin && P.o.shWin[name]) || (P.win && P.win[name]), N = 24, acc = S.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          S.forEach((R, j) => { const q = R.cl.quaternion; if (i === 0) first[j] = q.clone();
            const sg = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * sg; acc[j][1] += q.y * sg; acc[j][2] += q.z * sg; acc[j][3] += q.w * sg; }); }
        S.forEach((R, j) => { R.M[name] = new THREE.Quaternion(acc[j][0], acc[j][1], acc[j][2], acc[j][3]).normalize(); }); }
      P.shd = { S, take: Object.assign({}, D), on: false };
    }
    function shouldersLay(P) {
      const H = P.shd; if (!H) return;
      let best = null, bw = 0, k = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0 && H.S[0].M[n]) { k += w * H.take[n]; if (w > bw) { bw = w; best = n; } } }
      if (!best || !(k > 1e-4)) return;
      k = Math.min(1, k);
      for (const R of H.S) {
        R.scl.copy(R.cl.quaternion); R.sup.copy(R.up.quaternion);
        /* the collar bone: its bind pose, with the take's motion about its middle laid on it; k of the way there */
        _sdq.copy(R.M[best]).invert().premultiply(R.cl.quaternion); _sdq2.copy(R.qb).multiply(_sdq);
        R.cl.quaternion.slerp(_sdq2, k);
        /* the upper arm: the same turn against the collar bone's parent as before (old collar * old arm = new collar * new arm) */
        R.up.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(R.sup);
        for (const F of R.fol || []) { F.sv.copy(F.b.quaternion); F.b.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(F.sv); }
        R.cl.updateWorldMatrix(false, true);
      }
      H.on = true;
    }
    function riseOff(R, t, which = 'off') {
      const ts = R.ts, V = R[which], n = ts.length; if (t <= ts[0]) return V[0]; if (t >= ts[n - 1]) return V[n - 1];
      let i = 1; while (i < n - 1 && ts[i] < t) i++; const u = (t - ts[i - 1]) / (ts[i] - ts[i - 1]); return V[i - 1] + (V[i] - V[i - 1]) * u;
    }
    function personSettle(P) {
      if (!P.model) return; let ox = 0, oz = 0, oy = 0, rk = 0;
      /* (o.sink: a body's own measure for a take: the same written walk lays one dancer's feet 2.5 cm under the turf and
         the other's 1 cm over it: gait.mjs, each ankle against where it stands at rest) */
      const SK = P.o.sink;
      for (const k in P.w) { const w = P.w[k], f = P.off[k]; if (w > 0 && f) { ox += f[0] * w; oz += f[1] * w; }
        const sk = P.grounded && P.grounded[k] ? 0 : (SK && SK[k] != null ? SK[k] : SINK[k]); if (w > 0 && sk) oy += sk * w;
        const oyk = P.rise && P.rise[k] ? riseOff(P.rise[k], P.acts[k].time) : P.offY[k]; if (w > 0 && oyk) oy += oyk * w;
        if (w > 0 && P.rise && P.rise[k]) rk += w * riseOff(P.rise[k], P.acts[k].time, 'k'); }
      P.riseK = rk;
      P.model.position.x = -ox; P.model.position.z = -oz; P.model.position.y = -oy;
    }
    /* A WINDOW of a take (o.win: { take: [from, length, seconds] }): a take that is right only for part of its length is
       played back and forth inside that part, eased at both ends (the seated idle leans far forward for five of its ten
       seconds: only its upright ends are a master's rest). The window may run past the take's end: it wraps.
       THERE AND BACK TAKES `seconds` (Chad, 12 Nov 2026: "grandmaster pho is bobbing and bouncing too much in his
       passive pose, slow down the bobbing significantly"). Unsaid, it is twice the window's own length, the take's own
       pace: and a SHORT window at the take's own pace is a bob (his rest was 0.3 s of a take there and back every
       0.6 s: his head at 15 cm a second, measured by tools/probes/windowread.mjs; held half risen on 0.28 s of the rise
       it went 16 cm there and back every 0.56 s). A window that is a REST says its seconds. */
    function windowTime(P) {
      if (!P.win) return;
      for (const name in P.win) { const A = P.acts[name]; if (!A || !(P.w[name] > 0)) continue;
        const W = P.win[name], [from, len] = W, d = A.getClip().duration, u = (P.clock / (W[2] > 0 ? W[2] : len * 2)) % 1, k = 0.5 - 0.5 * Math.cos(u * 2 * Math.PI);
        A.time = (((from + k * len) % d) + d) % d; A.timeScale = 0; }
    }
    /* which take a person wears from now on (eased over `fade` seconds); `restart` begins it at its start */
    function take(P, name, fade = 0.4, restart = false) {
      if (!P) return false;
      if (!P.ready) { P.cur = name; P.then.push(() => take(P, name, 0, restart)); return true; }
      if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return false; }
      if (restart || P.cur !== name) { if (restart || P.w[name] < 0.01) P.acts[name].time = 0; }
      if (P.span && P.span.name !== name) P.span = null;
      if (!(P.win && P.win[name]) && !(P.span && P.span.name === name)) P.acts[name].timeScale = 1;       // (a take once windowed runs again when its window is gone)
      P.cur = name; P.fade = fade; P.filmT = null;
      if (!(fade > 0)) { for (const k in P.acts) { P.w[k] = k === name ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); } personSettle(P); }
      return true;
    }
    /* a film's pose: this take at this moment of its own length (held at its end, or wrapped if `loop`), absolutely */
    /* (a take a body does not have fails silently and the man stands as he was: v11.2. A film that asks for one is
       told so once, in the console, where every probe of this chapter reads it) */
    const _noTake = new Set();
    function noTake(P, name) { const k = P.key + ':' + name; if (_noTake.has(k)) return; _noTake.add(k); console.warn(P.key + ' has no take ' + name + ' (a film asked for it; it has: ' + Object.keys(P.acts).join(', ') + ')'); }
    /* (v26.8: an optional THIRD take, name3 at k3 from t3, so a body blended between two takes can go on into a third
       from exactly where it stands: the brown hermit sits up at 0.42 of his laying-on take, and at the petals the
       film switched to the whole of it in one frame, his lean jumping from about ten degrees to twenty-five. Absent,
       every weight is what it was) */
    function pose(P, name, t, loop = false, name2 = null, k2 = 0, t2 = 0, name3 = null, k3 = 0, t3 = 0) {
      if (!P || !P.ready) return;
      if (!P.acts[name]) { noTake(P, name); return; }
      if (name2 && !P.acts[name2]) noTake(P, name2);
      if (name3 && !P.acts[name3]) noTake(P, name3);
      for (const k in P.acts) { const w = k === name ? 1 - (name2 ? k2 : 0) - (name3 ? k3 : 0) : (k === name2 ? k2 : (k === name3 ? k3 : 0)); P.w[k] = w; P.acts[k].setEffectiveWeight(w); }
      const A = P.acts[name], d = A.getClip().duration; A.time = loop ? ((t % d) + d) % d : Math.max(0, Math.min(d - 1e-3, t));
      if (name2 && P.acts[name2]) { const A2 = P.acts[name2], d2 = A2.getClip().duration; A2.time = Math.max(0, Math.min(d2 - 1e-3, t2)); }
      if (name3 && P.acts[name3]) { const A3 = P.acts[name3], d3 = A3.getClip().duration; A3.time = Math.max(0, Math.min(d3 - 1e-3, t3)); }
      P.cur = name; P.filmT = t; armsBack(P); personSettle(P); P.mixer.update(0);
      if (P.hd) headDampLay(P);
      if (P.upr) uprightLay(P);
      if (P.arst) armRestLay(P);
      if (P.upr) uprightArmsLay(P);
      if (P.knees) kneesLay(P);
      if (P.aout) armOutLay(P);
      if (P.shd) shouldersLay(P);
      if (P.restLegs) seatLegsLay(P);
      if (P.restHands && !(P.layK > 0)) restHandsLay(P);
      if (!P.htLate) handsTrue(P);
    }
    /* (v26.18: a person put somewhere stands on the floor that is there: the hall's is 0.48 m up, its steps between; on the
       ground of the Wai Kru that is 0, as it was) */
    function put(P, x, z, ry, y = flatGround(x, z)) { if (!P) return; P.group.position.set(x, y, z); if (ry != null) P.group.rotation.y = ry; }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);                 // the turn that faces a +z-facing body at a point
    /* every frame of play: weights eased on the wall clock, takes run, bodies settled */
    function peopleTick(wdt, live) {
      for (const P of people) {
        if (!P.ready || (!P.group.visible && !P.driver) || (P.driver && P.idle)) continue;
        if (P.filmT != null && !live) continue;                                  // a film holds its people where it posed them
        if (P.filmT != null) { P.filmT = null; }
        let moved = false;
        for (const k in P.acts) { const to = k === P.cur ? 1 : 0, w = P.w[k];
          if (w !== to) { const st = P.fade > 0 ? wdt / P.fade : 1; P.w[k] = to > w ? Math.min(to, w + st) : Math.max(to, w - st); P.acts[k].setEffectiveWeight(P.w[k]); moved = true; } }
        if (moved) personSettle(P);
        P.clock += wdt * P.rate; windowTime(P);
        if (P.span) spanTick(P, wdt);
        if (P.rise) personSettle(P);
        armsBack(P);
        P.mixer.update(wdt * P.rate);
        if (P.hd) headDampLay(P);
        if (P.upr) uprightLay(P);
        if (P.arst) armRestLay(P);
        if (P.upr) uprightArmsLay(P);
        if (P.knees) kneesLay(P);
        if (P.aout) armOutLay(P);
        if (P.shd) shouldersLay(P);
        if (P.gaze || P.gazeK > 0) gazeTick(P, wdt);
        if (P.lay || P.layK > 0) layTick(P, wdt);
        if (P.restLegs) seatLegsLay(P);
        if (P.restHands && !(P.layK > 0)) restHandsLay(P);
        if (!P.htLate) handsTrue(P);
      }
    }
    /* A TAKE PLAYED ONCE between two of its own moments, over `secs` seconds, eased at both ends (t1 may be before t0:
       a rise played backwards is a sitting down), then HELD on a small window at its end (o.hold: seconds of the take,
       back and forth from where it stopped; negative runs back; o.holdSecs: how long that takes there and back, where
       the hold is a stillness and not a beat) or handed on (o.then). A rise from a seat, a throw, a
       bow. Its window and its end are the person's own state, so reset() need only name a take again. */
    function span(P, name, t0, t1, secs, o = {}) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return; }
        if (P.win && P.win[name]) delete P.win[name];
        P.span = { name, t0, t1, secs: Math.max(0.05, secs), u: 0, hold: o.hold != null ? o.hold : 0, holdSecs: o.holdSecs > 0 ? o.holdSecs : 0, then: o.then || null, n: ++P.actN };
        take(P, name, o.fade != null ? o.fade : 0.4); P.acts[name].time = t0; P.acts[name].timeScale = 0; });
    }
    function spanTick(P, wdt) {
      const Sp = P.span, A = P.acts[Sp.name]; if (!A) { P.span = null; return; }
      Sp.u = Math.min(1, Sp.u + wdt / Sp.secs);                                 // (wall seconds, whatever the person's own rate: a bow is in time with the ground)
      const d = A.getClip().duration; A.time = Math.max(0, Math.min(d - 1e-3, Sp.t0 + (Sp.t1 - Sp.t0) * smo(Sp.u))); A.timeScale = 0;
      if (Sp.u < 1) return;
      P.span = null;
      if (Sp.hold) { (P.win = P.win || {})[Sp.name] = Sp.holdSecs > 0 ? [Sp.t1, Sp.hold, Sp.holdSecs] : [Sp.t1, Sp.hold]; P.clock = 0; }
      if (Sp.then) Sp.then(P);
    }
    /* a take with a window of its own from now on (a pose held: both hands laid forward), or with none (it runs whole);
       `secs`, where said, is how long the window takes there and back (windowTime) */
    function hold(P, name, from, len, fade = 0.5, secs = 0) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) return; P.span = null; ++P.actN;
        if (len == null) { if (P.win) delete P.win[name]; } else { (P.win = P.win || {})[name] = secs > 0 ? [from, len, secs] : [from, len]; P.clock = 0; }
        take(P, name, fade); if (len == null) P.acts[name].timeScale = 1; });
    }
    /* back to the take a person was built in, and its window */
    function rest(P, fade = 0.6) {
      if (!P) return;
      whenReady(P, () => { P.span = null; ++P.actN; const R = P.rest;
        if (R.win && R.win[R.take]) { (P.win = P.win || {})[R.take] = R.win[R.take]; P.clock = 0; }
        take(P, R.take, fade); });
    }
    /* a person who speaks plays his talking take from the line's own start, and goes back to rest after it (v11.4);
       whatever he is given to do meanwhile wins (the act's number has moved on) */
    function talk(P, secs, name) {
      if (!P) return;
      whenReady(P, () => { const tk = name || P.talkTake; if (!tk || !P.acts[tk]) return;
        if (P.win && P.win[tk]) delete P.win[tk];
        P.span = null; const n = ++P.actN; take(P, tk, 0.35); P.acts[tk].timeScale = 1;
        after(Math.max(0.4, secs - 0.15), () => { if (P.actN === n) rest(P, 0.5); }); });
    }
    /* A LOOK (v6.9): the head eased onto a point (or the lens) within a neck's reach, laid on after the mixer has
       written the take and so never stacked (the take writes the head again before the next look is laid). The face's
       own direction is the head's turn since its bind (headRest), not the bone's axes. */
    const _lkq = new THREE.Quaternion(), _lkq2 = new THREE.Quaternion(), _lkq3 = new THREE.Quaternion(), _lkv = new THREE.Vector3(), _lkv2 = new THREE.Vector3(), _lkz = new THREE.Vector3();
    function gaze(P, target, o = {}) { if (!P) return; P.gaze = target ? { target, reach: o.reach != null ? o.reach : 0.75, secs: o.secs || 0.9, down: o.down != null ? o.down : 0.03 } : null; if (!target) P.gazeOut = o.secs || 0.9; }
    function gazeTick(P, wdt) {
      const G = P.gaze, secs = G ? G.secs : (P.gazeOut || 0.9);
      P.gazeK = G ? Math.min(1, P.gazeK + wdt / secs) : Math.max(0, P.gazeK - wdt / secs);
      const L = G || P.gazeLast; if (G) P.gazeLast = G;
      if (!L || !(P.gazeK > 0) || !P.head || !P.headRest) return;
      lookSave(P);
      const tg = L.target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(L.target[0], L.target[1], L.target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      /* the face's direction now, in the world: the head's turn since its bind, applied to +z */
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      _lkv2.sub(_lkv); _lkv2.y -= L.down * _lkv2.length(); _lkv2.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(_lkv2)))); if (ang < 1e-3) return;
      natLook(P, _lkz, _lkv2, smo(P.gazeK), L.reach, _lkq);
    }
    /* a film's look: the head turned onto a point (or the lens) by k, now, with no clock of its own (after pose()) */
    function lookNow(P, target, k = 1, reach = 0.75, down = 0.03) {
      if (!P || !P.ready || !P.head || !P.headRest || !(k > 0)) return;
      lookSave(P);
      const tg = target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(target[0], target[1], target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      tg.sub(_lkv); tg.y -= down * tg.length(); tg.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(tg)))); if (ang < 1e-3) return;
      natLook(P, _lkz, tg, smo(c01(k)), reach, _lkq);
    }
    /* HANDS LAID ON A THING (photograph 5: the kneeling man raises his bai sri in both hands and the seated master "has
       both his hands on it too": that is the empowerment, Chad's §0). A take holds a body's hands where that body's own
       motion puts them, and no two takes of two bodies put four hands on one bowl. So the BOWL is the truth and the
       hands go to it: each arm solved as two bones onto its wrist's place, the elbow down and out (v24.21's solver,
       below), and the hand turned so its palm lies on the thing with its fingers along it. Laid on after the take has
       posed the body, and UNDONE before the mixer runs again (the v11.5 law: the mixer writes a bone only when its
       take's value changes, so a turn left in a bone would be turned again from itself).
       A hand's own axes are MEASURED on the body, once (v25.3: "each hand's own surface and thumb side"), from its
       bind pose: armsOf. */
    const _ia = new THREE.Vector3(), _ib = new THREE.Vector3(), _ic = new THREE.Vector3(), _it = new THREE.Vector3(), _ie = new THREE.Vector3(),
          _ipo = new THREE.Vector3(), _iu = new THREE.Vector3(), _iv = new THREE.Vector3(), _ig = new THREE.Vector3(),
          _iqa = new THREE.Quaternion(), _iqb = new THREE.Quaternion(), _iqp = new THREE.Quaternion();
    function armTo(a, target, pole) {
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ia); a.fore.getWorldPosition(_ib); a.hand.getWorldPosition(_ic);
      const la = _ia.distanceTo(_ib), lb = _ib.distanceTo(_ic);
      _it.copy(target).sub(_ia); let d = _it.length(); if (d < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _it.divideScalar(d); d = THREE.MathUtils.clamp(d, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ipo.copy(pole).sub(_ia); _ipo.addScaledVector(_it, -_ipo.dot(_it)); if (_ipo.lengthSq() < 1e-10) return; _ipo.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ie.copy(_ia).addScaledVector(_it, la * ca).addScaledVector(_ipo, la * sa);
      _iu.copy(_ib).sub(_ia).normalize(); _iv.copy(_ie).sub(_ia).normalize();
      _iqa.setFromUnitVectors(_iu, _iv); a.up.getWorldQuaternion(_iqb); _iqa.multiply(_iqb);
      a.up.parent.getWorldQuaternion(_iqp); a.up.quaternion.copy(_iqa.premultiply(_iqp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.getWorldPosition(_ib); a.hand.getWorldPosition(_ic);
      _iu.copy(_ic).sub(_ib).normalize(); _iv.copy(target).sub(_ib).normalize();
      _iqa.setFromUnitVectors(_iu, _iv); a.fore.getWorldQuaternion(_iqb); _iqa.multiply(_iqb);
      a.fore.parent.getWorldQuaternion(_iqp); a.fore.quaternion.copy(_iqa.premultiply(_iqp.invert()));
      a.fore.updateWorldMatrix(false, true);
    }
    const ARMS = { L: ['LeftArm', 'LeftForeArm', 'LeftHand'], R: ['RightArm', 'RightForeArm', 'RightHand'] };
    const _hb = new THREE.Vector3(), _hf = new THREE.Vector3(), _hn = new THREE.Vector3(), _ha = new THREE.Vector3(), _hW = new THREE.Vector3(), _hP = new THREE.Vector3(),
          _hL = new THREE.Vector3(), _hm = new THREE.Matrix4(), _hm2 = new THREE.Matrix4(), _hq = new THREE.Quaternion(), _hq2 = new THREE.Quaternion();
    function armsOf(P) {
      if (P.arms !== undefined) return P.arms;
      P.arms = null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const skins = P.lv[1]; if (!skins || !skins.length) return null;
      /* (a bone's place and turn in the bind pose, from whichever skin is bound to it) */
      const bindOf = (b) => { if (!b) return null; for (const sm of skins) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; };
      const at = (b) => { const m = bindOf(b); return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
      const out = {}, v = new THREE.Vector3();
      for (const sd of ['L', 'R']) {
        const S0 = sd === 'L' ? 'Left' : 'Right', side = sd === 'L' ? 1 : -1;
        const up = bone(S0 + 'Arm'), fore = bone(S0 + 'ForeArm'), hand = bone(S0 + 'Hand'); if (!up || !fore || !hand) return null;
        const mh = bindOf(hand), ph = at(hand), pf = at(fore); if (!mh || !ph || !pf) return null;
        let f, nrm, palm;
        const pMid = at(bone(S0 + 'HandMiddle1')), pOut = at(bone(S0 + 'HandPinky1')) || at(bone(S0 + 'HandRing1')), pIn = at(bone(S0 + 'HandIndex1')) || pMid;
        if (pMid && pOut && pIn) {
          /* A RIG WITH FINGERS: the fingers' line runs from the wrist to the middle finger's root; across the palm runs
             from the little finger's root to the first finger's; the palm faces their cross (a left hand held out flat,
             fingers along +x and thumb to +z, faces down: +x cross +z; a right hand is its mirror) */
          f = pMid.clone().sub(ph); palm = 0.55 * f.length(); f.normalize();
          const ac = pIn.clone().sub(pOut); ac.addScaledVector(f, -ac.dot(f)).normalize();
          nrm = new THREE.Vector3().crossVectors(f, ac).multiplyScalar(side).normalize();
        } else {
          /* A RIG WITH NONE: the forearm's line carried on; the palm's normal is the thin axis of the skin the hand bone
             carries, about that line, signed to face down and in (as an A pose or a T pose holds a palm) */
          f = ph.clone().sub(pf).normalize();
          const u = new THREE.Vector3(0, 1, 0); if (Math.abs(f.y) > 0.9) u.set(0, 0, 1); u.addScaledVector(f, -u.dot(f)).normalize(); const w = new THREE.Vector3().crossVectors(f, u);
          let n = 0, su = 0, sw = 0, suu = 0, sww = 0, suw = 0, len = 0;
          for (const sm of skins) { const hi = sm.skeleton.bones.indexOf(hand), g = sm.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sk = g.attributes.skinWeight; if (hi < 0 || !si || !sk) continue;
            for (let i = 0; i < pos.count; i++) { let wt = 0; for (let j = 0; j < 4; j++) if (si.getComponent(i, j) === hi) wt += sk.getComponent(i, j);
              if (wt < 0.6) continue;
              v.fromBufferAttribute(pos, i).applyMatrix4(sm.bindMatrix).sub(ph); const a = v.dot(u), b = v.dot(w); len = Math.max(len, v.dot(f));
              n++; su += a; sw += b; suu += a * a; sww += b * b; suw += a * b; } }
          if (n < 12) { console.warn(P.key + ': the ' + sd + ' hand has no fingers and no skin of its own to measure'); return null; }
          const cuu = suu / n - (su / n) * (su / n), cww = sww / n - (sw / n) * (sw / n), cuw = suw / n - (su / n) * (sw / n), th = 0.5 * Math.atan2(2 * cuw, cuu - cww) + Math.PI / 2;
          nrm = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(w, Math.sin(th)).normalize();
          const ref = nrm.x * -side - nrm.y;                                     // (down and in: the left hand is at +x of a body that faces +z)
          if (Math.abs(ref) < 0.2) console.warn(P.key + ': the ' + sd + ' palm faces neither down nor in at rest (' + ref.toFixed(2) + '): its side is a guess');
          if (ref < 0) nrm.negate();
          palm = 0.3 * Math.max(0.12, Math.min(0.24, len));
        }
        const ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(mh)).invert();
        const fL = f.clone().applyQuaternion(ri), nL = nrm.clone().applyQuaternion(ri), aL = new THREE.Vector3().crossVectors(nL, fL);
        out[sd] = { up, fore, hand, fL, nL, aL, palm, side, fingers: !!(pMid && pOut && pIn), wrote: false, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qHand: new THREE.Quaternion() };
      }
      P.arms = out; return out;
    }
    /* (before a body's mixer runs: what was laid on its arms is taken off) */
    function armsBack(P) { lookBack(P); const HT0 = P.ht; if (HT0 && HT0.on) { for (const R of HT0.W) if (R.on) { R.fore.quaternion.copy(R.sf); R.hand.quaternion.copy(R.sh); R.on = false; }
        for (const R of HT0.J) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; }
        for (const R of HT0.K) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; } HT0.on = false; }
      const LG = P.restLegs; if (LG && LG.wrote) { for (const sd in LG.R) { const r = LG.R[sd]; r.up.quaternion.copy(r.qUp); r.fore.quaternion.copy(r.qFore); r.foot.quaternion.copy(r.qFoot);
        if (r.gUp) r.gUp.quaternion.copy(r.qGUp); if (r.gLow) r.gLow.quaternion.copy(r.qGLow); } LG.wrote = false; }
      const A = P.arms; if (A) for (const sd in A) { const a = A[sd];
      if (a.curled) { for (const F of a.fing) F.b.quaternion.copy(F.q); if (a.fingRest) { for (const F of a.fingRest) F.b.quaternion.copy(F.q); a.fingRest = null; } a.curled = false; }
      if (!a.wrote) continue; a.up.quaternion.copy(a.qUp); a.fore.quaternion.copy(a.qFore); a.hand.quaternion.copy(a.qHand); a.wrote = false; }
      const RH0 = P.restHands; if (RH0) for (const sd in RH0.R) { const fl = RH0.R[sd].fol; if (fl) for (const F of fl) if (F.on) { F.b.quaternion.copy(F.q); F.on = false; } }
      /* (the shoulders let down were laid first, under every hand: so they are taken off last) */
      const SH = P.shd; if (SH && SH.on) { for (const R of SH.S) { R.cl.quaternion.copy(R.scl); R.up.quaternion.copy(R.sup); if (R.fol) for (const F of R.fol) F.b.quaternion.copy(F.sv); } SH.on = false; }
      const AO = P.aout; if (AO && AO.on) { for (const R of AO.B) R.b.quaternion.copy(R.sv); AO.on = false; }
      const KN = P.knees; if (KN && KN.on) { KN.hips.position.copy(KN.hp); for (const R of KN.B) R.b.quaternion.copy(R.sv); KN.on = false; }
      const UP = P.upr; if (UP && UP.armsOn) { for (const A of UP.arms) A.b.quaternion.copy(A.sv); UP.armsOn = false; }
      const AR = P.arst; if (AR && AR.on) { for (const R of AR.B) R.b.quaternion.copy(R.sv); AR.on = false; }
      if (UP && UP.on) { for (const R of UP.B) R.b.quaternion.copy(R.sv); UP.on = false; } }
    /* A HAND CLOSED ROUND A THING (the woman with the taper): each finger's three joints turned by `th` radians toward
       the palm's own facing, about the hand's own measured across-axis as it lies in the world now. Laid on after
       handTo() and taken off by armsBack() before the mixer runs again, as every laid pose is (v11.5). A rig with no
       finger bones is left as it is. */
    function curlFingers(P, sd, th) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.curled = true; }
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, th * (F.i === 3 ? 0.7 : 1)); F.b.parent.getWorldQuaternion(_hq2);
        /* world' = turn * world, so local' = parentWorld^-1 * turn * parentWorld * local */
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); }
    }
    /* (v26.11, NOGARB) a hand's resting turns, kept before a pose is laid on them: ONE list a hand and a caller (`key`),
       its turns copied in again each time (the same numbers a new list held: q copied from the bone as clone() made it;
       `i` the joint's own, or the one given), where a new list and a new turn for each joint were made every frame */
    function restList(a, key, from, i1) {
      let L = a[key];
      if (!L || L.length !== from.length) { L = a[key] = from.map(F => ({ b: F.b, q: new THREE.Quaternion(), i: 0 })); }
      for (let j = 0; j < from.length; j++) { const F = from[j], R = L[j]; R.b = F.b; R.q.copy(F.b.quaternion); R.i = i1 > 0 ? i1 : F.i; }
      return L;
    }
    /* (v26.8) A HAND OPENED ROUND A THING HELD FROM BELOW (photograph 5: the kneeling man's fingers spread up the bowl's
       sides, straight and a little bent, where the woman's take left hers closed in fists against it, Chad: "the arms of
       the female ... dont look very natural and abit awkward while holding the bai sri"): each finger's and the thumb's
       joints laid at the body's own A pose (open, relaxed: the generated people were made in it), then the four fingers
       bent toward the palm by `curl` radians at their three joints (the bowl's curve), about the hand's own across-axis.
       Laid after handTo() and taken off by armsBack() before the mixer runs again (the same bookkeeping curlFingers
       keeps). A rig with no finger bones is left as it is */
    function fingersOpen(P, sd, k = 1, curl = [0.18, 0.22, 0.12]) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.thumb) { a.thumb = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'HandThumb' + i] || P.bone['mixamorig:' + S0 + 'HandThumb' + i]; if (b) a.thumb.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.fingRest = NOGARB ? restList(a, 'frT', a.thumb, 0) : a.thumb.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: F.i })); a.curled = true; }
      if (NOGARB) { for (const F of a.fing) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
        for (const F of a.thumb) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); } }
      else for (const F of a.fing.concat(a.thumb)) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
      a.hand.updateWorldMatrix(true, true);
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, curl[F.i - 1] || 0); F.b.parent.getWorldQuaternion(_hq2);
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); F.b.updateWorldMatrix(false, true); }
      /* (part of the way, while the hold begins or ends: each joint eased from the take's own) */
      if (k < 0.999) { for (const F of a.fing) { _hq.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_hq, k); }
        for (const F of a.fingRest) { _hq.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_hq, k); }
        a.hand.updateWorldMatrix(false, true); }
    }
    /* ONE HAND onto a thing, by k: its palm's middle at `at` (a point of the thing's surface), its fingers along `f`,
       its palm facing `n` (into the thing). o: { back: how far behind the palm's middle the wrist is, in metres (the
       hand's own measure unless said); off: how far the wrist stands off the surface; out, down: the elbow's side,
       from the shoulder } */
    function handTo(P, sd, at, f, n, k = 1, o = {}) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return false;
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      P.group.updateWorldMatrix(true, true);
      const ks = smo(c01(k));
      _hf.set(f[0], f[1], f[2]).normalize(); _hn.set(n[0], n[1], n[2]); _hn.addScaledVector(_hf, -_hn.dot(_hf)).normalize();
      _hW.set(at[0], at[1], at[2]).addScaledVector(_hf, -(o.back != null ? o.back : a.palm)).addScaledVector(_hn, -(o.off != null ? o.off : 0.022));
      a.hand.getWorldPosition(_hb); _hW.set(lp(_hb.x, _hW.x, ks), lp(_hb.y, _hW.y, ks), lp(_hb.z, _hW.z, ks));
      a.up.getWorldPosition(_hP); P.group.getWorldQuaternion(_hq); _hL.set(1, 0, 0).applyQuaternion(_hq);
      _hP.addScaledVector(_hL, a.side * (o.out != null ? o.out : 0.3)); _hP.y -= (o.down != null ? o.down : 0.32);
      /* (o.aft: the elbow drawn behind the body too, for a hand held at the hip: the woman with the taper. Absent, nothing moves) */
      if (o.aft) { _hL.set(0, 0, 1).applyQuaternion(_hq); _hP.addScaledVector(_hL, -o.aft); }
      armTo(a, _hW, _hP);
      _ha.crossVectors(_hn, _hf); _hm.makeBasis(_ha, _hn, _hf); _hm2.makeBasis(a.aL, a.nL, a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
      a.hand.parent.getWorldQuaternion(_hq2); _hq.premultiply(_hq2.invert());
      if (ks < 0.999) a.hand.quaternion.slerp(_hq, ks); else a.hand.quaternion.copy(_hq);
      a.hand.updateWorldMatrix(false, true);
      return true;
    }
    /* both hands, from a grip (baiGrip below) */
    function handsTo(P, grip, k = 1) { if (!grip) return; for (const sd of ['L', 'R']) if (grip[sd]) handTo(P, sd, grip[sd].at, grip[sd].f, grip[sd].n, k, grip[sd]); }
    /* WHERE TWO HANDS LIE ON A BAI SRI that stands at `c` (the middle of its foot, in the world) drawn at size s, for a
       body at `from` (so "forward" is from the body to the bowl). ON it (a master's: the palms down and in on the tiers
       of marigold above the bowl's rim, the fingers forward and a little down) or UNDER it (the one who offers it: the
       palms up and in under the bowl's swell, the fingers forward and up). The bowl's measures are the model's own
       (tools/probes/bands.mjs: the foot 0.09 m wide, the swell 0.13 at 0.15 m, the rim 0.19 at 0.21, tiers above) */
    function baiGrip(c, s, from, how = 'on') {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]]) {
        if (how === 'on') { const r = 0.128 * s, y = 0.285 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.035, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.035],
                      f: [F[0] * 0.9 - Lf[0] * sg * 0.32, -0.3, F[1] * 0.9 - Lf[1] * sg * 0.32], n: [-Lf[0] * sg * 0.62, -0.78, -Lf[1] * sg * 0.62], out: 0.3, down: 0.3 }; }
        else { const r = 0.112 * s, y = 0.105 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.03, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.03],
                      f: [F[0] * 0.85 - Lf[0] * sg * 0.22, 0.48, F[1] * 0.85 - Lf[1] * sg * 0.22], n: [-Lf[0] * sg * 0.8, 0.55, -Lf[1] * sg * 0.8], out: 0.22, down: 0.4 }; }
      }
      return out;
    }
    /* WHERE TWO HANDS CARRY A TRAY that stands at `c` (the middle of its foot, in the world), its foot r in radius, for a
       body at `from`: the palms up under its foot at either side, the fingers forward and a little in */
    function trayGrip(c, r, from) {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]])
        out[sd] = { at: [c[0] + Lf[0] * sg * r * 0.84 - F[0] * 0.03, c[1] - 0.004, c[2] + Lf[1] * sg * r * 0.84 - F[1] * 0.03],
                    f: [F[0] * 0.92 - Lf[0] * sg * 0.3, 0.1, F[1] * 0.92 - Lf[1] * sg * 0.3], n: [-Lf[0] * sg * 0.25, 0.95, -Lf[1] * sg * 0.25], out: 0.2, down: 0.42 };
      return out;
    }
    /* in play: a body's hands eased onto a grip and off it again (a grip may be a function, answering where the thing
       is now); in a film handsTo() is called by the film's own clock */
    function lay(P, grip, o = {}) { if (!P) return; if (grip) { P.lay = { grip, secs: o.secs || 0.8 }; P.layLast = P.lay; } else { P.lay = null; P.layOut = o.secs || 0.8; } }
    function layTick(P, wdt) {
      const G = P.lay, secs = G ? G.secs : (P.layOut || 0.8);
      P.layK = G ? Math.min(1, (P.layK || 0) + wdt / secs) : Math.max(0, (P.layK || 0) - wdt / secs);
      const L = G || P.layLast; if (!L || !(P.layK > 0)) return;
      handsTo(P, typeof L.grip === 'function' ? L.grip() : L.grip, P.layK);
    }
    /* HIS HANDS AT REST (o.handsOn; Chad, 12 Nov 2026, of the three monks as they first went live: "Look at the arms
       and hands of those monks, its completely unacceptable, how did that pass your review?"). MINE, both times: a
       seated take lays a body's hands where the body it was made on had its thighs, and on these robed bodies they went
       into the cloth; my first fix sent each palm flat onto the lap whatever the arm had to do (the wrists broke back,
       the elbows flared, the fingers stood stiff: claws), and my second moved the take's own arm as little as it could
       (the take's fingers closed into fists on the robe; Chad's monk's hands hung in the air before his knees). Both
       went past me in small pictures; and my third, the first laid as below, sent both elbows back and IN, inside his
       flank, the forearms out through the roll of his robe at the waist (an elbow bent toward a point behind the wrist,
       and by the shortest arc), seen only when the pictures were opened full size. So a rest is now DESIGNED as a body
       rests, and every one is photographed full size, high res, from before him, from each side and close on each
       hand, before it is built on (tracker §15.5).
       how 'lap': THE PALMS ON THE THIGHS, THE ELBOWS AT HIS SIDES. Each palm's middle on what is drawn of his lap (his
         body without his arms, read as heights up to 30 cm over his hip joints: `top`), wherever along the thigh leaves
         the reach from shoulder to wrist `ratio` of the arm's length (0.87, an elbow bent as an arm at rest bends it),
         the thigh's middle preferred where it cannot be had (or at `at`, if given); `out` to its outer side. The elbow
         behind the line from shoulder to wrist and below it, turned out from his side a step at a time until the upper
         arm and the forearm, each swept at its own thickness, clear what is drawn of him; the arm solved about its own
         elbow's hinge, read off his take (armHinge). The fingers carried on along the forearm's own line seen from
         above, a quarter of the way toward the thigh's, following the cloth's slope, the palm facing the cloth; the
         wrist `off` above it. Fingers with bones are his file's own at rest (the bind pose: a relaxed open hand), each
         joint curled by `curl` toward the palm, the little finger most. Measured once, on the take he rests in at its
         window's start, and reported (P.restRep: where, the reach, how far turned out, the wrist's bend).
       A HAND OF ONE PIECE (Chad's monk: no finger bones; each hand is his scan's, open, the fingers spread and a little
         cupped: tools/probes/handaxes.mjs, and photographed) is laid the same way by its own measured axes (handAxes).
         Palms joined before his chest were tried first, episode 3's solve and then one of mine, and refused by
         photograph: open spread fingers cannot press flat, and from in front the two hands showed as two open palms
         side by side.
       Laid every frame after the mixer has posed him, and taken off before it runs again (armsBack: the v11.5 law) */
    const _rhA = new THREE.Vector3(), _rhB = new THREE.Vector3(), _rhC = new THREE.Vector3(), _rhD = new THREE.Vector3(), _rhQ = new THREE.Quaternion(), _rhQ2 = new THREE.Quaternion();
    const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
    /* (a bone's turn in its parent in the bind pose, from the skin's own inverse binds) */
    function bindLocal(P, b) {
      for (const sm of P.lv[1] || []) { const sk = sm.skeleton, i = sk.bones.indexOf(b), ip = b.parent ? sk.bones.indexOf(b.parent) : -1; if (i < 0 || ip < 0) continue;
        const m = new THREE.Matrix4().copy(sk.boneInverses[ip]).multiply(new THREE.Matrix4().copy(sk.boneInverses[i]).invert());     // (the parent's bind inverted, times this bone's bind)
        const q = new THREE.Quaternion(); m.decompose(new THREE.Vector3(), q, new THREE.Vector3()); return q; }
      return null;
    }
    /* A MAN SITTING ON A CHAIR AS PHOTOGRAPH 2'S MONKS SIT (o.seat.down: { y, sink, edge, r, apron, sole }): his bottom
       on the seat, his feet flat on the ground below his knees, whatever take he sits in. Chad's monk's chair-sits
       perch, made for a seat some 8 cm higher than this chair's (his hip joints 17 cm over his knees, his thighs sloping
       thirty-three degrees: sitread.mjs), so set down by his soles his bottom hung over the seat, and set on the seat his
       feet went under the ground. So his bottom is set on the seat (the second hundredth of the skin his hips and
       thighs carry, `sink` into it), and each LEG is solved as two bones (armTo, the arms' own solver) from his hip
       joint to where the take puts that ankle, on the ground (its sole `sole` from it), the knee forward; each foot
       keeps the turn the take gives it in the world. Then he is brought forward until his shins, between the seat's
       top and the foot of its apron, stand `r` past its front face (`edge` ahead of his spot), feet and all. Laid every
       frame after the mixer has posed him and taken off before it runs again (armsBack), as a hand's grip is */
    function seatDown(P, name, SE, skins) {
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const v = new THREE.Vector3(), loc = (b) => { b.getWorldPosition(v); return P.group.worldToLocal(v.clone()); };
      const under = [], feet = { Left: [], Right: [] };
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const role = q.skeleton.bones.map(b => /^(mixamorig:?)?(Hips|(Left|Right)UpLeg)$/.test(b.name) ? 'U' : /^(mixamorig:?)?Left(Foot|Toe\w*)$/.test(b.name) ? 'Left' : /^(mixamorig:?)?Right(Foot|Toe\w*)$/.test(b.name) ? 'Right' : '');
        const SM = FASTSKIN ? skinMats(q) : null;
        for (let i = 0; i < pos.count; i++) { const w = { U: 0, Left: 0, Right: 0 }; for (let c = 0; c < 4; c++) { const r = role[si.getComponent(i, c)]; if (r) w[r] += sw.getComponent(i, c); }
          if (w.U < 0.5 && w.Left < 0.5 && w.Right < 0.5) continue; if (SM) skinVertex(q, i, v, SM); else q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          if (w.U >= 0.5) under.push([v.y, v.z, v.x]); else feet[w.Left >= 0.5 ? 'Left' : 'Right'].push([v.x, v.y, v.z]); } }
      const H = loc(P.hips), K = SE.down, legs = { R: {}, wrote: false, keepKnee: K.knees === 'keep', tuck: K.tuck !== false };
      /* (his bottom: `hipOver` under his hip joints. Read from his skin it cannot be: his scan is his robe, and what
         hangs lowest under his hips in a seated take is the robe's skirt, 24 to 31 cm down (measured twice, and lifted
         off the chair both times: photographed). A seated man's hip joints stand some 12 to 15 cm over the seat
         (measured on the two new monks in the library's chair-sit: 15, in thick robes) */
      const bottom = H.y - (K.hipOver != null ? K.hipOver : 0.13), drop = bottom - (SE.y - (K.sink != null ? K.sink : 0.01));
      for (const S0 of ['Left', 'Right']) { const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'); if (!up || !fore || !foot || !feet[S0].length) { console.warn(P.key + ': no ' + S0 + ' leg to seat'); return null; }
        const A0 = loc(foot), K0 = loc(fore);
        let sole = Infinity; for (const q of feet[S0]) if (q[1] < sole) sole = q[1];
        let footQ = P.group.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(foot.getWorldQuaternion(new THREE.Quaternion()));
        /* A FOOT LAID FLAT (K.flat: v26.2 debug, the masters' feet on the ground). A chair-sit made for a higher seat
           holds the foot toe down; set on the ground as the take has it, the foot stood on its toes. So the foot is turned
           about its own breadth until the lowest of its heel and the lowest of its toes are level (the sole flat on the
           ground), the turn taken at the ankle, and the ankle set by the sole so turned */
        if (K.flat) { const toe = bone(S0 + 'ToeBase'), T0 = toe ? loc(toe) : null;
          if (T0) { const fd = new THREE.Vector3(T0.x - A0.x, 0, T0.z - A0.z); if (fd.lengthSq() > 1e-6) { fd.normalize();
            let s0 = Infinity, s1 = -Infinity; for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z; if (u < s0) s0 = u; if (u > s1) s1 = u; }
            const span = s1 - s0, heel = [0, Infinity], toes = [0, Infinity];
            for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z;
              if (u < s0 + 0.3 * span && q[1] < heel[1]) { heel[0] = u; heel[1] = q[1]; } if (u > s1 - 0.3 * span && q[1] < toes[1]) { toes[0] = u; toes[1] = q[1]; } }
            if (span > 0.08 && heel[1] < Infinity && toes[1] < Infinity && toes[0] - heel[0] > 0.05) {
              const d3 = new THREE.Vector3().copy(fd).multiplyScalar(toes[0] - heel[0]); d3.y = toes[1] - heel[1]; d3.normalize();
              const qF = new THREE.Quaternion().setFromUnitVectors(d3, fd); footQ = qF.clone().multiply(footQ);
              sole = Infinity; const pv = new THREE.Vector3();
              for (const q of feet[S0]) { pv.set(q[0] - A0.x, q[1] - A0.y, q[2] - A0.z).applyQuaternion(qF); if (pv.y + A0.y < sole) sole = pv.y + A0.y; }
              (legs.flat = legs.flat || {})[S0] = +(Math.atan2(d3.y, Math.hypot(d3.x, d3.z)) * 180 / Math.PI).toFixed(1); } } } }
        /* (the ankle where the take has it across the ground, its sole on it; the knee's pole well ahead of the take's knee) */
        legs.R[S0] = { up, fore, foot, ank: new THREE.Vector3(A0.x, A0.y - sole + (K.sole != null ? K.sole : -0.005), A0.z), pole: new THREE.Vector3(K0.x * 1.15, K0.y + 0.1, K0.z + 0.6),
          footQ, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(),
          /* (a body whose legs are a graft on bones of their own beside its own legs: Grandmaster Pho's, leggraft.mjs,
             thigh and shin hung from his hips. They are turned as his own legs are turned, or his shins would stay
             where the take has them while his feet went where the seat lays them) */
          gUp: bone(S0 + 'LegGraftUp'), gLow: bone(S0 + 'LegGraftLow'), qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() }; }
      /* lowered by `drop`: the targets in the group's frame are where the ground is, so they do not move with him */
      P.restLegs = legs; P.model.position.set(0, -drop, 0); P.group.updateMatrixWorld(true); seatLegsLay(P);
      /* forward until the shins clear the seat's front face */
      let back = Infinity; const apron = K.apron != null ? K.apron : 0.14;
      for (const S0 in legs.R) { const r = legs.R[S0], Kn = loc(r.fore), An = loc(r.foot);
        for (const h of [SE.y, SE.y - apron]) { const t = Kn.y > An.y ? Math.max(0, Math.min(1, (Kn.y - h) / (Kn.y - An.y))) : 0; back = Math.min(back, Kn.z + t * (An.z - Kn.z) - H.z); } }
      const fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
      /* (measured with his model at the group's origin; played, it stands where `centre` puts his hips, `off`, and
         `fwd` further forward: the feet go with him) */
      const off = P.off[name] || [0, 0];
      for (const S0 in legs.R) { const r = legs.R[S0]; r.ank.x -= off[0]; r.ank.z += fwd - off[1]; r.pole.x -= off[0]; r.pole.z += fwd - off[1]; }
      armsBack(P); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      return { legs, lift: -drop, fwd, rep: { bottom: +bottom.toFixed(3), drop: +drop.toFixed(3), fwd: +fwd.toFixed(3), shins: +back.toFixed(3), flat: legs.flat || null } };
    }
    /* A KNEEL LAID ON THE FLOOR (v26.18). The kneel the woman who serves him and Ton wear in the hall was made on
       another body, and on theirs it knelt with the shins in the air: measured in the lab, her knees 13 and 16 cm over
       the tile, her ankles 15 and 17, the whole body held up on the tips of her toes behind her (the lowest of her skin),
       and the same on Ton. A real kneel sits back on the heels: the knees on the floor in front, the shins flat along it,
       the tops of the feet flat behind, the hips a little over the heels. So the body is let down (`drop`), the take's
       thigh kept to its own heading in plan and brought down until the knee is on the floor, the shin laid flat back
       along its own heading, and the foot turned to point back along the floor: the legs laid by the seated legs' own
       layer (seatLegsLay, armTo), only while the kneel is worn (P.kneelTakes, seatShare). Measured at the window's middle
       of the take; its own legs barely move across the window (the knees 2 cm) */
    function kneelLegs(P, name = 'seiza', K = {}) {
      if (!P || !P.ready || !P.acts[name] || !P.hips || P.kneelTakes) return null;
      const drop = K.drop != null ? K.drop : 0.09, kneeY = K.knee != null ? K.knee : 0.065, ankY = K.ankle != null ? K.ankle : 0.065, toeY = K.toe != null ? K.toe : 0.055;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P);
      const W = P.win && P.win[name], A = P.acts[name], d = A.getClip().duration, w0 = {};
      for (const k in P.acts) { w0[k] = P.acts[k].getEffectiveWeight(); P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const t0 = A.time; A.time = W ? (((W[0] + W[1] / 2) % d) + d) % d : d / 2; P.mixer.update(0);
      const m0 = P.model.position.clone(); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), gq = P.group.getWorldQuaternion(new THREE.Quaternion()).invert();
      const loc = (b) => b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const legs = { R: {}, kneel: true }, rep = {};
      for (const S0 of ['Left', 'Right']) {
        const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'), toe = bone(S0 + 'ToeBase');
        if (!up || !fore || !foot || !toe) { console.warn(P.key + ': no ' + S0 + ' leg to kneel'); legs.R = null; break; }
        const H = loc(up), Kn = loc(fore), An = loc(foot), Tn = loc(toe);
        const L1 = H.distanceTo(Kn), L2 = Kn.distanceTo(An), L3 = An.distanceTo(Tn);
        H.y -= drop;
        const th = new THREE.Vector2(Kn.x - H.x, Kn.z - H.z).normalize(), dy1 = H.y - kneeY, r1 = Math.sqrt(Math.max(0, L1 * L1 - dy1 * dy1));
        const knee = new THREE.Vector3(H.x + th.x * r1, kneeY, H.z + th.y * r1);
        const sh = new THREE.Vector2(An.x - Kn.x, An.z - Kn.z).normalize(), dy2 = kneeY - ankY, r2 = Math.sqrt(Math.max(0, L2 * L2 - dy2 * dy2));
        const ank = new THREE.Vector3(knee.x + sh.x * r2, ankY, knee.z + sh.y * r2);
        const ft = new THREE.Vector2(Tn.x - An.x, Tn.z - An.z).normalize(), dy3 = ankY - toeY, r3 = Math.sqrt(Math.max(0, L3 * L3 - dy3 * dy3));
        const vNow = new THREE.Vector3().subVectors(Tn, An).normalize(), vNew = new THREE.Vector3(ft.x * r3, toeY - ankY, ft.y * r3).normalize();
        const footQ = new THREE.Quaternion().setFromUnitVectors(vNow, vNew).multiply(gq.clone().multiply(foot.getWorldQuaternion(new THREE.Quaternion())));
        /* (the pole points out from the hip-to-ankle line through the knee wanted, so the solve puts the knee there and
           nowhere lower: a pole set under and before it drew the knees 2 cm into the tile, measured in the hall) */
        const ax = new THREE.Vector3().subVectors(ank, H).normalize(), foot0 = H.clone().addScaledVector(ax, new THREE.Vector3().subVectors(knee, H).dot(ax));
        const pole = knee.clone().addScaledVector(new THREE.Vector3().subVectors(knee, foot0).normalize(), 0.5);
        legs.R[S0] = { up, fore, foot, ank, pole, footQ,
          qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(), gUp: null, gLow: null, qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() };
        rep[S0] = { kneeWas: +Kn.y.toFixed(3), ankleWas: +An.y.toFixed(3), toeWas: +Tn.y.toFixed(3), knee: [knee.x, knee.z].map(v => +v.toFixed(3)), ankle: [ank.x, ank.z].map(v => +v.toFixed(3)) };
      }
      A.time = t0; for (const k in P.acts) P.acts[k].setEffectiveWeight(w0[k]); P.model.position.copy(m0); P.mixer.update(0); P.group.updateMatrixWorld(true);
      if (!legs.R) return null;
      P.offY[name] = (P.offY[name] || 0) + drop; P.restLegs = legs; P.kneelTakes = new RegExp('^' + name + '$');
      personSettle(P); P.kneelRep = rep; return rep;
    }
    /* THE KNEELERS' HANDS ON THEIR THIGHS (v26.18). Laid on the floor, the kneel's own arms hung straight down past the
       thighs to the tile, photographed from her side and front in the hall: a woman kneeling to serve, and Ton kneeling
       beside the mat, rest their hands on their thighs. The seated people's own layer lays them (restHands, 'lap': the
       hands on what the body offers under them), solved in the kneel at its window's middle and drawn only while the
       kneel is worn (`only`), with the kneeling crowd's own options (c_crowd.js KNEEL_HANDS: the wrist solved against
       its forearm; the monks' options left her wrists 35 degrees toward the thumb, jointscan) */
    function kneelHands(P, name = 'seiza', K = { how: 'lap', out: 0.035, inner: 0, turn: 0.2 }) {
      if (!P || !P.ready || !P.acts[name] || !P.kneelTakes) return null;
      const W = P.win && P.win[name], A = P.acts[name], d = A.getClip().duration, w0 = {}, pw0 = Object.assign({}, P.w);
      for (const k in P.acts) { w0[k] = P.acts[k].getEffectiveWeight(); P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      for (const k in P.w) P.w[k] = 0; P.w[name] = 1;
      const t0 = A.time; A.time = W ? (((W[0] + W[1] / 2) % d) + d) % d : d / 2; P.mixer.update(0); personSettle(P); P.group.updateMatrixWorld(true);
      const r = restHands(P, K);
      if (P.restHands) P.restHands.only = new RegExp('^' + name + '$');
      armsBack(P); A.time = t0; for (const k in P.acts) P.acts[k].setEffectiveWeight(w0[k]);
      for (const k in P.w) delete P.w[k]; Object.assign(P.w, pw0); P.mixer.update(0); personSettle(P); P.group.updateMatrixWorld(true);
      return r;
    }
    const _slA = new THREE.Vector3(), _slB = new THREE.Vector3(), _slQ = new THREE.Quaternion();
    const _slQ1 = new THREE.Quaternion(), _slQ2 = new THREE.Quaternion(), _slQ3 = new THREE.Quaternion(), _slQ4 = new THREE.Quaternion(), _slQd = new THREE.Quaternion(), _slQp = new THREE.Quaternion();
    /* (how far he wears a take that SITS, by the takes' weights: a seated man's legs are laid only while he sits. In the
       late afternoon's photograph the masters stand in Idle_3, and laid there their feet were pinned to where they
       sit: v26.2 debug. A fade between a seat and a stand lays them that share of the way) */
    const _slT = new THREE.Quaternion();
    function seatShare(P) { if (P.kneelTakes) { let k = 0; for (const n in P.w) if (P.kneelTakes.test(n)) k += P.w[n]; return Math.min(1, k); }
      const so = P.o.seat; if (!so || !so.takes) return 1 - (P.riseK || 0); let k = 0; for (const n in P.w) if (so.takes.test(n)) k += P.w[n]; return Math.min(1, k) * (1 - (P.riseK || 0)); }
    /* THE SHIN SWUNG, THE KNEE KEPT (o.seat.down.knees 'keep': Grandmaster Pho). His robe below the waist is cloth baked
       round each take's own thighs (robesim, robeshell: v24.47), so legs laid from the hip (armTo) lifted his knees
       through it: skin through the white, photographed (v26.2 debug). So his thigh stays as the take has it and only the
       shin turns about the knee, the ankle brought to the height the seat lays it at, kept to the take's own reach
       aside, the rest of its reach forward or (`tuck`) back under the seat: a man sitting with his feet drawn in */
    const _skK = new THREE.Vector3(), _skA = new THREE.Vector3(), _skF = new THREE.Vector3(), _skL = new THREE.Vector3(), _skN = new THREE.Vector3(), _skQ = new THREE.Quaternion(), _skP = new THREE.Quaternion();
    function shinTo(r, yT, tuck) {
      r.fore.getWorldPosition(_skK); r.foot.getWorldPosition(_skA);
      const L = _skK.distanceTo(_skA); if (!(L > 1e-4)) return;
      const dy = Math.max(-L + 1e-4, Math.min(L - 1e-4, yT - _skK.y));
      _skF.set(0, 0, 1).applyQuaternion(_slQ); _skF.y = 0; _skF.normalize();            // (the body's front, flat)
      const ax = _skA.x - _skK.x, az = _skA.z - _skK.z, along = ax * _skF.x + az * _skF.z;
      _skL.set(ax - along * _skF.x, 0, az - along * _skF.z);                            // (the take's reach aside, kept)
      const room = L * L - dy * dy - _skL.lengthSq(), c = room > 0 ? Math.sqrt(room) * (tuck ? -1 : Math.sign(along) || 1) : 0;
      _skN.set(_skK.x + _skL.x + _skF.x * c, _skK.y + dy, _skK.z + _skL.z + _skF.z * c);
      _skA.sub(_skK).normalize(); _skN.sub(_skK).normalize();
      _skQ.setFromUnitVectors(_skA, _skN); r.fore.getWorldQuaternion(_skP); _skQ.multiply(_skP);
      r.fore.parent.getWorldQuaternion(_skP); r.fore.quaternion.copy(_skP.invert().multiply(_skQ)); r.fore.updateWorldMatrix(false, true);
    }
    function seatLegsLay(P) {
      const LG = P.restLegs; if (!LG) return;
      const share = seatShare(P); if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_slQ);
      for (const S0 in LG.R) { const r = LG.R[S0];
        if (!LG.wrote) { r.qUp.copy(r.up.quaternion); r.qFore.copy(r.fore.quaternion); r.qFoot.copy(r.foot.quaternion);
          if (r.gUp) r.qGUp.copy(r.gUp.quaternion); if (r.gLow) r.qGLow.copy(r.gLow.quaternion); }
        if (r.gUp) { r.up.getWorldQuaternion(_slQ1); r.fore.getWorldQuaternion(_slQ2); r.gUp.getWorldQuaternion(_slQ3); if (r.gLow) r.gLow.getWorldQuaternion(_slQ4); }
        _slA.copy(r.ank); P.group.localToWorld(_slA); _slB.copy(r.pole); P.group.localToWorld(_slB);
        if (LG.keepKnee) shinTo(r, _slA.y, LG.tuck); else armTo({ up: r.up, fore: r.fore, hand: r.foot }, _slA, _slB);
        r.foot.parent.getWorldQuaternion(_hq2); _hq.copy(_slQ).multiply(r.footQ); r.foot.quaternion.copy(_hq2.invert().multiply(_hq)); r.foot.updateWorldMatrix(false, true);
        /* (a graft's thigh turned in the world as his own thigh was, and its shin as his own shin: D = after x before^-1) */
        if (r.gUp) { r.up.getWorldQuaternion(_slQd).multiply(_slQ1.invert()); _slQ3.premultiply(_slQd);
          r.gUp.parent.getWorldQuaternion(_slQp); r.gUp.quaternion.copy(_slQp.invert().multiply(_slQ3)); r.gUp.updateWorldMatrix(false, true);
          if (r.gLow) { r.fore.getWorldQuaternion(_slQd).multiply(_slQ2.invert()); _slQ4.premultiply(_slQd);
            r.gLow.parent.getWorldQuaternion(_slQp); r.gLow.quaternion.copy(_slQp.invert().multiply(_slQ4)); r.gLow.updateWorldMatrix(false, true); } }
        /* (part of the way, while he goes from sitting to standing or back: each turn eased from the take's own) */
        if (share < 0.999) { for (const [b, q0] of [[r.up, r.qUp], [r.fore, r.qFore], [r.foot, r.qFoot], [r.gUp, r.qGUp], [r.gLow, r.qGLow]]) { if (!b) continue;
            _slT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_slT, share); }
          r.up.updateWorldMatrix(false, true); if (r.gUp) r.gUp.updateWorldMatrix(false, true); } }
      LG.wrote = true;
    }
    /* A HAND OF ONE PIECE, MEASURED (tools/probes/handaxes.mjs reads the same from the file): its skin in the hand bone's
       own bind frame, and its three axes (the longest is the fingers' line, signed toward the tip bone; the shortest, the
       palm's facing, signed toward his middle as his arms hang at his sides in the bind pose); how long the hand is
       along its fingers and how far the palm's skin stands from the bone. Chad's monk's tip bone lies 27 to 31 degrees
       off his fingers' line: laid by it, his two hands met only at the heels, in a V */
    function handAxes(P, A, sd) {
      const a = A[sd], hand = a.hand, tip = hand.children.find(ch => ch.isBone), pts = [], S0 = sd === 'L' ? 'Left' : 'Right', v = new THREE.Vector3(); let ri = null;
      for (const o of P.lv[1] || []) { if (!o.skeleton) continue; const bi = o.skeleton.bones.indexOf(hand), ti = tip ? o.skeleton.bones.indexOf(tip) : -1, sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight; if (bi < 0 || !sI || !sW) continue;
        const bw = new THREE.Matrix4().copy(o.skeleton.boneInverses[bi]).invert(); if (!ri) ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bw)).invert();
        const pos = o.geometry.attributes.position, bwI = o.skeleton.boneInverses[bi];
        for (let i = 0; i < pos.count; i++) { let w = 0; for (let k = 0; k < 4; k++) { const j = sI.getComponent(i, k); if (j === bi || (ti >= 0 && j === ti)) w += sW.getComponent(i, k); } if (w < 0.6) continue;
          v.fromBufferAttribute(pos, i).applyMatrix4(o.bindMatrix).applyMatrix4(bwI); pts.push(v.clone()); } }
      if (pts.length < 30 || !ri) { console.warn(P.key + ': too little skin on his ' + S0 + ' hand to measure'); return null; }
      const mean = new THREE.Vector3(); for (const q of pts) mean.add(q); mean.multiplyScalar(1 / pts.length);
      const Cv = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of pts) { const d = [q.x - mean.x, q.y - mean.y, q.z - mean.z]; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] += d[r] * d[c]; }
      const axes = []; for (let e = 0; e < 3; e++) { let x = [0.3 + e, 0.7, 0.2 - e];
        for (let it = 0; it < 300; it++) { x = [0, 1, 2].map(r => Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]); const l = Math.hypot(x[0], x[1], x[2]) || 1; x = x.map(u => u / l); }
        const lam = [0, 1, 2].reduce((sm, r) => sm + (Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]) * x[r], 0); axes.push(new THREE.Vector3(x[0], x[1], x[2]));
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] -= lam * x[r] * x[c]; }
      const fL = axes[0].clone(); if (tip ? fL.dot(tip.position) < 0 : fL.dot(a.fL) < 0) fL.negate();
      let len = 0; for (const q of pts) len = Math.max(len, q.dot(fL));
      const nL = axes[2].clone().addScaledVector(fL, -axes[2].dot(fL)).normalize();
      { const bw = nL.clone().applyQuaternion(ri.clone().invert()); if (bw.x * (S0 === 'Left' ? 1 : -1) > 0) nL.negate(); }
      const ds = pts.map(q => q.dot(nL)).sort((x, y) => x - y);
      return { fL, nL, aL: new THREE.Vector3().crossVectors(nL, fL).normalize(), len, depth: ds[Math.floor(ds.length * 0.97)] };
    }
    function restHands(P, K = {}) {
      const A = P && P.ready ? armsOf(P) : null, skins = P.lv[1]; P.restHands = null; P.restRep = null;
      if (!A || !skins || !skins.length) return null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
      if (P.upr) { uprightLay(P); P.group.updateMatrixWorld(true); }
      /* (his legs where his seat lays them: the lap the hands lie on is theirs) */
      if (P.restLegs) { seatLegsLay(P); P.group.updateMatrixWorld(true); }
      /* (the take's own turns kept, so that what is solved here is taken off again: armsBack) */
      for (const sd in A) { const a = A[sd]; a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      const R = {}, rep = {};
      /* how 'lap': his body without his arms, as heights over the ground on a grid in his own frame */
      const CELL = 0.012, X0 = -0.6, Z0 = -0.6, NX = 100, NZ = 112, H = new Float32Array(NX * NZ).fill(-Infinity), v = new THREE.Vector3();
      /* (and the same points in cells of 3 cm, so an arm can be swept through him at its own thickness: clearSeg) */
      const VC = 0.03, vox = new Map(), vk = (x, y, z) => ((Math.floor(x / VC) + 512) * 1024 + (Math.floor(y / VC) + 512)) * 1024 + (Math.floor(z / VC) + 512);
      /* (the heights are his LAP's: nothing over his hip joints by more than 30 cm is read into them. Sought nearer his
         hips, a palm's place came under his face, and the highest thing drawn there was his nose) */
      const hipB = bone('Hips'), LAPTOP = hipB ? loc(hipB, new THREE.Vector3()).y + 0.3 : Infinity;
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const arm = q.skeleton.bones.map(b => /(Shoulder|Arm|Hand)|^Drape/.test(b.name));
        const SM = FASTSKIN ? skinMats(q) : null;
        for (let i = 0; i < pos.count; i++) { let a = 0; for (let c = 0; c < 4; c++) if (arm[si.getComponent(i, c)]) a += sw.getComponent(i, c); if (a > 0.3) continue;
          if (SM) skinVertex(q, i, v, SM); else q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          { const k = vk(v.x, v.y, v.z); let L = vox.get(k); if (!L) vox.set(k, L = []); L.push(v.x, v.y, v.z); }
          if (v.y > LAPTOP) continue;
          const cx = Math.round((v.x - X0) / CELL), cz = Math.round((v.z - Z0) / CELL); if (cx < 0 || cz < 0 || cx >= NX || cz >= NZ) continue; if (v.y > H[cz * NX + cx]) H[cz * NX + cx] = v.y; } }
      const H2 = new Float32Array(NX * NZ); for (let cz = 0; cz < NZ; cz++) for (let cx = 0; cx < NX; cx++) { let m = -Infinity; for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const x = cx + dx, z = cz + dz; if (x >= 0 && z >= 0 && x < NX && z < NZ && H[z * NX + x] > m) m = H[z * NX + x]; } H2[cz * NX + cx] = m; }
      const top = (x, z) => { const cx = Math.round((x - X0) / CELL), cz = Math.round((z - Z0) / CELL); return cx < 0 || cz < 0 || cx >= NX || cz >= NZ ? -Infinity : H2[cz * NX + cx]; };
      const OUT = K.out != null ? K.out : 0.01, TURN = K.turn != null ? K.turn : 0.2, OFF0 = K.off != null ? K.off : 0.022, RATIO = K.ratio != null ? K.ratio : 0.87;
      const CURL = K.curl || [0.22, 0.38, 0.22], SPREAD = [1.0, 1.06, 1.14, 1.24];
      /* (is anything drawn of him within r of p? and is a segment clear of him at that thickness, from `from` of its
         length on, a ball of radius skipR about skipC aside: the cloth a palm lies on) */
      const nearBody = (p, r) => { const n = Math.ceil(r / VC), cx = Math.floor(p.x / VC), cy = Math.floor(p.y / VC), cz = Math.floor(p.z / VC), r2 = r * r;
        for (let dx = -n; dx <= n; dx++) for (let dy = -n; dy <= n; dy++) for (let dz = -n; dz <= n; dz++) {
          const L = vox.get(((cx + dx + 512) * 1024 + (cy + dy + 512)) * 1024 + (cz + dz + 512)); if (!L) continue;
          for (let i = 0; i < L.length; i += 3) { const x = L[i] - p.x, y = L[i + 1] - p.y, z = L[i + 2] - p.z; if (x * x + y * y + z * z < r2) return true; } }
        return false; };
      const clearSeg = (A0, B0, r, from, skipC, skipR) => { const p = new THREE.Vector3();
        for (let s = 0; s <= 12; s++) { const u = from + (1 - from) * s / 12; p.lerpVectors(A0, B0, u); if (skipC && p.distanceTo(skipC) < skipR) continue; if (nearBody(p, r)) return false; }
        return true; };
      for (const [sd, S0, sg] of [['L', 'Left', 1], ['R', 'Right', -1]]) {
        const a = A[sd], bu = bone(S0 + 'UpLeg'), bk = bone(S0 + 'Leg'); if (!bu || !bk) continue;
        const U = loc(bu, new THREE.Vector3()), Kn = loc(bk, new THREE.Vector3()), Sh = loc(a.up, new THREE.Vector3()), E0 = loc(a.fore, new THREE.Vector3()), W0 = loc(a.hand, new THREE.Vector3());
        const la = Sh.distanceTo(E0), lb = E0.distanceTo(W0), th = new THREE.Vector3(Kn.x - U.x, 0, Kn.z - U.z).normalize(), across = new THREE.Vector3(th.z, 0, -th.x); if (across.x * sg < 0) across.negate();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = HM ? HM.len * 0.45 : a.palm, OFF = HM ? Math.max(0.015, HM.depth) : OFF0;
        const phi = -sg * TURN, fh = new THREE.Vector3(th.x * Math.cos(phi) + th.z * Math.sin(phi), 0, -th.x * Math.sin(phi) + th.z * Math.cos(phi));
        let best = null;
        /* (WHERE ON THE THIGH. With `at`, the palm there or as near it as his arm reaches. Without, wherever along the
           thigh leaves his elbow bent as a resting arm is bent: the reach from his shoulder to his wrist `ratio` of the
           arm's whole length (0.87: about 120 degrees inside the elbow). At a fixed share of the thigh, the long arms of
           the two monks made here reached their knees all but straight: photographed full size, 12 Nov) */
        /* (the hand's frame with its palm's middle at Cp and its fingers toward d seen from above: the fingers following
           the cloth's slope along d, the palm facing the cloth. A hand at rest lies within twenty degrees of level along
           its fingers, and its palm within twenty-five of facing straight down: the cloth's slope is followed only that far) */
        const frameAt = (Cp, d) => { const e = 0.03, cx = Cp.x, cz = Cp.z, sl = (top(cx + d.x * e, cz + d.z * e) - top(cx - d.x * e, cz - d.z * e)) / (2 * e), gx = (top(cx + 0.025, cz) - top(cx - 0.025, cz)) / 0.05, gz = (top(cx, cz + 0.025) - top(cx, cz - 0.025)) / 0.05;
          if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) return null;
          const f = new THREE.Vector3(d.x, Math.max(-0.36, Math.min(0.15, sl)), d.z).normalize(), nS = new THREE.Vector3(-gx, 1, -gz).normalize();
          if (nS.y < Math.cos(0.44)) { const hz = Math.hypot(nS.x, nS.z) || 1; nS.set(nS.x / hz * Math.sin(0.44), Math.cos(0.44), nS.z / hz * Math.sin(0.44)); }
          /* (K.palmUp, v26.6: THE PALM TURNED UP, the hand's back on the cloth, for a body whose take holds its forearms
             rolled palm up: the hermit in the pale yellow shawl's wrists stood wrung 56 to 77 degrees at every setting of
             a palm laid down. A seated sage's hands rest so on his knees as often as palm down. Absent, all as it was) */
          const n = K.palmUp ? nS.clone() : nS.clone().negate(); n.addScaledVector(f, -n.dot(f)).normalize();
          /* (K.palmTilt, v26.6: { L, R } radians, the palm turned about the fingers' line toward his middle, the hand on its
             little finger's edge that much: a resting hand lies so as often as flat, and the forearm turns that much less.
             Absent, flat as before) */
          const tilt = K.palmTilt && K.palmTilt[sd]; if (tilt) n.applyAxisAngle(f, sg * (K.palmUp ? -tilt : tilt)).normalize();
          return { f, n, W: Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF) }; };
        const ts = K.at != null ? Array.from({ length: 13 }, (_, k) => K.at - 0.04 * k) : Array.from({ length: 15 }, (_, k) => 0.28 + 0.04 * k);
        for (const t of ts) {
          /* (on the CREST of what is drawn over the thigh: the highest point across its line within six centimetres of
             `out`, the inner one where two are within 4 mm. Laid where the robe falls away down the thigh's outer side,
             a hand followed that slope and hung down it, fingers to the floor: photographed on monk B's left, 12 Nov) */
          /* (`inner`: how far toward his middle the crest may be sought. On a robe that drapes one lap over both knees the
             crest is between them, and both hands went to it, one on the other: photographed on Chad's monk) */
          let cx = 0, cz = 0, cy = -Infinity;
          for (let o = -(K.inner != null ? K.inner : 0.06); o <= 0.0601; o += 0.01) { const x = U.x + (Kn.x - U.x) * t + across.x * (OUT + o), z = U.z + (Kn.z - U.z) * t + across.z * (OUT + o), y = top(x, z); if (y > cy + 0.004) { cx = x; cz = z; cy = y; } }
          if (!(cy > 0.05)) continue;
          const Cp = new THREE.Vector3(cx, cy, cz), fr = frameAt(Cp, fh); if (!fr) continue;
          const { f, n, W } = fr, dS = W.distanceTo(Sh);
          if (dS > la + lb - 0.012 || dS < Math.abs(la - lb) + 0.03) continue;
          /* (and nearer the thigh's middle where the reach cannot be had: where every place on it left his arm straighter
             than that, the nearest to his shoulder was his hip crease, and his elbow went out to his side as a hand on a
             hip does: Chad's monk's right, photographed full size, 12 Nov) */
          const score = K.at != null ? 0 : Math.abs(dS / (la + lb) - RATIO) + 0.25 * Math.abs(t - 0.55);
          if (!best || score < best.score) best = { t, Cp, W, f, n, score, ratio: dS / (la + lb) };
          if (K.at != null) break; }
        if (!best) { console.warn(P.key + ': his ' + S0 + ' hand cannot reach his thigh: left as the take has it'); continue; }
        /* (his elbow's HINGE, read off the take he rests in. The takes on these rigs keep the forearm in one plane of the
           upper arm's frame, 0.0 degrees out of it at every key (masters/v25.3/measure/hinge.cjs, run on each monk's
           file: the tracker's §15.3), so one flexed moment names it; and the forearm's turn about its own line is kept as
           the take has it, as theirs never roll it) */
        if (!a.hinge) { const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
          const h = new THREE.Vector3().crossVectors(uL, dL); if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6); h.normalize();
          const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
          a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) }; }
        /* THE ELBOW (12 Nov, the first pictures of it seen full size: both elbows had gone back and IN, inside his flank,
           and each forearm came out through the roll of his robe at his waist). An arm at rest has its elbow behind the
           line from the shoulder to the wrist and below it, turned out from the side only as far as it must be: so it is
           turned out from straight behind a step at a time until the upper arm and the forearm, each swept at its own
           thickness, pass clear of what is drawn of him without his arms (the cloth under the palm aside). The arm is
           then solved as an arm, about its own elbow's hinge (armHinge) */
        const back = th.clone().negate();
        const findElbow = (Wt, Cpt) => { const T = Wt.clone().sub(Sh).normalize(), dW = Math.min(Sh.distanceTo(Wt), la + lb - 1e-3), ca = (la * la + dW * dW - lb * lb) / (2 * la * dW), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          let B = across.clone();
          for (let psi = 0.35; psi <= 1.56; psi += 0.087) {
            const Bp = back.clone().multiplyScalar(Math.cos(psi)).addScaledVector(across, Math.sin(psi)); Bp.y -= 0.4;
            Bp.addScaledVector(T, -Bp.dot(T)); if (Bp.lengthSq() < 1e-8) continue; B = Bp.normalize();
            const E = Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa);
            if (clearSeg(Sh, E, 0.045, 0.3) && clearSeg(E, Wt, 0.035, 0, Cpt, 0.12)) return { pdir: B, psi, E, clear: true }; }
          return { pdir: B, psi: 1.56, E: Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa), clear: false }; };
        let el = findElbow(best.W, best.Cp);
        /* (THE HAND ALONG ITS FOREARM: its fingers carried on along the forearm's own line seen from above, a quarter of
           the way toward the thigh's, and the elbow found again for that wrist. Laid along the thigh while the forearm came
           in from his side, each wrist was bent sideways, by up to fifty degrees: photographed full size, 12 Nov) */
        /* (K.along, v26.7: the forearm's share of that line; K.alongIt, how many times the step is taken, the elbow
           found again for each new wrist; K.handYaw { L, R }, radians the line is then turned about the upright before
           the hand is laid along it. At a quarter toward the thigh, the hermit in the pale yellow shawl's left hand,
           palm up, stood bent 35 degrees toward its little finger, the end of a real wrist's range (jointscan, v26.7's
           build); the whole way along the forearm four times over, the elbow moved each time and left the wrist bent 38
           to 47 degrees toward the thumb and the forearm wrung 115 to 122. Absent, a share of 0.75 and one step, as before) */
        { const SH = K.along != null ? K.along : 0.75, IT = K.alongIt || 1, YW = K.handYaw && K.handYaw[sd];
          for (let it = 0; it < IT; it++) { const fa = best.W.clone().sub(el.E); fa.y = 0;
            if (!(fa.lengthSq() > 1e-6)) break; const d2 = fa.normalize().multiplyScalar(SH).addScaledVector(th, 1 - SH); d2.y = 0; d2.normalize();
            if (YW) d2.applyAxisAngle(new THREE.Vector3(0, 1, 0), YW); const fr = frameAt(best.Cp, d2);
            if (!(fr && fr.W.distanceTo(Sh) < la + lb - 0.012)) break; best.f = fr.f; best.n = fr.n; best.W = fr.W; el = findElbow(best.W, best.Cp); } }
        /* (K.flexMax, v26.3: THE WRIST KEPT NEAR STRAIGHT. The brown hermit's body is short from hip to shoulder, so his
           elbow hangs at the height of his knees and his forearm climbs to them; his hand, laid along the cloth where it
           falls away over the knee, was bent down at the wrist 40 degrees (measured, tools/probes/jointscan.mjs; a real
           man's palm rests on top of the knee with the wrist near straight and only the fingers curving down over it:
           masters/v26.3/make.sh). So the hand is turned up about its own across-axis, its palm's middle where it was,
           until it bends toward the palm no more than flexMax from the forearm's line, the elbow found again each time) */
        const flexHold = () => { for (let it = 0; it < 4; it++) {
          const e = best.W.clone().sub(el.E).normalize(), f = best.f, n = best.n, ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
          const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
          const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
          best.f = f.clone().applyQuaternion(q).normalize(); best.n = n.clone().applyQuaternion(q).normalize();
          best.W = best.Cp.clone().addScaledVector(best.f, -PALM).addScaledVector(best.n, K.palmUp ? OFF : -OFF);
          el = findElbow(best.W, best.Cp); } };
        if (K.flexMax != null) flexHold();
        /* (K.wristSolve, v26.7: THE HAND'S LINE SOLVED AGAINST ITS FOREARM. Laid along a line of fixed shares (above),
           the hermit in the pale yellow shawl's left wrist, palm up, stood 35 degrees toward its little finger; a whole
           share, 40 the same way; turned 26 degrees by hand either way, 35 toward the thumb or 50 toward the little
           finger, the forearm wrung past its range (jointscan, v26.7): each new wrist moves the elbow found for it. So
           the hand's line over the cloth is tried every four degrees within sixty either side of where it stands, the
           elbow found for each, and the one kept whose wrist is nearest straight with its forearm turned within a
           forearm's range and its elbow clear of him, each measured as tools/probes/jointscan.mjs measures it) */
        /* (K.flexAfter, v26.8: THE WRIST KEPT NEAR STRAIGHT WHILE ITS LINE IS SOLVED. wristSolve lays the hand again along the
           cloth's slope for each line it tries and lets the wrist bend toward the palm up to 25 degrees; on a body whose rest
           holds it to flexMax (the brown hermit's, v26.3) each line tried is held to flexMax first, its elbow found again,
           and only then measured. Held after the pick instead, the hold moved his elbow and undid the pick: his left wrist
           stood 25 to 34 degrees toward its little finger, worse than the 20 to 27 it was mended for (jointscan, v26.9's
           first build). holdOf is flexHold's own turn, on a line being tried. Absent, all as it was) */
        const holdOf = (fr, e0) => { let f = fr.f, n = fr.n, W = fr.W, e1 = e0;
          for (let it = 0; it < 4; it++) { const e = W.clone().sub(e1.E).normalize(), ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
            const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
            const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
            f = f.clone().applyQuaternion(q).normalize(); n = n.clone().applyQuaternion(q).normalize();
            W = best.Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF); e1 = findElbow(W, best.Cp); }
          return { fr: { f, n, W }, el: e1 }; };
        if (K.wristSolve) { const wsUp = new THREE.Vector3(0, 1, 0), wsD0 = new THREE.Vector3(best.f.x, 0, best.f.z), DG = 180 / Math.PI;
          if (wsD0.lengthSq() > 1e-8) { wsD0.normalize(); let wsPick = null;
            for (let wsK = -15; wsK <= 15; wsK++) { let wsFr = frameAt(best.Cp, wsD0.clone().applyAxisAngle(wsUp, wsK * 4 / DG)); if (!wsFr || wsFr.W.distanceTo(Sh) >= la + lb - 0.012) continue;
              let wsEl = findElbow(wsFr.W, best.Cp); if (!wsEl.clear) continue;
              if (K.flexAfter && K.flexMax != null) { const wsH = holdOf(wsFr, wsEl); wsFr = wsH.fr; wsEl = wsH.el; if (!wsEl.clear) continue; }
              const wsE = wsFr.W.clone().sub(wsEl.E).normalize(), wsU = wsEl.E.clone().sub(Sh).normalize(), wsRad = new THREE.Vector3().crossVectors(wsFr.n, wsFr.f).multiplyScalar(sg);
              const wsRe = wsRad.clone().addScaledVector(wsE, -wsRad.dot(wsE)).normalize(), wsNe = wsFr.n.clone().addScaledVector(wsE, -wsFr.n.dot(wsE)).normalize();
              const wsDev = Math.atan2(wsFr.f.dot(wsRe), wsFr.f.dot(wsE)) * DG, wsFlex = Math.atan2(wsFr.f.dot(wsNe), wsFr.f.dot(wsE)) * DG;
              const wsMed = new THREE.Vector3().crossVectors(wsU, wsE).normalize().multiplyScalar(sg), wsDn = wsU.clone().addScaledVector(wsE, -wsU.dot(wsE)).normalize();
              const wsTurn = Math.atan2(wsNe.dot(wsDn), wsNe.dot(wsMed)) * DG;
              const wsC = Math.max(0, Math.abs(wsDev) - 8) ** 2 + 2 * Math.max(0, Math.abs(wsTurn) - 85) ** 2 + Math.max(0, Math.abs(wsFlex) - 25) ** 2 + 0.01 * wsK * wsK;
              if (!wsPick || wsC < wsPick.c) wsPick = { c: wsC, fr: wsFr, el: wsEl, dev: wsDev, turn: wsTurn, flex: wsFlex, yaw: wsK * 4 }; }
            if (wsPick) { best.f = wsPick.fr.f; best.n = wsPick.fr.n; best.W = wsPick.fr.W; el = wsPick.el;
              best.solve = { yaw: wsPick.yaw, dev: +wsPick.dev.toFixed(1), turn: +wsPick.turn.toFixed(1), flex: +wsPick.flex.toFixed(1) }; } } }
        if (!el.clear) console.warn(P.key + ': his ' + S0 + ' arm finds no way clear of his body: laid turned out as far as was tried');
        const pdir = el.pdir, psiAt = el.psi;
        /* the fingers: his file's own at rest, each joint curled toward the palm about the hand's own across-axis,
           worked out once in the hand's own frame */
        /* (K.gather, v26.3: THE FINGERS TOGETHER. A hand at rest on a knee holds its fingers side by side; the brown
           hermit's file rests them apart, and laid from it his fingers stood 12 to 16 degrees apart, gaps a rake's:
           Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?". Each finger's first joint is turned
           about the palm's facing toward the middle finger's line, by `gather` of what it stands apart at rest) */
        let gat = null;
        if (K.gather) { const mh = bindWorldOf(P, a.hand); if (mh) { const rh = new THREE.Quaternion(); mh.decompose(new THREE.Vector3(), rh, new THREE.Vector3()); rh.invert();
          const dirOf = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), b2 = bone(S0 + 'Hand' + fn + '2'), m1 = b1 && bindWorldOf(P, b1), m2 = b2 && bindWorldOf(P, b2); if (!m1 || !m2) return null;
            const dd = new THREE.Vector3().setFromMatrixPosition(m2).sub(new THREE.Vector3().setFromMatrixPosition(m1)).applyQuaternion(rh); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)); };
          const tl = FINGERS.map(dirOf), tm = tl[1]; if (tm != null) gat = tl.map(t0 => t0 == null ? 0 : -K.gather * (t0 - tm));
          /* (K.converge: TOUCHING, NOT ONLY PARALLEL. Drawn together to his middle finger's line, his fingers lay side by
             side with a gap between each, being thinner than his knuckles are apart (photographed, v26.3, after the
             scan read them 0 to 2 degrees apart). A resting hand's fingers aim a little in, at a point some way before
             the middle knuckle, and touch: each finger's first joint is turned to aim at that point, K.converge metres
             before the middle knuckle along the middle finger's line) */
          if (K.converge && tm != null) { const kn = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), m1 = b1 && bindWorldOf(P, b1); return m1 ? new THREE.Vector3().setFromMatrixPosition(m1) : null; };
            const pm = kn('Middle'), ph0 = new THREE.Vector3().setFromMatrixPosition(mh); if (pm) {
              const toH = (w) => w.clone().sub(ph0).applyQuaternion(rh), pmH = toH(pm);
              const cH = pmH.clone().addScaledVector(a.fL, Math.cos(tm) * K.converge).addScaledVector(a.aL, Math.sin(tm) * K.converge);
              gat = FINGERS.map((fn, fi) => { const pk = kn(fn); if (!pk || tl[fi] == null) return 0; const dd = cH.clone().sub(toH(pk)); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)) - tl[fi]; }); } } } }
        /* (a finger's three turns at a curl of k times CURL: kept, so that K.drape can find each finger's own) */
        const fingerQs = (fi, k) => { const out = []; let rel = new THREE.Quaternion(); const ax = a.aL.clone();
          for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'Hand' + FINGERS[fi] + j); if (!b) break; const q0 = bindLocal(P, b); if (!q0) break;
            /* (this joint's parent turned in the hand's frame is `rel`; the across-axis in that parent's frame) */
            /* (toward the palm is a turn the other way about the across-axis: armsOf's aL is the palm's facing crossed
               with the fingers' line, and a finger turned about the fingers' line crossed with the palm's facing goes
               toward the palm) */
            const axP = ax.clone().applyQuaternion(rel.clone().invert()).normalize(), ang = CURL[j - 1] * SPREAD[fi] * k;
            const qj = new THREE.Quaternion().setFromAxisAngle(axP, -ang);
            if (j === 1 && gat) qj.multiply(new THREE.Quaternion().setFromAxisAngle(a.nL, gat[fi]));
            qj.multiply(q0);
            out.push({ b, q: qj, fi }); rel = rel.multiply(qj); }
          return out; };
        const fing = []; for (let fi = 0; fi < FINGERS.length; fi++) fing.push(...fingerQs(fi, 1));
        /* (K.thumb 'bind', v26.7: THE THUMB AS HIS FILE RESTS IT. A take's thumb is posed for the hand it was made with,
           and a palm turned up carries it with the palm: the hermit in the pale yellow shawl's thumbs stood lifted 42
           degrees off his palms and turned across them, toward his little fingers, pointing up (measured; the reference
           picture's lie out beside the palm, barely lifted). His file's own rest has each thumb 26 degrees out from his
           index finger and 11 to 18 off the palm: laid so, joint by joint, while the rest is laid. Absent, the take's) */
        if (K.thumb === 'bind') for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'HandThumb' + j), q0 = b && bindLocal(P, b); if (q0) fing.push({ b, q: q0, fi: -1 }); }
        R[sd] = { W: best.W, pdir, f: best.f, n: best.n, fing, fingerQs };
        if (K.follow && K.follow[sd]) { const fl = K.follow[sd].map(nm => P.bone[nm]).filter(b => b && b.parent === a.up.parent).map(b => ({ b, q: new THREE.Quaternion(), on: false })); if (fl.length) R[sd].fol = fl; else console.warn(P.key + ': K.follow names no brother of his ' + sd + ' upper arm'); }
        /* (a hand of one piece is laid by its own measured axes: armsOf's, for a hand with no finger bones, is the
           forearm's line carried on) */
        if (!a.fingers) { const m = handAxes(P, A, sd); if (m) { R[sd].fL = m.fL; R[sd].nL = m.nL; R[sd].aL = m.aL; } }
        rep[sd] = { at: +best.t.toFixed(2), reach: +best.ratio.toFixed(3), turnedOut: +(psiAt * 180 / Math.PI).toFixed(0), palm: best.Cp.toArray().map(u => +u.toFixed(3)) }; if (best.solve) rep[sd].solve = best.solve; }
      P.restHands = { how: 'lap', R }; P.restRep = rep;
      /* (once laid, the elbow and the wrist's bend are read and reported: what a picture of it must agree with) */
      restHandsLay(P); P.group.updateMatrixWorld(true);
      /* (K.drape, v26.3: EACH FINGER CURLED UNTIL ITS TIP RESTS ON WHAT IS DRAWN OF HIS LAP, r over it: a palm on top of a
         knee has its fingers curving down over the kneecap's front, each as far as it reaches the cloth, no further and no
         less. Found finger by finger by halving, on the curl from 0.3 to `max` times CURL) */
      if (K.drape && !K.palmUp) { for (const sd in R) { const S0 = sd === 'L' ? 'Left' : 'Right', r = R[sd]; if (!r.fingerQs) continue; const kk = [];
          for (let fi = 0; fi < FINGERS.length; fi++) {
            const t4 = bone(S0 + 'Hand' + FINGERS[fi] + '4'), t3 = bone(S0 + 'Hand' + FINGERS[fi] + '3'); if (!t3) { kk.push(null); continue; }
            const tipAt = (out) => { if (t4) t4.getWorldPosition(out); else { t3.getWorldPosition(out); const e3 = t3.matrixWorld.elements; out.add(new THREE.Vector3(e3[4], e3[5], e3[6]).normalize().multiplyScalar(0.02)); } return P.group.worldToLocal(out); };
            const tryK = (kv) => { const qs = r.fingerQs(fi, kv); for (const F of qs) F.b.quaternion.copy(F.q); if (qs[0]) qs[0].b.updateWorldMatrix(false, true); const tp = tipAt(new THREE.Vector3()); return tp.y - top(tp.x, tp.z) - (K.drape.r != null ? K.drape.r : 0.008); };
            if (!isFinite(tryK(1))) { kk.push(null); for (const F of r.fing) if (F.fi === fi) F.b.quaternion.copy(F.q); continue; }
            let lo = K.drape.min != null ? K.drape.min : 0.3, hi = K.drape.max || 2, k = 1;
            for (let it = 0; it < 12; it++) { k = 0.5 * (lo + hi); const gk = tryK(k); if (!isFinite(gk)) break; if (gk > 0) lo = k; else hi = k; }
            kk.push(+k.toFixed(2)); r.fing = r.fing.filter(F => F.fi !== fi).concat(r.fingerQs(fi, k)); }
          rep[sd].drape = kk; }
        restHandsLay(P); P.group.updateMatrixWorld(true); }
      for (const sd in R) { const a = A[sd]; loc(a.up, _rhA); loc(a.fore, _rhB); loc(a.hand, _rhC);
        const fa = _rhC.clone().sub(_rhB).normalize(), bend = Math.acos(Math.max(-1, Math.min(1, fa.dot(R[sd].f)))) * 180 / Math.PI;
        rep[sd].elbow = _rhB.toArray().map(u => +u.toFixed(3)); rep[sd].elbowOut = +((Math.abs(_rhB.x) - Math.abs(_rhA.x))).toFixed(3); rep[sd].wristBend = +bend.toFixed(0); }
      armsBack(P); P.group.updateMatrixWorld(true); return rep;
    }
    /* AN ARM SOLVED AS AN ARM (v25.3's law; episode 4 chapter 2's armSolve, made for any rig whose hinge has been read):
       the elbow on the pole's side of the reach, the upper arm's line run to it with its hinge square to the arm's plane
       (so the shoulder rolls, as a shoulder does), and the forearm flexed about that hinge onto the wrist, its turn about
       its own line kept as the take has it. armTo (chapter 1's) turns each bone by the shortest arc, which bends an
       elbow sideways, out of its hinge: the monks' first rest */
    const _ahS = new THREE.Vector3(), _ahE = new THREE.Vector3(), _ahW = new THREE.Vector3(), _ahT = new THREE.Vector3(), _ahP = new THREE.Vector3(),
          _ahU = new THREE.Vector3(), _ahH = new THREE.Vector3(), _ahZ = new THREE.Vector3(), _ahV = new THREE.Vector3(), _ahZl = new THREE.Vector3(),
          _ahM = new THREE.Matrix4(), _ahM2 = new THREE.Matrix4(), _ahQ = new THREE.Quaternion(), _ahQp = new THREE.Quaternion();
    /* AN ELBOW'S HINGE read off the pose its arm stands in now (the takes on these rigs keep the forearm in one plane of the
       upper arm's frame: masters/v25.3/measure/hinge.cjs), as restHands reads it for the monks; kept on the arm. Read
       before anything is laid on the arm (v26.1, for the woman with the taper) */
    /* (v26.1: `hm`, a hinge MEASURED off another of the body's takes, in the upper arm's own frame. One who stands with her
       arms straight gives no hinge from her rest, and the guess put her elbow's crease 16 degrees off the one her own
       takes bend it about) */
    function hingeOf(a, sg, hm) {
      if (a.hinge) return a.hinge;
      const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
      const h = hm ? new THREE.Vector3().fromArray(hm) : new THREE.Vector3().crossVectors(uL, dL);
      if (hm) h.addScaledVector(uL, -h.dot(uL)); else if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6);
      h.normalize();
      const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
      a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) };
      return a.hinge;
    }
    /* (the class of v26.1's first taper: a point that is not a number never reaches a bone. Once NaN is written into an
       arm it stays there, for the take does not write it back, and the arm is not drawn; so it is refused, and said) */
    const armBad = new Set();
    function armHinge(a, target, pdir) {
      if (!(Number.isFinite(target.x + target.y + target.z) && Number.isFinite(pdir.x + pdir.y + pdir.z))) {
        if (!armBad.has(a)) { armBad.add(a); console.warn('armHinge: a target that is not a number, refused'); } return; }
      const G = a.hinge; if (!G) { armTo(a, target, _ahP.copy(target).add(pdir)); return; }
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ahS); a.fore.getWorldPosition(_ahE); a.hand.getWorldPosition(_ahW);
      const la = _ahS.distanceTo(_ahE), lb = _ahE.distanceTo(_ahW);
      _ahT.copy(target).sub(_ahS); const d0 = _ahT.length(); if (d0 < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _ahT.divideScalar(d0); const d = THREE.MathUtils.clamp(d0, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ahP.copy(pdir).addScaledVector(_ahT, -pdir.dot(_ahT)); if (_ahP.lengthSq() < 1e-10) return; _ahP.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ahU.copy(_ahT).multiplyScalar(ca).addScaledVector(_ahP, sa);                       // the upper arm's line
      _ahH.crossVectors(_ahP, _ahT).normalize(); _ahZ.crossVectors(_ahU, _ahH);           // its hinge, flexion positive
      _ahV.copy(_ahT).multiplyScalar(d).addScaledVector(_ahU, -la).normalize();          // the forearm's line
      _ahZl.crossVectors(G.uL, G.h);
      _ahM.makeBasis(_ahU, _ahH, _ahZ); _ahM2.makeBasis(G.uL, G.h, _ahZl).transpose(); _ahM.multiply(_ahM2);
      _ahQ.setFromRotationMatrix(_ahM); a.up.parent.getWorldQuaternion(_ahQp); a.up.quaternion.copy(_ahQ.premultiply(_ahQp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.quaternion.setFromAxisAngle(G.h, Math.acos(THREE.MathUtils.clamp(_ahU.dot(_ahV), -1, 1))).multiply(G.rest);
      a.fore.updateWorldMatrix(false, true);
    }
    /* (every frame, after the take has posed him) */
    /* (laid while he RESTS, by the rest take's weight: v26.3, the brown hermit, whose films bless with his hands (handson,
       petals, palmover) out of the same rest. A body with one take, the monks, rests in it always) */
    const _rhT = new THREE.Quaternion();
    function restHandsLay(P) {
      const RH = P.restHands, A = RH ? armsOf(P) : null; if (!A) return;
      const rt = P.rest && P.rest.take; let share = rt && P.w[rt] != null ? Math.min(1, P.w[rt]) : 1;
      /* (v26.18: the takes a rest's hands stay laid through too. The hall's Grandmaster Pho talks with his hands in his lap:
         his talk is a bench's, and its left hand, which lay on his thigh there, hung in the air over his crossed legs) */
      if (RH.hold) for (const k in P.w) if (k !== rt && RH.hold.test(k)) share = Math.min(1, share + P.w[k]);
      /* (v26.18: hands laid for one take only (a kneel), whatever the person's rest is: kneelHands) */
      if (RH.only) { share = 0; for (const k in P.w) if (RH.only.test(k)) share += P.w[k]; share = Math.min(1, share); }
      if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_rhQ);
      for (const sd in RH.R) { const a = A[sd], r = RH.R[sd];
        if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
        _rhA.copy(r.W); P.group.localToWorld(_rhA); _rhB.copy(r.pdir).applyQuaternion(_rhQ);
        armHinge(a, _rhA, _rhB);
        _rhC.copy(r.f).applyQuaternion(_rhQ); _rhD.copy(r.n).applyQuaternion(_rhQ);
        _ha.crossVectors(_rhD, _rhC); _hm.makeBasis(_ha, _rhD, _rhC); _hm2.makeBasis(r.aL || a.aL, r.nL || a.nL, r.fL || a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
        a.hand.parent.getWorldQuaternion(_hq2); a.hand.quaternion.copy(_hq2.invert().multiply(_hq)); a.hand.updateWorldMatrix(false, true);
        if (r.fing.length) { if (!a.fing) a.fing = []; if (!a.curled) { a.fingRest = NOGARB ? restList(a, 'frR', r.fing, 1) : r.fing.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: 1 })); a.curled = true; }
          for (const F of r.fing) F.b.quaternion.copy(F.q); }
        /* (part of the way, while a gesture fades in or out: each turn eased from the take's own) */
        if (share < 0.999) { if (NOGARB) { _rhT.copy(a.up.quaternion); a.up.quaternion.copy(a.qUp).slerp(_rhT, share);
            _rhT.copy(a.fore.quaternion); a.fore.quaternion.copy(a.qFore).slerp(_rhT, share);
            _rhT.copy(a.hand.quaternion); a.hand.quaternion.copy(a.qHand).slerp(_rhT, share); }
          else for (const [b, q0] of [[a.up, a.qUp], [a.fore, a.qFore], [a.hand, a.qHand]]) { _rhT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_rhT, share); }
          if (a.fingRest) for (const F of a.fingRest) { _rhT.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_rhT, share); }
          a.up.updateWorldMatrix(false, true); }
        /* (v26.18: bones that carry cloth hanging from this arm, and are its upper arm's brothers (his sleeve's drape), are
           given the turn the laying gave the upper arm: left as the take had them, the sleeve stood where the take's arm
           was and the laid arm came through it) */
        if (r.fol) { _rhT.copy(a.qUp).invert().premultiply(a.up.quaternion);
          for (const F of r.fol) { if (!F.on) { F.q.copy(F.b.quaternion); F.on = true; } F.b.quaternion.copy(F.q).premultiply(_rhT); } } }
    }
    /* THE HANDS HELD TRUE (v26.3: Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?", and of my
       answer, "Stop pretending you know what is the problem"). MEASURED on every person (tools/probes/jointscan.mjs),
       two faults that no real hand makes:
       1. FINGERS BENT SIDEWAYS at their middle and end joints, which are hinges (the brown hermit's grip in v26.2: 54 to
          70 degrees; the hermit in white, the master in white and two of the crowd's bodies in their takes, 30 to 50):
          a take made on another body and carried over by turns puts a finger's bend into a joint whose rest stands
          differently. Each such joint keeps only its turn about its own hinge (the knuckles' line as the body stands at
          rest, in the joint's parent's frame), and never bends backward past HT.back.
       2. A HAND WRUNG ROUND ON ITS FOREARM (my lap rest for the brown hermit: 77 and 111 degrees; the seated takes, 50 to
          64): a rig with no twist bones carries the forearm's whole turn at the wrist, and the skin there twists like a
          sweet's wrapper (the taper woman's, v26.3's first fix of her arm). A forearm turns along its length, so HT.roll of
          the hand's turn about the forearm's line beyond HT.free is laid on the forearm, about its own line, and the hand
          turned back by as much: the hand stays exactly where and as it was.
       3. A FINGER ROLLED ON ITS OWN LINE at its knuckle, which no finger does more than a few degrees: what a take
          carried over by turns leaves there turns the whole finger's bend aside. Its knuckle keeps its bend and its
          spread, and loses the roll.
       Laid last of a body's lays, on every body drawn and on a crowd's drivers (whose bones its members wear; a first
       pass laid it on the near skins only, and the joint scan, which reads every body from wherever it stands, read the
       far ones unmended), and taken off before the mixer runs again (armsBack: the v11.5 law). A body whose
       arm is laid after the people's own tick (the taper woman's, taperTick) says so (P.htLate) and is held true there,
       after it: laid under that lay, the wrist's share would be saved as that lay's rest and laid again every frame */
    const HT = { free: 25 * Math.PI / 180, roll: 0.5, back: -5 * Math.PI / 180 };
    const _htQ = new THREE.Quaternion(), _htQ2 = new THREE.Quaternion();
    function bindWorldOf(P, b) { for (const sm of P.lv[1] || []) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; }
    function handsTrueInit(P) {
      P.ht = null; const out = { J: [], W: [], K: [], on: false };
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
        const hand = bone(S0 + 'Hand'), fore = bone(S0 + 'ForeArm'); if (!hand || !fore) continue;
        /* (the wrist: the forearm's line in its own frame, and the hand's turn in it at rest) */
        const qh0 = bindLocal(P, hand);
        if (qh0 && hand.parent === fore && hand.position.lengthSq() > 1e-10) out.W.push({ fore, hand, qh0, ax: hand.position.clone().normalize(), sf: new THREE.Quaternion(), sh: new THREE.Quaternion(), on: false });
        /* (the fingers: the knuckles' line and the palm's facing at rest, in the bind's world) */
        const at = (n) => { const b = bone(S0 + 'Hand' + n), m = b ? bindWorldOf(P, b) : null; return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
        const pI = at('Index1'), pM = at('Middle1'), pK = at('Pinky1') || at('Ring1'), mh = bindWorldOf(P, hand); if (!pI || !pM || !pK || !mh) continue;
        const ph = new THREE.Vector3().setFromMatrixPosition(mh), f = pM.clone().sub(ph).normalize(), kl = pI.clone().sub(pK); kl.addScaledVector(f, -kl.dot(f)).normalize();
        const nrm = new THREE.Vector3().crossVectors(f, kl).multiplyScalar(side).normalize();
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) {
          const k1 = bone(S0 + 'Hand' + fn + '1'), k2 = bone(S0 + 'Hand' + fn + '2'), q1 = k1 && bindLocal(P, k1);
          if (k1 && k2 && q1 && k2.parent === k1 && k2.position.lengthSq() > 1e-12) out.K.push({ b: k1, q0: q1, ax: k2.position.clone().normalize(), sv: new THREE.Quaternion(), on: false }); }
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) for (let j = 2; j <= 3; j++) {
          const b = bone(S0 + 'Hand' + fn + j); if (!b || !b.parent) continue;
          const q0 = bindLocal(P, b), mp = bindWorldOf(P, b.parent); if (!q0 || !mp) continue;
          const rp = new THREE.Quaternion(); mp.decompose(new THREE.Vector3(), rp, new THREE.Vector3()); rp.invert();
          const u = b.position.clone(); if (u.lengthSq() < 1e-12) continue; u.normalize();
          const ax = kl.clone().applyQuaternion(rp); ax.addScaledVector(u, -ax.dot(u)); if (ax.lengthSq() < 1e-8) continue; ax.normalize();
          /* (which way about it closes the finger: its next bone turned a little about it, against the palm's facing) */
          const ch = b.children.find(x => x.isBone), c = (ch && ch.position.lengthSq() > 1e-12 ? ch.position.clone() : new THREE.Vector3(0, 1, 0)).normalize().applyQuaternion(q0);
          const np = nrm.clone().applyQuaternion(rp), sg = Math.sign(new THREE.Vector3().crossVectors(ax, c).dot(np)) || 1;
          out.J.push({ b, q0, ax, sg, max: (j === 2 ? 115 : 95) * Math.PI / 180, sv: new THREE.Quaternion(), on: false }); }
      }
      if (out.J.length || out.W.length || out.K.length) P.ht = out;
    }
    function handsTrue(P) {
      if (P.ht === undefined) handsTrueInit(P);
      const H = P.ht; if (!H || H.on) return;
      H.on = true;
      /* 0. each knuckle: its turn from the rest with its roll about the finger's own line taken out (swing kept) */
      for (const R of H.K) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert().multiply(b.quaternion);                                         // (its turn from the rest, in its own frame)
        const d = _htQ.x * R.ax.x + _htQ.y * R.ax.y + _htQ.z * R.ax.z, tl = Math.hypot(d, _htQ.w); if (!(tl > 1e-9)) continue;
        _htQ2.set(R.ax.x * d / tl, R.ax.y * d / tl, R.ax.z * d / tl, _htQ.w / tl);                // (the roll)
        b.quaternion.copy(R.q0).multiply(_htQ.multiply(_htQ2.invert())); }
      /* 1. each finger's middle and end joint: only its turn about its own hinge, from the rest */
      for (const R of H.J) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert(); _htQ2.copy(b.quaternion).multiply(_htQ);                       // (its turn from the rest, in its parent's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let ang = 2 * Math.atan2(d, _htQ2.w); if (ang > Math.PI) ang -= 2 * Math.PI; if (ang < -Math.PI) ang += 2 * Math.PI;
        const fl = Math.max(HT.back, Math.min(R.max, ang * R.sg));
        b.quaternion.setFromAxisAngle(R.ax, fl * R.sg).multiply(R.q0); }
      /* 2. the hand's turn about the forearm's line, shared with the forearm */
      for (const R of H.W) { R.sf.copy(R.fore.quaternion); R.sh.copy(R.hand.quaternion); R.on = true;
        _htQ.copy(R.qh0).invert(); _htQ2.copy(R.hand.quaternion).multiply(_htQ);                // (the hand's turn from its rest, in the forearm's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let tw = 2 * Math.atan2(d, _htQ2.w); if (tw > Math.PI) tw -= 2 * Math.PI; if (tw < -Math.PI) tw += 2 * Math.PI;
        if (Math.abs(tw) <= HT.free) continue;
        const mv = HT.roll * tw;
        _htQ.setFromAxisAngle(R.ax, mv); R.fore.quaternion.multiply(_htQ);
        _htQ.setFromAxisAngle(R.ax, -mv); R.hand.quaternion.premultiply(_htQ); }
    }
    /* the middle of a person's two hands, in the world (what a raised bowl is stood on) */
    const HANDS = { L: /^(mixamorig:?)?LeftHand$/, R: /^(mixamorig:?)?RightHand$/ };
    function handsMid(P, out) {
      if (!P || !P.ready) return null;
      if (!P.handL) for (const n in P.bone) { if (HANDS.L.test(n)) P.handL = P.bone[n]; if (HANDS.R.test(n)) P.handR = P.bone[n]; }
      if (!P.handL || !P.handR) return null;
      P.group.updateWorldMatrix(true, true);
      P.handL.getWorldPosition(out); P.handR.getWorldPosition(_lkv); return out.add(_lkv).multiplyScalar(0.5);
    }
    /* where a take would hold a person's hands at one of its moments, in the person's own frame (measured, then the
       take the person wears is put back): a body is stood where two pairs of hands can meet on one bowl */
    function handsAt(P, name, t, out, sd) {
      if (!P || !P.ready || !P.acts[name]) return null;
      armsBack(P);
      const keep = {}; for (const k in P.acts) { keep[k] = [P.acts[k].getEffectiveWeight(), P.acts[k].time]; P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const w0 = Object.assign({}, P.w); for (const k in P.w) P.w[k] = k === name ? 1 : 0;
      P.acts[name].time = t; personSettle(P); P.mixer.update(0);
      const ok = handsMid(P, out); if (ok && sd) (sd === 'L' ? P.handL : P.handR).getWorldPosition(out);      // (sd: that one hand, not the middle of the two)
      if (ok) P.group.worldToLocal(out);
      for (const k in P.acts) { P.acts[k].setEffectiveWeight(keep[k][0]); P.acts[k].time = keep[k][1]; }
      Object.assign(P.w, w0); personSettle(P); P.mixer.update(0);
      return ok ? out : null;
    }

    /* THE CROWD (the tracker's §12). Forty-odd people cannot each have a skeleton on a phone. Each of the eight devotee
       bodies has a few DRIVERS instead: a person nobody sees, with its mixer, wearing one take at one phase. A MEMBER of
       the crowd is that body's skins drawn again from the driver's bones, wherever the member sits (three's detached
       bind mode: the pose comes from the bones, the place from the member's own group; episode 1 chapter 3's crowd,
       v5.21). So the whole crowd breathes, sways and bows on a score of mixers. A driver stands at the world's origin,
       unturned, or every member would be thrown by its place. */
    const crowd = [];
    function mkDriver(key, o = {}) { return mkPerson(key, 0, 0, 0, Object.assign({ driver: true }, o)); }
    function mkMember(D, x, z, ry, o = {}) {
      const s = o.s || 1, M0 = { D, group: new THREE.Group(), lv: [null, null, null, null], lvNow: -1, s, o };
      M0.group.position.set(x, o.y || 0, z); M0.group.rotation.y = ry; M0.group.scale.set(o.mirror ? -s : s, s, s); (o.parent || world).add(M0.group);
      if (!o.noBlob) M0.blob = blob(M0.group, (o.blobW || 0.95) / s, (o.blobD || 0.9) / s);
      crowd.push(M0); D.members.push(M0);
      for (let i = 1; i < 4; i++) if (D.lv[i]) memberSkin(M0, i);
      return M0;
    }
    function memberSkin(M0, i) {
      const src = M0.D.lv[i]; if (!src || M0.lv[i]) return;
      M0.lv[i] = src.map(sm => { const c = sm.clone(); c.bindMode = 'detached'; c.bindMatrix.identity(); c.bindMatrixInverse.identity();
        c.frustumCulled = false; c.visible = false; M0.group.add(c); return c; });
      M0.lvNow = -1;
      if (ctx.cullBySphere) ctx.cullBySphere(M0.group, 0, 0.75, 0, 1.6);         // a sitter or a stander, and room for a bow
    }

    /* WHICH SKIN IS DRAWN, every frame, from the lens. b: a boundary is crossed only 7 % past it (no flicker). A missing
       skin is stood in for by the next fuller one that is there. `force` (a film's close shot) names a level outright. */
    function levelFor(now, d, max) {
      let lv = 0;
      for (let i = 0; i < 3; i++) { const b = LEVELS[i][1]; if (now > i ? !(d < b * 0.93) : d > b * 1.07) lv++; }
      return Math.max(lv, max);
    }
    function showLevel(X, want) {
      let k = want; while (k > 1 && !X.lv[k]) k--;                                // the far skins fall back on the near one
      if (!X.lv[k]) k = 1;
      if (!X.lv[k]) return;
      if (k === X.lvShown && X.lvNow === want) return;
      for (let i = 0; i < 4; i++) if (X.lv[i]) for (const m of X.lv[i]) m.visible = i === k;
      X.lvShown = k; X.lvNow = want;
    }
    /* (v26.8: A LEVEL BY THE SIZE ON THE SCREEN. A level was chosen by the distance from the lens alone, so a film's narrow
       lens drew a man far off as big as one beside him and gave him the far man's body: the brown hermit, 2.3 m from the
       lens at the festival's bai sri through a 26 to 45 degree lens, as big on the screen as a man 0.7 to 1.3 m away in
       play's 72, drawn from his 30,000 triangles where his full model is made for that (Chad: "look at how bad and blocky
       the arms look , are these the full res models?"). The distance is now read through the lens: times the lens's
       half-height against play's. Play's own lens reads exactly as before) */
    const LENS0 = Math.tan(72 * Math.PI / 360);
    function peopleLevels(cam = camera) {
      cam.getWorldPosition(_lens);
      const lk = Math.tan((cam.fov || 72) * Math.PI / 360) / LENS0;
      for (const P of people) { if (!P.ready || P.driver) { if (P.driver && P.ready && P.lvShown !== -2) { for (let i = 0; i < 4; i++) if (P.lv[i]) for (const m of P.lv[i]) m.visible = false; P.lvShown = -2; } continue; }
        if (!P.group.visible) continue;
        /* (o.lodK: a child is two thirds of a grown body's height, and is drawn at each level two thirds as far) */
        const g = P.group.position, d = lk * Math.hypot(g.x - _lens.x, g.y + 1.0 - _lens.y, g.z - _lens.z) / (P.o.lodK || 1);
        showLevel(P, P.force != null ? P.force : levelFor(P.lvNow < 0 ? 3 : P.lvNow, d, P.lv[0] ? 0 : 1)); }
      for (const M0 of crowd) { if (!M0.group.visible || !M0.D.ready) continue;
        const g = M0.group.position, d = lk * Math.hypot(g.x - _lens.x, g.y + 0.8 - _lens.y, g.z - _lens.z);
        showLevel(M0, levelFor(M0.lvNow < 0 ? 3 : M0.lvNow, d, 1)); }
    }

    /* THE CAST OF DAY ONE AND DAY TWO. Who they are is the plan's §3.3. Each stands or sits where the photographs put
       their kind: the masters under their tents on the west side, the monks under the east one, Grandmaster Pho under the
       gold. (The crowd, the dancers and those who go up are placed by the play and the films.) */
    /* A LOOK AS A NECK MAKES IT (R86, R87; Chad, 19 Nov: "neck is too bent", of Amma standing in ending A, and "yellow
       woman's head is too bent and unnatural", of Mala in ending B's floor shot). Two faults, both measured in the code:
       1. A look was laid on the head after the mixer and never taken off. The mixer writes a bone only when its take's
          value changes (the v11.5 law), so on a take run to its end and held (her rise; a kneel held), the head kept the
          last frame's look and the next was laid on top: in a few frames the head swung all the way onto its mark,
          whatever the reach (Amma's chin up into her son's face; Mala's head down onto her mother's). Now each look is
          kept with what it turned (lookSave) and taken off before the next pose is written (lookBack, from armsBack, the
          undo before the mixer), and laid again from the take's own pose.
       2. A look was the shortest turn of the head bone onto its mark, up to 0.9 rad at one joint: a look down and to one
          side is a turn about a slanted axis, which TIPS the head over (Mala's, nearly on its side). Now a look is a turn
          about the chest's own up and a nod over the face's own side axis, never a tip; the turn held within the
          caller's reach and 57 degrees of the chest, the nod within 19 up and 31 down of the chest's level (a real
          neck's comfortable range, inside its full one: flexion and extension about 45 each, rotation about 60 to 80;
          the AAOS's normal values, an elderly neck less); and the neck takes two fifths of it, the head the rest, so the
          bend is spread over the neck as a body's is, not folded at the skull. A reach over 1 rad is a spirit's (the
          one on her back looks at the lens): it keeps the shortest turn. */
    const LOOK_UP = 0.33, LOOK_DOWN = 0.55, LOOK_YAW = 1.0, LOOK_NECK = 0.4;
    const _nlA = new THREE.Vector3(), _nlB = new THREE.Vector3(), _nlU = new THREE.Vector3(), _nlF = new THREE.Vector3(), _nlR = new THREE.Vector3(),
          _nlq = new THREE.Quaternion(), _nlq2 = new THREE.Quaternion(), _nlq3 = new THREE.Quaternion(), _nlq4 = new THREE.Quaternion();
    function neckOf(P) { const p = P.head && P.head.parent; return p && p.isBone && /Neck$/.test(p.name) ? p : null; }
    function lookSave(P) {
      let L = P.lkSave;
      if (!L) { const nb = neckOf(P); L = P.lkSave = { on: false, h: new THREE.Quaternion(), nb, n: new THREE.Quaternion() }; }
      if (L.on) { P.head.quaternion.copy(L.h); if (L.nb) L.nb.quaternion.copy(L.n); }     // (laid again with no pose between: from the same pose)
      else { L.h.copy(P.head.quaternion); if (L.nb) L.n.copy(L.nb.quaternion); L.on = true; }
    }
    function lookBack(P) { const L = P.lkSave; if (!L || !L.on) return; P.head.quaternion.copy(L.h); if (L.nb) L.nb.quaternion.copy(L.n); L.on = false; }
    /* a bone's bind turn, inverted (as headRest): its turn since its bind, applied to +z and +y, is where it faces and its up */
    function boneRest(P, b) {
      if (!b) return null; P.bRest = P.bRest || new Map(); if (P.bRest.has(b)) return P.bRest.get(b);
      let q = null;
      P.group.traverse((o) => { if (q || !o.isSkinnedMesh || !o.skeleton) return; const i = o.skeleton.bones.indexOf(b); if (i < 0) return;
        const m = new THREE.Matrix4().copy(o.skeleton.boneInverses[i]).invert().premultiply(o.bindMatrix);
        q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(m)).invert(); });
      P.bRest.set(b, q); return q;
    }
    /* f: where the face looks now (world), g: where it is asked to (world, unit), s: how far (0..1), hq: the head's world
       turn before this look */
    function natLook(P, f, g, s, reach, hq) {
      const head = P.head, neck = neckOf(P), chest = neck ? neck.parent : head.parent;
      if (reach > 1) {                                       // (a spirit's: the shortest turn, at the head)
        const a = Math.acos(Math.max(-1, Math.min(1, f.dot(g)))); if (a < 1e-3) return;
        _nlq3.setFromUnitVectors(f, g); _nlq2.identity().slerp(_nlq3, s * Math.min(1, reach / a));
        head.parent.getWorldQuaternion(_nlq3); head.quaternion.copy(_nlq3.invert().multiply(_nlq2).multiply(hq)); return;
      }
      const cr = boneRest(P, chest);
      if (cr && chest) { chest.getWorldQuaternion(_nlq); _nlq.multiply(cr); } else P.group.getWorldQuaternion(_nlq);
      _nlF.set(0, 0, 1).applyQuaternion(_nlq); _nlU.set(0, 1, 0).applyQuaternion(_nlq); _nlR.crossVectors(_nlU, _nlF).normalize();
      const yawOf = (v) => Math.atan2(v.dot(_nlR), v.dot(_nlF)), nodOf = (v) => Math.asin(Math.max(-1, Math.min(1, v.dot(_nlU))));
      const fy = yawOf(f), fn = nodOf(f), gy = yawOf(g), gn = nodOf(g), ym = Math.max(LOOK_YAW, reach);
      let dy = Math.atan2(Math.sin(gy - fy), Math.cos(gy - fy)); dy = Math.max(-reach, Math.min(reach, dy));
      dy = Math.max(-ym, Math.min(ym, fy + dy)) - fy;
      let dn = Math.max(-LOOK_DOWN, Math.min(LOOK_UP, gn)) - fn; dn = Math.max(-reach, Math.min(reach, dn));
      dy *= s; dn *= s; if (Math.abs(dy) < 1e-4 && Math.abs(dn) < 1e-4) return;
      _nlq2.setFromAxisAngle(_nlU, dy);                       // the turn, about the chest's up
      _nlA.copy(f).applyQuaternion(_nlq2); _nlB.crossVectors(_nlA, _nlU);
      if (_nlB.lengthSq() < 1e-8) _nlB.copy(_nlR); _nlB.normalize();
      _nlq3.setFromAxisAngle(_nlB, dn).multiply(_nlq2);       // then the nod, about the turned face's side: never a tip
      if (neck && neck.parent) {
        neck.getWorldQuaternion(_nlq4); _nlq.identity().slerp(_nlq3, LOOK_NECK); _nlq4.premultiply(_nlq);   // the neck's share
        neck.parent.getWorldQuaternion(_nlq2); neck.quaternion.copy(_nlq2.invert().multiply(_nlq4));
        _nlq2.copy(_nlq3).multiply(hq); head.quaternion.copy(_nlq4.invert().multiply(_nlq2));          // the head: the whole, less the neck's
      } else {
        _nlq2.copy(_nlq3).multiply(hq); head.parent.getWorldQuaternion(_nlq4); head.quaternion.copy(_nlq4.invert().multiply(_nlq2));
      }
    }
    /* A BODY SAT OR STOOD UP STRAIGHT (o.upright; R42, Chad, 18 Nov 2026: "From the very start of the intro cutscene to the
       gameplay and to the ending cutscene, grandmaster pho has some animations and poses that look unnatural and overly
       hunched with shoulders tightened upwards. Fix it so that he looks more natural."). MEASURED first (tools/probes/
       posture.mjs, on his own body in the takes this chapter has him wear): seated at rest, the first moment of his rise
       from a seat (his hands on his knees) leans his trunk 17.7 degrees forward of the vertical with his neck 27.6 forward,
       the stoop of a man about to push himself up, held as if it were his sitting; his seated talk lifts both collar bones
       25 to 28 degrees over his rest (7.8 and 8.4 cm). A man sitting upright on a stool with his hands on his knees holds
       his trunk within ten degrees of the vertical. So while a take named in o.upright is worn, its trunk is turned back
       about the body's own left-right line by that take's `trunk` degrees (shared out over the three spine bones, so the
       back stays a curve) and its neck by its `head` degrees, weighted by the take's weight (a take fading in or out
       takes its share): a CONSTANT turn per take, so every breath and gesture of the take moves as it did about the new
       stance. Laid after the mixer and the head's damping, before the shoulders and the hands (a hand laid on a knee
       reaches from the shoulder as it now stands: restHands lays it after), taken off by armsBack() before the mixer runs
       again (v11.5), and laid for restHands' own measure of the arms (assemble.py) */
    const _upA = new THREE.Vector3(), _upF = new THREE.Vector3(), _upQ = new THREE.Quaternion(), _upQp = new THREE.Quaternion(), _upV = new THREE.Vector3();
    /* (`hips`: the pelvis turned back about its own joint as a man sits up on his sit bones, each thigh given back the turn
       so his legs lie where they lay (the bow's own way, c_story.js); the whole trunk goes with it as one, so a lean of
       the hips is a lean of the trunk degree for degree. `trunk`: the spine's three bones, shared out. `head`: the neck) */
    function uprightInit(P) {
      const find = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const B = [find(/Spine$/), find(/Spine1$/), find(/Spine2$/)], neck = find(/Neck$/), hips = find(/Hips$/), legs = [find(/LeftUpLeg$/), find(/RightUpLeg$/)];
      if (B.some(b => !b) || !neck || !hips || legs.some(b => !b)) { console.warn(P.key + ': o.upright asked, and its spine is not all there'); return; }
      /* (R88: the head and the collar bones too, for a take that names `chest`, `nod` or `clav`) */
      const head = find(/Head$/), clL = find(/LeftShoulder$/), clR = find(/RightShoulder$/);
      P.upr = { hips, legs, spine: B, neck, head, clL, clR, B: [hips].concat(legs, B, [neck], [head, clL, clR].filter(Boolean)).map(b => ({ b, sv: new THREE.Quaternion() })), take: Object.assign({}, P.o.upright), on: false };
      /* (R88: the upper arms, and the drape that hangs beside the left one from the same collar bone, for a take that names `arms`) */
      const arms = [find(/^(mixamorig:?)?LeftArm$/), find(/^(mixamorig:?)?RightArm$/)].filter(Boolean);
      const drapes = clL ? clL.children.filter(c => c.isBone && /^Drape/.test(c.name)) : [];
      P.upr.arms = arms.concat(drapes).map(b => ({ b, sv: new THREE.Quaternion(), pw: new THREE.Quaternion() })); P.upr.ka = 0; P.upr.armsOn = false;
    }
    const _upW0 = new THREE.Quaternion(), _upW1 = new THREE.Quaternion(), _upD = new THREE.Quaternion();
    function uprightLay(P) {
      const U = P.upr; if (!U) return;
      let tr = 0, hd = 0, hp = 0, ch = 0, nd = 0, cl = 0, cr = 0, ka = 0, dl = 0, dr = 0;
      for (const n in U.take) { const w = P.w[n] || 0, T = U.take[n]; if (w > 0) { tr += w * (T.trunk || 0); hd += w * (T.head || 0); hp += w * (T.hips || 0);
        ch += w * (T.chest || 0); nd += w * (T.nod || 0); cl += w * (T.clavL || 0); cr += w * (T.clavR || 0); ka += w * (T.arms || 0); dl += w * (T.dropL || 0); dr += w * (T.dropR || 0); } }
      U.ka = Math.min(1, ka);
      if (Math.abs(tr) < 1e-3 && Math.abs(hd) < 1e-3 && Math.abs(hp) < 1e-3 && Math.abs(ch) < 1e-3 && Math.abs(nd) < 1e-3 && Math.abs(cl) < 1e-3 && Math.abs(cr) < 1e-3 && Math.abs(dl) < 1e-3 && Math.abs(dr) < 1e-3) return;
      for (const R of U.B) R.sv.copy(R.b.quaternion);
      U.on = true;
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_upQ);
      _upF.set(0, 0, 1).applyQuaternion(_upQ); _upF.y = 0; _upF.normalize();
      _upA.set(0, 1, 0).cross(_upF).normalize();                       // (a turn about it by a positive angle leans the body forward)
      /* (R88: where each upper arm hangs from before the back is turned: uprightArmsLay hangs it from there again) */
      if (U.ka > 1e-3) for (const A of U.arms) A.b.parent.getWorldQuaternion(A.pw);
      const turn = (b, deg) => { b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upA).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      if (Math.abs(hp) >= 1e-3) { U.hips.getWorldQuaternion(_upW0); turn(U.hips, hp); U.hips.getWorldQuaternion(_upW1);
        _upD.copy(_upW1).invert().multiply(_upW0);                      // (each thigh's turn given back: new hips^-1 * old hips)
        for (const L of U.legs) { L.quaternion.premultiply(_upD); L.updateWorldMatrix(false, true); } }
      if (Math.abs(tr) >= 1e-3) for (const b of U.spine) turn(b, tr / 3);
      /* (R88: the upper back opened: the last two spine bones turned back, two thirds and one third, so the curve between
         the lower back and the upper eases as a back straightening does, not at one joint) */
      if (Math.abs(ch) >= 1e-3) { turn(U.spine[1], ch / 3); turn(U.spine[2], ch * 2 / 3); }
      if (Math.abs(hd) >= 1e-3) turn(U.neck, hd);
      if (Math.abs(nd) >= 1e-3 && U.head) turn(U.head, nd);
      /* (R88: a collar bone drawn back: turned about the vertical, its arm's top carried back with it; a positive turn takes
         either side back) */
      const clav = (b, deg, sgn) => { if (!b || Math.abs(deg) < 1e-3) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.set(0, 1, 0).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, sgn * deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      clav(U.clL, cl, 1); clav(U.clR, cr, -1);
      /* (R93, Chad, 19 Nov 2026: "And relax his shoulders by moving it down very slightly": each collar bone turned down
         about the body's forward line by `dropL` and `dropR` degrees, its shoulder going down with it; the arms are hung
         again from where the collar bones stood before (uprightArmsLay), so they hang as they did) */
      const drop = (b, deg, sgn) => { if (!b || Math.abs(deg) < 1e-3) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upF).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, sgn * deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      drop(U.clL, dl, -1); drop(U.clR, dr, 1);
    }
    /* THE ARMS LEFT HANGING WHERE THE TAKE HUNG THEM (R88, Chad, 19 Nov 2026: "grandmaster pho's shoulders are still too
       bent forward, make it more natural"). A back straightened by the upright lay carries both upper arms with it, the
       hands swung forward of his thighs: photographed from his side on build 34 at the order to take the holy water, his
       left forearm out ahead of his leg and its hand open before it, as no man stands at ease (a hanging arm hangs by its
       weight, whatever his back does). So where a take names `arms` (by its weight), each upper arm, and the drape that
       hangs beside the left one from the same collar bone, is hung again from where its collar bone stood before the lay
       turned it: the arm keeps the turn it has now (the take's, or the rest the arm's hold gave it), only the turn the lay
       put on the back above it is taken away, so every gesture of the take keeps its aim in the room. Laid after the arm's
       hold and before the knees, the arm let out and the shoulders (which hold the upper arm where it then stands), and
       taken off by armsBack() before the arm's hold is (v11.5) */
    function uprightArmsLay(P) {
      const U = P.upr; if (!U || !U.on || !(U.ka > 1e-3) || !U.arms.length) return;
      for (const A of U.arms) { A.b.parent.getWorldQuaternion(_upQp);
        _upQ.copy(_upQp).invert().multiply(A.pw).multiply(A.b.quaternion);   // (the arm's own turn, hung from where its collar bone stood)
        A.sv.copy(A.b.quaternion); A.b.quaternion.slerp(_upQ, U.ka); }
      for (const A of U.arms) A.b.updateWorldMatrix(false, true);
      U.armsOn = true;
    }
    /* AN ARM HELD AT ITS REST under its cloth (o.armRest; R77, Chad, 18 Nov 2026: "his arms and hands keep clipping into
       his robes in many of his poses"). Grandmaster Pho's left arm is under the drape of his robe, and the drape hangs from
       his collar bone on two bones of its own (DrapeArm, DrapeHang: tools/robeskin.mjs's DRAPE family) baked to follow
       the arm in each take; in his standing talk the take's left hand comes up and in, and the drape, which follows it
       only part of the way, opens on his forearm (photographed: the close's word to the family, skin showing through the
       white at his left side). While a take named in o.armRest.takes is worn, the arm's bones and the drape's are laid at
       their turns in his rest (o.armRest.from: a take and its moment, where the drape covers the arm whole), by that take's
       weight: his left hand hangs at his side under the cloth and his right talks. Laid after the upright lay, taken off
       by armsBack() before the mixer runs again (v11.5). Measured once, from the rest take, when the body lands */
    function armRestInit(P) {
      const O = P.o.armRest, A = P.acts[O.from[0]]; if (!A) { console.warn(P.key + ': o.armRest asked, and no rest take ' + O.from[0]); return; }
      const B = []; for (const n in P.bone) if (O.re.test(n)) B.push({ b: P.bone[n], q: new THREE.Quaternion(), sv: new THREE.Quaternion() });
      if (!B.length) { console.warn(P.key + ': o.armRest asked, and no bone answers it'); return; }
      const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.acts[k].getEffectiveWeight()];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === O.from[0] ? 1 : 0);
      A.time = Math.min(A.getClip().duration - 1e-3, O.from[1]); P.mixer.update(0);
      for (const R of B) R.q.copy(R.b.quaternion);
      for (const k in keep) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); }
      P.mixer.update(0);
      const up = B.find(R => /LeftArm$/.test(R.b.name));
      P.arst = { B, top: up ? up.b.parent : B[0].b.parent, take: Object.assign({}, O.takes), on: false };
    }
    function armRestLay(P) {
      const H = P.arst; if (!H) return;
      let k = 0; for (const n in H.take) k += (P.w[n] || 0) * H.take[n];
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      for (const R of H.B) { R.sv.copy(R.b.quaternion); R.b.quaternion.slerp(R.q, k); }
      H.top.updateWorldMatrix(false, true);                // (the collar bone: the arm and the drape both hang from it)
      H.on = true;
    }
    /* HIS LEFT ARM LET HANG A LITTLE OUT FROM HIS SIDE, STANDING (o.armOut; R77, Chad, 18 Nov 2026: "his arms and hands
       keep clipping into his robes in many of his poses"). Photographed standing in the blessing (build 25, four sides,
       the robe's back faces in red, the pixels read back): his left hand hung through the folds of the robe at his hip,
       a strip of white across it seen from his left, and his own forearm showed in a gap of the drape at his waist. Not my
       upright lay (taken off, more of the forearm showed) nor the drape's hanging band (swung 8 and 15 degrees out, back
       and forward on the live build: the strip stayed, it is the robe at his hip). His whole left arm with the drape over
       it (DrapeArm, DrapeHang: the upper arm's brothers under his collar bone), turned out about his forward line, was
       tried at 4, 7 and 10 degrees: at 7 the hand hangs clear of the robe and nothing of it crosses it, the forearm bare
       from the sleeve to the hand, as a robed man's arm hangs at ease (at 4 a streak of the drape still lay on the forearm;
       10 bought nothing more). Laid while a take named in o.armOut.takes is worn (inside its window: the standing end of
       his rise), by its weight, after the knees and before the shoulders (which hold the upper arm where it then stands),
       and taken off by armsBack() before the mixer runs again (v11.5) */
    const _aoQ = new THREE.Quaternion(), _aoP = new THREE.Quaternion(), _aoV = new THREE.Vector3(), _aoR = new THREE.Quaternion();
    function armOutInit(P) {
      const O = P.o.armOut; let up = null;
      for (const n in P.bone) if (/^(mixamorig:?)?LeftArm$/.test(n)) up = P.bone[n];
      if (!up) { console.warn(P.key + ': o.armOut asked, and no left upper arm'); return; }
      const B = [up].concat((O.follow || []).map(n => P.bone[n]).filter(b => b && b.parent === up.parent)).map(b => ({ b, sv: new THREE.Quaternion() }));
      P.aout = { B, take: Object.assign({}, O.takes), win: O.win || {}, rad: (O.deg || 0) * Math.PI / 180, on: false };
    }
    function armOutLay(P) {
      const H = P.aout; if (!H) return;
      let k = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (!(w > 0)) continue; const W = H.win[n], A = P.acts[n];
        if (W && A && (A.time < W[0] || A.time > W[1])) continue; k += w * H.take[n]; }
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_aoQ);
      _aoV.set(0, 0, 1).applyQuaternion(_aoQ);                    // (his forward: a turn about it by a positive angle takes his left arm out)
      const par = H.B[0].b.parent; par.updateWorldMatrix(true, false); par.getWorldQuaternion(_aoP);
      _aoV.applyQuaternion(_aoP.invert());                         // (in the collar bone's frame, which all of them hang from)
      _aoR.setFromAxisAngle(_aoV.normalize(), H.rad * k);
      for (const R of H.B) { R.sv.copy(R.b.quaternion); R.b.quaternion.premultiply(_aoR); }
      par.updateWorldMatrix(false, true);
      H.on = true;
    }
    /* KNEES STRAIGHT STANDING (o.knees; R76, Chad, 18 Nov 2026: "his knees seem bent even when standing"). MEASURED
       (tools/probes/posture.mjs, KNEE, on 21u): standing at rest the legs that are seen (the grafted ones,
       tools/leggraft.mjs) are bent 9.8 and 11.7 degrees, in his talk 12.7 and 12.2; a man standing at ease holds his knees
       within about 5 (the group photograph of the masters at the Wai Kru, masters/v26.0/ref/waikru-8: every one standing
       straight). Near straight a knee's bend is all in the last millimetres of the leg's reach (from 12 degrees to 4 the
       hip rises 4 mm), so while a take named in o.knees is worn (inside its window) his hips are lifted by what brings
       each grafted knee to `bend` degrees, by the take's weight, and both legs reach again to where his feet stood: his
       rig's (which carries his feet) and the grafted one (which is seen), each knee bending forward, each foot keeping
       its turn. Laid after the arm's hold, taken off by armsBack() before the mixer runs again (v11.5) */
    const _kA = new THREE.Vector3(), _kB = new THREE.Vector3(), _kC = new THREE.Vector3(), _kP = new THREE.Vector3(), _kF = new THREE.Vector3(), _kQ = new THREE.Quaternion();
    const _kD = new THREE.Vector3();
    function kneesInit(P) {
      const O = P.o.knees, bone = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const hips = bone(/^(mixamorig:?)?Hips$/), S = [];
      for (const sd of ['Left', 'Right']) {
        const up = bone(new RegExp('^(mixamorig:?)?' + sd + 'UpLeg$')), leg = bone(new RegExp('^(mixamorig:?)?' + sd + 'Leg$')), foot = bone(new RegExp('^(mixamorig:?)?' + sd + 'Foot$'));
        const gu = bone(new RegExp('^' + sd + 'LegGraftUp$')), gl = bone(new RegExp('^' + sd + 'LegGraftLow$'));
        if (!up || !leg || !foot || !gu || !gl) { console.warn(P.key + ': o.knees asked, and the ' + sd + ' legs are not all there'); return; }
        /* (the grafted shin's end, at the ankle it was solved to reach: his foot, measured in the shin's own frame) */
        P.group.updateWorldMatrix(true, true); foot.getWorldPosition(_kA); const gEnd = new THREE.Object3D(); gl.add(gEnd); gl.worldToLocal(gEnd.position.copy(_kA));
        S.push({ up, leg, foot, gu, gl, gEnd, T: new THREE.Vector3(), Q: new THREE.Quaternion() });
      }
      if (!hips) return;
      const B = []; for (const sd of S) for (const b of [sd.up, sd.leg, sd.foot, sd.gu, sd.gl]) B.push({ b, sv: new THREE.Quaternion() });
      P.knees = { hips, S, B, hp: new THREE.Vector3(), take: Object.assign({}, O.takes), win: O.win || {}, bend: (O.bend != null ? O.bend : 4) * Math.PI / 180, max: O.max || 0.012, on: false,
        own: O.own != null ? O.own * Math.PI / 180 : null };
    }
    function kneesLay(P) {
      const K = P.knees; if (!K) return;
      let k = 0;
      for (const n in K.take) { const w = P.w[n] || 0; if (!(w > 0)) continue; const W = K.win[n], A = P.acts[n];
        if (W && A && (A.time < W[0] || A.time > W[1])) continue; k += w * K.take[n]; }
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      P.group.updateWorldMatrix(true, true);
      let lift = Infinity;
      for (const sd of K.S) {
        sd.foot.getWorldPosition(sd.T); sd.foot.getWorldQuaternion(sd.Q);
        sd.gu.getWorldPosition(_kA); sd.gl.getWorldPosition(_kB); sd.gEnd.getWorldPosition(_kC);
        const a = _kA.distanceTo(_kB), b = _kB.distanceTo(_kC), d = _kA.distanceTo(_kC);
        if (!(d > 0.2)) return;
        const bend = Math.PI - Math.acos(THREE.MathUtils.clamp((a * a + b * b - d * d) / (2 * a * b), -1, 1));
        if (bend > 0.6) return;                                    // (not standing: a knee bent past 34 degrees is left as the take has it)
        const want = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(K.bend)), up = (_kA.y - _kC.y) / d;
        lift = Math.min(lift, Math.max(0, (want - d) / Math.max(0.5, up)));
      }
      lift = Math.min(lift, K.max) * k;
      if (!(lift > 1e-5) && K.own == null) return;
      if (!(lift > 1e-5)) lift = 0;
      for (const R of K.B) R.sv.copy(R.b.quaternion); K.hp.copy(K.hips.position);
      K.on = true;
      K.hips.getWorldPosition(_kA); _kA.y += lift; K.hips.parent.worldToLocal(_kA); K.hips.position.copy(_kA); K.hips.updateWorldMatrix(false, true);
      const ry = P.group.rotation.y; _kF.set(Math.sin(ry), 0, Math.cos(ry));
      for (const sd of K.S) {
        sd.leg.getWorldPosition(_kP); _kP.addScaledVector(_kF, 0.5);
        /* (R92: his own legs, which his robe follows, are 3.6 to 4.5 cm longer than the grafted ones that are seen, so at
           the same hips and ankles they stood bent 21.6 and 31.1 degrees, the robe pushed forward at the knees, while the
           grafted legs stood at 5.9 and 7.4: measured at the order to take the holy water on build 37. The grafted legs
           cannot reach further, so his hips stay; his own legs reach their ankles on down along the leg until they stand
           at `own` degrees, the ankles the robe's hem hangs from going down with them) */
        let T = sd.T;
        if (K.own != null) { sd.up.getWorldPosition(_kA); const a = _kA.distanceTo(sd.leg.getWorldPosition(_kB)), b = _kB.distanceTo(sd.foot.getWorldPosition(_kC)),
            d = _kA.distanceTo(sd.T), want = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(K.own));
          if (d > 0.2 && d < want) T = _kD.copy(sd.T).sub(_kA).multiplyScalar(1 + (want / d - 1) * k).add(_kA); }
        armTo({ up: sd.up, fore: sd.leg, hand: sd.foot }, T, _kP);
        sd.foot.parent.getWorldQuaternion(_kQ); sd.foot.quaternion.copy(_kQ.invert().multiply(sd.Q)); sd.foot.updateWorldMatrix(false, true);
        sd.gl.getWorldPosition(_kP); _kP.addScaledVector(_kF, 0.5);
        armTo({ up: sd.gu, fore: sd.gl, hand: sd.gEnd }, sd.T, _kP);
      }
    }

    /* ---------------------------------------------- the ground: her flat and his flat are each one level (the walk test
       floods them whole); the street below her is 3.85 m down and his city's ground 78 m down (nobody walks there in play:
       a film's lens and a probe stand there) */
    function flatGround(x, z) {
      if (x > 100) return 0;
      if (x > STREET.shop && x < STREET.x1) return x > STREET.kerb ? GY - 0.15 : GY;
      if (z < STAIR.z1 && z > STAIR.z0 && x > STAIR.x0 && x < STREET.shop) return GY + Math.max(0, Math.min(STAIR.risers, Math.floor((STAIR.x1 - x) / 0.235) + 1)) * (-GY / STAIR.risers);
      return 0;
    }

    /* ================================================================ THE SURFACES (painted, each at its real size: a metre
       of wall is a metre of its picture; the merged pieces' UVs are metres). No lamp is added (v15.1): a surface a lamp
       warms carries that warmth as its own emissive light (v9.4) */
    const wCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
    const wPic = (c, tu, tv, aniso = 8) => { const t = tex(done(THREE, c, true)); t.repeat.set(1 / tu, 1 / tv); t.anisotropy = aniso; return t; };
    /* plaster painted: an even colour with a few soft spots, repeating with no seam (chapter 5's) */
    function wPaint(hex, seed, spots = 110, k = 0.01) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = hex; x.fillRect(0, 0, 256, 256);
      for (let s = 0; s < spots; s++) { const cx0 = r() * 256, cy0 = r() * 256, q = 8 + r() * 26, dark = r() < 0.5;
        for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) { const cx = cx0 + ox, cy = cy0 + oy;
          if (cx + q < 0 || cx - q > 256 || cy + q < 0 || cy - q > 256) continue;
          const g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, dark ? `rgba(0,0,0,${k})` : `rgba(255,255,255,${k * 1.2})`); g.addColorStop(1, 'rgba(0,0,0,0)');
          x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); } }
      return c;
    }
    /* square tiles, `n` a side in the picture, each a little varied, their grout */
    function wTiles(W, n, base, grout, seed, vary = 0.08, speck = 0) {
      const [c, x] = wCanvas(W, W), r = rng(seed), T = W / n, [R, G, Bl] = base;
      x.fillStyle = grout; x.fillRect(0, 0, W, W);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const k = 1 - vary / 2 + r() * vary;
        x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(i * T + 1.5, j * T + 1.5, T - 3, T - 3);
        for (let s = 0; s < speck; s++) { x.fillStyle = r() < 0.5 ? 'rgba(50,48,44,0.25)' : 'rgba(255,255,250,0.22)';
          x.fillRect(i * T + 2 + r() * (T - 4), j * T + 2 + r() * (T - 4), 1 + r() * 1.6, 1 + r() * 1.6); }
      }
      return c;
    }
    /* floorboards along u: old timber, each board its own shade, a dark joint between, the grain drawn with each */
    function wBoards(seed, base, bw = 32, wrapW = 512) {
      const [c, x] = wCanvas(wrapW, 512), r = rng(seed), [R, G, Bl] = base;
      x.fillStyle = '#2a1c12'; x.fillRect(0, 0, wrapW, 512);
      for (let j = 0; j * bw < 512; j++) { let px = -r() * 200; const px0 = px;
        while (px < px0 + wrapW) { const L = Math.min(150 + r() * 260, px0 + wrapW - px), k = 0.86 + r() * 0.2, gr = [];
          for (let s = 0; s < 5; s++) gr.push([j * bw + 3 + r() * (bw - 6), (r() - 0.5) * 3, 0.08 + r() * 0.1]);
          for (const off of [0, wrapW, -wrapW]) { const qx = px + off;
            x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(qx + 1, j * bw + 1, L - 2, bw - 2);
            for (const [yy, dy, a] of gr) { x.strokeStyle = `rgba(40,24,12,${a})`; x.lineWidth = 1; x.beginPath(); x.moveTo(qx + 2, yy); x.lineTo(qx + L - 2, yy + dy); x.stroke(); } }
          px += L; } }
      return c;
    }
    /* terrazzo: chips of marble in a cement ground */
    function wTerrazzo(seed, ground, chips) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = ground; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1400; i++) { const s = 1 + r() * 3.2, col = chips[(r() * chips.length) | 0];
        const cx = r() * 256, cy = r() * 256;
        for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) { if (cx + ox + s < 0 || cx + ox - s > 256 || cy + oy + s < 0 || cy + oy - s > 256) continue;
          x.fillStyle = col; x.beginPath(); x.ellipse(cx + ox, cy + oy, s, s * (0.6 + r() * 0.5), r() * 3, 0, Math.PI * 2); x.fill(); } }
      return c;
    }
    /* THE FIVE-FOOT WAY'S TILES: 150 mm encaustic tiles in a plain four-part geometric pattern of the kind laid in old
       shophouse walkways (none copied from a real one), worn */
    function wEncaustic(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed), T = 64;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const ox = i * T, oy = j * T, w = 0.9 + r() * 0.1;
        x.fillStyle = `rgb(${(214 * w) | 0},${(204 * w) | 0},${(184 * w) | 0})`; x.fillRect(ox, oy, T, T);
        x.fillStyle = `rgb(${(122 * w) | 0},${(58 * w) | 0},${(44 * w) | 0})`;
        x.beginPath(); x.moveTo(ox + T / 2, oy + 6); x.lineTo(ox + T - 6, oy + T / 2); x.lineTo(ox + T / 2, oy + T - 6); x.lineTo(ox + 6, oy + T / 2); x.closePath(); x.fill();
        x.fillStyle = `rgb(${(46 * w) | 0},${(70 * w) | 0},${(78 * w) | 0})`;
        for (const [a, b] of [[0, 0], [T, 0], [0, T], [T, T]]) { x.beginPath(); x.arc(ox + a, oy + b, 13, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = `rgb(${(214 * w) | 0},${(204 * w) | 0},${(184 * w) | 0})`; x.beginPath(); x.arc(ox + T / 2, oy + T / 2, 9, 0, Math.PI * 2); x.fill();
        x.strokeStyle = 'rgba(40,36,30,0.55)'; x.lineWidth = 1.4; x.strokeRect(ox + 0.7, oy + 0.7, T - 1.4, T - 1.4);
      }
      for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(30,26,22,${0.05 + r() * 0.1})`; x.fillRect(r() * 256, r() * 256, 1 + r() * 3, 1 + r() * 2); }
      return c;
    }
    /* asphalt, with its patches */
    function wAsphalt(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = '#34363a'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 4200; i++) { const v = 30 + r() * 50; x.fillStyle = `rgba(${v},${v},${v + 4},${0.25 + r() * 0.3})`; x.fillRect(r() * 256, r() * 256, 1, 1); }
      return c;
    }
    /* clay roof tiles in courses, seen from below the eaves and from the crane */
    function wRoofTiles(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = '#5a2e22'; x.fillRect(0, 0, 256, 256);
      for (let j = 0; j < 16; j++) for (let i = 0; i < 12; i++) { const k = 0.8 + r() * 0.3, ox = (j % 2) * 10.7;
        x.fillStyle = `rgb(${(150 * k) | 0},${(74 * k) | 0},${(52 * k) | 0})`; x.fillRect(i * 21.3 + ox - 21.3, j * 16 + 1, 19, 13);
        x.fillStyle = `rgb(${(150 * k) | 0},${(74 * k) | 0},${(52 * k) | 0})`; x.fillRect(i * 21.3 + ox + 234, j * 16 + 1, 19, 13);
        x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(i * 21.3 + ox - 21.3, j * 16 + 12, 19, 2); }
      return c;
    }
    /* corrugated steel: a roller shutter, a coffee shop's back */
    function wCorrugate(base) {
      const [c, x] = wCanvas(64, 256);
      for (let j = 0; j < 256; j++) { const k = 0.72 + 0.28 * Math.sin(j / 256 * Math.PI * 2 * 16); const [R, G, Bl] = base;
        x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(0, j, 64, 1); }
      return c;
    }
    /* louvres: a timber shutter's slats, each lit along its top, dark in its gap */
    function wLouvre(base) {
      const [c, x] = wCanvas(64, 256), [R, G, Bl] = base;
      for (let j = 0; j < 256; j++) { const u = (j % 16) / 16, k = u < 0.12 ? 0.35 : 0.8 + 0.35 * (1 - u);
        x.fillStyle = `rgb(${Math.min(255, R * k) | 0},${Math.min(255, G * k) | 0},${Math.min(255, Bl * k) | 0})`; x.fillRect(0, j, 64, 1); }
      return c;
    }
    /* a carpet's weave and a quiet border pattern (the condominium's corridor) */
    function wCarpet(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = '#4a4e5a'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 6000; i++) { const v = r(); x.fillStyle = v < 0.5 ? 'rgba(30,32,40,0.3)' : 'rgba(110,114,126,0.22)'; x.fillRect(r() * 256, r() * 256, 1, 1); }
      x.strokeStyle = 'rgba(150,140,120,0.35)'; x.lineWidth = 3;
      for (let k = 0; k < 2; k++) { x.beginPath(); x.moveTo(0, 64 + k * 128); for (let u = 0; u <= 256; u += 32) x.lineTo(u, 64 + k * 128 + ((u / 32) % 2 ? -10 : 10)); x.stroke(); }
      return c;
    }
    /* a radial pool of light (a lamp's on a ceiling, a street lamp's on the road): drawn as a picture, never a light */
    const poolTex = (() => { const [c, x] = wCanvas(128, 128);
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    const glowTex = (() => { const [c, x] = wCanvas(64, 64);
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();

    /* her place's surfaces */
    const mBoards = M({ map: wPic(wBoards(51001, [124, 82, 52]), 2.4, 1.2), roughness: 0.62, emissive: 0x140c06 });
    const mHerWall = M({ map: wPic(wPaint('#e6dcc6', 51002), 1.4, 1.4), roughness: 0.94, emissive: 0x2a1e12 });
    const mHerCeil = M({ color: 0xeee6d8, roughness: 0.96, emissive: 0x2e2416 });
    const mSkirtTimber = M({ color: 0x4a3222, roughness: 0.6 });
    const mTimber = M({ color: 0x5a3a26, roughness: 0.58 });                        // her windows' frames and the half wall's cap
    const mTimberDark = M({ color: 0x3a2618, roughness: 0.6 });
    const mLouvre = M({ map: wPic(wLouvre([150, 104, 70]), 0.5, 0.55), roughness: 0.7 });
    const mTerrazzoGreen = M({ map: wPic(wTerrazzo(51003, '#8a8e84', ['#f0eee6', '#5a6058', '#c4c0b0', '#2e322e', '#a8b098']), 0.6, 0.6), roughness: 0.5 });
    const mStairGreen = M({ map: wPic(wPaint('#5f7e68', 51004, 140, 0.02), 1.2, 1.2), roughness: 0.6 });     // old green gloss to the dado
    const mStairWhite = M({ map: wPic(wPaint('#d8d6c8', 51005, 160, 0.025), 1.4, 1.4), roughness: 0.92 });
    const mKitchen = M({ color: 0xe8e4da, roughness: 0.45 });                        // her kitchenette's cabinet fronts
    const mWorktop = M({ map: wPic(wTerrazzo(51006, '#6a6660', ['#d8d4ca', '#3a3834', '#a09a90']), 0.5, 0.5), roughness: 0.35 });
    const mSteelSink = M({ color: 0xaab0b4, roughness: 0.3, metalness: 0.6 });
    /* the shophouse row's faces: plaster in the row's pastels, white mouldings, the five-foot way */
    const facade = (hex, seed) => M({ map: wPic(wPaint(hex, seed, 150, 0.03), 1.6, 1.6), roughness: 0.92 });
    const mFacades = [facade('#c8d8c0', 51010), facade('#e8d6b4', 51011), facade('#d8c0b8', 51012), facade('#c4ccd8', 51013), facade('#e6e0c8', 51014)];
    const mMoulding = M({ color: 0xece8dc, roughness: 0.85 });
    const mFiveFoot = M({ map: wPic(wEncaustic(51015), 0.6, 0.6), roughness: 0.6 });
    const mSoffit = M({ color: 0xcfcabb, roughness: 0.95 });
    const mAsphalt = M({ map: wPic(wAsphalt(51016), 3, 3), roughness: 0.92 });
    const mKerb = M({ color: 0x8a8a84, roughness: 0.9 });
    const mGrate = M({ map: wPic((() => { const [c, x] = wCanvas(64, 64); x.fillStyle = '#2a2c2e'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#0c0d0e'; for (let i = 0; i < 8; i++) x.fillRect(i * 8 + 2, 0, 4, 64); return c; })(), 0.25, 0.25), roughness: 0.7, metalness: 0.3 });
    const mRoof = M({ map: wPic(wRoofTiles(51017), 1.6, 1.2), roughness: 0.85 });
    const mShutter = M({ map: wPic(wCorrugate([150, 152, 150]), 0.5, 1.0), roughness: 0.55, metalness: 0.25 });
    const mShopFloor = M({ map: wPic(wTiles(256, 4, [176, 170, 160], '#6a6660', 51018, 0.08, 120), 1.2, 1.2), roughness: 0.55 });
    const mShopWall = M({ map: wPic(wPaint('#e8e6dc', 51019), 1.4, 1.4), roughness: 0.9, emissive: 0x161616 });
    const mLine = B({ color: 0xd8d2a0 });                                            // the road's painted lines
    const mYellow = B({ color: 0xb8902a });
    const mDarkRoom = B({ color: 0x1c1e24 });                                        // a room behind a window, in shadow (R108: nothing painted)
    const mLitRoom = B({ color: 0xa07a48 });                                         // a lit room behind closed louvres, the light only
    const mSign = (() => { const [c, x] = wCanvas(512, 96);
      x.fillStyle = '#7a1e18'; x.fillRect(0, 0, 512, 96); x.strokeStyle = '#d8b86a'; x.lineWidth = 4; x.strokeRect(6, 6, 500, 84);
      x.fillStyle = '#f0dca0'; x.font = 'bold 50px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('咖 啡 店   KOPI', 256, 50);
      const t = tex(done(THREE, c, false)); return M({ map: t, roughness: 0.8, emissive: 0x1a0a06 }); })();
    /* glass: her windows' panes, dark at night (what they reflect is built behind them: the reflection below); a shop's */
    const mPaneNight = M({ color: 0x0c1220, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.58, depthWrite: false, side: THREE.DoubleSide });
    const mPaneOut = M({ color: 0x1a2236, roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    /* his place's surfaces */
    const mPorcelain = M({ map: wPic(wTiles(512, 2, [196, 190, 180], '#8a847a', 51020, 0.05, 60), 1.2, 1.2), roughness: 0.38 });
    const mHisWall = M({ map: wPic(wPaint('#ecebe6', 51021), 1.4, 1.4), roughness: 0.93 });
    const mHisCeil = M({ color: 0xeeeeea, roughness: 0.96 });
    const mHisSkirt = M({ color: 0xd8d6d0, roughness: 0.6 });
    const mVeneer = M({ color: 0x6a4a34, roughness: 0.5 });
    const mGloss = M({ color: 0xf2f0ea, roughness: 0.25 });                          // his kitchen's fronts
    const mStoneTop = M({ color: 0x3a3a3c, roughness: 0.28 });
    const mAlu = M({ color: 0x9ea2a6, roughness: 0.4, metalness: 0.5 });
    const mGlassHis = M({ color: 0x9fb2c8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
    const mCarpet = M({ map: wPic(wCarpet(51022), 1.6, 1.6), roughness: 0.95 });
    const mCorrWall = M({ map: wPic(wPaint('#d8cdb8', 51023), 1.4, 1.4), roughness: 0.92, emissive: 0x161208 });
    const mBathTile = M({ map: wPic(wTiles(256, 4, [232, 232, 228], '#b8b8b0', 51024, 0.03), 0.6, 0.6), roughness: 0.25, emissive: 0x3a3a36 });
    const mSlab = M({ color: 0x9a9890, roughness: 0.9 });                              // his block's own concrete
    const mTower = [M({ color: 0x3c4048, roughness: 0.9 }), M({ color: 0x4a4a46, roughness: 0.9 }), M({ color: 0x34383e, roughness: 0.9 }), M({ color: 0x504c48, roughness: 0.9 })];
    const mGround = M({ color: 0x1c2024, roughness: 1.0 });
    const mRoadFar = M({ color: 0x24262a, roughness: 1.0 });
    const mDeck = M({ color: 0x8a8478, roughness: 0.9 });
    const mPool = B({ color: 0x3ad0d8 });                                            // the pool's water, lit from inside (painted)

    /* ---------------------------------------------- a wall's piece with its picture laid by the world's own metres on every
       face (chapter 5's boxW): `faces` 1 +z, 2 -z, 4 +x, 8 -x, 16 top, 32 bottom */
    function boxW(mat, cx, cy, cz, w, h, d, faces = 63) {
      const hw = w / 2, hh = h / 2, hd = d / 2, y0 = cy - hh, y1 = cy + hh;
      if (faces & 1) quad(mat, [cx - hw, y0, cz + hd], [cx + hw, y0, cz + hd], [cx + hw, y1, cz + hd], [cx - hw, y1, cz + hd], cx - hw, y0);
      if (faces & 2) quad(mat, [cx + hw, y0, cz - hd], [cx - hw, y0, cz - hd], [cx - hw, y1, cz - hd], [cx + hw, y1, cz - hd], -(cx + hw), y0);
      if (faces & 4) quad(mat, [cx + hw, y0, cz + hd], [cx + hw, y0, cz - hd], [cx + hw, y1, cz - hd], [cx + hw, y1, cz + hd], -(cz + hd), y0);
      if (faces & 8) quad(mat, [cx - hw, y0, cz - hd], [cx - hw, y0, cz + hd], [cx - hw, y1, cz + hd], [cx - hw, y1, cz - hd], cz - hd, y0);
      if (faces & 16) quad(mat, [cx - hw, y1, cz + hd], [cx + hw, y1, cz + hd], [cx + hw, y1, cz - hd], [cx - hw, y1, cz - hd], cx - hw, -(cz + hd));
      if (faces & 32) quad(mat, [cx - hw, y0, cz - hd], [cx + hw, y0, cz - hd], [cx + hw, y0, cz + hd], [cx - hw, y0, cz + hd], cx - hw, cz - hd);
    }
    /* A VERTICAL QUAD in the plane x = X (from z0 to z1, y0 to y1) facing +x (f 1) or -x (f -1), or in the plane z = Z
       (x0 to x1) facing +z or -z; its picture in metres (u along it, v up), or laid once whole (`once`); a CEILING quad
       facing down */
    function vquadX(mat, X, z0, z1, y0, y1, f, once = false) {
      const a = f > 0 ? [X, y0, z1] : [X, y0, z0], b = f > 0 ? [X, y0, z0] : [X, y0, z1], c = f > 0 ? [X, y1, z0] : [X, y1, z1], d = f > 0 ? [X, y1, z1] : [X, y1, z0];
      if (once) quadUV(mat, a, b, c, d); else quad(mat, a, b, c, d, f > 0 ? -z1 : z0, y0);
    }
    function vquadZ(mat, Z, x0, x1, y0, y1, f, once = false) {
      const a = f > 0 ? [x0, y0, Z] : [x1, y0, Z], b = f > 0 ? [x1, y0, Z] : [x0, y0, Z], c = f > 0 ? [x1, y1, Z] : [x0, y1, Z], d = f > 0 ? [x0, y1, Z] : [x1, y1, Z];
      if (once) quadUV(mat, a, b, c, d); else quad(mat, a, b, c, d, f > 0 ? x0 : -x1, y0);
    }
    const ceilQ = (mat, x0, z0, x1, z1, y) => quad(mat, [x0, y, z1], [x0, y, z0], [x1, y, z0], [x1, y, z1], z0, x0);
    /* a quad whose picture is laid on it once, whole (a sign, a clock's face): UVs 0..1 */
    function quadUV(mat, a, b, c, d) {
      const Bt = batchOf(mat); let nx = (b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), ny = (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1, P = [a, b, c, a, c, d], U = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx / nl, ny / nl, nz / nl); Bt.u.push(U[i][0], U[i][1]); }
    }
    /* A WALL along x (its middle at z = mid, `d` thick) or along z (at x = mid), from a0 to a1, y0 to y1, with openings
       [{ a0, a1, y0, y1 }] cut through it, each with its reveals; every piece solid where it stands on the floor he walks
       (v5.03). o: solid (true), sides (3: 1 the +z / +x face, 2 the -z / -x face), mat2 (the second side's paint),
       reveals (true) */
    function wallRun(mat, along, mid, d, a0, a1, y0, y1, opens = [], o = {}) {
      const solid = o.solid !== false, sides = o.sides || 3, mat2 = o.mat2 || mat, reveals = o.reveals !== false;
      const cuts = opens.slice().sort((p, q) => p.a0 - q.a0); let at = a0; const hd = d / 2;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        const c = (a + b) / 2, h = yb - ya, yc = (ya + yb) / 2;
        if (along === 'x') {
          if (sides & 1) boxW(mat, c, yc, mid, b - a, h, d, 1); if (sides & 2) boxW(mat2, c, yc, mid, b - a, h, d, 2); boxW(mat, c, yc, mid, b - a, h, d, 16 | 32);
          if (sol && solid) solidBox(b - a, Math.max(1.2, h), d, c, Math.max(0.6, yc), mid); }
        else {
          if (sides & 1) boxW(mat, mid, yc, c, d, h, b - a, 4); if (sides & 2) boxW(mat2, mid, yc, c, d, h, b - a, 8); boxW(mat, mid, yc, c, d, h, b - a, 16 | 32);
          if (sol && solid) solidBox(d, Math.max(1.2, h), b - a, mid, Math.max(0.6, yc), c); } };
      /* a reveal faces into its opening: +along at the opening's low end, -along at its high end */
      const reveal = (a, ya, yb, f) => { if (!reveals || yb - ya < 0.005) return;
        if (along === 'x') vquadX(mat, a, mid - hd, mid + hd, ya, yb, f); else vquadZ(mat, a, mid - hd, mid + hd, ya, yb, f); };
      for (const op of cuts) {
        piece(at, op.a0, y0, y1, true); piece(op.a0, op.a1, y0, op.y0, op.y0 > 0.3); piece(op.a0, op.a1, op.y1, y1, false);
        const ya = Math.max(y0, op.y0), yb = Math.min(y1, op.y1); reveal(op.a0, ya, yb, 1); reveal(op.a1, ya, yb, -1);
        at = op.a1; }
      piece(at, a1, y0, y1, true);
    }
    /* a flat card of painted light lying on a surface or standing in the air (never a light: v9.4) */
    const pools = [];
    function pool(x, y, z, w, h, color, opacity, o = {}) {
      const m = new THREE.MeshBasicMaterial({ map: o.map || poolTex, color, transparent: true, opacity, depthWrite: false, blending: o.add === false ? THREE.NormalBlending : THREE.AdditiveBlending, fog: o.fog !== false });
      if (ONEPASS) m.forceSinglePass = true; mats.push(m);
      const q = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); owned.push(q.geometry);
      q.position.set(x, y, z);
      if (o.rx != null) q.rotation.x = o.rx; else q.rotation.x = -Math.PI / 2;
      if (o.ry != null) q.rotation.y = o.ry; if (o.rz != null) q.rotation.z = o.rz;
      q.renderOrder = 2; (o.parent || world).add(q);
      const rec = { q, m, o0: opacity, look: o.look || null }; pools.push(rec); return rec;
    }
    /* a glow round a bulb or a flame, always facing the lens */
    function glow(x, y, z, s, color, opacity, parent = world, look = null) {
      const m = new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
      mats.push(m); const sp = new THREE.Sprite(m); sp.position.set(x, y, z); sp.scale.set(s, s, 1); parent.add(sp);
      const rec = { q: sp, m, o0: opacity, look }; pools.push(rec); return rec;
    }

    /* ---------------------------------------------- the groups: what the reflection copies (her flat's fabric and its
       things), what it must not (her front wall, which IS the mirror's plane), and each place's own */
    const herFlatG = new THREE.Group(); herFlatG.name = 'her flat'; world.add(herFlatG);
    const herThingsG = new THREE.Group(); herThingsG.name = 'her things'; world.add(herThingsG);
    const frontWallG = new THREE.Group(); frontWallG.name = 'her front wall'; world.add(frontWallG);
    const streetG = new THREE.Group(); streetG.name = 'the shophouse row'; world.add(streetG);
    const hisG = new THREE.Group(); hisG.name = 'his flat'; world.add(hisG);
    const cityG = new THREE.Group(); cityG.name = 'his city'; world.add(cityG);

    /* ================================================================ HER FLAT (the plan's 5.3) */
    const FLOOR_T = 0.3;                                   // her floor slab (the five-foot way's ceiling under it at -0.3)
    {
      const F = FRONT, H = F.ceil;
      /* the floors: old timber boards through the front room and the back room, terrazzo on the landing */
      floor(mBoards, F.x0 - 0.15, F.z0, F.x1, F.z1, 0);
      floor(mBoards, BACKR.x0, BACKR.z0, BACKR.x1 + 0.15, BACKR.z1, 0);
      floor(mTerrazzoGreen, LOBBY.x0, LOBBY.z0, LOBBY.x1, LOBBY.z1, 0);
      floor(mTerrazzoGreen, STAIR.top, STAIR.z0, STAIR.x0, STAIR.z1, 0);
      floor(mTerrazzoGreen, LOBBY.x0, STAIR.z1, STAIR.x0, LOBBY.z0, 0);                    // the landing's step through the party wall
      /* the ceilings (seen from inside) */
      ceilQ(mHerCeil, F.x0 - 0.15, F.z0, F.x1, F.z1, H);
      ceilQ(mHerCeil, BACKR.x0, BACKR.z0, BACKR.x1 + 0.15, BACKR.z1, H);
      ceilQ(mStairWhite, LOBBY.x0, STAIR.z1, LOBBY.x1, LOBBY.z1, H);
      /* her side walls (party walls: plain, their insides painted) */
      wallRun(mHerWall, 'x', F.z1 + 0.075, 0.15, BACKR.x0 - 0.15, F.x1, 0, H, [], { sides: 2 });          // +z (shared with the next unit)
      wallRun(mHerWall, 'x', F.z0 - 0.075, 0.15, LOBBY.x1, F.x1, 0, H, [], { sides: 3, mat2: mStairWhite });                  // -z (the stair bay beyond)
      /* THE BACK WALL of the front room (x -2.75..-2.9): her front door (z -2.85..-1.9), then the half wall (z -1.6..1.9,
         1.05 high, a timber cap), then the way through to the back room (z 1.9..3.0) */
      wallRun(mHerWall, 'z', F.x0 - 0.075, 0.15, F.z0, -1.6, 0, H, [{ a0: -2.85, a1: -1.9, y0: 0, y1: 2.12 }], { sides: 3, mat2: mStairWhite });
      wallRun(mHerWall, 'z', F.x0 - 0.075, 0.15, -1.6, 1.4, 0, 1.05, []);
      boxW(mTimber, F.x0 - 0.075, 1.07, -0.1, 0.22, 0.04, 3.0);
      wallRun(mHerWall, 'z', F.x0 - 0.075, 0.15, -1.6, 3.0, 2.55, H, [], { solid: false });                    // the bulkhead over the half wall and the way through
      /* the back room's walls: the back (x -5.6, the bedroom door at z -1.3..-0.36), its -z wall to the lobby and the
         bedroom beyond */
      wallRun(mHerWall, 'z', BACKR.x0 - 0.075, 0.15, BACKR.z0 - 0.15, BACKR.z1 + 0.15, 0, H, [{ a0: -1.3, a1: -0.36, y0: 0, y1: 2.12 }], { sides: 1 });
      wallRun(mHerWall, 'x', BACKR.z0 - 0.075, 0.15, BACKR.x0, BACKR.x1 + 0.15, 0, H, [], { sides: 3, mat2: mStairWhite });
      /* the lobby: its far end (x -4.1) and its wall to the stair bay (z -3.0..-3.15), open where the stair arrives */
      wallRun(mStairWhite, 'z', LOBBY.x0 - 0.075, 0.15, STAIR.z0 - 0.15, BACKR.z0 - 0.15, 0, H, [], { sides: 1 });
      wallRun(mStairWhite, 'x', F.z0 - 0.075, 0.15, STAIR.x0, LOBBY.x1, 0, H, []);
      /* the dado: the lobby's and the stair's old green gloss to 1.2 m, the white above (a band laid over the plain wall) */
      boxW(mStairGreen, LOBBY.x0 + 0.002, 0.6, (LOBBY.z0 + LOBBY.z1) / 2 - 0.6, 0.004, 1.2, LOBBY.z1 - LOBBY.z0 + 1.2, 4);
      boxW(mStairGreen, (LOBBY.x0 + LOBBY.x1) / 2, 0.6, BACKR.z0 - 0.152, LOBBY.x1 - LOBBY.x0, 1.2, 0.004, 2);
      boxW(mStairGreen, F.x0 - 0.152, 0.6, (LOBBY.z0 + LOBBY.z1) / 2, 0.004, 1.2, LOBBY.z1 - LOBBY.z0, 8);
      /* the skirting round the front room and the back room */
      boxW(mSkirtTimber, (F.x0 + F.x1) / 2, 0.05, F.z1 - 0.006, F.x1 - F.x0, 0.1, 0.012, 2);
      boxW(mSkirtTimber, (F.x0 + F.x1) / 2, 0.05, F.z0 + 0.006, F.x1 - F.x0, 0.1, 0.012, 1);
      /* her kitchenette along the back room's +z wall: base cabinets, a terrazzo worktop with a steel sink and a two-ring
         hob (the cabinet doors' lines drawn as their own thin pieces), wall cabinets over it */
      const KX0 = -4.8, KX1 = -3.3;
      boxW(mKitchen, (KX0 + KX1) / 2, 0.43, BACKR.z1 - 0.3, KX1 - KX0, 0.86, 0.58, 1 | 4 | 8);
      boxW(mWorktop, (KX0 + KX1) / 2, 0.88, BACKR.z1 - 0.31, KX1 - KX0 + 0.04, 0.04, 0.62, 63);
      for (let x = KX0 + 0.46; x < KX1 - 0.1; x += 0.46) boxW(mTimberDark, x, 0.43, BACKR.z1 - 0.008 - 0.58, 0.008, 0.8, 0.006, 1);
      boxW(mSteelSink, -3.75, 0.895, BACKR.z1 - 0.32, 0.6, 0.012, 0.42, 16);
      boxW(mKitchen, (KX0 + KX1) / 2, 1.85, BACKR.z1 - 0.18, KX1 - KX0, 0.7, 0.34, 1 | 4 | 8 | 32);
      solidXZ(KX0 - 0.05, BACKR.z1 - 0.62, KX1 + 0.02, BACKR.z1, 1.4);
      flush(herFlatG);
    }
    /* HER FRONT WALL: the façade's inside, its two tall timber windows (casements of glass, a fanlight over each) and their
       louvred shutters inside them; drawn apart from the rest (the reflection is built behind its glass, so a copy of it
       would lie on its own face). The shutters are the reflection's measure: the one nearest him, half closed, keeps the
       glass from ever having to show him, Grandmaster Pho, the cloth's candles or the lamp (the plan's 12) */
    const WIN = { A: { z0: -2.2, z1: -0.6 }, B: { z0: 0.6, z1: 2.2 }, sill: 0.42, head: 2.95, fan: 0.45 };
    const shutterLeaves = [];
    {
      const X = FRONT.x1, H = FRONT.ceil, T = 0.25;
      const opens = [WIN.A, WIN.B].map(w => ({ a0: w.z0, a1: w.z1, y0: WIN.sill, y1: WIN.head }));
      /* the wall, its inside painted, its outside the row's plaster (the façade is built in the street below) */
      wallRun(mHerWall, 'z', X + T / 2, T, FRONT.z0 - 0.15, FRONT.z1 + 0.15, 0, H, opens, { sides: 2 });
      for (const w of [WIN.A, WIN.B]) {
        const zm = (w.z0 + w.z1) / 2, fw = w.z1 - w.z0, fr = 0.06, xm = X + 0.12;
        /* the frame, the casements' meeting stile, the transom under the fanlight, and a sill board inside */
        boxW(mTimber, xm, WIN.sill + fr / 2, zm, 0.1, fr, fw, 63); boxW(mTimber, xm, WIN.head - fr / 2, zm, 0.1, fr, fw, 63);
        boxW(mTimber, xm, (WIN.sill + WIN.head) / 2, w.z0 + fr / 2, 0.1, WIN.head - WIN.sill, fr, 63); boxW(mTimber, xm, (WIN.sill + WIN.head) / 2, w.z1 - fr / 2, 0.1, WIN.head - WIN.sill, fr, 63);
        boxW(mTimber, xm, (WIN.sill + WIN.head - WIN.fan) / 2 + 0.0, zm, 0.09, WIN.head - WIN.fan - WIN.sill, 0.05, 63);
        boxW(mTimber, xm, WIN.head - WIN.fan, zm, 0.1, 0.06, fw, 63);
        boxW(mTimber, X - 0.03, WIN.sill - 0.02, zm, 0.1, 0.04, fw + 0.1, 63);
        /* the panes: the casements' glass (night: dark, the reflection behind), the fanlight's */
        quad(mPaneNight, [xm - 0.01, WIN.sill + fr, w.z1 - fr], [xm - 0.01, WIN.sill + fr, w.z0 + fr], [xm - 0.01, WIN.head - fr, w.z0 + fr], [xm - 0.01, WIN.head - fr, w.z1 - fr]);
        solidBox(0.12, 2.4, fw, xm, 1.2, zm);
      }
      flush(frontWallG);
      /* THE SHUTTERS: four louvred timber leaves (each 0.8 wide, hinged at the window's sides, folding into the room).
         A's two stand open (its -z leaf against the corner wall, its +z one at 75 degrees); B's -z leaf against the pier;
         B's +z leaf HALF CLOSED at 48 degrees: from where he kneels it covers B from z 1.4 to its end, so his reflection
         (it would fall at z 1.9 on the glass), Grandmaster Pho's (1.75..2.05) and the cloth's (1.5..1.7) are behind it,
         and the open glass from 0.6 to 1.4 holds the door corner, Marcus and Grace on the sofa (WORLD.md, the measure) */
      const leaf = (hz, sign, deg, name) => {
        const piv = new THREE.Group(); piv.position.set(X - 0.035, 0, hz); piv.name = 'shutter ' + name; frontWallG.add(piv);
        const g = new THREE.Group(); piv.add(g);
        const L = 0.8, h0 = WIN.sill + 0.02, h1 = WIN.head - WIN.fan - 0.02;
        const fr = new THREE.Mesh(new THREE.BoxGeometry(0.03, h1 - h0, L), mTimber); fr.position.set(-0.015, (h0 + h1) / 2, sign * L / 2); g.add(fr); owned.push(fr.geometry);
        const sl = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.08, h1 - h0 - 0.12), mLouvre); sl.rotation.y = -Math.PI / 2; sl.position.set(-0.032, (h0 + h1) / 2, sign * L / 2); g.add(sl); owned.push(sl.geometry);
        const sl2 = sl.clone(); sl2.rotation.y = Math.PI / 2; sl2.position.x = 0.002; g.add(sl2);
        piv.rotation.y = sign * deg * Math.PI / 180;
        shutterLeaves.push({ name, piv, sign, deg });
        return piv;
      };
      leaf(WIN.A.z0, 1, 172, 'A-');  leaf(WIN.A.z1, -1, 75, 'A+');
      leaf(WIN.B.z0, 1, 172, 'B-');  leaf(WIN.B.z1, -1, 48, 'B+');
    }

    /* ================================================================ THE STAIR AND THE LANDING (the plan's 5.2): a narrow
       straight terrazzo stair from the street door up to her landing, one fluorescent tube, old green paint */
    const STAIR_RISE = -GY / STAIR.risers, STAIR_RUN = 0.235, F_Z0 = FRONT.z0;
    {
      const Z0 = STAIR.z0, Z1 = STAIR.z1;
      for (let i = 1; i < STAIR.risers; i++) {
        const xa = STAIR.x1 - (i - 1) * STAIR_RUN, xb = STAIR.x1 - i * STAIR_RUN, y = GY + i * STAIR_RISE;
        boxW(mTerrazzoGreen, (xa + xb) / 2 - 0.01, y - 0.02, (Z0 + Z1) / 2, STAIR_RUN + 0.02, 0.04, Z1 - Z0, 16);
        quad(mTerrazzoGreen, [xa, y - STAIR_RISE, Z1], [xa, y - STAIR_RISE, Z0], [xa, y, Z0], [xa, y, Z1], Z0, y - STAIR_RISE);   // the riser (faces +x, down the stair)
        boxW(mTerrazzoGreen, (xa + xb) / 2, y - 0.04, Z1 - 0.002, STAIR_RUN, 0.08, 0.004, 2);
      }
      quad(mTerrazzoGreen, [STAIR.x0, -STAIR_RISE, Z1], [STAIR.x0, -STAIR_RISE, Z0], [STAIR.x0, 0, Z0], [STAIR.x0, 0, Z1]);
      /* the underside of the flight (seen from the street door) */
      quad(mStairWhite, [STAIR.x1, GY, Z0], [STAIR.x1, GY, Z1], [STAIR.x0, -0.25, Z1], [STAIR.x0, -0.25, Z0]);
      /* the bay's two walls, green to the dado and white above, from the street's level to her ceiling */
      wallRun(mStairWhite, 'x', Z0 - 0.075, 0.15, STAIR.top - 0.15, STREET.shop, GY, FRONT.ceil, [], { solid: false, sides: 1 });
      wallRun(mStairWhite, 'x', Z0 - 0.075, 0.15, STREET.shop, FRONT.x1, -0.3, FRONT.ceil, [], { solid: false, sides: 1 });   // (over the five-foot way, the bay's upper floor only)
      floor(mTerrazzoGreen, STAIR.x0 - 0.1, Z0 - 0.15, STREET.shop, F_Z0, GY);                    // the bay's ground: the entry and under the flight
      wallRun(mStairWhite, 'x', Z1 + 0.075, 0.15, STAIR.x0, STREET.shop, GY, 0, [], { solid: false, sides: 2 });
      for (let i = 0; i < 4; i++) { const xa = STREET.shop - i * 1.1, xb = Math.max(STAIR.x0 - 0.8, xa - 1.1), ya = GY + Math.max(0, (STAIR.x1 - xa) / STAIR_RUN) * STAIR_RISE, yb = GY + Math.max(0, (STAIR.x1 - xb) / STAIR_RUN) * STAIR_RISE;
        quad(mStairGreen, [xb, yb, Z0 + 0.003], [xa, ya, Z0 + 0.003], [xa, ya + 1.2, Z0 + 0.003], [xb, yb + 1.2, Z0 + 0.003]);   // (faces +z: into the bay)
        quad(mStairGreen, [xa, ya, Z1 - 0.003], [xb, yb, Z1 - 0.003], [xb, yb + 1.2, Z1 - 0.003], [xa, ya + 1.2, Z1 - 0.003]); }
      boxW(mStairGreen, STAIR.top + 0.003, 0.6, (Z0 + Z1) / 2, 0.006, 1.2, Z1 - Z0, 4);

      /* the stairwell's front over the shop front's line: a wall with a small window onto the street, and the slab over the
         flight's foot (the five-foot way's ceiling beyond it) */
      wallRun(mStairWhite, 'z', FRONT.x1 + 0.125, 0.25, Z0 - 0.15, Z1, 0, FRONT.ceil, [{ a0: Z0 + 0.25, a1: Z1 - 0.25, y0: 0.9, y1: 2.3 }], { solid: false, sides: 2 });
      quad(mPaneOut, [FRONT.x1 + 0.12, 0.9, Z0 + 0.25], [FRONT.x1 + 0.12, 0.9, Z1 - 0.25], [FRONT.x1 + 0.12, 2.3, Z1 - 0.25], [FRONT.x1 + 0.12, 2.3, Z0 + 0.25]);
      floor(mTerrazzoGreen, STREET.shop, Z0, FRONT.x1, Z1, 0);                                  // the bay's floor over the five-foot way, behind its window
      vquadX(mStairWhite, STREET.shop, Z0, Z1, -0.3, 0, 1);                                        // the slab's edge over the flight's foot
      ceilQ(mStairWhite, STAIR.top, Z0, FRONT.x1, Z1, FRONT.ceil);
      /* the street door's frame in the shop front's line (its leaf is a model: below) */
      boxW(mTimberDark, STREET.shop, GY + 1.07, STAIR.z0 + 0.03, 0.14, 2.14, 0.06); boxW(mTimberDark, STREET.shop, GY + 1.07, STAIR.z1 - 0.03, 0.14, 2.14, 0.06);
      boxW(mTimberDark, STREET.shop, GY + 2.17, (Z0 + Z1) / 2, 0.14, 0.08, Z1 - Z0);
      boxW(mStairWhite, STREET.shop, (GY + 2.21 - 0.3) / 2, (Z0 + Z1) / 2, 0.15, -0.3 - (GY + 2.21), Z1 - Z0, 1 | 2 | 4 | 8 | 32);
      /* her door's frame on the landing side */
      boxW(mTimberDark, FRONT.x0 - 0.16, 1.06, -2.88, 0.04, 2.14, 0.06); boxW(mTimberDark, FRONT.x0 - 0.16, 1.06, -1.87, 0.04, 2.14, 0.06);
      boxW(mTimberDark, FRONT.x0 - 0.16, 2.15, -2.375, 0.04, 0.06, 1.07);
      boxW(mTimberDark, FRONT.x0 + 0.005, 1.06, -2.88, 0.02, 2.14, 0.06); boxW(mTimberDark, FRONT.x0 + 0.005, 1.06, -1.87, 0.02, 2.14, 0.06);
      boxW(mTimberDark, FRONT.x0 + 0.005, 2.15, -2.375, 0.02, 0.06, 1.07);
      flush(herFlatG);
    }

    /* ================================================================ THE SHOPHOUSE ROW AND ITS STREET AT BLUE HOUR (the
       plan's 5.1): built deep enough for the opening's one crane shot (9.1: from 7 m up and 6 m out down to the five-foot
       way at Marcus). Generic signs only (v9.3); every window real: glass, a frame, and behind it either closed louvres
       or a plain dark room (R108) */
    const UNIT = 6.0;                                                    // a unit's frontage up and down the row
    const UNITS = [];                                                    // [{ z0, z1, her }] her unit -4.45..3.15
    { let z = -4.45; while (z > -40) { UNITS.unshift({ z0: z - UNIT, z1: z }); z -= UNIT; }
      UNITS.push({ z0: -4.45, z1: 3.15, her: true });
      z = 3.15; while (z < 40) { UNITS.push({ z0: z, z1: z + UNIT }); z += UNIT; } }
    const SIDE = { near: { face: STREET.face, n: 1, shop: STREET.shop, back: -12 }, far: { face: STREET.across, n: -1, shop: STREET.across + 1.85, back: 24 } };
    const UP_TOP = FRONT.ceil + 0.5;                                     // the façade's cornice over the upper floor
    {
      const rr = rng(51040);
      /* THE ROAD: asphalt between the kerbs, its lines (a broken centre line, double yellow kerb lines: no stopping) */
      floor(mAsphalt, STREET.kerb, -40, STREET.across - 0.55, 40, GY - 0.15);
      for (let z = -40; z < 40; z += 6) boxW(mLine, (STREET.road[0] + STREET.road[1]) / 2, GY - 0.148, z + 1.5, 0.12, 0.004, 3.0, 16);
      for (const xo of [0.25, 0.4]) { boxW(mYellow, STREET.kerb + xo, GY - 0.148, 0, 0.08, 0.004, 80, 16); boxW(mYellow, STREET.road[1] - xo, GY - 0.148, 0, 0.08, 0.004, 80, 16); }
      for (const S0 of [SIDE.near, SIDE.far]) {
        const n = S0.n, F0 = S0.face;
        /* the drain and the kerb in front of the five-foot way (a grating over the drain), the five-foot way, its soffit */
        const kx0 = n > 0 ? F0 : STREET.road[1], kx1 = n > 0 ? STREET.kerb : F0;
        floor(mGrate, kx0, -40, kx1, 40, GY - 0.03);
        vquadX(mKerb, n > 0 ? kx1 : kx0, -40, 40, GY - 0.15, GY - 0.03, n);
        const fx0 = n > 0 ? S0.shop : F0, fx1 = n > 0 ? F0 : S0.shop;
        floor(mFiveFoot, fx0, -40, fx1, 40, GY);
        ceilQ(mSoffit, fx0, -40, fx1, 40, -0.3);
        for (const U of UNITS) {
          const mat = U.her && n > 0 ? mFacades[0] : mFacades[(rr() * mFacades.length) | 0];
          const zc = (U.z0 + U.z1) / 2, wz = U.z1 - U.z0;
          /* the pillar at each unit's end, from the five-foot way up to the cornice */
          const px = F0 - n * 0.225;
          boxW(mat, px, (GY + UP_TOP) / 2, U.z0, 0.45, UP_TOP - GY, 0.5, n > 0 ? (4 | 1 | 2) : (8 | 1 | 2));
          /* the upper façade (its outside), with its windows' openings; the cornice and a string course */
          if (!(U.her && n > 0)) {
            const wins = [{ a0: zc - wz * 0.36, a1: zc - wz * 0.1 }, { a0: zc + wz * 0.1, a1: zc + wz * 0.36 }];
            const opens = wins.map(w => ({ a0: w.a0, a1: w.a1, y0: WIN.sill, y1: WIN.head }));
            const xmid = F0 - n * 0.125;
            /* the face toward the street only (the inside of a neighbour's room is never seen) */
            wallRun(mat, 'z', xmid, 0.25, U.z0 + 0.25, U.z1 - 0.25, -0.3, UP_TOP, opens, { solid: false, sides: n > 0 ? 1 : 2 });
            for (const w of wins) {
              const zm = (w.a0 + w.a1) / 2, ww = w.a1 - w.a0, inX = F0 - n * 0.2, kind = rr();
              vquadX(mPaneOut, inX, w.a0, w.a1, WIN.sill, WIN.head, n);
              const backX = F0 - n * (kind < 0.55 ? 0.24 : 0.55);
              const m2 = kind < 0.55 ? (kind < 0.12 ? mLitRoom : mLouvre) : mDarkRoom;
              vquadX(m2, backX, w.a0, w.a1, WIN.sill, WIN.head, n);
              boxW(mMoulding, F0 + n * 0.03, WIN.sill - 0.05, zm, 0.06, 0.1, ww + 0.2, 63);
              boxW(mMoulding, F0 + n * 0.03, WIN.head + 0.08, zm, 0.06, 0.16, ww + 0.2, 63);
            }
          }
          boxW(mMoulding, F0 + n * 0.08, UP_TOP - 0.2, zc, 0.22, 0.4, wz, 63);
          boxW(mMoulding, F0 + n * 0.04, -0.15, zc, 0.12, 0.3, wz, 63);
          /* the shop front under it: a roller shutter down (closed for the night), its box over it; her coffee shop has its
             own front, below */
          if (!(U.her && n > 0)) {
            const sx = S0.shop, a = U.z0 + 0.25, b = U.z1 - 0.25;
            vquadX(mShutter, sx, a, b, GY, -0.55, n);
            boxW(mFacades[(rr() * 5) | 0], sx + n * 0.12, -0.42, zc, 0.24, 0.26, wz - 0.5, 63);
            vquadX(mat, sx, a, b, -0.55, -0.3, n);
          }
        }
        /* the roof: clay tiles from the cornice back to the ridge, a parapet's top */
        const rx0 = F0 - n * 0.3, rx1 = F0 - n * 6.5, ridge = UP_TOP + 2.6;
        quad(mRoof, [rx0, UP_TOP - 0.05, n > 0 ? 40 : -40], [rx0, UP_TOP - 0.05, n > 0 ? -40 : 40], [rx1, ridge, n > 0 ? -40 : 40], [rx1, ridge, n > 0 ? 40 : -40]);
        quad(mRoof, [rx1, ridge, n > 0 ? 40 : -40], [rx1, ridge, n > 0 ? -40 : 40], [F0 - n * 13, UP_TOP - 0.6, n > 0 ? -40 : 40], [F0 - n * 13, UP_TOP - 0.6, n > 0 ? 40 : -40]);
      }
      /* HER UNIT'S UPPER FAÇADE, outside: its plaster round her two windows (their frames and panes are her front wall's,
         above), the stair bay's small window, the mouldings */
      {
        const F0 = STREET.face, mat = mFacades[0];
        wallRun(mat, 'z', F0 - 0.01, 0.02, -4.2, 2.9, -0.3, UP_TOP, [WIN.A, WIN.B].map(w => ({ a0: w.z0, a1: w.z1, y0: WIN.sill, y1: WIN.head })).concat([{ a0: STAIR.z0 + 0.25, a1: STAIR.z1 - 0.25, y0: 0.9, y1: 2.3 }]), { solid: false, sides: 1, reveals: false });
        for (const w of [WIN.A, WIN.B, { z0: STAIR.z0 + 0.25, z1: STAIR.z1 - 0.25 }]) {
          const zm = (w.z0 + w.z1) / 2, ww = w.z1 - w.z0, top = w === WIN.A || w === WIN.B ? WIN.head : 2.3, bot = w === WIN.A || w === WIN.B ? WIN.sill : 0.9;
          boxW(mMoulding, F0 + 0.03, bot - 0.05, zm, 0.06, 0.1, ww + 0.2, 63);
          boxW(mMoulding, F0 + 0.03, top + 0.08, zm, 0.06, 0.16, ww + 0.2, 63);
        }
        /* the stair bay's window from outside: a dark stairwell behind it (lit by the tube when it is on: painted) */
        /* (the bay behind it is built: its floor, its walls, its ceiling, the tube's light on them) */
      }
      /* THE COFFEE SHOP BELOW HER (x -4.0..1.15, z -3.0..3.0), CLOSING: its roller shutter half down, the floor tiles, a
         plain counter at the back, its walls; its chairs stacked for the night and its tube light (models, below); the sign
         over the five-foot way */
      {
        const X0 = -4.0, X1 = STREET.shop, Z0 = -3.0, Z1 = 3.0, Y = GY;
        floor(mShopFloor, X0, Z0, X1, Z1, Y);
        ceilQ(mShopWall, X0, Z0, X1, Z1, -0.3);
        wallRun(mShopWall, 'z', X0 - 0.075, 0.15, Z0, Z1, Y, -0.3, [], { solid: false, sides: 1 });
        wallRun(mShopWall, 'x', Z0 - 0.075, 0.15, X0, X1, Y, -0.3, [], { solid: false, sides: 1 });
        wallRun(mShopWall, 'x', Z1 + 0.075, 0.15, X0, X1, Y, -0.3, [], { solid: false, sides: 2 });
        boxW(mKitchen, X0 + 0.45, Y + 0.5, 0.2, 0.6, 1.0, 3.6, 63);                       // the drinks counter
        boxW(mWorktop, X0 + 0.45, Y + 1.02, 0.2, 0.66, 0.04, 3.66, 63);
        /* the roller shutter: half down over the open front, its box */
        vquadX(mShutter, X1 + 0.02, Z0 + 0.1, Z1 - 0.1, Y + 1.55, -0.55, 1);
        boxW(mShutter, X1 + 0.02, Y + 1.53, 0, 0.05, 0.05, Z1 - Z0 - 0.2, 63);
        boxW(mFacades[0], X1 + 0.14, -0.42, 0, 0.24, 0.26, Z1 - Z0, 63);
        boxW(mMoulding, STREET.face + 0.11, 0.0, 0, 0.2, 0.62, Z1 - Z0 - 0.56, 2 | 1 | 16 | 32);   // the signboard over the five-foot way, its edges
        vquadX(mSign, STREET.face + 0.212, Z0 + 0.3, Z1 - 0.3, -0.3, 0.3, 1, true);
      }
      /* the blocks that close the street's two ends (a cross street's corner), their windows real */
      for (const zE of [-44, 44]) { const f = zE < 0 ? 1 : -1, mat = mFacades[zE < 0 ? 3 : 1];
        boxW(mat, 8.6, GY + 7.5, zE - f * 4, 30, 15, 8, 63);
        for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) { const x0 = -5.5 + i * 4.2, y0 = GY + 4.2 + j * 3.4;
          vquadZ(rr() < 0.25 ? mLitRoom : mDarkRoom, zE + f * 0.02, x0, x0 + 1.6, y0, y0 + 1.9, f);
          boxW(mMoulding, x0 + 0.8, y0 - 0.06, zE + f * 0.05, 1.8, 0.1, 0.1, 63); } }
      flush(streetG);
    }

    /* ================================================================ HIS HOME (the plan's 5.4): a high-floor condominium
       flat at night and at dawn. New on purpose: episode 3 chapter 5's night was his HDB bedroom, and this must not look
       like it */
    {
      const H = FLAT.ceil;
      /* the floors: large porcelain tiles through the flat, the bathroom's own tiles, the corridor's carpet, the balcony */
      floor(mPorcelain, LIV.x0, LIV.z0, LIV.x1, LIV.z1, 0);
      floor(mPorcelain, PASS.x0, PASS.z0, PASS.x1, PASS.z1, 0);
      floor(mPorcelain, BED.x0, BED.z0, BED.x1, BED.z1, 0);
      floor(mBathTile, BATH.x0, BATH.z0, BATH.x1, BATH.z1, 0);
      floor(mCarpet, CORR.x0, CORR.z0, CORR.x1, CORR.z1, 0);
      floor(mPorcelain, BALC.x0, BALC.z0, BALC.x1, BALC.z1, -0.05);
      /* the ceilings */
      for (const R of [LIV, PASS, BED]) ceilQ(mHisCeil, R.x0, R.z0, R.x1, R.z1, H);
      ceilQ(mBathTile, BATH.x0, BATH.z0, BATH.x1, BATH.z1, 2.4);
      ceilQ(mCorrWall, CORR.x0, CORR.z0, CORR.x1, CORR.z1, 2.6);
      ceilQ(mSlab, BALC.x0, BALC.z0, BALC.x1, BALC.z1, H);
      /* THE LIVING ROOM'S WALLS: -x (the altar's), -z with his front door (x -4.2..-3.4) and the kitchen along it, +x with
         the passage's opening (z 0.2..1.8); the glass on +z is below */
      wallRun(mHisWall, 'z', LIV.x0 - 0.075, 0.15, LIV.z0 - 0.15, LIV.z1, 0, H, [], { sides: 1 });
      wallRun(mHisWall, 'x', LIV.z0 - 0.075, 0.15, LIV.x0 - 0.15, LIV.x1 + 0.15, 0, H, [{ a0: HX - 4.2, a1: HX - 3.4, y0: 0, y1: 2.12 }], { sides: 3, mat2: mCorrWall });
      wallRun(mHisWall, 'z', LIV.x1 + 0.075, 0.15, LIV.z0 - 0.15, LIV.z1, 0, H, [{ a0: PASS.z0, a1: PASS.z1, y0: 0, y1: 2.3 }], { sides: 2 });
      /* the passage's walls, the bedroom's: -x with its door (z 0.75..1.65), -z to the bathroom (its door x 5.1..5.8,
         open on the light), +x the bed's wall */
      wallRun(mHisWall, 'x', PASS.z0 - 0.075, 0.15, PASS.x0, PASS.x1, 0, H, [], { sides: 1 });
      wallRun(mHisWall, 'x', PASS.z1 + 0.075, 0.15, PASS.x0, PASS.x1, 0, H, [], { sides: 2 });
      wallRun(mHisWall, 'z', BED.x0 - 0.075, 0.15, BED.z0 - 0.15, BED.z1, 0, H, [{ a0: 0.75, a1: 1.65, y0: 0, y1: 2.12 }], { sides: 3 });
      wallRun(mHisWall, 'x', BED.z0 - 0.075, 0.15, BED.x0 - 0.15, BED.x1 + 0.15, 0, H, [{ a0: HX + 5.1, a1: HX + 5.8, y0: 0, y1: 2.12 }], { sides: 3, mat2: mBathTile });
      wallRun(mHisWall, 'z', BED.x1 + 0.075, 0.15, BED.z0 - 0.15, BED.z1, 0, H, [], { sides: 2 });
      wallRun(mBathTile, 'z', BATH.x0 - 0.075, 0.15, BATH.z0, BATH.z1, 0, H, [], { sides: 1 });
      wallRun(mBathTile, 'z', BATH.x1 + 0.075, 0.15, BATH.z0, BATH.z1, 0, H, [], { sides: 2 });
      wallRun(mBathTile, 'x', BATH.z0 - 0.075, 0.15, BATH.x0, BATH.x1, 0, H, [], { sides: 1 });
      boxW(mGlassHis, HX + 5.0, 1.0, BATH.z0 + 0.55, 0.01, 2.0, 1.1, 4 | 8);              // the shower's glass
      /* the skirting */
      boxW(mHisSkirt, (LIV.x0 + LIV.x1) / 2, 0.04, LIV.z0 + 0.006, LIV.x1 - LIV.x0, 0.08, 0.012, 1);
      boxW(mHisSkirt, LIV.x0 + 0.006, 0.04, 0, 0.012, 0.08, LIV.z1 - LIV.z0, 4);
      /* THE KITCHEN COUNTER along the -z wall (x -0.5..2.9): gloss fronts, a dark stone top, a sink and its tap, a built-in
         oven with its clock (ending B reads 3:41 on it: `ovenClock`), the drawer the pills are in (ending C), the wall
         cabinets; a tall cabinet at its end (the fridge built in) */
      const KX0 = HX - 0.5, KX1 = HX + 2.3, KZ = LIV.z0 + 0.31;
      boxW(mGloss, (KX0 + KX1) / 2, 0.44, KZ, KX1 - KX0, 0.88, 0.6, 1 | 4 | 8);
      boxW(mStoneTop, (KX0 + KX1) / 2, 0.9, KZ, KX1 - KX0 + 0.02, 0.04, 0.64, 63);
      for (let x = KX0 + 0.6; x < KX1 - 0.1; x += 0.6) boxW(mAlu, x, 0.44, KZ + 0.302, 0.006, 0.82, 0.004, 1);
      boxW(mAlu, HX + 0.1, 0.76, KZ + 0.302, 0.5, 0.012, 0.004, 1);                        // the drawer's pull (ending C's drawer, its front x -0.2..0.4)
      boxW(mSteelSink, HX + 0.95, 0.925, KZ, 0.55, 0.01, 0.4, 16);
      bar(mAlu, [HX + 0.95, 0.92, KZ - 0.24], [HX + 0.95, 1.2, KZ - 0.24], 0.012);
      bar(mAlu, [HX + 0.95, 1.2, KZ - 0.24], [HX + 0.95, 1.2, KZ - 0.06], 0.012);
      boxW(mStoneTop, HX + 1.75, 0.5, KZ + 0.3, 0.58, 0.58, 0.01, 1);                          // the oven's glass door
      boxW(mGloss, (KX0 + KX1) / 2, 1.95, LIV.z0 + 0.18, KX1 - KX0, 0.7, 0.34, 1 | 4 | 8 | 32);
      boxW(mGloss, HX + 2.62, 1.2, KZ, 0.62, 2.4, 0.6, 1 | 4 | 8 | 16);
      boxW(mAlu, HX + 2.36, 1.2, KZ + 0.302, 0.012, 0.5, 0.004, 1);
      solidXZ(KX0 - 0.02, LIV.z0, HX + 2.95, LIV.z0 + 0.62, 1.4);
      /* HIS GLASS on +z: floor-to-ceiling panes in aluminium, the sliding door to the balcony (x -0.7..0.8, its moving
         panel the -x one: `balconyDoor`), the bedroom's glass the same */
      for (const [x0, x1] of [[LIV.x0, LIV.x1], [BED.x0, BED.x1]]) {
        boxW(mAlu, (x0 + x1) / 2, 0.03, LIV.z1, x1 - x0, 0.06, 0.12, 63); boxW(mAlu, (x0 + x1) / 2, H - 0.03, LIV.z1, x1 - x0, 0.06, 0.12, 63);
        for (let x = x0; x <= x1 + 1e-6; x += (x1 - x0) / Math.round((x1 - x0) / 1.25)) boxW(mAlu, x, H / 2, LIV.z1, 0.06, H, 0.1, 63);
      }
      boxW(mHisWall, (LIV.x1 + BED.x0) / 2, H / 2, LIV.z1 - 0.075 + 0.075, BED.x0 - LIV.x1, H, 0.3, 1 | 16);   // the wall between his two glass walls (the passage's end)
      /* the balcony: its slab's edge, the glass balustrade and its rail, the slab's soffit seen from below by nobody */
      boxW(mSlab, (BALC.x0 + BALC.x1) / 2, -0.2, BALC.z1, BALC.x1 - BALC.x0, 0.3, 0.12, 63);
      boxW(mAlu, (BALC.x0 + BALC.x1) / 2, BALC.rail, BALC.z1 - 0.04, BALC.x1 - BALC.x0, 0.05, 0.06, 63);
      boxW(mGlassHis, (BALC.x0 + BALC.x1) / 2, BALC.rail / 2, BALC.z1 - 0.04, BALC.x1 - BALC.x0, BALC.rail - 0.05, 0.01, 1 | 2);
      wallRun(mCorrWall, 'x', LIV.z0 - 0.075, 0.15, CORR.x0, LIV.x0 - 0.15, 0, 2.6, [], { solid: false, sides: 2 });   // the corridor's near wall past his flat
      for (const x of [BALC.x0, BALC.x1]) boxW(mSlab, x, H / 2, (BALC.z0 + BALC.z1) / 2, 0.25, H + 0.3, BALC.z1 - BALC.z0 + 0.12, 63);
      solidXZ(LIV.x0, LIV.z1 - 0.06, BED.x1, LIV.z1 + 0.06, 2.6);                            // the glass is solid in play (ending D's door is a film's)
      /* THE CORRIDOR: the carpet, its walls, the window at its end over the city, his neighbours' doors (models) */
      wallRun(mCorrWall, 'x', CORR.z0 - 0.075, 0.15, CORR.x0, CORR.x1, 0, 2.6, [], { solid: false, sides: 1 });
      wallRun(mCorrWall, 'z', CORR.x1 + 0.075, 0.15, CORR.z0, CORR.z1, 0, 2.6, [], { solid: false, sides: 2 });
      wallRun(mCorrWall, 'z', CORR.x0 - 0.075, 0.15, CORR.z0, CORR.z1, 0, 2.6, [{ a0: CORR.z0 + 0.3, a1: CORR.z1 - 0.3, y0: 0.8, y1: 2.3 }], { solid: false, sides: 1 });
      quad(mGlassHis, [CORR.x0 - 0.075, 0.8, CORR.z0 + 0.3], [CORR.x0 - 0.075, 0.8, CORR.z1 - 0.3], [CORR.x0 - 0.075, 2.3, CORR.z1 - 0.3], [CORR.x0 - 0.075, 2.3, CORR.z0 + 0.3]);
      boxW(mVeneer, HX - 3.8, 2.16, LIV.z0 - 0.15, 0.92, 0.08, 0.04, 63);                   // his door's head
      boxW(mAlu, HX - 3.32, 1.05, LIV.z0 - 0.16, 0.06, 0.12, 0.02, 63);                     // the keycard reader beside it
      /* HIS BLOCK'S FACE round his windows (the neighbours' balconies beside and over and under his, the tower's walls),
         seen from his balcony and along his glass */
      for (let k = -3; k <= 3; k++) {
        const y = k * 3.0;
        for (const [x0, x1] of [[HX - 16, HX - 4.85], [HX + 8.45, HX + 18], [BALC.x0, BALC.x1]]) {
          if (k === 0 && x0 === BALC.x0) continue;
          boxW(mSlab, (x0 + x1) / 2, y - 0.2, (BALC.z0 + BALC.z1) / 2, x1 - x0, 0.3, BALC.z1 - BALC.z0, 63);
          boxW(mAlu, (x0 + x1) / 2, y + BALC.rail, BALC.z1 - 0.04, x1 - x0, 0.05, 0.06, 63);
          boxW(mGlassHis, (x0 + x1) / 2, y + BALC.rail / 2, BALC.z1 - 0.04, x1 - x0, BALC.rail - 0.05, 0.01, 1);
          if (k !== 0) boxW(mDarkRoom, (x0 + x1) / 2, y + 1.4, LIV.z1 + 0.02, x1 - x0, 2.8, 0.02, 1);
        }
        if (k !== 0) boxW(mDarkRoom, (BED.x0 + BED.x1) / 2, y + 1.4, LIV.z1 + 0.02, BED.x1 - BED.x0, 2.8, 0.02, 1);
      }
      boxW(mSlab, HX - 4.75, 0, 3.0, 0.3, 24, 3.0, 63); boxW(mSlab, HX + 8.35, 0, 3.0, 0.3, 24, 3.0, 63);
      flush(hisG);
    }

    /* ================================================================ HIS CITY (the plan's 5.4; R108: no painted windows).
       Towers as built slabs with every window its own pane (one instanced mesh: a pane each, lit warm, lit cool or dark,
       how many lit set by the look), an expressway far below with its lamps and its moving lights, the pool's glow at the
       foot of his block, the ground. All inside 155 m of his glass (the far plane, v8.9) */
    const towerWins = [];                                                // [x, y, z, ry, w, h] of every window pane
    const TOWERS = [];
    {
      const r = rng(51050);
      const sites = [];
      for (let i = 0; i < 26; i++) {
        let x, z, ok = false;
        for (let tries = 0; tries < 30 && !ok; tries++) {
          x = HX + (r() * 2 - 1) * 118; z = 24 + r() * 108;
          ok = Math.hypot(x - HX, z) < 150 && sites.every(s => Math.hypot(s[0] - x, s[1] - z) > 26);
        }
        if (!ok) continue;
        sites.push([x, z]);
      }
      /* (and a few to his corridor's west, seen through its end window) */
      for (const [dx, dz] of [[-60, -18], [-92, 12], [-74, 40]]) sites.push([HX + dx, dz]);
      for (const [x, z] of sites) {
        const w = 18 + r() * 14, d = 16 + r() * 12, top = -10 + r() * 70, ry = (r() - 0.5) * 0.5;
        TOWERS.push({ x, z, w, d, top, ry });
        const mat = mTower[(r() * mTower.length) | 0];
        /* the slab (its faces drawn turned by its own turn) */
        const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hd = d / 2, P = (lx, y, lz) => [x + lx * c + lz * s, y, z - lx * s + lz * c];
        const ya = GH, yb = top;
        quad(mat, P(-hw, ya, hd), P(hw, ya, hd), P(hw, yb, hd), P(-hw, yb, hd));
        quad(mat, P(hw, ya, hd), P(hw, ya, -hd), P(hw, yb, -hd), P(hw, yb, hd));
        quad(mat, P(hw, ya, -hd), P(-hw, ya, -hd), P(-hw, yb, -hd), P(hw, yb, -hd));
        quad(mat, P(-hw, ya, -hd), P(-hw, ya, hd), P(-hw, yb, hd), P(-hw, yb, -hd));
        quad(mat, P(-hw, yb, hd), P(hw, yb, hd), P(hw, yb, -hd), P(-hw, yb, -hd));
        /* its windows: 1.5 x 1.7 panes on a 3.2 x 3.0 m grid, on every face, a hair proud of it */
        const faces = [[0, hd, 0], [Math.PI / 2, hw, 1], [Math.PI, hd, 0], [-Math.PI / 2, hw, 1]];
        for (const [fr, off, side] of faces) {
          const span = side ? d : w, cols = Math.floor((span - 2) / 3.2), rows = Math.floor((yb - ya - 6) / 3.0);
          for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
            const u = -((cols - 1) * 3.2) / 2 + i * 3.2, y = ya + 4.5 + j * 3.0;
            const lx = fr === 0 ? u : fr === Math.PI ? -u : (fr > 0 ? off + 0.03 : -off - 0.03), lz = fr === 0 ? off + 0.03 : fr === Math.PI ? -off - 0.03 : (fr > 0 ? -u : u);
            const p = P(lx, y, lz); towerWins.push([p[0], p[1], p[2], ry + fr, 1.5, 1.7]);
          }
        }
        /* a red aviation lamp on the tallest roofs (painted) */
        if (top > 30) glow(x, top + 1.2, z, 2.2, 0xff2a20, 0.9, cityG, 'city');
      }
      /* the ground under the city, and his block's own foot: the pool (lit from inside), its deck, a path */
      floor(mGround, HX - 160, -20, HX + 160, 160, GH);
      floor(mDeck, HX - 9, 9, HX + 13, 27, GH + 0.02);
      /* THE EXPRESSWAY far below: a raised deck crossing the view (z 72..90), its parapets */
      const EZ = 78, EY = GH + 7.5;
      floor(mRoadFar, HX - 150, EZ - 9, HX + 150, EZ + 9, EY);
      boxW(mSlab, HX, EY - 0.6, EZ - 9, 300, 1.2, 0.4, 63); boxW(mSlab, HX, EY - 0.6, EZ + 9, 300, 1.2, 0.4, 63);
      for (let x = HX - 140; x <= HX + 140; x += 28) boxW(mSlab, x, (GH + EY) / 2, EZ, 3, EY - GH, 8, 63);
      flush(cityG);
      const pg = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), mPool); pg.rotation.x = -Math.PI / 2; pg.position.set(HX + 2, GH + 0.05, 18); cityG.add(pg); owned.push(pg.geometry);
      pool(HX + 2, GH + 0.08, 18, 26, 14, 0x5ae0e8, 0.5, { parent: cityG, look: 'night' });
      /* the expressway's lamps (orange, both edges, every 30 m) */
      for (let x = HX - 140; x <= HX + 140; x += 30) for (const z of [EZ - 8.6, EZ + 8.6]) glow(x, EY + 9, z, 5.0, 0xffa040, 0.85, cityG, 'night');
    }
    /* THE TOWERS' WINDOWS: every pane one instance (two triangles a window, one draw for the whole city) */
    const winGeo = new THREE.PlaneGeometry(1, 1); owned.push(winGeo);
    const winMat = B({ color: 0xffffff });
    const winIM = new THREE.InstancedMesh(winGeo, winMat, towerWins.length); winIM.name = 'the city windows'; owned.push(winIM);
    {
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
      towerWins.forEach(([x, y, z, ry, w, h], i) => { q.setFromAxisAngle(up, ry); m4.compose(p.set(x, y, z), q, sc.set(w, h, 1)); winIM.setMatrixAt(i, m4); });
      winIM.instanceMatrix.needsUpdate = true; winIM.frustumCulled = false; cityG.add(winIM);
    }
    const winSeed = towerWins.map((_, i) => { let s = (i * 2654435761) >>> 0; s ^= s >>> 13; s = (s * 1274126177) >>> 0; return (s >>> 8) / 16777216; });
    const winKind = towerWins.map((_, i) => ((i * 40503) >>> 0) % 7);
    const _wc = new THREE.Color();
    /* how many of the city's windows are lit, and in which colours, by the look: a quarter at 11:52, one in nine at three,
       none at dawn (the glass then the morning's pale) */
    function cityWindows(look) {
      const lit = look === 'HOME' ? 0.27 : look === 'NIGHT' ? 0.11 : look === 'DAWN' ? 0 : 0.22;
      for (let i = 0; i < towerWins.length; i++) {
        const on = winSeed[i] < lit;
        if (look === 'DAWN') _wc.setHex(winKind[i] < 3 ? 0x9cb0c4 : 0x8496aa);
        else if (on) _wc.setHex(winKind[i] < 4 ? 0xe8b878 : winKind[i] < 6 ? 0xd8dcd8 : 0x9fc0e8).multiplyScalar(0.55 + 0.45 * winSeed[(i * 7) % towerWins.length]);
        else _wc.setHex(0x14181f);
        winIM.setColorAt(i, _wc);
      }
      if (winIM.instanceColor) winIM.instanceColor.needsUpdate = true;
    }
    cityWindows('HOME');
    /* THE EXPRESSWAY'S LIGHTS moving: heads (white, toward -x) on its near side, tails (red, toward +x) on its far side,
       each a small card; their places a function of the wall clock (an ambient thing: no story waits on them) */
    const carGeo = new THREE.PlaneGeometry(1.4, 0.5); owned.push(carGeo);
    const carMat = B({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    const CARS = 56, carIM = new THREE.InstancedMesh(carGeo, carMat, CARS); carIM.frustumCulled = false; owned.push(carIM); cityG.add(carIM);
    const carLane = [], carRng = rng(51060);
    for (let i = 0; i < CARS; i++) { const dir = i % 2 ? 1 : -1; carLane.push({ dir, x0: carRng() * 300, v: 18 + carRng() * 10, z: 78 + (dir > 0 ? 3 + carRng() * 4 : -3 - carRng() * 4) });
      carIM.setColorAt(i, _wc.setHex(dir > 0 ? 0xff3020 : 0xfff2d8)); }
    if (carIM.instanceColor) carIM.instanceColor.needsUpdate = true;
    const _cm = new THREE.Matrix4(), _cq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.6, 0, 0)), _cp = new THREE.Vector3(), _cs = new THREE.Vector3(1, 1, 1);
    function carsTick(t) {
      for (let i = 0; i < CARS; i++) { const L = carLane[i], u = ((L.x0 + L.dir * L.v * t) % 300 + 300) % 300;
        _cm.compose(_cp.set(HX - 150 + u, -78 + 7.6, L.z), _cq, _cs); carIM.setMatrixAt(i, _cm); }
      carIM.instanceMatrix.needsUpdate = true;
    }
    carsTick(0);

    /* ================================================================ THE THINGS (the plan's 7; props/RECORD.md): every one a
       real model, stood by its key; a new one not landed yet stands as an invisible stand-in for its collision only, and is
       drawn the moment its file is in the build (v4.7) */
    const DEG = Math.PI / 180;
    const things = {};
    /* a model at a place, its collision a stand-in box from the floor (w on its own x, d on its own z) that stays whether
       the model has landed or not, so nothing moves when it does */
    function place(name, key, x, y, z, ry, o = {}) {
      const g = stand(key, x, y, z, ry, Object.assign({ parent: o.parent || world }, o));
      g.name = name; things[name] = g;
      if (o.solid) { const [w, d, h] = o.solid; solidBox(w, h || 1.2, d, x, (h || 1.2) / 2, z, ry); }
      return g;
    }
    /* a reused model's paint darkened, warmed or turned (its file untouched: v12.4), the moment it lands */
    const tint = (hex, k = 1) => (m) => m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) { if (!mt || !mt.color) continue;
      mt.color.multiply(new THREE.Color(hex)).multiplyScalar(k); } });
    const matteOf = (m) => m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) if (mt && 'roughness' in mt) { mt.roughness = Math.max(mt.roughness, 0.6); mt.metalness = Math.min(mt.metalness, 0.1); } });

    /* ---------------------------------------------- HER FRONT ROOM, set for the evening (the plan's 5.3 and 8.1) */
    const HER = {
      table:  { x: 0.5, z: 1.15, w: 1.0, d: 0.54, h: 0.40 },          // the coffee table under the white cloth
      pho:    { x: 0.5, z: 1.87, ry: Math.PI },                       // Grandmaster Pho on his cushion, facing the door across the room
      him:    { x: WORLD_AT.kneel.x, z: WORLD_AT.kneel.z, ry: WORLD_AT.kneel.ry },   // he kneels at Pho's right, by her windows
      sofa:   { x: 0.5, z: -0.35, w: 1.5, d: 0.87, seat: 0.44, ry: 0 },   // her two-seat sofa, its back to the door
      grace:  { x: 0.42, z: -0.32, ry: 0 },                           // where she sits on it (her right-hand seat, facing him and Pho)
      rattan: { x: -1.55, z: -0.95, ry: 0.77, seat: 0.45 },           // the rattan chair by the door, turned to the table: Marcus
      door:   { x: FRONT.x0, z: -2.375, w: 0.95, hingeZ: -2.85 },     // her front door, in the back wall off the landing
      shelf:  { x: -1.6, z: 2.78, ry: Math.PI },                      // the bookshelf against the +z wall
      fan:    { x: 0.45, z: 0.75 },                                   // the ceiling fan over the table
      bag:    { x: 1.02, y: 0.44, z: -0.33 },                         // her open bag on the sofa beside her, the packet in it
      plant:  { x: 2.25, z: -2.55 }
    };
    /* on the cloth when play begins (the plan's 8.1): the bowl, two candles, the jug and the lighter beside his knee (the
       jug, the lighter, the incense and the small white plate have no model yet: their spots are kept for them) */
    const CLOTH_Y = HER.table.h + 0.012;
    const ON_CLOTH = {
      bowl:     { x: 0.78, y: CLOTH_Y, z: 1.22 },
      candle1:  { x: 0.18, y: CLOTH_Y, z: 1.34 },
      candle2:  { x: 0.30, y: CLOTH_Y, z: 0.98 },
      plate:    { x: 0.08, y: CLOTH_Y, z: 0.96 },                     // the small white plate's corner, apart from everything (9.2)
      lighter:  { x: 0.95, y: CLOTH_Y, z: 1.36 },
      incense:  { x: 0.52, y: CLOTH_Y, z: 1.38 },
      jug:      { x: 1.18, y: 0, z: 1.58 }                            // on the floor at his knee
    };
    {
      const T = HER.table;
      place('ctable', 'w51ctable', T.x, 0, T.z, 0, { solid: [T.w, T.d, 0.6] });
      place('gsofa', 'w51gsofa', HER.sofa.x, 0, HER.sofa.z, HER.sofa.ry, { solid: [HER.sofa.w, HER.sofa.d, 0.9] });
      place('rattan', 'w51rattan', HER.rattan.x, 0, HER.rattan.z, HER.rattan.ry, { solid: [0.66, 0.66, 0.9] });
      place('shelf', 'w51shelf', HER.shelf.x, 0, HER.shelf.z, HER.shelf.ry, { solid: [0.82, 0.34, 1.4],
        done: (m, g) => { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m); if (things.herLamp) things.herLamp.position.y = Math.max(0.5, bb.max.y - g.position.y); } });
      things.herLamp = place('herLamp', 'w5tablelamp', 0.18, 1.39, 0, 0, { parent: things.shelf });
      place('phoCushion', 'w5cushion', HER.pho.x, 0, HER.pho.z, 0);
      place('hisCushion', 'w5cushion', HER.him.x, 0, HER.him.z - 0.05, 0.2);
      place('cushionA', 'w5cushion', -0.75, 0, 2.35, 0.4); place('cushionB', 'w5cushion', -1.05, 0.11, 2.42, 0.9);
      place('plant', 'w3dracaena', HER.plant.x, 0, HER.plant.z, 0.6, { solid: [0.6, 0.6, 1.5] });
      place('ceilFan', 'w5ceilfan', HER.fan.x, FRONT.ceil - 0.52, HER.fan.z, 0);
      place('bag', 'w51bag', HER.bag.x, HER.bag.y, HER.bag.z, -0.25);
      place('keepsake', 'w51keepsake', HER.bag.x + 0.02, HER.bag.y + 0.07, HER.bag.z, 0.4);
      place('holyBowl', 'w4bigbowl', ON_CLOTH.bowl.x, ON_CLOTH.bowl.y, ON_CLOTH.bowl.z, 0, { lift: 3, done: tint(0xffd9a0, 1.0) });   // (a warm tint: the plan's brass, its silver file untouched)
      place('candle1', 'w3candlesmall', ON_CLOTH.candle1.x, ON_CLOTH.candle1.y, ON_CLOTH.candle1.z, 0);
      place('candle2', 'w3candlesmall', ON_CLOTH.candle2.x, ON_CLOTH.candle2.y, ON_CLOTH.candle2.z, 0);
      /* the ritual's small things (props: made by THINGS, drawn when keyed): the white plate, the lighter, the jug */
      place('plate', 'w51plate', ON_CLOTH.plate.x, ON_CLOTH.plate.y, ON_CLOTH.plate.z, 0);
      place('lighter', 'w51lighter', ON_CLOTH.lighter.x, ON_CLOTH.lighter.y, ON_CLOTH.lighter.z, 0.6);
      place('jug', 'w51jug', ON_CLOTH.jug.x, ON_CLOTH.jug.y, ON_CLOTH.jug.z, -0.4);
      place('incense', 'w51incense', ON_CLOTH.incense.x, ON_CLOTH.incense.y, ON_CLOTH.incense.z, 0.3);
      /* the back room: her small table (its laptop closed on it), two chairs, the fridge, her takeaway boxes on the counter */
      place('dintable', 'w4dintable', -4.25, 0, 0.75, Math.PI / 2, { solid: [1.2, 0.85, 0.8], h: 0.74, done: matteOf });
      place('dinchairA', 'w4dinechair', -4.25, 0, 1.45, Math.PI, { solid: [0.48, 0.5, 0.9] });
      place('dinchairB', 'w4dinechair', -4.6, 0, 0.0, 0.1, { solid: [0.48, 0.5, 0.9] });
      place('laptop', 'w51laptop', -4.1, 0.745, 0.65, 0.3);
      place('fridge', 'w4fridge', -5.18, 0, 2.6, Math.PI, { solid: [0.76, 0.76, 1.7] });
      place('takeaway', 'w51takeaway', -3.3, 0.9, 2.72, 0.4);
      /* her doors: the front door (open in the opening film, shut in play: `herDoor`), the bedroom's, the street's */
      const hp = new THREE.Group(); hp.position.set(FRONT.x0 - 0.075, 0, HER.door.hingeZ); hp.name = 'her front door'; herFlatG.add(hp); things.herDoorPivot = hp;
      stand('w4doorleaf', 0, 0, 0.47, Math.PI / 2, { parent: hp, done: matteOf });
      things.herDoorSolid = solidBox(0.1, 2.1, 0.95, FRONT.x0 - 0.075, 1.05, HER.door.z);
      stand('w4doorleaf', BACKR.x0 - 0.075, 0, -0.83, Math.PI / 2, { parent: herFlatG, done: matteOf });       // the bedroom door, shut
      solidBox(0.1, 2.1, 0.94, BACKR.x0 - 0.075, 1.05, -0.83);
      const sp = new THREE.Group(); sp.position.set(STREET.shop, GY, STAIR.z1); sp.name = 'the street door'; streetG.add(sp); things.streetDoorPivot = sp;
      stand('w4doorleaf', 0, 0, -0.5, Math.PI / 2, { parent: sp, done: matteOf });
      /* on the landing: the metal gate folded back against the lobby's wall, her shoes by the door, a plant */
      const gp = new THREE.Group(); gp.position.set(FRONT.x0 - 0.2, 0, -1.86); gp.name = 'her gate'; herFlatG.add(gp); things.gatePivot = gp;
      stand('w4gate', -0.48, 0, 0.0, 0, { parent: gp, lift: 1.5 });
      place('shoes1', 'w5slippers', -3.22, 0, -2.62, 1.4, { parent: herFlatG }); place('shoes2', 'w5slippers', -3.46, 0, -2.56, 1.75, { parent: herFlatG });
      place('landingPlant', 'w4corrpots', -3.94, 0, -2.25, Math.PI / 2, { parent: herFlatG, s: 0.6 });
      /* the stair's one tube, on the bay's far wall over the flight; the coffee shop's, inside its shutter */
      place('stairTube', 'w4tubelight', -1.6, 1.75, STAIR.z0 + 0.11, 0, { lift: 1.5 }); things.stairTube.rotation.x = -Math.PI / 2;
      place('shopTube', 'w4tubelight', -1.2, -0.42, 0.2, Math.PI / 2, { lift: 1.5 });
      /* the coffee shop's chairs, stacked four high in three stacks for the night */
      const stacks = []; for (const [x, z] of [[-1.6, -1.6], [-1.15, -1.2], [-2.3, 1.4]]) for (let k = 0; k < 4; k++) stacks.push({ x, y: GY + k * 0.09, z, ry: 0.2 * k });
      many('w3pchair', stacks, world, 0.5);
      /* the street: lamps on both kerbs (sodium, painted), the taxi at her kerb (the opening's: `taxi`), a car parked across
         the street and one up it, a motorbike at the kerb */
      for (const z of [-24, 9.5, 30]) { place('lampN' + z, 'w4streetlamp', STREET.kerb + 0.25, GY - 0.03, z, Math.PI / 2, { lift: 1.5 }); }
      for (const z of [-10, 15]) { place('lampF' + z, 'w4streetlamp', STREET.road[1] - 0.25, GY - 0.03, z, -Math.PI / 2, { lift: 1.5 }); }
      place('taxi', 'e4sedan', 4.55, GY - 0.15, -1.6, Math.PI, { lift: 2, done: tint(0x6a8cc8, 1.0) });
      place('parkedA', 'e4sedanfar', 12.4, GY - 0.15, 9.5, 0, { lift: 2 });
      place('parkedB', 'e4suvfar', 4.6, GY - 0.15, 16.0, Math.PI, { lift: 2 });
      place('moto', 'e4moto', 3.95, GY - 0.15, -9.0, Math.PI + 0.25, { lift: 2 });
    }

    /* ---------------------------------------------- HIS HOME's things (the plan's 5.4, 9.4, 9.8, 9.9) */
    const HIS = {
      door:    { x: HX - 3.8, z: LIV.z0, w: 0.8, hingeX: HX - 4.2 },     // his front door (the corridor's side at -z)
      altar:   { x: HX - 4.28, z: 0.35, ry: Math.PI / 2, top: 0.9 },    // the altar cabinet on the living room's left wall
      sofa:    { x: HX - 2.3, z: -0.95, ry: 0, seat: 0.45 },            // his sofa, facing his glass
      circle:  { x: HX - 2.2, z: 1.0, r: 0.75 },                         // the middle of the room's floor: the thread's circle (9.7)
      dining:  { x: HX + 0.75, z: -0.25, w: 1.6, d: 0.9, h: 0.75, ry: 0 },   // his dining table
      chair1:  { x: HX + 0.75, z: 0.45, ry: Math.PI },                  // his chair (the +z side, his back to his glass)
      chair2:  { x: HX + 0.75, z: -0.95, ry: 0 },                       // the other chair (the kitchen's side: Pho's at dawn)
      bed:     { x: HX + 7.15, z: 0.8, ry: -Math.PI / 2, w: 1.7, l: 2.1, top: 0.55 },   // his bed, its head on the +x wall
      bedside: { x: HX + 7.95, z: 2.05 },
      getUp:   { x: HX + 6.7, z: -0.48 },                                // where he stands up from it (the bed's -z side)
      bedDoor: { x: BED.x0, z: 1.2, hingeZ: 1.65 },                      // the bedroom door, ajar
      clock:   { x: HX + 7.79, y: 0.5, z: 2.16, ry: -Math.PI / 2 - 0.5 },   // the alarm clock on his bedside, turned to the bed
      aircon:  { x: BED.x1 - 0.12, y: 2.25, z: 0.8, ry: -Math.PI / 2 },   // the wall unit over his bed's head, on the +x wall
      kettle:  { x: HX + 2.0, z: LIV.z0 + 0.3 },                       // on the kitchen counter
      bag:     { x: HX - 3.0, z: LIV.z0 + 0.3, ry: 0.2 },              // his bag on the floor inside his front door
      balcony: { x: HX + 0.05, z: LIV.z1, w: 1.5 },                      // the sliding door (x -0.7..0.8)
      frames:  [{ x: PASS.x0 + 0.45, y: 1.45, z: PASS.z1 - 0.01 }, { x: PASS.x0 + 1.05, y: 1.55, z: PASS.z1 - 0.01 }],
      oven:    { x: HX + 1.75, y: 0.86, z: LIV.z0 + 0.62 }
    };
    {
      place('altarcab', 'w51altarcab', HIS.altar.x, 0, HIS.altar.z, HIS.altar.ry, { solid: [0.9, 0.42, 1.0] });
      /* on the altar: the Buddha image, his teacher's photograph, a candle, the flowers, and where the bottle goes */
      place('buddha', 'e4buddha', HIS.altar.x + 0.02, HIS.altar.top, HIS.altar.z, HIS.altar.ry, { lift: 3 });
      place('photo', 'w4framesmall', HIS.altar.x - 0.05, HIS.altar.top, HIS.altar.z + 0.3, HIS.altar.ry + 0.25);
      place('altarCandle', 'w3candlesmall', HIS.altar.x + 0.12, HIS.altar.top, HIS.altar.z - 0.24, 0);
      place('jasmine', 'w51jasmine', HIS.altar.x - 0.04, HIS.altar.top, HIS.altar.z - 0.34, 0);
      place('bottle', 'w51bottle', HIS.altar.x + 0.14, HIS.altar.top, HIS.altar.z - 0.08, 0); things.bottle.visible = false;   // set down by the film of home (9.4)
      place('hisSofa', 'w51sofa', HIS.sofa.x, 0, HIS.sofa.z, HIS.sofa.ry, { solid: [2.1, 0.9, 0.9] });
      place('dining', 'w51dintable', HIS.dining.x, 0, HIS.dining.z, HIS.dining.ry, { solid: [HIS.dining.w, HIS.dining.d, 0.9] });
      place('chair1', 'w51dinchair', HIS.chair1.x, 0, HIS.chair1.z, HIS.chair1.ry, { solid: [0.5, 0.5, 0.9] });
      place('chair2', 'w51dinchair', HIS.chair2.x, 0, HIS.chair2.z, HIS.chair2.ry, { solid: [0.5, 0.5, 0.9] });
      place('hisPhone', 'e4phone', WORLD_AT.phone.x, WORLD_AT.phone.y, WORLD_AT.phone.z, 0.2);
      place('bed', 'w51bed', HIS.bed.x, 0, HIS.bed.z, HIS.bed.ry, { solid: [HIS.bed.w, HIS.bed.l, 0.7] });
      place('bedLamp', 'w5tablelamp', HIS.bedside.x + 0.09, 0.5, HIS.bedside.z, 0, { s: 0.8 });
      place('bedGlass', 'w51glass', HIS.bedside.x - 0.14, 0.5, HIS.bedside.z - 0.13, 0);            // the glass of water that trembles (8.3)
      place('altarGlass', 'w51glass', HIS.altar.x + 0.1, HIS.altar.top, HIS.altar.z + 0.12, 0);
      boxW(mVeneer, HIS.bedside.x, 0.25, HIS.bedside.z, 0.45, 0.5, 0.4, 63); solidXZ(HIS.bedside.x - 0.23, HIS.bedside.z - 0.2, HIS.bedside.x + 0.23, HIS.bedside.z + 0.2, 0.6);   // (a bedside cabinet: his bed's own set lands with w51bed if it has one)
      place('bedClock', 'w51clock', HIS.clock.x, HIS.clock.y, HIS.clock.z, HIS.clock.ry);            // the alarm clock on his bedside (9.4's insert: 11:58, 3:00)
      place('aircon', 'w51aircon', HIS.aircon.x, HIS.aircon.y, HIS.aircon.z, HIS.aircon.ry);
      place('kettle', 'w51kettle', HIS.kettle.x, 0.92, HIS.kettle.z, 0.4);
      place('hisBag', 'e4bag', HIS.bag.x, 0, HIS.bag.z, HIS.bag.ry);                                // his grey canvas bag by the door, the white thread in it (9.7)
      HIS.frames.forEach((f, i) => place('frame' + i, 'w5frame', f.x, f.y, f.z, Math.PI, { s: 0.55 }));
      /* the balcony: two plastic chairs, his clothes rack, a plant */
      place('bchair1', 'w3pchair', HX - 3.4, -0.05, 3.3, 0.3); place('bchair2', 'w3pchair', HX - 2.6, -0.05, 3.4, -0.2);
      place('rack', 'w4clothesrack', HX + 1.9, -0.05, 3.35, 0, { done: tint(0xd8d8d8) });
      place('bplant', 'w3dracaena', HX + 2.6, -0.05, 3.6, 1.2);
      /* his doors: the front door (shut in play, `hisDoor`), the bedroom's (ajar at bedtime, open in play), the sliding glass */
      const dp = new THREE.Group(); dp.position.set(HIS.door.hingeX, 0, LIV.z0 - 0.075); dp.name = 'his front door'; hisG.add(dp); things.hisDoorPivot = dp;
      stand('w5frontdoor', 0.4, 0, 0, 0, { parent: dp, done: tint(0x5a4a40, 0.55) });
      things.hisDoorSolid = solidBox(0.8, 2.1, 0.1, HIS.door.x, 1.05, LIV.z0 - 0.075);
      const bp = new THREE.Group(); bp.position.set(BED.x0 - 0.075, 0, HIS.bedDoor.hingeZ); bp.name = 'his bedroom door'; hisG.add(bp); things.bedDoorPivot = bp;
      stand('w4doorleaf', 0, 0, -0.45, Math.PI / 2, { parent: bp, done: (m) => { matteOf(m); tint(0xd8d2c8, 1.2)(m); } });
      bp.rotation.y = -82 * DEG;                                                   // open into the bedroom, against its wall
      solidBox(0.85, 2.0, 0.06, BED.x0 + 0.38, 1.0, HIS.bedDoor.hingeZ + 0.06);
      /* the sliding panel of his balcony door (glass in an aluminium frame): `balconyDoor(k)` slides it open */
      const sd = new THREE.Group(); sd.name = 'the balcony door'; hisG.add(sd); things.balconySlide = sd;
      { const fr = 0.05, w = 0.78, h = FLAT.ceil - 0.08, x0 = HX - 0.7;
        for (const [cx, cy, bw, bh] of [[x0 + w / 2, 0.06, w, fr], [x0 + w / 2, h, w, fr], [x0 + fr / 2, h / 2, fr, h], [x0 + w - fr / 2, h / 2, fr, h]]) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.05), mAlu); m.position.set(cx, cy, LIV.z1 - 0.035); sd.add(m); owned.push(m.geometry); }
        const gm = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * fr, h - fr), mGlassHis); gm.position.set(x0 + w / 2, h / 2 + 0.03, LIV.z1 - 0.035); sd.add(gm); owned.push(gm.geometry); }
      /* the corridor: its wall lights, his neighbours' doors */
      for (const x of [HX - 8.2, HX - 5.4, HX - 2.4, HX + 0.6]) place('corrLamp' + x, 'w5walllamp', x, 1.85, CORR.z0 + 0.02, 0, { lift: 1.5 });
      stand('w5frontdoor', HX - 6.8, 0, CORR.z0 + 0.04, 0, { parent: hisG, done: tint(0x5a4a40, 0.55) });
      stand('w5frontdoor', HX + 1.8, 0, CORR.z0 + 0.04, 0, { parent: hisG, done: tint(0x5a4a40, 0.55) });
    }

    /* ================================================================ HER WHITE CLOTH over the coffee table (the plan's
       5.3 and 9.1: Grandmaster Pho spreads it in the opening film; `cloth(k)` lays it, 0 folded away, 1 laid): a sheet of
       plain cotton that hangs a hand's breadth over the table's edges in soft folds, drawn as its own surface */
    const mCloth = M({ map: wPic((() => { const [c, x] = wCanvas(128, 128), r = rng(51070); x.fillStyle = '#f2efe6'; x.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 1800; i++) { x.fillStyle = r() < 0.5 ? 'rgba(200,196,184,0.25)' : 'rgba(255,255,255,0.3)'; x.fillRect(r() * 128, r() * 128, 1, 1); } return c; })(), 0.3, 0.3), roughness: 0.95, side: THREE.DoubleSide });
    const clothG = new THREE.Group(); clothG.name = 'the white cloth'; herThingsG.add(clothG);
    {
      const T = HER.table, W = T.w + 0.34, D = T.d + 0.34, NX = 28, NZ = 18;
      const g = new THREE.PlaneGeometry(W, D, NX, NZ); g.rotateX(-Math.PI / 2); const pa = g.attributes.position;
      for (let i = 0; i < pa.count; i++) {
        const x = pa.getX(i), z = pa.getZ(i), ox = Math.max(0, Math.abs(x) - T.w / 2), oz = Math.max(0, Math.abs(z) - T.d / 2), o = Math.max(ox, oz);
        const fold = 0.012 * Math.sin(x * 23) * Math.min(1, o / 0.05) + 0.008 * Math.sin(z * 31) * Math.min(1, o / 0.05);
        pa.setY(i, o > 0 ? -o * 0.96 : 0);
        if (ox > 0) pa.setX(i, Math.sign(x) * (T.w / 2 + ox * 0.18 + fold)); if (oz > 0) pa.setZ(i, Math.sign(z) * (T.d / 2 + oz * 0.18 + fold));
      }
      g.computeVertexNormals(); owned.push(g);
      const cm = new THREE.Mesh(g, mCloth); cm.position.set(T.x, T.h + 0.006, T.z); clothG.add(cm);
    }
    function cloth(k) { clothG.visible = k > 0.001; clothG.scale.set(1, 1, Math.max(0.02, Math.min(1, k))); }

    /* ================================================================ THE REFLECTION (the plan's 12): her window at night
       shows a faint mirror of the room's door corner. It is BUILT BEHIND THE GLASS: a mirrored copy of her flat (its
       fabric, its door, its things) and of whoever stands or sits in it, each drawn through the mirror about her front wall's
       inside face (x 2.75), every frame where its original is, dimmed; the dark pane laid over it. Measured from his
       kneeling eye (WORLD.md): the half-closed shutter keeps his own reflection, Pho's, the cloth's candles and the lamp's
       off the open glass, so the mirror never has to hold what has no body (he is never seen: v24.56).
       It is drawn only while the lens is inside her flat (from the street, the copy would stand in the air over it).
       THE HOOK for the films and the play (WORLD.reflect, ROOMTHINGS.reflect):
         reflect.add(id, P, o)    a person P (a mkPerson body) mirrored into the glass: o.face (a turn the reflection faces in
                                  the room, radians, Mixamo's: 0 faces +z; null follows the real one) or o.turn (radians
                                  added to the real one's), o.k (0..1, how strongly it shows; 1)
         reflect.set(id, o)       change those at any time (a film sets them from its clock: a pure function, v6.4)
         reflect.remove(id)
         reflect.strength(k)      the whole reflection's strength 0..1 (the glass's; 1 by default)
         reflect.state()          { on, k, people: { id: { face, turn, k, twins } } } (a probe's) */
    const MIRROR_X = FRONT.x1;
    const MIRROR = new THREE.Matrix4().set(-1, 0, 0, 2 * MIRROR_X, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    const mirrorG = new THREE.Group(); mirrorG.name = 'the reflection'; mirrorG.visible = false; world.add(mirrorG);
    const REFL_K = 0.36;                                                // how bright the room is in the glass, before the pane
    const reflMats = new Map();
    function reflMat(mt) {
      if (!mt) return mt;
      let r = reflMats.get(mt); if (r) return r;
      r = mt.clone(); mats.push(r);
      if (r.color) r.color.multiplyScalar(REFL_K);
      if (r.emissive) r.emissive.multiplyScalar(REFL_K);
      if ('envMapIntensity' in r) r.envMapIntensity = (r.envMapIntensity || 1) * REFL_K;
      r.userData.reflOf = mt; reflMats.set(mt, r); return r;
    }
    const reflRoots = [];                                               // { root, twins: Map(src -> twin), people: P|null, o }
    function twinOf(src) {
      let t;
      if (src.isInstancedMesh) { t = new THREE.InstancedMesh(src.geometry, Array.isArray(src.material) ? src.material.map(reflMat) : reflMat(src.material), src.count); t.instanceMatrix = src.instanceMatrix; }
      else if (src.isSkinnedMesh) { t = new THREE.SkinnedMesh(src.geometry, Array.isArray(src.material) ? src.material.map(reflMat) : reflMat(src.material));
        t.bindMode = 'detached'; t.bind(src.skeleton, src.bindMatrix); }
      else t = new THREE.Mesh(src.geometry, Array.isArray(src.material) ? src.material.map(reflMat) : reflMat(src.material));
      t.matrixAutoUpdate = false; t.matrixWorldAutoUpdate = false; t.frustumCulled = false; t.castShadow = t.receiveShadow = false;
      t.renderOrder = src.renderOrder; t.name = 'refl:' + (src.name || src.type);
      mirrorG.add(t); return t;
    }
    function reflTrack(root, o = {}) { const R = { root, twins: new Map(), person: o.person || null, o, n: -1 }; reflRoots.push(R); return R; }
    const _rT = new THREE.Matrix4(), _rR = new THREE.Matrix4(), _rM = new THREE.Matrix4(), _rP = new THREE.Vector3();
    const drawnUp = (o) => { for (let a = o; a; a = a.parent) { if (!a.visible) return false; if (a === world) return true; } return true; };
    function reflScan(R) {
      const list = []; R.root.traverse(q => { if ((q.isMesh || q.isInstancedMesh) && !q.isSprite && !(q.userData && q.userData.noRefl)) list.push(q); });
      if (list.length === R.n) return; R.n = list.length;
      for (const q of list) if (!R.twins.has(q)) {
        const mt = [].concat(q.material)[0];
        if (!mt || mt.visible === false || (mt.transparent && mt.blending === THREE.AdditiveBlending) || mt === matProxy) continue;
        R.twins.set(q, twinOf(q));
      }
    }
    let reflScanAt = 0, reflAuto = false;
    function reflTick(now) {
      /* (Grace and Marcus are in the glass from the first frame, following their bodies: the films and the play turn them) */
      if (!reflAuto && typeof cast === 'object' && cast) { reflAuto = true; if (cast.grace) reflect.add('grace', cast.grace); if (cast.marcus) reflect.add('marcus', cast.marcus); }
      const rescan = now - reflScanAt > 0.5; if (rescan) reflScanAt = now;
      for (const R of reflRoots) {
        if (rescan) reflScan(R);
        const P = R.person, o = R.o;
        let turn = 0;
        if (P) { const ry = P.group.rotation.y; turn = o.face != null ? angTo(ry, o.face) : (o.turn || 0); P.group.getWorldPosition(_rP); }
        const kOn = P ? (o.k == null ? 1 : o.k) > 0.02 : true;
        for (const [src, tw] of R.twins) {
          tw.visible = kOn && drawnUp(src);
          if (!tw.visible) continue;
          if (src.isSkinnedMesh) _rM.copy(src.bindMatrix); else { src.updateWorldMatrix(true, false); _rM.copy(src.matrixWorld); }
          if (turn) { _rT.makeTranslation(_rP.x, 0, _rP.z); _rR.makeRotationY(turn); _rM.premultiply(_rT.clone().invert()).premultiply(_rR).premultiply(_rT); }
          tw.matrix.copy(MIRROR).multiply(_rM); tw.matrixWorld.copy(tw.matrix);
        }
      }
    }
    /* what is mirrored from the first frame: her flat's fabric, its things, the cloth and her door's leaf */
    reflTrack(herFlatG); reflTrack(herThingsG);
    const herThingNames = ['ctable', 'gsofa', 'rattan', 'shelf', 'phoCushion', 'hisCushion', 'cushionA', 'cushionB', 'plant', 'ceilFan', 'bag', 'keepsake', 'dintable', 'dinchairA', 'dinchairB', 'laptop', 'fridge', 'takeaway'];
    for (const n of herThingNames) if (things[n]) reflTrack(things[n]);
    let reflStrength = 1;
    const reflPeople = new Map();
    const reflect = {
      add(id, P, o = {}) { if (!P || !P.group) return false; this.remove(id); const R = reflTrack(P.group, Object.assign({ face: null, turn: 0, k: 1 }, o, { person: P })); R.person = P; reflPeople.set(id, R); return true; },
      set(id, o) { const R = reflPeople.get(id); if (!R) return false; Object.assign(R.o, o); return true; },
      remove(id) { const R = reflPeople.get(id); if (!R) return false; for (const tw of R.twins.values()) mirrorG.remove(tw); reflRoots.splice(reflRoots.indexOf(R), 1); reflPeople.delete(id); return true; },
      strength(k) { reflStrength = Math.max(0, Math.min(1, k)); return reflStrength; },
      state() { const people = {}; for (const [id, R] of reflPeople) people[id] = { face: R.o.face, turn: R.o.turn, k: R.o.k, twins: R.twins.size };
        return { on: mirrorG.visible, k: reflStrength, roots: reflRoots.length, twins: mirrorG.children.length, people }; }
    };
    /* the pane's darkness carries the strength: at 1 the room shows at about a quarter of its brightness through it */
    const PANE_O = mPaneNight.opacity;
    function insideHer(p) { return p.x < FRONT.x1 - 0.02 && p.x > ROOM.x0 - 0.2 && p.z > FRONT.z0 - 0.02 && p.z < FRONT.z1 + 0.02 && p.y > -0.5 && p.y < FRONT.ceil + 0.1; }

    /* ================================================================ THE PAINTED LIGHT (v9.4: no lamp is added): each a
       picture of light where a lamp, a candle, a tube or the sun would lay it, shown by the look it belongs to */
    {
      /* her table lamp on the bookshelf: its glow, the warmth it throws on the ceiling and the wall behind it */
      const L = HER.shelf;
      glow(L.x - 0.18, 1.72, L.z - 0.02, 0.9, 0xffc88a, 0.55, herThingsG, 'lamp');
      pool(L.x, FRONT.ceil - 0.01, L.z - 0.5, 3.4, 3.0, 0xffb874, 0.22, { rx: Math.PI / 2, parent: herThingsG, look: 'lamp' });
      pool(L.x, 1.6, FRONT.z1 - 0.01, 2.6, 2.2, 0xffb874, 0.2, { rx: 0, ry: Math.PI, parent: herThingsG, look: 'lamp' });
      /* THE FAN'S SHADOW turning on the ceiling (the plan's 4.3 and 9.1): the lamp throws the blades up onto the plaster,
         offset from the fan away from the lamp; drawn as a soft dark picture of four blades turned with the fan */
      const sh = (() => { const [c, x] = wCanvas(256, 256); x.translate(128, 128);
        for (let i = 0; i < 4; i++) { x.rotate(Math.PI / 2); const g = x.createLinearGradient(0, 0, 118, 0); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
          x.fillStyle = g; x.beginPath(); x.moveTo(10, -8); x.quadraticCurveTo(70, -26, 120, -16); x.quadraticCurveTo(126, 0, 120, 16); x.quadraticCurveTo(70, 26, 10, 8); x.closePath(); x.fill(); }
        x.filter = 'blur(6px)'; return tex(done(THREE, c, false)); })();
      const fs = pool(HER.fan.x + 0.62, FRONT.ceil - 0.012, HER.fan.z - 0.7, 1.85, 1.85, 0xffffff, 0.3, { map: sh, add: false, rx: Math.PI / 2, parent: herThingsG, look: 'lamp' });
      things.fanShadow = fs.q;
      /* the two candles' warmth on the cloth (their flames are the films' and the play's: `candleLit`) */
      for (const n of ['candle1', 'candle2']) { const c = ON_CLOTH[n];
        things[n + 'Glow'] = glow(c.x, c.y + 0.27, c.z, 0.28, 0xffb060, 0.9, herThingsG, n);
        things[n + 'Pool'] = pool(c.x, c.y + 0.003, c.z, 0.7, 0.7, 0xffa050, 0.3, { parent: herThingsG, look: n }); }
      /* the stair's tube: its own glow and the light it lays on the treads and the walls (`stairTube(k)` dims it, flickers it) */
      things.tubeGlow = glow(-1.6, 1.74, STAIR.z0 + 0.12, 1.4, 0xe8f4ff, 0.6, world, 'tube');
      things.tubePool = [pool(-1.6, GY + (STAIR.x1 + 1.6) / STAIR_RUN * STAIR_RISE + 0.03, (STAIR.z0 + STAIR.z1) / 2, 3.2, 1.1, 0xdfeeff, 0.18, { look: 'tube', rx: -Math.PI / 2, ry: Math.atan2(STAIR_RISE, STAIR_RUN) }),
                         pool(-1.6, 1.4, STAIR.z1 - 0.004, 3.2, 2.6, 0xdfeeff, 0.12, { rx: 0, ry: Math.PI, look: 'tube' })];
      /* the coffee shop's tube inside its half-shut shutter, and the light it spills under it onto the five-foot way */
      glow(-1.2, -0.45, 0.2, 1.6, 0xe8f4ff, 0.45, world, 'street');
      pool(0.0, GY + 0.004, 0.0, 4.4, 6.6, 0xd8e8ff, 0.12, { look: 'street' });
      pool(STREET.shop + 0.9, GY + 0.006, 0.0, 1.8, 5.6, 0xd8e8ff, 0.1, { look: 'street' });
      /* the street lamps' sodium on the road and the five-foot way's edge */
      for (const z of [-24, 9.5, 30]) { glow(STREET.kerb + 1.9, GY + 6.6, z, 1.8, 0xffa040, 0.9, world, 'street'); pool(STREET.kerb + 2.2, GY - 0.145, z, 9, 9, 0xff9030, 0.32, { look: 'street' }); }
      for (const z of [-10, 15]) { glow(STREET.road[1] - 1.9, GY + 6.6, z, 1.8, 0xffa040, 0.9, world, 'street'); pool(STREET.road[1] - 2.2, GY - 0.145, z, 9, 9, 0xff9030, 0.32, { look: 'street' }); }
      /* his altar's candle: a small warm point in his dark flat, and its light on the wall behind */
      things.altarGlow = glow(HIS.altar.x + 0.12, HIS.altar.top + 0.27, HIS.altar.z - 0.24, 0.32, 0xffb060, 0.85, hisG, 'altar');
      things.altarPool = pool(LIV.x0 + 0.01, 1.3, HIS.altar.z, 1.6, 1.4, 0xffa050, 0.16, { rx: 0, ry: Math.PI / 2, parent: hisG, look: 'altar' });
      /* the corridor's lamps */
      for (const x of [HX - 8.2, HX - 5.4, HX - 2.4, HX + 0.6]) { glow(x, 2.0, CORR.z0 + 0.12, 0.5, 0xffd8a0, 0.6, hisG, 'corr'); pool(x, 1.8, CORR.z0 + 0.003, 1.6, 1.8, 0xffd8a0, 0.2, { rx: 0, parent: hisG, look: 'corr' }); }
      /* the bathroom's light, spilling out of its open door into the bedroom (9.4: the shower; `bathLight(k)`) */
      things.bathPool = pool(HX + 5.45, 0.004, -0.4, 1.4, 1.6, 0xfff2e0, 0.35, { parent: hisG, look: 'bath' });
      /* DAWN's sun through his glass: long warm patches across his floor (their mullions' gaps between) */
      things.sunPatches = [];
      for (let x = LIV.x0 + 0.1; x < LIV.x1 - 0.5; x += 1.25) things.sunPatches.push(pool(x + 0.62, 0.005, 1.25, 1.1, 2.6, 0xffc070, 0.4, { add: true, parent: hisG, look: 'dawn', rz: 0.32 }));
    }
    /* THE LOOKS of the world (the head's PRESETS, by name): what each shows of the painted light. `worldLook(name)` sets
       it; the world's own tick follows the sky on its own when the scene's background is a preset's (the play and the
       films ask kit.daylight; nothing else is needed) */
    const LOOKS_ON = {
      BLUE:  { lamp: 1, candle1: 0, candle2: 0, tube: 1, street: 1, altar: 0, corr: 0, bath: 0, dawn: 0, city: 1, night: 1 },
      LAMP:  { lamp: 1, candle1: 1, candle2: 0, tube: 1, street: 1, altar: 0, corr: 0, bath: 0, dawn: 0, city: 1, night: 1 },
      HOME:  { lamp: 0, candle1: 0, candle2: 0, tube: 0, street: 0, altar: 1, corr: 1, bath: 0, dawn: 0, city: 1, night: 1 },
      NIGHT: { lamp: 0, candle1: 0, candle2: 0, tube: 0, street: 0, altar: 1, corr: 1, bath: 0, dawn: 0, city: 1, night: 1 },
      DAWN:  { lamp: 0, candle1: 0, candle2: 0, tube: 0, street: 0, altar: 0, corr: 1, bath: 0, dawn: 1, city: 0, night: 0 }
    };
    let lookNameW = 'LAMP';
    const lookOver = {};                                                // a film's or the play's own setting of one light: { candle: 0 }
    function worldLook(name) {
      if (!LOOKS_ON[name]) return false;
      if (name !== lookNameW) { lookNameW = name; cityWindows(name); }
      const L = LOOKS_ON[name];
      for (const p of pools) if (p.look) { const k = lookOver[p.look] != null ? lookOver[p.look] : (L[p.look] != null ? L[p.look] : 1);
        p.m.opacity = p.o0 * k; p.q.visible = k > 0.001; }
      return true;
    }
    /* a light of the world set by a film or the play (0..1; null gives it back to the look): candle, tube, bath, altar, ... */
    function worldLight(what, k) { if (k == null) delete lookOver[what]; else lookOver[what] = k; worldLook(lookNameW); }
    const BG_OF = Object.fromEntries(Object.entries(PRESETS).map(([n, P]) => [P.bg, n]));

    /* ================================================================ THE WORLD'S OWN TICK: run by the renderer before each
       drawing of the scene (the scene's onBeforeRender, chained to whatever stood there and given back when the chapter is
       left), so it sees the lens the frame is drawn from, in play and in a film alike. It holds: the reflection (on only
       with the lens inside her flat; each copy where its original is), the fan turning, the expressway's lights, and the
       look following the sky */
    let fanAng = 0, lastTick = 0;
    const _camW = new THREE.Vector3();
    function worldTick(cam) {
      const now = performance.now() / 1000, dt = lastTick ? Math.min(0.1, Math.max(0, now - lastTick)) : 0; lastTick = now;
      cam.getWorldPosition(_camW);
      const inside = insideHer(_camW);
      mirrorG.visible = inside && reflStrength > 0.001;
      if (mirrorG.visible) { reflTick(now); mPaneNight.opacity = 1 - (1 - PANE_O) * reflStrength; } else mPaneNight.opacity = PANE_O;
      fanAng += dt * 7.2;                                               // (about 1.15 turns a second: her fan on its middle setting)
      if (things.ceilFan) things.ceilFan.rotation.y = fanAng;
      if (things.fanShadow) things.fanShadow.rotation.z = fanAng;
      if (_camW.x > 100) carsTick(now);
      const bg = scene.background && scene.background.isColor ? scene.background.getHex() : null;
      if (bg != null && BG_OF[bg] && BG_OF[bg] !== lookNameW) worldLook(BG_OF[bg]);
    }
    const prevBR = scene.onBeforeRender;
    scene.onBeforeRender = function (r, s, cam, rt) {
      if (!alive) { if (scene.onBeforeRender !== prevBR) scene.onBeforeRender = prevBR; return prevBR.call(this, r, s, cam, rt); }
      try { worldTick(cam); } catch (e) { console.warn('e5c1 worldTick', e); }
      return prevBR.call(this, r, s, cam, rt);
    };
    worldLook('LAMP');

    /* ---------------------------------------------- the things the films and the play turn (each a pure setting of its
       argument, so a film's track can drive it from its own clock: v6.4) */
    const doorTo = (piv, deg) => { if (piv) piv.rotation.y = deg * DEG; };
    function herDoor(k) { doorTo(things.herDoorPivot, k * 92); things.herDoorSolid.position.y = k > 0.05 ? -5 : 1.05; }   // open into her room, toward its -z wall
    function streetDoor(k) { doorTo(things.streetDoorPivot, k * 95); }
    function hisDoor(k) { doorTo(things.hisDoorPivot, -k * 95); things.hisDoorSolid.position.y = k > 0.05 ? -5 : 1.05; }    // open into his flat
    function bedDoor(k) { doorTo(things.bedDoorPivot, -k * 82); }                                                         // 0 shut, 1 against the wall (play), 0.15 ajar
    function balconyDoor(k) { things.balconySlide.position.x = -Math.max(0, Math.min(1, k)) * 0.72; }                     // slides behind the fixed pane
    function shutter(name, deg) { const L = shutterLeaves.find(l => l.name === name); if (L) L.piv.rotation.y = L.sign * deg * DEG; }
    function stairTube(k) { worldLight('tube', k); }
    function bathLight(k) { worldLight('bath', k); }
    function candleLit(n, on) { worldLight(n, on == null ? null : on ? 1 : 0); }
    /* the oven's clock, the digits a picture (ending B: 3:41) */
    const ovenC = wCanvas(128, 48); const ovenTex = tex(done(THREE, ovenC[0], false));
    const ovenMat = B({ map: ovenTex, color: 0xffffff }); const ovenQ = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.06), ovenMat); owned.push(ovenQ.geometry);
    ovenQ.position.set(HIS.oven.x, HIS.oven.y, HIS.oven.z - 0.005); hisG.add(ovenQ);
    function ovenClock(text) { const x = ovenC[1]; x.fillStyle = '#060808'; x.fillRect(0, 0, 128, 48); x.fillStyle = '#58e0a0'; x.font = 'bold 34px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 26); ovenTex.needsUpdate = true; }
    ovenClock('11:52');
    cloth(1); herDoor(0); streetDoor(0); hisDoor(0); bedDoor(1); balconyDoor(0);

    /* ================================================================ WHERE EACH PHASE PUTS HIM AND THE PEOPLE (the
       plan's 8: each phase a save, a Continue lands at its start). `at` is where he stands at the phase's start (the play
       kneels him or lays him down); a person's station is where that person is while the phase is played */
    const STATION = {
      room:  { at: { x: HER.him.x, z: HER.him.z, ry: HER.him.ry },
               pho: { x: HER.pho.x, z: HER.pho.z, ry: HER.pho.ry }, grace: { x: HER.grace.x, z: HER.grace.z, ry: HER.grace.ry, y: HER.sofa.seat },
               marcus: { x: HER.rattan.x, z: HER.rattan.z, ry: HER.rattan.ry, y: HER.rattan.seat } },
      night: { at: { x: HIS.getUp.x, z: HIS.getUp.z, ry: 2.17 } }
    };
    STATION.breaking = STATION.room;
    STATION.ask = { at: { x: WORLD_AT.phone.x + 0.25, z: WORLD_AT.phone.z + 0.85, ry: 0.3 } };
    /* the opening's and the films' places (WORLD.md, the plan's 9) */
    const FILMPLACE = {
      crane:    { from: { x: 9.6, y: GY + 7.0, z: -6.2 }, to: { x: 4.2, y: GY + 1.6, z: -3.6 }, look: { x: 1.6, y: GY + 1.2, z: -3.3 } },   // 9.1: 7 m up, 6 m out, down to 1.6 m
      marcus0:  { x: 1.75, z: -3.0, ry: Math.PI / 2 + 0.3 },        // Marcus waiting by the stair door on the five-foot way
      taxi:     { x: 4.55, z: -1.6, ry: Math.PI, door: { x: 3.7, z: -1.15 } },   // the taxi's stop at her kerb; its kerbside rear door
      out:      { x: 3.05, z: -1.4 },                              // where he steps onto the five-foot way
      stairFoot: { x: 1.3, y: GY, z: -3.72 }, stairTop: { x: STAIR.x0, y: 0, z: -3.72 },
      landing:  { x: -3.55, z: -2.7, ry: -Math.PI / 2 },            // the top of the stair, turned toward her door
      herDoorOut: { x: -3.35, z: -2.375 }, herDoorIn: { x: -2.35, z: -2.375 },
      glass:    { x: MIRROR_X, y: 1.45, z: 1.0 },                   // the point of her window where the door corner is reflected from his place
      corridor: { from: { x: HX - 8.6, z: -3.45 }, to: { x: HX - 3.8, z: -3.2 } },   // 9.4: his walk to his door
      hisDoorIn: { x: HX - 3.8, z: -1.9 },
      altarFront: { x: HX - 3.55, z: HIS.altar.z, ry: Math.PI / 2 }, // standing at his altar
      phoneAt:  { x: WORLD_AT.phone.x, y: WORLD_AT.phone.y, z: WORLD_AT.phone.z },
      bedEdge:  { x: HX + 6.55, y: 0.55, z: 0.15 }, bedHead: { x: HX + 7.85, y: 0.62, z: 0.8 },
      sofaSeat: { x: HIS.sofa.x, y: HIS.sofa.seat, z: HIS.sofa.z + 0.1 },
      kitchen:  { x: HX + 0.1, z: LIV.z0 + 0.95 },                   // at the drawer and the tap (ending C)
      balconyAt: { x: HIS.balcony.x - 0.2, z: LIV.z1 - 0.35 },       // ending D: the doorway's frame, never past it
      circle:   { x: HIS.circle.x, z: HIS.circle.z, r: HIS.circle.r },
      dawnSeat: { him: { x: HIS.chair1.x, z: HIS.chair1.z }, pho: { x: HIS.chair2.x, z: HIS.chair2.z } },
      /* his footsteps from his front door to his bed, as the film of home walked them (8.3: lit red in Spirit Vision) */
      steps:    [[HX - 3.8, -2.2], [HX - 3.6, -1.3], [HX - 3.55, -0.2], [HX - 3.1, 0.2], [HX - 2.0, -0.05], [HX - 0.8, 0.1], [HX + 0.2, 0.55],
                 [HX + 1.4, 0.75], [HX + 2.6, 0.95], [HX + 3.7, 1.05], [HX + 4.6, 1.15], [HX + 5.6, 0.6], [HX + 6.4, 0.05]]
    };
    const ROOMTHINGS = Object.assign({ ON_CLOTH, CLOTH_Y, WIN, MIRROR_X, KNEEL_EYE, GY, STAIR, LOBBY, FRONT, BACKR, UNITS, FILMPLACE, reflect, things }, HER);
    const FLATTHINGS = Object.assign({ LIV, BED, BATH, PASS, CORR, BALC, GH, TOWERS: TOWERS.length, windows: towerWins.length }, HIS);
    /* THE WORLD'S HANDLES for the films and the play (ROOMTHINGS.api, d_play's stage.plan): each a setting, never a timer */
    const WORLD = { things, reflect, look: worldLook, light: worldLight, cloth, herDoor, streetDoor, hisDoor, bedDoor, balconyDoor, shutter,
                    stairTube, bathLight, candleLit, ovenClock, cityWindows, insideHer, state: () => ({ look: lookNameW, over: Object.assign({}, lookOver), refl: reflect.state(), waiting: [...waiting] }) };
    ROOMTHINGS.api = WORLD; FLATTHINGS.api = WORLD;

    /* ====================================================== THE DRAWN SURFACES' HELPERS (chapter 3's own, as chapters 4
       and 5 have them) */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function noMip(THREE, t) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; }
    /* ================================================================ THE CHAPTER'S SHARED CAST (masters/v29.0/parts/c_cast.js)
       Begun by WORDS (M1) as the skeleton's cast; CAST (M3) swaps Grace's and Marcus's own bodies in, and the FILMS and
       PLAY pieces pose them. ONE BODY EACH, so nothing is cast twice (two bodies of one man cost a phone twice and drift
       apart). Each is a person of chapter 3's machinery (mkPerson), posed by the films' clock (pose) and by the play's
       wall clock (take, hold, rest, talk):
         cast.pho     Grandmaster Pho SEATED cross-legged on his cushion at Grace's low table, in his look D (Chad's pick,
                      v24.52: "unlit, except for the robe"), every posture law episode 4 learned on him: copied here number
                      for number (a declared reuse). Standing at dawn he is chapter 5's copy with finger bones (p5pho):
                      FILMS adds that body with the dawn
         cast.grace   GRACE (the plan's 6). STAND-IN until her own body lands (M3, `p51grace`): Mala, Amma's daughter,
                      whom the player met only in episode 4 chapter 4 (her mother's flat), standing by the sofa
         cast.marcus  MARCUS (the plan's 6). STAND-IN until his own body lands (M3, `p51marcus`): the collector, whom the
                      player met only in episode 4 chapter 5's last case (the receiving room), seated on the rattan chair
       (Neither stand-in is admintee, granny or yinkeeper, each of whom Chad has ruled out.) Nobody is a block figure: a body
       is not drawn at all until its model has landed (v21.16). */

    /* ---------------------------------------------------------------- GRANDMASTER PHO'S LAWS, copied from episode 4
       chapter 5 as it shipped (assemble.py pins its sha1): his robe's flecks, his posture numbers, his look D, the dark
       specks painted over his robe's cover (its R33), and chapter 3's numbers for him seated cross-legged */
    /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen
       during gameplay"). WRITTEN BY tools/phoflecks.py from assets/pho.glb (sha1 df95bef025b1958c22e20c8e05493e17b86461a8), never by hand:
       48 islands of skin colour lying inside the white of his robe in his body sheet (4096 x 4096), each on a piece of
       robe the game draws (never a piece of skin: build 21z), each grown by 4 texels, and 1350 patches of the empty
       texels beside the robe that hold skin colour (build 24), as runs [row, first cell, cells] of a 1024 x 1024 mask,
       each in the colour of the robe round it (sRGB).
       c_scast.js lookD paints them once and lays them over his sheet; his file is unchanged. */
    const PHO_FLECKS = { size: 1024, f: [
      [254, 253, 246, [21,156,3,22,155,5,23,155,5,24,156,4,25,156,4,26,156,4,27,156,3]],
      [252, 247, 238, [63,898,3,64,898,3,65,898,3,66,899,1]],
      [254, 253, 243, [74,246,4,75,245,6,76,245,6,77,245,7,78,245,7,79,246,6,80,246,6,81,245,7,82,245,7,83,244,8,84,244,9,85,244,9,86,244,9,87,246,7,88,246,7,89,246,8,90,247,6,91,249,4]],
      [254, 253, 241, [87,243,3,88,243,3,89,243,3,90,243,4,91,244,2]],
      [252, 252, 239, [87,891,2,88,890,3,89,890,4,90,890,4,91,890,4,92,891,2]],
      [254, 252, 243, [92,250,3,93,249,5,94,249,5,95,249,5,96,250,4,97,250,3]],
      [221, 219, 216, [94,750,2,95,748,5,96,747,5,97,746,7,98,745,8,99,745,8,100,745,8,101,744,9,102,745,8,103,746,1,103,751,2]],
      [251, 248, 243, [95,180,3,96,179,4,97,178,6,98,178,7,99,179,7,100,181,4,101,182,2]],
      [239, 237, 228, [105,736,3,106,735,5,106,742,1,107,735,9,108,735,10,109,735,10,110,735,9,111,735,8,112,736,6,113,737,5,114,738,4]],
      [252, 251, 243, [206,149,5,207,149,6,208,148,8,209,147,9,210,146,10,211,146,11,212,147,10,213,149,8,214,149,8,215,149,8,216,150,6,217,151,5,218,152,4,219,153,2]],
      [226, 225, 223, [237,955,2,238,954,4,239,953,5,240,952,6,241,952,6,242,952,6,243,953,5,244,953,5,245,954,2]],
      [223, 219, 217, [288,953,8,289,952,10,290,952,10,291,952,10,292,952,9,293,956,1]],
      [253, 251, 245, [309,335,1,310,334,4,311,334,5,312,333,6,313,333,5,314,333,4,315,334,1]],
      [254, 253, 248, [315,331,3,316,330,4,317,329,5,318,329,5,319,328,6,320,329,3]],
      [238, 236, 232, [350,967,3,351,967,6,352,967,6,353,967,6,354,967,7,355,968,5,356,970,2]],
      [251, 250, 244, [358,84,3,359,81,7,360,80,8,361,80,8,362,80,7,363,80,7,364,80,6,365,81,4]],
      [249, 246, 241, [371,1016,2,372,1016,3,373,1016,2]],
      [254, 251, 246, [410,4,3,411,3,6,412,3,7,413,3,7,414,4,6,415,5,5,416,6,3,417,6,3]],
      [255, 253, 247, [418,6,3,419,5,5,420,5,5,421,5,5,422,5,5,423,6,4,424,7,3,425,8,1]],
      [253, 251, 246, [522,925,5,523,924,7,524,924,6,525,924,5,526,924,5,527,926,1]],
      [253, 251, 246, [530,925,5,531,925,6,532,925,5,533,925,4,534,926,2]],
      [247, 246, 236, [568,922,4,569,922,5,570,921,6,571,922,5,572,922,5,573,918,3,573,922,6,574,917,11,575,918,10,576,918,9,577,918,9,578,918,9,579,918,9,580,918,8,581,917,10,582,917,10,583,917,6,583,924,3,584,917,10,585,917,10,586,917,10,587,918,9,588,918,10,589,920,8,590,920,7,591,919,8,592,919,8,593,920,7,594,920,7,595,920,7,596,920,7,597,920,6,598,920,5,599,921,4,600,920,4,601,920,5,602,920,5,603,921,4,604,922,2]],
      [229, 229, 227, [571,732,1,572,731,3,573,731,3,574,730,4,575,730,4,576,731,2]],
      [241, 237, 234, [594,718,2,595,717,4,596,717,4,597,718,2]],
      [212, 205, 202, [598,282,2,599,281,3,600,282,1]],
      [254, 252, 242, [599,918,3,600,917,3,601,917,3,602,917,3,603,917,3]],
      [254, 253, 245, [605,919,1,606,918,3,607,917,5,608,917,5,609,917,5,610,917,5,611,917,5,612,917,5,613,917,5,614,917,5,615,917,5,616,918,4,617,918,4,618,919,3]],
      [254, 253, 243, [607,922,3,608,922,4,609,922,4,610,922,4,611,922,4,612,922,4,613,922,4,614,922,3,615,922,2]],
      [254, 254, 244, [607,234,3,608,233,5,609,232,6,610,231,6,611,229,7,612,227,8,613,226,9,614,226,7,615,225,7,616,223,7,617,221,8,618,220,9,619,219,10,620,218,11,621,216,12,622,215,12,623,215,11,624,215,9,625,217,5,626,218,4,627,218,3]],
      [231, 227, 225, [610,717,5,611,716,6,612,716,6,613,717,1]],
      [253, 253, 242, [610,252,1,611,251,3,612,246,2,612,250,4,613,245,8,614,245,8,615,245,7,616,245,7,617,244,8,618,244,8,619,244,7,620,244,7,621,244,6,622,244,5,623,243,6,624,242,7,625,242,8,626,242,9,627,242,9,628,242,9,629,242,8,630,242,7,631,243,6,632,247,1]],
      [254, 254, 244, [612,235,1,613,235,2,614,233,4,615,233,3]],
      [253, 252, 243, [615,232,1,616,230,4,617,229,4,618,229,3,619,229,2,620,229,1]],
      [202, 196, 195, [619,266,5,620,266,6,621,266,6,622,265,7,623,264,9,624,263,10,625,261,12,626,260,13,627,260,14,628,259,14,629,260,13,630,261,12,631,262,11,632,261,12,633,262,2]],
      [254, 253, 244, [620,922,3,621,921,4,622,921,9,623,920,10,623,931,3,624,919,16,624,936,2,625,919,20,626,919,20,627,919,20,628,920,18,629,920,14,630,920,12,631,920,12,632,920,12,633,919,12,634,918,12,635,918,11,636,918,9,637,918,6,638,919,5,639,919,5,640,919,4,641,920,3]],
      [249, 249, 239, [626,205,1,626,208,3,627,203,9,628,203,9,629,202,10,630,203,8,631,204,6,632,205,3]],
      [250, 249, 239, [642,913,2,643,912,4,644,911,5,645,911,4,646,912,2]],
      [220, 222, 223, [675,925,2,676,924,4,677,925,3,678,925,2]],
      [236, 235, 233, [689,1006,2,690,1004,5,691,1003,6,692,1003,6,693,1003,6,694,1003,5,695,1006,2]],
      [215, 209, 210, [706,1007,3,707,1006,5,708,1007,3]],
      [207, 200, 204, [708,1006,1,709,1007,2]],
      [232, 235, 228, [886,204,2,887,203,4,888,204,3,889,205,1]],
      [232, 231, 227, [893,375,3,894,375,4,895,376,3,896,376,3,897,376,3]],
      [220, 222, 221, [896,402,1,897,401,3,898,401,3]],
      [233, 232, 230, [918,367,2,919,366,4,920,366,4,921,366,4,922,366,4,923,366,4,924,367,2]],
      [240, 239, 230, [933,391,1,934,390,5,935,388,8,936,388,8,937,388,8,938,387,8,939,385,10,940,384,11,941,384,11,942,385,9,943,385,10,944,385,11,945,385,11,946,385,12,947,385,12,948,386,11,949,385,10,950,385,10,951,385,10,952,385,10,953,385,10,954,385,10,955,385,10,956,385,10,957,385,8,958,386,7,959,387,7,960,387,6,961,391,1]],
      [237, 236, 227, [934,385,4,935,384,4,936,384,4,937,384,4,938,384,3]],
      [253, 251, 247, [956,485,3,957,485,5,958,485,6,959,485,6,960,486,5,961,486,4]],
      [255, 254, 255, [0,93,1,1,93,1]],
      [252, 255, 253, [0,171,2,1,171,2,2,172,2,3,172,2,4,172,2,5,173,1,6,173,1,7,173,1,8,173,1]],
      [255, 255, 253, [0,260,1,1,260,2]],
      [253, 254, 249, [1,246,2,2,245,2,3,245,3,4,246,2,5,246,2,6,246,2,7,246,2,8,246,2]],
      [253, 255, 255, [1,128,1,2,127,2,3,128,1,4,128,1]],
      [253, 255, 255, [1,167,2,2,167,2,3,167,2,4,167,2,5,167,2,6,168,1,7,168,1,8,168,2,9,168,2,10,168,1]],
      [255, 254, 253, [1,328,2,2,328,2,3,327,3,4,327,2,5,327,2,6,327,2,7,327,2,8,327,2,9,327,4,10,327,5]],
      [255, 253, 253, [1,435,1,2,435,1,3,435,1,4,435,2,5,435,2,6,435,3,7,435,3,8,435,2,9,435,3,10,436,2]],
      [255, 254, 249, [1,102,2,2,102,3,3,102,3,4,102,2,5,102,2,6,102,2,7,102,2,8,102,2,9,103,1]],
      [250, 253, 249, [1,12,1]],
      [254, 254, 253, [1,463,1,2,462,2,3,462,3,4,463,2,5,463,2,6,463,2,7,462,3,8,463,2,9,462,2]],
      [246, 244, 244, [2,295,1,3,294,2,4,294,2,5,294,2,6,294,2,7,294,2,8,294,2,9,294,2,10,294,1]],
      [251, 255, 252, [2,421,2,3,421,1]],
      [252, 252, 252, [2,431,1,3,431,1,4,431,2,5,431,2,6,431,2,7,431,2,8,431,2]],
      [251, 251, 251, [2,550,1,3,547,1,3,549,2,4,547,4,5,548,3,6,549,2,7,550,1,8,549,2,9,549,2]],
      [253, 253, 251, [2,612,1,3,612,2,4,612,2,5,612,2,6,612,2,7,612,2,8,612,2,9,612,2,10,611,2]],
      [255, 253, 246, [2,475,1,3,474,2]],
      [254, 254, 253, [2,483,1,3,482,2,4,482,4,5,482,3,6,482,2,7,482,2,8,482,2,9,482,2,10,481,3,11,481,2,12,481,3,13,482,2,14,482,2,15,480,4,16,480,4]],
      [254, 255, 253, [2,530,1,3,530,1,4,529,2,5,529,2,6,529,2,7,529,2,8,529,1]],
      [253, 253, 252, [2,617,2,3,615,4,4,615,5,5,615,2,5,618,2,6,615,5,7,615,5,8,615,2,8,618,2,9,615,6,10,615,4]],
      [255, 254, 254, [3,9,1]],
      [253, 254, 253, [3,372,3,4,372,3,5,372,3,6,372,3,7,372,2,8,372,1]],
      [254, 254, 254, [3,396,2]],
      [255, 255, 252, [3,467,1]],
      [253, 255, 255, [3,52,2,4,52,1,5,52,1]],
      [252, 255, 253, [3,57,2,4,57,1]],
      [254, 253, 252, [3,97,1,4,97,2,5,96,3,6,96,1,6,98,1]],
      [253, 254, 253, [3,290,2,4,290,3,5,290,3,6,290,3,7,290,3,8,290,3,9,290,3,10,289,2]],
      [229, 225, 225, [3,333,2,4,332,3]],
      [255, 255, 254, [3,362,1]],
      [253, 255, 255, [3,393,1]],
      [253, 255, 255, [3,634,1,4,634,1]],
      [253, 255, 255, [3,35,1,4,35,1]],
      [254, 255, 252, [3,112,2,4,112,3,5,112,3,6,112,3,7,112,3,8,111,4,9,111,1]],
      [254, 255, 254, [3,262,2,4,262,2,5,262,2,6,262,2,7,262,2,8,262,2,9,262,2,10,259,4]],
      [198, 198, 192, [3,411,1,4,411,1,5,411,1,6,410,2,7,410,2,8,410,2]],
      [254, 254, 254, [3,145,1,4,143,3,5,143,2,6,143,2,7,143,2,8,143,3,9,144,1]],
      [252, 252, 251, [3,182,1,4,182,2,5,182,3,6,183,2,7,183,2,8,183,2,9,183,2]],
      [250, 252, 248, [3,287,1,4,286,2]],
      [252, 255, 254, [3,323,1,4,323,3,5,324,2,6,324,3,7,325,2,8,325,2,9,325,2,10,324,2]],
      [255, 255, 255, [3,445,2,4,445,1]],
      [253, 255, 255, [3,505,1,4,505,1,5,505,1]],
      [252, 255, 254, [3,591,1,4,591,1]],
      [255, 252, 248, [3,780,1,4,780,3,5,780,3,6,781,2,7,781,1,8,780,2,9,781,1]],
      [251, 254, 254, [3,821,1,4,820,2,5,820,2,6,820,2,7,820,2,8,820,2,9,820,2]],
      [254, 254, 249, [3,969,1,4,967,5,5,967,5,6,967,2,6,970,2,7,967,2,7,970,2,8,967,2,8,970,2,9,967,2]],
      [251, 253, 253, [4,135,2,5,136,2,6,136,2]],
      [255, 255, 254, [4,219,1,5,218,2,6,218,2,7,218,2,8,218,2]],
      [214, 213, 217, [4,309,3,5,310,3,6,311,2,7,311,2,8,310,3,9,305,1,9,307,5,10,305,6]],
      [255, 255, 255, [4,345,1]],
      [218, 214, 214, [4,478,3,5,479,2,6,480,1]],
      [255, 254, 252, [4,526,2,5,526,2,6,526,2,7,526,2,8,526,2,9,526,3,10,526,3]],
      [255, 255, 255, [4,761,1]],
      [253, 255, 255, [4,866,1,5,867,1]],
      [252, 255, 252, [4,1008,2,5,1008,1]],
      [255, 255, 255, [4,19,1,5,19,1]],
      [254, 255, 253, [4,252,1,5,252,2,6,252,2,7,252,2,8,252,2,9,252,2]],
      [254, 254, 244, [4,401,2,5,401,2,6,401,3,7,402,2]],
      [233, 234, 230, [4,414,2,5,414,3,6,414,3,7,414,3,8,415,2,9,415,2,10,416,1]],
      [255, 254, 251, [4,514,2,5,514,2,6,514,2,7,513,3,8,513,3,9,513,3,10,514,2]],
      [253, 255, 253, [4,534,1,5,533,1]],
      [254, 254, 251, [4,539,2,5,539,2,6,539,3,7,539,4,8,539,4,9,540,1,9,542,1]],
      [255, 255, 255, [4,569,1]],
      [255, 255, 255, [4,607,1]],
      [255, 255, 255, [4,624,1,5,624,1]],
      [248, 253, 252, [4,700,1]],
      [255, 255, 255, [4,749,1]],
      [209, 207, 205, [4,769,4,5,769,3,6,771,1]],
      [251, 254, 247, [4,979,1,5,978,2,6,978,1]],
      [255, 254, 251, [4,991,3,5,992,2,6,992,2,7,992,2,8,992,2,9,989,5,10,989,4,11,989,2,12,989,2]],
      [254, 255, 251, [4,1013,1,5,1013,2,6,1013,4,7,1013,4,8,1015,4,9,1015,5]],
      [253, 254, 250, [4,14,3,5,14,3,6,14,3,7,14,3,8,14,2,9,14,2]],
      [254, 255, 254, [4,681,1,5,680,3,6,680,2,7,680,2,8,680,2]],
      [255, 255, 253, [4,805,1,5,805,3,6,805,3,7,805,3,8,805,3,9,806,1]],
      [253, 255, 255, [4,813,2,5,813,2,6,813,1,7,813,1,8,813,1]],
      [255, 254, 254, [4,832,1,5,832,2,6,832,2,7,832,2,8,830,4,9,830,4,10,832,2]],
      [253, 254, 253, [4,895,2,5,895,2,6,895,2,7,895,2,8,895,2]],
      [252, 254, 254, [4,929,3,5,929,3,6,930,1]],
      [255, 255, 252, [4,84,1,5,83,2]],
      [254, 254, 253, [4,658,1,5,658,2,6,657,3,7,659,1,8,659,1,9,659,3,10,659,3,11,660,2,12,660,2,13,660,3,14,660,3,15,661,4,16,662,3,17,663,2,18,663,2,19,663,2,20,663,2,21,663,2,22,663,2,23,663,2]],
      [241, 241, 241, [4,836,1,5,836,1]],
      [254, 254, 252, [4,925,1,5,924,2,6,924,2,7,925,1,8,924,2,9,924,4,10,925,3]],
      [253, 255, 253, [4,946,1,5,946,1]],
      [245, 235, 243, [5,517,2]],
      [254, 255, 253, [5,795,2,6,795,2,7,795,2,8,795,2,9,795,4,10,795,6,11,795,2,11,799,3,12,795,2,12,799,3,13,795,3,13,799,3,14,796,2,14,799,2,15,796,5,16,796,4]],
      [239, 238, 241, [5,879,2,6,879,2]],
      [254, 254, 254, [5,917,2,6,918,1,7,918,1,8,918,1]],
      [255, 255, 254, [5,982,2,6,982,2,7,983,1]],
      [254, 254, 254, [5,668,1]],
      [254, 255, 254, [5,710,2,6,709,3,7,709,3,8,710,2,9,710,2,10,710,2]],
      [255, 255, 255, [5,849,1]],
      [254, 254, 250, [5,883,2,6,883,2,7,883,2,8,883,2,9,883,3,10,884,2,11,883,3,12,884,2,13,883,3,14,883,3,15,883,2,16,883,3,17,883,3,18,884,2,19,884,2]],
      [248, 250, 249, [5,889,2,6,889,2]],
      [255, 255, 255, [5,622,1]],
      [253, 255, 254, [5,800,2,6,800,2,7,800,2,8,800,2,9,800,2]],
      [252, 253, 253, [5,823,2,6,823,2,7,823,2,8,823,2,9,823,3,10,823,2]],
      [254, 253, 252, [5,951,1,6,950,2,7,951,2,8,951,1]],
      [253, 255, 255, [5,965,1,6,965,1]],
      [255, 252, 250, [5,999,1]],
      [254, 255, 248, [6,976,1]],
      [255, 254, 254, [6,988,2,7,989,1,8,987,3,9,987,2]],
      [255, 255, 255, [6,830,1,7,830,1]],
      [252, 254, 254, [6,942,2,7,942,2]],
      [179, 169, 170, [6,197,1,7,197,2,8,197,1,9,197,2,10,197,2]],
      [255, 255, 255, [6,596,1,7,596,1]],
      [253, 252, 251, [6,357,1,7,356,3,8,356,3]],
      [253, 253, 253, [6,953,2,7,953,2,8,953,2]],
      [255, 255, 254, [7,500,2,8,500,2,9,500,2,10,501,1]],
      [255, 254, 251, [7,622,1]],
      [254, 254, 254, [7,667,3,8,667,3,9,667,4,10,668,1,11,668,1]],
      [254, 254, 252, [7,418,1,8,418,2,9,418,2,10,418,2]],
      [253, 255, 253, [7,83,2,8,82,3,9,82,1]],
      [199, 191, 183, [7,272,1,8,270,3,9,269,4,10,269,2]],
      [171, 167, 164, [7,467,1]],
      [251, 255, 250, [8,625,2]],
      [253, 254, 253, [8,771,1]],
      [253, 255, 255, [8,964,2]],
      [252, 254, 250, [8,4,1,9,3,2]],
      [252, 255, 254, [8,685,2,9,685,2,10,686,1]],
      [238, 241, 240, [8,835,1]],
      [242, 242, 241, [8,859,1,9,859,1]],
      [253, 254, 253, [8,8,2,9,6,4,10,6,4,11,6,3,12,6,6,13,6,1,13,8,3]],
      [255, 255, 253, [8,318,2,9,319,1]],
      [254, 255, 254, [8,596,2,9,597,2,10,597,2]],
      [255, 255, 254, [9,951,2]],
      [237, 233, 230, [8,478,1,9,477,2]],
      [254, 255, 252, [9,675,7,10,674,8]],
      [255, 255, 253, [9,65,5,10,65,5]],
      [252, 252, 252, [9,212,2,10,212,2]],
      [252, 255, 255, [9,635,2,10,635,2]],
      [226, 227, 229, [9,742,1,10,742,1]],
      [252, 250, 248, [9,749,1]],
      [243, 238, 235, [9,25,3,10,24,4]],
      [253, 255, 255, [9,43,1,10,43,2]],
      [255, 254, 253, [9,141,2,10,141,3]],
      [254, 255, 255, [9,313,4,10,311,5]],
      [255, 255, 253, [9,563,1,10,563,1]],
      [254, 254, 251, [9,580,2,10,580,2]],
      [255, 253, 254, [9,639,3,10,639,3]],
      [252, 255, 255, [9,647,2,10,647,2]],
      [253, 254, 254, [9,703,3,9,707,1,10,703,6,11,707,2,12,707,2,13,707,2,14,707,2,15,707,2,16,707,2,17,707,2,18,707,2,19,707,2,20,708,2,21,708,2,22,708,2]],
      [249, 248, 247, [9,898,5,10,898,6]],
      [255, 255, 255, [9,1013,2,10,1013,1]],
      [248, 248, 248, [9,87,4,10,87,4]],
      [254, 254, 252, [9,139,2,10,139,2]],
      [253, 255, 255, [9,151,2,10,151,3]],
      [254, 255, 253, [9,224,2,10,224,3,11,225,2,12,225,2,13,225,2,14,225,2,15,225,2,16,225,2,17,226,1,18,226,1,19,226,1,20,226,1,21,226,1,22,226,1]],
      [253, 255, 255, [9,346,1]],
      [252, 255, 255, [9,367,1]],
      [253, 255, 253, [9,503,2,10,503,2,10,508,1,11,503,2,11,507,2,12,504,2,12,507,2,13,504,2,13,507,2,14,504,5,15,505,4,16,507,2]],
      [254, 253, 255, [9,590,1,10,590,1]],
      [252, 255, 253, [9,914,2,10,913,3]],
      [254, 254, 252, [9,948,2,10,947,3]],
      [252, 254, 255, [9,12,1,10,12,1]],
      [254, 255, 254, [9,36,2,10,36,3,11,38,1,12,37,2,13,37,2,14,37,2,15,37,2,16,37,1,17,37,1]],
      [253, 255, 255, [9,45,1,10,45,1]],
      [254, 254, 254, [9,54,1]],
      [255, 255, 255, [9,99,1,10,99,4]],
      [254, 254, 252, [9,109,2]],
      [255, 253, 255, [9,115,1,10,115,1]],
      [255, 255, 255, [9,301,1]],
      [255, 255, 255, [9,317,1,10,316,1]],
      [198, 198, 200, [9,443,1]],
      [254, 254, 252, [9,481,1]],
      [255, 255, 253, [9,485,1]],
      [255, 255, 251, [9,559,1,10,559,1]],
      [254, 255, 253, [9,567,2,10,567,2,11,567,2,12,567,2,13,567,2,14,567,3,15,567,3,16,567,3,17,569,1]],
      [253, 255, 253, [9,701,1,10,698,4]],
      [255, 254, 253, [9,729,1,10,724,2,10,728,2,11,724,2,11,728,2,12,723,3,12,728,2,13,723,3,13,728,2,14,723,3,14,728,2,15,724,6,16,725,3]],
      [255, 253, 254, [9,759,2]],
      [253, 255, 254, [9,776,3,10,774,5]],
      [253, 255, 255, [9,792,1]],
      [253, 255, 252, [9,880,1,10,879,2,11,879,1]],
      [255, 255, 255, [9,922,1,10,921,2]],
      [253, 254, 254, [9,964,1,10,963,2,11,963,3,12,964,2,13,964,3,14,965,2]],
      [254, 254, 255, [9,999,1,10,999,1]],
      [246, 246, 234, [10,30,1]],
      [252, 249, 240, [10,33,1,11,33,2]],
      [255, 255, 255, [10,103,1]],
      [242, 243, 242, [10,180,5,11,182,2,12,182,2,13,182,2,14,182,1,15,182,1,16,182,1,17,182,1]],
      [251, 254, 250, [10,188,2]],
      [255, 255, 255, [10,240,1]],
      [255, 255, 252, [10,420,1]],
      [255, 255, 253, [10,424,1]],
      [255, 255, 253, [10,426,1]],
      [254, 254, 254, [10,571,3]],
      [255, 254, 253, [10,592,2,11,592,2,12,592,2,13,592,2,14,591,3,15,590,3,16,590,2,17,589,1]],
      [255, 255, 253, [10,621,1]],
      [252, 252, 249, [10,642,3,11,642,2,12,641,3,13,641,2,14,642,1]],
      [253, 255, 253, [10,657,2,11,657,3,12,658,2,13,658,2,14,658,2,15,658,2,16,658,2,17,658,2,18,658,2,19,658,2,20,658,2,21,658,3,22,659,2]],
      [250, 250, 251, [10,730,2,11,730,2,12,730,2,13,731,2,14,731,1]],
      [255, 253, 254, [10,759,1]],
      [255, 255, 255, [10,773,1]],
      [254, 254, 254, [10,875,1]],
      [252, 255, 254, [10,1004,6]],
      [255, 255, 253, [10,62,1]],
      [253, 255, 255, [10,104,2]],
      [249, 253, 253, [10,165,2,11,165,2,12,165,2,13,165,1]],
      [255, 255, 253, [10,387,1]],
      [255, 255, 253, [10,551,1]],
      [255, 255, 254, [10,565,1]],
      [252, 251, 254, [10,631,1]],
      [251, 253, 255, [10,720,1]],
      [254, 255, 250, [10,757,1]],
      [253, 246, 246, [10,783,1]],
      [255, 255, 253, [10,788,1]],
      [252, 255, 252, [10,841,2]],
      [251, 255, 254, [10,851,1]],
      [246, 246, 246, [10,888,5]],
      [253, 255, 253, [10,912,1]],
      [255, 255, 255, [10,958,1]],
      [255, 255, 254, [10,976,4,11,976,1,12,975,3,13,976,2,14,976,2,15,976,2,16,975,3,17,975,2]],
      [253, 255, 255, [10,985,1]],
      [255, 254, 255, [10,986,1]],
      [253, 255, 253, [10,11,1]],
      [253, 255, 255, [10,178,1]],
      [254, 255, 253, [11,310,1,12,309,2,13,309,2,14,309,2,15,310,1,16,310,2,17,310,2,18,310,2,19,310,2,20,310,2,21,310,2,22,310,2,23,311,2,24,311,4,25,312,3]],
      [253, 255, 254, [10,451,1,11,450,2,12,450,2,13,450,2,14,451,1,15,450,2,16,450,2,17,450,2,18,450,2,19,450,2,20,451,1]],
      [255, 255, 255, [10,538,1]],
      [252, 255, 253, [10,564,1]],
      [255, 253, 254, [10,758,1]],
      [254, 255, 253, [10,825,4,11,825,2,11,828,2,12,825,2,12,828,3,13,825,2,13,829,2,14,825,2,14,829,2,15,825,2,15,829,2,16,825,2,16,829,2,17,825,2,17,828,3,18,825,2,18,828,2,19,825,2]],
      [255, 255, 255, [10,886,2]],
      [253, 255, 254, [11,979,2,12,979,2,13,978,3,14,978,2,15,978,3,16,979,2,17,979,2,18,979,1]],
      [253, 255, 255, [10,984,1]],
      [253, 255, 255, [10,179,1]],
      [251, 255, 255, [10,204,2]],
      [252, 255, 254, [10,337,1,11,337,1]],
      [255, 255, 255, [10,493,1]],
      [253, 255, 253, [10,519,1]],
      [255, 255, 254, [11,864,1]],
      [253, 255, 255, [11,49,1]],
      [252, 255, 255, [11,62,1]],
      [255, 252, 249, [11,65,4,12,65,4,13,67,3,14,68,2]],
      [255, 255, 253, [11,255,1]],
      [253, 254, 254, [11,179,1,12,179,1,13,179,1,14,179,1,15,178,2,16,178,2,17,178,2,18,178,2,19,178,2,20,178,2,21,178,2,21,182,2,22,178,2,22,182,2,23,178,2,23,182,2,24,179,5,25,180,4,26,181,3,27,183,1]],
      [255, 255, 255, [11,486,1,12,486,1]],
      [252, 255, 254, [11,553,1,12,553,2,13,553,2,14,553,2,15,553,2,16,553,5,17,553,6,18,557,1]],
      [247, 243, 232, [11,26,1,12,25,2,13,25,3,14,25,2,15,25,3,16,26,2]],
      [255, 254, 255, [11,608,1]],
      [252, 255, 253, [11,669,1]],
      [200, 201, 196, [11,860,1]],
      [255, 254, 253, [12,149,2,13,149,3,14,149,3,15,150,2,16,150,1]],
      [254, 252, 251, [12,681,3,13,680,4,14,680,3,15,680,1]],
      [253, 255, 254, [12,945,2,13,946,1,14,946,1,15,945,2,16,945,2,17,945,2,18,945,2,19,945,3,20,946,3,21,947,3]],
      [253, 255, 255, [12,48,1]],
      [255, 254, 255, [12,61,1]],
      [252, 254, 255, [12,125,1]],
      [193, 196, 188, [12,425,1]],
      [252, 254, 255, [12,492,1]],
      [254, 255, 254, [12,206,1,13,205,2,14,205,2,15,205,2,16,205,2,17,205,2,18,205,2,19,205,2,20,205,2,21,205,2,22,205,2,23,205,2,24,204,3,25,204,4,26,205,8,27,207,2,27,211,2,28,211,2,29,212,1,30,212,1,31,212,1,32,212,1,33,212,1,34,212,1,35,212,1,36,212,1,37,212,1,38,212,1,39,212,1]],
      [217, 218, 220, [12,703,2,13,702,4,14,704,3,15,705,2,16,704,3,17,705,2,18,705,2,19,705,1]],
      [252, 255, 254, [12,879,1]],
      [252, 254, 252, [13,425,2,14,425,2,15,425,2,16,425,1,17,424,2,18,424,2,19,424,2,20,423,3,21,423,2,22,423,3,23,424,2,24,425,2,25,426,1]],
      [254, 254, 251, [12,436,2,13,436,2,14,436,2,15,435,3,16,435,3,17,435,3,18,436,2,19,436,2,20,436,2,21,434,4,22,434,4,23,433,3,24,433,2]],
      [254, 255, 253, [12,913,4,12,918,2,13,913,10,14,914,4,14,920,3,15,921,2,16,921,2,17,921,2,18,920,3,19,920,2,20,920,2,21,920,2,22,920,2,23,920,2,24,920,2,25,920,3,26,921,2,27,921,2,28,921,2,29,921,2,30,920,3,31,920,2,32,920,3,33,920,2,34,919,3,35,919,2,36,918,2]],
      [255, 255, 253, [13,81,1]],
      [253, 247, 228, [13,34,2,14,34,2]],
      [248, 249, 247, [13,430,2,14,430,4,15,430,5,16,430,3,17,431,2,18,431,1,19,431,1,20,431,1,21,431,2,22,431,2,23,431,2]],
      [252, 255, 254, [13,879,1]],
      [255, 255, 255, [13,959,1]],
      [252, 253, 251, [13,155,1,14,154,2,15,154,2,16,154,2,17,154,2,18,154,2,19,154,2,20,153,3,21,153,2,22,153,2,23,153,2,24,153,3,25,153,3,26,154,2,27,155,1]],
      [253, 255, 255, [13,366,1]],
      [229, 228, 227, [13,717,2,14,717,2]],
      [255, 255, 254, [14,111,2,15,110,3,16,110,2,17,110,2,18,110,2,19,110,2,20,110,2,21,109,3]],
      [255, 255, 255, [14,693,1]],
      [139, 138, 143, [14,186,1]],
      [254, 255, 253, [14,457,3,15,458,2,16,457,3,17,457,3,18,456,3,19,455,3,20,454,3]],
      [254, 254, 254, [14,126,2,15,127,1]],
      [254, 255, 252, [14,367,1]],
      [253, 255, 254, [14,614,2,15,614,3,16,613,3,17,614,2,18,614,1,19,614,1,20,614,2,21,614,2,22,614,2,23,614,3,24,614,3,25,614,2,26,614,2,27,614,2,28,614,2,29,614,2,30,614,2,31,614,2,32,614,2,33,614,1,34,614,1,35,614,1,36,614,1,37,614,1,38,614,1,39,614,1,40,614,2,41,614,2,42,614,2,43,614,2,44,614,2,45,614,2,46,614,1,47,614,1,48,614,1,49,614,1,50,614,1,51,614,2,52,615,1,53,615,1,54,615,1]],
      [253, 255, 255, [14,331,1,15,330,2,16,329,3,17,329,1]],
      [212, 206, 203, [14,782,1,15,780,3,16,781,1]],
      [253, 253, 249, [15,18,1]],
      [253, 255, 255, [15,250,1]],
      [255, 254, 253, [15,279,4,16,278,5,17,277,4,18,277,2]],
      [244, 241, 234, [15,75,2]],
      [254, 254, 252, [15,85,2,16,85,2,17,85,2,18,85,2,19,85,2,20,85,2,21,86,2,22,85,3,23,85,3,24,85,3,25,85,3,26,85,3,27,85,3,28,85,3,29,85,2,30,85,2,31,85,1,32,85,1,33,85,1,34,84,2,35,84,1,36,84,1]],
      [255, 255, 253, [15,183,1]],
      [255, 255, 254, [15,380,3,16,378,5,17,378,2,18,378,2,19,378,2,20,378,2,21,378,5,22,378,6,23,379,1,23,382,2,24,382,2]],
      [253, 255, 255, [15,909,1]],
      [252, 255, 252, [15,753,1]],
      [255, 253, 255, [15,908,1]],
      [255, 255, 255, [16,317,2,17,317,1]],
      [248, 253, 252, [16,472,1]],
      [253, 255, 253, [16,1015,2]],
      [246, 250, 253, [16,473,2,17,473,2]],
      [255, 255, 255, [16,693,1]],
      [251, 249, 247, [16,731,2,17,730,3,18,731,2]],
      [254, 252, 249, [16,757,3,16,761,4,17,757,8,18,757,2,18,760,5,19,756,3,19,764,1,20,756,2,20,764,1,21,756,2,21,764,1,22,756,1]],
      [255, 255, 255, [16,1006,3]],
      [252, 254, 252, [16,384,2,17,384,3,18,384,3,19,384,3,20,384,2,21,384,2,22,384,2,23,384,2]],
      [253, 255, 255, [16,574,1,17,573,1]],
      [255, 255, 253, [17,33,1]],
      [255, 255, 255, [17,807,1]],
      [252, 255, 254, [17,241,2]],
      [254, 255, 254, [17,258,5,18,257,7,19,257,1,19,263,1]],
      [253, 255, 255, [17,337,2,18,338,1]],
      [253, 255, 255, [17,570,1]],
      [253, 255, 253, [17,769,1]],
      [253, 254, 252, [17,838,3,18,838,2,19,837,3,20,837,3,21,838,2,22,838,2,23,838,3,24,838,3,25,838,2,26,838,2,27,838,2,28,838,1,29,838,1,30,838,1,31,838,2,32,839,1]],
      [253, 255, 255, [17,69,1,18,70,1]],
      [253, 255, 255, [17,236,1]],
      [253, 255, 255, [17,326,1]],
      [253, 255, 255, [17,571,1]],
      [253, 255, 255, [17,621,1]],
      [255, 255, 255, [17,833,2,18,833,2,19,833,2,20,833,1]],
      [253, 255, 253, [17,240,1]],
      [253, 254, 254, [17,252,2,18,250,4,19,251,2,20,251,1,21,251,1,22,251,2,23,251,2,24,252,2,25,252,2,26,252,2,27,252,2,28,252,2,29,252,2,30,252,2,31,252,2,32,252,2,33,252,2,34,252,2,35,253,1,36,253,1]],
      [254, 255, 254, [17,285,1,18,285,2,19,285,2,20,285,2,21,285,2,22,285,2,23,285,2,24,285,2,25,285,2,26,285,2,27,284,3,28,284,2,29,284,2,30,284,2,31,283,2,32,283,2,33,283,1]],
      [252, 255, 254, [17,477,1,18,477,1]],
      [248, 251, 248, [18,339,1]],
      [253, 255, 255, [18,420,1,19,420,1]],
      [253, 254, 254, [18,603,2,18,606,2,19,603,5,20,602,5,21,602,2,22,603,2,23,603,2,24,603,2,25,603,2,26,603,2,27,603,2,28,603,2,29,603,2,30,603,2,31,603,2,32,603,4,33,603,5,34,606,2,35,606,2,36,606,3,37,607,2,38,607,2,39,607,2,40,607,2,41,607,2,42,607,2,43,607,2,44,607,2,45,608,1,46,607,2,47,607,2,48,607,2,49,608,1,50,607,2,51,608,1,52,608,1,53,608,1,54,608,1,55,608,1]],
      [255, 255, 251, [18,801,1]],
      [255, 254, 255, [18,474,3,19,474,1]],
      [253, 255, 254, [18,927,1,19,927,1,20,926,2,21,926,1,22,926,1,23,925,2,24,925,2,25,926,2,26,926,2,27,926,2,28,926,1,29,926,1,30,926,2,31,926,1,32,926,1,33,926,2,34,926,2,35,926,2,36,926,2,37,926,1]],
      [255, 255, 253, [18,928,1]],
      [252, 255, 254, [18,907,1,19,907,1,20,907,2,21,907,2,22,907,1,23,907,2,24,907,2,25,907,2]],
      [255, 255, 253, [19,53,2,20,53,3]],
      [252, 251, 248, [19,188,2,20,188,2,21,188,2,22,188,2,23,188,2,24,188,3,25,187,3,26,186,3]],
      [242, 233, 228, [19,525,1]],
      [251, 252, 245, [19,730,2,20,729,2,21,729,1]],
      [253, 255, 255, [19,801,1]],
      [254, 254, 253, [19,941,2,20,939,5,21,938,6,22,942,2,23,943,2,24,944,1]],
      [253, 255, 255, [20,48,1,21,48,1,22,48,2,23,48,2]],
      [255, 254, 255, [20,474,1]],
      [246, 247, 248, [20,717,2,21,717,2,22,716,3,23,716,2,24,717,2,25,717,2,26,717,2,27,717,2,28,718,1]],
      [252, 255, 255, [20,973,1]],
      [254, 255, 255, [20,61,1]],
      [254, 255, 254, [20,290,2,21,289,3,22,289,2,23,289,2,24,289,2,25,289,2,26,289,2,27,289,2,28,288,3,29,288,3,30,288,3,31,289,2,32,289,2,33,289,2,34,289,2,35,289,2,36,289,2]],
      [255, 255, 250, [20,107,1]],
      [255, 255, 255, [20,950,1]],
      [254, 254, 253, [20,101,1,21,101,2,22,101,2,23,101,3,24,102,2,25,102,2,26,103,1,27,103,1,28,103,1]],
      [254, 254, 252, [20,106,1]],
      [253, 255, 255, [20,518,1,21,518,1]],
      [253, 255, 255, [21,121,1]],
      [252, 254, 249, [21,1016,1,22,1015,2,23,1015,2]],
      [253, 255, 255, [21,420,1]],
      [192, 189, 186, [21,734,1,22,733,2]],
      [254, 255, 252, [21,295,1,22,295,1,23,295,1,24,295,1,25,295,1,26,295,1,27,295,1,28,295,1,29,294,2,30,294,2,31,294,2,32,294,2,33,294,1,34,294,1,35,293,2,36,293,2,37,294,2]],
      [253, 255, 255, [22,764,1]],
      [239, 237, 236, [21,863,1,22,862,2]],
      [247, 247, 247, [22,343,1]],
      [253, 255, 255, [22,728,1]],
      [254, 255, 253, [22,771,1,23,771,2,24,771,2,25,771,2,26,771,2,27,771,3,28,772,2,29,771,3,30,771,3,31,771,3,32,771,3,33,771,3,34,771,3,35,771,3,36,771,3,37,771,3,38,771,3,39,771,2,40,771,2,41,771,2,42,771,2,43,771,2,44,771,2,45,771,1,46,771,1,47,770,2,48,770,1,49,770,1,50,770,1]],
      [253, 255, 255, [22,420,1]],
      [255, 255, 255, [22,221,2,23,221,2,24,221,3,25,221,2,26,221,2,27,221,2,28,221,1,29,221,1,30,220,2,31,221,2,32,221,2,33,221,2,34,221,2,35,221,2,36,221,2,37,222,1]],
      [254, 254, 253, [22,890,2,23,891,2,24,891,2,25,891,2,26,891,2,27,891,2,28,891,2,29,891,2,30,892,1,31,892,1,32,891,2,33,890,3,34,891,2,35,891,2,36,891,2,37,891,2,38,892,2,39,892,2,40,892,1,41,892,1,42,892,1]],
      [255, 255, 255, [22,257,1,23,257,2,24,258,2,25,258,2,26,258,3,27,259,2,28,260,1]],
      [255, 254, 255, [22,473,1]],
      [253, 255, 254, [23,198,2,24,198,2]],
      [254, 255, 254, [23,879,1]],
      [255, 255, 255, [23,132,2,24,132,2,25,132,2,26,132,2,27,132,2,28,132,2,29,133,1,30,133,1,31,133,1]],
      [252, 248, 250, [23,525,1,24,524,2]],
      [188, 185, 184, [23,343,2,24,343,2,25,343,2]],
      [255, 254, 255, [23,474,1]],
      [255, 255, 255, [23,833,1,24,833,2,25,833,2,26,833,2,27,832,3,28,832,2,29,832,2,30,832,2,31,833,1,32,833,2,33,833,3,34,834,3,35,835,3]],
      [255, 255, 255, [24,109,1]],
      [253, 255, 255, [24,48,1]],
      [254, 255, 255, [25,109,1,26,109,2,27,110,2,28,110,2,29,110,2,30,110,2,31,110,2,32,110,2,33,110,2,34,110,2,35,110,2,36,110,1]],
      [254, 255, 255, [24,217,2,25,217,2,26,217,2,27,216,3,28,216,3,29,216,2,30,216,2,31,216,2,32,216,2,33,216,2,34,216,2,35,217,1,36,217,1,37,217,1,38,217,1]],
      [253, 255, 253, [24,675,1,25,675,1]],
      [254, 255, 254, [24,935,1,25,934,2,26,934,2,27,935,2,28,935,2,29,935,2,30,935,2,31,935,2,32,935,2,33,936,1,34,935,2,35,935,2]],
      [253, 254, 251, [24,421,2,25,420,5,26,420,7]],
      [253, 255, 254, [24,856,2,25,854,4]],
      [253, 255, 255, [24,879,1]],
      [253, 255, 254, [25,529,4,26,528,6,27,528,2,28,528,2,29,528,2,30,528,1,31,528,2,32,528,3,33,528,3,34,529,3,35,530,2,36,531,1]],
      [194, 185, 181, [25,166,1,26,166,1]],
      [255, 254, 255, [25,858,1]],
      [253, 255, 255, [26,199,1]],
      [255, 254, 255, [26,859,1]],
      [253, 254, 253, [26,359,3,27,358,5,27,365,2,28,356,4,28,361,6,29,356,3,29,362,4,30,356,2,31,356,2,32,356,2,33,356,2,34,356,2,35,357,1,36,357,1,37,357,1,38,357,1,39,357,1]],
      [253, 255, 254, [26,688,1,27,687,3]],
      [253, 255, 255, [26,694,1]],
      [251, 255, 254, [27,185,1]],
      [253, 255, 255, [27,727,1,28,727,1,29,726,2,30,726,2,31,727,1,32,727,1,33,726,2,34,726,2,35,726,2,36,726,2]],
      [253, 255, 255, [27,447,1]],
      [252, 255, 252, [27,810,1,28,809,1]],
      [253, 254, 251, [27,56,1,28,56,1,29,56,1,30,55,2,31,55,2,32,55,2,33,55,3,34,57,2]],
      [255, 254, 255, [27,982,1]],
      [253, 255, 255, [27,879,1,28,879,1]],
      [253, 255, 255, [27,988,1]],
      [255, 255, 253, [28,199,1,29,199,1]],
      [253, 255, 255, [28,539,1]],
      [255, 255, 254, [28,808,1]],
      [254, 254, 254, [28,117,2,29,116,2,30,115,3,31,115,2,32,115,2,33,115,3,34,116,1,35,116,2,36,116,2,37,116,2,38,116,2,39,116,2,40,116,2,41,116,2,42,114,4,43,114,2]],
      [253, 255, 255, [28,988,1]],
      [253, 255, 255, [29,539,1]],
      [252, 255, 255, [29,818,1]],
      [253, 255, 255, [29,989,1]],
      [253, 255, 254, [29,121,1,30,119,3,31,120,1]],
      [253, 255, 253, [29,368,1,30,368,1,31,367,2,32,367,2,33,367,2,34,366,3,35,366,2,36,366,2,37,367,1,38,366,2,39,366,2,40,366,2]],
      [255, 255, 255, [29,200,1,30,200,1]],
      [254, 254, 252, [29,520,1,30,520,2,31,520,2,32,520,2,33,519,3,34,520,2,35,520,2,36,520,2,37,520,2,38,519,3,39,519,3,40,520,2,41,520,2,42,519,3,43,519,3,44,519,3,45,519,2,46,519,1,47,519,1,48,518,2,49,518,1,50,518,1]],
      [253, 254, 254, [29,578,4,30,577,1,30,579,5,31,580,5,32,584,1,33,584,1,34,584,1,35,584,1,36,584,1,37,583,2,38,583,2,39,584,1,40,584,1,41,584,1,42,584,2,43,585,1,44,585,1,45,585,1,46,585,1]],
      [253, 255, 255, [29,982,1,30,982,1]],
      [255, 255, 254, [30,183,1,31,183,2,32,183,2,33,183,2,34,183,2,35,183,2,36,183,2,37,183,2,38,183,2,39,183,2,40,183,2,41,183,2,42,183,2,43,183,2,44,183,2,45,183,2,46,183,2,47,184,1,48,184,1,49,184,1]],
      [254, 255, 254, [30,539,1,31,539,2,32,540,1,33,539,2,34,539,2,35,539,2,36,539,2,37,539,2,38,539,2,39,539,2,40,538,3,41,538,3,41,544,7,41,556,1,42,538,3,42,542,16,43,538,2,43,542,1,43,544,1,43,551,8,44,538,2,44,541,2,44,557,2,45,538,5,46,538,5,47,539,4,48,541,1]],
      [169, 157, 157, [30,1009,2]],
      [255, 255, 255, [30,787,1,31,787,1]],
      [252, 255, 255, [30,983,1]],
      [255, 255, 253, [31,576,1]],
      [255, 255, 255, [31,200,1,32,200,2,33,200,2]],
      [253, 255, 255, [31,562,1,32,562,1,33,562,1,34,562,1,35,562,1,36,562,1,37,562,1]],
      [254, 255, 254, [31,575,1]],
      [250, 248, 228, [31,849,1,32,849,1]],
      [255, 255, 255, [31,983,1,32,984,1]],
      [254, 254, 254, [33,48,1,34,48,1,35,48,1,36,48,2,37,48,2,38,48,2,39,49,4,40,49,8,41,52,4]],
      [255, 255, 253, [33,1011,1]],
      [253, 255, 255, [33,996,1,34,995,2]],
      [254, 255, 253, [34,91,6,35,90,9,36,90,2,36,97,2,37,98,2]],
      [253, 255, 255, [34,846,1,35,846,1]],
      [254, 249, 242, [34,1014,3,35,1014,3,36,1015,2]],
      [253, 255, 255, [34,879,1,35,879,1]],
      [254, 255, 255, [35,137,3,36,136,5,37,135,2,37,139,3,38,134,3,38,140,3,39,134,2,40,134,2,41,135,1,42,136,1]],
      [255, 255, 255, [36,572,1,37,572,1,38,571,2,39,571,1,40,571,1,41,571,1,42,571,1,43,571,1,44,571,1,45,571,1]],
      [255, 255, 255, [36,935,1]],
      [253, 252, 250, [36,86,3,37,85,2]],
      [254, 255, 251, [36,225,3,37,224,4,38,224,4]],
      [253, 255, 255, [36,879,1,37,879,1]],
      [252, 254, 254, [36,920,3,37,919,5,38,922,3,39,924,1]],
      [255, 255, 255, [36,69,1]],
      [255, 255, 253, [36,820,1]],
      [195, 191, 190, [37,995,1]],
      [252, 255, 255, [37,78,1]],
      [252, 255, 254, [37,757,1]],
      [255, 255, 255, [37,888,1]],
      [255, 255, 255, [37,820,1,38,820,1]],
      [253, 255, 255, [38,418,1]],
      [254, 255, 255, [38,789,1,39,789,1,40,789,1,41,789,1,42,789,1,43,789,1,44,789,1]],
      [253, 255, 255, [38,757,1]],
      [255, 255, 254, [38,1014,3,39,1014,3,40,1014,1]],
      [255, 255, 255, [38,888,1,39,888,1]],
      [255, 248, 234, [38,980,1,39,979,2]],
      [253, 255, 253, [39,757,2,40,757,2,41,757,2,42,757,2,43,757,2,44,757,2,45,757,2,46,757,2,47,758,1]],
      [222, 211, 208, [39,999,2]],
      [202, 193, 192, [39,149,1]],
      [253, 255, 255, [39,819,1]],
      [253, 255, 255, [40,356,1]],
      [252, 255, 255, [40,727,1]],
      [255, 255, 255, [40,860,1]],
      [253, 255, 255, [40,1000,1]],
      [253, 255, 255, [41,907,1,42,907,1,43,907,1,44,907,1]],
      [254, 255, 255, [41,943,1,42,942,2,43,942,1,44,942,1,45,941,2,46,941,2,47,941,2,48,941,2,49,941,2,50,941,2,51,941,2,52,942,1]],
      [252, 254, 251, [41,301,5,42,298,8,43,294,7,43,305,2,44,306,1]],
      [253, 255, 254, [41,718,1,42,718,1,43,718,1,44,717,3,45,717,2,46,716,3,47,716,2]],
      [255, 255, 255, [42,562,1]],
      [253, 255, 255, [42,998,2]],
      [253, 255, 254, [42,688,1,43,687,2]],
      [252, 255, 255, [43,84,1]],
      [249, 250, 251, [43,111,2,44,112,2,45,112,1]],
      [253, 255, 255, [43,135,1]],
      [253, 255, 255, [44,446,1]],
      [255, 255, 255, [44,418,1]],
      [255, 255, 255, [44,687,1,45,687,2]],
      [255, 254, 249, [44,47,2,45,47,2,46,47,3]],
      [254, 255, 254, [45,418,1]],
      [255, 255, 253, [45,121,1,46,121,1,47,121,1,48,120,2,49,120,2]],
      [253, 254, 254, [46,417,1]],
      [254, 254, 254, [46,307,3,47,308,7,48,310,9,49,315,4]],
      [253, 255, 255, [46,688,1,47,688,1]],
      [255, 255, 255, [47,200,1]],
      [253, 255, 255, [47,880,1]],
      [254, 255, 254, [47,643,1,48,643,1,49,643,1,50,642,2,51,642,2,52,642,2,53,642,2,54,642,2,55,642,2,56,642,2,57,642,2,58,641,3,59,641,2,60,641,2,61,641,3,62,641,3,63,641,2,64,641,2,65,641,2,66,641,2,67,641,2,68,641,1,69,641,1,70,641,1]],
      [254, 255, 254, [47,891,1,48,891,1]],
      [255, 254, 252, [48,687,2,49,687,2,50,687,2,51,687,2,52,687,2,53,688,1]],
      [255, 255, 253, [48,888,1,49,888,1]],
      [253, 255, 255, [49,621,1,50,621,1,51,621,1,52,621,1,53,620,2,54,620,2,55,620,1,56,620,1,57,620,1,58,620,1]],
      [252, 255, 252, [49,99,2]],
      [255, 255, 255, [50,1016,3,51,1016,2]],
      [255, 255, 255, [50,762,1,51,762,2,52,762,2,53,763,1]],
      [253, 254, 254, [50,773,2,51,770,5,52,771,3]],
      [254, 251, 236, [51,97,2,52,97,3,53,98,1]],
      [254, 252, 250, [51,777,2,52,777,2,53,777,2,54,777,2,55,776,3,56,776,3,57,777,2,58,778,1]],
      [255, 255, 255, [51,1014,2,52,1014,2,53,1013,3]],
      [253, 255, 255, [52,892,1,53,892,1]],
      [253, 255, 255, [53,943,1]],
      [253, 255, 255, [53,944,1]],
      [255, 254, 252, [53,48,2]],
      [253, 255, 254, [54,892,1]],
      [254, 252, 253, [53,1016,1,54,1015,2,55,1014,3]],
      [253, 255, 255, [54,46,1]],
      [254, 255, 254, [54,859,1,55,859,1]],
      [253, 255, 255, [54,887,1,55,887,1]],
      [255, 255, 255, [54,951,1,55,951,1]],
      [254, 253, 251, [55,782,3,56,781,3,57,781,2,58,781,1]],
      [255, 255, 255, [55,200,1]],
      [254, 255, 253, [55,46,1,56,45,2,57,45,1]],
      [255, 255, 255, [55,952,1]],
      [254, 255, 255, [56,608,4,57,609,4,58,610,4,59,612,2]],
      [255, 255, 252, [56,708,3,57,707,4]],
      [255, 254, 251, [57,291,1,58,290,3]],
      [255, 253, 249, [57,851,1,58,850,2,59,850,3,60,851,3]],
      [253, 255, 255, [58,808,1]],
      [253, 255, 255, [58,198,2,59,194,6,60,194,5]],
      [253, 255, 253, [59,576,5,60,575,5]],
      [252, 255, 253, [59,46,1,60,45,5,61,45,1,61,48,1]],
      [254, 255, 250, [60,1016,3,61,1016,3]],
      [255, 254, 233, [60,895,1]],
      [255, 255, 255, [61,193,1]],
      [251, 250, 239, [61,94,1,62,94,1]],
      [252, 254, 252, [62,324,3,63,321,5,64,321,5,65,321,3,66,322,1]],
      [253, 255, 255, [62,809,1]],
      [255, 254, 255, [63,1013,3,64,1014,3]],
      [253, 255, 255, [64,1013,1]],
      [253, 255, 255, [64,809,1]],
      [254, 255, 255, [64,509,1,65,508,2,66,508,2,67,508,1,68,508,2,69,508,2,70,508,2,71,508,2,72,508,2,73,508,2,74,508,2,75,508,2,76,508,2,77,508,2,78,508,2,79,508,2,80,508,2,81,509,1,82,509,1,83,509,1,84,509,1,85,509,1]],
      [254, 250, 231, [64,93,1]],
      [254, 251, 227, [64,905,1,65,905,1]],
      [253, 252, 249, [65,1013,5,66,1016,3,67,1016,3]],
      [252, 255, 254, [65,121,1,66,121,1]],
      [253, 255, 255, [68,136,1,69,135,2,70,135,2,71,134,3,72,134,2,73,134,1]],
      [253, 255, 255, [68,935,1]],
      [253, 254, 254, [70,431,1]],
      [253, 255, 255, [70,935,1]],
      [255, 255, 255, [70,430,1]],
      [255, 255, 255, [70,820,1,71,820,1]],
      [253, 255, 255, [71,935,1]],
      [253, 255, 255, [70,954,1]],
      [253, 255, 253, [71,954,1]],
      [253, 255, 255, [72,935,1]],
      [255, 255, 255, [72,820,1,73,820,1]],
      [253, 255, 255, [73,1016,1]],
      [253, 255, 255, [73,150,1]],
      [253, 255, 255, [73,636,1]],
      [255, 255, 255, [73,797,1]],
      [253, 255, 255, [74,138,2,75,136,3]],
      [253, 255, 255, [74,154,1]],
      [253, 255, 255, [74,1013,1,75,1013,1]],
      [253, 255, 255, [74,796,1]],
      [253, 255, 255, [74,155,1]],
      [253, 255, 255, [75,935,1]],
      [254, 255, 255, [76,80,1]],
      [255, 255, 255, [76,81,1]],
      [253, 255, 253, [76,1016,2]],
      [253, 255, 255, [76,935,1]],
      [253, 255, 255, [77,794,1]],
      [253, 255, 255, [78,422,1]],
      [253, 253, 250, [79,422,1,80,421,2,81,420,2,82,420,2]],
      [252, 255, 255, [81,211,1]],
      [252, 255, 255, [82,212,1]],
      [253, 255, 255, [82,935,1,83,935,2,84,935,2,85,935,2,86,935,1,87,935,1,88,934,2,89,934,2,90,934,2,91,934,2,92,934,1]],
      [252, 255, 255, [83,212,1]],
      [255, 255, 251, [82,121,1]],
      [253, 255, 255, [83,673,1]],
      [253, 255, 254, [83,664,3,84,663,2,85,663,1]],
      [253, 255, 255, [83,674,2]],
      [255, 254, 255, [83,1015,2,84,1013,4,85,1013,4]],
      [253, 255, 255, [85,211,1]],
      [253, 255, 255, [85,659,1]],
      [255, 255, 255, [85,679,1,86,679,2]],
      [253, 255, 255, [86,659,1]],
      [255, 255, 255, [86,115,1]],
      [255, 252, 250, [86,1013,2,87,1013,4,88,1014,3]],
      [253, 254, 253, [87,123,1,88,122,2,89,122,2,90,122,2,91,122,2,92,122,1,93,121,2,94,121,2,95,121,2,96,121,2,97,121,2,98,121,2,99,121,2,100,121,2,101,121,2,102,121,2,103,121,2,104,121,2,105,121,2,106,122,1,107,122,2,108,122,2,109,122,2,110,122,2,111,122,2,112,122,1]],
      [253, 255, 255, [87,211,1,88,211,1]],
      [255, 255, 255, [87,9,1]],
      [252, 255, 254, [87,116,2]],
      [253, 255, 255, [89,199,3]],
      [250, 248, 247, [89,709,1]],
      [254, 254, 253, [90,529,1,91,528,3,92,528,3,93,528,2]],
      [253, 255, 255, [90,189,1]],
      [255, 255, 253, [91,188,1]],
      [255, 254, 250, [92,1017,2]],
      [253, 255, 255, [93,934,1]],
      [254, 254, 251, [94,374,5,95,373,5,96,373,3]],
      [254, 255, 255, [94,775,4,95,774,5,96,774,2,97,774,2,98,774,2,99,774,2,100,774,2,101,774,2,102,774,2,103,774,2,104,774,2,105,774,2,106,774,2,107,774,2,108,774,2,109,768,2,109,775,2,110,768,3,110,774,2,111,768,8,112,770,4]],
      [253, 255, 255, [94,934,1]],
      [253, 255, 255, [96,934,1]],
      [254, 254, 254, [96,744,1,97,744,2]],
      [255, 252, 249, [97,413,1]],
      [250, 251, 248, [98,68,1]],
      [255, 254, 254, [98,743,1,99,743,1]],
      [255, 253, 250, [99,413,1]],
      [253, 255, 255, [99,1017,1]],
      [255, 250, 240, [99,414,1,100,413,1]],
      [254, 255, 252, [99,375,2,100,374,5,101,373,2,101,377,2]],
      [255, 254, 250, [100,742,2]],
      [254, 254, 254, [101,1010,1]],
      [255, 253, 251, [102,1015,2,103,1015,2]],
      [245, 235, 221, [102,414,2,103,413,3]],
      [253, 255, 255, [103,778,1]],
      [255, 255, 255, [103,993,5,104,994,2]],
      [255, 255, 254, [104,316,2,105,307,11,106,304,13,107,304,4]],
      [253, 255, 255, [104,944,1,105,945,2]],
      [255, 251, 247, [105,416,1,106,415,2]],
      [255, 255, 255, [106,374,1]],
      [254, 255, 254, [106,778,1,107,778,1,108,778,1,109,778,1,110,778,1,111,778,1,112,777,2,113,777,2,114,777,2,115,777,2,116,777,2,117,777,1]],
      [253, 255, 254, [106,1010,1,107,1010,2]],
      [255, 255, 255, [107,374,1]],
      [255, 250, 247, [106,417,1,107,417,1]],
      [255, 255, 255, [108,988,2,109,988,2,110,988,2,111,988,2,112,988,2,113,988,2,114,989,1]],
      [255, 255, 255, [109,373,1]],
      [255, 255, 254, [110,999,1,111,998,2,112,998,2,113,998,2,114,998,2,115,998,2,116,998,2,117,998,2,118,998,2,119,998,2,120,998,2,121,997,3,122,997,2,123,997,2,124,997,2,125,997,2,126,998,1]],
      [255, 255, 255, [114,582,2,115,582,1]],
      [255, 255, 253, [114,584,3]],
      [255, 255, 255, [114,580,2,115,580,2]],
      [244, 242, 240, [114,1015,2,115,1014,3,116,1014,3,117,1014,3,118,1014,1]],
      [253, 255, 255, [115,688,1]],
      [255, 255, 255, [115,588,2]],
      [245, 246, 243, [116,414,2,117,414,2]],
      [255, 255, 253, [116,590,2]],
      [255, 255, 255, [116,593,1]],
      [255, 255, 255, [116,592,1]],
      [255, 255, 255, [116,596,2]],
      [255, 255, 255, [117,373,1,118,373,1,119,373,1]],
      [253, 255, 253, [118,777,1]],
      [253, 255, 255, [118,304,1,119,304,1,120,304,1]],
      [248, 244, 229, [118,1015,2,119,1015,3,120,1015,2,121,1015,2]],
      [253, 255, 255, [119,787,1]],
      [252, 255, 250, [120,787,1]],
      [255, 255, 255, [120,374,1,121,374,1]],
      [253, 255, 254, [122,777,1,123,777,1,124,777,1,125,777,1,126,777,1,127,777,1,128,777,1,129,777,1,130,777,1,131,777,1,132,777,1,133,776,2,134,776,2,135,776,1,136,776,1,137,776,2,138,776,2,139,776,2,140,776,2,141,776,2,142,776,2,143,776,2,144,776,1]],
      [253, 255, 255, [123,60,1]],
      [255, 254, 252, [123,991,1,124,991,1,125,990,2,126,990,2,127,990,2,128,990,2,129,990,3,130,990,6,131,990,3,132,990,2]],
      [253, 255, 255, [124,60,1]],
      [255, 255, 255, [124,294,1]],
      [255, 255, 253, [124,1018,1]],
      [253, 255, 255, [125,850,1]],
      [255, 255, 255, [125,155,1]],
      [255, 255, 255, [125,294,1,126,294,1,127,294,1,128,294,1,129,294,2,130,294,2,131,294,2,132,295,1,133,295,1]],
      [252, 255, 253, [125,424,2]],
      [254, 255, 255, [129,59,1]],
      [255, 255, 255, [130,59,1]],
      [254, 250, 242, [130,863,1]],
      [254, 255, 251, [130,1009,3,131,1008,5,131,1014,3,132,1007,10,133,1007,3,133,1012,6,134,1007,7,134,1015,4,135,1008,6,135,1017,2]],
      [253, 255, 255, [130,509,1]],
      [253, 255, 255, [130,563,1,131,563,1]],
      [255, 255, 255, [131,59,1]],
      [255, 252, 251, [131,863,1,132,864,1,133,864,1,134,864,2]],
      [255, 255, 255, [131,374,1]],
      [255, 255, 255, [131,373,1,132,373,1,133,373,1,134,373,1,135,373,1,136,373,1,137,373,1,138,373,1,139,373,1,140,373,1,141,373,1,142,373,2,143,373,2,144,373,2,145,373,2,146,373,2,147,374,2,148,374,2,149,374,2,150,374,2,151,374,2,152,374,2,153,374,2,154,374,2,155,374,2,156,374,2]],
      [253, 255, 255, [131,788,1]],
      [255, 255, 255, [132,431,1]],
      [253, 255, 255, [132,789,1]],
      [252, 255, 255, [132,509,1]],
      [253, 255, 255, [132,563,1]],
      [251, 253, 253, [132,425,2]],
      [253, 255, 255, [132,432,1,133,432,1,134,431,2,135,431,1,136,431,2,137,431,2,138,431,1,139,431,1,140,430,2,141,430,1,142,430,1,143,430,1]],
      [253, 255, 255, [133,563,1]],
      [253, 255, 255, [134,60,1]],
      [255, 255, 255, [134,295,1,135,295,1]],
      [253, 255, 255, [134,563,1]],
      [255, 255, 255, [135,563,1]],
      [255, 247, 236, [135,865,1]],
      [251, 248, 247, [135,27,3,136,21,9,137,21,4,138,20,2,139,21,1,140,21,2,141,20,3,142,19,3,143,18,3,144,18,2,145,17,3,146,17,3,147,17,2,148,16,2,149,12,6,150,9,7,151,9,4,152,8,3,153,7,3,154,7,2]],
      [253, 255, 255, [136,562,2,137,562,2]],
      [252, 252, 251, [136,1016,2,137,1017,2]],
      [255, 254, 247, [136,865,1]],
      [255, 255, 255, [136,295,1,137,295,1]],
      [249, 243, 240, [137,865,1]],
      [250, 251, 237, [137,62,1,138,62,1]],
      [255, 255, 255, [138,563,1]],
      [255, 255, 255, [139,209,1]],
      [255, 255, 253, [139,295,1]],
      [254, 255, 255, [139,563,2,140,563,1,141,563,1]],
      [253, 255, 255, [139,689,1]],
      [255, 252, 237, [140,61,2]],
      [255, 255, 255, [140,209,1]],
      [240, 221, 212, [141,867,1]],
      [253, 255, 255, [142,563,1]],
      [253, 255, 253, [142,695,2]],
      [254, 255, 254, [142,1013,4,143,1013,4,144,1014,3,145,1014,3]],
      [253, 255, 255, [143,563,1]],
      [253, 255, 255, [143,493,1]],
      [253, 255, 255, [144,562,2,145,562,2,146,562,2,147,562,2]],
      [253, 255, 255, [144,492,1,145,492,1]],
      [254, 255, 254, [145,423,1,146,423,2,147,423,2,148,423,2,149,423,2,150,423,2,151,423,2,152,423,2,153,423,2,154,423,2,155,423,3,156,423,3,157,423,3,158,423,3,159,423,3,160,423,3,161,423,3,162,423,3,163,423,3,164,423,2,165,423,2,166,423,1]],
      [254, 255, 254, [145,776,1,146,776,1,147,775,2,148,775,1,149,775,1]],
      [254, 253, 226, [147,64,1]],
      [241, 224, 214, [147,870,1]],
      [253, 255, 253, [147,1017,2]],
      [253, 255, 255, [147,247,1,148,247,2,149,248,2,150,248,2,151,248,2,152,248,2,153,248,2,154,248,2,155,248,1]],
      [253, 255, 255, [147,430,1,148,430,2,149,430,2,150,430,1,151,430,2,152,430,2,153,430,2]],
      [253, 255, 253, [148,562,1,149,562,1]],
      [245, 237, 231, [149,870,1]],
      [252, 254, 252, [149,1017,2]],
      [253, 255, 254, [150,775,1]],
      [253, 255, 253, [150,562,1]],
      [254, 255, 254, [150,607,1,151,607,2,152,607,2,153,607,2,154,607,2,155,607,1,156,607,1]],
      [252, 255, 254, [151,562,1,152,562,1,153,562,2,154,562,2,155,562,2,156,563,2,157,563,2,158,563,2,159,563,1,160,563,1,161,563,1]],
      [252, 248, 227, [151,62,2]],
      [252, 255, 254, [151,492,1]],
      [253, 254, 253, [152,775,2,153,775,2,154,775,2,155,775,3,156,775,3,157,775,2,158,775,2,159,775,3,160,776,2,161,776,3,162,777,2]],
      [253, 255, 255, [152,736,1,153,735,2,154,735,1]],
      [255, 255, 255, [152,303,1,153,303,1]],
      [254, 248, 244, [152,871,1]],
      [255, 255, 251, [153,1014,3,154,1014,3]],
      [252, 255, 248, [153,51,1]],
      [252, 255, 248, [154,50,1]],
      [253, 255, 255, [154,430,1,155,430,2,156,430,2,157,430,1]],
      [255, 255, 252, [154,304,1,155,304,1]],
      [255, 255, 255, [155,735,1,156,734,2,157,735,1,158,735,1,159,735,1,160,734,2,161,734,2,162,734,1]],
      [253, 255, 255, [155,872,1]],
      [252, 252, 238, [156,52,2]],
      [255, 255, 255, [156,304,1,157,304,1,158,304,1,159,304,1]],
      [255, 255, 254, [159,1013,1,160,1013,1]],
      [255, 255, 250, [159,1015,2,160,1014,3,161,1014,3,162,1014,2]],
      [254, 255, 254, [159,651,1,160,651,1,161,651,1,162,651,1,163,651,1,164,650,2,165,650,2,166,650,2,167,650,2,168,650,2,169,650,1,170,649,2,171,649,2,172,649,2,173,649,2,174,649,2,175,649,1,176,649,1,177,649,1,178,649,1,179,649,1,180,649,1,181,649,1,182,649,1,183,649,1,184,649,1,185,649,1]],
      [253, 255, 255, [160,430,1,161,430,2,162,430,1,163,430,1,164,430,1]],
      [255, 255, 253, [160,1008,2]],
      [252, 255, 255, [161,379,1,162,379,1,163,379,1]],
      [253, 255, 255, [162,541,1,163,541,1]],
      [255, 255, 255, [162,299,1]],
      [253, 254, 251, [163,1016,3,164,1016,3]],
      [255, 255, 255, [164,708,1]],
      [255, 255, 255, [164,305,1]],
      [255, 255, 255, [165,306,1]],
      [255, 255, 253, [165,1007,1]],
      [251, 253, 253, [165,379,1]],
      [253, 255, 255, [165,541,1]],
      [255, 255, 255, [166,306,1]],
      [255, 255, 255, [167,306,1]],
      [255, 255, 255, [167,307,1]],
      [255, 255, 253, [167,1007,1]],
      [253, 255, 254, [168,1007,1,169,1007,1,170,1007,1,171,1007,1]],
      [252, 255, 255, [169,74,1]],
      [255, 255, 255, [169,1016,1]],
      [253, 255, 255, [169,75,1]],
      [253, 255, 255, [171,377,2]],
      [253, 255, 255, [173,541,1]],
      [255, 255, 255, [173,656,1]],
      [255, 255, 255, [173,709,1]],
      [255, 255, 255, [174,656,1]],
      [254, 254, 252, [174,1016,3,175,1016,3]],
      [255, 254, 251, [174,541,1,175,541,1,176,541,1]],
      [254, 255, 253, [176,543,3,177,543,4]],
      [255, 255, 255, [176,709,1]],
      [255, 253, 252, [177,878,1,178,878,1]],
      [255, 255, 255, [178,709,1]],
      [248, 255, 255, [178,71,1,179,71,1]],
      [254, 254, 251, [179,1015,2,180,1014,3,181,1014,3]],
      [248, 255, 255, [180,71,1]],
      [255, 255, 255, [181,299,1,182,299,1]],
      [240, 246, 244, [181,70,1,182,70,1]],
      [255, 255, 255, [183,299,1]],
      [255, 254, 254, [184,507,2,185,507,2]],
      [253, 255, 255, [184,655,1]],
      [253, 255, 253, [185,655,1]],
      [249, 255, 255, [186,71,1]],
      [254, 255, 255, [186,656,1,187,656,1]],
      [254, 254, 251, [187,1008,1,188,1008,1,189,1008,1,190,1007,3,191,1007,3,192,1007,2,193,1007,2,194,1007,5,195,1008,4,196,1011,2]],
      [236, 237, 236, [188,506,1]],
      [255, 255, 255, [188,656,1,189,656,1,190,656,1,191,656,1]],
      [255, 255, 253, [188,1013,1,189,1013,1,190,1013,3]],
      [255, 255, 247, [188,867,1]],
      [254, 255, 255, [189,509,1,190,509,1,191,509,1,192,509,1,193,509,1,194,509,1,195,509,1]],
      [251, 246, 228, [189,70,2,190,70,2]],
      [253, 255, 255, [189,919,1,190,920,1]],
      [255, 255, 254, [190,868,2,191,868,2,192,868,2,193,868,2,194,868,2,195,868,2,196,868,2,197,869,1]],
      [245, 241, 220, [191,69,3]],
      [255, 255, 253, [192,127,1]],
      [254, 255, 254, [192,393,5,193,392,4,194,392,2,195,392,2,196,392,2,197,392,2,198,393,2,199,393,2,200,393,2,201,393,2,202,393,2]],
      [255, 255, 255, [192,710,1]],
      [255, 255, 254, [192,398,4]],
      [255, 255, 253, [192,402,2,193,402,2]],
      [253, 254, 250, [192,404,3,193,404,2]],
      [255, 254, 252, [192,407,1,193,406,4,194,408,2]],
      [255, 255, 255, [193,127,2,194,127,2,195,128,2,196,128,2,197,128,2,198,128,2,199,128,2,200,128,2,201,128,2,202,128,2,203,128,2,204,128,2,205,128,2,206,128,2,207,128,2,208,128,1]],
      [255, 255, 255, [196,299,1]],
      [252, 255, 254, [197,915,1,198,914,2,199,914,2,200,914,1]],
      [253, 255, 255, [198,657,1]],
      [253, 255, 255, [199,656,1]],
      [253, 255, 255, [199,723,1]],
      [255, 255, 253, [199,732,1,200,732,1,201,732,1]],
      [253, 255, 254, [200,1014,1,201,1014,3,202,1014,3,203,1015,2]],
      [255, 255, 253, [201,731,1]],
      [255, 255, 255, [201,299,1,202,299,1,203,299,1]],
      [255, 255, 253, [202,730,1]],
      [252, 251, 250, [204,1016,3,205,1013,6,206,1013,5,207,1013,1,207,1016,1]],
      [253, 255, 252, [206,147,2,207,147,1]],
      [255, 255, 255, [209,128,2,210,128,2,211,128,2,212,128,2,213,128,2,214,128,2,215,128,1,216,128,1,217,128,1]],
      [255, 255, 255, [209,1013,1]],
      [255, 255, 255, [210,731,3,211,732,3,212,734,1]],
      [254, 255, 255, [213,735,1,214,735,1]],
      [249, 243, 238, [214,31,1]],
      [249, 243, 238, [214,30,1]],
      [254, 255, 254, [215,299,2,216,299,2,217,299,2,218,299,2,219,299,2,220,299,2,221,299,2,222,299,2,223,299,2,224,299,2,225,299,2,226,299,2,227,299,2,228,299,2,229,299,2,230,299,2,231,299,2,232,299,2,233,299,2,234,299,2,235,299,2,236,299,2]],
      [254, 254, 251, [216,289,6,217,292,4,218,294,2,219,293,3,220,293,2,221,293,2,222,293,2,223,293,2,224,293,3,225,294,2,226,294,2,227,294,2,228,294,3,229,295,3,230,296,2,231,297,1,232,297,2,233,297,2,234,297,2]],
      [254, 254, 252, [216,276,10,217,277,3]],
      [251, 255, 255, [216,286,1]],
      [254, 255, 255, [216,736,1,217,736,2,218,736,2,219,736,2,220,736,2,221,736,2,222,737,1,223,737,1,224,737,1,225,737,1,226,736,2,227,736,2,228,736,2,229,736,2,230,737,1,231,737,1,232,737,1,233,737,1]],
      [254, 253, 254, [217,1011,1]],
      [253, 255, 255, [217,1017,2]],
      [219, 218, 216, [217,59,2]],
      [255, 255, 255, [217,729,1]],
      [253, 255, 255, [217,649,1,218,649,1,219,649,1]],
      [231, 231, 232, [218,59,3,219,60,2,220,60,2,221,60,2]],
      [255, 255, 255, [218,729,1]],
      [253, 255, 254, [221,70,2,222,70,2,223,70,2,224,70,2,225,70,3,226,70,2,227,70,2]],
      [176, 173, 177, [222,61,2,223,61,1]],
      [253, 255, 255, [222,650,1,223,650,1]],
      [238, 236, 244, [223,23,1]],
      [254, 255, 255, [224,650,1,225,650,1]],
      [254, 255, 255, [227,650,1,228,650,1]],
      [242, 230, 223, [227,915,1]],
      [254, 255, 253, [231,1014,3,232,1014,3,233,1015,2]],
      [146, 144, 142, [233,966,2]],
      [234, 235, 236, [234,1012,2]],
      [161, 156, 154, [235,966,2]],
      [254, 254, 254, [235,1013,1]],
      [253, 255, 254, [235,1016,2,236,1016,3,237,1016,4]],
      [223, 222, 220, [236,1013,1]],
      [251, 255, 255, [239,934,1,240,933,2,241,932,2,242,932,2]],
      [254, 255, 254, [239,988,1,240,984,2,240,987,2,241,984,5,242,983,5,243,983,2,244,982,3,245,982,3,246,982,2,247,982,2,248,982,2,249,982,1]],
      [252, 255, 253, [240,1013,2,241,1013,2,242,1013,2,243,1013,2,244,1013,2,245,1013,2,246,1013,2,247,1013,2]],
      [185, 176, 176, [241,1010,3,242,1009,4]],
      [253, 255, 254, [244,988,2,245,988,2,246,988,2,247,989,2,248,984,7,249,983,8]],
      [253, 255, 253, [245,916,1]],
      [255, 255, 254, [247,536,4,248,534,7,249,534,3,249,539,2,250,540,1]],
      [253, 255, 255, [247,1009,1]],
      [252, 255, 254, [247,944,1,248,944,1,249,944,1]],
      [253, 255, 255, [248,430,1]],
      [253, 255, 255, [248,821,1,249,821,1]],
      [253, 255, 253, [248,1009,1]],
      [255, 255, 254, [249,429,1,250,429,1,251,429,1]],
      [255, 255, 253, [249,1009,1,250,1009,1]],
      [253, 255, 255, [251,821,1]],
      [253, 255, 255, [251,430,1,252,430,1]],
      [253, 255, 255, [252,821,1]],
      [254, 255, 253, [253,944,2,254,944,2,255,944,1,256,943,2,257,943,2,258,942,3,259,942,2,260,942,2,261,942,2]],
      [255, 255, 253, [253,1016,2,254,1016,2]],
      [253, 255, 255, [253,821,1]],
      [253, 255, 255, [254,821,1,255,821,1]],
      [255, 255, 254, [255,129,2,256,129,2,257,129,2,258,129,2,259,129,2]],
      [255, 255, 255, [256,474,1]],
      [253, 255, 255, [257,471,2]],
      [253, 255, 255, [257,1014,2,258,1014,2,259,1014,2,260,1014,2]],
      [253, 255, 255, [258,822,1]],
      [255, 255, 255, [260,526,1]],
      [255, 255, 255, [261,525,1]],
      [255, 255, 255, [262,525,1]],
      [251, 253, 252, [262,953,2,263,953,2,264,953,2]],
      [254, 252, 249, [266,517,2,267,515,5,268,515,6,269,519,2]],
      [255, 255, 255, [269,305,1]],
      [254, 255, 254, [269,1010,3,270,1010,1]],
      [255, 250, 243, [269,1013,1,270,1013,1,270,1015,2,271,1014,4,272,1016,1]],
      [251, 252, 252, [270,1017,3,271,1018,2]],
      [255, 255, 253, [270,305,1]],
      [255, 255, 254, [272,632,4,273,633,4,274,634,3,275,636,2]],
      [255, 255, 255, [273,848,1]],
      [253, 255, 254, [273,24,2,274,24,1]],
      [254, 253, 247, [274,1014,3,275,1015,2,276,1014,3]],
      [255, 255, 255, [274,1009,1]],
      [253, 255, 250, [275,15,2,276,15,2,277,15,1]],
      [255, 255, 252, [276,1009,2,277,1009,2]],
      [253, 255, 255, [279,56,1]],
      [254, 254, 252, [280,1017,1]],
      [255, 255, 255, [281,1017,1]],
      [252, 253, 250, [281,1018,1]],
      [254, 255, 255, [281,56,1,282,56,1]],
      [253, 255, 253, [282,1014,1,283,1014,1]],
      [255, 255, 253, [282,1015,2,283,1015,2,284,1015,2]],
      [252, 255, 253, [286,1010,1]],
      [255, 255, 255, [287,1010,1]],
      [254, 255, 255, [291,1010,1,292,1011,1]],
      [253, 255, 255, [294,432,1,295,432,1]],
      [253, 255, 255, [296,432,1]],
      [255, 254, 249, [296,1015,4,297,1016,3]],
      [253, 255, 255, [298,1014,1]],
      [254, 255, 252, [298,1015,5,299,1014,6,300,1014,2]],
      [254, 255, 252, [300,429,2,301,429,2,302,429,2,303,429,2,304,429,2,305,429,2,306,429,4,307,429,4]],
      [255, 255, 255, [300,848,1]],
      [255, 255, 255, [301,849,1,302,849,1,303,849,1]],
      [255, 243, 232, [304,331,1]],
      [255, 255, 255, [304,849,1,305,849,1,306,849,1,307,849,1]],
      [253, 255, 255, [305,822,1,306,822,2,307,822,2,308,822,1]],
      [252, 255, 252, [306,1014,1,307,1014,1]],
      [237, 237, 237, [307,1015,2]],
      [254, 255, 253, [308,1011,2,309,1011,1]],
      [255, 254, 249, [310,1011,1,311,1011,2,312,1011,4,313,1011,3,314,1011,2]],
      [255, 255, 253, [311,1018,2,312,1016,3,313,1016,3,314,1017,2]],
      [255, 255, 255, [313,849,1]],
      [254, 254, 252, [314,319,1,315,319,1]],
      [252, 255, 255, [315,56,1]],
      [253, 255, 255, [316,56,1]],
      [253, 255, 253, [317,304,1]],
      [253, 255, 255, [317,56,1]],
      [253, 255, 255, [318,57,1]],
      [253, 255, 255, [319,57,1]],
      [251, 255, 251, [320,316,2]],
      [252, 255, 252, [321,315,1]],
      [253, 254, 254, [321,314,1]],
      [253, 255, 255, [322,58,1]],
      [254, 253, 250, [327,1014,6,328,1014,6]],
      [253, 255, 255, [329,1014,1]],
      [253, 255, 254, [332,822,1,333,822,2,334,823,1]],
      [253, 255, 255, [333,1017,1]],
      [253, 255, 255, [334,1018,1]],
      [254, 255, 255, [334,1010,1,335,1009,2]],
      [254, 255, 254, [335,969,2,336,967,4,337,965,5,338,964,4]],
      [253, 255, 255, [336,823,1,337,823,1,338,823,1,339,823,1,340,823,1,341,823,1]],
      [255, 255, 255, [336,849,1,337,849,1]],
      [255, 255, 248, [336,1015,2,337,1015,3,338,1015,2]],
      [252, 255, 255, [337,55,1]],
      [255, 255, 255, [337,973,1,338,972,2,339,972,2,340,972,2,341,972,2,342,972,2]],
      [253, 255, 253, [338,54,2]],
      [248, 248, 248, [338,1017,1,339,1016,4]],
      [253, 255, 255, [342,823,1]],
      [254, 254, 252, [342,1010,1,343,1009,2,344,1009,3,345,1009,3,346,1009,2,347,1009,2,348,1009,2]],
      [254, 255, 254, [343,1006,1,344,1006,1,345,1006,1,346,1006,2,347,1006,2,348,1006,2,349,1006,2,350,1006,2,351,1006,2,352,1006,2,353,1006,2,354,1006,2,355,1006,2,356,1006,2,357,1006,2,358,1006,2,359,1006,2,360,1006,2,361,1006,2,362,1005,3,363,1005,3,364,1005,3,365,1006,2,366,1006,2,367,1006,3,367,1013,2,368,1006,9,369,1008,7,370,1008,2]],
      [255, 255, 255, [347,848,1]],
      [254, 255, 255, [347,972,2,348,971,3,349,970,3,350,970,2]],
      [253, 255, 255, [348,823,1,349,823,2]],
      [254, 255, 253, [350,848,1,351,847,2,352,847,1,353,847,1]],
      [253, 255, 255, [350,824,1]],
      [253, 255, 255, [351,824,1]],
      [253, 255, 255, [352,1019,1]],
      [255, 254, 255, [353,1016,2,354,1016,3,355,1017,1]],
      [255, 255, 253, [354,1014,1,355,1013,2,356,1013,2]],
      [255, 254, 251, [360,1016,1,361,1015,2,362,1015,2]],
      [253, 253, 254, [366,1015,1]],
      [252, 251, 252, [366,1017,2,367,1017,3,368,1017,3]],
      [254, 255, 253, [370,1015,2,371,1015,1]],
      [254, 255, 254, [374,1016,2,375,1016,3]],
      [254, 254, 252, [378,1010,4,379,1010,5,380,1010,2,381,1010,2,382,1010,2,383,1010,2,384,1011,4,385,1011,4,386,1013,2]],
      [255, 255, 254, [381,1015,2,382,1015,2,383,1015,2]],
      [246, 242, 243, [391,1014,2,392,1014,2,393,1014,1]],
      [251, 255, 252, [391,1016,1,392,1016,1]],
      [252, 255, 254, [393,1016,1]],
      [252, 255, 253, [400,515,1]],
      [254, 254, 253, [400,1018,1,401,1017,3]],
      [255, 252, 251, [405,1016,3,406,1015,5,407,1017,1]],
      [254, 255, 255, [405,516,1,406,516,1,407,516,1,408,516,1,409,516,1,410,516,1,411,516,1,412,516,1,413,516,1,414,516,1]],
      [253, 252, 250, [406,1012,1,407,1012,1,408,1011,2,409,1010,3,410,1010,3,411,1010,3,412,1010,3,413,1010,3,414,1011,4,415,1011,4,416,1012,3]],
      [249, 247, 245, [408,1015,4,409,1013,4,410,1013,3,411,1013,2,412,1013,2]],
      [241, 240, 240, [413,1014,3,414,1015,2]],
      [255, 250, 242, [421,560,2,422,560,1]],
      [253, 255, 255, [422,1019,1]],
      [251, 254, 252, [423,1016,3,424,1016,2]],
      [255, 255, 255, [426,1012,1]],
      [253, 254, 254, [426,1013,2,427,1013,2,428,1013,2,429,1013,2,430,1013,2,431,1013,2,432,1013,2,433,1013,2,434,1013,2,435,1013,2,436,1013,2,437,1013,2,438,1013,2,439,1013,2,440,1010,5,441,1012,5,442,1014,3]],
      [235, 241, 244, [427,1011,1,428,1010,2,429,1010,2]],
      [247, 245, 244, [427,20,1]],
      [242, 244, 245, [432,1010,2]],
      [255, 255, 249, [433,22,1]],
      [254, 254, 251, [436,868,1,437,867,2,438,867,2,439,867,3,440,867,3,441,867,3,442,868,2,443,868,2,444,869,1,445,869,1,446,869,1,447,869,1]],
      [253, 255, 253, [437,875,1]],
      [252, 255, 254, [437,883,2,438,883,2,439,884,2,440,885,1]],
      [253, 254, 253, [437,1016,4,438,1016,3,439,1016,2]],
      [253, 255, 255, [437,879,1,438,876,4,439,877,2]],
      [255, 255, 253, [437,946,2,438,942,7,439,942,5]],
      [253, 253, 252, [438,949,7,439,949,7]],
      [253, 255, 255, [439,960,1]],
      [255, 253, 246, [439,302,3,440,302,4,441,303,3]],
      [254, 255, 252, [441,885,2,442,884,3,443,884,2,444,884,2,445,884,2,446,885,1,447,885,1]],
      [255, 255, 255, [441,27,1]],
      [255, 255, 247, [443,1017,2,444,1016,3]],
      [253, 255, 255, [444,29,1,445,29,1,446,29,1]],
      [253, 255, 255, [445,942,1]],
      [253, 255, 255, [445,941,1]],
      [255, 255, 253, [446,1004,1]],
      [255, 255, 255, [446,958,2]],
      [253, 255, 254, [446,1014,2,447,1014,2,448,1014,2,449,1014,2]],
      [255, 255, 255, [448,869,1]],
      [255, 255, 255, [449,1004,1]],
      [254, 254, 251, [451,1014,3,452,1014,3,453,1014,3]],
      [254, 255, 252, [451,303,3,452,302,4,453,302,1]],
      [253, 255, 251, [454,1016,2,455,1016,3,456,1016,4]],
      [255, 255, 255, [454,867,1,455,867,1,456,866,2,457,866,1,458,866,1]],
      [255, 255, 255, [454,1004,1,455,1004,1]],
      [253, 255, 255, [457,903,5]],
      [254, 255, 254, [457,902,1,458,902,2,459,902,2,460,902,2,461,901,3,462,901,2,463,901,2,464,901,1]],
      [253, 255, 255, [458,886,2,459,885,2,460,884,3,461,884,2,462,870,5,462,879,8,463,870,17,464,875,4,464,883,4]],
      [254, 255, 251, [458,906,3,459,905,3,460,905,3,461,905,2,462,905,3,463,906,2,464,906,2,465,906,1]],
      [255, 254, 255, [458,1014,2,459,1014,3,460,1014,3,461,1014,3,462,1014,4,463,1016,2,464,1016,2]],
      [242, 239, 238, [461,1004,1,462,1004,1,463,1004,1,464,1004,1]],
      [255, 254, 255, [461,1019,1,462,1018,2]],
      [255, 255, 255, [465,1004,1]],
      [255, 255, 253, [466,1016,2,467,1017,1]],
      [254, 252, 252, [467,1018,1,468,1017,1]],
      [255, 255, 250, [478,996,1]],
      [253, 255, 255, [479,991,1]],
      [255, 254, 254, [479,1004,1]],
      [255, 254, 255, [480,1004,1]],
      [255, 255, 247, [480,1015,2,481,1015,2,482,1015,2,483,1015,2]],
      [250, 250, 243, [485,1015,2,486,1015,2,487,1015,2,488,1016,1]],
      [253, 255, 255, [488,991,2,489,991,2]],
      [253, 255, 255, [488,1004,1]],
      [253, 255, 255, [490,1004,1]],
      [254, 253, 251, [490,996,1,491,996,2,492,995,3,493,995,3,494,996,1,495,996,2,496,996,2,497,996,2,498,997,1]],
      [253, 255, 255, [494,1004,1]],
      [255, 255, 253, [495,1017,3,496,1017,3]],
      [254, 255, 254, [496,1014,2,497,1014,2,498,1014,3,499,1015,2]],
      [200, 197, 198, [503,1009,1,504,1009,1]],
      [250, 231, 221, [504,151,1]],
      [254, 254, 254, [504,1016,3,505,1016,3]],
      [254, 255, 254, [505,1013,2,506,1013,2,507,1012,3,508,1011,4,509,1012,3,510,1013,1]],
      [251, 251, 249, [506,1018,1,507,1017,2]],
      [255, 255, 255, [509,986,1,510,986,1,511,986,1,512,986,1,513,986,2,514,986,2,515,986,1,516,985,2,517,984,2,518,984,2]],
      [251, 242, 233, [510,145,2,511,145,2]],
      [248, 231, 225, [520,918,1]],
      [254, 255, 252, [521,918,1,522,918,1,523,918,1,524,918,2,525,919,1]],
      [254, 255, 254, [521,1013,2,522,1013,2,523,1013,2,524,1013,2,525,1013,2,526,1012,3,527,1011,4]],
      [214, 211, 217, [522,1011,2,523,1010,3,524,1011,2]],
      [253, 255, 255, [524,997,1,525,997,1,526,997,1,527,997,1,528,996,2,529,996,1]],
      [254, 253, 254, [524,1017,2,525,1017,2,526,1017,2]],
      [252, 255, 254, [525,1006,1]],
      [232, 221, 215, [527,1006,1,528,1006,1]],
      [254, 254, 253, [530,996,1,531,995,2,532,995,2,533,995,2,534,995,2,535,995,2,536,995,2,537,995,2,538,993,4,539,992,5,540,992,2,541,992,2]],
      [254, 254, 254, [534,1016,3,535,1016,4,536,1016,3]],
      [247, 250, 248, [539,1006,3,540,1006,3]],
      [250, 253, 250, [541,1011,1,542,1011,1]],
      [255, 254, 255, [541,996,1,542,996,1]],
      [252, 255, 253, [541,998,1]],
      [253, 255, 255, [543,1016,3,544,1016,4,545,1018,2]],
      [249, 249, 249, [548,1015,2,549,1016,1]],
      [253, 255, 255, [548,532,1]],
      [253, 255, 255, [550,1004,1]],
      [255, 255, 255, [551,1004,1]],
      [255, 255, 255, [551,1005,1]],
      [218, 216, 217, [552,569,1]],
      [255, 255, 255, [553,1005,1]],
      [218, 218, 218, [553,569,1]],
      [196, 198, 200, [554,570,1]],
      [253, 255, 255, [554,1017,1]],
      [255, 255, 249, [557,1015,2,558,1015,2,559,1015,2]],
      [255, 255, 250, [560,1015,2,561,1014,3]],
      [254, 253, 255, [561,931,2]],
      [255, 254, 247, [561,1017,3,562,1018,2]],
      [253, 254, 254, [561,887,3,562,886,7,563,885,4]],
      [253, 254, 253, [562,901,8,563,901,8,564,902,1]],
      [253, 255, 255, [563,936,1]],
      [248, 246, 245, [563,576,1]],
      [255, 254, 252, [564,927,1]],
      [252, 254, 253, [564,1017,3,565,1017,3]],
      [252, 251, 252, [565,927,1,566,927,1]],
      [253, 255, 255, [566,936,1,567,936,1]],
      [254, 255, 252, [567,902,1,568,901,2,569,901,2,570,901,2,571,901,2,572,901,2,573,901,2,574,901,2,575,900,3,576,900,1]],
      [254, 250, 233, [567,922,1]],
      [255, 255, 255, [568,997,1]],
      [254, 254, 252, [568,1017,1,569,1016,3,570,1016,2,571,1016,2,572,1017,1]],
      [253, 255, 255, [571,936,1,572,936,2,573,937,1,574,937,1,575,936,2,576,936,1]],
      [255, 255, 255, [572,997,1,573,997,1]],
      [255, 255, 253, [572,560,1]],
      [255, 255, 254, [574,1013,2,575,1013,2,576,1013,3,577,1014,5,578,1014,4]],
      [249, 255, 254, [575,928,1]],
      [253, 255, 255, [577,1011,1]],
      [253, 255, 254, [577,1010,1,578,1010,1,579,1009,2,580,1009,1]],
      [253, 255, 253, [578,560,1]],
      [254, 255, 253, [579,1017,2]],
      [255, 255, 253, [580,1018,1]],
      [248, 251, 251, [580,1014,2,581,1009,7,582,1009,6]],
      [252, 255, 252, [581,915,1,582,915,2,583,915,2]],
      [239, 238, 234, [583,1014,6,584,1014,6,585,1014,3,586,1016,1]],
      [255, 255, 249, [584,915,2]],
      [252, 255, 255, [585,560,1,586,560,1]],
      [253, 255, 254, [585,915,2,586,915,2,587,915,2,588,915,2,589,915,2,590,915,2,591,915,2,592,914,2,593,914,2,594,914,2,595,915,1,596,915,1]],
      [251, 254, 250, [587,1017,2,588,1017,2,589,1017,1]],
      [255, 253, 252, [592,1016,3]],
      [253, 255, 255, [592,996,1,593,996,1]],
      [253, 253, 251, [593,585,1]],
      [255, 253, 249, [593,1014,3,594,1014,3,595,1014,3]],
      [253, 255, 255, [593,564,1]],
      [253, 255, 255, [594,564,1,595,564,1,596,564,1,597,564,1,598,564,1,599,564,1]],
      [253, 255, 255, [597,915,1,598,915,2,599,915,2,600,915,2,601,915,2,602,915,2]],
      [253, 255, 253, [599,889,2,600,889,1]],
      [255, 255, 254, [601,1014,1]],
      [254, 255, 255, [602,893,1,603,893,1,604,892,2,605,892,2,606,891,2,607,891,2,608,891,2]],
      [254, 254, 253, [604,1009,4,605,1009,5,606,1009,1,606,1011,4,607,1009,1,607,1013,2,608,1009,1,608,1013,2,609,1013,2,610,1013,2,611,1013,2,612,1013,2,613,1014,1]],
      [253, 255, 255, [606,502,1]],
      [252, 252, 249, [607,276,1]],
      [251, 253, 255, [608,588,1]],
      [255, 255, 255, [608,883,2]],
      [255, 249, 249, [609,590,1]],
      [254, 255, 255, [609,1009,1,610,1009,1,611,1009,2,612,1010,1]],
      [254, 255, 254, [612,891,1,613,891,1,614,890,2,615,890,3,616,891,2,617,891,2,618,892,1,619,892,1,620,892,1,621,892,1]],
      [254, 255, 255, [612,1016,2,613,1016,4,614,1016,4]],
      [255, 254, 232, [613,733,1,614,733,2,615,734,1]],
      [255, 249, 236, [613,736,1,614,736,1]],
      [255, 249, 236, [614,737,1]],
      [254, 255, 254, [615,1010,1,616,1010,1,617,1010,1,618,1010,1,619,1010,2,620,1010,4,621,1010,4]],
      [254, 253, 248, [615,1015,2,616,1015,3,617,1015,3]],
      [253, 253, 252, [618,1017,2]],
      [253, 255, 255, [619,580,1]],
      [253, 255, 255, [620,1017,2]],
      [253, 255, 255, [620,1015,2]],
      [255, 255, 255, [623,893,1]],
      [252, 254, 251, [624,1014,1,625,1014,3,626,1014,4,627,1014,3,628,1014,2]],
      [255, 250, 245, [625,584,1]],
      [253, 255, 254, [628,1016,3,629,1016,3]],
      [250, 252, 255, [630,258,1,631,258,1]],
      [255, 253, 235, [630,902,2,631,902,2,632,902,1]],
      [254, 254, 252, [630,1015,2,631,1014,3,632,1014,3,633,1014,3]],
      [230, 224, 217, [633,213,1,634,213,2]],
      [253, 255, 253, [633,589,1]],
      [179, 173, 159, [633,212,1,634,212,1,635,212,1]],
      [253, 251, 247, [634,216,1]],
      [253, 255, 255, [635,1005,1]],
      [255, 255, 255, [636,1005,1]],
      [255, 255, 246, [636,199,1]],
      [252, 255, 250, [637,908,1]],
      [252, 254, 249, [638,908,2,639,908,2,640,907,3,641,906,2]],
      [253, 255, 255, [641,801,1]],
      [251, 254, 254, [641,771,1,642,771,1]],
      [254, 255, 253, [642,844,1,643,844,2,643,848,3,644,844,7,645,845,4]],
      [255, 254, 255, [642,1017,2,643,1017,2]],
      [254, 254, 249, [643,839,1,644,839,2,645,839,3,646,839,3,647,839,3,648,839,2,649,839,2,650,839,2,651,839,3,652,840,2,653,841,1]],
      [255, 255, 255, [645,808,1]],
      [250, 250, 250, [645,1014,4,646,1014,4,647,1015,3,648,1017,2]],
      [255, 255, 255, [648,798,2]],
      [253, 254, 251, [650,1016,3,651,1016,4,652,1018,2]],
      [253, 254, 254, [650,796,1,651,796,2,652,796,2,653,795,3,654,796,1,655,796,1,656,796,2,657,796,2,658,796,2]],
      [253, 255, 255, [652,788,1]],
      [253, 255, 255, [653,788,1]],
      [253, 255, 255, [654,788,2,655,788,2,656,788,1,657,788,1]],
      [254, 253, 252, [656,1017,2,657,1017,2]],
      [253, 255, 255, [658,788,2,659,789,1]],
      [253, 253, 249, [664,1015,2,665,1015,4,666,1016,2]],
      [255, 242, 230, [666,756,1]],
      [252, 252, 249, [666,1011,1]],
      [254, 253, 254, [668,1017,2,669,1016,4,670,1016,4]],
      [255, 255, 255, [671,753,1]],
      [254, 255, 253, [672,1016,4,673,1016,4,674,1018,1]],
      [254, 254, 253, [677,870,2,678,871,1,679,871,2,680,871,2,681,871,2]],
      [255, 254, 252, [684,1018,3,685,1018,3]],
      [244, 246, 244, [688,1015,2,689,1015,2,690,1015,2]],
      [253, 255, 255, [689,1018,1,689,1020,1,690,1018,3]],
      [253, 255, 255, [694,956,1]],
      [253, 255, 255, [694,955,1]],
      [255, 250, 239, [694,961,2,695,961,3,696,963,1]],
      [196, 195, 200, [694,1014,2,695,1014,2,696,1012,3,697,1012,1]],
      [255, 252, 245, [695,1018,3,696,1018,3]],
      [255, 255, 255, [696,936,1]],
      [253, 255, 255, [696,949,1]],
      [253, 255, 255, [696,939,2,697,940,2]],
      [249, 255, 255, [696,992,1,697,992,1]],
      [252, 255, 252, [697,1010,1]],
      [255, 255, 255, [697,767,1]],
      [253, 255, 255, [697,942,1]],
      [253, 255, 253, [697,1014,1,698,1013,2,699,1013,2,700,1013,2,701,1013,2,702,1013,2,703,1013,2]],
      [253, 255, 253, [698,1016,2]],
      [250, 249, 232, [698,963,1,699,963,1,700,963,2]],
      [255, 251, 248, [700,759,2,701,759,2,702,759,1]],
      [255, 255, 252, [700,1018,1,701,1016,3,702,1017,2,703,1017,2,704,1017,2]],
      [255, 250, 227, [701,951,1]],
      [255, 253, 252, [702,916,1]],
      [255, 250, 227, [702,952,1]],
      [252, 255, 252, [702,981,1]],
      [241, 240, 243, [702,1010,2,703,1010,2,704,1010,3,705,1011,2,706,1011,3,707,1011,4,708,1013,1]],
      [255, 255, 253, [703,916,1]],
      [255, 255, 253, [703,939,1]],
      [255, 255, 253, [703,915,1]],
      [218, 211, 202, [703,925,1,704,925,1]],
      [255, 252, 235, [703,963,1,704,963,1]],
      [253, 255, 253, [704,966,2]],
      [255, 255, 237, [704,961,2,705,961,1]],
      [255, 255, 255, [704,965,1,705,965,1]],
      [254, 255, 254, [705,696,1,706,688,2,706,693,6,707,686,11,708,685,2,708,690,2]],
      [249, 251, 249, [706,1018,3,707,1018,3]],
      [253, 253, 249, [707,992,3,708,992,3]],
      [255, 255, 253, [707,991,1]],
      [255, 255, 253, [708,989,2]],
      [192, 178, 177, [708,995,2,709,995,2]],
      [255, 255, 255, [709,989,1]],
      [255, 255, 255, [709,987,1]],
      [236, 239, 245, [710,1005,1,711,1006,1]],
      [254, 255, 254, [710,1014,2,711,1014,3,712,1014,3,713,1014,3]],
      [255, 255, 255, [711,985,1]],
      [255, 255, 255, [712,985,1]],
      [254, 253, 255, [712,1018,3]],
      [251, 255, 254, [713,977,1]],
      [251, 255, 254, [713,978,1]],
      [255, 255, 255, [713,985,1,714,985,1]],
      [255, 255, 255, [715,985,1]],
      [255, 254, 252, [715,1016,3,716,1016,3,717,1016,3]],
      [214, 213, 218, [719,1005,1]],
      [253, 253, 252, [719,1016,3,720,1016,3,721,1017,2,722,1017,1]],
      [255, 255, 253, [720,1009,1]],
      [252, 255, 250, [723,958,1]],
      [204, 196, 201, [723,1006,1]],
      [219, 214, 219, [725,1005,2,726,1005,2]],
      [254, 253, 248, [725,1016,3,726,1016,3,727,1016,3,728,1017,2]],
      [246, 252, 255, [727,1005,1,728,1005,1]],
      [252, 254, 250, [731,1015,2,732,1015,2,733,1015,2]],
      [209, 208, 201, [731,759,1]],
      [239, 239, 237, [734,757,1]],
      [254, 252, 253, [734,1018,1]],
      [197, 190, 188, [734,1007,1,735,1007,1]],
      [152, 139, 134, [734,1017,1]],
      [254, 255, 252, [736,1013,1,737,1013,4,738,1014,3,739,1015,2,740,1015,2,741,1014,3,742,1013,4]],
      [253, 252, 253, [736,1017,2]],
      [253, 254, 245, [736,954,2,737,954,2]],
      [255, 252, 234, [740,963,2]],
      [253, 255, 253, [743,1013,1]],
      [254, 250, 231, [745,965,1]],
      [251, 254, 252, [747,978,2,748,978,2,749,977,3,750,977,3,751,978,2]],
      [255, 254, 255, [748,1021,1]],
      [254, 255, 253, [749,1018,3,750,1018,3,751,1018,3,752,1020,1]],
      [255, 255, 255, [751,1013,1,752,1013,1,753,1013,1]],
      [255, 255, 255, [754,1013,1,755,1013,1]],
      [252, 253, 247, [753,1017,2,754,1016,3,755,1016,3,756,1016,3,757,1016,2]],
      [255, 254, 255, [756,1013,1]],
      [255, 255, 253, [757,1013,1]],
      [255, 255, 255, [758,1013,1,759,1013,1,760,1013,1,761,1013,1]],
      [250, 244, 223, [758,973,1,759,974,1]],
      [253, 254, 252, [759,1017,2,760,1016,3,761,1016,3,762,1016,3]],
      [255, 255, 255, [765,1016,1]],
      [254, 254, 254, [770,970,1]],
      [254, 254, 253, [773,1016,2,774,1016,3,775,1016,3]],
      [255, 255, 251, [776,1014,3,777,1013,4,778,1015,2]],
      [254, 254, 253, [779,1016,2,780,1016,3,781,1017,2]],
      [250, 253, 251, [779,1009,4,780,1008,6,781,1012,2,782,1011,3,783,1011,2,784,1011,2,785,1011,1,786,1011,2,787,1011,2]],
      [253, 255, 253, [782,1016,1,783,1016,2,784,1015,2]],
      [255, 255, 252, [783,1018,2,784,1018,3]],
      [255, 255, 255, [786,1015,1]],
      [255, 255, 254, [789,1016,1]],
      [252, 255, 254, [790,1018,1,791,1018,1]],
      [244, 243, 243, [792,968,2,793,968,2]],
      [255, 255, 255, [792,1017,2]],
      [254, 254, 254, [792,1007,1]],
      [255, 255, 255, [792,1019,1,793,1018,2,794,1018,2]],
      [254, 254, 254, [793,1008,1]],
      [255, 255, 255, [793,1007,1]],
      [201, 197, 193, [795,1012,1]],
      [253, 255, 255, [795,1013,1]],
      [255, 255, 255, [797,1019,2,798,1018,3,799,1018,2]],
      [251, 248, 251, [798,1016,2]],
      [233, 221, 213, [804,965,1]],
      [251, 255, 255, [804,1012,1]],
      [253, 255, 253, [805,1020,1,806,1018,3,807,1018,2]],
      [255, 255, 254, [808,1016,2,809,1016,3,810,1017,2]],
      [222, 224, 228, [811,962,3]],
      [253, 254, 252, [813,1016,2,814,1016,2,815,1016,2,816,1016,2,817,1016,1,818,1016,1,819,1016,1]],
      [236, 232, 239, [819,1010,1,820,1009,3,821,1009,3]],
      [254, 255, 255, [820,1007,1,821,1007,2,822,1007,2,823,1007,2,824,1008,2,825,1008,2,826,1008,2,827,1008,1,828,1008,1,829,1008,1,830,1007,2,831,1007,2,832,1007,2,833,1007,2,834,1007,2,835,1007,2,836,1007,2,837,1006,3,838,1006,3,839,1007,2,840,1007,2,841,1007,2,842,1007,1]],
      [254, 255, 254, [821,1013,1,822,1013,1]],
      [251, 252, 252, [823,1017,2,824,1017,2]],
      [254, 255, 255, [824,1013,1,825,1013,1,826,1013,1,827,1013,1]],
      [172, 168, 167, [826,962,1]],
      [253, 255, 255, [829,1013,1,830,1013,1,831,1013,1]],
      [149, 145, 142, [832,961,1]],
      [255, 252, 246, [832,1016,3,833,1016,3,834,1017,2]],
      [255, 254, 247, [841,1018,1,842,1016,3,843,1015,3,844,1015,2,845,1015,2,846,1015,2]],
      [252, 255, 255, [845,783,1,846,782,2,847,782,2,848,782,2,849,782,3,850,782,2,851,782,2,852,782,2,853,782,2]],
      [255, 255, 255, [846,1009,2]],
      [255, 255, 255, [846,876,2,847,873,4,848,874,2]],
      [254, 255, 253, [846,880,1,847,880,5,848,881,4]],
      [254, 254, 252, [847,1011,3,848,1011,4,849,1011,4,850,1011,4,851,1011,4,852,1011,4,853,1011,4,854,1011,4,855,1011,6,856,1010,7,857,1011,7,858,1014,5,859,1016,2]],
      [253, 255, 255, [847,866,1]],
      [253, 255, 255, [847,867,1]],
      [243, 239, 234, [848,955,1]],
      [253, 255, 255, [848,904,1]],
      [253, 255, 255, [848,1018,2]],
      [253, 255, 255, [848,905,1]],
      [255, 254, 250, [851,740,4,852,737,7,853,736,4,853,742,1]],
      [255, 250, 246, [851,765,2,852,764,4,853,764,5]],
      [246, 251, 248, [853,1018,3,854,1018,2]],
      [254, 255, 255, [854,778,3,855,780,1]],
      [255, 255, 255, [854,865,1]],
      [253, 255, 255, [857,870,1]],
      [255, 255, 255, [858,953,1]],
      [171, 164, 157, [859,958,2,860,958,2]],
      [255, 255, 255, [860,952,1]],
      [254, 254, 249, [861,1016,3,862,1016,4,863,1018,3]],
      [247, 247, 247, [865,953,1]],
      [255, 254, 249, [867,1017,1,868,1016,3,869,1016,3]],
      [253, 254, 250, [875,1016,2,876,1016,1]],
      [255, 252, 239, [876,1018,4,877,1018,3,878,1019,1]],
      [252, 252, 251, [879,1018,2,880,1018,3,881,1018,2]],
      [255, 255, 255, [880,918,1]],
      [255, 255, 255, [882,918,1]],
      [255, 255, 255, [883,918,1,884,918,1]],
      [255, 252, 248, [885,1018,3,886,1018,3]],
      [255, 255, 255, [888,919,1]],
      [255, 253, 248, [890,1018,3,891,1018,3]],
      [255, 255, 255, [890,919,1,891,919,1,892,919,1]],
      [253, 253, 251, [892,1017,2,893,1016,3,894,1016,2,895,1016,2]],
      [253, 255, 255, [894,920,1]],
      [254, 254, 254, [895,1018,1]],
      [253, 255, 255, [895,969,1]],
      [253, 255, 255, [896,969,1]],
      [253, 255, 255, [897,969,1]],
      [252, 255, 253, [897,1014,3,898,1014,3,899,1014,3,900,1014,3]],
      [253, 255, 255, [898,970,1]],
      [255, 255, 255, [899,970,1]],
      [255, 251, 249, [900,1018,3,901,1018,3,902,1018,3]],
      [254, 255, 254, [904,968,2,905,967,3,906,967,2,907,966,3,908,966,3,909,966,2,910,966,2,911,966,2,912,966,2,913,966,1,913,969,2,914,965,5,915,965,4]],
      [226, 226, 224, [905,408,1]],
      [253, 255, 251, [906,56,2]],
      [253, 254, 252, [906,1017,2,907,1017,2]],
      [255, 255, 251, [908,1010,2,909,1010,2,910,1010,1,911,1010,1]],
      [255, 255, 253, [909,1016,3,910,1016,3,911,1016,3]],
      [255, 255, 255, [913,1010,1]],
      [200, 202, 201, [913,410,2]],
      [255, 255, 253, [913,1018,1,914,1018,2,915,1017,3,916,1017,2]],
      [255, 255, 255, [914,1010,1,915,1010,1]],
      [252, 255, 255, [914,982,1]],
      [253, 255, 253, [917,1009,1]],
      [254, 254, 254, [918,1017,2,919,1017,2,920,1017,2]],
      [253, 255, 255, [919,1001,1]],
      [255, 255, 255, [920,919,1]],
      [253, 255, 253, [921,1019,1]],
      [253, 255, 253, [921,1020,1]],
      [253, 254, 254, [922,1001,1,923,1000,2,924,1000,2,925,1000,2,926,1000,2,927,999,3,928,999,2,929,999,1,930,999,2,931,999,2,932,999,1,933,998,2,934,999,1,935,999,2,936,998,2,937,999,2,938,999,3,939,999,3,940,999,2,941,999,1,942,999,1]],
      [249, 251, 250, [924,837,1]],
      [248, 246, 230, [924,833,3]],
      [252, 255, 254, [925,837,2]],
      [249, 254, 255, [926,839,1]],
      [254, 251, 247, [926,1016,3,927,1016,3]],
      [253, 255, 255, [927,1020,1]],
      [253, 255, 255, [927,1019,1]],
      [253, 255, 255, [927,1010,1]],
      [252, 255, 255, [928,1018,2,929,1018,3,930,1020,1]],
      [253, 255, 255, [928,1011,1,929,1011,1]],
      [254, 254, 252, [930,1013,1,931,1011,4,932,1011,4,933,1011,2,933,1014,1,934,1011,2,934,1014,1,935,1011,4,936,1011,4,937,1011,4,938,1011,4,939,1011,4,940,1011,6,940,1018,1,941,1012,2,941,1015,3,942,1012,7,943,1011,8,944,1011,4,945,1011,4,946,1012,1,946,1014,1]],
      [253, 255, 255, [931,907,2]],
      [255, 255, 255, [931,686,1]],
      [255, 250, 238, [934,187,1]],
      [255, 255, 251, [934,1018,3,935,1018,3,936,1019,1]],
      [255, 255, 252, [936,1017,2,937,1016,3,938,1016,3]],
      [248, 238, 228, [937,827,2]],
      [254, 252, 232, [942,827,1]],
      [255, 253, 235, [943,195,1]],
      [254, 253, 248, [944,1016,2,945,1016,2,946,1015,3,947,1015,3,948,1015,2,949,1015,2,950,1013,3]],
      [253, 255, 254, [947,1011,2,948,1011,1,949,1011,2,950,1011,2]],
      [254, 255, 253, [952,1015,2,953,1014,3,954,1014,3,955,1013,3,956,1012,3,957,1012,2]],
      [253, 255, 255, [958,864,1]],
      [253, 255, 255, [959,864,2]],
      [254, 254, 252, [959,1017,2,960,1017,2]],
      [253, 255, 255, [961,865,1]],
      [252, 255, 252, [961,1017,1,962,1017,2,963,1018,1]],
      [253, 254, 252, [962,1013,1,963,1011,4,964,1011,4,965,1011,4,966,1011,4,967,1011,4,968,1011,4,969,1011,4,970,1012,4,971,1014,2,972,1014,2,973,1014,1]],
      [253, 255, 255, [962,865,1]],
      [253, 255, 255, [963,1019,1,964,1019,2]],
      [253, 255, 255, [965,865,1]],
      [255, 255, 253, [967,866,1]],
      [255, 255, 250, [967,1018,1,968,1017,2,969,1017,2]],
      [253, 255, 255, [968,866,1]],
      [254, 255, 250, [971,1016,1,972,1016,1,973,1016,1]],
      [255, 255, 255, [971,1018,2,972,1018,3,973,1018,3]],
      [255, 255, 253, [974,866,1,975,866,1]],
      [255, 254, 251, [976,865,1,977,865,1]],
      [252, 255, 250, [978,1014,2,979,1014,3,980,1014,3,981,1014,2]],
      [253, 255, 255, [986,862,1]],
      [253, 255, 255, [986,863,1]],
      [255, 255, 253, [987,1019,1,988,1018,2]],
      [254, 253, 253, [989,1017,2,990,1016,3,991,1016,2,992,1016,3]],
      [236, 235, 233, [997,1014,3,998,1014,3,999,1014,3,1000,1014,3,1001,1014,3,1002,1013,4]],
      [252, 255, 251, [1001,1019,2,1002,1018,3,1003,1018,3]],
      [248, 250, 249, [1004,1017,1]],
      [255, 255, 254, [1005,1016,2,1006,1016,3,1007,1017,3,1008,1018,2]],
      [255, 255, 255, [1006,1009,1,1007,1009,1]],
      [253, 255, 255, [1008,1009,1]],
      [253, 255, 255, [1008,1010,1]],
      [169, 163, 158, [1009,352,1]],
      [255, 252, 248, [1011,1010,1]],
      [255, 255, 255, [1018,955,1]],
      [255, 255, 253, [1021,1014,1,1022,1013,2,1023,1013,2]]
    ] };
    /* chapter 3's numbers for a man set on a seat by his own body (its c_cast.js MASTER_DOWN, PHO_BREATH, PHO_TALK_HEAD,
       each with its reason there): the bottom on the seat, each leg solved down to the floor, the feet laid flat */
    const MASTER_DOWN = { hipOver: 0.11, sink: 0.01, sole: GROUND_SOLE, edge: -9, flat: true };
    const PHO_BREATH = 6;
    /* (R42: his seated rest sat up straight, his pelvis turned back 11 of its 17.7 degrees (to 6.7, a man sitting upright:
       turned at the spine instead, by the same 11 shared out, the trunk came back only 4, measured), his neck as the take
       holds it on the straightened trunk (27.6 less 11: 16.6 forward, his face level); his hands laid on
       his thighs where his arms reach them with the elbow bent (restHands 'lap'), since the trunk's turn carries his
       shoulders back off his knees; his seated talk's shrug let down whole) */
    const PHO_SIT_UPRIGHT = { Sit_to_Stand_Transition_M: { hips: -11, trunk: 0, head: 0 } };
    const PHO_SIT_SHOULDERS = { Sitting_Answering_Questions: 1 };
    /* (R77: the drape over his left arm goes with the arm as his hand is laid on his thigh: assemble.py's K.follow) */
    const PHO_SIT_HANDS = { how: 'lap', follow: { L: ['DrapeArm', 'DrapeHang'] } };
    const PHO_TALK_HEAD = { Sitting_Answering_Questions: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (standing, his talk's head held as his seated one is: Chad's word on chapter 3's, "greatly restrained", v26.3; its
       head swings 9 cm side to side in its own file: tools/probes/takepath.mjs) */
    const PHO_STAND_HEAD = { Talk_with_Hands_Open: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (R64, Chad, 18 Nov 2026: "not just pho's sitting posture, but also fix his standing posture, talking posture, and
       other postures he uses in this particular chapter". MEASURED first on his standing body in the takes it wears here
       (tools/probes/posture.mjs, the tracker's log): at rest on the end of his rise his head is held 15.1 degrees back
       of his bind pose's 2.5, in his talk 17.8, a chin raised as if looking down his nose at her (a face tilted up reads
       as disdain, v6.9); his talk lifts his right collar bone 5.3 degrees; his push (the cast's 0.50 to 0.95 s) lifts both
       collar bones 32 and 35 degrees, 9 and 13 cm, his shoulders at his ears. So his neck is turned forward 12 degrees in
       his rest and his talk (back to within a degree of his bind pose), his talk's shoulders let down whole, and his push's
       let down 0.6 of the way, measured over the part of the take he plays: a man who thrusts both hands out does lift
       and bring his shoulders forward, by a little, not to his ears) */
    /* (R76, Chad, 18 Nov 2026: "Grandmaster pho's standing pose and standing talking pose is still hunchbacked and not
       natural". Measured on 21u: his trunk leans 4.3 degrees forward at rest and 5.9 in his talk (8.7 at most); turned
       back by as much, his neck given it back so his face stays where R64 set it) */
    /* (R88, Chad, 19 Nov 2026: "grandmaster pho's shoulders are still too bent forward, make it more natural", with his
       photograph of play from his side. MEASURED on build 33 (tools/probes/posture.mjs LIVE, the blessing, his standing
       body with every lay): his trunk 2.6 degrees from the vertical and his head over his shoulders, but his back bent
       53 degrees between its lower and upper parts, the upper back 20.5 degrees further forward than his own scan's bind
       pose, and his right shoulder's top 10 cm further forward: the rounded back of the photograph. So the upper back is
       opened (`chest`: the last two spine bones turned back), the whole trunk given back the lean that takes away
       (`trunk`), the neck's forward turn eased and the skull's nod given the rest, so his head stays over his shoulders
       and his face where it was (`head`, `nod`), and his right collar bone drawn back (`clavR`). The numbers chosen by
       photographs from his side at several strengths, and measured again: the tracker's log) */
    /* (CHOSEN on build 35's code with the arms' lay (r88b, 19 Nov): photographed from his left at the order to take the holy
       water, four ways, each full size, and laid beside the people standing in line at the offering tables in Chad's own
       photograph 10 of the Wai Kru (upright, the head level over the shoulders, the arms hanging at the sides, the hands
       at the front of the thigh). R76's stance (trunk -4.5, head 16.5) dropped his chin to his chest over a rounded back;
       the opened back without `arms` swung his left forearm out ahead of his thigh, the hand spread (build 34); with
       `arms`, chest -15 and the rest below (V1a) stand as the photograph stands, his upper arm 3.8 degrees behind the
       vertical and his forearm 7.5 forward, the hand at his thigh; chest -20 (V2a) looked the same with his head a
       little further back, and the milder of the two was taken (v22.0: never overshoot). His talk takes the same,
       its own lean kept (its trunk and head one and a half degrees more, as R76 had them)) */
    /* (R93, 19 Nov: his collar bones let down 3 degrees each, "very slightly", standing and talking: chosen beside 5 by
       photographs from his side and from where his shot was taken) */
    const PHO_STAND_UPRIGHT = { Sit_to_Stand_Transition_M: { trunk: 0.5, chest: -15, head: 10, nod: 9, clavR: 10, arms: 1, dropL: 3, dropR: 3 },
      Talk_with_Hands_Open: { trunk: -1, chest: -15, head: 11.5, nod: 9, clavR: 10, arms: 1, dropL: 3, dropR: 3 } };
    /* (R92, 19 Nov: and his own legs, which his robe follows, straightened to 5 degrees at the knee (kneesLay `own`)) */
    const PHO_KNEES = { takes: { Sit_to_Stand_Transition_M: 1, Talk_with_Hands_Open: 1 }, win: { Sit_to_Stand_Transition_M: [5.2, 99] }, bend: 4, max: 0.012, own: 5 };
    const PHO_STAND_SHOULDERS = { Talk_with_Hands_Open: 1, mage_soell_cast_3: 0.6 };
    const PHO_STAND_SHWIN = { mage_soell_cast_3: [0.5, 0.45] };
    /* (R77: his left arm and the drape over it held at his rest's while he talks standing, so the cloth covers the arm) */
    const PHO_ARM_REST = { takes: { Talk_with_Hands_Open: 1 }, from: ['Sit_to_Stand_Transition_M', 6.0],
      re: /^(mixamorig:?)?Left(ForeArm|Hand|Hand(Thumb|Index|Middle|Ring|Pinky)\d)$|^(mixamorig:?)?LeftArm$|^Drape(Arm|Hang)$/ };
    /* (R77: standing, his left arm and the drape over it let hang 7 degrees out from his side, clear of the robe at his hip) */
    const PHO_ARM_OUT = { takes: { Sit_to_Stand_Transition_M: 1, Talk_with_Hands_Open: 1 }, win: { Sit_to_Stand_Transition_M: [5.2, 99] },
      deg: 7, follow: ['DrapeArm', 'DrapeHang'] };
    /* the shoulders let down in every standing and talking take (v26.8, every standing person) */
    const STAND_SHOULDERS = { Idle_3: 1, Stand_and_Chat: 1, Listening_Gesture: 1, Talk_with_Hands_Open: 1, Talk_with_Right_Hand_Open: 1, Walking: 1 };
    /* LOOK D on Grandmaster Pho (Chad's pick, v24.52: "unlit, except for the robe"), chapter 3's own (c_cast.js lookD,
       its reason there): his face, hands and beads laid back at their own colour after the tone mapping, the robe lit.
       `level` is the hour's: under the tube he is lit as the room is (1); by the lamp alone the laid colour is dimmed */
    const phoLook = { k: { value: 1 }, level: { value: 1 }, lift: { value: 0.55 } };
    /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen during
       gameplay"): his body sheet holds small islands of skin colour lying inside the white of the robe, and look D draws
       whatever its test calls skin unlit, so each one stood out of the lit robe as an orange speck (in his file's own lit
       look they show too, fainter). His file is unchanged: the islands (PHO_FLECKS, c_phofleck.js, found in his sheet by
       tools/phoflecks.py) are painted once on a canvas in the colour of the robe round each, and laid over his sheet where
       its colour is read (premultiplied: a cell is the robe's colour, opaque, or nothing). */
    let phoFleckTex = null;
    function phoFleck() {
      if (phoFleckTex) return phoFleckTex;
      const N = PHO_FLECKS.size, cv = document.createElement('canvas'); cv.width = cv.height = N;
      const g = cv.getContext('2d');
      for (const [r, gr, b, R] of PHO_FLECKS.f) { g.fillStyle = `rgb(${r},${gr},${b})`; for (let i = 0; i < R.length; i += 3) g.fillRect(R[i + 1], R[i], R[i + 2], 1); }
      const t = tex(new THREE.CanvasTexture(cv)); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
      return (phoFleckTex = t);
    }
    function lookD(model) {
      model.traverse(q => { if (!q.isMesh) return;
        const list = [].concat(q.material).map(m0 => { const mt = m0.clone(); mats.push(mt); const WHOLE = /\(face and hands\)$/.test(m0.name);
          mt.onBeforeCompile = (sh) => { sh.uniforms.uK = phoLook.k; sh.uniforms.uLevel = phoLook.level; sh.uniforms.uLift = phoLook.lift;
            if (!WHOLE && mt.map) { sh.uniforms.uFleck = { value: phoFleck() };
              sh.fragmentShader = 'uniform sampler2D uFleck;\n' + sh.fragmentShader.replace('#include <map_fragment>',
                '#include <map_fragment>\n{ vec4 fl = texture2D(uFleck, vMapUv); diffuseColor.rgb = diffuseColor.rgb * (1.0 - fl.a) + fl.rgb * diffuse; }'); }
            sh.fragmentShader = 'uniform float uLevel;\nuniform float uK;\nuniform float uLift;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
              + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
              + 'float kS = clamp(uK * skn, 0.0, 1.0); vec3 unl = diffuseColor.rgb * uLevel;\n'
              + 'gl_FragColor.rgb += (1.0 - kS) * uK * uLift * max(vec3(0.0), unl * 0.9 - gl_FragColor.rgb);\n'
              + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, unl, kS);'); };
          mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ':fleck'); return mt; });
        q.material = Array.isArray(q.material) ? list : list[0]; });
    }
    /* R33 (23 Nov; R28, "brown bits" on his robe in the fight): chapter 4's cover takes the robe's islands of SKIN colour;
       the scan also left small DARK specks in the robe's white (grey, brown and black dots, seen on his front and back at
       three metres on a phone). They are found in his sheet by tools/phodark.py (PHO_DARK5, c_phodark.js: on pieces that
       paint mostly robe, clear of the bead strands) and painted into the same cover once, in the robe's colour round each:
       chapter 4's look D, its mask and his file unchanged. */
    { const fleck0 = phoFleck;
      phoFleck = function () { const t = fleck0();
        if (t && !t.userData.dark5 && typeof PHO_DARK5 === 'object' && t.image && t.image.getContext) {
          const g = t.image.getContext('2d'), s = t.image.width / PHO_DARK5.size;
          for (const [r, gr, b, R] of PHO_DARK5.f) { g.fillStyle = `rgb(${r},${gr},${b})`; for (let i = 0; i < R.length; i += 3) g.fillRect(R[i + 1] * s, R[i] * s, R[i + 2] * s, s); }
          t.userData.dark5 = true; t.needsUpdate = true; }
        return t; }; }
    /* and chapter 3's numbers for him seated CROSS-LEGGED on a cushion (its hall, v26.18: masters/v26.18/pho), with the
       white cloth over his crossed legs (w3pholap, a declared reuse) */
    const CROSS = { low: 'Sit_Cross_Legged_on_Floor', at: 1.25, hips: 0.0848, hem: 0.276, ringY: 0.262, reach: 0.08, middle: [-0.0035, -0.1226], lap: 'w3pholap', ref: ['Sit_to_Stand_Transition_M', 0.15],
      takes: { Sit_to_Stand_Transition_M: { lean: 3, t0: 0.02, t1: 0.3 }, Sitting_Answering_Questions: { lean: 1, sway: 0.4 }, Sit_Cheer_with_Left_Hand: { lean: 1, t0: 0, t1: 0.2 } },
      hands: { hold: /^Sitting_Answering_Questions$/, R: { x: -0.19, z: 0.32, yaw: 0.25, slope: 1.2, pole: [-0.35, -0.25, -0.9] }, L: { x: 0.02, z: 0.17, yaw: -1.0, slope: 0.3, pole: [0.8, -0.35, -0.5], follow: ['DrapeArm', 'DrapeHang'] } } };
    /* R33 (23 Nov 2026; R28, the brown bits on his robe). WRITTEN BY tools/phodark.py from his body sheet (texture_0,
       sha1 2410efbf776b5dbf2145e67647ec0415ba08b5d8, the same bytes in assets/pho.glb and assets/p5pho.glb), never by hand: 249 small dark specks lying
       inside the white of his robe (4096 x 4096), robe all round each, on pieces that paint 20% robe or more, clear of the bead
       strands, never a line (a seam), grown by 2 texels, as runs [row, first cell, cells] of a 1024 x 1024 mask, each in the
       colour of the robe round it (sRGB).
       c_cast.js paints them over chapter 4's own cover (PHO_FLECKS) once; his file is unchanged. */
    const PHO_DARK5 = { size: 1024, f: [
      [189, 180, 178, [4,44,1,5,43,2,6,43,1,7,43,2,8,44,1]],
      [218, 219, 224, [4,297,1,5,296,3,6,296,2]],
      [230, 227, 227, [5,360,2,6,360,2,7,360,2,8,360,2]],
      [208, 197, 198, [5,334,2]],
      [218, 209, 211, [5,199,2,6,199,3,7,199,2,8,199,2]],
      [198, 192, 192, [5,444,1,6,444,2]],
      [210, 206, 205, [5,477,2,6,476,3,7,476,2,8,476,2]],
      [234, 233, 232, [5,641,1,6,641,2,7,642,1,8,642,1]],
      [215, 212, 208, [6,663,2,7,663,2]],
      [185, 177, 172, [6,749,2,7,749,1]],
      [157, 154, 146, [6,766,1]],
      [224, 223, 220, [6,858,2,7,858,1]],
      [244, 244, 240, [5,916,1,6,916,1,7,916,1,8,916,1]],
      [219, 223, 220, [6,139,1,7,138,2,8,138,1]],
      [236, 238, 236, [6,93,2,7,93,2]],
      [227, 225, 221, [6,377,1,7,377,1,8,377,1]],
      [221, 218, 220, [6,769,1,7,769,1,8,769,1]],
      [241, 239, 239, [6,202,1,7,201,2]],
      [182, 178, 176, [6,335,1,7,334,2,8,334,2]],
      [180, 180, 182, [6,412,2,7,412,2,8,412,2]],
      [200, 199, 200, [6,459,2,7,459,2,8,459,2]],
      [196, 194, 188, [6,91,1,7,91,2,8,90,3]],
      [190, 189, 187, [7,444,2,8,444,2]],
      [204, 200, 193, [6,765,1,7,765,2,8,765,2]],
      [243, 245, 243, [6,1006,1,7,1006,2]],
      [211, 208, 208, [7,296,2]],
      [185, 177, 174, [7,578,1,8,578,1]],
      [244, 246, 246, [7,835,2,8,836,1]],
      [224, 222, 223, [7,880,1,8,880,1]],
      [228, 225, 221, [8,664,1]],
      [235, 233, 232, []],
      [192, 189, 189, [9,465,2,10,465,2,11,465,1]],
      [214, 214, 213, [10,28,2,11,28,1]],
      [208, 212, 211, [10,862,1,11,861,2,12,861,2,13,861,2,14,862,1]],
      [164, 160, 159, [10,467,1,11,466,2,12,466,2]],
      [163, 161, 159, [11,714,4,12,714,4,13,716,1]],
      [224, 224, 222, [12,27,3,13,27,3,14,28,1]],
      [242, 246, 246, [12,167,2]],
      [228, 230, 227, [11,860,1,12,860,1]],
      [194, 192, 195, [13,714,2,14,715,2,15,713,4,16,713,5,17,715,1,18,714,3,19,713,4,20,713,4,21,714,2]],
      [224, 222, 223, [13,733,1,14,733,2,15,733,3,16,733,3,17,733,2,18,733,2]],
      [216, 214, 211, [14,27,1]],
      [208, 208, 211, [13,184,1,14,184,1]],
      [236, 237, 235, [14,358,3,15,358,3,16,358,2,17,358,3,18,357,3,19,357,3,20,356,5,21,357,4,22,357,5,23,357,5,24,358,4,25,361,1]],
      [221, 225, 228, [14,860,2,15,861,1]],
      [227, 232, 232, [15,862,2,16,861,3,17,861,2,18,861,2]],
      [198, 196, 193, [15,185,1,16,184,3,17,184,3,18,184,4,19,184,4,20,185,2,21,185,2]],
      [215, 216, 214, [17,341,3,18,340,4,19,340,5,20,340,3]],
      [237, 237, 237, [19,168,2,20,168,2]],
      [227, 226, 225, [20,732,2,21,731,2,22,731,2]],
      [190, 190, 192, [20,860,2,21,860,2,22,860,1]],
      [246, 247, 244, [23,862,1]],
      [236, 238, 237, [23,733,1,24,733,2,25,733,2,26,734,1]],
      [240, 242, 241, [24,357,1,25,357,1]],
      [228, 226, 224, [44,115,2]],
      [231, 232, 231, [45,114,2,46,114,3,47,114,3,48,115,2]],
      [235, 236, 233, [46,111,1]],
      [227, 228, 225, [46,110,1,47,109,3,48,110,3,49,111,2]],
      [211, 215, 214, [79,48,2,80,48,2]],
      [234, 236, 236, [86,709,1,87,709,1]],
      [228, 226, 223, [87,987,1,88,987,2,89,987,3,90,988,2,91,988,2,92,988,3,93,989,2]],
      [236, 237, 236, [88,707,1,89,707,2,90,707,2,91,707,2,92,708,1]],
      [238, 236, 234, []],
      [202, 201, 203, [94,989,2]],
      [232, 230, 227, [95,749,2,96,747,4,97,746,5,98,746,5,99,745,5,100,745,4,101,745,3,102,745,2]],
      [245, 245, 243, [95,747,1,96,746,1]],
      [221, 222, 221, [99,68,2,100,68,2,101,67,3,102,68,1]],
      [219, 222, 224, [103,976,2,104,975,6,105,975,7,106,977,5]],
      [216, 214, 213, [114,419,1,115,416,5,116,416,6,117,417,5,118,418,4,119,419,2]],
      [196, 193, 195, [115,1011,1,116,1011,2,117,1011,2]],
      [216, 216, 218, [117,1013,1,118,1012,2]],
      [206, 204, 204, [119,1012,2,120,1011,3,121,1011,2]],
      [235, 237, 237, [143,238,3,144,238,3]],
      [237, 239, 237, [182,504,3,183,504,3,184,505,2]],
      [240, 242, 241, [186,505,1,187,505,1]],
      [215, 213, 212, [189,51,2,190,51,3,191,51,3,192,52,2,193,52,1]],
      [198, 197, 196, [193,53,1,194,52,3,195,52,4,196,52,4,197,53,2]],
      [206, 206, 206, [198,54,3,199,54,4,200,54,3]],
      [244, 244, 241, [201,652,2,202,652,3,203,652,3,204,653,2,205,653,2,206,653,1]],
      [210, 209, 210, [201,56,1,202,56,3,203,56,3,204,56,3,205,57,1]],
      [214, 214, 214, [203,53,1,204,52,3,205,53,2,206,53,2]],
      [211, 208, 207, [205,58,1,206,57,2,207,57,2,208,57,2]],
      [234, 233, 232, [215,27,3,216,23,7,217,19,10,218,19,9]],
      [207, 207, 206, [217,29,3,218,28,3,219,29,1]],
      [237, 238, 236, [217,32,2,218,32,2]],
      [220, 219, 218, [219,20,4,219,28,1,220,20,12,221,24,8,222,25,4]],
      [228, 226, 225, [219,19,1,220,15,5,221,14,9,222,14,9,223,15,2,223,18,3]],
      [231, 229, 228, [220,9,4,221,8,5,222,8,5,223,7,4,223,12,1]],
      [208, 209, 210, [220,32,1,221,32,2,222,31,2]],
      [213, 212, 213, [222,63,2]],
      [238, 238, 237, [222,5,1,223,2,5,224,2,4]],
      [224, 224, 224, [231,968,2,232,968,3,233,968,3]],
      [189, 186, 187, [234,968,2]],
      [216, 216, 216, [234,970,1,235,969,3,236,969,3,237,969,2]],
      [205, 203, 203, []],
      [187, 186, 184, [235,968,1,236,968,1,237,968,1]],
      [207, 206, 206, [240,152,2,241,151,4,242,151,4,243,151,4,244,151,4,245,151,4,246,151,4,247,151,4,248,151,4,249,151,4]],
      [236, 234, 231, [242,953,2,243,954,1]],
      [238, 236, 237, [261,1017,1,262,1017,1]],
      [240, 240, 240, [286,958,2,287,958,1]],
      [225, 223, 224, []],
      [238, 233, 232, [288,958,1,289,957,2,290,957,2,291,957,1,292,957,1]],
      [218, 217, 218, [301,153,1,302,153,1,303,153,1,304,153,1]],
      [250, 248, 246, [306,152,1]],
      [215, 217, 216, [341,562,1,342,562,1,343,562,1]],
      [250, 248, 250, [393,1015,1,394,1015,1]],
      [228, 222, 220, [501,1005,4,502,1006,3,503,1006,2,504,1006,3,505,1006,3,506,1006,4,507,1006,4,508,1007,3,509,1006,4,510,1005,6,511,1005,5]],
      [223, 215, 213, [512,1007,3,513,1007,3,514,1007,3,515,1007,3,516,1007,2,517,1006,4,518,1006,5,519,1006,4,520,1007,3,521,1007,3,522,1008,3]],
      [215, 213, 212, [523,1007,3,524,1007,4,525,1007,4,526,1008,3,527,1010,1]],
      [200, 195, 193, [528,1008,2,529,1008,3,530,1008,3,531,1009,2]],
      [230, 225, 224, [531,1008,1,532,1008,2,533,1007,3,534,1006,4]],
      [223, 223, 221, [537,571,1,538,571,2,539,571,2,540,571,2,541,571,1]],
      [229, 230, 229, [541,572,1,542,571,2,543,572,1]],
      [218, 220, 221, [541,1007,2,542,1006,4,543,1008,1]],
      [224, 221, 219, [546,572,1,547,572,1]],
      [208, 207, 208, [546,568,2,547,568,4,547,573,1,548,567,7,549,567,7,550,569,5,551,571,2,552,571,3,553,571,3,554,573,1]],
      [212, 210, 210, [555,573,2,556,573,3,557,572,4,558,573,4,559,573,4,560,573,5,561,574,5,562,577,2]],
      [220, 223, 223, [562,732,3,563,732,3,564,731,3,565,731,3,566,731,2]],
      [230, 231, 229, [571,732,1,572,731,3,573,731,3,574,731,3,575,731,2,576,731,2]],
      [223, 222, 219, [573,726,2,574,726,3,575,726,4,576,726,4,577,726,3,578,726,3,579,727,1]],
      [238, 239, 237, [573,728,2,574,729,1,575,730,1,576,730,1]],
      [241, 240, 240, [579,729,2,580,729,2]],
      [210, 208, 209, [587,588,1,588,588,1,589,588,1]],
      [225, 229, 228, [594,276,1,595,276,2,596,276,2]],
      [220, 222, 221, [597,275,2,598,275,2]],
      [224, 219, 217, [598,282,1,599,281,3,600,282,1]],
      [220, 217, 215, [600,281,1,600,283,1,601,280,4,602,280,3,603,281,2]],
      [232, 231, 230, [600,279,2,601,277,3,602,277,3,603,277,3,604,277,2]],
      [215, 209, 208, []],
      [211, 207, 206, [603,280,1,604,279,3]],
      [219, 220, 221, [602,276,1,603,275,2,604,274,3,605,275,1]],
      [238, 237, 237, [603,589,1,604,589,1]],
      [218, 222, 221, [603,722,1,604,722,2]],
      [211, 216, 215, [605,722,2,606,723,1]],
      [235, 233, 232, [605,588,2,606,588,3,607,589,2]],
      [211, 211, 210, [605,721,1,606,721,2,607,722,2,608,722,2,609,722,2]],
      [215, 218, 219, [605,273,2,606,273,2]],
      [200, 204, 205, [606,724,1,607,724,1,608,724,1]],
      [236, 235, 236, [606,275,1,607,274,2]],
      [218, 220, 222, [607,584,2,608,584,2,609,584,2]],
      [233, 232, 231, [608,271,2,609,270,3]],
      [225, 223, 221, [609,275,2]],
      [208, 205, 205, [609,273,2,610,272,3,611,271,3,612,271,3,613,271,4,614,271,5,615,267,9,616,266,10,617,266,5,617,273,3]],
      [203, 202, 200, [610,271,1]],
      [224, 226, 226, [610,584,2]],
      [238, 236, 236, [609,720,1,610,718,3,611,719,3,612,719,2]],
      [206, 205, 204, [610,275,2,611,274,4,612,274,3,613,275,1]],
      [210, 207, 206, []],
      [220, 216, 217, [612,721,1,613,720,3,614,721,2,615,721,2,616,722,1]],
      [215, 214, 214, [618,273,1]],
      [237, 236, 234, [618,272,1,619,272,1]],
      [234, 233, 232, []],
      [218, 212, 213, [620,266,2,621,266,3,622,267,2,623,266,3,624,264,6,625,263,6,626,264,3,627,263,4,628,264,3,629,265,2]],
      [224, 220, 223, [626,261,2,627,260,3,628,260,4]],
      [192, 186, 185, [626,263,1]],
      [221, 221, 222, [628,258,2,629,258,3]],
      [239, 238, 236, [630,214,3,631,212,5,632,211,5]],
      [237, 236, 233, [632,209,2,633,207,5,634,207,5]],
      [237, 237, 235, [636,870,3,637,870,3,638,870,3,639,870,3,640,871,2,641,871,2,642,871,2]],
      [235, 234, 232, [639,773,1,640,772,3,641,773,2,642,772,3,643,772,3,644,773,2,645,773,2,646,773,2,647,773,3,648,774,2]],
      [226, 229, 231, [644,934,2,645,932,5,646,932,4,647,932,5,648,933,5,649,935,2]],
      [227, 229, 232, [650,935,2,651,935,2]],
      [202, 207, 207, [658,935,1,659,934,2,660,934,2,661,934,2,662,934,2,663,935,1]],
      [239, 240, 241, [666,904,1,667,903,2,668,904,1]],
      [236, 239, 238, [670,908,2,671,908,3]],
      [235, 238, 237, [673,911,1,674,910,3]],
      [221, 223, 225, [675,926,1,676,925,2,677,925,3,678,925,2]],
      [209, 209, 210, [683,979,3,684,979,4,685,979,3,686,979,3,687,979,3,688,979,3,689,980,2]],
      [216, 218, 219, [685,987,2,686,987,3,687,987,5,688,987,9,689,989,8,690,989,8,691,991,5]],
      [231, 234, 233, [686,920,3,687,920,4,688,922,1]],
      [217, 218, 223, [689,1011,3,690,1011,3]],
      [244, 247, 247, [689,979,1,690,979,1]],
      [235, 236, 235, [690,1004,2,691,1003,3,692,1003,2,693,1003,2]],
      [241, 239, 237, [691,761,4,692,761,4,693,760,4,694,760,4,695,760,3,696,760,2]],
      [210, 210, 214, [691,1011,3,692,1011,3,693,1011,3,694,1011,3,695,1011,2]],
      [246, 251, 251, [694,766,2,695,767,1]],
      [211, 207, 205, [699,1007,2,700,1007,3,701,1007,3,702,1007,1,702,1009,1]],
      [219, 211, 207, [699,994,1,700,993,4,701,993,4,702,993,4,703,995,2]],
      [210, 204, 207, [702,1008,1,703,1007,3,704,1007,3,705,1007,2]],
      [225, 218, 214, [703,994,1,704,993,3,705,993,4,706,994,3,707,995,2]],
      [219, 214, 216, [706,1007,3,707,1007,3,708,1007,2,709,1007,1]],
      [234, 231, 224, [710,1007,2]],
      [191, 190, 189, [710,1009,1,711,1009,1]],
      [220, 214, 215, [711,1007,2]],
      [196, 194, 196, [712,1008,3,713,1008,3,714,1008,1]],
      [232, 227, 227, [717,1006,1,718,1006,2]],
      [225, 223, 224, [717,1007,2,718,1008,1,719,1006,3,720,1006,2]],
      [241, 243, 242, [717,762,1,718,761,2,719,762,1]],
      [232, 233, 232, [720,762,3,721,762,3,722,763,1]],
      [191, 187, 187, [721,1008,2]],
      [232, 230, 227, [722,762,1,723,762,2]],
      [209, 206, 209, [722,1006,2,723,1006,2]],
      [230, 222, 224, [729,1006,2,730,1006,3]],
      [244, 242, 236, [730,762,1,731,761,3]],
      [233, 229, 229, [731,756,2,732,755,3,733,755,2]],
      [211, 212, 214, [731,1008,3,732,1008,3,733,1008,2]],
      [226, 227, 227, [732,1006,2,733,1006,2]],
      [231, 229, 225, [732,761,1,733,760,3,734,759,3]],
      [230, 228, 221, [734,1016,1,735,1016,1]],
      [239, 240, 238, [734,755,1,735,754,2]],
      [225, 222, 221, [810,960,2,811,959,3,812,959,3,813,960,1]],
      [208, 206, 205, []],
      [230, 228, 228, [815,959,3,816,959,3,817,959,2,818,959,2,819,959,3,820,959,3,821,959,3,822,958,4,823,957,4,824,957,5,825,960,2]],
      [229, 228, 228, [825,958,2,826,957,4,827,957,4,828,958,3,829,959,2]],
      [226, 225, 225, [829,958,1,830,957,3,831,957,3,832,957,3,833,957,3,834,957,3,835,957,4,836,957,4,837,957,4,838,957,3,839,957,4,840,957,4]],
      [238, 241, 236, [886,205,1,887,204,2,888,204,3]],
      [231, 233, 232, [887,396,2,888,396,2,889,396,2]],
      [230, 232, 231, [888,398,2,889,398,2]],
      [233, 235, 235, [888,400,1,889,400,3,890,400,2]],
      [196, 199, 198, [890,388,3,891,388,3]],
      [241, 244, 244, [891,394,3,892,395,1]],
      [197, 203, 203, [891,392,2,892,391,4,893,392,3]],
      [240, 241, 240, [893,397,4,894,398,3,895,399,1]],
      [241, 243, 240, [893,402,2,894,402,2,895,402,2]],
      [230, 231, 228, [893,376,2,894,375,3]],
      [235, 234, 232, [894,407,1,895,406,2,896,406,2,897,406,2,898,405,3,899,405,3,900,406,1]],
      [220, 222, 219, [896,376,3,897,376,2,898,376,2]],
      [232, 234, 233, [897,401,3,898,401,2]],
      [196, 194, 194, [899,374,6,900,373,7,901,373,6,902,373,5,903,374,3,904,374,3,905,374,3,906,375,2]],
      [238, 240, 239, [899,396,2,900,396,2,901,397,1]],
      [230, 232, 230, [900,621,1,901,620,2,902,619,4,903,619,5,904,621,3]],
      [224, 227, 225, [901,176,2,902,176,3,903,176,3]],
      [235, 237, 237, [901,403,2,902,403,2]],
      [234, 236, 235, [901,87,2,902,87,2]],
      [222, 224, 223, [902,385,3,903,386,2,904,386,2]],
      [234, 236, 235, [902,408,1,903,408,1]],
      [183, 185, 184, [903,406,1,904,406,1]],
      [197, 196, 198, [903,373,1,904,373,1,905,373,1]],
      [213, 214, 213, [904,407,1,905,406,2,906,406,2,907,406,3,908,406,2]],
      [240, 242, 242, [904,398,1,905,398,2,906,398,2]],
      [233, 234, 235, [906,405,1,907,405,1]],
      [231, 230, 229, [906,409,1,907,409,2,908,408,3,909,408,3,910,408,3,911,408,2,912,408,2]],
      [242, 244, 244, [917,183,2,918,183,2]],
      [243, 244, 240, [925,969,2,926,969,1]],
      [227, 227, 224, [927,969,1,928,968,4,929,968,4,930,968,3,931,967,4,932,969,2,933,969,2]],
      [238, 237, 236, [963,851,2,964,851,2]],
      [229, 232, 231, [966,849,1,967,849,2,968,849,1]],
      [226, 228, 226, [967,848,1,968,848,1]],
      [243, 243, 241, [968,734,1]],
      [237, 240, 240, [971,849,3,972,849,2]],
      [223, 224, 223, [973,851,3,974,851,3,975,851,4,976,850,5,977,850,3,978,850,5,979,851,4,980,853,1]],
      [213, 212, 213, [974,850,1,975,850,1]],
      [221, 225, 224, [980,852,1]],
      [219, 224, 222, [981,851,2,982,852,1]],
      [232, 234, 235, [983,853,2,984,853,2,985,854,1]],
      [238, 240, 239, [985,853,1,985,855,1,986,853,3,987,853,3,988,853,3,989,854,2]],
      [223, 224, 224, [988,856,1]],
      [227, 227, 222, [992,1015,1,993,1015,2]],
      [201, 200, 202, [1022,945,2,1023,945,3]]
    ] };

    /* ---------------------------------------------------------------- THE CAST */
    const cast = {};
    const at0 = (p, k) => (STATION[p] && STATION[p][k]) || null;
    /* GRANDMASTER PHO SEATED CROSS-LEGGED on his cushion at her low table (the plan's 5.3 and 8.1): chapter 3's hall seat,
       its numbers (CROSS) and its cloth (w3pholap, a declared reuse), as episode 4 chapter 5 seats him in case three.
       TODO-WORLD: the cushion's own height when its model stands (chapter 5's was 0.12 m) */
    const CUSHION_TOP = 0.12;
    { const S0 = at0('room', 'pho');
      cast.pho = mkPerson('pho', S0.x, S0.z, S0.ry, { y: CUSHION_TOP, take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] }, seat: { y: 0, over: CROSS.hips, takes: /^Sit/ }, skins: false, look: lookD, blobW: 1.05, blobD: 0.85,
        talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD, cross: CROSS });
      cast.pho.home = { x: S0.x, z: S0.z, ry: S0.ry, y: CUSHION_TOP }; }
    /* GRACE (STAND-IN: p4mala, as episode 4 chapter 4 cast her: her rest, her talk, her full body within 2.2 m). TODO-CAST:
       her own body, `p51grace`, seated on the sofa (the plan's 8.1: her two stand-ups at 40 s and 110 s) */
    { const S0 = at0('room', 'grace');
      cast.grace = mkPerson('p4mala', S0.x, S0.z, S0.ry, { take: 'Idle_3', phase: 0.15,
        talk: 'Stand_and_Chat', skins: { 0: 'p4malah' }, blobW: 0.75, blobD: 0.6 });
      cast.grace.home = { x: S0.x, z: S0.z, ry: S0.ry }; }
    /* MARCUS (STAND-IN: p5collector, as episode 4 chapter 5 seated him in case three: his sit, his full body). TODO-CAST:
       his own body, `p51marcus`, on the rattan chair by the door. TODO-WORLD: the chair's seat height (here the plain block's 0.45 m) */
    { const S0 = at0('room', 'marcus');
      cast.marcus = mkPerson('p5collector', S0.x, S0.z, S0.ry, { take: 'Sitting_Answering_Questions', centre: true, skins: false,
        win: { Sitting_Answering_Questions: [0.2, 1.2, 9] }, talk: 'Sitting_Answering_Questions', blobW: 0.8, blobD: 0.8,
        seat: { y: 0.45, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { hipOver: 0.1, edge: -9 }) },
        shoulders: { Sitting_Answering_Questions: 0.5, Idle_3: 1 },
        headDamp: { Sitting_Answering_Questions: [0.3, 'Sitting_Answering_Questions'] } });
      cast.marcus.home = { x: S0.x, z: S0.z, ry: S0.ry, y: 0.45 }; }

    /* ================================================================ THE WORLD'S PHASES (the hooks: c_play.js book() and
       applyPhase() call worldPhase, d_play.js's frame calls worldFrame, its reset worldReset). The evening's three stand
       in her room in the room and the breaking; nobody stands in his flat at night (he is alone: the plan's 8.3) */
    let worldAt = null;
    function standAt(P, st) {
      if (!P) return;
      if (!st) { P.hidden = true; P.group.visible = false; return; }
      P.hidden = false; put(P, st.x, st.z, st.ry, st.y != null ? st.y : (P.home && P.home.y) || 0);
      if (P.ready) P.group.visible = true;
    }
    function worldPhase(p, place = true) {
      const st = STATION[p] || STATION.room; worldAt = p;
      standAt(cast.pho, st.pho ? Object.assign({ y: CUSHION_TOP }, st.pho) : null);
      standAt(cast.grace, st.grace || null); standAt(cast.marcus, st.marcus ? Object.assign({ y: 0.45 }, st.marcus) : null);
      if (place && st.at) { yaw.position.set(st.at.x, EYE, st.at.z); yaw.rotation.y = st.at.ry; pitch.rotation.x = -0.04; }
    }
    function worldFrame(wdt, st) {
      peopleTick(wdt, st !== 'cine');
      if (st !== 'cine') { peopleLevels(); lodTick(); }
    }
    function worldReset() { worldAt = null; worldPhase('room', false); }
    /* ready only once every model is unpacked and every body that has landed is set up: all of it under the curtain
       (episode 4 chapter 4's R51; v14.15) */
    function worldReady() { return parsePend === 0 && people.every(P => P.ready || !have(P.key)); }
    /* the sky stands over him: over his flat or the street when he is in one (200 m off: the dome is 150 m), else the origin */
    function worldSkyAt() { const x = yaw.position.x; return x > 100 ? { x: FLAT.cx, z: FLAT.cz } : x < -100 ? { x: STREET.cx, z: STREET.cz } : null; }

    /* WHERE A SCENE CHANGE PUTS HIM DOWN (walktest floods from each): his flat, where the film of home leaves him in bed */
    const ARRIVALS = [
      { what: 'his flat, where the film of home leaves him', x: STATION.night.at.x, z: STATION.night.at.z }
    ];
    /* THE GROUND HE IS KEPT ON (stage.keepIn): her front room, and his flat */
    const KEEP = { what: 'her front room and his flat', boxes: [
      { minX: ROOM.x0, maxX: ROOM.x1, minZ: ROOM.z0, maxZ: ROOM.z1 },
      { minX: FLAT.x0, maxX: FLAT.x1, minZ: FLAT.z0, maxZ: FLAT.z1 } ] };
    /* EACH LATER GROUND, walked by the walk test (v26.18): his flat at three o'clock, put in place as a Continue lands */
    const GROUNDS = [
      { what: 'his flat at three in the morning', enter: () => { if (S && S.setPhase) S.setPhase('night'); }, ready: () => worldAt === 'night' && worldReady() }
    ];
    /* EACH THING TO PRESS IS TRIED BY THE WALK TEST IN THE GROUND IT BELONGS TO (v26.18 `ground`): the night's in his flat */
    const GROUND_OF = { getup: GROUNDS[0].what, phone: GROUNDS[0].what };
    function worldHotspots(list) { for (const h of list) if (h && GROUND_OF[h.id] && !h.ground) h.ground = GROUND_OF[h.id]; return list; }
    /* ================================================================ THE STORY'S SKELETON (the tracker's M1; PLAY builds
       it out: M6, the plan's 8)
       THE PHASES (the plan's 8: "each a save"): room -> breaking -> night -> ask.
         room      her front room, the evening: the four orders, the four things to look at, Spirit Vision (8.1)  TODO-PLAY
         breaking  KEEP THE WATER STILL, briefed with START, three surges, never failed (8.2)                 TODO-PLAY
         night     three o'clock: the PRESSURE walk from his bed to his phone (8.3)                           TODO-PLAY
         ask       his phone in his hand at 3:03: the decision is open, and opens again after a step back (9.6)
       A Continue lands at the START of its phase, and what was found in a phase rides the phase string, as episode 4's
       did: 'room:w,l,p' is the room with the water poured, the candle lit and her phone looked at. The phase string is the
       save's only receipt (v7.3).
       BETWEEN THE PHASES, the films (z_tail.js): the opening before `room`; `keepsake` into the breaking; `cord` and then
       `home` into the night. The next phase is BOOKED before its film begins (a film from play saves first: v21.1), so a
       game closed in the middle of a film comes back at the start of the phase the film hands to. Each ending carries the
       barrier (its 9.7, with CLOSE THE CIRCLE inside it) and the dawn (its 9.9).
       IN THIS SKELETON each order is one thing to press, and what is pressed says its own lines and hands on: so the whole
       chapter can be walked to its four endings, and nothing soft-locks. */
    const W = DATA.words;
    const PHASES = ['room', 'breaking', 'night', 'ask'];
    /* THE RECEIPTS a phase can carry on the phase string (the plan's 8):
         room      w the water poured, l the candle lit, p her phone, g her reflection, h her hands, k the packet (and asked
                   where it is from), v Spirit Vision on Grace (the red line seen)
         breaking  (none: the event is one beat, and a Continue opens its brief again)
         night     u up out of bed, f his footsteps seen at the bedroom door */
    const RECEIPTS = { room: ['w', 'l', 'p', 'g', 'h', 'k', 'v'], breaking: [], night: ['u', 'f'], ask: [] };
    const LOOKS = ['p', 'g', 'h', 'k'];
    const play = { run: 0, busy: false, found: new Set() };
    let phase = null, booted = false, decOpen = false, lookName = 'LAMP';
    const live = (run) => alive && run === play.run;
    const looksFound = () => LOOKS.filter(c => play.found.has(c)).length;

    function mark() { return (RECEIPTS[phase] || []).filter(c => play.found.has(c)).join(','); }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'room', f = new Set(tag.split(',').filter(Boolean));
      return { p, found: RECEIPTS[p].filter(c => f.has(c)) };
    }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }
    /* something found in this phase: its receipt and the save */
    function got(c) { play.found.add(c); saveMark(); }
    /* A PHASE BOOKED: the phase string says it from now, with nothing found in it yet; the order that was up is done, and
       the new phase's order waits for whatever hands off to it (v21.21) */
    function book(p) {
      phase = p; play.found = new Set();
      if (kit) { kit.setPhase(p + ':'); kit.objective(null); kit.waypoint(null); }
    }

    /* ---------------------------------------------------------------- the light of each phase (the chapter's own presets) */
    const LOOK_OF = { room: 'LAMP', breaking: 'LAMP', night: 'NIGHT', ask: 'NIGHT' };
    function lookAt0(name, secs = 0) { lookName = name; if (kit && kit.daylight) kit.daylight(PRESETS[name] || LAMP, secs); }

    /* ---------------------------------------------------------------- the chapter's clock and its one voice at a time
       (chapter 3's queue, as episode 4 copies it). The clock runs in play only, on wall time, so a panel stands it still
       while a voice plays on (v21.21); the line queue and every timer of the play run on it. */
    const dayClock = { t: 0 };
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE WHOSE TAKE HAS NOT LANDED IS SHOWN (TODO-SOUND): its words at the foot of the screen for its provisional
       length, under who says them, so the skeleton can be read. It shows ONLY when the line's bytes never came (the give-up
       below): the day a take lands under its key, the line is heard and its caption is gone, with nothing here to change. */
    function showLine(name) {
      const L = LINES[name];
      if (!L || !kit || !kit.captions) return;
      kit.captions([{ at: 0, end: (SECS[name] || 2.5) + 0.4, text: L[2], sub: WHO[L[0]] || '' }]);
    }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = (silent) => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (silent) showLine(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(false); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(false); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (soundOff && soundOff()) { speak.pending = null; q.start(false); return; }
      if (dayClock.t > q.give) { speak.pending = null; q.start(true); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(false); }
      else speak.until = dayClock.t + 0.2;
    }
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(gap) { lineQ.push({ gap }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    /* a line of the script, by its key (TODO-PLAY: who says it talks from its own start and rests after: v11.4) */
    function say(name) { if (!LINES[name]) console.warn('e5c1: no line ' + name + ' in the script'); queueLine(name); }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7), each marked where it lives (v14.8) */
    function objectiveFor(opts) {
      if (!kit || play.busy) return;                           // a line is handing off: the order waits for it
      let o = null, wp = null;
      if (phase === 'room') {
        if (!play.found.has('w')) { o = W.objPour; wp = SPOT.jug; }
        else if (!play.found.has('l')) { o = W.objLight; wp = SPOT.lighter; }
        else if (looksFound() < 4) o = W.objWatch;
        else if (!play.found.has('v')) { o = W.objVision; wp = SPOT.grace; }
      }
      else if (phase === 'breaking') { o = W.evStillTitle; wp = SPOT.bowl; }
      else if (phase === 'night') {
        if (!play.found.has('u')) o = W.objGetUp;
        else { o = W.objPhone; wp = SPOT.phone; }
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      if (!kit || !kit.film || !kit.film(key, { onDone: go })) go();
    }

    /* WHERE THE STAND-INS LIE (each at the height a mark is read at: v7.5). TODO-WORLD: each becomes the thing itself */
    const SPOT = {
      jug:     { x: 0.35, y: 0.55, z: 0.25 },
      lighter: { x: -0.25, y: 0.55, z: 0.2 },
      phone:   { x: DATA.shrine.x, y: 0.85, z: DATA.shrine.z },
      grace:   { x: 0, y: 1.0, z: -1.4 },
      glass:   { x: ROOM.x1 - 0.05, y: 1.4, z: -0.6 },
      hands:   { x: 0.25, y: 0.6, z: -1.2 },
      packet:  { x: -0.4, y: 0.55, z: -1.15 },
      bowl:    { x: 0.2, y: 0.55, z: 0.15 },
      bed:     { x: 203.4, y: 0.9, z: 2.6 }
    };

    /* ================================================================ PLAY I · THE ROOM (the plan's 8.1) · TODO-PLAY
       To be built: kneeling at his place (he does not walk, as at chapter 5's table); the jug poured into the brass bowl,
       the lighter; the four things to look at, each a press on the thing itself (the aim dot on a desktop), each
       answered; the packet's question to Grace and her answer; Spirit Vision on Grace, the red line under the door;
       her two stand-ups on the phase's clock (40 s and 110 s: gr51r2, mk51r2, ph51r5; gr51r3 the second time).
       THE STAND-IN: one press for each order, in the plan's order; the four looks in any order. All found: the film of
       the keepsake. */
    function roomBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.room); objectiveFor({ complete: false }); if (roomDone()) roomEnd(); }
    const roomDone = () => ['w', 'l', 'v'].every(c => play.found.has(c)) && looksFound() === 4;
    function roomDo(c, lines) {
      if (phase !== 'room' || play.busy || play.found.has(c)) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      for (const n of lines) say(n);
      andThen(() => { play.busy = false; got(c); if (roomDone()) roomEnd(); else objectiveFor({ complete: false }); });
      return true;
    }
    function roomEnd() {
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); }
      andThen(() => { play.busy = false; book('breaking'); film('keepsake', () => breakingBegin()); });
    }

    /* ================================================================ PLAY II · THE BREAKING (the plan's 8.2) · TODO-PLAY
       To be built: KEEP THE WATER STILL, the hold-it-steady event (`steady`) with its own picture (`bowl`: ENGINE, M2),
       briefed with START (W.evStillTitle, evStillTouch, evStillKey); three surges with the chant swelling; a surge out
       of the ring too long taken once more, once (ph51s1); never failed; Spirit Vision held open by the scene.
       THE STAND-IN: one press. Then the cord and the film of home, into three o'clock. */
    function breakingBegin() { lookAt0(LOOK_OF.breaking); objectiveFor({ complete: false }); }
    function still() {
      if (phase !== 'breaking' || play.busy) return false;
      book('night');
      film('cord', () => film('home', () => { worldPhase('night'); nightBegin([]); }));   // (TODO-FILM: home's own last picture puts him in bed)
      return true;
    }

    /* ================================================================ PLAY III · THREE O'CLOCK (the plan's 8.3) · TODO-PLAY
       To be built: waking in bed at 3:00; the pressure in waves (the eighty-first seam, kit.press: ENGINE, M2), the heart,
       the sound closing; the tip told once (W.tipPress); the knee at full pressure; Spirit Vision forced open for four
       seconds at the bedroom door, his own footsteps red (zv51n4); the trembling things (zv51n1 to zv51n3); the phone.
       THE STAND-IN: get up (a press by the bed), then the phone on the dining table. The phone pressed: the decision. */
    function nightBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.night); objectiveFor({ complete: false }); }
    function getUp() {
      if (phase !== 'night' || play.busy || play.found.has('u')) return false;
      play.busy = true;
      say('zv51n1');                                           // "Like my head was in a vice."
      andThen(() => { play.busy = false; got('u'); objectiveFor({ complete: false }); });
      return true;
    }
    function atPhone() {
      if (phase !== 'night' || play.busy || !play.found.has('u')) return false;
      book('ask'); askBegin();
      return true;
    }

    /* ================================================================ THE DECISION (the plan's 9.6): 3:03, his teacher's
       name on his phone's screen. Not timed; the world is held while the panel is open (v11.4). It opens here, and
       again at the table after a step back (d_play.js: the pile is live only while the question stands) */
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function askBegin() { lookAt0(LOOK_OF.ask); const run = play.run; after(0.6, () => { if (live(run)) openDecision(); }); }

    /* ---------------------------------------------------------------- the things he can press (each offered only in
       its phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put
       back). TODO-PLAY: every one is a stand-in */
    const roomLive = () => phase === 'room' && !play.busy;
    const hotspots = [
      { id: 'jug', pos: SPOT.jug, radius: 1.8, prompt: W.hotJug,
        enabled: () => roomLive() && !play.found.has('w'), onInteract() { return roomDo('w', []); } },
      { id: 'lighter', pos: SPOT.lighter, radius: 1.8, prompt: W.hotLighter,
        enabled: () => roomLive() && play.found.has('w') && !play.found.has('l'), onInteract() { return roomDo('l', []); } },
      { id: 'phoneher', pos: SPOT.grace, radius: 2.6, prompt: W.hotPhone,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('p'), onInteract() { return roomDo('p', ['zv51r1', 'ph51r1']); } },
      { id: 'glass', pos: SPOT.glass, radius: 2.6, prompt: W.hotGlass,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('g'), onInteract() { return roomDo('g', ['zv51r2', 'ph51r2']); } },
      { id: 'hands', pos: SPOT.hands, radius: 2.6, prompt: W.hotHands,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('h'), onInteract() { return roomDo('h', ['zv51r3', 'ph51r3']); } },
      { id: 'packet', pos: SPOT.packet, radius: 2.6, prompt: W.hotPacket,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('k'), onInteract() { return roomDo('k', ['zv51r4', 'ph51r4', 'zv51r5', 'gr51r1', 'mk51r1']); } },
      { id: 'vision', pos: SPOT.grace, radius: 2.6, prompt: W.objVision,
        enabled: () => roomLive() && looksFound() === 4 && !play.found.has('v'), onInteract() { return roomDo('v', ['zv51r6']); } },
      { id: 'still', pos: SPOT.bowl, radius: 2.0, prompt: W.hotStill,
        enabled: () => phase === 'breaking' && !play.busy, onInteract() { return still(); } },
      { id: 'getup', pos: SPOT.bed, radius: 2.2, prompt: W.hotGetUp,
        enabled: () => phase === 'night' && !play.busy && !play.found.has('u'), onInteract() { return getUp(); } },
      { id: 'phone', pos: SPOT.phone, radius: 2.0, prompt: W.hotPhoneHis,
        enabled: () => phase === 'night' && !play.busy && play.found.has('u'), onInteract() { return atPhone(); } }
    ];

    /* ---------------------------------------------------------------- a phase set from outside (a probe; the walk
       test's later grounds) and a phase applied from the save (a Continue, the selector, a replay: every phase is
       covered, and anything else is the room) */
    function setPhase(p) { applyPhase(PHASES.includes(p) ? p : 'room'); saveMark(); }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; play.found = new Set(R.found); decOpen = false;
      lineQ.length = 0; speakReset(); dropTodo();
      if (kit && kit.captions) kit.captions(null);
      worldPhase(R.p);
      if (R.p === 'room') roomBegin(R.found);
      else if (R.p === 'breaking') breakingBegin();
      else if (R.p === 'night') nightBegin(R.found);
      else askBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      lookAt0('LAMP');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName }; }
    /* ================================================================ THE FILMS' PICTURES (masters/v29.0/parts/c_yfilm.js)
       · TODO-FILM (FILMS, M7: the plan's 9 entire, its 4.4 the camera's grammar, its 12 the effects)
       What each film's own clock (z_tail.js) asks of the world as a pure function of that clock (v6.4): who stands where
       and in which take at which moment (pose), what is drawn (the cord, the bowl's water, the snap's wisp, the red
       footsteps and threads, the gold of the barrier), each a track so a seek, a skip and a slow phone land on the same
       picture. The stage hands these to the films and to probes as `films` (d_play.js).
       IN THIS SKELETON nothing is posed: the people stand where their phase's station puts them. */
    const FILMSAPI = {
      cast,
      station: STATION,
      /* (where a film's last picture hands him back: the phase's own `at`) */
      endAt: (p) => (STATION[p] && STATION[p].at) || null
    };
    /* ================================================================ THE FRAME, AND THE STAGE HANDED TO THE ENGINE
       (masters/v29.0/parts/d_play.js: PLAY's from M6) */
    const wallClock = { t: 0 };
    let lastWall0 = 0, lastWall = 0, pausedAt = 0;

    /* the decision's anchor (the engine's pile): his dining table and his phone on its charger. The decision is opened by
       picking the phone up (c_play.js atPhone), never by walking up to it; the pile is live only while the question
       stands, so a decision stepped back from is opened again there */
    const INTERACT_R = 2.6;
    const PILE_POS = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const _ndc = new THREE.Vector3();
    const pileLive = () => decOpen && phase === 'ask';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, PILE_POS.y + 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive() || getState() !== 'play') return false; openDecision(); return true; }

    /* THE FRAME (episode 4's): the chapter's clock runs in play only; a voice plays on under a panel while the clock
       stands still, so its booking comes forward by the time the panel was up, as far as the voice's own end (e3c3's
       v21.21 law); the saved phase is applied on the first frame of play, never before (v9.3) */
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      wallClock.t += wdt;
      worldFrame(wdt, st);                                     // (the world's hook: its people and their levels)
      if (st !== 'play') { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      if (pausedAt) { const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; } }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    function snap() { return { phase, story: storySnap() }; }
    function restore() {}
    /* A SAME-CHAPTER REPLAY never runs build() again: everything a run changes is put back here (v8.1) */
    function reset() {
      phase = null; booted = false; dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      dayClock.t = 0; wallClock.t = 0; lastWall0 = 0; lastWall = 0; pausedAt = 0;
      storyReset(); worldReset();
    }

    /* what he cannot walk through: every solid of the place, a column from the floor (v5.03) */
    function blockers() {
      const out = [];
      for (const s of solids) { s.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(s); bb.expandByScalar(0.14); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); }
      return out;
    }

    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); if (o.dispose) o.dispose(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) if (m[k] && m[k].dispose) m[k].dispose();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) if (t && t.dispose) t.dispose();
      world.clear();
      S = null;
    }

    worldPhase('room', false);
    return (S = {
      world, noteTex, blockers: blockers(),
      /* true only once every model is unpacked and every body that has landed is set up, so all of it is done under the
         curtain and warmed before the black lifts (episode 4 chapter 4's R51; v14.15) */
      ready: () => worldReady(),
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => worldSkyAt(),
      arrivals: ARRIVALS, keepIn: KEEP, grounds: GROUNDS, groundAt: flatGround,
      get phase() { return phase; },
      setPhase, applyPhase,
      presets: PRESETS,
      plan: { ROOM, STREET, FLAT, STATION, SPOT, ROOMTHINGS, FLATTHINGS },
      info: () => ({ phase, mark: mark(), t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, applied: booted, busy: play.busy, decOpen }),
      sayLine, queueLine, queueFn, queueGap, dayClock, after,
      /* (a probe's handle on the script as the chapter holds it) */
      script: { SECS, LINES, SAID, CHANTS },
      films: FILMSAPI,
      hotspots: worldHotspots(hotspots),
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }
  /* ================================================================ THE FILMS AND THE FOUR ENDINGS · TODO-FILM, every one
     (FILMS, M7: the plan's 9, shot by shot, with its sound column and its lenses phone / desk)
     EACH IS A STUB: a few seconds of the place as it stands, with no word said and no sound cued, ending as its kind
     must (the opening on its black, the title over it; a film from play back in play with the picture clear; an ending
     on its black, the card over it). So the chapter runs from its first frame to its four cards and nothing soft-locks.
     WHEN ONE IS BUILT: its lines are SAID.<place>, in the script's order; its clock is made by tl() from SECS, so a
     measured take moves everything after it (v5.15); its pictures are the stage's (c_yfilm.js) and are a pure function
     of the film's clock (v6.4); every cue is a literal call of the film language's sound verb, with the sound's name in
     quotes, in the film's own source, so the engine can read it and warm it (v10.2), and none is written past the film's
     last track (v12.3). A cue needs its sound in the build first (its take in assets/audio, its row in main.js's
     STING_SAMPLE): chaptertest fails a cue that plays nothing, which is why a stub cues none. A chant's captions are
     CHANTS.<key>, timed on the take's breaths (kit.captions). */
  const STUB = { open: 4.0, film: 3.4, ending: 4.0 };          // seconds; a film from play is past 3.0 so that Skip is offered too

  /* a film from play, as a stub: the picture held where he stands, then play again */
  function stubFilm(c, s, api) {
    const { tr, step, rawK } = api, T = STUB.film;
    tr(0, T, () => {}, rawK);
    step(T, () => {});
  }
  /* an ending, as a stub: the picture held, then its black, which the outcome card lies over */
  function stubEnding(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.ending;
    tr(0, T, () => {}, rawK);
    fade(T - 1.0, T - 0.2, 0, 1);
    step(T, () => {});
    c.endFade = 1; c.keepFade = true;
  }

  /* THE OPENING · "Blue hour" (the plan's 9.1: about 68 s; skip from 3 s) · TODO-FILM
     Black, the street's bed, his thought (zv51o1); the crane down the shophouse row at blue hour to Marcus waiting by the
     stair door, a taxi drawing in (zv51o2); his eyes out of the taxi (mk51o1, ph51o1); the stair, the tube flickering; the
     landing, her door, Grace (mk51o2, gr51o1, ph51o2); inside, he kneels by the windows and in the black glass her
     reflection faces the stairs (zv51o3); the card. Play begins where the film left him, at his place by her windows (no
     "Loading" after an opening film: v15.3). Its lines: SAID.open. It begins on black (v4.6) and keeps its black at its
     end, the title over it (v14.1). */
  function intro(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.open;
    tr(0, T, () => {}, rawK);
    fade(0.5, 1.6, 1, 0);
    fade(T - 0.9, T - 0.2, 0, 1);
    step(T, () => {});
    c.keepFade = true; c.endFade = 1;
  }

  /* THE KEEPSAKE (the plan's 9.2: about 42 s), from the room into the breaking · TODO-FILM
     Pho's open hand across the cloth (ph51k1); her hand that will not open; the packet set apart on a small white plate;
     the bowl in his hands (ph51k2); three drops of wax and the chant begins (ph51ratana, captioned from CHANTS); into the
     event's brief. Its lines: SAID.keepsake. */
  function filmKeepsake(c, s, api) { stubFilm(c, s, api); }

  /* THE CORD (the plan's 9.3: about 55 s), from the breaking · TODO-FILM
     The last strand snaps by itself, in slow motion: a wisp of red slips round his wrist under the bowl and is gone; Grace
     breathes out and cries (ph51c1); her phone face down (zv51c1); the packet bound in white thread (ph51c2, ph51c3,
     mk51c1, gr51c1); the bottle for his altar (ph51c4, ph51c5); his look at his wrist (zv51c2). Its lines: SAID.cord. */
  function filmCord(c, s, api) { stubFilm(c, s, api); }

  /* HOME (the plan's 9.4: about 50 s; 11:52 PM), into three o'clock · TODO-FILM
     The corridor, the keycard, his dark flat and the city through the glass; the bottle on his altar; his phone on its
     charger; the shower, the bed, 11:58; his eyes closing (zv51h1); 3:00. Play begins in bed. Its lines: SAID.home. */
  function filmHome(c, s, api) { stubFilm(c, s, api); }

  /* THE FOUR ENDINGS (the plan's 9.8), each a whole story: its own beginning, then THE BARRIER (its 9.7, the case file's:
     the call on the speaker, the white thread, CLOSE THE CIRCLE inside it by eventWait (W.evCircleTitle), the
     Jinapañjara through the phone with its captions, the gold rising and the red threads burning, the release) and THE
     DAWN (its 9.9: Pho at the door with breakfast, the thread wound up, the ending's own line, the thread tied on his
     wrist). Each ending's lines: SAID.endA to SAID.endD, with SAID.barrier and SAID.dawn. Then the four lines and the
     lesson card. TODO-FILM: all four, and the barrier and the dawn they share. */
  /* A · "CALL GRANDMASTER PHO NOW." (best): he knows at once that it is more than him, and asks */
  function scCall(c, s, api) { stubEnding(c, s, api); }
  /* B · "DON'T WAKE HIM. IT'S THREE IN THE MORNING." (good): humility misread; 3:41, the call made at last */
  function scWait(c, s, api) { stubEnding(c, s, api); }
  /* C · "IT'S ONLY A MIGRAINE. TAKE A PILL AND SLEEP." (bad): dismissal before looking; 3:22, the call */
  function scPill(c, s, api) { stubEnding(c, s, api); }
  /* D · "OPEN SPIRIT VISION AND FIND WHO'S DOING THIS." (worst): curiosity dressed as courage; a thread wraps his wrist at
     the balcony's door (he never goes past its frame), then the call */
  function scSeek(c, s, api) { stubEnding(c, s, api); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e5c1 = Object.assign(DATA, {
    build,
    intro,
    films: { keepsake: filmKeepsake, cord: filmCord, home: filmHome },
    scenes: [scCall, scWait, scPill, scSeek]
  });
})();
