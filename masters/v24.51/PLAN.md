# v24.51 · Grandmaster Pho: the robe's edge at his right armpit clean, and nothing floating

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.51/make.sh`. Tool:
`tools/armfree.mjs` (new settings). Pictures: `masters/v24.51/shots/`.

## Chad's words (8 Nov 2026, verbatim)

- "Fix the jagged part, and there are some floating pieces that needs fixing"

His words of 7 Nov still stand for this work: "Dont spawn reviewers", "Be efficient".

## What they were, measured

- **The jagged part** (left and said at v24.50): with his right arm up, the robe's top edge under the armpit drawn up into
  white teeth. `tools/probes/phoid.mjs` on v24.50's file (`--frame=joint:RightArm:0.36`, new here): the teeth are
  triangles at the robe's edge stretched 6 to 8 times, their points riding the arm by 0.11 to 0.42, after armfree had
  taken every bit of the arm's share out of the robe. The cause: `tools/prepmonk.mjs` smooths every weight (24 passes)
  AFTER armfree ran, and carried the arm's share back from the armpit's skin into 2,864 points of the freed robe (313 of
  them at 0.05 or more), blurring any hold put on the skin beside it. That is why v24.50's tries 12 to 14 changed nothing.
- **The floating pieces:**
  1. Charged cast, front: a flap hanging under the arm. Two of v24.50's cut openings ran along the robe's edge and the
     arm's both (one rim: 54 points of robe, 54 of arm). Closed by one fan whose middle rode half the trunk and half the
     arm, it hung as a flap.
  2. Cast 6, from behind: a thread off his side. One triangle stretched 60 times, between skin held at the robe's weights
     (none of the arm) and skin riding the arm by 0.55.
  3. Seven loose bits of his scan, 1 to 9 triangles each and joined to nothing (7 to 14 mm; three at the small of his
     back, three at his left drape, one at his right shoulder). They are in his delivered file too.
- **Not floating:** the orange dots on his lower back are skin colour painted into his scan's robe texture, on the robe's
  own triangles (the texture read under every triangle there). Left as delivered.

## The tries (each photographed close at four raised-arm moments, front and from his right)

16. The smoothing moved into armfree, before the re-tie (DIFFUSE), alone: teeth unchanged.
17–18. + the skin beside the robe held at the robe's weights for 2 or 3 rings, then eased (SKINRING): teeth gone; the
    flap and the thread stayed.
19–21. + each opening's two lips capped apart: the arm's lip, a long open chain, capped into big skin flaps. Left.
22–24. + the mixed openings left open (CAPSLIT none): the gap between robe and arm showed the inside of him. Left.
25. **Shipped**: the 333 joining triangles KEPT and drawn in his arm's skin (JOINSKIN): one even web of skin from the
    robe's edge up to the arm, as an armpit; no flap, no thread. The skin beside the robe blended between robe and arm
    (SKINFILL 8 rings, held 2, never beside the arm's own skin, SKINMAX 0.5). The loose bits taken out (DROPBITS 12).
26–27. The same with the ring hold, or a wider blend: the same look.
28–30, 34–35. The web only near the armpit, the joins further than 8 to 16.5 cm from his shoulder joint cut (JOINWEB):
    the rest of the web came apart into threads (a sliver under the arm in the Charged cast). Left.
31–33. The far joins made to ride the arm instead (JOINFAR): white strips back at the robe's edge, shards under the arm
    in the Charged cast. Left.

## The check

- The four moments close, front and from his right, v24.50 against the new file:
  `shots/pho-right-armpit-before-after.jpg`.
- All 19 takes, four moments, front and from his right, against v24.50: nothing else changed that the eye can see. A
  pixel compare shows faint shading changes over the whole body and the floor lines. This is because the final thinning
  to 30 % of the triangles is redone whenever the triangle count changes; no shape moved.
- Before the thinning, against v24.50's step-7 file smoothed as prepmonk smoothed it (scratch `local.mjs`):
  - no point moved;
  - weights changed at 6,918 positions, all 6.5 to 31 cm from his right shoulder joint;
  - triangles changed only round the right arm, plus the seven loose bits.
- The recipe's two steps, run twice, make the same file byte for byte: `assets/pho.glb` 8,659,908 bytes, sha1 8f3e440b
  (v24.50: 7f9e098e, 8,661,548 bytes); 560,428 -> 168,127 triangles; 19 takes.
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## Left, and said

- In the chair sit seen from his right, arm up, the lowest part of the web shows as a small skin-coloured patch on the
  robe. His scan pressed the arm to his side down to near the elbow, and the joins that far down stretch the most.
  Cutting them instead breaks the web into threads.
- Two hairline seams in the web on his right side, seen from behind in cast 6 (1 to 2 pixels at this size).
- The orange dots on his lower back (painted in his robe's texture).
- From the first list of 7 Nov, not touched here (as v24.50 said):
  - feet 2 to 5 cm into the floor or above it in 16 takes (his file's);
  - the floor sit's lap and hidden hands;
  - the lump over his left shoulder;
  - the lower robe billowing in the turning casts;
  - black scribbles along the robe's folds;
  - no chair under the chair sits;
  - moves unlike their names.
