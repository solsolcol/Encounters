"""v28.0 · episode 4 chapter 5's EFFECTS, BEDS AND MUSIC made into the game's files, from the picks (sound/picks.json, by
sound/pick.py from sound/measures-*.json; every pick and why is there and in masters/v28.0/sound/make.sh). Chapter 4's
chain (masters/v27.0/sound.sh), one rule a kind, run from the repo root:
    python3 -I masters/v28.0/sound/encode.py [name ...]
  ONE-SHOT   its loudest 50 ms at -14 dBFS (his own steps -16), peaks held at -2 by the numpy limiter
             (../v26.0/sound/level_fx.py); in its own channels; a phone-deaf pick (under 35 % over 150 Hz) gets its own
             low end's harmonics laid in under it (HARM, chapter 4's, the take kept whole); a silent head over 0.12 s cut
  BED        a place's loop (16 s or longer): 60 Hz high-pass, its RMS at -30 dBFS with a ceiling of -12 (../v21.12/level_rms.py),
             padded for the engine's insets (../v24.34/music/padloop.py): the chapter sets it near 0.55 (-35 dBFS in the mix)
  LOOP       a short loop (a voice, a hum): levelled as a one-shot and padded as a bed
  MUSIC      a film's cue at peak -3 dBFS (v22.4), its silent head cut, faded in where it begins on signal; a play cue
             (M2, M4, M10, M13, M14) a loop cut from its body (../v21.2/musicloop.py) and padded; M7's five stems as
             sound/stems.py made them, encoded as they are (one gain for all five: they must stay one piece)
  THE COUNT  nine notes from one bowl (sound/notes.py)
  COPIES     Spirit Vision's five, chapter 4's files byte for byte under this chapter's names (v7.1: a sound cued from
             another chapter's name would make it every player's download)
mp3 128k 44.1 kHz and Opus (96k effects, 128k music) 48 kHz, each from the same levelled master, both measured after (v9.6),
metadata stripped."""
import json, os, shutil, subprocess, sys, tempfile
import numpy as np
R = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(R, '..', '..', '..'))
# (the lead's rule: encode into a scratch folder, OUT=<dir> with audio/ and audio-opus/ in it, then move the batch into
#  assets/ and save it in the same step; with no OUT, assets/ itself. A copy's source is read from assets/ always)
SA = os.path.join(ROOT, 'assets', 'audio'); SO = os.path.join(ROOT, 'assets', 'audio-opus')
OUT = os.environ.get('OUT'); A = os.path.join(OUT, 'audio') if OUT else SA; O = os.path.join(OUT, 'audio-opus') if OUT else SO
os.makedirs(A, exist_ok=True); os.makedirs(O, exist_ok=True); M = os.path.join(ROOT, 'masters')
PICKS = json.load(open(os.path.join(R, 'picks.json'))); only = set(sys.argv[1:])
HARM = "[0:a]asplit[a][b];[b]lowpass=f=160,volume=26dB,asoftclip=type=tanh,highpass=f=180,lowpass=f=2500,volume=-6dB[h];[a][h]amix=inputs=2:normalize=0"
TMP = tempfile.mkdtemp(prefix='u5enc_', dir=os.environ.get('TMPDIR', '/tmp'))
def run(*a): subprocess.run(list(a), check=True)
def chans(p): return int(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=channels', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.split()[0])
def peak(p):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', '48000', '-'], capture_output=True).stdout
    return 20 * np.log10(np.abs(np.frombuffer(r, np.float32)).max() + 1e-12)
def flat(n, w, ch, br):
    run('ffmpeg', '-v', 'error', '-y', '-i', w, '-ac', str(ch), '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', os.path.join(A, n + '.mp3'))
    run('ffmpeg', '-v', 'error', '-y', '-i', w, '-ac', str(ch), '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', br, '-ar', '48000', os.path.join(O, n + '.ogg'))
    pm, po = peak(os.path.join(A, n + '.mp3')), peak(os.path.join(O, n + '.ogg'))
    print(f'{n:14s} mp3 peak {pm:6.1f}  ogg peak {po:6.1f}', flush=True); return pm, po
def pre(src, n, af=None, fc=None):
    w = os.path.join(TMP, n + '_w.wav')
    if fc: run('ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', fc, '-ar', '48000', w)
    else: run('ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af or 'anull', '-ar', '48000', w)
    return w
def fx(n, src, lv, af=None, fc=None, loop=False):
    ch = chans(src); w = pre(src, n, af, fc); l = os.path.join(TMP, n + '_l.wav')
    run('python3', '-I', os.path.join(M, 'v26.0/sound/level_fx.py'), w, l, str(lv), '-2')
    if loop:
        p = os.path.join(TMP, n + '_p.wav'); run('python3', '-I', os.path.join(M, 'v24.34/music/padloop.py'), l, p); l = p; ch = 2
    return flat(n, l, ch, '96k')
def bed(n, src, t=-30, c=-12, fc=None):
    w = pre(src, n, None if fc else 'highpass=f=60:poles=2', fc + ',highpass=f=60:poles=2' if fc else None); l = os.path.join(TMP, n + '_l.wav'); p = os.path.join(TMP, n + '_p.wav')
    run('python3', '-I', os.path.join(M, 'v21.12/level_rms.py'), w, l, str(t), str(c))
    run('python3', '-I', os.path.join(M, 'v24.34/music/padloop.py'), l, p)
    return flat(n, p, 2, '96k')
def splice(w, cuts):
    # (R181) each cut [a, b, d], in the file's own seconds: at b the piece goes back to a and runs on from there, so the
    # passage from a to b is heard twice and the piece is b - a longer; the one join an equal-power crossfade over d,
    # centred on b and on a (the second time through reaches b and runs on into what followed it, unbroken)
    import numpy as np
    from scipy.io import wavfile
    sr, x = wavfile.read(w); x = x.astype(np.float32) / (32768.0 if x.dtype == np.int16 else 1.0)
    for a, b, d in cuts:
        ia, ib, k = int(round(a * sr)), int(round(b * sr)), int(round(d * sr)) // 2 * 2
        f = np.linspace(0.0, 1.0, k, dtype=np.float32); f = f[:, None] if x.ndim > 1 else f
        j = x[ib - k // 2: ib + k // 2] * np.cos(f * np.pi / 2) + x[ia - k // 2: ia + k // 2] * np.sin(f * np.pi / 2)
        x = np.concatenate([x[:ib - k // 2], j, x[ia + k // 2:]])
    wavfile.write(w, sr, x.astype(np.float32))

def mus(n, src, af, fc=None, cuts=None):
    w = pre(src, n, af, fc); x = os.path.join(TMP, n + '_x.wav')
    if cuts: splice(w, cuts)
    p = peak(w); run('ffmpeg', '-v', 'error', '-y', '-i', w, '-af', f'volume={-3 - p:.2f}dB', '-c:a', 'pcm_f32le', x)
    # the encoders move the peak a little each way (v9.6): one more pass on each from its own measure
    flat(n, x, 2, '128k')
    for ext, d, br in (('.mp3', A, '128k'), ('.ogg', O, '128k')):
        q = peak(os.path.join(d, n + ext)); g = -3 - q
        if abs(g) > 0.1:
            y = os.path.join(TMP, n + '_y.wav'); run('ffmpeg', '-v', 'error', '-y', '-i', x, '-af', f'volume={g:.2f}dB', '-c:a', 'pcm_f32le', y)
            if ext == '.mp3': run('ffmpeg', '-v', 'error', '-y', '-i', y, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', os.path.join(A, n + ext))
            else: run('ffmpeg', '-v', 'error', '-y', '-i', y, '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '128k', '-ar', '48000', os.path.join(O, n + ext))
    print(f'{n:14s} music: mp3 {peak(os.path.join(A, n + ".mp3")):.1f}  ogg {peak(os.path.join(O, n + ".ogg")):.1f}', flush=True)
def mbed(n, src, secs, start, af):
    w = pre(src, n, af + ',aformat=channel_layouts=stereo')
    subprocess.run(['python3', os.path.join(M, 'v21.2/musicloop.py'), w, str(secs), str(start)], check=True, cwd=TMP)
    lw = os.path.join(TMP, 'w_' + os.path.splitext(os.path.basename(w))[0] + '.wav')
    p = os.path.join(TMP, n + '_p.wav'); run('python3', '-I', os.path.join(M, 'v24.34/music/padloop.py'), lw, p)
    mus(n, p, 'anull')
for n, o in PICKS.items():
    if only and n not in only: continue
    k = o['kind']; src = os.path.join(R, 'raw', o['take'] + '.mp3') if o.get('take') else None
    af = o.get('af'); fc = HARM if o.get('harm') else None
    if k == 'copy':
        shutil.copyfile(os.path.join(SA, o['from'] + '.mp3'), os.path.join(A, n + '.mp3'))
        shutil.copyfile(os.path.join(SO, o['from'] + '.ogg'), os.path.join(O, n + '.ogg')); print(f'{n:14s} copy of {o["from"]}')
    elif k == 'fx': fx(n, src, o.get('level', -14), af, fc)
    elif k == 'loop': fx(n, src, o.get('level', -14), af, fc, loop=True)
    elif k == 'bed': bed(n, src, fc=fc)
    # (R181: a piece cut and joined: its `splice`, or a graph of its own, its `fc`)
    elif k == 'music': mus(n, src, af or 'anull', o.get('fc'), o.get('splice'))
    elif k == 'mbed': mbed(n, src, o['secs'], o['start'], af or 'anull')
    elif k in ('stem', 'note'): flat(n, os.path.join(os.environ.get('MADE', ''), o['wav']), 2 if k == 'stem' else 1, '128k' if k == 'stem' else '96k')
shutil.rmtree(TMP, ignore_errors=True)
