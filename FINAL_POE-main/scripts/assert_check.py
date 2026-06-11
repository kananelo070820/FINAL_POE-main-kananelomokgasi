#!/usr/bin/env python3
"""
Assert that a specific rubric check passed (based on grade-report.json).
Exit code:
  0 = pass (check passed)
  1 = fail (check failed or not found)

Usage:
  python scripts/assert_check.py --criterion css_styling --description "HTML pages link to css/style.css"
"""

import argparse
import json
import sys

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", default="grade-report.json", help="Path to grade report JSON")
    ap.add_argument("--criterion", required=True, help="Criterion id, e.g. css_styling")
    ap.add_argument("--description", required=True, help="Exact check description text")
    args = ap.parse_args()

    try:
        with open(args.report, "r", encoding="utf-8") as f:
            report = json.load(f)
    except Exception as e:
        print(f"Could not read report '{args.report}': {e}")
        sys.exit(1)

    crit = None
    for c in report.get("criteria", []):
        if c.get("id") == args.criterion:
            crit = c
            break
    if not crit:
        print(f"Criterion not found: {args.criterion}")
        sys.exit(1)

    chk = None
    for ch in crit.get("checks", []):
        if ch.get("description") == args.description:
            chk = ch
            break
    if not chk:
        print(f"Check not found in criterion '{args.criterion}': {args.description}")
        sys.exit(1)

    if chk.get("passed") is True:
        print("PASS:", chk.get("details", ""))
        sys.exit(0)

    print("FAIL:", chk.get("details", ""))
    sys.exit(1)

if __name__ == "__main__":
    main()