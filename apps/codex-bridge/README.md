# Local Codex bridge

Starts a loopback-only service for the AI Secretary UI. It invokes `codex exec` only after the UI sends a manually approved task.

```powershell
$env:AI_SECRETARY_WORKSPACE = "C:\path\to\the\project"
npm start
```

The bridge binds to `127.0.0.1:4317`, accepts only the local Next.js development origin, does not read or store Codex credentials, and accepts a structured task string rather than shell arguments. Set `AI_SECRETARY_WORKSPACE` to the target repository; otherwise the bridge directory itself is used as the Codex workspace.

## Optional original greeting

Typing `/greeting` in the secretary chat is an explicit request to create one fresh greeting with the locally signed-in Codex account. The bridge runs the fixed prompt in an ephemeral, read-only sandbox; it does not send chat history, access files, or run automatically. This development-only endpoint is not exposed by the packaged public desktop app.
