# v24.55 · Grandmaster Pho: his face and hands at his scan's full detail, baked in Blender

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.55/make.sh`.

## Chad's words (8 Nov 2026, verbatim)

- "I think you can still improve the pho model much more given now that you have blender, you are not using it to its
  fullest potential and capacity"

His words of 7 Nov still stand: "Dont spawn reviewers", "Be efficient".

## What was measured first (v24.54's file, his full scan, look D at the game's exposure)

- His colour sheet is 8192 pixels and gives every part of him the same share of it, about 23 texels a centimetre: his face,
  hands and feet as much as the plain white robe (head and neck 3.4% of the sheet, hands 0.8%). Cut to 4096 for a phone,
  his face lost half its detail (his 8192 sheet's eyes, brows, stubble and hair strands, side by side with the 4096 cut).
- The blotches on the back of his head, lit: not paint (drawn unlit his hair is smooth) but the light on his scan's own
  shape there (his full 560,000-triangle scan shows them too). The chart fix (v19.8) pins each of his hair's hundreds of
  slivers to one texel, which adds a square of one tilt each. His hair was lit at all because the colour test of look D
  reads grey as robe; Chad's look D is "unlit, except for the robe".
- His normal map baked again from his full scan onto the kept 168,000 triangles: the robe comes out with the scan's lumpy
  bead-like lines along every fold edge; the thinned robe is cleaner. Left as it is.
- His robe's ragged edge across his back, and the skin-coloured patches on the robe there: his scan's paint (drawn unlit,
  the same). Left as delivered; his choice.

## Tries

- t1. His whole sheet laid out again in Blender (each chart given room by what it shows, face and hands twice the width,
  packed into one 4096 square). Blender packs his 3,900 charts into at best half the square (49% at a 4-pixel gutter,
  54% at 2): the room his face needs costs the robe 14% of its sharpness. Left.
- t2. A second sheet for his face and hands alone (2048, packed by Blender at 59%: 1.99x the texels of his body sheet,
  his 8192 sheet's full detail), his body sheet untouched. The first bake came out blurred: Blender 5 reads an image
  through its new texture cache "at appropriate resolution" by default; with it off, the bake matches his 8192 sheet
  spot for spot. The hair's slivers were still pinned (the chart fix ran before the bake).
- t3. The bake taken before the chart fix (the slivers keep their real coordinates and come into the new sheet whole),
  its normal map baked from the full scan: the blocks at the back of his head stayed, lit (they are his scan's shape).
- t4 (**shipped**). As t3 with no normal map on the new part, and look D drawing that part unlit whole, his hair too:
  his hair is his own paint, with no blocks. (The first comparison of all 19 takes showed changes along every edge of him:
  clipsheet framed a file from its first part, and his head had left it. It now frames from every part and every point.)

## The fix

`masters/v24.55/make.sh`:
- steps 1-7b as v24.54 (its `prep/pho_cloth_armpit.glb` is the input);
- 8a: `tools/prepmonk.mjs` with v24.54's settings and `BAKE=dump:` stops before the chart fix and writes the thinned mesh,
  the mesh it read and his two sheets;
- 8b: `tools/rebake.py` in Blender: the 465 charts that show his head or hands (by the bone their points ride), or his
  necklace's gold, at least 30% of their surface (19,113 triangles), packed into a 2048 square of their own; his 8192
  sheet baked into it through each triangle's own coordinates (every triangle shows what it showed; no texel of his
  paint changed), the gutters filled outward from each chart's edge;
- 8c: `tools/prepmonk.mjs` again with `BAKE=apply:`: those triangles become a part of their own on points of their own
  (14,406 copies, every attribute their point's: they move and bend as before), with a copy of his material whose colour
  is the new sheet and that has no normal map; the chart fix leaves that part alone; the rest is v24.54's run.

Look D (`tools/clipsheet.mjs --look=skin@raw`, `tools/probes/phoingame.mjs`, and chapter 3's patch when it casts him):
the part whose material is named `... (face and hands)` is drawn unlit whole.

## The check

- Close, in look D at the game's exposure (`shots/pho-face-hair-before-after.jpg`): his face sharper (brows, eyes,
  nostrils, lips, the skin of his forehead); the back of his head his own short hair, the blocks gone. At the size where
  his face is about 200 pixels tall, a touch softer than before (a sheet with more detail than the screen shows is drawn
  from its own averaged copies). His hands and wrists from four sides: no seam where the new part meets the arm.
- All 19 takes, four moments, front, his right and behind, the two files framed alike: at a difference of 40 (of 255), 12
  takes are the same to the pixel and the rest differ by a few pixels on the back of his head; at 12, every change in
  every take is on the back of his head (his hair, now unlit).
- The recipe run three times makes the same file byte for byte (3f933c52); prepmonk without BAKE still makes v24.54's
  file (f0a6a9fa).
- `assets/pho.glb`: 9,076,976 bytes (+420,892), 3 parts (+1), 168,122 triangles (the same), 126,563 points; texture memory
  with mipmaps about 128 MB against 107 (+21 MB, the 2048 sheet).
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## Left, and said

- The cost (+21 MB of texture memory on the phone) is put to Chad, with the lighter choice: the new sheet at 1448
  (1.4x the detail of today's face, +10 MB).
- His robe's ragged edge across his back and the skin-coloured patches on it: his scan's paint, his choice.
- Waiting on his choice, as before: his hands in the floor sit; the raised armpit's plain skin.

## Files

- `tools/rebake.py` (new, Blender's Python): the charts packed, the sheet baked, the copies.
- `tools/prepmonk.mjs`: BAKE (dump and apply), and the chart fix told to leave the new part alone.
- `tools/chartfix.mjs`: `skip`, a set of materials to leave alone.
- `tools/clipsheet.mjs`, `tools/probes/phoingame.mjs`: the face-and-hands part drawn unlit whole in look D.
- `assets/pho.glb`: rebuilt by the recipe.
