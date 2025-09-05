---
'@hugsylabs/subagent-security-engineer': patch
---

Fix workspace configuration to include subagents packages

- Add packages/subagents/\* to pnpm workspace configuration
- Ensures all subagent packages are properly recognized in the monorepo
- Fixes CI/CD build issues with changeset version command
