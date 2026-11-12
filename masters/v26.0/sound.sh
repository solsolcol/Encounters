#!/bin/bash
# v26.0 · episode 4 chapter 3, I Finally Found My Answers: ITS SOUND, made from the masters into the game's files.
#   bash masters/v26.0/sound.sh [voices|chant|sfx|beds|music]        (no word: all of it)
# The build's tracker: docs/V26.0-E4C3-BUILD.md (M7). Every pick and why is on its line here.
#
# THE VOICES (CP7.1). Four speakers, eleven_v3. HE, Brian (bP8FJDHmWVEgXJDitdQd), as episodes 3 and 4. Three new people,
# each auditioned against two others on their own lines and measured (audition/measure.py: length, pace over the
# script's words, the words a transcriber hears, the median pitch, the longest hole), the pick by measure until Chad's
# ear (one reel a role went to him with Deploy 2, audition/previews/):
#   GRANDMASTER PHO  Songkran (xYmBpJREC3WfqEFpbPvO): the deepest by far, 82 to 87 Hz (Somchai 118 to 120, Duang 133
#                    to 141), and his first take at 2.37 words a second where the others ran near 3
#   TON              Kirin (uI1epevl1X6hqrxEciKt): the game's pace (2.4), every word heard (ToNCe rushed at 3.1 to 3.8;
#                    Ohm lost five words to the transcriber)
#   THE WOMAN        Kanya (B4NdgwdU97lHqA8Udh2D): an older woman's pitch (187 Hz), unhurried (1.9) with no long hole
#                    (Siriporn left holes of 1.3 and 1.9 s; HammyTH is younger and brighter, 207 Hz)
# 104 lines (script/lines.py), each said as script/tags.py directs (one tag naming an emotion; the words exactly),
# two takes a line and three for Grandmaster Pho (voices/prompts.json; voices/sessions-1.json to -4.json: four workers,
# four flows, 247 takes, none failed). EIGHT LINES WERE SAID AGAIN (voices/sessions-resay.json: three more takes each):
# one whose two takes were both cut on their last word, seven whose two takes both ran over 3.4 words a second.
# THE PICK (voices/pick.py -> voices/picks.json): every take transcribed here (faster-whisper small.en, nothing
# uploaded) and measured; a clean end first, then no odd hole, then not rushed, then for him, Ton and the woman the
# easier pace and the tighter read, and for Grandmaster Pho the UNHURRIED read. THE CHAIN (voices/chain.py ->
# voices/CHAIN.txt, one row a line with its pick and why): the house's, unchanged.
#
# THE CHANT (CP7.2): chant/build.py (its head says how): one monk leads each of the three lines of homage, made a
# group of four of himself, over the ground's loudspeakers (x3chant) and from a temple across the fields (x3chantfar);
# each line laid where its bow is, so the captions and the voice are one clock (chant/timing.json).
#
# THE EFFECTS AND BEDS (CP7.4): flow WRJ4HzibEIDJwdJVaUy4, eleven_text_to_sound_v2, prompt influence 0.3, the length
# and the loop as the model's own parameters (sound/sfx.py -> sound/sfx.json; two takes each, 88 takes, none failed),
# every take measured (sound/measure.py -> sound/measures-sfx.json: its level where it sounds, how much is silence, the
# share a phone's speaker plays (over 150 Hz), the share in the voice's band, a loop's join, and what a transcriber
# writes from a take that must be wordless). TWO WERE MADE AGAIN with a prompt that asks for no low end
# (sound/sfx2.json, influence 0.5, four takes each): the bare footstep and the whole ground bowing, whose first takes
# kept 98 to 99 % of their energy under 150 Hz. FOUR WERE MADE HERE (sound/synth.py, its head says why): the petals,
# the world closing, the world heard open, the pull's drone.
set -e
cd "$(dirname "$0")"
ONLY="${1:-}"
A=../../assets/audio; O=../../assets/audio-opus
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
fx() { # name src level [ffmpeg filter]: A ONE-SHOT, levelled by its LOUDEST TWENTIETH OF A SECOND under a limiter
       # (sound/level_fx.py: its head says why. First they were peak-matched, as a voice take is, and measured against
       # the music each is cued over, 28 of the chapter's cues stood 11 to 31 dB under it: a pen's stroke or a typed key
       # is a tick a millisecond long over a quiet body, and its peak says nothing of how loud it is). Every one-shot
       # now has its loudest 50 ms at -14 dBFS (his bare footstep at -16, as episode 3's and chapter 1's), peaks held at
       # -2: so a cue's volume says where it stands (0.32 is -24 dBFS at its loudest; 0.2 is -28), in its own channels
  n=$1; s=$2; lv=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav
  python3 sound/level_fx.py w_$n.wav l_$n.wav $lv -2
  flat $n l_$n.wav $ch 96k; rm -f w_$n.wav l_$n.wav; }
flat() { # name wav channels opus_bitrate: a file already at its level, encoded as it is
  n=$1; w=$2; ch=$3; br=$4
  ffmpeg -v error -y -i "$w" -ac $ch -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 $A/$n.mp3
  ffmpeg -v error -y -i "$w" -ac $ch -map_metadata -1 -c:a libopus -b:a $br -ar 48000 $O/$n.ogg
  echo "$n <- $w  (as levelled)"; }
long() { # name src target_rms ceiling [filter]: a long single pass (a bed a film cues once), levelled by RMS (v21.13)
  n=$1; s=$2; t=$3; c=$4; pf=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$pf,highpass=f=60:poles=2" -ar 48000 -ac 2 l_hp_$n.wav
  python3 ../v21.12/level_rms.py l_hp_$n.wav l_$n.wav $t $c >/dev/null
  flat $n l_$n.wav 2 96k; rm -f l_hp_$n.wav l_$n.wav l_*.f32; }
bed() { # name src target_rms ceiling [filter]: A LOOP. The take is a loop already (the model's own flag, or made whole
        # cycles long), so nothing is crossfaded: it is levelled by RMS, then padded for the engine's insets (it plays
        # [0.06, length - 0.06]: padloop.py lays the loop's last 0.06 s before it and its first 0.06 s after, v24.34)
  n=$1; s=$2; t=$3; c=$4; pf=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$pf,highpass=f=60:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v21.12/level_rms.py b_hp_$n.wav b_lv_$n.wav $t $c >/dev/null
  python3 ../v24.34/music/padloop.py b_lv_$n.wav b_$n.wav >/dev/null
  flat $n b_$n.wav 2 96k; rm -f b_hp_$n.wav b_lv_$n.wav b_$n.wav b_*.f32; }

if [ -z "$ONLY" ] || [ "$ONLY" = voices ]; then
(cd ../.. && python3 -I masters/v26.0/voices/chain.py)
fi

if [ -z "$ONLY" ] || [ "$ONLY" = chant ]; then
(cd ../.. && python3 -I masters/v26.0/chant/build.py)
flat x3chant    chant/x3chant.wav    1 64k                                    # over the ground's loudspeakers: its voice at RMS -17, the lines at 1.4, 7.0 and 12.6 s
flat x3chantfar chant/x3chantfar.wav 1 64k                                    # from the temple across the fields (ending D): RMS -22, the band of a far horn, the lines at 0.5, 6.1 and 11.7 s
rm -f chant/x3chant.wav chant/x3chantfar.wav
fi

R=sound/raw
# (the four sounds made here are remade from their seeds when absent: they are not kept in the repository)
[ -f sound/made/x3pull.wav ] || (cd ../.. && python3 -I masters/v26.0/sound/synth.py)
if [ -z "$ONLY" ] || [ "$ONLY" = sfx ]; then
# ---- the opening film: his shop at night
fx   x3keys      $R/x3keys_a.mp3      -14                                     # a: soft keys through its 3 s, 72 % where a phone plays (b peaks over full scale, 51 %)
fx   x3send      $R/x3send_b.mp3      -14                                     # b: the whoosh is there (peak -10); a is a floor at -45
fx   x3page      $R/x3page_a.mp3      -14                                     # a: 11 dB fuller than b, 90 % where a phone plays
fx   x3pen       $R/x3pen_a.mp3       -14                                     # a: the stroke on paper (55 % over 150 Hz); b is a thump (5 %)
fx   x3zip       $R/x3zip_a.mp3       -14                                     # a: one pull, 14 dB fuller than b
fx   x3cabin     $R/x3cabin_b.mp3     -14 "afade=t=in:d=0.5,afade=t=out:st=5.2:d=0.8"   # b: the drone with more a phone can play (41 % against 30); faded in and out, it is under a black
# ---- foley
fx   x3step      $R/x3step2_b.mp3     -16 "afade=t=out:st=0.45:d=0.2"         # MADE AGAIN, b: a crisp rustle, 78 % over 150 Hz and the fullest of the three that are (a is 97 % thud)
fx   x3kneel     $R/x3kneel_b.mp3     -14                                     # b: 7 dB fuller, the cloth and the knees
fx   x3bowall    $R/x3bowall2_d.mp3   -14                                     # MADE AGAIN, d: the widest held rustle of the four (the highest level against its own peak), 99 % where a phone plays
fx   x3baitake   $R/x3baitake_b.mp3   -14                                     # b: the ring and the leaves (a is a floor at -52)
fx   x3baiset    $R/x3baiset_b.mp3    -14                                     # b: the touch with less silence round it
fx   x3wick      $R/x3wick_b.mp3      -14 "afade=t=out:st=0.85:d=0.15"         # (13 Nov; flow WRJ4HzibEIDJwdJVaUy4, node qDC5iJNFvJd2nbq9A0iw, generations ZwVgic3gyvtJNezVcW1i and 2embmwOQqKSeIMBE42Qr) b: the sputter itself, a second long (a is a tick: half a second, its body at -35); b came peaking over full scale and is held at -2 by the levelling. The woman with the taper: the plan's 8.3 listed "a candle lit from a taper" and the build had not made it
fx   x3petals    sound/made/x3petals.wav -14                                  # MADE (synth.py): both generated takes were 91 % silence
fx   x3matroll   $R/x3matroll_b.mp3   -14                                     # b: the rolling from its first frame (a waits 0.3 s), 6 dB fuller
fx   x3matset    $R/x3matset_b.mp3    -14                                     # b: one soft thud under full scale (a clips)
fx   x3shutter   $R/x3shutter_b.mp3   -14                                     # b: the click (a came back silent: its peak is -55)
fx   x3bulbs     $R/x3bulbs_a.mp3     -14                                     # a: the switch at 0.3 s and the hum after it (b's first sound is at 1.0 s)
fx   x3cock      $R/x3cock_a.mp3      -14 "highpass=f=300,lowpass=f=5000,aecho=0.8:0.5:120:0.25"   # a (b clips harder); made far: its band narrowed, an open field's slap
fx   x3bell      $R/x3bell_a.mp3      -14                                     # a: the longer ring
fx   x3shut      sound/made/x3shut.wav -14                                    # MADE (synth.py): both generated takes were under 150 Hz
fx   x3tone      $R/x3tone_a.mp3      -14 "afade=t=out:st=4.6:d=1.4"          # a: the bowl and its bell, 65 % where a phone plays (b 1 %)
fx   x3trance    $R/x3trance_a.mp3    -14 "highpass=f=110,equalizer=f=450:t=q:w=1:g=6"   # a: wordless (b: the transcriber writes "Ugh..."); a low groan, so its body between 200 and 900 Hz is lifted for a phone
fx   x3waiting   $R/x3waiting_a.mp3   -14                                     # a: the cough and the sandals, 85 % where a phone plays (b 14 %); no word heard in either
# ---- the telling's six memories (faint under his words: z_tail.js plays them at 0.2)
fx   x3mem1      $R/x3mem1_b.mp3      -14 "highpass=f=120"                    # b: the lift and the burner with more a phone can play (29 % against 21)
fx   x3mem2      $R/x3mem2_a.mp3      -14 "highpass=f=120,equalizer=f=400:t=q:w=1:g=5"   # a: a hum with no word in it (b: the transcriber writes "Wow")
fx   x3mem3      $R/x3mem3_a.mp3      -14                                     # a: the drum and the gong, the lower peak of two alike
fx   x3mem4      $R/x3mem4_a.mp3      -14                                     # a: the cold air and the glass's ticks
fx   x3mem5      $R/x3mem5_b.mp3      -14                                     # b: the three notes, 9 dB fuller
fx   x3mem6      $R/x3mem6_b.mp3      -14 "highpass=f=120,equalizer=f=300:t=q:w=1:g=8"   # b: a dull tone, by its nature low (11 % over 150 Hz): what a phone can play of it is lifted
# ---- the ground's own noises in play
fx   x3os1       $R/x3os1_a.mp3       -14                                     # a child laughing past: a (b clips harder)
fx   x3os2       $R/x3os2_a.mp3       -14                                     # the loudspeaker's squeal and two taps: a, the squeal where a horn speaker squeals
fx   x3os3       $R/x3os3_a.mp3       -14                                     # the flags in a gust: a (b clips)
fx   x3os4       $R/x3os4_a.mp3       -14                                     # bottles in a crate: a
fx   x3os5       $R/x3os5_b.mp3       -14                                     # a hand bell, three times: b
fx   x3os6       $R/x3os6_b.mp3       -14                                     # clapping and a few cheers, no word heard: b
fx   x3os7       $R/x3os7_b.mp3       -14                                     # a dove: b
fx   x3os8       $R/x3os8_a.mp3       -14                                     # a motorbike on the road: a
fx   x3os9       $R/x3os9_b.mp3       -14                                     # a far temple's bell: b, the longer decay
# ---- long single passes a film cues once
long x3afternoon $R/x3afternoon_b.mp3 -28 -10                                 # ending B's afternoon (10 s of it): b, its end meeting its start (-0.1 dB) and no word heard
long x3sweep     $R/x3sweep_b.mp3     -30 -12                                 # ending D, the ground cleared round him: b, 9 dB fuller and 79 % where a phone plays
fi

if [ -z "$ONLY" ] || [ "$ONLY" = beds ]; then
bed  x3festbed   $R/x3festbed_a.mp3   -27 -9                                  # the festival's crowd: a (second by second within 7.9 dB; b swings 15.4 and peaks over full scale); no word heard in 30 s
bed  x3birds     $R/x3birds_b.mp3     -30 -12                                 # the morning: b, the steadier (2.9 dB), its join exact (-41), and 7 % in the voice's band against a's 41
bed  x3crickets  $R/x3crickets_a.mp3  -30 -12                                 # the night: a, 8 dB fuller, its join -44.5
bed  x3shophum   $R/x3shophum_a.mp3   -32 -14 "highpass=f=90:poles=2"         # his shop at night: a, a steady hum (3.4 dB; b swings 14 and peaks over full scale); what a phone cannot play is taken off before the level
bed  x3open      sound/made/x3open.wav -26 -8                                 # MADE (synth.py): the world heard open
bed  x3pull      sound/made/x3pull.wav -26 -8                                 # MADE (synth.py): the pull's drone
fi

# THE MUSIC (CP7.3, CP7.5): flow KjDinAQkQZQNeSNqqDp2, eleven_music_v2_5, instrumental, three takes of each of thirteen
# cues (sound/music.py -> sound/music.json: one palette, each cue its film's own length plus a little, every prompt
# asking for nothing deep; sound/sessions-music.json; 39 takes, none failed, 23,940 credits). Every take measured twice:
# what it IS (../v24.34/music/meas.py -> sound/meas-music.txt: its bands, what a phone loses, the share in 1-4 kHz a
# bed must leave the voice, its arc) and how it LIES IN ITS FILM (sound/mfit.py -> sound/mfit.txt: second by second
# over the stretch it plays, against who is speaking; a second 14 dB under its own median with nobody speaking is a
# hole). The pick by measure is the take with no hole, that a phone plays, that leaves the voice its band and whose
# arc is its film's; a take's silent head is cut (a cue must sound when it is cued) and a take that begins on signal
# is faded in. THE PICK STANDS UNTIL CHAD'S EAR (v10.6): one reel a cue, every take loudness-matched, in
# sound/previews/ (sound/previews/make.sh; the reel's numbers are the takes in letter order).
# Music at peak -3 (v22.4), Opus 128k. TWO PIECES ARE IN THE WORLD, over the ground's loudspeakers (the festival's own
# music, looped, and the dance's): PA is the horns' band and their slap across an open ground, laid before the level.
PA="highpass=f=180:poles=2,lowpass=f=5500:poles=2,aecho=0.8:0.5:110|230:0.18|0.08"
cuthead() { echo "atrim=start=$1,asetpts=PTS-STARTPTS,afade=t=in:d=0.04"; }
mus() { # name src [ffmpeg filter]: a film's cue
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }
mbed() { # name src seconds start filter: A MUSIC LOOP. The model writes a whole piece and has no loop flag (v9.2), so the
         # loop is cut from its body, its end set where what follows sounds most like its head (the onset envelopes'
         # correlation, searched 2 s either side), a 2 s crossfade (../v21.2/musicloop.py); then padded for the
         # engine's insets (../v24.34/music/padloop.py)
  n=$1; s=$2; L=$3; st=$4; af=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 -ac 2 f_$n.wav
  python3 ../v21.2/musicloop.py f_$n.wav $L $st
  python3 ../v24.34/music/padloop.py w_f_$n.wav p_$n.wav
  enc $n p_$n.wav -3.0 -3.0 128k 2; rm -f f_$n.wav w_f_$n.wav p_$n.wav; }
if [ -z "$ONLY" ] || [ "$ONLY" = music ]; then
mus  x3openmus   $R/x3openmus_b.mp3   "afade=t=in:d=1.2"                      # the opening film (54.7 s): b, within 5 dB second by second for all of it (a and c are single notes with spaces: they fall 12 to 17 dB, some where nobody speaks), 1.3 dB lost on a phone; it begins on signal, so it is faded in
mus  x3dancemus  $R/x3dancemus_a.mp3  "$(cuthead 1.2),$PA"                    # the dance for the Thevadas (to the cut at 14 s), in the world: a, the ranat's own band (96 % between 500 Hz and 1 kHz, 1 % in the consonants' 1-4 kHz where c has 51 %; b is 73 % under 500 Hz, which a horn does not carry); its 1.3 s silent head cut
mbed x3festmus   $R/x3festmus_a.mp3 48 5 "$PA"                                # the festival's own music, in play and under day one's films, in the world: a, level within 1 dB for 62 s and the most of the three a phone plays (3.3 dB lost; b is 48 % under 120 Hz, c 5.8 dB lost). The loop is 5.0 to 52.9 s: of twenty windows tried (36 to 52 s long, from 3, 5, 7 and 9 s) the one whose end best meets its head (+0.53; the flattest window, from 7 s, met at +0.38)
mus  x3sightmus  $R/x3sightmus_a.mp3  "$(cuthead 0.95)"                       # the man in white (12.5 s): a, nothing under 120 Hz, its stroke and a second swell at 8 s, sounding to the film's end (c is 98 % under 120 Hz: a phone plays none of it; b is gone 1.6 s sooner)
mus  x3nightmus  $R/x3nightmus_a.mp3  "afade=t=in:d=1.5"                      # the night between (20.4 s, no word for 17.9): a, within 2 dB for 17 s and thinning under Ton's line (b is silent for 3.3 s and over 2.8 s early; c falls 14 dB in its fourth second); faded in: the day's noise falls away under it
mus  x3tellmus   $R/x3tellmus_b.mp3   "afade=t=in:d=0.8"                      # the telling (55.5 s, under eight of his lines): b, the steadier of the two quiet ones and 0.1 % in 1-4 kHz (a swings 18 dB every four seconds; c grows 18 dB, clips, and is a third sub-bass)
mus  x3answmus   $R/x3answmus_a.mp3   "$(cuthead 1.55)"                       # the answers (93 s, under twelve lines): a, opening slowly (6 dB over a minute) with no second more than 5 dB under, thinning under his last line (b falls 9 to 11 dB again and again; c is flat throughout)
mus  x3endA      $R/x3endA_a.mp3      "afade=t=in:d=0.6"                      # A, accept your path (43 s): a, steady, nothing of it over 500 Hz (b falls 24 to 26 dB between notes; c is bare for a second with nobody speaking, and loses 7.5 dB on a phone)
mus  x3endB      $R/x3endB_c.mp3      "$(cuthead 0.7)"                        # B, challenge the path (to the long silence, 19 s): c, sounding to the silence and 4.2 dB lost on a phone (a is over 4 s before it; b loses 8.8 dB)
mus  x3endC      $R/x3endC_b.mp3      "$(cuthead 0.95)"                       # C, ask why (36 s): b, the flute, rising from nothing as his head is turned and steady after (a has no flute to speak of; c is a quarter sub-bass)
mus  x3endD      $R/x3endD_c.mp3      "$(cuthead 0.8)"                        # D, ask to make it stop (27.5 s): c, rising gently, level, thinning where the close comes (a leaps 13 dB at its middle; b holds full to its end)
mus  x3closemus  $R/x3closemus_b.mp3  "$(cuthead 0.7)"                        # the close, to its one breath (29.5 s): b, level under Grandmaster Pho's two lines (4 % over 500 Hz) and thinning as the breath comes (a is single notes, 12 dB apart; c is 40 % under 120 Hz)
mus  x3lastmus   $R/x3lastmus_c.mp3   "$(cuthead 1.1)"                        # the close, after the breath, to "Tomorrow we begin." (28 s): c, building 3 dB to its last third and sounding to the film's end, 2.3 % in 1-4 kHz (a is silent for 3.3 s and over 3 s early; b falls 10 to 16 dB under his line)
fi
