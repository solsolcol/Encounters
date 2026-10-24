/* v22.0: THE UNDEFINED-NAME SCAN — every identifier a chapter READS that no enclosing scope declares and no browser
   global provides. A name like that is a ReferenceError only on the frame the line runs, so it hides in a path nothing
   walks until it does: e3c4's opening film read an `ESC_V` that was never declared, and threw 24 s into the film, on
   the first frame of its escalator ride. tdzscan cannot see it (the name is not declared at all) and chaptertest never
   runs a film. Scopes are modelled properly (function, block, catch, for-let, class, params, var and function hoisting);
   property keys and member names are not references. Prints each undeclared name with the lines it is read on and exits
   1 if any. Needs acorn (in node_modules; else: npm i --no-save acorn@8.14.0 acorn-walk@8.3.4).
   Usage: node tools/probes/undefscan.mjs <file.js> [more.js ...]                                                  */
import fs from 'node:fs';
let acorn;
try { acorn = await import('acorn'); } catch { console.log('needs acorn: npm i --no-save acorn@8.14.0'); process.exit(2); }
const GLOBALS = new Set(`window document Math JSON Object Array Number String Boolean Symbol Map Set WeakMap WeakSet Promise
  Date RegExp Error TypeError RangeError Float32Array Float64Array Uint8Array Uint8ClampedArray Uint16Array Uint32Array
  Int8Array Int16Array Int32Array ArrayBuffer DataView Infinity NaN undefined isFinite isNaN parseFloat parseInt console
  performance requestAnimationFrame cancelAnimationFrame setTimeout clearTimeout setInterval clearInterval navigator
  location localStorage sessionStorage Image Blob URL fetch createImageBitmap OffscreenCanvas HTMLCanvasElement atob btoa
  TextDecoder TextEncoder AudioContext OfflineAudioContext globalThis arguments structuredClone queueMicrotask BigInt
  Proxy Reflect encodeURIComponent decodeURIComponent alert getComputedStyle matchMedia devicePixelRatio screen
  innerWidth innerHeight ResizeObserver MutationObserver IntersectionObserver Event CustomEvent KeyboardEvent
  PointerEvent ImageData Path2D DOMParser WebGL2RenderingContext WebGLRenderingContext Worker WebAssembly Intl
  AbortController FontFace self history`.split(/\s+/).filter(Boolean));
let bad = 0;
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: 'script', locations: true, allowHashBang: true });
  const miss = new Map();                                   // name -> [lines]
  const names = (p, out) => {
    if (!p) return out;
    if (p.type === 'Identifier') out.push(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => names(q.type === 'RestElement' ? q.argument : q.value, out));
    else if (p.type === 'ArrayPattern') p.elements.forEach(q => names(q, out));
    else if (p.type === 'AssignmentPattern') names(p.left, out);
    else if (p.type === 'RestElement') names(p.argument, out);
    return out;
  };
  // hoisting: every `var` and function declaration in a function body (not inside nested functions) belongs to it
  function hoist(body, scope) {
    const visit = (n, top) => {
      if (!n || typeof n.type !== 'string') return;
      if (n.type === 'FunctionDeclaration') { if (top) scope.add(n.id.name); return; }
      if (/Function|Arrow|Class/.test(n.type)) return;
      if (n.type === 'VariableDeclaration' && n.kind === 'var') n.declarations.forEach(d => names(d.id, []).forEach(x => scope.add(x)));
      for (const k in n) { if (k === 'type' || k === 'loc') continue; const v = n[k];
        if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && visit(c, false)); else if (v && typeof v.type === 'string') visit(v, false); }
    };
    for (const st of body) { if (st.type === 'FunctionDeclaration') scope.add(st.id.name); else visit(st, true); }
  }
  // a block's own let/const/class/function declarations (functions in blocks are block-scoped in strict mode; counting
  // them in both places is harmless for this scan)
  function blockDecls(stmts, scope) {
    for (const st of stmts) {
      if (st.type === 'VariableDeclaration' && st.kind !== 'var') st.declarations.forEach(d => names(d.id, []).forEach(x => scope.add(x)));
      if (st.type === 'ClassDeclaration' && st.id) scope.add(st.id.name);
      if (st.type === 'FunctionDeclaration') scope.add(st.id.name);
    }
  }
  const has = (chain, nm) => chain.some(s => s.has(nm));
  function walk(n, chain, parent, key) {
    if (!n || typeof n.type !== 'string') return;
    switch (n.type) {
      case 'Identifier': {
        if (!has(chain, n.name) && !GLOBALS.has(n.name)) { if (!miss.has(n.name)) miss.set(n.name, []); miss.get(n.name).push(n.loc.start.line); }
        return;
      }
      case 'MemberExpression': walk(n.object, chain, n, 'object'); if (n.computed) walk(n.property, chain, n, 'property'); return;
      case 'Property': if (n.computed) walk(n.key, chain, n, 'key'); walk(n.value, chain, n, 'value'); return;
      case 'PropertyDefinition': case 'MethodDefinition': if (n.computed) walk(n.key, chain, n, 'key'); walk(n.value, chain, n, 'value'); return;
      case 'LabeledStatement': walk(n.body, chain, n, 'body'); return;
      case 'BreakStatement': case 'ContinueStatement': return;
      case 'FunctionDeclaration': case 'FunctionExpression': case 'ArrowFunctionExpression': {
        const sc = new Set(); if (n.type === 'FunctionExpression' && n.id) sc.add(n.id.name);
        n.params.forEach(p => names(p, []).forEach(x => sc.add(x)));
        const c2 = [...chain, sc];
        n.params.forEach(p => walkPatternDefaults(p, c2));
        if (n.body.type === 'BlockStatement') { hoist(n.body.body, sc); blockDecls(n.body.body, sc); n.body.body.forEach(st => walk(st, c2, n.body, 'body')); }
        else walk(n.body, c2, n, 'body');
        return;
      }
      case 'ClassDeclaration': case 'ClassExpression': { const sc = new Set(); if (n.id) sc.add(n.id.name); if (n.superClass) walk(n.superClass, chain, n, 'superClass'); walk(n.body, [...chain, sc], n, 'body'); return; }
      case 'BlockStatement': case 'StaticBlock': { const sc = new Set(); blockDecls(n.body, sc); const c2 = [...chain, sc]; n.body.forEach(st => walk(st, c2, n, 'body')); return; }
      case 'Program': { const sc = new Set(); hoist(n.body, sc); blockDecls(n.body, sc); const c2 = [...chain, sc]; n.body.forEach(st => walk(st, c2, n, 'body')); return; }
      case 'ForStatement': case 'ForInStatement': case 'ForOfStatement': {
        const sc = new Set(), init = n.init || n.left;
        if (init && init.type === 'VariableDeclaration' && init.kind !== 'var') init.declarations.forEach(d => names(d.id, []).forEach(x => sc.add(x)));
        const c2 = [...chain, sc];
        for (const k of ['init', 'left', 'test', 'update', 'right', 'body']) if (n[k]) walk(n[k], c2, n, k);
        return;
      }
      case 'CatchClause': { const sc = new Set(); if (n.param) names(n.param, []).forEach(x => sc.add(x)); walk(n.body, [...chain, sc], n, 'body'); return; }
      case 'SwitchStatement': { walk(n.discriminant, chain, n, 'discriminant'); const sc = new Set(); n.cases.forEach(cs => blockDecls(cs.consequent, sc));
        const c2 = [...chain, sc]; n.cases.forEach(cs => { if (cs.test) walk(cs.test, c2, cs, 'test'); cs.consequent.forEach(st => walk(st, c2, cs, 'consequent')); }); return; }
      case 'VariableDeclarator': walkPatternDefaults(n.id, chain); if (n.init) walk(n.init, chain, n, 'init'); return;
      // a plain `x = …` to an undeclared name is a sloppy-mode global, not a throw (e2c3's `S`): only a READ throws
      case 'AssignmentExpression': if (n.operator === '=' && n.left.type === 'Identifier') { walk(n.right, chain, n, 'right'); return; } break;
    }
    for (const k in n) {
      if (k === 'type' || k === 'loc' || k === 'start' || k === 'end') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, chain, n, k));
      else if (v && typeof v.type === 'string') walk(v, chain, n, k);
    }
  }
  // a pattern's default values and computed keys are expressions; its bound names are not references
  function walkPatternDefaults(p, chain) {
    if (!p) return;
    if (p.type === 'AssignmentPattern') { walk(p.right, chain, p, 'right'); walkPatternDefaults(p.left, chain); }
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => { if (q.type === 'RestElement') walkPatternDefaults(q.argument, chain); else { if (q.computed) walk(q.key, chain, q, 'key'); walkPatternDefaults(q.value, chain); } });
    else if (p.type === 'ArrayPattern') p.elements.forEach(q => walkPatternDefaults(q, chain));
    else if (p.type === 'RestElement') walkPatternDefaults(p.argument, chain);
    else if (p.type === 'MemberExpression') walk(p, chain, null, null);
  }
  walk(ast, [], null, null);
  if (!miss.size) console.log(file + ': no undeclared names');
  else { bad++; for (const [nm, ls] of miss) console.log(file + ': ' + nm + ' — line ' + [...new Set(ls)].slice(0, 8).join(', ')); }
}
process.exit(bad ? 1 : 0);
