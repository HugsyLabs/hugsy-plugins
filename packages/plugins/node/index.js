/**
 * @hugsylabs/plugin-node
 * Node.js development support for Claude Code
 */

export default {
  name: 'plugin-node',
  version: '0.0.1',
  description: 'Node.js development support with npm, yarn, pnpm and toolchain integration',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // SIMPLIFIED: Trust developers, only essential permissions
    const nodePermissions = [
      // Core Node.js tools (covers ALL Node-related commands)
      'Bash(node *)',
      'Bash(npm *)',
      'Bash(yarn *)',
      'Bash(pnpm *)',
      'Bash(npx *)',

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
      'Bash(npm install -g *)',
      'Bash(rm -rf node_modules)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Only deny truly dangerous operations
    const denyPermissions = [
      'Bash(rm -rf /)',
      'Bash(npm login)'  // Prevent credential exposure
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Add useful environment variables
    Object.assign(config.env, {
      NODE_ENV: config.env.NODE_ENV || 'development',
      NODE_OPTIONS: config.env.NODE_OPTIONS || '--max-old-space-size=4096'
    });

    // Keep USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check for lockfile before install
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm install)',
      command: 'test -f package-lock.json || echo "⚠️ No package-lock.json found. Consider using npm ci for reproducible installs."'
    });

    // Hook: Lint before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git commit *)',
      command: 'npm run lint --if-present || yarn lint --if-present || pnpm lint --if-present || true'
    });

    // Hook: Test before push
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push *)',
      command: 'npm test --if-present || yarn test --if-present || pnpm test --if-present || true'
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Auto-install dependencies when package.json changes
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/package.json)',
      command: 'npm install || yarn install || pnpm install'
    });

    // Hook: Security audit reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash(npm install)',
      command: 'echo "🔒 Consider running npm audit to check for vulnerabilities."'
    });

    return config;
  }
};
