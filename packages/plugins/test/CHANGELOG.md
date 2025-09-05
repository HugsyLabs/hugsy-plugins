# @hugsy/plugin-test

## 0.0.7

### Patch Changes

- fb023cb: Fix all URL and package name inconsistencies in documentation and package.json files.
  - Corrected GitHub URLs from `HugsyLab` to `HugsyLabs` in all package.json files
  - Updated package names from `@hugsy/` to `@hugsylabs/` in all README files to match actual NPM package names

## 0.0.6

### Patch Changes

- 49a5384: Fix hooks format to comply with Claude Code specifications and remove broken deny permissions
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

## 0.0.5

### Patch Changes

- 8bfbae8: Major plugin system improvements and simplification

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

## 0.0.4

### Patch Changes

- 7ae2535: Fix package names from @hugsy/_ to @hugsylabs/_ for all packages

## 0.0.3

### Patch Changes

- 781753f: fix: Add publishConfig for npm publishing
  - Added `publishConfig.access: "public"` to all packages to enable npm publishing for scoped packages
  - This fixes the npm 404 error when publishing @hugsy scoped packages

## 0.0.2

### Patch Changes

- 10d35e3: feat: Add Docker plugin for container management
  - Added new @hugsy/plugin-docker plugin with comprehensive Docker and Docker Compose support
  - Fixed npm install commands in README files (removed unnecessary -D flag)
  - Updated pnpm-lock.yaml to include new Docker plugin dependencies
