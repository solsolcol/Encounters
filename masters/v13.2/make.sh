# v13.2 · five new takes for episode 2 chapter 4's rebuilt outcome scenes.
#
# Picked by MEASUREMENT (measure.py, the table in the doc):
#   n4draw  a — 5.12 s, the shorter read, head 12 dB under its own peak
#               (b starts ON signal at −7.6, which is the v5.30 chuff)
#   e4back  b — a peaks at +0.05 dBFS and CLIPS; b is −0.31 with a tail
#               30 dB down instead of 13
#   n4gasp  c — 1.04 s with half a second of air after it: a gasp IS short,
#               and this one ends in silence where a and b end on signal
#   n4runD  b — tail −35.3 against a's −10.8 (a ends mid-word)
#   n4pant  b — 3.12 s, the cleanest head of the three (−32.6)
#
# Levels, unchanged from v12.1: Aaron peak −6.85 mp3 / −6.6 ogg (his bus
# carries the compressor and the limiter); the encik BY RMS to −16 dBFS
# through ../v11.1/level.py, because the cast bus is FLAT (v11.1).
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
V=-6.85; O=-6.6

enc n4draw raw/n4draw-a.mp3 $V $O 64k 1
enc n4gasp raw/n4gasp-c.mp3 $V $O 64k 1
enc n4runD raw/n4runD-b.mp3 $V $O 64k 1
enc n4pant raw/n4pant-b.mp3 $V $O 64k 1
cast e4back raw/e4back-b.mp3
echo "e4back <- raw/e4back-b.mp3  (RMS −16 dBFS, the flat cast bus)"
for n in n4draw n4gasp n4runD n4pant e4back; do
  printf '%-8s %s s\n' "$n" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 ../../assets/audio/$n.mp3)"
done
