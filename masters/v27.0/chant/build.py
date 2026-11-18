# v27.0 · GRANDMASTER PHO'S CHANT over the blessing (the plan's D13): the Khandha Paritta's close and the first verse of
# the devas' farewell, as the fight's captions give them (the chapter's W.cap1 and W.cap2, word for word from Thanissaro
# Bhikkhu's A Chanting Guide: docs/research/V27.0-BLESSING.md §1.3, -VERDICTS.md B13, B14). Nothing with anumod- in it
# (Chad: that is a monk's alone); the dedication of merit is SPOKEN, in English, in the close (ph4z0).
#
# His own voice (chapter 3's, xYmBpJREC3WfqEFpbPvO), eleven_v3, "[chanting] ..." (v26.0's chant: chant/sessions.json
# has every job). Picked by measure (18 Nov), every take heard through the transcriber (no tag spoken: the Pali came
# back as Pali, or as nothing in English):
#   ch1  take c   5.76 s of voice, a clean end, no gap, the steadiest pitch (IQR 3.65 semitones; a 4.33 with a 0.40 s
#                 gap; b ends ON its last sample, refused)
#   ch2  take c   8.78 s, no gap of 0.35 s or more (a, b, d, e, f each have one or two), the tighter read. ALL SIX takes
#                 of this line end on signal: the model cuts the last vowel it holds ("pāṇino", its word whole by the
#                 transcriber's timing, ending 8.64 s) at the file's end, 25 to 31 dB under the peak; the line was re-run
#                 unchanged once (v4.1's law) and the three new takes did the same. So the held vowel is FADED here over
#                 its last 0.22 s (the take's word ends at 8.64, its sound at 8.86): a chanted line ending as one does.
# The cast's chain (voices/chain.py): RMS -17 dBFS (a dB under the cast's -16: it runs under the fight's music and the
# whispers, and is played as a sound, not a voice: v24.0's "a long chant is not a voice take") under the -1.5 dBFS
# limiter (masters/v11.1/level.py); mp3 128k 44.1 kHz and Opus 64k mono 48 kHz, metadata stripped.
#   python3 -I masters/v27.0/chant/build.py        -> assets/audio/u4chant1.mp3, u4chant2.mp3 (and their .ogg)
import os, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..')); SR = 48000
LEVEL = os.path.join(ROOT, 'masters', 'v11.1', 'level.py')
PICK = {'u4chant1': ('ch1_c', None), 'u4chant2': ('ch2_c', (8.64, 8.86))}

def dec(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def wav(path, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', path], input=x.astype(np.float32).tobytes(), check=True)
def dur(f): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True, check=True).stdout.strip())

tmp = os.path.join(HERE, '_tmp'); os.makedirs(tmp, exist_ok=True)
for name, (take, fade) in PICK.items():
    x = dec(os.path.join(HERE, 'raw', take + '.mp3'))
    x = x.copy()
    if fade:                                   # the held last vowel, faded from the word's end to the sound's end
        a, b = int(fade[0] * SR), min(len(x), int(fade[1] * SR))
        x[a:b] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, b - a)); x[b:] = 0
    else:                                      # (ch1 c ends in a stray burst 57 dB down in its last 25 ms, a click once
        w = int(SR * 0.02)                     #  levelled: everything 0.12 s after the voice's last loud frame is silence)
        db = 20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]), 1e-12))
        end = (np.where(db > db.max() - 40)[0][-1] + 1) * w + int(0.12 * SR); f = int(0.03 * SR)
        x[end - f:end] *= np.linspace(1, 0, f); x[end:] = 0
    x = np.concatenate([x, np.zeros(int(0.25 * SR))])
    p = os.path.join(tmp, name + '_p.wav'); w = os.path.join(tmp, name + '_w.wav')
    wav(p, x)
    subprocess.run(['python3', LEVEL, p, w, '-17'], check=True, capture_output=True)
    mp3, ogg = os.path.join(ROOT, 'assets/audio/%s.mp3' % name), os.path.join(ROOT, 'assets/audio-opus/%s.ogg' % name)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', mp3], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w, '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '64k', '-ar', '48000', ogg], check=True)
    print(name, take, '-> %.2f s' % dur(ogg))
for f in os.listdir(tmp): os.remove(os.path.join(tmp, f))
os.rmdir(tmp)
