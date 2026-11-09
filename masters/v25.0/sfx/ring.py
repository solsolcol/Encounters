"""v25.0 CP11 · the ringback in his ear, made a Singapore one. Both takes of "a telephone ringback tone ... one long ring"
came back as one steady 412-424 Hz tone held for 1.55 s (sfx/meas.txt: 95 % in 120-500 Hz, a flat envelope, ON signal at
both ends); a Singapore line rings 425 Hz in pairs, 0.4 s on, 0.2 s off, 0.4 s on, then 2 s of quiet. So the take's tone is
gated to that pair here: on [0, 0.4], off, on [0.6, 1.0], each edge an 8 ms raised-cosine ramp (a gate with no ramp
clicks), mono at 48 kHz. The call film cues it once; Pong answers inside the 2 s quiet that follows.
usage: python3 -I ring.py take.mp3 out.wav"""
import subprocess, sys, wave
import numpy as np
sr = 48000
src, out = sys.argv[1], sys.argv[2]
raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', src, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.float32).astype(np.float64)
n = int(1.0 * sr); x = x[int(0.05 * sr):int(0.05 * sr) + n]               # from inside the tone (its first frames are its own onset)
t = np.arange(n) / sr
r = 0.008
def edge(u):                                                              # 0 → 1 over r seconds, raised cosine
    return 0.5 - 0.5 * np.cos(np.pi * np.clip(u / r, 0, 1))
g = np.zeros(n)
for a, b in ((0.0, 0.4), (0.6, 1.0)):
    g = np.maximum(g, np.minimum(edge(t - a), edge(b - t)) * ((t >= a) & (t <= b)))
y = (x * g).clip(-1, 1)
w = wave.open(out, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((y * 32767).astype(np.int16).tobytes()); w.close()
print(f'{out}: {n / sr:.2f} s, 0.4 on / 0.2 off / 0.4 on')
