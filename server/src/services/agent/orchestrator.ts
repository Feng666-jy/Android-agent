/**
 * Agent 编排器 — 核心循环
 *
 * 流程：
 *   1. 构造 system + user 消息
 *   2. 循环调用 llmService.chat（带 tool definitions）
 *   3. 若模型返回 tool_calls → 依次执行工具并回填 tool 消息，继续下一轮
 *   4. 若模型不再请求工具 → completed
 *
 * 熔断（防御死循环 / 失控成本）：
 *   - maxIterations：最大轮数
 *   - tokenBudget：消息累计 token 超限即终止（budget_exceeded）
 *   - llmTimeoutMs：单次 LLM 调用超时（可被外层 signal 取消）
 *   - signal：外部取消（客户端断开 / 手动停止）
 */

import { llmService } from "../llm/index.js";
import { LlmAuthError, LlmError, LlmUnreachableError, LlmValidationError } from "../llm/errors.js";
import { resolveSandboxRoot, ensureSandboxRoot } from "./sandbox.js";
import { ToolRegistry, toolRegistry } from "./tool-registry.js";
import { AgentSession } from "./session.js";
import { buildSystemPrompt } from "./system-prompt.js";
import { normalizeConfig } from "./types.js";
import type { AgentResult, AgentRunInput } from "./types.js";
import { normalizePermissionConfig, resolvePermission, defaultDenyHandler } from "./permissions.js";
import type { ToolPermission } from "./types.js";
import type { TokenUsage } from "../llm/types.js";

export async function runAgent(input: AgentRunInput, registry: ToolRegistry = toolRegistry): Promise<AgentResult> {
  const config = normalizeConfig(input);
  const sandboxRoot = resolveSandboxRoot(input.sandboxRoot);
  const permissionConfig = normalizePermissionConfig(input.permission);
  const approvalHandler = input.approvalHandler ?? defaultDenyHandler;
  const session = new AgentSession(input.task, sandboxRoot);

  try {
    await ensureSandboxRoot(sandboxRoot);

    const tools = registry.getDefinitions();
    const toolNames = registry.list().map((t) => ({ name: t.name, description: t.description }));

    session.pushMessage({ role: "system", content: buildSystemPrompt({ sandboxRoot, tools: toolNames, permissions: permissionConfig }) });
    session.pushMessage({ role: "user", content: input.task });

    for (let iteration = 1; iteration <= config.maxIterations; iteration++) {
      if (input.signal?.aborted) {
        session.finish("cancelled", "Agent run was cancelled by the caller");
        return toResult(session, iteration - 1);
      }

      if (session.estimateMessagesTokens() > config.tokenBudget) {
        session.finish("budget_exceeded", "Token budget exceeded");
        return toResult(session, iteration - 1);
      }

      const response = await callLlm(input, session, tools, config.llmTimeoutMs);
      session.addUsage(response.usage);

      // 记录 assistant 消息（无论是否请求工具）
      session.pushMessage({
        role: "assistant",
        content: response.content || null,
        toolCalls: response.toolCalls,
      });

      if (response.toolCalls.length === 0) {
        session.finish("completed");
        return toResult(session, iteration);
      }

      // 依次执行工具并回填（经权限门：allow 直行 / ask 审批 / deny 拒绝）
      for (const tc of response.toolCalls) {
        const started = Date.now();
        const permission = resolvePermission(permissionConfig, tc.name);
        const result = await executeWithPermission(tc, permission, sandboxRoot, input, approvalHandler);
        session.recordTool({
          id: tc.id,
          name: tc.name,
          arguments: tc.arguments,
          ok: result.ok,
          output: result.output,
          durationMs: Date.now() - started,
        });
        session.pushMessage({
          role: "tool",
          toolCallId: tc.id,
          content: result.output,
        });
      }
    }

    session.finish("failed", `Max iterations (${config.maxIterations}) reached`);
    return toResult(session, config.maxIterations);
  } catch (err) {
    if (input.signal?.aborted || isAbortError(err)) {
      session.finish("cancelled", "Agent run was cancelled");
      return toResult(session, session.messages.filter((m) => m.role === "assistant").length);
    }
    // 已知 LLM 错误透传上层（controller 负责映射 HTTP 状态码，与 chat 一致）
    if (err instanceof LlmValidationError || err instanceof LlmAuthError || err instanceof LlmUnreachableError || err instanceof LlmError) {
      throw err;
    }
    session.finish("failed", (err as Error)?.message ?? String(err));
    return toResult(session, session.messages.filter((m) => m.role === "assistant").length);
  }
}

/** 单次 LLM 调用：外层 signal 与超时合并为单个 AbortSignal */
async function callLlm(  input: AgentRunInput,
  session: AgentSession,
  tools: ReturnType<ToolRegistry["getDefinitions"]>,
  timeoutMs: number
): Promise<{ content: string; toolCalls: import("../llm/types.js").ToolCall[]; usage?: TokenUsage }> {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const signal = input.signal
    ? mergeSignals(input.signal, timeoutSignal)
    : timeoutSignal;

  return llmService.chat({
    modelId: input.modelId,
    messages: session.messages,
    tools,
    temperature: 0.2,
    signal,
  });
}

/** 权限门 + 工具执行 */
async function executeWithPermission(
  tc: import("../llm/types.js").ToolCall,
  permission: ToolPermission,
  sandboxRoot: string,
  input: AgentRunInput,
  approvalHandler: import("./types.js").ApprovalHandler,
  registry: ToolRegistry = toolRegistry
): Promise<import("./types.js").ToolResult> {
  const execute = () => registry.executeTool(tc.name, tc.arguments, { sandboxRoot });

  switch (permission) {
    case "allow":
      return execute();
    case "ask":
      return approvalHandler(
        { toolCall: tc, sandboxRoot, permission, modelId: input.modelId, task: input.task },
        execute
      );
    case "deny":
    default:
      return {
        ok: false,
        output: `Tool ${tc.name} is denied by the permission policy.`,
      };
  }
}

function mergeSignals(...signals: AbortSignal[]): AbortSignal {
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any(signals);
  }
  // Node <20.3 回退：手动监听
  const controller = new AbortController();
  for (const s of signals) {
    if (s.aborted) {
      controller.abort();
      return controller.signal;
    }
    s.addEventListener("abort", () => controller.abort(), { once: true });
  }
  return controller.signal;
}

function isAbortError(err: unknown): boolean {
  const name = (err as Error)?.name;
  return name === "AbortError" || name === "TimeoutError" || name === "AbortSignalError";
}

function toResult(session: AgentSession, iterations: number): AgentResult {
  const lastAssistant = [...session.messages].reverse().find((m) => m.role === "assistant" && m.content);
  return {
    state: session.toState(),
    status: session.status,
    result: lastAssistant?.content ?? "",
    iterations,
    toolCalls: session.toolHistory.length,
    tokens: session.tokenUsed,
    usageByIteration: session.usageHistory,
  };
}
