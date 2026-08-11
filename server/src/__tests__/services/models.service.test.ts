import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import type { PrismaClient } from "../../prisma.js";
import { getModelsByProvider, type ModelProvider } from "../../services/models.service.js";

function createMockPrisma(provider: ModelProvider, returnValue: any[]) {
  const findMany = mock.fn(async () => returnValue);
  const mockPrisma: any = {};

  const modelMap: Record<ModelProvider, string> = {
    deepseek: "deepseekModel",
    claude: "claudeModel",
    chatgpt: "chatgptModel",
  };

  mockPrisma[modelMap[provider]] = { findMany };
  return mockPrisma as PrismaClient;
}

describe("models.service", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  describe("getModelsByProvider", () => {
    const fakeModels = [
      { id: 1, modelName: "deepseek-chat", displayName: "DeepSeek Chat", sort: 1 },
      { id: 2, modelName: "deepseek-coder", displayName: "DeepSeek Coder", sort: 2 },
    ];

    it("returns models for deepseek provider", async () => {
      const prisma = createMockPrisma("deepseek", fakeModels);
      const result = await getModelsByProvider(prisma, "deepseek");
      assert.deepEqual(result, fakeModels);
    });

    it("returns models for claude provider", async () => {
      const prisma = createMockPrisma("claude", fakeModels);
      const result = await getModelsByProvider(prisma, "claude");
      assert.deepEqual(result, fakeModels);
    });

    it("returns models for chatgpt provider", async () => {
      const prisma = createMockPrisma("chatgpt", fakeModels);
      const result = await getModelsByProvider(prisma, "chatgpt");
      assert.deepEqual(result, fakeModels);
    });

    it("queries with status=1 filter and sort by sort asc", async () => {
      const prisma = createMockPrisma("deepseek", fakeModels);
      await getModelsByProvider(prisma, "deepseek");
      const findMany = (prisma as any).deepseekModel.findMany;
      assert.equal(findMany.mock.callCount(), 1);
      const callArgs = findMany.mock.calls[0].arguments[0];
      assert.equal(callArgs.where.status, 1);
      assert.equal(callArgs.orderBy.sort, "asc");
    });

    it("returns empty array when no models found", async () => {
      const prisma = createMockPrisma("deepseek", []);
      const result = await getModelsByProvider(prisma, "deepseek");
      assert.deepEqual(result, []);
    });
  });
});