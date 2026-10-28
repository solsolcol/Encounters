#!/bin/bash
# v24.5 · episode 4 chapter 1's one new sound, made from a master already on disk (nothing generated). Run from masters/v24.5.
# fm1chant2D · ending D opens on the chant "he began, let finish" (L3-1): it cued the whole 18.2 s take from its top at
#   0.0 and faded it at 5.6–6.8 s, in the middle of its second phrase, under the bell that says the chant has ended. This
#   is the take's own END — joined in the third trade formula 11.5 s in (a 0.35 s fade-in: we come in on him chanting),
#   then the closing "mahā-lābhā bhavantu me" ringing out — 6.7 s, so it ENDS before the bell at 6.8. The cast chain as
#   masters/v24.0/make.sh made fm1chant2 (prep.py, level.py at RMS -20, the same encodes).
#   (fm1chant2_b.mp3's phrases, by silencedetect -38 dB: 0–4.56, 5.50–9.77, 10.71–14.90, 15.84–18.21)
set -e
S=../v24.0/voices/raw/fm1chant2_b.mp3
python3 ../v21.0/prep.py "$S" p_fm1chant2D.wav --head 11.5 --fade 0.12 >/dev/null
ffmpeg -v error -y -i p_fm1chant2D.wav -af "afade=t=in:st=0:d=0.35" -ar 48000 -ac 1 q_fm1chant2D.wav
python3 ../v11.1/level.py q_fm1chant2D.wav wc_fm1chant2D.wav -20
ffmpeg -v error -y -i wc_fm1chant2D.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/fm1chant2D.mp3
ffmpeg -v error -y -i wc_fm1chant2D.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/fm1chant2D.ogg
ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio-opus/fm1chant2D.ogg | sed 's/^/fm1chant2D: /; s/$/ s/'
rm -f p_fm1chant2D.wav q_fm1chant2D.wav wc_fm1chant2D.wav wc_fm1chant2D.wav.f32
