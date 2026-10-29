#!/bin/bash
# v24.11 · episode 4 chapter 1: Pong's teacher's-offering line re-said. Chad: "pong voice got cut in one of his voiceline
# after something about teacher offering." The shipped take (v24.0's pg1offer_b) ENDED MID-WORD: its last word "you"
# lasted 60 ms (faster-whisper's word timings, 3.92–3.98 of 4.05 s) and the take was still voiced at its body's level on
# its last sample (its last 10 ms -4.9 dB under the body, against -20 to -45 for a word that ended). v24.0's pick put
# the words first and noted the end ON signal without reading what the end was. Re-said on the same flow
# (42oRvGlkUSRPQpVq1GAB), eleven_v3, Zie (bcdIY58WBBzAMmef52NW), the original prompt word for word, no tag; the sessions
# are pg1offer_r in ../v24.0/voices/sessions.json, the takes ../v24.0/voices/raw/pg1offer_r_[ab].mp3.
#   pg1offer a — words exact in both; both END (a's last 10 ms -25.4 dB under its body, b's -28.7; "you" 0.20 s and
#                0.26 s); a's head -62.5 dB against b's -47.8. 4.16 s.
# The chain is v24.0's cast chain (masters/v24.0/make.sh): levelled by RMS to -16 dBFS for the flat cast bus, the last
# 0.12 s faded.
set -e
cd "$(dirname "$0")"
cast() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav $lv
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS $lv)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
F="--fade 0.12"
R=../v24.0/voices/raw
cast pg1offer  $R/pg1offer_r_a.mp3     -16 $F
