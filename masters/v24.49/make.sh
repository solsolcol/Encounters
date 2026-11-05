#!/bin/sh
# v24.49 · GRANDMASTER PHO: THE LAST OF IT (prepared, not a build; not cast until episode 4 chapter 3). Builds on
# masters/v24.48/make.sh: its steps 1-4 (the donor's smooth copy, the leg bones, both robe rigs, the graft) are unchanged
# and their files are its prep/; step 5 takes new options; steps 6-7 are its own, unchanged. The plan, Chad's words and
# every step's measure: masters/v24.49/PLAN.md.
#
# CHAD, 5 Nov 2026, after v24.48's report ("I can keep going on the white hem bits, the thigh sliver and the hidden hands.
#   ... Should I?"): "Yes, fix all of it". What each was made of, found by drawing every triangle in its own colour at the
#   moments named (tools/probes/phoid.mjs) and dumping the cloth's particles there (robesim SIMDUMP):
#   - the white bits inside a lifted hem (the first Charged cast, behind his right heel): two layers — the back of the
#     robe's own wall and, 1-5 cm in front of it, ragged scraps of his scan's lining (facing in, up to 4.7 cm above the
#     hem) that the views of step 5 kept where a view from beside the hem grazed them; and the hem's rolled edge cut by
#     those views into fragments: robeshell HEMKEEP (the rolled edge kept whole, 2 cm up and 3 cm in, left alone by RIM
#     and, with HEMKEEPFLOOR=1, by FLOOR: cut by FLOOR at each shin it frays into white shards along the hem by his legs,
#     PLAN.md step 12; kept whole behind his shins, its strip by his right calf stretches into a grey comb seen between
#     his shins in the chair sits, step 9 — so HEMKEEPFLOORBACK=1 gives FLOOR the band behind his shins only, step 13)
#     and HEMLINING with HEMLININGBAND (the lining facing in within 6 cm of the hem taken out, the rolled edge's
#     own lip kept for the thin dark line along the hem that readers called clean in his saved file, his front's 70
#     degrees either side left whole: there the wrap's panels' own edges face in);
#   - tried and not taken (PLAN.md steps 4-5): robesim PUSHSPREAD for the sliver of his left knee at the wrap's front
#     edge in the lunges (the slit moved between moments and his shin came through the robe in cast_6), and LAPDROP for
#     his hands under the robe sitting cross-legged (his knees came through its sides). Both out of robesim again.
#
# THE STEPS:
#   1-4. masters/v24.48/make.sh's own, unchanged (run it first, or reuse its prep/ files).
#   5. tools/robeshell.mjs as v24.48 (RIM, FLOOR, INNER, ISLANDS) with HEMKEEP=0.02, HEMLINING=0.06, HEMLININGBAND=1,
#      HEMKEEPFLOOR=1, HEMKEEPFLOORBACK=1.
#   6. tools/robesim.mjs as v24.48.
#   7. tools/prepmonk.mjs as v24.48, with TWOSIDE.
#
# THE PROOFS (every option new at v24.49, unset, changes nothing): robeshell with RIM alone, on v24.47's pho_graft.glb,
#   rebuilds v24.47's pho_shell.glb byte for byte (sha1 51104ba9); with v24.48's options, on v24.48's pho_graft.glb,
#   v24.48's pho_shell.glb (e681032f); tools/robesim.mjs differs from v24.48's only in what its debug dump (SIMDUMP)
#   writes, and with v24.48's options, on v24.48's pho_shell.glb, rebuilds v24.48's pho_cloth.glb byte for byte.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
# and a browser for step 5 (tools/robeshell.mjs draws the robe): in a fresh container, CHROMIUM_PATH=/opt/pw-browsers/chromium
set -e
cd "$(dirname "$0")/../.."
P=masters/v24.48/prep
T=masters/v24.49/prep
mkdir -p $T
[ -f $P/pho_graft.glb ] && [ -f $P/pho_robe_rig.glb ] || sh masters/v24.48/make.sh
RIM=0.08 FLOOR=0.02 INNER=0.08 ISLANDS=40 HEMKEEP=0.02 HEMLINING=0.06 HEMLININGBAND=1 HEMKEEPFLOOR=1 HEMKEEPFLOORBACK=1 \
  node tools/robeshell.mjs $P/pho_graft.glb $T/pho_shell.glb
TURNFIT=1 TURNSMOOTH=4 HIPOPEN=1 TOPTAPER=0.3 RESTCAP=1 SKINPUSH=0.008 \
  TARGETFROM=$P/pho_robe_rig.glb TARGETTAKES=Sit_Cheer_with_Left_Hand,Sit_Shout_Hands_on_Mouth \
  LEGWRAPTAKES=Sit_Cross_Legged_on_Floor MAXDTAKES=Running:0.08,Sit_Cross_Legged_on_Floor:0.03 \
  node tools/robesim.mjs $T/pho_shell.glb $T/pho_cloth.glb
TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_cloth.glb assets/pho.glb 0.3
# the photographs, the counts and what any fault is made of: as masters/v24.48/make.sh's last lines.
