#!/bin/sh
# v22.0 · EPISODE 3 CHAPTER 4, THE PIECES THAT ANSWERED — its voices (docs/V22.0-E3C4-PLAN.md CP2).
# Chad: "Every amulet should be in a different shop ... The yin one should be an eerie looking shop ... This entire
# chapter has the potential to be very cinematic and dramatic, with good storytelling."
#
# 80 lines in six voices, on the e3c4 voices flow (sessions.json — the session ids are the only handle on a
# generation), eleven_v3, two takes a line: Brian (him, bP8FJDHmWVEgXJDitdQd), two NEW speakers — the Yin shop's keeper
# (Siriporn, v2NF9R77fF8wZRdbGYTg, an old Thai woman, f0 ~168 Hz) and the Chinatown tray owner, the "towkay" (Win,
# zkPxBj0FiB6fKlz0dJBS, an old uncle, f0 ~131 Hz — between chapter 3's owner Brendon ~205 Hz and the medium Roger
# ~85 Hz, so no two old men in the chapter sound alike) — chosen by audition (previews/), and three voices chapter 3
# already has: the Golden Mile owner (rTCcr5snLtTho4KbH96N), his staff man (aFxDLa1A1dSRlzW8nziT) and the monk
# (Arthur, tX4zpyB6s34no1FgD0Mm — e3c1's, for the kruat nam verse). Transcribed locally (tr.py: faster-whisper
# small.en with word timings), measured (measure.py: head/end levels, lead/tail silence), laid side by side against
# the script (pick.py), the pauses read with gaps.py. PICKED, as always: the words exactly first, then the cleaner ends
# (eleven_v3 trims a take to its last audible sample, so many end ON signal — those are faded over 0.12 s, and where
# every take does, the one ending lowest or starting cleanest is taken), then the pauses where the script puts its
# ellipses. A take that STARTS on signal is not disqualified: the engine opens every voice over 8 ms (v5.30).
#
# FOUR LINES WERE SAID AGAIN, all four for a word the first takes did not say:
#   yk4heard  "She heard you." came back "She hurt you." in BOTH takes (the keeper's accent devoices the final d,
#             and a player would hear the same) — now "She heard your promise.", which nothing can mishear
#   yk4merit  "...for her, ah." ran the particle into the pronoun — "for Hula", "for Hulwa" — now "Go and make merit
#             for her. Don't forget, ah.", the particle on the end where it cannot join a word
#   to4A1     "Boy! Boy!" — one take clipped the B ("Moi! Moi!"), the other said it as a question with commas;
#             re-said as a shout with "Can you hear me or not?"
#   to4C2     "Come back anytime" came back "Combat any time" and "Come by any time" — now "Come again anytime, ah."
#
# THE FILM
#   z4pro1  a  the cleaner head (-52.6 against -40.8 with a 0.07 s lead); both end on signal, faded
#   z4pro2  b  the only take clean at both ends
#   z4pro3  a  the cleaner head (-74.1); both end on signal, faded
#   z4pro4  a  head -62; faded
# THE YIN SHOP
#   z4look1 b  end -37.8, faded
#   z4look2 a  head -59; faded
#   z4look3 a  head -69.9; faded
#   z4ask   b  clean at both ends
#   z4numb  b  clean at both ends
#   z4cold  b  the clean head (-58.7; a starts on the "So" at 0.04 s); its 1.35 s of trailing silence cut (keep 4.2)
#   z4beside a the ellipsis kept as a pause; clean end (-42)
#   z4yin   b  end -35.7, faded
#   yk4hello b keeps the question ("special, boy?" — a says it flat); faded
#   yk4show a  1.40 s after "A young lady..." where the script puts its ellipsis (the audition take, previews/); faded
#   yk4gentle a the cleaner head (-87); both end on signal, faded
#   yk4heard c the new words, clean at both ends (-84.8 / -55.3)
#   yk4merit c the new words, the only take with the particle heard ("Don't forget, ah?"); its 0.44 s lead cut to
#              0.14 (head 0.3) and faded (d's "ah" was heard as "Thao")
# THE MERIT FILM
#   z4tem1  b  end -44.7
#   z4dedicate a clean end; 1.30 s after "of the amulet..." where the ellipsis is; 2.31 s of trailing silence cut
#               (keep 7.2) — b ends on signal
#   z4tem2  a  clean end (-48.3); b ends on signal
#   z4han0  a  head -60.7; faded
#   mk4yatha b the Yathā vārivahā verse, its breaths kept (1.58 s the longest), clean at both ends (-85.7 / -42.6);
#              a ends on signal. Neither transcribes as Pali (a speech model hears English); the phrasing is the
#              romanisation's, said as e3c1's monk says his chants
# THE HANUMAN
#   ow4hello b  "worried about you after Buddha Day" said as one thought, the script's comma a breath; faded
#   ow4new  b  0.62 s after "Hanuman." (a rushes it) and the softer start (-29.6 against -23.8); faded
#   z4fine  a  1.84 s after "I'm okay, Uncle." — tired; faded
#   z4roar  b  both say it slowly as one breath ("Something roared inside me", 4.7 s for four words), b without
#              a start on signal; faded
#   z4urge  a  clean end (-67.9); its 0.97 s of trailing silence cut (keep 3.7) — b ends on signal
#   z4go    b  the clean head (-64, a 0.17 s lead)
#   ow4ok   a  "Hey! Boy!" as exclamations (b says "Hey, boy, what happened?" flat); both hear "Eh" as "Hey"; faded
#   sm4what a  "Boss." (b is heard as "Voss"); clean end
#   z4hide  b  the cleaner head (-58.9); both end on signal, b lower (-38.3), faded
#   z4tray0 a  1.60 s after "visited often." (b starts hard, -18.3 at 0.04 s); faded for safety
# THE TRAY
#   to4hello a "Come, sit, sit." (b runs the sits together); faded
#   to4notice a clean at both ends (the audition take, previews/)
#   to4tray b  the lower end (-20.5 against -15.0); neither pauses at "open..."; faded
#   z4sense a  clean; its 1.24 s of trailing silence cut (keep 1.75)
#   to4lersi b clean at both ends (a waits 0.85 s before it speaks); trailing silence cut (keep 4.2)
#   z4lersi b  the calmer, slower read (6.7 s), not on signal at the end (a is)
#   to4wess b  clean (-85 / -42.8), 0.64 s after "the North."
#   z4wess  b  both end on signal and lose the ellipsis; b without a start on signal; faded
#   to4naga a  "Phaya Naga. Wah." (b is heard as "Koya Naga. Oha."); trailing 1.71 s cut (keep 3.55)
#   z4naga  b  clean at both ends
#   to4unknown b "Maybe you can." said as a statement (a asks it); both end on signal (-11.6), faded
#   z4feel  a  the start off signal (-39.9, 0.12 s lead; b starts on it); faded
#   to4clock b "the clock... stopped" with its pause (a runs it on); faded
# A · "open myself all the way"
#   z4A1    b  the cleaner head (-63.3); faded
#   z4A1b   b  clean end (-49.6); a ends on signal
#   to4A1   d  the new words, 0.50 s between the two "Boy!"s; faded
#   z4A2b   a  clean end (-49.4); b ends on signal
#   to4A3   a  the clean head (-85.2), "a voice. Not yours." with the break; faded for safety
#   z4A2    a  1.72 s after "Twenty minutes..." — shaken; faded
#   to4A2   a  0.44 s after "I'm sorry..." where the script pauses (b runs it on); faded
#   z4A3    b  clean end (-50.9), 1.72 s after "It came."
#   z4A4    b  near-clean end (-41.7)
# B · "take it home"
#   z4B1    a  the cleaner head (-50.1); faded
#   to4B1   b  "treat it with respect" (a is heard as "treated with respecta"); faded
#   z4B1b   a  the cleaner head; faded
#   z4B2    a  a full stop after "bring her home." as the script has it (b runs on with "and"); faded
#   z4B3    b  "it... or me" with its 1.42 s pause (a runs it together); trailing 1.44 s cut (keep 7.0)
#   z4B5    a  1.64 s after "Uncle..." — ashamed; end -42.4, faded for safety
#   to4B2   a  clean at both ends ("Nevermind" is only the transcript's spelling)
#   z4B4    a  the cleaner head (-77.1) and lower end; faded
# C · "put it down"
#   z4C1    b  the cleaner head (-57.2); faded
#   to4C1   a  "Don't force." (b is heard as "Don't fuss."); faded
#   to4C2   c  the new words, clean; trailing 0.87 s cut (keep 2.95)
#   z4C2    a  not on signal at the end (-40.8)
#   z4C3    b  clean end, the slower troubled read (7.0 s; a ends on signal)
#   z4C4    a  clean end, the slower read (7.8 s)
# D · "a teacher"
#   z4D1    b  1.22 s after "Uncle." where the ellipsis is (a runs on with a comma)
#   to4D1   a  clean at both ends, 1.30 s after "you're right."
#   z4D2    a  "Someone who really knows?" kept a question (b says it flat); faded
#   to4D2   b  the clean head (-85.6; a starts at -39.2 with a 0.07 s lead)
#   z4D5    b  clean at both ends
#   to4D3   a  clean, 0.86 s after "this one..."; trailing 2.13 s cut (keep 3.85)
#   z4D3    a  1.92 s after "Proper guidance." and the cleaner head (-66.3); faded
#   z4D4    b  "in... just to prove" with its 1.40 s pause and a clean end; trailing 1.19 s cut (keep 6.15)
# THE CARD LINES (said under the outcome card)
#   z4A     b  clean end (-45.8)
#   z4B     a  clean at both ends
#   z4C     b  the cleaner head (-77.1), 1.14 s after "I put it down."; faded for safety
#   z4D     a  the cleaner head (-55.7); faded
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
# the film
him  z4pro1     raw/z4pro1_a.mp3     $F
him  z4pro2     raw/z4pro2_b.mp3
him  z4pro3     raw/z4pro3_a.mp3     $F
him  z4pro4     raw/z4pro4_a.mp3     $F
# the Yin shop
him  z4look1    raw/z4look1_b.mp3    $F
# z4look2 was re-said at CP5b for the paintings that replaced the photographs — cp5/make.sh (VOICE) makes it now
# him  z4look2    raw/z4look2_a.mp3    $F
him  z4look3    raw/z4look3_a.mp3    $F
him  z4ask      raw/z4ask_b.mp3
him  z4numb     raw/z4numb_b.mp3
him  z4cold     raw/z4cold_b.mp3     --keep 4.2
him  z4beside   raw/z4beside_a.mp3
him  z4yin      raw/z4yin_b.mp3      $F
cast yk4hello   raw/yk4hello_b.mp3   $F
cast yk4show    raw/yk4show_a.mp3    $F
cast yk4gentle  raw/yk4gentle_a.mp3  $F
cast yk4heard   raw/yk4heard_c.mp3
cast yk4merit   raw/yk4merit_c.mp3   --head 0.3 $F
# the merit film
him  z4tem1     raw/z4tem1_b.mp3
him  z4dedicate raw/z4dedicate_a.mp3 --keep 7.2
him  z4tem2     raw/z4tem2_a.mp3
him  z4han0     raw/z4han0_a.mp3     $F
cast mk4yatha   raw/mk4yatha_b.mp3
# the Hanuman
cast ow4hello   raw/ow4hello_b.mp3   $F
cast ow4new     raw/ow4new_b.mp3     $F
him  z4fine     raw/z4fine_a.mp3     $F
him  z4roar     raw/z4roar_b.mp3     $F
him  z4urge     raw/z4urge_a.mp3     --keep 3.7
him  z4go       raw/z4go_b.mp3
cast ow4ok      raw/ow4ok_a.mp3      $F
cast sm4what    raw/sm4what_a.mp3
him  z4hide     raw/z4hide_b.mp3     $F
him  z4tray0    raw/z4tray0_a.mp3    $F
# the tray
cast to4hello   raw/to4hello_a.mp3   $F
cast to4notice  raw/to4notice_a.mp3
cast to4tray    raw/to4tray_b.mp3    $F
him  z4sense    raw/z4sense_a.mp3    --keep 1.75
cast to4lersi   raw/to4lersi_b.mp3   --keep 4.2
him  z4lersi    raw/z4lersi_b.mp3
cast to4wess    raw/to4wess_b.mp3
him  z4wess     raw/z4wess_b.mp3     $F
cast to4naga    raw/to4naga_a.mp3    --keep 3.55
him  z4naga     raw/z4naga_b.mp3
cast to4unknown raw/to4unknown_b.mp3 $F
him  z4feel     raw/z4feel_a.mp3     $F
cast to4clock   raw/to4clock_b.mp3   $F
# A
him  z4A1       raw/z4A1_b.mp3       $F
him  z4A1b      raw/z4A1b_b.mp3
cast to4A1      raw/to4A1_d.mp3      $F
him  z4A2b      raw/z4A2b_a.mp3
cast to4A3      raw/to4A3_a.mp3      $F
him  z4A2       raw/z4A2_a.mp3       $F
cast to4A2      raw/to4A2_a.mp3      $F
him  z4A3       raw/z4A3_b.mp3
him  z4A4       raw/z4A4_b.mp3
# B
him  z4B1       raw/z4B1_a.mp3       $F
cast to4B1      raw/to4B1_b.mp3      $F
him  z4B1b      raw/z4B1b_a.mp3      $F
him  z4B2       raw/z4B2_a.mp3       $F
him  z4B3       raw/z4B3_b.mp3       --keep 7.0
him  z4B5       raw/z4B5_a.mp3       $F
cast to4B2      raw/to4B2_a.mp3
him  z4B4       raw/z4B4_a.mp3       $F
# C
him  z4C1       raw/z4C1_b.mp3       $F
cast to4C1      raw/to4C1_a.mp3      $F
cast to4C2      raw/to4C2_c.mp3      --keep 2.95
him  z4C2       raw/z4C2_a.mp3
him  z4C3       raw/z4C3_b.mp3
him  z4C4       raw/z4C4_a.mp3
# D
him  z4D1       raw/z4D1_b.mp3
cast to4D1      raw/to4D1_a.mp3
him  z4D2       raw/z4D2_a.mp3       $F
cast to4D2      raw/to4D2_b.mp3
him  z4D5       raw/z4D5_b.mp3
cast to4D3      raw/to4D3_a.mp3      --keep 3.85
him  z4D3       raw/z4D3_a.mp3       $F
him  z4D4       raw/z4D4_b.mp3       --keep 6.15
# the card lines
him  z4A        raw/z4A_b.mp3
him  z4B        raw/z4B_a.mp3
him  z4C        raw/z4C_b.mp3        $F
him  z4D        raw/z4D_a.mp3        $F
