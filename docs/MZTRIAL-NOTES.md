# mztrial.netlify.app — the NEW 2D trial, studied (8 Sep 2026)

Chad: "take a deep look at another version of the game, this has a lot
more new features." This is what it is, read from the live site
(`index.html`, `assets/js/app-01.js` 1.3 MB, `assets/css/app.css`), with
the numbers the code actually uses. It supersedes the trial described in
`SOURCE-NOTES.md` (the 17 MB single-file `gametrial.html`, three episodes).

## Shape

- **Nine episodes**, five chapters each, four choices per chapter, in a
  fixed order (a "full journey"); individual episode replay unlocks only
  after Episodes 1–9 are completed in one run. The nine, by their
  chapter-5 titles and cover names:
  1 The Hell Note I Should Never Have Taken · 2 The 3 AM Shower · 3 The
  Room That Didn't Want Us There · 4 The Love Spell · 5 Not Every Master
  Should Be Trusted · 6 The Ghost Clinging To Her Back · 7 Spiritual
  Disturbance After A Crematorium Visit · 8 The Toilet Possession: When
  Belief Isn't Enough · 9 The Corner The Dog Wouldn't Go Near.
  (Our engine holds TEN with Chad's tenth, The Mirror That Wouldn't Stop
  Banging — `strings.js` `ep10.title`. His call which count is canon.)
- **Episode 2's data is UNCHANGED** from the old trial: same five chapter
  titles, same twenty choices, same deltas (verified value by value).
  It is still set in a HOUSE (bedroom → hallway → bathroom), while the
  site's case file says a platoon bunk.
- **Cutscenes are AI VIDEO**: a 20 s opening per episode
  (`asset_ep2_cutscene.mp4`, 28 MB) and a 10 s consequence video per
  choice (`asset_ep2_ch3_d_consequence_cutscene.mp4` …), fingerprinted
  under `assets/media/episode-02/video/`, with SKIP CUTSCENE. Episode 2's
  entity in those videos is a long-haired WOMAN behind the frosted shower
  glass (seen in the "must be supernatural" and "definitely a ghost"
  consequences; hand-prints on the glass), while the site's own film
  shows a pale SOLDIER. Two visualisations of the same file.
- A title with a fog video, START / CONTINUE / AMULET INVENTORY, a GAME
  RULES modal ("CASE PROTOCOL"), an episode-replay selector, a horror
  flash, page-flip and rank-stamp sounds, a sanity HEARTBEAT loop whose
  rate and volume follow the sanity value (rate 0.82 at 80+ → 1.60 under
  20), thunder on a bad choice, phone haptics.

## The rules, from the rules modal and the code

- **30-second decision timer** with WISDOM penalties by decision time:
  0–15 s none, 16–20 s −1, 21–25 s −2, 26–29 s −3, timeout −5 (and the
  timeout picks for you). Decision times are recorded per episode.
- **Stats**: Sanity, Awareness, Wisdom, shown as 0–100 % PERFORMANCE
  scores — each is NORMALISED against the episode's own reachable range
  (`mzStatRange`: the sum of the worst and best deltas per chapter, plus
  the interaction ranges), so 100 % means "the best this episode allows".
  Wisdom is `mastery` (wisdom / max wisdom, as before).
- **Overall Mastery = 40 % Wisdom + 35 % Awareness + 25 % Sanity**
  (`mzOverallPerformance`). Ranks D <40 · C <55 · B <70 · A <80 · A+ <90
  · S <97 · S+. Elite ranks need balance: A+ needs all three ≥ 70; S needs
  W ≥ 88, A ≥ 82, S ≥ 78; S+ needs W ≥ 95, A ≥ 90, S ≥ 85.
- **Wisdom safeguard**: Wisdom < 65 % caps the rank at C; < 45 % caps at D.
- **Critical mistakes**: any choice whose wisdom delta is ≤ −5 (trial
  scale) counts as one ("unnecessary provocation/interference, knowingly
  ignoring experienced guidance, serious boundary violations"). 2+ caps
  the rank at B; the rules text says S+ needs 0, S at most 1, A+ at most
  2, A at most 3.
- **Pass** = rank B (55 %). The campaign record keeps per-episode results;
  a FULL-GAME ATTEMPT is counted only when all nine are done in one run,
  with best rank and attempt number kept.

## The five INTERACTIVE CHALLENGES ("Don't just choose. React.")

Some chapters run a reaction minigame before the choice (`MZ_INTERACTION_
PLAN`). **They affect Sanity or Awareness only — "Wisdom comes from your
decisions, not interaction skill."** Range per interaction −4..+3 (trial
scale); a 5 s → 1 s countdown before each; difficulty tiers by episode:
LEARNING (ep 1–2: speed 1.35, zone 0.82) · PRACTICE (3–4) · HARD (5–6) ·
VERY HARD (7–8) · EXTREME (9: speed 2.5, zone 0.30), and from episode 5
every non-heartbeat challenge is sped up and tightened again.

| kind | stat | what the player does |
|---|---|---|
| **heartbeat** — "HEARTBEAT · FEAR CONTROL" | Sanity | tap when the contracting pulse aligns with the inner ring; five beats |
| **spot** — "SPIRITUAL FOCUS POINT" | Awareness | tap the glowing spot inside the circle before it fades; five targets |
| **seal** — "THAI SEAL ALIGNMENT" | Awareness | a seal sweeps clockwise; tap STOP when it aligns with the target marker |
| **divine** — "DIVINE EYE" | Awareness | press and hold to expand the inner ring; release when it matches the outer ring |
| **balance** — "HOLD TO STABILISE" | Awareness | hold to move a cursor right, release to drift left; keep it in the safe box for 5 s, nearest the centre line scores most |

The plan per episode: ep1 {2 heartbeat, 3 spot}; **ep2 {1 heartbeat, 3
spot}**; ep3 {2 seal, 3 spot}; ep4 {2 spot, 4 heartbeat, 5 balance}; ep5
{1 spot, 4 seal}; ep6 {1 divine, 3 divine, 4 balance}; ep7 {1 heartbeat,
2 seal, 4 balance}; ep8 {1 heartbeat, 3 seal, 4 balance}; ep9 {1 seal, 2
divine, 4 balance}.

## The AMULETS (an inventory, unlocked by performance)

Three real Thai amulets, each with a photo and a video, an unlock rule and
a use budget, worn one at a time; protection is "part of your final
performance" (post-amulet scores count toward ranks):

| amulet | role | effect | limits |
|---|---|---|---|
| **LP Phiboon's Alms Bowl Rian, Wat Phra Thaen Ban Daeng** | Protection · Ghost Defence | A rank · SANITY ONLY: protects negative sanity from wrong choices and sanity minigames; never Awareness or Wisdom | 3 uses per campaign |
| **Somdej Wat Rakang (King of Amulets)** | Wisdom · Spiritual Authority | protects judgement from decision-TIME penalties | unlock: episode 6+, Wisdom ≥ 85 %, 0 critical mistakes; equip needs A+ campaign rank; 3 uses |
| **LP Tim Isarriko's Khun Paen, Wat Lahan Rai** | Luck · Fortune | can improve a poor interaction result through luck (18 % chance); each success consumes a use | 3 uses per campaign |

Awarded at the end of an episode by rank (with a "lucky drop"); a broken-
protection overlay when a use is spent; equip/unequip sounds; loadout
changes only allowed at certain screens.

## What of this belongs in the 3D game

- **Reaction challenges → our event system**, done in the WORLD rather
  than as 2D overlays: the heartbeat on our existing sanity ECG, the
  focus point as a torch-hunt, hold-to-stabilise as holding a rifle or a
  torch steady. Their rule is adopted as written: interactions move
  Sanity and Awareness, never Wisdom.
- **Critical mistakes and the rank caps** are cheap, engine-wide, and
  make the rank mean more; the 40/35/25 weights against our 40/30/30.
  A base-game change — Chad's call, separately from episode 2.
- **The decision timer** Chad once removed from the 3D game is back in
  the trial with penalties. His call again; the plan proposes ONE timed
  decision, diegetic, in episode 2's last chapter.
- **The amulets** map onto the equipment screen's Amulet box exactly,
  and belong in their own release after episode 2.
- **AI-video cutscenes** are the trial's medium; ours stay in-engine (the
  base game's standard), with the trial's videos as tone references.
- **Nine episodes or ten** — a strings-level question for Chad.
