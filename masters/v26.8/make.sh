#!/bin/sh
# v26.8 · episode 4 chapter 3, Chad's notes of 13 Nov 2026 (evening and night): the recipe of everything made for them.
# His words, the asks one row each and where each stands: docs/V26.8-E4C3-NOTES.md. Nothing here is run by the build:
# each step names the tool that makes it again and what it was given.
#
# ---- 1. HIS TELLING AND GRANDMASTER PHO'S ANSWER, IN THE WORDS HE APPROVED (rows H, I, K)
#   masters/v26.0/script/lines.py and tags.py (the words and each line's one tag); eleven_v3 through the flow and the
#   sessions in masters/v26.0/voices/sessions-v268.json (q3t4 said again: its first two takes ended on its last word);
#   picked by masters/v26.0/voices/pick.py (picks.json says which and why), chained by chain.py, measured into
#   script/measured.json and the chapter's SECS (script/secs.py). The takes of the old words: voices/raw/old-words/.
#   "Three, two, one!" (ds3p1), the woman at the bench's voice (Kanya), the same way.
#
# ---- 2. THE CAMERA'S CLICK MADE AGAIN (row G): masters/v26.0/sound/sfx2.json x3shutter2 (eleven_text_to_sound_v2, flow
#   WRJ4HzibEIDJwdJVaUy4, node Sb5x00FSohEayaOjy2CR, four takes; sessions in sound/sessions-sfx2.json), measured by
#   sound/measure.py; its line in masters/v26.0/sound.sh says which and why. Installed by that one line (sound.sh's fx).
#
# ---- 3. THE MAIN MUSIC MADE AGAIN AS THAI CEREMONY MUSIC (row Q): masters/v26.0/sound/music2.json x3festmus2
#   (eleven_music_v2_5, flow KjDinAQkQZQNeSNqqDp2, node upnACslCf5nMiorhoJDF, four takes; sessions in
#   sound/sessions-music.json). His four previews, levelled alike (30 s from 5 s, the loudspeakers' treatment, RMS -20
#   dBFS, peaks under -1): masters/v26.8/previews/festmus2-*.mp3. HIS EAR PICKED b ("festmus2-b.mp3 is the best, use
#   that"). Its loop by sound.sh's mbedlv line (the window and why there), levelled by its average to the old music's
#   place in the mix (its seconds' median -18.0 dBFS; matched by its peak it had come out 2.4 dB under) by
#   masters/v26.8/looplevel.py, the gain and level_rms.py's limiter run round the loop.
#
# ---- 4. THE DANCERS' SECOND DANCE OUT OF THEIR FILES (row A): played by nobody once the film danced only their dance in
#   place, it was taken out of the shipped files without their recipe (people.sh needs Blender's Python):
#       node tools/droptake.mjs assets/e4dancera.glb <out> dance2     (and e4dancerb)
#       node tools/probes/samebody.mjs assets/e4dancera.glb <out> ...  -> every mesh, picture, joint and kept key the same
#   people.sh no longer lays it on them.
#
# ---- 5. THE TWO WHO GO UP, AT THEIR FULL MODELS IN THE FESTIVAL FILM'S CLOSE SHOTS (row N): the full models of the woman
#   (e4devah) and the man (e4devch) made with the other devotees' before his v26.5 answer (the generator's own model, the
#   rig laid on by tools/riglod.mjs, prepared as people.sh's `keep` level) and kept out of the build until now; shipped as
#   they were made. keys.py lists them (person(..., True)); c_cast.js fullOn/fullOff lays them on only for that film.
#
# ---- 6. THE CLOUDS' EDGES SOFTENED, AND A HALO (row O): python3 -I masters/v26.8/clouds.py (its head says what and why),
#   from masters/v26.1/env/refs/cloud-*.png and cirrus.png, the same sizes v26.1 made.
#
# ---- 7. THE PETAL BOWL MADE AGAIN (row R, Chad: "Rebuild the petal bowl"). The old one was Hunyuan3D v3's at 40,000
#   triangles drawn from a 512 sheet: up close in the films' drops to it the heap read as dough. Made again his way:
#   a. the picture on white: GPT Image (gpt_image_2_6, quality high, 2k, 1:1) through Higgsfield, two takes of one prompt
#      ("a golden Thai pedestal offering bowl (phan) with an embossed rim ... heaped high in a rounded mound of loose fresh
#      marigold petals, yellow and orange, every single petal crisp and distinct ..."); both looked at full size:
#        d205c5b4-b167-489a-985a-6c1731ab9509  -> props/petalbowl2-alt-2k.png (a beaded rim)
#        0e0c49df-bfb3-4a69-818e-bad2dc788f3c  -> props/petalbowl2-2k.png     PICKED: a scalloped lotus rim, the richer
#                                                 kranok work, the fuller heap of distinct petals
#      (their 1024 copies committed, props/petalbowl2-1024.jpg and props/petalbowl2-alt-1024.jpg; the 2k PNGs stay on the
#      working machine, as git leaves every PNG)
#   b. the engines tried on that one picture (v25.5's law), both at their highest:
#        Meshy image-to-3D (meshy26.py model props/jobs-bowl.json: latest model, 4k geometry, 8k PBR, remesh 300,000)
#        Hunyuan3D v3 (Higgsfield hunyuan3d_v3_image_to_3d, PBR, Normal, face_count 300,000): job 92302ccc-29ae-434a-a9c1-a3c2d721f8e1
#        Meshy image-to-3D task 01a1d692-0385-7682-b836-5e17b31f063a (also in masters/v26.0/src/jobs.json, petalbowl2)
#          -> REFUSED by Meshy: 'image_too_complex' (at 45 %; no model, no credits spent)
#        Hunyuan3D v3 92302ccc -> 299,980 triangles, three 2048+ maps: looked at full size from four sides
#          (tools/shootmodel.mjs --size=1100): the heap one smooth mound painted in smears (dough again), the bowl's embossing
#          gone to plain dark brown. Refused.
#   c. tried next:
#        Meshy on the other picture (props/jobs-bowl-alt.json, the same settings): task 01a1d695-8cd4-76b1-948b-6a07296bf0b0
#        Tripo H3.1 (Higgsfield tripo_h3_1_image_to_3d: geometry and texture 'detailed', PBR, face_limit 1,000,000) on
#          the picked picture: job 843db4dd-217a-4f99-a497-494c9cff2d54
#          -> 954,238 triangles, 4096 sheets (colour, metal-roughness, normal), looked at full size from four sides:
#          every petal its own ruffled shape, the bowl's kranok and lotus-leaf medallions and the stand's beading in the
#          geometry itself. The engine to use. Its petals painted metal 0.18, roughness 0.23 (wet plastic): MATTE at prep
#          (tools/prepmeshy.mjs, new). Too heavy for a phone, and a generated model is never thinned here (v25.5): asked
#          again for the count wanted, the same picture and settings with face_limit 150,000: job aa7d0cf6-90f8-4908-8303-26c4c41fd17a
#        Meshy on the other picture: SUCCEEDED (40 credits), 302,450 triangles, 8192 sheets, looked at from four sides:
#          thin papery petals, matte as they should be (metal 0, roughness 0.95), its gold metal 0.8 to 1 on a bright base.
#          Its own remesh to the count the game draws (meshy26.py remesh petalbowl2a 80000, then 150000; 5 credits each):
#          at 80,000 the heap opened in see-through gaps, its petals jagged, the bowl's kranok gone to crumpled foil
#          (the bowl has 5 % of its sheet); at 150,000 the foil and the jagged edges stayed. Refused at the counts a
#          phone can draw. (Both remeshes removed; the original kept in src, original-petalbowl2a.glb.)
#        Tripo at 150,000: 148,163 triangles, 4096 sheets, looked at from four sides: the kranok medallions, the lotus
#          rim and the stand's beading still in the geometry, every petal its own shape, yellow and orange as the
#          picture. PICKED. Its source: src/tripo-petalbowl2-150k.glb (the Tripo file as delivered).
#   d. prepared (the petals made matte, the gold left as painted; the metal-roughness sheet at 1024, the others 2048):
#        MATTE=0.5,0.7 PXMR=1024 ERR=0.002 node tools/prepmeshy.mjs masters/v26.0/src/tripo-petalbowl2-150k.glb assets/w3petalbowl.glb 0.34 w 1 0 2048
#        MODE=permissive node tools/lodpair.mjs assets/w3petalbowl.glb assets/w3petalbowl.glb 6000 w3petalbowl
#      -> 148,163 triangles near, 5,980 far (at 2,000 the far level laid petal paint on the bowl's side in orange shards:
#         looked at, made again at 6,000), 2,863 KB (the old: 40,000 and 2,000, 512 sheets, 524 KB). Both levels looked
#         at alone from four sides (tools/probes/lodview.mjs, tools/shootmodel.mjs --size=1100).
#   e. RETIRED the same night, at his word. Asked "Actually is it even necessary to have this petal bowl? Or just remove
#      it from the game", and given three choices (keep the new one; keep it with no close look; remove it), he picked
#      "Remove it". Both bowls are out of the world (b_world2.js), the key out of the table (keys.py --write rewrote
#      build.py and a_head.js; only the key left them, checked word by word), assets/w3petalbowl.glb out of the repository
#      (git history keeps both files), and the two looks down on "kumanthong" go to the petals on the carpet at his
#      teacher's foot (y_stage.js FOOT). The recipe above stays, so it can be made again; the Tripo file is kept in src.
#      MATTE stays in tools/prepmeshy.mjs: no asset uses it now; it is a prep step for any generated thing painted half
#      metal and half not.
