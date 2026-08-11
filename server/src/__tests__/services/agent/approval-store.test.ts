import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";

import { ApprovalStore } from "../../../services/agent/approval-store.ts";

describe("ApprovalStore", () => {
  afterEach(() => {
    // 每用例独立 store，避免串扰
  });

  it("creates and lists pending approvals by runId", () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "run-1",
      toolCall: { id: "c1", name: "write_file", arguments: { path: "x.txt" } },
      sandboxRoot: "/tmp/sb",
    });
    const b = store.create({
      runId: "run-1",
      toolCall: { id: "c2", name: "run_command", arguments: { command: "ls" } },
      sandboxRoot: "/tmp/sb",
    });

    assert.equal(store.listByRun("run-1").length, 2);
    assert.equal(store.listByRun("run-other").length, 0);
    assert.equal(store.get(a.id)?.status, "pending");
    assert.equal(b.id !== a.id, true);
  });

  it("settle wakes waiters with the decision", async () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });

    const decision = ApprovalStore.waitForDecision(a, 5_000);
    const settled = store.approve(a.id);
    assert.equal(settled, true);
    assert.equal(await decision, "approved");
    assert.equal(a.status, "approved");
  });

  it("reject settles as rejected", async () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });
    const decision = ApprovalStore.waitForDecision(a, 5_000);
    assert.equal(store.reject(a.id), true);
    assert.equal(await decision, "rejected");
  });

  it("double settle is rejected (idempotent guard)", async () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });
    store.approve(a.id);
    assert.equal(store.reject(a.id), false);
    assert.equal(a.status, "approved");
  });

  it("waitForDecision times out after the given ms", async () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });
    const started = Date.now();
    const decision = await ApprovalStore.waitForDecision(a, 80);
    assert.equal(decision, "timeout");
    assert.ok(Date.now() - started >= 70);
    assert.equal(a.status, "timeout");
  });

  it("waitForDecision resolves immediately when already settled", async () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });
    store.reject(a.id);
    const decision = await ApprovalStore.waitForDecision(a, 5_000);
    assert.equal(decision, "rejected");
  });

  it("abort signal resolves as rejected (run cancelled)", async () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });
    const ac = new AbortController();
    const decision = ApprovalStore.waitForDecision(a, 5_000, ac.signal);
    ac.abort();
    assert.equal(await decision, "rejected");
  });

  it("prune removes settled entries older than maxAgeMs", () => {
    const store = new ApprovalStore();
    const a = store.create({
      runId: "r",
      toolCall: { id: "c1", name: "write_file", arguments: {} },
      sandboxRoot: "/tmp/sb",
    });
    store.approve(a.id);
    a.settledAt = Date.now() - 120_000;
    store.prune(60_000);
    assert.equal(store.get(a.id), undefined);
    assert.equal(store.listByRun("r").length, 0);
  });
});