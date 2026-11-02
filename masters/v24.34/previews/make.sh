#!/bin/bash
# v24.34 · the new music's previews for Chad's ear (v10.6: taste is his; measurement only screens): one reel per cue, its
# candidate takes back to back — numbered 1, 2, 3, ... in the order listed — each excerpt loudness-matched (EBU R128,
# -16 LUFS, true peak -1.5) so the louder take never wins by being louder, a second of silence between them. A take the
# measures screened out is left out of its reel and named in ../make.sh with the reason (90 % or more under 120 Hz, which
# a phone speaker does not play; or a third of it in the 1-4 kHz band the voices need).
set -e
cd "$(dirname "$0")"
R=../music/raw
reel() { # name start secs take...
  n=$1; st=$2; d=$3; shift 3; parts=""; k=0
  for t in "$@"; do
    ffmpeg -v error -y -ss $st -t $d -i $R/$t.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=$(python3 -c "print($d-1.2)"):d=1.2" -ar 44100 -ac 2 _$k.wav
    ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 1.0 _s$k.wav
    parts="$parts -i _$k.wav -i _s$k.wav"; k=$((k+1))
  done
  ffmpeg -v error -y $parts -filter_complex "concat=n=$((2*k)):v=0:a=1" -map_metadata -1 -c:a libmp3lame -b:a 160k $n.mp3
  rm -f _*.wav; echo "$n.mp3 <- $* from ${st}s, ${d}s a take"
}
reel e4-music-yard          15 25 w4yardmus_a w4yardmus_b w4yardmus_c                                      # 1 = a (installed)
reel e4-music-room          10 25 w4roommus_r2_a w4roommus_r2_b w4roommus_r2_c w4roommus_r2_d             # 3 = r2 c (installed)
reel e4-music-storm          0 18 w4stormmus_r2_a w4stormmus_r2_b w4stormmus_r2_c w4stormmus_r2_d         # 3 = r2 c (installed)
reel e4-music-endingA-lead   2 25 w4endA0_a w4endA0_b w4endA0_c w4endA0_d                                 # 3 = c (installed)
reel e4-music-endingB-lead   0 17 w4endB0_d                                                                # 1 = d (installed; the only one a phone plays)
reel e4-music-endingD-lead   3 25 w4endD0_b w4endD0_c w4endD0_d                                           # 2 = c (installed)
reel e4-music-coda           0 19 w4codamus_a w4codamus_b w4codamus_c w4codamus_d                         # 1 = a (installed)
