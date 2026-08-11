import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

/**
 * agent-session.service 持久化测试
 * mock prisma 兼容层（遵循 provider.service.test 约定：动态 import + 替换模型对象）。
 */

process.env.DATABASE_URL = "file:./test.db";

interface RunRow {
  id: string;
  userId: number;
  status: string;
  task: string;
  modelId: string;
  sandboxRoot: string;
  iterations: number;
  toolCallCount: number;
  result: string | null;
  error: string | null;
  tokenInput: number;
  tokenOutput: number;
  tokenTotal: number;
  createdAt: string;
  finishedAt: string | null;
}

async function loadSvcAndPrisma() {
  const { prisma } = await import("../../../prisma.ts");
  const svc = await import("../../../services/agent/agent-session.service.ts");
  return { prisma, svc };
}

function makeResult(overrides: Record<string, unknown> = {}): any {
  return {
    status: "completed",
    result: "done",
    iterations: 2,
    toolCalls: 1,
    tokens: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
    usageByIteration: [{ inputTokens: 10, outputTokens: 5, totalTokens: 15, cachedTokens: 0 }],
    state: {
      status: "completed",
      error: null,
      messages: [
        { role: "user", content: "explore", toolCalls: undefined, toolCallId: undefined },
        { role: "assistant", content: "done", toolCalls: [{ id: "c1", name: "list_dir", arguments: { path: "/" } }], toolCallId: undefined },
        { role: "tool", content: "ok", toolCallId: "c1", toolCalls: undefined },
      ],
      toolHistory: [
        { id: "c1", name: "list_dir", arguments: { path: "/" }, ok: true, output: "ok", durationMs: 5 },
      ],
    },
    ...overrides,
  };
}

describe("agent-session.service", () => {
  let originalRun: any;
  let originalMessage: any;
  let originalToolCall: any;
  let originalToken: any;
  let originalTransaction: any;
  let rows: RunRow[];
  let messageRows: any[];
  let toolRows: any[];
  let tokenRows: any[];

  beforeEach(async () => {
    rows = [];
    messageRows = [];
    toolRows = [];
    tokenRows = [];
    const { prisma } = await import("../../../prisma.ts");
    originalRun = prisma.agentRun;
    originalMessage = prisma.agentMessage;
    originalToolCall = prisma.agentToolCall;
    originalToken = prisma.agentTokenUsage;
    originalTransaction = prisma.$transaction;

    prisma.agentRun = {
      create: mock.fn(async (args: any) => {
        rows.push(args.data);
        return args.data;
      }),
      findMany: mock.fn(async (args: any = {}) => {
        let list = [...rows].sort(
          (a, b) => (b.createdAt || "").localeCompare(a.createdAt || "") || (b.id || "").localeCompare(a.id || "")
        );
        if (args?.where?.userId !== undefined) list = list.filter((r) => r.userId === args.where.userId);
        if (args?.skip) list = list.slice(args.skip);
        if (args?.take !== undefined) list = list.slice(0, args.take);
        return list;
      }),
      count: mock.fn(async (args: any = {}) => rows.filter((r) => !args?.where?.userId || r.userId === args.where.userId).length),
      findUnique: mock.fn(async (args: any) => rows.find((r) => r.id === args.where.id) ?? null),
      delete: mock.fn(async (args: any) => {
        const idx = rows.findIndex((r) => r.id === args.where.id && r.userId === args.where.userId);
        if (idx === -1) throw new Error("Record not found");
        const [removed] = rows.splice(idx, 1);
        return removed;
      }),
      deleteMany: mock.fn(async (args: any = {}) => {
        const ids = new Set(args.where?.id?.in ?? []);
        const before = rows.length;
        rows = rows.filter((r) => !(args.where?.userId === r.userId && ids.has(r.id)));
        return { count: before - rows.length };
      }),
    } as any;

    prisma.agentMessage = {
      create: mock.fn(async (args: any) => {
        const row = { ...args.data, createdAt: args.data.createdAt ?? new Date().toISOString() };
        messageRows.push(row);
        return row;
      }),
      findMany: mock.fn(async (args: any = {}) => messageRows.filter((m) => m.runId === args.where?.runId)),
    } as any;

    prisma.agentToolCall = {
      create: mock.fn(async (args: any) => {
        const row = { ...args.data, createdAt: args.data.createdAt ?? new Date().toISOString() };
        toolRows.push(row);
        return row;
      }),
      findMany: mock.fn(async (args: any = {}) => toolRows.filter((t) => t.runId === args.where?.runId)),
    } as any;

    prisma.agentTokenUsage = {
      create: mock.fn(async (args: any) => { tokenRows.push(args.data); return args.data; }),
      findMany: mock.fn(async (args: any = {}) => tokenRows.filter((t) => t.runId === args.where?.runId)),
    } as any;

    prisma.$transaction = mock.fn(async (ops: any[]) => {
      const results: unknown[] = [];
      for (const op of ops) results.push(await op);
      return results;
    }) as any;
  });

  afterEach(async () => {
    const { prisma } = await import("../../../prisma.ts");
    prisma.agentRun = originalRun;
    prisma.agentMessage = originalMessage;
    prisma.agentToolCall = originalToolCall;
    prisma.agentTokenUsage = originalToken;
    prisma.$transaction = originalTransaction;
  });

  it("saveRun persists run + messages + toolCalls + tokenEvents in one transaction", async () => {
    const { prisma, svc } = await loadSvcAndPrisma();
    const input = { modelId: "m1", task: "explore", sandboxRoot: "/tmp/sb" } as any;
    const result = makeResult();

    const run = await svc.saveRun(1, "run-abc", input, result);

    assert.equal(run.id, "run-abc");
    assert.equal(run.status, "completed");
    assert.equal(run.tokenTotal, 15);
    assert.equal(rows.length, 1);
    assert.equal(messageRows.length, 3);
    assert.equal(toolRows.length, 1);
    assert.equal(toolRows[0].argumentsJson, JSON.stringify({ path: "/" }));
    assert.equal(tokenRows.length, 1);
    assert.equal(tokenRows[0].turnId, 1);
    assert.equal((prisma.$transaction as any).mock.callCount(), 1);
  });

  it("listRuns returns paginated + stably sorted (createdAt desc, id desc)", async () => {
    const { svc } = await loadSvcAndPrisma();
    const input = { modelId: "m1", task: "t", sandboxRoot: "/tmp/sb" } as any;
    await svc.saveRun(1, "run-1", input, makeResult({ state: { status: "completed", error: null, messages: [], toolHistory: [] }, usageByIteration: [] }));
    await svc.saveRun(1, "run-2", input, makeResult());
    await svc.saveRun(1, "run-3", input, makeResult());

    const page = await svc.listRuns(1, { page: 1, pageSize: 2 });
    assert.equal(page.total, 3);
    assert.equal(page.pageSize, 2);
    assert.deepEqual(page.list.map((r: RunRow) => r.id), ["run-3", "run-2"]);
  });

  it("getRun returns detail with children, null when not owned", async () => {
    const { svc } = await loadSvcAndPrisma();
    const input = { modelId: "m1", task: "t", sandboxRoot: "/tmp/sb" } as any;
    await svc.saveRun(1, "run-1", input, makeResult());

    const detail = await svc.getRun(1, "run-1");
    assert.ok(detail);
    assert.equal(detail!.messages.length, 3);
    assert.equal(detail!.toolCalls.length, 1);
    assert.equal(detail!.tokenEvents.length, 1);

    const other = await svc.getRun(2, "run-1");
    assert.equal(other, null);
  });

  it("deleteRun removes owned run, returns false for missing/foreign", async () => {
    const { svc } = await loadSvcAndPrisma();
    const input = { modelId: "m1", task: "t", sandboxRoot: "/tmp/sb" } as any;
    await svc.saveRun(1, "run-1", input, makeResult({ state: { status: "completed", error: null, messages: [], toolHistory: [] }, usageByIteration: [] }));

    assert.equal(await svc.deleteRun(1, "run-1"), true);
    assert.equal(await svc.deleteRun(1, "run-1"), false);
  });

  it("deleteRuns bulk deletes only owned ids", async () => {
    const { svc } = await loadSvcAndPrisma();
    const input = { modelId: "m1", task: "t", sandboxRoot: "/tmp/sb" } as any;
    await svc.saveRun(1, "run-1", input, makeResult({ state: { status: "completed", error: null, messages: [], toolHistory: [] }, usageByIteration: [] }));
    await svc.saveRun(1, "run-2", input, makeResult());
    await svc.saveRun(2, "run-3", input, makeResult());

    const result = await svc.deleteRuns(1, ["run-1", "run-3"]);
    assert.equal(result.deleted, 1);
  });
});