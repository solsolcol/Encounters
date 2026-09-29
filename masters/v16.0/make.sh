#!/bin/sh
# v16.0 · EPISODE 3 · CHAPTER 1 · THE LUCK I WENT LOOKING FOR — the recipe.
# 34 voice takes in three voices (Louis, Toto, Anna), 20 sounds and three
# music cues, generated two takes each (four for the rod and the barefoot
# step), picked by measurement (measure.py -> measure.json, pauses.py).
#
# THE PICKS, and why (the numbers are measure.py's):
#   voice — clean EDGES first (a take that ends ON signal clicks through the
#   v5.30 envelope), then no spoken stage direction (pauses.py: a spoken tag
#   is a short first segment and a pause before the line — none found), then
#   the tighter read. z1askD a has a 4.6 s hole in the middle of a five-word
#   line: b. aj1katha a and c are 35 % and 50 % sub-bass: b. aj1done b is
#   27 % sub-bass: a.
#   HIS VOICE IS HIGH-PASSED AT 70 Hz: Louis puts 30-45 % of his energy
#   under 120 Hz (the recruit4 note at v10.1 said the same of him), which a
#   phone cannot play and his bus's compressor would pump on.
#   effects — the rod (yantap) is take a cut to its ONE transient (1.14 s,
#   30 ms of attack: take c is five taps, b and d are 76 % / 44 % sub-bass
#   thumps). THE BAREFOOT STEP's first two takes were 98 % sub-bass — a
#   thump a phone cannot play — and it was regenerated (barestep2).
#   boomgate and seatchime came back CLIPPING (+3.3 / +2.6 dBFS): normalised.
#   music — e3film b (a opens on 5.9 s of silence), e3wait a (0 % under
#   120 Hz; b 13 %), e3close b.
# Levels: his voice peak -6.85 mp3 / -6.6 ogg (Aaron's rule; his bus carries
# the compressor and the limiter); THE CAST BY RMS to -16 dBFS (the flat cast
# bus, v11.1); effects -4.0; the rod -2.0 (it is the beat you play to); the
# film and closing music -3.0; the waiting bed by RMS (-19) so it is heard.
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
him() { # name src — his voice: high-passed at 70 Hz, then peak-matched
  ffmpeg -v error -y -i "$2" -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$1.wav
  enc $1 h_$1.wav $V $O 64k 1; rm -f h_$1.wav
}
cast() { # name src — levelled by RMS for the FLAT cast bus, then encoded plainly
  n=$1; src=$2
  python3 ../v11.1/level.py "$src" wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"
  rm -f wc_$n.wav wc_$n.wav.f32
}
trim() { python3 proc.py trim "$1" "$2" $3 $4 ${5:-0.12}; }
loop() { python3 proc.py loop "$1" "$2" ${3:-1.5}; }
V=-6.85; O=-6.6; E=-4.0

# --- him (Louis): the film, play, the four asks, the close, the card lines
him z1pro1 raw/z1pro1_a.mp3;  him z1pro2 raw/z1pro2_a.mp3;  him z1pro3 raw/z1pro3_a.mp3
him z1pro4 raw/z1pro4_a.mp3;  him z1pro5 raw/z1pro5_a.mp3;  him z1pro6 raw/z1pro6_a.mp3
him z1arrive raw/z1arrive_b.mp3; him z1wai raw/z1wai_b.mp3; him z1wait raw/z1wait_b.mp3
him z1warm raw/z1warm_c.mp3
him z1askA raw/z1askA_a.mp3;  him z1askB raw/z1askB_b.mp3;  him z1askC raw/z1askC_b.mp3
him z1askD raw/z1askD_b.mp3
him z1close raw/z1close_b.mp3; him z1next raw/z1next_b.mp3
him z1A raw/z1A_a.mp3; him z1B raw/z1B_b.mp3; him z1C raw/z1C_b.mp3; him z1D raw/z1D_a.mp3

# --- the Ajarn (Toto) and the stall auntie (Anna): the flat cast bus
cast aj1next raw/aj1next_a.mp3;   cast aj1sit raw/aj1sit_a.mp3
cast aj1breathe raw/aj1breathe_b.mp3; cast aj1katha raw/aj1katha_b.mp3
cast aj1done raw/aj1done_a.mp3;   cast aj1ask raw/aj1ask_a.mp3
cast aj1A raw/aj1A_b.mp3; cast aj1B raw/aj1B_b.mp3; cast aj1C raw/aj1C_b.mp3
cast aj1D1 raw/aj1D1_a.mp3; cast aj1D2 raw/aj1D2_a.mp3
cast au1hi raw/au1hi_a.mp3; cast au1sell raw/au1sell_b.mp3; cast au1shoes raw/au1shoes_b.mp3

# --- effects: cut to what they are, then peak-matched
trim raw/yantap_a.mp3 w_yantap.wav 1.14 1.46 0.10;       enc yantap w_yantap.wav -2.0 -2.0 96k 1
trim raw/yantblow_a.mp3 w_yantblow.wav 0.15 1.45 0.25;   enc yantblow w_yantblow.wav $E $E 96k 1
trim raw/yantwarm_b.mp3 w_yantwarm.wav 0.0 2.7 0.8;      enc yantwarm w_yantwarm.wav $E $E 96k 2
trim raw/e3bell_b.mp3 w_e3bell.wav 0.0 4.6 1.2;          enc e3bell w_e3bell.wav $E $E 96k 2
trim raw/e3gong_a.mp3 w_e3gong.wav 0.0 3.3 1.0;          enc e3gong w_e3gong.wav $E $E 96k 2
enc boomgate raw/boomgate_a.mp3 $E $E 96k 2
enc keytype raw/keytype_b.mp3 $E $E 96k 2
trim raw/taperip_a.mp3 w_taperip.wav 0.0 2.3 0.2;        enc taperip w_taperip.wav $E $E 96k 2
trim raw/orderchime_b.mp3 w_orderchime.wav 0.0 1.1 0.4;  enc orderchime w_orderchime.wav $E $E 96k 2
trim raw/seatchime_b.mp3 w_seatchime.wav 0.0 1.3 0.5;    enc seatchime w_seatchime.wav $E $E 96k 2
trim raw/candlelit_a.mp3 w_candlelit.wav 0.0 0.9 0.4;    enc candlelit w_candlelit.wav $E $E 96k 2
trim raw/shoesoff_a.mp3 w_shoesoff.wav 0.15 1.8 0.2;     enc shoesoff w_shoesoff.wav $E $E 96k 2
enc trayset raw/trayset_a.mp3 $E $E 96k 2
enc coins raw/coins_b.mp3 $E $E 96k 2
trim raw/incenselit_b.mp3 w_incenselit.wav 0.1 2.3 0.3;  enc incenselit w_incenselit.wav $E $E 96k 2
trim raw/barestep2_c.mp3 w_barestep.wav 0.38 0.78 0.12;  enc barestep w_barestep.wav -6.0 -6.0 96k 1   # take c: one footfall, 57 % in 120-500 Hz
# the film's three rooms: one-shots cut to their shots, faded out
trim raw/officehum_a.mp3 w_officehum.wav 0.0 10.6 1.2;   enc officehum w_officehum.wav -10.0 -10.0 96k 2
trim raw/wareamb_a.mp3 w_wareamb.wav 0.0 14.6 1.4;       enc wareamb w_wareamb.wav -8.0 -8.0 96k 2
trim raw/cabinhum_b.mp3 w_cabinhum.wav 0.0 8.4 1.2;      enc cabinhum w_cabinhum.wav -8.0 -8.0 96k 2
# the wat's two beds: LOOPS, the drift flattened and the tail crossfaded over the head
loop raw/watamb_a.mp3 w_watamb.wav 2.0;                  enc watamb w_watamb.wav -6.0 -6.0 96k 2
loop raw/e3chant_b.mp3 w_e3chant.wav 2.0;                enc e3chant w_e3chant.wav -4.0 -4.0 96k 2
# the music
enc e3film raw/e3film_b.mp3 -3.0 -3.0 96k 2
trim raw/e3close_b.mp3 w_e3close.wav 0.0 46.5 2.5;       enc e3close w_e3close.wav -3.0 -3.0 96k 2
trim raw/e3wait_a.mp3 w_e3wait0.wav 3.0 67.0 0.01;       loop w_e3wait0.wav w_e3wait1.wav 2.5
python3 loud.py w_e3wait1.wav w_e3wait.wav -19     # stereo stays stereo (level.py is mono, for voices)
ffmpeg -v error -y -i w_e3wait.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/e3wait.mp3
ffmpeg -v error -y -i w_e3wait.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/e3wait.ogg
echo "e3wait <- raw/e3wait_a.mp3 (loop, RMS -19)"
rm -f w_*.f32 w_e3wait0.wav w_e3wait1.wav
