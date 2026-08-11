import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import { runAgent } from "../../../services/agent/orchestrator.ts";
import { llmService } from "../../../services/llm/index.ts";
import { LlmValidationError } from "../../../services/llm/index.ts";

let sandboxRoot: string;

beforeEach(() => {
  sandboxRoot = mkdtempSync(path.join(os.tmpdir(), "agent-orch-"));
  mkdirSync(path.join(sandboxRoot, "src"));
  writeFileSync(path.join(sandboxRoot, "src", "index.ts"), "export const version = '1.0.0';\n");
});

afterEach(() => {
  mock.restoreAll();
  rmSync(sandboxRoot, { recursive: true, force: true });
});

function fakeUsage(extra: number) {
  return { inputTokens: 20 + extra, outputTokens: 5 + extra, totalTokens: 25 + extra };
}

describe("runAgent", () => {
  it("completes when model answers directly (no tool calls)", async () => {
    mock.method(llmService, "chat", async () => ({
      content: "The sandbox is empty.",
      toolCalls: [],
      usage: fakeUsage(0),
      finishReason: "stop",
    }));

    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "what is in the sandbox?" });

    assert.equal(result.status, "completed");
    assert.equal(result.result, "The sandbox is empty.");
    assert.equal(result.toolCalls, 0);
    assert.equal(result.iterations, 1);
    assert.equal(result.state.status, "completed");
  });

  it("executes a tool call loop and completes", async () => {
    const calls: Array<{ modelId: string; messages: unknown[] }> = [];
    mock.method(llmService, "chat", async (input: any) => {
      calls.push({ modelId: input.modelId, messages: input.messages });
      const hasTool = input.messages.some((m: any) => m.role === "tool");
      if (!hasTool) {
        return {
          content: "",
          toolCalls: [{ id: "call_1", name: "list_dir", arguments: { path: "/" } }],
          usage: fakeUsage(0),
          finishReason: "tool_calls",
        };
      }
      return {
        content: "Found src/ with index.ts.",
        toolCalls: [],
        usage: fakeUsage(1),
        finishReason: "stop",
      };
    });

    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "explore the sandbox" });

    assert.equal(result.status, "completed");
    assert.equal(result.result, "Found src/ with index.ts.");
    assert.equal(result.toolCalls, 1);
    assert.equal(result.iterations, 2);
    // tool 消息回填进历史
    assert.ok(result.state.messages.some((m) => m.role === "tool"));
    assert.equal(result.state.toolHistory.length, 1);
    assert.equal(result.state.toolHistory[0].name, "list_dir");
    assert.equal(result.state.toolHistory[0].ok, true);
    assert.ok(result.state.toolHistory[0].output.includes("src"));
  });

  it("fails when max iterations reached", async () => {
    mock.method(llmService, "chat", async () => ({
      content: "",
      toolCalls: [{ id: "c", name: "list_dir", arguments: { path: "/" } }],
      usage: fakeUsage(0),
    }));

    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "keep looping", maxIterations: 3 });

    assert.equal(result.status, "failed");
    assert.match(result.state.error ?? "", /Max iterations/);
    assert.equal(result.iterations, 3);
    assert.equal(result.toolCalls, 3);
  });

  it("stops with budget_exceeded when token budget exceeded", async () => {
    // 每轮 tool 参数约 1250 token，预算 1000，第 2 轮必然熔断
    mock.method(llmService, "chat", async () => ({
      content: "",
      toolCalls: [{ id: "c", name: "read_file", arguments: { path: "x".repeat(5000) } }],
      usage: fakeUsage(0),
    }));

    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "long", tokenBudget: 1000 });

    assert.equal(result.status, "budget_exceeded");
    assert.match(result.state.error ?? "", /budget/i);
  });

  it("cancels on pre-aborted signal", async () => {
    mock.method(llmService, "chat", async () => ({
      content: "should not matter",
      toolCalls: [],
      usage: fakeUsage(0),
    }));

    const ac = new AbortController();
    ac.abort();
    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "t", signal: ac.signal });

    assert.equal(result.status, "cancelled");
  });

  it("rethrows known LLM errors (auth/validation/unreachable)", async () => {
    mock.method(llmService, "chat", async () => {
      throw new LlmValidationError("Model not found");
    });

    await assert.rejects(() => runAgent({ modelId: "nope", sandboxRoot, task: "t" }), LlmValidationError);
  });

  it("converts unexpected errors into failed state", async () => {
    mock.method(llmService, "chat", async () => {
      throw new Error("upstream exploded");
    });

    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "t" });

    assert.equal(result.status, "failed");
    assert.match(result.state.error ?? "", /upstream exploded/);
  });

  it("denies tools blocked by permission policy", async () => {
    let chatCalls = 0;
    mock.method(llmService, "chat", async () => {
      chatCalls++;
      if (chatCalls === 1) {
        return {
          content: "",
          toolCalls: [{ id: "c1", name: "list_dir", arguments: { path: "/" } }],
          usage: fakeUsage(0),
          finishReason: "tool_calls",
        };
      }
      return { content: "done", toolCalls: [], usage: fakeUsage(1), finishReason: "stop" };
    });

    const result = await runAgent({
      modelId: "m1",
      sandboxRoot,
      task: "explore",
      permission: { tools: { list_dir: "deny" } },
    });

    assert.equal(result.status, "completed");
    assert.equal(result.toolCalls, 1);
    assert.equal(result.state.toolHistory[0].ok, false);
    assert.match(result.state.toolHistory[0].output, /denied/);
    // deny 的工具不会出现在 tool 消息回填之外的真实执行
    assert.equal(result.state.messages.some((m) => m.role === "tool" && /denied/.test(String(m.content))), true);
  });

  it("asks via approval handler and can approve", async () => {
    let chatCalls = 0;
    mock.method(llmService, "chat", async () => {
      chatCalls++;
      if (chatCalls === 1) {
        return {
          content: "",
          toolCalls: [{ id: "c1", name: "write_file", arguments: { path: "out.txt", content: "hi" } }],
          usage: fakeUsage(0),
          finishReason: "tool_calls",
        };
      }
      return { content: "written", toolCalls: [], usage: fakeUsage(1), finishReason: "stop" };
    });

    const approvals: string[] = [];
    const result = await runAgent({
      modelId: "m1",
      sandboxRoot,
      task: "write something",
      approvalHandler: async (request, execute) => {
        approvals.push(request.toolCall.name);
        return execute();
      },
    });

    assert.equal(result.status, "completed");
    assert.deepEqual(approvals, ["write_file"]);
    assert.equal(result.state.toolHistory[0].ok, true);
  });

  it("rejects ask when approval handler declines", async () => {
    mock.method(llmService, "chat", async () => ({
      content: "",
      toolCalls: [{ id: "c1", name: "write_file", arguments: { path: "out.txt", content: "hi" } }],
      usage: fakeUsage(0),
      finishReason: "tool_calls",
    }));

    const result = await runAgent({
      modelId: "m1",
      sandboxRoot,
      task: "write something",
      approvalHandler: async () => ({ ok: false, output: "rejected by user" }),
    });

    assert.equal(result.status, "failed");
    assert.equal(result.state.toolHistory[0].ok, false);
    assert.match(result.state.toolHistory[0].output, /rejected by user/);
  });

  it("defaults ask to a rejection when no approval handler is provided", async () => {
    mock.method(llmService, "chat", async () => ({
      content: "",
      toolCalls: [{ id: "c1", name: "write_file", arguments: { path: "out.txt", content: "hi" } }],
      usage: fakeUsage(0),
      finishReason: "tool_calls",
    }));

    const result = await runAgent({ modelId: "m1", sandboxRoot, task: "write something" });

    assert.equal(result.state.toolHistory[0].ok, false);
    assert.match(result.state.toolHistory[0].output, /approval/);
  });

  it("runs allow-listed write tool directly without approval", async () => {
    let chatCalls = 0;
    mock.method(llmService, "chat", async () => {
      chatCalls++;
      if (chatCalls === 1) {
        return {
          content: "",
          toolCalls: [{ id: "c1", name: "write_file", arguments: { path: "out.txt", content: "hi" } }],
          usage: fakeUsage(0),
          finishReason: "tool_calls",
        };
      }
      return { content: "written", toolCalls: [], usage: fakeUsage(1), finishReason: "stop" };
    });

    const result = await runAgent({
      modelId: "m1",
      sandboxRoot,
      task: "write something",
      permission: { tools: { write_file: "allow" } },
    });

    assert.equal(result.status, "completed");
    assert.equal(result.state.toolHistory[0].ok, true);
  });
});
