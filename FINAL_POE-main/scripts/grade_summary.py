#!/usr/bin/env python3
import json

with open("grade-report.json", "r", encoding="utf-8") as f:
    r = json.load(f)

t = r["totals"]
print(f"Final score: {t['final_score']} / {t['criteria_max_points']} | Passed: {t['passed']}")
for c in r["criteria"]:
    print(f"- {c['title']}: {c['earned']} / {c['max_points']}")