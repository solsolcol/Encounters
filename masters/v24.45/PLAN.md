# v24.45 · Grandmaster Pho's drape — a hanging-cloth rig (the plan, written before the work)

Chad, 4 Nov 2026 (answering the v24.44 report, which put the drape's rig to him): *"Go ahead with the hanging-cloth rig
for the drape"*

## What is being fixed (from v24.43 and v24.44's reviews, and docs/OPEN-ITEMS.md item 9)
The LOOSE drape on his left upper arm — the cloth 13–22 cm off the arm's axis — stands off the arm as a stiff shell, wing,
shelf or cone in nearly every take, the forearm coming out of it; from his left side it adds a bump at the shoulder that
reads as a hump. No skin weight can fix it (v24.43, measured): bound to the arm, the loose cloth swings into his torso
when the arm moves (his file's fault, the torso distortion Chad first reported); bound to the chest, it stays where the
arm was in the bind pose (arms 31° out from his sides), a shell. A hanging cloth needs bones of its own, like the robe's
chains (v24.40–v24.41: twelve three-bone chains, their turn baked into every take).

## The plan
1. MEASURE the drape on his file, in the bind pose: which cloth it is (the points, by distance from the left upper arm's
   axis, along the arm, round it, and from the spine), where it hangs from (the line it is attached along), where its
   free edge is, how it joins the rest of the robe and the arm (its topology), and how each take moves it now
   (v24.44's file). Photograph it painted, from every side.
2. DESIGN the rig before building it: how many chains, where each roots and ends, how many bones, which bone carries
   the roots; how a drape point takes its weights (between two chains, along a chain, faded into the arm's and the
   shoulder's own weights where it is attached, so nothing tears); the per-take rule (hang under gravity from the root,
   pushed out of the upper arm, the forearm and the torso; a smooth sheet — neighbouring chains alike); the rest pose
   must bake to no turn at all.
3. BUILD it in tools/robeskin.mjs behind its own option (unset: nothing changes, every other take and part byte for byte
   as v24.44).
4. PROVE it: the rest pose bakes to 0.000°; nothing outside the drape moves (every skinned point off the drape 0.00 cm
   against v24.44, every take); the trunk measure unchanged; the drape's points measured against the arm and the torso
   (none inside them) and against each other (no tearing); photographed — every take from every side, his file /
   v24.44 / the new file — and one blind reader.
5. Recipe masters/v24.45/make.sh (byte for byte), docs, commit, report to Chad with the pictures.

## Progress
- **Step 1 done, the drape measured** (his file's bind pose, painted and photographed from every side; the session's
  scratch drape/). The shawl over his left shoulder is ONE sheet in four parts: a SLEEVE on the upper arm (within 10 cm
  of the arm's axis), a BAND behind the arm (10–16 cm off it, ~19,000 positions), a panel on his SHOULDER BLADE, and a
  WEB hanging from the back of the sleeve to the waist, tucked under the belt (so not a free hang: it is held at both
  ends). Posed in the faulty moments (walking 0.6/0.8 s, talking 2.3 s, mage_soell_cast 0.5 s, Charged_Spell_Cast_1
  1.8 s, Sit_Cheer 1.1 s), his file against v24.44: in his file the band rides the arm (the sleeve reads as a sleeve,
  but the web and the blade panel are dragged across his back: the torso distortion Chad first reported); in v24.44 the
  BAND balloons into the smooth shell behind the arm in every one of them, the web hanging flat below it.
- **The measured why of the shell:** his upper arm is TWISTED about its own axis by 30–50° in most takes (relative to
  his chest: walking 46° at every frame, 40–53; talking with a hand on his hip 43° with the arm itself barely moved,
  7°; Sitting_Answering_Questions 52°; the floor sit 41°; Charged_Spell_Cast to −117°). Cloth 10–16 cm off the arm's
  axis is carried 8–14 cm round the arm by that twist, while the blade and web it joins stay on the back: the band
  between them balloons. The robe's legs had the same disease (v24.41: "cloth lying over a thigh does not turn with the
  femur") and the same cure: cloth follows a limb's SWING, never its twist. (The arm's twist stays in the skeleton: it
  sets the plane his elbow bends in; only the cloth stops following it.)
- **The design:**
  1. A SLEEVE BONE (DrapeArm): a child of his left shoulder at the arm's joint (the arm's offset there is constant in
     every take: 0.000 mm), turned each key by the arm's SWING alone — the turn that takes the arm's rest direction,
     carried by the shoulder, to where the arm points now. The shawl's share that followed the upper arm (the sleeve,
     the band, the cloth over the shoulder top) follows this bone instead; at the sleeve's hem the share moves over
     ring by ring from the arm's skin (RING), so the hem still grips the arm.
  2. THE WEB, if the pictures still need it after 1: chains hung from the sleeve bone, pushed out of the torso (its own
     measured cross-section per height, carried by the spine) and the arm, faded into the waist where it is tucked.
  3. Proven as planned (rest 0.000°; every point off the shawl 0.00 cm against v24.44; the trunk measure; the skin
     through the sleeve; photographs of every take; a blind reader).
- **Step 2a built and measured: the sleeve bone alone is not enough.** DrapeArm (the arm's swing, no twist) carries the
  shawl's arm share; baked (the session's p15): the rest pose 0.000°, and the shawl's strain (a new measure: every edge
  of each region posed against its rest length, every take at 5 fps, the share past 1.4x) barely moves — the band
  walking 31.1 % → 32.1 %, talking with a hand on the hip 30.4 → 23.6. His own file's band: 10–26 %. So the twist was
  not the main cause. The band's stretch is the band being shared between the arm and the back: a fixed blend of the
  two can only stretch across the gap between them (LBS cannot slide cloth), and drawn smooth and stretched it reads as
  the shell. The pictures show where real cloth would go instead: the shawl below the sleeve is a SIDE PANEL hanging
  from the underside and back of the arm down his whole left side, front-side to back, to the belt (slices of the bind
  pose at 1.32, 1.24, 1.16, 1.08 and 1.00 m: the cloth wraps the arm, then hangs round the torso's side under it).
- **The design, revised (DRAPE=2, the cape):** that side panel and the band above it become a CAPE of chains round his
  left side, laid out like the robe's skirt (by angle round the torso's axis, three bones each): rooted on the sleeve
  bone (the cloth hangs from the arm), hanging down to the belt, each bone carried by the trunk's turn (the panel rests
  on his side, so it tilts with him) and pushed out of his torso (never nearer its axis, in the trunk's own frame, than
  it hung at rest). Points between two chains take both by angle, along a chain the bones by height; faded into the
  sleeve at the top, into the trunk's own weights at the belt and at both ends of the arc (the chest's diagonal in
  front, the shoulder-blade panel behind). The sleeve rides DrapeArm. Rest bakes to no turn; every point off the cape
  and the sleeve must skin exactly as v24.44.
- **Step 2b: THE BAND rides the sleeve where it stands off his body (DRAPE=2).** Posed slices (walking 0.8 s; the
  session's drape/ps-walk08*.jpg) showed the shell exactly: v24.44's band smeared across the whole gap between the arm
  and his back, each point a different share of the two; his own file keeps it packed on the sleeve. So the shawl near
  the arm rides the sleeve bone as one piece wherever it stands off his body (its height above the body's own inner
  surface round the torso's axis, per 10° and 2 cm), handing over to the trunk where it lies on him. Baked (p16): the
  rest 0.000°; photographed in the faulty moments — the SHELL AND THE HUMP ARE GONE in walking (the band hugs the
  sleeve as in his file), but the handover (3–7 cm off the body: a narrow ramp) leaves stretched strips and a pleat at
  the back of the sleeve's foot, and in Charged_Spell_Cast_1 the web below the raised arm streaks. The sleeve's strain
  halves (walking 7.6 → 5.0 %); the band's and the web's do not move much, the blade's grows (4 → 18 %): the stretch
  is relocated, as it must be (skinning cannot slide cloth), so the question is only where it is least seen. Next:
  wider, smoother handovers (p17: 2–12 cm, 30 passes; p18: 0–8 cm, 60 passes).
