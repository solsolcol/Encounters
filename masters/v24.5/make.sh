#!/bin/bash
# v24.5 · episode 3 chapter 5's loops, made to be played by the engine (R1-1, R1-2, R1-4 of masters/v24.5/findings.md).
# Run from masters/v24.5. Nothing is generated: every source is a master already on disk (masters/v23.0, masters/v24.2).
#
# R1-2 · THE ENGINE'S WINDOW. main.js loopVol starts every bed 60 ms in and loops [0.06, d - 0.06] (the inset hides the
#   silence an mp3 decode pads onto both ends), so every loop built to join at 0/d — loopfast's crossfade, synth.py's exact
#   loops — joined somewhere else: k5heart dropped a beat every loop, k5decide clicked every 34 s, k5care and k5night
#   stepped 30x their typical sample step. padloop.py lays 60 ms of each loop's own wrap on both ends, so the window the
#   engine plays IS the loop as built. Every bed this chapter built itself is re-made the way it was made, plus the pad:
#   v23.0's k5nightbed, k5deep, k5dawnbed, k5under, k5care, k5night (masters/v23.0/make.sh's recipes) and v24.3's
#   k5shopnight, k5templenight, k5court, k5day, k5counter, k5care2, k5decide, k5climbloop, k5heart (masters/v24.2/make.sh).
#   (k5shopair, k5mall and k5fan are byte copies of chapter 4's and chapter 3's beds and are left as they are.)
# R1-1 · THE BOX. fates3.py: k5boxloop re-cut on the tune's measured phrase (10.054 s, not 10.25) with the take's own
#   continuation for its head; k5lullroom, the room's tune and its run-down in one file (k5boxdown retires with this).
# R1-4 · THE FLAME. synth2.py: k5flameloop, an exactly periodic flame the chapter raises as a bed while it burns (the 2.2 s
#   one-shot k5flame retires with this).
set -e
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, two passes (v24.2's)
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
bed() { # name src target_rms ceiling [high-pass] — looped by hand, levelled by RMS, PADDED (v24.2's and v23.0's bed)
  n=$1; s=$2; t=$3; c=$4; hp=${5:-60}
  ffmpeg -v error -y -i "$s" -af "highpass=f=$hp:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v22.0/cp9/loopfast.py b_hp_$n.wav b_lp_$n.wav 1.5
  python3 ../v21.12/level_rms.py b_lp_$n.wav b_lv_$n.wav $t $c
  python3 padloop.py b_lv_$n.wav b_$n.wav
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (bed, RMS $t, padded)"; rm -f b_hp_$n.wav b_lp_$n.wav b_lv_$n.wav b_$n.wav b_*.f32; }
loop() { # name src filter xf — a music bed looped by hand (loopfast), PADDED, then peak-matched (v24.2's loop)
  n=$1; s=$2; af=$3; xf=$4
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 -ac 2 l_$n.wav; python3 ../v22.0/cp9/loopfast.py l_$n.wav l2_$n.wav $xf
  python3 padloop.py l2_$n.wav l3_$n.wav
  enc $n l3_$n.wav -3.0 -3.0 128k 2; rm -f l_$n.wav l2_$n.wav l3_$n.wav *.f32; }

mkdir -p proc
# ---- R1-1, R1-4: made here (nothing generated)
python3 fates3.py ../v23.0/music/raw/k5lullaby_b.mp3 proc
python3 synth2.py proc
python3 ../v24.2/synth.py proc                      # (k5heart again, exactly as made: the same seed, the same stream)
python3 padloop.py proc/k5boxloop.wav proc/k5boxloop_p.wav
python3 padloop.py proc/k5flameloop.wav proc/k5flameloop_p.wav
python3 padloop.py proc/k5heart.wav proc/k5heart_p.wav
enc k5boxloop   proc/k5boxloop_p.wav   -3.0 -3.0 128k 2
enc k5lullroom  proc/k5lullroom.wav    -3.0 -3.0 128k 2   # (k5lullaby's own level: mus, peak -3, Opus 128k)
enc k5flameloop proc/k5flameloop_p.wav -10 -10 96k 1      # (k5flame's: peak -10, mono)
enc k5heart     proc/k5heart_p.wav     -6 -6 64k 1        # (v24.2's)

# ---- R1-2: v23.0's beds and loops, as masters/v23.0/make.sh made them, padded
bed k5nightbed  ../v23.0/sfx/raw/k5nightbed_r2_b.mp3 -30 -14
bed k5deep      ../v23.0/sfx/raw/k5deep_r2_a.mp3     -34 -14
bed k5dawnbed   ../v23.0/sfx/raw/k5dawnbed_b.mp3     -26 -10
bed k5under     ../v23.0/sfx/raw/k5under_a.mp3       -24 -10
loop k5care     ../v23.0/music/raw/k5care_b.mp3      "anull" 2.0
loop k5night    ../v23.0/music/raw/k5night_b.mp3     "anull" 2.0
# ---- R1-2: v24.3's, as masters/v24.2/make.sh made them, padded
bed k5shopnight   ../v24.2/sfx/raw/k5shopnight_b.mp3   -30 -14 100
bed k5templenight ../v24.2/sfx/raw/k5templenight_b.mp3 -30 -14
bed k5court       ../v24.2/sfx/raw/k5court_a.mp3       -30 -12
bed k5day         ../v24.2/sfx/raw/k5day_a.mp3         -30 -14 100
loop k5counter    ../v24.2/music/raw/k5counter_b.mp3   "atrim=2.0:44.0,asetpts=PTS-STARTPTS,highpass=f=90:poles=2" 2.0
loop k5care2      ../v24.2/music/raw/k5care2_a.mp3     "atrim=0.5:42.0,asetpts=PTS-STARTPTS" 2.0
loop k5decide     ../v24.2/music/raw/k5decide_b.mp3    "atrim=0:36.0,asetpts=PTS-STARTPTS" 2.0
loop k5climbloop  ../v24.2/music/raw/k5climbloop_b.mp3 "atrim=9.5:25.0,asetpts=PTS-STARTPTS" 1.5

# ---- what retires with this (a sound no chapter names falls into the SHARED pack — the v24.3 law)
rm -f ../../assets/audio/k5boxdown.mp3 ../../assets/audio-opus/k5boxdown.ogg ../../assets/audio/k5flame.mp3 ../../assets/audio-opus/k5flame.ogg
rm -rf proc
