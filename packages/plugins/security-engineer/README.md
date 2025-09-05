# @hugsy/plugin-security-engineer

A specialized security engineering subagent plugin for Claude Code that adds deep expertise in infrastructure security, DevSecOps practices, and cloud security architecture.

> **Credits**: This subagent is adapted from the [security-engineer subagent](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/security-engineer.md) by VoltAgent, licensed under MIT License.

## Features

This plugin adds a `security-engineer` subagent to Claude Code with expertise in:

- **Infrastructure Security**: OS hardening, container security, Kubernetes policies, network controls
- **DevSecOps Practices**: Shift-left security, security as code, automated testing, SAST/DAST
- **Cloud Security**: AWS/Azure/GCP security tools, IAM best practices, VPC architecture
- **Compliance Automation**: Compliance as code, continuous monitoring, policy enforcement
- **Vulnerability Management**: Automated scanning, risk prioritization, patch management
- **Incident Response**: Detection, automated playbooks, forensics, recovery procedures
- **Zero-Trust Architecture**: Identity-based perimeters, micro-segmentation, least privilege
- **Secrets Management**: Vault integration, dynamic secrets, rotation automation

## Installation

```bash
npm install @hugsy/plugin-security-engineer
```

Or with pnpm:

```bash
pnpm add @hugsy/plugin-security-engineer
```

## Configuration

Add the plugin to your `.hugsyrc` or `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsy/plugin-security-engineer"]
}
```

Or with JavaScript configuration (`.hugsyrc.js`):

```javascript
export default {
  plugins: ['@hugsy/plugin-security-engineer']
};
```

## Usage

Once installed, you can invoke the security engineer subagent in Claude Code using the Task tool:

```
Use the security-engineer subagent to perform a security audit of this codebase
```

The subagent will:

1. Analyze your infrastructure and codebase for security vulnerabilities
2. Review security controls and compliance requirements
3. Identify attack surfaces and security patterns
4. Provide recommendations following security best practices

## Tools Available

The security-engineer subagent has access to the following tools:

- **Read**: Analyze code and configuration files
- **Write/MultiEdit**: Implement security fixes and configurations
- **Bash**: Execute security scanning commands
- **Grep/LS**: Search for security patterns and vulnerabilities
- **WebFetch/WebSearch**: Research security advisories and best practices

## Security Capabilities

### Vulnerability Scanning

- Identifies common security vulnerabilities (OWASP Top 10, CWE)
- Analyzes dependencies for known CVEs
- Reviews infrastructure misconfigurations
- Detects hardcoded secrets and credentials

### Compliance Checks

- CIS benchmarks validation
- SOC2/ISO27001 compliance mapping
- GDPR/HIPAA requirements assessment
- Custom policy enforcement

### Security Automation

- CI/CD pipeline security integration
- Automated remediation scripts
- Security monitoring setup
- Incident response playbooks

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

## Integration with Other Agents

The security-engineer subagent works seamlessly with other specialized agents:

- Collaborates with DevOps engineers on secure CI/CD
- Supports cloud architects on security architecture
- Assists SRE teams with incident response
- Partners with platform engineers on secure infrastructure

## Best Practices

1. **Regular Security Audits**: Run security assessments periodically
2. **Shift-Left Security**: Integrate security early in development
3. **Automation First**: Automate security controls and responses
4. **Defense in Depth**: Implement multiple layers of security
5. **Continuous Monitoring**: Set up ongoing security monitoring

## License

MIT - See LICENSE file for details

## Contributing

Contributions are welcome! Please see our contributing guidelines for more information.

## Support

For issues or questions, please open an issue on our [GitHub repository](https://github.com/HugsyLabs/hugsy-plugins/issues).
