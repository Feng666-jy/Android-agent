import type { Request, Response, NextFunction } from "express";
import { providerService, ProviderValidationError, ProviderNotFoundError, ProviderOperationError } from "../services/provider.service.js";
import { success, fail, notFound } from "../utils/response.js";

/**
 * Provider Controller — 薄控制器模式
 * 只负责 HTTP 解析/返回，业务逻辑全在 service 层
 */
export const providerController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerService.createProvider(req.body);
      success(res, provider, "Provider created successfully", 201);
    } catch (error) {
      if (error instanceof ProviderValidationError) {
        fail(res, error.message, 1001);
      } else {
        next(error);
      }
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeDisabled = req.query.include_disabled === "true";
      const providers = await providerService.getProviders(includeDisabled);
      success(res, providers);
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerService.getProvider(req.params.id);
      success(res, provider);
    } catch (error) {
      if (error instanceof ProviderNotFoundError) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerService.updateProvider(req.params.id, req.body);
      success(res, provider, "Provider updated successfully");
    } catch (error) {
      if (error instanceof ProviderNotFoundError) {
        notFound(res, error.message);
      } else if (error instanceof ProviderValidationError) {
        fail(res, error.message, 1001);
      } else {
        next(error);
      }
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await providerService.deleteProvider(req.params.id);
      success(res, null, "Provider deleted successfully");
    } catch (error) {
      if (error instanceof ProviderNotFoundError) {
        notFound(res, error.message);
      } else if (error instanceof ProviderOperationError) {
        fail(res, error.message, 1004);
      } else {
        next(error);
      }
    }
  },

  async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await providerService.healthCheck(req.params.id);
      success(res, result);
    } catch (error) {
      if (error instanceof ProviderNotFoundError) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  },

  async healthCheckAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const results = await providerService.healthCheckAll();
      const data = Array.from(results.entries()).map(([providerId, result]) => ({
        providerId,
        ...result,
      }));
      success(res, data);
    } catch (error) {
      next(error);
    }
  },

  /** POST /providers/:id/discover — 从上游获取模型候选列表 */
  async discover(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await providerService.discoverModels(req.params.id);
      success(res, result);
    } catch (error) {
      if (error instanceof ProviderNotFoundError) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  },

  /** POST /providers/:id/models/import — 批量导入选中的上游模型 */
  async importModels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { modelNames } = req.body;
      if (!Array.isArray(modelNames)) {
        fail(res, "modelNames must be an array", 1001);
        return;
      }
      const result = await providerService.importModels(req.params.id, modelNames);
      success(res, result);
    } catch (error) {
      if (error instanceof ProviderNotFoundError) {
        notFound(res, error.message);
      } else if (error instanceof ProviderValidationError) {
        fail(res, error.message, 1001);
      } else {
        next(error);
      }
    }
  },

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { providerIds } = req.body;
      if (!Array.isArray(providerIds)) {
        fail(res, "providerIds must be an array", 1001);
        return;
      }
      await providerService.reorder(providerIds);
      success(res, null, "Providers reordered successfully");
    } catch (error) {
      next(error);
    }
  },
};