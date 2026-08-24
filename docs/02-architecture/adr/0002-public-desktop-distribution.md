# ADR-0002: Public desktop distribution uses Electron IPC

- Status: Accepted
- Date: 2026-08-24

## Decision

The downloadable Windows application packages the UI inside Electron. The packaged renderer has no Node access and communicates with the main process via a narrow, validated preload API. The main process, not a localhost HTTP service, submits user-approved tasks to Codex.

## Security consequences

- The release build disables the developer localhost bridge.
- Renderer messages are untrusted; main-process IPC validates a versioned payload and does not accept command-line arguments.
- `shell: false`, `contextIsolation: true`, `sandbox: true`, and `nodeIntegration: false` are mandatory.
- Public release is blocked until a code-signing certificate and protected CI signing setup exist.

## Alternative rejected

Exposing a permanent localhost bridge to a browser UI. It expands the attack surface and cannot provide the Electron process boundary required for a consumer downloadable app.
