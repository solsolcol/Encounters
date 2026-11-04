#!/bin/sh
# v24.46 · GRANDMASTER PHO: THE REST OF HIS FAULTS, AND HIS LOOK (prepared, not a build; not cast until episode 4 chapter 3).
# Builds on masters/v24.45/make.sh (read it first: every option below but ARMBLEND and HEMRING is its own, unchanged, and
# the hem cut is a new step). The plan and every step's measure, written as the work went: masters/v24.46/PLAN.md.
#
# CHAD, 4 Nov 2026 (answering the v24.45 report): "Fix the rest of the issues with grandmaster pho's model. Is it also
#   possible to run him in unlit mode, or unlit just only for his face? I find unlit mode to be more accurate to how he
#   really looks like" — and a photograph of the real man (masters/v24.46/ref). Taken as his yes to the one change the
#   v24.45 report put to him: cutting the robe's hem free of his shins (a change to his mesh as prepared; his own file in
#   masters/v24.39/src stays as delivered).
#
# HIS LOOK (step 1): no change to this file. Four looks photographed beside his photo (masters/v24.46/shots/pho-look-*.jpg),
#   A lit as now, B all unlit, C the face only, D his skin and necklaces unlit and the robe lit; D recommended. The game
#   tone-maps every model (ACES at exposure 1.42), so "unlit as he looks" is the scan's colour laid on AFTER the tone
#   mapping; it is a material patch applied when chapter 3 casts him, scaled to the scene's light level. Chad picks.
#
# THE RIGHT ARMPIT (step 2), tools/robeskin.mjs ARMBLEND=0.10: the trunk's re-bind (v24.40) ended in a step 6 cm off his
#   right upper arm's axis — his file's weights inside it, the envelope's outside — and the skin and the chest wrap there
#   tore into a notch with strands of the wrap across it whenever the arm moved (15x at mage_soell_cast_6 1.61 s; his own
#   file 4x). The envelope now fades in over the 10 cm past that (6 cm cleared half the strands, 10 cm most of them:
#   shots/pho-armpit-cast4.jpg). Unset, the robe file byte for byte.
#
# THE HEM CUT FREE OF HIS SHINS (step 3, his word), robeskin HEMRING=0 and the new tools/hemcut.mjs: the scan's robe closed
#   onto his shins at mid-shin through triangles joining points that ride the skirt's chains to points that ride his
#   lower legs, which stretched whenever a leg moved (walking 16x, the sword lunge 27x, running 41x): the grey band at the
#   trailing shin, the strips and spikes at the hem. HEMRING=0: no ring of the robe's underside rides a shin any more
#   (unset 4, the gradual join; unset, the robe file byte for byte). hemcut takes out every triangle joining the two
#   (405) and closes each opening with a cap of ONE texel — each shin's top riding the shin bone alone, in the median
#   colour of that shin 2–6 cm below its cut; the robe's two underside openings riding the robe, in its white; two specks
#   — every point that existed keeping every attribute (432 points and 383 triangles added). Tried and left: the shin
#   carried 6 cm up before its cap (it striped and showed through the robe's front and back); the joining band remade in
#   skin colour (flat webs of skin when he runs). Photographed against v24.45 in seven takes
#   (shots/pho-hem-walking-lunge.jpg, -running.jpg, -sits.jpg): the strips at the trailing shin walking and the grey sheets
#   round his shins seated are gone. When he runs, a heel kicked up behind him shows his lower leg ending where the robe
#   once closed on it: his scan has no leg above mid-shin.
#
# MEASURED, NOT CURED (step 4): the crack across his right shoulder blade and the slit at the right side of his waist from
#   behind are his skin folding over where it is half arm and half trunk (his file 11 and 90 such triangles at the worst
#   moments, this file 96 and 199, v24.45 61 and 299); the white shards below his left elbow in Talk_with_Hands_Open are the
#   cloth at his hip that his file has riding the forearm, torn between it and his hips (14x). Fading the trunk's re-bind
#   out under his neck and averaging the weights over centimetres were tried and measured: the numbers fell, the
#   photographs did not change for the better, and neither is taken. A cure needs a helper bone or a corrective shape for
#   the shoulder, or cloth that moves by simulation.
#
# THE REVIEW: (filled in below when the blind reader has read every take)
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Right_Hand_Sword_Slash V1TAKES=Running \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 \
  UPRIGHT=Running:15,Walking:13,Charged_Spell_Cast_1:16,Sit_Cheer_with_Left_Hand:9,Sit_Cross_Legged_on_Floor:34,Sit_Shout_Hands_on_Mouth:19,Sit_to_Stand_Transition_M:8,Sitting_Answering_Questions:17,Talk_with_Left_Hand_on_Hip:5,mage_soell_cast:17,mage_soell_cast_6:19,mage_soell_cast_7:15 \
  UPRIGHTARMS=Sit_Cross_Legged_on_Floor,Sit_to_Stand_Transition_M,Sit_Shout_Hands_on_Mouth,Walking,Charged_Spell_Cast_1,Sitting_Answering_Questions,mage_soell_cast,mage_soell_cast_6,mage_soell_cast_7 \
  DRAPE=2 BANDO0=0.02 BANDOW=0.10 BANDPASS=30 BANDSIG=0.05 DRAPEMERGE=1 DRAPEREACH=0.24 BANDSPINE=0.04 \
  DRAPEHANG=1 HANGL0=0.55 HANGLW=0.30 HANGMAX=90 LDRAPEY=0.08 DRAPEISL=0.18 \
  ARMBLEND=0.10 HEMRING=0 \
  node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe13.glb
node tools/hemcut.mjs $T/pho_robe13.glb $T/pho_robe13_hem.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe13_hem.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe13.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.46/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
