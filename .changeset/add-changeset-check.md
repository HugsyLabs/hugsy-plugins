---
'@hugsylabs/plugin-node': patch
---

Add changeset verification to pre-commit hooks

- Add pre-commit hook to check for changesets when packages are modified
- Skip pre-commit hooks in CI environments (CI=true or GITHUB_ACTIONS=true)
- Provide interactive prompt for developers to decide whether to proceed without changeset
- Show clear instructions for creating changesets or skipping the check
