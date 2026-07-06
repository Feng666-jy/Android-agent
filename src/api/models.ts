import request from "@/utils/request";
import type { ApiResponse, AiModel } from "@/types";

export const modelsAPI = {
  getDeepSeekModels(): Promise<ApiResponse<AiModel[]>> {
    return request.get("/models/deepseek");
  },

  getClaudeModels(): Promise<ApiResponse<AiModel[]>> {
    return request.get("/models/claude");
  },

  getChatGPTModels(): Promise<ApiResponse<AiModel[]>> {
    return request.get("/models/chatgpt");
  }
};