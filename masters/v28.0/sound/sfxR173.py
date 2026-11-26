# v28.0 · episode 4 chapter 5, the Naga film's charge MADE as one rise (R173, Chad, 26 Nov 2026: "Are you directing as a
# cohesive whole, or are you just randomly combining different ideas and bits and pieces?"). Mixed down from its own cues,
# the film's first 16 s had the charge peaking three times with a hole before the strike: every take of u5pwcharge
# (sfxR163.json) came back loud in its first second and dying over the rest, its brightness falling with it (read in
# halves of a second: 1200 to 200 Hz), the way R149's rumble and R157's wind came back. Asked here for exactly that shape,
# long: one great discharge decaying slowly over nine and a half seconds; turned back to front (pick.py) it is ONE rise
# from silence, its brightness climbing with it, ending at its loudest on the strike. The game keeps the name u5pwcharge
# (pick.py SFXAGAIN). Asked of ElevenLabs Sound Effects v3 through sound/api.py as sfxR163.py's rows. R98: a few credits.
#   python3 -I masters/v28.0/sound/sfxR173.py   (writes sound/sfxR173.json)
#   python3 -I masters/v28.0/sound/api.py sfx R173
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
NOV = ' No voices, no singing, no choir, no humming voice, no chanting, no bells, no chimes, no gongs, no music.'
SFX = [
    ('u5pwcharge2', 9.5, False, 3, .6, "A colossal surge of raw electric power released all at once: an enormous crackling discharge of lightning and energy with a deep powerful electric hum, then one long slow decay, the crackles thinning and the hum sinking lower and fading gradually over the whole nine and a half seconds, never stopping early." + NOV, 'fx', 'R173: the charge up the shaft to the strike (made: turned back to front)'),
]
json.dump([dict(name=n, secs=s, loop=l, takes=t, influence=i, prompt=p, family=f, where=w) for n, s, l, t, i, p, f, w in SFX],
          open(os.path.join(HERE, 'sfxR173.json'), 'w'), indent=1)
print(len(SFX), 'effects;', sum(r[3] for r in SFX), 'takes;', [len(r[5]) for r in SFX], 'characters')
