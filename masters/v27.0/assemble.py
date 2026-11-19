#!/usr/bin/env python3
"""Episode 4 chapter 4 (e4c4.js), assembled: masters/v27.0/assemble.py (from masters/v26.0/assemble.py)

The chapter is written as parts (masters/v27.0/parts/*.js, joined in name order). Chapters are COPIED, not bundled
(v6.11), so where this chapter wants a helper exactly as chapter 3 has it (the build's head, one parse per asset, the
batched surfaces, the people's whole machinery), a part carries a marker

    //@@COPY a-b :: <how line a begins>

and the marker is replaced by lines a..b (1-based, inclusive) of src/chapters/e4/e4c3.js as it stands in the version
pinned below. Then a short list of EDITS, each an exact string that must occur exactly once in the assembled text (the
v14.1 rule for targeted edits: unique strings, never line ranges). The output is src/chapters/e4/e4c4.js, which is
never edited by hand. Run it from the repo root:

    python3 -I masters/v27.0/assemble.py            (add --check to assemble without writing)

It refuses to write if chapter 3 has changed under the pinned line numbers (its sha1), if a marker's range is bad or
its first line does not begin as the marker says, or if any edit does not match exactly once.
"""
import hashlib, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC2 = os.path.join(ROOT, 'src/chapters/e4/e4c3.js')
OUT = os.path.join(ROOT, 'src/chapters/e4/e4c4.js')
PARTS_DIR = os.path.join(os.path.dirname(__file__), 'parts')
E4C3_SHA1 = '7a8c4f42ecef78fb03407470ab57576f86b1301c'      # chapter 3 as of v26.18 build 22 (live, deploy 6afc5a02afd87bfe8bd9386b)

# (old, new): each `old` must occur exactly once in the assembled text
EDITS = [
    # the bodies this chapter made are keyed p4 (chapter 3's were e4): its sheets' rules are theirs
    ("const NOMIP = /^e4/;", "const NOMIP = /^p4/;"),
    # a person is set down on the flat's floor (chapter 3's on its hall's)
    ("function put(P, x, z, ry, y = hallGround(x, z))", "function put(P, x, z, ry, y = flatGround(x, z))"),
    # this chapter's painted surfaces from a picture are keyed w4t_ (none yet)
    ("const key = 'w3t_' + name;", "const key = 'w4t_' + name;"),
    # R77 (19 Nov, build 28): standing, his left arm and its drape let hang 7 degrees out (c_scast.js armOutInit/armOutLay):
    # made with the body, laid after the knees and before the shoulders in both a film's pose and play's frame, and taken
    # off after the shoulders' and before the arm's hold (the reverse of their laying: both turn the arm and the drape)
    # R42 (18 Nov): a body sat or stood up straight (o.upright, c_scast.js uprightInit/uprightLay): made with the body,
    # laid after the head's damping and before the shoulders in both a film's pose and play's frame, taken off last, and
    # laid for restHands' own measure of the arms
    # R77 (18 Nov): a shoulder let down (shouldersLay) holds the upper arm where the take put it, and the drape that hangs
    # over Grandmaster Pho's left arm from the same collar bone (DrapeArm, DrapeHang) was carried down off the arm with the
    # collar bone (his standing talk: skin through the white at his left side, from 21r's R64). It is held as the arm is
    ("if (qb) S.push({ cl, up, qb, scl: new THREE.Quaternion(), sup: new THREE.Quaternion(), M: {} }); }",
     "if (qb) S.push({ cl, up, qb, scl: new THREE.Quaternion(), sup: new THREE.Quaternion(), M: {}, fol: cl.children.filter(c => c.isBone && c !== up && /^Drape/.test(c.name)).map(b => ({ b, sv: new THREE.Quaternion() })) }); }"),
    ("        R.up.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(R.sup);\n",
     "        R.up.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(R.sup);\n        for (const F of R.fol || []) { F.sv.copy(F.b.quaternion); F.b.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(F.sv); }\n"),
    ("if (o.shoulders !== null) shouldersInit(P);", "if (o.shoulders !== null) shouldersInit(P);\n        if (o.upright) uprightInit(P);\n        if (o.armRest) armRestInit(P);\n        if (o.knees) kneesInit(P);\n        if (o.armOut) armOutInit(P);"),
    ("if (P.hd) headDampLay(P);\n      if (P.shd) shouldersLay(P);", "if (P.hd) headDampLay(P);\n      if (P.upr) uprightLay(P);\n      if (P.arst) armRestLay(P);\n      if (P.knees) kneesLay(P);\n      if (P.aout) armOutLay(P);\n      if (P.shd) shouldersLay(P);"),
    ("if (P.hd) headDampLay(P);\n        if (P.shd) shouldersLay(P);", "if (P.hd) headDampLay(P);\n        if (P.upr) uprightLay(P);\n        if (P.arst) armRestLay(P);\n        if (P.knees) kneesLay(P);\n        if (P.aout) armOutLay(P);\n        if (P.shd) shouldersLay(P);"),
    ("R.up.quaternion.copy(R.sup); } SH.on = false; } }", "R.up.quaternion.copy(R.sup); if (R.fol) for (const F of R.fol) F.b.quaternion.copy(F.sv); } SH.on = false; }\n      const AO = P.aout; if (AO && AO.on) { for (const R of AO.B) R.b.quaternion.copy(R.sv); AO.on = false; }\n      const UP = P.upr; if (UP && UP.on) { for (const R of UP.B) R.b.quaternion.copy(R.sv); UP.on = false; }\n      const KN = P.knees; if (KN && KN.on) { KN.hips.position.copy(KN.hp); for (const R of KN.B) R.b.quaternion.copy(R.sv); KN.on = false; }\n      const AR = P.arst; if (AR && AR.on) { for (const R of AR.B) R.b.quaternion.copy(R.sv); AR.on = false; } }"),
    # R51 (18 Nov): every model being unpacked is counted, from the call until its caller's own setup has run (the
    # count falls a task after the parse resolves, after the caller's then), so the stage can hold the curtain for it
    ("      return parsedGlb.get(key);\n", "      const pr = parsedGlb.get(key); parsePend++;\n      pr.then(() => setTimeout(() => { parsePend--; }, 0), () => { parsePend--; });\n      return pr;\n"),
    ("    const parsedGlb = new Map();\n", "    const parsedGlb = new Map();\n    let parsePend = 0;                                   // (R51: models being unpacked now: stage.ready waits for none)\n"),
    # R64 (18 Nov): a body may name the window its shoulders are measured over for a take it plays only part of
    # (o.shWin: { take: [from, length] }), without making that a window the take is played inside (o.win)
    ("W = P.win && P.win[name], N = 24, acc = S.map(", "W = (P.o.shWin && P.o.shWin[name]) || (P.win && P.win[name]), N = 24, acc = S.map("),
    ("      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);", "      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);\n      if (P.upr) { uprightLay(P); P.group.updateMatrixWorld(true); }"),
    # R77 (18 Nov, traced on build 24): a hand laid on the lap ('lap') moved Grandmaster Pho's left arm on his stool and
    # left the drape that hangs over that arm where the take had it, so his elbow showed through the white low at his
    # left side (the texels of the speck read back from the picture are his forearm's, tools/probes/texwhere.mjs). A lap
    # rest may now name, per side, the cloth bones that are its upper arm's brothers (K.follow: { L: [...] }), given the
    # turn the laying gave the upper arm, as chapter 3's crossed hands (crossHands, spec.follow) already give them
    ("        R[sd] = { W: best.W, pdir, f: best.f, n: best.n, fing, fingerQs };\n",
     "        R[sd] = { W: best.W, pdir, f: best.f, n: best.n, fing, fingerQs };\n        if (K.follow && K.follow[sd]) { const fl = K.follow[sd].map(nm => P.bone[nm]).filter(b => b && b.parent === a.up.parent).map(b => ({ b, q: new THREE.Quaternion(), on: false })); if (fl.length) R[sd].fol = fl; else console.warn(P.key + ': K.follow names no brother of his ' + sd + ' upper arm'); }\n"),
    # R77 (18 Nov, photographed on build 25): with the drape now going with the arm, the arm's own cloth is no longer a
    # thing the arm must clear. The lap's measure read the drape's hanging bone (DrapeHang: its name holds no "Arm") as
    # his body, and turned his left elbow out until the arm cleared it: 89 degrees, 0.169 m from his side (his right,
    # with no drape: 35 degrees, 0.018 m; the rest's report), a wing of white standing out at his left. A bone named
    # Drape is the arm's
    ("        const arm = q.skeleton.bones.map(b => /(Shoulder|Arm|Hand)/.test(b.name));",
     "        const arm = q.skeleton.bones.map(b => /(Shoulder|Arm|Hand)|^Drape/.test(b.name));"),
    # R86, R87 (19 Nov, build 33): a look is kept with what it turned and taken off before the next pose (lookSave, lookBack:
    # on a held take the mixer does not write the head again, and looks were laid on looks until the head was on its mark),
    # and laid as a neck makes it (natLook, c_people.js): a turn about the chest's up and a nod, never a tip, within a real
    # neck's range, two fifths of it in the neck
    ("    function armsBack(P) { const HT0 = P.ht;", "    function armsBack(P) { lookBack(P); const HT0 = P.ht;"),
    ("      if (!P || !P.ready || !P.head || !P.headRest || !(k > 0)) return;\n      const tg = target === 'lens'",
     "      if (!P || !P.ready || !P.head || !P.headRest || !(k > 0)) return;\n      lookSave(P);\n      const tg = target === 'lens'"),
    ("      _lkq3.setFromUnitVectors(_lkz, tg); _lkq2.identity().slerp(_lkq3, smo(c01(k)) * Math.min(1, reach / ang));\n      P.head.parent.getWorldQuaternion(_lkq3);\n      P.head.quaternion.copy(_lkq3.invert().multiply(_lkq2).multiply(_lkq));\n",
     "      natLook(P, _lkz, tg, smo(c01(k)), reach, _lkq);\n"),
    ("      if (!L || !(P.gazeK > 0) || !P.head || !P.headRest) return;\n",
     "      if (!L || !(P.gazeK > 0) || !P.head || !P.headRest) return;\n      lookSave(P);\n"),
    ("      const k = smo(P.gazeK) * Math.min(1, L.reach / ang);\n      _lkq3.setFromUnitVectors(_lkz, _lkv2); _lkq2.identity().slerp(_lkq3, k);        // the turn, in the world\n      /* onto the head bone: world' = turn * world, so local' = parentWorld^-1 * turn * world */\n      const par = P.head.parent; par.getWorldQuaternion(_lkq3);\n      P.head.quaternion.copy(_lkq3.invert().multiply(_lkq2).multiply(_lkq));\n",
     "      natLook(P, _lkz, _lkv2, smo(P.gazeK), L.reach, _lkq);\n"),
]


def main():
    src = open(SRC2, encoding='utf-8').read()
    got = hashlib.sha1(src.encode('utf-8')).hexdigest()
    if got != E4C3_SHA1:
        sys.exit('e4c3.js has changed (sha1 %s, pinned %s): check every //@@COPY range against it, then re-pin' % (got, E4C3_SHA1))
    lines = src.split('\n')
    parts = sorted(f for f in os.listdir(PARTS_DIR) if f.endswith('.js'))
    out = []
    for name in parts:
        for ln in open(os.path.join(PARTS_DIR, name), encoding='utf-8').read().split('\n'):
            m = re.match(r'^//@@COPY (\d+)-(\d+) :: (.+)$', ln)
            if not m:
                if ln.startswith('//@@'): sys.exit('%s: a marker that is not understood: %s' % (name, ln))
                out.append(ln); continue
            a, b, head = int(m.group(1)), int(m.group(2)), m.group(3)
            if not (1 <= a <= b <= len(lines)): sys.exit('%s: bad range %d-%d' % (name, a, b))
            if not lines[a - 1].lstrip().startswith(head):
                sys.exit('%s: line %d of e4c3.js begins %r, not %r' % (name, a, lines[a - 1].lstrip()[:60], head))
            out.extend(lines[a - 1:b])
        if out and out[-1] == '': out.pop()            # a part's own last newline
    text = '\n'.join(out) + '\n'
    for old, new in EDITS:
        n = text.count(old)
        if n != 1: sys.exit('an edit matches %d times, not once: %r' % (n, old[:80]))
        text = text.replace(old, new)
    if '--check' in sys.argv:
        print('ok: %d parts, %d lines (not written)' % (len(parts), text.count('\n'))); return
    open(OUT, 'w', encoding='utf-8').write(text)
    print('wrote %s: %d parts, %d lines, sha1 %s' % (os.path.relpath(OUT, ROOT), len(parts), text.count('\n'), hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]))


if __name__ == '__main__':
    main()
