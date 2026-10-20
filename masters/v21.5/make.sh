#!/bin/sh
# v21.5 · THE SPIRIT TONGUE, WHISPERED — Chad, on v21.4: "Can the medium tongue
# have more expressive tone for dramatic effect? And deity tongues tend to have
# a whispery quick tone where you can barely make out what he is saying. The
# current take is too distinct."
# Same voice (Roger, Fo6zHX740rFxxP1fWDxu), same invented syllables, now a quick
# WHISPERED stream that bursts into a shouted "HAH!" (sessions.json):
#   w1-w3  eleven_v3, stacked tags ([intense]/[raspy]/[breathless] + [whispers]/[quickly])
#   w4     eleven_v4, the w1 prompt
#   w5     eleven_v3, [whispering] alone
#   w6     eleven_v4, [whispering] alone          <- the only run that truly whispers
# Measured (meas.py), against the game's own whispers as the yardstick —
# vpick1-3 read 32-38 % voiced, n3C1/n3C2 46-61 %, with 7-27 % of their energy
# above 2 kHz; v21.4's shouted take read 68 % voiced, 5 % above 2 kHz:
#   w1-w3, w5 (v3)  65-81 % voiced, 1-5 % >2k: a hushed SPEECH, never a whisper —
#                   the older model will not whisper these syllables in this voice
#   w4 (v4)         66-71 % voiced, 6-10 % >2k: breathier, still voiced
#   w6 (v4)         46-54 % voiced, 15-24 % >2k: whispers, in the game's whisper range,
#                   short pauses (0.12-0.46 s), the "HAH!" 11.6-14 dB over the whisper
#   w6_c PICKED: the most breath (49 % voiced, 24.4 % >2k), the quickest stream,
#                silence at both ends, the burst 12 dB over the whisper
# 10 % faster (atempo 1.1, pitch kept) for the "quick", then levelled by
# level2.py, NOT the v21.0 cast chain: that chain (RMS -16 for the whole take)
# lifted the whisper and squeezed the shout until the "HAH!" was quieter than
# the whisper's loudest moments. level2.py levels the whisper and the shout on
# their own, split in the silence between them: the whisper 3:1 over its RMS
# and to -21 RMS, the shout at full level under the -1.5 dBFS limiter —
# ebur128 momentary: whisper -20.8 LUFS mean, -17.6 at its loudest; the shout
# -11.9, as loud as the v21.4 shouted take's loudest moments. 4.99 s. The
# shipped file, by meas.py: 42 % voiced, 23.8 % above 2 kHz, arc 10.0 dB, two
# pauses (0.28 / 0.34 s) — v21.4's shipped take read 68 %, 5.2 %, 3.7 dB and
# stopped four times (0.60 / 0.12 / 0.70 / 0.30 s): less distinct, by number. The
# roar film and ending A are re-timed to the new length in e3c3.js
# (docs/V21.2-PLAN.md, the v21.5 section).
# v21.6 · Chad, on hearing it: "I dont want the hah at the end of that
# voiceline, it is unnecessary." The take has 0.25 s of silence before the
# shout, so DROP_SHOUT=1 cuts it in the middle of that silence: the whisper is
# levelled from its own numbers alone, so it is sample-for-sample the v21.5
# whisper, ending on its own decay (the last 150 ms peak at -42.8 dBFS).
# 4.27 s; the roar film and ending A re-timed in e3c3.js (docs/V21.2-PLAN.md,
# the v21.6 section).
ffmpeg -v error -y -i raw/w6_c.mp3 -af "atempo=1.1" -ac 1 -ar 48000 t_md3chant.wav
python3 ../v21.0/prep.py t_md3chant.wav p_md3chant.wav --fade 0.12 >/dev/null
DROP_SHOUT=1 python3 level2.py p_md3chant.wav w_md3chant.wav
ffmpeg -v error -y -i w_md3chant.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/md3chant.mp3
ffmpeg -v error -y -i w_md3chant.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/md3chant.ogg
echo "md3chant <- raw/w6_c.mp3 (atempo 1.1, level2.py, the shout dropped)"
rm -f t_md3chant.wav p_md3chant.wav w_md3chant.wav
