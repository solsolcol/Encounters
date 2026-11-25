# v28.0 · episode 4 chapter 5, R157 (Chad, 25 Nov 2026: "Do 1, 2, 3, 5, 6 cleanly", of the eight ideas for the start of the
# Naga film): THE SOUNDS OF THREE OF THEM. 1: "a moment of near-silence just before they bring the stick down onto the
# ground, then the boom" (the boom is u5strikeboom: the near-silence is the film's own, the world's sound held down);
# 3: "wind building toward the stick as the power grows, pulling robes and dust in" (u5windpull); 5: "a close-up of the eyes
# on the stick's carved Naga head lighting up just before it hits the ground" (u5eyeglint). Asked of ElevenLabs Sound
# Effects v3 through sound/api.py exactly as sfxR149.py's rows (name, seconds, loop, takes, influence, the prompt, family,
# where it is heard). The names are new and never used before (v14.7). R98: a few credits of sound are his already-given spend.
#   python3 -I masters/v28.0/sound/sfxR157.py   (writes sound/sfxR157.json)
#   python3 -I masters/v28.0/sound/api.py sfx R157
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
LOWMID = ' Its weight punchy and textured in the low-middle range, so a small phone speaker carries it; no deep sub bass alone.'
SFX = [
    ('u5strikeboom', 2.8, False, 3, .55, "A huge cinematic impact boom as a sacred wooden staff is struck down onto stone paving and releases a wave of power and water: a hard punchy thud with a bright crack on its front, a rushing burst of water spraying outward across the ground, and a short rolling tail fading away, no voices." + LOWMID, 'fx', 'R157 idea 1: the boom as the stick hits the ground, straight after the near-silence'),
    ('u5windpull', 3.4, False, 3, .5, "Wind rushing inward from all around toward one point, building fast: a swirling airy whoosh gathering speed and rising in pitch, dust and grit hissing along the ground as it is pulled in, starting soft and growing steadily louder until it is strongest at the very end, cinematic, no voices.", 'fx', 'R157 idea 3: the wind drawn in toward the stick as the power grows, cut by the near-silence'),
    ('u5eyeglint', 1.8, False, 3, .5, "Two eyes of a carved sacred serpent head lighting up with power: a soft bright magical shimmer, a clear crystalline chime and a short glowing hum that swells and then fades, cinematic, no voices.", 'fx', 'R157 idea 5: the eyes of the stick\'s carved Naga head lighting up in the close-up'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names), 'a name twice'
assert all(n.startswith('u5') and n.isalnum() for n in names)
json.dump([dict(name=n, secs=s, loop=l, takes=t, influence=i, prompt=p, family=f, where=w) for n, s, l, t, i, p, f, w in SFX],
          open(os.path.join(HERE, 'sfxR157.json'), 'w'), indent=1)
print(len(SFX), 'effects;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
