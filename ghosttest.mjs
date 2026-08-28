import { chromium } from 'playwright';
const errs=[];
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const p = await b.newPage({viewport:{width:1280,height:760}});
p.on('pageerror',e=>errs.push('ERR '+e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(5000);
await p.click('#startBtn'); await p.waitForTimeout(600);
await p.evaluate(()=>['prompt','hud','hint','decide'].forEach(i=>document.getElementById(i).classList.add('hide')));

// step the ghost logic on a fixed clock so the slow headless renderer is irrelevant
console.log(JSON.stringify(await p.evaluate(()=>{
  const e=window.__enc, dt=1/60, log=[];
  const place=(x,z,ry)=>{ e.yaw.position.set(x,1.62,z); e.yaw.rotation.y=ry;
    e.yaw.updateMatrixWorld(true); };
  const dist=()=>Math.hypot(e.yaw.position.x-e.ghost.position.x, e.yaw.position.z-e.ghost.position.z);

  // 1. far away, looking at her: should stay dark and still
  place(-2.4, 8, 0); for(let i=0;i<60;i++) e.updateGhost(dt);
  log.push({at:'far, watching', reveal:+e.getReveal().toFixed(3), inView:e.ghostInView(), dist:+dist().toFixed(2)});

  // 2. close, looking at her: revealed, and frozen
  place(-2.4, 2.0, 0); for(let i=0;i<180;i++) e.updateGhost(dt);
  const zWatched = e.ghost.position.z;
  for(let i=0;i<180;i++) e.updateGhost(dt);
  log.push({at:'close, watching', reveal:+e.getReveal().toFixed(3), inView:e.ghostInView(),
            movedWhileWatched:+(e.ghost.position.z-zWatched).toFixed(4), dist:+dist().toFixed(2)});

  // 3. same spot, but turned away: she should advance
  place(-2.4, 2.0, Math.PI); e.yaw.updateMatrixWorld(true);
  const zBefore = e.ghost.position.z, dBefore = dist();
  for(let i=0;i<180;i++) e.updateGhost(dt);
  log.push({at:'close, looking away', inView:e.ghostInView(),
            movedWhileAway:+(e.ghost.position.z-zBefore).toFixed(3),
            closedDistance:+(dBefore-dist()).toFixed(2), dist:+dist().toFixed(2)});

  // 4. keep looking away — she must stop at the minimum distance
  for(let i=0;i<600;i++) e.updateGhost(dt);
  log.push({at:'looking away, 10s more', finalDist:+dist().toFixed(2)});
  return log;
}), null, 1));
console.log('errors:', errs.length?errs:'none');
await b.close();
