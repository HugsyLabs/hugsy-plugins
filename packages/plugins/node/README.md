# @hugsy/plugin-node

Node.js development support for Hugsy - comprehensive Node.js and JavaScript toolchain integration for Claude Code.

## Features

- 🚀 **Node.js Runtime** - Full Node.js execution support
- 📦 **Package Managers** - npm, yarn, pnpm, bun support
- 🧪 **Testing** - Jest, Vitest, Mocha, Playwright, Cypress
- 🎨 **Code Quality** - ESLint, Prettier, Standard
- 🔧 **Build Tools** - Webpack, Vite, Rollup, esbuild, Turbo
- 📝 **TypeScript** - Full TypeScript support with tsc
- ⚡ **Modern Tools** - Support for tsx, ts-node, SWC, Babel

## Installation

```bash
npm install @hugsy/plugin-node
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "extends": "@hugsylabs/hugsy-compiler/presets/development",
  "plugins": ["@hugsy/plugin-node"]
}
```

## Permissions Added

### Allow

- Node.js execution (`node`, `npx`, `tsx`, `ts-node`)
- Package managers (`npm`, `yarn`, `pnpm`, `bun`)
- Common scripts (`npm run`, `npm test`, `npm start`, etc.)
- Testing frameworks (`jest`, `vitest`, `mocha`, `playwright`, `cypress`)
- Linters and formatters (`eslint`, `prettier`, `standard`)
- Build tools (`webpack`, `vite`, `rollup`, `esbuild`, `turbo`, `tsc`)
- JavaScript/TypeScript file writing (`*.js`, `*.jsx`, `*.ts`, `*.tsx`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)

### Ask

- Package installation (`npm install`, `yarn add`, `pnpm add`)
- Publishing packages (`npm publish`)
- Package linking (`npm link`)
- Security fixes (`npm audit fix`)
- Database migrations

### Deny

- Global package installation
- Force operations (`npm audit fix --force`)
- node_modules deletion
- Build output directories

## Hooks

### Pre-Tool Use

- **Lockfile Check** - Warns if no lockfile exists before install
- **Lint Before Commit** - Runs linter before git commits
- **Test Before Push** - Runs tests before git push

### Post-Tool Use

- **Build Reminder** - Suggests building after source changes
- **Lockfile Commit** - Reminds to commit lockfile changes
- **Security Audit** - Suggests running security audit after installs

## Environment Variables

- `NODE_ENV` - Set to 'development' by default
- `NODE_OPTIONS` - Configured with increased memory limit

## Examples

### Basic Node.js Project

```json
{
  "plugins": ["@hugsy/plugin-node"]
}
```

### Node.js with TypeScript

```json
{
  "plugins": ["@hugsy/plugin-node", "@hugsy/plugin-typescript"]
}
```

### Full Stack JavaScript

```json
{
  "plugins": [
    "@hugsy/plugin-node",
    "@hugsy/plugin-git",
    "@hugsy/plugin-test",
    "@hugsy/commands-dev"
  ]
}
```

### React/Vue/Angular Project

```json
{
  "extends": "@hugsy/preset-frontend",
  "plugins": ["@hugsy/plugin-node"]
}
```

## Supported Tools

### Package Managers

- npm (all versions)
- Yarn (Classic & Berry)
- pnpm
- Bun

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
- TSLint (legacy)

## License

MIT
