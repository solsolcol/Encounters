#!/bin/sh
# v11.0 · EPISODE 2 · CHAPTER 3 · THE PRESSURE — the recipe.
# 31 lines (Aaron / the buddy / the sergeant) and 10 sounds, two takes each,
# picked by measurement (measure.json, made by the script in the session):
# a voice take with headroom over one near clipping, the slower read where
# the line wants one, the evener envelope; a sound by its bands and shape —
# junglenight_b (swing 1.6 dB over 20 s, 3 % in 500-3k so it is insects and
# not hiss), tonner_a (swing 3.3 against 6.5), bootsleaf_a (46 % in 500-3k,
# the boots, against 31), ghostrunleaf_a (the other clips at +1.7 dBFS),
# legpress_a (77 % sub-bass with 15 % in 500-3k the phone CAN play; _b is 99 %
# sub). stingpress: BOTH first takes were 100 % under 120 Hz — a sub thump the
# phone cannot play (v10.4's law) — so it was re-prompted with no bass.
# Levels: Aaron −6.85 mp3 / −6.6 ogg; the cast the same; effects −4.0; the two
# beds (junglenight, tonner) −10.5, where the game's beds sit.
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
V=-6.85; O=-6.6; E=-4.0; B=-10.5
# Aaron
enc n3pro1  raw/n3pro1_b.mp3  $V $O 64k 1;  enc n3pro2  raw/n3pro2_b.mp3  $V $O 64k 1
enc n3pro3  raw/n3pro3_b.mp3  $V $O 64k 1;  enc n3pro4  raw/n3pro4_b.mp3  $V $O 64k 1
enc n3spot1 raw/n3spot1_a.mp3 $V $O 64k 1;  enc n3spot2 raw/n3spot2_a.mp3 $V $O 64k 1
enc n3spot3 raw/n3spot3_b.mp3 $V $O 64k 1;  enc n3spot5 raw/n3spot5_b.mp3 $V $O 64k 1
enc n3spot6 raw/n3spot6_a.mp3 $V $O 64k 1
enc n3press raw/n3press_a.mp3 $V $O 64k 1;  enc n3look  raw/n3look_b.mp3  $V $O 64k 1
enc n3still raw/n3still_b.mp3 $V $O 64k 1
enc n3A1 raw/n3A1_a.mp3 $V $O 64k 1;  enc n3A2 raw/n3A2_b.mp3 $V $O 64k 1
enc n3B1 raw/n3B1_a.mp3 $V $O 64k 1;  enc n3B2 raw/n3B2_a.mp3 $V $O 64k 1
enc n3C1 raw/n3C1_a.mp3 $V $O 64k 1;  enc n3C2 raw/n3C2_a.mp3 $V $O 64k 1
enc n3D1 raw/n3D1_a.mp3 $V $O 64k 1;  enc n3D2 raw/n3D2_a.mp3 $V $O 64k 1
enc n3A raw/n3A_b.mp3 $V $O 64k 1;  enc n3B raw/n3B_b.mp3 $V $O 64k 1
enc n3C raw/n3C_b.mp3 $V $O 64k 1;  enc n3D raw/n3D_a.mp3 $V $O 64k 1
# the buddy and the sergeant
enc b3here raw/b3here_a.mp3 $V $O 64k 1; enc b3C1 raw/b3C1_b.mp3 $V $O 64k 1
enc b3C2 raw/b3C2_a.mp3 $V $O 64k 1;     enc b3C3 raw/b3C3_a.mp3 $V $O 64k 1
enc b3D raw/b3D_b.mp3 $V $O 64k 1
enc s3brief raw/s3brief_a.mp3 $V $O 64k 1; enc s3hiss raw/s3hiss_a.mp3 $V $O 64k 1
# the sounds
enc tonner raw/tonner_a.mp3 $B $B 96k 2;          enc junglenight raw/junglenight_b.mp3 $B $B 96k 2
enc tailgate raw/tailgate_b.mp3 $E $E 96k 2;      enc bootsleaf raw/bootsleaf_a.mp3 $E $E 96k 2
enc torchclick raw/torchclick_a.mp3 $E $E 96k 2;  enc ghostrunleaf raw/ghostrunleaf_a.mp3 $E $E 96k 2
enc leafdraw raw/leafdraw_a.mp3 $E $E 96k 2;      enc leaflift raw/leaflift_a.mp3 $E $E 96k 2
enc legpress raw/legpress_a.mp3 $E $E 96k 2
[ -f raw/stingpress2_a.mp3 ] && enc stingpress raw/stingpress2_${STING:-a}.mp3 $E $E 96k 2
