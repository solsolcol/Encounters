#!/bin/sh
# v10.5 · Chad on v10.4: "The new eerie music is bad, i prefer the older one unless
# you can generate something scarier. Also the ghost soldier laughing sound is too
# old and not eerie enough. It should sound like a young man."
# ghostlaugh <- laugh-3: median f0 272 Hz against the v10.4 take's 206 (a younger
# voice laughs higher), centroid 2016 Hz against 1382, and the only take with energy
# above 3 kHz (8 %) — the breath in a giggle. laugh-4 (f0 345) puts 86 % of its energy
# in 120-500 Hz: a muffled hum, not a laugh.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch w_$n.wav
  p=$(peak w_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i w_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i w_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f w_$n.wav
}
# enc ghostlaugh raw/laugh-3.mp3 -4.0 -4.0 64k 1   # done (mp3 -4.10, ogg -4.12)
# e2dread <- scary-1, window 165-227 s (mk.py): the one take of four with a steady
# passage in the register a phone can carry — 67 % of its energy above 120 Hz, 44 %
# in 500-3 kHz and 10 % above 3 kHz, centroid 2.8 kHz (the shrieking strings and
# scrapes), and only 13 % in 120-500 Hz, where his voice lives. scary-2 was the
# runner-up (28 % in 500-3k, but it swells 13.6 dB inside any loopable window);
# scary-3/4 (the "SEA ghost film" prompt) came out as sub-500 Hz drones with
# literal silences — centroid 216-303 Hz, 1 % above 3 kHz — the v9.7 bed again.
enc e2dread w_loop.wav -6.0 -6.0 96k 2
