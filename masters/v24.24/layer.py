"""v24.25 · the first master's chant made a MURMUR in which no word can be made out (Chad, 1 Nov 2026: "i want all of
the ajahn's chants to be [un]intelligible, meaning you cannot even hear the words, but i can still hear namo tassa and
the chant words. The ajahn is supposed to be evil so he should not even chant proper buddhist chants and should be
chanting something else").

The words are no longer the homage or any Pali: four phrases of MEANINGLESS chant-like syllables (sessions.json, n1-n4),
whispered in his own voice one phrase a take (the only way it stays a whisper — v24.24's lesson). One whispered stream
alone is still heard as syllables, so three run at once:
  LEAD   the phrases in order, the model's own half-second breath between — the chant's rhythm, his voice on top
  BACK   other takes of the phrases played BACKWARDS, 5 dB under, a little behind — a second voice of the same man whose
         sounds are no syllable of any language
  UNDER  a third set, 9 dB under, further behind — so every gap in the lead is filled and nothing stands out alone
Each phrase is cut at its measured edges (LEAD 0.06 s before its first sound, 0.12 s after its last) and brought to one
loudness before the mix; the whole is cut to the lead's length with 0.3 s edges (a loop's seam is soft) and levelled
after, as the game's other whisper is (-21 dB RMS).

Usage: python3 -I layer.py out.wav LEAD a.mp3,b.mp3 BACK c.mp3,d.mp3 UNDER e.mp3,f.mp3 [--back-at 0.55] [--under-at 1.3]
       [--tail OUT.wav LAST_SECONDS]   (also writes the mix's last N seconds, its own 0.35 s fade-in: ending D's end)"""
import subprocess, sys, wave
import numpy as np

SR, GAP, LEAD, TAIL, EDGE = 48000, 0.34, 0.06, 0.12, 0.010

def load(p):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).astype(np.float64)

def words(x):
    """cut a take at its first and last sound (3 % of its loudest 20 ms, the measure meas.py reads)"""
    hop = int(0.02 * SR)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    on = np.where(e > e.max() * 0.03)[0]
    a = max(0, on[0] * hop - int(LEAD * SR)); b = min(len(x), (on[-1] + 1) * hop + int(TAIL * SR))
    y = x[a:b].copy(); r = np.linspace(0, 1, int(EDGE * SR)); y[:len(r)] *= r; y[-len(r):] *= r[::-1]
    return y

def loud(y):
    n = int(0.04 * SR)
    r = np.array([np.sqrt(np.mean(y[i:i + n] ** 2)) for i in range(0, len(y) - n, n // 2)])
    k = r[r > r.max() * 0.25]
    return float(np.sqrt(np.mean(k ** 2)))

def stream(paths, reverse=False):
    ps = [words(load(p)) for p in paths]
    if reverse: ps = [q[::-1].copy() for q in ps]
    ref = np.median([loud(q) for q in ps])
    out = []
    for i, q in enumerate(ps):
        out.append(q * ref / loud(q))
        if i < len(ps) - 1: out.append(np.zeros(int(GAP * SR)))
    return np.concatenate(out), ref

a = sys.argv[1:]
out = a[0]; opts = {}; i = 1; lists = {}
while i < len(a):
    if a[i] in ('LEAD', 'BACK', 'UNDER'): lists[a[i]] = a[i + 1].split(','); i += 2
    elif a[i] == '--tail': opts['tail'] = (a[i + 1], float(a[i + 2])); i += 3
    else: opts[a[i]] = float(a[i + 1]); i += 2
lead, ref = stream(lists['LEAD'])
mix = lead.copy()
for key, rev, gain_db, at in (('BACK', True, -5.0, opts.get('--back-at', 0.55)), ('UNDER', False, -9.0, opts.get('--under-at', 1.3))):
    if key not in lists: continue
    s, r2 = stream(lists[key], reverse=rev)
    s *= (ref / r2) * 10 ** (gain_db / 20)
    o = int(at * SR); n = min(len(s), len(mix) - o)
    if n > 0: mix[o:o + n] += s[:n]
e = int(0.3 * SR); r = np.linspace(0, 1, e); mix[:e] *= r; mix[-e:] *= r[::-1]
pk = np.abs(mix).max()
if pk > 0.95: mix *= 0.95 / pk

def write(p, y):
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())

write(out, mix)
print(f'{out}: {len(mix) / SR:.2f} s — LEAD {len(lists["LEAD"])}, BACK {len(lists.get("BACK", []))} (reversed, -5 dB), UNDER {len(lists.get("UNDER", []))} (-9 dB)')
if 'tail' in opts:
    p, secs = opts['tail']; t = mix[-int(secs * SR):].copy(); f = int(0.35 * SR); t[:f] *= np.linspace(0, 1, f)
    write(p, t); print(f'{p}: the last {secs:.2f} s')
