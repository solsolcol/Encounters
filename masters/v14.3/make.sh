#!/bin/sh
# v14.3 · ONE LINE RE-SAID. Chad, on episode 2 chapter 4: "the voicelines keep
# referring to lane 5, when it should say lane 6 at the player instead."
# `t4who` is the tower's challenge after a shot, and the only take in the
# chapter that names a lane the player is not standing on. It is now the
# PLAYER's lane, which is also what makes it true: v14.3 attaches the
# challenge to the player's own first round rather than to a scripted shot
# from lane five (see e2c4.js `onFiredAtIt`), so the tower is answering the
# man it is talking to.
#
# Four takes, picked by the EDGES (the v5.30 rule: a take that begins or ends
# on signal clicks through the voice envelope) — take c has the quietest head
# of the four at -47.3 dBFS against -31.3, -35.2 and -39.2, and its tail is
# level with the rest. The pace is the same in all four (2.30-2.37 words a
# second), so there was nothing to choose between them there.
#
# The tower is CAST, so he is levelled BY RMS to -16 dBFS through the v11.1
# limiter and encoded plainly - the cast bus is FLAT (v11.1), and every other
# tower line in the pack sits at that number.
set -e
cd "$(dirname "$0")"
cast() { # name src
  n=$1; src=$2
  python3 ../v11.1/level.py "$src" w_$n.wav -16
  ffmpeg -v error -y -i w_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i w_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  rm -f w_$n.wav w_$n.wav.f32
}
cast t4who raw/t4who_c.mp3
