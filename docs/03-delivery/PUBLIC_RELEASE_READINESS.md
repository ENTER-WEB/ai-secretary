# Public Release Readiness

The codebase is prepared for a public Windows release but is intentionally not publishable until all items below are complete.

## Required owner actions

1. Public distribution-only GitHub repository created: `r-sakurai-vaizo/ai-secretary-releases`.
2. Buy and validate an organization-verified Windows code-signing certificate.
3. Configure protected GitHub Actions secrets:
   - `WINDOWS_CERTIFICATE_BASE64`
   - `WINDOWS_CERTIFICATE_PASSWORD`
   - `PUBLIC_RELEASE_REPOSITORY_TOKEN` (limited to distribution repository releases only)
4. Choose and publish the end-user license, privacy policy, support contact, and security-reporting email.
5. Add a clean-Windows-VM installer test to the release approval record.

## Publication package

- Signed `.exe` installer
- A branded `.ico` application icon
- SHA-256 checksum file
- CycloneDX SBOMs
- Release notes with supported Windows version and known limitations
- Privacy policy, license, and security contact

## Explicitly prohibited

- Publishing an unsigned installer as the stable channel
- Placing a Codex credential, private source-repository token, or code-signing private key in the installer or source repository
- Enabling automatic Codex task execution for downloaded clients
