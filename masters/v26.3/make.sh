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
