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
- **Step 2: the right armpit (fault 1).** Measured: the trunk's re-bind (v24.40) ends at SKINARM, 6 cm off an arm's axis;
  inside it his file's weights (his right upper arm's skin rides the arm), outside it the envelope's (the spine) — a step,
  so the skin and the chest wrap's edge at his right armpit tore into a notch with strands of the wrap across it
  whenever the arm moved (15x at mage_soell_cast_6 1.61 s, his own file 4x there). tools/robeskin.mjs ARMBLEND=w fades
  the envelope in over the w metres past SKINARM for every point nearest his right upper arm, so the arm's share falls
  off gradually down his side. 6 and 10 cm photographed at the casts' worst moments (shots/pho-armpit-cast4.jpg:
  v24.45, 6 cm, 10 cm): 10 cm clears most of the skin strands under the raised arm, 6 cm half of them. The trunk measure
  (rigstrain, every take): as v24.45 within 0.01 everywhere but the cast whose arm sweeps across (mage_soell_cast_4 at
  0.9 s: the back's 1st percentile 0.83 → 0.74; cast 6 0.87 → 0.80), and the arms' squashed edges up 0.3–0.5 % in most
  takes: all of it the fold under his right arm (354 more points under 0.75 there, rest x −0.19..−0.08, y 1.08–1.35),
  the very cloth that now goes with the arm, and not seen in the lit photographs from four angles at that moment.
  Taken: 10 cm. Unset, the robe file byte for byte.
- **Step 3: the hem cut free (fault 2, his word).** tools/robeskin.mjs HEMRING=0: the robe's underside within 4 rings of
  the shins' skin no longer rides the nearer shin (that was the gradual join; with the hem cut there is nothing to join)
  — unset, the same file byte for byte (re-made: sha1 d8b323f5 both times). New tools/hemcut.mjs, run on the robe file
  before prepmonk: every triangle joining a point that rides the skirt to one that rides a lower leg (405 with
  HEMRING=0) is taken out and every opening closed by a cap — the robe's two underside openings riding the robe, each
  shin's cut top riding the shin bone alone, two specks; each cap ONE texel (a shin's the median skin colour 2–6 cm
  below its cut, rgb 219,159,118 and 220,160,119; the robe's white), because the first caps, textured from their own
  edge points, smeared the atlas between them into white and grey stripes. Every point that existed keeps every
  attribute; 432 points and 383 triangles added; nothing joins robe to shin after it (counted). Tried and left: the shin
  carried 6 cm up before its cap (stripes, and the shin through the robe's front and back walking and sitting); the
  joining band remade in skin colour, four layers blended shin to robe (it stretched into flat webs of skin when he
  runs). Photographed in seven takes against v24.45 (shots/pho-hem-walking-lunge.jpg, -running.jpg, -sits.jpg): walking's
  strips at the trailing shin gone, the grey sheets round his shins seated gone, the lunge's grey band less. What it
  cannot do: when he runs, a heel kicked up behind him shows his lower leg ending where the robe once closed on it
  (mid-shin, a skin-coloured end) — his scan has no leg above that, and the robe there does not reach over the calf.
