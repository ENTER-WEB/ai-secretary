import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

const PORT = 4317;
const MAX_TASK_CHARS = 8000;
const allowedOrigins = new Set(["http://localhost:3000", "http://127.0.0.1:3000"]);
const jobs = new Map();
const workspace = process.env.AI_SECRETARY_WORKSPACE || process.cwd();

function reply(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function applyCors(request, response) {
  const origin = request.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) return false;
  response.setHeader("access-control-allow-origin", origin);
  response.setHeader("vary", "Origin");
  response.setHeader("access-control-allow-headers", "content-type, x-ai-secretary-approval");
  response.setHeader("access-control-allow-methods", "POST, GET, OPTIONS");
  return true;
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => { raw += chunk; if (raw.length > MAX_TASK_CHARS + 200) request.destroy(); });
    request.on("end", () => { try { resolve(JSON.parse(raw)); } catch { reject(new Error("Invalid JSON")); } });
    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  if (!applyCors(request, response)) return reply(response, 403, { error: "Local AI Secretary origin required." });
  if (request.method === "OPTIONS") return response.end();
  if (request.method === "GET" && request.url?.startsWith("/jobs/")) {
    const job = jobs.get(request.url.split("/").pop());
    return job ? reply(response, 200, job) : reply(response, 404, { error: "Unknown job" });
  }
  if (request.method !== "POST" || request.url !== "/tasks") return reply(response, 404, { error: "Not found" });
  if (request.headers["x-ai-secretary-approval"] !== "confirmed") return reply(response, 403, { error: "Explicit approval is required." });
  try {
    const { task } = await readJson(request);
    if (typeof task !== "string" || !task.trim() || task.length > MAX_TASK_CHARS) return reply(response, 400, { error: "Task must be 1-8000 characters." });
    const job = { id: randomUUID(), status: "running", task, output: "", startedAt: new Date().toISOString() };
    jobs.set(job.id, job);
    const child = spawn("codex", ["exec", "--json", "--sandbox", "workspace-write", task], { cwd: workspace, shell: false, windowsHide: true });
    child.stdout.on("data", (chunk) => { job.output = (job.output + chunk).slice(-50000); });
    child.stderr.on("data", (chunk) => { job.output = (job.output + chunk).slice(-50000); });
    child.on("error", (error) => { job.status = "failed"; job.output += `\n${error.message}`; job.finishedAt = new Date().toISOString(); });
    child.on("close", (code) => { job.status = code === 0 ? "completed" : "failed"; job.exitCode = code; job.finishedAt = new Date().toISOString(); });
    return reply(response, 202, { id: job.id, status: job.status });
  } catch (error) { return reply(response, 400, { error: error.message }); }
});

server.listen(PORT, "127.0.0.1", () => console.log(`AI Secretary Codex bridge: http://127.0.0.1:${PORT} (workspace: ${workspace})`));
