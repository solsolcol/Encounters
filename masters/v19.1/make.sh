#!/bin/sh
# v19.1 · z1thank — "Thank you, Ajahn Krukai." (Chad: "after selecting the
# decision option and ajahn replies, the player should also have a 'Thank
# you, Ajahn Krukai.' voiceline play while the camera bows, before leaving the
# sakyant room. This thank you should play for every option chosen.")
# Brian, eleven_v3, four takes (sessions.json), prompt "[grateful] Thank you,
# Ajahn Krukai.". PICK: a — the cleanest END (-64.1 dB; c ends ON signal at
# -26.8, d at -45.6, b clean but the quickest read at 1.12 s of speech against
# a's 1.26), no spoken tag (one phrase in all four, no lead-in). Its 1.28 s of
# trailing air is cut to 0.36 (a held voice holds the next line back), faded
# over the last 0.18 s: 1.70 s. v18.6's chain: high-pass 70 Hz, mono,
# peak-matched twice.
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
ffmpeg -v error -y -i raw/z1thank_a.mp3 -af "atrim=0:1.70,afade=t=out:st=1.52:d=0.18" -ar 44100 raw/z1thank_a_trim.wav
him z1thank raw/z1thank_a_trim.wav
rm -f raw/z1thank_a_trim.wav       # an intermediate, made above each run
