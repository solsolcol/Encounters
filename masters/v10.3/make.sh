#!/bin/sh
# v10.3 · two re-said film lines and the tenth voice, louder.
# Picks by measurement (../v10.1/measure.py):
#   n1pro2  take 2 — 6.80 s, the flatter read (9.4 dB swing against 18.2), tail -42 where take 1 ends on signal (-27)
#   n1pro4  take 2 — 4.64 s, flat (7.4 against 24.6), head -47 / tail -46, and the one real pause (0.18 s at 2.63: "slept... but")
# Levels matched to the shipped peers (../v9.7/peak.py): Aaron -6.85 mp3 / -6.6 ogg.
#
# c1ten: Chad (v10.3) "the echoey 10 voiceline ... even louder, it is still too
# soft". v9.5 cut it from ten_a and v9.7 treated it (pitched down a tenth,
# four echo taps at 90/210/380/620 ms over a lowpass, +5.2 dB) to sit 0.8-1.1
# dB UNDER the living numbers. It sits 2.3 dB OVER them now (-5.0 against
# c1nine's -7.23): the echo spreads the word's energy over two seconds, so a
# peak above the others still reads as a voice further away. Same treatment,
# rebuilt from the v9.5 take so the recipe is on disk this time.
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
enc n1pro2 raw/n1pro2-2.mp3 -6.85 -6.6 64k 1
enc n1pro4 raw/n1pro4-2.mp3 -6.85 -6.6 64k 1
# ---- the tenth voice: ten_a's one word (0.12-0.46 s, the v9.5 cut), treated
ffmpeg -v error -y -i ../v9.5/ten_a.mp3 -ar 44100 -ac 1 \
  -af "atrim=0.06:0.60,asetpts=N/SR/TB,asetrate=44100*0.9,aresample=44100,lowpass=f=3400,aecho=0.8:0.55:90|210|380|620:0.55|0.42|0.30|0.20,apad=pad_dur=1.6,afade=t=out:st=1.9:d=0.25" \
  w_ten.wav
enc c1ten w_ten.wav -5.0 -4.8 64k 1
rm -f w_ten.wav
for n in n1pro2 n1pro4 c1ten; do printf "%s  " $n; ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio/$n.mp3; done
