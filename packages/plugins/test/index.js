/**
 * @hugsy/plugin-test
 * Test execution support for Claude Code
 *
 * This plugin focuses solely on test execution:
 * - Test framework permissions (Jest, Vitest, Mocha, etc.)
 * - Coverage tools
 * - Test file management
 * - Test-related hooks
 */

export default {
  name: 'plugin-test',
  version: '0.0.1',
  description: 'Test execution support with multiple testing frameworks',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.hooks = config.hooks || {};

    // Test framework permissions
    const testPermissions = [
      // Jest
      'Bash(jest)',
      'Bash(jest *)',
      'Bash(npx jest)',
      'Bash(npx jest *)',
      'Bash(npm test)',
      'Bash(npm test *)',
      'Bash(npm run test)',
      'Bash(npm run test *)',
      'Bash(npm run test:unit)',
      'Bash(npm run test:integration)',
      'Bash(npm run test:e2e)',
      'Bash(npm run test:coverage)',
      'Bash(npm run test:watch)',

      // Vitest
      'Bash(vitest)',
      'Bash(vitest *)',
      'Bash(npx vitest)',
      'Bash(npx vitest *)',
      'Bash(vitest run)',
      'Bash(vitest watch)',
      'Bash(vitest coverage)',
      'Bash(vitest ui)',

      // Mocha
      'Bash(mocha)',
      'Bash(mocha *)',
      'Bash(npx mocha)',
      'Bash(npx mocha *)',

      // Yarn test commands
      'Bash(yarn test)',
      'Bash(yarn test *)',
      'Bash(yarn test:unit)',
      'Bash(yarn test:integration)',
      'Bash(yarn test:e2e)',
      'Bash(yarn test:coverage)',
      'Bash(yarn test:watch)',

      // Pnpm test commands
      'Bash(pnpm test)',
      'Bash(pnpm test *)',
      'Bash(pnpm test:unit)',
      'Bash(pnpm test:integration)',
      'Bash(pnpm test:e2e)',
      'Bash(pnpm test:coverage)',
      'Bash(pnpm test:watch)',

      // Playwright
      'Bash(playwright test)',
      'Bash(playwright test *)',
      'Bash(npx playwright test)',
      'Bash(npx playwright test *)',
      'Bash(playwright install)',
      'Bash(npx playwright install)',

      // Cypress
      'Bash(cypress run)',
      'Bash(cypress run *)',
      'Bash(cypress open)',
      'Bash(npx cypress run)',
      'Bash(npx cypress open)',

      // Coverage tools
      'Bash(nyc *)',
      'Bash(c8 *)',
      'Bash(npx nyc *)',
      'Bash(npx c8 *)',

      // Test files
      'Write(**/*.test.js)',
      'Write(**/*.test.jsx)',
      'Write(**/*.test.ts)',
      'Write(**/*.test.tsx)',
      'Write(**/*.spec.js)',
      'Write(**/*.spec.jsx)',
      'Write(**/*.spec.ts)',
      'Write(**/*.spec.tsx)',
      'Write(**/*.test.mjs)',
      'Write(**/*.spec.mjs)',
      'Write(**/__tests__/**)',
      'Write(**/__mocks__/**)',
      'Write(**/__fixtures__/**)',
      'Write(**/__snapshots__/**)',

      // Test configuration files
      'Write(**/jest.config.js)',
      'Write(**/jest.config.mjs)',
      'Write(**/jest.config.cjs)',
      'Write(**/jest.config.ts)',
      'Write(**/jest.config.json)',
      'Write(**/jest.setup.js)',
      'Write(**/jest.setup.ts)',
      'Write(**/vitest.config.js)',
      'Write(**/vitest.config.mjs)',
      'Write(**/vitest.config.ts)',
      'Write(**/vite.config.js)',
      'Write(**/vite.config.mjs)',
      'Write(**/vite.config.ts)',
      'Write(**/.mocharc.js)',
      'Write(**/.mocharc.json)',
      'Write(**/.mocharc.yml)',
      'Write(**/mocha.opts)',
      'Write(**/playwright.config.js)',
      'Write(**/playwright.config.ts)',
      'Write(**/cypress.config.js)',
      'Write(**/cypress.config.ts)',
      'Write(**/cypress.json)',
      'Write(**/.nycrc)',
      'Write(**/.nycrc.json)',
      'Write(**/.nycrc.yml)',
      'Write(**/codecov.yml)',
      'Write(**/.coveragerc)',

      // Test utilities
      'Write(**/test-utils.js)',
      'Write(**/test-utils.ts)',
      'Write(**/test-helpers.js)',
      'Write(**/test-helpers.ts)',
      'Write(**/setupTests.js)',
      'Write(**/setupTests.ts)'
    ];

    // Add permissions that aren't already present
    testPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask permissions for coverage cleanup
    const askPermissions = [
      'Bash(rm -rf coverage)',
      'Bash(rm -rf .nyc_output)',
      'Bash(rm -rf test-results)',
      'Bash(rm -rf playwright-report)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Add test-specific hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Remind to run tests after code changes
    config.hooks.PreToolUse.push({
      matcher: 'Write(**/*.js)',
      command: 'echo "💡 Remember to run tests after making changes"'
    });

    config.hooks.PreToolUse.push({
      matcher: 'Write(**/*.ts)',
      command: 'echo "💡 Remember to run tests after making changes"'
    });

    // Hook: Check test environment
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm test)',
      command: 'test -f package.json || echo "⚠️ No package.json found in current directory"'
    });

    // Post-operation hooks
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: After test run
    config.hooks.PostToolUse.push({
      matcher: 'Bash(npm test)',
      command: 'echo "✅ Tests completed. Check the output for any failures."'
    });

    config.hooks.PostToolUse.push({
      matcher: 'Bash(jest *)',
      command: 'echo "✅ Jest tests completed. Check the output for any failures."'
    });

    config.hooks.PostToolUse.push({
      matcher: 'Bash(vitest *)',
      command: 'echo "✅ Vitest tests completed. Check the output for any failures."'
    });

    // Hook: After coverage run
    config.hooks.PostToolUse.push({
      matcher: 'Bash(*coverage*)',
      command: 'echo "📊 Coverage report generated. Check coverage/ directory for details."'
    });

    // Hook: After creating test file
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.test.*)',
      command: 'echo "🧪 Test file created. Run tests to verify."'
    });

    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.spec.*)',
      command: 'echo "🧪 Spec file created. Run tests to verify."'
    });

    return config;
  }
};
