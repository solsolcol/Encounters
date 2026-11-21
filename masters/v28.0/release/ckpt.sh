#!/bin/sh
# checkpoint the helpers' in-flight files (never a secret: .env, *secret*, *credential*, a file named key, *.pem; never his photographs)
cd /home/user/Encounters || exit 2
paths=$(git status --porcelain | awk '{print $NF}' | grep -Ev '/_tmp/|^masters/v28\.0/ref/|(^|/)\.env|secret|credential|(^|/)key$|\.pem$')
[ -n "$paths" ] && sh tools/gitsave.sh "${1:-v28.0 (E4C5): checkpoint of the helpers' work in flight}" $paths 2>&1 | tail -1
echo "left: $(git status --porcelain | wc -l)"
