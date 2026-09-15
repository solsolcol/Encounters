/* voicelines — every spoken line in the game, in one place.
   ---------------------------------------------------------------------------
   The engine plays a line by its sample name (`sfx(t, 'v2wake1')`, `say('vpile')`,
   `speak('vA')`) and never reads this file: nothing here reaches the player.
   It exists so the WORDS of every take are written down beside the take —
   who says it, where in the game it plays, what it says, how long it runs —
   because until v5.14 they were scattered across the plan docs and eight of
   them were written down nowhere at all (the takes had to be transcribed).

   What reads it:
   - `textsync.mjs export` writes every row here to the VOICE LINES tab of
     Chad's sheet, beside the GAME TEXT tab; `import` writes an edited TEXT
     back into this file and reports which lines changed, which is the list
     of takes to regenerate.
   - `chaptertest` checks that every voice take in assets/audio/ has a row
     here and every row has a take, so the registry cannot go stale as
     chapters add lines.

   Rules for a row:
   - `id` is the sample name — the file assets/audio/<id>.mp3 (chapter 1's
     `voice` is the one exception: it is its own asset, assets/voice.mp3).
   - `text` is what the take SAYS, as generated. Stage directions in square
     brackets ([beat], [whisper]) are ElevenLabs v3 direction tags and are
     part of the prompt, not spoken. A wordless take (a gasp, a laugh) holds
     its direction in the same brackets so the sheet still shows a cell to
     edit.
   - `secs` is the measured length of the shipped take (ffprobe), so a
     cutscene's timing can be checked against it without opening the file.
   - `where` is written for Chad, in plain words; `note` carries anything a
     regeneration must know (shouted, whispered, retired, not used).
   Import edits `text` in place with a targeted replacement and touches
   nothing else, the same promise textsync makes to the chapter files, so
   keep every text on ONE line inside double quotes.                      */
(function () {
  'use strict';

  // Who speaks. The voice id is the ElevenLabs voice; the model is eleven_v3
  // for every take in the game. Changing the main character's voice is a
  // change to ONE row here plus a regeneration of every line marked james.
  const SPEAKERS = {
    james:  { name: "James (the player)", voice: "B6uUx2p7cRgxseOUyP6P", model: "eleven_v3",
              note: "Aaron, since v5.28 — Chad's third and final pick after River (v5.18-v5.27) and VALF (v5.15-v5.17). The registry key and the file names stay `james`/`v*`: renaming 79 keys buys nothing." },
    mother: { name: "Ma (his mother)", voice: "XrExE9yKIg1WjnnlVkGX", model: "eleven_v3",
              note: "Matilda. Chapter 2's mother at the door, chapter 4's Ma on the phone (EQ'd through the handset), chapter 5's Ma in the room." },
    auntie: { name: "The auntie at the paper table (chapter 3)", voice: "Xb7hH8MSUJpSbSDYk0k2", model: "eleven_v3",
              note: "Alice." },
    tangki: { name: "The tang-ki (chapters 3 and 5)", voice: "pqHfZKP75CvOlQylNhV4", model: "eleven_v3",
              note: "Bill. He speaks only in chapter 5." },
    /* v5.29 — the woman at the brazier is her OWN character, and always was:
       she stands at the fire on the far side of the tent, not at the paper
       table, and the one thing she says is a shout at a boy. Until now her
       line rode on the auntie's row and the auntie's voice, which is why it
       never sounded like a grandmother. Chad's scolding-granny model made
       the mismatch visible, so she gets the row and the voice she needed.
       Lexi is the first genuinely Southeast Asian voice this cast has had —
       the note in CLAUDE.md that "the workspace has no Southeast Asian voice
       at all" is now out of date by exactly one. */
    granny: { name: "The granny at the brazier (chapter 3)", voice: "TiKM6Oo9KZhmYBsTBA2s", model: "eleven_v3",
              note: "Lexi — Singapore English. Middle-aged in the library, aged into a grandmother by the prompt's tag. One line: the shout in scene B." },
    /* v7.1 — EPISODE 2. His voice ages with him (docs/EPISODES-PLAN.md §6):
       the boy of episode 1 is Aaron, and an eighteen-year-old recruit is
       not a boy. `jamesTeen` is the same character; his files are `n*`
       (episode 2's chapters are n1..n5) so the sets in main.js stay
       disjoint by construction. The other three are the bunk. */
    jamesTeen: { name: "James at eighteen (episode 2)", voice: "B6uUx2p7cRgxseOUyP6P", model: "eleven_v3",
              note: "Aaron — the same voice as the boy of episode 1, since v7.8 (Chad on Gabriel, v7.1's pick: 'the voice for the main character is so bad. Either find a better one, or stick to the same voice we used back in ep 1'). The 26 takes are masters/v7.8; a swap is this row and a regeneration." },
    sergeant: { name: "The platoon sergeant (episode 2)", voice: "JKX4knVxHRiP0doaLdrj", model: "eleven_v3",
              note: "George — adult Singaporean, low and deep, every line under a [shouting] tag." },
    buddy: { name: "The buddy in the next bed (episode 2)", voice: "ZyIwtt7dzBKVYuXxaRw7", model: "eleven_v3",
              note: "Edison — young Singaporean, casual. He recurs all episode." },
    bunkmate: { name: "A bunkmate (episode 2)", voice: "FXMPPfJPpDj0GSwJ6ASO", model: "eleven_v3",
              note: "Kelvin — Singaporean English. One more voice in the bunk." },
    /* v9.5 — THE TENTH VOICE. Chad: "everyone counts, one after another, but
       ends up with one additional headcount." The man who says the extra
       number is not in the section and is not a new cast member: his take is
       the BUDDY'S own "Ten", treated — pitched down a tenth (asetrate,
       uncorrected, so it is also a tenth slower), doubled at 60 and 180 ms,
       and rolled off above 3.4 kHz, which takes the presence out of a voice
       without taking the man out of it. Measured against the untreated take:
       dominant 172 Hz against 237, centroid 1107 against 1630, and 9.5 % of
       its energy above 3 kHz against 18.4 %. It sits 6 dB under the rest of
       the cast (-9.8 dBFS peak against -3.8) because it is the one voice
       nobody in the section is sure they heard. Re-generating it is
       masters/v9.5/make.sh, not a new voice id. */
    ghost: { name: "The tenth man on the line (episode 2)", voice: "ZyIwtt7dzBKVYuXxaRw7", model: "eleven_v3",
              note: "Edison's take, TREATED — see masters/v9.5/make.sh. Not a separate library voice: it has to be recognisably a man in that line and unmistakably not one of these men." },
    encik: { name: "The encik, the sergeant-major (episode 2)", voice: "klqxhYh2Np93AvKxFz0b", model: "eleven_v3",
              note: "Hilmi — Malaysian English, middle-aged. Chad's brief was 'like an angry malay uncle', and getting there took four rounds: the library's Malay voices are all booth-recorded voice-over artists, and he rejected them in turn as too young (Zul), eighty years old (Yatin) and finally 'too polished'. HIS PROMPT RULE IS THE OPPOSITE OF AARON'S: no descriptive stage direction at all — a '[a furious sergeant-major in his fifties...]' tag gets a professional PERFORMING anger, which is what 'polished' names. Write the line the way he barks it: short bursts, full stops between them, CAPITALS on the stressed words. Same words as this registry, only the shouting written down." },
    /* v10.0 — a THIRD recruit at the breakfast table, for the one line that
       laughs at him. Picked to be unmistakably neither Edison nor Kelvin. */
    recruit3: { name: "Another recruit at the table (episode 2)", voice: "xDM73lGN1cPZSG4X87cj", model: "eleven_v3",
              note: "Ronan — young, casual. One line in chapter 2; he recurs if the table does." },
    /* v10.1 — Chad on v10.0's buddy line: "The voiceline of 'it starts at 3am
       i swear' is bad, change it to a singaporean chinese sound." A FOURTH
       recruit says it now, in a Singaporean Chinese voice; the buddy keeps
       his seat and loses his line. */
    recruit4: { name: "The recruit who heard it (episode 2)", voice: "XxnXw151E3nb1V85MRlS", model: "eleven_v3",
              note: "David — the library's 'typical middle-aged Singaporean man', casual. Picked over Louis (an Asian narrator, whose two takes came back at -11 and -14 dBFS peak, rumbling under 120 Hz) by measurement: David's take 2 opens and closes on silence (-72/-86 dB) at 2.9 words a second." }
  };

  const LINES = [
    // ---- chapter 1 · THE HELL NOTE ------------------------------------------
    /* v6.4 — THE PROLOGUE: the five lines he narrates over the opening film,
       before the chapter card. Warm and fond for the three memories, the
       smile gone for the fifth. vpro1 is the one take run through a 0.9x
       tempo offline (the v5.30 fallback): it read fast even with ellipses. */
    { id: "vpro1", who: "james", ch: "ch1", where: "Opening film, over black, before the first memory",
      text: "Ever since I was young, I loved picking things up from the ground.", secs: 4.47 },
    { id: "vpro2", who: "james", ch: "ch1", where: "Opening film, the leaf on the grass",
      text: "Sometimes it was just random leaves that I found interesting.", secs: 4.05 },
    { id: "vpro3", who: "james", ch: "ch1", where: "Opening film, the toy on the stairwell landing",
      text: "Sometimes I found thrown-away toys that I liked, when nobody else did.", secs: 5.56 },
    { id: "vpro4", who: "james", ch: "ch1", where: "Opening film, the note by the drain",
      text: "And if I'm lucky... sometimes I find money.", secs: 3.0 },
    { id: "vpro5", who: "james", ch: "ch1", where: "Opening film, over black, before the void deck at night",
      text: "This time however... this time was different.", secs: 3.47 },
    /* v6.6 — the small sounds he makes at each pick-up (Chad: "excited sounds,
       exclamation, oooh, omg"). Wordless-ish, so the text is what is HEARD.
       v6.9 — re-voiced as WHISPERS to himself (Chad: "almost whispering to
       himself excitedly"); same words, on their own quiet stage in main.js. */
    { id: "vpick1", who: "james", ch: "ch1", where: "Opening film, as he picks up the leaf",
      text: "Ooh! Nice.", secs: 1.96 },
    { id: "vpick2", who: "james", ch: "ch1", where: "Opening film, as he picks up the bear",
      text: "Oh! Hello there.", secs: 1.80 },
    { id: "vpick3", who: "james", ch: "ch1", where: "Opening film, as he finds the five-dollar note",
      text: "Wah! Five dollars!", secs: 1.65 },
    { id: "voice", who: "james", ch: "ch1", where: "A few seconds after chapter 1 begins",
      text: "Almost midnight... and this is the only way home.", secs: 3.97,
      note: "Its own file (assets/voice.mp3), not in the sound pack." },
    { id: "vpile", who: "james", ch: "ch1", where: "The first time you come near the burner",
      text: "Someone's been burning offerings. [beat] Is it Seventh Month already?", secs: 4.44 },
    { id: "vnote", who: "james", ch: "ch1", where: "The first time the note prompt appears",
      text: "There's one right at my feet. Like it was left for me.", secs: 4.28 },
    { id: "vgasp", who: "james", ch: "ch1", where: "Scene A, when he looks up and she is there; also chapter 2 scene A",
      text: "[a sharp, frightened inhale] Oh my God.", secs: 1.65, note: "Meant as a wordless gasp; the take also says the words (found by transcription at v5.14, as vrelief's were at v4.8)." },
    { id: "vscoff", who: "james", ch: "ch1", where: "Scene B, on the kick",
      text: "[a short, dismissive laugh] It's just paper.", secs: 2.04, note: "Meant as a wordless scoff; the take also says the words (found by transcription at v5.14)." },
    { id: "vpant", who: "james", ch: "ch1", where: "Scene B, under the run; also chapter 3 scene B",
      text: "[running out of breath] No, no, no, no, no.", secs: 2.04, note: "Meant as wordless panting; the take also says the words (found by transcription at v5.14)." },
    { id: "vrelief", who: "james", ch: "ch1", where: "Scene C, after he walks away; also chapter 2 scenes B and D, chapter 3 scene D, chapter 4 scene D",
      text: "[a quiet, shaken exhale — no words]", secs: 2.77,
      note: "Wordless since v4.8 (the first take turned out to say 'Just keep walking. Don't look back')." },
    { id: "vchantline", who: "james", ch: "ch1", where: "Not used",
      text: "Namo tassa bhagavato arahato sammāsambuddhassa. I'm sorry. I'll go.", secs: 8.36,
      note: "Retired at v3.7's cutscene pass; the file is still in the shared pack. Transcribed from the shipped take at v5.14." },
    { id: "vA", who: "james", ch: "ch1", where: "Under the outcome card after choice A",
      text: "It's just paper. [beat] So why does my hand feel like it's holding something heavier?", secs: 5.15 },
    { id: "vB", who: "james", ch: "ch1", where: "Under the outcome card after choice B",
      text: "[panting] I shouldn't have done that. I knew it the second my foot touched it.", secs: 4.36 },
    { id: "vC", who: "james", ch: "ch1", where: "Under the outcome card after choice C",
      text: "Look first. That's all it takes. Just... look first.", secs: 5.07 },
    { id: "vD", who: "james", ch: "ch1", where: "Under the outcome card after choice D",
      text: "Not my offering. Not my business. [exhale] Rest well, whoever you are.", secs: 8.05 },

    // ---- the haunting (the engine's own lines; chapters 1 and 2 have her) ----
    { id: "vghost", who: "james", ch: "haunting", where: "The first time she is seen",
      text: "Am I... seeing things?", secs: 2.27, note: "Whispered." },
    { id: "vscare1", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "Ahh!", secs: 0.91 },
    { id: "vscare2", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "No no no", secs: 1.23 },
    { id: "vscare3", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "Who's there?!", secs: 1.49 },
    { id: "vscare4", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "What is that", secs: 1.88 },
    { id: "vlow", who: "james", ch: "haunting", where: "The first time sanity drops under 30",
      text: "[shaky breathing] My chest... I need to get out of here. Now.", secs: 3.79 },
    { id: "vfaint", who: "james", ch: "haunting", where: "The faint, when sanity reaches zero",
      text: "No... my head... everything's... spinning...", secs: 4.05 },
    { id: "vlost", who: "james", ch: "haunting", where: "The 'lost your nerve' card after the faint",
      text: "[terrified whisper] I can't... I can't be here... [panicked breathing] No. No. No.", secs: 5.8 },

    // ---- chapter 2 · THE PRESENCE -------------------------------------------
    { id: "v2wake1", who: "james", ch: "ch2", where: "Opening film, over black",
      text: "It followed me home.", secs: 2.43 },
    { id: "v2wake2", who: "james", ch: "ch2", where: "Opening film, and nothing answers",
      text: "Ma? Ma, is that you?", secs: 2.51 },
    { id: "v2wake3", who: "james", ch: "ch2", where: "Opening film, under the fade",
      text: "There is someone in the room.", secs: 2.85 },
    { id: "v2near", who: "james", ch: "ch2", where: "Nearing the gap beside the bed",
      text: "It keeps coming from over there, from the wall.", secs: 3.24 },
    { id: "v2gap", who: "james", ch: "ch2", where: "At the gap, when the prompt appears",
      text: "I have slept beside that gap my whole life. Never has this happened.", secs: 4.44 },
    { id: "v2call", who: "james", ch: "ch2", where: "Scene B, calling for Ma",
      text: "MA! MA, COME HERE! PLEASE!", secs: 2.43, note: "Shouted." },
    { id: "v2ma", who: "mother", ch: "ch2", where: "Scene B, the mother at the door",
      text: "Aiyah. What is it now? Go back to sleep, boy. I am here.", secs: 4.99 },
    { id: "v2A", who: "james", ch: "ch2", where: "Under the outcome card after choice A",
      text: "It was already looking at me. It had been the whole time.", secs: 4.75 },
    { id: "v2B", who: "james", ch: "ch2", where: "Under the outcome card after choice B",
      text: "She did not even ask what was wrong. She just left.", secs: 3.63 },
    { id: "v2C", who: "james", ch: "ch2", where: "Under the outcome card after choice C",
      text: "I'm leaving this room. I will sleep in the living room tonight.", secs: 3.08 },
    { id: "v2D", who: "james", ch: "ch2", where: "Under the outcome card after choice D",
      text: "Nothing happened. That is not the same as nothing being there.", secs: 4.6 },

    // ---- chapter 3 · THE GATHERING ------------------------------------------
    { id: "v3wake1", who: "james", ch: "ch3", where: "Opening film",
      text: "They put the tent up on Monday. It is still going.", secs: 5.33 },
    { id: "v3wake2", who: "james", ch: "ch3", where: "Opening film",
      text: "My mother told me not to come down. I came down anyway.", secs: 5.15 },
    { id: "v3wake3", who: "james", ch: "ch3", where: "Opening film, over the crowd",
      text: "Everyone seems fascinated by the performance...", secs: 4.21, note: "Re-said in Chad's words at v4.5." },
    { id: "v3wake4", who: "james", ch: "ch3", where: "Not used",
      text: "That one is looking at me. Nobody else is.", secs: 3.08,
      note: "Lost its place when the ghost left the chapter (v4.3); the file is still in chapter 3's pack." },
    { id: "v3chair", who: "james", ch: "ch3", where: "Opening film, on the one chair",
      text: "There's one chair facing the wrong way. Just one.", secs: 4.75 },
    { id: "v3out1", who: "james", ch: "ch3", where: "Opening film, seeing her on the tarmac",
      text: "She's out there! Standing outside...", secs: 2.93, note: "Re-said in Chad's words at v4.5." },
    { id: "v3out2", who: "james", ch: "ch3", where: "Opening film, the last line",
      text: "She's not coming in.", secs: 2.85 },
    { id: "v3play", who: "james", ch: "ch3", where: "A few seconds after chapter 3 begins",
      text: "I feel better here... but why?", secs: 2.43, note: "Re-said in Chad's words at v4.5." },
    { id: "v3altar", who: "james", ch: "ch3", where: "At the altar, when the prompt appears",
      text: "He has not blinked. Not once.", secs: 3.08 },
    { id: "v3seen", who: "james", ch: "ch3", where: "Scene A",
      text: "He looked at me. Out of all of them... he looked at me.", secs: 6.11 },
    { id: "v3grip", who: "james", ch: "ch3", where: "Scene B",
      text: "His eyes were shut. He was looking at me with his eyes shut.", secs: 5.72 },
    { id: "v3aunt5", who: "granny", ch: "ch3", where: "Scene B, hauling him out",
      text: "Boy, come out of there now. You cannot stand there!", secs: 3.16 },
    { id: "v3aunt1", who: "auntie", ch: "ch3", where: "Scene C",
      text: "That one? He is the tang kee. The god borrows his body.", secs: 4.99 },
    { id: "v3aunt2", who: "auntie", ch: "ch3", where: "Scene C",
      text: "He has done this for thirty years. Watch his hands, not his face.", secs: 4.99 },
    { id: "v3ask", who: "james", ch: "ch3", where: "Scene C",
      text: "Is it real, auntie?", secs: 2.12 },
    { id: "v3aunt3", who: "auntie", ch: "ch3", where: "Scene C",
      text: "Real, not real, I don't know. I know he wakes up tomorrow and drives a lorry.", secs: 5.25 },
    { id: "v3aunt4", who: "auntie", ch: "ch3", where: "Scene C, her last word",
      text: "Listen to me, ah boy. Do not sit in the back row today.", secs: 3.87,
      note: "Re-said for the morning at v4.3 (\"tonight\" became \"today\"). Transcribed from the shipped take at v5.14." },
    { id: "v3left", who: "james", ch: "ch3", where: "Scene D, leaving",
      text: "I could still hear the drum from the lift. I told myself that was normal.", secs: 6.92 },
    { id: "v3A", who: "james", ch: "ch3", where: "Under the outcome card after choice A",
      text: "I did not move. He looked at me anyway.", secs: 3.4 },
    { id: "v3B", who: "james", ch: "ch3", where: "Under the outcome card after choice B",
      text: "I knew better. I went up there anyway.", secs: 3.08 },
    { id: "v3C", who: "james", ch: "ch3", where: "Under the outcome card after choice C",
      text: "She told me the truth. Both halves of it.", secs: 3.87 },
    { id: "v3D", who: "james", ch: "ch3", where: "Under the outcome card after choice D",
      text: "I got out. The drum stopped when I did.", secs: 3.63 },

    // ---- chapter 4 · BACK HOME ----------------------------------------------
    { id: "v4wake1", who: "james", ch: "ch4", where: "Opening film, over black",
      text: "I stayed outside the whole day. Anywhere but here.", secs: 3.32 },
    { id: "v4wake2", who: "james", ch: "ch4", where: "Opening film, the lights on",
      text: "Ma's working late. The flat is empty.", secs: 2.77 },
    { id: "v4wake3", who: "james", ch: "ch4", where: "Opening film, at the window",
      text: "One quiet night. That's all I want.", secs: 2.85 },
    { id: "v4voice", who: "james", ch: "ch4", where: "A few seconds after chapter 4 begins",
      text: "I can do this.", secs: 1.65 },
    { id: "v4near", who: "james", ch: "ch4", where: "Nearing the dining chair",
      text: "Sit down. Breathe. Think it through.", secs: 2.93 },
    { id: "v4sit", who: "james", ch: "ch4", where: "When he sits down to think — on interacting with the chair (v5.30: no longer on walking up to it) — and again as scene A sits down",
      text: "Start from the beginning...", secs: 1.49 },
    { id: "v4thinkA1", who: "james", ch: "ch4", where: "Scene A, the void deck memory",
      text: "The void deck. The hell note. Where it started.", secs: 3.32 },
    { id: "v4thinkA2", who: "james", ch: "ch4", where: "Scene A, the bedroom memory",
      text: "Then my own room. The gap beside my bed. It wasn't random.", secs: 6.43 },
    { id: "v4thinkA3", who: "james", ch: "ch4", where: "Scene A, the red chair memory",
      text: "Same block. Same week. Same me. It's not the places — it's following me.", secs: 9.09 },
    { id: "v4tired", who: "james", ch: "ch4", where: "Scene B, crossing to the sofa",
      text: "Enough. I'm tired. It's nothing — every block has its stories.", secs: 4.83 },
    { id: "v4wake3am", who: "james", ch: "ch4", where: "Scene B, waking at 3 a.m.",
      text: "...the clock. Why can't I hear the clock?", secs: 2.93, note: "Whispered." },
    { id: "v4taunt", who: "james", ch: "ch4", where: "Scene C, to the empty flat",
      text: "You want me?! I'm right here! Come out where I can SEE you!", secs: 4.52, note: "Shouted." },
    { id: "v4regret", who: "james", ch: "ch4", where: "Scene C, after everything stops",
      text: "okay... okay. stupid. stupid. stupid me...", secs: 3.55, note: "Whispered." },
    { id: "v4ma1", who: "mother", ch: "ch4", where: "Scene D, answering the phone",
      text: "Hello? ...Boy? Why you sound like that. What happened?", secs: 4.75, note: "Heard through the handset." },
    { id: "v4call1", who: "james", ch: "ch4", where: "Scene D, on the phone",
      text: "Ma. It's me... no— something's wrong with the flat.", secs: 4.68 },
    { id: "v4call2", who: "james", ch: "ch4", where: "Scene D, on the phone",
      text: "I know how it sounds. Please.", secs: 2.59 },
    { id: "v4ma2", who: "mother", ch: "ch4", where: "Scene D, the promise",
      text: "Listen to me. Tomorrow I ask the temple to send the tang-ki down. He will come and check the whole house. Tonight you don't touch anything ah, you hear me?", secs: 9.56, note: "Heard through the handset." },
    { id: "v4ma3", who: "mother", ch: "ch4", where: "Scene D, before she hangs up",
      text: "Lock the door. Leave the light on for me. I'm coming home soon.", secs: 4.05, note: "Heard through the handset." },
    { id: "v4A", who: "james", ch: "ch4", where: "Under the outcome card after choice A",
      text: "It was never random. It followed me home.", secs: 3.47 },
    { id: "v4B", who: "james", ch: "ch4", where: "Under the outcome card after choice B",
      text: "I ignored it. It did not ignore me.", secs: 3.55 },
    { id: "v4C", who: "james", ch: "ch4", where: "Under the outcome card after choice C",
      text: "I dared it. In my own home. It answered.", secs: 4.52 },
    { id: "v4D", who: "james", ch: "ch4", where: "Under the outcome card after choice D",
      text: "Help is coming tomorrow. I can hold one night.", secs: 4.36 },

    // ---- chapter 5 · THE LESSON ---------------------------------------------
    { id: "v5wake1", who: "james", ch: "ch5", where: "Opening film, over black",
      text: "He actually came.", secs: 2.27 },
    { id: "v5ma1", who: "mother", ch: "ch5", where: "Opening film, at the door",
      text: "Come in, sifu. Come in, come in.", secs: 2.19 },
    { id: "v5wake2", who: "james", ch: "ch5", where: "Opening film, the bow to the kitchen",
      text: "Why is he bowing at the kitchen.", secs: 1.72 },
    { id: "t5note", who: "tangki", ch: "ch5", where: "Opening film, the note set down on the table — his first words in the game",
      text: "Here. [beat] Under where you sit.", secs: 3.55 },
    { id: "v5wake3", who: "james", ch: "ch5", where: "Opening film, the last line",
      text: "That's the hell note. From the void deck. It's been here the whole time.", secs: 6.43 },
    { id: "v5voice", who: "james", ch: "ch5", where: "A few seconds after chapter 5 begins",
      text: "Do I...approach him?", secs: 2.19 },
    { id: "v5near", who: "james", ch: "ch5", where: "Nearing the tang-ki",
      text: "He walked around the flat like he's reading it.", secs: 3.08 },
    { id: "v5sit", who: "james", ch: "ch5", where: "At the tang-ki, when the prompt appears",
      text: "Uncle. What did you see?", secs: 2.43 },
    { id: "t5teachA", who: "tangki", ch: "ch5", where: "Scene A, the teaching at the table",
      text: "Think back. Understand what you did. Seek help before you act. [beat] You know you've done wrong. That is why this morning is quiet.", secs: 10.11,
      note: "Transcribed from the shipped take at v5.14." },
    { id: "t5hallA", who: "tangki", ch: "ch5", where: "Scene A, in the daylit corridor",
      text: "Nothing lives here, boy. It only visits. And visits end.", secs: 6.69 },
    { id: "t5fearB", who: "tangki", ch: "ch5", where: "Scene B, cutting through the fear",
      text: "I cannot help you if you do not open up. But you already know what you did wrong...", secs: 6.53 },
    { id: "v5fearB1", who: "james", ch: "ch5", where: "Scene B, after the release",
      text: "I should never have asked for help. I sound...crazy.", secs: 5.64, note: "Shaky. Transcribed from the shipped take at v5.14." },
    { id: "v5disC1", who: "james", ch: "ch5", where: "Scene C, turning his back on the note",
      text: "Paper. It's just paper.", secs: 2.27 },
    { id: "t5disC", who: "tangki", ch: "ch5", where: "Scene C, quietly, behind him",
      text: "You may call it paper. [beat] Paper burns, and now you're caught in its fire...", secs: 5.96 },
    { id: "t5learnD1", who: "tangki", ch: "ch5", where: "Scene D, at the altar",
      text: "We return what was kept.", secs: 2.59 },
    { id: "v5ma2", who: "mother", ch: "ch5", where: "Scene D, near the burning",
      text: "Thank you, sifu. Thank you.", secs: 2.12 },
    { id: "t5learnD2", who: "tangki", ch: "ch5", where: "Scene D, the episode's last lesson",
      text: "It is finished. What you keep now is the lesson.", secs: 5.56 },
    { id: "v5learnD", who: "james", ch: "ch5", where: "Scene D, quietly, at the end",
      text: "The first one. He says every case teaches you the next.", secs: 4.6 },
    { id: "v5A", who: "james", ch: "ch5", where: "Under the outcome card after choice A",
      text: "I asked him what to learn. He told me. All of it.", secs: 4.05 },
    { id: "v5B", who: "james", ch: "ch5", where: "Under the outcome card after choice B",
      text: "The fear followed me into the morning. When will it go away?", secs: 4.75 },
    { id: "v5C", who: "james", ch: "ch5", where: "Under the outcome card after choice C",
      text: "I called it paper. She heard me.", secs: 2.27 },
    { id: "v5D", who: "james", ch: "ch5", where: "Under the outcome card after choice D",
      text: "It's over. [beat] It's really over.", secs: 2.27 },
    /* v7.1 — EPISODE 2 · CHAPTER 1, THE WORST BED. 37 lines, four speakers.
       Chapter key e2c1; the film, the day, the night, the four scenes and the
       four card lines (`sayPrefix: 'n1'`). */
    { id: "n1pro1", who: "jamesTeen", ch: "e2c1", where: "Opening film: inside the ferry",
      text: "Finally eighteen. The biggest and most dreaded milestone in the lives of most young men here, including mine. National Service. I boarded the seven a.m. ferry with the other fresh recruits, begrudgingly. Nobody was talking to anybody. Not yet.", secs: 17.79 },
    { id: "n1pro1b", who: "jamesTeen", ch: "e2c1", where: "Opening film: the parade square",
      text: "We got sorted into our companies. I got into Hawk Coy. Whatever that means.", secs: 5.49 },
    { id: "n1pro2", who: "jamesTeen", ch: "e2c1", where: "Opening film: the bunk",
      text: "Nine of us to a bunk. Two rows of double-deck beds, and a sergeant walking the line with a clipboard.", secs: 6.84 },
    { id: "n1pro3", who: "jamesTeen", ch: "e2c1", where: "Opening film: bed one",
      text: "Bed one. Right next to the toilet door. The worst spot in the room, and the one nobody wanted.", secs: 6.27 },
    { id: "n1pro4", who: "jamesTeen", ch: "e2c1", where: "Opening film: lights out",
      text: "I told myself it didn't matter where you slept... but I was wrong...", secs: 4.68 },
    { id: "n1voice", who: "jamesTeen", ch: "e2c1", where: "Seconds after play begins",
      text: "First day. Just get through it.", secs: 2.35 },
    { id: "n1near", who: "jamesTeen", ch: "e2c1", where: "Nearing his bed",
      text: "That's mine. Bed one.", secs: 2.04 },
    { id: "n1act", who: "jamesTeen", ch: "e2c1", where: "The decision opens, 03:00",
      text: "Nobody else is moving. Nobody else can hear it?", secs: 4.21 },
    { id: "n1fallin", who: "jamesTeen", ch: "e2c1", where: "The whistle",
      text: "That's the whistle. Go, go.", secs: 1.8 },
    { id: "n1late", who: "jamesTeen", ch: "e2c1", where: "Late to the fall-in line",
      text: "Twenty push-ups. On day one.", secs: 2.77 },
    { id: "n1bedok", who: "jamesTeen", ch: "e2c1", where: "A good standby bed",
      text: "Done. Pillow, blanket, boots, all of it.", secs: 3.08 },
    { id: "n1bedfail", who: "jamesTeen", ch: "e2c1", where: "A failed standby bed",
      text: "Again. The whole bunk, because of me.", secs: 2.85 },
    { id: "n1shower", who: "jamesTeen", ch: "e2c1", where: "The shower block by day",
      text: "Just a shower block. Tiles, a drain, a timer tap.", secs: 4.05 },
    { id: "n1board", who: "jamesTeen", ch: "e2c1", where: "The notice board",
      text: "Week two. Live firing.", secs: 2.12 },
    { id: "n1lights", who: "jamesTeen", ch: "e2c1", where: "Lights out",
      text: "Ten o'clock. Lights out.", secs: 2.04 },
    { id: "n1wake", who: "jamesTeen", ch: "e2c1", where: "03:00, waking",
      text: "...what time is it.", secs: 1.72 },
    { id: "n1hear", who: "jamesTeen", ch: "e2c1", where: "The shower starts",
      text: "The shower. Somebody's in the shower. At three in the morning.", secs: 4.44 },
    { id: "n1A1", who: "jamesTeen", ch: "e2c1", where: "Scene A, at the block door",
      text: "Nobody. The water's running and there's nobody.", secs: 3.55 },
    { id: "n1omg", who: "jamesTeen", ch: "e2c1", where: "Scene A: the water stops by itself",
      text: "Oh my god...", secs: 1.65 },
    { id: "n1A2", who: "jamesTeen", ch: "e2c1", where: "Scene A, the last frame",
      text: "...there was someone at the end of the corridor.", secs: 2.51 },
    { id: "n1B1", who: "jamesTeen", ch: "e2c1", where: "Scene B, lying still",
      text: "Just listen. Don't decide what it is. Just listen.", secs: 4.13 },
    { id: "n1B2", who: "jamesTeen", ch: "e2c1", where: "Scene B, the water stops",
      text: "It stopped. By itself.", secs: 2.51 },
    { id: "n1C1", who: "jamesTeen", ch: "e2c1", where: "Scene C, a whisper to the next bed",
      text: "Eh. You awake?", secs: 1.65 },
    { id: "n1D1", who: "jamesTeen", ch: "e2c1", where: "Scene D, under the blanket",
      text: "It's nothing. It's nothing. It's nothing.", secs: 2.43 },
    { id: "n1A", who: "jamesTeen", ch: "e2c1", where: "Under the outcome card after choice A",
      text: "I got up and looked. I found water, and nothing else, and a corridor I did not like.", secs: 6.69 },
    { id: "n1B", who: "jamesTeen", ch: "e2c1", where: "Under the outcome card after choice B",
      text: "I stayed still and listened. What I heard was a sound. What it meant, I did not know yet.", secs: 7.16 },
    { id: "n1C", who: "jamesTeen", ch: "e2c1", where: "Under the outcome card after choice C",
      text: "I asked the one person who could tell me. He heard nothing. That was worth knowing.", secs: 6.03 },
    { id: "n1D", who: "jamesTeen", ch: "e2c1", where: "Under the outcome card after choice D",
      text: "I decided what it was before I knew anything. Under the blanket, the water kept running.", secs: 6.35 },
    { id: "s1fallin", who: "sergeant", ch: "e2c1", where: "The whistle",
      text: "Fall in! Fall in! Move it, move it!", secs: 3.16 },
    { id: "e1knock", who: "encik", ch: "e2c1", where: "The fall-in ends: the whole section is knocked down",
      text: "Ah! Take your time some more! Whole lot, knock it down! Twenty push-ups! Go!", secs: 7.31 },
    { id: "e1backbunk", who: "encik", ch: "e2c1", where: "The push-ups done: back to the bunk",
      text: "Now! Go back to your bunk! I want standby bed, now!", secs: 4.44 },
    { id: "s1late", who: "sergeant", ch: "e2c1", where: "Late to the line",
      text: "You! Last one! Twenty push-ups, now!", secs: 3.4 },
    { id: "s1bed", who: "sergeant", ch: "e2c1", where: "Opening film: bed one",
      text: "Bed one. Next to the toilet. Nobody wants it, so it's yours.", secs: 4.91 },
    { id: "s1standby", who: "sergeant", ch: "e2c1", where: "The standby bed",
      text: "Standby bed! Sixty seconds! Go!", secs: 3.08 },
    { id: "s1again", who: "sergeant", ch: "e2c1", where: "A failed standby bed",
      text: "Whole bunk! Do it again!", secs: 1.96 },
    { id: "s1lights", who: "sergeant", ch: "e2c1", where: "Lights out",
      text: "Lights out! No talking!", secs: 2.27 },
    { id: "b1day", who: "buddy", ch: "e2c1", where: "The buddy hotspot, by day",
      text: "Eh, you kena the toilet bed ah. Good luck, bro.", secs: 3.08 },
    { id: "b1sleep", who: "buddy", ch: "e2c1", where: "Lights out",
      text: "Sleep lah. Tomorrow got range.", secs: 2.19 },
    { id: "b1huh", who: "buddy", ch: "e2c1", where: "Scene C",
      text: "Huh? ...what? Go sleep lah.", secs: 3.4 },
    { id: "k1board", who: "bunkmate", ch: "e2c1", where: "The notice board hotspot",
      text: "Week two, live firing. Confirm plus chop.", secs: 3 },
    { id: "k1three", who: "bunkmate", ch: "e2c1", where: "The bunkmate hotspot, by day",
      text: "The three a.m. one? Heard before. Never looked.", secs: 4.05 },
    /* v9.3, Chad: "When running back to the bunk, i want some bunkmates to
       shout 'eh hurry up la, later get pushups again'." His words exactly,
       said by TWO of them a beat apart — one clip played twice reads as a
       bug, and "some bunkmates" is more than one man. */
    { id: "b1hurry", who: "buddy", ch: "e2c1", where: "Running back to the bunk, after the push-ups",
      text: "Eh, hurry up la! Later get push-ups again!", secs: 2.16 },
    { id: "k1hurry", who: "bunkmate", ch: "e2c1", where: "Running back to the bunk, a beat after the buddy",
      text: "Eh, hurry up la! Later get push-ups again!", secs: 2.72 },
    /* v9.5, Chad: "everything in episode 2, despite all these new
       interactions and minigames, should all still link back to spiritual
       stuff. I don't want to veer too far off into a military sim game."
       THE HEADCOUNT is that instruction made into a beat: an ordinary army
       strength check, counted correctly by nine men, that comes out at ten.
       `e1extra` REPLACES `e1backbunk` as the order back to the bunk — the
       older line is kept in the registry and in the pack because it is still
       what a resume hears when the shout is already spent. */
    { id: "e1count", who: "encik", ch: "e2c1", where: "The push-ups done: report strength",
      text: "Stand up! All of you! I want strength! Number off! From the right! Now!", secs: 5.25 },
    { id: "n1one", who: "jamesTeen", ch: "e2c1", where: "The count-off: he is first",
      text: "One!", secs: 0.99 },
    { id: "c1two", who: "buddy", ch: "e2c1", where: "The count-off", text: "Two!", secs: 0.47 },
    { id: "c1three", who: "bunkmate", ch: "e2c1", where: "The count-off", text: "Three!", secs: 0.55 },
    { id: "c1four", who: "buddy", ch: "e2c1", where: "The count-off", text: "Four!", secs: 0.55 },
    { id: "c1five", who: "bunkmate", ch: "e2c1", where: "The count-off", text: "Five!", secs: 0.52 },
    { id: "c1six", who: "buddy", ch: "e2c1", where: "The count-off", text: "Six!", secs: 0.68 },
    { id: "c1seven", who: "bunkmate", ch: "e2c1", where: "The count-off", text: "Seven!", secs: 0.55 },
    { id: "c1eight", who: "buddy", ch: "e2c1", where: "The count-off", text: "Eight!", secs: 0.65 },
    { id: "c1nine", who: "bunkmate", ch: "e2c1", where: "The count-off: the last man in the section", text: "Nine!", secs: 0.63 },
    { id: "c1ten", who: "ghost", ch: "e2c1", where: "The count-off: the number nobody called",
      text: "Ten.", secs: 2.17 },
    { id: "e1extra", who: "encik", ch: "e2c1", where: "The headcount comes out one too many",
      text: "Ten? Who say ten? I only got nine recruits in this section. Nine! ...Never mind. Go back to your bunk. I want standby bed. Now!", secs: 9.8 },
    { id: "e1rope", who: "encik", ch: "e2c1", where: "The standby bed passed: one item too many",
      text: "Eh! Bed one recruit! Why your standby bed got an extra set of toggle rope? You better return it to your buddy!", secs: 6.53 },
    { id: "n1rope", who: "jamesTeen", ch: "e2c1", where: "After the encik walks off, to himself",
      text: "I didn't know where this toggle rope came from. I'm sure I only had one... never mind...", secs: 5.72 },
    /* v9.6, Chad: "If the player enters the toilet during the free interaction
       time, make it obvious that the semi-transparent FBO soldier is standing
       at the shower area that is the same one that will be turned on later at
       3am ... Player has a voiceline saying 'wait, is there someone in
       there?'" His words, with one added ellipsis (the v5.28 rule) — and the
       take was picked for the 0.26 s HESITATION it puts in the middle of the
       question, because the line is a man stopping in a doorway. */
    { id: "n1ghost", who: "jamesTeen", ch: "e2c1", where: "The evening: someone is standing in the shower block",
      text: "Wait... is there someone in there?", secs: 3.16 },

    // ---- episode 2 · chapter 2 · NOBODY THERE ---------------------------
    /* v10.0 — the film's one line, in Chad's words; the four things he says
       to the encik (the decision's options, spoken as each scene opens); two
       lines to himself; the four card lines. The encik's lines are Chad's
       verbatim, written under his bark rule; the three bunkmates' are his too.
       docs/V10.0-E2C2-PLAN.md. */
    { id: "n2pro1", who: "jamesTeen", ch: "e2c2", where: "The opening film: the first night, from his pillow",
      text: "Night after night, this kept happening.", secs: 2.43 },
    { id: "n2pro2", who: "jamesTeen", ch: "e2c2", where: "The opening film: the fourth night, the clock turning to three",
      text: "I noticed it only starts when the clock hits 3am... Surely, this is not just my imagination...", secs: 7.71 },
    { id: "n2pro", who: "jamesTeen", ch: "e2c2", where: "The opening film, over black, after the fourth night",
      text: "I've had enough. Today, I decided to bring it up to my bunkmates... and the encik...", secs: 6.72 },
    { id: "b2hear", who: "buddy", ch: "e2c2", where: "Breakfast: asked what he heard (SUPERSEDED at v10.1 by r2hear; the file stays in the pack, nothing cues it)",
      text: "Bro, you also heard it? It starts at 3am every night, I swear...", secs: 6.32 },
    { id: "r2hear", who: "recruit4", ch: "e2c2", where: "Breakfast: asked what he heard",
      text: "Bro, you also heard it? It starts at 3am every night, I swear...", secs: 5.25 },
    { id: "k2three", who: "bunkmate", ch: "e2c2", where: "Breakfast: asked what he heard",
      text: "I didn't hear anything, but I heard from others that bed one is the problem...", secs: 4.64 },
    { id: "r2siao", who: "recruit3", ch: "e2c2", where: "Breakfast: asked what he heard",
      text: "Siao eh, you think too much la. Where got ghost?", secs: 3.2 },
    { id: "n2known", who: "jamesTeen", ch: "e2c2", where: "Breakfast: to himself, after the third bunkmate has answered",
      text: "I think I'm not the only one who knows about this...", secs: 3.0 },
    { id: "e2hurry", who: "encik", ch: "e2c2", where: "Breakfast: the encik shouts the table back to its food, right after that thought",
      text: "Hurry up and eat, fall in soon!", secs: 2.93 },

    /* ---- v11.0 · EPISODE 2 · CHAPTER 3 · THE PRESSURE. Aaron under the v5.28
       rule (one emotion tag, the registry's words); the buddy (Edison); the
       sergeant (George) LOW here for the first time, not under [shouting].
       Lengths measured on the installed files (masters/v11.0/make.sh). */
    { id: "n3pro1", who: "jamesTeen", ch: "e2c3", where: "The film opens: on the tonner at last light (Chad's words)",
      text: "[quietly] I thought the shower incident was going to be the only strange encounter in my army life. It wasn't.", secs: 6.35 },
    { id: "n3pro2", who: "jamesTeen", ch: "e2c3", where: "The film: the road still unrolling (Chad's words)",
      text: "[tired] Months later, I was posted to Infantry... and here we are, on the first night of our outfield exercise...", secs: 7.24 },
    { id: "n3pro3", who: "jamesTeen", ch: "e2c3", where: "The film: the walk in as the light goes",
      text: "[quietly] We walked in as the light went. Dug our scrapes. Then there was nothing to do but wait for morning.", secs: 6.35 },
    { id: "n3pro4", who: "jamesTeen", ch: "e2c3", where: "The film: the harbour at night, coming down into his scrape — the source's own words",
      text: "[quietly] I was at the very rear of my section. Facing away from the others. Looking out into the dark.", secs: 7.39 },
    { id: "n3spot1", who: "jamesTeen", ch: "e2c3", where: "Play: the torch on the strangler fig",
      text: "[uneasy] Everything out here looks like something else.", secs: 3.16 },
    { id: "n3spot2", who: "jamesTeen", ch: "e2c3", where: "Play: the torch on the fallen log",
      text: "[quietly] Wet. Everything is wet.", secs: 2.69 },
    { id: "n3spot3", who: "jamesTeen", ch: "e2c3", where: "Play: the torch on the gap between two trunks",
      text: "[uneasy] You could walk in there and never come out.", secs: 2.85 },
    { id: "n3spot5", who: "jamesTeen", ch: "e2c3", where: "Play: the torch on the commander's chemlights across the ring",
      text: "[quietly] Nobody's sleeping. Everyone's pretending.", secs: 2.93 },
    { id: "n3spot6", who: "jamesTeen", ch: "e2c3", where: "Play: the torch on the ground at his own feet — the last spot",
      text: "[tired] Just a scrape. Just a night. Sleep when you can, they said.", secs: 5.49 },
    { id: "n3press", who: "jamesTeen", ch: "e2c3", where: "Play: THE PRESSURE, on the frame the shake ends (Chad's words)",
      text: "[terrified] Something was pressing against my leg. Not just a sensation — there was actual weight to it!", secs: 6.77 },
    { id: "n3look", who: "jamesTeen", ch: "e2c3", where: "Play: the torch held on the ground at his feet (Chad's words)",
      text: "[frightened] Nothing around... no one... no footsteps... not even the sound of vegetation moving around me.", secs: 7.16 },
    { id: "n3still", who: "jamesTeen", ch: "e2c3", where: "Play: the line the decision opens on (Chad's words)",
      text: "[frightened] But I still feel the pressure on my leg...", secs: 2.69 },
    { id: "n3A1", who: "jamesTeen", ch: "e2c3", where: "Scene A: after the turn, the beam on the empty litter",
      text: "[shaken] ...gone. Whatever it was. As soon as the light touched it.", secs: 4.05 },
    { id: "n3A2", who: "jamesTeen", ch: "e2c3", where: "Scene A: the last line",
      text: "[quietly] I didn't chase it.", secs: 1.96 },
    { id: "n3B1", who: "jamesTeen", ch: "e2c3", where: "Scene B: the hand back out of the leaves",
      text: "[frightened] Cold. Something was there. Something moved.", secs: 3.63 },
    { id: "n3B2", who: "jamesTeen", ch: "e2c3", where: "Scene B: the last line",
      text: "[quietly] I should have looked first.", secs: 2.04 },
    { id: "n3C1", who: "jamesTeen", ch: "e2c3", where: "Scene C: whispered to the next scrape (round the voice bus, a whisper)",
      text: "[whispering] Eh. You feel that?", secs: 2.12 },
    { id: "n3C2", who: "jamesTeen", ch: "e2c3", where: "Scene C: his answer, whispered",
      text: "[whispering] ...my leg. Something pressed on it.", secs: 2.51 },
    { id: "n3D1", who: "jamesTeen", ch: "e2c3", where: "Scene D: out loud, across the harbour",
      text: "[nervous] Who's there?", secs: 1.65 },
    { id: "n3D2", who: "jamesTeen", ch: "e2c3", where: "Scene D: the last line — it stopped when he asked",
      text: "[quietly] It stopped. Right when I asked.", secs: 3.16 },
    { id: "n3A", who: "jamesTeen", ch: "e2c3", where: "The outcome card, choice A",
      text: "[quietly] I put the light on it before I moved. It ran. Light was the one thing it wouldn't stay for.", secs: 6.77 },
    { id: "n3B", who: "jamesTeen", ch: "e2c3", where: "The outcome card, choice B",
      text: "[shaken] I reached into the dark before I looked. My hand still remembers what moved.", secs: 5.41 },
    { id: "n3C", who: "jamesTeen", ch: "e2c3", where: "The outcome card, choice C",
      text: "[quietly] I asked him. He felt nothing. Two of us, one night, two different nights.", secs: 8.12 },
    { id: "n3D", who: "jamesTeen", ch: "e2c3", where: "The outcome card, choice D",
      text: "[quietly] I called out to it. It stopped the moment I did. I gave it my voice.", secs: 6.35 },
    { id: "b3here", who: "buddy", ch: "e2c3", where: "Play: the torch lands on him, eyes shut",
      text: "[sleepy] Eh. Torch off, lah. Save battery.", secs: 3.16 },
    { id: "b3C1", who: "buddy", ch: "e2c3", where: "Scene C: to the whisper",
      text: "[whispering] Feel what?", secs: 2.43 },
    { id: "b3C2", who: "buddy", ch: "e2c3", where: "Scene C: his torch on his own legs, then out",
      text: "[whispering] Nothing there. Maybe root. Or you fell asleep sitting.", secs: 4.36 },
    { id: "b3C3", who: "buddy", ch: "e2c3", where: "Scene C: not laughing",
      text: "[quietly, serious] Face the front. I face mine. Relief at four.", secs: 4.83 },
    { id: "b3D", who: "buddy", ch: "e2c3", where: "Scene D: after the shout",
      text: "[annoyed, whispering] Siao ah?", secs: 1.49 },
    { id: "s3brief", who: "sergeant", ch: "e2c3", where: "The film: the brief at the drop-off, low",
      text: "[low, firm] Single file. Five metres. Nobody talks. We harbour before dark.", secs: 6.19 },
    { id: "s3hiss", who: "sergeant", ch: "e2c3", where: "Scene D: the hiss from the far scrape",
      text: "[angry whisper] TWO. Shut up.", secs: 1.88 },
    { id: "n2askA", who: "jamesTeen", ch: "e2c2", where: "Scene A opens: what he says to the encik",
      text: "Encik, something happened. I don't know what.", secs: 3.52 },
    { id: "e2A", who: "encik", ch: "e2c2", where: "Scene A: the encik's answer, before he walks off",
      text: "Good. Don't know means don't know. Go eat and don't think too much... Put your focus on the live range tomorrow. I will check your bunk tonight...", secs: 9.92 },
    { id: "n2askB", who: "jamesTeen", ch: "e2c2", where: "Scene B opens: what he says to the encik",
      text: "Encik, the bunk is haunted. I'm sure.", secs: 2.32 },
    { id: "e2saw", who: "encik", ch: "e2c2", where: "Scene B: the encik's challenge",
      text: "You saw?", secs: 0.88 },
    { id: "n2nobut", who: "jamesTeen", ch: "e2c2", where: "Scene B: cut off",
      text: "No, but—", secs: 1.68 },
    { id: "e2cock", who: "encik", ch: "e2c2", where: "Scene B: the encik shuts it down; the table goes quiet",
      text: "Don't talk cock! Go back and eat your breakfast!", secs: 3.04 },
    { id: "n2B1", who: "jamesTeen", ch: "e2c2", where: "Scene B: to himself, the whole table looking",
      text: "Guess only I know what is happening...", secs: 2.72 },
    { id: "n2askC", who: "jamesTeen", ch: "e2c2", where: "Scene C opens: what he says to the encik",
      text: "Never mind encik, I think I was just tired.", secs: 2.96 },
    { id: "e2ok", who: "encik", ch: "e2c2", where: "Scene C: after a look that lasts a beat too long (SUPERSEDED at v10.8 by e2hmm; the file stays in the pack, nothing cues it)",
      text: "Ok.", secs: 0.64 },
    /* v10.8 (Chad): "make the encik go 'hmmmm.... okay...' in a more contemplative
       tone" — under his bark rule (no stage direction), the pause written as dots */
    { id: "e2hmm", who: "encik", ch: "e2c2", where: "Scene C: after a look that lasts a beat too long — contemplative, not a verdict",
      text: "Hmmmm.... okay...", secs: 1.92 },
    /* v10.8 (Chad): "the voiceline should have a 'defeated sigh' sound, before his
       voiceline of 'i should've just told him...'" — a wordless exhale, which still
       needs voiceable text for the tag to shape (v4.8's law). Routed round the
       voice bus with the whispers (WHISPER_TAKES). */
    { id: "n2sigh", who: "jamesTeen", ch: "e2c2", where: "Scene C: three in the morning, awake — a defeated sigh before the line",
      text: "[sighs] Haaahh...", secs: 2.56, note: "Wordless. The tag shapes the breath; the text gives eleven_v3 something to voice." },
    { id: "n2C1", who: "jamesTeen", ch: "e2c2", where: "Scene C: three in the morning, awake, it has started again",
      text: "I should have just told him...", secs: 1.76 },
    { id: "n2alone", who: "jamesTeen", ch: "e2c2", where: "Scene C: after that — what backing down bought him",
      text: "[quietly, hopeless] Now I'm alone with this... every single night.", secs: 4.64 },
    { id: "n2askD", who: "jamesTeen", ch: "e2c2", where: "Scene D opens: what he says to the encik",
      text: "Encik, what do you think it is?", secs: 1.92 },
    { id: "e2D1", who: "encik", ch: "e2c2", where: "Scene D: the encik's three answers",
      text: "Old block la.... Plumbing issue.... Or you're just too tired....", secs: 3.92 },
    { id: "e2D2", who: "encik", ch: "e2c2", where: "Scene D: the shrug, and the rule",
      text: "And if it's not those two, mind your own business and don't disturb it.", secs: 6.24 },
    { id: "n2A", who: "jamesTeen", ch: "e2c2", where: "Under outcome card A",
      text: "I told him what I knew, and only that. He didn't laugh.", secs: 3.76 },
    { id: "n2B", who: "jamesTeen", ch: "e2c2", where: "Under outcome card B",
      text: "I said I was sure. I wasn't. Now nobody will listen.", secs: 4.56 },
    { id: "n2C", who: "jamesTeen", ch: "e2c2", where: "Under outcome card C",
      text: "I called it nothing. It wasn't nothing. Three a.m. knew that.", secs: 4.48 },
    { id: "n2D", who: "jamesTeen", ch: "e2c2", where: "Under outcome card D",
      text: "He gave me three answers and one rule. The rule was the answer.", secs: 6.16 }
  ];

  // What a chapter key means on the sheet.
  const CHAPTERS = {
    ch1: "Chapter 1 · The Hell Note", ch2: "Chapter 2 · The Presence",
    ch3: "Chapter 3 · The Gathering", ch4: "Chapter 4 · Back Home",
    ch5: "Chapter 5 · The Lesson", haunting: "Chapters 1 and 2 · the haunting",
    e2c1: "Episode 2 · Chapter 1 · The Worst Bed",
    e2c2: "Episode 2 · Chapter 2 · Nobody There",
    e2c3: "Episode 2 · Chapter 3 · The Pressure"
  };

  window.__VOICE__ = { SPEAKERS, LINES, CHAPTERS };
})();
