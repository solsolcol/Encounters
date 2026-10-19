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

## Chapter 4 · The Pieces That Answered (amulet shops)
- ★ **An old-style amulet shop** (can be chapter 3's shop re-dressed): wooden
  shelves, framed amulets, a wall clock.
- ★ **The shop owner** — an older Chinese Singaporean man in a white Chinese-collar
  shirt, rigged.
- **A Lersi** (a bearded hermit sage figure/statue) · **a Hanuman amulet / figurine** ·
  **a Yin amulet** (round) — small props held in the hand.
- **The Yin girl** — a pale, long-haired young woman (for a translucent face).
- (The **LP Tim Khun Paen** is already in the game — it appears here.)

## Chapter 5 · The Children On My Altar (his own home, not episode 1's flat)
- ★ **A home interior** — his own flat or house (a different home from episode 1).
- ★ **Kumanthong figures** — Thai golden child figures with a topknot (6–8; one
  or two models reused and tinted is fine).
- ★ **A home altar table** (carved, gilt or red).
- Props: red drinks in small cups · fruit · candles · incense · garlands.
- **A child silhouette** (for the shadow children — any small child model).

Credits: send the link to each model's page as usual and it goes in the credits
panel.
