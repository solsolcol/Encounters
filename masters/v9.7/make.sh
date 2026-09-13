#!/bin/sh
# v9.7 · the two new sounds, from the ElevenLabs takes in this folder.
# Run from here. `urls.txt` records where each take came from.
set -e
peak() { python3 peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }

# ---- beattick · the heartbeat's metronome --------------------------------
# TWO takes were generated from one prompt and the pick is MEASURED, not a
# matter of taste: `_a` carries THREE transients (0.97 s, 1.88 s at -5 dB,
# 2.19 s at -15 dB) -- a real lub-dub-plus pattern, which as a metronome
# double-hits every beat -- and `_b` carries exactly one. For a rhythm cue
# the measure is DECAY and the number of attacks, never character.
#
# Cut from 20 ms BEFORE its own peak (the v9.4 law: an attack 100 ms into the
# file reads as late however short the file is), 0.45 s long so it can never
# overlap itself at the fastest gap the chapter reaches (0.42 s).
ffmpeg -v error -y -i beattick_b.mp3 \
  -af "atrim=0.043:0.493,asetpts=N/SR/TB,afade=t=out:st=0.40:d=0.05" \
  -ar 44100 b_cut.wav
# Peak-matched to the HUD contract's -2.0 dBFS, and EACH ENCODER GETS ITS OWN
# SOURCE (the v9.6 law) -- with the v9.7 correction that the offset is PER
# FILE: this short, low-frequency file LOSES 0.8 dB through libopus where a
# spoken line gains 0.7, so the two compensations are measured, not assumed.
ffmpeg -v error -y -i b_cut.wav -af "volume=-0.52dB" -ar 44100 b_mp3.wav
ffmpeg -v error -y -i b_cut.wav -af "volume=-1.19dB" -ar 48000 b_ogg.wav
ffmpeg -v error -y -i b_mp3.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/beattick.mp3
ffmpeg -v error -y -i b_ogg.wav -map_metadata -1 -c:a libopus   -b:a 96k  -ar 48000 ../../assets/audio-opus/beattick.ogg
echo "beattick mp3 $(peak ../../assets/audio/beattick.mp3)  ogg $(peak ../../assets/audio-opus/beattick.ogg)   (want -2.0)"

# ---- e2dread · the bed under the whole chapter ---------------------------
# Again two takes, again picked by MEASUREMENT: dread3 puts 80.7 % of its
# energy under 120 Hz and only 13.8 % in 120-500, the band his voice lives
# in; dread5 puts 36.2 % there and 63.4 % in 500-3k -- mid-range shimmer
# sitting straight on top of the narration. (Note this is the OPPOSITE
# verdict to v9.2's campamb, where 84 % under 120 Hz disqualified a take that
# had to sound like a TREELINE. Same measure, different job.)
#
# eleven_music_v2 has no loop flag (v9.2), so the loop is made by hand. The
# source's first ~4 s fades in from silence and its most stable 50 s starts
# at 9 s, so 12.0-55.0 is taken and its last 3 s crossfaded over its head:
# 40.0 s out. The seam is checked at the JOINT, not by RMS -- measured 0.005
# between the last sample and the first, which is -46 dBFS, 38 dB under the
# loop's own peak.
ffmpeg -v error -y -i dread3.mp3 -af "atrim=12.0:55.0,asetpts=N/SR/TB" -ar 48000 -ac 2 d_body.wav
python3 - <<'PY'
import numpy as np, subprocess
sr = 48000
r = subprocess.run(['ffmpeg','-v','error','-i','d_body.wav','-f','f32le','-ac','2','-ar',str(sr),'-'],
                   capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
XF = int(3.0 * sr); L = len(x) - XF
w = np.linspace(0, 1, XF)[:, None]
out = x[:L].copy()
out[:XF] = x[:XF] * w + x[L:L+XF] * (1 - w)     # the tail fades INTO the head
out = np.clip(out, -1, 1)
print('  loop %.1f s   joint discontinuity %.1f dBFS'
      % (L / sr, 20 * np.log10(np.abs(out[0] - out[-1]).max() + 1e-12)))
out.astype(np.float32).tofile('d_loop.f32')
PY
ffmpeg -v error -y -f f32le -ar 48000 -ac 2 -i d_loop.f32 d_loop.wav
# Levelled to the -10.5 dBFS peak the three shipped beds sit at (e2bed -10.4,
# e2day -10.8, campamb -13.2), so the chapter's 0.26 mix number means what it
# says against them.
ffmpeg -v error -y -i d_loop.wav -af "volume=-2.91dB" -ar 48000 d_lvl.wav
ffmpeg -v error -y -i d_lvl.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/e2dread.mp3
ffmpeg -v error -y -i d_lvl.wav -map_metadata -1 -c:a libopus   -b:a 96k  -ar 48000 ../../assets/audio-opus/e2dread.ogg
echo "e2dread mp3 $(peak ../../assets/audio/e2dread.mp3)  ogg $(peak ../../assets/audio-opus/e2dread.ogg)   (want -10.5)"

# the intermediates go: the source takes above and the shipped mp3/ogg are
# what the repo keeps, and re-running this rebuilds every one of them
rm -f b_cut.wav b_mp3.wav b_ogg.wav d_body.wav d_loop.wav d_loop.f32 d_lvl.wav
