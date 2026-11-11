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
#      The SUV's roughness floor is 0.7, the other two 0.33: dark gloss shows every soft dent a generated body has, and
#      photographed from inside the yard at arm's length (tools/probes/yardshots.mjs suv-rear, suv-front, with
#      SWAP=e4suv=<file> serving each finish to the real game) its tailgate, bonnet and rear glass read as crumpled at
#      0.33, calmer at 0.55 and clean at 0.7 (a dusty satin grey). The silver sedan and the white pickup hide theirs.
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
  PXMR=1024 PAINT=0.25,0.7,0.45  BLOT="0,1.233,2.19,0.085"  node tools/prepmeshy.mjs $V/hunyuan-suv-100k.glb    assets/e4suv.glb   1.82 h 1 180 2048
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
#
# ======================================================================================================================
# 11 Nov 2026 · THE WOMAN AT HIS COUNTER RECAST (Chad: "Dont use the yin amulet shoplady. Use another women model.")
# She is the auntie of episode 1 chapter 3's paper table now (assets/granny.glb, her file untouched): her standing and
# talking takes are her own; her WALK is made as the mall's two passers-by got theirs (masters/v21.0/walk/make.sh): the
# admin tee's Walking retargeted onto her rig in world space (--align: 17 bones swung onto the source's rest; --hips:
# rest heights 0.966 -> 0.955), cut to a clip-only file bound to her clone by bone name.
# HER ARMS BROUGHT IN (--calm, new in tools/retarget.mjs; unset, the tool writes the same bytes as before, compared).
# The first walk was the take as it is, and in the film she marched: both upper arms 13-18 degrees out from her body
# (up to 33), the elbows carried back and bent 37-39 degrees (up to 66), the forward hand at her waist. It is the
# library's walk, not the retarget: the admin tee walks so himself, and so does Pa Noi's "Walking_Woman" (each
# photographed front, side and back at four moments of the stride). --calm=9,0.4,0.5,18,0.4: her arms hang 9 degrees
# out on average (what they vary by kept at 0.4), swing half as far, and the elbow's mean bend is 18 degrees (its
# variation kept at 0.4). A first try that kept the take's own elbow bend held both hands in front of her belly once
# the upper arms were brought to the vertical; the bend had to come down with them. Her legs, hips and spine are the
# take's own, so her feet land where they landed. Not cured: her fingers are straight (her scan has no finger bones)
# and her knees stay a little bent through the stride (the take's).   ./make.sh walk
# RETIRED 11 Nov 2026 with the auntie (Chad: "Dont use this auntie as she has been used many times"): `grannywalk` is out of
# the build and the repo (git holds it to c890752); this section is the record of how it was made.
if [ "$ONLY" = walk ]; then
  cd ../..
  O=${O:-/tmp/auntiewalk}; mkdir -p $O
  node tools/retarget.mjs assets/admintee.glb assets/granny.glb $O/granny1.glb Walking meshy --align --hips --calm=9,0.4,0.5,18,0.4
  node masters/v21.0/walk/cliponly.mjs $O/granny1.glb Walking assets/grannywalk.glb
fi
# HER STEPS. The woman was heard and never seen when chapter 2 was made, and her steps were heels (x2heels, x2heelsin:
# RETIRED here, their files and rows out, their takes in masters/v25.0/sfx/raw). The auntie wears flat sandals.
# eleven_text_to_sound_v2, flow DuK7tKZHFhWqp23LPIk1, two prompts, two takes each (sfx/raw), measured (onsets, spacing,
# the share of the sound a phone's speaker plays):
#   x2sandals_a, _b      "Soft flat rubber sandals walking on a hard polished terrazzo floor ... four slow unhurried
#                        steps ... each step a soft slap and scuff"  sessions oPKdY5HG3NRwaOwvTgU2, p3F3a4yI91LfyR1RdnbU
#                        REFUSED: 69 % and 100 % of their energy under 250 Hz (thuds a phone does not play), rms -44 dB
#   x2sandals_r2_a, _b   "Flip-flop sandals slapping on a tiled floor, a woman walking slowly, four clear steps, crisp
#                        light rubber slaps with a small scuff"  sessions xpoMOMcj8T5kAFCgw2c6, rtAHXqS1O28ZENCnJWN4
#                        r2_a is ONE slap (1.0 s); r2_b TWO, 0.9 s apart (0.56 s, 1.46 s), 2 % under 250 Hz, 15 % over
#                        3 kHz: two clean slaps of two feet, and no walk of four in any take
# So the walk is MADE (v24.3: when every take fails the measure, make the sound): r2_b's two slaps, each cut from 60 ms
# before its peak with 0.4 s of its own decay, laid left-right-left-right 0.62 s apart (the heels' own spacing, so the
# films' timing stands), the third and fourth a touch quieter; then the heels' own two shapes: going away (16 dB down
# over 2.2 s) and coming back to his counter (16 dB up over the four steps).   ./make.sh sfx
fx() { # name src peak [ffmpeg filter]
  n=$1; s=$2; pk=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
# RETIRED 11 Nov 2026 with the auntie: x2sandals and x2sandalsin are out (files, table rows); the woman in green wears
# flats and walks to v25.0's own x2heels and x2heelsin, restored from e66edb7. This section is the record.
if [ "$ONLY" = sfx ]; then
  ffmpeg -v error -y -i sfx/raw/x2sandals_r2_b.mp3 -filter_complex "
    [0]atrim=0.50:0.96,asetpts=PTS-STARTPTS,afade=t=in:d=0.004,afade=t=out:st=0.38:d=0.08,asplit=2[a1][a3];
    [0]atrim=1.40:1.86,asetpts=PTS-STARTPTS,afade=t=in:d=0.004,afade=t=out:st=0.38:d=0.08,asplit=2[a2][a4];
    [a1]adelay=300|300[d1];[a2]adelay=920|920[d2];[a3]adelay=1540|1540,volume=0.9[d3];[a4]adelay=2160|2160,volume=0.94[d4];
    [d1][d2][d3][d4]amix=inputs=4:normalize=0:duration=longest,apad=whole_dur=3.0[o]" -map "[o]" -ar 48000 sfx/x2sandals_walk.wav
  fx x2sandals   sfx/x2sandals_walk.wav -10 "volume='pow(10,(-16*min(max(t-0.5,0)/2.2\,1))/20)':eval=frame,afade=t=out:st=2.6:d=0.3"
  fx x2sandalsin sfx/x2sandals_walk.wav -10 "atrim=0:2.6,asetpts=PTS-STARTPTS,volume='pow(10,(-16+16*min(t/2.3\,1))/20)':eval=frame,afade=t=out:st=2.4:d=0.2"
fi

# ======================================================================================================================
# 11 Nov 2026 · THE CHANT (Chad: "For the chant, as lersi chin uses the power of shiva, remove all his current chants and
# change them to Om Namah Shivaya. He chants it 3 times only ...")
# Flow weil6DyvxhFEP1vcVglD, his voice (Mart-Podcast 2rg92Q2u0RWu8LiUcLQA), six takes in voices/raw, each measured
# (20 ms frames 32 dB under its peak for the pauses; an autocorrelation pitch for how intoned it is) and transcribed
# repetition by repetition (faster-whisper small: every one of the eighteen reads "Om Namah Shivaya", no tag spoken):
#   lc2om_a, _b  eleven_v3  "[chanting] Om Namah Shivaya. Om Namah Shivaya. Om Namah Shivaya."
#                sessions MRzkOjsWK3YUMcWYde9s, qooLdTV6huTBW5u9I4aK
#                REFUSED: SAID, not chanted: 1.35 s a repetition (the three over in 5.2 s and 4.4 s), pitch 83-146 Hz
#   lc2om_c, _d  eleven_v4  "[chanting slowly, deep and solemn] Om... Namah Shivaya. Om... Namah Shivaya. Om... Namah Shivaya."
#                sessions Bs6JlxA7tYlwlwcPWkuz, BzXDJMMVN53Q5s7vUQzQ   (v21.5: v3 will not slow down between pauses)
#                c 9.20 s: repetitions 0.08-2.56, 3.30-5.70, 6.52-8.88 (2.4 s each, a breath of 0.8 s between), pitch
#                94-129 Hz; d 9.52 s: 0.12-2.62, 3.50-5.98, 6.86-9.36, pitch 88-126 Hz
#   lc2om_e, _f  eleven_v3  "[chanting slowly] Om... Namah... Shivaya. Om... Namah... Shivaya. Om... Namah... Shivaya."
#                sessions KJ1hvaoAhKJ7ebn2AzYd, IAAKjfYQc4WivbDxeNMY
#                e 14.16 s, word by word (holes inside each repetition, 1.6 s between them), pitch 84-112 Hz; f 10.56 s
#   (his voice elsewhere: spoken lines' median 122-124 Hz; v25.0's Namo tassa 114 Hz, 86-145; c 114, d 111, e 107, f 112)
# THE PICK: c. A clean end (0.3 s of silence after the last word), no odd hole, the tighter of the two that are chanted
# as one phrase; e is slower and halts between its words. It is a matter of taste, so his ear decides (v10.6): the
# four chanted takes go to him loudness-matched, previews/chant-1..4.mp3 (c, d, e, f).   ./make.sh chant
# RETIRED with it (files, rows, captions; their takes stay in masters/v25.0/voices/raw): lc2namo, lc2sak1, lc2sak2,
# lc2sak3.
if [ "$ONLY" = chant ]; then
cast lc2om     voices/raw/lc2om_c.mp3      -17 $F                          # the chant, at the old chant's own level
mkdir -p previews
i=1; for k in c d e f; do python3 ../v21.0/prep.py voices/raw/lc2om_$k.mp3 pv_$k.wav $F >/dev/null; python3 ../v11.1/level.py pv_$k.wav pl_$k.wav -17
  ffmpeg -v error -y -i pl_$k.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 previews/chant-$i.mp3; rm -f pv_$k.wav pl_$k.wav pl_$k.wav.f32; i=$((i+1)); done
fi

# THE POWER'S TWO SOUNDS (the same ask: "show the white energy gathering as he chants it, and then it flies to the
# player and creates a clearing effect and the whole screen flashes and fades white quickly for a moment").
# eleven_text_to_sound_v2 in the same flow, each with its DURATION as a model parameter (v9.2), prompt_influence 0.4,
# two takes each (sfx/raw), measured (level per half second; where the energy sits):
#   x2gather_a, _b   12 s  "A soft ethereal shimmer of gathering energy, airy and glassy, slowly swelling and rising in
#                    pitch from near silence, a calm sacred feeling, no melody, no rhythm, no voice"
#                    sessions IeiNxcqm5NOB0wKqDl6e (a), VptVtKQ5Drpnu1cSxWY1 (b)
#                    a RISES THE WHOLE WAY (-68 to -33 dB by the half second, never falling), all of it in 250 Hz-1 kHz
#                    (a phone plays it; it sits under his voice and is cued 12 dB under the chant); b swells and dies
#                    away from its 8th second (an arc: it would fall as the power peaks). PICK: a
#   x2release_a, _b  5 s   "A ball of light rushing fast toward the listener, a quick airy whoosh for one second, then a
#                    bright soft burst that blooms wide and rings out into a gentle shimmering tail, clean and calm, no
#                    voice, no melody"   sessions Qdjdj2OoWeIOaA9HlAIc (a), X33d1UHW2ppiV1H0gO9W (b)
#                    a: a rise from 0.84 s, its burst at 1.16 s, a bright tail (44 % over 4 kHz) gone by 3.5 s; b is a
#                    boom at once, 70 % under 250 Hz (a phone plays almost none of it). PICK: a
# x2gather: a's head (1.4 s at -60 dB) off, 10.6 s, faded in and out. x2release: from 0.3 s, so its burst lands 0.86 s
# after the cue (c_tail cues it at the flash less that).   ./make.sh power
if [ "$ONLY" = power ]; then
  fx x2gather  sfx/raw/x2gather_a.mp3  -8 "atrim=1.4:12,asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st=10.1:d=0.5"
  fx x2release sfx/raw/x2release_a.mp3 -3 "atrim=0.3:4.0,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=3.2:d=0.5"
fi

# ======================================================================================================================
# 11 Nov 2026 · HIS LINE THAT WAS CUT (Chad: "the player voiceline 'when u remember ' is cut off halfway too fast")
# MEASURED: v25.0's take (masters/v25.0/voices/raw/q2e2_b.mp3, "the tighter read") is 0.64 s long and ENDS ON SIGNAL
# (-18 dBFS in its last 20 ms: the generator returned it cut inside "remember"), three words in 0.58 s; the chain's
# 0.12 s fade then took the last syllable down with it. v25.0's other take (_a) ends on signal too (-28 dBFS). Mine:
# the pick rule is a clean end FIRST (v18.6) and this one was passed on "tighter".
# Re-said in chapter 2's flow (GN27ORLbMBtrQtkmAl5C), his voice (Brian bP8FJDHmWVEgXJDitdQd), eleven_v3, two takes:
#   prompt "[tired] When I remember..."   (the registry's words, one tag, one ellipsis: v5.28)
#   q2e2_c  session e6nVFsTjyfyBfxf62smw  2.24 s: voice 0.18-1.06 s, then its own decay to silence (-53 dBFS by 1.14 s)
#   q2e2_d  session YA9ZyEezlcfDB9zYAiKi  1.04 s: ENDS ON SIGNAL (-22 dBFS): refused
# THE PICK: c, the only clean end. Transcribed (scribe, word timings): "When I remember", no tag spoken (the file is
# silent to 0.14 s). Its tail cut at the words' end + 0.3 s.   ./make.sh exam
if [ "$ONLY" = exam ]; then
him  q2e2      voices/raw/q2e2_c.mp3        --keep 1.36 $F                 # the only clean end; voice 0.18-1.06 s
fi

# ======================================================================================================================
# 11 Nov 2026 · THE CLEARING'S MUSIC RE-CUT to the short chant (the film is 39 s where it was 89 s; Chad: "The entire
# duration and pacing and framing of the scenes may need to be readjusted given that a long chant is now reduced to a
# very short one"). The same take (masters/v25.0/music/raw/x2clearmus_c.mp3, 92 s, v25.0's measured pick), MEASURED
# first: five bell strikes at 0.60, 24.95, 40.50, 55.50 and 72.75 s, each dying away over about fifteen seconds.
# Cued where it always was (0.6 s before the chant), the uncut take's second bell would land under "Drink", its third
# in the middle of his advice. THE CUT, three windows joined by hand:
#   0 - 10.4 s      the first bell, under the chant's opening, dying away as the light gathers
#   38.58 - 55.2 s  the third bell (the brightest), joined over 1.0 s so that it strikes 11.30 s in: ON THE WHITE
#   57.0 - 72.0 s   the fourth bell's body without its strike (a 2.0 s join: a swell), under his advice to the black
# 39.0 s; its last 1.6 s faded. The joints checked (levels by 2 s windows: no hole, no bump: -28 -24 -24 -25 -28 /
# -27 -24 -26 -29 -32 -34 -36 / -30 -27 -29 -32 -34 -36 -39 dBFS before the gain). LEVEL: the shipped file's own
# (its first ten seconds measured in both: +7.34 dB on the cut, whose peak is then -7.85 dBFS; v25.0 peak-matched the
# whole take to -3 on a later bell this cut does not hold, so matching the peak again would have made it 4.9 dB louder).
#   ./make.sh music
if [ "$ONLY" = music ]; then
ffmpeg -v error -y -i ../v25.0/music/raw/x2clearmus_c.mp3 -filter_complex "[0:a]atrim=0:10.4,asetpts=PTS-STARTPTS[a];[0:a]atrim=38.58:55.2,asetpts=PTS-STARTPTS[b];[0:a]atrim=57.0:72.0,asetpts=PTS-STARTPTS[c];[a][b]acrossfade=d=1.0:c1=tri:c2=tri[ab];[ab][c]acrossfade=d=2.0:c1=tri:c2=tri,afade=t=out:st=37.4:d=1.6" -ar 48000 m_x2clearmus.wav
enc x2clearmus m_x2clearmus.wav -7.85 -7.85 128k 2; rm -f m_x2clearmus.wav
fi
