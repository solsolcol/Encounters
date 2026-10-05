#!/bin/sh
# v18.0 · EPISODE 3 · CHAPTER 2 · THE HANDS THAT MOVED — the recipe.
# 24 lines of his (Louis), 2 of the laywoman (Onnie Thai — over Air by her
# clean edges: lw2pull ends at -65 dBFS against -27), 10 effects, 5 beds and
# 3 music cues, two takes each, picked by measurement (measure.py,
# pauses.py — the numbers are in measure.json).
# PICKS, voice: clean END first (a take ending on signal clicks), then no
# odd hole (z2pro4 a has a 2.2 s gap mid-line, z2C1 a 2.5 s), then the tighter
# read. z2next b keeps its 1.3 s pause before "Then came Buddha Day" on
# purpose. z2A1 b is 11 words in 2.6 s of speech: rushed — a.
# effects: templedusk a is 99.9 % above 3 kHz (hiss and crickets only) — b;
# templedoor b is 64 % sub-bass — a; e3pull b 39 % sub-bass — a; e3close2 a
# is -28 dBFS RMS and murky — b, cut past its 5.5 s of silence.
# THE PHONE'S CHANT in the film's flat is built, not generated: the flat's
# take carries its chant at 8 % in the band a phone plays, so the hall's own
# vesper is band-passed to a phone speaker (500 Hz - 3.5 kHz, a little
# drive) and laid under it.
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
him() { ffmpeg -v error -y -i "$2" -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$1.wav; enc $1 h_$1.wav $V $O 64k 1; rm -f h_$1.wav; }
cast() { # name src rms
  n=$1; src=$2; r=${3:--16}
  python3 ../v11.1/level.py "$src" wc_$n.wav $r
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS $r)"; rm -f wc_$n.wav wc_$n.wav.f32
}
trim() { python3 proc.py trim "$1" "$2" $3 $4 ${5:-0.12}; }
loop() { python3 proc.py loop "$1" "$2" ${3:-1.5}; }
rmsenc() { # name wav rms br — a bed levelled by its average, stereo kept
  python3 loud.py "$2" w_$1_l.wav $3
  ffmpeg -v error -y -i w_$1_l.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$1.mp3
  ffmpeg -v error -y -i w_$1_l.wav -map_metadata -1 -c:a libopus -b:a ${4:-96k} -ar 48000 ../../assets/audio-opus/$1.ogg
  echo "$1 <- $2 (RMS $3)"; rm -f w_$1_l.wav
}
V=-6.85; O=-6.6; E=-4.0

# --- him (Louis)
him z2pro1 raw/z2pro1_a.mp3; him z2pro2 raw/z2pro2_b.mp3; him z2pro3 raw/z2pro3_b.mp3
him z2pro4 raw/z2pro4_b.mp3; him z2pro5 raw/z2pro5_b.mp3; him z2pro6 raw/z2pro6_b.mp3
him z2arrive raw/z2arrive_a.mp3; him z2leaf raw/z2leaf_a.mp3; him z2kneel raw/z2kneel_b.mp3
him z2slip1 raw/z2slip1_b.mp3; him z2slip2 raw/z2slip2_b.mp3; him z2peak raw/z2peak_b.mp3
him z2A1 raw/z2A1_a.mp3; him z2B1 raw/z2B1_a.mp3; him z2C1 raw/z2C1_b.mp3; him z2D1 raw/z2D1_a.mp3
him z2close raw/z2close_a.mp3; him z2next raw/z2next_b.mp3
him z2A raw/z2A_a.mp3; him z2B raw/z2B_b.mp3; him z2C raw/z2C_a.mp3; him z2D raw/z2D_a.mp3
# --- the laywoman (Onnie Thai): whispers, levelled a little under speech
cast lw2look raw/lw2look_onnie_a.mp3 -19; cast lw2pull raw/lw2pull_air_b.mp3 -19   # Yai is a second woman: Air, not Onnie

# --- effects (the van door is `slidevan`: a file named v* is read as one of HIS voice takes by chaptertest)
trim raw/pageturn_b.mp3 w_pageturn.wav 0.0 1.95 0.3;     enc pageturn w_pageturn.wav $E $E 96k 2
trim raw/goldleaf_b.mp3 w_goldleaf.wav 0.45 2.75 0.3;    enc goldleaf w_goldleaf.wav -6.0 -6.0 96k 2
trim raw/matkneel_a.mp3 w_matkneel.wav 0.0 1.5 0.3;      enc matkneel w_matkneel.wav $E $E 96k 2
trim raw/handsrise_a.mp3 w_handsrise.wav 0.9 2.75 0.4;   enc handsrise w_handsrise.wav -5.0 -5.0 96k 2
trim raw/handslip_a.mp3 w_handslip.wav 0.0 1.25 0.2;     enc handslip w_handslip.wav $E $E 96k 2
enc whispers raw/whispers_a.mp3 -8.0 -8.0 96k 2
trim raw/chantswell_a.mp3 w_chantswell.wav 0.0 5.2 1.4;  enc chantswell w_chantswell.wav -3.0 -3.0 96k 2
trim raw/chantstop_a.mp3 w_chantstop.wav 0.0 3.6 0.8;    enc chantstop w_chantstop.wav -3.0 -3.0 96k 2
trim raw/templedoor_a.mp3 w_templedoor.wav 0.0 1.9 0.4;  enc templedoor w_templedoor.wav $E $E 96k 2
trim raw/vanshut_a.mp3 w_vanshut.wav 0.0 1.5 0.3;        enc slidevan w_vanshut.wav $E $E 96k 2
# --- beds: the vesper chant, the hall, the dusk outside — loops
loop raw/e3vesper_a.mp3 w_e3vesper.wav 2.0;              enc e3vesper w_e3vesper.wav -4.0 -4.0 96k 2
loop raw/hallamb_a.mp3 w_hallamb.wav 2.0;                enc hallamb w_hallamb.wav -8.0 -8.0 96k 2
loop raw/templedusk_b.mp3 w_templedusk.wav 2.0;          enc templedusk w_templedusk.wav -6.0 -6.0 96k 2
# --- the film's two rooms: one-shots, faded
trim raw/officeamb2_a.mp3 w_officeamb2.wav 0.0 10.4 1.2; enc officeamb2 w_officeamb2.wav -8.0 -8.0 96k 2
ffmpeg -v error -y -i raw/e3vesper_a.mp3 -t 15 -af "highpass=f=500:poles=2,lowpass=f=3500:poles=2,acompressor=threshold=-24dB:ratio=6,volume=6dB" -ar 48000 -ac 2 w_phonechant.wav
ffmpeg -v error -y -i raw/flatnight_a.mp3 -i w_phonechant.wav -filter_complex "[0:a]aresample=48000,volume=1.0[a];[1:a]volume=0.55[b];[a][b]amix=inputs=2:duration=first:normalize=0" -ac 2 w_flatnight0.wav
trim w_flatnight0.wav w_flatnight.wav 0.0 14.6 1.4;      enc flatnight w_flatnight.wav -8.0 -8.0 96k 2
# --- music
trim raw/e3film2_a.mp3 w_e3film2.wav 1.8 54.0 3.0;       enc e3film2 w_e3film2.wav -3.0 -3.0 96k 2
trim raw/e3close2_b.mp3 w_e3close2.wav 9.8 45.5 3.0;     enc e3close2 w_e3close2.wav -3.0 -3.0 96k 2   # v18.5: from 9.8 (was 5.3) — the body arrives 3.2 s in, not 7.7, so the endings hear it before their fade
trim raw/e3pull_a.mp3 w_e3pull0.wav 2.6 60.0 0.01;       loop w_e3pull0.wav w_e3pull1.wav 3.0
rmsenc e3pull w_e3pull1.wav -19
rm -f w_*.f32 w_e3pull0.wav w_e3pull1.wav w_flatnight0.wav w_phonechant.wav
