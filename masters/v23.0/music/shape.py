"""v23.0 CP11 · the SHAPE of a music take: its loudness every 2 s (dB RMS), so "falls away at the end", "a held note in
the middle", "a swell to the top" can be read off the numbers. Usage: python3 shape.py raw/x.mp3 ..."""
import sys, subprocess, numpy as np
for f in sys.argv[1:]:
    b = subprocess.run(['ffmpeg','-v','quiet','-i',f,'-ac','1','-ar','22050','-f','f32le','-'],capture_output=True).stdout
    x = np.frombuffer(b, np.float32); sr = 22050; w = 2 * sr
    v = [20*np.log10(np.sqrt(np.mean(x[i:i+w]**2))+1e-9) for i in range(0, len(x)-w//2, w)]
    print(f.split('/')[-1].ljust(18), ' '.join(f'{a:5.0f}' for a in v))
