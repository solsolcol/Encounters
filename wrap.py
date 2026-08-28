# mirror the artifact publish wrapper so local tests match production
import pathlib
d = pathlib.Path(__file__).resolve().parent
c = (d / 'hellnote.html').read_text()
(d / 'wrapped.html').write_text(
  '<!doctype html><html><head><meta charset="utf-8"></head><body>' + c + '</body></html>')
print('wrapped.html written (no viewport meta — worst case)')
