import { prisma } from "../prisma.js";
import { logger } from "../utils/logger.js";

/**
 * Provider Service — 深度模块
 * 
 * 设计原则（codebase-design）：
 * - 小接口：create / get / update / delete / healthCheck
 * - 大量实现：内部封装验证、排序、级联逻辑
 * - Seam：Provider ↔ Model 边界清晰
 */

// ---- 类型定义 ----

export interface CreateProviderInput {
  name: string;
  baseUrl: string;
  protocol?: string;
  authType?: string;
  apiKeyEncrypted?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProviderInput {
  name?: string;
  baseUrl?: string;
  protocol?: string;
  authType?: string;
  apiKeyEncrypted?: string;
  isEnabled?: boolean;
  healthStatus?: string;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
}

export interface ProviderHealthResult {
  status: "HEALTHY" | "DEGRADED" | "UNREACHABLE" | "UNKNOWN";
  latencyMs: number;
  errorMessage?: string;
}

export interface DiscoveredModel {
  modelName: string;
  displayName: string;
  exists: boolean;
}

export interface DiscoveryResult {
  models: DiscoveredModel[];
  error?: string;
  httpStatus?: number;
}

export interface ImportResult {
  created: number;
  skipped: number;
  models: any[];
}

// ---- 验证函数 ----

/**
 * 按协议解析上游模型列表响应，归一为模型名数组。
 */
function parseDiscoveryNames(protocol: string, body: Record<string, any>): string[] {
  switch (protocol) {
    case "OLLAMA": {
      const list = body?.models;
      if (!Array.isArray(list)) return [];
      return list.map((m: any) => m?.name).filter((n: unknown): n is string => typeof n === "string");
    }
    case "GOOGLE_GEMINI": {
      const list = body?.models;
      if (!Array.isArray(list)) return [];
      return list
        .map((m: any) => m?.name)
        .filter((n: unknown): n is string => typeof n === "string")
        .map((name: string) => name.replace(/^models\//, ""));
    }
    case "ANTHROPIC": {
      const list = body?.data;
      if (!Array.isArray(list)) return [];
      return list.map((m: any) => m?.id).filter((n: unknown): n is string => typeof n === "string");
    }
    default: {
      // OPENAI_COMPATIBLE 及兼容端点
      const list = body?.data;
      if (!Array.isArray(list)) return [];
      return list.map((m: any) => m?.id).filter((n: unknown): n is string => typeof n === "string");
    }
  }
}

function validateProviderInput(input: CreateProviderInput): void {
  if (!input.name?.trim()) {
    throw new ProviderValidationError("Provider name is required");
  }
  if (!input.baseUrl?.trim()) {
    throw new ProviderValidationError("Base URL is required");
  }
  try {
    new URL(input.baseUrl);
  } catch {
    throw new ProviderValidationError(`Invalid base URL: ${input.baseUrl}`);
  }
}

// ---- 错误类 ----

class ProviderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderValidationError";
  }
}

class ProviderNotFoundError extends Error {
  constructor(id: string) {
    super(`Provider not found: ${id}`);
    this.name = "ProviderNotFoundError";
  }
}

class ProviderOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderOperationError";
  }
}

// ---- 核心服务函数 ----

export const providerService = {
  /**
   * 创建 Provider
   * 自动分配 sortOrder（当前最大值 + 1）
   */
  async createProvider(input: CreateProviderInput): Promise<any> {
    validateProviderInput(input);

    const maxOrder = await prisma.provider.aggregate({
      _max: { sortOrder: true },
    });

    const provider = await prisma.provider.create({
      data: {
        name: input.name.trim(),
        baseUrl: input.baseUrl.trim(),
        protocol: input.protocol ?? "OPENAI_COMPATIBLE",
        authType: input.authType ?? "API_KEY",
        apiKeyEncrypted: input.apiKeyEncrypted,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        healthStatus: "UNKNOWN",
        isEnabled: true,
      },
    });

    logger.info(`Provider created: ${provider.name} (${provider.id})`);
    return provider;
  },

  /**
   * 获取 Provider 列表
   * 默认只返回 enabled，按 sortOrder 排序
   */
  async getProviders(includeDisabled = false): Promise<any[]> {
    const providers = await prisma.provider.findMany({
      where: includeDisabled ? {} : { isEnabled: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { models: true } } },
    });

    return providers;
  },

  /**
   * 获取单个 Provider
   */
  async getProvider(id: string): Promise<any> {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: { models: { where: { isEnabled: true } } },
    });

    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    return provider;
  },

  /**
   * 更新 Provider
   */
  async updateProvider(id: string, input: UpdateProviderInput): Promise<any> {
    const existing = await prisma.provider.findUnique({ where: { id } });
    if (!existing) {
      throw new ProviderNotFoundError(id);
    }

    // 如果修改了 baseUrl，验证格式
    if (input.baseUrl) {
      try {
        new URL(input.baseUrl);
      } catch {
        throw new ProviderValidationError(`Invalid base URL: ${input.baseUrl}`);
      }
    }

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.baseUrl !== undefined && { baseUrl: input.baseUrl.trim() }),
        ...(input.protocol !== undefined && { protocol: input.protocol }),
        ...(input.authType !== undefined && { authType: input.authType }),
        ...(input.apiKeyEncrypted !== undefined && { apiKeyEncrypted: input.apiKeyEncrypted }),
        ...(input.isEnabled !== undefined && { isEnabled: input.isEnabled }),
        ...(input.healthStatus !== undefined && { healthStatus: input.healthStatus }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.metadata !== undefined && { metadata: JSON.stringify(input.metadata) }),
      },
    });

    logger.info(`Provider updated: ${provider.name} (${provider.id})`);
    return provider;
  },

  /**
   * 删除 Provider
   * 内置 Provider 不可删除
   * 级联删除其下所有 Model
   */
  async deleteProvider(id: string): Promise<void> {
    const existing = await prisma.provider.findUnique({ where: { id } });
    if (!existing) {
      throw new ProviderNotFoundError(id);
    }
    if (existing.isBuiltin) {
      throw new ProviderOperationError("Cannot delete built-in provider");
    }

    await prisma.provider.delete({ where: { id } });
    logger.info(`Provider deleted: ${existing.name} (${id})`);
  },

  /**
   * 健康检查
   * 发送 HTTP GET 到 /v1/models 或 /models
   * 更新 healthStatus 和 lastCheckedAt
   */
  async healthCheck(id: string): Promise<ProviderHealthResult> {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    const start = Date.now();
    let result: ProviderHealthResult;

    try {
      const healthUrl = `${provider.baseUrl.replace(/\/$/, "")}/models`;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (provider.authType === "API_KEY" && provider.apiKeyEncrypted) {
        headers.Authorization = `Bearer ${provider.apiKeyEncrypted}`;
      }
      const response = await fetch(healthUrl, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(5000),
      });

      const latencyMs = Date.now() - start;

      if (response.ok) {
        result = { status: "HEALTHY", latencyMs };
      } else if (response.status >= 500) {
        result = { status: "DEGRADED", latencyMs, errorMessage: `HTTP ${response.status}` };
      } else {
        result = { status: "DEGRADED", latencyMs, errorMessage: `HTTP ${response.status}` };
      }
    } catch (error) {
      const latencyMs = Date.now() - start;
      result = {
        status: "UNREACHABLE",
        latencyMs,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // 更新数据库
    await prisma.provider.update({
      where: { id },
      data: {
        healthStatus: result.status,
        lastCheckedAt: new Date(),
      },
    });

    // 记录健康日志
    await prisma.providerHealthLog.create({
      data: {
        providerId: id,
        status: result.status,
        latencyMs: result.latencyMs,
        errorMessage: result.errorMessage,
        checkedAt: new Date(),
      },
    });

    logger.info(`Health check ${provider.name}: ${result.status} (${result.latencyMs}ms)`);
    return result;
  },

  /**
   * 对所有 enabled Provider 执行健康检查
   */
  async healthCheckAll(): Promise<Map<string, ProviderHealthResult>> {
    const providers = await prisma.provider.findMany({
      where: { isEnabled: true },
    });

    const results = new Map<string, ProviderHealthResult>();

    // 并发检查，但限制并发数为 3
    const concurrency = 3;
    for (let i = 0; i < providers.length; i += concurrency) {
      const batch = providers.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(async (p) => {
          try {
            const result = await this.healthCheck(p.id);
            return [p.id, result] as const;
          } catch {
            return [p.id, { status: "UNREACHABLE" as const, latencyMs: 0 }] as const;
          }
        })
      );
      batchResults.forEach(([id, result]) => results.set(id, result));
    }

    return results;
  },

  /**
   * 模型发现（Discovery）
   * 从上游 `GET {baseUrl}/models` 拉取模型候选列表，按协议解析，并标注已存在项。
   */
  async discoverModels(id: string): Promise<DiscoveryResult> {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    const baseUrl = provider.baseUrl.replace(/\/$/, "");
    const protocol = provider.protocol ?? "OPENAI_COMPATIBLE";

    // 各协议模型列表端点
    let url: string;
    if (protocol === "OLLAMA") {
      url = `${baseUrl}/api/tags`;
    } else {
      url = `${baseUrl}/models`;
    }

    // 认证：GET 端点不支持自定义 headers，按协议拼接
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (protocol === "GOOGLE_GEMINI" && provider.apiKeyEncrypted) {
      url += `${url.includes("?") ? "&" : "?"}key=${encodeURIComponent(provider.apiKeyEncrypted)}`;
    } else if (provider.authType === "API_KEY" && provider.apiKeyEncrypted) {
      headers.Authorization = `Bearer ${provider.apiKeyEncrypted}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        return {
          models: [],
          error: `HTTP ${response.status}`,
          httpStatus: response.status,
        };
      }

      const body = (await response.json()) as Record<string, any>;
      const rawNames = parseDiscoveryNames(protocol, body);

      const existing = await prisma.model.findMany({
        where: { providerId: id },
        select: { modelName: true },
      });
      const existingSet = new Set(existing.map((m) => m.modelName));

      const models = rawNames
        .filter((name: string): name is string => Boolean(name?.trim()))
        .map((name: string) => ({
          modelName: name,
          displayName: name,
          exists: existingSet.has(name),
        }));

      return { models };
    } catch (error) {
      return {
        models: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * 批量导入模型（Discovery → Import）
   * 跳过已存在的模型（providerId + modelName 唯一），返回导入结果。
   */
  async importModels(id: string, modelNames: string[]): Promise<ImportResult> {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    const names = [...new Set(modelNames.map((n) => n.trim()).filter(Boolean))];
    if (names.length === 0) {
      throw new ProviderValidationError("No model names provided");
    }

    const existing = await prisma.model.findMany({
      where: { providerId: id },
      select: { modelName: true },
    });
    const existingSet = new Set(existing.map((m) => m.modelName));

    const created: any[] = [];
    let skipped = 0;
    for (const name of names) {
      if (existingSet.has(name)) {
        skipped++;
        continue;
      }
      const model = await prisma.model.create({
        data: {
          providerId: id,
          modelName: name,
          displayName: name,
          capabilities: JSON.stringify(["TEXT"]),
          isEnabled: true,
        },
      });
      created.push(model);
      existingSet.add(name);
    }

    logger.info(`Import models: provider=${provider.name} created=${created.length} skipped=${skipped}`);
    return { created: created.length, skipped, models: created };
  },

  /**
   * 重新排序 Provider
   */
  async reorder(providerIds: string[]): Promise<void> {
    await prisma.$transaction(
      providerIds.map((id, index) =>
        prisma.provider.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    logger.info(`Providers reordered: ${providerIds.length} items`);
  },
};

export { ProviderValidationError, ProviderNotFoundError, ProviderOperationError };