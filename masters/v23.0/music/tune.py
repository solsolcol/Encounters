"""v23.0 CP11 · read a music-box take as a TUNE: its onsets (spectral flux), the note at each (the strongest partial
in 150–2500 Hz, as a MIDI name), the beat (median inter-onset gap), and how strongly the take repeats itself (the best
chroma self-similarity at a lag of 5–14 s — "the phrase played twice"). Usage: python3 tune.py raw/x.mp3 ..."""
import sys, subprocess, numpy as np
NAMES = 'C C# D D# E F F# G G# A A# B'.split()
def load(f, sr=22050):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
for f in sys.argv[1:]:
    x, sr = load(f); hop = 256; win = 2048
    fr = np.fft.rfftfreq(win, 1 / sr); w = np.hanning(win)
    S = np.array([np.abs(np.fft.rfft(x[i:i + win] * w)) for i in range(0, len(x) - win, hop)])
    flux = np.maximum(0, np.diff(np.log1p(S * 50), axis=0)).sum(1)
    thr = np.median(flux) + 2.5 * np.std(flux)
    on = [i for i in range(1, len(flux) - 1) if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]]
    keep = []
    for i in on:
        if not keep or (i - keep[-1]) * hop / sr > 0.09: keep.append(i)
    t = np.array(keep) * hop / sr
    band = (fr >= 150) & (fr <= 2500)
    notes = []
    for i in keep:
        sp = S[min(i + 3, len(S) - 1)] * band
        f0 = fr[np.argmax(sp)]; m = int(round(69 + 12 * np.log2(f0 / 440)))
        notes.append(NAMES[m % 12] + str(m // 12 - 1))
    gaps = np.diff(t)
    # chroma per 0.25 s
    hopc = int(0.25 * sr / hop)
    chroma = []
    for j in range(0, len(S) - hopc, hopc):
        seg = S[j:j + hopc].mean(0); c = np.zeros(12)
        for k in np.where(band)[0]:
            m = int(round(69 + 12 * np.log2(fr[k] / 440))) % 12; c[m] += seg[k]
        chroma.append(c / (np.linalg.norm(c) + 1e-9))
    chroma = np.array(chroma); best = (0, 0)
    for lag in range(int(5 / 0.25), min(int(14 / 0.25), len(chroma) - 8)):
        sim = np.mean([chroma[a] @ chroma[a + lag] for a in range(len(chroma) - lag)])
        if sim > best[0]: best = (sim, lag * 0.25)
    keyc = chroma.sum(0); top = [NAMES[i] for i in np.argsort(keyc)[::-1][:5]]
    print(f'{f}: {len(t)} notes, beat {np.median(gaps):.2f}s ({60 / np.median(gaps):.0f}/min), first {t[0]:.2f}s last {t[-1]:.2f}s, '
          f'repeat {best[0]:.3f} at {best[1]:.2f}s, pitch classes {top}')
    print('   ', ' '.join(f'{n}' for n in notes[:48]))
