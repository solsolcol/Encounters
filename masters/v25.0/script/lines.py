"""v25.0 · episode 4 chapter 2, Not Every Master Should Be Trusted — EVERY LINE IT SPEAKS, the one source.

Each row: (id, who, where, text). `text` is what eleven_v3 is prompted with: the words exactly, one tag naming an emotion
at most (Chad's prompt rules, v5.28), no added capitals, at most one added ellipsis. The registry (src/voicelines.js)
records what is HEARD, so CP10 writes each row from its transcribed take; until then these are the script.

Speakers (src/voicelines.js SPEAKERS):
  jamesAdult  him, Brian (bP8FJDHmWVEgXJDitdQd), as in chapter 1
  pong        Pong, Zie (bcdIY58WBBzAMmef52NW), as in chapter 1 — the call's lines get a phone's band (make.sh)
  lersichin   Lersi Chin, Mart-Podcast (2rg92Q2u0RWu8LiUcLQA), CP1's measured pick until Chad's ear
  cust2a      a woman at his counter (the opening; ending D), heard only — cast at CP10
  cust2b      a man at his counter (ending A), heard only — cast at CP10

The case file's words (S1·11) are verbatim in the opening and the visit; the coda is its closing paragraph verbatim.
Chad's own words: Pong's offer (9 Nov: "i know a famous ajahn who is good at clearing dirty things..."), with the one
clause the plan adds (§2.2 #1); answer C (9 Nov); the thread's title (art, not spoken).
Tone (§3.6): Lersi Chin says what he BELIEVES, never what is certain; he never names nor denounces the first master; he
asks about doctors; he says thank you, never anumodana; no prices anywhere; no master's title abbreviated.
"""
LINES = [
    # ---- THE OPENING FILM, "The Fog" (§4.0) — the case file, verbatim, and the counter heard
    ('q2o1', 'jamesAdult', 'The opening film: his shop at noon in the fog (the case file)',
     '[quiet] When I returned to Singapore my mind became extremely foggy.'),
    ('cu2a1', 'cust2a', 'The opening film: a woman at his counter, heard while his eyes stay on the tray (her words smeared and slowed at the master)',
     'Boss, this one... from which temple ah? Who blessed it?'),
    ('q2o2b', 'jamesAdult', 'The opening film: he has not followed her',
     '[tired] Sorry... can you say again?'),
    ('cu2a1b', 'cust2a', 'The opening film: the woman gives up, kindly',
     'Aiyo, never mind. I come back another day.'),
    ('q2o2', 'jamesAdult', 'The opening film: the counter empty again (the case file)',
     '[quiet] I could not think properly.'),
    ('q2o3', 'jamesAdult', 'The opening film: his hand on one pocket, the other, his bag (the case file)',
     'I misplaced my wallet, and strangely I could barely remember what I had done with it.'),
    ('q2o4', 'jamesAdult', 'The opening film: CALL PONG in his own hand on the glass (the case file)',
     '[quiet] I simply felt unlike myself.'),

    # ---- PLAY I · THE WALLET (§4.1 P1), noon
    ('q2till', 'jamesAdult', 'Play: the till drawer, empty of it', '[tired] Not in the drawer.'),
    ('q2bag', 'jamesAdult', 'Play: his bag under the counter', 'Not in my bag.'),
    ('q2jacket', 'jamesAdult', 'Play: his jacket over his stool', '[tired] Not in my jacket either.'),
    ('q2where', 'jamesAdult', 'Play: all three searched', '[confused] Where did I put it?'),
    ('q2fridge', 'jamesAdult', 'Play: the wallet beside the water in the drinks fridge', '[confused] ...What is it doing in here?'),

    # ---- PLAY I · THE SHAPE BY THE DOOR (§4.1 P2, the trial's 5.4), closing time
    ('q2flowers', 'jamesAdult', 'Play: the shape by the door is the Grand Opening stand, its flowers dried', '[relieved] ...The flowers. I never took them away.'),
    ('q2note', 'jamesAdult', 'Play: the note on the counter, CALL PONG, seen again', '[quiet] ...Call Pong.'),

    # ---- THE CALL (§4.1 P3) — a film from play; Pong's voice through the phone
    ('pg2c1', 'pong', 'The call: Pong answers', '[warm] Brother! Long time no reply. You OK or not?'),
    ('q2c1', 'jamesAdult', 'The call', '[tired] Not really. Since I came back... I can\'t think. I found my wallet in the fridge.'),
    ('pg2c2', 'pong', 'The call: Pong\'s offer — Chad\'s words, and the clause the plan adds (his stock)',
     '[serious] Bro... I know a famous ajahn who is good at clearing dirty things, he helped my mother before. This one I can vouch for. He just arrived in Singapore this week. I\'m coming down with your stock tomorrow, I can bring him over.'),
    ('q2c2', 'jamesAdult', 'The call: what Pong said in chapter 1', 'Last time you said "trust me" also.'),
    ('pg2c3', 'pong', 'The call: the difference, hearsay and his own account', '[apologetic] I know. Sorry, bro. That one I never met. This one, I was there with my mother.'),
    ('q2c3', 'jamesAdult', 'The call: his answer', '[quiet] ...Bring him.'),

    # ---- THE VISIT (§4.2) — a film
    ('q2v1', 'jamesAdult', 'The visit: Lersi Chin steps in under the shutter (the case file)',
     'Eventually I approached another Thai practitioner I trusted, Lersi Chin, a true Lersi master.'),
    ('pg2v1', 'pong', 'The visit: Pong introduces them', '[warm] Lersi Chin, this is my friend. His shop.'),
    ('lc2v1', 'lersichin', 'The visit: Lersi Chin, to him, after he has waied the Buddha', '[gentle] Sawasdee krap. New shop... tired owner.'),

    # ---- PLAY II · THE BOW AND WHAT HE TELLS HIM (§4.3 P4–P5; the trial's 5.2)
    ('lc2sit', 'lersichin', 'Play: after the three prostrations and the wai', '[gentle] Sit, sit. You look like you haven\'t slept.'),
    ('lc2tell', 'lersichin', 'Play: before the pick (the trial\'s 5.2)', '[calm] Tell me what happened there.'),
    ('q2tA', 'jamesAdult', 'Play: A, what he saw (the four signs of chapter 1)',
     'The smoke leaned toward a covered jar. The cloth over it moved. His shadow moved after he did. And I saw someone behind him... then no one.'),
    ('q2tB', 'jamesAdult', 'Play: B, what it means', 'I saw things in his room I can\'t explain. What do you think they mean?'),
    ('q2tC', 'jamesAdult', 'Play: C, the assumption', '[tense] He\'s using black magic. I\'m sure of it.'),
    ('q2tD', 'jamesAdult', 'Play: D, what to do next', 'What should I do now?'),
    ('lc2tA', 'lersichin', 'Play: his answer to A (the trial: evidence first)', '[calm] Good. You tell me what you saw, not what you think. Then I can look for myself.'),
    ('lc2tB', 'lersichin', 'Play: his answer to B (the trial: seeing is not understanding)', '[calm] Seeing is not understanding. Someone near a master... you don\'t know yet what he is to him.'),
    ('lc2tC', 'lersichin', 'Play: his answer to C (the trial: suspicion is not evidence)', '[calm] You don\'t know that. Suspicion is not evidence. I will look, then we talk.'),
    ('lc2tD', 'lersichin', 'Play: his answer to D (the trial: the sensible next step)', '[calm] First, we look at you. Not at him.'),

    # ---- THE EXAMINATION (§4.3 P6) — a film
    ('lc2e1', 'lersichin', 'The examination: he takes his wrist', '[gentle] Give me your hand.'),
    ('lc2e2', 'lersichin', 'The examination', 'You sleep?'),
    ('q2e1', 'jamesAdult', 'The examination', 'Not much.'),
    ('lc2e3', 'lersichin', 'The examination', 'Eat?'),
    ('q2e2', 'jamesAdult', 'The examination', 'When I remember.'),
    ('lc2e4', 'lersichin', 'The examination: Pong told him', 'The wallet... in the fridge?'),
    ('q2e3', 'jamesAdult', 'The examination', '[embarrassed] ...Yes.'),
    ('lc2e5', 'lersichin', 'The examination: the doctor first (the research, §4; Master Z\'s S1·07)', 'You saw a doctor?'),
    ('q2e4', 'jamesAdult', 'The examination', 'Yes. They said stress.'),
    ('lc2e6', 'lersichin', 'The examination: before he closes his eyes', '[calm] Mm. Good. Doctor first, always. Now, quiet.'),
    ('lc2e7', 'lersichin', 'The examination: his eyes open on the piece standing by the door, facing it', '[gentle] That one... from there?'),
    ('q2e5', 'jamesAdult', 'The examination: the piece he took in chapter 1', '...Yes. I was told to put it facing the door.'),
    ('lc2e8', 'lersichin', 'The examination: the piece on a clean cloth (§2.2 #6, Q6)', '[calm] This one, you give to a temple. Don\'t keep, don\'t sell, don\'t throw.'),
    ('lc2e9', 'lersichin', 'The examination: what he believes (the case file\'s own words)', '[serious] According to my practice, I believe something negative was placed on you.'),
    ('q2e6', 'jamesAdult', 'The examination', '[tense] By him?'),
    ('lc2e10', 'lersichin', 'The examination: he never names the first master', '[calm] I didn\'t say that. I said on you.'),

    # ---- THE CLEARING (§4.3 P7) — a film; the chant captioned from A Chanting Guide (Q5's default: the "your" form)
    ('lc2k0', 'lersichin', 'The clearing: before the homage', '[gentle] Hands together. Close your eyes.'),
    ('lc2namo', 'lersichin', 'The clearing: Namo tassa, three times (A Chanting Guide §0064)',
     '[chanting] Namo tassa bhagavato arahato sammāsambuddhassa. Namo tassa bhagavato arahato sammāsambuddhassa. Namo tassa bhagavato arahato sammāsambuddhassa.'),
    ('lc2sak1', 'lersichin', 'The clearing: the Sakkatvā verses, the Buddha (A Chanting Guide §0062)',
     '[chanting] Sakkatvā buddha-ratanaṁ, osathaṁ uttamaṁ varaṁ, hitaṁ deva-manussānaṁ, buddha-tejena sotthinā, nassantupaddavā sabbe, dukkhā vūpasamentu te.'),
    ('lc2sak2', 'lersichin', 'The clearing: the Sakkatvā verses, the Dhamma',
     '[chanting] Sakkatvā dhamma-ratanaṁ, osathaṁ uttamaṁ varaṁ, pariḷāhūpasamanaṁ, dhamma-tejena sotthinā, nassantupaddavā sabbe, bhayā vūpasamentu te.'),
    ('lc2sak3', 'lersichin', 'The clearing: the Sakkatvā verses, the Saṅgha',
     '[chanting] Sakkatvā saṅgha-ratanaṁ, osathaṁ uttamaṁ varaṁ, āhuneyyaṁ pāhuneyyaṁ, saṅgha-tejena sotthinā, nassantupaddavā sabbe, rogā vūpasamentu te.'),
    ('lc2drink', 'lersichin', 'The clearing: the holy water poured into his cupped hands', '[gentle] Drink. A little.'),
    ('lc2wrist', 'lersichin', 'The clearing: the white thread', '[gentle] Your wrist.'),
    ('lc2k2', 'lersichin', 'The clearing: the advice (the research §4.4; S1·07)', '[gentle] Go to a temple this week. Make merit. If the fog comes back, doctor first, then me.'),

    # ---- PLAY II · THE WARNING (§4.3 P8)
    ('lc2w1', 'lersichin', 'Play: the warning — serious and kind, never angry (§2.2 #8)',
     '[serious] One more thing. Don\'t go looking for him. Don\'t tell people stories about him. Don\'t wish anything back on him. Leave it there.'),
    ('pg2w1', 'pong', 'Play: Pong, at the shutter with the empty carton', 'Bro, I wait outside.'),

    # ---- ENDING A · WORD GETS AROUND (worst; the trial's 5.5C)
    ('q2A1', 'jamesAdult', 'Ending A: alone at the counter that night, typing', '[determined] Somebody has to warn people.'),
    ('pg2A1', 'pong', 'Ending A: Pong calls, days later (the phone\'s band)', '[upset] Bro, why you post? His people calling me. They say I bring you there, now you spoil his name.'),
    ('q2A2', 'jamesAdult', 'Ending A', '[defensive] I know what I saw.'),
    ('pg2A2', 'pong', 'Ending A', '[quiet] You saw. You don\'t know.'),
    ('cu2b1', 'cust2b', 'Ending A: a man at his counter, heard while his eyes stay on the tray', 'Eh, you the one who posted about that Thai ajahn?'),
    ('q2A3', 'jamesAdult', 'Ending A: the last line', '[reflective] I was sure enough to stay away from him. I was never sure enough to say it about him.'),

    # ---- ENDING B · NOT MY ROAD (good; S1·12's lesson)
    ('q2B1', 'jamesAdult', 'Ending B: he asks', '[hopeful] Lersi Chin... will you teach me? I see things. I don\'t know why.'),
    ('lc2B1', 'lersichin', 'Ending B: kindly, after a long look', '[gentle] Why you see, what it is for... that question is bigger than my practice. I clear. I cannot answer that one.'),
    ('lc2B2', 'lersichin', 'Ending B', '[gentle] Someone can. Not me. When you find him, don\'t take my word. Don\'t take Pong\'s word. Check his teacher. Check his people. Then go.'),
    ('pg2B1', 'pong', 'Ending B: at the shutter', '[warm] This time we check first, bro.'),
    ('q2B2', 'jamesAdult', 'Ending B: the last line', '[reflective] He had cleared me. He could not tell me what I was for, and he was honest enough to say so.'),

    # ---- ENDING C · SEND IT BACK (bad; Chad's answer; S1·03's lesson)
    ('q2C1', 'jamesAdult', 'Ending C: he asks (Chad\'s answer)', '[bitter] Lersi Chin... can you send it back? To whoever did this.'),
    ('lc2C1', 'lersichin', 'Ending C: after a long moment, not unkindly', '[calm] I clear. I don\'t send.'),
    ('lc2C2', 'lersichin', 'Ending C', '[calm] If I send, I carry it. If you ask me to send, you carry it also.'),
    ('pg2C1', 'pong', 'Ending C', '[uneasy] Bro...'),
    ('q2C2', 'jamesAdult', 'Ending C', '[bitter] He did this to me.'),
    ('lc2C3', 'lersichin', 'Ending C: he refuses only the harm (§13)', '[gentle] Maybe. Maybe not. Either way, you are clear now. Don\'t pick it up again.'),
    ('q2C3', 'jamesAdult', 'Ending C: the last line, alone, the grey at the edges again', '[heavy] I wanted him to feel what I had felt. Lersi Chin would not carry that for me, and I could not put it down.'),

    # ---- ENDING D · ENOUGH (best; the trial's 5.3D)
    ('q2D1', 'jamesAdult', 'Ending D: a wai', '[grateful] Thank you, Lersi Chin.'),
    ('lc2D1', 'lersichin', 'Ending D', '[warm] Go well. Make merit when you can.'),
    ('pg2D1', 'pong', 'Ending D: at the shutter', '[cheerful] Bro, go eat something?'),
    ('cu2a2', 'cust2a', 'Ending D: the next morning, the woman from the opening, heard', 'Boss, this one... from which temple ah?'),
    ('q2D2', 'jamesAdult', 'Ending D: he follows every word, and answers simply', '[warm] This one? A temple in Ayutthaya. The card is inside, let me show you.'),
    ('q2D3', 'jamesAdult', 'Ending D: the last line', '[calm] I had enough to decide. There was nothing more worth proving.'),

    # ---- THE CODA, "LF>" (every ending) — the case file's closing paragraph, verbatim
    ('q2K1', 'jamesAdult', 'The coda: months later, the forum on his laptop (the case file)',
     '[reflective] Whether you interpret that spiritually or otherwise, the lesson has stayed with me ever since. After that I became far stricter about who I go to.'),
    ('q2K2', 'jamesAdult', 'The coda (the case file)',
     'I research a master\'s lineage thoroughly. I look for real accounts from real people. I only approach those I have checked and genuinely trust.'),
    ('q2K3', 'jamesAdult', 'The coda (the case file)',
     'And yet still, none of them could answer the question I actually carried... why I had these abilities at all, and what they were truly for.'),
    ('q2K4', 'jamesAdult', 'The coda: the new thread appears on its last words (the case file)',
     '[quiet] That question went unanswered for a long time, until the day I met someone who could finally help me understand.'),

    # ---- UNDER THE OUTCOME CARDS — his own terse first-person reflections, never the card read aloud (v4.91)
    ('q2A', 'jamesAdult', 'Under outcome card A', '[quiet] I said it as fact. I only knew it as fear.'),
    ('q2B', 'jamesAdult', 'Under outcome card B', '[quiet] He couldn\'t answer me. He was honest enough to say so.'),
    ('q2C', 'jamesAdult', 'Under outcome card C', '[quiet] I wanted it sent back. I only kept it closer.'),
    ('q2D', 'jamesAdult', 'Under outcome card D', '[quiet] I had seen enough. I didn\'t need to prove it.'),
]

import re


def words(text):
    return re.sub(r'\[[^\]]*\]', '', text).split()


def est(row):
    """the estimated length until CP10 measures the take: the game's median pace (2.3 words a second), a chant slower"""
    i, who, where, text = row
    n = len(words(text))
    rate = 1.4 if text.startswith('[chanting]') else 2.3
    return round(n / rate + 0.5, 2)


if __name__ == '__main__':
    import sys
    if '--secs' in sys.argv:
        for row in LINES:
            print(f"'{row[0]}': {est(row)},")
    else:
        ids = [r[0] for r in LINES]
        assert len(ids) == len(set(ids)), 'an id twice'
        for r in LINES:
            assert 'LP' not in r[3] and 'L.P.' not in r[3], r[0]
            assert 'anumodana' not in r[3].lower(), r[0]
        print(len(LINES), 'lines;', sum(len(words(r[3])) for r in LINES), 'words')
