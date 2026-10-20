#!/bin/sh
# v21.4 · THE MEDIUM'S INCANTATION, IN A TONGUE NOBODY KNOWS — Chad: "The
# medium reacts with speaking chinese after the hanuman roar. I dont want
# that, he should speak with a deity ancient chinese language that cannot be
# understood." md3chant was 天灵灵，地灵灵！太上老君急急如律令！ — the
# Taoist exorcist's formula in plain Mandarin, which any Chinese-speaking
# player understands word for word. Now it is invented syllables built from
# southern Chinese sounds (ng-, -iep, -ok, -it, tsiu, dzai, hw-) that make no
# word in any language: the spirit tongue a medium speaks in, heard and not
# understood. The medium's own voice (Roger, Fo6zHX740rFxxP1fWDxu, eleven_v3),
# two prompts, four takes each (sessions.json):
#   p1 [shouting, commanding] Ngat-kiep hwang-lo! Tsiu-mong dzai-ling, ngok-hrit pau-kau! Ngai-lo-sa... HAH!
#   p2 [chanting, possessed] Hwang-ngai... kiep-lo-sa... tsiu-ngok-pau! Dzai-ling-mong, ngat-hrit-kau! HAAH!
# Measured (meas.py; lengths through the chain below):
#   godp1_a 5.48 s  a 1.06 s dead stop after the first phrase — a stall in a frantic rite
#   godp1_b 5.70 s  ends ON signal (tail -22.1 dB)
#   godp1_c 6.24 s  ends ON signal (tail -23.5 dB)
#   godp1_d 5.57 s  PICKED: three phrases and the shout, evenly paced (gaps 0.62 / 0.72 /
#                   0.36 s), the cleanest P1 tail (-36.5 dB), the most raised voice
#                   (f0 median 167 Hz, p10 127 — shouted the whole way, as the old take was)
#   godp2_a 7.53 s  longest; a 0.8 s hole before the last shout
#   godp2_b 6.43 s, godp2_c 6.62 s, godp2_d 6.11 s  the "possessed" read: lower (f0 120-150 Hz),
#                   slower, 0.5-1.0 s longer than the pick — sent to Chad as the alternative
# The old take was 4.05 s; the roar film and ending A are re-timed in e3c3.js
# around the new 5.57 (docs/V21.2-PLAN.md, the v21.4 section).
cast() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
cast md3chant raw/godp1_d.mp3 --fade 0.12
