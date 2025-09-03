/**
 * @hugsylabs/plugin-node
 * Enhanced Node.js development support for Claude Code
 * Features: changeset protection, smart package manager detection, environment consistency
 */

export default {
  name: 'plugin-node',
  version: '0.0.1',
  description: 'Enhanced Node.js development support with intelligent features',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};
    config.env = config.env || {};

    // ===== PERMISSIONS =====
    // Core Node.js tools permissions
    const nodePermissions = [
      // Package managers
      'Bash(node *)',
      'Bash(npm *)',
      'Bash(yarn *)',
      'Bash(pnpm *)',
      'Bash(npx *)',
      'Bash(bun *)',

      // Node version managers
      'Bash(nvm *)',
      'Bash(n *)',
      'Bash(fnm *)',

      // File operations for JS/TS projects
      'Read(**)',
      'Write(**)',
      'Edit(**)'
    ];

    // Add permissions that aren't already present
    nodePermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask for potentially destructive operations
    const askPermissions = [
      'Bash(npm publish)',
      'Bash(yarn publish)',
      'Bash(pnpm publish)',
      'Bash(npm install -g *)',
      'Bash(yarn global add *)',
      'Bash(pnpm add -g *)',
      'Bash(rm -rf node_modules)',
      'Bash(npm unpublish *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny dangerous operations
    const denyPermissions = [
      'Bash(rm -rf /)',
      'Bash(npm login)', // Prevent credential exposure
      'Bash(npm adduser)',
      'Bash(npm logout)' // Prevent accidental logout
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // ===== ENVIRONMENT VARIABLES =====
    Object.assign(config.env, {
      NODE_ENV: config.env.NODE_ENV || 'development',
      NODE_OPTIONS: config.env.NODE_OPTIONS || '--max-old-space-size=4096',
      // Disable npm update notifier in CI/automation
      NO_UPDATE_NOTIFIER: '1',
      // Enable colored output
      FORCE_COLOR: '1'
    });

    // ===== PRE-TOOL HOOKS =====
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // CRITICAL: Prevent changeset version on non-main branches
    config.hooks.PreToolUse.push({
      matcher: 'Bash(*changeset version*)',
      command: `
        BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown");
        if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
          echo "❌ Error: Cannot run 'changeset version' on branch '$BRANCH'";
          echo "";
          echo "   Changeset versioning should only be done on the main branch to avoid";
          echo "   version conflicts and ensure a clean release process.";
          echo "";
          echo "📝 Correct workflow:";
          echo "   1. Create changesets on feature branches: pnpm changeset add";
          echo "   2. Merge your PR to main";
          echo "   3. On main branch: pnpm changeset version";
          echo "   4. Create and merge the release PR";
          echo "";
          echo "💡 To switch to main: git checkout main";
          exit 1;
        fi
      `
    });

    // Also block npx changeset version
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npx changeset version*)',
      command: `
        BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown");
        if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
          echo "❌ Error: Cannot run 'changeset version' on branch '$BRANCH'";
          echo "   Please switch to main branch first.";
          exit 1;
        fi
      `
    });

    // Block changeset publish on non-main branches
    config.hooks.PreToolUse.push({
      matcher: 'Bash(*changeset publish*)',
      command: `
        BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown");
        if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
          echo "❌ Error: Cannot publish packages from branch '$BRANCH'";
          echo "   Publishing should only be done from the main branch.";
          exit 1;
        fi
      `
    });

    // Smart package manager detection for install commands
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm install*)',
      command: `
        if [ -f "yarn.lock" ]; then
          echo "⚠️  Warning: Found yarn.lock but using npm install";
          echo "   Consider using: yarn install";
        elif [ -f "pnpm-lock.yaml" ]; then
          echo "⚠️  Warning: Found pnpm-lock.yaml but using npm install";
          echo "   Consider using: pnpm install";
        elif [ -f "bun.lockb" ]; then
          echo "⚠️  Warning: Found bun.lockb but using npm install";
          echo "   Consider using: bun install";
        fi
      `
    });

    // Check Node version before running scripts
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm start*)',
      command: `
        if [ -f ".nvmrc" ]; then
          REQUIRED=$(cat .nvmrc);
          CURRENT=$(node -v);
          if [ "$CURRENT" != "$REQUIRED" ] && [ "$CURRENT" != "v$REQUIRED" ]; then
            echo "⚠️  Node version mismatch:";
            echo "   Required: $REQUIRED";
            echo "   Current: $CURRENT";
            echo "   Run: nvm use";
          fi
        fi
      `
    });

    // Check for missing dependencies
    config.hooks.PreToolUse.push({
      matcher: 'Bash(npm start*)',
      command: `
        if [ ! -d "node_modules" ]; then
          echo "⚠️  No node_modules found. Running install first...";
          if [ -f "pnpm-lock.yaml" ]; then
            pnpm install;
          elif [ -f "yarn.lock" ]; then
            yarn install;
          elif [ -f "package-lock.json" ]; then
            npm ci;
          else
            npm install;
          fi
        fi
      `
    });

    // Lint before commit (improved version)
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git commit *)',
      command: `
        if [ -f "package.json" ]; then
          # Check if lint script exists
          if grep -q '"lint"' package.json; then
            echo "🔍 Running lint checks...";
            if [ -f "pnpm-lock.yaml" ]; then
              pnpm run lint || { echo "⚠️  Lint failed. Committing anyway..."; true; }
            elif [ -f "yarn.lock" ]; then
              yarn lint || { echo "⚠️  Lint failed. Committing anyway..."; true; }
            else
              npm run lint || { echo "⚠️  Lint failed. Committing anyway..."; true; }
            fi
          fi
        fi
      `
    });

    // Test before push (improved version)
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push *)',
      command: `
        if [ -f "package.json" ]; then
          # Check if test script exists
          if grep -q '"test"' package.json; then
            echo "🧪 Running tests before push...";
            if [ -f "pnpm-lock.yaml" ]; then
              pnpm test || { echo "⚠️  Tests failed. Push with caution!"; true; }
            elif [ -f "yarn.lock" ]; then
              yarn test || { echo "⚠️  Tests failed. Push with caution!"; true; }
            else
              npm test || { echo "⚠️  Tests failed. Push with caution!"; true; }
            fi
          fi
        fi
      `
    });

    // ===== POST-TOOL HOOKS =====
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Guide after creating changeset
    config.hooks.PostToolUse.push({
      matcher: 'Bash(*changeset add*)',
      command: `
        echo "✅ Changeset created successfully!";
        echo "";
        echo "📝 Next steps:";
        echo "   1. Review the generated changeset file in .changeset/";
        echo "   2. Commit the changeset with your changes";
        echo "   3. Push your feature branch and create a PR";
        echo "   4. After PR is merged, version packages on main branch";
      `
    });

    // Smart auto-install after package.json changes
    config.hooks.PostToolUse.push({
      matcher: 'Write(**/package.json)',
      command: `
        echo "📦 package.json was modified. Installing dependencies...";
        if [ -f "pnpm-lock.yaml" ]; then
          pnpm install;
        elif [ -f "yarn.lock" ]; then
          yarn install;
        elif [ -f "package-lock.json" ]; then
          npm install;
        elif [ -f "bun.lockb" ]; then
          bun install;
        else
          echo "🤔 No lockfile found. Using npm install...";
          npm install;
        fi
      `
    });

    // Security audit reminder (improved)
    config.hooks.PostToolUse.push({
      matcher: 'Bash(*install*)',
      command: `
        if command -v npm >/dev/null 2>&1; then
          VULNS=$(npm audit --json 2>/dev/null | grep -o '"total":[0-9]*' | grep -o '[0-9]*' || echo "0");
          if [ "$VULNS" != "0" ] && [ "$VULNS" != "" ]; then
            echo "🔒 Security: Found $VULNS vulnerabilities.";
            echo "   Run 'npm audit' for details or 'npm audit fix' to auto-fix.";
          fi
        fi
      `
    });

    // Check for outdated dependencies
    config.hooks.PostToolUse.push({
      matcher: 'Bash(*install*)',
      command: `
        echo "💡 Tip: Check for outdated packages with:";
        if [ -f "pnpm-lock.yaml" ]; then
          echo "   pnpm outdated";
        elif [ -f "yarn.lock" ]; then
          echo "   yarn outdated";
        else
          echo "   npm outdated";
        fi
      `
    });

    return config;
  }
};
