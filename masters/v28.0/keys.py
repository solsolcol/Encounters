#!/usr/bin/env python3
"""v28.0 · EVERY ASSET KEY OF EPISODE 4 CHAPTER 5, IN ONE TABLE (as masters/v27.0/keys.py does for chapter 4).

The three lists a new asset needs (its row in build.py, its key in build.py's hosted-only set, its key in the chapter
head's `assets` list) are WRITTEN from this table, between markers, and nothing outside the markers is touched:

    python3 -I masters/v28.0/keys.py            # says what it would write and what is still missing
    python3 -I masters/v28.0/keys.py --write    # writes build.py and masters/v28.0/parts/a_head.js

A key is written only when its file is in assets/ (build.py stops on a row whose file is missing), so a thing that has
not landed costs nothing: the chapter draws without it. Run this after anything lands, then assemble
(masters/v28.0/assemble.py) and build. A person or a thing that lands is ADDED to the table here (its group, its key,
its file, one line of what it is), never written into build.py or the head by hand.
(Grandmaster Pho, `pho`, and Ton, `e4ton`, are chapter 3's keys: when cast they are declared as reuse in the head's
`reuseInEpisode`, not here.)"""
import os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
G = []   # (group comment, [(key, file, note)])


def group(title, rows): G.append((title, rows))


group("e4c5 v28.0 (episode 4 chapter 5, the house with nine Prai): MASTER ZAVIER (R5), made from Chad's photograph and\n"
      "rigged; HIS PICK, the first of the four bodies made (R10). The near body with his walk, and `h` every triangle of him\n"
      "for within 2.2 m and the films (v26.5). masters/v28.0/make.sh sections 1 and 4, people.sh",
      [('p5zavier', 'p5zavier.glb', 'Master Zavier: a grey shawl-collar cardigan over a black T-shirt, dark jeans, grey socks'),
       ('p5zavierh', 'p5zavierh.glb', '')])
group("e4c5: the Naga stick (R2), from Chad's photograph: a checked picture on white, then Meshy at its highest and its\n"
      "own remesh (masters/v28.0/make.sh section 2, props/TABLE.txt, prop.sh)",
      [('w5nagastaff', 'w5nagastaff.glb', "Grandmaster Pho's Naga stick, light brown, 1.40 m")])

B0, B1 = '    # >>> e4c5 keys: written by masters/v28.0/keys.py from its table (edit the table, not these rows) >>>\n', '    # <<< e4c5 keys: the rows end <<<'
S0, S1 = '           # >>> e4c5 keys (masters/v28.0/keys.py) >>>\n', '           # <<< e4c5 keys <<<'
H0, H1 = '      /* >>> this chapter\'s own keys: written by masters/v28.0/keys.py (edit its table, not this list) >>> */\n', '      /* <<< this chapter\'s own keys <<< */'


def between(s, a, b, new, what):
    assert s.count(a) == 1 and s.count(b) == 1, '%s: its markers are not there once (%d, %d)' % (what, s.count(a), s.count(b))
    i, j = s.index(a) + len(a), s.index(b)
    return s[:i] + new + s[j:]


def wrap(keys, indent, width=118):
    out, line = [], indent
    for k in keys:
        t = "'%s', " % k
        if len(line) + len(t) > width: out.append(line.rstrip()); line = indent
        line += t
    if line.strip(): out.append(line.rstrip())
    return ('\n'.join(out) + '\n') if out else ''


def main():
    have, missing = [], []
    rows = ''
    seen = set()
    for title, items in G:
        for k, f, n in items:
            assert k not in seen, 'the key %s is in the table twice' % k
            assert k.startswith(('p5', 'w5')), 'the key %s is not this chapter\'s shape (p5 a person, w5 a thing)' % k
            seen.add(k)
        there = [(k, f, n) for k, f, n in items if os.path.exists(os.path.join(ROOT, 'assets', f))]
        missing += [k for k, f, n in items if not os.path.exists(os.path.join(ROOT, 'assets', f))]
        rows += ''.join('    # %s\n' % t for t in title.split('\n'))
        for k, f, n in there:
            rows += ("    %-16s('assets/%s', True, False)," % ("'%s':" % k, f)) + ('     # ' + n if n else '') + '\n'
        have += [k for k, f, n in there]
    bp = os.path.join(ROOT, 'build.py'); b = open(bp).read()
    b2 = between(b, B0, B1, rows, 'build.py rows'); b2 = between(b2, S0, S1, wrap(have, '           '), 'build.py hosted-only')
    hp = os.path.join(ROOT, 'masters', 'v28.0', 'parts', 'a_head.js'); h = open(hp).read()
    h2 = between(h, H0, H1, wrap(have, '      '), 'the head part')
    print('%d keys in assets/; %d of the table not there yet: %s' % (len(have), len(missing), ' '.join(missing) or 'none'))
    if '--write' in sys.argv:
        if b2 != b: open(bp, 'w').write(b2)
        if h2 != h: open(hp, 'w').write(h2)
        print('written: build.py %s, a_head.js %s' % ('changed' if b2 != b else 'as it was', 'changed' if h2 != h else 'as it was'))
    else: print('(dry run: build.py would %s, a_head.js would %s)' % ('change' if b2 != b else 'stay', 'change' if h2 != h else 'stay'))


if __name__ == '__main__':
    main()
