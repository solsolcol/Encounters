#!/bin/sh
# v24.47 · GRANDMASTER PHO: REAL LEGS UNDER HIS ROBE, AND THE ROBE AS CLOTH ROUND THEM (prepared, not a build; not cast
# until episode 4 chapter 3). Builds on masters/v24.46/make.sh (read it first: every robeskin option below is its own,
# unchanged, but HEMRING=0 and LEGRIG=1). The plan, Chad's words and every step's measure: masters/v24.47/PLAN.md.
#
# CHAD, 4 Nov 2026: "Seriously zoom in and look at the mess, its clear you are blind. Option 2 and look D" — option 2, real
#   legs under the robe from another character scan and the hem cut free; look D, his skin and necklaces unlit and the
#   robe lit (a material patch when chapter 3 casts him: nothing in this file). Then: "You need to look at way more large
#   shots of the legs in various animations and posrs, walking, running, etc. look at large shots nut thumbnails" — every
#   check below is made on large single shots. Then, of the robe that could not make room for real legs, his pick:
#   "Cloth simulation".
#
# THE DONOR (step 2): the admin-tee man's scan, Chad's own — "soldier admin tee open eyes  w 9 animations.glb" in his Drive
#   (id 1uPLWmKeoYYelsMf3E9NLerldCEhqDrvX, 125,531,744 bytes, sha1 cfe4b8488b75b51b254b0ffb1378a61ec6f1f038), kept as
#   masters/v24.47/src/admintee_9anim.glb (gitignored). He lends his bare knees and thighs, hidden under the robe and seen
#   only below its hem; he is never cast (Chad, v24.37).
#
# THE STEPS:
#   1. tools/deflatten.mjs: the donor's flat-shaded export given shared, smooth normals.
#   2. tools/leggraft.mjs bones: new leg bones in Pho's rig — a thigh from his hip and a shin from a knee on his visible
#      shin's own axis (his rig's knees stand 15 cm before his shins, at the front of the robe) — every take solved for
#      them frame by frame (two bones to his own ankle, in his own knee's bending plane, with his bones' own twist).
#   3. tools/robeskin.mjs as v24.46, with HEMRING=0 (no ring of the robe's underside rides a shin) and LEGRIG=1 (the
#      skirt's chains follow the REAL legs); and once more without LEGRIG (the chains on his rig's legs, as v24.46): only
#      that file's tracks are read, for the two chair takes whose robe covered his knees in his file.
#   4. tools/leggraft.mjs mesh: his shins cut at 0.17 m and the donor's legs joined on (girth matched at the join, colour
#      matched in Lab, painted into free squares of his own texture sheet, each thigh carried on 11 cm toward the hip), the
#      robe's openings capped in rings.
#   5. tools/robesim.mjs: the robe below his waist as cloth that keeps the skirt's shape and makes room for the real legs,
#      every take simulated and baked as 16 x 10 cloth bones fitted to the whole cloth; sitting cross-legged draped over
#      the folded legs (DRAPETAKES), the two chair takes keeping the robe made on his rig's legs (TARGETFROM), and running
#      held to 8 cm of the robe's own shape at the hem (MAXDTAKES; 10 cm let the cloth swing clear of a thigh as a heel
#      kicked up behind; 4 and 6 cm tried, 8 showed the least of his legs).
#   6. tools/prepmonk.mjs as v24.46.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.47/prep
mkdir -p $T
node tools/deflatten.mjs masters/v24.47/src/admintee_9anim.glb $T/admintee_smooth.glb
node tools/leggraft.mjs bones masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_legs.glb
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Right_Hand_Sword_Slash V1TAKES=Running \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 \
  UPRIGHT=Running:15,Walking:13,Charged_Spell_Cast_1:16,Sit_Cheer_with_Left_Hand:9,Sit_Cross_Legged_on_Floor:34,Sit_Shout_Hands_on_Mouth:19,Sit_to_Stand_Transition_M:8,Sitting_Answering_Questions:17,Talk_with_Left_Hand_on_Hip:5,mage_soell_cast:17,mage_soell_cast_6:19,mage_soell_cast_7:15 \
  UPRIGHTARMS=Sit_Cross_Legged_on_Floor,Sit_to_Stand_Transition_M,Sit_Shout_Hands_on_Mouth,Walking,Charged_Spell_Cast_1,Sitting_Answering_Questions,mage_soell_cast,mage_soell_cast_6,mage_soell_cast_7 \
  DRAPE=2 BANDO0=0.02 BANDOW=0.10 BANDPASS=30 BANDSIG=0.05 DRAPEMERGE=1 DRAPEREACH=0.24 BANDSPINE=0.04 \
  DRAPEHANG=1 HANGL0=0.55 HANGLW=0.30 HANGMAX=90 LDRAPEY=0.08 DRAPEISL=0.18 \
  ARMBLEND=0.10 HEMRING=0 \
  sh -c "LEGRIG=1 node tools/robeskin.mjs $T/pho_legs.glb $T/pho_robe.glb && node tools/robeskin.mjs $T/pho_legs.glb $T/pho_robe_rig.glb"
node tools/leggraft.mjs mesh $T/pho_robe.glb $T/admintee_smooth.glb $T/pho_graft.glb
DRAPETAKES=Sit_Cross_Legged_on_Floor TARGETFROM=$T/pho_robe_rig.glb TARGETTAKES=Sit_Cheer_with_Left_Hand,Sit_Shout_Hands_on_Mouth \
  MAXDTAKES=Running:0.08 node tools/robesim.mjs $T/pho_graft.glb $T/pho_cloth.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_cloth.glb assets/pho.glb 0.3
# the photographs (large single shots: every take, its worst and evenly spaced moments, six sides, two to a picture):
#   node tools/clipsheet.mjs assets/pho.glb <out> --plan=<plan.json> --size=760 --frame=legs --views=0:2,90:2,180:2,270:2,135:20,225:20
