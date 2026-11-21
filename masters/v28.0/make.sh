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
#   RESULT (20 Nov): Meshy job 01a1fad1-9e16-72a2-8ab5-46675a67428c (68.1 MB), its remesh at 30,000 triangles
#   01a1fad8-c191-772b-ad99-4a1febd192cf; prepared by props/prop.sh from props/TABLE.txt (1.40 m tall, its foot at the
#   origin): assets/w5nagastaff.glb, 31,130 triangles, 0.333 x 1.40 x 0.115 m, 3.16 MB. PHOTOGRAPHED on its own from four
#   sides and its head close: one Naga head, the crest, the open jaw, the coil round the shaft as his photograph. Its
#   height (1.40 m) is the plan's: his photograph does not give it (plan section 16, question 21). A lighter level is
#   made only if the fight's frame on a phone asks for it (plan section 13).
#
# ---------------------------------------------------------------------------------------------------------------------
# 3. THE SERVICES AGAIN (he topped them up, 20 Nov): read from the services themselves
# ---------------------------------------------------------------------------------------------------------------------
# MESHY 3,528 before Master Zavier's second body, 3,428 after his third, and 3,373 after the third's second rig and
#   the fourth body (read 21 Nov: 307 monthly, 3,066 permanent): a body costs 40 (the model) + 5 (the rig) + 5 (a
#   remesh).
# HIGGSFIELD about 490 after the second reference (max/2k, one image reference: 9 credits by estimate_image_cost).
# ELEVENLABS 152,910 of 298,182 characters left this month (read with the key, never printed).
#
# ---------------------------------------------------------------------------------------------------------------------
# 4. MASTER ZAVIER'S BODY: FOUR made, and what each taught (every id is in src/jobs.json)
# ---------------------------------------------------------------------------------------------------------------------
# THE RECIPE, a body:   python3 -I masters/v28.0/meshy28.py model people/jobs-rN.json      (40 credits; a-pose, 4k
#                        geometry, meshy-7 PBR 8k, remesh 300,000)
#                       sh masters/v28.0/rigall.sh <name>:1.74                              (5; fingers; its own walk)
#                       sh masters/v28.0/bodies.sh <name> 40000                             (5; Meshy's remesh + riglod)
#                       LEVELS=none BPY=<Blender's Python with xatlas> sh masters/v28.0/people.sh <name>
#   -> assets/p5zavier.glb (the near body, about 41,500 triangles, its walk) and assets/p5zavierh.glb (every triangle).
#   people.sh's OUTN names the files a body writes: the fourth writes p5zavier*, the first now writes p5zavier1*.
#
# zavier  (reference zavier-a-2k.png; model 01a1fad1-8abc-701a-954a-da0a538b9722, rig 01a1fad8-70ea-70d4-8a99-31198f97e6be,
#   remesh 01a1fadb-b2de-736a-a089-418cf5833685): the face nearest the reference (a young, narrow face, eyes ahead).
#   REFUSED: four fingers of each hand are ONE piece, the gaps between them only painted (the reference held its hands
#   edge on, fingers together: the generator saw a mitten); the watch a noisy checkered patch.
# zavier2 (reference zavier-a2-2k.png: Higgsfield job 0a750948-746e-4ffa-9af9-d2018b146e65, max/2k, the first picture
#   as its image reference: the same man, palms forward, every finger apart, a plain round watch; model
#   01a1fb17-af8d-74ef-9443-8c659a7ae9a0, rig 01a1fb1c-0c2b-7057-abe7-028cb85ce670, remesh
#   01a1fb1e-bf3c-760f-9a62-848653f78804): every finger its own. REFUSED: both eyes painted looking to his right; a
#   raised lump like a plaster on the back of his left hand; the face wider than the reference.
# zavier3 (the same reference again: a generation is not repeatable, and the second's faults were the generator's own
#   throw; model 01a1fb27-c9c3-7711-9c1b-5f2af89e5c0e, rig 01a1fb2b-e7a4-75d8-a428-fd7ef92793f0, remesh
#   01a1fb2e-3e83-776d-8459-0212c5726807): every finger its own on both hands, no lump, the eyes ahead. REFUSED: THE RIG
#   CAME BACK WITH NO FINGER BONES (32 joints where the others have 66), though include_fingers was asked. Rigged a
#   second time (zavier3b, rig 01a1fb34-359b-73cc-a392-6b5f110fa0ed, 5 credits): 32 joints again, byte for byte the same
#   skeleton. It is the generated hands' own pose that decides it: this body's hands came out flat with the palms
#   forward, and Meshy's rig gives such hands no fingers. Its face was also broader and older than the reference's.
# zavier4 (the same reference a third time; people/jobs-r4.json; model 01a1fb34-5aaf-76bb-a93e-b8db74645b31, rig
#   01a1fb38-74a9-774b-8d83-96bfd5a80c18, remesh 01a1fb3c-1e3d-70e3-9858-bd1702390164): 66 joints, every finger its
#   own with its bones, the eyes ahead, a young face near the reference's, a watch that reads as a watch. THE BODY THAT
#   GOES ON (6).
# WHAT A REFERENCE MUST SHOW for a person whose hands will be seen: the PALMS TOWARD THE LENS with every finger apart
#   (hands held edge on come back as mittens). And even then each generation is its own throw: count the rig's joints
#   (66 with fingers, 32 without) and look at the eyes and the backs of the hands before anything is built on a body.
#
# ---------------------------------------------------------------------------------------------------------------------
# 5. THE PREP, and five things these bodies found (tools/prepmonk.mjs, tools/repaint.py, tools/edgeclean.py)
# ---------------------------------------------------------------------------------------------------------------------
# a. A MARLED KNIT CANNOT TAKE CHARTFIX ALONE. The cardigan's sheet is thousands of thin charts; CHARTFIX paints a thin
#    chart one flat colour, and a salt-and-pepper knit came out as grey shards all over, seen at once at arm's length.
#    The full body is therefore REPAINTED too (people.sh HEROKEEP= empty): cut again by xatlas, baked from the 8192
#    sheet, drawn with mipmaps.
# b. ONE TRIANGLE OUTSIDE THE SQUARE THREW AWAY THE FACE'S LARGER SHARE. The repaint's second packing (the face three
#    times its share) left one triangle of 312,640 outside; the fallback kept the first packing and the face fell from
#    2,100 texels a metre to 1,008. MENDOUT=<n> (repaint.py, opt-in): with no more than n triangles outside, the second
#    packing is kept and those are mended with the corners xatlas never placed. The first body's full model: 8,635
#    mended slivers, together 23 cm2 of the body, the largest 4.7 mm2; its face 1,867 texels a metre.
# c. THE PAINT DOES NOT FOLLOW THE BODY'S EDGES. Where two materials meet (the T-shirt's neck on the skin, the
#    cardigan's two front edges on the T-shirt) the generator paints the border a few millimetres off the step in the
#    body, ragged: a strip of skin on the shirt, a dark hairline on the neck, knit on the shirt. tools/edgeclean.py
#    (EDGECLEAN=<spec>, opt-in; people/edgeclean-<name>.json) finds the edge ON THE BODY inside a box (in each 2 mm slice,
#    walking one way, the first wall that faces back at the walker) and paints each side its own material up to it;
#    a smooth material is filled smooth, a textured one mirrored through its nearest clean texel. A region may be cut by
#    two planes across a slanted limb (`slab`). Depth profiles (scratch: profile.py, profile_y.py) proved where the step
#    is before anything was painted. A box fitted to one body does NOT fit the next: each body has its own spec.
# d. A SLIVER TRIANGLE COVERS NO TEXEL CENTRE. The first pass left dotted remnants on the full body only: its thin
#    triangles own no texel by the centre test. edgeclean's raster gives a texel to a triangle within 0.75 texel.
# e. A TORN SLIVER COUNTED AS HALF THE SHEET. The second body's full model lost its face's share again, the log saying
#    the second packing "covers 3583 % of the square in sum": 214 triangles each about 0.2 mm2 on the body whose corners
#    xatlas had put in two charts, so each stretched across up to half the sheet and was summed at that size. With
#    MENDOUT set, a triangle whose edge is stretched more than eight times its chart's own scale is left out of that
#    sum (it is one of the slivers MENDOUT mends) and the packing is kept. The first body's files come out byte for byte
#    as before with the change (it had none).
# f. A WATCH IS NOT MENDED BY A FILL. The first body's noisy watch was filled smooth inside a slab: a white bandage with
#    a ragged skin edge. Taken back out. A thing the generator draws wrong is made again (a new body), not painted over.
#
# ---------------------------------------------------------------------------------------------------------------------
# 6. THE FOURTH BODY'S PREP (21 Nov 2026): what its line in people.sh sets, and why
# ---------------------------------------------------------------------------------------------------------------------
#   ( WSMOOTH=0 XSCALE=1000 FINS=1 HEROKEEP= OUTN=zavier one zavier4 40000 2048 ... )      -> assets/p5zavier.glb, p5zavierh.glb
# Each switch was adopted only after its picture was seen better at full size; unset, each tool is as it was (5g).
# WSMOOTH=0: THE PREP'S WEIGHT SMOOTHING SMEARED HIS KNIT WHEN HE MOVES. The walk seen from behind, where the fight's
#   camera stands: patches of 3 x 9 cm between the shoulder blades, none in the bind pose and none on the body as rigged.
#   tools/probes/edgestrain.mjs (new, read only: how far a take stretches a skinned body's edges, by part), his back in
#   the walk at 0.3, 99th percentile stretch / roughness: near 1.365 / 0.53 unsmoothed against 1.741 / 1.13 smoothed
#   (WSMOOTH 2, 4 and 8 each worse than 0); full 1.372 / 0.60 against 1.627 / 0.97. The chest and both armpits are best
#   unsmoothed too. (The smoothing was written for Grandmaster Pho's robe, whose auto-rig's weights were blocky; this
#   rig's are not, and a marled knit shows every strain.)
# XSCALE=1000: XATLAS TAKES A TRIANGLE TOO SMALL IN ITS UNIT FOR NO TRIANGLE, twice (in its cut, and in its second
#   packing) and leaves its corners at the sheet's corner. In metres: 12,807 of the full body's 312,932 triangles
#   (16.7 cm2 of him), each drawn in whatever the corner texel holds: dark and pink specks along every edge of the
#   cardigan and on his skin. In millimetres: none; charts 9,530 -> 2,221; torn slivers 8,036 -> 0; triangles of one flat
#   colour 18,648 (33 cm2) -> 3,841 (5.1 cm2); of the wrong material 3,145 -> 214 (28 mm2); and a sharper sheet (full
#   body, texels a metre: face 1,944 -> 2,256, head 1,470 -> 1,710, hands 1,045 -> 1,215, body 700 -> 816).
# FINS=1: A REMESH CAN LEAVE A TRIANGLE LYING ON THE BODY BY ONE EDGE (tools/probes/fins.mjs, new, owns the test). The
#   near body had 16 (44.7 mm2; the largest, 30 mm2, a dark facet nine millimetres across on his left cheek, dark
#   whatever was painted on it), the full one 12 (7.4 mm2). Taken out; no hole opens (open edges not on a fin: 0 and 4,
#   unchanged).
# THE EDGE SPEC (people/edgeclean-zavier4.json; metres, feet at 0, his left +x): collar (tee over skin); frontR, frontL
#   (knit over tee); neckR, neckL (knit over skin); rollR, rollL (knit on the collar's roll); cheekL (skin); sideL,
#   sideR: THE FLAT GREY THE GENERATOR LEFT UNDER BOTH ARMS, where it could not see: the same colour as the knit by
#   every test but its weave (the spread of lightness round a texel: about twelve on the knit, under two on the grey),
#   so a class may ask for a weave (`sd`), flat is turned to knit (`turn`), grown 3 mm (`grow`) and filled with the
#   clean weave ONE MOVE away, a cell of 3 cm at a time (`clone`: the mirror fill left hairlines and a dark smear).
# THE LOG: near 41,534 -> 41,518 triangles, 1,072 charts; full 312,944 -> 312,932, 2,221 charts; the second packing kept
#   on both; texels a metre near / full: face 2,290 / 2,256, head 1,770 / 1,710, hands 1,251 / 1,215, body 849 / 816; the
#   edge clean painted 71,774 / 70,273 texels (the two sides about 31,000 each).
# PHOTOGRAPHED (scratch: e4c5/zav4, N-* the near body, H-* the full, W* the walk; 27 views a level) and each opened at
#   its full size. WHAT IS STILL WRONG, said to Chad (21 Nov):
#   both levels: the tee's neckline, a dotted pale fringe 25 mm wide at its centre and ragged ends (a white notch 6 x 8
#     mm on his left, a skin-coloured tab 8 x 15 mm on his right); teeth of 1 to 2 mm on the lapels at the neck and down
#     both front edges; under the arms the knit is knit but coarser in patches (25 x 50 mm lighter and a matted column
#     40 x 80 mm on his left, a band 40 x 180 mm on his right); grey-blue marks of 4 to 12 mm in the finger webs; the
#     belt white with black blobs and a smeared buckle (the generator's); pale strokes down the hair's back; a seam in
#     the weave near each cuff; in the walk from behind a white hairline of 40 mm low on his left back and one along
#     the hem (neither can be made out at the fight's distance on a phone).
#   the near body only (drawn beyond 2.2 m): a tone seam of 25 mm down the chin and a flat, crumpled underside of the
#     nose, both in Meshy's own remesh (photographed on the source); a faceted fold on the right cuff; and of the 82
#     back-facing triangles measured before the fins came out (the largest 211 mm2 on his right side), those that are
#     left were not photographed one by one.
#   THE WALK'S HANDS: the rig's own walk carries the leading hand palm forward with straight, spread fingers (the bind
#     pose's hands are palm-forward, which is what gave every finger its bones). EVERY TAKE made for him turns the
#     forearm in and curls the fingers before it is cast, measured by tools/probes/jointscan.mjs (v26.3).
#   not checked yet: feet against the ground, joints against human ranges, the walk's head turn and gait (the takes).
# TRIED AND DROPPED: the mirror fill for the sides; a weave threshold of 6.5; one move for a whole patch (worse); XSCALE
#   on the first cut only (3,971 corner triangles and 10,409 torn slivers still); laying a mended triangle back whole
#   in its chart (229 of 12,602 could be; the code stays under XSCALE and now finds nothing); the cheek painted as skin
#   (still dark: it was the fin); tools/rigstrain.mjs (written for Grandmaster Pho's rig: no Spine2 joint here).
# 5g. EVERY TOOL CHANGE OF THIS BODY IS OPT-IN: prepmonk FINS; repaint.py XSCALE (and the torn-sliver test, under
#   MENDOUT); edgeclean.py's class `sd`, fills `clone`, region keys `slab`, `turn`, `grow`, `dissolve`, `main`;
#   shootclose.mjs's model keys `clip`, `at`, `aniso`. PROVED on the first body's NEAR file: through the tools as they
#   were before this body (commit 1f39fc3^) and as they are now, the switches unset, the same bytes, and the bytes of the
#   first body's file as it was committed (54038f5). Its FULL file through both: (the result is written in below).
#
# ---------------------------------------------------------------------------------------------------------------------
# 7. THE SOURCES, ON THE SOURCES BRANCH (21 Nov 2026)
# ---------------------------------------------------------------------------------------------------------------------
# masters/v28.0/src's fourth body and the Naga stick (22 files), and with them chapter 4's whole folder
# (masters/v27.0/src, 381 files), went up in chunks 26 to 78 of claude/model-sources:
#   SRCBACKUP_GIT=<scratch> SRCBACKUP_LABEL=v28.0 SRCBACKUP_CHUNK_MB=120 python3 -I tools/srcbackup.py pushnew
# GitHub's tip read back as the last commit pushed (9d232f735583). The three refused bodies stay on this machine only
# (tools/srcbackup.py SKIP). A source made after this goes up with the same command.
