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
export const PAGE = new URL('./wrapped.html', import.meta.url).href;
