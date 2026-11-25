# v28.0 · the things of episode 4 chapter 5: the record

Every thing of plan 9.4 that was made: its reference picture (refs.tsv: GPT Image 2.6 through Higgsfield, each looked at
before it went on), Meshy's image-to-3D at its highest (jobs-p1.json to jobs-p5.json, 40 credits each, should_remesh,
the original in masters/v28.0/src/original-<name>.glb), Meshy's own remesh to TABLE.txt's count (5 credits each; nothing
thinned here, v25.5), then tools/prepmeshy.mjs (real metres, sized on TABLE.txt's dimension, the base centre on the
origin, every triangle kept, the sheets at TABLE.txt's size) to `assets/<key>.glb`, and a photograph of each on its own
(tools/shootmodel.mjs through tools/bslot.sh, 1100 px, front, side, back and three-quarter). All ids are also in
masters/v28.0/src/jobs.json (the ledger; never hand-edited).

Made by the first helper (Fable, stopped by its limit): the 36 reference pictures, the 36 image-to-3D jobs and their
originals. Made on Opus (21 Nov 2026, R17/R18): the 36 remeshes, the preps, the photographs and this record. Nothing was
generated a second time.

## What it cost
| step | count | credits |
|---|---|---|
| image-to-3D (first helper; the Naga staff's earlier, in make.sh) | 36 | 1440 |
| remesh (Opus) | 36 | 180 |
| Meshy balance after the remeshes | | 1370 (the cast's builder was spending beside it) |

## Every thing
Size is the prepared file's width (x) x height x length (z) in metres; `*` = the dimension it was sized on. Triangles:
the remesh's, all kept. Pictures: the scratchpad's e4c5/props/<name>-{front,side,back,q}.png at 1100 px, each opened
full size; the pictures of the faults are kept in props/shots/.

| thing | key | image-to-3D job | remesh job | size m | tris | sheet | what is wrong |
|---|---|---|---|---|---|---|---|
| nagastaff | w5nagastaff | 01a1fad1-9e16-72a2-8ab5-46675a67428c | 01a1fad8-c191-772b-ad99-4a1febd192cf (30000) | 0.333 x 1.400* x 0.115 | 31130 | 2048 | made before (make.sh §2-3); not re-shot here |
| bagopen | w5bagopen | 01a1fc8b-a603-7275-a9bc-5b288672cca1 | 01a1fc9a-1ba5-742b-b1f4-5779a1c69c8e (20000) | 0.370 x 0.400* x 0.283 | 20724 | 2048 | nothing seen; its mouth stands open only a little (a rim with the dark inside seen from above) |
| bagtied | w5bagtied | 01a1fc89-c7f1-746c-817f-082c609a9841 | 01a1fc9a-1d12-7218-8c41-3efa599efac3 (20000) | 0.253 x 0.350* x 0.170 | 20769 | 2048 | nothing seen |
| threadreel | w5threadreel | 01a1fc8b-b3d2-70bf-b00b-0f94f2758f47 | 01a1fc9a-1eb2-7648-9f6c-3a1b99788386 (12000) | 0.100 x 0.090* x 0.080 | 12231 | 1024 | **FAULT**: the loose end of the thread hangs straight down below the ball, so the thing stands on the thread's tip and the ball floats about 1.5 cm off the ground (shots/threadreel-side.jpg); the strands are faceted seen very close. Mend here at no credits: set it down by the ball, or turn it so the end lies along the ground |
| staffwrap | w5staffwrap | 01a1fc8b-c0a0-7150-b834-c3120da16ad5 | 01a1fc9a-2016-76e1-a8d3-54fa9d69181b (16000) | 1.500* x 0.178 x 0.184 | 16516 | 1024 | nothing seen (18 cm at its lumpy end, thinner along it) |
| staffcloth | w5staffcloth | 01a1fc8e-c8c1-7269-b2ba-c2438a0031f6 | 01a1fc9a-21c7-7202-bb6b-0733801546ea (12000) | 0.600* x 0.115 x 0.427 | 12287 | 1024 | nothing seen |
| clothtable | w5clothtable | 01a1fc8b-cca2-7791-8ba6-78fd709f814c | 01a1fc9a-2343-731d-ad97-8707bba49051 (16000) | 1.200* x 0.340 x 0.976 | 16236 | 1024 | **SIZE**: 0.98 m deep where 0.70 was asked (shots/clothtable-q.jpg); a scale of 0.72 on z where it is placed mends it |
| padcase | w5padcase | 01a1fc89-dc17-76d9-b5ec-da3652162588 | 01a1fc9a-249d-7111-9a36-90c92f97c43d (20000) | 0.340* x 0.259 x 0.266 | 20100 | 2048 | **FAULT**: the pits of the base's foam tray draw glossy black, like little mirrors, where foam is matt grey (shots/padcase-q.jpg); the chapter lays pieces in them, which hides most. Mend here: those pits' material made rough at placement |
| shoecab | w5shoecab | 01a1fc89-f63c-7281-a400-846b00e3b4a0 | 01a1fc9a-25f5-70ba-b49b-477f28853e09 (20000) | 0.900* x 1.061 x 0.530 | 19468 | 2048 | **FAULT**: 0.53 m deep where 0.35 was asked; its top slopes down from back to front by a few cm; the right side's back edge and the louvres' edges are ragged (bitten) close up; the wood is a bright red, not the dark reddish-brown asked (shots/shoecab-q.jpg, shoecab-side.jpg). It is seen close (where the shoes are) |
| oldchair | w5oldchair | 01a1fc8a-0d6c-7574-bd32-ec61b717f48a | 01a1fc9a-2758-7697-8462-aa17393e9415 (30000) | 0.950* x 0.822 x 0.838 | 30845 | 2048 | nothing seen |
| grating | w5grating | 01a1fc8a-22ff-7105-9fa2-0f7d0cd2f89f | 01a1fc9a-28c9-72d6-b6cd-8246dbf45e30 (16000) | 1.000* x 0.079 x 0.480 | 16217 | 2048 | **FAULT**: the bars are melted and wavy with holes through them, not straight flat bars; 0.48 m wide where 0.30 was asked (shots/grating-q.jpg). Seen close at the drain |
| gate | w5gate | 01a1fc8a-39e9-73b2-ab66-ced6f82d92d5 | 01a1fc9a-2a1d-7464-9417-0a152829ae9c (30000) | 1.248 x 1.400* x 0.115 | 29001 | 1024 | nothing seen |
| gatepost | w5gatepost | 01a1fc8b-d569-702c-95b8-b136f04c3b06 | 01a1fc9a-2b79-72cc-89eb-4a9cfde77eab (12000) | 0.417 x 1.700* x 0.417 | 10939 | 1024 | nothing seen (its cap a bright terracotta) |
| planter | w5planter | 01a1fc8a-497a-74b8-beb8-9b277b68b44d | 01a1fc9a-2cc1-716b-9fcc-9dbad080e813 (40000) | 2.000* x 0.823 x 0.745 | 33798 | 2048 | **FAULT**: the box's underside is broken: its white sides end in a ragged edge with dark holes under it (shots/planter-q.jpg). Set some 10 to 15 cm into the paving it is hidden; the plants are good |
| planter2 | w5planter2 | 01a1fc8e-d1d5-7726-8260-108a043ef304 | 01a1fc9a-2e1b-7300-a74f-ff3ff061fdd9 (40000) | 2.000* x 0.960 x 0.825 | 35354 | 1024 | **FAULT**: worse than the first: big ragged teeth hang from the box's sides with dark holes between them (shots/planter2-q.jpg); sunk about 25 cm it is hidden |
| frontdoor | w5frontdoor | 01a1fc8f-1cf1-770b-a7da-6899f9b03622 | 01a1fc9a-2f78-746a-947c-596044b1ac17 (8000) | 0.790 x 2.100* x 0.097 | 7287 | 1024 | **FAULT**: its hinge-side edge is ragged and wavy over the lower half (shots/frontdoor-front.jpg); in a frame the frame covers it. Bright red |
| liftpanel | w5liftpanel | 01a1fc8f-7547-71d6-92b4-6cdd0f381399 | 01a1fc9a-30fa-711d-9475-531817a35487 (12000) | 0.274 x 1.100* x 0.045 | 11373 | 1024 | the buttons are blank (no numbers) and the steel is near black, not brushed; nothing broken |
| sofa | w5sofa | 01a1fc8b-dea5-7450-9a41-841626d1c37b | 01a1fc9a-3293-7719-a171-2426d7099b77 (30000) | 2.100* x 0.782 x 0.881 | 30885 | 1024 | nothing seen |
| lowtable | w5lowtable | 01a1fc8b-e85c-70cb-951a-33e9ad65511c | 01a1fc9a-33fd-71fc-b023-6d99525d52a8 (12000) | 1.200* x 0.358 x 0.760 | 12100 | 1024 | nothing seen |
| tvconsole | w5tvconsole | 01a1fc8e-e1a4-73f3-82d4-82b736c77302 | 01a1fc9a-3538-767d-be92-a06417c00b3b (16000) | 1.800* x 1.185 x 0.711 | 15197 | 1024 | the wood is a saturated pure red, not rosewood; the television's edges are a little ragged (shots/tvconsole-q.jpg) |
| floorlamp | w5floorlamp | 01a1fc8e-eb3e-7421-8eeb-75c3217d5ed3 | 01a1fc9a-369a-742d-a14c-982500382129 (12000) | 0.547 x 1.550* x 0.547 | 11737 | 1024 | nothing seen (its pole a little wavy) |
|   | (R42, 23 Nov: `w5floorlamp` RETIRED: both standing lamps out of the living room at Chad's word, its file out of assets/ and the repository; this row, its job ids and the sources branch keep it) |||||||
| tablelamp | w5tablelamp | 01a1fc8e-f321-728c-8d68-01c1e6e54568 | 01a1fc9a-37dc-750b-9357-07e1878fddff (12000) | 0.381 x 0.550* x 0.381 | 12330 | 1024 | nothing seen |
| pendant | w5pendant | 01a1fc8e-fd2b-75c1-aeab-74f705aad981 | 01a1fc9a-3926-70d5-8492-f7aa3f429d66 (8000) | 0.450* x 0.450 x 0.450 | 8315 | 512 | faint pale seam lines across the white dome (its sheet's charts); seen overhead only |
| curtain | w5curtain | 01a1fc8f-0760-75f5-89b9-37cfcf3bf52d | 01a1fc9a-3a64-716d-be90-8b5506bf7a6e (16000) | 1.414 x 2.400* x 0.195 | 14413 | 1024 | **FAULT**: two long slits open in the cloth, from its middle to near the floor, through which what is behind shows (shots/curtain-front.jpg); against a wall and a window they would show both |
| dintable | w5dintable | 01a1fc8f-7f2c-7147-af36-f8e71cc1fa79 | 01a1fc9a-3bc1-740a-bf87-47d5ee15fa0a (16000) | 1.300* x 0.873 x 1.301 | 16221 | 1024 | **SIZE**: 0.87 m tall at 1.3 m across, where a dining table stands about 0.75 (a scale of 0.86 on y mends it); bright red wood |
| dinchair | w5dinchair | 01a1fc8f-1445-7069-9053-bdb02674cfba | 01a1fc9a-3cfe-7220-a43d-27123f7ce6f7 (12000) | 0.564 x 1.000* x 0.697 | 11769 | 1024 | nothing seen |
| sideboard | w5sideboard | 01a1fc8f-8a5b-70fe-92f7-370f4514c0d2 | 01a1fc9a-3e5f-76b7-aeb1-ad5589e4b14b (20000) | 1.600* x 1.016 x 0.565 | 19821 | 1024 | nothing broken; the vase and tea set are part of it (as asked); 1.02 m tall with them; saturated red wood |
| wallclock | w5wallclock | 01a1fc8f-94a8-70a2-bc72-7f404131a74d | 01a1fc9a-3fbd-7591-bd56-be75e68f4bef (8000) | 0.246 x 0.550* x 0.124 | 7372 | 1024 | nothing seen; its hands are part of the mesh (they cannot turn) |
| frame | w5frame | 01a1fc8f-9fdb-7622-8644-77cc8e05076b | 01a1fc9a-4105-77da-9c86-295fd9c834e9 (6000) | 0.680* x 0.461 x 0.048 | 4773 | 1024 | the white card carries faint seam lines; the chapter lays its picture over it |
| walllamp | w5walllamp | 01a1fc8f-a91e-74f8-abea-abad76c9052f | 01a1fc9a-4252-7013-aa9c-ae9d6b12f5d8 (8000) | 0.168 x 0.350* x 0.147 | 7957 | 1024 | nothing seen |
| rail | w5rail | 01a1fc8f-b301-7536-99db-1e36dc235a0e | 01a1fc9a-439e-7701-9864-23a5610b0b55 (16000) | 2.000* x 0.994 x 0.152 | 13997 | 1024 | the end posts' and the plinth's lower edges a little ragged; nothing broken |
| walklight | w5walklight | 01a1fc8f-bc76-7340-87e0-6ee8f8b44183 | 01a1fc9a-44e1-7293-b6b5-43cc84edb9fc (4000) | 0.280* x 0.168 x 0.279 | 4132 | 512 | **FAULT**: it came back dome-down (to be turned over for a ceiling) and crumpled: the ribbed dome is faceted and creased, the rim carries chipped lumps, and the glass reads as plain white, not frosted (shots/walklight-q.jpg). Overhead and small in the game |
| slippers | w5slippers | 01a1fc8f-cb81-71be-81af-0df7f3e51c92 | 01a1fc9a-462c-759a-a4cb-c18e1d00f293 (8000) | 0.238 x 0.087 x 0.270* | 8285 | 512 | nothing broken; faceted close up |
| duffel | w5duffel | 01a1fc8f-db83-72c9-8c04-eacd23282d1d | 01a1fc9a-4763-70b8-812c-d17272f827e4 (12000) | 0.600* x 0.361 x 0.271 | 12058 | 1024 | nothing seen |
| cushion | w5cushion | 01a1fc8f-e962-7679-bb2b-881f3d7f8754 | 01a1fc9a-48c6-73fa-bb7e-651d8ea14f8a (6000) | 0.500* x 0.125 x 0.500 | 6036 | 512 | a tiny white speck on one side; brighter red than maroon |
| altarshelf | w5altarshelf | 01a1fc8f-f65f-7658-a87f-514606c11985 | 01a1fc9a-4a16-7537-a8dd-c0f81c618553 (16000) | 0.700* x 0.225 x 0.398 | 16049 | 1024 | nothing broken; EMPTY as asked; its two brackets hang below the board, so its origin is at the brackets' foot (place it on the wall by the board) |
| ceilfan | w5ceilfan | 01a1fc8f-ff04-7239-ba54-a8f2507eee11 | 01a1fc9a-4b6b-74cd-afb1-734b9ca07293 (12000) | 1.300* x 0.520 x 1.299 | 12238 | 1024 | nothing seen |

**A note on all the home's wood**: Meshy gave every "dark rosewood" thing (shoe cabinet, door, low table's legs,
television console, dining table and chairs, sideboard, altar shelf) a bright saturated red, much redder than the
pictures asked. It is one runtime colour (a darkened, browner tint on the wood's material where placed, his own files
untouched as v12.4 asks of his), at no credits, and is put to Chad with the rest.

## The faults, to be put to Chad (v28.0: no model made again without his yes; another costs 40 + 5 credits)
1. **curtain**: two slits through the cloth. Mend here: none clean (a second copy laid behind it would hide them).
2. **grating**: melted bars, and too wide. Mend here: none for the bars.
3. **planter2** and **planter**: ragged bottoms. Mend here: sink them into the paving (most of it hides).
4. **shoecab**: too deep, sloping top, ragged edges, too red. Mend here: scale its depth, tint; the ragged edges stay.
5. **walklight**: crumpled. Mend here: turn it over; it is small and overhead.
6. **threadreel**: floats on its thread's end. Mend here: set down by the ball.
7. **padcase**: glossy pits. Mend here: roughen at placement.
8. **frontdoor**: ragged hinge edge. Mend here: its frame covers it.
9. **clothtable**, **dintable**: sizes. Mend here: scale.
10. The red of the wood, above.

## Not made, and why
- **The collector's three new pieces**: not made in the first pass (no photographs gathered then); MADE on 21 Nov 2026,
  each from photographs of real pieces first: the section below.
- **The fan of the rite: NOT MADE, by decision.** Chad was asked for his photograph of the fan (plan 9.4, R4) and none
  came; he had been told it would be made from real photographs unless he sent his own, and the research found the
  peacock-feather fan in his own Wai Kru photographs (plan 2, item 5). So the default is episode 4 chapter 3's own
  peacock fan, `w3fan`, as a DECLARED REUSE in case three's rite. No new fan is generated. If he sends a photograph, it
  is made from that.
- **The holy-water bowl**: chapter 4's, his own model, a declared reuse.

## Sacred things: how their pictures were made
No statue, image or amulet was made here. The rite's things (the bags, the thread, the cloth, the wrapped staff, the
covered table) are plain cloth and thread drawn from words; the black bag is the casebook's own and found in no source
(docs/research/V28.0-RITE.md 3), so it is a plain cotton bag. The altar shelf was drawn and made EMPTY (no image on it).
The Naga staff was made from his photograph (make.sh §2-3).

## The collector's three pieces (21 Nov 2026, plan 4.7 and 9.4)

Each began as photographs of REAL pieces of its kind (docs/research/V28.0-PIECES.md: why these three, what makes each
kind recognisable, every source and each photograph's checksum; nothing of a maker, a temple, a name or a price is in
any picture or model). The reference picture was made WITH those photographs as its references (GPT Image 2.6 through
Higgsfield, 2k, high: refs.tsv, PROMPTS.py `PIECES`), looked at full size against them, and made once (no picture was
made again). Then Meshy at the recipe's highest (jobs-p6.json; 40 credits each), its remesh to 20,000 (5 each), prepmeshy
(real metres on the base centre, every triangle kept, 2048 sheets: seen close on his cloth), photographed alone at 1100 px
through tools/bslot.sh, every picture opened full size. Which presence sits on which piece is the game's own picture,
never said as belief (V28.0-VERDICTS item 12).

| piece | key | kind (presence) | image-to-3D job | remesh job | size m (w x h x l) | tris | what is wrong |
|---|---|---|---|---|---|---|---|
| wuathanu | w5wuathanu | Wua Thanu, the cast humped bull (angry) | 01a1fcd1-c686-7314-8e26-8a7404a11f3b | 01a1fcd6-f8cb-7321-9748-bf7438192d30 | 0.021 x 0.033 x 0.054* | 20750 | nothing broken; the patina is blotchier and a little redder than the reference's even brown (shots/wuathanu-q.jpg, -side.jpg); its head points along z (turn it where placed) |
| rakyom | w5rakyom | Rak Yom, two small carved figures in a bottle of oil (hungry) | 01a1fcd1-d43a-7360-b0dc-0fe995d262d4 | 01a1fcf3-1b8a-74e0-a808-3c1e3a231ee7 | 0.027 x 0.060* x 0.028 | 20370 | **FAULT**: the glass came back OPAQUE grey, and the two figures are only a raised relief on its FRONT face: from the back and the sides nothing is inside, and the red figure's head bulges out through the bottle's left side (shots/rakyom-front.jpg, -side.jpg, -back.jpg). From the front, at the table's distance, it reads as the kind. The scrawled mark on the red figure follows the reference photograph's (not read; a few millimetres) |
| hunphayon | w5hunphayon | Hun Phayon, the bound black effigy (looking for energy) | 01a1fcd1-e34d-7109-b7f7-234234c3c8c4 | 01a1fcf3-2769-7375-8e16-1dde8563bd90 | 0.063 x 0.100* x 0.024 | 20936 | nothing broken; the white marks are letter-like (the picture made them so where abstract marks were asked: they follow the photograph's yant-like strokes, not read, no maker's or temple's mark); its back has a few invented marks, one like a question mark (shots/hunphayon-back.jpg); it leans a little forward in profile |

What it cost: Meshy 3 x 40 + 3 x 5 = 135 (balance 1,370 before, 1,235 after, read from the service); Higgsfield 3
pictures, 6 credits (367.5 before, 361.5 after).

**Put to Chad (v28.0: no model is made again without his yes):** the Rak Yom bottle's opaque glass and front-only
figures. Mend here at no credits: lay it on the cloth with its front to the player and the collector (the side and back
are not seen from either seat), and darken the grey glass a little at runtime so it reads as old glass; a see-through
bottle would need another job (45 credits) and the generator may well come back opaque again, or a bottle built here
with the figures as their own model inside (free, a few hours, untried). Default: the mend.

## The estate's ground below the walkway (24 Nov 2026, R105: Chad, "The outdoor environment below the corridor can be improved further")

Three things for the grounds of a 1980s condominium, each a checked picture on white (GPT Image 2.6 through Higgsfield,
1k, max, two takes each, looked at full size; the pick named), then made once. Where Meshy refused a picture outright
the same picture went to Higgsfield's image-to-3D (the house's rule: try the engines on one picture, v25.5). Placed by
masters/v28.0/parts/b_world.js buildEstate; keys by masters/v28.0/keys.py.

| thing | key | pictures (Higgsfield jobs; the pick) | model | size m (w x h x l) | tris | sheet | what is wrong |
|---|---|---|---|---|---|---|---|
| playground | w5playground | 09356811-a084-4db5-abfd-030d82ae4155 (a), 6bbbcea4-a8a2-4bff-af68-b296f4395111 (b, the pick: a compact frame, a tube slide and an open slide, a net, stairs, a roofed tower) | Meshy 01a20e0c-719a-77e4-ae49-d1a90250777e (40), remesh 01a20e12-51ab-738d-9c05-2b1078e1d8fd (5) | 4.01 x 3.30* x 4.35 | 50,000 | 1024 | nothing broken; its panels' paint a little painterly close up (it is seen from 8 m and more); the tube slide's mouth has a doubled lip |
| gardenlamp | w5gardenlamp | 0accecfd-68cc-4602-bb04-4a460d14f6c1 (a, the pick: a footing plate), 520e7f00-f608-4ecd-b8b2-6e0b165671f3 (b) | Meshy 01a20e16-4715-76e1-979c-5e888ad25f9e (40), remesh 01a20e1e-9d14-71aa-9d00-9178b361ba76 (5) | 0.43 x 3.20* x 0.43 | 2,500 | 512 | its globe lit by the world (what is pale in its picture glows: b_world.js `globe5`) |
| shrub | w5shrub | d160c1f0-140a-46d5-963a-0b1d1f0cbb7a (a, the pick: rounder, denser), 195f1bc4-6052-4def-a788-00d3d8fc0ca4 (b) | Meshy REFUSED six times at 9 to 10 % ('invalid_input'; no credits taken): a then b at 100,000 and 60,000, a at standard geometry with no symmetry, a as a JPEG, a without the picture's enhancement (jobs-p8 to p8f.json; the last 01a20e24-0576-73ca-8492-d221892cacfe). Then Higgsfield image-to-3D on picture a: job 6c2e975a-20de-4ca4-a516-2458b76c43c4, FAILED. Picture c, the same bush clipped to a dome (0dc7f374-..., 37ce41b7-...: shrub-c-1024.jpg): Meshy 01a20e2e-b4d1-708d-b94b-b2b64c486a6f REFUSED ('image_too_complex', jobs-p8g.json). Made by Hunyuan3D v3 on Higgsfield (cf0ca79c-c200-4ad6-a28c-3ed19a83b850, 40,000 triangles, one 4096 sheet, 15 credits: original-shrub.glb), brought to 3,000 by Meshy's remesh sent the file itself (meshy28.py MODEL_FILE: 5 credits) | Hunyuan3D cf0ca79c, remesh (Meshy, from the file) | 1.15 x 1.00* x 1.20 | 3,000 | 512 | a clipped dome of ixora with its flowers in a ring at its foot and a disc of soil under it; its silhouette faceted at 1100 px (seen from 8 m and more, a few dozen pixels); its blooms blocky close up |

What it cost: Meshy 2 x 40 + 3 x 5 = 95 (the shrub's remesh the third) (1,127 before the lamp, 1,087 after it; the refused jobs took nothing); Higgsfield
4 pictures and the shrub's model.

## R110 ability icons

Chad, 24 Nov 2026: "improve how the icons of the ability buttons look like. They look way too basic. Maybe generate
the icons so they look like diablo style ability icons." Six painted icons for the tag-team fight's round buttons
(laid as an act's `art`, like R107's p5togart).

- Model: Higgsfield `gpt_image_2_6` (GPT Image 2.6), 1:1, quality `max`, 1k (4.5 credits a picture).
- Shared style words in every prompt: "A single dark-fantasy action-RPG ability icon in the style of Diablo skill
  icons: ... Richly hand-painted, high contrast, gritty painterly texture, dramatic rim light, out of a near-black
  background. One bold shape with a strong silhouette, centred, nothing important near the corners so a circle crop
  keeps all of it. No frame, no border, no text, no letters, no symbols, no faces."
- Subjects (the part of each prompt that differs):
  - FIRE: "a roaring orange-gold fireball flying diagonally toward the upper right, a bright white-gold core, licking
    flames, sparks and dark smoke trailing behind it"
  - SHOCKWAVE: "a shockwave of golden light bursting outward from a blazing centre point, one bright expanding ring of
    gold energy, cracked stone fragments, debris and dust thrown outward by the blast"
  - BAG: "a black cloth sack tied loosely at the neck, its open mouth glowing with warm golden light, drawing in
    swirling streaks of pale ghostly spirit-light that spiral into it" (golden rim light on the cloth folds)
  - BIND: "a translucent glowing violet sphere of light, like a bubble, holding trapped inside it a small featureless
    spirit silhouette made of red flame, with a ring of faint violet glowing runic marks circling the sphere"
  - SHIELD: "a protective dome-shaped cage made of glowing violet bars of light, curved bars meeting at the top, a soft
    violet energy barrier shimmering between them, empty inside, standing on a faint glowing ring at its base" (+ "no
    figures")
  - SMELL, first prompt: "wisps of sour grey-green smoke curling upward and spiralling inward toward the viewer, a faint
    pale glow at their centre" (+ "no nose, no face, no figures"). Both came back as one S-shaped ribbon that reads as a
    letter S / a dollar sign small, so it was asked once more: "five or six thin wisps of sour grey-green smoke rising
    from the lower edge and from both sides, each curling inward and converging on one small faint pale-green glowing
    point in the exact centre ... a symmetrical upward-opening fan or tulip of smoke around the glow, NOT an S-curve,
    NOT a single serpentine ribbon" (+ "no letter shapes").
- Jobs (ids only). A rate limit (8 at once) refused two of the first batch, and the resubmission doubled SHOCKWAVE and
  SHIELD, so those two had three candidates each:
  - FIRE: b0278a96-ff48-4698-a95f-799f00958e64 (a, PICKED), 3f03d6f8-fe6e-4d7b-8cf9-7bc9ee66448c (b)
  - SHOCKWAVE: 67256edb-1d79-4277-96da-82be20536802 (x), f51a3229-5fe1-4112-b2c9-96b0360c6586 (y),
    bc757788-65b7-4481-91aa-062b76b76e36 (z, PICKED)
  - BAG: 52d1ed87-8a44-4c56-9aee-8f64cacefdd4 (a), 3c9ebcec-bcd9-450a-b427-0eae80d2d2ab (b, PICKED)
  - BIND: ad04a891-af24-4a8a-815a-c79d9ebbdc20 (a), 479dc26c-5dba-4f73-9bda-accb60e9ef05 (b, PICKED)
  - SHIELD: 2ed5343a-26c7-4df2-9e88-f040e15c06b0 (x), 0faac1e9-e763-4ef6-969f-24df820e87cb (y, PICKED),
    57cdc207-a514-477d-a82a-98f82b28eee6 (z)
  - SMELL: 0faaf2a8-33ba-4150-bc18-80a026603210 (a), ea2ea17d-0841-4094-b62c-ea3221c2e00c (b) (both refused: an S);
    abf9e75b-f731-4631-a814-440fc730e6bb (c), b0b354ac-fefc-43fc-8b1c-94fe6dd6b946 (d, PICKED)
- Why each pick: FIRE a, the head more compact and further inside the circle; SHOCKWAVE z, the ring narrowest and the
  least debris across it (all three nearly alike); BAG b, the streaks plainly flow INTO the mouth (a's read as coming
  out); BIND b, the red spirit larger and bolder, so it still reads at 64 px; SHIELD y, five thick bars instead of
  seven thinner ones, the clearest cage small; SMELL d, the glow at the centre and the wisps converging on it still
  read at 64 px, where c's two big outer wisps read as horns. Every candidate was looked at full size, and the picks
  again at 64 and 128 px in a circle.
- Prep (each 1024 PNG): scaled to 0.84 to 0.92 of 512 (fire 0.88, shock 0.86, bag 0.84, bind 0.90, shield 0.86, smell
  0.92) on a black 512 x 512 field, its edge feathered into the black so nothing the circle crop would cut is lost;
  JPEG quality 88, RGB, no EXIF or ICC: assets/p5icofire.jpg, p5icoshock.jpg, p5icobag.jpg, p5icobind.jpg,
  p5icoshield.jpg, p5icosmell.jpg.
- Credits: 145.16 before, 73.16 after (72 used: 16 pictures at 4.5).

## R116 and R117: the five fight icons painted again (24 Nov 2026)

Chad, the same evening, on seeing the R110 set: "They look like ai slop icons and not true diablo style icons", then "Actually
diablo isnt a good example, world of warcraft icons are better". The R110 set (above) floated glossy generated effects on a
black void, each in its own manner; it is refused and replaced, never shipped. (Its SMELL icon, never used, is kept at
masters/v28.0/props/unused/p5icosmell.jpg.)

- Model: Higgsfield `gpt_image_2_6`, 1:1, quality `max`, 1k (4.5 credits a picture); 7 pictures, 31.5 credits (73.16 before).
- The game is never named in a prompt and no picture of another game goes in: the manner is described in words. Shared
  words: "A square spell icon for a fantasy MMORPG action bar, hand-painted digital painting in the classic style of those
  games' ability icons. The painting fills the entire square edge to edge with a richly coloured painted background: no black
  void, no empty space. Saturated, luminous colour, soft painterly brushwork with visible strokes, stylised and slightly
  exaggerated like hand-painted game art. One large, bold central subject with a clear silhouette that still reads at 40
  pixels, its brightest glow at its heart, darker toward the corners. Everything important sits inside the central circle,
  because the corners will be cut off by a round button. ... No text, no letters, no runes, no symbols, no border, no frame,
  no UI elements; not a photograph, not a 3D render."
- Each icon's own words and job (ids only):
  - FIRE (Grandmaster Pho): "a blazing fireball streaking toward the viewer from the lower left to the upper right, a
    white-hot yellow core wrapped in curling tongues of orange and red flame, a short flaming tail, a few hot embers";
    ground "deep crimson and orange". c549b4da-d0f4-4398-a20d-227e46ea8db7, PICKED.
  - SHOCKWAVE (Grandmaster Pho): "a shockwave of golden light, one thick blazing ring of gold force bursting outward across
    cracked stone ground from a brilliant white-gold centre, seen from a little above, dust thrown up along the ring"; ground
    "warm amber and burnt orange". 8fc4c41e-7f0f-4ab6-948f-811beea0964d, PICKED.
  - BAG (Grandmaster Pho): first f8cc2a53-9449-49e8-8994-c2b157cf8de9, refused (its wisps came back as cartoon ghosts with
    faces); again with "faceless pale blue-white wisps of spirit-smoke ... only smoke: no faces, no eyes, no mouths, no ghost
    shapes", ground "deep teal-blue and slate": 76bb78f0-3e18-4a0b-8246-cbacba28fc6a, PICKED.
  - BIND (Master Zavier): "a glowing violet sphere of light with bright vertical bands of light around it like the bars of a
    round cage, a small red flame-spirit trapped inside, its clawed hands pressing against the bars"; ground "deep purple and
    magenta". 33d65578-74cf-4658-a57f-91fb9c7dec3d, PICKED.
  - SHIELD (Master Zavier): first 56d61f88-7e45-4690-b13b-af540e8ca673, refused (a hooded wizard, and Grandmaster Pho wears
    no hood); again with "an older man with short grey hair in a plain loose robe, seen from behind in dark silhouette,
    standing calm and upright with his arms at his sides; no hood, no hat, no staff ... a glowing ring on the ground at its
    base", ground "deep indigo and blue-violet": f080065d-6d78-4de2-b752-7d86801f357e, PICKED.
- Prep: each 1024 picture scaled to 512 x 512 (Lanczos), RGB, JPEG quality 88, no EXIF or colour profile; full bleed, no
  padding (the button's own circle crops the corners, as the prompts allowed for). Looked at full size, one at a time.

## R118: the TOGETHER painting made wide (24 Nov 2026)

Chad: "The together button, can you make it more rectangular instead with the skewed angle edges?" R107's painting was
generated round (black outside its circle), so a wide button would show black corners. It was painted again wide from
itself: Higgsfield `gpt_image_2_6`, 21:9, quality `max`, 1k (1344 x 576), its own job c8aa2649-3ac6-480a-a1ad-1bc7debac262
as the reference image, two pictures (9 credits): 01b975e0-8075-4e01-bad0-b8c930c2212a PICKED (both faces well inside the
ends), f8f4a90b-9022-4e81-92fa-54599db047a3 kept unused. Prompt: "Repaint the reference illustration as a wide 21:9 banner in
exactly the same hand-painted Final Fantasy style of fantasy illustration: the same two men in the same poses, with the same
faces, clothes, staff and colours ... Recompose them side by side across the wide frame, seen from the chest up, both faces
in the middle band of the picture and well inside its left and right ends. The painted background of gold fire, dark smoke
and violet energy fills the whole frame edge to edge. No circle, no round frame, no black border, no vignette, no text, no
letters." Every hand counted (five fingers each). Scaled to 768 x 330 (Lanczos), JPEG 88, as `p5togwide`; `p5togart`
(the round one) retired from the build and the repository (git history keeps it).

## R122: the special attack's pictures (25 Nov 2026)

Chad: "Do idea 1, 2, 4, 6" (his pick of R121's nine). Idea 1's cut-in and idea 6's summon title.

- `p5cutpho`, `p5cutzav` (the cut-in's two bands): cut from the party list's own paintings (portraits-src/pho-painted.png,
  zav-painted.png, R59) with their painted halos (each painting's colour as painted, its alpha left behind, so Grandmaster
  Pho's gold halo and Master Zavier's violet glow stay round them), 1024 x 670 bands centred a little under the eyes
  (Pho's rows 60 to 730, Master Zavier's 230 to 900), JPEG 90, no EXIF or colour profile. No credits.
- `p5nagatitle` (the summon's gold NAGA): Higgsfield `gpt_image_2_6`, 21:9, quality `max`, 1k (1344 x 576), background
  transparent, one picture: 35849b56-4f30-4b43-8ec7-4b24f80a78eb, 4.5 credits (the balance read before and after, 32.66 and
  28.16). Prompt: "A fantasy battle title card: the single word NAGA in large ornate capital letters of polished, engraved
  gold, each letter bevelled with bright specular highlights and fine scale-like filigree engraving, a slim flowing
  water-serpent flourish curling beneath the word in gold and pale aqua blue, a soft warm golden glow around the letters.
  Centred, the whole word fully inside the frame with generous empty margins on every side, crisp sharp edges, no other
  text, no letters other than N A G A, no frame, no border, no background objects, transparent background." Looked at
  full size: the four letters spelled right, engraved with scales, a small naga's head over painted water beneath them.
  Cropped to its own alpha's box (1296 x 559), PNG with alpha, no EXIF.
  RETIRED at R126 (25 Nov 2026; Chad, R125: "The naga word looks very lame."; R126: "Tone down the font design and look of
  the naga word"): the file left the build and the repo (git keeps it, this entry keeps its recipe). The word is drawn by
  the film itself now (c_yfilm.js TITLE5): NAGA in the game's own title face (Cormorant Garamond 600, the chapter cards'),
  ivory, widely spaced, a faint warm glow and a thin rule under it, no gold, no engraving, no serpent.
