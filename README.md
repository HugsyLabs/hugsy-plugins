# 🔌 Hugsy Plugins

Official plugin ecosystem for [Hugsy](https://github.com/HugsyLab/hugsy) - Configuration management for Claude Code.

[![CI](https://github.com/HugsyLab/hugsy-plugins/actions/workflows/ci.yml/badge.svg)](https://github.com/HugsyLab/hugsy-plugins/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Available Packages

### Language Plugins

| Package                                             | Description                 | Version                                                   |
| --------------------------------------------------- | --------------------------- | --------------------------------------------------------- |
| [`@hugsylabs/plugin-python`](./packages/plugins/python) | Python development support  | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-python) |
| [`@hugsylabs/plugin-node`](./packages/plugins/node)     | Node.js development support | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-node)   |
| [`@hugsylabs/plugin-typescript`](./packages/plugins/typescript) | TypeScript support          | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-typescript) |
| `@hugsylabs/plugin-java`                                | Java development support    | Coming soon                                               |
| `@hugsylabs/plugin-go`                                  | Go development support      | Coming soon                                               |

### Command Plugins

| Package                                          | Description                    | Version                                                  |
| ------------------------------------------------ | ------------------------------ | -------------------------------------------------------- |
| [`@hugsylabs/commands-dev`](./packages/commands/dev) | Essential development commands | ![npm](https://img.shields.io/npm/v/@hugsylabs/commands-dev) |
| `@hugsylabs/commands-test`                           | Testing commands               | Coming soon                                              |
| `@hugsylabs/commands-git`                            | Git workflow commands          | Coming soon                                              |
| `@hugsylabs/commands-refactor`                       | Refactoring commands           | Coming soon                                              |

### Feature Plugins

| Package                  | Description     | Version     |
| ------------------------ | --------------- | ----------- |
| [`@hugsylabs/plugin-git`](./packages/plugins/git)      | Git integration | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-git) |
| [`@hugsylabs/plugin-test`](./packages/plugins/test)     | Test automation | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-test) |
| [`@hugsylabs/plugin-security`](./packages/plugins/security) | Security tools  | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-security) |
| [`@hugsylabs/plugin-docker`](./packages/plugins/docker)   | Docker support  | ![npm](https://img.shields.io/npm/v/@hugsylabs/plugin-docker) |

### Presets

| Package                     | Description            | Version     |
| --------------------------- | ---------------------- | ----------- |
| [`@hugsylabs/preset-recommended`](./packages/presets/recommended) | Recommended setup      | ![npm](https://img.shields.io/npm/v/@hugsylabs/preset-recommended) |
| `@hugsylabs/preset-frontend`    | Frontend development   | Coming soon |
| `@hugsylabs/preset-backend`     | Backend development    | Coming soon |
| `@hugsylabs/preset-fullstack`   | Full-stack development | Coming soon |

## 🚀 Quick Start

### Installation

Install the plugins you need:

```bash
# Language support
npm install @hugsylabs/plugin-python
npm install @hugsylabs/plugin-node

# Commands
npm install @hugsylabs/commands-dev

# Or use a preset
npm install @hugsylabs/preset-recommended
```

### Configuration

Add plugins to your `.hugsyrc.json`:

```json
{
  "extends": "@hugsylabs/hugsy-compiler/presets/development",
  "plugins": ["@hugsylabs/plugin-python", "@hugsylabs/plugin-node", "@hugsylabs/commands-dev"]
}
```

Or use a preset:

```json
{
  "extends": "@hugsylabs/preset-frontend"
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

1. **Language Plugins** (`@hugsylabs/plugin-*`) - Add support for programming languages
2. **Command Plugins** (`@hugsylabs/commands-*`) - Add slash commands for common tasks
3. **Feature Plugins** (`@hugsylabs/plugin-*`) - Add specific features like testing or security
4. **Presets** (`@hugsylabs/preset-*`) - Pre-configured combinations of plugins

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
