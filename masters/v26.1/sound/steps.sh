#!/bin/bash
# v26.1 · his feet on the grass (Chad, 12 Nov 2026: "i dislike the walking sound effect, it does not sound like walking on
# grass ground, do a better sound effect for it please"), from the masters to the game's files:  bash masters/v26.1/sound/steps.sh
#   1. sixteen takes, four kinds (masters/v26.0/sound/sessions-grass.json: the flow, the nodes, the prompts, the sessions;
#      fetched by masters/v26.0/sound/get.sh into masters/v26.0/sound/raw/x3grass[ABCD]_[abcd].mp3);
#   2. measured: python3 -I masters/v26.1/sound/steps.py measure  (steps.json: each take's falls, its share over 150 Hz);
#      three takes refused as thuds a phone does not play (B_c 6 %, D_a 22 %, B_d 32 % over 150 Hz);
#   3. a walk of each kind at the game's own pace (a fall every 0.22 s), loudness matched beside v26.0's, for his ear:
#      python3 -I masters/v26.1/sound/steps.py reel  ->  masters/v26.1/sound/previews/steps-*.mp3;
#   4. THE PICK UNTIL HIS EAR, by measure: C, a short walk of four steps on a lawn said four times, cut into its falls
#      (every one of its takes 97 to 100 % over 150 Hz: all of it reaches a phone's speaker; four steps of ONE walk are one
#      foot on one ground, where single takes differ from each other as four different floors); the eight crispest falls
#      (the most of each one's energy in its first 60 ms: a footfall, not a rustle that runs on):
#      python3 -I masters/v26.1/sound/steps.py cut x3grassC 8 x3grass  ->  masters/v26.1/sound/made/x3grass1..8.wav;
#   5. each levelled as every bare footstep in the game is (its loudest 50 ms at -16 dBFS, peaks held at -2: the
#      house's level_fx.py) and encoded as the house does (mp3 128k, Opus 64k mono).
set -e
cd "$(dirname "$0")"
A=../../../assets/audio; O=../../../assets/audio-opus
for i in 1 2 3 4 5 6 7 8; do
  n=x3grass$i
  ffmpeg -v error -y -i made/$n.wav -ar 48000 w_$n.wav
  python3 ../../v26.0/sound/level_fx.py w_$n.wav l_$n.wav -16 -2
  ffmpeg -v error -y -i l_$n.wav -ac 1 -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 $A/$n.mp3
  ffmpeg -v error -y -i l_$n.wav -ac 1 -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 $O/$n.ogg
  rm -f w_$n.wav l_$n.wav; echo "$n <- made/$n.wav (as levelled)"
done
