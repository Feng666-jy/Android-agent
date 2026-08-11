import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

import { agentController, agentRunSchema } from "../../controllers/agent.controller.ts";
import { llmService } from "../../services/llm/index.ts";
import { LlmAuthError } from "../../services/llm/index.ts";
import { createMockRes, createMockReq, createMockNext } from "../helpers.ts";

describe("agentRunSchema", () => {
  it("rejects empty task", () => {
    const parsed = agentRunSchema.safeParse({ modelId: "m1", task: "" });
    assert.equal(parsed.success, false);
  });

  it("rejects missing modelId", () => {
    const parsed = agentRunSchema.safeParse({ task: "do something" });
    assert.equal(parsed.success, false);
  });

  it("accepts valid body", () => {
    const parsed = agentRunSchema.safeParse({
      modelId: "m1",
      task: "explore",
      maxIterations: 5,
      tokenBudget: 5000,
    });
    assert.equal(parsed.success, true);
  });

  it("rejects out-of-range maxIterations", () => {
    const parsed = agentRunSchema.safeParse({ modelId: "m1", task: "x", maxIterations: 999 });
    assert.equal(parsed.success, false);
  });
});

describe("agentController.run", () => {
  beforeEach(async () => {
    mock.method(llmService, "chat", async () => ({
      content: "Agent report done.",
      toolCalls: [],
      usage: { inputTokens: 5, outputTokens: 3, totalTokens: 8 },
      finishReason: "stop",
    }));
    // 避免写入真实 DB
    const { agentSessionService } = await import("../../services/agent/agent-session.service.ts");
    mock.method(agentSessionService, "saveRun", async () => ({ id: "run-1", status: "completed" }));
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it("returns success with agent result", async () => {
    const { res, json, status } = createMockRes();
    const req = createMockReq(
      { authorization: "Bearer x" },
      { modelId: "m1", task: "explore the sandbox" }
    );
    const next = createMockNext();

    await agentController.run(req as any, res as any, next);

    assert.equal((llmService.chat as any).mock.calls.length, 1);
    assert.equal(status.mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 0);
    assert.equal(body.data.status, "completed");
    assert.equal(body.data.result, "Agent report done.");
    assert.ok(body.data.state.toolHistory);
  });

  it("maps LlmAuthError to 3001/502", async () => {
    (llmService.chat as any).mock.mockImplementation(async () => {
      throw new LlmAuthError("bad key");
    });
    const { res, json, status } = createMockRes();
    const req = createMockReq({ authorization: "Bearer x" }, { modelId: "m1", task: "t" });
    const next = createMockNext();

    await agentController.run(req as any, res as any, next);

    assert.equal(status.mock.calls[0].arguments[0], 502);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 3001);
  });
});
