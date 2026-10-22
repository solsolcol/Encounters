#!/bin/sh
# v21.17 – v21.19 · THE BUS IN, THE SHOPS, AND THE LORONG'S BUSES (docs/V21.17-PLAN.md).
# Effects on the effects flow x1GA0BZOmq4QkgJCd4V4 (sfxsessions.json — the session ids, the only handle on a
# generation), eleven_text_to_sound_v2 with duration / loop / prompt_influence as PARAMETERS (the v9.2 law), four
# takes each; measured by measure.py and envm.py (the phone band, the 0.5 s / 0.1 s envelope, clean ends).
#
# M1 · v21.17 · the lorong's buses (the medium's street, at night)
#   busnight     the engine of a bus going by, a LOOP the chapter drives every frame (volume by distance, pan by bearing).
#                PICK c: of the four the least sub after d (29.1 %) and the most of it where a phone plays and an ear
#                places a sound (42.8 % in 500 Hz-3 kHz, 3.6 % over 3 kHz — d has 39.6 / 1.2), centroid 902 Hz against
#                470-587 for the others, its two ends matched (-15.1 / -15.0). Its slow swell (3.9 dB) is flattened by
#                the loop's own drift correction and the tail crossfaded over the head.
#   busaway      the bus that brought him pulling away from the stop. PICK c: the least sub of the four (6.6 %), and the
#                shape of a pull-away — an idle (-19) that revs (-8, -7 at 2 s) and recedes to a clean end (-78.3);
#                a and d are loudest at their head (a pass, not a start), b ends 55 dB down and lingers.
#   busdoorshut  its doors closing first. PICK d: a pneumatic hiss for 1.6 s, ONE thunk at 1.9 s (-2) and a clean decay
#                to -30 — c thunks twice (1.4 and 2.1), a's thunk is small (-6), b's hiss wavers.
# M3 · v21.19 (the film) — picked when the film is built; see below.
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
trim() { python3 ../v21.0/proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
bed() { # name raw [highpass]
  if [ -n "$3" ]; then ffmpeg -v error -y -i "$2" -af "highpass=f=$3:poles=2" w_hp_$1.wav; src=w_hp_$1.wav; else src="$2"; fi
  python3 ../v21.0/proc.py loop "$src" w_$1.wav 2.0
  enc $1 w_$1.wav -8.0 -8.0 96k 2; rm -f w_$1.wav w_$1.wav.f32 w_hp_$1.wav; }
shot() { # name raw end [fade] — a one-shot, peak-matched to -6 dBFS; the chapter sets each one's level
  trim "$2" w_$1.wav 0.0 $3 ${4:-0.25}; enc $1 w_$1.wav -6.0 -6.0 96k 2; rm -f w_$1.wav w_$1.wav.f32; }
if [ "${M1:-1}" = 1 ]; then
  bed  busnight    raw/busnight_c.mp3 60
  shot busaway     raw/busaway_c.mp3     7.00 0.30
  shot busdoorshut raw/busdoorshut_d.mp3 2.48 0.20
fi
