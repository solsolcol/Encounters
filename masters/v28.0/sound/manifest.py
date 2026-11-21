"""v28.0 · THE MANIFEST of episode 4 chapter 5's effects, beds and music (sound/manifest.json), for the play, fight and film
work that wires the cues (they are wired there, not here) and for install.py. One row a sound: its name; its family; what
it is (one-shot, loop: a short loop played at a thing, bed: a place's loop, music: a film's cue, music-loop: a play cue's
loop, stem: one of M7's five); where it belongs (the beat or the act, and for the fight the rules' event it answers:
masters/v28.0/parts/c_fightrules.js, st.ev); the volume to cue it at (every file is levelled to one measure, so this is
where it stands in the mix: a one-shot at 1 is its loudest 50 ms at -14 dBFS, a bed at 0.55 is near -35 dBFS, music at
1 peaks at -3); its group (names dealt in turn for one event, so a repeated act never repeats a sound); why it is the
take it is. Written from sound/picks.json:   python3 -I masters/v28.0/sound/manifest.py"""
import json, os, re
R = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(R, 'picks.json')))
KIND = {'fx': 'one-shot', 'loop': 'loop', 'bed': 'bed', 'music': 'music', 'mbed': 'music-loop', 'stem': 'stem', 'note': 'one-shot', 'copy': None}
COPYKIND = {'u5vison': 'one-shot', 'u5visoff': 'one-shot', 'u5heart': 'one-shot', 'u5visbed': 'bed', 'u5vismus': 'music-loop'}
# the fight's events (c_fightrules.js) and the sounds each one cues: the wiring's map
EVENT = {
    'fireball': ['u5swing1|u5swing2', 'u5fire1|u5fire2|u5fire3', 'u5flight'],
    "land result 'chased'/'setback'": ['u5land1|u5land2', 'u5hitc|u5hits|u5hith (by the Prai\'s kind)'],
    "land result 'tired'": ['u5ruby', 'u5tired1|u5tired2'],
    "land result 'slipped'": ['u5slipthru'], "land result 'stale' / none": ['u5stale'],
    'bind': ['u5bind1|u5bind2', 'then u5bindhold looped at the bubble'], 'bind stale': ['u5bindstale'], 'unbind': ['u5bindpop'],
    'smell': ['u5sniff1|u5sniff2|u5sniff3', 'u5sournote', 'u5ripple'], 'smell found / state to shown': ['u5shown'],
    'drawn (SMELL for nothing: they are drawn on)': ['u5strain1|u5strain2|u5strain3 from the Prai'],
    'lend': ['u5lend', 'u5cagehum crosses to his teacher (its pan and place)'], 'lendEnd': ['u5lendback'],
    'waveReady': ['u5waveready'], 'windup': ['u5windup', 'u5robe'], 'wave': ['u5wave', 'u5lampflare at each lamp the ring passes'],
    'broken': ['u5wavebreak'], 'gathered by the wave': ['u5drawn1|u5drawn2', 'u5noteN'],
    'BAG pressed (drawn by the bag)': ['u5baginhale', 'u5drawn1|u5drawn2'], 'gathered by the bag': ['u5bagsnap', 'u5noteN (N = 9 - left: a step higher each time)'],
    'enter': ['u5rise1|u5rise2', 'then the kind\'s voice looped at it: u5ncome / u5nslip / u5nhide'],
    'state to pressing': ['u5strain1|u5strain2|u5strain3', 'u5barring1|u5barring2'], 'state to hidden': ['u5sink'],
    'reach': ['u5gather1|u5gather2'], 'drain / sanity': ['u5zbreath', "the engine's pulse"],
    'rise': ['u5unrise'], 'cageBreak': ['u5cagecrack', 'u5stagger'], 'cageWhole': ['u5cagewhole'],
    'the cage, always': ['u5cagehum (gain the cage\'s strength)', 'u5cagethin (its weakness)', 'u5murmur1|2|3'],
    'switch': ['u5swpho / u5swzav (the one arrived at)', 'M7: the arrival\'s stems up over 0.4 s'],
    'refused': ["the engine's own refusal"], 'stage (learn/fight/hold)': ['u5plant on a hold\'s start'],
    'hold / holdEnd': ['M7 down a step / back (the plan\'s 10.2)'], 'surge': ['u5shape', 'u5shapeloop', 'u5cagecrack', 'M8 u5m8surge over every stem down'],
    'together': ['u5togfill'], 'naga': ['u5nagarise', 'u5nagacoil', 'u5nagabreath', 'u5embers', 'u5shapebreak', 'u5laid', 'M9 u5m9naga'],
    'won': ['u5done', 'M10 down'], 'lost': ['u5broken'], 'the brief\'s START': ['u5start'],
}
GAIN = {'one-shot': 0.8, 'loop': 0.5, 'bed': 0.55, 'music': 0.7, 'music-loop': 0.55, 'stem': 1.0}
SPECIAL = {'u5step1': 0.45, 'u5step2': 0.45, 'u5tile1': 0.45, 'u5phostep': 0.4, 'u5zstep': 0.4, 'u5threads': 0.3, 'u5sour': 0.0,
           'u5lampbuzz': 0.25, 'u5clock': 0.25, 'u5flies': 0.45, 'u5bindhold': 0.35, 'u5cagehum': 0.4, 'u5cagethin': 0.0,
           'u5murmur1': 0.45, 'u5murmur2': 0.45, 'u5murmur3': 0.45, 'u5ncome': 0.4, 'u5nslip': 0.4, 'u5nhide': 0.4,
           'u5shapeloop': 0.5, 'u5nagabreath': 0.5, 'u5embers': 0.35, 'u5ready': 0.5, 'u5flight': 0.6, 'u5lampflare': 0.4,
           'u5playground': 0.35, 'u5tvwall': 0.35, 'u5mynah': 0.4, 'u5os1': 0.4, 'u5os2': 0.4, 'u5os3': 0.4, 'u5os4': 0.4,
           'u5shutter': 0.4, 'u5farchime': 0.35, 'u5lifthum': 0.55, 'u5wave': 1.0, 'u5nagarise': 1.0,
           'u5m7low': 0.85, 'u5m7drum': 1.0, 'u5m7line': 1.0, 'u5m7flute': 1.0, 'u5m7voice': 0.8, 'u5bowl': 0.0}
NOTE = {'u5sour': 'its gain is the smell\'s nearness (0 far, up to 0.5 at the source); never over a line',
        'u5cagethin': 'crossfaded under u5cagehum as the cage wears: cagehum x strength, cagethin x (1 - strength) x 0.45',
        'u5bowl': 'the source of the nine notes: not cued itself',
        'u5m7low': 'M7 floor: up from the fight\'s first frame for its whole length',
        'u5m7drum': "M7 teacher's: 1.0 while Grandmaster Pho is played, 0.3 while Master Zavier is (each over 0.4 s); 0.5 in a hold",
        'u5m7line': "M7 teacher's: as u5m7drum",
        'u5m7flute': "M7 student's: 1.0 while Master Zavier is played, 0.3 while Grandmaster Pho is",
        'u5m7voice': "M7 student's: 0.8 while Master Zavier is played, 0.2 while Grandmaster Pho is; up to 0.8 in a hold (the voices hold the hold)",
        'u5vismus': "Spirit Vision's music (chapter 4 cued its copy at 0.32)", 'u5visbed': "Spirit Vision's bed (chapter 4: 0.56)",
        'u5heart': "Spirit Vision's heart (chapter 4: 0.55)", 'u5vison': "Spirit Vision opens (chapter 4: 0.85)", 'u5visoff': 'Spirit Vision closes (chapter 4: 0.85)'}
GROUP = {}
for n in P:
    m = re.fullmatch(r'(u5[a-z]+?)(\d)', n)
    if m and n not in ('u5os1', 'u5os2', 'u5os3', 'u5os4'): GROUP[n] = m.group(1)
for n in ('u5os1', 'u5os2', 'u5os3', 'u5os4'): GROUP[n] = 'u5os (a seeded stream: one at a time, panned, quieter while anyone speaks, v21.13)'
for n in ('u5hitc', 'u5hits', 'u5hith'): GROUP[n] = 'u5hit (by the struck Prai\'s kind: come, slip, hide)'
rows = []
for n, e in P.items():
    if e['kind'] == 'NONE': continue
    kind = COPYKIND.get(n) if e['kind'] == 'copy' else KIND[e['kind']]
    if n == 'u5bowl': kind = 'source'
    g = SPECIAL.get(n, GAIN.get(kind, 0.8))
    if n.startswith('u5note'): g = 0.7
    r = dict(name=n, family=e.get('family'), kind=kind, gain=g, **{'for': e.get('where')}, why=e.get('why'))
    if n in GROUP: r['group'] = GROUP[n]
    if n in NOTE: r['note'] = NOTE[n]
    rows.append(r)
cued = [r for r in rows if r['kind'] != 'source']
json.dump(dict(chapter='e4c5', made='masters/v28.0/sound (make.sh: the record)', fight_events=EVENT,
               m7=dict(stems=['u5m7low', 'u5m7drum', 'u5m7line', 'u5m7flute', 'u5m7voice'], loop_secs=75.0, bpm=96, key='D minor',
                       rule="ALL FIVE asked for together on the fight's first frame (loopVol), so they stay in step; each brought up or down over 0.4 s, never on a beat; every spoken line ducks the music 8 dB (the engine's duck)"),
               sounds=[r for r in rows if r['kind'] != 'source']),
          open(os.path.join(R, 'manifest.json'), 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(len(cued), 'sounds:', dict(Counter(r['family'] for r in cued)), dict(Counter(r['kind'] for r in cued)))
