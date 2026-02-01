import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import stockRoutes from "./src/routes/stock.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import supplierRoutes from "./src/routes/supplier.routes.js";
import purchaseOrderRoutes from "./src/routes/purchaseOrder.routes.js";
import inventoryAlertRoutes from "./src/routes/inventoryAlert.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import userRoutes from "./src/routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/inventory", inventoryAlertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

export default app;
