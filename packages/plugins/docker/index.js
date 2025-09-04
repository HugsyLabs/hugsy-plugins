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
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // SIMPLIFIED: Trust Docker users
    const dockerPermissions = [
      // All Docker operations
      'Bash(docker *)',
      'Bash(docker-compose *)',
      'Bash(podman *)', // Alternative to Docker

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

    // Docker-specific environment variables
    Object.assign(config.env, {
      DOCKER_BUILDKIT: '1', // Enable BuildKit for better builds
      COMPOSE_DOCKER_CLI_BUILD: '1'
    });

    // Keep USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check Docker daemon before operations
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == docker* ]]; then
            docker info > /dev/null 2>&1 || echo "⚠️ Docker daemon is not running. Please start Docker first.";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Suggest optimization after build
    config.hooks.PostToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"docker build"* ]]; then
            echo "💡 Consider using docker build --squash to reduce image size";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Hook: Cleanup reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"docker-compose down"* ]]; then
            echo "🧹 Run docker system prune to clean up unused resources";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Hook: Security scan reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"docker build"* ]]; then
            echo "🔒 Consider scanning your image for vulnerabilities: docker scan <image>";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    return config;
  }
};
