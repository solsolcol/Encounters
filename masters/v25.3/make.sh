#!/bin/bash
# v25.3 · EPISODE 4 CHAPTER 2: no sprinkle, no string, and Lersi Chin's body made natural (docs/V25.3-E4C2-NATURAL.md).
# Nothing here generates an asset: this release made no model, no picture and no sound. It is the record of what was
# MEASURED on his file before a pose was written, of what was retired, and of how the poses were looked at.
#
#   bash masters/v25.3/make.sh measure       his rig measured again (plain Node, a few seconds)
#
# ---------------------------------------------------------------------------------------------------------------------
# 1. WHAT WAS MEASURED (masters/v25.3/measure/*.cjs, each on assets/lersichin.glb; nothing is written to the repo)
#
#   bindpos.cjs   the file's scene nodes, each joint's place at rest, the twelve takes and their lengths.
#                 Rest pose in real metres: hips 0.945, Spine2 1.275, Neck 1.338, Head 1.420, head top 1.686, shoulders
#                 +-0.175 at 1.292. The mesh's own space is quantized (real = mesh x 0.85); 28 joints, ONE per hand.
#   hinge.cjs     HIS ELBOW IS A HINGE. In every key of all twelve takes the forearm's line stays in one plane of the
#                 upper arm's frame (0.0-0.4 degrees out of it), flexing 3 to 145 degrees. The hinge, in the upper arm's
#                 own frame:   Left (0.740, 0, -0.672)   Right (0.734, 0, 0.679)   flexion positive.
#                 (The chapter's HINGE. v25.2 bent his elbow with chapter 1's shortest-arc solver, which turns the forearm
#                 about whatever axis is shortest: sideways, out of that plane.)
#   twist.cjs     HIS FOREARM NEVER ROLLS. Each key's forearm turn split into flexion about the hinge and a roll about
#                 its own line: the roll is constant in every take, 18.15 degrees left (0.3168 rad), -17.54 right
#                 (-0.3061 rad). All turning of the hand is at the wrist: the hand rolls to +-100 degrees and bends to 57.
#                 (The chapter's FORE_ROLL. v25.2 gave the forearm 70 % of the hand's turn: a wrung arm.)
#   measure.cjs   each hand's palm side as a height map (centimetres along the fingers by centimetres across), its
#                 thumb's side, and his face's profile on the midline from the head joint. In the game's measure
#                 (b_build3 waiHands, at the bind): Left hand 20.9 cm long, its fingers' band [-2.7, 5.3] cm across, its
#                 thumb to -x at (15.1, -7.1) cm, its palm's resting line 4.52 cm off the wrist's line and leaning 10.7
#                 degrees; Right 19.9 cm, band [-4.1, 3.9], thumb to +x at (12.8, 7.9), 4.83 cm and 13 degrees. Both
#                 wrists wear bead bracelets (the hands cannot be laid wrist to wrist), and the left hand's fingers are
#                 splayed a little wider (the scan's own). His face from the head joint, real centimetres (up, forward):
#                 chin (-3.0, 12.2), nose tip (5.1, 13.9), brow about (10, 11.8).
#   prof.cjs      the holy-water bowl's own profile as fitted (0.22 m across, 13.6 cm tall): foot r 5.7 cm, waist 4.9 at
#                 1.5-2.5 cm, r 7.2 at 3.5 cm (its wall faces about 57 degrees downward there), 8.6 at 4.5 cm, widest
#                 11.1 at 9-11 cm; and his chest's front on the midline by height. Seated, his own take leans his chest
#                 26 degrees forward.
#
# 2. WHAT WAS LOOKED UP: a Thai wai's three levels (docs/V25.3-E4C2-NATURAL.md has the sources): to a monk or a sacred
#    image the thumbs between the eyebrows and the head bowed into the hands; to an elder the thumbs at the nose; to an
#    equal the thumbs at the chin; an answer to a wai is hands at the chest and a nod. Elbows in.
#
# 3. HOW THE POSES WERE LOOKED AT: tools/probes/poselab.mjs (the game booted once and kept open; a pose set and
#    photographed in seconds from in front, from beside him, a three-quarter view and the film's own lens at a phone's
#    shape, 780x1688), poselab-job.py and poselab.sh. No pose was judged on a contact sheet.
#
# 4. WHAT WAS RETIRED (Chad, 10 Nov 2026: "There is no need for lersi chin to sprinkle water with the leaf thing and no
#    need for the tieing of string"). Out of the build and the repo; their sources stay where they were made:
#      assets/e4mayom.glb                       the mayom bundle       masters/v25.0/models, make.sh models (its sources
#                                                                      in masters/v25.0/src, not committed)
#      assets/audio(-opus)/x2sprinkle           the drops off the leaves   masters/v25.0/sfx/raw
#      assets/audio(-opus)/x2thread             the thread knotted         masters/v25.0/sfx/raw
#      assets/audio(-opus)/lc2wrist             "Your wrist."              masters/v25.0/voices/raw
#    with their STING_SAMPLE rows, the cast take set's entry, the registry row, the SECS row and build.py's asset row.
#    git holds every one of them to bbe50e1 (v25.2).
set -e
cd "$(dirname "$0")/../.."
case "${1:-}" in
  measure)
    G=assets/lersichin.glb
    node masters/v25.3/measure/bindpos.cjs "$G" | tail -n 40
    node masters/v25.3/measure/hinge.cjs "$G"
    node masters/v25.3/measure/twist.cjs "$G"
    node masters/v25.3/measure/prof.cjs
    node masters/v25.3/measure/measure.cjs "$G" /dev/null
    ;;
  *) sed -n '2,8p' "$0" ;;
esac
