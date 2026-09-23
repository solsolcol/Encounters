#!/bin/sh
# v14.5 · e5march — the episode's own opening march (v10.4 master march-1) as a
# seamless 32 s loop, for episode 2 chapter 5's apron. Chosen over e2day
# (65 % of its energy under 120 Hz — a phone plays almost none of it, the
# v10.4 lesson) and over e5theme (the episode's closing theme, which the four
# endings bring in and must not be spent in play). Peak -9.0, the level the
# march already ships at.
set -e
cd "$(dirname "$0")"
python3 loop.py
ffmpeg -v error -y -f f32le -ar 44100 -ac 2 -i e5march.f32 w_loop.wav
rm -f e5march.f32
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
n=e5march; tm=-9.0; to=-9.0
ffmpeg -v error -y -i w_loop.wav -ar 48000 -ac 2 w_$n.wav
p=$(peak w_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
for pass in 1 2; do
  ffmpeg -v error -y -i w_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i w_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$n.ogg
  pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
  gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
done
echo "$n  mp3 $pm  ogg $po  (want $tm / $to)"
rm -f w_$n.wav w_loop.wav
