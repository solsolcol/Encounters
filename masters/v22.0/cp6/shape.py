"""CP6 · the shape of a take over time: 1 s RMS windows (dB), and the onset rate (transients a second) — a steady
pour should have a flat envelope; a music bed for a consoling scene should have no percussion (few sharp onsets)."""
import sys, subprocess, numpy as np
def load(f, sr=22050):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32), sr
for f in sys.argv[1:]:
    x, sr = load(f); w = sr // 2
    env = [20*np.log10(max(1e-9, np.sqrt(np.mean(x[i:i+w]**2)))) for i in range(0, len(x)-w, w)]
    # onsets: positive jumps of the 20 ms RMS by > 6 dB
    h = int(sr*0.02); e = np.array([np.sqrt(np.mean(x[i:i+h]**2))+1e-9 for i in range(0, len(x)-h, h)]); d = 20*np.log10(e[1:]/e[:-1])
    ons = int((d > 6).sum())
    body = np.array(env[2:-2]) if len(env) > 6 else np.array(env)
    print(f"{f:22s} onsets/s {ons/(len(x)/sr):5.2f}  env(0.5s) " + ' '.join(f"{v:5.0f}" for v in env[:40]) + (' ...' if len(env) > 40 else '') + f"   body std {body.std():.1f}")
