import { describe, it, expect } from 'vitest';
import plugin from '../index.js';

describe('@hugsy/plugin-docker', () => {
  it('should have correct plugin metadata', () => {
    expect(plugin.name).toBe('plugin-docker');
    expect(plugin.version).toBe('0.0.1');
    expect(plugin.description).toBeTruthy();
  });

  it('should have a transform function', () => {
    expect(typeof plugin.transform).toBe('function');
  });

  it('should add Docker permissions with wildcards', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    // Simplified: trust Docker users with broad permissions
    expect(result.permissions.allow).toContain('Bash(docker *)');
    expect(result.permissions.allow).toContain('Bash(docker-compose *)');
    expect(result.permissions.allow).toContain('Bash(podman *)');
  });

  it('should add Docker file permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Write(**/Dockerfile*)');
    expect(result.permissions.allow).toContain('Write(**/docker-compose*.yml)');
    expect(result.permissions.allow).toContain('Write(**/docker-compose*.yaml)');
    expect(result.permissions.allow).toContain('Write(**/.dockerignore)');
  });

  it('should add ask permissions for potentially expensive operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.ask).toBeDefined();
    expect(result.permissions.ask).toContain('Bash(docker system prune *)');
    expect(result.permissions.ask).toContain('Bash(docker volume rm *)');
    expect(result.permissions.ask).toContain('Bash(docker rmi *)');
  });

  it('should add Docker hooks', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.hooks).toBeDefined();
    expect(result.hooks.PreToolUse).toBeDefined();
    expect(result.hooks.PostToolUse).toBeDefined();
    expect(result.hooks.PreToolUse.length).toBeGreaterThan(0);
    expect(result.hooks.PostToolUse.length).toBeGreaterThan(0);
  });

  it('should add Docker environment variables', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.env).toBeDefined();
    expect(result.env.COMPOSE_DOCKER_CLI_BUILD).toBe('1');
    expect(result.env.DOCKER_BUILDKIT).toBe('1');
  });

  it('should preserve existing config', () => {
    const config = {
      permissions: {
        allow: ['Bash(echo *)'],
        ask: ['Bash(sudo *)']
      },
      env: {
        CUSTOM_VAR: 'value'
      }
    };

    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(echo *)');
    expect(result.permissions.allow).toContain('Bash(docker *)');
    expect(result.permissions.ask).toContain('Bash(sudo *)');
    expect(result.env.CUSTOM_VAR).toBe('value');
    expect(result.env.DOCKER_BUILDKIT).toBe('1');
  });

  it('should not duplicate permissions', () => {
    const config = {
      permissions: {
        allow: ['Bash(docker *)']
      }
    };

    const result = plugin.transform(config);
    const dockerCount = result.permissions.allow.filter((p) => p === 'Bash(docker *)').length;

    expect(dockerCount).toBe(1);
  });

  it('should have Docker daemon check hook', () => {
    const config = {};
    const result = plugin.transform(config);

    const bashHooks = result.hooks.PreToolUse.filter((h) => h.matcher === 'Bash');
    const hasDockerDaemonCheck = bashHooks.some(
      (hook) =>
        hook.hooks &&
        hook.hooks[0] &&
        hook.hooks[0].command &&
        hook.hooks[0].command.includes('docker')
    );
    expect(hasDockerDaemonCheck).toBe(true);
  });
});
