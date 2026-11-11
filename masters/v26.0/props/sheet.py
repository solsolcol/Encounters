# v26.0 · a contact sheet of prop reference pictures, to LOOK AT each before it goes to Meshy:  python3 sheet.py out.jpg name name ...
import sys
from PIL import Image
R='/home/user/Encounters/masters/v26.0/props/refs/'
out=sys.argv[1]; names=sys.argv[2:]
H=620; ims=[]
for n in names:
    im=Image.open(R+n+'-2k.png').convert('RGB'); ims.append(im.resize((int(im.size[0]*H/im.size[1]),H)))
W=sum(i.size[0] for i in ims)+6*(len(ims)-1)
sheet=Image.new('RGB',(W,H),(40,40,40)); x=0
for i in ims: sheet.paste(i,(x,0)); x+=i.size[0]+6
if W>2000: sheet=sheet.resize((2000,int(H*2000/W)))
sheet.save(out,quality=88); print(sheet.size)
