#!/usr/bin/env node
/**
 * Quality Guard Hook
 * Intercepts any attempts to compromise code quality
 */

const path = require('path');
const { FILE_LIMITS, ERROR_TYPES, EXIT_CODES } = require('./config');

// Code patterns that are absolutely forbidden
const FORBIDDEN_PATTERNS = [
  {
    pattern: /@ts-nocheck/,
    message: '❌ @ts-nocheck is not allowed - TypeScript errors must be fixed, not ignored'
  },
  {
    pattern: /@ts-ignore/,
    message: '❌ @ts-ignore is not allowed - Types must be handled properly, not skipped'
  },
  {
    pattern: /:\s*any\b/,
    message: '❌ "any" type is not allowed - Use specific type definitions'
  },
  {
    pattern: /as\s+any\b/,
    message: '❌ "as any" is not allowed - Use proper type assertions'
  },
  {
    pattern: /:\s*unknown\b/,
    message: '⚠️  Avoid using "unknown" - Use more specific types'
  },
  {
    pattern: /\/\/ eslint-disable/,
    message: '❌ Disabling eslint is not allowed - Fix the lint errors'
  },
  {
    pattern: /console\.(log|debug|info)/,
    message: '⚠️  Production code should not contain console.log (unless marked with // OK)'
  },
  {
    pattern: /TODO(?!:)/,
    message: '⚠️  TODO must include description'
  },
  {
    pattern: /FIXME(?!:)/,
    message: '⚠️  FIXME must include description'
  },
  {
    pattern: /test\.skip/,
    message: '❌ Skipping tests is not allowed - All tests must run'
  },
  {
    pattern: /\.only\(/,
    message: '❌ .only() is not allowed - All tests must run'
  }
];

// File-specific rules
const FILE_SPECIFIC_RULES = {
  '*.test.ts': [
    {
      pattern: /expect\(.*\)\.toBe\(true\)/,
      message: '⚠️  Use more specific assertions, avoid toBe(true)'
    }
  ],
  '*.tsx': [
    {
      pattern: /style\s*=\s*\{\{/,
      message: '⚠️  Avoid inline styles, use CSS classes or styled-components'
    }
  ]
};

/**
 * Check file content for quality violations and warnings
 * @param {string} content - The file content to check
 * @param {string} filePath - The path to the file being checked
 * @returns {{violations: Array<{rule: string, line?: number, matched?: string}>, warnings: Array<{rule: string, line?: number, matched?: string}>}}
 *          Object containing arrays of violations and warnings found
 */
function checkContent(content, filePath) {
  const violations = [];
  const warnings = [];
  const lines = content.split('\n');
  const fileName = path.basename(filePath);

  // Determine applicable file-specific rules once
  const applicableFileRules = [];
  for (const [pattern, rules] of Object.entries(FILE_SPECIFIC_RULES)) {
    if (filePath.match(pattern.replace(/\*/g, '.*'))) {
      applicableFileRules.push(...rules);
    }
  }

  // Combine all rules for single-pass checking
  const allRules = [...FORBIDDEN_PATTERNS, ...applicableFileRules];

  // Single pass through lines
  lines.forEach((line, index) => {
    for (const rule of allRules) {
      const match = line.match(rule.pattern);
      if (match) {
        const item = {
          file: fileName,
          rule: rule.message,
          line: index + 1,
          matched: match[0].trim()
        };

        if (rule.message.startsWith('❌')) {
          violations.push(item);
        } else {
          warnings.push(item);
        }
      }
    }
  });

  return { violations, warnings };
}

// Main execution logic
function main() {
  try {
    // Get file information from environment variables
    const filePath = process.env.CLAUDE_FILE_PATH;
    const content = process.env.CLAUDE_FILE_CONTENT;
    // const operation = process.env.CLAUDE_OPERATION || 'Write'; // Reserved for future use

    // Skip if no file information (might be other type of hook call)
    if (!filePath || !content) {
      // Silent skip for non-file operations
      process.exit(EXIT_CODES.SUCCESS);
    }

    // Check content size limits
    let contentToCheck = content;
    if (content.length > FILE_LIMITS.MAX_CONTENT_LENGTH) {
      console.warn(
        `⚠️ File too large (${content.length} chars), checking first ${FILE_LIMITS.MAX_CONTENT_LENGTH} characters only`
      );
      contentToCheck = content.substring(0, FILE_LIMITS.MAX_CONTENT_LENGTH);
    }

    // Only check code files
    const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
    if (!codeExtensions.some((ext) => filePath.endsWith(ext))) {
      process.exit(0);
    }

    // Log check start
    process.stderr.write(`\n🔍 Quality Guard checking ${path.basename(filePath)}...\n`);

    const { violations, warnings } = checkContent(contentToCheck, filePath);

    // Output warnings
    if (warnings.length > 0) {
      console.warn('\n⚠️  Quality warnings:');
      warnings.forEach((w) => {
        console.warn(`  ${w.rule}`);
        if (w.line) console.warn(`    Line ${w.line}: "${w.matched}"`);
      });
    }

    // Block operation if there are violations
    if (violations.length > 0) {
      console.error('\n❌ Quality check FAILED - Code quality is non-negotiable!');
      console.error('\nThe following critical issues must be fixed:');
      violations.forEach((v) => {
        console.error(`  ${v.rule}`);
        if (v.line) console.error(`    Line ${v.line}: "${v.matched}"`);
      });
      console.error('\n💡 Suggestion: Fix these issues properly, do not try to bypass checks');
      process.exit(1);
    }

    if (warnings.length === 0) {
      process.stderr.write('✅ Quality check passed - Code meets quality standards\n');
    }

    process.exit(0);
  } catch (error) {
    // Categorize errors for better debugging
    let errorType = ERROR_TYPES.UNKNOWN;
    let errorMessage = error.message;
    let suggestion = '';

    if (error.message && error.message.includes('timeout')) {
      errorType = ERROR_TYPES.TIMEOUT;
      suggestion = 'Consider optimizing file size or increasing timeout';
    } else if (error.code === 'ENOENT') {
      errorType = ERROR_TYPES.PARSE;
      errorMessage = `File not found: ${error.path || error.message}`;
      suggestion = 'Check if the file path is correct';
    } else if (error.code === 'EACCES') {
      errorType = ERROR_TYPES.PARSE;
      errorMessage = `Permission denied: ${error.path || error.message}`;
      suggestion = 'Check file permissions';
    } else if (error instanceof SyntaxError) {
      errorType = ERROR_TYPES.PARSE;
      errorMessage = `Invalid JSON in stdin: ${error.message}`;
      suggestion = 'Ensure the input is valid JSON';
    } else if (error instanceof TypeError) {
      errorType = ERROR_TYPES.PARSE;
      errorMessage = `Type error in processing: ${error.message}`;
      suggestion = 'Check the data structure being processed';
    }

    console.error(`❌ Quality Guard error [${errorType}]: ${errorMessage}`);
    if (suggestion) {
      console.error(`💡 ${suggestion}`);
    }

    // Log stack trace for unknown errors to help debugging
    if (errorType === ERROR_TYPES.UNKNOWN && error.stack) {
      console.error('Stack trace:', error.stack);
    }

    // Exit based on error type
    if (errorType === ERROR_TYPES.TIMEOUT) {
      process.exit(EXIT_CODES.TIMEOUT);
    }

    // Allow operation to continue on unknown errors to avoid blocking development
    console.warn('⚠️  Allowing operation to continue despite error');
    process.exit(EXIT_CODES.SUCCESS);
  }
}

// Execute
main();
