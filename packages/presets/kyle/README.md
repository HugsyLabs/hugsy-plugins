# Kyle Preset

A personalized Hugsy preset with strict quality enforcement and architecture protection. This preset enforces zero tolerance for quality compromises and maintains clean architecture boundaries.

## Features

### Quality Enforcement

- **Zero `any` types** - Blocks all attempts to use TypeScript `any`
- **No type suppression** - Prevents `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`
- **Test requirements** - Enforces 85% minimum test coverage
- **Clean code** - Blocks `console.log`, `test.skip`, `.only()` calls

### Architecture Protection

- **Module boundaries** - Enforces proper package separation (core, ui, cli, types)
- **No duplication** - Prevents reimplementation of existing features
- **Proper dependencies** - Ensures correct dependency direction

### Automatic Validation

- **Pre-commit checks** - Validates code before changes are made
- **Post-edit validation** - Runs tests, lint, and build after modifications
- **Intent analysis** - Warns about potential quality issues in prompts

## Installation

```bash
pnpm add @hugsy/preset-kyle
```

## Usage

### With Hugsy CLI

```bash
hugsy use kyle
```

### Manual Configuration

Add to your `.clauderc` or `claude.config.json`:

```json
{
  "preset": "kyle"
}
```

## Hooks

### Pre-Tool Use Hooks

#### Quality Guard

Blocks forbidden patterns in code before they're written:

- TypeScript anti-patterns (`any`, `@ts-ignore`)
- Test anti-patterns (`test.skip`, `.only()`)
- Debug code (`console.log`)

#### Architecture Check

Prevents architecture violations:

- Duplicate implementations
- Wrong package locations
- Module boundary violations

### Post-Tool Use Hook

#### Auto Validate

Automatically runs after code changes:

1. TypeScript compilation check
2. Test suite execution
3. Linting validation
4. Build verification

### User Prompt Submit Hook

#### Intent Analyzer

Analyzes prompts for potential quality issues and provides warnings

## Custom Commands

### /check-quality

Comprehensive quality check of the entire codebase

### /fix-types

Fix TypeScript errors without using `any` or type suppression

### /check-arch

Verify architecture compliance and module boundaries

### /validate-all

Run complete validation pipeline (types, tests, lint, build)

### /show-coverage

Display detailed test coverage report with improvement suggestions

## Specialized Agents

### Quality Enforcer

Strict code quality enforcement specialist

- Never compromises on TypeScript quality
- Enforces proper error handling
- Maintains high test coverage

### Architecture Guardian

Protects clean architecture boundaries

- Prevents code duplication
- Enforces module separation
- Maintains dependency rules

### Test Master

Testing expert for comprehensive coverage

- Achieves 85%+ test coverage
- Writes meaningful tests
- Covers edge cases

## Configuration

The preset enforces these quality standards:

```json
{
  "qualityRequirements": {
    "typescript": "zero-errors",
    "tests": "must-pass",
    "coverage": 85,
    "build": "must-succeed",
    "lint": "minimal-warnings"
  }
}
```

## Permissions

### Allowed

- Read all files
- Write source code files (ts, tsx, js, jsx, json, md, css)
- Run package managers (pnpm, npm, yarn)
- Run test tools (vitest, jest)
- Run build tools (tsc, eslint)
- Git operations

### Denied

- Writing to node_modules
- Writing to build outputs (dist, build, coverage)
- Dangerous commands (rm -rf /, sudo)
- Publishing packages

### Ask for Confirmation

- Package.json modifications
- Lock file changes
- GitHub workflow changes
- Installing new dependencies
- Destructive operations

## Philosophy

This preset embodies the principle that **high-quality code is non-negotiable**. It's designed for developers who:

1. **Never compromise on quality** - No shortcuts, no technical debt
2. **Maintain clean architecture** - Clear boundaries, no duplication
3. **Test thoroughly** - High coverage, meaningful tests
4. **Validate continuously** - Catch issues early and often

## Author

Kyle

## License

MIT
