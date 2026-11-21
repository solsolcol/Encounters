#!/usr/bin/env python3
"""v28.0 · the auditions measured (a session has no ears: Chad's ear decides, the measure screens).
    python3 -I masters/v28.0/voices/audition/audition.py        (from the repo root)
For each candidate's take: the words heard (faster-whisper small.en, here: nothing uploaded) against the line's; the
voice's span; words a second over it; median pitch (autocorrelation over voiced 40 ms frames); pitch spread (the
interquartile range, semitones: a flat read or a lively one); the noise floor (the quietest tenth of the frames inside
the span, against its speaking level: a clean recording is far under it); how it ends (pick.py's own test).
Then per candidate: how far its two lines' median pitch lie apart (semitones: one person across takes, or two).
Writes audition/measures.json and prints the table."""
import json, os, re, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(HERE))
import pick as P
A = json.load(open(os.path.join(HERE, 'audition.json'), encoding='utf-8'))

def pitch(x, sr=16000):
    """median pitch by YIN (the cumulative mean normalised difference, threshold 0.15) over voiced 40 ms frames, 60 to
    320 Hz: plain autocorrelation jumps octaves on a creaky or breathy read"""
    w = int(sr * 0.04); lo, hi = int(sr / 320), int(sr / 60); out = []
    for i in range(0, len(x) - w - hi, w // 2):
        f = x[i:i + w + hi].astype(np.float64)
        if np.sqrt(np.mean(f[:w] ** 2)) < 0.01: continue
        d = np.array([np.sum((f[:w] - f[t:t + w]) ** 2) for t in range(hi + 1)])
        c = np.cumsum(d[1:]); dn = np.ones_like(d); dn[1:] = d[1:] * np.arange(1, hi + 1) / np.maximum(c, 1e-12)
        cand = np.where(dn[lo:hi] < 0.15)[0]
        if not len(cand): continue
        t = lo + cand[0]
        while t + 1 < hi and dn[t + 1] < dn[t]: t += 1
        out.append(sr / t)
    return np.array(out)

def floor_rel(x, e0, e1, sr=16000):
    """the recording's floor: its quietest 100 ms anywhere in the file against its speaking level (the 90th percentile
    of its 20 ms frames). Room tone, hiss or a bed under the voice shows here; a clean recording is 50 dB and more under"""
    w = int(sr * 0.02); d = 20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[i:i + w].astype(np.float64) ** 2)) for i in range(0, len(x) - w, w)]), 1e-9))
    if len(d) < 6: return 0.0
    q = np.convolve(d, np.ones(5) / 5, 'valid')
    return float(q.min() - np.percentile(d, 90))

from faster_whisper import WhisperModel
model = WhisperModel('small.en', device='cpu', compute_type='int8')
res = {}
for c, cv in A['candidates'].items():
    res[c] = {}
    for k in A['plan'][cv['who']]:
        p = os.path.join(HERE, 'raw', f'{c}_{k}.mp3')
        if not os.path.exists(p): continue
        m = P.measure(model, p, A['lines'][k]); x = P.pcm(p); f0 = pitch(x)
        m.update(f0=round(float(np.median(f0)), 1) if len(f0) else 0.0,
                 spread=round(float(12 * np.log2(np.percentile(f0, 75) / np.percentile(f0, 25))), 2) if len(f0) > 4 else 0.0,
                 floor=round(floor_rel(x, m['e_first'], m['e_last']), 1))
        res[c][k] = m
        print(f"{c:12} {k:6} heard {m['sim']:.2f}  voice {m['e_last']-m['e_first']:5.2f}s  {m['wps']:4.2f} w/s  f0 {m['f0']:5.1f} Hz  spread {m['spread']:4.2f} st  floor {m['floor']:6.1f} dB  hole {m['hole']:.2f}  end {'clean' if m['clean_end'] else 'CUT'}  | {m['heard'][:80]}", flush=True)
    ks = list(res[c])
    if len(ks) == 2 and res[c][ks[0]]['f0'] and res[c][ks[1]]['f0']:
        res[c]['_drift'] = round(abs(12 * np.log2(res[c][ks[0]]['f0'] / res[c][ks[1]]['f0'])), 2)
        print(f"{c:12} the two lines' pitch {res[c]['_drift']:.2f} semitones apart")
json.dump(res, open(os.path.join(HERE, 'measures.json'), 'w'), indent=1)
