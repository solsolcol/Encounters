#!/bin/bash
# v25.4 · EPISODE 4 CHAPTER 2: the piece on the shelf bigger, its red glow, its black smoke and its whisper
# (docs/V25.4-E4C2-SHELF-PIECES.md). The pictures are code (masters/v25.0/parts: PIECE_FIT, PGLOW, pieceGlowTick);
# this is the recipe of the one new sound.
#
# THE WHISPER (x2whisper). Chad, 10 Nov 2026: "some sound effects on those items to make it more creepy, like
# whispering sounds". A loop heard near the shelf while the piece stands on it (e4c2's ambience; mixBeds sets its
# volume by how near he is and its side by where the shelf is; the examination's look raises it and his hand closing
# on the piece ends it). It carries NO WORDS, so nothing is captioned (v21.31; the black master's own chant is
# wordless by Chad's ruling, v24.25).
#
# Chosen on taste, so every candidate goes to him levelled alike (previews/, v10.6) and his ear decides; the build
# carries the measured pick until then. The candidates (sfx/raw; sfx/script.json and sessions.json are the generated
# ones' recipe: flow SFnWUI9IMdhGxt73er5Q, eleven_text_to_sound_v2, 14 s, loop, prompt influence 0.4, two takes each;
# measured with ../v24.24/meas.py and sfx/meas2.py, and each heard by a transcriber, faster-whisper small.en):
#   E  THE BLACK MASTER'S OWN WHISPER, a new murmur laid from his meaningless whispered phrases (masters/v24.24/raw
#      n1-n4, the takes chapter 1's chant is made of; ../v24.24/layer.py: three phrases leading, three more backwards
#      5 dB under, two more 9 dB under). 13.94 s, 3 % voiced (a true whisper), 3.5 syllables a second, the steadiest
#      of all (+1.8 / -4.9 dB second by second: a loop that does not surge is not heard to come round), 1.4 dB lost on
#      a phone. No word in it by construction.                                                        -> THE PICK
#   A  several hushed voices at once (x2whisperA_a): 4 % voiced, 4.0 syllables a second, 94 % of it over 2 kHz, a
#      phone loses 0.3 dB; it ebbs 13 dB in its quietest second; the transcriber hears nothing.  -> preview b
#      (its other take, A_b, is out: the transcriber wrote English phrases from it, "I said stop", "I got to stop".)
#   B  one man's slow incantation (x2whisperB_b): 11 % voiced, 1.5 syllables a second, one burst 10 dB over its
#      middle; the transcriber hears nothing.                                                      -> preview c
#      (B_a is out: 30 % voiced and 8 % over 2 kHz, a low voice and not a whisper.)
#   C  a ghostly hiss (x2whisperC_a): 1 % voiced, no syllables to count (0.1 a second): breath and air, not
#      whispering.                                                                               -> preview d
#      (C_b is out: the transcriber wrote a sentence from it.)
# WHY E: the piece is the black master's work, and the whisper on it is his own voice, the one chapter 1's player
# heard him chant in; it is the steadiest loop; it is wordless by construction, where a generated "whispering" take
# may carry half-words (A_b, C_b). A is the pick if Chad wants many voices instead.
#
# THE TREATMENT, the chapter's beds' own (masters/v25.0/make.sh `bed`): what a phone cannot play taken off, looped by
# hand (../v22.0/cp9/loopfast.py: the slow drift flattened, the tail crossfaded over the head, 1.5 s), levelled by its
# average (../v21.12/level_rms.py) to -22 dBFS under a -6 ceiling: at its fullest in play (WHISPER.vol 0.5) it stands at
# about -28, twelve under a voice (-16), and at half that again while a line is said. mp3 128k and Opus 96k, each from
# the same looped wav.
#   bash masters/v25.4/make.sh            the build's sound
#   bash masters/v25.4/make.sh previews   the four previews, levelled alike
set -e
cd "$(dirname "$0")"
bedwav() { # name src target ceiling -> b_<name>.wav (looped, levelled, 48 kHz stereo)
  n=$1; s=$2; t=$3; c=$4
  ffmpeg -v error -y -i "$s" -af "highpass=f=120:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 -I ../v22.0/cp9/loopfast.py b_hp_$n.wav b_lp_$n.wav 1.5
  python3 -I ../v21.12/level_rms.py b_lp_$n.wav b_$n.wav $t $c
  rm -f b_hp_$n.wav b_lp_$n.wav b_*.f32; }
if [ "${1:-}" = previews ]; then
  mkdir -p previews
  i=0
  for pair in "a:sfx/raw/x2whisperE.wav" "b:sfx/raw/x2whisperA_a.mp3" "c:sfx/raw/x2whisperB_b.mp3" "d:sfx/raw/x2whisperC_a.mp3"; do
    k=${pair%%:*}; s=${pair#*:}
    bedwav pv_$k "$s" -22 -6
    # twice round, so the loop's joint is heard
    ffmpeg -v error -y -stream_loop 1 -i b_pv_$k.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 previews/whisper-$k.mp3
    rm -f b_pv_$k.wav
  done
  ls -la previews
  exit 0
fi
bedwav x2whisper sfx/raw/x2whisperE.wav -22 -6
ffmpeg -v error -y -i b_x2whisper.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/x2whisper.mp3
ffmpeg -v error -y -i b_x2whisper.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/x2whisper.ogg
rm -f b_x2whisper.wav
for f in ../../assets/audio/x2whisper.mp3 ../../assets/audio-opus/x2whisper.ogg; do
  printf '%s  %s s\n' "$f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"; done
