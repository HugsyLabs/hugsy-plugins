#!/usr/bin/env node
/**
 * Architecture Check Hook
 * Prevents duplicate implementations and architecture violations
 */

const path = require('path');
const { ERROR_TYPES, EXIT_CODES } = require('./config');

// Project architecture mapping - defines responsibilities of each module
const ARCHITECTURE_MAP = {
  'packages/core': {
    purpose: 'Core business logic, compiler, configuration processing',
    contains: ['compiler', 'presets', 'package management', 'config parsing'],
    forbidden: ['UI components', 'React', 'DOM manipulation', 'UI logic'],
    warning: '❌ Do not implement UI-related logic in core'
  },
  'packages/ui': {
    purpose: 'Web interface, React components, user interaction',
    contains: ['React components', 'user interface', 'styles', 'frontend logic'],
    forbidden: ['core compilation', 'file system operations', 'Node.js API'],
    warning: '❌ Do not implement core business logic in UI'
  },
  'packages/ui/server.js': {
    purpose: 'API server, backend routes',
    contains: ['Express routes', 'API endpoints', 'file operations', 'backend logic'],
    forbidden: ['React components', 'JSX', 'frontend components'],
    warning: '❌ Do not implement frontend components in server.js'
  },
  'packages/cli': {
    purpose: 'Command line tool, terminal interaction',
    contains: ['CLI commands', 'terminal output', 'command parsing'],
    forbidden: ['React', 'DOM', 'Web API'],
    warning: '❌ CLI should call core APIs, not reimplement logic'
  },
  'packages/types': {
    purpose: 'TypeScript type definitions',
    contains: ['interface', 'type', 'type declarations'],
    forbidden: ['function implementations', 'class implementations', 'concrete logic'],
    warning: '❌ Types package should only contain type definitions, not implementation code'
  }
};

// Existing feature mapping - avoid duplicate implementations
const EXISTING_FEATURES = {
  // Core features
  'package management': {
    location: 'packages/core/src/packages',
    apis: ['PackageManager', 'installPackage', 'removePackage'],
    message: '📦 Package management is already implemented in core/src/packages, please reuse'
  },
  'config compilation': {
    location: 'packages/core/src/compiler',
    apis: ['Compiler', 'compile', 'validate'],
    message: '🔧 Config compilation is already in core/src/compiler, call its API'
  },
  'preset management': {
    location: 'packages/core/src/presets',
    apis: ['PresetManager', 'loadPreset', 'mergePresets'],
    message: '📋 Preset management is already in core/src/presets, do not duplicate'
  },

  // UI features
  'config editor': {
    location: 'packages/ui/src/components/ConfigEditor',
    apis: ['ConfigEditor', 'ConfigPanel'],
    message: '✏️ Config editor component already exists, reuse or extend it'
  },

  // CLI features
  'CLI commands': {
    location: 'packages/cli/src/commands',
    apis: ['init', 'compile', 'validate'],
    message: '⌨️ CLI commands are defined in cli/src/commands, add new ones there'
  }
};

// Keywords that might indicate duplicate implementation
const DUPLICATION_KEYWORDS = {
  'install package': 'package management',
  'remove package': 'package management',
  'compile config': 'config compilation',
  'load preset': 'preset management',
  'merge preset': 'preset management',
  'config editor': 'config editor',
  'edit config': 'config editor'
};

function checkArchitecture(filePath, content, prompt) {
  const violations = [];
  const warnings = [];

  // 1. Check if file location is correct
  for (const [location, rules] of Object.entries(ARCHITECTURE_MAP)) {
    if (filePath.includes(location)) {
      // Check for forbidden content with smarter pattern matching
      for (const forbidden of rules.forbidden) {
        // Create a word boundary pattern for more accurate matching
        const forbiddenPattern = new RegExp(`\b${forbidden}\b`, 'i');
        if (forbiddenPattern.test(content)) {
          violations.push({
            type: 'architecture',
            message: rules.warning,
            detail: `Found "${forbidden}" related code`,
            suggestion: `${location} responsibility: ${rules.purpose}`
          });
        }
      }

      // Special check: types package should not have implementations
      if (location === 'packages/types') {
        if (/function\s+\w+\s*\([^)]*\)\s*{/.test(content) || /class\s+\w+\s*{/.test(content)) {
          violations.push({
            type: 'architecture',
            message: rules.warning,
            detail: 'Found function or class implementation code',
            suggestion:
              'Move implementations to appropriate package, types should only contain type definitions'
          });
        }
      }
    }
  }

  // 2. Check for duplicate implementation of existing features
  // Use case-insensitive search for prompts but preserve original case for content analysis
  const lowerPrompt = (prompt || '').toLowerCase();
  
  // Detect by keywords
  for (const [keyword, feature] of Object.entries(DUPLICATION_KEYWORDS)) {
    // Check prompt case-insensitively
    const keywordInPrompt = lowerPrompt.includes(keyword.toLowerCase());
    
    // Check content more carefully - look for actual patterns, not just keywords
    const keywordPattern = new RegExp(`\b${keyword.replace(/\s+/g, '\\s*')}\b`, 'i');
    const keywordInContent = keywordPattern.test(content);
    
    if (keywordInPrompt || keywordInContent) {
      const existing = EXISTING_FEATURES[feature];
      if (existing && !filePath.includes(existing.location)) {
        warnings.push({
          type: 'duplication',
          message: existing.message,
          suggestion: `Use API: ${existing.apis.join(', ')}`,
          location: existing.location
        });
      }
    }
  }

  // 3. Check if module dependencies are reasonable
  if (filePath.includes('packages/ui') && !filePath.includes('server.js')) {
    // UI should not directly import Node.js modules
    const nodeModules = ['fs', 'path', 'child_process', 'crypto', 'os'];
    for (const module of nodeModules) {
      if (content.includes(`require('${module}')`) || content.includes(`from '${module}'`)) {
        violations.push({
          type: 'dependency',
          message: '❌ UI package should not directly use Node.js modules',
          detail: `Found import of '${module}'`,
          suggestion: 'Call backend functionality through API server (server.js)'
        });
      }
    }
  }

  // 4. Check if new features are being added in the correct location
  if (prompt && (prompt.includes('add') || prompt.includes('create') || prompt.includes('new'))) {
    const suggestions = [];

    if (prompt.includes('command')) {
      suggestions.push('💡 New commands should be added to packages/cli/src/commands/');
    }
    if (prompt.includes('component')) {
      suggestions.push('💡 New components should be added to packages/ui/src/components/');
    }
    if (prompt.includes('API') || prompt.includes('endpoint')) {
      suggestions.push('💡 New APIs should be added to packages/ui/server.js');
    }
    if (prompt.includes('type') || prompt.includes('interface')) {
      suggestions.push('💡 New type definitions should be added to packages/types/');
    }

    suggestions.forEach((s) =>
      warnings.push({
        type: 'guidance',
        message: s
      })
    );
  }

  return { violations, warnings };
}

// Main execution logic
function main() {
  try {
    const filePath = process.env.CLAUDE_FILE_PATH || '';
    const content = process.env.CLAUDE_FILE_CONTENT || '';
    const prompt = process.env.CLAUDE_PROMPT || '';
    // const operation = process.env.CLAUDE_OPERATION || ''; // Reserved for future use

    // Only check code files within the project
    if (!filePath.includes('packages/') || !filePath.match(/\.(ts|tsx|js|jsx)$/)) {
      process.exit(0);
    }

    process.stderr.write(`\n🏗️  Architecture Check for ${path.basename(filePath)}...\n`);

    const { violations, warnings } = checkArchitecture(filePath, content, prompt);

    // Output guidance suggestions
    if (warnings.length > 0) {
      console.warn('\n💡 Architecture suggestions:');
      warnings.forEach((w) => {
        console.warn(`  ${w.message}`);
        if (w.suggestion) console.warn(`    → ${w.suggestion}`);
        if (w.location) console.warn(`    📍 Location: ${w.location}`);
      });
    }

    // Block operation if there are architecture violations
    if (violations.length > 0) {
      console.error('\n❌ Architecture check FAILED - Architecture violations detected!');
      console.error('\nThe following issues must be fixed:');
      violations.forEach((v) => {
        console.error(`  ${v.message}`);
        if (v.detail) console.error(`    Issue: ${v.detail}`);
        if (v.suggestion) console.error(`    Suggestion: ${v.suggestion}`);
      });
      console.error(
        '\n📚 Please follow project architecture guidelines and keep module responsibilities clear'
      );
      process.exit(1);
    }

    if (violations.length === 0 && warnings.length === 0) {
      process.stderr.write('✅ Architecture check passed - Complies with architecture standards\n');
    }

    process.exit(0);
  } catch (error) {
    const errorType = error.message.includes('timeout') ? ERROR_TYPES.TIMEOUT : ERROR_TYPES.UNKNOWN;
    console.error(`❌ Architecture Check error [${errorType}]:`, error.message);
    
    // Allow operation to continue on error to avoid blocking development
    process.exit(EXIT_CODES.SUCCESS);
  }
}

// Execute
main();
