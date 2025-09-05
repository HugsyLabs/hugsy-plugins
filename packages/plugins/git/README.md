# @hugsylabs/plugin-git

Git version control integration plugin for Hugsy that focuses solely on Git operations.

## Features

- 📝 Git command permissions for all common operations
- 🔒 Protection for dangerous Git operations
- 🎣 Pre and post operation hooks
- 📂 Git configuration file management
- 🐙 GitHub CLI integration
- ⚠️ Smart warnings for risky operations

## Installation

```bash
npm install @hugsylabs/plugin-git
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsylabs/plugin-git"]
}
```

## What It Adds

### Permissions

**Allowed operations:**

- Basic Git operations (`init`, `clone`, `status`)
- Staging commands (`add`, `reset`, `restore`)
- Committing (`commit`, `amend`)
- Branching (`branch`, `checkout`, `switch`, `merge`, `rebase`)
- Remote operations (`fetch`, `pull`, `push`)
- History viewing (`log`, `diff`, `show`, `blame`)
- Stashing (`stash`)
- Tags (`tag`)
- Submodules management
- Configuration (`config`)
- GitHub CLI (`gh`)
- Git files editing (`.gitignore`, `.gitattributes`, etc.)

**Ask before:**

- Force push operations
- Hard reset operations
- Clean operations
- Interactive rebase
- Cherry-pick operations
- Revert operations
- Global config changes

**Denied:**

- Force push to main/master branches
- Hard reset to origin/main or origin/master
- Direct editing of `.git` directory

### Hooks

**Pre-operation:**

- Warns about uncommitted changes before checkout
- Reminds to pull before push
- Warns when pushing to main branch

**Post-operation:**

- Reminds to push after commit
- Notifies about merge completion
- Suggests installing dependencies after clone

## Single Responsibility

This plugin focuses **solely** on Git operations:

- Version control commands
- Repository management
- Git configuration
- GitHub CLI integration

It does NOT handle:

- Build processes (use build plugins)
- Testing (use `@hugsylabs/plugin-test`)
- Code formatting (use format plugins)
- General file operations (use other plugins)

## Common Workflows

### Basic Git Flow

```bash
git status          # ✅ Allowed
git add .           # ✅ Allowed
git commit -m "msg" # ✅ Allowed
git push            # ✅ Allowed (with warning for main branch)
```

### Branch Management

```bash
git checkout -b feature  # ✅ Allowed
git merge develop       # ✅ Allowed
git rebase main        # ✅ Allowed
```

### Dangerous Operations

```bash
git push --force        # ⚠️ Requires confirmation
git reset --hard        # ⚠️ Requires confirmation
git clean -fd          # ⚠️ Requires confirmation
git push --force origin main  # ❌ Denied
```

## License

MIT
