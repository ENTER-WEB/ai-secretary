# Assumptions

| ID | Assumption | Status | Impact if false | Owner |
|---|---|---|---|---|
| ASM-001 | The primary user runs the app on Windows and has a working local Codex CLI sign-in. | To verify | Codex bridge stays unavailable; UI remains usable. | User |
| ASM-002 | v1 is a single-user local application. | Accepted for v1 | Authentication and shared history are needed before sharing it. | Product owner |
| ASM-003 | Avatar images are supplied by the user or are licensed for use. | Accepted | Unlicensed images must not be bundled or uploaded. | User |
| ASM-004 | The user accepts explicit approval for each Codex task. | Accepted | Autonomous execution needs a separate risk review. | Product owner |
