#!/bin/sh
# v22.0 CP9 · EPISODE 3 CHAPTER 4 — the four endings' sound (docs/V22.0-E3C4-PLAN.md §4.6, §7).
# On the e3c4 CP9 flow BdLI0pZ20fesTrxCy0cW (sessions.json): effects eleven_text_to_sound_v2 (duration as a PARAMETER,
# the v9.2 law), three takes asked of each; the closing music eleven_music_v2, four asked. THE WORKSPACE RAN OUT OF
# CREDITS mid-run (23 Oct: "exceeds your quota ... 7 credits remaining"), so x4fall b, x4bag b, x4pen c and two of the
# four closing takes never came back; every name below still has two or three takes to choose from.
# Measured with ../cp5/meas.py (bands, head and tail, holes) and a 0.2 s loudness envelope (the SHAPE a prompt asked for).
#
# ONE-SHOTS (peak-matched to -6 dBFS; the scene sets each one's level)
#   x4whispers b  the swirl the prompt asked for: rises from -51 to -27 dB by 3.6 s, holds, recedes from 5.8 s (c is
#                 erratic, a never rises past -31); 97 % above 3 kHz — a whisper is the band a phone plays best
#   x4fall     c  four hits in a second (the stool, the body, the cup) where a has three in 0.6 s; 14 % above 3 kHz (the shatter)
#   x4glass    b  the pour (-35 to -48 dB over two seconds) and the glass set down at 3.0 s; a is 5 dB quieter, c a thud
#   x4bag      a  two crisp rustles (in, and folded over), 47 % above 3 kHz against c's 19
#   x4drawer   a  the drawer's bang with the most body (71 % at 120-500 Hz); b is 9 dB down, c 43 % rumble
#   x4pen      a  writing for 0.8 s, then the card slid at 2.0 s; b is scattered scratches 10 dB down
#   x4flicker  b  the buzz and the stutter, on at 0.15 s, steady by 2.7 (a is near silent at -59 dB RMS)
#   x4wrong    c  the reversed scream: the longest clean rise (-60 to -3 dB over 2 s) and the hardest cut, then silence
# LIFTED (phone2.py — every take of these came back 61-99 % under 120 Hz: on a phone, nothing)
#   x4rush     c  the swell that ends abruptly (c rises -25 -> -2 dB and falls in 0.6 s; b only decays) — the most body
#                 already (26 % at 120-500 Hz)
#   x4wake     c  coming round: a FLAT take (every one of three is level end to end), so the shape is made here — muffled
#                 at first and clearing over 3.2 s, with a ring in the ears that starts at full and dies away
# BEDS (looped, levelled by RMS — ../../v21.12/level_rms.py)
#   x4dusk     b  the street at dusk for the walks home: the most of it where a phone plays (33 % at 500 Hz-3 kHz, 32 %
#                 above, where a is 51 % rumble); its slow dip flattened by the loop
#   x4room        HIS ROOM AT NIGHT, BUILT HERE: all three takes came back 93-98 % under 120 Hz at -53 to -61 dB RMS —
#                 a room tone a phone cannot play at all. Made instead from three takes this chapter already has: the
#                 shop's ceiling fan (cp8 x4fan a, looped), the lorong's crickets (v21.12 nightinsects b) far down, and
#                 the Chinatown street low-passed at 700 Hz and far below the window — every layer a master, none an
#                 encoded file
# MUSIC
#   x4close    c  the closing (erhu, soft piano, a warm string pad): 60 % at 500 Hz-3 kHz where a is 83 % at 120-500 —
#                 the one that carries on a phone. CHAD'S EAR decides (both previews sent 23 Oct); a is one line below.
set -e
cd "$(dirname "$0")"
. ../cp5/encfns.sh
plain() { # name levelled.wav channels opus_bitrate — already levelled by RMS; encoded as it is
  ffmpeg -v error -y -i "$2" -ac $3 -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../../assets/audio/$1.mp3
  ffmpeg -v error -y -i "$2" -ac $3 -map_metadata -1 -c:a libopus -b:a $4 -ar 48000 ../../../assets/audio-opus/$1.ogg
  echo "$1 <- $2  mp3 $(peak ../../../assets/audio/$1.mp3)  ogg $(peak ../../../assets/audio-opus/$1.ogg)"
}
trim() { python3 ../../v21.0/proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
shot() { # name raw start end fade — a one-shot, peak-matched to -6 dBFS
  trim "$2" w_$1.wav $3 $4 $5; enc $1 w_$1.wav -6.0 -6.0 96k 2; rm -f w_$1.wav w_$1.wav.f32; }

if [ "${SHOTS:-1}" = 1 ]; then
  shot x4whispers raw/x4whispers_b.mp3 0.00 6.95 0.80
  shot x4fall     raw/x4fall_c.mp3     0.10 2.60 0.40
  shot x4glass    raw/x4glass_b.mp3    0.00 3.40 0.15
  shot x4bag      raw/x4bag_a.mp3      0.00 2.70 0.30
  shot x4drawer   raw/x4drawer_a.mp3   0.00 1.10 0.30
  shot x4pen      raw/x4pen_a.mp3      0.00 2.50 0.30
  shot x4flicker  raw/x4flicker_b.mp3  0.10 2.90 0.20
  shot x4wrong    raw/x4wrong_c.mp3    0.30 2.40 0.06
fi

if [ "${LIFT:-1}" = 1 ]; then
  python3 phone2.py raw/x4rush_c.mp3 w_x4rush.wav --drive 5 --mix 0.75 --trim 0:1.9 --fadein 0.04 --fadeout 0.25
  python3 phone2.py raw/x4wake_c.mp3 w_x4wake.wav --drive 3 --mix 0.6 --clear 3.2 --ring 7000 --ringdb -22 --ringshape fall --fadein 0.3 --fadeout 1.0
  enc x4rush w_x4rush.wav -6.0 -6.0 64k 1
  enc x4wake w_x4wake.wav -8.0 -8.0 64k 1
  rm -f w_x4rush.wav w_x4wake.wav
fi

if [ "${BEDS:-1}" = 1 ]; then
  # the dusk street
  ffmpeg -v error -y -i raw/x4dusk_b.mp3 -af "highpass=f=50:poles=2" -ar 48000 w_d0.wav
  python3 loopfast.py w_d0.wav w_d1.wav 2.0 >/dev/null
  python3 ../../v21.12/level_rms.py w_d1.wav w_d2.wav -26 -10
  plain x4dusk w_d2.wav 2 96k
  rm -f w_d0.wav w_d1.wav* w_d2.wav*
  # his room at night: fan (looped first, so repeating it has no joint), crickets far off, the street far below
  ffmpeg -v error -y -i ../cp8/raw/x4fan_a.mp3 -af "highpass=f=60:poles=2" -ar 48000 -ac 2 w_r0.wav
  python3 loopfast.py w_r0.wav w_r1.wav 1.0 >/dev/null
  ffmpeg -v error -y -stream_loop 2 -i w_r1.wav -i ../../v21.12/raw/nightinsects_b.mp3 -i ../cp8/raw/x4street_c.mp3 -filter_complex \
    "[0:a]aresample=48000,aformat=channel_layouts=stereo,volume=16.5dB[f];[1:a]aresample=48000,aformat=channel_layouts=stereo,volume=-29dB[n];[2:a]aresample=48000,aformat=channel_layouts=stereo,lowpass=f=700:poles=2,highpass=f=60:poles=2,volume=-9dB[s];[f][n][s]amix=inputs=3:duration=shortest:normalize=0,atrim=0:20" \
    -ar 48000 w_r2.wav
  python3 loopfast.py w_r2.wav w_r3.wav 2.0 >/dev/null
  python3 ../../v21.12/level_rms.py w_r3.wav w_r4.wav -30 -14
  plain x4room w_r4.wav 2 96k
  rm -f w_r0.wav w_r1.wav* w_r2.wav w_r3.wav* w_r4.wav*
fi

if [ "${MUSIC:-1}" = 1 ]; then
  CLOSE=${CLOSE:-c}
  trim raw/x4close_$CLOSE.mp3 w_close.wav 0.70 72.6 4.0
  enc x4close w_close.wav -3.0 -3.0 128k 2
  rm -f w_close.wav w_close.wav.f32
fi
