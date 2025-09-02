/**
 * @hugsy/plugin-node
 * Node.js development support for Claude Code
 */

export default {
  name: 'plugin-node',
  version: '0.0.1',
  description: 'Node.js development support with npm, yarn, pnpm and toolchain integration',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // Node.js execution and package management permissions
    const nodePermissions = [
      // Node.js runtime
      'Bash(node *)',
      'Bash(nodejs *)',
      'Bash(npx *)',
      'Bash(tsx *)',
      'Bash(ts-node *)',

      // Package managers
      'Bash(npm *)',
      'Bash(yarn *)',
      'Bash(pnpm *)',
      'Bash(bun *)',

      // Common npm scripts
      'Bash(npm run *)',
      'Bash(npm test)',
      'Bash(npm start)',
      'Bash(npm run dev)',
      'Bash(npm run build)',
      'Bash(npm run lint)',
      'Bash(npm run format)',
      'Bash(yarn run *)',
      'Bash(yarn test)',
      'Bash(yarn start)',
      'Bash(yarn dev)',
      'Bash(yarn build)',
      'Bash(pnpm run *)',
      'Bash(pnpm test)',
      'Bash(pnpm dev)',
      'Bash(pnpm build)',

      // Testing frameworks
      'Bash(jest *)',
      'Bash(vitest *)',
      'Bash(mocha *)',
      'Bash(ava *)',
      'Bash(tap *)',
      'Bash(playwright *)',
      'Bash(cypress *)',

      // Linting and formatting
      'Bash(eslint *)',
      'Bash(prettier *)',
      'Bash(standard *)',
      'Bash(xo *)',
      'Bash(tslint *)',

      // Build tools
      'Bash(webpack *)',
      'Bash(vite *)',
      'Bash(rollup *)',
      'Bash(parcel *)',
      'Bash(esbuild *)',
      'Bash(turbo *)',
      'Bash(tsc *)',
      'Bash(babel *)',
      'Bash(swc *)',

      // File operations
      'Write(**/*.js)',
      'Write(**/*.jsx)',
      'Write(**/*.ts)',
      'Write(**/*.tsx)',
      'Write(**/*.mjs)',
      'Write(**/*.cjs)',
      'Write(**/*.json)',
      'Write(**/package.json)',
      'Write(**/package-lock.json)',
      'Write(**/yarn.lock)',
      'Write(**/pnpm-lock.yaml)',
      'Write(**/bun.lockb)',
      'Write(**/tsconfig.json)',
      'Write(**/tsconfig.*.json)',
      'Write(**/jsconfig.json)',
      'Write(**/.eslintrc*)',
      'Write(**/eslint.config.*)',
      'Write(**/.prettierrc*)',
      'Write(**/prettier.config.*)',
      'Write(**/jest.config.*)',
      'Write(**/vitest.config.*)',
      'Write(**/webpack.config.*)',
      'Write(**/vite.config.*)',
      'Write(**/rollup.config.*)',
      'Write(**/.babelrc*)',
      'Write(**/babel.config.*)',
      'Write(**/.swcrc)',
      'Write(**/.nvmrc)',
      'Write(**/.node-version)',
      'Write(**/.npmrc)',
      'Write(**/.yarnrc*)',
      'Write(**/.pnpmfile.cjs)'
    ];

    // Add permissions that aren't already present
    nodePermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask permissions for sensitive operations
    const askPermissions = [
      'Bash(npm install)',
      'Bash(npm install *)',
      'Bash(npm ci)',
      'Bash(npm update)',
      'Bash(npm audit fix)',
      'Bash(yarn install)',
      'Bash(yarn add *)',
      'Bash(yarn upgrade)',
      'Bash(pnpm install)',
      'Bash(pnpm add *)',
      'Bash(pnpm update)',
      'Bash(npm publish)',
      'Bash(yarn publish)',
      'Bash(pnpm publish)',
      'Bash(npm link)',
      'Bash(npm unlink)',
      'Write(**/migrations/**)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny dangerous operations
    const denyPermissions = [
      'Bash(npm install -g *)',
      'Bash(yarn global add *)',
      'Bash(pnpm add -g *)',
      'Bash(rm -rf node_modules)',
      'Bash(npm audit fix --force)',
      'Write(**/node_modules/**)',
      'Write(**/.next/**)',
      'Write(**/dist/**)',
      'Write(**/build/**)',
      'Write(**/out/**)',
      'Write(**/coverage/**)',
      'Write(**/.turbo/**)',
      'Write(**/.cache/**)',
      'Write(**/.parcel-cache/**)'
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Add Node.js-specific environment variables
    Object.assign(config.env, {
      NODE_ENV: config.env.NODE_ENV || 'development',
      NODE_OPTIONS: config.env.NODE_OPTIONS || '--max-old-space-size=4096',
      ...config.env
    });

    // Add Node.js-specific hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check for lockfile before install
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm install)',
      command:
        'test -f package-lock.json || echo "⚠️ No package-lock.json found. Consider using npm ci for reproducible installs."'
    });

    // Hook: Lint before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git commit *)',
      command:
        'npm run lint --if-present || yarn lint --if-present || pnpm lint --if-present || true'
    });

    // Hook: Test before push
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push *)',
      command: 'npm test --if-present || yarn test --if-present || pnpm test --if-present || true'
    });

    // Hook: Build check
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/src/**/*.{js,jsx,ts,tsx})',
      command: 'echo "📦 Source file changed. Consider running build to check for errors."'
    });

    // Hook: Dependency update reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash(npm install *)',
      command: 'echo "📝 Package installed. Remember to commit the lockfile changes."'
    });

    // Hook: Security audit reminder
    config.hooks.PostToolUse.push({
      matcher: 'Bash(npm install)',
      command: 'echo "🔒 Consider running npm audit to check for vulnerabilities."'
    });

    return config;
  }
};
