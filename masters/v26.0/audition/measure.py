# v26.0 · the auditions measured: each take's length, the voice's span, its pace over the script's words, the words a
# transcriber hears (faster-whisper small.en, nothing uploaded), and its pitch (the median of the voiced frames'
# fundamental, by autocorrelation: an older, deeper voice sits lower). Run from the repo root:
#   python3 -I masters/v26.0/audition/measure.py
import json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, 'sessions.json')))
def pcm(path, sr=16000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32), sr
def span(x, sr):
    n = int(sr * 0.02); e = np.array([np.sqrt(np.mean(x[i:i + n] ** 2)) for i in range(0, len(x) - n, n)])
    on = np.where(e > 10 ** (-45 / 20))[0]
    return (on[0] * 0.02, (on[-1] + 1) * 0.02) if len(on) else (0, 0)
def pitch(x, sr):
    n = int(sr * 0.04); hop = int(sr * 0.02); f0 = []
    for i in range(0, len(x) - n, hop):
        w = x[i:i + n]
        if np.sqrt(np.mean(w ** 2)) < 10 ** (-32 / 20): continue
        w = w - w.mean(); ac = np.correlate(w, w, 'full')[n - 1:]
        lo, hi = int(sr / 320), int(sr / 60)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.45 * ac[0]: f0.append(sr / k)
    return float(np.median(f0)) if f0 else 0.0
from faster_whisper import WhisperModel
M = WhisperModel('small.en', device='cpu', compute_type='int8')
norm = lambda t: re.sub(r"[^a-z' ]", ' ', t.lower()).split()
out = {}
for name, T in S['takes'].items():
    role = name.split('-')[0]; script = norm(re.sub(r"\[[^\]]*\]", '', S['text'][role]))
    for i in (1, 2):
        p = os.path.join(HERE, 'raw', '%s-%d.mp3' % (name, i))
        x, sr = pcm(p); a, b = span(x, sr)
        segs, _ = M.transcribe(x, word_timestamps=True)      # (the samples, not the path: this box's av refuses the path)
        words = [w for s in segs for w in s.words]; heard = norm(' '.join(w.word for w in words))
        miss = [w for w in script if w not in heard]
        gaps = [words[j + 1].start - words[j].end for j in range(len(words) - 1)]
        out['%s-%d' % (name, i)] = dict(secs=round(len(x) / sr, 2), voice=[round(a, 2), round(b, 2)], wps=round(len(script) / max(0.1, b - a), 2),
                                         f0=round(pitch(x, sr)), heard=len(heard), script=len(script), missing=miss[:6], hole=round(max(gaps), 2) if gaps else 0,
                                         rms=round(20 * np.log10(np.sqrt(np.mean(x[int(a * sr):int(b * sr)] ** 2)) + 1e-9), 1))
        print(name, i, out['%s-%d' % (name, i)], flush=True)
json.dump(out, open(os.path.join(HERE, 'measures.json'), 'w'), indent=1, default=float)
