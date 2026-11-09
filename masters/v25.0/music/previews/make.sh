#!/bin/bash
# v25.0 CP11 · the music previews for Chad's ear (v10.6: measurement only screens; his ear picks): one reel per cue, its
# three takes back to back (take a = 1, b = 2, c = 3), each excerpt loudness-matched (EBU R128, -16 LUFS, true peak -1.5)
# so the louder take never wins by being louder, a second of silence between them. Each excerpt is 22 s from where the
# cue says what it is (the beds and the clearing from 8 s in, past their openings; every other cue from its start).
# The take the build uses is named in masters/v25.0/make.sh with its reason; any can be swapped on his word.
set -e
cd "$(dirname "$0")"
R=../raw
reel() { # name cue start secs
  n=$1; c=$2; st=$3; d=$4; parts=""
  for k in a b c; do
    ffmpeg -v error -y -ss $st -t $d -i $R/${c}_$k.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=$(python3 -c "print($d-1.2)"):d=1.2" -ar 44100 -ac 2 _$k.wav
    ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 1.0 _s$k.wav
    parts="$parts -i _$k.wav -i _s$k.wav"
  done
  ffmpeg -v error -y $parts -filter_complex "concat=n=6:v=0:a=1" -map_metadata -1 -c:a libmp3lame -b:a 160k $n.mp3
  rm -f _?.wav _s?.wav; echo "$n.mp3 <- $c from ${st}s, ${d}s a take"
}
reel e4c2-music-opening   x2open     0 22
reel e4c2-music-fog       x2fogmus   8 22
reel e4c2-music-call      x2callmus  0 22
reel e4c2-music-visit     x2visit    0 22
reel e4c2-music-visitbed  x2visitmus 8 22
reel e4c2-music-clearing  x2clearmus 8 22
reel e4c2-music-endingA   x2endA     0 22
reel e4c2-music-endingB   x2endB     0 22
reel e4c2-music-endingC   x2endC     0 22
reel e4c2-music-endingD   x2endD     0 20
reel e4c2-music-coda      x2codamus  0 22
