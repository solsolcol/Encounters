
  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, HEAD_RE } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted view
    const wallNow = () => performance.now() / 1000;

    /* ------------------------------------------------------------- the map: ONE WORLD, his shop, at the origin */
    const SX = 0;
    const world = new THREE.Group();
    scene.add(world);
    const worldS = new THREE.Group(); worldS.position.x = SX; world.add(worldS);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    const hidBox = (w, h, d, x, y, z, parent) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

//@@COPY 430-453
//@@COPY 458-560

    /* ============================================== HIS SHOP (chapter 1's World S, copied: CP3, §6.2)
       Chapter 1 built it for two films at dawn; here it is the whole chapter, weeks on — the cases filled, his bag, his
       jacket, the till and a drinks fridge on his side of the counter, the Grand Opening stand by the door with its
       flowers dried (nobody took it away), the note in his own hand on the glass, a light switch by the door, the piece
       he took in chapter 1 on a shelf beside it facing the door — and seen at noon in the fog and at night with the
       shutter half down. Every number below that is chapter 1's is chapter 1's, so the room is the room he opened. */
//@@COPY 2812-2826
    /* (v25.0) the places this chapter adds, in the shop's frame (the world's: the shop stands at the origin) */
    const HIS = { x: -0.25, z: -2.3 };                                         // his place behind the counter
    const TILL = { x: -0.62, y: 0.33, z: COUNTER.z - COUNTER.d / 2 };          // the cash drawer, in the cupboard's back
    const BAG = { x: -1.16, z: -2.1 };                                         // his bag on the floor at the counter's end
    const STOOL = { x: 0.55, z: COUNTER.z - 0.85 };                            // his stool behind the counter (buildShop's)
    const FRIDGE = { x0: 0.78, x1: 1.32, h: 0.47, z: COUNTER.z - COUNTER.d / 2 }; // the bar fridge set into the cupboard's back, its glass door his side
    const NOTE = { x: 0.24, z: COUNTER.z + 0.02, ry: 0.12 };                  // CALL PONG, stuck on the glass beside his phone
    const SWITCH = { x: SHOP.x0 + 0.012, y: 1.3, z: 2.8 };                     // the light switch on the left wall inside the door
    const SHELF = { x: SHOP.x0 + 0.13, y: 1.48, z: 2.36 };                     // a small shelf beside it: the piece, facing the door
    const STAND = { x: 1.55, z: 2.36, ry: Math.PI + 0.42 };                    // the Grand Opening stand inside the door, turned in, its flowers dried
    const LC = { x: 0, z: -0.42 };                                             // Lersi Chin on his mat, facing the door; the altar's Buddha over his shoulder
    const CL = { x: 0, z: 0.78 };                                              // where he kneels before him, facing the altar
    const PSTOOL = { x: 1.15, z: COUNTER.z + COUNTER.d / 2 + 0.42 };           // the customers' right stool (buildShop's): Pong's
    const MAT = { x: 0, z: 0.18, w: 1.24, d: 2.1 };                            // the woven mat under both
    const KNEEL = { y: 1.0, span: 1.15, lo: -0.85, hi: 0.5 };                  // his eye kneeling, how far he may look about
    const faceLC = () => Math.atan2(-(LC.x - CL.x), -(LC.z - CL.z));         // his view from the mat, onto Lersi Chin and the altar
//@@COPY 2889-3476
