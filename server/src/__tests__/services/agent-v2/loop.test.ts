import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { applyMigrations } from "../../../db/migrate.ts";
import { AgentLoop } from "../../../services/agent-v2/loop.ts";
import { agentEventBus } from "../../../services/agent-v2/events.ts";
import { ToolRegistry } from "../../../services/agent/tool-registry.ts";
import { llmService } from "../../../services/llm/index.ts";
import { closeDatabase, prisma } from "../../../prisma.ts";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "prisma/migrations");
let tempRoot: string;
let userId: number;

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), "agent-v2-loop-"));
  process.env.DATABASE_URL = `file:${path.join(tempRoot, "test.db")}`;
  const db = new DatabaseSync(path.join(tempRoot, "test.db"));
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR });
  db.close();
  const user = await prisma.user.create({
    data: { username: `loop${Date.now()}`, password: "x", email: `loop${Date.now()}@t.com` },
  });
  userId = user.id;
});

afterEach(() => {
  mock.restoreAll();
  closeDatabase();
  rmSync(tempRoot, { recursive: true, force: true });
});

function fakeUsage(extra = 0) {
  return { inputTokens: 10 + extra, outputTokens: 5 + extra, totalTokens: 15 + extra };
}

function planJson() {
  return JSON.stringify({ goal: "g", steps: [{ title: "s1", description: "d1" }] });
}

function toolCall(name: string, args: Record<string, unknown> = {}) {
  return { id: `call_${name}_${Date.now()}`, name, arguments: args };
}

async function waitFor(fn: () => boolean, timeoutMs = 5000): Promise<void> {
  const start = Date.now();
  while (!fn()) {
    if (Date.now() - start > timeoutMs) throw new Error("waitFor timeout");
    await new Promise((r) => setTimeout(r, 20));
  }
}

/** 默认 chat mock：第 1 次给计划，之后按需给工具/最终回答 */
function mockChat(loopBehavior: (messages: any[]) => any) {
  let call = 0;
  mock.method(llmService, "chat", async (input: any) => {
    call++;
    if (call === 1) {
      return { content: planJson(), toolCalls: [], usage: fakeUsage(0), finishReason: "stop" };
    }
    return loopBehavior(input.messages, call);
  });
}

test("直接回答 → completed，且计划/消息/状态落库", async () => {
  mockChat(() => ({ content: "直接完成", toolCalls: [], usage: fakeUsage(1), finishReason: "stop" }));

  const loop = new AgentLoop({ userId, modelId: "m1", task: "小任务" });
  void loop.start();
  await waitFor(() => loop.run.status === "completed");

  assert.equal(loop.run.status, "completed");
  assert.equal(loop.run.iterations, 1);
  assert.ok(loop.run.plan, "plan 已生成");
  assert.equal(loop.run.plan?.steps.length, 1);
  assert.ok(loop.run.messages.some((m) => m.role === "assistant" && m.content === "直接完成"));

  // 落库验证
  const row = await prisma.agentRun.findUnique({ where: { id: loop.run.id } });
  assert.equal(row?.status, "completed");
  assert.equal(row?.userId, userId);
  assert.ok(row?.planJson?.includes('"goal"'));
  const steps = await prisma.agentStep.findMany({ where: { runId: loop.run.id } });
  assert.ok(steps.length >= 1, "步骤已落库");
});

test("工具循环：工具调用 → 观察 → 最终回答", async () => {
  mockChat((messages: any[]) => {
    const hasTool = messages.some((m: any) => m.role === "tool");
    if (!hasTool) {
      return { content: "", toolCalls: [toolCall("list_dir", { path: "/" })], usage: fakeUsage(1), finishReason: "tool_calls" };
    }
    return { content: "浏览完成", toolCalls: [], usage: fakeUsage(2), finishReason: "stop" };
  });

  const loop = new AgentLoop({ userId, modelId: "m1", task: "浏览" });
  void loop.start();
  await waitFor(() => loop.run.status === "completed");

  assert.equal(loop.run.status, "completed");
  assert.equal(loop.run.toolCalls, 1);
  assert.ok(loop.run.messages.some((m) => m.role === "tool"), "tool 结果回填");
  const completedEvents = agentEventBus.history(loop.run.id).filter((e) => e.type === "run.completed");
  assert.equal(completedEvents.length, 1);
});

test("达到 maxIterations → failed", async () => {
  mockChat(() => ({
    content: "",
    toolCalls: [toolCall("list_dir", { path: "/" })],
    usage: fakeUsage(0),
    finishReason: "tool_calls",
  }));

  const loop = new AgentLoop({ userId, modelId: "m1", task: "死循环", maxIterations: 3 });
  void loop.start();
  await waitFor(() => loop.run.status === "failed");

  assert.equal(loop.run.status, "failed");
  assert.match(loop.run.error ?? "", /Max iterations/);
  assert.equal(loop.run.iterations, 3);
  assert.equal(loop.run.toolCalls, 3);
});

test("取消：工具执行挂起时 cancel → cancelled", async () => {
  const gate: Array<() => void> = [];
  const registry = new ToolRegistry();
  registry.register({
    name: "gate_tool",
    description: "gate",
    parameters: {},
    execute: () => new Promise((resolve) => gate.push(() => resolve({ ok: true, output: "gated" }))),
  });

  mockChat((messages: any[]) => {
    const hasTool = messages.some((m: any) => m.role === "tool");
    if (!hasTool) {
      return { content: "", toolCalls: [toolCall("gate_tool")], usage: fakeUsage(0), finishReason: "tool_calls" };
    }
    return { content: "完成", toolCalls: [], usage: fakeUsage(1), finishReason: "stop" };
  });

  const loop = new AgentLoop({ userId, modelId: "m1", task: "t", deps: { toolRegistry: registry } });
  void loop.start();

  await waitFor(() => gate.length === 1);
  loop.controller.cancel();
  gate[0]();
  await waitFor(() => loop.run.status === "cancelled");

  assert.equal(loop.run.status, "cancelled");
  const cancelledEvents = agentEventBus.history(loop.run.id).filter((e) => e.type === "run.cancelled");
  assert.equal(cancelledEvents.length, 1);
});

test("暂停/恢复：挂起期间不前进，恢复后完成", async () => {
  const gate: Array<() => void> = [];
  const registry = new ToolRegistry();
  registry.register({
    name: "gate_tool",
    description: "gate",
    parameters: {},
    execute: () => new Promise((resolve) => gate.push(() => resolve({ ok: true, output: "gated" }))),
  });

  mockChat((messages: any[]) => {
    const hasTool = messages.some((m: any) => m.role === "tool");
    if (!hasTool) {
      return { content: "", toolCalls: [toolCall("gate_tool")], usage: fakeUsage(0), finishReason: "tool_calls" };
    }
    return { content: "完成", toolCalls: [], usage: fakeUsage(1), finishReason: "stop" };
  });

  const loop = new AgentLoop({ userId, modelId: "m1", task: "t", deps: { toolRegistry: registry } });
  void loop.start();

  await waitFor(() => gate.length === 1);
  loop.controller.pause();
  gate[0]();
  await new Promise((r) => setTimeout(r, 150));
  assert.notEqual(loop.run.status, "completed", "暂停期间不应完成");

  loop.controller.resume();
  await waitFor(() => loop.run.status === "completed");
  assert.equal(loop.run.status, "completed");
});

test("token 预算超限 → budget_exceeded", async () => {
  mockChat(() => ({
    content: "",
    toolCalls: [toolCall("read_file", { path: "x".repeat(4000) })],
    usage: { inputTokens: 100, outputTokens: 100, totalTokens: 200 },
    finishReason: "tool_calls",
  }));

  const loop = new AgentLoop({ userId, modelId: "m1", task: "t", tokenBudget: 500 });
  void loop.start();
  await waitFor(() => loop.run.status === "budget_exceeded");

  assert.equal(loop.run.status, "budget_exceeded");
  assert.match(loop.run.error ?? "", /budget/i);
});


