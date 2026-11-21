# v28.0 release pipeline (saved from the scratch folder, 21 Nov 2026, Chad's R31)

These lived only in the session's scratch folder (`$S/e4c5/`); copies here survive a container reset.

- `release-safe.sh`: builds a release ONLY from pinned safe parts (chapter 5 assembled apart from `e4c5base` plus per-part
  pins, chapter 4 from its pin, the engine's files on disk proved equal to the pinned engine commit), runs the static
  checks on what ships, builds through `ENC_CHAPTER_FROM`, and proves the built chapters are those assemblies.
- `safe.env`: the pins as of deploy 24 (`6b01e9778603769956ea0588`): chapter 5 = 509d8ad plus three parts (as deploy 23),
  chapter 4 and the engine = 6a3ac4d (CH4's R139 to R144).
- `ckpt.sh`: checkpoints helpers' in-flight files (never secrets, never his photographs) through `tools/gitsave.sh`.
- `rmcopy.sh`: clears a build copy only if no running process names it.
- `release-build.sh`: the older release script (kept for its record; release-safe.sh replaced it).

In a new container: set `S` at the top of each script to that session's scratchpad, copy `safe.env` to `$S/e4c5/`, and
deploy as CLAUDE.md says (a fresh proxy URL from the Netlify MCP, then `tools/netlifydeploy.py` from the snapshot).
