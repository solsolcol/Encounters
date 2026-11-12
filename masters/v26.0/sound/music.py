# v26.0 · episode 4 chapter 3: THE MUSIC, as it is asked of ElevenLabs Music v2.5 (eleven_music_v2_5, instrumental).
# A row: (name, seconds, takes, the prompt, where). Each cue's length is its film's own (sound/clocks.json, worked out
# from the chapter's head after the voices were measured: node masters/v26.0/sound/clocks.mjs), plus a little: the cue
# is cut and faded to the film at sound.sh. Every prompt asks for nothing deep (v24.34: the first takes of that chapter
# ran 46 to 95 % under 120 Hz, which a phone's speaker does not play). Three takes of each: one reel a cue goes to
# Chad, and the measured pick stands until his ear (v10.6). Writes sound/music.json:
#   node masters/v26.0/sound/clocks.mjs && python3 -I masters/v26.0/sound/music.py
#
# ONE PALETTE for the chapter, so its cues are one score: felt piano and soft strings (him, and his questions), a Thai
# khim and a bamboo flute (the place, and the teacher). Two pieces are IN THE WORLD, over the ground's loudspeakers:
# the festival's own music and the dance's (Chad was asked what the real music is; these stand until he says).
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(HERE, 'clocks.json')))
F, B, TE, AN, E, C, O = T['FEST'], T['BETW'], T['TELL'], T['ANSW'], T['ENDT'], T['CLOSE'], T['OPENT']
up = lambda x: float(int(x + 0.999))
ND = ' Instrumental, no drums. No sub-bass, nothing deep.'
MUSIC = [
    ('x3openmus', up(O['end'] + 2), 3, "Quiet, searching underscore for a man alone with old questions late at night: slow felt piano and a soft sustained string pad, sparse and introspective. In its final quarter it lifts and brightens with a gentle Thai khim (hammered dulcimer) figure and warm strings, hopeful, arriving somewhere new. Cinematic, slow." + ND, 'the opening film'),
    ('x3dancemus', up(F['cut'] + 3), 3, "Traditional Thai ceremonial dance music played live by a small ensemble at a temple fair: ranat ek xylophone, khong wong gong circle, pi nai oboe, ching hand cymbals and soft hand drums; graceful, festive and reverent, mid tempo, starting at once. Heard outdoors. Instrumental. No sub-bass, nothing deep.", 'the festival film: the dance for the Thevadas (in the world, over the loudspeakers)'),
    ('x3festmus', 64.0, 3, "Lively traditional Isan folk music from northeast Thailand played live at a temple fair: khaen mouth organ, phin lute, hand drums and small cymbals; bright and festive, one steady mid tempo groove from its first second to its last, with no breaks, no solo passages and no ending. Instrumental. No sub-bass, nothing deep.", 'day one, in play and in its films: the ground\'s own music (in the world, over the loudspeakers; looped)'),
    ('x3sightmus', up(F['end'] - F['pho'] + 2), 3, "One warm, still chord of soft strings with a single gentle gong stroke at its start and one Thai khim note above it; reverent, a moment of recognition, held and slowly fading to nothing." + ND, 'the festival film: the man in white'),
    ('x3nightmus', up(B['end'] + 2), 3, "A gentle nocturne: soft felt piano and a distant Thai bamboo flute (khlui), calm, tired and thoughtful, night in the countryside, ending on a quiet hopeful rising phrase as dawn comes. Sparse and slow." + ND, 'the night between'),
    ('x3tellmus', up(TE['end'] + 2), 3, "Very quiet, intimate underscore under a spoken confession: a soft sustained string pad and a slow, sparse felt piano, patient and listening, a little sad, never melodramatic, the same low dynamic from start to end, no tune that draws attention." + ND, 'the telling'),
    ('x3answmus', up(AN['end'] + 2), 3, "Warm, slowly opening underscore under a wise teacher's words: sustained strings, a soft Thai khim and a bamboo flute; dignified, a calm revelation. It grows gradually brighter and fuller toward its end, hopeful but restrained, and ends on a held warm chord. Slow." + ND, 'the answers'),
    ('x3endA', up(E['A']['close'] - E['A']['long'] + 2), 3, "A plain, warm, humble theme: a softly plucked Thai phin lute and gentle strings, content and unhurried, the dignity of simple work, ending gently. Slow." + ND, 'ending A · accept your path'),
    ('x3endB', up(E['B']['silence'] - E['B']['q3B1'] + 3), 3, "Spare and stubborn: single soft piano notes with long spaces between them and one lone cello under them, pride slowly giving way, ending unresolved on one held note that fades. Very slow." + ND, 'ending B · challenge the path'),
    ('x3endC', up(E['C']['close'] - E['C']['turn'] + 2), 3, "Opening outward with compassion: warm strings swelling gently under a tender Thai bamboo flute melody, the sight of other people who are waiting, hopeful, ending softly. Slow." + ND, 'ending C · ask why'),
    ('x3endD', up(E['D']['close'] - E['D']['q3D3'] + 1), 3, "Stillness and relief after years of noise: a soft high sustained pad and a slow, simple Thai khim melody; quiet, safe and gently hopeful, ending softly. Very slow." + ND, 'ending D · ask to make it stop'),
    ('x3closemus', up(C['breath'] + 4.5 + 1.5), 3, "A reverent, expectant theme: soft strings and felt piano with a gentle Thai khim, a student before his teacher, tender and grave, rising slowly and ending suspended on an unresolved held chord. Slow." + ND, 'the close, up to its one breath'),
    ('x3lastmus', up(C['end'] - C['q3z1'] + 2.5), 3, "A reverent theme resolved: warm strings, felt piano, a Thai khim and a bamboo flute, grateful and calm, building gently to a full warm final chord that rings out and fades. Slow." + ND, 'the close, after the breath, to "Tomorrow we begin."'),
]
names = [r[0] for r in MUSIC]; assert len(set(names)) == len(names)
json.dump([dict(name=n, secs=s, takes=t, prompt=p, where=w) for n, s, t, p, w in MUSIC], open(os.path.join(HERE, 'music.json'), 'w'), indent=1)
for n, s, t, p, w in MUSIC: print('%-11s %5.0f s  %s' % (n, s, w))
print(len(MUSIC), 'cues;', sum(r[2] for r in MUSIC), 'takes;', round(sum(r[1] * r[2] for r in MUSIC)), 'seconds of music asked for')
