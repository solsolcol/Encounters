# The 3D sources generated for Master Z's Encounters

Originals, remeshes and rigs made for the game by Meshy, Hunyuan3D, Tripo and the rigging, at their own paths
in the game's repository (masters/<version>/src, which the game's branch ignores): 11 of 17
chunks, 312 files. Made by tools/srcbackup.py on the game's branch. Only what was generated for
the game is here: none of Chad's own models, no bought model, no photograph.

## Restoring

Fetch this branch BY NAME and unpack it with git archive. Never check it out or restore it into the
game's working copy: both would stage or delete the game's own files under masters/.

    git fetch origin claude/model-sources
    git archive FETCH_HEAD masters | tar -x

Join each cut file below (cat <name>.part1 <name>.part2 ... > <name>, then delete the parts), then check every
file against the manifest (sha256sum's format, one line a whole file):

    git show FETCH_HEAD:MANIFEST.txt > MANIFEST.txt && sha256sum -c MANIFEST.txt

## Cut to fit GitHub's 100 MB limit

- masters/v26.0/src/original-envisanhouse.glb (2 pieces)
- masters/v26.0/src/original-fan.glb (2 pieces)
- masters/v26.0/src/original-nagafount.glb (2 pieces)
