/* The hosted build, served the way Netlify serves it.

   dist/ goes up on a local HTTP server and the page is loaded like a real
   visitor would: index.html, then chapters/ch1.js and game.js as separate
   cached files, then every asset fetched on demand under its fingerprinted
   name. What is asserted is the whole point of the split — that the network
   actually carries separate files, that all of them arrive, and that the
   chapter still plays start to finish on top of them.                      */
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import { LAUNCH, toPlay } from './testlib.mjs';

const ROOT = fileURLToPath(new URL('./dist/', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary',
               '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.css': 'text/css',   // v15.2: the self-hosted fonts
               '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const srv = createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(req.url.split('?')[0]));
    const file = path === '/' ? '/index.html' : path;
    const body = await readFile(join(ROOT, file));
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}`;

const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 500, height: 350 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
const hits = [];  p.on('response', r => hits.push({ url: r.url().replace(base, ''), ok: r.ok() }));
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(90000);

await p.goto(base + '/');
await p.waitForTimeout(6000);
const out = {};

// the network really carried separate, fingerprinted files — and all of them
const want = ['/assets/ch1.', '/assets/game.', '/assets/hands.', '/assets/ghost.',
              '/assets/hdb.', '/assets/logo.', '/assets/music.', '/assets/voice.'];
out.splitFilesFetched = want.every(w => hits.some(h => h.url.startsWith(w) && h.ok));
out.nothingFailed = hits.every(h => h.ok);
// the preload hints must HAND OVER their bytes, not race the engine's own
// fetch — a mismatched preload shows up here as the same URL twice
const dupes = {};
// a blob: URL is not a download (v14.15's two meshopt workers start from one)
for (const h of hits) if (!h.url.startsWith('blob:')) dupes[h.url] = (dupes[h.url] || 0) + 1;
out.noDoubleDownloads = Object.values(dupes).every(n => n === 1);
if (!out.noDoubleDownloads) out.doubled = Object.keys(dupes).filter(u => dupes[u] > 1);
// the doctype is real: quirks mode would say BackCompat
out.standardsMode = await p.evaluate(() => document.compatMode === 'CSS1Compat');

// the title screen is up and the logo canvas holds real pixels
out.titleUp = await p.$eval('#title', e => !e.classList.contains('hide'));
out.logoPainted = await p.evaluate(() => {
  const cv = document.getElementById('logo');
  if (!cv || !cv.width) return false;
  const px = cv.getContext('2d').getImageData(0, 0, cv.width, Math.min(40, cv.height)).data;
  for (let i = 3; i < px.length; i += 4) if (px[i] > 0) return true;
  return false;
});
out.hostedMode = await p.evaluate(() => window.__enc.ready().hosted);
// v15.2: the fonts come from the game's own site — the stylesheet the page
// picked for this browser (headless Chrome on Linux is the WIN/LINUX class),
// its font files, and nothing asked of Google
await p.waitForFunction(() => [...document.fonts].some(f => f.status === 'loaded'), null, { timeout: 60000 }).catch(() => {});
out.fontsSheetHome = hits.some(h => /^\/assets\/fonts\/winlinux\.[0-9a-f]{10}\.css$/.test(h.url) && h.ok);
out.fontFilesHome = hits.some(h => /^\/assets\/fonts\/[\w-]+\.[0-9a-f]{10}\.woff2$/.test(h.url) && h.ok);
out.noGoogleFonts = !hits.some(h => /googleapis|gstatic/.test(h.url));
out.fontsInUse = await p.evaluate(() => [...document.fonts].some(f => f.status === 'loaded' && /Archivo|Inter|Cormorant|JetBrains/.test(f.family)));

// start the chapter: the card gates on the world being ready, then play
await p.click('#startBtn');
await toPlay(p);                 // v6.4: through the film, the card, into play
out.reachedPlay = true;
out.worldReady = await p.evaluate(() => window.__enc.ready());
out.cardText = await p.$eval('#chapTitle', e => e.textContent.includes('Hell Note'));
out.musicDecoded = await p.evaluate(() => window.__enc.audio().decoded);
await p.waitForTimeout(5200);
out.voice = await p.evaluate(() => window.__enc.voice());

// the chapter data came from chapters/ch1.js and still runs the loop
// (v15.2: against the list the file itself declares — the literal 'hdb,ghost,voice'
// went stale when the prologue added its assets, and the check read false since)
const ch1Assets = [...(/assets:\s*\[([^\]]*)\]/.exec(await readFile(new URL('./src/chapters/ch1.js', import.meta.url), 'utf8'))[1])
  .matchAll(/'([a-z0-9_]+)'/g)].map(m => m[1]).join();
out.chapterFromFile = await p.evaluate((want) =>
  window.__enc.chapter.id === 1 && window.__enc.chapter.choices.length === 4
  && window.__enc.chapter.assets.join() === want, ch1Assets);
await p.evaluate(() => { const e = window.__enc;
  e.yaw.position.set(-0.4, 1.62, -3.4);
  e.yaw.rotation.y = Math.atan2(-(e.PILE_POS.x + 0.4), -(e.PILE_POS.z + 3.4));
  e.yaw.updateMatrixWorld(true);
  for (let k = 0; k < 300; k++) e.updateGhost(1 / 60); });
await p.waitForTimeout(1200);
await p.evaluate(() => window.__enc.interactPile());
await p.waitForTimeout(1200);
out.decisionOpens = await p.$eval('#decide', e => !e.classList.contains('hide'));
await p.click('#choices .choice:nth-child(3)');          // observe: shortest scene
await p.waitForFunction(() => window.__enc.getState() === 'cine',
                        null, { timeout: 30000, polling: 100 });
await p.waitForTimeout(1200);
await p.evaluate(() => window.__enc.cine.skip());
await p.waitForTimeout(900);
out.sceneAndCard = await p.$eval('#result', e => !e.classList.contains('hide'));

console.log(JSON.stringify(out, null, 1));
console.log('errors:', errs.length ? errs : 'none');
/* v15.2: the network-level checks FAIL the harness (runtests reads the exit
   code, not a printed false — LEARNINGS v6.3); the timing-bound ones above
   stay informational, as they always were */
const STRICT = ['splitFilesFetched', 'nothingFailed', 'noDoubleDownloads', 'standardsMode', 'hostedMode',
                'fontsSheetHome', 'fontFilesHome', 'noGoogleFonts', 'fontsInUse'];
const failed = STRICT.filter(k => out[k] !== true);
if (failed.length) { console.log('FAILED CHECKS: ' + failed.join(', ')); process.exitCode = 1; }
console.log('requests:', hits.length,
  '| failed:', hits.filter(h => !h.ok).map(h => h.url).join(' ') || 'none');
await b.close();
srv.close();
