#!/bin/sh
# v22.5 · episode 3 chapter 3 (docs/V22.5-PLAN.md).
#
# A · CHAD'S NEW ROW OF TAOIST DEITIES → assets/taoistrow.glb (MODEL=1), v21.11's recipe and key:
# his `taoist deities updated.glb` (Drive 1pz-YlKB3rLRtV-xu9B9JD-8E1pA316OC, 118,260,276 bytes, sha1 4b74f57b…;
# not in the repo), every triangle kept (582,300; ratio 1), the base colour 4096, normal and metal-roughness 2048,
# base-centred, meshopt; then a FAR level over the same vertices and maps, a permissive cut to a quarter (145,572),
# shown beyond DEI.near (3 m).
#
# B · HIS LINE AT THE LERSI MASKS (Chad: "the player should say 'Hmm, shouldn't these lersi masks be placed lower
# than the row of Buddha statues? This doesn't seem rightly placed...'"):
#   z3lersi  jamesAdult, Brian (bP8FJDHmWVEgXJDitdQd), eleven_v3, on the e3c3 voices flow (sessions.json):
#     "[puzzled] Hmm, shouldn't these lersi masks be placed lower than the row of Buddha statues? This doesn't
#      seem rightly placed..."
#   Two takes, both every word right (faster-whisper small and medium.en; "lersi" heard as "lursi" — ler-see):
#   z3lersi_a 7.76 s: head -42.7 dB (noise before the first word), "Hmm" runs straight into the question (0.28 s)
#   z3lersi_b 8.40 s  PICKED: the clean head (-52.4; -76 dB at its first 20 ms), "Hmm." set apart by a 0.9 s
#             beat before the question — the puzzled read — and a 1.3 s pause before "This doesn't seem rightly
#             placed"; like every eleven_v3 take it ends on the "d" of "placed" (-26 to -31 dB in its last 60 ms),
#             so its last 0.12 s is faded
#
# C · HIS LINE AT THE SHELF OF BUDDHAS (Chad, sent while this was being built: "also add another objective at the
# shelf of buchas, the player voiceline should say ' Hm I think all the buddha statues should be placed at the top
# row instead...nevermind...'"):
#   z3shelf  jamesAdult, Brian, eleven_v3, the same flow:
#     "[thoughtful] Hm, I think all the Buddha statues should be placed at the top row instead... nevermind..."
#   (his words; the comma after "Hm" and the space after the first ellipsis are for the read, and "Buddha" takes its
#    capital — not one word moved). Two takes, both every word right (faster-whisper small):
#   z3shelf_a 7.44 s  PICKED: the only take clean at BOTH ends (head -63.2, end -53.3 dB, 0.07 s of air after the
#             last word — nothing to fade), "Hmm." then a 1.1 s beat, the thought, a 1.5 s pause, "Never mind."
#   z3shelf_b 7.12 s: head -53.5, ends ON signal (-28.9)
# His chain: the v16.0/v18.6 one (high-pass 70 Hz, mono, peak-matched to -6.85 mp3 / -6.6 ogg, 64 kbps Opus).
set -e
[ "${MODEL:-0}" = 1 ] || SKIPMODEL=1
SRC=${SRC:-/tmp/claude-0/src-v225/deities/taoist_deities_updated.glb}
if [ -z "$SKIPMODEL" ]; then   # (MODEL=1 to remake the row: it needs SRC, which is not in the repo)
  (cd ../.. && LONG=1 KEEPMR=1 TEXPX=4096 MRPX=2048 NPX=2048 node tools/prepwess.mjs "$SRC" /tmp/taoistrow-near.glb 1 \
            && LEVELS="far:0.25:permissive" node tools/lodpair.mjs /tmp/taoistrow-near.glb assets/taoistrow.glb 0 taoistrow)
fi
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
if [ "${VOICES:-1}" = 1 ]; then
  him z3lersi raw/z3lersi_b.mp3 --fade 0.12
  him z3shelf raw/z3shelf_a.mp3
fi
