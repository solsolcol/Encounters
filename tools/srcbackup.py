# srcbackup — the 3D sources generated here, kept on GitHub (v26.12, 14 Nov 2026; Chad's pick of three: "GitHub branch
# (Recommended)", described to him as "A branch of its own that a normal copy never downloads").
#
# masters/*/src is ignored by git (large unshrunk files), so the originals and remeshes Meshy, Hunyuan and the rigging
# made for this game lived only on the working machine, and a replaced machine would lose them (docs/OPEN-ITEMS.md E).
# This pushes them to ONE branch of their own, claude/model-sources: a chain of commits that shares nothing with the
# game's branch, each adding one chunk of about 600 MB (GitHub takes at most 2 GB a push, and this machine has room for
# one chunk at a time). The branch's last commit holds every file at its own path (masters/<version>/src/...).
#
# The work is done in a SCRATCH repository (SRCBACKUP_GIT, never the game's own), so nothing here can touch the game's
# objects: each chunk's files are hashed into it, the commit is pushed, GitHub's copy of the branch is read back, and
# only then are that chunk's file objects deleted from the scratch repository (the trees and commits stay: they are
# what lets the next push send only its own new files).
#
# ONLY WHAT WAS GENERATED HERE goes up: the folders in GENERATED below, every file of which is a generator's or the
# rig's output with its job recorded in that folder's recipe. Never his own models (Lersi Chin, Grandmaster Pho, Pong,
# the stall lady, the amulets, chapter 1's cast: masters/v24.15, v24.38, v24.39), never a bought or downloaded model (the
# Sketchfab trees, dog, Buddha and ghost jar, the admin-tee man: v24.13, v24.39, v24.47), never a photograph (his are in
# masters/v26.0/ref, which is not a source folder and is never read). The set was scanned before the first push for web
# addresses, keys, signed links and e-mail addresses (none: two documentation links only).
#
# A file over GitHub's limit goes up cut in pieces of 95 MiB (<name>.part1, .part2 ...). MANIFEST.txt on the branch is in
# sha256sum's format, one line a WHOLE file (before any cut), so after a restore `sha256sum -c MANIFEST.txt` checks all.
#
#   python3 -I tools/srcbackup.py plan             the chunks, nothing written
#   python3 -I tools/srcbackup.py start            the branch's first commit: the README alone (proves the push works)
#   python3 -I tools/srcbackup.py push [N ...]     add chunk N (or every chunk not yet up), one at a time
#
# RESTORING (the README on the branch says the same): fetch the branch BY NAME and unpack it with git archive, never a
# checkout or a restore into the game's working copy (both would stage, or delete, the game's own files under masters/):
#   git fetch origin claude/model-sources
#   git archive FETCH_HEAD masters | tar -x
#   then join each cut file (cat <name>.part1 <name>.part2 ... > <name>), and: git show FETCH_HEAD:MANIFEST.txt > M.txt;
#   sha256sum -c M.txt
import hashlib, json, os, subprocess, sys, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GENERATED = ['v24.19', 'v24.20', 'v24.22', 'v24.36', 'v25.0', 'v25.2', 'v25.5', 'v26.0']
CHUNK = 600 * 1024 * 1024
PIECE = 95 * 1024 * 1024
BRANCH = 'claude/model-sources'
SCR = os.environ.get('SRCBACKUP_GIT')
TRAILER = ('\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n'
           'Claude-Session: https://claude.ai/code/session_012dssR6qAN57acivr6t6QeS\n')

def run(args, cwd, input=None, binary=False, check=True):
    r = subprocess.run(args, cwd=cwd, capture_output=True, input=input, text=not binary)
    if check and r.returncode != 0:
        err = r.stderr if not binary else r.stderr.decode('utf-8', 'replace')
        raise SystemExit(f"{' '.join(args[:4])} ... failed: {err.strip()[-500:]}")
    return r

def g(*args, input=None):
    return run(['git', *args], SCR, input=input).stdout.strip()

def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''): h.update(block)
    return h.hexdigest()

def files():
    out = []
    for v in GENERATED:
        d = os.path.join(ROOT, 'masters', v, 'src')
        for name in sorted(os.listdir(d)):
            p = os.path.join(d, name)
            if os.path.isfile(p) and not os.path.islink(p): out.append((os.path.relpath(p, ROOT), os.path.getsize(p)))
    return out

def plan():
    chunks, cur, size = [], [], 0
    for rel, n in files():
        if cur and size + n > CHUNK: chunks.append(cur); cur, size = [], 0
        cur.append((rel, n)); size += n
    if cur: chunks.append(cur)
    return chunks

STATEF = lambda: os.path.join(SCR, '.git', 'srcbackup-state.json')
def load():
    if not os.path.exists(STATEF()): return {'commit': None, 'done': [], 'manifest': {}, 'cut': {}}
    with open(STATEF()) as f: return json.load(f)
def save(st):
    tmp = STATEF() + '.tmp'
    with open(tmp, 'w') as f: json.dump(st, f, indent=1)
    os.replace(tmp, STATEF())

def remote_tip():
    out = g('ls-remote', 'origin', f'refs/heads/{BRANCH}').split()
    return out[0] if out else None

def setup():
    if not SCR: raise SystemExit('set SRCBACKUP_GIT to a scratch folder (never the game repository)')
    if os.path.realpath(SCR).startswith(os.path.realpath(ROOT)): raise SystemExit('SRCBACKUP_GIT must be outside the game repository')
    if not os.path.isdir(os.path.join(SCR, '.git')):
        os.makedirs(SCR, exist_ok=True)
        run(['git', 'init', '-q'], SCR)
        url = run(['git', 'remote', 'get-url', 'origin'], ROOT).stdout.strip()
        g('remote', 'add', 'origin', url)
    for k, v in (('gc.auto', '0'), ('pack.window', '0'), ('user.name', 'Claude'), ('user.email', 'noreply@anthropic.com')):
        g('config', k, v)

def readme(st, total):
    cut = ''.join(f'- {rel} ({k} pieces)\n' for rel, k in sorted(st['cut'].items())) or '(none yet)\n'
    return (f"# The 3D sources generated for Master Z's Encounters\n\n"
            f"Originals, remeshes and rigs made for the game by Meshy, Hunyuan3D, Tripo and the rigging, at their own paths\n"
            f"in the game's repository (masters/<version>/src, which the game's branch ignores): {len(st['done'])} of {total}\n"
            f"chunks, {len(st['manifest'])} files. Made by tools/srcbackup.py on the game's branch. Only what was generated for\n"
            f"the game is here: none of Chad's own models, no bought model, no photograph.\n\n"
            f"## Restoring\n\nFetch this branch BY NAME and unpack it with git archive. Never check it out or restore it into the\n"
            f"game's working copy: both would stage or delete the game's own files under masters/.\n\n"
            f"    git fetch origin {BRANCH}\n    git archive FETCH_HEAD masters | tar -x\n\n"
            f"Join each cut file below (cat <name>.part1 <name>.part2 ... > <name>, then delete the parts), then check every\n"
            f"file against the manifest (sha256sum's format, one line a whole file):\n\n"
            f"    git show FETCH_HEAD:MANIFEST.txt > MANIFEST.txt && sha256sum -c MANIFEST.txt\n\n"
            f"## Cut to fit GitHub's 100 MB limit\n\n{cut}")

def commit(st, total, msg):
    for name, text in (('README-SOURCES.md', readme(st, total)),
                       ('MANIFEST.txt', ''.join(f'{h}  {rel}\n' for rel, h in sorted(st['manifest'].items())))):
        sha = g('hash-object', '-w', '--stdin', input=text)
        g('update-index', '--add', '--cacheinfo', f'100644,{sha},{name}')
    tree = g('write-tree', '--missing-ok')
    args = ['commit-tree', tree, '-m', msg + TRAILER]
    if st['commit']: args += ['-p', st['commit']]
    return g(*args)

def push(c):
    for attempt in range(4):
        r = run(['git', 'push', '--no-thin', 'origin', f'{c}:refs/heads/{BRANCH}'], SCR, check=False)
        if r.returncode == 0: break
        print(f'push failed: {r.stderr.strip()[-400:]}; again in {4 << attempt} s', flush=True)
        time.sleep(4 << attempt)
    else: raise SystemExit('the push did not go through')
    tip = remote_tip()
    if tip != c: raise SystemExit(f'GitHub shows {tip}, not the commit pushed ({c})')

def check_tip(st):
    tip = remote_tip()
    if tip != st['commit']: raise SystemExit(f'GitHub shows {tip}, the scratch repository last pushed {st["commit"]}: stopping')

def start(total):
    st = load()
    if st['commit']: print('already started:', st['commit']); return
    check_tip(st)
    c = commit(st, total, 'v26.12 · model sources: the branch begins (tools/srcbackup.py)')
    push(c)
    st['commit'] = c; save(st)
    print('started', c, flush=True)

def add_chunk(i, chunk, total):
    st = load()
    if not st['commit']: raise SystemExit('run start first')
    if i in st['done']: print(f'chunk {i} already up'); return
    check_tip(st)
    stv = os.statvfs(SCR); free = stv.f_bavail * stv.f_frsize
    need = sum(n for _, n in chunk) + 250 * 1024 * 1024
    if free < need: raise SystemExit(f'chunk {i}: {free >> 20} MiB free, {need >> 20} needed: stopping before anything is written')
    t0 = time.time(); written = []; entries = []
    whole = [rel for rel, n in chunk if n <= PIECE]
    if whole:
        shas = g('hash-object', '-w', '--stdin-paths', input=''.join(os.path.join(ROOT, rel) + '\n' for rel in whole)).split()
        assert len(shas) == len(whole)
        written += shas; entries += list(zip(shas, whole))
    for rel, n in chunk:
        st['manifest'][rel] = sha256(os.path.join(ROOT, rel))
        if n <= PIECE: continue
        k = 0
        with open(os.path.join(ROOT, rel), 'rb') as f:
            while True:
                block = f.read(PIECE)
                if not block: break
                k += 1
                sha = run(['git', 'hash-object', '-w', '--stdin'], SCR, input=block, binary=True).stdout.decode().strip()
                written.append(sha); entries.append((sha, f'{rel}.part{k}'))
        st['cut'][rel] = k
    g('update-index', '--index-info', input=''.join(f'100644 {sha}\t{path}\n' for sha, path in entries))
    st['done'] = sorted(st['done'] + [i])
    c = commit(st, total, f'v26.12 · model sources: chunk {i} of {total}, {len(chunk)} files (tools/srcbackup.py)')
    t1 = time.time()
    push(c)
    st['commit'] = c; save(st)
    gone = 0
    for sha in set(written):
        p = os.path.join(SCR, '.git', 'objects', sha[:2], sha[2:])
        if os.path.exists(p): gone += os.path.getsize(p); os.remove(p)
    print(f'chunk {i}: {len(chunk)} files, {sum(n for _, n in chunk) >> 20} MiB, hashed in {t1 - t0:.0f} s, pushed in '
          f'{time.time() - t1:.0f} s, commit {c[:12]} on GitHub; {gone >> 20} MiB of local copies let go', flush=True)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    chunks = plan()
    if cmd == 'plan':
        for i, c in enumerate(chunks):
            print(f'chunk {i + 1:2d}: {len(c):3d} files, {sum(n for _, n in c) >> 20:5d} MiB, {c[0][0]} .. {c[-1][0]}')
        print(f'{len(chunks)} chunks, {sum(n for c in chunks for _, n in c) >> 20} MiB, {sum(len(c) for c in chunks)} files')
        raise SystemExit
    setup()
    if cmd == 'start': start(len(chunks))
    elif cmd == 'push':
        st = load()
        want = [int(x) for x in sys.argv[2:]] or [i for i in range(1, len(chunks) + 1) if i not in st['done']]
        for i in want: add_chunk(i, chunks[i - 1], len(chunks))
        print('DONE', load()['done'], flush=True)
    else: raise SystemExit(f'unknown command {cmd}')
