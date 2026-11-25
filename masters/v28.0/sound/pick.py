"""v28.0 · THE PICK, by measure (a session has no ears, v10.4), from sound/measures-sfx.json and -music.json into
sound/picks.json, each pick with its reason (masters/v28.0/sound/make.sh carries the table). Chapter 4's order:
  EFFECTS  1 no word (every take through the transcriber: one it writes a word from is refused, v25.4); 2 not near
           silent (its loudest 50 ms over -45 dBFS); 3 the share a phone plays (over 150 Hz): the takes within 0.08 of
           the best; 4 among those, a one-shot the fuller (its loudest 50 ms), a bed or a loop the steadier (its seconds'
           swing) and then the less in the voice's band (lines are said over beds). A pick a phone plays under 35 % of is
           HARMONISED at its encode (chapter 4's HARM: the take kept whole, its low end's harmonics laid under it). A
           one-shot's silent head over 0.12 s is cut (a cue must sound when it is cued).
  MUSIC    1 no hole (a second 14 dB under its median); 2 the share a phone plays; 3 for a loop the steadier, for a film's
           cue the fuller. Each film's cue is measured against its film when the films are cut (M9), and a pick may move
           then: until then, and until Chad's ear (v10.6: the reels in sound/previews), the pick stands and is said.
    python3 -I masters/v28.0/sound/pick.py"""
import json, os
R = os.path.dirname(os.path.abspath(__file__))
SFX = json.load(open(os.path.join(R, 'sfx.json'))); MS = json.load(open(os.path.join(R, 'measures-sfx.json')))
# (R94, 24 Nov 2026: the fire's new layers, sfxR94.json, picked by the same rules; their names are new, so no pick before moves)
SFX += json.load(open(os.path.join(R, 'sfxR94.json'))); MS.update(json.load(open(os.path.join(R, 'measures-sfxR94.json'))))
# (R122, 25 Nov 2026: the special attack's new sounds, sfxR122.json, picked by the same rules; their names are new too)
SFX += json.load(open(os.path.join(R, 'sfxR122.json'))); MS.update(json.load(open(os.path.join(R, 'measures-sfxR122.json'))))
# (R149, 25 Nov 2026: the rumble under the Naga's charge, sfxR149.json; a new name, so no pick before moves)
SFX += json.load(open(os.path.join(R, 'sfxR149.json'))); MS.update(json.load(open(os.path.join(R, 'measures-sfxR149.json'))))
MUS = json.load(open(os.path.join(R, 'music.json'))); MM = json.load(open(os.path.join(R, 'measures-music.json')))
MM.update(json.load(open(os.path.join(R, 'measures-music4.json'))))
AGAIN = {'u5m6prep': 'u5m6prep2'}      # made again (music4.json): the game's name keeps the cue's, the takes are the new ones
STEPS = {'u5step1', 'u5step2', 'u5tile1', 'u5phostep', 'u5zstep'}
PLAYCUES = {'u5m2walk': (52, 3), 'u5m4hunt': (52, 3), 'u5m10last': (30, 2), 'u5m13shop': (52, 3), 'u5m14sight': (34, 2)}
SHAPED = {'u5nagaclimb': 'u5nagaclimb_a'}
P = {}; refused = []
for o in SFX:
    n = o['name']; takes = {k: v for k, v in MS.items() if k.rsplit('_', 1)[0] == n}
    ok = {}
    for k, m in sorted(takes.items()):
        if m.get('words'): refused.append((k, 'the transcriber writes "%s"' % m['words'])); continue
        if m['loud'] < -48: refused.append((k, 'near silent (its loudest 50 ms %.1f dBFS)' % m['loud'])); continue   # (-48: the faint textures, the threads' hiss and the thread's rasp, were asked faint)
        ok[k] = m
    if not ok:
        P[n] = dict(kind='NONE', why='every take refused'); continue
    best_ph = max(m['phone'] for m in ok.values())
    near = {k: m for k, m in ok.items() if m['phone'] >= best_ph - 0.08}
    loop = o['loop']; kind = 'bed' if loop and o['secs'] >= 12 else ('loop' if loop else 'fx')
    if kind == 'fx': k = max(near, key=lambda k: near[k]['loud'])
    else:                       # a loop: of those within 12 dB of the fullest (a faint take raised 28 dB is its noise
                                # raised with it: u5cagehum's b), the steadier, then the less in the voice's band
        top = max(m['loud'] for m in near.values()); near = {k: m for k, m in near.items() if m['loud'] >= top - 12}
        k = min(near, key=lambda k: (near[k].get('swing', 0) + 10 * near[k]['voice']))
    # (R64/R70, 23 Nov: a climb must CLIMB: its loudness read in fifths of a second, the takes that rise to a peak and pass
    #  (a 1.0 s, b 0.6 s) kept over the one a phone plays most of, which holds one level from end to end, -20 dBFS: a steady
    #  rush, no climb (c). The measure picks the share a phone plays; the SHAPE is read from the numbers. Set AFTER the
    #  if/else above: set between them it once took the else for every one-shot, 54 picks changed on paper, caught and undone)
    if n in SHAPED and SHAPED[n] in ok: k = SHAPED[n]
    m = ok[k]
    others = ', '.join('%s %.2f/%.1f' % (kk[-1], mm['phone'], mm['loud']) for kk, mm in sorted(ok.items()) if kk != k)
    why = '%s: %d %% where a phone plays, loudest 50 ms %.1f dBFS' % (k[-1], round(100 * m['phone']), m['loud'])
    if kind != 'fx': why += ', swing %.1f dB, %d %% in the voice band' % (m.get('swing', 0), round(100 * m['voice']))
    if others: why += ' (others, phone/loudest: %s)' % others
    if n in SHAPED and SHAPED[n] == k: why += '; by its SHAPE: it rises to its peak and passes, where the others hold one level'
    rf = [r for r in refused if r[0].rsplit('_', 1)[0] == n]
    if rf: why += '; refused: ' + '; '.join('%s %s' % (a[-1], b) for a, b in rf)
    e = dict(kind=kind, take=k, family=o['family'], where=o['where'], why=why)
    if n in STEPS: e['level'] = -16
    if m['phone'] < 0.35: e['harm'] = True; e['why'] += '; HARMONISED (a phone plays %d %%)' % round(100 * m['phone'])
    if kind == 'fx' and m['first'] > 0.12:
        e['af'] = 'atrim=start=%.2f,asetpts=PTS-STARTPTS,afade=t=in:d=0.02' % max(0, m['first'] - 0.03); e['why'] += '; its %.2f s silent head cut' % m['first']
    P[n] = e
# (R149: every take of the rumble came back the wrong way round for a charge: up in half a second, level, then dying over
#  its last 1.5 s (measures-sfxR149.json, read in tenths), and 83 to 98 % of it under 120 Hz, where a phone plays nothing.
#  When every take fails the measure the sound is MADE (v24.3): the pick turned back to front, so its fall is a rise from
#  silence and its grain is drawn in, its last 0.45 s (the take's own onset, turned round into a fade) cut, so it ends at
#  its loudest under the staff's strike; a climb of 12 dB laid over the whole; and the house's harmonics (HARM) laid in
#  under it inside the same filter (encode.py's pre() reads `af` OR the harmonics, never both). Measured once made: from
#  -83 to -20 dB, its loudest 50 ms in its last tenth, a phone plays 39 % of it (2 % alone, as asked))
if 'u5rumble' in P and P['u5rumble'].get('take'):
    P['u5rumble'].pop('harm', None)
    P['u5rumble']['af'] = ("areverse,atrim=end=3.95,asetpts=PTS-STARTPTS,volume='pow(10,(-12+12*t/3.95)/20)':eval=frame,"
                           "afade=t=out:st=3.91:d=0.04,asplit[a][b];[b]lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,"
                           "lowpass=f=2500,volume=-6dB[h];[a][h]amix=inputs=2:normalize=0")
    P['u5rumble']['why'] = P['u5rumble']['why'].split('; HARMONISED')[0] + (
        '; MADE from it (R149): turned back to front to rise from silence, cut to end at its loudest (3.95 s: its own silent '
        'head is at the end now, and cut with its onset), a 12 dB climb over it, and HARMONISED in the same filter')
P['u5bowl']['kind'] = 'source'; P['u5bowl']['why'] += "; the SOURCE of the count's nine notes (notes.py): not a file of the game"
# Spirit Vision: chapter 4's own five, byte for byte under this chapter's names (v7.1)
for n, f in (('u5vison', 'u4vison'), ('u5visoff', 'u4visoff'), ('u5heart', 'u4heart'), ('u5visbed', 'u4visbed'), ('u5vismus', 'u4vismus')):
    P[n] = dict(kind='copy', **{'from': f}, family='vision', where='Spirit Vision (the fiftieth seam, as chapter 4 declares it)',
                why="chapter 4's %s byte for byte: the plan's 10.1, 'the engine's own, as chapter 4'" % f)
# the count's nine notes, made from the bowl's pick (sound/notes.py)
for i in range(1, 10):
    P['u5note%d' % i] = dict(kind='note', wav='notes/u5note%d.wav' % i, family='screen',
                             where='gathered: the count falls to %d (the %s note of the rising ladder)' % (9 - i, ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'][i - 1]),
                             why="MADE from u5bowl's pick (%s), resampled onto D minor pentatonic from D5 (sound/notes.py)" % P['u5bowl'].get('take'))
# the music
for o in MUS:
    n = o['name']
    if n == 'u5m7fight': continue
    takes = {k: v for k, v in MM.items() if k.rsplit('_', 1)[0] == AGAIN.get(n, n)}
    def score(m):
        # its body: from its third second to two before its last sound (a piece's own fade at its end is no hole: a cue
        # that ends sooner than its film is ended by the film's fade)
        body = m['secs'][2:max(3, int(m['last']) - 2)] if len(m['secs']) > 8 else m['secs']; med = sorted(body)[len(body) // 2]
        holes = sum(1 for v in body if v < med - 14)
        return (holes, -round(m['phone'] / 0.05), m['swing'] if n in PLAYCUES else -m['level'])
    wordy = [kk for kk, mm in takes.items() if mm.get('words')]
    k = min([kk for kk in takes if kk not in wordy] or takes, key=lambda k: score(takes[k])); m = takes[k]
    others = ', '.join('%s %d %%/%d holes' % (kk[-1], round(100 * mm['phone']), score(mm)[0]) for kk, mm in sorted(takes.items()) if kk != k)
    why = '%s: no hole in its body' % k[-1] if score(m)[0] == 0 else '%s: %d holes in its body' % (k[-1], score(m)[0])
    why += ', %d %% where a phone plays, swing %.1f dB, %d %% in the voice band (others, phone/holes: %s)' % (round(100 * m['phone']), m['swing'], round(100 * m['voice']), others)
    if n in PLAYCUES:
        secs, st = PLAYCUES[n]; e = dict(kind='mbed', take=k, secs=secs, start=st)
    else:
        e = dict(kind='music', take=k)
        if m['first'] > 0.1: e['af'] = 'atrim=start=%.2f,asetpts=PTS-STARTPTS,afade=t=in:d=0.04' % max(0, m['first'] - 0.05); why += '; its %.2f s silent head cut' % m['first']
        elif m['secs'] and m['secs'][0] > m['median'] - 3: e['af'] = 'afade=t=in:d=0.5'; why += '; it begins on signal, faded in'
    if wordy: why += '; refused: ' + ', '.join('%s (the transcriber writes "%s")' % (kk[-1], takes[kk]['words']) for kk in wordy)
    if n in AGAIN: why += '; MADE AGAIN as %s (music4.json): the first two takes a phone played 22 and 6 %% of' % AGAIN[n]
    e.update(family='music', where=o['where'], why=why + '. THE MEASURED PICK: it stands until Chad\'s ear (sound/previews)')
    P[n] = e
# M7: the five stems (sound/stems.py)
for n, w in (('u5m7low', 'the floor: the drums\' body and the low strings (always up)'), ('u5m7drum', "the teacher's: the drums' skins and the gongs' strike"),
             ('u5m7line', "the teacher's: the struck line, piano and xylophone"), ('u5m7flute', "the student's: the flute and the small bell"),
             ('u5m7voice', "the student's: the wordless choir (beatless, its own piece)")):
    P[n] = dict(kind='stem', wav='m7/%s.wav' % n, family='music', where='M7, the fight: ' + w,
                why='u5m7band c separated (six_stems_v1) and u5m7choir a, by sound/stems.py: one loop of 30 bars (75.0 s at 96 BPM) for all five')
json.dump(P, open(os.path.join(R, 'picks.json'), 'w'), indent=1)
print(len(P), 'picks;', sum(1 for e in P.values() if e.get('harm')), 'harmonised;', len(refused), 'takes refused;',
      [n for n, e in P.items() if e['kind'] == 'NONE'], 'with nothing')
for r in refused: print('refused', *r)
