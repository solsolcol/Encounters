"""v21.0 · music measures (the v20.1 set): share of energy in the band a phone
speaker plays (250 Hz-4 kHz), spectral centroid, note attacks per second (an
onset = a 30 ms frame >6 dB over the one before), the 2 s RMS profile, and when
the body arrives (first 2 s window within 6 dB of the loudest)."""
import subprocess, numpy as np, sys, os
for p in sys.argv[1:]:
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar','44100','-f','f32le','-'],capture_output=True).stdout
    x = np.frombuffer(b, np.float32); sr = 44100
    F = np.abs(np.fft.rfft(x*np.hanning(len(x))))**2; f = np.fft.rfftfreq(len(x), 1/sr); T = F.sum()+1e-12
    phone = F[(f>=250)&(f<4000)].sum()/T; cen = (f*F).sum()/T
    w = int(0.03*sr); e = np.array([np.sqrt(np.mean(x[i:i+w]**2)) for i in range(0,len(x)-w,w)])+1e-9; d = 20*np.log10(e)
    ons = np.sum((d[1:]-d[:-1] > 6) & (d[1:] > d.max()-30)) / (len(x)/sr)
    s2 = [20*np.log10(np.sqrt(np.mean(x[i:i+2*sr]**2))+1e-9) for i in range(0, len(x)-sr, 2*sr)]
    body = next((i*2 for i,v in enumerate(s2) if v > max(s2)-6), -1)
    print(f"{os.path.basename(p):18s} phone {phone*100:5.1f}%  centroid {cen:6.0f}  attacks/s {ons:4.2f}  body@{body:3d}s  2s[{' '.join(f'{v:4.0f}' for v in s2)}]")
