# v29.0 · episode 5 chapter 1 · CLIP: the two kinds of clipping that had no probe (R15, the tracker's CP9.3a)

Chad, 27 Nov 2026 (R15): "Also check for all kinds of clipping". Of CP9.3a's nine kinds, seven had probes; helper CLIP
made the two missing ones, GENERIC (any chapter, any film key, every phase of play), and proved each by breaking what it
guards. Scope (the coordinator, 27 Nov): the probes are proved on short runs (the throwaway breaks, one real film and one
play phase of this chapter each) and handed to PLAY, FILMS-1 and FILMS-2 for their own sweeps; the final sweep of every
kind is CLIP's at M9 on the release candidate. Nothing in the chapter is fixed here: each finding goes to its owner.

## 1 · The two probes

### tools/probes/lensclip.mjs: (6) THE LENS INSIDE A SOLID
At each moment (a film sought to it, or play with the look set to it), every visible mesh whose bounding sphere comes
near the lens (a person's by its rig's culling sphere, posed on that moment) is gathered in the world as clipscan.mjs
gathers it: each model by its group, each copy of an instanced thing by its matrix, EVERY skinned mesh as posed whatever
its key (no list of names, no chapter's list shape: `stage.dbg.cast` only names them), each merged piece by the corners it
shares. A still thing's world corners are kept between moments. Two tests:
- NEAR: every triangle clipped against the frustum's tip (the pyramid from the eye to the near plane's rectangle:
  `camera.near` 0.08, the lens's angle and shape). `cut`: it reaches the near rectangle, a solid seen sliced open; `past`:
  it stands wholly between the eye and the near plane, so the lens sees past it (through a wall). depth = how far it comes
  in front of the near plane, m.
- INSIDE: seven rays from the eye; inside a thing when 5 of 7 cross it an odd number of times and meet a BACK face first
  (a room round the lens is met on its front faces); a double-sided thing when all 7 are odd and its smallest extent is
  under 1.5 m. depth = the nearest surface, m.
Glows (additive), sprites, points and lines are left out; see-through surfaces (glass) are kept and marked.
Usage (a film with `@phase`, a phase that hands to its film itself with `!`, an ending `end:X`; VIEW=both measures every
film moment at a phone's shape and a desk's from one page):

    ENC_DIST=<snap> CHROMIUM_PATH=/opt/pw-browsers/chromium CH=e5c1 VIEW=both STEP=0.25 \
      FILMS='open,keepsake@room:w,l,p,g,h,k,v!,cord@breaking,home@breaking,end:A,end:B,end:C,end:D' OUT=<dir> \
      sh tools/bslot.sh node tools/probes/lensclip.mjs
    ENC_DIST=<snap> CHROMIUM_PATH=/opt/pw-browsers/chromium CH=e5c1 VIEW=phone|desktop PHASES=room,breaking,night,night:u,ask \
      PITCH='room=-1.05..0.55;breaking=-1.05..0.55;night=-0.9..0.6' WALK=night:u OUT=<dir> sh tools/bslot.sh node tools/probes/lensclip.mjs

In play the yaw's limits are FOUND (the lens turned past them and the chapter's frame left to hold it); the pitch's come
from PITCH (the engine clamps pitch only on input: -1.2..1.2 standing; PLAY.md's kneel -1.05..0.55, the knee in the night
-0.9..0.6). WALK floods the ground he can reach by the engine's own collision (`collideAt`, a 0.1 m grid) and puts the eye
at every edge of it as close to the blocker as the collision lets it go (bisected to 0.1 mm), the look swept there.
PICS='job@t1,t2;play:<phase>@yaw,pitch[,x,z]' photographs moments (DPR=2 for a phone's real picture). Prints each hit as a
span of moments (the object, the kinds, the worst depth and when); writes <OUT>/lensclip-<ch>-<view>.json.

### tools/probes/coplanar.mjs: (8) SURFACES SHARING A PLANE (v19.3)
At each moment every visible surface within R m (14) of the lens is gathered by lensclip's LIB (glows, painted pools of
light and see-through kept: they are depth-tested too). Each triangle is put in the cells of a 0.25 m grid; two triangles
sharing a cell from DIFFERENT objects (or different materials of one object) are a pair when parallel within 1 degree,
facing the same way (or either double-sided), and B laid onto A's plane overlaps A where the planes are within 2 mm: its
area (counted from 10 mm²). A material with a polygon offset or no depth test is `guarded` (counted, not listed). Then,
for each pair, WHETHER IT FIGHTS FROM WHERE THE LENS IS: a 24-bit depth buffer separates, at d m, surfaces about
d²/(near·2²⁴) m apart (0.02 mm at 5 m, 0.7 mm at 30 m with near 0.08), so a pair whose planes are `gmin` apart is safe to
`safeTo` = sqrt(gmin / 2 / that) m and FIGHTS beyond it (gap 0: always); a pair turned away from the lens with both sides
one-sided is `away`; two layers that both write no depth (a painted shadow under a painted glow) cannot fight in depth and
are `order` (drawn in their sorted order). A still thing is indexed once and kept, so each film moment costs its people
and what moved; the people (every skinned mesh, posed) are met in a film only at moments a multiple of BODYSTEP s (2;
BODYSTEP=0 every moment): eight posed bodies cost about 18 s a moment on this box (the cord, run c2), the still things a
fraction of one. Against the still things a body meets only its triangles of BODYMIN m² (4 cm²) and over; its clothes
against its skin, and one body against another, every triangle. Usage as lensclip's (FILMS, PHASES, VIEW, STEP, OUT; and
R, VOX, ANG, DIST, MINAREA, BODYMIN, BODYSTEP):

    ENC_DIST=<snap> CHROMIUM_PATH=/opt/pw-browsers/chromium CH=e5c1 PHASES=room,breaking,night,night:u,ask OUT=<dir> \
      sh tools/bslot.sh node tools/probes/coplanar.mjs

Prints each pair (FIGHTS n/m moments, order, away or safe; the area, the gap, safe to, the nearest the lens came, the
normal, the box and both names); writes <OUT>/coplanar-<ch>-<view>.json. The box is of all the pair's overlaps together
(two objects meeting in several places give one wide box): read the JSON's `box` and photograph at the place.

## 2 · How each was proved (CHECK=1: throwaway things laid into the page's world and taken away; the chapter untouched)

lensclip, on HEAD 5b212b7's chapter (snapshot /home/user/snap-clip), in the cord (VIEW=both, run t1):
- the clean frame: no hit;
- a double-sided wall 3 cm in front of the lens: found, `past` 0.05 m (0.08 near less 0.03);
- a 0.6 m box laid round the eye (outward faces): found, `inside` 0.214 m, 7/7 rays odd and meeting its back faces;
- a 4 x 3 x 4 m room round the eye drawn from inside (BackSide): nothing (its front faces are met: a room is not a solid);
- a wall 0.5 m ahead: nothing;
- on the chapter's OWN surface: the lens carried along its look to 3 cm short of the first real surface it meets (her
  room's merged white piece, 1.276 m ahead), found `past` 0.058 m; put back, the hits as before. PASS.
coplanar, in the room phase (phone, run c1):
- a 1 m quad laid 0.5 mm over her floor under the eye: paired with her floor (area 1.0 m², gap 0.0005);
- the same laid 1 cm over it: no new pair (62 before, 62 with it);
- two quads laid exactly on one another in two materials: paired (0.3 m², gap 0). PASS.
(Both throwaway checks are in the probes as CHECK=1 and print `pass`.)

## 3 · The short runs on this chapter (HEAD 5b212b7's chapter, snapshot /home/user/snap-clip; scratch /home/user/clipscratch)

| run | probe | what | result |
|---|---|---|---|
| t1 | lensclip VIEW=both STEP=1 CHECK=1 | the cord's first 6 s, both shapes | the proofs of §2 PASS; 14 moments, no hit |
| t2 | lensclip VIEW=phone STEP=0.5 | the whole cord (59.4 s) and the room phase | 119 moments, no hit; the room's yaw FOUND held at -1.35..1.05 (PLAY.md's -0.15 ± 1.2, read back from the chapter's own frame), pitch -1.05..0.55, 65 looks, no hit |
| c1 | coplanar VIEW=phone CHECK=1 | the room phase | the proofs of §2 PASS; 196 meshes, 62 pairs before the FIGHTS reading was added (read again in c2) |
| c2 | coplanar VIEW=both STEP=2 | the whole cord, both shapes | 60 moments, 40 pairs: 5 FIGHT from the lens, the rest away, order or safe (below); 18.6 s a moment with 8 posed bodies, hence BODYSTEP |

## 4 · Findings, by owner (leads: each to be photographed at its place and read against the design before anything moves)

Every pair below is a LEAD from the measure (coplanar, run c2, the cord: the lens in her room and on her stair), not yet
seen flicker; the owner photographs it at its place (two frames with the lens moved a little show a depth fight as a
changed pattern) and reads it against the design before anything moves. A box is the pair's overlaps together (x, y, z
from, x, y, z to).

PLAY (the places, b_world.js):
1. HER FRONT WALL'S SILL: the wall's white (`her front wall`, col ffffff) and the window frame's wood (col 5a3a26) in one
   plane at y 0.42, x 2.75..2.77, z -2.2..2.2 (0.064 m², gap 0): the top of the sill by his left as he kneels (2.4 m from
   the cord's lens). FIGHTS at every moment of the cord.
2. HER DOOR'S FRAME IN HER WALL: `her flat` white (ffffff) and dark wood (3a2618) in one plane, normal +z, box x -2.9..-2.75,
   y 0..2.12, z -2.85..-1.9 (0.078 m², gap 0), 3.2 m from the lens; and its copy in the reflection (`refl:Mesh` 21140b
   against a2a2a2, x 8.25..8.4) with it.
3. THE SHOPHOUSE ROW against the REFLECTION's floor: `refl:Mesh` (a2a2a2) and the shophouse row's ece8dc at y 0, x 2.98..3.1,
   z -3..3 (0.72 m², gap 0), just outside her front wall below the sill: likely never seen (behind the wall from inside, and
   facing up, away from the street below): photograph before reading it as one.
4. THE SHOPHOUSE ROW against itself: two of its white materials in one plane facing up, x 0.91..1.15, y -3.85..-0.3, z 3..3.15
   (0.072 m², gap 0), 3.4 m from the lens (the stair's side).
Read and left as designed (v19.3's millimetres): the street's painted pools of light (additive, ff9030) 1 mm over the
shophouse row's ground (safe to 26 m); her flat's white 1 mm over its grey shelf top (safe to 26 m); the takeaway box on its
shelf (1.5 mm); the black painted shadows on the floor and the low table under the candles' warm glow, and the glows over one
another (`order`: neither writes depth, so they cannot fight in depth); the shophouse row's undersides at y -0.3 and her
flat's wall backs (`away`: one-sided and turned from every lens of the cord).
THINGS-3 / CAST (the things and the cast, for their owners to read; each `safe` from the cord's lens, listed because they
are near him): the plate on the low table 0.03..0.7 mm under the candle glow (safe to 4.8 m: from the far side of her room it
would fight); her phone 0.3..1.5 mm over the sofa's seat (safe to 13.6 m); Grandmaster Pho's lap cloth 1.6..2 mm over his
robe (0.17 cm², safe to 32 m); the jug's glass and its water 0.01..0.1 mm apart at its foot (order).
