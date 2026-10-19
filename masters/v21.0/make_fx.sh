#!/bin/sh
# v21.0 · episode 3 chapter 3, The Dance On Buddha Day — the EFFECTS, BEDS and
# MUSIC. Flow chhSJQIo5sMsm1HL5tDM (sfxnodes.json: name -> node; sessions.json:
# name -> its takes), eleven_text_to_sound_v2 with duration_seconds / loop /
# prompt_influence as PARAMETERS (the v9.2 law), eleven_music_v2 instrumental.
# PICKED BY MEASUREMENT (measure.py, sfxmeas.py, bounds.py, musmeas.py — no
# ears here): first the band a phone speaker plays (the v10.4 law — a take that
# is all sub-bass is silent on his device), then clean edges, then the shape.
#   presencein: both first takes 88-96 % under 120 Hz — re-asked as an airy
#     inward rush (presencein2): a, which rises from silence (b starts on signal)
#   kneethud: both 99 % under 120 Hz — b ships for big speakers, and the scene
#     layers e3c2's matkneel over it so a phone hears the knees land
#   phonerec: both takes SILENT (-72 dBFS) — synthesized here, two short tones
#   swordswish: a is 99 % sub — b (91 % above 3 kHz, the swish itself)
#   goldsting: a 70 % sub — b, the shimmer
#   urnsand: b 77 % sub — a, the crunch
#   taobell: a 91 % above 3 kHz and ends ON signal — b (88 % in 500 Hz-3 kHz,
#     where a brass hand bell's body is), clean tail
#   shrineamb: a 80 % sub and swings 29 dB — b; mallamb: b (4 % sub against 15)
#   vesakchant (installed as shopchant): a (79 % in the voice band; b sits 20 dB down in 120-500 Hz)
#   lorongamb: b (traffic and the compressor reach the mid band; a is crickets)
#   estatemorn: a (84 % 500 Hz-3 kHz — the mynas; b is 93 % hiss-high)
#   hanumanroar: four takes, all ~96 % in the voice band; c is the only one that
#     roars for the whole 2.8 s and starts and ends clean — Chad's ear may swap it
#   e3shrine: both first takes 96-98 % under 120 Hz (a drum and a drone) — re-asked
#     with erhu and suona only (e3shrine2): b, which never goes silent (a sits at
#     -50 dB for its first 12 s, a gap every time it would loop); its woodblock
#     ticks (0.78 attacks a second) under the readings
#   e3dance: c (99.5 % in the phone band, steady at -13 dB, the body from 0 s);
#     a and b sent to Chad with it; d is 52 % sub — out
#   e3film3: b (body from the first second; a is silent for 12 s)
#   e3close3: a (98 % phone band; b sits at -31 dB RMS and low)
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
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
trim() { python3 proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
loop() { python3 proc.py loop "$1" "$2" ${3:-1.5} >/dev/null; }
xloop() { python3 proc.py xloop "$1" "$2" ${3:-1.5} >/dev/null; }
fx() { # name raw start end fade target channels
  trim "$2" w_$1.wav $3 $4 $5; enc $1 w_$1.wav $6 $6 96k ${7:-2}; rm -f w_$1.wav w_$1.wav.f32; }

# --- the shop
fx shopbell    raw/shopbell_a.mp3    0.00 1.57 0.30 -6.0
fx glasscase   raw/glasscase_a.mp3   0.00 1.60 0.15 -5.0
fx casesnap    raw/casesnap_b.mp3    0.15 0.69 0.08 -6.0
# --- the trance
fx presencein  raw/presencein2_a.mp3 0.00 3.00 0.40 -3.0
fx rushgrab    raw/rushgrab_b.mp3    0.01 2.74 0.30 -4.0
fx crowdgasp   raw/crowdgasp_a.mp3   0.00 2.20 0.40 -4.0
enc phonerec w_phonerec.wav -10.0 -10.0 64k 1
fx stoolfall   raw/stoolfall_a.mp3   0.00 0.96 0.10 -4.0
fx timelapse   raw/timelapse_a.mp3   0.85 2.71 0.25 -4.0
fx kneethud    raw/kneethud_b.mp3    0.00 0.91 0.10 -3.0
# --- the shrine
fx shutter     raw/shutter_a.mp3     0.00 2.90 0.20 -3.0
fx urnsand     raw/urnsand_a.mp3     0.00 0.82 0.10 -6.0
fx stoolscrape raw/stoolscrape_b.mp3 0.00 0.94 0.10 -5.0
fx taobell     raw/taobell_b.mp3     0.00 2.95 0.30 -4.0
fx ashwater    raw/ashwater_a.mp3    0.00 2.03 0.20 -6.0
fx swordswish  raw/swordswish_b.mp3  0.00 0.81 0.10 -4.0
fx hanumanroar raw/hanumanroar_c.mp3 0.00 2.87 0.30 -1.5
fx goldsting   raw/goldsting_b.mp3   0.00 2.42 0.40 -3.0
fx drinkgulp   raw/drinkgulp_b.mp3   0.02 1.60 0.15 -6.0
fx buspass     raw/buspass_a.mp3     0.25 4.79 0.40 -5.0

# --- the beds (looped: 'loop' flattens a steady bed's slow drift; 'xloop' only
#     crossfades, for the chant's phrases, the birds and the dancing feet)
loop  raw/mallamb_b.mp3    w_mallamb.wav 2.0;    enc mallamb w_mallamb.wav -8.0 -8.0 96k 2
xloop raw/vesakchant_a.mp3 w_shopchant.wav 2.0; enc shopchant w_shopchant.wav -4.0 -4.0 96k 2   # named shopchant: a file named v* is read as HIS voice take by chaptertest
xloop raw/dancemove_a.mp3  w_dancemove.wav 1.5;  enc dancemove w_dancemove.wav -8.0 -8.0 96k 2
loop  raw/lorongamb_b.mp3  w_lorongamb.wav 2.0;  enc lorongamb w_lorongamb.wav -8.0 -8.0 96k 2
xloop raw/estatemorn_a.mp3 w_estatemorn.wav 2.0; enc estatemorn w_estatemorn.wav -6.0 -6.0 96k 2
loop  raw/shrineamb_b.mp3  w_shrineamb.wav 2.0;  enc shrineamb w_shrineamb.wav -8.0 -8.0 96k 2

# --- the music
trim raw/e3dance_c.mp3 w_d0.wav 0.82 53.0 0.01; xloop w_d0.wav w_e3dance.wav 3.0; enc e3dance w_e3dance.wav -3.0 -3.0 96k 2
trim raw/e3shrine2_b.mp3 w_s0.wav 0.32 44.6 0.01; xloop w_s0.wav w_e3shrine.wav 3.0; enc e3shrine w_e3shrine.wav -4.0 -4.0 96k 2
fx e3film3  raw/e3film3_b.mp3  0.01 53.3 2.50 -3.0
fx e3close3 raw/e3close3_a.mp3 0.81 52.6 3.00 -3.0
rm -f w_*.f32 w_d0.wav w_s0.wav w_e3shrine.wav w_mallamb.wav w_shopchant.wav w_dancemove.wav w_lorongamb.wav w_estatemorn.wav w_shrineamb.wav w_e3dance.wav
