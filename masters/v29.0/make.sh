#!/bin/sh
# v29.0 · EPISODE 5 CHAPTER 1, "The Love Spell That Followed Me Home" (e5c1): THE RECIPE OF RECORD (begun 27 Nov 2026 by WORDS,
# M1; every piece adds its section as it lands: every job id, every pick and why, as masters/v28.0/make.sh does).
# The plan is docs/V29.0-E5C1-PLAN.md; where the build stands is docs/V29.0-E5C1-BUILD.md (read it first).
# Run from the repo root. Nothing here spends a credit: the generations are recorded, never re-run from this file
# (a model is made ONCE: the tracker's 2).
set -e

# ---------------------------------------------------------------------------------------------------------------- 1 · WORDS (M1)
# THE CHAPTER IS GENERATED: src/chapters/e5/e5c1.js from masters/v29.0/parts/*.js (joined in name order) and the one copy of
# its words, masters/v29.0/script/lines.json (83 rows: Grandmaster Pho 38 and two chants, Master Zavier 33 with the four
# lines under the cards, Grace 5, Marcus 5; every length PROVISIONAL until its take is measured).
#   the machinery is COPIED from src/chapters/e4/e4c5.js by pinned ranges (assemble.py COPY_FROM: its sha1 as live at build
#   118, bdc91e592040c4bf9857cdcf486179af335d26ff): the build's head (617-759), one parse per asset (808-1186), the people
#   (2355-4477), the drawn surfaces' helpers (4604-4610), Grandmaster Pho's laws, look D and his seat (4633-6153) and the dark
#   specks of his robe (12714-12970). If e4c5.js changes, assemble.py refuses until every range is checked and re-pinned.
#   the asset keys: masters/v29.0/keys.py writes build.py's rows, its hosted-only set and the head's list from its table and
#   from masters/v29.0/people/keys.json (CAST) and masters/v29.0/props/keys.json (THINGS); a key only when its file is in assets/.
#   the voice registry: masters/v29.0/script/registry.py writes src/voicelines.js's rows (between E5C1 LINES BEGIN/END) for
#   every line whose take is on disk and measured (chaptertest takes no row without its take: this chapter is never a preview).
#   the Ratana chant's words: Thanissaro Bhikkhu's A Chanting Guide carries the Discourse on Treasures as its Cha Ratana Paritta
#   Gatha (Section0052, read 27 Nov 2026), not the sutta's opening verses the plan names: its first three verses are taken.
# THE SKELETON, CHECKED (27 Nov 2026): node --check, tools/probes/usebefore.mjs, undefscan.mjs and dupfuncs.mjs over every chapter
#   (assemble.py runs the same before it writes), chaptertest exit 0; built on a snapshot (tools/buildlock.sh) and booted
#   (CH=e5c1 tools/probes/boot.mjs: play, no page error); then pressed through by a one-off probe from the title: the room's
#   seven stand-ins, the keepsake, the breaking, the cord and home, three o'clock's two, the decision's four answers on the
#   card, ending A to its card, with no page error and the three people (pho, p4mala, p5collector) landed and drawn.
#   (Committed in the coordinator's work-in-progress save 51d1b14 and here.)
words() {
  python3 -I masters/v29.0/keys.py --write
  python3 -I masters/v29.0/script/registry.py --write
  python3 -I masters/v29.0/assemble.py
  node chaptertest.mjs > /dev/null
}

# ---------------------------------------------------------------------------------------------------------------- 2 · CAST (M3)
# (CAST's section: Grace and Marcus, every job id, every take, every measure: masters/v29.0/people/RECORD.md)

# ---------------------------------------------------------------------------------------------------------------- 3 · THINGS (M4)
# (THINGS' section: masters/v29.0/props/RECORD.md)

# ---------------------------------------------------------------------------------------------------------------- 4 · SOUND (M8)
# (SOUND's section: masters/v29.0/sound/picks.json and its own make.sh)

case "${1:-words}" in
  words) words ;;
  *) echo "make.sh: words (the only section that runs from here so far)"; exit 2 ;;
esac
