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
