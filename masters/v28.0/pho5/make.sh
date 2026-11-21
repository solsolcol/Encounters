#!/bin/sh
# v28.0 (E4C5) · R26 (Chad, 21 Nov 2026: "Finger bones (Recommended)", of R25's "the way the naga stick is attached to pho
# is very unnatural and wrongly attached, improve it so it looks like he is actually holding it"): GRANDMASTER PHO WITH
# FINGERS, this chapter's copy of his file. His own assets/pho.glb (sha256 2f9b1752...) is the source and is untouched;
# chapters 3 and 4 still load it. Run from the repository's root.
#
# 1. The graft (tools/fingergraft.mjs: what it reads, how it places each joint and weighs each point, and what it checks,
#    are written at its head). graft.json here is its report: the metre (0.85 m a unit of his file's quantized space), his
#    right hand (18.6 cm), each finger's line, length (thumb 10.4 cm, index 10.1, middle 10.0, ring 9.3, little 7.5) and its
#    joints, the points weighed (1,327 of the 1,994 that carry any of the hand), and the 7,371 accessors, takes, binds and
#    textures compared value for value with his file before it was written.
node tools/fingergraft.mjs assets/pho.glb assets/p5pho.glb masters/v28.0/pho5/graft.json
#    -> assets/p5pho.glb (sha256 604f4283...), key p5pho (masters/v28.0/keys.py; build.py and the head written by it)
#
# 2. The proof that at rest it draws his body exactly: every point of both files skinned on the CPU in float64 at the bind
#    pose and five moments of his takes (his rest, walk, run, throw and gold); the most any point differs: 1.7e-8 of the
#    file's units (15 nanometres), the rounding of a weight split between bones whose matrices are the same.
node tools/probes/skinsame.mjs assets/pho.glb assets/p5pho.glb "Sit_to_Stand_Transition_M@5.9,Walking@0.4,Running@0.3,mage_soell_cast_7@0.95,Charged_Spell_Cast@2.0"
#
# 3. The grip (c_fightstage.js PHOGRIP5) closes the hand in the game, solved from these bones' own lengths round the
#    stick's measured shaft; jointscan and the photographs are in the tracker's log.
