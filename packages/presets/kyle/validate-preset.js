#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Validate the Kyle preset before publication
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Validating Kyle preset for publication...\n');

let hasErrors = false;

// Validate package.json
console.log('Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

  // Check required fields
  const requiredFields = ['name', 'version', 'description', 'main', 'bin', 'author', 'license'];
  for (const field of requiredFields) {
    if (!packageJson[field]) {
      console.error(`✗ Missing required field: ${field}`);
      hasErrors = true;
    } else {
      console.log(
        `✓ ${field}: ${typeof packageJson[field] === 'object' ? 'defined' : packageJson[field]}`
      );
    }
  }

  // Validate package name
  if (packageJson.name !== '@hugsylabs/preset-kyle') {
    console.error(`✗ Package name should be @hugsylabs/preset-kyle, got: ${packageJson.name}`);
    hasErrors = true;
  }
} catch (error) {
  console.error(`✗ Error reading package.json: ${error.message}`);
  hasErrors = true;
}

// Validate preset configuration
console.log('\nChecking preset configuration...');
try {
  const presetConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf-8'));

  // Validate hook commands use bin names
  const invalidCommands = [];
  if (presetConfig.hooks) {
    for (const hookType of Object.keys(presetConfig.hooks)) {
      const entries = presetConfig.hooks[hookType];
      for (const entry of entries) {
        if (entry.hooks) {
          for (const hook of entry.hooks) {
            if (hook.command && hook.command.includes('node_modules')) {
              invalidCommands.push(`${hookType}: ${hook.command}`);
            }
          }
        }
      }
    }
  }

  if (invalidCommands.length > 0) {
    console.error('✗ Found hooks with full paths instead of bin commands:');
    invalidCommands.forEach((cmd) => console.error(`  - ${cmd}`));
    hasErrors = true;
  } else {
    console.log('✓ All hooks use bin commands');
  }

  // Validate permissions
  if (!presetConfig.permissions || !presetConfig.permissions.allow) {
    console.error('✗ Missing permissions configuration');
    hasErrors = true;
  } else {
    console.log(`✓ Permissions defined (${presetConfig.permissions.allow.length} allow rules)`);
  }
} catch (error) {
  console.error(`✗ Error reading index.json: ${error.message}`);
  hasErrors = true;
}

// Check file sizes
console.log('\nChecking file sizes...');
const maxFileSizes = {
  'index.json': 10000,
  'README.md': 50000,
  'hooks/quality-guard.js': 20000,
  'hooks/architecture-check.js': 20000,
  'hooks/auto-validate.js': 10000,
  'hooks/intent-analyzer.js': 10000
};

for (const [file, maxSize] of Object.entries(maxFileSizes)) {
  try {
    const stats = fs.statSync(path.join(__dirname, file));
    if (stats.size > maxSize) {
      console.warn(`⚠ ${file} is large: ${stats.size} bytes (max: ${maxSize})`);
    } else {
      console.log(`✓ ${file}: ${stats.size} bytes`);
    }
  } catch (error) {
    console.error(`✗ Cannot check ${file}: ${error.message}`);
    hasErrors = true;
  }
}

// Run tests if available
console.log('\nRunning tests...');
try {
  execSync('node test-preset.js', { cwd: __dirname, stdio: 'pipe' });
  console.log('✓ Tests passed');
} catch {
  console.error('✗ Tests failed');
  hasErrors = true;
}

// Final result
console.log(`\n${'='.repeat(50)}`);
if (hasErrors) {
  console.error('❌ Validation failed - please fix the issues above');
  process.exit(1);
} else {
  console.log('✅ Preset is valid and ready for publication!');
  console.log('\nTo publish:');
  console.log('1. Commit all changes');
  console.log('2. Create a pull request');
  console.log('3. After merge, the preset will be automatically published');
}
