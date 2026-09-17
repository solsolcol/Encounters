#!/bin/sh
# v12.1 · EPISODE 2 · CHAPTER 4 · THE CYCLIST — the recipe.
# 29 lines in six voices and 13 sounds, two takes each, picked by measurement
# (measure.json). THE TOWER is a new speaker (George, JKX4knVxHRiP0doaLdrj) —
# the range officer on the PA and on the radio.
#
# The picks, and why:
#   voice — the cleaner EDGES (a take that ends on signal clicks through the
#   v5.30 envelope), then the pace the line wants: the range orders crisp
#   (t4load_b at 1.74 words a second against a's 1.54), the frightened lines
#   SLOW (n4back_a 2.08 against b's 2.52; n4notarget_a 2.86 against 4.10),
#   n4C_b and n4D_a the slower reads of two regretful lines.
#   sound — the four BEDS by evenness (rangeamb_a swing 5.3 dB, moverrail_a
#   16.2 against b's 33.9) and the one-shots by what a PHONE can play
#   (flarepop_b puts 12 % under 120 Hz against a's 33 %, so its thump is in
#   the band the speaker carries — the v10.4 measure).
#
# THE DURATION IS A PARAMETER (the v9.2 law, walked into again): every one
# of the first four bed takes came back one or two seconds long, because
# "12 seconds" was only written in English. `duration_seconds` and `loop`
# are model parameters and the beds were re-generated with them.
# targethit's first take is SILENT (peak −47.1 dBFS) — a take is measured,
# never assumed.
#
# Levels: Aaron peak −6.85 mp3 / −6.6 ogg (his bus has the compressor and
# the limiter in front of it); THE CAST BY RMS to −16 dBFS through
# ../v11.1/level.py, because the cast bus is FLAT (the v11.1 finding);
# effects −4.0 and beds −10.5, where the game's already sit.
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
cast() { # name src — levelled by RMS for the FLAT cast bus, then encoded plainly
  n=$1; src=$2
  python3 ../v11.1/level.py "$src" w_$n.wav -16
  ffmpeg -v error -y -i w_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i w_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  rm -f w_$n.wav w_$n.wav.f32
}
V=-6.85; O=-6.6; E=-4.0; B=-10.5

# --- Aaron: the film's two lines, the radio report, the two on the line,
#     the four card lines and the dawn
enc n4pro1     raw/n4pro1_a.mp3     $V $O 64k 1
enc n4pro2     raw/n4pro2_b.mp3     $V $O 64k 1
enc n4report   raw/n4report_b.mp3   $V $O 64k 1
enc n4notarget raw/n4notarget_a.mp3 $V $O 64k 1
enc n4back     raw/n4back_a.mp3     $V $O 64k 1
enc n4dawn     raw/n4dawn_a.mp3     $V $O 64k 1
enc n4A raw/n4A_a.mp3 $V $O 64k 1;  enc n4B raw/n4B_a.mp3 $V $O 64k 1
enc n4C raw/n4C_b.mp3 $V $O 64k 1;  enc n4D raw/n4D_a.mp3 $V $O 64k 1

# --- the tower (George), the safety officer (Hilmi, under the bark rule),
#     the buddy on lane five (David), and the two off the other detail
cast t4load   raw/t4load_b.mp3;   cast t4ready  raw/t4ready_b.mp3
cast t4fire1  raw/t4fire1_b.mp3;  cast t4fire2  raw/t4fire2_b.mp3
cast t4fire3  raw/t4fire3_a.mp3;  cast t4cease  raw/t4cease_a.mp3
cast t4who    raw/t4who_a.mp3;    cast t4neg    raw/t4neg_b.mp3
cast t4roger  raw/t4roger_b.mp3;  cast t4endex  raw/t4endex_b.mp3
cast t4man    raw/t4man_a.mp3
cast e4wait   raw/e4wait_b.mp3;   cast e4down   raw/e4down_a.mp3
cast e4line   raw/e4line_a.mp3
cast b4stag   raw/b4stag_b.mp3;   cast b4there  raw/b4there_b.mp3
cast b4float  raw/b4float_b.mp3
cast k4shout  raw/k4shout_b.mp3;  cast r4run    raw/r4run_b.mp3

# --- the range's noises. The four beds are the flattened, crossfaded loops
#     (proc.py); the one-shots are cut to their useful part.
enc rangeamb    w_rangeamb.wav    $B $B 96k 2
enc chain       w_chain.wav       $B $B 96k 2
enc flarehiss   w_flarehiss.wav   $B $B 96k 2
enc moverrail   w_moverrail.wav   $B $B 96k 2
enc rifleshot   w_rifleshot.wav   $E $E 96k 2
enc riflecock   w_riflecock.wav   $E $E 96k 2
enc riflereload w_riflereload.wav $E $E 96k 2
enc rifledry    w_rifledry.wav    $E $E 96k 2
enc flarepop    w_flarepop.wav    $E $E 96k 2
enc rangepa     w_rangepa.wav     -8.0 -8.0 96k 2
enc targethit   w_targethit.wav   $E $E 96k 2
enc targetfall  w_targetfall.wav  $E $E 96k 2
enc bikebell    w_bikebell.wav    $E $E 96k 2
