#!/bin/bash
# v27.0 · episode 4 chapter 4, The Woman Who Rose From Her Wheelchair: ITS SOUND (effects, beds, music), made from the
# masters into the game's files. Its voices are masters/v27.0/voices (their own chain).
#   bash masters/v27.0/sound.sh [sfx|beds|music]        (no word: all of it)
# The build's tracker: docs/V27.0-E4C4-BUILD.md (M8). Every pick and why is on its line here; each stands until Chad's ear.
#
# THE EFFECTS AND BEDS: flow s05piKagqsiexKUe8sI5, eleven_text_to_sound_v3, two takes each, the length and the loop as the
# model's own parameters (sound/sfx.py -> sound/sfx.json; sound/sessions-sfx.json every node and session; 90 takes, none
# failed), every take measured (sound/measure.py -> sound/measures-sfx.json: its level where it sounds, how much is silence,
# the share a phone's speaker plays (over 150 Hz), the share in the voice's band, a loop's join, and what a transcriber writes
# from a take that must be wordless: two were refused for words, u4cry a "AHHHH..." and u4gaspm a "GASP!"). THE PICK: the
# share a phone plays first, then no word, then fullness, then the least in the voice's band where a line is said over it.
# FIVE FAILED THE MEASURE IN BOTH TAKES (a phone plays 2 to 11 % of them):
#   the heart, the fan stopping and the lift: harmonised as chapter 1's heart was (v24.0 w4heart: its own thump's harmonics
#   laid under it, HARM below), the take itself kept whole beneath;
#   the drops landing and her first steps: MADE (sound/synth.py, its head says how);
#   the dark room's bed: its low room (u4dark a, as it came) with the estate's night at the windows over it (u4estate b,
#   its top taken off at 2.5 kHz, 8 dB under), so a phone hears the night.
# THE MUSIC: the same flow, eleven_music_v2_5, instrumental, two takes of each of ten cues (sound/music.py -> sound/music.json;
# sound/sessions-music.json); TWO MADE AGAIN in the middle and upper registers (sound/music2.json, sessions-music2.json):
# the opening film's and ending B's came back 95 to 98 % under 150 Hz. The pick by the share a phone plays; each film's cue
# is measured against its film (where nobody speaks, a hole) when the films are cut (M7), and a pick may move then.
set -e
cd "$(dirname "$0")"
ONLY="${1:-}"
A=../../assets/audio; O=../../assets/audio-opus
R=sound/raw
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels: peak-matched, two passes (the encoders move it, v9.6)
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 $A/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 $O/$n.ogg
    pm=$(peak $A/$n.mp3); po=$(peak $O/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"; rm -f e_$n.wav; }
flat() { # name wav channels opus_bitrate: a file already at its level, encoded as it is
  n=$1; w=$2; ch=$3; br=$4
  ffmpeg -v error -y -i "$w" -ac $ch -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 $A/$n.mp3
  ffmpeg -v error -y -i "$w" -ac $ch -map_metadata -1 -c:a libopus -b:a $br -ar 48000 $O/$n.ogg
  echo "$n <- $w  (as levelled)"; }
fx() { # name src level [ffmpeg filter]: A ONE-SHOT, its loudest twentieth of a second at `level` under a limiter, peaks
       # at -2 (chapter 3's fx: masters/v26.0/sound.sh says why a one-shot is not peak-matched), in its own channels
  n=$1; s=$2; lv=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav
  python3 ../v26.0/sound/level_fx.py w_$n.wav l_$n.wav $lv -2
  flat $n l_$n.wav $ch 96k; rm -f w_$n.wav l_$n.wav; }
fxc() { # name src level filter_complex: fx through a filter graph ([0:a] in, its last output out)
  n=$1; s=$2; lv=$3; fc=$4
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -filter_complex "$fc" -ar 48000 w_$n.wav
  python3 ../v26.0/sound/level_fx.py w_$n.wav l_$n.wav $lv -2
  flat $n l_$n.wav $ch 96k; rm -f w_$n.wav l_$n.wav; }
bed() { # name src target_rms ceiling [filter]: A LOOP (the model's own loop flag), levelled by RMS, padded for the
        # engine's insets (chapter 3's bed)
  n=$1; s=$2; t=$3; c=$4; pf=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$pf,highpass=f=60:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v21.12/level_rms.py b_hp_$n.wav b_lv_$n.wav $t $c >/dev/null
  python3 ../v24.34/music/padloop.py b_lv_$n.wav b_$n.wav >/dev/null
  flat $n b_$n.wav 2 96k; rm -f b_hp_$n.wav b_lv_$n.wav b_$n.wav b_*.f32; }
# HARM: a sound a phone cannot play given the harmonics of its own low end (v24.0's w4heart: the low end alone, lifted,
# softly clipped, the band a phone plays kept), laid under the sound itself, which is kept whole
HARM="[0:a]asplit[a][b];[b]lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,lowpass=f=2500,volume=-6dB[h];[a][h]amix=inputs=2:normalize=0"

[ -f sound/made/u4steps.wav ] || (cd ../.. && python3 -I masters/v27.0/sound/synth.py)
if [ -z "$ONLY" ] || [ "$ONLY" = sfx ]; then
# ---- Spirit Vision
fx   u4vison     $R/u4vison_b.mp3     -14                                     # b: the swell and its thump, 63 % where a phone plays (a is a breath at -35, all air)
fxc  u4heart     $R/u4heart_a.mp3     -10 "$HARM"                             # HARMONISED: a is 98 % under 150 Hz and b near silent (-46); a with its own thump's harmonics
# ---- the opening film
fxc  u4lift      $R/u4lift_a.mp3      -14 "$HARM"                             # HARMONISED: the hum and the cable, both 90 % under 150 Hz; a, 2 dB fuller
fx   u4liftdoor  $R/u4liftdoor_b.mp3  -14                                     # b: 7 dB fuller, 83 % where a phone plays
fx   u4gate      $R/u4gate_a.mp3      -14                                     # a: the gate's rattle and latch, 14 dB fuller than b
fx   u4sandals   $R/u4sandals_a.mp3   -14                                     # a: the steps' level even (b's one scrape peaks 30 dB over its body)
# ---- the flat
fx   u4tile      $R/u4tile_a.mp3      -16                                     # a: one bare step, 99 % where a phone plays (b 89 %); his bare step at -16, as chapter 1's and episode 3's
fx   u4tubetick  $R/u4tubetick_b.mp3  -14                                     # b: the louder tick, less of it in the voice's band (44 % against 57)
fx   u4fanslow   $R/u4fanslow_a.mp3   -14                                     # a: 34 % where a phone plays (b is 98 % under 150 Hz)
fx   u4doorease  $R/u4doorease_b.mp3  -14                                     # b: the creak itself, 10 dB fuller, 97 % where a phone plays
fx   u4breath    $R/u4breath_b.mp3    -14                                     # b: 10 dB fuller, no word heard
fx   u4fog       $R/u4fog_a.mp3       -14                                     # a: the faint hiss, 96 % where a phone plays (b 73 %)
fx   u4sting     $R/u4sting_b.mp3     -14                                     # b: 40 % where a phone plays (a is a boom, 91 % under 150 Hz)
# ---- the blessing
fx   u4match     $R/u4match_b.mp3     -14                                     # b: the strike and the flame, 4 dB fuller
fx   u4tubedie   $R/u4tubedie_a.mp3   -14                                     # a: the tube's buzz and its last flickers (b is all hiss over 3.4 kHz, nothing of a tube)
fxc  u4fanstop   $R/u4fanstop_a.mp3   -14 "$HARM"                             # HARMONISED: both 97 to 98 % under 150 Hz; a, the fuller wind-down
fx   u4tvdie     $R/u4tvdie_b.mp3     -14                                     # b: the static and its death, 16 % in the voice's band (a 57 %: Grandmaster Pho is speaking over it)
# ---- the fight
fx   u4flick     $R/u4flick_a.mp3     -14                                     # a: the flick, 16 dB fuller than b
fx   u4patter    sound/made/u4patter.wav -14                                  # MADE (synth.py): both takes 94 % under 150 Hz and near silent
fx   u4dip       $R/u4dip_a.mp3       -14                                     # a: the dip, less in the voice's band than b (64 % against 88: the chant goes on over it)
fx   u4release   $R/u4release_b.mp3   -14                                     # b: the sigh and its shimmer, 15 dB fuller, no word heard
fx   u4large     $R/u4large_a.mp3     -14                                     # a: 48 % where a phone plays (b is 95 % under 150 Hz)
fx   u4gaspf     $R/u4gaspf_b.mp3     -14                                     # b: a woman's gasp (67 % in the voice's band; a is mostly air), no word heard
fx   u4gaspm     $R/u4gaspm_b.mp3     -14                                     # b: no word heard (a: the transcriber writes "GASP!")
fx   u4chill     $R/u4chill_a.mp3     -14                                     # a: 80 % where a phone plays (b is 85 % under 150 Hz)
fx   u4husband   $R/u4husband_b.mp3   -14                                     # b: the old man's sigh, 9 dB fuller, no word heard
fx   u4cry       $R/u4cry_b.mp3       -14 "highpass=f=120"                    # b: the cry, no word heard (a: the transcriber writes "AHHHH...")
# ---- the endings
fx   u4torn      $R/u4torn_b.mp3      -14                                     # b: 94 % where a phone plays (a 32 %)
fx   u4scuffle   $R/u4scuffle_a.mp3   -14                                     # a: 87 % where a phone plays
fx   u4fall      $R/u4fall_b.mp3      -14                                     # b: 77 % where a phone plays (a 55 %)
fx   u4stand     $R/u4stand_b.mp3     -14                                     # b: the chair's creak, 92 % where a phone plays
fx   u4steps     sound/made/u4steps.wav -16                                   # MADE (synth.py): both takes 89 to 92 % under 150 Hz; her bare feet, as his are (-16)
fx   u4bell      $R/u4bell_b.mp3      -14                                     # b: the longer ring
# ---- the estate's own noises in play
fx   u4os1       $R/u4os1_a.mp3       -14                                     # a lift's chime far down the corridor: a, 7 dB fuller
fx   u4os2       $R/u4os2_b.mp3       -14                                     # slippers passing outside: b, no word heard
fx   u4os3       $R/u4os3_b.mp3       -14                                     # the rubbish chute: b, from its first frame (a waits 0.3 s)
fx   u4os4       $R/u4os4_a.mp3       -14                                     # a dog, far: a, 9 dB fuller
fx   u4os5       $R/u4os5_b.mp3       -14                                     # a gecko: b, 18 dB fuller
fx   u4os6       $R/u4os6_a.mp3       -14                                     # a motorbike far below: a, 9 dB fuller
fi

if [ -z "$ONLY" ] || [ "$ONLY" = beds ]; then
bed  u4visbed    $R/u4visbed_a.mp3    -30 -12                                 # Spirit Vision's bed: a, 22 % in the voice's band (b 93 %: Grandmaster Pho speaks while it is open)
bed  u4flatbed   $R/u4flatbed_a.mp3   -30 -12                                 # the living room: a, 79 % where a phone plays (b 25 %)
bed  u4estate    $R/u4estate_a.mp3    -30 -12                                 # the estate at the windows: a, 86 % where a phone plays (b 41 %)
bed  u4corridor  $R/u4corridor_b.mp3  -30 -12                                 # the corridor and the lift lobby: b, the steadier (6 dB against 15) and more a phone plays
ffmpeg -v error -y -i $R/u4dark_a.mp3 -i $R/u4estate_b.mp3 -filter_complex "[1:a]lowpass=f=2500,volume=-8dB[e];[0:a][e]amix=inputs=2:normalize=0" -ar 48000 -ac 2 d_u4dark.wav
bed  u4dark      d_u4dark.wav         -30 -12                                 # the dark room: its low room (a) and the estate's night at the windows (estate b, lowpassed, -8 dB)
rm -f d_u4dark.wav
bed  u4whisper   $R/u4whisper_a.mp3   -30 -12                                 # the wanderers' whispers: a, the steadier (4 dB against 8), no word heard
fi

# ---- (v27.0, the wiring) Spirit Vision's wave home: its swell run backwards, as the wave is; and his second bare step
if [ -z "$ONLY" ] || [ "$ONLY" = sfx ]; then
fx   u4visoff    $R/u4vison_b.mp3     -14 "areverse"                          # the swell out, reversed: the wave coming home to him (Chad: "the same effect but in reverse")
fx   u4tile2     $R/u4tile_b.mp3      -16                                     # his other bare step (b, 89 % where a phone plays): stepSound deals the two
fi

# ---- (v27.0 build 18, Chad 18 Nov: "Everytime the green spirits get to her, she screams one time" ... "This entire sequence
# needs its own sound effects etc.") Amma's cry when a green one reaches her (three, dealt in turn); the surge of too many;
# the call to Luang Phor Phiboon, the power taking hold, each golden flick and every green one released at once.
if [ -z "$ONLY" ] || [ "$ONLY" = sfx ] || [ "$ONLY" = fight ]; then
fx   u4ascream1  $R/u4ascream_a.mp3   -14                                     # a: her cry, no word heard (4 flat-topped peaks)
fx   u4ascream2  $R/u4ascream_b.mp3   -14                                     # b: no word heard, the least clipped (3)
fx   u4ascream3  $R/u4ascream_d.mp3   -14                                     # d: no word heard (c refused: 8 flat-topped peaks, the most clipped)
fx   u4surge     $R/u4surge_a.mp3     -14                                     # a: the hissing rush, no word heard (b sounds at -36, 21 dB under a)
fx   u4goldcall  $R/u4goldcall_a.mp3  -14                                     # a: the gong, the bells and the wordless choir, all where a phone plays (b is 81 % outside the voice's band: a drone)
ffmpeg -v error -y -i $R/u4goldpower_c.mp3 -i $R/u4goldpower_b.mp3 -filter_complex "[1:a]asplit[a][b];[b]lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,lowpass=f=2500,volume=-6dB[h];[a][h]amix=inputs=2:normalize=0,volume=-6dB[m];[0:a]volume=16dB[s];[s][m]amix=inputs=2:normalize=0" -ar 48000 -ac 2 d_u4goldpower.wav
fx   u4goldpower d_u4goldpower.wav    -14                                     # the second prompt's shimmer (c, all where a phone plays) over the first's boom (b, 99 % under 150 Hz) with its harmonics laid in (HARM): the boom for a desktop, its harmonics and the shimmer for a phone
rm -f d_u4goldpower.wav
fx   u4goldflick $R/u4goldflick_b.mp3 -14                                     # b: 93 % where a phone plays (a 29 %)
fx   u4goldclear $R/u4goldclear_d.mp3 -14                                     # d: the second prompt's, the fuller (8 dB over c); the first prompt's two sound at -45, nearly nothing
fi

# ---- THE MUSIC (sound/measures-music.json, sound/measures-music2.json): music at peak -3 (v22.4), Opus 128k
cuthead() { echo "atrim=start=$1,asetpts=PTS-STARTPTS,afade=t=in:d=0.04"; }
mus() { # name src [ffmpeg filter]: a film's cue
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }
mbed() { # name src seconds start filter: A MUSIC LOOP (chapter 3's: the loop cut from the body where what follows sounds most
         # like its head, a 2 s crossfade, ../v21.2/musicloop.py; padded for the engine's insets)
  n=$1; s=$2; L=$3; st=$4; af=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 -ac 2 f_$n.wav
  python3 ../v21.2/musicloop.py f_$n.wav $L $st
  python3 ../v24.34/music/padloop.py w_f_$n.wav p_$n.wav
  enc $n p_$n.wav -3.0 -3.0 128k 2; rm -f f_$n.wav w_f_$n.wav p_$n.wav; }
if [ -z "$ONLY" ] || [ "$ONLY" = music ]; then
mus  u4openmus   $R/u4openmus2_b.mp3  "$(cuthead 0.45)"                       # the opening film: MADE AGAIN (both first takes 97 to 98 % under 150 Hz); b, 88 % where a phone plays (a 78 %); its silent head cut
mbed u4histmus   $R/u4histmus_b.mp3   48 4                                    # history's quiet music, a loop: b, 48 % where a phone plays (a 21 %)
mbed u4vismus    $R/u4vismus_b.mp3    22 3                                    # Spirit Vision's music, a loop: b, 94 % where a phone plays (a 18 %: its throb is sub-bass)
mus  u4fightmus  $R/u4fightmus_a.mp3  "$(cuthead 0.15)"                       # the fight, one pass from its first second: a, 54 % where a phone plays (b 45 %)
mus  u4trancemus $R/u4trancemus_a.mp3 "afade=t=in:d=0.3"                      # the trance: a, 27 % where a phone plays (b 17 %); it begins on signal, so faded in
mus  u4endA      $R/u4endA_b.mp3      "$(cuthead 1.15)"                       # ending A: b, 65 % where a phone plays (a 9 %)
mus  u4endB      $R/u4endB2_b.mp3     "afade=t=in:d=0.6"                      # ending B: MADE AGAIN (both first takes 95 to 96 % under 150 Hz); b, 95 % where a phone plays, 35 % in the voice's band (a 67 %)
mus  u4endC      $R/u4endC_a.mp3      "$(cuthead 0.75)"                       # ending C: a, 81 % where a phone plays (b 69 %)
mus  u4endD      $R/u4endD_a.mp3      "afade=t=in:d=0.6"                      # ending D: a, 96 % where a phone plays, 42 % in the voice's band (b 76 %)
mus  u4closemus  $R/u4closemus_a.mp3  "$(cuthead 0.05)"                       # the close: a, 71 % where a phone plays (b 68 %)
fi
# ---- (v27.0, 18 Nov) THE FIGHT'S MUSIC, LOOPED: the blessing runs 116 s at its own pace and slows while the shapes crowd her
#      or her teacher, so a fight may outlast the one pass (150 s); its body as a loop comes in under the pass's last 3 s
#      (c_tsound.js fightMusTick). The same take (a), its flattest 48 s, the join crossfaded where like meets like
if [ -z "$ONLY" ] || [ "$ONLY" = music ] || [ "$ONLY" = fightloop ]; then
mbed u4fightloop $R/u4fightmus_a.mp3  48
fi
