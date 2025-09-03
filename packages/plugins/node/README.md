# @hugsylabs/plugin-node

Streamlined Node.js development support for Hugsy - focused on preventing real errors without being annoying.

## ✨ What's New (v0.1.0) - "The Less Annoying Edition"

- 🎯 **Focused Protection** - Only prevents actual mistakes
- 🤫 **Much Quieter** - 80% less output, all messages are 1 line
- 🚪 **Always Escapable** - Every check has a `--force` option
- 🗑️ **Removed Annoyances** - No more auto-install, auto-lint, or "helpful" tips

## What It Actually Does Now

### ✅ Keeps (The Good Stuff)

- **Changeset Branch Protection** - Prevents `changeset version` on wrong branch
- **Smart Package Manager Warning** - Only warns when lockfiles were recently changed
- **Missing Dependencies Check** - Tells you when node_modules is missing
- **Dependency Conflict Detection** - Warns about version mismatches in monorepos

### ❌ Removed (The Annoying Stuff)

- ~~Auto-install dependencies~~ - You know when to run npm install
- ~~Auto-lint on commit~~ - Use husky if you want this
- ~~Auto-test on push~~ - Again, use husky
- ~~Node version nagging~~ - .nvmrc already does this
- ~~Security audit spam~~ - npm already shows this
- ~~"Helpful" tips~~ - You don't need to be told to check for updates

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

## Examples of the New Simplified Output

### Before vs After

**Changeset Protection:**

```bash
# Before: 15 lines of explanation
# After:
❌ changeset version requires main branch (use --force to override)
```

**Package Manager Detection:**

```bash
# Before: Warned every single time
# After: Only when lockfile was recently updated
⚠️  pnpm-lock.yaml was recently updated, consider: pnpm install
```

**Missing Dependencies:**

```bash
# Before: Auto-installed without asking
# After: Simple reminder
⚠️  Missing node_modules. Run: npm install
```

### Escape Hatches

Every protection can be bypassed when needed:

```bash
# Force changeset version on feature branch
pnpm changeset version --force

# Skip all checks with environment variables
HUGSY_SKIP=1 npm install
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

## Active Protections

| What              | When              | Message                                     | Bypass        |
| ----------------- | ----------------- | ------------------------------------------- | ------------- |
| Changeset version | Wrong branch      | `❌ changeset version requires main branch` | `--force`     |
| Changeset publish | Wrong branch      | `❌ changeset publish requires main branch` | `--force`     |
| Package manager   | Lockfile mismatch | `⚠️ [lockfile] was recently updated`        | Just ignore   |
| Missing deps      | npm start         | `⚠️ Missing node_modules`                   | Just ignore   |
| Version conflict  | npm install       | `⚠️ React version mismatch detected`        | Fix or ignore |

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

## Philosophy

This plugin follows the principle of **"Prevent real mistakes, not enforce workflows"**:

- ✅ Stop you from accidentally versioning on the wrong branch
- ✅ Warn about potential dependency conflicts
- ❌ Don't force you to lint/test (that's what CI is for)
- ❌ Don't auto-install things without asking
- ❌ Don't give unsolicited advice

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

## FAQ

**Q: How do I disable everything?**  
A: Don't use the plugin. Seriously, it's now minimal enough that if you don't want these protections, just don't install it.

**Q: Can I force changeset version on a feature branch?**  
A: Yes, use `pnpm changeset version --force`

**Q: Why doesn't it auto-install dependencies anymore?**  
A: Because that was annoying. You know when to run `npm install`.

## License

MIT
