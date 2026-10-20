#!/bin/sh
# v21.8 · episode 3 chapter 3, Chad's thirteen notes — every new or re-said
# line and every new effect. Flow URTG1KypweSna9iSGuca (sessions.json: name ->
# its four takes). PICKED BY MEASUREMENT (measure.py, pauses.py, ../v21.5/meas.py
# for voicing, ../v21.0/sfxmeas.py; no ears here) — Chad's ear may swap any of
# them (the v10.6 rule): the previews went to him.
#
# THE LINES (eleven_v3 unless said; "Luang Pu" is how the TTS is told to say
# Luang Phu — poo, never foo):
#   z3look3  Brian  "[quietly impressed] Candles, fruits, offerings... he even
#            invited a monk today to lead the chanting." (Chad: "no need to say
#            lotus ... also have the voiceline mention that the store owner even
#            invited a monk today to lead the chanting session")
#            PICK d — the cleanest head of the four (-50.8 dB; c starts ON signal
#            at -32.7), the list then a 0.98 s breath, then the monk; all four end
#            on signal, so its last 0.12 s is faded
#   z3look2  Brian  "Luang Pu Tim Khun Paen... he never lets anyone hold that one."
#            (Chad: "The voicelines should say luang phu tim, and not literally lp")
#            PICK c — the only clean head (-51.4 dB; a/b/d start at -18 to -26),
#            "Luang Pu" set apart from "Tim Khun Paen" by a beat, then a 1.08 s
#            pause; its tail faded
#   ow3gift1 owner (Brendon) "Today is Buddha Day, very auspicious. This one,
#            Luang Pu Tim Khun Paen, from Wat Lahanrai. I kept it for you very long
#            already." PICK b — the most deliberate read (a 0.9 s stop after
#            "auspicious", 6.4 s of speech in 9.7); none has a clean edge, so the
#            cast leveller's own 8 ms / 30 ms edges carry it
#   mk3chant the monk (Arthur) — Chad's Pali, romanised as a Thai monk says it,
#            v said as w: "[chanting slowly in a low monotone] Ee-mi-naa
#            sak-kaa-ray-na... poot-tang poo-jay-mee... (x3: Buddham, Dhammam,
#            Sangham) Arahang samma-sampoot-toh pakawa... Poot-tang pakawan-tang
#            apiwaa-tay-mee..." PICK c — the cleanest head (-81.7 dB) and the
#            shortest (30.4 s, 19.8 s of chant); its breaths are the chant's own
#            pace and are kept; its last 0.2 s faded (it is cut on the "-mee")
#   cu3sadhu an auntie (auntie3) "[in awe] Sadhu, sadhu, sadhu!" (Chad: "The girl
#            should not say 'amituofo'. change it to 'sadhu, sadhu, sadhu!'")
#            PICK a — clean at both ends (-85.6 / -48.2 dB), the slowest (2.2
#            syllables a second), 92 % voiced; the 0.96 s of air after it cut
#   dv3wife  the wife (Jane) "Sifu... my husband cannot sleep. Every night... he
#            says something is sitting on his chest." (Chad: "the lady customer
#            speaks way too fast" — the shipped take was 3.55 s for 15 words, 5.4
#            syllables a second). Three batches: eleven_v3 with [worried, slowly]
#            (4.8-5.8 s, still 3.9-4.6 syl/s), eleven_v3 with more ellipses
#            (4.7-6.2 s, the same speed of speech between pauses), and
#            eleven_v4 with [worried] [slowly] (7.4-7.6 s, 2.2-3.3 syl/s) —
#            the only batch that is actually slower. PICK dv3wife2 d: the same
#            woman (median f0 229 Hz against the shipped 213 and v3's 201-229),
#            clean at both ends (-59.5 / -68.9), the least breathy of the v4
#            four (27 % of its energy over 2 kHz against 31-32 %) and the most
#            expressive (an 8.7 dB arc). It is a softer, more worried read than
#            the old one, and quieter at source (-36.9 dBFS RMS), which the cast
#            leveller brings to the cast's -16
#   md3gasp  the medium (Roger) "[gasps in shock] Hah...!" PICK a — the most
#            breath (25 % voiced; b and c come out as a voiced "hah", 68-71 %),
#            the sharpest onset (a 21.6 dB arc), 1.2 s; kept to 1.4 s
#
# THE EFFECTS (eleven_text_to_sound_v2, duration_seconds / prompt_influence as
# PARAMETERS, the v9.2 law):
#   hanulunge 2.2 s  the spirit's rush at the medium. Every take came back low
#            (24-57 % under 120 Hz, the body in 120-500); PICK d — the only one
#            that rises from silence (head -69 dB) and the brightest (centroid
#            1870 Hz)
#   hanuhit  3.5 s  the impact's BOOM — 67-94 % under 120 Hz in every take, which
#            a phone cannot play (the v10.4 law), so it is the low layer only;
#            PICK d — its clean head and the most 120-500 Hz body (29 %)
#   hanucrash 3 s   the impact a PHONE hears: asked again as "a huge cymbal and a
#            temple gong struck hard together ... no deep bass" — all four 65-74 %
#            over 3 kHz and 25-34 % in 500 Hz-3 kHz; PICK c — the cleanest decay
#            (-72.7 dB in its last 60 ms) and the most body of the four
#   goldswell 2.6 s the golden shimmer as it comes; all four 99 % over 3 kHz;
#            PICK b — the fullest (its middle second -16.7 dB) with a clean tail
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
# Brian: the v21.0 chain (high-pass 70 Hz, mono, peak-matched twice)
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav $V $O 64k 1; rm -f h_$n.wav p_$n.wav; }
V=-6.85; O=-6.6
# the cast: v16.1's recipe, levelled by RMS to -16 dBFS for the flat cast bus
cast() { n=$1; src=$2; shift 2; python3 ../v21.0/prep.py "$src" pc_$n.wav "$@" >/dev/null
  python3 ../v11.1/level.py pc_$n.wav wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32 pc_$n.wav; }
trim() { python3 ../v21.0/proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
fx() { # name raw start end fade target channels
  trim "$2" w_$1.wav $3 $4 $5; enc $1 w_$1.wav $6 $6 96k ${7:-2}; rm -f w_$1.wav w_$1.wav.f32; }

him  z3look3  raw/z3look3_d.mp3 --fade 0.12
him  z3look2  raw/z3look2_c.mp3 --fade 0.12
cast ow3gift1 raw/ow3gift1_b.mp3 --fade 0.08
cast mk3chant raw/mk3chant_c.mp3 --fade 0.2
cast cu3sadhu raw/cu3sadhu_a.mp3 --keep 3.05 --fade 0.1
cast dv3wife  raw/dv3wife2_d.mp3
cast md3gasp  raw/md3gasp_a.mp3 --keep 1.4 --fade 0.1
fx hanulunge  raw/hanulunge_d.mp3 0.00 2.20 0.25 -2.0
fx hanuhit    raw/hanuhit_d.mp3   0.00 3.48 0.40 -2.0
fx hanucrash  raw/hanucrash_c.mp3 0.00 3.00 0.30 -2.0
fx goldswell  raw/goldswell_b.mp3 0.00 2.56 0.25 -4.0
