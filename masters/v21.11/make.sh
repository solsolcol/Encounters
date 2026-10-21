#!/bin/sh
# v21.11 · Chad's row of Taoist deities → assets/taoistrow.glb (MODEL=1), and the two voices below.
# SRC is his `taoist deities.glb` (SOURCES.md). Every triangle kept (no simplification: ratio 1), the base colour
# 4096 (photographed against 2048 at the closest the player can stand — 0.9 m on a phone — 4096 is visibly sharper),
# normal and metal-roughness 2048, base-centred, meshopt; then a FAR level over the same vertices and maps, a
# permissive cut to a quarter (148k), shown beyond 3 m (photographed against the near level from 3 m and from the
# player's stool: the same row).
set -e
[ "${MODEL:-0}" = 1 ] || SKIPMODEL=1
SRC=${SRC:-/tmp/claude-0/src-v2111/deities/taoist_deities.glb}
if [ -z "$SKIPMODEL" ]; then   # (MODEL=1 to remake the row: it needs SRC, which is not in the repo)
  (cd ../.. && LONG=1 KEEPMR=1 TEXPX=4096 MRPX=2048 NPX=2048 node tools/prepwess.mjs "$SRC" /tmp/taoistrow-near.glb 1 \
            && LEVELS="far:0.25:permissive" node tools/lodpair.mjs /tmp/taoistrow-near.glb assets/taoistrow.glb 0 taoistrow)
fi
cd "$(dirname "$0")"

# ---------------------------------------------------------------------------
# v21.11 · THE OWNER INTRODUCES THE MASTERS' GALLERY, AND HE ANSWERS (Chad:
# "when the player clicks or interact with the row of monk portraits, have the
# store owner say something first before the gallery window frame opens.
# Maybe something along the lines of 'Ahh the great monks of earlier times,
# you want to know their stories? Let me tell you some...' refine/imporve this
# voiceline. The player should also say a voiceline in response, as the
# gallery window frame opens.")
#   ow3masters  owner3, Brendon (rTCcr5snLtTho4KbH96N), eleven_v3:
#     "[warmly] Ahh... the great masters of the old days. You want to hear
#      their stories? Come, I tell you about them."
#   z3masters   jamesAdult, Brian (bP8FJDHmWVEgXJDitdQd), eleven_v3:
#     "[respectfully] Yes, please, Uncle. I know their faces from the
#      amulets... but not their stories."
# Four takes each on the e3c3 voices flow (sessions.json), transcribed locally
# (faster-whisper small, word timings) and measured (measure.py):
#   ow3masters_a 8.16 s, a 0.7 s hole before "I tell you"; end -28.3
#   ow3masters_b 7.36 s, says "I'LL tell you" (the script's Singlish is "I tell
#                you"); end -21.0 (on signal)
#   ow3masters_c 7.36 s  PICKED: the words exactly, the tightest read, the
#                cleanest head (-32.2); its end (-25.6) faded over 0.12 s
#   ow3masters_d 8.16 s, the longest holes; end -23.4
#   z3masters_a 5.60 s, ends ON signal (-19.4)
#   z3masters_b 5.68 s, end -23.2
#   z3masters_c 5.84 s, the cleanest edges, but its pause falls after "Uncle"
#                (1.14 s) and the ellipsis gets 0.2 s
#   z3masters_d 5.68 s  PICKED: the ellipsis as a 0.74 s pause where the script
#                puts it; end -25.4 faded over 0.12 s
# Him on the v16.0/v18.6 chain; the owner on the flat cast bus by RMS -16.
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
if [ "${VOICES:-1}" = 1 ]; then
  cast ow3masters raw/ow3masters_c.mp3 --fade 0.12
  him z3masters raw/z3masters_d.mp3 --fade 0.12
fi
