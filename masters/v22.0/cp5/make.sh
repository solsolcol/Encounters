#!/bin/sh
# v22.0 CP5 · EPISODE 3 CHAPTER 4 — the Yin shop's sound (docs/V22.0-E3C4-PLAN.md §4.1, §7).
# On the e3c4 CP5 flow xgQhtsauw0FggEfHV903 (sessions.json — the session ids are the only handle on a generation):
# music eleven_music_v2, effects eleven_text_to_sound_v2 (duration and loop as PARAMETERS, the v9.2 law), four takes
# of each. Measured with meas.py (length, peak, RMS, the split across the bands a phone can and cannot play, head and
# tail levels, holes), the songs and breaths also transcribed (trsong.py) to hear whether a "hum" said words.
#
# THE SONG. The radio on the counter plays HER: one take of a young woman humming a minor-key lullaby, a cappella
# (y4songhum a — two 4 s phrases alternating, a breath between each; "Hmm Hmm Hmm" to the transcriber, no words),
# and the same voice hums beside him later (y4hum), so the tape and the girl are one voice. Of the four hummed takes
# a is the loudest and steadiest (phrases -7 to -10 dB, breaths -40 to -55, a phrase pair exactly 8.0 s); b came back
# with words in it ("I want to be a part of this"), c and d are lower and less even. The old-ballad takes (guitar
# and a wordless vocalise) are the alternative put to Chad's ear (the v10.6 rule), not shipped: the girl humming the
# tape's own tune beside him needs the tape to be her voice. song.py: three phrase pairs cut breath to breath, a small
# speaker's band with a saturation that puts 40 % of it in 500 Hz-3 kHz (her hum alone is 99.8 % under 500 Hz, which
# a phone plays only weakly), tape wow and flutter and hiss, every moving part periodic in the 24.0 s loop.
# The tape SLOWING and STOPPING is the song's own source slowing (the bed rate seam, main.js), so y4tapestop is not
# used — all four takes were someone else's music sagging, with no click at the end; the stop key's click is
# synthesised (tapeclick.py).
#
# THE BEDS. y4dread a — the eerie drone (detuned strings, a far breathy choir; 48 % 120-500 Hz, 51 % 500 Hz-3 kHz,
# no sub-bass), the loudest and most even of four; looped 6.0 -> 51.0 s with a 3 s crossfade, swells kept.
# y4mall c — the dead top floor (the least sub-bass of four, 55 %); high-passed at 60 Hz, looped. y4air is NOT used:
# all four takes were 84-100 % under 120 Hz, a room tone a phone cannot play at all.
#
# THE EFFECTS, one take each by measurement:
#   y4zap b      the only clean end (-66.7; a, c, d end ON signal)
#   y4frost c    clean at both ends (-73.6 / -74.3), crackles that build and sparkle
#   y4shiver a   no voiced syllable (b laughed "Hehehe", c said "Ugh", d "Ahhh"); a shaky breath
#   y4breath d   clean at both ends (-65.1 / -65.9); a slow exhale
#   y4sigh a     a breath (82 % 500 Hz-3 kHz); c was a voiced "oh" (97 % under 500), b and d had holes
#   y4bell a     ONE ring with a long even decay (d rattled four times)
#   y4tube b     the only one with the tube's hum under its ticks (21 % 120-500 Hz); faded, it ends on signal
#   y4beads c    the lowest centroid (5.6 kHz — wooden, not glass) and a clean tail
#   y4curtain b  the warmest (4.2 kHz centroid; cloth, not hiss)
#   y4candle b   the least sub-bass (15 %)
#   y4creak c    one long even creak, clean tail; a clipped (103 samples at its peak) and creaked four times
#   y4box d      a hinge with body (5.7 % 120-500 Hz) and clean ends
#   y4setdown a  a tap and a slither, its 0.45 s lead cut
#   y4clatter c  the densest bounce, clean tail
#   y4sting c    rises for 1.75 s and CUTS to silence (-52 dB 0.25 s after its peak) — she is there, and nothing
#   y4radio a    static and a whine, clean end
#
# THE HEART (CP5d, Chad: "heart beat slowing down, with a heart beat sound, heart rate monitor going crazy"):
#   y4heart d    the only take of four with body above the sub-bass (41 % in 120-500 Hz; a, b, c are 76-99 % under
#                120 Hz, which a phone plays as nothing) and a clear lub at 0.02 s and dub at 0.21 s. heart.py gives
#                the thump harmonics a phone can play (26 % sub, 73 % 120-500 Hz after), peak -3 dBFS. kit.pulse plays
#                it on every beat it draws, so what is heard is what the monitor shows.
#   y4frost is RETIRED with the frost (Chad: "Why the frost effect has snowflakes? It makes no sense"); its row,
#                its files and its cue are gone.
set -e
cd "$(dirname "$0")"
peak() { python3 ../../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, two passes (the encoders move it)
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../../assets/audio-opus/$n.ogg
    pm=$(peak ../../../assets/audio/$n.mp3); po=$(peak ../../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
plain() { # name levelled.wav channels opus_bitrate — already levelled by RMS; encoded as it is
  ffmpeg -v error -y -i "$2" -ac $3 -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../../assets/audio/$1.mp3
  ffmpeg -v error -y -i "$2" -ac $3 -map_metadata -1 -c:a libopus -b:a $4 -ar 48000 ../../../assets/audio-opus/$1.ogg
  echo "$1 <- $2  mp3 $(peak ../../../assets/audio/$1.mp3)  ogg $(peak ../../../assets/audio-opus/$1.ogg)"
}
trim() { python3 ../../v21.0/proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
shot() { # name raw start end fade — a one-shot, peak-matched to -6 dBFS; the chapter sets each one's level
  trim "$2" w_$1.wav $3 $4 $5; enc $1 w_$1.wav -6.0 -6.0 96k 2; rm -f w_$1.wav w_$1.wav.f32; }

if [ "${SONG:-1}" = 1 ]; then
  python3 song.py raw/y4songhum_a.mp3 w_song.wav w_hum.wav
  python3 ../../v21.12/level_rms.py w_song.wav.raw.wav w_songL.wav -19 -4
  python3 ../../v21.12/level_rms.py w_hum.wav.raw.wav w_humL.wav -20 -5
  plain y4song w_songL.wav 1 64k
  plain y4hum  w_humL.wav  1 64k
  python3 tapeclick.py w_click.wav
  enc y4tapeclick w_click.wav -3.0 -3.0 64k 1
  rm -f w_song.wav* w_hum.wav* w_songL.wav* w_humL.wav* w_click.wav*
fi

if [ "${BEDS:-1}" = 1 ]; then
  python3 ../../v21.0/proc.py trim raw/y4dread_a.mp3 w_d0.wav 6.0 51.0 0 >/dev/null
  python3 ../../v21.0/proc.py xloop w_d0.wav w_d1.wav 3.0
  python3 ../../v21.12/level_rms.py w_d1.wav w_dread.wav -18 -4
  plain y4dread w_dread.wav 2 96k
  ffmpeg -v error -y -i raw/y4mall_c.mp3 -af "highpass=f=60:poles=2" w_m0.wav
  python3 ../../v21.0/proc.py loop w_m0.wav w_m1.wav 1.5 >/dev/null
  python3 ../../v21.12/level_rms.py w_m1.wav w_mall.wav -24 -10
  plain y4mall w_mall.wav 2 96k
  rm -f w_d0.wav* w_d1.wav* w_dread.wav* w_m0.wav w_m1.wav* w_mall.wav*
fi

if [ "${VOICE:-1}" = 1 ]; then
  # z4look2, said again for the wall that replaced the photographs (Phra Ngan, Mae Nak, Nang Tani around her photo):
  # "[uneasy] Paintings of ghost women... and a little god with red eyes, smiling at me. And between them, a photo of
  # a real girl... with fresh flowers under it." Four takes (Brian, eleven_v3), all four the words exactly; take a has
  # the cleanest end (-37.8, faded) and the pause after "ghost women" (1.18 s) — 12.56 s. On his v16.0/v18.6 chain.
  python3 ../../v21.0/prep.py raw/z4look2_a.mp3 p_z4look2.wav --fade 0.12 >/dev/null
  ffmpeg -v error -y -i p_z4look2.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_z4look2.wav
  enc z4look2 h_z4look2.wav -6.85 -6.6 64k 1
  rm -f p_z4look2.wav h_z4look2.wav
fi

if [ "${HEART:-1}" = 1 ]; then
  python3 heart.py raw/y4heart_d.mp3 w_heart.wav
  enc y4heart w_heart.wav -3.0 -3.0 64k 1
  rm -f w_heart.wav w_heart.wav.f32
fi

if [ "${FX:-1}" = 1 ]; then
  shot y4zap     raw/y4zap_b.mp3     0.00 1.80 0.15
  shot y4shiver  raw/y4shiver_a.mp3  0.00 2.15 0.25
  shot y4breath  raw/y4breath_d.mp3  0.35 2.00 0.20
  shot y4sigh    raw/y4sigh_a.mp3    0.00 2.30 0.30
  shot y4bell    raw/y4bell_a.mp3    0.00 2.50 0.30
  shot y4tube    raw/y4tube_b.mp3    0.00 1.58 0.10
  shot y4beads   raw/y4beads_c.mp3   0.03 1.30 0.15
  shot y4curtain raw/y4curtain_b.mp3 0.00 2.30 0.25
  shot y4candle  raw/y4candle_b.mp3  0.00 1.45 0.15
  shot y4creak   raw/y4creak_c.mp3   0.00 1.95 0.15
  shot y4box     raw/y4box_d.mp3     0.03 1.25 0.12
  shot y4setdown raw/y4setdown_a.mp3 0.45 1.05 0.10
  shot y4clatter raw/y4clatter_c.mp3 0.00 1.25 0.12
  shot y4sting   raw/y4sting_c.mp3   0.00 2.10 0.08
  shot y4radio   raw/y4radio_a.mp3   0.00 1.72 0.12
fi
