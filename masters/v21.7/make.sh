#!/bin/sh
# v21.7 · two new lines in episode 3 chapter 3's opening film, both chosen by
# Chad: the first he picked from three proposals, the second is his own words
# ("use 'I only meant to stay for the chanting....but something else
# happened....'" — his dots kept as ellipses).
#   z3pro0  at the very start, over Golden Mile Complex:
#           "[reflective] Back home, the closest thing to Thailand was Golden Mile Complex."
#   z3pro5  after "...I went to pay my respects.", over the shop's interior:
#           "[uneasy] I only meant to stay for the chanting... but something else happened..."
# Brian (bP8FJDHmWVEgXJDitdQd), eleven_v3 like every film line of his, four
# takes each on the e3c3 voices flow (sessions.json). measure.py / pauses.py:
#   z3pro0_a 4.00 s  ends ON signal (-25.3 dB in its last 60 ms)
#   z3pro0_b 4.24 s  PICKED: the only clean END of the four (-39.5 dB), one
#                    unbroken phrase, 3.96 s of speech
#   z3pro0_c 3.92 s, z3pro0_d 3.84 s  end ON signal (-19.1 / -18.7 dB)
#   z3pro5_a 4.80 s  PICKED: the cleanest end (-40.6) and head (-59.0), the
#                    ellipsis as a 1.08 s pause between the two phrases
#   z3pro5_b 4.72 s  a 1.46 s hole, 47 % of its energy under 120 Hz
#   z3pro5_c 4.96 s  a 1.32 s hole; end -35.0
#   z3pro5_d 4.32 s  STARTS on signal (head -37.0 dB, no lead), the quickest
# The v21.0 chain for him: high-pass 70 Hz, mono, peak-matched twice to
# -6.85 dBFS mp3 / -6.6 ogg (masters/v21.0/make.sh).
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
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav $V $O 64k 1; rm -f h_$n.wav p_$n.wav; }
V=-6.85; O=-6.6
him z3pro0 raw/z3pro0_b.mp3
him z3pro5 raw/z3pro5_a.mp3
