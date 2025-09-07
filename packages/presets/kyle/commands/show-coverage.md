# Show Test Coverage

Display a detailed test coverage report with actionable insights for improving coverage.

## Execution

Run test coverage analysis:

```bash
npm test -- --coverage
# or
yarn test --coverage
# or
pnpm test --coverage
```

## Coverage Analysis

### 1. Overall Statistics

Display project-wide coverage:

- Statements coverage %
- Branches coverage %
- Functions coverage %
- Lines coverage %

### 2. File-by-File Breakdown

For each file, show:

- Individual coverage percentages
- Uncovered lines
- Priority for improvement (based on file importance)

### 3. Coverage Visualization

```
File                | Stmts | Branch | Funcs | Lines | Uncovered Lines
--------------------|-------|--------|-------|-------|----------------
src/index.ts        | 95.2% | 88.9%  | 100%  | 94.7% | 23-25, 67
src/utils.ts        | 78.3% | 65.0%  | 85.7% | 76.9% | 45-52, 89-95
src/api/client.ts   | 100%  | 100%   | 100%  | 100%  |
src/components/*.tsx| 82.5% | 75.3%  | 88.2% | 81.9% | Multiple
--------------------|-------|--------|-------|-------|----------------
Overall             | 85.2% | 78.9%  | 89.3% | 84.7% |
```

### 4. Uncovered Code Analysis

Identify patterns in uncovered code:

- Error handling paths
- Edge cases
- Conditional branches
- Async error scenarios

## Priority Recommendations

Rank files by improvement priority:

### High Priority (Core Business Logic)

```
1. src/core/compiler.ts - 72% coverage
   Missing: Error handling, edge cases
   Impact: Critical functionality

2. src/core/validator.ts - 68% coverage
   Missing: Validation error paths
   Impact: Data integrity
```

### Medium Priority (Features)

```
3. src/features/auth.ts - 79% coverage
   Missing: Token refresh logic
   Impact: User experience
```

### Low Priority (Utilities)

```
4. src/utils/format.ts - 81% coverage
   Missing: Rare format cases
   Impact: Minor
```

## Actionable Suggestions

For each under-covered file, provide:

### Specific Test Cases Needed

```typescript
// src/utils.ts needs tests for:
describe('parseConfig', () => {
  it('should handle malformed JSON');
  it('should handle missing required fields');
  it('should handle circular references');
});
```

### Coverage Improvement Commands

```bash
# Generate coverage report with details
npm test -- --coverage --verbose

# Test specific file
npm test src/utils.test.ts -- --coverage

# Update snapshots if needed
npm test -- -u
```

## Coverage Goals

### Current vs Target

```
Current Coverage: 84.7%
Target Coverage:  85.0%
Gap:             0.3%

Files needing attention (below 85%):
- src/utils.ts: Needs +8.1%
- src/parser.ts: Needs +5.5%
- src/transform.ts: Needs +3.2%
```

### Quick Wins

Identify easy coverage improvements:

```
Quick wins for +2% coverage:
1. Add error case test for parseJSON() - +0.8%
2. Test timeout scenario in fetchData() - +0.6%
3. Cover else branch in validateInput() - +0.6%
```

## HTML Report

If available, mention HTML coverage report:

```
📊 Detailed HTML report available at:
coverage/lcov-report/index.html

Open in browser for:
- Line-by-line coverage visualization
- Interactive navigation
- Source code highlighting
```

## Summary Actions

End with clear next steps:

```
To reach 85% coverage target:
1. Add 3 test cases to src/utils.ts
2. Cover error handling in src/api.ts
3. Test edge cases in src/parser.ts

Estimated time: 30 minutes
Coverage gain: +2.3%
```
