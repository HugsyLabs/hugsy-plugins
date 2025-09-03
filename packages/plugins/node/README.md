# @hugsylabs/plugin-node

Enhanced Node.js development support for Hugsy - comprehensive Node.js and JavaScript toolchain integration with intelligent features for Claude Code.

## ✨ New Features (v0.0.2)

- 🛡️ **Changeset Protection** - Prevents running `changeset version` on non-main branches
- 🔍 **Smart Package Manager Detection** - Automatically detects and warns about package manager mismatches
- 📌 **Node Version Checking** - Validates Node.js version against `.nvmrc`
- 🔄 **Auto-Install Dependencies** - Smart dependency installation based on lockfiles
- 🎯 **Enhanced Monorepo Support** - Better handling of workspace packages
- 🔒 **Improved Security** - Automatic vulnerability scanning after installs

## Features

- 🚀 **Node.js Runtime** - Full Node.js execution support
- 📦 **Package Managers** - npm, yarn, pnpm, bun support with smart detection
- 🧪 **Testing** - Jest, Vitest, Mocha, Playwright, Cypress
- 🎨 **Code Quality** - ESLint, Prettier, Standard with auto-run hooks
- 🔧 **Build Tools** - Webpack, Vite, Rollup, esbuild, Turbo
- 📝 **TypeScript** - Full TypeScript support with tsc
- ⚡ **Modern Tools** - Support for tsx, ts-node, SWC, Babel
- 🔐 **Security First** - Automatic security audits and vulnerability checks

## Installation

```bash
npm install @hugsylabs/plugin-node
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsylabs/plugin-node"]
}
```

## Key Protection Features

### Changeset Version Protection

The plugin now prevents accidental version bumps on feature branches:

```bash
# On feature branch
$ pnpm changeset version
❌ Error: Cannot run 'changeset version' on branch 'feat/my-feature'

📝 Correct workflow:
   1. Create changesets on feature branches: pnpm changeset add
   2. Merge your PR to main
   3. On main branch: pnpm changeset version
   4. Create and merge the release PR
```

### Smart Package Manager Detection

Automatically warns when using the wrong package manager:

```bash
# When yarn.lock exists but using npm
$ npm install
⚠️  Warning: Found yarn.lock but using npm install
   Consider using: yarn install
```

### Node Version Validation

Checks Node.js version against `.nvmrc`:

```bash
$ npm start
⚠️  Node version mismatch:
   Required: 18.17.0
   Current: v16.14.0
   Run: nvm use
```

## Permissions

### Allow

- Node.js execution (`node`, `npx`, `tsx`, `ts-node`)
- Package managers (`npm`, `yarn`, `pnpm`, `bun`)
- Node version managers (`nvm`, `n`, `fnm`)
- Common scripts (`npm run`, `npm test`, `npm start`, etc.)
- Testing frameworks (`jest`, `vitest`, `mocha`, `playwright`, `cypress`)
- Linters and formatters (`eslint`, `prettier`, `standard`)
- Build tools (`webpack`, `vite`, `rollup`, `esbuild`, `turbo`, `tsc`)
- JavaScript/TypeScript file operations

### Ask

- Package publishing (`npm publish`, `yarn publish`, `pnpm publish`)
- Global package installation
- Destructive operations (`rm -rf node_modules`)
- Package unpublishing

### Deny

- Credential operations (`npm login`, `npm adduser`)
- System-wide destructive operations

## Smart Hooks

### Pre-Tool Hooks

| Hook                      | Trigger             | Action                                |
| ------------------------- | ------------------- | ------------------------------------- |
| **Changeset Protection**  | `changeset version` | Blocks on non-main branches           |
| **Package Manager Check** | `npm install`       | Warns if wrong package manager        |
| **Node Version Check**    | `npm start`         | Validates against `.nvmrc`            |
| **Auto-Install**          | `npm start`         | Installs deps if node_modules missing |
| **Lint Check**            | `git commit`        | Runs lint before commit               |
| **Test Check**            | `git push`          | Runs tests before push                |

### Post-Tool Hooks

| Hook                | Trigger               | Action                              |
| ------------------- | --------------------- | ----------------------------------- |
| **Changeset Guide** | `changeset add`       | Shows next steps                    |
| **Smart Install**   | `package.json` change | Auto-installs with correct PM       |
| **Security Audit**  | After install         | Checks for vulnerabilities          |
| **Outdated Check**  | After install         | Suggests checking outdated packages |

## Environment Variables

- `NODE_ENV` - Set to 'development' by default
- `NODE_OPTIONS` - Configured with `--max-old-space-size=4096`
- `NO_UPDATE_NOTIFIER` - Disables npm update notifications
- `FORCE_COLOR` - Enables colored output

## Examples

### Basic Node.js Project

```json
{
  "plugins": ["@hugsylabs/plugin-node"]
}
```

### Monorepo Project

```json
{
  "plugins": ["@hugsylabs/plugin-node"],
  "env": {
    "TURBO_TOKEN": "your-token"
  }
}
```

### Full Stack JavaScript with Changesets

```json
{
  "plugins": ["@hugsylabs/plugin-node", "@hugsylabs/plugin-git", "@hugsylabs/plugin-test"]
}
```

## Changeset Workflow

The plugin enforces best practices for changeset workflow:

1. **Feature Branch**: Create changesets

   ```bash
   pnpm changeset add  # ✅ Allowed on any branch
   ```

2. **Main Branch**: Version packages

   ```bash
   git checkout main
   pnpm changeset version  # ✅ Only on main
   ```

3. **Main Branch**: Publish packages
   ```bash
   pnpm changeset publish  # ✅ Only on main
   ```

## Supported Tools

### Package Managers

- npm (all versions)
- Yarn (Classic & Berry)
- pnpm
- Bun

### Node Version Managers

- nvm
- n
- fnm

### Testing Frameworks

- Jest
- Vitest
- Mocha
- AVA
- Tap
- Playwright
- Cypress

### Build Tools

- Webpack
- Vite
- Rollup
- Parcel
- esbuild
- Turbo
- TypeScript Compiler (tsc)
- Babel
- SWC

### Linters & Formatters

- ESLint
- Prettier
- Standard
- XO
- Biome

## Best Practices

1. **Always use lockfiles** - The plugin will warn if no lockfile exists
2. **Commit lockfile changes** - Ensures reproducible builds
3. **Run tests before pushing** - Automated by the plugin
4. **Use `.nvmrc`** - Ensures consistent Node.js version
5. **Regular security audits** - Plugin reminds after installs

## Troubleshooting

### Changeset Version Blocked

If you see the changeset version error, ensure you're on the main branch:

```bash
git checkout main
git pull origin main
pnpm changeset version
```

### Package Manager Mismatch

If you see package manager warnings, use the suggested command:

```bash
# Instead of npm install, use:
pnpm install  # if pnpm-lock.yaml exists
yarn install  # if yarn.lock exists
```

### Node Version Issues

Install and use the correct Node version:

```bash
nvm install  # Installs version from .nvmrc
nvm use      # Switches to correct version
```

## License

MIT
