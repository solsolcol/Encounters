import http from 'http';
import fs from 'fs';
import { chromium } from 'playwright';

const html = fs.readFileSync('/tmp/g/wrapped.html');
// Serve the page under a CSP in the spirit of a sandboxed artifact frame:
// inline script allowed, but no blob: or data: image sources.
const srv = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src https://fonts.gstatic.com; img-src 'self'; connect-src 'self'"
  });
  res.end(html);
});
await new Promise(r => srv.listen(8099, r));

const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
for (const [label, url] of [['no CSP (file://)','file:///tmp/g/wrapped.html'],
                            ['strict CSP','http://localhost:8099/']]) {
  const p = await b.newPage({viewport:{width:600,height:400}});
  const blocked=[];
  p.on('console', m => { const t=m.text(); if(/Content Security|Refused/i.test(t)) blocked.push(t.slice(0,90)); });
  // the page is 4.5 MB and two of these run at once on a two-core box;
  // the default 30 s navigation timeout is not enough for that
  p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
  await p.goto(url); await p.waitForTimeout(7000);
  const r = await p.evaluate(()=>{
    const out = {hdb:null, ghost:null, logo:null};
    const scan = (root) => { let withImg=0, total=0;
      root.traverse(o=>{ if(!o.isMesh) return;
        const ms=Array.isArray(o.material)?o.material:[o.material];
        for(const m of ms){ if(!m.map) continue; total++;
          if(m.map.image && (m.map.image.width>0)) withImg++; } });
      return total ? `${withImg}/${total} textures have pixels` : 'no textured materials'; };
    const world = window.__enc.yaw.parent.children.find(o=>o.isGroup);
    let blk=null; world.traverse(o=>{ if(!blk && o.name && o.name.includes('TTH')) blk=o; });
    out.hdb = blk ? scan(blk.parent) : 'block not found';
    out.ghost = scan(window.__enc.ghost);
    // the title logo goes through the same no-URL path as the model textures,
    // so it has to survive the same policy
    const cv = document.getElementById('logo');
    if (!cv) out.logo = 'canvas gone — it fell back to the heading';
    else {
      const d = cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
      let lit = 0;
      for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 8) lit++;
      out.logo = lit > 500 ? `painted (${lit} lit samples)` : `BLANK (${lit} lit samples)`;
    }
    return out;
  });
  console.log(label.padEnd(22), '| HDB:', r.hdb, '| ghost:', r.ghost, '| logo:', r.logo);
  if (blocked.length) console.log('   CSP violations:', blocked.slice(0,3));
  await p.close();
}
await b.close(); srv.close();
