# @hugsy/plugin-python

Python development support for Hugsy - comprehensive Python toolchain integration for Claude Code.

## Features

- 🐍 **Python Interpreter** - Full Python 2/3 support
- 📦 **Package Management** - pip, poetry, pipenv, conda
- 🧪 **Testing** - pytest, unittest, tox
- 🎨 **Code Quality** - black, isort, flake8, pylint, mypy, ruff
- 🔐 **Security** - bandit security linting
- 📚 **Documentation** - sphinx, mkdocs support
- 🌍 **Virtual Environments** - venv, virtualenv auto-detection

## Installation

```bash
npm install -D @hugsy/plugin-python
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "extends": "@hugsylabs/hugsy-compiler/presets/development",
  "plugins": ["@hugsy/plugin-python"]
}
```

## Permissions Added

### Allow

- Python execution (`python`, `python3`)
- Package management (`pip`, `poetry`, `pipenv`, `conda`)
- Virtual environment management
- Testing tools (`pytest`, `unittest`, `tox`)
- Code formatters (`black`, `isort`)
- Linters (`flake8`, `pylint`, `mypy`, `ruff`, `bandit`)
- Documentation tools (`sphinx`, `mkdocs`)
- Python file writing (`*.py`, `requirements.txt`, `setup.py`, etc.)

### Ask

- Package installation operations
- Database migrations

### Deny

- Force reinstall operations
- Virtual environment deletion
- Cache and build directory modifications

## Hooks

### Pre-Tool Use

- **Virtual Environment Detection** - Reminds to activate venv
- **Format Check** - Runs black before commits
- **Test Before Push** - Runs pytest before pushing

### Post-Tool Use

- **Type Checking** - Runs mypy after Python file changes
- **Requirements Update** - Reminds to update requirements.txt

## Environment Variables

- `PYTHONDONTWRITEBYTECODE=1` - Prevents .pyc file creation
- `PYTHONUNBUFFERED=1` - Ensures output is shown immediately
- `PIP_DISABLE_PIP_VERSION_CHECK=1` - Disables pip version warnings

## Examples

### Basic Python Project

```json
{
  "plugins": ["@hugsy/plugin-python"]
}
```

### Python with Testing

```json
{
  "plugins": ["@hugsy/plugin-python", "@hugsy/plugin-test"]
}
```

### Full Python Development

```json
{
  "plugins": [
    "@hugsy/plugin-python",
    "@hugsy/plugin-git",
    "@hugsy/plugin-test",
    "@hugsy/commands-dev"
  ]
}
```

## License

MIT
