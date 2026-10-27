# Writes the chapter's SECS table (between /* SECS BEGIN */ and /* SECS END */ in src/chapters/e4/e4c1.js) from the
# registry's lengths — estimates while a row is planned (est), measured once CP11 records it. Re-run after either.
import json, re, subprocess
out = subprocess.run(['node', '-e', '''
const vm=require("vm"),fs=require("fs");const c={window:{}};vm.createContext(c);
vm.runInContext(fs.readFileSync("src/voicelines.js","utf8"),c);
console.log(JSON.stringify(c.window.__VOICE__.LINES.filter(l=>l.ch==="e4c1").map(l=>[l.id,l.secs])));'''],
  capture_output=True, text=True, check=True).stdout
rows = json.loads(out)
groups = {}
for i, s in rows:
    k = re.match(r'[a-z]+', i).group(0)
    groups.setdefault(k, []).append(f"'{i}': {s}")
lines = ['  /* SECS BEGIN */', '  const SECS = {']
for k, items in groups.items():
    chunk, cur = [], '   '
    for it in items:
        if len(cur) + len(it) > 112: chunk.append(cur.rstrip()); cur = '   '
        cur += ' ' + it + ','
    chunk.append(cur.rstrip())
    lines.append(f'    /* {k} */')
    lines += ['  ' + c for c in chunk]
lines += ['  };', '  /* SECS END */']
p = 'src/chapters/e4/e4c1.js'
src = open(p, encoding='utf-8').read()
a = src.index('  /* SECS BEGIN */'); b = src.index('  /* SECS END */') + len('  /* SECS END */')
src = src[:a] + '\n'.join(lines) + src[b:]
open(p, 'w', encoding='utf-8').write(src)
print(len(rows), 'lengths written')
