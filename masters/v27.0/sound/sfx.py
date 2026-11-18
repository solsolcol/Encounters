# v27.0 · episode 4 chapter 4: EVERY EFFECT AND BED, as it is asked of ElevenLabs Sound Effects v3 (eleven_text_to_sound_v3,
# the newest: Chad's rule of v22.4). A row: (name, seconds, loop, takes, the prompt, where it is heard). The length and the
# loop are the model's own parameters, never words in the prompt (v9.2). Two takes of each, measured and one picked
# (masters/v27.0/make.sh says which and why). The names are this chapter's own (`u4`: no other sound begins so; a sound
# cued from another chapter's name would become every player's download, v7.1). Writes sound/sfx.json for the workers:
#   python3 -I masters/v27.0/sound/sfx.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
SFX = [
    # ---- SPIRIT VISION (the fiftieth seam: its own sounds, the chapter's `vision.sound` and `vision.heart`). Its off is its
    #      on played backwards (made here, sound/make.sh: "the same breath, backwards", the plan's §5)
    ('u4vison', 2.0, False, 2, "A rising breath of supernatural energy: a soft airy whoosh swelling upward with a cold shimmering high tone, ending in one deep soft thump like a heartbeat leaving the body. Ethereal and eerie, no electronic beeps, no voices.", 'Spirit Vision opens'),
    ('u4visbed', 30, True, 2, "A low eerie drone of many faint breathing voices far away, wordless and sustained, with a thin high ringing like pressure in the ears and a slow cold wind under it. Unsettling and still. No words, no melody, no drums.", 'Spirit Vision: its bed while open'),
    ('u4heart', 1.0, False, 2, "One single human heartbeat, a deep close lub-dub thump inside the chest, muffled and heavy, very close microphone. Only one beat.", 'Spirit Vision: his heart'),
    # ---- HER FLAT AT NIGHT: beds (each a loop: in play they run; a film cues one as a single pass)
    ('u4flatbed', 30, True, 2, "Inside a small Singapore apartment at night: a ceiling fan turning steadily overhead with a soft rhythmic whir, a fluorescent tube light's faint hum, a refrigerator compressor in the next room. Quiet and close. No voices, no music, no television.", 'the flat in play: the living room'),
    ('u4estate', 30, True, 2, "Night outside a high-rise public housing estate heard through open window grilles: distant road traffic, a far train passing slowly on an elevated track, a neighbour's television murmuring faintly through a wall, a gecko clicking once. Indistinct, no clear words, no music.", 'the flat in play: the windows; the opening film'),
    ('u4corridor', 30, True, 2, "An open-air common corridor of a high-rise apartment block at night: a fluorescent tube light buzzing overhead, distant traffic far below, a light warm wind. No voices, no music.", 'the opening film: the corridor and the lift lobby'),
    ('u4dark', 30, True, 2, "A dark silent room at night after the power has gone out: deep stillness, a very faint low wind through metal window grilles, the soft steady crackle of a small oil lamp flame close by. No voices, no music.", 'the blessing: the dark room'),
    ('u4lift', 8.0, False, 2, "Inside a small old apartment lift going up: a steady electric motor hum, cables creaking softly, a faint ding as it passes a floor. No voices, no music.", 'the opening film: the lift'),
    # ---- the opening film's foley
    ('u4liftdoor', 2.5, False, 2, "Old metal lift doors sliding open with a soft chime in a concrete lift lobby at night, a little echo.", 'the opening film: the lift opens'),
    ('u4gate', 3.0, False, 2, "A steel grille gate at an apartment door being unlatched and swung open: a padlock click, a metal bolt sliding, hinges squeaking, a soft clank.", 'the opening film: Ravi opens the gate'),
    ('u4sandals', 4.0, False, 2, "Two people walking slowly in sandals along a smooth concrete corridor floor, their footsteps unhurried, slight echo.", 'the opening film: the corridor'),
    ('u4tile', 0.6, False, 2, "A single soft bare footstep on a smooth ceramic tile floor indoors, very close, dry, no echo.", 'his own bare feet on her tiles (shoes are left at the rack outside)'),
    # ---- the house while he listens: the horror, never cheap (a seeded stream, quieter while anyone speaks: §4.1)
    ('u4tubetick', 2.0, False, 2, "A fluorescent tube light overhead flickering: a few quick sharp electrical ticks and a short buzzing stutter, then steady again. Close.", 'history: the tube ticks'),
    ('u4fanslow', 4.0, False, 2, "A ceiling fan's motor slowing down with a falling whine and a soft clicking, then catching and spinning up again.", 'history: the fan slows and catches'),
    ('u4doorease', 3.5, False, 2, "A wooden bedroom door creaking slowly open a few centimetres on old hinges, alone in a silent room at night.", 'history: bedroom 3\'s door eases open'),
    ('u4breath', 2.5, False, 2, "A slow cold exhale very close behind the listener's ear, airy and wordless, unsettling, intimate. Only breath, no voice.", 'history: a cold breath by her chair'),
    ('u4fog', 2.5, False, 2, "A faint high glassy hiss as cold breath fogs a pane of glass, then a soft crackle as it slowly fades away.", 'history: Appa\'s photograph fogs and clears'),
    ('u4sting', 3.0, False, 2, "A sudden deep low cinematic sting: a dark heavy bass hit with a short dissonant string swell, then silence. Ominous, not loud.", 'the sight: the thing on her back looks at him'),
    # ---- the blessing and the fight
    ('u4match', 2.5, False, 2, "A wooden match struck and a small brass oil lamp's cotton wick catching from it: a soft sputter and the small flame taking, close, quiet.", 'the blessing: Mala lights the lamp; and her own second wick'),
    ('u4tubedie', 2.5, False, 2, "A fluorescent tube light dying: a sharp electrical pop, a buzzing flicker, then dead silence.", 'the blessing: the light dies'),
    ('u4fanstop', 6.0, False, 2, "A ceiling fan losing its power and winding down slowly to a stop, its whir falling and slowing, a last soft click.", 'the blessing: the fan stops'),
    ('u4tvdie', 3.0, False, 2, "An old television bursting into loud hissing white-noise static, then a sharp click as it dies to silence.", 'the blessing: the TV fills with static and dies'),
    ('u4flick', 0.8, False, 2, "A quick flick of water droplets thrown from wet fingertips through the air, a soft wet spatter.", 'the fight: FLICK'),
    ('u4patter', 1.2, False, 2, "Drops of water landing and pattering lightly on a tiled floor and on cloth.", 'the fight: the drops land'),
    ('u4dip', 1.5, False, 2, "Fingers dipping into a small metal bowl of water: a gentle splash and the bowl's faint metallic ring.", 'the fight: DIP'),
    ('u4whisper', 6.0, True, 2, "A crowd of hungry wordless whispers and soft low moans drifting through a dark room, breathy and unintelligible, slowly circling. No clear words.", 'the fight: the wanderers (always heard, panned)'),
    ('u4release', 2.5, False, 2, "A soft relieved sigh that fades upward into a faint airy shimmer, gentle and peaceful, like something let go.", 'the fight: a wanderer released'),
    ('u4large', 4.0, False, 2, "A large creature's slow heavy breathing in a dark room, deep, rasping and wet, close.", 'the fight: the large one'),
    ('u4gaspf', 1.2, False, 2, "A woman gasping sharply at a sudden touch of cold, one short frightened breath. No words.", 'the fight: a wanderer reaches Mala or Amma'),
    ('u4gaspm', 1.2, False, 2, "A man gasping sharply at a sudden touch of cold, one short startled breath. No words.", 'the fight: a wanderer reaches Ravi'),
    ('u4chill', 2.0, False, 2, "A sudden rush of icy air with a deep muffled thud, as if the breath were knocked out of the listener.", 'the fight: one reaches him'),
    ('u4husband', 3.0, False, 2, "A single low sorrowful sigh of an old man, fading away into silence, gentle. No words.", 'the fight: water thrown at Appa: he turns and fades'),
    # ---- the trance and the turning point
    ('u4cry', 8.0, False, 2, "A long inhuman wailing cry rising and tearing, mournful and terrible, holding on and breaking, like a creature being pulled away against its will. Not words, not a human scream of words.", 'the trance: the thing on her back cries out'),
    ('u4torn', 3.0, False, 2, "A sudden tearing whoosh of air rushing outward, a deep soft release, and then stillness.", 'every ending: the thing torn free of her'),
    # ---- the endings and the close
    ('u4scuffle', 4.0, False, 2, "Two men struggling on a tiled floor: clothes and shoes scuffling, a stumble, heavy breathing. No words.", 'ending A: he holds Ravi back'),
    ('u4fall', 2.0, False, 2, "A man falling heavily onto a tiled floor: a body's thud and a winded exhale.", 'ending B: the student on the floor'),
    ('u4stand', 3.5, False, 2, "An old wheelchair's brakes clicking off and its frame creaking as a woman slowly stands up from it, the soft rustle of a cotton sari.", 'every ending: she stands'),
    ('u4steps', 4.0, False, 2, "Bare feet taking a few slow, careful, uncertain steps on a smooth tiled floor indoors.", 'every ending: her first steps, to her altar'),
    ('u4bell', 3.0, False, 2, "A small brass prayer hand bell rung softly three times indoors, close, its ring dying away.", 'every ending: at her altar'),
    # ---- the flat's own noises in play: one at a time, from a seeded stream (v21.13)
    ('u4os1', 4.0, False, 2, "A lift arriving at a floor far down an apartment corridor at night: a soft chime and doors sliding open, distant, heard through a wall.", 'in play'),
    ('u4os2', 4.0, False, 2, "One person in slippers walking past outside along a concrete corridor at night, passing a closed gate and fading away.", 'in play'),
    ('u4os3', 3.0, False, 2, "A rubbish chute's metal hopper door clanking shut far away down an apartment corridor, then a bag sliding down a metal chute.", 'in play'),
    ('u4os4', 3.0, False, 2, "A dog barking twice far away outdoors at night, distant.", 'in play'),
    ('u4os5', 2.0, False, 2, "A gecko's short clicking chirp indoors at night, close.", 'in play'),
    ('u4os6', 5.0, False, 2, "A motorcycle passing far below on a road at night, distant, fading.", 'in play'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names)
assert all(r[1] <= 30 for r in SFX), 'Sound Effects v3 makes at most 30 s'
json.dump([dict(name=n, secs=s, loop=l, takes=t, prompt=p, where=w) for n, s, l, t, p, w in SFX], open(os.path.join(HERE, 'sfx.json'), 'w'), indent=1)
print(len(SFX), 'effects and beds;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
