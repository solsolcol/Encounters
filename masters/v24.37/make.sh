#!/bin/bash
# v24.37 · HIS SHOP, INSIDE AND OUT — episode 4 chapter 1, Chad's ask 7 (docs/V24.32-E4C1-NOTES.md): "Also i think the
# players amulet shop can still be improved more. And also the outside of the amulet shop too. Why are other stores also
# closed. Why not show real people walking past the shop etc."
#
# THE SOUND OF THE MALL OPEN — the corridor had only v24.0's closed-mall air and a far broom. Generated on the chapter's
# effects flow zNE7zBvy1ngpOBqOopQH, node qBdnrWUkvqnBIANNFKxo (eleven_text_to_sound_v2, 30 s, loop, prompt influence 0.5;
# the first run's prompt was 7 characters over the model's 450 and all four were refused, re-run shortened):
#   "A small neighbourhood shopping mall in Singapore on a weekday morning: footsteps of a few people passing on a
#    terrazzo floor, two people chatting quietly in Mandarin as they walk by, a shopkeeper's distant talk with a customer,
#    a plastic bag rustling, a trolley rolling far off, steady air-conditioning hum. Calm and natural, no music, no
#    announcements, no loud voices."
# Four takes (generations 0rrmMnPww4HLVeAnwdTU a, B9EFBRxjR23YbewmgmoQ b, sj8TZhMW1IY7ZYSJsg1B c, nyaB9sqM1x5rwAEAEbgP d),
# measured (../v22.0/cp5/meas.py; half-second RMS spread; the loop seam):
#   a  rms -28.7  peak -7.0  mid 0.53 hi 0.04  spread 2.3 dB  seam -3.0 dB    steady, but the most in the voice band
#   b  rms -27.8  peak +1.4  spread 9.5 dB                                   OUT: a loud event, and it clips
#   c  rms -30.3  peak -3.6  mid 0.44 hi 0.16  spread 4.2 dB  seam -1.6 dB    PICKED: the least in the voice band under
#                                                                             the narration, the footsteps crisp, clean
#   d  rms -28.9  peak +1.4  hi 0.19  spread 3.0 dB  seam +3.9 dB            clips
# c is laid twice with a half-second crossfade (it was generated to loop) and cut to 40 s, so one cue covers the opening's
# whole shop (0.3 to 37.0 s) and the coda's; high-passed at 100 Hz (a phone plays nothing under 120), peak-matched to
# -10 dBFS as v24.0's effects were. Every take stays in sfx/raw; the three survivors go to Chad as a loudness-matched reel
# (previews/), his ear the judge (CLAUDE.md: taste is his).
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
ffmpeg -v error -y -i sfx/raw/w4mallpeople_c.mp3 -ar 48000 m_c.wav
ffmpeg -v error -y -i m_c.wav -i m_c.wav -filter_complex "[0][1]acrossfade=d=0.5:c1=tri:c2=tri,highpass=f=100:poles=2,atrim=0:40,afade=t=in:st=0:d=0.6,afade=t=out:st=38.8:d=1.2" -ar 48000 w_mall.wav
enc w4mallpeople w_mall.wav -10 -10 96k 2; rm -f m_c.wav w_mall.wav
# the reel for Chad: the three that passed the screen, 9 s each from their middle, loudness-matched (-23 LUFS), a beat between
mkdir -p previews
for t in a c d; do ffmpeg -v error -y -ss 8 -t 9 -i sfx/raw/w4mallpeople_$t.mp3 -af "loudnorm=I=-23:TP=-2:LRA=11,afade=t=in:d=0.3,afade=t=out:st=8.5:d=0.5" -ar 44100 -ac 2 r_$t.wav; done
ffmpeg -v error -y -f lavfi -t 1 -i anullsrc=r=44100:cl=stereo s1.wav
ffmpeg -v error -y -i r_a.wav -i s1.wav -i r_c.wav -i s1.wav -i r_d.wav -filter_complex "[0][1][2][3][4]concat=n=5:v=0:a=1" -c:a libmp3lame -b:a 160k previews/e4-mall-sound-a-c-d.mp3
rm -f r_?.wav s1.wav
