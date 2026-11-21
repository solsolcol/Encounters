"""v28.0 · THE COUNT'S NINE NOTES (the plan's 10.1: "the count falling: nine notes, each a step higher than the last, so the
fight's progress is a rising scale"), MADE from one struck bowl (sfx.json u5bowl, the pick in picks.json): its strongest
partial measured, then the take resampled so that partial lands on each note of a rising D minor pentatonic ladder in
the fight's own key (M7 is D minor, measured: sound/music3.py), D5 F5 G5 A5 C6 D6 F6 G6 A6. A resampled bowl rings
shorter as it rises, as a smaller bowl does. Each note faded out by 2.5 s, its loudest 50 ms at -14 dBFS
(../../v26.0/sound/level_fx.py), mono. Writes <out>/u5note1..9.wav:   python3 -I notes.py <bowl.mp3> <out>"""
import os, subprocess, sys
import numpy as np
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True); SR = 48000
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(r, np.float32).astype(np.float64)
# its RING, not its strike: 0.3 to 1.3 s after the loudest sample, zero-padded eightfold (the strike's own spectrum put the
# first pass 8.8 % flat: note 1 came out at 639 Hz for 587)
i0 = int(np.argmax(np.abs(x))); seg = x[i0 + int(0.3 * SR):i0 + int(1.3 * SR)]
X = np.abs(np.fft.rfft(seg * np.hanning(len(seg)), 8 * len(seg))); f = np.fft.rfftfreq(8 * len(seg), 1 / SR)
m = (f > 150) & (f < 3000); f0 = float(f[m][np.argmax(X[m])])
LADDER = [587.33, 698.46, 783.99, 880.0, 1046.5, 1174.66, 1396.91, 1567.98, 1760.0]
print(f'the bowl: strongest partial {f0:.1f} Hz')
here = os.path.dirname(os.path.abspath(__file__)); lv = os.path.join(here, '..', '..', 'v26.0', 'sound', 'level_fx.py')
for k, t in enumerate(LADDER, 1):
    rate = t / f0; w = os.path.join(out, f'n{k}.wav'); o = os.path.join(out, f'u5note{k}.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-af',
                    f'aresample={SR},asetrate={SR * rate:.1f},aresample={SR},atrim=end=2.6,afade=t=out:st=1.6:d=1.0', w], check=True)
    subprocess.run(['python3', '-I', lv, w, o, '-14', '-2'], check=True); os.remove(w)
    print(f'u5note{k}: {t:.1f} Hz (rate {rate:.3f})')
