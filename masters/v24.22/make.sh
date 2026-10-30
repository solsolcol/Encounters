#!/bin/bash
# v24.22 — THE SHOP, a real amulet shop (episode 4 chapter 1's opening film and coda). Chad, 30 Oct 2026 (verbatim):
# "Look at the amulet shop, it doesn't even look like one. No real amulet models, no deco, nothing. And why the view is
# looking outwards at other shops? On phone the field of view sees nothing. The shop need to be improved significantly,
# have real amulets, look like a real shop. Have general amulets like somdej, khun paen, takruts, mitmor, buddha
# statues, rian amulets, and more. Also why he is recording sales on paper? It makes no sense. It should be on laptop."
#
# A. THE STOCK — his workflow and the sacred-object rule (CLAUDE.md: a generated model begins as a checked picture, and a
#    sacred one as REAL PHOTOGRAPHS). A research pass (docs/V24.21-PLAN.md §3) found photographs of real pieces —
#    dealers' catalogues (Thai Amulets Collection, all rights reserved: reference only, never shipped), the Met's Open
#    Access, Wikimedia Commons, wichaa.net — and these went to GPT Image as its IMAGE REFERENCES (Higgsfield,
#    gpt_image_2_5, quality max, 2k, opaque background; one object on pure white, three-quarter from the front left, no
#    text, no hands), each prompt naming the piece as the photographs show it:
#      somdej    Phra Somdej Wat Rakhang in a gold micron casing — Commons' Wat Rakhang 214 macro (CC0), a 3-tier pim
#                niyom (dealer), Commons' row of six cased Somdej (CC BY-SA 4.0)
#      khunpaen  Phra Khun Paen of Wat Ban Krang in its gold casing — a gold-cased Wat Ban Krang piece (dealer), a pim yai
#                (dealer), Commons' three Wat Bang Krang fronts (CC BY-SA 4.0)
#      rian      a monk's sema-shaped copper coin — Luang Phor Koon's (dealer), Luang Phu Thuad's Wat Kae (dealer), an
#                enamel sema (dealer)
#      pidta     Phra Pidta, cast bronze — a Luang Phor Wan front and three-quarter (dealer), a silver one on a lotus base
#      jatukham  Jatukham Ramathep in a round gold casing — a Mahamongkol pim yai cased and uncased (dealer)
#      kring     Phra Kring, the small cast Medicine Buddha — Luang Phor Koon's, Wat Suthat's two (dealer)
#      meedmor   a meed mor with a carved bone handle — a Luang Phor Derm knife in four views and with its sheath (seller)
#      bucha     the altar's seated bronze — the Met's 39112, earth-touching, 15th–16th c. (CC0)
#    The references, checked, are refs/*.jpg (1024 px; the 2k originals stay on Higgsfield).
# B. MESHY IMAGE-TO-3D at its best settings (the key lives OUTSIDE the repo, /root/.config/meshy/key): ai_model latest,
#    topology triangle, target_polycount 300000, should_remesh, should_texture, enable_pbr, symmetry auto (off for the
#    knife), and a texture prompt each:
#      somdej   "pale cream holy powder tablet with fine dark specks and soft worn relief of a seated Buddha in an arched
#                niche on a three-tiered base, set in a polished bright gold casing with a clear glossy front and a gold loop"
#      khunpaen "pale ochre-cream old clay tablet with worn relief of a seated Buddha under a flame-edged pointed arch, in a
#                polished gold casing with a finely engraved edge, a clear glossy front and a gold loop"
#      rian     "warm reddish copper medal with darker patina in the recesses, a relief of a seated monk in robes, an ornate
#                kanok scroll border, a copper loop and a jump ring"
#      pidta    "aged golden-brown cast bronze with darker patina in the recesses and softly polished high points"
#      jatukham "a dark grey-black holy powder disc with raised figures in bright gold leaf, a polished gold round casing
#                with an engraved rim, a clear glossy front, a gold loop"
#      kring    "dark aged bronze with golden-brown softly polished high points"
#      meedmor  "a dark grey steel blade with faint etched lettering, a brass ferrule, a pale ivory carved bone handle with a
#                coiling naga in relief"
#      bucha    "dark bronze with a green-brown patina and worn golden high points"
#    then its REMESH (POST /openapi/v1/remesh, triangle): somdej, khunpaen, rian, jatukham 3,000; pidta, meedmor 4,000;
#    kring 5,000; bucha 12,000 — small because the shop stands them by the dozen (instanced, a draw a kind a place).
#    (Also generated and set aside: a laptop, whose palm rest came back crumpled. His laptop is his own from episode 3
#    chapter 1's film, `filmlaptop`, declared in the chapter's `reuse`.)
# C. PREPARED (tools/prepmeshy.mjs; each photographed on its own with tools/shootmodel.mjs — every face is at +z, the knife
#    along x): the small pieces at 512 (a few centimetres across — photographed identical to their 1024 cuts at that
#    size), the bucha at 1024. A remeshed Meshy file barely simplifies (a UV chart every few triangles, the v8.0 law).
M=${M:-/tmp/meshy}        # where the remeshed files were downloaded (remeshed-<name>.glb)
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-somdej.glb assets/e4somdej.glb 0.052 h 0.33 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-khunpaen.glb assets/e4khunpaen.glb 0.056 h 0.33 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-rian.glb assets/e4rian.glb 0.050 h 0.33 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-pidta.glb assets/e4pidta.glb 0.030 h 0.33 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-jatukham.glb assets/e4jatukham.glb 0.064 h 0.4 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-kring.glb assets/e4kring.glb 0.040 h 0.45 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-meedmor.glb assets/e4meedmor.glb 0.17 w 0.4 0 512
ERR=0.002 node tools/prepmeshy.mjs $M/remeshed-buddhaA.glb assets/e4bucha.glb 0.30 h 1 0 1024
# and Chad's own takrut once more, a light cut of his scan for the stock (5,116 of its 147,376 triangles)
THICK=1 node tools/prepamulet.mjs masters/v24.15/src/takrut.glb assets/e4takrutsm.glb 0.02 512 256
#
# C2. NEAR AND FAR, in one file per kind (the second pass, after the first build's photographs: the phone's widest look
#    into the shop drew 406k triangles, three quarters of them pieces a few pixels tall at their full 2–12k). The shop
#    draws a place's near level only while its pieces are big on the screen (e4c1's stockLod). A cased piece's far level
#    is its own front, baked onto its own geometry (tools/planarfar.mjs — v21.8's planar tray made general: the
#    permissive simplifier tore the casings into crumpled facets, photographed); a statue's is a permissive cut over the
#    same vertices (tools/lodpair.mjs). Run on the prepared files above, in place (asked → got: Somdej 300 → 300, Khun
#    Paen 340 → 457, coin 420 → 420, Jatukham 400 → 1,032 — its raised figures hold the strict cut there):
for spec in e4somdej:300 e4khunpaen:340 e4rian:420 e4jatukham:400; do k=${spec%%:*}; n=${spec##*:}
  node tools/planarfar.mjs assets/$k.glb /tmp/$k-lod.glb $n $k 256 && mv /tmp/$k-lod.glb assets/$k.glb; done
for spec in e4pidta:380 e4kring:520 e4meedmor:420 e4bucha:2000 e4takrutsm:520; do k=${spec%%:*}; n=${spec##*:}
  MODE=permissive UVW=2 ERR=0.05 node tools/lodpair.mjs assets/$k.glb /tmp/$k-lod.glb $n $k && mv /tmp/$k-lod.glb assets/$k.glb; done
#
# D. THE SOUND — his sales are typed now (the laptop), so the ballpoint gives way to a keyboard: generated on the chapter's
#    effects flow zNE7zBvy1ngpOBqOopQH (eleven_text_to_sound_v2, 3.4 s, prompt influence 0.5; sfx/sessions.json), two
#    takes, measured with ../v22.0/cp5/meas.py:
#   w4keys  a   "Typing on a laptop keyboard in a quiet shop: a short burst of crisp key presses, a pause, a few more
#               keys, then one firmer press of the enter key, close" — a's keys are crisp (51 % of it over 3 kHz
#               against b's 34 %) and its tail clean (-40.1 dB against -35.7); a third of both is rumble under 120 Hz,
#               which a phone cannot play and which only muddies the clicks, so it is high-passed away
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, two passes (the encoders move it): v24.0's
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
ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 sfx/raw/w4keys_a.mp3 | head -1)
ffmpeg -v error -y -i sfx/raw/w4keys_a.mp3 -af "highpass=f=150:poles=2,afade=t=out:st=3.15:d=0.25" -ar 48000 w_w4keys.wav
enc w4keys w_w4keys.wav -10 -10 96k $ch; rm -f w_w4keys.wav
