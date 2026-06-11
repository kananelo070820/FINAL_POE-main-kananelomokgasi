from _common import ROOT, read_file, markdown_has_section, placeholder_hits, fail, success
messages = []
readme_path = ROOT / 'README.md'
if not readme_path.exists():
    fail(['README CHECK FAILED:', 'README.md is missing.'])
text = read_file(readme_path)
for section in ['Student Information', 'Project Overview', 'Website Goals and Objectives', 'Sitemap', 'Changelog', 'References']:
    if not markdown_has_section(text, section):
        messages.append(f'Missing README section: {section}')
hits = placeholder_hits(text)
if hits:
    messages.append('README still contains placeholders: ' + ', '.join(sorted(set(hits))))
if messages:
    fail(['README CHECK FAILED:'] + messages + ["Tip: complete the README so it reflects the student's actual project progress."])
else:
    success('README CHECK PASSED: required sections are present and placeholders were removed.')
