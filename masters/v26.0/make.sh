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
#   Round two (11 Nov, evening): offer, seiza, sway, give, palmover, armsopen. The lesson of round one's floating shins:
#   "kneeling and sitting back on the heels" keeps a kneeling body on the ground; "kneeling upright" floats it. Every
#   verdict, library and written, is the table in docs/V26.0-E4C3-BUILD.md §5.
#   Everyone's takes, one command (it skips what has landed, so after a lost machine it is simply run again):
#     sh masters/v26.0/alltakes.sh          (per person: sh masters/v26.0/takes.sh <name> lib lib <ids> ; ... t2m <clips>)
#   A file is removed only on the tool's own exit status, with no pipe between (a strip that REFUSED a file once had
#   that file deleted behind it by `| grep ... && rm`; it came back free with `meshy26.py refetch <name> <set>`).
#
# 3b. THE PEOPLE: from a rig and its takes to the game's files (11 Nov, evening and night)
#   NOTHING IS THINNED HERE. The first people files were thinned here and refused by photograph (the strict simplifier
#   stalled far over its count; the permissive one shredded faces; a sheet cut to 1024 smeared them). Chad: "I thought
#   the issue is mostly due to textures and not the triangles. As long as texture remains high res, it should be ok?"
#   He is right. So:
#     sh masters/v26.0/bodies.sh <name> <triangles> [<name> <triangles> ...]
#        meshy26.py remesh (Meshy's own remesh of the model to that count, 5 credits: it keeps the paint sharp), then
#        tools/riglod.mjs lays the rig's skeleton and weights onto the remeshed body (the rig in its rest pose, the
#        body fitted to it by its box and checked by the mean distance between the two surfaces: 0.1 to 4.5 mm);
#        -> masters/v26.0/src/body-<name>-<count>.glb. 48 bodies: 16 people at their near count (40,000 the two he
#        speaks to, 30,000 the masters and the dancers, 24,000 the devotees), 8,000 and 2,500.
#     sh masters/v26.0/people.sh [name ...]
#        mergetakes merge (the near body with every take the person wears), tools/calmarms.mjs (THE ARMS BROUGHT IN:
#        the library's stands and walks hold both upper arms 15 to 19 degrees out; each is set to a mean of 6 to 7,
#        its own movement kept at a share: CALM in the script; measure any file with `calmarms.mjs <file> --measure`),
#        then tools/prepmonk.mjs with NOTHIN=1 NOMAP=1 a level at a time (colour 2048 for anyone seen close, 1024
#        the devotees, 512 and 256 the two far levels), and for Ton and the woman at the bench the generator's own
#        model whole as a fourth skin (`h`, 313,000 triangles, drawn inside 2.7 m): -> assets/e4<name>[m|f|h].glb.
#   Rests judged by photograph (tools/clipsheet.mjs on the game's own files): the masters' is the seated idle's upright
#   window; the monks' the first third of a second of Sit_Thumbs_Up_Right; Grandmaster Pho's the first third of a
#   second of Sit_to_Stand_Transition_M (c_cast.js says why each).
#
# ---------------------------------------------------------------------------------------------------------------------
# 4. THE THINGS (masters/v26.0/props/)
# ---------------------------------------------------------------------------------------------------------------------
#   Chad: "You have to build out this chapter environment exactly to how the photos look like." So each thing begins as
#   a CROP OF HIS PHOTOGRAPH (the object only: never a face, never a name; the sheet of names on the wheel painted out,
#   the bottles' brands cropped away), uploaded to Higgsfield and given to GPT Image as its image reference beside a
#   plain description:  props/PROMPTS.py (HEAD, REFNOTE, and one row a prop: name, crop, quality, shape, words).
#   Heroes at max/2k (9 credits), table stock at high/2k (2.75). The picture is LOOKED AT (props/refs/<name>-2k.png,
#   its 1024 copy committed); its job id is props/jobs-refs.json; props/get.sh fetches a finished picture by name.
#   Then, for each:   sh masters/v26.0/props/prop.sh <name> ...
#     1. meshy26.py model (props/jobs-p1.json, jobs-p2.json): image-to-3D at the highest settings, 40 credits; a prop
#        does not ask for the untouched surface (a person does).
#     2. meshy26.py remesh <name> <triangles>: Meshy's own remesh to the count the game draws (5 credits). Nothing is
#        thinned here: a generated sheet is thousands of small islands and thinned it crumples along their seams (v25.5).
#     3. ERR=0.002 node tools/prepmeshy.mjs <remeshed> assets/<key>.glb <size> <axis> 1 <turn> <px>: real metres, the
#        origin on the base's centre, the sheets at the size the table gives.
#     4. the remeshed file (about 105 MB: its sheets come back at 8192 as PNG) is removed on prep's own success, and the
#        prop is photographed from four sides (tools/shootmodel.mjs).
#   The table: props/TABLE.txt (name, key, size in metres, the axis that size is, triangles, sheet size, turn).
#   Two pictures Meshy REFUSED ("image too complex"): the chrysanthemums and the roses, both a bunch of small blooms.
#   Not charged; each is asked for again as fewer, larger blooms. meshy26.py collect <name>... fetches what finished
#   and passes over what failed, where the first script stopped at the first refusal and left nine uncollected.
#   Batch two (11 Nov, night; props/jobs-p3.json): the small bai sri, the sofa, the two bowls of petals, the bench, the
#   mid and small candles, the sticky-rice basket, the boiled chicken, the coconut, the soda, the water.
#   WHAT MESHY WOULD NOT OR COULD NOT DO, and who did it (Higgsfield's hunyuan3d_v3_image_to_3d, enable_pbr,
#   generate_type Normal, face_count 40000 (its least), 19 credits each; nothing thinned; prepped by hand):
#     the steel bowl of petals  refused by Meshy ("image too complex")   job 1402dcea-8aa0-4e8d-ada9-d3da09eb0517
#        ERR=0.002 node tools/prepmeshy.mjs masters/v26.0/src/hunyuan-petalsteel-40k.glb assets/w3petalsteel.glb 0.36 w 1 0 512
#     the golden bowl of petals  Meshy's remesh at 6,000 crumpled the bowl   job 06b886ea-530a-488a-8fb5-83433f84261a
#        ERR=0.002 node tools/prepmeshy.mjs masters/v26.0/src/hunyuan-petalbowl-40k.glb assets/w3petalbowl.glb 0.34 w 1 0 512
#     the bush (croton)  refused by Meshy; Hunyuan's (6b32c62b-0c1f-44f8-b0dc-34cdd2137063) came back a tuft of grass
#        at 3,120 triangles: REFUSED by photograph, its file removed. The bush was drawn again with forty large leaves
#        (hall/refs/croton2-1024.jpg, job 9ef71b83-7b5b-4ffd-b898-3c139c23b390), which Meshy takes: `croton2` in the table.
#   Still to draw again: the chrysanthemums and the roses.
#   Batch three (12 Nov, early; props/jobs-p4.json): two props the films need, each a checked picture on white first
#   (GPT Image through Higgsfield, gpt_image_2_6, quality high, 2k; props/PROMPTS.py has the words), then Meshy at its
#   highest settings, its own remesh to the count in TABLE.txt, and prepmeshy (prop.sh):
#     the rolled reed mat  (ending A: "New ones roll the mats")   picture 8eebda1b-fe19-4343-a2c8-803756e92878
#        image-to-3D 01a1ccd2-f49b-747a-9b27-2198540c54d2 · remesh 6,000 01a1ccd7-e597-73f0-bb59-87bd4fd548fa -> assets/w3matroll.glb (1.2 m long)
#     the folded white T-shirt  (the opening film: what he packs)   picture 28920144-3ef0-4c76-b6e9-2d151d55c234
#        image-to-3D 01a1ccd2-fbd4-73e5-a4af-48f29a765f3d · remesh 4,000 01a1ccdc-6716-7485-a137-e3c76bb92fcf -> assets/w3shirt.glb (0.30 m wide;
#        modelled standing as its picture shows it: the chapter lays it on its back)
#   Cost: 2 pictures, 2 models (40 credits each) and 2 remeshes (5 each): Meshy 1591 -> 1501.
#   Batch four (13 Nov, small hours; props/jobs-p5.json, jobs-p6.json): WHAT THE TABLES' PHOTOGRAPHS HAVE THAT THE GAME DID
#   NOT (M8, photographs 3, 4, 9, 10 laid beside the game). The two flowers Meshy refused on 11 Nov were drawn again as
#   one closed mound of a few LARGE blooms (PROMPTS.py chrys2, roses2: pictures af13ccce-0565-434e-8106-24ef34595782 and
#   dae16155-ef78-42ae-96af-863ffbc85441), and Meshy REFUSED BOTH AGAIN at 44 % ("image too complex": tasks
#   01a1cdbf-eb07-71ed-a78d-be983585484d and 01a1cdbf-f429-73d9-9952-720334f4fa30, not charged). Hunyuan3D v3 took both
#   (enable_pbr, generate_type Normal, face_count 40000, 19 credits each; nothing thinned):
#     the white chrysanthemums in a silver bowl   job f3707bdc-60a0-4ee7-8f97-f0ac3cce80da -> src/hunyuan-chrys2-40k.glb
#        ERR=0.002 node tools/prepmeshy.mjs masters/v26.0/src/hunyuan-chrys2-40k.glb assets/w3chrys.glb 0.48 h 1 0 1024   (36,704 triangles)
#     the roses and daisies in a white bowl       job c4081ee3-f857-4a9f-b3d2-4fca513096ff -> src/hunyuan-roses2-40k.glb
#        ERR=0.002 node tools/prepmeshy.mjs masters/v26.0/src/hunyuan-roses2-40k.glb assets/w3roses.glb 0.46 w 1 0 1024   (39,996)
#     the clay pot of sand before the tables (photograph 10)   picture cde47ea2-d410-4e2e-b9e7-82ec14b78774
#        Meshy image-to-3D 01a1cdc8-4f92-745d-9e5a-71c3d5dcd624 · remesh 3,000 01a1cdce-81e0-7140-9cbb-b3113714afec -> assets/w3claypot.glb (0.45 m wide)
#     then sh masters/v26.0/props/lods.sh (far levels: 2,398, 2,922, 610) and python3 -I masters/v26.0/keys.py --write.
#   Each looked at from four sides before it was placed. The chrysanthemums came out a closed dome in tiers (a real
#   bunch is a loose spray: what a generator would take); they stand at 1.3 of the model, on the middle and top steps.
#   Cost: 3 pictures, 2 Hunyuan models (38 Higgsfield credits), 1 Meshy model and 1 remesh (45): Meshy 1501 -> 1456.
#
#   BATCH FIVE (13 Nov, after the release was live): WHAT THE PLAN LISTED AND THE BUILD NEVER MADE, found by reading the
#   plan's own lists against the build (the tracker's log, 13 Nov): its 6.3 names plastic chairs and loudspeakers, its
#   4.1 a woman lighting her candle with a long taper and children running, its 3.7 children among the people.
#     a plastic chair (photographs 5, 6)          picture 9b967d3f-6f5e-4ee8-9314-c526580f6731
#        Meshy image-to-3D 01a1cdf6-3d8a-7279-b42c-17a47a8f9974 · remesh 4,000 01a1cdfb-df27-77dd-87f6-261a376454a7 -> assets/w3pchair.glb (0.80 m)
#     a pair of horn loudspeakers                 picture a48b9872-2764-4c0c-9371-5ce1a118f51c
#        Meshy image-to-3D 01a1cdf6-4571-77ba-b0ef-6d5d8f47a4db · remesh 5,000 01a1cdff-6be2-77af-9110-643916095738 -> assets/w3horns.glb (0.95 m wide)
#     the long taper (photograph 10)              picture 26af5e94-ceca-4088-9e79-1871653716c8
#        Meshy image-to-3D 01a1ce0f-f99b-7620-be45-c32285645a0e · remesh 1,500 01a1ce14-a478-7568-9a48-cafdfb87d3e4 -> assets/w3taper.glb (0.70 m)
#     a glass of red soda with a straw (photograph 12)   picture 1b666022-6ae3-44c6-9a29-c814f35b3a45
#        Meshy image-to-3D 01a1ce37-cd4d-767e-8837-e50b39e8bcf8 · remesh 1,500 01a1ce3d-034b-70b8-addd-b74dd4b138ed -> assets/w3glass.glb (0.15 m)
#     a roll of tissue (photographs 2, 11)        picture 0c90c1f6-3d6c-408c-bf2f-1fc6346f3d30
#        Meshy image-to-3D 01a1ce37-d629-749c-bc70-392bb77ba1a9 · remesh 1,000 01a1ce3f-f10e-77d3-b13c-92127a20cdf3 -> assets/w3tissue.glb (0.11 m)
#     (props/jobs-p7.json, jobs-p8.json, jobs-p9.json; sh masters/v26.0/props/prop.sh pchair horns taper glass tissue; each
#      looked at from four sides. The glass's clear wall is not drawn: its rim stands as a ring over the drink)
#     the turquoise mat with round flowers (photograph 12)   picture 3457980f-0b9b-47df-bf86-3ceeac373db1
#        python3 -I masters/v26.0/tex/make.py bluemat -> assets/w3t_bluemat.jpg (1024 x 680, as it came: one mat)
#   THE CHILDREN, made as every person was (people/PROMPTS.txt; people/jobs-kids-a.json, -b.json):
#     a girl of seven   picture a7a3c24e-9f17-4417-909e-681bebaee6b3 · Meshy image-to-3D 01a1ce0e-20df-73b0-9d6e-3809777d8aec
#        rig 01a1ce12-26ab-76b2-93d3-2326c3379e08 (1.15 m) · library takes 243, 14, 15, 118, 44: 01a1ce14-f0d8-7078-9fea-4aa02925d098
#        remesh 24,000 01a1ce22-36a0-7029-b3f3-3c8239716c25 · 4,000 01a1ce18-f85f-7270-b222-ee109322e2a1 · 1,500 01a1ce1c-f5b7-77cd-8f97-613c6003f860
#     a boy of five     picture 6eb16e5c-3a9c-4f07-9e14-6653a48d87f6 · Meshy image-to-3D 01a1ce0f-f8d9-714e-a6d2-f993a10f080e
#        rig 01a1ce14-a317-7454-a5d1-62a19677778e (1.05 m) · library takes 243, 14, 15, 118, 61: 01a1ce19-82d7-7272-acd6-6fdaa12d00e4
#        remesh 24,000 01a1ce27-7249-74b1-aee3-6233f36d71c0 · 4,000 01a1ce1d-80d2-73f3-8d23-b9d9e38dbf82 · 1,500 01a1ce21-4425-777f-8de5-0388a5e54938
#     sh masters/v26.0/rigall.sh girl:1.15 boy:1.05 ; sh masters/v26.0/takes.sh girl lib kid 243,14,15,118,44 (boy: ...,61) ;
#     sh masters/v26.0/bodies.sh girl 24000 girl 4000 girl 1500 boy 24000 boy 4000 boy 1500 ; sh masters/v26.0/people.sh girl boy
#     MINE, AND WASTED: each child's first near body was asked at 12,000 (half a grown one's), and in the lab's light both
#     faces came out dark from the lip down. I took it for the generator's paint and made the girl's model again
#     (01a1ce23-a493-748d-945e-45ea3712a5ca, 40 credits, never used) before photographing her UNLIT: the paint was clean.
#     It is shading: a small child's chin faces forward and down, and a steep light leaves it dark. The remesh's own
#     normal sheet (tried on the boy at 1024) drew every facet, because the prep shares normals across the sheet's seams.
#     Photograph a model lit AND unlit before blaming its paint. The near bodies are 24,000; the game's own light is the judge.
#   Cost: 9 pictures (about 60 Higgsfield credits); Meshy 5 props (225) + 3 child models, 2 rigs, 2 take sets, 8 remeshes (200).
#
# 4b. THE HALL (masters/v26.0/hall/; Chad, 11 Nov evening: "More images of the building behind, at the wai kru")
#   Its statues, plants and lamp are models made the same way from crops of photographs 13 to 16 (objects only; the
#   sign board, which carries the real place's name, was never sent anywhere): hall/jobs-hall.json (the reference
#   pictures), hall/PROMPTS.txt, hall/jobs-m1.json to jobs-m3.json (the models), the rows of props/TABLE.txt.
#   Its six surfaces (red pressed roof, brick, step tile, lawn, the kalae, the fretwork) are tex/make.py's `tile` mode:
#   a pattern's own period measured, the picture cut to a whole and even number of rows, so each repeats exactly.
#   ITS SIGN IS DRAWN, not generated:  CHROMIUM_PATH=/opt/pw-browsers/chromium node masters/v26.0/hall/sign.mjs
#   (a browser shapes the Thai; its words are generic and name nobody: assets/w3t_sign.webp, 2048 x 366).
#
# ---------------------------------------------------------------------------------------------------------------------
# 5. THE GROUND'S SURFACES (masters/v26.0/tex/)
# ---------------------------------------------------------------------------------------------------------------------
#   The turf, the red earth, the gravel, the hall's roof tiles, its timber and brick, the red planks, the pink tin, the
#   tables' green satin skirt and their jasmine garland, white satin, one tiered banner, a rug, a reed mat, the far line
#   of trees and the turf deep in petals are PICTURES, each made by GPT Image (high/2k, 2.75 credits) from a crop of his
#   photograph of the real surface where one exists: tex/PROMPTS.txt (every prompt), tex/jobs-tex.json (every job).
#     HF_BASE=<this account's results folder> sh masters/v26.0/tex/get.sh <name>:<file> ...    (into tex/src, ignored)
#     python3 -I masters/v26.0/tex/make.py                                                      (into assets/w3t_<name>)
#   make.py: a surface with no pattern to break (grass, earth, gravel, petals) is made to repeat exactly; a patterned one
#   is kept as it came and the chapter mirrors it or repeats it only where its join is clean; one that must be cut out
#   was asked for on solid magenta, its alpha is how magenta a point is, the pink spill is taken off its edges, and the
#   colour under the cut-away part is grown outward from the kept part so no magenta shows at a distance.
#   Sixteen pictures, 44 credits.
#
# ---------------------------------------------------------------------------------------------------------------------
# 6. THE CHAPTER'S FILE IS ASSEMBLED (masters/v26.0/assemble.py, masters/v26.0/parts/, masters/v26.0/script/)
# ---------------------------------------------------------------------------------------------------------------------
#     python3 -I masters/v26.0/script/secs.py     every line's length into the head part (lines.py: all 104 lines)
#     python3 -I masters/v26.0/assemble.py        parts/*.js, with chapter 2's helpers copied in by pinned line ranges
#     python3 -I masters/v26.0/keys.py --write    EVERY ASSET KEY from one table: build.py's rows and hosted-only set and
#                                                 the head part's list, between markers (only keys whose file is in
#                                                 assets/; the rest are reported as not there yet). Run it after
#                                                 anything lands, then assemble and build.
#   src/chapters/e4/e4c3.js is never edited by hand.
