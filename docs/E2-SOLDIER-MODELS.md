# EPISODE 2 · THE SOLDIER MODELS

Chad's Drive folder `1ghUNod39nFLIAOcqPOA3Qeb97pRb4D8X`, eight files, downloaded and
byte-verified on 9 Sep 2026. This is what they are, what every animation in them actually
does read frame by frame, what they can and cannot be asked to do, and which chapter and
scene each one serves. Written before any of episode 2's chapters exist, so that the
chapters are designed around what the cast can really do rather than around a hope.

Nothing here was taken on trust. Every clip was rendered frame by frame against a ground
plane and a metre ladder and read; every number was measured off the skeleton or the posed
skin; the one structural claim that mattered most — that a clip from one of these rigs can
drive another — was proved by rendering it, not by matching names.

---

## 1 · THE EIGHT FILES

| file | MB | rig | joints | triangles | vertices | textures | clips |
|---|---|---|---|---|---|---|---|
| `fbo-nosling-6anim.glb` | 45.4 | Mixamo | 27 | 592,306 | 386,614 | baked, 3 maps | 6 + restpose |
| `fbo-sling-6anim.glb` | 45.4 | Mixamo | 27 | 593,072 | 383,373 | baked, 3 maps | 6 + restpose |
| `fbo-static-pointing.glb` | 33.1 | none | – | 591,484 | 396,516 | baked, 2 maps | none |
| `admintee-4anim.glb` | 117.7 | Mixamo | 27 | 593,914 | **1,190,700** | base 38.9 MB + 2 | 4 + restpose |
| `admintee-apose.glb` | 49.0 | none | – | 593,899 | 348,815 | 3 JPEG | none |
| `admintee-talking-mixamo.fbx` | 41.6 | Mixamo **+ fingers** | 34 | 593,899 | 348,815 | **none** | 1 |
| `sleeping-static.glb` | 24.8 | none | – | 596,990 | 346,606 | base + MR | none |
| `sleeping-animated.glb` | 62.1 | Mixamo | 22 | 597,017 | 329,620 | base 39.5 MB | 5 + baselayer |

The FBX was converted with `node_modules/fbx2gltf/bin/Linux/FBX2glTF` and is referred to
below as `admintee-talking.glb`.

## 2 · WHAT EACH MODEL IS

**`fbo-nosling`** — SAF full battle order: helmet with cover, load-bearing vest with pouches,
a FIELD PACK on the back, pixelated camouflage, black boots. **No rifle anywhere on him.**

**`fbo-sling`** — the same soldier with a rifle SLUNG across the body, hanging at his left side.
The two files are otherwise identical and deliberately carry different idles, so two soldiers
standing side by side do not breathe in unison.

**`fbo-static-pointing`** — despite the name, he is not pointing: he is **AIMING**. Bullpup rifle
shouldered, both hands on the weapon, eye down the sights, feet apart in a firing stance. Vest and
pouches, **no field pack**. A frozen statue with no skeleton.

**`admintee-*`** — a young Asian man in an olive admin tee with an ARMY chest print, black PT
shorts, **barefoot**, short black hair. The bunk-at-night look, exactly.

**`sleeping-static`** — a man in an admin tee **lying on his back with his hands behind his head,
eyes closed**. Lying along z, 1.90 m long.

**`sleeping-animated`** — the same kind of man, standing in his rest pose; his clips lay him down.

## 3 · EVERY CLIP, READ FRAME BY FRAME

All clips run at ~30 fps.

### The FBO pair — six takes each, five of them shared

| clip | secs | travel | hips | crown | loop error | what it actually is |
|---|---|---|---|---|---|---|
| Running | 0.71 | in place | 0.82–0.89 | 1.68 | 0.070 | combat jog, arms swinging free |
| Walking | 1.04 | in place | 0.86–0.90 | 1.71 | 0.024 | a natural walk |
| Rifle_Charge_inplace | 0.58 | in place | 0.82–0.86 | 1.48 | 0.018 | a **sprint** — a shorter stride cycle than Running |
| Gesture_with_Hand_on_Gun | 6.25 | in place | 0.53–0.55 | 1.36 | **0.000** | a **kneeling halt giving FIELD HAND SIGNALS** |
| Gun_Hold_Left_Turn | 3.75 | **0.65 m in z** | 0.74–0.81 | 1.41 | **1.129** | a **crouched tactical creep, turning left** |
| Idle_6 (nosling) | 7.50 | in place | 0.88–0.89 | 1.63 | 0.001 | standing at ease |
| Idle_3 (sling) | 10.04 | in place | 0.86–0.88 | 1.66 | 0.001 | standing at ease, a longer cycle |

**Gesture_with_Hand_on_Gun** is the most valuable clip in the whole set. He kneels on the right
knee with the rifle at his left hip; the right arm raises palm-forward and up (HALT), sweeps down
to horizontal and extends forward palm-down (advance / get down), and returns to rest. Six and a
quarter seconds, in place, and it loops **exactly** — the first and last pose are identical to
three decimal places. It is a section commander, complete. Its feet sit 1–2 cm below the floor.

**Gun_Hold_Left_Turn** is the one clip that TRAVELS and the one that will not loop. It is a
one-shot: a body bent at the waist, knees flexed, both arms out front shaped around a weapon,
creeping forward at 0.17 m/s while rotating left. Note that **the hands are shaped around a rifle
that is not in them** — the slung weapon stays on the body. It reads well in silhouette, at
distance, or from behind; it will not survive a close shot of the hands.

### The admin tee — four takes

| clip | secs | travel | loop error | what it is |
|---|---|---|---|---|
| Idle_9 | 2.08 | in place | 0.002 | standing, arms at sides, minimal sway |
| Talk_with_Hands_Open | 4.04 | in place | 0.001 | turns slightly, gestures with open palms, settles |
| Running / Walking | — | in place | as above | the same two takes on a barefoot body |

`Talk_with_Hands_Open` is the bunk-conversation take. The head is carried slightly down through it.

### The FBX — one more take

`mixamo.com`, 3.92 s, in place, loop error 0.000 — a second talking take, distinct from
`Talk_with_Hands_Open` and useful for a second speaker in the same conversation.

### The sleeper — three takes, authored LYING DOWN

All three put the body at **hips 1.16–1.18 m, lowest foot 1.03–1.06 m**: they were authored on a
surface about a metre off the floor, which is a bunk.

| clip | secs | loop error | what it is |
|---|---|---|---|
| Sleep_Normally | 1.79 | 0.000 | on his back, essentially motionless (hands move 4 mm) |
| Cough_While_Sleeping | 1.71 | 0.000 | the right arm comes up across the chest and face, the head turns, settles |
| Groan_Holding_Stomach_in_Sleep | 2.21 | 0.024 | legs draw up and roll, one knee crosses high, hips twist — restless sleep |

### The three statics

`fbo-static-pointing` — a soldier aiming. `admintee-apose` — a relaxed A-pose.
`sleeping-static` — lying on his back, hands behind his head.

## 4 · THE CLIP LIBRARY IS SHARED — proved, not assumed

All five rigged files are Mixamo and all of them keep the **raw `mixamorig:` names with the colons
intact**. The v5.01/v5.02 name-mangling trap does not apply to this set, and `HEAD_RE` matches
`mixamorig:Head` while correctly missing `mixamorig:HeadTop_End`.

They share one 22-bone core: Hips, Spine/1/2, Neck, Head, both Shoulder/Arm/ForeArm/Hand, both
UpLeg/Leg/Foot/ToeBase. The FBO pair and `admintee-4anim` add five leaf tips (HeadTop_End, both
HandMiddle4, both Toe_End) for 27. `admintee-talking` adds twelve finger bones instead, for 34.
`sleeping-animated` is the bare core, 22 — **and therefore has no crown bone.**

Because the names match, three.js binds any clip in the set onto any rig in the set at runtime,
which is the mechanism `CHCTX.cloneSkinned` already uses. Verified by rendering: the admin-tee man
in tee and shorts performs the FBO's kneeling hand-signal take, and the FBO soldier in full battle
order lies down and sleeps.

**The recipe, arrived at over four measured attempts:**

1. **Drop every `.position` track except the hips'.** These clips write position on *every* bone,
   so an unedited clip carries its source rig's bone lengths wholesale. Playing the sleeping clips
   on the FBO rig untouched threw the body to a bounding box of ±29 m in x, ±48 m in z, 112 m up.
2. **Keep the hips' position track and scale it by the unit ratio.** `sleeping-animated` is
   authored in **centimetres**; the FBO pair and `admintee-4anim` are in **metres**. A sleeping
   clip onto a metre rig takes ×0.01; a metre clip onto the sleeping rig takes ×100. Inside the
   metre family a clip transplants with no edit at all. Dropping the hips track instead of scaling
   it is wrong: the kneel *is* the hips falling from 0.97 to 0.53, and without the track it floats.
3. **Ground the result by measurement**, as every model in this game already is.

Posed bounds after the recipe, read from the live scene:

| rig | borrowed clip | posed y | reads as |
|---|---|---|---|
| admintee-4anim | Gesture_with_Hand_on_Gun | −0.010 → 1.258 | a correct kneel, feet on the floor |
| fbo-sling | Sleep_Normally | 0.881 → 1.427 | a body lying flat, 1.53 m along z |
| sleeping-animated | Talk_with_Hands_Open | 0.095 → 1.580 | standing and talking |

**So the folder is not six takes locked to one body. It is thirteen takes available to four
bodies, plus three static poses.** That is the single most important fact in this document,
because it is what makes a platoon possible out of eight files.

## 5 · THE HARD CONSTRAINTS

**1 · The rifle is welded into the soldier.** Every file is one mesh with one material. There is
no rifle node and no separate weapon mesh. A soldier either has a rifle slung or has none, for
ever. **No animated model in this set can hold, raise, aim or fire a rifle in its hands.** Only
the static aiming model shows a shouldered weapon, and it cannot move.

And the rifle cannot be cut out. A union-find over the index buffers shows these meshes are
shattered into **5,567 to 8,440 disconnected shells**, the largest of which is 5–6 % of the model:
this is scan-style geometry with no part structure, so there is no weapon shell to extract.

**2 · `admintee-4anim`'s mesh is unusable.** 1,190,700 vertices for 593,914 triangles — every
triangle fully split. `weld()` returns the same count even with the UVs stripped at tolerance
0.001, so it will not decimate: it stayed at 592,763 triangles where every other file dropped to
under 42,000. **Only its four clips are wanted, and only its clips will ship.**

That is solved rather than fatal: `admintee-apose` and `admintee-talking` are the same geometry
(348,815 vertices, bounding box identical to four decimals after the ×100 scale) and both weld and
decimate normally. Their vertex ORDER differs, so buffers cannot be copied between them, but each
carries its own valid UVs.

**3 · Every static is centred on the origin**, not standing on it: pointing and apose span
y −0.952…+0.951, sleeping-static spans z −0.949…+0.951 lying down. All three need a +0.95 lift.
The three rigged files are grounded properly at y 0 → 1.700.

**4 · The statics are 1.90 m; the rigged bodies are 1.70 m.** A statue placed beside an animated
soldier is 12 % too big. Size from posed bones, per the standing law.

**5 · `sleeping-animated` has no crown bone.** Its top JOINT measures 1.41–1.43 while its mesh is
1.700 — a 0.28 m error. This is the v5.21 gracy trap exactly: **measure this one from the posed
skin.**

**6 · The FBX carries no textures.** It references external files it never embeds.

## 6 · PREP — the ratio chosen by looking

`tools/prepwoman.mjs` at **ratio 0.06, 1024 px sheets, opaque**. The ratio was chosen the way
v5.31 says to: by rendering the soldier at the closest distance a player can walk to him.

| ratio | triangles | file | at arm's length |
|---|---|---|---|
| original | 593,072 | 45.43 MB | reference |
| 0.10 | 59,307 | 2785 KB | indistinguishable from the original |
| **0.06** | **35,583** | **1715 KB** | face and camouflage intact, silhouette clean — **ship this** |
| 0.03 | 26,807 | 1447 KB | **the face breaks**: the nose collapses, the mouth smears |

Everything shippable, at 0.06, clips kept:

| asset | source | shipped | triangles |
|---|---|---|---|
| `fbosling` | 45.43 MB | 2270 KB | 35,583 |
| `fbonosling` | 45.39 MB | 2275 KB | 35,537 |
| `fboaim` (the statue) | 33.14 MB | 1656 KB | 41,534 |
| `admintee` (built, below) | 49.11 MB | 1485 KB | 35,630 |
| `sleeper` (the statue) | 24.82 MB | 1081 KB | 35,818 |
| `sleepanim` (for its clips) | 62.10 MB | 1334 KB | 35,820 |
| **total** | **~260 MB** | **~10.1 MB** | |

**`admintee-dressed.glb` had to be built and now exists** (`dbg-dress.mjs`): the rigged copy of the
bunk character carries no textures and the textured copy carries no rig, so the apose file's
8192 px base-colour sheet was moved onto the talking file's material. Verified by render — the
olive tee with its ARMY chest print, black PT shorts, bare legs, the talking take playing.

Two normalizations at prep time, both already this repo's practice: the FBX-derived files are at
**1/100 scale**, and the three statics are **centred on the origin** rather than standing on it.

## 7 · THE GHOST

The engine's own ghost is a plain GLB whose materials are set `transparent` with an `opacity`
driven by `reveal` (`src/main.js:1658` onward). Any of these soldiers could be given the same
treatment. But the ghost of episode 2 is the CYCLIST, and dressing him in the same uniform as the
living platoon is a story problem rather than a technical one — Chad has already said he intends a
separate soldier-ghost model, which is the right call.

## 8 · WHAT IS STILL MISSING

1. **A first-person RIFLE.** Three of the five chapters have rifle gameplay — the strip-and-assemble,
   the range on blanks, the ambush drill on live rounds. The arms rig (`arms.glb`) exists and
   chapter 1 already parents a prop to a hand bone, so the mechanism is there; the weapon is not,
   and it cannot be cut out of these files. **This is the biggest gap.**
2. **A bicycle.** The ghost cyclist has nothing to ride.
3. **The soldier-ghost model** Chad has said he will supply.
4. **The places**: bunk and bunk beds, the shower block, the parade square, the outfield, the
   harbour, the tonner. None of that is in this folder.

---

## 9 · THE CASTING — every model and clip, chapter by chapter

Four bodies, thirteen takes, three statues. Read against
`docs/V7.0-EPISODE2-PLAN.md`.

### The standing cast

| name | asset | what he is | used in |
|---|---|---|---|
| **BUNKMATE** | `admintee` | the barefoot man in tee and shorts | C1, C2, C3 |
| **SLEEPER** | `sleeper` (statue) + `sleepanim` clips | a body in a bunk | C1, C3 |
| **TROOPER** | `fbosling` | FBO with the rifle slung | C2, C4, C5 |
| **CARRIER** | `fbonosling` | FBO with no rifle | C2 (the range line), C4 |
| **SENTRY** | `fboaim` (statue) | a man aiming, frozen | C2, C5 |

### E2C1 · THE WORST BED — the bunk, first night, the 3 AM shower

| figure | asset | clip | why |
|---|---|---|---|
| the platoon falling in | TROOPER ×6–8 | Running, then Idle_3 | the fall-in is a run to a halt; Idle_3's 10 s cycle keeps a line from breathing in unison |
| the sergeant at the front | TROOPER | Idle_3, then Talk_with_Hands_Open borrowed | the only take that gestures |
| bunkmates during the standby-bed test | BUNKMATE ×3 | Idle_9 / Talk_with_Hands_Open | barefoot in the bunk is exactly right |
| the other bunks at lights-out | SLEEPER statue ×4 | — | four still bodies; a statue is correct here, sleep barely moves |
| the one who stirs | SLEEPER rig | Groan_Holding_Stomach_in_Sleep | the only restless take |
| the shower block, 3 AM | **nobody** | — | the whole point is that no one is there |

Grounding: the sleep clips sit at hips 1.16, feet 1.05, so the bunk mattress must be built at
**1.05 m**, or the figures offset to whatever height the bed model turns out to be.

### E2C2 · THE MORNING AFTER — talk, strip and assemble, the range on blanks

| figure | asset | clip | why |
|---|---|---|---|
| the three bunkmates you talk to | BUNKMATE ×3 | Talk_with_Hands_Open, the FBX take, Idle_9 | **two distinct talking takes** means two speakers who do not mirror each other |
| the platoon forming up | TROOPER ×6 | Walking → Idle_3 | |
| the firing line beside you | **SENTRY statue ×4** | — | the only figures in the set that show a shouldered weapon; on a firing line nobody moves, so a statue is not a compromise, it is correct |
| the range safety walking behind | CARRIER | Walking | no rifle is right for a safety supervisor |
| the decision (the conversation) | BUNKMATE ×2 | the two talking takes | |

**The player's own rifle is missing.** The strip-and-assemble and the range are first-person and
there is no weapon to put in the arms rig.

### E2C3 · THE BLANKET — night two, and the plumbing by day

| figure | asset | clip | why |
|---|---|---|---|
| the bunk around you | SLEEPER statue ×4 | — | |
| the bunk that coughs | SLEEPER rig | Cough_While_Sleeping | a real cough, 1.7 s, loops clean |
| **the grey face over the bunk** | — | — | **this is the ghost**, and it is not in the folder |
| asking the bunk by day | BUNKMATE ×2–3 | Talk_with_Hands_Open, the FBX take | |
| tracing the plumbing | **nobody** | — | you are alone for it |

### E2C4 · THE PRESSURE — first outfield night, the harbour, the stag

| figure | asset | clip | why |
|---|---|---|---|
| the section commander at the halt | **TROOPER** | **Gesture_with_Hand_on_Gun** | the best clip in the set: a kneeling halt with real hand signals, 6.25 s, a perfect loop. He is the chapter's whole command presence in one asset |
| the file moving up | TROOPER ×4 | Walking | |
| your buddy in the next scrape | CARRIER | Idle_6 | a different idle from the commander's, so the two do not sync |
| the section closing on a contact | TROOPER ×2 | **Gun_Hold_Left_Turn** | the only travelling clip; it moves 0.65 m in z, does **not** loop, and must be played once and parked |
| **the crouched soldier at the beam's edge** | — | — | **the ghost.** Nothing here can be it |

Two directing notes forced by the assets. `Gun_Hold_Left_Turn` holds its hands around a rifle that
is not in them, so **never frame it closer than a silhouette** — at night, at the edge of a torch
beam, that is exactly the register the chapter wants anyway. And `Gesture_with_Hand_on_Gun` puts
its feet 1–2 cm under the floor, so the commander is lifted by that much.

### E2C5 · THE CYCLIST — night two, the ambush drill, the gully

| figure | asset | clip | why |
|---|---|---|---|
| the ambush line | **SENTRY statue ×5–6** | — | an ambush line is motionless by definition; these are the only figures that show a weapon at the shoulder |
| the commander giving the order | TROOPER | Gesture_with_Hand_on_Gun | "Shooters, watch your front. Ready." is a hand signal and a voice |
| the section after the bell | TROOPER ×4 | Running, then Rifle_Charge_inplace | the sprint take is the crash-out |
| the other platoon crashing out | CARRIER ×3 + TROOPER ×3 | Rifle_Charge_inplace | mixing the two bodies stops six identical men arriving |
| the dawn tonner | TROOPER ×6 | Idle_3 / Idle_6 | tired men standing |
| **the cyclist** | — | — | **the ghost, and his bicycle.** Neither is in the folder |

### What the casting does not cover

Every ghost beat in the episode — the grey face in C3, the crouched soldier in C4, the cyclist in
C5 — needs the model Chad has said he will supply. And the player's own hands hold nothing in the
three chapters built around a rifle.
