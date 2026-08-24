# Test Strategy

| Risk | Prevention | Evidence |
|---|---|---|
| Unapproved Codex task | IPC handler requires a `confirmed` approval value and validates task schema | Unit and IPC contract tests |
| Web page reaches Codex | Packaged app has no HTTP bridge and renderer cannot access Node APIs | Electron security test |
| Path escape | Workspace selector canonicalizes paths and the user sees it before approval | Unit test |
| Tampered installer | Code-sign and checksum verification | CI release verification |
| Secret leakage | No credential read API; output redaction tests | Source review and test |

## Test layers

- Unit: payload validation, workspace validation, task state transitions.
- Contract: preload API exposes only approved IPC methods.
- Integration: main process starts Codex with an argument array, never a shell string.
- End-to-end: upload avatar, separate history tabs, draft, approve, cancel, and bridge-unavailable flow.
- Security: Electron fuses/settings, CSP, no Node renderer access, code-signature verification.
- Release: Windows clean-machine installer smoke test and rollback test.
