# v24.53 · Grandmaster Pho: the last faults at his right armpit

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.53/make.sh`.

## Chad's words (8 Nov 2026, verbatim)

- "Fix those remaining issues cleanly and efficiently"

"Those remaining issues" are the two v24.52 left and told him:
- a faint pale line where the robe's edge meets his right arm, seen close with the arm down;
- a small skin patch on the robe in the chair sit, seen from his right with the arm up.

His words of 7 Nov still stand: "Dont spawn reviewers", "Be efficient".

## What they are, measured

The joins between the robe and his arm (333 triangles, `JOINDUMP`) are four pieces:
- two folds at the armpit (101 and 71 triangles, 11 to 16 cm from his shoulder joint). Each has one edge loop of robe and
  arm both. They are the armpit web, as v24.51 meant.
- a small fold lower down (21 triangles, 19 to 20 cm).
- a RING (140 triangles, 12 to 18 cm). Its edge is two loops, one all robe (63 points) and one all arm (68 points), each
  35 cm round. Beyond each loop is the body (`island.mjs`). The scan joined his arm to his side through a short collar
  round the place they touched: a hole in his side, a hole in his arm, and the collar between.

Kept as web, the collar goes up with the raised arm as a sleeve of skin from his side. That is the patch seen from his
right.

## Log

Each try is photographed close in look D at the game's exposure: five moments (the chair sit's cheer, talking, casts
6 and 1, the Charged cast), each front, from his right and from behind.

- A. The ring taken out and both holes closed (armfree JOINTUBE, CAPROBE=fan, CAPROBECOL=robe): the patch unchanged,
  and a small see-through gap at the armpit while talking. Left.
- B, C. The lowest fold (21 joins, 19 to 20 cm) taken out too, its opening left (B) or closed as robe (C): the patch
  unchanged.
- D. Every join taken out: the patch gone and robe on his side under the arm, but threads from the arm to the body in
  three moments and odd white shapes. Left.
- Measured: the patch IS the lowest fold (phoid on the step-7 file; `whichcomp.mjs`). Taken out or painted before the
  thinning, the thinning remakes it from the points round it.
- F, G. The lowest fold drawn in the robe's colour before the thinning (armfree JOINROBEFAR): the patch unchanged.
- H, I. After the thinning, a triangle in skin hanging off the robe low on his side (two corners on the robe riding his
  trunk, one riding the arm by 0.3 or more, further than 17.5 or 16 cm from his shoulder joint) drawn in the robe's
  white (prepmonk ROBEHANG): the patch white, but a white streak up the skin under his arm. Left.
- J. The same triangles taken out instead (ROBEHANGCUT): the patch gone, no streak, no hole. One thin sliver left: three
  such triangles with one corner on the robe, not two.
- E. Stretched skin holding texels look D draws partly lit, drawn in the skin beside it (prepmonk STRETCHSAT 0.25): the
  faint pale dots at the armpit unchanged. Left.
- K. J, with one corner on the robe enough: the sliver gone too, but for a hairline.
- Measured, the pale dots: not turned-away triangles (M: that region drawn from both sides, TWOSIDER, changed nothing) but
  his colour sheet. The triangles there sit on thin charts of skin with white right beside them (`uvcrop.mjs`), and a
  texel at a chart's edge mixes in its neighbour when drawn.
- N. **Shipped**: K, and within 15 cm of his shoulder joint a triangle of skin whose texels lie within 2 texels of that
  white pointed at a texel of the skin beside it whose 7 x 7 texels are all skin (prepmonk EDGEBLEED 0.15; 295
  triangles). Most of the dots gone; no pixel of his sheet touched.
- O. The same at 20 cm (817 triangles): no better. Left.

The tried settings that were left are taken back out of the tools (JOINTUBE, CAPROBECOL, JOINROBEFAR, STRETCHSAT,
STRETCHMIXED, TWOSIDER, and the robe-hang's paint mode). armfree keeps JOINDUMP, a look at the join that changes nothing.

## The fix

`masters/v24.53/make.sh`: step 7 exactly as v24.52 (the same file, d91d9051); step 8 as v24.52 with, after the thinning:
- ROBEHANG=0.175: 30 triangles taken out. Each is skin, with a corner on the robe riding his trunk and a corner riding the
  arm by 0.3 or more, further than 17.5 cm from his right shoulder joint.
- EDGEBLEED=0.15: 295 triangles pointed at safe skin.

## The check

- Close, in look D at the game's exposure, v24.52 against the new file (`shots/pho-armpit-before-after.jpg`):
  - the patch on the robe in the chair sit from his right is gone;
  - most of the pale dots in the crease of his armpit, arm down, are gone.
- The five moments, front, from his right and from behind: nothing else changed.
- All 19 takes, four moments, front and from his right, in look D, against v24.52: nothing else changed that the eye can
  see.
- The recipe makes `assets/pho.glb` 8,679,276 bytes, sha1 f4c6cf60, byte for byte the trial build N (built before the
  tried settings were taken out). 560,428 -> 168,098 triangles; 19 takes.
- Unset, nothing changes: step 7 is v24.52's file (d91d9051), and prepmonk with v24.52's settings makes v24.52's file
  byte for byte (82dceadf).
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## Left, and said

- A hairline where the patch was, in the chair sit from his right.
- A few faint pale dots in the crease, arm down, seen very close.
- From before: two hairline seams in the web from behind in cast 6; the orange dots and the dark crease lines painted in
  his robe's texture (as delivered).
- Waiting on his choice, as before: his hands in the floor sit.

## Files

- `tools/prepmonk.mjs`: ROBEHANG, EDGEBLEED.
- `tools/armfree.mjs`: JOINDUMP (a look only).
- `assets/pho.glb`: rebuilt by the recipe.
