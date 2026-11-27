# v29.0 · Episode 5 chapter 1 · the cast's RECORD (helper CAST, 27 Nov 2026)

Grace and Marcus (plan §6), each made ONCE (v28.0: a generated model, a rig or a remesh is never sent a second time
without Chad's yes; a fault is written here with its pictures and the price of another, and put to him). The prompts are
people/PROMPTS.txt; every Meshy id is in masters/v29.0/src/people/jobs.json (written by people/meshy.py the moment a job
exists; committed); the pictures are on the working machine only (masters/v29.0/src/people/refs and shots, ignored by
git): pictures of generated people are not committed.

## 0 · The services, read before each spend (27 Nov 2026)
- Higgsfield 28.16 before; a reference at gpt_image_2_6 xhigh/2k/2:3 priced 3.5 by estimate_image_cost (no image
  reference). Two pictures: 7.0. After: 21.16.
- Meshy 1,077 before (all permanent); the cast's allowance 150 (THINGS spends the rest beside it).

## 1 · The reference pictures (CP3.1, CP3.2), LOOKED AT full size, the face and each hand enlarged
| who | Higgsfield job | file (scratch) | what was checked |
|---|---|---|---|
| Grace | d2f8306d-35dd-490f-bf1d-bb4dec77c566 | src/people/refs/grace-a-2k.png (1360 x 2048) | a clean A pose, clear white between each arm and her side; both palms to the lens, five fingers each, every gap open, none doubled; tired eyes looking ahead, dark circles, mouth closed; the messy low bun (a few loose strands at the temples); pale blue blouse tucked into charcoal slacks; the oatmeal cardigan open, its two edges straight and ending at the hip; black flats. PASS |
| Marcus | 995fa7b8-9a02-4b6c-bd71-9fed1b7cdbc6 | src/people/refs/marcus-a-2k.png (1360 x 2048) | the A pose with the elbows a little bent, clear white between arms and body; both palms to the lens, five fingers each, gaps open; thin wire glasses (black rims, metal arms), the brows a little drawn together (worried), eyes ahead, mouth closed; light grey shirt, sleeves rolled to the forearm (more than "once"), a chest pocket, the black belt with a plain buckle, navy trousers, black lace-up shoes. PASS |
Risks said before Meshy: thin wire glasses are the hardest thing for a generator (they may come back thick, fused to
the face or broken); Grace's loose strands will come back as painted hair, not strands. Shoes: the coordinator's brief
(her flats, his office shoes); in her flat a Singapore household leaves shoes at the landing (plan §9.1 has her shoes
by the door), so a shot inside may want them unseen (a film's framing, not a model).

## 2 · What was made (CP3.3 to CP3.5), every Meshy job once
| key | who | triangles | joints | sheet | Meshy ids |
|---|---|---|---|---|---|
| `p51grace` / `p51graceh` | Grace, 1.60 m | 40,759 near / 309,962 full | 66 (every finger) | 2048 / 2048 | model 01a21b41-9f9c-741d-95c7-2efb1f87b269, rig 01a21b46-ee2e-75d2-9e10-bf6fa8c4df05, remesh 40000 01a21b4a-20a8-7790-99be-b48788fc825f, motions laid gsofa 01a21b4a-7f17-7336-bcf9-f063e8033321, gcry 01a21b4a-7df3-775d-861e-ed75020eff75 |
| `p51marcus` / `p51marcush` | Marcus, 1.72 m | 41,415 near / 313,658 full | 52 as made, MENDED to 26 (no finger bones: §3) | 2048 / 2048 | model 01a21b41-aa59-70ea-8027-fd7e692f4a45, rig 01a21b46-ee2e-71e3-a7cb-fc5484eeecc8, remesh 40000 01a21b4f-062a-75d0-8076-dcaa83088d0b, motion laid mknock 01a21b4a-7de7-7687-957d-e7d9664894db |
Text-to-motion clips (skeleton-free, people/MOTIONS.txt): gsofa 01a21b45-8035-75a3-b710-bbe6a8c4f361, gcry
01a21b45-804a-7581-83c4-c7b31364d7fa, mknock 01a21b45-80e1-7056-a6cf-76fbd90fc14c. **And one WASTED: `kept`
01a21b45-8195-733f-bd6b-73fd5a230efc, 10 credits, my own slip** (my script read a line of MOTIONS.txt's header as a clip
and sent it before I saw it; stopped locally, but the job was already made; never laid on a rig, never used).

MESHY, the cast's spend: models 80, rigs 10, remeshes 10, text-to-motion 40 (30 used, 10 wasted), laying the three on
the rigs 9: **149 of the 150 allowed**. The balance read from Meshy itself after: 188 (the things' helper spends beside
it; the floor is 60). HIGGSFIELD: 7 (two references at 3.5).

The prep (people/people.sh; BPY the scratch Blender venv): NOTHIN, REPAINT (FACE 3, HEADK 2, HANDK 1.5), FINS, WSMOOTH=0,
XSCALE=1000, MENDOUT 12, the full body repainted too. Texels a metre, face / head / hands / body:
- Grace near 2,240 / 1,704 / 1,212 / 828 (147 fins out); full, first laid out with the head at twice its share, 1,398 /
  1,075 / 756 / 514: HER HAIR IS HALF HER TRIANGLES (149,532 of 309,962), so it took the sheet and the close body's face
  came out blurrier than the far one's. Laid out again with the head at its own share (people.sh PHEADK=1 on the full
  level, the default since): **2,033 / 993 / 1,186 / 800**. (src/people/grace-people-first.log keeps the first run.)
- Marcus near 2,225 / 1,709 / 1,178 / 843; full (head at its own share) 2,312 / 1,128 / 1,271 / 886.

## 3 · MARCUS'S RIG came back WRONG (the collector's fault, exactly), mended here at no credits
Rig 01a21b46-ee2e-71e3-a7cb-fc5484eeecc8, include_fingers asked: **52 joints where a rig with fingers has 66**, the
collector's skeleton bone for bone (Bone_002 to Bone_044; one middle-finger chain each hand, no thumb, no other finger).
Measured on his file (scratch bonepos.mjs: each bone's rest place and the box of the points it holds most): the stray
bones are the collector's but on the OTHER side (his Bone_029/028/027 stand at his left shoulder, arm and forearm, the
collector's at the right), so his map is his own: people/rigmend-marcus.json. tools/rigmend.mjs: 52 joints -> 26, every
point's four shares summing to one within 4.5e-8; the same map laid on his near body (riglod gave it the 52 too).
WHAT IT LEAVES: each hand ONE RIGID PIECE. His fingers never close (the knock is an open hand; a hand on Grace's
shoulder lies flat). His options, as the collector's were (Chad's to pick; the default stands as built):
| | gives | cost |
|---|---|---|
| A · rig him once more at Meshy | most likely the same 52 (the collector's and Master Zavier's third came back the same twice) | 5 Meshy |
| B · as built: mended here | the takes play cleanly, rigid hands | 0 (done) |
| D · rigged here in Blender from Grace's 66-joint skeleton | fingers that bend; unproved weighting, checked joint by joint | 0 credits, about half a day |
| E · another body from the same reference | a new throw of face and clothes, a rig that may or may not have fingers | about 55 Meshy |

## 4 · The takes, and each one measured as a motion (tools/probes/takefk.mjs on the takes files; photographs front and side)
Grace (people/retakes.sh: every source a Meshy rig with finger bones, retargeted `same --hips --align --noalign=neck,Head`):
| act (plan §8, §9) | take | from | measured / seen |
|---|---|---|---|
| sitting on the sofa, restless, twisting the strap | `gsofa` (7.97 s) | written for her | head 0.23 m of travel, hips 0.11; the hands in the lap, fingers working. AT 0.6 HER RIGHT FOREARM GOES BEHIND / INTO HER RIGHT HIP (front picture); 0.1 is clean |
| a long breath out, then crying, hands over her face | `gcry` (9.97 s) | written for her | 0 to about 2 s an upright sit, hands on the knees (her RIGHT HAND'S FINGERS SINK INTO HER THIGH, front, 0.15; her knees press into each other); by 0.7 she is folded right down, forehead to her knees, arms round her head, the cardigan crumpled into a sack and torn white at the stomach: FAR MORE than "cries quietly, hands over her face". Cast only its early window, the rest laid in code, or another clip (13 credits) |
| sitting still, hands in her lap | `wsit` (7.97 s) | Amma (a wheelchair sit) | head 0.06 m; she leans back 27 cm behind her hips (a wheelchair's recline): a sofa's back must take it |
| standing up / sitting again | `rise` (4.97 s; sitting again is it played backward) | Amma | head 1.21 m, hips 0.60 (the rise itself); arms out on armrests mid-rise |
| holding out the packet and letting it go; turning her phone face down | `palmover` (5.97 s) | the seated hermit | head 0.54 m; at 0.5 a deep forward lean looking down, the right hand low, the left on the hip: a reach DOWN, not across a table to Pho's hand. Usable for the phone; the packet wants its window measured in the shot |
| seated talk ("Come in", "Thank you") | `Sitting_Answering_Questions` (9.67 s) | the seated hermit | head 0.41 m |
| walking to the door / standing at it / listening | `Walking`, `Idle_3`, `Listening_Gesture` | Mala (a woman's, already brought in) | walk head 0.27 m, the leading hand palm forward with the fingers spread (the class Master Zavier's walk has); Idle_3 head 0.33; Listening 0.69 m of head travel (a library sway: cast only its quiet window) |
| saying thank you (a nod) | NOT MADE | — | a small head dip laid in code over a seated take, or library Agree_Gesture (25) at 3 credits (not bought: the allowance) |
Marcus (on his mended rig; Jun's raw library file calmed at prep, 7 degrees):
| act | take | from | measured / seen |
|---|---|---|---|
| waiting, standing | `Idle_3` | Jun's library | head 0.36 m |
| nodding | `Listening_Gesture` | Jun's library | head 0.80 m of travel: a sway with nods; cast its quiet window |
| talking | `Stand_and_Chat`, `Talk_with_Hands_Open` | Jun's, Mr Koh's | the talk holds both arms well out from his sides (NOT calmed: the talk was left out of CALM, as Mr Koh's was) |
| walking | `Walking` | his rig's own | head 0.32 m |
| knocking | `mknock` (3.97 s) | written for him | THE KNOCK IS ABOVE HIS HEAD: his right hand rises to 1.65 m, 0.37 m in front, from 0.9 to 2.0 s, his head tipped to his left (the clip as generated, the same on his rig as made). Its rising and falling windows (0.4 to 0.6 s, 2.3 to 2.6 s) pass 1.4 to 1.5 m, a door's knocking height for him. Another clip 13 credits |
| climbing the stair | NOT MADE | — | library Climb_Stairs (441), 3 credits a rig: not bought (the allowance). Grandmaster Pho has no climb either (§6): the opening's stair shot needs a walk on a rising path for both, or 6 credits |
| sitting on a chair | `Chair_Sit_Idle_M`, `Sitting_Answering_Questions` | the seated hermit | Chair_Sit_Idle_M is upright only at its ends (v26.0's lesson: its middle leans the chin onto a fist) |
| kneeling beside her | `kneelhold` (5.97 s) | Ravi (chapter 4: on one knee by a chair, taking a hand) | hips 0.39 m over the floor; both hands raised palm up at 0.7 |

## 5 · What is wrong with each, seen at full size (scratch e5c1/cast/<name>/: n-* near, h-* full, hc-/nc- close, t/ takes)
**Grace**
- Her hair: the bun and the loose strands came back as ribbons: shredded black strips at the temples and the nape, some
  painted skin pink on their undersides near the ears, white specks on the crown, and a GLOSSY wet shine from behind.
- Her face: the nostrils' rims raw red; the lower face full, the lips pursed (it reads sulky more than tired); a faint tone
  seam down the right cheek (near body).
- A ragged pale edge where the cardigan's front edges meet the blouse; a white fringe on both slacks' hems; each shoe's
  vamp a pale shard of skin colour and its opening ragged.
- In the takes: gsofa's right forearm into her hip (0.6); gcry's fold-over and its right fingers into her thigh (§4).
- At 2.2 m on a phone's frame (n--phone22) none of it but the hair's ragged outline can be made out.
**Marcus**
- HIS GLASSES came back thick and BEIGE (the reference's were thin and black), fused to the face, with a white shard
  across the left lens and the arms painted on his temples; HIS EYES look a little UP.
- His cheeks and lips puffed (the mouth reads as holding a breath), clearer in the takes.
- His HANDS: one rigid piece each (§3); in the bind pose the fingers come together edge on.
- The shirt's open neck: a dotted grey fringe and a skin-coloured patch inside the collar; a pale hairline shard at the
  hair's right front.
- In the takes: the knock above his head (§4); the talk's arms held out.
- At 2.2 m on a phone's frame (n--phone22) he reads as made; the glasses' colour is seen.
**Not measured here** (they read a chapter, not a file: owed when PLAY or FILMS casts them, the coordinator's CP9.3):
jointscan, feetscan, headturn, clipscan on the bodies in place. Measured: fingerskin on Grace (every fingertip carried by
its own end bone, both hands; nothing sticks out); takefk on every take (§4).
**The price of another**: a body 55 Meshy (model 40, rig 5, remesh 5, laying motions 5 to 9) and a reference 3.5
Higgsfield; a clip 13 Meshy. NOTHING was regenerated: each is Chad's to pick (keep, mend here, or pay).

## 6 · GRANDMASTER PHO'S TAKES (his chapter 5 body, assets/p5pho.glb, read from the file; nothing made, pho.glb untouched)
His takes: Running, Walking, Charged_Spell_Cast, Charged_Spell_Cast_1, Right_Hand_Sword_Slash, Sit_Cheer_with_Left_Hand,
Sit_Cross_Legged_on_Floor, Sit_Shout_Hands_on_Mouth, Sit_to_Stand_Transition_M, Sitting_Answering_Questions,
Talk_with_Hands_Open, Talk_with_Left_Hand_on_Hip, mage_soell_cast, _3 to _8. (Chapter 5 seats him cross-legged with
`pho`, chapters 3 and 4's body, on Sit_to_Stand_Transition_M's first moment with the CROSS numbers: c_cast.js `cast.phoS`.)
| the plan's act | covered by |
|---|---|
| kneel (sit) at a low table | PARTLY: seated cross-legged (Sit_to_Stand's start + CROSS, as chapter 5), Sit_Cross_Legged_on_Floor; NO kneel |
| chant | PARTLY: the seated rest and Sitting_Answering_Questions (a talk); no chant of its own |
| flick water with his fan | MISSING (Sit_Cheer_with_Left_Hand is a seated toss of the left hand, chapter 3's petals: the nearest) |
| untie a cord / wrap a packet / tie a thread on a wrist | MISSING (no hands-together work; his right hand has finger bones, PHOGRIP5) |
| pour / hand over a bottle | MISSING (the seated talk's hands laid forward is the nearest) |
| walk | Walking (Running) |
| stand at a door | Sit_to_Stand_Transition_M's end, as chapter 5 stands him (c_cast.js `cast.pho`); Talk_with_Hands_Open to talk standing |
| kneel and wind a thread | MISSING |
| sit at a dining table | PARTLY: Sit_to_Stand_Transition_M's start is a chair sit; Sitting_Answering_Questions seated |
| talk | Talk_with_Hands_Open, Talk_with_Left_Hand_on_Hip (standing), Sitting_Answering_Questions (seated) |
