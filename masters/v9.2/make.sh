#!/bin/sh
# v9.2 · the three ambience sounds for episode 2 chapter 1.
# Chad: "Add more ambient music and sound effects throughout this entire
# ep2 chp1 chapter. Maybe ambient sound effects are other platoons marching
# outside."
#
# ElevenLabs flow Qa5DO5sUaMlbpNPyD5E8. Two takes of each were generated and
# the pick was MEASURED, not guessed — there are no ears in a session:
#
#   platoonmarch <- march2  cadence autocorrelation 0.881 against march1's
#                           0.602, and the take has the SHAPE of a pass-by
#                           (1 s RMS: -63 -> -32 at six seconds -> -71)
#   campamb      <- camp1   camp2 is 84.4% of its energy under 120 Hz, which
#                           is rumble, not a treeline; camp1 is 62.5/15.6/20.4
#   e2day        <- day1    day2 puts 86% of its energy in 120-500 Hz, which
#                           is exactly where his voice lives (the v5.27
#                           masking reasoning); day1 keeps it under 120
#
# NOTE the two model parameters that matter and are NOT prose: asking for
# "14 seconds" in the prompt gets a 1.04 s clip. duration_seconds and loop
# are real fields on eleven_text_to_sound_v2 and must be passed as
# model_parameters. eleven_music_v2 has no loop flag at all, which is why
# e2day is crossfade-looped by hand below.
set -e
peak_to() {  # file target_dBFS -> the gain that lands its peak there
  cur=$(ffmpeg -hide_banner -nostats -i "$1" -af volumedetect -f null /dev/null 2>&1 \
        | grep max_volume | sed 's/.*max_volume: //; s/ dB//')
  python3 -c "print(f'{$2 - ($cur):.2f}')"
}

# platoonmarch — 16 s, peak -10.0 to sit with bootsmarch (-9.4)
ffmpeg -v error -y -i march2.mp3 -af "highpass=f=55,afade=t=in:st=0:d=0.20,afade=t=out:st=15.74:d=0.30" -ar 44100 -ac 2 -f wav w_platoon.wav
ffmpeg -v error -y -i w_platoon.wav -af "volume=$(peak_to w_platoon.wav -10.0)dB" -ar 44100 -ac 2 -f wav platoonmarch.wav

# campamb — generated seamless (loop:true), rumble cleared, peak -13.0 to sit with bunkday (-12.6)
ffmpeg -v error -y -i camp1.mp3 -af "highpass=f=90" -ar 44100 -ac 2 -f wav w_camp.wav
ffmpeg -v error -y -i w_camp.wav -af "volume=$(peak_to w_camp.wav -13.0)dB" -ar 44100 -ac 2 -f wav campamb.wav

# e2day — the body only (its level settles from 18 s), then crossfade-looped:
# acrossfade(S[4:27], S[0:4], d=4) ends where it began, so it wraps with no
# seam. Peak -10.4 to match e2bed, the night bed it crosses with.
ffmpeg -v error -y -i day1.mp3 -ss 18.0 -to 45.0 -ar 44100 -ac 2 -f wav w_body.wav
ffmpeg -v error -y -i w_body.wav -ss 4.0       -ar 44100 -ac 2 -f wav w_A.wav
ffmpeg -v error -y -i w_body.wav -ss 0 -to 4.0 -ar 44100 -ac 2 -f wav w_B.wav
ffmpeg -v error -y -i w_A.wav -i w_B.wav -filter_complex "[0][1]acrossfade=d=4:c1=tri:c2=tri" -ar 44100 -ac 2 -f wav w_day.wav
ffmpeg -v error -y -i w_day.wav -af "volume=$(peak_to w_day.wav -10.4)dB" -ar 44100 -ac 2 -f wav e2day.wav

# both encodings, to the standing contract
for f in platoonmarch campamb e2day; do
  ffmpeg -v error -y -i $f.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 ../../assets/audio/$f.mp3
  ffmpeg -v error -y -i $f.wav -map_metadata -1 -c:a libopus   -b:a 96k  -ar 48000 -ac 2 ../../assets/audio-opus/$f.ogg
done
rm -f w_*.wav
