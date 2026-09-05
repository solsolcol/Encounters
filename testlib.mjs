/* One browser-launch recipe for every harness, portable across machines.

   Where the browser comes from, in order:
   - CHROMIUM_PATH env var, if set — point it at any Chrome/Chromium build
   - the cloud container's preinstalled browser, when that path exists
   - otherwise Playwright resolves its own (run `npx playwright install chromium` once)

   The SwiftShader flags force software rendering, which keeps results
   identical on machines with no GPU (the cloud container). On a real
   computer, set REAL_GPU=1 to use the machine's own GPU — the suite runs
   many times faster and the game code is identical either way.            */
import { existsSync } from 'node:fs';

const CLOUD = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

export const LAUNCH = {
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH }
      : existsSync(CLOUD) ? { executablePath: CLOUD } : {}),
  args: [
    ...(process.env.REAL_GPU ? [] :
      ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']),
    '--no-sandbox',
  ],
};

/* The repo's own locations, derived from this file — never hard-coded, so
   the suite runs identically wherever the repo is checked out.            */
import { fileURLToPath } from 'node:url';
export const DIR = fileURLToPath(new URL('.', import.meta.url));

/* PAGE is the HOSTED build — dist/ over a local server, exactly the shape
   Netlify serves and players load. Until v3.4 the suite drove the embedded
   wrapped.html, a leftover of the retired claude.ai preview: sixteen
   harnesses covered a build nobody runs while the shipping one had a
   single test. Serving dist/ flips that with no harness changes — they
   import PAGE and nothing else.

   Mechanics that matter:
   - unref(): the server never keeps a finished harness process alive.
   - /favicon.ico answered: file:// pages are never asked for one, http
     pages are, and the 404 would trip harnesses that treat any console
     error as a failure (found in the migration spike).
   - Each harness process gets its own server on an ephemeral port, so
     the runner's two-at-a-time concurrency cannot collide.
   - csptest does not use PAGE at all: it serves wrapped.html from its
     own server on both legs (with and without the strict no-blob/no-data
     CSP) so its A/B differs only by policy. That guard outlives the
     preview and must keep testing the inlined loaders.
   - listen() errors are surfaced, not left to hang: DIR-only importers
     (runtests, textsync) bind this socket too, and an unhandled 'error'
     would kill them with a stack instead of a sentence.                 */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
const _ROOT = join(DIR, 'dist');
const _MIME = { '.html': 'text/html', '.js': 'text/javascript',
                '.glb': 'model/gltf-binary', '.webp': 'image/webp',
                '.mp3': 'audio/mpeg', '.json': 'application/json',
                '.mp4': 'video/mp4' };
const _srv = createServer((req, res) => {
  try {
    const path = normalize(decodeURIComponent(req.url.split('?')[0]));
    if (path === '/favicon.ico') { res.writeHead(200, { 'content-type': 'image/x-icon' }); return res.end(); }
    const file = path === '/' || path === '\\' ? 'index.html' : path;
    const body = readFileSync(join(_ROOT, file));
    const type = _MIME[extname(file)] || 'application/octet-stream';
    /* Range support, for one reason: <video>. Chromium's media stack asks
       for a byte range and a server that answers 200-with-everything makes
       it re-fetch and stall. Netlify serves ranges, so the harness has to
       as well or the title video only misbehaves under test.            */
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && body.length) {
      const start = range[1] ? parseInt(range[1], 10) : 0;
      const end = range[2] ? Math.min(parseInt(range[2], 10), body.length - 1) : body.length - 1;
      if (start <= end && start < body.length) {
        res.writeHead(206, {
          'content-type': type,
          'accept-ranges': 'bytes',
          'content-range': `bytes ${start}-${end}/${body.length}`,
          'content-length': end - start + 1
        });
        return res.end(body.subarray(start, end + 1));
      }
    }
    res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
_srv.on('error', e => {
  console.error('testlib: could not serve dist/ on localhost —', e.message);
  process.exit(1);
});
_srv.listen(0, '127.0.0.1');
_srv.unref();
await new Promise((res, rej) => {
  _srv.once('listening', res);
  _srv.once('error', rej);
});
export const PAGE = `http://127.0.0.1:${_srv.address().port}/`;

/* v6.4: PRESSING START RUNS A FILM NOW. Chapter 1 opens on the prologue, so
   a new game is film, card, play — and at one software frame a second a
   fifty-nine-second film is two minutes of real time. A harness that tests
   PLAY does what a player who has seen it does: taps through it.

   Waits for whichever comes first, the film or play (a chapter with no film,
   and a resume with a position, go straight to the card), skips the film if
   that is what arrived, and returns once the world is playable. Every
   harness that presses Start goes through here, so the next chapter to gain
   an opening costs the suite nothing. The harnesses that test a FILM
   (cinetest's film pages, menutest's replay, hostedtest's advance) wait for
   'cine' themselves and never call this.                                 */
export async function toPlay(p, timeout = 150000) {
  await p.waitForFunction(() => window.__enc && ['cine', 'play'].includes(window.__enc.getState()),
                          null, { timeout, polling: 120 });
  if (await p.evaluate(() => window.__enc.getState() === 'cine'))
    await p.evaluate(() => window.__enc.cine.skip());
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout, polling: 120 });
}
