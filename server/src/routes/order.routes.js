import express from "express";
import {
  createOrder,
  cancelOrder,
  getOrders,
} from "../controllers/order.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.post("/create", roleMiddleware(["OWNER", "MANAGER", "STAFF"]), createOrder);
router.get("/", roleMiddleware(["OWNER", "MANAGER"]), getOrders);
router.post("/:id/cancel", roleMiddleware(["OWNER", "MANAGER"]), cancelOrder);

export default router;
