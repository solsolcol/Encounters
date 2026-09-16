#!/bin/sh
# v11.6 — Chad: "he does not sound scared at all ... both need to sound
# anxious, scared, or panicking, and they need to be faster". Aaron
# (B6uUx2p7cRgxseOUyP6P, eleven_v3, flow 4tm9SCkYFc990jONM6aK), the tag
# [panicking], the words his with the ellipses of "Nothing around" made full
# stops so the read does not stall; four takes each, picked by measurement
# (measure.py → measure.json): the FASTEST with clean edges —
#   n3press_b 5.60 s (a 6.64, c 6.40, d 6.16; the shipped v11.0 take 6.77)
#   n3look_a  5.76 s (b 6.56, c 6.16, d 6.24; shipped 7.16), tail −44 dB
# and torchpick_a (the rustle into the leaves, then the metal at 1.26 s —
# 24 % of its energy in 500 Hz–3 kHz against 5–8 % for the three that are
# only rustle), its 0.12 s of tail air trimmed.
# Levels: Aaron −6.85 mp3 / −6.6 ogg (v11.0); the effect −4.0.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6; extra=$7
  ffmpeg -v error -y -i "$src" $extra -ar 48000 -ac $ch w_$n.wav
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
V=-6.85; O=-6.6; E=-4.0
enc n3press raw/n3press_b.mp3 $V $O 64k 1
enc n3look  raw/n3look_a.mp3  $V $O 64k 1
enc torchpick raw/torchpick_a.mp3 $E $E 96k 2 "-t 1.48"
