# Runbook

## Public release procedure

1. Run lint, unit tests, production UI build, Electron package build, dependency audit, and repository validation.
2. Generate an SBOM and release checksums.
3. Build the Windows installer in protected CI with the code-signing certificate supplied only as a CI secret.
4. Verify the installer signature on a clean Windows VM.
5. Publish installer, checksum, SBOM, release notes, privacy policy, license, and security-contact information together.

## Incident response

- Suspected malicious release: revoke the update/release asset, publish a signed fixed version, and post an advisory.
- Secret exposure: revoke the certificate/credential, rotate CI secrets, investigate release provenance, and rebuild.
- Codex safety issue: disable the affected IPC command in an emergency update; never silently execute queued work.

## Rollback

Keep the previous signed installer available. Do not roll back by replacing a release binary in place; publish a new signed release or explicitly direct users to the known-good prior installer.
