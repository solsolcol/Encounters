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
# MARCUS'S THIRD THROW (CAST-3, R7 "just generate him without glasses", 27 Nov 2026; RECORD.md §9, PROMPTS3.txt). The second
# throw kept: src/people/second/second-* and the ledger's `marcus_second`. Every id is also in src/people/jobs.json (`marcus`).
#   reference   Higgsfield gpt_image_2_6 xhigh 2k 2:3, the second reference (media 31fceca2-fa91-4f31-a1bb-e9aae38709cd) as its
#               image reference: job 5f29da16-5077-425e-baef-af197d8a9ed0 -> src/people/refs/marcus-a3-2k.png (3.5)
#   model       python3 -I masters/v29.0/people/meshy.py model <[{"name":"marcus","image":"masters/v29.0/src/people/refs/marcus-a3-2k.png","kind":"person"}]>
#               image-to-3D 01a21c08-6b2e-7257-b56a-50e81896ece9 (40)
#   rig         sh masters/v29.0/people/rigall.sh marcus:1.72      rig 01a21c0c-b706-7709-9104-fdaf57e51a6f, fingers asked (5): 70 joints
#   near body   sh masters/v29.0/people/bodies.sh marcus 40000     remesh 01a21c0f-1b28-779d-8707-d64a37294b2d (5), riglod on the rig
#   the knock   sh masters/v29.0/people/takes.sh marcus t2m mknock  laid 01a21c0f-22ec-7656-bb08-17fe06c5c070 (3; the clip of §2, not made again)
#   takes       sh masters/v29.0/people/retakes.sh marcus           (no credits: Jun's, Mr Koh's, Ravi's, the seated hermit's, his walk)
#   prep        BPY=<blender venv python> sh masters/v29.0/people/people.sh marcus   -> assets/p51marcus.glb, assets/p51marcush.glb
#               (the assets' hard links into dist/ and snapshots broken first: a copy renamed over the name)

# ---------------------------------------------------------------------------------------------------------------- 3 · THINGS (M4)
# (THINGS' section: masters/v29.0/props/RECORD.md)

# ---------------------------------------------------------------------------------------------------------------- 4 · SOUND (M8)
# (SOUND's section: masters/v29.0/sound/picks.json and its own make.sh)

# ---------------------------------------------------------------------------------------------------------------- 5 · VOICES (CP8.4)
# Every line of masters/v29.0/script/lines.json voiced, three takes a line, through ElevenLabs' own API (the key only at
# /root/.config/elevenlabs/key; every call in masters/v29.0/voices/spend.log: 249 takes, 14,982 characters asked; the
# account read 38,492 before and 30,555 after, 27 Nov 2026). Not one take failed; none was made twice.
#   THE VOICES   Master Zavier: Brian (bP8FJDHmWVEgXJDitdQd, jamesAdult, eleven_v3); Grandmaster Pho: Songkran
#                (xYmBpJREC3WfqEFpbPvO, pho, eleven_v3; no line says his name, so no "Puu" was needed); Grace: Adrina
#                (KdGcLjKviIhd1TJjgsuv); Marcus: Amir (PHS7Re4X5gu9oeMk7Pms): SOUND's measured picks (1130de8), until his ear.
#   THE PROMPTS  voices/prompts.py: the script's words exactly, ONE tag naming an emotion (its TAG table), no capital or
#                ellipsis added; gr51r2 and gr51r3 (the same "I should go.") said with two tags (restless, anxious) so the
#                two times do not sound the same. Each line's exact prompt is its row's `prompt` in lines.json (the
#                registry's text: what the take says as generated).
#   THE PICKS    voices/pick.py (chapter 5's rule, unchanged): a clean end first (an end on signal refused), then no odd
#                hole, then not rushed, then the tighter read (him, Grace, Marcus) or the unhurried one (Grandmaster
#                Pho); every take transcribed with word timings (faster-whisper small.en, here). Then every pick heard
#                AGAIN UNPROMPTED from its shipped file (voices/finish.py -> heard.json), and four picks moved to the take
#                whose words an unprompted ear hears right (pick.py CHOSEN): ph51r3 a ("pulled", not "pooed"), ph51k1 c
#                ("May I"), ph51x2 c ("bag", not "back"), ph51x5 c ("It's"). Every line's pick and why: voices/CHAIN.txt.
#                ph51A3 RE-SAID at the coordinator's word (Scribe heard "You call at once"): takes d to f asked "[warm] You
#                called... at once. ..." (prompts.py RESAY; 300 characters); Scribe hears "call" in all six (the pause
#                after it 0.44 to 0.56 s in d to f), so take a stays the pick, said in CHAIN.txt (his accent). ph51c4 and
#                ph51x1 heard right by Scribe ("altar", "felt"). Heard otherwise and KEPT (his accent against a small English model, every take the same): ph51c4
#                "altar" heard "order" in all three; ph51x1 "felt" heard "fail" in both clean takes (the third, cut on
#                its last word, "felt"); ph51A3 "called" heard "call" in all three; ph51r5 "Sit." heard "See it" from the
#                shipped file and "Sit" from its raw take. Number words (Case 4, Since 3, 40 minutes) are the
#                transcriber's way of writing them.
#   THE CHANTS   voices/chant.py: on eleven_v4 with v25.5's tag "[chanting slowly, deep and solemn]" (v3 SAYS a chant),
#                the Pali in plain letters as a Thai teacher chants it (prompts.py `plain`: the anusvara and the velar n
#                "ng", the long marks dropped), one verse a sentence. Measured: intoned, not sung (pitch spread 5.8 to
#                7.6 semitones against his spoken 9 to 10 and v25.5's chosen Om Namah Shivaya 5.3; no note held 1.2 s);
#                each verse one breath (the verse boundaries the take's longest silences weighed by where each verse
#                should end; every take's verses in proportion); an unprompted multilingual transcriber writes the Pali
#                back in Thai letters, verse by verse (ratana c: "...สัจเชน่าสวัสที่โหตุ", etena saccena suvatthi hotu).
#                Picks: ph51ratana c (44.36 s, 1.38 words a second), ph51jina a (36.62 s, 1.16). Their captions' times
#                (lines.json `times`, one [start, end] to each caption, seconds from the line's own start) read from the
#                SHIPPED files (chant.py --times), not the raw takes. Pitch: his chant 111 to 116 Hz, his speech 84 to 91.
#   THE CHAIN    voices/chain.py (the house's): him peak-matched -6.85 / -6.6 dBFS, high-passed at 70 Hz; the cast RMS
#                -16 under a -1.5 limiter; the two chants RMS -17 (a chant is on the effects path, not a voice take:
#                v24.0); assets/audio/<key>.mp3 (128 kbps 44.1 kHz) and assets/audio-opus/<key>.ogg (64 kbps 48 kHz),
#                each from its own source. THE PHONE'S COPIES (voices/phone.json, lines.json `phone`): the barrier's six
#                lines and its chant, and the four endings' calls (ph51A1 A2 B1 B2 B3 C1 C2 D1 D2): the levelled take
#                through 300 to 3400 Hz (two second-order passes each side) and 3:1 over -24 dB, levelled again, as
#                <key>tel (16 copies; under 250 Hz 1 to 4 % of its energy against 51 to 67 % in the clean take).
#   THE LENGTHS  lines.json `secs` from the shipped Opus file (the mp3 within 0.08 s); masters/v29.0/script/registry.py
#                --write then writes src/voicelines.js's rows. Master Zavier's 33 take names: voices/ADULT_TAKES.txt.
voices() {
  python3 -I masters/v29.0/voices/prompts.py
  python3 -I masters/v29.0/voices/pick.py --rescore
  python3 -I masters/v29.0/voices/chant.py
  python3 -I masters/v29.0/voices/chain.py
  python3 -I masters/v29.0/voices/chant.py --times
  python3 -I masters/v29.0/voices/finish.py --write
  python3 -I masters/v29.0/script/registry.py --write
}

case "${1:-words}" in
  words) words ;;
  voices) voices ;;
  *) echo "make.sh: words | voices"; exit 2 ;;
esac
