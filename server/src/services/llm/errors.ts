/**
 * LLM Adapter — 错误体系
 *
 * 与 docs/design/API.md 错误码约定对齐：
 * - LlmUnreachableError → 3000 Provider 不可达
 * - LlmAuthError         → 3001 Provider 认证失败
 * - LlmProviderError     → 3002 上游返回 4xx/5xx
 * - LlmValidationError   → 1001 参数错误（我方侧）
 */

export class LlmError extends Error {
  readonly code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = "LlmError";
    this.code = code;
  }
}

export class LlmUnreachableError extends LlmError {
  constructor(message: string) {
    super(message, 3000);
    this.name = "LlmUnreachableError";
  }
}

export class LlmAuthError extends LlmError {
  constructor(message: string) {
    super(message, 3001);
    this.name = "LlmAuthError";
  }
}

export class LlmProviderError extends LlmError {
  readonly status: number;
  readonly body?: string;
  constructor(message: string, status: number, body?: string) {
    super(message, 3002);
    this.name = "LlmProviderError";
    this.status = status;
    this.body = body;
  }
}

export class LlmValidationError extends LlmError {
  constructor(message: string) {
    super(message, 1001);
    this.name = "LlmValidationError";
  }
}

/** 将 HTTP 响应状态映射为对应 LlmError */
export function mapHttpError(status: number, body?: string): LlmError {
  const detail = body ? ` (${body.slice(0, 300)})` : "";
  if (status === 401 || status === 403) {
    return new LlmAuthError(`Provider authentication failed: HTTP ${status}${detail}`);
  }
  if (status >= 400) {
    return new LlmProviderError(`Provider returned HTTP ${status}${detail}`, status, body);
  }
  return new LlmProviderError(`Unexpected HTTP ${status}${detail}`, status, body);
}
