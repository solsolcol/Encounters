#!/bin/sh
# v10.0 · EPISODE 2 · CHAPTER 2 · NOBODY THERE — the voice lines.
# ElevenLabs flow k97pD34H9DnPMOquIIJi, eleven_v3, two takes per line; the
# takes are the *_a/*_b files here and urls.txt says where each came from.
#
# THE PICK IS MEASURED (there are no ears in a session): every take was read
# for length, words per second, the level of its last 40 ms (a hot tail is the
# v5.30 click), and its longest internal silence. Preference: a clean tail,
# a pace near the game's 2.3 words/s median, and a pause where the line's own
# punctuation asks for one.
#   n2pro   b  slower (2.38 w/s), tail -44.5      n2askA  b  1.99 w/s, tail -43.9
#   n2askB  a  tail -36 against -30               n2askC  a  tail -35 against -20 (hot)
#   n2askD  b  tail -31 against -25               n2nobut a  the 0.58 s catch on "but—"
#   n2B1    b  slower, both takes are [quiet]     n2C1    b  tail -46
#   n2A     b                                     n2B     b  a's 1.0 s gap reads as two lines
#   n2C     a  tail -47                           n2D     a  2.13 w/s, the pause before "The rule"
#   e2A     b  tail -35, 2.42 w/s                 e2saw   b  the catch in "You... saw?"
#   e2cock  b  a peaks at +0.03 (clipped)         e2ok    a  tail -40 against -24
#   e2D1    a                                     e2D2    a  the pause before "mind your own"
#   b2hear  a  2.14 w/s, the pause after "heard it?"   k2three a  the slower of two fast reads
#   r2siao  b  tail -43 against -26
#
# LEVELS are matched to the SHIPPED PEERS on the same instrument (peak.py, a
# 48 kHz stereo decode): every jamesTeen/buddy/bunkmate mp3 in the chapter
# before this one reads -6.85, the encik's -7.15; the ogg peers -6.6. Each
# encoder gets its own source and the delta is PER FILE (v9.7), so the script
# encodes, measures, and corrects once.
set -e
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name take target_mp3 target_ogg
  n=$1; src=${n}_$2.mp3; tm=$3; to=$4
  ffmpeg -v error -y -i "$src" -ar 48000 -ac 1 w_$n.wav
  p=$(peak w_$n.wav)
  gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i w_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i w_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a 64k  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $2  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f w_$n.wav
}
V=-6.85; O=-6.6; E=-7.15
enc n2pro   b $V $O;  enc n2askA b $V $O;  enc n2askB a $V $O;  enc n2askC a $V $O
enc n2askD  b $V $O;  enc n2nobut a $V $O; enc n2B1   b $V $O;  enc n2C1   b $V $O
enc n2A     b $V $O;  enc n2B    b $V $O;  enc n2C    a $V $O;  enc n2D    a $V $O
enc e2A     b $E $O;  enc e2saw  b $E $O;  enc e2cock b $E $O;  enc e2ok   a $E $O
enc e2D1    a $E $O;  enc e2D2   a $E $O
enc b2hear  a $V $O;  enc k2three a $V $O; enc r2siao b $V $O

# ---- cookamb · the cookhouse room tone ------------------------------------
# Two 22 s takes with duration_seconds 22 and loop true (v9.2's law: the
# duration is a PARAMETER, never a sentence — the first pass asked in prose and
# got 2 s). Picked by measurement: cook1 peaks at +2.4 dBFS and its one-second
# RMS swings 27 dB (-46 to -19) — one clatter, not a room; cook2 swings 14 dB
# and holds 54 % of its energy in 500-3 kHz, which is cutlery on trays. Its
# 28.6 % in 120-500 Hz is the masking cost, paid at 0.30 of the bed level.
# Peak-matched to campamb (-13.2 on peak.py), the loop it takes over from.
ffmpeg -v error -y -i cook2.mp3 -af "highpass=f=70" -ar 48000 -ac 2 w_cook.wav
pc=$(peak w_cook.wav)
gm=$(python3 -c "print(f'{-13.2-($pc):.2f}')"); go=$gm
for pass in 1 2; do
  ffmpeg -v error -y -i w_cook.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/cookamb.mp3
  ffmpeg -v error -y -i w_cook.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a 96k  -ar 48000 ../../assets/audio-opus/cookamb.ogg
  pm=$(peak ../../assets/audio/cookamb.mp3); po=$(peak ../../assets/audio-opus/cookamb.ogg)
  gm=$(python3 -c "print(f'{$gm+(-13.2-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+(-13.2-($po)):.2f}')")
done
echo "cookamb <- cook2  mp3 $pm  ogg $po  (want -13.2)"
rm -f w_cook.wav
