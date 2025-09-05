# @hugsylabs/plugin-typescript

TypeScript development support plugin for Hugsy that focuses solely on TypeScript operations.

## Features

- ✅ TypeScript compiler (`tsc`) permissions
- 🔍 Type checking commands support
- 📝 TypeScript configuration files management
- 🎯 Declaration files (`.d.ts`) handling
- 🚀 TSX and ts-node execution support
- 📊 TypeScript ESLint integration
- 👁️ Watch mode support

## Installation

```bash
npm install @hugsylabs/plugin-typescript
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsylabs/plugin-typescript"]
}
```

## What It Adds

### Permissions

**Allowed operations:**

- TypeScript compilation (`tsc`, `npx tsc`)
- Type checking (`typecheck`, `type-check`)
- TSX/ts-node execution
- TypeScript file editing (`.ts`, `.tsx`, `.d.ts`)
- Configuration files (`tsconfig.json` and variants)
- TypeScript ESLint
- TypeDoc generation
- Watch mode

**Ask before:**

- Clean builds (`tsc --build --clean`)
- Removing type directories

### Hooks

**Pre-operation:**

- Checks for TypeScript errors before `npm start`
- Reminds about type checking after editing `.ts`/`.tsx` files

**Post-operation:**

- Notifies after updating `tsconfig.json`
- Confirms declaration file creation

### Environment Variables

- `TS_NODE_TRANSPILE_ONLY`: Set to `0` for full type checking
- `TS_NODE_PROJECT`: Points to `./tsconfig.json`

## Single Responsibility

This plugin focuses **solely** on TypeScript operations:

- TypeScript compilation and type checking
- TypeScript configuration management
- Declaration files handling
- TypeScript-specific tooling

It does NOT handle:

- General Node.js operations (use `@hugsylabs/plugin-node`)
- Testing frameworks (use `@hugsylabs/plugin-test`)
- Build tools (use specific build tool plugins)
- Linting beyond TypeScript ESLint (use `@hugsylabs/plugin-lint`)

## License

MIT
