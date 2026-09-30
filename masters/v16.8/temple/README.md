# The Lanna temple, refined (not yet in the game)

Chad's untextured Sketchfab temple (thai-lanna-buddhist-temple, 482k
triangles, no UVs, no maps). His note on the first colouring: "very coarse
colouring with no details". This folder is the refinement, before any
decision on where it goes.

- `bake.mjs` (offline; needs `three-mesh-bvh`, which this repo does not
  carry — install it in a scratch folder with three 0.185 and the
  gltf-transform packages): every face turned OUTWARD by testing which of
  its two sides is more open (the file is exported inside-out in pieces:
  its walls wind inward and the roof's top faces down; its stored normals
  follow the winding, so they cannot tell), classified (roof, soffit,
  white, base, red, gold, floor — carving is anything crowded or fine),
  the single-sheet roof written twice (up as tiles, down as the teak
  underside), then ambient occlusion baked per vertex with 28 rays through
  a BVH into COLOR_0. `node bake.mjs ../src/temple.glb baked.glb 28 7`,
  ~10 minutes.
- `tmats.js`: the materials — a base colour per class, the AO, and a
  world-space pattern per class (no UVs): pointed shingles in LEVEL rows
  (rows spaced along the slope bunched into a swirl where the roof changes
  pitch), faded to their average where a tile is under a couple of pixels
  (moiré); limewash; stone courses; the gold lai-kham lattice with
  rosettes on the red; teak planks; slabs; the hall's interior darkened.
  **Each class needs its own `customProgramCacheKey`** — three keys the
  program cache on the onBeforeCompile source, which is identical text
  for every class, so without it every class drew with the first class's
  pattern.
- `view.html`: the viewer (ACES, a sun ABOVE the temple — the first one
  was below its middle and lit nothing on top — shadows, a room env for
  the gold).
- `temple-before-after.jpg`, `temple-roof-closeup.jpg`: what was sent to
  Chad.
