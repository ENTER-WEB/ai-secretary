# Security

## Data classification

- Private: chats, work transcripts, uploaded avatar images.
- Secret: Codex credential/session material. The app must never read, display, transmit, or persist it.

## Authentication and authorization

- v1 is a single-user, loopback-only application.
- Task execution requires a fresh user approval and a bridge-generated one-time request ID.

## Threats and abuse cases

| ID | Threat / abuse | Asset | Control | Residual risk | Test |
|---|---|---|---|---|---|
| TH-001 | Prompt injection causes unintended task execution | Chat/task content | Draft/approve separation; never execute assistant text directly | User may approve a harmful task | Approval integration test |
| TH-002 | Remote site accesses local bridge | Codex access | Bind loopback only; origin allow-list and CSRF-style request token | Local malware remains out of scope | Bridge socket test |
| TH-003 | Credential disclosure | Codex session | No credential API, logs redacted | OS compromise is outside app control | Source review |
| TH-004 | Malicious avatar file | Browser/app availability | Accept image MIME types, size cap, render as local object URL | Browser decoder vulnerabilities | Upload validation test |

## AI-specific risks

- Prompt injection: treat chat and task suggestions as untrusted; drafting never implies approval.
- Data exfiltration: no remote service is configured in v1; logs must not contain secrets.
- Tool permission boundaries: bridge accepts a structured task, not arbitrary shell command arguments.
- Model/output validation: display output as text; never evaluate it as HTML or code.
- Human approval points: each Codex task, and any future external connector action.
