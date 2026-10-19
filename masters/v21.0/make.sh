#!/bin/sh
# v21.0 · episode 3 chapter 3, The Dance On Buddha Day — the VOICES.
# The script is lines.json (64 lines, nine speakers); sessions.json maps each
# line to its two takes (flow URTG1KypweSna9iSGuca, eleven_v3, the words
# exactly, tags included). meas.txt (measure.py) and pauses.txt (pauses.py)
# are what the picks were made from: a clean END first (a take that ends ON
# signal clicks; anything above about -30 dB in its last 60 ms is faded over
# its last 0.12 s here), then no odd hole or trailing silence, then the
# tighter read — except where the line wants its pause (md3A1's beat between
# "Kneel." and "Close your eyes."; the breaths of z3breath).
# HIM: Brian, the v16.0/v18.6 chain (high-pass 70 Hz, mono, peak-matched
# twice to -6.85 mp3 / -6.6 ogg). THE CAST: levelled by RMS to -16 dBFS for
# the flat cast bus (v11.1), mp3 128k + opus 64k.
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
# him NAME SRC [prep options]
him() { n=$1; s=$2; shift 2; python3 prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav $V $O 64k 1; rm -f h_$n.wav p_$n.wav; }
# cast NAME SRC [prep options]
cast() { n=$1; s=$2; shift 2; python3 prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
V=-6.85; O=-6.6
F="--fade 0.12"
# --- him: the film
him z3pro1 raw/z3pro1_a.mp3;            him z3pro2 raw/z3pro2_a.mp3
him z3pro3 raw/z3pro3_b.mp3 --keep 3.95; him z3pro4 raw/z3pro4_a.mp3 $F
# --- him: the shop
him z3look1 raw/z3look1_b.mp3;          him z3look2 raw/z3look2_a.mp3
him z3look3 raw/z3look3_a.mp3 $F;       him z3look4 raw/z3look4_a.mp3
him z3thanks raw/z3thanks_b.mp3 $F;     him z3shift1 raw/z3shift1_a.mp3
him z3shift2 raw/z3shift2_a.mp3
# --- him: the trance, the shrine
him z3breath raw/z3breath_a.mp3;        him z3knew raw/z3knew_b.mp3 $F
him z3night raw/z3night_a.mp3;          him z3shrine raw/z3shrine_a.mp3 --head 0.06
him z3walk raw/z3walk_b.mp3 $F
# --- him: the endings
him z3A1 raw/z3A1_a.mp3 $F;             him z3A2 raw/z3A2_b.mp3 $F
him z3B1 raw/z3B1_b.mp3 $F;             him z3B2 raw/z3B2_b.mp3
him z3thank raw/z3thank_b.mp3;          him z3C2 raw/z3C2_a.mp3
him z3D2 raw/z3D2_b.mp3 $F;             him z3D3 raw/z3D3_a.mp3 $F
him z3close raw/z3close_b.mp3;          him z3next raw/z3next_a.mp3
him z3A raw/z3A_b.mp3 $F;               him z3B raw/z3B_a.mp3
him z3C raw/z3C_b.mp3;                  him z3D raw/z3D_b.mp3
# --- the owner (Brendon)
cast ow3hello raw/ow3hello_a.mp3;       cast ow3call raw/ow3call_a.mp3
cast ow3gift1 raw/ow3gift1_a.mp3 $F;    cast ow3gift2 raw/ow3gift2_b.mp3
cast ow3good raw/ow3good_b.mp3;         cast ow3namo raw/ow3namo_a.mp3
cast ow3eh raw/ow3eh_b.mp3;             cast ow3let raw/ow3let_b.mp3
cast ow3know raw/ow3know_a.mp3 $F;      cast ow3medium raw/ow3medium_a.mp3
# --- the shop's people
cast sm3hold raw/sm3hold_a.mp3 $F;      cast sm3cannot raw/sm3cannot_a.mp3
cast st3uncle raw/st3uncle_b.mp3 $F;    cast st3trance raw/st3trance_a.mp3
cast cu3amitabha raw/cu3amitabha_a.mp3; cast cu3unclean raw/cu3unclean_b.mp3
# --- the shrine (Roger the medium, Kopi Gao the assistant, Jane, Roy)
cast md3read1 raw/md3read1_b.mp3;       cast md3drink raw/md3drink_a.mp3
cast md3read2 raw/md3read2_a.mp3 --keep 3.90; cast md3done raw/md3done_b.mp3
cast md3ghost raw/md3ghost_b.mp3;       cast md3chant raw/md3chant_b.mp3 --keep 4.10
cast md3A1 raw/md3A1_a.mp3 $F;          cast md3A2 raw/md3A2_a.mp3
cast md3B1 raw/md3B1_a.mp3 --keep 1.30; cast md3C raw/md3C_a.mp3
cast md3D raw/md3D_b.mp3 --keep 1.20
cast as3sit raw/as3sit_a.mp3;           cast as3next raw/as3next_b.mp3
cast as3back raw/as3back_b.mp3;         cast as3A raw/as3A_b.mp3
cast as3B raw/as3B_a.mp3
cast dv3wife raw/dv3wife_a.mp3;         cast dv3father raw/dv3father_a.mp3
