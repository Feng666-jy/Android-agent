/**
 * LLM Planner — 任务 → 计划（plan.generated 事件的来源）
 *
 * 用 LLM 把用户任务分解为 {goal, steps[]}。解析失败不致命：
 * 降级为单步计划，保证 Loop 不中断。
 */

import { z } from "zod";
import { llmService } from "../llm/index.js";
import { buildPlannerSystemPrompt } from "./prompts.js";
import type { AgentPlan } from "./types.js";

const planStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  toolHint: z.string().optional(),
});

const planSchema = z.object({
  goal: z.string().min(1),
  steps: z.array(planStepSchema).min(1).max(20),
});

export interface PlannerOptions {
  modelId: string;
  task: string;
  /** 计划步骤上限（默认 10） */
  maxSteps?: number;
}

function extractJson(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

export class LLMPlanner {
  async plan(options: PlannerOptions): Promise<AgentPlan> {
    const response = await llmService.chat({
      modelId: options.modelId,
      messages: [
        { role: "system", content: buildPlannerSystemPrompt() },
        { role: "user", content: options.task },
      ],
      temperature: 0.2,
      maxOutputTokens: 2048,
    });
    return this.parse(response.content, options.task, options.maxSteps ?? 10);
  }

  /**
   * 解析 LLM 输出；失败时降级为单步计划（goal = 任务原文）。
   * @param content LLM 返回内容（可能含 Markdown 包裹的 JSON）
   * @param fallbackGoal 解析失败时的目标文本
   */
  parse(content: string | null | undefined, fallbackGoal: string, maxSteps = 10): AgentPlan {
    const raw = extractJson(content ?? "");
    if (raw) {
      try {
        const parsed = planSchema.parse(JSON.parse(raw));
        return {
          goal: parsed.goal,
          steps: parsed.steps.slice(0, maxSteps).map((s, i) => ({ ...s, seq: i + 1, status: "pending" })),
          createdAt: new Date().toISOString(),
        };
      } catch {
        // 解析失败 → 降级
      }
    }
    return {
      goal: fallbackGoal,
      steps: [{ seq: 1, title: "执行任务", description: fallbackGoal, status: "pending" }],
      createdAt: new Date().toISOString(),
    };
  }
}

export const llmPlanner = new LLMPlanner();


