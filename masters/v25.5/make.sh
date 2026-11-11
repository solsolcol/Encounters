#!/bin/bash
# v25.5 · episode 4 chapters 1 and 2: Chad's notes of 10 Nov 2026 (docs/V25.5-E4-NOTES.md) — the lines re-said, and the
# models remade. Run from masters/v25.5:  ./make.sh voices
#
# THE VOICES — the same flow as chapter 2's (GN27ORLbMBtrQtkmAl5C), eleven_v3, two takes a line, the same voices (him,
# Brian bP8FJDHmWVEgXJDitdQd; Lersi Chin, Mart-Podcast 2rg92Q2u0RWu8LiUcLQA), each prompt the registry's words with its
# one tag (v5.28). The takes are in voices/raw; v25.0's own takes of the same ids stay in masters/v25.0/voices/raw.
#   q2tA   (D4: "the player just responds in like a bullet point form ... refine what the player says in a more natural
#           narrated manner")  sessions NBs3vUxkciFD6FpLWdV0 (a), ZY1pzpk50ULETvyWGKSu (b)
#   q2B1   (G2: "should not say 'i see things' but more on 'i feel things, and sometimes i cannot control my body..'")
#           sessions 60A0oSTlOiQxXYZqMenL (a), JRq8ydx4BHfvFBfrARWu (b)
#   lc2B1  (G2: "lersi chin replies need to be changed to fit that new line")  Wz1aoKAUkeoPY6wP12TH (a), zSeleNfYK47bGZbOCRoa (b)
#   lc2B2  (the same answer's second half, re-said in the same sitting so the two are one voice; "Someone can teach you")
#           2L02DwDjHCQsGNpEaqsQ (a), xTE9urq81P6tSLyfBWqW (b)
# THE PICK (voices/pick.py: v25.0's rule and code — a clean end, no odd hole, the tighter read, no tag spoken; every
# take transcribed here, all eight heard word for word):
# THE CHAIN, as v25.0's: him — mono, high-passed at 70 Hz, peak-matched to -6.85 (mp3) / -6.6 (ogg) for his own bus; the
# cast — levelled by RMS to -16 dBFS (v11.1's level.py); every take's last 0.12 s faded.
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
castw() { # name wav level — the cast's level and its two encodes
  n=$1; w=$2; lv=$3
  python3 ../v11.1/level.py $w wc_$n.wav $lv
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  rm -f wc_$n.wav wc_$n.wav.f32; }
cast() { n=$1; s=$2; lv=$3; shift 3; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  castw $n p_$n.wav $lv; echo "$n <- $s  (cast, RMS $lv)"; rm -f p_$n.wav; }
F="--fade 0.12"
ONLY="${1:-}"
if [ -z "$ONLY" ] || [ "$ONLY" = voices ]; then
him  q2tA      voices/raw/q2tA_a.mp3        $F                             # the tighter read; voice 0.06-16.38 s (the other 17.68 s long)
him  q2B1      voices/raw/q2B1_b.mp3        $F                             # the tighter read; voice 0.14-8.78 s (the other 9.28 s long)
cast lc2B1     voices/raw/lc2B1_b.mp3       -16 $F                         # the tighter read; voice 0.06-12.62 s (the other 12.72 s long)
cast lc2B2     voices/raw/lc2B2_a.mp3       -16 $F                         # the tighter read; voice 0.06-11.18 s (the other 14.48 s long)
fi

# ---------------------------------------------------------------------------------------------------------------------
# THE MODELS (./make.sh models, from masters/v25.5; the sources are in src/, which git ignores: Higgsfield keeps a job's
# files for a time only, v24.26). Chad, 10 Nov 2026: "the 3 cars parked in the ajahn house, is still very low res and looks
# bad, it needs to look much better" (the third time), "The player's phone model looks pretty bad too", "the notebook, can
# you remove that glitchy looking red ribbon? Just use a normal notebook".
#
# 1. THE ENGINE. The cars' own reference pictures (masters/v24.20/refs: sedan.jpg, pickup.jpg, suv.jpg; GPT Image on
#    white, checked at v24.20) through three engines, photographed under one light beside today's Meshy remesh: Hunyuan3D
#    v3 (real wheel spokes with the brake behind, sharp shut lines, lamps with their lenses), Tripo H3.1 (a real cabin and
#    NO GLASS), Meshy 7 ultra (clean, faceted). Hunyuan for all of it. On Higgsfield (hunyuan3d_v3_image_to_3d,
#    enable_pbr, generate_type Normal), each from its picture uploaded there (media ids: sedan d2795ae5-f6d8-414f-a56b-
#    8fdf38c5e600, pickup 5b9ccb3b-579f-49d0-a0df-a978317772a2, suv 4d7991ac-71a7-4dfc-a3a7-e42bd09f5968).
# 2. THE FIRST TRY, ABANDONED (mine): asked for 500,000 triangles and thinned here to 30-110,000. A generator's sheet is
#    thousands of small islands; thinned, every panel crumpled along their seams (kept normals worse than rebuilt ones),
#    by photograph beside the file as generated. Those five sources are not kept (the three cars at 500,000, the phone
#    and the notebook at 300,000: 5d16178b-b09f-4564-a622-e901aad1309d, 48e412f1-20d3-46e0-801f-7af9701d4858).
#    tools/prepmeshy.mjs keeps what was written for them, all opt-in: SHELLS (wheels as shells of their own), DEFLAT=2
#    (normals shared across the sheet's seams).
# 3. WHAT SHIPS: THE GENERATOR ASKED FOR THE SIZE ITSELF, nothing thinned here (ratio 1):
#      sedan     face_count 100000   job 1ef87ded-287b-4b7a-bddc-e6d4c2718a9a   src/hunyuan-sedan-100k.glb     99,474 triangles
#      pickup    face_count 100000   job c99d3947-ef23-48ee-8521-d298c34f77a7   src/hunyuan-pickup-100k.glb    99,156
#      suv       face_count 100000   job c875b886-a132-44bd-a227-ae1c0566e7be   src/hunyuan-suv-100k.glb       99,698
#      phone     face_count  40000   job 46e4a0ad-493e-4ed1-bc96-7187aff9fd7d   src/hunyuan-phone-40k.glb      40,000
#      notebook  face_count  40000   job e57cf9a3-d791-44b7-b5dc-5fbaeb609a40   src/hunyuan-notebook-40k.glb   40,000
#    (a sixth, the sedan as generate_type LowPoly at 60,000, job 6cf9aff9-f8fb-4682-8dca-ef3a001521e3, was asked for to
#    compare and never needed: not downloaded.)
#    The phone's and the notebook's reference pictures are new (refs/phone.jpg, refs/notebook.jpg: GPT Image 2 on
#    Higgsfield, jobs 1e450e13-bb5f-4be8-8f65-9c3e620479d8 and 43aa79d0-4965-49d9-927f-b3214a46a18c, each looked at
#    before it was modelled): a plain black slab phone lying face up; an open hardcover notebook, blank cream pages, NO
#    ribbon. v25.2's Meshy "phone" was a hollow case and its notebook's ribbon a torn strip of geometry.
# 4. PREPARED (run from the repo's root):
#    PAINT: the generator's car paint is fully metal and mirror-smooth, and this game's yard has almost nothing for a
#      metal to reflect (v24.29): read as paint (metal x 0.25, roughness at least 0.33) it takes the light as today's
#      cars did (theirs measured: metal 0.54 / 0 / 0.02, roughness 0.36 / 0.3 / 0.33). The SUV's base colour x (1 - 0.45 x
#      its metal): a metal's base colour is how much it reflects, and as paint it stood lighter than its picture's grey.
#    BLOT: the roundel the generator invented on the sedan's boot and the ring on the SUV's tailgate (no maker's marks,
#      v9.3), painted over on all three sheets and their bosses laid flat (24.7 and 28.3 mm), found by photographing each
#      nose and tail straight on (the pickup has none).
#    SIZE: the sedan by its length (4.40 m: 1.75 wide without its mirrors, 1.52 tall). The generator made the other two
#      chunky (at their old lengths the pickup stood 2.01 m tall and the SUV's body 2.10 m wide), so each is sized by
#      its HEIGHT to a real one's: the pickup 1.85 m (4.89 long), the SUV 1.82 m (4.48 long).
#    The sheets as v24.26 set them for the yard's cars: 2048 colour and normal, 1024 metal-roughness.
if [ "$ONLY" = models ]; then
  cd ../..
  V=masters/v25.5/src
  PXMR=1024 PAINT=0.25,0.33      BLOT="0,1.01,2.12,0.08"    node tools/prepmeshy.mjs $V/hunyuan-sedan-100k.glb  assets/e4sedan.glb 4.4  l 1 180 2048
  PXMR=1024                                                 node tools/prepmeshy.mjs $V/hunyuan-pickup-100k.glb assets/e4truck.glb 1.85 h 1 180 2048
  PXMR=1024 PAINT=0.25,0.33,0.45 BLOT="0,1.233,2.19,0.085"  node tools/prepmeshy.mjs $V/hunyuan-suv-100k.glb    assets/e4suv.glb   1.82 h 1 180 2048
  # his phone: its top (the lens end) away from him, as its drawn screen reads (turned 180); his notebook as generated
  node tools/prepmeshy.mjs $V/hunyuan-phone-40k.glb    assets/e4phone.glb    0.158 l 1 180 1024
  node tools/prepmeshy.mjs $V/hunyuan-notebook-40k.glb assets/e4notebook.glb 0.46  w 1 0   1024
  # THE TAXI STREET'S TRAFFIC keeps v24.20's three cars (Meshy and its remesh, masters/v24.20/src), under keys of their
  # own now that the yard's are remade, their sheets at 1024 (512 the metal's): the two sets at 2048 would have been
  # 150 MB of sheets in the chapter's memory for cars that pass at night in the rain
  M=masters/v24.20/src
  ERR=0.003 PXMR=512 node tools/prepmeshy.mjs $M/remeshed-sedan.glb  assets/e4sedanfar.glb 4.4 l 1 -90 1024
  ERR=0.003 PXMR=512 node tools/prepmeshy.mjs $M/remeshed-pickup.glb assets/e4truckfar.glb 5.3 l 1 -90 1024
  ERR=0.003 PXMR=512 node tools/prepmeshy.mjs $M/remeshed-suv.glb    assets/e4suvfar.glb   4.8 l 1 -90 1024
fi
# PROOF that the tool is unchanged for every older recipe (its new options unset): v24.20's line for the sedan run again
# gives the committed assets/e4sedan.glb of v24.20-v25.4 byte for byte (sha1 25fe2384dc237c24710f18616f094be64ef85f2f).
#
# THE SOUNDS RETIRED (v24.3's rule: the files, the STING_SAMPLE rows; the takes stay in masters/v25.0/sfx/raw and their
# lines in masters/v25.0/make.sh, which are NOT to be run again): x2knock (the visit opens on them walking in), x2pickup
# (the call stays on the glass, on the speaker), x2bowl (he no longer packs while the choice is made), x2case (ending D's
# piece is only looked at).
