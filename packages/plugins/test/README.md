# @hugsy/plugin-test

Test execution support plugin for Hugsy that focuses solely on testing operations.

## Features

- 🧪 Multiple testing frameworks support (Jest, Vitest, Mocha)
- 🎭 E2E testing tools (Playwright, Cypress)
- 📊 Coverage tools integration
- 🔧 Test configuration management
- 📁 Test file patterns and directories
- ⚡ Test execution hooks

## Installation

```bash
npm install @hugsy/plugin-test
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsy/plugin-test"]
}
```

## What It Adds

### Permissions

**Allowed operations:**

- Jest testing (`jest`, `npm test`)
- Vitest testing (`vitest`, `vitest run`)
- Mocha testing (`mocha`)
- Playwright E2E (`playwright test`)
- Cypress E2E (`cypress run`)
- Coverage tools (`nyc`, `c8`)
- Test file editing (`.test.js`, `.spec.ts`, etc.)
- Test configuration files
- Test utilities and helpers

**Ask before:**

- Removing coverage directories
- Cleaning test output directories

### Hooks

**Pre-operation:**

- Reminds to run tests after editing code files
- Checks for package.json before running tests

**Post-operation:**

- Confirms test completion
- Notifies about coverage report generation
- Confirms test file creation

## Supported Testing Frameworks

### Unit Testing

- **Jest** - Popular testing framework by Facebook
- **Vitest** - Blazing fast unit test framework
- **Mocha** - Feature-rich JavaScript test framework

### E2E Testing

- **Playwright** - Cross-browser automation
- **Cypress** - Fast, easy and reliable testing

### Coverage Tools

- **nyc** - Istanbul's command line interface
- **c8** - Native V8 code coverage

## Single Responsibility

This plugin focuses **solely** on test execution:

- Running test suites
- Managing test files
- Coverage reporting
- Test configuration

It does NOT handle:

- Linting (use `@hugsy/plugin-lint`)
- Building (use `@hugsy/plugin-build`)
- Type checking (use `@hugsy/plugin-typescript`)
- Code formatting (use `@hugsy/plugin-format`)

## License

MIT
