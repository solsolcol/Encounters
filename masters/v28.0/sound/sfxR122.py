# v28.0 · episode 4 chapter 5, R122 (Chad, 25 Nov 2026, "Do idea 1, 2, 4, 6" of R121's nine): THE NEW SOUNDS of the
# TOGETHER cut-in, a Prai caught (the slow moment and its calm white light), and the Naga's summoning (the court darkening,
# the water rising round the staff, its title). Asked of ElevenLabs Sound Effects v3 (eleven_text_to_sound_v3) through
# sound/api.py exactly as sfx.py's rows (name, seconds, loop, takes, influence, the prompt, family, where it is heard).
# Every name new and never used before (v14.7). R98: the few credits of sound are his already-given spend.
#   python3 -I masters/v28.0/sound/sfxR122.py   (writes sound/sfxR122.json)
#   python3 -I masters/v28.0/sound/api.py sfx R122
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
NOBASS = ' Clear in the middle and high frequencies, no deep sub bass.'
SFX = [
    ('u5cutin', 1.4, False, 3, .5, "A dramatic battle cut-in: two fast sharp slicing whooshes sweeping across from opposite sides, then a bright metallic ring with a short sparkle of light. Crisp, cinematic, magical, no voices." + NOBASS, 'fx', 'R122 idea 1: the TOGETHER cut-in, the two portraits slashing across the screen'),
    ('u5slowin', 1.0, False, 3, .5, "Time slowing down at a dramatic moment: a whoosh that bends downward in pitch and turns muffled and hollow, ending in one soft padded thud. Cinematic, close, no voices." + NOBASS, 'fx', 'R122 idea 2: the half second of slow motion as a Prai is caught'),
    ('u5release', 1.6, False, 3, .5, "A restless spirit calmed and at peace: a soft bright chime with airy shimmering bells rising gently upward and fading away, warm, gentle and magical, no voices." + NOBASS, 'fx', 'R122 idea 2: the red flame turned to calm white light, drawn into the bag'),
    ('u5summon', 2.6, False, 3, .5, "A great sacred power being called: a swell of rushing wind and a resonant humming drone that builds and darkens, with a clear ringing tone rising out of it, cinematic and solemn, no voices." + NOBASS, 'fx', 'R122 idea 6: the court darkening as the staff is raised for the Naga'),
    ('u5waterup', 2.0, False, 3, .5, "A column of water bursting up from the ground and spiralling upward: a powerful rushing gush of water with swirling splashes and fine spray, rising fast, magical and close, no voices." + NOBASS, 'fx', 'R122 idea 6: the water rising in a ring round the planted staff'),
    ('u5title', 2.0, False, 3, .5, "A golden title appearing in a fantasy battle: a warm cinematic impact followed by a bright shimmering golden chime and a sparkle that rings out and fades, majestic, no voices." + NOBASS, 'fx', 'R122 idea 6: the gold NAGA title'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names), 'a name twice'
assert all(n.startswith('u5') and n.isalnum() for n in names)
json.dump([dict(name=n, secs=s, loop=l, takes=t, influence=i, prompt=p, family=f, where=w) for n, s, l, t, i, p, f, w in SFX],
          open(os.path.join(HERE, 'sfxR122.json'), 'w'), indent=1)
print(len(SFX), 'effects;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
