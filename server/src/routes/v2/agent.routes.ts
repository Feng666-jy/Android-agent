/**
 * Agent V2 路由 — /api/v2/agent/*
 *
 * 与 v1（/api/agent/*）并存：v1 同步长任务保持不变，v2 为异步 + SSE 事件流。
 * SSE 事件端点用 authQueryMiddleware（EventSource 无法携带 Authorization header）。
 */

import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { authQueryMiddleware } from "../../middleware/auth-query.js";
import { validate } from "../../middleware/validate.js";
import { agentRunV2Schema, agentV2Controller } from "../../controllers/agent-v2.controller.js";

const router = Router();

router.post("/runs", authMiddleware, validate(agentRunV2Schema), agentV2Controller.createRun);
router.get("/runs", authMiddleware, agentV2Controller.history);
router.get("/runs/:runId", authMiddleware, agentV2Controller.getRun);
router.get("/runs/:runId/events", authQueryMiddleware, agentV2Controller.events);
router.post("/runs/:runId/pause", authMiddleware, agentV2Controller.pause);
router.post("/runs/:runId/resume", authMiddleware, agentV2Controller.resume);
router.post("/runs/:runId/cancel", authMiddleware, agentV2Controller.cancel);
router.get("/runs/:runId/approvals", authMiddleware, agentV2Controller.approvals);
router.post("/approvals/:id/approve", authMiddleware, agentV2Controller.approve);
router.post("/approvals/:id/reject", authMiddleware, agentV2Controller.reject);

export default router;
