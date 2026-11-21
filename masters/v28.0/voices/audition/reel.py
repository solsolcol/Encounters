#!/usr/bin/env python3
"""v28.0 · a LOUDNESS-MATCHED reel of each new speaker's candidates, for Chad's ear (v10.6: what is chosen on taste is his;
the build goes on with the measured pick until he answers).
    python3 -I masters/v28.0/voices/audition/reel.py        (from the repo root)
Every take is levelled by RMS to -16 dBFS under the -1.5 dBFS limiter (masters/v11.1/level.py, the cast's own level),
so no candidate wins by being louder. A reel: each candidate in turn, its two lines 0.6 s apart, 1.5 s between
candidates, in the order audition.json lists them (written into RECORD.md). mp3 128 kbps, 44.1 kHz, mono, no metadata."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
LEVEL = os.path.join(ROOT, 'masters', 'v11.1', 'level.py')
A = json.load(open(os.path.join(HERE, 'audition.json'), encoding='utf-8'))
TMP = os.path.join(HERE, '_tmp'); os.makedirs(TMP, exist_ok=True)
def run(*a): subprocess.run(list(a), check=True, capture_output=True)
def gap(s, out): run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', str(s), out)
gap(0.6, os.path.join(TMP, 'g06.wav')); gap(1.5, os.path.join(TMP, 'g15.wav'))
for who, lines in A['plan'].items():
    parts = []
    for c, cv in A['candidates'].items():
        if cv['who'] != who: continue
        for j, k in enumerate(lines):
            w = os.path.join(TMP, f'{c}_{k}.wav'); run('python3', LEVEL, os.path.join(HERE, 'raw', f'{c}_{k}.mp3'), w, '-16')
            parts += [w, os.path.join(TMP, 'g06.wav' if j == 0 else 'g15.wav')]
    lst = os.path.join(TMP, 'list.txt'); open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
    out = os.path.join(HERE, f'reel-{who}.mp3')
    run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ac', '1', '-ar', '44100', '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', out)
    print(out, [c for c, cv in A['candidates'].items() if cv['who'] == who])
for f in os.listdir(TMP): os.remove(os.path.join(TMP, f))
os.rmdir(TMP)
