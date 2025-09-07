#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Auto Validate Hook
 * Automatically runs validation after code changes
 */

const { exec } = require('child_process');
const util = require('util');
const path = require('path'); // Reserved for future use
const fs = require('fs'); // Reserved for future use
const execPromise = util.promisify(exec);

// Validation configuration
const VALIDATION_CONFIG = {
  typescript: {
    enabled: true,
    command: 'tsc --noEmit',
    timeout: 30000,
    requiredCoverage: 0
  },
  tests: {
    enabled: true,
    command: 'npm test',
    timeout: 60000,
    requiredCoverage: 85
  },
  build: {
    enabled: true,
    command: 'npm run build',
    timeout: 60000,
    requiredCoverage: 0
  },
  lint: {
    enabled: true,
    command: 'npm run lint',
    timeout: 30000,
    requiredCoverage: 0
  }
};

async function runCommand(name, config) {
  try {
    const { stdout, stderr } = await execPromise(config.command, {
      timeout: config.timeout,
      cwd: process.cwd()
    });

    // Extract coverage if applicable
    let coverage = null;
    if (config.requiredCoverage > 0 && stdout) {
      // Try different coverage patterns
      const patterns = [
        /All files[^|]*\|[^|]*\|[^|]*\|[^|]*\|\s*([\d.]+)/, // Jest
        /Statements\s*:\s*([\d.]+)%/, // Vitest
        /Coverage:\s*([\d.]+)%/ // Generic
      ];

      for (const pattern of patterns) {
        const match = stdout.match(pattern);
        if (match) {
          coverage = parseFloat(match[1]);
          break;
        }
      }
    }

    return {
      success: true,
      stdout,
      stderr,
      coverage
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

async function validate() {
  const filePath = process.env.CLAUDE_FILE_PATH || '';
  const operation = process.env.CLAUDE_OPERATION || ''; // Not used currently

  // Skip validation for non-code files
  if (!filePath.match(/\.(ts|tsx|js|jsx|json)$/)) {
    console.log('✅ Validation skipped (not a code file)');
    process.exit(0);
  }

  console.log('\n🔍 Running automatic validation...\n');

  const results = {};
  let hasErrors = false;
  let hasWarnings = false;

  // 1. TypeScript check
  if (VALIDATION_CONFIG.typescript.enabled && filePath.match(/\.(ts|tsx)$/)) {
    console.log('📘 TypeScript check...');
    const result = await runCommand('typescript', VALIDATION_CONFIG.typescript);
    results.typescript = result;

    if (result.success) {
      console.log('  ✅ TypeScript compilation successful');
    } else {
      console.error('  ❌ TypeScript compilation failed');
      if (result.stderr) {
        // Show first few lines of error
        const lines = result.stderr.split('\n').slice(0, 5);
        lines.forEach((line) => console.error(`    ${line}`));
      }
      hasErrors = true;
    }
  }

  // 2. Run tests if test files were modified
  if (
    VALIDATION_CONFIG.tests.enabled &&
    (filePath.includes('.test.') || filePath.includes('.spec.'))
  ) {
    console.log('\n🧪 Running tests...');
    const result = await runCommand('tests', VALIDATION_CONFIG.tests);
    results.tests = result;

    if (result.success) {
      console.log('  ✅ Tests passed');

      // Check coverage
      if (result.coverage !== null) {
        if (result.coverage >= VALIDATION_CONFIG.tests.requiredCoverage) {
          console.log(
            `  ✅ Coverage: ${result.coverage.toFixed(1)}% (required: ${VALIDATION_CONFIG.tests.requiredCoverage}%)`
          );
        } else {
          console.log(
            `  ⚠️  Coverage: ${result.coverage.toFixed(1)}% (required: ${VALIDATION_CONFIG.tests.requiredCoverage}%)`
          );
          console.log('  💡 Add more tests to meet coverage requirements');
          hasWarnings = true;
        }
      }
    } else {
      console.error('  ❌ Tests failed');
      hasErrors = true;
    }
  }

  // 3. Lint check
  if (VALIDATION_CONFIG.lint.enabled) {
    console.log('\n🎨 Lint check...');
    const result = await runCommand('lint', VALIDATION_CONFIG.lint);
    results.lint = result;

    if (result.success) {
      console.log('  ✅ Lint check passed');
    } else {
      // Lint errors are warnings, not blocking errors
      console.log('  ⚠️  Lint issues found');
      if (result.stdout) {
        const lines = result.stdout.split('\n').slice(0, 5);
        lines.forEach((line) => console.warn(`    ${line}`));
      }
      hasWarnings = true;
    }
  }

  // 4. Build check (only for source files, not tests)
  if (
    VALIDATION_CONFIG.build.enabled &&
    filePath.includes('/src/') &&
    !filePath.includes('.test.') &&
    !filePath.includes('.spec.')
  ) {
    console.log('\n🔨 Build check...');
    const result = await runCommand('build', VALIDATION_CONFIG.build);
    results.build = result;

    if (result.success) {
      console.log('  ✅ Build successful');
    } else {
      console.error('  ❌ Build failed');
      hasErrors = true;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);

  if (hasErrors) {
    console.error('\n❌ Validation FAILED - Critical issues must be fixed!');
    console.error('\n💡 Fix the errors above before continuing');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('\n⚠️  Validation passed with warnings');
    console.log('\n💡 Consider addressing the warnings for better code quality');
  } else {
    console.log('\n✅ All validations passed successfully!');
  }

  process.exit(0);
}

// Execute validation
validate().catch((error) => {
  console.error('❌ Validation hook error:', error.message);
  process.exit(1);
});
