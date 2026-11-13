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
