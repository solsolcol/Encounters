# v27.0 · episode 4 chapter 4: EVERY LINE IT SPEAKS (docs/V27.0-E4C4-PLAN.md §4, as revised from the research and its
# refuting reader: docs/research/V27.0-VERDICTS.md), one row a line:
#   (key, speaker, where it plays, the words exactly as they are said)
# Speakers: 'he' (Brian, the grown Master Zavier: the registry's jamesAdult), 'pho' (Grandmaster Pho, his chapter 3
# voice), 'amma' (the lady, Tara), 'ravi' (her son, Dhananjay), 'mala' (her daughter, Sonam). Grandmaster Pho's lines
# stand on the plan's default D4 (his rule: wise and few) and go to Chad as they land. secs.py writes the chapter's SECS
# table from this file; prompts.py joins it with tags.py into what eleven_v3 is given.
# Nothing here voices "My part was small" (S1·16, episode 5's case: R-V §4 7), a founding year, or anything that ties
# her stopping her service to her illness (R-V B36); nobody but a monk says anumodana (Chad, v24.25).
PACE = {'he': 2.3, 'pho': 1.9, 'amma': 2.0, 'ravi': 2.4, 'mala': 2.4}      # words a second

LINES = [
    # ---- the opening film (§4.0)
    ('q4o1', 'he', 'opening film', "Training began the next morning. Open. Close. Every day, for months."),
    #      (his name is written Pho and said Puu: Chad, 12 Nov 2026, said again 18 Nov, R49; the voice is given his
    #       spelling, as chapter 3's q3w3 and tn3c1 were)
    ('q4o2', 'he', 'opening film', "When Grandmaster Puu came to Singapore, a family asked him to see their mother."),
    ('rv4o1', 'ravi', 'opening film', "Grandmaster. Thank you for coming. Please, come in."),
    # ---- play I, history first (§4.1)
    ('ph4h0', 'pho', 'play, history', "First, learn her story. Talk to her family, and look around her home. Then tell me what you learned."),
    ('rv4h1', 'ravi', 'play, history', "Seven years. She just... stopped walking properly. First a cane, then this chair."),
    ('rv4h2', 'ravi', 'play, history', "Neurologist, orthopaedic, the MRI, the nerve tests. Everything normal. They said maybe her age."),
    ('ml4h1', 'mala', 'play, history', "We went everywhere. Temple priests, a Chinese medium, an ustaz, a Thai monk in Golden Mile. Everyone tried. Everyone said something different. Nothing changed."),
    ('q4h1', 'he', 'play, history', "She saw the doctors first. All of them."),
    ('ml4h2', 'mala', 'play, history', "That's Amma. For twenty years, at the festival, Amman came to her. Kali Amman. Everyone came to ask her."),
    ('ml4h3', 'mala', 'play, history', "After Appa passed, she stopped. She said she was tired. She never went back."),
    ('q4h2', 'he', 'play, history', "Her husband. The garland is fresh."),
    ('am4h1', 'amma', 'play, history', "You can see it, can't you?"),
    ('q4h3', 'he', 'play, history', "Seven years. Every doctor. Many practitioners. And she served Kali Amman, until her husband died."),
    ('ph4h1', 'pho', 'play, history', "Good. Now you know her story. Always learn the story first, before you use your Spirit Vision."),
    # (Chad, 19 Nov, R100/R101: "Do #3 only": the first time he opens his sight during the history, before he has listened,
    # his teacher stops him once; the words as proposed and picked)
    ('ph4h2', 'pho', 'play, history: he opens his sight before he has listened', "Not yet. First, we listen."),
    # ---- play II, the sight (§4.2)
    ('ph4s0', 'pho', 'play, the sight', "Now open your Spirit Vision, the way I taught you. Look at each spirit in this room. Only look."),
    ('q4s1', 'he', 'play, the sight', "It's holding her down. It's been there a long time."),
    ('q4s2', 'he', 'play, the sight', "Not him. He's only watching over her."),
    ('q4s3', 'he', 'play, the sight', "Hungry ones. Waiting for whatever is given here tonight."),
    # (Chad, 19 Nov, R95/R96: the game asked him to close "for no apparent reason"; the reason said once, in his teacher's own
    # teaching from chapter 3, "Without control, it will overwhelm you"; the words put to Chad and approved as written)
    ('ph4s1', 'pho', 'play, the sight', "Good. Now close it. Kept open too long, it will overwhelm you."),
    ('ph4s2', 'pho', 'play, the sight', "A spirit is sitting on her back. I believe it is why these years have been so hard."),
    ('ph4s3', 'pho', 'play, the sight', "She served Mae Kali. Past karma, and matters left unresolved: it has stayed with her, and pressed on her."),
    ('ph4s4', 'pho', 'play, the sight', "I will bless her, and release the spirit on her back. Take the holy water, and keep the green spirits away from her."),
    # ---- play III, the blessing (§4.3)
    ('ph4b0', 'pho', 'play, the blessing', "Please light her lamp. Let her goddess see what we do."),
    # (Chad, 21 Nov, R142: "I want grandmaster pho to give more context and explanation on why the green spirits are going
    # after amma ... This should be explained at the most appropriate time before the holy water fight starts.": said in
    # the dark, once her lamp is lit and the room has died, before he takes the holy water. Written from his words; two
    # corrections said to him: "Mae Kali's medium" (his teacher's own name for her goddess, as ph4s3) and the third line
    # in the past, "helped" and "came" (she stopped serving when Appa passed))
    ('ph4k1', 'pho', 'play, the blessing: in the dark, before the holy water (R142)', "Over many years, Amma served as Mae Kali's medium. She helped many people."),
    ('ph4k2', 'pho', 'play, the blessing: in the dark, before the holy water (R142)', "In helping them, she involved herself in their karma."),
    ('ph4k3', 'pho', 'play, the blessing: in the dark, before the holy water (R142)', "Sometimes, after she helped someone, their karmic creditors came after her instead."),
    ('ph4k4', 'pho', 'play, the blessing: in the dark, before the holy water (R142)', "Their karmic debt is still unresolved. That is why the green spirits are going after Amma."),
    ('ph4b1', 'pho', 'play, the blessing', "I am closing your Spirit Vision. Breathe."),
    ('ph4b2', 'pho', 'play, the blessing', "Not him. The pale blue spirit is her husband. Only flick the holy water at the green spirits."),
    # (Chad, 18 Nov: "If the player gets out of spirit vision for too long and is not doing anything to chase the green spirits
    # away, grandmaster pho will have a voice line that tells him to go back into spirit vision": three, in turn, again
    # while his sight stays shut. Written here and sent to Chad as they land, his rule for every line of Grandmaster Pho's)
    ('ph4b3', 'pho', 'play, the blessing: his sight shut too long', "Open your Spirit Vision! The green spirits are coming for her."),
    ('ph4b4', 'pho', 'play, the blessing: his sight shut too long', "Open your Spirit Vision now. You cannot stop what you cannot see."),
    ('ph4b5', 'pho', 'play, the blessing: his sight shut too long', "Open your Spirit Vision, and flick the holy water at the green spirits!"),
    # (Chad, 19 Nov, R95/R96: once he had shut it, "the player does not know when to turn it back on": the first time he shuts it
    # himself in the fight, his teacher says when; and at the fight's big moments he is called to open it. Approved as written)
    ('ph4b6', 'pho', 'play, the blessing: the first time he shuts his sight himself', "Good. Breathe. Now open it again. They are still coming."),
    ('ph4b7', 'pho', 'play, the blessing: a big moment with his sight shut', "Open it, now!"),
    ('ph4b8', 'pho', 'play, the blessing: his sight shut and its strain gone, ready to open again (R128)', "When you feel better, open your Spirit Vision again."),
    ('ph4b9', 'pho', 'play: his sight open, the strain red at its top (R129)', "You're losing control, close your Spirit Vision, and re-open it again."),
    # (Chad, 18 Nov: "Have some dramatic voicelines along the way": the fight speaks. q4f3 and ph4f2 are his words exactly)
    ('q4f1', 'he', 'play, the fight: the second wave comes', "More of them. From the doors."),
    ('q4f2', 'he', 'play, the fight: the large one stands', "What is that...?"),
    ('ph4f1', 'pho', 'play, the fight: the large one stands', "That big one is strong. Keep flicking the holy water at it until it goes."),
    ('rv4f1', 'ravi', 'play, the fight: his mother cries out', "Amma! What's happening to her?"),
    ('q4f3', 'he', 'play, the fight: the surge, too many', "Grandmaster, there are way too many of them!"),
    ('ph4f2', 'pho', 'play, the fight: the surge, too many', "Call out to Luang Phor Phiboon, now!"),
    ('q4f4', 'he', 'play, the fight: he calls on him', "Luang Phor Phiboon... please, help us."),
    ('ph4f3', 'pho', 'play, the fight: the gold in the water', "Luang Phor Phiboon is with you. Flick the golden water at the green spirits!"),
    # ---- the trance and the turning point (§4.4)
    ('ml4t1', 'mala', 'film: the trance', "Amma?"),
    ('ml4t2', 'mala', 'film: the trance', "It's Amman."),
    ('rv4t1', 'ravi', 'film: the trance', "Stop it! You're hurting her!"),
    # ---- the four endings (§4.5)
    #      (each ending's family, between its words and his teacher's: the plan's "Ravi fights him, shouting for his
    #       mother; Mala screams at them both", and in each the people the student's choice touched, heard; 18 Nov, from
    #       the static scan of the four: 13 to 17 s in each with nobody speaking)
    ('rv4A1', 'ravi', 'ending A', "Let go of me! Amma! Amma!"),
    ('ml4A1', 'mala', 'ending A', "Stop it! Both of you, stop!"),
    ('am4A1', 'amma', 'ending A', "Ravi?"),
    ('rv4A2', 'ravi', 'ending A', "Amma..."),
    ('ph4A1', 'pho', 'ending A', "You protected the blessing. You forgot her son. His fear was only love."),
    ('q4A1', 'he', 'ending A', "I saw a man in the way. He was her son."),
    ('ml4B1', 'mala', 'ending B', "What are you doing?"),
    ('ph4B0', 'pho', 'ending B', "Go away, now!"),
    ('ml4B2', 'mala', 'ending B', "Amma!"),
    ('ml4B3', 'mala', 'ending B', "Are you alright?"),
    ('ph4B1', 'pho', 'ending B', "Your part was the holy water, and keeping the spirits away from her. The work was mine. Today you were lucky."),
    ('q4B1', 'he', 'ending B', "I saw it, and thought it was mine to fight."),
    ('q4C0', 'he', 'ending C', "She's not being hurt. It's leaving her. Stay with her. Hold her hand."),
    ('rv4C1', 'ravi', 'ending C', "I'm here, Amma. I'm right here."),
    ('am4C1', 'amma', 'ending C', "My boy."),
    ('ph4C1', 'pho', 'ending C', "You saw what was there, and you told him only what you knew. Nothing more."),
    ('q4C1', 'he', 'ending C', "I didn't promise him anything. I told him what I saw."),
    ('ph4D0', 'pho', 'ending D', "Ravi. Hold her hand."),
    ('rv4D1', 'ravi', 'ending D', "Okay. Okay. I've got you, Amma."),
    ('ph4D1', 'pho', 'ending D', "You kept your place. That is where it starts. But there were two people afraid in this room, and you are the one who could see."),
    ('q4D1', 'he', 'ending D', "I kept to my part. Next time I'll see the people too."),
    # ---- her rise, in every ending (Chad, 18 Nov 2026, R55: "Have a dramatic voiceline for the player saying 'oh my
    #      god, she's standing!' The male and female models both also should say something each, they need to sound
    #      surprised and amazed that she finally can stand after all these years, unbelievable, etc."): his words as he
    #      gave them, and one line each for her son and her daughter in their own words (Mala's replaces ending D's
    #      "Amma... you're standing.", which Ravi's now says first)
    ('q4R1', 'he', 'every ending, her rise', "Oh my god, she's standing!"),
    ('rv4R1', 'ravi', 'every ending, her rise', "Amma... you're standing. After all these years!"),
    ('ml4R1', 'mala', 'every ending, her rise', "Unbelievable... Amma, you're on your feet!"),
    # ---- the close, every ending: the dedication of merit SPOKEN (A Chanting Guide's own words, the anumodana-bearing
    #      ones left out: R-V B15, B16), and the case file's own caution (§4.5)
    ('ph4z0', 'pho', 'the close', "May all beings, without limit, without end, have a share in the merit just now made: those I have seen, and those I have never seen."),
    #      (her own words at her altar, to her goddess, as she joins her palms by the lamp she has lit: hers, and the
    #       only thanks the night is given; the goddess she served is Kali Amman, "mother", §2.4)
    ('ml4z1', 'mala', 'the close', "Slowly, Amma. Slowly."),
    ('am4z1', 'amma', 'the close', "Thank you, Mother."),
    ('ph4z1', 'pho', 'the close', "Keep seeing her doctors. What happened tonight is what happened tonight. It is not a promise."),
    # ---- the four lines under the outcome cards: his own terse first-person reflections (v4.91), never the card read
    ('q4A', 'he', 'card A', "I held her son back. His fear was only love."),
    ('q4B', 'he', 'card B', "I threw the water. It was never mine to fight."),
    ('q4C', 'he', 'card C', "I told him only what I saw. He held her hand."),
    ('q4D', 'he', 'card D', "I held my place. Next time, I see the people too."),
]


def estimate(speaker, text):
    """a line's length before its take is measured: its words at the speaker's pace, a beat for each pause it marks"""
    import re
    words = len(re.findall(r"[A-Za-z']+", text))
    pauses = text.count('...') + text.count('.') + text.count('?') + text.count('!') + text.count(':') - text.count('...') * 3
    return round(words / PACE[speaker] + 0.25 * max(0, pauses - 1) + 0.3, 2)
