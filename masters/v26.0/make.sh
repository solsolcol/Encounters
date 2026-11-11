#!/usr/bin/env bash
# v26.0 · episode 4 chapter 3 (I Finally Found My Answers): every generated person, prop, voice and sound, and how.
# The design is docs/V26.0-E4C3-PLAN.md; where the build stands is docs/V26.0-E4C3-BUILD.md. This file is the RECIPE:
# every setting, every job's id, every pick and why. It is a record to read, not a script to run end to end (a job costs
# credits, and Meshy keeps a job's files three days).
#
# Chad, 11 Nov 2026: "Take full advantage and make full use of higgsfield mcp, meshy, eleven labs, gptimage, blender,
# everything to the maximum potential to bring this chapter to life. 3d models should be generated at the highest
# possible settings. For characters you need, can you first generate a reference of the person, describe it to GPTimage,
# person in photorealistic details, against a white background, in A pose. Once you have the reference image, send that
# to Meshy to generate the 3d model, then rig it, then add animations. Own it end to end."
#
# ---------------------------------------------------------------------------------------------------------------------
# 0. THE SERVICES, read from the services themselves on 11 Nov 2026 (never from memory)
# ---------------------------------------------------------------------------------------------------------------------
# HIGGSFIELD (GPT Image): model gpt_image_2_6. quality: auto|low|medium|high|xhigh|max. resolution: 1k|2k|4k.
#   Price at 2:3: high/2k 2.75 · xhigh/2k 4.5 · max/2k 9 · max/4k 15 credits. People and hero props are made at
#   max/2k; ordinary props at high/2k (Meshy reads a picture far smaller than 2k). Balance 796.75 before this chapter.
#   The service refuses more than about eight pictures at once (429 rate_limit_reached): the refused are sent again,
#   never the ones that went through.
# MESHY (docs.meshy.ai, read 11 Nov): the newest model is meshy-7.1 (ai_model "latest"). The highest settings:
#   geometry_resolution "4k" (Ultra 4096^3; +5 credits) · texture_model "meshy-7" (PBR) · enable_pbr true ·
#   texture_resolution "8k" · should_remesh true, topology triangle, target_polycount 300000 (the most a remesh gives;
#   a rig takes at most 380,000 triangles) · save_pre_remeshed_model true (the untouched surface beside it) ·
#   pose_mode "a-pose" for a person · image_enhancement true · multi_view_thumbnails true.
#   Price: image-to-3D with 8K textures 35, +5 ultra = 40 a model; remesh 5; rig 5; a library action 3; a text-to-motion
#   clip 10 (prime), and 3 to lay it on a rig. Balance 4,680 before this chapter (2,340 monthly + 2,340 permanent).
#   RIG: POST /openapi/v1/rigging {input_task_id, height_meters, skeleton_template "meshyrig", include_fingers true}.
#   ANIMATION: POST /openapi/v1/animations {rig_task_id, action_ids [1..10]} (one file, a clip an action), or
#   {rig_task_id, motion_task_id} for a text-to-motion clip (POST /openapi/v1/text-to-motion {prompt <= 400 chars,
#   mode "prime", duration 2..10 s in 0.5 steps}; skeleton-free; kept 3 days).
#   The library (ids 0..696) has no wai, no prayer, no kneeling sit, no Thai dance and no trance: those are made by
#   text-to-motion or written for the rig and finished in Blender.
#   The script for all of it: masters/v26.0/meshy26.py (the key is read from outside the repository, never printed).
#
# ---------------------------------------------------------------------------------------------------------------------
# 1. THE PEOPLE: the reference pictures (masters/v26.0/people/PROMPTS.txt has every prompt; refs/ the pictures)
# ---------------------------------------------------------------------------------------------------------------------
#   ton      bf968ba3-7ae3-4c16-8d36-ba5430f89b25   PICKED at first sight: a lean Thai man of about forty, a clean A
#            pose, the group's shirt (white, orange collar and sleeve ends), white trousers, barefoot, even light.
#   round 2 (eleven sent at once; three refused by the rate limit and sent again):
#   deva     dcedd3ad-53ab-45c7-9982-6cc45425222c
#   devb     8e1a043d-8ff4-4a21-ab88-17f50ff9728d
#   devf     0c7a2d55-a7d7-4d93-adc1-ec7ca4705b6b
#   devc     00adb4e8-320d-4268-95ea-2f1d69fa3670
#   devd     d4de4543-57fd-42ab-962f-7cce60728f88
#   dancera  1db0ce15-5e04-44fa-982c-c5f8dbc6deaa
#   dancerb  c45fe6e8-7914-45b3-860e-b78df491da0f
#   red      4526cab0-b5a3-4bfc-90e3-0c4a81233f22
#   deve     716ee4e6-61bd-4867-8529-972a1da2a73a
#   devg     5e68521b-a7d2-4d63-9603-8b88ee87105e
#   devh     165afb7b-3473-400a-a77b-42851d5cc129
#   round 3 (the robed and skirted four, held until the first rigs were seen):
#   hermita  28ce9791-4020-481a-b252-cea5cfa27d46   hermitb 3f6d47f1-a6fb-433a-9387-031c34683ae8
#   white    051d8dad-7d8f-4607-afdf-9cacf5de40be   bench   a9a37632-5e56-4053-83eb-22d273fd429d
#   Every one LOOKED AT before it went to Meshy (hands, feet, face, dress, the A pose). All sixteen at max/2k, 9 credits.
#
# ---------------------------------------------------------------------------------------------------------------------
# 2. THE PEOPLE: the models (ids are also in masters/v26.0/src/jobs.json, written by meshy26.py as each job starts)
# ---------------------------------------------------------------------------------------------------------------------
#   ton      image-to-3D 01a1cae4-fba4-7332-80bd-a33ffd4b4cf9   (highest settings, a-pose)
#   the other fifteen, their rigs, their takes and the text-to-motion clips: every id is in masters/v26.0/src/jobs.json
#   (committed) and in docs/V26.0-E4C3-BUILD.md §5, which is made from it.
#     python3 -I masters/v26.0/meshy26.py model masters/v26.0/people/jobs-ton.json      (and jobs-r2.json, jobs-r3.json)
#     sh masters/v26.0/rigall.sh ton:1.70 deva:1.62 devb:1.58 deve:1.55 devf:1.60 devc:1.74 devd:1.66 devg:1.72 \
#        devh:1.68 dancera:1.62 dancerb:1.60 red:1.68 hermita:1.66 hermitb:1.62 white:1.64 bench:1.52
#   What came back for the first man (measured): 313,088 triangles (300,000 asked), base colour a JPEG at 8192 x 8192,
#   normal a PNG at 4096, metal-roughness a JPEG at 4096; the rig 66 joints with fingers (three bones a finger and an
#   end bone), named as Mixamo names them, the body 1.70 m with its feet on the ground and its face along +z.
#
# ---------------------------------------------------------------------------------------------------------------------
# 3. THE PEOPLE: takes (tools/mergetakes.mjs)
# ---------------------------------------------------------------------------------------------------------------------
#   Every animation request hands back another whole copy of the body. Each is stripped to its bones and its animation
#   the moment it lands, after PROVING the body in it is the rig file's own (byte for byte for one take; bone for bone
#   in the world for a file of several library takes, which is a re-export: --same-rig), and merged onto the rig file:
#     python3 -I masters/v26.0/meshy26.py anim ton basics 0,56,47,30,41,313,365
#     python3 -I masters/v26.0/meshy26.py motion ton raise raise        (a text-to-motion clip by its name in the ledger)
#     node tools/mergetakes.mjs strip masters/v26.0/src/take-ton-basics.glb masters/v26.0/src/takes-ton-basics.glb \
#          masters/v26.0/src/rigged-ton.glb --same-rig
#     node tools/mergetakes.mjs merge masters/v26.0/src/rigged-ton.glb <out.glb> masters/v26.0/src/takes-ton-basics.glb \
#          masters/v26.0/src/takes-ton-walking.glb:Walking ...
#   Text-to-motion, judged on a rig (front, side and behind at six moments each; the verdicts are in the tracker's log):
#   dance1 KEPT (reads as a Thai classical dance); trance2 kept as raw material (arms rising wide; the shins float);
#   kneel, raise, wai, trance1 refused as they came. The prompts: masters/v26.0/people/MOTIONS.txt.
