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
| **Pong**, the Bangkok amulet dealer | Thai man, 40s, stocky, short hair; gold chain with three framed amulets; short-sleeved polo tucked into dark slacks; a belt pouch; loafers | idle, talking (hands), walking, phone call, seated idle, seated talking | `e4pong`: episode 3's staff man with the first master's cross-legged sit, seated talk and chair sit retargeted in (idle, talk, walk, sit) | NEEDED |
| **Pa Noi**, the master's wife | Thai woman, 50s; floral cotton blouse and tube skirt (pha thung); reading glasses on a cord; hair in a low bun | idle, walking, talking, writing on a board or pointing, carrying a tray | `e4noi`: episode 3's Yin shop keeper at a crowd's cut (42k triangles; idle, talk, wave, walk), the chapter's own file so the sala's view stays inside a phone's budget | NEEDED |
| **The woman at the roadside stall** (ending C: she turns round as the pickup passes) | Thai woman, 40s–50s; a cotton blouse and an apron; her hair tied back | standing idle, a turn to look | `e4joy` (chapter 3's pink-shirt lady with a standing idle and a walk retargeted in) — she wore Khun Joy's stand-in from v24.0 and was never listed here until v24.9 | NEEDED |
| ~~**Khun Joy**, a Bangkok office worker~~ | — | — | — | **DROPPED** (v24.9, Chad's call: the yard is straight in — no queue, no customers) |
| ~~**Uncle Lim**, from Kuala Lumpur~~ | — | — | — | **DROPPED** (v24.9; his stand-in `e4lim` left the build) |
| ~~**Ta Sombat**, the farmer from next door~~ | — | — | — | **DROPPED** (v24.9) |
| **The presence** | Thai woman, elderly, in old-fashioned dress (a faded breast cloth, a dark tube skirt — a pha thung); short cropped grey hair; barefoot | standing idle only (very still, head slightly bowed) | `granny` (episode 1's scolding grandmother, her own standing take), desaturated and faded by where she is on the screen — `yinghost` was the first thought, but she is episode 3's Yin ghost, and one ghost wearing another's face would say they are the same woman | NEEDED |

### The first master

| Role | Model | Status |
|---|---|---|
| **The first master** ("Ajahn") | `firstmaster`: the original Sak Yant Ajarn (v16.8's scan), his cloth recoloured black at Chad's ask (v24.0, `masters/v24.0/firstmaster`) | **DONE**: his own model, under his own key. Krukai's `ajarn` is pinned and untouched. |

### Animals, vehicles, plants

| What | Spec | Placeholder | Status |
|---|---|---|---|
| A Thai soi dog | rigged: idle, lying, walk, bark | — | **IN (v24.13)**: Chad's "Animated Dog, Shiba Inu" by quander (Sketchfab, CC BY 4.0) — `e4dog`, two takes (lying, standing), under the sala's eave; it lifts its head in the film's O7, watches him and barks at the arrival, and barks after him on its feet in ending C (tools/prepdog.mjs). It has no walk take, so it never moves from its spot |
| A water buffalo | for the film's wide; static is fine | none (left out) | NICE |
| A pickup truck | Thai double-cab, generic, no logos; an interior is a bonus | built in code (as the buses were at v21.14) | **CHOSEN, file to come** (Chad, 30 Oct: "I will give the pick up truck model later in google drive, note the credits first"): "Rivian R1T (2022)" by geyges, Sketchfab, Free Standard licence — https://sketchfab.com/3d-models/rivian-r1t-2022-6eca29c11ca44840baf93f47ef800006 (394k faces, one animation). Its credit row goes in with the model |
| Sugar palm (Borassus) | two variants if possible | built in code | **IN v24.14**: Chad's "Palm Trees" by ElectroNick (Sketchfab, CC BY 4.0) — its two palms in all 117 places, every triangle within 40 m of the yard and along the drive in, a ~5k cut in the fields; the code-built palm only if a file never lands |
| Banana plant | — | built in code | **IN v24.14**: Chad's "Banana Tree" by Garecra (Sketchfab, CC BY 4.0), in every clump round the compound with its own leaf cut-offs |
| Bamboo clump | — | built in code | NEEDED |
| A large broadleaf tree for the takhian | not one of the game's current four | built in code | NEEDED |

### The room's images and props

| What | Spec | Placeholder | Status |
|---|---|---|---|
| A seated Buddha image | any style but the Chinnarat (e.g. a bronze Sukhothai-style) | none (left out; the altar's tiers carry the other offerings) | **IN v24.14**: Chad's "Yoga - Buddha" by T.Koeniger (Sketchfab, CC BY 4.0) — a bronze Buddha in meditation, 50k triangles at 0.32 m on the altar's top tier (the tiers 10 cm deeper to seat him) |
| A Nang Kwak (the beckoning lady) | also the item's model | none (left out; the item shows its drawing) | NEEDED |
| A Phra Rahu or another unusual altar image | for the third tier | none | NICE |
| Sandals | for the door | none | NICE |
| Small item models (takrut, a folded pha yant) | the bag's turning view | the items' line drawings | NICE |

**A question for Chad, with the presence's model:** the art direction above (an old woman in a breast cloth, her hair
cropped short) is the dress of her generation in the countryside — and it is also close to how the Nang Kwak, the
beckoning lady, is often drawn. In this story the Nang Kwak is an item the master may give him, so the two should not
be mistaken for each other: is the look right, or should she be dressed differently (a faded blouse, a shawl)?

**Where to put them:** a Drive folder per batch, as before. Chad's own models need no credit; a Sketchfab model gets
its credit row.
