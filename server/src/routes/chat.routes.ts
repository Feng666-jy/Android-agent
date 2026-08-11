import { Router } from "express";
import { chatController, chatCompletionsSchema } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// 需要认证
router.use(authMiddleware);

router.post("/completions", validate(chatCompletionsSchema), chatController.completions);

export default router;
