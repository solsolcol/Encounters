#!/bin/sh
# v21.1 · ST-7: dv3father.ogg re-made. The v21.0 cast chain (prep.py, then
# level.py to -16 dBFS RMS under a -1.5 dBFS ceiling) is unchanged and was
# re-run and reproduced to the hundredth (peak +0.64, RMS -16.07 in mono
# float); libopus puts that one transient back OVER full scale. The Opus
# encode is fed the same levelled WAV through limit.py at -3.0 dBFS (15 ms
# release), which lands it at a -0.47 dBFS peak and -16.51 dBFS RMS — the
# mp3's own -16.51, so the two encodes now match where they differed. The mp3
# is untouched.
set -e
cd "$(dirname "$0")"
T=$(mktemp -d)
python3 ../v21.0/prep.py ../v21.0/raw/dv3father_a.mp3 $T/p.wav >/dev/null
python3 ../v11.1/level.py $T/p.wav $T/wc.wav -16
python3 limit.py $T/wc.wav $T/wl.wav -3.0 0.015
ffmpeg -v error -y -i $T/wl.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/dv3father.ogg
python3 -c "
import subprocess, numpy as np
r = subprocess.run(['ffmpeg','-v','error','-i','../../assets/audio-opus/dv3father.ogg','-f','f32le','-ac','1','-ar','48000','-'],capture_output=True)
x = np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
print('dv3father.ogg: peak %.2f dBFS, RMS %.2f dBFS, %.3f s' % (20*np.log10(np.abs(x).max()), 20*np.log10(np.sqrt((x**2).mean())), len(x)/48000))"
rm -rf $T
