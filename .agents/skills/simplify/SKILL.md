---
name: simplify
description: Review changed React, TypeScript, and Tailwind code and directly improve its quality, clarity, and efficiency. Use when the user asks to simplify, clean up, refactor, or review current code changes.
---

# Simplify Changed Code

1. Use the user-supplied path when present; otherwise inspect files from `git diff --name-only`.
2. Review React and TypeScript for duplicated logic, inappropriate memoization, missing or weak types, unnecessary prop drilling, unused symbols, complex conditions, and unclear names.
3. Review Tailwind code for repeated class combinations and missing responsive behavior.
4. Directly fix focused, behavior-preserving issues. Ask before changes that materially alter architecture or behavior.
5. Run relevant checks and summarize the improvements and verification.
