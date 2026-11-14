# v26.12 — episode 4 chapter 3, Chad's answers of 14 Nov 2026 (docs/V26.12-WHAT-IS-LEFT.md §3)
#
# 1. THE BODIES' TURNED TRIANGLES: TRIED, PHOTOGRAPHED, AND PUT BACK ("Fix and check all (Recommended)", of a few
#    triangles of a woman's hair drawn dark). tools/fliptris.mjs found 5,944 triangles in the chapter's 63 body files whose
#    winding is 120 degrees and more from their own corners' normals, and turned each (two corners swapped in the index
#    list: every attribute, skin, animation and texture byte for byte as it was). Checked at first ONLY BY NUMBERS. Chad,
#    the same day: "I think your fix without visually checking the models is a little dangerous, you sometimes add more
#    problems than you fix". So every changed place was then photographed before and after (tools/probes/flipshot.mjs: the
#    three biggest places of each file, 189 in all, from outside, textured, with the turned triangles painted red beside
#    them; and tools/probes/flipview.mjs: the body where the player meets it, four sides, a phone's screen). At a hand's
#    length 59 places looked a little better (a dark crease on the third woman's blouse shorter and lighter) and about 30
#    measured worse, one of them plainly: on Ton's far body (e4tonf) a smooth white collar became a dark wedge with a black
#    band across it. The bodies are drawn TWO-SIDED (doubleSided in every file), so a turned triangle was never a hole;
#    turning one changes only which way it is lit, and where a body's own normals point the wrong way the triangle the test
#    called turned was the one wound right. ALL 63 FILES WERE PUT BACK as they were (git checkout), the prep step
#    (masters/v26.0/people.sh) as it was, and fliptris made report-only. The dark slivers in her hair stay: a few pixels at
#    a hand's length, none where a player meets her (flipview at her nearest, 2.3 m: 1 to 22 pixels of 1.3 million a side
#    differed, none to be seen). A real cure is in the normals at those places, not the winding: not attempted.
#    Pictures: the scratchpad's fs/shots and fv (not kept). The two probes are kept in tools/probes for any change to a mesh.
#
# 2. THE POSE REFERENCES FOR HIS OPEN HAND AT THE CLOSE ("Petal on his hand": c_zfx.js myOpenHand), learned before the
#    pose was built (v26.3's rule). Higgsfield's GPT Image 2.6 (gpt_image_2_6), one picture each, no image references,
#    kept beside this file (src/, ignored by git). The prompts, word for word:
#   src/ref-palm-pov.png (2:3, 688 x 1024, sha1 6b3cdcc865...):
#     "Photorealistic first-person point-of-view photograph, as seen through a kneeling man's own eyes, looking down at his
#     own right hand held out palm up in front of his lower chest, about forty centimetres in front of his eyes and slightly
#     to the right of centre. The palm is open and very slightly cupped, the four fingers relaxed and gently curved upward,
#     close together with small natural gaps between them, the thumb relaxed and resting out to the side of the palm. A
#     single small pale yellow-white flower petal lies in the middle of the palm. The wrist is straight, the forearm comes in
#     from the lower right corner of the frame, the elbow bent and hanging low at his side. Beyond the hand, softly out of
#     focus, a woven straw mat on the ground. Natural daylight, sharp focus on the palm, natural human anatomy, five fingers."
#   src/ref-palm-side.png (3:4, 880 x 1168, sha1 d4a71b23e1...):
#     "Photorealistic documentary photograph, exact side view (profile) from his right. A young Southeast Asian man in a
#     plain white shirt kneels upright on a woven straw mat, sitting back on his heels, and holds his right hand out palm up
#     in front of his lower chest, looking down into it. His upper arm hangs close to his side, the elbow bent at a little
#     more than a right angle, the forearm rising gently forward from the elbow to the hand, the wrist straight, the palm
#     open and facing up, the fingers relaxed and gently curved, the thumb relaxed. A single small pale flower petal lies in
#     his palm. His left hand rests on his left thigh. Whole upper body in frame, plain light background, soft daylight,
#     natural human anatomy, five fingers."
#    READ FROM THEM, AS NUMBERS (OPENHAND in c_zfx.js): the side picture's upper arm hangs near vertical from the shoulder,
#    the elbow at the foot of the ribs, bent about 120 degrees (shoulder to elbow to wrist about 60 inside); the forearm
#    rises about 29 degrees forward; the fingers rise about 15 (the wrist lifted about 14 against the forearm); the palm
#    faces up. From his own eyes the palm's middle lies about 0.62 of the frame across and 0.46 down, the fingers running
#    on along the forearm's line within about 5 degrees and some 20 degrees in toward his middle, gently curved at every
#    joint, the thumb out from the palm some 40 degrees, the palm seen nearly whole (tipped toward his eye).
