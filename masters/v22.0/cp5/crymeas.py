"""v22.0 · the ghost's crying (Chad: "when the ghost appears, i want the ghost to have a pitiful crying voice echoing").
Eight takes measured: what a phone carries (band shares), the voice's pitch (a young woman's sob sits high), how many
sobs (pulses of the 50 ms envelope over its median by 6 dB), the dead air, and the words a speech model hears in it
(a take with words is out)."""
import subprocess, numpy as np, glob, json, sys
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
SR = 22050
res = {}
for p in sorted(glob.glob('raw/y4cry_*.mp3')):
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    F = np.abs(np.fft.rfft(x)) ** 2; f = np.fft.rfftfreq(len(x), 1 / SR); tot = F.sum() + 1e-12
    band = lambda a, b: float(F[(f >= a) & (f < b)].sum() / tot)
    hop = int(0.05 * SR); env = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
    db = 20 * np.log10(env + 1e-9); med = np.median(db)
    pulses = int(np.sum((db[1:-1] > med + 6) & (db[1:-1] >= db[:-2]) & (db[1:-1] > db[2:])))
    dead = float(np.mean(db < -45))
    # pitch: autocorrelation on loud 40 ms frames, 150-700 Hz
    f0s = []
    w = int(0.04 * SR)
    for i in range(0, len(x) - w, w):
        fr = x[i:i + w]
        if np.sqrt(np.mean(fr ** 2)) < 0.02: continue
        fr = fr - fr.mean(); ac = np.correlate(fr, fr, 'full')[w - 1:]
        lo, hi = int(SR / 700), int(SR / 150)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.35 * ac[0]: f0s.append(SR / k)
    segs, _ = m.transcribe(p, beam_size=5)
    text = ' '.join(s.text.strip() for s in segs)
    res[p] = dict(sub=round(band(0, 120), 3), low=round(band(120, 500), 3), mid=round(band(500, 3000), 3), air=round(band(3000, 11025), 3),
                  f0=round(float(np.median(f0s)), 1) if f0s else None, voiced=round(len(f0s) / max(1, len(x) // w), 2),
                  sobs=pulses, dead=round(dead, 2), words=text)
    print(p, json.dumps(res[p]), flush=True)
json.dump(res, open('crymeas.json', 'w'), indent=1)
