# v29.0 · the things of episode 5 chapter 1: the record

The plan's §7 in two lists: the things REUSED (each a model the game already has, declared: v17.4) and the things made
NEW, in the plan's order (a checked GPT Image picture on white, then Meshy at its highest and its remesh, once each). All
Meshy ids are also in masters/v29.0/src/props/jobs.json (the ledger; ignored by git, never hand-edited). The pictures'
ids are in refs.tsv; the prompts in PROMPTS.py. Keys for the new things: keys.json (the coordinator writes them into
keys.py and build.py).

## CP4.1 · The REUSED things (plan §7), each matched to a model the game has

Where the player met it before is the chapter and the place. A reused thing keeps its own key (no new key is made); the
chapter declares it in `reuse` (another episode's) or `reuseInEpisode` (none: episode 5 has no earlier chapter, so every
one of these is `reuse`).

| thing (plan §7) | key | file | where the player met it | fit, and what to mind |
|---|---|---|---|---|
| the holy-water bowl | `w4bigbowl` | assets/w4bigbowl.glb (0.32 m, embossed silver, lotus band, a pedestal foot; jasmine and marigold petals in its water) | episode 4 chapter 4: Grandmaster Pho's own larger bowl on the floor by Amma's chair, where he dips again; episode 4 chapter 5's rite (declared there) | Pho's own bowl, so it is the right thing in his hands. The plan's §8.1 calls it "brass": it is SILVER (a runtime warm tint makes it read as brass, his file untouched), or the plan's word changes. Its petals float in it: the minigame's look-down at the water (§8.2) sees them. The smaller `w4waterbowl` (0.15 m, silver, the player's own in chapter 4, 2048 sheet) is the alternative if a bowl he holds in two hands should be smaller: 0.32 m is big for a bowl held before him |
| the candles | `w3candlesmall` | assets/w3candlesmall.glb (0.24 m: a small plain pink wax candle in a tiny brass holder) | episode 4 chapter 3: the Wai Kru's offering tables | the only small candle the game has. Its sheet is 256 px and 1,500 triangles: seen in the INSERT from above (§9.2, lens 36/30) it will be soft. Two on the cloth; the flame is the chapter's own sprite. A white candle would read better at a home rite: one word to make one new (45 credits) |
| the lighter | NONE | — | episode 3 chapter 5's disposable lighter is BUILT IN CODE (e3c5.js makeLighter: boxes and a cylinder), not a model | no fitting model. By v25.2 a code-built prop is not drawn where a real model can be made: a new thing (45 credits), the coordinator's call (not on plan §7's NEW list) |
| the incense | NONE as a model | — | episode 3 chapter 5's three joss sticks are BUILT IN CODE (e3c5.js makeSticks); episode 3 chapter 1's urn is a piece of `thaikit` (Chad's temple pack: `thai('incense')`), a temple urn, not sticks for a coffee table | no fitting model: a new thing (sticks in a small holder, 45 credits), the coordinator's call |
| Grandmaster Pho's fan | `w3fan` | assets/w3fan.glb (the peacock-feather fan) | episode 4 chapter 3 (his photographs 2 and 8) and episode 4 chapter 5's rite (declared there) | his own fan; dipped in the bowl and flicked (§8.2). Note Chad's R88 took it out of his hand in chapter 5's last film: a choice of that film, not a ban |
| Grandmaster Pho's cloth bag | NONE | — | he has not carried one on screen before. The only shoulder bag of cloth is `e4yaam`, Lersi Chin's striped Thai bag (episode 4 chapter 2): it is HIS, and putting it on Grandmaster Pho would read as Lersi Chin's | no fitting model: a new thing (a plain white or off-white cotton shoulder bag, 45 credits), the coordinator's call |
| the spool of white thread | `w5threadreel` (chapter 5's) | assets/w5threadreel.glb (0.09 m, 12,231 triangles) | episode 4 chapter 5: the rite of case three | its fault (the loose end hangs down and the ball floats 1.5 cm: v28.0 RECORD) is mended as THIS chapter's own new file, `w51threadreel`, at no credits (below, CP4.4); the old file is untouched |
| the small white plate | NONE | — | the game's plates are part of other models (`foodwarmer`, Chad's buffet set; `w4altartray`'s camphor plate, brass) | no fitting model: a new thing (45 credits), the coordinator's call |
| the cushions | `w5cushion` | assets/w5cushion.glb (0.50 m maroon floor cushion, 512 sheet) | episode 4 chapter 5: the receiving room's floor cushions | Pho's cushion and the floor cushions; brighter red than maroon (its v28.0 note). `w3hpillow` (the maroon Thai triangle pillow, episode 4 chapter 3's hall) is the other at hand |
| the plants | `w4corrpots` (money plant, aloe, pandan in three pots), `w3dracaena` (a dracaena in a brown glazed jar), `w4bougain` | assets/w4corrpots.glb, w3dracaena.glb, w4bougain.glb | episode 4 chapter 4's corridor (a neighbour's pots, a bougainvillea); episode 4 chapter 3's ground | the landing's plant: `w4corrpots` or `w3dracaena`; the bookshelf's own small plants are in the new bookshelf's model. Not `w4tulsi` (a Hindu household's holy basil, Amma's) |
| the water jug | NONE | — | no jug in the game | no fitting model: a new thing (45 credits), the coordinator's call; it is ORDER 1 of the room (§8.1, a press on the jug), so it is seen close |
| glasses and cups | `w3glass` only | assets/w3glass.glb (a glass of red soda with a straw, 0.15 m, 256 sheet) | episode 4 chapter 3, by the hermit's sofa | does NOT fit a glass of water on his altar or bedside (it is red soda with a straw). The kopi cups are in the new breakfast's model. Episode 3 chapter 4's teacups were built in code. A plain glass of water: a new thing, the coordinator's call |
| a Buddha image for his altar | `e4buddha` | assets/e4buddha.glb (Chad's own seated Buddha, "Yoga - Buddha" by T.Koeniger, Sketchfab CC-BY-4.0, 0.32 m; its credit row stands) | episode 4 chapter 1 | the plan's "a small Buddha image the game already has". `e4bucha` (the seated bronze in the earth-touching pose, 0.30 m, episode 4 chapter 2's shop altar) is the other; `buddhahd` (Phra Buddha Chinnarat, episode 3) is far too grand for a flat. Default `e4buddha`: Chad's own (v24.18: his models first) |
| a frame for his teacher's photograph | `w4framesmall` | assets/w4framesmall.glb (a thin silver standing frame, its picture area white) | episode 4 chapter 4: Amma's flat | stands on the altar; the chapter lays the photograph over its white. `w5frame` (a 0.68 m wall frame, chapter 5's walls) for a hung one |
| a bedside lamp | `w5tablelamp` | assets/w5tablelamp.glb (0.55 m) | episode 4 chapter 5: Mr Koh's living room | fits; 0.55 m is a tall bedside lamp (a scale where placed) |
| a bedside clock | NONE | — | the game's clocks are wall clocks (`w4clock`, `w5wallclock`, `w3hclock`) | no fitting model; §9.4's INSERT reads 11:58 and 3:00 on it, so it is seen close: a new thing (a small digital clock, its face the chapter's own painted numbers, 45 credits), the coordinator's call |
| the air-conditioner | NONE indoors | — | `w3aircon` is an OUTDOOR compressor on brackets (episode 4 chapter 3's stilt house); episode 3 chapter 5's bedroom unit was built in code | no fitting model for the wall unit over his bed (its blue light, §9.4): a new thing, the coordinator's call. `w3aircon` fits the balcony's ledge if one is wanted there |
| the fridge | `w4fridge` | assets/w4fridge.glb (a two-door white fridge, freezer on top, fruit magnets) | episode 4 chapter 4: Amma's kitchen | a 2000s HDB fridge with magnets in a new condominium's kitchen: it reads older than his flat. Fits Grace's kitchenette better than his |
| the kettle | NONE | — | `u5kettle` is a SOUND (chapter 5's) | no fitting model: a new thing, the coordinator's call |
| the balcony chairs | `w3pchair` | assets/w3pchair.glb (a plastic chair; white, the blue a tint) | episode 4 chapter 3's ground | a plastic chair on a condominium balcony: plain but true; there is no other outdoor chair |
| the laundry rack | `w4clothesrack` | assets/w4clothesrack.glb (a folding clothes rack with a shirt, a towel, a sarong) | episode 4 chapter 4's corridor (a neighbour's) | fits his balcony (the sarong reads as someone else's; a tint or keep) |
| his phone | `e4phone` | assets/e4phone.glb | episode 4 chapter 2: HIS phone (v25.5's remade one) | his own phone, the same man: fits. Her phone is made new (below) |

**Named, with no fitting model** (the coordinator's call; each 45 Meshy credits and one picture if made): the lighter,
the incense sticks, Grandmaster Pho's cloth bag, the small white plate, the water jug, a glass of water, the bedside
clock, the indoor air-conditioner, the kettle (and, from §5.4, the altar's vase of jasmine). The jug, the lighter and
the plate are pressed or seen close in play and the films (§8.1, §9.2).

## CP4.2 to CP4.4 · The NEW things (27 Nov 2026)

Each: its picture (refs.tsv; GPT Image 2.6 "sunburst" through ElevenLabs, 1280 x 720, one generation, 191 credits, looked
at full size: refs/<name>-1024.jpg is the record copy), Meshy image-to-3D at its highest (jobs-p1.json to jobs-p4.json:
meshy-latest, ultra geometry, 8k PBR, should_remesh; 40 credits each; the original in masters/v29.0/src/props/), then
`sh masters/v29.0/props/drive.sh <names>` (the room and the credits read before each), which runs prop.sh: Meshy's
remesh to TABLE.txt's count (5 credits), tools/prepmeshy.mjs (real metres on TABLE.txt's dimension, the base centre on
the origin, every triangle kept), photographed alone at 1100 px (front, side, back, three-quarter), each opened full size.
All eighteen pictures were made and all eighteen image-to-3D jobs ran ONCE; none failed; none was made twice.

| thing | key | image-to-3D job | remesh job | size m | tris | sheet | state, and what is wrong |
|---|---|---|---|---|---|---|---|
| keepsake | w51keepsake | 01a21b42-f6fc-76f7-bcf5-dde4ed975102 | 01a21b48-e447-74ea-acb7-5f7cf1ce6221 (12000) | 0.070* wide | 12,450 | 2048 | MADE. A folded cloth packet tied twice with a knotted cord, its ends frayed: reads as the thing. Its cloth came back a saturated red with pale worn folds where the picture was a faded rust-pink (shots/keepsake-q.jpg); a runtime darkening of its colour mends it at no credits |
| shoulderbag | w51bag | 01a21b42-fd2a-7379-9a62-27db0a1319e0 | 01a21b4d-d655-73c2-bb79-98f4a865cf61 (20000) | 0.360* wide | 20,421 | 2048 | MADE. Taupe-brown leather tote, zip open, the mouth showing its dark lining (the packet can be laid in it). The straps' edges and the zip's line are speckled and a little ragged close up (shots/shoulderbag-q.jpg); browner than the picture's taupe-grey |
| bottle | w51bottle | 01a21b43-0359-75bc-813b-fcdfb4f4e112 | 01a21b52-9270-743b-97cc-bbd26b43c4ac (8000) | 0.100* tall | 8,338 | 2048 | MADE, **FAULT**: the glass came back OPAQUE, a glossy grey-white like a ceramic jar (no water seen in it), with a few lines of invented faint print near its foot, and the cork's colour runs down over the neck (shots/bottle-q.jpg). As v28.0's Rak Yom found, Meshy does not make clear glass. Mend here at no credits: the body's material drawn as glass at runtime (transparent, a low opacity, the water a separate inner shape made in code is NOT allowed by v25.2, so the mend is the material alone; the print stays faint at 10 cm). Another job: 45 credits and very likely opaque again |
| threadreel (mend) | w51threadreel | (chapter 5's w5threadreel, no job) | — | 0.100 x 0.084 x 0.080 | 12,231 | 1024 | MADE at no credits (mend/threadmend.mjs): the 278 points of the strand that hung under the ball are laid out along the ground away from it, and the whole set down on its lowest point; the ball now sits 1.6 mm over the strand on the ground (shots/threadreel51-front.jpg, -side.jpg). The old file `w5threadreel` is untouched (measured by mend/measure.mjs before: the ball's foot 7.5 mm up, on the strand's tip) |

**NOT YET PREPARED (STOPPED FOR ROOM, 27 Nov 2026 04:50).** `df -h /` fell to 366 to 419 MB free during the bottle's prep
(the rule: under 700 MB, stop and report). The cause is not these things alone: my eighteen originals are 1.1 GB, the
cast's sources 0.4 GB, and the scratchpad holds 7.1 GB, 1.2 GB of it ENGINE's build snapshot (scratchpad/e5c1/snap-engine)
and other helpers' and older work (b56 is Chad's and stays). Nothing was cleared by me. The fifteen below have their
image-to-3D done and their ORIGINAL downloaded (the source is safe; Meshy keeps each task three days, to about 30 Nov):
each needs only its remesh (5 credits) and prep. To finish once there is room (about 100 MB free at a time is used per
thing, then released):
`sh masters/v29.0/props/drive.sh coffeetable gracesofa rattanchair bookshelf laptop takeaway hissofa histable hischair hisbed altarcab breakfast pills keycard gracephone`

| thing | key (to be) | image-to-3D job | original |
|---|---|---|---|
| coffeetable | w51ctable | 01a21b43-0959-72ad-ab54-3a4efc19e1d4 | 68 MB |
| gracesofa | w51gsofa | 01a21b44-73ac-70f1-9061-ac9fc8a8a2f3 | 87 MB |
| rattanchair | w51rattan | 01a21b44-7a07-74cc-b862-2ea7cf0e74c9 | 137 MB |
| bookshelf | w51shelf | 01a21b44-8083-7717-9182-5b0edae69d24 | 76 MB |
| laptop | w51laptop | 01a21b44-8620-75e0-a432-cc04d11f9fb0 | 21 MB |
| takeaway | w51takeaway | 01a21b45-d9d9-755c-a4ee-72b9deebfa15 | 38 MB |
| hissofa | w51sofa | 01a21b45-df46-704b-b349-5b33020751e6 | 84 MB |
| histable | w51dintable | 01a21b45-e4d0-70ed-b2d4-6091311869c5 | 51 MB |
| hischair | w51dinchair | 01a21b45-e9a4-71ab-8c88-99c6bd8c3cf2 | 85 MB |
| hisbed | w51bed | 01a21b47-1060-74b8-9409-74228a6fdcc9 | 55 MB |
| altarcab | w51altarcab | 01a21b47-15e6-73bf-a07a-3c2ec4a5c2ce | 50 MB |
| breakfast | w51breakfast | 01a21b47-1b19-747e-a120-f4b27549e5a0 | 53 MB |
| pills | w51pills | 01a21b47-2072-74cf-b68e-e6feb140ffc4 | 54 MB |
| keycard | w51keycard | 01a21b47-2910-778b-a01e-476ccc9ccf97 | 48 MB |
| gracephone | w51phone | 01a21b47-2e7e-703a-9406-bbf3d4f3e7f6 | 46 MB |

## What it cost (27 Nov 2026)
| service | spent | balance |
|---|---|---|
| ElevenLabs (pictures) | 18 x 191 = 3,438 | (about 72,300 before) |
| Meshy | 18 x 40 (image-to-3D) + 3 x 5 (remesh) = 735 | 1,077 at the start, 193 after (the cast's spend beside it: about 149) |
The fifteen remeshes still owed: 75 credits. At 193 with the cast near its 150, the reserve (60 + what the cast has not
spent) leaves room for all fifteen.
