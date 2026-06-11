from _common import ROOT, page_paths, read_file, parse_html, fail, success
messages = []
for page in page_paths():
    text = read_file(page).lower()
    if 'name="description"' not in text and "name='description'" not in text:
        messages.append(f'{page.name}: missing meta description.')
    if 'name="keywords"' not in text and "name='keywords'" not in text:
        messages.append(f'{page.name}: missing meta keywords.')
    parser = parse_html(page)
    for img in [a for tag, a in parser.attrs if tag == 'img']:
        if 'alt' not in img or not img.get('alt', '').strip():
            messages.append(f'{page.name}: image missing meaningful alt text.')
if not (ROOT / 'robots.txt').exists():
    messages.append('robots.txt is missing.')
if not (ROOT / 'sitemap.xml').exists():
    messages.append('sitemap.xml is missing.')
if messages:
    fail(['SEO CHECK FAILED:'] + messages + ['Tip: add meta descriptions, keywords, image alt text, and the required SEO files.'])
else:
    success('SEO CHECK PASSED: required metadata and SEO files were found.')
