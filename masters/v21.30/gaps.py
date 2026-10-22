import json, sys
T = json.load(open('tr.json'))
for k in sys.argv[1:]:
    W = T[k]['words']
    s = []
    for j, w in enumerate(W):
        s.append(w[0])
        if j + 1 < len(W):
            g = W[j + 1][1] - w[2]
            if g >= 0.2: s.append(f'[{g:.2f}]')
    print(f'{k} {W[0][1]:.2f}-{W[-1][2]:.2f}: ' + ' '.join(s))
