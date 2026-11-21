"""v28.0 · episode 4 chapter 5's EFFECTS, BEDS AND MUSIC into the engine's vocabulary (STING_SAMPLE): one row a sound, for
every name in sound/manifest.json whose two files are in the game (assets/audio/<n>.mp3 and assets/audio-opus/<n>.ogg),
between this chapter's own markers. Chapter 4's install_sound.py made this chapter's: a unique-string edit (v14.1),
idempotent (run it again and it changes nothing it has already done). The rows sit AFTER the chapter's voices' block
(masters/v28.0/voices/install.py writes everything between E4C5 VOICES BEGIN and END: rows inside it would be dropped by
its next run, as chapter 4's once nearly were), or after chapter 4's effects if the voices are not in yet. Every row's
gain is 1: a cue's volume is set where it is cued, from the manifest's `gain` (a STING_SAMPLE gain multiplies it, v6.14).
The build needs no row of its own: build.py finds every sound in assets/audio and gives it to the one chapter that names it.
  python3 -I masters/v28.0/sound/install.py [--check]   (from the repo root; --check writes nothing)"""
import json, os, re, sys
MAIN = 'src/main.js'; main = open(MAIN, encoding='utf-8').read()
man = json.load(open('masters/v28.0/sound/manifest.json', encoding='utf-8'))
names = [s['name'] for s in man['sounds']]
miss = [n for n in names if not (os.path.isfile(f'assets/audio/{n}.mp3') and os.path.isfile(f'assets/audio-opus/{n}.ogg'))]
assert not miss, ('a file missing', miss)
FXB = '  /* E4C5 FX BEGIN: v28.0, its effects, beds and music (masters/v28.0/sound/install.py) */\n'
FXE = '  /* E4C5 FX END */\n'
if main.count(FXE) == 0:
    for anchor in ('  /* E4C5 VOICES END */\n', '  /* E4C4 FX END */\n'):
        if main.count(anchor) == 1: main = main.replace(anchor, anchor + FXB + FXE); break
    else: raise SystemExit('no anchor for the rows')
assert main.count(FXB) == 1 and main.count(FXE) == 1
i = main.index('const STING_SAMPLE = {'); j = main.index('\n};', i)
assert i < main.index(FXE) < j, 'the markers are not inside STING_SAMPLE'
have = set(re.findall(r"([A-Za-z0-9_]+): \['", main[i:j]))
clash = [n for n in names if n in have and f"{n}: ['{n}', 1]" not in main[i:j]]
assert not clash, ('a name already in STING_SAMPLE as something else', clash)
new = [n for n in names if n not in have]
if new:
    rows, line = [], '  '
    for n in new:
        t = f"{n}: ['{n}', 1], "
        if len(line) + len(t) > 118: rows.append(line.rstrip()); line = '  '
        line += t
    rows.append(line.rstrip())
    block = '  /* v28.0 · its effects, beds and music (masters/v28.0/sound/make.sh: every pick and why; manifest.json: what each is for) */\n' + '\n'.join(rows) + '\n'
    main = main.replace(FXE, block + FXE)
print(len(names), 'sounds;', len(new), 'rows added')
if '--check' not in sys.argv and new: open(MAIN, 'w', encoding='utf-8').write(main)
