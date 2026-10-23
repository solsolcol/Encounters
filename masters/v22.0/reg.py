"""v22.0 · the e3c4 rows for src/voicelines.js: words from script.json (what was generated, tags kept), secs from
secs.json (ffprobe of the shipped mp3), where in plain words for Chad. Prints the JS block to paste."""
import json
S = {n: (w, t) for n, w, t in json.load(open('script.json'))['lines']}
SECS = json.load(open('secs.json'))
WHO = {'jamesAdult': 'jamesAdult', 'yinkeeper4': 'yinkeeper4', 'towkay4': 'towkay4', 'owner3': 'owner3',
       'staffman3': 'staffman3', 'monk': 'monk4'}
WHERE = {
 'z4pro1': "The opening film: his desk at night, the screen full of searches about what happened to him",
 'z4pro2': "The opening film: Golden Mile, going from shop to shop",
 'z4pro3': "The opening film: up the escalator to an old mall's empty top floor",
 'z4pro4': "The opening film: walking to the shop at the end of the corridor, an old song coming from it",
 'z4look1': "The Yin shop: he looks at the little oil bottles in the cabinet",
 'z4look2': "The Yin shop: he looks at the old photographs, one with fresh flowers under it",
 'z4look3': "The Yin shop: he looks at the spirit altar and its red drinks",
 'yk4hello': "The Yin shop: the keeper speaks to him from behind her counter",
 'yk4show': "The Yin shop: the keeper opens the velvet box and shows him the Yin amulet",
 'z4ask': "The Yin shop: he asks to hold it",
 'yk4gentle': "The Yin shop: the keeper lets him hold it",
 'z4numb': "The Yin shop: the amulet in his hand, the numbness climbing his arm",
 'z4cold': "The Yin shop: the cold coming over him, frost at the edges of his sight",
 'z4beside': "The Yin shop: a young woman at the edge of his sight, gone when he turns",
 'z4yin': "The Yin shop: after he sets her down, his promise to her",
 'yk4heard': "The Yin shop: the keeper, after his promise",
 'yk4merit': "The Yin shop: the keeper, as he leaves",
 'z4tem1': "The merit film: a temple courtyard at sunset",
 'z4dedicate': "The merit film: kneeling before the monk, dedicating the merit to her (whispered)",
 'mk4yatha': "The merit film: the monk chants the verse for the departed (Yathā vārivahā) while the water is poured",
 'z4tem2': "The merit film: the water poured at the roots of the courtyard's tree",
 'z4han0': "Over the black after the merit film, before the Golden Mile shop",
 'ow4hello': "The Golden Mile shop: the owner, glad to see him back after Buddha Day",
 'z4fine': "The Golden Mile shop: his answer to the owner",
 'ow4new': "The Golden Mile shop: the owner calls him over to the new Hanuman",
 'z4roar': "The Golden Mile shop: the Hanuman in his hand, the roar inside him",
 'z4urge': "The Golden Mile shop: the urge, before he lets go",
 'ow4ok': "The Golden Mile shop: the owner, after he drops it",
 'z4go': "The Golden Mile shop: his answer, before he runs",
 'sm4what': "The run-out film: the staff man, as he runs past",
 'z4hide': "The run-out film: at the railing at the corridor's end, out of breath",
 'z4tray0': "Over the black after the run-out film, before the Chinatown shop",
 'to4hello': "The Chinatown shop: the owner, as he comes in",
 'to4notice': "The Chinatown shop: the owner, pouring tea, tells him what he has noticed",
 'z4sense': "The Chinatown shop: his answer",
 'to4tray': "The Chinatown shop: the owner slides the tray of three pieces to him",
 'z4lersi': "The Chinatown shop: holding the Lersi",
 'to4lersi': "The Chinatown shop: the owner, after the Lersi",
 'z4wess': "The Chinatown shop: holding the Thao Wessuwan",
 'to4wess': "The Chinatown shop: the owner, after the Thao Wessuwan",
 'z4naga': "The Chinatown shop: holding the Phaya Naga",
 'to4naga': "The Chinatown shop: the owner, after the Phaya Naga",
 'to4unknown': "The Chinatown shop: the owner unwraps a fourth piece even he cannot name",
 'to4clock': "The Chinatown shop: the owner, as the wall clock stops",
 'z4feel': "The Chinatown shop: before the decision (whispered)",
 'z4A1': "Ending A: he takes it and opens himself",
 'z4A1b': "Ending A: something that is not one of the three comes in",
 'to4A1': "Ending A: the owner over him on the floor",
 'z4A2b': "Ending A: he comes to",
 'to4A3': "Ending A: the owner tells him what happened",
 'z4A2': "Ending A: the clock has moved twenty minutes",
 'to4A2': "Ending A: the owner, sorry, gives him water",
 'z4A3': "Ending A: walking home at dusk",
 'z4A4': "Ending A: the closing narration",
 'z4B1': "Ending B: he asks to buy it",
 'to4B1': "Ending B: the owner wraps it for him",
 'z4B1b': "Ending B: his room at night, unwrapping it",
 'z4B2': "Ending B: the humming, the frost at the window",
 'z4B3': "Ending B: three in the morning, awake",
 'z4B5': "Ending B: back at the shop's door in the morning with the bag",
 'to4B2': "Ending B: the owner takes it back",
 'z4B4': "Ending B: the closing narration",
 'z4C1': "Ending C: he puts it down",
 'to4C1': "Ending C: the owner wraps it away",
 'to4C2': "Ending C: the owner sees him to the door",
 'z4C2': "Ending C: out on the five-foot way",
 'z4C3': "Ending C: walking away",
 'z4C4': "Ending C: the closing narration",
 'z4D1': "Ending D: he pushes the tray back",
 'to4D1': "Ending D: the owner's honest answer",
 'z4D2': "Ending D: he asks for a teacher",
 'to4D2': "Ending D: the owner writes a temple's name on a card",
 'z4D5': "Ending D: taking the card",
 'to4D3': "Ending D: the owner, as he goes",
 'z4D3': "Ending D: outside in the evening, looking at the card",
 'z4D4': "Ending D: the closing narration",
 'z4A': "Under outcome card A", 'z4B': "Under outcome card B", 'z4C': "Under outcome card C", 'z4D': "Under outcome card D",
}
NOTE = {
 'mk4yatha': "The Pali romanised as a Thai monk says it (v as w): Yathā vārivahā pūrā paripūrenti sāgaraṁ, evam-eva ito dinnaṁ petānaṁ upakappati. Captioned in the film, Pali over English.",
 'yk4heard': "Re-said as 'She heard your promise.' The first takes of 'She heard you.' were heard as 'She hurt you.' in both.",
}
missing = [n for n in S if n not in WHERE]
assert not missing, missing
order = list(S)
out = []
for n in order:
    w, t = S[n]
    row = f'    {{ id: "{n}", who: "{WHO[w]}", ch: "e3c4", where: "{WHERE[n]}",'
    if n in NOTE: row += f'\n      note: "{NOTE[n]}",'
    row += f'\n      text: "{t}", secs: {SECS[n]} }}'
    out.append(row)
print(',\n'.join(out))
