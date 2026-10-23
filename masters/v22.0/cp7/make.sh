#!/bin/sh
# v22.0 CP7 · EPISODE 3 CHAPTER 4 — the Hanuman shop's sound (docs/V22.0-E3C4-PLAN.md §4.3).
# On the e3c4 CP7 flow V92OOV7Y3fIr8z4QWtmh (sessions.json — the session ids are the only handle on a generation):
# effects eleven_text_to_sound_v2, duration as a PARAMETER (the v9.2 law), four takes asked (five starts failed on a
# transient error: those nodes carry three). Round one's rumble, surge, ring and burst were 84-100 % under 120 Hz —
# nothing on a phone — so those four nodes were re-prompted for the band a phone plays and run again (h4*2).
# Measured with ../cp5/meas.py's bands and an envelope in 100 ms steps (the 23 Oct log in the plan's §12).
# The names are h4* (the Hanuman shop): every one this chapter's own, quoted in e3c4.js (build.py's pack rule).
#
#   h4rumble  2b  the singing-bowl hum of the statue in his hand: the only take with the asked-for throb under it
#                 (12 % under 120 Hz) AND its body where a phone plays (88 % at 500 Hz-3 kHz), and its envelope wavers
#                 (-5, -4, -5, -13, -11, -10 dB) where a and d only decay; faded in over 0.25 s so it SWELLS
#   h4surge   built  (surge.py): no take was a hum that rises; round two's c (a 120-250 Hz hum) spun up 0.80 -> 1.40,
#                 saturated into a buzz, high-passed, round one's d (static) laid under it as the crackle
#   h4rattle  a   the glass rattling: 93 % at 1-3 kHz, one clean burst of rattling; its 0.38 s of silence cut
#   h4embers  a   crackle that comes and goes (b and c are near-constant, a hiss); faded at both ends
#   h4roarin  b   the roar heard from inside: 71 % at 250-500 Hz (muffled, where d is bright at 1-3 kHz), held 2 s,
#                 then a ringing decay to silence by 4 s
#   h4ring    2d  the shockwave's gong: the brightest of four (59 % at 500 Hz-1 kHz), one strike, a 2.3 s decay
#   h4pull    b   the suction that pulls at him: the slowest build (silence to 0 dB over 2.5 s), the most top (45 %
#                 1-3 kHz); cued so its peak lands on LET GO
#   h4clatter c   the figurine dropped on the glass: the only take of four that BOUNCES (two impacts, 0.6 s apart), and
#                 the only one with body (17 % at 500 Hz-1 kHz; the rest are 98 % hiss)
#   h4burst   2d  the vision bursting into embers: a whoosh to a burst (0.3 s) and a fizzle — its silent 0.4 s between
#                 the two cut out, so the fizzle follows the burst; 0.1 s of its lead cut
#   h4feet    d   running in the corridor: the steadiest steps (one every 0.5 s, -1 to -9 dB), 6 s
#   h4crowd   c   the shoppers' murmur of alarm: rises to its peak at 0.7 s and settles to a murmur; no word in it
#   h4pant    a   his breath after the run: the most regular (a breath every ~0.45 s at the start, slowing)
set -e
cd "$(dirname "$0")"
. ../cp5/encfns.sh
w() { ffmpeg -v error -y -i "raw/$1.mp3" -af "$2" -ar 48000 "w_$3.wav"; }
w h4rumble2_b "afade=t=in:d=0.25,afade=t=out:st=2.3:d=0.65" h4rumble
python3 surge.py raw/h4surge2_c.mp3 raw/h4surge_d.mp3 w_h4surge.wav
w h4rattle_a  "atrim=0.38,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=1.35:d=0.35" h4rattle
w h4embers_a  "afade=t=in:d=0.2,afade=t=out:st=5.0:d=1.0" h4embers
w h4roarin_b  "afade=t=out:st=3.6:d=0.7" h4roarin
w h4ring2_d   "afade=t=out:st=1.8:d=0.55" h4ring
w h4pull_b    "afade=t=out:st=2.95:d=0.3" h4pull
w h4clatter_c "afade=t=out:st=1.1:d=0.4" h4clatter
ffmpeg -v error -y -i raw/h4burst2_d.mp3 -filter_complex \
  "[0]atrim=0.1:0.60,asetpts=PTS-STARTPTS[a];[0]atrim=0.98,asetpts=PTS-STARTPTS[b];[a][b]acrossfade=d=0.06:c1=tri:c2=tri,afade=t=in:d=0.02,afade=t=out:st=1.75:d=0.45" \
  -ar 48000 w_h4burst.wav
w h4feet_d    "afade=t=out:st=5.4:d=0.6" h4feet
w h4crowd_c   "afade=t=in:d=0.05,afade=t=out:st=3.4:d=0.6" h4crowd
w h4pant_a    "afade=t=out:st=4.3:d=0.7" h4pant
for n in h4rumble h4surge h4rattle h4embers h4roarin h4ring h4pull h4clatter h4burst; do enc $n w_$n.wav -6.0 -6.0 96k 2; done
for n in h4feet h4crowd h4pant; do enc $n w_$n.wav -8.0 -8.0 96k 2; done
rm -f w_*.wav

# THE MALL'S ONE-SHOTS around the shop (chapter 3's v21.13 seven, byte for byte, under this chapter's own names — a
# sound two chapters ask for by name goes into the shared pack every player downloads at boot, the v4.2 split, the
# v21.1 lesson): a neighbour's roller shutter, a trolley, a phone next door, a cash drawer, a plastic bag, a child
# laughing past, slippers
for p in "mshutter h4shutter" "trolley h4trolley" "phonering h4phone" "cashdraw h4cash" "bagrustle h4bag" "childpass h4child" "slipperspass h4slippers"; do
  set -- $p; cp ../../../assets/audio/$1.mp3 ../../../assets/audio/$2.mp3; cp ../../../assets/audio-opus/$1.ogg ../../../assets/audio-opus/$2.ogg
done
