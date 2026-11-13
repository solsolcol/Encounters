#!/usr/bin/env python3
"""v26.8 · A LOOP LEVELLED BY ITS AVERAGE WITHOUT A STEP AT ITS SEAM. ../v21.12/level_rms.py drives a file's RMS to a
target under a 5 ms lookahead limiter (80 ms release); on a loop its gain at the file's last sample need not be its gain
at the first (the limiter starts at rest and may end mid-release), so the wrap the engine makes from the loop's end to
its start could take a step. Here the same gain and the same limiter (its look ahead and its release, number for number;
no compressor: nothing under the peaks is touched) are run ROUND the loop: the look ahead at its end reads its start,
and the release enters its first sample in the state its last left, as the game plays it.
(Measured on the festival's music made again: the seam's step is -33.4 dBFS at the file's level whether levelled this
way or the plain way, so the limiter was not what made it; musicloop.py's -45.4 is read before the music is brought up
to level. -33.4 is the median of the music's own sample-to-sample movement, as the old loop's -40.4 was of its own:
nothing a player can hear.)
    python3 -I masters/v26.8/looplevel.py loop.wav out.wav TARGET_RMS_dBFS CEIL_dBFS"""
import os, subprocess, sys
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

SR = 48000


def read(p):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)


def write(x, p):
    raw = p + '.f32'
    x.astype(np.float32).tofile(raw)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', raw, p], check=True)
    os.remove(raw)


def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)


def main():
    src, out, TARGET, CEILdb = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
    CEIL = 10 ** (CEILdb / 20)
    x = read(src); n = len(x)
    win = int(0.005 * SR); a_r = np.exp(-1 / (0.080 * SR)); lead = SR       # (a second of the loop's end before its start: the release settles in far less)
    for _ in range(8):
        x *= 10 ** ((TARGET - rms(x)) / 20)
        pk = np.abs(x).max(1)
        need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
        lim = sliding_window_view(np.concatenate([need, need[:win - 1]]), win).min(axis=1)     # the look ahead, round the seam
        if lim.min() >= 1.0: break
        seq = np.concatenate([lim[-lead:], lim]); gg = np.empty(len(seq)); cur = 1.0
        for i, v in enumerate(seq.tolist()):
            cur = v if v < cur else v + a_r * (cur - v)
            gg[i] = cur
        x *= gg[lead:][:, None]
        if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
    write(x, out)
    step = 20 * np.log10(np.abs(x[0] - x[-1]).max() + 1e-12)
    print('%s: RMS %.2f dBFS  peak %.2f dBFS  the wrap from its last sample to its first: %.1f dBFS' % (out, rms(x), 20 * np.log10(np.abs(x).max() + 1e-12), step))


if __name__ == '__main__':
    main()
