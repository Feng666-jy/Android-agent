import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import { runCommandTool } from "../../../services/agent/tools/command-tool.ts";
import type { ToolContext } from "../../../services/agent/types.ts";

let root: string;
let ctx: ToolContext;

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "agent-cmd-"));
  writeFileSync(path.join(root, "hello.txt"), "hello\n");
  ctx = { sandboxRoot: root };
});

afterEach(async () => {
  // Windows 上被杀的子进程可能短暂占用目录句柄 → 重试删除
  for (let i = 0; i < 10; i++) {
    try {
      rmSync(root, { recursive: true, force: true });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  rmSync(root, { recursive: true, force: true });
});

describe("run_command", () => {
  it("runs a command in the sandbox root", async () => {
    const r = await runCommandTool.execute({ command: 'node -e "console.log(process.cwd())"' }, ctx);
    assert.equal(r.ok, true);
    assert.ok(r.output.includes(root));
  });

  it("reports non-zero exit code", async () => {
    const r = await runCommandTool.execute({ command: 'node -e "process.exit(3)"' }, ctx);
    assert.equal(r.ok, true);
    assert.match(r.output, /exit code: 3/);
  });

  it("captures stderr", async () => {
    const r = await runCommandTool.execute({ command: 'node -e "console.error(\'boom\')"' }, ctx);
    assert.equal(r.ok, true);
    assert.ok(r.output.includes("boom"));
  });

  it("requires command", async () => {
    const r = await runCommandTool.execute({}, ctx);
    assert.equal(r.ok, false);
    assert.match(r.output, /command is required/);
  });

  it("kills on timeout", async () => {
    const prev = process.env.AGENT_COMMAND_TIMEOUT_MS;
    process.env.AGENT_COMMAND_TIMEOUT_MS = "300";
    try {
      // 平台内置阻塞命令：被杀时是同一进程树，不留占用目录的孙进程
      const blocker = process.platform === "win32" ? "ping -n 10 127.0.0.1 >nul" : "sleep 10";
      const r = await runCommandTool.execute({ command: blocker }, ctx);
      assert.equal(r.ok, false);
      assert.match(r.output, /timed out/i);
    } finally {
      if (prev === undefined) delete process.env.AGENT_COMMAND_TIMEOUT_MS;
      else process.env.AGENT_COMMAND_TIMEOUT_MS = prev;
    }
  });

  it("truncates large output", async () => {
    const prev = process.env.AGENT_MAX_COMMAND_OUTPUT;
    process.env.AGENT_MAX_COMMAND_OUTPUT = "200";
    try {
      const r = await runCommandTool.execute({ command: 'node -e "console.log(\'x\'.repeat(2000))"' }, ctx);
      assert.equal(r.ok, true);
      assert.match(r.output, /truncated/);
      assert.ok(Buffer.byteLength(r.output, "utf8") < 2000);
    } finally {
      if (prev === undefined) delete process.env.AGENT_MAX_COMMAND_OUTPUT;
      else process.env.AGENT_MAX_COMMAND_OUTPUT = prev;
    }
  });
});