#!/bin/bash
# v11.4 — the kneeling man's line (Chad's words), in the bunkmate's voice
# (Kelvin, FXMPPfJPpDj0GSwJ6ASO, eleven_v3, flow ElH7VuIvViVjbzp86K9v).
# Two takes; A picked by measurement: 5.92 s, ends on 0.49 s of air where B
# ends ON signal (tail 0.00 — the v5.30 click), and its one pause is 0.48 s
# against B's 0.68. Levelled by RMS to -16 dBFS for the flat cast bus
# (../v11.1/level.py), encoded from the WAV plainly (v11.1's recipe).
set -e
cd "$(dirname "$0")"
python3 ../v11.1/level.py raw/k3bush_a.mp3 w_k3bush.wav -16
ffmpeg -v error -y -i w_k3bush.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/k3bush.mp3
ffmpeg -v error -y -i w_k3bush.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/k3bush.ogg
rm -f w_k3bush.wav.f32
