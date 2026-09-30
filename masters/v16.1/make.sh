#!/bin/sh
# v16.1 · THE MONK, THE WALKWAY, AND THE PRIVATE ROOM — the recipe.
# Two takes of everything; the monk cast twice (Somchai, a Thai baritone, and
# Arthur, an old Indonesian-accented narrator) and Somchai kept: the chant was
# given to him in THAI SCRIPT, so the Pali comes out in a Thai monk's own
# pronunciation, and his English carries the same accent.
# THE PICKS (measure.py -> measure.json, pauses.py):
#   mk1chant  som b — clean both ends (head -41, end -55), 9.12 s
#   mk1teach  som a — clean edges (head -46, end -45), 12.32 s
#   mk1come   som b — ends on signal (-17.9): cut with a 60 ms fade
#   hp1room   b (Preecha) — ends clean (-53.5); a ends on signal
#   aj1mat    b — both edges under -36
#   z1sadhu   b — the pause after "Sadhu" (the ellipsis), clean end (-42)
#   z1room    b — take a is 61 % sub-bass and 20 % hiss
#   roomdoor  roomdoor1 b — latch at 0.01 s, 60 % in 500-3k
#   watersprinkle a — flicks and drops (40 % 500-3k, 44 % above); b is 86 % hiss
#   roomamb   a — 85 % under 120 Hz (a fan's hum, which a phone cannot play), so
#             high-passed at 140 Hz and levelled by RMS: what is left is the
#             fan's whirr and the birds
set -e
cd "$(dirname "$0")"
V16=../v16.0
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
him() { ffmpeg -v error -y -i "$2" -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$1.wav
  enc $1 h_$1.wav $V $O 64k 1; rm -f h_$1.wav; }
cast() { n=$1; src=$2
  python3 ../v11.1/level.py "$src" wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32; }
trim() { python3 proc.py trim "$1" "$2" $3 $4 ${5:-0.12}; }
V=-6.85; O=-6.6; E=-4.0

him z1sadhu raw/z1sadhu_b.mp3
him z1room raw/z1room_b.mp3
cast mk1chant raw/mk1chant_som_b.mp3
cast mk1teach raw/mk1teach_som_a.mp3
trim raw/mk1come_som_b.mp3 w_mk1come.wav 0.0 2.88 0.06;  cast mk1come w_mk1come.wav
cast hp1room raw/hp1room_b.mp3
cast aj1mat raw/aj1mat_b.mp3
trim raw/roomdoor1_b.mp3 w_roomdoor.wav 0.0 1.9 0.4;     enc roomdoor w_roomdoor.wav $E $E 96k 2
trim raw/watersprinkle_a.mp3 w_water.wav 0.05 3.75 0.35;  enc watersprinkle w_water.wav $E $E 96k 2
ffmpeg -v error -y -i raw/roomamb_a.mp3 -af "highpass=f=140:poles=2" -ar 48000 -ac 2 w_room0.wav
python3 proc.py loop w_room0.wav w_room1.wav 2.0
python3 loud.py w_room1.wav w_roomamb.wav -30
ffmpeg -v error -y -i w_roomamb.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/roomamb.mp3
ffmpeg -v error -y -i w_roomamb.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/roomamb.ogg
echo "roomamb <- raw/roomamb_a.mp3 (HPF 140, loop, RMS -30)"
rm -f w_*.f32 w_room0.wav w_room1.wav
