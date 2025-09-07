# Validate All

Run a complete validation pipeline to ensure code quality, tests pass, and build succeeds. This is the ultimate quality gate.

## Validation Pipeline

Execute these checks in sequence, stopping on critical failures:

### 1. Pre-flight Checks

- Ensure all dependencies are installed
- Check Node.js and npm/yarn/pnpm versions
- Verify project structure is intact

### 2. Code Quality Checks

#### TypeScript Compilation

```bash
tsc --noEmit
```

- Must have ZERO errors
- Report all issues with locations
- Stop pipeline if errors exist

#### Linting

```bash
npm run lint
```

- Fix auto-fixable issues
- Report remaining warnings
- Fail on errors

### 3. Test Suite

#### Unit Tests

```bash
npm test
```

- All tests must pass
- No skipped tests allowed
- Report test execution time

#### Coverage Check

```bash
npm test -- --coverage
```

- Minimum 85% overall coverage
- Minimum 80% per file
- Report uncovered lines

### 4. Build Verification

#### Development Build

```bash
npm run build
```

- Must complete without errors
- Check output size
- Verify all packages built

#### Production Build (if applicable)

```bash
npm run build:prod
```

- Optimize for production
- Check bundle sizes
- Verify no development code included

### 5. Architecture Compliance

- Check module boundaries
- Verify no duplicate implementations
- Ensure proper dependency flow

### 6. Security Audit

```bash
npm audit
```

- No high or critical vulnerabilities
- Report and suggest fixes for moderate issues

## Validation Rules

**Critical (Pipeline Stops):**

- ❌ TypeScript compilation errors
- ❌ Test failures
- ❌ Build failures
- ❌ Coverage below 85%

**Warnings (Reported but Continues):**

- ⚠️ Lint warnings
- ⚠️ Moderate security vulnerabilities
- ⚠️ Architecture warnings
- ⚠️ Deprecated dependencies

## Output Format

```
🚀 Full Validation Pipeline
============================

[1/6] Pre-flight Checks
  ✅ Dependencies installed
  ✅ Node v18.0.0

[2/6] TypeScript
  ✅ No compilation errors

[3/6] Linting
  ✅ No errors
  ⚠️ 3 warnings

[4/6] Tests
  ✅ 156 tests passed (12.3s)
  ✅ Coverage: 87.5%

[5/6] Build
  ✅ Build successful (45.2s)
  📦 Bundle size: 245kb

[6/6] Security
  ✅ No vulnerabilities

============================
✅ VALIDATION PASSED

Summary:
- 0 errors
- 3 warnings
- Ready for deployment
```

## Failure Handling

If validation fails:

1. Stop at first critical error
2. Provide clear error message
3. Suggest fix commands
4. Show which step failed

Example:

```
❌ VALIDATION FAILED at step 2/6

TypeScript Compilation Errors:
- src/index.ts(10,5): Type 'string' not assignable to 'number'

To fix:
1. Run: /fix-types
2. Then run: /validate-all again
```

## Success Criteria

All checks must pass for validation to succeed. This ensures:

- Code is type-safe
- Tests provide adequate coverage
- Build is production-ready
- No security vulnerabilities
- Architecture is maintained
