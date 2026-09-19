#!/bin/sh
# v14.0 · EPISODE 2 · CHAPTER 5 · THE LAST QUESTION — the recipe.
# 34 voice takes in three voices and 5 sounds, two takes each, picked by
# measurement (measure.json, picks.json).
#
# THE PICKS, and why:
#   voice — the cleaner EDGES first (a take that ends ON signal clicks
#   through the v5.30 envelope, so a low e1 wins), then the pace the line
#   wants. The reflective lines take the SLOWER read (n5close a at 2.63
#   words a second against b's 3.10 — the game's median is 2.3 and this is
#   the episode's last sentence; n5C b at 3.12 s against a's 2.48, because
#   a chastened line is a slow one). e5A4 take b CLIPS (+0.31 dBFS peak),
#   so a wins on measurement alone.
#
# CAMPDAY IS DROPPED. Both takes came back 73 % and 81 % of their energy
# under 120 Hz — rumble a phone speaker cannot play, which is the exact
# measure that disqualified a candidate at v9.2 ("84.4 % under 120 Hz,
# which is rumble, not a treeline"). e2c1's `campamb` already passed that
# test and is the same camp, so the chapter cues it instead; build.py
# COMPUTES the split, so a second chapter asking for it moves it into the
# shared pack automatically, with no declaration and no duplicate bytes.
#
# THE DURATION IS A PARAMETER (the v9.2 law, walked into a fourth time):
# campday was asked for "22 seconds, seamless" in English and came back at
# 6.00 s and 2.00 s. eleven_music_v2 respected 45 s; eleven_text_to_sound_v2
# did not. `e5theme` is a ONE-SHOT under the closing teaching, not a loop,
# so it needs no hand-crossfade — trimmed to 44.0 s with a 2.5 s fade.
#
# Levels: Aaron peak -6.85 mp3 / -6.6 ogg (his bus carries the compressor
# and the limiter); THE CAST BY RMS to -16 dBFS through ../v11.1/level.py,
# because the cast bus is FLAT (the v11.1 finding) — that is the encik AND
# the storeman; effects -4.0 and the theme -10.5, where the game's sit.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
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
cast() { # name src — levelled by RMS for the FLAT cast bus, then encoded plainly
  n=$1; src=$2
  python3 ../v11.1/level.py "$src" wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"
  rm -f wc_$n.wav wc_$n.wav.f32
}
V=-6.85; O=-6.6; E=-4.0; B=-10.5

# --- Aaron (jamesTeen): film, small talk, four replies, four card lines, the close
enc n5pro1  raw/n5pro1_a.mp3  $V $O 64k 1
enc n5pro2  raw/n5pro2_a.mp3  $V $O 64k 1
enc n5pro3  raw/n5pro3_a.mp3  $V $O 64k 1
enc n5pro4  raw/n5pro4_a.mp3  $V $O 64k 1
enc n5hi    raw/n5hi_b.mp3    $V $O 64k 1
enc n5ord   raw/n5ord_b.mp3   $V $O 64k 1
enc n5askA  raw/n5askA_b.mp3  $V $O 64k 1
enc n5askB  raw/n5askB_a.mp3  $V $O 64k 1
enc n5askC  raw/n5askC_a.mp3  $V $O 64k 1
enc n5askD  raw/n5askD_a.mp3  $V $O 64k 1
enc n5A     raw/n5A_b.mp3     $V $O 64k 1
enc n5B     raw/n5B_a.mp3     $V $O 64k 1
enc n5C     raw/n5C_b.mp3     $V $O 64k 1
enc n5D     raw/n5D_b.mp3     $V $O 64k 1
enc n5close raw/n5close_a.mp3 $V $O 64k 1

# --- the encik (Hilmi) — the FLAT cast bus, levelled by RMS
cast e5hi   raw/e5hi_b.mp3
cast e5ord  raw/e5ord_b.mp3
cast e5turn raw/e5turn_a.mp3
cast e5A1   raw/e5A1_a.mp3
cast e5A2   raw/e5A2_b.mp3
cast e5A3   raw/e5A3_a.mp3
cast e5A4   raw/e5A4_a.mp3
cast e5A5   raw/e5A5_b.mp3
cast e5B1   raw/e5B1_b.mp3
cast e5B2   raw/e5B2_a.mp3
cast e5B3   raw/e5B3_b.mp3
cast e5B4   raw/e5B4_b.mp3
cast e5C    raw/e5C_a.mp3
cast e5D1   raw/e5D1_a.mp3
cast e5D2   raw/e5D2_b.mp3
cast e5D3   raw/e5D3_b.mp3

# --- the storeman / clerk (David) — the same flat cast bus
cast c5arms  raw/c5arms_a.mp3
cast c5store raw/c5store_a.mp3
cast c5form  raw/c5form_a.mp3

# --- the sounds (trimmed by proc.py above)
enc storecount w_storecount.wav $E $E 96k 2
enc riflerack  w_riflerack.wav  $E $E 96k 2
enc armsdoor   w_armsdoor.wav   $E $E 96k 2
enc storedesk  w_storedesk.wav  $E $E 96k 2
enc e5theme    w_e5theme.wav    $B $B 96k 2
