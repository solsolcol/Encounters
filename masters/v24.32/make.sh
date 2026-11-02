#!/bin/bash
# v24.32 · episode 4 chapter 1, Chad's notes of 2 Nov 2026 (docs/V24.32-E4C1-NOTES.md).
#
# PA NOI'S GOODBYE (ending B, ask 8: "the wife just say goodbye to him" — in place of her card line, pn1card, which is
# retired with the card). Kanya (B4NdgwdU97lHqA8Udh2D), eleven_v3 as all her takes; ElevenLabs flow G7l5UBgCJPSOPJsdDSd8
# (node JFiRGrb2Ytn2wFDeJsrH), two takes: generations txVZcpRJB8g5OPgQoOzg (a, 4.96 s) and qyKz4wcYWw0Bdb5FLABe
# (b, 4.40 s). The prompt, the registry's words exactly: "[warmly] กลับดีๆ นะคะ... Go home safe, na kha. Bye bye!"
# THE PICK (faster-whisper, as v24.0's tr4.py: the multilingual small with language th, and small.en; whisper's Thai is
# rough, so it ranks the two takes and never judges one alone): a's first word is กลับ ("go home" — small.en heard
# "Clap di di"), b's หลับ ("sleep") — b also dropped the Thai entirely for small.en. b had the cleaner end (−32.9 dB
# against a's −19.7 in the last 60 ms), but a's last word ends whole at 4.62 s and what follows is breath: a, cut 0.16 s
# after its last word and faded (v24.0's chain: RMS −16, the cast's flat bus).
set -e
cd "$(dirname "$0")"
cast() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav $lv
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS $lv)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
cast pn1bye  voices/raw/pn1bye_a.mp3  -16 --keep 4.78 --fade 0.12   # words กลับดีๆ … Go home safe na kha. Bye bye. (last word ends 4.62 s)
# Retired here, their takes kept in masters/v24.0 (v24.3's rule: a sound nothing plays leaves the build): pn1card (her
# card line), w4card (the card's slide and flick), w4gasp (ending C's flinch at the shape in the glass, ask 9).
