# Until Dawn — design research (for the v3 cinematic direction)

Commissioned by Chad, 29 Aug 2026: "figure out how to make our game like
that — more cinematic, deeper content per chapter." This file is the raw
research; `docs/V3-BLUEPRINT.md` is what we propose to do about it.

---

## 1. Overall structure: one night, ten episodes

Until Dawn is a ~9–10 hour interactive-drama horror game divided into ten
named chapters, all set during a single night on Blackwood Mountain, one
year after the disappearance of twin sisters Hannah and Beth (shown in a
playable prologue). The structure is deliberately televisual:

- **Episodic framing.** Each chapter opens with a "Previously on Until
  Dawn" recap montage — cut from *your* playthrough's events, so the recap
  itself reflects your choices — and chapters end on engineered
  cliffhangers, "baked-in stopping points" like episodic TV. Reviewers
  consistently noted the game feels like binge-watching a slasher season.
- **The Dr. Hill interstitials.** Between chapters, the game cuts to
  therapy sessions with psychiatrist Dr. Alan Hill (Peter Stormare), who
  looks straight into the camera and addresses the player in second
  person. These sessions do triple duty: (a) a diegetic
  settings/personalization quiz — Hill asks what scares you and the game
  quietly injects your answers into later scares and set dressing; (b) a
  tone regulator — a breather beat between action chapters; (c) a
  slow-burn mystery — the office visibly decays session by session, later
  revealed as a projection of Josh's deteriorating mind. This device
  became a Supermassive signature.
- **Character rotation.** Control rotates across eight playable
  protagonists, switching several times per chapter. The rotation creates
  dramatic irony (you know things the current character doesn't), spreads
  attachment across the cast, and means a death removes a viewpoint but
  never ends the game.

## 2. The Butterfly Effect

The choice system's distinguishing trait is not the breadth of branching
but **how aggressively the game advertises causality**:

- **Presentation.** Choices are mostly timed binary/ternary picks
  presented mid-scene (plus dialogue picks and do/don't action choices).
  Timers force gut decisions; letting a timer run out is itself sometimes
  a choice.
- **Surfacing consequences.** When a tracked decision is made, a
  butterfly icon flashes on screen ("Butterfly Effect update"), and the
  decision is logged in a menu: **22 Butterfly Effect "chains,"** each a
  short cause→effect sequence of nodes that fill in as consequences land,
  sometimes chapters later. The notification makes players *believe* in
  consequence even before any consequence occurs; the chains let them
  audit causality after the fact. Design writing cites this as the model
  for communicating branching cheaply.
- **Delayed payoffs.** Small acts with distant, lethal payoffs: whether
  Chris shoots a squirrel in Chapter 1 leaves Sam's face scratched hours
  later; whether Mike spares a wounded wolf determines if the wolf later
  saves him; failing to find a flare gun closes a rescue option chapters
  later. Chains only exist if their preconditions occurred — a dead
  character's chains never fire.
- **The catch (disputed).** Post-release analyses ("Until Dawn and the
  Illusion of Choice") showed many branches reconverge fast: characters
  can only die at specific windows, several dilemmas are mechanically
  identical either way, and a second playthrough reveals a strong shared
  spine. Choices are real at ~22 junctures, heavily theatrical elsewhere.

## 3. Death, permanence, and "no game over"

- **Anyone can die; nobody must.** All eight can survive; all eight can
  die. Every death is permanent: the story continues around it, other
  characters react, later scenes restage or vanish, and the recaps and
  finale epilogue reflect the losses.
- **No fail state, no retry.** No game-over screen, no manual save; a
  strict single-slot autosave commits every decision and QTE result
  instantly. Because a fumbled press can permanently kill a character
  you've shaped for six hours, every QTE carries real stakes.
- **Deaths as branch pruning.** Deaths are how the branching stayed
  affordable: a dead character's future content is *removed*, not
  replaced. "Hundreds of endings" is combinatorial marketing — the ending
  is one finale scene parameterized by who's alive plus flags.

## 4. Totems

Thirty collectible totems in five color-coded types: **Death** (a vision
of a possible character death), **Danger** (an imminent threat), **Loss**
(a bad outcome tied to a choice/failure), **Guidance** (a hint toward the
ideal choice), **Fortune** (a good future event). Picking one up plays a
1–2 second premonition clip — a snippet of a future cinematic, sometimes
from a branch you'll never see. They work triple-duty: collectible,
foreshadowing/dread (you spend the next hour bracing for the glimpsed
moment), and a fair-warning system that makes deaths feel earned rather
than arbitrary — a Death totem shown and ignored is on you.

## 5. Clues and the mystery structure

**79 clues in three "cluelines,"** each unraveling one mystery on a
separate schedule: The Twins (20), 1952 (27), The Mystery Man (30). Clues
are physical objects examined in-world, collected into a journal where
partial evidence assembles the picture. Effects are mostly interpretive,
but some clues change dialogue, and a handful are functional (the twins'
final evidence gates one survival option in the finale). Staggering three
mysteries means exploration always pays something, and the player's
understanding stays ahead of at least some characters — more dramatic
irony.

## 6. Character traits and relationships

Six trait meters (Honest, Charitable, Funny, Brave, Romantic, Curious)
plus pairwise relationship values, shown as gauges that visibly tick
after choices. Consensus: **traits are almost entirely cosmetic** — a
mirror showing you who you've made these people; relationships
occasionally matter. Their real function is psychological
instrumentation — making the player feel their roleplay is recorded —
not simulation. It works anyway.

## 7. QTEs, "Don't Move," and shooting

- **QTEs** carry every action scene. Difficulty is modest; the horror is
  that failure is never a retry — it's canon. A missed prompt might mean
  a scratch, a lost path, a lost item, or a death, and the story absorbs
  it.
- **"Don't Move."** The controller's gyroscope must be held perfectly
  still while a threat passes — your own trembling hands are the fail
  condition, a direct somatic transfer of the character's held breath.
  Widely praised in 2015; the 2024 remake's oversensitive version was a
  known frustration — tune it generously.
- **Shooting** appears as brief aim-and-fire windows, including at least
  one famous case where the correct play is not to shoot.

## 8. Cinematic technique

- **Cameras.** Fixed and rail-tracked third-person cameras with
  in-gameplay cuts, explicitly modeled on early Resident Evil and
  horror-film grammar. Cameras hide and reveal deliberately (threats
  framed behind oblivious characters). The 2024 remake's switch to
  over-the-shoulder was controversial precisely because it diluted the
  authored framing.
- **Performance.** Full performance capture of a recognizable cast; the
  fidelity let them cut campy expository dialogue and let faces carry
  subtext.
- **Sound.** Jason Graves' score: ~15 hours recorded, of which only ~30
  minutes is conventional melody — the rest is atmospheric texture
  (Penderecki, Carpenter), edited film-style into stingers and beds.
  Sound design leans on silence-before-spike dynamics.
- **Scare philosophy.** Supermassive ran galvanic-skin-response
  playtesting to tune scare pacing. Jump scares are front-loaded as cheap
  fake-outs early and become "real" once the true threat emerges.
  Characters begin as walking slasher stereotypes on purpose — false
  security — and player choices "reveal the characters hiding
  underneath."

## 9. Pacing and the midpoint pivot

Chapters run ~45–75 minutes and alternate registers: slow exploratory
dread → dialogue scenes → an action spike → Hill interstitial as
decompression. The macro-structure is a genre bait-and-switch: the first
half plays as a psycho-slasher; around Chapter 6–7 the Psycho is revealed
as a theatrical fake at almost exactly the moment the real supernatural
threat takes over. Two threats layered in sequence keep the tension curve
rising for ten chapters; three cluelines stagger revelations so something
is always partially unexplained.

## 10. Development history and lessons

- Started as a **first-person** PS3 PlayStation Move game. Rebooted for
  PS4 as third-person cinematic; the perspective change forced a rewrite
  of all dialogue — the lesson the developers drew: **perspective is
  tone**. First person read as a fairground ride; third person enabled
  dramatic irony, ensemble identification, and authored composition.
- Branching kept affordable via: a shared narrative spine with bounded
  divergence (22 chains); deaths that prune content; consequences as
  parameterized variation (who's in the scene, one line changed, one exit
  gated) rather than parallel scenes; loud UI signaling so modest
  branching *feels* vast.
- A sleeper hit, significantly amplified by YouTube/streaming — branching
  + permadeath is ideal spectator material.

## 11. Reception

**Praised:** fear of permanent loss making trivial inputs terrifying;
visible consequence feedback creating a sense of authorship;
likable-then-killable characters; dramatic irony; the playable-slasher
fantasy executed sincerely; replay pull. **Criticized:** illusion of
choice on replay; slow movement; cosmetic trait stats; QTE/motion
frustration; the remake's loss of fixed-camera framing.

---

## Distilled design principles (ranked by load-bearing weight)

1. **Permanent, autosaved consequence.** No retry: every input is canon.
   This one rule converts trivial mechanics into dread.
2. **Story continues around failure.** Failure produces different story,
   not a game-over, so players stay in the fiction.
3. **Advertise causality loudly.** The butterfly icon and chain log make
   players believe in stakes at the moment of choice; the *feeling* of
   consequence does more work than the branching itself.
4. **Deaths prune, they don't branch.** Bad outcomes remove content; good
   outcomes rejoin a shared spine with parameterized variation.
5. **Timed choices under pressure** force gut morality and ownership.
6. **Foreshadow your punishments (totems)** — premonitions turn deaths
   from arbitrary to fair-warned and reward exploration with dread.
7. **Delayed payoffs across chapters** teach that everything might
   matter, retroactively charging every small choice.
8. **Episodic TV grammar** — cliffhangers and personalized recaps.
9. **A direct-address interlocutor between chapters** — pacing regulator,
   diegetic personalization, complicity.
10. **Ensemble rotation for dramatic irony.**
11. **Start with stereotypes, let choices deepen them.**
12. **Authored cameras over free ones** — horror is a framing art.
13. **Staggered parallel mysteries** + a midpoint genre pivot.
14. **Embody the character's fear physically** ("Don't Move") — cheapest,
    strongest immersion trick; tune generously.
15. **Stats as mirror, not simulation** — reflection is engagement even
    when it drives nothing.

Flagged as disputed: "hundreds of endings" is combinatorial, not
authored; the ~10,000-page script figure is hard to corroborate; trait
impact leans cosmetic with relationships mattering somewhat.

Sources: Wikipedia (Until Dawn); Until Dawn Wiki (Butterfly Effect,
Totems, Clues, Traits and Relationships, Dr. Hill); Rely on Horror
interview with Graham Reznick; VGC and Vice on the first-person PS3
prototype; Destructoid and GamesBeat (Will Byles); Kotaku "Until Dawn and
the Illusion of Choice"; GameSkinny; First Person Scholar; Gamecritics
"The Definitive Article"; Spectre Collie on episodic structure; Starburst
interview with Jason Graves; Game Developer on budget branching;
ResearchGate on Until Dawn's rhetoric; ComingSoon on The Quarry script
size.
