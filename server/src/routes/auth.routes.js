import express from "express";
import { registerTenant, login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerTenant);
router.post("/login", login);

export default router;
