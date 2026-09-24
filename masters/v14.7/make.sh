#!/bin/sh
# v14.7 · the amulet's two sounds, from the ElevenLabs takes in raw/ (flow
# FADFcyj4y7dD45bbj9Am; sessions.json has every session id). Run from here.
#
# v3aunt6 — the auntie (Alice) at the paper table: "Ah boy, you like this one?
# Auntie give it to you, keep it well!" Four takes; c ENDS ON SIGNAL (tail
# -11.5 dBFS — cut off) and is out. Picked by measurement against her four
# shipped lines: d's median pitch 204 Hz sits inside theirs (168-218; a is
# 222, b 237), its balance 49/49 % (120-500 / 500-3k) matches theirs
# (51/45, 54/42) where a is brighter (35/62), edges clean (head -67, tail
# -85 dBFS), 2.9 words a second. Her lines are PEAK-matched (the v4.8 rule,
# -2.3..-2.6 dBFS, RMS -18..-19); d already sits at -2.6 / -18.2, so it goes
# in as it is — metadata stripped, mono, measured after encoding.
#
# itemunlock — the Item Unlocked sting (eleven_text_to_sound_v2,
# duration_seconds 3.5 as a PARAMETER, the v9.2 law). a is the warm bell
# (98 % of its energy 500-3k, a slow tail from -4 to -45 dB over 3 s); b is a
# brighter shimmer, c and d are over by 1.3 s. Peak-matched to the HUD
# contract's -2.0 dBFS with EACH ENCODER GIVEN ITS OWN SOURCE (v9.6/v9.7:
# the mp3/opus offset is per file, so it is measured, never assumed).
set -e
peak() { python3 peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }

# measured with the same meter (peak.py) her shipped mp3s sit at -5.26/-5.61
# and this take encodes 0.5 dB under them, so it is lifted 0.5 dB to match
ffmpeg -v error -y -i raw/v3aunt6_d.mp3 -ac 1 -ar 44100 -af "volume=0.5dB" w_aunt.wav
ffmpeg -v error -y -i w_aunt.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/v3aunt6.mp3
ffmpeg -v error -y -i w_aunt.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 -ac 1 ../../assets/audio-opus/v3aunt6.ogg
echo "v3aunt6  mp3 $(peak ../../assets/audio/v3aunt6.mp3)  ogg $(peak ../../assets/audio-opus/v3aunt6.ogg)   (v3aunt4 on the same meter: mp3 -5.61, ogg -5.19)"

ffmpeg -v error -y -i raw/itemunlock_a.mp3 -ar 44100 w_unlock.wav
P=$(peak w_unlock.wav)
G1=$(python3 -c "print(round(-2.0 - ($P), 2))")
ffmpeg -v error -y -i w_unlock.wav -af "volume=${G1}dB" -ar 44100 w_unlock_mp3.wav
ffmpeg -v error -y -i w_unlock_mp3.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/itemunlock.mp3
M=$(peak ../../assets/audio/itemunlock.mp3)
G1b=$(python3 -c "print(round(${G1} + (-2.0 - ($M)), 2))")
ffmpeg -v error -y -i w_unlock.wav -af "volume=${G1b}dB" -ar 44100 w_unlock_mp3.wav
ffmpeg -v error -y -i w_unlock_mp3.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/itemunlock.mp3
ffmpeg -v error -y -i w_unlock.wav -af "volume=${G1}dB" -ar 48000 w_unlock_ogg.wav
ffmpeg -v error -y -i w_unlock_ogg.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/itemunlock.ogg
O=$(peak ../../assets/audio-opus/itemunlock.ogg)
G2=$(python3 -c "print(round(${G1} + (-2.0 - ($O)), 2))")
ffmpeg -v error -y -i w_unlock.wav -af "volume=${G2}dB" -ar 48000 w_unlock_ogg.wav
ffmpeg -v error -y -i w_unlock_ogg.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/itemunlock.ogg
echo "itemunlock mp3 $(peak ../../assets/audio/itemunlock.mp3)  ogg $(peak ../../assets/audio-opus/itemunlock.ogg)   (want -2.0)"
rm -f w_*.wav
