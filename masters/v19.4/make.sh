#!/bin/sh
# v19.4 · THREE NEW LINES for episode 3 chapter 2 (docs/V19.4-PLAN.md P4, P9).
# Generated 16 Oct 2026, eleven_v3, two takes each (sessions.json).
# PICKS by measurement (head/tail level of the first/last 40 ms, silences at -45 dB):
#   z2join  a — 3.63 s, head -45, tail -32.8, the ellipsis' own 0.40 s pause;
#               b ends louder (-24.4) and holds a 1.40 s hole.
#   lw2what a — 2.19 s, head -61.5, tail -54.0, no gap; b holds a 1.09 s hole.
#   yai2dance a — the words end at 1.26 s and the take then sits ~1 s silent
#               with a click at its very end: trimmed at 1.50 s, 0.12 s fade;
#               b opens on 1.38 s of silence.
# Chains as v18.0/v18.6: his through the high-pass and peak-match (him), the
# cast flat and levelled by RMS to -19 dBFS (cast) — whispers, under speech.
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
him() { ffmpeg -v error -y -i "$2" -af "highpass=f=70:poles=2,afade=t=out:st=$3:d=0.06" -ar 48000 -ac 1 h_$1.wav; enc $1 h_$1.wav $V $O 64k 1; rm -f h_$1.wav; }
cast() { # name src rms
  n=$1; src=$2; r=${3:--16}
  python3 ../v11.1/level.py "$src" wc_$n.wav $r
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS $r)"; rm -f wc_$n.wav wc_$n.wav.f32
}
V=-6.85; O=-6.6
him z2join raw/z2join_a.mp3 3.57
cast lw2what raw/lw2what_a.mp3 -19
ffmpeg -v error -y -i raw/yai2dance_a.mp3 -af "atrim=0:1.50,afade=t=out:st=1.38:d=0.12" -ar 44100 -ac 1 t_yai2dance.wav
cast yai2dance t_yai2dance.wav -19; rm -f t_yai2dance.wav
for n in z2join lw2what yai2dance; do echo "$n $(ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio/$n.mp3)"; done
