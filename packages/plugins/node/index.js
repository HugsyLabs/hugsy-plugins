/**
 * @hugsylabs/plugin-node
 * Enhanced Node.js development support for Claude Code
 * Features: changeset protection, smart package manager detection, environment consistency
 */

export default {
  name: 'plugin-node',
  version: '0.0.1',
  description: 'Enhanced Node.js development support with intelligent features',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // Simplified configuration - most annoying features removed

    // ===== PERMISSIONS =====
    // Core Node.js tools permissions
    const nodePermissions = [
      // Package managers
      'Bash(node *)',
      'Bash(npm *)',
      'Bash(yarn *)',
      'Bash(pnpm *)',
      'Bash(npx *)',
      'Bash(bun *)',

      // Node version managers
      'Bash(nvm *)',
      'Bash(n *)',
      'Bash(fnm *)',

      // File operations for JS/TS projects
      'Read(**)',
      'Write(**)',
      'Edit(**)'
    ];

    // Add permissions that aren't already present
    nodePermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask for potentially destructive operations
    const askPermissions = [
      'Bash(npm publish)',
      'Bash(yarn publish)',
      'Bash(pnpm publish)',
      'Bash(npm install -g *)',
      'Bash(yarn global add *)',
      'Bash(pnpm add -g *)',
      'Bash(rm -rf node_modules)',
      'Bash(npm unpublish *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // ===== ENVIRONMENT VARIABLES =====
    Object.assign(config.env, {
      NODE_ENV: config.env.NODE_ENV || 'development',
      NODE_OPTIONS: config.env.NODE_OPTIONS || '--max-old-space-size=4096',
      // Disable npm update notifier in CI/automation
      NO_UPDATE_NOTIFIER: '1',
      // Enable colored output
      FORCE_COLOR: '1'
    });

    // ===== PRE-TOOL HOOKS =====
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Prevent changeset version on non-main branches (simple version)
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"changeset version"* ]]; then
            BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null);
            if [[ "$BRANCH" != "main" && "$BRANCH" != "master" && "$CMD" != *"--force"* ]]; then
              echo "❌ changeset version requires main branch (use --force to override)";
              exit 2;
            fi
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Also block npx changeset version and publish (simplified)
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"changeset publish"* ]]; then
            BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null);
            if [[ "$BRANCH" != "main" && "$BRANCH" != "master" && "$CMD" != *"--force"* ]]; then
              echo "❌ changeset publish requires main branch (use --force to override)";
              exit 2;
            fi
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Smart package manager detection - only warn on real conflicts
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == "npm install"* ]]; then
            # Only warn if lockfile exists AND was recently modified (potential conflict)
            if [ -f "pnpm-lock.yaml" ] && [ -n "$(find pnpm-lock.yaml -mtime -1 2>/dev/null)" ]; then
              echo "⚠️  pnpm-lock.yaml was recently updated, consider: pnpm install";
            elif [ -f "yarn.lock" ] && [ -n "$(find yarn.lock -mtime -1 2>/dev/null)" ]; then
              echo "⚠️  yarn.lock was recently updated, consider: yarn install";
            fi
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Only check for missing node_modules, don't auto-install
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == "npm start"* || "$CMD" == "npm run"* || "$CMD" == "npm dev"* ]]; then
            if [ ! -d "node_modules" ]; then
              echo "⚠️  Missing node_modules. Run: npm install";
            fi
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Detect potential dependency conflicts in monorepo
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"install"* ]]; then
            # Quick check for React version conflicts (common issue)
            if [ -f "package.json" ] && [ -d "packages" ]; then
              MAIN_REACT=$(grep '"react":' package.json 2>/dev/null | head -1 | grep -o "[0-9]*\\.[0-9]*" | head -1)
              if [ -n "$MAIN_REACT" ]; then
                CONFLICTS=$(find packages -name package.json -exec grep '"react":' {} \\; 2>/dev/null | grep -o "[0-9]*\\.[0-9]*" | grep -v "$MAIN_REACT" | head -1)
                if [ -n "$CONFLICTS" ]; then
                  echo "⚠️  React version mismatch detected (root: $MAIN_REACT, packages: $CONFLICTS)";
                fi
              fi
            fi
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Removed lint/test hooks - let users configure their own husky hooks

    // ===== POST-TOOL HOOKS =====
    // Removed all post-hooks - they were all annoying "helpful" messages

    return config;
  }
};
