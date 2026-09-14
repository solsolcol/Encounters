# v10.1 · the five new sounds, mixed and looped in numpy, written as 48 kHz WAVs
# for make.sh to encode. Every pick is measured (measure.py), never heard:
#   r2hear     David take 2 — clean head/tail (-72/-86 dB), 5.20 s
#   marchcall  George take 2 — starts on silence (-51), the smoother swing (14.8 dB);
#              lowpassed at 3.2 kHz and run through a pass-by envelope over the
#              platoonmarch boots the chapter already ships, so the call is
#              heard the way a platoon going past the cookhouse is heard
#   cookchat   take 1 — seam 0.5 dB against 2.1, 6.3 % under 120 Hz against 11.3
#   kitchen    take 1 — swing 21 dB against 40 (take 2 opens on a second of silence)
#   cookmusic  take 2 — steady (swing 4.9 dB; take 1 opens on silence and swings 47),
#              crossfade-looped by hand (eleven_music_v2 has no loop flag)
import subprocess, numpy as np
SR = 48000
def dec(p, ch=2):
    r = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac',str(ch),'-ar',str(SR),'-f','f32le','-'], capture_output=True)
    x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, ch)
    return x.copy()
def wav(p, x):
    import wave
    x = np.clip(x, -1, 1)
    w = wave.open(p, 'wb'); w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
def norm(x, peak_db):
    return x * (10 ** (peak_db / 20) / (np.abs(x).max() + 1e-9))
def smooth(k): return k * k * (3 - 2 * k)

# ---- cookmusic: 45 s -> a 42 s loop, the last 3 s crossfaded over the head
m = dec('raw/cookmusic-2.mp3')
L = 3 * SR
body = m[L:].copy()
k = smooth(np.linspace(0, 1, L))[:, None]
body[-L:] = body[-L:] * (1 - k) + m[:L] * k
wav('w_cookmusic.wav', norm(body, -10.8))
# seam check: the level either side of the joint
def db(x): return 20 * np.log10(np.sqrt(np.mean(x * x)) + 1e-12)
print('cookmusic loop', body.shape[0] / SR, 's; seam rms', round(db(body[-SR//4:]), 1), 'vs', round(db(body[:SR//4]), 1))

# ---- cookchat / kitchen: highpassed, as cookamb was
for name, src in [('cookchat', 'raw/cookchat-1.mp3'), ('kitchen', 'raw/kitchen-1.mp3')]:
    r = subprocess.run(['ffmpeg','-v','error','-i',src,'-af','highpass=f=70','-ac','2','-ar',str(SR),'-f','f32le','-'], capture_output=True)
    x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
    wav(f'w_{name}.wav', norm(x, -13.2))
    print(name, x.shape[0] / SR, 's')

# ---- marchcall: the cadence voice, distant, over the boots
r = subprocess.run(['ffmpeg','-v','error','-i','raw/marchcall-2.mp3','-af','lowpass=f=3200,highpass=f=160','-ac','2','-ar',str(SR),'-f','f32le','-'], capture_output=True)
v = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
boots = dec('../../assets/audio/platoonmarch.mp3')
n = max(len(v), len(boots))
out = np.zeros((n, 2), np.float32)
# the pass-by: in over 4.5 s, full for the middle, out over the last 5 s — the
# same shape platoonmarch itself was picked for at v9.2
t = np.arange(len(v)) / SR
env = np.ones(len(v))
env[t < 4.5] = smooth(t[t < 4.5] / 4.5)
tail = t > (len(v) / SR - 5.0)
env[tail] = 1 - smooth((t[tail] - (len(v) / SR - 5.0)) / 5.0)
v = norm(v, -12.0) * env[:, None]
out[:len(v)] += v
out[:len(boots)] += norm(boots, -14.0)
wav('w_marchcall.wav', norm(out, -10.4))
print('marchcall', n / SR, 's')

# ---- r2hear: the take as it is, mono
x = dec('raw/r2hear-david-2.mp3', 1)
wav('w_r2hear.wav', x)
print('r2hear', len(x) / SR, 's')
