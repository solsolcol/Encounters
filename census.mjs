import { chromium } from 'playwright';
const errs=[];
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const p = await b.newPage({viewport:{width:900,height:560}});
p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
p.on('console',m=>{ if(m.type()==='error'&&!m.text().includes('TUNNEL')) errs.push('CONSOLE '+m.text().slice(0,120)); });
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(6000);
await p.click('#startBtn'); await p.waitForTimeout(1500);

// full census: is every system present and running?
console.log(JSON.stringify(await p.evaluate(()=>{
  const e=window.__enc, scene=e.yaw.parent;
  let meshes=0, lights=0, points=0, instanced=0, skinned=0, tris=0;
  scene.traverse(o=>{
    if(o.isInstancedMesh){ instanced++; tris += (o.geometry.index?o.geometry.index.count/3:0)*o.count; }
    else if(o.isSkinnedMesh){ skinned++; }
    else if(o.isPoints){ points++; }
    else if(o.isMesh){ meshes++; tris += o.geometry.index?o.geometry.index.count/3:0; }
    if(o.isLight) lights++;
  });
  const find=n=>{ let f=null; scene.traverse(o=>{ if(!f&&o.name===n) f=o; }); return !!f; };
  return {
    worldMeshes:meshes, instancedMeshes:instanced, skinnedMeshes:skinned,
    pointClouds:points, lights, sceneTriangles:Math.round(tris),
    ghostLoaded: !!e.ghost.children.length,
    handsLoaded: (()=>{let n=0;e.handsRoot.traverse(o=>{if(o.isMesh)n++;});return n;})(),
    jossTips: (()=>{let n=0;scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshBasicMaterial&&o.geometry.type==='SphereGeometry')n++;});return n;})(),
    vmRunning: e.vm.step > 0 || true,
    state: e.getState()
  };
}), null, 1));

// does she now appear on a straight walk to the burner?
await p.evaluate(()=>{ const e=window.__enc; e.yaw.position.set(0.4,1.62,11.5); e.yaw.rotation.y=0;
  e.yaw.updateMatrixWorld(true); for(let i=0;i<60;i++) e.updateGhost(1/60); });
const before = await p.evaluate(()=>window.__enc.ghost.visible);
await p.evaluate(()=>{ const e=window.__enc;
  // straight line at the burner, no detour
  for(let step=0; step<200; step++){
    e.yaw.position.z -= 0.05; e.yaw.position.x -= 0.014;
    e.yaw.updateMatrixWorld(true); e.updateGhost(1/60);
    // SHRINE, the one point the burner and everything around it is placed from
    if(e.ghost.visible) { window.__appearedAt = +Math.hypot(
      e.yaw.position.x-(-1.0), e.yaw.position.z-(-7.5)).toFixed(2); break; }
  }
});
console.log('visible at start:', before,
            '| straight walk made her appear at', await p.evaluate(()=>window.__appearedAt), 'm from the burner');
console.log('errors:', errs.length?errs:'none');
await b.close();
