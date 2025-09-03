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

  it('should add changeset version protection hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const changesetHook = result.hooks.PreToolUse.find(
      (hook) => hook.matcher === 'Bash(*changeset version*)'
    );

    expect(changesetHook).toBeDefined();
    expect(changesetHook.command).toContain("Cannot run 'changeset version' on branch");
  });

  it('should add package manager detection hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const pmHook = result.hooks.PreToolUse.find((hook) => hook.matcher === 'Bash(npm install*)');

    expect(pmHook).toBeDefined();
    expect(pmHook.command).toContain('Found yarn.lock but using npm install');
  });

  it('should add Node version check hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const versionHook = result.hooks.PreToolUse.find(
      (hook) => hook.matcher === 'Bash(npm start*)' && hook.command.includes('.nvmrc')
    );

    expect(versionHook).toBeDefined();
    expect(versionHook.command).toContain('Node version mismatch');
  });

  it('should add lint before commit hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const lintHook = result.hooks.PreToolUse.find((hook) => hook.matcher === 'Bash(git commit *)');

    expect(lintHook).toBeDefined();
    expect(lintHook.command).toContain('Running lint checks');
  });

  it('should add test before push hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const testHook = result.hooks.PreToolUse.find((hook) => hook.matcher === 'Bash(git push *)');

    expect(testHook).toBeDefined();
    expect(testHook.command).toContain('Running tests before push');
  });

  it('should add changeset guide post-hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const guideHook = result.hooks.PostToolUse.find(
      (hook) => hook.matcher === 'Bash(*changeset add*)'
    );

    expect(guideHook).toBeDefined();
    expect(guideHook.command).toContain('Changeset created successfully');
  });

  it('should add smart auto-install post-hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const installHook = result.hooks.PostToolUse.find(
      (hook) => hook.matcher === 'Write(**/package.json)'
    );

    expect(installHook).toBeDefined();
    expect(installHook.command).toContain('package.json was modified');
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
