"""Second half of the v3.5 move: chapter 1's four cutscenes out of the engine.

Same contract as extract-world.py — it refuses to remove anything from
main.js that is not already present, verbatim, in src/chapters/ch1.js. The
scenes are lifted body-for-body; only their opening destructuring line
changes (they now take the cutscene language as a parameter instead of
closing over the engine), plus four named edits listed in ALLOWED_MISSING.

Run once. Kept for the length of the refactor so the move is reproducible.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAIN = ROOT / 'src' / 'main.js'
CH1 = ROOT / 'src' / 'chapters' / 'ch1.js'

START = 'function scPickUp(c, s) {'
END = 'const CINE_SCENES = [scPickUp, scKick, scLeave, scChant];'

# every line the move deliberately rewrites; anything else missing is a loss
ALLOWED_MISSING = {
    # the four signatures + their destructuring lines
    'function scPickUp(c, s) {                          /* A — you take it */',
    'function scKick(c, s) {                            /* B — the burner goes over */',
    'function scLeave(c, s) {                           /* C — you walk away */',
    'function scChant(c, s) {                           /* D — palms together */',
    'const { tr, step, sfx, fade, camTo, yawTo, pitchTo } = A(c);',
    'const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide, ghostFacePlayer } = A(c);',
    'const { sfx, fade, camTo, yawTo, pitchTo, bob } = A(c);',
    'const { tr, step, sfx, camTo, yawTo, pitchTo, ghostGlide, ghostFacePlayer } = A(c);',
    # engine internals a scene may no longer touch directly
    'for (const at of [1.2, 1.45, 1.7, 2.0]) step(at, () => { shadowDirty = 2; });',
    'tr(0, 0.5, k => { ghostOpacity(Math.max(reveal, k)); }, rawK);',
    'buildPrayerArm();',
    'const upAxis = new THREE.Vector3(0, 1, 0);',
    'if (rightHandModel) setHandCurl(rightHandModel, 1 - 0.86 * k);',
}

REPLACEMENT = '''/* --------------------------------------------------------------- scenes */
/* The four cutscenes are chapter 1's, and they live in chapter 1 now. What
   stays here is the LANGUAGE they are written in: A(c) below supplies the
   verbs, and sceneApi() adds the cast a scene is allowed to direct — the
   player's camera, the ghost, the hands, and the chapter's own props by way
   of `stage`. Every chapter's scenes are written against exactly this, which
   is the whole reason it is worth naming.                                 */
const CINE_SCENES = CH.scenes || [];
if (CINE_SCENES.length !== CH.choices.length) {
  console.warn(`chapter ${CH_KEY}: ${CH.choices.length} choices but ` +
               `${CINE_SCENES.length} scenes — a choice with no scene will ` +
               `fall straight through to its outcome card`);
}
'''


def main():
    lines = MAIN.read_text().split('\n')

    starts = [i for i, l in enumerate(lines) if l.startswith(START)]
    ends = [i for i, l in enumerate(lines) if l.startswith(END)]
    if len(starts) != 1 or len(ends) != 1:
        sys.exit(f'anchors: {len(starts)} starts, {len(ends)} ends')
    a, b = starts[0], ends[0]
    if a >= b:
        sys.exit('anchors out of order')

    region = lines[a:b + 1]

    ch1 = set(l.strip() for l in CH1.read_text().split('\n'))
    missing = [l.strip() for l in region if l.strip() and l.strip() not in ch1]
    # the CINE_SCENES line itself is replaced, never moved
    missing = [m for m in missing if not m.startswith('const CINE_SCENES')]
    unexpected = [m for m in missing if m not in ALLOWED_MISSING]
    if unexpected:
        sys.exit('REFUSING: these lines would be lost, not moved:\n  '
                 + '\n  '.join(unexpected))

    out = lines[:a] + REPLACEMENT.split('\n') + lines[b + 1:]
    MAIN.write_text('\n'.join(out))
    print(f'moved {len(region)} scene lines out of main.js')
    print(f'{len(missing)} deliberately rewritten, {len(region) - len(missing)} '
          f'verified verbatim in ch1.js')


if __name__ == '__main__':
    main()
