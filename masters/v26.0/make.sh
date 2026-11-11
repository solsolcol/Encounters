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
#
# ---------------------------------------------------------------------------------------------------------------------
# 2. THE PEOPLE: the models (ids are also in masters/v26.0/src/jobs.json, written by meshy26.py as each job starts)
# ---------------------------------------------------------------------------------------------------------------------
#   ton      image-to-3D 01a1cae4-fba4-7332-80bd-a33ffd4b4cf9   (highest settings, a-pose)
