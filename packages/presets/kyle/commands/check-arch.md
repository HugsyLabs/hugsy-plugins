# Check Architecture Compliance

Analyze the codebase to ensure it follows the project's architecture guidelines and doesn't have duplicate implementations.

## Architecture Rules

### Package Responsibilities

1. **packages/core**
   - Purpose: Core business logic, compilation, configuration
   - Should contain: Compiler, presets, package management
   - Should NOT contain: UI components, React code, DOM manipulation

2. **packages/ui**
   - Purpose: Web interface and React components
   - Should contain: React components, styles, frontend logic
   - Should NOT contain: Core business logic, Node.js file operations

3. **packages/cli**
   - Purpose: Command-line interface
   - Should contain: CLI commands, terminal interaction
   - Should NOT contain: React, DOM APIs, UI components
   - Should use: Core package APIs instead of reimplementing

4. **packages/types**
   - Purpose: TypeScript type definitions only
   - Should contain: Interfaces, type aliases, type declarations
   - Should NOT contain: Function implementations, classes with logic

## Checks to Perform

1. **Module Boundary Violations**
   - Check if UI code exists in core packages
   - Check if core logic exists in UI packages
   - Check if Node.js modules are used in browser code

2. **Duplicate Implementations**
   - Identify features implemented multiple times
   - Find code that should reuse existing modules
   - Detect copy-pasted code across packages

3. **Dependency Direction**
   - Ensure dependencies flow correctly
   - UI and CLI should depend on Core, not vice versa
   - Types should not depend on implementations

4. **Import Analysis**
   - Check for circular dependencies
   - Verify imports follow package boundaries
   - Ensure no direct file imports across packages

## Analysis Process

```bash
# 1. Scan all packages
find packages -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx"

# 2. Check for violations
grep -r "React" packages/core  # Should not exist
grep -r "require('fs')" packages/ui/src  # Should not exist

# 3. Check for duplicate patterns
# Look for similar function names, similar logic

# 4. Analyze imports
# Check import statements follow architecture
```

## Output Format

```
🏗️ Architecture Compliance Report
==================================

✅ Correct Architecture:
- packages/core: Contains only business logic ✓
- packages/ui: Contains only UI components ✓
- packages/types: Contains only type definitions ✓

❌ Violations Found:
- packages/ui/src/compiler.ts: Should use core/compiler instead
  Suggestion: Import from @hugsy/core instead of reimplementing

⚠️ Warnings:
- packages/cli/commands/compile.ts: Duplicates core logic
  Suggestion: Call core.compile() instead

📊 Summary:
- 2 critical violations
- 3 warnings
- 85% architecture compliance

Recommendations:
1. Move compiler logic from UI to Core
2. Remove duplicate implementations in CLI
3. Fix import boundaries
```

## Action Items

For each violation found:

1. Explain why it's a violation
2. Suggest the correct location
3. Provide refactoring steps
4. Show example of correct implementation
