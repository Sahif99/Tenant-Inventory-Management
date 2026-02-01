import express from "express";
import { getLowStockAlerts } from "../controllers/inventoryAlert.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);
router.get("/low-stock", getLowStockAlerts);

export default router;
