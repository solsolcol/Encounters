# v28.0 · episode 4 chapter 5, R94 (Chad, 24 Nov 2026, his pick "Full upgrade": the abilities' effects made real, every
# hit with "layered sounds"): THE NEW LAYERS, asked of ElevenLabs Sound Effects v3 (eleven_text_to_sound_v3) through
# sound/api.py exactly as sfx.py's rows (name, seconds, loop, takes, influence, the prompt, family, where it is heard).
# Grandmaster Pho's fire first (E2); the other acts' layers join this table when they are made (E3). The names are new and
# never used before (u5embers was the fire Naga's, retired at R47: an asset's name is never used again, v14.7).
#   python3 -I masters/v28.0/sound/sfxR94.py   (writes sound/sfxR94.json)
#   python3 -I masters/v28.0/sound/api.py sfx R94
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
NOBASS = ' Clear in the middle and high frequencies, no deep sub bass.'
SFX = [
    ('u5boom1', 1.5, False, 3, .5, "A ball of fire exploding as it strikes: a punchy burst of flame flaring outward with a sharp crackling snap at its front, then a short roar of fire dying away. Powerful and magical, not a gunshot, not a bomb." + NOBASS, 'fx', 'R94: a fireball landing, laid over its landing (dealt in turn)'),
    ('u5boom2', 1.5, False, 3, .5, "A magical fireball bursting against a body: a heavy whoosh of flame flaring out with a crack and a rolling crackle of fire that fades quickly. Close, powerful, not a gunshot." + NOBASS, 'fx', 'R94: a fireball landing (dealt in turn)'),
    ('u5cinders', 2.2, False, 2, .45, "Hot cinders and sparks scattering and skittering across stone paving after a burst of fire, crackling and hissing as they cool and fade away. Close, no voices." + NOBASS, 'fx', 'R94: the tail of a landing: what the burst throws out settling'),
    ('u5punch', 0.7, False, 3, .5, "A heavy blow landing on something soft and ghostly: one dense punchy impact with a short gust of air, very short and close." + NOBASS, 'fx', 'R94: the hit itself, on the frame of its freeze (a Prai struck)'),
    ('u5roar', 1.3, False, 2, .5, "A fireball igniting and roaring as it is hurled through the air: a fast rushing roar of flame that builds and trails away, crackling, close, magical." + NOBASS, 'fx', 'R94: the ball let go, under the reed\'s puff'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names), 'a name twice'
assert all(n.startswith('u5') and n.isalnum() for n in names)
json.dump([dict(name=n, secs=s, loop=l, takes=t, influence=i, prompt=p, family=f, where=w) for n, s, l, t, i, p, f, w in SFX],
          open(os.path.join(HERE, 'sfxR94.json'), 'w'), indent=1)
print(len(SFX), 'effects;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
