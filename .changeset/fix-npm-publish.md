---
"@hugsy/plugin-docker": patch
"@hugsy/plugin-git": patch
"@hugsy/plugin-node": patch
"@hugsy/plugin-python": patch
"@hugsy/plugin-typescript": patch
"@hugsy/plugin-test": patch
"@hugsy/plugin-security": patch
"@hugsy/commands-dev": patch
"@hugsy/preset-recommended": patch
---

fix: Add publishConfig for npm publishing

- Added `publishConfig.access: "public"` to all packages to enable npm publishing for scoped packages
- This fixes the npm 404 error when publishing @hugsy scoped packages