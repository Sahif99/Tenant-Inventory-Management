import express from "express";
import {
  manualAdjustment,
  getStockLedger,
} from "../controllers/stock.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.post(
  "/adjust",
  roleMiddleware(["OWNER", "MANAGER"]),
  manualAdjustment
);

router.get("/ledger", getStockLedger);

export default router;
