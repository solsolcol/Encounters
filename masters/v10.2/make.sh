#!/bin/sh
# v10.2 · the two lines of the beat after the third ask, and the new music bed.
# Picks by measurement (../v10.1/measure.py):
#   n2known  take 1 — 2.96 s, flat (0.6 dB swing), head -55 / tail -48; take 2 rumbles (29 % under 120 Hz)
#   e2hurry  take 2 — 2.88 s, the shout at one level (0.6 dB swing), 60 % in 120-500 Hz where a bark lives
# Levels matched to the shipped peers (peak.py): Aaron -6.85 mp3 / -6.6 ogg, the encik -7.15 / -6.6.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch w_$n.wav
  p=$(peak w_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i w_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i w_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f w_$n.wav
}
# (the two lines were encoded on the first run; re-run them by uncommenting)
# enc n2known raw/n2known-1.mp3 -6.85 -6.6 64k 1
# enc e2hurry raw/e2hurry-2.mp3 -7.15 -6.6 64k 1
# ---- the music bed (mk.py writes the loop) ----
python3 mk.py
enc cookmusic w_loop.wav -10.8 -10.8 96k 2
rm -f w_loop.wav
