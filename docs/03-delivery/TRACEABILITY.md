# Traceability

| Requirement | Design | Implementation | Test evidence | Operations |
|---|---|---|---|---|
| FR-001 / FR-002 | UI avatar component | `apps/ui/src/app/page.tsx` | UI E2E | Local data controls |
| FR-003 / FR-004 | Chat state model | `apps/ui/src/app/page.tsx` | UI E2E | Local data controls |
| FR-005 / FR-006 | ADR-0001, ADR-0002 | `apps/desktop-shell/*` | IPC contract tests | Signed desktop release |
| NFR-002 / NFR-004 | Desktop security model | `main.cjs`, `preload.cjs` | Electron security test | Release gate |
| NFR-006 / NFR-007 | Release pipeline | `.github/workflows/release.yml` | CI attestation | Public release procedure |
