#!/bin/sh
# buildlock.sh <snapshot-dir>   (v28.0) ONE build at a time on this machine (several helpers build), then a hard-linked
# snapshot of dist/ for the caller's own tests: run every harness and probe with ENC_DIST=<snapshot-dir> (testlib serves
# it; v21.13), because the next helper's build deletes and rewrites dist/ itself.
# This is a working build (no zip; assets hard-linked). A RELEASE build for a deploy is made WITHOUT ENC_DISTLINK, so
# that an asset written in place later can never change a file Netlify serves under its old content-hashed name.
snap=$1; [ -n "$snap" ] || { echo "buildlock: give a snapshot directory"; exit 2; }
exec 7>/tmp/encounters-build.lock; flock 7
cd "$(dirname "$0")/.." || exit 2
ENC_NOZIP=1 ENC_DISTLINK=1 npm run build || exit $?
rm -rf "$snap" && cp -al dist "$snap" && echo "buildlock: built; snapshot at $snap"
