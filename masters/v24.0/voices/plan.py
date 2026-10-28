"""v24.0 CP11 · the generation plan: every line of e4c1 with its voice and the prompt (the registry's words exactly;
the cast's prompts may open with one direction tag that ages a voice, as v22.0's keeper and towkay did). The seven
audition lines are already made by their winners. Prints JSON lines: id, voice, prompt."""
import json, sys
sys.path.insert(0, '../script'); from lines import L
VOICE = { 'jamesAdult': 'bP8FJDHmWVEgXJDitdQd',   # Brian
          'master4': 'weRAVUYgqjjfUEEu5BsB',      # Patinya
          'pong': 'bcdIY58WBBzAMmef52NW',         # Zie
          'panoi': 'B4NdgwdU97lHqA8Udh2D',        # Kanya
          'joy4': 'MYZYcGOqrkYQcwDunXl7',         # HammyTH
          'lim4': 'hnUfJmvgsLlEm4ozUacp',         # Brandon
          'sombat4': 'xYmBpJREC3WfqEFpbPvO',      # Songkran
          'taxi4': 'HxkJ72rJ50z9kcGPPnG7' }       # Kopi O
OPEN = { 'sombat4': '[elderly voice] ', 'lim4': '[an old uncle] ', 'taxi4': '[an old uncle] ' }
DONE = {'fm1good', 'pg1car', 'pn1num', 'jy1a', 'sb1a', 'lm1a', 'tx1where'}
for lid, who, where, text in L:
    if lid in DONE: continue
    print(json.dumps({'id': lid, 'who': who, 'voice': VOICE[who], 'prompt': OPEN.get(who, '') + text}, ensure_ascii=False))
