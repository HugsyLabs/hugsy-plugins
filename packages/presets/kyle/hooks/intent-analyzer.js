#!/usr/bin/env node
/**
 * Intent Analyzer Hook
 * Analyzes user prompts to provide proactive guidance
 */

// Implementation hints for existing features
const IMPLEMENTATION_HINTS = {
  package: '📦 Tip: Package management functionality is in packages/core/src/packages',
  compile: '🔧 Tip: Compilation functionality is in packages/core/src/compiler',
  preset: '📋 Tip: Preset management is in packages/core/src/presets',
  'ui component': '🎨 Tip: UI components are in packages/ui/src/components',
  server: '🌐 Tip: API server is in packages/ui/server.js',
  'cli command': '⌨️ Tip: CLI commands are in packages/cli/src/commands',
  type: '📝 Tip: Type definitions are in packages/types/src'
};

// Quality compromise warnings
const QUALITY_WARNINGS = [
  {
    keywords: ['ignore', 'skip', 'bypass', 'disable'],
    warning: '⚠️ Please maintain code quality, do not ignore or bypass errors'
  },
  {
    keywords: ['temporarily', 'temp', 'for now', 'quick fix'],
    warning: '⚠️ Please provide complete solutions, avoid temporary fixes'
  },
  {
    keywords: ['any type', 'use any', 'as any'],
    warning: '⚠️ Do not use "any" type, use proper TypeScript types'
  },
  {
    keywords: ['@ts-ignore', '@ts-nocheck', 'eslint-disable'],
    warning: '⚠️ Do not suppress TypeScript or ESLint errors, fix them properly'
  },
  {
    keywords: ['later', 'todo', 'fixme'],
    warning: '⚠️ Address issues now rather than deferring them'
  }
];

// Common mistake patterns
const COMMON_MISTAKES = {
  'npm install':
    '💡 Remember: Users might not have npm, consider using npx or checking for package manager',
  pnpm: '💡 Remember: Not all users have pnpm installed',
  sudo: '⚠️ Avoid using sudo in commands',
  'rm -rf': '⚠️ Be very careful with destructive commands',
  force: '⚠️ Avoid forcing operations, fix the root cause instead'
};

// Architecture guidance
const ARCHITECTURE_GUIDANCE = {
  'new feature': '💡 Consider: Where does this feature belong in the architecture?',
  'add component': '💡 New components go in packages/ui/src/components/',
  'add command': '💡 New CLI commands go in packages/cli/src/commands/',
  'add api': '💡 New API endpoints go in packages/ui/server.js',
  'add type': '💡 New type definitions go in packages/types/src/'
};

// Best practices reminders
const BEST_PRACTICES = {
  test: '✅ Remember to write tests with >85% coverage',
  'error handling': '✅ Include proper error handling',
  typescript: '✅ Ensure TypeScript compilation passes with no errors',
  documentation: '✅ Update documentation for new features',
  'breaking change': '⚠️ Consider backward compatibility'
};

function analyzePrompt(prompt) {
  const suggestions = [];
  const warnings = [];
  const tips = [];

  const lowerPrompt = prompt.toLowerCase();

  // Check for implementation hints
  for (const [keyword, hint] of Object.entries(IMPLEMENTATION_HINTS)) {
    if (lowerPrompt.includes(keyword)) {
      tips.push(hint);
    }
  }

  // Check for quality warnings
  for (const rule of QUALITY_WARNINGS) {
    for (const keyword of rule.keywords) {
      if (lowerPrompt.includes(keyword)) {
        warnings.push(rule.warning);
        break;
      }
    }
  }

  // Check for common mistakes
  for (const [pattern, message] of Object.entries(COMMON_MISTAKES)) {
    if (lowerPrompt.includes(pattern.toLowerCase())) {
      warnings.push(message);
    }
  }

  // Provide architecture guidance
  for (const [pattern, guidance] of Object.entries(ARCHITECTURE_GUIDANCE)) {
    if (lowerPrompt.includes(pattern)) {
      suggestions.push(guidance);
    }
  }

  // Remind best practices
  for (const [keyword, practice] of Object.entries(BEST_PRACTICES)) {
    if (lowerPrompt.includes(keyword)) {
      tips.push(practice);
    }
  }

  return { suggestions, warnings, tips };
}

function main() {
  try {
    const prompt = process.env.CLAUDE_PROMPT || '';
    // const operation = process.env.CLAUDE_OPERATION || ''; // Reserved for future use

    // Skip if no prompt
    if (!prompt) {
      process.exit(0);
    }

    const { suggestions, warnings, tips } = analyzePrompt(prompt);

    // Only output if there's something useful to say
    if (suggestions.length === 0 && warnings.length === 0 && tips.length === 0) {
      process.exit(0);
    }

    console.warn('\n🤖 Intent Analysis:\n');

    // Output warnings first (most important)
    if (warnings.length > 0) {
      console.warn('⚠️ Warnings:');
      warnings.forEach((w) => console.warn(`  ${w}`));
      console.warn('');
    }

    // Then suggestions
    if (suggestions.length > 0) {
      console.warn('💡 Suggestions:');
      suggestions.forEach((s) => console.warn(`  ${s}`));
      console.warn('');
    }

    // Finally tips
    if (tips.length > 0) {
      console.warn('📌 Tips:');
      tips.forEach((t) => console.warn(`  ${t}`));
      console.warn('');
    }

    // Special handling for certain critical patterns
    if (
      prompt.toLowerCase().includes('any') ||
      prompt.toLowerCase().includes('@ts-ignore') ||
      prompt.toLowerCase().includes('@ts-nocheck')
    ) {
      console.error('🚫 CRITICAL: Quality standards are non-negotiable!');
      console.error('   Do NOT use "any" types or ignore TypeScript errors.');
      console.error('   Fix the root cause properly.\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Intent Analyzer encountered an error:', error.message);
    // Allow operation to continue on error to avoid blocking development
    process.exit(0);
  }
}

// Execute
main();
