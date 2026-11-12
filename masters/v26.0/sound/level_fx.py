"""v26.0 · A ONE-SHOT LEVELLED BY ITS LOUDEST TWENTIETH OF A SECOND, under a limiter (v23.1: "make the file louder by
its average under a limiter"; v10.7: the numpy limiter, ffmpeg's does not hold its limit).
WHY: the effects were first peak-matched, as a voice take is. A pen's stroke, a typed key, a mat laid down, a shutter:
each is a tick a millisecond long over a quiet body, so its PEAK says nothing of how loud it is (the pen's peak stood
24 dB over its loud frames). Measured against the music each is cued over (sound/levels.py), 28 of the chapter's cues
came out 11 to 31 dB under it: not heard. So each file is brought to ONE measure a cue's volume can then be set from:
its loudest 50 ms (the RMS of that frame, both channels) at TARGET, its peaks held at CEIL by a 5 ms look-ahead
limiter (80 ms release) that touches only the ticks. Nothing is compressed: under the ceiling the sound is as it was.
usage: python3 level_fx.py in.wav out.wav TARGET_dBFS CEIL_dBFS      (channels kept)"""
import subprocess, sys, numpy as np
sr = 48000
inp, outp, TARGET, CEILdb = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
CEIL = 10 ** (CEILdb / 20)
ch = int(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=channels', '-of', 'csv=p=0', inp], capture_output=True, text=True).stdout.split()[0])
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', str(ch), '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, ch).astype(np.float64)
h = sr // 20
def max50(y):
    c = np.cumsum(np.concatenate([[0.0], (y ** 2).mean(1)]))
    if len(y) <= h: return 10 * np.log10(c[-1] / max(1, len(y)) + 1e-18)
    w = (c[h:] - c[:-h]) / h                       # every 50 ms window, a sample apart: the loudest, wherever it begins
    return 10 * np.log10(w.max() + 1e-18)
def limit(y):
    pk = np.abs(y).max(1); win = int(0.005 * sr)
    need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
    lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])
    a_r = np.exp(-1 / (0.080 * sr)); gg = np.empty(len(y)); cur = 1.0
    for i, n in enumerate(lim):
        cur = n if n < cur else n + a_r * (cur - n)
        gg[i] = cur
    return y * gg[:, None], float(-20 * np.log10(gg.min()))
p0, m0 = 20 * np.log10(np.abs(x).max() + 1e-12), max50(x); cut = 0.0
for _ in range(8):
    x = x * 10 ** ((TARGET - max50(x)) / 20)
    x, c = limit(x); cut = max(cut, c)
    if abs(max50(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
print('%s: loudest 50 ms %.1f -> %.1f dBFS, peak %.1f -> %.1f dBFS, the limiter took %.1f dB at most' % (outp.split('/')[-1], m0, max50(x), p0, 20 * np.log10(np.abs(x).max() + 1e-12), cut))
x.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', str(ch), '-i', outp + '.f32', outp], check=True)
import os; os.remove(outp + '.f32')
