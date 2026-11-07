# v24.50 · Grandmaster Pho: the robe freed from the underside of his right arm

Prepared, not a build: nothing deployed, the live build stays v24.40. Recipe: `masters/v24.50/make.sh`. Tool:
`tools/armfree.mjs`. Pictures: `masters/v24.50/shots/`.

## Chad's words (7 Nov 2026, verbatim)

- "Do you see any problems with any of the animations? I already see some , im testing you. Dont spawn reviewers"
- "Why is there even a need to compare to the original"
- "So until now you still dont get the real issue. The robe is like attached to the underside of the arm. Do you know what i mean"
- "Its the other arm , why can't you see it even after telling you? There is something seriously wrong with you"
- "Do it, go"
- "Be efficient"

My first list named the faults I could see (feet off the floor, the floor sit's lap, a lump over his LEFT arm, the robe
billowing, black scribbles, skin dots, sitting on nothing, moves that do not match their names) and missed his. Told "the
robe is attached to the underside of the arm", I painted what moves with his LEFT arm, where my last work had been. It
was his RIGHT arm.

## The fault, measured

Painted by bone (the robe moving with his right arm in red, `tools/clipsheet.mjs --look='bone:Right(Arm|ForeArm|Hand)$@raw'`,
new at v24.50): whenever he lifts his right arm (the chair sit's cheer, the casts, the sword slash, both Charged casts,
cast_8, answering questions), the robe under his right armpit is dragged up the underside of the arm, white shards along
it to the elbow. `REPORT=1 node tools/armfree.mjs masters/v24.49/prep/pho_cloth.glb`: his scan hangs the arm 62° below
level, the robe's edge under the armpit touching it, and the rig gave that robe the arm's weights — 6–8 cm off the arm's
line 0.86 of the arm, 8–10 cm 0.65, 10–12 0.41, 12–14 0.18 (v24.46's ARMBLEND fade over his file's weights): 12,347
points of robe.

## The tries (each photographed close at four raised-arm moments, front and from his right)

1. The robe re-tied to his trunk (the arm's share taken out; where little was left, the trunk's weights carried in from
   the robe around). The robe stays on his chest; white and skin streaks where the robe's edge joins skin that rides the
   arm, when the arm is straight up.
2. + the stretch moved into a band of armpit skin (SKINRING 10): a sheet of skin under the arm. Left.
3. + the joining triangles cut out (CUTARM 0.5, 340) and every opening closed by a fan: clean, but a white flap near his
   chin (a fan on the robe's side) and scraps of robe the scan stuck on his arm.
4. Openings sealed by ribbons to the bone line inside: panels floating where the arm had hung (half-tied points). Left.
5. Short lips (1.2 cm in) and CUTARM 0.15: holes along the robe's edge on his back. Left.
6. Lips with CUTARM 0.5: thin strands where an edge's points part. Left.
7–9. Fans, the arm's left open (a dark hole from below), the arm's fan middle moved inside the arm (FANIN); the "fin" left
   was the tip of his nose, his head tilted back.
10. + the scraps of robe stuck on his arm taken out (SPECKCUT, 105 triangles).
11. **Shipped**: CUT, CUTARM 0.5, SPECKCUT, the robe's side left as cut (CAPROBE none: no flap), the arm's openings closed
    by fans with their middle inside the arm.
12–14. The armpit skin next to the robe eased to the robe (held off the arm, SKINMAX), more of it held, the robe untied
    from his shoulder bone too (ROBESHOULDER): no change seen at the edge. Left.

## The check

- Every take, four moments, front and from his right, against v24.49 (`scratchpad` pages, looked at take by take): nothing
  changed but the right armpit; the robe no longer climbs the arm in any take.
- Painted again: no robe moves with his right arm (`shots/pho-right-arm-red-before-after.jpg`).
- Before and after, four moments, front and his right side: `shots/pho-right-arm-before-after.jpg`.
- The recipe's two steps run twice make the same file byte for byte: assets/pho.glb 8,661,548 bytes, sha1 7f9e098e
  (v24.49's ca8c0cc8, 8,666,228); 560,288 -> 168,085 triangles; 19 takes.
- No blind review (Chad: "Dont spawn reviewers", "Be efficient").

## Left, and said

- Where the robe's edge meets the armpit skin, the edge looks jagged when the arm is straight up: the robe's own
  white-to-skin colour edge stretching with the skin. Small next to the robe on the arm; seen in close-ups only.
- From the first list, not touched here: feet 2–5 cm into the floor or above it in 16 takes (his file's animations;
  measured identical to his file in every take but running and the floor sit), the floor sit's lap slab and hidden hands,
  the cloth over his left shoulder swelling into a lump when that arm reaches forward, the lower robe billowing in the
  turning casts, black scribbles along the robe's folds, small skin dots on his back in three takes, no chair under the
  chair sits, and moves that do not match their names (hands framing his face for "hands on mouth", a hand before his
  belly for "hand on hip", a hand at his chin while running, no sword).
