# v27.0 · episode 4 chapter 4: HOW EACH LINE IS SAID. One tag a line at most, naming an emotion (Chad's prompt rules,
# v5.28: the registry's words exactly, no added capitals, at most one added ellipsis, one tag naming an emotion, never
# only a volume). lines.py holds the words; this holds the direction; prompts.py joins them into what eleven_v3 is
# given (masters/v27.0/voices/prompts.json). A line with no row here is said plain.
VOICE = {
    'he':   'bP8FJDHmWVEgXJDitdQd',     # Brian: the grown Master Zavier, as episodes 3 and 4
    'pho':  'xYmBpJREC3WfqEFpbPvO',     # Grandmaster Pho's voice of chapter 3 (the same man)
    'amma': 'cyzr0852QKE5DHnjiRWw',     # Tara: the measured pick of three (masters/v27.0/make.sh §4), until Chad's ear
    'ravi': 'mnlHLlgagNmPlvf52KvT',     # Dhananjay: the measured pick of three
    'mala': 'PIuCDYHMakaExG7GFyLU',     # Sonam: kept well apart from her mother's pitch
}
TAKES = {'he': 2, 'pho': 3, 'amma': 3, 'ravi': 2, 'mala': 2}   # (three for Grandmaster Pho, as chapter 3: the unhurried one is wanted; three for Amma: one line, aged by its read)
TAGS = {
    # the opening film: looking back on it
    'q4o1': 'reflective', 'q4o2': 'reflective', 'rv4o1': 'respectful',
    # history first: a family who has told this many times; him, quiet, piecing it together
    'ph4h0': 'calm', 'rv4h1': 'weary', 'rv4h2': 'frustrated', 'ml4h1': 'tired', 'q4h1': 'quiet',
    'ml4h2': 'proud', 'ml4h3': 'sad', 'q4h2': 'quiet', 'am4h1': 'weary', 'q4h3': 'serious', 'ph4h1': 'warm', 'ph4h2': 'gentle',
    # the sight: his teacher's voice low; his own, shaken and then steady
    'ph4s0': 'calm', 'q4s1': 'uneasy', 'q4s2': 'quiet', 'q4s3': 'uneasy', 'ph4s1': 'calm',
    'ph4s2': 'serious', 'ph4s3': 'serious', 'ph4s4': 'calm',
    # the blessing
    'ph4b0': 'gentle', 'ph4b1': 'calm', 'ph4b2': 'serious', 'ph4b3': 'firm', 'ph4b4': 'serious', 'ph4b5': 'firm',
    'ph4b6': 'calm', 'ph4b7': 'urgent',
    # (R128, R129: the tags their takes were given at build 53, written here so prompts.json is remade with them)
    'ph4b8': 'gentle', 'ph4b9': 'firm',
    # (R142) why the green ones come for her, in the dark before the fight: told plainly, a teacher's gravity
    'ph4k1': 'calm', 'ph4k2': 'serious', 'ph4k3': 'serious', 'ph4k4': 'serious',
    # the fight speaks (Chad, 18 Nov)
    'q4f1': 'tense', 'q4f2': 'afraid', 'ph4f1': 'firm', 'rv4f1': 'panicked', 'q4f3': 'desperate', 'ph4f2': 'urgent',
    'q4f4': 'pleading', 'ph4f3': 'firm',
    # the trance: Mala knows it; Ravi is afraid of the cry
    'ml4t1': 'worried', 'ml4t2': 'awed', 'rv4t1': 'panicked',
    # the four endings
    'ph4A1': 'serious', 'q4A1': 'ashamed', 'ph4B0': 'fierce', 'ph4B1': 'serious', 'q4B1': 'ashamed',
    'q4C0': 'gentle', 'ph4C1': 'warm', 'q4C1': 'quiet', 'ph4D0': 'calm', 'ph4D1': 'warm', 'q4D1': 'reflective',
    # the family in the four endings: Ravi fighting to her, then reaching her; Mala at the room; their mother waking
    'rv4A1': 'panicked', 'ml4A1': 'frantic', 'am4A1': 'confused', 'rv4A2': 'tearful', 'ml4B1': 'shocked',
    'ml4B2': 'frightened', 'ml4B3': 'concerned', 'rv4C1': 'tearful', 'am4C1': 'tender', 'rv4D1': 'nervous', 'ml4D1': 'awed',
    # the close
    'ph4z0': 'calm', 'ml4z1': 'tearful', 'am4z1': 'grateful', 'ph4z1': 'serious',
    # the outcome cards' lines
    'q4A': 'ashamed', 'q4B': 'ashamed', 'q4C': 'quiet', 'q4D': 'reflective',
}
