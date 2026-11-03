#!/bin/sh
# v24.40 · GRANDMASTER PHO, fixed and kept ready (not in the build); and the ghost jar's room, the reviewer's findings.
#
# ---- PHO -----------------------------------------------------------------------------------------------------------
# Chad, 3 Nov 2026 (https://drive.google.com/file/d/19ndQALVTv2ttIXUEogb9a7uvCnb0_Rv4/view): "This is grandmaster pho 3d
# model. However, there are many issues with the 3d model, especially with the animations, many animations make his body
# distorted and wrong. I need you to find a way to fix all of it. Also fix any other problems and issues you can find
# with this model." Then: "The biggest problems are with his torso and back that distorts to very thin. You need to look
# at more angles", and: "I think pho model still needs alot more fixing and you are not looking at the right angles for
# the big issues". He is episode 4 chapter 3's teacher in white (S1·12, the Wai Kru), which is not built yet: so he is
# prepared, photographed and committed as assets/pho.glb, and the key `pho` goes into build.py (hosted-only) the day a
# chapter casts him. Chad's own model: no credit row.
#
# THE SOURCE, kept in masters/v24.39/src/ (gitignored): grandmaster_pho_v1.glb, 70,690,700 bytes, sha1
#   57a4e3d505d420ce0688a79bd836eb7fc06aedd0. A Meshy scan on a 28-joint Mixamo rig, 592,579 triangles over 355,131
#   vertices (smooth-shaded: no deflatten), nineteen takes of his own: Running, Walking, Charged_Spell_Cast,
#   Charged_Spell_Cast_1, Right_Hand_Sword_Slash, Sit_Cheer_with_Left_Hand, Sit_Cross_Legged_on_Floor,
#   Sit_Shout_Hands_on_Mouth, Sit_to_Stand_Transition_M, Sitting_Answering_Questions, Talk_with_Hands_Open,
#   Talk_with_Left_Hand_on_Hip, mage_soell_cast and mage_soell_cast_3 to _8. No scale tracks, no bone drifting from its
#   rest length (tools/probes of v24.40: every take's 56 channels are rotations and rest translations).
#
# WHAT WAS WRONG, MEASURED (tools/rigstrain.mjs, every frame of every take at 10 fps, not one lucky angle):
#   THE TRUNK. Up to 52 % of his chest and back caved toward the spine at once (mage_soell_cast_5 at 10.0 s); points of
#   his back at 6 % of their depth (Talk_with_Hands_Open 1.7 s), his chest at 5 % (Sit_Shout 1.6 s); from the side the
#   torso was a slab. The auto-rig had bound the robe and the trunk to the arms and the left thigh (93,674 robe vertices
#   mainly to the left thigh against 36,865 to the right, 59,255 to the left arm, 8 to Spine2), and it put his spine's
#   joints in his belly (the Spine joint 13 cm in front of the hips joint), so by distance his whole lower back went to
#   the pelvis.
#   THE ROBE. Walking and running pulled the skirt into trouser legs; every seated take tips the pelvis back (the floor
#   sit by 59°, the spine 15° the other way) and threw the robe's back out behind him in a hump; the floor sit split
#   the lap.
#
# THE FIX — tools/robeskin.mjs (new at v24.39, extended here; both new options off unless set):
#   1. The CLOTH (by its base colour at each vertex) and the TRUNK's skin are re-bound: an envelope of distances to the
#      bones' segments, blended into the original weights over six edge rings near the skin, diffused inside the cloth.
#   2. BANDS=1: the spine's share is dealt among Hips, Spine, Spine1 and Spine2 by HEIGHT (cuts at the Spine joint less
#      4 cm, at Spine1 and at Spine2, blended over ±5 cm) — never by distance to joints that sit in his belly.
#   3. SKIRT=12: the robe below 0.93 m gets twelve chains of two bones round it (the waist to the knees, the knees to
#      the hem), placed on the robe's own surface, and EVERY TAKE GETS THE CHAINS BAKED IN at its own keys: each upper
#      bone follows the two thighs and the waist by its angle round him (front both thighs, sides their own, back half
#      the waist), sags when a thigh is lifted (HANGUP 0.45), never nearer a leg than it stood at rest, never through
#      the floor; each lower bone follows the shins and gravity (more the more its upper bone is lifted). The chains
#      hang from SkirtWaist, a bone at the hips' joint turned HALF WAY between the pelvis and the spine (WAISTBLEND
#      0.5), and the robe's waist rides it too, never the pelvis's own tip. The rest pose bakes to 0.000° (asserted).
#   4. TAKELIFT: the floor sit planted his hips 10 cm through the floor; it is lifted 5.5 cm (his sitting bones on the
#      floor, measured from the hip joints), so its chains lie on the floor rather than through it.
#   Then tools/prepmonk.mjs at the masters' cut and Lersi Chin's sheets (TEX 4096 colour for the face, NTEX 2048
#   normal): 592,579 -> 177,772 triangles, 53 joints (28 his own, 25 the skirt's), all nineteen takes, 6.5 MB.
#
# WHAT IT MEASURES NOW (tools/rigstrain.mjs on the re-bound file): the trunk caves under 0.75 of its depth at 0.7 % of
#   its points at most (was 52 %); the chest's worst 1 % at 0.86 of their distance from the spine or better (was 0.05),
#   the back's at 0.78 (was 0.06); the trunk's chest-to-back depth never under 0.92 of rest; no seam opens. Photographed
#   from ten angles (eight round him, above, below) at each take's worst moments against his file
#   (survey sheets in the session; the two before/after sheets in shots/), and an independent reviewer read them.
#   The one place it is not a clean cloth: the floor sit's robe POOLS on the floor round him from the front (a skinned
#   robe cannot fold onto itself the way cloth does without a physics simulation); folding that length back in under
#   him (FLOORIN) showed the robe's dark underside, and less gravity (HANG1 0.5) changed nothing — both tried, kept out.
#
# Every take on the shipped file, front · left · back · right · above-front, at 30 % and 70 % of each:
#   shots/takes-1.jpg .. takes-3.jpg. Before and after: shots/pho-before-after-1.jpg, -2.jpg.
#
# ---- THE ROOM (episode 4 chapter 1) — the v24.39 reviewer's findings, each verified ---------------------------------
#   The jar stood on the bare wood with nothing grounding it (the bowl had its brass tray): a painted contact shadow,
#   a child of the jar (src/chapters/e4/e4c1.js). Two open vessels drew see-through from above (a lathe's floor faces
#   down — v24.12's offering dish was the same class): the holy-water bowl, the incense cup (now with its sand), the
#   brass tray of vessels and the bead dish, each on its own two-sided material. NOT faults, and left as they are: the
#   jar is 12 cm clear of the candlestick (the shot sees one behind the other); the cloth's banded stripes are its own
#   woven texture's slubs (unchanged by tent-filtered mipmaps, anisotropy 1 or 8, or the normal map off — photographed).
#   Before and after: shots/room-before-after.jpg.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe4.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe4.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe4.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.40/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
