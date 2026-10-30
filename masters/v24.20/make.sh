#!/bin/bash
# v24.20 — episode 4 chapter 1's vehicles, its Phra Rahu and the charms' icons. Chad, 30 Oct
# 2026 (verbatim): "Why are there still ugly generated trucks, replace all of them with real truck models. Also your
# icon styles dont even look like my torch icons. Also your rahu dont even look like the real thing. When you generate
# such statues or even amulets, you must always research real images first and base it off real image references."
# His workflow, as in masters/v24.19/make.sh: a GPT Image reference on white (Higgsfield, gpt_image_2_5, quality max,
# 2k, opaque background), LOOKED AT, then Meshy's image-to-3D at its best settings and its remesh.
#
# 1. THE REFERENCES (refs/, each at 1024 px; the 2k originals stayed on Higgsfield):
#      pickup.jpg  a white Thai double-cab pickup with red laterite dust to its sills (the yard's truck, e4truck)
#      sedan.jpg   a silver four-door sedan;  suv.jpg  a dark grey SUV with roof rails;  moto.jpg  an underbone with a
#                  front basket — every one a generic design, no badge, no plate, three-quarter, on white
#      rahu-a.jpg, rahu-b.jpg  the Phra Rahu (Rahu Om Chan: a bust rising from white clouds on a round base, jet-black
#                  lacquer, the gold crown, eye rims, jewellery and the moon in his hands) — made FROM PHOTOGRAPHS of real
#                  ones, given to the generator as its image references: Wat Si Sa Thong's great black Rahu holding its
#                  golden moon, and two altar Rahus from dealers' catalogues; a is used
#
# 2. MESHY IMAGE-TO-3D (the key lives OUTSIDE the repo, /root/.config/meshy/key — never in a file here):
#    POST /openapi/v1/image-to-3d {image_url, ai_model latest, topology triangle, target_polycount 300000,
#    should_remesh true, should_texture true, enable_pbr true, symmetry_mode, texture_prompt}:
#      pickup (symmetry on)  "white paint with red laterite dust on the sills and wheel arches, black plastic trims and
#                             side steps, dark tinted glass, black tyres, silver alloy wheels, chrome door handles, black
#                             bed liner"
#      sedan  (on)           "metallic silver paint, dark tinted glass, black grille, clear headlamps, black tyres, silver
#                             alloy wheels"
#      suv    (on)           "dark grey metallic paint, dark tinted glass, black grille with a little chrome, black tyres,
#                             silver alloy wheels, black side steps and roof rails"
#      moto   (auto)         "glossy red and black plastic body panels, black seat, chrome exhaust, silver spoked rims,
#                             black tyres, black wire basket, black mirrors"
#      rahu2  (on)           "glossy jet-black lacquer body and face, bright gold leaf on the crown, the eye rims, brows
#                             and moustache, the ear ornaments, the collar, the armlets and the moon, white teeth and fangs,
#                             white glazed clouds, a black base"
#    then its REMESH (POST /openapi/v1/remesh {input_task_id, target_formats [glb], topology triangle,
#    target_polycount}): pickup, sedan, suv 30,000; moto 20,000; rahu2 40,000.
#
# 3. PREPARED (tools/prepmeshy.mjs: baked, turned, sized, the footprint centred, JPEG sheets, meshopt; each one
#    photographed on its own with tools/shootmodel.mjs to settle its facing — a car's nose at -z, as the yard's cars):
M=${M:-/tmp/meshy}        # where the remeshed files were downloaded (remeshed-<name>.glb)
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-pickup.glb assets/e4truck.glb 5.3 l 1 -90 1024
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-sedan.glb assets/e4sedan.glb 4.4 l 1 -90 1024
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-suv.glb assets/e4suv.glb 4.8 l 1 -90 1024
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-moto.glb assets/e4moto.glb 1.92 l 1 90 1024
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-rahu2.glb assets/e4rahu.glb 0.2 h 1 0 1024
#
# 4. THE ICONS (icons/): the three charms' inventory pictures in the style of Chad's own torch and amulet icons
#    (`icontorch`, `iconamulet`): a GPT Image picture with his two icons as the STYLE references beside the charm's own
#    render — a near-black, grungy, scratched tile with a worn darker edge, the object large, photo-real and lit hard
#    from the upper left. The game's are 384 px JPEG (q 88), made from the 2k originals; the masters kept here are
#    1024 px (icons/*-1k.jpg), and remaking from them gives the same pictures to within JPEG noise (at most 25/255):
for n in iconnangkwak icontakrut iconphayant; do
  python3 -c "from PIL import Image; Image.open('masters/v24.20/icons/$n-1k.jpg').convert('RGB').resize((384, 384), Image.LANCZOS).save('assets/$n.jpg', quality=88, optimize=True)"
done
