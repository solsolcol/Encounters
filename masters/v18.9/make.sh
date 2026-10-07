#!/bin/sh
# v18.9 · au1sell — the stall auntie re-voiced to name the Sangkathan set that
# replaced the old flower tray at v18.8 (Chad: "Re-voice the auntie with your
# suggested line"). Anna (brM9iIbwDREZaWL8luun), eleven_v3, four takes
# (sessions.json). PICK: a — the only take clean at BOTH ends (head -85.2 dB,
# end -37.1; b starts ON signal at -37.6 with no lead, c and d end on signal at
# -30.6 / -32.2), no spoken tag (all four open on the same ~1.46 s phrase), and
# 0.8 s tighter than b. v16.0's cast chain: levelled by RMS to -16 dBFS for the
# flat cast bus, encoded plainly.
set -e
cd "$(dirname "$0")"
cast() { # name src
  n=$1; src=$2
  python3 ../v11.1/level.py "$src" wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"
  rm -f wc_$n.wav wc_$n.wav.f32
}
cast au1sell raw/au1sell_a.mp3
