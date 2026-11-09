#!/bin/bash
# v25.0 · episode 4 chapter 2, Not Every Master Should Be Trusted — its voices, effects, beds and music, from the masters.
# The plan and the log: docs/V25.0-E4C2-PLAN.md (§14 the log, checkpoint by checkpoint).
#
# CP1 · LERSI CHIN'S VOICE (audition/). His key lines read as one prompt by three of the workspace's Thai-accented
# English voices, eleven_v3 (ElevenLabs flow OiLOlcL2MRYZSHycAG8k):
#   "[calm] Sit, sit. You look like you haven't slept. According to my practice, I believe something negative was placed
#    on you. I clear. I don't send. If I send, I carry it. If you ask me to send, you carry it also. One more thing.
#    Don't go looking for him. Don't tell people stories about him. Don't wish anything back on him. Leave it there."
#   a · Pikiir (wwlSjZ6z5ZVMXPlwGV6Q)        18.29 s, 3.50 words a second, all 64 words heard
#   b · Framel (roe71slHhRlwDI6IPvB6)         22.20 s, 2.88 words a second, all 64 words heard
#   c · Mart-Podcast (2rg92Q2u0RWu8LiUcLQA)   27.30 s, 2.34 words a second, all 64 words heard
# THE PICK, by measure until Chad's ear: c, Mart-Podcast — calm and unhurried, at the game's median pace (about 2.3
# words a second, v5.30); a reads a teacher's warning at a rush, b sits between. The previews Chad hears are each take
# levelled the cast's way (v11.1's level.py: RMS -16 dBFS under the -1.5 dBFS limiter), so loudness never decides:
#   audition/lc-a-pikiir-preview.mp3  audition/lc-b-framel-preview.mp3  audition/lc-c-mart-preview.mp3
# (made by: for f in lc-a-pikiir lc-b-framel lc-c-mart; do python3 ../../v11.1/level.py audition/$f.mp3 x.wav -16;
#  ffmpeg -i x.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 audition/$f-preview.mp3; done)
set -e
cd "$(dirname "$0")"
#
# CP10 · THE VOICES — flow GN27ORLbMBtrQtkmAl5C, eleven_v3, two takes a line (voices/sessions.json), 91 lines in five
# voices: him, Brian (bP8FJDHmWVEgXJDitdQd), as in chapter 1; Pong, Zie (bcdIY58WBBzAMmef52NW), as in chapter 1;
# Lersi Chin, Mart-Podcast (2rg92Q2u0RWu8LiUcLQA), CP1's pick; the woman at his counter, Jacqueline (keq9BWrGRYbiHfZFjX0i:
# "a distinctive Singaporean accent", for "Boss, this one... from which temple ah?"); the man at his counter, Gavin
# (y6hZ25Fcq4pmYsc7UsbQ: natural, warm, conversational). Neither customer is seen; each is cast from the library's
# description (four lines between them, no audition).
# THE PICK (voices/pick.py → voices/picks.json): every take transcribed here (faster-whisper small.en, nothing
# uploaded), scored against the script, and ranked by the house rule (v18.6): a CLEAN END first (an end ON signal — its
# last 60 ms louder than -45 dBFS — is clean only if the last word ended 0.12 s or more before it, so the 0.12 s fade
# below can never eat a word), then NO ODD HOLE (a gap over 1.4 s; 2.2 s in a chant), then the TIGHTER READ (the voice's
# span by energy); no tag spoken. The reason for each pick is on its line. q2A3 was read by hand (its line says why).
# THE CHAIN: him — mono, high-passed at 70 Hz, peak-matched to -6.85 (mp3) / -6.6 (ogg) for his own bus (v16.0); the
# cast — levelled by RMS for the flat cast bus (v11.1's level.py): spoken at -16 dBFS, soft deliveries 1-2 dB under,
# the chant -17 (said, not murmured: it is the clearing's own sound, captioned); Pong ON THE PHONE (the call, ending A)
# band-limited as a phone is (two 2-pole high-passes at 300 Hz, two low-passes at 3.4 kHz, a phone's gentle 3:1 level)
# BEFORE the RMS, so he is as loud as a voice in the room; the woman's first question SMEARED AND SLOWED from "from
# which temple" on (§4.0 O2: the fog in his ears — the words exactly, slowed to 0.84 with two short echoes and the top
# taken off, crossfaded over 0.08 s from her clean "Boss, this one..."). Every take's last 0.12 s faded (eleven_v3 ends
# a take ON its last sample, v5.30); a long silent tail cut at the words' end + 0.3 s (--keep), a long lead cut 0.15 s
# before the voice (--head).
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, two passes (the encoders move it)
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
castw() { # name wav level — the cast's level and its two encodes
  n=$1; w=$2; lv=$3
  python3 ../v11.1/level.py $w wc_$n.wav $lv
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  rm -f wc_$n.wav wc_$n.wav.f32; }
cast() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  castw $n p_$n.wav $lv; echo "$n <- $s  (cast, RMS $lv)"; rm -f p_$n.wav; }
phone() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=300:poles=2,highpass=f=300:poles=2,lowpass=f=3400:poles=2,lowpass=f=3400:poles=2,acompressor=threshold=0.125:ratio=3:attack=5:release=80" -ar 48000 -ac 1 f_$n.wav
  castw $n f_$n.wav $lv; echo "$n <- $s  (on the phone, RMS $lv)"; rm -f p_$n.wav f_$n.wav; }
smear() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -filter_complex "[0:a]atrim=0:1.26,asetpts=PTS-STARTPTS[a];[0:a]atrim=1.18,asetpts=PTS-STARTPTS,atempo=0.84,aecho=0.8:0.55:70|140:0.35|0.22,lowpass=f=2600[b];[a][b]acrossfade=d=0.08:c1=tri:c2=tri" -ar 48000 -ac 1 f_$n.wav
  castw $n f_$n.wav $lv; echo "$n <- $s  (smeared and slowed, RMS $lv)"; rm -f p_$n.wav f_$n.wav; }
F="--fade 0.12"
ONLY="${1:-}"      # make.sh voices | sfx | beds | music — one section (default: all)
if [ -z "$ONLY" ] || [ "$ONLY" = voices ]; then
him  q2o1      voices/raw/q2o1_b.mp3        --keep 4.74 $F                 # only clean/valid take; voice 0.18-4.44 s (the other 3.54 s, ends ON a word); its silent tail cut at the words' end + 0.3 s
smear cu2a1    voices/raw/cu2a1_a.mp3       -16 --keep 4.1 $F              # the tighter read; voice 0.00-3.80 s (the other 4.60 s); its silent tail cut at the words' end + 0.3 s; her words smear and slow from "from which temple" (1.2 s) on
him  q2o2b     voices/raw/q2o2b_b.mp3       --keep 1.96 $F                 # the tighter read; voice 0.02-1.66 s (the other 1.74 s); its silent tail cut at the words' end + 0.3 s
cast cu2a1b    voices/raw/cu2a1b_a.mp3      -16 $F                         # the tighter read; voice 0.04-2.70 s (the other 2.68 s)
him  q2o2      voices/raw/q2o2_a.mp3        $F                             # the tighter read; voice 0.16-1.66 s (the other 1.96 s)
him  q2o3      voices/raw/q2o3_a.mp3        $F                             # only clean/valid take; voice 0.02-5.34 s (the other 5.06 s, ends ON a word)
him  q2o4      voices/raw/q2o4_a.mp3        $F                             # the tighter read; voice 0.02-2.30 s (the other 2.46 s)
him  q2till    voices/raw/q2till_a.mp3      $F                             # the tighter read; voice 0.02-1.50 s (the other 1.82 s)
him  q2bag     voices/raw/q2bag_a.mp3       $F                             # the tighter read; voice 0.12-1.08 s (the other 0.96 s)
him  q2jacket  voices/raw/q2jacket_b.mp3    $F                             # the tighter read; voice 0.04-1.50 s (the other 1.50 s)
him  q2where   voices/raw/q2where_a.mp3     --keep 1.5 $F                  # the tighter read; voice 0.00-1.20 s (the other 1.42 s); its silent tail cut at the words' end + 0.3 s
him  q2fridge  voices/raw/q2fridge_a.mp3    --keep 1.64 $F                 # the tighter read; voice 0.06-1.34 s (the other 1.58 s); its silent tail cut at the words' end + 0.3 s
him  q2flowers voices/raw/q2flowers_a.mp3   $F                             # no odd hole; voice 0.08-3.02 s (the other 3.50 s)
him  q2note    voices/raw/q2note_b.mp3      $F                             # the tighter read; voice 0.02-1.02 s (the other 1.02 s)
phone pg2c1    voices/raw/pg2c1_a.mp3       -16 $F                         # on the phone: the tighter read; voice 0.10-2.62 s (the other 2.94 s)
him  q2c1      voices/raw/q2c1_b.mp3        $F                             # no odd hole; voice 0.00-8.54 s (the other 8.80 s)
phone pg2c2    voices/raw/pg2c2_b.mp3       -16 $F                         # on the phone: the tighter read; voice 0.10-13.82 s (the other 14.38 s)
him  q2c2      voices/raw/q2c2_a.mp3        $F                             # the tighter read; voice 0.06-2.38 s (the other 2.52 s)
phone pg2c3    voices/raw/pg2c3_a.mp3       -16 $F                         # on the phone: the tighter read; voice 0.12-5.10 s (the other 5.40 s)
him  q2c3      voices/raw/q2c3_a.mp3        $F                             # the tighter read; voice 0.08-0.92 s (the other 0.88 s)
him  q2v1      voices/raw/q2v1_b.mp3        $F                             # the tighter read; voice 0.02-6.54 s (the other 6.86 s)
cast pg2v1     voices/raw/pg2v1_b.mp3       -16 $F                         # the tighter read; voice 0.08-2.48 s (the other 2.78 s)
cast lc2v1     voices/raw/lc2v1_b.mp3       -16 $F                         # the tighter read; voice 0.00-3.26 s (the other 3.68 s)
cast lc2sit    voices/raw/lc2sit_a.mp3      -16 $F                         # the tighter read; voice 0.08-2.68 s (the other 2.76 s)
cast lc2tell   voices/raw/lc2tell_a.mp3     -16 --keep 1.82 $F             # the tighter read; voice 0.10-1.46 s (the other 1.44 s); its silent tail cut at the words' end + 0.3 s
him  q2tA      voices/raw/q2tA_a.mp3        $F                             # the tighter read; voice 0.06-10.70 s (the other 11.04 s)
him  q2tB      voices/raw/q2tB_b.mp3        $F                             # the tighter read; voice 0.02-4.94 s (the other 5.18 s)
him  q2tC      voices/raw/q2tC_a.mp3        $F                             # only clean/valid take; voice 0.08-3.26 s (the other 3.02 s, ends ON a word)
him  q2tD      voices/raw/q2tD_b.mp3        $F                             # the tighter read; voice 0.06-0.94 s (the other 1.90 s)
cast lc2tA     voices/raw/lc2tA_a.mp3       -16 $F                         # the tighter read; voice 0.04-5.12 s (the other 5.64 s)
cast lc2tB     voices/raw/lc2tB_a.mp3       -16 --keep 6.7 $F              # the tighter read; voice 0.00-6.40 s (the other 6.70 s); its silent tail cut at the words' end + 0.3 s
cast lc2tC     voices/raw/lc2tC_b.mp3       -16 --keep 5.6 $F              # the tighter read; voice 0.12-5.30 s (the other 5.62 s); its silent tail cut at the words' end + 0.3 s
cast lc2tD     voices/raw/lc2tD_a.mp3       -16 $F                         # the tighter read; voice 0.10-2.70 s (the other 2.86 s)
cast lc2e1     voices/raw/lc2e1_a.mp3       -16 --keep 1.4 $F              # the tighter read; voice 0.08-1.10 s (the other 1.02 s); its silent tail cut at the words' end + 0.3 s
cast lc2e2     voices/raw/lc2e2_a.mp3       -16 --keep 0.92 $F             # the tighter read; voice 0.12-0.62 s (the other 0.54 s); its silent tail cut at the words' end + 0.3 s
him  q2e1      voices/raw/q2e1_b.mp3        $F                             # the tighter read; voice 0.06-0.70 s (the other 0.72 s)
cast lc2e3     voices/raw/lc2e3_a.mp3       -16 --keep 0.74 $F             # the tighter read; voice 0.06-0.44 s (the other 0.48 s); its silent tail cut at the words' end + 0.3 s
him  q2e2      voices/raw/q2e2_b.mp3        $F                             # the tighter read; voice 0.04-0.62 s (the other 0.86 s)
cast lc2e4     voices/raw/lc2e4_b.mp3       -16 $F                         # the tighter read; voice 0.02-1.90 s (the other 2.10 s)
him  q2e3      voices/raw/q2e3_a.mp3        $F                             # the tighter read; voice 0.14-0.86 s (the other 0.84 s)
cast lc2e5     voices/raw/lc2e5_a.mp3       -16 --keep 1.32 $F             # the tighter read; voice 0.06-1.02 s (the other 1.04 s); its silent tail cut at the words' end + 0.3 s
him  q2e4      voices/raw/q2e4_a.mp3        $F                             # the tighter read; voice 0.10-1.90 s (the other 2.06 s)
cast lc2e6     voices/raw/lc2e6_a.mp3       -16 $F                         # the tighter read; voice 0.04-4.60 s (the other 4.98 s)
cast lc2e7     voices/raw/lc2e7_a.mp3       -16 --keep 1.92 $F             # the tighter read; voice 0.08-1.62 s (the other 1.84 s); its silent tail cut at the words' end + 0.3 s
him  q2e5      voices/raw/q2e5_b.mp3        $F                             # the tighter read; voice 0.08-2.70 s (the other 2.90 s)
cast lc2e8     voices/raw/lc2e8_a.mp3       -16 $F                         # only clean/valid take; voice 0.08-5.26 s (the other 5.08 s, ends ON a word)
cast lc2e9     voices/raw/lc2e9_a.mp3       -16 --keep 4.9 $F              # the tighter read; voice 0.02-4.60 s (the other 5.04 s); its silent tail cut at the words' end + 0.3 s
him  q2e6      voices/raw/q2e6_a.mp3        --head 1.45 $F                 # the tighter read; voice 1.60-2.28 s (the other 1.08 s)
cast lc2e10    voices/raw/lc2e10_a.mp3      -16 $F                         # the tighter read; voice 0.04-2.58 s (the other 2.66 s)
cast lc2k0     voices/raw/lc2k0_a.mp3       -17 $F                         # the tighter read; voice 0.04-3.18 s (the other 3.16 s)
cast lc2namo   voices/raw/lc2namo_a.mp3     -17 $F                         # the chant (its words are Pali: not scored); the tighter read; voice 0.02-17.10 s (the other 17.52 s)
cast lc2sak1   voices/raw/lc2sak1_a.mp3     -17 $F                         # the chant (its words are Pali: not scored); the tighter read; voice 0.04-14.62 s (the other 14.92 s)
cast lc2sak2   voices/raw/lc2sak2_a.mp3     -17 $F                         # the chant (its words are Pali: not scored); the tighter read; voice 0.00-15.82 s (the other 15.98 s)
cast lc2sak3   voices/raw/lc2sak3_b.mp3     -17 $F                         # the chant (its words are Pali: not scored); the tighter read; voice 0.00-14.54 s (the other 15.06 s)
cast lc2drink  voices/raw/lc2drink_a.mp3    -17 $F                         # the tighter read; voice 0.06-1.48 s (the other 1.50 s)
cast lc2wrist  voices/raw/lc2wrist_b.mp3    -17 --keep 1.12 $F             # the tighter read; voice 0.10-0.82 s (the other 0.74 s); its silent tail cut at the words' end + 0.3 s
cast lc2k2     voices/raw/lc2k2_b.mp3       -16 --keep 6.82 $F             # the tighter read; voice 0.04-6.52 s (the other 7.74 s); its silent tail cut at the words' end + 0.3 s
cast lc2w1     voices/raw/lc2w1_a.mp3       -16 $F                         # only clean/valid take; voice 0.04-9.90 s (the other 9.42 s, ends ON a word)
cast pg2w1     voices/raw/pg2w1_a.mp3       -16 $F                         # the tighter read; voice 0.08-1.42 s (the other 1.44 s)
him  q2A1      voices/raw/q2A1_b.mp3        $F                             # the tighter read; voice 0.02-1.68 s (the other 2.10 s)
phone pg2A1    voices/raw/pg2A1_a.mp3       -16 $F                         # on the phone: the tighter read; voice 0.08-5.08 s (the other 5.22 s)
him  q2A2      voices/raw/q2A2_b.mp3        --keep 1.5 $F                  # the tighter read; voice 0.12-1.20 s (the other 1.20 s); its silent tail cut at the words' end + 0.3 s
phone pg2A2    voices/raw/pg2A2_b.mp3       -16 $F                         # on the phone: the tighter read; voice 0.22-1.78 s (the other 1.82 s)
cast cu2b1     voices/raw/cu2b1_b.mp3       -16 $F                         # the tighter read; voice 0.10-2.54 s (the other 2.60 s)
him  q2A3      voices/raw/q2A3_a.mp3        $F                             # read by hand: transcribed again without the script as its prompt (the prompt had merged the two like sentences), both takes say every word; a the even read (b holds a pause inside "say it ... about him"), a clean end 0.12 s after "him"; voice 0.16-5.58 s (the other 5.84 s)
him  q2B1      voices/raw/q2B1_b.mp3        $F                             # the tighter read; voice 0.06-6.46 s (the other 6.74 s)
cast lc2B1     voices/raw/lc2B1_b.mp3       -16 $F                         # the tighter read; voice 0.12-7.50 s (the other 8.16 s)
cast lc2B2     voices/raw/lc2B2_a.mp3       -16 --keep 9.94 $F             # the tighter read; voice 0.10-9.64 s (the other 10.90 s); its silent tail cut at the words' end + 0.3 s
cast pg2B1     voices/raw/pg2B1_a.mp3       -16 $F                         # the tighter read; voice 0.12-1.56 s (the other 1.46 s)
him  q2B2      voices/raw/q2B2_a.mp3        $F                             # the tighter read; voice 0.10-6.46 s (the other 7.18 s)
him  q2C1      voices/raw/q2C1_b.mp3        $F                             # no odd hole; voice 0.00-5.58 s (the other 6.24 s)
cast lc2C1     voices/raw/lc2C1_b.mp3       -16 $F                         # the tighter read; voice 0.10-1.82 s (the other 2.12 s)
cast lc2C2     voices/raw/lc2C2_a.mp3       -16 $F                         # the tighter read; voice 0.06-5.42 s (the other 5.56 s)
cast pg2C1     voices/raw/pg2C1_b.mp3       -18 --keep 1.48 $F             # the tighter read; voice 0.00-0.52 s (the other 1.28 s); its silent tail cut at the words' end + 0.3 s
him  q2C2      voices/raw/q2C2_a.mp3        --keep 1.64 $F                 # the tighter read; voice 0.00-1.34 s (the other 1.60 s); its silent tail cut at the words' end + 0.3 s
cast lc2C3     voices/raw/lc2C3_b.mp3       -16 --keep 5.66 $F             # the tighter read; voice 0.06-5.36 s (the other 6.10 s); its silent tail cut at the words' end + 0.3 s
him  q2C3      voices/raw/q2C3_a.mp3        $F                             # the tighter read; voice 0.00-8.46 s (the other 8.70 s)
him  q2D1      voices/raw/q2D1_a.mp3        --keep 1.78 $F                 # the tighter read; voice 0.02-1.48 s (the other 1.50 s); its silent tail cut at the words' end + 0.3 s
cast lc2D1     voices/raw/lc2D1_b.mp3       -16 $F                         # the tighter read; voice 0.00-2.62 s (the other 2.76 s)
cast pg2D1     voices/raw/pg2D1_a.mp3       -16 --keep 1.68 $F             # the tighter read; voice 0.12-1.38 s (the other 1.26 s); its silent tail cut at the words' end + 0.3 s
cast cu2a2     voices/raw/cu2a2_b.mp3       -16 --keep 2.8 $F              # the tighter read; voice 0.00-2.50 s (the other 2.86 s); its silent tail cut at the words' end + 0.3 s
him  q2D2      voices/raw/q2D2_b.mp3        $F                             # the tighter read; voice 0.04-5.58 s (the other 5.98 s)
him  q2D3      voices/raw/q2D3_a.mp3        $F                             # the tighter read; voice 0.12-4.38 s (the other 4.76 s)
him  q2K1      voices/raw/q2K1_a.mp3        $F                             # the tighter read; voice 0.04-9.98 s (the other 10.28 s)
him  q2K2      voices/raw/q2K2_a.mp3        $F                             # the tighter read; voice 0.10-9.90 s (the other 9.88 s)
him  q2K3      voices/raw/q2K3_b.mp3        $F                             # no odd hole; voice 0.10-10.70 s (the other 12.12 s)
him  q2K4      voices/raw/q2K4_a.mp3        $F                             # the tighter read; voice 0.04-7.10 s (the other 7.32 s)
him  q2A       voices/raw/q2A_a.mp3         $F                             # the tighter read; voice 0.08-3.74 s (the other 3.70 s)
him  q2B       voices/raw/q2B_b.mp3         $F                             # the tighter read; voice 0.10-3.50 s (the other 3.66 s)
him  q2C       voices/raw/q2C_a.mp3         $F                             # the tighter read; voice 0.00-3.58 s (the other 3.76 s)
him  q2D       voices/raw/q2D_b.mp3         $F                             # only clean/valid take; voice 0.06-3.26 s (the other 3.06 s, ends ON a word)
fi

# ======================================================================================================================
# CP11 · THE EFFECTS — flow SFnWUI9IMdhGxt73er5Q, eleven_text_to_sound_v2, two takes each (sfx/script.json,
# sfx/sessions.json), measured with ../v22.0/cp5/meas.py (sfx/meas.txt) and drawn with sfx/envelope.py (the loudness in
# 50 ms frames, the events, the dB a phone loses: two 250 Hz high-passes in the time domain — meas.py's band shares come
# from one Hann-windowed FFT over the whole take, which all but silences its first and last tenths, so a short sound
# whose energy is at its start reads as its quiet tail there). Three were made again (sfx/script.json `remakes`): the
# corridor, whose first takes held no footstep at all, and the two customers' approaches (a man's shoes for ending A,
# which had cued a woman's heels; the woman's own heels for ending D, the opening's going-away turned round — her new
# take came back as a murmur with three faint clicks, so it is not used). Each pick's reason is on its line.
# Peak-matched (two passes, v9.6) in each take's own channel layout.
fx() { # name src peak [ffmpeg filter]
  n=$1; s=$2; pk=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
if [ -z "$ONLY" ] || [ "$ONLY" = sfx ]; then
fx  x2drawer    sfx/raw/x2drawer_b.mp3    -8  "afade=t=in:d=0.004"           # the slide open and the shut at 0.5 s (a: one hit, then a rattle), 54 % over 3 kHz, the coins
fx  x2bagzip    sfx/raw/x2bagzip_a.mp3    -10 "afade=t=in:d=0.004"           # two zips (0.15 s, 1.15 s) with the rummage between, a clean tail (-51.8); b one smear
fx  x2cloth     sfx/raw/x2cloth_b.mp3     -12                                # the jacket's rustle, 2.4 dB more than a and 0.5 dB lost on a phone (a 2.0)
fx  x2fridge    sfx/raw/x2fridge_a.mp3    -8                                 # the seal at once (0.05 s) and the cold air's hum after it; b's seal waits 1.0 s
fx  x2wallet    sfx/raw/x2wallet_b.mp3    -8                                 # one leather slap, 6.1 dB lost on a phone (a 8.5)
fx  x2switch    sfx/raw/x2switch_a.mp3    -8  "atrim=0.34,asetpts=PTS-STARTPTS"  # one crisp click (89 % over 3 kHz), its 0.34 s lead cut so it lands on the press; a clean tail (-83.7, b -59)
fx  x2rustle    sfx/raw/x2rustle_b.mp3    -10                                # the dried flowers and ribbons held for 2.3 s, papery (50 % over 3 kHz); a dies by 1.05 s
fx  x2breath    sfx/raw/x2breath_b.mp3    -8                                 # the sharp intake (0.2-0.9 s), then held; a is a 2 s sigh
fx  x2ledhum    sfx/raw/x2ledhum_a.mp3    -14 "afade=t=out:st=2.5:d=0.5"     # the lights coming on (the rise to 0.3 s) and the hum settling lower at 1.8 s, as asked; faded (it runs on)
fx  x2shutter   sfx/raw/x2shutter_a.mp3   -6  "atrim=0.2,asetpts=PTS-STARTPTS"   # the slats rolling down and ONE clank at 1.63 s (a +12 dB hit); b two; its lead cut
fx  x2kneel     sfx/raw/x2kneel_b.mp3     -8                                 # the rustle and the knee on the mat at 0.65 s, 3.9 dB lost on a phone (a 4.5), the cleaner tail
fx  x2bow       sfx/raw/x2bow_b.mp3       -12                                # forward and back up: two rustles with a dip between (a is one)
fx  x2pat       sfx/raw/x2pat_b.mp3       -10 "atrim=0.05:0.62,asetpts=PTS-STARTPTS,afade=t=out:st=0.5:d=0.07"  # ONE pocket patted twice (b's first two pats): the opening pats three pockets 1.1 s apart
fx  x2heels     sfx/raw/x2heels_b.mp3     -10 "volume='pow(10,(-16*min(max(t-0.5,0)/2.2\,1))/20)':eval=frame,afade=t=out:st=2.6:d=0.3"  # four unhurried steps 0.62 s apart (a trots, 0.3 s), going away: 16 dB down over 2.2 s
fx  x2heelsin   sfx/raw/x2heels_b.mp3     -10 "atrim=0:2.6,asetpts=PTS-STARTPTS,volume='pow(10,(-16+16*min(t/2.3\,1))/20)':eval=frame,afade=t=out:st=2.4:d=0.2"  # the same woman's same heels COMING BACK (ending D): 16 dB up over the four steps, stopping at his counter
fx  x2stepsin   sfx/raw/x2stepsin_b.mp3   -10 "volume='pow(10,(-12+12*min(t/1.9\,1))/20)':eval=frame,afade=t=out:st=2.0:d=0.2"  # NEW: a man's four steps 0.58 s apart (a doubles each), rising 12 dB to his counter
fx  x2pickup    sfx/raw/x2pickup_a.mp3    -10                                # the tap and the lift (0.05, 0.45 s), 0.5 dB lost on a phone (b 1.3, four ticks)
python3 -I sfx/ring.py sfx/raw/x2ring_b.mp3 w_ring.wav >/dev/null
fx  x2ring      w_ring.wav                -14                                # MADE A SINGAPORE RING (sfx/ring.py): b's 424 Hz tone (a 412) gated 0.4 on, 0.2 off, 0.4 on
rm -f w_ring.wav
fx  x2knock     sfx/raw/x2knock_b.mp3     -6                                 # TWO knocks (0.2, 0.6 s) and the slats' rattle, as asked; a knocks five times
fx  x2shutterup sfx/raw/x2shutterup_b.mp3 -6  "atrim=0.5,asetpts=PTS-STARTPTS"   # the roll building to the CLUNK at the top (1.3 s); a's loudest moment is its jerk at the start; its lead cut
fx  x2steps     sfx/raw/x2steps_b.mp3     -8  "afade=t=out:st=2.6:d=0.4"     # five steps 0.5 s apart, two men's cadence (a four, 0.7 s); faded (b ends on a step)
fx  x2mat       sfx/raw/x2mat_a.mp3       -8                                 # the mat unrolling in three turns, 2.1 dB lost on a phone (b 2.9, a slide and a flap)
fx  x2rise      sfx/raw/x2rise_b.mp3      -8                                 # the rustle up and the foot set down at 1.05 s, 9.7 dB fuller than a
fx  x2pickpiece sfx/raw/x2pickpiece_a.mp3 -10 "atrim=0.15,asetpts=PTS-STARTPTS"  # the clink at once from a clean head (-68 dB; b -50); its lead cut
fx  x2breathslow sfx/raw/x2breathslow_a.mp3 -10                              # in (0.95 s), the pause, out (1.3 s): an even, calm rhythm
fx  x2candle    sfx/raw/x2candle_b.mp3    -8                                 # the flick, the catch and the flame shaken out, with the flame's body (40 % in 120-500 Hz; a is all hiss, 94 % over 3 kHz)
fx  x2sip       sfx/raw/x2sip_a.mp3       -10                                # the sip at 0.5 s and the swallow, 2.0 dB lost on a phone (b 5.2)
fx  x2sprinkle  sfx/raw/x2sprinkle_a.mp3  -10                                # the droplets scattering (58 % over 3 kHz), 0.3 dB lost on a phone (b 0.9, a thump)
fx  x2thread    sfx/raw/x2thread_b.mp3    -10                                # three pulls of the string (0.05, 1.05, 1.45 s) a phone plays whole (0.0 dB); a is a rub under 120 Hz (7.7 dB lost)
fx  x2bowl      sfx/raw/x2bowl_a.mp3      -8                                 # set down with the slosh after it (to 0.5 s; b's is over by 0.3)
fx  x2keys      sfx/raw/x2keys_a.mp3      -10                                # the typing to 2.7 s, 4.6 dB lost on a phone (b 6.6)
fx  x2post      sfx/raw/x2post_b.mp3      -10                                # the send's two-part whoosh (to 0.65 s); a is a 0.2 s blip
fx  x2ping      sfx/raw/x2ping_a.mp3      -10                                # a clear 900 Hz ping, 0.35 s (b a duller 525 Hz)
fx  x2buzz      sfx/raw/x2buzz_b.mp3      -8  "atrim=0:0.45,asetpts=PTS-STARTPTS,afade=t=out:st=0.39:d=0.06"  # ONE buzz (b's first, 0-0.4 s): ending A cues two, 0.8 s apart; a buzzes 0.9 s straight
fx  x2case      sfx/raw/x2case_a.mp3      -10                                # the light click (0.05, 0.2 s); b rattles for 0.7 s
fx  x2scroll    sfx/raw/x2scroll_b.mp3    -12 "atrim=0:1.62,asetpts=PTS-STARTPTS,afade=t=out:st=1.5:d=0.12"  # the finger's slide and its swipe at 1.45 s from a clean head (-66); a's peak is -37.5, its floor would come up with it
fx  x2click     sfx/raw/x2click_b.mp3     -10 "atrim=0.12,asetpts=PTS-STARTPTS"  # one crisp click (71 % over 3 kHz; a 19 % sub-bass); its lead cut
fx  x2page      sfx/raw/x2page_b.mp3      -10                                # the turn and its settle, 12.5 dB fuller than a
fx  x2lift      sfx/raw/x2lift_a.mp3      -10                                # far chimes stirring, to 2.35 s (b stops at 1.8)
fx  x2corridor  sfx/raw/x2corridor_r2_a.mp3 -8                               # RE-MADE: two people's steps every 0.5 s, echoing, going away over the last 2 s (r2 b steady to the end)
fi

# THE BEDS — looped by hand (../v22.0/cp9/loopfast.py: the slow drift flattened, the tail crossfaded over the head, so
# the joint is continuous by construction), levelled by RMS (../v21.12/level_rms.py, v21.13's recipe). Under every film
# the room's beds are the film's own (e4c2's filmBedAt): a one-shot of a 22 s take would have stopped inside the 34-98 s
# films. (x2hum, "the air-con's hum, all that is left" in ending C, is the night bed raised there instead: the same
# air-con and fridge — its two takes are kept in sfx/raw, unused.)
bed() { # name src target_rms ceiling [pre-filter]
  n=$1; s=$2; t=$3; c=$4; pf=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$pf,highpass=f=60:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v22.0/cp9/loopfast.py b_hp_$n.wav b_lp_$n.wav 1.5
  python3 ../v21.12/level_rms.py b_lp_$n.wav b_$n.wav $t $c
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (bed, RMS $t)"; rm -f b_hp_$n.wav b_lp_$n.wav b_$n.wav b_*.f32; }
if [ -z "$ONLY" ] || [ "$ONLY" = beds ]; then
bed x2mallfog    sfx/raw/x2mallfog_a.mp3    -30 -12 "lowpass=f=1400:poles=2"   # the mall at noon THROUGH THE FOG: a (a 2.5 dB swing; b 3.7), and the top taken off at 1.4 kHz — the two takes were as bright as the clear one (centroids 1918 / 1958), so the fog is made here, and lifted with the clearing
bed x2mallclear  sfx/raw/x2mallclear_b.mp3  -28 -10                            # the mall heard clear (endings A and D): b, the brighter (1958 Hz) and 1.3 dB lost on a phone (a 1.9)
bed x2nightroom  sfx/raw/x2nightroom_b.mp3  -32 -14 "highpass=f=90:poles=2"    # the shop at night, the air-con and the fridge: b, 8.4 dB lost on a phone (a 10.8); what sits under 90 Hz a phone cannot play is taken off before the level, so the part it can play is the part that is levelled
fi

# THE MUSIC — flow uW6A2wpf69s61vNZEpAZ, eleven_music_v2_5, instrumental, three takes each (music/script.json: every
# duration the film's measured length plus 2-3 s, every prompt "Nothing deep" after v24.34's first takes ran 46-95 %
# under 120 Hz), measured with ../v24.34/music/meas.py (music/meas.txt: the bands, the dB a phone loses, the share in
# 1-4 kHz a bed must leave to the voice, the onset share, the 1 s spread, the arc in 2.5 s steps, the head and tail).
# The pick by measure is the take whose arc fits its film (it starts where the film starts, thins where the film ends)
# and that leaves the voice its band; the loudness-matched previews of all three go to Chad (music/previews/), and his
# ear can swap any. Music at peak -3 (v22.4's f4music), Opus 128k; the two beds play are loops (musicloop + padloop).
mus() { # name src [ffmpeg filter]
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }
mbed() { # name take seconds [start] — a music bed: looped from its flattest window, padded for the engine's insets
  n=$1; t=$2; L=$3; st=${4:-}
  (cd music && python3 ../../v21.2/musicloop.py raw/$t.mp3 $L $st)
  python3 ../v24.34/music/padloop.py music/w_$t.wav p_$n.wav
  enc $n p_$n.wav -3.0 -3.0 128k 2; rm -f p_$n.wav music/w_$t.wav; }
if [ -z "$ONLY" ] || [ "$ONLY" = music ]; then
mus  x2open     music/raw/x2open_a.mp3                                         # the fog (§4.0): a rises from soft (-16) to its body and thins to its end at 35.8 s against the film's 34.6 (b falls silent at 30.2, c starts at full)
mbed x2fogmus   x2fogmus_a 55                                                  # play in the fog: a, the steadiest (its arc within 2 dB for 55 s; b fades in over 20 s, c swings 10 dB)
mus  x2callmus  music/raw/x2callmus_b.mp3 "afade=t=in:d=2.5"                   # under Pong's offer (28 s): b, steady and thinning at its end, 2.9 dB lost on a phone (c is 73 % under 120 Hz); faded in, as the prompt asked ("starting almost silent") and neither take did
mus  x2visit    music/raw/x2visit_a.mp3                                        # the visit (25 s): a, the steadiest, its fade at 26 s on the film's black (c is 10 % in 1-4 kHz, under the greetings)
mbed x2visitmus x2visitmus_c 48 6                                              # the examination and play after the clearing: c, flat within 1 dB from 6 s on (a and b swell and drop)
mus  x2clearmus music/raw/x2clearmus_c.mp3                                     # under the chant (89 s): c, the quietest, and 0.5 % in 1-4 kHz (a 8.3, b 70 % in 500 Hz-3 kHz: on the voice), its bells and swells under the verses, thinning under the advice
mus  x2endA     music/raw/x2endA_b.mp3                                         # A (36 s): b, thinning to nothing at 36 s where the coda comes, 6.6 % in the voice's band (a 35 %)
mus  x2endB     music/raw/x2endB_c.mp3                                         # B (37 s): c, soft in, held, thinning at its end (a is one flat level and stops on signal; b jumps 27 dB inside a second)
mus  x2endC     music/raw/x2endC_b.mp3                                         # C (40 s): b, the held note gathering weight (-15 to +3) and holding, 14.7 % in 1-4 kHz (a 24.6, c 33 % sub-bass)
mus  x2endD     music/raw/x2endD_b.mp3                                         # D's morning (20 s): b, the brightest (centroid 357 Hz against 251), thinning at 20.8 s where the coda comes
mus  x2codamus  music/raw/x2codamus_c.mp3                                      # the coda (45 s) under the case file's last words: c, flat, 3.5 dB lost on a phone (a 5.1, b swings 8 dB), thinning at 45 s
fi

# ---------------------------------------------------------------- models (CP6) · `ONLY=models bash make.sh`, from masters/v25.0
# Lersi Chin's things that are plants or vessels, made Chad's way (30 Oct 2026: a reference picture on white first,
# LOOKED AT, then Meshy's image-to-3D at its best settings and its remesh — masters/v24.19/make.sh); the rest of his things
# (the mat, the thread, the cloth, his bag, the candles and incense) stay in code. Not sacred images, so no photographs of a
# real piece were needed first (the research's own words for each: docs/research/V25.0-LERSI.md §4.3 and [37]).
# 1. THE PICTURES: Higgsfield gpt_image_2_6, quality high, 2k, opaque, 1:1, two of each (2.75 credits each); the prompts in
#    models/refs/PROMPTS.txt; the picks (1024 copies beside the 2k originals, which are not committed):
#      mayom-a   seven slender stems, small oval leaflets in two rows, bound near the cut ends with white cotton thread
#                (b the same, a looser fan); a, the fuller silhouette
#      bowl-a    an embossed silver khan nam mon on a flared foot, lai kranok round the wall, a plain rim (b deeper); a,
#                its inside seen
#      phan-a    a footed brass phan with a scalloped rim, a low mound of marigolds ringed by jasmine (b a taller heap); a
# 2. MESHY (masters/v25.0/meshy.py masters/v25.0/models/jobs.json — every job at once; the key outside the repo): image-to-3d,
#    then its remesh (src/, gitignored; Meshy keeps a job's files three days):
#      mayom   01a1c1d4-ed4c-709b-a59f-0edefd6fce47   01a1c1d7-c499-7593-a151-de96360c9cb1   (remesh 8000: a flat fan, 8 mm thick)
#      bowl    01a1c1d5-00d3-7326-a625-2a03cd139f24   01a1c1d8-1ceb-76e7-980d-c8d10c501647   (remesh 4000)
#      phan    01a1c1d5-152e-772d-82a0-97cced0ebe19   01a1c1da-b52f-70d3-900a-2710ef2ea09d   (remesh 8000 -> 6,901)
# 3. PREPARED (tools/prepmeshy.mjs: sized in metres, every triangle kept, the sheets at 1024 — the bowl is seen from a
#    hand's length in the clearing), each photographed on its own (tools/shootmodel.mjs) before it was wired in
if [ "$ONLY" = models ]; then
  cd ../..
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.0/src/remeshed-bowl.glb  assets/e4khannam.glb 0.22 w 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.0/src/remeshed-mayom.glb assets/e4mayom.glb   0.24 h 1 0 1024
  ERR=0.002 node tools/prepmeshy.mjs masters/v25.0/src/remeshed-phan.glb  assets/e4phan.glb    0.26 w 1 0 1024
fi
