# v10.5 · a "movement" measure for a horror bed, because there are no ears here.
# Per file: the phone band (share of energy above 120 Hz), the 1 s RMS swing,
# the mean spectral FLUX (how much the spectrum changes frame to frame — swells,
# stingers and scrapes score high, a static drone scores near zero) and the
# spectral centroid (a cold shriek sits high; a rumble sits low).
import sys, subprocess, numpy as np
sr = 22050
for f in sys.argv[1:]:
    r = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar',str(sr),'-'], capture_output=True)
    x = np.frombuffer(r.stdout, dtype=np.float32)
    n = 2048; hop = 1024
    frames = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
    S = np.abs(np.fft.rfft(frames, axis=1)) + 1e-9
    fr = np.fft.rfftfreq(n, 1/sr)
    P = (S**2).sum(0)
    band = lambda a, b: P[(fr >= a) & (fr < b)].sum() / P.sum()
    Sn = S / S.sum(1, keepdims=True)
    flux = np.sqrt(((np.diff(Sn, axis=0))**2).sum(1)).mean() * 1000
    cent = (S * fr).sum(1) / S.sum(1)
    w = sr
    rms = np.array([np.sqrt((x[i*w:(i+1)*w]**2).mean()+1e-12) for i in range(len(x)//w)])
    db = 20*np.log10(rms+1e-12)
    print('%-14s %6.1fs  >120Hz %4.0f%%  120-500 %3.0f%%  500-3k %3.0f%%  >3k %3.0f%%  swing %4.1f dB  flux %5.2f  centroid %5.0f Hz' %
          (f.split('/')[-1], len(x)/sr, 100*(1-band(0,120)), 100*band(120,500), 100*band(500,3000), 100*band(3000,11025), db.max()-db.min(), flux, np.median(cent)))
