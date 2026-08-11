import { Router } from "express";
import { providerController } from "../controllers/provider.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// 所有 Provider 路由需要认证
router.use(authMiddleware);

router.get("/", providerController.getAll);
router.get("/health-check-all", providerController.healthCheckAll);
router.post("/", providerController.create);
router.get("/:id", providerController.getOne);
router.put("/:id", providerController.update);
router.delete("/:id", providerController.delete);
router.post("/:id/health-check", providerController.healthCheck);
router.post("/:id/discover", providerController.discover);
router.post("/:id/models/import", providerController.importModels);
router.post("/reorder", providerController.reorder);

export default router;