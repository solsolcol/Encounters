# Master Z's Encounters — The Game

A first-person browser horror-education game. Chapter 1, *The Hell Note*:
cross the grass to Block 464, walk into the void deck, and decide what to do
about the note at your feet. Runs on desktop and mobile.

**Start with `CLAUDE.md`** — the working contract for this repo — and
`docs/LEARNINGS.md` for every hard-won lesson. The chapter narrative is
placeholder; Master Z's real material is studied in `docs/SOURCE-NOTES.md`.

Live at https://masterz-encounters-game.netlify.app

---

## Build

```bash
npm install
npm run build
```

One run produces both builds:

- `dist/` + `masterz-encounters-vN.N.zip` — the real site for Netlify:
  engine, chapter file and fingerprinted assets as separate cached files
- `hellnote.html` (mirrored to `wrapped.html` for tests) — the whole game
  in one self-contained file, for the claude.ai preview artifact

All are generated. Never edit them — edit `src/`, `shell.html` or
`build.py` and rebuild.

| File | What it is |
|---|---|
| `src/main.js` | The engine: scene, lighting, controls, viewmodel, ghost, notes, audio, cutscenes |
| `src/chapters/ch1.js` | The chapter: words, choices, teachings, stage positions, asset list |
| `shell.html` | Page shell — all UI, CSS and copy |
| `build.py` | Produces both builds; `VERSION` at the top names the release |
| `wrap.py` | Mirrors the single file the way the preview frame wraps it |
| `testlib.mjs` | Portable browser launch + paths shared by every harness |

## Assets

Models are `.glb`, inlined at build time so the page stays one file.

| File | Source |
|---|---|
| `vrhands_fixed.glb` | Free VR hands pack, repaired by `fixhands.py` |
| `ghost.glb` | Kuntilanak FBX → glTF, textures shrunk |
| `hdb.glb` | HDB Block 464 FBX → glTF, textures shrunk |
| `amulet.glb` | Built from scratch by `mkmodel.py`. Parked — set `SHOW_AMULET = true` |

### Asset pipeline

```bash
# FBX -> GLB
node_modules/fbx2gltf/bin/Linux/FBX2glTF --input x.fbx --output x --binary

# shrink embedded textures (usually the bulk of a downloaded model)
python3 shrinkglb.py x.glb x_small.glb 1024 84
```

- `shrinkglb.py` — re-encodes textures inside a `.glb`. Handles images shared
  by several materials, which would otherwise be duplicated.
- `fixhands.py` — rebuilds bone transforms from inverse bind matrices. Fab's
  FBX→glTF conversion drops them, which collapses the mesh.
- `mkmodel.py`, `mkhands.py` — build models procedurally with trimesh.

## Tests

Run against a build. They exist because each one caught a real bug.

```bash
node final.mjs      # phone + desktop: no errors, no overflow, decision fires
node csptest.mjs    # textures survive a strict security policy  ← see below
node motion.mjs     # hand bob, sway, lean, breathing
node ghosttest.mjs  # ghost fade, approach, stopping distance
node census.mjs     # every system present and running
```

---

## Three traps that cost a day between them

**glTF textures die under a strict security policy.** Three.js loads embedded
images through `blob:` URLs it then fetches. A sandboxed frame refuses that,
so every texture is silently dropped and models render flat white — while
looking perfect over `file://`. `rescueTextures()` in `src/main.js` decodes
them with `createImageBitmap`, which takes the data directly and never touches
a URL. **Always test with `csptest.mjs`, not just locally.**

**glTF colours are linear, not sRGB.** A colour picked the normal way and
written straight into a model comes out pale and washed out. See `srgb()` in
`mkmodel.py`.

**Metal renders black** until the scene has an environment to reflect.
`RoomEnvironment` at low intensity fixes it without lifting the night.

## Rolling back

```bash
git log --oneline           # find a good commit
git checkout <tag-or-sha>   # e.g. git checkout v0.1
npm run build
```

Tagged releases mark versions known to be good end to end.
