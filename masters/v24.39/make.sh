#!/bin/bash
# v24.39 · THE GHOST JAR — Chad, 3 Nov 2026: "You can replace ep4 chp 1, the red clothed jar in the ajahn's room with
# this model" (https://sketchfab.com/3d-models/thai-ghost-jar-65f50a38e11f4122b688da7bbf938746). "Thai ghost jar
# หม้อแม่นาค" by N0M4DXII (Sketchfab, CC BY-NC-SA 4.0 — credited in the credits panel with its link; NonCommercial and
# ShareAlike: this prepared copy is shared under the same licence). His upload: masters/v24.39/src/thai_ghost_jar.glb
# (gitignored), 1,870,264 bytes, sha1 a9b54c03201aa289d19229a726adcac7daa406ad; 12,000 triangles, one double-sided
# material, a 1024 colour sheet, metal-roughness and normal sheets.
#
# 1. jarfix.mjs — two export faults put right, nothing of its paint or shape touched (photographed before and after):
#    its metal-roughness sheet marks EVERY texel metal (blue 255 everywhere), which draws the terracotta and the cloth as
#    dark metal; the author's own Sketchfab render shows matte clay, a matte woven cloth and a shining silver band — so
#    metal is kept on the band alone (pale neutral texels the sheet marks glossy: 51,594 of 1,048,576, 4.9 %), roughness
#    is the author's. And the root's viewer turn tipped it 2.05° off upright (one side of its foot would float on the
#    table): the root is replaced by the same yaw without the tip.
# 2. tools/prepstatic.mjs — real metres, its foot's centre on the origin, 16 cm tall (the covered bowl's own height, so
#    nothing that looks at that spot moves), every triangle (ratio 1), its three sheets at their own 1024 (JPEG), and
#    DOUBLE=1 (new, opt-in: its cloth flaps are single sheets, two-sided as delivered; unset, the tool is as before —
#    proven by re-making e4ghost byte for byte).
# Measured on the result (for the chapter's breath): the band at 12.8–13.5 cm, the cloth's dome above it to 16 cm,
# radius 9.5 cm.
#
# THE WORDS: the room's object is a jar now, so the two lines that called it a bowl are re-said with "jar" — the same
# voice (Brian, bP8FJDHmWVEgXJDitdQd), model (eleven_v3), flow (42oRvGlkUSRPQpVq1GAB) and tags as the shipped takes;
# two takes each (sessions in ../v24.0/voices/sessions.json: q1smoke_j, q1C0_j; takes in ../v24.0/voices/raw). Picked by
# v24.0's order — the words first (all four exact, faster-whisper small.en), then an end not ON signal, then the quieter
# head, then the timing a scene cuts on:
#   q1smoke b — words exact in both; b's end -28.5 dB against a's -21.8 (a's last 0.1 s is the tail of "way"), its head
#              -63.2 against -53.5. 7.12 s (a calm whisper, 2.0 words a second).
#   q1C0    b — words exact in both; a (4.24 s) is too quick for ending C's cuts ("her" would fall on the shadow's shot,
#              "It's all him" on hers); b keeps them where the shipped take had them ("Her" 3.54, "It's all him" 5.12
#              from its start) — the jar's shot now ends at 1.6 s, on "the shadow" (1.24), where it ended at 2.2. 6.24 s.
# The two written lines on the endings' book say "jar" too (ledSmokeF, ledClothF).
# The chain is v24.0's, its functions copied here: him — mono, high-pass 70 Hz, peak-matched -6.85 / -6.6; the last
# 0.12 s faded.
set -e
cd "$(dirname "$0")"
# ---- the jar
node jarfix.mjs src/thai_ghost_jar.glb prep/jar_fixed.glb
(cd ../.. && DOUBLE=1 NORMAL_PX=1024 MR_PX=1024 node tools/prepstatic.mjs masters/v24.39/prep/jar_fixed.glb assets/e4ghostjar.glb 0.16 1 0 1024 90)
# ---- the two lines
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
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
F="--fade 0.12"
R=../v24.0/voices/raw
him  q1smoke   $R/q1smoke_j_b.mp3      $F
him  q1C0      $R/q1C0_j_b.mp3         $F
