#!/bin/bash
# v24.19 — the generated models of episode 4 chapter 1: the bamboo, the takhian, the rain tree, the mango, a water
# buffalo, a Phra Rahu and two pairs of sandals. Chad's workflow (30 Oct 2026, verbatim): "you should not use Meshy text
# to model directly, the results will be very bad. You should first generate a reference image using GPTimage, or using
# Higgsfield image generation using the best GPTimage model to generate a clean reference image against a white
# background first, then check the reference image first, then using that reference image to generate the 3d models on
# Meshy, using the best quality settings."
#
# 1. THE REFERENCES (refs/, the eight used, each at 1024 px; the originals are 2k PNG): Higgsfield, model gpt_image_2_5,
#    quality max, 2k, opaque background — one object, whole, centred on pure white, three-quarter view, even studio light,
#    no shadow, no text. Two were generated for most and the better taken: bamboo (b), takhian (a — the species' tall
#    straight bole and narrow crown, over b's generic broad tree), buffalo (a), Phra Rahu (a — aged bronze, over b's black
#    and gold), sandals (a, b — both used, one pair each), rain tree (a), mango (a).
#
# 2. MESHY IMAGE-TO-3D, the best settings: ai_model latest, topology triangle, target_polycount 300000, should_remesh
#    true, should_texture true, enable_pbr true, symmetry_mode auto (off for the trees), and a texture prompt each:
#      bamboo   "green bamboo culms with pale nodes, fresh green narrow leaves, dry brown sheaths at the base"
#      takhian  "pale grey smooth bark, glossy dark green leaves"
#      buffalo  "dark slate grey hide with sparse hair, pale chevron on the throat, grey-black horns, dark hooves"
#      rahu     "dark aged bronze with soft gold highlights on the crown, the jewellery and the moon"
#      sandalsA "worn black rubber flip-flops, scuffed matte rubber"
#      sandalsB "faded brown plastic slides, dusty and worn"
#    (the API key lives OUTSIDE the repo, in /root/.config/meshy/key — never in a file here)
#    Each came back ~300,000 triangles with base colour, metal-roughness and normal sheets at 2048 — and could not be
#    simplified: a normal per triangle corner and a UV chart for nearly every few triangles (the mango: 643,494 unique
#    position+UV pairs on 291,903 triangles), so a simplifier sees a seam on every edge (the v8.0 law). The way down is
#    Meshy's own REMESH (POST /openapi/v1/remesh {input_task_id, target_formats [glb], topology triangle,
#    target_polycount}), which rebuilds the surface and re-bakes all three sheets onto it:
#      bamboo 37,374 (an 80k remesh came back no denser: the remesher drops thin leaves at any count), takhian 71,860
#      (30k faceted its buttress roots; it is one tree, near the player), rain tree 34,787, mango 31,207, buffalo 26,015,
#      Phra Rahu 31,291, sandals 12,247 / 12,035.
#    (Tried and set aside: DEFLAT=1 on the full-detail rain tree — the normals dropped, welded, simplified, rebuilt smooth
#    — keeps the canopy as full as the original but floors at 132,463 triangles on its UV charts.)
#
# 3. PREPARED (tools/prepmeshy.mjs: baked, sized, the footprint or the TRUNK on the origin, JPEG sheets, meshopt):
S=${S:-/tmp/meshy}        # where the remeshed files were downloaded (remeshed-<name>.glb)
node tools/prepmeshy.mjs $S/remeshed-bamboo.glb assets/e4bamboo.glb 1 h 1 0 1024
TINTGREY=0.64,0.57,0.50 TRUNK=0.12,0.22 node tools/prepmeshy.mjs $S/remeshed-takhian70.glb assets/e4takhian.glb 1 h 1 0 1024
TRUNK=0.06,0.14 node tools/prepmeshy.mjs $S/remeshed-raintree.glb assets/e4raintree.glb 1 h 1 0 1024
TRUNK=0.05,0.13 node tools/prepmeshy.mjs $S/remeshed-mango.glb assets/e4mango.glb 1 h 1 0 1024
ERR=0.01 node tools/prepmeshy.mjs $S/remeshed-buffalo.glb assets/e4buffalo.glb 2.7 l 0.45 0 1024
# (the Phra Rahu below was built and HELD BACK, never shipped — Chad, 30 Oct: "your rahu dont even look like the real
# thing. When you generate such statues or even amulets, you must always research real images first and base it off
# real image references." Its reference was made from a description; v24.20 remakes it from photographs of real ones,
# masters/v24.20/make.sh. The line stays as the record of what was rejected.)
# ERR=0.005 node tools/prepmeshy.mjs $S/remeshed-rahu.glb assets/e4rahu.glb 0.22 h 0.5 0 1024
ERR=0.005 node tools/prepmeshy.mjs $S/remeshed-sandalsA.glb assets/e4sandalsa.glb 0.27 l 0.5 0 512
ERR=0.005 node tools/prepmeshy.mjs $S/remeshed-sandalsB.glb assets/e4sandalsb.glb 0.27 l 0.5 0 512
# The trees are one metre tall for plantTrees (its contract: height 1, base on y 0, the trunk on the origin — TRUNK
# centres a slab of the bole, sliced from the surface, so a crown that spreads to one side does not stand the trunk off
# its spot); the buffalo, the image and the sandals at their size in metres. The takhian's bark came out birch-white
# (its texture prompt asked for pale grey) and is toned grey-brown (TINTGREY: only the base colour's grey texels, 6.9 % of
# the sheet; the green leaves untouched).
