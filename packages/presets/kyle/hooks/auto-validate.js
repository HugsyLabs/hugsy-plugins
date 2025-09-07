#!/usr/bin/env node
/**
 * Auto Validate Hook
 * Automatically runs validation after code changes
 */

const { exec } = require('child_process');
const util = require('util');
const { VALIDATION_CONFIG, EXIT_CODES } = require('./config');
const execPromise = util.promisify(exec);

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
  // const operation = process.env.CLAUDE_OPERATION || ''; // Reserved for future use

  // Skip validation for non-code files
  if (!filePath.match(/\.(ts|tsx|js|jsx|json)$/)) {
    process.stderr.write('✅ Validation skipped (not a code file)\n');
    process.exit(0);
  }

  process.stderr.write('\n🔍 Running automatic validation...\n\n');

  const results = {};
  let hasErrors = false;
  let hasWarnings = false;

  // 1. TypeScript check
  if (VALIDATION_CONFIG.typescript.enabled && filePath.match(/\.(ts|tsx)$/)) {
    process.stderr.write('📘 TypeScript check...\n');
    const result = await runCommand('typescript', VALIDATION_CONFIG.typescript);
    results.typescript = result;

    if (result.success) {
      process.stderr.write('  ✅ TypeScript compilation successful\n');
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
    process.stderr.write('\n🧪 Running tests...\n');
    const result = await runCommand('tests', VALIDATION_CONFIG.tests);
    results.tests = result;

    if (result.success) {
      process.stderr.write('  ✅ Tests passed\n');

      // Check coverage
      if (result.coverage !== null) {
        if (result.coverage >= VALIDATION_CONFIG.tests.requiredCoverage) {
          process.stderr.write(
            `  ✅ Coverage: ${result.coverage.toFixed(1)}% (required: ${VALIDATION_CONFIG.tests.requiredCoverage}%)\n`
          );
        } else {
          console.warn(
            `  ⚠️  Coverage: ${result.coverage.toFixed(1)}% (required: ${VALIDATION_CONFIG.tests.requiredCoverage}%)`
          );
          console.warn('  💡 Add more tests to meet coverage requirements');
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
    process.stderr.write('\n🎨 Lint check...\n');
    const result = await runCommand('lint', VALIDATION_CONFIG.lint);
    results.lint = result;

    if (result.success) {
      process.stderr.write('  ✅ Lint check passed\n');
    } else {
      // Lint errors are warnings, not blocking errors
      console.warn('  ⚠️  Lint issues found');
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
    process.stderr.write('\n🔨 Build check...\n');
    const result = await runCommand('build', VALIDATION_CONFIG.build);
    results.build = result;

    if (result.success) {
      process.stderr.write('  ✅ Build successful\n');
    } else {
      console.error('  ❌ Build failed');
      hasErrors = true;
    }
  }

  // Summary
  process.stderr.write(`\n${'='.repeat(50)}\n`);

  if (hasErrors) {
    console.error('\n❌ Validation FAILED - Critical issues must be fixed!');
    console.error('\n💡 Fix the errors above before continuing');
    process.exit(1);
  } else if (hasWarnings) {
    console.warn('\n⚠️  Validation passed with warnings');
    console.warn('\n💡 Consider addressing the warnings for better code quality');
  } else {
    process.stderr.write('\n✅ All validations passed successfully!\n');
  }

  process.exit(0);
}

// Execute validation
validate().catch((error) => {
  console.error('❌ Validation hook error:', error.message);
  process.exit(1);
});
