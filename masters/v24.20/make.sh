#!/bin/bash
# v24.20–v24.21 — episode 4 chapter 1's vehicles, its Phra Rahu, the charms' icons and the taxi's seats. Chad, 30 Oct
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
#      seat.jpg    a modern Asian taxi's front seat from the rear left (black woven centre, leatherette bolsters, the back
#                  panel's map pocket, chrome headrest posts, the rails)
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
#      seat   (auto)         "black woven fabric seat centre panels, black leatherette bolsters and sides, a hard black
#                             plastic back panel with a fabric map pocket, chrome headrest posts, black metal seat rails"
#    then its REMESH (POST /openapi/v1/remesh {input_task_id, target_formats [glb], topology triangle,
#    target_polycount}): pickup, sedan, suv 30,000; moto 20,000; rahu2 40,000; seat 15,000.
#
# 3. PREPARED (tools/prepmeshy.mjs: baked, turned, sized, the footprint centred, JPEG sheets, meshopt; each one
#    photographed on its own with tools/shootmodel.mjs to settle its facing — a car's nose at -z, as the yard's cars):
M=${M:-/tmp/meshy}        # where the remeshed files were downloaded (remeshed-<name>.glb)
# (v24.26, Chad: "Why are the cars and trees so low res and compressed, and looks like it has missing textures or
#  something?") the three cars he walks past keep Meshy's 2048 base colour and normal: at 1024 the normal crumpled the
#  hood and the glass and the base colour smeared the lamps (each map shrunk alone, photographed); the metal-roughness at
#  1024 is identical on screen (PXMR). +4.9 MB. The motorbike stays at 1024 (247 texels a metre: sharp where he stands).
ERR=0.003 PXMR=1024 node tools/prepmeshy.mjs $M/remeshed-pickup.glb assets/e4truck.glb 5.3 l 1 -90 2048
ERR=0.003 PXMR=1024 node tools/prepmeshy.mjs $M/remeshed-sedan.glb assets/e4sedan.glb 4.4 l 1 -90 2048
ERR=0.003 PXMR=1024 node tools/prepmeshy.mjs $M/remeshed-suv.glb assets/e4suv.glb 4.8 l 1 -90 2048
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-moto.glb assets/e4moto.glb 1.92 l 1 90 1024
ERR=0.003 node tools/prepmeshy.mjs $M/remeshed-rahu2.glb assets/e4rahu.glb 0.2 h 1 0 1024
# (v24.21) the taxi's front seat: 1.08 m from its rails to its headrest, turned to face -z (the road)
ERR=0.004 node tools/prepmeshy.mjs $M/remeshed-seat.glb assets/e4seat.glb 1.08 h 0.6 180 1024
#
# 4. THE ICONS (icons/): the three charms' inventory pictures in the style of Chad's own torch and amulet icons
#    (`icontorch`, `iconamulet`): a GPT Image picture with his two icons as the STYLE references beside the charm's own
#    render — a near-black, grungy, scratched tile with a worn darker edge, the object large, photo-real and lit hard
#    from the upper left. The game's are 384 px JPEG (q 88), made from the 2k originals; the masters kept here are
#    1024 px (icons/*-1k.jpg), and remaking from them gives the same pictures to within JPEG noise (at most 25/255):
for n in iconnangkwak icontakrut iconphayant; do
  python3 -c "from PIL import Image; Image.open('masters/v24.20/icons/$n-1k.jpg').convert('RGB').resize((384, 384), Image.LANCZOS).save('assets/$n.jpg', quality=88, optimize=True)"
done

# (v24.26) THE SOURCES, KEPT: Meshy keeps a job's files for THREE DAYS, so the files this recipe reads are kept in
# masters/v24.20/src (gitignored): original-<name>.glb and remeshed-<name>.glb. Re-downloaded 1 Nov 2026 (the session's
# scratch copy had been deleted to free disk — a mistake, recovered in time), each matched to the asset it made by its exact
# triangle count; remeshed-sedan.glb re-prepped with the line above gives e4sedan.glb byte for byte:
#   pickup  image-to-3d 01a18e47-3325-76b8-9ee0-ac789f6fca9a  remesh 01a18e4b-be00-7754-8547-de5f75751774 (29,838 triangles)
#   sedan   image-to-3d 01a18e47-429a-77f6-b559-38cc7d7b8e71  remesh 01a18e4a-3e66-7411-b745-053ac8f62985 (30,502)
#   suv     image-to-3d 01a18e47-5601-7280-816c-c3b1ca18bebd  remesh 01a18e4a-403d-72c1-9af8-6067bbb35639 (30,363)
#   moto    image-to-3d 01a18e47-6930-7532-8b79-171a2df1c111  remesh 01a18e4b-c0d9-729b-a352-a1ef6dd0ed87 (19,529)
#   rahu2   image-to-3d 01a18e46-8586-71fd-ad91-28829054beb2  remesh 01a18e4a-3be5-7640-af0b-6942b3c4f950 (41,565)
#   seat    image-to-3d 01a18e4e-9599-7186-a00b-1603ff9e83b7  remesh 01a18e6c-97bf-70c4-9138-671a35e502de (14,864; 9,061 after prep)
# Run with M=masters/v24.20/src.
