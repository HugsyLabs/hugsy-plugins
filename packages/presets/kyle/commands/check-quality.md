# Check Code Quality

Check the current project's code quality comprehensively, including TypeScript errors, test coverage, and build status.

## Execution Steps

1. **TypeScript Compilation Check**
   - Run `tsc --noEmit` to check for TypeScript errors
   - Report all type errors with file locations
   - Ensure zero TypeScript errors

2. **Test Coverage Analysis**
   - Run `npm test -- --coverage` or equivalent
   - Display detailed coverage report
   - Highlight files with coverage below 85%
   - Show uncovered lines

3. **Code Style Check**
   - Run `npm run lint` or equivalent ESLint command
   - Report style violations
   - Check for unused variables and imports

4. **Build Verification**
   - Run `npm run build`
   - Ensure build completes successfully
   - Report any build errors or warnings

5. **Dependency Audit**
   - Check for outdated dependencies
   - Run security audit for vulnerabilities
   - Report any high or critical issues

## Output Format

Generate a comprehensive quality report with:

- ✅ Passed checks
- ❌ Failed checks with specific issues
- ⚠️ Warnings that should be addressed
- 💡 Improvement suggestions

## Quality Standards

- TypeScript: Zero compilation errors
- Test Coverage: Minimum 85% overall
- Lint: No errors, minimal warnings
- Build: Must succeed without errors
- Dependencies: No high/critical vulnerabilities

## Example Output

```
📊 Code Quality Report
=====================

TypeScript Check:
  ❌ 3 errors found
  - src/index.ts(10,5): Type 'string' is not assignable to type 'number'

Test Coverage:
  ⚠️  82.3% overall (target: 85%)
  - src/utils.ts: 65% (needs improvement)

Lint Check:
  ✅ No errors
  ⚠️  5 warnings

Build:
  ✅ Build successful

Dependencies:
  ⚠️  3 packages outdated
  ❌ 1 high severity vulnerability
```

Focus on actionable feedback that helps improve code quality immediately.
