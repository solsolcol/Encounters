#!/bin/sh
# v17.6 · THE SAK YANT CHOICE — the recipe. Two new Ajarn lines (Toto, the
# v16.0 voice), two takes each, picked by measure.py / pauses.py:
#   aj1which  a — the read with the pauses ("Before I start. / Which yant ...
#             / Choose."; b runs it as one breath and is 17 % sub-bass); its
#             head is on signal (-27.7), so a 25 ms fade in
#   aj1chosen a — the pause after "Good." (b runs on); its last 60 ms sit at
#             -26 dBFS, so a 60 ms fade out
# Levelled by RMS to -16 dBFS for the flat cast bus (v11.1), like every
# Ajarn line.
set -e
cd "$(dirname "$0")"
cast() { n=$1; src=$2
  python3 ../v11.1/level.py "$src" wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32; }
fade() { # src out.wav
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
  ffmpeg -v error -y -i "$1" -af "afade=t=in:d=0.025,afade=t=out:st=$(python3 -c "print($d-0.06)"):d=0.06" -ar 48000 -ac 1 "$2"; }
fade raw/aj1which_a.mp3 f_which.wav;   cast aj1which f_which.wav
fade raw/aj1chosen_a.mp3 f_chosen.wav; cast aj1chosen f_chosen.wav
rm -f f_which.wav f_chosen.wav
