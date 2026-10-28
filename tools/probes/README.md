# Probes — the v15 proofs, kept

These are not harnesses (`runtests.mjs` never runs them) — they are the
measuring tools every v15 engine change was proven with, kept so a proof can be
repeated after the container that ran it is gone. All of them drive the HOSTED
build over testlib's server, so `npm run build` first. Run from the repo root.

| probe | what it proves | usage |
|---|---|---|
| `pix.mjs` | the same frozen PLAY frame drawn with one `OPT` switch off and on, in one task, every pixel compared, at eight headings; also triangles per draw. `PHONE=1` for a 390×844 touch phone (LOW). | `node tools/probes/pix.mjs <optFlag> <chapter…>` |
| `mat.mjs` | every node's world matrix against three's own forced full recompute, bit for bit (`Object.is`), in the film and in play | `node tools/probes/mat.mjs <chapter…>` |
| `firstsight.mjs` | shader programs created mid-play at her first appearance, and the worst frame round it | `node tools/probes/firstsight.mjs ch1` |
| `letter.mjs` | the letterbox scissor: the band measured, the pixels inside it identical with the scissor off and on | `node tools/probes/letter.mjs` |
| `prof.mjs` | CPU (script, GC, layout, style), draw calls and triangles over both passes, programs, geometries, textures, heap — per chapter | `node tools/probes/prof.mjs <label> <chapter…>` → `prof-<label>.json` |
| `tris.mjs` | where the triangles go: the scene culled exactly as three culls it, summed by subtree | `node tools/probes/tris.mjs <chapter…>` |
| `casters.mjs` | on a phone, which chapters hold any shadow caster at all | `node tools/probes/casters.mjs <chapter…>` |
| `popins.mjs` | the Continue path: which models land after the world was uncovered | `node tools/probes/popins.mjs <chapter…>` |
| `sound.mjs` | a journey through five chapters: opening lines said once, loops, decoded sounds, load errors | `node tools/probes/sound.mjs` |
| `mem.mjs` | the JS heap across a journey | `node tools/probes/mem.mjs` |
| `skelproof.mjs` | v15.2: the skeleton merge is exact — each model parsed twice, one merged, both posed at four times; every skinned vertex (bit for bit) and rendered frame pairs (pixel for pixel) for the parse, a clone and 'detached' copies; a blank frame fails | `node tools/probes/skelproof.mjs [key[:clipsKey]…]` |
| `skins.mjs` | skeletons per model (meshes, skeletons, rows, bones bound more than one way) and skeleton updates / bone uploads per drawn frame, with her held on screen | `[OPT=skelMerge:0] node tools/probes/skins.mjs <chapter…>` |
| `fontproof.mjs` | v15.2: the self-hosted fonts draw the same pixels as Google's own (fetched by curl AS the browser); the built page asks Google for nothing | `node tools/probes/fontproof.mjs [--as=<label from tools/fontuas.txt>]` |
| `legscore.mjs` | v21.16: episode 3 chapter 2's film legs (shot 3) — the real man posed and cut as the chapter does, rasterized through the shot's own lens with a depth buffer at each placement: how much of the letterbox band the legs fill, and how many pixels of BACK face (the hollow inside a cut) win the depth test — which must be zero; static, no browser | `node tools/probes/legscore.mjs [z …]` |
| `tdzscan.mjs` | v21.1: no build-level `let`/`const` of a chapter is read before its declaration runs (the boot throw chaptertest cannot see); static, no browser — acorn and acorn-walk are dev dependencies since v23.1 | `node tools/probes/tdzscan.mjs src/chapters/e3/e3c3.js [build]` |
| `e3c5drive.mjs` | v24.3: episode 3 chapter 5 PLAYED THROUGH on a phone-sized touch context (sound on): every order pressed through `interactNow()` with the lens aimed and the player in reach, every minigame played by keys (E held twists, pours, slides, holds and fills a yield; a press taps and flicks; W climbs COME BACK), the decision clicked; reports the voice log (none over another), the cues, the beds at each phase, every page error | `ENC_DIST=<snap> OPT=A node tools/probes/e3c5drive.mjs` |
| `e3c5cont.mjs` | v24.3: Continue from a real save at each of episode 3 chapter 5's phases, tapped on the title of a phone with no `?ch=`; where the run lands, photographed (v24.5: `VIEW=desktop` clicks it on a desktop) | `ENC_DIST=<snap> [PH='care\|open3:mat'] [VIEW=desktop] node tools/probes/e3c5cont.mjs` |
| `e3c5ends.mjs` | v24.3: a chapter's endings photographed at chosen moments of the scene's own clock, the decision opened from a bookmark and the option clicked (any chapter: `CH`, `PHASE`; v24.4: `SETTLE` ms after each seek, for what fades on the wall clock) | `ENC_DIST=<snap> VIEW=desktop OPTS=D TS=5,14 node tools/probes/e3c5ends.mjs` |
| `e4c1drive.mjs` | v24.5: episode 4 chapter 1 PLAYED THROUGH BY A FINGER on a phone (sound on): every order turned onto and tapped on its badge, the thing or its mark (FALLBACK said when only the E path takes it), the ledger's lines, the day's pick, the tray and its Confirm, the unlock's Close, WHAT CHANGED?'s START and its taps, the option; reports the voice log, the cues, the phases, every press and how it landed, the beds, every page error | `ENC_DIST=<snap> OPT=A ASK=all\|none LED=fact\|meaning CHG=right\|none\|wrong node tools/probes/e4c1drive.mjs` |
| `e4c1cont.mjs` | v24.5: Continue from a real save at each of episode 4 chapter 1's phases (and from episode 3's end), tapped (or clicked) on the title with no `?ch=`; where it lands, photographed — then back to the title and Continue AGAIN in the same sitting (freshStage), which must land the same | `ENC_DIST=<snap> [PH='arrive\|wait:joy;n10'] [VIEW=desktop] [SAME=0] node tools/probes/e4c1cont.mjs` |
| `e3c5finger.mjs` | v24.5: episode 3 chapter 5 PLAYED THROUGH BY A FINGER on a phone (sound on): orders tapped as `e4c1drive` taps them, every minigame through the browser's own touch pipeline (CDP touches with a finger's timestamp): a craft step read off the screen and made — twist circled, slide dragged, taps, hold held, swipe flicked — a yield held, COME BACK climbed by strokes | `ENC_DIST=<snap> OPT=A node tools/probes/e3c5finger.mjs` |
| `endplay.mjs` | v24.5: any chapter's ending PLAYED with the sound on from a bookmark (the decision opened by `applyPhase(PHASE)`, the option tapped), left to run to its card: the voice log on the audio clock (none over another), the cues, a photograph every EVERY seconds of the scene's clock | `ENC_DIST=<snap> CH=e4c1 PHASE='storm:done~fri' OPT=B node tools/probes/endplay.mjs` |
| `filmshots.mjs` | v24.5: any chapter's OPENING FILM photographed at chosen moments of its own clock (seeked; SETTLE ms for what eases on the wall clock), on a phone or a desktop | `ENC_DIST=<snap> CH=e4c1 VIEW=desktop TS=0.5,5,10 node tools/probes/filmshots.mjs` |
| `slivers.mjs` | v24.5: a STRAY VERTEX — every visible skinned mesh skinned on the CPU as the GPU skins it, each triangle with an edge over LONG metres listed with its mesh, its owner and its vertices' bones and weights (episode 4 chapter 1's needle across the floor: one vertex at Pong's hip weighted to his left knee); also prints `stage.mends`, the vertices `mendTwins` gave their twins' weights | `ENC_DIST=<snap> [CH=e4c1] [PHASE=work:~fri] [LONG=0.45] node tools/probes/slivers.mjs` |
| `headroll.mjs` | v24.5: a seated person's look measured — how much of it his hips, chest and head take, his face's miss to what he looks at, his head's ROLL — at rest, in play, at the endings' gaze, to the master, and over a talking cycle with his look on and off; photographs from the player's eye (episode 4 chapter 1's Pong) | `ENC_DIST=<snap> [VIEW=desktop] OUT=dir node tools/probes/headroll.mjs` |
| `memab.mjs` | v24.3: a chapter's renderer memory (VmRSS, by its own browser profile) and its decoded sound at the counter, the room and the decision — run on two builds to see what a change costs | `ENC_DIST=<snap> SIZES=<sizes> TAG=v24.x node tools/probes/memab.mjs` |
| `../byteverify.py` | every served file of the live site fetched and compared byte for byte with `dist/` (`_headers` is Netlify's config and is never served) | `python3 tools/byteverify.py dist` |
| `usebefore.mjs` | v23.1: no `let`/`const`/`class` is read or written in a function before its declaration in that same function — the throw that only comes when that function runs (v23.1's Hanuman: a `const yaw` lower in `visTick` shadowed the camera rig's for the whole body, and the vision froze); real scopes, closures excluded; static, no browser. **`npm run build` runs it** over every chapter and main.js and stops on a find | `node tools/probes/usebefore.mjs <file.js…>` |

The fonts themselves are taken by `node tools/fontsnap.mjs` (in `tools/`, not
here): it asks Google as every browser in `tools/fontuas.txt`, fails unless
each class of browser src/fontpick.js names was answered alike, and writes
`assets/fonts/`. `?diag` on the game's address is the on-device counterpart:
what the renderers were given, and a forced-dark colour check.

This box renders on SwiftShader at 0.1–1 fps: judge by counts and by pixels,
never by frame rate.
