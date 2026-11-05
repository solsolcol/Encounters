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
5. ~~**Episode 4 chapter 2's build plan**~~ — WRITTEN at v24.40, docs/V25.0-E4C2-PLAN.md: waiting on his answers to
   its §2.3 (eight questions) before any build.
6. **Episode 3's statues and trays after a lost graphics context** (found at v24.30, outside its ask, left as it was).
   Every chapter of episode 3 gives its Buddha images, trays and a few pieces an envMap of their own — the scene's
   environment texture at the time they were built (`buddhaMat`, `trayMat`, e3c1–e3c5). When a phone drops the page's
   WebGL context and it comes back, main.js draws the room's environment again into a NEW texture (`roomEnvAgain`) and
   disposes the old, so those materials keep reflecting the dead one and their metal goes dark until the chapter is
   rebuilt. Rare (iOS under memory pressure), and nothing breaks. The fix is v24.30's: each such value as a lift on the
   scene's own environment (its absolute value over the scene's 0.05), the same frame to the pixel, proven per chapter.
7. **Episode 4 chapter 1's room: what the v24.39 reviewer found that was there before the jar** (v24.40 fixed only what
   the jar's change or the jar's shots owned: its contact shadow and the four see-through vessels). Each was in the room
   since v24.0–v24.31 and is outside his ask, so it is listed with the reason and left: the old woman in the doorway
   drawn as a coarse stipple (her fade's dither; it reads as static at desktop size); the two lagging wall shadows'
   stair-stepped edges and a pinhole at the neck (their low-resolution silhouette — they are scene B's subject); the
   smoke the player is told to tap is faint in play and its plume starts above the stick; the incense tip lands on his
   toes in the wide shots; a faint box beside the thermos; the altar's ribbons over the clock; the HUD covering the
   altar and the clock on a phone; the fan's cable and a wall pipe ending mid-wall; the shelf's posts ending in mid-air;
   the yellow block reading as a sponge; the tablet's text unreadable on a phone; the plate's faceted rim; the seat as a
   plain red block; the hands' smooth mitts. Fix any on his word (the photographs: the session's review2439).

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
   father, the passer-by); chapter 4's Chinatown towkay. To come for episode 4: Grandmaster Pho's voice (his model arrived
   3 Nov 2026 and is prepared, `pho`, v24.49: made upright at his word (v24.44), the drape on his left arm given a
   hanging-cloth rig at his word (v24.45, done), the notch at his right armpit eased (v24.46, done), his LOOK picked: D,
   his skin and necklaces unlit and the robe lit (4 Nov, "Option 2 and look D"; a material patch when chapter 3 casts
   him), REAL LEGS under a robe made cloth at his word (v24.47, his "Option 2", "Cloth simulation" and "Calmer
   running"), and every fault of that robe fixed at his word (v24.48, "Fix all of it"; masters/v24.48/PLAN.md,
   masters/v24.48/shots/pho-*.jpg: the floor sit's crossed legs covered, the sack, the tears and shards, the crumples
   inside a lifted hem and the chair sits' band gone; better than his saved file in 15 takes, about even in 2, worse in
   2 — the first Charged cast and talking with hands open, for small white bits at the hem), and those white bits fixed
   at his word (v24.49, "Yes, fix all of it"; masters/v24.49/PLAN.md: the first build better than his saved file in 366
   pictures, worse in 54; the shipped file against it better in 96, worse in 77). His choice waits on one thing: sitting
   cross-legged, his hands rest under the robe — raise them about 10 cm onto it, his saved file's robe for that take, or
   leave it; and, if he prefers cleaner talking over clean chair sits, the first build instead. Left and said: a sliver
   of thigh at the wrap's front edge in three takes (his knee behind the cloth, seen through a slit)), Lersi Chin's voice (his model arrived 3 Nov 2026 and is prepared,
   `lersichin`, v24.38), chapter 4's lady; the Ah Pek later
   in the casebook.
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
    - ~~l. (v24.28) Per-material reflection strengths do nothing: three r185 gives every material lit by the scene's
      environment the scene's own strength (0.05; 0.025 for the hands), so the torch's 30 (e2), the shop's bronze 10
      and the pickup's 14 (e4c1) are ignored — measured in the program's uniforms, and 100x changes no pixel. The game
      looks as it has; making them work changes how metal looks in every chapter, so it is his call.~~
      **DONE v24.29** (Chad: "Can you update the 3d library so that it does not ignore the metal shine"): three
      patched at build (tools/patchthree.mjs), every lift photographed and set from the pictures.
    - m. (v24.28) Pong's pickup as delivered costs a phone ~390–400k triangles wherever it is in view (the cut cost
      108k) and 160–220k standing beside it looking away (its joined parts span the whole truck, so sphere culling
      keeps them). If the yard is slow on his phone: roll back to v24.27 on Netlify, or a distance level that keeps
      the clear-coated paint whole and cuts the rest (~170k, +~2 MB, photographed before it ships).

11. **The beds' loop seams (found at v24.34, every chapter).** The engine loops a bed over [0.06, duration − 0.06] because
    mp3 decoding once padded both ends with silence; measured in today's Chromium, neither the game's mp3s nor its Opus
    files are padded, so every bed skips 120 ms of its own sound at each seam (a noise bed hides it; music would stutter —
    e4c1's two music beds are padded to fit, LEARNINGS v24.34). Changing the engine's insets would move every bed in every
    chapter, episode 1's included, so it waits on his word. Also his: the new music's decoded cost in episode 4
    chapter 1 — 52 MB from the start of play, 51 MB more from the decision (docs/HISTORY.md, v24.34).
## D. Not built yet

- Episode 4 chapters 2–5; Episode 5 (S1·16–S1·20); Episodes 6–10 (names still the v6.0 list).
- Deferred by choice: ghost mesh compression (the biggest download saving left), a service worker / offline,
  canvas-resolution and backdrop-blur thermal options.

## E. Housekeeping

- ~~**CLAUDE.md is ~663 KB (~165k tokens), loaded every session**; this session was summarised 26 times in three days.
  Moving the release history verbatim to its own file was left for Chad at v14.16 (it was ~84k then); recommended.~~
  **DONE 31 Oct (after v24.23)**, Chad: "Do what you recommend". The diary is docs/HISTORY.md word for word, its
  standing rules are CLAUDE.md's "Chad's standing rules", CLAUDE.md is ~115 KB (~29k tokens); the proof and the
  independent reader's list are masters/history-split/.
- The release zip (`masterz-encounters-vN.N.zip`, ~570 MB) is built every release and has not been handed to him
  since the site outgrew a phone's upload; Netlify keeps every published deploy for two-tap rollback.
- Tags stay local (`git push --tags` → 403); every release commit's message begins with its version.
