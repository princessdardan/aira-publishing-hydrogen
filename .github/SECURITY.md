# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2025.x  | :white_check_mark: |
| < 2025  | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Preferred Method: Private Vulnerability Reporting**

Please report security vulnerabilities via GitHub's Private Vulnerability Reporting feature:

1. Go to the Security tab
2. Click "Report a vulnerability"
3. Fill out the vulnerability details form

Alternatively, you can create a private security advisory:
https://github.com/princessdardan/aira-publishing-hydrogen/security/advisories/new

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Proof of Concept**: Code snippets or screenshots if applicable
- **Suggested Fix**: If you have ideas on how to fix it (optional)
- **Affected Versions**: Which versions are impacted

### Response Timeline

- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 5 business days
- **Status Updates**: Weekly until resolved
- **Fix Timeline**: Depends on severity (see below)

### Severity Response Times

| Severity | CVSS Score | Target Response Time |
|----------|------------|---------------------|
| Critical | 9.0-10.0   | < 24 hours          |
| High     | 7.0-8.9    | < 1 week            |
| Medium   | 4.0-6.9    | < 1 month           |
| Low      | 0.1-3.9    | < 3 months          |

## Security Update Process

1. **Triage**: Security team reviews the report
2. **Verification**: We verify and reproduce the issue
3. **Fix Development**: Develop and test a fix
4. **Disclosure**: Coordinate disclosure with reporter
5. **Release**: Deploy fix and publish security advisory
6. **Notification**: Notify users via GitHub Security Advisories

## Security Best Practices for Contributors

If you're contributing to this project:

- ✅ Never commit secrets, API keys, or credentials
- ✅ Run `npm audit` before submitting PRs
- ✅ Keep dependencies up to date
- ✅ Follow OWASP security guidelines
- ✅ Use environment variables for sensitive data
- ✅ Review Dependabot PRs promptly

## Security Measures in Place

This project implements:

- **Automated Dependency Scanning**: Dependabot and Snyk
- **CI/CD Security Checks**: npm audit in GitHub Actions
- **Secret Scanning**: GitHub secret scanning enabled
- **Code Scanning**: CodeQL analysis (if applicable)
- **Regular Updates**: Weekly dependency reviews

## Disclosure Policy

We follow responsible disclosure practices:

- We will work with you to understand and resolve the issue
- We request that you do not publicly disclose until we've issued a fix
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We aim for coordinated disclosure within 90 days

## Contact

For security-related questions or concerns:
- Use GitHub's private vulnerability reporting (preferred)
- Tag issues with the `security` label for non-sensitive security discussions

## Scope

### In Scope
- Security vulnerabilities in our codebase
- Dependency vulnerabilities
- Configuration issues leading to security problems
- Authentication/authorization bypasses
- Data exposure issues

### Out of Scope
- Vulnerabilities in third-party services (Shopify, etc.)
- Social engineering attacks
- Physical attacks
- DDoS attacks

## Recognition

We appreciate security researchers who help keep our project secure. Valid vulnerability reports may be acknowledged in:
- Security advisories
- Release notes
- This security policy

Thank you for helping keep AIRA Publishing Hydrogen secure! 🔒
