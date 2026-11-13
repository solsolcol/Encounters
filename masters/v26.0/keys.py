#!/usr/bin/env python3
"""v26.0 · EVERY ASSET KEY OF EPISODE 4 CHAPTER 3, IN ONE TABLE.

A new asset used to need three hand edits (its row in build.py, its key in build.py's hosted-only set, its key in the
chapter head's `assets` list), and this chapter has well over a hundred. This table is the one place; the three lists
are WRITTEN from it, between markers, and nothing outside the markers is touched:

    python3 -I masters/v26.0/keys.py            # says what it would write and what is still missing
    python3 -I masters/v26.0/keys.py --write    # writes build.py and masters/v26.0/parts/a_head.js

A key is written only when its file is in assets/ (build.py stops on a row whose file is missing), so a model that has
not landed costs nothing: the chapter lists it as `waiting` and draws without it. Run this after anything lands, then
assemble and build. (The four trees are episode 4 chapter 1's own keys, declared as reuse in the head: not here.)"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
G = []   # (group comment, [(key, file, note)])


def group(title, rows): G.append((title, rows))


def person(n, note, full=False):
    """a person's levels: the near body with the takes, the two far bodies, and (the important people) the full model,
    drawn close: Ton and the woman at the bench since v26.0; since v26.4 the four seated masters and the woman lighting the
    candles too (Chad, 13 Nov 2026: "Only the important people like ton, candle lighter female, seated masters, pho, and
    those that already are built this way can retain." Grandmaster Pho is his own model, drawn whole)"""
    return [('e4' + n, 'e4%s.glb' % n, note), ('e4%sm' % n, 'e4%sm.glb' % n, ''), ('e4%sf' % n, 'e4%sf.glb' % n, '')] + ([('e4%sh' % n, 'e4%sh.glb' % n, '')] if full else [])


group("e4c3 v26.0 (episode 4 chapter 3, the Wai Kru): ITS PEOPLE, each made end to end for it (Chad, 11 Nov 2026: a\n"
      "photorealistic reference on white in an A pose from GPT Image, then Meshy at its highest settings, its rig, its\n"
      "takes). One skeleton and up to four skins a person, drawn by distance: the near body with the takes; `m` and\n"
      "`f` the two far bodies (Meshy's own remesh, the rig laid on by tools/riglod.mjs); `h` the generator's full model\n"
      "for the two he speaks to face to face. masters/v26.0/bodies.sh, people.sh; the tracker's section 5.",
      person('ton', "Ton, who posted the thread: the group's shirt, white trousers", True) +
      person('bench', "the woman at Grandmaster Pho's bench: white lace, a long white skirt", True) +
      person('hermita', 'a hermit in a brown robe (and his full model, drawn close: v26.4)', True) +
      person('hermitb', 'a hermit in a pale yellow shawl', True) +
      person('red', 'the master in red', True) + person('white', 'the second master in white', True) +
      person('dancera', 'a dancer, white and gold') + person('dancerb', 'a dancer, white and gold') +
      # (v26.8, Chad, 13 Nov 2026, of the woman raising her bai sri to the brown hermit: "are these the full res models?",
      #  then "Yes, full models": the woman and the man in trance, the two who go up, get their full models, drawn in the
      #  festival film's close shots only and given back when it ends: c_cast.js fullOn, fullOff)
      person('deva', 'the devotees, eight bodies in white', True) + person('devb', '') + person('devc', '', True) + person('devd', '') +
      person('deve', '') + person('devf', '', True) + person('devg', '') + person('devh', '') +
      person('girl', 'the children of the festival (the plan\'s 4.1 and 3.7): a girl of seven') + person('boy', 'and a boy of five') +
      person('monkb', 'the two monks made for the row under the east tent (Chad, 12 Nov 2026: "can we have different monks?"; his own monk keeps the middle chair): an older, heavy monk in deep maroon') +
      person('monkc', 'and a slim young monk in a dark red'))
group("e4c3: GRANDMASTER PHO, Chad's own model, cast for the first time (prepared over v24.38 to v24.56: masters/v24.56;\n"
      "168,029 triangles, 19 takes, his face and hands on a sheet of their own; his right armpit's loose flaps laid down\n"
      "on the arm on 12 Nov 2026: tools/armflap.mjs, the tracker's 15.6); and his far skin, a permissive cut of the\n"
      "same body to 22,000 triangles with no sheets of its own, bound to his bones and wearing his materials, drawn only\n"
      "across the turf (tools/permcut.mjs NOTEX NOANIM TRIS=22000 ERR=0.03)",
      [('pho', 'pho.glb', 'Grandmaster Pho'), ('phof', 'phof.glb', '')])
group("e4c3: its things, each from a crop of Chad's own photograph of the real one (a checked picture on white, then\n"
      "Meshy at the highest settings, its own remesh, tools/prepmeshy.mjs: masters/v26.0/props/TABLE.txt)",
      [('w3baisri', 'w3baisri.glb', 'the bai sri on its golden bowl (photograph 7): in his hands all chapter, and dozens on the tables'),
       ('w3naga', 'w3naga.glb', 'a naga of folded banana leaf (photographs 4, 9)'),
       ('w3wheel', 'w3wheel.glb', 'the great bai sri and its wheel of marigolds (photographs 4, 9, 10)'),
       ('w3parasol', 'w3parasol.glb', 'the orange and gold parasol over it (photograph 4)'),
       ('w3tower', 'w3tower.glb', 'a tower ringed with marigolds (photographs 8, 9)'),
       ('w3candle', 'w3candle.glb', 'the tall yellow candle (photograph 3)'),
       ('w3fan', 'w3fan.glb', "the peacock-feather fan (photographs 2, 8): chapter 5's too"),
       ('w3nagastaff', 'w3nagastaff.glb', "the carved staff with a naga's head (photographs 2, 8): chapter 5's too"),
       ('w3pewter', 'w3pewter.glb', "a bai sri on a pewter bowl, the tables' second kind (photograph 12)"),
       ('w3purple', 'w3purple.glb', 'purple flowers and fern in a golden pot (photograph 11)'),
       ('w3fruit', 'w3fruit.glb', 'a rattan tray of fruit (photograph 9)'),
       ('w3sweets', 'w3sweets.glb', 'a carved tray of sweets (photograph 9)'),
       ('w3khantok', 'w3khantok.glb', "a low rattan tray with a green coconut and water (photograph 2)"),
       ('w3puff', 'w3puff.glb', "one gathered puff of satin (the chief canopy's pole, photograph 1)"),
       ('w3chair', 'w3chair.glb', 'the carved hardwood armchair (photographs 5, 6)'),
       ('w3lowtable', 'w3lowtable.glb', 'the low dark table with a pale top (photograph 5)'),
       ('w3bench', 'w3bench.glb', "the slatted hardwood bench Grandmaster Pho sits on (photographs 1, 5, 6)"),
       ('w3sofa', 'w3sofa.glb', "a pale green sofa under the west tent (photograph 11)"),
       # ('w3petalbowl': the golden bowls of petals, RETIRED v26.8 at Chad's word, "Remove it": masters/v26.8/make.sh §7)
       ('w3petalsteel', 'w3petalsteel.glb', 'a steel bowl of petals (photograph 11)'),
       ('w3smallbaisri', 'w3smallbaisri.glb', 'a small bai sri of three cones (photograph 9)'),
       ('w3candlemid', 'w3candlemid.glb', ''), ('w3candlesmall', 'w3candlesmall.glb', ''), ('w3kratip', 'w3kratip.glb', ''),
       ('w3chicken', 'w3chicken.glb', ''), ('w3coconut', 'w3coconut.glb', ''), ('w3soda', 'w3soda.glb', ''), ('w3water', 'w3water.glb', ''),
       ('w3matroll', 'w3matroll.glb', "a rolled reed mat (ending A: the mats the new ones roll)"),
       ('w3shirt', 'w3shirt.glb', 'a folded white T-shirt (the opening film: what he packs)'),
       ('w3chrys', 'w3chrys.glb', 'white chrysanthemums in a silver pedestal bowl (photographs 4, 9, 10: Hunyuan3D, Meshy refused its picture twice)'),
       ('w3roses', 'w3roses.glb', 'roses and daisies in a white bowl (photographs 9, 10: Hunyuan3D)'),
       ('w3claypot', 'w3claypot.glb', 'the clay pot of sand on the gravel before the tables (photograph 10)'),
       ('w3pchair', 'w3pchair.glb', 'a plastic chair (photographs 5, 6: white behind the bench, blue at its side: one white model, the blue a tint)'),
       ('w3horns', 'w3horns.glb', 'a pair of horn loudspeakers for a pole (where the music and the chanting come from)'),
       ('w3taper', 'w3taper.glb', 'the long yellow taper the woman at the offering tables lights the candles with (photograph 10)'),
       ('w3glass', 'w3glass.glb', 'a glass of red soda with a straw (photograph 12: by the hermit\'s sofa)'),
       ('w3tissue', 'w3tissue.glb', 'a roll of tissue (the low tables: photographs 2, 11)')])
group("e4c3: what stands at the hall (photographs 13 to 16; masters/v26.0/hall): each cut out of his photograph, a\n"
      "checked picture on white, then Meshy",
      [('w3nagafount', 'w3nagafount.glb', 'the seven-headed golden naga fountain before the sign (photographs 13, 15, 16)'),
       ('w3nagagreen', 'w3nagagreen.glb', "the green naga on the west plinth (photographs 13, 16)"),
       ('w3nagawhite', 'w3nagawhite.glb', 'the white-bellied three-headed naga on the east plinth (photographs 15, 16)'),
       ('w3ganesha', 'w3ganesha.glb', "the small golden reclining Ganesha at the fountain's end (photograph 13)"),
       ('w3croton', 'w3croton.glb', 'a yellow-green bush (photographs 15, 16)'),
       ('w3dracaena', 'w3dracaena.glb', 'the dracaena in its brown glazed jar (photographs 13, 15)'),
       ('w3waterjar', 'w3waterjar.glb', 'the big water jar of floating plants (photograph 16)'),
       ('w3walllamp', 'w3walllamp.glb', "a carriage lamp on a corner post (photographs 13, 16)")])
group("e4c3: the ground's surfaces, each a picture made from his photograph of the real surface (masters/v26.0/tex/make.py;\n"
      "the hall's sign is drawn: masters/v26.0/hall/sign.mjs)",
      [('w3t_' + n, 'w3t_%s.%s' % (n, e), '') for n, e in [
          ('turf', 'jpg'), ('petalturf', 'jpg'), ('earth', 'jpg'), ('gravel', 'jpg'), ('redplank', 'jpg'), ('tin', 'jpg'), ('brick', 'jpg'),
          ('skirt', 'jpg'), ('satin', 'jpg'), ('mat', 'jpg'), ('carpet', 'jpg'), ('bluemat', 'jpg'), ('swag', 'webp'), ('banner', 'webp'), ('treeline', 'webp'),
          ('redroof', 'jpg'), ('hallbrick', 'jpg'), ('steptile', 'jpg'), ('lawn', 'jpg'), ('kalae', 'webp'), ('fretwork', 'webp'), ('sign', 'webp')]])

group("e4c3 v26.1: the ground's edges filled and its sky (Chad, 12 Nov 2026: \"i can find many empty spaces at the\n"
      "peripheral background ... the skybox can be added and improved with much better detail, especially adding clouds,\n"
      "sun, rays, etc. Add more trees, fill out empty spaces\"): each a checked picture on white (masters/v26.1/env/refs),\n"
      "then Meshy at its highest settings and its own remesh (masters/v26.0/props/TABLE.txt); the clouds and the render\n"
      "are pictures made for it (GPT Image, a transparent ground for the clouds): masters/v26.1/make.sh",
      [('w3banana2', 'w3banana2.glb', 'a banana clump with its suckers, the second kind beside his own'),
       ('w3frangipani', 'w3frangipani.glb', 'a frangipani, the temple-ground tree'),
       ('w3isanhouse', 'w3isanhouse.glb', 'a stilt house of the district, weathered teak and a rusted tin roof, out past the way in'),
       ('w3tank', 'w3tank.glb', 'a stainless water tank on its stand'),
       ('w3aircon', 'w3aircon.glb', "an air conditioner's compressor on its brackets, its pipes up the wall"),
       ('w3scooter', 'w3scooter.glb', 'an underbone motorbike with a front basket')] +
      [('w3t_' + n, 'w3t_%s.%s' % (n, e), '') for n, e in [
          ('render', 'jpg'), ('cloudbank', 'webp'), ('cloudtall', 'webp'), ('cloudflat', 'webp'), ('cloudthree', 'webp'), ('cirrus', 'webp')]])
B0, B1 = '    # >>> e4c3 keys: written by masters/v26.0/keys.py from its table (edit the table, not these rows) >>>\n', '    # <<< e4c3 keys: the rows end <<<\n'
S0, S1 = '           # >>> e4c3 keys (masters/v26.0/keys.py) >>>\n', '           # <<< e4c3 keys <<<\n'
H0, H1 = '      /* >>> this chapter\'s own keys: written by masters/v26.0/keys.py (edit its table, not this list) >>> */\n', '      /* <<< this chapter\'s own keys <<< */\n'


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
    return '\n'.join(out) + '\n'


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
    hp = os.path.join(ROOT, 'masters', 'v26.0', 'parts', 'a_head.js'); h = open(hp).read()
    h2 = between(h, H0, H1, wrap(have, '      '), 'the head part')
    print('%d keys in assets/; %d of the table not there yet: %s' % (len(have), len(missing), ' '.join(missing) or 'none'))
    if '--write' in sys.argv:
        if b2 != b: open(bp, 'w').write(b2)
        if h2 != h: open(hp, 'w').write(h2)
        print('written: build.py %s, a_head.js %s' % ('changed' if b2 != b else 'as it was', 'changed' if h2 != h else 'as it was'))
    else: print('(dry run: build.py would %s, a_head.js would %s)' % ('change' if b2 != b else 'stay', 'change' if h2 != h else 'stay'))


if __name__ == '__main__':
    main()
