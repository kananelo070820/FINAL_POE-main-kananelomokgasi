from _common import ROOT, page_paths, read_file, placeholder_hits, fail, success
messages = []
for page in page_paths() + [ROOT / 'README.md']:
    if not page.exists():
        continue
    hits = placeholder_hits(read_file(page))
    if hits:
        messages.append(f'{page.name}: placeholders still present -> ' + ', '.join(sorted(set(hits))))
if messages:
    fail(['PLACEHOLDER CHECK FAILED:'] + messages + ['Tip: replace all starter text with researched content and your own project information.'])
else:
    success('PLACEHOLDER CHECK PASSED: no starter placeholders were found in the main pages or README.')
