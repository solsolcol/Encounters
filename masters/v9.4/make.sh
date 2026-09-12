#!/bin/sh
# v9.4 · the six minigame cues for episode 2 chapter 1.
#
# Chad, of the fear test: "it doesnt have the haptic feedback when the player
# accurately taps at the right time, with crisp sound effects ... If the player
# hits accurately on beat, it should have another effect. Think music game type
# of feel." And of the standby bed: "There should be sound effects and visual
# feedback when matching correctly or incorrectly, respectively."
#
# ElevenLabs flow 8XvYllS6U1pAsL5Yl3cE, eleven_text_to_sound_v2, two takes of
# each. The pick is MEASURED, not guessed -- there are no ears in a session --
# and for a rhythm game the measure that matters is DECAY, not character: at
# the end of the accelerating ladder the beats land 0.40 s apart, so a cue
# that is still ringing when the next beat arrives turns the test to mush.
#
#   beathit     <- beathit_b   take _a is SILENT (peak -61.4 dBFS, unusable).
#                              _b is a TRAIN of ticks, not one; its loudest
#                              tick is at 2.785 s and falls -49 dB within
#                              80 ms, which is the single dry tick asked for.
#   beatperfect <- _b          _a does not decay at all (-3 dB at 0.4 s, a
#                              sustained shimmer); _b is -13 by 0.35 s.
#   beatmiss    <- _b          both are dull thuds; _b decays faster (-16 dB
#                              at 0.25 s against _a's -13) and is 0.87 s of
#                              body against 1.44.
#   matchok     <- _b          both latch cleanly in 0.37 s; _b's transient
#                              is 1.2 dB hotter and its file is half as long.
#   matchbad    <- _a          BOTH takes are a flat sustained buzz with no
#                              decay, so both must be cut; _a is 0.5 dB less
#                              hot and marginally less flat.
#   matchdone   <- _b          _a's chime is still at -9 dB after a second;
#                              _b resolves to -23 dB, which is a flourish
#                              that ENDS rather than one that is faded out.
#
# EVERY cue is cut from 20 ms before its own peak, so the transient is the
# first thing the ear gets -- a UI sound whose attack is 100 ms in reads as
# late no matter how short the file is. Then peak-matched to -2.0 dBFS, which
# is where v8.8 put the four HUD cues (hudok -1.4, hudlock -1.6, hudnext -2.0,
# hudfail -2.4) that these play beside.
set -e
peak_to() {
  cur=$(ffmpeg -hide_banner -nostats -i "$1" -af volumedetect -f null /dev/null 2>&1 \
        | grep max_volume | sed 's/.*max_volume: //; s/ dB//')
  python3 -c "print(f'{$2 - ($cur):.2f}')"
}
cut() {  # name source start length fade
  ffmpeg -v error -y -ss "$3" -t "$4" -i "$2" \
    -af "afade=t=out:st=$(python3 -c "print(f'{$4 - $5:.4f}')"):d=$5" \
    -ar 44100 -ac 2 -f wav "w_$1.wav"
  ffmpeg -v error -y -i "w_$1.wav" -af "volume=$(peak_to w_$1.wav -2.0)dB" \
    -ar 44100 -ac 2 -f wav "$1.wav"
}

cut beathit     beathit_b.mp3     2.765 0.16 0.05
cut beatperfect beatperfect_b.mp3 0.000 0.60 0.22
cut beatmiss    beatmiss_b.mp3    0.000 0.45 0.16
cut matchok     matchok_b.mp3     0.168 0.42 0.14
cut matchbad    matchbad_a.mp3    0.087 0.32 0.10
cut matchdone   matchdone_b.mp3   0.052 1.10 0.30

# both encodings, to the standing contract
for f in beathit beatperfect beatmiss matchok matchbad matchdone; do
  ffmpeg -v error -y -i $f.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 ../../assets/audio/$f.mp3
  ffmpeg -v error -y -i $f.wav -map_metadata -1 -c:a libopus   -b:a 96k  -ar 48000 -ac 2 ../../assets/audio-opus/$f.ogg
done
rm -f w_*.wav *_cut.wav *_norm.wav
