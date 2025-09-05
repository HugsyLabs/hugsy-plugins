import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsylabs/plugin-test', () => {
  it('should have correct plugin metadata', () => {
    expect(plugin.name).toBe('plugin-test');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBeTruthy();
  });

  it('should have a transform function', () => {
    expect(typeof plugin.transform).toBe('function');
  });

  it('should add test framework permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    // Simplified: wildcards cover all test commands
    expect(result.permissions.allow).toContain('Bash(npm test*)');
    expect(result.permissions.allow).toContain('Bash(yarn test*)');
    expect(result.permissions.allow).toContain('Bash(pnpm test*)');
    expect(result.permissions.allow).toContain('Bash(jest *)');
    expect(result.permissions.allow).toContain('Bash(vitest *)');
    expect(result.permissions.allow).toContain('Bash(mocha *)');
    expect(result.permissions.allow).toContain('Bash(pytest *)');
  });

  it('should add test file permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Write(**/*.test.*)');
    expect(result.permissions.allow).toContain('Write(**/*.spec.*)');
    expect(result.permissions.allow).toContain('Write(**/__tests__/**)');
    expect(result.permissions.allow).toContain('Write(**/test/**)');
    expect(result.permissions.allow).toContain('Write(**/tests/**)');
  });

  it('should add test hooks', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.hooks).toBeDefined();
    expect(result.hooks.PreToolUse).toBeDefined();
    expect(result.hooks.PostToolUse).toBeDefined();
    expect(result.hooks.PreToolUse.length).toBeGreaterThan(0);
    expect(result.hooks.PostToolUse.length).toBeGreaterThan(0);
  });

  it('should have pre-push test hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PreToolUse.filter((h) => h.matcher === 'Bash');
    const hasPrePushTest = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('git push')
    );
    expect(hasPrePushTest).toBe(true);
  });

  it('should have coverage reporting hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PostToolUse.filter((h) => h.matcher === 'Bash');
    const hasCoverageReport = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('Coverage report')
    );
    expect(hasCoverageReport).toBe(true);
  });

  it('should add ask permissions for cleanup', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.ask).toBeDefined();
    expect(result.permissions.ask).toContain('Bash(rm -rf coverage)');
  });

  it('should preserve existing config', () => {
    const config = {
      permissions: {
        allow: ['Bash(echo *)']
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(echo *)');
    expect(result.permissions.allow).toContain('Bash(jest *)');
  });

  it('should not duplicate permissions', () => {
    const config = {
      permissions: {
        allow: ['Bash(jest *)']
      }
    };

    const result = plugin.transform(config);
    const jestCount = result.permissions.allow.filter((p) => p === 'Bash(jest *)').length;

    expect(jestCount).toBe(1);
  });

  it('should support multiple package managers', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(npm test*)');
    expect(result.permissions.allow).toContain('Bash(yarn test*)');
    expect(result.permissions.allow).toContain('Bash(pnpm test*)');
  });
});
