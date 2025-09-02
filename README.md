# 🔌 Hugsy Plugins

Official plugin ecosystem for [Hugsy](https://github.com/HugsyLab/hugsy) - Configuration management for Claude Code.

[![CI](https://github.com/HugsyLab/hugsy-plugins/actions/workflows/ci.yml/badge.svg)](https://github.com/HugsyLab/hugsy-plugins/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Available Packages

### Language Plugins

| Package                                             | Description                 | Version                                                   |
| --------------------------------------------------- | --------------------------- | --------------------------------------------------------- |
| [`@hugsy/plugin-python`](./packages/plugins/python) | Python development support  | ![npm](https://img.shields.io/npm/v/@hugsy/plugin-python) |
| [`@hugsy/plugin-node`](./packages/plugins/node)     | Node.js development support | ![npm](https://img.shields.io/npm/v/@hugsy/plugin-node)   |
| `@hugsy/plugin-typescript`                          | TypeScript support          | Coming soon                                               |
| `@hugsy/plugin-java`                                | Java development support    | Coming soon                                               |
| `@hugsy/plugin-go`                                  | Go development support      | Coming soon                                               |

### Command Plugins

| Package                                          | Description                    | Version                                                  |
| ------------------------------------------------ | ------------------------------ | -------------------------------------------------------- |
| [`@hugsy/commands-dev`](./packages/commands/dev) | Essential development commands | ![npm](https://img.shields.io/npm/v/@hugsy/commands-dev) |
| `@hugsy/commands-test`                           | Testing commands               | Coming soon                                              |
| `@hugsy/commands-git`                            | Git workflow commands          | Coming soon                                              |
| `@hugsy/commands-refactor`                       | Refactoring commands           | Coming soon                                              |

### Feature Plugins

| Package                  | Description     | Version     |
| ------------------------ | --------------- | ----------- |
| `@hugsy/plugin-git`      | Git integration | Coming soon |
| `@hugsy/plugin-test`     | Test automation | Coming soon |
| `@hugsy/plugin-security` | Security tools  | Coming soon |
| `@hugsy/plugin-docker`   | Docker support  | Coming soon |

### Presets

| Package                     | Description            | Version     |
| --------------------------- | ---------------------- | ----------- |
| `@hugsy/preset-recommended` | Recommended setup      | Coming soon |
| `@hugsy/preset-frontend`    | Frontend development   | Coming soon |
| `@hugsy/preset-backend`     | Backend development    | Coming soon |
| `@hugsy/preset-fullstack`   | Full-stack development | Coming soon |

## 🚀 Quick Start

### Installation

Install the plugins you need:

```bash
# Language support
npm install -D @hugsy/plugin-python
npm install -D @hugsy/plugin-node

# Commands
npm install -D @hugsy/commands-dev

# Or use a preset
npm install -D @hugsy/preset-recommended
```

### Configuration

Add plugins to your `.hugsyrc.json`:

```json
{
  "extends": "@hugsylabs/hugsy-compiler/presets/development",
  "plugins": ["@hugsy/plugin-python", "@hugsy/plugin-node", "@hugsy/commands-dev"]
}
```

Or use a preset:

```json
{
  "extends": "@hugsy/preset-frontend"
}
```

### Compile and Install

```bash
hugsy install
```

## 📖 Documentation

### What are Hugsy Plugins?

Hugsy plugins extend Claude Code's capabilities by modifying its configuration during compilation. They can:

- ✅ Add permissions for tools and commands
- 🪝 Set up hooks for automated workflows
- 🌍 Configure environment variables
- 💬 Add custom slash commands

### Plugin Types

1. **Language Plugins** (`@hugsy/plugin-*`) - Add support for programming languages
2. **Command Plugins** (`@hugsy/commands-*`) - Add slash commands for common tasks
3. **Feature Plugins** (`@hugsy/plugin-*`) - Add specific features like testing or security
4. **Presets** (`@hugsy/preset-*`) - Pre-configured combinations of plugins

### Creating Your Own Plugin

```javascript
// my-plugin.js
export default {
  name: 'my-plugin',
  version: '1.0.0',

  transform(config) {
    // Add permissions
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.allow.push('Bash(my-tool *)');

    // Add hooks
    config.hooks = config.hooks || {};
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];
    config.hooks.PreToolUse.push({
      matcher: 'Write(**/*.js)',
      command: 'echo "JavaScript file modified"'
    });

    // Add environment variables
    config.env = config.env || {};
    config.env.MY_VAR = 'value';

    return config;
  }
};
```

## 🏗️ Development

This is a monorepo managed with pnpm and Turbo.

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run in development mode
pnpm dev
```

### Creating a New Plugin

1. Create a new directory under `packages/plugins/` or `packages/commands/`
2. Add a `package.json` with the correct naming convention
3. Create an `index.js` with the plugin export
4. Add a `README.md` with documentation
5. Add tests if applicable

### Publishing

We use [changesets](https://github.com/changesets/changesets) for version management:

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version

# Publish to npm
pnpm release
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Ideas for Contributions

- 🌍 More language plugins (Rust, C++, Ruby, PHP)
- 🛠️ Framework-specific plugins (React, Vue, Django, Rails)
- 💬 Domain-specific commands (data science, DevOps, mobile)
- 🎨 Tool integrations (Kubernetes, AWS, database tools)

## 📄 License

MIT - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Hugsy Main Repository](https://github.com/HugsyLab/hugsy)
- [Documentation](https://hugsy.dev)
- [NPM Organization](https://www.npmjs.com/org/hugsy)

---

Made with ❤️ by the Hugsy community
