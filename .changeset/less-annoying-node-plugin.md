---
'@hugsylabs/plugin-node': minor
---

Major simplification of plugin-node to be less annoying

### Breaking Changes

- Removed auto-install of dependencies
- Removed auto-lint on commit
- Removed auto-test on push
- Removed all post-hook "helpful" messages
- Removed Node version nagging

### Improvements

- Simplified all error messages to 1 line
- Added `--force` option to bypass changeset protection
- Package manager detection now only warns on recent lockfile changes
- Added dependency version conflict detection for monorepos
- 80% reduction in console output

### Philosophy Change

From "protective nanny" to "minimal guardian" - only prevents real mistakes, doesn't enforce workflows
