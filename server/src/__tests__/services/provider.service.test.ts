import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

/**
 * Provider Service 测试
 * 
 * 测试策略（遵循 frontend-testing-debugging 技能）：
 * - 集成测试覆盖行为，不 mock 内部实现
 * - mock 外部依赖（Prisma Client）
 * - 使用 ESM 动态 import + mock.method（匹配项目约定）
 */

// 在 import 之前设置环境变量
process.env.DATABASE_URL = "file:./test.db";

async function loadMocksAndService() {
  const { prisma } = await import("../../prisma.ts");
  const svc = await import("../../services/provider.service.ts");
  return { prisma, svc };
}

describe("provider.service", () => {
  let originalProvider: any;

  beforeEach(async () => {
    const { prisma } = await import("../../prisma.ts");
    originalProvider = prisma.provider;
  });

  afterEach(async () => {
    mock.restoreAll();
    const { prisma } = await import("../../prisma.ts");
    prisma.provider = originalProvider;
  });

  describe("createProvider", () => {
    it("creates a provider with valid input", async () => {
      const { prisma, svc } = await loadMocksAndService();
      const fakeProvider = {
        id: "prov_1",
        name: "OpenAI",
        baseUrl: "https://api.openai.com/v1",
        protocol: "OPENAI_COMPATIBLE",
        authType: "API_KEY",
        isEnabled: true,
        healthStatus: "UNKNOWN",
        sortOrder: 0,
        isBuiltin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createMock = mock.fn(async (args: any) => ({ ...fakeProvider, ...args.data }));
      const aggregateMock = mock.fn(async () => ({ _max: { sortOrder: -1 } }));

      prisma.provider = {
        create: createMock,
        aggregate: aggregateMock,
      } as any;

      const result = await svc.providerService.createProvider({
        name: "OpenAI",
        baseUrl: "https://api.openai.com/v1",
        protocol: "OPENAI_COMPATIBLE",
        authType: "API_KEY",
      });

      assert.equal(result.name, "OpenAI");
      assert.equal(result.baseUrl, "https://api.openai.com/v1");
      assert.equal(createMock.mock.callCount(), 1);
    });

    it("throws when name is empty", async () => {
      const { svc } = await loadMocksAndService();
      await assert.rejects(
        () => svc.providerService.createProvider({
          name: "",
          baseUrl: "https://api.openai.com/v1",
        }),
        (err: any) => {
          assert.match(err.message, /name/i);
          return true;
        }
      );
    });

    it("throws when baseUrl is invalid URL", async () => {
      const { svc } = await loadMocksAndService();
      await assert.rejects(
        () => svc.providerService.createProvider({
          name: "Test",
          baseUrl: "not-a-url",
        }),
        (err: any) => {
          assert.match(err.message, /url/i);
          return true;
        }
      );
    });
  });

  describe("getProviders", () => {
    it("returns providers sorted by sortOrder", async () => {
      const { prisma, svc } = await loadMocksAndService();
      const fakeProviders = [
        { id: "p1", name: "OpenAI", sortOrder: 0, isEnabled: true },
        { id: "p2", name: "Claude", sortOrder: 1, isEnabled: true },
        { id: "p3", name: "DeepSeek", sortOrder: 2, isEnabled: true },
      ];

      prisma.provider = {
        findMany: mock.fn(async () => fakeProviders),
      } as any;

      const result = await svc.providerService.getProviders();

      assert.equal(result.length, 3);
      assert.deepEqual(
        result.map((p: any) => p.id),
        ["p1", "p2", "p3"]
      );
    });

    it("filters disabled providers by default", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findMany: mock.fn(async (args: any) => {
          assert.ok(args.where?.isEnabled !== undefined, "should filter by isEnabled");
          return [];
        }),
      } as any;

      await svc.providerService.getProviders();
    });

    it("returns all providers when includeDisabled is true", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findMany: mock.fn(async (args: any) => {
          assert.ok(Object.keys(args.where).length === 0, "should not filter when includeDisabled");
          return [];
        }),
      } as any;

      await svc.providerService.getProviders(true);
    });
  });

  describe("updateProvider", () => {
    it("updates provider fields", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({ id: "prov_1", name: "Old" })),
        update: mock.fn(async (args: any) => ({ id: "prov_1", name: "New", ...args.data })),
      } as any;

      const result = await svc.providerService.updateProvider("prov_1", { name: "New" });

      assert.equal(result.name, "New");
    });

    it("throws when provider not found", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => null),
      } as any;

      await assert.rejects(
        () => svc.providerService.updateProvider("nonexistent", { name: "X" }),
        (err: any) => {
          assert.match(err.message, /not found/i);
          return true;
        }
      );
    });
  });

  describe("deleteProvider", () => {
    it("deletes a non-builtin provider", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({ id: "prov_1", isBuiltin: false })),
        delete: mock.fn(async () => ({ id: "prov_1" })),
      } as any;

      await svc.providerService.deleteProvider("prov_1");

      assert.equal((prisma.provider as any).delete.mock.callCount(), 1);
    });

    it("throws when trying to delete builtin provider", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({ id: "prov_1", isBuiltin: true })),
      } as any;

      await assert.rejects(
        () => svc.providerService.deleteProvider("prov_1"),
        (err: any) => {
          assert.match(err.message, /built.in/i);
          return true;
        }
      );
    });
  });

  describe("reorder", () => {
    it("updates sortOrder for each provider", async () => {
      const { prisma, svc } = await loadMocksAndService();

      const updateMock = mock.fn(async () => ({}));
      (prisma as any).$transaction = mock.fn(async (ops: any) => ops.map((op: any) => op));

      prisma.provider = { update: updateMock } as any;

      await svc.providerService.reorder(["p1", "p2", "p3"]);

      assert.equal(updateMock.mock.callCount(), 3);
    });
  });

  describe("discoverModels", () => {
    const providerRow = {
      id: "prov_1",
      name: "DeepSeek",
      baseUrl: "https://api.deepseek.com/v1",
      protocol: "OPENAI_COMPATIBLE",
      authType: "API_KEY",
      apiKeyEncrypted: "sk-test",
    };

    it("parses OPENAI_COMPATIBLE models and marks existing", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => providerRow),
      } as any;
      prisma.model = {
        findMany: mock.fn(async () => [{ modelName: "m1" }]),
      } as any;

      const fetchMock = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ id: "m1" }, { id: "m2" }] }),
      }));
      mock.method(globalThis, "fetch", fetchMock);

      const result = await svc.providerService.discoverModels("prov_1");

      assert.equal(result.models.length, 2);
      assert.deepEqual(
        result.models.map((m: any) => m.modelName),
        ["m1", "m2"]
      );
      assert.equal(result.models[0].exists, true);
      assert.equal(result.models[1].exists, false);
      assert.equal(result.error, undefined);
    });

    it("sends Bearer auth for API_KEY providers", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => providerRow),
      } as any;
      prisma.model = {
        findMany: mock.fn(async () => []),
      } as any;

      const fetchMock = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      }));
      mock.method(globalThis, "fetch", fetchMock);

      await svc.providerService.discoverModels("prov_1");

      const [url, opts] = fetchMock.mock.calls[0].arguments as [string, any];
      assert.equal(url, "https://api.deepseek.com/v1/models");
      assert.equal(opts.headers.Authorization, "Bearer sk-test");
    });

    it("uses /api/tags for OLLAMA", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({
          ...providerRow,
          protocol: "OLLAMA",
          authType: "NONE",
        })),
      } as any;
      prisma.model = {
        findMany: mock.fn(async () => []),
      } as any;

      const fetchMock = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ models: [{ name: "llama3:8b" }, { name: "llama3.1:70b" }] }),
      }));
      mock.method(globalThis, "fetch", fetchMock);

      const result = await svc.providerService.discoverModels("prov_1");

      const [url] = fetchMock.mock.calls[0].arguments as [string, any];
      assert.equal(url, "https://api.deepseek.com/v1/api/tags");
      assert.deepEqual(
        result.models.map((m: any) => m.modelName),
        ["llama3:8b", "llama3.1:70b"]
      );
    });

    it("strips models/ prefix for GOOGLE_GEMINI and appends key", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({
          ...providerRow,
          protocol: "GOOGLE_GEMINI",
          baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        })),
      } as any;
      prisma.model = {
        findMany: mock.fn(async () => []),
      } as any;

      const fetchMock = mock.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ models: [{ name: "models/gemini-1.5-flash" }] }),
      }));
      mock.method(globalThis, "fetch", fetchMock);

      const result = await svc.providerService.discoverModels("prov_1");

      const [url] = fetchMock.mock.calls[0].arguments as [string, any];
      assert.match(url, /\?key=sk-test$/);
      assert.deepEqual(result.models.map((m: any) => m.modelName), ["gemini-1.5-flash"]);
    });

    it("returns error message on non-ok response", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => providerRow),
      } as any;
      prisma.model = {
        findMany: mock.fn(async () => []),
      } as any;

      const fetchMock = mock.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({}),
      }));
      mock.method(globalThis, "fetch", fetchMock);

      const result = await svc.providerService.discoverModels("prov_1");

      assert.equal(result.error, "HTTP 401");
      assert.equal(result.httpStatus, 401);
      assert.deepEqual(result.models, []);
    });

    it("throws when provider not found", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => null),
      } as any;

      await assert.rejects(
        () => svc.providerService.discoverModels("nonexistent"),
        (err: any) => {
          assert.match(err.message, /not found/i);
          return true;
        }
      );
    });
  });

  describe("importModels", () => {
    it("creates missing models and skips existing", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({ id: "prov_1", name: "DeepSeek" })),
      } as any;
      prisma.model = {
        findMany: mock.fn(async () => [{ modelName: "m1" }]),
        create: mock.fn(async (args: any) => ({ id: "m_" + args.data.modelName, ...args.data })),
      } as any;

      const result = await svc.providerService.importModels("prov_1", ["m1", "m2", "m3", "m2"]);

      assert.equal(result.created, 2);
      assert.equal(result.skipped, 1);
      const createArgs = (prisma.model as any).create.mock.calls.map((c: any) => c.arguments[0].data);
      assert.deepEqual(
        createArgs.map((d: any) => d.modelName),
        ["m2", "m3"]
      );
      assert.equal(createArgs[0].providerId, "prov_1");
    });

    it("throws when no model names provided", async () => {
      const { prisma, svc } = await loadMocksAndService();

      prisma.provider = {
        findUnique: mock.fn(async () => ({ id: "prov_1" })),
      } as any;

      await assert.rejects(
        () => svc.providerService.importModels("prov_1", []),
        (err: any) => {
          assert.match(err.message, /model names/i);
          return true;
        }
      );
    });
  });
});