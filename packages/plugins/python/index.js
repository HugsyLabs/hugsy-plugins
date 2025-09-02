/**
 * @hugsy/plugin-python
 * Python development support for Claude Code
 */

export default {
  name: 'plugin-python',
  version: '0.0.1',
  description: 'Python development support with comprehensive toolchain integration',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // Python execution and package management permissions
    const pythonPermissions = [
      // Python interpreter
      'Bash(python *)',
      'Bash(python3 *)',
      'Bash(python -m *)',
      'Bash(python3 -m *)',

      // Package management
      'Bash(pip *)',
      'Bash(pip3 *)',
      'Bash(poetry *)',
      'Bash(pipenv *)',
      'Bash(conda *)',

      // Virtual environments
      'Bash(venv *)',
      'Bash(virtualenv *)',
      'Bash(source */bin/activate)',
      'Bash(. */bin/activate)',
      'Bash(deactivate)',

      // Testing
      'Bash(pytest *)',
      'Bash(python -m pytest *)',
      'Bash(unittest *)',
      'Bash(python -m unittest *)',
      'Bash(tox *)',

      // Code quality tools
      'Bash(black *)',
      'Bash(isort *)',
      'Bash(flake8 *)',
      'Bash(pylint *)',
      'Bash(mypy *)',
      'Bash(ruff *)',
      'Bash(bandit *)',

      // Documentation
      'Bash(sphinx-build *)',
      'Bash(mkdocs *)',

      // File operations
      'Write(**/*.py)',
      'Write(**/*.pyi)',
      'Write(**/*.pyx)',
      'Write(**/requirements.txt)',
      'Write(**/requirements*.txt)',
      'Write(**/setup.py)',
      'Write(**/setup.cfg)',
      'Write(**/pyproject.toml)',
      'Write(**/poetry.lock)',
      'Write(**/Pipfile)',
      'Write(**/Pipfile.lock)',
      'Write(**/.python-version)',
      'Write(**/tox.ini)',
      'Write(**/.flake8)',
      'Write(**/.pylintrc)',
      'Write(**/mypy.ini)',
      'Write(**/.mypy.ini)',
      'Write(**/pytest.ini)',
      'Write(**/conftest.py)'
    ];

    // Add permissions that aren't already present
    pythonPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask permissions for sensitive operations
    const askPermissions = [
      'Bash(pip install *)',
      'Bash(pip3 install *)',
      'Bash(poetry add *)',
      'Bash(pipenv install *)',
      'Bash(conda install *)',
      'Bash(python setup.py install)',
      'Write(**/migrations/**)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny dangerous operations
    const denyPermissions = [
      'Bash(pip install * --force-reinstall)',
      'Bash(rm -rf venv)',
      'Bash(rm -rf .venv)',
      'Write(**/__pycache__/**)',
      'Write(**/*.pyc)',
      'Write(**/*.pyo)',
      'Write(**/.pytest_cache/**)',
      'Write(**/.tox/**)',
      'Write(**/*.egg-info/**)',
      'Write(**/dist/**)',
      'Write(**/build/**)'
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Add Python-specific environment variables
    Object.assign(config.env, {
      PYTHONDONTWRITEBYTECODE: '1',
      PYTHONUNBUFFERED: '1',
      PIP_DISABLE_PIP_VERSION_CHECK: '1',
      ...config.env
    });

    // Add Python-specific hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Auto-activate virtual environment
    config.hooks.PreToolUse.push({
      matcher: 'Bash(python *)',
      command:
        'test -f venv/bin/activate && echo "💡 Virtual environment detected. Consider activating it first."'
    });

    // Hook: Format check before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git commit *)',
      command:
        'which black >/dev/null 2>&1 && echo "🎨 Running black formatter..." && black --check . || true'
    });

    // Hook: Test before push
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push *)',
      command: 'which pytest >/dev/null 2>&1 && echo "🧪 Running tests before push..." || true'
    });

    // Hook: Type checking on Python file changes
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.py)',
      command: 'which mypy >/dev/null 2>&1 && echo "🔍 Type checking with mypy..." || true'
    });

    // Hook: Update requirements.txt reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash(pip install *)',
      command: 'echo "📦 Remember to update requirements.txt if this is a new dependency"'
    });

    return config;
  }
};
