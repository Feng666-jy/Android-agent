import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { LLMPlanner } from "../../../services/agent-v2/planner.ts";
import { llmService } from "../../../services/llm/index.ts";

afterEach(() => mock.restoreAll());

const planner = new LLMPlanner();

test("planner 解析标准 JSON 计划", async () => {
  mock.method(llmService, "chat", async () => ({
    content:
      '```json\n{"goal": "整理项目", "steps": [{"title": "扫描", "description": "列出文件"}, {"title": "生成报告", "description": "汇总", "toolHint": "write_file"}]}\n```',
    toolCalls: [],
    usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  }));
  const plan = await planner.plan({ modelId: "m1", task: "整理项目" });
  assert.equal(plan.goal, "整理项目");
  assert.equal(plan.steps.length, 2);
  assert.equal(plan.steps[0].seq, 1);
  assert.equal(plan.steps[0].status, "pending");
  assert.equal(plan.steps[1].toolHint, "write_file");
});

test("planner 输出损坏时降级为单步计划", async () => {
  mock.method(llmService, "chat", async () => ({
    content: "抱歉我无法规划",
    toolCalls: [],
    usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
  }));
  const plan = await planner.plan({ modelId: "m1", task: "随便干点啥" });
  assert.equal(plan.goal, "随便干点啥");
  assert.equal(plan.steps.length, 1);
  assert.equal(plan.steps[0].status, "pending");
});

test("parse 步骤数超限被截断", () => {
  const plan = planner.parse(
    JSON.stringify({
      goal: "g",
      steps: Array.from({ length: 15 }, (_, i) => ({ title: `s${i}` })),
    }),
    "fallback",
    5
  );
  assert.equal(plan.steps.length, 5);
});

