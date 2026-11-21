"""v28.0 · M7, THE FIGHT'S FIVE STEMS: one length, one tempo, one key, so that the engine can start all five on the fight's
first frame and bring each up or down over 0.4 s (the plan's 10.2). HOW, and why this way (each measured, sound/make.sh):
  1. ONE piece, u5m7band take c (music2.json: 96 BPM, D minor, every part playing throughout), the steadiest of three
     (its seconds within 8.5 dB for all 96 s; a and b fall silent in their last two seconds, b's parts come and go).
  2. Separated by ElevenLabs (six_stems_v1). Of its six, three hold the piece: drums (36 % of its energy, and with them
     the low strings: the separator's "bass" is silent, under -90 dBFS), piano (the struck line, 14 %, from 8 s) and other
     (the flute and the bell, 14 %); guitar holds a trace (under -40), vocals and bass nothing.
  3. The drums' stem is SPLIT at 200 Hz by a linear-phase filter and its remainder (low + high = the stem, sample for
     sample): the low strings and the drums' body below, the skins and the gongs' strike above. The traces (guitar to the
     line; bass, vocals and what the separation left out of the piece, mix minus all six, to the floor) go where they
     sound, so the first four stems SUM TO THE PIECE.
  4. The fifth, the voices, is its own piece (music3.json u5m7choir): BEATLESS, one held chord on the piece's notes, so it
     cannot fall out of a tempo it does not have; cut to the same length.
  5. ONE loop window for all four (where the piece's onsets at the window's end best match its head, searched on bar
     lengths at 96 BPM), the same crossfade for each, and the voices' own loop of the same length. All five padded for
     the engine's insets (../../v24.34/music/padloop.py's rule, done here so all five are padded alike).
  6. ONE gain for the four (the sum peaks at -3 dBFS, music's level: v22.4), so stems at volume 1 together are the piece;
     the voices levelled by their average to sit 3 dB under the piece's.
Usage: python3 -I stems.py <mix.mp3> <stemsdir> <choir.mp3> <outdir>   -> outdir/u5m7{low,drum,line,flute,voice}.wav"""
import json, os, subprocess, sys
import numpy as np
SR = 48000; P = int(0.06 * SR)
mixp, sd, chp, out = sys.argv[1:5]
os.makedirs(out, exist_ok=True)
def dec(p):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, 2).astype(np.float64)
def wav(p, y):
    y.astype(np.float32).tofile(p + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', p + '.f32', '-c:a', 'pcm_f32le', p], check=True)
    os.remove(p + '.f32')
def db(v): return 20 * np.log10(max(float(v), 1e-12))
mix = dec(mixp); S = {n: dec(os.path.join(sd, n + '.mp3')) for n in ['drums', 'bass', 'piano', 'guitar', 'vocals', 'other']}
L = min([len(mix)] + [len(v) for v in S.values()]); mix = mix[:L]; S = {k: v[:L] for k, v in S.items()}
# the stems' offset against the piece (mp3 encoder delays): the lag of the stems' sum that best meets the piece
tot = sum(S.values()).mean(1); m = mix.mean(1); seg = slice(SR * 20, SR * 30)
lags = range(-3000, 3001)
cc = [float(np.dot(m[seg], np.roll(tot, k)[seg])) for k in range(-3000, 3001, 10)]
k0 = list(range(-3000, 3001, 10))[int(np.argmax(cc))]
cc = [float(np.dot(m[seg], np.roll(tot, k)[seg])) for k in range(k0 - 10, k0 + 11)]; lag = k0 - 10 + int(np.argmax(cc))
S = {k: np.roll(v, lag, axis=0) for k, v in S.items()}
rep = {'lag_samples': lag}
resid = mix - sum(S.values())
rep['residual_dB'] = round(db(np.sqrt(np.mean(resid ** 2))) - db(np.sqrt(np.mean(mix ** 2))), 1)
# the drums' split at 200 Hz: a linear-phase low-pass (windowed sinc, 4097 taps) and the remainder
nt = 4097; t = np.arange(nt) - nt // 2; fc = 200.0 / SR
h = 2 * fc * np.sinc(2 * fc * t) * np.blackman(nt); h /= h.sum()
def lowpass(x): return np.stack([np.convolve(x[:, c], h, mode='same') for c in range(2)], 1)
dlow = lowpass(S['drums']); dhigh = S['drums'] - dlow
four = {'u5m7low': dlow + S['bass'] + S['vocals'] + resid, 'u5m7drum': dhigh, 'u5m7line': S['piano'] + S['guitar'], 'u5m7flute': S['other']}
rep['sum_check_dB'] = round(db(np.abs(sum(four.values()) - mix).max()), 1)          # the four against the piece: exact
# the loop window: bar = 2.5 s at 96 BPM; the end placed where the piece's onsets best meet the head's
hop = SR // 100
def env(a, b):
    s = m[int(a * SR):int(b * SR)]; e = np.array([np.sqrt(np.mean(s[i:i + hop] ** 2)) for i in range(0, len(s) - hop, hop)])
    return np.maximum(np.diff(np.log(e + 1e-6)), 0)
best = None
for st in np.arange(10.0, 14.01, 0.5):
    head = env(st, st + 5)
    for bars in (30, 31, 32):
        for dl in np.arange(-0.15, 0.151, 0.01):
            Ln = bars * 2.5 + dl
            if st + Ln + 6 > L / SR: continue
            tail = env(st + Ln, st + Ln + 5); n = min(len(head), len(tail))
            c = float(np.corrcoef(head[:n], tail[:n])[0, 1])
            if best is None or c > best[0]: best = (c, float(st), float(Ln))
c, st, Ln = best; rep.update(loop_start=round(st, 3), loop_len=round(Ln, 3), loop_match=round(c, 3))
X = int(1.0 * SR); a0 = int(st * SR); n = int(round(Ln * SR)); ramp = np.linspace(0, 1, X)[:, None]
def loop(x):
    y = x[a0:a0 + n].copy(); tail = x[a0 + n:a0 + n + X]
    y[:X] = y[:X] * ramp + tail * (1 - ramp); return y
def pad(y): return np.concatenate([y[-P:], y, y[:P]])
loops = {k: loop(v) for k, v in four.items()}
g = 10 ** (-3 / 20) / np.abs(sum(loops.values())).max(); rep['gain_dB'] = round(db(g), 2)
# the voices: their steadiest stretch of the same length, crossfaded over 3 s; levelled 3 dB under the piece's average
ch = dec(chp); cm = ch.mean(1)
sec = np.array([db(np.sqrt(np.mean(cm[i * SR:(i + 1) * SR] ** 2))) for i in range(len(cm) // SR)])
bst = None
for s0 in range(2, int(len(cm) / SR - Ln - 5)):
    sd_ = float(np.std(sec[s0:s0 + int(Ln) + 3]))
    if bst is None or sd_ < bst[0]: bst = (sd_, s0)
c0 = int(bst[1] * SR); XV = 3 * SR; rv = np.linspace(0, 1, XV)[:, None]
v = ch[c0:c0 + n].copy(); v[:XV] = v[:XV] * rv + ch[c0 + n:c0 + n + XV] * (1 - rv)
piece = sum(loops.values()) * g
gv = 10 ** ((db(np.sqrt(np.mean(piece ** 2))) - 3 - db(np.sqrt(np.mean(v ** 2)))) / 20); v = v * gv
if np.abs(v).max() > 10 ** (-3 / 20): v *= 10 ** (-3 / 20) / np.abs(v).max()
rep.update(voice_start=bst[1], voice_steadiness_dB=round(bst[0], 2), voice_gain_dB=round(db(gv), 2))
outs = {**{k: y * g for k, y in loops.items()}, 'u5m7voice': v}
for k, y in outs.items():
    yp = pad(y); wav(os.path.join(out, k + '.wav'), yp)
    rep[k] = dict(len=round(len(yp) / SR, 4), peak=round(db(np.abs(yp).max()), 1), rms=round(db(np.sqrt(np.mean(yp ** 2))), 1),
                  seam=round(db(np.abs(y[-1] - y[0]).max()), 1))
json.dump(rep, open(os.path.join(out, 'stems.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
