"""v29.0 · every file of the chapter's sound measured as the game will play it (both encodings, v9.6): its length, its
peak (both channels), its loudest 50 ms, and its END: the last 10 ms against its loudest 50 ms (an effect must end in
quiet, never on its own sound: v25.5). Writes measures-out.json.   python3 -I masters/v29.0/sound/endcheck.py <dir with audio/ and audio-opus/>"""
import json, os, subprocess, sys
import numpy as np
D = sys.argv[1]; R = os.path.dirname(os.path.abspath(__file__)); P = json.load(open(os.path.join(R, 'picks.json'))); res = {}; bad = 0
for n, o in sorted(P.items()):
    for ext, d in (('.mp3', 'audio'), ('.ogg', 'audio-opus')):
        x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(D, d, n + ext), '-ac', '2', '-ar', '48000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).astype(float).reshape(-1, 2)
        m = (x ** 2).mean(1); w = 2400; c = np.cumsum(np.concatenate([[0], m])); e = np.sqrt((c[w:] - c[:-w]) / w)
        loud = 20 * np.log10(e.max() + 1e-12); tail = 20 * np.log10(np.sqrt(m[-480:].mean()) + 1e-12); pk = 20 * np.log10(np.abs(x).max() + 1e-12)
        r = dict(secs=round(len(x) / 48000, 3), peak=round(pk, 1), loud=round(loud, 1), end=round(tail - loud, 1)); res.setdefault(n, {})[ext] = r
        flag = (o['kind'] == 'fx' and r['end'] > -35) or pk > -0.3
        bad += flag
        if flag: print(n.ljust(14), ext, r)
json.dump(res, open(os.path.join(R, 'measures-out.json'), 'w'), indent=0)
print(len(res), 'sounds measured,', bad, 'flagged')
