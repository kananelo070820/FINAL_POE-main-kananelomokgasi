import subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent
scripts = ['check_structure.py','check_semantics.py','check_navigation.py','check_forms.py','check_seo.py','check_readme.py','check_placeholders.py']
failed = False
for script in scripts:
    print(f'
===== Running {script} =====')
    result = subprocess.run([sys.executable, str(ROOT / script)], cwd=str(ROOT))
    if result.returncode != 0:
        failed = True
sys.exit(1 if failed else 0)
