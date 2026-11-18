#!/usr/bin/env python3
"""v27.0 · EVERY ASSET KEY OF EPISODE 4 CHAPTER 4, IN ONE TABLE (as masters/v26.0/keys.py does for chapter 3).

The three lists a new asset needs (its row in build.py, its key in build.py's hosted-only set, its key in the chapter
head's `assets` list) are WRITTEN from this table, between markers, and nothing outside the markers is touched:

    python3 -I masters/v27.0/keys.py            # says what it would write and what is still missing
    python3 -I masters/v27.0/keys.py --write    # writes build.py and masters/v27.0/parts/a_head.js

A key is written only when its file is in assets/ (build.py stops on a row whose file is missing), so a thing that has
not landed costs nothing: the chapter draws without it. Run this after anything lands, then assemble and build.
(Grandmaster Pho, `pho`, is chapter 3's key and is declared as reuse in the head: not here.)"""
import os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
G = []   # (group comment, [(key, file, note)])


def group(title, rows): G.append((title, rows))


def person(n, note, full=False, levels=True):
    """a person's levels: the near body with the takes, the mid body, and (the three the story turns on) the full model;
    a spirit is its near body alone (masters/v27.0/people.sh)"""
    rows = [('p4' + n, 'p4%s.glb' % n, note)]
    if levels: rows.append(('p4%sm' % n, 'p4%sm.glb' % n, ''))
    if full: rows.append(('p4%sh' % n, 'p4%sh.glb' % n, ''))
    return rows


group("e4c4 v27.0 (episode 4 chapter 4, her flat): ITS PEOPLE AND ITS SPIRITS, each made end to end for it (a\n"
      "photorealistic reference on white in an A pose from GPT Image, looked at; Meshy at its highest; its rig; its takes).\n"
      "The near body with the takes, `m` the mid body, `h` the full model for the three the story turns on (v26.5); the\n"
      "spirits near only. masters/v27.0/bodies.sh, people.sh; the tracker's section 5.",
      person('amma', 'Amma, about 72, in her wheelchair: a cotton sari, a shawl, grey hair in a bun', True) +
      person('ravi', 'Ravi, her son, about 48: a polo shirt', True) +
      person('mala', 'Mala, her daughter, about 45: a salwar kameez', True) +
      person('oppress', 'the spirit on her back (crimson in the vision): gaunt, crouched, clinging', levels=False) +
      person('wander', 'the wanderers (green in the vision): low and crawling, hungry, come for a share of merit', levels=False) +
      person('large', 'the large wanderer, hunched and tall', levels=False) +
      person('appa', 'Appa, her late husband (pale blue in the vision): a white veshti and shirt, standing still', levels=False))
group("e4c4: the flat's things, each a checked picture on white, then Meshy at its highest and its own remesh,\n"
      "tools/prepmeshy.mjs (masters/v27.0/props/TABLE.txt, prop.sh)",
      [('w4wheelchair', 'w4wheelchair.glb', 'her folding steel wheelchair'),
       ('w4prayershelf', 'w4prayershelf.glb', 'her prayer shelf on the living room wall'),
       ('w4vilakku', 'w4vilakku.glb', 'the brass kuthu vilakku on her altar'),
       ('w4waterbowl', 'w4waterbowl.glb', 'the small silver bowl of holy water: in his hand'),
       ('w4bigbowl', 'w4bigbowl.glb', "Grandmaster Pho's larger bowl, on the floor by her chair: where he dips again"),
       ('w4sofa', 'w4sofa.glb', 'the wooden-framed three-seater, its cushion covers'),
       ('w4cabinet', 'w4cabinet.glb', 'the glass-fronted display cabinet'),
       ('w4dintable', 'w4dintable.glb', 'the dining table'),
       ('w4dinechair', 'w4dinechair.glb', 'a dining chair'),
       ('w4framesmall', 'w4framesmall.glb', 'a small standing photograph frame'),
       ('w4hugger', 'w4hugger.glb', 'the hugger ceiling fan'),
       ('w4folder', 'w4folder.glb', 'the folder of her hospital letters'),
       ('w4gate', 'w4gate.glb', 'the steel grille gate'),
       ('w4frameport', 'w4frameport.glb', "a portrait frame on the wall (Appa's)"),
       ('w4armchair', 'w4armchair.glb', 'a wooden-framed armchair'),
       ('w4tubelight', 'w4tubelight.glb', 'the fluorescent tube fitting'),
       ('w4tvconsole', 'w4tvconsole.glb', 'the TV console and its TV'),
       ('w4stool', 'w4stool.glb', 'a plastic stool'),
       ('w4standfan', 'w4standfan.glb', 'a standing fan'),
       ('w4shoerack', 'w4shoerack.glb', 'the shoe rack outside the gate'),
       ('w4tulsi', 'w4tulsi.glb', 'a tulsi (holy basil) in its pot in the corridor'),
       ('w4doorleaf', 'w4doorleaf.glb', 'every doorway\'s leaf (not w4door: that is episode 4 chapter 1\'s sound, and a key is global)'),
       ('w4fridge', 'w4fridge.glb', 'the fridge'),
       ('w4pilltray', 'w4pilltray.glb', 'her medicine tray'),
       ('w4clock', 'w4clock.glb', 'the wall clock'),
       ('w4phonetable', 'w4phonetable.glb', 'the telephone table and its corded phone'),
       ('w4bed', 'w4bed.glb', 'her bed with its rail'),
       ('w4commode', 'w4commode.glb', 'the commode chair by her bed'),
       ('w4poles', 'w4poles.glb', 'laundry on bamboo poles out of the kitchen window'),
       ('w4thoranam', 'w4thoranam.glb', 'the thoranam of mango leaves over her door'),
       ('w4altartray', 'w4altartray.glb', "the altar's brass tray: the camphor plate, the bell, small lamps"),
       ('w4coffee', 'w4coffee.glb', 'the coffee table'),
       ('w4garland', 'w4garland.glb', 'a jasmine and marigold garland, hung on a picture')])

B0, B1 = '    # >>> e4c4 keys: written by masters/v27.0/keys.py from its table (edit the table, not these rows) >>>\n', '    # <<< e4c4 keys: the rows end <<<'
S0, S1 = '           # >>> e4c4 keys (masters/v27.0/keys.py) >>>\n', '           # <<< e4c4 keys <<<'
H0, H1 = '      /* >>> this chapter\'s own keys: written by masters/v27.0/keys.py (edit its table, not this list) >>> */\n', '      /* <<< this chapter\'s own keys <<< */'



group("e4c4: the pictures in her flat, each a picture laid in a frame (masters/v27.0/SOURCES.md): her altar's three, the\n"
      "Wellcome Collection's own images at 1024 tall, whole (Public Domain Mark, credited in the panel); Appa's photograph,\n"
      "rendered from his own full model (tools/portrait.mjs)",
      [('w4t_kali', 'w4t_kali.jpg', 'Kali trampling Shiva, chromolithograph by R. Varma (Wellcome V0045118)'),
       ('w4t_ganesha', 'w4t_ganesha.jpg', 'Ganesha, chromolithograph (Wellcome V0044933)'),
       ('w4t_murugan', 'w4t_murugan.jpg', 'Kartikeya (Murugan), gouache on mica (Wellcome V0046230)'),
       ('w4t_appa', 'w4t_appa.jpg', "Appa's photograph: the game's own Appa, head and shoulders")])

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
    for title, items in G:
        there = [(k, f, n) for k, f, n in items if os.path.exists(os.path.join(ROOT, 'assets', f))]
        missing += [k for k, f, n in items if not os.path.exists(os.path.join(ROOT, 'assets', f))]
        rows += ''.join('    # %s\n' % t for t in title.split('\n'))
        for k, f, n in there:
            rows += ("    %-16s('assets/%s', True, False)," % ("'%s':" % k, f)) + ('     # ' + n if n else '') + '\n'
        have += [k for k, f, n in there]
    bp = os.path.join(ROOT, 'build.py'); b = open(bp).read()
    b2 = between(b, B0, B1, rows, 'build.py rows'); b2 = between(b2, S0, S1, wrap(have, '           '), 'build.py hosted-only')
    hp = os.path.join(ROOT, 'masters', 'v27.0', 'parts', 'a_head.js'); h = open(hp).read()
    h2 = between(h, H0, H1, wrap(have, '      '), 'the head part')
    print('%d keys in assets/; %d of the table not there yet: %s' % (len(have), len(missing), ' '.join(missing) or 'none'))
    if '--write' in sys.argv:
        if b2 != b: open(bp, 'w').write(b2)
        if h2 != h: open(hp, 'w').write(h2)
        print('written: build.py %s, a_head.js %s' % ('changed' if b2 != b else 'as it was', 'changed' if h2 != h else 'as it was'))
    else: print('(dry run: build.py would %s, a_head.js would %s)' % ('change' if b2 != b else 'stay', 'change' if h2 != h else 'stay'))


if __name__ == '__main__':
    main()
