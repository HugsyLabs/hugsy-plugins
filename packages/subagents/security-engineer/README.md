# @hugsylabs/subagent-security-engineer

A specialized security engineering subagent for Claude Code with deep expertise in infrastructure security, DevSecOps practices, and cloud security architecture.

> **Credits**: This subagent is adapted from the [security-engineer subagent](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/security-engineer.md) by VoltAgent, licensed under MIT License.

## Installation

### Using npm:

```bash
npm install @hugsylabs/subagent-security-engineer
```

### Using pnpm:

```bash
pnpm add @hugsylabs/subagent-security-engineer
```

## Configuration

Add the subagent to your `.hugsyrc` configuration:

```json
{
  "subagents": {
    "presets": ["@hugsylabs/subagent-security-engineer"]
  }
}
```

Or reference it directly in your configuration:

```json
{
  "subagents": {
    "files": [".claude/agents/*.md"],
    "presets": ["@hugsylabs/subagent-security-engineer"]
  }
}
```

### Manual Installation

You can also copy the `security-engineer.md` file directly to your project's `.claude/agents/` directory.

## Usage

Once installed, invoke the security engineer subagent in Claude Code using the Task tool:

```
Use the security-engineer subagent to perform a security audit of this codebase
```

## Capabilities

### Security Expertise

- **Infrastructure Security**: OS hardening, container security, Kubernetes policies, network controls
- **DevSecOps Practices**: Shift-left security, security as code, automated testing, SAST/DAST
- **Cloud Security**: AWS/Azure/GCP security tools, IAM best practices, VPC architecture
- **Compliance Automation**: Compliance as code, continuous monitoring, policy enforcement
- **Vulnerability Management**: Automated scanning, risk prioritization, patch management
- **Incident Response**: Detection, automated playbooks, forensics, recovery procedures
- **Zero-Trust Architecture**: Identity-based perimeters, micro-segmentation, least privilege
- **Secrets Management**: Vault integration, dynamic secrets, rotation automation

### Available Tools

- `Read` - Analyze code and configuration files
- `Write` / `MultiEdit` - Implement security fixes and configurations
- `Bash` - Execute security scanning commands
- `Grep` / `LS` - Search for security patterns and vulnerabilities
- `WebFetch` / `WebSearch` - Research security advisories and best practices

## Example Use Cases

### Security Audit

```
Use the security-engineer subagent to perform a comprehensive security audit, checking for vulnerabilities, misconfigurations, and compliance issues
```

### DevSecOps Implementation

```
Use the security-engineer subagent to integrate security scanning into our CI/CD pipeline with automated vulnerability detection
```

### Incident Response

```
Use the security-engineer subagent to help investigate and respond to a potential security incident in our application
```

### Cloud Security Review

```
Use the security-engineer subagent to review our AWS infrastructure for security best practices and implement improvements
```

### Vulnerability Assessment

```
Use the security-engineer subagent to scan for security vulnerabilities in dependencies and provide remediation guidance
```

## Security Checklist

The security-engineer subagent follows this comprehensive checklist:

- ✅ CIS benchmarks compliance verified
- ✅ Zero critical vulnerabilities in production
- ✅ Security scanning in CI/CD pipeline
- ✅ Secrets management automated
- ✅ RBAC properly implemented
- ✅ Network segmentation enforced
- ✅ Incident response plan tested
- ✅ Compliance evidence automated

## Integration

The security-engineer subagent works seamlessly with other specialized agents:

- Collaborates with DevOps engineers on secure CI/CD
- Supports cloud architects on security architecture
- Assists SRE teams with incident response
- Partners with platform engineers on secure infrastructure

## License

MIT - See LICENSE file for details

## Contributing

Contributions are welcome! Please see our contributing guidelines.

## Support

For issues or questions, please open an issue on our [GitHub repository](https://github.com/HugsyLabs/hugsy-plugins/issues).
