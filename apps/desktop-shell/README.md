# AI Secretary desktop shell

The release-only Electron wrapper. It exposes a deliberately small preload API and owns Codex process execution. It does not start the development HTTP bridge.

For development, start the Next.js UI and then run:

```powershell
$env:AI_SECRETARY_DEV_URL = "http://localhost:3000"
npm run dev
```

For public release, build `apps/ui` as a static export first, then run `npm run dist:win` in a protected CI runner with code-signing credentials. Do not publish an unsigned installer as the production channel.
