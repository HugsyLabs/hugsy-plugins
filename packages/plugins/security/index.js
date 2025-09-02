/**
 * @hugsy/plugin-security
 * Security restrictions for Claude Code
 *
 * This plugin focuses on preventing truly dangerous operations
 * without interfering with normal development workflow
 */

export default {
  name: 'plugin-security',
  version: '0.0.1',
  description: 'Security restrictions to prevent dangerous operations',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};

    // SIMPLIFIED: Only deny truly dangerous operations
    const denyPermissions = [
      // System destruction
      'Bash(rm -rf /)',
      'Bash(rm -rf /*)',
      'Bash(chmod 777 /)',
      'Bash(chmod -R 777 /)',

      // Remote code execution
      'Bash(curl * | bash)',
      'Bash(wget * | bash)',
      'Bash(curl * | sh)',
      'Bash(wget * | sh)',

      // System files (not project files)
      'Write(/etc/passwd)',
      'Write(/etc/shadow)',
      'Write(/etc/sudoers)',
      'Write(/System/**)',
      'Write(/Windows/**)',

      // Dangerous evaluations
      'Bash(eval *)'
    ];

    // Add deny permissions that aren't already present
    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Ask for potentially risky operations
    const askPermissions = [
      // Mass deletions
      'Bash(rm -rf *)',

      // System modifications
      'Bash(sudo *)',
      'Bash(apt-get install *)',
      'Bash(brew install *)',
      'Bash(systemctl *)',

      // Force push to main branches
      'Bash(git push --force origin main)',
      'Bash(git push --force origin master)',

      // Global package installations
      'Bash(npm install -g *)',
      'Bash(pip install --user *)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // USEFUL security hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Warn about SSH key operations
    config.hooks.PreToolUse.push({
      matcher: 'Write(**/.ssh/**)',
      command: 'echo "⚠️ WARNING: Modifying SSH keys. Ensure proper permissions (600) are set."'
    });

    // Hook: Warn about environment file changes
    config.hooks.PreToolUse.push({
      matcher: 'Write(**/.env*)',
      command: 'echo "🔒 WARNING: Modifying environment file. Never commit secrets to version control."'
    });

    // Hook: Warn about credentials in code
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    config.hooks.PostToolUse.push({
      matcher: 'Write(**/*.{js,ts,py,java,go})',
      command: 'grep -E "(api[_-]?key|password|secret|token)\\s*=\\s*[\\"\'`][^\\"\'`]+[\\"\'`]" "$1" 2>/dev/null | head -1 && echo "⚠️ WARNING: Possible hardcoded credentials detected!" || true'
    });

    return config;
  }
};
