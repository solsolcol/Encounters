#!/bin/sh
# gitsave.sh "<message>" <path...>   (v28.0) add, commit and push ONLY the paths given, one saver at a time (several
# helpers work in one tree: the lock keeps their commits from colliding). The message begins with the version.
# Never `git add -A` from a helper: another helper's half-written files are in the same tree.
msg=$1; shift
[ $# -gt 0 ] || { echo "gitsave: no paths"; exit 2; }
exec 8>/tmp/encounters-git.lock; flock 8
cd "$(dirname "$0")/.." || exit 2
# (27 Nov 2026, R9: the session that wrote this was bricked when GitHub's `main` went, and its branch name and session
# link were written in here. The branch is the one checked out, and the session is this machine's own: a new session
# saves to its own branch, never to an old one, without anyone editing this file.)
br=$(git rev-parse --abbrev-ref HEAD)
[ "$br" != HEAD ] || { echo "gitsave: no branch checked out"; exit 2; }
sid=${CLAUDE_CODE_REMOTE_SESSION_ID#cse_}
sess=${ENC_SESSION_URL:-https://claude.ai/code/session_${sid:-unknown}}
# (27 Nov 2026, Chad's R13: "Yes, keep it updated") every branch named in tools/mirror-branches.txt is brought up to
# this commit too, so a NEW session, made from the repository's default branch, starts from the latest work. Only ever
# a fast-forward: a branch that has moved on its own is never forced, it is reported.
mirror() {
  [ -f tools/mirror-branches.txt ] || return 0
  grep -v '^#' tools/mirror-branches.txt | while read -r m; do
    [ -n "$m" ] && [ "$m" != "$br" ] || continue
    ok=0; for i in 1 2; do if git push -q origin "HEAD:refs/heads/$m"; then ok=1; break; fi; sleep 4; done
    [ $ok = 1 ] || echo "gitsave: could not bring $m up to date (never forced: has it moved on its own?)"
  done
}
# (a path already staged as deleted, by git rm, is not added again: `git add` refuses it; the commit records it)
for p in "$@"; do if [ -e "$p" ] || git ls-files --error-unmatch -- "$p" >/dev/null 2>&1; then git add -A -- "$p" || exit 1; fi; done
git commit -q -m "$msg

Co-Authored-By: ${ENC_COAUTHOR:-Claude Opus 5.5} <noreply@anthropic.com>
Claude-Session: $sess" -- "$@" && { for i in 1 2 3 4; do git push -q -u origin "$br" && break; sleep $((i * 4)); done; mirror; git log --oneline -1; }
