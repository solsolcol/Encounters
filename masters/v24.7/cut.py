"""v24.7 · cut whole sentences out of a take at its own pauses (Chad, of the owner's three asks: "the shop owner talks way
too long"). Each join is placed at the QUIETEST 20 ms inside a window the word timings say is a pause (words.txt, a local
speech model over the raw take), and the two sides are crossfaded over 40 ms (equal power), so a cut lands in the room
tone between two sentences and never inside a word. Mono 48 kHz WAV out; the cast chain (prep → level → encode) follows.
Usage: python3 cut.py SRC OUT keep_from:keep_to[,window_lo:window_hi]...  — each argument is one kept stretch; an end of
the form a~b is a window to place that end in (the quietest frame inside it), a plain number is used as given"""
import subprocess, sys, numpy as np, wave
src, out, *spans = sys.argv[1:]
b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', src, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(b, np.float32).astype(np.float64); sr = 48000
hop = int(0.02 * sr)
def quietest(lo, hi):
    best, at = 1e9, lo
    for t in np.arange(lo, hi - 0.02, 0.005):
        i = int(t * sr); r = np.sqrt(np.mean(x[i:i + hop] ** 2))
        if r < best: best, at = r, t + 0.01
    return at, 20 * np.log10(best + 1e-12)
def place(s):
    if s == 'end': return len(x) / sr, None
    if '~' in s: lo, hi = map(float, s.split('~')); return quietest(lo, hi)
    return float(s), None
pieces = []
for sp in spans:
    a, bb = sp.split(':')
    ta, da = place(a); tb, db = place(bb)
    print(f'  keep {ta:.3f} -> {tb:.3f}' + (f'  (start in a {da:.1f} dB pause)' if da is not None else '') + (f'  (end in a {db:.1f} dB pause)' if db is not None else ''))
    pieces.append(x[int(ta * sr):int(tb * sr)].copy())
xf = int(0.04 * sr)
y = pieces[0]
for p in pieces[1:]:
    k = np.linspace(0, np.pi / 2, xf)
    y = np.concatenate([y[:-xf], y[-xf:] * np.cos(k) + p[:xf] * np.sin(k), p[xf:]])
fi = int(0.03 * sr); y[:fi] *= np.linspace(0, 1, fi)            # (a take begun mid-room-tone does not click in)
y = np.clip(y, -1, 1)
w = wave.open(out, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((y * 32767).astype(np.int16).tobytes()); w.close()
print(f'{out}: {len(y) / sr:.2f} s (from {len(x) / sr:.2f})')
