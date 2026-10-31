# What is still open — 31 Oct 2026 (after v24.23)

Chad, 31 Oct: *"What else is not done yet"* and *"Look at all my messages to you too"*.

Checked against: his 32 messages in this session's log (28–31 Oct; every ask in them is done, v24.1–v24.23), the
records of everything before (CLAUDE.md, the plan docs, docs/E3-MODELS.md, docs/E4-MODELS.md,
docs/AUDIT-2026-09.md, docs/V14.16-THE-AUDIT.md §4, docs/V24.0-EPISODE4-PLAN.md §5, docs/V24.0-E4C1-PLAN.md §2.3) and
the code as it stands at v24.23. Cross an item off here the day it is done, with the version.

## A. Can be done now, on his word

1. **The Google Sheet is stale.** The link he has is v44; the game's text is v133 (`masters/v24.17/`). The Drive
   connector's base64 route is far past its wall (the v133 workbook is 118 KB; the wall is ~20 K characters of
   base64), so the v7.9 "split export" no longer fits either. The Google Sheets connector (update_values and friends)
   can write the cells directly: publish v133 that way, then diff every cell (`tools/verifytabs.py`).
2. **The three Sak Yant icons** (`yantgaoyord`, `yanthahtaew`, `yantsroi` in `ITEM_DEFS`) are the last line-drawn
   icons a player can get (the rifle is given by no chapter). Paint them in his torch-icon style (v24.20's recipe).
3. **The last code-built vehicles:** episode 3 chapter 3's city buses (`makeCityBus` — the one he rides in the film,
   the lorong's passes, ending C's night bus) and the Hat Yai coach (`makeTourCoach`). Make real ones his way
   (a reference on white, checked, Meshy). (Episode 2 chapter 1's ferry is a code-built set too.)
4. **Music and voices picked by measurement, never by his ear:** episode 4 chapter 1's seven music cues
   (`masters/v24.0/previews/`) and its seven new voices; episode 3 chapter 4's opening score (take 3 of 4,
   `masters/v22.0/previews/film-music-1..4.mp3`) and closing music (c, against a); episode 3 chapter 5's music
   (`masters/v23.0/previews/`, and v24.3's twelve cues). Send the reels again.
5. **Episode 4 chapter 2's build plan** (S1·11's second half: the fog, Lersi Chin's clearing, the trial's 5.2–5.3),
   written for his approval before any build.

## B. Episode 1 (the reference game) — only with his OK

6. Three bugs from docs/AUDIT-2026-09.md Part Two, still in the code:
   - #1 chapter 3: the scripted head tilts of the medium in the intro, `scWatch` and `scJoin` write the hidden
     primitive head (`stage.medium.userData.head.rotation`), never the model's head bone (`medHead` only takes the
     ambient sway, under the `cine` return) — so "head tilted the way no one tilts a head" never shows.
   - #2 chapter 4: `scProvoke` ducks the fan's sound and never sets `stage.fanSpeed`, so the blades spin through
     "everything stops at once" (chapter 5's identical beat does it right).
   - #4 chapter 4: `polterUpdate` returns before a light dip in progress, so a decision opened mid-dip leaves the
     ceiling light dim, and the scene's `snap()` keeps it dim.
   - (#3, the volume slider skipping a scene, was fixed at v6.6.)
7. "Step back" in chapters 2–5 still says "Tap the glowing pile of notes to look again" (`world.actLineTouch` /
   `actLineKey`; none of the four declares its own words).
8. Chapter 1's four choices are still the placeholders (pick it up / kick it / look around / recite a chant); the
   trial's real THE OFFERINGS set (pick up / examine / leave / ask an adult) is in docs/source/trial-game-chapters.md.
   Two of its scenes would be new (examine, ask an adult).

## C. Waiting on Chad

9. **Models.** NEEDED (docs/E4-MODELS.md): the taxi uncle. Episode 3 still on stand-ins (docs/E3-MODELS.md): chapter
   3's shop staff man and the customers (the kneeling girl and man, the auntie, the youth, the shrine's wife and
   father, the passer-by); chapter 4's Chinatown towkay. To come for episode 4: Lersi Chin and Grandmaster Pho (with
   their voices), chapter 4's lady; the Ah Pek later in the casebook.
10. **Episode 4's next chapters** (docs/V24.0-EPISODE4-PLAN.md §5): how Pho and Lersi Chin speak (Thai captioned in
    English recommended, or simple English); the five proposed chapter titles; chapter 4's lady (model, language,
    place); Pali only if he names one.
11. **Episode 4 chapter 1's defaults** (docs/V24.0-E4C1-PLAN.md §2.3): the trimmed lesson line (Q7) or the case
    file's three sentences; the master's Thai lines unchecked by Master Zavier (Q4); the bag's figure stays the adult
    `zav` unless he has a shop-owner figure (Q8).
12. **Older questions put to him and never answered:**
    - a. Episode 3 chapter 2 (v18.5): the core lesson leaves out the case file's own "went and sought to understand it
      properly"; ending A's card ("I forced it down. It did not go away.") against its scene ("I could feel it
      waiting").
    - b. Episode 3 chapter 5's memory at the decision (renderer ~1.9 GB, v24.3): keep, or free the finished scenes'
      sounds.
    - c. Episode 3's film M (e3c5) and chapter 4's merit film still show the HDB estate behind the temple (v24.8 changed
      only ending D's garden).
    - d. The engine's menu dings inside rituals (v24.3 L3-14, every chapter).
    - e. Voiced, captioned chants for the wordless ones (episode 1 chapter 1 ending D; e3c1's morning chant; e3c2's
      evening chant) (v21.31).
    - f. Phone layout and feel (v11.7, v19.2, v21.23): the bag and menu buttons over the outcome cards; the "Sealed"
      stamp under the bag button; "Case file complete" after chapter 2 of 5; the card creeping up as its teaching
      types; the reduce-motion rule flickering; a way back into a finished gallery.
    - g. His episode 1 Phiboon item text ("born during the reign of King Rama 4", "Second Batch") against the sources
      (v21.10).
    - h. The LP Tim and the Phiboon share the neck slot, so they never stack (v14.13).
    - i. The game starts muted on desktop (AUDIT-2026-09 Part Four).
    - j. docs/V14.16-THE-AUDIT.md §4: pausing sound when an Android phone is put away; a lower frame rate behind the
      equipment screen; sharing chapter 3's two Phiboon parses; rebuilding an episode-2 chapter on a selector replay;
      an engine-owned clock for new chapters.
    - k. Kept and put to him at v21.16: the range's Figure 11 boards and e3c2's painted shadow on the mats.

## D. Not built yet

- Episode 4 chapters 2–5; Episode 5 (S1·16–S1·20); Episodes 6–10 (names still the v6.0 list).
- Deferred by choice: ghost mesh compression (the biggest download saving left), a service worker / offline,
  canvas-resolution and backdrop-blur thermal options.

## E. Housekeeping

- **CLAUDE.md is ~663 KB (~165k tokens), loaded every session**; this session was summarised 26 times in three days.
  Moving the release history verbatim to its own file was left for Chad at v14.16 (it was ~84k then); recommended.
- The release zip (`masterz-encounters-vN.N.zip`, ~570 MB) is built every release and has not been handed to him
  since the site outgrew a phone's upload; Netlify keeps every published deploy for two-tap rollback.
- Tags stay local (`git push --tags` → 403); every release commit's message begins with its version.
