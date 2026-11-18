# v27.0 · the pictures in her flat (episode 4 chapter 4)

## Her altar's three pictures (Wellcome Collection, Public Domain Mark)

Each is the holder's own image at a size its IIIF server serves (`/full/,1024/0/default.jpg`: 1024 pixels tall, its own
aspect), whole: never cropped, resized here or retouched (v21.11). One request at a time, a pause between (18 Nov 2026).
The full-size files are in the research record (docs/research/V27.0-KALI.md; the scratchpad's `e4c4/refs/deities`).

| asset | the work | image | served at | bytes | sha1 |
|---|---|---|---|---|---|
| `assets/w4t_kali.jpg` | *Kali trampling Shiva. Chromolithograph by R. Varma.* https://wellcomecollection.org/works/d8rycze2 (ref. 26616i) | V0045118 | 736 x 1024 | 311,588 | 258ee7f3464664ef0329de2e7bfa843faefe297d |
| `assets/w4t_ganesha.jpg` | *Ganesha. Chromolithograph.* https://wellcomecollection.org/works/nekd64ff (ref. 25930i) | V0044933 | 763 x 1024 | 460,931 | 71dac8d965bdede4cae4839deb2f6c0336c31072 |
| `assets/w4t_murugan.jpg` | *Kartikeya, also called Murugan, Hindu god of war, standing in front of a peacock and holding a spear. Gouache painting by an Indian artist.* https://wellcomecollection.org/works/g3n5777h (ref. 581066i; gouache on mica, 1800s) | V0046230 | 724 x 1024 | 267,150 | c6746b5b63822ade9ba340ae94f1096b114e9c0d |

Licence, as each page words it: "Public Domain Mark. You can use this work for any purpose without restriction under
copyright law." Credits: the panel's rows `credits.kali`, `credits.ganesha`, `credits.murugan` (src/strings.js).
Lettering: the Kali print carries only its artist's signature, "Ravi Varma", at its lower left; the other two carry none
(no press, no dealer: the v9.3 rule on real businesses' names). The Murugan is a museum's photograph of a painting on
mica: its grey backdrop, its flaking top corners and a strip of tape show, whole, as the mount of an old picture.
Refused: The Met's Murugan with his consorts (its printed dealer's and press's names, and it cannot be cropped); The
Met's Ganesha with his consorts (in Tamil tradition Pillaiyar is held unmarried).

## Appa's photograph (the game's own people)

`assets/w4t_appa.jpg` (768 x 1024, sha1 1c032e3b2ee315192c3958fc2e5a3b5acebd0afe): rendered from his own full model
(masters/v27.0/src/rigged-appa.glb, the generator's every triangle, never shipped) by tools/portrait.mjs, head and
shoulders on a studio backdrop, lit from the upper left, aged a little (sepia 0.35, softness 0.6 px, a vignette):

    node tools/portrait.mjs masters/v27.0/src/rigged-appa.glb assets/w4t_appa.jpg 768 1024 '{"frame":0.40,"down":0.0}'
