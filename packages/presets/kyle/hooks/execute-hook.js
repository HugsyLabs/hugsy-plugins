#!/usr/bin/env node
/**
 * Smart Hook Executor
 * Automatically finds and executes hooks regardless of installation method
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * Try to find the hook-runner.js in various locations
 */
function findHookRunner() {
  const possiblePaths = [
    // If we're already in the hooks directory
    path.join(__dirname, 'hook-runner.js'),
    // Relative to this script
    path.join(__dirname, '..', 'hooks', 'hook-runner.js'),
    // In node_modules (npm installation)
    path.join(
      process.cwd(),
      'node_modules',
      '@hugsylabs',
      'preset-kyle',
      'hooks',
      'hook-runner.js'
    ),
    // Alternative node_modules location
    path.join(
      process.cwd(),
      '..',
      'node_modules',
      '@hugsylabs',
      'preset-kyle',
      'hooks',
      'hook-runner.js'
    ),
    path.join(
      process.cwd(),
      '..',
      '..',
      'node_modules',
      '@hugsylabs',
      'preset-kyle',
      'hooks',
      'hook-runner.js'
    )
  ];

  // Try require.resolve for more robust resolution
  try {
    const resolved = require.resolve('@hugsylabs/preset-kyle/hooks/hook-runner.js');
    if (resolved && fs.existsSync(resolved)) {
      return resolved;
    }
  } catch {
    // Not found via require, continue with other paths
  }

  // Check each possible path
  for (const hookPath of possiblePaths) {
    if (fs.existsSync(hookPath)) {
      return hookPath;
    }
  }

  // Last resort: try to find it relative to package.json
  try {
    const packagePath = require.resolve('@hugsylabs/preset-kyle/package.json');
    const hookPath = path.join(path.dirname(packagePath), 'hooks', 'hook-runner.js');
    if (fs.existsSync(hookPath)) {
      return hookPath;
    }
  } catch {
    // Package not found
  }

  return null;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: execute-hook.js <hook-name> [timeout]');
    process.exit(1);
  }

  const hookName = args[0];
  const timeout = args[1] || '10000';

  // Find the hook runner
  const hookRunnerPath = findHookRunner();

  if (!hookRunnerPath) {
    console.error('❌ Could not find hook-runner.js');
    console.error('💡 Make sure @hugsylabs/preset-kyle is properly installed');
    // Exit gracefully to not block development
    process.exit(0);
  }

  // Execute the hook runner with the specified hook
  const child = spawn('node', [hookRunnerPath, hookName, timeout], {
    stdio: 'inherit',
    env: process.env
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  child.on('error', (err) => {
    console.error('❌ Failed to execute hook:', err.message);
    process.exit(1);
  });
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { findHookRunner };
