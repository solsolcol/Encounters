"""v29.0 · the reference pictures of episode 5 chapter 1's NEW things (plan §7, in its order). Each: GPT Image
(gpt-image-2.6-sunburst) through ElevenLabs, one generation, priced first (190.5 credits a picture, 27 Nov 2026), the
object alone on pure white, photorealistic, at its real size and look; looked at full size before it went to Meshy.
The picture's generation id is in refs.tsv (ids only: no result or flow link is ever written into a file)."""

TAIL = (" Alone, centred, on a pure white seamless studio background, photorealistic product photograph, true-to-life "
        "proportions and materials, soft even studio light, a three-quarter view from slightly above, the whole object in "
        "frame with a clear margin round it, nothing else in the picture. No text, no letters, no logos, no brand marks, "
        "no people.")

PROPS = [
    # name, real size (for TABLE.txt), subject
    ('keepsake', '0.07 w', "A small palm-sized keepsake packet, about 7 cm by 5 cm and 2 cm thick: a square of old, faded "
     "rust-red and dull pink cotton cloth folded into a small flat pouch, soft worn edges and faded creases, tied round "
     "twice with a thin reddish cord knotted on top, the cord's two short ends loose. Plain cloth, no writing, no symbols."),
    ('shoulderbag', '0.36 w', "A woman's everyday office shoulder bag: a soft taupe-grey leather tote about 36 cm wide, "
     "28 cm tall and 13 cm deep, two shoulder straps, its zip open and its mouth a little open showing a dark lining, "
     "slightly slumped, a little worn at the corners."),
    ('bottle', '0.10 h', "A small clear glass bottle about 10 cm tall, round, with a short neck, stoppered with a natural "
     "cork, filled three quarters with clear water."),
    ('coffeetable', '1.00 w', "A low rectangular coffee table of old dark-honey teak, about 100 cm long, 50 cm wide and "
     "40 cm tall, a plain thick top, four square tapered legs, a lower shelf, the wood a little worn and scratched with use."),
    ('gracesofa', '1.50 w', "A compact two-seat sofa for a small rented flat, about 150 cm wide: muted dusty-blue woven "
     "fabric, two seat cushions and two back cushions, slim track arms, short tapered wooden legs, the cushions a little "
     "creased with use."),
    ('rattanchair', '0.68 w', "A single rattan armchair of natural honey-coloured woven cane over a bent rattan frame, "
     "about 68 cm wide and 82 cm tall, a curved back and arms, a thin cream seat cushion, an older well-used chair."),
    ('bookshelf', '0.80 w', "A free-standing timber bookshelf about 80 cm wide, 150 cm tall and 30 cm deep, mid-brown "
     "wood, four shelves loosely filled with paperback books standing and lying, a few small potted green plants (a "
     "pothos trailing over an edge, a small succulent), a framed nothing, a small box. Plain book spines with no text."),
    ('laptop', '0.32 w', "A closed thin silver aluminium laptop about 32 cm wide and 22 cm deep, plain lid with no logo, "
     "lying flat."),
    ('takeaway', '0.22 w', "Leftover food takeaway on a counter: two white paper takeaway boxes, one stacked askew on the "
     "other, their lids closed, a pair of disposable wooden chopsticks in their paper sleeve beside them and a knotted "
     "thin plastic bag, about 22 cm across in all. No printing."),
    ('hissofa', '2.10 w', "A modern three-seat sofa for a condominium living room, about 210 cm wide: charcoal-grey "
     "woven fabric, three seat cushions and three back cushions, low square arms, slim black metal legs, neat and new."),
    ('histable', '1.60 w', "A modern rectangular dining table about 160 cm long, 90 cm wide and 75 cm tall: a light oak "
     "top with rounded corners, four slim matt black metal legs."),
    ('hischair', '0.82 h', "A modern dining chair about 82 cm tall: a light oak frame and legs, a curved upholstered seat "
     "and back in mid-grey fabric."),
    ('hisbed', '1.70 w', "A modern queen-size bed about 170 cm wide and 210 cm long: a low upholstered frame and a tall "
     "padded headboard in light grey fabric, white sheets, a white duvet turned back and a little rumpled, two white "
     "pillows."),
    ('altarcab', '0.90 w', "A home Buddhist altar cabinet for a modern flat, of dark polished wood, about 90 cm wide, 95 "
     "cm tall and 40 cm deep: a plain closed cupboard of two doors with small brass knobs below, and above it an open "
     "shelf with a low back panel and a narrow raised ledge, the top and the shelf left EMPTY (no statue, no picture, no "
     "candle, nothing on it)."),
    ('breakfast', '0.30 w', "A takeaway breakfast set down: a folded-top brown paper bag about 25 cm tall, beside it two "
     "white paper takeaway coffee cups with white plastic lids, and a small packet of toast wrapped in white wax paper, "
     "about 30 cm across in all. No printing on anything."),
    ('pills', '0.10 w', "A single blister strip of ten white round tablets, silver foil backing, clear plastic blisters, "
     "about 10 cm long and 5 cm wide, one blister pushed through and empty, lying flat. No printing."),
    ('keycard', '0.09 w', "A plain dark grey plastic access keycard about 8.6 cm by 5.4 cm on a small steel split ring "
     "with two ordinary brass door keys, lying flat. No printing on the card."),
    ('gracephone', '0.15 h', "A modern smartphone about 15 cm tall in a soft dusty-pink silicone case, lying flat on its "
     "back, its black screen off, a thin bezel. No logo."),
    # (27 Nov, R4: the four small ritual things as ONE picture, one Meshy job, cut apart by connected components)
    ('ritualset', 'set', "Four separate small household objects standing well apart in a row on a pure white seamless studio "
     "background, with wide clear white space between each object, none touching or overlapping: (1) a plain red plastic "
     "disposable cigarette lighter standing upright; (2) a clear glass water jug with a handle, half full of clear water; (3) "
     "a small round plain white porcelain plate, about 15 cm across, lying flat; (4) a plain clear drinking glass, a "
     "tumbler, filled with clear water. Photorealistic product photograph ... (as sent, its own tail; refs.tsv)"),
    # (27 Nov, R6: Chad's top-up; the six things cut only for want of credits, each with the TAIL above, as sent; the
    #  clock's tail adds "no numbers", the air-conditioner's is "from slightly below ... no pipes, no wall", the bag's
    #  "standing upright with its strap laid up behind it", the incense's "No smoke ... no symbols")
    ('clock', '0.12 w', "A small modern bedside digital alarm clock, about 12 cm wide, 7 cm tall and 6 cm deep: a plain matte "
     "black rectangular body with softly rounded edges, a large flat dark glass display panel across its front that is "
     "switched off and completely blank (no digits, no numbers lit), two small plain buttons on its top."),
    ('aircon', '0.90 w', "A modern indoor wall-mounted split air-conditioner unit for a new condominium bedroom, about 90 cm "
     "wide, 30 cm tall and 22 cm deep: a clean glossy white plastic casing with softly curved front, a closed horizontal "
     "louvre flap along its lower edge, a tiny dark status window at the right of its front."),
    ('phobag', '0.32 w', "A plain simple cloth shoulder bag of natural off-white cotton, like a monk's simple sling bag: one "
     "soft rectangular pouch about 32 cm wide and 34 cm tall, a flap folded over its top, a single long flat cotton strap "
     "of the same cloth, the cloth a little creased and softly worn, the bag slightly filled. Plain cloth only, no print, "
     "no pattern, no embroidery."),
    ('incense', '0.24 h', "A small round brass incense holder, a low bowl about 8 cm across and 4 cm tall filled with fine "
     "pale grey ash, with three thin unlit joss sticks standing upright in it side by side, each stick about 20 cm tall "
     "with a dark reddish-brown incense coating and a plain red bamboo stem at its base."),
    ('kettle', '0.24 h', "A plain modern electric kettle for a home kitchen, about 24 cm tall: a brushed stainless-steel body "
     "with a black plastic handle and a black lid on top, standing on its round black power base, a small spout."),
    ('jasmine', '0.22 h', "A small plain white porcelain vase about 14 cm tall, a simple rounded body and a short narrow neck, "
     "holding a modest bunch of fresh white jasmine flowers with their small dark green leaves, a few sprigs leaning out, "
     "as offered on a home Buddhist altar."),
]
