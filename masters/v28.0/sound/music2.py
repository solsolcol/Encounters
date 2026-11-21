# v28.0 · M7 MADE AGAIN, arranged for its stems (sound/music.json's u5m7fight came back, separated into six stems by
# ElevenLabs' six_stems_v1, as drums 50 % of its energy, other 11, bass 5, voices 1, and piano and guitar EMPTY: its
# xylophone, flute, gongs and choir all fell into one "other", so it could not be five layers). The piece is asked again
# with each of its five layers written FOR one of the separator's own classes, all playing from the first second to the
# last: the drums and the gongs (drums), the low strings (bass), the struck line on a piano doubled by a xylophone
# (piano), the flute and the small bell over it (other), the wordless choir (vocals); no guitar and no brass, which would
# fall between them. Three takes. Writes sound/music2.json:   python3 -I masters/v28.0/sound/music2.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
M = [('u5m7band', 96, 3, "Driving mystical battle music for a supernatural fight, 96 BPM, D minor, one steady tempo and one key from the first second to the last, no tempo change, no breakdown, no pause, no intro, no ending: every instrument plays all the way through so the piece can be looped and its parts layered. Five clear parts: 1) pounding Thai drums and frame drums with deep bronze gong hits on every bar; 2) low cellos and double basses in a driving ostinato; 3) a fast repeating piano ostinato doubled by a wooden xylophone; 4) a breathy bamboo flute melody high above, with a small bright bell; 5) a powerful wordless choir singing ah, sustained, throughout. No guitar, no brass, no lyrics.",
      'M7: the fight (one piece for five stems: sound/stems.py)')]
json.dump([dict(name=n, secs=s, takes=t, prompt=p, where=w) for n, s, t, p, w in M], open(os.path.join(HERE, 'music2.json'), 'w'), indent=1)
print(len(M), 'cue')
