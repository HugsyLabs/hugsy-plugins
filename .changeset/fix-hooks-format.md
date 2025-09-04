---
'@hugsylabs/plugin-node': patch
'@hugsylabs/plugin-docker': patch
'@hugsylabs/plugin-git': patch
'@hugsylabs/plugin-python': patch
'@hugsylabs/plugin-test': patch
'@hugsylabs/plugin-typescript': patch
'@hugsylabs/plugin-security': patch
'@hugsylabs/preset-recommended': patch
---

Fix hooks format to comply with Claude Code specifications and remove broken deny permissions

- **BREAKING**: Fixed all plugin hooks to use correct Claude Code format
  - Changed matcher from `"Bash(command pattern)"` to `"Bash"`
  - Added proper hooks array structure with type and command fields
  - Commands now use jq to parse tool input and check specific patterns

- **BREAKING**: Removed all deny permissions due to Claude Code bug
  - Deny rules are completely non-functional (see anthropics/claude-code#4570)
  - Removed deny configurations from all plugins to avoid false security sense
  - Updated tests to remove deny permission checks

- Updated all plugin tests to match new hooks format
- All 57 tests passing with new structure
