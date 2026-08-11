/**
 * Agent 权限模型 — allow / ask / deny
 *
 * 默认策略（只读安全）：
 *   - 全部工具默认 allow
 *   - write_file / edit_file 默认 ask（需审批或显式降级）
 *   - run_command 默认 deny（需显式启用）
 *
 * runAgent 在工具执行前统一过这里；ask 需外部注入 approvalHandler（HTTP 层暂不注入 → 拒绝）。
 */

import type {
  PermissionConfig,
  PermissionConfigInput,
  ToolPermission,
} from "./types.js";

export const DEFAULT_PERMISSIONS: PermissionConfig = {
  default: "allow",
  tools: {
    write_file: "ask",
    edit_file: "ask",
    run_command: "deny",
  },
};

const VALID: ToolPermission[] = ["allow", "ask", "deny"];

export function normalizePermissionConfig(input?: PermissionConfigInput): PermissionConfig {
  if (!input) return { ...DEFAULT_PERMISSIONS, tools: { ...DEFAULT_PERMISSIONS.tools } };
  const tools: Record<string, ToolPermission> = {};
  if (input.tools) {
    for (const [key, value] of Object.entries(input.tools)) {
      if (VALID.includes(value)) tools[key] = value;
    }
  }
  return {
    default: VALID.includes(input.default as ToolPermission) ? (input.default as ToolPermission) : DEFAULT_PERMISSIONS.default,
    tools: { ...DEFAULT_PERMISSIONS.tools, ...tools },
  };
}

/** 解析某个工具的实际权限：显式覆盖 > 工具默认 > 全局默认 */
export function resolvePermission(config: PermissionConfig, toolName: string): ToolPermission {
  return config.tools[toolName] ?? config.default;
}

/** 缺省审批处理器：无 UI 注入时拒绝 ask（并提示调用方） */
export function defaultDenyHandler(
  request: { toolCall: { name: string } },
  _execute: () => Promise<{ ok: boolean; output: string }>
): Promise<{ ok: boolean; output: string }> {
  return Promise.resolve({
    ok: false,
    output: `Tool ${request.toolCall.name} requires approval (permission: ask) but no approval handler is configured.`,
  });
}