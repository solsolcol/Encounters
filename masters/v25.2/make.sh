#!/usr/bin/env bash
# v25.2 · episode 4 chapter 2's props made real (docs/V25.2-E4C2-PHONE-MOTION-MODELS.md §1 A4 and §3 the audit).
# Chad, 10 Nov 2026: "why are there such badly drawn models like the wallet which is just a block of colour, and the jacket
# and bag dont even look like one. You already have meshy connected, why are you not using it properly. Moving forward, you
# should make full use of generating the 3d models that you need." Every prop below was built in code from boxes and
# cylinders at v25.0 (or in chapter 1's shop, copied); each is now made his way (30 Oct 2026, masters/v24.19/make.sh): a
# reference picture on white, LOOKED AT, then Meshy's image-to-3D at its best settings and its remesh. None is a sacred
# image, so no photographs of a real piece came first. The code-built one stays in the chapter only as the stand-in drawn
# until (or unless) the file lands.
#
# 1. THE PICTURES: Higgsfield gpt_image_2_6, quality high, 2k, opaque, 1:1, two of each (2.75 credits each); the prompts and
#    why the second round changed four of them in models/refs/PROMPTS.txt; the 1024 copies beside the 2k originals (which
#    are not committed). The first round's eighteen went at once and ten were refused by the service's rate limit (429):
#    four at a time since. Job IDs (Higgsfield):
#      wallet-a 4c48bf09-738d-4532-94ee-05d37dbb00cb   wallet-b 0675fe63-0606-494c-8308-d420d03b0b2c
#      jacket-a c0b82602-26b9-44f4-b379-9242c13dc999   jacket-b e6f9be0b-fcbf-4d9a-858c-9aaa9930c1d1
#      bag-a    ec6f799e-90ee-4a36-a572-0202601da790   till-a   30b4cd3f-1fa6-4611-be0f-e7fb21cf0145
#      till-b   a7a57979-9177-4a03-8f15-d0d83c0d97ea   drinks-a 3d25871e-65f2-4217-8f0e-6233693095ed
#      drinks-b 74037c73-b25f-4615-8f07-4b0ac5f4a8d2   yaam-a   2183081d-6af3-47de-ad5c-ae96c723fad5
#      yaam-b   7f5fbf58-6152-415b-8924-a07855294497   calc-a   0ea40a69-78ae-4776-b9bd-5bbb75c92c15
#      calc-b   96dc1ff7-dcce-46d2-823f-ec5ee07c5f7c   phone-a  1c9db9ba-ec59-4e7b-90df-764968be6a74
#      phone-b  d578f0a0-ebea-4a19-ab73-20a1bcd2b722   cloth-a  bf7310aa-8be6-4a49-9ef7-38d86b277880
#      cloth-b  4a9fc37a-fb85-4011-b6d8-f018a43bf5be   switch-a 965dd6fc-59a8-4c3a-b1ac-5190d5b4e315
#      switch-b 0ff2d842-29b7-4fce-801a-30f32ebf4697   shelf-a  41a9cb70-130c-4fbe-b0e1-fac27d8c09ac
#      shelf-b  5d9723a3-5408-4a4a-beb4-9bb0289aee8a   wreath-a 8b9fd5a2-fb02-4e37-b8c4-06ef39b4b5b5
#      wreath-b 135f6e27-c38c-45bc-b7d7-12a541261664
#    The picks, each looked at:
#      wallet-a  a worn brown bifold, its folded edge and stitching clear (b the same, its fold less legible)
#      jacket-b  the navy windbreaker folded compact, collar and zip on top (a, folded once with a loose sleeve, would stand
#                out flat in the air off the 34 cm stool seat)
#      bag-a     a grey canvas messenger bag, the buckle on its flap, the strap looped beside it
#      till-b    the drawer alone, out of its housing: four notes under spring clips, five coin cups, the lock in front (a is
#                the whole unit, and the drawer slides out of the cupboard alone)
#      drinks-a  five small water bottles (the fridge's floor, beside the wallet); drinks-b  the mixed row of five bottles and
#                four cans (its wire shelf)
#      yaam-a    the striped red, off-white and indigo bag lying flat, its strap looped above (b the same, its fringe busier)
#      calc-b    the grey calculator, its depth shown (a seen from higher)
#      phone-a   a black phone face up (b the same); cloth-a  the ivory cloth folded, its layered edge clear (b less)
#      switch-a  the two-gang plate, its rockers' orange neon windows (b the same); shelf-b  the board on two black brackets,
#                the brackets' wall plates seen (a from higher); wreath-a  the dried round, its edge the cleaner (b raggeder)
# 2. MESHY (masters/v25.2/meshy.py models/jobs-r1.json, -r2.json, -r3.json — every job of a round at once; the key outside the
#    repo): image-to-3d (ai_model latest, triangles, 300,000, PBR, its texture prompt), then its remesh, both files into
#    src/ (gitignored; Meshy keeps a job's files three days). Job IDs (image-to-3d, remesh):
#      till    01a1c562-6b43-77d0-b96f-b8b307770b63   01a1c565-dd60-7310-aaf5-f12b46302c2d   (remesh 8000)
#      bag     01a1c561-159a-737e-9479-60e7a060d244   01a1c564-eff7-73fa-ab25-3672fc6cccde   (remesh 8000)
#      jacket  01a1c562-5919-75f3-90a9-c1d817a92709   01a1c565-7659-70e6-ad73-d76f8e6fb410   (remesh 6000)
#      water   01a1c562-7ded-716e-a3da-acd37848f278   01a1c566-3f97-76ee-ad02-5d4975f4bbe6   (remesh 6000)
#      drinks  01a1c561-3dc4-76dd-ac4a-591e5ac31a89   01a1c564-4382-76c6-9b8c-70bf86431a9e   (remesh 8000)
#      wallet  01a1c560-fe9b-724c-bd7a-61ea640dea99   01a1c564-3b53-759b-9585-c9e1e7fa42cf   (remesh 3000)
#      switch  01a1c562-b5ae-7029-af0f-d2d7c110bd8b   01a1c565-e76a-774a-a6d3-bcb3bd6cd552   (remesh 2000)
#      shelf   01a1c565-8215-70a7-839b-8626de3a3d3e   01a1c568-453d-768a-9c82-3aed5f0306c7   (remesh 3000)
#      cloth   01a1c565-6d81-76b4-a351-a136aa03658f   01a1c567-ed71-7158-906d-dd5064e331c6   (remesh 3000)
#      yaam    01a1c561-2987-74af-99aa-6a319f6c5778   01a1c564-9948-72af-89fd-285909230ac4   (remesh 6000)
#      phone   01a1c562-a47c-7424-9c69-a48d4c008e65   01a1c565-82e0-7260-a6d2-991a22e7fbe5   (remesh 2000)
#      calc    01a1c562-912a-722f-b0fd-00ed697eb9e1   01a1c565-7e33-778f-a9fe-079a33b341c7   (remesh 4000)
#      wreath  01a1c565-926a-7420-b3e2-ec3670171ff9   01a1c56b-78cf-7406-844f-b2a22601074f   (remesh 12000)
# 2b. THE REMESH AGAIN, AT A HIGHER COUNT (Chad, 10 Nov 2026, while they were being placed: "Make sure those models just
#    generated are not too compressed and dont lose too much quality"). Each first remesh was photographed beside Meshy's
#    own original (300,000 triangles) at the same angle and size: the wallet, the cloth, the drinks and the yaam held, but
#    the wreath's flowers were holed and shard-edged at 11,000, the till's front cracked and its lock smeared at 7,300,
#    the jacket's folds crumpled at 6,100, the bag's stitching softened, the bottles' caps boxy, the switch's plate wavy
#    and creased, the calculator's keys blurred. Every one remeshed again from its same image-to-3D task
#    (masters/v25.2/remesh.py) and photographed again: each now matches its original at that size. The counts are what
#    each needed (the wreath 100,000: a dense round of flowers seen from a metre). Job IDs (remesh):
#      till    01a1c580-0436-760f-b2b2-4e65f302c414   (remesh 40000)
#      bag     01a1c580-075f-7217-ad9e-0c5b516815cc   (remesh 30000)
#      jacket  01a1c580-05bf-738e-ae61-6f5d497914e6   (remesh 30000)
#      water   01a1c580-0a61-71be-90f3-c95c435b590f   (remesh 20000)
#      drinks  01a1c580-08e7-7052-aabc-96912881819b   (remesh 30000)
#      wallet  01a1c580-1489-73d9-8879-2b6e5e0ac250   (remesh 10000)
#      switch  01a1c580-122a-723a-8233-99f456767638   (remesh 8000)
#      shelf   01a1c580-0f07-7385-80bb-cc7dd5322ad6   (remesh 10000)
#      cloth   01a1c580-1097-7548-a1a8-3c6c844eefdc   (remesh 10000)
#      yaam    01a1c580-0bd7-7458-8024-ce1f0091bb7e   (remesh 20000)
#      phone   01a1c580-15fa-7145-bdff-86a27be7b1da   (remesh 6000)
#      calc    01a1c580-0d73-776e-a485-b9b404c3e5f2   (remesh 12000)
#      wreath  01a1c580-02b8-751c-a53f-eac145dff981   (remesh 100000)
#    The sheets stay at 1024 (each its own atlas; at the nearest place a player stands they draw about one texel a pixel),
#    q 88/92: what was lost was the shape, and the photographs say the sheets hold.
# 2c. HIS NOTEBOOK (the audit's late find: chapter 1's shop, copied, kept his notebook as a dark blue box 46 x 31 cm on the
#    counter, "a block of colour" as the wallet was). Pictures (Higgsfield gpt_image_2_6, as above): notebook-a
#    168e5715-c420-4126-827c-75bd191e6203 and -b afe4d287-0457-4165-b481-8c0ab9d69006 wrote invented diary lines on its
#    left page ("Met with Tom", a park's spring buds: in his shop in Singapore, both untrue), so asked again with its
#    pages blank: notebook-c 21491b2c-c64a-448d-94cf-362259852e2c, notebook-d f47ac3a3-9f37-43f5-815c-4cada0d9695f. The
#    pick: d, the spread flatter (the coda's drawn page lies on it). Meshy (models/jobs-r4.json): image-to-3d
#    01a1c5a4-1f3f-7155-b6b0-2307ff81f3dc, remesh 01a1c5a7-0dda-7706-9b24-aa584673f02d (20,000; meshy.py names it
#    remeshed-notebook.glb, copied to remeshed-notebook-20000.glb); photographed beside the original (297,272): the same.
# 3. PREPARED (tools/prepmeshy.mjs: sized in metres on the dimension the chapter's numbers depend on, every triangle kept, the
#    sheets at 1024), each photographed on its own (tools/shootmodel.mjs) before it was wired in. The phone is turned over
#    first (FLIP=1, v25.2): Meshy read a phone lying face up as its back and put a camera on the face that showed; its other
#    face is the glass, and the drawn screen is laid on it. The switch's two neon windows were found on its own colour sheet
#    (the orange texels mapped back through its UVs: 10.7 mm either side of its middle, 54.9 mm up, 1.2 mm out) and the
#    chapter lights a small plane over each.
if [ "$ONLY" = models ]; then
  cd ../..
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-till-40000.glb assets/e4till.glb   0.42  w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-bag-30000.glb assets/e4bag.glb    0.25  h 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-jacket-30000.glb assets/e4jacket.glb 0.33  w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-water-20000.glb assets/e4water.glb  0.16  h 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-drinks-30000.glb assets/e4drinks.glb 0.47  w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-wallet-10000.glb assets/e4wallet.glb 0.11  w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-switch-8000.glb assets/e4switch.glb 0.086 w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-shelf-10000.glb assets/e4shelf.glb  0.3   w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-cloth-10000.glb assets/e4cloth.glb  0.26  w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-yaam-20000.glb assets/e4yaam.glb   0.6   l 1 0 1024
  FLIP=1 ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-phone-6000.glb assets/e4phone.glb 0.158 l 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-calc-12000.glb assets/e4calc.glb   0.13  l 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-wreath-100000.glb assets/e4wreath.glb 0.74  w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.2/src/remeshed-notebook-20000.glb assets/e4notebook.glb 0.46 w 1 0 1024
fi
