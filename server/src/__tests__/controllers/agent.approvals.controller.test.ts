import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

import { agentController } from "../../controllers/agent.controller.ts";
import { createMockRes, createMockReq, createMockNext } from "../helpers.ts";

function authReq(body: any = {}, query: any = {}, params: any = {}) {
  const req = createMockReq({ authorization: "Bearer x" }, body, query, params) as any;
  req.user = { userId: 1 };
  return req;
}

describe("agentController 审批端点", () => {
  let approvalStore: any;
  let created: any;

  beforeEach(async () => {
    approvalStore = (await import("../../services/agent/approval-store.ts")).approvalStore;
    created = approvalStore.create({
      runId: "run-1",
      toolCall: { id: "c1", name: "write_file", arguments: { path: "a.txt" } },
      sandboxRoot: "/tmp/sb",
    });
  });

  afterEach(async () => {
    mock.restoreAll();
    const store = (await import("../../services/agent/approval-store.ts")).approvalStore;
    store.clear();
  });

  it("pendingApprovals lists pending tools for a run", async () => {
    const { res, json, status } = createMockRes();
    const req = authReq({}, {}, { runId: "run-1" });

    await agentController.pendingApprovals(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 0);
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].toolName, "write_file");
    assert.equal(body.data[0].status, "pending");
  });

  it("pendingApprovals returns 200 with empty list for missing run (polling semantics)", async () => {
    const { res, json, status } = createMockRes();
    const req = authReq({}, {}, { runId: "nope" });

    await agentController.pendingApprovals(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 200);
    assert.deepEqual(json.mock.calls[0].arguments[0].data, []);
  });

  it("approve settles the approval", async () => {
    const { res, json, status } = createMockRes();
    const req = authReq({}, {}, { id: created.id });

    await agentController.approve(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 0);
    assert.equal(body.data.status, "approved");
    assert.equal(created.status, "approved");
  });

  it("approve on already-settled returns 409", async () => {
    approvalStore.approve(created.id);
    const { res, status } = createMockRes();
    const req = authReq({}, {}, { id: created.id });

    await agentController.approve(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 409);
  });

  it("approve on missing id returns 404", async () => {
    const { res, status } = createMockRes();
    const req = authReq({}, {}, { id: "does-not-exist" });

    await agentController.approve(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 404);
  });

  it("reject settles as rejected", async () => {
    const { res, json, status } = createMockRes();
    const req = authReq({}, {}, { id: created.id });

    await agentController.reject(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 200);
    assert.equal(json.mock.calls[0].arguments[0].data.status, "rejected");
    assert.equal(created.status, "rejected");
  });
});

describe("agentController 历史端点", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("history returns paginated runs", async () => {
    const { agentSessionService } = await import("../../services/agent/agent-session.service.ts");
    mock.method(agentSessionService, "listRuns", async () => ({
      list: [{ id: "r1", status: "completed", result: "ok" }],
      total: 1,
      page: 1,
      pageSize: 10,
    }));
    const { res, json, status } = createMockRes();
    const req = authReq({}, { page: "1", pageSize: "10" });

    await agentController.history(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 0);
    assert.equal(body.data.total, 1);
    assert.equal((agentSessionService.listRuns as any).mock.calls[0].arguments[0], 1);
    const args1 = (agentSessionService.listRuns as any).mock.calls[0].arguments[1];
    assert.equal(args1.page, 1);
    assert.equal(args1.pageSize, 10);
  });

  it("history defaults page/pageSize and rejects non-numeric", async () => {
    const { agentSessionService } = await import("../../services/agent/agent-session.service.ts");
    mock.method(agentSessionService, "listRuns", async () => ({ list: [], total: 0, page: 1, pageSize: 20 }));
    const ok = createMockRes();
    await agentController.history(authReq({}, {}), ok.res as any, createMockNext());
    assert.equal((agentSessionService.listRuns as any).mock.calls[0].arguments[0], 1);
    const defaults = (agentSessionService.listRuns as any).mock.calls[0].arguments[1];
    assert.equal(defaults.page, 1);
    assert.equal(defaults.pageSize, 20);

    const bad = createMockRes();
    await agentController.history(authReq({}, { page: "abc" }), bad.res as any, createMockNext());
    assert.equal(bad.status.mock.calls[0].arguments[0], 400);
    assert.equal((agentSessionService.listRuns as any).mock.callCount(), 1);
  });

  it("detail returns a run or 404", async () => {
    const { agentSessionService } = await import("../../services/agent/agent-session.service.ts");
    mock.method(agentSessionService, "getRun", async () => ({ id: "r1", messages: [], toolCalls: [], tokenEvents: [] }));
    const ok = createMockRes();
    await agentController.detail(authReq({}, {}, { id: "r1" }), ok.res as any, createMockNext());
    assert.equal(ok.status.mock.calls[0].arguments[0], 200);
    assert.equal(ok.json.mock.calls[0].arguments[0].code, 0);
    assert.equal((agentSessionService.getRun as any).mock.calls[0].arguments[0], 1);

    mock.method(agentSessionService, "getRun", async () => null);
    const missing = createMockRes();
    await agentController.detail(authReq({}, {}, { id: "r2" }), missing.res as any, createMockNext());
    assert.equal(missing.status.mock.calls[0].arguments[0], 404);
  });

  it("remove deletes a run", async () => {
    const { agentSessionService } = await import("../../services/agent/agent-session.service.ts");
    mock.method(agentSessionService, "deleteRun", async () => true);
    const ok = createMockRes();
    await agentController.remove(authReq({}, {}, { id: "r1" }), ok.res as any, createMockNext());
    assert.equal(ok.status.mock.calls[0].arguments[0], 200);

    mock.method(agentSessionService, "deleteRun", async () => false);
    const missing = createMockRes();
    await agentController.remove(authReq({}, {}, { id: "r9" }), missing.res as any, createMockNext());
    assert.equal(missing.status.mock.calls[0].arguments[0], 404);
  });

  it("batchDelete deletes a set of ids", async () => {
    const { agentSessionService } = await import("../../services/agent/agent-session.service.ts");
    mock.method(agentSessionService, "deleteRuns", async () => ({ deleted: 2 }));
    const { res, json, status } = createMockRes();
    const req = authReq({ ids: ["r1", "r2"] });

    await agentController.batchDelete(req, res as any, createMockNext());
    assert.equal(status.mock.calls[0].arguments[0], 200);
    const body = json.mock.calls[0].arguments[0];
    assert.equal(body.code, 0);
    assert.equal(body.data.deleted, 2);
    assert.deepEqual((agentSessionService.deleteRuns as any).mock.calls[0].arguments[1], ["r1", "r2"]);
  });
});