import {
  createOrderTransaction,
  cancelOrderTransaction,
} from "../services/order.service.js";
import { success, error } from "../utils/response.js";
import Order from "../models/Order.model.js";

export const createOrder = async (req, res) => {
  try {
    const order = await createOrderTransaction({
      tenantId: req.tenantId,
      items: req.body.items,
      userId: req.user.userId,
    });

    const io = req.app.get("io");
    io.to(req.tenantId).emit("order:created", order);

    return success(res, order, "Order placed");
  } catch (err) {
    return error(res, err.message);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await cancelOrderTransaction({
      tenantId: req.tenantId,
      orderId: req.params.id,
      userId: req.user.userId,
    });

    const io = req.app.get("io");
    io.to(req.tenantId).emit("order:cancelled", order);

    return success(res, order, "Order cancelled");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });

    return success(res, orders);
  } catch (err) {
    return error(res, err.message);
  }
};
