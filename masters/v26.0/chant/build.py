# v26.0 · THE CHANT (CP7.2): the three lines of homage that go with the three bows (Thanissaro Bhikkhu, A Chanting
# Guide: the captions' words are the chapter's W.cap1 to cap3), as the ground hears them over the loudspeakers, and as
# ending D hears them from a temple across the fields.
#
# One monk leads each line (Somchai, eleven_v3, "[chanting] ...": chant/sessions.json; three takes a line, the pick
# below by its length against the bow's 5.6 s, its steadiness and its end). A GROUP is made of that one take: three
# more of him, a little lower and higher (-1.2, +0.8, -0.4 semitones) and a little late (22, 41, 63 ms), so they chant
# as one and every caption stays exact. A second voice's takes (Duang) were made to chant with him and are NOT used:
# his lines ran 5.1 to 8.6 s against the lead's 3.9 to 5.7, and brought to one length they smeared; they stay in raw/.
# Then the loudspeakers: the band of a horn speaker, and the slap of an open ground.
#
# Each line is placed where its bow is (play: HOMAGE.lead 1.2 s, then a bow every 5.6 s, the caption 0.2 s in), so the
# words on screen and the words heard are one clock; timing.json holds where each line's voice really is in the file.
#   python3 -I masters/v26.0/chant/build.py      -> chant/x3chant.wav, chant/x3chantfar.wav, chant/timing.json
import json, os, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
PICK = {'c1': 'c1_lead_a', 'c2': 'c2_lead_a', 'c3': 'c3_lead_b'}
# c1 a: 5.20 s (c at 5.68 runs past its bow), one breath between its two sentences; c2 a: the one take with a clean
# end, 3.72 s of voice; c3 b: 5.28 s, the steadier of the two that fit (a's pitch wanders 4.0 semitones against 2.9)
BOW = 5.6
STARTS = {'near': [1.4, 1.4 + BOW, 1.4 + 2 * BOW], 'far': [0.5, 0.5 + BOW, 0.5 + 2 * BOW]}

def dec(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def span(x):
    w = int(SR * 0.02); d = 20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]), 1e-9))
    idx = np.where(d > d.max() - 38)[0]
    return idx[0] * w, (idx[-1] + 1) * w
def filt(x, af):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', af, '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    return np.frombuffer(p.stdout, dtype=np.float32).astype(np.float64)
def shift(x, semis):
    r = 2 ** (semis / 12.0)
    return filt(x, 'asetrate=%d,aresample=%d,atempo=%.6f' % (round(SR * r), SR, 1 / r))
def group(x):
    out = np.zeros(len(x) + SR // 4)
    for semis, ms, db in [(0, 0, 0), (-1.2, 22, -4), (0.8, 41, -5), (-0.4, 63, -7)]:
        y = x if semis == 0 else shift(x, semis); o = int(SR * ms / 1000); n = min(len(y), len(out) - o)
        out[o:o + n] += y[:n] * 10 ** (db / 20)
    return out
def rms(x): return 20 * np.log10(max(np.sqrt(np.mean(x ** 2)), 1e-9))

lines = {}
for k, name in PICK.items():
    x = dec(os.path.join(HERE, 'raw', name + '.mp3')); a, b = span(x); x = x[a:b].copy()
    f = int(SR * 0.25); x[-f:] *= np.linspace(1, 0, f) ** 1.5          # a chant's last note is let go, not cut
    lines[k] = group(x)
timing = {}
for name, starts in STARTS.items():
    total = int(SR * (starts[-1] + len(lines['c3']) / SR + 2.5)); mix = np.zeros(total)
    for (k, y), s in zip(lines.items(), starts):
        o = int(SR * s); mix[o:o + len(y)] += y
    if name == 'near':      # over the loudspeakers, on the ground
        y = filt(mix, 'highpass=f=220:poles=2,lowpass=f=4800:poles=2,aecho=0.8:0.6:110|230:0.22|0.10')
        target = -17.0
    else:                   # a temple's loudspeakers, across the fields
        y = filt(mix, 'highpass=f=350:poles=2,lowpass=f=2200:poles=2,aecho=0.8:0.7:180|390|640:0.40|0.25|0.12')
        target = -22.0
    # levelled by the RMS of where it sounds (the gaps between the lines are not the chant), under a ceiling of -1.5 dBFS
    w = int(SR * 0.05); e = np.array([np.sqrt(np.mean(y[i:i + w] ** 2)) for i in range(0, len(y) - w, w)]); live = e > e.max() * 10 ** (-30 / 20)
    cur = 20 * np.log10(np.sqrt(np.mean(np.concatenate([y[i * w:(i + 1) * w] for i in np.where(live)[0]]) ** 2)))
    y = y * 10 ** ((target - cur) / 20); peak = np.abs(y).max()
    if peak > 10 ** (-1.5 / 20): y = np.tanh(y / peak * 1.2) / np.tanh(1.2) * 10 ** (-1.5 / 20)
    f = int(SR * 0.6); y[-f:] *= np.linspace(1, 0, f)
    out = os.path.join(HERE, 'x3chant%s.wav' % ('' if name == 'near' else 'far'))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', out], input=y.astype(np.float32).tobytes(), check=True)
    timing[name] = [{'line': k, 'at': round(s, 2), 'end': round(s + (len(lines[k]) - SR // 4) / SR, 2)} for k, s in zip(lines, starts)]
    print(os.path.basename(out), '%.2f s' % (len(y) / SR), 'voice RMS %.1f dBFS' % target, 'peak %.1f' % (20 * np.log10(np.abs(y).max())), timing[name])
json.dump(timing, open(os.path.join(HERE, 'timing.json'), 'w'), indent=1)
