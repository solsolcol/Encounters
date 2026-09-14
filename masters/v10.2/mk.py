# v10.2 · the cookhouse music, again. Chad on v10.1's bed: "Why is the music so
# calming? can you choose something more neutral or more fitting? Or eerie but
# not too eerie." Four candidates over two prompts, measured on what a PHONE
# SPEAKER can carry (energy above 300 Hz), since that is the only device he
# plays on:
#   prompt 1 (a low drone)      take 1: 94.8 % under 120 Hz, 3.1 % above 300 — inaudible on a phone
#                               take 2: 80.9 % under 120 Hz, 2.0 % above 300
#   prompt 2 (a mid-register pad) take 1: 72.4 % under 120, 10.5 % above 300
#                               take 2: 2.0 % under 120, 74.2 % in 120-500, 79.9 % above 300  <- the pick
# Crossfade-looped by hand (eleven_music_v2 has no loop flag): the last 3 s
# over the head, 42 s. Levelled to e2day's peak (-10.8).
import subprocess, numpy as np
SR = 48000
def dec(p, ch=2):
    r = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac',str(ch),'-ar',str(SR),'-f','f32le','-'], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, ch).copy()
def wav(p, x):
    import wave
    x = np.clip(x, -1, 1)
    w = wave.open(p, 'wb'); w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
def norm(x, peak_db): return x * (10 ** (peak_db / 20) / (np.abs(x).max() + 1e-9))
def smooth(k): return k * k * (3 - 2 * k)
def db(x): return 20 * np.log10(np.sqrt(np.mean(x * x)) + 1e-12)
m = dec('raw/cookmusic3-2.mp3')
L = 3 * SR
body = m[L:].copy()
k = smooth(np.linspace(0, 1, L))[:, None]
body[-L:] = body[-L:] * (1 - k) + m[:L] * k
wav('w_loop.wav', norm(body, -10.8))
print('cookmusic loop', body.shape[0] / SR, 's; seam rms', round(db(body[-SR//4:]), 1), 'vs', round(db(body[:SR//4]), 1))
