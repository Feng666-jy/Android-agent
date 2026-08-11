/**
 * V2 路由聚合
 */
import { Router } from "express";
import agentV2Routes from "./agent.routes.js";

const router = Router();
router.use("/agent", agentV2Routes);
export default router;
