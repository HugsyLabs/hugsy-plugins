# @hugsy/preset-recommended

The recommended preset for Hugsy that provides a balanced configuration suitable for most projects.

## What's Included

This preset combines the following plugins:

### Development Plugins

- **@hugsy/plugin-git** - Git version control integration
- **@hugsy/plugin-node** - Node.js development support
- **@hugsy/plugin-typescript** - TypeScript compilation and type checking
- **@hugsy/plugin-test** - Testing framework support

### Security Plugin

- **@hugsy/plugin-security** - Security restrictions and protections

### Slash Commands

- **@hugsy/commands-dev** - Development productivity commands

## Features

✅ **Comprehensive Coverage**

- Support for Git, Node.js, TypeScript, and testing
- Security restrictions to protect sensitive files
- Productivity slash commands for common tasks

⚖️ **Balanced Permissions**

- Allows common development operations
- Asks before risky operations
- Denies dangerous operations via security plugin

🔧 **Developer Friendly**

- Pre-configured for typical development workflows
- Includes essential tools and frameworks
- Ready for both frontend and backend development

🛡️ **Security First**

- Protects environment files and secrets
- Blocks dangerous system commands
- Requires confirmation for destructive operations

## Installation

```bash
npm install @hugsy/preset-recommended
```

## Usage

In your `.hugsyrc.json`:

```json
{
  "extends": "@hugsy/preset-recommended"
}
```

Or with Hugsy CLI:

```bash
hugsy init recommended
```

## Configuration

The preset includes:

### Environment Variables

- `NODE_ENV`: "development"
- `DEBUG`: "false"
- Plus environment variables from included plugins

### Permissions

**Allowed:**

- Basic file operations (ls, pwd, cd, cat, grep)
- Script execution (npm run, yarn run, pnpm run)
- Read/Write/Edit all files (with security restrictions)
- All permissions from included plugins

**Ask Before:**

- Sudo commands
- File deletion (rm)
- File moving (mv)
- Recursive copying (cp -r)
- Risky operations from plugins

**Denied:**

- All dangerous operations from security plugin
- Access to sensitive files (.env, .ssh, etc.)
- System modifications

### Hooks

- Session start/end notifications
- All hooks from included plugins
- Security warnings and reminders

## Customization

You can extend or override the preset configuration:

```json
{
  "extends": "@hugsy/preset-recommended",
  "plugins": ["@hugsy/plugin-python"],
  "permissions": {
    "allow": ["Read(**/.env.example)"]
  }
}
```

## When to Use This Preset

✅ **Perfect for:**

- New projects
- General web development
- Node.js applications
- TypeScript projects
- Teams wanting a secure default

❌ **Consider alternatives for:**

- Python-only projects (add @hugsy/plugin-python)
- Minimal configurations (use fewer plugins)
- High-security environments (use stricter presets)

## Included Slash Commands

From @hugsy/commands-dev:

- `/quick-fix` - Quick fixes for common issues
- `/implement` - Implement features
- `/explain` - Code explanations
- `/debug` - Debugging assistance
- `/optimize` - Performance optimization
- `/review` - Code review
- `/scaffold` - Project scaffolding
- `/todo` - Task management
- `/cleanup` - Code cleanup
- `/setup-dev` - Development setup

## Philosophy

This preset follows the principle of **progressive enhancement**:

1. **Start Secure** - Security plugin protects by default
2. **Enable Productivity** - Development plugins add capabilities
3. **Maintain Balance** - Ask when uncertain, allow when safe
4. **Stay Flexible** - Easy to extend or override

## License

MIT
