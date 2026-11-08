# v24.54 · Grandmaster Pho: his right arm freed from his side, in Blender

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.54/make.sh`.

## Chad's words (8 Nov 2026, verbatim)

- "Would it have been easier if you had blender mcp and open the model in blender"
- Put to him: 1. leave Pho as he is; 2. "I install Blender here and redo his right armpit properly, then re-check all 19
  moves ... His current file stays as the fallback until the new one looks better in every picture."; 3. the Blender MCP
  on his own computer.
- "Ok, install blender on your end. I'm just worried it will be all slow since you have no gpu, and make the whole
  workspace have even lesser space. Is it possible to increase the space? Eventually this game will grow to 10 episodes,
  and at this rate, the space will not be enough. But i dont want to compress anything"

His words of 7 Nov still stand: "Dont spawn reviewers", "Be efficient".

## Blender here

- Blender 5.2.3 LTS as a Python module (bpy) in a scratch venv, headless: no graphics card needed. It opens his whole
  560,000-triangle file in 9 seconds; the armpit step runs in about 10.
- The pictures that judge him are still the game's own renderer (`tools/clipsheet.mjs`, look D). Blender's own renderer
  (Cycles, on the processor) drew only the working pictures of the joins: each piece in its own colour, from four sides.
- `tools/meshpatch.mjs` is the bridge: it hands Blender the points and triangles near his right shoulder joint, and
  writes back only what Blender changed. With an empty change it writes the file it read, byte for byte (d91d9051).

## What it is, measured in Blender (step 7's file)

- The four joining pieces (armfree's JOINDUMP): two folds across the armpit (101 and 71 triangles, 10 to 16 cm from his
  shoulder joint, each one slit with a lip on the arm and a lip on his side: the armpit itself), the collar (140; two
  loops, one on the arm and one on his side) and a small fold below it (21; 18 to 21 cm).
- Front-to-back cross-sections: the crease between arm and side is deep and narrow, the two folds run its whole width,
  and arm and side alternate along it.
- Beside the collar, the inner arm's skin rode his side by up to 0.36 (diffused across the joins while they were whole).
- The thinning remade joins from the points round them (v24.53): whatever was cut before it came back.

## Log

Each try photographed close in look D at the game's exposure: five moments (the chair sit's cheer, talking, casts 6 and 1,
the Charged cast), front, from his right and from behind.

- e1. The collar and the small fold out, every triangle further than 15 cm whose corners ride arm and side apart out too,
  each opening zipped shut, the armpit held through the thinning: a white strip from the robe up the raised arm (the
  front and back of the armpit cut open and closed as robe). Left.
- e2. Only the 6 such triangles beside the small fold: the strip gone; small gaps on the inner arm.
- e3. Every point within 30 cm weighed to its own side: bigger gaps and a shard. Left.
- e4, e5. Weights changed only within 4 cm of the cut; the inner arm's opening (a ragged round hole about 6 cm across, not
  a slit) closed by Blender's fill along its facing, then by the least-cost triangulation of its rim: gaps remain.
- e6. Every fill triangle written, also one Blender refused as a face: unchanged. Measured (the ID probe): the marks were
  fill triangles carrying the robe's white the scan printed on his arm where the robe touched it.
- e7. **Shipped**: each fill triangle's paint checked under it (15 samples; skin is warm and coloured, robe pale and
  grey; the dark fill between the sheet's charts is neither) and pointed at plain paint of its kind beside it where it
  failed; and the new weights written before any point is copied (a copy made with the old weights moved apart from its
  point: hairline cracks along the fill). The inner arm clean.

## The fix

`masters/v24.54/make.sh`:
- step 7 exactly as v24.52, with JOINDUMP (the file is d91d9051 still);
- step 7b, in Blender (`tools/armpit.py`): the collar and the small fold out, with the 6 last ties beside them; each
  opening closed on its own side by the least-cost triangulation of its rim; every point within 4 cm of the cut weighed
  to its own side (the arm's skin rides the arm; 275 points); the two folds across the armpit kept;
- step 8 as v24.53 with THINLOCK=0.25 (the thinning may not move a point within 25 cm of his right shoulder joint whose
  arm share lies between 0.02 and 0.98, nor its neighbours: 9,518 points) and without ROBEHANG (nothing left to hang).

## The check

- Close, in look D at the game's exposure, v24.53 against v24.54 (`shots/pho-armpit-blender-before-after.jpg`):
  - the chair sit from his right: the hairline and the skin tooth on the robe are gone;
  - cast 6 from behind: the two hairline seams in the armpit's skin are gone;
  - the Charged cast and the seated shout from his right: the robe's edge under the arm is clean.
- All 19 takes, four moments, front and from his right, in look D: with one-pixel edge noise taken out, every change is
  at his right armpit, and each is cleaner (the cross-legged sit's and the sitting moves' robe edge too).
- Arm down, close: as v24.53.
- The recipe run twice makes the same file byte for byte; step 7 is v24.52's file with JOINDUMP set; meshpatch with an
  empty change writes the file it read; prepmonk with v24.53's settings still makes v24.53's file (f4c6cf60).
- `assets/pho.glb` 8,656,084 bytes, sha1 f0a6a9fa; 560,428 -> 168,122 triangles; 19 takes.
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## Left, and said

- Raised, his armpit's skin is drawn in one plain skin colour (as since v24.51): his scan never saw that skin. A soft blend
  from the skin round it would need new paint in the empty space of his colour sheet: his choice.
- With the arm down, the robe's own edge shows in the crease (his scan).
- The orange dots and the dark crease lines painted in his robe's texture (as delivered).
- Waiting on his choice, as before: his hands in the floor sit.

## Files

- `tools/armpit.py` (new, Blender's Python): the cut, the fills, the weights.
- `tools/meshpatch.mjs` (new): dump a region for Blender, apply its change.
- `tools/prepmonk.mjs`: THINLOCK.
- `assets/pho.glb`: rebuilt by the recipe.
