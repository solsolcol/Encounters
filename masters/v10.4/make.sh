#!/bin/sh
# v10.4 · the loud eerie bed, the march, the laugh, the run, and three Aaron lines.
# Picks by measurement (../v10.1/measure.py):
#   e2dread   dread-2  — 18.7 % under 120 Hz / 65.1 % in 120-500 / 16.2 % in 500-3k against dread-1's 43 % of
#                        sub-bass: the one a PHONE SPEAKER can carry (the old bed put 80.7 % under 120 Hz, which
#                        is why three releases of gain never made it louder on his device)
#   e2march   march-1  — 0.8 % sub-bass, 78.6 % mids, swing 25.7; march-2 is half rumble (49.5 % under 120)
#   ghostlaugh laugh-1 — 82 % in 500-3k (presence and the wet tail); laugh-2 starts on signal (head -7)
#   ghostrun  run-3    — the boots-on-tile prompt; 51.5 % in 500-3k where the first prompt's takes were thumps
#   n1omg     take 1   — peak -2.3 with 39 % in 500-3k; take 2 is 85 % sub-bass (a breath, not the words)
#   n2pro1    take 1   — 2.40 s, tail -37; take 2 ends on signal (-30)
#   n2pro2    take 2   — one clean 1.24 s pause at 3.64 s ("3am... Surely"), head -50 / tail -59
# Levels: the bed is THE music now (Chad, third ask) and peaks at -6.0 where the other beds sit at -10.5; the
# march under it at -9.0; the two effects at -4.0; Aaron at -6.85 mp3 / -6.6 ogg as always. Two-pass, per file.
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
python3 mk.py
enc e2dread w_loop.wav -6.0 -6.0 96k 2
rm -f w_loop.wav w_loop.f32
enc e2march raw/march-1.mp3 -9.0 -9.0 96k 2
enc ghostlaugh raw/laugh-1.mp3 -4.0 -4.0 64k 1
enc ghostrun raw/run-3.mp3 -4.0 -4.0 64k 1
enc n1omg raw/n1omg-1.mp3 -6.85 -6.6 64k 1
enc n2pro1 raw/n2pro1-1.mp3 -6.85 -6.6 64k 1
enc n2pro2 raw/n2pro2-2.mp3 -6.85 -6.6 64k 1
for n in e2dread e2march ghostlaugh ghostrun n1omg n2pro1 n2pro2; do printf "%-11s " $n; ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio/$n.mp3; done
