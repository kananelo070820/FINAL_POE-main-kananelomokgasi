#!/usr/bin/env python3
"""
Grade Part 2 rubric based on rubric-part2.yml

Dependencies:
  pip install pyyaml beautifulsoup4

Usage:
  python scripts/grade_part2.py --rubric rubric-part2.yml --out grade-report.json

Supports:
  exists, glob_min_count, html_contains (mode any/all), css_min_rules,
  css_contains_any, css_contains_regex, html_img_alt_ratio,
  readme_contains_headings, readme_min_reference_count,
  git_min_commits, git_commit_message_regex_count,
  html_nav_consistency
"""

import argparse
import glob
import json
import os
import re
import subprocess
from typing import Any, Dict, List, Tuple

import yaml
from bs4 import BeautifulSoup


def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def file_exists(path: str) -> bool:
    return os.path.exists(path)

def list_glob(pattern: str) -> List[str]:
    recursive = "**" in pattern
    return glob.glob(pattern, recursive=recursive)

def run_git(args: List[str]) -> Tuple[int, str, str]:
    proc = subprocess.run(["git"] + args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return proc.returncode, proc.stdout.strip(), proc.stderr.strip()

def safe_int(s: str, default: int = 0) -> int:
    try:
        return int(s.strip())
    except Exception:
        return default

def normalize_heading(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())

def markdown_headings(md_text: str) -> List[str]:
    headings = []
    for line in md_text.splitlines():
        m = re.match(r"^\s*#{1,6}\s+(.+?)\s*$", line)
        if m:
            headings.append(normalize_heading(m.group(1)))
    return headings

def extract_section(md_text: str, heading_name: str) -> str:
    lines = md_text.splitlines()
    target = normalize_heading(heading_name)
    start_idx = None
    start_level = None

    for i, line in enumerate(lines):
        m = re.match(r"^\s*(#{1,6})\s+(.+?)\s*$", line)
        if m and normalize_heading(m.group(2)) == target:
            start_idx = i
            start_level = len(m.group(1))
            break

    if start_idx is None:
        return ""

    content_lines = []
    for j in range(start_idx + 1, len(lines)):
        m = re.match(r"^\s*(#{1,6})\s+(.+?)\s*$", lines[j])
        if m:
            level = len(m.group(1))
            if level <= start_level:
                break
        content_lines.append(lines[j])

    return "\n".join(content_lines).strip()

def count_reference_items(ref_section: str) -> int:
    count = 0
    for line in ref_section.splitlines():
        t = line.strip()
        if not t:
            continue
        if re.match(r"^[-*]\s+\S+", t):
            count += 1
        elif re.match(r"^\d+\s*[\.\)]\s+\S+", t):
            count += 1
        else:
            if re.search(r"\b(19|20)\d{2}\b", t) and ("," in t or "." in t):
                count += 1
    return count

def compile_regex(pattern: str) -> re.Pattern:
    return re.compile(pattern, flags=re.IGNORECASE | re.MULTILINE)

def normalize_href(href: str) -> str:
    if href is None:
        return ""
    h = href.strip().strip("\"'")
    if len(h) > 1:
        h = h.rstrip("/")
    h = re.sub(r"(?:^|/)(index\.html)$", "", h, flags=re.IGNORECASE)
    return h.lower()

def normalize_link_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip()).lower()


# ---------------- Checks ----------------

def check_exists(check: Dict[str, Any]) -> Tuple[bool, str]:
    path = check["path"]
    ok = file_exists(path)
    return ok, (f"Found: {path}" if ok else f"Missing: {path}")

def check_glob_min_count(check: Dict[str, Any]) -> Tuple[bool, str]:
    pattern = check["pattern"]
    min_count = int(check["min_count"])
    matches = list_glob(pattern)
    ok = len(matches) >= min_count
    details = f"Pattern '{pattern}' matched {len(matches)} file(s); minimum required {min_count}."
    return ok, details

def check_html_contains(check: Dict[str, Any]) -> Tuple[bool, str]:
    files_glob = check.get("files_glob", "*.html")
    files = sorted(list_glob(files_glob))
    if not files:
        return False, f"No HTML files found for glob '{files_glob}'."

    must_contain_all = check.get("must_contain_all")
    must_contain_regex = check.get("must_contain_regex")
    mode = (check.get("mode", "any") or "any").strip().lower()

    rx = compile_regex(must_contain_regex) if must_contain_regex else None

    failed = []
    passed = []
    for fp in files:
        text = read_text(fp)
        ok = True

        if must_contain_all:
            for s in must_contain_all:
                if s not in text:
                    ok = False
                    break

        if ok and rx:
            if not rx.search(text):
                ok = False

        (passed if ok else failed).append(fp)

    if mode == "all":
        ok = len(failed) == 0
        return ok, f"Mode=ALL. Checked {len(files)}. Failed: {failed[:8]}" + ("..." if len(failed) > 8 else "")

    ok = len(passed) > 0
    return ok, f"Mode=ANY. Checked {len(files)}. Passed {len(passed)}; Failed {len(failed)}."

def check_css_min_rules(check: Dict[str, Any]) -> Tuple[bool, str]:
    path = check["path"]
    min_rules = int(check["min_rules"])
    if not file_exists(path):
        return False, f"Missing CSS file: {path}"
    css = read_text(path)
    blocks = css.count("{")
    ok = blocks >= min_rules
    return ok, f"CSS blocks counted: {blocks}; minimum required: {min_rules}."

def check_css_contains_any(check: Dict[str, Any]) -> Tuple[bool, str]:
    path = check["path"]
    any_of = check.get("any_of", [])
    if not file_exists(path):
        return False, f"Missing CSS file: {path}"
    css = read_text(path).lower()
    found = [token for token in any_of if token.lower() in css]
    ok = len(found) > 0
    return ok, (f"Found: {found}" if ok else f"None of {any_of} found in {path}.")

def check_css_contains_regex(check: Dict[str, Any]) -> Tuple[bool, str]:
    path = check["path"]
    pattern = check["regex"]
    if not file_exists(path):
        return False, f"Missing CSS file: {path}"
    css = read_text(path)
    ok = compile_regex(pattern).search(css) is not None
    return ok, f"Regex '{pattern}' " + ("matched." if ok else "did not match.")

def check_html_img_alt_ratio(check: Dict[str, Any]) -> Tuple[bool, str]:
    files_glob = check.get("files_glob", "*.html")
    min_ratio = float(check.get("min_ratio", 1.0))
    files = sorted(list_glob(files_glob))
    if not files:
        return False, f"No HTML files found for glob '{files_glob}'."

    total = 0
    with_alt = 0
    for fp in files:
        soup = BeautifulSoup(read_text(fp), "html.parser")
        imgs = soup.find_all("img")
        total += len(imgs)
        for img in imgs:
            alt = img.get("alt", "")
            if alt is not None and str(alt).strip():
                with_alt += 1

    if total == 0:
        return True, "No <img> tags found; alt ratio treated as N/A pass."

    ratio = with_alt / total
    ok = ratio >= min_ratio
    return ok, f"Alt ratio: {with_alt}/{total}={ratio:.2f}; min required {min_ratio:.2f}."

def check_readme_contains_headings(check: Dict[str, Any]) -> Tuple[bool, str]:
    path = check["path"]
    required = check.get("headings", [])
    if not file_exists(path):
        return False, f"Missing README: {path}"
    found = markdown_headings(read_text(path))
    missing = []
    for h in required:
        hn = normalize_heading(h)
        if not any(hn in fh for fh in found):
            missing.append(h)
    ok = len(missing) == 0
    return ok, ("All required headings found." if ok else f"Missing headings: {missing}")

def check_readme_min_reference_count(check: Dict[str, Any]) -> Tuple[bool, str]:
    path = check["path"]
    min_count = int(check["min_count"])
    if not file_exists(path):
        return False, f"Missing README: {path}"
    md = read_text(path)
    refs = extract_section(md, "References")
    if not refs:
        return False, "No 'References' section found."
    count = count_reference_items(refs)
    ok = count >= min_count
    return ok, f"Counted {count} references; min required {min_count}."

def check_git_min_commits(check: Dict[str, Any]) -> Tuple[bool, str]:
    min_commits = int(check["min_commits"])
    code, out, err = run_git(["rev-list", "--count", "HEAD"])
    if code != 0:
        return False, f"Git error: {err or out}"
    n = safe_int(out, 0)
    ok = n >= min_commits
    return ok, f"Commit count {n}; min required {min_commits}."

def check_git_commit_message_regex_count(check: Dict[str, Any]) -> Tuple[bool, str]:
    pattern = check["regex"]
    min_count = int(check["min_count"])
    rx = compile_regex(pattern)
    code, out, err = run_git(["log", "--pretty=%s"])
    if code != 0:
        return False, f"Git error: {err or out}"
    messages = out.splitlines()
    matched = [m for m in messages if rx.search(m)]
    ok = len(matched) >= min_count
    return ok, f"Matched {len(matched)} commits; min required {min_count}."

def check_html_nav_consistency(check: Dict[str, Any]) -> Tuple[bool, str]:
    files_glob = check.get("files_glob", "*.html")
    files = sorted(list_glob(files_glob))
    if len(files) < 2:
        return False, f"Need at least 2 HTML files to compare nav, found {len(files)}."

    nav_selector = check.get("nav_selector", "nav")
    require_same_order = bool(check.get("require_same_order", False))
    compare_mode = (check.get("compare", "text_and_href") or "text_and_href").strip().lower()

    def signature(fp: str) -> List[Tuple[str, str]]:
        soup = BeautifulSoup(read_text(fp), "html.parser")
        nav = soup.select_one(nav_selector)
        if not nav:
            return []
        items = []
        for a in nav.find_all("a"):
            text = normalize_link_text(a.get_text(" ", strip=True))
            href = normalize_href(a.get("href", ""))
            if compare_mode == "text_only":
                items.append((text, ""))
            elif compare_mode == "href_only":
                items.append(("", href))
            else:
                items.append((text, href))
        return [it for it in items if it != ("", "")]

    base = files[0]
    base_items = signature(base)
    if not base_items:
        return False, f"Base file '{base}' has no nav links or nav missing."

    mismatches = []
    for fp in files[1:]:
        items = signature(fp)
        if not items:
            mismatches.append(fp)
            continue
        if require_same_order:
            if items != base_items:
                mismatches.append(fp)
        else:
            if set(items) != set(base_items):
                mismatches.append(fp)

    ok = len(mismatches) == 0
    return ok, ("Navigation consistent across pages." if ok else f"Nav mismatch in: {mismatches[:8]}")

def eval_check(check: Dict[str, Any]) -> Tuple[bool, str]:
    t = check["type"]
    if t == "exists": return check_exists(check)
    if t == "glob_min_count": return check_glob_min_count(check)
    if t == "html_contains": return check_html_contains(check)
    if t == "css_min_rules": return check_css_min_rules(check)
    if t == "css_contains_any": return check_css_contains_any(check)
    if t == "css_contains_regex": return check_css_contains_regex(check)
    if t == "html_img_alt_ratio": return check_html_img_alt_ratio(check)
    if t == "readme_contains_headings": return check_readme_contains_headings(check)
    if t == "readme_min_reference_count": return check_readme_min_reference_count(check)
    if t == "git_min_commits": return check_git_min_commits(check)
    if t == "git_commit_message_regex_count": return check_git_commit_message_regex_count(check)
    if t == "html_nav_consistency": return check_html_nav_consistency(check)
    return False, f"Unknown check type: {t}"

def grade_rubric(rubric: Dict[str, Any]) -> Dict[str, Any]:
    assignment = rubric.get("assignment", {})
    criteria = rubric.get("criteria", [])

    results = []
    earned_total = 0.0
    max_total = 0.0

    for crit in criteria:
        crit_id = crit.get("id", "")
        title = crit.get("title", crit_id)
        checks = crit.get("checks", [])

        crit_earned = 0.0
        crit_max = 0.0
        check_results = []

        for chk in checks:
            pts = float(chk.get("points", 0))
            crit_max += pts
            ok, details = eval_check(chk)
            earned = pts if ok else 0.0
            crit_earned += earned
            check_results.append({
                "type": chk.get("type"),
                "description": chk.get("description", ""),
                "max_points": pts,
                "earned": earned,
                "passed": bool(ok),
                "details": details
            })

        earned_total += crit_earned
        max_total += crit_max
        results.append({
            "id": crit_id,
            "title": title,
            "max_points": crit_max,
            "earned": crit_earned,
            "checks": check_results
        })

    pass_mark = float(assignment.get("pass_mark", 0))
    final_score = round(earned_total, 2)

    return {
        "assignment": assignment,
        "criteria": results,
        "totals": {
            "criteria_max_points": round(max_total, 2),
            "final_score": final_score,
            "pass_mark": pass_mark,
            "passed": final_score >= pass_mark
        }
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rubric", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    with open(args.rubric, "r", encoding="utf-8") as f:
        rubric = yaml.safe_load(f)

    report = grade_rubric(rubric)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    t = report["totals"]
    print(f"Final score: {t['final_score']} / {t['criteria_max_points']} | Passed: {t['passed']}")

if __name__ == "__main__":
    main()