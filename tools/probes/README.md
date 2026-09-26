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

This box renders on SwiftShader at 0.1–1 fps: judge by counts and by pixels,
never by frame rate.
