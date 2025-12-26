---
description: Generate commit message and commit staged changes
model: haiku
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*)
---

# Commit Staged Changes

## Context

- Status: !`git status --short`
- Staged diff: !`git diff --cached`
- Recent commits (for style): !`git log --oneline -5`

## Instructions

Based on the staged changes above, generate a commit message and run `git commit`.

### Commit Message Format

- Only respond with the commit message. Don't give any notes.
- Explain what were the changes and why the changes were done.
- Focus the most important changes.
- Use the present tense.
- Use a conventional commits style.
- Instead of `docs(...)`, use `skill({skill_name})` when editing claude skills
- Use lowercase, no period at end of summary
- Ensure the title is only 50 characters, all lowercase.
- Do not start any lines with the hash symbol.
- No author comments or notes about claude code.

### Then

Run `git commit -m "..."` with the generated message using HEREDOC format for multi-line messages.

$ARGUMENTS
