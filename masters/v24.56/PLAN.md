# v24.56 · Grandmaster Pho: his right armpit cleaned up, nothing popping out

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.56/make.sh`.

## Chad's words (9 Nov 2026, verbatim)

- "why is there a piece of skin colour thing popping out from under the right armpit? didnt you notice it"
- "why cant u just clean up that entire armpit area, remove all those popping out parts, is it so hard? you have been
  going in circles on this part"

His words of 7 Nov still stand: "Dont spawn reviewers", "Be efficient".

I had seen the piece in v24.55's in-game picture and passed it as older work; v24.55's own check only proved that v24.55
had not changed it. That was my miss.

## What was measured first

- **Every frame, not one picture.** A new probe, `tools/probes/webstretch.mjs`, poses the file through every frame of all
  19 takes (rigstrain's posing, in plain Node) and measures, for every triangle within 25 cm of his right shoulder joint,
  how far its longest edge is drawn out against rest. v24.55: drawn out past 20 times in some frame, 210 triangles; the
  worst 95 times (cast 4, cast 1); talking with hands open, 27 to 38 times.
- **What the piece is.** In the game picture Chad saw (talking, 1.2 s), the piece is two things (tools/probes/phoid.mjs):
  the patch v24.54 put over the place his inner arm was pressed to his side, which rides the arm but lies off it, so it
  swings out under the armpit as a fin; and the "two folds kept as the armpit", drawn out 27 times.
- **What the folds are.** Drawn in Blender, coloured piece by piece, and cut through: they are a thin strip the scan laid
  across the mouth of the hollow under his arm. The hollow's own walls, the arm's inner side and his side, meet above it,
  as in a real armpit. Every take holds the arm 23 to 150 degrees from where the scan hung it, so the strip opens in every
  take, even walking.
- **Why the patch is a fin.** Its rim runs out along a tongue of the scan's bridge that still rides the arm: rim points up
  to 9.6 cm from the line of his upper arm, an arm 5 to 6.6 cm in radius there.

## Tries

- t1. The folds cut too (CUTALL), each opening closed on the arm's side and on his side (the opening split into its two
  runs). The worst stretch fell from 95 to 46 times, but each closing was a fan 10 to 15 cm long from the two points where
  arm and side still meet, which ride the arm by half: grey strips across his back and chest (cast 6, cast 4). Left.
- t2. The cut carried higher, nearer the joint (MIXFAR 8 and 6 cm): the openings grew, the fans with them, and no plain
  skin lay within reach for the new fills. Left.
- t3. **Shipped part.** The folds cut and their openings left open (MIXOPEN): the hollow's walls close him. Worst stretch
  28 times (from 95), none of the strips. The flap was still there (the patch's fin).
- t4. **Shipped part.** The tongue cut with them (TONGUE, at 1.2 cm and then 0.6 cm past the arm's own radius): the patch
  lies on the arm and the flap is gone. A finer point at the arm's edge went at 0.6 cm.
- t5. **Shipped part.** Opened, the hollow showed the scan's crease paint, grey and white where the camera never saw:
  grey scraps in the armpit with the arm raised. The inside of the crease (closed in by his own body at rest: fewer than
  16 of 48 rays get 15 cm free) drawn in plain skin beside it (CREASEPAINT; 8, 12, 16, 24 and 32 tried; 16 kept).
- t6. **Shipped part.** With the arm down, the robe's ragged top edge in the armpit showed as white teeth where the folds
  (skin) used to lie over it. What a cut piece covered at rest (2 or more of 48 rays meet one first, within 5 cm of the
  other side) drawn in plain skin too (COVERPAINT): at rest he looks as he did.
- t7. The rim of the cut and the blend band at the front of the armpit drawn in skin as well (RIMPAINT, BANDPAINT): no
  visible gain in the game pictures, a few skin wedges in the robe's edge at his back. Taken back out of the tool.

## The fix

`masters/v24.56/make.sh`: steps 1-7 as v24.54 (its `prep/pho_cloth_arm.glb` and `prep/joins.json` are the input); 7b,
`tools/armpit.py` in Blender with CUTALL=1 MIXOPEN=1 TONGUE=0.006 CREASEPAINT=16 COVERPAINT=2 CREASENEAR=0.05; step 8
exactly as v24.55 (prepmonk BAKE=dump, `tools/rebake.py`, BAKE=apply). `tools/meshpatch.mjs` widens its search for plain
paint to twice and four times its 3 cm when none lies nearer (deep in the crease); where 3 cm sufficed, nothing changes.
No texel of his sheet changes: painted triangles are pointed at plain skin beside them.

## The check

- Every frame (webstretch): drawn out past 20 times, 210 triangles → 38; past 10 times, 385 → 213; the worst 95 → 28
  times (cast 6 at 1.1 s, in the blended skin at the front of the shoulder where the arm truly joins him).
- All 19 takes, five moments each, from his front, front-right, right and behind, close on the armpit in look D at the
  game's exposure, against v24.55: the flap and wedge under the armpit gone in talking; no strip, fin or shard in any
  take. In the real game on a phone (`shots/pho-armpit-before-after.jpg`): talking at 1.2 s and 0.4 s, the flap gone; the
  hand-on-hip take, a smaller bit of his robe's own edge where the old file showed a skin shard.
- With his arm raised high you now see his robe on his side under the arm, in the arm's shade, where v24.55 drew a
  stretched sheet of skin over it (the seated cheer from his right, cast 6 from behind).
- The whole body, four takes from four sides: every change of note is at the right armpit. The thinning shares one
  triangle budget over the whole model, so the armpit's change moves it a little elsewhere: the robe's two-sided part has
  584 fewer triangles (1.2%), seen as a few pixels along the robe's outline.
- Proofs: armpit.py with none of the new switches writes v24.54's patch byte for byte (7cbb527b); meshpatch apply with
  it writes v24.54's step 7b file byte for byte; the recipe run twice makes the same `assets/pho.glb` (be554c7f).
- Reading the final diff, before the commit, I found a fault of my own: the crease pass (CREASEPAINT, COVERPAINT) also took
  the fill's own triangles, which carry no id of his scan's (a face made in the script has its layers' defaults: triangle
  0, every corner point 0). It took out glTF triangle 0, a 5 mm piece inside the fold of his robe's hem at his shin (its
  open side 2 mm under the robe, 1 of 24 rays gets out: never seen, but gone), and wrote 117 triangles with all three
  corners on one point (no area, drawn as nothing). Fixed: the fill's triangles are skipped (each is written with its own
  paint already). armpit.py now refuses a patch that takes out a triangle outside the region it was handed, or writes one
  with a corner twice; broken on a copy, it stops on triangle 0. The fixed patch is the old one less exactly those two
  faults; the unset run still writes 7cbb527b.
- The patch's shorter list moved the thinning's shared budget, so every check was made again on the rebuilt file
  (be554c7f): every frame the same (213 triangles past 10 times, 38 past 20, the worst 27.8 times, the same triangle in
  cast 6); the 19 takes at five moments from four sides against the earlier build: 361 of 380 pictures differ, by 1 to 445
  pixels, all a pixel or two along the robe's outline and folds and the lips' edge, none at the armpit; the whole body
  against v24.55 changes at the armpit and in specks along the robe; the game pictures the same but for those specks and
  the dog behind him. `shots/pho-armpit-before-after.jpg` is the rebuilt file.
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## Cost

`assets/pho.glb` 9,096,408 bytes (+19,432), 168,029 triangles (−93), 127,408 points (+845), the same three sheets
(texture memory unchanged).

## Left, and said

- In a few arm-down moments (the hand-on-hip talk) a small bit of his robe's own ragged top edge shows at the front of
  the armpit, where the stretched folds used to hang in front of it. It is his scan's robe (as his robe's ragged edge
  across his back is): his choice whether to paint it.
- Raised high, the armpit shows his robe under it rather than skin; anatomically right, and different from v24.55.
- Waiting on his choice, as before: the face sheet at 2048 (+21 MB of texture memory) or 1448 (+10 MB); his hands in the
  floor sit; the raised armpit's plain skin; his robe's ragged edge across his back.

## Files

- `tools/armpit.py`: CUTALL, MIXOPEN, TONGUE, CREASEPAINT, COVERPAINT, CREASENEAR (all off unless set); the guard that
  refuses a patch taking out a triangle outside its region or writing a corner twice.
- `tools/meshpatch.mjs`: the wider search for plain paint.
- `tools/probes/webstretch.mjs` (new): every triangle round a joint, drawn out over every frame of every take.
- `assets/pho.glb`: rebuilt by the recipe.
- `shots/pho-armpit-before-after.jpg`: v24.55 against v24.56 in the game on a phone, look D.
