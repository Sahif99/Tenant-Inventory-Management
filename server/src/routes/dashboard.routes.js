import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);
router.get("/all", getDashboardData);

export default router;
