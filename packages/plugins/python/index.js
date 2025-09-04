/**
 * @hugsylabs/plugin-python
 * Python development support for Claude Code
 */

export default {
  name: 'plugin-python',
  version: '0.0.1',
  description: 'Python development support with pip, poetry, and virtual environments',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // SIMPLIFIED: Trust Python developers
    const pythonPermissions = [
      // All Python operations
      'Bash(python *)',
      'Bash(python3 *)',
      'Bash(pip *)',
      'Bash(pip3 *)',
      'Bash(poetry *)',
      'Bash(pipenv *)',
      'Bash(conda *)',
      'Bash(pytest *)',
      'Bash(black *)',
      'Bash(flake8 *)',
      'Bash(mypy *)',
      'Bash(ruff *)',

      // Python files
      'Read(**/*.py)',
      'Write(**/*.py)',
      'Edit(**/*.py)',

      // Config files
      'Write(**/requirements*.txt)',
      'Write(**/pyproject.toml)',
      'Write(**/setup.py)',
      'Write(**/setup.cfg)',
      'Write(**/.python-version)',
      'Write(**/Pipfile*)',
      'Write(**/poetry.lock)'
    ];

    // Add permissions that aren't already present
    pythonPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask for system-wide installations
    const askPermissions = [
      'Bash(pip install --user *)',
      'Bash(pip install --global *)',
      'Bash(sudo pip *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Python-specific environment variables
    Object.assign(config.env, {
      PYTHONUNBUFFERED: '1', // See output in real-time
      PYTHONDONTWRITEBYTECODE: '1', // Don't create .pyc files
      PYTHONPATH: '.' // Include current directory
    });

    // USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Activate virtual environment reminder
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"pip install"* ]]; then
            test -d venv || test -d .venv || echo "💡 Consider creating a virtual environment: python -m venv venv";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Hook: Format before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"git commit"* ]]; then
            black . --check --quiet 2>/dev/null || echo "⚠️ Code not formatted. Run: black .";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Auto-install requirements
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/requirements.txt)',
      command: 'pip install -r requirements.txt'
    });

    // Hook: Type checking reminder
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.py)',
      command: 'which mypy > /dev/null && echo "💡 Consider running mypy for type checking" || true'
    });

    return config;
  }
};
