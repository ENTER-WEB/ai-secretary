# ADR-0001: Local Codex bridge

- Status: Accepted
- Date: 2026-08-24

## Decision

Use a separately started, loopback-only Node service to submit an explicitly approved task to the already signed-in local Codex CLI. The browser UI never receives, reads, or forwards Codex credentials.

## Consequences

- The user starts the bridge in the desired repository/workspace before approving work.
- Browser-origin checks and a confirmation header reduce cross-site requests, but do not protect against malware on the same PC.
- Task strings are limited and passed as one argument to `codex exec`; the bridge has no arbitrary command field.
- v1 does not provide background scheduling, retry automation, or multi-user access.
