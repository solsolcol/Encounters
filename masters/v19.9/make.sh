#!/bin/sh
# v19.9 · mk1iti — the short Itipiso (the Buddha's virtues), chanted by the
# monk straight after the Sabbitiyo blessing (Chad: "Can i add another short
# itipiso chant after that short chant too? It can be the short version like:
# Iti pi so bhagava araham samma-sambuddho, Vijja-carana-sampanno sugato
# lokavidu, Anuttaro purisa-damma-sarathi sattha deva-manussanam buddho
# bhagava 'ti.").
# Arthur (tX4zpyB6s34no1FgD0Mm), eleven_v3, four takes (sessions.json), the
# Pali ROMANISED as a Thai monk says it, mk1chant's way (v16.2):
# "[chanting slowly in a low monotone] Iti-pi so pakawa... arahang
# samma-sampoot-toh... wit-chaa-jarana-sampanno... sukato loka-widoo...
# anuttaro purisa-tamma-saarati... sattaa tay-wa-manussaanang... poot-toh
# pakawa-tee..."
# All four came back as SEVEN phrases with six breaths between them — the
# text's seven, no spoken tag (the first phrase begins 0.09-0.13 s in).
# PICK: c — clean head (-64.6 dB; a starts ON signal at -47.3), and the
# deepest decay of the last syllable before the file is cut (-45 dB in its
# last 50 ms; a -35, b -34, d still sounding at -28). Every take is cut on
# the "-tee", so its last 0.18 s is faded. The breaths are kept as they are
# (1.3-1.6 s): they are the chant's own pace.
# v16.1's cast recipe: levelled by RMS to -16 dBFS for the flat cast bus.
set -e
cd "$(dirname "$0")"
cast() { n=$1; src=$2
  python3 ../v11.1/level.py "$src" wc_$n.wav -16
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i wc_$n.wav -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $src  (cast, RMS -16)"; rm -f wc_$n.wav wc_$n.wav.f32; }
ffmpeg -v error -y -i raw/mk1iti_c.mp3 -af "afade=t=out:st=26.62:d=0.18" -ar 48000 -ac 1 raw/mk1iti_c_fade.wav
cast mk1iti raw/mk1iti_c_fade.wav
rm -f raw/mk1iti_c_fade.wav       # an intermediate, made above each run
