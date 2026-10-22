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
# M3 · v21.19 · the opening film (the bus in, off at the stop, across Beach Road, the reveal)
#   busride      inside the bus as it runs, a LOOP under the first shot. Every take of both rounds was 88-98 % under
#                120 Hz — an engine a phone cannot play at all. Round two's a, shelved (high-pass 35 Hz, -14 dB under
#                140 Hz), is the steadiest of the four (a 5.6 dB swing against 8.1-9.8), the most even split
#                [17.7, 40.8, 21.4, 20.1] % (centroid 2.0 kHz) and the best-matched ends (-36.6 / -34.4).
#   busbell      the stop's bell. PICK c: one clean ding, 95.8 % in 500 Hz-3 kHz, the cleanest decay of the four (-75.4).
#   busbrake     pulling up at the stop. PICK d: the air brakes' hiss (57 % over 3 kHz) after the squeal, the least
#                boom of the four (a-c put 34-60 % in 500 Hz-3 kHz on a long groan); trimmed to 5.8 s, faded 0.4.
#   busdoor      the doors folding open. PICK d: the hiss and the fold, its thunk early (0.5 s), a clean end (-56.0).
#   cardtap      his fare card on the reader as he steps down. PICK a: one beep (88 % in 500 Hz-3 kHz) and a clean end
#                (-40.9); b-d end on signal (-22 to -23).
#   z3pro6       "[reflective] On my days off, I'd take the bus down to Beach Road." (Brian, eleven_v3, four takes on
#                the e3c3 voices flow). PICK b: the least rushed (3.68 s against 2.88-3.12) and the most of it where a
#                phone plays speech (44.5 % in 500 Hz-3 kHz against 20-31 %); its last 60 ms are on signal (-26.2), so
#                the end is faded (0.12 s).
#   z3pro7       "Thai grocers, Thai food, coaches leaving for Hat Yai... and amulets, if you knew where to look."
#                PICK a: the cleanest head (-75.9 against -40 to -52) and the tightest read (7.68 s against 8.24-9.04);
#                its end faded (0.12 s).
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
bedf() { # name raw filter — a bed through its own filter chain
  ffmpeg -v error -y -i "$2" -af "$3" w_f_$1.wav
  python3 ../v21.0/proc.py loop w_f_$1.wav w_$1.wav 2.0
  enc $1 w_$1.wav -8.0 -8.0 96k 2; rm -f w_$1.wav w_$1.wav.f32 w_f_$1.wav; }
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
if [ "${M1:-1}" = 1 ]; then
  bed  busnight    raw/busnight_c.mp3 60
  shot busaway     raw/busaway_c.mp3     7.00 0.30
  shot busdoorshut raw/busdoorshut_d.mp3 2.48 0.20
fi
if [ "${M3:-1}" = 1 ]; then
  bedf busride  raw/busride2_a.mp3 "highpass=f=35:poles=2,lowshelf=f=140:g=-14"
  shot busbell  raw/busbell_c.mp3  1.48 0.30
  shot busbrake raw/busbrake_d.mp3 5.80 0.40
  shot busdoor  raw/busdoor_d.mp3  2.48 0.25
  shot cardtap  raw/cardtap_a.mp3  1.00 0.30
  him  z3pro6   raw/z3pro6_b.mp3 --fade 0.12
  him  z3pro7   raw/z3pro7_a.mp3 --fade 0.12
fi
