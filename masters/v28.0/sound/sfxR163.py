# v28.0 · episode 4 chapter 5, R163 to R168 (Chad, 26 Nov 2026, of the Naga film's start: "The sound effect of charging the
# naga stick is very annoying"; "The naga charging sound sounds like someone saying ahhhh in a stupid annoying way. This is a
# buddhist game , why use such gregorian chant?"; "I hear 2 repetitive gregorian style chants, one female and one male during
# the naga stick charging. They should be completely replaced with something else"; "it should sound like actual power
# gathering sound, why use temple sounds?"; "focus on the sound effect that will play the moment the naga comes out, and
# increase the impact of that"). Every sound with a voice in it that plays round the stick's charging is replaced: the
# film's own (u5windup's "building choir hum", u5togrise's "warm swelling choir hum", the tall shape's loop of "many wordless
# voices", u5togpress's "rising choir" as TOGETHER is pressed and the film begins) and their uses in the fight are the same
# files, so the four are made again, their takes named with a v (voiceless: u5windupv and the rest) and the game's own
# names kept for them in pick.py (AGAIN, as u5m6prep's), the same moments, no voice in them; the film's charge is new
# sounds of power itself gathering, and the moment the Naga comes out a new, far heavier hit. Asked of ElevenLabs Sound
# Effects v3 through sound/api.py exactly as sfxR157.py's rows. R98: a few credits of sound are his already-given spend.
#   python3 -I masters/v28.0/sound/sfxR163.py   (writes sound/sfxR163.json)
#   python3 -I masters/v28.0/sound/api.py sfx R163
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
NOV = ' No voices, no singing, no choir, no humming voice, no chanting, no bells, no chimes, no gongs, no music.'
LOWMID = ' Its weight punchy and textured in the low-middle range, so a small phone speaker carries it; no deep sub bass alone.'
SFX = [
    # ---- the film's own charge (new names)
    ('u5pwgather', 3.2, False, 3, .55, "Raw power gathering in two clenched fists: a deep electric hum swelling up from nothing, crackling arcs of energy snapping and fizzing, a low throbbing pulse growing faster, air sucked inward, a tense cinematic power-up building." + NOV, 'fx', 'R163: the two powers gathering in their fists as they grip the stick'),
    ('u5pwcharge', 7.0, False, 3, .55, "A huge power charge building for seven seconds: a deep electric hum rising steadily in pitch, crackling lightning arcs growing denser and louder, a roaring rush of energy and wind pulled inward, mounting to a peak at the very end, cinematic." + NOV, 'fx', 'R163: the charge up the shaft, through the lift, to the drive'),
    ('u5pwsurge', 2.2, False, 3, .55, "A surge of raw power igniting: a sharp crackling electric discharge with a heavy deep whoomp, flaring into a strong roaring energy glow that holds and settles, cinematic." + NOV + LOWMID, 'fx', 'R163: the carved head taking their power'),
    ('u5pweyes', 1.6, False, 3, .55, "Two eyes igniting with raw power: a quick heavy energy ignition thump, a bright snapping electric crackle and a short fierce rising whine of energy, cinematic." + NOV + LOWMID, 'fx', 'R163: the carved head\'s eyes igniting'),
    ('u5nagaburst', 4.5, False, 3, .6, "A colossal cinematic impact as a giant serpent of water bursts up out of the ground: an enormous deep boom with a thunderclap crack on its front, a massive roaring eruption of water and energy surging upward, a shockwave rolling outward, spray raining, epic." + NOV + ' Punchy in the low-middle range for a small phone speaker.', 'fx', 'R165: the moment the Naga comes out'),
    # ---- the four with a voice in them, made again under their own names (the fight's uses and the film's)
    ('u5windupv', 1.6, False, 3, .55, "Golden energy gathering fast in a fist: a swelling reverse whoosh with crackling electric energy and a rising power hum, tense, ending just before a release." + NOV, 'pho', 'windup: the gold gathers (1.5 s); R166: no choir'),
    ('u5togrisev', 2.2, False, 3, .55, "Raw power gathering into one point: a rising whoosh of energy with crackling sparks and a deep swelling electric hum building with anticipation, radiant and strong." + NOV, 'together', 'R68: the TOGETHER button appears in the middle; R166: no choir'),
    ('u5togpressv', 2.4, False, 3, .55, "A powerful burst of golden energy released: a deep thunderous whoomp and a crackling electric flare exploding outward with a great rush of wind, triumphant and strong." + NOV + LOWMID, 'together', 'R68: TOGETHER pressed: the burst; R166: no choir'),
    ('u5shapeloopv', 8.0, True, 2, .5, "A huge dark towering presence looming overhead: a deep ominous wavering drone with a slow menacing rumble and a cold dark wind moving through it, heavy and eerie, steady." + NOV, 'nine', 'surge: the tall shape stands (a loop); R167: no voices'),
]
names = [r[0] for r in SFX]; assert len(set(names)) == len(names), 'a name twice'
assert all(n.startswith('u5') and n.isalnum() for n in names)
json.dump([dict(name=n, secs=s, loop=l, takes=t, influence=i, prompt=p, family=f, where=w) for n, s, l, t, i, p, f, w in SFX],
          open(os.path.join(HERE, 'sfxR163.json'), 'w'), indent=1)
print(len(SFX), 'effects;', sum(r[3] for r in SFX), 'takes;', round(sum(r[1] * r[3] for r in SFX)), 'seconds of sound asked for')
