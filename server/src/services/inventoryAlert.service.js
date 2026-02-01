import Product from "../models/Product.model.js";
import { getPendingPOQty } from "./lowStock.service.js";

export const getLowStockItems = async (tenantId) => {
  const products = await Product.find({
    tenantId,
    isActive: true,
  });

  const pendingMap = await getPendingPOQty(tenantId);

  // console.log("keys", [...pendingMap.keys()]);
  const alerts = [];

  for (const product of products) {
    for (const variant of product.variants) {
      const key = `${product._id}_${variant._id}`;
      const pendingQty = pendingMap.get(key) || 0;
      // console.log("key", key, "pending", pendingQty);
      const effectiveStock = variant.stock + pendingQty;

      if (variant.stock < variant.reorderLevel) {
        alerts.push({
          productId: product._id,
          productName: product.name,
          variantId: variant._id,
          sku: variant.sku,
          stock: variant.stock,
          pendingQty,
          reorderLevel: variant.reorderLevel,
          effectiveStock,
        });
      }
    }
  }

  return alerts;
};