import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { ContextManager } from "../../../services/agent-v2/context.ts";
import { llmService } from "../../../services/llm/index.ts";
import type { ChatMessage } from "../../../services/llm/types.ts";

afterEach(() => mock.restoreAll());

function msgs(count: number): ChatMessage[] {
  return Array.from({ length: count }, (_, i) => ({ role: "user" as const, content: `m${i}` }));
}

test("estimate 汇总内容与工具参数 token", () => {
  mock.method(llmService, "countTokens", (text: string) => text.length);
  const cm = new ContextManager({ maxTokens: 1000 });
  const messages: ChatMessage[] = [
    { role: "user", content: "abc" },
    {
      role: "assistant",
      content: null,
      toolCalls: [{ id: "c", name: "x", arguments: { path: "12345" } }],
    },
  ];
  assert.equal(cm.estimate(messages), 3 + 16); // "abc" + JSON.stringify({path:"12345"}) = {"path":"12345"}
});

test("shouldCompact 达到软阈值触发", () => {
  mock.method(llmService, "countTokens", () => 10);
  const cm = new ContextManager({ maxTokens: 100, compactThreshold: 80 });
  assert.equal(cm.shouldCompact(msgs(7)), false); // 70 < 80
  assert.equal(cm.shouldCompact(msgs(8)), true); // 80 >= 80
  assert.equal(cm.overBudget(msgs(11)), true); // 110 >= 100
});

test("compact 保留 system + 最近消息，折叠旧消息（缺省截断摘要）", async () => {
  mock.method(llmService, "countTokens", () => 1);
  const cm = new ContextManager({ maxTokens: 100, keepRecent: 4 });
  const messages: ChatMessage[] = [{ role: "system", content: "sys" }, ...msgs(8)];
  const result = await cm.compact(messages);
  assert.equal(result.dropped, 4);
  assert.equal(result.messages[0].role, "system");
  assert.equal(result.messages[1].role, "system"); // 摘要
  assert.match(result.messages[1].content ?? "", /上下文压缩/);
  assert.equal(result.messages.length, 2 + 4);
});

test("compact 支持注入 LLM 摘要器", async () => {
  mock.method(llmService, "countTokens", () => 1);
  const cm = new ContextManager({ maxTokens: 100, keepRecent: 2 });
  const result = await cm.compact(msgs(5), async (older) => `摘要(${older.length}条)`);
  assert.equal(result.dropped, 3);
  assert.ok((result.messages[0].content ?? "").includes("摘要(3条)"));
});

