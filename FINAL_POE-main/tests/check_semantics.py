from _common import page_paths, parse_html, fail, success
messages = []
required_tags = ['header', 'nav', 'main', 'footer']
for page in page_paths():
    parser = parse_html(page)
    for tag in required_tags:
        if tag not in parser.tags:
            messages.append(f'{page.name}: missing <{tag}> element.')
    if 'title' not in parser.tags:
        messages.append(f'{page.name}: missing <title> element.')
if messages:
    fail(['SEMANTIC HTML CHECK FAILED:'] + messages + ['Tip: use semantic HTML5 elements and meaningful page titles.'])
else:
    success('SEMANTIC HTML CHECK PASSED: All required semantic elements and titles were found.')
