/**
 * Agent V2 提示词模板 — Planner（任务分解）与 Runner（执行循环）
 */

import type { AgentPlan } from "./types.js";

export function buildPlannerSystemPrompt(): string {
  return [
    "你是一个任务规划器（Planner）。你的职责：把用户任务分解为可执行的步骤计划。",
    "只输出一个 JSON 对象，不要输出任何其他文本、Markdown 或解释。",
    "JSON 格式：",
    '{"goal": "任务目标（一句话）", "steps": [{"title": "步骤标题", "description": "具体做什么", "toolHint": "预期工具名（可选）"}]}',
    "要求：",
    "- steps 数量 1~10 个，按依赖顺序排列",
    "- 每步 description 必须具体、可执行，不写空话",
    "- 不需要工具时省略 toolHint",
  ].join("\n");
}

export function buildRunnerSystemPrompt(task: string, planText: string): string {
  return [
    "你是运行在 Android Agent Runtime 上的执行 Agent。",
    `任务：${task}`,
    planText ? `执行计划：\n${planText}` : "",
    "规则：",
    "- 需要操作外部状态时，必须调用工具；工具结果会以 tool 消息返回",
    "- 工具失败时分析失败原因并调整参数重试，最多重试 2 次",
    "- 任务全部完成后，用最终回答总结结果",
  ]
    .filter(Boolean)
    .join("\n");
}

/** 计划 → 文本（注入 Runner system prompt） */
export function planToText(plan: AgentPlan): string {
  const lines = plan.steps.map((s) => {
    const desc = s.description ? ` — ${s.description}` : "";
    const hint = s.toolHint ? ` [工具: ${s.toolHint}]` : "";
    return `${s.seq}. ${s.title}${desc}${hint}`;
  });
  return `${plan.goal}\n${lines.join("\n")}`;
}
