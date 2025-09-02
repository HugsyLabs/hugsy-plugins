# @hugsy/commands-dev

Essential development slash commands for Hugsy - boost your productivity with Claude Code.

## Features

10 powerful slash commands for common development tasks:

- 🔧 **`/quick-fix`** - Analyze and fix the current error
- 🚀 **`/implement`** - Implement a feature step by step
- 📖 **`/explain`** - Explain how code works
- 🐛 **`/debug`** - Debug issues systematically
- ⚡ **`/optimize`** - Optimize code for performance or readability
- 👀 **`/review`** - Review recent changes
- 🏗️ **`/scaffold`** - Generate boilerplate code
- 📝 **`/todo`** - Find all TODO comments
- 🧹 **`/cleanup`** - Clean up and organize code
- 🛠️ **`/setup-dev`** - Set up development environment

## Installation

```bash
npm install -D @hugsy/commands-dev
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "extends": "@hugsylabs/hugsy-compiler/presets/development",
  "plugins": ["@hugsy/commands-dev"]
}
```

## Commands

### `/quick-fix [error-description]`

Quickly fix errors by analyzing stack traces and error messages. Provides minimal, targeted fixes.

### `/implement [feature-description]`

Implement features following best practices and project conventions. Includes tests when applicable.

### `/explain [file-or-function]`

Get clear explanations of how code works, including logic flow and important patterns.

### `/debug [issue-description]`

Debug issues methodically with strategic logging and systematic problem-solving.

### `/optimize [file-or-function]`

Optimize code for better performance or readability while maintaining correctness.

### `/review`

Review recent changes for code quality, best practices, and potential issues.

### `/scaffold [component-type] [name]`

Generate production-ready boilerplate code following project patterns.

### `/todo`

Find and manage TODO, FIXME, HACK, and NOTE comments across the codebase.

### `/cleanup`

Clean up code by removing unused elements and improving organization.

### `/setup-dev`

Set up the complete development environment for the project.

## Examples

### Fix an Error

```
/quick-fix TypeError: Cannot read property 'name' of undefined
```

### Implement a Feature

```
/implement Add user authentication with JWT tokens
```

### Explain Complex Code

```
/explain src/utils/parser.js
```

### Debug an Issue

```
/debug Users report the app crashes when uploading large files
```

### Scaffold a Component

```
/scaffold react-component UserProfile
```

## Best Practices

1. **Use `/quick-fix` for immediate problems** - Don't over-engineer simple fixes
2. **Use `/implement` for new features** - It ensures proper structure and testing
3. **Use `/explain` when onboarding** - Great for understanding unfamiliar code
4. **Use `/debug` for tricky bugs** - Systematic approach saves time
5. **Use `/review` before commits** - Catch issues early
6. **Use `/scaffold` for consistency** - Maintains project patterns
7. **Use `/cleanup` regularly** - Keep technical debt in check

## Combining with Other Plugins

Works great with:

- `@hugsy/plugin-test` - For test-driven development
- `@hugsy/plugin-git` - For version control workflows
- `@hugsy/commands-refactor` - For code improvements

## License

MIT
