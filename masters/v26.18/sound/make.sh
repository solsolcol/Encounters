#!/bin/bash
# v26.18 · THE HALL'S OWN SOUND (episode 4 chapter 3, the morning moved inside the hall; the tracker's H6), from the
# masters to the game's files:  bash masters/v26.18/sound/make.sh
#   The takes: masters/v26.18/sound/sessions-hall.json (the flow, its nodes, sessions and prompts), fetched by
#   masters/v26.0/sound/get.sh into masters/v26.0/sound/raw/.
#   1. HIS BARE FEET ON ITS TILE. x3tileC (four takes of a slow barefoot walk on glazed tile): every take a low thud, 2 to
#      35 % of it over 150 Hz, which a phone's speaker barely plays: refused. x3tileD, asked again for the crisp slap of
#      skin on tile and no thud: a, b and d again thuds (0 to 1 % over 150 Hz), c 70 % over 150 Hz and 68 % over 3.4 kHz,
#      three falls: THE PICK, by measure (masters/v26.18/sound/tiles.json). Its three falls are the hall's steps, all of one
#      walk as the grass's are (v26.1: one foot on one floor): masters/v26.18/sound/tiles.py cut 3 -> made/x3tile1..3.wav;
#      each levelled as every bare footstep in the game is (its loudest 50 ms at -16 dBFS, peaks held at -2), mono.
#   2. THE ROOM'S TONE (x3hallbed: the wall fans' whir and hum, the room, birds far off through the door; the model's own
#      loop flag, 22 s). a, b and c are a motor's rumble, 13 to 22 % of it over 150 Hz: refused for a phone. d: 58 % over
#      150 Hz, second by second within 0.7 dB, its loop's joint no larger than a sample's step, no word heard by the
#      transcriber: THE PICK, by measure. A bed as the house's beds are (masters/v26.0/sound.sh bed()): the rumble under
#      60 Hz taken off, levelled by RMS to -30 dBFS (peaks held at -12), padded for the engine's insets, stereo as it came;
#      the game plays it at 0.56, -35 dBFS, as it plays the morning's birds (d_play.js BED.hall).
#   Both are the measured picks until his ear (masters/v26.18/sound/previews).
set -e
cd "$(dirname "$0")/../../v26.0"
A=../../assets/audio; O=../../assets/audio-opus; R=sound/raw; M=../v26.18/sound/made
flat() { n=$1; w=$2; ch=$3; br=$4
  ffmpeg -v error -y -i "$w" -ac $ch -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 $A/$n.mp3
  ffmpeg -v error -y -i "$w" -ac $ch -map_metadata -1 -c:a libopus -b:a $br -ar 48000 $O/$n.ogg
  echo "$n <- $w  (as levelled)"; }
for i in 1 2 3; do
  n=x3tile$i
  ffmpeg -v error -y -i $M/$n.wav -ar 48000 w_$n.wav
  python3 sound/level_fx.py w_$n.wav l_$n.wav -16 -2
  flat $n l_$n.wav 1 64k; rm -f w_$n.wav l_$n.wav
done
n=x3hallbed
ffmpeg -v error -y -i $R/x3hallbed_d.mp3 -af "anull,highpass=f=60:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
python3 ../v21.12/level_rms.py b_hp_$n.wav b_lv_$n.wav -30 -12 >/dev/null
python3 ../v24.34/music/padloop.py b_lv_$n.wav b_$n.wav >/dev/null
flat $n b_$n.wav 2 96k; rm -f b_hp_$n.wav b_lv_$n.wav b_$n.wav b_*.f32
#   3. THE HALL'S OWN THEME (Chad, 16 Nov 2026: "I think the hall should have its own music theme as well but i dont know
#      what it should be"). Four directions, one take each, eleven_music_v2_5, 75 s, instrumental (sessions-hall.json):
#      A a khim solo, B a drone with a singing bowl and the khlui, C the saw u with the low ranat, D a hushed mahori
#      ensemble; loudness-matched previews (RMS -20) for his ear: masters/v26.18/sound/previews/hall-theme-[ABCD].mp3.
#      THE MEASURE'S PICK UNTIL HIS EAR: C, the only one a phone's speaker plays (64 % of it over 150 Hz; A 13 %, B 7 %,
#      mostly low notes), and D (98 % in the voice's band, 300 Hz to 3.4 kHz) would sit on Grandmaster Pho's voice where
#      C has 22 % there. Made as the chapter's music loops are (masters/v26.0/sound.sh mbedlv): the flattest 50 s of its
#      body (../v21.2/musicloop.py), levelled by its average to RMS -27 dBFS round the loop (../v26.8/looplevel.py), padded
#      for the engine's insets, encoded as levelled; the game plays it at 0.5 (-33 dBFS) in play inside the hall.
#      (Another letter: THEME=<A|B|C|D> bash masters/v26.18/sound/make.sh, and its row in the tracker.)
T=${THEME:-C}; n=x3hallmus
ffmpeg -v error -y -i $R/x3hallmus${T}_a.mp3 -ar 48000 -ac 2 f_$n.wav
python3 ../v21.2/musicloop.py f_$n.wav 50
python3 -I ../v26.8/looplevel.py w_f_$n.wav l_$n.wav -27 -1.0
python3 ../v24.34/music/padloop.py l_$n.wav p_$n.wav
flat $n p_$n.wav 2 128k; rm -f f_$n.wav w_f_$n.wav l_$n.wav p_$n.wav
