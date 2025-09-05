import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsylabs/plugin-security', () => {
  it('should have correct plugin metadata', () => {
    expect(plugin.name).toBe('plugin-security');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBeTruthy();
  });

  it('should have a transform function', () => {
    expect(typeof plugin.transform).toBe('function');
  });

  it('should ask before risky operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.ask).toBeDefined();
    expect(result.permissions.ask).toContain('Bash(rm -rf *)');
    expect(result.permissions.ask).toContain('Bash(sudo *)');
    expect(result.permissions.ask).toContain('Bash(git push --force origin main)');
    expect(result.permissions.ask).toContain('Bash(npm install -g *)');
  });

  it('should add security hooks', () => {
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
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(echo *)');
    expect(result.permissions.allow).toContain('Bash(echo *)');
  });

  it('should have hooks for SSH and env file warnings', () => {
    const config = {};
    const result = plugin.transform(config);

    // Check that we have hooks for SSH and env files
    const sshHook = result.hooks.PreToolUse.find((h) => h.matcher === 'Write(**/.ssh/**)');
    const envHook = result.hooks.PreToolUse.find((h) => h.matcher === 'Write(**/.env*)');

    expect(sshHook).toBeDefined();
    expect(envHook).toBeDefined();
  });

  it('should have hook for credential detection', () => {
    const config = {};
    const result = plugin.transform(config);

    // Check that we have a hook for detecting credentials in code
    const credentialHook = result.hooks.PostToolUse.find(
      (h) => h.matcher === 'Write(**/*.{js,ts,py,java,go})'
    );

    expect(credentialHook).toBeDefined();
  });
});
