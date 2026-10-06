#!/bin/sh
# v18.7 · z1trance — the player's one new line, while the Sak Yant customer
# flinches under the rod (Chad: "This guy seems to be in some kind of trance,
# is he just acting it out...or is it truly the sakyant's energy?"). Brian,
# eleven_v3, four takes (sessions.json). PICK: a — the cleanest END (-37.5 dB;
# b and d end ON signal at -26.3, c at -31.2), no spoken tag (all four open on
# a 2.5 s "This guy seems..." phrase, no lead-in), gaps 1.5 / 1.48 at the two
# ellipses. v18.6's chain: high-pass 70 Hz, mono, peak-matched twice.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
him() { ffmpeg -v error -y -i "$2" -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$1.wav; enc $1 h_$1.wav $V $O 64k 1; rm -f h_$1.wav; }
V=-6.85; O=-6.6
him z1trance raw/z1trance_a.mp3
