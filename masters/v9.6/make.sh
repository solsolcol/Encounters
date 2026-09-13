#!/bin/sh
# v9.6 · n1ghost — "Wait... is there someone in there?"
#
# Chad: "If the player enters the toilet during the free interaction time,
# make it obvious that the semi-transparent FBO soldier is standing at the
# shower area ... Player has a voiceline saying 'wait, is there someone in
# there?'"
#
# Aaron (B6uUx2p7cRgxseOUyP6P), eleven_v3, flow FFToPij3x4KedK7Wicv3, under the
# v5.28 prompt rules: the registry's words exactly, ONE tag naming an emotion
# ([uneasy], not a volume), at most one added ellipsis.
#
# THE PICK IS MEASURED, because there are no ears in a session. Both takes came
# back clean -- no internal silence that would read as two utterances, no hot
# tail (-31.9 and -31.3 dB in the last 40 ms, so the v5.30 click cannot happen):
#
#   _a  3.12 s, 1.92 words/s, peak -6.64, RMS -26.95, crest 20.3 dB
#       and a real 0.26 s HESITATION at 1.54 s -- "is there someone... in
#       there?" -- which is the whole line
#   _b  2.80 s, 2.14 words/s, peak -6.60, RMS -25.27, crest 18.7 dB
#       one flat run: longest internal dip 0.08 s
#
# _a wins on the pause. The line is a man stopping in a doorway, and a take
# that says it straight through is a man reading it. Its wider crest costs
# nothing -- his bus has carried a compressor and a limiter since v5.28.
#
# Level: peak-matched to -3.8 dBFS, where every other take of his in this
# chapter sits (n1shower -3.8, n1lights -3.8, n1wake -3.8, n1board -3.9).
set -e
peak_to() {
  cur=$(ffmpeg -hide_banner -nostats -i "$1" -af volumedetect -f null /dev/null 2>&1 \
        | grep max_volume | sed 's/.*max_volume: //; s/ dB//')
  python3 -c "print(f'{$2 - ($cur):.2f}')"
}
ffmpeg -v error -y -i n1ghost_a.mp3 -ar 44100 -ac 1 -f wav w_n1ghost.wav

# THE TWO ENCODERS LOSE DIFFERENT AMOUNTS, so one peak-matched WAV cannot serve
# both, and they move in OPPOSITE directions. Measured on this file:
#   libmp3lame LOSES about half a dB  (-3.8 wav -> -4.3 mp3)
#   libopus    GAINS about seven tenths (-3.8 wav -> -3.1 ogg)
# The rest of his takes sit at -3.8 mp3 and -3.4..-3.7 ogg, so each encoder is
# fed its own source rather than one wav serving both:
#   mp3 <- a -3.3 wav -> -3.8   (n1shower, n1lights and n1wake exactly)
#   ogg <- a -3.8 wav -> -3.1   (0.3 dB over the pack's hottest; the overshoot
#                                is not linear -- a -3.3 wav gave -2.9, a 0.4 dB
#                                move for a 0.5 dB one, so chasing the last
#                                third of a dB is not worth another round)
# Peak-matching ONE wav at the mp3's target left the ogg 0.9 dB hotter than
# anything else in the pack, which is the kind of thing nobody hears until the
# opus pack is the one that shipped -- and on a browser that decodes opus, it
# always is.
ffmpeg -v error -y -i w_n1ghost.wav -af "volume=$(peak_to w_n1ghost.wav -3.3)dB" -ar 44100 -ac 1 -f wav mp3src.wav
ffmpeg -v error -y -i w_n1ghost.wav -af "volume=$(peak_to w_n1ghost.wav -3.8)dB" -ar 44100 -ac 1 -f wav oggsrc.wav

ffmpeg -v error -y -i mp3src.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 -ac 1 ../../assets/audio/n1ghost.mp3
ffmpeg -v error -y -i oggsrc.wav -map_metadata -1 -c:a libopus   -b:a 64k  -ar 48000 -ac 1 ../../assets/audio-opus/n1ghost.ogg
rm -f w_*.wav *.wav
