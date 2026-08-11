/**
 * 每张表的 camelCase ↔ snake_case 字段映射 + 布尔列 + 关系定义。
 * JS 层（服务/控制器）使用 camelCase，DB 层使用列名。
 */

export interface TableConfig {
  table: string;
  /** camelCase 字段名 -> 数据库列名 */
  fields: Record<string, string>;
  /** 需要 0/1 <-> boolean 互转的列（camelCase 名） */
  booleans: string[];
  /** 是否自增主键（users 用 AUTOINCREMENT，其余用 randomUUID） */
  autoId?: boolean;
}

export interface RelationConfig {
  /** 关联表 */
  table: string;
  /** 父表侧字段（camelCase）：单行关系存 FK 的列，集合关系是父主键 */
  parentCol: string;
  /** 子表侧字段（camelCase）：单行关系是子表主键，集合关系是子表 FK */
  childCol: string;
  /** 单行（group/usageStats）还是集合（models） */
  singular?: boolean;
}

export const TABLES: Record<string, TableConfig> = {
  user: {
    table: "users",
    fields: {
      id: "id",
      username: "username",
      password: "password",
      email: "email",
      avatar: "avatar",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    booleans: [],
    autoId: true,
  },
  provider: {
    table: "providers",
    fields: {
      id: "id",
      name: "name",
      baseUrl: "base_url",
      protocol: "protocol",
      authType: "authType",
      apiKeyEncrypted: "api_key_encrypted",
      isEnabled: "is_enabled",
      healthStatus: "healthStatus",
      lastCheckedAt: "last_checked_at",
      sortOrder: "sort_order",
      isBuiltin: "is_builtin",
      metadata: "metadata",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    booleans: ["isEnabled", "isBuiltin"],
  },
  model: {
    table: "models",
    fields: {
      id: "id",
      providerId: "provider_id",
      modelName: "model_name",
      displayName: "display_name",
      aliases: "aliases",
      description: "description",
      isFavorite: "is_favorite",
      sortOrder: "sort_order",
      isDefault: "is_default",
      contextWindow: "context_window",
      maxOutputTokens: "max_output_tokens",
      autoCompactThreshold: "auto_compact_threshold",
      effectivePercent: "effective_percent",
      temperature: "temperature",
      topP: "top_p",
      frequencyPenalty: "frequency_penalty",
      presencePenalty: "presence_penalty",
      capabilities: "capabilities",
      reasoningBudget: "reasoning_budget",
      promptTemplate: "prompt_template",
      customHeaders: "custom_headers",
      customParams: "custom_params",
      groupId: "group_id",
      tags: "tags",
      isEnabled: "is_enabled",
      metadata: "metadata",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    booleans: ["isFavorite", "isDefault", "isEnabled"],
  },
  modelGroup: {
    table: "model_groups",
    fields: {
      id: "id",
      name: "name",
      description: "description",
      icon: "icon",
      color: "color",
      sortOrder: "sort_order",
      isPinned: "is_pinned",
      isBuiltin: "is_builtin",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    booleans: ["isPinned", "isBuiltin"],
  },
  usageStats: {
    table: "usage_stats",
    fields: {
      id: "id",
      modelId: "model_id",
      totalRequests: "total_requests",
      totalTokensInput: "total_tokens_input",
      totalTokensOutput: "total_tokens_output",
      totalTokensCached: "total_tokens_cached",
      totalErrors: "total_errors",
      lastUsedAt: "last_used_at",
      averageLatencyMs: "average_latency_ms",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    booleans: [],
  },
  providerHealthLog: {
    table: "provider_health_logs",
    fields: {
      id: "id",
      providerId: "provider_id",
      status: "status",
      latencyMs: "latency_ms",
      errorMessage: "error_message",
      checkedAt: "checked_at",
    },
    booleans: [],
  },
  agentRun: {
    table: "agent_runs",
    fields: {
      id: "id",
      userId: "user_id",
      status: "status",
      task: "task",
      modelId: "model_id",
      sandboxRoot: "sandbox_root",
      iterations: "iterations",
      toolCallCount: "tool_call_count",
      result: "result",
      error: "error",
      tokenInput: "token_input",
      tokenOutput: "token_output",
      tokenTotal: "token_total",
      createdAt: "created_at",
      finishedAt: "finished_at",
    },
    booleans: [],
  },
  agentMessage: {
    table: "agent_messages",
    fields: {
      id: "id",
      runId: "run_id",
      role: "role",
      content: "content",
      toolCallId: "tool_call_id",
      toolCallsJson: "tool_calls_json",
      createdAt: "created_at",
    },
    booleans: [],
  },
  agentToolCall: {
    table: "agent_tool_calls",
    fields: {
      id: "id",
      runId: "run_id",
      toolCallId: "tool_call_id",
      name: "name",
      argumentsJson: "arguments_json",
      ok: "ok",
      output: "output",
      durationMs: "duration_ms",
      createdAt: "created_at",
    },
    booleans: ["ok"],
  },
  agentTokenUsage: {
    table: "agent_token_usages",
    fields: {
      id: "id",
      runId: "run_id",
      turnId: "turn_id",
      inputTokens: "input_tokens",
      outputTokens: "output_tokens",
      cachedTokens: "cached_tokens",
      totalTokens: "total_tokens",
      createdAt: "created_at",
    },
    booleans: [],
  },
};

export const RELATIONS: Record<string, Record<string, RelationConfig>> = {
  model: {
    group: {
      table: "modelGroup",
      parentCol: "groupId",
      childCol: "id",
      singular: true,
    },
    usageStats: {
      table: "usageStats",
      parentCol: "id",
      childCol: "modelId",
      singular: true,
    },
  },
  provider: {
    models: {
      table: "model",
      parentCol: "id",
      childCol: "providerId",
      singular: false,
    },
  },
  modelGroup: {
    models: {
      table: "model",
      parentCol: "id",
      childCol: "groupId",
      singular: false,
    },
  },
  agentRun: {
    messages: {
      table: "agentMessage",
      parentCol: "id",
      childCol: "runId",
      singular: false,
    },
    toolCalls: {
      table: "agentToolCall",
      parentCol: "id",
      childCol: "runId",
      singular: false,
    },
    tokenEvents: {
      table: "agentTokenUsage",
      parentCol: "id",
      childCol: "runId",
      singular: false,
    },
  },
};
