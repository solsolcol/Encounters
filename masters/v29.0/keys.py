#!/usr/bin/env python3
"""v29.0 · EVERY ASSET KEY OF EPISODE 5 CHAPTER 1, IN ONE TABLE (as masters/v28.0/keys.py does for episode 4 chapter 5).

The three lists a new asset needs (its row in build.py, its key in build.py's hosted-only set, its key in the chapter
head's `assets` list) are WRITTEN from this table, between markers of this chapter's own, and nothing outside the
markers is touched:

    python3 -I masters/v29.0/keys.py            # says what it would write and what is still missing
    python3 -I masters/v29.0/keys.py --write    # writes build.py and masters/v29.0/parts/a_head.js

THE TABLE IS THREE SOURCES, merged in this order: the groups written below (none yet), then the lists the CAST and
THINGS pieces keep beside their work, each a JSON list of {group, key, file, note}:
    masters/v29.0/people/keys.json    the people (CAST: p51...)
    masters/v29.0/props/keys.json     the things (THINGS: w51...)
A row's `group` is the comment its group is written under in build.py (rows of one group stand together, in the order
the file gives them); `note` is one line of what it is, written beside its row ('' for none).

A key is written only when its file is in assets/ (build.py stops on a row whose file is missing), so a thing that has
not landed costs nothing: the chapter draws without it. Run this after anything lands, then assemble
(masters/v29.0/assemble.py) and build. A person or a thing that lands is ADDED to its piece's keys.json (or to the
table here), never written into build.py or the head by hand. (Episode 4's keys this chapter reuses, Grandmaster Pho's
among them, stay in the head's own list outside the markers, each declared in its `reuseInEpisode`.)"""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))
G = []   # (group comment, [(key, file, note)])
KEY_SHAPE = re.compile(r'^(p51|w51|u51|fx51)[a-z0-9_]*$')   # p51 a person, w51 a thing, fx51 an effect's pictures (the tracker's 3)


def group(title, rows): G.append((title, rows))


# (the groups of this file's own, should one ever be needed, go here: group("e5c1 v29.0: ...", [(key, file, note), ...]))

for src in ('people/keys.json', 'props/keys.json'):
    p = os.path.join(HERE, src)
    if not os.path.exists(p): continue
    try: L = json.load(open(p, encoding='utf-8'))
    except ValueError as e: sys.exit('keys: %s is not JSON (%s): nothing written' % (src, e))
    if not isinstance(L, list): sys.exit('keys: %s is not a list of {group, key, file, note}: nothing written' % src)
    order, by = [], {}
    for r in L:
        if not isinstance(r, dict) or not all(isinstance(r.get(f), str) and r.get(f) for f in ('group', 'key', 'file')):
            sys.exit('keys: %s has a row without its group, key and file: %r' % (src, r))
        g = 'e5c1 (%s): %s' % (src.split('/')[0], r['group'])
        if g not in by: by[g] = []; order.append(g)
        f = r['file'][len('assets/'):] if r['file'].startswith('assets/') else r['file']   # (a file given as assets/<name> or <name>)
        by[g].append((r['key'], f, str(r.get('note', ''))))
    for g in order: group(g, by[g])

B0, B1 = '    # >>> e5c1 keys: written by masters/v29.0/keys.py from its table (edit the table, not these rows) >>>\n', '    # <<< e5c1 keys: the rows end <<<'
S0, S1 = '           # >>> e5c1 keys (masters/v29.0/keys.py) >>>\n', '           # <<< e5c1 keys <<<'
H0, H1 = '      /* >>> this chapter\'s own keys: written by masters/v29.0/keys.py (edit its table, not this list) >>> */\n', '      /* <<< this chapter\'s own keys <<< */'


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
    bp = os.path.join(ROOT, 'build.py'); b = open(bp).read()
    # the keys build.py already knows OUTSIDE this chapter's markers: a key is global and never reused (v14.7)
    outside = b[:b.index(B0)] + b[b.index(B1):] if b.count(B0) == 1 else b
    known = set(re.findall(r"^\s*'([a-z0-9_]+)':\s*\(", outside, re.M))
    for title, items in G:
        for k, f, n in items:
            assert k not in seen, 'the key %s is in the table twice' % k
            assert KEY_SHAPE.match(k), 'the key %s is not this chapter\'s shape (p51 a person, w51 a thing, u51 a sound, fx51 an effect\'s pictures)' % k
            assert k not in known, 'the key %s is already another chapter\'s in build.py (a key is global: v14.7)' % k
            assert '/' not in f and '..' not in f, 'the file of %s must be a name in assets/: %r' % (k, f)
            seen.add(k)
        there = [(k, f, n) for k, f, n in items if os.path.exists(os.path.join(ROOT, 'assets', f))]
        missing += [k for k, f, n in items if not os.path.exists(os.path.join(ROOT, 'assets', f))]
        if not there: continue
        rows += ''.join('    # %s\n' % t for t in title.split('\n'))
        for k, f, n in there:
            rows += ("    %-16s('assets/%s', True, False)," % ("'%s':" % k, f)) + ('     # ' + n if n else '') + '\n'
        have += [k for k, f, n in there]
    b2 = between(b, B0, B1, rows, 'build.py rows'); b2 = between(b2, S0, S1, wrap(have, '           '), 'build.py hosted-only')
    hp = os.path.join(HERE, 'parts', 'a_head.js'); h = open(hp).read()
    h2 = between(h, H0, H1, wrap(have, '      '), 'the head part')
    print('%d keys in assets/; %d of the table not there yet: %s' % (len(have), len(missing), ' '.join(missing) or 'none'))
    if '--write' in sys.argv:
        if b2 != b: open(bp, 'w').write(b2)
        if h2 != h: open(hp, 'w').write(h2)
        print('written: build.py %s, a_head.js %s' % ('changed' if b2 != b else 'as it was', 'changed' if h2 != h else 'as it was'))
    else: print('(dry run: build.py would %s, a_head.js would %s)' % ('change' if b2 != b else 'stay', 'change' if h2 != h else 'stay'))


if __name__ == '__main__':
    main()
