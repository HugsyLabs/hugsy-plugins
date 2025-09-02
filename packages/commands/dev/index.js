/**
 * @hugsy/commands-dev
 * Development slash commands for Claude Code
 */

export default {
  name: 'commands-dev',
  version: '0.0.1',
  description: 'Essential development commands for productive coding',

  transform(config) {
    // Initialize commands structure if it doesn't exist
    if (!config.commands) {
      config.commands = {};
    }

    // If commands is an array (shorthand for presets), convert to object format
    if (Array.isArray(config.commands)) {
      config.commands = { presets: config.commands };
    }

    // Initialize commands.commands if it doesn't exist
    if (!config.commands.commands) {
      config.commands.commands = {};
    }

    // Add development commands
    Object.assign(config.commands.commands, {
      'quick-fix': {
        content: `Analyze the current error and provide a quick fix.

Instructions:
1. First, identify the error by looking at error messages, stack traces, or problematic code
2. Understand the root cause - is it a syntax error, logic error, type error, or runtime error?
3. Provide the minimal fix needed to resolve the issue
4. Test the fix if possible by running the relevant command
5. Explain what caused the error and how the fix resolves it

Focus on fixing the immediate problem without over-engineering.`,
        description: 'Quick fix for current error',
        argumentHint: '[error-description]'
      },

      implement: {
        content: `Implement a feature or requirement step by step.

Instructions:
1. First, clarify the requirement - what needs to be built?
2. Break down the implementation into logical steps
3. Consider edge cases and error handling
4. Write clean, maintainable code following project conventions
5. Add appropriate comments for complex logic
6. Create or update tests if a test framework is present
7. Verify the implementation works as expected

Be thorough but efficient. Follow existing patterns in the codebase.`,
        description: 'Implement a feature',
        argumentHint: '[feature-description]'
      },

      explain: {
        content: `Explain how the current code works.

Instructions:
1. Read and analyze the specified code or file
2. Identify the main purpose and functionality
3. Explain the logic flow step by step
4. Highlight any important patterns or techniques used
5. Point out potential issues or areas for improvement
6. Provide examples of how to use the code if applicable

Make the explanation clear and accessible, avoiding unnecessary jargon.`,
        description: 'Explain code',
        argumentHint: '[file-or-function]'
      },

      debug: {
        content: `Debug the current issue systematically.

Instructions:
1. Gather information about the problem - what's expected vs what's happening?
2. Add strategic console.log/print statements to trace execution
3. Check variable values at key points
4. Identify where the behavior diverges from expectations
5. Form a hypothesis about the cause
6. Test the hypothesis with a fix
7. Clean up debug code after fixing

Be methodical and document findings as you go.`,
        description: 'Debug an issue',
        argumentHint: '[issue-description]'
      },

      optimize: {
        content: `Optimize the code for better performance or readability.

Instructions:
1. Analyze the current code for performance bottlenecks or readability issues
2. Identify specific areas that can be improved
3. Consider time complexity, space complexity, and code clarity
4. Apply optimization techniques while maintaining correctness
5. Measure or estimate the improvement
6. Ensure the optimized code is still maintainable
7. Add comments explaining any complex optimizations

Balance performance gains with code maintainability.`,
        description: 'Optimize code',
        argumentHint: '[file-or-function]'
      },

      review: {
        content: `Review the recent changes for quality and best practices.

Instructions:
1. Examine all recently modified files
2. Check for code style consistency
3. Look for potential bugs or edge cases
4. Verify error handling is appropriate
5. Ensure naming is clear and consistent
6. Check for security issues or vulnerabilities
7. Verify tests cover the new functionality
8. Suggest improvements if needed

Provide constructive feedback focused on code quality.`,
        description: 'Review recent changes'
      },

      scaffold: {
        content: `Create boilerplate code for a new component or module.

Instructions:
1. Determine the type of component/module to create
2. Follow the project's file structure conventions
3. Create the main file with basic structure
4. Add necessary imports and exports
5. Include basic error handling
6. Create a test file if testing is set up
7. Add any required configuration
8. Include helpful comments and TODOs

Generate production-ready boilerplate that follows project patterns.`,
        description: 'Scaffold new component',
        argumentHint: '[component-type] [name]'
      },

      todo: {
        content: `Find and list all TODO comments in the codebase.

Instructions:
1. Search for TODO, FIXME, HACK, and NOTE comments
2. Group them by file and priority
3. Show the context around each comment
4. Identify which ones are most important
5. Suggest which ones to tackle first
6. Offer to help implement any specific TODO

Help manage technical debt by surfacing existing TODOs.`,
        description: 'Find all TODOs'
      },

      cleanup: {
        content: `Clean up the code by removing unused elements and improving organization.

Instructions:
1. Identify unused imports, variables, and functions
2. Remove commented-out code that's no longer needed
3. Consolidate duplicate code into reusable functions
4. Organize imports and exports consistently
5. Fix any obvious formatting issues
6. Remove unnecessary console.log/print statements
7. Update or remove outdated comments

Make the codebase cleaner without changing functionality.`,
        description: 'Clean up code'
      },

      'setup-dev': {
        content: `Set up the development environment for this project.

Instructions:
1. Check what type of project this is (Node, Python, Java, etc.)
2. Verify required runtime versions are installed
3. Install project dependencies
4. Set up any required environment variables
5. Initialize database or other services if needed
6. Run any setup scripts
7. Verify the development server starts correctly
8. Run tests to ensure everything works

Get the project running locally with minimal friction.`,
        description: 'Setup development environment'
      }
    });

    return config;
  }
};
