// v26.0 · the chapter's film clocks, worked out from its own head (SECS and the timelines in masters/v26.0/parts/a_head.js)
// without the game:  node masters/v26.0/sound/clocks.mjs   -> prints each film's length and writes sound/clocks.json
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../parts/a_head.js', import.meta.url), 'utf8').split('\n');
const a = src.findIndex(l => l.includes('/* SECS BEGIN */')), b = src.findIndex(l => l.includes('/* SECS END */'));
const c = src.findIndex(l => l.includes('function tl(start, list)')), d = src.findIndex(l => l.trim().startsWith('const DATA = {'));
const code = src.slice(a, b + 1).join('\n') + '\n' + src.slice(c, d).join('\n') + '\nreturn { SECS, FEST, BETW, TELL, ANSW, ENDT, CLOSE, OPENT };';
const T = new Function(code)();
fs.writeFileSync(new URL('./clocks.json', import.meta.url), JSON.stringify(T, null, 1));
const r = (x) => x.toFixed(1);
console.log('open', r(T.OPENT.end), '| festival', r(T.FEST.end), '| between', r(T.BETW.end), '| tell', r(T.TELL.end), '| answers', r(T.ANSW.end), '| close', r(T.CLOSE.end));
for (const k of 'ABCD') console.log('ending', k, 'to its close', r(T.ENDT[k].close), '| whole', r(T.ENDT[k].close + T.CLOSE.end));
