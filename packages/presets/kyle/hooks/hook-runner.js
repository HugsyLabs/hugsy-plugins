#!/usr/bin/env node
/**
 * Hook Runner
 * Provides safe execution of hooks with validation and fallback mechanisms
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration constants
const TIMEOUTS = {
  QUICK: 5000, // 5 seconds for quick checks
  NORMAL: 10000, // 10 seconds for normal operations
  LONG: 30000, // 30 seconds for complex operations
  EXTRA_LONG: 60000 // 60 seconds for build/test operations
};

/**
 * Find the actual hook file location
 * Tries multiple possible paths to handle different installation scenarios
 */
function findHookFile(hookName) {
  const possiblePaths = [
    // NPM installed package
    path.join(process.cwd(), 'node_modules', '@hugsylabs', 'preset-kyle', 'hooks', hookName),
    // Local development
    path.join(__dirname, hookName),
    // Workspace/monorepo setup
    path.join(
      process.cwd(),
      '..',
      '..',
      'node_modules',
      '@hugsylabs',
      'preset-kyle',
      'hooks',
      hookName
    ),
    // Direct execution from preset directory
    path.join(__dirname, '..', 'hooks', hookName),
    // Alternative: check if we're already in the hooks directory
    path.join(process.cwd(), hookName)
  ];

  // Try to resolve via require (handles global installations)
  try {
    const packagePath = require.resolve('@hugsylabs/preset-kyle/package.json');
    const hookPath = path.join(path.dirname(packagePath), 'hooks', hookName);
    possiblePaths.push(hookPath);
  } catch {
    // Package not installed via npm, that's fine
  }

  for (const hookPath of possiblePaths) {
    if (fs.existsSync(hookPath)) {
      return hookPath;
    }
  }

  return null;
}

/**
 * Sanitize content to prevent exposure of sensitive data
 */
function sanitizeContent(content, maxLength = 10000) {
  if (!content) return '';

  // Truncate if too long
  let sanitized =
    content.length > maxLength
      ? `${content.substring(0, maxLength)}\n... [content truncated]`
      : content;

  // Remove potential secrets (basic patterns)
  const secretPatterns = [
    /api[_-]?key\s*[:=]\s*['"]?[\w-]+['"]?/gi,
    /password\s*[:=]\s*['"]?[^'"\s]+['"]?/gi,
    /token\s*[:=]\s*['"]?[\w-]+['"]?/gi,
    /secret\s*[:=]\s*['"]?[\w-]+['"]?/gi
  ];

  for (const pattern of secretPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  return sanitized;
}

/**
 * Execute a hook with proper error handling
 */
function executeHook(hookPath, env, timeout) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [hookPath], {
      env: { ...process.env, ...env },
      stdio: 'inherit'
    });

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Hook execution timed out after ${timeout}ms`));
    }, timeout);

    child.on('exit', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Hook exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  const hookName = process.argv[2];
  const timeout = parseInt(process.argv[3]) || TIMEOUTS.NORMAL;

  if (!hookName) {
    console.error('❌ Hook name not provided');
    process.exit(1);
  }

  const hookPath = findHookFile(hookName);
  if (!hookPath) {
    console.error(`❌ Hook not found: ${hookName}`);
    console.error('💡 Skipping hook execution to avoid blocking development');
    process.exit(0); // Exit gracefully to not block
  }

  // Prepare sanitized environment
  const env = {
    CLAUDE_FILE_PATH: process.env.CLAUDE_FILE_PATH || '',
    CLAUDE_FILE_CONTENT: sanitizeContent(process.env.CLAUDE_FILE_CONTENT),
    CLAUDE_PROMPT: process.env.CLAUDE_PROMPT || '',
    CLAUDE_OPERATION: process.env.CLAUDE_OPERATION || ''
  };

  try {
    await executeHook(hookPath, env, timeout);
  } catch (error) {
    console.error(`❌ Hook execution failed: ${error.message}`);
    // Exit with 0 to avoid blocking on non-critical errors
    if (error.message.includes('timed out')) {
      console.error('💡 Consider increasing timeout or optimizing the hook');
      process.exit(0);
    }
    process.exit(1);
  }
}

// Export for testing
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { findHookFile, sanitizeContent, TIMEOUTS };
