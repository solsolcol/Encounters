#!/bin/sh
# v24.7 · CHAD'S ELEVEN NOTES ON EPISODE 3 CHAPTER 5 (docs/V24.7-E3C5-NOTES.md) — the sound.
#
# THE OWNER'S ASKS, SHORTER (note 2: "the shop owner talks way too long"): two sentences that each say a point the take
# says again are CUT from the raw takes v23.0 shipped (cut.py: each join at the quietest 20 ms of a pause the word timings
# name — words.txt, faster-whisper small.en over the raw take — crossfaded over 40 ms), then the v23.0 cast chain:
#   ow5wrong    raw b, without "The ones from a temple, we believe, won't help you do wrong." (3.58–8.58 s)
#   ow5promise  raw a, without "And not for one month, not for one year." (0–2.84 s); "Every day you look after them…
#               as long as you live" says it
#
# THE NEW LINES (notes 10 and 11), generated on the chapter's voice flow o8vTamhekdpbWovwvYSp — voices/sessions.json —
# two takes each, transcribed (faster-whisper) and measured (../v22.0/cp5/meas.py: voices/measure.json):
#   z5Clotto  a   "[whispers, feverish] And the lottery... just give me the numbers. Just this once." — both say the
#                 words exactly; a is the WHISPER (56 % of it over 3 kHz, b 30 %) and its end is clean (-60.3 dB, b
#                 ends on signal, -27.8); the take runs 2 s of silence past the words, kept to 6.45 s
#   z5C7      b   "[quietly] Nothing answered. They would never feed my greed... no matter how much I asked." — a
#                 puts a hitch in "how much, I asked"; b reads it whole
#   mk5metta  b   the Karaṇīya Mettā Sutta's verse, romanised as a Thai monk says it (Arthur): b's four breaths fall
#                 on the verse's four lines exactly (0–3.44, 4.72–8.30, 9.70–12.82, 14.00–17.40 s), where a breaks
#                 "avidūre" from its line; levelled as the cast's chants are (RMS −16)
#
# THE EFFECTS (note 11), on the chapter's effects flow xots9tsBdCqsc1hPEyL3 — sfx/sessions.json — measured
# (sfx/measure.json, and pitch.py for the laughter):
#   k5joy      b  three children laughing with joy, far off: 88 % in 500 Hz–3 kHz (a phone's best band), median pitch
#                 615 Hz against a's 533 (small children), one hole against two
#   k5trickle  a  the pour into the silver bowl, rising: 92 % in the phone band, its stream to 7.6 s; b is 7 dB under it
#   k5orbin    a  a warm shimmer settling into one small bell: a clean head (-71.9 dB; b starts on signal, -39.4)
#   k5canopy   b  the breeze up through the leaves: 0.1 % under 120 Hz (a puts 16 % there, nothing a phone plays)
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, four passes (the encoders move it)
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch e_$n.wav
  p=$(peak e_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2 3 4; do   # (v24.7: four; the brightest effects, all over 3 kHz, still land within 1.2 dB on the mp3 — its
                             #  peak moves unevenly with the gain there — and the cue's own volume sets their level in a scene)
    ffmpeg -v error -y -i e_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i e_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f e_$n.wav
}
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
cast() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
fx() { # name src peak [ffmpeg filter] — an effect, in its own channel layout, peak-matched
  n=$1; s=$2; pk=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
F="--fade 0.12"
R=../v23.0/voices/raw

# ---- the owner's asks, cut (note 2)
mkdir -p proc
python3 cut.py $R/ow5wrong_b.mp3   proc/ow5wrong_cut.wav   0:2.78~3.52 8.62~9.38:end
python3 cut.py $R/ow5promise_a.mp3 proc/ow5promise_cut.wav 2.92~3.30:end
cast  ow5wrong    proc/ow5wrong_cut.wav $F
cast  ow5promise  proc/ow5promise_cut.wav $F

# ---- the new lines (notes 10, 11)
him   z5Clotto    voices/raw/z5Clotto_a.mp3 --keep 6.45 $F
him   z5C7        voices/raw/z5C7_b.mp3 $F
cast  mk5metta    voices/raw/mk5metta_b.mp3 --fade 0.3

# ---- the effects (note 11)
fx k5joy      sfx/raw/k5joy_b.mp3     -8
fx k5trickle  sfx/raw/k5trickle_a.mp3 -10 "atrim=0:8.2,asetpts=PTS-STARTPTS,afade=t=out:st=7.4:d=0.8"
fx k5orbin    sfx/raw/k5orbin_a.mp3   -8  "atrim=0:2.6,asetpts=PTS-STARTPTS,afade=t=out:st=2.1:d=0.5"
fx k5canopy   sfx/raw/k5canopy_b.mp3  -10
