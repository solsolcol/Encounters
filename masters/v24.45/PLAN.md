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
- **Step 2c: photographed with his texture; two more causes found and cured.** The region paint exaggerates; the real
  look decides. Textured, at the faulty moments (his file / v24.44 / p17 / p18): the DRAPE=2 band hugs the arm in
  walking (no wing), but stretched strips hang under a raised arm (Charged_Spell_Cast_1 1.8 s) with a skin-coloured gap at
  his left hip, and a stiff flap stands out at the hip talking. (A first photograph of p17/p18 came out blank: the
  session's disk was full, 23 MB left, and the browser could not draw — old scratch snapshots cleared, 6.6 GB free.)
  Two measured causes of strips: (1) THE FOUR-WEIGHT CUT — a point keeps its four largest bone shares, and the band
  added a fifth and sixth: 9,800 points of his left upper body lost more than 2 % of their weight to the cut (1,157 more
  than 10 %), against 2,600 in v24.44, and two neighbours cut differently move apart. DRAPEMERGE=1 gives each lost share
  to the kept bone nearest it at rest (the sleeve bone and the arm, two spine joints, move nearly as one): 30 points left
  over 2 %. (2) THE SCAN'S FOLDS — the share was set per point by its height off his body, so a fold's crest and trough,
  2–3 cm apart, took different shares; mesh smoothing reaches only ~2 cm in 30 passes (the scan's edges are 5.5 mm).
  BANDSIG smooths the field in space first (a Gaussian, 3 or 5 cm). Photographed (v24.44 / p17 / p19 merge / p20 merge +
  3 cm / p21 merge + 5 cm): p21 hangs in folds from the shoulder in walking, talking, mage_soell_cast and the seated
  cheer — clearly better than v24.44's wing in each — but in Charged_Spell_Cast_1 the robe's top edge on his upper back
  was dragged and the bare skin beside it stretched. Measured against v24.44 point by point (drape/drapecmp.mjs): points
  OFF the shawl moved up to 8.4 cm walking and 11.5 cm in that cast (5,700–7,700 points over 2 mm), the worst on his
  upper back by the spine (rest −0.04, 1.36, −0.14), 24 cm from the arm's axis but inside the band's 30 cm reach, and
  "off his body" by the inner-surface test there. So THE REACH (DRAPEREACH, BANDSPINE): only cloth near the arm and nearer
  it than the spine may follow the sleeve bone, the sleeve's share and the band's alike, the band held inside it again
  after smoothing; every other point keeps v24.44's weights exactly (to be proven 0.00 cm). Next: p22 (24 cm, 4 cm)
  and p23 (30 cm, 6 cm).
- **Step 2d: the reach, proven; and the band made to HANG.** p22 (reach 24 cm, the spine margin 4 cm) and p23 (30 cm,
  6 cm): the robe's top edge on his back stays where v24.44 has it in the raised-arm cast, and walking, talking, the cast
  and the cheer keep p21's look. Measured against v24.44 (drapecmp): off the shawl at most 0.19 cm walking, 0.17 talking,
  0.36 in Charged_Spell_Cast_1 (the drape's own fading edge at his back, region "other"), against 8–11 cm in p21. The
  four-weight cut outside the reach is v24.44's exactly (2,595 points over 2 %, as before; inside it, none). What still
  fails: under the raised arm in Charged_Spell_Cast_1 the band's lower part is torn into streaks from the arm to his hip,
  the scan's fold crevices (baked brown into its texture) opening like skin. Photographed by region: the band rides the
  arm's swing, so an arm raised forward carries the cloth that hangs BEHIND it up onto its top, and its lower edge is
  stretched 35 cm to the robe at the hip. Real cloth hanging from an arm swings round it to hang below. So DRAPEHANG: the
  band rides a bone of its own (DrapeHang), the sleeve bone's turn then a turn about the arm's own axis toward the side
  gravity hangs it at rest (its rest angle to "down" round the arm kept, so rest is rest: 0.000°), at most HANGMAX,
  continuous from key to key. First bakes (p24 half, p25 full, fading in from an arm 3° off vertical): it turns the band
  up to 48° round the arm while WALKING — near vertical, "below the arm" swings round it as the arm passes forward and
  back — so the hang should start only once the arm is clearly raised (HANGL0/HANGLW: the sine of the arm's angle off
  vertical; at rest it is 0.51). p26 (from 0.60 over 0.25) and p27 (from 0.55 over 0.30, at most 90°) bake next.
- **Step 2e: the hang, tuned.** Photographed (v24.44 / p22 no hang / p24 half / p25 full from 3° off vertical): with the
  full hang the cloth under the arm raised forward (Charged_Spell_Cast_1 1.8 s) falls from the arm as one smooth curtain —
  no streaks, no brown crevices, cleaner than v24.44's flap; half a hang leaves streaks. But walking it turned the band
  up to 48° round the arm and bulged it. Started only once the arm is clearly raised (p26: from sin 0.60 over 0.25, at
  most 60°; p27: from 0.55 over 0.30, at most 90°), walking, talking, the cheer and the hand on the hip take no hang at
  all (0–2°) and keep p22's look, while the casts, the slash, the shout and running hang (16–86°). p26 proven against
  v24.44 in all nineteen takes: every point outside his left upper body's cloth 0.000 mm (not one moved); the rest of
  that cloth, the drape's own fading edge, at most 0.6 cm (mage_soell_cast_3). Its shawl strain (edges past 1.4×): the
  sleeve lower than v24.44 in every take (walking 5.7 % against 7.4), the shoulder-blade panel back to v24.44's (the
  reach), the band and web higher in the casts (the stretch moved off the shell and spread down the curtain, where the
  photographs show it smooth): a share past a threshold says where cloth stretches, not whether it reads as cloth.
  Next: the sword slash, mage_soell_cast_7, running and the shout (where 60° and 90° differ) photographed to choose.
- **Step 2f: chosen, p27.** The two hang limits photographed where they differ (the sword slash at three moments,
  mage_soell_cast_7 at three, running at two, the seated shout at two; v24.44 / p26 / p27): both replace v24.44's
  stretched shell and wing under a raised arm with a curtain hanging from it; 90° (p27) a little smoother in the shout,
  running's back-swung arm and the charged cast; neither tears or passes through him anywhere photographed. p27:
  DRAPE=2 BANDO0=0.02 BANDOW=0.10 BANDPASS=30 BANDSIG=0.05 DRAPEMERGE=1 DRAPEREACH=0.24 BANDSPINE=0.04 DRAPEHANG=1
  HANGL0=0.55 HANGLW=0.30 HANGMAX=90; the band's turn round the arm per take: walking 2°, talking 0°, the hand on the hip
  1°, the cheer 0°, the casts 9–79°, the slash 86°, running 41°, the shout 31°. Also measured, and dropped: whether the
  arm's skin shows through the sleeve now that the sleeve no longer follows the arm's twist — there is no skin under the
  sleeve to show (the scan's sleeve is the surface; not one skin point within 9 cm of the arm's axis has sleeve cloth
  outside it), so the brown flecks in some photographs are the texture's own fold crevices. Next: every take, three
  versions (his file / v24.44 / p27, the last two shuffled per take), to a blind reader.
- **Step 3: the recipe, and its proofs.** masters/v24.45/make.sh run (untouched while it ran: sha1 before and after
  1701d8cc). Its robe file (masters/v24.39/prep/pho_robe12.glb) is byte for byte the p27 bake made separately before it
  (sha1 e7030f82 both): the bake repeats exactly. assets/pho.glb: 6,851,452 bytes (sha1 12421533), 177,772 triangles as
  v24.44, 67 joints (v24.44's 65, DrapeArm and DrapeHang, both animated in all nineteen takes). Against v24.44 (p27, the
  same file, drapecmp, every take at 5 fps): every point outside his left upper body's cloth 0.000 mm, not one moved, in
  all nineteen; the drape's own fading edge at most 0.60 cm (mage_soell_cast_3; walking 0.19, talking 0.17). Both new
  bones bake their rest pose to 0.000°. Every take photographed in three versions (his file / v24.44 / p27, the last two
  shuffled per take by a sha1 of the take's name, the key outside the reader's folder) for a blind reader.
  assets/pho.glb re-made by a second packing of the same robe file: byte for byte (sha1 12421533 both). The trunk
  (tools/rigstrain.mjs, every take at 10 fps, against v24.44's file measured the same way): unchanged in thirteen takes;
  in Charged_Spell_Cast_1, Talk_with_Hands_Open, Sit_to_Stand, mage_soell_cast_3 and _5 more of what it calls the back
  under 0.75 of its rest distance from the spine (worst 1.8 % against 0.3 %, Charged_Spell_Cast_1 0.9 s). Painted by
  the measure and photographed at the two worst moments (rigstrain --heat; the session's rev45/heat/heat4.jpg): the new
  red is in the drape's own folds hanging under his arm — cloth that sits nearer the spine than the arm, now hanging —
  and the only red on his body itself, by his right shoulder blade, is the same in both files. The torso is as v24.44.
  Before and after for Chad (his file / v24.44 / v24.45): masters/v24.45/shots/pho-drape-arm-down.jpg (walking 0.8 s,
  talking with hands open 2.3 s) and pho-drape-arm-raised.jpg (Charged_Spell_Cast_1 1.8 s, mage_soell_cast 0.5 s).
