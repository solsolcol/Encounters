"""v28.0 · THE REELS FOR CHAD'S EAR (v10.6: anything chosen on taste goes to him as loudness-matched previews of every
candidate, and his ear decides; the measure only screens). One reel a music cue, every take of it in letter order (a,
b, c), each brought to -18 LUFS integrated (EBU R128, ffmpeg's ebur128 read, then one gain), a second and a half of
silence between them; the takes as they came, uncut. M7's reel: the teacher's mix (floor, drums, line), the student's
(floor, flute, voices), all five, then each stem alone for 15 s, all from the game's own five stems. The nine's
voices: one reel a kind, its four takes. Written to sound/previews/<name>.mp3 (192 kbps).
    python3 -I masters/v28.0/sound/previews.py      (MADE=<the folder stems.py wrote> for M7's reel)"""
import json, os, re, subprocess, tempfile
R = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(R, 'previews'); os.makedirs(OUT, exist_ok=True)
T = tempfile.mkdtemp(prefix='u5rev_', dir=os.environ.get('TMPDIR', '/tmp'))
def lufs(p):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1])
def norm(src, dst, cut=None):
    pre = os.path.join(T, 'pre.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src] + (['-t', str(cut)] if cut else []) + ['-ar', '48000', '-ac', '2', pre], check=True)
    g = -18 - lufs(pre)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', f'volume={g:.2f}dB,alimiter=limit=0.95:level=false', '-ar', '48000', '-ac', '2', dst], check=True)
def reel(name, parts):
    files = []
    sil = os.path.join(T, 'sil.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '1.5', sil], check=True)
    for i, (src, cut) in enumerate(parts):
        d = os.path.join(T, f'{name}_{i}.wav'); norm(src, d, cut); files += [d, sil]
    lst = os.path.join(T, 'list.txt'); open(lst, 'w').write(''.join(f"file '{f}'\n" for f in files))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(OUT, name + '.mp3')], check=True)
    print(name, len(parts), 'parts', flush=True)
raw = lambda k: os.path.join(R, 'raw', k + '.mp3')
MUS = json.load(open(os.path.join(R, 'music.json')))
for o in MUS:
    n = o['name']
    if n == 'u5m7fight': continue
    src = 'u5m6prep2' if n == 'u5m6prep' else n
    reel(n, [(raw(f'{src}_{l}'), None) for l in 'abc' if os.path.exists(raw(f'{src}_{l}'))])
MADE = os.environ.get('MADE')
if MADE:
    st = {k: os.path.join(MADE, 'm7', k + '.wav') for k in ('u5m7low', 'u5m7drum', 'u5m7line', 'u5m7flute', 'u5m7voice')}
    def mixof(ks, out):
        cmd = ['ffmpeg', '-v', 'error', '-y'] + sum([['-i', st[k]] for k in ks], []) + ['-filter_complex', f'amix=inputs={len(ks)}:normalize=0', out]
        subprocess.run(cmd, check=True); return out
    reel('u5m7', [(mixof(['u5m7low', 'u5m7drum', 'u5m7line'], os.path.join(T, 'teacher.wav')), 40),
                  (mixof(['u5m7low', 'u5m7flute', 'u5m7voice'], os.path.join(T, 'student.wav')), 40),
                  (mixof(list(st), os.path.join(T, 'all.wav')), 40)] + [(st[k], 15) for k in st])
for k in ('u5ncome', 'u5nslip', 'u5nhide'):
    reel(k, [(raw(f'{k}_{l}'), None) for l in 'abcd'])
