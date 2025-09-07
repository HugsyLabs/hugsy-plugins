#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Test the Kyle preset configuration
 */

const fs = require('fs');
const path = require('path');

console.log('Testing Kyle preset configuration...\n');

// Test that all required files exist
const requiredFiles = [
  'index.json',
  'package.json',
  'README.md',
  'hooks/quality-guard.js',
  'hooks/architecture-check.js',
  'hooks/auto-validate.js',
  'hooks/intent-analyzer.js',
  'hooks/config.js',
  'hooks/hook-runner.js',
  'commands/check-quality.md',
  'commands/fix-types.md',
  'commands/check-arch.md',
  'commands/validate-all.md',
  'commands/show-coverage.md',
  'agents/quality-enforcer.md',
  'agents/architecture-guardian.md',
  'agents/test-master.md'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file}`);
  } else {
    console.error(`✗ ${file} - File not found`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing');
  process.exit(1);
}

// Test that bin commands are properly configured
console.log('\nTesting bin commands...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const expectedBins = [
  'kyle-quality-guard',
  'kyle-architecture-check',
  'kyle-auto-validate',
  'kyle-intent-analyzer'
];

let allBinsPresent = true;
for (const bin of expectedBins) {
  if (packageJson.bin && packageJson.bin[bin]) {
    console.log(`✓ ${bin} -> ${packageJson.bin[bin]}`);
  } else {
    console.error(`✗ ${bin} - Not found in package.json bin field`);
    allBinsPresent = false;
  }
}

if (!allBinsPresent) {
  console.error('\n❌ Some bin commands are missing');
  process.exit(1);
}

// Test that hooks are executable
console.log('\nTesting hook executability...');
const hooks = [
  'hooks/quality-guard.js',
  'hooks/architecture-check.js',
  'hooks/auto-validate.js',
  'hooks/intent-analyzer.js'
];

for (const hook of hooks) {
  const hookPath = path.join(__dirname, hook);
  try {
    // Check if file starts with shebang
    const content = fs.readFileSync(hookPath, 'utf-8');
    if (content.startsWith('#!/usr/bin/env node')) {
      console.log(`✓ ${hook} has shebang`);
    } else {
      console.warn(`⚠ ${hook} missing shebang`);
    }
  } catch (error) {
    console.error(`✗ ${hook} - Error reading file: ${error.message}`);
  }
}

// Test preset configuration
console.log('\nTesting preset configuration...');
try {
  const presetConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json'), 'utf-8'));

  // Check required fields
  const requiredFields = ['name', 'version', 'description', 'permissions', 'hooks'];
  for (const field of requiredFields) {
    if (presetConfig[field]) {
      console.log(`✓ ${field} field present`);
    } else {
      console.error(`✗ ${field} field missing`);
      allFilesExist = false;
    }
  }

  // Check that hooks use bin commands
  if (presetConfig.hooks && presetConfig.hooks.PreToolUse) {
    let useBinCommands = true;
    for (const entry of presetConfig.hooks.PreToolUse) {
      for (const hook of entry.hooks) {
        if (hook.command && hook.command.includes('node_modules')) {
          console.warn(`⚠ Hook still uses full path: ${hook.command}`);
          useBinCommands = false;
        }
      }
    }
    if (useBinCommands) {
      console.log('✓ All hooks use bin commands');
    }
  }
} catch (error) {
  console.error(`✗ Error parsing index.json: ${error.message}`);
  process.exit(1);
}

console.log('\n✅ All tests passed!');
