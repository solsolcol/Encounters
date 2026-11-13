#!/bin/sh
# v26.3 · episode 4 chapter 3, Chad's notes of 13 Nov 2026 after v26.2 (docs/V26.3-E4C3-NOTES.md: his words, the plan, the
# log). Nothing here is run by the build: each step names the tool that makes it again and what it was given.
#
# ---- TON'S FACE (his note: "the male character that the player keeps talking to, his face is too low res and compressed
#      and blocky looking, improve it")
#   What it was: the full model he is drawn in close (assets/e4tonh.glb, 313,088 triangles) kept the generator's own
#   layout of his paint (v26.1's repaint overlapped on it: masters/v26.1/make.sh), so its 2048 sheet was drawn without
#   mipmaps (c_cast.js NOMIP), and where he is talked to (1.9 to 2.3 m) his face had some three texels to a phone's pixel:
#   sampled, not averaged. And from 2.2 m the lighter body was drawn, whose face is soft. Photographed side by side at the
#   phone's own pixels (the scratchpad's dbg/tonarm/faces-native.png).
#   What it is: his head's charts baked by Blender into a 2048 sheet of their own with a gutter round each, from the
#   generator's 8192 sheet (1.6 times the texels his face had), drawn with mipmaps (c_cast.js sheetOf: `detail`), and his
#   full model drawn to 2.75 m (lodK 1.25). His body sheet, points, weights and the rest of his triangles are as they were
#   (the body sheet's bytes are the same: sha1 49210120a9...).
#   BPY is Blender 5.2.3 as a Python module with xatlas (masters/v26.1/make.sh says how it is made).
S=masters/v26.0/src; D=${D:-/tmp/tonbake}
env NOTHIN=1 TEX=2048 NOMAP=1 CHARTFIX=1 FACE=3 HEADK=2 HANDK=1.5 PAD=3 BAKE=dump:$D node tools/prepmonk.mjs $S/rigged-ton.glb $D/unused.glb 1
#   (DETHANDS=0: his head alone, so the face has the new sheet's room to itself; with his hands too it was 1.34 times, here
#    1.6. DETGOLD=0: he wears no gold)
DETPX=2048 DETGOLD=0 DETHANDS=0 $BPY -I tools/rebake.py $D
#   -> 2911 charts of his head (97,532 triangles) in a 2048 sheet of their own, 47% covered, at 0.80x the texels of a 4096
#      body sheet (his ships at 2048: 1.6x); 39 points copied where pieces touch at a corner
env NOTHIN=1 TEX=2048 NOMAP=1 CHARTFIX=1 FACE=3 HEADK=2 HANDK=1.5 PAD=3 BAKE=apply:$D node tools/prepmonk.mjs $S/rigged-ton.glb assets/e4tonh.glb 1
#   -> assets/e4tonh.glb: 215,556 triangles on his body sheet + 97,532 on the new one (313,088 as before), 4022 KB (3909).
#      The new sheet as baked is kept beside this file (src/e4tonh-face-detail.png, ignored by git).
#
# ---- v26.4 · THE BROWN HERMIT'S FULL MODEL, DRAWN CLOSE (Chad, 13 Nov 2026, of his phone picture standing over him in play:
#      "Why is the brown lersi so blocky here")
#   What it was, measured where he stood (0.73 to 0.81 m from the hermit, tools/probes/e4c3beats.mjs reading his levels at
#   each picture): his near body, Meshy's remesh at 30,665 triangles, made for 2.2 to 7 m; only Ton and the woman at the
#   bench had their full model for close range. What it is: his full model (assets/e4hermitah.glb, the generator's own,
#   310,849 triangles), drawn within 2.2 m like theirs (keys.py: person('hermita', ..., True)), his head's and hands'
#   charts baked onto a 2048 sheet of their own as Ton's were. His charts are many and small (18,870: the hair, the beard,
#   the beads), and with the default gutter of 4 pixels round each the sheet was 16% covered, 1.04 times the texels of
#   his body sheet as it ships: a gutter of 2 covers 34%, 1.5 times (1.5 covered 38%, 1.6 times, but leaves under a pixel
#   of gutter at the first mipmap; DETHANDS=0 changed nothing: his hands are few charts).
D=${D:-/tmp/hermitbake}
env NOTHIN=1 TEX=2048 NOMAP=1 CHARTFIX=1 FACE=3 HEADK=2 HANDK=1.5 PAD=3 BAKE=dump:$D node tools/prepmonk.mjs $S/rigged-hermita.glb $D/unused.glb 1
MARGIN=2 DETPX=2048 DETGOLD=0 $BPY -I tools/rebake.py $D
#   -> 18,870 charts of his head and hands (102,505 triangles), 34% covered, 0.75x the texels of a 4096 body sheet (his
#      ships at 2048: 1.5x); 907 points copied where pieces touch at a corner
env NOTHIN=1 TEX=2048 NOMAP=1 CHARTFIX=1 FACE=3 HEADK=2 HANDK=1.5 PAD=3 BAKE=apply:$D node tools/prepmonk.mjs $S/rigged-hermita.glb assets/e4hermitah.glb 1
#   -> assets/e4hermitah.glb: 310,849 triangles, 7,992 KB (the body sheet 863 KB and the new one 1,075 KB, as WebP)
#
# ---- v26.5 · THE IMPORTANT PEOPLE'S FULL MODELS, DRAWN CLOSE (Chad, 13 Nov 2026: "Can't all characters have the same
#      switching to the full triangle version when near to them?"; told that a full body costs about 50 MB of a phone's
#      graphics memory: "Only the important people like ton, candle lighter female, seated masters, pho, and those that
#      already are built this way can retain.")
#   The three other seated masters and the woman lighting the candles, each by the brown hermit's recipe above:
for n in hermitb red white devf; do D=/tmp/hb-$n
  env NOTHIN=1 TEX=2048 NOMAP=1 CHARTFIX=1 FACE=3 HEADK=2 HANDK=1.5 PAD=3 BAKE=dump:$D node tools/prepmonk.mjs $S/rigged-$n.glb $D/unused.glb 1
  MARGIN=2 DETPX=2048 DETGOLD=0 $BPY -I tools/rebake.py $D
  env NOTHIN=1 TEX=2048 NOMAP=1 CHARTFIX=1 FACE=3 HEADK=2 HANDK=1.5 PAD=3 BAKE=apply:$D node tools/prepmonk.mjs $S/rigged-$n.glb assets/e4${n}h.glb 1
done
#   -> e4hermitbh 309,769 triangles, 6,876 KB (28,369 charts of head and hands, 29% covered, 0.92 times his body sheet's
#      texels as it ships: his face and hands no sharper, but drawn with mipmaps); e4redh 312,194, 4,678 KB (1,176 charts,
#      58%, 1.68 times); e4whiteh 310,592, 4,100 KB (1,071 charts, 63%, 2.2 times); e4devfh 308,424, 7,817 KB (43,051
#      charts, 22%, 0.8 times).
#   Made before his answer and NOT shipped (kept outside the repository, in the session's scratch folder): the full models
#   of five devotees (deva to deve) and the two monks made here (monkb, monkc).
#
# ---- THE POSE REFERENCES (v26.3 and v26.7: a pose is learned from a picture of a real body before it is built, then set
#      beside it). Made with Higgsfield's GPT Image 2.6 (gpt_image_2_6), one picture each, no image references; kept beside
#      this file (src/ref-*.png, ignored by git). The prompts, word for word:
#   src/ref-seat-front.png (3:4, sha1 5f859d04e9...), v26.3, the brown hermit's hands:
#     "Photorealistic documentary photograph. An elderly Southeast Asian hermit with long grey dreadlocks and a grey beard,
#     wearing a plain brown cloth robe wrapped over one shoulder, sits upright and relaxed in a pale green upholstered
#     armchair. Both of his palms rest flat on top of his knees, fingers relaxed and close together, gently curving down
#     over the front of each kneecap, thumbs resting along the inside of each thigh. Elbows bent, close to his sides,
#     shoulders relaxed and low. Bare feet flat on a patterned rug, shins vertical in front of the chair's cushion. Camera
#     at standing eye height, three-quarter front view from his right, whole body in frame, soft daylight, plain light
#     background, natural human anatomy."
#   src/ref-seat-side.png (3:4, sha1 11d8ef6d95...), v26.3:
#     "Photorealistic documentary photograph, exact side view (profile). An elderly Southeast Asian hermit with long grey
#     dreadlocks and a grey beard, wearing a plain brown cloth robe wrapped over one shoulder, sits upright and relaxed in a
#     pale green upholstered armchair. His palm rests flat on top of his knee, fingers relaxed and close together, gently
#     curving down over the front of the kneecap. Elbow bent, upper arm hanging close to his side, forearm sloping down and
#     forward to the knee. Bare feet flat on a patterned rug, shins vertical in front of the chair's cushion. Whole body in
#     frame, soft daylight, plain light background, natural human anatomy."
#   src/ref-taper-side.png (3:4, sha1 1ee27aa0f1...), v26.3, the woman lighting the candles:
#     "Photorealistic documentary photograph at a Thai temple ceremony. A young Thai woman with a dark ponytail, in a white
#     short-sleeved blouse and white trousers, stands beside a table with a row of thin coloured candles. She lights one
#     candle's wick with a long thin yellow wax taper about seventy centimetres long, held in her left hand near its end the
#     way one holds a long pen, between the thumb and the first two fingers, the other fingers curled under it. Her left
#     elbow is bent at about a right angle, close to her side and slightly in front of her body, her forearm pointing toward
#     the candle, the taper angled gently down to the wick. Her right arm hangs relaxed at her side. She leans very slightly
#     toward the table and looks at the flame. Seen from her left side at standing eye height, whole upper body and arms in
#     frame, daylight, natural human anatomy."
#   src/ref-taper-front.png (3:4, sha1 f9f2d1c68e...), v26.3:
#     "Photorealistic documentary photograph at a Thai temple ceremony, seen from in front of her across the table. A young
#     Thai woman with a dark ponytail, in a white short-sleeved blouse and white trousers, stands behind a table with a row
#     of thin coloured candles. She lights one candle's wick with a long thin yellow wax taper about seventy centimetres
#     long, held in her left hand near its end the way one holds a long pen, between the thumb and the first two fingers.
#     Her left elbow is bent at about a right angle, close to her side, her forearm pointing forward toward the candle in
#     front of her left hip, the taper angled down to the wick. Her right arm hangs relaxed at her side. She looks down at
#     the flame. Whole upper body and arms in frame, daylight, natural human anatomy."
#   src/ref-palmup-front.png (2:3, sha1 c6610866f3...), v26.7, the hermit in the pale yellow shawl's hands (his take holds
#   his forearms rolled palm up, so a palm laid down needs more turn than a forearm and a wrist have):
#     "Photorealistic reference photograph, full body, of an elderly Asian man with a long white beard and grey hair,
#     wearing a plain white robe with a pale yellow shawl over his shoulders, seated upright in a plain armchair, both hands
#     resting palm up on top of his knees, each hand tipped slightly onto its little finger edge, fingers relaxed and gently
#     curled upward, thumbs relaxed, elbows hanging naturally at his sides, shoulders relaxed. Camera at standing eye height
#     about one metre in front of him, looking slightly down. Plain white background, soft even studio light, sharp focus on
#     the hands. Natural anatomy, five fingers on each hand."
