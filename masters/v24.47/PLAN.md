# v24.47 · Grandmaster Pho: real legs under the robe, the hem cut free, and his look — the plan and the log

Prepared, not a build: Pho is not cast until episode 4 chapter 3; nothing is deployed and the live build stays v24.40.
Builds on masters/v24.46 (read its make.sh and PLAN.md first).

## Chad's words (4 Nov 2026), verbatim, in order

> Why is his legs severed? Didnt you see that problem how is it possible you even missed that

(Answered: the severed shins were the hem-cut variant, which was not saved; the saved file's legs are joined to the
robe. Options put to him: 1 keep it joined, 2 real legs under the robe from another character scan and then the cut,
3 a version of his model with legs from whoever made it.)

> Seriously zoom in and look at the mess, its clear you are blind. Option 2 and look D

## What he is right about (measured close up, not from thumbnails)

The saved v24.46 file, walking, his legs photographed at 700 px a view: where the trailing leg leaves the robe, the
robe's underside is stretched into grey and white streaks onto the shin, and the top of the shin itself is smeared
sideways into the hem — at both moments, from both sides. Every pass since v24.40 judged the legs from sheets with the
figure 150–300 px tall. From now on every check of his legs is made close up (the knee and the hem framed at 700 px),
and the blind reader is given close-ups, not thumbnails.

## His picks

- **Look D**: his skin and necklaces unlit (the scan's own colour laid on after the tone mapping, chosen by the texel's
  saturation), the robe lit, the unlit share scaled to the scene's light level. A material patch when episode 4 chapter 3
  casts him (the reference implementation is tools/clipsheet.mjs --look=skin@raw); his file unchanged.
- **Option 2**: real legs under the robe, then the hem cut free, so a leg that leaves the robe shows a whole leg (knee,
  thigh) going up into it — never a stump, never strips.

## The design (to be proven step by step)

- **The donor**: of the game's character scans on a Mixamo leg skeleton, the bare knees and thighs are the admin-tee
  man's (`admintee`: black PT shorts, bare and detailed from mid-thigh down). Lersi Chin's knees are under his tiger
  cloth, the plaid-shorts sitter (`sitman`) is too coarse, the first master and the medium wear long cloth. He lends
  only geometry hidden under the robe and is never seen as himself (Chad, v24.37: never cast him again — said to Chad).
- **Fit**: each donor leg moved from his bind pose onto Pho's by its own skinning — every donor leg bone carried onto
  Pho's (aligned, lengths matched, the limb's girth scaled to Pho's shin at the cut), so the knee lands on Pho's knee.
- **Cut and join**: the donor leg cut at Pho's cut ring (mid-shin) and zipped to Pho's open shin there; the top ends
  under the shorts' hem deep under the robe, capped. Skinned to Pho's own leg bones by the donor's weights.
- **Colour**: the donor's skin texture matched to Pho's shin (median and spread), so the seam at mid-shin does not show.
- **Checks**: the knee and the hem photographed close up in every take that moves a leg (walking, running, the sword
  lunge, the sits, the casts), against v24.46; poke-through of the new knees and thighs through the robe looked for from
  every side; then a blind reader of every take, given close-ups.

## The log
