#!/bin/sh
# v18.6 · THE GROWN MAN'S VOICE IS BRIAN — the recipe.
# Chad, 6 Oct 2026, after the audition (audition/): "Go with brian, make sure
# everything using player voiceline in episode 3 chapter 1 and 2 is replaced
# by this new adult voice." Brian Nguyen, bP8FJDHmWVEgXJDitdQd, eleven_v3, the
# registry's words exactly (tags included), two takes a line (sessions.json).
# PICKS by measurement (meas.txt from measure.py, pauses.txt from pauses.py):
# a clean END first (a take ending on signal clicks), then no odd hole, then
# the tighter read. Notable: z1close b over a (a holds a 2.2 s hole before
# "Looking back now"); z1askB b (a's gap after "Protection." is 2.1 s);
# z2next b keeps the beat before "Then came Buddha Day" (1.2 s), as v18.0's
# Louis take did; z2C1 a ends ON signal (-22 dBFS, tail 0) — b; z2pro4 a
# starts on signal at -17.6 — b. Every tagged line was checked for a spoken
# tag (one leaves a short first segment and a gap before the words): none.
# Same chain as v16.0/v18.0's Louis: high-pass 70 Hz, mono, peak-matched
# twice (mp3 and Opus drift in opposite directions).
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
# --- episode 3 chapter 1 (22)
him z1pro1 raw/z1pro1_b.mp3; him z1pro2 raw/z1pro2_a.mp3; him z1pro3 raw/z1pro3_b.mp3
him z1pro4 raw/z1pro4_b.mp3; him z1pro5 raw/z1pro5_b.mp3; him z1pro6 raw/z1pro6_a.mp3
him z1arrive raw/z1arrive_b.mp3; him z1wai raw/z1wai_b.mp3; him z1wait raw/z1wait_b.mp3
him z1warm raw/z1warm_a.mp3; him z1askA raw/z1askA_a.mp3; him z1askB raw/z1askB_b.mp3
him z1askC raw/z1askC_b.mp3; him z1askD raw/z1askD_a.mp3; him z1close raw/z1close_b.mp3
him z1next raw/z1next_a.mp3; him z1A raw/z1A_b.mp3; him z1B raw/z1B_b.mp3
him z1C raw/z1C_a.mp3; him z1D raw/z1D_b.mp3; him z1sadhu raw/z1sadhu_a.mp3
him z1room raw/z1room_a.mp3
# --- episode 3 chapter 2 (22)
him z2pro1 raw/z2pro1_a.mp3; him z2pro2 raw/z2pro2_b.mp3; him z2pro3 raw/z2pro3_a.mp3
him z2pro4 raw/z2pro4_b.mp3; him z2pro5 raw/z2pro5_a.mp3; him z2pro6 raw/z2pro6_b.mp3
him z2arrive raw/z2arrive_b.mp3; him z2leaf raw/z2leaf_b.mp3; him z2kneel raw/z2kneel_b.mp3
him z2slip1 raw/z2slip1_a.mp3; him z2slip2 raw/z2slip2_b.mp3; him z2peak raw/z2peak_b.mp3
him z2A1 raw/z2A1_b.mp3; him z2B1 raw/z2B1_b.mp3; him z2C1 raw/z2C1_b.mp3
him z2D1 raw/z2D1_b.mp3; him z2close raw/z2close_b.mp3; him z2next raw/z2next_b.mp3
him z2A raw/z2A_a.mp3; him z2B raw/z2B_b.mp3; him z2C raw/z2C_b.mp3
him z2D raw/z2D_a.mp3
