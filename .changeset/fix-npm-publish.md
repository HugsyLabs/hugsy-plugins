---
"@hugsylabs/plugin-docker": patch
"@hugsylabs/plugin-git": patch
"@hugsylabs/plugin-node": patch
"@hugsylabs/plugin-python": patch
"@hugsylabs/plugin-typescript": patch
"@hugsylabs/plugin-test": patch
"@hugsylabs/plugin-security": patch
"@hugsylabs/commands-dev": patch
"@hugsylabs/preset-recommended": patch
---

fix: Add publishConfig for npm publishing and fix package names

- Fixed package names from @hugsy/* to @hugsylabs/*
- Added `publishConfig.access: "public"` to all packages to enable npm publishing for scoped packages
- This fixes the npm 404 error when publishing @hugsylabs scoped packages