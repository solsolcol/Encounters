#!/bin/sh
# v23.0 CP11 · previews for Chad's ear (the v10.6 rule: the music is picked by measurement and then put to him), every
# file loudness-matched to -16 LUFS so a take is never preferred for being louder. The shipped pick is named; the others
# are there so he can say "use 2 instead" by number.
set -e
cd "$(dirname "$0")"
ln() { ffmpeg -v error -y -i "$1" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -ac 2 -b:a 160k "$2"; echo "$2"; }
# the lullaby (the music box's tune), four takes — 2 is in the game
i=1; for t in a b c d; do ln ../music/raw/k5lullaby_$t.mp3 lullaby-$i.mp3; i=$((i+1)); done
# the three children's motifs, the best ending's music and the epilogue's, two takes each — 1 is in the game
for cue in red shy lonely endD epi; do
  case $cue in red|shy|lonely|endD|epi) first=a; second=b;; esac
  ln ../music/raw/k5${cue}_$first.mp3 music-$cue-1.mp3; ln ../music/raw/k5${cue}_$second.mp3 music-$cue-2.mp3
done
# the box's three fates (made from the lullaby, nothing generated)
for f in k5endA k5endB k5endC; do ln ../../../assets/audio/$f.mp3 fate-$f.mp3; done
# the voices as shipped: the children (through him), the owner's whole telling, the monk and Ma
cat_lines() { out=$1; shift; : > list.txt
  for n in "$@"; do ffmpeg -v error -y -i ../../../assets/audio/$n.mp3 -ar 44100 -ac 2 v_$n.wav; echo "file 'v_$n.wav'" >> list.txt; echo "file 'gap.wav'" >> list.txt; done
  ffmpeg -v error -y -f concat -safe 0 -i list.txt -af "loudnorm=I=-16:TP=-1.5:LRA=11" -b:a 160k "$out"; rm -f v_*.wav list.txt; echo "$out"; }
ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 0.9 gap.wav
cat_lines voices-children.mp3 z5b1 z5b2 z5b3 z5b4 z5s1 z5s2 z5s3 z5s4 z5l1 z5l2 z5l3 z5sob z5Agig
cat_lines voices-owner.mp3 ow5hello ow5yin ow5monk ow5red ow5shy ow5little ow5give ow5never ow5wrong ow5promise ow5careful
cat_lines voices-monk-and-ma.mp3 mk5teach ma5vm
rm -f gap.wav
