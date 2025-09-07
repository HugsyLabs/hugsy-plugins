import { describe, it, expect } from 'vitest';
import preset from '../index.js';

describe('@hugsylabs/preset-kyle', () => {
  it('should export preset with correct name', () => {
    expect(preset.name).toBe('preset-kyle');
  });

  it('should export preset with version', () => {
    expect(preset.version).toBe('1.0.0');
  });

  it('should have a transform function', () => {
    expect(typeof preset.transform).toBe('function');
  });

  it('should apply permissions to config', () => {
    const config = {};
    const result = preset.transform(config);

    expect(result.permissions).toBeDefined();
    expect(result.permissions.allow).toBeDefined();
    expect(result.permissions.allow).toContain('Read(**)');
    expect(result.permissions.deny).toBeDefined();
    expect(result.permissions.deny).toContain('Bash(npm publish)');
  });

  it('should apply hooks to config', () => {
    const config = {};
    const result = preset.transform(config);

    expect(result.hooks).toBeDefined();
    expect(result.hooks.PreToolUse).toBeDefined();
    expect(result.hooks.PostToolUse).toBeDefined();
    expect(result.hooks.UserPromptSubmit).toBeDefined();
  });

  it('should apply environment variables', () => {
    const config = {};
    const result = preset.transform(config);

    expect(result.env).toBeDefined();
    expect(result.env.NODE_ENV).toBe('development');
    expect(result.env.DEBUG).toBe('false');
  });

  it('should apply slash commands', () => {
    const config = {};
    const result = preset.transform(config);

    expect(result.commands).toBeDefined();
    expect(result.commands.files).toContain('./commands/check-quality.md');
    expect(result.commands.files).toContain('./commands/fix-types.md');
  });

  it('should apply subagents', () => {
    const config = {};
    const result = preset.transform(config);

    expect(result.subagents).toBeDefined();
    expect(result.subagents.files).toContain('./agents/quality-enforcer.md');
    expect(result.subagents.files).toContain('./agents/architecture-guardian.md');
  });

  it('should merge with existing config', () => {
    const config = {
      permissions: {
        allow: ['Bash(ls)']
      },
      env: {
        CUSTOM: 'value'
      }
    };

    const result = preset.transform(config);

    // Should preserve existing
    expect(result.permissions.allow).toContain('Bash(ls)');
    expect(result.env.CUSTOM).toBe('value');

    // Should add new
    expect(result.permissions.allow).toContain('Read(**)');
    expect(result.env.NODE_ENV).toBe('development');
  });

  it('should not duplicate permissions when merging', () => {
    const config = {
      permissions: {
        allow: ['Read(**)']
      }
    };

    const result = preset.transform(config);

    // Should not have duplicates
    const readCount = result.permissions.allow.filter((p) => p === 'Read(**)').length;
    expect(readCount).toBe(1);
  });
});
