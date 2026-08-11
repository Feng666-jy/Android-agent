import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

process.env.DATABASE_URL = "file:./test-llm.db";

async function load() {
  const { prisma } = await import("../../../prisma.ts");
  const llm = await import("../../../services/llm/index.ts");
  return { prisma, llm };
}

describe("llm.service", () => {
  let originalModel: any;
  let originalProvider: any;

  beforeEach(async () => {
    const { prisma } = await import("../../../prisma.ts");
    originalModel = prisma.model;
    originalProvider = prisma.provider;
  });

  afterEach(async () => {
    mock.restoreAll();
    const { prisma } = await import("../../../prisma.ts");
    prisma.model = originalModel;
    prisma.provider = originalProvider;
  });

  describe("resolveTarget", () => {
    it("loads provider + model config by modelId", async () => {
      const { prisma, llm } = await load();
      prisma.model = {
        findUnique: mock.fn(async () => ({
          id: "m1",
          providerId: "p1",
          modelName: "deepseek-chat",
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: null,
          frequencyPenalty: null,
          presencePenalty: null,
          contextWindow: 64000,
          customHeaders: null,
          customParams: null,
        })),
      } as any;
      prisma.provider = {
        findUnique: mock.fn(async () => ({
          id: "p1",
          name: "DeepSeek",
          baseUrl: "https://api.deepseek.com/v1",
          protocol: "OPENAI_COMPATIBLE",
          authType: "API_KEY",
          apiKeyEncrypted: "sk-deepseek",
          isEnabled: true,
          metadata: null,
        })),
      } as any;

      const target = await llm.llmService.resolveTarget({ modelId: "m1" });
      assert.equal(target.provider.baseUrl, "https://api.deepseek.com/v1");
      assert.equal(target.provider.apiKey, "sk-deepseek");
      assert.equal(target.provider.protocol, "OPENAI_COMPATIBLE");
      assert.equal(target.model.modelName, "deepseek-chat");
      assert.equal(target.model.temperature, 0.7);
      assert.equal(target.handler.protocol, "OPENAI_COMPATIBLE");
    });

    it("resolves by providerId + modelName", async () => {
      const { prisma, llm } = await load();
      prisma.model = {
        findUnique: mock.fn(async () => null),
        findFirst: mock.fn(async () => ({
          id: "m2",
          providerId: "p2",
          modelName: "claude-3-5-sonnet-20241022",
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: null,
          frequencyPenalty: null,
          presencePenalty: null,
          contextWindow: 200000,
          customHeaders: null,
          customParams: null,
        })),
      } as any;
      prisma.provider = {
        findUnique: mock.fn(async () => ({
          id: "p2",
          name: "Anthropic",
          baseUrl: "https://api.anthropic.com/v1",
          protocol: "ANTHROPIC",
          authType: "API_KEY",
          apiKeyEncrypted: "sk-ant",
          isEnabled: true,
          metadata: null,
        })),
      } as any;

      const target = await llm.llmService.resolveTarget({ providerId: "p2", modelName: "claude-3-5-sonnet-20241022" });
      assert.equal(target.handler.protocol, "ANTHROPIC");
    });

    it("parses metadata customHeaders and customParams", async () => {
      const { prisma, llm } = await load();
      prisma.model = {
        findUnique: mock.fn(async () => ({
          id: "m1",
          providerId: "p1",
          modelName: "gpt-4o",
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: null,
          frequencyPenalty: null,
          presencePenalty: null,
          contextWindow: 128000,
          customHeaders: '{"X-Trace":"abc"}',
          customParams: '{"response_format":{"type":"json_object"}}',
        })),
      } as any;
      prisma.provider = {
        findUnique: mock.fn(async () => ({
          id: "p1",
          name: "OpenAI",
          baseUrl: "https://api.openai.com/v1",
          protocol: "OPENAI_COMPATIBLE",
          authType: "API_KEY",
          apiKeyEncrypted: "sk-abc",
          isEnabled: true,
          metadata: '{"timeoutMs":15000,"customHeaders":{"X-Org":"demo"}}',
        })),
      } as any;

      const target = await llm.llmService.resolveTarget({ modelId: "m1" });
      assert.equal(target.provider.timeoutMs, 15000);
      assert.deepEqual(target.provider.customHeaders, { "X-Org": "demo" });
      assert.deepEqual(target.model.customHeaders, { "X-Trace": "abc" });
      assert.deepEqual(target.model.customParams, { response_format: { type: "json_object" } });
    });

    it("throws LlmValidationError when model not found", async () => {
      const { prisma, llm } = await load();
      prisma.model = { findUnique: mock.fn(async () => null) } as any;
      await assert.rejects(
        () => llm.llmService.resolveTarget({ modelId: "missing" }),
        (err: any) => err.name === "LlmValidationError" && /not found/i.test(err.message)
      );
    });

    it("throws LlmValidationError when provider disabled", async () => {
      const { prisma, llm } = await load();
      prisma.model = {
        findUnique: mock.fn(async () => ({
          id: "m1",
          providerId: "p1",
          modelName: "m",
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: null,
          frequencyPenalty: null,
          presencePenalty: null,
          contextWindow: null,
          customHeaders: null,
          customParams: null,
        })),
      } as any;
      prisma.provider = {
        findUnique: mock.fn(async () => ({
          id: "p1",
          name: "Offline",
          baseUrl: "https://x",
          protocol: "OPENAI_COMPATIBLE",
          authType: "API_KEY",
          apiKeyEncrypted: null,
          isEnabled: false,
          metadata: null,
        })),
      } as any;
      await assert.rejects(
        () => llm.llmService.resolveTarget({ modelId: "m1" }),
        (err: any) => /disabled/i.test(err.message)
      );
    });

    it("throws LlmValidationError on unsupported protocol", async () => {
      const { prisma, llm } = await load();
      prisma.model = {
        findUnique: mock.fn(async () => ({
          id: "m1",
          providerId: "p1",
          modelName: "m",
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: null,
          frequencyPenalty: null,
          presencePenalty: null,
          contextWindow: null,
          customHeaders: null,
          customParams: null,
        })),
      } as any;
      prisma.provider = {
        findUnique: mock.fn(async () => ({
          id: "p1",
          name: "Weird",
          baseUrl: "https://x",
          protocol: "WEIRD",
          authType: "API_KEY",
          apiKeyEncrypted: null,
          isEnabled: true,
          metadata: null,
        })),
      } as any;
      await assert.rejects(
        () => llm.llmService.resolveTarget({ modelId: "m1" }),
        (err: any) => /Unsupported protocol/i.test(err.message)
      );
    });
  });

  describe("countTokens", () => {
    it("returns >= 1 for any non-empty string", async () => {
      const { llm } = await load();
      assert.ok(llm.llmService.countTokens("hi") >= 1);
    });
  });
});
