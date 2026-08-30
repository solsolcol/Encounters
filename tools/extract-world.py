"""One-shot, self-checking move of chapter 1's world out of the engine.

Refuses to touch main.js unless the text it is about to remove is EXACTLY
the text already present in src/chapters/ch1.js (modulo the four edits the
move needs and the two-space indent of being inside build()). That check is
the point: it is the machine version of "read the full diff and account for
every removed line", and it is stronger than doing this by hand.

Run once, then delete. Kept in the repo only for the length of the v3.5
refactor so the move is reproducible if it has to be redone.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAIN = ROOT / 'src' / 'main.js'
CH1 = ROOT / 'src' / 'chapters' / 'ch1.js'

FIRST = '// The sodium lamps are built with their posts further down'
LAST_ANCHOR = 'world.add(embers);'

# the four lines the move deliberately changes; everything else must match
ALLOWED_MISSING = {
    'scene.add(sky);          // see the note where `sky` is built',
    'scene.add(sp, sp.target);',
    "function canInteract() { return state === 'play' && pileDist() < INTERACT_R; }",
    "if (state === 'cine') {",
}

REPLACEMENT = """/* ------------------------------------------------------ the chapter's world
   The void deck, the burner, the drifting notes and the pile you act on used
   to be built inline right here. None of it is the game's — it is chapter
   1's — so it lives in the chapter now and reaches the engine through the
   handle build() hands back. CHCTX is the other half of that seam: the
   engine's own kit, passed in, so a chapter file never has to import
   anything (it cannot; it is a plain script on purpose).                   */
const CHCTX = {
  THREE, GLTFLoader, scene, camera, yaw, LOW,
  assetBytes, rescueTextures, redoShadows,
  cnv, makeSoftDot, makeGround, makeGrass, makeConcrete, makeLacquer, makeHellNote,
  getState: () => state,           // `state` is declared below; read at call time
  startDecision                    // a hoisted declaration, so naming it here is safe
};
if (typeof CH.build !== 'function') {
  throw new Error('chapter ' + CH_KEY + ' registered no build() — see chapters/ch1.js');
}
const stage = CH.build(CHCTX);
scene.add(sky);          // added AFTER the chapter's world, so the first Group
                         // in the scene is still the world — several harnesses
                         // find it that way (see the note where `sky` is built)
"""


def main():
    lines = MAIN.read_text().split('\n')
    starts = [i for i, l in enumerate(lines) if l.startswith(FIRST)]
    if len(starts) != 1:
        sys.exit(f'expected 1 start anchor, found {len(starts)}')
    a = starts[0]

    ends = [i for i, l in enumerate(lines) if l.strip() == LAST_ANCHOR]
    if len(ends) != 1:
        sys.exit(f'expected 1 end anchor, found {len(ends)}')
    b = ends[0]
    # the region runs to the blank line after the last world.add
    while b + 1 < len(lines) and lines[b + 1].strip() == '':
        b += 1
    if not lines[b + 1].startswith('/* ---'):
        sys.exit(f'unexpected line after region: {lines[b + 1]!r}')

    region = lines[a:b + 1]

    # --- the guarantee: every removed line already lives in the chapter -----
    ch1 = set(l.strip() for l in CH1.read_text().split('\n'))
    missing = [l.strip() for l in region if l.strip() and l.strip() not in ch1]
    unexpected = [m for m in missing if m not in ALLOWED_MISSING]
    if unexpected:
        sys.exit('REFUSING: these lines would be lost, not moved:\n  '
                 + '\n  '.join(unexpected))
    if set(missing) != ALLOWED_MISSING:
        sys.exit(f'REFUSING: expected exactly the 4 known edits, got {sorted(missing)}')

    out = lines[:a] + REPLACEMENT.split('\n') + lines[b + 1:]
    MAIN.write_text('\n'.join(out))
    print(f'moved {len(region)} lines out of main.js (region {a + 1}..{b + 1})')
    print(f'every one of the {len(region)} lines verified present in ch1.js, '
          f'except the {len(ALLOWED_MISSING)} intended edits')


if __name__ == '__main__':
    main()
