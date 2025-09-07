#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/**
 * Quality Guard Hook
 * Intercepts any attempts to compromise code quality
 */

const fs = require('fs'); // Reserved for future use
const path = require('path');

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
    pattern: /:\s*any(?:\s|;|,|\)|$|\[)/,
    message: '❌ "any" type is not allowed - Use specific type definitions'
  },
  {
    pattern: /as\s+any\b/,
    message: '❌ "as any" is not allowed - Use proper type assertions'
  },
  {
    pattern: /:\s*unknown(?:\s|;|,|\)|$|\[)/,
    message: '⚠️  Avoid using "unknown" - Use more specific types'
  },
  {
    pattern: /\/\/ eslint-disable/,
    message: '❌ Disabling eslint is not allowed - Fix the lint errors'
  },
  {
    pattern: /console\.(log|debug|info)(?!\s*\(.*\/\/ OK)/,
    message: '⚠️  Production code should not contain console.log (unless marked with // OK)'
  },
  {
    pattern: /TODO(?!:.*\d{4}-\d{2}-\d{2})/,
    message: '⚠️  TODO must include completion date (format: TODO: description 2024-01-01)'
  },
  {
    pattern: /FIXME(?!:.*\d{4}-\d{2}-\d{2})/,
    message: '⚠️  FIXME must include fix date'
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

function checkContent(content, filePath) {
  const violations = [];
  const warnings = [];

  // 检查通用规则
  for (const rule of FORBIDDEN_PATTERNS) {
    const matches = content.match(rule.pattern);
    if (matches) {
      const item = {
        file: path.basename(filePath),
        rule: rule.message,
        line: getLineNumber(content, matches.index),
        matched: matches[0].trim()
      };

      if (rule.message.startsWith('❌')) {
        violations.push(item);
      } else {
        warnings.push(item);
      }
    }
  }

  // 检查文件特定规则
  for (const [pattern, rules] of Object.entries(FILE_SPECIFIC_RULES)) {
    if (filePath.match(pattern.replace('*', '.*'))) {
      for (const rule of rules) {
        if (rule.pattern.test(content)) {
          warnings.push({
            file: path.basename(filePath),
            rule: rule.message,
            matched: content.match(rule.pattern)[0].trim()
          });
        }
      }
    }
  }

  return { violations, warnings };
}

function getLineNumber(content, index) {
  if (!index) return 1;
  return content.substring(0, index).split('\n').length;
}

// 主执行逻辑
function main() {
  // 从环境变量获取文件信息
  const filePath = process.env.CLAUDE_FILE_PATH;
  const content = process.env.CLAUDE_FILE_CONTENT;
  const operation = process.env.CLAUDE_OPERATION || 'Write'; // Not used currently

  // Skip if no file information (might be other type of hook call)
  if (!filePath || !content) {
    console.log('✅ Quality check skipped (no file content)');
    process.exit(0);
  }

  // Only check code files
  const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
  if (!codeExtensions.some((ext) => filePath.endsWith(ext))) {
    process.exit(0);
  }

  console.log(`\n🔍 Quality Guard checking ${path.basename(filePath)}...`);

  const { violations, warnings } = checkContent(content, filePath);

  // Output warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Quality warnings:');
    warnings.forEach((w) => {
      console.log(`  ${w.rule}`);

      if (w.line) console.log(`    Line ${w.line}: "${w.matched}"`);
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
    console.log('✅ Quality check passed - Code meets quality standards');
  }

  process.exit(0);
}

// 执行
main();
