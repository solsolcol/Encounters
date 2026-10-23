#!/bin/sh
# v22.0 CP6 · EPISODE 3 CHAPTER 4 — the merit film's sound (docs/V22.0-E3C4-PLAN.md §4.2).
# On the e3c4 CP6 flow 2TKO5jldMeFomknzy4mw (sessions.json — the session ids are the only handle on a generation):
# effects eleven_text_to_sound_v2 (duration and loop as PARAMETERS, the v9.2 law), music eleven_music_v2, four takes
# each, measured with ../cp5/meas.py (bands, head and tail, holes) and shape.py (the envelope over time, transients).
# The names are m4* because t4* is episode 2 chapter 4's tower (a sound's name is global, the v7.1 law).
#
#   m4bell d     the only bell of four with body above the sub-bass (56 % in 120-500 Hz; a is 99 % under 120 Hz, which
#                a phone plays as nothing); one strike and its decay
#   m4envelope c the loudest (b and d sit under -45 dB RMS), clean at both ends; its 0.55 s lead cut
#   m4pour a     the steadiest trickle with the most body (body std 1.6 dB, 58 % 500 Hz-3 kHz — the bowl's ring)
#   m4ground b   splashes on soil with clean ends (c has two holes, a and d a third of their energy as rumble)
#   m4leaves c   the only one that SWELLS and settles (-28 -> -15 -> -35 dB over seven seconds); faded to silence
#   m4dusk c     the only bed with the birds and the crickets in it (30 % above 3 kHz; a, b, d are 72-94 % rumble);
#                high-passed at 120 Hz so the traffic rumble does not ride under his voice; generated as a loop
#   m4rise c     a shimmer that rises and falls (onset 0.55, gone by 3.3 s); its lead cut
#   m4music a    the soft one: even all the way (-27 to -35 dB every two seconds) and a natural ending, where b, c and d
#                swell to -11 dB — under narration, a dedication and a chant the bed must not lead. Cut in two: the
#                opening (0-24 s, faded out under the dedication, so the chant is heard alone) and the coda (34 s to its
#                own ending), so the music that returns at the tree is the same music.
set -e
cd "$(dirname "$0")"
. ../cp5/encfns.sh
w() { ffmpeg -v error -y -i "raw/$1.mp3" -af "$2" -ar 48000 "w_$3.wav"; }
w m4bell_d     "highpass=f=55,afade=t=out:st=4.2:d=1.6,atrim=0:6.0" m4bell
w m4envelope_c "atrim=0.55:2.6,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=1.75:d=0.3" m4envelope
w m4pour_a     "afade=t=in:d=0.25,afade=t=out:st=12.6:d=1.3" m4pour
w m4ground_b   "afade=t=out:st=5.0:d=0.7" m4ground
w m4leaves_c   "afade=t=in:d=0.3,afade=t=out:st=5.2:d=1.75" m4leaves
w m4dusk_c     "highpass=f=120" m4dusk
w m4rise_c     "atrim=0.45:4.0,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=2.7:d=0.8" m4rise
w m4music_a    "atrim=0:24,afade=t=out:st=20:d=4" m4music
w m4music_a    "atrim=34:56,asetpts=PTS-STARTPTS,afade=t=in:d=1.2" m4coda
for n in m4bell m4envelope m4pour m4ground m4leaves m4rise; do enc $n w_$n.wav -6.0 -6.0 96k 2; done
enc m4dusk  w_m4dusk.wav  -8.0 -8.0 96k 2
enc m4music w_m4music.wav -3.0 -3.0 128k 2
enc m4coda  w_m4coda.wav  -3.0 -3.0 128k 2
rm -f w_*.wav
