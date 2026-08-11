/**
 * 命令工具：run_command
 *
 * 安全约束（Phase 3）：
 * - 默认权限 deny（工具不可执行，除非权限策略显式 allow/ask）
 * - cwd 限定沙盒根目录
 * - timeout 超时强杀整棵进程树（Windows 用 taskkill /T /F）
 * - 输出截断（默认 32KB，AGENT_MAX_COMMAND_OUTPUT）
 * - 注意：run_command 无法做 OS 级隔离（shell 可 cd .. 出根），
 *   由权限模型兜底 — 见 permissions.ts 的 deny 默认。
 */

import { spawn } from "node:child_process";

import type { AgentTool, ToolContext, ToolResult } from "../types.js";
import { ensureSandboxRoot } from "../sandbox.js";

export const commandTimeoutMs = (): number => {
  const v = Number(process.env.AGENT_COMMAND_TIMEOUT_MS);
  return Number.isFinite(v) && v > 0 ? Math.min(v, MAX_COMMAND_TIMEOUT_MS) : DEFAULT_COMMAND_TIMEOUT_MS;
};

export const maxCommandOutputBytes = (): number => {
  const v = Number(process.env.AGENT_MAX_COMMAND_OUTPUT);
  return Number.isFinite(v) && v > 0 ? v : DEFAULT_MAX_COMMAND_OUTPUT;
};

const DEFAULT_COMMAND_TIMEOUT_MS = 15_000;
const MAX_COMMAND_TIMEOUT_MS = 60_000;
const DEFAULT_MAX_COMMAND_OUTPUT = 32 * 1024;

interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
  timedOut: boolean;
  signal?: string;
}

/** 捕获退出码而非抛错：非零退出是工具的合法结果 */
function runShell(command: string, opts: { cwd: string; timeout: number; maxBuffer: number }): Promise<ExecResult> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      cwd: opts.cwd,
      shell: true,
      windowsHide: true,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const killTree = () => {
      if (child.pid === undefined) return;
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true });
      } else {
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch {
          try {
            child.kill("SIGKILL");
          } catch {
            // 已退出
          }
        }
      }
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      killTree();
      resolve({ stdout, stderr, code: 1, timedOut: true });
    }, opts.timeout);

    child.stdout.on("data", (d: Buffer) => {
      if (Buffer.byteLength(stdout, "utf8") < opts.maxBuffer) {
        stdout = (stdout + d.toString("utf8")).slice(0, opts.maxBuffer);
      }
    });
    child.stderr.on("data", (d: Buffer) => {
      if (Buffer.byteLength(stderr, "utf8") < opts.maxBuffer) {
        stderr = (stderr + d.toString("utf8")).slice(0, opts.maxBuffer);
      }
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      stderr = (stderr + `\n${err.message}`).trim();
      resolve({ stdout, stderr, code: 1, timedOut: false });
    });
    child.on("close", (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, code: code ?? 1, timedOut: false, signal: signal ?? undefined });
    });
  });
}

function truncateOutput(combined: string, limit: number): string {
  if (Buffer.byteLength(combined, "utf8") <= limit) return combined;
  const cut = Buffer.from(combined, "utf8").subarray(0, limit).toString("utf8");
  return `${cut}\n...[output truncated at ${limit} bytes]`;
}

export const runCommandTool: AgentTool = {
  name: "run_command",
  description:
    "Run a shell command inside the sandbox (working directory = sandbox root). Output is truncated. Denied by default — must be explicitly enabled.",
  parameters: {
    type: "object",
    properties: {
      command: { type: "string", description: "Shell command to run." },
      timeoutMs: { type: "integer", description: "Optional timeout override (ms, capped at 60000)." },
    },
    required: ["command"],
  },
  async execute(args, ctx: ToolContext): Promise<ToolResult> {
    try {
      const command = args.command;
      if (typeof command !== "string" || !command.trim()) {
        return { ok: false, output: "command is required" };
      }
      const timeout = Math.min(
        typeof args.timeoutMs === "number" && Number.isFinite(args.timeoutMs) && args.timeoutMs > 0
          ? args.timeoutMs
          : commandTimeoutMs(),
        MAX_COMMAND_TIMEOUT_MS
      );
      const maxOutput = maxCommandOutputBytes();

      await ensureSandboxRoot(ctx.sandboxRoot);
      const result = await runShell(command, {
        cwd: ctx.sandboxRoot,
        timeout,
        maxBuffer: maxOutput,
      });

      const stdout = truncateOutput(result.stdout, Math.max(1, maxOutput - 64));
      const combined = stdout + (result.stderr ? `\n[stderr]\n${truncateOutput(result.stderr, 2048)}` : "");

      if (result.timedOut) {
        return { ok: false, output: `Command timed out after ${timeout}ms and was killed.\n${combined}` };
      }
      const head = `exit code: ${result.code}`;
      return {
        ok: true,
        output: combined ? `${head}\n${combined}` : head,
      };
    } catch (err) {
      return { ok: false, output: (err as Error)?.message ?? String(err) };
    }
  },
};