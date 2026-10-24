#!/bin/sh
# v22.0 CP10 · EPISODE 3 CHAPTER 4 — the opening film's sound (docs/V22.0-E3C4-PLAN.md §4.0).
# THE WORKSPACE HAS NO CREDITS (24 Oct: 0 of 127,573 left), so the film's own takes (its score, the scroll wheel, a far
# siren, the escalator, the tray on the glass — sessions.json, every one refused, nothing charged) never came back.
# Until they do, the film is made of sounds this game already has, each under a name of e3c4's OWN (the v4.2 split: a
# sound only one chapter asks for is that chapter's; quoting e3c1's or e3c3's names would have pulled them into the
# shared pack that every player downloads at boot):
#   f4office    e3c1's office at night (officehum), byte for byte
#   f4keys      e3c1's keys (keytype), byte for byte
#   f4shopbell  e3c3's shop door bell (shopbell), byte for byte
#   f4click     ONE key out of e3c1's other keytype take (v16.0 raw/keytype_a, the loud isolated stroke at 2.62 s — the
#               next is 0.28 s later), cut, faded, peak-matched to -6 dBFS: the mouse's click on the fifth result
# The film's score is World Y's drone (y4dread) until its own is generated.
set -e
cd "$(dirname "$0")"
. ../cp5/encfns.sh
A=../../../assets
for p in "officehum f4office" "keytype f4keys" "shopbell f4shopbell"; do set -- $p
  cp $A/audio/$1.mp3 $A/audio/$2.mp3; cp $A/audio-opus/$1.ogg $A/audio-opus/$2.ogg; echo "$2 <- $1 (bytes)"; done
python3 ../../v21.0/proc.py trim ../../v16.0/raw/keytype_a.mp3 w_click.wav 2.60 2.86 0.06 >/dev/null
enc f4click w_click.wav -6.0 -6.0 96k 2
rm -f w_click.wav w_click.wav.f32

# v22.4 · THE FILM'S OWN SOUND, at last (24 Oct: runs 3 and 4 were refused for credits; run 5 went through — sessions.json).
# The score moved to eleven_music_v2_5, the workspace's newest music model; the effects have one model. Four takes each,
# measured with ../cp5/meas.py (bands, head and tail, holes) and shape.py (the curve, the onsets, the siren's pitch):
#   f4music c   the only take a phone can carry: 21 % of it in 500 Hz-3 kHz (a 11 %, d 3 %; b and d put 28-39 % under
#               120 Hz, which a phone plays as nothing); sparse (112 onsets in 50 s against a's 213), phrased with real
#               rests, and it THINS to its end as the prompt asked (-37, -47, -49 dB over its last ten seconds) where b
#               swells to -17 at the door and d holds at -20 the whole way. Cut 1.5 s in (its first note is at 1.75), so
#               on the film's cue at 0.6 it comes in under the fade from black; its rests land on the office's cut to
#               black (11.0) and under the tray (20.2), its swell on the top of the escalator, its thinning under the
#               push through the beads — where her song takes over.
#   f4siren d   a WAIL that passes (909 -> 1372 -> 818 Hz) and the only one with the traffic under it (9 % under 120 Hz,
#               high-passed away so it never sits under his voice), rising in a second and dying over six; clean at both
#               ends (a, b, c are two-tone or start on signal)
#   f4escal c   steady (one squeak bump at 6 s, the handrail) and the broadest: 51 % of it above 500 Hz, where a and d
#               are a motor's rumble a phone cannot play
#   f4tray b    the only one with a body (55 % in 500 Hz-3 kHz; a and d are 99 % hiss above 3 kHz): clicks as the tray
#               starts across the glass, a pause, and the clack as it stops
#   f4scroll c  the only one that did what the prompt asked — runs of exactly 7, 7, 7, 7 and 5 clicks with pauses — so
#               three of its runs are laid on the film's three turns of the wheel (2.6, 4.9, 6.4: 0.0, 2.3 and 3.8 s apart)
w() { ffmpeg -v error -y -i "raw/$1.mp3" -af "$2" -ar 48000 "w_$3.wav"; }
w f4music_run5_c "atrim=1.5:52.0,asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st=48.0:d=2.0" f4music
w f4siren_run5_d "highpass=f=120,afade=t=in:d=0.3,afade=t=out:st=7.0:d=1.0" f4siren
w f4escal_run5_c "highpass=f=60,afade=t=in:d=0.5,afade=t=out:st=9.8:d=1.2" f4escal
w f4tray_run5_b  "atrim=0:1.95,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=1.65:d=0.3" f4tray
ffmpeg -v error -y -i raw/f4scroll_run5_c.mp3 -filter_complex \
  "[0]atrim=0.40:0.88,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=0.46:d=0.02[a];\
   [0]atrim=1.15:1.56,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=0.39:d=0.02,adelay=2300:all=1[b];\
   [0]atrim=1.72:2.16,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=0.42:d=0.02,adelay=3800:all=1[c];\
   [a][b][c]amix=inputs=3:normalize=0:duration=longest" -ar 48000 w_f4scroll.wav
enc f4music w_f4music.wav -3.0 -3.0 128k 2
enc f4siren w_f4siren.wav -8.0 -8.0 96k 2
for n in f4escal f4tray f4scroll; do enc $n w_$n.wav -6.0 -6.0 96k 2; done
rm -f w_f4music.wav w_f4siren.wav w_f4escal.wav w_f4tray.wav w_f4scroll.wav
