"""v21.5 · level a WHISPER THAT BURSTS without flattening it. The v11.1 cast
chain (level.py: 3:1 over -22 dB, then the whole take to RMS -16, then a
limiter) is right for a spoken line and wrong for this one: the whisper is
most of the take, so the RMS gain lifted it ~8 dB, the compressor and the
limiter took ~5 dB off the shout, and the "HAH!" came out QUIETER than the
whisper's own loudest moments (ebur128 momentary: whisper up to -12.5 LUFS,
the shout -13.8). Here the two halves are levelled on their own, split in the
middle of the silence before the shout (the gain changes inside that silence,
so there is no seam to hear):
  the whisper  3:1 over its own RMS (5 ms / 120 ms), so its loudest syllables
               sit back in the hush, then RMS to WHISPER (-21: ~5 dB under the
               cast's spoken -16, momentary -17.6 LUFS at its loudest, -20.8 mean)
  the shout    gain so its loudest 50 ms frame would be SHOUT (-4): past the
               ceiling, so the limiter rides it at full level (-11.9 LUFS
               momentary, the v21.4 shouted take's own loudest moments were
               -12.9..-13.5) — 5.7 dB over the whisper's loudest moment and
               8.9 dB over its mean
  both         the lookahead limiter at -1.5 dBFS and the 8 ms / 30 ms edges
               of level.py, on the same flat cast bus as every line
Measured and not used: soft-clipping the shout (tanh) buys +2.7 dB of RMS at
the same peak but leaves a residual 18 dB under the signal — grit nobody here
can listen to first.
Usage: python3 level2.py in.wav out.wav [WHISPER_RMS] [SHOUT_FRAME] [RATIO] [OVER_DB]"""
import subprocess, sys, numpy as np
inp, outp = sys.argv[1], sys.argv[2]
WHISPER = float(sys.argv[3]) if len(sys.argv) > 3 else -21.0
SHOUT = float(sys.argv[4]) if len(sys.argv) > 4 else -4.0
RATIO = float(sys.argv[5]) if len(sys.argv) > 5 else 3.0
OVER = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
sr = 48000; CEIL = 10 ** (-1.5 / 20)
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'],
                                 capture_output=True).stdout, np.float32).astype(np.float64)
def db(v): return 20 * np.log10(max(v, 1e-12))
def rms(y): return db(np.sqrt((y ** 2).mean()))
# trim leading/trailing silence under -50 dB, keep 60 ms / 120 ms of air (as level.py)
nz = np.where(np.abs(x) > 10 ** (-50 / 20))[0]
x = x[max(0, nz[0] - int(0.06 * sr)): min(len(x), nz[-1] + int(0.12 * sr))]
# the split: the middle of the last run of 10 ms frames under -60 dB lasting >= 0.15 s
h = int(0.01 * sr); fr = np.array([db(np.sqrt(np.mean(x[i:i + h] ** 2))) for i in range(0, len(x) - h, h)])
quiet = fr < -60; runs = []; k = 0
while k < len(quiet):
    if quiet[k]:
        j = k
        while j < len(quiet) and quiet[j]: j += 1
        if (j - k) * 0.01 >= 0.15 and j < len(quiet): runs.append((k, j))
        k = j
    else: k += 1
assert runs, 'no silence before the shout'
a, b = runs[-1]; cut = ((a + b) // 2) * h
W, S = x[:cut].copy(), x[cut:].copy()
# the whisper: RATIO:1 over its own RMS + OVER dB, then to WHISPER
thr = 10 ** ((rms(W) + OVER) / 20); att = np.exp(-1 / (0.005 * sr)); rel = np.exp(-1 / (0.120 * sr)); e = 0.0
g = np.empty(len(W))
for i, v in enumerate(np.abs(W)):
    e = v + (att if v > e else rel) * (e - v)
    g[i] = 1.0 if e <= thr else (thr * (e / thr) ** (1 / RATIO)) / e
W *= g; W *= 10 ** ((WHISPER - rms(W)) / 20)
# the shout: its loudest 50 ms frame to SHOUT
f5 = int(0.05 * sr); top = max(db(np.sqrt(np.mean(S[i:i + f5] ** 2))) for i in range(0, max(1, len(S) - f5), f5 // 2))
S *= 10 ** ((SHOUT - top) / 20)
x = np.concatenate([W, S])
# lookahead limiter at CEIL (level.py's)
win = int(0.005 * sr); need = np.minimum(1.0, CEIL / np.maximum(np.abs(x), 1e-9))
lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])
r2 = np.exp(-1 / (0.060 * sr)); gg = np.empty(len(x)); cur = 1.0
for i, n in enumerate(lim):
    cur = n if n < cur else n + r2 * (cur - n); gg[i] = cur
x *= gg
n_in = int(0.008 * sr); n_out = int(0.03 * sr); x[:n_in] *= np.linspace(0, 1, n_in); x[-n_out:] *= np.linspace(1, 0, n_out)
Wn, Sn = x[:cut], x[cut:]
def top100(y): f = int(0.1 * sr); return max(db(np.sqrt(np.mean(y[i:i + f] ** 2))) for i in range(0, max(1, len(y) - f), f // 4))
print('%s: %.2f s, RMS %.2f, peak %.2f | whisper RMS %.2f, loudest 100 ms %.2f | shout loudest 100 ms %.2f, split at %.2f s'
      % (outp, len(x) / sr, rms(x), db(np.abs(x).max()), rms(Wn), top100(Wn), top100(Sn), cut / sr))
x.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', outp + '.f32', outp], check=True)
import os; os.remove(outp + '.f32')
