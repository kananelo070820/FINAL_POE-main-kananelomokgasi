# GitHub Classroom Autograding Setup for WEDE5020 POE

This repository includes **autograding scripts** that can be used in GitHub Classroom so students receive **immediate pass/fail feedback on every push**.

## Recommended Classroom Setup
When creating the assignment in GitHub Classroom:
1. Add this repository as the **starter code template**.
2. Enable **Feedback Pull Requests** so you can leave human feedback in the dedicated PR.
3. Under **Autograding**, add the following **Run command** tests.

## Suggested Autograding Tests
### 1) Required Structure (10 marks)
```bash
python tests/check_structure.py
```

### 2) Semantic HTML (10 marks)
```bash
python tests/check_semantics.py
```

### 3) Navigation Links (10 marks)
```bash
python tests/check_navigation.py
```

### 4) Forms (15 marks)
```bash
python tests/check_forms.py
```

### 5) SEO Essentials (15 marks)
```bash
python tests/check_seo.py
```

### 6) README Completion (15 marks)
```bash
python tests/check_readme.py
```

### 7) Placeholder Removal / Content Progress (25 marks)
```bash
python tests/check_placeholders.py
```

## Why this works well
- Students see **exactly which check failed** and can open the logs to read the improvement tip.
- The checks run on **every push** in GitHub Classroom.
- The tests focus on the POE brief: structure, semantic HTML, navigation, forms, SEO, README, and evidence of replacing placeholders with real project content.

## Important note for final grading
Autograding is best used for **formative feedback** and for checking objective criteria.
You should still use the rubric for design quality, originality of content, proposal quality, responsive polish, deeper JavaScript functionality, and referencing quality.
