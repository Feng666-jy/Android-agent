import request from "@/utils/request";
import type { ApiResponse, AiModel } from "@/types";

// ---- Legacy per-provider listing (used by ModelSelector) ----

export const modelsAPI = {
  getDeepSeekModels(): Promise<ApiResponse<AiModel[]>> {
    return request.get("/models/deepseek");
  },

  getClaudeModels(): Promise<ApiResponse<AiModel[]>> {
    return request.get("/models/claude");
  },

  getChatGPTModels(): Promise<ApiResponse<AiModel[]>> {
    return request.get("/models/chatgpt");
  },
};

// ---- Model management ----

export interface ModelListParams {
  search?: string;
  providerId?: string;
  groupId?: string | null;
  isFavorite?: boolean;
  sort?: "default" | "name" | "created" | "usage" | "favorite";
  page?: number;
  pageSize?: number;
}

export interface ModelListResult {
  models: AiModel[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ModelGroup {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder: number;
  isPinned: boolean;
  _count?: { models: number };
}

export const modelManageAPI = {
  /** GET /models — list with search/sort/filter/pagination */
  list(params?: ModelListParams): Promise<ApiResponse<ModelListResult>> {
    return request.get("/models", { params });
  },

  /** POST /models/search — convenience search */
  search(q: string): Promise<ApiResponse<ModelListResult>> {
    return request.post("/models/search", { q });
  },

  /** POST /models/:id/favorite — toggle favorite */
  toggleFavorite(id: string): Promise<ApiResponse<AiModel>> {
    return request.post(`/models/${id}/favorite`);
  },

  /** POST /models/:id/default — set as default */
  setDefault(id: string): Promise<ApiResponse<AiModel>> {
    return request.post(`/models/${id}/default`);
  },

  /** POST /models/move — move models to a group */
  moveToGroup(modelIds: string[], groupId: string | null): Promise<ApiResponse<{ updated: number }>> {
    return request.post("/models/move", { modelIds, groupId });
  },

  // ---- Group management ----

  /** GET /models/groups — list all groups */
  listGroups(): Promise<ApiResponse<ModelGroup[]>> {
    return request.get("/models/groups");
  },

  /** POST /models/groups — create a group */
  createGroup(data: { name: string; description?: string; icon?: string; color?: string }): Promise<ApiResponse<ModelGroup>> {
    return request.post("/models/groups", data);
  },

  /** DELETE /models/groups/:id — delete a group */
  deleteGroup(id: string): Promise<ApiResponse<null>> {
    return request.delete(`/models/groups/${id}`);
  },
};