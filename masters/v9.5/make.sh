#!/bin/sh
# v9.5 · THE HEADCOUNT AND THE TOGGLE ROPE — episode 2 chapter 1's spiritual
# thread through the day. Chad: "everything in episode 2, despite all these
# new interactions and minigames, should all still link back to spiritual
# stuff. I don't want to veer too far off into a military sim game."
#
# ElevenLabs flow zvRcxDJbxeJDS6aCA903, eleven_v3, two takes of each.
# The pick is MEASURED, not guessed -- there are no ears in a session:
#
#   e1count <- _a   2.57 words/s against 2.40, and 5.06 s of speech against
#                   5.50: the tighter read is the angrier one
#   e1extra <- _b   9.68 s against 10.86 (2.29 w/s against 2.04), and its
#                   0.72 s pause lands at 5.04 -- exactly the "... Never
#                   mind" beat the line is written around
#   e1rope  <- _a   2.98 w/s and -11.9 dBFS RMS against 2.75 and -14.1: the
#                   hotter, faster take, and no stray mid-sentence gap
#   n1rope  <- _a   peak -2.37 against -4.22, and its two pauses (0.56 s and
#                   0.80 s) are the line's own two ellipses; _b's 1.04 s tail
#                   is a hole, not a beat
#   n1one   <- one_b  one clean shout, speech 0.00-0.50. one_a has a 0.48 s
#                   internal gap, which is two utterances, not one
#   c1ten   <- ten_a  speech 0.12-0.46, one short flat word. ten_b has a
#                   0.84 s gap: it says it twice
#   c1two..c1nine   SLICED from two four-word takes (even_a "Two Four Six
#                   Eight" by the buddy's voice, odd_a "Three Five Seven
#                   Nine" by the bunkmate's). Both came back with exactly
#                   three internal silences over 0.2 s, which is four clean
#                   words -- so eight numbers cost two generations instead
#                   of eight, and the count-off keeps a real shouted cadence
#                   rather than eight separately-summoned words.
#
# THE GHOST'S NUMBER is the buddy's voice TREATED, not a new cast member:
# pitched down 10% (asetrate, uncorrected, so it is also 11% slower), a
# hollow double at 60 and 180 ms, and a 3.4 kHz lowpass that takes the
# presence out of it. It has to be recognisably a man in that line and
# unmistakably not one of these men.
#
# Levels: peak-matched to -3.8 dBFS, where the whole episode-2 cast sits
# (e1knock -4.1, e1backbunk -4.0, b1day -3.8, k1three -3.8, n1bedok -3.8,
# s1fallin -3.7). The ghost is deliberately 6 dB under that -- it is the one
# voice nobody is sure they heard.
set -e
peak_to() {
  cur=$(ffmpeg -hide_banner -nostats -i "$1" -af volumedetect -f null /dev/null 2>&1 \
        | grep max_volume | sed 's/.*max_volume: //; s/ dB//')
  python3 -c "print(f'{$2 - ($cur):.2f}')"
}
norm() {   # in.wav out-name target
  ffmpeg -v error -y -i "$1" -af "volume=$(peak_to "$1" "$3")dB" -ar 44100 -ac 1 -f wav "$2.wav"
}

# ---- the four whole lines ------------------------------------------------
for pair in "e1count:e1count_a" "e1extra:e1extra_b" "e1rope:e1rope_a" "n1rope:n1rope_a" "n1one:one_b"; do
  out=${pair%%:*}; src=${pair##*:}
  ffmpeg -v error -y -i "$src.mp3" -ar 44100 -ac 1 -f wav "w_$out.wav"
  norm "w_$out.wav" "$out" -3.8
done

# ---- the count-off, sliced ----------------------------------------------
# The cut points are READ OFF each take's own envelope rather than typed in:
# a hard-coded time is a guess that survives until the file is regenerated.
python3 slice.py

# ---- the ghost's number --------------------------------------------------
ffmpeg -v error -y -i ten_a.mp3 \
  -af "atrim=0.06:0.60,asetpts=N/SR/TB,asetrate=44100*0.90,aresample=44100,highpass=f=120,lowpass=f=3400,aecho=0.8:0.7:60|180:0.35|0.2" \
  -ar 44100 -ac 1 -f wav w_c1ten.wav
norm w_c1ten.wav c1ten -9.8

# ---- both encodings, to the standing contract ---------------------------
for f in e1count e1extra e1rope n1rope n1one c1two c1three c1four c1five c1six c1seven c1eight c1nine c1ten; do
  ffmpeg -v error -y -i $f.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 -ac 1 ../../assets/audio/$f.mp3
  ffmpeg -v error -y -i $f.wav -map_metadata -1 -c:a libopus   -b:a 64k  -ar 48000 -ac 1 ../../assets/audio-opus/$f.ogg
done
# the intermediates go: the shipped mp3/ogg and these source takes are what
# the repo keeps, and re-running this script rebuilds every .wav from them
rm -f w_*.wav *.wav
