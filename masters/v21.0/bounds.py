"""v21.0 · where a one-shot's sound actually is: onset = first 10 ms window within
40 dB of the take's loudest window, offset = last within 50 dB. Prints a trim
suggestion (onset - 0.01, offset + 0.05) for proc.py trim."""
import subprocess, numpy as np, sys, os
for p in sys.argv[1:]:
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True).stdout
    x = np.frombuffer(b, np.float32); sr = 48000; w = int(0.01*sr)
    e = np.array([np.sqrt(np.mean(x[i:i+w]**2)) for i in range(0, len(x)-w, w)]) + 1e-9
    d = 20*np.log10(e); m = d.max()
    on = np.argmax(d > m-40) * 0.01; off = (len(d) - np.argmax(d[::-1] > m-50)) * 0.01
    pk = np.argmax(d) * 0.01
    print(f"{os.path.basename(p):22s} len {len(x)/sr:5.2f}  onset {on:5.2f}  peak@ {pk:5.2f}  offset {off:5.2f}  -> trim {max(0,on-0.01):.2f} {min(len(x)/sr, off+0.05):.2f}")
