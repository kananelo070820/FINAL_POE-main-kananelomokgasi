from _common import ROOT, REQUIRED_PAGES, REQUIRED_DIRS, fail, success
messages = []
for page in REQUIRED_PAGES:
    if not (ROOT / page).exists():
        messages.append(f'Missing required page: {page}')
for folder in REQUIRED_DIRS:
    if not (ROOT / folder).is_dir():
        messages.append(f'Missing required folder: {folder}/')
for p in [ROOT / 'css' / 'style.css', ROOT / 'js' / 'main.js', ROOT / 'README.md']:
    if not p.exists():
        messages.append(f'Missing expected starter file: {p.relative_to(ROOT)}')
if messages:
    fail(['STRUCTURE CHECK FAILED:'] + messages + ['Tip: follow the required root file structure in the brief.'])
else:
    success('STRUCTURE CHECK PASSED: Required pages, folders, stylesheet, script, and README are present.')
