# v28.0 · M9 MADE AGAIN as ONE PIECE for the whole Naga film (Chad, 26 Nov 2026, R163 "i think the music should start from
# the very beginning", R164 "The entire start just does not feel like a cohesive whole", R165 "I don't think the music
# should be cut off , mute or fade at all", R166/R167 "why use such gregorian chant?", R168 "why use temple sounds?").
# The old M9 (music.json) was asked as "a wordless choir swelling" with a gong circle and deep gongs, and it sits at its
# full level from its first second (measures-music.json: -14.7 to -15.6 dB from 1 s on): a climax, made to come in on the
# strike. Started at the film's first frame it would put its choir and its gongs under the charge and leave nothing to
# rise to. So it is asked again as a COMPOSITION PLAN (music_v2_5, the newest; chunk-based plans need v2 or v2.5), its
# chunks timed to the film's real clock (z_tail.js TOG5_REAL; the cue starts at 0.05 s of the film):
#   1 the gathering   0     -> 10.60 s   (the grip, the two powers wound up the stick, the lift, the eyes, the slow fall;
#                                          the strike at the film's 10.65 s)
#   2 the eruption    10.60 -> 16.55 s   (the Naga bursts out, towers, Pho's line at 13.17)
#   3 the dive        16.55 -> 25.15 s   (the dive and the three pierces, 18.43 / 19.44 / 20.37, the ring, home at 25.23)
#   4 home            25.15 -> 36.65 s   (Mr Koh's line at 29.83; the film fades from 34.16 to its end at 35.96)
# No voice of any kind, no bell, chime, gong or singing bowl, no organ (negative styles: a plan cannot take
# force_instrumental). No lyric lines: a chunk's text is its name only, so nothing can be sung. Two takes; each is
# measured (measure.py music5: the words a transcriber hears, its holes, the share a phone plays) and the eruption's
# onset is found in it before it is cued. Writes sound/music5.json
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
NEG = ['choir', 'vocals', 'voice', 'singing', 'chant', 'chanting', 'humming', 'vocal pad', 'gregorian', 'bells', 'chimes',
       'gong', 'gongs', 'singing bowl', 'temple bells', 'church', 'organ', 'religious hymn', 'sub bass', 'silence', 'lyrics']
GLOBAL = ['instrumental', 'cinematic orchestral film score', 'epic', 'Thai traditional instruments with orchestra',
          'cellos and low reeds carry the low end', 'clear on a small speaker']
PLAN = [
    dict(text='[Gathering]', duration_ms=10600, context_adherence='high', negative_styles=NEG + ['melody', 'calm'],
         positive_styles=GLOBAL + ['power gathering', 'tense low string ostinato from the very first second',
                                   'deep frame drum pulse that quickens', 'rising string tremolo', 'brass swelling',
                                   'a steady crescendo from soft to very intense', 'a rising riser into the final second',
                                   'anticipation', 'no release until the end']),
    dict(text='[Eruption]', duration_ms=5950, context_adherence='high', negative_styles=NEG,
         positive_styles=GLOBAL + ['a massive orchestral impact on the first beat', 'explosive release',
                                   'heroic main theme on Thai ranat xylophone and bamboo flute together',
                                   'big Thai klong drums', 'horns', 'awe-inspiring', 'triumphant']),
    dict(text='[The Dive]', duration_ms=8600, context_adherence='high', negative_styles=NEG,
         positive_styles=GLOBAL + ['driving fast percussion', 'urgent heroic action', 'ranat xylophone and bamboo flute themes',
                                   'brass stabs', 'strings racing', 'relentless']),
    dict(text='[Home]', duration_ms=11500, context_adherence='high', negative_styles=NEG,
         positive_styles=GLOBAL + ['triumphant resolution', 'warm and glorious', 'the bamboo flute theme sings gently over strings',
                                   'settling down', 'peaceful ending', 'soft final chord']),
]
M = [dict(name='u5m9naga2', secs=round(sum(c['duration_ms'] for c in PLAN) / 1000, 2), takes=2, model='music_v2_5', plan=PLAN,
          prompt='(composition plan: see plan)', where='M9: the Naga film, one piece from its first frame (made again, R163-R168)')]
json.dump(M, open(os.path.join(HERE, 'music5.json'), 'w'), indent=1)
print(M[0]['name'], M[0]['secs'], 's in', len(PLAN), 'chunks')
