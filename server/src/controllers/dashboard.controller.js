import {
  getInventoryValue,
  getTopSellers,
  getStockMovementTrend,
} from "../services/dashboard.service.js";

import { getLowStockItems } from "../services/inventoryAlert.service.js";
import { success, error } from "../utils/response.js";

export const getDashboardData = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const [
      inventoryValue,
      lowStockItems,
      topSellers,
      stockTrend,
    ] = await Promise.all([
      getInventoryValue(tenantId),
      getLowStockItems(tenantId),
      getTopSellers(tenantId),
      getStockMovementTrend(tenantId),
    ]);

    return success(res, {
      inventoryValue,
      lowStockCount: lowStockItems.length,
      topSellers,
      stockTrend,
    });
  } catch (err) {
    return error(res, err.message);
  }
};
