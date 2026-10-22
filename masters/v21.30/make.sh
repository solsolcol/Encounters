#!/bin/sh
# v21.30 · THE MEDIUM'S FOUR ENDINGS, VOICED AGAIN (docs/V21.30-PLAN.md CP1). Chad: "the taoist medium should not react
# so aggressively and ask customers to get out even if the customer dont agree with the medium, this is absolutely wrong
# from a spiritual educational perspective ... All the outcome cutscenes are too simple, short, some have awkward
# silence or gaps where nothing is said, there is no proper narrative for each". The four scenes were rewritten line by
# line in the plan (§4) and approved ("Yes, build it"); these are their voices.
#
# 39 lines on the e3c3 voices flow (sessions.json — the session ids, the only handle on a generation), eleven_v3, three
# or four takes a line. Transcribed locally (tr.py: faster-whisper small.en with word timings; the assistant's short
# line cross-checked with the multilingual small model, which hears "Walk safe, huh?" in all three takes where small.en,
# primed with "Sifu", heard "Wok Sifu") and measured (measure.py: head/end levels, lead/tail silence). pick.py lays the
# takes side by side against the script, gaps.py shows the pauses. PICKED, as always: the words exactly first, then the
# cleaner ends (eleven_v3 trims a take to its last audible sample, so most end ON signal — those are faded over 0.12 s,
# and where every take does, the one ending lowest is taken), then the pauses where the script puts its ellipses:
#
# A · "the answer I was handed"
#   z3A1  d  6.56 s  the only take clean at both ends (-61.6 / -46.1); a, c end on signal, b trails 2.2 s of silence
#   md3A1 c  4.88 s  clean (-61 / -41), a calm 0.6-0.7 s between the four short sentences (a rushes them, d ends on signal)
#   z3A3  c  7.44 s  the cleanest head (-56, a 0.19 s lead); every take ends on signal, faded
#   md3A2 a  2.08 s  clean at both ends; b and c end on signal
#   as3A  b  7.76 s  the only take pausing where the script's ellipsis is ("And this one... paste it"); faded for safety
#   z3A2  c 15.28 s  a full stop after "help me" where the script has its ellipsis; b and d start ON signal, d says "I'd"
#   md3A3 a  2.56 s  every take ends on signal; a ends lowest (-31 against -20 to -27), faded
#   z3A4  d  9.04 s  clean at both ends (-58 / -44)
#   z3A5  c  6.96 s  every take ends on signal; c ends lowest (-35), faded
# B · "certainty against certainty"
#   z3B1  a  4.72 s  firm full stops between all four ("No. [0.46] You're wrong. [0.52] ..."); clean ends
#   md3B1 a  2.64 s  clean end (-44.9)
#   md3B2 c  3.76 s  the only take pausing at "Take this..." (0.36 s); every take ends on signal, faded
#   z3B3  c  1.04 s  the only clean end of three
#   md3B3 b  4.00 s  clean at both ends (-85 / -74)
#   as3B  c  1.60 s  the unhurried read ("Walk safe-ah", the particle on the end); clean ends
#   z3B2  c  5.36 s  the question kept ("A ghost?"; b says it flat), the lowest end of the clean-headed takes, faded
#   z3B4  a  6.24 s  near-clean end (-40.2, faded anyway)
#   z3B5  a  8.72 s  clean end (-41.8)
#   z3B6  a  6.08 s  clean end (-49.2)
# C · "a second opinion"
#   z3C1  d  3.84 s  b starts ON signal; d ends lowest (-34), faded
#   md3C  a  5.04 s  clean at both ends ("Hmm." where the script says "Mm." — the registry says what is heard)
#   z3C2  c  9.28 s  1.4 s after "A ghost." and 1.2 s after "the Buddha." (the two ellipses); end -36.9, faded
#   z3C3  c  2.24 s  the cleanest of three (-74 / -38), faded
#   ow3C1 a  6.32 s  every take starts on the "Ah" (the engine's 8 ms voice edge takes it); a ends lowest, faded
#   z3C4  c  4.32 s  0.72 s after "He said..." (b runs it on); faded
#   ow3C2 a 14.16 s  the only take that says "Hm..." after "Ghost?"; faded
#   z3C5  a 12.56 s  a pause at both ellipses ("Both kind... both so sure", "right... and"); faded
#   z3C6  c  6.72 s  clean; its 2.0 s of trailing silence cut (keep 5.0 s)
# D · "the honest answer"
#   z3D1  b 10.08 s  clean at both ends (-43 / -48), a held breath after "something?"
#   md3D  a  2.16 s  clean (-81 / -53)
#   md3D2 d  9.60 s  clean at both ends (-55 / -50); c drops "it", b says "Tai"
#   md3D3 a  2.08 s  clean (-84 / -69)
#   z3D2  d  8.32 s  clean; its 2.3 s of trailing silence cut (keep 6.3 s), the pause after "honestly" kept
#   z3D3  c 11.76 s  a says "Of Thevada", d "Tevada"; c ends lowest of the rest, faded
#   z3D4  d 13.60 s  the balanced read (b is clean-ended but drags to 15.9 s); faded
# The roar film (Chad, mid-build: "the 360 orbit around the hanuman takes way too long, shorten the duration, and speed
# up the 360 orbit. And during the orbit duration, add a player voiceline saying, 'i feel something roaring through
# me...' then the lunge and roar happens") — four takes under [strained, overwhelmed]
#   z3roar c  4.24 s  the only take clean at both ends (-55.8 / -60.5, 0.15 s of its own silence after "me"); 1.45 s
#                     held after "something..." (b and d end ON signal; a runs "something roaring" together)
# The four card lines (said under the outcome card)
#   z3A   a  3.52 s  c starts ON signal; a ends lower than b, faded
#   z3B   a  3.68 s  1.16 s between its two sentences; faded
#   z3C   b  3.76 s  the only take that keeps the comma's breath ("opinion, and"); faded
#   z3D   c  3.52 s  the cleanest head (-63) and end (-39), faded
# The cast on the flat cast bus by RMS -16 (v11.1); him on the v16.0/v18.6 chain (high-pass 70 Hz, mono, peak -6.85).
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
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
cast() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
F="--fade 0.12"
# A
him  z3A1  raw/z3A1_d.mp3
cast md3A1 raw/md3A1_c.mp3
him  z3A3  raw/z3A3_c.mp3  $F
cast md3A2 raw/md3A2_a.mp3
cast as3A  raw/as3A_b.mp3  $F
him  z3A2  raw/z3A2_c.mp3  $F
cast md3A3 raw/md3A3_a.mp3 $F
him  z3A4  raw/z3A4_d.mp3
him  z3A5  raw/z3A5_c.mp3  $F
# B
him  z3B1  raw/z3B1_a.mp3
cast md3B1 raw/md3B1_a.mp3
cast md3B2 raw/md3B2_c.mp3 $F
him  z3B3  raw/z3B3_c.mp3
cast md3B3 raw/md3B3_b.mp3
cast as3B  raw/as3B_c.mp3
him  z3B2  raw/z3B2_c.mp3  $F
him  z3B4  raw/z3B4_a.mp3  $F
him  z3B5  raw/z3B5_a.mp3
him  z3B6  raw/z3B6_a.mp3
# C
him  z3C1  raw/z3C1_d.mp3  $F
cast md3C  raw/md3C_a.mp3
him  z3C2  raw/z3C2_c.mp3  $F
him  z3C3  raw/z3C3_c.mp3  $F
cast ow3C1 raw/ow3C1_a.mp3 $F
him  z3C4  raw/z3C4_c.mp3  $F
cast ow3C2 raw/ow3C2_a.mp3 $F
him  z3C5  raw/z3C5_a.mp3  $F
him  z3C6  raw/z3C6_c.mp3  --keep 5.0 $F
# D
him  z3D1  raw/z3D1_b.mp3
cast md3D  raw/md3D_a.mp3
cast md3D2 raw/md3D2_d.mp3
cast md3D3 raw/md3D3_a.mp3
him  z3D2  raw/z3D2_d.mp3  --keep 6.3 $F
him  z3D3  raw/z3D3_c.mp3  $F
him  z3D4  raw/z3D4_d.mp3  $F
# the roar film
him  z3roar raw/z3roar_c.mp3
# the card lines
him  z3A   raw/z3A_a.mp3   $F
him  z3B   raw/z3B_a.mp3   $F
him  z3C   raw/z3C_b.mp3   $F
him  z3D   raw/z3D_c.mp3   $F
