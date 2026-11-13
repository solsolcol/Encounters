# v26.0 · episode 4 chapter 3: HOW EACH LINE IS SAID. One tag a line at most, naming an emotion (Chad's prompt rules,
# v5.28: the registry's words exactly, no added capitals, at most one added ellipsis, one tag naming an emotion, never
# only a volume). lines.py holds the words; this holds the direction; prompts.py joins them into what eleven_v3 is
# given (masters/v26.0/voices/prompts.json). A line with no row here is said plain.
VOICE = {
    'he':   'bP8FJDHmWVEgXJDitdQd',     # Brian: the grown Master Zavier, as episodes 3 and 4
    'pho':  'xYmBpJREC3WfqEFpbPvO',     # Songkran: the measured pick of three (masters/v26.0/audition), until Chad's ear
    'ton':  'uI1epevl1X6hqrxEciKt',     # Kirin: the measured pick of three
    'aunt': 'B4NdgwdU97lHqA8Udh2D',     # Kanya: the measured pick of three
}
TAKES = {'he': 2, 'ton': 2, 'aunt': 2, 'pho': 3}     # (three for Grandmaster Pho: his takes of one prompt ran from 2.4 to 3.1 words a second, and the unhurried one is wanted)
TAGS = {
    # the opening film: alone at his counter, late
    'q3o1': 'reflective', 'q3o2': 'quiet', 'q3o3': 'quiet', 'q3o4': 'quiet', 'q3o5': 'tired', 'q3o6': 'reflective',
    # day one
    'q3v': 'awed', 'q3m0': 'uneasy', 'q3m1': 'quiet', 'q3w1': 'quiet', 'q3w2': 'awed', 'q3w3': 'reflective',
    'q3u1': 'tense', 'q3u2': 'shaken', 'q3u3': 'wary', 'q3c1': 'curious', 'q3c2': 'polite', 'q3c3': 'reflective',
    'tn3a1': 'friendly', 'tn3a2': 'friendly', 'tn3d1': 'quiet', 'tn3m1': 'encouraging', 'tn3m2': 'gentle', 'tn3c1': 'serious',
    'tn3c2': 'friendly', 'tn3n1': 'quiet', 'tn3A1': 'cheerful', 'ds3c1': 'gentle', 'ds3p1': 'cheerful',
    # the telling: a grown man laying it down before a teacher
    'q3t1': 'quiet', 'q3t2': 'uneasy', 'q3t3': 'sincere', 'q3t4': 'ashamed',
    'q3t8': 'quiet', 'q3a1': 'awed',
    # Grandmaster Pho: unhurried, every line
    'ph3g1': 'warm', 'ph3n1': 'calm', 'ph3n2': 'warm', 'ph3n3': 'serious', 'ph3n4': 'calm',
    'ph3b0': 'gentle', 'ph3b1': 'calm', 'ph3b2': 'calm', 'ph3b3': 'calm', 'ph3b4': 'serious', 'ph3bx': 'calm', 'ph3by': 'gentle', 'ph3b5': 'warm',
    'ph3p1': 'calm',
    'ph3A1': 'amused', 'ph3A2': 'warm', 'ph3B1': 'calm', 'ph3B2': 'patient', 'ph3B3': 'gentle', 'ph3B4': 'warm',
    'ph3C1': 'gentle', 'ph3C2': 'calm', 'ph3C3': 'serious', 'ph3D1': 'gentle', 'ph3D2': 'calm', 'ph3D3': 'calm', 'ph3D4': 'warm',
    'ph3z0': 'warm', 'ph3z1': 'calm', 'ph3z2': 'warm',
    # the four endings and the close
    'q3A0': 'determined', 'q3A1': 'calm', 'q3A2': 'wry', 'q3A3': 'content',
    'q3B0': 'defensive', 'q3B1': 'reluctant', 'q3B2': 'quiet', 'q3B3': 'bitter', 'q3B4': 'humbled', 'q3B5': 'reflective',
    'q3C0': 'anguished', 'q3C1': 'reflective', 'q3C2': 'quiet', 'q3C3': 'determined', 'q3C4': 'reflective',
    'q3D0': 'exhausted', 'q3D1': 'relieved', 'q3D2': 'amazed', 'q3D3': 'reflective', 'q3D4': 'determined', 'q3D5': 'grateful',
    'q3z1': 'calm', 'q3K1': 'grateful',
    'q3A': 'reflective', 'q3B': 'reflective', 'q3C': 'reflective', 'q3D': 'reflective',
}
