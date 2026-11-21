# v28.0 · M6 MADE AGAIN in the middle and upper registers (chapter 4's way with its opening film and ending B): both
# takes of u5m6prep (music.json) came back with 72 and 92 % of their energy under 120 Hz, so a phone's speaker plays
# 22 and 6 % of them (sound/measures-music.json). Asked again with the drum a hand drum's skin, not its boom, and the
# reed, a small gong circle and finger cymbals over it. Two takes. Writes sound/music4.json
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
M = [('u5m6prep2', 55, 2, "Ritual preparation music at night, in the middle and upper registers: a slow steady Thai hand drum played on its skin with a dry tapping tone, small finger cymbals (ching) marking the beat, a long sustained line on a Thai reed oboe (pi), a bronze gong circle playing a slow figure; it gathers slowly, solemn and tense, building to the edge of something. Instrumental, no vocals, no deep bass, no sub bass, no booming drums.",
      'M6: the preparation, and the turn (made again)')]
json.dump([dict(name=n, secs=s, takes=t, prompt=p, where=w) for n, s, t, p, w in M], open(os.path.join(HERE, 'music4.json'), 'w'), indent=1)
