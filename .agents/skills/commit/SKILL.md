---
name: commit
description: Review repository changes, create a focused conventional commit, and push the current branch. Use when the user asks to commit, commit and push, save changes to git, or publish the current branch.
---

# Commit and Push

1. Run `git status` and inspect staged and unstaged diffs.
2. Identify the files relevant to the requested work. Never include `.env`, `data/`, `.venv/`, secrets, generated artifacts, or unrelated user changes.
3. Run the project's relevant verification before committing when it has not already passed.
4. Choose a concise message using `feat:`, `fix:`, `refactor:`, `chore:`, or `docs:`. Incorporate any message hint supplied by the user.
5. Stage explicit relevant paths and review the staged diff.
6. Commit with the selected message.
7. Push the commit with `git push origin HEAD`.
8. Report the commit hash, message, branch, push result, and verification performed.

If the push fails because authentication, branch protection, or remote state requires user action, preserve the local commit and report the exact blocker.
