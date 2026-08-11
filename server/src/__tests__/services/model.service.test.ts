import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

// ---- Mock Prisma Factory ----
// Creates a fresh set of tracked mock functions for each test.

function createMockPrisma() {
  return {
    model: {
      findMany: mock.fn(),
      findUnique: mock.fn(),
      update: mock.fn(),
      updateMany: mock.fn(),
      count: mock.fn(),
    },
    modelGroup: {
      findMany: mock.fn(),
      findUnique: mock.fn(),
      create: mock.fn(),
      update: mock.fn(),
      delete: mock.fn(),
      aggregate: mock.fn(),
    },
    $transaction: mock.fn(),
  };
}

let mockPrisma: ReturnType<typeof createMockPrisma>;

const {
  getModels,
  toggleFavorite,
  setDefault,
  getGroups,
  createGroup,
  deleteGroup,
  moveModelsToGroup,
} = await import("../../services/model.service.js");

function makeModel(overrides = {}) {
  return {
    id: "m1",
    providerId: "p1",
    modelName: "gpt-4o",
    displayName: "GPT-4o",
    aliases: '["4o"]',
    contextWindow: 128000,
    capabilities: '["TEXT","VISION"]',
    isFavorite: false,
    isDefault: false,
    isEnabled: true,
    sortOrder: 0,
    groupId: null,
    temperature: 0.7,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("model.service", () => {
  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  describe("getModels", () => {
    it("returns models with default params (no filters)", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => [makeModel()]);
      mockPrisma.model.count.mock.mockImplementation(async () => 1);

      const result = await getModels(mockPrisma as any, {});
      assert.equal(result.models.length, 1);
      assert.equal(result.total, 1);
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.deepEqual(callArgs.orderBy, [{ sortOrder: "asc" }]);
    });

    it("filters by search keyword (matches displayName or modelName)", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 0);

      await getModels(mockPrisma as any, { search: "gpt" });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.ok(callArgs.where.OR);
      assert.ok(callArgs.where.OR.some((c: any) => c.displayName));
    });

    it("filters by providerId", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 0);

      await getModels(mockPrisma as any, { providerId: "p1" });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.equal(callArgs.where.providerId, "p1");
    });

    it("filters by isFavorite=true", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 0);

      await getModels(mockPrisma as any, { isFavorite: true });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.equal(callArgs.where.isFavorite, true);
    });

    it("filters by groupId", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 0);

      await getModels(mockPrisma as any, { groupId: "g1" });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.equal(callArgs.where.groupId, "g1");
    });

    it("sorts by name ascending", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 0);

      await getModels(mockPrisma as any, { sort: "name" });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.deepEqual(callArgs.orderBy, [{ displayName: "asc" }]);
    });

    it("sorts by created date descending", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 0);

      await getModels(mockPrisma as any, { sort: "created" });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.deepEqual(callArgs.orderBy, [{ createdAt: "desc" }]);
    });

    it("applies pagination (page & pageSize)", async () => {
      mockPrisma.model.findMany.mock.mockImplementation(async () => []);
      mockPrisma.model.count.mock.mockImplementation(async () => 50);

      const result = await getModels(mockPrisma as any, { page: 2, pageSize: 10 });
      const callArgs = mockPrisma.model.findMany.mock.calls[0].arguments[0];
      assert.equal(callArgs.skip, 10);
      assert.equal(callArgs.take, 10);
      assert.equal(result.page, 2);
      assert.equal(result.pageSize, 10);
      assert.equal(result.total, 50);
    });
  });

  describe("toggleFavorite", () => {
    it("toggles isFavorite from false to true", async () => {
      mockPrisma.model.findUnique.mock.mockImplementation(async () => makeModel({ isFavorite: false }));
      mockPrisma.model.update.mock.mockImplementation(async ({ data }) => makeModel({ isFavorite: data.isFavorite }));

      const result = await toggleFavorite(mockPrisma as any, "m1");
      assert.equal(result.isFavorite, true);
    });

    it("toggles isFavorite from true to false", async () => {
      mockPrisma.model.findUnique.mock.mockImplementation(async () => makeModel({ isFavorite: true }));
      mockPrisma.model.update.mock.mockImplementation(async ({ data }) => makeModel({ isFavorite: data.isFavorite }));

      const result = await toggleFavorite(mockPrisma as any, "m1");
      assert.equal(result.isFavorite, false);
    });

    it("throws when model not found", async () => {
      mockPrisma.model.findUnique.mock.mockImplementation(async () => null);

      await assert.rejects(() => toggleFavorite(mockPrisma as any, "nonexistent"), {
        name: "ModelNotFoundError",
      });
    });
  });

  describe("setDefault", () => {
    it("sets model as default and clears previous default", async () => {
      mockPrisma.model.findUnique.mock.mockImplementation(async () => makeModel({ isDefault: false }));
      mockPrisma.model.update.mock.mockImplementation(async () => makeModel({ isDefault: true }));
      mockPrisma.model.updateMany.mock.mockImplementation(async () => ({ count: 1 }));
      mockPrisma.$transaction.mock.mockImplementation(async (cb: any) => cb(mockPrisma));

      const result = await setDefault(mockPrisma as any, "m1");
      assert.equal(result.isDefault, true);
      assert.ok(mockPrisma.$transaction.mock.calls.length > 0);
    });

    it("throws when model not found", async () => {
      mockPrisma.model.findUnique.mock.mockImplementation(async () => null);

      await assert.rejects(() => setDefault(mockPrisma as any, "nonexistent"), {
        name: "ModelNotFoundError",
      });
    });
  });

  describe("getGroups", () => {
    it("returns groups sorted by sortOrder", async () => {
      const groups = [
        { id: "g1", name: "Coding", sortOrder: 0 },
        { id: "g2", name: "Chat", sortOrder: 1 },
      ];
      mockPrisma.modelGroup.findMany.mock.mockImplementation(async () => groups);

      const result = await getGroups(mockPrisma as any);
      assert.equal(result.length, 2);
      assert.equal(result[0].name, "Coding");
    });
  });

  describe("createGroup", () => {
    it("creates a group with given name", async () => {
      mockPrisma.modelGroup.aggregate.mock.mockImplementation(async () => ({ _max: { sortOrder: 5 } }));
      mockPrisma.modelGroup.create.mock.mockImplementation(async ({ data }) => ({
        id: "new-g",
        ...data,
      }));

      const result = await createGroup(mockPrisma as any, { name: "Research" });
      assert.equal(result.name, "Research");
    });
  });

  describe("deleteGroup", () => {
    it("deletes a group and sets models groupId to null", async () => {
      mockPrisma.modelGroup.findUnique.mock.mockImplementation(async () => ({ id: "g1", name: "Test" }));
      mockPrisma.model.updateMany.mock.mockImplementation(async () => ({ count: 2 }));
      mockPrisma.modelGroup.delete.mock.mockImplementation(async () => ({ id: "g1" }));

      await deleteGroup(mockPrisma as any, "g1");
      assert.ok(mockPrisma.model.updateMany.mock.calls.length > 0);
      assert.ok(mockPrisma.modelGroup.delete.mock.calls.length > 0);
    });
  });

  describe("moveModelsToGroup", () => {
    it("moves multiple models to target group", async () => {
      mockPrisma.model.updateMany.mock.mockImplementation(async () => ({ count: 3 }));

      const result = await moveModelsToGroup(mockPrisma as any, ["m1", "m2", "m3"], "g1");
      assert.equal(result.updated, 3);
    });

    it("removes models from group when groupId is null", async () => {
      mockPrisma.model.updateMany.mock.mockImplementation(async () => ({ count: 2 }));

      const result = await moveModelsToGroup(mockPrisma as any, ["m1", "m2"], null);
      assert.equal(result.updated, 2);
    });
  });
});