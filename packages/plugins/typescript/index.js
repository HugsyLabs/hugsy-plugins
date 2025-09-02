/**
 * @hugsy/plugin-typescript
 * TypeScript development support for Claude Code
 *
 * This plugin focuses solely on TypeScript operations:
 * - TypeScript compiler permissions
 * - Type checking commands
 * - TypeScript configuration files
 * - Declaration files management
 */

export default {
  name: 'plugin-typescript',
  version: '0.0.1',
  description: 'TypeScript development support with type checking and compilation',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // TypeScript command permissions
    const tsPermissions = [
      // TypeScript compiler
      'Bash(tsc)',
      'Bash(tsc *)',
      'Bash(npx tsc)',
      'Bash(npx tsc *)',
      'Bash(yarn tsc)',
      'Bash(yarn tsc *)',
      'Bash(pnpm tsc)',
      'Bash(pnpm tsc *)',

      // Type checking
      'Bash(npm run typecheck)',
      'Bash(npm run typecheck *)',
      'Bash(yarn typecheck)',
      'Bash(yarn typecheck *)',
      'Bash(pnpm typecheck)',
      'Bash(pnpm typecheck *)',
      'Bash(npm run type-check)',
      'Bash(yarn type-check)',
      'Bash(pnpm type-check)',

      // TSX and ts-node
      'Bash(tsx *)',
      'Bash(npx tsx *)',
      'Bash(ts-node *)',
      'Bash(npx ts-node *)',

      // Build commands
      'Bash(npm run build:types)',
      'Bash(yarn build:types)',
      'Bash(pnpm build:types)',

      // TypeScript files
      'Write(**/*.ts)',
      'Write(**/*.tsx)',
      'Write(**/*.d.ts)',
      'Write(**/*.d.mts)',
      'Write(**/*.d.cts)',
      'Write(**/tsconfig.json)',
      'Write(**/tsconfig.*.json)',
      'Write(**/tsconfig.node.json)',
      'Write(**/tsconfig.build.json)',
      'Write(**/tsconfig.spec.json)',
      'Write(**/tsconfig.test.json)',
      'Write(**/tsconfig.lib.json)',
      'Write(**/tsconfig.app.json)',
      'Write(**/tsconfig.base.json)',
      'Write(**/tsconfig.paths.json)',
      'Write(**/tsconfig.eslint.json)',
      'Write(**/@types/*)',
      'Write(**/@types/**/*)',

      // TypeScript ESLint
      'Bash(eslint --ext .ts)',
      'Bash(eslint --ext .tsx)',
      'Bash(eslint --ext .ts,.tsx)',
      'Bash(eslint **/*.ts)',
      'Bash(eslint **/*.tsx)',

      // TypeScript documentation
      'Bash(typedoc *)',
      'Bash(npx typedoc *)',

      // Module resolution
      'Bash(tsc --traceResolution)',
      'Bash(tsc --listFiles)',
      'Bash(tsc --showConfig)',

      // Watch mode
      'Bash(tsc --watch)',
      'Bash(tsc -w)',
      'Bash(npm run watch:types)',
      'Bash(yarn watch:types)',
      'Bash(pnpm watch:types)'
    ];

    // Add permissions that aren't already present
    tsPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask permissions for build operations
    const askPermissions = [
      'Bash(tsc --build --clean)',
      'Bash(rm -rf dist/types)',
      'Bash(rm -rf build/types)',
      'Bash(rm -rf types)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Add TypeScript-specific hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check for type errors before running
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm start)',
      command:
        'which tsc > /dev/null && tsc --noEmit --pretty false 2>&1 | grep -q "error TS" && echo "⚠️ TypeScript errors detected" || true'
    });

    // Hook: Remind about type checking
    config.hooks.PreToolUse.push({
      matcher: 'Write(**/*.ts)',
      command: 'echo "💡 Remember to run type checking after changes"'
    });

    config.hooks.PreToolUse.push({
      matcher: 'Write(**/*.tsx)',
      command: 'echo "💡 Remember to run type checking after changes"'
    });

    // Post-operation hooks
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: After modifying tsconfig
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/tsconfig*.json)',
      command: 'echo "📘 TypeScript config updated. Run tsc to verify configuration."'
    });

    // Hook: After creating declaration files
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.d.ts)',
      command: 'echo "🔍 Declaration file created. Type definitions are now available."'
    });

    // Environment variables for TypeScript
    config.env.TS_NODE_TRANSPILE_ONLY = config.env.TS_NODE_TRANSPILE_ONLY || '0';
    config.env.TS_NODE_PROJECT = config.env.TS_NODE_PROJECT || './tsconfig.json';

    return config;
  }
};
