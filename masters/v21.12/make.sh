#!/bin/sh
# v21.12 · THE SHRINE'S WORDS (docs/V21.12-PLAN.md CP1). Chad: "the customers in the taoist medium shop, they need to
# say 'thank you sifu' before they walk away. This applies to both the man and the woman. For the man customer, the
# taoist medium should also say he give him a talisman to bring home, before telling him it is done. Also, when the
# player walks to the taoist medium, the taoist medium should say more words instead of just saying its a ghost. Maybe
# have the medium say something like 'There is an energy taking over you, an intense energy that i cannot recognize. It
# could be a ghost or spirit posessing you...' The player should then immediately reply with a surprised voiceline like
# 'what...? ghost...? i don't think so...' before he turns into that roar sound."
#
# Four takes a line on the e3c3 voices flow (sessions.json — the session ids, the only handle on a generation),
# transcribed locally (faster-whisper small, word timings) and measured (measure.py: head/end levels, lead/tail
# silence, the phone-band split; f0.py: a rough pitch spread, unreliable on the medium's gravelly voice — octave
# errors — so not used to pick). PICKED, a clean end first, then the words exactly, then the read:
#   wf3thanks  wife3 — a,b eleven_v4 (the model her dv3wife was re-said on, slower, at Chad's word), c,d eleven_v3:
#     a 2.80 s  PICKED: the words exactly, both ends clean (-61 / -86 dB), "Thank you, Sifu." then a 0.38 s breath
#               and "Thank you." — the v4 read, as unhurried as her reading
#     b 2.96 s  as clean, a longer gap; c, d (v3) 1.6 / 1.3 s, fast, and both start ON signal (lead 0.00)
#   md3fu      medium3, eleven_v3, "[flatly] Take this talisman. Bring it home... paste it above your son's bed."
#     a  says "NOW take this", and holds 1.1 s of silence at the end
#     b  "haste it" (the p swallowed); ends on signal (-41)
#     c  the words exactly; ends ON signal (-34)
#     d 6.40 s  PICKED: the words exactly, three phrases with full stops between them, both ends clean (-85 / -73)
#   fa3thanks  father3, eleven_v3, "[relieved] Thank you, sifu."
#     a  ends ON signal (-37); c  adds "Ah,"; b clean (-56)
#     d 1.60 s  PICKED: the words exactly, the cleanest ends of the four (-76 / -82)
#   md3ghost   medium3, eleven_v3 — a,b "[gravely]", c,d "[flatly, certain]" — Chad's words, the ellipses his pauses:
#     a 10.96 s PICKED: the grave read, the words exactly (whisper hears "recognize"), the pauses where the script
#               puts them (0.76 s after "you,", 1.3 s after "recognize.", "or..." held 1 s before "a spirit"); its
#               end (-34.6, the take trimmed to its last sample) faded over 0.12 s
#     b, c  end -27 (on signal); d 9.28 s the flat read, as clean as a (-35.4) — sent to Chad beside a
#   z3what     jamesAdult, Brian, eleven_v3 — a,b "[stunned]", c,d "[shocked]" — "What...? Ghost...? I don't think so..."
#     a, b  5.3 / 5.8 s, a second and more between each word — not "immediately"
#     c 3.12 s  PICKED: the quickest, a 0.5 s and a 0.66 s beat between the three, a clean head (-65.6); its end
#               (-24, the last syllable cut at the file's end) faded over 0.12 s
#     d  3.84 s, starts AND ends on signal
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
trim() { python3 ../v21.0/proc.py trim "$1" "$2" $3 $4 ${5:-0.12} >/dev/null; }
fx() { # name raw start end fade target
  trim "$2" w_$1.wav $3 $4 $5; enc $1 w_$1.wav $6 $6 96k 2; rm -f w_$1.wav w_$1.wav.f32; }
if [ "${VOICES:-1}" = 1 ]; then
  cast wf3thanks raw/wf3thanks_a.mp3
  cast md3fu     raw/md3fu_d.mp3
  cast fa3thanks raw/fa3thanks_d.mp3
  cast md3ghost  raw/md3ghost_a.mp3 --fade 0.12
  him  z3what    raw/z3what_c.mp3   --fade 0.12
fi

# ---------------------------------------------------------------------------
# v21.12 · THE HANUMAN REVEALED (CP2). Flow x1GA0BZOmq4QkgJCd4V4 (sfxnodes.json, sfxsessions.json), eleven_text_to_sound_v2
# with duration / loop / prompt_influence as PARAMETERS (the v9.2 law). Picked by envm.py (the phone band, the 0.5 s
# envelope, where it peaks, clean ends):
#   hanuappear  round one (four takes) came back 93-99.8 % over 3 kHz and LOUDEST AT ITS START — a sparkle that dies,
#               not a rise into an arrival. Re-asked as a riser (hanuappear2). PICK hanuappear2_a: 51 % in 500 Hz-3 kHz
#               (the body the first round had none of), rising -49 -> -5 dB over 1.5 s, a quarter-second's held breath,
#               then the bloom at 2.0 s decaying to -54; clean ends (-54 / -70). b rises to its very end and ends ON
#               signal; c peaks at 1.25 and only decays; d is 98 % sparkle.
#   hanuhold    the glow while the lens circles it: all four takes are a hum (95-99.6 % in 120-500 Hz, centroid 240-340
#               Hz), which a phone speaker plays thinly. PICK d — the evenest (0.5 s swing 12.7 dB) and its ends matched
#               (-22.4 / -22.3) — laid with its own copy an octave up 4 dB under it (the same hum where a phone plays),
#               crossfade-looped and tiled to 12.5 s with a 1.2 s fade in (the film fades it out at the lunge).
if [ "${FX:-1}" = 1 ]; then
  fx hanuappear raw/hanuappear2_a.mp3 0.00 3.48 0.20 -2.0
  ffmpeg -v error -y -i raw/hanuhold_d.mp3 -af "asetrate=88200,aresample=44100,atempo=0.5" -ac 2 w_oct.wav
  python3 ../v21.10/mix.py raw/hanuhold_d.mp3 w_oct.wav w_hh0.wav -4 0 >/dev/null
  python3 ../v21.0/proc.py loop w_hh0.wav w_hh1.wav 1.5 >/dev/null
  python3 tile.py w_hh1.wav w_hh.wav 12.5 1.2
  enc hanuhold w_hh.wav -6.0 -6.0 96k 2
  rm -f w_oct.wav w_hh0.wav w_hh0.wav.f32 w_hh1.wav w_hh1.wav.f32 w_hh.wav w_hh.wav.f32
fi

# ---------------------------------------------------------------------------
# v21.13 · THE SOUND OF BOTH PLACES (CP3, N1/N2). Chad: "there is a general lack of ambient sound and environmental
# sound effects in this whole chapter, in both the amulet shop and also the taoist medium shop ... Some parts are too
# quiet." Same flow, eleven_text_to_sound_v2, four takes each (sfxsessions.json). Measured BEFORE (the files' RMS + the
# gain the chapter runs them at): the shop at the back of the room ~-42 dB of mall murmur under the radio (-24) — and
# with the radio OFF for the monk's chant and the trance, -34..-42 of mall and nothing else; the shrine while he waits
# and through both readings -35 (the room tone -37, the reading bed -35, the street -42 inside) — a quiet room with
# nothing IN it. PICKED by envm.py (the phone band — a phone speaker plays almost nothing under 120 Hz, v10.4 — the
# 0.5 s envelope's swing for a bed, clean ends for a one-shot):
#   BEDS
#   shopair      b — the A/C and fans: the most of the four in 500 Hz-3 kHz (27.8 %), swing 1.8 dB
#   mallwalla    b — the corridor's people: 64 % in 500 Hz-3 kHz, no sub, the steadiest (swing 3.3)
#   nightinsects b — crickets in the lorong's trees: 99.9 % over 3 kHz (a has 15.6 % sub rumble), swing 2.2
#   shrinefan    round one (shrinefan_a-d) was 96.7-99.8 % UNDER 120 Hz — a motor hum a phone cannot play. Re-asked as
#                the blades' swish and a loose blade's tick, "no motor hum" (shrinefan2). PICK shrinefan2_b: 44.6 % in
#                500 Hz-3 kHz and a swish on every turn (the 0.5 s envelope alternates ~-50 / -58); high-passed at
#                120 Hz so its own bit of hum is not normalised up with it
#   ONE-SHOTS (the shop's, then the street's and the room's)
#   mshutter b (a neighbour's roller shutter: the smoothest rise, 62.5 % mid, clean ends -32/-76) · trolley a (a pass,
#   cleanest end -68) · phonering a (the longest ring, ~2 s, then cut; clean ends) · cashdraw c · bagrustle b ·
#   childpass a (a child going by, cleanest end -75) · slipperspass d (cleanest ends -45/-81)
#   gecko a (twelve chirps 150 ms apart and a clean decay — c and d are two long blobs, not a chik-chak) · motorbike b
#   (85 % in 120-500 with the most mid of the four, a pass, clean ends) · carpass b (82 % mid, the cleanest head) ·
#   dogfar d (three barks, 97.5 % mid, clean ends) · kopiclatter c (the steadiest clatter) · tvfar d (54 % mid — a and
#   b are 18-23 % sub) · windchime c (the cleanest decay, to -80) · catfar c (96.7 % mid, clean ends)
#   farradio — NOT used: the shop's own radio plays the whole time he browses, and a second music in the room is mud
bed() { # name raw [highpass]
  if [ -n "$3" ]; then ffmpeg -v error -y -i "$2" -af "highpass=f=$3:poles=2" w_hp_$1.wav; src=w_hp_$1.wav; else src="$2"; fi
  python3 ../v21.0/proc.py loop "$src" w_$1.wav 2.0 >/dev/null
  enc $1 w_$1.wav -8.0 -8.0 96k 2; rm -f w_$1.wav w_$1.wav.f32 w_hp_$1.wav; }
shot() { # name raw end [fade] — a one-shot, peak-matched to -6 dBFS; the chapter sets each one's level
  trim "$2" w_$1.wav 0.0 $3 ${4:-0.25}; enc $1 w_$1.wav -6.0 -6.0 96k 2; rm -f w_$1.wav w_$1.wav.f32; }
if [ "${AMB:-1}" = 1 ]; then
  bed shopair      raw/shopair_b.mp3
  bed mallwalla    raw/mallwalla_b.mp3
  bed nightinsects raw/nightinsects_b.mp3
  # (the fan is levelled by its RMS, not its peak: its loose-blade ticks stood 33 dB over its average, so a
  #  peak-match left the swish at -37.6 dBFS and turned up the ticks would click — level_rms.py, RMS -26 / ceiling -12)
  ffmpeg -v error -y -i raw/shrinefan2_b.mp3 -af "highpass=f=120:poles=2" w_hp.wav
  python3 ../v21.0/proc.py loop w_hp.wav w_loop.wav 2.0 >/dev/null
  python3 level_rms.py w_loop.wav w_fan.wav -26 -12
  ffmpeg -v error -y -i w_fan.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/shrinefan.mp3
  ffmpeg -v error -y -i w_fan.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/shrinefan.ogg
  rm -f w_hp.wav w_loop.wav w_loop.wav.f32 w_fan.wav w_fan.wav.f32
  shot mshutter     raw/mshutter_b.mp3     3.48
  shot trolley      raw/trolley_a.mp3      5.00
  shot phonering    raw/phonering_a.mp3    2.70 0.20
  shot cashdraw     raw/cashdraw_c.mp3     2.48
  shot bagrustle    raw/bagrustle_b.mp3    2.48
  shot childpass    raw/childpass_a.mp3    3.48
  shot slipperspass raw/slipperspass_d.mp3 4.48
  shot gecko        raw/gecko_a.mp3        2.48
  shot motorbike    raw/motorbike_b.mp3    6.00 0.40
  shot carpass      raw/carpass_b.mp3      6.00 0.40
  shot dogfar       raw/dogfar_d.mp3       3.48
  shot kopiclatter  raw/kopiclatter_c.mp3  5.00 0.60
  shot tvfar        raw/tvfar_d.mp3        7.00 0.80
  shot windchime    raw/windchime_c.mp3    4.00
  shot catfar       raw/catfar_c.mp3       2.48
fi
