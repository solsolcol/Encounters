# v26.0 · episode 4 chapter 3: EVERY EFFECT AND BED, as it is asked of ElevenLabs Sound Effects v2
# (eleven_text_to_sound_v2). A row: (name, seconds, loop, takes, the prompt, where it is heard). The length and the loop
# are the model's own parameters, never words in the prompt (v9.2). Two takes of each, measured here and one picked
# (masters/v26.0/make.sh says which and why). Writes sound/sfx.json for the worker that generates and fetches them:
#   python3 -I masters/v26.0/sound/sfx.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = [
    # ---- the opening film: his shop at night
    ('x3shophum', 30, True, 2, "Quiet small shop interior late at night: a display fridge compressor humming steadily, a fluorescent tube's faint buzz, very distant city traffic through a closed shutter. No voices, no music.", 'opening film: the shop'),
    ('x3keys', 3.0, False, 2, "Typing a short sentence on a laptop keyboard: soft quiet key presses, close microphone, dry room.", 'opening film: the reply typed'),
    ('x3send', 1.0, False, 2, "A single soft digital message-sent whoosh from a laptop, short and gentle.", 'opening film: sent'),
    ('x3page', 1.5, False, 2, "A paper notebook slid across a glass counter and one page turned over, close and dry.", 'opening film: the notebook'),
    ('x3pen', 1.2, False, 2, "A ballpoint pen drawing one firm underline on notebook paper, close microphone.", 'opening film: each question underlined'),
    ('x3zip', 1.6, False, 2, "A backpack's zipper pulled closed in one steady pull, close microphone.", 'opening film: packed'),
    ('x3cabin', 6.0, False, 2, "Inside an airliner cabin in flight: a steady low engine and air-conditioning drone. No voices.", 'opening film: under the black'),
    # ---- the ground's beds (each a loop: in play they run; a film cues one as a single pass)
    ('x3birds', 30, True, 2, "Calm early morning in a village garden in northeast Thailand: a few songbirds, a dove cooing, light air in leaves. No traffic, no voices, no music.", 'the morning: day two, the opening, ending B'),
    ('x3festbed', 30, True, 2, "A festive outdoor temple fair in rural Thailand at midday: a few hundred people talking and laughing all around, children playing, plastic chairs shifting, a public address loudspeaker's faint hum. Indistinct crowd murmur, no clear words, no music.", 'day one: the ground'),
    ('x3afternoon', 30, True, 2, "A hot quiet afternoon outdoors in rural Thailand after a festival has ended: cicadas, a straw broom sweeping slowly, a few people talking low far away, indistinct. No music.", 'ending B: the afternoon'),
    ('x3crickets', 30, True, 2, "Night in the Thai countryside: crickets and frogs, one dog barking once far away, still warm air. No voices, no music.", 'the night between; ending B at dusk'),
    ('x3sweep', 20, False, 2, "A straw broom sweeping artificial grass in slow strokes, woven mats dragged aside, a few far voices, everything muffled and distant as if heard through closed ears.", 'ending D: the ground cleared round him'),
    ('x3waiting', 5.0, False, 2, "A few people waiting quietly outdoors: one small cough, sandals shifting on grass, cloth rustling. No words.", 'ending C: those who wait'),
    ('x3open', 22, True, 2, "A bright shimmering airy tone with very close clear birdsong and soft wind chimes: luminous, open, weightless, like the world suddenly heard close and clear. No melody, no voices.", 'OPEN AND CLOSE: the world heard open'),
    # ---- foley
    ('x3step', 0.6, False, 2, "A single soft bare footstep on short artificial grass, very close, dry.", 'his own feet, barefoot on the turf'),
    ('x3kneel', 1.3, False, 2, "A person kneeling down onto a woven straw mat: cloth rustling and knees settling, close.", 'he kneels; he bows'),
    ('x3bowall', 3.5, False, 2, "A crowd of several hundred people kneeling and bowing down together outdoors: one wide soft wave of cloth rustling, then stillness. No voices.", 'day one: the whole ground bows'),
    ('x3baitake', 1.2, False, 2, "A brass offering bowl dressed with banana leaves and flowers lifted off a table: a soft metallic ring and leaves rustling, close.", 'his bai sri taken up'),
    ('x3baiset', 1.0, False, 2, "A brass offering bowl set down gently on a woven mat: one soft dull metallic touch.", 'his bai sri set down'),
    ('x3petals', 1.8, False, 2, "A handful of flower petals thrown and pattering softly down onto cloth and hair, very gentle, close.", 'petals thrown'),
    ('x3matroll', 4.0, False, 2, "Woven straw mats being rolled up by hand on grass, dry rustling, bare feet moving on grass.", 'ending A: the mats'),
    ('x3matset', 1.0, False, 2, "A rolled straw mat dropped onto a stack of rolled mats: one soft dry thud.", 'ending A: his mat on the stack'),
    ('x3shutter', 0.6, False, 2, "A smartphone camera shutter click, single, close.", 'the night between: the photograph'),
    ('x3wick', 1.0, False, 2, "A candle wick catching fire from another flame: a soft short sputter and crackle as the wick takes, very close microphone, quiet, dry, no room echo, no music.", 'day one, in play: the woman with the taper at the offering tables (13 Nov: the plan listed it, the build had not made it)'),
    ('x3bulbs', 2.2, False, 2, "A wall switch clicked on, then a string of incandescent festoon bulbs humming softly as they light.", 'ending B: the bulbs come on'),
    ('x3cock', 2.6, False, 2, "A rooster crowing once, far away across fields at dawn, distant, open air.", 'first light'),
    ('x3bell', 2.5, False, 2, "One small temple hand bell struck once, far away, ringing out softly.", 'the answers: under his closed eyes'),
    ('x3shut', 3.0, False, 2, "A soft deep falling tone, like sound draining away, ending in a close muffled quiet as if ears were covered. Calm, not frightening.", 'ending D: the world closing'),
    ('x3tone', 6.0, False, 2, "One deep warm sustained singing bowl tone with a soft high bell struck once at its start, reverent, slowly fading.", 'the gold; the man in white'),
    ('x3trance', 3.5, False, 2, "A man breathing in sharply and letting out a low wordless voiced groan, deep in a trance, close, outdoors. No words.", 'the festival: the man whose arms rise'),
    # ---- the telling: six memories, each heard faint under his words (this chapter's own copies: a sound cued from
    #      another chapter's name would become every player's download, v7.1)
    ('x3mem1', 4.0, False, 2, "The concrete ground floor of an apartment block at night: a distant lift motor humming and a small metal burner's fire crackling, lonely, reverberant.", 'the telling: since he was a boy'),
    ('x3mem2', 4.0, False, 2, "Buddhist monks chanting together far away inside a temple hall, heard from outside as a low wordless hum, reverberant.", 'the telling: the chanting'),
    ('x3mem3', 4.0, False, 2, "A Chinese temple shrine's drum and gong struck slowly, far away, reverberant.", 'the telling: Buddha Day'),
    ('x3mem4', 4.0, False, 2, "A cold breath of air through a small shop and a glass display counter ticking and creaking faintly, quiet and eerie.", 'the telling: the piece in a shop'),
    ('x3mem5', 4.0, False, 2, "A small wind-up music box playing three slow notes and stopping, close, slightly out of tune.", 'the telling: the three kumanthong'),
    ('x3mem6', 4.0, False, 2, "A dull muffled room tone heard as if through thick cloth, pressure in the ears, low and close.", 'the telling: the fog'),
    # ---- the ground's own noises in play: one at a time, from a seeded stream (v21.13)
    ('x3os1', 3.0, False, 2, "A small child laughing and running past outdoors, short, a little far away.", 'day one, in play'),
    ('x3os2', 3.0, False, 2, "An outdoor public address loudspeaker crackling on: a short feedback squeal and two taps on the microphone, far away. No words.", 'day one, in play'),
    ('x3os3', 4.0, False, 2, "Strings of small cloth flags and long cloth banners flapping in a gust of wind, outdoors.", 'both days, in play'),
    ('x3os4', 2.5, False, 2, "Glass soda bottles clinking together in a plastic crate carried past.", 'day one, in play'),
    ('x3os5', 2.5, False, 2, "A small brass hand bell rung three times quickly, outdoors, a little far away.", 'day one, in play'),
    ('x3os6', 4.0, False, 2, "A short burst of warm applause and a few happy cheers from a small crowd outdoors, far away. No words.", 'day one, in play'),
    ('x3os7', 3.0, False, 2, "A dove cooing three times close by in a tree, calm morning.", 'day two, in play'),
    ('x3os8', 5.0, False, 2, "A small motorbike passing far away along a country road.", 'day two, in play'),
    ('x3os9', 5.0, False, 2, "A large bronze temple bell struck once far away across fields, long slow decay.", 'day two, in play'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names)
json.dump([dict(name=n, secs=s, loop=l, takes=t, prompt=p, where=w) for n, s, l, t, p, w in SFX], open(os.path.join(HERE, 'sfx.json'), 'w'), indent=1)
print(len(SFX), 'effects and beds;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
