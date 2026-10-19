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
# fiddle). PICK close_c a: 68 % in the phone band, centroid 462 Hz, 1.26
# attacks a second (the fewest of eight — nothing plucked), slow swells every
# ~8 s, the body arriving in 3 s. close_c b's body arrives at 28 s; close_d a
# and b are silent for 15 s and twice as busy (4–5 attacks a second).
# Cut 1.0 → 37.0 s (every ending fades it ≤ 20 s after its cue), levelled by
# RMS to −18 dBFS (chapter 1's e3close averages −18.4) under a −3 dBFS ceiling.
set -e
cd "$(dirname "$0")"
python3 ../v18.0/proc.py trim raw/close_c_a.mp3 w_e3close2.wav 1.0 37.0 3.0
python3 ../v18.0/loud.py w_e3close2.wav w_e3close2_l.wav -18
ffmpeg -v error -y -i w_e3close2_l.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/e3close2.mp3
ffmpeg -v error -y -i w_e3close2_l.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/e3close2.ogg
echo "e3close2 <- raw/close_c_a.mp3 (RMS -18)"; rm -f w_e3close2_l.wav w_e3close2.wav.f32 w_e3close2_l.wav.f32
