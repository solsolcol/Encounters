#!/bin/sh
# v24.48 · GRANDMASTER PHO: EVERY FAULT OF v24.47'S ROBE FIXED (prepared, not a build; not cast until episode 4
# chapter 3). Builds on masters/v24.47/make.sh (read it first: steps 1-4 and 7 are its own, unchanged; steps 5 and 6
# take new options). The plan, Chad's words and every step's measure: masters/v24.48/PLAN.md.
#
# CHAD, 5 Nov 2026, after v24.47's report (better than his saved file in 11 takes, even in 2, worse in 6): "Fix all of
#   it". What it was, found by drawing every triangle in its own colour at the moments the blind readers named
#   (tools/probes/phoid.mjs):
#   - the shards and tears (the sword slash's waist fold, cast_8's rear panel, the Charged casts): neighbouring cloth bones
#     turned up to 172 degrees apart, each read from the two pairs of particles next to it: robesim TURNFIT and
#     TURNSMOOTH (each bone's turn fitted to the whole patch of cloth it carries, and averaged with its neighbours');
#   - the cloth under the waistband pushed up over itself in the lunge (the thigh's round end at the hip reached above the
#     waistband): robesim HIPOPEN and TOPTAPER;
#   - the sack (the cloth held out by the depth of the robe's layers wherever a leg was near): robesim RESTCAP and
#     SKINPUSH (no leg pushes the cloth out further than it hangs at rest; the robe's own points kept off his legs' own
#     points, the bones moved only where they meet);
#   - the crumples, white flaps and splinters inside a lifted hem: the floor of the robe's old opening round his old
#     shins, running up inside the new legs, and the hem's underside and turned-in lip: robeshell FLOOR, HEMBASE, ISLANDS;
#   - sitting cross-legged, his legs bare: robesim LEGWRAPTAKES (that take's robe carried by his real legs as a skirt
#     skinned to its wearer's legs; his saved file's robe has no thighs inside it to cover);
#   - found by counting the first final file: sitting on a chair, a white band across his shins with skin showing above it
#     (a sheet of the robe 15 cm inside its own front wall near the hem, between his legs, swung out and stretched four to
#     five times when the robe lifts over his knees): robeshell INNER.
#
# THE DONOR: as v24.47 — the admin-tee man's scan, Chad's own, "soldier admin tee open eyes  w 9 animations.glb" in his
#   Drive (id 1uPLWmKeoYYelsMf3E9NLerldCEhqDrvX, 125,531,744 bytes, sha1 cfe4b8488b75b51b254b0ffb1378a61ec6f1f038), kept as
#   masters/v24.47/src/admintee_9anim.glb (gitignored). He lends his bare legs, hidden under the robe; he is never cast.
#
# THE STEPS (1-4 and 7 as v24.47):
#   1. tools/deflatten.mjs: the donor's flat-shaded export given shared, smooth normals.
#   2. tools/leggraft.mjs bones: the real leg bones in Pho's rig, every take solved for them; his running made a jog (JOG).
#   3. tools/robeskin.mjs as v24.46 with HEMRING=0 and LEGRIG=1, and once more without LEGRIG (the chair sits' robe).
#   4. tools/leggraft.mjs mesh: his shins cut at 0.17 m and the donor's legs joined on.
#   5. tools/robeshell.mjs: the robe below his waist one layer of cloth (as v24.47, with RIM), and now: FLOOR (the floor
#      of the robe's old opening round each shin, a sheet sloping up inside the new leg to its axis: below 32 cm, within
#      11 cm of a shin's axis, more than 2 cm inside the robe's own wall, lying flatter than upright), INNER (cloth more
#      than 8 cm inside the robe's own wall below 35 cm: the sheet between his legs at the front; the wrap's under-panel,
#      2-5 cm inside, and the pleats' valleys stay), HEMBASE (the hem's underside facing down, and its turned-in lip facing
#      in away from his front, within 4.5 cm of the robe's lowest point round him; at his front, where the wrap overlaps,
#      the lip and the panels' edges stay) and ISLANDS (loose scraps of the skirt under 40 triangles).
#   6. tools/robesim.mjs: the robe below his waist as cloth, every take simulated and baked as 16 x 10 cloth bones, with
#      TURNFIT/TURNSMOOTH=4 (the bones' turns fitted to their patches and smoothed), HIPOPEN and TOPTAPER=0.3 (the thighs
#      open at the hip and thinned toward it), RESTCAP (no push past the rest), SKINPUSH=0.008 (the robe's points kept
#      8 mm off his legs' points); the chair sits keeping the robe made on his rig's legs (TARGETFROM); running held to
#      8 cm at the hem, and sitting cross-legged to 3 cm of a robe carried by his real legs (LEGWRAPTAKES).
#   7. tools/prepmonk.mjs as v24.47, with TWOSIDE.
#
# THE PROOFS (every option new at v24.48, unset, changes nothing): robeshell with RIM alone, on v24.47's pho_graft.glb,
#   rebuilds v24.47's pho_shell.glb byte for byte (sha1 51104ba9); robesim with v24.47's options, on v24.47's pho_shell.glb,
#   rebuilds v24.47's pho_cloth.glb byte for byte (e93ab6d0); prepmonk, leggraft, robeskin and deflatten are unchanged.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
# and a browser for step 5 (tools/robeshell.mjs draws the robe): in a fresh container, CHROMIUM_PATH=/opt/pw-browsers/chromium
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.48/prep
mkdir -p $T
node tools/deflatten.mjs masters/v24.47/src/admintee_9anim.glb $T/admintee_smooth.glb
JOG=Running node tools/leggraft.mjs bones masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_legs.glb
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Right_Hand_Sword_Slash V1TAKES=Running \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 \
  UPRIGHT=Running:15,Walking:13,Charged_Spell_Cast_1:16,Sit_Cheer_with_Left_Hand:9,Sit_Cross_Legged_on_Floor:34,Sit_Shout_Hands_on_Mouth:19,Sit_to_Stand_Transition_M:8,Sitting_Answering_Questions:17,Talk_with_Left_Hand_on_Hip:5,mage_soell_cast:17,mage_soell_cast_6:19,mage_soell_cast_7:15 \
  UPRIGHTARMS=Sit_Cross_Legged_on_Floor,Sit_to_Stand_Transition_M,Sit_Shout_Hands_on_Mouth,Walking,Charged_Spell_Cast_1,Sitting_Answering_Questions,mage_soell_cast,mage_soell_cast_6,mage_soell_cast_7 \
  DRAPE=2 BANDO0=0.02 BANDOW=0.10 BANDPASS=30 BANDSIG=0.05 DRAPEMERGE=1 DRAPEREACH=0.24 BANDSPINE=0.04 \
  DRAPEHANG=1 HANGL0=0.55 HANGLW=0.30 HANGMAX=90 LDRAPEY=0.08 DRAPEISL=0.18 \
  ARMBLEND=0.10 HEMRING=0 \
  sh -c "LEGRIG=1 node tools/robeskin.mjs $T/pho_legs.glb $T/pho_robe.glb && node tools/robeskin.mjs $T/pho_legs.glb $T/pho_robe_rig.glb"
node tools/leggraft.mjs mesh $T/pho_robe.glb $T/admintee_smooth.glb $T/pho_graft.glb
RIM=0.08 FLOOR=0.02 INNER=0.08 HEMBASE=0.045 ISLANDS=40 node tools/robeshell.mjs $T/pho_graft.glb $T/pho_shell.glb
TURNFIT=1 TURNSMOOTH=4 HIPOPEN=1 TOPTAPER=0.3 RESTCAP=1 SKINPUSH=0.008 \
  TARGETFROM=$T/pho_robe_rig.glb TARGETTAKES=Sit_Cheer_with_Left_Hand,Sit_Shout_Hands_on_Mouth \
  LEGWRAPTAKES=Sit_Cross_Legged_on_Floor MAXDTAKES=Running:0.08,Sit_Cross_Legged_on_Floor:0.03 \
  node tools/robesim.mjs $T/pho_shell.glb $T/pho_cloth.glb
TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_cloth.glb assets/pho.glb 0.3
# the photographs (large single shots: every take, its worst and evenly spaced moments, six sides, two to a picture):
#   node tools/clipsheet.mjs assets/pho.glb <out> --plan=<plan.json> --size=760 --frame=legs --views=0:2,90:2,180:2,270:2,135:20,225:20
# the counts (floating leg pieces, legs through the cloth, torn cloth) at the same moments:
#   node tools/probes/pholegs.mjs assets/pho.glb <plan.json> <out.json>
# and what any fault is made of (its triangles, their rest place, stretch and bones; the cloth bones' turns):
#   node tools/probes/phoid.mjs assets/pho.glb <outPrefix> --take=<take> --t=<s> --view=<deg:pitch> --rect=x0,y0,x1,y1
