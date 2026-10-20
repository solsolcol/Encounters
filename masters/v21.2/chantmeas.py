"""v21.2 · measures for picking a CHANT without ears. A proper chant is a
steady recitation: syllables at an even pulse (the envelope's modulation
peaks at 2-6 Hz and stands out), on a reciting tone (f0 varies little —
the IQR in semitones is small), with breaths between phrases. What reads as
EERIE is the opposite: sustained wavering tones (weak syllabic pulse, f0
sliding), no breaths. Also: the share of energy in the band a phone plays
(250 Hz-4 kHz), the edges, and the 2 s RMS profile."""
import subprocess, numpy as np, sys, os
def load(p, sr=22050):
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
def db(v): return 20*np.log10(max(v,1e-9))
for p in sys.argv[1:]:
    x, sr = load(p)
    dur = len(x)/sr
    F = np.abs(np.fft.rfft(x*np.hanning(len(x))))**2; f = np.fft.rfftfreq(len(x), 1/sr); T = F.sum()+1e-12
    phone = F[(f>=250)&(f<4000)].sum()/T; sub = F[f<120].sum()/T
    # the envelope at 10 ms, and its modulation spectrum
    hop = int(0.01*sr); env = np.array([np.sqrt(np.mean(x[i:i+hop]**2)) for i in range(0, len(x)-hop, hop)])
    e = env - env.mean(); M = np.abs(np.fft.rfft(e*np.hanning(len(e))))**2; fm = np.fft.rfftfreq(len(e), 0.01)
    band = (fm>=2)&(fm<=8); wide = (fm>=0.5)&(fm<=20)
    pk = fm[band][np.argmax(M[band])]; prom = M[band].sum()/max(M[wide].sum(),1e-12)
    # f0 on voiced frames (autocorrelation, 40 ms frames, 60-400 Hz)
    n = int(0.04*sr); f0s = []
    thr = np.percentile(env, 60)
    for i in range(0, len(x)-n, n):
        seg = x[i:i+n]
        if np.sqrt(np.mean(seg**2)) < thr: continue
        seg = seg - seg.mean(); ac = np.correlate(seg, seg, 'full')[n-1:]
        lo, hi = int(sr/400), int(sr/60)
        if ac[0] <= 0: continue
        j = lo + int(np.argmax(ac[lo:hi])); 
        if ac[j]/ac[0] > 0.45: f0s.append(sr/j)
    f0s = np.array(f0s)
    if len(f0s) > 10:
        st = 12*np.log2(f0s/np.median(f0s)); iqr = np.percentile(st,75)-np.percentile(st,25); med = np.median(f0s)
    else: iqr, med = -1, 0
    # breaths: gaps of 250 ms+ more than 30 dB under the loudest 2 s
    s2 = [db(np.sqrt(np.mean(x[i:i+2*sr]**2))) for i in range(0, len(x)-sr, 2*sr)]
    floor = max(s2) - 30; gaps = []; run = 0
    for v in env:
        if db(v) < floor: run += 1
        else:
            if run >= 25: gaps.append(run/100)
            run = 0
    head = db(np.sqrt(np.mean(x[:int(0.05*sr)]**2))); tail = db(np.sqrt(np.mean(x[-int(0.05*sr):]**2)))
    print(f"{os.path.basename(p):22s} {dur:6.1f}s phone {phone*100:4.1f}% sub {sub*100:4.1f}%  pulse {pk:4.2f} Hz ({prom*100:4.1f}% of 0.5-20)  f0 {med:5.0f} Hz IQR {iqr:4.2f} st  breaths {len(gaps):2d} (median {np.median(gaps) if gaps else 0:4.2f}s)  head {head:6.1f} tail {tail:6.1f}  peak {db(np.abs(x).max()):5.1f}  rms {db(np.sqrt(np.mean(x**2))):5.1f}")
