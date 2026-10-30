# Episode 4 — the models Chad is finding, and what stands in until they land

**Chad, 27 Oct 2026:** *"You can use placeholder models or generate your own until i give you the real models. You
just need to remember to ask me for the models so i don't forget or miss it."*

**THE RULE (standing, every session):**
- Every report to Chad while Episode 4 is being built ends with the short list of models in this file still marked
  NEEDED, so none is forgotten.
- A model is crossed off here the day it lands and is wired in. A placeholder is never "done".
- `chaptertest` prints every placeholder still in use, as a reminder that cannot be missed.

**What a placeholder is here:**
- **People:** one of the game's own characters, wearing the role until Chad's model arrives. Chad has allowed this,
  and the chapter's FRESH check lists each one as a declared exception.
- **Plants and vehicles:** built in code.
- **Never:** a block figure (the v21.16 rule stands). A person with no fitting placeholder is left out until the real
  model lands.

---

## Episode 4 chapter 1 — The Master I Did Not Know

### People (Meshy scans on Mixamo rigs, as before; the takes listed are what the role needs)

| Role | Look (art direction) | Takes needed | Placeholder until then | Status |
|---|---|---|---|---|
| **Pong**, the Bangkok amulet dealer | Thai man, 40s, stocky, short hair; gold chain with three framed amulets; short-sleeved polo tucked into dark slacks; a belt pouch; loafers | idle, talking (hands), walking, phone call, seated idle, seated talking | `e4pong`: episode 3's staff man with the first master's cross-legged sit, seated talk and chair sit retargeted in (idle, talk, walk, sit) | **IN v24.15**: Chad's own model (a Meshy scan on a Mixamo rig, 598k → 90k triangles), his own takes and an upright chair sit baked from his Chair_Sit_Idle_M |
| **Pa Noi**, the master's wife | Thai woman, 50s; floral cotton blouse and tube skirt (pha thung); reading glasses on a cord; hair in a low bun | idle, walking, talking, writing on a board or pointing, carrying a tray | `e4noi`: episode 3's Yin shop keeper at a crowd's cut (42k triangles; idle, talk, wave, walk), the chapter's own file so the sala's view stays inside a phone's budget | **IN v24.15**: Chad's own model (596k → 89k triangles), her own takes and the giving and waving gestures retargeted from the stand-in's |
| **The woman at the roadside stall** (ending C: she turns round as the pickup passes) | Thai woman, 40s–50s; a cotton blouse and an apron; her hair tied back | standing idle, a turn to look | `e4joy` (chapter 3's pink-shirt lady with a standing idle and a walk retargeted in) — she wore Khun Joy's stand-in from v24.0 and was never listed here until v24.9 | **IN v24.15**: Chad's own model (596k → 72k triangles), `e4stall` |
| ~~**Khun Joy**, a Bangkok office worker~~ | — | — | — | **DROPPED** (v24.9, Chad's call: the yard is straight in — no queue, no customers) |
| ~~**Uncle Lim**, from Kuala Lumpur~~ | — | — | — | **DROPPED** (v24.9; his stand-in `e4lim` left the build) |
| ~~**Ta Sombat**, the farmer from next door~~ | — | — | — | **DROPPED** (v24.9) |
| **The taxi uncle** (the coda: the taxi home in the rain; seen from the rear seat — his shoulder, his head, his hands on the wheel) | Singaporean Chinese man, 50s–60s; a short-sleeved polo or a white shirt; greying hair; glasses optional | seated driving (hands on the wheel), a glance at the mirror | `owner` (episode 3 chapter 3's amulet-shop owner, an older Chinese man, on his own upright seated take), his hands put on the wheel by the chapter (v24.21) | **NEEDED** (v24.21: Chad, 30 Oct, "The taxi scene has no driver in front") |
| **The presence** | Thai woman, elderly, in old-fashioned dress (a faded breast cloth, a dark tube skirt — a pha thung); short cropped grey hair; barefoot | standing idle only (very still, head slightly bowed) | `granny` (episode 1's scolding grandmother, her own standing take), desaturated and faded by where she is on the screen — `yinghost` was the first thought, but she is episode 3's Yin ghost, and one ghost wearing another's face would say they are the same woman | **IN v24.15**: Chad's own old woman — a still scan (571k → 69k triangles at 1.5 m), `e4ghost`, dressed and faded exactly as the stand-in was |

### The first master

| Role | Model | Status |
|---|---|---|
| **The first master** ("Ajahn") | `firstmaster`: the original Sak Yant Ajarn (v16.8's scan), his cloth recoloured black at Chad's ask (v24.0, `masters/v24.0/firstmaster`) | **DONE**: his own model, under his own key. Krukai's `ajarn` is pinned and untouched. |

### Animals, vehicles, plants

| What | Spec | Placeholder | Status |
|---|---|---|---|
| A Thai soi dog | rigged: idle, lying, walk, bark | — | **IN (v24.13)**: Chad's "Animated Dog, Shiba Inu" by quander (Sketchfab, CC BY 4.0) — `e4dog`, two takes (lying, standing), under the sala's eave; it lifts its head in the film's O7, watches him and barks at the arrival, and barks after him on its feet in ending C (tools/prepdog.mjs). It has no walk take, so it never moves from its spot |
| A water buffalo | for the film's wide; static is fine | none (left out) | **IN v24.19**: generated (a GPT Image reference on white, Meshy image-to-3D and remesh — Chad's workflow), 11,705 triangles at 2.7 m; two stand in the paddy beside the road in the opening film's wide (O5) |
| A pickup truck | Thai double-cab, generic, no logos; an interior is a bonus | built in code (as the buses were at v21.14) | **IN v24.16**: Chad's "Rivian R1T (2022)" by geyges (Sketchfab, Free Standard licence, credited) — https://sketchfab.com/3d-models/rivian-r1t-2022-6eca29c11ca44840baf93f47ef800006 — its windows a dark tint, 394k → 101k triangles (tools/preppickup.mjs); seen from outside everywhere, the chapter's own right-hand-drive cabin kept for the shots from inside |
| The yard's other cars, and the motorbike under the house | a silver sedan, a white double-cab pickup with red dust to its sills, a dark grey SUV; an underbone with a front basket | built in code | **IN v24.20** (Chad, 30 Oct: "Why are there still ugly generated trucks, replace all of them with real truck models"): generated by his workflow — a GPT Image reference on white each, checked, Meshy image-to-3D and remesh (masters/v24.20/make.sh): 30,502 / 29,838 / 30,363 / 19,529 triangles; the code-built ones only if a file never lands |
| The taxi's front seats | a modern Asian taxi's front seat, black fabric and leatherette | the drawn backs | **IN v24.21**: generated the same way (9,061 triangles at 1.08 m), with a steering wheel for the driver |
| Sugar palm (Borassus) | two variants if possible | built in code | **IN v24.14**: Chad's "Palm Trees" by ElectroNick (Sketchfab, CC BY 4.0) — its two palms in all 117 places, every triangle within 40 m of the yard and along the drive in, a ~5k cut in the fields; the code-built palm only if a file never lands |
| Banana plant | — | built in code | **IN v24.14**: Chad's "Banana Tree" by Garecra (Sketchfab, CC BY 4.0), in every clump round the compound with its own leaf cut-offs |
| Bamboo clump | — | built in code | **IN v24.19**: generated (37,374 triangles, tools/prepmeshy.mjs); the code-built clump only if the file never lands |
| A large broadleaf tree for the takhian | not one of the game's current four | built in code | **IN v24.19**: generated — the takhian (71,860 triangles, a buttressed bole, its cloths and dresses fitted to the real trunk), and with it the rain tree (34,787) and the mango (31,207); the code-built crowns only if a file never lands |

### The room's images and props

| What | Spec | Placeholder | Status |
|---|---|---|---|
| A seated Buddha image | any style but the Chinnarat (e.g. a bronze Sukhothai-style) | none (left out; the altar's tiers carry the other offerings) | **IN v24.14**: Chad's "Yoga - Buddha" by T.Koeniger (Sketchfab, CC BY 4.0) — a bronze Buddha in meditation, 50k triangles at 0.32 m on the altar's top tier (the tiers 10 cm deeper to seat him) |
| A Nang Kwak (the beckoning lady) | also the item's model | none (left out; the item shows its drawing) | **IN v24.17**: Chad's own scan — a bronze Nang Kwak seated on her stepped base, beckoning, a money bag at her side: a light cut (52,604 triangles) on the master's tray and on his altar's middle tier, the FULL scan (1,753,494 triangles, colour 4096) in the bag's views — the amulet rule (v14.14) |
| A Phra Rahu or another unusual altar image | for the third tier | none | **IN v24.20**: v24.19's generated one was held back (Chad: "your rahu dont even look like the real thing"); remade from REAL photographs — Wat Si Sa Thong's great black Rahu with its golden moon and two altar Rahus as the reference picture's image references (masters/v24.20/make.sh): jet-black lacquer and gold, 0.15 m on the altar's top tier |
| Sandals | for the door | none | **IN v24.19**: generated — black rubber flip-flops and brown plastic slides at the room's steps |
| Small item models (takrut, a folded pha yant) | the bag's turning view | the items' line drawings | **IN v24.17**: Chad's own scans — a takrut with its metal caps and rings (29,472 on the tray / every one of 147,376 in the bag) and the pha yant as a cloth rolled with its yant showing (30,864 / 617,280) |

**A question for Chad, with the presence's model:** the art direction above (an old woman in a breast cloth, her hair
cropped short) is the dress of her generation in the countryside — and it is also close to how the Nang Kwak, the
beckoning lady, is often drawn. In this story the Nang Kwak is an item the master may give him, so the two should not
be mistaken for each other: is the look right, or should she be dressed differently (a faded blouse, a shawl)?
(v24.15/v24.17: answered by Chad's own models — the presence is an old woman with short grey hair, barefoot, in a
breast cloth and a dark tube skirt; the Nang Kwak is a young crowned figure in bronze on a stepped base, beckoning,
a money bag at her side. Nobody will take one for the other.)

**Where to put them:** a Drive folder per batch, as before. Chad's own models need no credit; a Sketchfab model gets
its credit row.
