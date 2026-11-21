#!/usr/bin/env python3
"""v28.0 · a PLAIN rig (no finger bones) for the bodies of the nine:   python3 -I masters/v28.0/people/rigplain.py <name> <height>

The plan's section 13 counts the nine "on a plain rig of about 24" joints (nine bodies move at once in the fight; with
fingers each rig is 66 joints and the nine alone would be 594 of the phone's 720). masters/v28.0/meshy28.py's `rig`
always asks for fingers; this is the same request with include_fingers false, through meshy28's own functions (its
ledger, its lock, its downloads), so the job's id lands in masters/v28.0/src/jobs.json like any other rig's.
"""
import importlib.util, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('meshy28', os.path.join(HERE, '..', 'meshy28.py'))
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

name, height = sys.argv[1], float(sys.argv[2])
L = m.ledger()[name]
if L.get('rig'):
    raise SystemExit('%s already has a rig (%s): not rigged a second time' % (name, L['rig']))
body = {'input_task_id': L['image_to_3d'], 'height_meters': height, 'skeleton_template': 'meshyrig', 'include_fingers': False}
tid = m.call('POST', '/rigging', body)['result']
m.note(name, rig=tid, rig_settings=body)
print('started plain rig', name, tid, flush=True)
t = m.wait('/rigging', tid, 'rig ' + name)
r = t['result']
sizes = {'rigged': m.fetch(r['rigged_character_glb_url'], os.path.join(m.SRC, 'rigged-%s.glb' % name))}
ba = r.get('basic_animations') or {}
if ba.get('walking_glb_url'): sizes['walk'] = m.fetch(ba['walking_glb_url'], os.path.join(m.SRC, 'take-%s-walking.glb' % name))
m.note(name, rig_credits=t.get('consumed_credits'), rig_sizes=sizes)
print('rig done', name, sizes, flush=True)
