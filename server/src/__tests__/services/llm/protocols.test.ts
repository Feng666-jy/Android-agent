import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { OpenAIHandler } from "../../../services/llm/protocols/openai.ts";
import { AnthropicHandler } from "../../../services/llm/protocols/anthropic.ts";
import { GeminiHandler } from "../../../services/llm/protocols/gemini.ts";
import { OllamaHandler } from "../../../services/llm/protocols/ollama.ts";
import { estimateTokens } from "../../../services/llm/base.ts";
import type { ChatRequest, ProviderConfig } from "../../../services/llm/types.ts";

const CONFIG: ProviderConfig = {
  providerId: "p1",
  baseUrl: "https://api.example.com/v1",
  protocol: "OPENAI_COMPATIBLE",
  apiKey: "sk-test",
};

const REQ: ChatRequest = {
  model: "test-model",
  messages: [
    { role: "system", content: "be terse" },
    { role: "user", content: "hello" },
  ],
  temperature: 0.5,
  maxOutputTokens: 128,
  tools: [
    {
      type: "function",
      function: {
        name: "read_file",
        description: "Read a file",
        parameters: { type: "object", properties: { path: { type: "string" } } },
      },
    },
  ],
};

describe("LLM protocol handlers �?request building", () => {
  it("openai: builds correct URL, headers, body", () => {
    const h = new OpenAIHandler();
    assert.equal(h.buildUrl(CONFIG, "m"), "https://api.example.com/v1/chat/completions");
    assert.deepEqual(h.buildHeaders(CONFIG), {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-test",
    });
    const body = h.buildBody(REQ);
    assert.equal(body.model, "test-model");
    assert.equal(body.stream, false);
    assert.equal(body.temperature, 0.5);
    assert.equal(body.max_tokens, 128);
    assert.equal(body.tool_choice, "auto");
    const msg = (body.messages as any[])[1];
    assert.deepEqual(msg, { role: "user", content: "hello" });
  });

  it("openai: wire assistant tool_calls + tool result messages", () => {
    const h = new OpenAIHandler();
    const body = h.buildBody({
      model: "m",
      messages: [
        {
          role: "assistant",
          content: null,
          toolCalls: [{ id: "call_1", name: "read_file", arguments: { path: "a.txt" } }],
        },
        { role: "tool", toolCallId: "call_1", content: '{"ok":true}' },
      ],
    });
    const msgs = body.messages as any[];
    assert.deepEqual(msgs[0].tool_calls[0], {
      id: "call_1",
      type: "function",
      function: { name: "read_file", arguments: '{"path":"a.txt"}' },
    });
    assert.deepEqual(msgs[1], { role: "tool", content: '{"ok":true}', tool_call_id: "call_1" });
  });

  it("anthropic: system lifted to top-level, tool result as user block", () => {
    const h = new AnthropicHandler();
    assert.equal(h.buildUrl(CONFIG, "m"), "https://api.example.com/v1/messages");
    const headers = h.buildHeaders(CONFIG);
    assert.equal(headers["x-api-key"], "sk-test");
    assert.equal(headers["anthropic-version"], "2023-06-01");
    const body = h.buildBody({
      model: "m",
      messages: [
        { role: "system", content: "be terse" },
        {
          role: "assistant",
          content: null,
          toolCalls: [{ id: "toolu_1", name: "read_file", arguments: { path: "a.txt" } }],
        },
        { role: "tool", toolCallId: "toolu_1", content: '{"ok":true}' },
      ],
      tools: REQ.tools,
    });
    assert.equal(body.system, "be terse");
    const msgs = body.messages as any[];
    assert.equal(msgs[0].role, "assistant");
    assert.deepEqual(msgs[0].content, [
      { type: "tool_use", id: "toolu_1", name: "read_file", input: { path: "a.txt" } },
    ]);
    assert.equal(msgs[1].role, "user");
    assert.deepEqual(msgs[1].content, [
      { type: "tool_result", tool_use_id: "toolu_1", content: '{"ok":true}' },
    ]);
    assert.deepEqual(body.tools, [
      {
        name: "read_file",
        description: "Read a file",
        input_schema: { type: "object", properties: { path: { type: "string" } } },
      },
    ]);
  });

  it("gemini: roles user/model, systemInstruction, functionDeclarations", () => {
    const h = new GeminiHandler();
    assert.equal(
      h.buildUrl(CONFIG, "gemini-pro"),
      "https://api.example.com/v1/models/gemini-pro:generateContent"
    );
    const headers = h.buildHeaders(CONFIG);
    assert.equal(headers["x-goog-api-key"], "sk-test");
    const body = h.buildBody(REQ);
    assert.equal(body.systemInstruction.parts[0].text, "be terse");
    const contents = body.contents as any[];
    assert.equal(contents[0].role, "user");
    assert.deepEqual(contents[0].parts, [{ text: "hello" }]);
    assert.deepEqual(body.tools, [
      {
        functionDeclarations: [
          {
            name: "read_file",
            description: "Read a file",
            parameters: { type: "object", properties: { path: { type: "string" } } },
          },
        ],
      },
    ]);
  });

  it("ollama: NDJSON endpoint, options mapping", () => {
    const h = new OllamaHandler();
    assert.equal(h.buildUrl(CONFIG, "m"), "https://api.example.com/v1/api/chat");
    const body = h.buildBody(REQ);
    assert.equal(body.model, "test-model");
    assert.deepEqual(body.options, { temperature: 0.5, num_predict: 128 });
  });
});

describe("LLM protocol handlers �?response parsing", () => {
  it("openai: parses content, tool_calls, usage", () => {
    const h = new OpenAIHandler();
    const r = h.parseResponse({
      choices: [
        {
          message: {
            content: "hi",
            tool_calls: [
              { id: "c1", type: "function", function: { name: "read_file", arguments: '{"path":"a"}' } },
            ],
          },
          finish_reason: "tool_calls",
        },
      ],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    });
    assert.equal(r.content, "hi");
    assert.deepEqual(r.toolCalls, [{ id: "c1", name: "read_file", arguments: { path: "a" } }]);
    assert.deepEqual(r.usage, { inputTokens: 10, outputTokens: 5, totalTokens: 15 });
    assert.equal(r.finishReason, "tool_calls");
  });

  it("anthropic: parses text + tool_use blocks", () => {
    const h = new AnthropicHandler();
    const r = h.parseResponse({
      content: [
        { type: "text", text: "ok" },
        { type: "tool_use", id: "toolu_1", name: "read_file", input: { path: "a" } },
      ],
      usage: { input_tokens: 8, output_tokens: 4 },
      stop_reason: "tool_use",
    });
    assert.equal(r.content, "ok");
    assert.deepEqual(r.toolCalls, [{ id: "toolu_1", name: "read_file", arguments: { path: "a" } }]);
    assert.deepEqual(r.usage, { inputTokens: 8, outputTokens: 4, totalTokens: 12 });
  });

  it("gemini: parses text + functionCall parts", () => {
    const h = new GeminiHandler();
    const r = h.parseResponse({
      candidates: [
        {
          content: {
            parts: [
              { text: "hi" },
              { functionCall: { name: "read_file", args: { path: "a" } } },
            ],
          },
          finishReason: "STOP",
        },
      ],
      usageMetadata: { promptTokenCount: 6, candidatesTokenCount: 3, totalTokenCount: 9 },
    });
    assert.equal(r.content, "hi");
    assert.deepEqual(r.toolCalls, [{ id: "gemini_read_file", name: "read_file", arguments: { path: "a" } }]);
    assert.deepEqual(r.usage, { inputTokens: 6, outputTokens: 3, totalTokens: 9 });
  });

  it("ollama: parses message.content and tool_calls", () => {
    const h = new OllamaHandler();
    const r = h.parseResponse({
      message: {
        content: "done",
        tool_calls: [{ function: { name: "read_file", arguments: { path: "a" } } }],
      },
      prompt_eval_count: 5,
      eval_count: 3,
      done: true,
    });
    assert.equal(r.content, "done");
    assert.deepEqual(r.toolCalls, [{ id: "ollama_read_file", name: "read_file", arguments: { path: "a" } }]);
    assert.deepEqual(r.usage, { inputTokens: 5, outputTokens: 3, totalTokens: 8 });
  });
});

describe("LLM protocol handlers �?stream parsing", () => {
  it("openai: emits content deltas then done on [DONE]", async () => {
    const h = new OpenAIHandler();
    const body = [
      'data: {"choices":[{"delta":{"content":"Hel"},"index":0}]}',
      'data: {"choices":[{"delta":{"content":"lo"},"index":0}]}',
      'data: [DONE]',
      "",
    ].join("\n");
    const res = new Response(body, { status: 200, headers: { "Content-Type": "text/event-stream" } });
    const events: any[] = [];
    for await (const evt of h.stream(CONFIG, { ...REQ, stream: true })) events.push(evt);
    // mock fetch via stream method with injected fetch
    const fakeFetch = async () => res;
    const h2 = new OpenAIHandler(fakeFetch as unknown as typeof fetch);
    const events2: any[] = [];
    for await (const evt of h2.stream(CONFIG, { ...REQ, stream: true })) events2.push(evt);
    assert.deepEqual(events2.map((e) => e.type), ["content_delta", "content_delta", "done"]);
    assert.equal(events2[0].delta, "Hel");
    assert.equal(events2[1].delta, "lo");
    assert.equal(events2[2].type, "done");
  });

  it("anthropic: accumulates tool input_json fragments", async () => {
    const h = new AnthropicHandler();
    const body = [
      'data: {"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"tu1","name":"read_file","input":{}}}',
      'data: {"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"{\\"path\\":"}}',
      'data: {"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"\\"a\\"}"}}',
      'data: {"type":"message_delta","delta":{"stop_reason":"tool_use"},"usage":{"input_tokens":5,"output_tokens":2}}',
      'data: {"type":"message_stop"}',
      "",
    ].join("\n");
    const res = new Response(body, { status: 200, headers: { "Content-Type": "text/event-stream" } });
    const h2 = new AnthropicHandler(async () => res as unknown as Response);
    const events: any[] = [];
    for await (const evt of h2.stream(CONFIG, { ...REQ, stream: true })) events.push(evt);
    const done = events.find((e) => e.type === "done");
    assert.ok(done);
    assert.deepEqual(done.toolCalls, [
      { id: "tu1", name: "read_file", arguments: { path: "a" } },
    ]);
  });

  it("ollama: NDJSON lines with done flag", async () => {
    const h = new OllamaHandler();
    const body = ['{"message":{"content":"hi"}}', '{"message":{"content":"!"},"done":true,"eval_count":2,"prompt_eval_count":1}'].join("\n");
    const res = new Response(body, { status: 200 });
    const h2 = new OllamaHandler(async () => res as unknown as Response);
    const events: any[] = [];
    for await (const evt of h2.stream(CONFIG, { ...REQ, stream: true })) events.push(evt);
    assert.deepEqual(
      events.map((e) => e.type),
      ["content_delta", "content_delta", "done"]
    );
    assert.equal(events[2].usage.outputTokens, 2);
  });
});

describe("LLM base utilities", () => {
  it("estimateTokens: rough estimation", () => {
    assert.ok(estimateTokens("hello") >= 1);
    assert.ok(estimateTokens("你好世界") >= 1);
  });
});
