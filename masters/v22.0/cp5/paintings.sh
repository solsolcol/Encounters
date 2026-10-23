#!/bin/sh
# v22.0 CP5b · THE YIN SHOP'S PAINTINGS (docs/V22.0-E3C4-PLAN.md §12.1, notes 1 and 5): no wall of photographs of
# people — "Usually it is female ghosts, sometimes the portraits look like demons" — and the demons are PHRA NGAN
# ("you should generate something that looks like a phra ngan"), not a wrathful deity. Generated on the CP5 flow
# (sessions.json: img_nak, img_tani, img_ngan, img_ngan2), picked by eye:
#   img_ngan_a   Phra Ngan seated on his red cloth: the crooked pointed crown, the red eyes, the sly smile, and at his
#                feet the whiskey, the cigarettes, the photographs of women, two candles (2:3, 1024 x 1536)
#   img_ngan2_c  Phra Ngan close, candle-lit from below (3:4, 768 x 1024)
#   img_nak_b    Mae Nak in the doorway of her stilt house, pale, the mist at her feet (16:9; her figure cut 2:3)
#   img_tani_d   Nang Tani at her banana tree under the moon (16:9; her figure cut 2:3)
# (img_demon a-d — crowned yak guardians — are NOT used: Chad, "this looks more like a real wrathful deity".)
# The four sources are kept here as JPEG (q2) copies of the generated PNGs — *.png is ignored by the repo.
# One atlas, so the shop downloads one picture: row 0 the two Phra Ngan, row 1 the two ghosts, each 768 px tall.
#   ngan   0..512    x 0..768        ngan2  512..1088 x 0..768
#   nak    0..512    x 768..1536     tani   512..1024 x 768..1536
set -e
cd "$(dirname "$0")"
ffmpeg -v error -y -i raw/img_ngan_a.jpg -i raw/img_ngan2_c.jpg -i raw/img_nak_b.jpg -i raw/img_tani_d.jpg -filter_complex "\
[0]scale=512:768:flags=lanczos[a];\
[1]scale=576:768:flags=lanczos[b];\
[2]crop=480:720:506:0,scale=512:768:flags=lanczos[c];\
[3]crop=480:720:347:0,scale=512:768:flags=lanczos[d];\
color=c=black:s=1088x1536[bg];\
[bg][a]overlay=0:0[t1];[t1][b]overlay=512:0[t2];[t2][c]overlay=0:768[t3];[t3][d]overlay=512:768,format=yuvj420p[o]" \
  -map "[o]" -frames:v 1 -q:v 3 -map_metadata -1 ../../../assets/yinptg.jpg
echo "assets/yinptg.jpg $(stat -c %s ../../../assets/yinptg.jpg) bytes"
