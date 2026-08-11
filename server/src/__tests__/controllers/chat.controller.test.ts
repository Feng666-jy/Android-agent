import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

import { chatController, handleNonStream, handleStream, chatCompletionsSchema } from "../../controllers/chat.controller.ts";
import { llmService } from "../../services/llm/index.ts";
import { LlmAuthError, LlmUnreachableError, LlmValidationError } from "../../services/llm/index.ts";
import { createMockRes, createMockReq, createMockNext } from "../helpers.ts";

describe("chatCompletionsSchema", () => {
  it("rejects empty messages", () => {
    const parsed = chatCompletionsSchema.safeParse({ messages: [] });
    assert.equal(parsed.success, false);
  });

  it("rejects unknown role", () => {
    const parsed = chatCompletionsSchema.safeParse({
      messages: [{ role: "robot", content: "hi" }],
    });
    assert.equal(parsed.success, false);
  });

  it("accepts valid request with defaults applied", () => {
    const parsed = chatCompletionsSchema.safeParse({
      modelId: "m1",
      messages: [{ role: "user", content: "hi" }],
      tools: [
        {
          function: {
            name: "read_file",
            description: "Read a file",
            parameters: { type: "object" },
          },
        },
      ],
    });
    assert.equal(parsed.success, true);
    assert.equal(parsed.data?.stream, false);
    assert.equal(parsed.data?.tools?.[0]?.type, "function");
  });
});

describe("chatController.completions", () => {
  beforeEach(() => {
    mock.method(llmService, "chat", async () => ({
      content: "ok",
      toolCalls: [],
      usage: { inputTokens: 5, outputTokens: 3, totalTokens: 8 },
    }));
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it("non-stream: returns success with response data", async () => {
    const { res, json, status } = createMockRes();
    const req = createMockReq(
      { authorization: "Bearer x" },
      {
        modelId: "m1",
        messages: [{ role: "user", content: "hi" }],
      }
    );
    const next = createMockNext();

    await handleNonStream(req.body, res as any, next);

    assert.equal((llmService.chat as any).mock.calls.length, 1);
    assert.equal(status.mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 0);
    assert.equal(body.data.content, "ok");
  });

  it("non-stream: maps LlmAuthError to code 3001", async () => {
    (llmService.chat as any).mock.mockImplementation(async () => {
      throw new LlmAuthError("bad key");
    });
    const { res, json, status } = createMockRes();
    const req = createMockReq(
      {},
      { modelId: "m1", messages: [{ role: "user", content: "hi" }] }
    );
    const next = createMockNext();

    await handleNonStream(req.body, res as any, next);

    assert.equal(status.mock.calls[0].arguments[0], 502);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 3001);
    assert.match(body.message, /bad key/);
  });

  it("non-stream: maps LlmUnreachableError to code 3000", async () => {
    (llmService.chat as any).mock.mockImplementation(async () => {
      throw new LlmUnreachableError("timeout");
    });
    const { res, json, status } = createMockRes();
    const req = createMockReq(
      {},
      { modelId: "m1", messages: [{ role: "user", content: "hi" }] }
    );
    const next = createMockNext();

    await handleNonStream(req.body, res as any, next);

    assert.equal(status.mock.calls[0].arguments[0], 502);
    assert.equal(json.mock.calls[0].arguments[0].code, 3000);
  });

  it("non-stream: maps LlmValidationError to code 1001", async () => {
    (llmService.chat as any).mock.mockImplementation(async () => {
      throw new LlmValidationError("Model not found");
    });
    const { res, json, status } = createMockRes();
    const req = createMockReq(
      {},
      { modelId: "nope", messages: [{ role: "user", content: "hi" }] }
    );
    const next = createMockNext();

    await handleNonStream(req.body, res as any, next);

    assert.equal(status.mock.calls[0].arguments[0], 400);
    assert.equal(json.mock.calls[0].arguments[0].code, 1001);
  });

  it("stream: emits SSE frames and terminates with [DONE]", async () => {
    mock.restoreAll();
    mock.method(llmService, "stream", async function* () {
      yield { type: "content_delta", delta: "hel" };
      yield { type: "content_delta", delta: "lo" };
      yield { type: "done", content: "hello", toolCalls: [], usage: { inputTokens: 1, outputTokens: 2, totalTokens: 3 } };
    });

    const writes: string[] = [];
    let headers: Record<string, string> = {};
    const res = {
      setHeader: (k: string, v: string) => { headers[k] = v; },
      write: (chunk: string) => { writes.push(chunk); },
      end: mock.fn(() => {}),
      flushHeaders: mock.fn(() => {}),
      on: mock.fn(() => {}),
      headersSent: false,
      writableEnded: false,
    };
    const req = {
      on: (_evt: string, _cb: () => void) => {},
      headers: { authorization: "Bearer x" },
      body: {
        modelId: "m1",
        messages: [{ role: "user", content: "hi" }],
        stream: true,
      },
    };

    await new Promise((resolve) => {
      handleStream(req.body, res as any, req as any, createMockNext());
      setImmediate(resolve);
    });

    assert.equal(headers["Content-Type"], "text/event-stream; charset=utf-8");
    assert.ok(writes[0].startsWith("data: "));
    assert.equal(writes[writes.length - 1], "data: [DONE]\n\n");
    assert.ok((res as any).end.mock.calls.length >= 1);
  });
});
