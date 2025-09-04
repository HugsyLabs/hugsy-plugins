import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsylabs/plugin-node', () => {
  it('should have correct name and description', () => {
    expect(plugin.name).toBe('plugin-node');
    expect(plugin.description).toBe(
      'Enhanced Node.js development support with intelligent features'
    );
  });

  it('should initialize config structure', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    expect(result.permissions.allow).toBeInstanceOf(Array);
    expect(result.permissions.ask).toBeInstanceOf(Array);
    expect(result.hooks).toBeDefined();
    expect(result.env).toBeDefined();
  });

  it('should add Node.js permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(node *)');
    expect(result.permissions.allow).toContain('Bash(npm *)');
    expect(result.permissions.allow).toContain('Bash(yarn *)');
    expect(result.permissions.allow).toContain('Bash(pnpm *)');
    expect(result.permissions.allow).toContain('Bash(bun *)');
  });

  it('should add Node version manager permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(nvm *)');
    expect(result.permissions.allow).toContain('Bash(n *)');
    expect(result.permissions.allow).toContain('Bash(fnm *)');
  });

  it('should add ask permissions for destructive operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.ask).toContain('Bash(npm publish)');
    expect(result.permissions.ask).toContain('Bash(yarn publish)');
    expect(result.permissions.ask).toContain('Bash(pnpm publish)');
    expect(result.permissions.ask).toContain('Bash(rm -rf node_modules)');
  });

  it('should set environment variables', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.env.NODE_ENV).toBe('development');
    expect(result.env.NODE_OPTIONS).toBe('--max-old-space-size=4096');
    expect(result.env.NO_UPDATE_NOTIFIER).toBe('1');
    expect(result.env.FORCE_COLOR).toBe('1');
  });

  it('should add simplified changeset version protection hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const changesetHooks = result.hooks.PreToolUse.filter((hook) => hook.matcher === 'Bash');

    // Check that we have Bash hooks
    expect(changesetHooks.length).toBeGreaterThan(0);

    // Check for changeset version protection in one of the hooks
    const hasChangesetProtection = changesetHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('changeset version requires main branch')
    );

    expect(hasChangesetProtection).toBe(true);
  });

  it('should add smart package manager detection hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PreToolUse.filter((hook) => hook.matcher === 'Bash');

    // Check for package manager detection in one of the hooks
    const hasPmDetection = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('recently updated') &&
        hook.hooks[0].command.includes('consider:')
    );

    expect(hasPmDetection).toBe(true);
  });

  it('should check for missing node_modules', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PreToolUse.filter((hook) => hook.matcher === 'Bash');

    // Check for node_modules detection in one of the hooks
    const hasNodeModulesCheck = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('Missing node_modules')
    );

    expect(hasNodeModulesCheck).toBe(true);
  });

  it('should add dependency conflict detection', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PreToolUse.filter((hook) => hook.matcher === 'Bash');

    // Check for conflict detection in one of the hooks
    const hasConflictDetection = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('version mismatch')
    );

    expect(hasConflictDetection).toBe(true);
  });

  it('should not have annoying post hooks', () => {
    const config = {};
    const result = plugin.transform(config);

    // Check that we removed all the annoying post-hooks
    const postHooks = result.hooks.PostToolUse || [];
    expect(postHooks.length).toBe(0);
  });

  it('should preserve existing permissions', () => {
    const config = {
      permissions: {
        allow: ['Bash(custom *)'],
        ask: ['Bash(dangerous *)']
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(custom *)');
    expect(result.permissions.ask).toContain('Bash(dangerous *)');
  });
});
