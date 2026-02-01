import { adjustStock } from "../services/stock.service.js";
import { success, error } from "../utils/response.js";
import StockMovement from "../models/StockMovement.model.js";

export const manualAdjustment = async (req, res) => {
  try {
    const { productId, variantId, quantity, note } = req.body;

    const newStock = await adjustStock({
      tenantId: req.tenantId,
      productId,
      variantId,
      type: "ADJUSTMENT",
      quantity,
      reference: note,
      userId: req.user.userId,
    });

    const io = req.app.get("io");
    io.to(req.tenantId).emit("stock:update", {
      productId: req.body.productId,
      variantId: req.body.variantId,
      newStock,
    });

    return success(res, { newStock }, "Stock adjusted");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getStockLedger = async (req, res) => {
  try {
    const movements = await StockMovement.find({
      tenantId: req.tenantId,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return success(res, movements);
  } catch (err) {
    return error(res, err.message);
  }
};
