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
    # R42 (18 Nov): a body sat or stood up straight (o.upright, c_scast.js uprightInit/uprightLay): made with the body,
    # laid after the head's damping and before the shoulders in both a film's pose and play's frame, taken off last, and
    # laid for restHands' own measure of the arms
    ("if (o.shoulders !== null) shouldersInit(P);", "if (o.shoulders !== null) shouldersInit(P);\n        if (o.upright) uprightInit(P);"),
    ("if (P.hd) headDampLay(P);\n      if (P.shd) shouldersLay(P);", "if (P.hd) headDampLay(P);\n      if (P.upr) uprightLay(P);\n      if (P.shd) shouldersLay(P);"),
    ("if (P.hd) headDampLay(P);\n        if (P.shd) shouldersLay(P);", "if (P.hd) headDampLay(P);\n        if (P.upr) uprightLay(P);\n        if (P.shd) shouldersLay(P);"),
    ("R.up.quaternion.copy(R.sup); } SH.on = false; } }", "R.up.quaternion.copy(R.sup); } SH.on = false; }\n      const UP = P.upr; if (UP && UP.on) { for (const R of UP.B) R.b.quaternion.copy(R.sv); UP.on = false; } }"),
    # R64 (18 Nov): a body may name the window its shoulders are measured over for a take it plays only part of
    # (o.shWin: { take: [from, length] }), without making that a window the take is played inside (o.win)
    ("W = P.win && P.win[name], N = 24, acc = S.map(", "W = (P.o.shWin && P.o.shWin[name]) || (P.win && P.win[name]), N = 24, acc = S.map("),
    ("      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);", "      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);\n      if (P.upr) { uprightLay(P); P.group.updateMatrixWorld(true); }"),
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
