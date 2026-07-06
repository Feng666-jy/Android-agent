import { Router } from "express";
import { prisma } from "../prisma.js";
import { logger } from "../utils/logger.js";

const router = Router();

router.get("/deepseek", async (_req, res) => {
  try {
    const models = await prisma.deepseekModel.findMany({
      where: { status: 1 },
      orderBy: { sort: "asc" }
    });
    res.json({ code: 0, message: "成功", data: models });
  } catch (error) {
    logger.error("getDeepSeekModels error:", error instanceof Error ? error.message : error);
    res.status(500).json({ code: -1, message: error instanceof Error ? error.message : "服务器错误", data: null });
  }
});

router.get("/claude", async (_req, res) => {
  try {
    const models = await prisma.claudeModel.findMany({
      where: { status: 1 },
      orderBy: { sort: "asc" }
    });
    res.json({ code: 0, message: "成功", data: models });
  } catch (error) {
    logger.error("getClaudeModels error:", error instanceof Error ? error.message : error);
    res.status(500).json({ code: -1, message: error instanceof Error ? error.message : "服务器错误", data: null });
  }
});

router.get("/chatgpt", async (_req, res) => {
  try {
    const models = await prisma.chatgptModel.findMany({
      where: { status: 1 },
      orderBy: { sort: "asc" }
    });
    res.json({ code: 0, message: "成功", data: models });
  } catch (error) {
    logger.error("getChatGPTModels error:", error instanceof Error ? error.message : error);
    res.status(500).json({ code: -1, message: error instanceof Error ? error.message : "服务器错误", data: null });
  }
});

export default router;