# v24.46 · Grandmaster Pho: the rest of his faults, and an unlit look — the plan and the log

Prepared, not a build: Pho is not cast until episode 4 chapter 3; nothing is deployed and the live build stays v24.40.
Builds on masters/v24.45 (read its make.sh and PLAN.md first).

## Chad's words (4 Nov 2026, answering the v24.45 report), verbatim

> Fix the rest of the issues with grandmaster pho's model. Is it also possible to run him in unlit mode, or unlit just
> only for his face? I find unlit mode to be more accurate to how he really looks like

Taken as his yes to the one change the v24.45 report put to him: cutting the robe's hem free of his shins (a change to
his mesh as prepared; his own file in masters/v24.39/src stays as delivered).

## The faults still open (from v24.45's two blind reviews, the session's rev45/work/notes.md and rev45b/work/notes.md,
## and the v24.41–v24.44 reviews), each to be measured to its cause before anything moves

1. The right armpit: a jagged skin notch or flap with thin white strands of the chest wrap stretched into it, in most
   takes (a regression against his file in the arms-down takes, where his file is clean); skin-coloured shards there
   when the right arm rises (mage_soell_cast_4).
2. The hem joined to his shins (a ring of 562 triangles): strips and spikes whenever a leg leaves the robe, the walking
   hem's grey band at the trailing shin, the ring of strips seen from below.
3. The drape below his left elbow: a stiff flat panel in the arms-down and seated poses (Sit_to_Stand 4.32 s,
   Sit_Cheer 1.87 s, Charged_Spell_Cast 0.8 s); white shards still at the elbow in Talk_with_Hands_Open 1.19 s from his
   left; the drape's corner standing up above his left shoulder like a collar (the hand on the hip, casts 6 and 7, the
   seated answer); horizontal pinch streaks on its outer lobe.
4. A thin dark crack line across his bare right shoulder blade in the casts (mage_soell_cast, casts 5, 7, 8; a hard
   colour seam there in running), and a black slit along the right side of his waist from behind (casts 5, mage).
5. The cross-legged sit's lap: thin blades with dark bands over the knees, an upright fin by the right thigh, angular
   panels from above, a flat sheet jutting from his right hip at the back.
6. Sit_to_Stand 1.85 s: a large dark grey shading stain over his chest under the necklace, grey patches on his left
   shoulder; grey square patches on the drape in a few takes.
7. Smaller: black slits by his neck seen from above; black dots and specks; comb-like streaks in the deep folds; the
   necklace's end showing under the drape (running).

## The unlit question

To answer with pictures: his look as lit now, fully unlit (the scan's colour as captured), unlit only on his face, and
a blend; in daylight and in a dim room, because an unlit model ignores the scene's light. How the game would do each,
what it costs, and a recommendation; the choice is his.

## The log
- **Step 1: the looks, photographed (answering his question).** Chad sent a photograph of the real Grandmaster Pho mid-way
  (kept as masters/v24.46/ref/pho-real-chad-2026-11-04.jpg, sha1 61e23df5, 1152 x 2048: seated before his altar, tan skin,
  white robe, a dark mala and a gold-and-ivory necklace with an amulet). tools/clipsheet.mjs gains --look, --light and
  --exposure (unset, the same picture byte for byte: proven on a whole take, 0 bytes differ). Found on the way: the game
  tone-maps every model (ACES at exposure 1.42), and an unlit colour put through that curve comes out far paler than the
  scan (linear 0.3 → 0.50: skin sRGB 0.58 → 0.73), so "unlit as he looks" means laying the scan's colour on AFTER the
  tone mapping (@raw). Photographed in the game's exposure, beside his photo (shots/pho-look-face.jpg, -body.jpg):
  A lit (as now: his face greyer and harsher, deep shadows in the eyes and creases); B all unlit (his skin the warm tan
  of the photo, but the white robe a flat shape with no folds); C unlit face only (the face right — measured, the same
  pixels as B — but his bare shoulder and arms lit and paler beside it); D his skin and necklaces unlit, the robe lit
  (chosen by the texel's own saturation, so no change to his file: the robe keeps its folds, the skin is the photo's).
  In a dim room (shots/pho-look-dim-room.jpg) an unlit model ignores the room's lights and glows; D's unlit share is
  scaled to the scene's light level, which a chapter sets. Recommended D; sent to Chad to pick (A–D). Nothing in his file
  changes for any of them: the look is a material patch applied when chapter 3 casts him.
