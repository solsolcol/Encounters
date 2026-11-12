/* v26.0: WHAT IS THAT OBJECT? tools/probes/e4c3replay.mjs names every object of the scene by its place in the graph
   ("scene/Group#1/Group#28"): exact, and unreadable. This boots the chapter the same way and says what each path IS: its
   own name and its ancestors', where it stands in the world, what it draws (the first mesh's points, its picture's
   size and name), whether it is shown, and the handle of the chapter's own that reaches it (stage.dbg, searched four
   deep by identity; an object's nearest named ancestor answers when it has none itself).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... node tools/probes/e4c3who.mjs 'scene/Group#1/Group#28' 'scene/...' ...
     (or PATHS=<file>, a path a line) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const paths = process.env.PATHS ? fs.readFileSync(process.env.PATHS, 'utf8').split('\n').map(s => s.trim()).filter(Boolean) : process.argv.slice(2);
if (!paths.length) { console.error('usage: node tools/probes/e4c3who.mjs <path> ... | PATHS=<file>'); process.exit(2); }
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })).newPage();
p.setDefaultTimeout(600000); p.setDefaultNavigationTimeout(600000);
await p.goto(PAGE + '?ch=' + (process.env.CH || 'e4c3'));
await p.waitForFunction(() => !!window.__enc);
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return i.applied && !i.waiting.length && window.__enc.stage.dayClock.t > 1; } catch { return false; } }, null, { polling: 500 }).catch(() => {});
const out = await p.evaluate((paths) => {
  const E = window.__enc, r2 = (v) => Math.round(v * 100) / 100, V = new E.scene.position.constructor();
  /* the chapter's handles, by identity */
  const handle = new Map(), seen = new Set();
  const scan = (v, name, depth) => { if (!v || typeof v !== 'object' || seen.has(v) || depth > 4) return; seen.add(v);
    if (v.isObject3D) { if (!handle.has(v)) handle.set(v, name); return; }
    if (v instanceof Map) { for (const [k, x] of v) scan(x, name + '<' + String(k).slice(0, 12) + '>', depth + 1); return; }
    if (ArrayBuffer.isView(v)) return;
    if (Array.isArray(v)) { v.slice(0, 400).forEach((x, i) => scan(x, name + '[' + i + ']', depth + 1)); return; }
    for (const k in v) { try { scan(v[k], name + '.' + k, depth + 1); } catch {} } };
  try { scan(E.stage.dbg, 'dbg', 0); } catch {}
  const find = (path) => { const parts = path.split('/'); let o = E.scene;
    for (const part of parts.slice(1)) { const m = part.match(/^(.*)#(\d+)$/); if (!m) return null; let n = 0, hit = null;
      for (const c of o.children) { const nm = (c.name || c.type) + (c.isInstancedMesh ? '[' + c.count + ']' : ''); if (nm === m[1] && ++n === +m[2]) { hit = c; break; } }
      if (!hit) return null; o = hit; }
    return o; };
  return paths.map((path) => { const o = find(path); if (!o) return path + '\n     NOT FOUND';
    o.updateWorldMatrix(true, false); o.getWorldPosition(V);
    let mesh = null; o.traverse(c => { if (!mesh && (c.isMesh || c.isSprite) && c.material) mesh = c; });
    const m = mesh && [].concat(mesh.material)[0], img = m && m.map && m.map.image;
    let h = null, up = 0; for (let q = o; q; q = q.parent, up++) if (handle.has(q)) { h = handle.get(q) + (up ? ' (' + up + ' above)' : ''); break; }
    let shown = true; for (let q = o; q; q = q.parent) if (!q.visible) { shown = false; break; }
    const names = []; for (let q = o; q; q = q.parent) if (q.name) names.push(q.name);
    let nMesh = 0, tris = 0; o.traverse(c => { if (c.isMesh && c.geometry) { nMesh++; const g = c.geometry; tris += (g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0)) / 3 * (c.isInstancedMesh ? c.count : 1); } });
    return `${path}\n     ${h || 'no handle'} | ${o.type}${o.name ? ' "' + o.name + '"' : ''}${names.length > 1 ? ' under ' + names.slice(1, 4).join(' < ') : ''} | at ${r2(V.x)},${r2(V.y)},${r2(V.z)} | ${shown ? 'shown' : 'hidden'} | ${o.children.length} children, ${nMesh} meshes, ${Math.round(tris)} triangles` +
      (mesh ? ` | first: ${mesh.type}${mesh.name ? ' "' + mesh.name + '"' : ''} ${m ? m.type : ''}${m && m.name ? ' "' + m.name + '"' : ''}${img ? ' picture ' + (img.width || '?') + 'x' + (img.height || '?') : ''}${m && m.color ? ' #' + m.color.getHexString() : ''}` : '') +
      (o.userData && Object.keys(o.userData).length ? ` | userData: ${Object.keys(o.userData).slice(0, 8).join(',')}` : ''); });
}, paths);
console.log(out.join('\n'));
await b.close();
