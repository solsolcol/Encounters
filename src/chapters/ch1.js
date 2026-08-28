/* Chapter 1 · The Hell Note
   ---------------------------------------------------------------------------
   A chapter file carries everything that is THIS chapter rather than the
   game: the words, the choices and their costs, where the stage sits in the
   world, and which heavy files the chapter needs pulled from the server.

   It is a plain script, not a module, so the same file works everywhere the
   game runs: on the hosted site it is fetched and cached as its own file
   (index.html loads it before game.js), and in the single-file build it is
   simply concatenated ahead of the engine. Either way it registers itself on
   the chapter registry and the engine reads it from there.

   Chapter 2 starts by copying this file and changing what it says.          */

(window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch1 = {
  id: 1,
  title: 'The Hell Note',

  // the black card shown between Start and the playable night
  cardLabel: 'Chapter 1',
  cardTitle: 'The Hell Note<br>I Should Never Have Taken',

  brief: 'Late. A void deck you have walked a hundred times. Tonight someone has been burning for the dead, and a single note has drifted away from the pile, right into your path.',
  prompt: 'The note is at your feet. What do you do?',
  choices: [
    {
      k: 'A', text: 'Pick it up. It is only paper — and it might be real money.',
      d: { sanity: -20, awareness: -10, wisdom: -15 },
      verdict: 'bad',
      say: 'You bend down and take it. The air near the drum goes still, and the warmth on your face is suddenly gone.',
      teach: 'What is burned is given. Taking it back is taking from someone who can no longer object. Greed does not become harmless just because the object is worthless.'
    },
    {
      k: 'B', text: 'Kick it away and laugh. Superstition is for other people.',
      d: { sanity: -30, awareness: -15, wisdom: -25 },
      verdict: 'worst',
      say: 'Your foot scuffs the note across the concrete. Behind you, the drum ticks once — metal cooling, or something else.',
      teach: 'Mockery is a form of belief: it insists on an answer before you have looked. Contempt costs nothing to feel and everything to carry.'
    },
    {
      k: 'C', text: 'Stop. Look at what is actually here before moving.',
      d: { sanity: 5, awareness: 25, wisdom: 15 },
      verdict: 'good',
      say: 'You stand still. Drum. Plate. Three sticks, still lit. Someone was here minutes ago. This is not a place for you to be standing.',
      teach: 'Observation costs nothing and prevents most of what follows. Before you believe or dismiss, first see. Awareness is the cheapest protection there is.'
    },
    {
      k: 'D', text: 'Step around it, palms together, and quietly excuse yourself.',
      d: { sanity: 15, awareness: 15, wisdom: 25 },
      verdict: 'best',
      say: 'You go the long way round. A short bow, no words out loud. The lamp buzzes. The night carries on without you in it.',
      teach: 'Respect is not agreement. You do not need to believe in something to leave it undisturbed — and leaving things undisturbed is most of the practice.'
    }
  ],
  core: 'Observe before reacting. Do not blindly believe, blindly dismiss, or provoke what you do not understand.',

  // --- the stage -----------------------------------------------------------
  // Every world position the engine parameterises on. The void-deck builder
  // still lives in the engine for now; these are its inputs, so a chapter
  // already decides where everything stands.
  spawn:     { x: 0,    y: 1.62, z: 17 },      // out on the grass, facing the block
  shrine:    { x: -1.0, z: -7.5 },             // the burner, inside the void deck
  ghostHome: { x: -2.5, z: -12.0 },            // where she waits
  bounds:    { minX: -21, maxX: 21, minZ: -18.6, maxZ: 26 },

  // --- what this chapter needs from the server -----------------------------
  // Keys into the engine's asset table. Shared things every chapter uses
  // (hands, logo, music) are the engine's own; these are chapter-specific.
  assets: ['hdb', 'ghost', 'voice']
};
