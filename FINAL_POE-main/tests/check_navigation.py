from _common import page_paths, read_file, fail, success
messages = []
required_links = ['index.html', 'about.html', 'services.html', 'enquiry.html', 'contact.html']
for page in page_paths():
    text = read_file(page)
    for link in required_links:
        if f'href="{link}"' not in text and f"href='{link}'" not in text:
            messages.append(f'{page.name}: missing navigation link to {link}.')
if messages:
    fail(['NAVIGATION CHECK FAILED:'] + messages + ['Tip: every page should allow users to navigate to all major pages.'])
else:
    success('NAVIGATION CHECK PASSED: all required navigation links were found on each page.')
