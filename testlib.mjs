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
   - csptest deliberately does NOT use PAGE for content: it serves
     wrapped.html itself under the strict no-blob/no-data CSP that shaped
     the hand-parsed loaders. That guard outlives the preview.           */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
const _ROOT = join(DIR, 'dist');
const _MIME = { '.html': 'text/html', '.js': 'text/javascript',
                '.glb': 'model/gltf-binary', '.webp': 'image/webp',
                '.mp3': 'audio/mpeg', '.json': 'application/json' };
const _srv = createServer((req, res) => {
  try {
    const path = normalize(decodeURIComponent(req.url.split('?')[0]));
    if (path === '/favicon.ico') { res.writeHead(200, { 'content-type': 'image/x-icon' }); return res.end(); }
    const file = path === '/' || path === '\\' ? 'index.html' : path;
    const body = readFileSync(join(_ROOT, file));
    res.writeHead(200, { 'content-type': _MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
_srv.listen(0, '127.0.0.1');
_srv.unref();
await new Promise(r => _srv.once('listening', r));
export const PAGE = `http://127.0.0.1:${_srv.address().port}/`;
