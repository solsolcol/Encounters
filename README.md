# Master Z's Spiritual Encounters — 3D prototype

Chapter 1, *The Hell Note*. A first-person browser game: cross the grass to
Block 464, walk into the void deck, and decide what to do about the note at
your feet. Runs on desktop and mobile from a single HTML file.

The narrative in `src/main.js` is **placeholder** — written to demonstrate the
mechanic. Master Z's real script, teachings and voice replace all of it.

---

## Build

```bash
npm install
npm run build        # -> hellnote.html, a single self-contained file
```

`hellnote.html` is generated. Never edit it — edit `src/main.js` or
`shell.html` and rebuild.

| File | What it is |
|---|---|
| `src/main.js` | The whole game: scene, lighting, controls, viewmodel, ghost, notes, chapter data |
| `shell.html` | Page shell — all UI, CSS and copy |
| `build.py` | Bundles the JS, inlines every `.glb` as base64, writes `hellnote.html` |
| `wrap.py` | Wraps the output the way the host frame does, for local testing |

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
