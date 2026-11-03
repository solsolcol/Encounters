#!/bin/sh
# v24.41 · GRANDMASTER PHO, the robe rebuilt (prepared, not a build; not cast until episode 4 chapter 3).
#
# Chad, 3 Nov 2026, of v24.40's file: "I think pho model still needs alot more fixing and you are not looking at the right
# angles for the big issues". v24.40 fixed his torso (measured on every frame: it caves at most 0.7 % of its points, his
# file 52 %), but an independent reviewer, reading ten angles of every take against his file, found the robe below the
# waist WORSE than his file in every seated take: no lap or knees from the side (a slanted tube he seemed to lean back on),
# the shins through slits, the cross-legged sit a stretched tent with spikes and a hole; in every lunge the back hem
# stretched into a strip pinned to the back heel; running, the kicked foot through the back of the robe. v24.40's line
# "the seated takes hang from the knees" was wrong. This file replaces it.
#
# WHAT WAS WRONG, MEASURED (tools/robeskin.mjs DBGAT=Take@seconds prints every chain's working at a key):
#   1. THE FEMUR'S TWIST. Sitting with his knees apart, the thigh bones turn out on their own axes; the side chains' knee
#      points, carried rigidly by the thigh bone, went UNDER the thighs (Sitting_Answering_Questions 4.4 s: the left side
#      chain's knee point 9 cm below and 12 cm behind his knee). Cloth lying on a thigh does not turn with the femur: a leg
#      now carries the cloth by its SWING only (the turn of its hip-to-knee direction from where the waist would carry it).
#   2. TWO BONES CANNOT BEND AT THE KNEE. Seated, the cloth from his belly over the lap to the knee top is about 0.32 m;
#      standing, waist to knee is 0.43 m. With one bone from the waist to the knees the bend fell 13 cm down the shin, so
#      every chair sit was a slide. Three bones a chain now: the waist to a MID ring 0.30 m below it, the mid ring to the
#      knees, the knees to the hem — the bend lands at the knee top.
#   3. CLOTH IS PUSHED BY A LEG, NOT TIED TO ONE. v24.40's lower bones followed the shins, which pinned the hem to the back
#      foot in every lunge. Now the waist bone follows the thighs (by their swing, the angle table's shares), and the mid
#      and lower bones HANG (their rest direction turned only by his yaw) and are pushed out of the thighs, shins, feet and
#      heels (capsules whose radius is the chain's own rest clearance, growing back to full as that leg moves off its rest
#      place round the waist, GROW 1.5 a metre, so rest is still rest) and kept above the floor.
#   4. THE ROBE ENCLOSES A LEG STEPPED BACK (HULL). The back and sides of the robe (60° to 300° round him) are pushed out
#      from his body's axis until they pass outside his shins, ankles, heels and toes at each height, never more than at
#      rest (each chain's rest shortfall is its allowance). A lunge's back leg now stands inside the robe and the robe
#      flares back over it; no strip.
#   5. THE CROSS-LEGGED SIT FOLDS IN EVERY VERSION (tools of the session, a triangle count): about one skirt triangle in ten
#      lies against its own winding at 1.7 s — his file 9.7 %, the fitted rig 9.0 %, the hanging rules 11.3 %. Where the
#      fold sits decides what shows: his file tucks it under the knees. For that one take the chains are FITTED to how his
#      own file moves the robe (FIT: each bone's rotation that best carries its points, by his file's own weights, to where
#      his file puts them — Horn's quaternion method), so it reads as his file does: a man sitting cross-legged, his feet
#      showing, the robe over his knees — with the trunk fixed and the floor sit still lifted 5.5 cm onto its sitting bones.
#
# TRIED, PHOTOGRAPHED AND KEPT OUT (each was a hypothesis the pictures disproved):
#   - two-bone chains with the swing fix alone: still a slide (the bend still fell on the shin);
#   - the fit's DIRECTION only (its twist about a strip's length from the rules): the cross-legged lap crumpled into shiny
#     shards — the fit's own twist is what lays the lap over the thighs;
#   - fitting only the lap's bones and hanging the rest: the cloth below fell through the floor in a tent;
#   - limiting how far a fitted bone may fold back on the one above (100°, 70°): darker patches, then shards;
#   - 24 chains instead of 12: no better (the fold is a matter of where, not how fine);
#   - fitting every seated take: the chair sits took his file's trouser legs back (the reviewer's fault in his file), so
#     the chair sits keep the hanging rules — one robe, the lap, a fall from the knees;
#   - a wider hull for the running kick: no change.
#
# WHAT IS STILL NOT A CLEAN CLOTH (said to Chad):
#   - Running: the foot kicked up behind to hip height comes out of the robe's hem. The scan's hem is joined to his ankles
#     (it is one surface), so a foot that high pulls the hem with it; no rig can free it without opening the mesh.
#   - The cross-legged sit: a few dark folds on the knees from some angles, and cloth that dips a few centimetres under the
#     floor (a solid floor hides it in the game; the photographs on a see-through grid show it).
#   - The drape over his left arm is his file's (it stiffens into a wing in a few casts, as in his file).
#   THE INDEPENDENT REVIEW of this file (ten angles of every take's worst moments against his file): 5 takes better, 8 the
#   same, 6 worse. Up: the seated takes from worse to the same, the cross-legged sit from worst to narrowly worse,
#   mage_soell_cast_4 and _5, _7, Charged_Spell_Cast_1 and mage_soell_cast better. Worse: Right_Hand_Sword_Slash and
#   Running (where the HULL pushes the robe out round a stepped-back leg, the hem breaks into flat panels and spikes and
#   shows the scan's dark underside; a lifted heel still shows through), the cross-legged lap's dark folds, Sit_to_Stand,
#   mage_soell_cast_8 (a heel through the back; his own hem is clean there), Talk_with_Hands_Open (the drape, unchanged
#   since v24.40). Never seen: trouser legs, a thin torso, holes, cloth through the floor. The next pass takes these on.
#
# WHAT IT MEASURES (tools/rigstrain.mjs on the robe file, every take at 10 fps): the trunk exactly as v24.40 — caved under
#   0.75 of its depth at 0.7 % of its points at most, the chest's worst 1 % at 0.86 or better, the back's at 0.78, the
#   chest-to-back depth never under 0.92 of rest, no seam open. 65 joints (his 28, SkirtWaist, 36 chain bones), the rest
#   pose baking to 0.000°. Photographed on a see-through grid from ten angles at each take's worst moments against his
#   file (the session's survey), read by an independent reviewer; the shipped file every take from five angles (shots/takes-
#   1..3.jpg); before and after on a solid floor (shots/pho-before-after-seated.jpg, -moving.jpg).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe6.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe6.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe6.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.41/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
#   (--floor puts a solid floor under him, as a player sees him)
