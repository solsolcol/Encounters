#!/usr/bin/env bash
# v27.0 · episode 4 chapter 4 (The Woman Who Rose From Her Wheelchair): every generated person, spirit, thing, voice and
# sound, and how. The design is docs/V27.0-E4C4-PLAN.md; where the build stands is docs/V27.0-E4C4-BUILD.md. This file is
# the RECIPE: every setting, every job's id, every pick and why. It is a record to read, not a script to run end to end
# (a job costs credits, and Meshy keeps a job's files three days).
#
# Chad, 17 Nov 2026 (plan §0): "Do all of your research ..., write out the full build plan, and only once after all that
# is done, proceed automatically to build the entire chapter out with full maximum effort."  And of 11 Nov (v26.0, still
# standing): references of a person "photorealistic ... against a white background, in A pose", then Meshy, rig, takes.
#
# ---------------------------------------------------------------------------------------------------------------------
# 0. THE SERVICES, read from the services themselves on 17 Nov 2026 (never from memory)
# ---------------------------------------------------------------------------------------------------------------------
# HIGGSFIELD (GPT Image): model gpt_image_2_6. Price read by preflight (get_cost) on 17 Nov: medium/2k 1 · high/2k 2.75
#   · xhigh/2k 4.5 · max/2k 9 credits. Balance 125.75 before this chapter (plan "plus").
# MESHY: balance 3,231 before this chapter (3,165 monthly + 66 permanent). Settings and prices: masters/v26.0/make.sh §0
#   (meshy-7.1 "latest", geometry 4k, texture meshy-7 PBR 8k, remesh 300,000, a-pose): masters/v27.0/meshy27.py.
#
# ---------------------------------------------------------------------------------------------------------------------
# 1. THE PEOPLE AND THE SPIRITS: the reference pictures (masters/v27.0/people/PROMPTS.txt has every prompt)
# ---------------------------------------------------------------------------------------------------------------------
#   round 1 (17 Nov; seven at once): people at max/2k (9), spirits at high/2k (2.75): 44.25 credits
#   amma     d81dec49-f89f-4cfa-b6b4-f29efabc9cce
#   ravi     9a9c4c63-4c63-44a3-aba5-a0e1c5031668
#   mala     8fc91d00-902a-4946-81c1-4946bc1ce3d0
#   appa     163f3220-d98a-4692-a941-0b307ac0ac25
#   oppress  880613f4-6917-46c6-94fd-c9c687726e56
#   wander   e6b456f1-54f6-4a43-a4f8-a4bba9053da6
#   large    5e0e8537-5aa2-4925-bbed-494c6866b20f
#   LOOKED AT full size (17 Nov): ravi, mala, appa, wander, large pass (A pose clean, five fingers a hand, both feet
#   down, dress as written). amma's first picture (above) is right in every way but one: the end of her sari hangs
#   between her left arm and her body, which is what fused Grandmaster Pho's robe to his arm (v24.39 to v24.56). Made
#   again with the end tucked at the waist (the practical way at home) and the arms further out:
#   amma2    6acf8b43-3f5c-4515-b4be-a7c2ff8b6d5a   (max/2k, 9)
#   oppress's first picture was refused by the service's filter ("emaciated", ribs, "only a loincloth"; status nsfw).
#   Worded again as the small one passed (thin, bony, a wrap to the knees):
#   oppress2 2cf337e1-7a78-44c3-8f9f-d8963238347d   (high/2k, 2.75)
#   LOOKED AT full size: amma2 passes (the sari's end across her chest and tucked at the waist; clear space between each
#   arm and her side; five fingers a hand; both feet down); oppress2 passes. The refs keep amma1 (amma1-a-*) for the record.
#   Spent on pictures: 53.25 credits (balance read 125.75 -> 72.5: the refused picture charged nothing).
