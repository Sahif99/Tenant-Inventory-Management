import express from "express";
import { createSupplier, getSuppliers } from "../controllers/supplier.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.post("/", roleMiddleware(["OWNER", "MANAGER"]), createSupplier);
router.get("/", getSuppliers);

export default router;
