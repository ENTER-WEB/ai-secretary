# Local Codex bridge

Starts a loopback-only service for the AI Secretary UI. It invokes `codex exec` only after the UI sends a manually approved task.

```powershell
npm start
```

The bridge binds to `127.0.0.1:4317`, accepts only the local Next.js development origin, does not read or store Codex credentials, and accepts a structured task string rather than shell arguments. Run it from the intended working directory because Codex uses the bridge process directory as its workspace.
