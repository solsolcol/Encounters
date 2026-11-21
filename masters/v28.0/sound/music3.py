# v28.0 · M7's FIFTH LAYER, the voices. u5m7band (sound/music2.json) separated (six_stems_v1) gave three clean continuous
# layers in take c (drums 36 % of its energy, the struck line on piano 14, the flute and bell as "other" 14) and NO choir:
# its "vocals" stem is silence (under -70 dBFS the whole way), take b's comes in only after 80 s. So the voices are made
# as their own piece, and BEATLESS, so that they cannot fall out of step with a tempo they do not have: one held wordless
# chord on the piece's own notes (take c's pitch classes, measured: D 27 %, A 20, E 9, F 9: D minor), 96 s, its length
# cut to the stems' exactly. Two takes. Writes sound/music3.json:   python3 -I masters/v28.0/sound/music3.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
M = [('u5m7choir', 96, 2, "A sustained wordless choir of low and high voices singing ah, holding one unchanging D minor chord (D, F and A) for the whole piece, no rhythm, no pulse, no beat, no melody, no chord changes, no instruments, slow swells of breath within it, mystical and powerful, steady from the first second to the last. No lyrics, no deep sub bass.",
      "M7: its fifth stem, the voices (beatless: in key and length with u5m7band c's stems)")]
json.dump([dict(name=n, secs=s, takes=t, prompt=p, where=w) for n, s, t, p, w in M], open(os.path.join(HERE, 'music3.json'), 'w'), indent=1)
print(len(M), 'cue')
