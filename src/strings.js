/* Every word the ENGINE says — one file, one place to change them all.
   ---------------------------------------------------------------------------
   This file is the UI half of the game's text. The other half (the chapter's
   own words: brief, prompt, choices, teachings) lives in the chapter file,
   because those belong to the chapter, not the engine.

   Chad edits BOTH halves from one Google Sheet; `textsync.mjs export` writes
   the sheet's CSV out of these files and `textsync.mjs import` writes it back
   in. Nothing here is generated — it stays hand-readable so a person can also
   just edit it directly.

   HOW IT REACHES THE SCREEN. Any element in shell.html carrying data-t="key"
   has its content replaced by the value below at boot. A few strings are used
   from code instead (the hints, which depend on the device).

   AN EMPTY VALUE HIDES THAT PIECE OF UI. That is deliberate: clearing a cell
   in the sheet is how you remove a line you do not want, without anyone
   having to touch code.                                                     */

(window.__TEXT__ = window.__TEXT__ || {});
Object.assign(window.__TEXT__, {

  // --- title screen --------------------------------------------------------
  'title.tabTitle':      'Master Z’s Encounters — The Game',
  'title.logoAlt':       'Master Z’s Encounters — The Game',
  'title.headingPlain':  'Master Z’s Encounters — The Game',
  'title.intro':         'A void deck. A stairwell. A hotel corridor at 3 AM. Ordinary places on the wrong night, and in each one, something you have to decide how to answer.',
  'title.start':         'Start game',
  'title.continue':      'Continue',
  'title.resumeNote':    'Picking up where you left off · {chapter}',
  'title.newGame':       'Start a new game',
  'title.controlsDesktop': '<b>Desktop</b> · W A S D to walk, move the mouse to look, <b>E</b> to interact with objects',
  'title.controlsPhone':   '<b>Phone</b> · left thumb walks, right thumb looks, <b>tap</b> objects to interact with them',
  'title.credits':       'Credits',

  // --- credits panel -------------------------------------------------------
  'credits.heading':     'Credits &amp; Attributions',
  'credits.intro':       'Creative works by other people used in this game, with thanks.',
  // each entry reads what / who / link, so the sheet keeps them together
  'credits.music':       'Music',
  'credits.musicWho':    'Leberch · Pixabay',
  'credits.musicLink':   'pixabay.com/users/leberch-42823964',
  'credits.hands':       'Hands and arms',
  'credits.handsWho':    'First person arms · Fab',
  'credits.handsLink':   'fab.com/listings/c9b121d9',
  'credits.ghost':       'Ghost',
  'credits.ghostWho':    'Kuntilanak, Indonesian ghost · Sketchfab',
  'credits.ghostLink':   'sketchfab.com · kuntilanak-indonesian-ghost',
  'credits.block':       'HDB block',
  'credits.blockWho':    'HDB · Sketchfab',
  'credits.blockLink':   'sketchfab.com · hdb',
  'credits.mum':         'The mother',
  'credits.mumWho':      'Casual woman in brown dress, rigged · Sketchfab',
  'credits.mumLink':     'sketchfab.com · casual-woman-in-brown-dress',
  'credits.chair':       'The chairs',
  'credits.chairWho':    'Plastic chair · Sketchfab',
  'credits.chairLink':   'sketchfab.com · plastic-chair',
  'credits.cars':        'The cars',
  'credits.carsWho':     'Low poly cars · Sketchfab',
  'credits.carsLink':    'sketchfab.com · low-poly-cars',
  'credits.guangong':    'The altar statue',
  'credits.guangongWho': 'EinScan Pro HD statue of Guan Gong · Sketchfab',
  'credits.guangongLink': 'sketchfab.com · statue-of-guan-gong',
  'credits.encik':       'The audience',
  'credits.encikWho':    'Encik Lim Cheng Teck, duduk · Sketchfab',
  'credits.encikLink':   'sketchfab.com · encik-lim-cheng-teck-duduk',
  'credits.tangki':      'The tang-ki',
  'credits.tangkiWho':   'Old man, rigged · Sketchfab',
  'credits.tangkiLink':  'sketchfab.com · old-man-rigged-3d-model',
  'credits.boy':         'The boy in the crowd',
  'credits.boyWho':      'Chinese boy · Sketchfab',
  'credits.boyLink':     'sketchfab.com · chinese-boy',
  'credits.shrine':      'The second altar figure',
  'credits.shrineWho':   'Seated shrine figure with sword, Thailand · Sketchfab',
  'credits.shrineLink':  'sketchfab.com · seated-shrine-figure-with-sword-thailand',
  'credits.altar':       'The home altars',
  'credits.altarWho':    'Vietnamese altar · Sketchfab',
  'credits.altarLink':   'sketchfab.com · vietnamese-altar',
  'credits.anim':        'Animation and two of the crowd',
  'credits.animWho':     'The mother’s takes, and two seated characters · Mixamo',
  'credits.animLink':    'mixamo.com',
  'credits.footer':      'Everything else in the scene — the void deck, the burner, the offerings, the hell notes, the sky and the lighting — is generated in code.',

  // --- chapter card (between Start and the night) --------------------------
  'chapter.loading':     'Loading…',

  // --- the HUD -------------------------------------------------------------
  'hud.sanity':          'Sanity',
  'hud.awareness':       'Awareness',
  'hud.wisdom':          'Wisdom',
  'hud.ghostAlarm':      'Ghost spotted!',
  'hud.ghostWarning':    'Sanity level dropping until you take action.',

  // --- in the world --------------------------------------------------------
  'world.burning':       'Something is burning ahead...',
  'world.interactKey':   'E',
  'world.interactKeyTouch': 'Tap',
  'world.interactText':  'Examine the pile of hell notes',
  'world.interactTextTouch': 'the pile of hell notes',
  'world.hintWalk':      'Walk toward the light',
  'world.hintPhone':     'Left thumb walks · right thumb looks',
  'world.hintMouseTouch': 'W A S D to walk · move the mouse to look · touch works too',
  'world.hintLocked':    'W A S D to walk · move the mouse to look',
  'world.hintEdges':     'W A S D to walk · move the mouse to look',
  'world.actHintTouch':  'tap the glowing pile',
  'world.actHintKey':    'E at the glowing pile',
  'world.actLineTouch':  'Tap the glowing pile of notes to look again',
  'world.actLineKey':    'Press E at the glowing pile to look again',

  // --- cutscenes -----------------------------------------------------------
  'cine.skip':           'Skip ▸',

  // --- the decision --------------------------------------------------------
  'decide.label':        'Decision',
  'decide.stepBack':     'Step back ✕',

  // --- the outcome and the teaching ----------------------------------------
  'result.label':        'Outcome',
  'result.teachingLabel': 'Master Z’s teaching',
  'result.next':         'Continue',

  // --- the end of a run ----------------------------------------------------
  'complete.label':      'Case file complete',
  'complete.sealed':     'Sealed',
  'complete.coreLabel':  'Core lesson',
  'complete.again':      'Continue',

  // --- losing your nerve ---------------------------------------------------
  'lost.label':          'Case failed',
  'lost.sealed':         'Lost',
  'lost.say':            'Your sanity has shattered. You\'ve seen what no mind was meant to endure.',
  'lost.teachingLabel':  'Master Z’s teaching',
  'lost.teaching':       'Fear is not the danger. Facing what terrifies you...and doing nothing—is.',
  'lost.retry':          'Retry',

  'newgame.heading':     'Start a new game?',
  'newgame.body':        'Your saved progress will be erased and you will begin again from the first chapter.',
  'newgame.yes':         'Start over',
  'newgame.no':          'Keep playing',

  // --- inventory / equipment -----------------------------------------------
  'inv.button':          'Inventory',
  'inv.buttonKey':       'I',
  'inv.title':           'Equipment',
  'inv.close':           'Close ✕',
  'inv.worn':            'Worn',
  'inv.carried':         'Carried',
  'inv.empty':           'Nothing selected',
  'inv.emptyDesc':       'Tap an item to look at it.',
  'inv.hintTouch':       'Tap an item, then tap where it goes · double-tap to equip',
  'inv.hintDesktop':     'Drag an item, or click it and click where it goes · double-click to equip · I or Esc closes',
  // slot labels name what the place takes; WHERE it is, the figure shows
  'slot.head':           'Divine Eyes',
  'slot.neck':           'Amulet',
  'slot.body':           'Sak Yant',
  'slot.rightHand':      'Beads',
  'slot.leftHand':       'Light',
  'item.phone.name':     'Phone',
  'item.phone.desc':     'Two percent battery and a torch that works. Enough to see your feet, not enough to see far.',
  'item.keys.name':      'House Keys',
  'item.keys.desc':      'Home is four floors up. They have never felt this far away.',
  'item.beads.name':     'Prayer Beads',
  'item.beads.desc':     'Your grandmother pressed these into your hand years ago. You have never taken them seriously, and never taken them off.',
  'item.note.name':      'Hell Note',
  'item.note.desc':      'Burned for someone else. It should not be in your pocket.',

  // --- spoken by screen readers, never seen on screen ----------------------
  'a11y.soundButton':    'Sound on or off',
  'a11y.volumeSlider':   'Game volume',
  'a11y.closeButton':    'Close',
  'a11y.creditsButton':  'Credits'
});
