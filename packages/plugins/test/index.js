/**
 * @hugsylabs/plugin-test
 * Test execution support for Claude Code
 */

export default {
  name: 'plugin-test',
  version: '0.0.1',
  description: 'Test execution support for various testing frameworks',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.hooks = config.hooks || {};

    // SIMPLIFIED: Trust test runners
    const testPermissions = [
      // All test commands (covers jest, vitest, mocha, etc.)
      'Bash(npm test*)',
      'Bash(yarn test*)',
      'Bash(pnpm test*)',
      'Bash(jest *)',
      'Bash(vitest *)',
      'Bash(mocha *)',
      'Bash(pytest *)',
      'Bash(go test *)',
      'Bash(cargo test *)',

      // Test files
      'Write(**/*.test.*)',
      'Write(**/*.spec.*)',
      'Write(**/__tests__/**)',
      'Write(**/test/**)',
      'Write(**/tests/**)'
    ];

    // Add permissions that aren't already present
    testPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask for coverage deletion (might want to keep it)
    const askPermissions = [
      'Bash(rm -rf coverage)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Run tests before push
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push *)',
      command: 'npm test --if-present || yarn test --if-present || pnpm test --if-present || echo "⚠️ No tests found"'
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Coverage report after tests
    config.hooks.PostToolUse.push({
      matcher: 'Bash(*test*)',
      command: 'test -d coverage && echo "📊 Coverage report generated in ./coverage" || true'
    });

    // Hook: Suggest test creation
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.{js,ts,py})',
      command: 'echo "💡 Remember to write tests for your new code"'
    });

    return config;
  }
};
