import { Router } from "express";
import { prisma } from "../prisma.js";
import { logger } from "../utils/logger.js";
import { modelController } from "../controllers/model.controller.js";

const router = Router();

// ---- Provider-specific listing (legacy, used by ModelSelector) ----

const PROVIDER_MODEL_MAP: Record<string, string> = {
  deepseek: "deepseek",
  claude: "claude",
  chatgpt: "chatgpt",
};

async function getModelsByProvider(provider: string) {
  const providerId = PROVIDER_MODEL_MAP[provider];
  if (!providerId) {
    return [];
  }

  const models = await prisma.model.findMany({
    where: {
      providerId: providerId,
      isEnabled: true,
    },
    orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
  });

  return models.map((m: any) => ({
    id: m.id,
    modelName: m.modelName,
    displayName: m.displayName,
    description: m.description,
    contextWindow: m.contextWindow,
    maxOutputTokens: m.maxOutputTokens,
    temperature: m.temperature,
    capabilities: m.capabilities ? JSON.parse(m.capabilities) : [],
    reasoningBudget: m.reasoningBudget,
    status: m.isEnabled ? 1 : 0,
    sort: m.sortOrder,
    createTime: m.createTime,
    updateTime: m.updateTime,
  }));
}

router.get("/deepseek", async (_req, res) => {
  try {
    const models = await getModelsByProvider("deepseek");
    res.json({ code: 0, message: "success", data: models });
  } catch (error) {
    logger.error("getDeepSeekModels error:", error instanceof Error ? error.message : error);
    res.status(500).json({ code: 5000, message: "Server error", data: null });
  }
});

router.get("/claude", async (_req, res) => {
  try {
    const models = await getModelsByProvider("claude");
    res.json({ code: 0, message: "success", data: models });
  } catch (error) {
    logger.error("getClaudeModels error:", error instanceof Error ? error.message : error);
    res.status(500).json({ code: 5000, message: "Server error", data: null });
  }
});

router.get("/chatgpt", async (_req, res) => {
  try {
    const models = await getModelsByProvider("chatgpt");
    res.json({ code: 0, message: "success", data: models });
  } catch (error) {
    logger.error("getChatGPTModels error:", error instanceof Error ? error.message : error);
    res.status(500).json({ code: 5000, message: "Server error", data: null });
  }
});

// ---- Model management endpoints ----

router.get("/", modelController.list);
router.post("/search", modelController.search);
router.post("/move", modelController.moveToGroup);
router.post("/:id/favorite", modelController.toggleFavorite);
router.post("/:id/default", modelController.setDefault);

// ---- Group management endpoints ----

router.get("/groups", modelController.listGroups);
router.post("/groups", modelController.createGroup);
router.delete("/groups/:id", modelController.deleteGroup);

export default router;