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
  'title.tabTitle':      'The Hell Note',
  'title.logoAlt':       'Master Z’s Encounters — The Game',
  'title.headingPlain':  'The <em>Hell Note</em><br>I Should Never<br>Have Taken',
  'title.start':         'Start game',
  'title.controlsDesktop': '<b>Desktop</b> · W A S D to walk, move the mouse to look, <b>E</b> to look at things',
  'title.controlsPhone':   '<b>Phone</b> · left thumb walks, right thumb looks, <b>tap</b> things to look at them',
  'title.credits':       'Credits',

  // --- credits panel -------------------------------------------------------
  'credits.heading':     'Credits &amp; attributions',
  'credits.intro':       'Work by other people used in this prototype, with thanks.',
  'credits.music':       'Music',
  'credits.musicWho':    'Leberch · Pixabay',
  'credits.hands':       'Hands',
  'credits.handsWho':    'Free VR Hands pack · Fab',
  'credits.ghost':       'Ghost',
  'credits.ghostWho':    'Kuntilanak, Indonesian ghost · Sketchfab',
  'credits.block':       'HDB block',
  'credits.blockWho':    'HDB · Sketchfab',

  // --- chapter card (between Start and the night) --------------------------
  'chapter.loading':     'Loading…',

  // --- the HUD -------------------------------------------------------------
  'hud.sanity':          'Sanity',
  'hud.awareness':       'Awareness',
  'hud.wisdom':          'Wisdom',
  'hud.ghostWarning':    'Ghost spotted! Sanity level is dropping until you take action.',

  // --- in the world --------------------------------------------------------
  'world.burning':       'Something is burning ahead',
  'world.interactKey':   'E',
  'world.interactKeyTouch': 'Tap',
  'world.interactText':  'Examine the pile of hell notes',
  'world.interactTextTouch': 'the pile of hell notes',
  'world.hintWalk':      'Walk toward the light',
  'world.hintPhone':     'Left thumb walks · right thumb looks',
  'world.hintMouseTouch': 'W A S D to walk · move the mouse to look · touch works too',
  'world.hintLocked':    'W A S D to walk · move the mouse to look',
  'world.hintEdges':     'W A S D to walk · move the mouse to look · edges keep turning',
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
  'result.next':         'Close the file',

  // --- the end of a run ----------------------------------------------------
  'complete.label':      'Case file complete',
  'complete.sealed':     'Sealed',
  'complete.coreLabel':  'Core lesson',
  'complete.again':      'Walk it again',

  // --- losing your nerve ---------------------------------------------------
  'lost.label':          'Case file abandoned',
  'lost.sealed':         'Lost',
  'lost.say':            'Your nerve went before your legs did. Somewhere behind you the drum is still burning, and you could not tell anyone what you saw.',
  'lost.teachingLabel':  'Master Z’s teaching',
  'lost.teaching':       'Fear is not the danger. Standing in front of what frightens you, doing nothing, is the danger. Act, or step away — but do not freeze and call it caution.',
  'lost.retry':          'Walk it again'
});
