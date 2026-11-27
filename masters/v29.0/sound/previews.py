"""v29.0 · THE REELS FOR CHAD'S EAR (v10.6: anything chosen on taste goes to him as loudness-matched previews of every
candidate, and his ear decides; the measure only screens). One reel a music cue: every take of it in letter order, the
takes made again after them (M2, M3, M6's second layer: the first ones a phone cannot play, kept in the reel so his ear
sees why), each brought to -18 LUFS integrated (EBU R128, ffmpeg's ebur128, then one gain), 1.5 s of silence between.
M6's three layers also as one mix (the picks together, as the night's play stacks them at full pressure). The voices:
one reel a part (Grace, Marcus), every voice saying its two lines, each line at -18 LUFS. sound/previews/<name>.mp3, 192k.
    python3 -I masters/v29.0/sound/previews.py      (RAW=<the takes' folder> while they sit in scratch; AUD the auditions')"""
import json, os, re, subprocess, tempfile
R = os.path.dirname(os.path.abspath(__file__)); OUT = os.environ.get('OUT') or os.path.join(R, 'previews'); os.makedirs(OUT, exist_ok=True)
T = tempfile.mkdtemp(prefix='u51rev_')
RAWS = [os.path.join(R, 'raw'), os.environ.get('RAW', '')]
def raw(k):
    for d in RAWS:
        p = os.path.join(d, k + '.mp3')
        if os.path.exists(p): return p
def lufs(p):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1])
def norm(src, dst):
    pre = os.path.join(T, 'pre.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ar', '48000', '-ac', '2', pre], check=True)
    g = -18 - lufs(pre)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', f'volume={g:.2f}dB,alimiter=limit=0.95:level=false', '-ar', '48000', '-ac', '2', dst], check=True)
def reel(name, srcs):
    sil = os.path.join(T, 'sil.wav'); files = []
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '1.5', sil], check=True)
    for i, s in enumerate(srcs):
        d = os.path.join(T, f'{name}_{i}.wav'); norm(s, d); files += [d, sil]
    lst = os.path.join(T, 'list.txt'); open(lst, 'w').write(''.join(f"file '{f}'\n" for f in files))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(OUT, name + '.mp3')], check=True)
    print(name, len(srcs), 'parts', flush=True)
M = json.load(open(os.path.join(R, 'music.json'))) + json.load(open(os.path.join(R, 'music2.json')))
AGAIN = {'u51m2room': 'u51m2room2', 'u51m3pull': 'u51m3pull2', 'u51m6b': 'u51m6b2'}
for o in M:
    n = o['name']
    if n in AGAIN.values(): continue
    ks = [f"{n}_{'abc'[i]}" for i in range(o['takes'])]
    if n in AGAIN: a = [x for x in M if x['name'] == AGAIN[n]][0]; ks += [f"{a['name']}_{'abc'[i]}" for i in range(a['takes'])]
    reel(n, [raw(k) for k in ks])
P = json.load(open(os.path.join(R, 'picks.json')))
mix = os.path.join(T, 'm6mix.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + sum([['-i', raw(P[k]['take'])] for k in ('u51m6a', 'u51m6b', 'u51m6c')], []) + ['-filter_complex', 'amix=inputs=3:normalize=0', mix], check=True)
reel('u51m6mix', [mix])
AUD = os.environ.get('AUD') or os.path.join(R, 'audition'); C = json.load(open(os.path.join(R, 'audition.json')))
for who, o in C.items():
    reel(f'voice_{who}', [os.path.join(AUD, f"{who}_{v['tag']}_{i + 1}.mp3") for v in o['voices'] for i in range(len(o['lines']))])
