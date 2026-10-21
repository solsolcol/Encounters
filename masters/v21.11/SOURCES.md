# v21.11 · sources for the medium's shrine

## The row of Taoist deities (`assets/taoistrow.glb`)

Chad's model, from his Drive folder `1x6DN1ik0OyWbuNbEWlxJZJ8iDBKHO1va`:
`taoist deities.glb`, file id `1vQWY5Fv4m24yQuUqTih-tpJfxfMoqfeo`, 94,093,152
bytes (fetched from `drive.usercontent.google.com/download?id=…&export=download&confirm=t`,
the size checked against Drive's). One mesh, 593,383 triangles, base colour
8192² JPEG, normal 4096² PNG, metal-roughness 4096² JPEG. Not kept in the repo
(94 MB); `make.sh` is the recipe from it.

## The two paintings (Wikimedia Commons, PUBLIC DOMAIN)

Each is the file's own bytes, fetched from upload.wikimedia.org, its sha1
checked against what the Commons API reports (`commons-*.json` is that answer,
kept). Neither is cropped, resized or retouched in the game.

| asset | Commons file | size | sha1 |
|---|---|---|---|
| `assets/painting_zhenwu.jpg` | [File:Xuantian_Shangdi_(Zhenwu),_god_of_the_North.jpg](https://commons.wikimedia.org/wiki/File:Xuantian_Shangdi_(Zhenwu),_god_of_the_North.jpg) | 1000 × 1365, 1,059,941 bytes | 28a852d1ef34bb5e10f4540b557c3f2877d79230 |
| `assets/painting_jadeemperor.jpg` | [File:Portraits_of_Jade_Emperor_and_the_Heavenly_Kings.JPG](https://commons.wikimedia.org/wiki/File:Portraits_of_Jade_Emperor_and_the_Heavenly_Kings.JPG) | 647 × 904, 526,145 bytes | 98a9a4f560335ac2e4f468b02b1d0fb0744228c6 |

Chad gave them as Wikipedia media links:
https://en.wikipedia.org/wiki/Xuanwu_(god)#/media/File:Xuantian_Shangdi_(Zhenwu),_god_of_the_North.jpg
and
https://en.wikipedia.org/wiki/Taoism#/media/File:Portraits_of_Jade_Emperor_and_the_Heavenly_Kings.JPG

What Commons says of them:
- **Xuantian Shangdi (Zhenwu), god of the North** — early 15th century (Ming).
  "This painting depicts the Daoist deity Zhenwu (Perfected Warrior) as
  Xuantian Shangdi (Supreme Emperor of the Dark Heaven). The deity is shown
  seated on a rock throne in the clouds surrounded by attendants and divine
  marshals." Credit: Herbert F. Johnson Museum of Art, Ithaca. Public domain.
- **Portraits of Jade Emperor and the Heavenly Kings** — anonymous, unknown
  date; "Chinese painting … Ink and color on silk". Credit: Sotheby's. Public
  domain.

Attribution is not required for either; both are credited in the game's
credits panel anyway (Chad: "Credit it too").
