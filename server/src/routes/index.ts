import { Router } from "express";
import authRoutes from "./auth.routes.js";
import modelsRoutes from "./models.routes.js";
import providerRoutes from "./provider.routes.js";
import chatRoutes from "./chat.routes.js";
import agentRoutes from "./agent.routes.js";

const router = Router();

router.use("/user", authRoutes);
router.use("/models", modelsRoutes);
router.use("/providers", providerRoutes);
router.use("/chat", chatRoutes);
router.use("/agent", agentRoutes);

export default router;