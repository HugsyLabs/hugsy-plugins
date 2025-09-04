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
    config.hooks = config.hooks || {};

    // SIMPLIFIED: Trust git users
    const gitPermissions = [
      // All git operations
      'Bash(git *)',
      'Bash(gh *)', // GitHub CLI

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

    // Keep USEFUL hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Prevent commits to protected branches
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"git commit"* ]]; then
            git rev-parse --abbrev-ref HEAD | grep -E "^(main|master)$" && echo "⚠️ Warning: Committing directly to main/master branch" || true;
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Hook: Check for large files before commit
    config.hooks.PreToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"git add"* ]]; then
            find . -size +100M -type f 2>/dev/null | grep -v node_modules | head -5 | xargs -I {} echo "⚠️ Large file detected: {}";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: Remind to push after commit
    config.hooks.PostToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"git commit"* ]]; then
            echo "💡 Remember to push your changes when ready: git push";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    // Hook: Suggest PR after push
    config.hooks.PostToolUse.push({
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: `bash -c '
          INPUT=$(cat);
          CMD=$(echo "$INPUT" | jq -r ".tool_input.command // empty");
          if [[ "$CMD" == *"git push"* ]]; then
            echo "✅ Changes pushed. Consider creating a pull request if working on a feature branch.";
          fi
          echo "$INPUT";
        '`
        }
      ]
    });

    return config;
  }
};
