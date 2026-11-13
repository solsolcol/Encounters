# Master Z's Encounters — The Game

A 3D first-person horror-education game based on Master Z's Spiritual
Encounters (encounters.triplegem.asia, Triple Gem Affiliation Consultancy,
Singapore). Multi-chapter; each chapter is one small dense location, one
supernatural encounter, one decision with consequences and a Buddhist
teaching. Eighteen chapters are live: three complete episodes of five and
the first three chapters of the fourth. Episode 1, all at one block: The Hell Note
(a void deck, a burner, a note, her), The Presence (a bedroom, a fan, the
gap beside the bed), The Gathering (a seventh-month tentage in the car
park at ten in the morning, and one chair facing the wrong way), Back
Home (the evening after, the flat misbehaving on a poltergeist clock)
and The Lesson (the tang-ki's morning visit, the note found, taught
over, and returned to the fire). Episode 2, *The 3 AM Shower & The Ghost
Cyclist*, is his National Service; episode 3, *How It All Began*, his search
for luck (two Thai temples, a Sak Yant, a medium, amulet shops and three
kumanthong); episode 4, *The Teacher In White*, the masters he meets and the
teacher he finds. The release history is docs/HISTORY.md. This
file is the contract for how work on this repo happens — read it before
changing anything.

## Who you are working with

Chad (chadsor@gmail.com) has **zero game-dev experience** and often works
from his **phone**. Consequences:

- Explain in plain language. No jargon walls. Paths only in code blocks.
- **Be extremely concise** (Chad, 11 Nov 2026, of a plan: *"i dont want to read an entire wall of text. Be extremely
  concise and to the point."*). A plan or a report to him is the thing on one phone screen: numbered steps, a few
  words each, then what is needed from him. The detail lives in the plan doc, not in the message.
- **Never push him toward git commands or terminal steps.** Rollback for
  him means the Netlify Deploys page (open an older deploy, Publish
  deploy) or the `.bundle` backups he keeps. The claude.ai preview
  artifact was a third route; retired 30 Aug 2026 (below).
- He values care over speed: **"be extremely careful, don't break anything,
  don't lose anything"** is a standing instruction. Two past incidents of
  accidentally deleted code made this a hard rule (see LEARNINGS).
- For anything expensive or destructive: **tell him the options first,
  let him pick.** He decides scope; you decide implementation.
- He dislikes over-testing small changes (see Testing) and once asked
  "why so many commands for a simple change" — keep runs proportionate.
- Deliver the Netlify zip at every good version, and a fresh backup bundle when a chapter ships (rule 3: the
  bundle has been milestone-only since v4.81).
- **ASK HIM FOR THE MODELS** (Chad, 27 Oct 2026: *"You can use placeholder models or generate your own until i give
  you the real models. You just need to remember to ask me for the models so i don't forget or miss it."*). While a
  chapter stands on placeholders, EVERY report ends with the models still NEEDED in **docs/E4-MODELS.md** (the list,
  each role's look and takes, and what stands in). A placeholder is one of the game's own characters wearing the role,
  never a block figure. Since 11 Nov 2026 a character a chapter needs is MADE here end to end, his way (Chad's
  standing rules, v26.0), so the ask is only for a model he has said he will send himself. A plant or a vehicle is a
  real model — his, or made his way (a checked reference picture, then Meshy) — and one built in code is drawn only if
  its model never lands (v24.20: "replace all of them with real truck models").

## The rules that never bend

1. **Never delete code by line-range.** Targeted edits on unique strings
   only. Before every commit, read the FULL diff and account for every
   removed line.
2. **Test proportionately.** Run only the harnesses a change can plausibly
   break; the full suite only before a substantial release. `node
   runtests.mjs <names>` runs picked harnesses two at a time.
3. **Version every good build**: commit with a real message, tag `vN.N`,
   push the branch, hand Chad the dist zip. **THE DEPLOY COMES FIRST**
   (Chad, v6.6, after a Drive upload held a finished build for hours:
   "the most important thing is making sure the build is live on netlify").
   Order of a release: build → DEPLOY and byte-verify → harnesses →
   commit/push → then the sheet, the docs' sheet link, any Drive tidy-up.
   **DEPLOY BEFORE THE TESTS** (Chad, v16.6: "always deploy first before
   starting tests, this way i can test it as soon as possible even before
   your tests are complete"): the build he can play goes live the moment it
   is built and photographed, and the harnesses run while he plays it. A
   harness that then fails is fixed and redeployed — Netlify's two-tap
   rollback is the safety net, not the wait. **Probes and reviews ARE tests**
   (Chad, v21.25: "When you know these tests will take very long to run,
   deploy first, then fix later ... be smart about your time"): the moment a
   build has booted the chapter it changes, it goes live — before the
   real-input probes, the reviewers and the full harness, never after them.
   Nothing that talks to Google Drive may stand between a green build and
   Netlify; if the sheet upload fails, the build still ships and the sheet
   is retried afterwards.
   **The backup bundle is MILESTONE-ONLY since v4.81** (Chad's call — "i
   feel it is unnecesary", and he was right): refresh
   `Encounters-backup.bundle` (`git bundle create
   Encounters-backup.bundle --all`, split at 20 MB for the upload limit)
   when a CHAPTER ships, or whenever he asks — not every release. Why the
   old rule is retired: GitHub now holds the branch and its whole history,
   Netlify holds every published build with two-tap rollback, so the
   bundle was a third copy of what two durable places already had. What it
   still uniquely buys is an OFFLINE copy in his own hands, dependent on
   no account — worth having occasionally, not every time.
   The one real gap it papered over: **tags cannot be pushed from these
   sessions** (`git push --tags` → 403; the GitHub grant covers branch
   refs, not tag refs), so `vN.N` labels live only locally and in the
   bundle. That costs nothing, because every release commit's message
   BEGINS with its version — a version is findable on GitHub by message
   whether or not a tag survived. Keep writing them that way.
4. **Both builds must stay green.** One source produces the hosted site
   AND the single-file build; a change that breaks either is not done.
   The single-file build is no longer published or (since v3.4) what the
   suite drives, but it stays, and that was reconsidered and confirmed at
   v3.5: it costs ~5 s of build time, it is the anywhere/offline
   fallback, and it is the ONLY surface csptest can test the strict
   no-blob/no-data CSP on — the policy that shaped the hand-parsed GLB
   and audio loaders. Deleting a working fallback to save five seconds is
   the wrong trade (docs/V3.5-PLAN.md).
5. The generated files (`hellnote.html`, `wrapped.html`, `bundle.js`,
   `dist/`) are never edited by hand.

## Chad's standing rules

Every standing rule written only inside the release history, lifted out on 31 Oct 2026 (after v24.23) so it is read every session. The
history (docs/HISTORY.md) has the story behind each one: search it for the version in brackets. Already written in
their own sections of this file, and not repeated here: how to talk to him, ask him for the models, options first,
proportionate testing (**Who you are working with**); never delete by line range, the release order and deploy first,
both builds green, never hand-edit generated files (**The rules that never bend**); a chapter declares it and chapter
1's value is the default, every minigame shows how it is played, no block figures, no practice or practitioner is ever
the villain, an outcome scene is a whole story, a generated model begins as a checked picture and a sacred one as real
photographs, the equipment figure is keyed to the episode (**Architecture**); adding a chapter adds no harness, poll
and never time (**Testing**); deploy from inside dist/, never touch his resume site (**Live targets**); the audio spec,
re-run a failed eleven_v3 line unchanged, a master's title spoken in full, sound only through `sfx` and its table
(**Audio pipeline**); one sheet for every word, always hand him the link, every sheet carries the voice lines
(**Changing the words**); read the source material first, the lesson line, the term comes from Chad (**Content ground
truth**); base-game feel is its own decision (**Current state**). A NEW standing rule from him goes in the list below
that fits it, with the version it came from.

### Chad's own (each rests on his words; the version is where to read them in docs/HISTORY.md)

- Every mechanic, minigame, prop and item must serve the spiritual story and earn its place: no military-sim detours, no filler that nothing later reads, nothing kept that serves no purpose. (v9.5)
- The game is spiritual education, never cheap horror or jump scares; greed and desire are never shown as a right reason, and his stated purpose for a chapter governs every beat of it. (v23.0)
- Episode 4 chapter 1's black ajahn "is supposed to be evil": he chants no Buddhist chant ("should be chanting something else"), and his chants cannot be made out at all. Chad's word for this one character, the stated exception to the rule that no practitioner is the villain (Architecture, v21.30). (v24.25)
- Anumodana is said only by a monk ("that can only be said by a monk"); a lay master or anyone else says thank you. (v24.25)
- Change only what he asked and keep everything else exactly as it was; if an addition does not fit a shot, say so and ask instead of re-staging it; never remove built flow unless told. (v14.10)
- Use his models as he delivered them: never alter his files or their paint (a ruling such as 'no green' is applied at runtime), and leave a scan's own flaws as delivered. (v12.4)
- Use the models he has already supplied, and use them to the fullest (their interiors, their own looks), before building anything in code; check the models docs for what he already sent. (v24.18)
- Every amulet, sacred image and hero model he gives keeps its full detail (every triangle, every map) wherever it is seen close; a lighter level is only for distance. (v14.14)
- Optimise only in ways that cost no visual quality or fidelity at all. (v15.0)
- Never compress anything to make room on the working machine ("I dont want to compress anything"): room is made by clearing
  copies and leftovers (old build snapshots, release zips, a bundle's sent pieces, intermediates a recipe remakes), with
  his yes, never by compressing a file. (v24.54)
- Adopt an objectively better solution only when very sure of it, and prove that new work has not silently broken or undone earlier fixes. (v14.16)
- An important person is never drawn up close from a lighter body ("30k triangles up close should never have been
  allowed"): the people the story turns on (Ton, the woman at the bench, the seated masters, the woman lighting the
  candles, Grandmaster Pho) switch to their full model within 2.2 m; the crowd, the dancers, the children and the
  monks of the row keep their lighter bodies, because a full body costs about 50 MB of a phone's graphics memory ("Only
  the important people like ton, candle lighter female, seated masters, pho, and those that already are built this way
  can retain."). A person is photographed from as close as the player can walk, with the body drawn there read. (v26.5)
- Loading must be smart: no stutter and no late pop-in; nothing heavy happens while the world is on screen. (v14.15)
- The loading word is on screen whenever the player waits (the one exception: the title card straight after an opening film says no 'Loading'). (v15.3)
- Work in checkpoints and milestones with the plan, the steps and the progress written down so the work survives memory loss; queued asks are recorded verbatim in a plan doc before work begins. (v13.0)
- Before calling a batch done, check every one of his asks against the live build, by the thing itself. (v17.0)
- A debug request covers the whole chapter in depth, not only what he named; if a pass was not enough, say so honestly. (v24.2)
- Every minigame gives its instructions first, with a START, before anything is timed. (v8.7)
- A minigame must test the lesson, not the player's eyesight, memory or touch latency; one that does not serve is replaced by watching or by playing it out. (v24.12)
- Objectives are completed by a press (tap, click or E), never by an auto timer for looking at them. (v21.9)
- The order's mark stands on what the order is about: while "Something tall is standing by the door." was up with no mark of its own, the one mark left on screen (the light switch's, across the door) read as the order's, pointing the wrong way. (v25.5)
- The next place to go is always marked and visible once it becomes the goal; episode 2 onward names it in the objective line, with a waypoint where the premise lives. (v14.8)
- Nothing is offered to the player while a line it hands off to is still playing; the next objective appears only after that line and everything before it are done. (v21.21)
- Every shot and screen must work on both desktop and phone framing. (v21.19)
- Every place is full of sound: ambient beds, environmental one-shots, and music under every film and ending; no quiet room with nothing in it. (v21.13)
- Anything chosen on taste (music, scary beds, laughs, chants) goes to him as loudness-matched previews of every candidate and his ear decides; measurement only screens. (v10.6)
- A Thai temple follows his standing rulings: white, yellow and gold with red only as accent; white pillars, never red; no green; no flags; no long Lanna banners; red-and-gold gable carving; plain pale teak ceiling; no mural; no halo behind the Buddha; nothing Chinese; the monk's seat not beside the Buddha on the same wall. (v16.3)
- Do not repeat the same character model, place or scene across chapters; each chapter looks fresh, and any reuse is declared. (v17.4)
- Facts about real masters and beliefs are researched deeply in English and Thai sources, checked by an independent reader who tries to refute them, every source written down; supernatural claims are labelled popular belief; nothing of the trade (prices, lottery numbers, wish-granting); occult matters framed respectfully. (v21.22)
- Research a sacred design's real name and meaning before adding it, match the source's own images exactly, and flag a name that matches nothing to him instead of guessing. (v17.6)
- Episodes follow the Encounters casebook's case order. (v23.2)
- Each episode is themed around one core narrative, distinct from the next one. (v23.4)
- Ajahn Krukai's model stays untouched; chaptertest pins it. (v23.5)
- Episode 2's admin-tee buddy (`admintee`) is overused: never cast him again, not even as an extra walking past ("I dont want the admin green tshirt guy, he is overused"). (v24.37)
- A GOLD aura or glow is Grandmaster Pho's alone ("Golden will be used for grandmaster pho only"). Lersi Chin's light is white only, and subtle, in his meditation and in his chanting and blessing both ("use only white, and make the white glow more subtle"); no other master is given gold. (v25.5)
- Episode 3 chapter 4's Yin shop keeper (`yinkeeper`) does not stand in for another woman ("Dont use the yin amulet shoplady. Use another women model.", of the customer at his counter in episode 4 chapter 2): a new woman's part goes to another model. (v25.5)
- The auntie of episode 1 chapter 3 (`granny`) is overused and is not cast again ("Dont use this auntie as she has been used many times. Use the thai green shoplady that has never been shown to the player before"): the woman at his counter in episode 4 chapter 2 is his own woman in the green blouse (`e4stall`), his pick. Before a model is given a new part, count where the player has already met it and say so. (v25.5)
- Lersi Chin works by the power of Shiva ("as lersi chin uses the power of shiva"): his chant is "Om Namah Shivaya", three times and nothing else, captioned over "Om. Homage to Shiva."; the white light gathers at his joined hands as he chants it, is sent to the one he clears, and the whole screen goes white and clears. (v25.5)
- Something he drops is closed for good: never ask for it again, and withdraw the ask from every doc that carried it. (v5.23)
- His own models get no credit row; everyone else's work is credited with its link, and a credit row goes when its asset leaves the game. (v5.23)
- His words are used exactly (lines, names, descriptions, punctuation), and any correction to them is said out loud. (v21.7)
- Where his own text disagrees with the sources, put it to him rather than changing it. (v21.10)
- When correcting something, do not overshoot to the opposite extreme. (v22.0)
- When he says 'this should be a standard', the engine owns the behaviour for every chapter, not just the one that asked. (v8.7)
- Places look like the real kind of place (real stock and dressing, a real building when one is named), props make sense for the character, and every moving vehicle has its driver. (v24.22)
- No code-generated trees or vehicles on screen: real models only, the code-built kit drawn only if a file never lands. (v24.20)
- Every prop the player sees is a real model, generated his way when he has not sent one (a checked reference picture on white, then Meshy image-to-3D at its best and its remesh): a prop built in code from boxes and cylinders is drawn only if its file never lands ("why are there such badly drawn models like the wallet which is just a block of colour, and the jacket and bag dont even look like one. You already have meshy connected, why are you not using it properly. Moving forward, you should make full use of generating the 3d models that you need"). (v25.2)
- A beat that matters is guaranteed to be seen, never left to chance or to one option. (v21.17)
- No long stretches of black in a film or ending; there is always a picture. (v7.7)
- A crowd of repeated models is SOLVED for maximum visual diversity (a balanced deal, a seeded shuffle, a local search over neighbours), with a stats report that keeps the claim checkable. (v5.29)
- No real organisation's crest, operator name or brand on props; liveries and packaging are generic. (v9.3)
- Every item carries a colour-coded rarity (common grey, rare blue, ultra rare pink). (v14.11)
- Episode titles are his to set; until he names one, an episode carries the casebook's own title. (v23.3)
- Use the newest generation models, and never report a service out of credits from an estimate: check the real balance. (v22.4)
- A finding outside the ask, or one that would change every chapter or the base game, is listed for him with the reason and left as it is. (v19.2)
- A chapter is built to full completion, nothing skipped, with its own music and sound generated. (v23.6)
- A model he sends with no place decided is prepared and kept ready, and placed only when he picks where. (v14.13)
- A chapter opens where the last one left him, and nothing re-shows a journey the last chapter already made ("it does not link properly"); every decision's answers make sense where he stands (no answer sends him back across a border once the matter is settled) and teach different things in distinct ways ("All the decisions need to make sense, and teach different things in distinct ways"). (v24.56, the plan for episode 4 chapter 2)
- A decision's answers each have a purpose and advance the story ("These answers have no purpose and dont advance the story", of four things to do with an afternoon once the story was already over), and none of them completely deviates from where he is going ("The options should not have those that completely deviate from his eventual path which is to become a master ... all options still lead to him accepting his path and mission"): from the chapter where he finds his teacher, the four options are four roads to the same place, each showing a different face of it. The decision sits AT the chapter's turning point, as his own did in episode 2 chapter 5 ("he is waiting for an answer"), never after the story has finished; and it is checked against every earlier chapter's decision before it is proposed (the first one proposed for episode 4 chapter 3 was episode 3 chapter 1's over again). (v26.0, the plan for episode 4 chapter 3)
- A chapter's ending is never set in the future and never fast-forwards over what later chapters and episodes cover ("The ending should not fast forward to the future, he has to follow the journey of cultivation with pho which is covered in later episodes. That is totally jumping the gun. The ending should not be set in the future."): it stops at the next step, not where the road arrives. Before a chapter is planned the whole story's flow is read, and the plan says what it leaves for each later chapter ("understanding the flow of the entire story is important, knowing whats the next chapters and episodes and linking properly to those"). (v26.0, the plan for episode 4 chapter 3)
- Grandmaster Pho may say more than the case files write, and every line of his is wise and profound ("Grandmaster pho can say more than whats written, but it needs to be all wise and profound"); each is still put to Chad before it is voiced. (v26.0, the plan for episode 4 chapter 3)
- Grandmaster Pho's Wai Kru is festive, loud and colourful, and is shown so ("The entire wai kru ceremony tends to be quite festive, loud, and colourful. It needs to show that"): other people presenting their bai sri and going into trance, and dancers in traditional Thai clothes or naga-looking outfits dancing to show respect to the Thevadas (his "tewadas"). The empowerment is through the bai sri, raised in both hands with the master's hands on it, and no lersi mask is put on anyone ("No need to put lersi masks on the people, instead it should be empowered through the bai sri as shown in the photos"). (v26.0, the plan for episode 4 chapter 3)
- When he gives photographs of a real place, the environment is built exactly as they look ("You have to build out this chapter environment exactly to how the photos look like."): each photograph is taken again in the game from the same place and laid beside the real one, and every difference is closed or put to him. His photographs win over an older ruling where the two differ (episode 4 chapter 3's ground has green, flags and long banners, which v16.3's temple rulings refused). His twelve of Grandmaster Pho's real Wai Kru (11 Nov 2026) are described in docs/V26.0-E4C3-PLAN.md §1.1. (v26.0, the plan for episode 4 chapter 3)
- Every tool he has connected is used to its fullest to bring a chapter to life, and 3D models are generated at the highest possible settings ("Take full advantage and make full use of higgsfield mcp, meshy, eleven labs, gptimage, blender, everything to the maximum potential to bring this chapter to life. 3d models should be generated at the highest possible settings."). A character the game needs is MADE here, end to end, not asked of him: a reference of the person from GPT Image (photorealistic, against a white background, in an A pose), looked at; that picture to Meshy for the 3D model; then rigged; then given its animations ("Own it end to end."). (v26.0, the plan for episode 4 chapter 3)
- Episode 4 chapter 3 is the most important chapter in the game ("This is the most important chapter in the game, it needs to look the most impressive, and be the most cinematic episode ever, in not just cutscenes, but also gameplay portions. Directed with a powerful creative lens, have powerful storytelling, music, sound effects, ambient music and sounds, special effects and visuals. Highly polished."). It is built at full effort from a plan of many substeps, checkpoints and milestones, its progress recorded as it goes so the work survives a lost context, continuously until all of it is done with nothing missed or dropped ("build continuously until it is all done to perfection, with nothing missed or dropped"). Its tracker is docs/V26.0-E4C3-BUILD.md: read it first. (v26.0)
- A lighter body keeps its paint: when a model must be made lighter for a phone, its triangles are lowered (by the generator's own remesh) and its texture stays high wherever it is seen close ("I thought the issue is mostly due to textures and not the triangles. As long as texture remains high res, it should be ok?": the first people of episode 4 chapter 3 had faces smeared by a sheet cut to 1024, not by their triangle count). (v26.0)
- Every phone, in every browser, is held to one standard ("I want you to also think of more ways to force all phones to have a consistent high res high quality experience, i see other phones using other browsers may have a very varied difference in experience, especially samsung browser"; of the options put to him he picked "Full sharpness", "Smooth edges" and "Lock text size"): every chapter draws two pixels a point on a phone (main.js `PHONE_RATIO`; a chapter may ask more, `render.phoneRatio`), antialiasing on, and the page's text measured at boot and divided out where a browser enlarges it (`textZoom`, `text-size-adjust`). The renderer asks for the high-performance chip, which a phone ignores: no page can switch off a phone's battery saver, and he was told so. (v26.1)
- Efficiency improves and the standards and quality stay exactly where they are ("I dont want quality and creativity and standards to drop because of this change, i want efficiency to improve while keeping the same standards and quality"): his asks are done in one shot, one build, one deploy and one round of checks at the end ("cant you do all of my asks in one shot, deploy, test once probe once?"), not one release per ask. Each ask is designed fully before it is built (what the real place has, what each shot sees), so the photographs confirm instead of discover. The work is saved by commits as it goes. Every check this file asks for is still made, once, where it can catch something, and never repeated after each tweak. A generated model's own checks (the reference picture, each model on its own) are part of making it, not probes of the game. (v24.35)
- MY EYE IS NOT A CHECK FOR A BODY ("Know your own limits, and dont pretend you know everything"; "If you are not sure why
  you are not able to tell whats the problem, then dont act smart and say it is solved"; "Stop pretending you know what is
  the problem"; "I want a real solution to this stupid blindness of yours, not for you to keep apologizing and fixing only
  when i repeat it"; "Biggest joke ever to see you call that arm natural": of the taper woman's arm, her elbow behind her
  back, and the brown hermit's fingers, which I had reported as looking right; and of my first answer, which left the
  judging to him: "This is NOT the solution, the solution is for you to know how to fix it, not for me to do more work for
  you"). A body, a pose, a hand, an arm or a finger is never called natural, right or fixed on my own judgement of a
  picture, and the checking is mine, never his. Each pose is LEARNED before it is built (how a real person holds it, from
  real photographs: which hand, where the elbow is, the wrist's bend, the fingers' curl and spacing, written down as
  numbers), BUILT to those numbers, MEASURED against what a real body does (tools/probes/jointscan.mjs: every finger,
  wrist, forearm, elbow, shoulder and knee of every person against human ranges), and set BESIDE A REAL PHOTOGRAPH of a
  person doing the same thing from the same angle, every difference written down and closed. It goes to him only once all
  of that passes. A report says what was checked and what I am unsure of, never "looks right"; I never guess at what he
  points to and call the guess the problem. (v26.3)

### How the work is done and checked

- Measure first, before anything moves. (v8.4)
- Photograph it: numbers, probes and a plausible bounding box can all say yes while the frame is wrong, and a fix is proven to change the picture (render it in red if need be) before it is reported to him. (v13.1)
- Verify a model by photographing each kind on its own, every clip, front and side, before wiring it in. (v6.17)
- Judge a model at the distance the player can walk up to, never only from a wide shot. (v5.31)
- Review on a phone at real size and pixel ratio (his only device): desktop and close-up previews miss the phone-only path and minified textures. (v5.11)
- A phone picture that holds a window, a panel, the HUD or a caption is taken at the phone's real size in CSS pixels
  (390 x 844), never at twice it: the page lays its windows out in CSS pixels, so at 780 x 1688 the decision's window
  stood half its real height and hid nothing, and Lersi Chin, hidden behind it on a real phone, passed every lab
  picture. A film's frame with no window on it may be taken larger. (v25.5)
- A walk slowed or a path changed is photographed again through EVERY shot that watches it, not only the shots the
  ask named (the calmer pace asked for endings B and C left ending D's walk out a doorway and two slivers). (v25.5)
- A harness's test for "it built" counts the thing itself (the meshes drawn), never a shape of the scene graph (a
  healthy world of three groups failed `children.length > 3`). (v25.5)
- A cut changes what is looked at: a lens that changes in one frame while the eye and the subject it rests on stay
  where they are is a jolt, and every step framebounce lists is read by where the picture's subjects stand before
  and after, never by the numbers being whole (three such steps passed as cuts). (v25.5)
- A fit is given the EXTENT of what it must hold (a head's two sides as that eye sees it, a thing's corners), never
  its middle, and afterwards the drawn thing's own extent on the screen is measured (the master's face held at 0.84
  of a phone's half-width, as asked, and his head drawn out to 1.03). (v25.5)
- A sentence written down as his is found in his own message first (two records quoted him in words that were
  mine). (v25.5)
- A probe that seeks a film back to its start puts the film's black back first (a seek applies the tracks it has
  passed and undoes none: a film with no fade until its close was photographed under its closing black), and a dark
  picture is neither dismissed nor believed until the real path is measured. (v25.5)
- A camera move is MEASURED as a move: the lens and the subject's size on the screen at every tenth of a second, on a
  phone and a desktop (tools/probes/framecheck.mjs STEP=0.1, then framebounce.py). A still from each end cannot show
  a lens that jumps on the way (the note's shot: twelve jumps in three seconds), nor a "push" that makes its subject
  smaller (the same shot on a phone: the note 139 px wide down to 113). (v25.5)
- A film is measured AS IT PLAYS too. A seek freezes every body, so a shot whose look or fit follows a LIVING head
  (`headOf`, `faceOf`) stands still under framecheck and sways in the game. tools/probes/filmlive.mjs plays the film on
  a slowed clock (the film and the cast a fixed step a drawn frame) and writes the lens and the look at each;
  liveread.py marks the stretches where either goes there and back. A FIT never leans on a living head: it holds the
  place a man stands with his take's travel beside it (my own fit, made that morning to hold two heads whole, breathed
  a phone's lens 57.7 to 55.3 degrees and back as Pong talked). Where a held shot's LOOK rides a living face, that is
  a direction to be measured and said (episode 4 chapter 2's close shots of Lersi Chin do, up to 3.5 degrees as he
  talks: put to Chad, docs/V25.5-AUDIT.md §6). A fix to a shot is measured this way before it is called done. (v25.5)
- Where a body's hands are sent is checked against that body's own cloth and limbs first: measure the height of what
  stands between (his lap, cell by cell), and photograph the pose from his side and from above, not only through the
  film's lens, which looked at his face while both forearms went through his lap. (v25.5)
- A phone probe must be a touch device, because the phone path depends on touch; a narrow desktop window is not a phone. (v14.5)
- Read every frame of a film on both crops (desktop and the phone's centre crop, as contact sheets) before shipping it. (v6.8)
- The deep-debug method: read-only lenses with one concern each (save and resume, geometry and framing, sound and timing, models and rigs, words and HUD, the engine since the last review, a regression audit of the last pass), a real-input phone play-through to every ending, every beat photographed on the phone crop, every finding verified before it is touched, and verdicts plus what was left alone written down. (v18.5)
- Audit findings are leads, not bugs: verify each adversarially (default to refuted, quote today's line, ask whether a player can reach it) before fixing. (v12.3)
- Before calling a chapter debugged, review the code added since the last review and play every ending with the sound on; report honestly anything that did not pass, and name your own regressions as yours. (v24.5)
- Photograph endings after a REAL play-through as well as after a probe's jump, because what play changes and what an ending re-stages must be read together. (v24.10)
- Never dismiss what a photograph shows as an artefact; measure it. (v24.5)
- Feet on the ground are MEASURED too ("You didn't notice many masters have their feet sunk clipping into the ground?"):
  tools/probes/feetscan.mjs at every phase, on each person's near skin (LEVEL=1), every foot against the floor under it.
  clipscan leaves the ground out (everything stands on it), so a sole under it was never a pair, and a take made on another
  body keeps that body's hips: a body is set down by its own lowest contact (c_cast.js groundTakes), a seated one has its
  legs laid down to the ground from its seat and is brought forward until its shins clear the seat's front. (v26.3)
- A take's motion of a head is measured before it is cast (tools/probes/headturn.mjs: the face's turn against the body,
  over the window it is played in): the kneel's look round swept 54 and 61 degrees either side and Grandmaster Pho's talk
  56 to his right before Chad saw them ("too extreme", "moves too much"). (v26.3)
- Things passing through one another are MEASURED, not spotted ("The environment has many things that clip into each
  other that can be seen in your screenshots, im amazed you were not able to pick up on that"): tools/probes/clipscan.mjs
  over every phase and every 9 s of every film, and each pair it finds is a lead, photographed full size and read as a
  joint (a post through a rail, a foot on a table) or a clip before anything moves. A tree is placed by its crown at
  every height (masters/v26.2/trees), never by its trunk. (v26.2)
- Test saves at every phase: Continue from each saved phase through the title on a phone, a same-sitting Continue, every way into a chapter (Continue, the selector, natural progression), and saves from the previous version. (v7.3)
- A ?ch= probe reads and writes no save, so test the real entry paths; and a save fix must also repair the saves already on his phone. (v18.4)
- Test a same-chapter replay both ways: run the pass twice through the real replay path and diff it, and read what reset() forgets. (v8.2)
- Probes drive the real input path (real pointer and CDP touch events with their own timestamps), never the press function, and simulate what headless Chromium cannot (the long-press menu). (v18.3)
- Test a reaction minigame on a fake clock with a simulated human reaction delay. (v21.2)
- A probe drives the way a player can (reach the title through the menu, follow the order as given). (v24.9)
- Probes and harnesses capture page errors and the console, and count what should be there: a probe that only checks what is there cannot see what never loaded. (v8.5)
- A harness exits non-zero on any false check; runtests reads exit codes, not printed booleans. (v6.3)
- No fixed waits in a harness; poll. (v8.7)
- On a slow box a screenshot after a fixed wait can come before any frame is drawn: wait for a drawn frame and for animations to settle. (v12.0)
- Photograph a world from play, not under a paused film: cineSeek re-applies every passed track, and seek() pauses, so a cue only proves itself after resume(). (v6.17)
- Let a chapter boot before driving one of its phases; a beat fired before its first frame is re-applied as a resume. (v9.3)
- Every harness runs muted (headless has no touch), and when a new thing fails, ask an old thing the same question. (v9.2)
- Make a claim checkable with a stage reporting function (seatStats, ambient, marchRate, palms); the cue log cannot see sounds played through worldSfx. (v5.29)
- Take a cue-log baseline before the call, not after the state changes. (v8.2)
- Probe traps: hiding a mesh hides its children; a canvas read-back is blank without preserveDrawingBuffer; renderer.info resets on each of main.js's two renders a frame. (v12.4)
- Slow-box probe laws: two 'quick' real clicks are not quick; a synthesized vertical touch is a tap; observe a caption, never sample it; a phase jump leaves the line queue full; never return the page's own promise from evaluate; a capped chapter clock turns a wait into minutes. (v21.25)
- An optimisation is proven, not argued: behind an OPT switch, the same frame compared pixel for pixel and every matrix bit for bit, plus invariants checked. (v15.0)
- Prove every new check by breaking what it guards, on a throwaway copy, never on the real asset. (v14.16)
- Fix the class, not just the instance: add the engine default with a console warning, the harness check or the build-time static scan that stops it coming back. (v14.1)
- If the same fix fails twice, the measure is the wrong one; find the measured why. (v9.3)
- Revert a guard written against a hypothesis the moment measurement disproves it. (v9.0)
- Harnesses teleport, so they cannot see a sealed route: walktest floods the real collision grid from the spawn and from every arrival a stage names. (v7.4)
- A way OUT is proved shut by that same flood, never by the points one thought of: a set that was only filmed has no
  solid walls, and when a chapter makes it walkable its WALLS are made solid, not only what stands on its floor (his
  shop's front was walled and tried at the front; through its side walls the flood reached 257 square metres for a
  shop of 17). A chapter whose play is one place names it (`stage.keepIn`) and walktest holds it there. (v25.5)
- walktest's list of chapters (`KEYS`) is written by hand: a new chapter is ADDED to it, and chaptertest fails any
  chapter in the run that it lacks (`walk` was green four times for v26.0 without ever walking its chapter). When a
  harness passes on a new chapter, check that it ran on it. (v26.0)
- A chapter whose ground changes (a crowd that moves, a second day) is walked in each of its grounds: walktest
  floods the first frame only, so each phase's own collision is flooded from where that phase puts him
  (tools/probes/e4c3walk.mjs), and a same-chapter replay is read object by object against a fresh start through the
  card's own buttons (tools/probes/e4c3replay.mjs; e4c3who.mjs names what a path is). (v26.0)
- Harnesses may run on a hard-linked snapshot of dist while the next version builds. (v21.13)
- Reusable probes live in tools/probes, so they survive a replaced container. (v24.3)
- Unshallow the clone before making the backup bundle, so the bundle holds the whole history. (v24.4)
- An urgent change while unreleased work sits on the branch is built from the last released tree in a worktree. (v21.32)
- Deploy first means once the changed chapter has been seen to boot. (v21.1)
- For every engine change, say whether episode 1 can reach it ('unchanged by construction') and run episode 1 as the control. (v9.3)
- State the cost of a change, measured not guessed, and put a costly one to him with the options. (v24.3)
- Audit his mid-turn messages too; they arrive as queued commands. (v21.9)
- Check every film and ending with a static scan against the live stage: no voice over another, and every stretch of 1.5 s or more without a voice held by a sound with a reason. (v21.30)
- Check a re-timed film by recording every timed call against a stub before and after and comparing. (v21.20)
- Propose a chapter's or an ending's shape (line by line where it is content) and build only after he approves it. (v21.30)
- A sheet past the Drive connector's base64 wall is exported, not published, and the last published link stays the one to give him until it is published another way (docs/OPEN-ITEMS.md A1). (v7.9)
- Never write something down as impossible without trying it. (v6.1)
- Re-read LEARNINGS before redoing a kind of task; the lesson is often already written down. (v5.15)
- A retired asset leaves the build and the repo (git history and its masters recipe keep it); anything kept in the build unused has its reason written down. (v20.0)
- Re-run the previous release's regression probes on the live build before changing more. (v21.27)
- For a device-specific rendering report, ask him for the ?diag screenshot. (v15.2)
- A new sheet's diff against the last one is exactly the cells changed. (v14.2)
- A picture is judged by a reader who does not know what was meant. The end check hands every changed shot (phone crop and desktop) to an independent reviewer with only the pictures and the question of what looks fake, blank, floating, doubled or wrong, because the author sees what he intended. v24.33's bus-stop advert panel, lit and blank, passed every check as 'an advert' and read as a white block. (v24.35)
- A pose or a motion of a body is judged FULL SIZE, one picture at a time: from in front of the body, from beside it, and
  through the film's own lens at a phone's shape (tools/probes/poselab.mjs keeps the game open for it). Never on a
  contact sheet, and never reported to him as natural without those pictures and the list of what still looks wrong
  ("i find it unacceptable that you find his poses natural, it clearly is not. You are not trying hard enough": v25.2's
  poses, judged small by their author, were two flat hands side by side for a wai). (v25.3)
  A take retargeted onto another body is a new motion and is judged the same way before it is wired in: the library's
  walks (the admin tee's, Meshy's own woman's walk) hold both arms out and swing a hand to the waist, a young man's
  march on an auntie, passed from small pictures and seen in the film (tools/retarget.mjs --calm brings the arms in). (v25.5)
- Before a real ceremony or place is designed, he is asked what the real one is like and for photographs of it:
  episode 4 chapter 3's Wai Kru was first designed as the calmest, whitest place in the game from written sources about
  other lineages, and the real one is festive, loud and colourful. (v26.0)
- EVERY PICTURE IS VIEWED FULL SIZE, UNASKED ("You SHOULD ALWAYS VIEW FULL SIZE AND NOT WAIT UNTIL I TELL YOU TO. IM SICK
  OF THIS"; "how did that pass your review? This is not the first time i kept saying things that should not pass
  review and you are absolutely blind"). Whatever the player will see that a change touches (a body, a pose, a hand, a
  seat, a joint, a prop) is photographed at the phone's real size from where the player stands, and each picture is
  opened at its full size, one at a time, BEFORE the change is built on, deployed or reported. A sheet of small
  pictures is an index for finding one, never a judgement. What looks wrong in each is written down and fixed first;
  nothing is called done, fixed, rebuilt or seated from a number, a lab view or a small picture. Looking at the thing
  is part of making it, so deploy-first does not excuse it (the three monks went live with wrists broken back and
  hands like claws that my own notes had already described; "Pho's armpit: rebuilt" was said before it had been looked
  at from his front in the game, where it still had a ragged opening). (v26.0)
- A face, a body or any painted surface a phone draws is judged on a low-resolution phone too ("You also need to consider how it looks on a low res phone or 720p phone, the faces are really bad there": tools/probes/e4c3beats.mjs VIEW=low, 360 x 780 points at two pixels a point), and a still photograph that looks fine is not believed over his phone ("For some reason , it looks ok in your screenshot, but when i play it on my phone it looks absolutely horrendous"): a sheet drawn without mipmaps is SAMPLED, not averaged, where it is shrunk, and crawls as anything moves, which a still freezes into a sharp picture. Measure its texels a metre against the phone's pixels a metre where it is seen (tools/probes/texdensity.mjs). (v26.1)
- NO SMALL PICTURE IS EVER A CHECK ("You are banned from ever using small picture check, everything needs to be high res,
  full size images. If you need to have multiple images in one image, it should be a high res image, everything you do
  has been low res"). A photograph that judges anything is HIGH RES: a phone's window at its real size in CSS pixels
  (390 x 844, so its windows are laid out as his phone lays them) DRAWN at two device pixels or more to one (780 x 1688
  and up: tools/probes/e4c3beats.mjs does it by default), a lab picture at a thousand pixels or more a view, and a
  detail taken with a narrower lens, never by enlarging a small picture. Several pictures in one image keep every
  picture's own full pixels, and if the whole is larger than a viewer shows at its own size it is opened a piece at a
  time. He sees the pictures the work is judged by: a low-res picture is a check nobody could have made. (v26.0)
- THE REPOSITORY IS PUBLIC (checked 11 Nov 2026). Photographs of real people and lists of names are never committed: his
  reference photographs live on the working machine under a path git ignores (`masters/v26.0/ref/`), are described in
  words in the plan with their checksums in the research note, and are asked of him again if the machine is replaced. No
  part of a photograph that shows a face or a name is sent to a picture service, and nobody in one is copied into the
  game (no face, no tattoo, no name, no group's badge). (v26.0)

### Models and assets

- Size and ground a rig from its posed bones or posed skin, never from a bounding box (a SkinnedMesh's box is its bind pose) or the file's own units. (v3.8)
- glTF renames nodes (dots stripped, 'mixamorig:' sanitised), tracks bind by name, and a wrong or loose bone lookup fails silently: use the shared regexes and measure the bone. (v3.8)
- Place a new thing among existing ones by the measure the existing ones used. (v5.05)
- Fit a replacement model to the primitive it replaces, by the dimension the chapter's numbers depend on, so nothing else moves. (v9.0)
- Superseded primitives are hidden, never removed (blockers and taps still use them), kept in one group swapped by one flag, and nothing may make one visible again. (v9.0)
- A model replaces its stand-in only once it has landed, so a failed download costs a nicer prop and never the chapter; a stand-in that hides on landing is kept out of static merges. (v4.7)
- Reach for a character's own clips first, and make what is missing from what the file has. (v5.20)
- Retarget across rigs in world space, never by name (even two Mixamo rigs differ at rest), and align a T-pose take to an A-pose rig. (v5.20)
- Drop a model's unused clip library (its channels and samplers) at prep. (v5.20)
- A flat-shaded export or a Meshy original cannot be simplified (every edge is an attribute seam): deflatten it, or use the remesh. (v8.0)
- Ask a generator for the triangle count wanted and thin nothing here: a generated sheet is thousands of small islands,
  and thinned, every panel crumples along their seams (the yard's cars: Hunyuan3D asked for 100,000, where 500,000
  thinned to 30-110,000 was refused by photograph). Try the engines on one reference picture under one light before
  choosing (Hunyuan3D v3, Tripo, Meshy: masters/v25.5/make.sh). (v25.5)
- A generated body's paint comes fully metal and mirror-smooth: read it as paint at prep (prepmeshy PAINT), and give a
  DARK body a rough finish, because gloss shows every soft dent a generated body has at arm's length; paint out the
  roundels a generator invents (BLOT). (v25.5)
- A take named 'idle' may fold the body over: sample it across its length and use its upright window. (v8.0)
- A take is MEASURED AS A MOTION before it is cast: its head's and hips' travel and their speed over its whole length,
  on the body that will wear it. A still shows a stance, never a sway: a "listening" take picked from stills moved the
  woman's head 23 cm from side to side at 14 cm a second, and because the films look at her head (`faceOf`), on a
  phone the whole picture behind her swung a third of the screen: a camera that bounced. A probe that seeks a film
  (framecheck) freezes every body in it and cannot see this; the same film moment photographed twice in the lab can. (v25.5)
- A walk that moves a body over the ground is paced from the take itself: a take that TRAVELS by the travel taken out
  of its hips over its length, and turned by that travel's own heading (a written walk went 21 degrees aside of its
  front); only a take that comes on the spot (the library's) is read from the planted foot, which on a slow walk
  reads half and leaves every foot sliding. A written take (text-to-motion) is not a loop: one cycle, heel to heel,
  is cut and its end eased onto its start (tools/probes/gait.mjs reads the strikes, the pace, the heading and each
  toe's creep; c_cast.js `loopOf`). (v26.0)
- Measure a model's up axis, facing and ends, never assume them; the render settles the facing with the measures as its guard, and the prep tool asserts its contract before quantize() and refuses to write a wrong bake. (v12.1)
- The material decides foliage and alpha, never the texture's name; keep an alpha sheet's alpha, do not simplify leaf cards, and give crowns anisotropy. (v6.16)
- Simplify per part, gently or not at all where the silhouette is the model (tubes, leaf cards). (v9.0)
- Bake transforms before quantizing or joining (flatten() does not bake, clearNodeTransform does), keep the mesh on a child so meshopt's transform never shares the placement node, and give quantized geometry its node transform. (v13.1)
- Convert spec-gloss materials to metal-rough; three.js draws them flat white without a word. (v5.17)
- Before dropping maps or attributes, check where the look lives (metal-roughness, emissive, vertex colours); a metal with no environment renders near black, and a dropped emissive map leaves a white lamp. (v11.3)
- Never retouch a scan's painted pixels; only pad the empty fill between its islands. (v5.10)
- An atlas whose contrasting charts sit flush draws without mipmaps (minified, they average into white streaks); mipmaps only on a dilated atlas; Meshy scans get CHARTFIX and no-mip colour. (v5.11)
- A normal map baked against the full mesh does not survive a heavy cut; recompute normals across seams, and let a statue's face set the floor of the cut. (v14.14)
- Draw full detail only where it is big on screen: an LOD with a permissive cut over the same vertices (or a planar front for cased pieces) further off; item views get the full scan. (v18.8)
- Meshy auto-rigs: diffuse the blocky skin weights over the full mesh before simplifying, share normals across seams, keep UV-seam twins moving as one, and export from the Character_output FBX. (v16.8)
- A generated body's paint is laid out again before it is drawn on a phone: its thousands of flush charts re-cut with room between them (Blender's xatlas, the face given three times its share, the head two, the hands one and a half), the colour baked from the generator's own 8192 sheet through each triangle's old coordinates, and the sheet drawn with mipmaps (prepmonk REPAINT, tools/repaint.py, c_cast.js `sheetOf`). A packing is measured before it is baked (tools/probes/uvoverlap.mjs): one that overlaps or leaves the sheet falls back. (v26.1)
- Split back-to-back triangle pairs the simplifier folds, whose normals cancel and shade as NaN. (v19.8)
- Seat a sitter on his posed skin, build the seat round every take he sits in, and cancel each take's root offset so changing take never slides him through it. (v16.8)
- A STANDING take may hold the body off its own origin too (the auntie's Stand_and_Chat: half a metre): measure the
  hips against the group in the shot, and where the body also walks bring the take's hips track onto the mark on the
  person's own copy of the clip (e4c2's centreStand); mkPerson's `centre` is for a figure who never walks. (v25.5)
- A Mixamo hand bone is the wrist; offset a grip to the fingers. (v17.1)
- Parse each asset once and clone it (the original never touched), clone before touching (cloneSkinned copies transforms), measure scale and turn once on a shared posed take (never the standing bind pose; size a person standing), and give a clone its own materials before changing them. (v9.1)
- A rig's culling sphere covers every pose of every clip, is built in world space round the posed skin, and is set on both the mesh and the geometry. (v8.4)
- Prep models to real metres with the origin on the base centre, so every number in a chapter is a place, never a scale factor. (v13.1)
- A generated model's sources (Meshy's original and its remesh) go into masters/<v>/src the day they are made, with every job ID in that recipe's make.sh: Meshy keeps a job's files three days. List a scratch folder before deleting it; old release zips are the safe thing to clear (Netlify holds every deploy). (v24.26)
- Measure per mesh: the most-forward vertex of a first-person weapon rig is a hand. (v13.1)
- A Sketchfab clip's keys may begin seconds in: start each take at its measured first key and park the rest on its last. (v12.0)
- textureCompress's EXT_texture_webp hides the image from the strict-CSP rescue; drop the extension. (v14.12)
- Real photographs and paintings are used as the source's own bytes, whole at their own aspect, never cropped or retouched, with the sha1 and source recorded and a credit row. (v21.11)
- An asset key is global; never reuse one, not even a parked feature's. (v14.7)
- Cut a body by what each vertex is skinned to, and geometry by clipping against a box, never by height or by centroid. (v21.16)
- A walkable building's collision is derived from its own mesh. (v16.9)
- Anything dressed onto a model is fitted to whichever model landed (the model or its fallback). (v24.19)
- A thing made bigger or smaller is one size wherever one shot follows another, and is photographed, each kind of it,
  wherever it is carried: where it stands, in his hand on a phone's frame, on another's hands, where it is laid, and
  through every film that sees it (v25.4: the takrut made bigger for its shelf ran out of the frame in his fist). (v25.4)
- An FPS viewmodel rig is not quantized; additive textures need no alpha; a greyscale map multiplies the material's colour. (v12.0)
- A rig's face direction comes from its bind matrix and is proven by a render, never taken as the head bone's +Z. (v6.8)
- A take name a rig does not have fails silently (rig.play returns false and the man stands in his bind pose), so every take is checked against the clips in the rig's own file. (v11.2)
- Before a pose is written for a rig, measure the rig from its own takes: its elbow's hinge (a real one keeps the forearm in
  one plane of the upper arm: solve the elbow about that axis, never by the shortest arc, which bends it sideways), how
  far its forearm rolls and its wrist bends, and each hand's own surface and thumb side; place a hand on a face or a
  thing from where that face or thing is drawn, not from a height in the room. (v25.3)

### Sound

- The voice registry records what is HEARD: transcribe the shipped take, and verify a voice change by transcribing it. (v5.14)
- A wordless take is still prompted with voiceable text, never tags alone. (v10.8)
- His prompt rules: the registry's words exactly, no added capitals, at most one added ellipsis, one tag naming an emotion (never only a volume), and a tag proven absorbed by measuring the pause (a transcript echoes the prompt). (v5.28)
- The bark rule for the encik and the tower: no stage direction, write the bark itself (short bursts, full stops, capitals on the stress), recorded in the speaker's registry row; the opposite of his rule. (v8.3)
- A regeneration list comes from the registry, the same explicit take set chaptertest checks both ways (never a prefix rule), and is proven complete before anything is generated. (v5.18)
- After a take changes: re-measure its length into the registry and SECS, run the static overlap scan (old lengths against new), move everything after it by the same amount, and trim trailing silence at the words' end. (v5.15)
- Lines that follow one another run off a queue gated on the speech window's own clock, never at hand-typed times, and sayLine's refusal is never ignored, so a cold or muted line never stops a scene. (v9.5)
- Every sound play or a scene can ask for is warmed (warmSounds; the engine's own in its warm set), a scene's cues are literal sfx(t, 'name') calls the warm scan can read, and a first play is tested on a fresh load, not a replay. (v10.2)
- Judge every sound by what a phone speaker plays (almost nothing under 120 Hz) and by its masking of the voice band, picked by measurement because a session has no ears. (v10.4)
- Levels: his takes are peak-matched to the file they replace, but peak says nothing about the average, so the flat-bus cast is levelled by RMS to −16 dBFS, beds sit at −34 to −37 dBFS with nobody speaking, and speech keeps 10–15 dB over the mix through the duck. (v5.26)
- mp3 and Opus shift level in opposite directions, per file: encode each from its own source and measure the output every time. (v9.6)
- A generation's duration and loop are model parameters, never words in the prompt. (v9.2)
- A music bed is crossfade-looped by hand, its seam checked at the joint. (v9.2)
- Measure every take; a take can come back silent. (v12.1)
- Whispers and breaths go round the voice bus; through its compressor they come out as loud as speech. (v6.9)
- eleven_v3 will not truly whisper some lines or slow down between pauses: use eleven_v4 with one tag, verify a whisper by measurement, and voice children in a child's register, never pitch-shifted. (v21.5)
- A short take is where the clean end is lost: a three-word line came back cut inside its last word and was picked as "the tighter read" (0.64 s, ending on signal; the chain's fade then took the syllable). An end on signal is refused before length is looked at, and a line said at twice the game's pace is a rushed line. (v25.5)
- Pick takes by a clean end first (an end on signal must be a whole word, checked by word timings), then no odd hole, then the tighter read; check no tag was spoken; write every pick and why into the masters' make.sh. (v18.6)
- A scene's closing line is said inside the scene and its music comes in under the last line (a cue fired at a scene's end dies with it); picture and music fade together. (v15.3)
- A cue's volume multiplies its STING_SAMPLE row. (v6.14)
- Never set a cue's gain over 1: make the file louder by its average under a limiter, and keep summed peaks under full scale. (v23.1)
- A sound's name is global and a chapter's sayPrefix is a namespace; a chapter that cues another chapter's sound by name makes it shared (every player's boot download), so it gets its own copy. (v7.1)
- Retire a sound that nothing plays completely (files, STING_SAMPLE row, take sets, registry row), because an unnamed sound falls into the shared pack; its takes stay in masters. This replaces the older keep-it-in-the-pack habit (v9.6, v10.8). (v24.3)
- Stop a chapter's loops when it is left (a source at gain 0 still plays) and release its decoded audio. (v14.16)
- Rhythm cues are judged by their decay and cut from 20 ms before their own peak. (v9.4)
- A long chant or bed is not a voice take; on the voice path it holds the duck down under everything. (v24.0)
- A whisper or a murmur meant to be wordless is put through a transcriber, and a take it writes words from is refused:
  it would say something nobody wrote, and would need a caption. (v25.4)
- Ambient one-shots come one at a time from a seeded stream on the chapter clock, panned, quieter while anyone speaks, only in the phases they fit, cleared by reset(); beds are mixed by place and beat. (v21.13)
- When every generated take fails the measure, make the sound instead. (v24.3)
- Re-run only refused or failed generations, never one that succeeded. (v24.3)
- Every audio treatment's recipe is kept on disk in the masters' make.sh, and retired takes stay in masters. (v10.3)
- Every chant with words is captioned (the Pali as chanted over its meaning), timed on the take's breaths from the line's own start so it also works muted, translated from Thanissaro Bhikkhu's A Chanting Guide. (v21.31)
  The one exception: episode 4 chapter 1's black ajahn chants WORDLESS, with no subtitles (v24.24: "Except for his creepy chanting, that part will not have any subtitles"; v24.25: "you cannot even hear the words").
- The main character's voice follows the episode (Aaron as the boy and the recruit, Brian as the grown man from episode 3), and the boy's engine lines are gated to his episodes. (v18.5)
- When replacing or removing a cue, audit everything it carried (a swell, a beat) and say what was lost. (v10.6)
- The four lines under the outcome cards are his own terse first-person reflections, never the card read aloud. (v4.91)
- Keep a line's pace near the game's median (about 2.3 words a second) and the read's speed fitting its feeling; re-say a rushed line. (v5.30)
- ffmpeg's alimiter does not hold its limit; use the numpy limiter. (v10.7)
- A sound the world plays by name still needs its STING_SAMPLE row before a scene can cue it. (v21.30)
- Every line a chapter speaks has its measured length in that chapter's SECS table (sayLine otherwise books a default 2.5 s); chaptertest fails a chapter that speaks one it lacks. (v14.3)
- Starting a cutscene stops every play-time line, so a line meant to be heard in a scene is cued by that scene. (v6.6)
- One voice at a time: a play-time line waits for any live voice (a scare that would land late is dropped), and a scene's natural end lets a line finish its sentence while a skip cuts everything. (v5.30)
- Cast a voice that stays the same person across takes (eleven_v3 re-rolls a voice's character per take); new voices are auditioned and he picks. (v5.18)

### Camera, scenes and staging

- Everything in a film is a pure function of the film's clock (poses parked at the frame the clock asks for, paths as functions), so a seek, a skip and a slow phone land on the same picture. (v6.4)
- cineSeek applies every passed track every frame, so a track that changes state says when it stops, anything that must survive a seek is a track not a step, and a skip runs passed steps in push order. (v6.12)
- A chapter's play-time frame functions do not run under a cutscene, so a scene drives its own effects (flares, fades, ramps) as explicit tracks. (v12.1)
- An opening film keeps its black at its end (keepFade, endFade 1), fades its music with the picture, and ends on the light play begins in so nothing snaps. (v14.1)
- A film ends with its props exactly where play keeps them, using play's own constants, never a new number. (v5.25)
- For a close-up, narrow the lens rather than pushing the camera through the 8 cm near plane. (v6.12)
- Framing is measured in NDC and pixels on the target screen, through a copy of the camera rig; a fixed world size is not a size. (v13.0)
- Each shot names the points that must be in frame and solves its distance for this screen's aspect (a portrait phone sees a third of the width), and every lens position is checked against the set's solids. (v21.8)
- A centre-ray miss is not a clear frame; coverage is a property of the whole frustum. (v14.2)
- Frame an outcome scene from a stated standoff distance, never from wherever the player happened to stop. (v14.1)
- A scene is directed: the camera goes, on the word, to what the words are about and pushes in on the speaker when it matters, and in a point-of-view scene a cut away from his eyes needs the cast looking at him; a scene with words and no direction is not finished. (v21.30)
- Every prop in a scene belongs to that scene's story. (v21.30)
- A look starts from the neutral head and eases onto its target within a neck's reach, aimed from eye level with a slight downward bias (a face tilted up reads as disdain). (v6.9)
- A character talking to the player turns his whole body to face him, and a turn that hands over to a walk ends where the walk begins, never a snap. (v14.5)
- A character who speaks plays his talking take on the line's own start, finishes the line before he moves off, and goes back to rest after; a take a scene set is cleared by whatever ends the scene. (v11.4)
- Cutscene paths obey no collision: audit every timeline against the blockers, keep every stand clear of the furniture, and deal walking lanes by where each man stands so paths never cross. (v5.03)
- To face a model at something use faceFrom(...) + Math.PI (faceFrom aims cameras; a Mixamo rig at 0 faces +z), and remember pitch.rotation.x positive looks up. (v5.0)
- Write a shared sign convention down as a named contract (DOOR_AJAR, DOOR_OPEN) and measure it, because a guessed or commented sign can be wrong. (v4.6)
- In play, a shake, stumble, recoil or sway is laid on the look as deltas and taken off again, so the player's look stays his. (v11.1)
- A ghost who is already there is the beat; one who fades in under your eye is a special effect. (v9.5)
- A reaction (a banner, a sting) lands on the frame its cause is seen. (v13.0)
- A change in the world is made on a cut or in a shot that cannot see it. (v24.12)
- A film from play leaves the world in the same state whether it ran, was skipped or never played. (v24.12)
- The viewmodel's cut-off upper arm is never on screen, a held thing stays in a phone's frame (slid inward, never out), and a prayer clasp never shows the thumbs. (v20.1)
- Hotspot anchors sit at eye height, never on the floor or under the lens at the closest standing spot, and a mark the chapter turns him to is within reach and inside its aim cone. (v7.5)
- A chapter declares its spawn facing (spawn.rot), turned to what the player must see first within a portrait phone's narrow view; what play needs first is staged inside the opening's last line of sight. (v12.3)
- The far plane is 160 m: sets fit inside it, a pocket world past it is never drawn from the main one (distance does the hiding), and the sky stands where the stage says. (v8.9)
- A film set outside the world's fog uses fog-free materials, its sky bubble is a depth surface, and a film that opens on async assets waits for them in ready(). (v6.6)
- Paint a film set at half the brightness wanted on screen; the tone mapping pales whatever is painted. (v8.9)
- Light new things without adding a light (emissive, painted pools, unlit painted shading): a light costs the phone a shadow pass, and changing the light count builds shaders on screen. (v9.4)
- For a coloured glow over a bright surface, normal-blend the hue and add the glow as its own layer; additive colour sums to white. (v8.8)
- Never let two surfaces share a plane; offset them by millimetres. (v19.3)
- Sea and sky outside a window are geometry with perspective, never a vertical painted sheet. (v8.9)
- On a phone nothing casts shadows, so a contact shadow is painted, and a body sinks a little into what it rests on. (v9.3)
- A doorway must be visibly open from both sides and have a walkable way to it. (v8.9)
- Shots look in at the subject, and whatever a shot looks straight at is built, never a flat painting. (v24.22)
- A cutscene is skipped only by the Skip button or its keys, and only from 3.0 s. (v6.6)
- A scene change happens in the black: place, warm and land everything before the black lifts. (v16.1)
- The grown Master Zavier is never seen: no mirror, reflection or third-person shot shows him, because there is no model of him in the world (Chad: "it will then require a new master zavier model"; `zav` is the equipment panel's figure). Every shot is his eyes. (v24.56, the plan for episode 4 chapter 2)
- A cramped interior gets a wider lens on a phone. (v24.21)
- Frame and fade a rig by where its body actually is, not by its group's spot. (v24.4)
- Lay a long thin strip near the lens in short lengths; it clips badly. (v22.3)
- Whatever is solved every frame of a moving shot (a fit, a clamp, a level chosen) is a SMOOTH function of the film's clock: a lens widened a step at a time jumps each time the shot crosses a step. And a fit names the one subject it holds, never wherever a pan has got to (the call: the lens thrown out to hold the phone and the half-turned aim both). (v25.5)
- A colour over the whole screen (a white flash) is the film's fade in that colour (`fade(.., color)`, the forty-third seam), never a card drawn in the picture: the vignette lies over the canvas (a white card comes out grey at the sides) and the hands' pass is drawn over the world (his own hands stand on it). (v25.5)
- A flat card of light (a sprite) set among a body is drawn over what stands at its depth (`depthTest` off): tested against depth, a bowed face cuts it along a hard curved edge. (v25.5)
- A cutscene ends at its last TRACK (a sting is not a track), so a cue written after it never plays: cue the last sound under the fade; chaptertest walks every film and scene and fails a late cue. (v12.3)
- A verb a cutscene calls never plays the sound itself (the sound stays a scheduled cue that the cue log and chaptertest can see) and never writes what the cutscene owns, such as the pitch. (v13.2)

### Engine and code

- Every clock in play runs on wall time, never the clamped frame dt (which runs slow under 20 fps, worst on a hot phone), and a group moved on wall time drives its walk's rate from the ground covered. (v7.1)
- A thing that must be seen lasts wall time and a number of drawn frames. (v13.1)
- The chapter clock stands still under panels and menus while wall time and voices run on: gate on state, and time anything that plays through a pause from its own start on the wall clock. (v21.21)
- reset() puts back everything a run changes (values stated in a clock, positions set by a phase, takes a scene set, given items, accumulated looks, seeded streams), because a same-chapter replay never re-runs build(). (v8.1)
- Saves run on receipts: each award carries its note and pays only what is not banked, progress rides the phase string (the only receipt; an empty bag is not one), applyPhase covers every phase, a beat spanning a save is tagged as played, progress is saved the moment it counts, and old saves map onto new phases. (v7.3)
- Derive state on the frame from what is saved (a step from the bag, a direction from parity, a rule from phase and distance) instead of storing a copy that can drift. (v11.6)
- A chapter-start save carries no phase, no conduct and fresh stats; a minigame is saved as it opened; the autosave is held while a payment or a choice is unresolved, and a bookmark never moves in the tick of its payment. (v18.4)
- A resume is placed under the card, so it never flashes the previous chapter or spot. (v4.8)
- A same-sitting Continue lands exactly where a reload's would. (v22.2)
- Never show OBJECTIVE COMPLETE for a failure, for lateness or for an undone step, and never follow a COMPLETE with the same words again. (v8.7)
- What is drawn and what is tested are the same number or the same function. (v8.7)
- A new seam is opt-in and a bit-identical pass-through when absent, declared and proven (opt-in included) by the fixture, shipped alone first when it is big, and kept, still proven, when its chapter stops using it. (v12.0)
- Minigame charges are paid on the spot, the end pays only what is still owed, a flat cost is settled where it happened, the 'worst' sentinel is Infinity, and every minigame charge goes through evCut() with a chapter's own minigame price flagged. (v9.3)
- Timing grades fit a touchscreen's latency: PERFECT 45, GREAT 105, GOOD 180, SLIGHT 300, BROKEN past 510 ms. (v12.3)
- While a minigame is open all input is its own (keys and mouse, never the gun; a held key counts once), and a drag or steady game releases pointer lock. (v9.4)
- Gestures are timed by their events' own timestamps, never by when the handlers ran, and a hold counts the time the finger was really down. (v24.2)
- A long press is never the browser's: the context menu and text selection are refused on touch. (v24.1)
- Every timed phase has a failure state that ends it; nothing soft-locks. (v7.4)
- Nothing charges or faints the player under a panel he is reading. (v11.4)
- Transient play effects end on the frame a panel, card, menu or scene opens, and play-time loops and one-shots never run on under cards, menus or the title. (v11.4)
- A minigame panel never covers what it asks the player to watch. (v18.0)
- Whatever state the chapter obeys is on screen: a timer that ends a phase is shown, a minigame shows how he is doing, a lock always says why. (v8.1)
- Adding a HUD element means re-measuring every overlap by bounding box on a 390 px phone and on desktop. (v11.5)
- A banner observes; it never orders an action the player cannot follow. (v12.3)
- No line, hint, item description or card line lies: each is true everywhere it can be read and of the world as built, and no hint points at something locked. (v14.2)
- A prompt or label shows only while its thing is on screen and live; an interaction with nothing to offer is not offered at all. (v12.5)
- On a phone every interaction needs a tap target (the badge, or a tap on the thing itself). (v12.5)
- A brief names the input for each device (a tap on a phone, the key or the mouse on a desktop), and key labels show only to a fine pointer. (v18.5)
- Minigame events move Sanity and Awareness, never Wisdom; the engine would take any stat a chapter names, and every chapter so far keeps to these two (v14.13's guard is worded for all three). (v7.0)
- A matrix freeze exempts anything that animates its own transform, with the exemption beside the freeze. (v8.8)
- A pose laid on after the mixer is undone before the mixer runs again (an unchanged bone is not rewritten, so offsets stack), and values are set absolute from the clip. (v11.5)
- Animation mixers update above the cutscene guard; only pose writes sit under it. (v5.19)
- Force a clip's end pose through action.time, and make a fade of 0 a hard cut that bakes the pose. (v5.07)
- Never write a switch another owner owns (the hand's root, the arm, a film's visibility): derive on the frame, write only while your own effect runs, and set a clone's state explicitly because a clone copies 'visible'. (v11.1)
- An asset loader's failure is never silent (an error, the console, and walktest fails on it). (v12.2)
- A declared empty word means no text: test presence, not truthiness. (v14.1)
- A lit material's shader depends on how many lights are drawn, so never change the light count on screen without warming that state; prefer painted light. (v15.1)
- A material's envMapIntensity multiplies its scene's environmentIntensity: three r185 ignored it under scene.environment, so `npm run build` patches three (tools/patchthree.mjs, which stops the build if an upgrade moves the line); a value meant absolute gives the material its own envMap — never one also drawn in his hand, where the hands' pass reflects at half the world's (a lift follows each pass; an envMap of its own is the same in both and keeps a dead texture after a lost context, v24.30); and a lift is a look, set from photographs at a few strengths (tools/probes/shine.mjs BRACKET) in every pass it is drawn in, never written blind. (v24.29)
- An optimisation that thins content decides up front and hands its result to everything built on it. (v16.5)
- Anything random is a seeded deterministic stream rewound by reset(), and a cosmetic addition gets its own stream so signed-off feel stays bit-identical. (v6.15)
- Box3.setFromObject never refreshes ancestors: call updateWorldMatrix(true, true) before measuring a child or a skin. (v9.2)
- Keep and extend the build's static checks over every chapter (syntax, use before declaration, undefined names, duplicate functions), because chapters are copied, not bundled; a lifted function must not read names it no longer sees, and an inner name must not shadow an outer one. (v6.11)
- Never append a comment onto a line of code in a targeted edit; it can swallow the code. (v19.5)
- Chapter and sheet text goes into the page as text (createElement), never as markup. (v13.2)
- A refusal must not be able to succeed: a lock is only ever said, never pressed. (v21.28)
- A run token cancels a callback, not the work that callback owed. (v21.1)
- three's slerpQuaternions copies its first quaternion into the target before blending. (v23.6)
- Never keep an Object3D (a parent, a mesh) in userData: a clone copies userData through JSON and throws on the circle.
  Keep it in a map. (v25.4)
- An option that appears after a walk must not race the order that ends it. (v24.9)
- build() runs before the hands' scene exists on a cold boot, and blockers must be in its array before it returns. (v24.0)
- collide() samples one point at 1.0 m, so furniture blockers are columns from the floor, a chair is boxed whole, blockers match what is drawn (the model's footprint), new pieces on walkable ground bring their own, and the spawn stays clear of padded blockers. (v5.03)
- Old saves keep loading after items or shapes change: unknown ids are dropped and old shapes fold in with nothing lost. (v14.6)
- Moving work to another core does not cool a phone; deleting the work does. (v15.0)
- The curtain covers the world until loads, the figure and the items are in and every texture, program and hidden geometry is warmed; a chapter declares its items and every model it loads. (v14.15)
- Go dark before a synchronous rebuild so no card freezes on screen. (v15.3)
- Chapter progress lives on its own key apart from the run, so nothing re-locks a reached chapter. (v5.12)
- Geometry consumers derive from one table, so one change moves them together. (v16.7)
- Hold a removed feature at zero rather than deleting it when many call sites use it. (v8.6)
- Price an addition's triangles as a real phone against the chapter's budget, and instance repeated props. (v8.9)
- Item views share one offscreen renderer, one GL context. (v14.6)
- LOD is chosen from the camera at the cut, so a cut never shows the last frame's level. (v24.22)
- Time spent with the tab hidden never counts as play and is never charged. (v21.23)
- The bag carries across chapters, so a chapter that must keep an item out of use declares it (torch.player: false) instead of relying on never issuing it. (v12.3)
- Words drawn into the world (signs, boards) are art, not sheet strings. (v14.5)

## Architecture (v4.1)

One source, two builds, built by `npm run build` (esbuild → `build.py` →
`wrap.py`):

- `src/main.js` — THE ENGINE (~10,400 lines since v14; ~3400 at v4.1): renderer, input, viewmodel
  hands, ghost system, audio, cutscene engine + its language, UI flow,
  sky, sanity, inventory. It owns everything every chapter shares and
  nothing that belongs to one.
- `src/chapters/*.js` — THE CHAPTERS (and, since v7.0, `src/chapters/e2/`
  and its siblings: one folder per episode, the key still the file's stem;
  build.py, textsync and chaptertest recurse; an episode-2 chapter's assets
  and sounds are HOSTED-ONLY — `E2_ONLY` and `SOUNDS_SINGLE` in build.py —
  so the single-file build stays episode 1's). Each is a plain script (no ESM —
  file:// tests and the CSP build both choke on module imports) wrapped in
  one closure, registering itself on `window.__CHAPTERS__`. A chapter
  carries its words, choices, stat deltas, teachings, stage positions,
  asset keys, and **three entry points**:
  - `build(ctx) -> stage` constructs its world and hands back the handle
    the engine drives it through (`pile.*`, `blockers`, `snap/restore/
    reset`, `updateNotes/updatePile/updateFire/updateSlow`, `dispose`).
    `ctx` is the engine's kit passed in — THREE, the scene, the texture
    library — so a chapter never imports anything.
  - `scenes[i](c, s, api)` — one cutscene per choice, written in the
    engine's cutscene language (`api`: the verbs from `A(c)` plus the cast
    a scene may direct, and `api.stage` for its own props).
  - `intro(c, s, api)` — OPTIONAL, added at v4.0. The chapter's opening
    FILM, in the same cutscene language, run against its own world BEFORE
    the chapter card: black, film, title, night. Chapters 2–5 have one,
    and since v6.4 so does chapter 1 (the prologue — docs/V6.4-PROLOGUE.md);
    a chapter without one, the fixture, takes exactly the path
    it always took. It begins on BLACK and stays there until its own
    `fade()` lifts it (v4.6: `playCineFn`'s `startFade`) — so a film opens
    on the dark it was written to open on, and `cinetest` checks it.
  - `src/chapters/chtest.js` is the FIXTURE chapter: primitives only, no
    location model, no assets. It is not part of the game — it exists so
    "the engine is chapter-agnostic" is a tested claim (`fixturetest`)
    rather than a hope.

**WHAT A CHAPTER OWNS, and the rule behind it.** Building chapter 2 found
eight places where "the engine" was really chapter 1's engine. Every one
was fixed the same way and the pattern is now the law here: **a chapter
declares it, chapter 1's current value is the default, so nothing moves.**
The declarations, all optional:

| field | what it decides | default |
|---|---|---|
| `episode` | which of the ten case files the chapter belongs to (v6.0); `id` is its place INSIDE that episode, 1–5, and the order of play is episode-major. The engine holds the shape (`EPISODE_COUNT` 10, `CHAPTERS_PER_EPISODE` 5); the words (`ep1.label`, `ep1.title` …) are the sheet's | 1 |
| `ghost` | her whole territory: `minDist`, `appearAt`, `near`/`far`, `cross`, `away`, `behind`, and the `roam` box she may stand in — or `null`, which switches the haunting OFF for the chapter (no appearances, no drain, no banner; cutscenes may still drive her mesh) | the void deck's numbers |
| `ambience` | `beds` (loops that just run) and `atShrine` (one keyed to distance from the shrine) | `amb` + the burner's `fire` |
| `words` | `approach`, `act`, `actTouch`, `interact`, `interactTouch` — the words that NAME the thing you act on | the string sheet's |
| `lines` | `near`, `close`, `nearAt` — the two proximity narration lines; since v5.30 also `act`, a line for the moment the DECISION OPENS (chapter 4's "Start from the beginning...", which used to be its `close` line and so fired on merely walking up to the chair) | — |
| `sayPrefix` | the prefix of the four lines under the outcome cards | `'v'` (→ `vA`..`vD`) |
| `voiceLine` | the line he says a few seconds into play — an asset key, or since v4.3 a pack sound's name | — (silence) |
| `noteArt` | the asset key of the chapter's note art | — (the drawn one) |
| `intro` | the opening film | — (straight to the card) |
| `daylight` | the sky, the fog, the three global lights — and since v4.3 the sun (`sun`), the cloud layer (`clouds`) and the viewmodel's own rig (`vmHemi`/`vmKey`), so a bright chapter lights the HANDS too | chapter 1's midnight |
| `torch` | v7.0: a spotlight on the camera (`on`, `angle`, `color`, `red`, `intensity`, `distance`), F or the HUD button — the play kit's one DATA declaration | — (no torch, no button) |
| `words.presence` | v7.0: the banner's words when a chapter with `ghost: null` drains through `kit.presence()` | `hud.presenceAlarm` |
| `stage.hotspots` | v7.0: many things to act on beside the pile — `[{ id, pos, radius, prompt, onInteract(), once, enabled() }]`, returned by build() | — (only the pile) |
| `stage.hotspots[].dwell` / `aim` | v11.0: a hotspot that fires by being LOOKED AT for `dwell` seconds inside `aim` radians (chapter 3's torch spots) — the eighteenth seam | — (a press only) |
| `stage.groundAt(x, z)` | v16.4: the height of the FLOOR under a point — the eye rides it when standing (eased; snapped on a teleport; a pose keeps its absolute height), collision samples 1.0 m above it, and no step rises more than 0.4 m, so a raised base is climbed only by its stairs. Episode 3 chapter 1's sala on its 1.1 m base; the fixture's platform proves it (`groundSeam`); walktest reads it — the twenty-first seam | — (0 everywhere) |
| `kit.pray(on, { secs, y })` | v16.5: the hands into añjali IN PLAY — episode 1 chapter 1 scene D's clasp lifted into the engine number for number (PRAYER_R/L, the half-palm gap, −0.235 / −0.375, setHandPrayer), eased on wall time, taken back by a scene's first frame and by kitReset; episode 3 chapter 1's blessing and Sak Yant — the twenty-second seam | — (the hands as they were) |
| `stage.hotspots[].hits(x, y)` | v14.7: a hotspot PRESSED BY A TAP (or an unlocked click) ON THE THING ITSELF — `hits` answers whether that screen point is on it, and the engine's `hotspotTap` fires it; episode 1 chapter 3's amulet on the auntie's table | — (the badge and the key only) |
| `stage.hotspots[].pressAim` | v21.9: a look-spot answered by a PRESS, never a timer (Chad: "I don't want this auto timer, instead the user either has to tap it, click it, or press E") — offered to E and the badge only while the reticle is inside its `aim`, the nearer of two overlapping cones winning; its mark is the press mark and the aimed one grows; a tap or unlocked click on its mark (or on the thing, `hits`), or a click under pointer lock, presses it. Episode 3 chapter 3's shop — the twenty-eighth seam | — (a dwell timer, or the nearest spot) |
| `kit.gallery(opts)` | v21.10: THE GALLERY — a window of PAGES, each a picture (asset keys drawn whole from their own bytes; a PNG that carries its own frame hangs as it is) and its words (name, second name, a plaque, LIVED / ERA / TEMPLE, KNOWN FOR, the story); turned by the arrows, the thumbnails, a swipe, the wheel and the keys — IN ORDER since v21.25: no page past the first unread one opens by any route, NEXT is always the next page and opens only once this page's story has been READ THROUGH (a cursor at `GAL_PACE` 22.5 words a second — 15 at v21.30, 10 before — that never passes what is on screen; the page counts at its end, never under 0.8 s, wall time), shown as a bar filling both Next buttons; one turn per `GAL_TURN` 0.5 s; back always works and the arrows stop at the first and last page (v21.26); each page's reading is kept for the session; the window ends only on the last page with every page read, by **Close gallery** — since v21.30 NOTHING closes it early (no X; Esc says why, and is Close gallery only at the very end). A screen state of its own (`gallery`), glow, rays and sparkles that never cross a picture, the chapter's sounds (`opts.sounds`). Answers a Promise `{ seenAll, seen, last }` (null if torn down); `opts.seen` reopens on the first unread page and an all-read reading opens done. Episode 3 chapter 3's old masters — the twenty-ninth seam | — |
| `kit.captions(list)` | v21.30: CAPTIONS — `[{ at, end, text, sub }]`, seconds from the call on WALL time (a voice plays on through frames a chapter clock never counts); each shown at the bottom of the screen between its times, `text` the line as it is said over `sub`, what it means, in italic; painted in play and scenes only (a panel hides it, its times run on under it); null clears it, kitReset clears it. Episode 3 chapter 3's chant, and since v21.31 episode 3 chapter 1's blessing, Itipiso and the Ajarn's homage — the thirtieth seam | — |
| event kind `steady` | v22.0: HOLD IT STILL — a mark drifts under a growing tremor and the player drags (a finger, or the mouse) to keep it inside a ring; graded on the share of the time it stayed in; the drag is the finger that began it, and may begin with the press on START; its own picture (`steady`); the pointer lock released while it runs. Episode 3 chapter 4's Yin locket — the thirty-first seam | — |
| `kit.tremble(k, { secs })` | v22.0: the hands shake by k, eased on wall time, added to the viewmodel's sway after it is written; bit-identical at 0; kitReset clears it. Episode 3 chapter 4 — the thirty-second seam | — |
| `kit.chill(k, { secs, cine })` / `kit.pulse(o)` / `kit.smear(k, { secs })` | v22.0: THE COLD — the edges of sight blurred and blue, the world dimmed and drained (chill); his heart taken over, its rate and rhythm heard, felt and drawn on the HUD's ECG (pulse); the picture lagging his eyes, the last drawn frame laid over this one (smear). Painted in play; a scene asks with `cine: true`; kitReset clears all three. Episode 3 chapter 4's Yin shop (no frost: Chad's call) — the thirty-third to thirty-fifth seams | — |
| event `low` / timed `waitWord`, `goWord`, `guard` | v22.0: an event whose brief and panel stand at the foot of the screen, the scene barely dimmed (so the Hanuman's face is never covered); a timed event's button says the chapter's words, and a press inside `guard` seconds of START is not a press. The timed kind's own picture is `wait` | — |
| a bed's fourth value | v22.0: `[name, vol, pan, rate]` — the loop's playback RATE (`loopRate`), so a cassette sags and runs down on its own source | — (1) |
| `stage.skyAt()` | v22.3: where the sky stands — `{x, z}`, or null for the origin. The engine moves its sky group there every frame, so a world built far from the origin has its gradient, sun, stars and clouds (the dome is a 150 m sphere drawn from inside; from 250 m out it is not drawn at all). Episode 3 chapter 4 centres it on him outside World Y — the thirty-sixth seam | — (the origin) |
| event kind `craft` | v23.0: HANDS-ON STEPS on a held prop, in order — a twist (the finger circling the prop's point; too fast spoils the care), a slide, taps, a hold, a flick — gentle, never graded or failed; the prop's point drawn where the step is done (`at`), its own picture (`twist`, `press`). Episode 3 chapter 5's drinks, lighter, sticks and music box — the thirty-seventh seam | — |
| event kind `yield` | v23.0: a ring that fills over `fill` seconds while anything is held, waits (or drains at `back`) when let go, and may fill by itself once begun (`auto`); never graded. Episode 3 chapter 5's three openings — the thirty-eighth seam | — |
| event kind `surface` | v23.0: COME BACK — a mark climbed up a gauge by a drag (or W / ↑ struck) against a slow sink and a PULL every 1.6–2.4 s; under its floor a slip costs a little sanity (never under `minSanity`); over its goal for `hold` seconds he is back; after `secs` the light comes down to him (it never soft-locks). Its own picture (`surface`). Episode 3 chapter 5 — the thirty-ninth seam | — |
| `kit.handPose(name, k, { secs, p })` / `kit.handPalm(side)` | v23.0: THE HANDS' POSES — a library of two-handed poses (a bottle steadied, a straw pinched, a lighter held up, a drink set down; hands on the hips, arms crossed, palms over the eyes, hands at the mouth), each hand from a BASIS in the lens's frame at a share of the frame at its own depth, eased on wall time from whatever the hands draw; `p` is the pose's own variable (the cap's angle, the fingers' gap); null or k 0 eases back to the exact walking rest; kitReset clears it. Episode 3 chapter 5 — the fortieth seam | — |
| `kit.film(key, { noSkip })` / `ctx.sealedBefore(key)` | v23.0: a film that cannot be skipped — no button, no key — the first time; `sealedBefore` answers whether a chapter has ever been completed. Episode 3 chapter 5's possessions and counter films, unskippable until the chapter has been sealed once — the forty-first seam | — (skippable) |
| `preview: true` | v23.0: a chapter REGISTERED but out of the run — never next, never reached, never a Continue, "In the works" in the selector, opened only by `?ch=` (which saves and unlocks nothing). Episode 3 chapter 5 was built and deployed as one for Chad to play (v22.6–v22.9) and released at v23.0 by taking it out — the forty-second seam | — (in the run) |
| a film step `eventWait(t, opts, done)` | v23.0: an event opened FROM INSIDE a film that stops the film's clock until it resolves (a wall in its clock: a slow frame never runs past it); voices cued before it play on through the pause. Episode 3 chapter 5's COME BACK | — |
| a film's `fade(t0, t1, from, to, color)` | v25.5: a FADE IN A COLOUR — the film's fade layer in any CSS colour (a white, for a flash) over the whole screen: the picture, the hands' pass and the vignette alike. The colour is the layer's only while such a fade stands above nothing; the black's again when it does not, when any plain fade is applied, and at every scene's start and end. Episode 4 chapter 2's clearing (the white as the light reaches him); the fixture's `flash` film proves it and that a plain fade is unchanged — the forty-third seam | — (black, as always) |
| event kind `breath` | v26.0: OPEN AND CLOSE — a level that rises while anything is held and falls when it is let go, in breaths: `breaths: [{ enough, edge, lead, pull, told }]` in seconds of holding (a band that is enough, an edge beyond it, a breath that pulls), `gain`/`gainStat` paid on the spot for a breath closed in its band, `cost`/`costStat` through evCut for one held to its edge; `onLevel`, `onEnough`, `onBreath(report)` (a number answered is the seconds before the next breath is live), `onIdle`; its ring drawn at `at: { sx, sy }`; held by a finger anywhere, the mouse, E or Space; its own picture (`breath`). It answers `{ ok, score, closed, held, unopened, breaths }`. Nothing in it tests a finger's speed. Episode 4 chapter 3's first teaching, and the one breath inside its close (`eventWait`) — the forty-sixth seam (the forty-fourth is chapter 1's `change`, the forty-fifth its rain) | — |
| event kind `gate` | v26.3: OPEN AND CLOSE BY HAND (Chad, 13 Nov 2026, the breath "hard to play"; his pick of four: "Drag a glowing gate open with one finger: soft lights of presences drift in toward you. Drag it shut when you feel it is enough, before they crowd you") — the breath's bookkeeping (its breaths, bands, prices, reports, callbacks and answer) under a gate the hand drives: a drag UP opens it and a drag DOWN shuts it by the drag's own length (a third of the screen from shut to wide), W, ↑, E or Space held opens it, S or ↓ shuts it, and it stays wherever it is left; `gk` how far it stands open; the lights come in at gk / edge a second (the band and the edge in seconds wide open); shut with the level in the band 'closed', the level at the edge 'held' (it swings shut FOR him), shut under the band 'unopened' (taken once more); a breath with `pull` creeps open by itself once in the band and is heavier to shut; `onLevel(k, held, i, state, gk)`; drawn at `at`; its own picture (`gate`). Episode 4 chapter 3's first teaching and its close's one breath; the breath kind is kept, still proven — the forty-ninth seam | — |
| `kit.lens(fov, { secs })` | v26.0: the PLAY lens eased on wall time to a chapter's angle and back (`null`); a scene and kitReset give it back. Episode 4 chapter 3's pull and its breaths — the forty-seventh seam | — (the game's 72°) |
| `kit.hush(k, { secs, hz })` | v26.0: the world's sound CLOSING DOWN — a low-pass laid over the background bus by k, eased on wall time (voices are not on that bus and stay clear); kitReset clears it. Episode 4 chapter 3's pull, and ending D — the forty-eighth seam | — (open) |
| `kit.unlock(id, { onClose })` | v14.7: the ITEM UNLOCKED splash — the item's model turning in the middle (the `iv` renderer), its name, a Close button, its own sting; a screen state of its own (`unlock`) that closes every "is it play?" gate, with a 0.6 s guard so the press that took the item cannot also close it | — |
| `kit.choose(ids, opts)` | v17.6: CHOOSE ONE — a centred window, one card per item (drawing, name, rarity, `item.<id>.power`, words), Confirm after a pick; answers a Promise of the id and gives nothing itself. Its own screen state (`choose`); episode 3 chapter 1's Sak Yant — the twenty-third seam | — |
| `kit.hands(k, { secs })` | v18.0: the hands lifted out of añjali into a Thai gesture by k, the body swaying with them, eased on wall time; episode 3 chapter 2 — the twenty-fourth seam | — (the hands as they were) |
| event kind `resist` | v18.0 (a draining bar since v19.4): a RAPID-TAP fight — full when it appears, empty in `empty` seconds untapped, every tap refills it at the hold `rate`; lost on the frame it empties; episode 3 chapter 2 — the twenty-fifth seam | — |
| `films` / `kit.film(key, { onDone })` | v21.0: a CUTSCENE FROM PLAY — a chapter declares `films: { key: fn }` in the cutscene language; `kit.film(key)` plays one from play (refused outside play or undeclared), warms its cues, aborts a live event, and hands back to PLAY where it ends, its black handed to the kit's fade; `onDone({ skipped })` — an OBJECT, never a phase (LEARNINGS). Episode 3 chapter 3's trance and roar — the twenty-sixth seam | — |
| `kit.hold(obj, { clasp, lift, ahead })` | v21.0: a thing IN HIS HAND in play — on the right arm, drawn in the hands' pass; `clasp` puts it at the middle of the prayer clasp; `null` lets go (only from his hand); a scene and kitReset let go. Episode 3 chapter 3's joss sticks — the twenty-seventh seam | — |
| `ITEM_DEFS[id].drainGuard` / `shockGuard` / `fixed` | v17.6: a worn item slows every sanity DRAIN, or cuts every sudden non-minigame sanity hit, by that fraction; `fixed` keeps a worn item in its box (a Sak Yant) | — |
| `ITEM_DEFS[id].evGuard` | v14.13: while the item is WORN, every stat decrease a MINIGAME causes is multiplied by `1 − evGuard` (`evCut()`: graded presses, missed beats, wrong drops, a losing payout, and a chapter's own price marked `{ minigame: true }` on `kit.award`/`kit.conduct`) — the LP Tim Khun Paen's 50 % | — (0: nothing is cut) |
| `items` | v14.15: the item ids the chapter can hand out with `kit.give` — the entry curtain prepares their models (and the next chapter's download ahead fetches them) so an item never loads in the middle of play. `chaptertest` fails a literal `kit.give('x')` that is not declared | — (none) |
| `kit.weaponBlock(msg)` | v14.3: a chapter FORBIDS the shot and the HUD says why — `weaponFire` refuses before anything is spent, `#nofire` carries the chapter's own sentence under the reticle with `hudfail` and a buzz, and `body.wpnBlocked` dims FIRE before the rule is ever tested. `null` allows it again. The words are the CHAPTER's, so they are on the sheet | — (nothing is forbidden) |
| `torch.model` / `torch.click` | v11.1: the torch's own viewmodel (an asset key), swapped for the hand while it is on, and the sound its switch makes | — (the hand stays; a UI click) |
| `weapon` | v12.0: RIFLE MODE — `{ model, item, rounds, mags, fireGap, kick, shot, reload, empty, clips, rates }`. The model's OWN hands replace the hand and the torch while it is out (out = the `item` is in the hand slot, or `kit.weaponOut(bool)` forces it); FIRE (click under lock, Space, the HUD button) spends a round, flashes, kicks, and RAYCASTS from the lens into `stage.shootables()`, reporting to `stage.onShot(report)`; RELOAD (R, the button) costs a magazine; rounds and magazines ride the save | — (no weapon, no HUD) |

**THE PLAY KIT (v7.0)** is everything else a chapter may ask of the engine
between its film and its decision — objectives, a timer, a waypoint,
reaction EVENTS of eight kinds, presence, conduct on the card, lying down,
daylight tweened in play, a timed decision, a saved phase — reached as
`ctx.kit` in build() and `api.kit` in a scene, every verb optional and
absent from chapters 1–5. docs/V7.0-PLAY-KIT.md is the reference; the
fixture chapter declares all of it and `fixturetest` proves it. The rule
the code is shaped by: a verb mutates kit state, the FRAME touches the DOM,
so a chapter may call the kit from inside build() before the HUD exists.

**EVERY MINIGAME SHOWS HOW IT IS PLAYED** (Chad's standing rule, v18.2: "The
minigame window must have animations under the title to illustrate how it is
played ... This must always be a rule."). A briefed event's window always
carries a looping picture under its title: the chapter may name one (`demo:`
— `drag`, `bar`, `beat`, `rapid`, `look`, drawn by `#evDemo` in shell.html)
and the engine falls back to its kind's own (`EV_DEMO`). A NEW KIND OF
MINIGAME is not done until it has its own picture: a row in `EV_DEMO`, and a
new class in shell.html if none of the five shows it — `chaptertest` fails a
kind with no row and a picture shell.html does not draw.

**NO GENERATED BLOCK FIGURES, ANYWHERE** (Chad's standing rule, v21.16: "You
should never ever use those generated fake block figures in any part of the
game. They ruin the entire look of the game. All your generated block figures
must all be replaced by real 3d model characters."). A person in this game — a
passenger behind a bus window, a face in a far crowd, a sitter at a kopitiam, a
figure in a film, his own legs under the lens — is one of the real character
models the game already ships (cloned, posed, baked to a still if it never moves,
cut to the part the shot needs, recoloured), never boxes, spheres, cylinders or
capsules arranged as a body, and never a body painted onto a canvas to stand for
one. The same holds for a FIGURE of any kind — a statue, a deity, a giant, an
effigy: the scan or nothing. A placeholder that stands until a model lands is
INVISIBLE from its first frame (kept only as a proxy for a collider, a tap or a
scene's handle, never a shape on screen), so a failed download costs a person,
never shows a block one; a person who cannot be a real model is left out, not
drawn. A thing that is itself a picture of a figure in the world — a range's
Figure 11 target board, a poster, a photograph — is a prop, not a person. v21.16
applied it to all thirteen chapters (docs/V21.16-NO-BLOCK-FIGURES.md).

**NO PRACTICE AND NO PRACTITIONER IS EVER THE VILLAIN** (Chad's standing rule,
v21.30: "the taoist medium should not react so aggressively and ask customers to
get out even if the customer dont agree with the medium, this is absolutely wrong
from a spiritual educational perspective ... The point was never to paint any
religion or practice in a bad light."). Every tradition in this game — Thai
Buddhist, Taoist, Chinese folk, any other — and everyone who practises one is
shown sincere, competent within their own training, kind to the people who come
to them, and gracious when someone disagrees. A choice's consequence comes from
the PLAYER's own act and attitude (what he accepted, refused, provoked or never
asked), never from a practitioner turning hostile, mocking, greedy or cruel, and
nobody is shown the door for disagreeing. Where Master Z's lesson is that a
reading can be wrong, it is said as "each reads through their own training",
never as "this one is a fraud". Read every line of a scene for this before it is
voiced. (v21.0 broke it: ending B of episode 3 chapter 3 had the medium go cold
and his assistant throw the young man out — docs/V21.30-PLAN.md §1.)

**AN OUTCOME SCENE IS A WHOLE STORY** (Chad, v21.30: "All the outcome cutscenes
are too simple, short, some have awkward silence or gaps where nothing is said,
there is no proper narrative for each"). Each ending tells what he does, how it
is answered, what it costs or gives him, and what he understands — the whole way
through. No stretch passes in silence: a walk is spoken over, a pause is held by
a sound with a reason. Four options are four different KINDS of answer, each with
its own scene — two options that differ only in what he is thinking are one scene
twice. An ending is read as a story before it is built and its silences are
measured after; a review that checks only frames, collisions and overlapping
voices has not reviewed it.

**A GENERATED MODEL BEGINS AS A CHECKED PICTURE, AND A SACRED ONE AS REAL
PHOTOGRAPHS** (Chad, 30 Oct 2026: "you should not use Meshy text to model
directly, the results will be very bad. You should first generate a reference
image using GPTimage, or using Higgsfield image generation using the best
GPTimage model to generate a clean reference image against a white background
first, then check the reference image first, then using that reference image to
generate the 3d models on Meshy, using the best quality settings." — and that
evening, of a Phra Rahu made from a description: "your rahu dont even look like
the real thing. When you generate such statues or even amulets, you must always
research real images first and base it off real image references."). A model
this game generates is never text-to-3D: a reference picture on white first
(Higgsfield's GPT Image at its best quality), LOOKED AT, then Meshy's
image-to-3D at its best settings and its remesh (masters/v24.19/make.sh). A
STATUE, AN IMAGE OR AN AMULET — anything a believer would recognise — begins one
step earlier: photographs of the real thing are found and studied (the temple's
own, a museum's, a collector's), they go in as the reference picture's image
references, and the picture is checked against them before anything is
modelled. A deity drawn from a description is a guess wearing a sacred name —
the lesson line's Pali stamp (v11.10) in bronze. And an INVENTORY PICTURE is
painted in the style of Chad's own (`icontorch`, `iconamulet`): a near-black,
grungy, scratched tile with a worn darker edge, the object large, photo-real and
lit hard from the upper left; his two icons go in as the style references beside
the object's own render (Chad: "your icon styles dont even look like my torch
icons").

`shrine` is the engine's anchor for HER, not for the chapter's warm light.
Chapter 1's happens to be both; chapter 2's is the gap beside the bed and
its altar is a separate thing on the other wall. Getting that wrong made
the safest object in the room the source of the haunting.
- Advancing a chapter is `rebuildStage(next)` — `dispose()` then
  `build()`, never a page reload, which would re-pay the GLB parse, the
  shader compile and the whole audio decode. `leaktest` is what keeps
  that honest.
- `assetBytes(name)` in main.js is the asset seam: hosted mode fetches
  fingerprinted URLs from `__ASSET_MAP_B64__`; embedded mode returns
  inline base64. `HOSTED` = the map is non-empty. Loaders never know
  which build they are in.
- **Outputs**: `dist/` (Netlify: real doctype document, preloads, engine
  + chapter + assets all content-hashed under `assets/` — since v15.2 the
  fonts too, `assets/fonts/`, one stylesheet per class of browser picked by
  an inline selector, Google's link for any other; re-take them with
  `node tools/fontsnap.mjs` if shell.html's font link ever changes, which
  the build asserts — `_headers` with
  year-long immutable caching, only `index.html` revalidates) zipped as
  `masterz-encounters-vN.N.zip`; and `hellnote.html` (everything inlined
  — built for the retired claude.ai preview, kept because it is the
  anywhere-fallback) mirrored to `wrapped.html`, which csptest loads;
  since v3.4 the other harnesses load `dist/` over testlib's server.
- Version lives at the top of `build.py` (`VERSION`)— bump it each release.

Deliberately still in the engine, and correctly so: the ghost (she is the
game's, not chapter 1's), the faint sequence, the cutscene *language*, and
the sky. A chapter owns its location, its props and its four scenes —
nothing else.

**The tenth leak, also v4.1**: the SKY was chapter 1's sky. Chapter 3 is a
ceremony in a car park and those happen in the MORNING (Chad's call), so a
chapter now declares `daylight` — the dome's gradient, the background, the
fog, the hemisphere, the key light and its direction, the fill, and the
opacity of the stars and the moon. `applyDaylight()` MUTATES them in place
beside `applyGhostTerritory()`; chapters 1 and 2 declare nothing and stay at
midnight. It is worth saying why the change is good rather than merely
asked-for: chapters 1 and 2 hide her in the dark because that is what dark
is for, and there is nowhere to hide at ten in the morning. (Where she is
in that daylight changed again at v4.3 — see below.)

**The ninth leak, found at v4.1**: a cutscene may now hold a chapter's own
ambience loops down, through `api.duck(name, k)`. Chapters 1 and 2 run room
tones and a room tone never stops; chapter 3 runs a ceremony, and its
opening film is built on the moment the drum does. A scene cannot call
`loopVol()` directly — the ambient frame re-asserts every declared volume
every frame — so this is a multiplier that frame respects, cleared at both
ends of every cutscene. Chapters 1 and 2 are untouched: `duckOf()` returns
1 unless a scene says otherwise.

**THE FIGURE IN THE EQUIPMENT PANEL IS KEYED TO THE EPISODE** (Chad's
rule, v5.29 — "take note of this entire context in memory, remember it
well"). The rotating Master Zav in the inventory is the man the player is
*becoming*, so his AGE tracks the story:

| episode | chapters | figure | asset |
|---|---|---|---|
| 1 | ch1-ch5 | young | `zavyoung` — shipping now |
| 2 | ch1-ch5 | soldier | `zavsoldier` — shipping since v14.12 (Chad's model, in place of the teenager first planned; hosted-only) |
| later | the adult phase | adult | `zav`, the 990k-tri scan |

`ZAV_FIGURE` in main.js is that table and `zavKey()` reads it; the adult
scan and every number that shaped it (v5.08-v5.11: the meshopt pack, the
no-mipmap rule for his atlas, the seam padding) is **kept, not deleted** —
it returns when the adult phase does, and `ZAV_ADULT` is the fallback for
any episode not listed. Since v6.0 it is keyed by EPISODE (`episodeOf()`),
because the engine knows what an episode is now; episode 2 is one row
(`2: 'zavsoldier'` since v14.12). Swapping ages is a real
swap — `zavLoad()` disposes the standing figure when `zav.key` no longer
matches.

## Testing

24 harnesses, listed in `runtests.mjs` with one-line purposes and a
group tag (`node runtests.mjs @engine` / `@release` / `@chapter`).
**The rule that stops the suite growing with the game: adding a chapter
must not add a harness — and neither must adding an episode (v6.0).** Per-chapter correctness is one data-driven
file, `chaptertest.mjs` — keys resolve, deltas are in scale, the stage is
inside its own bounds, every asset key exists in build.py, every choice
has a scene — and it runs in plain Node in under a second, no browser.
`fixturetest.mjs` proves the engine plays a chapter it has never seen,
and `leaktest.mjs` proves a chapter gives the GPU back what it took.
All use `testlib.mjs` (portable browser launch
+ repo-relative paths). Since v3.4 `testlib.PAGE` serves `dist/` over a
local HTTP server, so the suite drives the HOSTED build — the one
players load — and needs `npm run build` first, same as before. The one
deliberate exception is `csptest.mjs`, which serves `wrapped.html`
itself under the strict no-blob/no-data CSP that shaped the hand-parsed
loaders. **Since v6.4 pressing Start is a FILM** (chapter 1's prologue),
so every harness that presses Start reaches play through testlib's
`toPlay` — wait for the film or play, skip the film, wait for play — and
the harnesses that test a film wait for `cine` themselves. A harness that
waits for `play` straight after Start will time out, not fail wrong.
loaders. On a real machine set `REAL_GPU=1` for much faster runs; in a
GPU-less container SwiftShader runs ~1 fps — trust state polls, never
stopwatches. Full suite in batches if the shell has a time cap.
Debug/screenshot one-offs are gitignored by design — write them freely,
they die with the session.

## Live targets

- **Netlify (the real site)**: project `masterz-encounters-game`
  (id 4133ded1-c901-49ac-8a93-0cfd34128e06) →
  masterz-encounters-game.netlify.app. Deploy = the dist zip on the
  site's Deploys page, or the Netlify MCP `deploy-site` npx command —
  **run from INSIDE `dist/`, never the repo root**: the uploader ships
  its cwd verbatim, and from the root it publishes the repo (no index at
  /, site down — it happened at v4.3, LEARNINGS has the write-up).
  Byte-verify against dist/ after every deploy: `python3 tools/byteverify.py dist`
  (every served file fetched and compared; `_headers` is Netlify's config and is
  never served). **Since v24.20 the deploy is `tools/netlifydeploy.py`** (Chad: "You
  need to find a way since obviously the size will one day go way past this" — the
  MCP's zip upload is refused once the unpacked site passes ~600 MiB, and v24.20's
  did): get a fresh proxy URL from the Netlify MCP's deploy-site (a 30-minute
  credential — pass it as an argument, never write it to a file), then from the repo
  root `python3 -I tools/netlifydeploy.py dist "<proxyUrl>"
  4133ded1-c901-49ac-8a93-0cfd34128e06`. The zip carries only what the live site does
  not already serve byte for byte (index.html, _headers, every new or changed file);
  Netlify's build lays the rest back from the live deploy, every file checked against
  its sha1, and the build FAILS — nothing published — on one mismatch. Then the tool
  fetches every served file from the live site and compares it with dist/, and checks
  the cache headers are in force; it exits non-zero unless all of it holds (Chad: "the
  final deployed site is always perfect and identical to the latest build you
  built"). In a fresh container: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci
  --ignore-scripts`, and `CHROMIUM_PATH=/opt/pw-browsers/chromium` for every
  harness and probe when testlib's built-in browser path is absent.
  **His `chadsor` project is his personal resume site — NEVER touch it.**
- **Retired: the claude.ai preview artifact** (Chad's call, 30 Aug
  2026 — the game is fully on Netlify). Do NOT republish it as part of
  a release. The old link still holds its version history up to v3.3 if
  it is ever wanted:
  https://claude.ai/code/artifact/21317842-7db2-4d6a-95a4-eef816d9e68a
- He may later point `game.triplegem.asia` at the Netlify site.

## Audio pipeline

Voice/music/SFX come from ElevenLabs (his account, connector or manual).
Full-fidelity spec (Chad's call, v2.3 — replaces the old mono/low-bitrate
one): keep each source's native channel layout (stereo stays stereo),
44.1 kHz, 128 kbps for generated sounds; the explore music keeps its
original bytes untouched. Always strip metadata (`ffmpeg -map_metadata
-1`). The 16 MB ceiling on the embedded build was the preview
artifact's and no longer applies; the hosted build streams assets
separately, so audio budget is now a download-time judgement, not a hard
cap. All playback through
the shared Web Audio context — never `<audio src=data:>` — and everything
obeys the one mute button. Since v2.3 the game runs a full generated
soundscape: 95 sounds + the James opening line — loops, UI cues, ghost vocalisations,
cutscene stings, ending music beds, and in-world narration lines. Four
speakers now: the boy (**Aaron, `B6uUx2p7cRgxseOUyP6P` — since v5.28**,
Chad's third pick for the part after VALF, v5.15, drifted between a girl
and a grown man across takes and River, v5.18, never satisfied him; the
registry still calls him `james` and the files `v*`, because renaming
eighty-two keys buys nothing), chapter
2's Mother (Matilda, `XrExE9yKIg1WjnnlVkGX`), chapter
3's auntie (Alice, `Xb7hH8MSUJpSbSDYk0k2`) and the tang-ki (Bill,
`pqHfZKP75CvOlQylNhV4`) — all eleven_v3. The workspace has no Southeast
Asian voice at all; what those two were actually chosen for is that they do
not sound like each other. The procedural stings in main.js remain only as
the decode-time fallback. docs/AUDIO-PLAN.md has the full inventory, cue map
and generation flow IDs; the v3.7 cutscene pass is in docs/V3.7-PLAN.md and
chapter 3's twenty-three sounds are in docs/V4.1-CHAPTER3-PLAN.md.

**HOW THE SOUND REACHES THE PLAYER, since v4.2** (Chad's question: "it
shouldnt grow like that as a single download right?" — he was right).
There is no longer ONE pack. There is a shared pack plus one per chapter,
and `build.py` COMPUTES the split rather than any chapter declaring it:
**a sound is a chapter's when exactly one chapter can ask for it and the
engine never does; everything else is shared.** The bias to shared is
deliberate and asymmetric — a sound wrongly left shared costs a few KB, a
sound wrongly moved out of it is a cue that plays nothing with no error.
Shared and the booting chapter's load at boot, `setChapter()` loads a new
chapter's, and `startDecision()` fetches the NEXT chapter's, which is late
enough that a player who never finishes chapter 1 never pays for chapter 2
and early enough that a cutscene, a card and a rank screen cover the
download. `sndBuf()` never changed: packs `Object.assign` into the same
`packJson`.

And there are TWO ENCODINGS of every sound. The mp3s are exactly the bytes
that always shipped and must stay untouched — they are the proven fallback.
Beside them, `assets/audio-opus/` holds the same 95 at 96 kbps stereo /
64 kbps mono: 4.5 MB against 6.9, encoded from the surviving ElevenLabs
MASTERS, so it is a FIRST-generation copy where the mp3 is a second, and
measurably closer to the master than the file now live. Stereo stays stereo
(the 48 spoken lines were always mono — that is what one voice is). The one
contract term that moved is sample rate: Opus is 48 kHz only, which
discards nothing, since Web Audio resamples every buffer anyway. **AAC is
disqualified, not overlooked** — it is smaller still, but Playwright's
Chromium cannot decode it (the same missing proprietary codecs that gave
the title video a VP9 encode), so the suite could never defend it. And the
codec is never GUESSED: a 179-byte Opus file is DECODED through an
`OfflineAudioContext` before anything is fetched, and only a browser that
really produced an AudioBuffer from it gets the Opus packs. Guessing wrong
is not a bigger download, it is a game with no sound at all.
Chapter 1's sound download: 6830 KB -> 3864 KB, and chapter 4 adds nothing
to it. Full reasoning, the measurements and the traps:
docs/V4.2-AUDIO-DELIVERY.md.

**eleven_v3 fails about one line in three, at random.** Seven of sixteen
failed on the first run at v4.1 and every one succeeded on a plain re-run
with the text unchanged. Do not rewrite a line that failed — check
`has_failures`, re-run, repeat. (The v4.0 note blaming line length and
punctuation was wrong; LEARNINGS carries the correction.)

**A MASTER'S TITLE IS SPOKEN IN FULL** (Chad, v21.8: "the voicelines that
refer to lp tim literally says lp. The voicelines should say luang phu tim,
and not literally lp. This applies to both the store owner voiceline, and the
player voiceline. Always remember this."). A take never reads an abbreviated
honorific as letters: the script says "Luang Phu Tim", "Luang Phor", "Ajahn"
in full, for every speaker. On-screen text may keep the printed form ("LP Tim
Khun Paen" is how the amulet is named on a card); the rule is about what is
SAID. Check a new line's script for "LP" before generating it — and
`chaptertest` fails any registry row whose words carry "LP" or "L.P." (it
catches exactly v21.7's two, `z3look2` and `ow3gift1`, and nothing else).

A cutscene reaches sound through `sfx(at, kind, vol)` and nothing else.
`kind` is a row in `STING_SAMPLE` in main.js — that table IS the
vocabulary a scene has, so giving a chapter a new noise means adding a
row there, not reaching past the seam. `STING_SYNTH` names the handful
of kinds the procedural fallback can fake; every other kind is
sample-only and simply stays silent if its buffer has not decoded, which
is why `startDecision()` warms the whole cutscene set. `chaptertest`
fails the build if any chapter's cue names a kind that does not exist or
a sample with no file — a mistyped cue is silent with no error, and that
is not a bug a screenshot can catch.

## Changing the words

Every string in the game is editable from ONE Google Sheet — Chad edits it
on his phone, and `node textsync.mjs import <sheet>` applies the lot in one
pass. UI words live in `src/strings.js` (reaching the screen through
`data-t` attributes in `shell.html` and `T()` in code); the chapter's own
words stay in the chapter file. An empty cell removes that text. Full
workflow, guarantees and the sheet id: `docs/EDITING-TEXT.md`. **Never
hand-edit a string without re-exporting the sheet afterwards**, or his copy
of the text goes stale.
**And ALWAYS HAND HIM THE LINK** (Chad's rule, v5.23: "always give me the
latest sheet link"). A sheet he cannot find is a sheet he cannot edit, and
he works from his phone where a bare version number is useless — so every
time a new sheet is published, the full
`https://docs.google.com/spreadsheets/d/<id>/edit` URL goes in the reply
that reports the release, not just "sheet v26". If a session ends without
publishing a new one, give him the current one's link anyway when the text
comes up.
Since v5.14 the sheet carries the VOICE LINES too, made from
`src/voicelines.js` — every spoken take, who says it, where it plays, its
words and its measured length — and **every sheet version must carry
them** (Chad's rule). Since v6.1 the Google Sheet is TABBED — UI TEXT, one
EPISODE N tab per episode that has a chapter, VOICE LINES — made from the
.xlsx `textsync export` writes, which the Drive connector carries as
base64 and Drive converts into a native sheet (v5.14 wrote that down as
impossible; it had never been tried), and `tools/verifytabs.py` diffs
every cell of the read-back against the workbook before the link goes to
him. `import` reads every shape and names every voice line whose text changed,
which is the list of takes to regenerate. A new line in a chapter is not
done until it has a row there — `chaptertest` says so.

## Content ground truth

`docs/SOURCE-NOTES.md` + `docs/source/` hold the studied originals: all
43 site case files and the 2D trial game (15 chapters, every choice,
score and teaching). **Read them before writing chapter content — the
material is already written in Master Z's voice.** Chapter 1's current
choices are placeholders; the real "THE OFFERINGS" data is in
`docs/source/trial-game-chapters.md` waiting to be swapped in. The trial's
scoring model (only wisdom decides passing; sanity is a cost, not a fail
state) differs from ours — a deliberate divergence to revisit with Chad.
Attributions must stay in the credits panel; he adds more as they come.

**THE LESSON LINE (Chad, v11.9 — "why is it that i can think of a better
lesson than you quickly").** A chapter's `core` is held to a test, not a
taste. (1) The case file's own lesson comes FIRST — the site already says
what this story teaches, in Master Z's voice; start from it verbatim.
(2) A dhamma term or sutta may be added only when it NAMES THE STRUCTURE
of what the player just did or felt in that chapter (v11.9: the weight is
vedanā, the fear built on it is saṅkhāra, and the four options are which
of the two you act on). A story that merely resembles the setting is an
analogy, and an analogy never fits as tightly as an analysis — the
Bhaya-bherava Sutta was picked at v11.6 because "fear, forest, night"
matched the scene, and it was wrong. (3) If the line would be equally true
of any scary night, it is too generic. (4) Breadth is the trap: with many
plausible candidates, the famous one gets picked because there is no
standard to select against — so PROPOSE two or three with the reason each
fits, and let Chad pick, before anything ships. Words are cheap to propose
and expensive to redeploy.
(5) **THE TERM COMES FROM CHAD** (v11.10, after four proposed tags for
episode 1 — refuge for a boy calling his mother, the good friend, faith
with a reason, dependent origination for a note that followed him home —
were each "logically irrelevant and a stretch"). A Pali term has a precise
referent: refuge is the Triple Gem, the good friend is a teacher on the
path, dependent origination is how suffering arises. Matching a scene's
SURFACE to a term's English gloss is a pun, and a wrong tag in this game is
wrong teaching with a Pali stamp on it — worse than no tag. So: describe
the beat's structure in plain words, and Chad names the term or says there
is none; the line is written around HIS term (vedanā/saṅkhāra at v11.9 is
the shape that worked). Episode 1's lines stay in Master Z's own voice with
no invented tag — the precept under chapter 1 is the act itself and stays;
Chad removed the Pali from chapters 2 and 3 himself at v5.15 and that was
the standard, not a gap.

## Current state and roadmap

**v6.17 is the reference standard for the base game, with EPISODE 1
COMPLETE** (Chad's call, 8 Sep 2026: "good enough as the base game
reference with a complete episode 1" — it supersedes v3.3, which was the
bar while the episode was being built). Everything below it is settled:
all five chapters play end to end and the engine's feel — how she behaves, how she sounds, how the
cards perform, how the equipment screen works — is the bar new chapters
are held to, not a thing to be renegotiated while building them. Treat
a change that alters base-game feel as its own decision to put to Chad,
separately from the chapter work that prompted it.

What the baseline contains, release by release — every entry from v2.1 to the latest, word for word — is
**docs/HISTORY.md** (moved out of this file on 31 Oct 2026, after v24.23, Chad's call: the diary was 89 % of it, about 99,000 of its
111,000 words). Every standing rule those entries carried is in **Chad's standing rules** above. Before changing a
chapter or a system, search the history for its key or its name and read those entries: it is the build memory, and
most of what looks strange in the code is explained there (docs/LEARNINGS.md has the laws).

The anchors for that baseline: tag `v6.17` (local only — tags do not
push from these sessions), commit `55b059f` (its message begins with the
version, so it is findable on GitHub), the v6.17 Netlify deploy
(`6a9fc206c7c1970813c5ca3c`), and the 23 harnesses — which are what
actually *enforce* the standard. The earlier anchor, `v3.3` / `c8abf61`,
stands in the bundle Chad holds. An episode-2 change that reddens a
base-game harness is a regression in the reference build, not a test
that needs relaxing. Episode 2's plan is `docs/V7.0-EPISODE2-PLAN.md`
(APPROVED 9 Sep 2026; v7.0 is its first release, the engine kit; v7.1 is
its first CHAPTER, The Worst Bed — chapter 1 needs no rifle, so it shipped
before rifle mode, and the plan's numbers shift down by one from there:
rifle mode next, then chapters 2–5, one release each).

Deferred by explicit choice: ghost mesh compression (1.6 MB, the
biggest download win, but it touches the fragile `rescueTextures` GLB
parsing — visual verification required), service worker/offline,
canvas-resolution and backdrop-blur thermal options. Retiring the
preview artifact removed the 16 MB cap that was making compression
urgent, so it is now a plain download-speed improvement to schedule when
convenient, not a blocker on new assets.

**The scaling foundation is DONE** (v3.4 + v3.5 — Chad's call to do all
of it now rather than alongside chapter 2). `docs/SCALING-FOUNDATION.md`
holds the reasoning and `docs/V3.5-PLAN.md` the execution. What is now
true, and must stay true:
- a run is plain JSON (`worldState`/`applyState`) and **autosaves while
  you play** — Chad's call at v3.6. Continue is the default action on the
  title screen; New game is always reachable and always asks first. Only
  `state === 'play'` is ever saved, so nothing restores into a half-open
  decision or a cutscene, and fainting rewrites the save to the START of
  the chapter rather than three seconds before the faint;
- `?ch=<key>` selects any registered chapter, unknown keys fall back;
- the playing chapter is not fixed: `setChapter(key)` swaps it (resume
  into another chapter, and the advance path when one is sealed). The
  chapter-derived values are MUTATED in place, never reassigned —
  `OFFER_POS` aliases SHRINE and closures captured BOUNDS;
- a chapter owns its world and its scenes behind `build(ctx)`/`scenes[]`,
  and advancing is `rebuildStage()` in place, never a page reload;
- only the shared assets and the booting chapter's own are preloaded;
- **adding a chapter must not add a harness.**

**Chapters 2 and 3 are built** (v4.0, v4.1) — THE PRESENCE and THE
GATHERING, from the trial game's own episode 1. Every choice, ranking and
teaching is Master Z's verbatim; only the delta magnitudes are rescaled
from the trial's ±12 to this game's ±30, by the same factor in both, so one
rank formula serves all three chapters. `docs/V4-CHAPTER2-PLAN.md` and
`docs/V4.1-CHAPTER3-PLAN.md` are those builds' memory — read the right one
before touching either chapter.

**The three chapters escalate on one axis, deliberately.** Chapter 1's
terror is DISTANCE (she is over there, and then she is closer). Chapter 2's
is SMALLNESS (a room you cross in four steps, and nowhere in it to go).
Chapter 3's, since v4.3, is INVERSION: the chapter has NO haunting at all
(`ghost: null` — Chad's call). The focus is the medium event itself — a man
at the altar who has stopped being himself, a constant ceremony, one empty
chair turned to face the car park — and she appears exactly once, in the
opening film, standing far out on the open tarmac in full sun, facing the
tent, NOT COMING IN. The thing that has hunted the player for two chapters
is afraid of this place; the player spends the chapter inside the one
ground she cannot follow them onto, knowing home is on the other side of
her. That is chapter 4 loaded by a single shot. No ghost sound is cued
anywhere in the chapter — not even `strings`, which is, in practice, her
leitmotif. A change that blunts one of those axes is a change to the
chapter's whole reason for existing.

**Chapter 4 is built** (v4.9, revised v4.91) — BACK HOME, from the
trial's episode 1: she followed him home, and the flat with its
lights on is not the refuge the word "home" promises. Since v4.91 the
intrusion is NEVER SEEN (Chad's call): no ghost mesh, no `strings`,
only the flat misbehaving — footsteps, a dipped light, a moved chair —
on a poltergeist clock. The chapter closes on Ma's phone promise — the
tang-ki comes to the house tomorrow.

**Chapter 5 is built** (v5.0) — THE LESSON, and with it the trial's
EPISODE 1 IS COMPLETE. The five chapters escalate DISTANCE → SMALLNESS →
INVERSION → INTRUSION → RELEASE: the tang-ki keeps Ma's promise, finds
the note under the thinking chair, teaches at the table, and returns
what was kept to the fire. The haunting is answered, not fought — the
fifth chapter has no scare that is not the player's own memory replayed
and released. `nextChapterKey()` past ch5 is null, so sealing it ends
the run exactly as it always ended a last chapter.

**EPISODE 2 IS COMPLETE** (v14.2). Chapter 5, THE LAST QUESTION, closes the
second case file: months after the outfield, days from ORD, he bumps into
his TEKONG encik at a mainland infantry camp, and halfway through the small
talk the encik brings the Hawk Company bunk up himself — "Remember the
question you asked me? About the 3am shower?" The design is Chad's, after he
threw out five proposals (docs/V14.0-E2C5-PLAN.md §0 records why each
failed; the short version is that a fifth haunting is not a resolution, and
episode 1 closes by DAYLIGHT, someone who knows more, and one physical final
act). PLAY is a clearance round on a camp apron in the late afternoon —
the rifle back at the armskote, the torch at the stores, a form signed at
the company office, in any order, with one award for doing it before you
speak to him — and then the encik, who IS the chapter's pile, so the
decision is the engine's own. THE FOUR OPTIONS ARE HIS WORDS VERBATIM, and
each answer is a different KIND of answer rather than four versions of one
speech: A is the story (the man, and that the departed can stay attached to
a place — the teaching the episode ends on), B is the confirmation kept
short, C is one flat line that refuses the premise and ends there, D is the
reason, also short. B best, A good, D bad, C worst — his verdicts. 34 takes
in four voices, 5 sounds, and ZERO engine seams for the chapter itself.
Three things the release fixed on the way, each found by a probe rather than
by eye: a chapter may now declare `fireLight: null` (an afternoon apron has
no fire, and the viewmodel read its position every frame); `walktest`
CAPTURES `pageerror` now, which is what caught that and a texture object
assigned where a texture belonged; and the clearance is ISSUED at the start
of play rather than inferred from an empty bag, which had left both counters
dead from the chapter's first frame (docs/LEARNINGS.md).

**Chad's report of 28 Oct 2026 on episode 3 chapter 5 — docs/V24.2-E3C5-DEBUG.md** (his four messages verbatim, the plan, and the log checkpoint by checkpoint) shipped in three releases: v24.1 the soft-lock he hit (the long press), v24.2 the comprehensive debug (masters/v24.2/findings.md, every finding with its verdict and fix), v24.3 the sound buff (masters/v24.2/L3-sound-report.md the measure, masters/v24.2/make.sh every pick and why). **His two questions after it — "Are you sure you fully debugged ep 3 chp 5?" and "Debug ep 4 chp 1 too, full debug" — are docs/V24.5-DEBUG-PLAN.md** (the honest answer, the plan for both chapters, the log checkpoint by checkpoint; masters/v24.5/findings.md every finding of nine lenses with its verdict and fix), shipped at v24.5. **His eleven notes on it the same evening — the counter's label, the owner's long talk, the bag, the desk, three minigames, all four endings — are docs/V24.7-E3C5-NOTES.md** (his words verbatim, what each traced to, the plan and the log), shipped at v24.7; **his note the next morning, HDB blocks behind ending D's monk, is docs/V24.8-THE-COMPOUND.md** (the estate hidden behind the garden and the temple's grounds built round it, every building placed against a shot), shipped at v24.8. **His note the same afternoon on episode 4 chapter 1 — "is it really necessary to have the other customers there, to wait one by one for your turn, to gather notes that are inconsequential?" — is docs/V24.9-E4C1-TIGHTER.md** (the measure, his three picks, the change list and the log), shipped at v24.9: the yard straight in with one optional question to Pong, no note pages, no birthday pick. **His messages of 29 Oct — the incense missing in episode 3 chapter 5's ending D ("You don't read code?"), Pong's cut line, and episode 4 chapter 1's lightning game "way too hard" — are docs/V24.12-THE-STORM-WATCHED.md** (his words, the causes, the audit, the storm film shot by shot and the log), shipped at v24.10–v24.12: the sticks set out again, the line re-said, and the storm watched instead of played (his pick, "No game, just watch"). **Episode 4 chapter 1, The Master I Did Not Know, shipped at v24.0 —
docs/V24.0-E4C1-PLAN.md** is its build memory (§15 the log, checkpoint by checkpoint; masters/v24.0/cp13-findings.md
its review, every finding with its verdict and fix); its cast are placeholders until Chad's models (docs/E4-MODELS.md
lists each, with what stands in), and its seven music cues are the measured picks until Chad's ear (one reel per cue in
masters/v24.0/previews/). Chad's seven notes on episode 3 chapter 4 (queued 26 Oct while chapter 5 was built) shipped at
v23.1 — **docs/V23.1-E3C4-QUEUED.md** has them verbatim, the plan and the record, with what the phone photographs
found after the first deploy. **Episode 3 chapter 5, The Children On My
Altar, shipped at v23.0 — docs/V23.0-E3C5-PLAN.md** is its build memory (§15 the log, checkpoint by checkpoint;
masters/v23.0/cp13-findings.md its review). **Episode 3 chapter 4, The Pieces That Answered, shipped at v22.0 —
docs/V22.0-E3C4-PLAN.md** is its build memory (Chad's words, the design, every checkpoint, the review's
fixes); its Chinatown towkay is a STAND-IN until Chad's model (docs/E3-MODELS.md), its opening film has had
its own score and four sounds since v22.4 (the score is take 3 of four until Chad picks by ear — the previews
are masters/v22.0/previews/film-music-1..4.mp3), and its closing music is take c until Chad picks between c and a.
Its deep debug at v22.3 — **docs/V22.3-PLAN.md** — lists every finding of eight code lenses and the phone
photographs, each with its verdict and fix, and what was left alone and why.
**Chad's two asks of 24 Oct 2026 on episode 3 chapter 3 — docs/V22.5-PLAN.md** (his updated row of deities on the
medium's altar; two more look-spots in the amulet shop, the lersi masks and the shelf of Buddhas, each with his line,
the gallery still read through before the owner calls) shipped at v22.5; that file is the record.
**Chad's message of 22 Oct 2026 on episode 3 chapter 3 —
docs/V21.17-PLAN.md** (the lorong's buses, Golden Mile's shops, and the opening film
rebuilt as his ride in on the bus) shipped in three milestones, v21.17 to v21.19, and
v21.20 took the Hat Yai line back out of the film at his word; that file is the record. **Chad's batch of 21 Oct 2026 on episode 3 chapter 3 —
docs/V21.12-PLAN.md** (the shrine's new lines, the Hanuman's appearance and 360, the
sound of both places, the buses, the kopitiam's people, Golden Mile's streets)
shipped in five milestones, v21.12 to v21.16, and each of its eighteen notes is
checked off against the live build there (CP8); **docs/V21.16-NO-BLOCK-FIGURES.md**
is the record of his no-block-figures rule applied to all thirteen chapters.
**docs/V21.0-E3C3-PLAN.md** is the last chapter's
build memory, checkpoint by checkpoint, **docs/V21.1-PLAN.md** its debug
pass (every finding, its verdict and fix, and what was left alone and why),
and **docs/V21.2-PLAN.md** Chad's five notes on it (Golden Mile Complex, the
steady light, the chant), and **docs/V21.8-PLAN.md** his thirteen more (the
monk, the street, the roar, the portraits, the displays — every one verbatim,
with the record), and **docs/V21.9-PLAN.md** the audit of all of them and the
shop's look-spots made press-only, and **docs/V21.10-PLAN.md** Luang Pu
Phiboon's portrait and the masters' gallery (its sources in
docs/research/V21.10-MASTERS.md), and **docs/V21.11-PLAN.md** the medium's
altar, its two paintings and the gallery's introduction, and **docs/V21.21-PLAN.md**
the gallery's hand-off and the masters' stories researched again (every source, every
correction and what stays contested in docs/research/V21.21-MASTERS.md, which
supersedes the v21.10 record where they differ), and **docs/V21.23-PLAN.md** the gallery
debugged (the wheel, the end of a story, three review lenses, what was left alone and
why), and **docs/V21.30-PLAN.md** the medium's decision and its four endings rebuilt (what
shipped at v21.0 and why it was wrong, the four scenes line by line as Chad approved them,
his four asks sent while it was built, and the record); episode 3 chapter 3's owner, staff man
and customers are STAND-INS until Chad's models land (docs/E3-MODELS.md says
which rig stands in for each, and each is a one-line swap). Episode 3 chapter
2's three batches (docs/V19.4-PLAN.md) are all done.

Next up: **EPISODE 4 · THE TEACHER IN WHITE** (Chad's name) — the casebook's S1·11 to S1·15, from the master he did
not know to his first cases at his teacher's side. Chapter 1 SHIPPED at v24.0 and was tightened at v24.9 (Chad's
call: the yard straight in, no notes, no birthday pick — chapter 2's "notebook read back" becomes one question at Lersi
Chin's, what he tells him: what he saw, or what he thinks it meant, the trial's 5.2); chapter 2, NOT EVERY MASTER SHOULD BE
TRUSTED (S1·11's second half: the fog, Lersi Chin's clearing in his own shop, and the warning), SHIPPED at v25.0 —
**docs/V25.0-E4C2-PLAN.md** is its build memory (§0 Chad's words, §4 the beats and the four endings line by line, §14 the
log, checkpoint by checkpoint), built to his direction of 9 Nov 2026 (Lersi Chin comes to his shop in Singapore, Pong
brings him; all play in the shop; no airport and no mirror, he is never seen; no answer goes back to test and each teaches
its own thing; answer C his own, "ask Lersi Chin to send it back to whoever did it"; the coda ends on a forum thread, "LF>
Gathering devotees for Wai Kru in Udon Thani!"). **`src/chapters/e4/e4c2.js` is GENERATED**: masters/v25.0/assemble.py
makes it from masters/v25.0/parts/*.js and chapter 1's own lines (pinned to e4c1.js's sha1, so a change to chapter 1
stops the assembly instead of shifting it) — edit the parts and assemble again, never the chapter file. Its research,
refuted by a second reader, is docs/research/V25.0-LERSI.md (and -VERDICTS.md, which wins where they differ); its sound,
music and models, every pick and why, masters/v25.0/make.sh. Its full debug, at Chad's word of 10 Nov 2026 ("Visual
anomaly, glitches, things that don't look right or natural also count as issues"), shipped at v25.1 —
**docs/V25.1-E4C2-DEBUG.md** (twelve findings, each verified and fixed, four of them my own from v25.0, and what was left
alone and why). His four asks of the same day (what a phone could not see in every film and in play, Lersi Chin's
movements, one telling in place of the four-card pick, and every prop a real model, the last now a standing rule)
shipped at v25.2 — **docs/V25.2-E4C2-PHONE-MOTION-MODELS.md** (his words, the prop audit, the log); its framing probes are
tools/probes/framecheck.mjs and framediff.py, its body probe lcmotion.mjs. His notes on it the same day (no sprinkle of water, no thread
tied, and "i find it unacceptable that you find his poses natural, it clearly is not") shipped at v25.3 —
**docs/V25.3-E4C2-NATURAL.md** (his words, what was measured on Lersi Chin's rig, the wai's sources, what was seen and
left); the rig's measures are masters/v25.3/make.sh, the pose lab tools/probes/poselab.mjs (with poselab-job.py and
poselab.sh). His two asks while that was checked (the piece he took in chapter 1 made bigger on its shelf with a red glow;
then black smoke on it and a whisper; the smoke made more translucent on his word the same evening) shipped at v25.4 —
**docs/V25.4-E4C2-SHELF-PIECES.md** (his words, the measures, the
log, and the game's captured prayer held against Lersi Chin's wai); the whisper is the measured pick until Chad's ear
(four previews in masters/v25.4/previews, every candidate and why in masters/v25.4/make.sh). His three messages of 10 Nov
on the whole episode (twenty-eight asks: the yard's cars remade, and in chapter 2 the woman at his counter seen, the
call on the speaker, the visit, the telling and ending B's talk re-said, the water, the forum, the notebook, the walks
away, ending D) and his six of 11 Nov on that build (another woman for the customer, then his own woman in green in
place of the auntie; Lersi Chin's aura white and subtle, gold kept for Grandmaster Pho; the chant made "Om Namah
Shivaya" three times with the white light gathered, sent and the screen flashed white, the clearing film 39 s where
it was 89; the camera's bounces at the note, the call and the forum; the order's mark on the flowers; a second before
"Call Pong"; Lersi Chin's arms out of his robe as he takes the wrist; "When I remember" re-said) shipped at v25.5 —
**docs/V25.5-E4-NOTES.md** (his words, what each ask traced to, what was built, the log; masters/v25.5/make.sh every
model, voice and sound). The woman at his counter is his own model now (`e4stall`); the one model still NEEDED is the
taxi uncle (docs/E4-MODELS.md). His ask the same day to make sure every point of 9 to 11 Nov was fully addressed, the
latest message winning any conflict, is **docs/V25.5-AUDIT.md**: every point with where it stands on the live build,
the twelve places two messages pull different ways, what the audit found and fixed (he could still walk out of his
shop through its side walls; three steps of the lens; the master's head at a phone's edge in the visit, and the
breathing lens my first fix for it made), and what it put to him and left (§6: above all the look locked on Lersi
Chin's living face in every close shot, measured as the films play: tools/probes/filmlive.mjs).
Chapter 3, I FINALLY FOUND MY ANSWERS (S1·12: the Wai Kru in Udon Thani, Grandmaster Pho, the first teaching:
control, open and close), SHIPPED at v26.0 — **docs/V26.0-E4C3-BUILD.md** is its build memory (the tracker: §1 Chad's
words, §3 the defaults it stands on, §4 every checkpoint, §5 every asset's ids, §7 the log, §8 the traps), its design
docs/V26.0-E4C3-PLAN.md, built to his GO of 11 Nov 2026 ("the most important chapter in the game") and to his sixteen
photographs of Grandmaster Pho's real Wai Kru (on the working machine only, `masters/v26.0/ref/`, ignored by git: the
repository is public). **`src/chapters/e4/e4c3.js` is GENERATED**: masters/v26.0/assemble.py makes it from
masters/v26.0/parts/*.js — edit the parts and assemble again, never the chapter file. Its people (eighteen bodies at
three levels, two of them children) and its things (forty-nine) were made here end to end; its sound is remade by `bash
masters/v26.0/sound.sh` then `python3 -I masters/v26.0/install.py`. The decision is HIS OWN FOUR (accept your path,
challenge the path, ask why, ask to make it stop: none leaves the path) and the ending stays in the present ("Tomorrow
we begin."). WHAT STANDS ON A DEFAULT UNTIL HIS WORD (the tracker's §3; each one word from him to change): the three
new voices and the thirteen music cues (picked by measure; reels sent 12 Nov); Grandmaster Pho's 39 lines (put to him
12 Nov, docs/V26.0-PHO-LINES.md; two of them, `ph3n3` and `ph3n4`, give a part of the answer to "why" that the
casebook withholds: asked by name); the ranks of the four; which man in the photographs he is; a picture of the
dancers and what the music is; his album of the Wai Kru (asked as files); the small dark seated image before the wheel
in his photograph 10 (not made: a sacred image is never guessed) and the monks' robes (his model's orange, the
photograph's maroon); and five places where the build and the plan's own direction (its 3.7) differ, each said
and each one word to change (the last image, a petal on his open hand; the flood in gold; the petals thrown at Ton's
table and not at the offering tables; no bed of sound for each tent; the gold never photographed at three strengths:
the tracker's §13 SAID list, docs/OPEN-ITEMS.md C13). The tracker's §13 is every ask of his against the build. Its research and the second pass over
what the game states: docs/research/V26.0-WAIKRU.md and -VERDICTS.md (which wins where they differ). Grandmaster Pho's
gold is lifted in this chapter (`auraAt`, c_zfx.js), from the colours chapter 2 kept for it. His four asks of 12 Nov
(Grandmaster Pho's armpit, his bobbing, three different monks off their seats' insides, the dancers' loop) are the
tracker's §15; two of my fixes went live wrong (the monks' arms, the armpit) and were replaced at build 77 (the release's deploy
`6af5dd0621a2346e2cda05ea`): an arm at rest is designed and judged as §15.5 says, and what is left is
docs/OPEN-ITEMS.md C13 o. His nine notes of 12 Nov evening on it (the faces butchered, the woman with the taper, the kneelers too quick, the
ground's empty edges and plain sky, a higher budget on a phone, "Pho" said "Puu", the children's petals every cycle,
the footsteps not grass) shipped at v26.1 (the tracker's §16; deploy `6af64a8cc0af44bfca0cea81`), and with them his
phone standard for every chapter; his ninth, the full debug of the chapter once all of it was live, went live at v26.2
(docs/V26.1-E4C3-DEBUG.md; deploy `6af69ce2d967b774e0e4ac58`), with his message of 13 Nov on things passing through one
another and his five pictures (§5 there: every clip measured by tools/probes/clipscan.mjs and fixed or named; the
trees placed by their crowns, masters/v26.2/trees; the bench made again, its quad remesh). His notes of 13 Nov after it
(feet in the ground, the minigame remade as his pick, the gate; the look round and Pho's head restrained; Ton's face; the
taper woman's arm; the brown hermit's hands; then "You dont see the problem with the hands and fingers?" and the new
standing rule on bodies, with tools/probes/jointscan.mjs) went live at v26.3 (deploy `6af6f14cd6218e64bb4e9b61`):
docs/V26.3-E4C3-NOTES.md.
His question the same afternoon, why the brown hermit was so blocky up close, went live at v26.4 (his full model drawn
within 2.2 m), and at v26.5 the other important people his answer named (the three other seated masters and the woman
lighting the candles; docs/OPEN-ITEMS.md C13 u). His ask to make the chapter faster with nothing on screen changed is
measured and planned in docs/V26.6-E4C3-OPTIMIZE-PLAN.md (put to him).
Chapter 4 is next after it
(S1·13, case one: the woman who rose from her wheelchair).
The episode's plan, with what remains his to decide:
**docs/V24.0-EPISODE4-PLAN.md** (its sixth draft; §0 what he decided, §1 the two episodes' two stories, §5 what is
still his). S1·11 in two chapters (the master he did not know, who wears the original Sak Yant Ajarn's model; then the
fog, Lersi Chin's clearing and the warning — built on Master Z's own trial episode, its 5.1 and 5.3 the two decisions
verbatim; all nine trial episodes are copied verbatim into **docs/source/mztrial-episodes.md**) → S1·12 (Grandmaster
Pho at the Wai Kru; open and close) → S1·13 (case one: the woman who rose from her wheelchair) → S1·14 and S1·15 (cases
two and three, one chapter: the smell nobody else could smell). Episode 5, **The Signal And The Translator** (Chad's
name, v23.5), is S1·16–S1·20, cases four to eight, one a chapter, ending on Season 1's finale; the casebook's own hinge
between the two is the end of case four, "I had thought I was only there to assist my teacher" (the grouping is
Chad's, approved v23.5). Grandmaster Pho and Lersi Chin are Chad's models, with their voices (the Ah Pek's too, whose
case comes later in the casebook). Lersi Chin's model arrived 3 Nov 2026 and is CAST in chapter 2 (v25.0):
`assets/lersichin.glb`, key `lersichin` (hosted-only), masters/v24.38/make.sh; his voice is ElevenLabs' Mart-Podcast, the
measured pick of three until Chad's ear (masters/v25.0/audition).
Grandmaster Pho's arrived the same day, with distortions Chad asked to have fixed: PREPARED, not yet cast, and still being
improved — `assets/pho.glb`, key `pho` (chapter 3), masters/v24.49/make.sh (and its PLAN.md): his torso fixed (v24.40,
measured on every frame by tools/rigstrain.mjs), his robe rebuilt at v24.41 as twelve three-bone chains baked into his
nineteen takes (tools/robeskin.mjs), each take given the robe rules that read best for it (v24.42–v24.43: running on
v24.40's, the cross-legged sit, one cast and the sword lunge fitted to his file), and at v24.43 the cloth on his left upper
arm back on the arm (robeskin LDRAPE; my v24.39 re-bind had given it to his chest), and at v24.44 stood upright at Chad's
word (robeskin UPRIGHT/UPRIGHTARMS: his takes bend his waist joint forward 42–75° in every take, a constant left by how
they were laid on his rig, so each take that stoops has its waist turned back and the turn given back at the neck and the
shoulders — his head's turn, every gesture's aim and his feet unchanged; the lean that is the move, and the talk that
already stands straight, are left as his file has them; a first pass that let the arms ride the chest raised every aimed
arm and was reworked; a second blind reader rates the seven reworked takes better than his file and v24.43 in all
seven), and at v24.45 the drape on his left arm given a hanging-cloth rig at Chad's word (robeskin's DRAPE family: a
sleeve bone on the arm's swing, the band riding it and turned round the arm to hang below it; every point outside his left
upper body's cloth unchanged but one crease at his hip; a blind reader of every take: better than v24.44 in 9, the same
in 7, worse in 3 for shards at his elbow, measured to an older step in LDRAPE and a fold's crease the colour test read as
skin and cured — a second reader rates those moments better in 6 of 7, the same in 1). An independent reader of ALL nineteen
takes, blind to which version is newer, rates v24.43 against his file 13 better, 4 the same, 2 worse (talking with hands
open; the sword lunge, slightly) — read a review of a few takes against one of all of them with care: v24.42's reader,
shown the eight worst, rated the same file worse in five. At v24.46 (Chad: "Fix the rest of the issues ... unlit just
only for his face?") the notch at his right armpit eased (robeskin ARMBLEND) and his LOOK photographed four ways beside
his photograph for him to pick (lit / all unlit / his face unlit / his skin and necklaces unlit with the robe lit, the
last recommended: a material patch when chapter 3 casts him, his file unchanged); the robe's hem, joined to his shins by
triangles that stretch into strips when a leg leaves the robe, was cut free at his word (tools/hemcut.mjs) but NOT
shipped — a blind reader of every take preferred the strips to a trailing leg ending at mid-shin in walking — so the hem
is his choice too. Measured and not cured (a helper bone or a corrective shape would): the folds across his right
shoulder blade and at his right side, the shards below his left elbow in one talking moment. At v24.47 (Chad: "Option 2
and look D", "Cloth simulation", "Calmer running"; masters/v24.47/make.sh and PLAN.md) his look is D, and he has REAL LEGS
under the robe (tools/leggraft.mjs: the admin-tee man's bare legs, lent hidden, on new bones solved into every take), the
robe below his waist made cloth that makes room for them (tools/robesim.mjs, tools/robeshell.mjs, prepmonk TWOSIDE) and
his running a jog; his legs are checked on 180 moments from six sides (tools/probes/pholegs.mjs) and by twenty blind
readers of all 540 pictures: better than his saved file in 11 takes, even in 2, worse in 6 — sitting cross-legged (five
ways tried; one tube of cloth cannot wrap two crossed legs), the sword slash, the two Charged casts, cast_8 and talking
with hands open (the lower robe puffed into a sack). At v24.48 (Chad: "Fix all of it"; masters/v24.48/make.sh and
PLAN.md) each of those faults was traced to the triangles it is made of (tools/probes/phoid.mjs) and fixed — the cloth
bones' turns fitted to the cloth they carry, the thighs open at the hip, no push past the robe's rest, the old opening's
floor and an inner sheet taken out, the floor sit's robe carried by his real legs; his hem is his scan's own (a cut to it
was rated worse and taken back out). Forty blind readers of all 540 pictures: better than his saved file in 15 takes,
about even in 2, worse in 2 (the first Charged cast and talking with hands open: small white bits at the hem); against
v24.47 better in 17, the same in 2. At v24.49 (Chad: "Yes, fix all of it"; masters/v24.49/PLAN.md) the white bits were
fixed (his scan's lining scraps out of the hem, the hem's rolled edge kept whole, robeshell HEMLINING and HEMKEEP; the
edge left to the old floor's cut behind his shins only, HEMKEEPFLOORBACK, where kept whole it made a grey comb between
his shins in the chair sits): the first build better than his saved file in 366 of 540 pictures, worse in 54; the
shipped file against that build better in 96, worse in 77 (talking slightly worse, the chair sits clean; the first build
kept for his pick). At v24.50 (Chad: "The robe is like attached to the underside of the arm" ... "Its the other arm" ... "Do it, go";
masters/v24.50/PLAN.md) the robe under his RIGHT armpit, tied to that arm (12,347 points), was re-tied to his chest and
cut free of it (tools/armfree.mjs): lifting the arm no longer drags it up the arm's underside. Paint what a cloth is tied
to before describing how it looks (tools/clipsheet.mjs --look=bone:<regex>@raw), and when he names a fault without a
side, check both. At v24.51 (Chad: "Fix the jagged part, and there are some floating pieces that needs fixing";
masters/v24.51/PLAN.md) the robe's edge at that armpit is clean and nothing floats: prepmonk's weight smoothing now runs
inside armfree BEFORE the robe is freed (run after, it gave the arm's share back to the robe's edge: the teeth), and the
triangles joining the robe's edge to the arm are kept and drawn in his skin, one even web as an armpit (cut, they left a
gap whose caps hung as a flap). Measure a fix in the FINAL file: a later step can undo it. At v24.52 (Chad: "It is still
not clean enough" ... "I want to see how he will actually look in the game"; masters/v24.52/PLAN.md) the armpit is
clean in look D, and he was photographed in the real game (tools/probes/phoingame.mjs). His look is D, said again:
"unlit, except for the robe"; do not put lit against it again. In look D any robe white inside a skin triangle shows, so
the triangles that stretch with his arm and hold it are drawn in skin, in armfree and again after prepmonk's thinning
(STRETCHPAINT), which makes new ones. At v24.53 (Chad: "Fix those remaining issues cleanly and efficiently";
masters/v24.53/PLAN.md) the skin patch on the robe (his scan's lowest joins, drawn out by the raised arm) is taken out
after the thinning (prepmonk ROBEHANG), and the pale dots in the armpit's crease (white in his colour sheet bleeding in
at the edges of thin charts of skin) mostly cured by pointing those triangles at skin inside a chart (EDGEBLEED). A
triangle hanging between robe and arm shows wrong whichever colour it is given: take it out. At v24.54 (Chad: "Ok, install
blender on your end"; masters/v24.54/PLAN.md) the collar and the small fold his scan made where his inner arm touched his
side are cut in Blender (tools/armpit.py, run on Blender's Python; tools/meshpatch.mjs hands it the region and writes
back only what it changed), each opening closed on its own side, the points by the cut weighed to their own side, and
the thinning holds the armpit as built (prepmonk THINLOCK): the patch's hairline, cast 6's seams and the robe's teeth
under the arm are gone. Blender here is a tool for the mesh, never for the pictures that judge it (those stay the
game's renderer). A Blender script iterates its points in memory order unless sorted by a key no two points share. At
v24.55 (Chad: "you are not using it to its fullest potential and capacity"; masters/v24.55/PLAN.md) his face, hair, hands
and necklace gold are a part of their own whose 2048 sheet Blender packs and bakes from his 8192 sheet (tools/rebake.py
between prepmonk BAKE=dump and BAKE=apply): his scan's full detail where he is seen close, his body sheet untouched; look D
draws that part unlit whole (his grey hair too, which the colour test had lit). Blender 5 bakes from a blurred copy of an
image unless render.use_texture_cache is off. Its cost (+21 MB of texture memory) is put to Chad. At v24.56 (Chad: "why
cant u just clean up that entire armpit area, remove all those popping out parts"; masters/v24.56/PLAN.md) his right armpit
is clean: the "folds kept as the armpit" were a strip his scan laid across the mouth of the hollow under his arm, cut and
left open (armpit.py CUTALL, MIXOPEN), the scan's bridge on the arm cut with it (TONGUE), the crease and what those pieces
covered drawn in plain skin (CREASEPAINT, COVERPAINT); the worst stretch over every frame of every take 95 → 28 times
(tools/probes/webstretch.mjs). Measure every frame before judging a picture, and draw a scan's geometry before cutting it.
Waiting on his choice: his hands in the floor sit (raised onto the robe, his saved file's robe for
that take, or as it is). Each 540-picture blind review by twenty readers costs about 6 million tokens: put its cost to
Chad before running one (he noticed v24.49's four). **Ajahn Krukai's model is PINNED** (v23.5, Chad: *"Make sure ajahn krukai's model
in ep3 is unaffected and untouched. It is important that krukai is in the game as the master who gave the player his
first sakyant."*): `ajarn` / `assets/ajarn.glb` are the bytes that shipped at v18.7, `chaptertest` fails on any change
to the key, the file or e3c1's use of it, and Episode 4's first master — the original Sak Yant Ajarn — arrives under
his own key, `firstmaster`, restored from git (5124aa7) and masters/v16.8. **Chapter 1's full build plan is
docs/V24.0-E4C1-PLAN.md** (27 Oct 2026, Chad: *"Work on the full build plan for episode 4 chapter 1 now ... I don't want
to see a reuse of old assets and environments ... Be like a creative director."*) — everything in its world new and
checked so by `chaptertest` (FRESH), three new ways to play (ASK, THE LEDGER, WHAT CHANGED?); built to his "build all of
it", with the plan's defaults taken on every §2.3 question he did not answer (Q1, the master in black, he did), and
SHIPPED at v24.0. EPISODE 3
IS COMPLETE (v23.0; chapter 5, The Children
On My Altar — `src/chapters/e3/e3c5.js`, docs/V23.0-E3C5-PLAN.md, its plan written 25 Oct 2026 from Chad's answers and
revised four times — §2.3–§2.7 his rulings, docs/research/V23.0-KUMANTHONG.md the research behind every belief;
v16.0 shipped chapter 1,
The Luck I Went Looking For — `src/chapters/e3/e3c1.js`; v18.0 chapter 2, The
Hands That Moved — `src/chapters/e3/e3c2.js`, docs/V18.0-E3C2-PLAN.md; v21.0
chapter 3, The Dance On Buddha Day — `src/chapters/e3/e3c3.js`,
docs/V21.0-E3C3-PLAN.md; v22.0 chapter 4, The Pieces That Answered —
`src/chapters/e3/e3c4.js`, docs/V22.0-E3C4-PLAN.md; Chad's three kumanthong
models for it are in masters/v22.0/src, never committed; the whole episode's
plan is docs/V16.0-EPISODE3-PLAN.md and its model list docs/E3-MODELS.md). Everything the architecture needs for it is in
docs/EPISODES-PLAN.md.
(chapter 1, The Worst Bed, shipped at v7.1 — `src/chapters/e2/e2c1.js`;
chapter 2, Nobody There, at v10.0 and built out at v10.1–v10.2 — `src/chapters/e2/e2c2.js`; chapter 3, The Pressure, at v11.0 and revised at v11.1–v11.9 and v12.5 — `src/chapters/e2/e2c3.js`; chapter 4, The Cyclist, at v12.1, rebuilt at v12.2 and its ghost given back its body at v12.4 — `src/chapters/e2/e2c4.js`;
its flare, its cyclist's rhythm and all four outcome scenes rebuilt at v13.2
(docs/V13.2-THE-FLARE-THE-RHYTHM-AND-THE-SCENES.md), and the lane, the fire
gate and a deep debug pass at v14.3 (docs/V14.3-THE-LANE.md);
chapters 1 and 2's lessons rewritten at v11.10, chapter 1 last revised at v10.8;
ALL FOUR episode-2 chapters were revised at v13.0 against Chad's twenty-two
notes — docs/V13.0-PLAN.md and docs/V13.0-THE-TWENTY-TWO.md — and chapter 4
gained its muzzle flash and a real ammo point at v13.1
(docs/V13.1-THE-FLASH-AND-THE-AMMO.md) and Chad's nine notes at v13.2; the rifle
viewmodel's placement and material are measured in
docs/E2-SOLDIER-MODELS.md §8; chapter 5, The Last Question, at v14.0 and
debugged at v14.1 — `src/chapters/e2/e2c5.js`, docs/V14.0-E2C5-PLAN.md,
docs/V14.1-THE-DEBUG-PASS.md — and four more at v14.2, §7 of the same doc), and the
still-outstanding job of replacing chapter 1's
placeholder choices with the real "THE OFFERINGS" data in
`docs/source/trial-game-chapters.md`.

The sound download is **done** (v4.2, above): split per chapter so it no
longer grows with the game, and re-encoded from the masters. The ghost mesh
is now the biggest single download by a wide margin and the only compression
job left outstanding.

**THE SHEET IS v144** (`masters/v26.3/masterz-text-v144.xlsx`, its CSV beside it: v26.3's words). It is
EXPORTED and not published: the workbook (135 KB) is far past what the Drive connector's base64 route can carry (about
20,000 characters — docs/EDITING-TEXT.md, "THE CEILING"), so the split export written down there no longer fits
either. The way through is the Google Sheets connector, which writes the cells directly (docs/OPEN-ITEMS.md A1).
**v44 is still the link to give Chad** until that is done:
https://docs.google.com/spreadsheets/d/1bqnbQJPr1O6YslOlcsbVDFlZCohQtyKbPzm9EuY1IpM/edit
Every sheet version's own diff, v144 back to v75, is in docs/HISTORY.md, "The sheet, version by version" (newest
first; a new version goes at its top).

`docs/LEARNINGS.md` is the catalog of every hard-won lesson (CSP traps,
audio traps, cutscene staging, test flakiness). When something in this
repo looks weird, it is probably load-bearing — check there first.

**docs/OPEN-ITEMS.md is what is still open** (31 Oct 2026, every item checked against the code): what can be done
on his word, the episode 1 fixes that need his OK, what waits on him, what is not built yet. Cross an item off there
the day it is done, with the version.

`docs/AUDIT-2026-09.md` is the standing AUDIT — Chad asked for a deep
pass over all five chapters, the engine and the phone-vs-desktop framing
question, to be saved and revisited. It holds four confirmed bugs
(ch3's medium never moves his head in three cutscenes; ch4's fan keeps
spinning through its own silent beat; the volume slider skips a cutscene;
a light dip can stick dimmed): the volume slider's was fixed at v6.6 (a
tap no longer skips a scene) and the other three are still in the code,
waiting on Chad's OK because they are episode 1's (docs/OPEN-ITEMS.md B6).
And it holds the fragile-but-not-broken list, and the viewport answer. **Read Part One
before touching cutscene framing**: the camera's 72° is VERTICAL and
fixed, so a portrait phone is a CENTRE CROP at a third of the width — and
that helps as often as it hurts, which is why a global lens change is the
wrong fix and is argued against there in full.

One more that earns its place at the bottom of this file because it now has
TWO notches in it: **a bought rig is sized and grounded from its POSED
BONES, never from any bounding box, and never from the file's own units.**
The arms rig (v3.8) and the mother (v4.7) both arrived through FBX at the
wrong scale with a bind pose standing somewhere their animation does not.

## The history (docs/HISTORY.md)

Every release from v2.1 on has an entry in **docs/HISTORY.md**, word for word as it stood here until 31 Oct 2026 (after v24.23): what Chad
asked, what shipped, what was measured, and the traps on the way. Search it for a version (`- **v14.3`), a chapter's
key (`e3c4`) or a system's name before changing it.

**Writing it, from now on.** A release's entry goes at the END of docs/HISTORY.md's "The releases", its version
first, as always. This file gets only what every session needs: a NEW standing rule from Chad, into **Chad's standing
rules** with the version it came from, and the current state above (what is built, what is next, the sheet's
version). Nothing that belongs in the history is written here again — that is how this file grew to 111,000 words.
