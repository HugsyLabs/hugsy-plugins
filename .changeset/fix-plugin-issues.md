---
"@hugsylabs/commands-dev": patch
"@hugsylabs/preset-recommended": patch
"@hugsylabs/plugin-node": patch
"@hugsylabs/plugin-git": patch
"@hugsylabs/plugin-docker": patch
"@hugsylabs/plugin-python": patch
"@hugsylabs/plugin-typescript": patch
"@hugsylabs/plugin-test": patch
"@hugsylabs/plugin-security": patch
---

Major plugin system improvements and simplification

## Fixed Non-functional Plugins
- **commands-dev**: Fixed slash commands initialization to handle both array and object formats correctly
- **preset-recommended**: Added proper transform function to make preset loadable as a plugin
  - Created index.js as main entry point with transform logic
  - Keep index.json as configuration data
  - Updated package.json exports to point to index.js

## Simplified Permission System (Addressing 390+ rules issue)
Dramatically reduced permission complexity while maintaining security and functionality:

- **plugin-node**: Reduced from 78+ rules to 8 essential permissions
  - Trust Node.js developers with broad `Bash(npm *)`, `Bash(node *)` patterns
  - Kept useful hooks for auto-install and build suggestions
  
- **plugin-git**: Reduced from 50+ rules to 5 essential permissions
  - Single `Bash(git *)` covers all git operations
  - Kept hooks for branch protection warnings and large file detection
  
- **plugin-docker**: Reduced from 59 rules to 7 essential permissions
  - Trust Docker users with `Bash(docker *)` and `Bash(docker-compose *)`
  - Kept hooks for daemon checks and security scanning reminders
  
- **plugin-python**: Simplified from 47+ rules to core Python tools
  - Broad permissions for Python ecosystem tools
  - Kept virtual environment reminders and auto-install hooks
  
- **plugin-typescript**: Reduced from 57+ rules to 8 essential permissions
  - Trust TypeScript developers with compiler and file operations
  - Kept type-checking hooks before commits
  
- **plugin-test**: Reduced from 101+ rules to 14 essential permissions
  - Cover all major test frameworks with wildcard patterns
  - Kept test-before-push and coverage reporting hooks

- **plugin-security**: Complete redesign from 81 conflicting deny rules to 12 focused ones
  - Only deny truly dangerous operations (system destruction, remote code execution)
  - Removed conflicts with normal development (no more blocking .env reads or Python writes)
  - Added smart hooks for credential detection in code

## Philosophy Change
- Trust developers more - use broad wildcard permissions instead of micro-managing
- Keep useful automation hooks while removing permission bloat
- Focus security on actual threats, not theoretical risks
- Improve developer experience by reducing friction