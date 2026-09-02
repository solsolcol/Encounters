#!/bin/bash
# usage: dl.sh id url  — fetch one master, record it in progress.json with its length
id="$1"; url="$2"; out="masters/v5.18/$id.mp3"
curl -sS -o "$out" "$url" || { echo "FAIL $id"; exit 1; }
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")
node -e "
const fs=require('fs');const p=JSON.parse(fs.readFileSync('masters/v5.18/progress.json'));
const l=p.lines.find(l=>l.id==='$id');l.status='done';l.secsNew=+(+'$d').toFixed(2);
fs.writeFileSync('masters/v5.18/progress.json',JSON.stringify(p,null,1));"
echo "$id $d s $(stat -c %s $out) B"
