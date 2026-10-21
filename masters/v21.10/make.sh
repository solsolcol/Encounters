#!/bin/sh
# v21.10 · the masters' gallery — five effects and a bed (flow o5Uc3nZjy2Iqe3UHGRbO,
# sessions.json: name -> its four takes). PICKED BY MEASUREMENT (measure.py,
# shape.py, ../v10.4/scary.py; no ears here). Chad's ear may swap any of them
# (the v10.6 rule): the previews go to him.
#
#   galopen  the window opening. Round one (four takes) came back as a high
#            sparkle and nothing else — 99.7 % of the energy over 3 kHz, the
#            strongest partials at 6-9 kHz, no bell — so round two asked for the
#            bell as the main sound. PICK galopen2_a: a real bell's spread of
#            partials (660, 878, 1572, 1978, 2640 Hz within 9 dB of each other;
#            b is one partial at 660, d one at 1040 — tuning forks), 98 % in the
#            band a phone plays, clean at both ends (-26 / -78 dB). Round one's
#            galopen_a (the cleanest of its sparkles, tail -67 dB) is laid 12 dB
#            under it, 60 ms behind: the shimmer the prompt asked for, as a layer.
#   galflip  a page turning. PICK a — the only take with a PAGE in it (73.8 % in
#            500 Hz-3 kHz; b and c are 99.8 % over 3 kHz, a chime alone), the
#            rustle at 0.1 s then the chime at 0.3-0.55 s, clean ends (-43 / -73)
#   galread  the tick as a page counts read. PICK c — one ping at 6.9 kHz, a 1.5 ms
#            attack and a smooth decay (d is a held 2.5 kHz tone cut off 22 dB in
#            50 ms; b is 30 dB quieter than the rest; a has a pre-click)
#   galdone  every page read. PICK a — the shape asked for: notes climbing 260 ->
#            340 -> 390 -> 680 Hz, a bell at 1570 Hz at 1.0 s, then the decay;
#            73 % in 500 Hz-3 kHz (c sits 62 % in 120-500 Hz, under what a phone
#            plays), tail -74 dB
#   galclose the window closing. PICK b — the cleanest ends of the four (-31 / -79),
#            a 52 ms attack and one smooth settle (a and c start on signal)
#   galbed   the bed while it is open (eleven_music_v2, instrumental, 75 s, four
#            takes). PICK b — 88 % of its energy in 500 Hz-3 kHz (c and d sit half
#            in 120-500 Hz, d 19 % under 120 Hz), and its 24-60 s the evenest
#            stretch of any take but d (1 s RMS std 2.3 dB, -29.6 to -19.0); cut
#            there, its last 3 s crossfaded over its head (the swells kept): 33 s
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
trim() { python3 ../v21.0/proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
fx() { # name raw start end fade target
  trim "$2" w_$1.wav $3 $4 $5; enc $1 w_$1.wav $6 $6 96k 2; rm -f w_$1.wav w_$1.wav.f32; }

python3 mix.py raw/galopen2_a.mp3 raw/galopen_a.mp3 m_galopen.wav -12 0.06 >/dev/null
fx galopen  m_galopen.wav       0.00 3.00 0.30 -4.0;  rm -f m_galopen.wav m_galopen.wav.f32
fx galflip  raw/galflip_a.mp3   0.00 1.20 0.15 -6.0
fx galread  raw/galread_c.mp3   0.00 0.80 0.10 -8.0
fx galdone  raw/galdone_a.mp3   0.00 3.48 0.30 -3.0
fx galclose raw/galclose_b.mp3  0.00 1.60 0.20 -6.0
python3 ../v21.0/proc.py trim  raw/galbed_b.mp3 w_bed0.wav 24 60 0 >/dev/null
python3 ../v21.0/proc.py xloop w_bed0.wav w_bed.wav 3
enc galbed w_bed.wav -6.0 -6.0 96k 2
rm -f w_bed0.wav w_bed0.wav.f32 w_bed.wav w_bed.wav.f32
