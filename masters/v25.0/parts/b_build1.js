
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
    const BAG = { x: -1.16, z: -2.1, face: 1.9 };                                         // his bag on the floor at the counter's end
    const STOOL = { x: 0.55, z: COUNTER.z - 0.85 };                            // his stool behind the counter (buildShop's)
    const FRIDGE = { x0: 0.78, x1: 1.32, h: 0.47, z: COUNTER.z - COUNTER.d / 2 }; // the bar fridge set into the cupboard's back, its glass door his side
    const NOTE = { x: 0.24, z: COUNTER.z + 0.02, ry: 0.12 };                  // CALL PONG, stuck on the glass beside his phone
    const SWITCH = { x: SHOP.x0 + 0.012, y: 1.3, z: 2.58 };                     // the light switch on the left wall inside the door
    /* (v25.2) the switch at 2.58, between the shelf (to 2.51) and the neighbour's pillar (from 2.65; it stands 0.46 m square
       on the wall's line at 2.88): at 2.8 it was inside the pillar, unseen since v25.0 — the night's 'Switch on the light'
       pointed at nothing a player could see (found by photographing the switch from 44 cm at v25.2) */
    const SHELF = { x: SHOP.x0 + 0.13, y: 1.48, z: 2.36 };                     // a small shelf beside it: the piece, facing the door
    /* (v25.4) THE PIECE HE TOOK, BIGGER, AND ITS RED GLOW ON THE SHELF. Chad, 10 Nov 2026: "The 3 possible items that the
       player picks in the previous chapter, nang kwak, takrut, pha yant, needs to be made bigger on the shelf so that it is
       actually visible. It is hard to see now. Also add a red glow to those items as it sits on the shelf."
       Measured first (docs/V25.4-E4C2-SHELF-PIECES.md): at chapter 1's tray sizes (7.5, 6.6 and 8.5 cm, kept at v25.0) the
       Nang Kwak stood 9 pixels tall on a phone from behind his counter, near black, on a shelf in a 45 cm strip of wall
       between the wall cabinet and the door's pillar.
       ONE SIZE WHEREVER THE PIECE IS SEEN in this chapter (the shelf, his hand, the master's palms, the cloth): made bigger
       on the shelf alone it would shrink as he took it down, in one shot.
       Each: its asset, its size in metres along `axis` (measured after the turns), its turns as its model lies, and its
       place on the shelf from the shelf's own middle (dx into the room, dz along the wall toward the door) with its turn
       there (ry); and its outline for the smoke, which leaves its surface and not the air beside it: `taper`, how much
       narrower the seated figure is at her head than at her base, or `round` for the two that lie (a tube and a roll:
       widest at half their height, a line along their top) */
    const PIECE_FIT = {
      /* each stands 4 to 5 cm toward the door from the shelf's middle: the wall cabinet's end (its corner post at
         x -1.94, z 2.11) hid whatever stood at the middle from where he kneels in the examination, and the look that
         turns to "the piece standing by the door" found half of it (measured, then photographed through that lens) */
      nangkwak: { key: 'e4nangkwak', size: 0.19, axis: 'y', ry: 0, rz: 0, at: [-0.012, 0.05], turn: 0, taper: 0.6 },
      /* the two that lie are laid along the wall, a little askew: pointing out from it (chapter 1's way on the tray) a
         man facing the shelf saw each end-on, a disc, and at 21 cm the roll's far end was in the wall (photographed) */
      takrut:   { key: 'e4takrut', size: 0.2, axis: 'x', ry: 0, rz: Math.PI / 2, at: [-0.017, 0.05], turn: 0.95, round: true },
      phayant:  { key: 'e4phayant', size: 0.21, axis: 'x', ry: 0.3, rz: 0, at: [-0.012, 0.04], turn: 1.1, round: true }
    };
    /* the glow (no lamp, v9.4): a red halo that faces the lens (additive), a red wash on the wall behind it and a pool
       on the shelf's top (the hue laid on, v8.8: additive red on a pale wall sums to pink), and the piece's own surface
       lit red from within. `at`: the halo's middle, as a share of the piece's height. It breathes: `breath` of its
       strength, once in `period` seconds. `night`: its strength with the shop's lights off (an unlit layer is not dimmed
       by the dark, so it is) */
    const PGLOW = { tint: 0xff2412, wall: 0xd4140a, halo: 0.42, haloD: 0.62, wash: 0.62, washD: 0.66, pool: 0.5, self: 0.12,
                    at: 0.55, breath: 0.28, period: 3.6, night: 0.8,
                    /* (v25.4) THE BLACK SMOKE (Chad, the same day: "Maybe also add some black smoke to the items to make it
                       look more evil and some sound effects on those items to make it more creepy, like whispering
                       sounds"): how many streams and how dark at their fullest (each rooted on the piece's own surface at
                       its own place along it, from under half its height to its top, lengthening upward).
                       Its strength is 0.42, from 0.8, on his word the same evening with it live ("make the black smoke
                       more transclucent"): photographed at 0.8, 0.6, 0.45 and 0.32 with the smoke held still, the wall
                       and the glow are seen through it from 0.45 down, and at 0.32 it is nearly gone from the middle of
                       the shop on a phone (a correction does not overshoot, v22.0) */
                    wisps: 12, smoke: 0.42 };
    /* (v25.4) ITS WHISPER: a wordless loop (x2whisper) heard near the shelf while the piece stands on it, full within
       `near` metres and gone by `far`, to the side it is on, and under a voice at `under` of itself */
    const WHISPER = { vol: 0.5, near: 0.9, far: 3.6, under: 0.5 };
    const STAND = { x: 1.55, z: 2.36, ry: Math.PI + 0.42 };                    // the Grand Opening stand inside the door, turned in, its flowers dried
    const LC = { x: 0, z: -0.42 };                                             // Lersi Chin on his mat, facing the door; the altar's Buddha over his shoulder
    /* (v25.0 CP6) Lersi Chin's things made as models (masters/v25.0/models): their sizes in metres, and the places inside
       each that the code's own pieces stand at (shares of the fitted model's height and width, measured on the model) */
    const BOWL_W = 0.22, BOWL_WATER = [0.72, 0.4];                            // the bowl across; the water's height and radius
    const PHAN_W = 0.26, PHAN_TOP = 0.86;                                     // the tray across; where the candles stand in its flowers
    const CL = { x: 0, z: 0.78 };                                              // where he kneels before him, facing the altar
    const PSTOOL = { x: 1.15, z: COUNTER.z + COUNTER.d / 2 + 0.42 };           // the customers' right stool (buildShop's): Pong's
    const MAT = { x: 0, z: 0.18, w: 1.24, d: 2.1 };                            // the woven mat under both
    const KNEEL = { y: 0.88, span: 1.15, lo: -0.85, hi: 0.5 };                 // his eye kneeling (sat back on his heels, his head no higher than it need be), how far he may look about
    const faceLC = () => Math.atan2(-(LC.x - CL.x), -(LC.z - CL.z));         // his view from the mat, onto Lersi Chin and the altar
//@@COPY 2889-3476
