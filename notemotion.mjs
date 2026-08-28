import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const p = await b.newPage({viewport:{width:900,height:600}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{
  const e = window.__enc, N = e.flying.count, dt = 1/60;
  const grab = () => { const a = e.flying.instanceMatrix.array, out = [];
    for (let i=0;i<N;i++) out.push([a[i*16+12], a[i*16+13], a[i*16+14]]); return out; };
  e.updateNotes(dt, 0);
  const t0 = grab();
  for (let i=1;i<=120;i++) e.updateNotes(dt, i*dt);   // two seconds
  const t1 = grab();
  let moved=0, rose=0, maxD=0, recycled=0;
  for (let i=0;i<N;i++){
    const d = Math.hypot(t1[i][0]-t0[i][0], t1[i][1]-t0[i][1], t1[i][2]-t0[i][2]);
    if (d > 0.02) moved++;
    if (t1[i][1] > t0[i][1]) rose++;
    if (t1[i][1] < t0[i][1] - 1) recycled++;          // wrapped back to the ground
    maxD = Math.max(maxD, d);
  }
  const ys = t1.map(v=>v[1]);
  const rs = t1.map(v=>Math.hypot(v[0]+2.4, v[2]+0.6));
  return { count:N, movedIn2s:moved, rising:rose, recycled,
           furthestTravel:+maxD.toFixed(2),
           heightRange:[+Math.min(...ys).toFixed(2), +Math.max(...ys).toFixed(2)],
           radiusRange:[+Math.min(...rs).toFixed(1), +Math.max(...rs).toFixed(1)] };
}));
await b.close();
