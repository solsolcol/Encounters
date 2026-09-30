#!/bin/sh
# v16.4 · THE WAT, DRESSED — the two new sounds. Flow PJyc5vOYJNLJd2owf8Ae;
# sessions in sessions.json; measured with measure.py (measure.json).
#   eavebells b — 95 % of its energy above 3 kHz (a tinkle a phone plays), a
#                 clean 0.66 s tail; a is 0.48 s. Neither can loop (the tool
#                 takes no duration), so it plays as a ONE-SHOT from an eave
#                 near him every few seconds — how wind chimes really sound.
#   wingflap  a — spread across the bands (33/26/32/9 %), clean head; b is
#                 91.5 % under 120 Hz, a thump a phone cannot play.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"; rm -f e_$n.wav; }
ffmpeg -v error -y -i raw/eavebells_b.mp3 -af "afade=t=in:d=0.006,atrim=0:1.6,afade=t=out:st=1.35:d=0.25" w_bells.wav
enc eavebells w_bells.wav -4.0 -4.0 96k 2
ffmpeg -v error -y -i raw/wingflap_a.mp3 -af "atrim=0:2.7,afade=t=out:st=2.2:d=0.5" w_wings.wav
enc wingflap w_wings.wav -4.0 -4.0 96k 2
