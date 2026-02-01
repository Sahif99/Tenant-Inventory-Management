import express from "express";
import { createPO, receivePO, getPOs, updatePOStatus } from "../controllers/purchaseOrder.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.post("/:id/receive", roleMiddleware(["OWNER", "MANAGER"]), receivePO);
router.put("/status/:id", roleMiddleware(["OWNER", "MANAGER"]), updatePOStatus);
router.post("/", roleMiddleware(["OWNER", "MANAGER"]), createPO);
router.get("/", roleMiddleware(["OWNER", "MANAGER"]), getPOs);



export default router;
