#!/bin/bash
# v24.34 · episode 4 chapter 1's music where it had none (Chad, 2 Nov 2026: "throughout this entire episode there is a
# serious lack of background music, ambient music, mood music, not just in gameplay, but all the cutscenes, like when
# exiting the samnak, in the taxi, and back in his shop etc. it feels flat because there is not much music").
# THE CENSUS (tools/probes/musiccensus.mjs): music under 55 % of the chapter's films (452 s); the storm film had none,
# ending A none for its first 57 s, ending D none for 46 s, ending B none for 16 s, every coda none before its last
# chord, and play none at all (docs/V24.32-E4C1-NOTES.md, M2).
# THE TAKES — flow VzVVjq8H0JxVBpIUXadi, eleven_music_v2_5, instrumental, four takes each (music/script.json, its
# prompts; music/sessions.json, its sessions), measured by music/meas.py (music/meas.txt: the bands, the dB a phone loses,
# the share in 1-4 kHz a voice needs, the onsets, the 1 s spread, the arc in 2.5 s steps). Two were RE-MADE
# (script.json `remakes`): the room's bed and the storm's, because all four of each were a drone under 120 Hz that a phone
# speaker barely plays (10-19 dB lost); the remakes, asked for the middle register, lose 1-4 dB.
# PROVISIONAL picks until Chad's ear (previews/: one reel a cue, every take loudness-matched — v10.6):
#   w4yardmus  a      the yard in play: the khaen and the phin, 2.6 dB lost on a phone (b 5.7, c 4.0; d is 90 % sub-bass),
#                     the steadiest 59 s of the four (1 s level spread 3.2 dB)
#   w4roommus  r2 c   the room in play: a reed and violas, 2.5 dB lost, 1-4 kHz 6.9 % (r2 a is 30 %: it would sit on the
#                     master's words), a steady body (r2 b swells and dies every 15 s, 20 dB each time)
#   w4stormmus r2 c   the storm film: rising to its peak 12.5-15 s in (the fifth flash is at 14.4) and thinning after;
#                     0.9 dB lost; r2 d (the same arc, sharper) is 48 % in 1-4 kHz, the whispered chant's band
#   w4endA0    c      ending A, the blessing to the cab: 6.1 dB lost (a 10.5, b 9.4), soft for 2 s, even through the
#                     middle, its tail gone by 52.5 s, as the khaen takes over; d (3.9) swells 15 dB under the voices
#   w4endB0    d      ending B's opening exchange: 7.3 dB lost (a 20.4, b 18.9, c 14.9), settling by 14.5 s
#   w4endD0    c      ending D, his "This is enough" to the shelter: 3.9 dB lost, 1-4 kHz 0.2 % (a is 37 %), steady, its
#                     own fade from 35.5 s into the phin; it starts on its first sample, so faded in over 0.4 s
#   w4codamus  a      every coda, the taxi and the shop: soft for its first 2 s under "Where to, boss?", gone by 16.5 s
#                     into the chord; 4.9 dB lost
# THE SCREEN (what previews/ leaves out of Chad's reels): w4yardmus d (90 % under 120 Hz); w4endB0 a, b and c (15-20 dB
# lost on a phone); w4endD0 a (37 % in 1-4 kHz, the band of the voices it sits under); the first four room and storm takes
# (re-made). A phone plays almost nothing of the first kind, and the second would sit on the words.
# THE LEVELS (EBU R128 integrated, as built; the volume each plays at in e4c1.js): every lead-in 1-3 dB under the cue it
# hands into — w4endA0 -17.4 LUFS x 0.55 = -22.6 against the khaen's -21.6; w4endB0 -15.4 x 0.5 = -21.4 against
# w4endB's -20.2; w4endD0 -15.1 x 0.45 = -22.0 against the phin's -19.1; w4codamus -20.3 x 0.8 = -22.2 under the taxi's
# voices, into the chord's -15.7. The beds in play ~10 dB under the cast's speech (-16.5) before the 8 dB duck: the
# yard's -17.7 x 0.38 = -26.1 (the yard's own bed is -28.9), the room's -14.2 x 0.23 = -27.0, half that under the
# decision. The storm's -21.3 x 0.85 = -22.7, 3 dB under the downpour and over it at the fifth flash (its swell).
# THE BEDS are LOOPS (music/padloop.py): the flattest ~59 s of the take's body, its end placed where the take runs on most
# like the window's head (../v21.2/musicloop.py, a 2 s crossfade), then padded 0.06 s each side for the engine's insets
# (padloop.py says why), peak-matched like the rest (enc: pure gains, so the seam stays a seam). The level each plays at
# is MUS in e4c1.js (priced against the voices: the measures are this file's last section).
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, two passes (the encoders move it)
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
mus() { # name src [ffmpeg filter] — music, stereo, peak -3 (v22.4's f4music), Opus 128k
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }
mbed() { # name take seconds — a music bed: looped, padded, peak -3
  n=$1; t=$2; L=$3
  (cd music && python3 ../../v21.2/musicloop.py raw/$t.mp3 $L)
  python3 music/padloop.py music/w_$t.wav p_$n.wav
  enc $n p_$n.wav -3.0 -3.0 128k 2; rm -f p_$n.wav music/w_$t.wav; }

mbed w4yardmus  w4yardmus_a    60
mbed w4roommus  w4roommus_r2_c 60
mus  w4stormmus music/raw/w4stormmus_r2_c.mp3
mus  w4endA0    music/raw/w4endA0_c.mp3
mus  w4endB0    music/raw/w4endB0_d.mp3
mus  w4endD0    music/raw/w4endD0_c.mp3 "afade=t=in:d=0.4"
mus  w4codamus  music/raw/w4codamus_a.mp3
