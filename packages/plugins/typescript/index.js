/**
 * @hugsylabs/plugin-typescript
 * TypeScript development support for Claude Code
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

    // SIMPLIFIED: TypeScript is just JavaScript with types
    const tsPermissions = [
      // TypeScript compiler and tools
      'Bash(tsc *)',
      'Bash(tsx *)',
      'Bash(ts-node *)',

      // TypeScript files
      'Write(**/*.ts)',
      'Write(**/*.tsx)',
      'Write(**/*.d.ts)',
      'Write(**/tsconfig*.json)',
      'Write(**/@types/**)'
    ];

    // Add permissions that aren't already present
    tsPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // No need for ask/deny - TypeScript is safe

    // TypeScript-specific environment variables
    Object.assign(config.env, {
      TS_NODE_PROJECT: './tsconfig.json',
      TS_NODE_TRANSPILE_ONLY: 'true'  // Faster ts-node execution
    });

    // USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Type check before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git commit *)',
      command: 'tsc --noEmit || echo "⚠️ TypeScript errors found. Fix them before committing."'
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Generate types after changes
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.ts)',
      command: 'tsc --noEmit --incremental || true'  // Quick type check
    });

    return config;
  }
};
