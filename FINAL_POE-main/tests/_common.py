from pathlib import Path
import re
import sys
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_PAGES = ['index.html', 'about.html', 'services.html', 'enquiry.html', 'contact.html']
REQUIRED_DIRS = ['css', 'js', 'images']
PLACEHOLDERS = ['[Organisation Name]', '[Full Name]', '[Student Number]', 'TODO', 'replace@example.com', 'Goal 1', 'Goal 2', 'Goal 3']

class TagCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.attrs = []
    def handle_starttag(self, tag, attrs):
        self.tags.append(tag.lower())
        self.attrs.append((tag.lower(), dict(attrs)))

def read_file(path: Path) -> str:
    return path.read_text(encoding='utf-8', errors='ignore')

def page_paths():
    return [ROOT / p for p in REQUIRED_PAGES]

def parse_html(path: Path):
    parser = TagCollector()
    parser.feed(read_file(path))
    return parser

def placeholder_hits(text: str):
    hits = []
    lower = text.lower()
    for item in PLACEHOLDERS:
        if item.lower() in lower:
            hits.append(item)
    return hits

def markdown_has_section(text: str, heading: str):
    pattern = rf'^#+\s+{re.escape(heading)}\s*$'
    return re.search(pattern, text, re.IGNORECASE | re.MULTILINE) is not None

def fail(messages):
    print('\n'.join(messages))
    sys.exit(1)

def success(message):
    print(message)
    sys.exit(0)
