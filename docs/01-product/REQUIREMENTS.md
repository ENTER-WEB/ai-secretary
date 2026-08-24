# Requirements

## Functional requirements

| ID | Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|---|
| FR-001 | User can upload or select an avatar image. | Must | AC-001 | Planned |
| FR-002 | Avatar blinks while idle and moves its mouth while the assistant is responding. | Must | AC-002 | Planned |
| FR-003 | User can create and continue chat sessions from the left-side history. | Must | AC-003 | Planned |
| FR-004 | User can view conversation and work/task transcript in separate tabs. | Must | AC-004 | Planned |
| FR-005 | User can draft a task for local Codex, inspect it, then explicitly approve or cancel it. | Must | AC-005 | Planned |
| FR-006 | The app never sends Codex credentials or chat contents to a remote service by default. | Must | AC-006 | Planned |

## Business rules

| ID | Rule | Rationale |
|---|---|---|
| BR-001 | A Codex task must not run without a per-task user approval action. | Prevents unintended local actions and cost. |
| BR-002 | Only a loopback-local bridge may invoke Codex in v1. | Keeps credentials and task payload on the user's PC. |
| BR-003 | Avatar files remain in browser-local storage during the prototype. | No implicit external upload. |

## Data lifecycle

| Data | Created by | Storage | Retention | Deletion / export |
|---|---|---|---|---|
| Avatar image | User | Browser object URL / local browser storage | Until browser data is cleared | User clears browser data |
| Chat history | User / app | Browser local storage | Until user clears it | Session deletion / export (follow-up) |
| Task transcript | Local bridge | Browser local storage | Until user clears it | Session deletion / export (follow-up) |
| Codex credentials | Codex client | Codex-managed local credential store | Not accessed by app | Managed only by Codex |

## External integrations

| Integration | Purpose | Authentication | Data boundary | Failure behavior |
|---|---|---|---|---|
| Local Codex CLI | Execute approved work task | Existing local Codex sign-in | Loopback only; no credential reads | Show unavailable/error status and preserve draft |
