/* v21.1: THE DEAD-ZONE SCAN — a build-level let/const read (directly, or
   through the build-level functions a statement calls, transitively) by a
   statement that runs BEFORE its declaration. A chapter's build() is one long
   function and its builders are hoisted, so a `let` declared below the first
   caller is a ReferenceError at boot: the chapter never builds and the game
   never starts in it — and chaptertest, which never builds a chapter, cannot
   see it. It shipped once (v21.1's first deploy of e3c3, 35 minutes); this is
   the scan that found the second one without another five-minute boot.
   Nested callbacks count only when passed to something that runs them at once
   (forEach/map/filter/some/every/find/reduce/sort/flatMap/traverse); .then,
   after(), handlers and object methods are treated as later. A name declared
   inside a function or a block is that scope's own (shadowing, the simple
   way: such a name is never counted as build's from in there). Every chapter
   scans clean at v21.1; the e3c3 that shipped broken reports its 5 reads.
   Needs acorn, which the repo does not carry:
     npm i --no-save acorn@8.14.0 acorn-walk@8.3.4
   Usage: node tools/probes/tdzscan.mjs <chapter.js> [functionName=build]   */
import fs from 'node:fs';
let acorn, walk;
try { acorn = await import('acorn'); walk = await import('acorn-walk'); }
catch { console.log('needs acorn: npm i --no-save acorn@8.14.0 acorn-walk@8.3.4'); process.exit(2); }
const file = process.argv[2], fnName = process.argv[3] || 'build';
const src = fs.readFileSync(file, 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: 'script', locations: true, allowHashBang: true });
let build = null;
walk.full(ast, n => { if (!build && n.type === 'FunctionDeclaration' && n.id && n.id.name === fnName) build = n; });
if (!build) { console.log('no', fnName); process.exit(1); }
const body = build.body.body;
const decl = new Map();          // name -> start offset (let/const at depth 1)
const fns = new Map();           // name -> function node (depth-1 declarations and const f = () => {})
for (const st of body) {
  if (st.type === 'VariableDeclaration' && st.kind !== 'var') for (const d of st.declarations) {
    const names = []; collectPattern(d.id, names);
    for (const nm of names) decl.set(nm, st.start);
    if (d.id.type === 'Identifier' && d.init && /Function|Arrow/.test(d.init.type)) fns.set(d.id.name, d.init);
  }
  if (st.type === 'FunctionDeclaration') fns.set(st.id.name, st);
}
function collectPattern(p, out) {
  if (!p) return;
  if (p.type === 'Identifier') { if (out.add) out.add(p.name); else out.push(p.name); }
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => collectPattern(q.value || q.argument, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(q => collectPattern(q, out));
  else if (p.type === 'AssignmentPattern') collectPattern(p.left, out);
  else if (p.type === 'RestElement') collectPattern(p.argument, out);
}
const IMMEDIATE = new Set(['forEach', 'map', 'filter', 'some', 'every', 'find', 'findIndex', 'reduce', 'sort', 'flatMap', 'traverse']);
// identifiers read by a node, skipping nested functions unless they are passed to an immediate array method
function refs(node, out = new Set(), calls = new Set()) {
  const visit = (n, parent, key) => {
    if (!n || typeof n.type !== 'string') return;
    if (/Function|Arrow/.test(n.type) && parent) {
      const isImm = parent.type === 'CallExpression' && key === 'arguments' && parent.callee.type === 'MemberExpression'
        && !parent.callee.computed && IMMEDIATE.has(parent.callee.property.name);
      if (!isImm) return;
      visit(n.body, n, 'body'); return;
    }
    if (n.type === 'Identifier') { out.add(n.name); return; }
    if (n.type === 'MemberExpression') { visit(n.object, n, 'object'); if (n.computed) visit(n.property, n, 'property'); return; }
    if (n.type === 'Property') { if (n.computed) visit(n.key, n, 'key'); visit(n.value, n, 'value'); return; }
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier') calls.add(n.callee.name);
    for (const k of Object.keys(n)) {
      if (k === 'loc' || k === 'start' || k === 'end' || k === 'type') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && visit(c, n, k));
      else if (v && typeof v.type === 'string') visit(v, n, k);
    }
  };
  visit(node, null, null);
  return { out, calls };
}
// every name DECLARED anywhere inside a node (params, let/const/var, functions, catch): a read of one of these
// is the local's, not build's (shadowing — a block's own `const W`, a builder's own `pile`)
function locals(node) {
  const out = new Set();
  walk.full(node, n => {
    if (n.type === 'VariableDeclarator') collectPattern(n.id, out);
    else if ((n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression') && n.id) out.add(n.id.name);
    if (/Function|Arrow/.test(n.type)) for (const q of n.params) collectPattern(q, out);
    if (n.type === 'CatchClause' && n.param) collectPattern(n.param, out);
  });
  return out;
}
const asSet = (arr) => { const s = new Set(); arr.forEach(x => s.add(x)); return s; };
// a function's transitive reads (its own body, the build-level functions it calls)
const memo = new Map();
function fnRefs(name, stack = new Set()) {
  if (memo.has(name)) return memo.get(name);
  if (stack.has(name)) return new Set();
  stack.add(name);
  const f = fns.get(name); const { out, calls } = refs(f.body);
  const own = locals(f);
  const all = new Set([...out].filter(r => !own.has(r)));
  for (const c of calls) if (fns.has(c)) for (const r of fnRefs(c, stack)) all.add(r);
  for (const r of out) if (fns.has(r)) for (const q of fnRefs(r, stack)) all.add(q);   // passed as a value and maybe called
  stack.delete(name); memo.set(name, all);
  return all;
}
const line = (off) => src.slice(0, off).split('\n').length;
let found = 0;
for (const st of body) {
  if (st.type === 'FunctionDeclaration') continue;
  if (st.type === 'VariableDeclaration') {
    // a declaration of a function value runs nothing yet
    if (st.declarations.every(d => d.init && /Function|Arrow/.test(d.init.type))) continue;
  }
  const { out, calls } = refs(st);
  const inner = st.type === 'VariableDeclaration' ? new Set() : locals(st);
  const need = new Set([...out].filter(r => !inner.has(r)));
  for (const c of calls) if (fns.has(c)) for (const r of fnRefs(c)) need.add(r);
  for (const r of need) {
    if (!decl.has(r)) continue;
    const at = decl.get(r);
    if (at > st.start && !(st.type === 'VariableDeclaration' && st.start === at)) {
      found++;
      console.log(`line ${line(st.start)} reads ${r} (declared at line ${line(at)}): ${src.slice(st.start, st.start + 110).replace(/\s+/g, ' ')}`);
    }
  }
}
console.log(found ? `${found} possible dead-zone reads` : 'no dead-zone reads found');
