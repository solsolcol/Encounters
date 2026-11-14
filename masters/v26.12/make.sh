# v26.12 — episode 4 chapter 3, Chad's answers of 14 Nov 2026 (docs/V26.12-WHAT-IS-LEFT.md §3)
#
# 1. THE BODIES' TURNED TRIANGLES: TRIED, PHOTOGRAPHED, AND PUT BACK ("Fix and check all (Recommended)", of a few
#    triangles of a woman's hair drawn dark). tools/fliptris.mjs found 5,944 triangles in the chapter's 63 body files whose
#    winding is 120 degrees and more from their own corners' normals, and turned each (two corners swapped in the index
#    list: every attribute, skin, animation and texture byte for byte as it was). Checked at first ONLY BY NUMBERS. Chad,
#    the same day: "I think your fix without visually checking the models is a little dangerous, you sometimes add more
#    problems than you fix". So every changed place was then photographed before and after (tools/probes/flipshot.mjs: the
#    three biggest places of each file, 189 in all, from outside, textured, with the turned triangles painted red beside
#    them; and tools/probes/flipview.mjs: the body where the player meets it, four sides, a phone's screen). At a hand's
#    length 59 places looked a little better (a dark crease on the third woman's blouse shorter and lighter) and about 30
#    measured worse, one of them plainly: on Ton's far body (e4tonf) a smooth white collar became a dark wedge with a black
#    band across it. The bodies are drawn TWO-SIDED (doubleSided in every file), so a turned triangle was never a hole;
#    turning one changes only which way it is lit, and where a body's own normals point the wrong way the triangle the test
#    called turned was the one wound right. ALL 63 FILES WERE PUT BACK as they were (git checkout), the prep step
#    (masters/v26.0/people.sh) as it was, and fliptris made report-only. The dark slivers in her hair stay: a few pixels at
#    a hand's length, none where a player meets her (flipview at her nearest, 2.3 m: 1 to 22 pixels of 1.3 million a side
#    differed, none to be seen). A real cure is in the normals at those places, not the winding: not attempted.
#    Pictures: the scratchpad's fs/shots and fv (not kept). The two probes are kept in tools/probes for any change to a mesh.
#
# 2. THE POSE REFERENCES FOR HIS OPEN HAND AT THE CLOSE ("Petal on his hand": c_zfx.js myOpenHand), learned before the
#    pose was built (v26.3's rule). Higgsfield's GPT Image 2.6 (gpt_image_2_6), one picture each, no image references,
#    kept beside this file (src/, ignored by git). The prompts, word for word:
#   src/ref-palm-pov.png (2:3, 688 x 1024, sha1 6b3cdcc865...):
#     "Photorealistic first-person point-of-view photograph, as seen through a kneeling man's own eyes, looking down at his
#     own right hand held out palm up in front of his lower chest, about forty centimetres in front of his eyes and slightly
#     to the right of centre. The palm is open and very slightly cupped, the four fingers relaxed and gently curved upward,
#     close together with small natural gaps between them, the thumb relaxed and resting out to the side of the palm. A
#     single small pale yellow-white flower petal lies in the middle of the palm. The wrist is straight, the forearm comes in
#     from the lower right corner of the frame, the elbow bent and hanging low at his side. Beyond the hand, softly out of
#     focus, a woven straw mat on the ground. Natural daylight, sharp focus on the palm, natural human anatomy, five fingers."
#   src/ref-palm-side.png (3:4, 880 x 1168, sha1 d4a71b23e1...):
#     "Photorealistic documentary photograph, exact side view (profile) from his right. A young Southeast Asian man in a
#     plain white shirt kneels upright on a woven straw mat, sitting back on his heels, and holds his right hand out palm up
#     in front of his lower chest, looking down into it. His upper arm hangs close to his side, the elbow bent at a little
#     more than a right angle, the forearm rising gently forward from the elbow to the hand, the wrist straight, the palm
#     open and facing up, the fingers relaxed and gently curved, the thumb relaxed. A single small pale flower petal lies in
#     his palm. His left hand rests on his left thigh. Whole upper body in frame, plain light background, soft daylight,
#     natural human anatomy, five fingers."
#    READ FROM THEM, AS NUMBERS (OPENHAND in c_zfx.js): the side picture's upper arm hangs near vertical from the shoulder,
#    the elbow at the foot of the ribs, bent about 120 degrees (shoulder to elbow to wrist about 60 inside); the forearm
#    rises about 29 degrees forward; the fingers rise about 15 (the wrist lifted about 14 against the forearm); the palm
#    faces up. From his own eyes the palm's middle lies about 0.62 of the frame across and 0.46 down, the fingers running
#    on along the forearm's line within about 5 degrees and some 20 degrees in toward his middle, gently curved at every
#    joint, the thumb out from the palm some 40 degrees, the palm seen nearly whole (tipped toward his eye).
#
# 3. THE FESTIVAL FILM: THE TWO HERMITS MURMUR, THE MAN IN TRANCE CRIES OUT (Chad, 14 Nov 2026: "the audience guy who
#    trances when passing bai sri in the cutscene, can you maybe add a voiceline to the guy as he trances? also add a soft
#    chanting sound to the lersi who is making him trance. Soft enough that the player cannot really hear what is being
#    chanted." and "the lady who passes the bai sri to the brown lersi, also add a soft chanting voice to the brown lersi as
#    he touches the bai sri, that the player cannot really hear"). Flow QhNNjZhuufj9eTGXY7au, eleven_text_to_sound_v2,
#    prompt influence 0.5, four takes a prompt; every prompt and generation id in masters/v26.0/sound/sfx3.json, every
#    measure in masters/v26.0/sound/measures-sfx3.json (masters/v26.0/sound/measure.py sfx3: its level, silence, what a
#    phone plays, the voice's band, and what faster-whisper small.en writes from a take that must be wordless), the voicing
#    and syllable rate by masters/v24.24/meas.py, and each take's spectrogram read (ffmpeg showspectrumpic, 60 Hz to 6 kHz).
#    A take the transcriber writes a word from is refused (v25.4), as v26.0 refused "Ugh..." and "Wow".
#      x3chantb (4.5 s): the transcriber hears nothing in a and d and writes "Aww" from b and c. a and d are ONE HELD
#        TONE: their spectrograms
#        are flat lines for 4 s, no syllable in them (meas.py: 0.0 to 0.2 syllables a second), a hum and not a chant. The
#        prompt said "a low steady monotone voice"; MADE AGAIN as x3chantb2 (5 s) with "slow rhythmic syllables" in its
#        place. b is out (the transcriber writes "I will be with you, and you will be with me."); a, c and d hear nothing.
#        THE PICK: c, the most a phone plays of the three (83 % over 150 Hz) and the most in the voice's band (56 %: what
#        reads as a voice when it is soft), syllables at 3.5 a second, 60 % voiced. (a: 17 % in the voice's band, gone on a
#        phone when soft; d: 30 %.)
#      x3chanty (7 s): c is out (the transcriber writes "Mahalo mallo, mahalo mallo..."). THE PICK: b, the most a chant of
#        the three (its formants move and it breathes, at 0.7, 1.8 and 3.3 s; 79 % voiced: consonants between its vowels),
#        voiced across the whole 6.8 s the shot needs. (a: a rhythmic hum on one pitch; d: phrases, but it ends at 5.8 s.)
#        It begins on signal: faded in 0.15 s.
#      x3cry (3 s): a is out ("NOOOOO"), d is out ("AHHHHHHHHHHH"). THE PICK: c, the gasp and then the long cry the prompt
#        asked for, its end clean (to -64 dB). (b starts on its loudest frame, with no gasp.)
#    In the film (z_tail.js festivalFilm; a_head.js FEST): the brown hermit's murmur from his hands' coming onto her bai sri
#    (masters + 0.45) to their leaving it (gone by pet + 0.45); the yellow hermit's from the cut to the man (man + 0.05) to
#    the cut to the masters (sweep); both at 0.32 (their loudest twentieth of a second at -24 dBFS: the ground's music and
#    crowd stand at -25 together, and under the line said over them the duck takes both 8 dB more, so no word of theirs is
#    heard over his). The cry at 0.55 (-19 dBFS at its loudest), 0.35 s after the line over the man ends (T.cry). The pause
#    after that line is 3.4 s where it was 2.4, so the cry ends in the man's own shot; everything after it moves a second.
#    x3trance (his low breath under the line) is kept as it was.
#
# 4. ENDING D: HIS OPENING CLOSED, A SOUND AND A PICTURE (Chad, 14 Nov 2026: "the closing sound effect of option D, when
#    grandmaster pho closes the player's ability, that sound effect is very strange. Please generate a proper sound effect,
#    and have a visual effect to go along with it, so the player know what happened"). THE SOUND: two prompts, four takes
#    each (sfx3.json x3close1, x3close2). x3close2's four ("a door of light closing") are all under 150 Hz (95 to 100 %),
#    a phone plays none of them, as the two first generated for v26.0's x3shut were. x3close1's four ("a gentle shimmer of
#    light folding inward and settling into a warm soft hum") are all over it (99 to 100 %), no word heard in any. THE PICK:
#    d, the one take that RISES to its crest (0.35 s in) before it settles, so it gathers in and closes rather than
#    strikes; its partials at 520 and 660 Hz; to -30 dB by 1.45 s. (a pulses as it falls; b is the brightest, a wash; c is
#    a hum between 150 and 300 Hz, little of it on a phone.) Cued at 0.5 so its crest lands on the lotus's shut.
#    x3shut (synth.py's falling tone) is retired: its files and its row out, its line in sound.sh kept as a comment.
#    THE PICTURE (c_zfx.js shutVisionAt, a_head.js SHUTV, y_stage.js FILMS.D): his eyes close on "stay"; in the dark the
#    lotus of his first teaching (the breath's own picture, shell.html #evBreath.lotus, its eight petals, colours, fan and
#    heart drawn number for number on a canvas), open and lit, the world heard open under it (x3open, the breath's own bed);
#    it folds shut; on the shut the world's sound closes (kit.hush) and its look changes, under the dark; its last light
#    goes out in a ring; his eyes open on the plain world. The dark is a sheet before the lens (the film's fade is drawn
#    over the whole picture and would hide the lotus): a black sheet under the vignette is black, and no hand of his is
#    drawn in the shot. The pause after "stay" is 4.4 s where it was 2.8.
#    PREVIEWS for Chad's ear, every candidate of all four at -20 dBFS where it sounds: masters/v26.12/previews/make.sh.
#
# 5. THE CLOUDS: THEIR DARK EDGES, AND A FASTER DRIFT (Chad, 14 Nov 2026: "the clouds still have very distinct dark edges
#    that look weird, and the clouds move too slowly"). MEASURED FIRST: a phone's picture of the game (e4c3beats, day one,
#    the tall cloud through a 22-degree lens) across a cloud's outline: the sky at 156, then 128 to 132 for some 10 points,
#    then the cloud at 177 to 206. The same picture (assets/w3t_cloudtall.webp) laid over that sky's colour by hand, alpha
#    straight, has NO such band (not one pixel 15 under the sky where alpha < 0.9), at every mip level (the shrunk levels
#    simulated as the GPU makes them, straight and premultiplied alike: within 1). So the band is made in the game, not in
#    the picture: the engine's loader decodes with createImageBitmap(blob) and no options, which in Chrome gives a bitmap
#    with its colour MULTIPLIED by its alpha; WebGL takes a bitmap as it is (its unpack flags are ignored for one); and the
#    material (straight alpha) multiplies by the alpha again. A rim pixel at alpha 0.42 of colour 194 drawn as 194 x 0.42 x
#    0.42 + 156 x 0.58 = 125: the band. FIXED IN THE CHAPTER (b_world3.js skyLoad): the clouds' five pictures decoded with
#    premultiplyAlpha 'none', as the material expects; the engine's loader left as it is (it draws every chapter's
#    pictures: a change there would brighten every soft edge in the game, so it is listed for Chad, docs/OPEN-ITEMS.md).
#    PROVED on the same view after: just outside the cloud, the darkest point under the sky, row by row on 40 rows that cross
#    the tall cloud's left edge: before median 29.6 (max 33.3), after 1.0 (max 4.5); and the edge seen at full pixels, side
#    by side, the grey outline gone. THE DRIFT: 0.3 degree a second where it was 0.1 (b_world3.js DRIFT): about 3 points a
#    second on a phone held upright, where it was 1. Turning three times as fast, a cloud crosses to the far side of the sun
#    in minutes, and each card is lit from one side (a card lit from its upper right is turned round where the sun is to its
#    left, v26.1): so a card is turned round again only while the lens cannot see it (its bounding sphere outside the
#    camera's frustum), as any change in the world is made (v24.12).
#    (After the deploy, the desktop's picture a tenth of a second before the shut showed a small flat nub at the bud's tip
#    while its eight points finished meeting, some 0.15 s. The points now meet sooner than they sharpen (py on 1 - (1 - b)^2,
#    pt on b^2): built and photographed with the next build.)
