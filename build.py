import pathlib, sys, base64
d = pathlib.Path(__file__).resolve().parent
shell = (d / 'shell.html').read_text()
bundle = (d / 'bundle.js').read_text()
src = (d / 'src' / 'main.js').read_text()
# only pay the download cost for models the scene actually shows
want_amulet = 'SHOW_AMULET = true' in src
for token, name, wanted in (('__AMULET_B64__', 'amulet.glb', want_amulet),
                            ('__HANDS_B64__', 'vrhands_fixed.glb', True),
                            ('__GHOST_B64__', 'ghost.glb', True),
                            ('__HDB_B64__', 'hdb.glb', True),
                            # the title logo. It goes through the JS rather than
                            # into an <img src="data:...">, because a sandboxed
                            # frame's policy can refuse data: images outright —
                            # the same trap that ate the model textures.
                            ('__LOGO_B64__', 'assets/logo.webp', True)):
    assert token in bundle, f'{token} missing from bundle'
    data = base64.b64encode((d / name).read_bytes()).decode() if wanted else ''
    bundle = bundle.replace(token, data)
    print(f'  {name}: {"embedded " + str(len(data)//1024) + " KB" if wanted else "skipped"}')
assert '/*BUNDLE*/' in shell, 'placeholder missing'
# guard: a literal </script> inside the bundle would close the tag early
bundle = bundle.replace('</script', '<\\/script')
out = shell.replace('<script>/*BUNDLE*/</script>',
                    '<script>\n' + bundle + '\n</script>')
p = d / 'hellnote.html'
p.write_text(out)
print('wrote', p, f'{p.stat().st_size/1024:.0f} KB')
