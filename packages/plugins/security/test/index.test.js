import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsy/plugin-security', () => {
  it('should have correct plugin metadata', () => {
    expect(plugin.name).toBe('plugin-security');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBeTruthy();
  });

  it('should have a transform function', () => {
    expect(typeof plugin.transform).toBe('function');
  });

  it('should deny sensitive file access', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    expect(result.permissions.deny).toBeDefined();
    expect(result.permissions.deny).toContain('Read(**/.env)');
    expect(result.permissions.deny).toContain('Read(**/*.key)');
    expect(result.permissions.deny).toContain('Read(**/.ssh/**)');
    expect(result.permissions.deny).toContain('Write(**/.env)');
    expect(result.permissions.deny).toContain('Write(**/*.key)');
  });

  it('should deny dangerous bash commands', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.deny).toContain('Bash(rm -rf /)');
    expect(result.permissions.deny).toContain('Bash(curl * | bash)');
    expect(result.permissions.deny).toContain('Bash(eval *)');
    expect(result.permissions.deny).toContain('Bash(npm install -g *)');
  });

  it('should ask before risky operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.ask).toBeDefined();
    expect(result.permissions.ask).toContain('Bash(rm -rf *)');
    expect(result.permissions.ask).toContain('Bash(chmod *)');
    expect(result.permissions.ask).toContain('Bash(docker run *)');
    expect(result.permissions.ask).toContain('Bash(git push --force)');
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
        allow: ['Bash(echo *)'],
        deny: ['Read(/custom/path)']
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(echo *)');
    expect(result.permissions.deny).toContain('Read(/custom/path)');
    expect(result.permissions.deny).toContain('Read(**/.env)');
  });

  it('should not duplicate deny permissions', () => {
    const config = {
      permissions: {
        deny: ['Read(**/.env)']
      }
    };

    const result = plugin.transform(config);
    const envCount = result.permissions.deny.filter((p) => p === 'Read(**/.env)').length;

    expect(envCount).toBe(1);
  });

  it('should protect cloud credentials', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.deny).toContain('Read(**/.aws/**)');
    expect(result.permissions.deny).toContain('Read(**/.gcloud/**)');
    expect(result.permissions.deny).toContain('Write(**/.aws/**)');
    expect(result.permissions.deny).toContain('Write(**/.gcloud/**)');
  });

  it('should protect database files', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.deny).toContain('Read(**/*.db)');
    expect(result.permissions.deny).toContain('Read(**/*.sqlite)');
    expect(result.permissions.deny).toContain('Write(**/*.db)');
    expect(result.permissions.deny).toContain('Write(**/*.sqlite)');
  });
});
