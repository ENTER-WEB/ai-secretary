const { app, BrowserWindow, dialog, ipcMain, shell, session } = require("electron");
const { existsSync, realpathSync, statSync } = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");

let workspace = null;
const jobs = new Map();

function validateTask(value) {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 8000) throw new Error("Task must be 1-8000 characters.");
  return value.trim();
}

function validateWorkspace(candidate) {
  if (!candidate || !existsSync(candidate) || !statSync(candidate).isDirectory()) throw new Error("Choose an existing workspace folder.");
  return realpathSync(candidate);
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280, minWidth: 860, height: 860, minHeight: 640,
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, webSecurity: true, preload: path.join(__dirname, "preload.cjs") },
  });
  const devUrl = process.env.AI_SECRETARY_DEV_URL;
  if (devUrl) window.loadURL(devUrl); else window.loadFile(path.join(process.resourcesPath, "ui", "index.html"));
  window.webContents.setWindowOpenHandler(({ url }) => { if (url.startsWith("https://")) shell.openExternal(url); return { action: "deny" }; });
  window.webContents.on("will-navigate", (event) => event.preventDefault());
}

app.whenReady().then(() => {
  const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'; form-action 'none'";
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => callback({ responseHeaders: { ...details.responseHeaders, "Content-Security-Policy": [csp] } }));
  ipcMain.handle("secretary:get-workspace", () => workspace);
  ipcMain.handle("secretary:get-job", (_event, jobId) => {
    if (typeof jobId !== "string") throw new Error("Invalid job id.");
    const job = jobs.get(jobId);
    if (!job) throw new Error("Unknown job.");
    return { id: job.id, status: job.status, output: job.output, workspace: job.workspace, exitCode: job.exitCode ?? null };
  });
  ipcMain.handle("secretary:select-workspace", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
    if (!result.canceled && result.filePaths[0]) workspace = validateWorkspace(result.filePaths[0]);
    return workspace;
  });
  ipcMain.handle("secretary:run-task", (_event, payload) => {
    if (!payload || payload.confirmed !== true) throw new Error("Explicit user approval is required.");
    const task = validateTask(payload.task);
    const cwd = validateWorkspace(workspace);
    const job = { id: randomUUID(), status: "running", output: "", workspace: cwd };
    jobs.set(job.id, job);
    const child = spawn("codex", ["exec", "--json", "--sandbox", "workspace-write", task], { cwd, shell: false, windowsHide: true });
    child.stdout.on("data", (data) => { job.output = (job.output + data).slice(-50000); });
    child.stderr.on("data", (data) => { job.output = (job.output + data).slice(-50000); });
    child.on("error", (error) => { job.status = "failed"; job.output += `\n${error.message}`; });
    child.on("close", (code) => { job.status = code === 0 ? "completed" : "failed"; job.exitCode = code; });
    return { id: job.id, status: job.status, workspace: cwd };
  });
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
