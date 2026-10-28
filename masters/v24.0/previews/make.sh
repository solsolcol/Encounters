#!/bin/bash
# v24.0 CP11.3 · the music previews for Chad's ear: one reel per cue, its four takes back to back (take a = 1, b = 2,
# c = 3, d = 4), each excerpt loudness-matched (EBU R128, -16 LUFS, true peak -1.5) so the louder take never wins by
# being louder, a second of silence between them. The excerpt is where the cue says what it is: the opening from 30 s
# (its motif enters near 37 s), the storm from 12 s (it rises out of near silence), every other cue from its start.
set -e
cd "$(dirname "$0")"
R=../music/raw
reel() { # name cue start secs
  n=$1; c=$2; st=$3; d=$4; parts=""
  for k in a b c d; do
    ffmpeg -v error -y -ss $st -t $d -i $R/${c}_$k.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=$(python3 -c "print($d-1.2)"):d=1.2" -ar 44100 -ac 2 _$k.wav
    ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 1.0 _s$k.wav
    parts="$parts -i _$k.wav -i _s$k.wav"
  done
  ffmpeg -v error -y $parts -filter_complex "concat=n=8:v=0:a=1" -map_metadata -1 -c:a libmp3lame -b:a 160k $n.mp3
  rm -f _?.wav _s?.wav; echo "$n.mp3 <- $c from ${st}s, ${d}s a take"
}
reel e4-music-opening w4open 30 30
reel e4-music-endingA w4endA 0 22
reel e4-music-endingB w4endB 0 22
reel e4-music-endingC w4endC 0 22
reel e4-music-endingD w4endD 0 22
reel e4-music-coda    w4coda 0 8
reel e4-music-storm   w4storm 12 22
