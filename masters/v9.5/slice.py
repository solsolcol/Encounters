"""Cut each four-word count-off take into its four numbers.

The words are found in the take's OWN envelope — a 20 ms peak envelope, a
threshold at 6 % of the take's peak, and the silences over 0.2 s between
them — so a regenerated master re-slices correctly instead of being cut at
times that were true once. Each slice is asserted to hold exactly one word."""
import subprocess, struct, wave, sys

TAKES = [('even_a.mp3', ['c1two', 'c1four', 'c1six', 'c1eight']),
         ('odd_a.mp3',  ['c1three', 'c1five', 'c1seven', 'c1nine'])]
PAD_IN, PAD_OUT, FADE = 0.045, 0.090, 0.040
TARGET = -3.8

def envelope(src):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src,
                    '-ac', '1', '-ar', '22050', '/tmp/s.wav'], check=True)
    wf = wave.open('/tmp/s.wav'); fr = wf.getnframes(); sr = wf.getframerate()
    d = struct.unpack('<%dh' % fr, wf.readframes(fr)); wf.close()
    a = [abs(x) / 32768 for x in d]
    hop = int(sr * 0.02)
    return [max(a[i:i + hop]) for i in range(0, len(a), hop)], max(a), fr / sr

def words(src):
    env, pk, dur = envelope(src)
    thr = pk * 0.06
    spans, start = [], None
    for i, v in enumerate(env):
        if v > thr and start is None: start = i
        elif v <= thr and start is not None:
            # a silence only ENDS a word once it has lasted 0.2 s
            j = i
            while j < len(env) and env[j] <= thr: j += 1
            if (j - i) * 0.02 >= 0.20 or j >= len(env):
                spans.append((start * 0.02, i * 0.02)); start = None
    if start is not None: spans.append((start * 0.02, len(env) * 0.02))
    return spans, dur

def peak_to(path, target):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path,
                          '-af', 'volumedetect', '-f', 'null', '/dev/null'],
                         capture_output=True, text=True).stderr
    cur = float([l for l in out.splitlines() if 'max_volume' in l][0]
                .split(':')[1].replace(' dB', '').strip())
    return target - cur

for src, names in TAKES:
    spans, dur = words(src)
    assert len(spans) == len(names), f'{src}: found {len(spans)} words, want {len(names)}: {spans}'
    for (a, b), name in zip(spans, names):
        s = max(0.0, a - PAD_IN); e = min(dur, b + PAD_OUT)
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{s:.3f}', '-to', f'{e:.3f}',
                        '-i', src, '-af', f'afade=t=out:st={e - s - FADE:.3f}:d={FADE}',
                        '-ar', '44100', '-ac', '1', '-f', 'wav', f'w_{name}.wav'], check=True)
        g = peak_to(f'w_{name}.wav', TARGET)
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', f'w_{name}.wav',
                        '-af', f'volume={g:.2f}dB', '-ar', '44100', '-ac', '1',
                        '-f', 'wav', f'{name}.wav'], check=True)
        # one word per slice, asserted on the slice itself
        sp2, _ = words(f'{name}.wav')
        assert len(sp2) == 1, f'{name}: slice holds {len(sp2)} words'
        print(f'{name:9s} <- {src} {a:5.2f}-{b:5.2f}  len={e - s:4.2f}  gain={g:+5.2f}dB')
