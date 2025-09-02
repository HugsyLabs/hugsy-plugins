import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsy/plugin-python', () => {
  it('should have correct plugin metadata', () => {
    expect(plugin.name).toBe('plugin-python');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBeTruthy();
  });

  it('should have a transform function', () => {
    expect(typeof plugin.transform).toBe('function');
  });

  it('should add Python permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    expect(result.permissions.allow).toContain('Bash(python *)');
    expect(result.permissions.allow).toContain('Bash(pip *)');
    expect(result.permissions.allow).toContain('Bash(pytest *)');
    expect(result.permissions.allow).toContain('Write(**/*.py)');
  });

  it('should add Python environment variables', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.env).toBeDefined();
    expect(result.env.PYTHONDONTWRITEBYTECODE).toBe('1');
    expect(result.env.PYTHONUNBUFFERED).toBe('1');
    expect(result.env.PIP_DISABLE_PIP_VERSION_CHECK).toBe('1');
  });

  it('should add Python hooks', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.hooks).toBeDefined();
    expect(result.hooks.PreToolUse).toBeDefined();
    expect(result.hooks.PostToolUse).toBeDefined();
    expect(result.hooks.PreToolUse.length).toBeGreaterThan(0);
    expect(result.hooks.PostToolUse.length).toBeGreaterThan(0);
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
    expect(result.permissions.allow).toContain('Bash(python *)');
    expect(result.env.CUSTOM_VAR).toBe('value');
    expect(result.env.PYTHONDONTWRITEBYTECODE).toBe('1');
  });
});
