/**
 * Configuration constants for Kyle's preset hooks
 */

// Timeout configurations (in milliseconds)
const TIMEOUTS = {
  QUICK: 5000,      // 5 seconds - for quick checks like intent analysis
  NORMAL: 10000,    // 10 seconds - for normal operations like quality/architecture checks
  LONG: 30000,      // 30 seconds - for longer operations like TypeScript compilation
  EXTRA_LONG: 60000 // 60 seconds - for complex operations like full test/build runs
};

// Test coverage requirements
const COVERAGE_REQUIREMENTS = {
  MINIMUM: 85,      // Minimum required coverage percentage
  WARNING: 90,      // Coverage level for excellence
  TARGET: 95        // Aspirational coverage target
};

// File size limits for processing
const FILE_LIMITS = {
  MAX_CONTENT_LENGTH: 10000,  // Maximum characters to process in hooks
  MAX_LINE_LENGTH: 2000,       // Maximum characters per line
  MAX_LINES: 2000             // Maximum lines to process
};

// Validation settings
const VALIDATION_CONFIG = {
  typescript: {
    enabled: true,
    command: 'tsc --noEmit',
    timeout: TIMEOUTS.LONG,
    requiredCoverage: 0
  },
  tests: {
    enabled: true,
    command: 'npm test',
    timeout: TIMEOUTS.EXTRA_LONG,
    requiredCoverage: COVERAGE_REQUIREMENTS.MINIMUM
  },
  build: {
    enabled: true,
    command: 'npm run build',
    timeout: TIMEOUTS.EXTRA_LONG,
    requiredCoverage: 0
  },
  lint: {
    enabled: true,
    command: 'npm run lint',
    timeout: TIMEOUTS.LONG,
    requiredCoverage: 0
  }
};

// Error types for specific handling
const ERROR_TYPES = {
  QUALITY_VIOLATION: 'QUALITY_VIOLATION',
  ARCHITECTURE_VIOLATION: 'ARCHITECTURE_VIOLATION',
  VALIDATION_FAILURE: 'VALIDATION_FAILURE',
  TIMEOUT: 'TIMEOUT',
  CONFIGURATION: 'CONFIGURATION',
  UNKNOWN: 'UNKNOWN'
};

// Exit codes
const EXIT_CODES = {
  SUCCESS: 0,
  VIOLATION: 1,
  ERROR: 2,
  TIMEOUT: 3,
  CONFIGURATION_ERROR: 4
};

module.exports = {
  TIMEOUTS,
  COVERAGE_REQUIREMENTS,
  FILE_LIMITS,
  VALIDATION_CONFIG,
  ERROR_TYPES,
  EXIT_CODES
};