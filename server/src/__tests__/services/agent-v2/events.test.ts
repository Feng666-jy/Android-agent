import { test } from "node:test";
import assert from "node:assert/strict";
import { RunEventBus, makeEvent } from "../../../services/agent-v2/events.ts";

test("bus 投递事件并按 runId 隔离", () => {
  const bus = new RunEventBus();
  const got: string[] = [];
  const offA = bus.subscribe("run-a", (e) => got.push(`a:${e.type}`));
  const offB = bus.subscribe("run-b", (e) => got.push(`b:${e.type}`));

  bus.emit(makeEvent("run.created", "run-a"));
  bus.emit(makeEvent("plan.generated", "run-b", { plan: {} }));

  assert.deepEqual(got, ["a:run.created", "b:plan.generated"]);

  offA();
  bus.emit(makeEvent("run.status", "run-a"));
  assert.equal(got.length, 2, "取消订阅后不再收到事件");
  offB();
});

test("bus 保留历史供回放，removeRun 清理", () => {
  const bus = new RunEventBus();
  bus.emit(makeEvent("run.created", "r1"));
  bus.emit(makeEvent("run.status", "r1", { status: "planning" }));
  assert.equal(bus.history("r1").length, 2);
  assert.equal(bus.history("r1")[0].type, "run.created");

  bus.removeRun("r1");
  assert.equal(bus.history("r1").length, 0);
});

test("bus 单个订阅方异常不影响其他订阅方", () => {
  const bus = new RunEventBus();
  const ok: string[] = [];
  bus.subscribe("r", () => {
    throw new Error("boom");
  });
  bus.subscribe("r", (e) => ok.push(e.type));
  bus.emit(makeEvent("run.created", "r"));
  assert.deepEqual(ok, ["run.created"]);
});
