#!/usr/bin/env python3
"""Episode 4 chapter 3 (e4c3.js), assembled: masters/v26.0/assemble.py

The chapter is written as parts (masters/v26.0/parts/*.js, joined in name order). Chapters are COPIED, not bundled
(v6.11), so where this chapter wants a helper exactly as chapter 2 has it (one parse per asset, many of one model, the
fit of a shot to a phone), a part carries a marker

    //@@COPY a-b :: <how line a begins>

and the marker is replaced by lines a..b (1-based, inclusive) of src/chapters/e4/e4c2.js as it stands in the version
pinned below. Then a short list of EDITS, each an exact string that must occur exactly once in the assembled text (the
v14.1 rule for targeted edits: unique strings, never line ranges). The output is src/chapters/e4/e4c3.js, which is
never edited by hand. Run it from the repo root:

    python3 -I masters/v26.0/assemble.py            (add --check to assemble without writing)

It refuses to write if chapter 2 has changed under the pinned line numbers (its sha1), if a marker's range is bad or
its first line does not begin as the marker says, or if any edit does not match exactly once.
"""
import hashlib, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC2 = os.path.join(ROOT, 'src/chapters/e4/e4c2.js')
OUT = os.path.join(ROOT, 'src/chapters/e4/e4c3.js')
PARTS_DIR = os.path.join(os.path.dirname(__file__), 'parts')
E4C2_SHA1 = '58d1018748593e5642c0ccc61c76584f57194a2c'      # chapter 2 as of v25.5 (the audit's build)

# (old, new): each `old` must occur exactly once in the assembled text
EDITS = [
    # camAt's copy is not taken; the fit helpers call this chapter's own. Nothing to edit yet.
]


def main():
    src = open(SRC2, encoding='utf-8').read()
    got = hashlib.sha1(src.encode('utf-8')).hexdigest()
    if got != E4C2_SHA1:
        sys.exit('e4c2.js has changed (sha1 %s, pinned %s): check every //@@COPY range against it, then re-pin' % (got, E4C2_SHA1))
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
                sys.exit('%s: line %d of e4c2.js begins %r, not %r' % (name, a, lines[a - 1].lstrip()[:60], head))
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
