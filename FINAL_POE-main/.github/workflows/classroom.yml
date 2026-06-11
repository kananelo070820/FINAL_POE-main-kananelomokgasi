name: WEDE5020 Final POE Autograding

on:
  push:
    branches: ["main", "master"]
  workflow_dispatch:
  repository_dispatch:

permissions:
  checks: write
  actions: read
  contents: read

jobs:
  run-autograding-tests:
    name: Run WEDE5020 Final POE checks
    runs-on: ubuntu-latest
    if: github.actor != 'github-classroom[bot]'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      # --------------------------------
      # 1) REQUIRED FILE STRUCTURE (15)
      # --------------------------------
      - name: Required pages and folders exist (15)
        id: structure_core
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "Required pages and folders exist"
          timeout: 20
          max-score: 15
          command: |
            python - <<'PY'
            from pathlib import Path

            required_pages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]
            required_dirs = ["css", "js", "images"]
            required_files = ["css/style.css", "js/main.js", "README.md", "robots.txt", "sitemap.xml"]

            ok = all(Path(p).exists() for p in required_pages)
            ok = ok and all(Path(d).is_dir() for d in required_dirs)
            ok = ok and all(Path(f).exists() for f in required_files)

            raise SystemExit(0 if ok else 1)
            PY

      # --------------------------------
      # 2) CSS LINKED ON ALL PAGES (10)
      # --------------------------------
      - name: All pages link the stylesheet (10)
        id: css_linked
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "All pages link css/style.css"
          timeout: 20
          max-score: 10
          command: |
            python - <<'PY'
            from pathlib import Path
            import re

            pages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]
            pattern = re.compile(r'<link[^>]+href=["\']css/style\.css["\']', re.I)

            ok = True
            for page in pages:
                text = Path(page).read_text(encoding="utf-8", errors="ignore")
                if not pattern.search(text):
                    ok = False

            raise SystemExit(0 if ok else 1)
            PY

      # --------------------------------
      # 3) RESPONSIVENESS BASICS (10)
      # --------------------------------
      - name: Viewport and media queries present (10)
        id: responsive_basics
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "Viewport and media queries present"
          timeout: 20
          max-score: 10
          command: |
            python - <<'PY'
            from pathlib import Path

            pages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]
            viewport_ok = True

            for page in pages:
                text = Path(page).read_text(encoding="utf-8", errors="ignore").lower()
                if 'name="viewport"' not in text and "name='viewport'" not in text:
                    viewport_ok = False

            css = Path("css/style.css").read_text(encoding="utf-8", errors="ignore").lower()
            media_ok = "@media" in css
            responsive_units_ok = any(unit in css for unit in ["rem", "em", "%", "vw", "vh", "flex", "grid"])

            raise SystemExit(0 if (viewport_ok and media_ok and responsive_units_ok) else 1)
            PY

      # --------------------------------
      # 4) SEMANTIC HTML + NAVIGATION (10)
      # --------------------------------
      - name: Semantic structure and navigation (10)
        id: semantic_nav
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "Semantic structure and navigation"
          timeout: 20
          max-score: 10
          command: |
            python - <<'PY'
            from pathlib import Path

            pages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]
            required_links = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]

            ok = True
            for page in pages:
                text = Path(page).read_text(encoding="utf-8", errors="ignore").lower()

                for tag in ["<header", "<nav", "<main", "<footer"]:
                    if tag not in text:
                        ok = False

                for link in required_links:
                    if f'href="{link}"' not in text and f"href='{link}'" not in text:
                        ok = False

            raise SystemExit(0 if ok else 1)
            PY

      # --------------------------------
      # 5) JAVASCRIPT WIRED CORRECTLY (10)
      # --------------------------------
      - name: JavaScript files exist and are linked (10)
        id: js_wired
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "JavaScript files exist and are linked"
          timeout: 20
          max-score: 10
          command: |
            python - <<'PY'
            from pathlib import Path

            ok = True

            required_js = ["js/main.js", "js/enquiry.js", "js/contact.js"]
            ok = ok and all(Path(p).exists() for p in required_js)

            pages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]
            for page in pages:
                text = Path(page).read_text(encoding="utf-8", errors="ignore").lower()
                if 'src="js/main.js"' not in text and "src='js/main.js'" not in text:
                    ok = False

            enquiry = Path("enquiry.html").read_text(encoding="utf-8", errors="ignore").lower()
            contact = Path("contact.html").read_text(encoding="utf-8", errors="ignore").lower()

            if 'src="js/enquiry.js"' not in enquiry and "src='js/enquiry.js'" not in enquiry:
                ok = False
            if 'src="js/contact.js"' not in contact and "src='js/contact.js'" not in contact:
                ok = False

            raise SystemExit(0 if ok else 1)
            PY

      # --------------------------------
      # 6) FORMS + VALIDATION BASICS (15)
      # --------------------------------
      - name: Enquiry and contact forms with validation basics (15)
        id: forms_validation
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "Enquiry and contact forms with validation basics"
          timeout: 20
          max-score: 15
          command: |
            python - <<'PY'
            from pathlib import Path

            def read(path):
                return Path(path).read_text(encoding="utf-8", errors="ignore").lower()

            enquiry = read("enquiry.html")
            contact = read("contact.html")

            ok = True

            if "<form" not in enquiry or 'id="enquiryform"' not in enquiry:
                ok = False
            if "<form" not in contact or 'id="contactform"' not in contact:
                ok = False

            if enquiry.count("<label") < 3:
                ok = False
            if contact.count("<label") < 3:
                ok = False

            if "required" not in enquiry:
                ok = False
            if "required" not in contact:
                ok = False

            if 'src="js/enquiry.js"' not in enquiry and "src='js/enquiry.js'" not in enquiry:
                ok = False
            if 'src="js/contact.js"' not in contact and "src='js/contact.js'" not in contact:
                ok = False

            raise SystemExit(0 if ok else 1)
            PY

      # --------------------------------
      # 7) SEO ESSENTIALS (10)
      # --------------------------------
      - name: Title tags, meta descriptions, robots and sitemap (10)
        id: seo_essentials
        uses: classroom-resources/autograding-command-grader@v1
        with:
          test-name: "Title tags, meta descriptions, robots and sitemap"
          timeout: 20
          max-score: 10
          command: |
            python - <<'PY'
            from pathlib import Path
            import re

            pages = ["index.html", "about.html", "services.html", "enquiry.html", "contact.html"]
            ok = Path("robots.txt").exists() and Path("sitemap.xml").exists()

            for page in
            if "changelog" not in lower:
                raise SystemExit(1)

            section = lower.split("changelog", 1)[1]
            bullets = len(re.findall(r'^\s*[-*]\s+', section, re.M))
            dates = len(re.findall(r'20\d{2}-\d{2}-\d{2}', section))

            ok = (bullets >= 5) or (dates >= 3)
            raise SystemExit(0 if ok else 1)
            PY

      # --------------------------------
      # REPORT RESULTS BACK TO CLASSROOM
      # --------------------------------
      - name: Autograding Reporter
        uses: classroom-resources/autograding-grading-reporter@v1
        env:
          STRUCTURE_CORE_RESULTS: "${{ steps.structure_core.outputs.result }}"
          CSS_LINKED_RESULTS: "${{ steps.css_linked.outputs.result }}"
          RESPONSIVE_BASICS_RESULTS: "${{ steps.responsive_basics.outputs.result }}"
          SEMANTIC_NAV_RESULTS: "${{ steps.semantic_nav.outputs.result }}"
          JS_WIRED_RESULTS: "${{ steps.js_wired.outputs.result }}"
          FORMS_VALIDATION_RESULTS: "${{ steps.forms_validation.outputs.result }}"
          SEO_ESSENTIALS_RESULTS: "${{ steps.seo_essentials.outputs.result }}"
          MAPS_LOCATIONS_RESULTS: "${{ steps.maps_locations.outputs.result }}"
          README_SECTIONS_RESULTS: "${{ steps.readme_sections.outputs.result }}"
          PLACEHOLDERS_REMOVED_RESULTS: "${{ steps.placeholders_removed.outputs.result }}"
          CHANGELOG_DEPTH_RESULTS: "${{ steps.changelog_depth.outputs.result }}"
        with:
          runners: structure_core,css_linked,responsive_basics,semantic_nav,js_wired,forms_validation,seo_essentials,maps_locations,readme_sections,placeholders_removed,changelog_depth
