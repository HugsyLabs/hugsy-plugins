import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsy/plugin-typescript', () => {
  it('should have correct plugin metadata', () => {
    expect(plugin.name).toBe('plugin-typescript');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBeTruthy();
  });

  it('should have a transform function', () => {
    expect(typeof plugin.transform).toBe('function');
  });

  it('should add TypeScript permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    // Simplified permissions
    expect(result.permissions.allow).toContain('Bash(tsc *)');
    expect(result.permissions.allow).toContain('Bash(tsx *)');
    expect(result.permissions.allow).toContain('Bash(ts-node *)');
    expect(result.permissions.allow).toContain('Write(**/*.ts)');
    expect(result.permissions.allow).toContain('Write(**/*.tsx)');
    expect(result.permissions.allow).toContain('Write(**/*.d.ts)');
    expect(result.permissions.allow).toContain('Write(**/tsconfig*.json)');
  });

  it('should add TypeScript environment variables', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.env).toBeDefined();
    expect(result.env.TS_NODE_TRANSPILE_ONLY).toBe('true');
    expect(result.env.TS_NODE_PROJECT).toBe('./tsconfig.json');
  });

  it('should add TypeScript hooks', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.hooks).toBeDefined();
    expect(result.hooks.PreToolUse).toBeDefined();
    expect(result.hooks.PostToolUse).toBeDefined();
    expect(result.hooks.PreToolUse.length).toBeGreaterThan(0);
    expect(result.hooks.PostToolUse.length).toBeGreaterThan(0);
  });

  it('should have type checking hook before commits', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PreToolUse.filter((h) => h.matcher === 'Bash');
    const hasTypeCheck = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('tsc --noEmit')
    );
    expect(hasTypeCheck).toBe(true);
  });

  it('should preserve existing config', () => {
    const config = {
      permissions: {
        allow: ['Bash(echo *)']
      },
      env: {
        CUSTOM_VAR: 'value'
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(echo *)');
    expect(result.permissions.allow).toContain('Bash(tsc *)');
    expect(result.env.CUSTOM_VAR).toBe('value');
    expect(result.env.TS_NODE_TRANSPILE_ONLY).toBe('true');
  });

  it('should not duplicate permissions', () => {
    const config = {
      permissions: {
        allow: ['Bash(tsc *)']
      }
    };

    const result = plugin.transform(config);
    const tscCount = result.permissions.allow.filter((p) => p === 'Bash(tsc *)').length;

    expect(tscCount).toBe(1);
  });

  it('should have reasonable defaults for permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    // No more ask permissions for TypeScript - trust developers
    expect(result.permissions.ask || []).not.toContain('Bash(tsc --build --clean)');
    expect(result.permissions.ask || []).not.toContain('Bash(rm -rf dist/types)');
  });
});
