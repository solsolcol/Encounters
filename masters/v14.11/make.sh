#!/bin/sh
# v14.11 · the amulet's crack and its shatter, from the ElevenLabs takes in raw/
# (flow Gs8fKVVMocfz1aorEclO; sessions.json has every session id). Run from here.
#
# wardcrack — eleven_text_to_sound_v2, duration_seconds 0.8 as a PARAMETER (the
# v9.2 law), prompt_influence 0.6, four takes. c is the pick: its peak lands at
# 0.02 s and it is over by 0.14 s (the crispest of four), clean edges (head -21,
# tail -63 dBFS); d starts ON signal (head -2 dBFS — a click), a and b ring on
# to 0.26-0.28 s. Cut at 0.50 s with a 60 ms fade.
#
# wardbreak — the same model, 2.5 s, four takes. c is the pick: 18 % of its
# energy under 500 Hz against 3.5-5.6 % for the other three — the IMPACT that
# makes it a crash rather than a tinkle — its peak at 0.07 s, loud to 1.62 s;
# a 4 ms fade-in over its hot head (+4 dBFS on decode) and 0.4 s out at the end.
#
# Both peak-matched to the HUD contract's -2.0 dBFS with EACH ENCODER GIVEN ITS
# OWN SOURCE (v9.6/v9.7: the mp3/opus offset is per file), stereo kept.
set -e
peak() { python3 peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
one() {  # name src trimfilter
  ffmpeg -v error -y -i "$2" -af "$3" -ar 44100 w_$1.wav
  P=$(peak w_$1.wav); G1=$(python3 -c "print(round(-2.0 - ($P), 2))")
  ffmpeg -v error -y -i w_$1.wav -af "volume=${G1}dB" -ar 44100 w_$1_m.wav
  ffmpeg -v error -y -i w_$1_m.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$1.mp3
  M=$(peak ../../assets/audio/$1.mp3); G1b=$(python3 -c "print(round(${G1} + (-2.0 - ($M)), 2))")
  ffmpeg -v error -y -i w_$1.wav -af "volume=${G1b}dB" -ar 44100 w_$1_m.wav
  ffmpeg -v error -y -i w_$1_m.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$1.mp3
  ffmpeg -v error -y -i w_$1.wav -af "volume=${G1}dB" -ar 48000 w_$1_o.wav
  ffmpeg -v error -y -i w_$1_o.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$1.ogg
  O=$(peak ../../assets/audio-opus/$1.ogg); G2=$(python3 -c "print(round(${G1} + (-2.0 - ($O)), 2))")
  ffmpeg -v error -y -i w_$1.wav -af "volume=${G2}dB" -ar 48000 w_$1_o.wav
  ffmpeg -v error -y -i w_$1_o.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$1.ogg
  echo "$1 mp3 $(peak ../../assets/audio/$1.mp3)  ogg $(peak ../../assets/audio-opus/$1.ogg)   (want -2.0)"
}
one wardcrack raw/crack_c.mp3 "atrim=0:0.50,afade=t=out:st=0.44:d=0.06"
one wardbreak raw/shatter_c.mp3 "afade=t=in:st=0:d=0.004,afade=t=out:st=2.08:d=0.40"
rm -f w_*.wav
