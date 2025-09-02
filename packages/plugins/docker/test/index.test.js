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

  it('should add Docker container permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions).toBeDefined();
    expect(result.permissions.allow).toContain('Bash(docker ps)');
    expect(result.permissions.allow).toContain('Bash(docker start *)');
    expect(result.permissions.allow).toContain('Bash(docker stop *)');
    expect(result.permissions.allow).toContain('Bash(docker logs *)');
    expect(result.permissions.allow).toContain('Bash(docker inspect *)');
  });

  it('should add Docker Compose permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Bash(docker-compose up)');
    expect(result.permissions.allow).toContain('Bash(docker-compose down)');
    expect(result.permissions.allow).toContain('Bash(docker-compose ps)');
    expect(result.permissions.allow).toContain('Bash(docker-compose logs)');
    expect(result.permissions.allow).toContain('Bash(docker compose *)');
  });

  it('should add Docker file permissions', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.allow).toContain('Write(**/Dockerfile)');
    expect(result.permissions.allow).toContain('Write(**/.dockerignore)');
    expect(result.permissions.allow).toContain('Write(**/docker-compose.yml)');
    expect(result.permissions.allow).toContain('Write(**/docker-compose.yaml)');
  });

  it('should add ask permissions for dangerous operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.ask).toBeDefined();
    expect(result.permissions.ask).toContain('Bash(docker run *)');
    expect(result.permissions.ask).toContain('Bash(docker exec *)');
    expect(result.permissions.ask).toContain('Bash(docker rm *)');
    expect(result.permissions.ask).toContain('Bash(docker rmi *)');
    expect(result.permissions.ask).toContain('Bash(docker system prune)');
  });

  it('should deny destructive operations', () => {
    const config = {};
    const result = plugin.transform(config);

    expect(result.permissions.deny).toBeDefined();
    expect(result.permissions.deny).toContain('Bash(docker system prune -a --volumes)');
    expect(result.permissions.deny).toContain('Bash(docker rm -f $(docker ps -aq))');
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
    expect(result.permissions.allow).toContain('Bash(docker ps)');
    expect(result.permissions.ask).toContain('Bash(sudo *)');
    expect(result.permissions.ask).toContain('Bash(docker run *)');
    expect(result.env.CUSTOM_VAR).toBe('value');
    expect(result.env.DOCKER_BUILDKIT).toBe('1');
  });

  it('should not duplicate permissions', () => {
    const config = {
      permissions: {
        allow: ['Bash(docker ps)']
      }
    };

    const result = plugin.transform(config);
    const psCount = result.permissions.allow.filter((p) => p === 'Bash(docker ps)').length;

    expect(psCount).toBe(1);
  });
});
