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
    james:  { name: "James (the player)", voice: "v6KgbPaQh6lAmMpmmtcH", model: "eleven_v3" },
    mother: { name: "Ma (his mother)", voice: "XrExE9yKIg1WjnnlVkGX", model: "eleven_v3",
              note: "Matilda. Chapter 2's mother at the door, chapter 4's Ma on the phone (EQ'd through the handset), chapter 5's Ma in the room." },
    auntie: { name: "The auntie at the paper table (chapter 3)", voice: "Xb7hH8MSUJpSbSDYk0k2", model: "eleven_v3",
              note: "Alice." },
    tangki: { name: "The tang-ki (chapters 3 and 5)", voice: "pqHfZKP75CvOlQylNhV4", model: "eleven_v3",
              note: "Bill. He speaks only in chapter 5." }
  };

  const LINES = [
    // ---- chapter 1 · THE HELL NOTE ------------------------------------------
    { id: "voice", who: "james", ch: "ch1", where: "A few seconds after chapter 1 begins",
      text: "Almost midnight... and this is the only way home.", secs: 4.44,
      note: "Its own file (assets/voice.mp3), not in the sound pack." },
    { id: "vpile", who: "james", ch: "ch1", where: "The first time you come near the burner",
      text: "Someone's been burning offerings. [beat] Is it Seventh Month already?", secs: 5.41 },
    { id: "vnote", who: "james", ch: "ch1", where: "The first time the note prompt appears",
      text: "There's one right at my feet. Like it was left for me.", secs: 3.87 },
    { id: "vgasp", who: "james", ch: "ch1", where: "Scene A, when he looks up and she is there; also chapter 2 scene A",
      text: "[a sharp, frightened inhale] Oh my God.", secs: 1.31, note: "Meant as a wordless gasp; the take also says the words (found by transcription at v5.14, as vrelief's were at v4.8)." },
    { id: "vscoff", who: "james", ch: "ch1", where: "Scene B, on the kick",
      text: "[a short, dismissive laugh] It's just paper.", secs: 2.27, note: "Meant as a wordless scoff; the take also says the words (found by transcription at v5.14)." },
    { id: "vpant", who: "james", ch: "ch1", where: "Scene B, under the run; also chapter 3 scene B",
      text: "[running out of breath] No, no, no, no, no.", secs: 2.19, note: "Meant as wordless panting; the take also says the words (found by transcription at v5.14)." },
    { id: "vrelief", who: "james", ch: "ch1", where: "Scene C, after he walks away; also chapter 2 scenes B and D, chapter 3 scene D, chapter 4 scene D",
      text: "[a quiet, shaken exhale — no words]", secs: 3.47,
      note: "Wordless since v4.8 (the first take turned out to say 'Just keep walking. Don't look back')." },
    { id: "vchantline", who: "james", ch: "ch1", where: "Not used",
      text: "Namo tassa bhagavato arahato sammāsambuddhassa. I'm sorry. I'll go.", secs: 12.59,
      note: "Retired at v3.7's cutscene pass; the file is still in the shared pack. Transcribed from the shipped take at v5.14." },
    { id: "vA", who: "james", ch: "ch1", where: "Under the outcome card after choice A",
      text: "It's just paper. [beat] So why does my hand feel like it's holding something heavier?", secs: 6.27 },
    { id: "vB", who: "james", ch: "ch1", where: "Under the outcome card after choice B",
      text: "[panting] I shouldn't have done that. I knew it the second my foot touched it.", secs: 5.49 },
    { id: "vC", who: "james", ch: "ch1", where: "Under the outcome card after choice C",
      text: "Look first. That's all it takes. Just... look first.", secs: 8.20 },
    { id: "vD", who: "james", ch: "ch1", where: "Under the outcome card after choice D",
      text: "Not my offering. Not my business. [exhale] Rest well, whoever you are.", secs: 9.48 },

    // ---- the haunting (the engine's own lines; chapters 1 and 2 have her) ----
    { id: "vghost", who: "james", ch: "haunting", where: "The first time she is seen",
      text: "Am I... seeing things?", secs: 2.69, note: "Whispered." },
    { id: "vscare1", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "Ahh!", secs: 1.65 },
    { id: "vscare2", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "No no no", secs: 1.31 },
    { id: "vscare3", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "Who's there?!", secs: 1.96 },
    { id: "vscare4", who: "james", ch: "haunting", where: "Each time she reappears — the four scares take turns",
      text: "What is that", secs: 2.77 },
    { id: "vlow", who: "james", ch: "haunting", where: "The first time sanity drops under 30",
      text: "[shaky breathing] My chest... I need to get out of here. Now.", secs: 5.07 },
    { id: "vfaint", who: "james", ch: "haunting", where: "The faint, when sanity reaches zero",
      text: "No... my head... everything's... spinning...", secs: 7.24 },
    { id: "vlost", who: "james", ch: "haunting", where: "The 'lost your nerve' card after the faint",
      text: "[terrified whisper] I can't... I can't be here... [panicked breathing] No. No. No.", secs: 8.12 },

    // ---- chapter 2 · THE PRESENCE -------------------------------------------
    { id: "v2wake1", who: "james", ch: "ch2", where: "Opening film, over black",
      text: "It followed me home.", secs: 2.04 },
    { id: "v2wake2", who: "james", ch: "ch2", where: "Opening film, and nothing answers",
      text: "Ma? Ma, is that you?", secs: 2.59 },
    { id: "v2wake3", who: "james", ch: "ch2", where: "Opening film, under the fade",
      text: "There is someone in the room.", secs: 2.04 },
    { id: "v2near", who: "james", ch: "ch2", where: "Nearing the gap beside the bed",
      text: "It keeps coming from over there, from the wall.", secs: 3.55 },
    { id: "v2gap", who: "james", ch: "ch2", where: "At the gap, when the prompt appears",
      text: "I have slept beside that gap my whole life. Never has this happened.", secs: 5.72 },
    { id: "v2call", who: "james", ch: "ch2", where: "Scene B, calling for Ma",
      text: "MA! MA, COME HERE! PLEASE!", secs: 3.97, note: "Shouted." },
    { id: "v2ma", who: "mother", ch: "ch2", where: "Scene B, the mother at the door",
      text: "Aiyah. What is it now? Go back to sleep, boy. I am here.", secs: 4.99 },
    { id: "v2A", who: "james", ch: "ch2", where: "Under the outcome card after choice A",
      text: "It was already looking at me. It had been the whole time.", secs: 4.75 },
    { id: "v2B", who: "james", ch: "ch2", where: "Under the outcome card after choice B",
      text: "She did not even ask what was wrong. She just left.", secs: 4.75 },
    { id: "v2C", who: "james", ch: "ch2", where: "Under the outcome card after choice C",
      text: "I'm leaving this room. I will sleep in the living room tonight.", secs: 4.05 },
    { id: "v2D", who: "james", ch: "ch2", where: "Under the outcome card after choice D",
      text: "Nothing happened. That is not the same as nothing being there.", secs: 5.15 },

    // ---- chapter 3 · THE GATHERING ------------------------------------------
    { id: "v3wake1", who: "james", ch: "ch3", where: "Opening film",
      text: "They put the tent up on Monday. It is still going.", secs: 4.05 },
    { id: "v3wake2", who: "james", ch: "ch3", where: "Opening film",
      text: "My mother told me not to come down. I came down anyway.", secs: 4.75 },
    { id: "v3wake3", who: "james", ch: "ch3", where: "Opening film, over the crowd",
      text: "Everyone seems fascinated by the performance...", secs: 2.77, note: "Re-said in Chad's words at v4.5." },
    { id: "v3wake4", who: "james", ch: "ch3", where: "Not used",
      text: "That one is looking at me. Nobody else is.", secs: 3.40,
      note: "Lost its place when the ghost left the chapter (v4.3); the file is still in chapter 3's pack." },
    { id: "v3chair", who: "james", ch: "ch3", where: "Opening film, on the one chair",
      text: "There's one chair facing the wrong way. Just one.", secs: 3.71 },
    { id: "v3out1", who: "james", ch: "ch3", where: "Opening film, seeing her on the tarmac",
      text: "She's out there! Standing outside...", secs: 2.43, note: "Re-said in Chad's words at v4.5." },
    { id: "v3out2", who: "james", ch: "ch3", where: "Opening film, the last line",
      text: "She's not coming in.", secs: 1.80 },
    { id: "v3play", who: "james", ch: "ch3", where: "A few seconds after chapter 3 begins",
      text: "I feel better here... but why?", secs: 3.63, note: "Re-said in Chad's words at v4.5." },
    { id: "v3altar", who: "james", ch: "ch3", where: "At the altar, when the prompt appears",
      text: "He has not blinked. Not once.", secs: 3.24 },
    { id: "v3seen", who: "james", ch: "ch3", where: "Scene A",
      text: "He looked at me. Out of all of them... he looked at me.", secs: 6.35 },
    { id: "v3grip", who: "james", ch: "ch3", where: "Scene B",
      text: "His eyes were shut. He was looking at me with his eyes shut.", secs: 5.15 },
    { id: "v3aunt5", who: "auntie", ch: "ch3", where: "Scene B, hauling him out",
      text: "Boy, come out of there now. You cannot stand there!", secs: 3.32 },
    { id: "v3aunt1", who: "auntie", ch: "ch3", where: "Scene C",
      text: "That one? He is the tang kee. The god borrows his body.", secs: 4.99 },
    { id: "v3aunt2", who: "auntie", ch: "ch3", where: "Scene C",
      text: "He has done this for thirty years. Watch his hands, not his face.", secs: 4.99 },
    { id: "v3ask", who: "james", ch: "ch3", where: "Scene C",
      text: "Is it real, auntie?", secs: 1.41 },
    { id: "v3aunt3", who: "auntie", ch: "ch3", where: "Scene C",
      text: "Real, not real, I don't know. I know he wakes up tomorrow and drives a lorry.", secs: 5.25 },
    { id: "v3aunt4", who: "auntie", ch: "ch3", where: "Scene C, her last word",
      text: "Listen to me, ah boy. Do not sit in the back row today.", secs: 3.87,
      note: "Re-said for the morning at v4.3 (\"tonight\" became \"today\"). Transcribed from the shipped take at v5.14." },
    { id: "v3left", who: "james", ch: "ch3", where: "Scene D, leaving",
      text: "I could still hear the drum from the lift. I told myself that was normal.", secs: 5.49 },
    { id: "v3A", who: "james", ch: "ch3", where: "Under the outcome card after choice A",
      text: "I did not move. He looked at me anyway.", secs: 3.55 },
    { id: "v3B", who: "james", ch: "ch3", where: "Under the outcome card after choice B",
      text: "I knew better. I went up there anyway.", secs: 3.71 },
    { id: "v3C", who: "james", ch: "ch3", where: "Under the outcome card after choice C",
      text: "She told me the truth. Both halves of it.", secs: 3.97 },
    { id: "v3D", who: "james", ch: "ch3", where: "Under the outcome card after choice D",
      text: "I got out. The drum stopped when I did.", secs: 3.32 },

    // ---- chapter 4 · BACK HOME ----------------------------------------------
    { id: "v4wake1", who: "james", ch: "ch4", where: "Opening film, over black",
      text: "I stayed outside the whole day. Anywhere but here.", secs: 4.36 },
    { id: "v4wake2", who: "james", ch: "ch4", where: "Opening film, the lights on",
      text: "Ma's working late. The flat is empty.", secs: 3.24 },
    { id: "v4wake3", who: "james", ch: "ch4", where: "Opening film, at the window",
      text: "One quiet night. That's all I want.", secs: 3.97 },
    { id: "v4voice", who: "james", ch: "ch4", where: "A few seconds after chapter 4 begins",
      text: "I can do this.", secs: 1.31 },
    { id: "v4near", who: "james", ch: "ch4", where: "Nearing the dining chair",
      text: "Sit down. Breathe. Think it through.", secs: 6.19 },
    { id: "v4sit", who: "james", ch: "ch4", where: "At the chair when the prompt appears, and again as scene A sits down",
      text: "Start from the beginning.", secs: 1.80 },
    { id: "v4thinkA1", who: "james", ch: "ch4", where: "Scene A, the void deck memory",
      text: "The void deck. The hell note. Where it started.", secs: 4.91 },
    { id: "v4thinkA2", who: "james", ch: "ch4", where: "Scene A, the bedroom memory",
      text: "Then my own room. The gap beside my bed. It wasn't random.", secs: 7.08 },
    { id: "v4thinkA3", who: "james", ch: "ch4", where: "Scene A, the red chair memory",
      text: "Same block. Same week. Same me. It's not the places — it's following me.", secs: 8.36 },
    { id: "v4tired", who: "james", ch: "ch4", where: "Scene B, crossing to the sofa",
      text: "Enough. I'm tired. It's nothing — every block has its stories.", secs: 5.64 },
    { id: "v4wake3am", who: "james", ch: "ch4", where: "Scene B, waking at 3 a.m.",
      text: "...the clock. Why can't I hear the clock?", secs: 3.40, note: "Whispered." },
    { id: "v4taunt", who: "james", ch: "ch4", where: "Scene C, to the empty flat",
      text: "You want me?! I'm right here! Come out where I can SEE you!", secs: 5.49, note: "Shouted." },
    { id: "v4regret", who: "james", ch: "ch4", where: "Scene C, after everything stops",
      text: "okay... okay. stupid. stupid. stupid me...", secs: 7.47, note: "Whispered." },
    { id: "v4ma1", who: "mother", ch: "ch4", where: "Scene D, answering the phone",
      text: "Hello? ...Boy? Why you sound like that. What happened?", secs: 4.75, note: "Heard through the handset." },
    { id: "v4call1", who: "james", ch: "ch4", where: "Scene D, on the phone",
      text: "Ma. It's me... no— something's wrong with the flat.", secs: 5.80 },
    { id: "v4call2", who: "james", ch: "ch4", where: "Scene D, on the phone",
      text: "I know how it sounds. Please.", secs: 2.77 },
    { id: "v4ma2", who: "mother", ch: "ch4", where: "Scene D, the promise",
      text: "Listen to me. Tomorrow I ask the temple to send the tang-ki down. He will come and check the whole house. Tonight you don't touch anything ah, you hear me?", secs: 9.56, note: "Heard through the handset." },
    { id: "v4ma3", who: "mother", ch: "ch4", where: "Scene D, before she hangs up",
      text: "Lock the door. Leave the light on for me. I'm coming home soon.", secs: 4.05, note: "Heard through the handset." },
    { id: "v4A", who: "james", ch: "ch4", where: "Under the outcome card after choice A",
      text: "It was never random. It followed me home.", secs: 3.63 },
    { id: "v4B", who: "james", ch: "ch4", where: "Under the outcome card after choice B",
      text: "I ignored it. It did not ignore me.", secs: 2.69 },
    { id: "v4C", who: "james", ch: "ch4", where: "Under the outcome card after choice C",
      text: "I dared it. In my own home. It answered.", secs: 6.27 },
    { id: "v4D", who: "james", ch: "ch4", where: "Under the outcome card after choice D",
      text: "Help is coming tomorrow. I can hold one night.", secs: 3.87 },

    // ---- chapter 5 · THE LESSON ---------------------------------------------
    { id: "v5wake1", who: "james", ch: "ch5", where: "Opening film, over black",
      text: "He actually came.", secs: 2.04 },
    { id: "v5ma1", who: "mother", ch: "ch5", where: "Opening film, at the door",
      text: "Come in, sifu. Come in, come in.", secs: 2.19 },
    { id: "v5wake2", who: "james", ch: "ch5", where: "Opening film, the bow to the kitchen",
      text: "Why is he bowing at the kitchen.", secs: 2.43 },
    { id: "t5note", who: "tangki", ch: "ch5", where: "Opening film, the note held up — his first words in the game",
      text: "Here. [beat] Under where you sit.", secs: 3.55 },
    { id: "v5wake3", who: "james", ch: "ch5", where: "Opening film, the last line",
      text: "That's the hell note. From the void deck. It's been here the whole time.", secs: 4.60 },
    { id: "v5voice", who: "james", ch: "ch5", where: "A few seconds after chapter 5 begins",
      text: "Do I...approach him?", secs: 2.27 },
    { id: "v5near", who: "james", ch: "ch5", where: "Nearing the tang-ki",
      text: "He walked around the flat like he's reading it.", secs: 3.00 },
    { id: "v5sit", who: "james", ch: "ch5", where: "At the tang-ki, when the prompt appears",
      text: "Uncle. What did you see?", secs: 2.04 },
    { id: "t5teachA", who: "tangki", ch: "ch5", where: "Scene A, the teaching at the table",
      text: "Think back. Understand what you did. Seek help before you act. [beat] You know you've done wrong. That is why this morning is quiet.", secs: 10.11,
      note: "Transcribed from the shipped take at v5.14." },
    { id: "t5hallA", who: "tangki", ch: "ch5", where: "Scene A, in the daylit corridor",
      text: "Nothing lives here, boy. It only visits. And visits end.", secs: 6.69 },
    { id: "t5fearB", who: "tangki", ch: "ch5", where: "Scene B, cutting through the fear",
      text: "I cannot help you if you do not open up. But you already know what you did wrong...", secs: 6.53 },
    { id: "v5fearB1", who: "james", ch: "ch5", where: "Scene B, after the release",
      text: "I should never have asked for help. I sound...crazy.", secs: 5.07, note: "Shaky. Transcribed from the shipped take at v5.14." },
    { id: "v5disC1", who: "james", ch: "ch5", where: "Scene C, turning his back on the note",
      text: "Paper. It's just paper.", secs: 2.59 },
    { id: "t5disC", who: "tangki", ch: "ch5", where: "Scene C, quietly, behind him",
      text: "You may call it paper. [beat] Paper burns, and now you're caught in its fire...", secs: 5.96 },
    { id: "t5learnD1", who: "tangki", ch: "ch5", where: "Scene D, at the altar",
      text: "We return what was kept.", secs: 2.59 },
    { id: "v5ma2", who: "mother", ch: "ch5", where: "Scene D, near the burning",
      text: "Thank you, sifu. Thank you.", secs: 2.12 },
    { id: "t5learnD2", who: "tangki", ch: "ch5", where: "Scene D, the episode's last lesson",
      text: "It is finished. What you keep now is the lesson.", secs: 5.56 },
    { id: "v5learnD", who: "james", ch: "ch5", where: "Scene D, quietly, at the end",
      text: "The first one. He says every case teaches you the next.", secs: 4.75 },
    { id: "v5A", who: "james", ch: "ch5", where: "Under the outcome card after choice A",
      text: "I asked him what to learn. He told me. All of it.", secs: 4.91 },
    { id: "v5B", who: "james", ch: "ch5", where: "Under the outcome card after choice B",
      text: "The fear followed me into the morning. When will it go away?", secs: 5.49 },
    { id: "v5C", who: "james", ch: "ch5", where: "Under the outcome card after choice C",
      text: "I called it paper. She heard me.", secs: 3.08 },
    { id: "v5D", who: "james", ch: "ch5", where: "Under the outcome card after choice D",
      text: "It's over. [beat] It's really over.", secs: 3.79 }
  ];

  // What a chapter key means on the sheet.
  const CHAPTERS = {
    ch1: "Chapter 1 · The Hell Note", ch2: "Chapter 2 · The Presence",
    ch3: "Chapter 3 · The Gathering", ch4: "Chapter 4 · Back Home",
    ch5: "Chapter 5 · The Lesson", haunting: "Chapters 1 and 2 · the haunting"
  };

  window.__VOICE__ = { SPEAKERS, LINES, CHAPTERS };
})();
