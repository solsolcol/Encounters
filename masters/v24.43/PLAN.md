# v24.43 · Grandmaster Pho — the plan (written before the work, so it survives a lost session)

The v24.42 review (a fresh reader, eight takes against Chad's file): 1 better, 2 the same, 5 worse. What it means and
what this pass does about it, each step proven before the next:

1. **Take the hull taper back out.** Measured: it moved Walking up to 20 cm and three casts 7–17 cm, takes no finding had
   asked it to change (its only reason, the sword's and running's panels, left with V1TAKES). Without it, every take
   that runs the hull is v24.41's again — proven by skinning them against v24.41's file (identical).
2. **The drape over his left upper arm (MY regression, v24.39's re-bind).** His file bound that cloth to the arm, so it
   flew out as a wing when the arm lifted; my re-bind gave it to the chest. He was rigged with his arms out, so in every
   calm take, when the arm comes down, the cloth stays out where the arm was: a stiff shelf with a hard edge at the
   elbow, the forearm passing into it (walking, talking). Measure the drape's arm share in his file and mine first; then
   let the cloth ON the arm follow it again (a left-arm envelope of its own, kept off the shoulder joint so the chest and
   back stay fixed). Proof: tools/rigstrain.mjs (the trunk must still cave at no more than 0.7 % of its points), and the
   calm takes and the arm-raising casts photographed from the front, 45°, the side and 135°, his file / v24.42 / this.
3. **Running and the sword lunge.** Two of three readers rated every rule I have given them worse than his file there
   (the robe's hem is joined to his shins by a ring of 562 triangles: a leg leaving the robe tears it). Try them FITTED
   to his own file's robe (the floor: his file's cloth, with the torso fixed) and photograph his / v24.42 / fitted.
4. **One independent review** of every changed take: his file, v24.42 and v24.43 side by side, so one reader compares
   them (two readers are two rulers).
5. Record (make.sh, HISTORY, LEARNINGS, E4-MODELS, CLAUDE.md), commit, push, and report to Chad with the pictures — and
   what still needs his word (cutting the robe free of his shins changes his mesh).

## Progress
- **Step 1 done.** Without the taper (the v24.42 recipe minus HULLTAPER), Walking, mage_soell_cast_6, Charged_Spell_Cast,
  mage_soell_cast_4, Sitting_Answering_Questions and Sit_to_Stand_Transition_M skin identically to v24.41's file at five
  moments each (0.00 cm).
- **Step 2, measured first.** The cloth round his left upper arm (bind pose, 15–105 % along the arm), the share that
  follows the arm — his file / v24.42: 0–4 cm 100 / 70 %, 4–6 cm 99 / 74, 6–8 cm 98 / 59, 8–10 cm 95 / 28, 10–13 cm
  92 / 5, 13–17 cm 84 / 0, 17–22 cm 72 / 0 (the upper arm 59° below horizontal in the bind pose: 31° out from his side).
  Option added: robeskin LARMR / LARMS / LARMT (the left upper arm's own envelope, faded in from the shoulder joint;
  unset = as before). Variants baked: dA (0.10 / 0.05 / 0.25): 8–10 cm 65 %, 10–13 cm 60, 13–17 cm 36, 17–22 cm 10;
  dB (0.13 / 0.06 / 0.30): 65, 63, 52, 33. Next: the trunk measure (tools/rigstrain.mjs) on base, dA, dB; the drape
  takes photographed (his / v24.42 / dA / dB, five views from his front round his left to his back).
- **Step 2, the wider envelope REJECTED by the trunk measure** (tools/rigstrain.mjs, every take at 10 fps, base / dA /
  dB): the trunk caved again — worst take 0.7 / 7.1 / 16.6 % of its points (mage_soell_cast_3), Talk_with_Hands_Open
  0.0 / 3.7 / 11.0 % with its back's worst 1 % at 0.94 / 0.40 / 0.27 of rest. The diffusion carries the arm's pull from
  the drape into his upper back. The LARMR / LARMS / LARMT options were taken back out of robeskin.
- **Step 2, LDRAPE instead:** AFTER the diffusion, the cloth nearer his left UPPER ARM than his spine and within 14 cm of
  it (the trunk measure's own test of an arm's point — no point it reads as trunk is touched) blends back to his file's
  own weights by share k, faded in from the shoulder joint (20–40 % of the arm) and across the arm/spine boundary (3 cm).
  Baked with running and the sword lunge FITTED to his file (step 3): e1 (LDRAPE=1: 23,308 positions, mean share 0.83),
  e2 (LDRAPE=0.7: mean 0.58). Next: e1's trunk measure (it should be base's exactly), the per-take displacement of the
  drape (which takes the review must see), the drape takes photographed.
- **Step 2, e1 checked.** The trunk measure on e1: 18 of 19 takes identical to base in every trunk number (caved, chest,
  back, depth, trunk edges); Running differs only in its trunk edges squashed (0.1 → 0.3 %, its robe now fitted), worst
  caved 0.7 % in both. The drape moves every take 11–46 cm (so the review must see all nineteen). Photographed at 45°
  (Talk 2.3 and 2.7 s): v24.42's shell standing off the arm is pulled in, but at 2.7 s a strip of drape still lies over
  the swinging forearm — that cloth is nearer the FOREARM than the upper arm. No wing in the arm-raising casts (Charged
  0.4 s: the cloth on the upper arm lifts a little like a sleeve; his file swings the whole drape up). Option added:
  LDRAPEFORE=1 (the forearm's cloth too); e3 = LDRAPE=1 + LDRAPEFORE=1, baking.
- **Step 2, e3 (forearm too): no change** — the same 23,308 positions, every trunk and arm number identical to e1 (the
  drape's cloth near the forearm lies within 14 cm of the upper arm's elbow end already). Photographed at 45° and 90°:
  e1 pulls v24.42's shell in only a little; walking at 0.2 s still shows the forearm through a slit at the elbow. The
  shell is the LOOSE drape 13–22 cm off the arm's axis (his file 72–84 % on the arm there, e1 10–36 %), outside the
  14 cm edge. Option added: LDRAPEMAX (the reach, default 0.14); e4 = LDRAPE=1 + LDRAPEMAX=0.22, baking, to be judged
  by the trunk measure first (the shoulder-joint fade keeps the shoulder blade out).
- **Step 3, photographed (survey angles, his / v24.42 / fitted):** the sword lunge FITTED reads as his file does (both
  legs in their own folds, no rag at the ankle) with the torso fixed (his file's back is a dark smear there) — taken.
  Running fitted: the raised leg inside a flat-sided box at 0.3 s, dark spots at the standing shin; v24.42's rules let
  the foot through the back. Neither is clearly better: the review sees his / v24.42 / fitted side by side and decides.
- **Step 2, e4 (a 22 cm reach) REJECTED.** It reached the loose drape (13–22 cm off the arm: 53 % and 28 % on the arm,
  his file 84 and 72) but the trunk measure fell to Talk_with_Hands_Open's back at 0.19 of its depth and 5.5 % caved —
  the loose drape bound to the arm swings into his torso when the arm moves, which is exactly his file's fault (the one
  Chad called the biggest). Taken: e1 (the cloth within 13 cm of the arm follows it 65–91 %, was 28–59; the trunk exactly
  as before). The loose drape's shell stays: a hanging-cloth rig for it, like the robe's chains, is the next step, put to
  Chad. LDRAPEFORE and LDRAPEMAX taken back out of robeskin; the final recipe re-bakes e1 (checked byte for byte).
- **Step 4, the review:** every take (the drape moves all nineteen), his file / VERSION A (v24.42) / VERSION B (v24.43),
  the reader not told which is newer.
- **Step 4 started:** the nineteen three-row sheets (scratch survey9/cmp9-*.jpg: HIS FILE / VERSION A = v24.42 /
  VERSION B = this pass's robe file, the session's p9 = e1) with a fresh reader, blind to which is newer. Meanwhile the
  candidate is prepped (prepmonk) for assets/pho.glb. If the reader prefers A's running, running goes back to V1TAKES
  (v24.40's rules) and the file is re-baked.
- **Step 4 done, the review** (a fresh reader, all nineteen takes, blind): A (v24.42) against his file 13 better / 4 the
  same / 2 worse; B (this pass, running fitted) 12 / 4 / 3; B against A 2 better (the sword lunge, mage_soell_cast_4),
  16 the same (1–3 % of pixels: LDRAPE not visible), 1 worse (running: the fitted box and ankle scraps). So: the sword
  lunge stays fitted, running goes back to V1TAKES (its robe below the waist then identical to v24.42's, 0.00 cm, only
  the drape differing), the taper stays out. The final file: B with A's running — 13 better, 4 the same, 2 worse.
  The fault in nearly every take, in both: the loose drape's shell on his left arm (step 2's limit).
- **Step 5 done:** the final recipe (masters/v24.43/make.sh) re-makes assets/pho.glb byte for byte (6,791,872 bytes,
  sha1 9b466006…); the torso caves at 0.7 % at most (Charged_Spell_Cast), the back's worst 1 % at 0.78. Photographed:
  shots/pho-before-after-*.jpg (solid floor), shots/takes-1..3.jpg. Put to Chad: a hanging-cloth rig for the drape, and
  cutting the robe free of his shins.
