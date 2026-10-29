#!/bin/bash
# v24.9 · episode 4 chapter 1, tightened (docs/V24.9-E4C1-TIGHTER.md): the yard is straight in, so two lines are
# re-said and one is new. Flow 42oRvGlkUSRPQpVq1GAB, eleven_v3, two takes a line, the v24.0 voices; the sessions are in
# ../v24.0/voices/sessions.json (pg1come_r, pn1ready, q1nobody_r2), the takes in ../v24.0/voices/raw. Picked by
# v24.0's order (masters/v24.0/make.sh): the words first (faster-whisper small.en; the multilingual small for Thai),
# then an end not ON signal, then the quieter head; a take much longer than its sibling read by hand.
#   pg1come  b — words exact in both; b's head -84.8 dB against a's -57.4, its end -37.5 against -29.7. 2.64 s.
#   pn1ready a — words exact in both ("Swadhika. Ajahn is waiting for you. Na kha."); b is 43 % longer (6.08 s against
#               4.24): 1.64 s of silence after its words, where the Thai model hears a second "sawasdee ka". a is the
#               tight read, its end -50.5 dB. 4.24 s.
#   q1nobody a — words exact in both; a's head -51.4 dB against b's -35.3, the ends alike (-42.6 / -41.9). 2.80 s.
# The chain is v24.0's, its functions copied here: him — mono, high-pass 70 Hz, peak-matched -6.85 / -6.6; the cast —
# levelled by RMS to -16 dBFS for the flat cast bus; every take's last 0.12 s faded.
set -e
cd "$(dirname "$0")"
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
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
cast() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav $lv
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS $lv)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
F="--fade 0.12"
R=../v24.0/voices/raw
cast pg1come   $R/pg1come_r_b.mp3      -16 $F
cast pn1ready  $R/pn1ready_a.mp3       -16 $F
him  q1nobody  $R/q1nobody_r2_a.mp3    $F
