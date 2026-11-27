"""v29.0 · THE PICKS BY MEASURE (picks.json; each pick's line says why). A session has no ears (v10.4): the measure only
screens, and every taste pick waits on Chad's ear (v10.6: the reels in sound/previews). From the repo root:
    python3 -I masters/v29.0/sound/pick.py
EFFECTS (v28.0's rule): no word the transcriber writes (a take it writes words from is refused: v25.4); not near silent;
the share a phone plays (over 150 Hz) within 0.08 of the best; then the fuller (its loudest 50 ms). A pick a phone plays
under 35 % of is HARMONISED at its encode (its own low end's harmonics laid in under it, the take kept whole: chapter 4's
HARM). A silent head over 0.12 s is cut (its first sound 0.03 s in). `hit` is the second, after any cut, of the loudest
50 ms: where a cue lands (a knock, a snap, a click).
BEDS: one take each (the account's share for this part); a place's loop crossfade-looped by hand (encode.py xloop, 2 s
equal-power, its seam measured). MUSIC: below, cue by cue. COPIES: a sound the game already has that IS the thing, under
this chapter's own name (v7.1), byte for byte."""
import json, os, subprocess
import numpy as np
R = os.path.dirname(os.path.abspath(__file__))
ms = {}
for t in ('sfx', 'sfx2', 'music', 'music2'): ms.update(json.load(open(os.path.join(R, f'measures-{t}.json'))))
rows = json.load(open(os.path.join(R, 'sfx.json'))) + json.load(open(os.path.join(R, 'sfx2.json')))
RAW = [os.path.join(R, 'raw'), os.environ.get('RAW', '')]
def raw(k):
    for d in RAW:
        p = os.path.join(d, k + '.mp3')
        if os.path.exists(p): return p
def hit(k, cut):
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', raw(k), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    w = 800; c = np.cumsum(np.concatenate([[0.0], x.astype(np.float64) ** 2])); e = (c[w:] - c[:-w]) / w
    return round(max(0.0, np.argmax(e) / 16000 - cut), 2)
P = {}
SKIP = {'u51pour': 'refused: its one take carries words ("Thank you."); asked again as u51pour2'}
for o in rows:
    n = o['name']
    if n in SKIP: continue
    gname = 'u51pour' if n == 'u51pour2' else n
    takes = [f"{n}_{'abcdef'[i]}" for i in range(o['takes'])]
    refused = {k: ms[k]['words'] for k in takes if ms[k]['words']}
    ok = [k for k in takes if k not in refused and ms[k]['loud'] > -55]
    best = max(ms[k]['phone'] for k in ok)
    near = [k for k in ok if ms[k]['phone'] >= best - 0.08]
    k = max(near, key=lambda k: ms[k]['loud']); m = ms[k]
    others = ', '.join(f"{t[-1]} {ms[t]['phone']:.2f}/{ms[t]['loud']}" + (f' REFUSED ("{refused[t]}")' if t in refused else '') for t in takes if t != k)
    kind = o['family'] if o['family'] == 'bed' else ('loop' if o['loop'] else 'fx')
    d = dict(kind=kind, take=k, where=o['where'])
    why = f"{k[-1]}: {m['phone'] * 100:.0f} % where a phone plays, loudest 50 ms {m['loud']} dBFS" + (f' (others, phone/loudest: {others})' if others else '')
    cut = 0.0
    if kind == 'fx' and m['first'] > 0.12:
        cut = round(m['first'] - 0.03, 2); d['af'] = f'atrim=start={cut},asetpts=PTS-STARTPTS,afade=t=in:d=0.01'; why += f"; its {m['first']:.2f} s silent head cut"
    if m['phone'] < 0.35 and kind != 'bed':
        d['harm'] = True; why += '; HARMONISED (a phone plays under 35 % of it)'
    if kind == 'fx': d['hit'] = hit(k, cut)
    if n == 'u51pour2': why += '; u51pour asked again (its first take refused: "Thank you.")'
    d['why'] = why; P[gname] = d
# a pick by hand where the measure's first choice is the wrong sound (each said)
P['u51threads'] = dict(kind='copy', **{'from': 'u5threads'}, where=P['u51threads']['where'],
    why='a COPY of chapter 5\'s u5threads (a faint dry airy hiss with tiny crackles): the one take asked here came back 96 % under 120 Hz and its loudest 50 ms at -2.1 dBFS, a rumble where a dry rustle was asked; nothing a phone could play')
COPY = {  # name: (from, where, why)
 'u51busaway': ('busaway', 'opening 8.0 s: a bus pulls away (diesel, the air-brake\'s hiss)', 'the lorong\'s bus pulling away (v21.17): the thing itself'),
 'u51tube': ('u4tubetick', 'opening 29.0 s: the tube flickers twice', 'chapter 4\'s fluorescent tube flickering, quick ticks and a buzzing stutter'),
 'u51knock': ('doorknock', 'opening 34.5 s: two knocks (cue it 0.82 s early: its knocks at 0.82 and 1.11 s)', 'episode 1\'s door knock: two knocks, measured at 0.82 and 1.11 s'),
 'u51hinge': ('u4doorease', 'opening 36.5 s: the door\'s old hinge (with u51unlock)', 'chapter 4\'s wooden door creaking open on old hinges'),
 'u51gecko': ('u4os5', 'opening 48.5 s; her flat now and then', 'chapter 4\'s gecko chirp indoors at night'),
 'u51brass': ('x3baiset', 'the room: brass set on cloth', 'episode 4 chapter 3\'s brass bowl set down on a mat: one soft dull touch'),
 'u51buzz': ('x2buzz', 'the room: her phone\'s vibration every 20 s; cord 24.0 s', 'episode 4 chapter 2\'s phone buzz, one buzz (cue two, 0.8 s apart, for a call)'),
 'u51zip': ('x2bagzip', 'keepsake 9.0 s (her bag); barrier 6-12 s (his bag)', 'episode 4 chapter 2\'s sling bag zip pulled open, a hand rummaging'),
 'u51shower': ('showerrun', 'home 24.0 s: the shower running (a loop)', 'episode 2\'s shower running'),
 'u51showeroff': ('showeroff', 'home 28.0 s: the shower off', 'episode 2\'s shower turned off'),
 'u51clock': ('u5clock', 'home 34 and 45 s: the clock\'s tick (a loop)', 'chapter 5\'s wall clock ticking, one tick a second'),
 'u51heart': ('u4heart', 'three o\'clock: his heartbeat (with the HUD)', 'chapter 4\'s single heartbeat, lub-dub'),
 'u51vison': ('u4vison', 'Spirit Vision opened (the room, three o\'clock, the barrier)', 'chapter 4\'s own (the plan\'s 11.4: "chapter 4\'s"); forced open harder: cue it louder'),
 'u51visoff': ('u4visoff', 'Spirit Vision closed', 'chapter 4\'s own'),
 'u51spool': ('u5unwind', 'barrier 6-12 s: the spool', 'chapter 5\'s white thread unwound from a small reel'),
 'u51knot': ('u5string', 'cord 32-44 s (bound with white thread); dawn 36 s (tied and knotted twice)', 'chapter 5\'s cotton string wound and tied in a knot'),
 'u51ring': ('x2ring', 'the endings: the call ringing (a Singapore ring)', 'episode 4 chapter 2\'s Singapore ring, 0.4 on, 0.2 off, 0.4 on'),
 'u51mynah': ('u5mynah', 'dawn: mynas', 'chapter 5\'s mynah birds chattering'),
 'u51koel': ('k5koel', 'dawn 0.5 s and 24-36 s: a koel', 'episode 3 chapter 5\'s koel calling'),
 'u51liftfar': ('u4os1', 'corridor: a lift far off', 'chapter 4\'s lift arriving far down a corridor at night'),
 'u51shoe': ('u5step1', 'a man\'s single step in leather shoes (the five-foot way, dealt in turn)', 'chapter 5\'s leather shoe on a smooth floor'),
 'u51tile': ('u4tile', 'a bare step on tile (his flat at night, dealt in turn)', 'chapter 4\'s bare footstep on ceramic tile'),
 'u51wick': ('x3wick', 'the room: the candle catching from the lighter', 'episode 4 chapter 3\'s candle wick catching'),
 'u51bdawn': ('k5dawnbed', 'DAWN bed (the AC off)', 'episode 3 chapter 5\'s dawn bed'),
}
for n, (f, w, y) in COPY.items(): P[n] = {'kind': 'copy', 'from': f, 'where': w, 'why': y + ': a COPY under this chapter\'s name, byte for byte (v7.1)'}
P['u51bthree'] = dict(kind='bed', take='u51bnight_a', fc='[0:a]lowpass=f=900,volume=-8dB', where='THREE bed: the night thinned to almost nothing under the pressure',
    why='MADE from u51bnight a: the same room low-passed at 900 Hz and 8 dB down before levelling, so it sits under the night as the pressure closes in (cue it under 0.4 and cross from u51bnight)')
# MUSIC (measures-music*.json; the line of each)
MU = {
 'u51m1blue': dict(kind='music', take='u51m1blue_a', where='M1 Blue Hour: the opening, from 3.5 s', why='a: 92 % where a phone plays (b 76, c 68), its seconds within the body never 14 dB under for more than a second at a time, its last sound at 57.9 s (61.4 s of the film: under the card)'),
 'u51m2room': dict(kind='mbed', take='u51m2room2_a', secs=44, start=4, where='M2 The Room: the room\'s play, the keepsake, after the cord (a loop)', why='MADE AGAIN (the first three 4 to 16 % where a phone plays, 77 to 91 % under 120 Hz): a 94 %; b 100 % but 16 dB quieter (median -41.5 dBFS), outside the house\'s 12 dB; a loop of 44 s cut from its body (musicloop: the flattest window, its end where the take meets its head, a 2 s crossfade)'),
 'u51m3pull': dict(kind='mbed', take='u51m3pull2_b', secs=30, start=3, where='M3 The Pull: the 52-a-minute pulse and its violin slides, laid over M2 (a loop)', why='MADE AGAIN (the first three 3 to 17 %): b 100 % where a phone plays, the fuller (median -27.0 against a -31.2); a loop of 30 s from its body'),
 'u51m4break': dict(kind='music', take='u51m4break_b', cut=[[72.3, 79.4]], where='M4 The Breaking: under the event and the cord', why='b: 37 % where a phone plays (a 33, c 15), its three surges at about 36, 49 and 65 s; its snap a full stop at 70.9 s (read in tenths: under -55 dBFS) and the warm chord from 79.55 s: the silence between cut from 8.6 s to 1.5 s (the plan: "silent for 1.5 s at the snap"; 72.3 to 79.4 taken out, a 30 ms crossfade in the silence), so the chord comes in at 72.45 s of the file and the piece is 102.9 s'),
 'u51m5city': dict(kind='music', take='u51m5city_b', where='M5 Night City: home', why='b: 72 % where a phone plays, no hole before its fade at 35 s (c 81 % REFUSED: the transcriber writes "Mm."; a 54 %)'),
 'u51m6a': dict(kind='mbed', take='u51m6a_b', secs=30, start=4, where='M6 Three O\'Clock, layer 1 (from pressure 0.2; a loop)', why='b: 54 % where a phone plays (a 29), the steadier (its seconds within 5.4 dB; a 12.4)'),
 'u51m6b': dict(kind='mbed', take='u51m6b2_b', secs=30, start=4, where='M6 Three O\'Clock, layer 2 (from pressure 0.5; a loop)', why='MADE AGAIN (the first two 7 and 10 %): b 100 % (a REFUSED: the transcriber writes "you")'),
 'u51m6c': dict(kind='mbed', take='u51m6c_a', secs=30, start=4, where='M6 Three O\'Clock, layer 3, the vice (from pressure 0.8; a loop)', why='a: 65 % where a phone plays (b 16), its seconds within 2.4 dB'),
 'u51m7circle': dict(kind='music', take='u51m7circle_a', where='M7 The Circle: the barrier, from 26 s under the chant', why='a: 91 % where a phone plays (b 28, c 24), quiet for its first 12 s under the chant (median -35 dBFS), its swell at 19-20 s, its last sound at 27.4 s'),
 'u51m8dawnA': dict(kind='music', take='u51m8dawnA_a', where='M8 Dawn, ending A', why='a: 87 % where a phone plays (b 83), no hole before its end'),
 'u51m8dawnB': dict(kind='music', take='u51m8dawnB_b', where='M8 Dawn, ending B', why='b: 91 % where a phone plays (a 76, with a hole at 9 s)'),
 'u51m8dawnC': dict(kind='music', take='u51m8dawnC_b', where='M8 Dawn, ending C', why='b: 94 % (a 98, within 0.08, but a hole at 12 s), the fuller'),
 'u51m8dawnD': dict(kind='music', take='u51m8dawnD_b', where='M8 Dawn, ending D', why='b: 81 % where a phone plays (a 76), no hole before its end'),
}
P.update(MU)
# ENDS CHECKED (every effect's last 50 ms against its loudest, mp3 and Opus): these came out ending on their own sound,
# 3 to 34 dB under their loudest; each given a short fade over its last tenth (0.12 s; 0.08 for a take of 0.6 s)
for n in ('u51band', 'u51burn', 'u51carpet', 'u51charger', 'u51dip', 'u51flick', 'u51foil', 'u51palms', 'u51pour', 'u51press', 'u51slam', 'u51taxiin', 'u51walk', 'u51wax'):
    P[n]['tail'] = 0.08 if n in ('u51charger', 'u51palms', 'u51wax') else 0.12; P[n]['why'] += f"; it ended on its own sound: its last {P[n]['tail']} s faded"
json.dump(dict(sorted(P.items())), open(os.path.join(R, 'picks.json'), 'w'), indent=1)
print(len(P), 'picks;', sum(1 for v in P.values() if v.get('harm')), 'harmonised;', sum(1 for v in P.values() if v['kind'] == 'copy'), 'copies')
