---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

## Critical Rules

1. **NEVER run git commands**: Do not execute any git commands (e.g., `git add`, `git commit`, `git push`, `git pull`, `git checkout`, `git branch`, `git stash`, `git diff`, `git status`, `git log`, `git merge`, `git rebase`, `git reset`, `git fetch`, `git clone`, etc.). The user manages version control manually. This rule has absolutely no exceptions.

2. The agent needs to follow a chain-of-thought approach at all times.