/* v23.1: USE BEFORE DECLARATION, IN ANY FUNCTION — a let/const/class name read
   or written, in the same function, at a point before its declaration has run.
   Every such read is a ReferenceError ("Cannot access 'x' before
   initialization") the moment that path runs, and nothing reports it until it
   does: chaptertest never builds a chapter, a boot probe only reaches the first
   world, and tdzscan (v21.1) looks only at build()'s own top-level names.

   The case that made this scan: v23.1's Hanuman vision in episode 3 chapter 4
   wrote the camera rig's `yaw` at the top of visTick, and forty lines further
   down the same function declared a `const yaw` of its own (the figure's turn)
   — which shadows the rig's for the WHOLE function body, so the write threw on
   every frame and froze the vision with the chapter stuck under it. It booted,
   it built, chaptertest was green, and it shipped.

   Resolution is by real scopes (function, block, for-head, switch, catch): a
   reference resolves to the innermost scope that declares its name, and is
   reported when that declaration is a let/const/class in the SAME function (no
   function boundary between the two — a closure written before a declaration
   is normally called after it) and the reference stands before the end of the
   declaration's initializer. var, function declarations and parameters are
   hoisted and never reported, but they do shadow.
   `npm run build` runs it over every chapter and main.js and stops on a find.
   acorn is a dev dependency since v23.1 (npm install brings it).
   Usage: node tools/probes/usebefore.mjs <file.js> [more files…]
   Exit 0 clean, 1 if anything was found, 2 if acorn is missing.             */
import fs from 'node:fs';
let acorn;
try { acorn = await import('acorn'); }
catch { console.log('needs acorn: npm i --no-save acorn@8.14.0 acorn-walk@8.3.4'); process.exit(2); }

const files = process.argv.slice(2);
if (!files.length) { console.log('usage: node tools/probes/usebefore.mjs <file.js> [more files…]'); process.exit(2); }

function parse(src) {
  const o = { ecmaVersion: 2022, locations: true, allowHashBang: true };
  try { return acorn.parse(src, { ...o, sourceType: 'script' }); }
  catch { return acorn.parse(src, { ...o, sourceType: 'module' }); }
}
function patternNames(p, out) {
  if (!p) return out;
  if (p.type === 'Identifier') out.push(p);
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => patternNames(q.type === 'RestElement' ? q.argument : q.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(q => patternNames(q, out));
  else if (p.type === 'AssignmentPattern') patternNames(p.left, out);
  else if (p.type === 'RestElement') patternNames(p.argument, out);
  return out;
}
const isFn = n => n && (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');

// vars hoisted to a function (or the program), not crossing nested functions
function hoistedVars(body, out) {
  const visit = (n) => {
    if (!n || typeof n.type !== 'string' || isFn(n) || n.type === 'ClassBody') return;
    if (n.type === 'VariableDeclaration' && n.kind === 'var') for (const d of n.declarations) patternNames(d.id, []).forEach(id => out.push(id));
    for (const k of Object.keys(n)) {
      if (k === 'type' || k === 'loc' || k === 'start' || k === 'end') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v.type === 'string') visit(v);
    }
  };
  visit(body);
}
// the lexical declarations made directly in a statement list
function lexicalIn(stmts, scope) {
  for (const st of stmts) {
    if (!st) continue;
    if (st.type === 'VariableDeclaration' && st.kind !== 'var')
      for (const d of st.declarations) for (const id of patternNames(d.id, [])) scope.decl.set(id.name, { kind: st.kind, id, end: d.end });
    if (st.type === 'ClassDeclaration' && st.id) scope.decl.set(st.id.name, { kind: 'class', id: st.id, end: st.end });
    if (st.type === 'FunctionDeclaration' && st.id && !scope.decl.has(st.id.name)) scope.decl.set(st.id.name, { kind: 'function', id: st.id, end: st.start });
  }
}

const found = [];
function scan(file) {
  const src = fs.readFileSync(file, 'utf8');
  const ast = parse(src);
  const stack = [];                                  // scopes, innermost last: { decl: Map, fn: bool }
  const push = (fn) => { const s = { decl: new Map(), fn }; stack.push(s); return s; };
  const declIds = new Set();                         // identifier nodes that ARE declarations

  function resolve(id) {
    let crossed = false;
    for (let i = stack.length - 1; i >= 0; i--) {
      const s = stack[i], b = s.decl.get(id.name);
      if (b) {
        if (crossed) return;                         // a closure: normally runs later
        if ((b.kind === 'let' || b.kind === 'const' || b.kind === 'class') && id !== b.id && id.start < b.end)
          found.push({ file, name: id.name, line: id.loc.start.line, col: id.loc.start.column + 1, declLine: b.id.loc.start.line });
        return;
      }
      if (s.fn) crossed = true;
    }
  }

  function enterFunction(n) {
    const s = push(true);
    for (const p of n.params) for (const id of patternNames(p, [])) { s.decl.set(id.name, { kind: 'param', id, end: 0 }); declIds.add(id); }
    if (n.type === 'FunctionExpression' && n.id) { /* its own name: visible inside, never a TDZ */
      if (!s.decl.has(n.id.name)) s.decl.set(n.id.name, { kind: 'function', id: n.id, end: 0 }); declIds.add(n.id); }
    n.params.forEach(p => visit(p));
    if (n.body.type === 'BlockStatement') {
      const vs = []; hoistedVars(n.body, vs);
      for (const id of vs) if (!s.decl.has(id.name)) s.decl.set(id.name, { kind: 'var', id, end: 0 });
      lexicalIn(n.body.body, s);
      n.body.body.forEach(st => visit(st));
    } else visit(n.body);
    stack.pop();
  }

  function visit(n) {
    if (!n || typeof n.type !== 'string') return;
    switch (n.type) {
      case 'Program': {
        const s = push(true);
        const vs = []; hoistedVars(n, vs);
        for (const id of vs) if (!s.decl.has(id.name)) s.decl.set(id.name, { kind: 'var', id, end: 0 });
        lexicalIn(n.body, s);
        n.body.forEach(visit); stack.pop(); return;
      }
      case 'FunctionDeclaration': declIds.add(n.id); enterFunction(n); return;
      case 'FunctionExpression': case 'ArrowFunctionExpression': enterFunction(n); return;
      case 'BlockStatement': { push(false); lexicalIn(n.body, stack[stack.length - 1]); n.body.forEach(visit); stack.pop(); return; }
      case 'ForStatement': case 'ForInStatement': case 'ForOfStatement': {
        const head = n.type === 'ForStatement' ? n.init : n.left;
        const s = push(false);
        if (head && head.type === 'VariableDeclaration' && head.kind !== 'var')
          for (const d of head.declarations) for (const id of patternNames(d.id, [])) s.decl.set(id.name, { kind: head.kind, id, end: d.end });
        for (const k of ['init', 'test', 'update', 'left', 'right', 'body']) if (n[k]) visit(n[k]);
        stack.pop(); return;
      }
      case 'SwitchStatement': {
        visit(n.discriminant);
        const s = push(false);
        for (const c of n.cases) lexicalIn(c.consequent, s);
        for (const c of n.cases) { if (c.test) visit(c.test); c.consequent.forEach(visit); }
        stack.pop(); return;
      }
      case 'CatchClause': {
        const s = push(false);
        if (n.param) for (const id of patternNames(n.param, [])) { s.decl.set(id.name, { kind: 'param', id, end: 0 }); declIds.add(id); }
        visit(n.body); stack.pop(); return;
      }
      case 'VariableDeclaration':
        for (const d of n.declarations) { for (const id of patternNames(d.id, [])) declIds.add(id); visitPattern(d.id); if (d.init) visit(d.init); }
        return;
      case 'ClassDeclaration': case 'ClassExpression':
        if (n.id) declIds.add(n.id);
        if (n.superClass) visit(n.superClass);
        visit(n.body); return;
      case 'ClassBody': n.body.forEach(visit); return;
      case 'MethodDefinition': case 'PropertyDefinition':
        if (n.computed) visit(n.key);
        if (n.value) visit(n.value); return;
      case 'Property':
        if (n.computed) visit(n.key);
        visit(n.value); return;
      case 'MemberExpression':
        visit(n.object); if (n.computed) visit(n.property); return;
      case 'LabeledStatement': visit(n.body); return;
      case 'BreakStatement': case 'ContinueStatement': return;
      case 'ImportDeclaration': case 'ExportNamedDeclaration': case 'ExportDefaultDeclaration': case 'ExportAllDeclaration':
        if (n.declaration) visit(n.declaration); return;
      case 'MetaProperty': return;
      case 'Identifier':
        if (!declIds.has(n)) resolve(n); return;
    }
    for (const k of Object.keys(n)) {
      if (k === 'type' || k === 'loc' || k === 'start' || k === 'end') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v.type === 'string') visit(v);
    }
  }
  // a declaration's pattern: defaults and computed keys are expressions; the names themselves are not reads
  function visitPattern(p) {
    if (!p) return;
    if (p.type === 'AssignmentPattern') { visitPattern(p.left); visit(p.right); }
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => { if (q.type === 'RestElement') visitPattern(q.argument); else { if (q.computed) visit(q.key); visitPattern(q.value); } });
    else if (p.type === 'ArrayPattern') p.elements.forEach(visitPattern);
    else if (p.type === 'RestElement') visitPattern(p.argument);
  }
  visit(ast);
}

for (const f of files) scan(f);
if (!found.length) { console.log(`no reads before declaration in ${files.length} file${files.length > 1 ? 's' : ''}`); process.exit(0); }
for (const r of found) console.log(`${r.file}:${r.line}:${r.col}  '${r.name}' used before its declaration on line ${r.declLine} (same function)`);
process.exit(1);
