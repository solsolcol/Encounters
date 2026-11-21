#!/bin/sh
# gitsave.sh "<message>" <path...>   (v28.0) add, commit and push ONLY the paths given, one saver at a time (several
# helpers work in one tree: the lock keeps their commits from colliding). The message begins with the version.
# Never `git add -A` from a helper: another helper's half-written files are in the same tree.
msg=$1; shift
[ $# -gt 0 ] || { echo "gitsave: no paths"; exit 2; }
exec 8>/tmp/encounters-git.lock; flock 8
cd "$(dirname "$0")/.." || exit 2
# (a path already staged as deleted, by git rm, is not added again: `git add` refuses it; the commit records it)
for p in "$@"; do if [ -e "$p" ] || git ls-files --error-unmatch -- "$p" >/dev/null 2>&1; then git add -A -- "$p" || exit 1; fi; done
git commit -q -m "$msg

Co-Authored-By: ${ENC_COAUTHOR:-Claude Opus 5.5} <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012dssR6qAN57acivr6t6QeS" -- "$@" && { for i in 1 2 3 4; do git push -q -u origin claude/new-session-bampns && break; sleep $((i * 4)); done; git log --oneline -1; }
