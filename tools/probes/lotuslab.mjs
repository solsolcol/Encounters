/* v26.15 · the lotus lab's pictures (tools/probes/lotuslab.py writes the page): the 512 canvas at each moment of the fold
   and the bud, u in seconds from the ending's `shut`, written as <dir>/<tag>-<u>.png, and each moment's five numbers
   printed. Read each picture at its own size (crop the bud: the game shows the canvas 1.4 times on a phone and 2.5 times
   on a 2560 x 1440 desktop). CHROMIUM_PATH=... node tools/probes/lotuslab.mjs <page.html> <dir> [tag] */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const [page, dir, tag = 'lotus'] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const p = await (await b.newContext({ viewport: { width: 512, height: 512 } })).newPage();
await p.goto('file://' + path.resolve(page));
/* (v26.18: US=from,to,step for another stretch of the timeline: the slower close of 17 Nov runs 0.8 to 6.0) */
const [u0, u1, du] = (process.env.US || '1.2,2.951,0.025').split(',').map(Number);
const us = []; for (let u = u0; u <= u1 + 1e-9; u += du) us.push(+u.toFixed(3));
for (const u of us) { const v = await p.evaluate((u) => window.at(u), u); await p.screenshot({ path: `${dir}/${tag}-${u.toFixed(3)}.png` }); console.log(u.toFixed(3), v.map((q) => q.toFixed(3)).join(' ')); }
await b.close();
