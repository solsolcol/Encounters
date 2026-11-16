#!/usr/bin/env python3
"""v26.18 · the hall's inside: the crops of Chad's eleven photographs that go to GPT Image as image references.

    python3 -I masters/v26.0/props/crops_hallin.py            # every crop, into masters/v26.0/ref/hall/crops/
    python3 -I masters/v26.0/props/crops_hallin.py <name> ...  # these only
    python3 -I masters/v26.0/props/crops_hallin.py --grid <name> ...   # the same boxes UNMASKED with a ruled grid and
                                                                       # the polygons drawn, to scratch only (authoring)
    python3 -I masters/v26.0/props/crops_hallin.py --jpg <name> ...    # refs/<name>-1024.jpg, the committed copy
    python3 -I masters/v26.0/props/crops_hallin.py --pale <name>       # see pale(): the paper peacock's pink

THE REPOSITORY IS PUBLIC and the photographs show real people: the photographs (masters/v26.0/ref/hall/hall-NN-*) and
every crop made here (masters/v26.0/ref/hall/crops/) sit under masters/v26.0/ref/, which git ignores. Only this recipe
is committed. THE RULE EVERY CROP IS HELD TO, and each was opened and looked at before it was sent anywhere: the object
alone. No part of a person (a hand, a robe, a foot), no face (a printed or painted one too: a banknote, a portrait, a
magazine cover), no name and no lettering (a label, a badge, a clock's maker), no sacred image (the Buddhas are another
worker's, made from real photographs of their kind). What cannot be shown so is not sent: its picture is written from
the build sheet's words alone (masters/v26.0/ref/hall/notes/inventory.md), and PROMPTS.py says so with ref None.

A crop is a box of one photograph, enlarged (LANCZOS: nothing is sharpened or retouched), then
  keep   polygons: everything OUTSIDE their union is painted white (the object's neighbours go);
  paint  polygons, each with a colour and, where wanted, a feather in pixels: painted over (a label, a finial that
         belongs to a sacred image). Painting comes first, so a painted patch outside what is kept is simply gone.
Polygon points are in the ENLARGED crop's own pixels (what the --grid picture shows), so a number read off the grid is
the number written here.
"""
import glob, os, sys
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, '..', 'ref', 'hall')
OUT = os.path.join(REF, 'crops')
SCRATCH = os.environ.get('GRIDOUT', '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/hall/props/grid')
GREY = (128, 128, 128)      # the frame's board
WHITE = (255, 255, 255)

# name: (photograph, (x0, y0, x1, y1) in the photograph's pixels, enlargement, keep polygons, [(colour, polygon), ...])
C = {}


def photo(n):
    # a number is one of Chad's eleven photographs; a string is a reference photograph of the real KIND of thing, found
    # on the web and kept under masters/v26.0/ref/hall/web/ (each folder's SOURCES.txt has its page and its owner)
    return os.path.join(REF, 'web', n) if isinstance(n, str) else sorted(glob.glob(os.path.join(REF, 'hall-%02d-*' % n)))[0]


def cut(name, grid=False):
    n, box, s, keep, paint = C[name]
    im = Image.open(photo(n)).convert('RGB').crop(box)
    im = im.resize((round(im.size[0] * s), round(im.size[1] * s)), Image.LANCZOS)
    if grid:
        d = ImageDraw.Draw(im)
        step = 50 if max(im.size) <= 1400 else 100
        for x in range(0, im.size[0], step):
            d.line([(x, 0), (x, im.size[1])], fill=(0, 255, 255) if x % (step * 2) else (255, 0, 255), width=1)
            d.text((x + 2, 2), str(x), fill=(255, 255, 0))
        for y in range(0, im.size[1], step):
            d.line([(0, y), (im.size[0], y)], fill=(0, 255, 255) if y % (step * 2) else (255, 0, 255), width=1)
            d.text((2, y + 2), str(y), fill=(255, 255, 0))
        for p in keep: d.line(list(p) + [p[0]], fill=(255, 0, 0), width=2)
        for col, p, *f in paint: d.line(list(p) + [p[0]], fill=(0, 0, 255), width=2)
        os.makedirs(SCRATCH, exist_ok=True)
        out = os.path.join(SCRATCH, name + '-grid.png')
    else:
        for col, p, *f in paint:                 # (colour, polygon[, feather in pixels]): a feathered patch has no edge
            m = Image.new('L', im.size, 0)       # of its own, so it cannot be read as a thing
            ImageDraw.Draw(m).polygon(p, fill=255)
            if f: m = m.filter(ImageFilter.GaussianBlur(f[0]))
            im = Image.composite(Image.new('RGB', im.size, col), im, m)
        if keep:
            m = Image.new('L', im.size, 0)
            for p in keep: ImageDraw.Draw(m).polygon(p, fill=255)
            im = Image.composite(im, Image.new('RGB', im.size, WHITE), m)
            bb = m.getbbox()                       # trimmed to what is kept, with a white margin
            if bb:
                pad = 24
                im = im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.size[0], bb[2] + pad), min(im.size[1], bb[3] + pad)))
        os.makedirs(OUT, exist_ok=True)
        out = os.path.join(OUT, name + '.png')
    im.save(out)
    print(name, im.size, '->', out)


# ---- the crops (each one's notes say what was painted away and why) -----------------------------------------------
# the gold bai sri, the east one in hall-03 (the only one seen close with nobody beside it; its east frond is cut by the
# photograph's own edge, so the same one in hall-04, whole and smaller, goes in beside it). The thick candle behind it
# carries a printed label: painted white, and outside what is kept besides.
C['hgoldbaisri'] = (3, (1240, 940, 1536, 1640), 2.5,
    [[(468, 118), (498, 160), (508, 240), (512, 285), (545, 300), (540, 340), (500, 362), (500, 420), (512, 500), (522, 610),
      (545, 640), (540, 700), (512, 712), (520, 790), (548, 820), (600, 850), (660, 895), (705, 945), (735, 1010), (740, 1060),
      (740, 1230), (735, 1300), (700, 1340), (640, 1370), (610, 1385), (612, 1400), (600, 1440), (560, 1460), (530, 1475),
      (545, 1500), (560, 1560), (585, 1610), (580, 1650), (520, 1680), (430, 1690), (340, 1680), (290, 1650), (285, 1610),
      (310, 1580), (325, 1500), (335, 1470), (300, 1450), (265, 1400), (258, 1330), (200, 1300), (150, 1240), (148, 1180),
      (165, 1150), (95, 1080), (85, 1040), (130, 960), (140, 890), (175, 820), (200, 788), (228, 792), (262, 870), (296, 890),
      (318, 865), (345, 830), (380, 790), (392, 778), (395, 712), (372, 705), (370, 635), (395, 615), (425, 500), (448, 420),
      (450, 362), (402, 335), (400, 300), (425, 285), (428, 240), (425, 200), (440, 160)]],
    [(WHITE, [(236, 628), (374, 628), (374, 706), (236, 706)])])
C['hgoldbaisri4'] = (4, (1075, 960, 1295, 1425), 4,
    [[(420, 70), (455, 140), (470, 200), (462, 245), (490, 290), (485, 310), (455, 322), (452, 400), (462, 520), (470, 630),
      (500, 645), (498, 705), (478, 715), (490, 790), (505, 850), (520, 860), (560, 880), (640, 930), (700, 990), (730, 1050),
      (790, 1110), (800, 1150), (760, 1190), (830, 1225), (835, 1275), (740, 1290), (745, 1340), (720, 1400), (640, 1440),
      (615, 1445), (610, 1470), (590, 1530), (530, 1570), (525, 1600), (560, 1640), (585, 1720), (570, 1770), (500, 1800),
      (380, 1805), (290, 1780), (270, 1740), (295, 1650), (330, 1600), (330, 1570), (270, 1530), (240, 1460), (235, 1420),
      (160, 1400), (105, 1340), (110, 1280), (150, 1255), (35, 1160), (30, 1120), (75, 1060), (110, 990), (125, 930),
      (160, 880), (195, 850), (215, 830), (265, 790), (280, 800), (270, 880), (300, 900), (335, 850), (345, 820), (360, 830),
      (372, 780), (378, 715), (335, 705), (332, 645), (372, 630), (395, 520), (410, 400), (418, 322), (368, 300), (362, 275),
      (392, 245), (375, 200), (385, 140)]], [])
# the canopy in hall-04, seen from the floor before the dais. The white Buddha's finial and the crown of its head stand
# inside the ring: a sacred image, and another worker's, so both are painted over in the lining's own dark colour.
LINING = (27, 16, 22)      # sampled inside the ring (hall-04, 800..860 x 280..320)
C['hcanopy'] = (4, (700, 10, 1200, 420), 2,
    [[(118, 205), (160, 150), (230, 100), (330, 62), (430, 48), (540, 44), (640, 58), (730, 88), (800, 125), (850, 165),
      (900, 225), (930, 300), (942, 370), (938, 420), (905, 470), (890, 560), (885, 640), (872, 700), (840, 725), (760, 760),
      (680, 782), (625, 790), (330, 795), (240, 782), (170, 765), (120, 740), (92, 690), (88, 640), (95, 560), (75, 470),
      (55, 400), (60, 330), (80, 270)]],
    [(LINING, [(446, 398), (480, 398), (520, 520), (560, 590), (640, 660), (665, 740), (668, 820), (290, 820), (292, 740),
               (320, 660), (400, 590), (425, 520)], 10)])
# the silver column west of the white Buddha in hall-02: its spear finial and its top five drums (below them a bouquet
# stands before it, and the gold column beside it is left out: the gold ones are a tint of the silver model).
C['hdrums'] = (2, (640, 30, 800, 860), 2.4,
    [[(88, 50), (112, 60), (128, 150), (118, 240), (108, 300), (110, 350), (170, 360), (178, 400), (185, 560), (195, 600),
      (198, 790), (206, 815), (210, 1010), (214, 1040), (216, 1230), (218, 1260), (216, 1380), (78, 1380), (75, 1260),
      (68, 1240), (65, 1040), (62, 1010), (60, 810), (55, 790), (52, 600), (50, 570), (52, 400), (55, 360), (95, 350),
      (92, 300), (85, 240), (62, 140), (68, 100)]], [])
# the frame in hall-02: ONLY its moulding, the top rail and the east stile. Its picture is a photograph of a man (never
# sent, never copied), the master's head stands before its lower half and a garland hangs over its west stile, so none
# of those is inside what is kept.
C['hframe'] = (2, (110, 690, 440, 1010), 3,
    [[(198, 132), (845, 80), (870, 300), (890, 500), (905, 700), (915, 860), (806, 860), (791, 700), (776, 500), (760, 300),
      (750, 226), (200, 262)]], [])
# the master's seat in hall-03: what shows of it round the man who sits on it (his robe, his hands and his foot are
# all outside what is kept; the bottles with their labels and the book behind are above it).
C['hseat'] = (3, (0, 1380, 720, 1700), 2,
    [[(0, 300), (62, 262), (130, 238), (290, 246), (362, 266), (368, 304), (384, 328), (470, 358), (532, 386), (532, 446),
      (640, 452), (690, 488), (735, 508), (800, 486), (900, 442), (960, 412), (990, 384), (1040, 362), (1100, 370), (1160, 392),
      (1198, 410), (1190, 470), (1165, 538), (1140, 530), (1100, 520), (700, 516), (300, 486), (0, 462)]], [])
# an empty mat in hall-11 (the folded blanket lying at its far edge is cut away), and a near piece of another mat's
# satin, for its woven pattern (the dark thing lying on it and the person beside it are outside what is kept).
C['hmat'] = (11, (1080, 940, 1500, 1100), 2.6,
    [[(75, 112), (240, 100), (580, 100), (750, 94), (1020, 318), (1000, 345), (700, 365), (505, 364), (500, 392), (468, 380),
      (250, 358), (200, 300), (140, 200)]], [])
C['hmatcloth'] = (11, (1620, 1170, 2048, 1430), 2.4,
    [[(70, 105), (640, 92), (640, 285), (870, 295), (885, 418), (1004, 430), (1020, 560), (920, 570), (705, 610), (560, 540),
      (400, 420), (250, 290), (205, 245), (100, 150)]], [])
# ---- the second batch (pictures only for now)
BROWN = (62, 46, 36)       # the dried leaf of the wheel, for what is painted over inside its rim
# the brown-leaf bai sri on its gold pedestal bowl (hall-02): the lotus petals behind it are the white Buddha's base and
# the folded banknotes at its foot carry print: both outside what is kept; the small white tag on its spire painted over.
C['hbrownbaisri'] = (2, (1110, 880, 1370, 1270), 3,
    [[(352, 15), (400, 20), (418, 150), (410, 200), (425, 290), (445, 380), (450, 440), (480, 440), (520, 500), (560, 540),
      (600, 540), (680, 540), (770, 480), (780, 640), (700, 700), (660, 720), (665, 860), (690, 880), (660, 905), (600, 900),
      (540, 860), (530, 900), (500, 950), (450, 970), (440, 1000), (470, 1040), (480, 1100), (380, 1120), (270, 1110),
      (255, 1060), (290, 1010), (300, 970), (250, 940), (215, 860), (160, 870), (110, 780), (60, 700), (50, 600), (90, 460),
      (120, 400), (190, 400), (230, 480), (260, 560), (300, 580), (320, 430), (340, 300), (330, 200), (318, 150), (340, 80)]],
    [((70, 52, 44), [(392, 398), (440, 398), (440, 455), (392, 455)], 4)])
# the east green tiered column (hall-03); the white Buddha's sash and arm stand at its west side: outside what is kept
C['hgreencol'] = (3, (1235, 240, 1360, 730), 3,
    [[(185, 60), (215, 70), (300, 100), (310, 300), (300, 330), (310, 560), (300, 600), (320, 640), (325, 800), (300, 830),
      (305, 1080), (290, 1110), (300, 1290), (140, 1290), (138, 1160), (135, 770), (95, 760), (100, 600), (120, 560),
      (110, 330), (95, 300), (90, 100)]], [])
# a dark-green cone tower, twice (hall-10, hall-05): each small and soft, kept to its own outline (the printed backdrop
# behind them is another worker's)
# (16 Nov, second worker: both polygons TIGHTENED to lie inside the tower's own dark body. As first cut they kept a
#  sliver of the printed backdrop at each side, which is a printed picture with a face in it: nothing of it is kept now)
C['hconetower'] = (10, (780, 1085, 880, 1330), 5,
    [[(245, 95), (290, 150), (330, 215), (350, 330), (365, 500), (385, 700), (400, 900), (415, 1100), (420, 1215), (85, 1215),
      (90, 1000), (100, 800), (108, 600), (118, 400), (150, 225), (200, 150)]], [])
C['hconetower5'] = (5, (615, 835, 715, 1045), 5,
    [[(280, 45), (325, 105), (390, 200), (405, 400), (420, 600), (430, 800), (435, 1040), (125, 1040), (128, 800), (135, 600),
      (145, 400), (165, 200), (225, 95)]], [])
# the white lotus bouquet in its cream-and-brown patterned vase (hall-03 whole; hall-02 for the vase's pattern)
C['hlotusvase'] = (3, (1290, 640, 1500, 940), 3,
    [[(215, 70), (260, 90), (300, 160), (400, 150), (440, 200), (460, 300), (540, 360), (560, 420), (480, 470), (470, 520),
      (380, 540), (340, 560), (345, 700), (320, 800), (300, 850), (170, 850), (155, 760), (150, 650), (165, 570), (130, 540),
      (100, 500), (120, 440), (80, 400), (90, 330), (50, 280), (45, 220), (110, 190), (170, 180), (165, 130), (195, 80)]], [])
C['hlotusvase2'] = (2, (680, 555, 870, 830), 3,
    [[(330, 40), (390, 60), (400, 130), (470, 90), (510, 110), (500, 160), (520, 200), (500, 260), (420, 290), (410, 350),
      (410, 480), (400, 520), (425, 560), (425, 700), (410, 800), (250, 800), (235, 700), (240, 560), (262, 525), (215, 500),
      (150, 480), (110, 440), (100, 350), (40, 330), (30, 270), (70, 230), (60, 180), (140, 130), (230, 130), (290, 100),
      (300, 50)]], [])
# the wheel on its stacked base (hall-06: the wheel, its naga and gold spray; hall-04: its rings and the rattan stand).
# FOLDED BANKNOTES are tucked between its spokes: everything inside the rim is painted over in the leaf's brown. A
# person's hair and a gold bai sri stand before it in hall-06: outside what is kept.
C['hwheel'] = (6, (1090, 1020, 1370, 1430), 3,
    [[(500, 60), (560, 70), (575, 180), (555, 300), (640, 300), (720, 380), (770, 480), (775, 620), (760, 740), (840, 760),
      (840, 1000), (700, 1000), (690, 830), (640, 800), (560, 800), (545, 690), (500, 690), (480, 760), (440, 790), (380, 800),
      (330, 820), (200, 820), (100, 790), (70, 700), (110, 620), (190, 560), (195, 480), (215, 350), (300, 300), (330, 240),
      (430, 230), (470, 290), (510, 290), (490, 180)]],
    [(BROWN, [(460, 420), (560, 380), (660, 400), (710, 480), (720, 600), (690, 700), (600, 740), (500, 720), (450, 640),
              (440, 520)], 12)])
C['hwheel4'] = (4, (1300, 690, 1536, 1340), 2.5,
    [[(400, 0), (590, 0), (590, 1625), (200, 1625), (190, 1400), (270, 1380), (260, 900), (160, 880), (165, 700), (180, 500),
      (200, 300), (300, 150), (380, 100)]],
    [(BROWN, [(250, 430), (430, 400), (500, 320), (590, 320), (590, 760), (500, 780), (300, 760), (240, 640)], 12)])
# the west wall's naga group (hall-08): its heads, its two red bodies and its coils. A framed portrait stands behind its
# east side and a person sits before it: both outside what is kept; a fan's tripod crosses its coils and is left.
C['hnagagroup8'] = (8, (0, 990, 135, 1345), 4,
    [[(60, 120), (140, 80), (200, 150), (260, 160), (300, 250), (400, 250), (430, 300), (425, 390), (300, 410), (290, 600),
      (420, 640), (430, 900), (400, 1090), (300, 1100), (250, 1140), (245, 1400), (0, 1400), (0, 200)]], [])
# the gold naga heads on their coiled base at the altar's east end (hall-05); a candle, a bouquet and a bundle in clear
# plastic stand round it: outside what is kept
C['hnagagold'] = (5, (1250, 1130, 1470, 1470), 3.5,
    [[(150, 110), (250, 100), (300, 160), (380, 140), (480, 120), (560, 150), (600, 130), (700, 140), (770, 180), (770, 330),
      (700, 340), (660, 420), (660, 560), (690, 640), (650, 740), (560, 760), (340, 755), (290, 790), (260, 850), (290, 900),
      (300, 1000), (300, 1100), (250, 1150), (60, 1150), (30, 1080), (60, 1000), (100, 900), (150, 800), (180, 700),
      (200, 600), (200, 470), (190, 330), (160, 250), (140, 180)]], [])
# the white swan (hall-05; in hall-10 it is a white blur and is not used); a tall candle beside it: outside what is kept
C['hswan5'] = (5, (255, 1130, 365, 1250), 6,
    [[(270, 40), (380, 60), (420, 180), (520, 200), (560, 260), (540, 400), (580, 480), (590, 560), (540, 640), (280, 650),
      (240, 560), (250, 470), (160, 440), (120, 330), (130, 200), (200, 190), (250, 300), (270, 200)]], [])
# the red carved table (hall-05): its top, its apron and its east leg (a candle with a label stands before its west
# end and bowls under it: outside what is kept)
C['hredtable'] = (5, (940, 1105, 1300, 1260), 3,
    [[(45, 45), (1045, 45), (1045, 112), (45, 112)],
     [(305, 112), (1010, 112), (1005, 200), (940, 235), (920, 195), (850, 168), (780, 162), (700, 150), (540, 168), (380, 162),
      (330, 175), (305, 200)],
     [(940, 112), (1005, 112), (1000, 460), (945, 460)],
     [(55, 112), (198, 112), (198, 200), (55, 200)]], [])
# the striped floor mattress (hall-05); a person's white clothes lie over its near corner: outside what is kept
C['hstripemat'] = (5, (940, 1435, 1340, 1550), 3,
    [[(60, 50), (900, 50), (1000, 110), (1130, 180), (1140, 230), (1100, 250), (425, 250), (300, 212), (130, 158), (60, 100)]], [])
# the low table with its thick books (hall-03); a person's arm stands at its east side: outside what is kept; a small
# mark on the top book painted over
C['hbooktable'] = (3, (160, 1060, 350, 1245), 4,
    [[(200, 95), (560, 60), (720, 150), (695, 240), (680, 330), (650, 350), (640, 380), (560, 400), (420, 470), (400, 560),
      (110, 560), (70, 520), (60, 380), (100, 360), (200, 340), (200, 200)]],
    [((176, 178, 200), [(380, 98), (460, 98), (460, 140), (380, 140)], 5)])
# one soft grass broom, lying (hall-03)
C['hbroom'] = (3, (0, 1165, 350, 1335), 3,
    [[(0, 290), (280, 235), (340, 225), (420, 180), (600, 125), (610, 165), (560, 200), (430, 235), (350, 290), (300, 330),
      (150, 380), (0, 420)]], [])
# the folded cloth sets in gold satin (hall-06): what shows of them past a printed poster of a man with lettering
# (never sent) and over a crate with lettering (never sent)
C['hclothsets'] = (6, (485, 1335, 660, 1500), 4,
    [[(440, 112), (700, 102), (700, 512), (500, 512), (486, 440), (466, 300), (448, 180)]], [])
# a wall fan on the free post, twice: from its side with its bracket (hall-08), and from its front (hall-11: the white
# Buddha's shoulder, the canopy and a framed portrait stand round it: outside what is kept; its hub's badge painted over)
C['hwallfan'] = (8, (520, 795, 935, 985), 3,
    [[(50, 95), (110, 85), (200, 130), (250, 140), (350, 150), (370, 220), (500, 225), (500, 275), (360, 280), (330, 300),
      (310, 350), (330, 470), (290, 500), (230, 430), (150, 330), (80, 230), (45, 150)]], [])
C['hwallfan11'] = (11, (890, 255, 1250, 430), 3,
    [[(850, 95), (940, 110), (1000, 170), (1025, 260), (1010, 350), (960, 410), (900, 425), (820, 425), (760, 405), (720, 350),
      (700, 300), (690, 230), (720, 150), (780, 105)]],
    [((205, 205, 195), [(800, 200), (860, 200), (860, 250), (800, 250)], 5)])
# a cream horn loudspeaker on the free post (hall-11)
C['hhorn'] = (11, (890, 255, 1250, 430), 3,
    [[(640, 265), (800, 280), (800, 330), (760, 360), (720, 420), (700, 480), (650, 480), (640, 400)]], [])
# the black PA speaker box on the first east wall post (hall-07)
# (16 Nov, second worker: a pale smudge low on its front, where a maker's badge would be, is painted over in the box's black)
C['hpabox'] = (7, (1010, 890, 1100, 995), 6, [[(150, 185), (450, 185), (455, 480), (160, 480)]],
    [((12, 12, 16), [(228, 414), (306, 414), (306, 454), (228, 454)], 4)])
# the big pedestal fan on its tripod (hall-09); a child stands at its east side: outside what is kept
C['hpedfan'] = (9, (160, 915, 335, 1190), 4,
    [[(350, 130), (450, 150), (530, 220), (562, 330), (558, 420), (545, 470), (510, 540), (440, 590), (400, 600), (550, 940),
      (530, 960), (420, 760), (390, 1050), (350, 1055), (340, 760), (60, 1040), (35, 1020), (300, 640), (300, 590), (220, 560),
      (160, 480), (135, 380), (140, 280), (190, 190), (270, 140)]], [])
# the puffy three-seat sofa: the beige one by the west wall (hall-11) for its leather, the mint one by the east wall
# (hall-09) for its shape. People sit before both: outside what is kept.
C['hsofa3'] = (11, (0, 585, 265, 835), 3,
    [[(0, 110), (100, 90), (250, 70), (400, 65), (520, 110), (600, 170), (700, 200), (730, 240), (725, 460), (600, 520),
      (480, 580), (380, 620), (335, 640), (305, 560), (295, 470), (245, 400), (205, 355), (100, 345), (0, 350)]], [])
C['hsofa3mint'] = (9, (355, 1000, 600, 1150), 4,
    [[(230, 140), (330, 120), (450, 100), (560, 95), (640, 130), (700, 200), (850, 250), (880, 300), (870, 450), (850, 480),
      (600, 520), (430, 560), (228, 560), (226, 280), (150, 262), (100, 190), (112, 160)]], [])
# the strapped bundles of white cushions with the big grey ones on top (hall-07); a person stands at their west side:
# outside what is kept
C['hcushions'] = (7, (1095, 1210, 1440, 1480), 3,
    [[(268, 150), (440, 140), (450, 90), (800, 80), (820, 250), (950, 300), (960, 390), (580, 400), (570, 740), (540, 750),
      (300, 720), (285, 600), (268, 450)]], [])
# the stack of flat grey mats (hall-07); a red plastic thing at its foot: outside what is kept
C['hgreymats'] = (7, (1270, 1315, 1536, 1535), 3,
    [[(60, 95), (300, 60), (700, 120), (760, 160), (760, 360), (690, 380), (700, 600), (330, 620), (60, 440), (55, 200)]], [])
# the folded cream mattresses on the bench by the south wall (hall-09)
C['hmattresses'] = (9, (935, 955, 1245, 1135), 4,
    [[(120, 170), (210, 110), (320, 90), (420, 100), (450, 140), (600, 140), (640, 200), (1000, 180), (1060, 200), (1120, 230),
      (1110, 330), (1060, 500), (1050, 690), (990, 690), (980, 540), (130, 560), (120, 690), (80, 690), (85, 500), (110, 400)]], [])
# a square cream louvred exhaust fan on the brick (hall-09)
C['hexhaust'] = (9, (0, 700, 85, 805), 6, [[(55, 125), (390, 150), (395, 540), (70, 520)]], [])

# ---- 16 Nov, second worker: the pillows' own cloth, and reference photographs of the real KIND of thing -----------
# the triangle pillows behind the seat: only their CLOTH, where nothing of the seated man's robe and nothing of the dark
# drawstring bag that hangs on them is kept (hall-03: the red band and the plum tubes; hall-02: the woven striped end).
# The first pillow was drawn with no crop and came out crimson; the real cloth is a very dark plum.
C['hpillow3'] = (3, (590, 1040, 760, 1340), 5,
    [[(390, 322), (640, 322), (640, 482), (500, 482), (480, 422), (390, 412)],
     [(420, 882), (600, 862), (575, 1232), (400, 1262), (400, 982)]], [])
C['hpillow2'] = (2, (440, 1000, 640, 1260), 4,
    [[(150, 180), (545, 180), (545, 250), (350, 255), (335, 312), (150, 312)]], [])
# WEB REFERENCES (a string in place of a photograph's number: a file under masters/v26.0/ref/hall/web/; each folder's
# SOURCES.txt has its page). Each is cut to the object alone: a maker's mark, a telephone number, a watermark, a person
# or a figure with a face in the background is outside what is kept. They show the KIND of thing (a believer knows a
# naga and a Dhamma wheel); the hall's own piece is in Chad's photographs, and the words say which to follow for what.
C['wwheel'] = ('11-wheel-bai-sri/a/nanagarden-340570-400.jpg', (150, 140, 455, 715), 2, [], [])      # a bai sri Dhamma wheel with its naga (a maker's listing)
C['wnagakc'] = ('08-ritual-objects/naga_kham-chanot_a.jpg', (380, 180, 1010, 1260), 1, [], [])         # the many-headed naga of Kham Chanot, Udon Thani
C['wnaga3b'] = ('12-naga-statues/hd-3head-3/hdasianart-SCBR3876c-3.jpg', (0, 0, 1264, 1800), 0.6, [], [])   # a bronze three-headed naga on its coiled body
C['wnaga9'] = ('12-naga-statues/263575/nanagarden-263575-400.jpg', (0, 0, 600, 515), 1.6, [], [])     # nine gold necks fanned from one body (the heads only: a figure stands lower left)
C['wbsnaga9'] = ('13-bai-sri-naga/144652/nanagarden-144652-400.jpg', (130, 0, 600, 410), 2, [],
    [(WHITE, [(690, 630), (940, 630), (940, 820), (690, 820)])])   # a nine-headed bai sri naga of folded leaf (its watermark is below what is kept; a printed cloth beside it painted white)
C['wbsnaga1'] = ('13-bai-sri-naga/328662/nanagarden-328662-400.jpg', (60, 20, 560, 790), 1.5, [], [])  # one folded-leaf naga on its coil


def pale(name, k=0.5):
    """a reference picture's PINK AND LILAC PAPER brought to the paleness the photographs measure, in place:
        python3 -I masters/v26.0/props/crops_hallin.py --pale hpeacock
    The paper peacock was drawn in a candy pink (its tail: median saturation 0.27, value 0.80); the real one in hall-02
    and hall-03 reads a pale warm grey-pink (saturation 0.12 to 0.13 under that sitting's cool light, against a white
    floor tile at 0.13). So the saturation of every pink, magenta and lilac point is multiplied by k, eased back to 1
    between saturation 0.50 and 0.70 so the ruby gems keep theirs; gold, yellow, green and white are not touched. The
    picture as it was drawn is kept beside it as <name>-2k-asdrawn.png (the job can always be fetched again)."""
    import numpy as np
    R = os.path.join(HERE, 'refs')
    src = os.path.join(R, name + '-2k-asdrawn.png'); dst = os.path.join(R, name + '-2k.png')
    if not os.path.exists(src): os.replace(dst, src)
    a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
    mx = a.max(2); mn = a.min(2); d = mx - mn
    sat = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hue = np.zeros_like(mx); nz = d > 1e-6
    hr = (mx == r) & nz; hg = (mx == g) & nz & ~hr; hb = nz & ~hr & ~hg
    hue[hr] = ((g - b)[hr] / d[hr]) % 6; hue[hg] = (b - r)[hg] / d[hg] + 2; hue[hb] = (r - g)[hb] / d[hb] + 4
    hue *= 60
    pink = (hue >= 265) | (hue <= 12)                         # lilac through magenta and pink to rose
    ease = np.clip((sat - 0.50) / 0.20, 0, 1)                 # 0 below 0.50 (paper), 1 above 0.70 (a gem)
    f = np.where(pink, k + (1 - k) * ease, 1.0)
    out = mx[..., None] - (mx[..., None] - a) * f[..., None]  # saturation times f, value kept
    Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(dst)
    print(name, 'paled by', k, '->', dst)


def dull(name, k, lo, hi):
    """a reference picture's REDS brought down to what the photographs measure, in place, before it goes to Meshy:
        python3 -I masters/v26.0/props/crops_hallin.py --dull <name> <k> <hue from> <hue to>     (hues in degrees; a
        window that crosses 0 is written from the larger to the smaller, e.g. 320 30)
    The saturation of every point whose hue is in the window is multiplied by k, its value kept; nothing else is
    touched. The picture as it was drawn is kept beside it as <name>-2k-asdrawn.png. WHY (16 Nov, second worker): a
    generator paints its base colour sheet MORE saturated than its picture (the first triangle pillow: picture #5f232e,
    saturation 0.63, model #701728, 0.79, where the real cloth is 0.37), and a tint in the game can only multiply: it
    can make a dull red redder and never a red duller. So a red or a maroon goes to Meshy a little UNDER its measure.
      hstripemat 0.72 320 30   the mat's maroon: picture 0.71; the crop 0.48 as photographed, 0.59 seen through the
                               photograph's own black and cream (what the picture's maroon would read as there)
      hredtable  0.82 350 40   the table's varnished red-brown: picture 0.73; the crop 0.48 lit, the build sheet's base 0.65"""
    import numpy as np
    R = os.path.join(HERE, 'refs')
    src = os.path.join(R, name + '-2k-asdrawn.png'); dst = os.path.join(R, name + '-2k.png')
    if not os.path.exists(src): os.replace(dst, src)
    a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
    mx = a.max(2); mn = a.min(2); d = mx - mn
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hue = np.zeros_like(mx); nz = d > 1e-6
    hr = (mx == r) & nz; hg = (mx == g) & nz & ~hr; hb = nz & ~hr & ~hg
    hue[hr] = ((g - b)[hr] / d[hr]) % 6; hue[hg] = (b - r)[hg] / d[hg] + 2; hue[hb] = (r - g)[hb] / d[hb] + 4
    hue *= 60
    inw = ((hue >= lo) | (hue <= hi)) if lo > hi else ((hue >= lo) & (hue <= hi))
    f = np.where(inw & nz, k, 1.0)
    out = mx[..., None] - (mx[..., None] - a) * f[..., None]
    Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(dst)
    print(name, 'reds dulled by', k, 'in hues', lo, 'to', hi, '->', dst)


def fringe():
    """the canopy's bead fringe as a SHEET, cut from its own reference picture:
        python3 -I masters/v26.0/props/crops_hallin.py --fringe      -> refs/hcanopy-fringe.png (1024 x 256, with alpha)
    WHY (16 Nov, second worker): Meshy models the fringe bead by bead (of its model's 636,000 vertices 575,000 are the
    fringe), and no remesh holds that: at 12,000 triangles, at 8,000 quads and at 60,000 triangles alike it comes out
    as a band of shards (photographed). A curtain of beads is a sheet with holes, so it is drawn as one: a straight
    piece of the fringe at the picture's front middle (refs/hcanopy2-2k.png, x 700..1300, y 740..950: the bead
    columns and the row of pale-blue drops), mirrored so that it tiles, the dark lining that shows between and under
    the drops made transparent. masters/v26.0/props/canopy.mjs hangs it as a ring under the model's own drum."""
    import numpy as np
    R = os.path.join(HERE, 'refs')
    a = np.asarray(Image.open(os.path.join(R, 'hcanopy2-2k.png')).convert('RGB').crop((700, 740, 1300, 950))).astype(np.int32)
    h, w, _ = a.shape
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(2)
    yy = np.arange(h)[:, None] * np.ones((1, w), int)
    lining = (r >= g) & (r >= b) & (mx < 105) & (g < 60)             # the dark maroon lining
    alpha = np.where((yy > 150) & lining, 0, 255).astype(np.uint8)    # only under the last row of beads
    alpha[yy[:, 0] > 208] = 0
    drop = np.array([150, 200, 220])                                  # what a cut-away point is painted, so no dark rim shows where the sheet is shrunk
    rgb = np.where(alpha[..., None] == 0, drop[None, None, :], a).astype(np.uint8)
    im = Image.fromarray(np.dstack([rgb, alpha]), 'RGBA')
    tile = Image.new('RGBA', (w * 2, h)); tile.paste(im, (0, 0)); tile.paste(im.transpose(Image.FLIP_LEFT_RIGHT), (w, 0))
    tile = tile.resize((1024, 256), Image.LANCZOS)
    out = os.path.join(R, 'hcanopy-fringe.png'); tile.save(out)
    print('the fringe sheet', tile.size, '->', out, '| opaque share %.2f' % (np.asarray(tile)[..., 3] > 127).mean())


def jpg(name):
    """the committed copy of a reference picture, its longer side 1024:  --jpg <name> ...
    (the picture itself, refs/<name>-2k.png, or -1k.png for a draft made at 1k, is a PNG and git ignores it)"""
    R = os.path.join(HERE, 'refs')
    src = next(f for f in (os.path.join(R, name + t) for t in ('-2k.png', '-1k.png')) if os.path.exists(f))
    im = Image.open(src).convert('RGB'); im.thumbnail((1024, 1024), Image.LANCZOS)
    im.save(os.path.join(R, name + '-1024.jpg'), quality=90)
    print(name, os.path.basename(src), '->', name + '-1024.jpg', im.size)


if __name__ == '__main__':
    if '--jpg' in sys.argv:
        for nm in [x for x in sys.argv[1:] if not x.startswith('--')]: jpg(nm)
        raise SystemExit
    if '--fringe' in sys.argv:
        fringe(); raise SystemExit
    if '--dull' in sys.argv:
        nm, k, lo, hi = [x for x in sys.argv[1:] if not x.startswith('--')]; dull(nm, float(k), float(lo), float(hi))
        raise SystemExit
    if '--pale' in sys.argv:
        for nm in [x for x in sys.argv[1:] if not x.startswith('--')]: pale(nm)
        raise SystemExit
    a = sys.argv[1:]
    grid = '--grid' in a
    names = [x for x in a if not x.startswith('--')] or sorted(C)
    for nm in names:
        if nm not in C: print(nm, ': no such crop'); continue
        cut(nm, grid)
