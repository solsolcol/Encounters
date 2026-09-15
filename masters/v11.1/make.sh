#!/bin/bash
# v11.1 — the buddy re-voiced (David, XxnXw151E3nb1V85MRlS — Chad: "the soldier
# voice is indian, make him chinese voice instead, and he is too soft") and the
# sergeant's two takes re-levelled. Picks (two takes each, David; Lee
# aFxDLa1A1dSRlzW8nziT generated as the alternative and NOT shipped — his
# takes came back 5-10 dB quieter with more air): b3here_a (the beat after
# "Eh"), b3C1_b (1.6 s, the other has a 1.2 s tail), b3C2_b (4.2 s, the other
# 5.6 with gaps), b3C3_a (4.9 s), b3D_b (peak -3.1 against -5.2).
# LEVEL BY RMS, not peak (level.py): the cast rides a FLAT bus (v5.26 left the
# other speakers flat by design) while Aaron has +3.5 dB and a compressor in
# front of his, so a whispered cast take peak-matched to -6.85 sat ~10 dB
# under him. -16 dBFS RMS, limiter at -1.5, encoded from the WAV plainly.
set -e
cd "$(dirname "$0")"
for p in "b3here raw/b3here_david_a.mp3" "b3C1 raw/b3C1_david_b.mp3" "b3C2 raw/b3C2_david_b.mp3" "b3C3 raw/b3C3_david_a.mp3" "b3D raw/b3D_david_b.mp3" "s3brief ../v11.0/raw/s3brief_a.mp3" "s3hiss ../v11.0/raw/s3hiss_a.mp3"; do
  set -- $p
  python3 level.py $2 w_$1.wav -16
  ffmpeg -v error -y -i w_$1.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$1.mp3
  ffmpeg -v error -y -i w_$1.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$1.ogg
done
rm -f w_*.f32
