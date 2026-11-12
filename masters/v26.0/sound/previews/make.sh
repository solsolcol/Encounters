#!/bin/bash
# v26.0 · episode 4 chapter 3's music, for Chad's ear (v10.6: taste is his; measurement only screens): one reel a cue,
# its candidate takes back to back, numbered 1, 2, 3 in the order listed, each excerpt loudness-matched (EBU R128, -16
# LUFS, true peak -1.5) so the louder take never wins by being louder, a second of silence between them. The two
# pieces that play IN THE WORLD are heard as the game plays them, over the ground's loudspeakers (PA, as ../../sound.sh).
# A take the measures screened out is left out of its reel and named here with the reason. The number in the game is
# on each line; any other number is one word from him (../../sound.sh's music section: change the take's letter).
#   bash masters/v26.0/sound/previews/make.sh
set -e
cd "$(dirname "$0")"
R=../raw
PA="highpass=f=180:poles=2,lowpass=f=5500:poles=2,aecho=0.8:0.5:110|230:0.18|0.08"
reel() { # name secs filter take@start...
  n=$1; d=$2; af=$3; shift 3; parts=""; k=0
  for ts in "$@"; do
    t=${ts%@*}; st=${ts#*@}
    ffmpeg -v error -y -ss $st -t $d -i $R/$t.mp3 -af "$af,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=$(python3 -c "print($d-1.2)"):d=1.2" -ar 44100 -ac 2 _$k.wav
    ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 1.0 _s$k.wav
    parts="$parts -i _$k.wav -i _s$k.wav"; k=$((k+1))
  done
  ffmpeg -v error -y $parts -filter_complex "concat=n=$((2*k)):v=0:a=1" -map_metadata -1 -c:a libmp3lame -b:a 160k $n.mp3
  rm -f _*.wav; echo "$n.mp3 <- $* (${d}s a take)"
}
reel e4c3-music-01-opening        20 anull x3openmus_a@8 x3openmus_b@8 x3openmus_c@8               # in the game: 2 (b)
reel e4c3-music-02-festival       20 "$PA" x3festmus_a@8 x3festmus_b@8 x3festmus_c@8               # in the game: 1 (a), looped; the ground's own music, in play
reel e4c3-music-03-dance          15 "$PA" x3dancemus_a@1.3 x3dancemus_b@0.7 x3dancemus_c@0.8      # in the game: 1 (a); the dance for the Thevadas
reel e4c3-music-04-man-in-white   13 anull x3sightmus_a@1 x3sightmus_b@0.4                         # in the game: 1 (a). Left out: c (98 % of it under 120 Hz: a phone plays none of it)
reel e4c3-music-05-night          18 anull x3nightmus_a@0 x3nightmus_c@1.7                         # in the game: 1 (a). Left out: b (silent for 3.3 s, then over 2.8 s before the film is)
reel e4c3-music-06-telling        22 anull x3tellmus_a@6 x3tellmus_b@6 x3tellmus_c@6               # in the game: 2 (b)
reel e4c3-music-07-answers        22 anull x3answmus_a@30 x3answmus_b@30 x3answmus_c@30            # in the game: 1 (a)
reel e4c3-music-08-ending-accept  22 anull x3endA_a@2 x3endA_b@2 x3endA_c@2                        # in the game: 1 (a)
reel e4c3-music-09-ending-challenge 17 anull x3endB_a@1 x3endB_b@0.5 x3endB_c@0.8                  # in the game: 3 (c). 1 (a) is over 4 s before the film's silence comes
reel e4c3-music-10-ending-why     22 anull x3endC_a@1 x3endC_b@1 x3endC_c@1.3                      # in the game: 2 (b)
reel e4c3-music-11-ending-stop    22 anull x3endD_a@2 x3endD_b@1.3 x3endD_c@0.9                    # in the game: 3 (c)
reel e4c3-music-12-close-to-breath 22 anull x3closemus_a@0 x3closemus_b@0.8 x3closemus_c@0.3       # in the game: 2 (b)
reel e4c3-music-13-close-last     24 anull x3lastmus_a@3.3 x3lastmus_b@0.8 x3lastmus_c@1.2         # in the game: 3 (c). 1 (a) is over 3 s before the film is
