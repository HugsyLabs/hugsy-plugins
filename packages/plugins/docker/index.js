/**
 * @hugsylabs/plugin-docker
 * Docker container management support for Claude Code
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

    // SIMPLIFIED: Trust Docker users
    const dockerPermissions = [
      // All Docker operations
      'Bash(docker *)',
      'Bash(docker-compose *)',
      'Bash(podman *)',  // Alternative to Docker

      // Docker-related files
      'Write(**/Dockerfile*)',
      'Write(**/docker-compose*.yml)',
      'Write(**/docker-compose*.yaml)',
      'Write(**/.dockerignore)'
    ];

    // Add permissions that aren't already present
    dockerPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask for potentially expensive operations
    const askPermissions = [
      'Bash(docker system prune *)',
      'Bash(docker volume rm *)',
      'Bash(docker rmi *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny dangerous operations
    const denyPermissions = [
      'Bash(docker rm -f $(docker ps -aq))',  // Don't delete ALL containers
      'Bash(docker system prune -a --volumes -f)'  // Don't wipe everything
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Docker-specific environment variables
    Object.assign(config.env, {
      DOCKER_BUILDKIT: '1',  // Enable BuildKit for better builds
      COMPOSE_DOCKER_CLI_BUILD: '1'
    });

    // Keep USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check Docker daemon before operations
    config.hooks.PreToolUse.push({
      matcher: 'Bash(docker *)',
      command: 'docker info > /dev/null 2>&1 || echo "⚠️ Docker daemon is not running. Please start Docker first."'
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Suggest optimization after build
    config.hooks.PostToolUse.push({
      matcher: 'Bash(docker build *)',
      command: 'echo "💡 Consider using docker build --squash to reduce image size"'
    });

    // Hook: Cleanup reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash(docker-compose down)',
      command: 'echo "🧹 Run docker system prune to clean up unused resources"'
    });

    // Hook: Security scan reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash(docker build *)',
      command: 'echo "🔒 Consider scanning your image for vulnerabilities: docker scan <image>"'
    });

    return config;
  }
};
