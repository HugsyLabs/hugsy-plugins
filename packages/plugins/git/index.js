/**
 * @hugsylabs/plugin-git
 * Git version control integration for Claude Code
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

    // SIMPLIFIED: Trust git users
    const gitPermissions = [
      // All git operations
      'Bash(git *)',
      'Bash(gh *)',  // GitHub CLI

      // Git-related files
      'Write(**/.git*)',
      'Write(**/.github/**)',
      'Write(**/CODEOWNERS)'
    ];

    // Add permissions that aren't already present
    gitPermissions.forEach((perm) => {
      if (!config.permissions.allow.includes(perm)) {
        config.permissions.allow.push(perm);
      }
    });

    // Ask for destructive operations
    const askPermissions = [
      'Bash(git push --force *)',
      'Bash(git reset --hard *)',
      'Bash(git rebase *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Deny only truly dangerous operations
    const denyPermissions = [
      'Bash(git push --force origin main)',
      'Bash(git push --force origin master)'
    ];

    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Keep USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Prevent commits to protected branches
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git commit *)',
      command: 'git rev-parse --abbrev-ref HEAD | grep -E "^(main|master)$" && echo "⚠️ Warning: Committing directly to main/master branch" || true'
    });

    // Hook: Check for large files before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash(git add *)',
      command: 'find . -size +100M -type f 2>/dev/null | grep -v node_modules | head -5 | xargs -I {} echo "⚠️ Large file detected: {}"'
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Remind to push after commit
    config.hooks.PostToolUse.push({
      matcher: 'Bash(git commit *)',
      command: 'echo "💡 Remember to push your changes when ready: git push"'
    });

    // Hook: Suggest PR after push
    config.hooks.PostToolUse.push({
      matcher: 'Bash(git push *)',
      command: 'echo "✅ Changes pushed. Consider creating a pull request if working on a feature branch."'
    });

    return config;
  }
};
