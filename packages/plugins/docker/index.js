/**
 * @hugsy/plugin-docker
 * Docker container management support for Claude Code
 *
 * This plugin focuses solely on Docker operations:
 * - Docker container management
 * - Docker Compose orchestration
 * - Image operations
 * - Volume and network management
 */

export default {
  name: 'plugin-docker',
  version: '0.0.1',
  description: 'Docker container management with compose and image operations',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // Docker command permissions
    const dockerPermissions = [
      // Container operations
      'Bash(docker ps)',
      'Bash(docker ps *)',
      'Bash(docker container *)',
      'Bash(docker start *)',
      'Bash(docker stop *)',
      'Bash(docker restart *)',
      'Bash(docker logs *)',
      'Bash(docker inspect *)',
      'Bash(docker stats)',
      'Bash(docker stats *)',
      'Bash(docker top *)',
      'Bash(docker port *)',

      // Image operations
      'Bash(docker images)',
      'Bash(docker images *)',
      'Bash(docker image *)',
      'Bash(docker pull *)',
      'Bash(docker build *)',
      'Bash(docker tag *)',
      'Bash(docker history *)',

      // Docker Compose
      'Bash(docker-compose *)',
      'Bash(docker compose *)',
      'Bash(docker-compose up)',
      'Bash(docker-compose up *)',
      'Bash(docker-compose down)',
      'Bash(docker-compose down *)',
      'Bash(docker-compose ps)',
      'Bash(docker-compose logs)',
      'Bash(docker-compose logs *)',
      'Bash(docker-compose build)',
      'Bash(docker-compose build *)',
      'Bash(docker-compose restart *)',
      'Bash(docker-compose stop *)',
      'Bash(docker-compose start *)',
      'Bash(docker-compose exec *)',
      'Bash(docker-compose run *)',
      'Bash(docker-compose pull)',
      'Bash(docker-compose push)',

      // Volume operations
      'Bash(docker volume ls)',
      'Bash(docker volume create *)',
      'Bash(docker volume inspect *)',

      // Network operations
      'Bash(docker network ls)',
      'Bash(docker network create *)',
      'Bash(docker network inspect *)',
      'Bash(docker network connect *)',
      'Bash(docker network disconnect *)',

      // Docker info
      'Bash(docker info)',
      'Bash(docker version)',

      // Docker files
      'Write(**/Dockerfile)',
      'Write(**/Dockerfile.*)',
      'Write(**/.dockerignore)',
      'Write(**/docker-compose.yml)',
      'Write(**/docker-compose.yaml)',
      'Write(**/docker-compose.*.yml)',
      'Write(**/docker-compose.*.yaml)',
      'Write(**/compose.yml)',
      'Write(**/compose.yaml)',
      'Write(**/.env.docker)',
      'Write(**/docker-entrypoint.sh)',
      'Write(**/entrypoint.sh)'
    ];

    // Add permissions that aren't already present
    dockerPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask permissions for potentially dangerous operations
    const askPermissions = [
      'Bash(docker run *)',
      'Bash(docker exec *)',
      'Bash(docker rm *)',
      'Bash(docker rmi *)',
      'Bash(docker container prune)',
      'Bash(docker image prune)',
      'Bash(docker volume prune)',
      'Bash(docker network prune)',
      'Bash(docker system prune)',
      'Bash(docker volume rm *)',
      'Bash(docker network rm *)',
      'Bash(docker push *)',
      'Bash(docker-compose down -v)',
      'Bash(docker compose down -v)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny dangerous operations
    const denyPermissions = [
      'Bash(docker system prune -a --volumes)',
      'Bash(docker rm -f $(docker ps -aq))',
      'Bash(docker rmi -f $(docker images -q))'
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Add Docker-specific hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check Docker daemon
    config.hooks.PreToolUse.push({
      matcher: 'Bash(docker *)',
      command: 'docker info > /dev/null 2>&1 || echo "⚠️ Docker daemon is not running"'
    });

    // Hook: Warn about resource usage
    config.hooks.PreToolUse.push({
      matcher: 'Bash(docker run *)',
      command: 'echo "💡 Remember to limit resources with --memory and --cpus flags"'
    });

    // Hook: Compose file check
    config.hooks.PreToolUse.push({
      matcher: 'Bash(docker-compose up)',
      command:
        'test -f docker-compose.yml || test -f docker-compose.yaml || echo "⚠️ No docker-compose file found"'
    });

    // Post-operation hooks
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: After building image
    config.hooks.PostToolUse.push({
      matcher: 'Bash(docker build *)',
      command: 'echo "🏗️ Image built. Use docker images to see it."'
    });

    // Hook: After starting containers
    config.hooks.PostToolUse.push({
      matcher: 'Bash(docker-compose up *)',
      command: 'echo "🚀 Containers started. Use docker-compose ps to check status."'
    });

    // Hook: After stopping containers
    config.hooks.PostToolUse.push({
      matcher: 'Bash(docker-compose down)',
      command: 'echo "🛑 Containers stopped. Volumes are preserved unless -v flag was used."'
    });

    // Environment variables for Docker
    config.env.COMPOSE_DOCKER_CLI_BUILD = config.env.COMPOSE_DOCKER_CLI_BUILD || '1';
    config.env.DOCKER_BUILDKIT = config.env.DOCKER_BUILDKIT || '1';

    return config;
  }
};
