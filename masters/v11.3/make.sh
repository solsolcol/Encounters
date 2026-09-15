#!/bin/sh
# v11.3 — the night jungle's wildlife (Chad: "add more natural wildlife sounds
# in the background, and shuffling noises in the bushes"), flow
# KsTC1vS0JU4siGAPuiMc, four takes each, picked by measurement (the script is
# in the session log; the numbers below are its output):
#   junglelife_b — the bed: the most of its energy in 500 Hz–3 kHz of the
#     four (9.5 % against 2.7–5.8: the frogs and the bird, not only the
#     crickets), a 3.1 dB swing over 30 s and a 0.3 dB loop seam.
#   bushrustle a / b / d — a is the fullest (13 % in 500–3k, the branch), b
#     and d the two drier ones; c is 98 % hiss and is left out. Every take
#     peaks inside its first 0.4 s, which is what a rustle needs.
#   nightcall b / c — the flattest swings (9.0 / 11.3 dB) of four calls that
#     all sit in 500 Hz–3 kHz.
# Levels: the bed −10.5 dBFS where the beds sit; the effects −4.0 (the cue's
# number does the distance).
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
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
E=-4.0; B=-10.5
enc junglelife  raw/junglelife_b.mp3 $B $B 96k 2
enc bushrustle1 raw/bushrustle_a.mp3 $E $E 96k 2
enc bushrustle2 raw/bushrustle_b.mp3 $E $E 96k 2
enc bushrustle3 raw/bushrustle_d.mp3 $E $E 96k 2
enc nightcall1  raw/nightcall_b.mp3  $E $E 96k 2
enc nightcall2  raw/nightcall_c.mp3  $E $E 96k 2
