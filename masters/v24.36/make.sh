#!/bin/bash
# v24.36 · THE SAMNAK'S CABINETS, their yin pieces modelled from photographs of real ones (Chad, 2 Nov 2026: "in the
# ajahn samnak, the amulet display shelf can have real amulets instead of generated ones, but it should look more like
# the yin, barang, ghost based kind of amulets. But base the model generation off real yin amulets when you generate more
# models."). The research, every name and source: docs/research/V24.36-YIN-STOCK.md.
#
# 1. REAL PHOTOGRAPHS first (six researchers at once; the dealers' photographs reference only, never shipped), then a
#    REFERENCE PICTURE on white from them (Higgsfield, gpt_image_2_5, quality high, 2k, opaque; the photographs as its
#    image_references), LOOKED AT against them — refs/<name>.jpg (1024; the 2k originals beside them, refs/*-2k.png):
#      kuman      the classic seated Kuman Thong, palms joined, topknot, worn gilt over dark lacquer, red oval base
#      ngang      the old Phra Ngang Ta Daeng: copper, red glass eyes, bent ringed topknot, triangle-cut block base (the
#                 first try's photographs were modern variants — gold, skulls — and were replaced by the Penn Museum's
#                 and a collector's classic pieces before any picture was made)
#      phraioil   a nam man phrai phial: golden oil, a cord-bound takrut and a carved figure inside, saffron cloth tied
#                 with red cord over the cap
#      phraitab   a Mae Hong Phrai powder tablet: brown-ochre, a woman cradling a baby in relief, oval
#      tani       a painted Nang Tani: green sabai and pha sin, a flower in her hair, bananas, a stump base
#      praicase   (deploy 3, for the shelves' diversity) a black oil-soaked phrai tablet of a crouching figure in a clear
#                 case with a gold rim (two Mae Hong Phrai photographs were refused by the picture service as unsafe; this
#                 cased black tablet and the next stood in their place)
#      tanitab    (deploy 3) a pale sage-green powder tablet of Nang Tani standing, worn relief, a rounded-arch top
#    (Hun Phayon was planned and dropped: no usable photographs when the research was stopped.)
# 2. MESHY image-to-3D at its best settings and its remesh — masters/v24.36/meshy.py runs every job at once (the key
#    lives OUTSIDE the repo, /root/.config/meshy/key) and writes src/original-<name>.glb and src/remeshed-<name>.glb the
#    moment each exists (gitignored; Meshy keeps a job's files three days). The jobs (jobs-*.json has each texture
#    prompt and remesh target; the runs' logs are meshy-*.log) and their IDs (image-to-3d, then its remesh; the first five
#    read back from Meshy's own task list, as the runs wrote over each other's src/jobs-done.json):
#      kuman      01a19d24-c890-7195-ac10-693ed5b21d2a   01a19d27-aee0-7761-b8fc-e3c35c400780   (remesh 4000)
#      ngang      01a19d27-7768-7155-bca5-46ecdda3357b   01a19d2b-1c55-7379-a3c4-540e85c995ff   (remesh 4000)
#      tani       01a19d27-4782-73a6-8281-a54ade581daf   01a19d2a-92a8-74fb-b872-5ff6063fd0a8   (remesh 4000)
#      phraitab   01a19d27-3303-777e-88cd-ac90b629a10b   01a19d2a-843c-7454-ab1b-5c7e1f03b48d   (remesh 2000)
#      phraioil   01a19d27-23a5-73a0-81d8-ce10bac7c066   01a19d2a-79d4-73a6-8fbd-b2167fbdcba8   (remesh 3000)
#      praicase   01a19d57-7785-7203-a8a1-6277db8e219e   01a19d5a-04bd-74a7-9727-623626bb2135   (remesh 2000)
#      tanitab    01a19d57-a3da-74bd-b0e6-1584ff5cbe3e   01a19d5a-0ae1-707a-a34e-61287d1cf53e   (remesh 2000)
# 3. PREPARED (tools/prepmeshy.mjs: baked, sized in metres on the named axis, the footprint centred, JPEG sheets at
#    512 — a piece a few centimetres tall, as the shop's stock, masters/v24.22/make.sh — meshopt), then NEAR AND FAR in
#    one file as the shop's stock: a statue's far level a permissive cut over the same vertices (tools/lodpair.mjs), the
#    tablet's its own front baked flat (tools/planarfar.mjs). Each photographed on its own (tools/shootmodel.mjs) before
#    it is wired in: every face at +z.
set -e
cd "$(dirname "$0")/../.."
M=masters/v24.36/src
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-kuman.glb    assets/e4kuman.glb    0.085 h 0.5 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-ngang.glb    assets/e4ngang.glb    0.08  h 0.5 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-tani.glb     assets/e4tani.glb     0.085 h 0.5 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-phraioil.glb assets/e4phraioil.glb 0.05  h 0.5 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-phraitab.glb assets/e4phraitab.glb 0.045 h 0.5 0 512
for spec in e4kuman:500 e4ngang:500 e4tani:500 e4phraioil:400; do k=${spec%%:*}; n=${spec##*:}
  MODE=permissive UVW=2 ERR=0.05 node tools/lodpair.mjs assets/$k.glb /tmp/$k-lod.glb $n $k && mv /tmp/$k-lod.glb assets/$k.glb; done
node tools/planarfar.mjs assets/e4phraitab.glb /tmp/e4phraitab-lod.glb 300 e4phraitab 256 && mv /tmp/e4phraitab-lod.glb assets/e4phraitab.glb
# deploy 3: two more tablet kinds, so no shelf repeats one round shape (Chad: "Why so many rounded amulets?")
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-praicase.glb assets/e4praicase.glb 0.045 h 0.5 0 512
ERR=0.01 node tools/prepmeshy.mjs $M/remeshed-tanitab.glb  assets/e4tanitab.glb  0.055 h 0.5 0 512
for k in e4praicase e4tanitab; do node tools/planarfar.mjs assets/$k.glb /tmp/$k-lod.glb 300 $k 256 && mv /tmp/$k-lod.glb assets/$k.glb; done
