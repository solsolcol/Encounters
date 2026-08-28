import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const errs=[];
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({viewport:{width:1000,height:560}});
p.on('pageerror',e=>errs.push('ERR '+e.message));
await p.goto(PAGE); await p.waitForTimeout(5500);
await p.click('#startBtn'); await p.waitForTimeout(700);
await p.evaluate(()=>['prompt','hud','hint','decide'].forEach(i=>document.getElementById(i).classList.add('hide')));

console.log(JSON.stringify(await p.evaluate(()=>{
  const e=window.__enc, dt=1/60, log=[];
  const at=(x,z,ry)=>{ e.yaw.position.set(x,1.62,z); e.yaw.rotation.y=ry; e.yaw.updateMatrixWorld(true); };
  const op=()=>{ let v=0; e.ghost.traverse(o=>{ if(o.isMesh) v=o.material.opacity; }); return +v.toFixed(3); };
  at(-4.3, 4.0, 0); for(let i=0;i<120;i++) e.updateGhost(dt);
  log.push({at:'9m away', visible:e.ghost.visible, opacity:op()});
  at(-4.3, 1.0, 0); for(let i=0;i<20;i++) e.updateGhost(dt);
  log.push({at:'6m, 0.33s in', visible:e.ghost.visible, opacity:op()});
  for(let i=0;i<70;i++) e.updateGhost(dt);
  log.push({at:'6m, 1.5s in', visible:e.ghost.visible, opacity:op()});
  at(-4.3, 6.0, 0); for(let i=0;i<200;i++) e.updateGhost(dt);
  log.push({at:'retreated to 11m', visible:e.ghost.visible, opacity:op()});
  // facing: her forward (+Z rotated by rotation.y) should point at the player
  at(-4.3, 0.5, Math.PI); for(let i=0;i<200;i++) e.updateGhost(dt);   // look away so she turns
  const fx=Math.sin(e.ghost.rotation.y), fz=Math.cos(e.ghost.rotation.y);
  const tx=e.yaw.position.x-e.ghost.position.x, tz=e.yaw.position.z-e.ghost.position.z;
  const n=Math.hypot(tx,tz);
  log.push({at:'facing check', dotWithPlayer:+((fx*tx+fz*tz)/n).toFixed(3), note:'1 = facing player, -1 = away'});
  return log;
}), null, 1));
console.log('errors:', errs.length?errs:'none');
await b.close();
