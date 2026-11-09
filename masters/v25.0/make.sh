#!/bin/bash
# v25.0 · episode 4 chapter 2, Not Every Master Should Be Trusted — its voices, effects, beds and music, from the masters.
# The plan and the log: docs/V25.0-E4C2-PLAN.md (§14 the log, checkpoint by checkpoint).
#
# CP1 · LERSI CHIN'S VOICE (audition/). His key lines read as one prompt by three of the workspace's Thai-accented
# English voices, eleven_v3 (ElevenLabs flow OiLOlcL2MRYZSHycAG8k):
#   "[calm] Sit, sit. You look like you haven't slept. According to my practice, I believe something negative was placed
#    on you. I clear. I don't send. If I send, I carry it. If you ask me to send, you carry it also. One more thing.
#    Don't go looking for him. Don't tell people stories about him. Don't wish anything back on him. Leave it there."
#   a · Pikiir (wwlSjZ6z5ZVMXPlwGV6Q)        18.29 s, 3.50 words a second, all 64 words heard
#   b · Framel (roe71slHhRlwDI6IPvB6)         22.20 s, 2.88 words a second, all 64 words heard
#   c · Mart-Podcast (2rg92Q2u0RWu8LiUcLQA)   27.30 s, 2.34 words a second, all 64 words heard
# THE PICK, by measure until Chad's ear: c, Mart-Podcast — calm and unhurried, at the game's median pace (about 2.3
# words a second, v5.30); a reads a teacher's warning at a rush, b sits between. The previews Chad hears are each take
# levelled the cast's way (v11.1's level.py: RMS -16 dBFS under the -1.5 dBFS limiter), so loudness never decides:
#   audition/lc-a-pikiir-preview.mp3  audition/lc-b-framel-preview.mp3  audition/lc-c-mart-preview.mp3
# (made by: for f in lc-a-pikiir lc-b-framel lc-c-mart; do python3 ../../v11.1/level.py audition/$f.mp3 x.wav -16;
#  ffmpeg -i x.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 audition/$f-preview.mp3; done)
set -e
cd "$(dirname "$0")"
