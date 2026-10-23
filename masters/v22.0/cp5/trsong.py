"""does a take carry words? (a hum must not; a sigh or a breath must not)"""
import glob, sys
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
for p in sys.argv[1:]:
    segs, info = m.transcribe(p, beam_size=5, vad_filter=False)
    print(p, '|', ' '.join(s.text.strip() for s in segs), flush=True)
