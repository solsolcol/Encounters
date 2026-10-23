#!/bin/sh
# v22.0 CP5 · the ghost's crying (Chad: "when the ghost appears, i want the ghost to have a pitiful crying voice
# echoing"). Twelve takes on the CP5 flow over three prompts (sessions.json, y4cry): the first prompt's four are long
# held wails (a, c — a tone and its decay; b, d — "Oooooh", d with sob-catches in it); the second prompt's four SAY
# words ("I'm sorry, I'm sorry", e/f/g, the speech model 0.86-0.96 sure of the later ones; h laughs) — out; the third
# prompt (wordless, "no speech and no syllables") gives four wails, j the one broken in two by a catch of breath.
# Shipped: j, with an echo laid on it the way a voice carries down a tiled room and back (four taps, 140-800 ms,
# falling) and its tail let ring, peak-matched to -6 dBFS like every other one-shot of the shop (the chapter sets the
# level). Previews of j, l and d, with the same echo, go to Chad's ear (the v10.6 rule).
set -e
cd "$(dirname "$0")"
. ./encfns.sh
ECHO="aecho=0.85:0.78:140|310|520|800:0.42|0.30|0.19|0.12,apad=pad_dur=1.6,afade=t=out:st=8.4:d=1.4"
mkdir -p previews
for k in j l d; do
  ffmpeg -v error -y -i raw/y4cry_$k.mp3 -af "$ECHO,loudnorm=I=-18:TP=-2:LRA=11" -ar 44100 -ac 2 previews/cry_$k.wav
  ffmpeg -v error -y -i previews/cry_$k.wav -c:a libmp3lame -b:a 160k previews/cry_$k.mp3 && rm previews/cry_$k.wav
done
ffmpeg -v error -y -i raw/y4cry_j.mp3 -af "$ECHO" -ar 48000 -ac 2 w_y4cry.wav
enc y4cry w_y4cry.wav -6.0 -6.0 96k 2
rm -f w_y4cry.wav
