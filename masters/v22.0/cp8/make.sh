#!/bin/sh
# v22.0 CP8 · EPISODE 3 CHAPTER 4 — the tray shop's sound (docs/V22.0-E3C4-PLAN.md §4.4).
# On the e3c4 CP8 flow BdLI0pZ20fesTrxCy0cW (sessions.json — the session ids are the only handle on a generation):
# effects eleven_text_to_sound_v2 (duration and loop as PARAMETERS, the v9.2 law), four takes asked (a 429 queue
# limit cut most nodes to three; the four nodes it rejected outright were run again once the queue drained), and the
# tension bed on eleven_music_v2. Measured with ../cp5/meas.py (bands, head and tail, holes) and, for the music, its
# RMS in 4 s steps over the whole band and over the band a phone plays (> 150 Hz).
# The names are x4* (the tray shop): every one this chapter's own, quoted in e3c4.js (build.py's pack rule).
#
# BEDS (looped; levelled by RMS, ../../v21.12/level_rms.py — a bed's rare transients set its peak)
#   x4street  c   the street through the open front: the only take not a third rumble (0.6 % under 120 Hz, 51 % at
#                 120-500, 40 % at 500 Hz-3 kHz) — traffic, the five-foot way's voices, sparrows; flattened and looped
#   x4fan     a   the ceiling fans: the only take with its swish where a phone plays (63 % at 120-500 Hz; b is 94 % hum)
#   x4forest  c   the forest at night under the Lersi: crickets, frogs, wind (98 % above 3 kHz — a phone's best band);
#                 the evenest of four (d peaks over full scale)
#   x4water   a   water all round under the naga: rushing, dripping, gurgling (66 % at 500 Hz-3 kHz), clean at 0 dB
#   x4tension a   the music under the pieces: its swelling plateau, 32-56 s of the take — flat within 3 dB over the
#                 whole band and within 2 dB over the phone's (-29 to -30 dB in 4 s steps), where b and d jump 5-8 dB;
#                 crossfaded into a 21 s loop (swells kept). Its BUILD is the chapter's: the bed's level steps up with
#                 each piece held (a bed loops from the chapter's first frame, so a take's own build would land at an
#                 arbitrary point)
# ONE-SHOTS (peak-matched to -6 dBFS; the chapter sets each one's level)
#   x4tick a, x4tea d, x4cup c, x4pick c, x4set b, x4om a, x4leaves a, x4rattle c, x4dust c, x4unwrap c, x4clockstop b,
#   x4scooter a, x4bicycle b, x4passers d, x4shimmer c — the cleanest onset and the fullest decay of each; the
#   clock's tick is the crispest (on at 0.05 s, gone by 0.2), the tea the loudest clean pour, the cup, the pick and the
#   set-down the ones with body in 500 Hz-3 kHz, the OM the only one of three not 73-95 % under 120 Hz, the leaves the
#   crispest (92 % above 3 kHz), the clock's stop the only one with a tick, a catch and a silence (b), the shimmer the
#   one that decays to silence (c; a and d hang at -38 to -46 dB at 3 s)
# LIFTED (phone.py: every take of these came back 77-100 % under 120 Hz — on a phone, nothing)
#   x4step c (the longest tail: the debris after the thud), x4giant d (the most body, 18 % at 120-500), x4hiss a (the
#   most breath, 17 % at 500 Hz-3 kHz), x4turn b (onset at 0, a clean swell), x4pressure c (the steadiest tone, with a
#   faint ringing in the ears laid in at 6.8 kHz)
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

if [ "${BEDS:-1}" = 1 ]; then
  bed() { # name raw hp target ceil xf
    ffmpeg -v error -y -i "raw/$2.mp3" -af "highpass=f=$3:poles=2" -ar 48000 w_b0.wav
    python3 ../../v21.0/proc.py loop w_b0.wav w_b1.wav $6 >/dev/null
    python3 ../../v21.12/level_rms.py w_b1.wav w_b2.wav $4 $5
    plain $1 w_b2.wav 2 96k
    rm -f w_b0.wav w_b1.wav* w_b2.wav*
  }
  bed x4street x4street_c 50 -26 -10 2.0
  bed x4fan    x4fan_a    60 -30 -14 1.0
  bed x4forest x4forest_c 80 -24 -8  2.0
  bed x4water  x4water_a  60 -22 -6  2.0
  python3 ../../v21.0/proc.py trim raw/x4tension_a.mp3 w_t0.wav 32.0 56.0 0 >/dev/null
  python3 ../../v21.0/proc.py xloop w_t0.wav w_t1.wav 3.0
  python3 ../../v21.12/level_rms.py w_t1.wav w_t2.wav -18 -3
  plain x4tension w_t2.wav 2 128k
  rm -f w_t0.wav* w_t1.wav* w_t2.wav*
fi

if [ "${SHOTS:-1}" = 1 ]; then
  shot x4tick      raw/x4tick_a.mp3      0.03 0.40 0.12
  shot x4tea       raw/x4tea_d.mp3       0.15 3.70 0.30
  shot x4cup       raw/x4cup_c.mp3       0.07 0.75 0.20
  shot x4pick      raw/x4pick_c.mp3      0.17 0.85 0.15
  shot x4set       raw/x4set_b.mp3       0.36 0.98 0.20
  shot x4om        raw/x4om_a.mp3        0.00 4.40 0.60
  shot x4leaves    raw/x4leaves_a.mp3    0.00 5.00 0.80
  shot x4rattle    raw/x4rattle_c.mp3    0.02 1.70 0.40
  shot x4dust      raw/x4dust_c.mp3      0.06 2.90 0.60
  shot x4clockstop raw/x4clockstop_b.mp3 0.30 2.48 0.30
  shot x4scooter   raw/x4scooter_a.mp3   0.10 4.30 0.50
  shot x4bicycle   raw/x4bicycle_b.mp3   0.00 2.90 0.30
  shot x4shimmer   raw/x4shimmer_c.mp3   0.00 3.00 0.40
  ffmpeg -v error -y -i raw/x4unwrap_c.mp3 -af "highpass=f=100:poles=2,afade=t=out:st=3.5:d=0.5" -ar 48000 w_x4unwrap.wav
  enc x4unwrap w_x4unwrap.wav -6.0 -6.0 96k 2
  ffmpeg -v error -y -i raw/x4passers_d.mp3 -af "highpass=f=100:poles=2,afade=t=in:d=0.3,afade=t=out:st=4.2:d=0.8" -ar 48000 w_x4passers.wav
  enc x4passers w_x4passers.wav -8.0 -8.0 96k 2
  rm -f w_x4unwrap.wav w_x4passers.wav
fi

if [ "${LIFT:-1}" = 1 ]; then
  python3 phone.py raw/x4step_c.mp3     w_x4step.wav     --drive 6 --mix 0.78 --fadeout 0.3
  python3 phone.py raw/x4giant_d.mp3    w_x4giant.wav    --drive 4 --mix 0.72 --fadein 0.2 --fadeout 0.5
  python3 phone.py raw/x4hiss_a.mp3     w_x4hiss.wav     --drive 3 --mix 0.7 --trim 0:2.9 --fadein 0.05 --fadeout 0.6
  python3 phone.py raw/x4turn_b.mp3     w_x4turn.wav     --drive 4 --mix 0.75 --trim 0:2.1 --fadein 0.02 --fadeout 0.5
  python3 phone.py raw/x4pressure_c.mp3 w_x4pressure.wav --drive 3 --mix 0.6 --ring 6800 --ringdb -28 --fadein 0.6 --fadeout 1.2
  for n in x4step x4giant x4hiss x4turn; do enc $n w_$n.wav -6.0 -6.0 64k 1; done
  enc x4pressure w_x4pressure.wav -9.0 -9.0 64k 1
  rm -f w_x4step.wav w_x4giant.wav w_x4hiss.wav w_x4turn.wav w_x4pressure.wav
fi
