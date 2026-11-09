"""v25.0 CP11 · an effect's shape without ears: its loudness in 50 ms frames drawn as a bar line (one glyph a frame,
eight steps from 48 dB under its peak to the peak), with how many separate EVENTS it holds (rises of 12 dB or more
out of a dip), and the share a phone speaker plays (a 250 Hz high-pass twice, the v24.0 phone-band level: the dB a
phone loses against the full take). Used beside ../../v22.0/cp5/meas.py to pick between two takes of one effect.
usage: python3 -I envelope.py raw/*.mp3"""
import re, subprocess, sys, os
import numpy as np

def load(f, sr=44100):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64), sr

def db(v):
    return 20 * np.log10(np.maximum(v, 1e-9))

def phone(f):
    """the dB a phone loses: the take's RMS against its RMS through two 2-pole high-passes at 250 Hz (ffmpeg)"""
    def rms(af):
        e = subprocess.run(['ffmpeg', '-v', 'info', '-i', f, '-af', af + 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
        m = re.search(r'mean_volume:\s*(-?[\d.]+) dB', e)
        return float(m.group(1)) if m else -99.0
    return rms('') - rms('highpass=f=250:poles=2,highpass=f=250:poles=2,')

GLYPH = ' ▁▂▃▄▅▆▇█'
for f in sys.argv[1:]:
    x, sr = load(f)
    if not len(x):
        print(os.path.basename(f), 'EMPTY'); continue
    win = int(sr * 0.05)
    fr = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, len(x) - win + 1, win)])
    fd = db(fr); top = fd.max()
    rel = np.clip((fd - (top - 48)) / 48, 0, 1)
    line = ''.join(GLYPH[int(round(v * 8))] for v in rel)
    ev, low = 0, fd[0]                                   # events: a rise of 12 dB out of the lowest point since the last
    armed = True
    for v in fd:
        if armed and v - low >= 12 and v > top - 30:
            ev += 1; armed = False; low = v
        elif not armed and v < low - 10:
            armed = True; low = v
        elif armed:
            low = min(low, v)
    loss = phone(f)
    print(f'{os.path.basename(f):22s} {len(x) / sr:5.2f}s ev{ev:2d} phone-{loss:4.1f}dB |{line}|')
