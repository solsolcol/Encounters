# v26.0 · episode 4 chapter 3: EVERY LINE IT SPEAKS (docs/V26.0-E4C3-PLAN.md §4), one row a line:
#   (key, speaker, where it plays, the words exactly as they are said)
# Speakers: 'he' (Brian, the grown Master Zavier: the registry's jamesAdult), 'pho' (Grandmaster Pho), 'ton', 'aunt'
# (the woman at his bench). Lines marked S1·12 in the plan are the case file's words exactly. Grandmaster Pho's lines
# are drafts for Chad's yes (the tracker's D10): the voices are generated LAST (M7), so a word can still change for
# nothing. secs.py writes the chapter's SECS table from this file (an estimate at the game's pace until a take is
# measured); voices.py (M7) makes the takes from it.
PACE = {'he': 2.3, 'ton': 2.4, 'aunt': 2.2, 'pho': 1.9}      # words a second (the game's median is about 2.3)

LINES = [
    # ---- the opening film, THE QUESTIONS (§4.0)
    ('q3o1', 'he', 'opening film', "For years I had been searching for the answers to the same questions."),
    ('q3o2', 'he', 'opening film', "Why was I so sensitive?"),
    ('q3o3', 'he', 'opening film', "Could any of it be used to help others?"),
    ('q3o4', 'he', 'opening film', "How could I cultivate enough to control it — and eventually use it at will?"),
    ('q3o5', 'he', 'opening film', "I had met many practitioners and many masters. Some gave me advice. Some gave me experiences. Nobody could really explain the truth of it to me."),
    ('q3o6', 'he', 'opening film', "I was attending a Wai Kru ceremony in Thailand where many masters and practitioners were present."),
    # ---- play I, the Wai Kru (§4.1)
    ('q3v', 'he', 'play, day one', "So many masters in one place. I did not know where to look."),
    ('tn3a1', 'ton', 'play, day one', "You are from the forum, right? First time?"),
    ('q3p1', 'he', 'play, day one', "First time."),
    ('tn3a2', 'ton', 'play, day one', "Take one. It is yours to present, when you are ready. Pay respect at the tables first."),
    ('tn3d1', 'ton', 'film: festival', "For the Thevadas. To show respect."),
    ('q3m0', 'he', 'film: festival', "I knew those hands. Mine had moved like that, by themselves."),
    ('q3m1', 'he', 'film: festival', "One by one they went up with their bai sri, and some of them went somewhere I could not follow."),
    ('q3w1', 'he', 'film: festival', "Only one person caught my attention."),
    ('q3w2', 'he', 'film: festival', "He was dressed in white and carried the presence of a true master."),
    ('q3w3', 'he', 'film: festival', "That person was Grandmaster Pho, and something inside me knew I had to speak to him one day."),
    ('q3u1', 'he', 'play, the pull', "Not here. Not now."),
    ('q3u2', 'he', 'play, the pull', "It passed. He was looking straight at me."),
    ('tn3m1', 'ton', 'play, the pull', "You are next. Go."),
    ('q3u3', 'he', 'play, the pull', "Not yet. The last time I knelt to a master I did not know, I went home in a fog."),
    ('tn3m2', 'ton', 'play, the pull', "Okay. Nobody pushes here. Keep it. When you are ready."),
    ('q3c1', 'he', 'play, the check', "The one in white. Who is he?"),
    ('tn3c1', 'ton', 'play, the check', "That is Grandmaster Pho. Don't take my word. Ask the people who have sat with him."),
    ('q3c2', 'he', 'play, the check', "Auntie, can I ask you about him?"),
    ('ds3c1', 'aunt', 'play, the check', "I came like you, with questions. Sit with him first. Then decide for yourself."),
    ('tn3c2', 'ton', 'play, the check', "Tomorrow morning he receives people. Come early. I bring you."),
    ('q3c3', 'he', 'play, the check', "I had learned to ask first. Everything I heard said the same thing: go and sit with him."),
    # ---- the night between (§4.2)
    ('ds3p1', 'aunt', 'film: between', "Three, two, one!"),
    ('tn3n1', 'ton', 'film: between', "Come. He is free now."),
    # ---- play II, the chance (§4.3)
    ('ph3g1', 'pho', 'play, day two', "Sit. Ton tells me you carry questions. Put them down here."),
    ('q3t1', 'he', 'film: tell', "Since I was a boy, I have been very sensitive. I feel things other people cannot feel."),
    ('q3t2', 'he', 'film: tell', "When I hear chanting, my body moves by itself, and I cannot control it."),
    ('q3t3', 'he', 'film: tell', "When I hold an amulet, I can feel its energy. Every amulet feels different."),
    ('q3t4', 'he', 'film: tell', "And I once kept three kumanthong, and opened my body to them."),
    ('q3t8', 'he', 'film: tell', "He listened."),
    ('q3a1', 'he', 'film: answers', "Then he said things that shocked me. He knew the answers to every question I had been carrying for years."),
    ('ph3n1', 'pho', 'film: answers', "Every person is born carrying something from past lives. Different people bring different things, and different baramee."),
    ('ph3n2', 'pho', 'film: answers', "You brought yours with you. You were born with a gift, and with a mission."),
    ('ph3n3', 'pho', 'film: answers', "But sensitivity alone is not enough. Without control, it will overwhelm you, and it will hurt you. You opened your body to the kumanthong, and you did not know how to close it."),
    ('ph3n4', 'pho', 'film: answers', "So first, you learn control. To open when you choose, and to close when you choose."),
    # ---- OPEN AND CLOSE (§4.3 P9)
    ('ph3b0', 'pho', 'play, open and close', "Hold out your hands."),
    ('ph3b1', 'pho', 'play, open and close', "Open."),
    ('ph3b2', 'pho', 'play, open and close', "Close."),
    ('ph3b3', 'pho', 'play, open and close', "Again. This time you choose when."),
    ('ph3b4', 'pho', 'play, open and close', "Once more. It will pull. Close anyway."),
    ('ph3bx', 'pho', 'play, open and close (held too long)', "Close."),
    ('ph3by', 'pho', 'play, open and close (not opened)', "You did not open. Do not be afraid of it."),
    ('ph3b5', 'pho', 'play, open and close', "Good. Now it is yours to open, and yours to close."),
    ('ph3p1', 'pho', 'play, the road', "Holding it takes years. Then you use it for others, not for yourself."),
    # ---- ending A, accept your path (§4.5)
    ('q3A0', 'he', 'ending A', "Then teach me. I will walk it."),
    ('ph3A1', 'pho', 'ending A', "You say yes quickly. Yes to what?"),
    ('q3A1', 'he', 'ending A', "To hold it first. However many years. And then to use it for others. Not for myself."),
    ('ph3A2', 'pho', 'ending A', "Good. Remember that order when progress is slow. That is when most people give up."),
    ('tn3A1', 'ton', 'ending A', "New ones roll the mats, bro."),
    ('q3A2', 'he', 'ending A', "I had imagined something grander. My path began with other people's mats."),
    ('q3A3', 'he', 'ending A', "I did not mind. For once I knew what I was doing, and who I was doing it under."),
    # ---- ending B, challenge the path
    ('q3B0', 'he', 'ending B', "I sell amulets. I came into all of this for my business. I never asked for a path."),
    ('ph3B1', 'pho', 'ending B', "Nobody asks."),
    ('ph3B2', 'pho', 'ending B', "Tell me again how you came to this mat. Slowly."),
    ('q3B1', 'he', 'ending B', "A Sak Yant, for luck. Then another. An amulet shop I kept going back to. Amulets I picked up to see what they would do. Three kumanthong I took home. A master I went to about my business."),
    ('ph3B3', 'pho', 'ending B', "Who carried you?"),
    ('q3B2', 'he', 'ending B', "Nobody. I walked."),
    ('q3B3', 'he', 'ending B', "I sat there angry until the light went yellow. He never once looked my way."),
    ('q3B4', 'he', 'ending B', "All right. Teach me."),
    ('ph3B4', 'pho', 'ending B', "A man who walked here can walk on."),
    ('q3B5', 'he', 'ending B', "I had not chosen the road. I had taken every step of it myself."),
    # ---- ending C, ask why
    ('q3C0', 'he', 'ending C', "Why me? Of everyone in that shop, in that temple... why me?"),
    ('ph3C1', 'pho', 'ending C', "Why me... that question has no floor. A man can fall in it his whole life."),
    ('ph3C2', 'pho', 'ending C', "Ask a better one. For whom?"),
    ('q3C1', 'he', 'ending C', "I had asked why it had happened to me. He turned my head and showed me who was waiting."),
    ('ph3C3', 'pho', 'ending C', "What you have is for them. Not for you. One day. Not yet. First you hold it."),
    ('q3C2', 'he', 'ending C', "Then that is why."),
    ('q3C3', 'he', 'ending C', "Teach me."),
    ('q3C4', 'he', 'ending C', "I had asked why me. I was given something to do with it instead."),
    # ---- ending D, ask to make it stop
    ('q3D0', 'he', 'ending D', "Can you make it stop? I don't want a path. I want my life back."),
    ('ph3D1', 'pho', 'ending D', "You are tired of it. I understand."),
    ('ph3D2', 'pho', 'ending D', "I can teach you to close. I cannot take the door away."),
    ('ph3D3', 'pho', 'ending D', "Close. And this time, stay."),
    ('q3D1', 'he', 'ending D', "For the first time in years, it was quiet."),
    ('q3D2', 'he', 'ending D', "The chanting came, and I waited for it to take me. Nothing. My hands were only my hands."),
    ('q3D3', 'he', 'ending D', "And then I understood what I had been afraid of all those years. It was never the door. It was that I could not shut it."),
    ('q3D4', 'he', 'ending D', "If I can close it, I can carry it. Teach me the rest."),
    ('ph3D4', 'pho', 'ending D', "Fear never closed it. You did."),
    ('q3D5', 'he', 'ending D', "I had asked him to take it away. He gave me the handle, and I found I could keep it."),
    # ---- the close, all four (§4.6)
    ('ph3z0', 'pho', 'the close', "Yesterday you would not kneel to a man you did not know. Good. Keep that."),
    ('ph3z1', 'pho', 'the close', "It is not the flowers you give a teacher. It is your trust. Give that slowly."),
    ('q3z1', 'he', 'the close', "Yesterday I watched people go where I could not follow. Today I opened the door a hand's width, and shut it myself."),
    ('ph3z2', 'pho', 'the close', "Tomorrow we begin."),
    ('q3K1', 'he', 'the close', "For the first time in my life I had found the teacher who could guide me to the real answers, and I will always be grateful for it."),
    # ---- under the outcome cards (§4.7)
    ('q3A', 'he', 'the card, A', "I said yes. He made me say what to."),
    ('q3B', 'he', 'the card, B', "I told him I never chose it. He asked who had carried me."),
    ('q3C', 'he', 'the card, C', "I asked why me. He showed me for whom."),
    ('q3D', 'he', 'the card, D', "I asked him to take it away. He gave me the handle."),
]


def estimate(speaker, text):
    """a line's length at its speaker's pace, until its take is measured: words over pace, a breath, and a beat a full
    stop or an ellipsis inside the line"""
    words = len(text.replace('—', ' ').split())
    stops = sum(text[:-1].count(c) for c in '.?!') + 2 * text.count('...')
    return round(max(0.9, words / PACE[speaker] + 0.35 + 0.18 * stops), 2)


if __name__ == '__main__':
    import collections
    n = collections.Counter(s for _k, s, _w, _t in LINES)
    keys = [k for k, _s, _w, _t in LINES]
    assert len(keys) == len(set(keys)), 'a key is used twice'
    print(len(LINES), 'lines', dict(n), 'about %.0f s spoken' % sum(estimate(s, t) for _k, s, _w, t in LINES))
