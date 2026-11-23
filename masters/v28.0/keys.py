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
group("e4c5: THE PARTY LIST'S PORTRAITS (R49, 23 Nov 2026: 'It should show the character potraits with the name'), painted by\n"
      "GPT Image in a style like Final Fantasy's from the game's own renders of the two bodies (R59, his word: masters/v28.0/props/\n"
      "PORTRAITS.md, the jobs and the prompts), with their own alpha (R54: 'no black background'), cropped by the head's outline\n"
      "(masters/v28.0/props/portraits2.py --painted)",
      [('p5portpho', 'p5portpho.png', "Grandmaster Pho's portrait on the party list's tile, painted (256 x 256, alpha)"),
       ('p5portzav', 'p5portzav.png', "Master Zavier's portrait on the party list's tile, painted (256 x 256, alpha)")])
group("e4c5: GRANDMASTER PHO WITH FINGERS (R26, Chad's pick: 'Finger bones (Recommended)'): his own pho.glb with fifteen of the\n"
      "library's finger bones (and their ends) grafted onto his right hand from its own geometry, so it closes round the Naga\n"
      "stick; his file and chapters 3 and 4 untouched (tools/fingergraft.mjs, masters/v28.0/pho5)",
      [('p5pho', 'p5pho.glb', "Grandmaster Pho, his right hand with finger bones (at rest exactly his own)")])

group("e4c5: MR KOH and JUN (M5a), made here end to end: the near body with their takes, `m` the mid body, `h` every\n"
      "triangle for within 2.2 m (v26.5). masters/v28.0/people/RECORD.md, people.sh",
      [('p5koh', 'p5koh.glb', 'Mr Koh, the devotee, 1.68 m: a heavy man in a polo tee'),
       ('p5kohm', 'p5kohm.glb', ''), ('p5kohh', 'p5kohh.glb', ''),
       ('p5jun', 'p5jun.glb', 'Jun, the second follower, 1.72 m'),
       ('p5junm', 'p5junm.glb', ''), ('p5junh', 'p5junh.glb', '')])
group("e4c5: THE HOME'S AND THE ROOM'S THINGS (M5b), each made once: a checked picture on white, Meshy at its highest and\n"
      "its remesh, prepared in metres on its base's middle (masters/v28.0/props/RECORD.md: every id, size and fault;\n"
      "the mends taken at no credits are the world's, masters/v28.0/parts/b_world.js)",
      [('w5rail', 'w5rail.glb', 'the walkway\'s balustrade, a 2 m section'),
       ('w5walklight', 'w5walklight.glb', "the walkway's ceiling light"),
       ('w5grating', 'w5grating.glb', "the drain's grating at the walkway's edge"),
       ('w5liftpanel', 'w5liftpanel.glb', "the lift car's panel of buttons"),
       ('w5gate', 'w5gate.glb', 'his gate'), ('w5gatepost', 'w5gatepost.glb', 'its posts'),
       ('w5planter', 'w5planter.glb', "the court's left planter"), ('w5planter2', 'w5planter2.glb', 'and its right'),
       ('w5walllamp', 'w5walllamp.glb', "the court's wall lamps"), ('w5slippers', 'w5slippers.glb', 'slippers by his door'),
       ('w5frontdoor', 'w5frontdoor.glb', 'his front door'), ('w5shoecab', 'w5shoecab.glb', 'the shoe cabinet inside it'),
       ('w5curtain', 'w5curtain.glb', 'the curtains'), ('w5sofa', 'w5sofa.glb', 'the sofa'),
       ('w5lowtable', 'w5lowtable.glb', 'the low table'), ('w5tvconsole', 'w5tvconsole.glb', "the television's console"),
       ('w5oldchair', 'w5oldchair.glb', 'the old armchair'),   # (R42, 23 Nov: the floor lamp retired: the two in the living room blocked his path)
       ('w5tablelamp', 'w5tablelamp.glb', 'the table lamps'), ('w5wallclock', 'w5wallclock.glb', 'the wall clock'),
       ('w5dintable', 'w5dintable.glb', 'the dining table'), ('w5dinchair', 'w5dinchair.glb', 'its chairs'),
       ('w5pendant', 'w5pendant.glb', 'the pendant over it'), ('w5sideboard', 'w5sideboard.glb', 'the sideboard'),
       ('w5frame', 'w5frame.glb', 'the picture frames'),
       ('w5bagopen', 'w5bagopen.glb', 'the black bag, open'), ('w5bagtied', 'w5bagtied.glb', 'and tied'),
       ('w5threadreel', 'w5threadreel.glb', 'the reel of white thread'), ('w5staffwrap', 'w5staffwrap.glb', 'the Naga stick wrapped'),
       ('w5staffcloth', 'w5staffcloth.glb', 'its cloth'), ('w5duffel', 'w5duffel.glb', "Jun's duffel bag"),
       ('w5clothtable', 'w5clothtable.glb', "case three's low table under its white cloth"),
       ('w5padcase', 'w5padcase.glb', "the collector's padded case"), ('w5cushion', 'w5cushion.glb', 'the floor cushions'),
       ('w5altarshelf', 'w5altarshelf.glb', 'the altar shelf, empty'), ('w5ceilfan', 'w5ceilfan.glb', 'the ceiling fan')])
group("e4c5: CAST AT LAST by the shared cast (masters/v28.0/parts/c_cast.js, M9): the collector (people/RECORD.md 3b,\n"
      "his rig mended here, way B: one level, his full body), the nine's three bodies (one for each kind: the plain rig of\n"
      "24), and the Naga of the fight's film (people/naga.sh: drawn as ruby light, cut and laid round the court)",
      [('p5collector', 'p5collector.glb', 'the collector, 1.77 m: his rig mended here (way B), his four takes'),
       ('p5praicome', 'p5praicome.glb', 'the Prai that come, 1.60 m'),
       ('p5praihide', 'p5praihide.glb', 'the Prai that hide, 1.42 m'),
       ('p5praiheavy', 'p5praiheavy.glb', 'the third body of the nine, 1.90 m (the kind that slips)'),
       ('p5naga', 'p5naga.glb', 'the Naga of the fight\'s film, 8.41 m long (static)')])
group("e4c5: THE COLLECTOR'S THREE PIECES (THINGS-2, 29245cb), each from real photographs of its kind first\n"
      "(docs/research/V28.0-PIECES.md); which presence sits on which is the game's own picture",
      [('w5wuathanu', 'w5wuathanu.glb', 'a Wua Thanu, the cast humped bull (0.054 m): the angry presence'),
       ('w5rakyom', 'w5rakyom.glb', 'a Rak Yom, two small figures in a bottle of oil (0.060 m): the hungry one'),
       ('w5hunphayon', 'w5hunphayon.glb', 'a Hun Phayon, a bound black effigy (0.100 m): the one looking for energy')])

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
