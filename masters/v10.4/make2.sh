#!/bin/sh
# v10.5 · Chad on v10.4: "The new eerie music is bad, i prefer the older one unless
# you can generate something scarier. Also the ghost soldier laughing sound is too
# old and not eerie enough. It should sound like a young man."
# ghostlaugh <- laugh-3: median f0 272 Hz against the v10.4 take's 206 (a younger
# voice laughs higher), centroid 2016 Hz against 1382, and the only take with energy
# above 3 kHz (8 %) — the breath in a giggle. laugh-4 (f0 345) puts 86 % of its energy
# in 120-500 Hz: a muffled hum, not a laugh.
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels
  n=$1; src=$2; tm=$3; to=$4; br=$5; ch=$6
  ffmpeg -v error -y -i "$src" -ar 48000 -ac $ch w_$n.wav
  p=$(peak w_$n.wav); gm=$(python3 -c "print(f'{$tm-($p):.2f}')"); go=$gm
  for pass in 1 2; do
    ffmpeg -v error -y -i w_$n.wav -af "volume=${gm}dB" -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
    ffmpeg -v error -y -i w_$n.wav -af "volume=${go}dB" -map_metadata -1 -c:a libopus   -b:a $br  -ar 48000 ../../assets/audio-opus/$n.ogg
    pm=$(peak ../../assets/audio/$n.mp3); po=$(peak ../../assets/audio-opus/$n.ogg)
    gm=$(python3 -c "print(f'{$gm+($tm-($pm)):.2f}')"); go=$(python3 -c "print(f'{$go+($to-($po)):.2f}')")
  done
  echo "$n <- $src  mp3 $pm  ogg $po  (want $tm / $to)"
  rm -f w_$n.wav
}
# enc ghostlaugh raw/laugh-3.mp3 -4.0 -4.0 64k 1   # done (mp3 -4.10, ogg -4.12)
# e2dread <- scary-1, window 165-227 s (mk.py): the one take of four with a steady
# passage in the register a phone can carry — 67 % of its energy above 120 Hz, 44 %
# in 500-3 kHz and 10 % above 3 kHz, centroid 2.8 kHz (the shrieking strings and
# scrapes), and only 13 % in 120-500 Hz, where his voice lives. scary-2 was the
# runner-up (28 % in 500-3k, but it swells 13.6 dB inside any loopable window);
# scary-3/4 (the "SEA ghost film" prompt) came out as sub-500 Hz drones with
# literal silences — centroid 216-303 Hz, 1 % above 3 kHz — the v9.7 bed again.
# enc e2dread w_loop.wav -6.0 -6.0 96k 2   # v10.5: scary-1 165-227 (Chad: no — "use bed c")
# v10.6 · Chad heard all six beds and all four laughs (30 s previews): "Use bed c ...
# Use laugh 4." Bed C is scary-3, the "Southeast Asian ghost film" prompt — a cold
# hollow drone with detuned choir tones and creaks; window 20-82 s (mk.py), std
# 1.25 dB, clear of the take's silences past 170 s. Laugh 4 is the highest-pitched
# take (f0 345 Hz). Both his ear over my measure.
# enc e2dread w_loop.wav -6.0 -6.0 96k 2   # done (bed C: mp3 -6.03, ogg -5.91)
# enc ghostlaugh raw/laugh-4.mp3 -4.0 -4.0 64k 1   # done (mp3 -4.02, ogg -4.03)
# v10.6 · e2filmbunk: the v7.1 theme (e2film-a, the take the shipped e2film was
# cut from — envelope correlation 1.000 against the v10.3 file) from 36.0 s to its
# end, a 1 s fade-in under the film's black at 37.0, cued at 36.0 so its swell
# meets the bunk's fade-in exactly where it did before v10.4 retired the theme.
#   ffmpeg -ss 36.0 -i ../v7.1/e2film-a.mp3 -af afade=t=in:d=1.0 -ar 48000 -ac 2 w_filmbunk.wav
enc e2filmbunk w_filmbunk.wav -4.2 -4.2 96k 2
# v10.7 · Chad on v10.6: "The eerie music volume can still be made louder, it feels
# buried under everything." Measured: bed C peaks at -4.4 dBFS but AVERAGES -21.1
# (-24.2 in the >120 Hz band a phone can play) — 4 dB under the v10.4 pad on average,
# because a drone's rare creaks set its peak and the peak is what -6.0 matched.
# loud.py levels the loop by RMS (-15 dBFS, compressed 3:1 over -26, a real lookahead
# limiter at -3 dBFS — ffmpeg's alimiter would not cap), then plain encodes, no enc:
#   python3 mk.py raw/scary-3.mp3 20 && python3 loud.py
ffmpeg -v error -y -i w_loud.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/e2dread.mp3
ffmpeg -v error -y -i w_loud.wav -map_metadata -1 -c:a libopus   -b:a 96k  -ar 48000 ../../assets/audio-opus/e2dread.ogg
