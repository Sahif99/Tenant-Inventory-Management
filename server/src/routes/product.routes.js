import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.post("/", roleMiddleware(["OWNER", "MANAGER"]), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", roleMiddleware(["OWNER", "MANAGER"]), updateProduct);
router.delete("/:id", roleMiddleware(["OWNER"]), deleteProduct);

export default router;
