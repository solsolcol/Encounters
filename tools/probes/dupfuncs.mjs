/* v24.22 · TWO FUNCTIONS OF ONE NAME IN ONE SCOPE. A function declaration is hoisted, and of two with one name in the
   same block the LATER silently replaces the earlier everywhere in that block — no error, no warning. v24.22's shop
   added `makeYantCloth(THREE, cnv, bg, ink, k)` beside the master's room's own `makeYantCloth(THREE, cnv, kind)`, and
   the room's two pha yant cloths were drawn by the shop's function with a design name for a colour (found by reading
   the code, live for an hour). `npm run build` runs this over every chapter and the engine and fails on any.
     node tools/probes/dupfuncs.mjs <file.js> ... */
import fs from 'node:fs';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
let bad = 0;
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, 'utf8');
  let ast;
  try { ast = acorn.parse(src, { ecmaVersion: 'latest', locations: true, sourceType: 'script' }); }
  catch { ast = acorn.parse(src, { ecmaVersion: 'latest', locations: true, sourceType: 'module' }); }
  const scan = (body) => {
    const seen = new Map();
    for (const st of body) {
      if (st.type !== 'FunctionDeclaration') continue;
      const n = st.id.name;
      if (seen.has(n)) { bad++; console.log(`${f}: function ${n} is declared twice in one scope (lines ${seen.get(n)} and ${st.loc.start.line}) — the later replaces the earlier`); }
      else seen.set(n, st.loc.start.line);
    }
  };
  walk.full(ast, (node) => { if (node.type === 'BlockStatement' || node.type === 'Program') scan(node.body); });
}
if (bad) { console.log(`dupfuncs: ${bad} duplicate declaration(s)`); process.exit(1); }
