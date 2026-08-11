import request from "@/utils/request";
import type { ApiResponse, AuthResult, LoginForm, RegisterForm, UserInfo } from "@/types";

export const userAPI = {
  login(data: LoginForm): Promise<ApiResponse<AuthResult>> {
    return request.post("/user/login", data);
  },

  register(data: RegisterForm): Promise<ApiResponse<AuthResult>> {
    return request.post("/user/register", data);
  },

  getInfo(): Promise<ApiResponse<UserInfo>> {
    return request.get("/user/info");
  },

  updateProfile(data: { email?: string; avatar?: string }): Promise<ApiResponse<UserInfo>> {
    return request.put("/user/profile", data);
  },
};

// ---- Provider API ----

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  protocol: string;
  authType: string;
  isEnabled: boolean;
  healthStatus: string;
  lastCheckedAt: string | null;
  sortOrder: number;
  isBuiltin: boolean;
  hasApiKey: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { models: number };
}

export interface CreateProviderDTO {
  name: string;
  baseUrl: string;
  protocol?: string;
  authType?: string;
  apiKeyEncrypted?: string;
}

export interface UpdateProviderDTO {
  name?: string;
  baseUrl?: string;
  protocol?: string;
  authType?: string;
  isEnabled?: boolean;
  sortOrder?: number;
  apiKeyEncrypted?: string;
}

export const providerAPI = {
  getAll(includeDisabled = false): Promise<ApiResponse<Provider[]>> {
    return request.get(`/providers?include_disabled=${includeDisabled}`);
  },

  getById(id: string): Promise<ApiResponse<Provider>> {
    return request.get(`/providers/${id}`);
  },

  create(data: CreateProviderDTO): Promise<ApiResponse<Provider>> {
    return request.post("/providers", data);
  },

  update(id: string, data: UpdateProviderDTO): Promise<ApiResponse<Provider>> {
    return request.put(`/providers/${id}`, data);
  },

  remove(id: string): Promise<ApiResponse<null>> {
    return request.delete(`/providers/${id}`);
  },

  healthCheck(id: string): Promise<ApiResponse<{
    status: string;
    latencyMs: number;
    errorMessage?: string;
  }>> {
    return request.post(`/providers/${id}/health-check`);
  },

  healthCheckAll(): Promise<ApiResponse<Array<{
    providerId: string;
    status: string;
    latencyMs: number;
    errorMessage?: string;
  }>>> {
    return request.get("/providers/health-check-all");
  },

  reorder(providerIds: string[]): Promise<ApiResponse<null>> {
    return request.post("/providers/reorder", { providerIds });
  },

  discover(id: string): Promise<ApiResponse<DiscoveryResult>> {
    return request.post(`/providers/${id}/discover`);
  },

  importModels(id: string, modelNames: string[]): Promise<ApiResponse<ImportResult>> {
    return request.post(`/providers/${id}/models/import`, { modelNames });
  },
};

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
  models: unknown[];
}