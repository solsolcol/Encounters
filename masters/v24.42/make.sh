#!/bin/sh
# v24.42 · GRANDMASTER PHO, each take given the robe rules that read best for it (prepared, not a build; not cast until
# episode 4 chapter 3). Builds on masters/v24.41/make.sh (read it first: the three-bone robe rig and why).
#
# THE v24.41 REVIEW (an independent reader, ten angles of every take's worst moments against his file): 5 takes better,
# 8 the same, 6 worse. This pass answers the worse ones that a rule can answer, take by take, on the same rig:
#   - Right_Hand_Sword_Slash and Running: v24.41's HULL flared their hems into flat panels, a tongue and spikes; the
#     first reviewer (of v24.40) rated v24.40's own rules better (running) and the same (the sword) as his file. V1TAKES
#     now gives these two takes v24.40's rules exactly — the two-bone chain (one turn shared by the waist and mid bones),
#     its angle table, sag and hang, the legs' four capsules only — so they deform as v24.40's file did.
#   - mage_soell_cast_8: both reviewers found his own hem clean there; it is FITTED to how his file moves the robe, as
#     the cross-legged sit is.
#   - HULLTAPER: the hull's push eases in by the chain's angle (full behind him, none at 60°/300°) instead of v24.41's
#     hard cut, which pushed one front-side chain out beside an unpushed neighbour (a flat panel with a step).
# Left as they were, and said to Chad: the cross-legged lap's dark folds (his file tucks the fold under the knees, which
#   no chain rig reproduces; a solid floor hides the cloth that dips under it); sit-to-stand's lap apron and the necklace
#   at his right side (the necklace hangs there since v24.40); the drape over his left arm in Talk_with_Hands_Open (the
#   upper body's re-bind of v24.39, unchanged); the deep crouches (Charged_Spell_Cast, mage_soell_cast_6), where the
#   hanging cloth lies flat on the floor — both reviews rated v24.40 and v24.41 the same as his file there, so they keep
#   the v24.41 rules.
#
# WHAT IT MEASURES: the trunk exactly as v24.40 and v24.41 (tools/rigstrain.mjs: caved at 0.7 % of its points at most).
#   65 joints, 177,772 triangles, 6.8 MB; the rest pose bakes to 0.000°. v24.40's and v24.41's recipes still re-make
#   their own files byte for byte (both checked after this pass's changes).
#   V1TAKES IS v24.40, MEASURED: every one of the 355,131 skinned points of Running and Right_Hand_Sword_Slash, at five
#   moments of each, lies within 0.8 mm of where v24.40's file (masters/v24.39/prep/pho_robe4.glb) puts it — the same
#   comparison finds Walking, which keeps this pass's rules, up to 35 cm apart, so the measure sees a real difference.
#   That also means v24.40's faults come back with its rules: the sword lunge's back hem is drawn down to the back heel
#   again (the scan's robe is one closed surface joined to his ankles, so the cloth between the hem and a heel stretched
#   far behind stretches with it); his own file shows trouser legs at that moment instead.
#   THE RING THAT MAKES THE STRIPS, MEASURED (the session's junction count on the robe file): the robe's surface meets his
#   legs along 562 triangles that join robe-weighted points to shin- and foot-weighted ones, all at rest heights 0.20 to
#   0.30 m (the hem's underside closing onto his shins above the ankles). It stretches in every take that moves his legs:
#   walking 550 of them past three times their rest length (the worst x16, hidden under the hem), the sword lunge 488
#   (x27), running 524 (x41). That ring is the strip, the tongue and the spikes; no robe rule can remove it, because it is
#   tied to both. The next step, if Chad wants it: cut the robe's underside free of his shins at that ring and close each
#   leg — a change to his mesh, so his call (his rule: his models as delivered).
#
# THE INDEPENDENT REVIEW of this file (a fresh reader, the eight takes this pass touched, ten angles against his file):
#   1 better (mage_soell_cast_4), 2 the same (Charged_Spell_Cast; mage_soell_cast_8, up from worse), 5 worse — Running and
#   Right_Hand_Sword_Slash (a foot or shin through the hem, a torn scrap at the trailing ankle), Walking (the striding
#   shin's torn strip at 0.2 s; the drape over his left upper arm a stiff shell the forearm passes into),
#   Talk_with_Hands_Open (that drape), mage_soell_cast_6 (stiff sails in the crouch, a heel through the back).
#   Measured against v24.41's file, every skinned point: HULLTAPER moved Walking up to 20 cm, mage_soell_cast_6 17,
#   mage_soell_cast_4 16, Charged_Spell_Cast 7, Talk_with_Hands_Open 0.3 — it changed takes nothing had asked it to, so
#   the next pass takes it out; the drape is v24.39's re-bind (the cloth on his left arm given to the trunk), a regression
#   of mine, and the next pass takes it on.
#   Photographed: the eight takes this pass touched, ten angles against his file, read by a fresh independent reviewer
#   (the session's survey7); the shipped file every take from five angles (shots/takes-1..3.jpg); before and after on a
#   solid floor (shots/pho-before-after-seated.jpg, -moving.jpg).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 HULLTAPER=1 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8 V1TAKES=Running,Right_Hand_Sword_Slash \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe7.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe7.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe7.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.42/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
