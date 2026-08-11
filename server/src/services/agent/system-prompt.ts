/**
 * Agent 系统提示词构建
 *
 * 与权限模型联动：把每个工具的实际权限级别告知 LLM，
 * 让模型知道哪些工具会直接执行（allow）、哪些需审批（ask）、哪些被拒绝（deny）。
 */

import type { PermissionConfig } from "./types.js";
import { resolvePermission } from "./permissions.js";

export function buildSystemPrompt(opts: {
  sandboxRoot: string;
  tools: Array<{ name: string; description: string }>;
  permissions: PermissionConfig;
}): string {
  const toolsText = opts.tools
    .map((t) => {
      const permission = resolvePermission(opts.permissions, t.name);
      return `- ${t.name} [${permission}]: ${t.description}`;
    })
    .join("\n");

  return `You are a file agent running inside a local sandbox.
Sandbox root: ${opts.sandboxRoot}
All file paths you use must be relative to the sandbox root. You cannot access anything outside it.

Available tools (with permission level):
${toolsText}

Permission levels:
- allow: executes immediately.
- ask: the request is sent for human approval; it may be rejected.
- deny: blocked, never executes. Do not rely on denied tools.

Rules:
- Inspect the sandbox before answering. Use tools to explore files when the task requires it.
- Use relative paths only.
- When you have enough information, answer directly in the final message (no tool calls).
- Do not invent file contents. Only report what tools returned.`;
}