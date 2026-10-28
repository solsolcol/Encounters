import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[1], device='cpu', compute_type='int8')
for p in sys.argv[2:]:
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','16000','-f','s16le','-'], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32)/32768
    segs, info = m.transcribe(a, word_timestamps=True, language='en', beam_size=5)
    print('==', p.split('/')[-1])
    for s in segs:
        print('  [%.2f-%.2f] %s' % (s.start, s.end, s.text.strip()))
        print('     ' + ' '.join('%s@%.2f-%.2f' % (w.word.strip(), w.start, w.end) for w in s.words))
