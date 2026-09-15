#!/bin/sh
# v10.8 · Chad's chapter-2 scene C rewrite: the encik goes "Hmmmm.... okay..."
# (contemplative, not a flat "Ok."), a DEFEATED SIGH before "I should have just
# told him...", and a new line after it. Picks: hmm-4 (the slowest of four,
# 1.92 s, the one with the longest hold before "okay"); sigh-1 (2.56 s, 52 %
# voiced — a breath with air around it, the others are a spoken "haah");
# aloneA-3 (wording A is Chad's own; the slowest read of the four, 1.7 words a
# second against the game's 2.3 median — a hopeless line is a slow one).
# Levels: the encik to e2ok/e2A's -7.1; the line to n2C1's -6.85 (mp3) / -6.6
# (ogg); the sigh to n1C1's -6.85, because it goes ROUND the voice bus with the
# whispers (WHISPER_TAKES) — through the 4:1 compressor a breath comes out as
# loud as speech (v6.9's finding).
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
enc e2hmm   raw/hmm-4.mp3    -7.1  -7.1  64k 1
enc n2sigh  raw/sigh-1.mp3   -6.85 -6.6  64k 1
enc n2alone raw/aloneA-3.mp3 -6.85 -6.6  64k 1
