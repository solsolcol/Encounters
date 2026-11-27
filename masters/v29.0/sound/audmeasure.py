"""v29.0 · the auditions measured: what the transcriber hears (faster-whisper small.en, here), whether a tag was spoken,
the words a second (the game's median about 2.3, v5.30), the silence at each end, whether it ends on signal (its last
50 ms within 30 dB of its loudest: v25.5, an end on signal refused), its median pitch (a woman's voice and a man's kept
apart). Writes audition-measures.json.   python3 -I masters/v29.0/sound/audmeasure.py <folder>"""
import json, os, re, subprocess, sys
import numpy as np
D = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__)); C = json.load(open(os.path.join(HERE, 'audition.json')))
from faster_whisper import WhisperModel
M = WhisperModel('small.en', device='cpu', compute_type='int8')
def dec(p, sr=16000):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
def pitch(x, sr=16000):
    f = []; w = 640
    for i in range(0, len(x) - w, 320):
        s = x[i:i + w]
        if np.sqrt(np.mean(s ** 2)) < 0.02: continue
        ac = np.correlate(s, s, 'full')[w - 1:]; lo, hi = sr // 400, sr // 70
        k = lo + np.argmax(ac[lo:hi]);
        if ac[k] > 0.4 * ac[0]: f.append(sr / k)
    return round(float(np.median(f)), 0) if f else None
res = {}
for who, o in C.items():
    for v in o['voices']:
        for i, line in enumerate(o['lines']):
            n = f"{who}_{v['tag']}_{i + 1}"; p = os.path.join(D, n + '.mp3'); x = dec(p); L = len(x) / 16000
            segs, _ = M.transcribe(x, language='en', beam_size=5, word_timestamps=True)
            ws = [w for s in segs for w in s.words]; text = ' '.join(w.word.strip() for w in ws)
            w = 800; e = np.array([np.sqrt(np.mean(x[j:j + w] ** 2)) for j in range(0, len(x) - w, w)]); live = e > e.max() * 10 ** (-40 / 20)
            a, b = np.argmax(live) * 0.05, (len(live) - np.argmax(live[::-1])) * 0.05
            want = re.sub(r'\[[^\]]*\]\s*', '', line)
            res[n] = dict(len=round(L, 2), heard=text, said=want, tag_spoken=bool(re.search(r'\b(tired|quiet|worried)\b', text.lower())),
                          head=round(a, 2), tail=round(L - b, 2), end_on_signal=bool(e[-1] > e.max() * 10 ** (-30 / 20)),
                          wps=round(len(want.split()) / max(0.1, (ws[-1].end - ws[0].start) if ws else L), 2), f0=pitch(x))
            print(n.ljust(22), json.dumps(res[n]), flush=True)
json.dump(res, open(os.path.join(HERE, 'audition-measures.json'), 'w'), indent=1)
