/**
 * @hugsy/plugin-git
 * Git version control integration for Claude Code
 *
 * This plugin focuses solely on Git operations:
 * - Git command permissions
 * - Pre-commit and pre-push hooks
 * - Git configuration files
 */

export default {
  name: 'plugin-git',
  version: '0.0.1',
  description: 'Git version control permissions and hooks',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};

    // Git command permissions
    const gitPermissions = [
      // Basic operations
      'Bash(git init)',
      'Bash(git init *)',
      'Bash(git clone *)',
      'Bash(git status)',
      'Bash(git status *)',

      // Staging
      'Bash(git add *)',
      'Bash(git add .)',
      'Bash(git add -A)',
      'Bash(git add -p)',
      'Bash(git reset *)',
      'Bash(git reset)',
      'Bash(git restore *)',

      // Committing
      'Bash(git commit *)',
      'Bash(git commit -m *)',
      'Bash(git commit -am *)',
      'Bash(git commit --amend)',
      'Bash(git commit --amend *)',

      // Branching
      'Bash(git branch)',
      'Bash(git branch *)',
      'Bash(git checkout *)',
      'Bash(git checkout -b *)',
      'Bash(git switch *)',
      'Bash(git merge *)',
      'Bash(git rebase *)',

      // Remote operations
      'Bash(git remote *)',
      'Bash(git fetch)',
      'Bash(git fetch *)',
      'Bash(git pull)',
      'Bash(git pull *)',
      'Bash(git push)',
      'Bash(git push *)',

      // History and diff
      'Bash(git log)',
      'Bash(git log *)',
      'Bash(git diff)',
      'Bash(git diff *)',
      'Bash(git show *)',
      'Bash(git blame *)',

      // Stashing
      'Bash(git stash)',
      'Bash(git stash *)',

      // Tags
      'Bash(git tag)',
      'Bash(git tag *)',

      // Submodules
      'Bash(git submodule *)',

      // Config
      'Bash(git config *)',

      // GitHub CLI
      'Bash(gh *)',

      // Git files
      'Write(**/.gitignore)',
      'Write(**/.gitattributes)',
      'Write(**/.gitmodules)',
      'Write(**/.gitkeep)',
      'Write(**/CODEOWNERS)',
      'Write(**/.github/**)'
    ];

    // Add permissions that aren't already present
    gitPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask permissions for sensitive operations
    const askPermissions = [
      'Bash(git push --force)',
      'Bash(git push --force-with-lease)',
      'Bash(git reset --hard)',
      'Bash(git clean -fd)',
      'Bash(git rebase -i *)',
      'Bash(git cherry-pick *)',
      'Bash(git revert *)',
      'Bash(git config --global *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny dangerous operations
    const denyPermissions = [
      'Bash(git push --force origin main)',
      'Bash(git push --force origin master)',
      'Bash(git reset --hard origin/main)',
      'Bash(git reset --hard origin/master)',
      'Write(**/.git/**)'
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Add Git-specific hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Check for uncommitted changes before certain operations
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git checkout *)',
      command:
        'git status --porcelain | grep -q . && echo "⚠️ You have uncommitted changes" || true'
    });

    // Hook: Remind to pull before push
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push *)',
      command: 'echo "💡 Remember to pull latest changes before pushing"'
    });

    // Hook: Check branch before push
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git push)',
      command:
        'git rev-parse --abbrev-ref HEAD | grep -E "^(main|master)$" && echo "⚠️ Pushing to main branch" || true'
    });

    // Post-operation hooks
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: After commit
    config.hooks.PostToolUse.push({
      matcher: 'Bash(git commit *)',
      command: 'echo "✅ Commit created. Consider pushing your changes."'
    });

    // Hook: After merge
    config.hooks.PostToolUse.push({
      matcher: 'Bash(git merge *)',
      command: 'echo "🔀 Merge completed. Check for conflicts if any."'
    });

    // Hook: After clone
    config.hooks.PostToolUse.push({
      matcher: 'Bash(git clone *)',
      command: 'echo "📦 Repository cloned. Remember to install dependencies."'
    });

    return config;
  }
};
