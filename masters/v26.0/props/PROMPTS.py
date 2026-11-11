# v26.0 · the props' reference pictures (GPT Image through Higgsfield). Each prop begins as a checked picture on white
# (Chad's rule, v24.19), made from HIS photograph of the real thing where one shows it: the object is cut out of the
# photograph (no face, no name: the sheet of names on the wheel is painted out before it leaves the machine) and goes
# in as the picture's image reference. `ref` names the crop (cut by masters/v26.0/props/crops.py from masters/v26.0/ref,
# which is never committed); `q` is the quality (max for a hero prop or a sacred one, high for stock); `ar` the shape.
HEAD = ("A studio product photograph of ONE object, complete and alone, centred, the whole of it inside the frame with "
        "a little margin, seen from its front and slightly above, on a pure white seamless background, soft even studio "
        "light, only a faint contact shadow, no hands, no people, no text, no logo, no brand. Photorealistic, sharp, "
        "true materials and colours. THE OBJECT: ")
REFNOTE = " Match the object in the reference photograph exactly: its shapes, materials, colours and proportions."
P = [
 # ---- hero props, from his photographs -------------------------------------------------------------------------
 ('baisri', 'baisri', 'max', '2:3', "a Thai 'bai sri' offering: a shiny gold embossed pedestal bowl with lotus-petal relief on a bell-shaped foot; long pointed dark-green leaves laid radiating over its rim with large yellow marigold flowers between them; above them a wreath of folded banana leaf; a cluster of yellow and orange marigolds round a small packet wrapped in clear cellophane; a pleated fan of folded banana leaf and a tall dark-green banana-leaf cone; a white jasmine garland with an orange flower hung across the cone; at the very top a bundle of thin brown incense sticks, one tall white candle and three short white candles."),
 ('wheel', 'wheel', 'max', '2:3', "the centrepiece of a Thai offering table, WITHOUT any sheet of paper: a round drum-shaped base built of tiers of dark green folded banana leaf ringed with rows of yellow marigold flowers; standing upright on it a large wheel made entirely of yellow marigold flowers, a ring with eight spokes and a round hub; an arch of upright pointed serrated dark-green banana-leaf fronds framing the wheel behind and at both sides; a small gilded lotus-bud finial above it."),
 ('naga', 'naga', 'max', '2:3', "ONE Thai naga serpent made of folded banana leaf: its neck rising upright in overlapping dark-green folded-leaf scales, a crested head with an open mouth, a long curling red tongue, small white teeth, golden trim along the crest, and a broad gold-and-black sequinned collar band round its base. One naga only, standing alone."),
 ('tower', 'tower', 'max', '9:16', "a tall slim Thai ceremonial flower tower: a single pole about 2.8 metres tall standing on a small round base, with five tiers down its length; each tier is a hanging skirt of long pointed dark-green banana-leaf fronds topped by a thick ring of yellow marigold garland; a small marigold finial at the very top."),
 ('parasol', 'parasol', 'max', '1:1', "a Thai ceremonial parasol on its pole: a wide flat-domed canopy of orange cloth with a broad band of gold brocade round its rim, a scalloped lower edge trimmed with a fringe of small white pom-poms, a dark red wooden pole with a gilded finial on top; under the canopy hangs one small yellow-and-orange tiered cloth lantern with tassels."),
 ('fan', 'fan', 'max', '2:3', "a Thai monk's ceremonial fan of peacock tail feathers: a round fan about 45 cm across, densely layered iridescent green-and-blue peacock eye feathers, bound at its base into a short turned dark wooden handle with a gilded collar. The whole fan with its handle."),
 ('nagastaff', 'staff', 'max', '9:16', "a long dark-brown carved wooden walking staff about 1.6 metres tall, standing upright, whose top is carved as the head of a naga serpent with an upswept crest, an open mouth and scales along its neck; a white cotton cord tied round the neck below the head; the plain worn shaft tapers to the foot. The whole staff from head to foot."),
 ('pewterbaisri', 'pewterbaisri', 'max', '2:3', "a Thai 'bai sri' offering on a tall silver-grey pewter pedestal bowl: a collar of green leaf points edged in gold foil, each with a small bead; rings of yellow marigolds; a square packet wrapped in brown paper; a cone of dark green folded banana leaf; brown incense sticks and one white candle standing at the top."),
 ('smallbaisri', 'smallbaisri', 'max', '1:1', "a small Thai 'bai sri' offering: three tall sharp cones of very dark green folded banana leaf rising from a ring of folded-leaf points, each cone ringed with a garland of small pale green-white crown flowers, with orange marigolds at the base, on a small round tray."),
 ('candle', 'candle', 'max', '9:16', "a giant deep-yellow beeswax temple candle: a thick smooth cylinder about 1.1 metres tall and 12 cm across with a short wick, a band of red paper with a gold pattern and no writing round its base, standing upright in a terracotta clay pot."),
 ('purple', 'purple', 'high', '2:3', "a tall arrangement of purple flowers and long green fern fronds in a shiny golden pedestal pot, about 1.1 metres tall overall."),
 ('fruit', 'fruit', 'high', '1:1', "a low round rattan tray on a woven rattan stand, heaped with tropical fruit: a large yellow mango, two pink dragon fruit, a hand of green bananas, oranges, green grapes, and a pineapple at the back."),
 ('chrys', 'chrys', 'high', '2:3', "a silver-coloured embossed aluminium Thai pedestal bowl holding a lime-green plastic basket packed with a large round bunch of white chrysanthemum daisies with yellow centres and green leaves."),
 ('sweets', 'sweets', 'high', '1:1', "a dark carved wooden Thai pedestal tray with a row of gilded lotus-petal carving round its rim, lined with banana leaf and holding assorted small Thai sweets in orange, yellow, white and pale purple."),
 ('roses', 'roses', 'high', '3:2', "a low table arrangement of pink and red roses with small white daisies and lime-green leaves in a shallow white bowl."),
 ('khantok', 'tray', 'high', '1:1', "a low round dark woven-rattan Thai pedestal tray about 40 cm across on a ring foot, holding a young green coconut with its top cut flat and a drinking straw in it, a small bottle of water with a plain blank label, a roll of white tissue and a drinking glass."),
 # ---- stock, described (no photograph shows it whole) ---------------------------------------------------------------
 ('satinpuff', None, 'high', '1:1', "a single gathered puff of glossy WHITE satin cloth wrapped round a vertical wooden pole: a ballooned drum of shiny white satin about 60 cm tall and 50 cm wide, tied in tightly at its top and bottom so it bulges in soft vertical folds; a short length of the pole shows above and below."),
 ('seatbench', None, 'high', '3:2', "a Thai hardwood garden bench in dark red-brown polished wood: a straight back of horizontal rails over a row of turned spindles, scrolled arms, a slatted seat, turned legs; about 1.5 metres wide."),
 ('seatchair', None, 'high', '1:1', "a heavy Thai carved hardwood armchair in dark red-brown polished wood, with turned arm supports, a carved back panel and a flat wooden seat."),
 ('sofa', None, 'high', '1:1', "a plump single-seat tub sofa armchair upholstered in pale mint-green fabric, with rounded arms and back and a thick seat cushion, low and soft, slightly worn."),
 ('lowtable', None, 'high', '3:2', "a low dark hardwood coffee table with turned legs and a pale cream marble top, about 45 cm high and one metre long."),
 ('petalbowl', None, 'high', '1:1', "a golden embossed Thai pedestal bowl heaped high with loose yellow and orange marigold petals."),
 ('petalsteel', None, 'high', '1:1', "a plain stainless-steel mixing bowl heaped with loose yellow and orange marigold petals."),
 ('candlemid', None, 'high', '2:3', "a deep-yellow beeswax candle 60 cm tall and 6 cm thick with a short wick, standing in a small terracotta clay pot."),
 ('candlesmall', None, 'high', '2:3', "a small plain pink wax candle 18 cm tall standing in a tiny brass holder."),
 ('kratip', None, 'high', '1:1', "a Thai sticky-rice basket: a small cylindrical lidded basket woven of natural bamboo strips with a carrying string, about 12 cm tall."),
 ('chicken', None, 'high', '3:2', "a whole boiled chicken, pale, its head and feet tucked in, lying on a round pink plastic plate, as offered at a Thai shrine."),
 ('coconut', None, 'high', '1:1', "a young green coconut with its top sliced flat, a hole cut in it and a drinking straw standing in it."),
 ('soda', None, 'high', '2:3', "a 450 ml clear plastic bottle of bright red soft drink with a blue screw cap and a plain red blank label carrying no text and no logo."),
 ('water', None, 'high', '2:3', "a 600 ml clear plastic bottle of drinking water with a white screw cap and a plain pale-blue blank label carrying no text and no logo."),
 ('plasticchair', None, 'high', '2:3', "a blue moulded plastic stacking chair with a slotted back, the kind used at Thai village events."),
 ('speaker', None, 'high', '9:16', "a grey metal horn loudspeaker, the public-address kind, mounted on top of a plain steel pole about 3.5 metres tall with a black cable running down it; no maker's name."),
 ('claypot', None, 'high', '1:1', "a plain weathered terracotta clay flower pot about 30 cm tall."),
 ('foldtable', None, 'high', '3:2', "a folding trestle table with a white laminate top and bright blue steel legs, about 1.8 metres long."),
 ('rolledmat', None, 'high', '3:2', "a rolled-up Thai woven reed mat tied with two strings, natural straw colour with thin red stripes, lying on its side."),
 ('shirt', None, 'high', '1:1', "a neatly folded plain white cotton T-shirt."),
 ('staff', None, 'high', '9:16', "a plain tall dark wooden walking staff about 1.7 metres long, a slightly crooked natural branch polished smooth by years of use, standing upright."),
 ('lotusbai', None, 'high', '2:3', "a small Thai offering: a ball of yellow marigold flowers on a short stem wrapped in banana leaf, topped with one closed pink lotus bud, standing in a small dark carved wooden bowl."),
 ('lantern', None, 'high', '9:16', "a Thai Isan tiered cloth lantern banner hanging from a short bamboo arm: a vertical string of six drum-shaped tiers of white lace-like cut cloth, each about 30 cm tall, with white tassels at the bottom."),
 ('raintree', None, 'high', '1:1', "a huge old rain tree with a thick grey-brown trunk dividing into heavy limbs and a very wide spreading umbrella crown of fine green leaves; the whole tree from its roots to its top."),
 ('mangotree', None, 'high', '2:3', "a tall old mango tree with a dark straight trunk and a dense rounded crown of long dark-green leaves; the whole tree from its roots to its top."),
]
