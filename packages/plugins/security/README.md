# @hugsy/plugin-security

Security restrictions plugin for Hugsy that focuses solely on protecting sensitive files and operations.

## Features

- 🔒 Deny access to sensitive files (env, keys, secrets)
- 🛡️ Block dangerous system commands
- ⚠️ Require confirmation for risky operations
- 🚨 Security warnings via hooks
- 🔐 Protect credentials and API keys
- 🚫 Prevent accidental data loss

## Installation

```bash
npm install @hugsy/plugin-security
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsy/plugin-security"]
}
```

## What It Adds

### Denied Operations

The plugin **completely blocks** these dangerous operations:

**Sensitive Files:**

- Environment files (`.env`, `.env.*`)
- SSH keys and certificates
- Credentials and secrets
- API keys and tokens
- AWS/GCloud credentials
- Database files

**System Operations:**

- System file modifications (`/etc/passwd`, `/etc/shadow`)
- Dangerous deletions (`rm -rf /`)
- Unsafe script execution (`curl | bash`)
- Global package installations
- Network scanning tools
- Process termination commands
- System service management

### Ask Before Operations

The plugin **requires confirmation** for these operations:

- File/directory deletions (`rm -rf`, `rm -r`)
- Permission changes (`chmod`, `chown`)
- Archive extraction (`tar`, `unzip`)
- File downloads (`curl`, `wget`)
- Docker operations
- Database connections
- Force Git operations

### Security Hooks

**Pre-operation warnings:**

- Sudo command detection
- File deletion warnings
- Permission change alerts

**Post-operation notifications:**

- Download completion alerts
- Source verification reminders

## Security Philosophy

This plugin follows the principle of **least privilege**:

1. **Deny by default** - Block access to known sensitive files
2. **Ask when uncertain** - Require confirmation for risky operations
3. **Warn proactively** - Alert users before dangerous actions
4. **Protect data** - Prevent accidental data loss or exposure

## Single Responsibility

This plugin focuses **solely** on security restrictions:

- Protecting sensitive files
- Blocking dangerous commands
- Requiring confirmations
- Adding security warnings

It does NOT handle:

- General permissions (use presets)
- Development workflows (use other plugins)
- Git operations (use `@hugsy/plugin-git`)
- Testing (use `@hugsy/plugin-test`)

## Customization

You can override specific restrictions in your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsy/plugin-security"],
  "permissions": {
    "allow": ["Read(**/.env.example)"]
  }
}
```

## License

MIT
