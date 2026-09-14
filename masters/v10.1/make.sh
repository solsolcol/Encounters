#!/bin/sh
# v10.1 · encode the five WAVs mk.py wrote (see mk.py for the picks) to the
# contract: mp3 44.1k/128k + Opus 48k (64k mono voice, 96k stereo beds), no
# metadata, each encoder its own source, the level corrected per file (v9.7).
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name target_mp3 target_ogg opus_bitrate
  n=$1; tm=$2; to=$3; br=$4
  p=$(peak w_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i w_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i w_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n  mp3 $pm  ogg $po  (want $tm / $to)"
}
enc r2hear    -6.85 -6.6  64k
enc cookchat  -13.2 -13.2 96k
enc kitchen   -13.2 -13.2 96k
enc cookmusic -10.8 -10.8 96k
enc marchcall -10.4 -10.4 96k
