import { Router } from "express";
import { agentController, agentRunSchema } from "../controllers/agent.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// 需要认证
router.use(authMiddleware);

router.post("/run", validate(agentRunSchema), agentController.run);

// 审批轮询（run 进行中）
router.get("/runs/:runId/approvals", agentController.pendingApprovals);
router.post("/approvals/:id/approve", agentController.approve);
router.post("/approvals/:id/reject", agentController.reject);

// 历史会话
router.get("/runs", agentController.history);
router.get("/runs/:id", agentController.detail);
router.delete("/runs/:id", agentController.remove);
router.post("/runs/batch-delete", agentController.batchDelete);

export default router;
