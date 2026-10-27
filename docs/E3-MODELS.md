# Episode 3 · the models to find

Everything the five chapters need that the game does not already have. Rigged
means it has a skeleton (so it can move); a model with its own animations
(idle, talking, walking, sitting) saves the most work — Mixamo animations can
be added to any humanoid rig afterwards.

**Until a model arrives, the chapter uses a stand-in in the same spot**, so the
chapter is built and playable now, and each model drops in without changing a
scene. Priority ★ = the chapter looks wrong without it.

## Chapter 1 · The Luck I Went Looking For (a Thai temple at dawn, a Sak Yant)
- ★ **The Ajarn** — an older Thai man in white (shirt and trousers), rigged. Seen
  mostly SEATED cross-legged; idle and talking clips if possible.
- ★ **A seated golden Buddha** statue for the altar.
- ★ **Thai temple architecture** — an open pavilion (sala) with a tiered roof, and/or
  a temple building (ubosot) and a temple gate. Even one good building helps.
- ★ **Two or three Thai men**, rigged, casual clothes — waiting devotees and the
  Ajarn's assistants. One SHIRTLESS man, seated (having his tattoo done).
- ★ **A Thai Buddhist monk** (v16.1), rigged, in a saffron robe with the right
  shoulder bare, shaven head — seen SEATED on the sala's dais, blessing the
  player with a whisk of lustral water. A sitting idle and a talking clip help;
  a blessing/sprinkling arm gesture would be ideal (the stand-in's arm is lifted
  in code).
- **The private Sak Yant room** (v16.1) — optional: a small shrine room, a Ruesi
  (hermit) head statue, framed yant cloths. The room is built from primitives
  now and looks complete; real props would only improve it.
- **A Thai woman**, rigged, standing — the offering stall auntie.
- Props: a temple bell · lotus flowers / an offering tray · a shoe rack · a stray
  dog (lying down) · a dashcam (for the film) · Thai temple guardian statues (yak).

## Chapter 2 · The Hands That Moved (evening chanting in a temple hall)
- ★ **A Thai temple hall interior** (with Buddha statues — can reuse chapter 1's Buddha).
- ★ **Kneeling worshippers** — Thai laywomen in white, rigged, kneeling/praying
  (several; one model reused is fine).
- **Monks** in orange robes, seated, chanting (rigged).
- ★ **A Thevada** (a crowned Thai celestial dancer figure — a golden statue or a
  character) — shown as a translucent golden silhouette.
- Props: candles, incense pots, lotus, temple drums/gong.
- *Shipped at v18.0 with stand-ins, to swap when these land:* the hall is
  built in primitives (black-lacquer columns, gold window crowns, a coffered
  red ceiling) with the Tailandia kit's Buddha at 7.6x as the great image;
  the kneeling rows are five existing rigs (admin tee, botak, granny, scold,
  pink-shirt lady) RE-POSED onto the monk's cross-legged take and dressed
  white (`lay_*.glb`); the chanting monks are Chad's monk (`monkrow.glb`);
  the Thevada is a drawn shadow and a gold glimpse, never a model.

## Chapter 3 · The Dance On Buddha Day (Singapore)
- ★ **A Thai amulet shop interior** (glass counters, shelves of framed amulets, a
  Buddha altar) — the Buddha Day scene, in Singapore.
- ✅ **The medium** — ARRIVED 19 Oct (Drive `medium.glb`, 48 MB): a Taoist priest
  in a black robe with gold trim and blue cuffs, a tall black hat with red
  tassels; a Meshy scan on a 28-joint Mixamo rig with TEN takes (Running,
  Walking, Chair_Sit_Idle_M, Sit_Finger_Wag_No, Sitting_Answering_Questions,
  Stand_Talking_Angry, Talk_Passionately, Talk_with_Left_Hand_Raised,
  Talk_with_Left_Hand_on_Hip, Talk_with_Right_Hand_Open). Shipped as `medium`
  (`CHARTFIX=1 tools/prepmonk.mjs` at 0.3: 178k triangles, weights diffused,
  normals shared across the seams, 4.1 MB, hosted-only).
- ★ **A Chinese altar room / shrine** — red lanterns, a red altar, deity statues.
- ✅ **The row of deities on the medium's altar** — Chad's scan, shipped as
  `taoistrow` at v21.11 (six images: Nezha, Guan Gong, Xuantian Shangdi, the two
  Wuchang, a general on a tiger) and REPLACED under the same key at v22.5 by his
  updated scan ("These are more accurate"; Drive
  `1pz-YlKB3rLRtV-xu9B9JD-8E1pA316OC`, 118 MB): FIVE images on their own
  pedestals — Ox-Head, the white Wuchang, a black-faced judge enthroned in the
  middle, the black Wuchang, Horse-Face. Every triangle near (582k) and a 146k
  cut beyond 3 m over the same vertices and maps (`masters/v22.5/make.sh`).
- ✅ **Hanuman** — ARRIVED 19 Oct (Drive `hanuman.glb`, 48 MB: a white Hanuman
  lunging with a trident, roaring, one static Meshy mesh of 591k triangles,
  Y up, facing +z). Shipped as `hanuman` (`LONG=1 tools/prepwess.mjs` at 0.2:
  118k triangles, 2048 colour + 1024 normal, 3.8 MB, hosted-only) — the
  presence that roars at the medium, drawn as a golden apparition.
- Shop staff and customers (rigged, Singaporean, casual).
- *Shipped at v21.0 with stand-ins for the rest* (docs/V21.0-E3C3-PLAN.md §3
  names which existing rig stands in for each part): the OWNER is episode 1's
  encik scan and the STAFF MAN episode 1's standing man, each with Idle_9,
  Talk_with_Hands_Open, Walking and Running retargeted in from the admin tee
  (`masters/v21.0/owner/make.sh`) — their shoulders and arms are eased toward
  the body at run time (the retarget leaves them a little shrugged and 14°
  out); the kneeling girl and man are e3c2's congregation close cuts; the
  auntie, the youth, the shrine's wife and father are episode 1's tentage
  sitters; the passer-by is the botak recruit. Chad's own models for the owner,
  the staff and the customers replace these one line each.
- ✅ **The owner** — ARRIVED 23 Oct (Drive `amulet shop owner.glb`: an older
  Chinese man in a white shirt, a Meshy scan on a 28-joint Mixamo rig, 598k
  triangles, nine takes). Shipped at v21.32 as `owner` (149k, the v16.8 recipe;
  Idle_9 retargeted in; his seated take's upright stretch baked as `mixamo.com`
  — `masters/v22.0/owners/make.sh`), in place of the encik stand-in.

## Chapter 4 · The Pieces That Answered (amulet shops)
- ★ **An old-style amulet shop** (can be chapter 3's shop re-dressed): wooden
  shelves, framed amulets, a wall clock.
- ★ **The shop owner** — an older Chinese Singaporean man in a white Chinese-collar
  shirt, rigged.
- ★ **The Chinatown towkay** (v22.0: the chapter became three shops, one owner each —
  the Yin shop's keeper is Chad's, the Hanuman shop is chapter 3's own with Chad's
  owner): an old uncle, a dark mandarin-collar shirt or a singlet, rigged. *Shipped
  with a stand-in:* Chad's congregation man (`cg_man2hd`) with admintee's Idle_9 and
  Talk_with_Hands_Open retargeted onto him (`masters/v22.0/towkay/make.sh`) — the
  first stand-in, episode 1's encik scan, could not hold a two-shot (4,200 triangles
  on a 512-pixel atlas). Chad's model replaces it as `towkay`, one file.
- **A Lersi** (a bearded hermit sage figure/statue) · **a Hanuman amulet / figurine** ·
  **a Yin amulet** (round) — small props held in the hand.
- **The Yin girl** — a pale, long-haired young woman (for a translucent face).
- (The **LP Tim Khun Paen** is already in the game — it appears here.)

## Chapter 5 · The Children On My Altar (his own room — docs/V23.0-E3C5-PLAN.md)
Chad, 25 Oct: THREE kumanthong (not six), one incense stick each and NO
candles, and his home is the room from chapter 4's ending B, built out.
- ✅ **His room** — chapter 4's ending-B room (`buildRoom` in e3c4.js), ported
  and built out with more detail (plan §4.1). No model needed.
- ✅ **Three kumanthong models** — ARRIVED 23 Oct (Drive folder
  `1Jj5s0xuYuXUYw8Ep0ixe8GilmMhp7RAg`: `kuman1.glb` 108 MB, `kuman2.glb` 261 MB,
  `kuman3.glb` 73 MB; Chad: "use it if you need to, or use it for the kumanthong
  chapter"). Downloaded to `masters/v22.0/src/` (git-ignored, re-downloadable).
  Photographed 25 Oct: kuman1 is the RED one (standing, hands on hips,
  frowning, 597k triangles); kuman3 the SHY one (crouching, hands over his
  mouth, 451k); kuman2 the LITTLE one (seated in añjali, two long locks of real
  hair, a jasmine garland, a ring of bells, 7.0M). Prepped at full detail at
  the plan's CP1 (the Yin shop's own kuman thong stay on Chad's yin shelf model).
- ✅ **The keeper** who gives them to him — Chad's Yin shop keeper (`yinkeeper`),
  already in the game.
- **Optional · a home altar table** (carved, gilt or red) — otherwise built from
  primitives or a Tailandia pack piece (plan §2.3 7).
- **Optional · a rigged adult Master Zav** (the white adult scan through Mixamo's
  auto-rigger, with a sitting idle) — it would let a few shots show him from
  behind as the children take him; otherwise every shot stays in his eyes (plan
  §2.3 6).
- Props (all drawn or built, none needed): red soda in small bottles with bendy
  straws · one incense stick each in sand · sweets · toys (a tin car, a ball, a
  paper pinwheel) · garlands. No candles.
- ~~A child silhouette for the shadow children~~ — dropped: the children are
  never shown as bodies (the no-block-figures rule); each arrives as a glowing
  double of its own scan.

- **Shipped at v23.0**: the three as `kumanred` (the red one), `kumanshy` (the shy one) and `kumanlittle` (the little
  one), each with a near level at full detail and lighter levels for a distance (the counter's three draw their
  lightest from 0.9 m, since at 1.1 m the far level was 361k triangles for three figures 140 px tall); each child's
  double (the glowing one that rises in a possession) is its own scan, built when it lands and warmed under the
  curtain; a soft contact shadow under each, since their scans cast none. Neither optional piece was needed: the home
  altar is built from primitives and the Tailandia packs, and every shot stays in his eyes. Chad's own models, so no
  credit rows (the v5.23 rule).

Credits: send the link to each model's page as usual and it goes in the credits
panel.
