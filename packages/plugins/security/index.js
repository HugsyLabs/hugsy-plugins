/**
 * @hugsy/plugin-security
 * Security restrictions for Claude Code
 *
 * This plugin focuses solely on security operations:
 * - Deny dangerous operations
 * - Protect sensitive files
 * - Restrict system commands
 * - Add security warnings
 */

export default {
  name: 'plugin-security',
  version: '0.0.1',
  description: 'Security restrictions to protect sensitive files and operations',

  transform(config) {
    // Initialize config structures
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.ask = config.permissions.ask || [];
    config.permissions.deny = config.permissions.deny || [];
    config.hooks = config.hooks || {};

    // Deny dangerous operations
    const denyPermissions = [
      // Environment files
      'Read(**/.env)',
      'Read(**/.env.*)',
      'Read(**/*.env)',
      'Write(**/.env)',
      'Write(**/.env.*)',
      'Write(**/*.env)',

      // SSH and keys
      'Read(**/.ssh/**)',
      'Read(**/*.pem)',
      'Read(**/*.key)',
      'Read(**/*.cert)',
      'Read(**/*.crt)',
      'Read(**/*.p12)',
      'Read(**/*.pfx)',
      'Write(**/.ssh/**)',
      'Write(**/*.pem)',
      'Write(**/*.key)',
      'Write(**/*.cert)',
      'Write(**/*.crt)',
      'Write(**/*.p12)',
      'Write(**/*.pfx)',

      // Credentials and secrets
      'Read(**/credentials*)',
      'Read(**/secrets*)',
      'Read(**/*secret*)',
      'Read(**/*password*)',
      'Read(**/*token*)',
      'Read(**/*apikey*)',
      'Read(**/*api_key*)',
      'Write(**/credentials*)',
      'Write(**/secrets*)',
      'Write(**/*secret*)',
      'Write(**/*password*)',
      'Write(**/*token*)',
      'Write(**/*apikey*)',
      'Write(**/*api_key*)',

      // AWS credentials
      'Read(**/.aws/**)',
      'Write(**/.aws/**)',

      // Google Cloud credentials
      'Read(**/.gcloud/**)',
      'Read(**/gcloud/**)',
      'Write(**/.gcloud/**)',
      'Write(**/gcloud/**)',

      // Database files
      'Read(**/*.db)',
      'Read(**/*.sqlite)',
      'Read(**/*.sqlite3)',
      'Write(**/*.db)',
      'Write(**/*.sqlite)',
      'Write(**/*.sqlite3)',

      // System files
      'Read(/etc/passwd)',
      'Read(/etc/shadow)',
      'Read(/etc/sudoers)',
      'Write(/etc/passwd)',
      'Write(/etc/shadow)',
      'Write(/etc/sudoers)',

      // Dangerous bash commands
      'Bash(rm -rf /)',
      'Bash(rm -rf /*)',
      'Bash(chmod 777 /)',
      'Bash(chmod -R 777 /)',
      'Bash(curl * | bash)',
      'Bash(wget * | bash)',
      'Bash(curl * | sh)',
      'Bash(wget * | sh)',
      'Bash(eval *)',
      'Bash(exec *)',

      // Package manager global installs
      'Bash(npm install -g *)',
      'Bash(yarn global add *)',
      'Bash(pip install --user *)',
      'Bash(pip install --system *)',
      'Bash(gem install *)',

      // Network tools
      'Bash(nc *)',
      'Bash(netcat *)',
      'Bash(nmap *)',

      // Process manipulation
      'Bash(kill -9 *)',
      'Bash(killall *)',
      'Bash(pkill *)',

      // System modifications
      'Bash(apt-get install *)',
      'Bash(apt install *)',
      'Bash(yum install *)',
      'Bash(brew install *)',
      'Bash(systemctl *)',
      'Bash(service * start)',
      'Bash(service * stop)',
      'Bash(service * restart)'
    ];

    // Add deny permissions that aren't already present
    denyPermissions.forEach((perm) => {
      if (!config.permissions.deny.includes(perm)) {
        config.permissions.deny.push(perm);
      }
    });

    // Ask before sensitive operations
    const askPermissions = [
      // File deletions
      'Bash(rm -rf *)',
      'Bash(rm -r *)',
      'Bash(find * -delete)',

      // Permission changes
      'Bash(chmod *)',
      'Bash(chown *)',
      'Bash(chgrp *)',

      // Archive extraction
      'Bash(tar -xf *)',
      'Bash(unzip *)',
      'Bash(gunzip *)',

      // Downloads
      'Bash(curl -o *)',
      'Bash(wget *)',
      'Bash(curl --output *)',

      // Docker operations
      'Bash(docker run *)',
      'Bash(docker exec *)',
      'Bash(docker rm *)',
      'Bash(docker rmi *)',

      // Database operations
      'Bash(mysql *)',
      'Bash(psql *)',
      'Bash(mongo *)',
      'Bash(redis-cli *)',

      // Git operations on protected branches
      'Bash(git push --force)',
      'Bash(git push --force-with-lease)',
      'Bash(git reset --hard)',
      'Bash(git clean -fd)'
    ];

    askPermissions.forEach((perm) => {
      if (!config.permissions.ask.includes(perm)) {
        config.permissions.ask.push(perm);
      }
    });

    // Add security hooks
    config.hooks.PreToolUse = config.hooks.PreToolUse || [];

    // Hook: Warn about sudo usage
    config.hooks.PreToolUse.push({
      matcher: 'Bash(sudo *)',
      command: 'echo "⚠️ WARNING: Sudo command detected. This requires elevated privileges."'
    });

    // Hook: Warn about file deletions
    config.hooks.PreToolUse.push({
      matcher: 'Bash(rm *)',
      command: 'echo "⚠️ WARNING: File deletion command. Please verify the path."'
    });

    // Hook: Warn about permission changes
    config.hooks.PreToolUse.push({
      matcher: 'Bash(chmod *)',
      command: 'echo "⚠️ WARNING: Permission change detected. This may affect file security."'
    });

    // Post-operation hooks
    config.hooks.PostToolUse = config.hooks.PostToolUse || [];

    // Hook: After downloading files
    config.hooks.PostToolUse.push({
      matcher: 'Bash(curl *)',
      command: 'echo "📥 Download completed. Verify the source before executing."'
    });

    config.hooks.PostToolUse.push({
      matcher: 'Bash(wget *)',
      command: 'echo "📥 Download completed. Verify the source before executing."'
    });

    return config;
  }
};
