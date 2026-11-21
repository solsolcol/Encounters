# v28.0 · episode 4 chapter 5: THE MUSIC, nineteen cues (the plan's 10.2), as asked of ElevenLabs Music (music_v2, the
# newest the API takes: v22.4), instrumental, the length the model's own parameter (v9.2), through sound/api.py. ONE
# PALETTE for the chapter and its two themes: the TEACHER's (Grandmaster Pho: a Thai piphat colour, the struck wooden
# ranat, the bronze gong circle, the pi's reed, the taphon drum; low and grounded) and the STUDENT's (Master Zavier: a
# breathy bamboo flute, a few soft wordless voices, a small bell; high and close). Every prompt asks for nothing deep
# (a phone's speaker plays almost nothing under 120 Hz: v10.4) and leaves the voice its room where lines are said over it.
# M7, the fight, is ONE piece at one tempo and key with every layer playing throughout, made three times and separated
# into stems (six_stems_v1) and grouped into five (sound/stems.py says how, and why this way). Two takes of every other
# cue, three of the opening and of M7. Writes sound/music.json:   python3 -I masters/v28.0/sound/music.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
END = ' Instrumental, no vocals with words, no deep sub bass; the low end carried by cellos and low reeds a small speaker can play.'
LOOP = ' Loopable: a steady level from its first seconds to its last, no intro, no ending, no climax.'
M = [
    ('u5m1open', 70, 3, "Dread for a horror film's opening: a slow sustained low drone with no tune, a soft metallic hum like a lift's motor turning into music, faint high glassy tones, a far wind; it grows heavier and sour toward the end, a sickly detuned swell, then holds." + END,
     'M1: the opening film (the lift, the doors, the sour), about 65 s'),
    ('u5m2walk', 60, 2, "Sparse uneasy underscore for walking along an apartment block corridor at dusk: one plucked string figure of four notes, struck now and then over a quiet sustained drone of low strings and a faint wind texture, long spaces between, uneasy and searching." + LOOP + END,
     'M2: the walkway (play, a loop)'),
    ('u5m3room', 45, 2, "A quiet unsettling underscore for a tired man's living room at dusk: a soft ticking figure on a muted marimba like a clock that does not quite keep time, slipping out of step now and then, over low sustained strings, sad and restless, leaving space for speech." + END,
     "M3: Mr Koh's room (the devotee film)"),
    ('u5m4hunt', 60, 2, "Searching investigation music for a supernatural hunt in a house at night: a low soft pulse of muted drum and pizzicato cellos, a faint glassy pad, a slow rising tension, eerie high harmonics coming and going, careful and patient." + LOOP + END,
     'M4: the hunt (play, a loop; the chapter lifts it a step at each stain)'),
    ('u5m5nine', 14, 2, "One sustained eerie choir-like chord of strings and soft wordless voices swelling out of silence, cold and still, dissonant at its heart, held and then fading to nothing." + END,
     'M5: the nine seen (one sung chord, then nothing)'),
    ('u5m6prep', 55, 2, "Ritual preparation music at night: a slow steady Thai drum, a long sustained line on a Thai reed oboe (pi), a low bronze gong now and then, a soft drone; it gathers slowly, solemn and tense, building to the edge of something." + END,
     'M6: the preparation, and the turn'),
    ('u5m7fight', 96, 3, "Driving cinematic battle music for a supernatural fight, 96 BPM, D minor, one steady tempo and key from the first second to the last, no tempo change, no breakdown, no silence, the full arrangement playing all the way through so it can be looped and layered: Thai taphon and klong drums with deep frame drums and toms; low cellos and basses in a pulsing ostinato; a fast struck wooden xylophone (ranat) line repeating; a breathy bamboo flute melody over the top; deep bronze gongs and a gong circle with low brass swells; a wordless choir and a small bright bell. Urgent, heroic, mystical." + ' Instrumental, no lyrics.',
     'M7: the fight (one piece; five stems of one length: sound/stems.py)'),
    ('u5m8surge', 14, 2, "One long held tense note of high strings and a faint shimmering drone, all else gone quiet, suspended and fragile, with a slow heartbeat-like soft pulse under it." + END,
     'M8: the surge (every stem down to one held note and his heart)'),
    ('u5m9naga', 42, 2, "Majestic sacred climax for a giant serpent of fire rising: a Thai gong circle and ranat xylophone in a bright heroic theme together with a breathy bamboo flute melody, both themes at once, a wordless choir swelling, deep gongs and horns, triumphant and awe-inspiring, then settling." + END,
     'M9: TOGETHER (the Naga film: both themes at once, the only time)'),
    ('u5m10last', 36, 2, "Very sparse still music: a single struck Tibetan singing bowl ringing out every eight seconds, a faint soft high drone of air and breath between, much room and silence, calm after a storm." + LOOP + END,
     'M10: the last three (a struck bowl for each, and room; a loop)'),
    ('u5m11light', 40, 2, "Plain warm gentle music for a house that feels lighter after a long night: a soft acoustic guitar and a warm low flute, simple and calm, a little tired, quietly hopeful, no drums." + END,
     'M11: the house lighter (the bag tied film)'),
    ('u5m12lift', 26, 2, "Almost nothing: a very soft sustained high string tone and a few far apart notes of a bamboo flute, thoughtful and quiet, leaving the words room." + END,
     "M12: at the lift, his teacher's lesson"),
    ('u5m13shop', 60, 2, "Quiet afternoon music in a calm room: a soft plucked figure on a Thai zither and a gentle guitar, a ceiling fan's lazy rhythm in it, warm and plain, a little uneasy underneath." + LOOP + END,
     'M13: the receiving room in the afternoon (play, a loop)'),
    ('u5m14sight', 40, 2, "Thin cold strings for looking at something uncanny: high sustained violins in slow dissonant harmonics, a glassy shimmer, eerie and fragile, very quiet." + LOOP + END,
     'M14: the pieces, his sight open (a loop)'),
    ('u5m15endA', 50, 2, "An order obeyed and something left unresolved: a measured steady piano and low strings, plain and correct, never arriving home, ending on an open unresolved chord." + END,
     'M15: ending A'),
    ('u5m16endB', 50, 2, "A man finding out for himself: plain gentle warmth, a soft bamboo flute melody over warm strings and a quiet harp, rising slowly into a calm resolved close." + END,
     'M16: ending B'),
    ('u5m17endC', 50, 2, "A small alarm that steadies: begins with uneasy staccato strings and a nervous pulse, then calms, a warm low line coming in and settling it into quiet." + END,
     'M17: ending C'),
    ('u5m18endD', 50, 2, "A wry turn: a light plucked pizzicato and a clarinet with a gently ironic, knowing melody, a little playful, then turning thoughtful and quiet." + END,
     'M18: ending D'),
    ('u5m19card', 32, 2, "The student's theme alone, quiet: a solo breathy bamboo flute melody with a faint soft drone and a small bell at its end, peaceful and thoughtful, a little open." + END,
     'M19: the last picture and the card'),
]
names = [m[0] for m in M]; assert len(set(names)) == len(M) == 19
json.dump([dict(name=n, secs=s, takes=t, prompt=p, where=w) for n, s, t, p, w in M], open(os.path.join(HERE, 'music.json'), 'w'), indent=1)
print(len(M), 'cues;', sum(m[2] for m in M), 'takes;', sum(m[1] * m[2] for m in M), 'seconds of music asked for')
