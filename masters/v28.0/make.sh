#!/usr/bin/env bash
# v28.0 · episode 4 chapter 5 (The House With Nine Prai): every generated person, thing, voice and sound, and how. The
# design is docs/V28.0-E4C5-PLAN.md (§0 Chad's words, R1 on). This file is the RECIPE: every setting, every job's id,
# every pick and why. It is a record to read, not a script to run end to end (a job costs credits, and Meshy keeps a
# job's files three days).
#
# Chad, 20 Nov 2026 (plan §0): R2 "see the naga stick (light brown) in this picture"; R5 "Generate a master zavier model
# based on this photo, and rig it. Make sure it is extremely high quality and free of issues."; R6 "Continue all of this
# in fable 5.2 max". And of 11 Nov (v26.0, still standing): a person's reference "photorealistic ... against a white
# background, in A pose", then Meshy at its highest settings, the rig, the takes.
#
# ---------------------------------------------------------------------------------------------------------------------
# 0. THE SERVICES, read from the services themselves on 20 Nov 2026 (never from memory)
# ---------------------------------------------------------------------------------------------------------------------
# HIGGSFIELD (GPT Image): model gpt_image_2_6 (quality auto/low/medium/high/xhigh/max; resolution 1k/2k/4k; up to 16
#   image references). Price by estimate_image_cost with two references, 2k: high 2.75 · xhigh 4.5 · max 9 credits.
#   Balance 8.75 before this chapter (plan "plus"): max (9) could not be paid, so Master Zavier's picture is xhigh.
#   After the two pictures below: 1.5. HIS TOP-UP IS NEEDED before the chapter's other pictures.
# ELEVENLABS: the connector answered "requires additional permissions ... reconnect it from connector settings" to
#   account_get_usage on 20 Nov; its creative tools were not tried for these two pictures (a photograph cannot be handed
#   to it from this machine: it takes a public https address or a file attached in the chat, and his photographs are
#   never put at a public address).
# MESHY: balance 623 before this chapter (557 monthly, 66 permanent; the monthly part resets about 16 Dec). Settings and
#   prices as masters/v26.0/make.sh §0 (ai_model "latest" = meshy-7.1, geometry 4k, texture meshy-7 PBR 8k, remesh
#   300,000, a person in a-pose; image-to-3D 40, a remesh 5, a rig 5, a library action 3): masters/v28.0/meshy28.py.
#
# ---------------------------------------------------------------------------------------------------------------------
# 1. MASTER ZAVIER (R5), from his photograph
# ---------------------------------------------------------------------------------------------------------------------
# His photograph is masters/v28.0/ref/r5-zavier.jpg (never committed: plan §0). What went to the picture service, at his
# word for his own photograph: the man alone cut out of it, enlarged three times (r5-crop-body.png: nobody else's face in
# it), and his head enlarged eight times (r5-crop-head.png). His face is about sixty pixels across in the photograph, so
# the service draws most of the face itself: THE LIKENESS IS HIS TO JUDGE (the picture was sent to him, 20 Nov), and a
# sharper front photograph of his face was asked of him.
#   The reference picture (people/PROMPTS.txt has the prompt): Higgsfield job ee04d8d3-5466-469e-996a-eca141c7b7dc,
#   xhigh/2k, 2:3 (1360 x 2048), 4.5 credits. Kept at masters/v28.0/ref/zavier-a-2k.png (ignored by git: a likeness of a
#   real person is not committed).
#   LOOKED AT full size, and the face, each hand and the feet enlarged (20 Nov): the A pose clean, clear white between
#   each arm and his side, the cardigan's two edges hanging straight and ending at the hip (nothing hangs between an arm
#   and the body: what fused Grandmaster Pho's robe to his arm, v24.39 to v24.56), each hand a thumb and fingers in order
#   with none doubled, both feet flat in grey socks, the dress as his photograph (grey marled shawl-collar cardigan open
#   over a black T-shirt, the patterned belt, dark jeans turned up once, the steel watch on his left wrist, a silver band
#   on his right). IN SOCKS, not his photograph's sneakers: the third-person fight is inside a Singapore home, where shoes
#   are left at the door (said to him; a shod body is one more model when a chapter takes him outdoors).
#   Left out, so his hands are free: the umbrella, the bottle, the bag's strap.
#   Sent to Meshy: people/jobs-r1.json (person, a-pose, the highest settings, 40 credits).
#
# ---------------------------------------------------------------------------------------------------------------------
# 2. THE NAGA STAFF (R2), from his photograph
# ---------------------------------------------------------------------------------------------------------------------
# His photograph is masters/v28.0/ref/r2-nagastick.jpg (never committed; its EXIF holds his phone's location). What went
# to the picture service: the light brown staff alone (r2-staff-only.png: upright, written fresh with no EXIF, everything
# right of the staff below its head painted as the wall, so the stand, the seated figure and the small figures are not in
# it; the black staff's crest behind the head is) and its head (r2-crop-head.png). Both LOOKED AT before they went.
#   The reference picture (props/PROMPTS.txt): Higgsfield job 04a32cfb-a795-4e38-88f2-a83fa0e192a1, high/2k, 9:16
#   (1520 x 2688), 2.75 credits: props/refs/nagastaff-a-2k.png (and -1024.jpg, the copy git keeps).
#   LOOKED AT full size beside his photograph (20 Nov): one Naga head turned to the right, the flame crest swept back,
#   the open jaw with its teeth, the dark eye, the head a darker brown than the body; the body scaled over its whole
#   length, honey wood with dark streaks; the long S-curve; two and a half turns round a plain straight shaft; a plain
#   foot (his photograph hides the foot behind the small figures: the picture's is the service's own, plain). Pass.
#   Sent to Meshy: props/jobs-p1.json (prop, symmetry off: a coil mirrored is no coil; the highest settings, 40 credits).
