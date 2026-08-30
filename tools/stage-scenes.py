"""Copies the four cutscenes from main.js into ch1.js, bodies verbatim.

Only the signature and the destructuring line of each scene are rewritten:
a scene used to close over the engine's internals, and now receives the
cutscene language as a parameter. Four statements inside the bodies also
change, each one an engine internal a chapter may no longer poke directly;
they are listed in EDITS and every one is asserted to have applied.

Run before extract-scenes.py, which refuses to remove anything from main.js
that this has not already put into ch1.js.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAIN = ROOT / 'src' / 'main.js'
CH1 = ROOT / 'src' / 'chapters' / 'ch1.js'

START = 'function scPickUp(c, s) {'
END = 'const CINE_SCENES = [scPickUp, scKick, scLeave, scChant];'

# old line (stripped) -> new line (already indented for its place in the body)
EDITS = {
    'function scPickUp(c, s) {                          /* A — you take it */':
        'function scPickUp(c, s, api) {                       /* A — you take it */',
    'const { tr, step, sfx, fade, camTo, yawTo, pitchTo } = A(c);':
        '  const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,\n'
        '          stage, camera, ghost, ghostLight, ghostOpacity,\n'
        '          handsRoot, armR, noteProp } = api;',

    'function scKick(c, s) {                            /* B — the burner goes over */':
        'function scKick(c, s, api) {                         /* B — the burner goes over */',
    'const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide, ghostFacePlayer } = A(c);':
        '  const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide,\n'
        '          ghostFacePlayer, faceFrom, rawK, stage, camera, ghost, ghostLight,\n'
        '          ghostOpacity, dirtyShadows } = api;',
    'for (const at of [1.2, 1.45, 1.7, 2.0]) step(at, () => { shadowDirty = 2; });':
        '  for (const at of [1.2, 1.45, 1.7, 2.0]) step(at, () => { dirtyShadows(2); });',

    'function scLeave(c, s) {                           /* C — you walk away */':
        'function scLeave(c, s, api) {                        /* C — you walk away */',
    'const { sfx, fade, camTo, yawTo, pitchTo, bob } = A(c);':
        '  const { sfx, fade, camTo, yawTo, pitchTo, bob, faceFrom, rawK, SHRINE } = api;',

    'function scChant(c, s) {                           /* D — palms together */':
        'function scChant(c, s, api) {                        /* D — palms together */',
    'const { tr, step, sfx, camTo, yawTo, pitchTo, ghostGlide, ghostFacePlayer } = A(c);':
        '  const { tr, step, sfx, camTo, yawTo, pitchTo, ghostGlide, ghostFacePlayer,\n'
        '          faceFrom, rawK, SHRINE, THREE, stage, ghost, ghostOpacity, getReveal,\n'
        '          buildPrayerArm, rightHand, setHandCurl,\n'
        '          handsRoot, armR, vmHemi, vmKey, vmFire } = api;\n'
        '  // the mirrored left arm is built on the fly at 0.9 s; the tracks after\n'
        '  // that read it, so the scene holds its own reference rather than\n'
        '  // reaching back into the engine every frame\n'
        '  let prayerArmL = null;',
    'tr(0, 0.5, k => { ghostOpacity(Math.max(reveal, k)); }, rawK);':
        '  tr(0, 0.5, k => { ghostOpacity(Math.max(getReveal(), k)); }, rawK);',
    'buildPrayerArm();':
        '      prayerArmL = buildPrayerArm();',
    'if (rightHandModel) setHandCurl(rightHandModel, 1 - 0.86 * k);':
        '      if (rightHand()) setHandCurl(rightHand(), 1 - 0.86 * k);',
}

HEADER = '''
  /* ====================================================================== */
  /* THE SCENES                                                             */
  /* ====================================================================== */
  /* One per choice, in the same order as DATA.choices. Each is handed the
     cine being built (c), the world snapshot taken as it started (s), and
     `api` — the engine's cutscene language: the verbs (tr/step/sfx/fade/
     camTo/yawTo/pitchTo/bob/ghostGlide/ghostFacePlayer), the easings, and
     the cast a scene may direct. This chapter's own props come through
     api.stage, which is the same handle build() returned.

     The engine re-derives every TRACK from absolute values each frame, so a
     scene is a description of where things ARE at time t, never a nudge —
     which is what makes skipping and seeking work at all (see LEARNINGS). */
'''

FOOTER_OLD = ('  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch1 = '
              'Object.assign(DATA, { build });')
FOOTER_NEW = ('  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch1 = Object.assign(DATA, {\n'
              '    build,\n'
              '    scenes: [scPickUp, scKick, scLeave, scChant]\n'
              '  });')


def main():
    lines = MAIN.read_text().split('\n')
    starts = [i for i, l in enumerate(lines) if l.startswith(START)]
    ends = [i for i, l in enumerate(lines) if l.startswith(END)]
    if len(starts) != 1 or len(ends) != 1:
        sys.exit(f'anchors: {len(starts)} starts, {len(ends)} ends')
    region = lines[starts[0]:ends[0]]          # scenes only, not CINE_SCENES

    applied, out = set(), []
    for ln in region:
        key = ln.strip()
        if key in EDITS:
            applied.add(key)
            out.append(EDITS[key])
        else:
            out.append('  ' + ln if ln.strip() else ln)

    unapplied = set(EDITS) - applied
    if unapplied:
        sys.exit('these rewrites never matched:\n  ' + '\n  '.join(sorted(unapplied)))

    # the two scene constants, moved with them
    consts = ('  // where the burner drum stands in world space, for the kick scene\n'
              '  const DRUM_W = { x: -1.2, z: -7.5 };\n')

    ch1 = CH1.read_text()
    if FOOTER_OLD not in ch1:
        sys.exit('ch1.js footer not found — has it already been staged?')
    block = HEADER + consts + '\n' + '\n'.join(out) + '\n'
    CH1.write_text(ch1.replace(FOOTER_OLD, block + '\n' + FOOTER_NEW))
    print(f'staged {len(region)} scene lines into ch1.js '
          f'({len(applied)} lines rewritten, the rest verbatim)')


if __name__ == '__main__':
    main()
