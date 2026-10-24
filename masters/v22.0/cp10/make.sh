#!/bin/sh
# v22.0 CP10 · EPISODE 3 CHAPTER 4 — the opening film's sound (docs/V22.0-E3C4-PLAN.md §4.0).
# THE WORKSPACE HAS NO CREDITS (24 Oct: 0 of 127,573 left), so the film's own takes (its score, the scroll wheel, a far
# siren, the escalator, the tray on the glass — sessions.json, every one refused, nothing charged) never came back.
# Until they do, the film is made of sounds this game already has, each under a name of e3c4's OWN (the v4.2 split: a
# sound only one chapter asks for is that chapter's; quoting e3c1's or e3c3's names would have pulled them into the
# shared pack that every player downloads at boot):
#   f4office    e3c1's office at night (officehum), byte for byte
#   f4keys      e3c1's keys (keytype), byte for byte
#   f4shopbell  e3c3's shop door bell (shopbell), byte for byte
#   f4click     ONE key out of e3c1's other keytype take (v16.0 raw/keytype_a, the loud isolated stroke at 2.62 s — the
#               next is 0.28 s later), cut, faded, peak-matched to -6 dBFS: the mouse's click on the fifth result
# The film's score is World Y's drone (y4dread) until its own is generated.
set -e
cd "$(dirname "$0")"
. ../cp5/encfns.sh
A=../../../assets
for p in "officehum f4office" "keytype f4keys" "shopbell f4shopbell"; do set -- $p
  cp $A/audio/$1.mp3 $A/audio/$2.mp3; cp $A/audio-opus/$1.ogg $A/audio-opus/$2.ogg; echo "$2 <- $1 (bytes)"; done
python3 ../../v21.0/proc.py trim ../../v16.0/raw/keytype_a.mp3 w_click.wav 2.60 2.86 0.06 >/dev/null
enc f4click w_click.wav -6.0 -6.0 96k 2
rm -f w_click.wav w_click.wav.f32
