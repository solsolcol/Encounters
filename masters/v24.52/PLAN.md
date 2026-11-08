# v24.52 · Grandmaster Pho: his right armpit clean in look D, and how he looks in the game

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.52/make.sh`. Tools:
`tools/armfree.mjs` and `tools/prepmonk.mjs` (new settings, off unless set), `tools/probes/phoingame.mjs` (new). Pictures:
`masters/v24.52/shots/`.

## Chad's words (8 Nov 2026, verbatim)

- "It is still not clean enough."
- "Also how will he look in the game? Will he be unlit or lit? It makes a massive difference to how he looks"
- "I want to see how he will actually look in the game"
- "I thought i said before my preference is for the model to be unlit, except for the robe"

His words of 7 Nov still stand for this work: "Dont spawn reviewers", "Be efficient".

## Lit or unlit: look D, his pick

He picked it at v24.47 and said it again here: unlit, except for the robe. That is look D: his skin and necklaces drawn in
the scan's own colour, laid on after the game's tone mapping, and the robe lit by the scene. It is a material patch that
chapter 3 carries when it casts him (`tools/clipsheet.mjs --look=skin@raw` and `tools/probes/phoingame.mjs` draw it the
same way); his file is not changed by it. Every picture of this release is in look D. My first in-game run also took him
lit and half-lit beside it, as a question. His answer made that moot: no choice was put, and those pictures are not kept.

## What was left, measured in look D

v24.51's pictures were lit. In look D his skin shows the texture's own colour, light or shade. Any robe white inside a
skin triangle shows as white. At his right armpit with the arm raised, three kinds were left
(`tools/probes/phoid.mjs --frame=joint:RightArm:0.36`, each triangle's texels and arm shares read):
1. Triangles at the robe's edge holding the robe's white and skin both. Their corners ride the arm by different amounts,
   so they stretch with the arm into white teeth.
2. The robe's white printed onto his upper arm where the robe touched it in the scan: the arm's own triangles holding
   robe-white texels.
3. After the last step's thinning to 30 % of the triangles: new triangles of the first kind. The thinning merges robe and
   skin points into them (a build left at all 560,428 triangles has none).

## The tries (each photographed close at four raised-arm moments, front and from his right, look D at the game's 1.42)

40–41. Painting at a first width (armfree EDGEPAINT 0.30, ARMPAINT 0.25): 28 edge triangles within 30 cm of his shoulder
    joint and 83 on his arm within 25 cm, drawn in the skin beside them. 41 added v24.51's web limits (JOINWEB, JOINFAR).
42. The edge rule to 35 cm, and a triangle counted as stretching once its corners' arm shares differ by 0.015 (EDGEDIFF):
    60 and 64 triangles. Clean before the thinning; a few came back after it.
43–46. More skin held at the robe's weights (4 or 5 rings), or a wider web (JOINARM): the thinning still made 1 to 4 such
    triangles. Left.
47. **Shipped**: 42's settings, and the same rule run again AFTER the thinning (prepmonk STRETCHPAINT 0.35). It caught 37
    triangles within 35 cm of the shoulder joint that stretch with his right arm and hold any of the robe's white, and drew
    them in the skin beside them.

## The check

- Close, in look D at the game's exposure, v24.51 against the new file:
  - the four raised-arm moments, front and from his right (`shots/pho-right-armpit-lookD-before-after.jpg`): the white
    teeth under the arm and the robe's white on his upper arm are gone;
  - talking with his arm down (`shots/pho-talking-lookD-before-after.jpg`): the white flecks at the armpit are gone; a
    faint pale line is left where the robe's edge meets the arm.
- All 19 takes, four moments, front and from his right, in look D, against v24.51: nothing else changed that the eye can
  see. The pixel compare shows the same whole-body shading noise as v24.51's (the thinning is redone), and the floor lines
  (the framing follows his posed size).
- Before the thinning, against v24.51's step-7 file (scratch `local.mjs`, `uvlocal.mjs`): no point moved, no weight
  changed, no triangle added or taken out; the paint changed on 124 triangles, all 4 to 22 cm from his right shoulder
  joint.
- The recipe's two steps, run twice, make the same file byte for byte: `assets/pho.glb` 8,667,256 bytes, sha1 82dceadf
  (v24.51: 8f3e440b, 8,659,908 bytes); 560,428 -> 168,128 triangles; 19 takes.
- The new settings change nothing unless set: armfree and prepmonk with v24.51's settings make v24.51's files byte for
  byte (step 7 d99a5f0e, final 8f3e440b).
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## How he looks in the game

`tools/probes/phoingame.mjs` (new) boots the real game on a phone (390 × 844 at 2×, touch) and plays into a chapter's
world. It stands his file in the live scene at the player's eye, with:
- the game's own renderer, ACES tone mapping at 1.42, lights, fog and sky;
- look D patched on as chapter 3 will;
- the player's hands hidden (HANDS=0), as a film shows him.

Episode 4 chapter 3 is not built, so two worlds stand in for its light:
- episode 3 chapter 1's temple in daylight;
- episode 4 chapter 1's evening yard, his unlit skin at 0.75 of its colour. Look D's unlit share follows the scene's light
  (v24.46), and chapter 3 sets its own.

`shots/pho-in-game-lookD.jpg` shows five shots in each: far, near, close on his face, a cast with his right arm up, and the
chair sit's cheer (no chair is placed: the probe stands only him in the world, so he sits on air). His face and skin keep
the scan's own colour while the robe takes the scene's light, which is what D is. At the close shot with his arm down,
the faint pale line at the robe's edge under his right arm shows.

## Left, and said

- The faint pale line where the robe's edge meets his right arm, seen close with the arm down.
- From v24.51, still:
  - in the chair sit seen from his right, arm up, a small skin-coloured patch on the robe (the web's lowest part);
  - two hairline seams in the web from behind in cast 6;
  - the orange dots painted in his robe's texture (as delivered).
- The scan's own dark crease lines painted on the robe (as delivered).
- Waiting on his choice, as before: his hands in the floor sit.

## Files

- `tools/armfree.mjs`: EDGEPAINT, ARMPAINT, EDGEDIFF; JOINARM (tried, not in the recipe).
- `tools/prepmonk.mjs`: STRETCHPAINT (with STRETCHJOINT, STRETCHBONES, STRETCHDIFF).
- `tools/probes/phoingame.mjs`: new.
- `assets/pho.glb`: rebuilt by the recipe.
