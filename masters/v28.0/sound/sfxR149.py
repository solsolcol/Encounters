# v28.0 · episode 4 chapter 5, R149 (Chad, 25 Nov 2026: "Also can you make the camera rumble and charge up before the naga
# gets summoned out of the stick? To make it more cinematic and dramatic."; R152: "Rumble has to be more subtle so it
# doesn't affect visibility of whats going on"): THE RUMBLE UNDER THE CHARGE, from the two powers wound up the staff to its
# strike on the paving, where it stops and the water takes over. Asked of ElevenLabs Sound Effects v3 through sound/api.py
# exactly as sfxR122.py's rows (name, seconds, loop, takes, influence, the prompt, family, where it is heard). The name is
# new and never used before (v14.7). R98: a few credits of sound are his already-given spend.
#   python3 -I masters/v28.0/sound/sfxR149.py   (writes sound/sfxR149.json)
#   python3 -I masters/v28.0/sound/api.py sfx R149
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
LOWMID = ' Its rumble gritty and textured in the low-middle range, so a small phone speaker carries it; no deep sub bass.'
SFX = [
    ('u5rumble', 4.4, False, 3, .5, "The ground trembling as a great sacred power gathers: a low rolling rumble of shaking earth and grinding stone, with a faint crackle of building energy, swelling steadily louder and tenser until it peaks at the very end, cinematic, no voices." + LOWMID, 'fx', 'R149: under the charge, from the two powers wound up the staff to its strike on the paving'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names), 'a name twice'
assert all(n.startswith('u5') and n.isalnum() for n in names)
json.dump([dict(name=n, secs=s, loop=l, takes=t, influence=i, prompt=p, family=f, where=w) for n, s, l, t, i, p, f, w in SFX],
          open(os.path.join(HERE, 'sfxR149.json'), 'w'), indent=1)
print(len(SFX), 'effects;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
