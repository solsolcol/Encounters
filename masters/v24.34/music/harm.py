"""v24.34 · how much a phone hears of a low drone, before and after its own harmonics are laid under it (v24.0's w4heart
recipe: the low band driven into a soft clip, which makes 2nd/3rd/4th harmonics a phone can play, high-passed so the
added layer holds nothing under 180 Hz, mixed back at H dB). Prints, per strength: the dB a phone loses (two 250 Hz
high-passes), and how much the layer changes the full-range take (its RMS against the original's). Usage: harm.py in.wav"""
import subprocess, sys, numpy as np
src = sys.argv[1]
def rms(path, af=None):
    a = ['ffmpeg', '-v', 'quiet', '-i', path] + (['-af', af] if af else []) + ['-ac', '1', '-ar', '22050', '-f', 'f32le', '-']
    x = np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.float32)
    return 20 * np.log10(np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-12)
HP = 'highpass=f=250:poles=2,highpass=f=250:poles=2'
print(f'original: rms {rms(src):.1f}  phone-lost {rms(src) - rms(src, HP):.1f} dB')
for H in (-12, -9, -6, -3):
    fc = f"[0:a]asplit[a][b];[b]lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,lowpass=f=2500,volume={H}dB[h];[a][h]amix=inputs=2:normalize=0"
    out = f'_h{H}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', fc, '-ar', '48000', out], check=True)
    lay = f'_l{H}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f"lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,lowpass=f=2500,volume={H}dB", '-ar', '48000', lay], check=True)
    print(f'H {H:+3d} dB: rms {rms(out):.1f}  phone-lost {rms(out) - rms(out, HP):.1f} dB  layer {rms(lay) - rms(src):+.1f} dB vs the take')
