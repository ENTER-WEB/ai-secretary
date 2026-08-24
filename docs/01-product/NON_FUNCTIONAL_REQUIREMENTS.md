# Non-functional Requirements

| ID | Requirement | Target / acceptance condition |
|---|---|---|
| NFR-001 | Supported platform | Signed Windows 10/11 x64 installer for the first public release. |
| NFR-002 | Desktop isolation | Electron renderer has context isolation, sandbox, no Node integration, and a restrictive CSP. |
| NFR-003 | Codex authority | Only the Electron main process may start Codex; every task is explicitly approved and sent as one prompt argument. |
| NFR-004 | Network boundary | Public release has no local HTTP task-control API; renderer uses authenticated Electron IPC only. |
| NFR-005 | Data privacy | Chats, task logs, and avatar images remain local by default; no analytics or cloud sync in v1. |
| NFR-006 | Update integrity | Installer and updates are code signed. Update metadata comes from the project-owned release channel over HTTPS. |
| NFR-007 | Dependency integrity | Lock files, CI dependency audit, SBOM, and release provenance are required before publication. |
| NFR-008 | User control | The app displays the task, target workspace, and write-capable sandbox before execution. |
| NFR-009 | Accessibility | Keyboard-operable UI and reduced-motion support. |
| NFR-010 | Recovery | User can view/clear local data and reinstall or roll back to the previous signed release. |

## Release blockers

- A trusted code-signing certificate and protected CI signing secret are configured.
- The public release has a privacy policy, license, security reporting address, checksum, SBOM, and vulnerability scan result.
- Electron IPC security and signed-install verification tests pass.
