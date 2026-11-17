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
#
# ---------------------------------------------------------------------------------------------------------------------
# 2. THE PEOPLE AND THE SPIRITS: the models, rigs and takes (every id is in masters/v27.0/src/jobs.json)
# ---------------------------------------------------------------------------------------------------------------------
#   python3 -I masters/v27.0/meshy27.py model masters/v27.0/people/jobs-r1.json   (ravi mala appa wander large: 200 credits)
#   python3 -I masters/v27.0/meshy27.py model masters/v27.0/people/jobs-r2.json   (amma oppress: 80)
#   sh masters/v27.0/rigall.sh amma:1.52 ravi:1.70 mala:1.58 appa:1.66 oppress:1.78 wander:1.35 large:2.10   (35)
#   the 20 written motions (masters/v27.0/people/MOTIONS.txt; 200): t2m, each skeleton-free, kept three days
#   sh masters/v27.0/alltakes.sh   (each body's library set and its motions laid on its rig; 3 a take)
#   TRAP (17 Nov): a take file from Meshy carries the whole body (60 to 90 MB) until mergetakes strips it to its bones;
#   six laid on one rig at once filled the disk (the downloads died as .part files; the jobs are kept, refetch is free).
#
# ---------------------------------------------------------------------------------------------------------------------
# 3. THE THINGS OF THE FLAT: the reference pictures (masters/v27.0/props/PROMPTS.py has every prompt)
# ---------------------------------------------------------------------------------------------------------------------
#   batch 0 (high/2k, 2.75 each): wheelchair 74a84fe6-ba42-4f2c-8cbe-cd64f0aa14ec · prayershelf 82b4d40d-fa22-4d92-99bb-c7c328c0425d
#     vilakku a37783fd-17af-4f98-9a15-9558c20a54b8 · waterbowl ace572c6-2d70-46a9-8370-c9632bd96277
#     bigbowl 9607c5c7-0fa8-420b-a5c0-e4704a1266d4 · sofa 6982e87b-a4b1-4dc3-94b8-8609b773eba4
#     cabinet fc3f574e-3b2e-42c0-9209-6b88de907fbe · diningtable 8900912c-d82e-43cf-9326-ba97fa4dbb6b
#   batch 1 (four refused by the rate limit, 429, sent again later): frameport 834674af-a94f-44a5-93ba-0fb6e25f0d86 ·
#     dinechair 6b840bee-b988-4ca6-86d4-ebdeb95479b5 · framesmall 43e3bb88-18fa-430e-b98a-79ee9ac92ee1 ·
#     hugger b63d1a69-fc65-4dd0-b557-a1e4165a2eee
#   batch 2: folder 60fbeb7d-fc76-4f47-8aac-7d7c2a773c69 · gate c0745d0d-52cb-4f87-89f5-9829cd523080 ·
#     garland 4a4471ab-736f-4c2b-8fc0-762910f70a55 · armchair 656ae90e-6992-4fd2-bf2f-bf5b4ac68906 ·
#     tubelight a48ede09-d2c5-4504-88c4-d6d7ad4a7d15 (3:1 asked, 21:9 given) · tvconsole 52212486-ad4b-47c1-9556-d522cacba52e ·
#     stool 9b0a0d29-6619-4ba5-810d-fe8ed4b598f8 · standfan 46a63791-da33-4dce-8b47-bfec10f07b4a
#   LOOKED AT full size (batch 0 and the four of batch 1 that went through): all pass (the wheelchair worn and rusted
#   with years; the prayer shelf empty, an arched carved canopy; the lamp with a swan finial; the small bowl embossed with
#   lotus petals; the large one scalloped, flowers floating; the sofa's crocheted doily; the cabinet's blue-and-white
#   china, brass and two carved elephants). Sent to Meshy: masters/v27.0/props/jobs-p1.json.
#   TRAP (17 Nov): ten takes' job ids were lost to a race in the take bookkeeping (several takes laid on one body at once
#   each wrote back the row it read at its start) and their downloads to the full disk; laid again after take_note was
#   added (meshy27.py): amma wsit trance rise steps lamp · oppress cling oturn claw torn · wander crawl (30 credits).
#   And four more rows the same race wrote over, though their files came down whole and are kept (takes-mala-kneelhold,
#   -mala-scream, -ravi-rush, -ravi-struggle): their animation jobs are four of these six of the first wave, which the
#   ledger lacks (Meshy's task list, read 17 Nov 22:10; a task names neither its rig nor its motion, so which is which
#   is not known; the other two were superseded): 01a1eb7d-b95d-778f-bf0b-24dd9393251a 01a1eb7d-b98c-700f-b8cc-29d2ab7a375f
#   01a1eb7d-b935-70f4-8078-317fd6f858ae 01a1eb7d-b929-714e-9120-c67c9955a547 01a1eb7d-b94d-7122-87c4-4e5e696b3e15
#   01a1eb7d-fa24-713c-b9e6-70601ea34499. All 32 take files are in masters/v27.0/src (each distinct by sha1).
#   LOOKED AT full size (batch 2): folder, gate, frameport (carved, gilt inner edge, blank), armchair (teak, slatted,
#   faded palm-print cushions), tubelight, tvconsole (blank screen, no mark), stool (the red one with the hole),
#   standfan (pale blue blades, no mark): all pass. The garland passes as a thing but lies in a flat oval; the frames
#   want one HANGING (a U over a frame's top corners): made again as 'garlandhang' (batch 3). Sent to Meshy:
#   masters/v27.0/props/jobs-p2.json.
#   batch 3a (medium/2k, 1 each): shoerack d92c54ac-5f88-4488-8461-1bcc28f1b282 · tulsi 52420416-d9db-4902-a7e3-1043f5ee88cc ·
#     door c8032e24-1630-4191-a44a-93a0d22ac428 · fridge 728b3f95-40ba-47d7-aa17-c27f41ae7686 ·
#     pilltray a88b7862-1e8d-4e01-b066-d79176cdc96b · clock 6955e3ff-8cd8-4271-853a-17b09d716cd1 ·
#     phonetable ac77a7f1-6c45-40bb-890b-0fd9c663fd09 · bed a8c42848-be5b-415b-b1f7-ca1736a5d914
#   (Higgsfield read 31.5 before batch 3: the pictures are nearly spent; batch 3 costs 15.75)
#   batch 3b: commode 2d8b2420-b617-49ad-914b-e4f326530f93 · poles 6b99d785-3ddf-4b89-baa4-c71431caa577 (21:9 given) ·
#     thoranam c680a9f9-2d20-4396-8259-87fa37829a14 (21:9 given) · altartray 93b07d6a-a028-4617-a8e4-78b4617d8cf8 ·
#     coffeetable e1f587d6-87d6-4518-b16f-711ab5c2979d · garlandhang (high) e57a8c80-28b5-41bd-8489-98cb1428e597
#   LOOKED AT full size (batch 3): shoerack (nine pairs, worn), tulsi (in flower, terracotta pot on its stand), door
#   (flush, brass lever and keyhole), fridge (fruit magnets, blank cards), pilltray (the organiser's day names are its
#   own print, no brand), clock, phonetable (beige push-button phone), bed (chrome rail), commode, thoranam, altartray
#   (its little lamp came LIT: the flame is cut at prep and the game's own flame drawn), coffeetable (a glass top: if
#   the model paints the slats seen through it, the top is made glass at prep), garlandhang (a U with its tassel):
#   all pass. poles: REFUSED (an A-frame rack: in a flat they go out of the kitchen window into wall sockets, R-C
#   §1.10); asked again with no stand: poles 7b9f5769-c15a-48ae-a90a-d068c8872169.
#   The new poles picture LOOKED AT full size: three bare poles, a shirt on a wire hanger, a towel, a printed cotton: pass
#   (they stand one above another; in the flat they are turned to stick straight out from the wall under the window).
#   The refused rack picture is kept out of refs (scratch only). Sent to Meshy: masters/v27.0/props/jobs-p3.json (14).
#
# ---------------------------------------------------------------------------------------------------------------------
# 4. THE VOICES (17 Nov): three new speakers cast from the ElevenLabs library (voice DESIGN refused: the connector lacks
#    the permission), one take each of a line in the part, eleven_v3, judged by measure (a session has no ears:
#    masters/v27.0/voices/audition/*.mp3 kept for Chad's ear; $S/e4c4/tools/vmeasure.py: speech span, words a second,
#    median pitch by autocorrelation, the end's level). Flow 98Se8Zdasa6YKTq5qoSb.
#    Amma  "[weary] Seven years I have been in this chair. The doctors said it is my age. You can see it, can't you?"
#      Tara (cyzr0852QKE5DHnjiRWw)   186 Hz  2.75 w/s  <- PICKED: the lowest and most unhurried; aged by the line's tag
#      Sonam (PIuCDYHMakaExG7GFyLU)  235 Hz  2.68 w/s
#      Lipsa (ql1brKcEMYebkPHXLRba)  229 Hz  3.19 w/s (rushed)
#    Ravi  "[worried] Seven years. She just stopped walking properly. First a cane, then this chair. Every test came back normal."
#      Dhananjay (mnlHLlgagNmPlvf52KvT)  88 Hz  2.50 w/s  <- PICKED: the game's pace, a son's plain voice
#      Michael (PablrLlv6N5OXBbslUrg)   113 Hz  1.98 w/s (slow)
#      Mayur (9IAi5SvX5bAamiDIdLdI)     190 Hz  2.19 w/s
#    Mala: Sonam (PIuCDYHMakaExG7GFyLU), 235 Hz, calm, kept well apart from her mother's 186 (the plan's three voices
#      must not sound like one another). Library voices have no "old" Indian woman: Tara is aged by the tag, as the
#      granny of episode 1 was (Lexi, voicelines.js).

