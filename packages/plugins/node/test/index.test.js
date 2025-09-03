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
    expect(result.permissions.deny).toBeInstanceOf(Array);
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

  it('should deny dangerous operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.deny).toContain('Bash(rm -rf /)');
    expect(result.permissions.deny).toContain('Bash(npm login)');
    expect(result.permissions.deny).toContain('Bash(npm adduser)');
    expect(result.permissions.deny).toContain('Bash(npm logout)');
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

    const changesetHook = result.hooks.PreToolUse.find(
      (hook) => hook.matcher === 'Bash(*changeset version*)'
    );

    expect(changesetHook).toBeDefined();
    expect(changesetHook.command).toContain('changeset version requires main branch');
    expect(changesetHook.command).toContain('--force to override');
  });

  it('should add smart package manager detection hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const pmHook = result.hooks.PreToolUse.find((hook) => hook.matcher === 'Bash(npm install*)');

    expect(pmHook).toBeDefined();
    expect(pmHook.command).toContain('recently updated');
    expect(pmHook.command).toContain('consider:');
  });

  it('should check for missing node_modules', () => {
    const config = {};
    const result = plugin.transform(config);

    const nmHook = result.hooks.PreToolUse.find(
      (hook) => hook.matcher === 'Bash(npm start*)' && hook.command.includes('node_modules')
    );

    expect(nmHook).toBeDefined();
    expect(nmHook.command).toContain('Missing node_modules');
  });

  it('should add dependency conflict detection', () => {
    const config = {};
    const result = plugin.transform(config);

    const conflictHook = result.hooks.PreToolUse.find(
      (hook) => hook.matcher === 'Bash(npm install*|yarn install*|pnpm install*)'
    );

    expect(conflictHook).toBeDefined();
    expect(conflictHook.command).toContain('version mismatch');
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
        ask: ['Bash(dangerous *)'],
        deny: ['Bash(forbidden *)']
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(custom *)');
    expect(result.permissions.ask).toContain('Bash(dangerous *)');
    expect(result.permissions.deny).toContain('Bash(forbidden *)');
  });
});
