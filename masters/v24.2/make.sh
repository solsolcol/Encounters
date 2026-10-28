#!/bin/sh
# v24.2 (v24.3's sound) · EPISODE 3 CHAPTER 5, THE CHILDREN ON MY ALTAR — the sound buff Chad asked for on 28 Oct 2026
# ("there is a huge lack of music, ambient sounds, sfx, stings or other sounds in ep3 chp5. It needs to be buffed up
# more"). The audit that measured every beat and the plan this follows: L3-sound-report.md (and sound-plan.md).
# Generated on the chapter's own flows — effects xots9tsBdCqsc1hPEyL3 (eleven_text_to_sound_v2, duration_seconds as a
# PARAMETER, the v9.2 law), music CYNtKVY1iCq6HUIHF6Ki (eleven_music_v2_5, instrumental), voices o8vTamhekdpbWovwvYSp —
# two takes each; the session ids in sfx/, music/ and voices/sessions.json are the only handle on a generation. The
# first effects run was refused (the workspace had no credits) and seven music takes failed; their sessions are kept
# under "_refused" / "_failed", and every one was re-run once Chad had topped the credits up. Every take MEASURED
# (sfx/meas.txt, music/meas.txt: ../v22.0/cp5/meas.py — the share under 120 Hz a phone plays as nothing, 120–500 Hz
# where his voice lives, 500 Hz–3 kHz a phone plays best, over 3 kHz; the onset, the end, the holes), picked by
# measurement, one line each below.
#
# THE VOICE (L6-9: card line C said "I stopped giving to them", and ending C shows him giving MORE each night, a wish
# under each — the card's text changes with the take, never before it)
#   z5C   a   "[regretful] Every gift came with a wish. I only kept asking." — both takes say the words exactly
#             (voices/tr.json); a's end is the cleaner (-34.8 against -28.2), both end on signal, so faded
#
# THE EFFECTS — every act the hands do that was silent (L3's beat map, row 6)
#   k5cup         a  the pour rising in pitch as the cup fills, to 0.75 s (b stops at 0.6); 97 % in the phone band
#   k5chair       a  the gas lift's sigh and the seat (42 % in 500 Hz–3 kHz; b is 46 % in 120–500, his voice's band);
#                    quiet as made (−30 peak), so peak-matched up; high-passed (33 % sub-bass)
#   k5chairup     b  the chair rolled back (b keeps 32 % in the phone band; a is 71 % sub-bass)
#   k5kneel       a  knees and a sleeve onto the tiles, the fuller of two (−17 against −22 RMS)
#   k5key         a  one click of the box key (b's peak is over full scale as made)
#   k5lid         a  the lid's creak in the phone band (89 %); its overs as made are taken by the peak-match
#   k5mat         b  the reeds creaking (78 % in the phone band; a is 44 % sub-bass)
#   k5wrap        b  cloth folded and tied, more of it in the phone band (37 % against 23)
#   k5baglift     b  the clink and the crinkle (59 % in the phone band; a is all crinkle, 74 % over 3 kHz)
#   k5phone       a  the haptic buzz on the tiles and the glass tick (b is only the tick, −39 RMS)
#   k5fly         a  the housefly on and off to 3.5 s (b is 99 % under 500 Hz with a hole)
#   k5templebell  a  the bright ring with the longer decay (to 3.6 s; b stops at 2.25) — laid OVER k5tbell, chapter 4's
#                    bell, which has 70 % of its energy under 120 Hz and nothing over 500 Hz: a thud on a phone
#   k5step        COPY of e4c1's w4barestep (one bare footfall on a room's tiles, 78 % in 120–500 Hz): both of this
#                 chapter's own takes were 99 % under 120 Hz (the v16.0 thump again), and a footfall is a footfall
#   k5flame       MADE (synth.py): both takes were lighter clicks with silence between, not a flame
# THE STINGS — the turns that had none
#   k5reveal  a  the cloth opening at the counter: celesta and khim rising, the longer shimmer (to 1.8 s)
#   k5vow     b  "Every day. I promise.": the bowl bell over a chord, 89 % in the phone band (a is 42 % sub-bass)
#   k5given   a  each drink set down, one khim note played at 1.0 / 1.26 / 1.5 (C, E, G): a keeps a third of itself
#                in the phone band (b is 98 % in 120–500 Hz)
#   k5return  b  the black lifting after a possession: the soft swell over 3 kHz (a is a rumble starting 1.25 s in)
#   k5shake   b  ending B's stranger's message: the dissonant swell rising to a stop at 2.7 s; high-passed at 120 Hz
#                (both takes were 84–88 % sub-bass — what is left is the breath of it a phone can play)
#   k5void    MADE (synth.py): both takes were 99 % under 120 Hz (b is −54 dBFS whole)
# THE AMBIENT POOLS — one at a time on the chapter's clock, e3c3's ambTick (v21.13): the room, the counter's mall
#   k5gecko      a  the chirps, high-passed at 200 Hz (73 % of the take is a sub-bass hum under them; b is 99 %)
#   k5moto       a  the pass-by in the phone band (39 %; b is 68 % sub-bass)
#   k5dog        a  two far barks, the cleaner tail (−58 against −47, b cut off)
#   k5liftmotor  b  the lift motor through the wall with its brake's two clunks (b keeps 49 % in 120–500 Hz against
#                   39); high-passed, low-passed as through a wall, faded at both ends (the take is a cut of a hum)
#   k5gate       a  the grille sliding and latching (62 % in the phone band); low-passed: down a corridor
#   k5fridge     b  the compressor's hum with a body (41 % in 120–500 Hz; a is 95 % sub-bass); faded both ends
#   k5drip       a  the drips, high-passed at 150 Hz (the take is 70 % sub-bass under them; b holds to its last sample)
#   k5bus        a  the night bus going by below, its envelope a pass-by (−29 -> −17 -> −51); high-passed at 80 Hz
#   k5guard      a  the keys jingling down the corridor (99 % over 3 kHz, a clean tail −76.6)
#   k5liftding   b  the far lift's chime and doors (16 % in the phone band; a is 88 % sub-bass)
#   k5mop        a  the mop's slosh far down the corridor, cut to its first 4.8 s and faded; high-passed (48 % sub)
#   k5walkie     a  the guard's walkie-talkie burst (b starts on signal, head −7.8)
#   k5escal      b  the escalator's run, high-passed and faded (both are 52–56 % sub-bass; b's tail is the cleaner)
#
# THE BEDS (looped by hand, ../v22.0/cp9/loopfast.py; levelled by RMS, ../v21.12/level_rms.py — v21.13's recipe)
#   k5shopnight    b  the shop after closing — the air-conditioner, the tube's hum, the clock: laid UNDER chapter 4's
#                     after-hours air and corridor (k5shopair, k5mall), which stay; high-passed at 100 Hz (a is 72 %
#                     sub-bass, b 45 %)
#   k5templenight  b  World M at night (film M had no bed of its own — L3-8): the insects, even (crest 14 dB)
#   k5court        a  ending D's courtyard at first light: sparrows and mynas (85 % over 3 kHz; b is 65 % in 120–500 Hz)
#   k5day          a  A's and C's grey afternoons (they ran the DAWN bed at a third — birds at four in the afternoon):
#                     far traffic, a school bell, a drill (45 % over 500 Hz once high-passed; b is 72 % sub-bass)
#   k5heart       MADE (synth.py): both takes were 94–95 % under 120 Hz AND irregular — no even loop to cut
#   k5roomnight   MADE AND NOT USED: a is 62 % crickets over 3 kHz and 36 % sub-bass hum — high-passed (the bed rule:
#                 25 % at most under 120 Hz), it is the same crickets k5nightbed already carries; b is −62 dBFS sub-bass.
#                 The room's life comes from the pools instead
#
# THE MUSIC — every cue asked in the lullaby's key and lilt (C major, 3/4, ~72/min), as v23.0's were
#   k5open       a  the corridor at closing (b is 77 % sub-bass); its own shape (−24 -> −19) warms to the door
#   k5counter    b  the counter's bed: even (−14 to −19 for 54 s; a is −45 for its first 14 s and swings 9 dB after),
#                   high-passed (9 % sub-bass)
#   k5madeM      b  film M: it HOLDS (−17 to −22 from 5 to 21 s) through the hall and the little one's face — a fades
#                   from 9 s on, exactly as the hall appears (L3-8's silence again)
#   k5vowtheme   b  film K under the three asks: even, 76 % in 120–500 Hz but 0.5 % sub-bass (a is 36 % sub-bass)
#   k5home       a  the home film: no hole (b has one); its first 2.3 s are silence, cut
#   k5care2      a  the offerings from the incense on: a puts more of itself in the phone band than b (24 % against 11)
#                   and less in his voice's (75 % against 86) — the v23.0 k5care measure
#   k5decide     b  the question to the decision: 66 % in the phone band (a 15 %); its sparse notes are its unevenness
#   k5climbloop  b  COME BACK's loop: 82 % in the phone band (a 59 %); the steady stretch 9.5–25 s looped
#   k5driftA     a  ending A: no hole (b drops 20 dB at 32 s and never comes back)
#   k5screens    a  ending B: it builds (−37 -> −15 at 24 s) and falls back, as the scene does; high-passed (20 % sub)
#   k5greed      b  ending C's wishes: steady to its end, cut dead (a is 37 % sub-bass)
#   k5merit      b  ending D, the temple to the three lights: the more of it in the phone band (66 % against 54); the
#                   take is level, so the swell is SHAPED onto the three lights (48.9 s in: −5 dB rising to 0)
#   k5boxloop, k5boxdown, k5endA (re-made) — fates2.py, from k5lullaby b (nothing generated)
set -e
cd "$(dirname "$0")"
peak() { python3 ../v9.7/peak.py "$1" | sed 's/.*peak //; s/ dBFS.*//'; }
enc() { # name src target_mp3 target_ogg opus_bitrate channels — peak-matched, two passes (the encoders move it)
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
him() { n=$1; s=$2; shift 2; python3 ../v21.0/prep.py "$s" p_$n.wav "$@" >/dev/null
  ffmpeg -v error -y -i p_$n.wav -af "highpass=f=70:poles=2" -ar 48000 -ac 1 h_$n.wav; enc $n h_$n.wav -6.85 -6.6 64k 1; rm -f h_$n.wav p_$n.wav; }
fx() { # name src peak [ffmpeg filter] — an effect, in its own channel layout, peak-matched
  n=$1; s=$2; pk=$3; af=${4:-anull}
  ch=$(ffprobe -v error -show_entries stream=channels -of csv=p=0 "$s" | head -1)
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 w_$n.wav; enc $n w_$n.wav $pk $pk 96k $ch; rm -f w_$n.wav; }
copy() { cp ../../assets/audio/$1.mp3 ../../assets/audio/$2.mp3; cp ../../assets/audio-opus/$1.ogg ../../assets/audio-opus/$2.ogg; echo "$2 <- $1 (bytes)"; }
bed() { # name src target_rms ceiling high-pass — looped by hand, levelled by RMS
  n=$1; s=$2; t=$3; c=$4; hp=${5:-60}
  ffmpeg -v error -y -i "$s" -af "highpass=f=$hp:poles=2" -ar 48000 -ac 2 b_hp_$n.wav
  python3 ../v22.0/cp9/loopfast.py b_hp_$n.wav b_lp_$n.wav 1.5
  python3 ../v21.12/level_rms.py b_lp_$n.wav b_$n.wav $t $c
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 ../../assets/audio/$n.mp3
  ffmpeg -v error -y -i b_$n.wav -map_metadata -1 -c:a libopus -b:a 96k -ar 48000 ../../assets/audio-opus/$n.ogg
  echo "$n <- $s  (bed, RMS $t)"; rm -f b_hp_$n.wav b_lp_$n.wav b_$n.wav b_*.f32; }
mus() { # name src [ffmpeg filter] — music, stereo, peak -3 (v22.4's f4music), Opus 128k
  n=$1; s=$2; af=${3:-anull}
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 m_$n.wav; enc $n m_$n.wav -3.0 -3.0 128k 2; rm -f m_$n.wav; }
loop() { # name src filter xf — a music bed looped by hand (loopfast), then peak-matched like k5care
  n=$1; s=$2; af=$3; xf=$4
  ffmpeg -v error -y -i "$s" -af "$af" -ar 48000 -ac 2 l_$n.wav; python3 ../v22.0/cp9/loopfast.py l_$n.wav l2_$n.wav $xf
  enc $n l2_$n.wav -3.0 -3.0 128k 2; rm -f l_$n.wav l2_$n.wav *.f32; }
F="--fade 0.12"

# ---- made here (nothing generated)
mkdir -p proc
python3 synth.py proc
python3 fates2.py ../v23.0/music/raw/k5lullaby_b.mp3 proc

# ---- the copy, byte for byte (the v21.1 split law: this chapter's own name)
copy w4barestep k5step

# ---- the voice
him   z5C          voices/raw/z5C_a.mp3 $F

# ---- the effects
fx k5cup          sfx/raw/k5cup_a.mp3 -10
fx k5chair        sfx/raw/k5chair_a.mp3 -10 "highpass=f=100:poles=2"
fx k5chairup      sfx/raw/k5chairup_b.mp3 -10 "highpass=f=100:poles=2"
fx k5kneel        sfx/raw/k5kneel_a.mp3 -10
fx k5key          sfx/raw/k5key_a.mp3 -10
fx k5lid          sfx/raw/k5lid_a.mp3 -10
fx k5mat          sfx/raw/k5mat_b.mp3 -10
fx k5wrap         sfx/raw/k5wrap_b.mp3 -10
fx k5baglift      sfx/raw/k5baglift_b.mp3 -10
fx k5phone        sfx/raw/k5phone_a.mp3 -10
fx k5fly          sfx/raw/k5fly_a.mp3 -12
fx k5templebell   sfx/raw/k5templebell_a.mp3 -8
enc k5flame proc/k5flame.wav -10 -10 96k 1
# ---- the stings
fx k5reveal       sfx/raw/k5reveal_a.mp3 -8
fx k5vow          sfx/raw/k5vow_b.mp3 -8
fx k5given        sfx/raw/k5given_a.mp3 -8
fx k5return       sfx/raw/k5return_b.mp3 -8
fx k5shake        sfx/raw/k5shake_b.mp3 -8 "highpass=f=120:poles=2,highpass=f=120:poles=2"
enc k5void proc/k5void.wav -8 -8 96k 1
# ---- the pools
fx k5gecko        sfx/raw/k5gecko_a.mp3 -8 "highpass=f=200:poles=2,highpass=f=200:poles=2"
fx k5moto         sfx/raw/k5moto_a.mp3 -8 "highpass=f=80:poles=2"
fx k5dog          sfx/raw/k5dog_a.mp3 -8
fx k5liftmotor    sfx/raw/k5liftmotor_b.mp3 -8 "highpass=f=90:poles=2,lowpass=f=2500:poles=2,afade=t=in:d=0.6,afade=t=out:st=4.2:d=0.8"
fx k5gate         sfx/raw/k5gate_a.mp3 -8 "lowpass=f=3000:poles=2"
fx k5fridge       sfx/raw/k5fridge_b.mp3 -8 "highpass=f=100:poles=2,afade=t=in:d=1.0,afade=t=out:st=2.8:d=1.2"
fx k5drip         sfx/raw/k5drip_a.mp3 -8 "highpass=f=150:poles=2,highpass=f=150:poles=2"
fx k5bus          sfx/raw/k5bus_a.mp3 -8 "highpass=f=80:poles=2"
fx k5guard        sfx/raw/k5guard_a.mp3 -8
fx k5liftding     sfx/raw/k5liftding_b.mp3 -8 "highpass=f=100:poles=2"
fx k5mop          sfx/raw/k5mop_a.mp3 -8 "atrim=0:4.8,asetpts=PTS-STARTPTS,highpass=f=120:poles=2,afade=t=in:d=0.15,afade=t=out:st=4.2:d=0.6"
fx k5walkie       sfx/raw/k5walkie_a.mp3 -8
fx k5escal        sfx/raw/k5escal_b.mp3 -8 "highpass=f=100:poles=2,afade=t=in:d=1.0,afade=t=out:st=3.8:d=1.2"

# ---- the beds
bed k5shopnight   sfx/raw/k5shopnight_b.mp3   -30 -14 100
bed k5templenight sfx/raw/k5templenight_b.mp3 -30 -14
bed k5court       sfx/raw/k5court_a.mp3       -30 -12
bed k5day         sfx/raw/k5day_a.mp3         -30 -14 100
enc k5heart proc/k5heart.wav -6 -6 64k 1          # (an exact loop of nine beats as made: no loopfast)

# ---- the music
mus  k5open       music/raw/k5open_a.mp3      "atrim=0:19.6,asetpts=PTS-STARTPTS,afade=t=out:st=18.0:d=1.6"
loop k5counter    music/raw/k5counter_b.mp3   "atrim=2.0:44.0,asetpts=PTS-STARTPTS,highpass=f=90:poles=2" 2.0
mus  k5madeM      music/raw/k5madeM_b.mp3     "atrim=0:20.4,asetpts=PTS-STARTPTS,afade=t=out:st=19.0:d=1.4"
mus  k5vowtheme   music/raw/k5vowtheme_b.mp3  "atrim=0:48.4,asetpts=PTS-STARTPTS,afade=t=out:st=46.8:d=1.6"
mus  k5home       music/raw/k5home_a.mp3      "atrim=2.3:37.3,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=33.4:d=1.6"
loop k5care2      music/raw/k5care2_a.mp3     "atrim=0.5:42.0,asetpts=PTS-STARTPTS" 2.0
loop k5decide     music/raw/k5decide_b.mp3    "atrim=0:36.0,asetpts=PTS-STARTPTS" 2.0
loop k5climbloop  music/raw/k5climbloop_b.mp3 "atrim=9.5:25.0,asetpts=PTS-STARTPTS" 1.5
mus  k5driftA     music/raw/k5driftA_a.mp3    "atrim=0:46.5,asetpts=PTS-STARTPTS,afade=t=out:st=44.5:d=2.0"
mus  k5screens    music/raw/k5screens_a.mp3   "atrim=0:36.0,asetpts=PTS-STARTPTS,highpass=f=100:poles=2,afade=t=out:st=34.0:d=2.0"
mus  k5greed      music/raw/k5greed_b.mp3     "atrim=0:22.0,asetpts=PTS-STARTPTS,afade=t=out:st=21.97:d=0.03"
mus  k5merit      music/raw/k5merit_b.mp3     "atrim=0:53.5,asetpts=PTS-STARTPTS,volume='if(lt(t,48.9),pow(10,(-5+5*t/48.9)/20),1)':eval=frame,afade=t=out:st=51.5:d=2.0"
enc k5boxloop proc/k5boxloop.wav -3.0 -3.0 128k 2
enc k5boxdown proc/k5boxdown.wav -3.0 -3.0 128k 2
enc k5endA    proc/k5endA.wav    -3.0 -3.0 128k 2
rm -rf proc   # (made again by every run)
