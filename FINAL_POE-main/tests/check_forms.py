from _common import ROOT, parse_html, fail, success
messages = []
for filename, form_id in [('enquiry.html', 'enquiryForm'), ('contact.html', 'contactForm')]:
    parser = parse_html(ROOT / filename)
    forms = [a for tag, a in parser.attrs if tag == 'form']
    if not forms:
        messages.append(f'{filename}: missing <form>.')
        continue
    if not any(a.get('id') == form_id for a in forms):
        messages.append(f'{filename}: expected form id "{form_id}" not found.')
    labels = [a for tag, a in parser.attrs if tag == 'label']
    inputs = [a for tag, a in parser.attrs if tag in ('input', 'textarea', 'select')]
    if len(labels) < 3:
        messages.append(f'{filename}: not enough <label> elements for accessibility.')
    if len(inputs) < 3:
        messages.append(f'{filename}: not enough form controls.')
if messages:
    fail(['FORM CHECK FAILED:'] + messages + ['Tip: include accessible labels, enough controls, and the required enquiry/contact forms.'])
else:
    success('FORM CHECK PASSED: enquiry and contact forms with labels and controls are present.')
