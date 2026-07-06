import { Router } from "express";
import authRoutes from "./auth.routes.js";
import modelsRoutes from "./models.routes.js";

const router = Router();

router.use("/user", authRoutes);
router.use("/models", modelsRoutes);

export default router;