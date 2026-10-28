#!/bin/bash
# v24.0 CP11 · episode 4 chapter 1, The Master I Did Not Know — its voices, effects, beds and music, from the masters.
#
# THE VOICES — flow 42oRvGlkUSRPQpVq1GAB, eleven_v3, two takes a line (voices/sessions.json), 122 lines in eight voices.
# The cast was chosen by audition (CP11a: each new role's key line read by two candidates, measured — voices/measure.py,
# voices/pitch.py): the first master is Patinya (weRAVUYgqjjfUEEu5BsB: the lowest and steadiest of the Thai voices);
# Pong is Zie (bcdIY58WBBzAMmef52NW: the words exactly); Pa Noi is Kanya (B4NdgwdU97lHqA8Udh2D: the older pitch);
# Khun Joy is HammyTH (MYZYcGOqrkYQcwDunXl7: Mali's voice is not fine-tuned and could not be used, Nook measured male);
# Ta Sombat is Songkran (xYmBpJREC3WfqEFpbPvO, "[elderly voice]": the oldest-sounding, the words exactly); Uncle Lim is
# Brandon (hnUfJmvgsLlEm4ozUacp, "[an old uncle]": age over dialect); the taxi uncle is Kopi O (HxkJ72rJ50z9kcGPPnG7,
# "[an old uncle]": Lee speaks in episode 3); he is Brian (bP8FJDHmWVEgXJDitdQd), as in episode 3.
# THE PICK (voices/pick.py → picks.json): every take transcribed locally (voices/tr4.py: faster-whisper small.en for
# English, the multilingual small with language th for a line with Thai in it — whisper's Thai is rough, so it ranks two
# takes of one line and never judges one alone), measured (voices/measure.py), and ranked: the words first, then an end
# not ON signal, then the quieter head; a take much longer or shorter than its sibling flagged and read by hand. The
# reason for each pick is on its line below.
# THE CHAIN: him — mono, high-passed at 70 Hz, peak-matched to -6.85 (mp3) / -6.6 (ogg) for his own bus (v16.0); the
# cast — levelled by RMS for the flat cast bus (v11.1's level.py): spoken at -16 dBFS, soft deliveries 2 dB under, the
# three whispers 5 dB under (v21.30's md3chant: a whisper levelled with speech is as loud as a shout), the chant
# murmured under the storm at -20. Every take's last 0.12 s faded (eleven_v3 ends a take ON its last sample, v5.30).
set -e
cd "$(dirname "$0")"
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
cast() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav $lv
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS $lv)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
F="--fade 0.12"
ONLY="${1:-}"      # make.sh voices | sfx | beds | music — one section (default: all)
if [ -z "$ONLY" ] || [ "$ONLY" = voices ]; then
him  q1pro1     voices/raw/q1pro1_b.mp3                $F                # words 1.00, 7.44 s
him  q1pro2     voices/raw/q1pro2_b.mp3                $F                # words 1.00, 6.00 s
him  q1pro3     voices/raw/q1pro3_a.mp3                $F                # words 1.00, 6.00 s
him  q1pro4     voices/raw/q1pro4_a.mp3                $F                # words 1.00, 4.00 s
cast pg1car     voices/raw/pg1car_zie_b.mp3            -16 $F            # CP11a audition winner; words 1.00, 5.36 s
him  q1pro5     voices/raw/q1pro5_b.mp3                $F                # words 1.00, 3.28 s
cast pg1here    voices/raw/pg1here_b.mp3               -16 $F            # words 0.83, the clean end, 2.48 s
cast pg1come    voices/raw/pg1come_b.mp3               -16 $F            # words 1.00 against 0.78, 2.00 s
cast pn1num     voices/raw/pn1num_kanya_b.mp3          -16 $F            # CP11a: take b says "number fourteen" exactly
him  q1board    voices/raw/q1board_b.mp3               $F                # words 0.60, 2.72 s
cast pn1water   voices/raw/pn1water_b.mp3              -16 $F            # words 0.49, 6.40 s
him  q1water    voices/raw/q1water_a.mp3               $F                # words 1.00, 0.88 s
cast pn1n10     voices/raw/pn1n10_b.mp3                -16 $F            # words 0.70 against 0.43, 1.76 s
cast pn1n11     voices/raw/pn1n11_a.mp3                -16 $F            # the clean "ber" call (the transcriber hears "Ber11"), 2.24 s against b's drawn 2.80
cast pn1n12     voices/raw/pn1n12_a.mp3                -16 $F            # words 0.77 against 0.35, 2.24 s
cast pn1n13     voices/raw/pn1n13_b.mp3                -16 $F            # "เบอร์13ค่ะ" heard exactly, a short loud call across the yard (1.36 s) against a's 2.96
cast pn1n14     voices/raw/pn1n14_a.mp3                -16 $F            # words 0.84 against 0.31, 2.56 s
him  q1joy1     voices/raw/q1joy1_b.mp3                $F                # words 1.00, 2.24 s
cast jy1a       voices/raw/jy1a_hammy_b.mp3            -16 $F            # CP11a audition winner; words 1.00, the clean end, 6.96 s
him  q1joy2     voices/raw/q1joy2_a.mp3                $F                # words 1.00, 1.04 s
cast jy1b       voices/raw/jy1b_a.mp3                  -16 $F            # words 1.00, 6.24 s
him  q1lim1     voices/raw/q1lim1_b.mp3                $F                # words 1.00, 2.72 s
cast lm1a       voices/raw/lm1a_brandon_b.mp3          -16 --keep 8.0 $F # CP11a audition winner; words 0.95, 8.48 s; CP12: its silent tail cut at the words' end + 0.3 s
him  q1lim2     voices/raw/q1lim2_b.mp3                $F                # words 1.00, 1.28 s
cast lm1b       voices/raw/lm1b_a.mp3                  -16 $F            # words 1.00, the clean end, 4.48 s
him  q1sb1      voices/raw/q1sb1_a.mp3                 $F                # words 1.00, 2.64 s
cast pg1sbq     voices/raw/pg1sbq_a.mp3                -16 $F            # words 0.92 against 0.88, the clean end, 2.96 s
cast sb1a       voices/raw/sb1a_songkran_a.mp3         -16 $F            # CP11a audition winner; words 0.93 against 0.90, 8.64 s
cast pg1sb      voices/raw/pg1sb_b.mp3                 -16 $F            # words 0.90 against 0.84, 7.04 s
him  q1pg1      voices/raw/q1pg1_b.mp3                 $F                # words 1.00, 2.80 s
cast pg1me      voices/raw/pg1me_a.mp3                 -16 $F            # words 0.90 against 0.84, the clean end, 6.96 s
him  q1nobody   voices/raw/q1nobody_a.mp3              $F                # words 1.00, the clean end, 2.64 s
him  q1missed   voices/raw/q1missed_a.mp3              $F                # words 1.00, 1.60 s
cast jy1go      voices/raw/jy1go_b.mp3                 -16 $F            # words 1.00, 2.00 s
cast lm1go      voices/raw/lm1go_b.mp3                 -16 $F            # "Woah, finally" — nearer the script's "Wah", and 2 dB fuller
cast pg1go      voices/raw/pg1go_b.mp3                 -16 $F            # words 1.00 against 0.83, 2.48 s
him  q1tree     voices/raw/q1tree_b.mp3                $F                # words 1.00, 2.96 s
cast pg1tree    voices/raw/pg1tree_b.mp3               -18 $F            # an aside at a natural pace (3.04 s, a 0.46 s breath); a stops 1.02 s mid-line
cast fm1hello   voices/raw/fm1hello_a.mp3              -18 --keep 4.2 $F # words 1.00, the clean end, 4.48 s; CP12: its silent tail cut at the words' end + 0.3 s
him  q1wai      voices/raw/q1wai_b.mp3                 $F                # the clean head (-78 against a's ON-signal start); whisper cannot spell the Thai in either
cast fm1shop    voices/raw/fm1shop_b.mp3               -16 $F            # words 1.00, the clean end, 1.60 s
cast pg1shop    voices/raw/pg1shop_a.mp3               -16 $F            # words 0.83, 1.84 s
him  q1shop     voices/raw/q1shop_a.mp3                $F                # words 1.00, 5.44 s
cast pg1th1     voices/raw/pg1th1_b.mp3                -16 $F            # words 0.83 against 0.70, 2.96 s
cast fm1good    voices/raw/fm1good_patinya_b.mp3       -16 $F            # CP11a audition winner; words 1.00 against 0.97, 4.48 s
cast pg1good    voices/raw/pg1good_a.mp3               -16 $F            # words 1.00 against 0.92, 5.76 s
cast fm1day     voices/raw/fm1day_a.mp3                -16 $F            # words 1.00, 1.12 s
cast pg1day     voices/raw/pg1day_b.mp3                -16 $F            # words 0.86, 1.84 s
cast fm1hm      voices/raw/fm1hm_a.mp3                 -18 $F            # a considering hum (1.20 s); b is clipped short
cast fm1read    voices/raw/fm1read_a.mp3               -16 $F            # words 0.98, 10.64 s
cast pg1read    voices/raw/pg1read_b.mp3               -16 $F            # words 1.00, 7.60 s
him  q1short    voices/raw/q1short_a.mp3               $F                # words 1.00, 2.00 s
cast pn1tray    voices/raw/pn1tray_b.mp3               -18 $F            # words 0.57 against 0.47, 2.64 s
cast pg1items   voices/raw/pg1items_a.mp3              -16 $F            # words 0.91, 3.20 s
cast fm1items   voices/raw/fm1items_b.mp3              -16 $F            # words 1.00 against 0.93, 2.24 s
cast pg1nk      voices/raw/pg1nk_b.mp3                 -16 $F            # words 1.00 against 0.91, 3.52 s
cast pg1tk      voices/raw/pg1tk_a.mp3                 -16 $F            # words 0.93 against 0.77, 5.28 s
cast pg1py      voices/raw/pg1py_b.mp3                 -16 $F            # words 1.00 against 0.80, 4.88 s
cast pg1offer   voices/raw/pg1offer_b.mp3              -16 $F            # words 0.89 against 0.79, 4.00 s
cast fm1anu     voices/raw/fm1anu_a.mp3                -18 $F            # words 0.92 against 0.89, 2.64 s
cast fm1eyes    voices/raw/fm1eyes_a.mp3               -18 $F            # words 1.00 against 0.89, 3.36 s
cast pg1eyes    voices/raw/pg1eyes_b.mp3               -21 $F            # words 1.00 against 0.88, 3.76 s
cast fm1chant   voices/raw/fm1chant_b.mp3              -18 $F            # words 0.51 against 0.00, 33.76 s
cast fm1chant2  voices/raw/fm1chant2_b.mp3             -20 $F            # words 0.15 against 0.00, 18.16 s
him  q1smoke    voices/raw/q1smoke_b.mp3               $F                # words 1.00 against 0.93, the clean end, 6.08 s
him  q1cloth    voices/raw/q1cloth_b.mp3               $F                # words 1.00, 2.88 s
him  q1shadow   voices/raw/q1shadow_a.mp3              $F                # words 1.00, 3.76 s
him  q1her      voices/raw/q1her_b.mp3                 $F                # words 0.88, the clean end, 5.60 s
cast pg1power   voices/raw/pg1power_b.mp3              -21 $F            # words 1.00 against 0.59, 3.68 s
cast fm1blessA  voices/raw/fm1blessA_a.mp3             -16 $F            # words 0.84 against 0.80, the clean end, 2.32 s
cast pg1Ank     voices/raw/pg1Ank_b.mp3                -16 $F            # words 1.00 against 0.95, 5.52 s
cast pg1Atk     voices/raw/pg1Atk_b.mp3                -16 $F            # words 0.80 against 0.73, the clean end, 4.96 s
cast pg1Apy     voices/raw/pg1Apy_a.mp3                -16 $F            # 5.92 s; b stalls 1.54 s at the dash and runs 8.72
cast fm1Abye    voices/raw/fm1Abye_b.mp3               -16 $F            # words 1.00, 1.84 s
him  q1A1       voices/raw/q1A1_b.mp3                  --keep 1.82 $F    # read at a writing hand's pace (2.56 s) under the pen; CP12: its silent tail cut at the words' end + 0.3 s
cast pn1guava   voices/raw/pn1guava_a.mp3              -16 $F            # words 0.52 against 0.44, 8.00 s
him  q1A2       voices/raw/q1A2_b.mp3                  $F                # words 1.00, 0.64 s
cast pg1A1      voices/raw/pg1A1_b.mp3                 -16 $F            # words 1.00 against 0.91, 3.60 s
cast pg1A2      voices/raw/pg1A2_a.mp3                 -16 $F            # words 1.00, 1.44 s
him  q1A3       voices/raw/q1A3_a.mp3                  --keep 0.8 $F     # the beat before it (2.16 s), as the script's ellipsis asks; CP12: its silent tail cut at the words' end + 0.3 s
him  q1A4       voices/raw/q1A4_a.mp3                  $F                # words 1.00, 5.60 s
him  q1B1       voices/raw/q1B1_a.mp3                  $F                # words 1.00, 3.28 s
cast pg1B1      voices/raw/pg1B1_b.mp3                 -21 $F            # the whisper with the script's pause (1.28 s) after "Behind?"
cast pg1B2      voices/raw/pg1B2_a.mp3                 -18 $F            # words 1.00, 4.32 s
cast fm1B1      voices/raw/fm1B1_a.mp3                 -16 $F            # words 0.96, the clean end, 3.76 s
cast pg1B3      voices/raw/pg1B3_a.mp3                 -16 $F            # words 1.00, 6.88 s
cast fm1B2      voices/raw/fm1B2_b.mp3                 -16 $F            # words 0.96 against 0.81, 1.68 s
cast pg1B4      voices/raw/pg1B4_a.mp3                 -16 $F            # words 0.80, 1.68 s
him  q1B2       voices/raw/q1B2_b.mp3                  --keep 0.92 $F    # words 1.00, the clean end, 1.52 s; CP12: its silent tail cut at the words' end + 0.3 s
cast fm1B3      voices/raw/fm1B3_a.mp3                 -16 $F            # words 1.00, the clean end, 2.56 s
cast pg1B5      voices/raw/pg1B5_b.mp3                 -16 $F            # words 1.00 against 0.93, 3.28 s
him  q1B3       voices/raw/q1B3_a.mp3                  $F                # words 1.00, 2.72 s
cast pn1card    voices/raw/pn1card_b.mp3               -16 $F            # words 0.55 against 0.36, 2.64 s
cast pg1B6      voices/raw/pg1B6_a.mp3                 -16 $F            # words 1.00 against 0.89, 3.04 s
cast pg1B7      voices/raw/pg1B7_b.mp3                 -16 $F            # words 1.00, 3.44 s
him  q1B4       voices/raw/q1B4_a.mp3                  --keep 6.2 $F     # words 1.00, the clean end, 8.24 s; CP12: its silent tail cut at the words' end + 0.3 s
him  q1C0       voices/raw/q1C0_a.mp3                  $F                # words 1.00 against 0.88, 6.56 s
him  q1C1       voices/raw/q1C1_a.mp3                  $F                # words 1.00, 1.76 s
cast fm1C1      voices/raw/fm1C1_a.mp3                 -16 $F            # words 1.00, the clean end, 2.08 s
cast fm1C2      voices/raw/fm1C2_a.mp3                 -16 --keep 2.72 $F # words 0.78 against 0.68, 3.52 s; CP12: its silent tail cut at the words' end + 0.3 s
cast pg1C1      voices/raw/pg1C1_a.mp3                 -16 $F            # words 1.00, the clean end, 3.44 s
cast pn1C1      voices/raw/pn1C1_a.mp3                 -16 $F            # words 0.46 against 0.24, 6.16 s
cast pg1C2      voices/raw/pg1C2_a.mp3                 -16 $F            # breathless, as he catches up (2.48 s); b drags a 0.6 s gap into 4.24
him  q1C2       voices/raw/q1C2_a.mp3                  $F                # words 1.00 against 0.80, 1.28 s
him  q1C3       voices/raw/q1C3_b.mp3                  $F                # words 1.00, 5.12 s
him  q1D1       voices/raw/q1D1_a.mp3                  $F                # words 1.00, 5.44 s
cast pg1D1      voices/raw/pg1D1_b.mp3                 -16 $F            # words 0.94 against 0.88, 3.92 s
cast fm1D1      voices/raw/fm1D1_b.mp3                 -16 $F            # words 1.00, the clean end, 3.20 s
cast pg1D2      voices/raw/pg1D2_b.mp3                 -16 $F            # words 1.00 against 0.89, 3.04 s
him  q1D2       voices/raw/q1D2_a.mp3                  $F                # words 1.00, 4.16 s
cast pg1D3      voices/raw/pg1D3_a.mp3                 -16 $F            # words 1.00, the clean end, 5.84 s
him  q1D3       voices/raw/q1D3_b.mp3                  $F                # words 1.00, 2.96 s
him  q1D4       voices/raw/q1D4_a.mp3                  $F                # words 1.00, the clean end, 3.20 s
him  q1D5       voices/raw/q1D5_b.mp3                  $F                # words 1.00, the clean end, 3.28 s
cast tx1where   voices/raw/tx1where_kopio_a.mp3        -16 $F            # CP11a: take a has the words exactly
him  q1K1       voices/raw/q1K1_a.mp3                  --keep 6.24 $F    # words 0.90 against 0.80, 7.36 s; CP12: its silent tail cut at the words' end + 0.3 s
him  q1K2       voices/raw/q1K2_a.mp3                  $F                # words 1.00, 1.60 s
him  q1K3       voices/raw/q1K3_a.mp3                  $F                # words 1.00, 2.08 s
him  q1A        voices/raw/q1A_a.mp3                   --keep 4.62 $F    # words 1.00, 5.52 s; CP12: its silent tail cut at the words' end + 0.3 s
him  q1B        voices/raw/q1B_b.mp3                   $F                # words 1.00, 4.32 s
him  q1C        voices/raw/q1C_b.mp3                   $F                # words 1.00, 3.12 s
him  q1D        voices/raw/q1D_b.mp3                   $F                # words 1.00, 3.44 s
fi

# ======================================================================================================================
# THE EFFECTS — flow zNE7zBvy1ngpOBqOopQH, eleven_text_to_sound_v2, two takes each (sfx/script.json, sfx/sessions.json),
# measured with ../v22.0/cp5/meas.py (sfx/meas.txt: the bands a phone can and cannot play, the onset, the decay, holes)
# and a phone-band level (a 250 Hz high-pass twice, the share of a take a phone speaker plays). Five were RE-MADE
# (sfx/script.json `remakes`): the taxi, the pickup's cab and the heartbeat because every take was a rumble under 120 Hz
# (15-29 dB of it lost on a phone), the room tone because its fan never clicked, and the engine stopping because four
# takes over two prompts held a flat idle and never stopped (it is made to die here, sfx/rundown.py). Each pick's reason
# is on its line. Peak-matched (two passes, the encoders move it, v9.6) in each take's own channel layout.
fx() { # name src peak [ffmpeg filter]
  n=$1; s=$2; pk=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
fxc() { # name src peak filter_complex — an effect built from its take by a filter graph (the heartbeat's harmonics)
  n=$1; s=$2; pk=$3; fc=$4
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -filter_complex "$fc" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
bed() { # name src target_rms ceiling [pre-filter] — looped by hand (../v22.0/cp9/loopfast.py: the slow drift
  # flattened, the tail crossfaded over the head, so the joint is continuous by construction), levelled by RMS
  # (../v21.12/level_rms.py, v21.13's recipe)
  n=$1; s=$2; t=$3; c=$4; pf=${5:-anull}
  ffmpeg -v error -y -i "$s" -af "$pf,highpass=f=60:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v22.0/cp9/loopfast.py b_hp_$n.wav b_lp_$n.wav 1.5
  python3 ../v21.12/level_rms.py b_lp_$n.wav b_$n.wav $t $c
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (bed, RMS $t)"; rm -f b_hp_$n.wav b_lp_$n.wav b_$n.wav b_*.f32; }
mus() { # name src [ffmpeg filter] — music, stereo, peak -3 (v22.4's f4music), Opus 128k
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }

if [ -z "$ONLY" ] || [ "$ONLY" = sfx ]; then
fx  w4sandals   sfx/raw/w4sandals_a.mp3   -8                                   # two rubbery slaps (two gaps), the clean head (-70.7) at 0.05 s; b waits 0.25 s
fx  w4kneel     sfx/raw/w4kneel_b.mp3     -8                                   # the cloth's rustle a phone plays (92 % over 120 Hz); a is 40 % sub-bass
fx  w4tray      sfx/raw/w4tray_b.mp3      -8                                   # one clink, the cleaner head (-43.7 against -29.4)
fx  w4envelope  sfx/raw/w4envelope_a.mp3  -10                                  # the paper's slide (85 % over 3 kHz), clean at both ends (-57.3, -80.1)
fx  w4match     sfx/raw/w4match_a.mp3     -8                                   # the strike, the flare and the wick catching, to 1.4 s (b stops at 1.15)
fx  w4thunder   sfx/raw/w4thunder_a.mp3   -3                                   # 53 % of the roll in 120-500 Hz, which a phone plays (b is 86 % sub-bass); a clean head
fx  w4crack     sfx/raw/w4crack_a.mp3     -3                                   # the split and its crackle with a clean head (-32.8); b starts on signal (-8.8)
fx  w4rainstop  sfx/raw/w4rainstop_a.mp3  -8                                   # the roof easing to single drips, a clean decay (-70.3); b ends on signal
fx  w4mallair   sfx/raw/w4mallair_a.mp3   -10                                  # the closed mall's air and the far broom, the cleaner head (-55.9), steady
fx  w4shutter   sfx/raw/w4shutter_a.mp3   -6  "atrim=0.8,asetpts=PTS-STARTPTS"  # the slats rolling up and the CLUNK at the top (b has none); its 0.85 s lead cut
fx  w4switch    sfx/raw/w4switch_b.mp3    -8  "atrim=0.15,asetpts=PTS-STARTPTS" # one crisp click (74 % over 3 kHz; a is 60 % sub-bass); its lead cut
fx  w4ledhum    sfx/raw/w4ledhum_a.mp3    -14                                  # the LEDs' tick and whine (93 % over 3 kHz); b is half sub-bass
fx  w4carton    sfx/raw/w4carton_b.mp3    -10                                  # the flap and the bubble wrap (67 % in 500 Hz-3 kHz), the cleaner head
fx  w4pen       sfx/raw/w4pen_a.mp3       -10 "afade=t=out:st=1.5:d=0.26"      # the ballpoint (49 % in 500 Hz-3 kHz); both write to the last sample, so faded
fx  w4buzz      sfx/raw/w4buzz_b.mp3      -8  "atrim=0.38:0.9,asetpts=PTS-STARTPTS,afade=t=in:d=0.006,afade=t=out:st=0.44:d=0.08"  # ONE buzz (b's second, 0.5 s): the film cues two, 0.9 s apart
fx  w4type      sfx/raw/w4type_a.mp3      -10 "afade=t=in:d=0.004"             # taps, then the send's swoosh with a clean tail (-80.9); b ends on signal
fx  w4wind      sfx/raw/w4wind_b.mp3      -6  "afade=t=in:d=0.4,afade=t=out:st=9.2:d=0.75"  # the fronds' rustle (23 % over 3 kHz; 6.7 dB lost on a phone against a's 9.3)
fx  w4drivepass sfx/raw/w4drivepass_a.mp3 -4                                   # the pass with a clean tail (-79.2), a third of it in 500 Hz-3 kHz
fx  w4diesel    sfx/raw/w4diesel_r2_a.mp3 -8                                   # RE-MADE: the cab's diesel clatter and rattle, 10.8 dB lost on a phone (the first pair 25-27); a pothole at 9 s; a clean end
fx  w4drops     sfx/raw/w4drops_b.mp3     -8  "afade=t=out:st=4.4:d=0.6"       # the louder splats (21 % over 3 kHz); both end on signal, so faded
fx  w4gravel    sfx/raw/w4gravel_a.mp3    -6  "afade=t=out:st=2.6:d=0.4"       # the crunch a phone plays (91 % in 500 Hz-3 kHz); b is 41 % sub-bass
python3 sfx/rundown.py sfx/raw/w4engoff_r2_a.mp3 w_rd.wav >/dev/null
fx  w4engoff    w_rd.wav                  -8                                   # MADE TO DIE (sfx/rundown.py): r2 a's idle 0.7 s, run down to 0.35x over 1.4 s under a slowing shudder, three ticks of cooling metal
rm -f w_rd.wav
fx  w4drips     sfx/raw/w4drips_b.mp3     -10 "afade=t=in:d=0.3,afade=t=out:st=9.2:d=0.8"  # steady drips (a 7 dB swing; a's bucket strike stands 17 dB over the rest)
fx  w4breath    sfx/raw/w4breath_a.mp3    -8                                   # in, a pause, out, with a clean tail (-72.3)
fx  w4pao       sfx/raw/w4pao_a.mp3       -10                                  # one puff, the clean head (-61.2 against -40.6)
fx  w4frogs     sfx/raw/w4frogs_a.mp3     -8  "afade=t=in:d=0.5,afade=t=out:st=11:d=1"  # the chorus, 97 % in 500 Hz-3 kHz, steadier than b; faded (both end on signal)
fx  w4page      sfx/raw/w4page_a.mp3      -10                                  # a crisp turn (35 % over 3 kHz), the cleaner head (-65.1)
fx  w4steps     sfx/raw/w4steps_b.mp3     -8                                   # squelching steps to 4.45 s (a stops at 3.8)
fx  w4door      sfx/raw/w4door_a.mp3      -6                                   # the slam at once (b opens 0.8 s before it, and is 41 % sub-bass)
fx  w4pat       sfx/raw/w4pat_a.mp3       -10                                  # the pats and the keys, more of the cloth than b
fx  w4card      sfx/raw/w4card_a.mp3      -10                                  # the slide and the flick, 6 dB more than b
fxc w4heart     sfx/raw/w4heart_r2_b.mp3  -6  "[0:a]asplit[a][b];[b]lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,lowpass=f=2500,volume=-6dB[h];[a][h]amix=inputs=2:normalize=0"  # RE-MADE AND HARMONISED: every take was 90-97 % sub-bass (24-29 dB lost on a phone); r2 b (88 bpm) with its own thump's harmonics laid under it — 11 dB lost now, the gaps still 50 dB under the beats
fx  w4rise      sfx/raw/w4rise_a.mp3      -8                                   # the rustle and the knock across the band (25 % over 3 kHz); b is one low knock
fx  w4cup       sfx/raw/w4cup_a.mp3       -6                                   # the clatter and the splash with a clean tail (-84)
fx  w4dog       sfx/raw/w4dog_a.mp3       -8                                   # two barks and the chain, clean at both ends
fx  w4gasp      sfx/raw/w4gasp_b.mp3      -8                                   # the breath of the gasp (20 % over 3 kHz), a clean tail (-80.6)
fx  w4bell      sfx/raw/w4bell_a.mp3      -8                                   # the longer ring (-60 at 1.9 s; b is gone by 1.0)
# the plan's effects that were not in the first run (§9.2): made, measured and picked the same way
fx  w4marker    sfx/raw/w4marker_a.mp3    -10                                  # two squeaky strokes (78 % over 3 kHz), the clean head (-36.7; b starts on signal)
fx  w4water     sfx/raw/w4water_a.mp3     -10                                  # the tap's gurgle into the cup, 91 % in 500 Hz-3 kHz, the cleaner head (-42.8)
fx  w4tube      sfx/raw/w4tube_b.mp3      -10 "afade=t=out:st=1.35:d=0.45"     # the flicker's ticks (a is one steady 12 kHz whine); faded as the tube's light dies at 1.7 s
fx  w4mala      sfx/raw/w4mala_b.mp3      -12 "atrim=0.25,asetpts=PTS-STARTPTS" # the beads' dry clicks to 2.3 s (a stops at 1.65); its lead cut
fx  w4cloth     sfx/raw/w4cloth_b.mp3     -12                                  # the cloth's soft settle, the longer of two (to 1.15 s; a is over by 0.6)
fx  w4sandon    sfx/raw/w4sandon_b.mp3    -8                                   # the rubbery step back on (37 % in 120-500 Hz, 53 % above); a is 6 dB quieter and thin
fi

# THE BEDS (sfx/meas.txt; the 1 s profiles from ../v21.0/sfxmeas.py):
#   w4yard      b     roosters, a TV, a motorbike over the cicadas (15 % in 500 Hz-3 kHz); a is cicadas alone, 99.5 % over 3 kHz
#   w4paddy     a     the paddies' insects with the wind (a 6.5 dB swing); b is a gust of sub-bass that swells 13 dB
#   w4roomtone  r2 b  RE-MADE: the fan's whir and the tube's buzz a phone plays (5.9 dB lost against the first pair's 13-20)
#   w4rainl     b     light rain on the zinc, crisp (55 % over 3 kHz) — a patter, to set against the heavy one's roar
#   w4rainh     b     the downpour drumming (71 % in 500 Hz-3 kHz), the lower and heavier of two
#   w4after     b     drips, frogs and birds after the rain (73 % in 500 Hz-3 kHz); a is 87 % sub-bass
#   w4taxi      r2 b + w4rainl b at -6 dB: RE-MADE (the first pair were the engine's rumble, 15-17 dB lost on a phone), and
#               still a car's low drone, so the rain on its roof is laid in: a phone hears the rain, a desk the car
#   w4radio     music b through a radio (a 280 Hz-4.2 kHz band, a little saturation): luk thung from the stilt house
if [ -z "$ONLY" ] || [ "$ONLY" = beds ]; then
bed w4yard      sfx/raw/w4yard_b.mp3       -24 -10
bed w4paddy     sfx/raw/w4paddy_a.mp3      -26 -10
bed w4roomtone  sfx/raw/w4roomtone_r2_b.mp3 -32 -14
bed w4rainl     sfx/raw/w4rainl_b.mp3      -22 -8
bed w4rainh     sfx/raw/w4rainh_b.mp3      -16 -4
bed w4after     sfx/raw/w4after_b.mp3      -28 -10
ffmpeg -v error -y -i sfx/raw/w4taxi_r2_b.mp3 -i sfx/raw/w4rainl_b.mp3 -filter_complex "[1:a]volume=-6dB[r];[0:a][r]amix=inputs=2:normalize=0:duration=first" -ar 48000 -ac 2 w_taxi.wav
bed w4taxi      w_taxi.wav                 -22 -8
rm -f w_taxi.wav
bed w4radio     music/raw/w4radio_b.mp3    -20 -8  "highpass=f=280:poles=2,lowpass=f=4200:poles=2,volume=6dB,asoftclip=type=tanh"
fi

# THE MUSIC — eleven_music_v2_5, instrumental, four takes each (music/script.json, music/sessions.json), measured
# (music/meas.txt, 2.5 s profiles): PROVISIONAL picks until Chad's ear (the previews, v22.4's way):
#   w4open  c  the arc the film needs: -19 dB under the first 37 s (the shop, the book, the message) and up 6-7 dB from
#              40 s as the pickup runs at the storm, gone by 72 (the film's black at 70.9); a and b are flat, d rises early
#   w4endA  d  the khaen at once (-25 in its first 2.5 s, 3.2 dB lost on a phone): the ending plays 13 s of it, and a, b
#              and c spend their first 7-10 s rising out of silence
#   w4endB  c  rises out of quiet over 20 s under the master's long look, holds, and fades from 60 s (the coda's at 65.6)
#   w4endC  a  the pulse building (-22 to -14 over 45 s) and thinning at 47.5 s, as asked; b, c and d are flat
#   w4endD  a  the phin in the phone band (1.9 dB lost), steady
#   w4coda  d  one chord held with no sub-bass (96 % in 120-500 Hz); a and b are 84-88 % under 120 Hz
#   w4storm a  (the storm's drone, made after the first run: the plan's §9.4 item 4) — see its line
if [ -z "$ONLY" ] || [ "$ONLY" = music ]; then
mus w4open  music/raw/w4open_c.mp3  "afade=t=out:st=73.0:d=2.0"
mus w4endA  music/raw/w4endA_d.mp3
mus w4endB  music/raw/w4endB_c.mp3
mus w4endC  music/raw/w4endC_a.mp3
mus w4endD  music/raw/w4endD_a.mp3
mus w4coda  music/raw/w4coda_d.mp3  "afade=t=out:st=6.6:d=1.4"
mus w4storm music/raw/w4storm_a.mp3 "atrim=1.5,asetpts=PTS-STARTPTS"   # the one that RISES out of near silence (-53 to -16 dB by 22 s) with 64 % in 120-500 Hz, which a phone plays; b, c and d are 60-80 % sub-bass and loud from their first seconds
fi
