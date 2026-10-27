"""v23.0 CP11 · write make.sh's voice section from the picks: one line per take (him / cast / phone), the flags its
measures call for, and why that take — the words exactly first, then a clean end, then a clean head, then the pauses
(autopick.py's order; the child voices by their register, child.py). Prints the section; make.sh is assembled by hand."""
import json, re, subprocess, os
T = json.load(open('tr.json')); M = json.load(open('measure.json')); A = json.load(open('autopick.json'))
ctx = {'window': {}}
src = open('../../../src/voicelines.js').read()
reg = json.loads(subprocess.run(['node', '-e', "const vm=require('vm'),fs=require('fs');const c={window:{}};vm.createContext(c);"
    "vm.runInContext(fs.readFileSync('../../../src/voicelines.js','utf8'),c);"
    "console.log(JSON.stringify(c.window.__VOICE__.LINES.filter(r=>r.ch==='e3c5')))"], capture_output=True, text=True).stdout)
CHILD = {   # the children, through him: eleven_v4 in a child's register (child.py: median f0 / voiced %), never pitch-shifted
  'z5b1': ('z5b1_v4_a', 'v4, a bossy small boy (~300 Hz): "Mine. These are all mine." whole; clean end'),
  'z5b2': ('z5b2_v4_a', 'v4, the bossy one: both "Nobody"s, the cleaner head (-50)'),
  'z5b3': ('z5b3_v4_a', 'v4, the bossy one, "More. I want more." whole; clean end'),
  'z5b4': ('z5b4_hiB_a', 'v4 under "[in a high, small child\'s voice]" (~172 Hz): the hurt line quiet and small; the v3 takes '
                         'kept Brian\'s own register'),
  'z5s1': ('z5s1_v4_a', 'v4, the shy one\'s giggle and "you can\'t see me"; clean at both ends'),
  'z5s2': ('z5s2_v4_a', 'v4, the shy one whispering "hide... hide..."; the clean head (-62)'),
  'z5s3': ('z5s3_hiB_a', 'v4 under the child direction (~258 Hz); it says the line and then again, so it is cut after '
                         'the first "my secret" (keep 2.3)'),
  'z5s4': ('z5s4_hiA_a', 'v4 under the child direction (~196 Hz), both halves with the pause between them'),
  'z5l1': ('z5l1_hiB_a', 'v4 under the child direction (~163 Hz), very soft; clean at both ends'),
  'z5l2': ('z5l2_v4_b', 'v4 (~182 Hz), the question kept a question; a repeats "you won\'t go"'),
  'z5l3': ('z5l3_v4_b', 'v4 (~326 Hz), "Stay... stay with me" said once; a says it twice'),
  'z5sob': ('z5sob_v4_a', 'v4, a small boy\'s quiet sob (wordless — the transcriber hears breaths as "hehe")'),
  'z5Agig': ('z5Agig_v4_b', 'v4, the dry small giggle out of his own mouth (~250 Hz)'),
}
HAND = {
  'ow5never': ('ow5never_a', 'the first take after all: the re-said pair (ow5never2) was made because the transcriber heard '
               '"listen, ah" as "listener" — biased with the script it hears "listen ah..." in all four takes (LEARNINGS); '
               'a has the quietest head and end (-31 / -28) and the script\'s comma ("not for money, not for lottery numbers")'),
}
KEEP = {'z5s3': 2.3}
out = []
for r in reg:
    k = r['id']
    if k == 'mk5yatha': continue
    if k in CHILD: take, why = CHILD[k]
    elif k in HAND: take, why = HAND[k]
    else:
        cands = A[k]; take = cands[0]; m = M[take]
        bits = []
        tr = T[take]['text']
        endon = m['end'] > -40 and m['tail'] < 0.05; headon = m['head'] > -40 and m['lead'] < 0.03
        others = cands[1:]
        if others:
            o = M[others[0]]; oendon = o['end'] > -40 and o['tail'] < 0.05
            if not endon and oendon: bits.append(f"clean end ({m['end']:.0f}; {others[0][-1]} ends on signal)")
            elif endon and oendon: bits.append(f"both end on signal, this one starts cleaner (head {m['head']:.0f} against {o['head']:.0f})" if m['head'] < o['head'] else f"both end on signal; faded")
            elif not endon and not oendon: bits.append(f"clean at both ends (head {m['head']:.0f}, end {m['end']:.0f})")
            else: bits.append(f"the words exactly where {others[0][-1]} slips" if True else '')
        why = '; '.join(bits) or 'the only take'
    m = M[take]
    flags = []
    endon = m['end'] > -40 and m['tail'] < 0.05
    if k in KEEP: flags.append(f'--keep {KEEP[k]}')
    elif m['tail'] > 0.9: flags.append(f"--keep {round((m['secs'] - m['tail'] + 0.30) * 20) / 20:.2f}")
    if m['lead'] > 0.35: flags.append(f"--head {round((m['lead'] - 0.15) * 20) / 20:.2f}")
    if endon: flags.append('$F')
    fn = {'jamesAdult': 'him', 'owner3': 'cast', 'monk5': 'cast', 'mother': 'phone'}[r['who']]
    out.append((k, fn, take, ' '.join(flags), why, r['where']))
for k, fn, take, flags, why, where in out:
    print(f"#   {k:11s} {take[len(k)+1:] if take.startswith(k+'_') else take:8s} {why}")
print()
for k, fn, take, flags, why, where in out:
    print(f"{fn:5s} {k:11s} raw/{take}.mp3 {flags}".rstrip())
