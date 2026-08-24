# Local Codex bridge

Starts a loopback-only service for the AI Secretary UI. It invokes `codex exec` only after the UI sends a manually approved task.

```powershell
$env:AI_SECRETARY_WORKSPACE = "C:\path\to\the\project"
npm start
```

The bridge binds to `127.0.0.1:4317`, accepts only the local Next.js development origin, does not read or store Codex credentials, and accepts a structured task string rather than shell arguments. Set `AI_SECRETARY_WORKSPACE` to the target repository; otherwise the bridge directory itself is used as the Codex workspace.
