/* v26.0 · the hall's sign: a white wavy plank with gold Thai lettering, as photographs 13, 15 and 16 show it hung
   between two posts. ITS WORDS ARE NOT THE REAL PLACE'S NAME (v9.3: no real organisation's name on a prop): the plank
   reads "สวนปฏิบัติธรรม", "a garden for practising the Dhamma", which is the kind of place it is and names nobody.
   (Put to Chad: the words are his to change.) Drawn by a browser so the Thai is shaped properly (a tone mark sits
   where it belongs), in Norasi, a Thai serif that ships with the machine (TLWG, GPL with the font exception: the
   picture it draws carries no licence of its own). Writes assets/w3t_sign.webp with its own alpha.
     CHROMIUM_PATH=/opt/pw-browsers/chromium node masters/v26.0/hall/sign.mjs */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { LAUNCH } from '../../../testlib.mjs';
const W = 2048, H = 366;   // the plank is 2.4 m by 0.43 m (measured on photograph 15 against the doors)
const html = `<!doctype html><html><body style="margin:0;background:transparent">
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
 <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f3ea"/><stop offset="1" stop-color="#e6e1d2"/></linearGradient></defs>
 <path d="M 18 83 C 280 24, 520 99, 780 54 S 1290 35, 1560 70 S 1890 29, 2030 78 L 2022 287 C 1800 338, 1490 273, 1240 316 S 700 338, 420 300 S 150 327, 26 284 Z" fill="url(#g)" stroke="#cfc8b6" stroke-width="4"/>
 <text x="${W / 2}" y="238" text-anchor="middle" font-family="Norasi" font-weight="700" font-size="170" letter-spacing="8" fill="#c9a034" stroke="#7d5f18" stroke-width="2.5" paint-order="stroke">สวนปฏิบัติธรรม</text>
 <g fill="#9aa0a4" stroke="#6d7276" stroke-width="2"><circle cx="70" cy="129" r="10"/><circle cx="70" cy="236" r="10"/><circle cx="1978" cy="123" r="10"/><circle cx="1978" cy="231" r="10"/></g>
</svg></body></html>`;
const b = await chromium.launch(LAUNCH), p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await p.setContent(html); await p.evaluate(() => document.fonts.ready);
const fonts = await p.evaluate(() => document.fonts.check('700 126px Norasi'));
const png = await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
await b.close();
await sharp(png).webp({ quality: 92, alphaQuality: 100 }).toFile('assets/w3t_sign.webp');
console.log('w3t_sign.webp', W + 'x' + H, 'Norasi there:', fonts);
