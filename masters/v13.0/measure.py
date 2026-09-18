# v13.0 CP3 — the measure. Voice: duration, the head and tail EDGES (a take that
# ends ON signal clicks through the v5.30 envelope), pace. SFX: duration, peak,
# and the PHONE BAND split (v10.4: a phone speaker plays almost nothing under
# 120 Hz), plus the decay, because a sting that does not get out of the way is
# a sting that sits on the next line.
import sys, json, subprocess, numpy as np
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','48000','-f','f32le','-'],
                         capture_output=True).stdout
    return np.frombuffer(raw, np.float32)
SR = 48000
def db(x): return float(20*np.log10(max(float(x), 1e-9)))
def bands(x):
    X = np.abs(np.fft.rfft(x*np.hanning(len(x)))); f = np.fft.rfftfreq(len(x), 1/SR); E = X**2
    t = E.sum() or 1
    return {"sub120": float(E[f<120].sum()/t), "mid": float(E[(f>=120)&(f<500)].sum()/t),
            "voice": float(E[(f>=500)&(f<3000)].sum()/t), "air": float(E[f>=3000].sum()/t)}
out = {}
for p in sys.argv[1:]:
    x = load(p); n = len(x)
    if n < 100: out[p] = {'EMPTY': True}; continue
    pk = db(np.abs(x).max()); rms = db(np.sqrt((x*x).mean()))
    w = SR//50
    fr = np.array([db(np.sqrt((x[i:i+w]**2).mean())) for i in range(0, n-w, w)])
    head = float(np.mean(fr[:4]) - rms)          # +ve = starts loud (a click)
    tail = float(np.mean(fr[-4:]) - rms)         # +ve = ends ON signal
    # how long after the peak until it is 30 dB down (a sting's decay)
    pi = int(np.argmax(np.abs(x))); dec = None
    for i in range(pi//w, len(fr)):
        if fr[i] < pk - 30: dec = (i*w - pi)/SR; break
    out[p] = {'secs': round(n/SR,2), 'peak': round(pk,2), 'rms': round(rms,2),
              'head': round(head,1), 'tail': round(tail,1),
              'decay30': (round(dec,2) if dec is not None else None),
              **{k: round(v*100,1) for k,v in bands(x).items()}}
print(json.dumps(out, indent=1))
