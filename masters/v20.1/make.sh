#!/bin/sh
# v20.1 · e3c2's closing music, replaced (Chad: "There's a whimsical music that
# starts playing when the voiceline 'I never expected to be kneeling' plays ...
# too whimsical. Use another music to replace this one.")
# The old e3close2 was 72 % in 500 Hz–3 kHz with 2.7 note attacks a second — a
# bright plucked melody. Round 1 (close_a, close_b: cello/bell/choir drones)
# came back dark but low: 14–36 % of their energy in the band a phone speaker
# plays (250 Hz–4 kHz) against 64 % for chapter 1's e3close — on his phone
# they would be near silent (the v10.4 law). Round 2 asked for the middle
# register (close_c: viola, high strings, choir, bell; close_d: a Thai bowed
# fiddle). close_c a was measured best (68 % in the phone band, the fewest
# attacks, the body 3 s in) and shipped first; Chad heard both and chose the
# fiddle ("I prefer the thai fiddle music") — his ear over the measure (v10.6).
# PICK close_d a: its first 14 s are the fiddle ALONE, quiet (−33 to −40 dBFS,
# 99 % in the phone band, centroid 500–1000 Hz), and at 14.5 s the strings
# swell in under it (−18 to −20). Every ending plays this music for ~19 s and
# its first ~9 are under his closing line, so the cut starts at 7.0 s: about
# seven seconds of the fiddle under his words, then the swell as they end.
# Cut 7.0 → 43.0 s, levelled by RMS to −18 dBFS (chapter 1's e3close averages
# −18.4) under a −3 dBFS ceiling.
set -e
cd "$(dirname "$0")"
python3 ../v18.0/proc.py trim raw/close_d_a.mp3 w_e3close2.wav 7.0 43.0 3.0
python3 ../v18.0/loud.py w_e3close2.wav w_e3close2_l.wav -18
ffmpeg -v error -y -i w_e3close2_l.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/e3close2.mp3
ffmpeg -v error -y -i w_e3close2_l.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/e3close2.ogg
echo "e3close2 <- raw/close_d_a.mp3 (RMS -18)"; rm -f w_e3close2_l.wav w_e3close2.wav.f32 w_e3close2_l.wav.f32
