#!/bin/bash
# v26.12 · Chad's previews of every candidate for the four new sounds, each at -20 dBFS where it sounds, peaks under -1
# (level.py). The pick by measure stands until his ear (v10.6); the number of each is its take in letter order, below.
#   chant-brown-1..3   the brown hermit, his hands on her bai sri: x3chantb2 a, c (THE PICK), d  (b is out: the
#                      transcriber writes "I will be with you, and you will be with me." from it; x3chantb's four were
#                      a hum, or "Aww")
#   chant-yellow-1..3  the hermit in the yellow shawl, over the man in trance: x3chanty a, b (THE PICK), d  (c is out: the
#                      transcriber writes words from it)
#   cry-1..2           the man in trance: x3cry b, c (THE PICK)  (a writes "NOOOOO", d "AHHHHHHHHHHH")
#   close-1..4         ending D, his opening closed: x3close1 a, b, c, d (THE PICK)  (x3close2's four are under 150 Hz:
#                      a phone plays none of them)
set -e
cd "$(dirname "$0")"
R=../../v26.0/sound/raw
one() { python3 -I level.py "$R/$2.mp3" "p_$1.wav" -20 -1; ffmpeg -v error -y -i "p_$1.wav" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 "$1.mp3"; rm -f "p_$1.wav"; }
one chant-brown-1 x3chantb2_a; one chant-brown-2 x3chantb2_c; one chant-brown-3 x3chantb2_d
one chant-yellow-1 x3chanty_a; one chant-yellow-2 x3chanty_b; one chant-yellow-3 x3chanty_d
one cry-1 x3cry_b; one cry-2 x3cry_c
one close-1 x3close1_a; one close-2 x3close1_b; one close-3 x3close1_c; one close-4 x3close1_d
