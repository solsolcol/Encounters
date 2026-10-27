#!/bin/sh
# v23.0 CP11 · EPISODE 3 CHAPTER 5, THE CHILDREN ON MY ALTAR — its sound (docs/V23.0-E3C5-PLAN.md §9).
# Every take was generated on the e3c5 flows (the session ids in voices/, sfx/ and music/sessions.json are the only handle
# on a generation), measured, and picked by measurement; the reasons are below, one line per sound.
#
# THE VOICES — 92 lines on voices flow o8vTamhekdpbWovwvYSp, two takes a line (eleven_v3; the children eleven_v4):
# Brian (him, bP8FJDHmWVEgXJDitdQd), the Golden Mile owner (rTCcr5snLtTho4KbH96N, chapter 3's), Ma (Matilda,
# XrExE9yKIg1WjnnlVkGX — episode 1's), the monk (Arthur, tX4zpyB6s34no1FgD0Mm — e3c1's). The monk's verse (mk5yatha) is
# chapter 4's take under this chapter's name. Transcribed locally (voices/tr.py, faster-whisper small.en with word
# timings), measured (voices/measure.py), ranked by voices/autopick.py: the words exactly first, then an end that is not
# ON signal, then the quieter head, then the pauses where the script has its ellipses. eleven_v3 trims a take to its last
# audible sample, so many end ON signal: those are faded over 0.12 s ($F), as at every release since v21.0.
# THE CHILDREN speak THROUGH HIM, so they are his voice in a child's register (voices/child.py: median f0, voiced share):
# eleven_v3 kept Brian at his own ~90-140 Hz whatever the tag; eleven_v4 lifted the bossy and giggling lines to
# 200-350 Hz, and the quiet ones needed "[as a five-year-old boy, small high voice, ...]" or "[in a high, small child's
# voice, ...]" (the _hiA / _hiB takes) to reach 160-200 Hz. Nothing is pitch-shifted.
#
#   z5pro1      b        both end on signal, this one starts cleaner (head -62 against -48)
#   ow5hello    a        both end on signal, this one starts cleaner (head -36 against -25)
#   z5yinq      a        both end on signal, this one starts cleaner (head -52 against -42)
#   ow5yin      a        both end on signal, this one starts cleaner (head -29 against -28)
#   ow5monk     b        both end on signal, this one starts cleaner (head -32 against -29)
#   ow5red      b        both end on signal; faded
#   ow5shy      a        both end on signal, this one starts cleaner (head -38 against -35)
#   ow5little   b        both end on signal, this one starts cleaner (head -38 against -28)
#   ow5give     a        both end on signal, this one starts cleaner (head -29 against -26)
#   z5children  a        both end on signal, this one starts cleaner (head -59 against -33)
#   ow5never    a        the first take after all: the re-said pair (ow5never2) was made because the transcriber heard "listen, ah" as "listener" — biased with the script it hears "listen ah..." in all four takes (LEARNINGS); a has the quietest head and end (-31 / -28) and the script's comma ("not for money, not for lottery numbers")
#   ow5wrong    b        both end on signal, this one starts cleaner (head -32 against -29)
#   ow5promise  a        both end on signal, this one starts cleaner (head -30 against -26)
#   z5promise   b        clean end (-54; a ends on signal)
#   ow5careful  b        both end on signal, this one starts cleaner (head -28 against -28)
#   z5pro2      b        both end on signal, this one starts cleaner (head -56 against -54)
#   z5pro3      a        clean end (-41; b ends on signal)
#   z5pro4      a        both end on signal, this one starts cleaner (head -68 against -44)
#   z5water     a        both end on signal, this one starts cleaner (head -66 against -56)
#   z5bag       b        both end on signal, this one starts cleaner (head -40 against -27)
#   z5red       a        both end on signal, this one starts cleaner (head -53 against -53)
#   z5shy       b        clean end (-64; a ends on signal)
#   z5little    a        clean end (-57; b ends on signal)
#   z5stiff     a        clean end (-43; b ends on signal)
#   z5incense   b        both end on signal, this one starts cleaner (head -46 against -20)
#   z5eat       a        both end on signal, this one starts cleaner (head -50 against -48)
#   z5dedic     a        clean at both ends (head -52, end -54)
#   z5wonder    b        clean end (-66; a ends on signal)
#   z5ask       b        both end on signal, this one starts cleaner (head -58 against -47)
#   z5loose     a        both end on signal; faded
#   z5b1        v4_a     v4, a bossy small boy (~300 Hz): "Mine. These are all mine." whole; clean end
#   z5b2        v4_a     v4, the bossy one: both "Nobody"s, the cleaner head (-50)
#   z5b3        v4_a     v4, the bossy one, "More. I want more." whole; clean end
#   z5b4        hiB_a    v4 under "[in a high, small child's voice]" (~172 Hz): the hurt line quiet and small; the v3 takes kept Brian's own register
#   z5back1     b        clean end (-45; a ends on signal)
#   z5back1b    b        clean end (-65; a ends on signal)
#   z5again1    a        clean at both ends (head -59, end -50)
#   z5s1        v4_a     v4, the shy one's giggle and "you can't see me"; clean at both ends
#   z5s2        v4_a     v4, the shy one whispering "hide... hide..."; the clean head (-62)
#   z5s3        hiB_a    v4 under the child direction (~258 Hz); it says the line and then again, so it is cut after the first "my secret" (keep 2.3)
#   z5s4        hiA_a    v4 under the child direction (~196 Hz), both halves with the pause between them
#   z5back2     b        clean at both ends (head -59, end -52)
#   z5back2b    b        both end on signal, this one starts cleaner (head -65 against -57)
#   z5again2    b        both end on signal, this one starts cleaner (head -36 against -33)
#   z5l1        hiB_a    v4 under the child direction (~163 Hz), very soft; clean at both ends
#   z5l2        v4_b     v4 (~182 Hz), the question kept a question; a repeats "you won't go"
#   z5l3        v4_b     v4 (~326 Hz), "Stay... stay with me" said once; a says it twice
#   z5sob       v4_a     v4, a small boy's quiet sob (wordless — the transcriber hears breaths as "hehe")
#   z5out       a        clean end (-44; b ends on signal)
#   z5come      b        clean at both ends (head -52, end -54)
#   z5gasp      b        clean at both ends (head -52, end -48)
#   z5time      b        both end on signal, this one starts cleaner (head -66 against -65)
#   z5felt      b        both end on signal, this one starts cleaner (head -78 against -72)
#   z5fasc      a        both end on signal, this one starts cleaner (head -75 against -63)
#   z5A1        a        both end on signal, this one starts cleaner (head -63 against -57)
#   z5A2        b        clean end (-46; a ends on signal)
#   ma5vm       b        clean at both ends (head -85, end -45)
#   z5A3        b        both end on signal, this one starts cleaner (head -45 against -38)
#   z5Agig      v4_b     v4, the dry small giggle out of his own mouth (~250 Hz)
#   z5A4        a        both end on signal, this one starts cleaner (head -63 against -59)
#   z5A5        b        clean end (-45; a ends on signal)
#   z5A6        b        clean at both ends (head -52, end -41)
#   z5B1        b        both end on signal, this one starts cleaner (head -56 against -43)
#   z5B2        b        clean end (-46; a ends on signal)
#   z5B3        b        clean end (-40; a ends on signal)
#   z5B4        b        both end on signal, this one starts cleaner (head -59 against -44)
#   z5B5        b        both end on signal, this one starts cleaner (head -54 against -46)
#   z5B6        a        both end on signal, this one starts cleaner (head -71 against -49)
#   z5C1        a        clean at both ends (head -66, end -52)
#   z5C2        b        clean at both ends (head -57, end -40)
#   z5C3        a        both end on signal, this one starts cleaner (head -63 against -56)
#   z5C4        a        both end on signal, this one starts cleaner (head -61 against -54)
#   z5Cevil     b        clean end (-46; a ends on signal)
#   z5Claugh    b        clean at both ends (head -53, end -51)
#   z5C5        a        clean end (-45; b ends on signal)
#   z5C6        a        both end on signal, this one starts cleaner (head -75 against -60)
#   z5C7        a        both end on signal, this one starts cleaner (head -58 against -54)
#   z5D1        b        clean end (-49; a ends on signal)
#   z5D2        a        clean end (-45; b ends on signal)
#   z5D3        a        both end on signal, this one starts cleaner (head -49 against -29)
#   z5D4        a        both end on signal, this one starts cleaner (head -85 against -48)
#   mk5teach    a        both end on signal, this one starts cleaner (head -41 against -38)
#   z5D5        b        both end on signal, this one starts cleaner (head -56 against -48)
#   z5D6        b        clean end (-45; a ends on signal)
#   z5epi0      b        clean at both ends (head -66, end -44)
#   z5epi1      b        clean at both ends (head -84, end -61)
#   z5epi2      a        both end on signal, this one starts cleaner (head -41 against -30)
#   z5epi3      b        both end on signal, this one starts cleaner (head -56 against -39)
#   z5A         a        clean end (-43; b ends on signal)
#   z5B         a        both end on signal, this one starts cleaner (head -56 against -49)
#   z5C         b        both end on signal, this one starts cleaner (head -69 against -34)
#   z5D         a        both end on signal, this one starts cleaner (head -55 against -44)
#
# THE EFFECTS — 70 on effects flow xots9tsBdCqsc1hPEyL3 (eleven_text_to_sound_v2, duration_seconds as a PARAMETER — the
# v9.2 law — prompt_influence 0.5, two takes each), measured with ../v22.0/cp5/meas.py: the share of each take under
# 120 Hz (a phone plays it as nothing, v10.4), in 120-500 Hz, 500 Hz-3 kHz and over 3 kHz; its onset, its end, its holes;
# a take is MEASURED, never assumed (v12.1: four of these came back silent — k5slam a, k5bonk a, k5ping b, k5scuttle a).
#   k5giggle    the effects model REFUSED it: "A small child's soft muffled giggle from behind furniture" was blocked by
#               its terms filter in both takes (charged). Not re-worded to get past a filter: it is the shy one's own
#               giggle instead, the first 1.55 s of the second v4 take of z5s1 (voices/raw/z5s1_v4_b — "Hehehe."
#               before "You can't see me", ~182 Hz median, a child's register), softened above 5 kHz
#   k5bundle     a  cloth on glass with a body (26 % in 500 Hz-3 kHz); b is 86 % sub-bass, nothing on a phone
#   k5figset     a  the cleaner head (-31.8 against -26.3); one soft clack
#   k5bellsfaint b  the longer, softer decay (rings to 2.35 s; a stops at 1.85)
#   k5wind       b  the cleaner tail (-72.7); both are the dry ratchet a box key makes
#   k5pen        a  the pen scratch (66 % in 120-500 Hz, the hole a pause between words); b is 62 % sub-bass; faded (it ends while writing)
#   k5chantlow   b  the cleaner head (-74.7); 53 % in 500 Hz-3 kHz, so the far voice is heard on a phone; wordless, as asked
#   k5door       b  the latch and the swing (58 % in 500 Hz-3 kHz); a is 94 % sub-bass, a thud only
#   k5switch     b  the click at 0.05 s (a waits 0.3 s before it clicks)
#   k5unwrap     a  the fuller paper-and-cloth rustle (5.6 dB more than b)
#   k5rain       b  the steadier, fuller rain (81 % in 500 Hz-3 kHz)
#   k5steps      a  six steps to 4.7 s on the tiles (b stops at 3.95)
#   k5bag        a  the cleaner head (-53.5); bottles inside the bag heard (48 % over 3 kHz)
#   k5bottleout  a  the crinkle and the bottle, a clean head (-66)
#   k5ratchet    b  ONE click, as asked (it ends at 0.1 s; a rattles on to 0.4)
#   k5stiff      b  the clean start (-50.6 at 0.1 s; a starts on signal)
#   k5seal       a  the tamper ring's crack (b is 11 dB quieter and mostly hiss)
#   k5hiss       b  the longer fizz (0.6 s against 0.3) with a clean tail
#   k5capoff     a  both lifted and set down (b stops at the lift)
#   k5foam       b  the longer rise (1.3 s)
#   k5tear       a  the cleaner tail (-74.2 against -57.1)
#   k5slide      a  the straw's squeak in the phone band (87 % in 500 Hz-3 kHz), a clean tail
#   k5bubbles    a  11 dB more than b, 79 % in the phone band
#   k5plip       a  one plip, a softer attack than b (-16 against -6 at the head)
#   k5bend       a  the cleaner tail (-71.9)
#   k5set        b  the cleaner head (-43.9); the soft knock in the phone band
#   k5spark      a  the flint, clean at the head (-68.7)
#   k5flick      b  the scrape and the flame (45 % over 3 kHz; a is 62 % sub-bass)
#   k5catch      b  the crackle (77 % over 3 kHz; a is half sub-bass); its 0.3 s lead cut
#   k5wave       a  the whoosh of air (67 % in 120-500 Hz); b is all sub-bass
#   k5sand       b  the cleaner tail (-71.2)
#   k5wai        b  the sleeves' rustle, 2 dB more than a (both are quiet, -35/-37 at the peak)
#   k5loosen     r2 a  RE-MADE: the first pair was all sub-bass hum (96-100 %); r2 a is the breath into a glowing tone, 100 % in the phone band, clean at both ends
#   k5glint      a  the cleaner decay (-81.8)
#   k5rise       b  the airy shimmer, as asked (a is one tone); its 0.35 s lead cut
#   k5enter      b  the breathy swell in the phone band (94 % in 500 Hz-3 kHz); a is quiet and late
#   k5enter2     a  the cleaner tail (-72.1 against -56.9)
#   k5leave      a  the shimmer receding, as asked (b is a hum)
#   k5leave2     a  the louder of two soft hums (both 120-500 Hz)
#   k5stamp      a  a foot on wood a phone can hear (65 % in 120-500 Hz); b is 97 % sub-bass
#   k5rattle     a  the clean start (0.15 s in; b starts on signal)
#   k5thud       a  the carton heard (49 % in 500 Hz-3 kHz)
#   k5slurp      a  the greedy slurp in the phone band (68 %)
#   k5slam       b  the smack (a is silent: -34 dBFS and all sub-bass)
#   k5bump       b  more of it in the band a phone plays (52 % in 120-500 Hz against 35)
#   k5scurry     a  small feet in the phone band (79 %); b is half sub-bass
#   k5peek       a  the cloth's rustle (72 % over 3 kHz)
#   k5scuttle    b  palms and knees heard (62 % over 3 kHz; a is 68 % sub-bass)
#   k5coin       a  the ring, the roll and the stop, with a clean tail (-81.6; b ends on its roll)
#   k5bonk       b  the hollow bonk (a is silent: -34.7 dBFS)
#   k5bells      a  the longer jingle (to 1.85 s)
#   k5hair       b  the wash with a clean tail (a holds at -12 dB to its last sample)
#   k5tick       a  the ember's crackle (96 % over 3 kHz; b is 80 % sub-bass); its 0.35 s lead cut
#   k5pull       a  the tug under water, less sub-bass than b (6 % against 27)
#   k5surface    a  the whole rush, to 2.2 s (b is over by 1.1)
#   k5calm       a  the wind chime in the phone band (88 %); b is 73 % sub-bass
#   k5koel       a  the koel's call, all of it in the phone band
#   k5window     a  the slide in the band a phone plays (60 % in 120-500 Hz); b is half sub-bass
#   k5doorbell   a  the two tones with a clean decay (-77.4); muffled at 2.4 kHz — it is heard through his door
#   k5buzz       a  the rattle with the cleaner tail (-49 against -26)
#   k5wake       b  the start-up chime (84 % over 3 kHz); a is only the fan
#   k5type       a  keystrokes in runs with pauses (54 % over 3 kHz; b is half sub-bass)
#   k5post       b  the soft send in the phone band (a is a 95 % sub-bass thump)
#   k5ping       b  a bright ping (95 % in the phone band); a is a low blip
#   k5scroll     a  a short swipe of skin on glass (to 0.2 s)
#   k5dm         a  the two rising tones, 9 dB more than b
#   k5delete     b  the swoosh 17 dB more than a
#   k5tape       a  the pull and the press, a clean head; its 0.3 s lead cut
#   k5slip       b  the paper's whisper with a body (63 % in 500 Hz-3 kHz)
#   k5pin        a  the poke, 2 dB more than b
#   k5crumple    a  the paper heard (46 % over 500 Hz; b is 83 % sub-bass)
#
# THE BEDS (looped by hand: ../v22.0/cp9/loopfast.py flattens the slow drift and crossfades the tail over the head, so
# the joint is continuous by construction; levelled by RMS with ../v21.12/level_rms.py, v21.13's recipe):
#   k5nightbed  r2 b  RE-MADE: the first pair was 88-91 % under 120 Hz (an air-con a phone cannot play); r2 asked for
#                     the crickets through the open window and the air-con's airy whir — 93 % over 3 kHz, steady, no holes
#                     (a dips 14 dB at 4 s)
#   k5deep      r2 a  RE-MADE for the same reason (the first pair 96 % sub-bass): near silence with a far tap dripping
#                     five times between 9 and 17 s, 67 % of it over 500 Hz (r2 b is a 75 % sub-bass hum)
#   k5dawnbed   b     koels, mynas, the bus and the broom with no holes (a has 15)
#   k5under     a     the muffled hum and the bubbles, less sub-bass than b (24 % against 35)
#   k5fan       COPY of chapter 3's shrinefan (v21.12, the blades' swish a phone can hear): both of this chapter's fan
#               takes, and both re-made ones, came back 83-99 % under 120 Hz — a motor's hum, which a phone plays as nothing
#   k5shopair, k5mall  COPIES of chapter 4's h4air and h4mall (the Golden Mile shop and its corridor after hours)
#
# THE MUSIC — music flow CYNtKVY1iCq6HUIHF6Ki, eleven_music_v2_5, instrumental. ONE LULLABY: k5lullaby (four takes):
#   k5lullaby   b     C major, 3/4 at 72/min (music/tune.py), its phrase played twice as asked (the strongest self-repeat
#                     of the four, 0.623 at 10.25 s), no holes (a and c have two each), 98.6 % in 500 Hz-3 kHz
# THE MOTIF DOES NOT CARRY THROUGH THE MODEL: the theme told against it through the music node's audio input (k5theme,
# its one take that did not fail) came back in G MAJOR with a melody of its own — the reference sets nothing a cue can
# keep. So every cue is asked IN THE LULLABY'S KEY AND LILT (C major, 3/4, ~72/min — every take came back in C), the box
# plays the lullaby ITSELF wherever it is wound (the counter, every night, endings C and D), and the box's three fates
# are made from that one take offline (music/fates.py): the ending a player reaches is heard as what became of the box.
#   k5theme     theme2 b  the lilt the lullaby has (71/min, its phrase repeating at 7 s), thinning to its end (-37, -52)
#   k5care      b     steady (-11 to -15 dB the whole 40 s) with 40 % of it in 500 Hz-3 kHz — a puts 71 % in 120-500 Hz,
#                     the band his voice lives in, under every line of the offerings (the v5.27 masking measure)
#   k5night     b     the held tone, flat (-27 to -37 dB); a jumps 20 dB at 16 s
#   k5red       a     the march falls away in its last quarter as asked (-17 -> -27 -> -32 -> -39 -> -53); b never does
#   k5shy       a     the tiptoe stops 18-20 s in (-56 dB) and comes back: cued at the peek (3.0 s), that is the scene's
#                     wait under the desk (21.0) to the second; b never pauses
#   k5lonely    a     81 % in 500 Hz-3 kHz (the flute, legato), ending at 27 s; b puts 45 % in his voice's band
#   k5climb     a     the swell a phone can hear (72 % in 500 Hz-3 kHz, peaking 10 s in); b is 64 % sub-bass
#   k5after     a     the held note, soft and fading (-28 to -41, out by 16.5 s); b holds at -22 to -30
#   k5endD      a     blooms -30 -> -20 and settles, out at 18 s — under D's years (80.5 -> the fade at 97.1); b is
#                     over by 15 s, which would leave a silence before the fade
#   k5epi       a     the swell near its end (-15 dB at 24-26 s) and the chord ringing out; b opens on 2.5 s of silence
#   k5endA, k5endB, k5endC, k5boxfast, k5boxstop — music/fates.py, from k5lullaby b (nothing generated)
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
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
cast() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py p_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
phone() { # Ma's voicemail through his phone's little speaker: the v4.9 handset (high-pass 280, low-pass 3300) and a
  # gentle drive, then the cast's level
  n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=280:poles=2,highpass=f=280:poles=2,lowpass=f=3300:poles=2,lowpass=f=3300:poles=2,volume=6dB,asoftclip=type=tanh,volume=-6dB" ph_$n.wav
  python3 ../v11.1/level.py ph_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (phone, RMS -16)"; rm -f ph_$n.wav wc_$n.wav wc_$n.wav.f32 p_$n.wav; }
fx() { # name src peak [ffmpeg filter] — an effect, in its own channel layout, peak-matched
  n=$1; s=$2; pk=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
copy() { cp ../../assets/audio/$1.mp3 ../../assets/audio/$2.mp3; cp ../../assets/audio-opus/$1.ogg ../../assets/audio-opus/$2.ogg; echo "$2 <- $1 (bytes)"; }
bed() { # name src target_rms ceiling — looped by hand, levelled by RMS
  n=$1; s=$2; t=$3; c=$4
  ffmpeg -v error -y -i "$s" -af "highpass=f=60:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v22.0/cp9/loopfast.py b_hp_$n.wav b_lp_$n.wav 1.5
  python3 ../v21.12/level_rms.py b_lp_$n.wav b_$n.wav $t $c
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (bed, RMS $t)"; rm -f b_hp_$n.wav b_lp_$n.wav b_$n.wav b_*.f32; }
mus() { # name src [ffmpeg filter] — music, stereo, peak -3 (v22.4's f4music), Opus 128k
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }
F="--fade 0.12"

# ---- copies, byte for byte (the v21.1 split law: this chapter's own names, so chapter 4's pack is never asked for)
copy m4bell k5tbell; copy m4pour k5pour; copy m4ground k5ground; copy m4rise k5lights
copy h4shutter k5shutter; copy f4shopbell k5shopbell; copy mk4yatha mk5yatha
copy h4air k5shopair; copy h4mall k5mall; copy shrinefan k5fan

# ---- the voices
him   z5pro1      voices/raw/z5pro1_b.mp3 $F
cast  ow5hello    voices/raw/ow5hello_a.mp3 $F
him   z5yinq      voices/raw/z5yinq_a.mp3 $F
cast  ow5yin      voices/raw/ow5yin_a.mp3 $F
cast  ow5monk     voices/raw/ow5monk_b.mp3 $F
cast  ow5red      voices/raw/ow5red_b.mp3 $F
cast  ow5shy      voices/raw/ow5shy_a.mp3 $F
cast  ow5little   voices/raw/ow5little_b.mp3 $F
cast  ow5give     voices/raw/ow5give_a.mp3 $F
him   z5children  voices/raw/z5children_a.mp3 $F
cast  ow5never    voices/raw/ow5never_a.mp3 $F
cast  ow5wrong    voices/raw/ow5wrong_b.mp3 $F
cast  ow5promise  voices/raw/ow5promise_a.mp3 $F
him   z5promise   voices/raw/z5promise_b.mp3
cast  ow5careful  voices/raw/ow5careful_b.mp3 $F
him   z5pro2      voices/raw/z5pro2_b.mp3 $F
him   z5pro3      voices/raw/z5pro3_a.mp3
him   z5pro4      voices/raw/z5pro4_a.mp3 $F
him   z5water     voices/raw/z5water_a.mp3 $F
him   z5bag       voices/raw/z5bag_b.mp3 $F
him   z5red       voices/raw/z5red_a.mp3 $F
him   z5shy       voices/raw/z5shy_b.mp3
him   z5little    voices/raw/z5little_a.mp3
him   z5stiff     voices/raw/z5stiff_a.mp3
him   z5incense   voices/raw/z5incense_b.mp3 $F
him   z5eat       voices/raw/z5eat_a.mp3 $F
him   z5dedic     voices/raw/z5dedic_a.mp3
him   z5wonder    voices/raw/z5wonder_b.mp3 --keep 5.35
him   z5ask       voices/raw/z5ask_b.mp3 $F
him   z5loose     voices/raw/z5loose_a.mp3 $F
him   z5b1        voices/raw/z5b1_v4_a.mp3
him   z5b2        voices/raw/z5b2_v4_a.mp3
him   z5b3        voices/raw/z5b3_v4_a.mp3
him   z5b4        voices/raw/z5b4_hiB_a.mp3
him   z5back1     voices/raw/z5back1_b.mp3
him   z5back1b    voices/raw/z5back1b_b.mp3 --keep 4.95
him   z5again1    voices/raw/z5again1_a.mp3
him   z5s1        voices/raw/z5s1_v4_a.mp3
him   z5s2        voices/raw/z5s2_v4_a.mp3
him   z5s3        voices/raw/z5s3_hiB_a.mp3 --keep 2.3
him   z5s4        voices/raw/z5s4_hiA_a.mp3
him   z5back2     voices/raw/z5back2_b.mp3
him   z5back2b    voices/raw/z5back2b_b.mp3 $F
him   z5again2    voices/raw/z5again2_b.mp3 $F
him   z5l1        voices/raw/z5l1_hiB_a.mp3
him   z5l2        voices/raw/z5l2_v4_b.mp3
him   z5l3        voices/raw/z5l3_v4_b.mp3
him   z5sob       voices/raw/z5sob_v4_a.mp3
him   z5out       voices/raw/z5out_a.mp3
him   z5come      voices/raw/z5come_b.mp3 --keep 3.65
him   z5gasp      voices/raw/z5gasp_b.mp3
him   z5time      voices/raw/z5time_b.mp3 $F
him   z5felt      voices/raw/z5felt_b.mp3 $F
him   z5fasc      voices/raw/z5fasc_a.mp3 $F
him   z5A1        voices/raw/z5A1_a.mp3 $F
him   z5A2        voices/raw/z5A2_b.mp3
phone ma5vm       voices/raw/ma5vm_b.mp3
him   z5A3        voices/raw/z5A3_b.mp3 $F
him   z5Agig      voices/raw/z5Agig_v4_b.mp3
him   z5A4        voices/raw/z5A4_a.mp3 $F
him   z5A5        voices/raw/z5A5_b.mp3
him   z5A6        voices/raw/z5A6_b.mp3
him   z5B1        voices/raw/z5B1_b.mp3 $F
him   z5B2        voices/raw/z5B2_b.mp3
him   z5B3        voices/raw/z5B3_b.mp3
him   z5B4        voices/raw/z5B4_b.mp3 $F
him   z5B5        voices/raw/z5B5_b.mp3 $F
him   z5B6        voices/raw/z5B6_a.mp3 $F
him   z5C1        voices/raw/z5C1_a.mp3
him   z5C2        voices/raw/z5C2_b.mp3
him   z5C3        voices/raw/z5C3_a.mp3 $F
him   z5C4        voices/raw/z5C4_a.mp3 $F
him   z5Cevil     voices/raw/z5Cevil_b.mp3
him   z5Claugh    voices/raw/z5Claugh_b.mp3
him   z5C5        voices/raw/z5C5_a.mp3
him   z5C6        voices/raw/z5C6_a.mp3 $F
him   z5C7        voices/raw/z5C7_a.mp3 $F
him   z5D1        voices/raw/z5D1_b.mp3
him   z5D2        voices/raw/z5D2_a.mp3
him   z5D3        voices/raw/z5D3_a.mp3 $F
him   z5D4        voices/raw/z5D4_a.mp3 $F
cast  mk5teach    voices/raw/mk5teach_a.mp3 $F
him   z5D5        voices/raw/z5D5_b.mp3 $F
him   z5D6        voices/raw/z5D6_b.mp3
him   z5epi0      voices/raw/z5epi0_b.mp3
him   z5epi1      voices/raw/z5epi1_b.mp3 --keep 8.10
him   z5epi2      voices/raw/z5epi2_a.mp3 $F
him   z5epi3      voices/raw/z5epi3_b.mp3 $F
him   z5A         voices/raw/z5A_a.mp3
him   z5B         voices/raw/z5B_a.mp3 $F
him   z5C         voices/raw/z5C_b.mp3 $F
him   z5D         voices/raw/z5D_a.mp3 $F

# ---- the effects
fx k5bundle     sfx/raw/k5bundle_a.mp3 -8
fx k5figset     sfx/raw/k5figset_a.mp3 -8
fx k5bellsfaint sfx/raw/k5bellsfaint_b.mp3 -10
fx k5wind       sfx/raw/k5wind_b.mp3 -6
fx k5pen        sfx/raw/k5pen_a.mp3 -8 "afade=t=out:st=1.55:d=0.2"
fx k5chantlow   sfx/raw/k5chantlow_b.mp3 -8
fx k5door       sfx/raw/k5door_b.mp3 -6
fx k5switch     sfx/raw/k5switch_b.mp3 -8
fx k5unwrap     sfx/raw/k5unwrap_a.mp3 -8
fx k5rain       sfx/raw/k5rain_b.mp3 -10
fx k5steps      sfx/raw/k5steps_a.mp3 -8
fx k5bag        sfx/raw/k5bag_a.mp3 -8
fx k5bottleout  sfx/raw/k5bottleout_a.mp3 -8
fx k5ratchet    sfx/raw/k5ratchet_b.mp3 -8
fx k5stiff      sfx/raw/k5stiff_b.mp3 -6
fx k5seal       sfx/raw/k5seal_a.mp3 -8
fx k5hiss       sfx/raw/k5hiss_b.mp3 -10
fx k5capoff     sfx/raw/k5capoff_a.mp3 -8
fx k5foam       sfx/raw/k5foam_b.mp3 -10
fx k5tear       sfx/raw/k5tear_a.mp3 -8
fx k5slide      sfx/raw/k5slide_a.mp3 -8
fx k5bubbles    sfx/raw/k5bubbles_a.mp3 -8
fx k5plip       sfx/raw/k5plip_a.mp3 -6
fx k5bend       sfx/raw/k5bend_a.mp3 -8
fx k5set        sfx/raw/k5set_b.mp3 -8
fx k5spark      sfx/raw/k5spark_a.mp3 -6
fx k5flick      sfx/raw/k5flick_b.mp3 -6
fx k5catch      sfx/raw/k5catch_b.mp3 -8 "atrim=0.25,asetpts=PTS-STARTPTS"
fx k5wave       sfx/raw/k5wave_a.mp3 -8
fx k5sand       sfx/raw/k5sand_b.mp3 -8
fx k5wai        sfx/raw/k5wai_b.mp3 -10
fx k5loosen     sfx/raw/k5loosen_r2_a.mp3 -8
fx k5glint      sfx/raw/k5glint_a.mp3 -8
fx k5rise       sfx/raw/k5rise_b.mp3 -8 "atrim=0.30,asetpts=PTS-STARTPTS"
fx k5enter      sfx/raw/k5enter_b.mp3 -8
fx k5enter2     sfx/raw/k5enter2_a.mp3 -8
fx k5leave      sfx/raw/k5leave_a.mp3 -8
fx k5leave2     sfx/raw/k5leave2_a.mp3 -10
fx k5stamp      sfx/raw/k5stamp_a.mp3 -6
fx k5rattle     sfx/raw/k5rattle_a.mp3 -6
fx k5thud       sfx/raw/k5thud_a.mp3 -6
fx k5slurp      sfx/raw/k5slurp_a.mp3 -6
fx k5slam       sfx/raw/k5slam_b.mp3 -4
fx k5bump       sfx/raw/k5bump_b.mp3 -6
fx k5scurry     sfx/raw/k5scurry_a.mp3 -8
fx k5peek       sfx/raw/k5peek_a.mp3 -8
fx k5scuttle    sfx/raw/k5scuttle_b.mp3 -8
fx k5coin       sfx/raw/k5coin_a.mp3 -8
fx k5bonk       sfx/raw/k5bonk_b.mp3 -6
fx k5bells      sfx/raw/k5bells_a.mp3 -8
fx k5hair       sfx/raw/k5hair_b.mp3 -10
fx k5tick       sfx/raw/k5tick_a.mp3 -10 "atrim=0.30,asetpts=PTS-STARTPTS"
fx k5pull       sfx/raw/k5pull_a.mp3 -8
fx k5surface    sfx/raw/k5surface_a.mp3 -6
fx k5calm       sfx/raw/k5calm_a.mp3 -12
fx k5koel       sfx/raw/k5koel_a.mp3 -8
fx k5window     sfx/raw/k5window_a.mp3 -6
fx k5doorbell   sfx/raw/k5doorbell_a.mp3 -10 "lowpass=f=2400:poles=2"
fx k5buzz       sfx/raw/k5buzz_a.mp3 -6
fx k5wake       sfx/raw/k5wake_b.mp3 -8
fx k5type       sfx/raw/k5type_a.mp3 -6
fx k5post       sfx/raw/k5post_b.mp3 -8
fx k5ping       sfx/raw/k5ping_b.mp3 -8
fx k5scroll     sfx/raw/k5scroll_a.mp3 -8
fx k5dm         sfx/raw/k5dm_a.mp3 -8
fx k5delete     sfx/raw/k5delete_b.mp3 -8
fx k5tape       sfx/raw/k5tape_a.mp3 -6 "atrim=0.25,asetpts=PTS-STARTPTS"
fx k5slip       sfx/raw/k5slip_b.mp3 -8
fx k5pin        sfx/raw/k5pin_a.mp3 -8
fx k5crumple    sfx/raw/k5crumple_a.mp3 -8
fx k5giggle     voices/raw/z5s1_v4_b.mp3 -8 "atrim=0:1.55,asetpts=PTS-STARTPTS,lowpass=f=5000,afade=t=out:st=1.35:d=0.2"

# ---- the beds
bed k5nightbed  sfx/raw/k5nightbed_r2_b.mp3 -30 -14
bed k5deep      sfx/raw/k5deep_r2_a.mp3     -34 -14
bed k5dawnbed   sfx/raw/k5dawnbed_b.mp3     -26 -10
bed k5under     sfx/raw/k5under_a.mp3       -24 -10

# ---- the music
mus k5lullaby   music/raw/k5lullaby_b.mp3   "atrim=0.65:24.6,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=23.0:d=0.95"
mus k5theme     music/raw/k5theme2_b.mp3    "afade=t=out:st=22.6:d=1.4"
mus k5red       music/raw/k5red_a.mp3       "afade=t=out:st=32.4:d=1.5"
mus k5shy       music/raw/k5shy_a.mp3       "atrim=0:33.6,asetpts=PTS-STARTPTS,afade=t=out:st=32.0:d=1.6"
mus k5lonely    music/raw/k5lonely_a.mp3    "atrim=0:29.0,asetpts=PTS-STARTPTS,afade=t=out:st=27.0:d=2.0"
mus k5climb     music/raw/k5climb_a.mp3     "atrim=0.6:21.0,asetpts=PTS-STARTPTS,afade=t=out:st=18.6:d=1.8"
mus k5after     music/raw/k5after_a.mp3     "atrim=1.2:18.0,asetpts=PTS-STARTPTS,afade=t=out:st=15.4:d=1.4"
mus k5endD      music/raw/k5endD_a.mp3      "atrim=0:19.0,asetpts=PTS-STARTPTS,afade=t=out:st=17.6:d=1.4"
mus k5epi       music/raw/k5epi_a.mp3       "afade=t=out:st=30.4:d=1.6"
# the two that loop under play: looped by hand like the beds, then peak-matched
ffmpeg -v error -y -i music/raw/k5care_b.mp3 -ar 48000 -ac 2 l_care.wav;  python3 ../v22.0/cp9/loopfast.py l_care.wav l_care2.wav 2.0;  enc k5care l_care2.wav -3.0 -3.0 128k 2
ffmpeg -v error -y -i music/raw/k5night_b.mp3 -ar 48000 -ac 2 l_night.wav; python3 ../v22.0/cp9/loopfast.py l_night.wav l_night2.wav 2.0; enc k5night l_night2.wav -3.0 -3.0 128k 2
rm -f l_care.wav l_care2.wav l_night.wav l_night2.wav *.f32
# the box's fates, from the lullaby itself
mkdir -p music/proc && python3 music/fates.py music/raw/k5lullaby_b.mp3 music/proc
for n in k5endA k5endB k5endC k5boxfast k5boxstop; do enc $n music/proc/$n.wav -3.0 -3.0 128k 2; done
rm -rf music/proc   # (the WAVs are made again by every run)
