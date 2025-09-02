# @hugsy/plugin-security

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
