import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.get("/all", roleMiddleware(["OWNER", "MANAGER"]), getUsers);

router.post("/create", roleMiddleware(["OWNER", "MANAGER"]), createUser);

export default router;
