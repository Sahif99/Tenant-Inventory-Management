import { getLowStockItems } from "../services/inventoryAlert.service.js";
import { success, error } from "../utils/response.js";

export const getLowStockAlerts = async (req, res) => {
  try {
    // console.log("tenantId", req.tenantId);

    const alerts = await getLowStockItems(req.tenantId);
    return success(res, alerts);
  } catch (err) {
    return error(res, err.message);
  }
};
